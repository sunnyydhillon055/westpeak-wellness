import { FALLBACK_CATALOG, money, type Catalog } from '@/lib/cliniko-catalog';
import { NOT_KEPT } from '@/lib/cliniko-invoice-detail';
import { isConsultAppointment } from '@/lib/booking-shape';
import { CONSULT_TYPE } from '@/lib/site';

/* WAS THIS APPOINTMENT PAID? — 3 Oct 2026. PURE: no fetch, no clock.
 *
 * WHY. The owner found an Individual Counselling appointment with no Cliniko
 * invoice and no Stripe charge, while the booking notice for every paid type
 * said "the card is taken by Cliniko at booking". That line was inferred from
 * the TYPE, and the type says what should be charged, never what was. The
 * site cannot create an appointment (test/no-appointment-writes.test.mts), so
 * such a booking was made inside Cliniko, by staff or with its payment step
 * skipped, and nothing here could see it.
 *
 * WHAT COUNTS. Cliniko's API has no payments endpoint (lib/cliniko-revenue.ts),
 * so paid means: an invoice LINKED TO THIS APPOINTMENT, not deleted or
 * archived, settled (closed, or status "Paid"), not refunded, credited, voided
 * or written off (NOT_KEPT, the revenue page's rule), for at least the type's
 * fee from lib/cliniko-catalog.ts. Less than the fee is not-received with
 * what did arrive. Anything that cannot be decided is `unknown` with the
 * reason, never paid. */

export type PaymentStatus =
  | { state: 'paid'; amountCents: number; invoiceNumber: string }
  | { state: 'not-received'; expectedCents: number; receivedCents: number; invoiceNumber?: string; invoiceStatus: string }
  | { state: 'free' }
  | { state: 'unknown'; reason: string };

/** The invoices read for an appointment, or why they could not be. */
export type InvoiceRead = { invoices: Record<string, unknown>[] } | { error: string };

type Linked = { links?: { self?: string } } | null | undefined;
const lastId = (v: Linked): string => v?.links?.self?.split('?')[0].split('/').filter(Boolean).pop() ?? '';
const toCents = (v: unknown): number | null => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) : null;
};

/** The fee for an appointment's type, 0 for the consultation, null when unknown. */
export function feeFor(ap: Record<string, unknown>, catalog: Catalog = FALLBACK_CATALOG): { cents: number; name: string } | null {
  const tid = lastId(ap.appointment_type as Linked);
  if (isConsultAppointment(ap as never, CONSULT_TYPE)) return { cents: 0, name: 'Initial Consultation' };
  const item = catalog.items.find((i) => i.id === tid) ?? FALLBACK_CATALOG.items.find((i) => i.id === tid);
  return item ? { cents: item.cents, name: item.name } : null;
}

/** True when an invoice belongs to this appointment. */
export const invoiceIsFor = (inv: Record<string, unknown>, appointmentId: string): boolean =>
  Boolean(appointmentId) && lastId((inv.appointment ?? inv.individual_appointment) as Linked) === appointmentId;

export function paymentStatus(ap: Record<string, unknown>, read: InvoiceRead, catalog: Catalog = FALLBACK_CATALOG): PaymentStatus {
  const fee = feeFor(ap, catalog);
  if (!fee) {
    const tid = lastId(ap.appointment_type as Linked);
    return { state: 'unknown', reason: tid ? `appointment type ${tid} is not in the fee catalogue` : 'the appointment has no type' };
  }
  if (fee.cents === 0) return { state: 'free' };
  if ('error' in read) return { state: 'unknown', reason: read.error };

  const id = String(ap.id ?? '');
  const mine = read.invoices.filter((i) => invoiceIsFor(i, id) && !i.deleted_at && !i.archived_at);
  let best: { received: number; number: string; status: string } | null = null;
  for (const inv of mine) {
    const status = String(inv.status_description ?? (inv.status != null ? `Status ${inv.status}` : ''));
    const number = String(inv.number ?? inv.id ?? '');
    const total = toCents(inv.total_amount) ?? 0;
    const outstanding = toCents(inv.amount_outstanding);
    const settled = !NOT_KEPT.test(status) && (Boolean(inv.closed_at) || /^(paid|closed)$/i.test(status.trim()));
    /* An open invoice, or one refunded or credited, has received nothing that
       was kept. A settled one with a balance still outstanding is partial. */
    const received = settled ? Math.max(0, outstanding != null && outstanding > 0 ? total - outstanding : total) : 0;
    if (!best || received > best.received) best = { received, number, status: status || 'unknown status' };
  }
  if (best && best.received >= fee.cents) return { state: 'paid', amountCents: best.received, invoiceNumber: best.number };
  return {
    state: 'not-received',
    expectedCents: fee.cents,
    receivedCents: best?.received ?? 0,
    ...(best ? { invoiceNumber: best.number } : {}),
    invoiceStatus: best ? best.status : 'no invoice',
  };
}

/** The booking notice's payment row, as [label, value]. */
export function paymentLine(s: PaymentStatus): [string, string] {
  switch (s.state) {
    case 'paid':
      return ['Paid', `${money(s.amountCents)} (Cliniko invoice #${s.invoiceNumber})`];
    case 'free':
      return ['Payment', 'Free, nothing charged'];
    case 'unknown':
      return ['Payment', `could not be checked (${s.reason})`];
    case 'not-received':
      return ['Payment', s.receivedCents > 0
        ? `NOT RECEIVED (expected ${money(s.expectedCents)}; ${money(s.receivedCents)} on invoice #${s.invoiceNumber}, short ${money(s.expectedCents - s.receivedCents)})`
        : `NOT RECEIVED (expected ${money(s.expectedCents)})`];
  }
}

/** One line for an admin table: what the invoice side shows. */
export function invoiceSummary(s: PaymentStatus): string {
  if (s.state === 'paid') return `paid, invoice #${s.invoiceNumber}`;
  if (s.state === 'free') return 'free';
  if (s.state === 'unknown') return `could not be checked: ${s.reason}`;
  return s.invoiceNumber ? `invoice #${s.invoiceNumber}: ${s.invoiceStatus}${s.receivedCents > 0 ? `, ${money(s.receivedCents)} received` : ''}` : 'no invoice';
}

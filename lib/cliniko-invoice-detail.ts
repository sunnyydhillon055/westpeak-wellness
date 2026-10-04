import { api, headers, listAll } from '@/lib/cliniko';
import { CONSULT_TYPE } from '@/lib/site';
import type { Period, PractitionerLine } from '@/lib/cliniko-revenue';

/* EVERY INVOICE IN A MONTH, WITH THE SESSION BEHIND IT — 1 Oct 2026. READ ONLY.
 *
 * WHY
 *
 * The September revenue email credited four invoices to the founder, who is
 * not seeing new clients, and none to Camille, who held consultations and
 * sessions that month. The owner asked who was seen, on what day, for what,
 * and how it was paid. The monthly report could not say: it groups by the
 * practitioner written on the INVOICE, and an invoice can be raised under a
 * different practitioner from the one who held the appointment (whoever's
 * account created it, or a default). This module reads both and shows them
 * side by side, so a mismatch is visible instead of silently moving revenue
 * from one counsellor's row to another's.
 *
 * HOW PAYMENT IS SHOWN
 *
 * Cliniko's API has no payments endpoint (see lib/cliniko-revenue.ts), so the
 * method is INFERRED and labelled as such. An appointment booked online with
 * required payment has its invoice closed at the moment of booking, through
 * the practice's Stripe; an invoice closed within fifteen minutes of the
 * appointment being created is read as that. Anything else was settled some
 * other way, recorded by hand in Cliniko, and the page says to open the
 * invoice there for the method.
 *
 * PRIVACY
 *
 * Only for /admin, behind the admin check. Patient appears as initials, never
 * a name, an address or a note. Nothing here is written anywhere. */

export type InvoiceRow = {
  number: string;
  invoiceId: string;
  amountCents: number;
  status: string;
  issued: string | null;
  closedAt: string | null;
  invoicedUnder: string;
  seenBy: string | null;
  mismatch: boolean;
  appointmentType: string | null;
  isConsult: boolean;
  items: string[];
  sessionAt: string | null;
  bookedAt: string | null;
  attendance: 'held' | 'cancelled' | 'did not arrive' | 'upcoming' | 'unknown';
  payment: 'card online at booking (inferred)' | 'settled before the session' | 'settled after the session' | 'not settled' | 'unknown';
  patient: string;
};

export type InvoiceDetail =
  | { status: 'unconfigured' }
  | { status: 'error'; detail: string }
  | { status: 'ok'; period: Period; rows: InvoiceRow[]; skipped: number };

type Linked = { links?: { self?: string } } | null | undefined;
const idFrom = (v: Linked): string => v?.links?.self?.match(/\/(\d+)(?:\?|$)/)?.[1] ?? '';
const cents = (v: unknown): number => (v == null ? 0 : Math.round(Number(v) * 100) || 0);

/** Initials only: "Hazel M." becomes "H.M.". */
export function initials(first: unknown, last: unknown): string {
  const f = String(first ?? '').trim()[0] ?? '';
  const l = String(last ?? '').trim()[0] ?? '';
  return (f || l) ? `${f.toUpperCase()}.${l ? l.toUpperCase() + '.' : ''}` : 'unknown';
}

/** How an invoice was most likely paid, from three timestamps. */
export function inferPayment(closedAt: string | null, bookedAt: string | null, sessionAt: string | null): InvoiceRow['payment'] {
  if (!closedAt) return 'not settled';
  const c = Date.parse(closedAt);
  if (!Number.isFinite(c)) return 'unknown';
  const b = bookedAt ? Date.parse(bookedAt) : NaN;
  if (Number.isFinite(b) && Math.abs(c - b) <= 15 * 60_000) return 'card online at booking (inferred)';
  const s = sessionAt ? Date.parse(sessionAt) : NaN;
  if (!Number.isFinite(s)) return 'unknown';
  return c <= s ? 'settled before the session' : 'settled after the session';
}

async function getJson(url: string, key: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(url, { headers: headers(key), cache: 'no-store' });
    return r.ok ? ((await r.json()) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function invoiceDetail(period: Period, maxRows = 120): Promise<InvoiceDetail> {
  const a = api();
  if (!a) return { status: 'unconfigured' };
  const base = `https://api.${a.shard}.cliniko.com/v1`;
  const q = (s: string) => `q[]=${encodeURIComponent(s)}`;
  const pad = 36 * 60 * 60 * 1000;
  const inv = await listAll(
    `${base}/invoices?per_page=100&` +
      q(`closed_at:>${new Date(period.start.getTime() - pad).toISOString()}`) + '&' +
      q(`closed_at:<${new Date(period.end.getTime() + pad).toISOString()}`),
    a.key, 'invoices', 40,
  );
  if (inv.error) return { status: 'error', detail: inv.error };

  const [pracs, types] = await Promise.all([
    listAll(`${base}/practitioners?per_page=100`, a.key, 'practitioners', 5),
    listAll(`${base}/appointment_types?per_page=100`, a.key, 'appointment_types', 5),
  ]);
  const pracName = new Map<string, string>();
  for (const p of pracs.rows) {
    const name = [p.first_name, p.last_name].map((x) => String(x ?? '').trim()).filter(Boolean).join(' ');
    pracName.set(String(p.id ?? ''), name || String(p.label ?? '') || `Practitioner ${p.id}`);
  }
  const typeName = new Map<string, string>();
  for (const t of types.rows) typeName.set(String(t.id ?? ''), String(t.name ?? `Type ${t.id}`));

  const inRange = (iso: unknown) => {
    const t = typeof iso === 'string' ? Date.parse(iso) : NaN;
    return Number.isFinite(t) && t >= period.start.getTime() && t < period.end.getTime();
  };
  const wanted = inv.rows.filter((i) => !i.deleted_at && !i.archived_at && inRange(i.closed_at));
  const skipped = Math.max(0, wanted.length - maxRows);

  const rows = await Promise.all(wanted.slice(0, maxRows).map(async (i): Promise<InvoiceRow> => {
    const apLink = ((i.appointment ?? i.individual_appointment) as Linked)?.links?.self;
    const itemsLink = (i.invoice_items as Linked)?.links?.self;
    const patLink = (i.patient as Linked)?.links?.self;
    const [ap, items, pat] = await Promise.all([
      apLink ? getJson(apLink, a.key) : Promise.resolve(null),
      itemsLink ? getJson(itemsLink, a.key) : Promise.resolve(null),
      patLink ? getJson(patLink, a.key) : Promise.resolve(null),
    ]);

    const invPid = String(i.practitioner_id ?? idFrom(i.practitioner as Linked) ?? '');
    const apPid = ap ? idFrom(ap.practitioner as Linked) : '';
    const typeId = ap ? idFrom(ap.appointment_type as Linked) : '';
    const sessionAt = ap && typeof ap.starts_at === 'string' ? ap.starts_at : null;
    const bookedAt = ap && typeof ap.created_at === 'string' ? ap.created_at : null;
    const closedAt = typeof i.closed_at === 'string' ? i.closed_at : null;
    const attendance: InvoiceRow['attendance'] = !ap ? 'unknown'
      : ap.cancelled_at ? 'cancelled'
      : ap.did_not_arrive ? 'did not arrive'
      : sessionAt && Date.parse(sessionAt) > Date.now() ? 'upcoming'
      : 'held';
    const itemNames = Array.isArray(items?.invoice_items)
      ? (items!.invoice_items as Record<string, unknown>[]).map((x) => String(x.name ?? '').trim()).filter(Boolean)
      : [];

    return {
      number: String(i.number ?? i.id ?? ''),
      invoiceId: String(i.id ?? ''),
      amountCents: cents(i.total_amount),
      status: String(i.status_description ?? (i.status != null ? `Status ${i.status}` : '')),
      issued: typeof i.issue_date === 'string' ? i.issue_date : null,
      closedAt,
      invoicedUnder: pracName.get(invPid) ?? (invPid ? `Practitioner ${invPid}` : 'Unassigned'),
      seenBy: apPid ? (pracName.get(apPid) ?? `Practitioner ${apPid}`) : null,
      mismatch: Boolean(apPid && invPid && apPid !== invPid),
      appointmentType: typeId ? (typeName.get(typeId) ?? `Type ${typeId}`) : null,
      isConsult: typeId === CONSULT_TYPE,
      items: itemNames,
      sessionAt,
      bookedAt,
      attendance,
      payment: inferPayment(closedAt, bookedAt, sessionAt),
      patient: pat ? initials(pat.first_name, pat.last_name) : 'unknown',
    };
  }));

  rows.sort((x, y) => String(x.sessionAt ?? x.closedAt).localeCompare(String(y.sessionAt ?? y.closedAt)));
  return { status: 'ok', period, rows, skipped };
}

/* WHAT COUNTS AS A PAID SESSION — owner's rule, 1 Oct 2026: only clients who
 * made a successful payment and did not get it back, and never the free
 * initial consultation. So a row counts when its invoice is closed, above
 * zero, not for the consultation type, and not marked refunded, credited,
 * voided or written off. Cliniko's API exposes no payments or refunds, so a
 * refund is seen only when the invoice's status says so; a refund recorded as
 * a separate payment on a still-"Paid" invoice cannot be seen, and the page
 * says to check Cliniko's Payment summary for those. */
export const NOT_KEPT = /refund|credit|void|written.?off|cancel/i;

export function whyNotCounted(r: InvoiceRow): string | null {
  if (r.isConsult) return 'initial consultation';
  if (r.amountCents <= 0) return 'no charge';
  if (!r.closedAt) return 'not paid';
  if (NOT_KEPT.test(r.status)) return `invoice ${r.status.toLowerCase()}`;
  return null;
}
export const isPaidSession = (r: InvoiceRow): boolean => whyNotCounted(r) === null;

/** Revenue lines by the counsellor who held the appointment, falling back to
 *  the invoice's practitioner only when no appointment is linked. Net and tax
 *  are not on the rows, so they are left at the gross figure and zero: this
 *  practice charges no GST on counselling (the September email showed $0.00
 *  tax), and the practice totals still come from the invoice read. */
export function linesBySeen(rows: InvoiceRow[]): PractitionerLine[] {
  const m = new Map<string, PractitionerLine>();
  for (const r of rows.filter(isPaidSession)) {
    const name = r.seenBy ?? r.invoicedUnder;
    const l = m.get(name) ?? { id: name, name, cents: 0, net: 0, tax: 0, invoices: 0 };
    l.cents += r.amountCents; l.net += r.amountCents; l.invoices++;
    m.set(name, l);
  }
  return [...m.values()].sort((x, y) => y.cents - x.cents);
}

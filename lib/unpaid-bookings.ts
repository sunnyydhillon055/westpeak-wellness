import { api, headers, listAll, type Api } from '@/lib/cliniko';
import { initials } from '@/lib/cliniko-invoice-detail';
import { FALLBACK_CATALOG, money, readCatalog, type Catalog } from '@/lib/cliniko-catalog';
import { formatPacific } from '@/lib/pacific-time';
import { feeFor, invoiceSummary, paymentStatus, type InvoiceRead, type PaymentStatus } from '@/lib/payment-status';

/* FUTURE PAID-TYPE APPOINTMENTS WITH NO PAID INVOICE — 3 Oct 2026. READ ONLY.
 *
 * Every request here is a GET. The site never creates or changes an
 * appointment or an invoice (test/no-appointment-writes.test.mts), so a paid
 * appointment with no payment was made inside Cliniko. This lists them so the
 * practice can invoice or ask before the session rather than find out after.
 * Used by /admin/unpaid, scripts/unpaid-bookings.mjs and the booking cron.
 *
 * Patients appear as initials only. No notes, no health details. */

type Row = Record<string, unknown>;
type Linked = { links?: { self?: string } } | null | undefined;
const linkOf = (v: unknown): string => (v as Linked)?.links?.self ?? '';
const lastId = (link: string): string => link.split('?')[0].split('/').filter(Boolean).pop() ?? '';

/** Booked, still to come, and not cancelled, archived or marked did-not-arrive. */
export function isUpcoming(ap: Row, now: number): boolean {
  if (ap.cancelled_at || ap.archived_at || ap.did_not_arrive) return false;
  const t = typeof ap.starts_at === 'string' ? Date.parse(ap.starts_at) : NaN;
  return Number.isFinite(t) && t > now;
}

/** A type with a fee above zero. An unknown type is not assumed paid or free. */
export const isPaidType = (ap: Row, catalog: Catalog = FALLBACK_CATALOG): boolean => (feeFor(ap, catalog)?.cents ?? 0) > 0;

/** Upcoming paid-type appointments, the ones whose payment is worth checking. */
export const upcomingPaid = (appts: Row[], now: number, catalog: Catalog = FALLBACK_CATALOG): Row[] =>
  appts.filter((ap) => isUpcoming(ap, now) && isPaidType(ap, catalog));

/* Invoices are read per PATIENT (GET /patients/{id}/invoices), one request
   per client however many sessions they have booked, then matched to the
   appointment by the invoice's own appointment link. Bounded: at most
   `maxPatients` clients and three pages each. Past the bound the appointment
   reads as unknown, never as unpaid or paid. */
export async function readInvoices(
  conn: Api, appts: Row[], opts: { maxPatients?: number } = {}
): Promise<Map<string, InvoiceRead>> {
  const maxPatients = opts.maxPatients ?? 40;
  const byPatient = new Map<string, InvoiceRead>();
  const out = new Map<string, InvoiceRead>();
  for (const ap of appts) {
    const plink = linkOf(ap.patient).split('?')[0];
    if (!plink) { out.set(String(ap.id), { error: 'no patient on the appointment' }); continue; }
    let read = byPatient.get(plink);
    if (!read) {
      if (byPatient.size >= maxPatients) {
        out.set(String(ap.id), { error: `request budget of ${maxPatients} clients reached; checked next run` });
        continue;
      }
      try {
        const r = await listAll(`${plink}/invoices?per_page=100`, conn.key, 'invoices', 3);
        read = r.error ? { error: r.error }
          : r.truncated ? { error: 'more invoices for this client than were read' }
          : { invoices: r.rows };
      } catch (e) {
        read = { error: e instanceof Error ? e.message : 'request failed' };
      }
      byPatient.set(plink, read);
    }
    out.set(String(ap.id), read);
  }
  return out;
}

export type UnpaidRow = {
  id: string;
  startsAt: string;
  date: string;
  time: string;
  type: string;
  practitioner: string;
  expectedCents: number;
  invoice: string;
  patient: string;
  state: PaymentStatus['state'];
};

/** Pure: the upcoming paid-type appointments that are not paid, soonest first.
 *  Not-received and could-not-be-checked both appear; paid never does. */
export function unpaidRows(
  appts: Row[], reads: Map<string, InvoiceRead>,
  ctx: { now: number; catalog?: Catalog; practitionerName?: (id: string) => string; patientInitials?: (link: string) => string },
): UnpaidRow[] {
  const catalog = ctx.catalog ?? FALLBACK_CATALOG;
  const rows: UnpaidRow[] = [];
  for (const ap of upcomingPaid(appts, ctx.now, catalog)) {
    const id = String(ap.id);
    const s = paymentStatus(ap, reads.get(id) ?? { error: 'invoices not read' }, catalog);
    if (s.state === 'paid' || s.state === 'free') continue;
    const fee = feeFor(ap, catalog)!;
    const pid = lastId(linkOf(ap.practitioner));
    const startsAt = String(ap.starts_at);
    rows.push({
      id,
      startsAt,
      date: formatPacific(startsAt, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      time: formatPacific(startsAt, { hour: 'numeric', minute: '2-digit', hour12: true }),
      type: fee.name,
      practitioner: ctx.practitionerName?.(pid) ?? (pid ? `Practitioner ${pid}` : 'unassigned'),
      expectedCents: fee.cents,
      invoice: invoiceSummary(s),
      patient: ctx.patientInitials?.(linkOf(ap.patient).split('?')[0]) ?? 'unknown',
      state: s.state,
    });
  }
  return rows.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export type UnpaidResult =
  | { status: 'unconfigured' }
  | { status: 'error'; detail: string }
  | { status: 'ok'; rows: UnpaidRow[]; checked: number; truncated: boolean };

/** Read Cliniko (GETs only) and list the unpaid upcoming appointments. */
export async function listUnpaid(opts: { days?: number; now?: number } = {}): Promise<UnpaidResult> {
  const conn = api();
  if (!conn) return { status: 'unconfigured' };
  const now = opts.now ?? Date.now();
  const iso = (t: number) => new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const base = `https://api.${conn.shard}.cliniko.com/v1`;
  const q = (s: string) => `q[]=${encodeURIComponent(s)}`;
  const ap = await listAll(
    `${base}/appointments?per_page=100&sort=starts_at&${q(`starts_at:>=${iso(now)}`)}&${q(`starts_at:<=${iso(now + (opts.days ?? 120) * 864e5)}`)}`,
    conn.key, 'appointments', 20,
  );
  if (ap.error) return { status: 'error', detail: ap.error };
  const catalog = await readCatalog();
  const candidates = upcomingPaid(ap.rows, now, catalog);
  const [reads, pracs] = await Promise.all([
    readInvoices(conn, candidates),
    listAll(`${base}/practitioners?per_page=100`, conn.key, 'practitioners', 3),
  ]);
  const pracName = new Map<string, string>();
  for (const p of pracs.rows) {
    pracName.set(String(p.id ?? ''), [p.first_name, p.last_name].map((x) => String(x ?? '').trim()).filter(Boolean).join(' '));
  }
  /* Initials need the patient record: one GET per client, only for the rows
     that will be shown. */
  const shown = unpaidRows(candidates, reads, { now, catalog });
  const who = new Map<string, string>();
  for (const a of candidates) {
    const link = linkOf(a.patient).split('?')[0];
    if (!link || who.has(link) || !shown.some((r) => r.id === String(a.id))) continue;
    who.set(link, await patientInitials(conn, link));
  }
  const rows = unpaidRows(candidates, reads, {
    now, catalog,
    practitionerName: (id) => pracName.get(id) || (id ? `Practitioner ${id}` : 'unassigned'),
    patientInitials: (link) => who.get(link) ?? 'unknown',
  });
  return { status: 'ok', rows, checked: candidates.length, truncated: ap.truncated };
}

async function patientInitials(conn: Api, link: string): Promise<string> {
  try {
    const r = await fetch(link, { headers: headers(conn.key), cache: 'no-store' });
    if (!r.ok) return 'unknown';
    const p = (await r.json()) as Row;
    return initials(p.first_name, p.last_name);
  } catch {
    return 'unknown';
  }
}

/** The same rows as plain text, for the script. */
export function formatUnpaidTable(rows: UnpaidRow[]): string {
  if (rows.length === 0) return 'No upcoming paid-type appointments without a paid invoice.';
  const head = ['Date', 'Time', 'Type', 'Practitioner', 'Expected', 'Invoice', 'Appointment id', 'Client'];
  const body = rows.map((r) => [r.date, r.time, r.type, r.practitioner, money(r.expectedCents), r.invoice, r.id, r.patient]);
  const w = head.map((h, i) => Math.max(h.length, ...body.map((b) => b[i].length)));
  const line = (cells: string[]) => cells.map((c, i) => c.padEnd(w[i])).join('  ').trimEnd();
  return [line(head), line(w.map((n) => '-'.repeat(n))), ...body.map(line)].join('\n');
}

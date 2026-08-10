import { api, headers } from '@/lib/cliniko';

/* Monthly revenue, per practitioner, read from Cliniko.
 *
 * WHY THIS EXISTS. Cliniko has no scheduled or emailed reports — every report
 * in it is run by hand and printed. This turns the one number the practice
 * actually needs each month into something that arrives on its own.
 *
 * ── The one thing to understand before trusting these figures ──────────────
 *
 * The Cliniko API has NO payments endpoint. It is a long-standing open request
 * (redguava/cliniko-api#90) and there is no way around it. So this report
 * cannot count payments. It counts INVOICES CLOSED in the period, which is a
 * different thing wearing similar clothes:
 *
 *   Cliniko "Payment summary" report   →  cash basis, keyed on payment date
 *   This report                        →  invoices whose closed_at is in range
 *
 * For this practice those converge, because payment is taken through Stripe at
 * the moment of booking and Cliniko closes the invoice in the same movement —
 * so an invoice closes on the day it is paid. They would DIVERGE if invoices
 * were ever settled by hand well after the session, or part-paid. That is why
 * `outstanding` is reported alongside: anything raised in the period and not
 * closed shows up there rather than silently going missing, so the two blocks
 * together account for all the work billed.
 *
 * The email says all of this in one line. Nobody should have to read this file
 * to know what the number means.
 * ─────────────────────────────────────────────────────────────────────────── */

const TZ = 'America/Vancouver';

/* ---- time ---------------------------------------------------------------- */

/** How far the zone is from UTC at a given instant, in ms. Derived from Intl
 *  rather than hardcoded, so the PST/PDT switch is never wrong. */
function offsetMs(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const p: Record<string, string> = {};
  for (const x of parts) p[x.type] = x.value;
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asUTC - at.getTime();
}

/** The UTC instant of local midnight on a given calendar day. Two passes,
 *  because the offset itself depends on the instant being resolved — one pass
 *  lands an hour out on the two days a year the clocks move. */
function zonedMidnight(y: number, m: number, d: number, tz: string): Date {
  const naive = Date.UTC(y, m, d, 0, 0, 0);
  let ts = naive;
  for (let i = 0; i < 2; i++) ts = naive - offsetMs(new Date(ts), tz);
  return new Date(ts);
}

export type Period = { label: string; key: string; start: Date; end: Date };

/** The calendar month before `now`, bounded by local midnight in Vancouver.
 *  Bounding in UTC instead would put the first seven hours of the 1st into the
 *  wrong month — every month, not just at DST. */
export function previousMonth(now = new Date(), tz = TZ): Period {
  const p: Record<string, string> = {};
  for (const x of new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit' })
    .formatToParts(now)) p[x.type] = x.value;

  const y = +p.year;
  const m = +p.month - 1;          // 0-indexed, current month
  const py = m === 0 ? y - 1 : y;  // previous month
  const pm = m === 0 ? 11 : m - 1;

  return {
    key: `${py}-${String(pm + 1).padStart(2, '0')}`,
    label: new Intl.DateTimeFormat('en-CA', { timeZone: tz, month: 'long', year: 'numeric' })
      .format(zonedMidnight(py, pm, 15, tz)),
    start: zonedMidnight(py, pm, 1, tz),
    end: zonedMidnight(y, m, 1, tz),   // exclusive
  };
}

/** An explicit "YYYY-MM", for re-running a past month by hand. */
export function monthFromKey(key: string, tz = TZ): Period | null {
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2] - 1;
  if (mo < 0 || mo > 11) return null;
  return {
    key,
    label: new Intl.DateTimeFormat('en-CA', { timeZone: tz, month: 'long', year: 'numeric' })
      .format(zonedMidnight(y, mo, 15, tz)),
    start: zonedMidnight(y, mo, 1, tz),
    end: zonedMidnight(mo === 11 ? y + 1 : y, mo === 11 ? 0 : mo + 1, 1, tz),
  };
}

/* ---- Cliniko ------------------------------------------------------------- */

type Linked = { links?: { self?: string } };
type Invoice = {
  id?: string | number;
  number?: number;
  total_amount?: string | null;
  net_amount?: string | null;
  tax_amount?: string | null;
  status?: number | null;
  status_description?: string | null;
  closed_at?: string | null;
  issue_date?: string | null;
  archived_at?: string | null;
  deleted_at?: string | null;
  practitioner_id?: string | number;
  practitioner?: Linked;
  patient?: Linked;
};

const idFrom = (v: Linked | undefined): string => {
  const m = v?.links?.self?.match(/\/(\d+)(?:\?|$)/);
  return m ? m[1] : '';
};

/** Money as integer cents. Cliniko returns decimals as strings; adding them as
 *  floats drifts, and a revenue report that is a cent out looks broken. */
const cents = (v: string | null | undefined): number =>
  v == null ? 0 : Math.round(Number(v) * 100) || 0;

export const money = (c: number): string =>
  (c < 0 ? '-' : '') + '$' + (Math.abs(c) / 100).toLocaleString('en-CA', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

/** Follow `links.next` to the end. Cliniko caps per_page at 100. Bounded so a
 *  malformed cursor can never spin the function until it is killed. */
async function paginate(
  first: string, key: string, collection: string, max = 40
): Promise<{ rows: Record<string, unknown>[]; error?: string }> {
  const rows: Record<string, unknown>[] = [];
  let url: string | undefined = first;

  for (let i = 0; url && i < max; i++) {
    const res: Response = await fetch(url, { headers: headers(key), cache: 'no-store' });
    if (!res.ok) {
      return { rows, error: `HTTP ${res.status} on ${collection}${res.status === 422 ? ` — ${(await res.text()).slice(0, 160)}` : ''}` };
    }
    const body = (await res.json()) as Record<string, unknown> & { links?: { next?: string } };
    const page = body[collection];
    if (Array.isArray(page)) rows.push(...(page as Record<string, unknown>[]));
    url = body.links?.next;
  }
  return { rows };
}

export type PractitionerLine = {
  id: string;
  name: string;
  cents: number;
  net: number;
  tax: number;
  invoices: number;
};

export type RevenueReport =
  | { status: 'unconfigured' }
  | { status: 'error'; detail: string }
  | {
      status: 'ok';
      period: Period;
      lines: PractitionerLine[];
      total: number;
      totalNet: number;
      totalTax: number;
      invoiceCount: number;
      outstanding: { cents: number; count: number };
      byStatus: Record<string, { cents: number; count: number }>;
    };

export async function monthlyRevenue(period: Period): Promise<RevenueReport> {
  const a = api();
  if (!a) return { status: 'unconfigured' };

  const base = `https://api.${a.shard}.cliniko.com/v1`;

  /* Widen the server-side filter by a day either side and narrow it exactly in
   * code below. Cliniko documents `closed_at` as filterable but not which
   * comparison operators it accepts; `:>` and `:<` are the two that have always
   * worked. Widening means a stricter-than-expected operator cannot silently
   * clip the first or last day of the month — the sort of error that would look
   * like a quiet month rather than a bug. */
  const pad = 36 * 60 * 60 * 1000;
  const q = (s: string) => `q[]=${encodeURIComponent(s)}`;
  const invUrl =
    `${base}/invoices?per_page=100&` +
    q(`closed_at:>${new Date(period.start.getTime() - pad).toISOString()}`) + '&' +
    q(`closed_at:<${new Date(period.end.getTime() + pad).toISOString()}`);

  const [inv, pracs] = await Promise.all([
    paginate(invUrl, a.key, 'invoices'),
    paginate(`${base}/practitioners?per_page=100`, a.key, 'practitioners'),
  ]);
  if (inv.error) return { status: 'error', detail: inv.error };

  const names = new Map<string, string>();
  for (const p of pracs.rows) {
    const id = String((p as { id?: unknown }).id ?? '');
    const first = String((p as { first_name?: string }).first_name ?? '').trim();
    const last = String((p as { last_name?: string }).last_name ?? '').trim();
    const label = String((p as { label?: string }).label ?? '').trim();
    if (id) names.set(id, [first, last].filter(Boolean).join(' ') || label || `Practitioner ${id}`);
  }

  const inRange = (iso: string | null | undefined): boolean => {
    if (!iso) return false;
    const t = Date.parse(iso);
    return Number.isFinite(t) && t >= period.start.getTime() && t < period.end.getTime();
  };

  const byPrac = new Map<string, PractitionerLine>();
  const byStatus: Record<string, { cents: number; count: number }> = {};
  let total = 0, totalNet = 0, totalTax = 0, invoiceCount = 0;

  for (const raw of inv.rows) {
    const i = raw as Invoice;
    if (i.deleted_at || i.archived_at) continue;
    if (!inRange(i.closed_at)) continue;

    const amt = cents(i.total_amount);
    const pid = String(i.practitioner_id ?? idFrom(i.practitioner) ?? '');
    const key = pid || 'unassigned';

    if (!byPrac.has(key)) {
      byPrac.set(key, {
        id: key,
        name: names.get(pid) || (pid ? `Practitioner ${pid}` : 'Unassigned'),
        cents: 0, net: 0, tax: 0, invoices: 0,
      });
    }
    const line = byPrac.get(key)!;
    line.cents += amt;
    line.net += cents(i.net_amount);
    line.tax += cents(i.tax_amount);
    line.invoices++;

    const sk = i.status_description || `Status ${i.status ?? '?'}`;
    byStatus[sk] ??= { cents: 0, count: 0 };
    byStatus[sk].cents += amt;
    byStatus[sk].count++;

    total += amt;
    totalNet += cents(i.net_amount);
    totalTax += cents(i.tax_amount);
    invoiceCount++;
  }

  /* Still-open invoices issued in the period. Not revenue — the counterweight
   * that stops "closed invoices" from reading as "all the work billed". */
  const day = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
      .format(d);
  const outUrl =
    `${base}/invoices?per_page=100&` +
    q(`issue_date:>=${day(period.start)}`) + '&' +
    q(`issue_date:<${day(period.end)}`);
  const out = await paginate(outUrl, a.key, 'invoices');
  const outstanding = { cents: 0, count: 0 };
  for (const raw of out.rows) {
    const i = raw as Invoice;
    if (i.deleted_at || i.archived_at || i.closed_at) continue;
    outstanding.cents += cents(i.total_amount);
    outstanding.count++;
  }

  const lines = [...byPrac.values()].sort((x, y) => y.cents - x.cents);
  return {
    status: 'ok', period, lines, total, totalNet, totalTax, invoiceCount, outstanding, byStatus,
  };
}

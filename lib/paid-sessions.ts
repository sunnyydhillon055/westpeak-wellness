import { api, headers } from '@/lib/cliniko';
import { monthFromKey, previousMonth, type Period } from '@/lib/cliniko-revenue';
import { buildXlsx, safeSheetName, type Sheet } from '@/lib/xlsx';

/* ============================================================================
   PAID SESSIONS, PER PRACTITIONER — the detail behind the monthly number
   ----------------------------------------------------------------------------
   WHAT COUNTS AS PAID, AND WHY IT IS NOT "BOOKED"

   The monthly report line "Paid sessions booked" counts APPOINTMENTS. This
   counts MONEY. They are different questions and the owner asked for the
   second one: "the sessions which received funds".

   So the unit here is a closed invoice, not an appointment. Cliniko closes an
   invoice when it is paid, so `closed_at` inside the period is the honest test
   for "funds received in this month". An appointment that happened and was
   never paid does not appear. An invoice paid this month for a session last
   month does — because that is when the money arrived.

   FREE CONSULTATIONS ARE EXCLUDED, which was the other half of the request.
   Two independent reasons, and both are applied:

     · a $0 invoice is not a session that received funds, so the amount filter
       removes it on its own
     · the consultation appointment type is excluded by id as well, so a
       consultation that somehow carried a charge still would not land here

   Belt and braces on purpose. The report has already been wrong in this exact
   direction once — every free consult was counted as a paid session for
   months, because lib/funnel-report.ts classified by a field Cliniko does not
   return. Getting it wrong the other way, and silently dropping real revenue,
   would be worse.

   ONE SHEET PER PRACTITIONER, which is how the practice reads it. Unassigned
   invoices get their own tab rather than being folded into someone else's, and
   a summary tab leads so the workbook opens on a total rather than on whoever
   happens to sort first.
   ========================================================================= */

type Linked = { links?: { self?: string } };

type Invoice = {
  id?: string | number;
  number?: number;
  total_amount?: string | null;
  net_amount?: string | null;
  tax_amount?: string | null;
  status_description?: string | null;
  closed_at?: string | null;
  issue_date?: string | null;
  archived_at?: string | null;
  deleted_at?: string | null;
  practitioner_id?: string | number;
  practitioner?: Linked;
  patient?: Linked;
  appointment?: Linked;
};

const idFrom = (v: Linked | undefined): string => {
  const m = v?.links?.self?.match(/\/(\d+)(?:\?|$)/);
  return m ? m[1] : '';
};

/** Integer cents. Cliniko returns decimals as strings; float addition drifts. */
const cents = (v: string | null | undefined): number => {
  if (v === null || v === undefined) return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

const fmtDate = (iso: string | null | undefined): string => {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(new Date(iso));
  } catch { return String(iso).slice(0, 10); }
};

async function paginate(url: string, key: string, collection: string) {
  const rows: unknown[] = [];
  let next: string | undefined = url;
  let guard = 0;
  while (next && guard++ < 40) {
    const res = await fetch(next, { headers: headers(key), cache: 'no-store' });
    if (!res.ok) return { rows, error: `HTTP ${res.status} on ${collection}` };
    const body = (await res.json()) as Record<string, unknown> & { links?: { next?: string } };
    rows.push(...((body[collection] as unknown[]) ?? []));
    next = body.links?.next;
  }
  return { rows, error: null as string | null };
}

export type PaidSessionsResult =
  | { status: 'unconfigured' }
  | { status: 'error'; detail: string }
  | { status: 'ok'; period: Period; rowCount: number; totalCents: number; xlsx: Buffer; filename: string };

export async function paidSessionsWorkbook(
  monthKey?: string,
  consultTypeId?: string
): Promise<PaidSessionsResult> {
  const conn = api();
  if (!conn) return { status: 'unconfigured' };

  const period = (monthKey ? monthFromKey(monthKey) : null) ?? previousMonth();
  const base = `https://api.${conn.shard}.cliniko.com/v1`;
  const q = (s: string) => `q[]=${encodeURIComponent(s)}`;
  /* A day of padding either side, then filtered exactly in code — Cliniko's
     boundary handling on closed_at is not documented precisely enough to trust
     at the edges of a month. */
  const pad = 864e5;
  const invUrl =
    `${base}/invoices?per_page=100&` +
    q(`closed_at:>${new Date(period.start.getTime() - pad).toISOString()}`) + '&' +
    q(`closed_at:<${new Date(period.end.getTime() + pad).toISOString()}`);

  const [inv, pracs, patients] = await Promise.all([
    paginate(invUrl, conn.key, 'invoices'),
    paginate(`${base}/practitioners?per_page=100`, conn.key, 'practitioners'),
    paginate(`${base}/patients?per_page=100`, conn.key, 'patients'),
  ]);
  if (inv.error) return { status: 'error', detail: inv.error };

  const pracName = new Map<string, string>();
  for (const p of pracs.rows as Record<string, unknown>[]) {
    const id = String(p.id ?? '');
    const nm = [String(p.first_name ?? '').trim(), String(p.last_name ?? '').trim()]
      .filter(Boolean).join(' ') || String(p.label ?? '').trim();
    if (id) pracName.set(id, nm || `Practitioner ${id}`);
  }

  const patientName = new Map<string, string>();
  for (const p of patients.rows as Record<string, unknown>[]) {
    const id = String(p.id ?? '');
    const nm = [String(p.first_name ?? '').trim(), String(p.last_name ?? '').trim()]
      .filter(Boolean).join(' ');
    if (id) patientName.set(id, nm || `Client ${id}`);
  }

  const inRange = (iso: string | null | undefined) => {
    if (!iso) return false;
    const t = Date.parse(iso);
    return Number.isFinite(t) && t >= period.start.getTime() && t < period.end.getTime();
  };

  type Row = { date: string; client: string; service: string; invoice: string; net: number; tax: number; total: number };
  const byPrac = new Map<string, { name: string; rows: Row[] }>();
  let totalCents = 0;
  let rowCount = 0;

  for (const raw of inv.rows as Invoice[]) {
    if (raw.deleted_at || raw.archived_at) continue;
    if (!inRange(raw.closed_at)) continue;

    const total = cents(raw.total_amount);
    /* A zero invoice is not a session that received funds. This is what
       removes the free consultation, and it removes a written-off session
       too — correctly, because no money arrived for either. */
    if (total <= 0) continue;

    /* And by type, independently, so a consultation that somehow carried a
       charge still cannot be counted as a paid session. */
    const apptTypeId = idFrom(raw.appointment as Linked | undefined);
    if (consultTypeId && apptTypeId && apptTypeId === consultTypeId) continue;

    const pid = String(raw.practitioner_id ?? idFrom(raw.practitioner) ?? '');
    const key = pid || 'unassigned';
    if (!byPrac.has(key)) {
      byPrac.set(key, { name: pracName.get(pid) || (pid ? `Practitioner ${pid}` : 'Unassigned'), rows: [] });
    }
    byPrac.get(key)!.rows.push({
      date: fmtDate(raw.closed_at),
      client: patientName.get(idFrom(raw.patient)) || '',
      service: String(raw.status_description ?? '').trim(),
      invoice: raw.number !== undefined ? String(raw.number) : String(raw.id ?? ''),
      net: cents(raw.net_amount) / 100,
      tax: cents(raw.tax_amount) / 100,
      total: total / 100,
    });
    totalCents += total;
    rowCount++;
  }

  const ordered = [...byPrac.values()].sort((a, b) => b.rows.length - a.rows.length);

  const summary: Sheet = {
    name: 'Summary',
    rows: [
      ['Practitioner', 'Sessions paid', 'Net', 'Tax', 'Total'],
      ...ordered.map((p) => [
        p.name,
        p.rows.length,
        p.rows.reduce((n, r) => n + r.net, 0),
        p.rows.reduce((n, r) => n + r.tax, 0),
        p.rows.reduce((n, r) => n + r.total, 0),
      ]),
      [],
      ['All practitioners', rowCount, null, null, totalCents / 100],
      [],
      ['Period', period.label],
      ['Counts', 'Invoices closed (paid) in the period. Free consultations excluded.'],
    ],
    moneyColumns: [2, 3, 4],
  };

  const sheets: Sheet[] = [
    summary,
    ...ordered.map((p) => ({
      name: safeSheetName(p.name),
      rows: [
        ['Date paid', 'Client', 'Invoice status', 'Invoice #', 'Net', 'Tax', 'Total'],
        ...p.rows
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((r) => [r.date, r.client, r.service, r.invoice, r.net, r.tax, r.total]),
      ],
      moneyColumns: [4, 5, 6],
    })),
  ];

  return {
    status: 'ok',
    period,
    rowCount,
    totalCents,
    xlsx: buildXlsx(sheets),
    filename: `westpeak-paid-sessions-${period.key}.xlsx`,
  };
}

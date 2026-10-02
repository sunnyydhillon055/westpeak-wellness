import { get } from '@vercel/blob';

/* READING THE BOOKING TALLY — 1 Oct 2026.
 *
 * The booking-mail job keeps a monthly tally of what it saw in Cliniko, per
 * counsellor: consultations and paid sessions booked, cancelled, held, and
 * missed. It writes 'analytics/booking-tally.json'; this module only reads
 * it, for /admin and the monthly funnel email. Counts by roster slug, never
 * an id or a name.
 *
 * Read defensively. Before the first booking-mail run that writes it, the
 * file does not exist, and a reader that showed zeros would say "nothing was
 * booked" when the truth is "nothing was counted yet". So an absent or
 * unreadable file is reported as absent, and a row with a stray field is
 * read for the fields it has. */

export const TALLY_KEY = 'analytics/booking-tally.json';

export const TALLY_FIELDS = [
  'consultBooked', 'paidBooked', 'consultCancelled', 'paidCancelled', 'consultHeld', 'paidHeld', 'dna',
  /* From 1 Oct 2026: a held consultation whose patient then booked a paid
     session. A tally written before it existed reads 0 here; weekTable
     checks the raw copy for the field before trusting that zero. */
  'consultConverted',
] as const;
export type TallyField = (typeof TALLY_FIELDS)[number];
export type TallyRow = Record<TallyField, number>;

export type BookingTally = {
  /** 'YYYY-MM' -> roster slug or 'unknown' -> counts. */
  months: Record<string, Record<string, TallyRow>>;
  updatedAt: string;
};

export type TallyRead =
  | { status: 'ok'; tally: BookingTally }
  | { status: 'absent'; reason: string };

const count = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
};

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const KEY = /^[a-z0-9-]{1,60}$/;

/** Validate whatever the file holds into the documented shape. Months and
 *  keys that are not the right shape are dropped, not trusted. Pure. */
export function parseBookingTally(v: unknown): BookingTally | null {
  if (!v || typeof v !== 'object') return null;
  const raw = (v as { months?: unknown }).months;
  if (!raw || typeof raw !== 'object') return null;
  const months: BookingTally['months'] = {};
  for (const [m, rows] of Object.entries(raw as Record<string, unknown>)) {
    if (!MONTH.test(m) || !rows || typeof rows !== 'object') continue;
    const out: Record<string, TallyRow> = {};
    for (const [slug, r] of Object.entries(rows as Record<string, unknown>)) {
      if (!KEY.test(slug) || !r || typeof r !== 'object') continue;
      const row = {} as TallyRow;
      for (const f of TALLY_FIELDS) row[f] = count((r as Record<string, unknown>)[f]);
      out[slug] = row;
    }
    months[m] = out;
  }
  return { months, updatedAt: String((v as { updatedAt?: unknown }).updatedAt ?? '') };
}

export async function readBookingTally(): Promise<TallyRead> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { status: 'absent', reason: 'no blob store on this deployment' };
  try {
    const hit = await get(TALLY_KEY, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return { status: 'absent', reason: 'the booking-mail job has not written a tally yet' };
    const tally = parseBookingTally(await new Response(hit.stream).json());
    return tally ? { status: 'ok', tally } : { status: 'absent', reason: 'the tally file is not in the expected shape' };
  } catch {
    return { status: 'absent', reason: 'the tally could not be read' };
  }
}

/** One month's rows, roster order not guaranteed, busiest first. */
export function tallyRows(t: BookingTally, month: string): { slug: string; row: TallyRow }[] {
  return Object.entries(t.months[month] ?? {})
    .map(([slug, row]) => ({ slug, row }))
    .sort((a, b) => (b.row.consultBooked + b.row.paidBooked) - (a.row.consultBooked + a.row.paidBooked));
}

/** One line per counsellor, shared by the email and /admin wording. */
export function tallyLine(row: TallyRow): string {
  return `${row.consultBooked} consult${row.consultBooked === 1 ? '' : 's'} booked, ${row.consultHeld} held, ${row.consultCancelled} cancelled · `
    + `${row.paidBooked} paid booked, ${row.paidHeld} held, ${row.paidCancelled} cancelled · ${row.dna} missed`
    + ` · ${row.consultConverted} new paying client${row.consultConverted === 1 ? '' : 's'}`;
}

import { list } from '@vercel/blob';
import { blobLedger } from '@/lib/blob-ledger';
import { readConversions, parseConversions, diffLogs, type ConversionLog } from '@/lib/conversion-log';
import { parseBookingTally, TALLY_FIELDS, type TallyField } from '@/lib/booking-tally-read';
import { splitBookDetail } from '@/lib/conversion-detail';

const PORTAL_PATH = '/client-portal';

/* A COPY OF THE COUNTERS EVERY MONDAY, SO /admin CAN SAY "LAST WEEK" — 1 Oct 2026.
 *
 * The conversion log is one cumulative tally since 18 Aug 2026 with no day
 * buckets, by design: counts, never events. So "what happened last week" was
 * unanswerable, and a change shipped on a Wednesday (scheduler_visible
 * changed meaning on 1 Oct) had no before and after.
 *
 * The answer that keeps the posture is to copy the whole tally once a week.
 * Two copies a week apart, subtracted, are last week's counts by event, page
 * and detail — still tallies, still nothing joined to a person, at a
 * resolution (a week) coarser than the day bucket the log already allows.
 *
 * analytics/snapshots/<YYYY-MM-DD>.json, written by /api/cron/weekly-snapshot.
 * It sends nothing: the 17 Sep decision moved monitors off email, and this is
 * read on /admin. Snapshots are a few kilobytes each and are kept; a year is
 * 52 files.
 *
 * analytics/booking-tally.json (lib/booking-tally.ts TALLY_KEY) is copied beside the log when it exists (it is
 * another branch's store, #23), so the same diff can be made of it later.
 */

export const SNAPSHOT_PREFIX = 'analytics/snapshots/';
const ALSO_COPIED = 'analytics/booking-tally.json';

/** The snapshot's path for a moment, by its UTC day. */
export function snapshotKey(at: Date): string {
  return `${SNAPSHOT_PREFIX}${at.toISOString().slice(0, 10)}.json`;
}

export type Snapshot = {
  takenAt: string;
  conversions: ConversionLog;
  /** analytics/booking-tally.json as it stood, when that store exists. */
  bookings?: unknown;
  /** Open free-consultation slots in the next 14 days as the snapshot was
   *  taken, per counsellor: how many and on which weekdays. From 1 Oct 2026,
   *  so "open more consult days" can be read against what was offered. */
  slots?: Record<string, SlotSupply>;
};

export type SlotSupply = { count: number; days: string[] };

/** The availability summary reduced to what a snapshot keeps. Pure. */
export function slotSupply(all: Record<string, { count?: unknown; days?: unknown; error?: unknown } | null | undefined>): Record<string, SlotSupply> {
  const out: Record<string, SlotSupply> = {};
  for (const [slug, a] of Object.entries(all)) {
    if (!a || a.error || !/^[a-z0-9-]{1,60}$/.test(slug)) continue;
    const count = Number(a.count);
    out[slug] = {
      count: Number.isFinite(count) && count > 0 ? Math.floor(count) : 0,
      days: Array.isArray(a.days) ? a.days.filter((d): d is string => typeof d === 'string').slice(0, 7) : [],
    };
  }
  return out;
}

export function parseSnapshot(raw: unknown): Snapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<Snapshot>;
  if (typeof r.takenAt !== 'string') return null;
  return {
    takenAt: r.takenAt,
    conversions: parseConversions(r.conversions),
    ...(r.bookings !== undefined ? { bookings: r.bookings } : {}),
    ...(r.slots && typeof r.slots === 'object' ? { slots: slotSupply(r.slots as Record<string, { count?: unknown; days?: unknown }>) } : {}),
  };
}

/** Copies the counters to this week's snapshot. A second run the same day
 *  overwrites that day's copy, so a retried cron leaves one file. */
export async function takeSnapshot(now = new Date()): Promise<{ key: string; total: number; bookings: boolean } | { skipped: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { skipped: 'BLOB_READ_WRITE_TOKEN is not set' };
  const conversions = await readConversions({ fresh: true });
  const bookings = await blobLedger(ALSO_COPIED).read().catch(() => null);
  /* Loaded here rather than imported at the top: the availability module
     pulls in next/cache and the roster, and this file is read by tests
     under plain Node. A Cliniko failure leaves the snapshot without slots
     rather than failing it. */
  const slots = await import('@/lib/cliniko-availability')
    .then((m) => m.consultationAvailabilityNow())
    .then(slotSupply)
    .catch(() => null);
  const snap: Snapshot = {
    takenAt: now.toISOString(),
    conversions,
    ...(bookings ? { bookings: bookings.body } : {}),
    ...(slots ? { slots } : {}),
  };
  const key = snapshotKey(now);
  /* Unconditional on purpose: nothing else writes a snapshot, and a rerun
     should replace the day's copy rather than fail on it. */
  const outcome = await blobLedger(key).write(JSON.stringify(snap, null, 2), {});
  if (outcome !== 'ok') throw new Error(`snapshot ${key} was refused`);
  return { key, total: conversions.total, bookings: Boolean(bookings) };
}

/** The newest `n` snapshots, newest first. Empty without a Blob token. */
export async function recentSnapshots(n = 2): Promise<Snapshot[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: SNAPSHOT_PREFIX, limit: 1000 });
    const newest = blobs
      .map((b) => b.pathname)
      .filter((p) => /\/\d{4}-\d{2}-\d{2}\.json$/.test(p))
      .sort()
      .reverse()
      .slice(0, n);
    const out: Snapshot[] = [];
    for (const key of newest) {
      const hit = await blobLedger(key).read();
      const snap = parseSnapshot(hit?.body ?? null);
      if (snap) out.push(snap);
    }
    return out;
  } catch {
    return [];
  }
}

export type WeekCounts = ReturnType<typeof diffLogs> & { from: string; to: string };

/** The week between the two newest snapshots, or null until there are two. */
export function lastWeek(snaps: Snapshot[]): WeekCounts | null {
  const [newer, older] = snaps;
  if (!newer || !older) return null;
  return { ...diffLogs(older.conversions, newer.conversions), from: older.takenAt, to: newer.takenAt };
}

/* ---- eight weeks, per counsellor — 1 Oct 2026 ----------------------------
 *
 * "Last 7 days" diffed one pair of snapshots and only the conversion log.
 * The table below diffs every neighbouring pair of the newest nine, so it
 * covers eight weeks, and reads the booking tally each snapshot already
 * copied (nothing read snapshot.bookings before). One row per week for the
 * practice, then the same per counsellor. Landings carry no counsellor, so
 * a counsellor's row has none.
 *
 * PARTIAL is said, not hidden: a pair further apart than eight days or
 * closer than six (a missed or doubled Monday), a column that began
 * counting inside the week, or a week with no tally copy. A column that
 * did not exist yet prints as null rather than 0. */

export type WeekRow = {
  from: string;
  to: string;
  /** 'all' or a roster slug. */
  who: string;
  landing: number | null;
  bookClick: number | null;
  visible: number | null;
  interact: number | null;
  booked: number | null;
  consultBooked: number | null;
  consultHeld: number | null;
  paidBooked: number | null;
  dna: number | null;
  /** Open consultation slots in the 14 days after the week began. */
  slots: number | null;
  slotDays: string[];
  /** Messages from /book's "None of these times work?" box that week. */
  timeRequests: number;
  partial: string[];
};

export type TimeRequest = { createdAt: string; practitioner?: string };

const sumAt = (m: Record<string, number> | undefined, pick: (k: string) => boolean) =>
  Object.entries(m ?? {}).reduce((n, [k, v]) => (pick(k) ? n + v : n), 0);

const tallyBy = (bookings: unknown) => {
  const t = parseBookingTally(bookings);
  if (!t) return null;
  const out: Record<string, Record<TallyField, number>> = {};
  for (const rows of Object.values(t.months)) {
    for (const [slug, r] of Object.entries(rows)) {
      const o = (out[slug] ??= Object.fromEntries(TALLY_FIELDS.map((f) => [f, 0])) as Record<TallyField, number>);
      for (const f of TALLY_FIELDS) o[f] += r[f];
    }
  }
  return out;
};

/** Eight weeks of the funnel from the newest nine snapshots (newest first),
 *  for the practice and for each slug in `slugs`. Pure. */
export function weekTable(snaps: Snapshot[], slugs: string[], requests: TimeRequest[] = []): WeekRow[] {
  const rows: WeekRow[] = [];
  for (let i = 0; i + 1 < snaps.length && i < 8; i++) {
    const newer = snaps[i];
    const older = snaps[i + 1];
    const from = older.takenAt;
    const to = newer.takenAt;
    const span = (Date.parse(to) - Date.parse(from)) / 864e5;
    const weekPartial: string[] = [];
    if (span < 6 || span > 8) weekPartial.push(`${Math.round(span)} days between snapshots`);
    const began = (event: string): 'none' | 'part' | 'full' => {
      const first = newer.conversions.firstSeen?.[event];
      if (!newer.conversions.events[event] && !first) return 'none';
      if (!first) return 'full';
      if (first > to.slice(0, 10)) return 'none';
      return first > from.slice(0, 10) ? 'part' : 'full';
    };
    const tNew = tallyBy(newer.bookings);
    const tOld = tallyBy(older.bookings);
    const reqIn = requests.filter((r) => r.createdAt > from && r.createdAt <= to);

    for (const who of ['all', ...slugs]) {
      const partial = [...weekPartial];
      const ev = (event: string, pick: (k: string) => boolean, byDetail: boolean): number | null => {
        const state = began(event);
        if (state === 'none') return null;
        if (state === 'part') partial.push(`${event.replace(/_/g, ' ')} counted from ${newer.conversions.firstSeen?.[event]}`);
        const a = byDetail ? older.conversions.details?.[event] : older.conversions.events[event];
        const b = byDetail ? newer.conversions.details?.[event] : newer.conversions.events[event];
        return Math.max(0, sumAt(b, pick) - sumAt(a, pick));
      };
      const all = () => true;
      const mine = (k: string) => k === who;
      /* The practice row is /book's calendar: the portal's paid calendar is
         a client rebooking, counted by path so the no-counsellor views count. */
      const notPortal = (path: string) => path !== PORTAL_PATH;
      const clickMine = (k: string) => splitBookDetail(k).who === who;
      const tally = (f: TallyField): number | null => {
        if (!tNew || !tOld) return null;
        const pick = (t: Record<string, Record<TallyField, number>>) =>
          who === 'all' ? Object.values(t).reduce((n, r) => n + r[f], 0) : (t[who]?.[f] ?? 0);
        return Math.max(0, pick(tNew) - pick(tOld));
      };
      if (!tNew || !tOld) partial.push('no booking tally copied');
      const supply = older.slots
        ? who === 'all'
          ? { count: Object.values(older.slots).reduce((n, x) => n + x.count, 0), days: Array.from(new Set(Object.values(older.slots).flatMap((x) => x.days))) }
          : older.slots[who] ?? { count: 0, days: [] }
        : null;
      rows.push({
        from, to, who,
        landing: who === 'all' ? ev('landing', all, false) : null,
        /* A counsellor's clicks are the ones whose link named her; the
           scheduler's are her calendar on /book, never the portal's. */
        bookClick: who === 'all' ? ev('book_click', all, false) : ev('book_click', clickMine, true),
        visible: who === 'all' ? ev('scheduler_visible', notPortal, false) : ev('scheduler_visible', mine, true),
        interact: who === 'all' ? ev('scheduler_interact', notPortal, false) : ev('scheduler_interact', mine, true),
        booked: who === 'all' ? ev('scheduler_booked', notPortal, false) : ev('scheduler_booked', mine, true),
        consultBooked: tally('consultBooked'),
        consultHeld: tally('consultHeld'),
        paidBooked: tally('paidBooked'),
        dna: tally('dna'),
        slots: supply ? supply.count : null,
        slotDays: supply ? supply.days : [],
        timeRequests: reqIn.filter((r) => who === 'all' || r.practitioner === who).length,
        partial: Array.from(new Set(partial)),
      });
    }
  }
  return rows;
}

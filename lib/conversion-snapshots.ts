import { list } from '@vercel/blob';
import { blobLedger } from '@/lib/blob-ledger';
import { readConversions, parseConversions, diffLogs, type ConversionLog } from '@/lib/conversion-log';

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
};

export function parseSnapshot(raw: unknown): Snapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<Snapshot>;
  if (typeof r.takenAt !== 'string') return null;
  return {
    takenAt: r.takenAt,
    conversions: parseConversions(r.conversions),
    ...(r.bookings !== undefined ? { bookings: r.bookings } : {}),
  };
}

/** Copies the counters to this week's snapshot. A second run the same day
 *  overwrites that day's copy, so a retried cron leaves one file. */
export async function takeSnapshot(now = new Date()): Promise<{ key: string; total: number; bookings: boolean } | { skipped: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { skipped: 'BLOB_READ_WRITE_TOKEN is not set' };
  const conversions = await readConversions({ fresh: true });
  const bookings = await blobLedger(ALSO_COPIED).read().catch(() => null);
  const snap: Snapshot = {
    takenAt: now.toISOString(),
    conversions,
    ...(bookings ? { bookings: bookings.body } : {}),
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

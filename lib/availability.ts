import { put, get } from '@vercel/blob';
import { site } from '@/lib/site';

/* Bookable hours, editable from /admin.
 *
 * These were hardcoded in lib/site.ts, so changing when the practice works
 * meant an edit and a redeploy. They appear in four places — the footer, the
 * contact block, the LocalBusiness schema and the portal — and the whole point
 * of one source is that those cannot disagree.
 *
 * site.availability remains the fallback, so the site is correct before anyone
 * has touched this and if the store is ever unreachable. It is not a duplicate
 * of the data; it is the default value of it.
 *
 * IT DOES NOT CONTROL BOOKING. Cliniko decides what can actually be booked.
 * This is what the website tells people, and the admin screen says plainly that
 * the two must be kept in step — a site advertising hours Cliniko will not
 * offer is worse than one that says nothing.
 */

const KEY = 'portal/availability.json';

export type Window = { day: string; from: string; to: string };
export type Availability = { windows: Window[]; updatedAt: string; updatedBy: string };

export const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
] as const;

const FALLBACK: Availability = {
  windows: site.availability.map((a) => ({ day: a.day, from: a.from, to: a.to })),
  updatedAt: '',
  updatedBy: '',
};

/* Same split as lib/clients.ts, for the same reason: Blob reads are not
 * read-after-write consistent, so a write this process made must outrank
 * whatever the store is still serving. Without it, adding a window and then
 * re-rendering the table showed the previous list — which reads as the save
 * having silently failed. */
let cache: { at: number; value: Availability } | null = null;
let lastWrite: { at: number; value: Availability } | null = null;
const CACHE_MS = 60_000;
const WRITE_AUTHORITY_MS = 90_000;

/** Sorted into week order rather than entry order, so the table always reads
 *  the way a week does regardless of what order they were typed. */
function inWeekOrder(w: Window[]): Window[] {
  return [...w].sort((a, b) => DAYS.indexOf(a.day as never) - DAYS.indexOf(b.day as never));
}

export async function readAvailability(opts?: { fresh?: boolean }): Promise<Availability> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return FALLBACK;

  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return FALLBACK;
    const parsed = (await new Response(hit.stream).json()) as Partial<Availability>;
    const windows = (Array.isArray(parsed.windows) ? parsed.windows : [])
      .filter((w) => w && DAYS.includes(w.day as never) && w.from && w.to);
    // An empty stored list means "not set", not "never available" — falling
    // back beats publishing a practice with no hours at all.
    if (!windows.length) return FALLBACK;
    const value: Availability = {
      windows: inWeekOrder(windows),
      updatedAt: String(parsed.updatedAt ?? ''),
      updatedBy: String(parsed.updatedBy ?? ''),
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return cache?.value ?? FALLBACK;
  }
}

export async function writeAvailability(
  windows: Window[], updatedBy: string
): Promise<Availability> {
  const clean = windows
    .filter((w) => DAYS.includes(w.day as never) && w.from.trim() && w.to.trim())
    .map((w) => ({ day: w.day, from: w.from.trim(), to: w.to.trim() }));

  const value: Availability = {
    windows: inWeekOrder(clean),
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };
  await put(KEY, JSON.stringify(value, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return value;
}

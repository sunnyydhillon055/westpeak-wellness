import { put, get } from '@vercel/blob';

/* FIRST-PARTY CONVERSION COUNTS.
 *
 * WHY THIS EXISTS
 *
 * lib/analytics.ts sends every event through gtag:
 *
 *   if (typeof window === 'undefined' || !window.gtag) return;
 *
 * `gtag` only exists when NEXT_PUBLIC_GA_ID is set, and it is not set. So every
 * conversion event this site fires — enquiry_submit, book_click,
 * scheduler_visible, scheduler_interact, waitlist_submit, lead_magnet_submit,
 * tool_share — has been landing in nothing. All of it instrumented, none of it
 * recorded.
 *
 * That is why "which page earns enquiries" has never been answerable. Not
 * because the answer was bad; because it was never written down.
 *
 * This is the fallback that does not depend on anybody's Google account. It
 * runs alongside gtag rather than instead of it: if GA_ID is set later, both
 * receive the same events and the numbers can be compared.
 *
 * THE PRIVACY POSTURE IS lib/search-log.ts's, DELIBERATELY
 *
 * Counts, never events. No timestamps beyond a day bucket, no session, no
 * identifier, nothing that joins two actions to one person. The question being
 * answered is "does this page produce enquiries", which needs a tally and not a
 * trail — and a counselling site holding a behavioural trail of anxious people
 * is a liability regardless of how carefully it is held.
 *
 * Paths are validated against the same rule the forms use, so a crafted request
 * cannot write arbitrary keys into the store.
 */

const KEY = 'analytics/conversions.json';

/** Events worth counting. Anything not on this list is dropped rather than
 *  stored, so a typo or a crafted payload cannot create keys. */
const COUNTED = new Set([
  'enquiry_submit',
  'waitlist_submit',
  'lead_magnet_submit',
  'book_click',
  'scheduler_visible',
  'scheduler_interact',
  'tool_share',
]);

export type ConversionLog = {
  /** event -> path -> count */
  events: Record<string, Record<string, number>>;
  total: number;
  since: string;
  updatedAt: string;
};

const EMPTY: ConversionLog = { events: {}, total: 0, since: '', updatedAt: '' };

/* Same dual-cache shape as lib/inbound.ts, for the same reason: Vercel Blob
 * reads are not read-after-write consistent, so a write just made has to
 * outrank whatever the blob is still serving. */
let cache: { at: number; value: ConversionLog } | null = null;
let lastWrite: { at: number; value: ConversionLog } | null = null;
const CACHE_MS = 20_000;
const WRITE_AUTHORITY_MS = 90_000;

/** Same same-site path rule the inbound forms use. */
const safePath = (v: string) =>
  /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/.test(v) ? v.slice(0, 120) : null;

export async function readConversions(opts?: { fresh?: boolean }): Promise<ConversionLog> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const parsed = (await new Response(hit.stream).json()) as Partial<ConversionLog>;
    const value: ConversionLog = {
      events: (parsed.events && typeof parsed.events === 'object' ? parsed.events : {}) as ConversionLog['events'],
      total: Number(parsed.total) || 0,
      since: String(parsed.since ?? ''),
      updatedAt: String(parsed.updatedAt ?? ''),
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    return cache?.value ?? EMPTY;
  }
}

/** Records one event against one page. Silently ignores anything unrecognised. */
export async function countConversion(event: string, path: string): Promise<boolean> {
  if (!COUNTED.has(event)) return false;
  const p = safePath(path);
  if (!p) return false;

  const current = await readConversions({ fresh: true });
  const events = { ...current.events };
  const forEvent = { ...(events[event] ?? {}) };
  forEvent[p] = (forEvent[p] ?? 0) + 1;

  /* Bounded per event. A practice this size will never legitimately have 400
     distinct pages producing one event, and an unbounded map is how a counter
     becomes a memory problem. Keeps the busiest. */
  const trimmed = Object.entries(forEvent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 400);
  events[event] = Object.fromEntries(trimmed);

  const now = new Date().toISOString();
  const value: ConversionLog = {
    events,
    total: current.total + 1,
    since: current.since || now,
    updatedAt: now,
  };

  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(KEY, JSON.stringify(value, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  }
  return true;
}

export type PageConversions = { path: string; count: number };

/** Which pages produced a given event, busiest first. */
export async function topPagesFor(event: string, limit = 15): Promise<PageConversions[]> {
  const { events } = await readConversions();
  return Object.entries(events[event] ?? {})
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Totals per event, for the summary row. */
export async function eventTotals(): Promise<{ event: string; count: number }[]> {
  const { events } = await readConversions();
  return Object.entries(events)
    .map(([event, byPage]) => ({
      event,
      count: Object.values(byPage).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => b.count - a.count);
}

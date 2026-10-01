import { put, get } from '@vercel/blob';
import { acceptedDetail, splitBookDetail } from '@/lib/conversion-detail';

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
 * scheduler_visible, scheduler_interact, lead_magnet_submit,
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
 *
 * ONE MORE COLUMN — 1 Oct 2026
 *
 * Six weeks of counts could not say which counsellor a booking click was for
 * or which button produced it, because only the pathname was stored and
 * `?with=` and `location` went to gtag. An event may now carry one `detail`,
 * accepted only from the list in lib/conversion-detail.ts (roster slugs, the
 * fixed CTA locations, the tools' outcomes) and dropped otherwise while the
 * event is still counted. It is kept as a second map beside the first —
 * event → detail → count next to event → path → count — so every reader of
 * the old shape (/admin, the funnel email, the scratch scripts) reads the
 * file exactly as before, and the two never have to be joined: they are both
 * tallies of the same events, cut two ways.
 */

const KEY = 'analytics/conversions.json';

/** Events worth counting. Anything not on this list is dropped rather than
 *  stored, so a typo or a crafted payload cannot create keys. */
const COUNTED = new Set([
  /* A visit that arrived from an AI assistant — ChatGPT, Gemini, Claude,
     Perplexity, Copilot — counted per landing page (25 Sep 2026). The whole
     machine-readable layer exists to earn these, and nothing was recording
     whether it does. The referrer host is classified in the browser and only
     the class is sent; no URL, no query, no identifier. */
  'ai_referral',
  /* A visit that arrived from the Google Business Profile's website button,
     identified by ?utm_source=gbp on the link. 26 Sep 2026. */
  'gbp_visit',
  /* Both form events are counted by the server when the record is stored
     (lib/inbound-submit.ts), not by the browser. 1 Oct 2026: six weeks of
     a beacon fired in onSubmit of a native POST recorded 3 of 40 enquiries
     and 0 of 68 leads — the navigation outran it. The inbound store already
     knew the true numbers; now this one agrees with it. */
  'enquiry_submit',
  'lead_magnet_submit',
  'book_click',
  /* The direct-to-Cliniko link on /book, beside the embedded frame (17 Sep 2026). */
  'book_direct',
  'scheduler_visible',
  'scheduler_interact',
  'tool_share',
  /* Finishing a tool is the most qualified moment on the site, and what the
     tool concluded says which service page the warm reader was pointed at.
     Fired and dropped since the tools were built; counted from 1 Oct 2026. */
  'tool_complete',
]);

export type ConversionLog = {
  /** event -> path -> count */
  events: Record<string, Record<string, number>>;
  /** event -> detail -> count. Absent in files written before 1 Oct 2026, and
   *  always a subset of `events`: an event with no accepted detail counts in
   *  `events` only, so the difference between the two is "unattributed". */
  details: Record<string, Record<string, number>>;
  total: number;
  since: string;
  updatedAt: string;
};

const EMPTY: ConversionLog = { events: {}, details: {}, total: 0, since: '', updatedAt: '' };

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

const countMap = (v: unknown): ConversionLog['events'] =>
  (v && typeof v === 'object' ? v : {}) as ConversionLog['events'];

export async function readConversions(opts?: { fresh?: boolean }): Promise<ConversionLog> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    const hit = await get(KEY, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const parsed = (await new Response(hit.stream).json()) as Partial<ConversionLog>;
    const value: ConversionLog = {
      events: countMap(parsed.events),
      details: countMap(parsed.details),
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

/* Bounded per event. A practice this size will never legitimately have 400
   distinct pages producing one event, and an unbounded map is how a counter
   becomes a memory problem. Keeps the busiest. The detail map is bounded by
   its allow-list already (under 40 keys for the widest event) and is trimmed
   the same way so a file written by older code with stray keys cannot grow. */
const TRIM = 400;
const bump = (m: Record<string, number> | undefined, key: string): Record<string, number> => {
  const next = { ...(m ?? {}) };
  next[key] = (next[key] ?? 0) + 1;
  return Object.fromEntries(Object.entries(next).sort((a, b) => b[1] - a[1]).slice(0, TRIM));
};

/** Records one event against one page, and against one detail when the
 *  detail is on the event's allow-list. Silently ignores anything unrecognised. */
export async function countConversion(event: string, path: string, detail?: unknown): Promise<boolean> {
  if (!COUNTED.has(event)) return false;
  const p = safePath(path);
  if (!p) return false;
  const d = acceptedDetail(event, detail);

  const current = await readConversions({ fresh: true });
  const events = { ...current.events, [event]: bump(current.events[event], p) };
  const details = d ? { ...current.details, [event]: bump(current.details[event], d) } : current.details;

  const now = new Date().toISOString();
  const value: ConversionLog = {
    events,
    details,
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

export type DetailConversions = { detail: string; count: number };

const sum = (m: Record<string, number> | undefined) => Object.values(m ?? {}).reduce((a, b) => a + b, 0);

/** Which detail keys an event was counted under, busiest first, plus the
 *  number of that event that carried no accepted detail — so a reader can
 *  see "34 clicks, 20 attributed" rather than a list that quietly omits the
 *  rest. Pure, so the funnel email and /admin cut one read the same way. */
export function detailsOf(log: ConversionLog, event: string, limit = 20): { rows: DetailConversions[]; unattributed: number } {
  const rows = Object.entries(log.details?.[event] ?? {})
    .map(([detail, count]) => ({ detail, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  return { rows, unattributed: Math.max(0, sum(log.events[event]) - sum(log.details?.[event])) };
}

export async function detailsFor(event: string, limit = 20) {
  return detailsOf(await readConversions(), event, limit);
}

export type BookClickBreakdown = {
  total: number;
  byLocation: DetailConversions[];
  byCounsellor: DetailConversions[];
  /** Clicks whose link named nobody — the header and most bands. */
  noCounsellor: number;
  /** Clicks counted before 1 Oct 2026, or from a CTA not on the list. */
  unattributed: number;
};

/** `book_click` cut by the button and by the counsellor the link named. One
 *  key holds both halves (lib/conversion-detail.ts), so this is a split, not
 *  a join, and both columns sum to the attributed total. */
export function bookClickBreakdown(log: ConversionLog): BookClickBreakdown {
  const byLocation: Record<string, number> = {};
  const byCounsellor: Record<string, number> = {};
  let noCounsellor = 0;
  for (const [key, n] of Object.entries(log.details?.book_click ?? {})) {
    const { location, who } = splitBookDetail(key);
    byLocation[location] = (byLocation[location] ?? 0) + n;
    if (who) byCounsellor[who] = (byCounsellor[who] ?? 0) + n;
    else noCounsellor += n;
  }
  const rows = (m: Record<string, number>) =>
    Object.entries(m).map(([detail, count]) => ({ detail, count })).sort((a, b) => b.count - a.count);
  return {
    total: sum(log.events.book_click),
    byLocation: rows(byLocation),
    byCounsellor: rows(byCounsellor),
    noCounsellor,
    unattributed: Math.max(0, sum(log.events.book_click) - sum(log.details?.book_click)),
  };
}

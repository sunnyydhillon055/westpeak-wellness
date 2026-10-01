import { blobLedger, memoryLedger, casUpdate, type LedgerIO, type CasOptions } from '@/lib/blob-ledger';
import { acceptedDetail, splitBookDetail, splitLandingKey, PORTAL_PREFIX, BOOKED_DIRECT } from '@/lib/conversion-detail';

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
     identified by ?utm_source=gbp on the link. 26 Sep 2026. Superseded on
     1 Oct 2026 by channel_visit with detail `gbp`; still accepted so a page
     loaded before the deploy is not lost, and read back into the gbp row by
     channelVisits() below. */
  'gbp_visit',
  /* A visit whose link carried ?utm_source= naming one of the fixed
     channels (lib/conversion-detail-client.ts): a directory, a family
     practice, an HR team. Once per session, against the landing page; the
     channel is the detail. Names a kind of organisation, never a person. */
  'channel_visit',
  /* The first page of a session, with the referrer reduced in the browser to
     one class (google, bing, duckduckgo, ai, listing, none, other). The
     denominator the booking clicks never had. 1 Oct 2026. */
  'landing',
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
  /* The gated calendar on /book mounted, and how: detail `button` or `hash`
     (components/SchedulerGate, 1 Oct 2026). Since #calendar opens the frame
     on arrival, scheduler_visible alone no longer says somebody pressed
     "Show available times"; this says which. */
  'scheduler_open',
  /* Cliniko's confirmation from inside the embedded calendar — the step
     after scheduler_interact that was never measured. Per counsellor and
     surface, like the two before it. 1 Oct 2026. */
  'scheduler_booked',
  /* The landing page and channel of the visit, beside the booking click and
     the confirmed booking it led to, and the button that opened the
     calendar. Sent by lib/analytics.ts alongside book_click and
     scheduler_booked; see landingKeyOk in lib/conversion-detail.ts. */
  'click_from',
  'booked_from',
  'booked_via',
  /* A mailto: link pressed. StickyBook has fired it since 18 Aug and it was
     dropped here; every mailto: now goes through components/MailLink.tsx. */
  'email_click',
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
  /** event -> the UTC day it was first counted, for events first counted on
   *  or after 1 Oct 2026. Absent for everything older (those began at
   *  `since` or soon after). It is what lets /admin say "landings counted
   *  since 2 Oct" beside clicks counted since 18 Aug, rather than dividing
   *  one by the other as if they covered the same weeks. */
  firstSeen?: Record<string, string>;
};

const EMPTY: ConversionLog = { events: {}, details: {}, total: 0, since: '', updatedAt: '' };

/* READS, WRITES AND THE CACHE BETWEEN THEM — 1 Oct 2026.
 *
 * This used to keep the instance's own last write as the answer to every read
 * for 90 seconds, including the "fresh" read countConversion() built its next
 * value on, and then wrote with a plain put(). With two serverless instances
 * counting at once — /book fires three events seconds apart — each wrote its
 * own copy plus one over the other's, and increments vanished. Every write now
 * goes through casUpdate (lib/blob-ledger.ts): read with the ETag, write with
 * `ifMatch`, re-read and re-apply on a refusal. A fresh read always goes to
 * the store; the short cache serves /admin and nothing that writes. */
const CACHE_MS = 20_000;

/** Same same-site path rule the inbound forms use. */
const safePath = (v: string) =>
  /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/.test(v) ? v.slice(0, 120) : null;

const countMap = (v: unknown): ConversionLog['events'] =>
  (v && typeof v === 'object' && !Array.isArray(v) ? v : {}) as ConversionLog['events'];

/** Whatever is stored, read as a log. Pure; tolerant of files written by
 *  older code (no `details`) and of nothing at all. */
export function parseConversions(raw: unknown): ConversionLog {
  if (!raw || typeof raw !== 'object') return { ...EMPTY, events: {}, details: {} };
  const parsed = raw as Partial<ConversionLog>;
  return {
    events: countMap(parsed.events),
    details: countMap(parsed.details),
    total: Number(parsed.total) || 0,
    since: String(parsed.since ?? ''),
    updatedAt: String(parsed.updatedAt ?? ''),
    ...(parsed.firstSeen && typeof parsed.firstSeen === 'object' && !Array.isArray(parsed.firstSeen)
      ? { firstSeen: parsed.firstSeen as Record<string, string> }
      : {}),
  };
}

/* Bounded per event. A practice this size will never legitimately have 400
   distinct pages producing one event, and an unbounded map is how a counter
   becomes a memory problem. Keeps the busiest. The detail map is bounded by
   its allow-list already (under 60 keys for the widest event) and is trimmed
   the same way so a file written by older code with stray keys cannot grow. */
const TRIM = 400;
const bump = (m: Record<string, number> | undefined, key: string): Record<string, number> => {
  const next = { ...(m ?? {}) };
  next[key] = (next[key] ?? 0) + 1;
  return Object.fromEntries(Object.entries(next).sort((a, b) => b[1] - a[1]).slice(0, TRIM));
};

/** One increment applied to a log. Pure, so the retry can re-apply it to
 *  whatever the store holds now rather than to what it held before. */
export function withIncrement(current: ConversionLog, event: string, path: string, detail: string | null, now: string): ConversionLog {
  return {
    events: { ...current.events, [event]: bump(current.events[event], path) },
    details: detail ? { ...current.details, [event]: bump(current.details[event], detail) } : current.details,
    total: current.total + 1,
    since: current.since || now,
    updatedAt: now,
    /* Only when this event has never been counted before: an event that was
       already in the file began some earlier day this cannot know. */
    ...(current.events[event] || current.firstSeen?.[event]
      ? current.firstSeen ? { firstSeen: current.firstSeen } : {}
      : { firstSeen: { ...(current.firstSeen ?? {}), [event]: now.slice(0, 10) } }),
  };
}

export type ConversionStore = {
  read(opts?: { fresh?: boolean }): Promise<ConversionLog>;
  count(event: string, path: string, detail?: unknown): Promise<boolean>;
};

/** A store over one ledger. The module's own store (below) is the blob in
 *  production; tests build two over one shared memory file to stand for two
 *  serverless instances. */
export function createConversionStore(io: () => LedgerIO | null, opts: CasOptions = {}): ConversionStore {
  let cache: { at: number; value: ConversionLog } | null = null;

  async function read(o?: { fresh?: boolean }): Promise<ConversionLog> {
    if (!o?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
    const ledger = io();
    if (!ledger) return EMPTY;
    try {
      const hit = await ledger.read();
      const value = parseConversions(hit?.body ?? null);
      cache = { at: Date.now(), value };
      return value;
    } catch {
      return cache?.value ?? EMPTY;
    }
  }

  async function count(event: string, path: string, detail?: unknown): Promise<boolean> {
    if (!COUNTED.has(event)) return false;
    const p = safePath(path);
    if (!p) return false;
    const d = acceptedDetail(event, detail);
    const ledger = io();
    if (!ledger) return true;
    const written = await casUpdate(
      ledger,
      parseConversions,
      (current) => withIncrement(current, event, p, d, new Date().toISOString()),
      { label: 'conversion-log', ...opts }
    );
    if (written) cache = { at: Date.now(), value: written };
    return true;
  }

  return { read, count };
}

/* Without a Blob token (local, previews, unit tests) the counts live in this
   process, which is what the module always did there. */
const local = memoryLedger();
const store = createConversionStore(() => (process.env.BLOB_READ_WRITE_TOKEN ? blobLedger(KEY) : local));

export function readConversions(opts?: { fresh?: boolean }): Promise<ConversionLog> {
  return store.read(opts);
}

/** Records one event against one page, and against one detail when the
 *  detail is on the event's allow-list. Silently ignores anything unrecognised. */
export function countConversion(event: string, path: string, detail?: unknown): Promise<boolean> {
  return store.count(event, path, detail);
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

export type CalendarRow = {
  /** Roster slug. */
  who: string;
  /** /book's free-consultation calendar, or the portal's paid one. Before
   *  1 Oct 2026 the portal sent the bare slug, so its older counts sit under
   *  'book'; the split is exact from that date. */
  surface: 'book' | 'portal';
  seen: number;
  touched: number;
  opened: number;
  /** Cliniko confirmed a booking in this calendar. Counted from 1 Oct 2026. */
  booked: number;
};

export type FunnelCuts = {
  calendar: CalendarRow[];
  toolOutcomes: { rows: DetailConversions[]; unattributed: number };
  magnets: { rows: DetailConversions[]; unattributed: number };
};

/** The calendar by counsellor and surface, the tools' outcomes and the
 *  one-pagers, cut from one read. Was assembled inline in /admin; shared on
 *  1 Oct 2026 so the monthly email prints the same rows. Pure. */
export function funnelCuts(log: ConversionLog): FunnelCuts {
  const seen = detailsOf(log, 'scheduler_visible');
  const touched = detailsOf(log, 'scheduler_interact');
  const opened = detailsOf(log, 'book_direct');
  const booked = detailsOf(log, 'scheduler_booked');
  const at = (rows: DetailConversions[], key: string) => rows.find((r) => r.detail === key)?.count ?? 0;
  const keys = Array.from(new Set([...seen.rows, ...touched.rows, ...opened.rows, ...booked.rows].map((r) => r.detail)));
  const calendar = keys.map((key): CalendarRow => {
    const portal = key.startsWith(PORTAL_PREFIX);
    return {
      who: portal ? key.slice(PORTAL_PREFIX.length) : key,
      surface: portal ? 'portal' : 'book',
      seen: at(seen.rows, key),
      touched: at(touched.rows, key),
      opened: at(opened.rows, key),
      booked: at(booked.rows, key),
    };
  }).sort((a, b) => (a.surface === b.surface ? b.seen - a.seen : a.surface === 'book' ? -1 : 1));
  return {
    calendar,
    toolOutcomes: detailsOf(log, 'tool_complete'),
    magnets: detailsOf(log, 'lead_magnet_submit'),
  };
}

/** Visits by the channel their link named, busiest first. The gbp row
 *  includes the `gbp_visit` events counted before channel_visit replaced it
 *  (26 Sep to 1 Oct 2026), so the profile's history is not cut in two. */
export function channelVisits(log: ConversionLog): DetailConversions[] {
  const m: Record<string, number> = { ...(log.details?.channel_visit ?? {}) };
  const legacyGbp = sum(log.events.gbp_visit);
  if (legacyGbp) m.gbp = (m.gbp ?? 0) + legacyGbp;
  return Object.entries(m)
    .map(([detail, count]) => ({ detail, count }))
    .sort((a, b) => b.count - a.count || a.detail.localeCompare(b.detail));
}

export type ClicksOfLandings = { path: string; clicks: number; landings: number };

/** Each page's booking clicks beside the sessions that began on it, busiest
 *  first by clicks. Pure, so /admin's all-time list and its last-7-days panel
 *  (two snapshots diffed) cut the same way. */
export function clicksOfLandings(log: ConversionLog, limit = 15): ClicksOfLandings[] {
  const landings = log.events.landing ?? {};
  return Object.entries(log.events.book_click ?? {})
    .map(([path, clicks]) => ({ path, clicks, landings: landings[path] ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks || b.landings - a.landings)
    .slice(0, limit);
}

export type EventDiff = {
  event: string;
  count: number;
  byPath: { key: string; count: number }[];
  byDetail: { key: string; count: number }[];
};

const delta = (a: Record<string, number> | undefined, b: Record<string, number> | undefined) =>
  Object.entries(b ?? {})
    .map(([key, n]) => ({ key, count: Math.max(0, n - (a?.[key] ?? 0)) }))
    .filter((r) => r.count > 0)
    .sort((x, y) => y.count - x.count || x.key.localeCompare(y.key));

/** What was counted between two copies of the log: `newer` minus `older`, by
 *  event, path and detail. A key that shrank (trimmed out of a full map)
 *  counts as zero rather than negative. Pure. */
export function diffLogs(older: ConversionLog, newer: ConversionLog): { total: number; events: EventDiff[] } {
  const events = Object.keys(newer.events)
    .map((event) => {
      const byPath = delta(older.events[event], newer.events[event]);
      return {
        event,
        count: byPath.reduce((n, r) => n + r.count, 0),
        byPath,
        byDetail: delta(older.details?.[event], newer.details?.[event]),
      };
    })
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count || a.event.localeCompare(b.event));
  return { total: Math.max(0, newer.total - older.total), events };
}

/* ---- which landing and which button led to a booking — 1 Oct 2026 ------- */

export type LandingCredit = {
  /** The first page of the session. */
  path: string;
  /** The ?utm_source= channel its link named, or its referrer class. */
  via: string;
  clicks: number;
  booked: number;
};

export type ButtonCredit = { button: string; clicks: number; booked: number };

export type BookingCredit = {
  byLanding: LandingCredit[];
  byButton: ButtonCredit[];
  /** Confirmed bookings on /book (the portal's are rebookings and are not
   *  credited to a landing), and how many of them carried a landing. */
  booked: number;
  bookedWithLanding: number;
};

/** Booking clicks and confirmed bookings credited to the page the visit
 *  began on, and to the button pressed last before the calendar. Pure;
 *  /admin and the monthly email print the same rows. A visit that began
 *  before 1 Oct 2026 has no landing to credit and is left out of byLanding,
 *  which is why the unattributed number is printed beside it. */
export function bookingCredit(log: ConversionLog, limit = 20): BookingCredit {
  const m = new Map<string, LandingCredit>();
  const row = (key: string) => {
    let r = m.get(key);
    if (!r) { const { path, via } = splitLandingKey(key); r = { path, via, clicks: 0, booked: 0 }; m.set(key, r); }
    return r;
  };
  for (const [k, n] of Object.entries(log.details?.click_from ?? {})) row(k).clicks += n;
  for (const [k, n] of Object.entries(log.details?.booked_from ?? {})) row(k).booked += n;
  const byLanding = [...m.values()]
    .sort((a, b) => b.booked - a.booked || b.clicks - a.clicks || a.path.localeCompare(b.path))
    .slice(0, limit);

  const buttons = new Map<string, ButtonCredit>();
  const brow = (k: string) => {
    let r = buttons.get(k);
    if (!r) { r = { button: k, clicks: 0, booked: 0 }; buttons.set(k, r); }
    return r;
  };
  for (const r of bookClickBreakdown(log).byLocation) brow(r.detail).clicks += r.count;
  for (const [k, n] of Object.entries(log.details?.booked_via ?? {})) brow(k).booked += n;
  const byButton = [...buttons.values()].sort((a, b) =>
    b.booked - a.booked || b.clicks - a.clicks || (a.button === BOOKED_DIRECT ? 1 : 0) - (b.button === BOOKED_DIRECT ? 1 : 0) || a.button.localeCompare(b.button));

  return {
    byLanding,
    byButton,
    booked: sum(log.details?.booked_via),
    bookedWithLanding: sum(log.details?.booked_from),
  };
}

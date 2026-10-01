'use client';

/* One place that knows how events are named and sent.
 *
 * Components call track('book_click', { location: 'hero' }) and never touch
 * gtag directly, so renaming an event or swapping the analytics vendor is one
 * edit rather than a search across the codebase.
 *
 * No-ops when GA4 is not configured, which is the normal state locally and on
 * previews. Nothing here throws — analytics must never be able to break a page.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, event: string, params?: Params) => void;
  }
}

/* Deliberately no GA_ID export. This is a 'use client' module: a server
 * component importing a value from it receives a client-reference proxy, which
 * is truthy even when the env var is unset. The layout once guarded
 * `GA_ID && <GoogleAnalytics/>` on exactly that proxy and shipped
 * gtag/js?id=undefined on all 193 pages. Server code must read
 * process.env.NEXT_PUBLIC_GA_ID directly. */

/* STAFF BROWSERS ARE NOT COUNTED — 1 Oct 2026. At about fifteen calendar
 * opens a week, the 25 production loads of /book made by builders on 1 Oct
 * were most of a week's signal. /admin has a switch that sets this key on
 * the browser it is pressed in (components/NoCountSwitch.tsx); while it is
 * set nothing is sent, to GA or to the counter. Read inside try/catch: a
 * browser that blocks storage is counted, never broken. */
export const NO_COUNT_KEY = 'wp-no-count';

export function excludedBrowser(): boolean {
  try {
    return !!window.localStorage.getItem(NO_COUNT_KEY);
  } catch {
    return false;
  }
}

/* WHICH LANDING AND WHICH BUTTON — 1 Oct 2026.
 *
 * components/Analytics.tsx keeps the session's landing as
 * "<path>|<channel or referrer class>" under LANDING_KEY (it kept only '1'
 * before, so a session begun before this deploy credits nothing). Every
 * book_click remembers its button under LAST_BUTTON_KEY. Both are
 * sessionStorage: they end with the tab and never leave the browser except
 * as the bounded detail of the three events below, which the server checks
 * against lib/conversion-detail.ts like every other detail.
 *
 *   book_click        also sends click_from  (the landing)
 *   scheduler_booked  also sends booked_from (the landing) and booked_via
 *                     (the last button, or 'direct'), on /book only: a
 *                     booking in the client portal is a client rebooking,
 *                     not a visit the landing page earned.
 *
 * The companions go to the counter only, not to gtag. */
export const LANDING_KEY = 'wp-land';
const LAST_BUTTON_KEY = 'wp-last-book';

const session = (k: string): string | null => {
  try {
    return window.sessionStorage.getItem(k);
  } catch {
    return null;
  }
};

/** The landing key, or undefined for a session that began without one. */
const landingKey = (): string | undefined => {
  const v = session(LANDING_KEY);
  return v && v.includes('|') ? v : undefined;
};

function companions(event: TrackedEvent, detail: string | undefined): [string, string | undefined][] {
  if (event === 'book_click') {
    /* The button half of "sticky/camille-granda". */
    const button = detail ? detail.split('/')[0] : undefined;
    if (button) {
      try { window.sessionStorage.setItem(LAST_BUTTON_KEY, button); } catch { /* never load-bearing */ }
    }
    const from = landingKey();
    return from ? [['click_from', from]] : [];
  }
  if (event === 'scheduler_booked' && !(detail ?? '').startsWith('portal:')) {
    const from = landingKey();
    return [
      ...(from ? [['booked_from', from] as [string, string]] : []),
      ['booked_via', session(LAST_BUTTON_KEY) || 'direct'],
    ];
  }
  return [];
}

function beacon(event: string, detail: string | undefined): void {
  const body = JSON.stringify({ event, path: window.location.pathname, detail });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
  } else {
    void fetch('/api/track', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {});
  }
}

export function track(event: TrackedEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  if (excludedBrowser()) return;

  /* GA, when it is configured. */
  try {
    if (window.gtag) window.gtag('event', event, params);
  } catch {
    /* analytics is never load-bearing */
  }

  /* AND the first-party counter, which does not depend on anybody's Google
   * account. Until NEXT_PUBLIC_GA_ID was set, the gtag guard above meant every
   * event on this site was discarded — all of it instrumented, none of it
   * recorded, which is why "which page earns enquiries" had never been
   * answerable. See lib/conversion-log.ts.
   *
   * The pathname and, since 1 Oct 2026, `params.detail` — the one bounded
   * dimension the counter accepts (lib/conversion-detail.ts): which button,
   * which counsellor, which tool outcome. Everything else in `params` is for
   * gtag only and never leaves the browser otherwise; the query string is not
   * sent, which is why a counsellor is named in `detail` rather than read
   * from `?with=` on the server.
   *
   * sendBeacon so it survives the page unloading, which is exactly when a
   * book_click fires. Falls back to keepalive fetch where beacon is missing. */
  try {
    const detail = typeof params.detail === 'string' ? params.detail : undefined;
    beacon(event, detail);
    for (const [e, d] of companions(event, detail)) beacon(e, d);
  } catch {
    /* same rule: never load-bearing */
  }
}

/* The events this site sends.
 *
 * The parameter on `track` is this union, not `string`. It used to be `string`
 * while the comment here claimed a typo would be a build error — which it was
 * not, and `tool_share` had already been shipping for some time without ever
 * being listed. A misspelled event does not fail; it just never appears in the
 * reports, and the absence looks exactly like nobody doing the thing.
 *
 * Every entry below is fired by real code. Do not add one speculatively: an
 * event declared and never sent reads in the dashboard as a metric at zero,
 * which is indistinguishable from a broken funnel. */
export type TrackedEvent =
  | 'ai_referral'
  /* Which kind of organisation's link brought the visit (?utm_source= from a
   * fixed list), and the landing page's referrer reduced to a class. Both
   * once per session, both a word from a list in
   * lib/conversion-detail-client.ts. `gbp_visit` was the first, single-value
   * version of channel_visit and is no longer sent. 1 Oct 2026. */
  | 'channel_visit'
  | 'landing'
  | 'book_click'
  | 'book_direct'
  /* `enquiry_submit` and `lead_magnet_submit` are not here because the browser
   * no longer sends them. Both forms are native POSTs, and a beacon fired in
   * onSubmit lost the race with the navigation often enough that six weeks
   * recorded 3 of 40 enquiries and none of 68 leads. The server counts them
   * when it stores the record — lib/inbound-submit.ts — so the number is the
   * inbound store's, and nothing counts twice. 1 Oct 2026. */
  /* The booking embed is a third-party iframe and therefore opaque: nothing
   * inside it can be read from this origin. These two bracket it — reached and
   * scrolled into view, then interacted with — which is enough to tell
   * "nobody gets there" apart from "they get there and leave". Without that
   * distinction every conversion fix is a guess. See components/SchedulerEmbed. */
  | 'scheduler_visible'
  | 'scheduler_interact'
  /* The calendar on /book mounted, by the button (`button`) or by arriving
   * at #calendar (`hash`). components/SchedulerGate, 1 Oct 2026. */
  | 'scheduler_open'
  /* Cliniko's own confirmation, posted from inside the frame
   * ('cliniko-bookings-page:confirmed', Cliniko help article 4726326) and
   * accepted only from a *.cliniko.com origin. The step after interact that
   * the site could never see. 1 Oct 2026. */
  | 'scheduler_booked'
  | 'tool_start'
  | 'tool_complete'
  | 'tool_share'
  | 'scroll_75'
  | 'outbound_click'
  /* Only fires once NEXT_PUBLIC_PHONE is set and the tel: links exist —
   * see lib/site.ts. Until then it reads as zero, which is accurate. */
  | 'phone_click'
  | 'email_click';

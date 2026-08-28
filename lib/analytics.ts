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

export function track(event: TrackedEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;

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
   * sendBeacon so it survives the page unloading, which is exactly when a
   * book_click fires. Falls back to keepalive fetch where beacon is missing. */
  try {
    const body = JSON.stringify({ event, path: window.location.pathname });
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
  | 'book_click'
  | 'lead_magnet_submit'
  | 'enquiry_submit'
  | 'waitlist_submit'
  /* The booking embed is a third-party iframe and therefore opaque: nothing
   * inside it can be read from this origin. These two bracket it — reached and
   * scrolled into view, then interacted with — which is enough to tell
   * "nobody gets there" apart from "they get there and leave". Without that
   * distinction every conversion fix is a guess. See components/SchedulerEmbed. */
  | 'scheduler_visible'
  | 'scheduler_interact'
  | 'tool_start'
  | 'tool_complete'
  | 'tool_share'
  | 'scroll_75'
  | 'outbound_click';

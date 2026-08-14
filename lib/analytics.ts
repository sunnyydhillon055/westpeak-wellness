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

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function track(event: TrackedEvent, params: Params = {}): void {
  try {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('event', event, params);
  } catch {
    /* analytics is never load-bearing */
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

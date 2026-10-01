'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { clampFrameHeight, fromFrame, parseClinikoMessage } from '@/lib/cliniko-frame';

/* THE MEASUREMENT HOOK FOR A COMPLETED BOOKING.
 *
 * Cliniko posts "cliniko-bookings-page:confirmed" to this window when a
 * booking inside the frame completes. This is the one place that message
 * arrives (the listener below is the only Cliniko listener on the site, and
 * it accepts a message only from the frame's own origin and window), so the
 * count lives here: `scheduler_booked`, with the same detail as the visible
 * and interact events that bracket it, so seen, touched and booked line up
 * per counsellor and surface. Nothing in the message is read beyond its
 * name. Called at most once per mounted frame. 1 Oct 2026. */
function onClinikoBookingConfirmed(ctx: { page: string; who?: string }): void {
  track('scheduler_booked', { page: ctx.page, detail: ctx.who });
}

/* Measures whether anyone actually reaches the booking calendar, and whether
 * they touch it once they do.
 *
 * WHY THIS IS NEEDED AT ALL
 *
 * The calendar is a Cliniko iframe. Same-origin policy means nothing inside it
 * is readable from here — not a click, not a step, not an abandonment. So the
 * site could see people arrive on /book and could see bookings appear in
 * Cliniko, and had no way to tell which of two completely different problems it
 * had:
 *
 *   nobody reaches the calendar   → a page and CTA problem
 *   they reach it and leave       → a calendar, price or availability problem
 *
 * Those have opposite fixes. Guessing between them is how a month gets spent
 * rewriting a hero that was never the issue.
 *
 * HOW THE TWO SIGNALS WORK
 *
 * `scheduler_visible` — IntersectionObserver, fired once when at least half the
 * frame has been on screen. Half rather than any part, because a frame clipped
 * at the bottom edge of the viewport was not really seen.
 *
 * `scheduler_interact` — there is no direct way to observe a click inside a
 * cross-origin frame. The standard proxy: when the page loses focus AND the
 * focused element is our iframe, the click landed inside it. It cannot see what
 * they clicked and does not try to; it distinguishes "engaged" from "looked".
 * A false positive is possible if someone tabs into the frame and stops, which
 * is rare and harmless.
 *
 * PRIVACY. Two counters, the pathname, and — since 1 Oct 2026 — which
 * counsellor's calendar it was when `?with=` narrowed the embed to one, as a
 * roster slug the server allow-lists. Nothing about the appointment, no
 * identifiers, and nothing that describes the person. `track` is already a
 * no-op when GA is not configured, which is its state on every deployment
 * until NEXT_PUBLIC_GA_ID is set.
 *
 * THE FRAME'S OWN MESSAGES — 1 Oct 2026. This wrapper is also the single
 * listener for what Cliniko posts out of the frame (lib/cliniko-frame.ts):
 * the frame takes the height Cliniko asks for, clamped, instead of a fixed
 * 660px box that every step scrolled inside; each step change brings the top
 * of the frame back into view under the header; and the confirmation step
 * goes to onClinikoBookingConfirmed above. Only messages from the frame's own
 * window and origin are read. While a frame is mounted, <html> carries
 * data-scheduler-open, which hides the sticky action bar (app/premium.css):
 * on a phone it covered the bottom of the frame and offered "Pick a time"
 * to someone already picking one.
 */
export default function SchedulerTelemetry({
  page, who, children,
}: { page: string; who?: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    let seen = false;
    let touched = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!seen && e.isIntersecting && e.intersectionRatio >= 0.5) {
            seen = true;
            track('scheduler_visible', { page, detail: who });
            io.disconnect();
          }
        }
      },
      { threshold: [0.5] }
    );
    io.observe(el);

    /* The blur has to be read on the next tick: at the moment the event fires,
     * document.activeElement is still the previously focused element. */
    const onBlur = () => {
      window.setTimeout(() => {
        if (touched) return;
        const active = document.activeElement;
        if (active && active.tagName === 'IFRAME' && el.contains(active)) {
          touched = true;
          track('scheduler_interact', { page, detail: who });
        }
      }, 0);
    };
    window.addEventListener('blur', onBlur);

    /* Cliniko's resize and step messages. The frame keeps its CSS height
       until the first resize arrives, so the first paint is unchanged. */
    let confirmed = false;
    const onMessage = (e: MessageEvent) => {
      const frame = el.querySelector('iframe');
      if (!frame || !fromFrame(e.origin, e.source, frame.src, frame.contentWindow)) return;
      const msg = parseClinikoMessage(e.data);
      if (!msg) return;
      if (msg.kind === 'resize') {
        frame.style.height = `${clampFrameHeight(msg.height)}px`;
        return;
      }
      el.scrollIntoView({ block: 'start' });
      if (msg.page === 'confirmed' && !confirmed) {
        confirmed = true;
        onClinikoBookingConfirmed({ page, who });
      }
    };
    window.addEventListener('message', onMessage);

    const root = document.documentElement;
    root.setAttribute('data-scheduler-open', '');

    return () => {
      io.disconnect();
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('message', onMessage);
      root.removeAttribute('data-scheduler-open');
    };
  }, [page, who]);

  return <div ref={box} className="scheduler-frame">{children}</div>;
}

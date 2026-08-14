'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

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
 * PRIVACY. Two counters and the pathname. Nothing about the appointment, no
 * identifiers, and nothing that describes the person. `track` is already a
 * no-op when GA is not configured, which is its state on every deployment
 * until NEXT_PUBLIC_GA_ID is set.
 */
export default function SchedulerTelemetry({
  page, children,
}: { page: string; children: React.ReactNode }) {
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
            track('scheduler_visible', { page });
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
          track('scheduler_interact', { page });
        }
      }, 0);
    };
    window.addEventListener('blur', onBlur);

    return () => {
      io.disconnect();
      window.removeEventListener('blur', onBlur);
    };
  }, [page]);

  return <div ref={box}>{children}</div>;
}

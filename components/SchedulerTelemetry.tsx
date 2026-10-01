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
 * PRIVACY. Two counters, the pathname, and — since 1 Oct 2026 — which
 * counsellor's calendar it was when `?with=` narrowed the embed to one, as a
 * roster slug the server allow-lists. Nothing about the appointment, no
 * identifiers, and nothing that describes the person. `track` is already a
 * no-op when GA is not configured, which is its state on every deployment
 * until NEXT_PUBLIC_GA_ID is set.
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

    /* `scheduler_booked` — 1 Oct 2026. The frame is opaque, but Cliniko's
     * bookings page posts a message to its parent when a booking is
     * confirmed: 'cliniko-bookings-page:confirmed' (Cliniko help article
     * 4726326). Accepted only from an https origin on cliniko.com, and only
     * from a frame inside this box, so a second calendar on the page or any
     * other window cannot count here. Once per mount. Nothing in the message
     * is read beyond its name: no time, no type, no patient. */
    let booked = false;
    const onMessage = (e: MessageEvent) => {
      if (booked) return;
      try {
        const host = new URL(e.origin).hostname;
        if (!e.origin.startsWith('https://') || !(host === 'cliniko.com' || host.endsWith('.cliniko.com'))) return;
        const frames = Array.from(el.querySelectorAll('iframe'));
        /* The frame itself, or a frame Cliniko nests inside it. `parent` is
           one of the few properties readable across origins. */
        const src = e.source as Window | null;
        if (!src || !frames.some((f) => f.contentWindow === src || f.contentWindow === src.parent)) return;
        const name = typeof e.data === 'string' ? e.data : '';
        if (name !== 'cliniko-bookings-page:confirmed' && !name.startsWith('cliniko-bookings-page:confirmed:')) return;
        booked = true;
        track('scheduler_booked', { page, detail: who });
      } catch { /* never load-bearing */ }
    };
    window.addEventListener('message', onMessage);

    return () => {
      io.disconnect();
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('message', onMessage);
    };
  }, [page, who]);

  return <div ref={box}>{children}</div>;
}

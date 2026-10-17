'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { clampFrameHeight, fromFrame, parseClinikoMessage, stepName } from '@/lib/cliniko-frame';
import { gaLead } from '@/lib/ga-lead';

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
  /* And GA4's lead event, GA only (lib/ga-lead.ts, item 588): the counter
     above already has the booking. The free consultation on /book only; a
     portal booking is a client rebooking, not a lead. */
  if (!(ctx.who ?? '').startsWith('portal:')) gaLead('consult');
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
 *
 * THE WATCHDOG — 2 Oct 2026. Cliniko posts a resize on its first render, so a
 * frame that has been on screen for STALL_MS without one is blocked or blank:
 * Safari's third-party storage rules, a content blocker, a slow Cliniko. onLoad
 * cannot tell, because it fires for an error page too. Then `stalled` (the
 * direct calendar link and the email address, server-rendered by
 * SchedulerEmbed) is shown above the frame, which stays, and
 * `scheduler_stalled` is counted once with the same detail as the events
 * around it, so /admin can set stalls against opens. The clock starts when
 * the frame is first half on screen, not at mount: the portal's frame is
 * lazy and does not load until it is scrolled to. A resize arriving late
 * takes the note away again.
 */
/*
 * EACH STEP — 16 Oct 2026 (item 555). Every other page message is a step
 * change; each new step name is counted once per mounted frame as
 * `scheduler_step`, detail "<step>/<counsellor>" (or the step alone for the
 * practice-wide calendar), so /admin can show where between "touched" and
 * "booked" people stop. lib/cliniko-frame.ts stepName() has the shape.
 *
 * YOU ARE BOOKED — 16 Oct 2026 (item 569). With `booked`, Cliniko's
 * confirmation also puts that panel above the frame, as a status, and moves
 * focus to it, so the first thing a first-time booker reads after the
 * frame's own confirmation is where the video link will come from. /book
 * passes it (components/BookChoice.tsx, from lib/practice-facts.ts); the
 * client portal passes nothing and shows nothing.
 */
export const STALL_MS = 10_000;
export default function SchedulerTelemetry({
  page, who, stalled, booked, children,
}: {
  page: string;
  who?: string;
  /** What to show above the frame if it never draws: the direct link and the
   *  address. Nothing is shown, and nothing counted, without it. */
  stalled?: React.ReactNode;
  /** What to show above the frame once Cliniko confirms a booking. */
  booked?: React.ReactNode;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [stall, setStall] = useState(false);
  const [done, setDone] = useState(false);
  const watch = Boolean(stalled);

  useEffect(() => {
    if (done) panel.current?.focus({ preventScroll: true });
  }, [done]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    let seen = false;
    let touched = false;
    let drew = false;
    let timer: number | undefined;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!seen && e.isIntersecting && e.intersectionRatio >= 0.5) {
            seen = true;
            track('scheduler_visible', { page, detail: who });
            io.disconnect();
            if (watch && !drew) {
              timer = window.setTimeout(() => {
                if (drew) return;
                setStall(true);
                track('scheduler_stalled', { page, detail: who });
              }, STALL_MS);
            }
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
    const steps = new Set<string>();
    const onMessage = (e: MessageEvent) => {
      const frame = el.querySelector('iframe');
      if (!frame || !fromFrame(e.origin, e.source, frame.src, frame.contentWindow)) return;
      const msg = parseClinikoMessage(e.data);
      if (!msg) return;
      if (msg.kind === 'resize') {
        frame.style.height = `${clampFrameHeight(msg.height)}px`;
        if (!drew) {
          drew = true;
          window.clearTimeout(timer);
          setStall(false);
        }
        return;
      }
      el.scrollIntoView({ block: 'start' });
      if (msg.page === 'confirmed' && !confirmed) {
        confirmed = true;
        onClinikoBookingConfirmed({ page, who });
        setDone(true);
        return;
      }
      const step = stepName(msg.page);
      if (step && !steps.has(step)) {
        steps.add(step);
        track('scheduler_step', { page, detail: who ? `${step}/${who}` : step });
      }
    };
    window.addEventListener('message', onMessage);

    const root = document.documentElement;
    root.setAttribute('data-scheduler-open', '');

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('message', onMessage);
      root.removeAttribute('data-scheduler-open');
    };
  }, [page, who, watch]);

  return (
    <div ref={box} className="scheduler-frame">
      {done && booked && (
        <div ref={panel} tabIndex={-1} className="crisis" role="status" style={{ marginTop: 0, marginBottom: 12, outline: 'none' }}>
          <p style={{ margin: 0 }}>{booked}</p>
        </div>
      )}
      {stall && stalled && (
        <p className="scheduler-fallback" role="status" style={{ marginTop: 0, marginBottom: 10 }}>
          {stalled}
        </p>
      )}
      {children}
    </div>
  );
}

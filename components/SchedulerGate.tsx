'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SchedulerTelemetry from '@/components/SchedulerTelemetry';
import { track } from '@/lib/analytics';
import { CALENDAR_HASH, opensCalendar } from '@/lib/scheduler-open';

/* THE CALENDAR IS NOT LOADED UNTIL SOMEBODY ASKS FOR IT — 1 Oct 2026.
 *
 * WHY
 *
 * Lighthouse mobile on production /book, 1 Oct 2026: performance 38, first
 * paint 6.2 s, largest paint 10.3 s, layout shift 0.51, 3.6 MB transferred.
 * Every other page on the site scores 75-80. The difference is one element:
 * the server-rendered <iframe loading="lazy"> sat close enough to the top of a
 * phone screen that the browser fetched it on first view, and with it
 * 1.7 MB from cdn.cliniko.com, 0.8 MB from js.stripe.com and Google Fonts
 * Lato — 2.6 MB of somebody else's JavaScript before the page's own text had
 * settled. The 0.51 shift was Lato arriving inside the frame. The funnel
 * shows what that costs: 94 people reached the calendar since 18 Aug and 43
 * touched it, on a page that took ten seconds to become usable on a phone.
 *
 * So the frame is mounted on request. Until then this renders a placeholder
 * the same height as the frame, holding the counsellor's portrait, the next
 * open times already read from Cliniko (passed in as server-rendered
 * children), one primary button that mounts the frame, and the first-party
 * direct link as the second action. The height matches the frame on purpose:
 * when the button is pressed the calendar appears in the same box and nothing
 * below it moves, so the form for people the calendar does not suit stays
 * where their thumb left it.
 *
 * WHAT THE TELEMETRY NOW MEANS
 *
 * SchedulerTelemetry is mounted together with the frame, not before it, so
 * `scheduler_visible` on /book now means the frame was asked for and then at
 * least half of it was on screen, and `scheduler_interact` keeps its meaning.
 * Counts from before 1 Oct 2026 are not comparable to counts after it: the
 * old number was "scrolled past the calendar", the new one is "opened it".
 * No new event is added — one that is not in lib/conversion-log's COUNTED
 * list is dropped on arrival, and the request-then-shown pair is what the
 * next decision needs anyway.
 *
 * WITHOUT JAVASCRIPT the button does nothing, and that is fine: the direct
 * link and the fallback link below the box are plain anchors in the HTML
 * and open the same calendar as its own page.
 *
 * Focus after the swap goes to the wrapper, deliberately not to the frame:
 * focusing a cross-origin iframe is exactly what SchedulerTelemetry reads as
 * an interaction, and a programmatic focus would count as one.
 *
 * ARRIVING AT #calendar OPENS IT — 1 Oct 2026. The /book cards link to
 * ?with=<slug>#calendar and the sticky bar to #calendar: somebody who tapped
 * "Book with Camille" or "Pick a time" has already asked for the calendar,
 * and then had to tap "Show available times" as well. Now a #calendar on
 * arrival, a hashchange to it, or a same-page link to it runs the same
 * open() the button runs. Bare /book, with no hash, keeps the gate and the
 * Lighthouse figure it was built for. Each open is counted once as
 * `scheduler_open`, detail `button` or `hash`, so a frame mounted by the hash
 * is never read as a frame somebody asked for by pressing the button.
 *
 * WHAT A SCREEN READER HEARS — 1 Oct 2026. Focus used to land on an unnamed
 * div, so pressing the button announced nothing at all. The wrapper is a
 * named region now ("Book a free 30-minute consultation with Camille", the
 * frame's own title), and a polite status line says the calendar is loading
 * and where the other route is, then clears when the frame has loaded. Focus
 * still stays off the iframe, for the reason above. The status is visually
 * hidden: the frame takes the box's full height, and a visible line that
 * appeared and then cleared would move everything below it. */
const LOADING = 'Calendar loading. If it does not appear, ask for a time by email in the section below the calendar.';
export default function SchedulerGate({
  url, title, page, who, cta, children, secondary, openDetail,
}: {
  url: string;
  title: string;
  page: string;
  /** Roster slug when `?with=` narrowed the calendar to one counsellor; becomes
   *  the `detail` on scheduler_visible / scheduler_interact. */
  who?: string;
  /** The primary button's label. */
  cta: string;
  /** Server-rendered placeholder content: portrait(s) and the next open times. */
  children: React.ReactNode;
  /** The second action — the first-party link(s) that open the calendar as a page. */
  secondary?: React.ReactNode;
  /** Replaces `button`/`hash` as the scheduler_open detail. /book passes
   *  'couples' for a couples consultation (?for=couples), 1 Oct 2026, so
   *  couples opens are counted apart however the frame was opened. */
  openDetail?: 'couples';
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  const openFrom = useCallback((how: 'button' | 'hash') => {
    if (opened.current) return;
    opened.current = true;
    setOpen(true);
    track('scheduler_open', { page, detail: openDetail ?? how });
  }, [page, openDetail]);

  useEffect(() => {
    if (!open) return;
    box.current?.focus({ preventScroll: true });
    /* Set after mount, not rendered with it: a live region announces a
       change to its content, not content it was created with. */
    setStatus(LOADING);
  }, [open]);

  /* On mount, and again when the calendar URL changes (a soft navigation from
     a /book card to ?with=<slug>#calendar keeps this component mounted).
     /book streams, so the browser's own jump to #calendar can land before
     the content above it has arrived; the jump is made again once the frame
     is asked for. */
  useEffect(() => {
    if (window.location.hash !== CALENDAR_HASH) return;
    openFrom('hash');
    window.requestAnimationFrame(() => document.getElementById(CALENDAR_HASH.slice(1))?.scrollIntoView({ block: 'start' }));
  }, [url, openFrom]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === CALENDAR_HASH) openFrom('hash');
    };
    /* A Next <Link> to this page's #calendar pushes history without firing
       hashchange, and a plain link to the hash already in the address bar
       fires nothing at all; the click itself is the signal in both. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (a && opensCalendar(a.getAttribute('href'), window.location.pathname)) openFrom('hash');
    };
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('click', onClick, true);
    };
  }, [openFrom]);

  if (open) {
    return (
      <div ref={box} tabIndex={-1} role="region" aria-label={title} style={{ outline: 'none' }}>
        <p className="sr-only" role="status" aria-live="polite">{status}</p>
        <SchedulerTelemetry page={page} who={who}>
          <iframe
            src={url}
            title={title}
            onLoad={() => setStatus('')}
            /* allow-forms/-scripts/-same-origin are what the booking flow needs;
               allow-popups covers the card step opening a bank 3-D Secure window. */
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </SchedulerTelemetry>
      </div>
    );
  }

  return (
    <div className="scheduler-wait">
      {children}
      <div className="scheduler-wait__actions">
        <button type="button" className="btn btn--primary" onClick={() => openFrom('button')}>
          {cta}
        </button>
        {secondary}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import SchedulerTelemetry from '@/components/SchedulerTelemetry';

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
 * an interaction, and a programmatic focus would count as one. */
export default function SchedulerGate({
  url, title, page, who, cta, children, secondary,
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
}) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) box.current?.focus({ preventScroll: true });
  }, [open]);

  if (open) {
    return (
      <div ref={box} tabIndex={-1} style={{ outline: 'none' }}>
        <SchedulerTelemetry page={page} who={who}>
          <iframe
            src={url}
            title={title}
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
        <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
          {cta}
        </button>
        {secondary}
      </div>
    </div>
  );
}

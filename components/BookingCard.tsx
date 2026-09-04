import Link from 'next/link';
import { site } from '@/lib/site';
import { BadgeCheck, Video, CalendarClock, ShieldCheck } from 'lucide-react';

/* A mid-page booking card.
 *
 * WHY MID-PAGE. On a 1,600-word service page the booking CTA exists at the top,
 * where the reader has not decided yet, and at the bottom, where many never
 * arrive. The middle — right after "what this helps with" — is where someone
 * actually forms the intention, and there was nothing there.
 *
 * WHY IT CARRIES THE OBJECTIONS. The questions that stop a person booking are
 * always the same four: what it costs, whether online works, whether they are
 * committing to anything, and what happens if it is not a fit. Answering them
 * on a different page means losing the person who was almost ready. They are
 * answered here, at the point of decision, in the fewest words that are still
 * true.
 *
 * WHAT IT DELIBERATELY IS NOT. No countdown, no "only 3 spots left", no
 * dismissable popup, no exit-intent. Scarcity pressure on someone deciding
 * whether to seek help for their mental health would be a genuinely harmful
 * pattern, and it is also the kind of thing BCACC advertising standards exist
 * to prevent. The persuasion here is entirely "here is what is true, plainly".
 */
export default function BookingCard({
  heading = 'Not sure yet? That is what the consultation is for.',
  price,
  duration = '50 minutes',
  service,
}: {
  heading?: string;
  /** Session fee for this service, e.g. "$140". Omitted on pages where a
   *  single figure would be misleading. */
  price?: string;
  duration?: string;
  /** Named only so the copy can be specific; never used to preselect a paid
   *  service, because the public calendar offers the free consultation only. */
  service?: string;
}) {
  return (
    <aside className="booking-card" aria-labelledby="bk-h">
      <div className="booking-card-main">
        <h2 id="bk-h">{heading}</h2>
        <p>
          A free 15-minute video call{service ? ` about ${service.toLowerCase()}` : ''}. No
          charge, no card, and no obligation to book anything afterwards. It exists so you can
          find out whether this is a good fit before spending money on it.
        </p>

        <ul className="booking-card-facts">
          <li>
            <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
            <span>
              {site.counsellor.credentials} · registered with the BCACC, {' '}
              <Link href="/resources/verify-a-counsellor-in-bc">check the register yourself</Link>
            </span>
          </li>
          <li>
            <Video aria-hidden="true" strokeWidth={1.7} />
            <span>Secure video, anywhere in British Columbia. No referral needed.</span>
          </li>
          <li>
            <CalendarClock aria-hidden="true" strokeWidth={1.7} />
            <span>
              {price ? `${price} for ${duration} once you start. ` : `${duration} sessions. `}
              Free cancellation up to {site.cancellationHours} hours before.
            </span>
          </li>
          <li>
            <ShieldCheck aria-hidden="true" strokeWidth={1.7} />
            <span>
              Most BC extended health plans reimburse RCC sessions, {' '}
              <Link href="/pricing">what that works out to</Link>.
            </span>
          </li>
        </ul>

        <div className="btn-row">
          <Link className="btn btn--primary" href={site.bookingPath}>
            Book the free consultation
          </Link>
          <Link className="btn btn--ghost" href="/faq">
            Read the FAQ first
          </Link>
        </div>

        <p className="booking-card-note">
          Prefer to ask something before booking?{' '}
          <Link href="/contact">Email works too</Link>, questions cost nothing and are welcome.
        </p>
      </div>
    </aside>
  );
}

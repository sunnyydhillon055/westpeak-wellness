'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';

/* Mobile-only booking bar.
 *
 * On a phone the hero CTA scrolls out of view within a screen or two, and on a
 * 2,000-word guide the next booking link can be a long way down. This keeps one
 * reachable without interrupting the reading.
 *
 * Deliberately restrained: no animation, no dismiss button to remember, no
 * countdown or scarcity language — a health site should not pressure anyone.
 * Hidden on the booking page itself, where it would only point at the page you
 * are already on. */
export default function StickyBook() {
  const pathname = usePathname();
  if (pathname === site.bookingPath || pathname === '/contact') return null;

  return (
    <div className="sticky-book" role="complementary" aria-label="Book a consultation">
      <div className="sticky-book-inner">
        <div>
          <p className="sticky-book-text">
            Free 15-minute consult · <span>no obligation</span>
          </p>
          {/* The bar followed people down every page offering only the biggest
              ask. A text link rather than a second button, so the primary
              action stays unambiguous — but there is now somewhere to go for
              anyone not ready to schedule a call with a stranger. */}
          <Link className="sticky-book-ask" href="/contact#form">
            or send a message instead
          </Link>
        </div>
        {/* Appears only once NEXT_PUBLIC_PHONE is set (lib/site.ts). For the
            caller-first person the phone is the whole decision, so it sits
            beside Book rather than in a menu — but Book stays primary. */}
        {site.phone && (
          <a
            className="btn btn--ghost sticky-book-btn"
            href={`tel:${site.phoneTel}`}
            onClick={() => track('phone_click', { location: 'sticky' })}
          >
            Call
          </a>
        )}
        <Link className="btn btn--primary sticky-book-btn" href={site.bookingPath}>
          Book
        </Link>
      </div>
    </div>
  );
}

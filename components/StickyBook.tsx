'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

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
        <p className="sticky-book-text">
          Free 15-minute consult · <span>no obligation</span>
        </p>
        <Link className="btn btn--primary sticky-book-btn" href={site.bookingPath}>
          Book
        </Link>
      </div>
    </div>
  );
}

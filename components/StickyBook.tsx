'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';
import { practitioners } from '@/lib/practitioners';

/* THE BOOKING LINK FOLLOWS THE PAGE.
 *
 * On a counsellor's own pages the consultation should be attached to that
 * counsellor, so /book can state her provinces and languages instead of the
 * practice's. Camille works in Alberta and in Tagalog; a reader who clicked a
 * bare /book from her Calgary page was told "Sessions are for people located
 * in British Columbia" and offered English or Punjabi.
 *
 * Derived from the path rather than passed down, because these two components
 * are rendered by the layout and never see the page's own data. Anything that
 * is not a real counsellor's page falls through to the plain booking path. */
export const bookHrefFor = (pathname: string | null): string => {
  const m = /^\/practitioners\/([^/]+)/.exec(pathname ?? '');
  const slug = m?.[1];
  return slug && practitioners.some((p) => p.slug === slug)
    ? `${site.bookingPath}?with=${slug}`
    : site.bookingPath;
};


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
        <Link className="btn btn--primary sticky-book-btn" href={bookHrefFor(pathname)}>
          Book
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';
import { bookClickDetail, withSlugOf } from '@/lib/conversion-detail-client';

/* Every booking CTA on the site goes through here.
 *
 * One component means one place that knows the destination and one place that
 * fires the event — so a CTA can never be added that quietly reports nothing,
 * and `location` tells you which of them people actually use.
 *
 * The counsellor is read from the href's `?with=` rather than passed in, so a
 * practitioner page's band is attributed to her without the page having to
 * say so twice. 1 Oct 2026, when `location` first reached the counter. */
export default function BookLink({
  children,
  location,
  className = 'btn btn--primary',
  href,
}: {
  children: React.ReactNode;
  location: string;
  className?: string;
  href?: string;
}) {
  return (
    <Link
      className={className}
      href={href ?? site.bookingPath}
      onClick={() => track('book_click', { location, detail: bookClickDetail(location, withSlugOf(href)) })}
    >
      {children}
    </Link>
  );
}

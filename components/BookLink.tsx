'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';

/* Every booking CTA on the site goes through here.
 *
 * One component means one place that knows the destination and one place that
 * fires the event — so a CTA can never be added that quietly reports nothing,
 * and `location` tells you which of them people actually use. */
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
      onClick={() => track('book_click', { location })}
    >
      {children}
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
 * is not a real counsellor's page falls through to the plain booking path —
 * and so does a counsellor who is not taking new clients, because /book then
 * routes to whoever is (lib/practitioners.ts, `acceptingNewClients`). */
export const bookHrefFor = (pathname: string | null): string => {
  const m = /^\/practitioners\/([^/]+)/.exec(pathname ?? '');
  const slug = m?.[1];
  const p = slug ? practitioners.find((x) => x.slug === slug) : undefined;
  return p?.acceptingNewClients ? `${site.bookingPath}?with=${p.slug}` : site.bookingPath;
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
type Avail = Record<string, { first: string; next: string[]; count: number }>;

export default function StickyBook() {
  const pathname = usePathname();
  /* The next open consultation, fetched once per page view from a
     thirty-minute cache (app/api/availability). "Free 30-minute consult" is
     true on every page and moves nobody; "next: Sat from 9 am" is the thing a
     person on a stress-leave guide at 11pm actually wants to know. Rendered
     only once it arrives; the bar is complete without it. */
  const [avail, setAvail] = useState<Avail | null>(null);
  useEffect(() => {
    let live = true;
    fetch('/api/availability').then((r) => (r.ok ? r.json() : null)).then((j) => { if (live && j) setAvail(j); }).catch(() => {});
    return () => { live = false; };
  }, []);
  /* The crisis directory carries no booking prompt anywhere on it (scripts/
     cta-audit.mjs says why); the bar was the one place it still did. */
  if (pathname === site.bookingPath || pathname === '/contact' || pathname === '/resources/bc-crisis-and-support-directory') return null;

  /* On a counsellor's own page, her time; elsewhere the soonest of anyone's. */
  const onSlug = /^\/practitioners\/([^/]+)/.exec(pathname ?? '')?.[1];
  const pick = avail
    ? (onSlug && avail[onSlug]?.next?.length ? avail[onSlug] : Object.values(avail).find((a) => a.next?.length))
    : undefined;
  const nextLine = pick?.next?.[0] ? `next: ${pick.next[0].replace(/\s\(\d+ times\)$/, '')} with ${pick.first}` : 'no obligation';

  return (
    <div className="sticky-book" role="complementary" aria-label="Book a consultation">
      {/* THREE WAYS IN, ON EVERY PAGE, WHILE SCROLLING — 23 Sep 2026, owner's
          instruction. Book stays primary; email is the practice's preferred
          channel; the phone takes messages. The line above the buttons is the
          next open consultation, read live. */}
      <div className="sticky-book-inner">
        <p className="sticky-book-text">
          Free 30-minute consult · <span>{nextLine}</span>
        </p>
        <div className="sticky-book-actions">
          <Link className="btn btn--primary sticky-book-btn" href={bookHrefFor(pathname)}>
            Book
          </Link>
          <a
            className="btn btn--ghost sticky-book-btn"
            href={`mailto:${site.email}?subject=${encodeURIComponent('Free consultation')}`}
            onClick={() => track('email_click', { location: 'sticky' })}
          >
            Email
          </a>
          {site.phone && (
            <a
              className="btn btn--ghost sticky-book-btn"
              href={`tel:${site.phoneTel}`}
              onClick={() => track('phone_click', { location: 'sticky' })}
            >
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

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

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
    <path d="m3 6 9 6.5L21 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />
  </svg>
);

/* THE ACTION BAR ON A PHONE.
 *
 * On a phone the hero CTA scrolls out of view within a screen or two, and on a
 * 2,000-word guide the next booking link can be a long way down. This keeps all
 * three ways of reaching the practice reachable without interrupting the
 * reading.
 *
 * Rebuilt 23 Sep 2026 on the owner's instruction, to match the bar on the
 * EverStone site, which he could see and this one he could not. Two things
 * were wrong with the first version, and neither was the markup:
 *
 *   1. It was cream on cream. A translucent oatmeal panel at the foot of an
 *      oatmeal page, behind a phone browser's own bottom chrome, is invisible
 *      whether or not it is there. It is now a solid inverted bar, the same
 *      ground as the footer, the way EverStone's navy one is.
 *   2. It appeared only below 680px, while the header's Book button moves into
 *      the drawer at 1020px. Between those two widths — a phone held sideways,
 *      a small tablet, a narrow window — the site had no visible call to
 *      action at all. The bar now starts exactly where the header CTA stops.
 *
 * Deliberately restrained: no animation, no dismiss button to remember, no
 * countdown or scarcity language — a health site should not pressure anyone. */
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
     cta-audit.mjs says why); the bar was the one place it still did. Every
     other page keeps it, including /book and /contact — a person who scrolled
     past the form still needs a way to call. On those two the button that
     points at the page you are already on is dropped instead. */
  if (pathname === '/resources/bc-crisis-and-support-directory') return null;
  const onBooking = pathname === site.bookingPath;

  /* On a counsellor's own page, her time; elsewhere the soonest of anyone's. */
  const onSlug = /^\/practitioners\/([^/]+)/.exec(pathname ?? '')?.[1];
  const pick = avail
    ? (onSlug && avail[onSlug]?.next?.length ? avail[onSlug] : Object.values(avail).find((a) => a.next?.length))
    : undefined;
  const nextLine = pick?.next?.[0]
    ? `Next free consult: ${pick.next[0].replace(/\s\(\d+ times\)$/, '')} with ${pick.first}`
    : 'Free 30-minute consultation · no referral needed';

  return (
    <div className="sticky-book" role="navigation" aria-label="Contact the practice">
      <p className="sticky-book-text">{nextLine}</p>
      <div className="sticky-book-actions">
        <a
          className="sticky-book-btn sb-mail"
          href={`mailto:${site.email}?subject=${encodeURIComponent('Free consultation')}`}
          onClick={() => track('email_click', { location: 'sticky' })}
        >
          <MailIcon /> Email us
        </a>
        {!onBooking && (
          <Link className="sticky-book-btn sb-book" href={bookHrefFor(pathname)}>
            Book free consult
          </Link>
        )}
        {site.phone && (
          <a
            className={`sticky-book-btn sb-call${onBooking ? ' sb-call--wide' : ''}`}
            href={`tel:${site.phoneTel}`}
            aria-label={`Call ${site.name} at ${site.phone}`}
            onClick={() => track('phone_click', { location: 'sticky' })}
          >
            <PhoneIcon />
            {onBooking && <span className="sb-call-label">Call us</span>}
          </a>
        )}
      </div>
    </div>
  );
}

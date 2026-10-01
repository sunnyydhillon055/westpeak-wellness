'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';
import { bookClickDetail, withSlugOf } from '@/lib/conversion-detail-client';
import { bookHrefFor, type NavPractitioner } from '@/lib/roster-nav';

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
 * routes to whoever is (lib/practitioners.ts, `acceptingNewClients`).
 *
 * The function itself lives in lib/roster-nav.ts since 1 Oct 2026, and the
 * roster it reads arrives from the layout as a prop: importing
 * lib/practitioners.ts from this client component shipped the whole roster
 * file in every page's layout chunk. */

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

const DEFAULT_LINE = 'Free 30-minute consultation · no referral needed';

/* The line names a time, and on /book?with= it names the CHOSEN counsellor's
   time — 1 Oct 2026. It used to advertise whoever was soonest, so a reader on
   /book?with=savneet-singh was told "Next free consult: Sat … with Camille".
   With a counsellor chosen and nothing open for her, the line says nothing
   about anyone else.

   useSearchParams is read here, in a child under its own Suspense, rather
   than in the bar: the bar is rendered by the layout on every static page,
   and the hook outside a boundary would opt every one of them out of static
   rendering. Under the boundary, prerender prints the default line (which is
   what it printed anyway, since the times arrive after mount).

   THE NAMED TIME IS A LINK — 1 Oct 2026. A sentence that names a time with a
   counsellor is the most specific offer on the page, and it was plain text:
   the reader had to find the button and then find her on /book. When a slot
   is named, the sentence opens her calendar (/book?with=<slug>#calendar,
   which components/SchedulerGate opens on arrival), counted as book_click
   `sticky-next`. The default line stays text: it names nobody. */
function NextLine({ avail, onSlug, onBooking }: { avail: Avail | null; onSlug?: string; onBooking: boolean }) {
  const params = useSearchParams();
  const chosen = onBooking ? params?.get('with') ?? undefined : undefined;
  const has = (s?: string) => (s && avail?.[s]?.next?.length ? s : undefined);
  const slug = !avail
    ? undefined
    : chosen
      ? has(chosen)
      : onSlug
        ? has(onSlug)
        : Object.keys(avail).find((s) => has(s));
  const pick = slug ? avail?.[slug] : undefined;
  if (!slug || !pick?.next?.[0]) return <p className="sticky-book-text">{DEFAULT_LINE}</p>;
  return (
    <p className="sticky-book-text">
      <Link
        href={`${site.bookingPath}?with=${encodeURIComponent(slug)}#calendar`}
        onClick={() => track('book_click', { location: 'sticky-next', detail: bookClickDetail('sticky-next', slug) })}
      >
        Next free consult: {pick.next[0].replace(/\s\(\d+ times\)$/, '')} with {pick.first}
      </Link>
    </p>
  );
}

export default function StickyBook({ roster }: { roster: NavPractitioner[] }) {
  const pathname = usePathname();
  /* The next open consultation, fetched once per page view from a
     thirty-minute cache (app/api/availability). "Free 30-minute consult" is
     true on every page and moves nobody; "next: Sat from 9 am" is the thing a
     person on a stress-leave guide at 11pm actually wants to know. Rendered
     only once it arrives; the bar is complete without it. */
  const [avail, setAvail] = useState<Avail | null>(null);
  /* TYPING HIDES THE BAR — 1 Oct 2026. With a phone keyboard open, the header
     and this bar left about 200px for the field being typed in. While a text
     field has focus, <html> carries data-typing and app/premium.css hides the
     bar; a :has() rule there does the same before hydration. */
  useEffect(() => {
    const root = document.documentElement;
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLTextAreaElement ||
      (t instanceof HTMLInputElement && !['checkbox', 'radio', 'submit', 'button', 'hidden'].includes(t.type));
    const onIn = (e: FocusEvent) => { if (isField(e.target)) root.setAttribute('data-typing', ''); };
    const onOut = (e: FocusEvent) => { if (!isField(e.relatedTarget)) root.removeAttribute('data-typing'); };
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
      root.removeAttribute('data-typing');
    };
  }, []);

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

  /* The counsellor the Book button names (her own page, or the counsellor
     who speaks the language on a page written for one): her time; on
     /book?with=, the chosen one's; elsewhere the soonest of anyone's. Read
     from the same href, so the line and the button cannot name two different
     people; when she has no slot listed the line goes generic rather than
     offering someone else's. See NextLine. 1 Oct 2026. */
  const bookHref = bookHrefFor(pathname, roster, site.bookingPath);
  const onSlug = withSlugOf(bookHref);

  return (
    <div className="sticky-book" role="navigation" aria-label="Contact the practice">
      <Suspense fallback={<p className="sticky-book-text">{DEFAULT_LINE}</p>}>
        <NextLine avail={avail} onSlug={onSlug} onBooking={onBooking} />
      </Suspense>
      <div className="sticky-book-actions">
        <a
          className="sticky-book-btn sb-mail"
          href={`mailto:${site.email}?subject=${encodeURIComponent('Free consultation')}`}
          onClick={() => track('email_click', { location: 'sticky' })}
        >
          <MailIcon /> Email us
        </a>
        {/* Counted like every other booking button, as of 1 Oct 2026. This
            bar is on every page below 1020px and was the one Book link on the
            site that fired nothing, which is why the calendar was seen 105
            times against 34 recorded clicks: most arrivals came through here
            and were invisible. The counsellor comes from the href, so a click
            on her page is hers. */}
        {!onBooking && (
          <Link
            className="sticky-book-btn sb-book"
            href={bookHref}
            onClick={() => track('book_click', {
              location: 'sticky',
              detail: bookClickDetail('sticky', onSlug),
            })}
          >
            Book free consult
          </Link>
        )}
        {/* ON /book THE BAR JUMPS TO THE CALENDAR — 1 Oct 2026. Measured at
            375x812, "Show available times" sat 2.7 screens down a 7,300px page
            while the bar's wide dark button was "Call us", the opposite of
            email-over-phone. Now the primary slot is a jump to #calendar, and
            the phone keeps the same small icon it has on every other page.
            Counted as its own button so a jump is never read as an arrival. */}
        {onBooking && (
          <a
            className="sticky-book-btn sb-book"
            href="#calendar"
            onClick={() => track('book_click', {
              location: 'sticky-book-jump',
              detail: bookClickDetail('sticky-book-jump', withSlugOf(window.location.search)),
            })}
          >
            Pick a time &darr;
          </a>
        )}
        {site.phone && (
          <a
            className="sticky-book-btn sb-call"
            href={`tel:${site.phoneTel}`}
            aria-label={`Call ${site.name} at ${site.phone}`}
            onClick={() => track('phone_click', { location: 'sticky' })}
          >
            <PhoneIcon />
          </a>
        )}
      </div>
    </div>
  );
}

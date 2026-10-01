/* The roster, as the site's chrome needs it — and nothing else.
 *
 * WHY THIS FILE EXISTS — 1 Oct 2026. Header and StickyBook are client
 * components, and both imported `practitioners` from lib/practitioners.ts to
 * get five fields: slug, name, post-nominals, role and whether the person is
 * accepting. A client import ships the whole module, so every page's first
 * load carried the full roster — bios, credentials, insurance records, photo
 * sets, city lists — inside the layout chunk, hydrated on a phone before
 * anything could be tapped. Measured at 38.7 KB for the layout chunk before
 * the change, on all 305 pages.
 *
 * This module holds the shape and the one function that reads it. It imports
 * no data: the root layout (a server component) trims the roster to this
 * shape and passes it down as props, so the client bundle sees five strings
 * per counsellor and the roster file stays on the server. Anything the chrome
 * needs from a counsellor is added here, not by importing the roster. */

export type NavPractitioner = {
  slug: string;
  name: string;
  postNominals: string;
  role: string;
  acceptingNewClients: boolean;
  /* The language tags ('pa', 'tl') this counsellor can be booked in from a
     language page: set only when she is accepting AND has an online calendar,
     the same rule as counsellorForLanguage in lib/booking-cta.ts. Computed on
     the server so the browser gets two letters, not the roster. */
  bookIn: string[];
};

/* THE PAGES WRITTEN FOR ONE LANGUAGE — 1 Oct 2026.
 *
 * The header and the phone action bar said "Book Free Consult" and linked
 * bare /book on /punjabi, /punjabi-counselling/vancouver and every other
 * language page, while the page's own buttons had started opening the
 * calendar of the counsellor who speaks the language. The bar is the most
 * used route to /book, so it was the one link still sending a Punjabi reader
 * to a calendar that lists an English and Tagalog speaker first.
 *
 * Matched on the path because both are client components in the root layout
 * and know nothing else about the page. Prefixes cover the hubs and their
 * children; the exact paths are the tagged service, resource and comparison
 * pages, and test/roster-nav.test.mts fails if one of those gains or loses
 * its tag without this list following. */
const LANGUAGE_PREFIXES: readonly [string, string][] = [
  ['/punjabi', 'pa'],
  ['/punjabi-counselling', 'pa'],
  ['/tagalog', 'tl'],
  ['/tagalog-counselling', 'tl'],
];

export const LANGUAGE_PAGES: Readonly<Record<string, string>> = {
  '/services/punjabi-counselling': 'pa',
  '/services/tagalog-counselling': 'tl',
  '/resources/counselling-in-punjabi-what-the-words-mean': 'pa',
  '/resources/counselling-in-tagalog-what-the-words-mean': 'tl',
  '/compare/therapy-in-punjabi-vs-english': 'pa',
  '/compare/therapy-in-tagalog-vs-english': 'tl',
};

/** The language a page is written for, from its path, or undefined. */
export const languageOfPath = (pathname: string | null): string | undefined => {
  const path = (pathname ?? '').replace(/\/+$/, '') || '/';
  if (LANGUAGE_PAGES[path]) return LANGUAGE_PAGES[path];
  for (const [prefix, tag] of LANGUAGE_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return tag;
  }
  return undefined;
};

/* Where a Book button points from a given page: a counsellor's own calendar
   on her profile (and only if she is accepting — the roster rule in
   DECISIONS.md), the calendar of the counsellor who speaks the language on a
   page written for one, the practice-wide page everywhere else. */
export const bookHrefFor = (
  pathname: string | null,
  roster: readonly NavPractitioner[],
  bookingPath: string,
): string => {
  const m = /^\/practitioners\/([^/]+)/.exec(pathname ?? '');
  const slug = m?.[1];
  const p = slug ? roster.find((x) => x.slug === slug) : undefined;
  if (p) return p.acceptingNewClients ? `${bookingPath}?with=${p.slug}` : bookingPath;
  const tag = languageOfPath(pathname);
  const speaker = tag ? roster.find((x) => x.bookIn.includes(tag)) : undefined;
  return speaker ? `${bookingPath}?with=${speaker.slug}` : bookingPath;
};

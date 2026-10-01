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
};

/* Where a Book button points from a given page: a counsellor's own calendar
   on her profile (and only if she is accepting — the roster rule in
   DECISIONS.md), the practice-wide page everywhere else. */
export const bookHrefFor = (
  pathname: string | null,
  roster: readonly NavPractitioner[],
  bookingPath: string,
): string => {
  const m = /^\/practitioners\/([^/]+)/.exec(pathname ?? '');
  const slug = m?.[1];
  const p = slug ? roster.find((x) => x.slug === slug) : undefined;
  return p?.acceptingNewClients ? `${bookingPath}?with=${p.slug}` : bookingPath;
};

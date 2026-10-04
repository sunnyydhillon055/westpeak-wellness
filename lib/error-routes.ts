import { bookingsUrlFor, site } from '@/lib/site';

/* WHERE A CRASHED PAGE CAN STILL SEND SOMEBODY — 2 Oct 2026
 * (wf/services-cards, item 399).
 *
 * app/error.tsx sent "Book a free 15-minute consultation" to /book, which is
 * the page most likely to be the one that crashed (it embeds Cliniko), and
 * app/global-error.tsx offered only "/". Both are CLIENT components, and the
 * error boundary ships with the root layout, so neither may import the roster
 * (lib/practitioners.ts is the 50 KB regression of 1 Oct 2026). This is the
 * roster reduced to the two strings those pages need, for each counsellor
 * accepting new clients with a calendar of her own: a first name and her
 * Cliniko practitioner id. The link goes straight to Cliniko's own host
 * (bookingsUrlFor), which works when nothing on this site does.
 *
 * test/error-routes.test.mts derives the same list from lib/practitioners.ts
 * and fails when the two differ, so a counsellor who stops accepting is
 * dropped here by the build, not by memory. The founder is excluded by the
 * accepting flag, never by name. */
export const ERROR_CONSULT_COUNSELLORS: readonly { first: string; clinikoPractitionerId: string }[] = [
  { first: 'Camille', clinikoPractitionerId: '2029879067058112997' },
  { first: 'Savneet', clinikoPractitionerId: '2033684891660454425' },
];

export type ErrorConsultLink = { href: string; label: string };

/** "Book a free consultation with Camille" -> her Cliniko consult calendar. */
export const errorConsultLinks = (): ErrorConsultLink[] =>
  ERROR_CONSULT_COUNSELLORS.map((c) => ({
    href: bookingsUrlFor(c.clinikoPractitionerId),
    label: `Book a free consultation with ${c.first}`,
  }));

/** Shown as visible text and as a mailto: email over phone. */
export const ERROR_EMAIL = site.email;

/* THE LOWERCASE RETRY, FOR /Book AND /Services/EMDR-Therapy — finishes
 * R3 #245 without middleware, whose cost on every request was the only
 * reason it was skipped. Every route on this site is lowercase, so a 404 on
 * a path with a capital tries the lowercase path once. location.replace keeps
 * the bad URL out of history; a lowercase path has no capitals, so a second
 * 404 cannot loop. The string is the whole script, inlined by
 * app/not-found.tsx; test/error-routes.test.mts runs it against a fake
 * location. */
export const LOWERCASE_RETRY =
  "(function(l){var p=l.pathname;if(/[A-Z]/.test(p))l.replace(p.toLowerCase()+l.search+l.hash)})(location)";

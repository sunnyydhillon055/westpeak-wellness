import { COLLECTION_DATES } from './page-dates.ts';

/* ONE DATE PER PAGE, WHERE A PAGE IS BUILT FROM TWO MODULES — 1 Oct 2026.
 *
 * A counsellor's city page renders the roster (lib/practitioners.ts) and the
 * place copy (lib/practitioner-places.ts). Production showed the sitemap
 * saying 13 Sep, the JSON-LD 3 Sep and the visible line a third value,
 * because each surface picked one module. The honest date is the later of
 * the two, and the sitemap, the schema and the visible line now all read it
 * from here, so they cannot disagree again.
 *
 * Lives outside lib/page-dates.ts because that file is generated and a hand
 * edit there is deleted by the next `npm run dates`. A collection the
 * generated file does not hold yet is skipped rather than invented. */

/** The latest of the named collections' dates (YYYY-MM-DD), or undefined. */
export function latestCollection(...names: string[]): string | undefined {
  return names
    .map((n) => COLLECTION_DATES[n])
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
}

/** The same date as the sitemap writes it, or null when nothing is known. */
export function isoDay(d: string | undefined): string | null {
  return d ? new Date(d + 'T00:00:00Z').toISOString() : null;
}

/** /practitioners/<slug>/<place>: the roster plus the place copy. */
export const placePageDate = () => latestCollection('practitioners', 'practitionerPlaces');

/** /practitioners/<slug>/tl: the roster plus the Tagalog profile copy. */
export const tagalogProfileDate = () => latestCollection('practitioners', 'tagalogProfile');

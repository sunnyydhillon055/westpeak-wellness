import { locations } from './locations';

/* Every place this practice publishes a page for, shaped for the Organization
 * node's areaServed.
 *
 * WHY IT IS DERIVED AND NOT TYPED OUT
 *
 * A hand-written list drifts. The moment a city page is added and this is not
 * updated, the site publishes pages for a place its own entity does not claim
 * to serve — the two most load-bearing signals for a local query disagreeing
 * with each other, silently. Deriving it from lib/locations.ts means adding a
 * page updates the entity in the same commit, by construction.
 *
 * CITIES AND REGIONS ARE TYPED DIFFERENTLY, and the distinction is not
 * cosmetic. The first version mapped both through `@type: City`, which told
 * search engines that "Fraser Valley" and "Metro Vancouver" are municipalities.
 * They are not, and a wrong type is worse than a missing one: it puts a claim
 * in the entity graph that contradicts every other source. Regions are
 * AdministrativeArea.
 *
 * Regions are listed at all because "counselling in the Fraser Valley" is a
 * real query with no city in it — the exact search that started this work —
 * and an entity naming only municipalities has nothing for it to match.
 */

export type ServedPlace = { '@type': 'AdministrativeArea'; name: string };

const regions = [...new Set(locations.map((l) => l.region))].sort();

/* REGIONS ONLY, and the omission of cities is the point.
 *
 * Listing all ten cities as well was tried and reverted the same day: this
 * node ships on all 193 pages, so it cost ~4.5 KB each and pushed the median
 * page 5.1% over budget. It bought almost nothing — every city here already
 * has its own page carrying its own place in its own schema, so the city names
 * were a second assertion of something already asserted where it belongs.
 *
 * The regions were the genuinely missing signal. "Counselling in the Fraser
 * Valley" is a real query with no city in it — the exact search that started
 * this work — and no page or node named a region until now. Eight strings is
 * a rounding error on page weight; ten more that restate the sitemap is not. */
/* No containedInPlace on each region: the British Columbia State node sits in
 * the same areaServed array, so repeating the province eight times per page —
 * across 193 pages — restates what is already one line above it. */
export const AREA_SERVED: ServedPlace[] = regions.map((name) => ({
  '@type': 'AdministrativeArea' as const,
  name,
}));

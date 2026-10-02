/* WHICH HEALTH AUTHORITY COVERS EACH CITY, AND WHERE IT LIVES ONLINE.
 *
 * Added 6 Sep 2026. The city pages cite the authority in their prose — "public
 * intake runs through Fraser Health, not Vancouver Coastal" is a recurring and
 * genuinely useful point — but most of them cited nothing a reader could
 * click. A page about accessing care from Surrey that links Fraser Health is a
 * page with an authoritative source on it; the scorecard counted 115 of 250
 * pages with one, and the city pages were most of the rest.
 *
 * The map is by slug rather than by region because the Lower Mainland splits
 * between two authorities along lines that do not follow the region names:
 * Burnaby is Fraser Health, Vancouver is Coastal, and the Tri-Cities are
 * Fraser despite looking west. Getting this wrong sends someone to the wrong
 * intake queue, which is the delay several of these pages warn about. */

export type Source = { label: string; url: string };

const FRASER: Source = { label: 'Fraser Health', url: 'https://www.fraserhealth.ca/' };
const COASTAL: Source = { label: 'Vancouver Coastal Health', url: 'https://www.vch.ca/' };
const ISLAND: Source = { label: 'Island Health', url: 'https://www.islandhealth.ca/' };
const INTERIOR: Source = { label: 'Interior Health', url: 'https://www.interiorhealth.ca/' };
const NORTHERN: Source = { label: 'Northern Health', url: 'https://www.northernhealth.ca/' };

export const HEALTHLINK: Source = {
  label: 'HealthLink BC, mental health and substance use (8-1-1)',
  url: 'https://www.healthlinkbc.ca/mental-health-substance-use',
};

const BY_SLUG: Record<string, Source> = {
  // Fraser Health
  surrey: FRASER, burnaby: FRASER, 'new-westminster': FRASER, coquitlam: FRASER,
  'port-coquitlam': FRASER, 'port-moody': FRASER, delta: FRASER, 'white-rock': FRASER,
  langley: FRASER, 'fort-langley': FRASER, 'maple-ridge': FRASER, 'pitt-meadows': FRASER,
  abbotsford: FRASER, mission: FRASER, chilliwack: FRASER, hope: FRASER,
  // Vancouver Coastal Health
  vancouver: COASTAL, richmond: COASTAL, 'north-vancouver': COASTAL, 'west-vancouver': COASTAL,
  squamish: COASTAL, whistler: COASTAL, sechelt: COASTAL, 'powell-river': COASTAL,
  // Island Health
  victoria: ISLAND, saanich: ISLAND, 'victoria-saanich': ISLAND, nanaimo: ISLAND, duncan: ISLAND,
  parksville: ISLAND, courtenay: ISLAND, 'campbell-river': ISLAND,
  // Interior Health
  kelowna: INTERIOR, 'west-kelowna': INTERIOR, vernon: INTERIOR, penticton: INTERIOR,
  kamloops: INTERIOR, 'salmon-arm': INTERIOR, cranbrook: INTERIOR, nelson: INTERIOR,
  // Northern Health
  'prince-george': NORTHERN, 'prince-rupert': NORTHERN, terrace: NORTHERN, 'fort-st-john': NORTHERN,
};

/** The health authority for a city slug, or undefined if the map does not know it. */
export const healthAuthorityFor = (slug: string): Source | undefined => BY_SLUG[slug];

/* FIND YOUR TOWN — 1 Oct 2026.
 *
 * The /online-counselling index listed the cities with a page and then said
 * "not on the list? nothing changes", naming two towns as page-less that had
 * pages. Most towns somebody types are not cities here; they are in a city's
 * `communities`, which the city page already names. This groups every city and
 * its communities under the health authority that covers the city, in the
 * order public intake splits BC, so a reader finds their town and the page
 * that names it. Generated from lib/locations.ts, so a community added there
 * appears here without an edit. A town is listed once, under the first city
 * that names it. */
export type TownGroup = {
  authority: Source;
  cities: { slug: string; city: string; towns: string[] }[];
};

const ORDER = [FRASER, COASTAL, ISLAND, INTERIOR, NORTHERN];

export function townFinder(
  places: readonly { slug: string; city: string; communities?: string[] }[],
): TownGroup[] {
  const cityNames = new Set(places.map((p) => p.city));
  const seen = new Set<string>();
  const groups: TownGroup[] = ORDER.map((authority) => ({ authority, cities: [] }));
  for (const p of places) {
    const ha = BY_SLUG[p.slug];
    const g = ha && groups.find((x) => x.authority === ha);
    if (!g) continue;
    const towns = (p.communities ?? []).filter((t) => !cityNames.has(t) && !seen.has(t));
    towns.forEach((t) => seen.add(t));
    g.cities.push({ slug: p.slug, city: p.city, towns });
  }
  return groups.filter((g) => g.cities.length);
}

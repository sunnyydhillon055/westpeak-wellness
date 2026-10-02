import { punjabiRegions } from '@/lib/punjabi-regions';
import { TAGALOG_CITIES } from '@/lib/tagalog';

/* THE LANGUAGE PAGES BY PLACE, LINKED FROM THE PAGES ABOUT THE LANGUAGE —
 * 2 Oct 2026 (wf/services-cards, items 367 and 391).
 *
 * The six /punjabi-counselling/{region} pages had 7-10 inbound links each and
 * none from /services/punjabi-counselling, although /punjabi-counselling/
 * vancouver is the best-ranked money page on the site (83 impressions at 9.01,
 * GSC 26 Sep). The eleven /tagalog-counselling/{city} pages had exactly 3
 * each. This is the one list both rows read: the labels come from the region
 * data itself, so a region added there appears here with no edit, and a
 * region removed there cannot leave a dead link here.
 *
 * Links only. No claim rides on the row; each page it points at makes its
 * own. SERVER-ONLY: punjabi-regions.ts is about 50 KB and tagalog.ts reads
 * the roster, so a client component must never import this (the perf rule of
 * 1 Oct 2026). components/RegionLinks.tsx receives the finished list. */

export type RegionLink = { href: string; label: string };

/* Lower Mainland first, where the readers are, then the Interior and the
   North. A region not named here still appears, after these, in data order. */
const PUNJABI_ORDER = ['surrey', 'abbotsford', 'vancouver', 'maple-ridge', 'mission', 'saanich', 'langford', 'courtenay', 'campbell-river', 'kamloops', 'kelowna', 'vernon', 'cranbrook', 'prince-george'];

const rank = (order: string[], slug: string) => {
  const i = order.indexOf(slug);
  return i === -1 ? order.length : i;
};

export function punjabiRegionLinks(): RegionLink[] {
  return [...punjabiRegions]
    .sort((a, b) => rank(PUNJABI_ORDER, a.slug) - rank(PUNJABI_ORDER, b.slug))
    .map((r) => ({ href: `/punjabi-counselling/${r.slug}`, label: `Punjabi counselling in ${r.region}` }));
}

export function tagalogCityLinks(): RegionLink[] {
  return TAGALOG_CITIES.map((c) => ({ href: `/tagalog-counselling/${c.slug}`, label: `Tagalog counselling in ${c.city}` }));
}

/** Which row a page carries, by the language it is written for. */
export const regionLinksFor = (language: string | undefined): { heading: string; links: RegionLink[] } | undefined =>
  language === 'pa'
    ? { heading: 'Punjabi-speaking counselling by region', links: punjabiRegionLinks() }
    : language === 'tl'
      ? { heading: 'Tagalog-speaking counselling by city', links: tagalogCityLinks() }
      : undefined;

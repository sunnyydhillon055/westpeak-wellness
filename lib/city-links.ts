import { cityContexts } from '@/lib/city-context';
import { locations } from '@/lib/locations';

/* The cities components/CityLinks.tsx links from every informational page.
 *
 * The ten with a CityContext come first, in their own order: they are the ten
 * the rank tracker follows and the ten the block was built for on 25 Sep 2026.
 * Every other location follows, in lib/locations.ts order, because the 28 Sep
 * link baseline found those five city pages with zero informational inbound
 * links. Nothing here is prose; a city contributes its name and its slug, so
 * no city context is invented for the five that have none. */
export type CityLinkTarget = { slug: string; city: string };

const hubs: CityLinkTarget[] = cityContexts.map((c) => ({ slug: c.slug, city: c.city }));
const others: CityLinkTarget[] = locations
  .filter((l) => !cityContexts.some((c) => c.slug === l.slug))
  .map((l) => ({ slug: l.slug, city: l.city }));

export const cityLinkTargets: CityLinkTarget[] = [...hubs, ...others];

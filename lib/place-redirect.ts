import { insuredProvinces, type Practitioner } from '@/lib/practitioners';

/* AN ALBERTA PLACE PAGE WHOSE COUNSELLOR CANNOT BE OFFERED THERE — 2 Oct 2026.
 *
 * The insurance gate (lib/practitioners.ts) drops 'AB' from a counsellor's
 * provinces once her policy is past its grace period, and the place route
 * has dynamicParams = false, so /practitioners/camille-granda/calgary would
 * then 404 at the next build. It is the counsellor URL that earns the clicks
 * (6 from 31 impressions, GSC 26 Sep 2026). middleware.ts sends it, and its
 * /tl and /pa twins, to her profile with a 308 instead: the reader lands on
 * the person they searched for, and the URL's equity goes with them.
 *
 * Read at request time with the day's date, so the redirect starts the day
 * the gate closes rather than at the next build. No redirect while she is
 * insured for Alberta, for an unknown counsellor, or for any non-Alberta
 * place. The slugs are ALBERTA_PLACES' (lib/practitioner-places.ts); they
 * are listed here so the middleware bundle does not carry every city's copy,
 * and test/profile-redirect.test.mts holds the two lists equal. */
export const ALBERTA_PLACE_SLUGS: readonly string[] = ['calgary', 'edmonton'];

const PLACE_PATH = /^\/practitioners\/([a-z0-9-]+)\/([a-z0-9-]+)(?:\/(?:tl|pa))?\/?$/;

export function albertaPlaceRedirect(
  path: string,
  roster: readonly Pick<Practitioner, 'slug' | 'provinces' | 'insurance'>[],
  today: string,
): string | null {
  const m = PLACE_PATH.exec(path);
  if (!m) return null;
  const [, slug, place] = m;
  if (!ALBERTA_PLACE_SLUGS.includes(place!)) return null;
  const p = roster.find((q) => q.slug === slug);
  if (!p || insuredProvinces(p, today).includes('AB')) return null;
  return `/practitioners/${slug}`;
}

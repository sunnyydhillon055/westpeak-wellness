import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPractitioner } from '@/lib/practitioners';
import { getLocation } from '@/lib/locations';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* Covers both variants of the [place] route: a city, or a language tag. */
export default function Image({ params }: { params: { slug: string; place: string } }) {
  const p = getPractitioner(params.slug);
  const loc = getLocation(params.place);
  const lang = p?.languages.find((l) => l.tag === params.place);
  return ogImage({
    eyebrow: p?.name ?? 'Westpeak Wellness',
    title: loc ? `Counselling in ${loc.city}` : lang ? `Sa ${lang.nativeName}` : 'Counselling',
  });
}

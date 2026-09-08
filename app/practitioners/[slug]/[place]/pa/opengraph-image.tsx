import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPractitioner } from '@/lib/practitioners';
import { getPractitionerPlace } from '@/lib/practitioner-places';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* The share image for the Punjabi city pages.

   IN ENGLISH, NOT GURMUKHI — the same convention /punjabi, /punjabi/regions
   and /punjabi/sent already follow. The card renderer (Satori) ships a Latin
   font only; a Gurmukhi title rendered as a row of empty boxes on the first
   deploy, 7 Sep 2026, verified by fetching the image. Loading a Gurmukhi face
   into every edge card is possible (a bundled TTF, like the photograph) and
   is the improvement if these cards ever need the script itself. */
export default function Image({ params }: { params: { slug: string; place: string } }) {
  const p = getPractitioner(params.slug);
  const loc = getPractitionerPlace(params.place);
  return ogImage({
    eyebrow: p?.name ?? 'Westpeak Wellness',
    title: loc ? `Counselling in ${loc.city}, in Punjabi.` : 'Counselling in Punjabi, anywhere in BC.',
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPunjabiRegion } from '@/lib/punjabi-regions';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* See the note on the hub's generator. These six pages are the likeliest on the
 * whole site to be shared person-to-person rather than found in search, and
 * until now every one of them shared as a link with no image. */
export default function Image({ params }: { params: { region: string } }) {
  const item = getPunjabiRegion(params.region);
  return ogImage({
    eyebrow: 'Punjabi-speaking counselling',
    title: item
      ? `Punjabi counselling for ${item.region}`
      : 'Counselling in Punjabi, anywhere in BC',
  });
}

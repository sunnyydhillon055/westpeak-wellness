import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPunjabiGuide } from '@/lib/punjabi-guides';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* In English, like every other Punjabi-page card: the renderer has no
   Gurmukhi glyphs (see app/practitioners/[slug]/[place]/pa/opengraph-image.tsx).
   The English label names the subject; the eyebrow says it is in Punjabi. */
export default function Image({ params }: { params: { slug: string } }) {
  const g = getPunjabiGuide(params.slug);
  return ogImage({
    eyebrow: 'A guide, in Punjabi',
    title: g ? `${g.englishLabel}, in Punjabi.` : 'Counselling in Punjabi, anywhere in BC.',
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getTagalogGuide } from '@/lib/tagalog-guides';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* In Tagalog, because the card is what a Tagalog reader sees before deciding
   whether to open the page. */
export default function Image({ params }: { params: { slug: string } }) {
  const g = getTagalogGuide(params.slug);
  return ogImage({
    eyebrow: 'Gabay sa Tagalog',
    title: g?.title ?? 'Counselling sa Tagalog',
  });
}

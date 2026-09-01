import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getTagalogCity } from '@/lib/tagalog';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image({ params }: { params: { city: string } }) {
  const c = getTagalogCity(params.city);
  return ogImage({
    eyebrow: 'Tagalog counselling',
    title: c ? c.city : 'British Columbia',
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;
import { getLocation } from '@/lib/locations';

export default function Image({ params }: { params: { city: string } }) {
  const item = getLocation(params.city);
  return ogImage({
    eyebrow: 'Online counselling',
    title: item ? `Online counselling in ${item.city}` : "Online counselling in BC",
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;
import { getComparison } from '@/lib/comparisons';

export default function Image({ params }: { params: { slug: string } }) {
  const item = getComparison(params.slug);
  return ogImage({
    eyebrow: 'Compare',
    title: item?.title ?? "Compare your options",
  });
}

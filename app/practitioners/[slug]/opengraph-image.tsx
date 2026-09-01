import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPractitioner } from '@/lib/practitioners';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image({ params }: { params: { slug: string } }) {
  const p = getPractitioner(params.slug);
  return ogImage({
    eyebrow: p ? p.postNominals : 'Our counsellors',
    title: p?.name ?? 'Our counsellors',
  });
}

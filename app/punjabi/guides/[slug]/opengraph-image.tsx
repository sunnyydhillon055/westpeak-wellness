import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPunjabiGuide } from '@/lib/punjabi-guides';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* In Punjabi, because the card is what a Punjabi reader sees before deciding
   whether to open the page. */
export default function Image({ params }: { params: { slug: string } }) {
  const g = getPunjabiGuide(params.slug);
  return ogImage({
    eyebrow: 'ਪੰਜਾਬੀ ਵਿੱਚ ਗਾਈਡ',
    title: g?.title ?? 'ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ',
  });
}

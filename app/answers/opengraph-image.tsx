import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* The last page on the site without a share image. */
export default function Image() {
  return ogImage({
    eyebrow: 'Short answers',
    title: 'The questions people ask before booking',
  });
}

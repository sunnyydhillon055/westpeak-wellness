import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

/* Its own card — a page declaring an openGraph object replaces the root one
 * entirely and takes the inherited image with it. See the stress-check note. */
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image() {
  return ogImage({
    eyebrow: 'Free tool',
    title: 'What can you actually get?',
  });
}

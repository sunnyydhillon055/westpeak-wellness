import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

/* Its own card. A tool page that declares an openGraph object replaces the root
 * one entirely — Next never merges it — and takes the inherited image with it.
 * See the note on the stress-check card, which is the regression that taught
 * this. */
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image() {
  return ogImage({
    eyebrow: 'Free tool',
    title: 'Burnout, or depression?',
  });
}

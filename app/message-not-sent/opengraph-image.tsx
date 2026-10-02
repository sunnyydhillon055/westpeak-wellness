import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

/* The page declares its own openGraph object (for its og:url), which replaces
   the root one and the image with it, so it owns its card, as /message-sent
   and /punjabi/not-sent do. See the note in app/message-sent/opengraph-image.tsx. */
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image() {
  return ogImage({
    eyebrow: 'Message not sent',
    title: 'Your message did not go through.',
  });
}

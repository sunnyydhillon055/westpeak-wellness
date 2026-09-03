import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* The share card for the Tagalog front door, in Tagalog — it is what somebody
 * sees before deciding whether to open the page, so it should be in the
 * language the page is written in. */
export default function Image() {
  return ogImage({
    eyebrow: 'Westpeak Wellness',
    title: 'Counselling sa sariling wika',
  });
}

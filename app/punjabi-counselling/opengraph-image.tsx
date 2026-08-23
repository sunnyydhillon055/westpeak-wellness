import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* Missing until 23 August 2026, along with the six region pages beneath it.
 *
 * Twenty-nine route groups on this site generate a share image and this cluster
 * did not — an omission from the day the hub was built. It matters more here
 * than almost anywhere else: Punjabi-language content is passed around in
 * WhatsApp and Facebook groups, and a shared link with no preview image is a
 * grey rectangle that nobody taps. The cluster most likely to travel by
 * word of mouth was the one that could not. */
export default function Image() {
  return ogImage({
    eyebrow: 'Punjabi-speaking counselling',
    title: 'Counselling in Punjabi, by region in BC',
  });
}

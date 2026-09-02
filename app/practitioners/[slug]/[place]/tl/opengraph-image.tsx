import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPractitioner } from '@/lib/practitioners';
import { getPractitionerPlace } from '@/lib/practitioner-places';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* The share image for the Tagalog city pages.
 *
 * Without this the seventeen of them shipped with no og:image at all — a share
 * card with no picture, which quality-audit.mjs flagged and which is the whole
 * reason that check exists. The card is in Tagalog for the same reason the page
 * is: it is what somebody sees before they decide to open it. */
export default function Image({ params }: { params: { slug: string; place: string } }) {
  const p = getPractitioner(params.slug);
  const loc = getPractitionerPlace(params.place);
  return ogImage({
    eyebrow: p?.name ?? 'Westpeak Wellness',
    title: loc ? `Counselling sa ${loc.city}` : 'Counselling sa Tagalog',
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';

/* The referral page is the one page on this site written to be handed to
   somebody else — a GP, a nurse practitioner, an EFAP coordinator. It is
   therefore the page most likely to be forwarded in an email or a message,
   and it was the only non-matrix route still shipping without a social card. */
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image() {
  return ogImage({
    eyebrow: 'For referring clinicians',
    title: 'Referring a patient for counselling in BC',
  });
}

import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getPractitioner } from '@/lib/practitioners';
import { getPractitionerPlace } from '@/lib/practitioner-places';
import { PA_CITY } from '@/lib/practitioner-places-pa';

export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

/* The share image for the Punjabi city pages, in Punjabi: it is what a
   Punjabi reader sees before deciding whether to open the page. */
export default function Image({ params }: { params: { slug: string; place: string } }) {
  const p = getPractitioner(params.slug);
  const loc = getPractitionerPlace(params.place);
  return ogImage({
    eyebrow: p?.name ?? 'Westpeak Wellness',
    title: loc ? `${PA_CITY[loc.slug] ?? loc.city} ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ` : 'ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ',
  });
}

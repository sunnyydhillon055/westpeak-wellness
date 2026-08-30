import { ogImage, OG_SIZE, OG_CONTENT_TYPE, OG_ALT } from '@/lib/og';
import { getService } from '@/lib/services';
import { cityContexts } from '@/lib/city-context';

/* Social cards for the fifty city x service pages.
 *
 * These were the single largest gap the quality sweep reported: fifty pages —
 * a quarter of the site, and the half of it written to be found by somebody
 * searching a city and a problem in the same breath — shared to iMessage,
 * WhatsApp or Facebook as a blank rectangle with a URL under it.
 *
 * Every other route on the site has had a generated card since the OG work
 * landed. This route was added later and never got one, which is exactly the
 * kind of thing that is invisible until an instrument counts it.
 *
 * The eyebrow carries the city and the title carries the service, rather than
 * running both into one headline: the pair titles reach 59 characters already
 * and lib/og steps the type down at 44, so a combined line would render this
 * whole set at the smallest size for no gain.
 */
export const runtime = 'edge';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = OG_ALT;

export default function Image({ params }: { params: { city: string; service: string } }) {
  const ctx = cityContexts.find((c) => c.slug === params.city);
  const svc = getService(params.service);
  return ogImage({
    eyebrow: ctx ? `Online counselling · ${ctx.city}` : 'Online counselling · BC',
    title: svc ? svc.name : 'Counselling across British Columbia',
  });
}

import { handleInbound } from '@/lib/inbound-submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* "None of these times work."
 *
 * site.availability allows 17 bookable hours a week, three of the five days
 * being a single evening hour. Anyone who works ordinary daytime hours outside
 * Tuesday is choosing between three one-hour windows, weeks out. That is not an
 * edge case — it is a large share of everyone who reaches the calendar, and
 * until now the entire fallback was a mailto: link.
 *
 * The practice cannot manufacture hours. It can know who is waiting for them.
 */
export async function POST(req: Request) {
  return handleInbound(req, { kind: 'waitlist', redirectTo: '/book', flag: 'waitlist' });
}

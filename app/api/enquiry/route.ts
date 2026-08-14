import { handleInbound } from '@/lib/inbound-submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* A message from someone who is not ready to book a video call.
 *
 * Until now the only way to reach the practice was a mailto: link, and the only
 * conversion path on 111 pages was "book a video call with a stranger". Both
 * lose people: mailto: opens nothing at all on a desktop without a configured
 * mail client, and a first approach to a counsellor is frequently made at an
 * hour and in a state where picking a calendar slot is too big a step.
 */
export async function POST(req: Request) {
  return handleInbound(req, { kind: 'enquiry', redirectTo: '/contact', flag: 'sent' });
}

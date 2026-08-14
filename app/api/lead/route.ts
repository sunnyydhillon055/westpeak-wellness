import { handleInbound } from '@/lib/inbound-submit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Receives a lead-magnet signup and, since 2026-08-14, actually keeps it.
 *
 * WHAT THIS USED TO DO, BECAUSE IT IS WORTH NOT REPEATING
 *
 * It validated the address, forwarded to NEXT_PUBLIC_FORM_ENDPOINT if one was
 * configured, and redirected to ?lead=ok either way. That environment variable
 * was never set on any deployment. So every person who asked for the checklist
 * was validated, thanked, and discarded — with no error, no queue backing up,
 * and nothing anywhere to show it had happened.
 *
 * The old comment defended this: the guide is a page, so "nothing is actually
 * withheld". True about the reader, wrong about the practice. The point of the
 * form is that somebody raised their hand. Keeping the page and dropping the
 * hand is not a trade-off, it is just a loss.
 *
 * Now: written to Blob first, then the checklist goes to them and an alert to
 * the practice. Both sends are best-effort and neither can lose the record.
 */
export async function POST(req: Request) {
  return handleInbound(req, { kind: 'lead', redirectTo: '/pricing', flag: 'lead' });
}

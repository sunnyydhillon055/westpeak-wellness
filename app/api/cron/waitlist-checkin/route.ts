import { NextResponse, type NextRequest } from 'next/server';
import { runWaitlistCheckin } from '@/lib/waitlist-checkin';
import { withCronHealth } from '@/lib/cron-health';

/* One check-in for people who joined the waitlist 30+ days ago and have heard
 * nothing. See lib/waitlist-checkin.ts for why this is legitimate where an
 * enquiry sequence is not: they asked to be contacted.
 *
 * Weekly. The window is 30 days, so daily would only add noise, and the ledger
 * guarantees one note per person regardless of how often this runs.
 *
 * ?dry=1 reports who WOULD be written to without sending or recording.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorised(req: NextRequest): { ok: boolean; why?: string } {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return { ok: false, why: 'CRON_SECRET is not set on this deployment' };
  const header = req.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const alt = req.nextUrl.searchParams.get('key') || '';
  return bearer === secret || alt === secret
    ? { ok: true }
    : { ok: false, why: 'bad or missing credentials' };
}

export async function GET(req: NextRequest) {
  const gate = authorised(req);
  if (!gate.ok) {
    console.error('[waitlist-checkin] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const dry = req.nextUrl.searchParams.get('dry') === '1';
  /* Wrapped so a throw becomes a recorded failure rather than a 500 that
     nobody reads. See lib/cron-health.ts. */
  const run = await withCronHealth('waitlist-checkin', () => runWaitlistCheckin({ dry }));
  if (!run.ok) {
    return NextResponse.json({ ok: false, job: 'waitlist-checkin', error: run.error }, { status: 500 });
  }
  const result = run.result;
  if (!result.ok) {
    console.error('[waitlist-checkin] did not run:', result.reason);
    return NextResponse.json({ ...result, dry }, { status: 200 });
  }
  console.log(
    `[waitlist-checkin]${dry ? ' DRY' : ''} ${result.sent} sent · ` +
    `${result.skipped.notDue} not due · ${result.skipped.already} already had one · ` +
    `${result.skipped.inConversation} in conversation`
  );
  return NextResponse.json(result);
}

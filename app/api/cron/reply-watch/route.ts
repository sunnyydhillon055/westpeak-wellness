import { NextResponse, type NextRequest } from 'next/server';
import { runReplyWatch } from '@/lib/reply-watch';
import { withCronHealth } from '@/lib/cron-health';

/* Checks that the reply promise is being kept. See lib/reply-watch.ts.
 *
 * Every page on the site now says "a reply within one business day". This is
 * the only thing that verifies it. It emails the practice, never the person who
 * wrote in — protecting a reply time must not turn into chasing a stranger.
 *
 * Weekday mornings. Running at the weekend would only report messages that are
 * not yet late, since the promise is in business days.
 *
 * ?dry=1 lists what would be reported without sending. Worth running whenever
 * the grace period or the kinds being watched change.
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
    console.error('[reply-watch] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const dry = req.nextUrl.searchParams.get('dry') === '1';
  /* Wrapped so a throw becomes a recorded failure rather than a 500 that
     nobody reads. See lib/cron-health.ts. */
  const run = await withCronHealth('reply-watch', () => runReplyWatch({ dry }));
  if (!run.ok) {
    return NextResponse.json({ ok: false, job: 'reply-watch', error: run.error }, { status: 500 });
  }
  const result = run.result;

  if (!result.ok) {
    console.error('[reply-watch] did not run:', result.reason);
    return NextResponse.json({ ...result, dry }, { status: 200 });
  }

  console.log(
    `[reply-watch]${dry ? ' DRY' : ''} ${result.checked} awaiting reply · ` +
    `${result.overdue.length} past one business day · alerted=${result.alerted}`
  );
  return NextResponse.json(result);
}

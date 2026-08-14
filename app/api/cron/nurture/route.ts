import { NextResponse, type NextRequest } from 'next/server';
import { runNurture } from '@/lib/nurture';

/* Emails 2 and 3 of the checklist sequence. See lib/nurture.ts.
 *
 * Daily is deliberate even though the steps are day 4 and day 11: the job picks
 * whoever is due today, so the cadence lives in the data rather than in the
 * schedule. Running it more often would not send anything sooner and running it
 * weekly would make "day 4" mean anything from 4 to 10.
 *
 * Same auth posture as the other crons — refuses unless CRON_SECRET is both set
 * and presented. This one sends mail to people who are not clients, which is
 * the category where an accidental double-send is most costly.
 *
 * ?dry=1 reports who WOULD be emailed without sending or recording. Worth
 * running first every time the targeting rules change.
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
    console.error('[nurture] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const dry = req.nextUrl.searchParams.get('dry') === '1';
  const result = await runNurture({ dry });

  if (!result.ok) {
    console.error('[nurture] did not run:', result.reason);
    return NextResponse.json({ ...result, dry }, { status: 200 });
  }

  console.log(
    `[nurture]${dry ? ' DRY' : ''} ${result.sent} sent · ` +
    `${result.skipped.notDue} not due · ${result.skipped.alreadyClient} now clients or in conversation · ` +
    `${result.skipped.optedOut} opted out · ${result.failures.length} failure(s)`
  );
  return NextResponse.json({ ...result, dry });
}

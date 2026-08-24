import { NextResponse, type NextRequest } from 'next/server';
import { runFunnelReport } from '@/lib/funnel-report';
import { withCronHealth } from '@/lib/cron-health';

/* Monthly conversion report. See lib/funnel-report.ts for why it is emailed
 * rather than left on a dashboard — the month a number goes to zero is exactly
 * the month nobody logs in to look.
 *
 * Runs on the 1st, an hour after the revenue report, so the two arrive as a
 * pair rather than interleaved.
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
    console.error('[funnel-report] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const dry = req.nextUrl.searchParams.get('dry') === '1';
  /* Wrapped so a throw becomes a recorded failure rather than a 500 that
     nobody reads. See lib/cron-health.ts. */
  const run = await withCronHealth('funnel-report', () => runFunnelReport({ dry }));
  if (!run.ok) {
    return NextResponse.json({ ok: false, job: 'funnel-report', error: run.error }, { status: 500 });
  }
  const result = run.result;
  if (!result.ok) console.error('[funnel-report] did not send:', result.reason);
  else console.log('[funnel-report]', dry ? 'DRY' : 'sent', JSON.stringify(result.counts));
  return NextResponse.json({ ...result, dry }, { status: 200 });
}

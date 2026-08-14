import { NextResponse, type NextRequest } from 'next/server';
import { runFunnelReport } from '@/lib/funnel-report';

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
  const result = await runFunnelReport({ dry });
  if (!result.ok) console.error('[funnel-report] did not send:', result.reason);
  else console.log('[funnel-report]', dry ? 'DRY' : 'sent', JSON.stringify(result.counts));
  return NextResponse.json({ ...result, dry }, { status: 200 });
}

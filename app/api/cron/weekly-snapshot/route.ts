import { NextResponse, type NextRequest } from 'next/server';
import { noteCronRefusal } from '@/lib/cron-refusal';
import { takeSnapshot } from '@/lib/conversion-snapshots';
import { withCronHealth } from '@/lib/cron-health';

/* Monday copy of the conversion counters, so /admin can show last week's
 * counts rather than one total since 18 Aug. See lib/conversion-snapshots.ts.
 *
 * SENDS NOTHING. No mail import, no alert: the 17 Sep decision took the
 * monitors off email, and a snapshot that fails is recorded in the cron
 * health store, which /admin already reads.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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
    await noteCronRefusal('weekly-snapshot', req, gate.why);
    console.error('[weekly-snapshot] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const run = await withCronHealth('weekly-snapshot', () => takeSnapshot());
  if (!run.ok) {
    return NextResponse.json({ ok: false, job: 'weekly-snapshot', error: run.error }, { status: 500 });
  }
  console.log('[weekly-snapshot]', JSON.stringify(run.result));
  return NextResponse.json({ ok: true, ...run.result }, { status: 200 });
}

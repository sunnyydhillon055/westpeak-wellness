import { NextResponse, type NextRequest } from 'next/server';
import { syncClientsFromCliniko } from '@/lib/cliniko-sync';
import { refreshCatalog } from '@/lib/cliniko-catalog';
import { sendPortalInvites } from '@/lib/portal-invite';

/* Nightly Cliniko -> client list sync.
 *
 * Scheduled in vercel.json for 11:00 UTC daily — 04:00 in Vancouver during PDT
 * — so anyone booked during the day can use the portal by the next morning.
 * Someone added to Cliniko since the last run is still covered on the same day
 * by the live lookup in lib/portal-store.ts; this makes it durable rather than
 * dependent on that call succeeding.
 *
 * SECURITY. Same posture as the revenue report: refuses to run unless
 * CRON_SECRET is set AND presented. This endpoint reads the practice's full
 * patient list, so the fail-open version would expose client names and email
 * addresses at a guessable URL. An unset secret is misconfiguration, not
 * permission.
 *
 * ?dry=1 reports what the sync WOULD do without writing.
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
    // Which of the two reasons applies is logged, not returned — telling an
    // anonymous caller "CRON_SECRET is not set" tells them how to get in.
    console.error('[cliniko-sync] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  /* Two independent jobs, deliberately not short-circuited on each other.
   * A patient-sync failure must not leave prices stale, and vice versa. */
  const catalog = await refreshCatalog();
  if (!catalog.ok) {
    console.error('[cliniko-sync] catalog refresh failed:', catalog.reason);
  } else if (catalog.changed) {
    console.log('[cliniko-sync] catalogue CHANGED — prices or durations differ from the last run');
  }

  const dry = req.nextUrl.searchParams.get('dry') === '1';
  const result = await syncClientsFromCliniko('cron:cliniko-sync');

  if (!result.ok) {
    console.error('[cliniko-sync] failed:', result.reason);
    /* 200, not 500. The job ran and reported honestly; a 5xx would make Vercel
     * retry a sync whose failure is a missing env var, which retrying cannot
     * fix. The body carries the reason. */
    return NextResponse.json(result, { status: 200 });
  }

  console.log(
    `[cliniko-sync] ${result.totalInCliniko} in Cliniko · ${result.added} added · ` +
    `${result.namesFilled} names filled · ${result.skippedNoEmail} skipped (no email)`
  );

  /* Invites run AFTER the sync, in the same job, because they read the client
   * list the sync just wrote. Running them on their own schedule would mean a
   * client added to Cliniko could wait a full cycle longer than necessary, and
   * would risk inviting from a list that had not been refreshed yet. */
  const invites = await sendPortalInvites({ dry });
  if (!invites.ok) console.error('[portal-invite] did not run:', invites.reason);
  else console.log(
    `[portal-invite]${dry ? ' DRY' : ''} ${invites.sent}/${invites.limit} invited · ` +
    `${invites.deferred} deferred to next run · ${invites.alreadyHavePassword} already set · ` +
    `${invites.recentlyInvited} recently invited · ${invites.failures.length} failure(s)`
  );
  return NextResponse.json({ ...result, invites, catalog: catalog.ok ? { changed: catalog.changed, items: catalog.catalog.items.length } : { error: catalog.reason } });
}

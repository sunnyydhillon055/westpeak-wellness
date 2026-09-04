import { NextResponse, type NextRequest } from 'next/server';
import { runBookingNotifications } from '@/lib/booking-notify';
import { withCronHealth, runCronWatchdog } from '@/lib/cron-health';
import { sendDetailed } from '@/lib/portal-mail';
import { site } from '@/lib/site';

/* Confirmation and follow-up email from westpeakwellness.com.
 *
 * Scheduled daily in vercel.json. Cliniko already sends the instant
 * confirmation, so this is not the receipt — see lib/booking-mail.ts for why
 * a second, recognisable one from the practice's own domain is the fix rather
 * than a duplicate.
 *
 * SECURITY. Same posture as the other crons: refuses to run unless CRON_SECRET
 * is set AND presented. This route reads patient names, email addresses and
 * appointment times, and sends mail on the practice's behalf.
 *
 * ?dry=1 reports what it WOULD send, without sending or recording anything.
 * Safe to run before RESEND_API_KEY exists — it is the way to check the
 * targeting is right before any client receives anything.
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
    console.error('[booking-mail] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const dry = req.nextUrl.searchParams.get('dry') === '1';
  /* Wrapped so a throw becomes a recorded failure rather than a 500 that
     nobody reads. See lib/cron-health.ts. */
  const run = await withCronHealth('booking-mail', () => runBookingNotifications({ dry }));

  /* Every other job is checked from here, because this one runs every two
     hours and is therefore the likeliest to still be alive. Deliberately
     AFTER the job's own work and never awaited into its result: the watchdog
     is an observer and must not be able to change what booking-mail did.
     Skipped on a dry run — a rehearsal must not send real mail. */
  const watchdog = dry
    ? { problems: [], alerted: [] }
    : await runCronWatchdog((subject, text) =>
        /* Escaped, not interpolated raw. The body carries error-message text
           from whatever threw, and a mail client renders HTML — an error
           containing a tag would otherwise reshape the alert. */
        sendDetailed(
          site.email,
          subject,
          text,
          `<pre>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
        ));
  if (watchdog.alerted.length) {
    console.warn('[cron-watchdog] alerted about:', watchdog.alerted.join(', '));
  }
  if (!run.ok) {
    return NextResponse.json({ ok: false, job: 'booking-mail', error: run.error }, { status: 500 });
  }
  const result = run.result;

  if (!result.ok) {
    console.error('[booking-mail] did not run:', result.reason);
    /* 200 rather than 5xx: the job ran and reported honestly. A 5xx makes
     * Vercel retry a failure that retrying cannot fix. */
    return NextResponse.json({ ...result, dry }, { status: 200 });
  }

  console.log(
    `[booking-mail]${dry ? ' DRY' : ''} ${result.confirmations} confirmation(s) · ` +
    `${result.reminders} reminder(s) · ` +
    `${result.followUps} follow-up(s) · ${result.skipped.noEmail} without an email · ` +
    `${result.failures.length} failure(s)`
  );
  return NextResponse.json({ ...result, dry });
}

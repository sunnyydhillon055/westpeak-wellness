import { NextResponse } from 'next/server';

/* Uptime probe. Returns which build is serving and that the function layer is
 * alive — nothing else. Deliberately public and deliberately free of detail:
 * no dependency checks (a probe that touches Cliniko turns a vendor outage
 * into a site alert), no env echoing, nothing a stranger learns from it
 * beyond "up".
 *
 * Point an external monitor (UptimeRobot, Checkly, a cron) at /api/health and
 * alert on non-200 or on `commit` failing to change after a deploy. */
export const dynamic = 'force-dynamic';

const startedAt = Date.now();

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
      /* Cold-start time of this instance, not process uptime of "the site" —
       * serverless instances recycle constantly and that is normal. */
      instanceAgeSeconds: Math.round((Date.now() - startedAt) / 1000),
      time: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

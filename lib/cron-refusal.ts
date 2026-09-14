import type { NextRequest } from 'next/server';
import { recordCronRun } from './cron-health.ts';

/* A SCHEDULED CALL THAT WAS REFUSED IS A RUN THAT FAILED — 13 Sep 2026.
 *
 * Every cron route answers 401 to a bad or missing secret and records
 * nothing, which is right for a stranger probing the URL and wrong for the
 * scheduler itself: if Vercel fires the job and the secret does not match,
 * the store stays empty and the watchdog says "never reported a run" — the
 * same words it uses for a cron that never fired. Two different faults, one
 * message, and the fix for each is different.
 *
 * Vercel identifies its scheduler with a user-agent of `vercel-cron/1.0`. A
 * refusal carrying that header is recorded against the job as a failure with
 * the reason; a refusal from anything else is still silent, so an anonymous
 * probe cannot write to the health store. */
export async function noteCronRefusal(job: string, req: NextRequest, why: string | undefined): Promise<void> {
  const ua = req.headers.get('user-agent') || '';
  if (!/vercel-cron/i.test(ua)) return;
  await recordCronRun({ job, ok: false, detail: `scheduler call refused: ${why ?? 'bad or missing credentials'}` });
}

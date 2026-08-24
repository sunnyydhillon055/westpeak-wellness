import { put, get } from '@vercel/blob';

/* DID THE SCHEDULED JOBS ACTUALLY RUN?
 *
 * WHY THIS EXISTS
 *
 * Eight jobs are scheduled in vercel.json and, until now, not one of them had a
 * try/catch. A throw meant a 500, a line in a Vercel log nobody reads, and
 * silence. The jobs that fail this way are exactly the ones whose failure is
 * invisible by design:
 *
 *   reply-watch      the only thing verifying the "reply within one business
 *                    day" promise printed on every page
 *   waitlist-checkin the single note a waitlisted person is ever sent
 *   booking-mail     confirmations and no-show follow-ups
 *   funnel-report    the monthly summary that would have shown the others
 *                    were broken
 *
 * A practice could go a month without knowing that nobody had been told about
 * an enquiry, and the report that would have revealed it is on the same list.
 *
 * WHAT IT RECORDS, AND WHAT IT DOES NOT
 *
 * One line per job: when it last ran, whether it succeeded, and a short detail.
 * Never the payload, never an address — a failure log that accumulates client
 * data is a liability that grows on its own.
 *
 * Recording is best-effort and deliberately swallows its own errors. A health
 * log that can break the job it is watching is worse than no health log.
 */

const KEY = 'ops/cron-health.json';

export type CronRun = {
  job: string;
  at: string;
  ok: boolean;
  /** One line, safe to display. Never client data. */
  detail: string;
  /** Milliseconds, so a job that is quietly getting slower is visible. */
  ms?: number;
};

export type CronHealth = Record<string, CronRun>;

/** How often each job is expected, in hours. Used to spot one that stopped
 *  running at all — which looks identical to "never failed" without this. */
export const EXPECTED_EVERY_HOURS: Record<string, number> = {
  'cliniko-sync': 2,
  'booking-mail': 2,
  'reply-watch': 24,      // weekdays; 24 keeps a Monday from alarming after a weekend
  nurture: 24,
  'waitlist-checkin': 168,
  'funnel-report': 744,   // monthly
  'revenue-report': 744,
  indexnow: 168,
};

export async function readCronHealth(): Promise<CronHealth> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    return (await new Response(hit.stream).json()) as CronHealth;
  } catch {
    return {};
  }
}

export async function recordCronRun(run: Omit<CronRun, 'at'>): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const current = await readCronHealth();
    const value: CronHealth = { ...current, [run.job]: { ...run, at: new Date().toISOString() } };
    await put(KEY, JSON.stringify(value, null, 2), {
      access: 'private', contentType: 'application/json',
      addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
    });
  } catch {
    /* Deliberately silent. See the note at the top: this must never be able to
       fail the job it is recording. */
  }
}

/* Wraps a cron body so a throw is caught, recorded and reported rather than
   becoming a 500 nobody sees. Returns what the handler returned, or a shaped
   failure. */
export async function withCronHealth<T>(
  job: string,
  fn: () => Promise<T>
): Promise<{ ok: true; result: T } | { ok: false; error: string }> {
  const started = Date.now();
  try {
    const result = await fn();
    await recordCronRun({ job, ok: true, detail: 'completed', ms: Date.now() - started });
    return { ok: true, result };
  } catch (e) {
    /* Message only. A stack trace in a blob is noise, and an error object from
       a mail or storage client can carry a key or an address in its fields. */
    const detail = e instanceof Error ? e.message.slice(0, 200) : 'unknown error';
    console.error(`[${job}] threw:`, detail);
    await recordCronRun({ job, ok: false, detail, ms: Date.now() - started });
    return { ok: false, error: detail };
  }
}

/** Jobs that failed, or that have not reported within twice their interval. */
export function cronProblems(health: CronHealth, now = Date.now()): CronRun[] {
  const out: CronRun[] = [];
  for (const [job, every] of Object.entries(EXPECTED_EVERY_HOURS)) {
    const last = health[job];
    if (!last) {
      out.push({ job, at: '', ok: false, detail: 'has never reported a run' });
      continue;
    }
    if (!last.ok) { out.push(last); continue; }
    const age = (now - new Date(last.at).getTime()) / 3_600_000;
    /* Twice the interval before complaining. A single missed tick is a deploy
       or a cold start; two is a pattern. */
    if (age > every * 2) {
      out.push({ ...last, ok: false, detail: `last ran ${Math.round(age)}h ago, expected every ${every}h` });
    }
  }
  return out;
}

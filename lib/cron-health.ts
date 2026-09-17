import { put, get, list } from '@vercel/blob';

/* DID THE SCHEDULED JOBS ACTUALLY RUN?
 *
 * WHY THIS EXISTS
 *
 * Eight jobs are scheduled in vercel.json and, until this file existed, not
 * one of them had a try/catch. A throw meant a 500, a line in a Vercel log
 * nobody reads, and silence. The jobs that fail this way are exactly the ones
 * whose failure is invisible by design:
 *
 *   reply-watch      the only thing verifying the "reply within one business
 *                    day" promise printed on every page
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
 * ONE FILE PER JOB, WHICH IS THE SECOND DESIGN
 * ----------------------------------------------------------------------------
 * The first design put every job in one blob. Each job read the file, added
 * its line and wrote the whole thing back, which is read-modify-write from
 * three schedulers firing on the same minute. Two bugs came out of that and
 * both are worth keeping in mind, because the fix for the second created the
 * third:
 *
 *   6 Sep 2026   The read went through the CDN cache and the write was
 *                last-writer-wins, so a job that had just recorded itself
 *                could read back a file without its own line. booking-mail
 *                emailed the owner that booking-mail was not running, from
 *                inside a booking-mail run.
 *   6 Sep 2026   Fixed with `useCache: false` and a conditional write
 *                (`ifMatch` on the ETag of what was read), which is the right
 *                answer to concurrent writers and was correctly applied.
 *  17 Sep 2026   And then the store handed back a WEAK ETag for this file.
 *                `W/"…"` can never satisfy If-Match. Every write was refused,
 *                all three retries were refused for the same reason, and the
 *                loop gave up silently. The file froze on 14 Sep. Every job
 *                kept running; none could say so; the watchdog read four-day-
 *                old lines and told the owner each morning that three jobs
 *                had stopped. See lib/blob-etag.ts.
 *
 * So the contention is gone rather than managed: each job owns its own blob at
 * ops/cron/<job>.json and writes it unconditionally. Two jobs writing at the
 * same second now touch different objects, there is nothing to serialise, and
 * with no conditional write there is no validator to be weak. A design where
 * the failure cannot happen beats a design that handles it.
 *
 * Recording stays best-effort — it must never fail the job it is watching —
 * but it is no longer silent. A write that does not land is logged, and the
 * watchdog can tell "the jobs stopped" from "the store stopped", which is the
 * distinction that cost four days of false alarms.
 */

const DIR = 'ops/cron/';
/** The pre-17 Sep single file. Read as a fallback so history is not lost; never written. */
const LEGACY_KEY = 'ops/cron-health.json';

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
  /* The price catalogue, watched separately from the patient sync it rides
     with. They fail independently and for different reasons, and folding them
     together meant a catalogue that had failed for a month still reported
     healthy because the patient half succeeded. */
  'cliniko-catalog': 2,
  'booking-mail': 2,
  /* WEEKDAYS ONLY, AND THE ARITHMETIC HAS TO ALLOW FOR IT. This said 24 with
     a comment claiming that kept Monday quiet. It did not: the grace is twice
     the interval, Friday 16:00 to Monday 16:00 is 72 hours, and 48 is less
     than 72 — so every Monday would have produced a false alarm the moment
     anything acted on this. Harmless while nothing did; a weekly cry of wolf
     the day a watchdog was wired in. 48 gives four days, which clears a
     weekend and still catches a genuine stop inside the week. */
  'reply-watch': 48,
  nurture: 24,
  'funnel-report': 744,   // monthly
  'revenue-report': 744,
  indexnow: 168,
};

/* A job name is part of a blob path. `expect:booking-mail` carries a colon,
   which is legal in a pathname but not worth relying on; the marker prefix is
   flattened on the way in and restored on the way out. */
const fileFor = (job: string) => `${DIR}${job.replace(/[^A-Za-z0-9._-]/g, '-')}.json`;

async function readJson<T>(key: string): Promise<T | null> {
  try {
    const hit = await get(key, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return null;
    return (await new Response(hit.stream).json()) as T;
  } catch {
    return null;
  }
}

/** Every job's last run. Per-job files win; the legacy single file fills gaps. */
export async function readCronHealth(): Promise<CronHealth> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  const health: CronHealth = {};
  try {
    const legacy = await readJson<CronHealth>(LEGACY_KEY);
    if (legacy) Object.assign(health, legacy);
  } catch { /* history is a nicety; the current files are the record */ }

  try {
    const found = await list({ prefix: DIR, limit: 200 });
    const runs = await Promise.all(found.blobs.map((b) => readJson<CronRun>(b.pathname)));
    for (const run of runs) {
      if (run && typeof run.job === 'string' && typeof run.at === 'string') health[run.job] = run;
    }
  } catch (e) {
    console.error('[cron-health] could not list the health store:', e instanceof Error ? e.message : e);
  }
  return health;
}

/**
 * Writes one job's line. Unconditional by design — the job owns the file, so
 * there is nothing to race with. Best-effort, never throws, but a failure is
 * logged: silence here is what hid the 14 Sep freeze for four days.
 */
export async function recordCronRun(run: Omit<CronRun, 'at'>): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const value: CronRun = { ...run, at: new Date().toISOString() };
  try {
    await put(fileFor(run.job), JSON.stringify(value, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return true;
  } catch (e) {
    /* Logged, not thrown. See the note at the top: this must never be able to
       fail the job it is recording. */
    console.error(`[cron-health] could not record ${run.job}:`, e instanceof Error ? e.message : e);
    return false;
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

/* THE STORE ITSELF, WHICH IS THE THING NOBODY WAS WATCHING.
 *
 * Two jobs run every two hours. If the newest line in the entire health store
 * is older than that by a wide margin, the likeliest explanation is not that
 * every job stopped on the same tick — it is that nothing can write here any
 * more, which is exactly what happened between 14 and 17 Sep 2026. Saying so
 * in one sentence is worth more than eight lines each claiming a job is dead.
 *
 * Six hours is three missed ticks of the shortest schedule: past a deploy, a
 * cold start or a slow afternoon, and well short of a full day. */
export function storeFrozen(health: CronHealth, now = Date.now()): string | null {
  const times = Object.values(health)
    .filter((r) => !r.job.startsWith('expect:'))
    .map((r) => new Date(r.at).getTime())
    .filter((t) => Number.isFinite(t));
  if (!times.length) return null;
  const newest = Math.max(...times);
  const hours = (now - newest) / 3_600_000;
  if (hours < 6) return null;
  return `Nothing has been recorded in the health store for ${Math.round(hours)} hours, and two jobs run every two hours. ` +
    'That points at the store rather than the jobs: the jobs below may well be running and unable to say so. ' +
    'This is what the 14 September freeze looked like (a weak ETag; see lib/blob-etag.ts).';
}

/** Jobs that failed, or that have not reported within twice their interval. */
export function cronProblems(health: CronHealth, now = Date.now()): CronRun[] {
  const out: CronRun[] = [];
  for (const [job, every] of Object.entries(EXPECTED_EVERY_HOURS)) {
    const last = health[job];
    if (!last) {
      /* NEVER RAN — but only once it has had the chance to. The first time the
         watchdog sees an expected job with no record it writes an `expect:`
         marker (runCronWatchdog below); the alarm fires when twice the job's
         interval has passed since that marker. Without this, a weekly job
         added on a Saturday was reported as broken before its first Monday —
         the 12 Sep 2026 "indexnow has never reported a run" email. A job with
         no marker yet is reported to /admin as waiting, not as a problem. */
      const marker = health[`expect:${job}`];
      if (!marker) continue;
      const waited = (now - new Date(marker.at).getTime()) / 3_600_000;
      if (waited > every * 2) {
        out.push({ job, at: '', ok: false, detail: `has never reported a run (expected every ${every}h, waited ${Math.round(waited)}h)` });
      }
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

/* ============================================================================
   THE WATCHDOG, AND WHY IT NO LONGER EMAILS
   ----------------------------------------------------------------------------
   It used to. One alert per job, then at most one a day while the problem
   lasted — restrained, as these things go, and still wrong for this practice.
   Two reasons it stops, decided 17 Sep 2026 on the owner's instruction:

     · It was crying wolf. Every alert it ever sent about a stopped job was
       false: the jobs were running and the store they reported into was
       frozen (see the top of this file). A monitor whose only output to date
       has been a false alarm has negative value.
     · The owner asked for it to stop. "Getting too many emails." An alert
       nobody wants to receive is not a safety net, it is a filter rule
       waiting to be written, and once it is written the real one is lost too.

   So the verdict goes to /admin, where it was already rendered, and nothing
   is sent. That is a real trade and it should be stated plainly: if every job
   stops, nothing will come and tell you. What replaces the email is that the
   failure mode which actually happened — the store freezing while the jobs
   run — is now detected directly, and the /admin page says so in words.
   ========================================================================= */

export type WatchdogVerdict = {
  /** Jobs the health store says are stopped or failing. */
  problems: string[];
  /** Set when the health store itself is not persisting, which makes `problems` untrustworthy. */
  storeStale?: string;
};

/**
 * Checks every job and returns what it found. Never throws, never sends.
 *
 * `selfJob` is the job calling it, which has just recorded a run a few lines
 * earlier. If the store does not show that run, the store is not persisting —
 * and every other "job stopped" line in the same read is then meaningless.
 * Reporting that instead is the difference between the four days of false
 * alarms in September and one accurate sentence.
 */
export async function runCronWatchdog(
  opts: { now?: number; selfJob?: string } = {}
): Promise<WatchdogVerdict> {
  const now = opts.now ?? Date.now();
  try {
    const health = await readCronHealth();

    if (opts.selfJob) {
      const mine = health[opts.selfJob];
      const ageMin = mine ? (now - new Date(mine.at).getTime()) / 60_000 : Infinity;
      /* Ten minutes covers a slow job and a slow store, and is far inside the
         two hours before the next run. */
      if (!mine || ageMin > 10) {
        const stale = `the health store is not recording runs — ${opts.selfJob} ran just now and the store ` +
          (mine ? `still shows its last run ${Math.round(ageMin / 60)}h ago` : 'has no record of it') +
          '; job reports below cannot be trusted until this clears';
        console.error('[cron-watchdog]', stale);
        return { problems: [], storeStale: stale };
      }
    }

    /* Register the expectation for any job with no record and no marker, so
       the never-ran clock starts now rather than at the dawn of time. */
    for (const job of Object.keys(EXPECTED_EVERY_HOURS)) {
      if (!health[job] && !health[`expect:${job}`]) {
        await recordCronRun({ job: `expect:${job}`, ok: true, detail: 'expectation registered; awaiting first run' });
        health[`expect:${job}`] = { job: `expect:${job}`, ok: true, detail: 'expectation registered', at: new Date(now).toISOString() };
      }
    }

    const problems = cronProblems(health, now);
    if (problems.length) {
      console.warn('[cron-watchdog] not running:', problems.map((p) => `${p.job} (${p.detail})`).join('; '));
    }
    return { problems: problems.map((p) => p.job) };
  } catch (e) {
    console.error('[cron-watchdog] failed:', e instanceof Error ? e.message : e);
    return { problems: [] };
  }
}

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

/* ============================================================================
   TELLING SOMEBODY, WHICH IS THE PART THAT WAS MISSING
   ----------------------------------------------------------------------------
   Everything above this line detects a stopped job. Nothing acted on it. The
   verdict was rendered in /admin and /admin is a page somebody has to decide
   to open — which, on the day every job silently stops, nobody does, because
   there is no symptom to send them there. A monitor that only answers when
   asked is a monitor for a problem you already suspect.

   So the watchdog emails. It is called from booking-mail, which runs every two
   hours and is therefore the job most likely to still be alive.

   WHO WATCHES THIS ONE. Nothing here does, and pretending otherwise would be
   worse than saying it: if booking-mail is the job that dies, the watchdog
   dies with it and the silence is complete. Two things make that less bad than
   it sounds — booking-mail is one of two jobs on the shortest schedule, so it
   is the least likely to be the one that stops, and its own absence is still
   visible in /admin next to everything else. A genuinely external check is
   uptime monitoring, which is a separate item and a separate kind of thing.

   IT DOES NOT EMAIL EVERY TWO HOURS. A monitor that repeats itself twelve
   times a day is a monitor that gets filtered to a folder, and then it has
   made things worse than no monitor at all. One alert per job, then silence
   for a day, then one more if it is still broken.
   ========================================================================= */

const ALERT_KEY = 'ops/cron-alerts.json';
const REALERT_AFTER_MS = 24 * 3_600_000;

type AlertLog = Record<string, string>;

async function readAlertLog(): Promise<AlertLog> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(ALERT_KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    return (await new Response(hit.stream).json()) as AlertLog;
  } catch {
    return {};
  }
}

/**
 * Checks every job, emails the practice about any that are newly broken, and
 * returns what it decided. Never throws — see the note at the top of the file.
 *
 * `send` is injected rather than imported so this module stays free of the
 * mail client. lib/cron-health.ts is imported by six route handlers; making it
 * pull in the mailer would put the mailer in all six.
 */
export async function runCronWatchdog(
  send: (subject: string, text: string) => Promise<unknown>,
  now = Date.now()
): Promise<{ problems: string[]; alerted: string[] }> {
  try {
    const problems = cronProblems(await readCronHealth(), now);
    if (!problems.length) return { problems: [], alerted: [] };

    const log = await readAlertLog();
    const due = problems.filter((p) => {
      const last = log[p.job];
      if (!last) return true;
      const since = now - new Date(last).getTime();
      return !Number.isFinite(since) || since > REALERT_AFTER_MS;
    });

    if (due.length) {
      const lines = due.map((p) => `  ${p.job} — ${p.detail}`).join('\n');
      const subject =
        due.length === 1
          ? `Scheduled job not running: ${due[0]!.job}`
          : `${due.length} scheduled jobs are not running`;
      await send(
        subject,
        'One or more background jobs on westpeakwellness.com have stopped ' +
          'reporting, or reported a failure.\n\n' +
          `${lines}\n\n` +
          'What this can mean in practice: confirmations and follow-ups may not ' +
          'be going out, the reply-time check may not be running, and the ' +
          'monthly report may not arrive.\n\n' +
          'The full picture is at /admin. This message is sent once per job, ' +
          'then at most once a day while the problem lasts.'
      );

      const next: AlertLog = { ...log };
      for (const p of due) next[p.job] = new Date(now).toISOString();
      /* Written only after the send resolves. If the mail throws, nothing is
         recorded and the next run tries again — the failure mode of an alert
         system must be repeating itself, never swallowing itself. */
      await put(ALERT_KEY, JSON.stringify(next, null, 2), {
        access: 'private', contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
      });
    }

    return { problems: problems.map((p) => p.job), alerted: due.map((p) => p.job) };
  } catch (e) {
    console.error('[cron-watchdog] failed:', e instanceof Error ? e.message : e);
    return { problems: [], alerted: [] };
  }
}

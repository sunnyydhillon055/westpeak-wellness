import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cronProblems, EXPECTED_EVERY_HOURS, type CronHealth } from '../lib/cron-health.ts';

/* Eight scheduled jobs, several of whose failure is invisible by design: the
 * one that verifies the reply-time promise, the note a nurture lead
 * ever gets, and the monthly report that would have shown the others were
 * broken. Whether this function is right decides whether anyone finds out. */

const NOW = Date.parse('2026-09-03T12:00:00Z');
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

const healthy = (): CronHealth =>
  Object.fromEntries(
    Object.keys(EXPECTED_EVERY_HOURS).map((job) => [
      job,
      { job, at: hoursAgo(0.5), ok: true, detail: 'completed' },
    ])
  );

test('a site where everything ran reports nothing', () => {
  assert.deepEqual(cronProblems(healthy(), NOW), []);
});

test('a job that has never reported is a problem once it has had the chance to run', () => {
  /* The dangerous case: a job that never ran leaves no record, so it looks
     exactly like a job that has never failed. The watchdog writes an expect:
     marker the first time it notices; the alarm fires after twice the interval. */
  const h = healthy();
  delete h['reply-watch'];
  assert.deepEqual(cronProblems(h, NOW).map((p) => p.job), [], 'no marker yet: waiting, not broken');
  h['expect:reply-watch'] = { job: 'expect:reply-watch', ok: true, detail: 'registered', at: new Date(NOW - 10 * 3_600_000).toISOString() };
  assert.deepEqual(cronProblems(h, NOW).map((p) => p.job), [], 'inside the grace: still waiting');
  h['expect:reply-watch'] = { job: 'expect:reply-watch', ok: true, detail: 'registered', at: new Date(NOW - 2 * EXPECTED_EVERY_HOURS['reply-watch']! * 3_600_000 - 3_600_000).toISOString() };
  const found = cronProblems(h, NOW);
  assert.ok(found.some((p) => p.job === 'reply-watch' && /never reported/.test(p.detail)), 'past the grace: reported');
});
test('an empty store reports every job once each has had twice its interval to run', () => {
  /* A brand-new deployment, or a store that failed to read. The watchdog
     registers an expectation for every job the first time it looks; once
     twice the interval has passed for a job, silence is reported — for all of
     them, noisily and correctly. Reporting nothing then would be the silence
     this whole file exists to break. Before the marker has aged, a job is
     waiting, not broken (the 12 Sep 2026 weekly-job false alarm). */
  assert.equal(cronProblems({}, NOW).length, 0, 'nothing registered yet: waiting');
  const h: CronHealth = {};
  for (const [job, every] of Object.entries(EXPECTED_EVERY_HOURS)) {
    h[`expect:${job}`] = { job: `expect:${job}`, ok: true, detail: 'registered', at: new Date(NOW - (2 * every + 1) * 3_600_000).toISOString() };
  }
  assert.equal(cronProblems(h, NOW).length, Object.keys(EXPECTED_EVERY_HOURS).length);
});

test('a recorded failure is reported however recent it is', () => {
  const h = healthy();
  h['nurture'] = { job: 'nurture', at: hoursAgo(0.1), ok: false, detail: 'resend timed out' };
  const found = cronProblems(h, NOW);
  assert.equal(found.length, 1);
  assert.equal(found[0]!.detail, 'resend timed out');
});

test('one missed tick is forgiven, two is not', () => {
  /* A single miss is a deploy or a cold start. The grace has to be real or the
     alert fires on ordinary days and gets filtered, and then it is worse than
     nothing. */
  const every = EXPECTED_EVERY_HOURS['cliniko-sync']!;
  const h = healthy();

  h['cliniko-sync'] = { job: 'cliniko-sync', at: hoursAgo(every * 1.5), ok: true, detail: 'completed' };
  assert.deepEqual(cronProblems(h, NOW), [], 'one missed tick must not alert');

  h['cliniko-sync'] = { job: 'cliniko-sync', at: hoursAgo(every * 2.5), ok: true, detail: 'completed' };
  assert.equal(cronProblems(h, NOW).length, 1, 'past twice the interval it must alert');
});

test('the monthly jobs are not alarmed by an ordinary month', () => {
  /* funnel-report and revenue-report run on the 1st. A 30-day gap is normal
     and must not read as a stopped job — this is the case a naive "not seen in
     48 hours" rule gets wrong every single month. */
  const h = healthy();
  for (const job of ['funnel-report', 'revenue-report']) {
    h[job] = { job, at: hoursAgo(31 * 24), ok: true, detail: 'completed' };
  }
  assert.deepEqual(cronProblems(h, NOW), []);
});

test('reply-watch is not alarmed by a weekend', () => {
  /* It runs weekdays only. Monday morning is ~72 hours after Friday, so the
     expectation has to be loose enough to survive that and still catch a job
     that genuinely stopped. */
  const h = healthy();
  h['reply-watch'] = { job: 'reply-watch', at: hoursAgo(70), ok: true, detail: 'completed' };
  assert.deepEqual(cronProblems(h, NOW), [], 'a normal weekend must not alert');

  h['reply-watch'] = { job: 'reply-watch', at: hoursAgo(24 * 6), ok: true, detail: 'completed' };
  assert.equal(cronProblems(h, NOW).length, 1, 'six days of silence must alert');
});

test('every scheduled job has an expectation set for it', () => {
  /* A job in vercel.json with no entry here is invisible to the watchdog: it
     can stop forever and cronProblems will never mention it, because it only
     iterates what it was told about. */
  const scheduled = [
    'cliniko-sync', 'booking-mail', 'reply-watch', 'nurture',
    'funnel-report', 'revenue-report', 'indexnow',
  ];
  for (const job of scheduled) {
    assert.ok(
      EXPECTED_EVERY_HOURS[job],
      `${job} is scheduled but has no expected interval, so nothing can notice it stopping`
    );
  }
});

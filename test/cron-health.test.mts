import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cronProblems, EXPECTED_EVERY_HOURS, type CronHealth } from '../lib/cron-health.ts';

/* Eight scheduled jobs, several of whose failure is invisible by design: the
 * one that verifies the reply-time promise, the only note a waitlisted person
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

test('a job that has never reported is a problem, not an absence', () => {
  /* The dangerous case. A job that never ran leaves no record at all, so it
     looks exactly like a job that has never failed. */
  const h = healthy();
  delete h['reply-watch'];
  const found = cronProblems(h, NOW);
  assert.equal(found.length, 1);
  assert.equal(found[0]!.job, 'reply-watch');
  assert.match(found[0]!.detail, /never/);
});

test('an empty store reports every job rather than staying quiet', () => {
  /* A brand-new deployment, or a store that failed to read. Reporting
     everything is noisy and correct; reporting nothing would be the silence
     this whole file exists to break. */
  assert.equal(cronProblems({}, NOW).length, Object.keys(EXPECTED_EVERY_HOURS).length);
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
    'waitlist-checkin', 'funnel-report', 'revenue-report', 'indexnow',
  ];
  for (const job of scheduled) {
    assert.ok(
      EXPECTED_EVERY_HOURS[job],
      `${job} is scheduled but has no expected interval, so nothing can notice it stopping`
    );
  }
});

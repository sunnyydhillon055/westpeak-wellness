import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXPECTED_EVERY_HOURS } from '../lib/cron-health.ts';

/* THE THREE LISTS THAT HAVE TO AGREE — 13 Sep 2026.
 *
 * vercel.json says what runs. lib/cron-health.ts says what is expected. Each
 * route file has to record its run. On 13 Sep the revenue report was scheduled
 * and expected and recorded nothing, which the watchdog would have reported as
 * "never ran" for as long as the practice existed. This test fails the build
 * when any job is on one list and not the others. */

const crons = (JSON.parse(readFileSync('vercel.json', 'utf8')) as { crons: { path: string }[] }).crons;
const jobOf = (path: string) => path.replace(/^\/api\/cron\//, '').replace(/^\/api\//, '');

test('every scheduled route records its run through withCronHealth', () => {
  for (const c of crons) {
    const file = `app${c.path}/route.ts`;
    const src = readFileSync(file, 'utf8');
    const records = /withCronHealth\(/.test(src) || /submitSitemapToIndexNow/.test(src);
    assert.ok(records, `${file} never records a run`);
    const job = jobOf(c.path);
    assert.ok(src.includes(`noteCronRefusal('${job}'`), `${file} must record a refused scheduler call under its own job name '${job}'`);
  }
});

test('every scheduled job has an expectation, and every expectation is scheduled', () => {
  const scheduled = new Set(crons.map((c) => jobOf(c.path)));
  for (const job of scheduled) {
    assert.ok(job in EXPECTED_EVERY_HOURS, `${job} is scheduled but the watchdog does not expect it`);
  }
  for (const job of Object.keys(EXPECTED_EVERY_HOURS)) {
    /* cliniko-catalog rides inside cliniko-sync; the only job recorded from
       another job's route. */
    if (job === 'cliniko-catalog') continue;
    assert.ok(scheduled.has(job), `${job} is expected but nothing schedules it`);
  }
});

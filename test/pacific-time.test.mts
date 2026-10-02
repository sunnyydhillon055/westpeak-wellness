import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  formatPacific, pacificParts, pacificZone, offsetMinutes, probeHour, runtimeTzCurrent,
  PACIFIC_ZONE, FIXED_ZONE, PROBE_ISO,
} from '../lib/pacific-time.ts';

/* #353, 2 Oct 2026: one Pacific clock that stays right after BC stops
 * changing its clocks on 1 Nov 2026, whichever tz data the runtime carries.
 * Every instant here sits well away from midnight Pacific (lesson of 2 Oct:
 * CI's Node 22 and a local Node 24 disagree on BC's winter offset). */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const nb = (s: string) => s.replace(/[  ]/g, ' ');

test('the December probe instant reads 1:00 p.m. Pacific on this runtime', () => {
  assert.equal(nb(formatPacific(PROBE_ISO, { hour: 'numeric', minute: '2-digit', hour12: true })), '1:00 p.m.');
  assert.equal(nb(formatPacific('2026-12-15T20:00:00Z', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })), 'Tue, Dec 15, 1:00 p.m.');
  const hour = pacificParts(PROBE_ISO, { hour: 'numeric', hourCycle: 'h23' }).find((p) => p.type === 'hour')?.value;
  assert.equal(Number(hour), 13);
});

test('both branches agree: stale data falls back to UTC-7, current data uses Vancouver', () => {
  assert.equal(pacificZone(PROBE_ISO, true), PACIFIC_ZONE);
  assert.equal(pacificZone(PROBE_ISO, false), FIXED_ZONE);
  assert.equal(pacificZone('2026-01-15T20:00:00Z', false), PACIFIC_ZONE, 'before the 2026 spring change the runtime history stands');
  assert.equal(nb(formatPacific(PROBE_ISO, { hour: 'numeric', minute: '2-digit', hour12: true }, 'en-CA', false)), '1:00 p.m.');
  assert.equal(nb(formatPacific('2026-07-15T20:00:00Z', { hour: 'numeric', minute: '2-digit', hour12: true }, 'en-CA', false)), '1:00 p.m.');
  assert.equal(nb(formatPacific('2026-01-15T20:00:00Z', { hour: 'numeric', minute: '2-digit', hour12: true }, 'en-CA', false)), '12:00 p.m.', 'January 2026 was still UTC-8');
  assert.equal(runtimeTzCurrent(), probeHour() === 13);
});

test('a timeZone passed by a caller cannot override the Pacific zone', () => {
  assert.equal(nb(formatPacific(PROBE_ISO, { timeZone: 'UTC', hour: 'numeric', minute: '2-digit', hour12: true })), '1:00 p.m.');
});

test('offsets: Pacific is UTC-7 in December 2026 and July, UTC-8 in January 2026', () => {
  assert.equal(offsetMinutes(PACIFIC_ZONE, PROBE_ISO), -420);
  assert.equal(offsetMinutes(PACIFIC_ZONE, '2026-07-15T20:00:00Z'), -420);
  assert.equal(offsetMinutes(PACIFIC_ZONE, '2026-01-15T20:00:00Z'), -480);
  assert.equal(offsetMinutes('America/Creston', PROBE_ISO), -420);
  assert.equal(offsetMinutes('UTC', PROBE_ISO), 0);
});

test('every server-side formatter that prints a client-facing Pacific time goes through the helper', () => {
  for (const f of ['lib/availability-summary.ts', 'lib/booking-mail.ts', 'lib/booking-notify.ts', 'app/client-portal/page.tsx']) {
    const s = src(f);
    assert.doesNotMatch(s, /timeZone:\s*(TZ|'America\/Vancouver')/, `${f} formats Vancouver directly`);
    assert.match(s, /from '(\.\/|@\/lib\/)pacific-time(\.ts)?'/, `${f} imports lib/pacific-time`);
  }
});

test('the build pins Node 22 and logs which tz data it carries', () => {
  const pkg = JSON.parse(src('package.json'));
  assert.equal(pkg.engines.node, '22.x');
  assert.match(pkg.scripts.prebuild, /scripts\/tz-probe\.mjs/);
  const probe = src('scripts/tz-probe.mjs');
  assert.match(probe, /process\.versions\.tz/);
  assert.match(probe, /2026-12-15T20:00:00Z/);
  assert.doesNotMatch(probe, /process\.exit\(/, 'a log line, never a gate');
});

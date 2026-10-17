import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  summariseWindows, firstLaterDay, LATER_WINDOWS, availabilityLine, firstOpenDay, openDays, nextFreeCallLine,
  type Availability,
} from '@/lib/availability-summary';
import { nextConsultEntries, nextConsultNoneOpen } from '@/lib/next-consult';
import { slotState, bookSummary, type ClientAvailability } from '@/lib/consult-slot';

/* PAST THE TWO WEEKS, ONE DAY — 16 Oct 2026 (item 554).
 *
 * Consultations open two days a week and the owner's January item starts on
 * 4 Jan, so from about 21 Dec every consultation line would have read "no
 * free-consultation times in the next two weeks" during the year-end plan
 * push. With an empty fortnight read successfully, lib/cliniko-availability.ts
 * reads up to three more weeks and keeps the first open day. These fixtures
 * stand in for Cliniko: fourteen empty days and one time on day 20. */

const ROOT = process.cwd();
/* 21 Dec 2026, 19:00Z (11 am Pacific): a Monday. Day 20 is Sun 10 Jan. */
const TODAY = Date.parse('2026-12-21T19:00:00Z');
const isoOn = (offset: number) => new Date(TODAY + offset * 86_400_000).toISOString();

/** A fake Cliniko: the slot starts in [from, to] (day offsets, inclusive). */
const cliniko = (slots: number[], fail?: (from: number) => boolean) => {
  const asked: [number, number][] = [];
  const read = async (from: number, to: number): Promise<string[]> => {
    asked.push([from, to]);
    if (fail?.(from)) throw new Error('HTTP 503');
    return slots.filter((d) => d >= from && d <= to).map(isoOn);
  };
  return { read, asked };
};

test('the later windows are days 15-35, a week each, after the fourteen days already read', () => {
  assert.deepEqual(LATER_WINDOWS, [[14, 20], [21, 27], [28, 34]]);
  for (const [f, t] of LATER_WINDOWS) assert.equal(t - f, 6, 'Cliniko caps a request at seven days');
});

test('fourteen empty days and a time on day 20 name that day, a day only', async () => {
  const c = cliniko([20]);
  const empty = summariseWindows('camille-granda', [], []);
  assert.equal(empty.count, 0);
  const later = await firstLaterDay(c.read);
  /* The same day format as every other line ("Sun 10 Jan"; ICU without
     en-CA data prints "Sun, Jan 10", as test/book-page allows). */
  assert.match(later!, /^Sun,? (10 Jan|Jan 10)$/);
  assert.deepEqual(c.asked, [[14, 20]], 'it stops at the first week with a time');
  assert.doesNotMatch(later!, /\d{1,2}(:\d\d)? ?(am|pm)/i, 'no hour');

  const a: Availability = { ...empty, later: later! };
  assert.equal(availabilityLine(a, 'Camille'), `Camille’s next free consultation day is ${later} (Pacific time).`);
  assert.equal(firstOpenDay(a), later);
  assert.deepEqual(openDays(a), [later], 'the enquiry acknowledgement names it too');
  assert.equal(nextFreeCallLine({ 'camille-granda': a }, [{ slug: 'camille-granda', first: 'Camille' }]), `Next free call: ${later} with Camille (Pacific time)`);
});

test('a time further out is found in the third week; none in five weeks names nothing', async () => {
  const c = cliniko([33]);
  assert.match((await firstLaterDay(c.read))!, /^Sat,? (23 Jan|Jan 23)$/);
  assert.equal(c.asked.length, 3);
  assert.equal(await firstLaterDay(cliniko([]).read), null);
  const nothing = summariseWindows('x', [], []);
  assert.match(availabilityLine(nothing, 'Camille')!, /no free-consultation times in the next two weeks/, 'the old sentence when there is no later day');
});

test('a failed later read prints nothing more, and a failed fortnight prints nothing at all', async () => {
  const c = cliniko([30], (from) => from === 21);
  assert.equal(await firstLaterDay(c.read), null, 'an error stops the search and names no day');
  assert.deepEqual(c.asked, [[14, 20], [21, 27]]);
  const failed: Availability = { ...summariseWindows('x', [], []), error: 'HTTP 503', later: 'Sun 10 Jan' };
  assert.equal(availabilityLine(failed, 'Camille'), null);
  assert.equal(firstOpenDay(failed), null);
  assert.deepEqual(openDays(failed), []);
});

test('the next-consult line keeps the counsellor with her later day instead of dropping her', () => {
  const roster = [
    { slug: 'camille-granda', name: 'Camille Granda', acceptingNewClients: true, bookable: true },
    { slug: 'savneet-singh', name: 'Savneet Singh', acceptingNewClients: true, bookable: true },
  ];
  const all = {
    'camille-granda': { slug: 'camille-granda', count: 0, next: [], later: 'Mon 4 Jan' },
    'savneet-singh': { slug: 'savneet-singh', count: 0, next: [] },
  };
  assert.deepEqual(nextConsultEntries(all, roster), [{ slug: 'camille-granda', first: 'Camille', when: 'Mon 4 Jan' }]);
  assert.deepEqual(nextConsultNoneOpen(all, roster), [], 'not "nothing open" while one has a day');
  assert.deepEqual(nextConsultEntries({ ...all, 'camille-granda': { ...all['camille-granda'], error: 'down' } }, roster), []);

  /* The browser half reads the same field through /api/availability. */
  const api: ClientAvailability = {
    'camille-granda': { first: 'Camille', next: [], count: 0, later: 'Mon 4 Jan' },
    'savneet-singh': { first: 'Savneet', next: [], count: 0 },
  };
  const st = slotState(api, [
    { slug: 'camille-granda', first: 'Camille', href: '/book?with=camille-granda#calendar' },
    { slug: 'savneet-singh', first: 'Savneet', href: '/book?with=savneet-singh#calendar' },
  ]);
  assert.equal(st.kind, 'times');
  assert.deepEqual(st.kind === 'times' ? st.entries.map((e) => [e.first, e.day]) : [], [['Camille', 'Mon 4 Jan']]);
  assert.equal(availabilityLine(bookSummary(api, 'camille-granda'), 'Camille'), 'Camille’s next free consultation day is Mon 4 Jan (Pacific time).');
  assert.match(readFileSync(join(ROOT, 'app/api/availability/route.ts'), 'utf8'), /\.\.\.\(a\.later \? \{ later: a\.later \} : \{\}\)/);
});

test('the sticky bar stays silent and the read stays under one timeout and one cache key', () => {
  /* StickyBook reads firstWhen, which still needs a time in the fortnight. */
  const slot = readFileSync(join(ROOT, 'lib/consult-slot.ts'), 'utf8');
  assert.match(slot, /export function firstWhen[\s\S]*?if \(!a \|\| a\.count <= 0 \|\| !a\.next\?\.length\) return null;/);
  const src = readFileSync(join(ROOT, 'lib/cliniko-availability.ts'), 'utf8');
  assert.equal([...src.matchAll(/AbortSignal\.timeout\(/g)].length, 1);
  assert.match(src, /\['consultation-availability-v4'\]/);
  assert.match(src, /if \(summary\.count > 0\) return summary;\s*const later = await firstLaterDay\(read\);/);
});

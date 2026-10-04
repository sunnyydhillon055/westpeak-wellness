import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arriveDetail, arriveDetailFor, arriveSeenKey } from '../lib/book-arrive.ts';
import { allowedDetail, COUNSELLOR_SLUGS, BOOK_ARRIVE_OTHER } from '../lib/conversion-detail.ts';
import { bookStages, funnelCuts, parseConversions, withIncrement, type ConversionLog } from '../lib/conversion-log.ts';
import { weekTable, type Snapshot } from '../lib/conversion-snapshots.ts';

/* wf/r6-book-paths, 3 Oct 2026, item 462: arrivals on /book, counted once
   per session by who ?with= named, and /book stage by stage in /admin. */

const src = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

test('the arrival detail is the slug /book resolved, none, or ask for the bare form', () => {
  assert.equal(arriveDetailFor('camille-granda'), 'camille-granda');
  assert.equal(arriveDetailFor(undefined), 'none');
  assert.equal(arriveDetailFor(''), 'none');
  assert.equal(arriveDetail('none', '#ask-for-a-time'), 'ask');
  assert.equal(arriveDetail('none', '#calendar'), 'none');
  assert.equal(arriveDetail('none', ''), 'none');
  /* A named counsellor stays named, whatever the hash: her row is the one. */
  assert.equal(arriveDetail('camille-granda', '#ask-for-a-time'), 'camille-granda');
  assert.notEqual(arriveSeenKey('none'), arriveSeenKey('camille-granda'));
});

test('book_arrive accepts a roster slug, none and ask, and nothing else', () => {
  for (const s of [...COUNSELLOR_SLUGS, ...BOOK_ARRIVE_OTHER]) assert.equal(allowedDetail('book_arrive', s), s);
  assert.deepEqual([...BOOK_ARRIVE_OTHER], ['none', 'ask']);
  for (const bad of ['nobody', 'button', 'sticky/camille-granda', '', 'x'.repeat(90)]) assert.equal(allowedDetail('book_arrive', bad), null, bad);
});

const at = (log: ConversionLog, event: string, path: string, detail: string | null) =>
  withIncrement(log, event, path, detail, '2026-10-03T18:00:00.000Z');

test('bookStages: the practice row and one row per arrival detail, /book only', () => {
  let log = parseConversions(null);
  for (let i = 0; i < 4; i++) log = at(log, 'book_arrive', '/book', 'camille-granda');
  for (let i = 0; i < 3; i++) log = at(log, 'book_arrive', '/book', 'none');
  log = at(log, 'book_arrive', '/book', 'ask');
  log = at(log, 'scheduler_open', '/book', 'hash');
  log = at(log, 'scheduler_open', '/book', 'button');
  log = at(log, 'scheduler_interact', '/book', 'camille-granda');
  log = at(log, 'scheduler_interact', '/client-portal', 'portal:camille-granda');
  log = at(log, 'scheduler_booked', '/book', 'camille-granda');
  const rows = bookStages(log);
  assert.deepEqual(rows[0], { who: 'all', arrive: 8, open: 2, interact: 1, booked: 1 });
  assert.deepEqual(rows.slice(1).map((r) => r.who), ['camille-granda', 'none', 'ask']);
  assert.deepEqual(rows[1], { who: 'camille-granda', arrive: 4, open: null, interact: 1, booked: 1 });
  assert.deepEqual(rows[2], { who: 'none', arrive: 3, open: null, interact: 0, booked: 0 });
  assert.deepEqual(funnelCuts(log).book, rows);
  /* An empty log still prints the practice row, at zero. */
  assert.deepEqual(bookStages(parseConversions(null)), [{ who: 'all', arrive: 0, open: 0, interact: 0, booked: 0 }]);
});

test('weekTable carries arrivals per week, per counsellor, and null before they were counted', () => {
  const snap = (takenAt: string, conversions: ConversionLog): Snapshot => ({ takenAt, conversions } as Snapshot);
  let a = parseConversions(null);
  a = at(a, 'book_click', '/', null);
  let b = a;
  for (let i = 0; i < 3; i++) b = at(b, 'book_arrive', '/book', 'savneet-singh');
  b = at(b, 'book_arrive', '/book', 'none');
  b = { ...b, firstSeen: { ...(b.firstSeen ?? {}), book_arrive: '2026-10-03' } };
  const rows = weekTable([snap('2026-10-05T08:00:00Z', b), snap('2026-09-28T08:00:00Z', a)], ['savneet-singh']);
  assert.equal(rows.find((r) => r.who === 'all')!.arrive, 4);
  assert.equal(rows.find((r) => r.who === 'savneet-singh')!.arrive, 3);
  const before = weekTable([snap('2026-10-05T08:00:00Z', a), snap('2026-09-28T08:00:00Z', a)], []);
  assert.equal(before[0].arrive, null);
});

test('/book mounts the arrival counter once, from the slug it resolved; the component imports no roster', () => {
  const page = src('app/book/page.tsx');
  assert.equal(page.split('<BookArrive ').length - 1, 1);
  assert.match(page, /<BookArrive detail=\{arriveDetailFor\(asked\?\.slug\)\} \/>/);
  const c = src('components/BookArrive.tsx');
  assert.match(c, /^'use client';/);
  assert.doesNotMatch(c, /lib\/practitioners|lib\/tools|conversion-detail'/, 'no large data module in a client component');
  assert.match(c, /sessionStorage\.getItem\(key\)\) return;/, 'once per session');
  assert.match(c, /track\('book_arrive', \{ detail: d \}\)/);
  assert.match(src('lib/analytics.ts'), /\| 'book_arrive'/);
  assert.match(src('lib/conversion-log.ts'), /'book_arrive',/);
  assert.match(src('app/admin/page.tsx'), /funnelCuts\(log\)\.book\.map/);
});

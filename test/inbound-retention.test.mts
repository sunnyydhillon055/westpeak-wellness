import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prune, type Inbound } from '../lib/inbound.ts';

/* The store holds what people wrote before they had met anyone — the message
 * field is somebody describing what is wrong, in their own words. The rule for
 * how long that is kept is the difference between an inbox and an archive, and
 * the privacy page now states 24 months as a fact to the public, so this is
 * the thing that has to make it true. */

const NOW = Date.parse('2026-09-03T12:00:00Z');
const monthsAgo = (m: number) => new Date(NOW - m * 30.44 * 24 * 3_600_000).toISOString();

const rec = (id: string, createdAt: string): Inbound =>
  ({
    id, kind: 'enquiry', name: 'A', email: `${id}@example.com`,
    message: 'x', source: '/', createdAt, handled: false,
  }) as Inbound;

test('recent messages are kept', () => {
  const items = [rec('a', monthsAgo(1)), rec('b', monthsAgo(12)), rec('c', monthsAgo(23))];
  assert.equal(prune(items, NOW).length, 3);
});

test('anything past 24 months is gone', () => {
  const items = [rec('old', monthsAgo(25)), rec('new', monthsAgo(2))];
  const kept = prune(items, NOW);
  assert.deepEqual(kept.map((i) => i.id), ['new']);
});

test('the boundary keeps rather than drops', () => {
  /* Just inside two years stays. A rule that rounds the wrong way at the edge
     deletes somebody's message a day early, and there is no getting it back. */
  const items = [rec('edge', monthsAgo(23.9))];
  assert.equal(prune(items, NOW).length, 1);
});

test('an unparseable date is kept, not silently deleted', () => {
  /* A malformed record is a bug to find. Dropping it because Date.parse
     returned NaN would mean the failure mode of a corrupt timestamp is losing
     the message — the worse of the two outcomes by a long way. */
  const items = [rec('broken', 'not a date'), rec('fine', monthsAgo(1))];
  const kept = prune(items, NOW);
  assert.equal(kept.length, 2);
  assert.ok(kept.some((i) => i.id === 'broken'));
});

test('the count backstop still applies, and keeps the newest', () => {
  /* Age is the policy; the count stops the file growing without bound between
     two slow days. It has to drop the OLDEST — an off-by-direction here would
     throw away today's enquiries and keep last year's. */
  const items = Array.from({ length: 1200 }, (_, i) =>
    rec(String(i), new Date(NOW - (1200 - i) * 60_000).toISOString())
  );
  const kept = prune(items, NOW);
  assert.equal(kept.length, 1000);
  assert.equal(kept.at(-1)!.id, '1199', 'the newest record must survive');
  assert.equal(kept[0]!.id, '200', 'the oldest 200 are the ones dropped');
});

test('pruning an empty store is not an error', () => {
  assert.deepEqual(prune([], NOW), []);
});

test('the stated period matches what the privacy page promises', () => {
  /* /privacy tells the public "deleted automatically after 24 months". If this
     number is changed without changing that sentence, the site is making a
     false statement about somebody's personal information. */
  const justOver = prune([rec('a', monthsAgo(24.2))], NOW);
  const justUnder = prune([rec('b', monthsAgo(23.8))], NOW);
  assert.equal(justOver.length, 0, 'past 24 months must be deleted, as stated publicly');
  assert.equal(justUnder.length, 1, 'inside 24 months must be kept');
});

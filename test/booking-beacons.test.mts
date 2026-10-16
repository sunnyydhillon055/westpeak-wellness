import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createConversionStore, acceptedCompanions } from '@/lib/conversion-log';
import { memoryLedger, type LedgerIO } from '@/lib/blob-ledger';
import { tallyBookedSince, bookedGap, EMBED_BOOKED_FROM, type BookingTally, type TallyRow } from '@/lib/booking-tally-read';

/* A BOOKING'S THREE COUNTS ARE ONE WRITE — 15 Oct 2026 (item 506).
 *
 * scheduler_booked, booked_from and booked_via were three beacons in one
 * tick, three casUpdates on one blob, and on Vercel's weak ETags the last
 * write won: the 13 Oct booking kept booked_from and lost the other two.
 * These tests hold the batched shape: one request, one write, and `also`
 * admits nothing a separate request could not have counted. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');

delete process.env.BLOB_READ_WRITE_TOKEN;

/* A ledger that counts its writes and, like a weak ETag, never refuses one. */
const counting = () => {
  const cell = { version: 0 } as { json?: string; version: number };
  const io = memoryLedger(cell);
  let writes = 0;
  const ledger: LedgerIO = { read: io.read, write: async (json, cond) => { writes += 1; return io.write(json, cond); } };
  return { ledger, writes: () => writes };
};

test('a confirmed booking and both its companions land in one write', async () => {
  const c = counting();
  const s = createConversionStore(() => c.ledger, { backoffMs: 0 });
  await s.count('scheduler_booked', '/book', 'camille-granda', [['booked_from', '/guides/x|google'], ['booked_via', 'direct']]);
  assert.equal(c.writes(), 1, 'one write for three counts');
  const log = await s.read({ fresh: true });
  assert.equal(log.total, 3);
  assert.equal(log.events.scheduler_booked?.['/book'], 1);
  assert.equal(log.events.booked_from?.['/book'], 1);
  assert.equal(log.events.booked_via?.['/book'], 1);
  assert.equal(log.details.booked_from?.['/guides/x|google'], 1);
  assert.equal(log.details.booked_via?.direct, 1);
});

test('book_click carries click_from and nothing else', async () => {
  const io = memoryLedger();
  const s = createConversionStore(() => io, { backoffMs: 0 });
  await s.count('book_click', '/', 'header', [['click_from', '/|none'], ['booked_via', 'direct'], ['scheduler_booked', 'x']]);
  const log = await s.read({ fresh: true });
  assert.equal(log.total, 2);
  assert.deepEqual(Object.keys(log.events).sort(), ['book_click', 'click_from']);
});

test('also is bounded: no companions for other events, each once, details by the usual rule', () => {
  assert.deepEqual(acceptedCompanions('scheduler_visible', [['booked_via', 'direct']]), []);
  assert.deepEqual(acceptedCompanions('scheduler_booked', 'booked_via'), []);
  assert.deepEqual(
    acceptedCompanions('scheduler_booked', [['booked_via', 'direct'], ['booked_via', 'header']]),
    [['booked_via', 'direct']],
  );
  /* A detail off the list is dropped while the event is still counted, as alone. */
  assert.deepEqual(acceptedCompanions('scheduler_booked', [['booked_via', 'not a button']]), [['booked_via', null]]);
  assert.deepEqual(acceptedCompanions('book_click', [[1, 2], null, ['click_from']]), [['click_from', null]]);
});

test('the browser sends companions in the event request, not as beacons of their own', () => {
  const a = src('lib/analytics.ts');
  assert.match(a, /beacon\(event, detail, companions\(event, detail\)\)/);
  assert.doesNotMatch(a, /for \(const \[e, d\] of companions/);
  assert.match(a, /JSON\.stringify\(\{ event, path: window\.location\.pathname, detail, also \}\)/);
  assert.match(src('app/api/track/route.ts'), /countConversion\(event, path, detail, body\.also\)/);
  /* `detail` is body.detail, except embed_view's host (r10-booking-measurement). */
  assert.match(src('app/api/track/route.ts'), /const detail = event === 'embed_view' \? embedHostDetail\(body\.detail\) : body\.detail;/);
});

const row = (consultBooked: number, paidBooked: number): TallyRow => ({
  consultBooked, paidBooked, consultCancelled: 0, paidCancelled: 0, consultHeld: 0, paidHeld: 0, dna: 0, consultConverted: 0,
});

test('Cliniko’s tally is summed from the month the embed began counting', () => {
  const t: BookingTally = {
    months: {
      '2026-09': { 'savneet-singh': row(4, 9) },
      '2026-10': { 'savneet-singh': row(1, 1), 'camille-granda': row(1, 0) },
      '2026-11': { 'camille-granda': row(2, 3) },
    },
    updatedAt: '',
  };
  assert.equal(EMBED_BOOKED_FROM, '2026-10');
  assert.deepEqual(tallyBookedSince(t), { from: '2026-10', consult: 4, paid: 4 });
  assert.equal(bookedGap(2, 2), 'the two agree');
  assert.match(bookedGap(2, 0), /^2 booked outside the embed/);
  assert.match(bookedGap(0, 1), /^1 more than Cliniko/);
  assert.match(src('app/admin/page.tsx'), /tallyBookedSince\(tallyRead\.tally\)/);
});

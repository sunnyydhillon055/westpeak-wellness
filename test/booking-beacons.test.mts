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

/* ---------- Round 11 (wf/r11-booking-telemetry-forms), 16 Oct 2026 ---------- */
import { COUNTED_EVENTS, stepRows } from '@/lib/conversion-log';
import { acceptedDetail, stepDetailWithin, STEP_CAP } from '@/lib/conversion-detail';
import { parseClinikoMessage, stepName } from '@/lib/cliniko-frame';

/* Counted events that never pass through track(): stored by the server
   (enquiry_submit, enquiry_refused, lead_magnet_submit), sent as another
   event's companions (click_from, booked_from, booked_via), or accepted only
   for pages loaded before channel_visit replaced it (gbp_visit). */
const NOT_SENT_BY_TRACK = new Set([
  'enquiry_submit', 'enquiry_refused', 'lead_magnet_submit',
  'click_from', 'booked_from', 'booked_via', 'gbp_visit',
]);

/* #555 */
test('every COUNTED event the browser sends is in the TrackedEvent union, and no file widens one', () => {
  const a = src('lib/analytics.ts');
  const union = a.slice(a.indexOf('export type TrackedEvent ='));
  const events = new Set([...union.matchAll(/\|\s*'([a-z_0-9]+)'/g)].map((m) => m[1]!));
  for (const e of COUNTED_EVENTS) {
    if (NOT_SENT_BY_TRACK.has(e)) continue;
    assert.ok(events.has(e), `${e} is COUNTED but not a TrackedEvent`);
  }
  for (const e of ['scheduler_step', 'enquiry_blocked', 'embed_view']) assert.ok(events.has(e), e);
  for (const f of ['components/InboundForm.tsx', 'pages/embed/stress-leave-pay-calculator.tsx']) {
    assert.doesNotMatch(src(f), /as TrackedEvent|: string = '(enquiry_blocked|embed_view)'/, f);
  }
});

test('each step inside the Cliniko frame is counted once per frame, by name and counsellor, never "confirmed"', () => {
  assert.deepEqual(parseClinikoMessage('cliniko-bookings-page:patient-details'), { kind: 'page', page: 'patient-details' });
  assert.equal(stepName('patient-details'), 'patient-details');
  assert.equal(stepName('confirmed'), null, 'scheduler_booked owns the confirmation');
  for (const bad of ['Patient_Details', 'step2', 'a'.repeat(25), '']) assert.equal(stepName(bad), null, bad);

  const tele = src('components/SchedulerTelemetry.tsx');
  assert.match(tele, /const step = stepName\(msg\.page\);\s*if \(step && !steps\.has\(step\)\) \{\s*steps\.add\(step\);\s*track\('scheduler_step', \{ page, detail: who \? `\$\{step\}\/\$\{who\}` : step \}\);/);
  assert.match(tele, /const steps = new Set<string>\(\);/, 'a fresh set per mounted frame');

  assert.equal(acceptedDetail('scheduler_step', 'patient-details/camille-granda'), 'patient-details/camille-granda');
  assert.equal(acceptedDetail('scheduler_step', 'times/portal:savneet-singh'), 'times/portal:savneet-singh');
  assert.equal(acceptedDetail('scheduler_step', 'times'), 'times');
  assert.equal(acceptedDetail('scheduler_step', 'times/nobody-real'), 'times', 'an unknown counsellor falls back to the step');
  assert.equal(acceptedDetail('scheduler_step', 'Jane Doe/camille-granda'), null);
  assert.equal(acceptedDetail('scheduler_step', '../../x'), null);
});

test('the store keeps at most STEP_CAP step names and /admin gets one row per step', async () => {
  assert.equal(STEP_CAP, 12);
  const full = Object.fromEntries(Array.from({ length: STEP_CAP }, (_, i) => [`step-${'abcdefghijkl'[i]}`, 1]));
  assert.equal(stepDetailWithin(full, 'new-step'), null, 'a thirteenth name keeps no detail');
  assert.equal(stepDetailWithin(full, 'step-a/camille-granda'), 'step-a/camille-granda', 'a known name still does');
  assert.equal(stepDetailWithin({}, 'times'), 'times');

  const io = memoryLedger();
  const s = createConversionStore(() => io, { backoffMs: 0 });
  await s.count('scheduler_step', '/book', 'times/camille-granda');
  await s.count('scheduler_step', '/book', 'times/savneet-singh');
  await s.count('scheduler_step', '/book', 'details/savneet-singh');
  await s.count('scheduler_step', '/client-portal', 'times/portal:savneet-singh');
  const log = await s.read({ fresh: true });
  assert.equal(log.events.scheduler_step?.['/book'], 3);
  assert.deepEqual(stepRows(log), [{ detail: 'times', count: 2 }, { detail: 'details', count: 1 }], 'portal steps are not /book steps');
  const admin = src('app/admin/page.tsx');
  assert.match(admin, /r\.who === 'all' && stepRows\(log\)\.map/);
});

/* #588 */
test('GA4 hears generate_lead at the two moments the browser knows a lead happened, and nothing else does', () => {
  assert.match(src('components/SchedulerTelemetry.tsx'), /if \(!\(ctx\.who \?\? ''\)\.startsWith\('portal:'\)\) gaLead\('consult'\);/);
  assert.match(src('components/InboundForm.tsx'), /if \(done === 'ok'\) gaLead\('enquiry'\);/);
  assert.match(src('app/message-sent/page.tsx'), /<GaLeadOnMount form="enquiry" \/>/);
  const lead = src('lib/ga-lead.ts');
  assert.match(lead, /window\.gtag\('event', 'generate_lead', \{ form \}\)/);
  assert.doesNotMatch(lead, /sendBeacon|fetch\(|\btrack\(/, 'GA only: the counter already has both');
  assert.match(lead, /excludedBrowser\(\)/);
  /* Not in the root layout's chunk. */
  for (const f of ['app/layout.tsx', 'components/Header.tsx', 'components/Footer.tsx', 'components/StickyBook.tsx', 'components/Analytics.tsx', 'components/ConsentGate.tsx']) {
    assert.doesNotMatch(src(f), /ga-lead|GaLeadOnMount/, f);
  }
});

test('gaLead sends once per address, and never from an excluded browser or without gtag', async () => {
  const { gaLead } = await import('@/lib/ga-lead');
  const calls: unknown[][] = [];
  const store: Record<string, string> = {};
  const g = globalThis as unknown as { window?: unknown };
  const had = 'window' in g;
  g.window = {
    location: { pathname: '/contact', search: '?sent=ok' },
    localStorage: { getItem: (k: string) => store[k] ?? null },
    gtag: (...args: unknown[]) => { calls.push(args); },
  };
  try {
    gaLead('enquiry');
    gaLead('enquiry');
    assert.deepEqual(calls, [['event', 'generate_lead', { form: 'enquiry' }]]);
    store['wp-no-count'] = '1';
    gaLead('consult');
    assert.equal(calls.length, 1, 'an excluded browser sends nothing');
    delete store['wp-no-count'];
    (g.window as { gtag?: unknown }).gtag = undefined;
    gaLead('consult');
    assert.equal(calls.length, 1, 'no consent, no gtag, nothing');
  } finally {
    if (!had) delete g.window;
  }
});

test('a browser /admin has excluded is never shown the consent banner and never loads GA', () => {
  const c = src('components/ConsentGate.tsx');
  assert.match(c, /import \{ excludedBrowser \} from '@\/lib\/analytics';/);
  assert.match(c, /try \{\s*if \(excludedBrowser\(\)\) return 'declined';/);
  /* After the batch-1 banner split (item 551): 'declined' renders nothing
     and fetches neither GA nor the banner. */
  assert.match(c, /if \(choice === 'unset' \|\| choice === 'declined'\) return;/);
  assert.match(c, /if \(choice === 'unset' \|\| choice === 'declined' \|\| !part \|\| part\.for !== choice\) return null;/);
});

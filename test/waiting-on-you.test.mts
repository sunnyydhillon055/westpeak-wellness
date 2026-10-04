import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { waitingRows, CLIENT_AGREEMENT_LIVE, type WaitingInputs } from '../lib/waiting-on-you.ts';
import { recordedPractitioners } from '../lib/practitioners.ts';
import { draftGuides } from '../lib/guides-drafts.ts';

/* Item 236: /admin "Waiting on you", generated from the code. 1 Oct 2026. */

const base = (over: Partial<WaitingInputs> = {}): WaitingInputs => ({
  roster: recordedPractitioners,
  today: '2026-10-01',
  albertaPages: { 'camille-granda': 7 },
  draftGuides: draftGuides.filter((g) => g.draft).length,
  icbcVendor: false,
  directFirstSession: false,
  clientAgreementLive: false,
  punjabiFormDecided: false,
  availability: {},
  ...over,
});

const find = (rows: ReturnType<typeof waitingRows>, re: RegExp) => rows.find((r) => re.test(r.item));

test('the insurance row names the gate date and what it keeps', () => {
  const r = find(waitingRows(base({ today: '2026-10-05' })), /Camille.*insurance/)!;
  assert.ok(r, 'Camille has a policy on file');
  assert.equal(r.due, '2026-10-15');
  assert.match(r.state, /grace, gate closes 2026-10-15/);
  assert.match(r.unlocks, /7 Alberta place pages/);
  assert.doesNotMatch(r.unlocks, /anywhere in Canada/); // reach removed 3 Oct 2026
  assert.equal(r.urgent, true);
});

test('urgent rows come first', () => {
  const rows = waitingRows(base({ today: '2026-10-05' }));
  const firstCalm = rows.findIndex((r) => !r.urgent);
  assert.ok(rows.slice(firstCalm).every((r) => !r.urgent));
});

test('the flags, drafts and decisions each have a row, and drop when done', () => {
  const rows = waitingRows(base());
  for (const re of [/ICBC/, /Client agreement/, /\/punjabi form/, /first session/, /Guides waiting/]) assert.ok(find(rows, re), String(re));
  const done = waitingRows(base({ icbcVendor: true, clientAgreementLive: true, punjabiFormDecided: true, directFirstSession: true, draftGuides: 0 }));
  for (const re of [/ICBC/, /Client agreement/, /\/punjabi form/, /first session/, /Guides waiting/]) assert.equal(find(done, re), undefined, String(re));
});

test('a couples counsellor with no recorded Gottman level is listed', () => {
  const rows = waitingRows(base());
  assert.ok(find(rows, /Camille.*Gottman/));
  const withLevel = recordedPractitioners.map((p) => (p.slug === 'camille-granda' ? { ...p, gottmanTraining: 'Level 1' } : p));
  assert.equal(find(waitingRows(base({ roster: withLevel })), /Camille.*Gottman/), undefined);
});

test('consultation days come from the availability summary', () => {
  const avail = { slug: 'savneet-singh', count: 3, days: ['Tue'], earliest: '9 am', latest: '11 am', weekend: false, evening: false, next: [], week: { count: 3, days: ['Tue'], earliest: '9 am', latest: '11 am' } };
  const r = find(waitingRows(base({ availability: { 'savneet-singh': avail } })), /Savneet.*consultation days/)!;
  assert.match(r.state, /^1 day .* \(Tue\)$/);
  assert.equal(r.urgent, true);
});

test('the client-agreement constant matches app/', () => {
  assert.equal(CLIENT_AGREEMENT_LIVE, existsSync(new URL('../app/client-agreement', import.meta.url)));
});

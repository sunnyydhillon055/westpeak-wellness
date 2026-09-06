import test from 'node:test';
import assert from 'node:assert/strict';
import { pickNewInvitees } from '../lib/portal-invite.ts';

/* The selection behind the automatic welcome: which of the clients the sync
   just added get the email this run. The send itself needs mail and Blob;
   the decision does not, and it is the part that can go wrong quietly. */

const DAY = 864e5;
const NOW = Date.parse('2026-09-06T12:00:00Z');

test('every newly added active client is welcomed once', () => {
  const r = pickNewInvitees(
    [{ email: 'a@x.ca', status: 'active' }, { email: 'b@x.ca', status: 'active' }],
    {}, NOW
  );
  assert.deepEqual(r.send, ['a@x.ca', 'b@x.ca']);
  assert.equal(r.deferred + r.recentlyInvited + r.notActive, 0);
});

test('paused and former records are never handed portal access by a background job', () => {
  const r = pickNewInvitees([{ email: 'p@x.ca', status: 'paused' }, { email: 'f@x.ca', status: 'former' }], {}, NOW);
  assert.deepEqual(r.send, []);
  assert.equal(r.notActive, 2);
});

test('someone invited in the last 30 days is not sent a second email', () => {
  const ledger = { 'a@x.ca': new Date(NOW - 3 * DAY).toISOString(), 'old@x.ca': new Date(NOW - 45 * DAY).toISOString() };
  const r = pickNewInvitees([{ email: 'a@x.ca', status: 'active' }, { email: 'old@x.ca', status: 'active' }], ledger, NOW);
  assert.deepEqual(r.send, ['old@x.ca']);
  assert.equal(r.recentlyInvited, 1);
});

test('the per-run cap defers the rest rather than dropping them', () => {
  const added = Array.from({ length: 14 }, (_, i) => ({ email: `c${i}@x.ca`, status: 'active' }));
  const r = pickNewInvitees(added, {}, NOW);
  assert.equal(r.send.length, 10);
  assert.equal(r.deferred, 4);
});

test('a duplicate address in one run is welcomed once', () => {
  const r = pickNewInvitees([{ email: 'a@x.ca', status: 'active' }, { email: 'a@x.ca', status: 'active' }], {}, NOW);
  assert.deepEqual(r.send, ['a@x.ca']);
});

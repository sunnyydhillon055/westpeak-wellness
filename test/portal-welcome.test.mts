import test from 'node:test';
import assert from 'node:assert/strict';
import { pickNewInvitees, hasPaidAppointment, gateOnPaidBooking } from '../lib/portal-invite.ts';

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

/* NARROWED 1 Oct 2026: a record from Cliniko is welcomed only once that
   patient has a paid booking. Cliniko creates a patient for every free
   consultation, and "now that you are a client" was reaching people before
   their free call. */

const CONSULT = { links: { self: 'https://api.ca1.cliniko.com/v1/appointment_types/2013349744314681520' } };
const PAID = { links: { self: 'https://api.ca1.cliniko.com/v1/appointment_types/1466854657459489533' } };

test('a consultation, even several, is not a paid booking; a session is; a cancelled session is not', () => {
  assert.equal(hasPaidAppointment([{ appointment_type: CONSULT }, { appointment_type: CONSULT }], '2013349744314681520'), false);
  assert.equal(hasPaidAppointment([{ appointment_type: CONSULT }, { appointment_type: PAID }], '2013349744314681520'), true);
  assert.equal(hasPaidAppointment([{ appointment_type: PAID, cancelled_at: '2026-10-01T00:00:00Z' }], '2013349744314681520'), false);
  assert.equal(hasPaidAppointment([], '2013349744314681520'), false);
});

test('a consult-only patient from Cliniko gets no welcome and waits; a hand-added client is not gated', async () => {
  const lookups: Record<string, boolean | null> = { 'u/consult-only': false, 'u/paid': true, 'u/unreachable': null };
  const r = await gateOnPaidBooking(
    [
      { email: 'consult@x.ca', status: 'active', clinikoAppointmentsUrl: 'u/consult-only' },
      { email: 'paid@x.ca', status: 'active', clinikoAppointmentsUrl: 'u/paid' },
      { email: 'down@x.ca', status: 'active', clinikoAppointmentsUrl: 'u/unreachable' },
      { email: 'byhand@x.ca', status: 'active' },
    ],
    async (u) => lookups[u],
  );
  assert.deepEqual(r.ready.map((c) => c.email), ['paid@x.ca', 'byhand@x.ca']);
  assert.deepEqual(r.waiting.map((c) => c.email), ['consult@x.ca', 'down@x.ca'], 'an unanswered lookup waits, never welcomes');
  const pick = pickNewInvitees(r.ready, {}, NOW);
  assert.ok(!pick.send.includes('consult@x.ca'));
});

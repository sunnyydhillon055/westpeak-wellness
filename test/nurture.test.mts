import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nurtureDecision, NURTURE_FROM, magnetWords } from '../lib/nurture-plan.ts';
import { email2, email3 } from '../lib/nurture.ts';

/* WHO THE NURTURE CRON MAY WRITE TO — 1 Oct 2026.
 *
 * 64 of 69 stored leads were honeypot-tripped scripts and runNurture never
 * read the band: email 2 had already gone to four of them and email 3 to one,
 * and about fifty more reached day 4 on 2 Oct. These pin the rule. */

const DAY = 864e5;
const created = Date.parse('2026-10-02T12:00:00Z');
const lead = (over: Record<string, unknown> = {}) => ({
  email: 'someone@gmail.com', name: 'Sam', createdAt: new Date(created).toISOString(),
  ackSentAt: new Date(created + 1000).toISOString(),
  triage: { band: 'clear' as const, flags: [], why: '' },
  ...over,
});
const ctx = (over: Record<string, unknown> = {}) => ({ optedOut: false, known: false, now: created + 5 * DAY, ...over });

test('a honeypot-tripped lead is never written to, whatever else is true', () => {
  const bot = lead({ triage: { band: 'quarantine', flags: ['honeypot', 'fast'], why: '' } });
  assert.deepEqual(nurtureDecision(bot, ctx()), { skip: 'quarantine' });
  assert.deepEqual(nurtureDecision(bot, ctx({ now: created + 12 * DAY, step: 2 })), { skip: 'quarantine' });
});

test('no email 1, no email 2: a lead without ackSentAt is skipped', () => {
  assert.deepEqual(nurtureDecision(lead({ ackSentAt: undefined }), ctx()), { skip: 'noAck' });
});

test('a lead from before the new wording gets nothing further, even with an ack', () => {
  const old = Date.parse(NURTURE_FROM) - DAY;
  const l = lead({ createdAt: new Date(old).toISOString(), ackSentAt: new Date(old).toISOString() });
  assert.deepEqual(nurtureDecision(l, ctx({ now: old + 5 * DAY })), { skip: 'noAck' });
});

test('probes and throwaway addresses are bots; a quarantined record with no address is too', () => {
  assert.deepEqual(nurtureDecision(lead({ email: 'probe@example.com' }), ctx()), { skip: 'bot' });
  assert.deepEqual(nurtureDecision(lead({ email: 'x@mailinator.com' }), ctx()), { skip: 'bot' });
  assert.deepEqual(nurtureDecision(lead({ email: '' }), ctx()), { skip: 'bot' });
});

test('opted out, client or in conversation, done, not due, dormant', () => {
  assert.deepEqual(nurtureDecision(lead(), ctx({ optedOut: true })), { skip: 'optedOut' });
  assert.deepEqual(nurtureDecision(lead(), ctx({ known: true })), { skip: 'alreadyClient' });
  assert.deepEqual(nurtureDecision(lead(), ctx({ step: 3 })), { skip: 'done' });
  assert.deepEqual(nurtureDecision(lead(), ctx({ now: created + 3 * DAY })), { skip: 'notDue' });
  assert.deepEqual(nurtureDecision(lead(), ctx({ step: 2, now: created + 10 * DAY })), { skip: 'notDue' });
  assert.deepEqual(nurtureDecision(lead(), ctx({ now: created + 46 * DAY })), { skip: 'done' });
});

test('a real, acknowledged lead gets email 2 on day 4 and email 3 on day 11', () => {
  assert.deepEqual(nurtureDecision(lead(), ctx({ now: created + 4 * DAY })), { send: 2 });
  assert.deepEqual(nurtureDecision(lead(), ctx({ step: 2, now: created + 11 * DAY })), { send: 3 });
});

test('emails 2 and 3 name the one-pager that was asked for', () => {
  const icbc = email2('Sam', 'sam@gmail.com', 'icbc-after-a-crash');
  assert.match(icbc.text, /the ICBC one-pager/);
  assert.doesNotMatch(icbc.text, /coverage checklist/);
  const start = email3('Sam', 'sam@gmail.com', 'starting-counselling', { roster: [], feeLine: null });
  assert.match(start.text.replace(/\s+/g, ' '), /starting counselling/);
  assert.doesNotMatch(start.text, /coverage checklist/);
  assert.equal(magnetWords('unknown').asked, 'the coverage checklist');
});

test('email 3 offers each counsellor her own calendar and one catalogue fee line', () => {
  const m = email3('', 'sam@gmail.com', 'coverage-checklist', {
    roster: [{ slug: 'x', who: 'Pat Doe, RCC', href: 'https://example.org/book?with=x#calendar', detail: 'English' }],
    feeLine: 'An individual session is $140 for 50 minutes.',
  });
  assert.match(m.text, /Pat Doe, RCC/);
  assert.match(m.text, /\?with=x#calendar/);
  assert.match(m.html, /\?with=x#calendar/);
  assert.match(m.text, /\$140 for 50 minutes/);
  assert.match(m.text, /Unsubscribe:/);
});

/* #222: the calendar-year plan note beside the fee line, 15 Oct to 20 Dec only. */
test('email 3 carries the plan-year note in season and not on 21 Dec or 1 Jan', () => {
  const at = (iso: string) => email3('Sam', 'sam@gmail.com', 'coverage-checklist', { roster: [], feeLine: 'An individual session is $140 for 50 minutes.', now: new Date(iso) });
  const nov = at('2026-11-02T19:00:00Z');
  assert.match(nov.text.replace(/\s+/g, ' '), /sessions held by 31 December count against this year’s maximum/);
  assert.match(nov.html, /31 December/);
  for (const iso of ['2026-12-21T19:00:00Z', '2027-01-01T19:00:00Z', '2026-10-14T19:00:00Z']) {
    const m = at(iso);
    assert.doesNotMatch(m.text, /31 December/, iso);
    assert.doesNotMatch(m.html, /31 December/, iso);
  }
  /* Out of season the email is exactly what it was before the change. */
  const before = email3('Sam', 'sam@gmail.com', 'coverage-checklist', { roster: [], feeLine: 'An individual session is $140 for 50 minutes.', now: new Date('2027-01-05T19:00:00Z') });
  assert.match(before.text, /\$140 for 50 minutes\.\n\nIt is also/);
});

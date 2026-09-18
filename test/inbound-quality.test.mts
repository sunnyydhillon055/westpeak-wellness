import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isTestSubmission, looksHuman, awaitsHumanReply } from '../lib/inbound-quality.ts';

/* THE THIRTY-THREE MESSAGES NOBODY HAD SENT — 17 Sep 2026.
 *
 * The reply-time watch emailed the owner a list of thirty-three enquiries past
 * the one-business-day promise, every weekday morning. The addresses in that
 * email are below. Eight are this project's own probes; the rest are
 * newsletter scripts and throwaway domains. The count of people actually
 * waiting was three, and they had come in weeks earlier.
 *
 * These cases are taken verbatim from that alert so the filter is pinned to
 * the inbox it was written for, not to a general idea of spam. */

const row = (over: Partial<Parameters<typeof awaitsHumanReply>[0]>) =>
  ({ email: 'someone@gmail.com', name: 'A Person', message: 'I would like to book a consultation.', source: '/contact', ...over }) as Parameters<typeof awaitsHumanReply>[0];

test("this project's own probes are never a person", () => {
  for (const email of [
    'selftest-ask@example.com',
    'selftest-redirect@example.com',
    'selftest2@example.com',
    'selftest3@example.com',
    'selftest-pa@example.com',
    'probe@example.com',
    'z@mailinator.com',
    'x@thisdomaindoesnotexist-wp99.invalid',
  ]) {
    assert.equal(isTestSubmission(row({ email })), true, email);
    assert.equal(awaitsHumanReply(row({ email })), false, `${email} must never be counted as waiting`);
  }
});

test('a real address is not a test submission', () => {
  assert.equal(isTestSubmission(row({ email: 'dantle95@gmail.com' })), false);
  assert.equal(isTestSubmission(row({ email: 'addison0207@icloud.com' })), false);
});

test('newsletter and link scripts are not waiting for a reply', () => {
  assert.equal(looksHuman(row({ message: 'Please add me to your newsletter' })), false);
  assert.equal(looksHuman(row({ message: 'Great site! https://example-casino.ru/ check it out' })), false);
  assert.equal(looksHuman(row({ name: 'Bitcoin mining promo code', message: 'buy now' })), false);
});

test('an empty message from a throwaway free-mail domain is a script, with one exception', () => {
  assert.equal(looksHuman(row({ email: 'madamtaisia@mail.ru', message: '' })), false);
  assert.equal(
    looksHuman(row({ email: 'madamtaisia@mail.ru', message: 'My daughter is 16 and struggling with anxiety.' })),
    true,
    'a real message from one of these domains is a person; the domain alone decides nothing'
  );
});

test('the three real leads survive the filter', () => {
  /* Read with the owner on 11 Sep: three people, two of whom pressed "tell me
     when a time opens" on the old /book form and left no message at all. If
     the filter drops these it has failed at the only job that matters. */
  assert.equal(awaitsHumanReply(row({ email: 'dantle95@gmail.com', name: 'David', message: '', source: '/book' })), true);
  assert.equal(awaitsHumanReply(row({ email: 'addison0207@icloud.com', name: 'Thomas', message: '', source: '/book' })), true);
  assert.equal(
    awaitsHumanReply(row({ email: 'steevestoryteller@gmail.com', name: 'Stephanie', message: 'Do you have evening appointments?' })),
    true
  );
});

test('an empty message with no name and no /book origin is not counted', () => {
  assert.equal(looksHuman(row({ message: '', name: '', source: '/contact' })), false);
});

test('disposable addresses never enter the nurture sequence', async () => {
  /* The whole nurture ledger on 17 Sep 2026: five subscribers, all generated
     addresses at two throwaway domains. */
  const { looksDisposable } = await import('../lib/inbound-quality.ts');
  for (const e of ['enf1xefsht7msc@emalupe.com', '5jxcpevzkzf61a@emalupe.com', 'od2nz4mdw198rq@uberip.com', 'x@mailinator.com']) {
    assert.equal(looksDisposable(e), true, e);
  }
  for (const e of ['dantle95@gmail.com', 'steevestoryteller@gmail.com', 'first.last@shaw.ca', 'sunny@westpeakwellness.com']) {
    assert.equal(looksDisposable(e), false, `${e} is a person`);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverageClaims } from '../scripts/coverage-claims.mjs';

/* "COMMONLY", "TYPICALLY", "GENERALLY" — 15 Oct 2026 (item 530).
 *
 * /for/teachers said "District plans commonly reimburse Registered Clinical
 * Counsellor sessions" three times, and the UFV, TRU and Filipino-nurses
 * pages said the same, because the gate named only "most", "usually" and
 * "often". These pin the new shapes and the sentences they must leave alone:
 * a question, a period of weeks, an EAP, and the plan-dependent house form. */

test('catches "plans … commonly / typically / generally reimburse"', () => {
  assert.equal(coverageClaims('District plans commonly reimburse Registered Clinical Counsellor sessions.').length, 1);
  assert.equal(coverageClaims('Extended health through school districts commonly reimburses Registered Clinical Counsellor sessions.').length, 1);
  assert.equal(coverageClaims('BC extended health plans typically reimburse. And the FAQ covers the rest.').length, 1);
  assert.equal(coverageClaims('Student plans generally cover private RCC sessions.').length, 1);
});

test('catches "most student societies / unions … reimburse"', () => {
  assert.equal(coverageClaims('Most student unions carry extended health coverage that reimburses private counselling.').length, 1);
  assert.equal(coverageClaims('most student societies carry an extended health plan that reimburses a Registered Clinical Counsellor').length, 1);
});

test('passes the house form, questions, durations, EAPs and denials', () => {
  assert.equal(coverageClaims('Many district plans reimburse Registered Clinical Counsellor sessions, depending on the plan.').length, 0);
  assert.equal(coverageClaims('Plans commonly reimburse an RCC, depending on the plan.').length, 0);
  assert.equal(coverageClaims('What Alberta extended health plans typically reimburse for an RCC, and the questions to ask.').length, 0);
  assert.equal(coverageClaims('a short-term disability plan typically covers 15 to 26 weeks').length, 0);
  assert.equal(coverageClaims('Plans that reimburse RCC counselling generally reimburse it regardless of session length.').length, 0);
  assert.equal(coverageClaims('An EAP is a service your employer buys. It typically covers short-term counselling.').length, 0);
  assert.equal(coverageClaims('Many student unions include a plan, and what yours pays depends on the plan.').length, 0);
  assert.equal(coverageClaims('Most student unions do not cover couples sessions.').length, 0);
});

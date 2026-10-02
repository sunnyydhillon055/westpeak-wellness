import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coverageClaims } from '../scripts/coverage-claims.mjs';

/* THE WIDER SHAPES — 2 Oct 2026 (item 381).
 *
 * The first sweep matched "most [BC] [extended health] plans reimburse" and
 * missed two live sentences: an English FAQ answer on the Tagalog page ("Most
 * health-employer and union plans in BC reimburse") and the newcomers page
 * ("usually reimburses a Registered Clinical Counsellor"). These pin that the
 * gate now catches both shapes, and still passes the plan-dependent form and
 * sentences that deny rather than claim. */

test('catches "most <words> plans … reimburse" with up to five words between', () => {
  assert.equal(coverageClaims('Most health-employer and union plans in BC reimburse a Registered Clinical Counsellor.').length, 1);
  assert.equal(coverageClaims('Most workplace extended health plans reimburse some of it.').length, 1);
  assert.equal(coverageClaims('Most group plans will usually reimburse RCC sessions.').length, 1);
});

test('catches "usually reimburses" an RCC or counselling', () => {
  assert.equal(coverageClaims('extended health insurance, which usually reimburses a Registered Clinical Counsellor up to a limit').length, 1);
  assert.equal(coverageClaims('a plan that usually reimburses an RCC').length, 1);
  assert.equal(coverageClaims('it usually reimburses counselling').length, 1);
});

test('passes the plan-dependent form, denials, and unrelated "usually reimburse"', () => {
  assert.equal(coverageClaims('Many employer and union health plans in BC reimburse a Registered Clinical Counsellor to an annual maximum, depending on the plan, so check yours.').length, 0);
  assert.equal(coverageClaims('which in many plans reimburses a Registered Clinical Counsellor up to an annual limit, depending on the plan').length, 0);
  assert.equal(coverageClaims('Most provincial plans do not reimburse private counselling.').length, 0);
  assert.equal(coverageClaims('Plans that list an RCC usually reimburse a video session on the same terms').length, 0);
  assert.equal(coverageClaims('What extended health usually reimburses, and what the consultation covers.').length, 0);
  assert.equal(coverageClaims('Most plans have a deadline. Some reimburse late claims.').length, 0);
});

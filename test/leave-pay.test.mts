import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  leavePay, eiWeeklyBenefit, federalPaidDays, sickDays, waitingWaivedOn, weekRange, dollars,
  EI_SICKNESS_WEEKS, BC_PAID_DAYS, BC_UNPAID_DAYS, FEDERAL_MAX_DAYS,
} from '../lib/leave-pay.ts';
import {
  eiSicknessMax, EI_WAITING_WAIVER, eiWaitingWaived, EI_WAITING_CLAUSE, longDate, pacificDate,
} from '../lib/benefit-figures.ts';
import { getTool } from '../lib/tools.ts';
import { TOOL_OUTCOMES, BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* THE STRESS-LEAVE PAY CALCULATOR — 13 Oct 2026.
 *
 * The figure comes from lib/benefit-figures.ts in every test, never typed:
 * scripts/price-drift.mjs fails a typed weekly maximum, and a test that typed
 * one would go stale on 1 January with the pages. Dates sit at Pacific midday
 * (CI's Node puts BC on UTC-7 from November 2026, local Node on UTC-8). */

const ROOT = join(import.meta.dirname, '..');
const EI = eiSicknessMax(new Date('2026-10-13T19:00:00Z'));
const FIG = { weekly: EI.weekly, year: EI.year };
const year = (weeklyEarnings: number, rest: Partial<Parameters<typeof leavePay>[0]> = {}, waived = true) =>
  leavePay({ weeklyEarnings, monthsOfService: 12, ...rest }, FIG, waived);

test('EI is 55% of weekly earnings, rounded to the dollar', () => {
  assert.equal(eiWeeklyBenefit(1000, EI.weekly), 550);
  assert.equal(eiWeeklyBenefit(801, EI.weekly), 441); // 440.55 rounds up
  assert.equal(eiWeeklyBenefit(799, EI.weekly), 439); // 439.45 rounds down
  assert.equal(eiWeeklyBenefit(0, EI.weekly), 0);
  assert.equal(eiWeeklyBenefit(-50, EI.weekly), 0);
  assert.equal(eiWeeklyBenefit(Number.NaN, EI.weekly), 0);
});

test('EI stops at the year’s maximum, and the maximum is what high earners get', () => {
  const atCap = Math.ceil(EI.maxInsurableEarnings / 52);
  assert.equal(eiWeeklyBenefit(atCap, EI.weekly), EI.weekly);
  assert.equal(eiWeeklyBenefit(atCap * 3, EI.weekly), EI.weekly);
  const pic = year(atCap * 2);
  assert.equal(pic.eiWeekly, EI.weekly);
  assert.equal(pic.capped, true);
  assert.equal(year(1000).capped, false);
});

test('a BC employee with 90 days: one week of sick pay, then 26 EI weeks with no waiting week while waived', () => {
  const pic = year(1000);
  assert.deepEqual(pic.phases.map((p) => [p.kind, p.fromWeek, p.toWeek, p.weeklyPay]), [
    ['sick-pay', 1, 1, 1000],
    ['ei', 2, 27, 550],
    ['after', 28, 28, null],
  ]);
  assert.equal(pic.paidDays, BC_PAID_DAYS);
  assert.equal(pic.unpaidDays, BC_UNPAID_DAYS);
  assert.equal(pic.waitingWeek, false);
  assert.equal(pic.weeksShown, 27);
  assert.equal(pic.totalPaid, 1000 + 550 * 26);
  assert.equal(pic.usualTotal, 27 * 1000);
});

test('outside the waiver the waiting week is unpaid and pushes EI back a week', () => {
  const pic = year(1000, {}, false);
  assert.deepEqual(pic.phases.map((p) => [p.kind, p.fromWeek, p.toWeek, p.weeklyPay]), [
    ['sick-pay', 1, 1, 1000],
    ['waiting', 2, 2, 0],
    ['ei', 3, 28, 550],
    ['after', 29, 29, null],
  ]);
  assert.equal(pic.totalPaid, 1000 + 550 * 26);
  assert.equal(pic.usualTotal, 28 * 1000);
});

test('EI never runs past 26 weeks', () => {
  for (const waived of [true, false]) {
    for (const federal of [true, false]) {
      const ei = leavePay({ weeklyEarnings: 1200, monthsOfService: 12, federal }, FIG, waived).phases.find((p) => p.kind === 'ei')!;
      assert.equal(ei.toWeek - ei.fromWeek + 1, EI_SICKNESS_WEEKS);
    }
  }
});

test('under 90 days in a BC job: no sick days, paid or unpaid, so EI is the first income', () => {
  for (const months of [0, 1, 2]) {
    const pic = year(900, { monthsOfService: months });
    assert.equal(pic.paidDays, 0);
    assert.equal(pic.unpaidDays, 0);
    assert.equal(pic.phases[0]!.kind, 'ei');
    assert.equal(pic.phases[0]!.fromWeek, 1);
  }
  assert.equal(year(900, { monthsOfService: 3 }).paidDays, BC_PAID_DAYS);
});

test('sick days already used this year come off the paid days, and a part week is paid for its days', () => {
  assert.deepEqual(sickDays({ monthsOfService: 12, daysUsed: 2 }), { paid: 3, unpaid: 3 });
  assert.deepEqual(sickDays({ monthsOfService: 12, daysUsed: 9 }), { paid: 0, unpaid: 3 });
  const pic = year(1000, { daysUsed: 2 });
  assert.deepEqual(pic.phases[0], { kind: 'sick-pay', fromWeek: 1, toWeek: 1, weeklyPay: 600, paidDays: 3 });
});

test('federal: 3 days after 30 days, one more a month after a full month, to 10', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 8, 9, 24].map(federalPaidDays), [0, 3, 3, 4, 5, 9, 10, FEDERAL_MAX_DAYS]);
  const pic = year(1000, { federal: true });
  assert.deepEqual(pic.phases.map((p) => [p.kind, p.fromWeek, p.toWeek, p.weeklyPay]), [
    ['sick-pay', 1, 2, 1000],
    ['ei', 3, 28, 550],
    ['after', 29, 29, null],
  ]);
  assert.equal(pic.unpaidDays, 0, 'the Code has no unpaid sick days; its 27 weeks are protection');
  assert.equal(year(1000, { federal: true, monthsOfService: 2 }).paidDays, 3, 'the 90-day BC rule does not apply');
});

test('a short-term disability plan gets no number, and no EI total is claimed', () => {
  const pic = year(1000, { shortTermDisability: true }, false);
  const plan = pic.phases.find((p) => p.kind === 'plan')!;
  assert.equal(plan.weeklyPay, null);
  assert.equal(pic.phases.some((p) => p.kind === 'ei' || p.kind === 'waiting'), false);
  assert.equal(pic.totalPaid, null);
  assert.equal(pic.eiWeekly, 550, 'EI is still worked out, for comparison');
});

test('a work-caused leave names the route and changes no figure', () => {
  assert.deepEqual(year(1000, { workCaused: true }), year(1000));
});

test('the waiver window is read from canada.ca, inclusive at both ends, and still open', () => {
  assert.equal(EI_WAITING_WAIVER.from, '2025-03-30');
  assert.equal(EI_WAITING_WAIVER.to, '2027-10-09');
  assert.equal(waitingWaivedOn('2025-03-29', EI_WAITING_WAIVER), false);
  assert.equal(waitingWaivedOn('2025-03-30', EI_WAITING_WAIVER), true);
  assert.equal(waitingWaivedOn('2027-10-09', EI_WAITING_WAIVER), true);
  assert.equal(waitingWaivedOn('2027-10-10', EI_WAITING_WAIVER), false);
  assert.equal(eiWaitingWaived(new Date('2026-10-13T19:00:00Z')), true);
  assert.equal(eiWaitingWaived(new Date('2027-10-10T19:00:00Z')), false);
  assert.equal(pacificDate(new Date('2027-01-01T03:00:00Z')), '2026-12-31');
  assert.equal(longDate('2027-10-09'), '9 October 2027');
  /* When the window has closed, re-read the canada.ca page: it may have been
     extended, and the pages should not go on saying either thing unchecked. */
  assert.ok(pacificDate() <= EI_WAITING_WAIVER.to, 'the waiting-week waiver has ended: re-read EI_WAITING_WAIVER.sourceUrl');
  assert.match(EI_WAITING_CLAUSE, /waiting period/);
});

test('labels', () => {
  assert.equal(weekRange({ fromWeek: 1, toWeek: 1 }), 'Week 1');
  assert.equal(weekRange({ fromWeek: 2, toWeek: 27 }), 'Weeks 2 to 27');
  assert.equal(dollars(14300), '$14,300');
  assert.equal(dollars(549.6), '$550');
});

test('the tool is registered, counted and linked from the pages that answer the question', () => {
  const t = getTool('stress-leave-pay-calculator')!;
  assert.ok(t.metaTitle.length <= 60, t.metaTitle);
  assert.ok(t.metaDescription.replace(/&/g, '&amp;').length <= 158, t.metaDescription);
  assert.ok(TOOL_OUTCOMES['stress-leave-pay-calculator']);
  assert.ok(BOOK_LOCATIONS.includes('tool:stress-leave-pay-calculator'));
  for (const f of ['lib/resources-more.ts', 'lib/guides-more7.ts', 'lib/guides-more6.ts', 'app/tools/page.tsx']) {
    assert.match(readFileSync(join(ROOT, f), 'utf8'), /\/tools\/stress-leave-pay-calculator/, f);
  }
});

test('the client half imports nothing large', () => {
  const src = readFileSync(join(ROOT, 'components/tools/LeavePayCalculator.tsx'), 'utf8');
  const imports = [...src.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  for (const bad of ['@/lib/practitioners', '@/lib/tools', '@/lib/benefit-figures', '@/lib/cliniko-catalog', '@/lib/conversion-detail']) {
    assert.ok(!imports.includes(bad), `LeavePayCalculator imports ${bad}`);
  }
  assert.doesNotMatch(readFileSync(join(ROOT, 'lib/leave-pay.ts'), 'utf8'), /^import /m);
});

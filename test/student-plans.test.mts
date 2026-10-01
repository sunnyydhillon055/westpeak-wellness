import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  STUDENT_PLANS, STUDENT_PLAN_TABLE_AFTER, reimbursedPerSession, sessionsCovered, paysLabel,
  staleStudentPlans, studentPlanFaqs, readOn,
} from '../lib/student-plans.ts';
import { getAudience } from '../lib/audiences.ts';
import { getResource } from '../lib/resources.ts';
import { ACCESS_ROUTES } from '../lib/tools.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';

/* What each BC student-society plan pays for an RCC (1 Oct 2026). The rows
   are read from the plans' own pages; these tests hold the arithmetic, the
   placement and the date the rows were read. */

const FEE = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!.cents / 100;
const today = () => new Date().toISOString().slice(0, 10);

test('no plan row is more than 365 days old', () => {
  /* A plan year resets every September. A maximum read more than a year ago
     is a wrong number on a money page: re-read the plan page, update the row
     and its checkedOn. */
  const stale = staleStudentPlans(today());
  assert.deepEqual(stale.map((p) => `${p.id} (read ${p.checkedOn})`), []);
});

test('the staleness check counts days, not calendar years', () => {
  const row = { ...STUDENT_PLANS[0], checkedOn: '2026-10-01' };
  assert.equal(staleStudentPlans('2027-10-01', 365, [row]).length, 0);
  assert.equal(staleStudentPlans('2027-10-02', 365, [row]).length, 1);
});

test('every row is sourced, dated and sane', () => {
  const ids = new Set<string>();
  for (const p of STUDENT_PLANS) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    assert.match(p.source, /^https:\/\/[a-z0-9-]+\.alumo\.ca\//, p.id);
    assert.match(p.checkedOn, /^\d{4}-\d{2}-\d{2}$/, p.id);
    assert.ok(p.percent > 0 && p.percent <= 100, p.id);
    assert.ok(p.annualMax > 0, p.id);
    assert.ok(p.referral && p.policyYear, p.id);
  }
});

test('the figures read on 1 Oct 2026', () => {
  const by = Object.fromEntries(STUDENT_PLANS.map((p) => [p.id, p]));
  assert.deepEqual([by['ubc-ams-gss'].percent, by['ubc-ams-gss'].annualMax], [100, 1250]);
  assert.deepEqual([by['sfss-enhanced'].percent, by['sfss-enhanced'].annualMax], [90, 750]);
  assert.deepEqual([by['sfss-basic'].perVisitMax, by['sfss-basic'].annualMax], [30, 650]);
  assert.deepEqual([by.uvss.percent, by.uvss.annualMax], [70, 800]);
  assert.deepEqual([by.lsu.percent, by.lsu.annualMax], [100, 500]);
  assert.deepEqual([by.ksa.percent, by.ksa.annualMax], [80, 500]);
  assert.deepEqual([by.dsu.percent, by.dsu.annualMax], [80, 450]);
  assert.equal(by.dsu.namesRcc, false, 'the DSU page says "counsellor" and does not name the RCC');
});

test('sessions covered at a $140 fee', () => {
  const at = (id: string, fee: number) => sessionsCovered(STUDENT_PLANS.find((p) => p.id === id)!, fee);
  assert.equal(at('ubc-ams-gss', 140), 8); // 1250 / 140
  assert.equal(at('sfss-enhanced', 140), 5); // 750 / 126
  assert.equal(at('sfss-basic', 140), 21); // 650 / 30
  assert.equal(at('uvss', 140), 8); // 800 / 98
  assert.equal(at('lsu', 140), 3); // 500 / 140
  assert.equal(at('ksa', 140), 4); // 500 / 112
  assert.equal(at('dsu', 140), 4); // 450 / 112
});

test('reimbursement respects the percentage and a per-visit cap, to the cent', () => {
  assert.equal(reimbursedPerSession({ percent: 70 }, 175), 122.5);
  assert.equal(reimbursedPerSession({ percent: 100, perVisitMax: 30 }, 140), 30);
  assert.equal(reimbursedPerSession({ percent: 80, perVisitMax: 200 }, 140), 112);
  assert.equal(sessionsCovered({ percent: 0, annualMax: 500 }, 140), 0);
  assert.equal(paysLabel({ percent: 100, perVisitMax: 30 }), '$30 of each visit');
  assert.equal(paysLabel({ percent: 90 }), '90% of each visit');
  assert.equal(readOn('2026-10-01'), '1 October 2026');
});

test('the table follows a section that exists on each of the three student pages', () => {
  for (const [key, h2] of Object.entries(STUDENT_PLAN_TABLE_AFTER)) {
    const [area, slug] = key.split('/');
    const sections = area === 'for' ? getAudience(slug)?.sections : getResource(slug)?.sections;
    assert.ok(sections, `${key} is not a page`);
    assert.ok(sections!.some((s) => s.h2 === h2), `${key} has no section "${h2}"`);
  }
  assert.deepEqual(Object.keys(STUDENT_PLAN_TABLE_AFTER).sort(), [
    'for/international-students', 'for/university-students', 'resources/student-mental-health-supports-bc',
  ]);
});

test('the student resource asks the question and answers it plan by plan', () => {
  const r = getResource('student-mental-health-supports-bc')!;
  assert.match(r.title, /^Does my student health plan cover counselling\?/);
  assert.ok(r.metaTitle.length <= 60, r.metaTitle);
  assert.ok(r.metaDescription.replace(/&/g, '&amp;').length <= 158, r.metaDescription);
  for (const f of studentPlanFaqs()) assert.ok(r.faqs.some((x) => x.q === f.q), f.q);
  assert.match(r.shortAnswer, /single-session/);
});

test('the university page: one row per service, a Tagalog row, Here2Talk single-session, the claim order', () => {
  const a = getAudience('university-students')!;
  const hrefs = a.servicesThatFit.map((s) => s.href);
  assert.equal(new Set(hrefs).size, hrefs.length, 'a service is listed twice');
  assert.ok(hrefs.includes('/tagalog-counselling'));
  assert.match(a.opening.join(' '), /Here2Talk\]\([^)]+\) offers free, confidential single-session/);
  const two = a.sections.find((s) => s.h2 === 'Two plans, and who sees the claim')!;
  assert.match(two.body!.join(' '), /Claim on your own student plan first/);
  assert.match(two.body!.join(' '), /parent's claim history/);
});

test('the international page separates the pre-MSP insurance from the society plan', () => {
  const a = getAudience('international-students')!;
  const body = a.sections.find((s) => s.h2 === 'What your plan probably covers')!.body!.join(' ');
  assert.match(body, /guard\.me/);
  assert.match(body, /student society's extended health plan/);
  assert.doesNotMatch(body, /commonly one of those things/);
});

test('the access tool tells an enrolled student about their plan, after campus counselling', () => {
  const route = ACCESS_ROUTES.studentplan;
  assert.ok(route, 'no studentplan route');
  assert.match(route.detail, /student-society plans reimburse/);
  assert.doesNotMatch(route.detail, /\$\d/, 'figures belong in lib/student-plans.ts, not the client bundle');
  const src = readFileSync('components/tools/AccessCheck.tsx', 'utf8');
  assert.match(src, /keys\.push\('student', 'studentplan'\)/);
});

test('the estimator offers the plans and imports nothing heavy', () => {
  const src = readFileSync('components/tools/CoverageEstimator.tsx', 'utf8');
  assert.match(src, /from '@\/lib\/student-plans'/);
  assert.doesNotMatch(src, /from '@\/lib\/(practitioners|tools|audiences|resources|cliniko-catalog)'/);
  assert.ok(FEE > 0);
});

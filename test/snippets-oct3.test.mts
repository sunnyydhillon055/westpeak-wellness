import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { practitioners, recordedPractitioners, withInsuranceGate } from '../lib/practitioners.ts';
import { feeSnippet, metaLength, namedProfileSnippet, SNIPPET_MAX } from '../lib/snippet-facts.ts';
import { PLAN_COVERAGE, reachesAlberta, servedProvinces } from '../lib/practice-facts.ts';
import { individualFeePhrase } from '../lib/session-arithmetic.ts';
import { resources } from '../lib/resources.ts';
import { guides } from '../lib/guides.ts';
import { services } from '../lib/services.ts';
import { comparisons } from '../lib/comparisons.ts';
// @ts-expect-error a plain .mjs script, imported for its exported checks
import { coverageClaims, typedAlberta } from '../scripts/coverage-claims.mjs';

/* 3 Oct 2026 — the r6 snippet and content round (items 408-466). */

const C = FALLBACK_CATALOG;
const IND = money(C.items.find((i) => i.name === 'Individual Counselling')!.cents);
const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;

test('feeSnippet is the fee and the free consult, no names', () => {
  assert.equal(feeSnippet(C), `${IND} per 50-min session · free 30-min consult`);
  assert.equal(feeSnippet(C, 'no-such-service'), undefined);
});

test('namedProfileSnippet names her with her letters and no registration number', () => {
  const s = namedProfileSnippet(C, { ...camille, acceptingNewClients: true }, 'CCC')!;
  assert.match(s, /^Camille Granda, CCC: from \$\d+ per 50-min session · free 30-min consult$/);
  for (const c of camille.credentials) assert.ok(!s.includes(c.number), 'no registration number');
  assert.equal(namedProfileSnippet(C, { ...camille, acceptingNewClients: false }, 'CCC'), undefined);
});

test('servedProvinces follows the insurance gate', () => {
  const open = withInsuranceGate(camille, '2026-10-03');
  const shut = withInsuranceGate(camille, '2026-10-15');
  assert.equal(servedProvinces([open]), 'BC and Alberta');
  assert.equal(servedProvinces([open], 'long'), 'British Columbia and Alberta');
  assert.equal(servedProvinces([shut]), 'BC');
  assert.equal(servedProvinces([]), 'BC');
  assert.equal(servedProvinces([{ ...open, acceptingNewClients: false }]), 'BC');
  assert.equal(reachesAlberta([open]), true);
  assert.equal(reachesAlberta([shut]), false);
});

test('individualFeePhrase reads the catalogue', () => {
  assert.equal(individualFeePhrase(C), `${IND} for 50 minutes`);
});

test('the rewritten descriptions carry the fee and fit, and none opens "No." or "Often,"', () => {
  const pick = <T extends { slug: string }>(xs: T[], slug: string) => xs.find((x) => x.slug === slug)!;
  const descs = [
    pick(resources, 'does-my-plan-cover-counselling-bc').metaDescription,
    pick(resources, 'msp-vs-extended-health').metaDescription,
    pick(guides, 'waiting-for-therapy-in-bc').metaDescription,
  ];
  for (const d of descs) {
    assert.ok(d.includes(`${IND} per 50-min session · free 30-min consult`), d);
    assert.ok(metaLength(d) <= SNIPPET_MAX, `${metaLength(d)}: ${d}`);
    assert.doesNotMatch(d, /^(No|Often)[.,]/);
    assert.equal(coverageClaims(d).length, 0, d);
  }
  const ab = pick(resources, 'counselling-coverage-in-alberta');
  assert.ok(metaLength(ab.metaDescription) <= SNIPPET_MAX, ab.metaDescription);
  assert.doesNotMatch(ab.metaDescription, /^No\./);
  assert.match(ab.metaDescription, /depending on the plan/);
  assert.equal(ab.title, 'Is therapy covered by Alberta Health Care? What counselling costs in Alberta');
  /* Her name and fee only while the gated roster still offers her in Alberta. */
  const live = reachesAlberta(practitioners.filter((p) => p.acceptingNewClients));
  assert.equal(ab.metaDescription.includes('Camille Granda'), live);
});

test('the coverage resource title names the insurer in full, within 60', () => {
  const r = resources.find((x) => x.slug === 'does-my-plan-cover-counselling-bc')!;
  assert.equal(r.metaTitle, 'Does Pacific Blue Cross or Sun Life Cover Counselling in BC?');
  assert.ok(r.metaTitle.length <= 60);
});

test('individual, Punjabi and Tagalog pages answer cost and coverage in the house words', () => {
  const qs: Record<string, RegExp> = {
    'individual-therapy': /^How much does individual counselling cost/,
    'punjabi-counselling': /^What does counselling in Punjabi cost/,
    'tagalog-counselling': /^What does counselling in Tagalog cost/,
  };
  for (const [slug, q] of Object.entries(qs)) {
    const f = services.find((s) => s.slug === slug)!.faqs!.find((x) => q.test(x.q));
    assert.ok(f, slug);
    assert.ok(f.a.includes(IND), `${slug} fee`);
    assert.ok(f.a.includes('free 30-minute consultation'), slug);
    assert.ok(f.a.includes('MSP does not cover private counselling'), slug);
    assert.ok(f.a.includes(PLAN_COVERAGE), slug);
    assert.ok(f.a.includes('registration number'), slug);
    assert.ok(f.a.includes('/resources/does-my-plan-cover-counselling-bc'), slug);
  }
});

test('the Punjabi title says therapist, and the couples page cites its video evidence', () => {
  const pa = services.find((s) => s.slug === 'punjabi-counselling')!;
  assert.equal(pa.metaTitle, 'Punjabi-Speaking Therapist and Counsellor Online in BC');
  assert.match(pa.metaDescription.split(/[.:]/)[0]!, /therapist/);
  const cp = services.find((s) => s.slug === 'couples-therapy')!;
  const f = cp.faqs!.find((x) => /as well as in person/.test(x.q))!;
  assert.match(f.a, /pmc\.ncbi\.nlm\.nih\.gov\/articles\/PMC8855148/);
  assert.match(f.a, /small/);
  assert.match(f.a, /\/guides\/is-online-therapy-as-effective-as-in-person/);
  assert.ok(cp.sources.some((s) => s.url.includes('PMC8855148')));
});

test('the Tagalog page offers Alberta only while the gate is open', () => {
  const tl = services.find((s) => s.slug === 'tagalog-counselling')!;
  const asksAlberta = tl.faqs!.some((x) => x.q === 'Can you see me in Alberta?');
  const live = practitioners.some((p) => p.slug === 'camille-granda' && p.provinces.includes('AB'));
  assert.equal(asksAlberta, live);
  assert.equal(tl.metaDescription.includes('Alberta'), live);
});

test('the AI comparison prices its Cost row and drops "a practice that uses both"', () => {
  const c = comparisons.find((x) => x.slug === 'therapy-apps-ai-vs-counselling')!;
  const cost = c.table.rows.find((r) => r[0] === 'Cost')!;
  assert.ok(cost[2]!.includes(IND));
  assert.match(cost[2]!, /depending on the plan/);
  assert.match(cost[2]!, /30-minute consultation is free/);
  assert.doesNotMatch(c.metaDescription, /uses both/);
  assert.ok(c.shortAnswer.includes(IND));
  const f = c.faqs.find((x) => /AI mental-health app cost/.test(x.q))!;
  assert.ok(f.a.includes(IND));
  assert.match(f.a, /\$140 to \$175|fee guide/);
});

test('the "often" shapes are caught, the plan-dependent form is not', () => {
  assert.equal(coverageClaims("'Often, to an annual maximum your plan sets.'").length, 1);
  assert.equal(coverageClaims('Extended health plans that list Registered Clinical Counsellors often reimburse couples sessions.').length, 1);
  assert.equal(coverageClaims('Session fees; often partly reimbursed by extended health plans').length, 1);
  assert.equal(coverageClaims('benefits plans that often reimburse it, depending on the plan.').length, 0);
  assert.equal(coverageClaims("'Often, yes. Cumulative exposure tends to present late.'").length, 0);
  assert.equal(coverageClaims('the role often covers course planning').length, 0);
});

test('a typed "BC and Alberta" is caught outside comments', () => {
  assert.equal(typedAlberta("title: 'Counselling in BC and Alberta'").length, 1);
  assert.equal(typedAlberta('serving all of British Columbia or Alberta').length, 1);
  assert.equal(typedAlberta('/* was "BC and Alberta" */').length, 0);
  assert.equal(typedAlberta('serving all of ${PROVINCES}').length, 0);
});

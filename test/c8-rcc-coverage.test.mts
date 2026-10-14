import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getResource } from '../lib/resources.ts';
import { metaLength, SNIPPET_MAX } from '../lib/snippet-facts.ts';
import { ALBERTA_OPEN, BC_ONLY_LABEL } from '../lib/resources-alberta.ts';
import { practitioners, insuredProvinces, vancouverToday } from '../lib/practitioners.ts';
// @ts-expect-error a plain .mjs script, imported for its exported checks
import { coverageClaims } from '../scripts/coverage-claims.mjs';

/* wf/c8-rcc-coverage, 13 Oct 2026. Search Console 13 Oct: the RCC page 1,862
   impressions at 10.91; plan coverage 628 at 6.28; Alberta coverage 412 at
   6.48; MSP vs extended health 128 at 9.65. */

const page = (slug: string) => getResource(slug)!;

test('the RCC page asks the head query, compares the four designations and links the directory', () => {
  const r = page('verify-a-counsellor-in-bc');
  assert.equal(r.sections[0].h2, 'What is a Registered Clinical Counsellor (RCC)?');
  const cmp = r.sections.find((s) => /^RCC vs CCC vs psychologist/.test(s.h2));
  assert.ok(cmp?.table, 'the comparison table');
  const names = cmp!.table!.rows.map((row) => row[0]);
  for (const n of ['Registered Clinical Counsellor (RCC)', 'Canadian Certified Counsellor (CCC)', 'Registered Psychologist (R.Psych)']) assert.ok(names.includes(n), n);
  assert.ok(cmp!.table!.columns.includes('Where to check'));
  assert.ok(r.faqs.some((f) => f.q === 'What is the difference between an RCC and a CCC?'));
  assert.ok(r.sources.some((s) => s.url.startsWith('https://www.ccpa-accp.ca/certification')));
  /* No registration number on a resource page: they live on the profiles. */
  for (const p of practitioners) for (const c of p.credentials ?? []) if (c.number) assert.ok(!JSON.stringify(r).includes(c.number), c.number);
  assert.doesNotMatch(JSON.stringify(r), /most (extended health )?plans/i);
});

test('the plan page answers insurer by insurer, GreenShield included, in plan-dependent words', () => {
  const r = page('does-my-plan-cover-counselling-bc');
  assert.ok(r.metaTitle.length <= 60);
  assert.ok(metaLength(r.metaDescription) <= SNIPPET_MAX);
  assert.match(r.metaTitle, /Pacific Blue Cross/);
  assert.match(r.metaTitle, /Counselling Coverage/);
  const t = r.sections[0];
  assert.equal(t.h2, 'Short answers, insurer by insurer');
  const insurers = t.table!.rows.map((row) => row[0]);
  assert.deepEqual(insurers, ['Pacific Blue Cross', 'Sun Life', 'Manulife', 'Canada Life', 'GreenShield']);
  assert.ok(r.faqs.some((f) => f.q === 'Does GreenShield cover counselling?'));
  assert.ok(r.sources.some((s) => s.url.includes('greenshield.ca')));
  const all = JSON.stringify(r);
  assert.doesNotMatch(all, /almost every list|Most plans do not/);
  assert.equal(coverageClaims(t.table!.rows.flat().join(' ')).length, 0);
  assert.equal(coverageClaims(r.metaDescription).length, 0);
});

test('MSP vs extended health answers "counselling covered by msp" from the province’s own list', () => {
  const r = page('msp-vs-extended-health');
  assert.equal(r.metaTitle, 'Is Counselling Covered by MSP in BC? MSP vs Extended Health');
  assert.ok(r.metaTitle.length <= 60);
  assert.match(r.metaDescription, /^Counselling is not covered by MSP in BC/);
  assert.match(r.shortAnswer, /^Counselling is not covered by MSP in BC/);
  assert.ok(r.sources.some((s) => s.url.endsWith('services-not-covered-by-msp')));
  assert.ok(r.faqs.some((f) => f.q === 'Is counselling covered by MSP in BC?'));
  assert.doesNotMatch(JSON.stringify(r), /Almost always covered|\$250 an hour/);
});

test('Alberta coverage answers first and follows the insurance gate in every typed line', () => {
  const r = page('counselling-coverage-in-alberta');
  assert.match(r.metaDescription, /^Therapy is not covered by Alberta Health Care/);
  assert.match(r.lede, /^Therapy with a counsellor or psychologist in private practice is not covered by Alberta Health Care/);
  assert.ok(r.sources.some((s) => s.url === 'https://www.alberta.ca/ahcip-what-is-covered'));
  const live = practitioners.some((p) => p.acceptingNewClients && insuredProvinces(p, vancouverToday()).includes('AB'));
  assert.equal(ALBERTA_OPEN, live);
  const check = page('how-to-check-a-counsellor-in-alberta');
  for (const x of [r, check]) {
    const text = JSON.stringify({ midCta: x.midCta, faqs: x.faqs, sections: x.sections, related: x.related });
    if (live) {
      assert.equal(x.bookLabel, undefined);
    } else {
      assert.equal(x.bookLabel, BC_ONLY_LABEL);
      assert.ok(!text.includes('Camille'), `${x.slug} names her with the gate closed`);
      assert.ok(!text.includes('/camille-granda/calgary') && !text.includes('/camille-granda/edmonton'));
      assert.match(x.midCta.label, /British Columbia/);
    }
  }
});

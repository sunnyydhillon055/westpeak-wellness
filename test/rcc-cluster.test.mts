import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getResource } from '../lib/resources.ts';
import { getComparison } from '../lib/comparisons.ts';
import { glossary } from '../lib/glossary.ts';
import { BCPA_PSYCHOLOGIST } from '../lib/fee-guides.ts';

/* wf/tp-rcc, 3 Oct 2026: the RCC, psychiatry and Alberta coverage cluster.
   Search Console 3 Oct: "registered clinical counsellor" 317 impressions at
   23.5 and "registered counsellor" 124 at 28, no clicks; the RCC page 1,581
   at 13.55. */

const RCC = '/resources/verify-a-counsellor-in-bc';
const metaLen = (s: string) => s.replace(/&/g, '&amp;').length;

test('the RCC page answers the head query in its description, a table and the finding question', () => {
  const r = getResource('verify-a-counsellor-in-bc')!;
  assert.match(r.metaDescription, /Registered Clinical Counsellor \(RCC\)/);
  assert.ok(metaLen(r.metaDescription) <= 158, `${metaLen(r.metaDescription)} chars`);
  assert.ok(metaLen(r.metaTitle) <= 60);
  const table = r.sections[0].table!;
  assert.ok(table, 'the definition section carries a table');
  const labels = table.rows.map((row) => row[0]);
  for (const l of ['Granted by', 'A government licence?', 'Covered by MSP?', 'How to check one']) assert.ok(labels.includes(l), l);
  /* Every figure in the table is sourced: the count comes from BCACC's release. */
  assert.ok(r.sources.some((s) => s.url.includes('newswire.ca') && /10,000/.test(s.label)));
  assert.ok(r.faqs.some((f) => f.q === 'How do I find a Registered Clinical Counsellor in BC?'));
  assert.ok(r.faqs.some((f) => f.q === 'What is BCACC?'));
  /* "Most" is a coverage overclaim on this site; plans are plan-dependent. */
  assert.doesNotMatch(JSON.stringify(r), /most (extended health )?plans/i);
});

test('the RCC comparison summarises the designation and links the RCC page in its body', () => {
  const c = getComparison('rcc-vs-psychologist-vs-social-worker-bc')!;
  assert.ok(!c.sections.some((s) => /actually means/.test(s.h2)), 'the definition heading moved to the RCC page');
  const first = c.sections[0].body!.join(' ');
  assert.ok(first.includes(`](${RCC})`));
  const hrefs = c.related.map((l) => l.href);
  assert.equal(new Set(hrefs).size, hrefs.length, 'a related link repeats');
});

test('psychologist vs psychiatrist quotes only the BCPA rate, and is linked from its neighbours', () => {
  const c = getComparison('psychologist-vs-psychiatrist-bc')!;
  const all = JSON.stringify(c);
  assert.doesNotMatch(all, /\$225/);
  assert.ok(all.includes(BCPA_PSYCHOLOGIST.range));
  assert.doesNotMatch(all, /bookable this week/);
  assert.ok(c.table!.rows.some((r) => r[0] === 'Training'));
  assert.ok(c.faqs.some((f) => /difference between a psychologist and a psychiatrist/.test(f.q)));
  const target = '/compare/psychologist-vs-psychiatrist-bc';
  const linkers = [
    JSON.stringify(getResource('psychiatry-and-assessment-in-bc')),
    JSON.stringify(getResource('verify-a-counsellor-in-bc')),
    JSON.stringify(getResource('msp-vs-extended-health')),
    JSON.stringify(getComparison('psychiatrist-vs-counsellor-bc')),
    JSON.stringify(getComparison('rcc-vs-psychologist-vs-social-worker-bc')),
  ];
  for (const l of linkers) assert.ok(l.includes(target));
  assert.equal(glossary.find((t) => t.term === 'Registered Psychologist')!.href, target);
});

test('Alberta coverage names the government psychologist benefit and Counselling Alberta, with sources', () => {
  const r = getResource('counselling-coverage-in-alberta')!;
  assert.match(r.shortAnswer, /^No\. Alberta Health Care \(AHCIP\) does not cover private counselling/);
  assert.match(r.shortAnswer, /Non-Group Coverage/);
  assert.match(r.shortAnswer, /\$60 a visit/);
  assert.match(r.shortAnswer, /Counselling Alberta/);
  assert.ok(r.sources.some((s) => s.url === 'https://www.alberta.ca/non-group-coverage'));
  assert.ok(r.sources.some((s) => s.url === 'https://counsellingalberta.com/'));
  assert.ok(r.faqs.some((f) => f.q === 'Is therapy covered by Alberta Health Care?'));
  const hrefs = r.related.map((l) => l.href);
  assert.equal(new Set(hrefs).size, hrefs.length, 'a related link repeats');
  assert.ok(hrefs.includes('/resources/how-to-check-a-counsellor-in-alberta'));
});

test('the Alberta check page answers whether psychotherapy is regulated there, and is linked to', () => {
  const r = getResource('how-to-check-a-counsellor-in-alberta')!;
  const q = r.faqs.find((f) => f.q === 'Is psychotherapy regulated in Alberta?');
  assert.ok(q);
  assert.match(q!.a, /1 March 2024/);
  assert.ok(r.sources.some((s) => s.url.includes('regulation-in-alberta')));
  assert.doesNotMatch(JSON.stringify(r), /Both counsellors here/);
  const target = '/resources/how-to-check-a-counsellor-in-alberta';
  assert.ok(JSON.stringify(getResource('verify-a-counsellor-in-bc')).includes(target));
  assert.equal(glossary.find((t) => t.term === 'Canadian Certified Counsellor')!.href, target);
});

test('the glossary defines RCC on the RCC page and carries the searched titles', () => {
  assert.equal(glossary.find((t) => t.term === 'Registered Clinical Counsellor')!.href, RCC);
  for (const term of ['Psychiatrist', 'Licensed counsellor', 'AHCIP']) assert.ok(glossary.some((t) => t.term === term), term);
  assert.equal(glossary.find((t) => t.term === 'AHCIP')!.href, '/resources/counselling-coverage-in-alberta');
});

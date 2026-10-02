import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  TYPICAL_BC_FEES, BCACC_INDIVIDUAL, BCACC_COUPLES_FAMILY, GUIDE_FOR_SERVICE, guidePhrase,
} from '../lib/fee-guides.ts';
import { feeGuideProblems, guideRanges, typedGuideRanges } from '../scripts/price-drift.mjs';
import { generatedFaqs, feeFor, counsellorsFor } from '../lib/city-service-page.ts';
import { FALLBACK_CATALOG, fallbackFee } from '../lib/cliniko-catalog.ts';
import { getTool, therapyCostAnswer } from '../lib/tools.ts';

/* THE MARKET FEE CONSTANT — 1 Oct 2026.
 *
 * The BCACC and BCPA figures were typed on /pricing and again on the RCC vs
 * psychologist comparison. lib/fee-guides.ts is now the one copy, and these
 * pin what can still go wrong: the wording and the numbers beside it
 * disagreeing, the range being typed again elsewhere, and a page that should
 * carry it not doing so. */

const src = (p: string) => readFileSync(p, 'utf8');
/** Source with block and line comments removed: the copy a reader sees. */
const copyOf = (p: string) => src(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('every published range agrees with its cents, and the drift check says so', () => {
  assert.deepEqual(feeGuideProblems(src('lib/fee-guides.ts')), []);
  for (const g of TYPICAL_BC_FEES) {
    if (g.lowCents === null) {
      assert.doesNotMatch(g.range, /\$\d/, `${g.label} states a figure with no cents`);
      continue;
    }
    assert.ok(g.range.includes(`$${g.lowCents / 100}`), `${g.label}: ${g.range} vs ${g.lowCents}`);
    assert.ok(g.range.includes(`$${(g.highCents ?? 0) / 100}`), `${g.label}: ${g.range} vs ${g.highCents}`);
    assert.match(g.readOn, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('the drift check catches a range whose wording and figures disagree', () => {
  const bad = `export const FEE_GUIDES_READ_ON = '2026-10-01';
  const X = { label: 'x', range: '$155 to $205', lowCents: 15500, highCents: 21000, unit: '', source: '', readOn: FEE_GUIDES_READ_ON };`;
  assert.equal(feeGuideProblems(bad).length, 1);
});

test('no other file types a guide range, in either spelling', () => {
  assert.deepEqual(guideRanges(src('lib/fee-guides.ts')).sort(), ['$140 to $175', '$155 to $205', '$175 to $225']);
  assert.deepEqual(typedGuideRanges(process.cwd()), []);
});

test('the guides are the associations’ figures, never this practice’s fee row', () => {
  for (const g of TYPICAL_BC_FEES) assert.doesNotMatch(g.label, /westpeak|this practice/i);
  assert.equal(guidePhrase(BCACC_INDIVIDUAL), '$140 to $175 per 50-minute session');
});

test('the city-service cost FAQ carries the association range for individual and couples only', () => {
  const ctx = { city: 'Abbotsford', region: 'Fraser Valley', authority: 'Fraser Health' };
  const loc = { communities: [] as string[] };
  const costAnswer = (svc: string, name: string) => {
    const topic = { name, bookingService: svc } as Parameters<typeof generatedFaqs>[0]['topic'];
    const faqs = generatedFaqs({ topic, ctx, loc, counsellors: counsellorsFor(topic), fee: feeFor(FALLBACK_CATALOG, topic) });
    return faqs.find((f) => /cost/.test(f.q))?.a ?? '';
  };
  const couples = costAnswer('couples-therapy', 'Couples Therapy');
  assert.ok(couples.includes(BCACC_COUPLES_FAMILY.range), couples);
  assert.ok(couples.includes(fallbackFee('Couples Counselling')), couples);
  assert.match(couples, /plan-dependent/);
  assert.ok(costAnswer('individual-therapy', 'Anxiety Counselling').includes(BCACC_INDIVIDUAL.range));
  const emdr = costAnswer('emdr-therapy', 'EMDR Therapy');
  assert.ok(emdr && !/BCACC/.test(emdr), 'an EMDR intensive has no comparable published range');
  assert.equal(GUIDE_FOR_SERVICE['emdr-therapy'], undefined);
});

test('the cost tool states a figure in its first screen and is titled for the calculator', () => {
  const tool = getTool('therapy-cost-bc')!;
  assert.ok(tool.metaTitle.length <= 60, tool.metaTitle);
  assert.match(tool.metaTitle, /Calculator/);
  assert.ok(tool.metaDescription.length <= 158, `${tool.metaDescription.length}`);
  assert.match(tool.metaDescription, /\$\d+ to \$\d+/);
  const answer = therapyCostAnswer({ individual: '$140', couples: '$175', minutes: 50 });
  assert.match(answer.slice(0, 200), /\$\d+/);
  assert.match(answer, /depends on your extended health plan/);
  assert.match(src('app/tools/therapy-cost-bc/page.tsx'), /therapyCostAnswer\(/);
  // lib/tools.ts reaches client bundles; it must not pull the catalogue in.
  assert.doesNotMatch(src('lib/tools.ts'), /cliniko-catalog/);
});

test('/pricing reads the constant and carries the dated table', () => {
  const page = src('app/pricing/page.tsx');
  assert.match(page, /from '@\/lib\/fee-guides'/);
  assert.match(page, /TYPICAL_BC_FEES\.map/);
  assert.doesNotMatch(page, /BCACC_GUIDE|BCPA_RATE/);
  const title = page.match(/absolute: '([^']+)'/)?.[1] ?? '';
  assert.ok(title.length > 0 && title.length <= 60, title);
});

/* 1 Oct 2026. The College of Psychologists of BC amalgamated into the College
   of Health and Care Professionals of BC; the comparison page still named it
   as current in three places, two of them FAQ answers. */
test('no reader-facing string names the College of Psychologists as current', () => {
  for (const f of ['lib/comparisons.ts', 'lib/depth-other.ts']) {
    for (const line of copyOf(f).split('\n')) {
      if (/College of Psychologists/.test(line)) {
        assert.match(line, /formerly/, `${f}: ${line.trim().slice(0, 120)}`);
      }
    }
  }
  const rsw = src('lib/comparisons.ts').match(/q: 'RSW vs RCC: which should I choose\?', a: '([^']+)'/)?.[1] ?? '';
  assert.doesNotMatch(rsw, /both are regulated/);
  assert.match(rsw, /29 November 2027/);
});

/* 1 Oct 2026. 1-844-944-4744 is the Indigenous Support Line, not an AHS
   province-wide mental health line, and AHS mental health moved to Recovery
   Alberta on 1 Sep 2024. */
test('the Alberta routes name Recovery Alberta and its helplines, not 944-4744', () => {
  for (const f of ['lib/resources-alberta.ts', 'lib/tools.ts']) {
    const copy = copyOf(f);
    assert.doesNotMatch(copy, /944-4744/, f);
    assert.match(copy, /1-877-303-2642/, f);
    assert.match(copy, /1-866-332-2322/, f);
    assert.match(copy, /Recovery Alberta/, f);
  }
  assert.match(src('lib/resources-alberta.ts'), /metaTitle: 'Is Therapy Covered by Alberta Health Care \(AHCIP\)\?'/);
});

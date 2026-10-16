import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getResource, citationFor } from '../lib/resources.ts';
import { ALBERTA_OPEN } from '../lib/resources-alberta.ts';
import { getGuide } from '../lib/guides.ts';
import { getAudience } from '../lib/audiences.ts';
import { getExtra } from '../lib/depth.ts';

/* Round 10, 15 Oct 2026: items 510, 522, 523, 525, 529, 540 and 549. */

const read = (p: string) => readFileSync(p, 'utf8');

test('510: the calculator prints a figures table and a citation ending #figures, between how-it-works and embed', () => {
  const src = read('app/tools/stress-leave-pay-calculator/page.tsx');
  const how = src.indexOf('id="how-it-works"');
  const fig = src.indexOf('id="figures"');
  const cite = src.indexOf('id="citing"');
  const embed = src.indexOf('id="embed"');
  assert.ok(how > 0 && how < fig && fig < cite && cite < embed, 'out of order');
  assert.match(src, /`\/tools\/\$\{tool\.slug\}#figures`/);
  assert.match(src, /<CopyText text=\{CITATION\}/);
  /* Values come from the constants, never typed beside the figure. */
  const table = src.slice(src.indexOf('const FIGURES'), src.indexOf('const FIGURES_CHECKED'));
  assert.doesNotMatch(table, /\$\d|\b(729|749|68,?900|70,?800)\b/);
  const c = citationFor({ title: 'Stress leave pay calculator for BC', slug: 'x', updated: '2026-10-15' }, 'https://www.westpeakwellness.com', '/tools/stress-leave-pay-calculator#figures');
  assert.ok(c.endsWith('https://www.westpeakwellness.com/tools/stress-leave-pay-calculator#figures'), c);
});

test('522: the boundaries guide books individual work and drops the repeated passages', () => {
  const g = getGuide('setting-boundaries-with-family')!;
  assert.equal(g.service, undefined);
  const text = JSON.stringify(g.sections);
  assert.ok(!text.includes('deserves to be grieved rather than reframed'));
  assert.ok(!text.includes('core value rather than an optional one. The'));
  assert.ok(getExtra('guides', g.slug).some((s) => s.h2 === 'What the first three months usually look like'));
});

test('523: the stress-leave page loses the cluster map and the duplicate FAQs, and asks the paid question in searchers’ words', () => {
  const r = getResource('workplace-mental-health-bc')!;
  assert.ok(!getExtra('resources', r.slug).some((s) => /cluster, mapped/.test(s.h2)));
  const qs = r.faqs.map((f) => f.q);
  assert.ok(qs.includes('Is mental health leave paid in BC?'));
  assert.ok(!qs.includes('Does my employer have to know my diagnosis?'));
  assert.ok(!qs.includes('Can I be fired for taking mental-health leave?'));
  assert.ok(!JSON.stringify(r).includes('14 September'));
});

test('525: the trades page is titled for tradespeople and promises no shift timing', () => {
  const a = getAudience('trades-and-construction-workers')!;
  assert.equal(a.metaTitle, 'Counselling for Tradespeople and Construction Workers in BC');
  assert.ok(a.metaTitle.length <= 60);
  const text = JSON.stringify(a);
  assert.doesNotMatch(text, /after the shift|around the shift|commonly reimburse/i);
  assert.match(read('scripts/voice-audit.mjs'), /id: 'shift-timing'/);
});

test('529 and 540: the outreach pages carry the linkable block; the words page names its printable sheet', () => {
  for (const s of ['verify-a-counsellor-in-bc', 'workplace-mental-health-bc', 'counselling-in-punjabi-what-the-words-mean', 'student-mental-health-supports-bc']) {
    assert.equal(getResource(s)!.linkable, true, s);
  }
  assert.match(read('app/resources/[slug]/page.tsx'), /<a href=\{PDF_PATH\}>one-page printable version \(PDF\)<\/a>/);
  assert.match(read('docs/OUTREACH.md'), /## 21\. Student health plans/);
});

test('549: with the Alberta gate shut the coverage page prices nothing and closes on its routes', () => {
  const r = getResource('counselling-coverage-in-alberta')!;
  if (ALBERTA_OPEN) {
    assert.equal(r.routesCloser, undefined);
    assert.equal(r.figure, 'reimbursement-flow');
    return;
  }
  assert.ok(r.routesCloser);
  assert.equal(r.figure, undefined);
  assert.ok(!r.seasonal!.body.some((p) => p.includes('$300 left')));
  assert.equal(r.sections[1]!.h2, 'The free and lower-cost routes first');
  const labels = r.routesCloser!.routes.map((x) => x.label).join(' ');
  for (const w of ['Counselling Alberta', '811', '211 Alberta']) assert.ok(labels.includes(w), w);
  for (const x of r.routesCloser!.routes) if (x.url) assert.ok(r.sources.some((s) => s.url === x.url), `${x.url} is not a source`);
  assert.doesNotMatch(JSON.stringify(r.routesCloser), /\$\d/);
});

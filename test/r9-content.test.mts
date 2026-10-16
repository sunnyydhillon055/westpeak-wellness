import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getResource } from '../lib/resources.ts';
import { pacificYear } from '../lib/benefit-figures.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { locations } from '../lib/locations.ts';
import { cityContexts } from '../lib/city-context.ts';
import { pairs, getPair } from '../lib/city-services.ts';
import { htmlLength } from '../lib/city-hub.ts';
import { metaLength } from '../lib/snippet-facts.ts';

/* r9, 15 Oct 2026: the year-end page refreshed for the year it is built in,
 * and the Vancouver / North Vancouver split made unmistakable. */

const ROOT = process.cwd();
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const SLUG = 'counselling-benefits-before-year-end-bc';
const PATH = `/resources/${SLUG}`;
const HOURS = /\b(evening|weekend|saturday|sunday)s?\b|\b\d{1,2}(:\d\d)?\s?(a\.?m\.?|p\.?m\.?)(?![a-z])/i;

test('the year-end page carries the build year, computed, in title, H1 and answer', () => {
  const r = getResource(SLUG)!;
  const y = String(pacificYear());
  assert.ok(r.metaTitle.includes(y), r.metaTitle);
  assert.ok(r.title.includes(y), r.title);
  assert.ok(r.shortAnswer.includes(`31 December ${y}`));
  assert.match(r.shortAnswer, /^Book the session for a date on or before/, 'answer first');
  assert.ok(htmlLength(r.metaTitle) <= 60, r.metaTitle);
  assert.ok(metaLength(r.metaDescription) <= 155, r.metaDescription);
  assert.match(r.metaDescription, /Many reset on 1 January, not all/);
  /* The year is never typed in the data module's own year-end copy. */
  /* Sources keep their read dates and the CBA benefit its start date; the
     rest of the copy reads the year from pacificYear(). */
  const block = src('lib/resources-more2.ts').split("slug: 'counselling-benefits-before-year-end-bc'")[1]!.split('    sources: [')[0]!;
  const copy = block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/updated: '[^']*'/, '').replace(/From 1 January 2026/, '');
  assert.doesNotMatch(copy, /\b20\d\d\b/, 'a typed year in the year-end copy');
});

test('the year-end page answers the two named queries, with the plan-year caveat', () => {
  const r = getResource(SLUG)!;
  const qs = r.faqs.map((f) => f.q);
  assert.ok(qs.includes('How do I use my counselling benefits before the end of the year?'));
  assert.ok(qs.includes('Do benefits reset on 1 January in BC?'));
  const reset = r.faqs.find((f) => f.q === 'Do benefits reset on 1 January in BC?')!.a;
  assert.match(reset, /Many plans do, and some do not/);
  assert.match(reset, /depending on the plan/);
  const all = JSON.stringify(r);
  assert.doesNotMatch(all, /\bmost\b[^.]*\bplans?\b/i, 'never "most plans"');
  assert.doesNotMatch(all, HOURS, 'no hours, no evenings or weekends');
  assert.doesNotMatch(all, /slots? left|spots? left|guarantee|available (today|this week)/i);
  assert.ok(r.sections.some((s) => s.h2 === 'How to book a session before the year ends' && s.book));
  assert.equal(r.sections.filter((s) => s.book).length, 1, 'one booking block');
});

test('the year-end fees come from the catalogue', () => {
  const r = getResource(SLUG)!;
  const all = JSON.stringify(r);
  const fee = (n: string) => money(FALLBACK_CATALOG.items.find((i) => i.name === n)!.cents);
  assert.ok(all.includes(fee('Individual Counselling')));
  assert.ok(all.includes(fee('Couples Counselling')));
  assert.doesNotMatch(src('lib/resources-more2.ts').split("slug: 'counselling-benefits-before-year-end-bc'")[1]!.split('\n  },\n')[0]!, /\$1[0-9]{2}\b/, 'a typed fee');
});

test('the plan, MSP and stress-leave pages link the year-end page in body copy; /pricing already does', () => {
  const md = `](${PATH})`;
  const plan = getResource('does-my-plan-cover-counselling-bc')!;
  assert.ok(plan.faqs.some((f) => f.a.includes(md)), 'plan coverage FAQ');
  const msp = getResource('msp-vs-extended-health')!;
  assert.ok(msp.sections.some((s) => (s.body ?? []).some((b) => b.includes(md))), 'MSP body');
  const work = getResource('workplace-mental-health-bc')!;
  assert.ok(JSON.stringify(work.sections).includes(md), 'stress-leave page body');
  /* /pricing already links it twice (the in-season line and the receipts
     section), so it gains nothing. */
  assert.ok((src('app/pricing/page.tsx').match(/<Link href=\{YEAR_END_PATH\}>/g) ?? []).length >= 2);
});

test('North Vancouver says North Shore in its hub title, H1 and lede, and points the city at Vancouver', () => {
  const nv = locations.find((l) => l.slug === 'north-vancouver')!;
  for (const s of [nv.hubTitle!, nv.hubH1!, nv.blurb]) {
    assert.match(s, /North Vancouver/);
    assert.match(s, /North Shore/);
  }
  assert.ok(htmlLength(nv.hubTitle!) <= 60);
  assert.match(nv.intro![0]!, /City of Vancouver[^[]*\[online counselling in Vancouver\]\(\/online-counselling\/vancouver\)/);
});

test('North Vancouver service pages say North Shore in the lede and name Vancouver’s own page', () => {
  for (const p of pairs.filter((x) => x.city === 'north-vancouver')) {
    assert.match(p.angle, /North Shore/, `${p.service}: ${p.angle}`);
  }
  const ctx = cityContexts.find((c) => c.slug === 'north-vancouver')!;
  assert.equal(ctx.meantInstead?.slug, 'vancouver');
  for (const p of pairs.filter((x) => x.city === 'north-vancouver')) {
    assert.ok(getPair('vancouver', p.service), `no Vancouver ${p.service} page to point at`);
  }
  assert.equal(cityContexts.filter((c) => c.meantInstead).length, 1, 'only North Vancouver');
  assert.match(src('app/online-counselling/[city]/[service]/page.tsx'), /ctx\.meantInstead && getPair\(ctx\.meantInstead\.slug, svc\.slug\)/);
});

test('Vancouver service pages say Vancouver in the lede, and the city context types no hour', () => {
  for (const p of pairs.filter((x) => x.city === 'vancouver')) {
    assert.match(p.angle, /\bVancouver\b/, `${p.service}: ${p.angle}`);
    assert.doesNotMatch(p.angle, /North (Vancouver|Shore)/);
  }
  const v = cityContexts.find((c) => c.slug === 'vancouver')!;
  assert.doesNotMatch([v.travel, v.inPerson, v.unlock].join(' '), /\b\d{1,2}\s?(am|pm)\b/i);
});

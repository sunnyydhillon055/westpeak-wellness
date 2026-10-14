import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { punjabiWordsResource } from '../lib/resources-punjabi-words.ts';
import { getPunjabiRegion, punjabiRegions } from '../lib/punjabi-regions.ts';
import { getService } from '../lib/services.ts';

/* 13 Oct 2026 (wf/c8-language), from the Search Console export of that day.
   The Punjabi words page: 1,932 impressions at 8.8 and one click, every
   query "X meaning in punjabi". /punjabi 111 at 9.5, /punjabi-counselling/
   vancouver 57 at 9.1, /services/tagalog-counselling 24 at 8.6, no clicks. */

const r = punjabiWordsResource[0]!;
const GURMUKHI = /[਀-੿]/;
const src = (f: string) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const amp = (s: string) => s.replace(/&/g, '&amp;');

test('the words page promises the list and examples, keeping the head query', () => {
  assert.match(r.metaTitle, /^Counselling Meaning in Punjabi/);
  assert.match(r.metaTitle, /Word List/);
  assert.match(r.metaTitle, /Example/);
  assert.ok(amp(r.metaTitle).length <= 60, `${r.metaTitle.length}`);
  const d = amp(r.metaDescription);
  assert.ok(d.length <= 158, `${d.length}`);
  for (const w of ['Counselling', 'counsellor', 'therapy', 'therapist', 'consult', 'salah-mashwara', 'example']) {
    assert.ok(d.includes(w), w);
  }
});

test('the page opens on the word table, under a heading with the query in it', () => {
  const first = r.sections[0]!;
  assert.match(first.h2, /^Counselling meaning in Punjabi/);
  assert.ok(first.table, 'the first section is the table');
  assert.equal(first.body, undefined, 'nothing stands between the heading and the table');
  for (const row of first.table!.rows) {
    assert.ok(row[3]!.split(/\s+/).length <= 12, `a meaning short enough to lift: ${row[0]}`);
  }
  const english = first.table!.rows.map((row) => row[0]!.toLowerCase());
  for (const w of ['counselling', 'counselor', 'consult', 'therapy', 'therapist', 'consultation', 'counsel']) {
    assert.ok(english.some((e) => e.includes(w)), w);
  }
});

test('every Gurmukhi word and example on the page already stood on the site', () => {
  /* No new Punjabi: each Gurmukhi run in the table and the example list is
     found in the site's own Punjabi pages, read as they are on main. */
  const corpus = [
    'lib/punjabi-guides.ts', 'lib/practitioner-pa.ts', 'app/punjabi/page.tsx',
  ].map(src).join('\n');
  /* The page's own FAQ answers, unchanged since 3 Oct, glossed every word
     the table now lists. */
  const faq = r.faqs.map((f) => f.a).join(' | ');
  const examples = r.sections.flatMap((s) => s.list ?? []);
  assert.ok(examples.length >= 3, 'example sentences are on the page');
  for (const e of examples) assert.ok(corpus.includes(e.label), `quoted from the Punjabi pages: ${e.label}`);
  /* The word table rebuilt that day; the feeling-word table is as it was. */
  for (const s of [r.sections[0]!]) {
    for (const row of s.table?.rows ?? []) {
      assert.ok(GURMUKHI.test(row[1]!), row[0]);
      assert.ok(corpus.includes(row[1]!) || faq.includes(row[1]!), `already on the site: ${row[1]}`);
    }
  }
});

test('the words page names who to see for counselling in Punjabi, and the next line still lands', () => {
  const bridge = r.sections.find((s) => /^If you want counselling in Punjabi/.test(s.h2));
  assert.ok(bridge, 'the bridge section');
  assert.match(bridge!.body![0]!, /Savneet Singh/);
  assert.match(bridge!.body![0]!, /individual counselling/);
  assert.ok(!/couples|EMDR/i.test(bridge!.body![0]!), 'nothing she does not offer');
  assert.ok(src('app/resources/[slug]/page.tsx').includes(`h2: '${bridge!.h2}'`));
});

test('/punjabi leads with the English query and keeps its Gurmukhi', () => {
  const page = src('app/punjabi/page.tsx');
  const title = page.match(/const TITLE = '([^']+)'/)![1]!;
  assert.match(title, /^Counselling in Punjabi/);
  assert.ok(GURMUKHI.test(title));
  assert.ok(title.length <= 60, `${title.length}`);
  const lead = page.match(/const LEAD = '([^']+)'/)![1]!;
  assert.match(lead, /^Counselling in Punjabi/);
  assert.match(page, /serviceSnippet\(await readCatalog\(\), 'individual-therapy'/);
  assert.match(page, /<p className="lede" lang="en">/);
});

test('region pages put the direct answer under the heading; only Vancouver retitles', () => {
  const page = src('app/punjabi-counselling/[region]/page.tsx');
  const h1 = page.indexOf('<h1>Punjabi-speaking counselling in {r.region}</h1>');
  const answer = page.indexOf('<p className="lede direct-answer">{opening}</p>');
  assert.ok(h1 > 0 && answer > h1 && answer - h1 < 900, 'the answer follows the H1');
  assert.match(page, /r\.metaTitle \?\? `Punjabi Counselling in \$\{r\.region\}, BC \| Westpeak`/);
  const titled = punjabiRegions.filter((x) => x.metaTitle);
  assert.deepEqual(titled.map((x) => x.slug), ['vancouver']);
  const v = getPunjabiRegion('vancouver')!;
  assert.match(v.metaTitle!, /Punjabi Therapist in Vancouver/);
  assert.ok(v.metaTitle!.length <= 60);
});

test('/services/tagalog-counselling is titled in the words searched', () => {
  const s = getService('tagalog-counselling')!;
  assert.match(s.metaTitle, /^Counselling & Therapy in Tagalog/);
  assert.ok(amp(s.metaTitle).length <= 60, `${amp(s.metaTitle).length}`);
  assert.match(s.metaDescription, /^Counselling and therapy in Tagalog/);
  assert.ok(!/Filipino counsellor/.test(s.metaTitle), 'the audience, not her background');
});

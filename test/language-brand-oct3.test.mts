import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { punjabiWordsResource } from '../lib/resources-punjabi-words.ts';
import { counsellorForLanguage } from '../lib/booking-cta.ts';
// @ts-expect-error -- plain .mjs shared with next.config.mjs; no declaration file
import { REDIRECTS } from '../lib/redirects.mjs';

/* 3 Oct 2026 (wf/tp-language-brand). The Punjabi words page had 1,036
   impressions at position 8.8 and one click: searchers want a word's meaning
   and the snippet opened in Gurmukhi. /careers (639 impressions, 35 clicks)
   lands on /about, which never said the practice is not hiring. */

const r = punjabiWordsResource[0];
const GURMUKHI = /[਀-੿]/;

test('the Punjabi words description answers in English first and fits the SERP', () => {
  const d = r.metaDescription.replace(/&/g, '&amp;');
  assert.ok(d.length <= 158, `${d.length}`);
  assert.match(d, /^Counselling in Punjabi is /);
  for (const w of ['Therapy', 'therapist', 'consult', 'burnout']) assert.ok(d.includes(w), w);
  assert.ok(r.metaTitle.length <= 60 && /Counselling Meaning in Punjabi/.test(r.metaTitle));
});

test('both word tables lead with the English word a searcher typed', () => {
  const tables = r.sections.map((s) => s.table).filter((t): t is NonNullable<typeof t> => !!t);
  assert.equal(tables.length, 2);
  for (const t of tables) {
    assert.equal(t.columns[0], 'English');
    assert.equal(t.columns[1], 'Punjabi');
    for (const row of t.rows) {
      assert.equal(row.length, t.columns.length, row[0]);
      assert.ok(!GURMUKHI.test(row[0]), `English cell is English: ${row[0]}`);
      assert.ok(GURMUKHI.test(row[1]), `Punjabi cell is Gurmukhi: ${row[1]}`);
    }
    assert.equal(new Set(t.rows.map((row) => row[0])).size, t.rows.length, 'row keys are unique');
  }
  const english = tables.flatMap((t) => t.rows.map((row) => row[0].toLowerCase()));
  for (const w of ['counselling', 'therapy', 'therapist', 'counsel', 'to consult', 'burnout']) {
    assert.ok(english.some((e) => e.includes(w)), w);
  }
});

test('the page bridges to a Punjabi-speaking counsellor who can be booked', () => {
  assert.equal(r.language, 'pa');
  assert.match(r.midCta.text, /Punjabi-speaking counsellor/);
  assert.match(r.midCta.text, /15-minute/);
  const p = counsellorForLanguage('pa');
  assert.ok(p, 'someone accepting and bookable speaks Punjabi');
  assert.ok(!/founder/i.test(p!.role));
});

test('/about tells job seekers the practice is not recruiting, and /careers still lands there', () => {
  const about = readFileSync(new URL('../app/about/page.tsx', import.meta.url), 'utf8');
  assert.match(about, /not recruiting at the moment/);
  assert.match(about, /not taking speculative applications/);
  const careers = (REDIRECTS as { source: string; destination: string }[]).find((x) => x.source === '/careers');
  assert.equal(careers?.destination, '/about');
});

test('/about does not say Punjabi sessions include couples or EMDR work', () => {
  const about = readFileSync(new URL('../app/about/page.tsx', import.meta.url), 'utf8');
  assert.ok(!/EMDR and trauma therapy in English, Punjabi and Tagalog/.test(about));
  assert.match(about, /individual counselling in Punjabi/);
});

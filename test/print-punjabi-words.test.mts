import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  COUNSELLING_WORDS, FEELING_WORDS, FAMILY_WORDS, PHRASES, PDF_PATH, PRINT_PATH, punjabiCounsellor,
} from '../app/print/punjabi-words/sheet.ts';
import { practitioners, recordedPractitioners } from '../lib/practitioners.ts';

/* The printed Punjabi word sheet (15 Oct 2026). It may add no Punjabi of its
 * own: every Gurmukhi run on it must already stand on the words page. It
 * names only the counsellor the roster says is accepting, works in Punjabi
 * and offers individual counselling in BC; never the founder, never a
 * registration number, no fee, no hours. And the PDF it links must exist. */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const WORDS_SRC = read('lib/resources-punjabi-words.ts');
const PAGE_SRC = read('app/print/punjabi-words/page.tsx');
const SHEET_SRC = read('app/print/punjabi-words/sheet.ts');

const GURMUKHI_RUN = /[਀-੿][਀-੿ ’-]*/g;
const runs = (s: string) => [...s.matchAll(GURMUKHI_RUN)].map((m) => m[0].trim().replace(/-$/, '')).filter(Boolean);

test('every Gurmukhi run on the sheet already stands on the words page', () => {
  const all = [
    ...runs(PAGE_SRC), ...runs(SHEET_SRC),
    ...[...COUNSELLING_WORDS, ...FEELING_WORDS, ...FAMILY_WORDS].map((w) => w.pa),
    PHRASES.explain.pa, PHRASES.freeConsult.pa,
  ];
  assert.ok(all.length >= 20, `only ${all.length} Gurmukhi runs found`);
  for (const r of all) assert.ok(WORDS_SRC.includes(r), `new Punjabi on the sheet: ${r}`);
});

test('the word tables are the words page tables, row for row', () => {
  assert.equal(COUNSELLING_WORDS.length, 11);
  assert.equal(FEELING_WORDS.length, 5);
  for (const w of COUNSELLING_WORDS) {
    assert.ok(w.gloss, `${w.en} has no meaning`);
    assert.ok(WORDS_SRC.includes(`['${w.en}', '${w.pa}', '${w.said}', '${w.gloss}']`), `row drifted: ${w.en}`);
  }
  for (const w of FEELING_WORDS) assert.ok(WORDS_SRC.includes(`['${w.en}', '${w.pa}', '${w.said}',`), `row drifted: ${w.en}`);
});

test('the words taken from prose carry the glosses the page gives them', () => {
  assert.ok(WORDS_SRC.includes('ਇੱਜ਼ਤ (izzat) is honour or standing'));
  assert.ok(WORDS_SRC.includes('ਸ਼ਰਮ (sharam) is shame'));
  assert.ok(WORDS_SRC.includes('ਪਾਗਲ (paagal, mad'));
  assert.ok(WORDS_SRC.includes(`${PHRASES.explain.pa}, ${PHRASES.explain.en}`));
  assert.ok(WORDS_SRC.includes(PHRASES.freeConsult.pa));
});

test('names the accepting Punjabi-speaking counsellor from the roster, and nobody else', () => {
  const who = punjabiCounsellor();
  assert.deepEqual(who, { slug: 'savneet-singh', letters: 'Savneet Singh, RCC' });
  const p = practitioners.find((x) => x.slug === 'savneet-singh')!;
  assert.ok(p.acceptingNewClients && p.services.includes('individual-therapy') && p.provinces.includes('BC'));
  assert.equal(punjabiCounsellor(practitioners.map((x) => ({ ...x, acceptingNewClients: false }))), null);
});

test('no founder, no registration number, no fee, no hours, no hex colour', () => {
  const src = PAGE_SRC + SHEET_SRC;
  const founder = recordedPractitioners.find((p) => p.slug === 'aman-bains-dhillon');
  if (founder) assert.ok(!src.includes(founder.name), 'founder named');
  assert.ok(!/Aman|Dhillon/.test(src), 'founder named');
  for (const n of recordedPractitioners.flatMap((p) => p.credentials.map((c) => c.number))) {
    assert.ok(!src.includes(n), `registration number ${n}`);
  }
  assert.ok(!/\$\d/.test(src), 'a typed fee');
  assert.ok(!/\b\d{1,2}(:\d\d)?\s?(am|pm)\b/i.test(src), 'a typed hour');
  assert.ok(!/evening|weekend/i.test(src), 'an evening or weekend claim');
  assert.ok(!/#[0-9a-f]{3,8}\b/i.test(PAGE_SRC), 'a hex colour in app/');
});

test('the print page is noindex, follow, and self-canonical', () => {
  assert.match(PAGE_SRC, /robots: \{ index: false, follow: true \}/);
  assert.ok(PAGE_SRC.includes('canonical: `${site.domain}${PRINT_PATH}`'));
  assert.equal(PRINT_PATH, '/print/punjabi-words');
  assert.ok(read('scripts/sitemap-parity.mjs').includes(`'${PRINT_PATH}'`), 'not kept out of the sitemap');
});

test('the PDF exists, is one page, and is linked from the words page and /punjabi', () => {
  const file = join(ROOT, 'public', PDF_PATH);
  assert.ok(existsSync(file), `${PDF_PATH} is missing`);
  const pdf = readFileSync(file);
  assert.equal(pdf.subarray(0, 5).toString('latin1'), '%PDF-');
  const count = pdf.toString('latin1').match(/\/Count\s+(\d+)/);
  assert.ok(count, 'no page count in the PDF');
  assert.equal(Number(count![1]), 1, 'the sheet runs over one page');
  assert.ok(WORDS_SRC.includes(`](${PDF_PATH})`), 'words page does not link the PDF');
  const punjabi = read('app/punjabi/page.tsx');
  assert.ok(punjabi.includes('href={PDF_PATH}'), '/punjabi does not link the PDF');
});

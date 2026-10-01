import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* NO TIME PROMISE IN A TITLE OR DESCRIPTION — 1 Oct 2026.
 *
 * Commit 8fe40bc took the evening and weekend promises out of twenty sentences
 * of body copy, and missed the one place a searcher reads before the page: the
 * /online-counselling meta description still said "Free 30-minute
 * consultation, evenings, no referral." The calendar holds what it holds, and
 * the allowed form is that it shows the real open times.
 *
 * This reads the source, not a build, so it runs with `npm test`: every
 * `title`, `metaTitle`, `description` and `metaDescription` string literal in
 * app/ and lib/ fails on "evening" or "weekend" unless it is listed below with
 * the reason it is not a promise about when sessions run. */

const ROOT = join(import.meta.dirname, '..');

/* Each exemption names the file AND the phrase, and says why. */
const EXEMPT: { file: string; phrase: string; why: string }[] = [
  {
    file: 'lib/audiences-more3.ts',
    phrase: 'marking that eats evenings',
    why: 'describes a teacher’s workload, not when sessions are offered',
  },
];

const FIELD = /\b(description|metaDescription|metaTitle|title)\s*:\s*\n?\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g;
const TIME = /\b(evenings?|weekends?)\b/i;

/** Metadata strings in a source file that mention evenings or weekends. */
function timePromises(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(FIELD)) if (TIME.test(m[3])) out.push(m[3]);
  return out;
}

function sources(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) sources(p, out);
    else if (/\.(ts|tsx)$/.test(e)) out.push(p);
  }
  return out;
}

test('the scanner finds a time promise in each field form, and ignores body copy', () => {
  assert.deepEqual(timePromises(`description:\n    'Free 30-minute consultation, evenings, no referral.',`), ['Free 30-minute consultation, evenings, no referral.']);
  assert.deepEqual(timePromises(`metaDescription: "Weekend sessions available"`), ['Weekend sessions available']);
  assert.deepEqual(timePromises(`title: 'Evening counselling in BC'`), ['Evening counselling in BC']);
  assert.deepEqual(timePromises(`body: ['an evening in complete silence']`), []);
  assert.deepEqual(timePromises(`description: 'the calendar shows real open times'`), []);
});

test('no title or description in app/ or lib/ promises evenings or weekends', () => {
  const found: string[] = [];
  for (const file of [...sources(join(ROOT, 'app')), ...sources(join(ROOT, 'lib'))]) {
    const rel = file.slice(ROOT.length + 1).replace(/\\/g, '/');
    for (const s of timePromises(readFileSync(file, 'utf8'))) {
      if (EXEMPT.some((x) => x.file === rel && s.includes(x.phrase))) continue;
      found.push(`${rel}: ${s}`);
    }
  }
  assert.deepEqual(found, [], 'metadata makes a time promise the calendar may not hold');
});

test('every exemption still matches something, so a stale one is removed', () => {
  for (const x of EXEMPT) {
    const src = readFileSync(join(ROOT, x.file), 'utf8');
    assert.ok(timePromises(src).some((s) => s.includes(x.phrase)), `${x.file}: "${x.phrase}" no longer present`);
  }
});

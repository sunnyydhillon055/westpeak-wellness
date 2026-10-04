import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { guides } from '../lib/guides.ts';
import { pacificYear, EI_YEAR } from '../lib/benefit-figures.ts';

/* NO TYPED YEAR IN A TITLE — 3 Oct 2026 (item 457).
 *
 * The sick-days guide, the best content earner after the home page (419
 * impressions at 7.2, 10 clicks a month), carried a literal "(2026)" in its
 * metaTitle, which would have gone stale on 1 January with nothing to catch
 * it. The year is now the build's Pacific year. This fails on a four-digit
 * year typed into any metaTitle in lib/ or app/: an interpolation
 * (`${...}`) is removed before the check, so a computed year passes. */

const files = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(ts|tsx)$/.test(e)) out.push(p.replace(/\\/g, '/'));
  }
  return out;
};

/** metaTitle literals whose text, interpolations removed, holds a year. */
export function typedYearTitles(src: string): string[] {
  const re = /metaTitle\s*:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g;
  const hits: string[] = [];
  for (const m of src.matchAll(re)) {
    const text = m[2]!.replace(/\$\{[^}]*\}/g, '');
    if (/\b(?:19|20)\d\d\b/.test(text)) hits.push(m[2]!);
  }
  return hits;
}

test('the checker catches a typed year and passes a computed one', () => {
  assert.equal(typedYearTitles(`metaTitle: 'Sick Days in BC (2026)',`).length, 1);
  assert.equal(typedYearTitles(`metaTitle: "Rates for 2027 | Westpeak",`).length, 1);
  assert.equal(typedYearTitles('metaTitle: `Sick Days in BC (${pacificYear()})`,').length, 0);
  assert.equal(typedYearTitles('metaTitle: `EI in ${EI_YEAR}? Rate, 26 Weeks`,').length, 0);
  assert.equal(typedYearTitles(`metaTitle: 'Open 24/7 support lines',`).length, 0);
});

test('no metaTitle in lib/ or app/ types a year', () => {
  const bad = [...files('lib'), ...files('app')].flatMap((f) =>
    typedYearTitles(readFileSync(f, 'utf8')).map((t) => `${f}: ${t}`));
  assert.deepEqual(bad, []);
});

test('the sick-days and EI titles carry the computed year, within 60 characters', () => {
  const years: Record<string, string> = {
    'sick-days-and-mental-health-days-bc': String(pacificYear()),
    'ei-sickness-benefits-and-therapy': EI_YEAR,
  };
  for (const [slug, year] of Object.entries(years)) {
    const g = guides.find((x) => x.slug === slug)!;
    assert.ok(g.metaTitle.includes(year), `${slug}: ${g.metaTitle}`);
    assert.ok(g.metaTitle.length <= 60, `${slug}: ${g.metaTitle.length}`);
  }
  const ei = guides.find((x) => x.slug === 'ei-sickness-benefits-and-therapy')!;
  assert.doesNotMatch(ei.metaTitle, /\$|55%/, 'the rate and maximum belong in the description, not the title');
  assert.match(ei.metaDescription, /55%/);
  assert.match(ei.metaDescription, /\$\d/);
});

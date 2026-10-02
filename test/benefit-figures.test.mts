import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { EI_SICKNESS_MAX, eiSicknessMax, pacificYear, EI_WEEKLY, EI_WEEKLY_IN_YEAR, EI_YEAR } from '../lib/benefit-figures.ts';
import { benefitEntries, benefitFigureProblems, typedBenefitFigures, scanTree } from '../scripts/price-drift.mjs';

/* THE EI SICKNESS MAXIMUM, ONE YEAR-KEYED CONSTANT — 2 Oct 2026 (item 386).
 *
 * Dates sit well away from Pacific midnight (lesson 9: CI's Node puts BC on
 * permanent UTC-7 from November 2026, local Node still UTC-8). */

const ROOT = join(import.meta.dirname, '..');

test('the Pacific year turns at Pacific midnight, not UTC midnight', () => {
  /* 31 Dec 2026, 6 pm Pacific under either offset: still 2026 in BC, already 2027 in UTC. */
  assert.equal(pacificYear(new Date('2027-01-01T03:00:00Z')), 2026);
  /* 1 Jan 2027, 10 am Pacific under either offset. */
  assert.equal(pacificYear(new Date('2027-01-01T19:00:00Z')), 2027);
});

test('2026 is 729 and 2027 is 749, each 55% of maximum insurable earnings over 52', () => {
  assert.equal(eiSicknessMax(new Date('2026-10-02T19:00:00Z')).weekly, 729);
  assert.equal(eiSicknessMax(new Date('2027-01-01T19:00:00Z')).weekly, 749);
  for (const [year, e] of Object.entries(EI_SICKNESS_MAX)) {
    assert.equal(Math.round((e.maxInsurableEarnings * 0.55) / 52), e.weekly, year);
    assert.match(e.readOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(e.sourceUrl, /^https:\/\/www\.canada\.ca\//);
  }
});

test('a year with no entry falls back to the latest earlier year, named as such', () => {
  const r = eiSicknessMax(new Date('2028-06-01T19:00:00Z'));
  assert.equal(r.year, 2027);
  assert.equal(r.current, false);
  assert.equal(eiSicknessMax(new Date('2026-06-01T19:00:00Z')).current, true);
});

test('the composed phrases agree with the entry for the build year', () => {
  const e = eiSicknessMax();
  assert.equal(EI_YEAR, String(e.year));
  assert.equal(EI_WEEKLY, `$${e.weekly}`);
  assert.equal(EI_WEEKLY_IN_YEAR, `$${e.weekly} a week in ${e.year}`);
});

test('the leave pages read the constant rather than typing the figure', () => {
  for (const f of ['lib/guides-more6.ts', 'lib/guides-more7.ts', 'lib/resources-more3.ts']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.match(src, /from '@\/lib\/benefit-figures'/, f);
    assert.doesNotMatch(src, /\$7[24]9(?!\d)/, f);
  }
});

test('price-drift reads the entries and fails a year with no entry or an inconsistent one', () => {
  const src = readFileSync(join(ROOT, 'lib/benefit-figures.ts'), 'utf8');
  assert.deepEqual(benefitEntries(src).map((e) => [e.year, e.weekly]), [[2026, 729], [2027, 749]]);
  assert.deepEqual(benefitFigureProblems(src, 2026), []);
  assert.deepEqual(benefitFigureProblems(src, 2027), []);
  assert.match(benefitFigureProblems(src, 2028).join(' '), /no EI sickness maximum for 2028/);
  const wrong = src.replace('weekly: 749', 'weekly: 750');
  assert.match(benefitFigureProblems(wrong, 2027).join(' '), /weekly 750 is not 55% of 70800/);
  assert.match(benefitFigureProblems('', 2026).join(' '), /no EI_SICKNESS_MAX entries/);
});

test('a typed weekly maximum fails, in prose or a comment, and the real tree is clean', () => {
  const root = mkdtempSync(join(tmpdir(), 'benefit-'));
  mkdirSync(join(root, 'lib'));
  writeFileSync(join(root, 'lib/benefit-figures.ts'), readFileSync(join(ROOT, 'lib/benefit-figures.ts'), 'utf8'));
  writeFileSync(join(root, 'lib/cliniko-catalog.ts'), readFileSync(join(ROOT, 'lib/cliniko-catalog.ts'), 'utf8'));
  writeFileSync(join(root, 'lib/page.ts'), "const a = 'up to $729 a week';\n// was $749 in 2027\nconst b = '$7290';\n");
  assert.deepEqual(typedBenefitFigures(root).map((h) => `${h.file}:${h.line} ${h.amount}`), ['lib/page.ts:1 $729', 'lib/page.ts:2 $749']);
  /* The generic scan rejects it too, now that 729 is off ALLOW. */
  assert.ok(scanTree(root).problems.some((p) => p.amount === '$729'));
  assert.deepEqual(typedBenefitFigures(ROOT), []);
});

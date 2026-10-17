import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LINKABLE_SLUGS, getResource } from '../lib/resources.ts';

/* Item 578, 16 Oct 2026: /refer#free-resources is where the free-to-reuse
   pages are listed, from LINKABLE_SLUGS, each with a purpose line and its
   citation; the outreach drafts point at it. */

const page = readFileSync('app/refer/page.tsx', 'utf8');
const outreach = readFileSync('docs/OUTREACH.md', 'utf8');

test('every linkable slug has a purpose line on /refer, and the section reads the list', () => {
  const block = page.slice(page.indexOf('const PURPOSE'), page.indexOf('const FREE_RESOURCES'));
  for (const s of LINKABLE_SLUGS) {
    assert.ok(getResource(s), s);
    assert.match(block, new RegExp(`'${s}': '[^']{20,}'`), s);
  }
  assert.match(page, /LINKABLE_SLUGS\.map\(/);
  assert.match(page, /<CopyText text=\{citationFor\(r, site\.domain\)\}/);
});

test('the section names the calculator figures, the embed, the CSV, the Punjabi sheet and the routes diagram', () => {
  const sec = page.slice(page.indexOf('<h2 id="free-resources">'), page.indexOf('<h2>Routes where somebody else pays</h2>'));
  assert.ok(sec.length > 500, 'the section sits before the funded routes');
  for (const k of ['#figures', '#embed', 'FIGURES_CSV_PATH', 'PDF_PATH', 'ROUTES_FIGURE', 'CALCULATOR_CITATION']) assert.ok(sec.includes(k), k);
  /* No outcome claims or review asks in reuse copy. */
  assert.doesNotMatch(sec, /testimonial|review us|rated|proven|guarantee/i);
});

test('the unsent §14, §15, §29 and §30 drafts point at /refer#free-resources, each tagged', () => {
  const section = (n: number) => {
    const start = outreach.indexOf(`\n## ${n}. `);
    const next = outreach.indexOf('\n## ', start + 5);
    return outreach.slice(start, next < 0 ? undefined : next);
  };
  for (const n of [14, 15, 29, 30]) {
    assert.match(section(n), /\/refer\?utm_source=[a-z]+#free-resources/, `§${n}`);
  }
});

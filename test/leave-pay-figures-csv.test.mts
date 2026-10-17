import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LEAVE_PAY_FIGURES, LEAVE_PAY_SOURCES, FIGURES_CHECKED, FIGURES_CSV_PATH, leavePayFiguresCsv, leavePaySource,
} from '../lib/benefit-figures.ts';

/* Item 579, 16 Oct 2026: the calculator's figures as figures.csv, with a
   Dataset node on the page naming it as the download. */

const page = readFileSync('app/tools/stress-leave-pay-calculator/page.tsx', 'utf8');
const route = readFileSync('app/tools/stress-leave-pay-calculator/figures.csv/route.ts', 'utf8');

/** RFC 4180 rows, enough for quoted cells with commas and doubled quotes. */
function parse(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i]!;
    if (quoted) {
      if (c === '"' && csv[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\r') continue;
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  return rows;
}

test('the CSV is the figures table: one row per figure, with source, address and date read', () => {
  const rows = parse(leavePayFiguresCsv());
  assert.deepEqual(rows[0], ['figure', 'value', 'source', 'source_url', 'read_on']);
  assert.equal(rows.length, LEAVE_PAY_FIGURES.length + 1);
  LEAVE_PAY_FIGURES.forEach((f, i) => {
    const s = leavePaySource(f.url);
    assert.deepEqual(rows[i + 1], [f.figure, f.value, s.label, s.url, s.read]);
    assert.match(s.url, /^https:\/\/(www\.canada\.ca|www2\.gov\.bc\.ca|laws-lois\.justice\.gc\.ca)\//, 'government sources only');
    assert.match(s.read, /^\d{4}-\d{2}-\d{2}$/);
  });
  assert.ok(leavePayFiguresCsv().endsWith('\r\n'));
});

test('every figure has a dated source, and the checked date is the newest of them', () => {
  for (const f of LEAVE_PAY_FIGURES) assert.ok(LEAVE_PAY_SOURCES.some((s) => s.url === f.url), f.figure);
  assert.equal(FIGURES_CHECKED, LEAVE_PAY_FIGURES.map((f) => leavePaySource(f.url).read).sort().at(-1));
});

test('the route is static CSV, and the page links it beside the citation and declares it in a Dataset', () => {
  assert.equal(FIGURES_CSV_PATH, '/tools/stress-leave-pay-calculator/figures.csv');
  assert.match(route, /export const dynamic = 'force-static'/);
  assert.match(route, /'content-type': 'text\/csv; charset=utf-8'/);
  assert.match(route, /leavePayFiguresCsv\(\)/);
  const cite = page.indexOf('<CopyText text={CITATION}');
  const link = page.indexOf('Download the figures (CSV)');
  assert.ok(cite > 0 && link > cite && link < page.indexOf('id="embed"'), 'the link sits after the citation, before the embed');
  for (const k of ["'@type': 'Dataset'", 'dateModified: FIGURES_CHECKED', 'creator: orgRef', 'isBasedOn:', "'@type': 'DataDownload'", "encodingFormat: 'text/csv'", 'FIGURES_CSV_PATH']) {
    assert.ok(page.includes(k), k);
  }
  assert.match(page, /JSON\.stringify\(DATASET\)/);
});

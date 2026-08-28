#!/usr/bin/env node
/* Performance budget — a ratchet on the bytes every visitor pays.
 *
 * WHAT IS MEASURED, per production build:
 *   · homepage CSS      — bytes of every stylesheet the / route loads
 *   · shared JS         — bytes of the chunks loaded by EVERY route (the
 *                         true first-load tax; per-page chunks excluded so
 *                         adding a page cannot trip this)
 *   · largest page HTML — the worst prerendered document
 *   · median page HTML  — the typical one
 *
 * WHY A RATCHET AND NOT A LIGHTHOUSE SCORE. A Lighthouse run in CI measures
 * the CI machine as much as the site — scores swing double digits between
 * identical builds, and a gate that cries wolf gets deleted. Bytes are
 * deterministic: the same build produces the same number every time, so the
 * gate only ever fires on a real regression.
 *
 * WHY THESE NUMBERS AND NOT SMALLER ONES. The 2026-08-28 analysis found the
 * stylesheet is ~88% genuinely shared design system: the cleanly page-scoped
 * remainder (admin, sign-in, careers, glossary — ~15 kB source, ~2 kB on the
 * wire) was judged not worth a multi-surface refactor. What matters is that
 * the payload never grows by accident, which is this file's whole job.
 *
 *   node scripts/perf-budget.mjs                  check against baseline
 *   node scripts/perf-budget.mjs --set-baseline   rewrite the baseline to
 *                                                 the current build (only
 *                                                 after a deliberate change)
 *
 * The baseline is a ratchet: never raise it to make a red build green.
 * Lower it freely when a real improvement lands.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASELINE_FILE = join(process.cwd(), 'data', 'perf-budget.json');
const SET = process.argv.includes('--set-baseline');
/* Headroom for hash/name jitter and tiny incidental growth. Anything a
 * human would call "a change" clears 2% easily. */
const TOLERANCE = 0.02;

const NEXT = join(process.cwd(), '.next');
if (!existsSync(join(NEXT, 'app-build-manifest.json'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(NEXT, 'app-build-manifest.json'), 'utf8'));
const pages = manifest.pages ?? {};
const routes = Object.keys(pages);
const sizeOf = (rel) => {
  try { return statSync(join(NEXT, rel)).size; } catch { return 0; }
};

/* Shared JS: chunks present in every route's file list. */
const jsLists = routes.map((r) => new Set(pages[r].filter((f) => f.endsWith('.js'))));
const shared = [...jsLists[0]].filter((f) => jsLists.every((s) => s.has(f)));
const sharedJs = shared.reduce((n, f) => n + sizeOf(f), 0);

/* Homepage CSS: read the stylesheet links out of the prerendered homepage —
 * the manifest splits CSS across layout entries, but the HTML is exactly
 * what a visitor loads. */
const indexHtml = readFileSync(join(NEXT, 'server', 'app', 'index.html'), 'utf8');
const homeCss = [...indexHtml.matchAll(/href="\/_next\/(static\/css\/[^"?]+\.css)/g)]
  .map((m) => m[1])
  .reduce((n, f) => n + sizeOf(f), 0);

/* Prerendered HTML sizes. */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(statSync(p).size);
  }
  return out;
}
const htmlSizes = walk(join(NEXT, 'server', 'app')).sort((a, b) => a - b);
const maxHtml = htmlSizes[htmlSizes.length - 1] ?? 0;
const medianHtml = htmlSizes[Math.floor(htmlSizes.length / 2)] ?? 0;

const current = { homeCss, sharedJs, maxHtml, medianHtml };

if (SET) {
  writeFileSync(BASELINE_FILE, JSON.stringify({
    note: 'Perf budget baseline — a ratchet. Never raise to silence the gate; lower when a real win lands. See scripts/perf-budget.mjs.',
    set: new Date().toISOString().slice(0, 10),
    ...current,
  }, null, 2) + '\n');
  console.log('Baseline written:', JSON.stringify(current));
  process.exit(0);
}

if (!existsSync(BASELINE_FILE)) {
  console.error('No baseline at data/perf-budget.json — run with --set-baseline once.');
  process.exit(1);
}
const base = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));

const LABELS = {
  homeCss: 'homepage CSS',
  sharedJs: 'shared first-load JS',
  maxHtml: 'largest page HTML',
  medianHtml: 'median page HTML',
};

let failed = 0;
console.log(`\nPerf budget — build vs baseline of ${base.set}\n${'='.repeat(46)}`);
for (const k of Object.keys(LABELS)) {
  const cap = Math.round(base[k] * (1 + TOLERANCE));
  const over = current[k] > cap;
  const drift = base[k] ? (((current[k] - base[k]) / base[k]) * 100).toFixed(1) : '?';
  if (over) failed++;
  console.log(
    `${over ? 'FAIL' : ' ok '}  ${LABELS[k].padEnd(22)} ${String(current[k]).padStart(8)} B` +
    `  (baseline ${base[k]} B, ${drift >= 0 ? '+' : ''}${drift}%)`
  );
}
console.log('='.repeat(46));
if (failed) {
  console.log(
    `${failed} metric(s) over budget. Find what grew and shrink it —\n` +
    `raising the baseline is only for a change that was worth its bytes,\n` +
    `named as such in the commit that raises it.`
  );
} else {
  console.log('within budget.');
}
process.exit(failed ? 1 : 0);

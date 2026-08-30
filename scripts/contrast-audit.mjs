#!/usr/bin/env node
/**
 * CONTRAST - does the palette actually meet the standard the site claims?
 *
 * WHY THIS EXISTS
 *
 * /accessibility and the FAQ both state, in the site's own voice, that it is
 * built to WCAG 2.1 AA and "tested for colour contrast, keyboard navigation
 * and touch-target size". Two of those three are claims about work done once.
 * Contrast is a claim about a palette that any later change can quietly break,
 * and nothing in this repo re-checked it.
 *
 * app/globals.css shows the checking was real - --ink-faint carries the note
 * "AA on every surface incl. --surface-4", and a clay tone was rejected in a
 * comment for measuring 4.455 and 4.355 against two surfaces, both under AA.
 * Someone did this arithmetic by hand and wrote down the numbers. This file is
 * that arithmetic, kept.
 *
 * A published accessibility claim that has gone stale is worse than no claim:
 * it tells a disabled reader the site has been checked, which is the reason
 * they might not report what they find.
 *
 * WHAT IS CHECKED
 *
 * The foreground/background pairs the stylesheet genuinely puts together,
 * listed explicitly rather than inferred. Inferring which colours can meet on
 * a page needs a rendering engine; a wrong inference here would produce either
 * false alarms or false comfort, and the honest version of this check is a
 * short list somebody maintains.
 *
 * AA is 4.5:1 for body text and 3:1 for large text (>=18.66px bold or 24px)
 * and for the visual boundary of a UI component.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'app', 'globals.css'), 'utf8');

/* Token values are read from the stylesheet rather than copied here, so this
   check cannot pass on a palette the site no longer uses. */
const tokens = {};
for (const m of css.matchAll(/^\s*(--[a-z0-9-]+):\s*(#[0-9a-f]{3,8})\s*;/gim)) {
  tokens[m[1]] = m[2];
}

const hex = (name) => {
  const v = name.startsWith('#') ? name : tokens[name];
  if (!v) throw new Error(`contrast-audit: no value found for ${name} in app/globals.css`);
  return v;
};

const srgb = (h) => {
  let s = h.slice(1);
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const lum = (h) =>
  srgb(h)
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0);

const ratio = (a, b) => {
  const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* fg, bg, what it is, and the threshold that applies.
   `large` = 3:1, everything else = 4.5:1. */
const PAIRS = [
  ['--ink', '--surface-0', 'body text on white'],
  ['--ink', '--surface-1', 'body text on the cool near-white'],
  ['--ink', '--surface-2', 'body text on the warm off-white'],
  ['--ink', '--surface-3', 'body text on the blue wash'],
  ['--ink', '--surface-4', 'body text on the warm sand'],
  ['--ink', '--blue-ghost', 'body text on the ghost band'],
  ['--ink', '--blue-mist', 'body text on the blue mist'],

  ['--ink-soft', '--surface-0', 'lede and secondary text on white'],
  ['--ink-soft', '--surface-1', 'lede on the cool near-white'],
  ['--ink-soft', '--surface-3', 'lede on the blue wash'],
  ['--ink-soft', '--surface-4', 'lede on the warm sand'],
  ['--ink-soft', '--blue-ghost', 'lede on the ghost band'],

  ['--ink-faint', '--surface-0', 'captions and sources on white'],
  ['--ink-faint', '--surface-1', 'captions on the cool near-white'],
  ['--ink-faint', '--surface-3', 'captions on the blue wash'],
  ['--ink-faint', '--surface-4', 'captions on the warm sand'],

  ['--blue-deep', '--surface-0', 'links on white'],
  ['--blue-deep', '--surface-1', 'links on the cool near-white'],
  ['--blue-deep', '--surface-2', 'links on the warm off-white'],
  ['--blue-deep', '--surface-3', 'links on the blue wash'],
  ['--blue-deep', '--surface-4', 'links on the warm sand'],
  ['--blue-deep', '--blue-ghost', 'links and eyebrows on the ghost band'],
  ['--blue-deep', '--blue-mist', 'links on the blue mist'],

  ['#ffffff', '--blue-deep', 'primary button label'],
  ['#ffffff', '--blue-deeper', 'primary button label, hover'],
  ['#ffffff', '--surface-ink', 'text on the inverted footer'],
];

const LARGE = new Set(); // none of the pairs above are large-text-only

let fails = 0, warns = 0;
const rows = [];
for (const [fg, bg, what] of PAIRS) {
  const r = ratio(fg, bg);
  const need = LARGE.has(what) ? 3 : 4.5;
  const state = r >= 7 ? 'AAA' : r >= need ? 'AA ' : 'FAIL';
  if (state === 'FAIL') fails++;
  else if (r < need + 0.25) warns++;
  rows.push({ fg, bg, what, r, need, state });
}

console.log(`\nCONTRAST - ${PAIRS.length} foreground/background pairs from app/globals.css\n`);
console.log('  ratio   AA?   pair');
console.log('  ' + '-'.repeat(86));
for (const row of rows.sort((a, b) => a.r - b.r)) {
  console.log(
    `  ${row.r.toFixed(2).padStart(5)}   ${row.state}   ${row.what}` +
    `  (${row.fg} on ${row.bg})`
  );
}
console.log('  ' + '-'.repeat(86));

if (fails) {
  console.log(`\n  ${fails} pair(s) FAIL WCAG 2.1 AA.`);
  console.log('  /accessibility and the FAQ both tell readers this site meets AA.');
  console.log('  Fix the palette or change what those pages claim - in that order.\n');
} else {
  console.log(`\n  All ${PAIRS.length} pairs meet WCAG 2.1 AA.`);
  if (warns) console.log(`  ${warns} sit within 0.25 of the threshold - treat those as load-bearing.`);
  console.log('  The claim on /accessibility and /faq is currently true.\n');
}

process.exit(fails ? 1 : 0);

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
  /* Added 30 August 2026 with the oatmeal repaint. --blue-mist turned out to
     be the tightest ground on the whole site for faint text (4.76) and was
     not being measured at all; --clay-ghost carries the pull-quote sources. */
  ['--ink-faint', '--blue-mist', 'captions on the blue mist'],
  ['--ink-faint', '--clay-ghost', 'sources on the clay ghost band'],
  ['--ink-soft', '--surface-2', 'lede on the warmer oatmeal'],
  ['--ink', '--bg', 'body text on the page ground'],
  ['--clay-deep', '--surface-4', 'the warm accent as text on sand'],
  ['--clay-deep', '--clay-ghost', 'the warm accent on its own ghost band'],

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

  /* TRANSACTIONAL EMAIL — added 30 August 2026, when the templates were brought
     onto the site palette. An HTML email cannot read a CSS variable, so these
     are written as literals in eleven templates and were, until now, the one
     surface with no contrast check at all. They are spelled out here rather
     than read from tokens on purpose: if someone changes a template and not
     this list, the gate should go red, which is the whole point.
     Values must match lib/booking-mail.ts and its siblings. */
  ['#2b3138', '#ffffff', 'email: heading on white'],
  ['#2b3138', '#faf7f1', 'email: heading on the cream ground'],
  ['#2b3138', '#f7f2e8', 'email: heading on the warm panel'],
  ['#545e69', '#ffffff', 'email: body text on white'],
  ['#545e69', '#faf7f1', 'email: body text on the cream ground'],
  ['#545e69', '#f7f2e8', 'email: body text on the warm panel'],
  ['#3d6c92', '#ffffff', 'email: links on white'],
  ['#3d6c92', '#faf7f1', 'email: links on the cream ground'],
  ['#3d6c92', '#f7f2e8', 'email: links on the warm panel'],
  ['#b4472f', '#f8f2ea', 'email: the alert red on its tint'],
  ['#ffffff', '#3d6c92', 'email: button label'],
];

/* ============================================================================
   COMPOSITES — colour painted over colour, which is where this gate was blind.

   Everything above is a flat pair: one token on another. The CTA band is not
   flat. It is a gradient, with a translucent field on it, with white text
   inside that. On 30 August 2026 six values on it measured under threshold,
   including the text somebody types into the site's smaller-ask form at 4.32,
   and that same text at 3.69 once the field was focused — because focusing it
   made the fill LIGHTER underneath white text.

   None of it was measurable here, because none of it is a pair of tokens.
   Compositing first makes it one.

   Evaluated at all three gradient stops; the worst is what counts.
   ========================================================================= */
const over = (fg, bg, alpha) => {
  const f = srgb(hex(fg));
  const b = srgb(hex(bg));
  const mix = f.map((c, i) => Math.round(c * alpha + b[i] * (1 - alpha)));
  return '#' + mix.map((c) => c.toString(16).padStart(2, '0')).join('');
};

/* .cta-band is linear-gradient(135deg, --blue-deeper, --blue-deep). */
const BAND = ['--blue-deeper', '#35607f', '--blue-deep'];

const COMPOSITES = [
  { label: 'CTA band: typed text in the ask-instead field', need: 4.5,
    at: (s) => ratio('#ffffff', over('#000000', s, 0.14)) },
  { label: 'CTA band: typed text, field focused', need: 4.5,
    at: (s) => ratio('#ffffff', over('#000000', s, 0.20)) },
  { label: 'CTA band: placeholder in that field', need: 4.5,
    at: (s) => ratio(over('#ffffff', over('#000000', s, 0.14), 0.78),
                     over('#000000', s, 0.14)) },
  { label: 'CTA band: field border against the band', need: 3.0,
    at: (s) => ratio(over('#ffffff', s, 0.60), s) },
  { label: 'CTA band: field border against the field', need: 3.0,
    at: (s) => ratio(over('#ffffff', s, 0.60), over('#000000', s, 0.14)) },
  { label: 'CTA band: body copy, white .86', need: 4.5,
    at: (s) => ratio(over('#ffffff', s, 0.86), s) },
  { label: 'CTA band: fine print, white .88', need: 4.5,
    at: (s) => ratio(over('#ffffff', s, 0.88), s) },
  { label: 'CTA band: solid white heading', need: 4.5,
    at: (s) => ratio('#ffffff', s) },
];

/* The mobile drawer's own header, which is a composite of three things: the
   page, the scrim over it, and the header bar over that. It measured 4.33 for
   --blue-deep while the bar was still translucent, and 2.01 before the scrim
   was moved out of the header entirely. Both are one-off geometries rather
   than gradients, so they are checked directly. */
const OPEN_HEADER = [
  { label: 'Mobile drawer: brand mark on the open header', need: 4.5,
    r: () => ratio('--blue-deep', '--surface-1') },
  { label: 'Mobile drawer: wordmark on the open header', need: 4.5,
    r: () => ratio('--ink', '--surface-1') },
];

/* A CHECK THAT WAS WRITTEN AND THEN DELETED, recorded so it is not re-added.
 *
 * The first draft of this block also asserted the scrim reach 3:1 against the
 * page behind it, and it failed at 2.57. That is not a WCAG criterion and it
 * should not be one: 1.4.11 governs the boundaries of user-interface
 * components and meaningful graphics, and a scrim is neither. Its entire
 * function is to de-emphasise what is behind it, so a LOW contrast ratio is
 * the feature.
 *
 * Satisfying it would have meant darkening the scrim for no reason other than
 * a number this file made up. A gate is only worth what its criteria are
 * worth, and inventing one is how a gate starts producing work instead of
 * finding it. */

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

for (const c of OPEN_HEADER) {
  const r = c.r();
  const state = r >= 7 ? 'AAA' : r >= c.need ? 'AA ' : 'FAIL';
  if (state === 'FAIL') fails++;
  else if (r < c.need + 0.25) warns++;
  rows.push({ fg: 'composite', bg: `min ${c.need}`, what: c.label, r, need: c.need, state });
}

for (const c of COMPOSITES) {
  const r = Math.min(...BAND.map((stop) => c.at(stop)));
  const state = r >= 7 ? 'AAA' : r >= c.need ? 'AA ' : 'FAIL';
  if (state === 'FAIL') fails++;
  else if (r < c.need + 0.25) warns++;
  rows.push({ fg: 'composite', bg: `min ${c.need}`, what: c.label, r, need: c.need, state });
}

console.log(
  `\nCONTRAST - ${PAIRS.length} pairs and ${COMPOSITES.length + OPEN_HEADER.length} composites from app/globals.css\n`
);
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
  console.log(`\n  All ${PAIRS.length + COMPOSITES.length + OPEN_HEADER.length} pairs and composites meet WCAG 2.1 AA.`);
  if (warns) console.log(`  ${warns} sit within 0.25 of the threshold - treat those as load-bearing.`);
  console.log('  The claim on /accessibility and /faq is currently true.\n');
}


/* ---------------------------------------------------------------------------
 * DARK-BAND LINK GUARD
 *
 * The pairs above are palette maths: they prove the tokens can meet AA. They
 * cannot prove a given element actually *uses* the right token, and on
 * 2026-08-30 two did not. A prose link inside .cta-band and another inside
 * .signature both inherited the global link colour (--blue-deep, #3d6c92),
 * which is tuned for a cream page and renders as near-invisible dark blue on
 * an ink ground. Every static pair here passed while the page was wrong.
 *
 * Catching that properly needs a rendering engine measuring computed styles,
 * which this repo deliberately does not carry. This is the cheap structural
 * substitute: for each container painted on ink, assert premium.css still
 * carries a rule that re-colours non-button links inside it. It does not
 * verify the colour is right - the pairs above do that - only that the rule
 * scoping links away from the light-page default has not been deleted.
 * ------------------------------------------------------------------------- */
const inkCss =
  readFileSync(new URL('../app/premium.css', import.meta.url), 'utf8') +
  readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

/* Split into { selector, body } pairs after stripping comments, rather than
   matching a regex across the whole file - a selector list and its declaration
   block are the two things this needs to see together, and a naive pattern
   spanning `{` happily matches across an unrelated rule boundary. */
const rules = inkCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('}')
  .map((chunk) => {
    const i = chunk.indexOf('{');
    return i === -1 ? null : { sel: chunk.slice(0, i), body: chunk.slice(i + 1) };
  })
  .filter(Boolean);

const INK_CONTAINERS = ['.cta-band', '.signature', '.site-footer'];
const unguarded = INK_CONTAINERS.filter(
  (name) =>
    !rules.some(
      (r) =>
        r.sel.includes(name) &&
        /* `a` must be the bare element, not `a.btn--primary`. Written loosely
           the first time, and `.cta-band a.btn--primary` - a *button* rule -
           satisfied the guard on its own, so removing the prose-link rule
           still passed. Excluding a `.` after the `a` is what makes this
           check mean what it says. */
        /(^|[\s>+~])a([\s:,[]|$)/.test(r.sel) &&
        /(^|[;{\s])color\s*:/.test(r.body)
    )
);

if (unguarded.length) {
  console.log('\n  DARK-BAND LINKS: no link colour rule found for ' + unguarded.join(', '));
  console.log('  Links there fall back to --blue-deep, unreadable on an ink ground.\n');
  process.exit(1);
}
console.log(`  Dark-band link rules present for ${INK_CONTAINERS.join(', ')}.\n`);

process.exit(fails ? 1 : 0);

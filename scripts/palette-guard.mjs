#!/usr/bin/env node
/**
 * PALETTE GUARD - is any colour on this site written somewhere a search for it
 * would not find?
 *
 * WHY THIS EXISTS
 *
 * The oatmeal repaint of 30 August 2026 was applied by finding every hex
 * literal of the previous palette and replacing it. It reported success. It
 * had missed, in four separate spellings:
 *
 *   %23e8f0f9     twelve values inside the inline SVG data URIs of eight hero
 *                 variants. URL-encoded, so a search for "#e8f0f9" matched
 *                 nothing and every page that was not the homepage kept a cold
 *                 blue hero.
 *   rgba(63, 108, 163, 0.05)
 *                 spaced argument lists, where the sweep had searched for
 *                 "rgba(63,108,163," without spaces.
 *   rgba(251,252,254,.72)
 *                 the header background, in four rules, never tokenised at all
 *                 - which rendered the primary navigation at 1.00:1 for every
 *                 dark-mode visitor.
 *   #b9c6d3 and eight more
 *                 the footer's text colours, chosen for a navy that no longer
 *                 existed.
 *
 * Four spellings, one mistake: a colour written as a literal is invisible to
 * whatever maintains the palette. The contrast gate could not help - every one
 * of these passed contrast. They were not wrong colours, they were unmanaged
 * ones.
 *
 * So this checks the property that actually matters: every colour in the
 * stylesheets and components is either a token, a reference to a token, or on
 * a short list of things that are deliberately not part of the palette.
 *
 * WHAT IS ALLOWED, AND WHY
 *
 *   - any value defined in :root (that is what a token is)
 *   - pure black and white at any alpha: scrims, masks, and the ink of a
 *     shadow, none of which are brand colours
 *   - the error reds, which are semantic rather than palette
 *   - anything inside a /* comment *\/, including this one
 *
 * Everything else is reported with its file, line and spelling.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

/* ---- the palette, read from the stylesheet rather than restated ---------- */

const globals = readFileSync(join(ROOT, 'app', 'globals.css'), 'utf8');

/* HARVEST DECLARATIONS, NOT THE BLOCK — and this is not a detail.
 *
 * The first version of this file took everything between `:root{` and the
 * radii comment and scraped every hex out of it. That range is mostly PROSE:
 * the token block carries long comments explaining what the previous palette
 * was and why it went, quoting #5b8bc4, #c07a56, #fbfcfe, #e8f0f9, #b9c6d3
 * and the rest by name.
 *
 * So the guard harvested the old palette out of the paragraphs explaining that
 * the old palette was wrong, added all of it to the allowlist, and passed a
 * file with #5b8bc4 injected into it. Verified by injecting exactly that and
 * watching it report success.
 *
 * A gate that reads its own documentation as data is worse than no gate: it
 * makes the "all clear" mean nothing. Only `--name: value;` declarations count
 * now, and the comments are stripped before the scan either way.
 */
const rootStart = globals.indexOf(':root{');
const rootEnd = globals.indexOf('\n}', rootStart);
if (rootStart === -1 || rootEnd === -1) {
  console.error('palette-guard: could not find the :root block in app/globals.css');
  process.exit(1);
}
const rootBlock = globals
  .slice(rootStart, rootEnd)
  .replace(/\/\*[\s\S]*?\*\//g, ' ');   // the comments are documentation, not palette

const tokenHex = new Set();
const tokenRgb = new Set();
for (const m of rootBlock.matchAll(/--[a-z0-9-]+\s*:\s*([^;]+);/gi)) {
  const value = m[1];
  for (const h of value.matchAll(/#([0-9a-fA-F]{3,8})\b/g)) tokenHex.add(('#' + h[1]).toLowerCase());
  for (const c of value.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
    tokenRgb.add(`${c[1]},${c[2]},${c[3]}`);
  }
}
if (tokenHex.size < 20) {
  console.error(`palette-guard: only ${tokenHex.size} tokens parsed — the :root block did not parse as expected.`);
  process.exit(1);
}

/* Every token hex also as an rgb triple, so rgba(250,247,241,.78) counts as
   "the ground colour at 78%" rather than as an unmanaged literal. */
const hexToRgb = (h) => {
  let s = h.slice(1);
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s.slice(0, 6), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};
for (const h of tokenHex) tokenRgb.add(hexToRgb(h));

/* ---- what is deliberately outside the palette --------------------------- */

const ALLOWED_HEX = new Set([
  '#fff', '#ffffff', '#000', '#000000',
  '#9a3412', '#b4472f', '#fdf3f0',        // error / danger states, semantic
  '#f0d3b4',                              // the crisis phone number, documented in place
  '#222', '#444', '#999', '#bbb',         // print stylesheet greys: paper, not palette
  '#4285f4', '#34a853', '#fbbc05', '#ea4335', // Google's own mark on the sign-in button
]);
const ALLOWED_RGB = new Set(['255,255,255', '0,0,0']);

/* ARTWORK TINTS — the intermediate shades inside the 29 SVGs: the mid-blues of
 * a ridge in a scene band, the two fill weights of overlapping circles in a
 * diagram, the sun on the logo. They are legitimate and they are not palette:
 * promoting twenty of them to :root would make the token block a colour picker.
 *
 * BE CLEAR ABOUT WHAT THIS DOES AND DOES NOT BUY. Listing them here means the
 * gate stops shouting about them. It does NOT mean they follow the palette —
 * nothing cross-checks a tint against a token, because "is this blue a member
 * of that blue's family" is not a question arithmetic answers honestly.
 *
 * So: if the palette is ever repainted again, these twenty values and the
 * twenty-nine files holding them must be repainted by hand in the same change,
 * and this list regenerated. The count is printed on every run so it cannot go
 * quiet. That is the real protection here, and it is weaker than a token. */
const ARTWORK_TINTS = new Set([
  '#6b8fae', '#8faec8', '#8fb2d0', '#94aec4', '#9cbcd6', '#a6c8e0', '#b0cbdf',
  '#c2a88d', '#c2d9ea', '#c9a98c', '#cbdcea', '#dbe9f2', '#dcc9b6', '#e2c9b0',
  '#e6eef7', '#e6eff5', '#eaf0f4', '#eff4f8', '#f2f6f8', '#f4ecdf',
]);

/* Transactional email is a different surface with a hard constraint: an HTML
   email cannot read a CSS variable, and enough clients strip <style> that every
   colour in a template is inline and literal by necessity. Those files are
   reported separately and do not fail the gate.
   Brought onto the site palette on 30 August 2026 - 85 values across ten
   templates, colour only, no structural change, because a colour swap cannot
   break how a mail client lays a table out and a structural edit can. Their
   eleven foreground/background pairs are spelled out in
   scripts/contrast-audit.mjs and gated with everything else, so this surface
   is measured now rather than merely reported. */
const EMAIL_SURFACE =
  /(mail|invite|nurture|funnel-report|reply-watch|waitlist-checkin)\.tsx?$|^app\/api\/(unsubscribe|portal)\//;

/* ---- scan ---------------------------------------------------------------- */

/* SVG IS WHERE MOST OF THIS SITE'S COLOUR LIVES, AND THIS FILE USED TO SKIP IT.
 *
 * The first version scanned .css/.ts/.tsx and excluded public/ outright, which
 * left 29 SVG files unscanned: 22 diagrams, 6 scene bands, the logo — plus
 * app/icon.svg, the favicon in every browser tab and on every Android home
 * screen. The repaint missed all three of icon.svg's colours and three inside
 * window-of-tolerance.svg, and the guard reported the repo clean anyway.
 *
 * A gate that excludes the directory holding most of the artwork is not a
 * palette gate. SVG is in scope now, in both trees. */
const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (['node_modules', '.next', '.git'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (/\.(css|tsx|ts|svg)$/.test(e)) files.push(p);
  }
})(ROOT);

/* Strip comments so a documented measurement is not reported as a defect. */
const decomment = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
   .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '));

const findings = [];
for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, '/');
  const raw = readFileSync(f, 'utf8');
  const src = decomment(raw);
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    /* :root is where tokens are defined; that is the one place a literal
       belongs. lib/og.tsx duplicates them for the edge runtime and says so. */
    const inTokens = rel === 'app/globals.css' && i < 280;
    const isEmail = EMAIL_SURFACE.test(rel);
    const isArt = rel.endsWith('.svg');

    for (const m of line.matchAll(/(?<!%23)#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
      const hex = ('#' + m[1]).toLowerCase();
      if (inTokens || ALLOWED_HEX.has(hex) || tokenHex.has(hex)) continue;
      if (isArt && ARTWORK_TINTS.has(hex)) { findings.push({ rel, line: i + 1, spelling: 'artwork', value: hex }); continue; }
      findings.push({ rel, line: i + 1, spelling: isEmail ? 'email' : 'hex', value: hex });
    }
    for (const m of line.matchAll(/%23([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
      const hex = ('#' + m[1]).toLowerCase();
      if (ALLOWED_HEX.has(hex) || tokenHex.has(hex)) continue;
      findings.push({ rel, line: i + 1, spelling: 'url-encoded', value: '%23' + m[1] });
    }
    for (const m of line.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
      const trip = `${m[1]},${m[2]},${m[3]}`;
      if (inTokens || ALLOWED_RGB.has(trip) || tokenRgb.has(trip)) continue;
      findings.push({ rel, line: i + 1, spelling: isEmail ? 'email' : 'rgb', value: `rgb(${trip})` });
    }
  });
}

/* ---- report -------------------------------------------------------------- */

console.log(`\nPALETTE GUARD - ${files.length} files, ${tokenHex.size} token colours\n`);

const SOFT = new Set(['email', 'artwork']);
const enforced = findings.filter((f) => !SOFT.has(f.spelling));

if (!enforced.length) {
  console.log('  Every colour on the site is a token, a token at an alpha, or one of');
  console.log('  the documented exceptions. Nothing is written in a spelling the next');
  console.log('  repaint would miss.');
  const emails = findings.filter((f) => f.spelling === 'email').length;
  const art = findings.filter((f) => f.spelling === 'artwork').length;
  if (art) {
    console.log(`
  ${art} artwork tint(s) across the SVGs, listed in this file and not`);
    console.log('  cross-checked against the palette. Repainting means repainting them too.');
  }
  if (emails) {
    console.log(`\n  ${emails} literal(s) in transactional email templates, which cannot use`);
    console.log('  tokens. Not enforced here; their contrast pairs are gated separately.');
  }
  console.log();
  process.exit(0);
}

const bySpelling = {};
for (const f of findings) (bySpelling[f.spelling] ||= []).push(f);

for (const [spelling, list] of Object.entries(bySpelling)) {
  const label = {
    hex: 'HEX LITERALS',
    'url-encoded': 'URL-ENCODED (inside data URIs - a "#" search will never find these)',
    rgb: 'RGB / RGBA TRIPLES',
    email: 'EMAIL TEMPLATES - inline by necessity, reported not enforced',
    artwork: 'ARTWORK TINTS inside SVGs - listed, not enforced against the palette',
  }[spelling];
  console.log(`  ${String(list.length).padStart(3)}  ${label}`);
  for (const f of list.slice(0, 12)) {
    console.log(`        ${f.rel}:${f.line}  ${f.value}`);
  }
  if (list.length > 12) console.log(`        ...and ${list.length - 12} more`);
  console.log();
}

console.log('  A colour written as a literal is invisible to whatever maintains the');
console.log('  palette. Move it into :root, or add it to the documented exceptions');
console.log('  in this file with the reason.\n');
process.exit(enforced.length ? 1 : 0);

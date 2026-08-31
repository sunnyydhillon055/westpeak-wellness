#!/usr/bin/env node
/**
 * VISUAL DENSITY — how far does a reader scroll before anything but prose?
 *
 * The site reads well and looks uniform, which is a different problem from
 * looking bad. A 2,000-word page with one diagram at the top and nothing after
 * it is a wall of text however good the sentences are, and the pages where that
 * matters most are the long clinical guides somebody is reading at the worst
 * moment of their week.
 *
 * Counts, per page, everything that breaks a column of prose: figures, images,
 * tables, callout and crisis blocks, step lists, quotes, chip rows, and the
 * headings that at least give the eye a rest. Then reports words-per-break —
 * the number that actually predicts whether a page feels readable.
 *
 * Nav, footer and the CTA band are excluded. They are on all 120 pages, so
 * counting them would score every page identically and tell you nothing.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) { console.error('No build. Run `npm run build` first.'); process.exit(1); }

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
    if (url === '/index') url = '/';
    pages.push({ url, html: readFileSync(p, 'utf8') });
  }
})(BUILT);

const count = (s, re) => (s.match(re) || []).length;

const rows = [];
for (const { url, html } of pages) {
  const clean = html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  let body = (clean.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
  body = body.replace(/<section[^>]*class="[^"]*cta-band[\s\S]*?<\/section>/gi, ' ');
  if (!body.trim()) continue;

  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 300) continue;   // short pages are not wall-of-text candidates
  /* A confirmation page is not a wall of text, whatever its word count says.
     /message-sent is the one page left on the "nothing visual at all" list
     after the fifty city x service pages got their diagrams, and it is there
     because it repeats the crisis numbers and what happens next -- prose that
     should stay prose. Illustrating a receipt would be decoration.
     Same routes cta-audit.mjs exempts, for the same reason. */
  if (url === '/message-sent' || url === '/punjabi/sent') continue;

  const v = {
    figure: count(body, /<figure\b/gi),
    img: count(body, /<img\b/gi),
    svg: count(body, /<svg\b/gi),
    table: count(body, /<table\b/gi),
    callout: count(body, /class="[^"]*(crisis|callout|note-box|admin-panel|card)\b/gi),
    list: count(body, /<[ou]l\b/gi),
    quote: count(body, /<blockquote\b/gi),
    /* A definition term breaks a column exactly as a heading does, and the
       first version of this script did not count them. That made /answers —
       78 <dt> elements — look like an unbroken 5,700-word slab when it is a
       directory. The number was wrong, not the page. */
    dt: count(body, /<dt\b/gi),
    h2: count(body, /<h2\b/gi),
    h3: count(body, /<h3\b/gi),
  };
  /* A "break" is anything that stops the column. Headings count for less —
     they rest the eye without giving it anything to look at. */
  const strong = v.figure + v.img + v.svg + v.table + v.callout + v.quote;
  const breaks = strong + v.list * 0.5 + v.dt * 0.5 + (v.h2 + v.h3) * 0.35;
  rows.push({ url, words, ...v, strong, wpb: Math.round(words / Math.max(breaks, 0.5)) });
}

rows.sort((a, b) => b.wpb - a.wpb);

const pad = (s, n) => String(s).padEnd(n);
const lp = (s, n) => String(s).padStart(n);

console.log(`\nVISUAL DENSITY — ${rows.length} pages over 300 words\n`);
console.log(pad('page', 46) + lp('words', 6) + lp('fig', 5) + lp('img', 5) + lp('tbl', 5) +
  lp('box', 5) + lp('list', 5) + lp('dt', 5) + lp('h2/3', 6) + lp('w/break', 9));
console.log('-'.repeat(92));
for (const r of rows.slice(0, 26)) {
  console.log(pad(r.url, 46) + lp(r.words, 6) + lp(r.figure, 5) + lp(r.img, 5) + lp(r.table, 5) +
    lp(r.callout, 5) + lp(r.list, 5) + lp(r.dt, 5) + lp(`${r.h2}/${r.h3}`, 6) + lp(r.wpb, 9));
}

const noVisual = rows.filter((r) => r.strong === 0);
const oneVisual = rows.filter((r) => r.strong === 1);
console.log('-'.repeat(92));
console.log(`\n  ${noVisual.length} pages over 300 words carry NO figure, image, table, quote or boxed block`);
console.log(`  ${oneVisual.length} carry exactly one`);
console.log(`  median words-per-break across the set: ${rows.length ? rows[Math.floor(rows.length / 2)].wpb : 0}\n`);

if (noVisual.length) {
  console.log('  Nothing visual at all:');
  for (const r of noVisual.slice(0, 20)) console.log(`     ${lp(r.words, 5)}w  ${r.url}`);
  if (noVisual.length > 20) console.log(`     …and ${noVisual.length - 20} more`);
  console.log();
}

/* ---------------------------------------------------------------------------
 * THIS GATE CAN FAIL.
 *
 * Until 31 Aug 2026 it could not. It printed its findings and ended, so the
 * process exited 0 and `npm run verify:ci` stayed green no matter what it
 * found. Four of the seventeen gates in that chain were like this - reports
 * wearing a gate's clothes.
 *
 * It surfaced the way these always do: a broken internal link
 * (/services/grief-counselling, written into the White Rock page) shipped to
 * production and 404'd for readers, while the gate whose entire job is to
 * catch that printed it and passed.
 * ------------------------------------------------------------------------- */
if (noVisual.length) {
  console.log('  A page over 300 words with nothing visual is a wall of text.');
  console.log('');
  process.exit(1);
}

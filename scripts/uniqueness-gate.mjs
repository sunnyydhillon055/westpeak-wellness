#!/usr/bin/env node
/* DOES THE CITY x SERVICE MATRIX ACTUALLY SAY FIFTY DIFFERENT THINGS?
 *
 * WHY THIS EXISTS
 *
 * Content uniqueness is this site's highest-scoring measured category — 900 of
 * 1000, first of eleven practices — and it holds that position because the two
 * competitors running four-hundred-page programmatic clusters are obvious from
 * the first paragraph. Adding fifty city x service pages puts that at risk in
 * exactly the way those competitors got caught.
 *
 * lib/city-services.ts states the rule: every pair earns its own argument. This
 * script is what stops that being a comment somebody stops honouring. A rule
 * nothing checks decays on the first busy afternoon.
 *
 * WHAT IT MEASURES, AND WHY IT MEASURES THE RENDERED PAGE
 *
 * It reads the BUILT HTML, not the source data. Two pairs can hold completely
 * different `angle` and `body` values and still render 90% identically if the
 * shared service block dwarfs them — and the rendered page is what a crawler
 * judges. Checking the data would pass a page the crawler would fail.
 *
 * Three checks, each a different failure:
 *
 *   1. PAIRWISE SIMILARITY — shingled Jaccard over <main> text. Two pages
 *      above the threshold means the matrix is converging.
 *   2. UNIQUE SHARE — how much of each page is text that appears on no other
 *      page in the matrix. A page can be dissimilar to any ONE sibling while
 *      still being mostly boilerplate shared with all of them.
 *   3. TITLE AND DESCRIPTION COLLISIONS — exact duplicates, which are the
 *      cheapest possible signal that two pages are the same page.
 *
 * The RSC flight payload is stripped before comparison. It repeats across every
 * page in a route and would make fifty distinct pages look near-identical —
 * scanning raw HTML instead of <main> has produced false positives on this site
 * before.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SERVER = join(ROOT, '.next', 'server', 'app', 'online-counselling');

/* Tunable, and deliberately not tight. The point is to catch a template being
   introduced, not to police prose. A pair of pages about the same service in
   two cities SHOULD share their service section. */
const MAX_SIMILARITY = 0.62;   // above this, two pages are converging
const MIN_UNIQUE_SHARE = 0.18; // below this, a page is mostly boilerplate

if (!existsSync(SERVER)) {
  console.log('uniqueness-gate: no build found — run `npm run build` first. Skipping.');
  process.exit(0);
}

/** Recursively collect the built .html for every city/service page. */
function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collect(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/* <main> only. The flight payload and the shared header/footer are not content
   and counting them would drown the signal. */
function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = m ? m[1] : html;
  return scope
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Overlapping 8-word shingles — long enough that a shared stock phrase does
 *  not register, short enough that a lightly reworded paragraph still does. */
function shingles(text, n = 8) {
  const w = text.split(' ').filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
}

const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
};

const files = collect(SERVER).filter((f) => {
  /* Only the two-segment city/service pages. A city hub lives one level up. */
  const rel = f.slice(SERVER.length + 1).replace(/\\/g, '/');
  return rel.split('/').length === 2 && rel.endsWith('.html');
});

if (files.length === 0) {
  console.log('uniqueness-gate: no city/service pages built yet. Skipping.');
  process.exit(0);
}

const pages = files.map((f) => {
  const html = readFileSync(f, 'utf8');
  const rel = '/online-counselling/' + f.slice(SERVER.length + 1).replace(/\\/g, '/').replace(/\.html$/, '');
  const text = mainText(html);
  return {
    route: rel,
    text,
    words: text.split(' ').filter(Boolean).length,
    sh: shingles(text),
    title: (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim(),
    desc: (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || [, ''])[1].trim(),
  };
});

const fail = [];
const warn = [];

/* ---- 1. pairwise similarity ---- */
let worst = { v: 0, a: '', b: '' };
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const v = jaccard(pages[i].sh, pages[j].sh);
    if (v > worst.v) worst = { v, a: pages[i].route, b: pages[j].route };
    if (v > MAX_SIMILARITY) {
      fail.push(`${(v * 100).toFixed(0)}% similar: ${pages[i].route} vs ${pages[j].route}`);
    }
  }
}

/* ---- 2. unique share ---- */
const counts = new Map();
for (const p of pages) for (const s of p.sh) counts.set(s, (counts.get(s) || 0) + 1);
for (const p of pages) {
  let only = 0;
  for (const s of p.sh) if (counts.get(s) === 1) only++;
  const share = only / (p.sh.size || 1);
  p.uniqueShare = share;
  if (share < MIN_UNIQUE_SHARE) {
    fail.push(`${(share * 100).toFixed(0)}% unique (min ${MIN_UNIQUE_SHARE * 100}%): ${p.route}`);
  }
}

/* ---- 3. exact metadata collisions ---- */
for (const field of ['title', 'desc']) {
  const seen = new Map();
  for (const p of pages) {
    const v = p[field];
    if (!v) { warn.push(`empty ${field}: ${p.route}`); continue; }
    if (seen.has(v)) fail.push(`duplicate ${field}: ${p.route} and ${seen.get(v)}`);
    else seen.set(v, p.route);
  }
}

/* ---- report ---- */
const shares = pages.map((p) => p.uniqueShare).sort((a, b) => a - b);
const mid = shares[Math.floor(shares.length / 2)];
console.log('\nCITY x SERVICE UNIQUENESS GATE\n' + '='.repeat(52));
console.log(`  pages           ${pages.length}`);
console.log(`  words / page    ${Math.round(pages.reduce((t, p) => t + p.words, 0) / pages.length)} median-ish mean`);
console.log(`  unique share    min ${(shares[0] * 100).toFixed(0)}%  median ${(mid * 100).toFixed(0)}%  (floor ${MIN_UNIQUE_SHARE * 100}%)`);
console.log(`  most similar    ${(worst.v * 100).toFixed(0)}%  (ceiling ${MAX_SIMILARITY * 100}%)`);
console.log(`                  ${worst.a}`);
console.log(`                  ${worst.b}`);
for (const w of warn) console.log(`  note  ${w}`);
for (const f of fail) console.log(`  FAIL  ${f}`);
console.log('='.repeat(52));
if (fail.length) {
  console.log(`${fail.length} FAILURE(S) — the matrix is converging on a template.`);
  console.log('Fix by giving the named pages their own argument, not by raising the threshold.');
  process.exit(1);
}
console.log('All pages carry their own argument.');

#!/usr/bin/env node
/**
 * CTR DELTA — did the snippet rewrites actually work?
 *
 * WHY THIS EXISTS
 *
 * On 20 August 2026 twelve titles and meta descriptions were rewritten, on the
 * theory that the snippets were answering the query so completely that nobody
 * needed to click. /resources/msp-vs-extended-health was the clearest case: 159
 * impressions at position 9.6 and ONE click, with a description that opened
 * "Why MSP does not cover private counselling" — the whole answer, free, in the
 * search results.
 *
 * That is a theory, not a fact, and the honest way to hold it is to make it
 * falsifiable. This compares two GSC exports and, crucially, records what the
 * title and description WERE at the time of each export — so a CTR change can
 * be attributed to a rewrite instead of to the weather.
 *
 * WHAT IT CANNOT TELL YOU
 *
 * Position moves on its own. A page that climbs from 12 to 8 will gain CTR
 * whatever its snippet says, so the report separates pages whose position held
 * from pages whose position moved, and only the first group is evidence about
 * the rewrite. That distinction is the entire point of the script; a naive
 * before/after would credit the copy for Google's ranking changes.
 *
 *   node scripts/ctr-delta.mjs                compare the two most recent exports
 *   node scripts/ctr-delta.mjs --snapshot     record today's titles/descriptions
 *
 * Exports live in data/gsc/ as YYYY-MM-DD-pages-*.csv, straight from the
 * Search Console "Export → CSV" button. No cleaning required.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const GSC = join(ROOT, 'data', 'gsc');
const BUILT = join(ROOT, '.next', 'server', 'app');

/* ── tiny CSV reader. GSC exports are well-formed and quote only when needed. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift().map((h) => h.replace(/^﻿/, '').trim());
  return rows.filter((r) => r.length === head.length && r.some(Boolean))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const num = (v) => Number(String(v ?? '').replace(/[%,]/g, '')) || 0;

function loadExports(kind) {
  if (!existsSync(GSC)) return [];
  return readdirSync(GSC)
    .filter((f) => f.includes(`-${kind}-`) && f.endsWith('.csv'))
    .sort()
    .map((f) => ({
      date: f.slice(0, 10),
      file: f,
      rows: parseCsv(readFileSync(join(GSC, f), 'utf8')),
    }));
}

/* ── titles/descriptions as they stand right now, from the build ─────────── */
function currentSnippets() {
  const out = {};
  if (!existsSync(BUILT)) return out;
  (function walk(dir) {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith('.html')) {
        let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
        if (url === '/index') url = '/';
        const h = readFileSync(p, 'utf8');
        out[url] = {
          title: (h.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1],
          desc: (h.match(/<meta name="description" content="([\s\S]*?)"/i) || [, ''])[1],
        };
      }
    }
  })(BUILT);
  return out;
}

const SNAP = join(GSC, 'snippets.json');

if (process.argv.includes('--snapshot')) {
  const today = new Date().toISOString().slice(0, 10);
  const store = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, 'utf8')) : {};
  store[today] = currentSnippets();
  if (!existsSync(GSC)) mkdirSync(GSC, { recursive: true });
  writeFileSync(SNAP, JSON.stringify(store, null, 2) + '\n');
  const n = Object.keys(store[today]).length;
  console.log(`\nSnapshotted ${n} titles and descriptions as of ${today} -> data/gsc/snippets.json`);
  console.log('Take another after the next GSC export and this script can tell you which');
  console.log('pages had their copy changed between the two.\n');
  process.exit(0);
}

const pages = loadExports('pages');
if (pages.length === 0) {
  console.error('No page exports in data/gsc/. Expected e.g. 2026-08-20-pages-28d.csv');
  process.exit(1);
}

const pad = (s, n) => String(s).padEnd(n);
const lpad = (s, n) => String(s).padStart(n);
const short = (u) => u.replace(/^https?:\/\/[^/]+/, '') || '/';

if (pages.length === 1) {
  const only = pages[0];
  console.log(`\nONE EXPORT ONLY (${only.date}) — nothing to compare against yet.\n`);
  const rows = only.rows.map((r) => ({
    url: short(r['Top pages']),
    clicks: num(r.Clicks), imp: num(r.Impressions), pos: num(r.Position),
    ctr: num(r.Impressions) ? (num(r.Clicks) / num(r.Impressions)) * 100 : 0,
  }));

  /* The pages where a snippet rewrite can pay: already ranking, already seen,
     barely clicked. Below ~position 15 the rewrite is not the constraint. */
  const targets = rows
    .filter((r) => r.pos > 0 && r.pos <= 15 && r.imp >= 20 && r.url !== '/')
    .sort((a, b) => b.imp - a.imp);

  const H = pad('page', 52) + lpad('imp', 6) + lpad('pos', 7) + lpad('clicks', 8) + lpad('CTR', 8);
  console.log('WHERE A SNIPPET REWRITE CAN ACTUALLY PAY');
  console.log('(position <= 15, at least 20 impressions, excluding the homepage)\n');
  console.log(H); console.log('-'.repeat(H.length));
  let ti = 0, tc = 0;
  for (const r of targets) {
    console.log(pad(r.url, 52) + lpad(r.imp, 6) + lpad(r.pos.toFixed(1), 7) +
      lpad(r.clicks, 8) + lpad(r.ctr.toFixed(2) + '%', 8));
    ti += r.imp; tc += r.clicks;
  }
  console.log('-'.repeat(H.length));
  console.log(pad(`${targets.length} pages`, 52) + lpad(ti, 6) + lpad('', 7) + lpad(tc, 8) +
    lpad(ti ? ((tc / ti) * 100).toFixed(2) + '%' : '-', 8));
  console.log(`\nAt a 4% CTR — ordinary for positions 6-12 — those ${ti} impressions would be`);
  console.log(`about ${Math.round(ti * 0.04)} clicks rather than ${tc}.\n`);
  console.log('Run with --snapshot to record the current titles, then compare after the');
  console.log('next export.\n');
  process.exit(0);
}

/* ── two or more exports: the real comparison ────────────────────────────── */
const before = pages[pages.length - 2];
const after = pages[pages.length - 1];
const idx = (e) => Object.fromEntries(e.rows.map((r) => [short(r['Top pages']), {
  clicks: num(r.Clicks), imp: num(r.Impressions), pos: num(r.Position),
  ctr: num(r.Impressions) ? (num(r.Clicks) / num(r.Impressions)) * 100 : 0,
}]));
const A = idx(before), B = idx(after);

const snaps = existsSync(SNAP) ? JSON.parse(readFileSync(SNAP, 'utf8')) : {};
const snapDates = Object.keys(snaps).sort();
const sBefore = snaps[snapDates.filter((d) => d <= before.date).pop()] || {};
const sAfter = snaps[snapDates.filter((d) => d <= after.date).pop()] || currentSnippets();
const rewritten = (u) =>
  sBefore[u] && sAfter[u] &&
  (sBefore[u].title !== sAfter[u].title || sBefore[u].desc !== sAfter[u].desc);

console.log(`\nCTR DELTA — ${before.date} vs ${after.date}\n`);

const rows = Object.keys(B)
  .filter((u) => A[u] && B[u].imp >= 20)
  .map((u) => ({
    url: u, ...B[u],
    dImp: B[u].imp - A[u].imp,
    dCtr: B[u].ctr - A[u].ctr,
    dPos: B[u].pos - A[u].pos,
    changed: rewritten(u),
  }));

const held = rows.filter((r) => Math.abs(r.dPos) < 3);
const moved = rows.filter((r) => Math.abs(r.dPos) >= 3);

function table(list, heading, note) {
  if (!list.length) return;
  console.log(heading);
  if (note) console.log(note);
  const H = '  ' + pad('page', 46) + lpad('imp', 6) + lpad('pos', 7) + lpad('CTR', 8) + lpad('ΔCTR', 9) + '  copy';
  console.log(H); console.log('  ' + '-'.repeat(H.length - 2));
  for (const r of list.sort((a, b) => b.dCtr - a.dCtr)) {
    console.log('  ' + pad(r.url, 46) + lpad(r.imp, 6) + lpad(r.pos.toFixed(1), 7) +
      lpad(r.ctr.toFixed(2) + '%', 8) +
      lpad((r.dCtr >= 0 ? '+' : '') + r.dCtr.toFixed(2), 9) +
      '  ' + (r.changed ? 'REWRITTEN' : '—'));
  }
  console.log();
}

table(held,
  'POSITION HELD (within 3 places) — this is the evidence about the copy',
  '  A CTR change here is not explained by ranking movement.\n');
table(moved,
  'POSITION MOVED — not evidence either way',
  '  These gained or lost CTR partly because they gained or lost rank.\n');

const changedHeld = held.filter((r) => r.changed);
if (changedHeld.length) {
  const mean = changedHeld.reduce((n, r) => n + r.dCtr, 0) / changedHeld.length;
  console.log(`VERDICT: ${changedHeld.length} rewritten page(s) held position.`);
  console.log(`  Mean CTR change: ${mean >= 0 ? '+' : ''}${mean.toFixed(2)} points.`);
  console.log(mean > 0.5
    ? '  The rewrites are doing something.'
    : mean < -0.5
      ? '  The rewrites made it worse. Revert them and say so.'
      : '  No clear effect. Do not claim one.');
} else {
  console.log('No rewritten page held position across these two exports —');
  console.log('nothing here supports a claim either way yet.');
}
console.log();

#!/usr/bin/env node
/**
 * LINK ROT — do the citations still resolve?
 *
 * WHY THIS EXISTS
 *
 * On 23 August 2026 a sweep found four dead external citations, three of them
 * on pages making claims about people's legal entitlements:
 *
 *   404  interiorhealth.ca/services/mental-health-substance-use
 *   404  gov.bc.ca .../employment-standards/time-off/illness-or-injury-leave
 *   404  worksafebc.com/en/health-safety/hazards-exposures/mental-health
 *   500  bclaws.gov.bc.ca .../statreg/03063_01
 *
 * The second was the source behind a "five paid and three unpaid days" figure
 * written three days earlier. Nothing had gone wrong on this site — government
 * and health-authority pages simply move, and a citation that 404s is worse
 * than no citation, because the whole argument of this site is "do not take my
 * word for it, here is where to check".
 *
 * Run it monthly. It is deliberately not part of `npm run seo`: a build must
 * not fail because a health authority reorganised its URLs overnight.
 *
 *   npm run links            check every external citation
 *   npm run links -- --slow  one request at a time, for a flaky connection
 *
 * A 403 is reported separately from a 404 and on purpose. Several government
 * and health sites refuse a plain scripted request while serving a browser
 * perfectly well; treating those as dead would send somebody rewriting a
 * citation that was never broken.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) {
  console.error('No build. Run `npm run build` first.');
  process.exit(1);
}

/* Where each URL is cited, so a failure names the page to edit. */
const cites = new Map();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
    if (url === '/index') url = '/';
    const html = readFileSync(p, 'utf8').replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
    const main = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
    for (const m of main.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      const href = m[1].replace(/\\$/, '');
      if (!cites.has(href)) cites.set(href, new Set());
      cites.get(href).add(url);
    }
  }
})(BUILT);

const urls = [...cites.keys()].sort();
const slow = process.argv.includes('--slow');
const UA = 'Mozilla/5.0 (compatible; westpeak-link-check/1.0)';

async function check(url) {
  const go = async (method) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(url, { method, redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA } });
      return r.status;
    } catch {
      return 0;
    } finally {
      clearTimeout(t);
    }
  };
  /* HEAD first because it is cheap; a good many servers refuse it, so fall
     through to GET rather than reporting a phantom failure. */
  let s = await go('HEAD');
  if (s === 0 || s === 405 || s === 403 || s === 501) s = await go('GET');
  return s;
}

const results = [];
if (slow) {
  for (const u of urls) results.push([u, await check(u)]);
} else {
  const queue = [...urls];
  const worker = async () => {
    while (queue.length) {
      const u = queue.shift();
      results.push([u, await check(u)]);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
}

const dead = results.filter(([, s]) => s >= 400 && s !== 403 && s !== 429);
const blocked = results.filter(([, s]) => s === 403 || s === 429);
const unreachable = results.filter(([, s]) => s === 0);
const ok = results.length - dead.length - blocked.length - unreachable.length;

console.log(`\nLINK ROT — ${results.length} external citations across the built site\n`);
console.log(`  ${String(ok).padStart(3)}  resolve`);
console.log(`  ${String(dead.length).padStart(3)}  DEAD`);
console.log(`  ${String(blocked.length).padStart(3)}  refused a scripted request (403/429) — almost certainly fine in a browser`);
console.log(`  ${String(unreachable.length).padStart(3)}  no response (timeout or DNS)\n`);

const show = (title, list) => {
  if (!list.length) return;
  console.log(title);
  for (const [u, s] of list.sort()) {
    console.log(`  ${String(s).padStart(3)}  ${u}`);
    for (const page of [...cites.get(u)].sort()) console.log(`         cited on ${page}`);
  }
  console.log();
};

show('DEAD — fix these; a citation that 404s is worse than none', dead);
show('NO RESPONSE — re-run before believing it', unreachable);
show('REFUSED A SCRIPTED REQUEST — check by hand, do not rewrite blind', blocked);

process.exit(dead.length ? 1 : 0);

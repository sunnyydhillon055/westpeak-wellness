#!/usr/bin/env node
/**
 * INTERNAL LINK INTEGRITY - does every link on this site go where it says?
 *
 * WHY THIS EXISTS
 *
 * Everything already here checks the outside world or the shape of a page.
 * link-rot.mjs requests the 95 external citations. seo-audit.mjs counts how
 * many pages link TO a route. redirect-shadow.mjs catches a built page hidden
 * behind a redirect. Nothing checked the ordinary case in between: that an
 * in-body internal href resolves to something that exists.
 *
 * That gap has cost this site before. next.config.mjs carries a long comment
 * about /online-counselling/kamloops, a real page that 308'd to a hub in
 * production because a retired slug still had a redirect - found by curl
 * against production, days after deploy. A link that lands on a redirect is
 * the same failure one step earlier, and it is invisible to every gate here:
 * the target exists, the page builds, the audit passes, and the reader takes
 * an extra hop while the crawler discounts the link.
 *
 * Three findings, in descending severity:
 *
 *   BROKEN    the href matches no built page, no on-demand route, no file in
 *             public/, and no redirect. It 404s.
 *   REDIRECT  the href is a declared redirect source. It works, but it costs
 *             a hop and it should point at the destination.
 *   ANCHOR    the href carries a #fragment that no id on the target defines.
 *
 * Reported, not enforced - same standing as quality-audit.mjs. A build should
 * not fail on a fragment, and a broken link is worth a person's judgement
 * about which of the two ends is wrong.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) {
  console.error('No build. Run `npm run build` first.');
  process.exit(1);
}

/* ---- what exists ------------------------------------------------------- */

const pages = new Map(); // route -> html
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let route = '/' + relative(BUILT, p).split(/[\\/]/).join('/').replace(/\.html$/, '');
    if (route === '/index') route = '/';
    pages.set(route, readFileSync(p, 'utf8'));
  }
})(BUILT);

/* Routes Next renders on demand have no .html on disk and are not broken.
   Same manifest seo-audit.mjs reads, and for the same reason it states: an
   audit that quietly treats a live page as missing is worse than no audit. */
const onDemand = new Set();
const MANIFEST = join(process.cwd(), '.next', 'app-path-routes-manifest.json');
if (existsSync(MANIFEST)) {
  try {
    for (const r of Object.values(JSON.parse(readFileSync(MANIFEST, 'utf8')))) {
      if (typeof r === 'string' && !r.startsWith('/api/') && !r.includes('[')) onDemand.add(r);
    }
  } catch { /* unreadable manifest: report nothing rather than guess */ }
}

/* Anything served straight out of public/ - images, the vcard, the fonts. */
const files = new Set();
const PUB = join(process.cwd(), 'public');
if (existsSync(PUB)) {
  (function walk(dir) {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      files.add('/' + relative(PUB, p).split(/[\\/]/).join('/'));
    }
  })(PUB);
}

/* Declared redirects, read from the real config rather than a copy of it.
   A copy is how the kamloops bug survived: two lists, one edited. */
let redirects = [];
try {
  const cfg = (await import(pathToFileURL(join(process.cwd(), 'next.config.mjs')).href)).default;
  redirects = typeof cfg.redirects === 'function' ? await cfg.redirects() : [];
} catch (e) {
  console.error('  could not read redirects from next.config.mjs -', e.message);
}
const redirectFor = (path) =>
  redirects.find((r) => {
    const s = String(r.source).replace(/\/$/, '');
    return s === path && !s.includes(':');
  });

/* ---- what is linked ---------------------------------------------------- */

const strip = (h) => h.replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
const mainOf = (h) => (strip(h).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const broken = [], viaRedirect = [], badAnchor = [];

for (const [route, html] of pages) {
  /* The gated provinces render a 404 shell on purpose; the links in it are the
     shell's, already checked on /_not-found. Same exemption seo-audit.mjs and
     the quality sweep make. */
  if (route === '/alberta' || route === '/ontario') continue;

  const main = mainOf(html);
  const ownIds = idsOf(html);

  for (const m of main.matchAll(/href="(\/[^"]*|#[^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue; // protocol-relative, so external

    const hash = href.indexOf('#');
    const pathRaw = hash === -1 ? href : href.slice(0, hash);
    const frag = hash === -1 ? '' : href.slice(hash + 1);

    if (pathRaw === '') {
      if (frag && !ownIds.has(frag)) badAnchor.push([route, href, 'no such id on this page']);
      continue;
    }

    const path = (pathRaw.split('?')[0] || '/').replace(/(.)\/$/, '$1');

    if (pages.has(path) || onDemand.has(path) || files.has(path)) {
      const target = pages.get(path);
      if (frag && target && !idsOf(target).has(frag)) {
        badAnchor.push([route, href, `no #${frag} on ${path}`]);
      }
      continue;
    }

    const red = redirectFor(path);
    if (red) viaRedirect.push([route, path, red.destination]);
    else broken.push([route, path, '']);
  }
}

/* ---- report ------------------------------------------------------------ */

const group = (rows) => {
  const by = new Map();
  for (const [from, to, note] of rows) {
    const k = `${to} ${note}`;
    if (!by.has(k)) by.set(k, { to, note, from: [] });
    by.get(k).from.push(from);
  }
  return [...by.values()].sort((a, b) => b.from.length - a.from.length);
};

console.log(`\nINTERNAL LINKS - ${pages.size} built pages\n`);
console.log(`  ${String(broken.length).padStart(3)}  BROKEN (no page, no route, no file, no redirect)`);
console.log(`  ${String(viaRedirect.length).padStart(3)}  go through a redirect (works, costs a hop)`);
console.log(`  ${String(badAnchor.length).padStart(3)}  point at a fragment that does not exist\n`);

const show = (title, rows, arrow) => {
  if (!rows.length) return;
  console.log(title);
  for (const g of group(rows)) {
    console.log(`  ${g.to}${arrow && g.note ? `  ${arrow}  ${g.note}` : ''}`);
    for (const f of g.from.slice(0, 6)) console.log(`       linked from ${f}`);
    if (g.from.length > 6) console.log(`       ...and ${g.from.length - 6} more`);
  }
  console.log();
};

show('BROKEN - these 404 for a reader', broken);
show('THROUGH A REDIRECT - point the link at the destination instead', viaRedirect, '->');
show('MISSING FRAGMENT - the page exists, the anchor on it does not', badAnchor, '.');

if (!broken.length && !viaRedirect.length && !badAnchor.length) {
  console.log('  Every internal link resolves to something that exists, first time.\n');
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
if (broken.length || viaRedirect.length || badAnchor.length) {
  console.log('  A link that does not resolve is a reader hitting a 404.');
  console.log('');
  process.exit(1);
}

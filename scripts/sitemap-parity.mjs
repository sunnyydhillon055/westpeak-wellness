#!/usr/bin/env node
/**
 * SITEMAP PARITY - does the sitemap describe the site that was built?
 *
 * WHY THIS EXISTS
 *
 * app/sitemap.xml/route.ts is hand-assembled from fourteen imported
 * collections, and its own header comment explains why: Next 14 discards the
 * image entries this site needs. That is the right call, and it has a cost
 * nothing was paying attention to - the sitemap is a SECOND list of every URL
 * on the site, maintained by hand, next to the one the router builds.
 *
 * Two lists of the same thing drift. This repo has the scar: next.config.mjs
 * carries a warning that a slug must never appear both in the retired-city
 * redirects and in lib/locations.ts, because that combination shipped once and
 * 308'd a real page in production off a green local gate.
 *
 * Drift here is quieter than that and costs more than it looks:
 *
 *   MISSING    a built, indexable page absent from the sitemap. It is
 *              discoverable only by crawl, which for a new page on a domain
 *              with no authority can mean weeks or never.
 *   PHANTOM    a sitemap URL with no page behind it. Google reports these as
 *              errors against the whole sitemap, which discounts every other
 *              URL in it.
 *   GATED      a route that expansion-verify.mjs requires to stay out of the
 *              sitemap, found in it. That one is a compliance failure, not an
 *              SEO one - it would advertise a province the practice is not
 *              registered to serve.
 *
 * Read from .next/server/app, so it checks what was BUILT, not what a source
 * file says should exist.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) {
  console.error('No build. Run `npm run build` first.');
  process.exit(1);
}

/* ---- the sitemap as built --------------------------------------------- */

const XML_CANDIDATES = [
  join(BUILT, 'sitemap.xml.body'),
  join(BUILT, 'sitemap.xml.html'),
  join(BUILT, 'sitemap.xml'),
];
let xml = null;
for (const c of XML_CANDIDATES) {
  if (existsSync(c) && statSync(c).isFile()) { xml = readFileSync(c, 'utf8'); break; }
}
if (!xml) {
  console.error('  sitemap.xml was not prerendered to disk - nothing to compare against.');
  console.error('  looked in:', XML_CANDIDATES.map((c) => relative(process.cwd(), c)).join(', '));
  process.exit(0);
}

/* [^/<] and not [^/]: the first draft of this line ended the origin at the
   next slash, which for `<loc>https://host</loc>` is never reached, so the
   captured origin was `https://host<` and every path stripped against it came
   out unchanged. The parity report then read 192 URLs as zero and declared
   every page on the site missing from its own sitemap. Caught in one run
   because the number was absurd; a subtler off-by-one here would not be. */
const origin = (xml.match(/<loc>(https?:\/\/[^/<]+)/) || [, ''])[1];
const listed = new Set(
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(origin, '').replace(/&amp;/g, '&'))
    .map((p) => (p === '' ? '/' : p))
    /* <image:loc> entries share the tag name in some generators; this sitemap
       uses <image:loc>, which the regex above does not match. Guard anyway. */
    .filter((p) => p.startsWith('/'))
);

/* ---- the site as built ------------------------------------------------- */

const built = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let route = '/' + relative(BUILT, p).split(/[\\/]/).join('/').replace(/\.html$/, '');
    if (route === '/index') route = '/';
    built.add(route);
  }
})(BUILT);

/* Routes Next renders on demand have no .html on disk, and /book, /contact,
   /pricing and /refer are all of them. Reading the build directory alone
   reported those four as sitemap entries with no page behind them - this
   report's most serious category, and wrong. seo-audit.mjs solved the same
   blind spot by reading the route manifest and printing what it cannot see;
   the same manifest is the answer here. An audit that cannot see a page must
   say so, not conclude the page is absent. */
const onDemand = new Set();
const MANIFEST = join(process.cwd(), '.next', 'app-path-routes-manifest.json');
if (existsSync(MANIFEST)) {
  try {
    for (const r of Object.values(JSON.parse(readFileSync(MANIFEST, 'utf8')))) {
      /* Endpoints, generated images and file routes are not pages, and a
         sitemap of pages should not list them. /feed.xml, /llms.txt,
         /westpeak.vcf and the fifty-odd opengraph-image routes all arrive
         through this manifest and all belong on neither side of the
         comparison. */
      const isPage =
        typeof r === 'string' &&
        !r.startsWith('/api/') &&
        !r.includes('[') &&
        !r.includes('/opengraph-image') &&
        !/\.[a-z0-9]+$/i.test(r);
      if (isPage) {
        onDemand.add(r);
        built.add(r);
      }
    }
  } catch { /* unreadable manifest: the report says nothing rather than guessing */ }
}

/* Pages that must NOT be in a sitemap, each for a stated reason. A sitemap is
   a list of pages you are asking to have indexed; several of these actively
   set robots noindex, and listing a noindex URL is a contradiction Search
   Console reports. */
const NEVER_LISTED = new Map([
  ['/_not-found', 'the 404 boundary, noindex'],
  ['/message-sent', 'confirmation, noindex'],
  ['/punjabi/sent', 'confirmation, noindex'],
  ['/signin', 'authentication'],
  ['/forgot', 'authentication'],
  ['/reset', 'authentication'],
  ['/admin', 'private'],
  ['/client-portal', 'private'],
  ['/search', 'a results page, not content'],
]);
const isGated = (r) =>
  ['/alberta', '/ontario'].some((g) => r === g || r.startsWith(g + '/'));

const missing = [...built]
  .filter((r) => !listed.has(r) && !NEVER_LISTED.has(r) && !isGated(r))
  .sort();

const phantom = [...listed]
  .filter((r) => !built.has(r))
  .sort();

const gatedListed = [...listed].filter(isGated).sort();
const noindexListed = [...listed].filter((r) => NEVER_LISTED.has(r)).sort();

/* ---- report ------------------------------------------------------------ */

console.log(`\nSITEMAP PARITY - ${built.size} routes (${onDemand.size} of them rendered on demand), ${listed.size} sitemap URLs\n`);
console.log(`  ${String(missing.length).padStart(3)}  built but NOT in the sitemap`);
console.log(`  ${String(phantom.length).padStart(3)}  in the sitemap with no built page`);
console.log(`  ${String(gatedListed.length).padStart(3)}  GATED province routes in the sitemap`);
console.log(`  ${String(noindexListed.length).padStart(3)}  noindex routes in the sitemap\n`);

const show = (title, list, note) => {
  if (!list.length) return;
  console.log(title);
  for (const r of list.slice(0, 40)) {
    console.log(`   ${r}${note && NEVER_LISTED.get(r) ? `  - ${NEVER_LISTED.get(r)}` : ''}`);
  }
  if (list.length > 40) console.log(`   ...and ${list.length - 40} more`);
  console.log();
};

show('BUILT BUT NOT LISTED - discoverable only by crawl', missing);
show('LISTED BUT NOT BUILT - Search Console reports these against the whole file', phantom);
show('GATED - expansion-verify.mjs requires these to stay out', gatedListed);
show('NOINDEX BUT LISTED - asking for indexing of a page that refuses it', noindexListed, true);

/* Phantom and gated entries are real errors. A missing page is a warning:
   /book is a redirect and several routes are deliberately unlisted, so the
   judgement about a new one belongs to a person. */
const fatal = phantom.length + gatedListed.length + noindexListed.length;
if (!fatal && !missing.length) {
  console.log('  The sitemap and the build agree, in both directions.\n');
}
process.exit(fatal ? 1 : 0);

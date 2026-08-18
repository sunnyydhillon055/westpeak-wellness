#!/usr/bin/env node
/**
 * REDIRECT SHADOW CHECK — does a redirect win over a page that actually exists?
 *
 * WHY THIS EXISTS
 *
 * On 18 August 2026 three new pages shipped. Two of them were unreachable in
 * production and every local check said they were fine:
 *
 *   /online-counselling/kamloops   308 -> /online-counselling
 *   /punjabi-counselling           308 -> /services/punjabi-counselling
 *
 * Both had a redirect declared in next.config.mjs from an earlier decision —
 * Kamloops was one of the 37 retired city slugs, and the bare Punjabi prefix
 * was pointed at the service page back when no hub existed at that URL. In
 * Next.js a redirect is matched before routing, so a redirect silently beats a
 * route that is genuinely there.
 *
 * NOTHING ELSE CATCHES THIS. `npm run build` does not exercise redirects. The
 * SEO gate scans built HTML and finds a file that really is on disk. The
 * scoring script reads the same files and scores the page a perfect structural
 * 200. The pages looked complete from every angle except the only one that
 * counts, and it took a curl against production to find out.
 *
 * WHAT IT CHECKS, AND WHAT IT DOES NOT
 *
 * Every redirect `source` that is a literal path (no :param, no wildcard) is
 * compared against the prerendered routes in .next/server/app. A collision is
 * an error, because it means a page was written that nobody can reach.
 *
 * Parameterised sources (/blog/:slug) are reported as skipped rather than
 * guessed at. Pretending to check them would be worse than saying plainly
 * which ones were not checked — the failure this script exists to prevent was
 * itself caused by a check that looked more complete than it was.
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const BUILT = join(ROOT, '.next', 'server', 'app');

if (!existsSync(BUILT)) {
  console.error('redirect-shadow: no build found — run `npm run build` first.');
  process.exit(1);
}

/* Prerendered routes, as URLs. */
const routes = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) {
      let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
      if (url === '/index') url = '/';
      routes.add(url);
    }
  }
})(BUILT);

const config = (await import(pathToFileURL(join(ROOT, 'next.config.mjs')).href)).default;
const redirects = typeof config.redirects === 'function' ? await config.redirects() : [];

const collisions = [];
const skipped = [];

for (const r of redirects) {
  const src = String(r.source).replace(/\/$/, '') || '/';
  if (/[:*(]/.test(src)) { skipped.push(src); continue; }
  if (routes.has(src)) collisions.push({ src, dest: r.destination });
}

console.log('\nREDIRECT SHADOW CHECK');
console.log('='.repeat(52));
console.log(`  ${routes.size} prerendered routes, ${redirects.length} redirects`);
console.log(`  ${redirects.length - skipped.length} literal sources checked, ${skipped.length} parameterised and skipped`);

if (collisions.length) {
  console.log('\n  ERROR — these pages exist and are unreachable:\n');
  for (const c of collisions) {
    console.log(`    ${c.src}`);
    console.log(`        a page is built here, but a redirect sends it to ${c.dest}`);
  }
  console.log('\n  Either delete the redirect, or delete the page. Both is not a state.');
  console.log('='.repeat(52) + '\n');
  process.exit(1);
}

console.log('\n  PASS — no built page is shadowed by a redirect.');
if (skipped.length) {
  console.log(`\n  not checked (parameterised): ${skipped.join(', ')}`);
}
console.log('='.repeat(52) + '\n');

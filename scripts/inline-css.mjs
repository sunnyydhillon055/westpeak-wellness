#!/usr/bin/env node
/* Inline the stylesheets into every prerendered document — post-build.
 *
 * WHY THIS EXISTS. Lighthouse (mobile, 6 Sep 2026) put 740 ms of the 2.9 s LCP
 * on render-blocking CSS: three <link rel="stylesheet"> tags in the head that
 * the browser must fetch before it paints anything. Next 14's App Router has
 * no critical-CSS step — experimental.optimizeCss (critters) was tried on
 * 28 Aug and touched nothing (see next.config.mjs) — so the fetch happens on
 * the critical path of every first visit.
 *
 * WHAT IT DOES. For each prerendered .html under .next/server/app:
 *   1. copies the contents of every /_next/static/css/*.css the page links
 *      into one <style data-inlined> block at the same position in <head>;
 *   2. turns each <link rel="stylesheet"> into a deferred load —
 *      media="print" onload="this.media='all'" — so the browser still fetches
 *      the file (React's hydration finds the resource it expects by href, and
 *      the client router reuses it on the next navigation) but no longer
 *      waits for it before first paint.
 * The .rsc payload is untouched: client navigations still reference the
 * stylesheet by URL, and by then it is in the cache.
 *
 * THE TRADE. Each document grows by the CSS size (~96 KB raw, ~14 KB gzipped)
 * and a repeat visitor pays that again on every page instead of once from
 * cache. For a site whose audience arrives from search — one page, first
 * visit — that is the right side of the trade, and the perf-budget baseline
 * was raised for the HTML rows on 6 Sep 2026 with this note beside it. Set
 * INLINE_CSS=0 to build without it; `--check` verifies every document has
 * the block and no blocking stylesheet link remains.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = join(process.cwd(), '.next', 'server', 'app');
const STATIC = join(process.cwd(), '.next', 'static', 'css');
const CHECK = process.argv.includes('--check');

if (process.env.INLINE_CSS === '0' && !CHECK) {
  console.log('  inline-css: skipped (INLINE_CSS=0)');
  process.exit(0);
}
if (!existsSync(ROOT)) {
  console.error('  no build at .next/server/app — run next build first');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}
const routeOf = (f) => '/' + relative(ROOT, f).split(sep).join('/').replace(/\.html$/, '').replace(/^index$/, '');

/* A blocking stylesheet link, as Next emits it. On Vercel the href carries a
   deployment id as a query string (…/x.css?dpl=dpl_…), which the first
   version of this pattern did not allow for: it matched nothing there, the
   build "succeeded", and production shipped without the inline block while
   the local check passed. The query is optional here and stripped before the
   file is looked up. */
const LINK = /<link rel="stylesheet" href="(\/_next\/static\/css\/[^"?]+\.css(?:\?[^"]*)?)"([^>]*)\/>/g;
const cssCache = new Map();
const cssFor = (href) => {
  if (!cssCache.has(href)) {
    const p = join(STATIC, href.split('?')[0].split('/').pop());
    cssCache.set(href, existsSync(p) ? readFileSync(p, 'utf8') : null);
  }
  return cssCache.get(href);
};

let done = 0, already = 0, checked = 0, wrong = [];
for (const f of walk(ROOT)) {
  const route = routeOf(f);
  if (route.startsWith('/_')) continue;
  const html = readFileSync(f, 'utf8');
  const hasBlock = html.includes('<style data-inlined>');
  const blocking = [...html.matchAll(LINK)].filter((m) => !/media="print"/.test(m[2]));
  if (CHECK) {
    checked++;
    if (blocking.length || (!hasBlock && [...html.matchAll(/data-inlined-css/g)].length === 0 && /\.css"/.test(html))) {
      wrong.push(`${route}  ${blocking.length} blocking stylesheet link(s), inlined block ${hasBlock ? 'present' : 'missing'}`);
    }
    continue;
  }
  if (hasBlock) { already++; continue; }
  const parts = [];
  let first = true;
  const next = html.replace(LINK, (whole, href, rest) => {
    const css = cssFor(href);
    if (css == null) return whole; // unknown file: leave the link blocking rather than lose styles
    parts.push(css);
    const deferred = `<link rel="stylesheet" href="${href}"${rest} media="print" onload="this.media='all'"/>`;
    if (first) { first = false; return `<style data-inlined>__INLINE_CSS__</style>${deferred}`; }
    return deferred;
  });
  if (!parts.length) continue;
  writeFileSync(f, next.replace('__INLINE_CSS__', parts.join('\n')));
  done++;
}

if (CHECK) {
  console.log(`\nINLINE CSS - ${checked} documents checked`);
  if (wrong.length) {
    console.log(`\n  ${wrong.length} document(s) still block on a stylesheet:\n`);
    for (const w of wrong) console.log(`   ${w}`);
    console.log('\n  Run `node scripts/inline-css.mjs` after next build; the build script does.');
    process.exit(1);
  }
  console.log('  every prerendered document carries its CSS inline; no stylesheet blocks first paint.\n');
} else {
  console.log(`  inline css: ${done} document(s) inlined, ${already} already done`);
}

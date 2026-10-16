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
 *
 * ONLY THE RULES A DOCUMENT CAN USE — 1 Oct 2026 (item 301). The block is
 * pruned per document by scripts/css-prune.mjs: a selector naming a class or
 * id found nowhere in the document or in any client JS chunk is left out of
 * the inline copy (the linked file still loads in full, in the same place).
 * That took the median document from 191.6 KB to about 158 KB with no change
 * to any rule that can match the first paint. PRUNE_CSS=0 inlines the whole
 * sheet as before.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pruneCss, tokensOf } from './css-prune.mjs';

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

/* Class names client code can add at runtime: every identifier in every
   client chunk the build emitted. Deliberately broad — a token kept for
   nothing costs a few bytes, a token missed costs a flash of unstyled UI. */
const PRUNE = process.env.PRUNE_CSS !== '0';
const CHUNKS = join(process.cwd(), '.next', 'static', 'chunks');
const clientTokens = new Set();
if (PRUNE && !CHECK && existsSync(CHUNKS)) {
  const jsWalk = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) jsWalk(p);
      else if (e.endsWith('.js')) tokensOf(readFileSync(p, 'utf8'), clientTokens);
    }
  };
  jsWalk(CHUNKS);
}
let fullBytes = 0, keptBytes = 0;

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
  let css = parts.join('\n');
  if (PRUNE) {
    const pageTokens = tokensOf(html);
    const pruned = pruneCss(css, (name) => pageTokens.has(name) || clientTokens.has(name));
    fullBytes += css.length;
    keptBytes += pruned.length;
    css = pruned;
  }
  /* A function, not a string: a replacement string would expand any `$&`
     or `$'` the stylesheet happens to contain. */
  writeFileSync(f, next.replace('__INLINE_CSS__', () => css));
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
  console.log('  every prerendered document carries its CSS inline; no stylesheet blocks first paint.');
  /* WHAT THIS CHECK CANNOT SEE — 1 Oct 2026.
   *
   * A route that exports `revalidate` is prerendered at build, and that
   * document carries the block above. After its first regeneration in
   * production the page is rendered again by the server, from React, and
   * this script never sees it: the four stylesheet links come back, blocking.
   * Verified on the live site the same day: /guides/stress-leave-bc (static)
   * has the block, / (revalidate 1800) does not, and Lighthouse on the home
   * page charges 4 render-blocking stylesheets that no static page pays.
   *
   * FAILED, NOT REPORTED, SINCE 3 OCT 2026 (item 429). Reporting it let the
   * list grow from 11 routes on 1 Oct to 317 on 3 Oct, and production served
   * guides and resources with three plain stylesheet links. The Cliniko lines
   * that were the reason now fill in on the client (components/
   * NextConsultSlot.tsx), so an indexable page that revalidates is a
   * regression. A noindex page may still revalidate (nobody arrives on it
   * from search), and so may the routes in REVALIDATE_ALLOWED, each with its
   * reason; take one off the list when its page stops revalidating. */
  const REVALIDATE_ALLOWED = {
    '/refer/counsellors': 'reads Cliniko at render for its next-open line; not moved to the client slot yet',
    '/refer/doctor': 'a print handout whose fees re-read the catalogue hourly; low search traffic',
    '/refer/handout': 'a print handout whose fees re-read the catalogue hourly; low search traffic',
    '/for/employers-and-hr/one-pager': 'a print one-pager whose fees re-read the catalogue hourly',
  };
  const pm = join(process.cwd(), '.next', 'prerender-manifest.json');
  if (existsSync(pm)) {
    const routes = JSON.parse(readFileSync(pm, 'utf8')).routes ?? {};
    const isr = Object.entries(routes)
      .filter(([r, v]) => !r.startsWith('/api/') && typeof v.initialRevalidateSeconds === 'number');
    const failing = [];
    const allowed = [];
    for (const [r, v] of isr) {
      const file = join(ROOT, `${r === '/' ? 'index' : r.slice(1)}.html`);
      const html = existsSync(file) ? readFileSync(file, 'utf8') : '';
      const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
      const line = `${r} (${v.initialRevalidateSeconds}s)`;
      if (noindex) allowed.push(`${line}  noindex`);
      else if (REVALIDATE_ALLOWED[r]) allowed.push(`${line}  allowed: ${REVALIDATE_ALLOWED[r]}`);
      else failing.push(line);
    }
    if (allowed.length) {
      console.log(`\n  ${allowed.length} route(s) revalidate at runtime and lose this block in production after their first regeneration (allowed):`);
      for (const r of allowed) console.log(`   ${r}`);
    }
    if (failing.length) {
      console.log(`\n  ${failing.length} indexable route(s) revalidate at runtime and would lose this block in production:\n`);
      for (const r of failing) console.log(`   ${r}`);
      console.log('\n  Remove `export const revalidate` (and anything that reads Cliniko at render, which');
      console.log('  sets it for the page: unstable_cache revalidates). Put a live line in the client');
      console.log('  slot, components/NextConsultSlot.tsx, instead.\n');
      process.exit(1);
    }
  }

  /* AN INDEXABLE PAGE WITH NO PRERENDERED DOCUMENT — 15 Oct 2026 (item 514).
   *
   * The checks above only see documents the build wrote, so a page rendered
   * per request was invisible to them: /book (read ?with=, ?for= and ?sent=
   * on the server, and Cliniko) and /contact (?sent=) shipped five and three
   * blocking stylesheet links with `private, no-store` and no edge cache,
   * and this script never named either. Every URL the sitemap lists must
   * now have a document here, or the check fails and says which. Read from
   * the build's own sitemap bodies, so the list is the one Google is given.
   * ALLOW_PER_REQUEST names a page that may render per request, with why. */
  const ALLOW_PER_REQUEST = {
    /* Found by this check on its first run, 15 Oct 2026: app/refer/page.tsx
       reads ?lead= on the server for its sent banner. Same fix as /contact
       (components/SentInboundForm.tsx's pattern); not in this change. */
    '/refer': 'reads ?lead= on the server for its sent banner; move it to a client island, then remove this line',
  };
  const sitemapBodies = [];
  const walkBodies = (dir) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walkBodies(p);
      else if (e.endsWith('.body') && /sitemap/i.test(relative(ROOT, p))) sitemapBodies.push(p);
    }
  };
  walkBodies(ROOT);
  const listed = new Set();
  for (const f of sitemapBodies) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<loc>\s*https?:\/\/[^/<]+(\/[^<\s]*)?\s*<\/loc>/g)) {
      const path = (m[1] ?? '/').split(/[?#]/)[0] || '/';
      if (/\.(xml|txt)$/.test(path)) continue;
      listed.add(path === '/' ? '/' : path.replace(/\/$/, ''));
    }
  }
  if (!sitemapBodies.length || !listed.size) {
    console.log('\n  no sitemap body in the build, so pages rendered per request were not checked.');
  } else {
    const perRequest = [...listed]
      .filter((r) => !existsSync(join(ROOT, `${r === '/' ? 'index' : decodeURIComponent(r.slice(1))}.html`)))
      .sort();
    const allowedPR = perRequest.filter((r) => ALLOW_PER_REQUEST[r]);
    const failingPR = perRequest.filter((r) => !ALLOW_PER_REQUEST[r]);
    console.log(`\n  ${listed.size} sitemap URL(s): ${listed.size - perRequest.length} have a prerendered document.`);
    for (const r of allowedPR) console.log(`   ${r}  renders per request (allowed: ${ALLOW_PER_REQUEST[r]})`);
    if (failingPR.length) {
      console.log(`\n  ${failingPR.length} indexable page(s) render per request, so none of the above reaches them:\n`);
      for (const r of failingPR) console.log(`   ${r}`);
      console.log('\n  Something on the page makes it dynamic: searchParams, cookies() or headers(), a');
      console.log('  no-store fetch, or force-dynamic. Read the query string in a client island instead');
      console.log('  (components/BookChoice.tsx, components/SentInboundForm.tsx).\n');
      process.exit(1);
    }
  }
  console.log('');
} else {
  console.log(`  inline css: ${done} document(s) inlined, ${already} already done`);
  if (PRUNE && done) {
    console.log(`  inline css: kept ${Math.round((keptBytes / fullBytes) * 100)}% of the sheet on average (${Math.round(keptBytes / done)} of ${Math.round(fullBytes / done)} B per document); the linked file still loads in full`);
  }
}

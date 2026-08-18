#!/usr/bin/env node
/* SEO gate — run after `next build`, against the HTML Next actually prerendered.
 *
 * WHY IT READS .next AND NOT A RUNNING SERVER
 *
 * Every previous audit of this site was done by hand, and two of them were
 * wrong in the same way: they parsed `lib/*.ts` with a regex and concluded
 * things about pages nobody had rendered. That produced a phantom finding of
 * eight orphan pages — the regex could not see `href={`/x/${slug}`}` — and it
 * produced per-page counts that were really per-line counts, because Next emits
 * one long line and `grep -c` counts lines.
 *
 * The prerendered files under .next/server/app are the bytes the CDN serves.
 * Auditing those cannot drift from what a crawler sees, needs no server, and
 * runs in CI straight after the build.
 *
 *   node scripts/seo-audit.mjs           report, exit 1 on any ERROR
 *   node scripts/seo-audit.mjs --warn    report, exit 0 (advisory run)
 *   node scripts/seo-audit.mjs --json    machine-readable
 *
 * Thresholds are deliberately the ones Google actually truncates at, not round
 * numbers: ~60 characters of title and ~158 of description survive on desktop.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = join(process.cwd(), '.next', 'server', 'app');
const WARN_ONLY = process.argv.includes('--warn');
const AS_JSON = process.argv.includes('--json');

const TITLE_MAX = 60;
const DESC_MAX = 158;
const DESC_MIN = 70;
const THIN_WORDS = 900;

/* Hubs and utility routes. Short is correct on an index page, and a policy page
 * has no business carrying FAQ markup, so they are exempt from the depth and
 * schema checks rather than being permanent known-failures nobody looks at. */
const HUBS = new Set([
  '/', '/guides', '/services', '/for', '/approaches', '/compare', '/resources',
  '/tools', '/online-counselling', '/punjabi', '/glossary', '/search',
]);
const UTILITY = new Set([
  '/privacy', '/accessibility', '/editorial-policy', '/standards', '/reviews',
  '/careers', '/contact', '/book', '/signin', '/forgot', '/reset',
  '/client-portal', '/admin', '/_not-found',
]);
/* Job postings. Real content, but a hiring page needs neither a clinical
 * review date nor a diagram, and manufacturing either to satisfy a check
 * would be the gate driving the content instead of the reverse. */
const IS_JOB = (r) => r.startsWith('/careers/');
/* Health content — the pages that should carry MedicalWebPage + a review date. */
const CLINICAL = (r) =>
  r.startsWith('/guides/') || r.startsWith('/services/') ||
  r.startsWith('/approaches/') || r.startsWith('/for/');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
if (!files.length) {
  console.error('No prerendered HTML found. Run `npm run build` first.');
  process.exit(1);
}

const pages = new Map();
for (const f of files) {
  /* Next writes the home page as index.html; every other route is its own path.
     Without this the home page audits as "/index", which then reports itself as
     orphaned and missing breadcrumbs — two findings that are purely an artifact
     of the filename. */
  const rel = relative(ROOT, f).split(sep).join('/').replace(/\.html$/, '');
  const route = rel === 'index' ? '/' : '/' + rel;
  const html = readFileSync(f, 'utf8');
  const grab = (re) => (html.match(re) || [null, ''])[1].trim();
  const count = (re) => (html.match(re) || []).length;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');

  /* In-body links only. A link in the header or footer is on every page and so
     says nothing about whether a page is actually reachable from the content;
     counting them made every page look well-linked in an earlier pass. */
  const main = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [null, ''])[1]
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ');
  const links = new Set(
    [...main.matchAll(/href="(\/[^"#?]*)"/g)]
      .map((m) => m[1].replace(/\/+$/, '') || '/')
      .filter((h) => !h.startsWith('/_next'))
  );

  pages.set(route, {
    route,
    title: grab(/<title[^>]*>([^<]*)<\/title>/i),
    desc: grab(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i),
    words: text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length,
    imgs: count(/<img\b/gi),
    imgsNoAlt: count(/<img\b(?![^>]*\salt=)[^>]*>/gi),
    faq: html.includes('"FAQPage"'),
    crumbs: html.includes('"BreadcrumbList"'),
    medical: html.includes('"MedicalWebPage"'),
    reviewed: html.includes('"lastReviewed"'),
    price: html.includes('"priceCurrency"'),
    speakable: html.includes('"speakable"'),
    lang: /["']inLanguage["']\s*:/.test(html),
    /* A page telling crawlers not to index it is not a page that should
       be linked from body copy, carry a long description, or run to a
       word count. Form destinations and confirmations live here. */
    noindex: /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html),
    links,
  });
}

/* Inbound counts, in-body only. */
const inbound = new Map([...pages.keys()].map((r) => [r, 0]));
for (const p of pages.values())
  for (const l of p.links) if (inbound.has(l) && l !== p.route) inbound.set(l, inbound.get(l) + 1);

/* COVERAGE, STATED OUT LOUD.
 *
 * This gate can only see routes Next prerendered to disk. Anything rendered on
 * demand — /pricing and /contact read live Cliniko data, /book is a redirect —
 * has no .html file, so it is not audited and, worse, its outgoing links are
 * invisible to the inbound-link count. That silently made /refer look like it
 * had one inbound link when three pages point at it.
 *
 * An audit that quietly skips pages is how you end up confidently wrong, so the
 * skipped set is printed every run rather than assumed empty. */
const MANIFEST = join(process.cwd(), '.next', 'app-path-routes-manifest.json');
let notPrerendered = [];
if (existsSync(MANIFEST)) {
  try {
    const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    notPrerendered = [...new Set(Object.values(m))]
      .filter(
        (r) =>
          typeof r === 'string' &&
          !r.startsWith('/api/') &&        // endpoints, not pages
          !r.includes('/opengraph-image') && // generated images
          !r.includes('[') &&              // dynamic patterns, not concrete URLs
          !/\.[a-z0-9]+$/i.test(r) &&      // robots.txt, sitemap.xml, icon.svg …
          !pages.has(r)
      )
      .sort();
  } catch {
    /* manifest unreadable — the report simply says nothing rather than guessing */
  }
}

const ERR = [];
const WARN = [];
const err = (rule, route, detail) => ERR.push({ rule, route, detail });
const warn = (rule, route, detail) => WARN.push({ rule, route, detail });

const seenTitles = new Map();
for (const p of pages.values()) {
  const { route } = p;
  if (route === '/_not-found') continue;
  const hub = HUBS.has(route);
  const util = UTILITY.has(route) || p.noindex;

  if (!p.title) err('title-missing', route, '');
  else if (p.title.length > TITLE_MAX) err('title-too-long', route, `${p.title.length} chars — ${p.title}`);
  if (p.title) {
    if (seenTitles.has(p.title)) err('title-duplicate', route, `same as ${seenTitles.get(p.title)}`);
    else seenTitles.set(p.title, route);
  }

  if (!p.desc) err('desc-missing', route, '');
  else if (p.desc.length > DESC_MAX) err('desc-too-long', route, `${p.desc.length} chars`);
  else if (p.desc.length < DESC_MIN && !p.noindex)
    warn('desc-short', route, `${p.desc.length} chars`);

  if (!p.noindex) {
    if (inbound.get(route) === 0 && !hub && route !== '/')
      err('no-inbound-links', route, 'nothing links to it from page content');
    else if (inbound.get(route) <= 2 && !hub && route !== '/')
      warn('weak-inbound', route, `${inbound.get(route)} in-body inbound`);
  }

  if (!p.crumbs && route !== '/') err('no-breadcrumbs', route, '');

  if (!hub && !util && !IS_JOB(route)) {
    if (p.words < THIN_WORDS) warn('thin', route, `${p.words} words`);
    if (p.imgs === 0) warn('no-image', route, '');
  }
  if (p.imgsNoAlt > 0) err('img-no-alt', route, `${p.imgsNoAlt} <img> without alt`);

  if (CLINICAL(route)) {
    if (!p.medical) warn('no-medicalwebpage', route, '');
    if (!p.reviewed) warn('no-lastreviewed', route, '');
    if (!p.speakable) warn('no-speakable', route, '');
  }
  /* These two span several session types at different prices, so any single
     figure would misrepresent them. Showing no price is the correct
     behaviour, so the gate must not nag about it. */
  const UMBRELLA = ['/services/online-counselling-bc', '/services/south-asian-mental-health'];
  if (route.startsWith('/services/') && !p.price && !UMBRELLA.includes(route))
    warn('no-price-schema', route, '');
  if ((route.startsWith('/punjabi') || route === '/punjabi') && !p.lang)
    warn('no-inlanguage', route, 'Punjabi page with no language annotation');
}

const byRule = (list) => {
  const m = new Map();
  for (const x of list) m.set(x.rule, [...(m.get(x.rule) || []), x]);
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
};

if (AS_JSON) {
  console.log(JSON.stringify({ pages: pages.size, errors: ERR, warnings: WARN }, null, 2));
} else {
  console.log(`\nSEO gate — ${pages.size} prerendered pages\n${'='.repeat(46)}`);
  for (const [rule, xs] of byRule(ERR)) {
    console.log(`\nERROR  ${rule}  (${xs.length})`);
    for (const x of xs.slice(0, 12)) console.log(`   ${x.route}${x.detail ? '  — ' + x.detail : ''}`);
    if (xs.length > 12) console.log(`   …and ${xs.length - 12} more`);
  }
  for (const [rule, xs] of byRule(WARN)) {
    console.log(`\nwarn   ${rule}  (${xs.length})`);
    for (const x of xs.slice(0, 8)) console.log(`   ${x.route}${x.detail ? '  — ' + x.detail : ''}`);
    if (xs.length > 8) console.log(`   …and ${xs.length - 8} more`);
  }
  console.log(`\n${'='.repeat(46)}`);
  if (notPrerendered.length) {
    console.log(
      `not audited (rendered on demand, no static file): ${notPrerendered.join(', ')}\n` +
      `their outgoing links are invisible here, so inbound counts are a floor, not a total`
    );
  }
  console.log(`${ERR.length} error(s), ${WARN.length} warning(s)`);
  if (!ERR.length && !WARN.length) console.log('clean.');
}

process.exit(ERR.length && !WARN_ONLY ? 1 : 0);

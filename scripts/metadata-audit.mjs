#!/usr/bin/env node
/**
 * METADATA COMPLETENESS - what a link to this site looks like somewhere else.
 *
 * WHY THIS EXISTS
 *
 * seo-audit.mjs checks the fields that decide a search result: title, meta
 * description, canonical, schema. Nothing checked the fields that decide what
 * a link looks like when it is PASTED somewhere - iMessage, WhatsApp, Slack,
 * Facebook, LinkedIn, a Discord channel, an AI assistant summarising a URL.
 *
 * That is not a small surface for this practice. The referral page exists to
 * be forwarded. The city pages are written to be sent between family members.
 * The Punjabi pages are shared in WhatsApp groups, which is the single most
 * likely place a link to this site is passed hand to hand, and WhatsApp
 * renders og:title, og:description and og:image and nothing else.
 *
 * The quality sweep already flags a missing og:image, because an absent image
 * is visible. These are the failures that are not:
 *
 *   og:title / og:description missing   the unfurl falls back to the URL
 *   og:type / og:locale missing         cards render, less predictably
 *   twitter:card missing                LinkedIn and X fall back to a thumbnail
 *   canonical not absolute / not self   two of the three consumers of a
 *                                       canonical ignore a relative one
 *   og:url disagreeing with canonical   the two say different things about
 *                                       which URL is the real one
 *
 * Reported, not enforced.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILT = join(process.cwd(), '.next', 'server', 'app');
if (!existsSync(BUILT)) {
  console.error('No build. Run `npm run build` first.');
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!e.endsWith('.html')) continue;
    let route = '/' + relative(BUILT, p).split(/[\\/]/).join('/').replace(/\.html$/, '');
    if (route === '/index') route = '/';
    pages.push({ route, html: readFileSync(p, 'utf8') });
  }
})(BUILT);

/* Gated provinces render the 404 shell on purpose - same exemption every other
   instrument here makes, and for the same reason. */
const isGated = (r) => ['/alberta', '/ontario'].some((g) => r === g || r.startsWith(g + '/'));

const F = {};
const add = (k, route, detail = '') => (F[k] ||= []).push(detail ? `${route} - ${detail}` : route);

const meta = (head, prop) => {
  const m =
    head.match(new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]*)"`, 'i')) ||
    head.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${prop}"`, 'i')) ||
    head.match(new RegExp(`<meta[^>]+name="${prop}"[^>]+content="([^"]*)"`, 'i')) ||
    head.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${prop}"`, 'i'));
  return m ? m[1] : null;
};

let checked = 0;
for (const { route, html } of pages) {
  if (isGated(route)) continue;
  checked++;
  const head = html.slice(0, html.indexOf('</head>') + 7);

  const ogTitle = meta(head, 'og:title');
  const ogDesc = meta(head, 'og:description');
  const ogType = meta(head, 'og:type');
  const ogUrl = meta(head, 'og:url');
  const ogLocale = meta(head, 'og:locale');
  const twCard = meta(head, 'twitter:card');
  const canonical = (head.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i) || [, null])[1];

  if (!ogTitle) add('no-og-title', route);
  if (!ogDesc) add('no-og-description', route);
  if (!ogType) add('no-og-type', route);
  if (!ogLocale) add('no-og-locale', route);
  if (!twCard) add('no-twitter-card', route);

  /* A noindex page correctly has no canonical. /_not-found had one until
     30 August 2026 and it pointed at the homepage, inherited from the root
     metadata - every 404 URL on the site declaring that it was really /.
     Removing it is the fix, so this check must not then report the fix as
     the defect. */
  const noindex = /<meta name="robots"[^>]+content="[^"]*noindex/i.test(head);
  if (!canonical) {
    if (!noindex) add('no-canonical', route);
  } else {
    if (!/^https?:\/\//i.test(canonical)) add('canonical-relative', route, canonical);
    else {
      const path = canonical.replace(/^https?:\/\/[^/]+/, '') || '/';
      if (path.replace(/\/$/, '') !== route.replace(/\/$/, '') && route !== '/') {
        add('canonical-not-self', route, `points at ${path}`);
      }
    }
  }

  if (ogUrl && canonical && ogUrl.replace(/\/$/, '') !== canonical.replace(/\/$/, '')) {
    add('ogurl-vs-canonical', route, `og:url ${ogUrl}`);
  }

  /* An unfurl truncates hard. These are not errors - a long description still
     renders - but a description written to be cut is better than one cut. */
  if (ogDesc && ogDesc.length > 200) add('og-description-long', route, `${ogDesc.length} chars`);
  if (ogTitle && ogTitle.length > 70) add('og-title-long', route, `${ogTitle.length} chars`);
}

const LABEL = {
  'no-og-title': 'No og:title - the unfurl falls back to the URL',
  'no-og-description': 'No og:description - the card renders with no sentence',
  'no-og-type': 'No og:type',
  'no-og-locale': 'No og:locale',
  'no-twitter-card': 'No twitter:card - X and LinkedIn fall back to a thumbnail',
  'no-canonical': 'No canonical link',
  'canonical-relative': 'Canonical is relative, not absolute',
  'canonical-not-self': 'Canonical points at another page',
  'ogurl-vs-canonical': 'og:url and canonical disagree',
  'og-description-long': 'og:description will be truncated in most unfurls',
  'og-title-long': 'og:title will be truncated in most unfurls',
};

console.log(`\nMETADATA COMPLETENESS - ${checked} pages (${pages.length - checked} gated, skipped)\n`);

const LIMIT = process.argv.includes('--all') ? 500 : 6;
const keys = Object.keys(F).sort((a, b) => F[b].length - F[a].length);
if (!keys.length) {
  console.log('  Every page carries a complete, self-consistent set of link metadata.\n');
} else {
  for (const k of keys) {
    console.log(`  ${String(F[k].length).padStart(3)}  ${LABEL[k] || k}`);
    for (const line of F[k].slice(0, LIMIT)) console.log(`        ${line}`);
    if (F[k].length > LIMIT) console.log(`        ...and ${F[k].length - LIMIT} more`);
    console.log();
  }
}

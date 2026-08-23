#!/usr/bin/env node
/**
 * QUALITY SWEEP — the things the SEO gate does not look at.
 *
 * seo-audit.mjs checks titles, descriptions, schema and inbound links. This
 * checks the rest of what makes a page good: accessibility, heading structure,
 * link text, duplicate metadata, dead ends, and citation rot.
 *
 * Reads the built HTML, <main> only where it matters, for the same reason
 * everything else here does: nav and footer are on all 120 pages, so counting
 * them makes every page look identical.
 *
 * Findings are reported, not enforced. This is a sweep, not a gate — a build
 * should not fail because one image has a thin alt attribute.
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
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) {
      let url = '/' + relative(BUILT, p).replace(/\\/g, '/').replace(/\.html$/, '');
      if (url === '/index') url = '/';
      pages.push({ url, html: readFileSync(p, 'utf8') });
    }
  }
})(BUILT);

const strip = (h) => h.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
const mainOf = (h) => (strip(h).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
const text = (f) => f.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const F = {};
const add = (k, url, detail = '') => (F[k] ||= []).push(detail ? `${url} — ${detail}` : url);

const titles = new Map(), descs = new Map();
const VAGUE = /^(click here|here|read more|learn more|more|this|link|see more)\.?$/i;

for (const { url, html } of pages) {
  const body = mainOf(html);
  const head = html.slice(0, html.indexOf('</head>') + 7);

  /* ---- metadata uniqueness -------------------------------------------- */
  const t = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1];
  const d = (html.match(/<meta name="description" content="([\s\S]*?)"/i) || [, ''])[1];
  if (t) (titles.get(t) ? titles.get(t) : titles.set(t, []).get(t)).push(url);
  if (d) (descs.get(d) ? descs.get(d) : descs.set(d, []).get(d)).push(url);

  /* ---- headings -------------------------------------------------------- */
  const hs = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: +m[1], text: text(m[2]) }));
  const h1s = hs.filter((h) => h.level === 1);
  if (h1s.length === 0) add('no-h1', url);
  if (h1s.length > 1) add('multiple-h1', url, `${h1s.length}`);
  for (let i = 1; i < hs.length; i++) {
    if (hs[i].level - hs[i - 1].level > 1) {
      add('heading-jump', url, `h${hs[i - 1].level} → h${hs[i].level} at "${hs[i].text.slice(0, 40)}"`);
      break;
    }
  }
  const empty = hs.filter((h) => !h.text);
  if (empty.length) add('empty-heading', url, `${empty.length}`);

  /* ---- images ---------------------------------------------------------- */
  for (const m of body.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = m[1];
    if (!/\balt=/.test(attrs)) add('img-no-alt', url, attrs.slice(0, 70));
    else {
      const alt = (attrs.match(/alt="([^"]*)"/) || [, ''])[1];
      if (alt && alt.length < 8 && !/^(|\s)$/.test(alt)) add('img-thin-alt', url, `alt="${alt}"`);
    }
    if (!/\b(width|height)=/.test(attrs) && !/\bstyle="[^"]*aspect/.test(attrs)) {
      add('img-no-dimensions', url, attrs.slice(0, 60));
    }
  }

  /* ---- links ----------------------------------------------------------- */
  const anchors = [...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  for (const a of anchors) {
    const attrs = a[1], label = text(a[2]);
    const href = (attrs.match(/href="([^"]*)"/) || [, ''])[1];
    if (!label && !/aria-label=/.test(attrs)) add('link-no-text', url, href);
    else if (VAGUE.test(label)) add('link-vague-text', url, `"${label}" → ${href}`);
    if (/^https?:\/\//.test(href) && /target="_blank"/.test(attrs) && !/rel="[^"]*noopener/.test(attrs)) {
      add('link-blank-no-noopener', url, href);
    }
  }
  const internalOut = new Set(
    anchors.map((a) => (a[1].match(/href="(\/[^"#?]*)"/) || [, ''])[1]).filter(Boolean)
  );
  internalOut.delete(url);
  if (internalOut.size === 0) add('dead-end', url, 'no in-body links out');

  /* ---- forms ----------------------------------------------------------- */
  for (const m of body.matchAll(/<(input|textarea|select)\b([^>]*)>/gi)) {
    const attrs = m[2];
    if (/type="(hidden|submit|button)"/.test(attrs)) continue;
    const id = (attrs.match(/id="([^"]*)"/) || [, ''])[1];
    const labelled = id && new RegExp(`<label[^>]*for="${id}"`).test(body);
    if (!labelled && !/aria-label(ledby)?=/.test(attrs)) {
      add('input-no-label', url, attrs.slice(0, 60));
    }
  }

  /* ---- head hygiene ---------------------------------------------------- */
  if (!/rel="canonical"/.test(head)) add('no-canonical', url);
  if (!/property="og:image"/.test(head)) add('no-og-image', url);
  if (!/<html[^>]+lang=/.test(html)) add('no-lang', url);

  /* ---- substance ------------------------------------------------------- */
  const words = text(body).split(/\s+/).filter(Boolean).length;
  if (words < 250) add('very-thin', url, `${words} words`);
}

for (const [t, urls] of titles) if (urls.length > 1) add('duplicate-title', urls.join(', '), `"${t.slice(0, 50)}"`);
for (const [d, urls] of descs) if (urls.length > 1) add('duplicate-description', urls.join(', '), `"${d.slice(0, 45)}"`);

/* ---- external citations, for the rot check that follows ---------------- */
const externals = new Set();
for (const { html } of pages) {
  for (const m of mainOf(html).matchAll(/href="(https?:\/\/[^"]+)"/g)) externals.add(m[1]);
}

const LABEL = {
  'no-h1': 'Page has no H1',
  'multiple-h1': 'More than one H1',
  'heading-jump': 'Heading level skipped (screen-reader navigation breaks)',
  'empty-heading': 'Heading with no text',
  'img-no-alt': 'Image with no alt attribute',
  'img-thin-alt': 'Image with a very short alt',
  'img-no-dimensions': 'Image without width/height (causes layout shift)',
  'link-no-text': 'Link with no accessible text',
  'link-vague-text': 'Link text that says nothing out of context',
  'link-blank-no-noopener': 'target=_blank without rel=noopener',
  'dead-end': 'Page with no in-body links out',
  'input-no-label': 'Form field with no label',
  'no-canonical': 'No canonical URL',
  'no-og-image': 'No Open Graph image',
  'no-lang': 'No lang attribute',
  'very-thin': 'Under 250 words',
  'duplicate-title': 'Two pages share a title',
  'duplicate-description': 'Two pages share a description',
};

console.log(`\nQUALITY SWEEP — ${pages.length} built pages, ${externals.size} distinct external citations\n`);
const keys = Object.keys(F).sort((a, b) => F[b].length - F[a].length);
if (!keys.length) console.log('  Nothing found.\n');
for (const k of keys) {
  console.log(`${String(F[k].length).padStart(4)}  ${LABEL[k] || k}`);
  for (const d of F[k].slice(0, 6)) console.log(`        ${d}`);
  if (F[k].length > 6) console.log(`        …and ${F[k].length - 6} more`);
  console.log();
}

if (process.argv.includes('--links')) {
  console.log('EXTERNAL CITATIONS (for the rot check)\n');
  for (const u of [...externals].sort()) console.log('  ' + u);
}

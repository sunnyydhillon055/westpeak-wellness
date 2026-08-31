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

/* GATED PROVINCES ARE NOT PAGES — 2026-08-30.
 *
 * /alberta and /ontario build a shell that renders the 404 boundary on
 * purpose: the province is not open, and expansion-verify.mjs passes only
 * while they stay that way. Their build artefacts are therefore empty of
 * content by design, and this sweep was reading them as ordinary pages —
 * scoring them for a missing H1, a missing lang attribute, zero words, no
 * links out, and a title and description duplicated off the 404 shell.
 *
 * That is eight findings, none of them a defect, and between them they
 * accounted for every entry in five of this sweep's categories. A category
 * whose only members are false positives reads as a solved category, which
 * is worse than a noisy one.
 *
 * seo-audit.mjs has skipped these routes since the gate was written
 * (see its comment at the `/ontario` check); this file never learned.
 */
const GATED = ['/alberta', '/ontario'];
const isGated = (u) => GATED.some((g) => u === g || u.startsWith(g + '/'));
const gatedSkipped = pages.filter((p) => isGated(p.url)).length;

const strip = (h) => h.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
const mainOf = (h) => (strip(h).match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, ''])[1];
const text = (f) => f.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const F = {};
const add = (k, url, detail = '') => (F[k] ||= []).push(detail ? `${url} — ${detail}` : url);

const titles = new Map(), descs = new Map();
const VAGUE = /^(click here|here|read more|learn more|more|this|link|see more)\.?$/i;

for (const { url, html } of pages) {
  if (isGated(url)) continue;
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
    /* FILL-LAYOUT IMAGES ARE NOT UNDIMENSIONED — 2026-08-30.
     *
     * This flagged the two photographs on / and /online-counselling as
     * layout-shift risks. Both are <Image fill> inside components/ui/Photo,
     * and a fill image never carries width/height by design — Next marks it
     * data-nimg="fill" and sizes it to its parent, and the box is reserved by the
     * aspect-ratio on the .photo--wide / .photo--tall wrapper
     * (app/premium.css:171-173).
     *
     * The box IS reserved before the file arrives, which is the thing this
     * check exists to verify; it was reading for one particular spelling of
     * the answer. Accept the fill signature too, and keep flagging any <img>
     * that genuinely leaves its height to the bytes.
     */
    const filled = /data-nimg="fill"/.test(attrs);
    if (!/\b(width|height)=/.test(attrs) && !/\bstyle="[^"]*aspect/.test(attrs) && !filled) {
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
    const explicit = id && new RegExp(`<label[^>]*for="${id}"`).test(body);
    /* IMPLICIT LABELS COUNT — 2026-08-30.
     *
     * This test knew only the explicit form, `<label for=id>`, and reported
     * 33 pages carrying "a form field with no label". Every one of them was
     * the monthly-email consent box in components/LeadCapture.tsx, which is
     * written as
     *
     *     <label class="lead-form-check"><input type="checkbox" …><span>…
     *
     * An input nested inside its own label is associated with it under the
     * HTML standard, exposed correctly by every screen reader, and needs no
     * id at all. The markup was already right; the instrument was wrong, and
     * it was wrong loudly enough to be the largest accessibility number this
     * sweep printed.
     *
     * Detected by span rather than by parser: take the slice of the document
     * before the field, and if the nearest preceding <label> has not been
     * closed by then, the field is inside it.
     */
    const before = body.slice(0, m.index);
    const lastOpen = before.lastIndexOf('<label');
    const implicit = lastOpen !== -1 && !before.slice(lastOpen).includes('</label>');
    if (!explicit && !implicit && !/aria-label(ledby)?=/.test(attrs)) {
      add('input-no-label', url, attrs.slice(0, 60));
    }
  }

  /* ---- head hygiene ---------------------------------------------------- */
  /* A noindex page correctly has no canonical, and /_not-found had one until
     30 August 2026: inherited from the root metadata and pointing at the
     homepage, so every 404 URL on the site declared it was really /. Removing
     it is the fix; this check must not then report the fix as the defect.
     Same exemption metadata-audit.mjs makes. */
  const noindex = /<meta name="robots"[^>]+content="[^"]*noindex/i.test(head);
  if (!/rel="canonical"/.test(head) && !noindex) add('no-canonical', url);
  if (!/property="og:image"/.test(head)) add('no-og-image', url);
  if (!/<html[^>]+lang=/.test(html)) add('no-lang', url);

  /* ---- substance ------------------------------------------------------- */
  const words = text(body).split(/\s+/).filter(Boolean).length;
  /* /_not-found is the 404 boundary, and the two /sent routes are
     confirmations. A 404 padded to 250 words to satisfy a thin-content rule
     would be a worse 404, and a confirmation page that kept talking after the
     action was taken would be a worse confirmation. Exempt rather than fixed,
     for the same reason cta-audit.mjs exempts the same routes. */
  const SHORT_BY_DESIGN = ['/_not-found', '/punjabi/sent', '/message-sent'];
  if (words < 250 && !SHORT_BY_DESIGN.includes(url)) add('very-thin', url, `${words} words`);
}

for (const [t, urls] of titles) if (urls.length > 1) add('duplicate-title', urls.join(', '), `"${t.slice(0, 50)}"`);
for (const [d, urls] of descs) if (urls.length > 1) add('duplicate-description', urls.join(', '), `"${d.slice(0, 45)}"`);

/* ---- external citations, for the rot check that follows ---------------- */
const externals = new Set();
for (const { url, html } of pages) {
  if (isGated(url)) continue;
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
if (keys.length) {
  console.log('  Content-quality findings above. Fix them, or record why not.');
  console.log('');
  process.exit(1);
}

#!/usr/bin/env node
/**
 * ACCESSIBILITY — the parts a machine can actually decide.
 *
 * WHAT THIS IS NOT. It is not a screen-reader pass and it does not replace
 * one. Whether a page makes sense when heard is a judgement, and no script
 * makes it. What a script can do is find the mechanical failures that make a
 * page unusable before judgement even comes into it — an unlabelled field, a
 * skip link pointing at nothing, a heading level jumped, an image with no text
 * alternative. Those are cheap to introduce, invisible when you can see the
 * screen, and total when you cannot.
 *
 * ON THIS SITE SPECIFICALLY. The audience includes people in distress, people
 * reading in a second language, and people whose reason for being here is
 * itself a barrier to concentration. Every one of those makes badly marked-up
 * pages harder in a way they would not be on a shop.
 *
 * FALSE POSITIVES WERE THE FIRST ATTEMPT'S PROBLEM. A hand-rolled check
 * reported 33 unlabelled controls; every one was a control wrapped in its own
 * label, which is valid and common. A gate that cries wolf gets switched off,
 * so each rule here understands the legitimate alternatives: three ways to
 * label a control, two ways to name an image.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const APP = '.next/server/app';
if (!existsSync(APP)) {
  console.error('\nNo build to inspect — run `npm run build` first.\n');
  process.exit(2);
}

const walk = (d) => readdirSync(d).flatMap((e) => {
  const p = join(d, e);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

const problems = [];
const add = (route, rule, detail) => problems.push({ route, rule, detail });

/* The RSC payload is JSON-encoded React sitting inside script tags. It
   contains every attribute name in the page and would match almost any regex
   asked of it, so it is removed before anything else looks at the document. */
const stripScripts = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ');

const files = walk(APP);
const shells = [];

for (const f of files) {
  /* Normalise the separators BEFORE stripping the prefix. On Windows the
     walked path uses backslashes and APP does not, so stripping first leaves
     the whole path in the report. */
  const route = f.split('\\').join('/').replace(APP, '').replace(/\.html$/, '') || '/';
  const raw = readFileSync(f, 'utf8');

  /* NOT A PAGE. A route whose prerender called notFound() leaves the
     framework's own error shell in the build output — id="__next_error__", no
     lang, no landmarks, no text at all. Judging it as a page produces a
     failure for something no visitor is served: /alberta and /ontario are
     rewritten by middleware to the real 404 before routing, which was verified
     by request rather than assumed.

     Skipped, and COUNTED OUT LOUD below rather than dropped quietly. A gate
     that silently ignores a category of document stops covering it the day
     that category comes to mean something else. */
  if (/<html[^>]*id="__next_error__"/i.test(raw)) { shells.push(route); continue; }

  const html = stripScripts(raw);
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0];

  /* ---- the document itself ------------------------------------------- */

  if (!/<html[^>]*\blang\s*=\s*["'][a-z]/i.test(html)) {
    add(route, 'lang', 'the html element declares no language, so a screen reader guesses the pronunciation');
  }

  const h1s = (main.match(/<h1\b/gi) || []).length;
  if (main && h1s === 0) add(route, 'h1', 'no h1 inside main — nothing names the page');
  if (h1s > 1) add(route, 'h1', h1s + ' h1 elements — the page claims several titles');

  const mains = (html.match(/<main\b/gi) || []).length;
  if (mains > 1) add(route, 'landmark', mains + ' main landmarks');

  /* ---- the skip link, and whether it goes anywhere -------------------- */

  const skip = html.match(/<a[^>]*class="[^"]*skip-link[^"]*"[^>]*href="#([^"]+)"/i);
  if (!skip) {
    add(route, 'skip-link', 'no skip link — a keyboard user walks the whole header on every page');
  } else if (!new RegExp('id=["\']' + skip[1] + '["\']', 'i').test(html)) {
    add(route, 'skip-link', 'skip link points at #' + skip[1] + ', which does not exist on this page');
  }

  /* ---- form controls -------------------------------------------------- */

  /* Remove whole label blocks first. Anything still standing was not wrapped,
     so only for= or aria-label can be naming it. */
  const outside = main.replace(/<label\b[\s\S]*?<\/label>/gi, ' ');
  for (const inp of outside.match(/<(input|select|textarea)\b[^>]*>/gi) || []) {
    if (/type\s*=\s*["'](hidden|submit|button|image|reset)["']/i.test(inp)) continue;
    if (/aria-label(ledby)?\s*=/.test(inp)) continue;
    const id = (inp.match(/\bid\s*=\s*["']([^"']+)["']/) || [])[1];
    const esc = id && id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (esc && new RegExp('<label[^>]*for=["\']' + esc + '["\']', 'i').test(main)) continue;
    add(route, 'label', 'a control with no accessible name: ' + inp.slice(0, 90));
  }

  /* ---- images --------------------------------------------------------- */

  for (const img of main.match(/<img\b[^>]*>/gi) || []) {
    /* alt="" is correct for decoration and must not be flagged. A MISSING alt
       is the failure: the screen reader then reads the filename. */
    if (!/\balt\s*=/.test(img)) {
      add(route, 'alt', 'an image with no alt attribute at all: ' + img.slice(0, 90));
    }
  }

  /* ---- keyboard order ------------------------------------------------- */

  /* A positive tabindex moves an element ahead of everything with 0, which
     reorders the page for a keyboard user and never matches what they see. */
  for (const m of html.match(/tabindex\s*=\s*["'][1-9]\d*["']/gi) || []) {
    add(route, 'tabindex', m + ' — a positive tabindex reorders the whole page');
  }

  /* A link or button removed from the tab order is unreachable by keyboard
     while still clickable by mouse. */
  for (const m of html.match(/<(a|button)\b[^>]*tabindex\s*=\s*["']-1["'][^>]*>/gi) || []) {
    add(route, 'tabindex', 'out of the tab order but still clickable: ' + m.slice(0, 90));
  }

  /* ---- headings ------------------------------------------------------- */

  const levels = [...main.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      add(route, 'heading-order',
        'h' + levels[i - 1] + ' is followed by h' + levels[i] +
        ' — a level is skipped, so the outline has a hole');
      break; /* one report per page; the first is enough to go and look */
    }
  }
}

/* ---- focus styles are a stylesheet question, asked once ---------------- */

const css = ['app/globals.css', 'app/premium.css']
  .filter(existsSync).map((p) => readFileSync(p, 'utf8')).join('\n');

for (const el of ['a', 'button', 'input', 'select', 'textarea', 'summary']) {
  const covered = new RegExp('(^|[,\\s{}(])' + el + '[^{,]*:focus-visible', 'm').test(css);
  if (!covered) {
    add('(stylesheet)', 'focus',
      el + ' has no :focus-visible rule anywhere, so a keyboard user cannot see where they are');
  }
}

/* ---- report ------------------------------------------------------------ */

console.log('\nACCESSIBILITY - ' + (files.length - shells.length) + ' pages\n');

if (shells.length) {
  console.log('  ' + shells.length + ' route(s) prerendered to the framework error shell, not judged as pages');
  console.log('      ' + shells.join(', '));
  console.log('      Each must be unreachable or rewritten before routing. Check by request, not by build output.\n');
}

if (!problems.length) {
  console.log('  No mechanical accessibility failures.\n');
  console.log('  This says nothing about whether the pages make sense when heard.\n');
  process.exit(0);
}

const byRule = {};
for (const p of problems) (byRule[p.rule] ||= []).push(p);
for (const [rule, list] of Object.entries(byRule)) {
  console.log('  ' + String(list.length).padStart(4) + '  ' + rule.toUpperCase());
  const seen = new Set();
  for (const p of list) {
    if (seen.has(p.detail)) continue;
    if (seen.size >= 3) continue;
    seen.add(p.detail);
    console.log('        ' + p.detail);
    console.log('            e.g. ' + p.route);
  }
  if (list.length > seen.size) console.log('        ...and ' + (list.length - seen.size) + ' more');
  console.log('');
}
process.exit(1);

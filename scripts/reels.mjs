#!/usr/bin/env node
/* Builds REELS_SCRIPTS.md — short-video scripts from content that already
 * exists, for the same reason SOCIAL_QUEUE.md reuses shortAnswers: every
 * sentence here was already written to stand alone and already written
 * under BCACC constraints. Nothing is composed fresh in a script that has
 * no clinical review.
 *
 *   npm run reels          → 20 scripts, Punjabi-relevant surfaces first
 *
 * Each script is three beats for a 30–60s face-to-camera or text-on-screen
 * video: HOOK (the page title as the question it answers), BODY (the
 * shortAnswer, broken at sentence boundaries into readable beats), CLOSE
 * (the page URL — a link, never a call to book; hard CTAs read badly in
 * this field and perform worse). */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const libDir = new URL('../lib/', import.meta.url);
const SOURCES = [
  { match: /^guides(-more\d*)?\.ts$/, base: '/guides' },
  { match: /^resources(-more)?\.ts$/, base: '/resources' },
  { match: /^comparisons(-more\d*)?\.ts$/, base: '/compare' },
  { match: /^audiences(-more\d*|-punjabi)?\.ts$/, base: '/for' },
];

function extract(src, base) {
  const out = [];
  const re = /slug:\s*["']([a-z0-9-]+)["'][\s\S]{0,4000}?title:\s*(["])((?:\\.|(?!\2).)*)\2[\s\S]{0,4000}?shortAnswer:\s*(["'])((?:\\.|(?!\4).)*)\4/g;
  const re2 = /slug:\s*["']([a-z0-9-]+)["'][\s\S]{0,4000}?title:\s*(['])((?:\\.|(?!\2).)*)\2[\s\S]{0,4000}?shortAnswer:\s*(["'])((?:\\.|(?!\4).)*)\4/g;
  for (const rx of [re, re2]) {
    let m;
    while ((m = rx.exec(src)) !== null) {
      const un = (s) => s.replace(/\\(['"])/g, '$1').replace(/\\n/g, ' ').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      out.push({ url: `${base}/${m[1]}`, title: un(m[3]), body: un(m[5]) });
    }
  }
  return out;
}

let items = [];
for (const f of readdirSync(libDir)) {
  const s = SOURCES.find((x) => x.match.test(f));
  if (s) items.push(...extract(readFileSync(new URL(f, libDir), 'utf8'), s.base));
}
const seen = new Set();
items = items.filter((i) => !seen.has(i.url) && seen.add(i.url));
items.sort((a, b) => Number(/punjabi|south-asian/.test(b.url)) - Number(/punjabi|south-asian/.test(a.url)));

const beats = (text) => {
  /* Sentence-boundary split, then greedy-pack into on-screen beats of
   * comfortable reading length. */
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const packed = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + s).length > 220 && cur) { packed.push(cur.trim()); cur = s; }
    else cur += s;
  }
  if (cur.trim()) packed.push(cur.trim());
  return packed.slice(0, 4);
};

const SITE = 'https://www.westpeakwellness.com';
const lines = [
  '# Reels / Shorts scripts',
  '',
  `**Generated ${'DATE'} · 20 scripts · regenerate with \`npm run reels\`**`,
  '',
  'Every word below is reused from published shortAnswers — already BCACC-compliant,',
  'already written to stand alone. The posting rules from SOCIAL_QUEUE.md apply in',
  'full, plus two video-specific ones: never film anything implying a client exists',
  '(no "session ending" b-roll), and hide any comment that names a presenting concern.',
  '',
  '---',
  '',
];
for (const [n, it] of items.slice(0, 20).entries()) {
  lines.push(`## ${n + 1}. ${it.title}`, '', `**HOOK (on screen, 2s):** ${it.title}`, '');
  beats(it.body).forEach((b, i) => lines.push(`**BEAT ${i + 1}:** ${b}`, ''));
  lines.push(`**CLOSE (on screen):** ${SITE}${it.url}`, '', '---', '');
}
writeFileSync(new URL('../REELS_SCRIPTS.md', import.meta.url), lines.join('\n'));
console.log(`  REELS_SCRIPTS.md written — ${Math.min(20, items.length)} scripts from ${items.length} available`);

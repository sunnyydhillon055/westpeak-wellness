#!/usr/bin/env node
/**
 * DOES THIS READ LIKE A PERSON WROTE IT?
 *
 * The tells are specific and countable. This finds them in COPY ONLY — the
 * strings a reader sees — and never in comments, because a comment explaining
 * a decision to the next developer is allowed to sound like whatever it likes
 * and rewriting three thousand of them would be churn with no reader on the
 * other end of it.
 *
 * THE EM DASH IS THE LOUDEST ONE. Used once it is a fine piece of punctuation.
 * Used in every third sentence it is the single most recognisable signature of
 * machine-written prose, and this site had it at that density. A person writing
 * quickly reaches for a comma, a colon, or a full stop.
 *
 * The rest are constructions rather than characters: "not just X but Y", "it's
 * not about X, it's about Y", "the point is", "which is the whole point",
 * openings that announce themselves. Each is fine once. Each becomes a tic at
 * volume, and a reader who cannot name what is wrong still hears it.
 *
 *   node scripts/voice-audit.mjs           report
 *   node scripts/voice-audit.mjs --dashes  only the dash count, per file
 */

import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync(['lib/*.ts', 'components/*.tsx', 'app/**/*.tsx']);

/**
 * Strip comments so only string literals remain in play.
 *
 * Done character by character rather than with a regex, because a regex that
 * removes block comments will happily eat an apostrophe-bearing sentence that
 * contains the characters slash-star, and a regex that removes strings gets
 * lost on the first escaped quote. The state machine is longer and correct.
 */
function copyOnly(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  let line = 1;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '\n') { line++; i++; continue; }
    if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      i += 2; continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      const startLine = line;
      i++;
      let buf = '';
      while (i < n && src[i] !== quote) {
        if (src[i] === '\\') { buf += src[i + 1] ?? ''; i += 2; continue; }
        if (src[i] === '\n') line++;
        buf += src[i];
        i++;
      }
      i++;
      if (buf.length > 12) out.push({ line: startLine, text: buf });
      continue;
    }
    i++;
  }
  return out;
}

/* A construction is only a tell at volume, so each carries a note on what it
   usually wants to become rather than a bare flag. */
const TELLS = [
  { id: 'em-dash', re: /—|&mdash;/g,
    fix: 'a comma, a colon, or a full stop' },
  { id: 'not-just', re: /\b(not just|isn't just|is not just|more than just)\b/gi,
    fix: 'say the thing you mean, without the contrast' },
  { id: 'not-x-but-y', re: /\bit's not (about )?[^.,;]{2,30}, it's\b/gi,
    fix: 'drop the first half' },
  { id: 'the-point', re: /\b(which is|that's) (the|exactly the) (whole )?point\b/gi,
    fix: 'if it is the point, it does not need announcing' },
  { id: 'here-s-the', re: /\bhere's (the|what|why|how)\b/gi,
    fix: 'start with the thing itself' },
  { id: 'in-today', re: /\bin today's\b|\bin this day and age\b|\bin our modern\b/gi,
    fix: 'cut it' },
  { id: 'delve-etc', re: /\b(delve|leverage|robust|seamless|myriad|plethora|navigate the|tapestry|landscape of)\b/gi,
    fix: 'a plainer word' },
  { id: 'crucial-vital', re: /\b(crucial|vital|essential|paramount|pivotal)\b/gi,
    fix: 'usually "important", or nothing' },
  { id: 'journey', re: /\b(your journey|healing journey|journey towards|journey toward)\b/gi,
    fix: 'the specific thing that happens' },
  { id: 'empower', re: /\b(empower|unlock|transform your|elevate your|holistic)\b/gi,
    fix: 'say what changes' },
  { id: 'triple', re: /\b\w+, \w+,? and \w+ (alike|together|all at once)\b/gi,
    fix: 'a list of three that exists to be a list of three' },
];

const ONLY_DASHES = process.argv.includes('--dashes');

const perFile = [];
let grand = 0;
const totals = {};

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const strings = copyOnly(src);
  const hits = {};
  const samples = [];
  for (const { line, text } of strings) {
    for (const t of TELLS) {
      if (ONLY_DASHES && t.id !== 'em-dash') continue;
      const m = text.match(t.re);
      if (!m) continue;
      hits[t.id] = (hits[t.id] || 0) + m.length;
      totals[t.id] = (totals[t.id] || 0) + m.length;
      if (samples.length < 2 && t.id !== 'em-dash') {
        samples.push(`${t.id}: ${text.slice(0, 100)}`);
      }
    }
  }
  const count = Object.values(hits).reduce((a, b) => a + b, 0);
  if (count) { perFile.push({ f, count, hits, samples }); grand += count; }
}

perFile.sort((a, b) => b.count - a.count);

console.log(`\nVOICE - ${files.length} source files, copy only (comments excluded)\n`);
console.log(`  ${grand} tell(s) in reader-facing text\n`);

for (const [id, n] of Object.entries(totals).sort((a, b) => b[1] - a[1])) {
  const t = TELLS.find((x) => x.id === id);
  console.log(`  ${String(n).padStart(5)}  ${id.padEnd(14)} → ${t.fix}`);
}

console.log('\n  Worst files\n');
for (const p of perFile.slice(0, 15)) {
  console.log(`  ${String(p.count).padStart(5)}  ${p.f}`);
  for (const s of p.samples) console.log(`         ${s}`);
}
console.log('');

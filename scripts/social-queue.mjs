#!/usr/bin/env node
/* Builds a dated posting queue from content that already exists.
 *
 *   npm run social            → 26 weeks, two posts a week
 *   npm run social -- 52 1    → 52 weeks, one a week
 *
 * WHY IT USES shortAnswer AND NOT ARBITRARY PARAGRAPHS
 *
 * The obvious version of "atomise the guides into social posts" chops each
 * article into its best-looking paragraphs. That produces posts that read as
 * excerpts — they open mid-thought, assume the paragraph before them, and end
 * without landing anywhere.
 *
 * Every dated page on this site already carries a `shortAnswer`: one direct
 * statement written specifically to survive being quoted with no page around
 * it. That is the same job a social post does. So the queue is built from the
 * field that was already written to stand alone, and the result is not an
 * excerpt of anything.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 *
 * It does not post. No API keys, no integration to maintain, no scheduler to
 * silently stop working. It writes a file with dates and text, and a person
 * pastes them. For a practice posting twice a week, an integration costs more
 * than it saves and adds a way for the practice's public voice to break
 * without anybody noticing.
 *
 * BCACC. Nothing generated here is a testimonial, an outcome claim, or a
 * statistic. The source sentences were all written under the same constraint,
 * which is the other reason to reuse them rather than write fresh copy in a
 * script that has no clinical review.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const weeks = Number(process.argv[2]) || 26;
const perWeek = Number(process.argv[3]) || 2;

const libDir = new URL('../lib/', import.meta.url);

/* Which collections feed the queue, and the route each lives under. Services
 * use `directAnswer` rather than `shortAnswer` — a difference of naming only,
 * so both are matched. */
const SOURCES = [
  { match: /^guides(-more\d*)?\.ts$/, base: '/guides' },
  { match: /^resources(-more)?\.ts$/, base: '/resources' },
  { match: /^comparisons(-more)?\.ts$/, base: '/compare' },
  { match: /^audiences(-more\d*|-punjabi)?\.ts$/, base: '/for' },
];

/* Flat-field parse, same approach as scripts/targets.mjs and for the same
 * reason: these are TypeScript modules and this runs under plain node. Only
 * three simple fields are read, so a parse is cheaper than a build step. */
function extract(src, base) {
  const out = [];
  const re = /slug:\s*["']([a-z0-9-]+)["'][\s\S]{0,4000}?title:\s*(["'])((?:\\.|(?!\2).)*)\2[\s\S]{0,4000}?shortAnswer:\s*(["'])((?:\\.|(?!\4).)*)\4/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const unescape = (s) => s.replace(/\\(['"])/g, '$1').replace(/\\n/g, ' ');
    out.push({ url: `${base}/${m[1]}`, title: unescape(m[3]), body: unescape(m[5]) });
  }
  return out;
}

let items = [];
for (const f of readdirSync(libDir)) {
  const s = SOURCES.find((x) => x.match.test(f));
  if (!s) continue;
  items.push(...extract(readFileSync(new URL(f, libDir), 'utf8'), s.base));
}

/* Deduplicate by URL, then interleave the collections so a run of six
 * consecutive posts is not six guides. Deterministic — no randomness, so
 * re-running produces the same queue and a re-generated file diffs cleanly. */
const seen = new Set();
items = items.filter((i) => !seen.has(i.url) && seen.add(i.url));

const byBase = new Map();
for (const i of items) {
  const b = i.url.split('/')[1];
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(i);
}
const buckets = [...byBase.values()];
const ordered = [];
for (let n = 0; ordered.length < items.length; n++) {
  for (const b of buckets) if (b[n]) ordered.push(b[n]);
}

/* Dates are computed from a fixed start passed in, or from today. Today is
 * fine here — this file is a working document rather than build output, so a
 * changing date does not invalidate anything. */
const start = new Date();
start.setHours(0, 0, 0, 0);
/* Next Tuesday, then Thursday. Weekday mornings outperform weekends for this
 * audience and it keeps the queue off the days the practice is busiest. */
const DAYS = [2, 4, 1, 3, 5];
const dateFor = (n) => {
  const week = Math.floor(n / perWeek);
  const day = DAYS[n % perWeek] ?? 2;
  const d = new Date(start);
  const delta = (day - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta + week * 7);
  return d.toISOString().slice(0, 10);
};

const total = Math.min(ordered.length, weeks * perWeek);
const SITE = 'https://www.westpeakwellness.com';

const lines = [
  '# Posting queue',
  '',
  `**Generated ${new Date().toISOString().slice(0, 10)} · ${total} posts · ${perWeek} a week**`,
  '',
  'Regenerate with `npm run social`. Nothing here posts itself — this is a file',
  'to paste from, deliberately. See the header of `scripts/social-queue.mjs`.',
  '',
  '## Before posting anything',
  '',
  '- **Never respond to a comment in a way that identifies someone as a client.**',
  '  Not "thanks for coming in", not a like on a comment saying they see you.',
  '  That is a confidentiality breach performed in public, and it is the single',
  '  most common way a practice gets into trouble on social media.',
  '- **Do not solicit or repost testimonials**, including a comment somebody',
  '  volunteers. BCACC prohibits it and volunteering does not change that.',
  '- **Turn off, or immediately hide, comments that name a presenting concern.**',
  '  Somebody commenting "this is exactly my anxiety" has disclosed a health',
  '  condition under their own name because of something the practice posted.',
  '- Every post below ends on a link rather than a call to book. On this subject',
  '  a hard CTA reads badly and performs worse.',
  '',
  '---',
  '',
];

for (let n = 0; n < total; n++) {
  const it = ordered[n];
  lines.push(
    `### ${dateFor(n)} — ${it.title}`,
    '',
    '```',
    it.body,
    '',
    `${SITE}${it.url}`,
    '```',
    ''
  );
}

writeFileSync(new URL('../SOCIAL_QUEUE.md', import.meta.url), lines.join('\n'));
console.log(`  SOCIAL_QUEUE.md written — ${total} posts from ${items.length} available items`);
if (items.length < weeks * perWeek) {
  console.log(`  (${weeks * perWeek} slots requested; the queue is capped by available content)`);
}

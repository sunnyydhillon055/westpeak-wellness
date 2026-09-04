#!/usr/bin/env node
/**
 * Rewrites each hand-typed `updated:` date to the date its own copy last
 * actually changed, taken from git blame.
 *
 * The companion check, scripts/review-dates.mjs, found 95 pages whose visible
 * "Updated" line was older than their own prose. Most were caught by the
 * service consolidation on 1 September, which rewrote links and paragraphs
 * across the content modules without touching the dates beside them.
 *
 * WHY THIS SETS THE REAL DATE AND NOT TODAY. Stamping everything with today
 * would replace one false claim with a bigger one — ninety-five pages all
 * claiming to have been updated this morning. Each gets the date git says its
 * own lines were last written, which is the date the sentence under the word
 * "Updated" is supposed to mean.
 *
 * IT WILL NOT TOUCH A `reviewed:` FIELD, and the guard stays even though none
 * currently exist. "Clinically reviewed" is a claim that a person read the page
 * and stood behind it. No script is entitled to make that claim on their
 * behalf, and a tool that could would be a bad thing to leave lying around.
 *
 *   node scripts/review-dates-fix.mjs --dry    show what would change
 *   node scripts/review-dates-fix.mjs          write it
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const DRY = process.argv.includes('--dry');

/* WHICH DAY A COMMIT BELONGS TO.
 *
 * toISOString() gives the UTC day, and Vancouver is seven or eight hours
 * behind it. A commit made at six in the evening here is already tomorrow in
 * UTC, so the first run of this produced two dates of 2026-09-04 on a day that
 * was still the 3rd for everyone who would read them. A page telling a reader
 * in BC that it was updated tomorrow is a worse error than the stale date it
 * was replacing.
 *
 * The practice is in British Columbia and every other date on this site is
 * shown in its terms, so that is the day used here. */
const vancouverDay = (ms) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(ms));

const git = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
};

if (!git(['rev-parse', '--git-dir'])) {
  console.error('Not a git checkout — the real dates are not available here.');
  process.exit(2);
}

const files = readdirSync('lib')
  .filter((f) => f.endsWith('.ts'))
  .map((f) => `lib/${f}`)
  .filter((f) => existsSync(f) && /updated:\s*["']\d{4}-/.test(readFileSync(f, 'utf8')));

let changed = 0;
let filesTouched = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');

  const blame = git(['blame', '--line-porcelain', '--', file]);
  if (!blame) continue;
  const lineDate = [];
  let pending = null;
  for (const l of blame.split('\n')) {
    if (l.startsWith('author-time ')) pending = Number(l.slice(12)) * 1000;
    else if (l.startsWith('\t')) { lineDate.push(pending); pending = null; }
  }

  const marks = [];
  lines.forEach((l, i) => {
    const m = l.match(/\b(updated|reviewed):\s*(["'])(\d{4}-\d{2}-\d{2})\2/);
    if (m) marks.push({ i, kind: m[1], quote: m[2], date: m[3] });
  });

  let touched = false;
  for (let k = 0; k < marks.length; k++) {
    const { i, kind, quote, date } = marks[k];
    if (kind !== 'updated') continue;  /* see the note at the top */
    const end = k + 1 < marks.length ? marks[k + 1].i : lines.length;

    let newest = 0;
    for (let n = i + 1; n < end; n++) {
      const t = lineDate[n];
      if (t && t > newest) newest = t;
    }
    if (!newest) continue;
    const real = vancouverDay(newest);
    if (real <= date) continue;

    lines[i] = lines[i].replace(
      new RegExp(`(updated:\\s*)${quote}${date}${quote}`),
      `$1${quote}${real}${quote}`
    );
    touched = true;
    changed++;
    if (DRY) console.log(`  ${file}:${i + 1}  ${date} -> ${real}`);
  }

  if (touched && !DRY) {
    writeFileSync(file, lines.join('\n'));
    filesTouched++;
  }
}

console.log(
  DRY
    ? `\n${changed} date(s) would move across ${files.length} modules. Nothing written.\n`
    : `\n${changed} date(s) corrected in ${filesTouched} file(s).\n`
);

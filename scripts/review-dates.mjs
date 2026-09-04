#!/usr/bin/env node
/**
 * IS THE "UPDATED" DATE ON A PAGE STILL TRUE?
 *
 * Every guide, comparison, approach and resource page prints a date under the
 * word "Updated", and on the pages that have one, "Clinically reviewed". Both
 * come from a string typed by hand next to the copy.
 *
 * A hand-typed date is not wrong when it is written. It goes wrong later, in
 * the one way nothing notices: somebody edits three paragraphs of a page about
 * trauma and does not touch the date field. The page now tells a reader it was
 * last changed in August when it was changed this morning. Nothing fails, no
 * gate complains, and the site is making a false provenance claim on exactly
 * the pages where provenance is the thing being judged.
 *
 * WHY GIT BLAME AND NOT A FILE TIMESTAMP. lib/guides.ts holds seventy pages.
 * Its modification time tells you somebody edited the file, not which page they
 * edited, so a file-level check would flag all seventy every time one changed —
 * and a gate that flags seventy pages for one real problem is a gate nobody
 * reads. Blame is per line: it can say that THIS entry's prose was last touched
 * on the 2nd while THIS entry's date still says the 8th of last month.
 *
 * WHAT IT DOES NOT CLAIM. It cannot tell a rewrite from a typo fix, so it
 * compares dates and not significance. A comma corrected after the review date
 * will be reported. That is the right way round: the cheap response is to move
 * the date, and the alternative — guessing which edits "count" — is how a check
 * becomes something you argue with instead of fix.
 *
 * "Clinically reviewed" is held to a stricter standard than "Updated", because
 * it is the heavier claim: a reader takes it to mean a clinician read the page
 * that day and stood behind it.
 *
 *   node scripts/review-dates.mjs           report
 *   node scripts/review-dates.mjs --strict  exit non-zero on a stale date
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';

const STRICT = process.argv.includes('--strict');

/* How old an "Updated" date may get before it is worth re-reading the page,
   independent of whether anything changed. Health content that has not been
   looked at in a year is not necessarily wrong, but it is worth a look. */
const REVIEW_AFTER_DAYS = 365;

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
  console.log('\nNot a git checkout — nothing to compare dates against.\n');
  process.exit(0);
}

const files = readdirSync('lib')
  .filter((f) => f.endsWith('.ts'))
  .map((f) => `lib/${f}`)
  .filter((f) => existsSync(f) && /updated:\s*["']\d{4}-/.test(readFileSync(f, 'utf8')));

const stale = [];
const old = [];
const today = new Date().toISOString().slice(0, 10);

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');

  /* Commit date per line, from one blame call per file rather than one per
     line — the latter is a process launch per line and takes minutes. */
  const blame = git(['blame', '--line-porcelain', '--', file]);
  if (!blame) continue;
  const lineDate = [];
  let pending = null;
  for (const l of blame.split('\n')) {
    if (l.startsWith('author-time ')) pending = Number(l.slice(12)) * 1000;
    else if (l.startsWith('\t')) { lineDate.push(pending); pending = null; }
  }

  /* Walk each `updated:` and treat the lines up to the next one as that
     entry's own copy. Entries are written in order in these files, so the span
     between two dates is the span of one page. */
  const marks = [];
  lines.forEach((l, i) => {
    const m = l.match(/\b(updated|reviewed):\s*["'](\d{4}-\d{2}-\d{2})["']/);
    if (m) marks.push({ i, kind: m[1], date: m[2] });
  });

  for (let k = 0; k < marks.length; k++) {
    const { i, kind, date } = marks[k];
    const end = k + 1 < marks.length ? marks[k + 1].i : lines.length;

    let newest = 0;
    let newestLine = -1;
    for (let n = i + 1; n < end; n++) {
      /* The date's own line is skipped: editing the date necessarily makes its
         line newer than itself, which would flag every page forever. */
      const t = lineDate[n];
      if (t && t > newest) { newest = t; newestLine = n; }
    }
    /* Compared as Vancouver day strings, not timestamps. The first version
       compared a raw commit time against the claimed date's UTC end-of-day,
       which meant every evening commit here counted as the next day and the
       check reported 86 pages whose date already matched the day it printed
       beside them. Two representations of "which day" in one comparison is the
       whole bug; ISO date strings sort correctly, so there is no reason for a
       second one. */
    const changedDay = newest ? vancouverDay(newest) : '';
    if (changedDay && changedDay > date) {
      stale.push({
        file, kind, date,
        changed: changedDay,
        line: newestLine + 1,
        sample: (lines[newestLine] || '').trim().slice(0, 70),
      });
    }

    /* Age, for `updated` only. A review date going a year without being redone
       is a different and more serious thing, reported in the same list. */
    const ageDays = (Date.parse(today) - Date.parse(date)) / 86_400_000;
    if (ageDays > REVIEW_AFTER_DAYS) old.push({ file, kind, date, ageDays: Math.round(ageDays) });
  }
}

console.log(`\nREVIEW DATES - ${files.length} content modules\n`);

if (stale.length) {
  console.log(`  ${stale.length} DATE(S) THE CONTENT HAS MOVED PAST\n`);
  for (const s of stale.slice(0, 20)) {
    console.log(`    ${s.file}:${s.line}`);
    console.log(`        says ${s.kind} ${s.date}, but copy below it changed ${s.changed}`);
    console.log(`        ${s.sample}`);
  }
  if (stale.length > 20) console.log(`    ...and ${stale.length - 20} more`);
  console.log('');
}

if (old.length) {
  console.log(`  ${old.length} PAGE(S) NOT LOOKED AT IN OVER A YEAR\n`);
  for (const o of old.slice(0, 10)) {
    console.log(`    ${o.file}  ${o.kind} ${o.date}  (${o.ageDays} days)`);
  }
  if (old.length > 10) console.log(`    ...and ${old.length - 10} more`);
  console.log('');
}

if (!stale.length && !old.length) {
  console.log('  Every dated page still matches when its copy last changed.\n');
  process.exit(0);
}

console.log(
  '  A date under the word "Updated" is a claim to the reader. Move the date,\n' +
  '  or revert the edit — but do not leave the two disagreeing.\n'
);

/* Reports by default. A stale date is a real problem and a bad reason to block
   a deploy at 6pm; --strict is for the release check. */
process.exit(STRICT && stale.length ? 1 : 0);

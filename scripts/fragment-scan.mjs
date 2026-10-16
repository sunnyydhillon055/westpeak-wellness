#!/usr/bin/env node
/* WHERE THE 3 SEP EM-DASH PASS LEFT HALF A SENTENCE — 15 Oct 2026 (item 550).
 *
 * 04289ad took 2,812 em dashes out of the copy. Where the clause after a dash
 * looked like it stood alone it became a full stop and a capital, and some of
 * those halves are not sentences: "The entitlement buying the hour that the
 * calendar never would." on the sick-days guide, "On whether video therapy
 * works at all. A fair question" on /online-counselling, "what gets carried
 * down. Those are the starting context" on /about. Nothing in verify:ci can
 * tell a fragment from a sentence, and a gate that tried would be wrong as
 * often as right, so this is a one-off list for a person to read.
 *
 * What it does: replays the lines 04289ad removed, finds each " — lowercase"
 * join, and looks for the same words at HEAD joined by ". Capital" instead.
 * A site is listed when the part either side of the full stop is short
 * (under six words, back to the previous sentence end) or has no word that
 * looks like a finite verb. The verb test is a word list and two suffixes,
 * deliberately loose: it errs towards listing, because the reader decides.
 *
 *   node scripts/fragment-scan.mjs            every candidate, file:line
 *   node scripts/fragment-scan.mjs --count    totals only
 *
 * Not part of verify:ci. Comments are not copy and are skipped. */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const COMMIT = '04289ad';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28 });

const FINITE = new Set(
  ('is are was were be been am has have had do does did can could will would shall should may might must ' +
    'isn’t aren’t wasn’t doesn’t don’t didn’t can’t won’t it’s that’s there’s here’s ' +
    'means need needs makes make made takes take took gives give gave keeps keep kept says say said ' +
    'goes go went gets get got comes come came works work worked helps help helped sits sit sat ' +
    'runs run ran feels feel felt looks look looked tells tell told shows show showed knows know knew ' +
    'matters matter changes change starts start begins begin ends end holds hold lets let puts put ' +
    'becomes become became seems seem stays stay leaves leave left turns turn asks ask answers answer')
    .split(' '),
);

/** Words of a string, letters and apostrophes only. */
const words = (s) => s.toLowerCase().match(/[a-z’']+/g) ?? [];

/** True when some word looks like a finite verb: on the list, or ending
 *  -ed. A plural noun ends in -s too, so -s alone does not count. */
const hasVerb = (s) => words(s).some((w) => FINITE.has(w) || (w.length > 4 && w.endsWith('ed')));

/** Each " — lowercase" join on a removed line, as the words either side. */
function joins(line) {
  const out = [];
  const re = / — (?=[a-z])/g;
  let m;
  while ((m = re.exec(line))) {
    const left = line.slice(0, m.index).split(/\s+/).slice(-3).join(' ');
    const right = line.slice(m.index + 3).split(/\s+/).slice(0, 3).join(' ');
    if (left && right) out.push({ left, right });
  }
  return out;
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The text back to the previous sentence end, and forward to the next. */
function halves(text, at, needleLeft) {
  const before = text.slice(0, at + needleLeft.length);
  const start = Math.max(before.lastIndexOf('. '), before.lastIndexOf('? '), before.lastIndexOf('! '), before.lastIndexOf("'"), before.lastIndexOf('`'), before.lastIndexOf('>'));
  const leftPart = before.slice(start + 1).trim();
  const after = text.slice(at + needleLeft.length + 2);
  const stop = after.search(/[.?!'`<]/);
  const rightPart = (stop < 0 ? after : after.slice(0, stop)).trim();
  return { leftPart, rightPart };
}

function main(argv) {
  const countOnly = argv.includes('--count');
  const diff = git('show', '--format=', '--unified=0', COMMIT);
  const byFile = new Map();
  let file = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) { file = line.slice(6); continue; }
    if (!file || !line.startsWith('-') || line.startsWith('---')) continue;
    const body = line.slice(1);
    if (/^\s*(\/\/|\/?\*)/.test(body)) continue;
    for (const j of joins(body)) {
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push(j);
    }
  }

  const found = [];
  let replayed = 0;
  for (const [f, list] of byFile) {
    if (!existsSync(f)) continue;
    const text = readFileSync(f, 'utf8');
    for (const { left, right } of list) {
      const needle = `${left}. ${cap(right)}`;
      let at = text.indexOf(needle);
      if (at < 0) continue;
      replayed++;
      while (at >= 0) {
        const { leftPart, rightPart } = halves(text, at, left);
        const reasons = [];
        if (words(leftPart).length < 6) reasons.push('short left');
        if (!hasVerb(leftPart)) reasons.push('no verb left');
        if (!hasVerb(rightPart)) reasons.push('no verb right');
        if (reasons.length) {
          const lineNo = text.slice(0, at).split('\n').length;
          found.push({ file: f, line: lineNo, at: needle, reasons });
        }
        at = text.indexOf(needle, at + needle.length);
      }
    }
  }

  const seen = new Set();
  const unique = found.filter((x) => {
    const k = `${x.file}:${x.line}:${x.at}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  if (!countOnly) {
    for (const x of unique) console.log(`${x.file}:${x.line}  "${x.at}"  (${x.reasons.join(', ')})`);
  }
  console.log(`\n${replayed} joins from ${COMMIT} still read ". Capital" at HEAD; ${unique.length} listed for a hand read.`);
}

main(process.argv.slice(2));

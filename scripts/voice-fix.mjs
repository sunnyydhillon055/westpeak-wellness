#!/usr/bin/env node
/**
 * Replaces em dashes in reader-facing copy with the punctuation a person
 * would have reached for.
 *
 * WHY NOT JUST SWAP THEM ALL FOR COMMAS. Because half of them join two
 * complete sentences, and a comma between two complete sentences is a comma
 * splice. Trading one tell for a different error is not a fix — it would make
 * the prose worse while making it look less machine-written, which is the
 * wrong half of the problem to solve.
 *
 * So the replacement reads the clause after the dash and picks:
 *
 *   FULL STOP   when what follows stands on its own as a sentence — it has its
 *               own subject and its own finite verb. This is the most common
 *               case and the most useful one: it breaks long sentences into
 *               short ones, which is most of what makes prose sound human.
 *   COLON       when the dash was introducing a list or a definition.
 *   COMMA       everything else: appositives, trailing qualifiers, fragments.
 *
 * COMMENTS ARE NEVER TOUCHED. A comment explaining a decision to the next
 * developer has no reader to lose, and there are three thousand of them.
 *
 * NEITHER IS ANYTHING INSIDE A URL, a className, an import, or a date range,
 * which is what the guards below are for.
 *
 *   node scripts/voice-fix.mjs --dry     first 40 before/after pairs
 *   node scripts/voice-fix.mjs --sample  200 random pairs, to read properly
 *   node scripts/voice-fix.mjs           write
 */

import { readFileSync, writeFileSync, globSync } from 'node:fs';

const DRY = process.argv.includes('--dry');
const SAMPLE = process.argv.includes('--sample');

/* Finite verbs and auxiliaries common in this site's register. Presence of one
   near the start of the following clause is the signal that it can stand as
   its own sentence. Deliberately a list rather than a parser: the failure mode
   of a missing verb is a comma where a full stop would have been slightly
   better, which is invisible. */
const VERBS = new RegExp(
  '\\b(is|are|was|were|be|been|being|has|have|had|does|do|did|can|could|will|would|' +
  'should|may|might|must|means|meant|costs|cost|takes|took|happens|happened|gets|got|' +
  'comes|came|goes|went|looks|looked|reads|read|works|worked|sits|sat|stays|stayed|' +
  'makes|made|keeps|kept|needs|needed|leaves|left|becomes|became|remains|remained|' +
  'tends|tend|counts|count|applies|apply|covers|cover|carries|carry|runs|ran|' +
  'starts|started|stops|stopped|ends|ended|includes|include|requires|require|' +
  'allows|allow|gives|give|shows|show|says|said|feels|felt|seems|seemed|' +
  'they|it|that|there)\\b', 'i'
);

/* A following clause that opens with one of these is a subordinate clause or a
   conjunction: it cannot start a sentence here, so it takes a comma. */
const SUBORDINATE = /^(which|who|whose|whom|where|when|while|although|though|because|since|so that|and|but|or|nor|yet|so|if|unless|until|rather|not|except|including|especially|often|usually|sometimes|always|never|then|plus|for)\b/i;

/* An opening that reads as a new sentence: its own subject. */
const SUBJECT_START = /^(the|a|an|it|this|that|these|those|they|she|he|you|we|i|there|his|her|their|its|your|our|most|many|some|few|no|every|each|both|nothing|nobody|anyone|someone|one)\b/i;

const LIST_AHEAD = /^[a-z0-9][^.]{0,60}(,\s|\sand\s|\sor\s)/i;

let totalDash = 0;
const changes = { period: 0, colon: 0, comma: 0, pipe: 0, skipped: 0 };
const pairs = [];

function decide(before, after) {
  const tail = after.replace(/^\s+/, '');
  const head = before.replace(/\s+$/, '');

  /* Never touch a dash that is not doing prose work. */
  if (!tail) { changes.skipped++; return null; }
  if (/https?:\/\/\S*$/.test(head)) { changes.skipped++; return null; }
  /* A numeric range: "2024 — 2026", "9 — 5". A dash there is a range, not
     punctuation, and turning it into a comma changes the meaning. */
  if (/\d\s*$/.test(head) && /^\s*\d/.test(after)) { changes.skipped++; return null; }

  /* A PAGE TITLE IS NOT PROSE. "Sign in — Westpeak Wellness" is a separator
     between a page name and a site name, and a comma there produces "Sign in,
     Westpeak Wellness", which reads as an address. The convention for this is
     a pipe, which is what the rest of the site's titles already use. */
  if (/^(Westpeak|\$\{site\.name\}|\$\{p\.name\})/.test(tail) && head.length < 70) {
    changes.pipe++;
    return { punct: ' |', tail, noSpaceBefore: true };
  }

  /* TWO COMPLETE SENTENCES JOINED BY A SUBORDINATOR STILL WANT A FULL STOP.
     "Try again — if it keeps happening, that is a fault worth reporting"
     became "Try again, if it keeps happening, that is a fault", which is a
     comma splice wearing three commas. When the half before the dash already
     stands on its own, the subordinate clause starts a new sentence. */
  const beforeIsSentence =
    /(^|[.!?]\s)[^.!?]{8,}$/.test(head) && VERBS.test(head.slice(-70));
  if (/^(if|when|where|while|because|although|though|unless|until|once|after|before)/i.test(tail)
      && beforeIsSentence) {
    changes.period++;
    return { punct: '.', tail: tail.charAt(0).toUpperCase() + tail.slice(1) };
  }

  /* AN IMPERATIVE AFTER A COMPLETE SENTENCE IS A NEW SENTENCE.
     "...how progress will be judged — see [questions worth asking]" became
     "...will be judged, see [questions...]", which is a comma splice and reads
     as though the list is part of the previous clause. These are almost all
     cross-references at the end of a paragraph, so they want a full stop. */
  if (/^(see|read|ask|check|call|book|write|use|try|start|bring|tell|note)/i.test(tail)
      && beforeIsSentence) {
    changes.period++;
    return { punct: '.', tail: tail.charAt(0).toUpperCase() + tail.slice(1) };
  }

  /* The dash introduced a list or a definition. Tightened: a colon is only
     right when what follows is genuinely enumerated, so it needs at least two
     separators, not one. The first version produced 780 colons, which is its
     own tell — a page that reaches for a colon every third sentence does not
     read any more human than one reaching for a dash. */
  const listish = (tail.slice(0, 120).match(/,/g) || []).length >= 2
    || /^[^.]{0,70},[^.]{0,40}and/i.test(tail);
  if (listish && !SUBORDINATE.test(tail) && !SUBJECT_START.test(tail)) {
    changes.colon++;
    return { punct: ':', tail };
  }

  if (SUBORDINATE.test(tail)) {
    changes.comma++;
    return { punct: ',', tail };
  }

  /* Its own subject AND a verb somewhere in the first stretch of it: a
     sentence. Capitalised, because it is one now. */
  const window = tail.slice(0, 90);
  if (SUBJECT_START.test(tail) && VERBS.test(window)) {
    changes.period++;
    return { punct: '.', tail: tail.charAt(0).toUpperCase() + tail.slice(1) };
  }

  changes.comma++;
  return { punct: ',', tail };
}

/* Walk the source, rewriting only inside string literals. Same state machine
   as scripts/voice-audit.mjs, for the same reason: a regex cannot tell a
   comment from a sentence that happens to contain a slash. */
function rewrite(src, file) {
  /* Segments, not one string. The JSX pass below must never see a comment,
     and the only way to guarantee that is to keep them apart as they are
     parsed. The first version concatenated everything into `out` and then ran
     a regex over the lot, which rewrote twenty-one lines of explanatory prose
     inside comments and, where a comment's dash spanned two lines, joined
     them. */
  const segs = [];
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { const j = src.indexOf('\n', i); const e = j < 0 ? n : j; segs.push({ t: 'x', v: out }); out = ''; segs.push({ t: 'c', v: src.slice(i, e) }); i = e; continue; }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); const e = j < 0 ? n : j + 2; segs.push({ t: 'x', v: out }); out = ''; segs.push({ t: 'c', v: src.slice(i, e) }); i = e; continue; }
    /* A REGEX LITERAL IS NOT CODE AND NOT A STRING, AND IGNORING THAT
       CORRUPTED THIS FILE'S OUTPUT ONCE.
       lib/inbound-submit.ts contains
         /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/
       The apostrophe in that character class opened a string as far as the
       parser was concerned, and everything up to the next apostrophe anywhere
       in the file — comments included — was swallowed into it and rewritten.
       That is where the twenty-one damaged comment lines came from; they were
       never a JSX problem.

       Recognised by what precedes it: a slash after an operator, an opening
       bracket, or a return is a regex; a slash after a value is division. */
    if (c === '/') {
      const prev = out.replace(/\s+$/, '').slice(-1);
      const isRegexStart = prev === '' || '=(,:[!&|?{};+-*%<>~^'.includes(prev)
        || /return$/.test(out.replace(/\s+$/, ''));
      if (isRegexStart) {
        const BACKSLASH = String.fromCharCode(92);
        let j = i + 1;
        let inClass = false;
        let closed = false;
        while (j < n) {
          const ch = src[j];
          if (ch === BACKSLASH) { j += 2; continue; }
          if (ch === '\n') break;              /* unterminated: not a regex */
          if (ch === '[') inClass = true;
          else if (ch === ']') inClass = false;
          else if (ch === '/' && !inClass) { j++; closed = true; break; }
          j++;
        }
        if (closed) { out += src.slice(i, j); i = j; continue; }
        /* Fell off the end of the line, so it was a division sign or a stray
           slash. Emit the one character and carry on normally rather than
           consuming the rest of the file. */
      }
    }

    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      let j = i + 1;
      let body = '';
      while (j < n && src[j] !== quote) {
        if (src[j] === '\\') { body += src.slice(j, j + 2); j += 2; continue; }
        body += src[j]; j++;
      }
      const literal = body;
      let rebuilt = literal;
      if (/—|&mdash;/.test(literal)) {
        /* One pass, left to right, over a single mutable string.
         *
         * The first version of this nested a helper inside the loop so it
         * could re-scan the tail after capitalising it, and re-entered itself
         * on every dash. It did not terminate. The correct shape is far
         * simpler: keep a `done` prefix that is finished with, and a `rest`
         * that still has dashes in it, and move the boundary rightwards. A
         * capitalisation applied to `rest` survives because `rest` is what the
         * next iteration reads. */
        let done = '';
        let rest = literal.split('&mdash;').join('—');
        for (;;) {
          const idx = rest.indexOf('—');
          if (idx < 0) { done += rest; break; }
          totalDash++;
          let left = idx;
          while (left > 0 && rest[left - 1] === ' ') left--;
          let right = idx + 1;
          while (right < rest.length && rest[right] === ' ') right++;

          const before = done + rest.slice(0, left);
          const after = rest.slice(right);
          const verdict = decide(before, after);

          if (!verdict) {
            /* Left alone: step past it so the loop cannot stall here. */
            done += rest.slice(0, idx + 1);
            rest = rest.slice(idx + 1);
            continue;
          }
          if (pairs.length < 500) {
            pairs.push({
              file,
              before: (rest.slice(Math.max(0, left - 55), idx + 1) + rest.slice(right, right + 55)).replace(/\s+/g, ' '),
              after: (before.slice(-55) + verdict.punct + ' ' + verdict.tail.slice(0, 55)).replace(/\s+/g, ' '),
            });
          }
          done = before + verdict.punct + (verdict.noSpaceBefore ? ' ' : ' ');
          rest = verdict.tail;
        }
        rebuilt = done;
      }
      segs.push({ t: 'x', v: out }); out = '';
      segs.push({ t: 's', v: quote + rebuilt + (j < n ? quote : '') });
      i = j + 1;
      continue;
    }
    out += c;
    i++;
  }
  /* ------------------------------------------------------------------------
     JSX TEXT IS COPY TOO, AND IT IS NOT IN QUOTES.
     ------------------------------------------------------------------------
     <p className="lede">Focused services rooted in evidence-based modalities
     — all offered online</p> is a sentence a visitor reads, and the state
     machine above never sees it: it lives between a > and a <, not between
     two quotes. The first run of this rewrote 2,812 dashes and left every one
     of these standing, which is how the homepage and /services still had them
     afterwards.

     Matched narrowly on purpose. The pattern refuses any run containing a
     brace, so a JSX expression is never touched, and refuses angle brackets,
     so it cannot span a tag. What is left is plain text between two tags.

     IT DOES ALLOW NEWLINES, AND HAS TO. The first version refused them, on the
     theory that a shorter match is a safer one. In JSX almost every sentence
     long enough to want a dash is wrapped across lines, and the dash lands at
     the wrap — so refusing newlines left 281 of them standing, including the
     homepage hero and three of the four crisis blocks.

     The layout is preserved instead of the match being narrowed: whichever
     side of the dash carried the line break gets it back, so a rewritten
     sentence wraps exactly where it wrapped before and the diff is one
     character wide. */
  segs.push({ t: 'x', v: out });
  const jsxPass = (code) => code.replace(/>([^<>{}]*—[^<>{}]*)</g, (whole, text) => {
    let done = '';
    let rest = text;
    for (;;) {
      const idx = rest.indexOf('—');
      if (idx < 0) { done += rest; break; }
      totalDash++;
      let left = idx;
      while (left > 0 && /\s/.test(rest[left - 1])) left--;
      let right = idx + 1;
      while (right < rest.length && /\s/.test(rest[right])) right++;
      const leftWs = rest.slice(left, idx);
      const rightWs = rest.slice(idx + 1, right);
      const before = done + rest.slice(0, left);
      const after = rest.slice(right);
      const verdict = decide(before, after);
      if (!verdict) { done += rest.slice(0, idx + 1); rest = rest.slice(idx + 1); continue; }
      /* Put the break back on the side it was on. A dash at end of line keeps
         the following newline and indent; a dash opening a line keeps the one
         before it. Neither case reflows the file. */
      const gap = leftWs.includes('\n') ? leftWs : rightWs.includes('\n') ? rightWs : ' ';
      done = before + verdict.punct + gap;
      rest = verdict.tail;
    }
    return '>' + done + '<';
  });

  return segs.map((sg) => (sg.t === 'x' ? jsxPass(sg.v) : sg.v)).join('');
}

const files = globSync(['lib/*.ts', 'lib/**/*.ts', 'components/*.tsx', 'app/**/*.tsx', 'app/**/*.ts', 'auth.ts', 'middleware.ts']);
let written = 0;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  if (!/—|&mdash;/.test(src)) continue;
  const next = rewrite(src, f);
  if (next !== src && !DRY && !SAMPLE) { writeFileSync(f, next); written++; }
}

if (DRY || SAMPLE) {
  const show = SAMPLE ? pairs.filter((_, i) => i % 2 === 0).slice(0, 200) : pairs.slice(0, 40);
  for (const p of show) {
    console.log(`\n  ${p.file}`);
    console.log(`    -  ${p.before}`);
    console.log(`    +  ${p.after}`);
  }
}

console.log(`\n${totalDash} dash(es) considered`);
console.log(`  full stop  ${changes.period}`);
console.log(`  colon      ${changes.colon}`);
console.log(`  comma      ${changes.comma}`);
console.log(`  pipe       ${changes.pipe}`);
console.log(`  left alone ${changes.skipped}`);
console.log(DRY || SAMPLE ? '\nNothing written.\n' : `\n${written} file(s) rewritten.\n`);

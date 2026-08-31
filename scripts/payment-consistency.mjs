#!/usr/bin/env node
/**
 * PAYMENT CONSISTENCY - one answer to "when does the money move".
 *
 * WHY THIS EXISTS
 *
 * On 30 Aug 2026 the site said two different things about payment:
 *
 *   /faq  (visible)  "paid by credit card at the time you book"
 *   /pricing (JSON-LD only)  "By e-transfer, which is preferred, or by
 *                             credit card"
 *
 * The visible copy on /pricing was correct the whole time. The wrong answer
 * lived ONLY inside a FAQPage block, so no one reading the rendered page could
 * ever have caught it - and structured data is precisely what Google lifts into
 * a rich result and what an assistant quotes back. The version most likely to
 * be shown to a prospective client was the false one.
 *
 * A second, wider version of the same bug: nine pages described insurance
 * reimbursement as "you pay at the session and submit the receipt". The point
 * being made was that the practice does not direct-bill, which is true; the
 * timing inside the sentence was false once the card became due at booking.
 *
 * WHAT IT ASSERTS
 *
 *   1. No file claims payment happens at the session.
 *   2. Every payment answer, visible or structured, says the card is taken at
 *      booking.
 *   3. The /pricing FAQ schema and lib/faq.ts still both carry that answer -
 *      so deleting one to "resolve" a future contradiction fails here instead.
 *
 * This does not verify Cliniko. If the practice ever changes how it takes
 * money, change WHEN_PAID below and this gate will show every page that needs
 * to follow.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

/* The one true answer, as a set of phrasings that all mean "at booking". */
const WHEN_PAID = /at the time you book|when you book|at the moment of booking|at the point of booking|taken at booking|when the client books/i;

/* Phrasings that assert the money moves at the session instead.
 *
 * Written as a function, not one regex, after the first version failed its own
 * injection test. That version required "pay" to sit immediately before "at the
 * time of the session", so it matched the alt text ("the client pays at the
 * session") but NOT the diagram's own words ("You pay the full session fee at
 * the time of the session") - four words in between. The gate looked like it
 * had caught the diagram and had actually caught a different file.
 *
 * So: allow anything short between the verb and the timing, then subtract the
 * one legitimate use. "not at the end of the hour" is correct copy - it appears
 * in the real answer, contrasting with booking - and must not trip this. */
/* NOTE: the \b escapes below are load-bearing, and were once literal
   backspace bytes (0x08) written by a shell heredoc that ate the backslash.
   The gate then passed on a file that plainly contained the wrong sentence,
   because SUBJECT was matching a control character that appears nowhere.
   If this gate ever goes quiet, check these two lines with `cat -A`. */
const SUBJECT = /\b(?:pay|pays|paid|payable|payment|fee)\b/gi;
const TIMING = /^[^.]{0,70}?\bat the (?:time of the |time of |end of the |end of )?(?:session|hour)\b/i;

function contradicts(text) {
  const flat = text.replace(/\s+/g, ' ');
  SUBJECT.lastIndex = 0;
  let m;
  while ((m = SUBJECT.exec(flat)) !== null) {
    const after = flat.slice(m.index + m[0].length);
    const hit = after.match(TIMING);
    if (!hit) continue;
    /* "not at the end of the hour" and "rather than at the end of the hour"
       are the correct copy saying the opposite. Look just behind the timing. */
    const lead = after.slice(0, hit[0].length).toLowerCase();
    if (/\bnot\b|\brather than\b|\binstead of\b/.test(lead)) continue;
    return true;
  }
  return false;
}

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', 'public'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) files.push(full);
  }
})(join(ROOT, 'lib'));
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', '.next', '.git'].includes(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(full)) files.push(full);
  }
})(join(ROOT, 'app'));

const fails = [];

/* SVGs too. The single most visible wrong claim was not in a .ts file at all -
   it was rendered text inside public/img/reimbursement-flow.svg, shown on about
   ten pages, plus the <desc> a screen reader announces. Text greps over source
   missed it entirely. */
for (const name of readdirSync(join(ROOT, 'public', 'img'))) {
  if (!name.endsWith('.svg')) continue;
  const full = join(ROOT, 'public', 'img', name);
  const src = readFileSync(full, 'utf8');
  /* Diagram text is split across tspans, so match on the flattened string. */
  const flat = src.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  if (contradicts(flat)) {
    fails.push(`public/img/${name}  the diagram says payment happens at the session`);
  }
}

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  src.split('\n').forEach((line, i) => {
    /* Skip comment lines - this file's own rationale, and the notes left in
       lib/site.ts and app/pricing/page.tsx, quote the wrong phrasing on
       purpose so the next reader knows what was fixed. */
    const t = line.trim();
    if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
    if (contradicts(line)) {
      fails.push(`${relative(ROOT, f)}:${i + 1}  says payment happens at the session`);
    }
  });
}

/* Both payment answers must survive and must agree. */
const faq = readFileSync(join(ROOT, 'lib', 'faq.ts'), 'utf8');
const pricing = readFileSync(join(ROOT, 'app', 'pricing', 'page.tsx'), 'utf8');

const faqAnswer = faq.match(/How do I pay, and when\?[\s\S]{0,400}?a:\s*"([^"]+)"/)?.[1];
if (!faqAnswer) {
  fails.push('lib/faq.ts  the "How do I pay, and when?" answer is gone');
} else if (!WHEN_PAID.test(faqAnswer)) {
  fails.push('lib/faq.ts  the payment answer no longer says the card is taken at booking');
}

const schemaAnswer = pricing.match(/How do I pay for a counselling session\?[\s\S]{0,3000}?text:\s*'([^']+)'/)?.[1];
if (!schemaAnswer) {
  fails.push('app/pricing/page.tsx  the payment question is missing from the FAQ schema');
} else if (!WHEN_PAID.test(schemaAnswer)) {
  fails.push('app/pricing/page.tsx  the FAQ SCHEMA answer disagrees with the visible page - this is the exact bug this gate exists for');
}

if (!WHEN_PAID.test(pricing.replace(/'[^']*'/g, (m) => (/@type/.test(m) ? '' : m)))) {
  fails.push('app/pricing/page.tsx  the visible "How payment works" copy no longer states when the card is taken');
}

if (fails.length) {
  console.log('\nPAYMENT CONSISTENCY - failed\n');
  for (const f of fails) console.log('  FAIL  ' + f);
  console.log('\n  The site must give one answer about when money moves, and the');
  console.log('  invisible answer in JSON-LD must match the visible one.\n');
  process.exit(1);
}

console.log(`\nPayment consistency - one answer across ${files.length} files.`);
console.log('  card at booking, in the visible copy and in the structured data.\n');

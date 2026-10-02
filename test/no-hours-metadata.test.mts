import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/* NO TIME PROMISE IN A TITLE OR DESCRIPTION — 1 Oct 2026.
 *
 * Commit 8fe40bc took the evening and weekend promises out of twenty sentences
 * of body copy, and missed the one place a searcher reads before the page: the
 * /online-counselling meta description still said "Free 30-minute
 * consultation, evenings, no referral." The calendar holds what it holds, and
 * the allowed form is that it shows the real open times.
 *
 * This reads the source, not a build, so it runs with `npm test`: every
 * `title`, `metaTitle`, `description` and `metaDescription` string literal in
 * app/ and lib/ fails on "evening" or "weekend" unless it is listed below with
 * the reason it is not a promise about when sessions run. */

const ROOT = join(import.meta.dirname, '..');

/* Each exemption names the file AND the phrase, and says why. */
const EXEMPT: { file: string; phrase: string; why: string }[] = [
  {
    file: 'lib/audiences-more3.ts',
    phrase: 'marking that eats evenings',
    why: 'describes a teacher’s workload, not when sessions are offered',
  },
];

const FIELD = /\b(description|metaDescription|metaTitle|title)\s*:\s*\n?\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g;
const TIME = /\b(evenings?|weekends?)\b/i;

/** Metadata strings in a source file that mention evenings or weekends. */
function timePromises(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(FIELD)) if (TIME.test(m[3])) out.push(m[3]);
  return out;
}

function sources(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) sources(p, out);
    else if (/\.(ts|tsx|md|html)$/.test(e)) out.push(p);
  }
  return out;
}

test('the scanner finds a time promise in each field form, and ignores body copy', () => {
  assert.deepEqual(timePromises(`description:\n    'Free 30-minute consultation, evenings, no referral.',`), ['Free 30-minute consultation, evenings, no referral.']);
  assert.deepEqual(timePromises(`metaDescription: "Weekend sessions available"`), ['Weekend sessions available']);
  assert.deepEqual(timePromises(`title: 'Evening counselling in BC'`), ['Evening counselling in BC']);
  assert.deepEqual(timePromises(`body: ['an evening in complete silence']`), []);
  assert.deepEqual(timePromises(`description: 'the calendar shows real open times'`), []);
});

test('no title or description in app/ or lib/ promises evenings or weekends', () => {
  const found: string[] = [];
  /* docs/ and kits/ since 1 Oct 2026 (item 258): the off-site copy is pasted
     into listings verbatim. Their body copy is checked in
     test/claims-corrections.test.mts. */
  for (const file of ['app', 'lib', 'docs', 'kits'].flatMap((d) => sources(join(ROOT, d)))) {
    const rel = file.slice(ROOT.length + 1).replace(/\\/g, '/');
    for (const s of timePromises(readFileSync(file, 'utf8'))) {
      if (EXEMPT.some((x) => x.file === rel && s.includes(x.phrase))) continue;
      found.push(`${rel}: ${s}`);
    }
  }
  assert.deepEqual(found, [], 'metadata makes a time promise the calendar may not hold');
});

test('every exemption still matches something, so a stale one is removed', () => {
  for (const x of EXEMPT) {
    const src = readFileSync(join(ROOT, x.file), 'utf8');
    assert.ok(timePromises(src).some((s) => s.includes(x.phrase)), `${x.file}: "${x.phrase}" no longer present`);
  }
});

/* NO SPAN AND NO WEEKEND IN THE LIVE AVAILABILITY LINES — 1 Oct 2026.
 *
 * The same rule for the sentences read from Cliniko. The home hero, /book and
 * /contact printed "9 am to 7 pm" and ", including the weekend", merged from
 * two calendars into a span no single day offered. What may be printed is a
 * count and the next open day per counsellor. These fixtures include weekend
 * and late slots on purpose: the lines must not mention either. */
import { summariseWindows, availabilityLine, nextFreeCallLine } from '../lib/availability-summary.ts';

const SPAN = /\b(?:am|pm) to\b|weekend/i;
/* Sat 3 Oct 9 am, Sun 4 Oct 7 pm, Tue 6 Oct 3 pm Pacific (PDT is UTC-7). */
const WEEKEND_AND_LATE = ['2026-10-03T16:00:00Z', '2026-10-05T02:00:00Z', '2026-10-06T22:00:00Z'];
const LATER = ['2026-10-09T22:00:00Z'];

test('the availability lines print no span of hours and no weekend clause', () => {
  const a = summariseWindows('camille-granda', WEEKEND_AND_LATE, LATER);
  const b = summariseWindows('savneet-singh', ['2026-10-06T22:00:00Z'], []);
  const lines = [
    availabilityLine(a, 'Camille'),
    availabilityLine(b, 'Savneet'),
    availabilityLine(summariseWindows('x', [], []), 'Camille'),
    nextFreeCallLine({ 'camille-granda': a, 'savneet-singh': b }, [
      { slug: 'camille-granda', first: 'Camille' },
      { slug: 'savneet-singh', first: 'Savneet' },
    ]),
  ];
  for (const l of lines) {
    assert.ok(l, 'each line has something to say');
    assert.doesNotMatch(l!, SPAN, l!);
  }
  assert.match(lines[0]!, /^4 free-consultation times open with Camille in the next two weeks; next: Sat,? (3 Oct|Oct 3) \(Pacific time\)\.$/);
  assert.match(lines[3]!, /^Next free call: Sat,? (3 Oct|Oct 3) with Camille · Tue,? (6 Oct|Oct 6) with Savneet \(Pacific time\)$/);
});

test('the next-free-call line skips anyone with nothing open, and says nothing when Cliniko is down', () => {
  const a = summariseWindows('camille-granda', WEEKEND_AND_LATE, []);
  const none = summariseWindows('savneet-singh', [], []);
  const people = [{ slug: 'camille-granda', first: 'Camille' }, { slug: 'savneet-singh', first: 'Savneet' }];
  assert.match(nextFreeCallLine({ 'camille-granda': a, 'savneet-singh': none }, people)!, /^Next free call: Sat,? (3 Oct|Oct 3) with Camille \(Pacific time\)$/);
  assert.equal(nextFreeCallLine({ 'camille-granda': { ...a, error: 'down' } }, people), null);
  assert.equal(nextFreeCallLine({}, people), null);
});

test('the span functions are gone, and no page brings a span back', () => {
  const lib = readFileSync(join(ROOT, 'lib/availability-summary.ts'), 'utf8');
  assert.doesNotMatch(lib, /export function (weekSpan|practiceHoursLine)\b/);
  for (const page of ['app/page.tsx', 'app/book/page.tsx', 'app/contact/page.tsx']) {
    const src = readFileSync(join(ROOT, page), 'utf8');
    assert.doesNotMatch(src, /\b(weekSpan|practiceHoursLine|HoursLine)\b/, page);
    assert.doesNotMatch(src, /including the weekend|Open this week/, page);
  }
});

/* THE LISTINGS ANSWER STATES NO HOURS AND NAMES NO ONE — 2 Oct 2026 (item 364).
 *
 * The /faq answer about third-party listings exists because directories and an
 * AI summary invented opening hours. It must not answer them with hours of its
 * own: it points at the calendar, gives the consultation length, and says
 * email. It also names no counsellor, so it never needs a roster check. */
import { faqs, faqsInGroup, LISTINGS_ANSWER } from '../lib/faq.ts';
import { practitioners as roster } from '../lib/practitioners.ts';

const LISTINGS_Q = 'Are there opening hours or an office, and is the listing I found elsewhere accurate?';
const CLOCK = /\b\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.)|\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s*(?:to|-|–)\s*(?:mon|tue|wed|thu|fri|sat|sun)/i;

test('the listings answer is in the start group and states no hours or evening/weekend times', () => {
  const entry = faqs.find((f) => f.q === LISTINGS_Q);
  assert.ok(entry, 'question present');
  assert.equal(entry!.a, LISTINGS_ANSWER);
  assert.ok(faqsInGroup('start').some((f) => f.q === LISTINGS_Q), 'rendered under Getting started');
  assert.doesNotMatch(LISTINGS_ANSWER, CLOCK);
  assert.doesNotMatch(LISTINGS_ANSWER, TIME);
  assert.match(LISTINGS_ANSWER, /calendar/);
  assert.match(LISTINGS_ANSWER, /\(\/book\)/);
  assert.match(LISTINGS_ANSWER, /\b30 minutes\b/);
  assert.match(LISTINGS_ANSWER, /@westpeakwellness\.com/);
  assert.match(LISTINGS_ANSWER, /online only/);
});

test('the clock pattern catches the invented hours the listings carried', () => {
  assert.match('Monday to 8:30 PM', CLOCK);
  assert.match('Open 9 am daily', CLOCK);
  assert.doesNotMatch('a 15-minute consultation', CLOCK);
});

test('the listings answer names no counsellor', () => {
  for (const p of roster) {
    assert.ok(!LISTINGS_ANSWER.includes(p.name), p.name);
    assert.ok(!LISTINGS_ANSWER.includes(p.name.split(' ')[0]!), p.name);
  }
});

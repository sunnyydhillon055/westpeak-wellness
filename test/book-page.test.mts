import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FALLBACK_CATALOG, money, type Catalog } from '../lib/cliniko-catalog.ts';
import { sessionFees, sessionFeesPhrase } from '../lib/book-fees.ts';
import { returnUrl, safePath } from '../lib/inbound-return.ts';
import {
  summarise, summariseWindows, practiceHoursLine, availabilityLine, weekSpan, WINDOW_DAYS,
} from '../lib/availability-summary.ts';
// @ts-expect-error -- a plain .mjs module shared with scripts/expansion-verify.mjs
import { rosterNumbers, numberAllowedOn, numberLeaks } from '../scripts/roster-numbers.mjs';

const ROOT = process.cwd();

/* ---------- #29: the fee after the consult comes from the catalogue ---------- */

test('/book states the individual and couples fee from the catalogue, never typed', () => {
  const ind = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!;
  const cpl = FALLBACK_CATALOG.items.find((i) => i.name === 'Couples Counselling')!;
  const phrase = sessionFeesPhrase(FALLBACK_CATALOG)!;
  assert.equal(ind.minutes, cpl.minutes);
  assert.equal(phrase, `individual ${money(ind.cents)}, couples ${money(cpl.cents)}, ${ind.minutes} minutes each`);

  const changed: Catalog = {
    ...FALLBACK_CATALOG,
    items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Individual Counselling' ? { ...i, cents: 15500 } : i)),
  };
  assert.match(sessionFeesPhrase(changed)!, /^individual \$155, /, 'a catalogue change moves the page');
  const longer: Catalog = { ...changed, items: changed.items.map((i) => (i.name === 'Couples Counselling' ? { ...i, minutes: 80 } : i)) };
  assert.equal(sessionFeesPhrase(longer), 'individual $155 (50 minutes), couples $175 (80 minutes)');

  const noCouples: Catalog = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.filter((i) => i.name !== 'Couples Counselling') };
  assert.equal(sessionFees(noCouples).length, 1, 'a type the catalogue does not hold is left out, not guessed');
  assert.equal(sessionFeesPhrase({ ...FALLBACK_CATALOG, items: [] }), null);

  const page = readFileSync(join(ROOT, 'app/book/page.tsx'), 'utf8');
  assert.doesNotMatch(page, /\$1[0-9]{2}\b/, 'no dollar figure typed into app/book/page.tsx');
});

/* ---------- #46: the form on /book?with= comes back to the same counsellor ---------- */

test('a /book form returns to /book?with=<slug> for an accepting counsellor, and nowhere else changes', () => {
  const opts = { bookingPath: '/book', accepting: ['camille-granda', 'savneet-singh'] };
  assert.equal(returnUrl('/book', 'sent', 'ok', { ...opts, practitioner: 'savneet-singh' }), '/book?with=savneet-singh&sent=ok#form');
  assert.equal(returnUrl('/book', 'sent', 'err', { ...opts, practitioner: 'camille-granda' }), '/book?with=camille-granda&sent=err#form');
  assert.equal(returnUrl('/book', 'sent', 'ok', { ...opts, practitioner: '' }), '/book?sent=ok#form');
  assert.equal(returnUrl('/book', 'sent', 'ok', { ...opts, practitioner: 'aman-bains-dhillon' }), '/book?sent=ok#form', 'not accepting: bare /book');
  assert.equal(returnUrl('/contact', 'sent', 'ok', { ...opts, practitioner: 'savneet-singh' }), '/contact?sent=ok#form');
});

test('safePath still refuses anything but a same-site path', () => {
  for (const bad of ['//evil.example', 'https://evil.example', '/book?with=x', 'book', '']) {
    assert.equal(safePath(bad, '/fallback'), '/fallback', bad);
  }
  assert.equal(safePath('/book', '/fallback'), '/book');
});

test('the /book request form no longer calls a required message optional', () => {
  const page = readFileSync(join(ROOT, 'app/book/page.tsx'), 'utf8');
  assert.doesNotMatch(page, /is optional/);
  assert.match(page, /Two or three sentences: when you are usually free, and what you are looking for\./);
});

/* ---------- #47: two weeks of openings, and no "with evenings" ---------- */

/* 2026-10-06 is a Tuesday. 16:00Z is 9 am Pacific (PDT), 01:00Z next day 6 pm. */
const FIRST = ['2026-10-06T16:00:00Z', '2026-10-07T01:00:00Z', '2026-10-03T16:00:00Z'];
const SECOND = ['2026-10-08T17:00:00Z', '2026-10-09T18:00:00Z'];

test('the summary covers fourteen days and keeps the first seven as `week`', () => {
  assert.equal(WINDOW_DAYS, 14);
  const a = summariseWindows('camille-granda', FIRST, SECOND);
  assert.equal(a.count, 5);
  assert.deepEqual(a.days, ['Tue', 'Thu', 'Fri', 'Sat']);
  assert.deepEqual(a.week?.days, ['Tue', 'Sat']);
  assert.equal(a.week?.count, 3);
  assert.equal(a.next.length, 3, 'up to three open days');
  assert.equal(weekSpan({ x: a }), 'Tue, Sat, 9 am to 6 pm (Pacific time)', 'the home hero says "this week" and reads the first seven days');
});

test('the practice line says "next two weeks" and makes no evening claim', () => {
  const a = summariseWindows('camille-granda', FIRST, SECOND);
  const line = practiceHoursLine({ x: a })!;
  assert.match(line, /Next two weeks: Tue, Thu, Fri, Sat, start times 9 am to 6 pm \(Pacific time\), including the weekend\./);
  assert.doesNotMatch(line, /evening/i);
  assert.match(availabilityLine(a, 'Camille')!, /in the next two weeks/);
  assert.match(availabilityLine(summarise('x', []), 'Camille')!, /next two weeks/);
  assert.equal(practiceHoursLine({ x: { ...a, error: 'down' } }), null, 'nothing printed when Cliniko cannot be read');
});

/* ---------- #90: no roster number on /book, and the guard covers everyone ---------- */

test('every roster number is read, and allowed only on its owner\'s pages', () => {
  const nums = rosterNumbers(readFileSync(join(ROOT, 'lib/practitioners.ts'), 'utf8')) as { slug: string; number: string }[];
  const has = (slug: string, number: string) => nums.some((n) => n.slug === slug && n.number === number);
  assert.ok(has('savneet-singh', '27067'));
  assert.ok(has('camille-granda', '26894'));
  assert.ok(has('camille-granda', '11263060'));
  assert.ok(has('aman-bains-dhillon', '20111'));

  assert.equal(numberAllowedOn('/practitioners/savneet-singh', 'savneet-singh'), true);
  assert.equal(numberAllowedOn('/practitioners/savneet-singh/surrey', 'savneet-singh'), true);
  assert.equal(numberAllowedOn('/practitioners/savneet-singh-x', 'savneet-singh'), false);
  assert.equal(numberAllowedOn('/book?with=savneet-singh', 'savneet-singh'), false);

  const html = '<main><p>Savneet Singh, RCC (verify #27067)</p></main>';
  const leaks = numberLeaks('/book?with=savneet-singh', html, nums) as { slug: string; where: string[] }[];
  assert.deepEqual(leaks.map((l) => l.slug), ['savneet-singh']);
  assert.deepEqual(leaks[0]!.where, ['visible text']);
  assert.deepEqual(numberLeaks('/practitioners/savneet-singh', html, nums), []);
  assert.deepEqual(numberLeaks('/book', '<main>a1270670b and 270671</main>', nums), [], 'digits inside a longer token are not a number');
});

test('/book renders no credential number', () => {
  const page = readFileSync(join(ROOT, 'app/book/page.tsx'), 'utf8');
  assert.doesNotMatch(page, /\.number\b/, 'app/book/page.tsx reads a credential number');
});

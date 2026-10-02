import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  timeZoneNote, hoursApart, nextFreeCallEntries, nextFreeCallLine, summariseWindows,
  availabilityLine, freshAvailability, firstReadError, empty, MAX_READ_AGE_MS,
} from '../lib/availability-summary.ts';
import { offsetMinutes, PACIFIC_ZONE } from '../lib/pacific-time.ts';
import {
  nextConsultNoneOpen, noConsultSentence, askForTimeHref, nextConsultEntries,
} from '../lib/next-consult.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* wf/pacific-time-availability, 2 Oct 2026: #359 the computed time-zone
 * sentence, #363 the linked home hero, #371 the last good read, #372 the
 * empty state. Instants sit at 20:00Z, well away from Pacific midnight. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');

const JULY = '2026-07-15T20:00:00Z';
const DECEMBER = '2026-12-15T20:00:00Z';
const JANUARY_2026 = '2026-01-15T20:00:00Z';

/* ---------- #359 ---------- */

test('July: Alberta is an hour ahead, Creston and the Peace match Pacific', () => {
  const ab = timeZoneNote(['BC', 'AB'], JULY);
  assert.equal(ab, 'Times on this page are Pacific time (Alberta and most of the East Kootenay are one hour ahead today).');
  const bc = timeZoneNote(['BC'], JULY);
  assert.equal(bc, 'Times on this page are Pacific time (most of the East Kootenay is one hour ahead today).');
});

test('December 2026: Creston and the Peace are never named; Alberta only where its offset differs', () => {
  for (const p of [['BC', 'AB'], ['BC']]) {
    const s = timeZoneNote(p, DECEMBER);
    assert.match(s, /^Times on this page are Pacific time/);
    assert.doesNotMatch(s, /Creston|Peace|November to March/);
    const differs = offsetMinutes('America/Edmonton', DECEMBER) !== offsetMinutes(PACIFIC_ZONE, DECEMBER);
    assert.equal(/East Kootenay/.test(s), differs, 'computed from the runtime, not typed');
  }
});

test('January 2026, before the change: Creston and the Peace were an hour ahead', () => {
  assert.match(timeZoneNote(['BC'], JANUARY_2026), /Creston and the Peace region are one hour ahead today/);
  assert.match(timeZoneNote(['BC'], JANUARY_2026), /most of the East Kootenay is one hour ahead today; Creston/, 'Edmonton (MST) was an hour ahead of PST too');
});

test('hoursApart words the difference', () => {
  assert.equal(hoursApart(60), 'one hour ahead');
  assert.equal(hoursApart(-60), 'one hour behind');
  assert.equal(hoursApart(120), '2 hours ahead');
  assert.equal(hoursApart(30), '0.5 hours ahead');
});

test('the sentence is a clock label, never an hours claim, and /book passes it the provinces', () => {
  for (const at of [JULY, DECEMBER, JANUARY_2026]) {
    assert.doesNotMatch(timeZoneNote(['BC', 'AB'], at), /evening|weekend|am to|pm to/i);
  }
  assert.match(src('app/book/page.tsx'), /timeZoneNote\(.*insuredProvinces\(p, vancouverToday\(\)\)/);
});

/* ---------- #363 ---------- */

const a = summariseWindows('camille-granda', ['2026-10-03T17:00:00Z'], []);
const b = summariseWindows('savneet-singh', [], ['2026-10-13T20:00:00Z']);
const people = [{ slug: 'camille-granda', first: 'Camille' }, { slug: 'savneet-singh', first: 'Savneet' }];

test('the hero entries carry the slug for each calendar link and a day only', () => {
  const e = nextFreeCallEntries({ 'camille-granda': a, 'savneet-singh': b }, people);
  assert.deepEqual(e.map((x) => x.slug), ['camille-granda', 'savneet-singh']);
  for (const x of e) assert.doesNotMatch(x.day, /\d+:\d\d|\b(am|pm)\b/, 'no hour on the hero');
  assert.equal(nextFreeCallLine({ 'camille-granda': a, 'savneet-singh': b }, people), `Next free call: ${e.map((x) => `${x.day} with ${x.first}`).join(' · ')} (Pacific time)`);
  assert.deepEqual(nextFreeCallEntries({ 'camille-granda': { ...a, error: 'down' } }, people), []);
  const home = src('app/page.tsx');
  assert.match(home, /<BookLink location="hero-next-home" className="" href=\{`\$\{site\.bookingPath\}\?with=\$\{e\.slug\}#calendar`\}>/);
  assert.ok(BOOK_LOCATIONS.includes('hero-next-home'));
});

/* ---------- #371 ---------- */

test('a stored read is served for six hours and then dropped', () => {
  const all = { 'camille-granda': a };
  const now = Date.parse('2026-10-02T20:00:00Z');
  assert.deepEqual(freshAvailability({ readAt: now - 3_600_000, all }, now), all);
  assert.deepEqual(freshAvailability({ readAt: now - MAX_READ_AGE_MS, all }, now), all);
  assert.deepEqual(freshAvailability({ readAt: now - MAX_READ_AGE_MS - 1, all }, now), {});
  assert.deepEqual(freshAvailability(undefined, now), {});
  assert.deepEqual(freshAvailability({ all } as never, now), {}, 'a v3-shaped value without readAt is not served');
});

test('any failed read is reported, so the cached function throws instead of storing it', () => {
  assert.equal(firstReadError({ 'camille-granda': a, 'savneet-singh': b }), null);
  assert.equal(firstReadError({ 'camille-granda': a, 'savneet-singh': empty('savneet-singh', 'HTTP 503') }), 'savneet-singh: HTTP 503');
  const lib = src('lib/cliniko-availability.ts');
  assert.match(lib, /if \(err\) throw new Error/);
  assert.match(lib, /export async function consultationAvailability\(\)[\s\S]*?try \{[\s\S]*?freshAvailability\(await cachedRead\(\)\)[\s\S]*?catch \{\s*return \{\};/);
  assert.match(lib, /export async function consultationAvailabilityNow\(/, '/admin keeps the live read and its error');
});

/* ---------- #372 ---------- */

const roster = [
  { slug: 'camille-granda', name: 'Camille Granda', acceptingNewClients: true, bookable: true, languages: [{ tag: 'en-CA' }] },
  { slug: 'savneet-singh', name: 'Savneet Singh', acceptingNewClients: true, bookable: true, languages: [{ tag: 'pa' }] },
];
const zero = (slug: string) => empty(slug);

test('nothing open in two weeks is said, and only when the read succeeded', () => {
  const none = nextConsultNoneOpen({ 'camille-granda': zero('camille-granda'), 'savneet-singh': zero('savneet-singh') }, roster);
  assert.deepEqual(none.map((x) => x.first), ['Camille', 'Savneet']);
  assert.equal(noConsultSentence(none), 'No free consultation is open with Camille or Savneet in the next two weeks.');
  assert.equal(askForTimeHref(none), '/book#ask-for-a-time');

  const one = nextConsultNoneOpen({ 'savneet-singh': zero('savneet-singh') }, roster, { language: 'pa' });
  assert.equal(noConsultSentence(one), 'No free consultation is open with Savneet in the next two weeks.');
  assert.equal(askForTimeHref(one), '/book?with=savneet-singh#ask-for-a-time');

  assert.deepEqual(nextConsultNoneOpen({ 'camille-granda': zero('camille-granda'), 'savneet-singh': empty('savneet-singh', 'down') }, roster), [], 'any error: say nothing');
  assert.deepEqual(nextConsultNoneOpen({ 'camille-granda': zero('camille-granda') }, roster), [], 'a missing entry is not a zero');
  assert.deepEqual(nextConsultNoneOpen({}, roster), [], 'a cold-cache {} is not a zero');
  assert.deepEqual(nextConsultNoneOpen({ 'camille-granda': a, 'savneet-singh': zero('savneet-singh') }, roster), [], 'someone has a time: the ordinary line');
  assert.equal(nextConsultEntries({ 'camille-granda': a, 'savneet-singh': zero('savneet-singh') }, roster).length, 1);
  assert.equal(noConsultSentence([]), null);
});

test('the empty states link the ask-for-a-time form and claim no day or hour', () => {
  assert.ok(BOOK_LOCATIONS.includes('next-consult-ask'));
  const line = src('components/NextConsultLine.tsx');
  assert.match(line, /<BookLink location="next-consult-ask" className="" href=\{askForTimeHref\(none, site\.bookingPath\)\}>/);
  const book = src('app/book/page.tsx');
  assert.match(book, /Times are on the calendar below; if none suit,\{' '\}\s*<BookLink location="next-consult-ask" className="" href="#ask-for-a-time">ask for a time<\/BookLink>/);
  const z = availabilityLine(zero('camille-granda'), 'Camille')!;
  assert.match(z, /ask for a time with the form under it/);
  assert.doesNotMatch(z, /\d|evening|weekend/i);
});

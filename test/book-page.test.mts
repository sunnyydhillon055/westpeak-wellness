import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FALLBACK_CATALOG, money, type Catalog } from '../lib/cliniko-catalog.ts';
import { sessionFees, sessionFeesPhrase } from '../lib/book-fees.ts';
import { returnUrl, safePath } from '../lib/inbound-return.ts';
import {
  summarise, summariseWindows, availabilityLine, nextFreeCallLine, WINDOW_DAYS,
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
  assert.match(nextFreeCallLine({ x: a }, [{ slug: 'x', first: 'Camille' }])!, /^Next free call: Sat,? (3 Oct|Oct 3) with Camille \(Pacific time\)$/, 'the home hero names the next open day, not a span');
});

test('the card line says "next two weeks" and makes no evening, weekend or span claim', () => {
  const a = summariseWindows('camille-granda', FIRST, SECOND);
  const line = availabilityLine(a, 'Camille')!;
  assert.match(line, /^5 free-consultation times open with Camille in the next two weeks; next: Sat,? (3 Oct|Oct 3) \(Pacific time\)\.$/);
  assert.doesNotMatch(line, /evening|weekend|am to|pm to/i);
  assert.match(availabilityLine(summarise('x', []), 'Camille')!, /next two weeks/);
  assert.equal(availabilityLine({ ...a, error: 'down' }, 'Camille'), null, 'nothing printed when Cliniko cannot be read');
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

/* ---------- Round 4 batch 2 (wf/book-faq-trust), 2 Oct 2026 ---------- */
import { practitioners } from '../lib/practitioners.ts';
import {
  notTakingLine, WHO_FINDS_OUT, WHO_SEES_A_CLAIM, CAMERA_OPTIONAL, CONFIDENTIALITY_LIMITS,
} from '../lib/practice-facts.ts';
import { faqs, faqsInGroup, BEFORE_SESSION_ONE } from '../lib/faq.ts';
import { policies } from '../lib/policies.ts';
import { checklistEmail } from '../lib/inbound-mail.ts';
import { email3 } from '../lib/nurture.ts';
import { rosterLines } from '../lib/lead-roster.ts';

const bookSrc = () => readFileSync(join(ROOT, 'app/book/page.tsx'), 'utf8');

/* #361 */
test('/book?with=<not accepting> names nobody who is not taking clients', () => {
  const accepting = practitioners.filter((p) => p.acceptingNewClients).map((p) => p.name.split(' ')[0]!);
  const full = practitioners.filter((p) => !p.acceptingNewClients);
  const lines = [notTakingLine(accepting), notTakingLine([accepting[0]!], accepting[0]), notTakingLine([], undefined)];
  for (const line of lines) {
    assert.match(line, /^That counsellor is not taking new clients at the moment\./);
    for (const p of full) {
      for (const part of p.name.split(' ')) assert.ok(!line.includes(part), `${line} names ${p.name}`);
    }
  }
  if (accepting.length > 1) {
    assert.equal(lines[0], `That counsellor is not taking new clients at the moment. ${accepting.join(' and ')} are; choose above, or pick either on the calendar below.`);
  }
  const src = bookSrc();
  assert.doesNotMatch(src, /askedButFull\.name/, 'the page prints the non-accepting counsellor’s name');
  assert.match(src, /notTakingLine\(/);
});

/* #358 */
test('WHO_FINDS_OUT is built from the privacy policy’s claims, with the full limits', () => {
  const privacy = JSON.stringify(policies.privacy);
  assert.match(privacy, /your employer, your doctor or your insurer without your written consent/);
  assert.match(privacy, /never recorded/);
  assert.match(privacy, /Canadian region/);
  for (const re of [/without your written consent/, /not what was said/, /never recorded/, /Canadian region/, /ask the plan/]) {
    assert.match(WHO_FINDS_OUT, re);
  }
  assert.ok(WHO_FINDS_OUT.includes(CONFIDENTIALITY_LIMITS));
  assert.doesNotMatch(WHO_FINDS_OUT + WHO_SEES_A_CLAIM, /Pacific Blue Cross|Manulife|Sun Life|Canada Life|Green Shield/, 'no insurer named');
});

test('/faq answers who finds out in the privacy group, and states every limit', () => {
  const q = faqs.find((f) => f.q === 'Will my employer, insurer or family find out?');
  assert.ok(q);
  assert.equal(q!.a, WHO_FINDS_OUT);
  assert.ok(faqsInGroup('privacy').includes(q!));
  const conf = faqs.find((f) => f.q === 'Is what I share confidential?')!;
  assert.ok(conf.a.includes(`The limits are ${CONFIDENTIALITY_LIMITS}`));
});

test('/book and /pricing carry the who-finds-out answer from the constant', () => {
  const book = bookSrc();
  assert.match(book, /<summary>Will my employer, insurer or family find out\?<\/summary>/);
  assert.match(book, /\{WHO_FINDS_OUT\}/);
  const pricing = readFileSync(join(ROOT, 'app/pricing/page.tsx'), 'utf8');
  assert.match(pricing, /\{WHO_SEES_A_CLAIM\}/);
});

/* #393: copy in two existing emails, text and HTML, no new mail. */
test('the coverage checklist and nurture email 3 say what an insurer and employer see', () => {
  const flat = (s: string) => s.replace(/\s+/g, ' ');
  const roster = rosterLines();
  const c = checklistEmail('Sam', { roster });
  const n = email3('Sam', 'sam@gmail.com', undefined, { roster });
  for (const m of [c, n]) {
    assert.ok(flat(m.text).includes(WHO_SEES_A_CLAIM), 'text version');
    assert.ok(m.html.includes(WHO_SEES_A_CLAIM), 'html version');
  }
  if (roster.length) {
    assert.ok(flat(n.text).indexOf(WHO_SEES_A_CLAIM) < flat(n.text).indexOf('own calendar'), 'before the roster');
  }
});

/* #368 */
test('what comes before session one is said on /book and in /faq, from published facts', () => {
  assert.match(BEFORE_SESSION_ONE, /consent form/);
  assert.match(BEFORE_SESSION_ONE, /24-hour/);
  assert.match(readFileSync(join(ROOT, 'app/client-portal/page.tsx'), 'utf8'), /the consent form you signed/);
  assert.match(JSON.stringify(policies), /in writing before the first session/);
  assert.ok(faqs.find((f) => f.q === 'What happens in the first session?')!.a.endsWith(BEFORE_SESSION_ONE));
  assert.match(bookSrc(), /\{BEFORE_SESSION_ONE\}/);
});

/* #392 */
test('the camera can stay off wherever people book, read from one sentence', () => {
  assert.match(JSON.stringify(policies.accessibility), /never required to be on camera/);
  assert.match(readFileSync(join(ROOT, 'lib/policies.ts'), 'utf8'), /detail: CAMERA_OPTIONAL \+/);
  const book = bookSrc();
  assert.doesNotMatch(book, /any device with a camera/);
  assert.ok((book.match(/\{CAMERA_OPTIONAL\}/g) ?? []).length >= 2, '/book: after-you-book note and the video disclosure');
  const online = faqs.find((f) => /online or in person/.test(f.q))!;
  assert.ok(online.a.includes(CAMERA_OPTIONAL));
  assert.doesNotMatch(online.a, /a device with a camera/);
  assert.match(readFileSync(join(ROOT, 'lib/booking-mail.ts'), 'utf8'), /join from somewhere private\. \$\{CAMERA_OPTIONAL\}/);
});

/* #380, the /book half */
test('the ask-for-a-time form on /book suggests no evening or weekend, and promises no off-calendar time', () => {
  const book = bookSrc();
  assert.doesNotMatch(book, /weekday evenings|Saturday mornings/);
  assert.doesNotMatch(book, /a time that is not on the calendar yet/);
  assert.match(book, /the closest time she can offer/);
  assert.match(book, /placeholder="Which days and times usually suit you, then a sentence or two on what you are looking for\."/);
});

/* #387 */
test('the /book fallback email links print the address', () => {
  const book = bookSrc();
  const worded = [...book.matchAll(/<MailLink\b[^>]*>\s*([^<{]+?)\s*<\/MailLink>/g)];
  assert.ok(worded.length >= 2);
  for (const m of worded) assert.match(m[0], /\bshowAddress\b/, m[1]!);
  const comp = readFileSync(join(ROOT, 'components/MailLink.tsx'), 'utf8');
  assert.match(comp, /children && showAddress \? ` \(\$\{site\.email\}\)` : null/);
});

/* #388 */
test('the year-end page is linked by what it is, not as "booklet", and CoverageLine links it in season', () => {
  for (const f of ['app/book/page.tsx', 'app/pricing/page.tsx']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    assert.doesNotMatch(src, /href=\{YEAR_END_PATH\}>booklet</, f);
    assert.match(src, /<Link href=\{YEAR_END_PATH\}>how the plan year affects a claim<\/Link>/, f);
  }
  const line = readFileSync(join(ROOT, 'components/CoverageLine.tsx'), 'utf8');
  assert.match(line, /\{planYearPageLineShown\(now\) && \(/);
  assert.match(line, /<Link href=\{YEAR_END_PATH\}>using benefits before the plan year ends<\/Link>/);
  assert.doesNotMatch(line, /Pacific Blue Cross|Manulife|Sun Life|Canada Life|Green Shield/);
});

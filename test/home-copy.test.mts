import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { whoSentence, onlyWithSentence, alsoOffers, feeSentence, ownWords, orList } from '../lib/home-copy.ts';
import { practitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG, fallbackFee } from '../lib/cliniko-catalog.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { RCC_PLAIN } from '../lib/site.ts';

/* wf/home-book-copy, 1 Oct 2026: the home hero says who you would talk to and
 * what it costs, from the roster and the catalogue; the founder's thesis is
 * off the home and Punjabi service pages; the designation is explained once;
 * /book has a named calendar region and a route that is not the calendar. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const accepting = practitioners.filter((p) => p.acceptingNewClients && p.bookable);
const KINDS = [{ slug: 'couples-therapy', label: 'Couples counselling' }, { slug: 'emdr-therapy', label: 'EMDR' }];

const person = (name: string, langs: string[], services: string[], rcc = true) => ({
  name, languages: langs.map((n) => ({ name: n })), services, credentials: rcc ? [{ short: 'RCC' }] : [],
});

test('the hero names the accepting counsellors with their languages, and never the founder', () => {
  const s = whoSentence(accepting)!;
  assert.match(s, /^Talk by video with /);
  for (const p of accepting) assert.ok(s.includes(p.name), p.name);
  assert.doesNotMatch(s, /Aman/);
  assert.match(s, /Camille Granda \(English or Tagalog\)/);
  assert.match(s, /Savneet Singh \(English or Punjabi\)/);
  assert.match(s, /both Registered Clinical Counsellors/);
  assert.equal(whoSentence([]), null);
  assert.equal(whoSentence([person('A B', ['English'], [], false)]), 'Talk by video with A B (English) from anywhere in BC.', 'the designation only when everybody holds it');
});

test('work only some counsellors offer is attributed; work everyone or nobody offers is not mentioned', () => {
  assert.equal(onlyWithSentence(accepting, KINDS), 'Couples counselling and EMDR are with Camille.');
  const a = person('Ana X', ['English'], ['couples-therapy']);
  const b = person('Bo Y', ['English'], ['emdr-therapy']);
  assert.equal(onlyWithSentence([a, b], KINDS), 'Couples counselling is with Ana. EMDR is with Bo.');
  const both = person('Cy Z', ['English'], ['couples-therapy', 'emdr-therapy']);
  assert.equal(onlyWithSentence([both, { ...both, name: 'Di W' }], KINDS), null);
  assert.equal(onlyWithSentence([person('E F', ['English'], [])], KINDS), null);
  assert.equal(alsoOffers(accepting, 'emdr-therapy', 'EMDR'), 'Camille also offers EMDR');
  assert.equal(alsoOffers([both], 'emdr-therapy', 'EMDR'), null);
});

test('the fee sentence carries the catalogue figures, and the couples fee only when someone offers it', () => {
  const minutes = (n: string) => FALLBACK_CATALOG.items.find((i) => i.name === n)?.minutes;
  const s = feeSentence({
    consultMinutes: minutes('Initial Consultation'),
    individual: fallbackFee('Individual Counselling'),
    minutes: minutes('Individual Counselling'),
    couples: fallbackFee('Couples Counselling'),
  });
  assert.equal(s, `It starts with a free 30-minute call; sessions after that are ${fallbackFee('Individual Counselling')} for ${minutes('Individual Counselling')} minutes (${fallbackFee('Couples Counselling')} for a couple).`);
  assert.equal(feeSentence({ consultMinutes: 30, individual: '$1', minutes: 50, couples: null }), 'It starts with a free 30-minute call; sessions after that are $1 for 50 minutes.');
  assert.doesNotMatch(src('app/page.tsx'), /\$1[0-9]{2}\b/, 'no fee typed into the home page');
});

test('the Punjabi paragraph quotes the counsellor from her roster intro, and the thesis is gone', () => {
  const pa = accepting.find((p) => p.languages.some((l) => l.tag === 'pa'))!;
  const words = ownWords(pa.intro, 'what silence means');
  assert.ok(words && /^What family expects/.test(words) && words.endsWith('first.'), String(words));
  assert.equal(ownWords(['One. Two.'], 'missing'), null);
  const thesis = /Master(&rsquo;|’|')s thesis/i;
  assert.doesNotMatch(src('app/page.tsx'), thesis);
  assert.doesNotMatch(src('lib/services.ts'), thesis);
});

test('the designation is explained in plain words, and the practice is not called EMDR-trained', () => {
  assert.match(RCC_PLAIN, /master’s degree in counselling/);
  assert.doesNotMatch(RCC_PLAIN, /'/, 'typographic apostrophe only');
  assert.match(src('app/page.tsx'), /RCC_PLAIN/);
  assert.match(src('app/book/page.tsx'), /RCC_PLAIN/);
  assert.doesNotMatch(src('app/page.tsx'), /EMDR-trained/);
  const bar = src('components/ui/TrustBar.tsx');
  assert.equal((bar.match(/<strong>BCACC registered/g) ?? []).length, 0, 'not said twice in one strip');
  assert.match(bar, /On the BCACC register/);
  assert.match(bar, /what that means/);
});

test('/book: a named calendar region, a route that is not the calendar, and short card names', () => {
  assert.ok(BOOK_LOCATIONS.includes('calendar-alt'));
  assert.equal(BOOK_LOCATIONS[BOOK_LOCATIONS.indexOf('email:reactivation') + 1], 'calendar-alt', 'appended, nothing reordered (later rounds append after it)');
  const gate = src('components/SchedulerGate.tsx');
  assert.match(gate, /role="region" aria-label=\{title\}/);
  assert.match(gate, /role="status" aria-live="polite"/);
  const book = src('app/book/page.tsx');
  assert.match(book, /id="ask-for-a-time"/);
  assert.match(book, /href="#ask-for-a-time"/);
  assert.match(book, /Calendar hard to use with your screen reader or device\?\{' '\}\s*<MailLink where="book-fallback"/, 'email first');
  assert.match(book, /<BookLink location="calendar-alt" className="" href="#ask-for-a-time">/);
  assert.match(book, /aria-labelledby=\{`bk-\$\{p\.slug\}-name`\}/);
  assert.match(book, /No charge to move or cancel it/);
  assert.doesNotMatch(book, /Free cancellation up to/);
});

test('orList reads naturally', () => {
  assert.equal(orList(['a']), 'a');
  assert.equal(orList(['a', 'b']), 'a or b');
  assert.equal(orList(['a', 'b', 'c']), 'a, b or c');
});

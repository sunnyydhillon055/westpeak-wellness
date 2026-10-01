import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { practitioners } from '../lib/practitioners.ts';
import { getResource } from '../lib/resources.ts';
import { getGuide } from '../lib/guides.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { nextConsultEntries, NEXT_CONSULT_LABEL } from '../lib/next-consult.ts';
import {
  summariseWindows, availabilityLine, practiceHoursLine, weekSpan, timeZoneNote, PACIFIC,
} from '../lib/availability-summary.ts';
import {
  INFO_CARD_PAGES, COUNSELLOR_CARD_LOCATIONS, counsellorsForInfoPage, infoCardCopy, showsInfoCards,
} from '../lib/counsellor-cards.ts';
import { articleSchema, medicalWebPage, webPage } from '../lib/schema.ts';

/* wf/info-templates, 1 Oct 2026: the cards, fee and coverage lines on the
 * informational pages, the next-consultation line in more places, Pacific
 * time on every printed time, the answer under the H1, the dangling
 * reviewedBy removed, and the one-pager confirmation page. */

const ROOT = join(import.meta.dirname, '..');
const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');

/* ---------- #140: Pacific time ---------- */

const FIRST = ['2026-10-06T16:00:00Z', '2026-10-07T01:00:00Z', '2026-10-03T16:00:00Z'];
const SECOND = ['2026-10-08T17:00:00Z'];

test('every sentence that prints a clock time says Pacific time', () => {
  const a = summariseWindows('camille-granda', FIRST, SECOND);
  assert.ok(availabilityLine(a, 'Camille')!.includes(PACIFIC));
  assert.ok(practiceHoursLine({ x: a })!.includes(PACIFIC));
  assert.ok(weekSpan({ x: a })!.endsWith(PACIFIC));
  assert.match(NEXT_CONSULT_LABEL, /Pacific time/);
  assert.match(src('components/NextConsultLine.tsx'), /NEXT_CONSULT_LABEL/);
  assert.match(src('app/book/page.tsx'), /Next open with \{first\}\{PACIFIC\}/);
});

test('the /book time-zone sentence names Alberta only while someone is insured there', () => {
  const ab = timeZoneNote(['BC', 'AB']);
  const bc = timeZoneNote(['BC']);
  assert.match(ab, /Alberta/);
  assert.doesNotMatch(bc, /Alberta/);
  for (const s of [ab, bc]) {
    assert.match(s, /^Times on this page are Pacific time/);
    assert.match(s, /East Kootenay/);
    assert.match(s, /Peace region are one hour ahead from November to March/);
    assert.doesNotMatch(s, /evening|weekend/i, 'a clock label, not an hours claim');
  }
  assert.match(src('app/book/page.tsx'), /timeZoneNote\(.*insuredProvinces\(p, vancouverToday\(\)\)/);
});

/* ---------- #163/#164: the next-consultation line, filtered ---------- */

const roster = [
  { slug: 'a', name: 'Ann One', acceptingNewClients: true, bookable: true, languages: [{ tag: 'en-CA' }, { tag: 'pa' }] },
  { slug: 'b', name: 'Bea Two', acceptingNewClients: true, bookable: true, languages: [{ tag: 'en-CA' }, { tag: 'tl' }] },
  { slug: 'c', name: 'Cat Three', acceptingNewClients: false, bookable: true, languages: [{ tag: 'pa' }] },
];
const slots = {
  a: { slug: 'a', count: 3, next: ['Thu 2 Oct from 10 am (3 times)'] },
  b: { slug: 'b', count: 1, next: ['Fri 3 Oct from 1 pm'] },
  c: { slug: 'c', count: 2, next: ['Mon 6 Oct from 9 am (2 times)'] },
};

test('the line narrows by slug and by language, and never adds anyone', () => {
  assert.deepEqual(nextConsultEntries(slots, roster).map((e) => e.slug), ['a', 'b']);
  assert.deepEqual(nextConsultEntries(slots, roster, { slugs: ['b'] }).map((e) => e.slug), ['b']);
  assert.deepEqual(nextConsultEntries(slots, roster, { language: 'pa' }).map((e) => e.slug), ['a'], 'not accepting stays out');
  assert.deepEqual(nextConsultEntries(slots, roster, { slugs: [] }), [], 'an empty list prints nothing');
  assert.deepEqual(nextConsultEntries(slots, roster, { slugs: ['c'] }), []);
  assert.equal(nextConsultEntries(slots, roster)[0]!.when, 'Thu 2 Oct from 10 am');
  assert.deepEqual(nextConsultEntries({ a: { slug: 'a', count: 0, next: [], error: 'down' } }, roster), []);
});

function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(n)) out.push(p);
  }
  return out;
}

test('every next-consultation line location is on the book_click allow-list', () => {
  const missing: string[] = [];
  for (const file of [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'components'))]) {
    const s = readFileSync(file, 'utf8');
    for (const m of s.matchAll(/<NextConsultLine\b[^>]*\blocation="([^"]+)"/g)) if (!BOOK_LOCATIONS.includes(m[1]!)) missing.push(m[1]!);
    for (const m of s.matchAll(/location: '([^']+)'/g)) if (/next-|guide-waiting/.test(m[1]!) && !BOOK_LOCATIONS.includes(m[1]!)) missing.push(m[1]!);
  }
  assert.deepEqual(missing, []);
});

test('each keyed next-consultation line points at a heading the page has', () => {
  const pairs: [string, (slug: string) => { sections: { h2: string }[] } | undefined][] = [
    ['app/guides/[slug]/page.tsx', getGuide],
    ['app/resources/[slug]/page.tsx', getResource],
  ];
  let n = 0;
  for (const [file, get] of pairs) {
    for (const m of src(file).matchAll(/'([a-z0-9-]+)': \{ h2: '([^']+)', location: '([^']+)' \}/g)) {
      const page = get(m[1]!);
      assert.ok(page, `${file}: no page ${m[1]}`);
      assert.ok(page!.sections.some((s) => s.h2 === m[2]), `${m[1]} has no section "${m[2]}"`);
      n++;
    }
  }
  assert.ok(n >= 5, `expected the waiting, sick-days, verify, plan and Punjabi words lines, found ${n}`);
});

test('the city hub and city x service pages pass who the line may name', () => {
  assert.match(src('app/online-counselling/[city]/page.tsx'), /<NextConsultLine location="next-city" slugs=\{counsellorPages\.map/);
  assert.match(src('app/online-counselling/[city]/[service]/page.tsx'), /<NextConsultLine location="next-city-service" slugs=\{counsellors\.map/);
});

/* ---------- #116: the cards on the informational pages ---------- */

test('every page on the cards list exists, and nobody not accepting is named', () => {
  for (const slug of INFO_CARD_PAGES.resources) assert.ok(getResource(slug), `no resource ${slug}`);
  for (const slug of INFO_CARD_PAGES.guides) assert.ok(getGuide(slug), `no guide ${slug}`);
  const founder = practitioners.filter((p) => !p.acceptingNewClients).map((p) => p.slug);
  for (const slug of INFO_CARD_PAGES.resources) {
    const cs = counsellorsForInfoPage(getResource(slug)!);
    assert.ok(cs.length > 0, `${slug} names nobody`);
    for (const p of cs) assert.ok(!founder.includes(p.slug), `${p.slug} is not accepting`);
  }
  assert.equal(showsInfoCards('resources', 'workplace-mental-health-bc'), true);
  assert.equal(showsInfoCards('resources', 'bc-crisis-and-support-directory'), false, 'the crisis page gets no cards');
  assert.equal(showsInfoCards('resources', 'anything', true), true, 'whoYouWouldSee opts a page in');
});

test('the Punjabi words page shows only counsellors who work in Punjabi', () => {
  const page = getResource('counselling-in-punjabi-what-the-words-mean')!;
  assert.equal(page.language, 'pa');
  const cs = counsellorsForInfoPage(page);
  assert.ok(cs.length > 0);
  for (const p of cs) assert.ok(p.languages.some((l) => l.tag === 'pa'), `${p.slug} does not work in Punjabi`);
});

test('the gentle heading makes no claim, and every card location is countable', () => {
  for (const g of [true, false]) {
    const c = infoCardCopy(g);
    assert.doesNotMatch(`${c.heading} ${c.intro}`, /evening|weekend|helped|results|guarantee/i);
    assert.match(c.intro, /30|secure video/);
  }
  for (const l of COUNSELLOR_CARD_LOCATIONS) assert.ok(BOOK_LOCATIONS.includes(l), `${l} missing`);
  const guides = src('app/guides/[slug]/page.tsx');
  assert.match(guides, /infoCardCopy\(gentle\)/);
  assert.match(guides, /if \(GENTLE_CTA\.has\(slug\)\) return null;/, 'the gentle guides still get no email form');
});

/* ---------- #184: the guide buttons are counted ---------- */

test('the guide hero and mid-article buttons go through BookLink', () => {
  const g = src('app/guides/[slug]/page.tsx');
  assert.match(g, /<BookLink location="hero-guide"/);
  assert.match(g, /<BookLink location="mid-guide"/);
  assert.doesNotMatch(g, /<Link[^>]*href=\{site\.bookingPath\}/);
});

/* ---------- #161: the answer under the H1 ---------- */

test('the answer sits directly under the H1, before the lede, on all four templates', () => {
  for (const f of ['resources', 'guides', 'compare', 'approaches']) {
    const s = src(`app/${f}/[slug]/page.tsx`);
    const h1 = s.indexOf('<h1');
    const answer = s.indexOf('className="answer"');
    const lede = s.indexOf('className="lede"');
    assert.ok(h1 > 0 && answer > h1 && lede > answer, `${f}: h1 ${h1}, answer ${answer}, lede ${lede}`);
    assert.doesNotMatch(s, /<blockquote[^>]*>\s*\{?\w\.shortAnswer/, `${f} still repeats the answer lower down`);
  }
  assert.ok(medicalWebPage({ path: '/x', name: 'x', description: 'x' }).speakable.cssSelector.includes('.answer'));
  assert.ok(webPage({ path: '/x', name: 'x', description: 'x' }).speakable.cssSelector.includes('.answer'));
});

/* ---------- #183: no reviewedBy pointing at nothing ---------- */

test('no helper or template emits the reviewedBy that pointed at /about#person', () => {
  assert.equal('reviewedBy' in articleSchema({ path: '/x', headline: 'x', description: 'x', updated: '2026-10-01' }), false);
  assert.equal('reviewedBy' in medicalWebPage({ path: '/x', name: 'x', description: 'x' }), false);
  for (const f of ['resources', 'guides', 'compare', 'approaches', 'for']) {
    assert.doesNotMatch(src(`app/${f}/[slug]/page.tsx`), /reviewedBy: personRef/, `${f} still emits it`);
  }
  assert.match(src('scripts/ai-crawl-audit.mjs'), /every @id the structured data references is defined on some page/);
});

/* ---------- #159: the one-pager confirmation ---------- */

test('one-pager signups land on their own confirmation, which says what follows', () => {
  for (const f of ['resources', 'guides', 'compare']) {
    const s = src(`app/${f}/[slug]/page.tsx`);
    assert.match(s, /returnTo="\/one-pager-sent"/, `${f} form`);
    assert.doesNotMatch(s, /returnTo="\/message-sent"/);
  }
  assert.ok(existsSync(join(ROOT, 'app/one-pager-sent/page.tsx')));
  const page = src('app/one-pager-sent/page.tsx');
  assert.match(page, /index: false/);
  assert.match(page, /four days/);
  assert.match(page, /eleven days/);
  assert.match(page, /unsubscribe/i);
  assert.match(page, /<NextConsultLine location="lead-sent"/);
  assert.match(page, /searchParams\?\.lead === 'err'/, 'a failed signup is not told it is on its way');
  assert.doesNotMatch(page.slice(page.indexOf('export default')), /business day|evening|weekend/, 'what the page prints');
  /* The page's day 4 and day 11 are lib/nurture.ts's. If the sequence
     changes, this fails and the page is rewritten with it. */
  assert.match(src('lib/nurture.ts'), /const dueAt = next === 2 \? 4 : 11;/);
  for (const f of ['lib/md-path.ts', 'scripts/sitemap-parity.mjs', 'scripts/cta-audit.mjs']) {
    assert.match(src(f), /\/one-pager-sent/, `${f} does not know the route`);
  }
  assert.match(src('next.config.mjs'), /message-sent\|one-pager-sent\|search/);
});

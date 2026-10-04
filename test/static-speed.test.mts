import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  slotState, firstWhen, openDays, loadAvailability, resetAvailabilityForTests,
  consultLines, daysLines, PACIFIC_LABEL, type ClientAvailability,
} from '../lib/consult-slot.ts';
import { PACIFIC } from '../lib/availability-summary.ts';
import { consultPeople, heroBookingCta, bookingCtaFor } from '../lib/booking-cta.ts';
import { practitioners } from '../lib/practitioners.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* r6-static-speed, 3 Oct 2026: items 429 (static pages, Cliniko lines in a
   client slot), 409 (the next free day under the article heroes) and 441
   (no prefetch from the chrome). */

const src = (f: string) => readFileSync(f, 'utf8');
const people = [
  { slug: 'a', first: 'Ana', href: '/book?with=a#calendar' },
  { slug: 'b', first: 'Bea', href: '/book?with=b#calendar' },
];
const open = (n: number, day = 'Thu 8 Oct'): ClientAvailability[string] => ({
  first: 'x', count: n, next: n ? [`${day} from 10 am (${n} times)`] : [],
});

/* ---------- 429: what the slot prints ---------- */

test('the slot prints days for whoever has one, in the order the page gave', () => {
  const s = slotState({ b: open(2, 'Tue 6 Oct'), a: open(1) }, people);
  assert.equal(s.kind, 'times');
  if (s.kind !== 'times') return;
  assert.deepEqual(s.entries.map((e) => e.slug), ['a', 'b']);
  assert.equal(s.entries[0]!.when, 'Thu 8 Oct from 10 am', 'the count is dropped');
  assert.equal(s.entries[1]!.day, 'Tue 6 Oct', 'a day, no hour, for the hero');
  assert.equal(s.entries[1]!.href, '/book?with=b#calendar');
});

test('the slot never names someone the page did not pass', () => {
  const s = slotState({ a: open(1), z: open(5) }, people.slice(0, 1));
  assert.ok(s.kind === 'times' && s.entries.every((e) => e.slug === 'a'));
});

test('nothing open with everyone read: the ask sentence; anything unknown: nothing', () => {
  const none = slotState({ a: open(0), b: open(0) }, people);
  assert.equal(none.kind, 'none');
  if (none.kind === 'none') assert.match(none.sentence, /^No free consultation is open with Ana or Bea in the next two weeks\.$/);
  /* Cliniko down: the API returns {} or leaves the failed counsellor out. */
  assert.equal(slotState({}, people).kind, 'nothing');
  assert.equal(slotState({ a: open(0) }, people).kind, 'nothing', 'one missing is unknown, not empty');
  assert.equal(slotState(null, people).kind, 'nothing', 'before the answer arrives');
  assert.equal(slotState({ a: open(1) }, []).kind, 'nothing');
});

test('one counsellor: first time and every listed day, or nothing', () => {
  const all = { a: { first: 'Ana', count: 4, next: ['Thu 8 Oct from 10 am (3 times)', 'Fri 9 Oct from 1 pm'] } };
  assert.equal(firstWhen(all, 'a'), 'Thu 8 Oct from 10 am');
  assert.deepEqual(openDays(all, 'a'), all.a.next);
  assert.equal(firstWhen(all, 'b'), null);
  assert.deepEqual(openDays({ a: open(0) }, 'a'), []);
  assert.equal(firstWhen(null, 'a'), null);
});

test('the label is the same Pacific label the server lines use', () => {
  assert.equal(PACIFIC_LABEL, PACIFIC);
});

test('one request per page view, shared; a failure is not kept', async () => {
  resetAvailabilityForTests();
  let calls = 0;
  const ok = async () => { calls++; return { ok: true, json: async () => ({ a: open(1) }) }; };
  const [x, y] = await Promise.all([loadAvailability(ok, 1000), loadAvailability(ok, 2000)]);
  assert.equal(calls, 1);
  assert.deepEqual(x, y);
  await loadAvailability(ok, 1000 + 11 * 60_000);
  assert.equal(calls, 2, 'asked again after ten minutes');

  resetAvailabilityForTests();
  let failed = 0;
  const bad = async () => { failed++; return { ok: false, json: async () => ({}) }; };
  assert.deepEqual(await loadAvailability(bad, 5000), {});
  assert.deepEqual(await loadAvailability(bad, 5001), {});
  assert.equal(failed, 2, 'a failed read is asked again, not cached');
  resetAvailabilityForTests();
});

test('the held height grows with the people named and never goes below one line', () => {
  const one = consultLines([{ first: 'Ana' }]);
  const two = consultLines([{ first: 'Ana' }, { first: 'Bea' }]);
  assert.ok(two[0] >= one[0] && two[1] >= one[1]);
  assert.ok(one[0] >= 2, 'the label and one entry do not fit one phone line');
  const d = daysLines([{ first: 'Ana' }]);
  assert.ok(d[0] >= 1 && d[1] >= 1);
  assert.ok(daysLines([{ first: 'Ana' }], 21)[0] >= d[0]);
});

/* ---------- 429: who a slot may name, decided on the server ---------- */

test('consultPeople keeps the roster rules: accepting, bookable, slugs and language narrow', () => {
  const all = consultPeople({});
  const ok = practitioners.filter((p) => p.acceptingNewClients && p.bookable).map((p) => p.slug);
  assert.deepEqual(all.map((p) => p.slug), ok);
  for (const p of all) assert.match(p.href, new RegExp(`\\?with=${p.slug}#calendar$`));
  assert.ok(!all.some((p) => !practitioners.find((x) => x.slug === p.slug)?.acceptingNewClients), 'nobody not taking clients');
  const pa = consultPeople({ language: 'pa' });
  for (const p of pa) assert.ok(practitioners.find((x) => x.slug === p.slug)!.languages.some((l) => l.tag === 'pa'));
  assert.deepEqual(consultPeople({ slugs: [] }), []);
  const couples = consultPeople({ service: 'couples-therapy' });
  for (const p of couples) assert.match(p.href, /&for=couples#calendar$/);
});

/* ---------- 409: the article hero ---------- */

test('one counsellor fits: the hero button names her and her languages, and opens her calendar', () => {
  const base = bookingCtaFor({ fallback: 'Book a free consultation' });
  const all = consultPeople({});
  assert.deepEqual(heroBookingCta(base, all.length === 1 ? [] : all), base, 'several: unchanged');
  assert.deepEqual(heroBookingCta(base, []), base, 'none: unchanged');
  const one = all.slice(0, 1);
  const p = practitioners.find((x) => x.slug === one[0]!.slug)!;
  const named = heroBookingCta(base, one);
  assert.equal(named.href, one[0]!.href);
  assert.ok(named.label.startsWith(`Book a free consultation with ${p.name.split(' ')[0]} (`), named.label);
  for (const l of p.languages) assert.ok(named.label.includes(l.name), l.name);
  assert.doesNotMatch(named.label, /'/, 'no straight apostrophe');
});

test('the hero day list is counted on its own key, and the five article templates print it once', () => {
  assert.ok(BOOK_LOCATIONS.includes('hero-next-article'));
  assert.equal(BOOK_LOCATIONS[BOOK_LOCATIONS.length - 1], 'hero-next-article', 'appended, no earlier key moved');
  const line = src('components/NextConsultLine.tsx');
  assert.match(line, /<ConsultDays people=\{people\} location="hero-next-article" \/>/);
  for (const f of ['app/guides/[slug]/page.tsx', 'app/resources/[slug]/page.tsx', 'app/compare/[slug]/page.tsx']) {
    const s = src(f);
    const hero = s.indexOf('<HeroNextDays');
    assert.ok(hero > 0 && hero < s.indexOf('<Toc '), `${f}: the line sits in the hero`);
    assert.match(s, /href=\{heroCta\.href\}>\{heroCta\.label\}<\/BookLink>/, f);
  }
  const log = JSON.parse(src('data/changes.json')).changes as { id: string; metric: string; pages: string[] }[];
  const c = log.find((x) => x.id === '2026-10-03-hero-next-article');
  assert.ok(c && c.metric === 'conv:book_click' && c.pages.includes('/pricing'), 'registered as its own change');
});

/* ---------- 429: nothing public revalidates, nothing client imports the roster ---------- */

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|mjs)$/.test(e)) out.push(p.split('\\').join('/'));
  }
  return out;
};

test('no public content route exports revalidate, and none reads Cliniko at render', () => {
  const owned = [
    'app/page.tsx', 'app/guides/[slug]/page.tsx', 'app/resources/[slug]/page.tsx', 'app/compare/[slug]/page.tsx',
    'app/pricing/page.tsx', 'app/services/[slug]/page.tsx', 'app/for/[slug]/page.tsx', 'app/practitioners/page.tsx',
    'app/practitioners/[slug]/page.tsx', 'app/practitioners/[slug]/[place]/page.tsx', 'app/online-counselling/page.tsx',
    'app/online-counselling/[city]/page.tsx', 'app/online-counselling/[city]/[service]/page.tsx',
    'app/punjabi-counselling/[region]/page.tsx',
  ];
  for (const f of owned) {
    const s = src(f);
    assert.doesNotMatch(s, /export const revalidate/, f);
    assert.doesNotMatch(s, /consultationAvailability/, f);
  }
  for (const f of ['components/NextConsultLine.tsx', 'components/CounsellorCompare.tsx', 'components/NextStep.tsx']) {
    assert.doesNotMatch(src(f), /consultationAvailability|cliniko-availability/, f);
  }
  /* Every remaining revalidating page under app/ is one inline-css allows by name or a noindex page. */
  const allowed = ['app/api/', 'app/admin', 'app/message-sent/', 'app/refer/', 'app/for/employers-and-hr/one-pager/'];
  for (const f of walk('app')) {
    if (/export const revalidate/.test(src(f))) assert.ok(allowed.some((a) => f.startsWith(a)), f);
  }
});

test('the client slot never imports the roster or another large data module', () => {
  for (const f of ['components/NextConsultSlot.tsx', 'lib/consult-slot.ts', 'lib/next-consult.ts']) {
    const s = src(f);
    assert.doesNotMatch(s, /from '[^']*(practitioners|tools|booking-cta|city-service-page|cliniko-availability|availability-summary)(\.ts)?'/, f);
  }
  assert.match(src('components/NextConsultSlot.tsx'), /^'use client';/);
  assert.doesNotMatch(src('components/NextConsultLine.tsx'), /^'use client'/m, 'the roster half stays on the server');
});

test('inline-css --check fails an indexable revalidating route; smoke asks 8 templates for the block', () => {
  const s = src('scripts/inline-css.mjs');
  assert.match(s, /const REVALIDATE_ALLOWED = \{/);
  assert.match(s, /if \(failing\.length\) \{[\s\S]*?process\.exit\(1\);/);
  assert.match(s, /noindex/);
  const smoke = src('scripts/smoke.mjs');
  const list = smoke.slice(smoke.indexOf('const TEMPLATES = ['), smoke.indexOf('];', smoke.indexOf('const TEMPLATES = [')));
  assert.equal((list.match(/^\s+'\//gm) ?? []).length, 8);
  assert.match(smoke, /<style data-inlined>/);
  assert.match(smoke, /prerendered\[path\]\?\.initialRevalidateSeconds/);
  assert.match(src('app/api/availability/route.ts'), /max-age=60, s-maxage=1800/);
});

/* ---------- 441: no prefetch from the chrome ---------- */

test('chrome links do not prefetch; the header Book button does', () => {
  for (const f of ['components/Footer.tsx', 'components/ui/TrustBar.tsx', 'components/CityLinks.tsx', 'components/ServiceCityLinks.tsx']) {
    const s = src(f);
    const links = s.match(/<Link\b[^>]*>/g) ?? [];
    assert.ok(links.length > 0, f);
    for (const l of links) assert.match(l, /prefetch=\{false\}/, `${f}: ${l}`);
  }
  const header = src('components/Header.tsx');
  const tags = header.match(/<Link\b[\s\S]*?>/g) ?? [];
  const book = tags.filter((t) => /btn btn--primary/.test(t));
  assert.equal(book.length, 1);
  assert.doesNotMatch(book[0]!, /prefetch/, 'the booking button keeps the default prefetch');
  for (const t of tags.filter((x) => !/btn btn--primary/.test(x))) assert.match(t, /prefetch=\{false\}/, t);
  assert.doesNotMatch(src('components/BookLink.tsx'), /prefetch=\{false\}/);
});

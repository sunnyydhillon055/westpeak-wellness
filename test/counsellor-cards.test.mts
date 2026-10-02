import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { practitioners, insuredProvinces, vancouverToday } from '../lib/practitioners.ts';
import { guides, getGuide } from '../lib/guides.ts';
import { resources, getResource } from '../lib/resources.ts';
import { comparisons } from '../lib/comparisons.ts';
import { GENTLE_CTA, softStepsFor } from '../lib/next-steps.ts';
import { services, getService } from '../lib/services.ts';
import { audiences, getAudience } from '../lib/audiences.ts';
import { locations } from '../lib/locations.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import {
  COUNSELLOR_CARD_LOCATIONS, cardNoun, counsellorsForAudience, counsellorsForCity,
  counsellorsForService, individualFeeLine,
  INFO_CARD_PAGES, NO_CARDS, FEE_LINE_ITEMS, counsellorsForInfoPage, feeLineFor, infoCardCopy, showsInfoCards,
} from '../lib/counsellor-cards.ts';

/* The "who you would see" cards now sit on the service, audience and city
 * hub templates, the hubs answer cost / who / office from data, and their
 * titles carry "Virtual" again. Each is a claim a reader books on, so each
 * has a rule here that does not need a build to check. */

const ROOT = join(import.meta.dirname, '..');
const individualCents = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!.cents;
const INDIVIDUAL = money(individualCents);

const slugs = (ps: { slug: string }[]) => ps.map((p) => p.slug);

test('nobody who is not accepting appears on any card, on any template', () => {
  const all = [
    ...services.map(counsellorsForService),
    ...audiences.map(counsellorsForAudience),
    ...locations.map((l) => counsellorsForCity(l.slug)),
  ].flat();
  for (const p of all) assert.equal(p.acceptingNewClients, true, `${p.slug} named while not accepting`);
  const notAccepting = practitioners.filter((p) => !p.acceptingNewClients).map((p) => p.slug);
  for (const s of notAccepting) assert.ok(!all.some((p) => p.slug === s), `${s} reached a card`);
});

test('service pages: the counsellors who offer the type, or speak the language', () => {
  const individual = counsellorsForService(getService('individual-therapy')!);
  assert.equal(individual.length, 2, 'individual therapy should show both accepting counsellors');
  assert.equal(counsellorsForService(getService('couples-therapy')!).length, 1);
  for (const s of services) {
    const cs = counsellorsForService(s);
    assert.ok(cs.length > 0, `/services/${s.slug} would name nobody`);
    for (const p of cs) {
      assert.ok(p.provinces.includes('BC'), `${p.slug} on a BC service page without BC`);
      if (s.language) assert.ok(p.languages.some((l) => l.tag === s.language), `${p.slug} does not speak ${s.language}`);
      else assert.ok(p.services.includes(s.slug), `${p.slug} does not offer ${s.slug}`);
    }
  }
});

test('audience pages: the language counsellor on a language page, otherwise individual work', () => {
  assert.equal(counsellorsForAudience(getAudience('teachers')!).length, 2);
  for (const a of audiences) {
    const cs = counsellorsForAudience(a);
    assert.ok(cs.length > 0, `/for/${a.slug} would name nobody`);
    for (const p of cs) {
      /* A page with a service names only who offers it, in its language when
         anyone does (2 Oct 2026); checked in the next test. */
      if (a.service) assert.ok(p.services.includes(a.service), `/for/${a.slug} shows ${p.slug}, who does not offer ${a.service}`);
      else if (a.language) {
        assert.ok(p.languages.some((l) => l.tag === a.language), `/for/${a.slug} shows ${p.slug}, who does not speak ${a.language}`);
        assert.equal(p.bookable, true);
      } else {
        assert.ok(p.services.includes('individual-therapy'));
      }
    }
  }
});

test('city hubs: counsellors with a page for the city, two on Surrey', () => {
  assert.equal(counsellorsForCity('surrey').length, 2);
  assert.ok(slugs(counsellorsForCity('surrey')).every((s) => practitioners.find((p) => p.slug === s)!.placePages));
});

test('every card location and the Punjabi hero button are on the book_click allow-list', () => {
  for (const l of [...COUNSELLOR_CARD_LOCATIONS, 'hero-city-pa']) {
    assert.ok(BOOK_LOCATIONS.includes(l), `${l} is not on BOOK_LOCATIONS`);
  }
});

test('the card component stays a server component and prints no registration number', () => {
  const src = readFileSync(join(ROOT, 'components/CounsellorCards.tsx'), 'utf8');
  assert.ok(!/^\s*['"]use client['"]/m.test(src), 'CounsellorCards must not be a client component');
  assert.ok(!/credentials|registration\s*number|\.number\b/i.test(src.replace(/\/\*[\s\S]*?\*\//g, '')),
    'the card reads credential data; registration numbers belong on the profile only');
});

test('the audience fee line is the catalogue figure', () => {
  const line = individualFeeLine(FALLBACK_CATALOG)!;
  assert.match(line, new RegExp(`\\${INDIVIDUAL} for 50 minutes`));
  assert.equal(individualFeeLine({ ...FALLBACK_CATALOG, items: [] }), undefined);
});

test('cardNoun keeps languages and initialisms capitalised', () => {
  assert.equal(cardNoun('Punjabi Counselling'), 'Punjabi counselling');
  assert.equal(cardNoun('Tagalog Counselling'), 'Tagalog counselling');
  assert.equal(cardNoun('Punjabi-Speaking Counselling'), 'Punjabi-speaking counselling');
  assert.equal(cardNoun('EMDR Therapy'), 'EMDR therapy');
  assert.equal(cardNoun('Couples Therapy'), 'couples therapy');
});

/* ---------- wf/guide-templates-next-step, 1 Oct 2026 ---------- */

const src = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const priced = (name: string) => money(FALLBACK_CATALOG.items.find((i) => i.name === name)!.cents);

test('#209 cards by default: off only on NO_CARDS, which is the gentle guides that had none', () => {
  const expected = [...GENTLE_CTA].filter((s) => !INFO_CARD_PAGES.guides.includes(s)).sort();
  assert.deepEqual([...NO_CARDS.guides].sort(), expected, 'NO_CARDS.guides must be GENTLE_CTA minus the guides that already had cards');
  for (const s of NO_CARDS.guides) assert.ok(getGuide(s), `no guide ${s}`);
  for (const s of NO_CARDS.resources) assert.ok(getResource(s), `no resource ${s}`);
  assert.equal(showsInfoCards('resources', 'bc-crisis-and-support-directory'), false);
  assert.equal(showsInfoCards('resources', 'becoming-a-counsellor-in-bc'), false);
  assert.equal(showsInfoCards('guides', 'burnout-vs-depression'), true);
  assert.equal(showsInfoCards('guides', 'grief-without-a-timeline'), false);
  for (const s of INFO_CARD_PAGES.guides) assert.equal(showsInfoCards('guides', s), true, `${s} lost its cards`);
  for (const s of INFO_CARD_PAGES.resources) assert.equal(showsInfoCards('resources', s), true, `${s} lost its cards`);
});

test('#209 every page with cards names somebody accepting, who fits the page', () => {
  type Page = { language?: string; province?: string; service?: string };
  const pages: { slug: string; page: Page }[] = [
    ...guides.filter((g) => showsInfoCards('guides', g.slug)).map((g) => ({ slug: g.slug, page: { service: g.service } })),
    ...resources.filter((r) => showsInfoCards('resources', r.slug, r.whoYouWouldSee)).map((r) => ({ slug: r.slug, page: { language: r.language, province: r.province } })),
  ];
  assert.ok(pages.length > 50, `only ${pages.length} pages carry cards`);
  for (const { slug, page } of pages) {
    const cs = counsellorsForInfoPage(page);
    assert.ok(cs.length > 0, `${slug} names nobody`);
    for (const p of cs) {
      assert.equal(p.acceptingNewClients, true, `${slug}: ${p.slug} is not accepting`);
      if (page.service) assert.ok(p.services.includes(page.service), `${slug}: ${p.slug} does not offer ${page.service}`);
      if (page.language) assert.ok(p.languages.some((l) => l.tag === page.language));
      if (page.province) assert.ok(insuredProvinces(p, vancouverToday()).includes(page.province), `${slug}: ${p.slug} not insured in ${page.province}`);
    }
  }
});

test('#209 a couples guide shows only who does couples work; the Punjabi words page only Punjabi speakers', () => {
  const couples = counsellorsForInfoPage({ service: getGuide('does-couples-therapy-work')!.service });
  const offering = practitioners.filter((p) => p.acceptingNewClients && p.provinces.includes('BC') && p.services.includes('couples-therapy'));
  assert.deepEqual(slugs(couples), slugs(offering));
  assert.equal(couples.length, 1);
  const pa = counsellorsForInfoPage(getResource('counselling-in-punjabi-what-the-words-mean')!);
  assert.ok(pa.length > 0 && pa.every((p) => p.languages.some((l) => l.tag === 'pa')));
});

test('#218 the Alberta resources carry the province and show only who is insured there', () => {
  for (const s of ['counselling-coverage-in-alberta', 'how-to-check-a-counsellor-in-alberta']) {
    assert.equal(getResource(s)!.province, 'AB', `${s} has no province`);
    for (const p of counsellorsForInfoPage(getResource(s)!)) {
      assert.ok(insuredProvinces(p, vancouverToday()).includes('AB'), `${p.slug} on ${s} is not insured for Alberta`);
    }
  }
  assert.equal(resources.filter((r) => r.province).length, 2, 'no other page is an Alberta page');
  assert.match(infoCardCopy(false, 'AB').intro, /in Alberta/);
  assert.doesNotMatch(infoCardCopy(false, 'AB').intro, /across BC/);
});

test('#219 the closing fee line is the catalogue figure for the service the page is about', () => {
  const ind = feeLineFor(undefined, FALLBACK_CATALOG)!;
  assert.equal(ind, `Individual sessions are ${priced('Individual Counselling')} for 50 minutes, after a free 30-minute consultation; card at booking.`);
  const cp = feeLineFor('couples-therapy', FALLBACK_CATALOG)!;
  assert.ok(cp.includes(priced('Couples Counselling')) && cp.includes(priced('Couples Extended')) && cp.includes('110-minute'), cp);
  const em = feeLineFor('emdr-therapy', FALLBACK_CATALOG)!;
  assert.ok(em.includes(priced('EMDR Intensive')) && em.includes(priced('Individual Counselling')), em);
  assert.equal(feeLineFor('family-counselling', FALLBACK_CATALOG), ind, 'family work is not in the catalogue; the individual line stands');
  for (const l of [ind, cp, em]) {
    assert.match(l, /after a free 30-minute consultation; card at booking\.$/);
    assert.doesNotMatch(l, /evening|weekend|most .*plans/i);
  }
  assert.equal(feeLineFor('couples-therapy', { ...FALLBACK_CATALOG, items: [] }), undefined, 'no couples price, no line');
  assert.equal(feeLineFor(undefined, { ...FALLBACK_CATALOG, items: [] }), undefined);
  for (const n of Object.values(FEE_LINE_ITEMS)) assert.ok(FALLBACK_CATALOG.items.some((i) => i.name === n && i.cents > 0), `${n} not priced`);
});

test('#219 price-drift reads the fee line names and finds none missing', async () => {
  const drift = await import('../scripts/price-drift.mjs');
  assert.deepEqual(drift.feeLineNames(src('lib/counsellor-cards.ts')), Object.values(FEE_LINE_ITEMS));
  assert.deepEqual(drift.feeLineGaps(ROOT), []);
});

test('#233 soft steps: the matching tool, fees and the consultation page, never the page itself', () => {
  const all = [
    ...guides.map((g) => ({ path: `/guides/${g.slug}`, slug: g.slug, service: g.service as string | undefined })),
    ...resources.map((r) => ({ path: `/resources/${r.slug}`, slug: r.slug, service: undefined })),
    ...comparisons.map((c) => ({ path: `/compare/${c.slug}`, slug: c.slug, service: c.service as string | undefined })),
  ];
  for (const p of all) {
    const steps = softStepsFor(p);
    assert.ok(steps.length >= 1 && steps.length <= 3, `${p.path}: ${steps.length} steps`);
    assert.ok(steps.every((s) => s.href !== p.path), `${p.path} links itself`);
    assert.ok(steps.some((s) => s.href === '/pricing'), `${p.path} has no fees step`);
    assert.ok(steps.every((s) => s.href !== '/guides'), 'the circular guides rung is gone');
    for (const s of steps.filter((x) => x.href.startsWith('/tools/'))) {
      assert.ok(existsSync(join(ROOT, 'app', s.href, 'page.tsx')), `${s.href} is not a route`);
    }
  }
  assert.equal(softStepsFor({ path: '/guides/x', slug: 'does-couples-therapy-work', service: 'couples-therapy' })[0]!.href, '/tools/which-service');
  assert.equal(softStepsFor({ path: '/guides/x', slug: 'burnout-vs-depression' })[0]!.href, '/tools/burnout-or-depression');
  assert.equal(softStepsFor({ path: '/guides/x', slug: 'high-functioning-anxiety' })[0]!.href, '/tools/stress-check');
  assert.equal(softStepsFor({ path: '/resources/x', slug: 'does-my-plan-cover-counselling-bc' })[0]!.href, '/tools/therapy-cost-bc');
  assert.deepEqual(softStepsFor({ path: '/resources/before-your-first-consultation', slug: 'before-your-first-consultation' }).map((s) => s.href), ['/pricing']);
});

test('#217 the next step sits after Sources and before the link footer on all three templates', () => {
  for (const f of ['guides', 'resources', 'compare']) {
    const s = src(`app/${f}/[slug]/page.tsx`);
    const sources = s.indexOf('id="sources"');
    const step = s.indexOf('<NextStep');
    const related = s.indexOf('<h2>Related pages</h2>');
    const cities = s.indexOf('<CityLinks />');
    assert.ok(sources > 0 && step > sources && related > step && cities > related, `${f}: sources ${sources}, NextStep ${step}, related ${related}`);
    assert.doesNotMatch(s, /<CtaBand/, `${f} renders a second closing band`);
    assert.doesNotMatch(s, /<CounsellorCards/, `${f} draws cards outside NextStep`);
  }
  assert.match(src('app/guides/[slug]/page.tsx'), /location: 'next-guide-close'/);
  assert.match(src('app/resources/[slug]/page.tsx'), /location: 'next-resource-close'/);
  assert.match(src('app/compare/[slug]/page.tsx'), /location: 'next-compare-close'/);
  assert.match(src('app/compare/[slug]/page.tsx'), /export const revalidate = 1800/, 'a consultation time on a page never re-rendered goes stale');
  const ns = src('components/NextStep.tsx');
  assert.ok(!/^\s*['"]use client['"]/m.test(ns), 'NextStep must stay a server component');
  assert.doesNotMatch(ns.replace(/\/\*[\s\S]*?\*\//g, ''), /\bMost\b|evening|weekend/, 'coverage is plan-dependent; no hours');
  for (const l of ['next-guide-close', 'next-resource-close', 'next-compare-close', 'mid-approach', 'hero-approach']) {
    assert.ok(BOOK_LOCATIONS.includes(l), `${l} is not on BOOK_LOCATIONS`);
  }
});

/* ---------- item 362, 2 Oct 2026: the audience page's service ---------- */

test('no counsellor without couples work appears on a couples audience page', () => {
  const couplesPages = audiences.filter((a) => a.service === 'couples-therapy');
  assert.ok(couplesPages.length >= 2, 'premise: /for/couples and /for/punjabi-speaking-couples');
  for (const a of couplesPages) {
    const cs = counsellorsForAudience(a);
    assert.ok(cs.length > 0, `/for/${a.slug} names nobody`);
    for (const p of cs) assert.ok(p.services.includes('couples-therapy'), `/for/${a.slug} offers ${p.slug}, who lists no couples work`);
  }
  /* Language and service with no speaker who offers it: whoever offers it. */
  const paCouples = counsellorsForAudience(getAudience('punjabi-speaking-couples')!);
  assert.deepEqual(slugs(paCouples), slugs(counsellorsForAudience({ service: 'couples-therapy' })));
  /* Language alone is unchanged; neither is the individual rule. */
  for (const p of counsellorsForAudience({ language: 'pa' })) assert.ok(p.languages.some((l) => l.tag === 'pa'));
  assert.deepEqual(slugs(counsellorsForAudience({})), slugs(counsellorsForService(getService('individual-therapy')!)));
});

test('the /for page passes its service to the cards and the next-consult line', () => {
  const page = readFileSync(join(ROOT, 'app/for/[slug]/page.tsx'), 'utf8');
  assert.match(page, /<CounsellorCards\s+counsellors=\{counsellors\}\s+service=\{a\.service\}/);
  assert.match(page, /slugs=\{audienceConsultSlugs\(a\)\}\s+service=\{a\.service\}/);
});

test('the 404 names who is taking new clients, counted under its own location', () => {
  assert.ok(BOOK_LOCATIONS.includes('counsellor-not-found'));
  const nf = readFileSync(join(ROOT, 'app/not-found.tsx'), 'utf8');
  assert.match(nf, /counsellorsForAudience\(\{\}\)\.map/);
  assert.match(nf, /<BookLink location="counsellor-not-found" className="" href=\{bookHrefFor\(\[p\]\)\}>/);
  assert.doesNotMatch(nf, /<CounsellorCards/, 'the photo cards ride in every page’s RSC payload');
  assert.doesNotMatch(nf, /href="\/about"/, 'the founder page is not the 404’s answer to who');
  assert.match(nf, /href="\/practitioners">The counsellors taking new clients</);
  assert.match(nf, /href="\/tagalog"/);
  assert.match(nf, /mailto:/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locations } from '../lib/locations.ts';
import { pairsForCity } from '../lib/city-services.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { counsellorsForCity } from '../lib/counsellor-cards.ts';
import { cityHubFaqs, cityHubTitle, helpCardsFor, htmlLength } from '../lib/city-hub.ts';
import { getAudience } from '../lib/audiences.ts';
import { seoName } from '../lib/city-service-page.ts';
import { getCityTopic } from '../lib/conditions.ts';
// @ts-expect-error -- plain .mjs shared with next.config.mjs; no declaration file
import { REDIRECTS } from '../lib/redirects.mjs';

/* The city hubs: a title that carries "Virtual" again inside the SEO gate's
 * sixty characters as the gate counts them, three questions answered from
 * the catalogue and the roster, and service cards that link the city page
 * their label promises. */

const INDIVIDUAL = money(FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!.cents);

test('every city title says Online, Virtual and Counsellor and fits the SEO gate', () => {
  const seen = new Set<string>();
  for (const l of locations) {
    const t = cityHubTitle(l.displayPlace ?? l.city);
    /* "Virtual" gives way only where the hub carries a second place name
       (White Rock & South Surrey); see cityHubTitle. 1 Oct 2026. */
    const must = l.displayPlace ? ['Online', 'Counsellor', l.city] : ['Online', 'Virtual', 'Counsellor', l.city];
    for (const w of must) assert.ok(t.includes(w), `${t} lacks ${w}`);
    assert.ok(htmlLength(t) <= 60, `${t} is ${htmlLength(t)} as the gate counts it`);
    assert.ok(!seen.has(t), `duplicate title ${t}`);
    seen.add(t);
  }
  assert.equal(cityHubTitle('Surrey'), 'Online & Virtual Counselling in Surrey, BC | Counsellors');
  assert.ok(htmlLength(cityHubTitle('Prince George')) <= 60);
});

/* 2 Oct 2026: names of 14+ characters keep "Virtual" through the comma rung. */
test('long city names keep Online, Virtual and Counsellors within the gate', () => {
  for (const city of ['North Vancouver', 'New Westminster', 'Campbell River', 'Port Coquitlam']) {
    const t = cityHubTitle(city);
    assert.equal(t, `Online, Virtual Counselling ${city} | Counsellors`);
    assert.ok(htmlLength(t) <= 60, `${t} is ${htmlLength(t)}`);
  }
});

const faqsFor = (slug: string) => {
  const l = locations.find((x) => x.slug === slug)!;
  return cityHubFaqs({ city: l.city, counsellors: counsellorsForCity(slug), catalog: FALLBACK_CATALOG, existing: l.faqs ?? [] });
};

test('Surrey gains cost, who and office questions, from data', () => {
  const f = faqsFor('surrey');
  assert.equal(f.length, 3);
  const text = f.map((x) => `${x.q} ${x.a}`).join(' ');
  assert.ok(text.includes(INDIVIDUAL), 'the individual fee from the catalogue');
  assert.ok(text.includes('office in Surrey'));
  assert.ok(text.includes('plan-dependent'), 'coverage is plan-dependent, never promised');
  for (const p of counsellorsForCity('surrey')) assert.ok(text.includes(p.name), `${p.name} missing from who`);
});

test('a city that already asks a question keeps its own', () => {
  assert.ok(!faqsFor('white-rock').some((f) => /office/i.test(f.q)), 'White Rock already asks about an office');
  assert.ok(!faqsFor('chilliwack').some((f) => /cost/i.test(f.q)), 'Chilliwack already asks what a session costs');
});

test('generated hub answers carry no hours, no registration number, no promise of coverage', () => {
  for (const l of locations) {
    for (const f of faqsFor(l.slug)) {
      assert.ok(!/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d\s?(am|pm)|evenings?|weekends?)\b/i.test(f.a), `hours in ${l.slug}: ${f.q}`);
      assert.ok(!/\b\d{4,}\b/.test(f.a), `a number that could be a registration in ${l.slug}: ${f.q}`);
      assert.ok(!/\bwill (be )?cover/i.test(f.a), `coverage promised in ${l.slug}`);
    }
  }
});

test('help cards link the city page the label promises, and only pages that exist', () => {
  const surrey = helpCardsFor('surrey', pairsForCity('surrey'));
  assert.ok(surrey.some((c) => c.href === '/online-counselling/surrey/couples-therapy'));
  assert.ok(surrey.some((c) => c.href === '/services/individual-therapy'), 'no city page for individual therapy: /services');
  for (const l of locations) {
    const here = pairsForCity(l.slug);
    for (const c of helpCardsFor(l.slug, here)) {
      if (c.href.startsWith('/online-counselling/')) {
        assert.ok(here.some((p) => c.href === `/online-counselling/${l.slug}/${p.service}`), `${c.href} is not a generated page`);
      }
    }
    assert.equal(helpCardsFor(l.slug, here).length, here.length ? 3 + here.filter((p) => !['couples-therapy', 'emdr-therapy'].includes(p.service)).length : 3);
  }
});

/* 1 Oct 2026, wf/city-pages: White Rock & South Surrey. */
test('the White Rock hub is titled for both places and fits the gate', () => {
  const wr = locations.find((l) => l.slug === 'white-rock')!;
  assert.equal(wr.displayPlace, 'White Rock & South Surrey');
  const t = cityHubTitle(wr.displayPlace!);
  assert.ok(t.includes('South Surrey'), t);
  assert.ok(htmlLength(t) <= 60, `${t} is ${htmlLength(t)}`);
  assert.match(wr.metaDescription, /^Online and virtual counselling for White Rock and South Surrey/);
  assert.ok(htmlLength(wr.metaDescription) <= 155);
  assert.deepEqual(wr.areaPlaces, [{ name: 'South Surrey', containedIn: 'Surrey' }]);
});

test('the White Rock page drops the unverified lines and cites what it states', () => {
  const wr = locations.find((l) => l.slug === 'white-rock')!;
  const text = JSON.stringify(wr);
  assert.ok(!/Johnston/.test(text), 'the street scraper listings attach to the practice');
  assert.ok(!/substantial/i.test(text), 'a generalisation about a community');
  assert.ok(!/skews older/.test(text), 'an unchecked comparison');
  assert.match(text, /8,185 of White Rock's 21,940/);
  assert.ok(wr.sources!.some((s) => s.url.includes('2021A00055915007')), 'the census profile is cited');
  assert.match(text, /15521 Russell Avenue/);
  assert.ok(wr.sources!.some((s) => s.url.includes('fraserhealth.ca') && /Mental Health Centres/.test(s.label)));
  assert.equal(wr.faqs!.find((f) => /office/i.test(f.q))!.a, 'No. Every session is by secure video; there is no office anywhere.');
  const pa = wr.faqs!.find((f) => /Punjabi/.test(f.q));
  if (pa) assert.match(pa.a, /^Yes, with [A-Z][a-z]+ [A-Z][a-z]+, in Punjabi, English or a mix\.$/);
});

test('South Surrey and Semiahmoo 308 to the White Rock hub, and no page owns either slug', () => {
  const list = REDIRECTS as { source: string; destination: string; permanent: boolean }[];
  for (const slug of ['south-surrey', 'semiahmoo']) {
    const r = list.find((x) => x.source === `/online-counselling/${slug}`);
    assert.ok(r, slug);
    assert.equal(r.destination, '/online-counselling/white-rock');
    assert.equal(r.permanent, true);
    assert.ok(!locations.some((l) => l.slug === slug), `${slug} is a page and a redirect`);
  }
});

test('Surrey links its physical neighbours and names the Peninsula’s own intake', () => {
  const surrey = locations.find((l) => l.slug === 'surrey')!;
  assert.deepEqual(surrey.nearby, ['white-rock', 'langley', 'abbotsford']);
  const body = surrey.localReality!.body.join(' ');
  assert.match(body, /White Rock\/South Surrey Mental Health and Substance Use Centre/);
  assert.ok(body.includes('(/online-counselling/white-rock)'));
  for (const n of surrey.nearby!) assert.ok(locations.some((l) => l.slug === n), `${n} is not a hub`);
});

test('every "Also written for" slug is a real /for page, and the healthcare page links back', () => {
  for (const l of locations) {
    for (const a of l.audiences ?? []) assert.ok(getAudience(a), `${l.slug}: no audience ${a}`);
  }
  for (const slug of ['surrey', 'kelowna', 'kamloops', 'prince-george', 'victoria', 'abbotsford']) {
    const l = locations.find((x) => x.slug === slug)!;
    assert.ok(l.audiences?.includes('healthcare-and-shift-workers'), slug);
  }
  const hc = getAudience('healthcare-and-shift-workers')!;
  for (const c of ['surrey', 'abbotsford', 'victoria']) {
    assert.ok(hc.related.some((r) => r.href === `/online-counselling/${c}`), c);
  }
});

test('hub card anchors use the pair page’s search name', () => {
  const ab = helpCardsFor('abbotsford', pairsForCity('abbotsford'));
  const couples = ab.find((c) => c.slug === 'couples-therapy')!;
  assert.equal(couples.anchor, 'Couples and Marriage Counselling');
  for (const l of locations) {
    for (const c of helpCardsFor(l.slug, pairsForCity(l.slug))) {
      if (!c.href.startsWith('/online-counselling/')) continue;
      assert.equal(c.anchor, seoName(getCityTopic(c.slug)!), `${l.slug}/${c.slug}`);
    }
  }
});

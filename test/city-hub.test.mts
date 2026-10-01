import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locations } from '../lib/locations.ts';
import { pairsForCity } from '../lib/city-services.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { counsellorsForCity } from '../lib/counsellor-cards.ts';
import { cityHubFaqs, cityHubTitle, helpCardsFor, htmlLength } from '../lib/city-hub.ts';

/* The city hubs: a title that carries "Virtual" again inside the SEO gate's
 * sixty characters as the gate counts them, three questions answered from
 * the catalogue and the roster, and service cards that link the city page
 * their label promises. */

const INDIVIDUAL = money(FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!.cents);

test('every city title says Online, Virtual and Counsellor and fits the SEO gate', () => {
  const seen = new Set<string>();
  for (const l of locations) {
    const t = cityHubTitle(l.city);
    for (const w of ['Online', 'Virtual', 'Counsellor', l.city]) assert.ok(t.includes(w), `${t} lacks ${w}`);
    assert.ok(htmlLength(t) <= 60, `${t} is ${htmlLength(t)} as the gate counts it`);
    assert.ok(!seen.has(t), `duplicate title ${t}`);
    seen.add(t);
  }
  assert.equal(cityHubTitle('Surrey'), 'Online & Virtual Counselling in Surrey, BC | Counsellors');
  assert.ok(htmlLength(cityHubTitle('Prince George')) <= 60);
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

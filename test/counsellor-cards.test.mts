import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { practitioners } from '../lib/practitioners.ts';
import { services, getService } from '../lib/services.ts';
import { audiences, getAudience } from '../lib/audiences.ts';
import { locations } from '../lib/locations.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import {
  COUNSELLOR_CARD_LOCATIONS, cardNoun, counsellorsForAudience, counsellorsForCity,
  counsellorsForService, individualFeeLine,
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
      if (a.language) {
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

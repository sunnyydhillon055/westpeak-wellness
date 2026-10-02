import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-expect-error -- plain .mjs shared with next.config.mjs; no declaration file
import { REDIRECTS, RETIRED_TOWN_HOMES, RETIRED_CITY_SLUGS } from '../lib/redirects.mjs';
// @ts-expect-error -- plain .mjs script helper; no declaration file
import { findChains } from '../scripts/redirect-chains.mjs';
import { locations, getLocation, albertaLine, albertaFaq, albertaCounsellors } from '../lib/locations.ts';
import { townFinder, healthAuthorityFor } from '../lib/health-authorities.ts';
import { recordedPractitioners } from '../lib/practitioners.ts';

/* The 1 Oct 2026 regional work: retired towns land on the page that names
 * them, Penticton and Fort St. John have pages, the index groups every town
 * by health authority, and the Alberta sentence follows the insurance gate. */

type R = { source: string; destination: string; permanent: boolean };
type Home = { town: string; home: string };
const list = REDIRECTS as R[];
const homes = RETIRED_TOWN_HOMES as Record<string, Home>;
const dest = (slug: string) => list.find((r) => r.source === `/online-counselling/${slug}`)?.destination;

test('each mapped retired town 308s, in one hop, to a city page whose communities name it', () => {
  for (const [slug, { town, home }] of Object.entries(homes)) {
    assert.ok((RETIRED_CITY_SLUGS as string[]).includes(slug), `${slug} is mapped but not retired`);
    assert.equal(dest(slug), `/online-counselling/${home}`, slug);
    const l = getLocation(home);
    assert.ok(l, `${home} has no page`);
    assert.ok(l.communities?.includes(town), `${home} does not name ${town}`);
    assert.equal(healthAuthorityFor(slug)?.label, healthAuthorityFor(home)?.label, `${slug} and ${home} are under different authorities`);
  }
  assert.equal(dest('vernon'), '/online-counselling/kelowna');
  assert.equal(dest('duncan'), '/online-counselling/nanaimo');
  assert.equal(dest('mission'), '/online-counselling/abbotsford');
  // Saanich has its own hub since 2 Oct 2026; the old combined slug is an alias for it.
  assert.equal(dest('victoria-saanich'), '/online-counselling/saanich');
  assert.ok(!(RETIRED_CITY_SLUGS as string[]).includes('victoria-saanich'));
  // Maple Ridge has its own hub since 2 Oct 2026, and Pitt Meadows lands on it.
  assert.equal(dest('pitt-meadows'), '/online-counselling/maple-ridge');
  assert.deepEqual(findChains(list), []);
});

test('an unmapped retired town still lands on the index, and every retired redirect is permanent', () => {
  for (const slug of ['whistler', 'cranbrook', 'nelson', 'courtenay']) assert.equal(dest(slug), '/online-counselling', slug);
  for (const slug of RETIRED_CITY_SLUGS as string[]) {
    assert.ok(list.find((r) => r.source === `/online-counselling/${slug}`)?.permanent, slug);
  }
});

test('no slug is both retired and a page: Penticton and Fort St. John are pages now', () => {
  for (const l of locations) assert.ok(!(RETIRED_CITY_SLUGS as string[]).includes(l.slug), `${l.slug} would build and 308`);
  assert.ok(getLocation('penticton'));
  assert.ok(getLocation('fort-st-john'));
  assert.equal(dest('penticton'), undefined);
  assert.equal(dest('fort-st-john'), undefined);
  assert.ok(getLocation('saanich'));
  assert.equal(dest('saanich'), undefined);
  assert.ok(getLocation('maple-ridge'));
  assert.equal(dest('maple-ridge'), undefined);
});

test('the new pages and the community edits', () => {
  const pg = getLocation('prince-george')!;
  assert.ok(!pg.communities!.includes('Fort St. John'), 'Fort St. John has its own page');
  assert.ok(pg.nearby!.includes('fort-st-john'));
  const kel = getLocation('kelowna')!;
  assert.ok(!kel.communities!.includes('Penticton'));
  assert.ok(kel.nearby!.includes('penticton'));
  assert.ok(kel.access!.some((a) => a.detail.includes('](/online-counselling/penticton)')), 'Kelowna links Penticton');
  assert.ok(!kel.faqs!.some((f) => f.q.includes('Penticton')));
  assert.deepEqual(getLocation('victoria')!.nearby, ['saanich', 'nanaimo', 'vancouver']);
  for (const t of ['Saanich', 'Sidney']) assert.ok(!getLocation('victoria')!.communities!.includes(t), `${t} is on the Saanich page`);
  assert.ok(getLocation('victoria')!.localReality!.body.some((b) => b.includes('](/online-counselling/saanich)')), 'Victoria links Saanich');
  assert.ok(getLocation('victoria')!.localReality!.body.some((b) => b.includes('](/online-counselling/nanaimo)')));
  for (const t of ['Duncan', 'Chemainus', 'Port Alberni']) assert.ok(getLocation('nanaimo')!.communities!.includes(t), t);
  for (const t of ['Williams Lake', '100 Mile House', 'Clearwater', 'Revelstoke']) assert.ok(getLocation('kamloops')!.communities!.includes(t), t);
  for (const t of ['Pitt Meadows', 'Haney', 'Whonnock']) assert.ok(getLocation('maple-ridge')!.communities!.includes(t), t);
  for (const slug of ['langley', 'coquitlam']) assert.ok(getLocation(slug)!.nearby!.includes('maple-ridge'), `${slug} links Maple Ridge`);
  for (const slug of ['penticton', 'fort-st-john', 'saanich', 'maple-ridge']) {
    const l = getLocation(slug)!;
    assert.ok(healthAuthorityFor(slug), `${slug} has an authority`);
    assert.ok(l.metaDescription.replace(/&/g, '&amp;').length <= 155, `${slug} description`);
    for (const n of l.nearby!) assert.ok(getLocation(n), `${slug} nearby ${n} is a page`);
    const text = JSON.stringify(l);
    assert.doesNotMatch(text, /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|evenings?|weekends?|\d\s?(am|pm))\b/i, `${slug} states hours`);
    assert.doesNotMatch(text, /\bwait(ing)?[- ]?(list|time)s? (of|is|are) \d/i, `${slug} states a wait time`);
  }
  assert.ok(getLocation('penticton')!.localReality!.body.join(' ').includes('/services/emdr-therapy'));
  assert.ok(getLocation('fort-st-john')!.localReality!.body.join(' ').includes('/for/rotational-and-camp-workers'));
});

const base = { name: 'A', slug: 'a', acceptingNewClients: true, provinces: ['BC', 'AB'] };

test('the Alberta sentence names who the insurance gate lets through, and nobody else', () => {
  const insured = { ...base, insurance: { validTo: '2026-12-31' } } as never;
  const lapsed = { ...base, name: 'B', slug: 'b', insurance: { validTo: '2026-01-01' } } as never;
  const bcOnly = { ...base, name: 'C', slug: 'c', provinces: ['BC'], insurance: { validTo: '2026-12-31' } } as never;
  const closed = { ...base, name: 'D', slug: 'd', acceptingNewClients: false, insurance: { validTo: '2026-12-31' } } as never;
  const line = albertaLine([insured, lapsed, bcOnly, closed], '2026-10-01');
  assert.match(line, /^ \[A\]\(\/practitioners\/a\) is the one counsellor/);
  assert.ok(!/\[B\]|\[C\]|\[D\]/.test(line));
  assert.equal(albertaLine([lapsed, bcOnly, closed], '2026-10-01'), '', 'gate closed: the sentence goes');
  assert.equal(albertaFaq([lapsed], '2026-10-01'), '');
  assert.match(albertaFaq([insured], '2026-10-01'), /one counsellor here can/);
  assert.ok(!/\bA\b/.test(albertaFaq([insured], '2026-10-01')), 'the FAQ names nobody');
  const two = albertaLine([insured, { ...base, name: 'E', slug: 'e', insurance: { validTo: '2026-12-31' } } as never], '2026-10-01');
  assert.match(two, /\[A\].* and \[E\].* hold certification/);
});

test('the founder is never named by the Alberta sentence', () => {
  const ab = albertaCounsellors(recordedPractitioners, '2026-10-01');
  assert.ok(!ab.some((p) => p.slug === 'aman-bains-dhillon'));
  const fsj = getLocation('fort-st-john')!;
  assert.ok(!JSON.stringify(fsj).includes('Aman'));
});

test('the town finder groups every city by its authority and lists each town once', () => {
  const groups = townFinder(locations);
  assert.deepEqual(groups.map((g) => g.authority.label), ['Fraser Health', 'Vancouver Coastal Health', 'Island Health', 'Interior Health', 'Northern Health']);
  const cities = groups.flatMap((g) => g.cities.map((c) => c.slug));
  assert.deepEqual([...cities].sort(), locations.map((l) => l.slug).sort(), 'every city page appears once');
  const towns = groups.flatMap((g) => g.cities.flatMap((c) => c.towns));
  assert.equal(new Set(towns).size, towns.length, 'no town twice');
  for (const t of towns) assert.ok(!locations.some((l) => l.city === t), `${t} has a page and should be a link, not text`);
  const interior = groups.find((g) => g.authority.label === 'Interior Health')!;
  assert.ok(interior.cities.some((c) => c.slug === 'penticton' && c.towns.includes('Osoyoos')));
  const northern = groups.find((g) => g.authority.label === 'Northern Health')!;
  assert.ok(northern.cities.some((c) => c.slug === 'fort-st-john' && c.towns.includes('Dawson Creek')));
});

test('a town named by two cities is listed under the first, and an unknown slug is skipped', () => {
  const g = townFinder([
    { slug: 'surrey', city: 'Surrey', communities: ['South Surrey', 'Newton'] },
    { slug: 'white-rock', city: 'White Rock', communities: ['South Surrey', 'Ocean Park'] },
    { slug: 'nowhere', city: 'Nowhere', communities: ['X'] },
  ]);
  assert.equal(g.length, 1);
  assert.deepEqual(g[0].cities.map((c) => c.towns), [['South Surrey', 'Newton'], ['Ocean Park']]);
});

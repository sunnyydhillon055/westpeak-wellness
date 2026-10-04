import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practitioners, getPractitioner } from '../lib/practitioners.ts';
import { services } from '../lib/services.ts';
import { reachPhrase, practiceReach, bookingPathFor, offeredBy, personAreaServed } from '../lib/practice-facts.ts';
import { profileTitle, placeTitle, TITLE_MAX } from '../lib/practitioner-titles.ts';
import { placesFor } from '../lib/practitioner-places.ts';
import { nextConsultEntries } from '../lib/next-consult.ts';

/* The machine-readable facts (llms.txt, ai.json, the Person node) are derived
   from the roster by lib/practice-facts.ts; the titles by
   lib/practitioner-titles.ts. Added 1 Oct 2026 with both. */

const camille = getPractitioner('camille-granda')!;
const savneet = getPractitioner('savneet-singh')!;
const accepting = practitioners.filter((p) => p.acceptingNewClients);

test('reach comes from the roster: provinces for Camille (Canada-wide removed 3 Oct 2026), BC for Savneet', () => {
  assert.match(reachPhrase(camille), /^British Columbia/);
  assert.equal(reachPhrase({ ...camille, reach: 'canada' }), 'anywhere in Canada');
  assert.equal(reachPhrase(savneet), 'British Columbia');
  assert.match(practiceReach(accepting), /British Columbia/);
  assert.doesNotMatch(practiceReach(accepting), /Canada/);
  assert.match(practiceReach([...accepting.filter((p) => p !== camille), { ...camille, reach: 'canada' }]), /anywhere in Canada with Camille/);
  assert.deepEqual(personAreaServed({ ...camille, reach: 'canada' }), { '@type': 'Country', name: 'Canada' });
  assert.notDeepEqual(personAreaServed(camille), { '@type': 'Country', name: 'Canada' });
  assert.deepEqual(personAreaServed(savneet), { '@type': 'State', name: 'British Columbia' });
  assert.equal(bookingPathFor('savneet-singh'), '/book?with=savneet-singh');
});

test('every service is offered by someone, and only by who the roster says', () => {
  for (const s of services) assert.ok(offeredBy(s.slug, accepting).length > 0, `${s.slug} has nobody`);
  const names = (slug: string) => offeredBy(slug, accepting).map((p) => p.slug);
  assert.deepEqual(names('couples-therapy'), ['camille-granda'], 'Savneet does not take couples');
  assert.deepEqual(names('punjabi-counselling'), ['savneet-singh']);
  assert.deepEqual(names('tagalog-counselling'), ['camille-granda']);
  assert.deepEqual(names('individual-therapy').sort(), ['camille-granda', 'savneet-singh']);
});

test('no Psychology Today profile is published as anyone\'s sameAs until verified', () => {
  /* The listings carry another practice's facts (Apollo Counselling, $150,
     a 15-minute consultation; a provisional psychologist in Edmonton). Add a
     URL here only after reading the listing and finding it matches the site. */
  const VERIFIED: string[] = [];
  for (const p of practitioners) {
    for (const u of p.sameAs ?? []) {
      if (/psychologytoday\.com/i.test(u)) assert.ok(VERIFIED.includes(u), `${p.slug}: unverified ${u}`);
    }
  }
});

test('profile titles lead with the person and the non-English language, within 60', () => {
  for (const p of practitioners) {
    const t = profileTitle(p);
    assert.ok(t.length <= TITLE_MAX, `${t} is ${t.length}`);
    assert.ok(t.startsWith(p.name), t);
    for (const l of p.languages.filter((x) => !x.tag.startsWith('en'))) assert.ok(t.includes(l.name), `${t} lacks ${l.name}`);
    assert.doesNotMatch(t, /&/);
  }
  assert.match(profileTitle(camille), /Tagalog/);
  assert.doesNotMatch(profileTitle(camille), /Canada/);
  assert.match(profileTitle(savneet), /Punjabi/);
  assert.match(profileTitle(savneet), /BC/);
});

test('place titles fit, name the language, and differ between counsellors in one city', () => {
  const seen = new Set<string>();
  for (const p of practitioners.filter((x) => x.placePages)) {
    for (const l of placesFor(p.provinces)) {
      const t = placeTitle(p, l.city);
      assert.ok(t.length <= TITLE_MAX, `${t} is ${t.length}`);
      assert.ok(t.startsWith(p.name), t);
      assert.ok(t.includes(l.city), t);
      for (const lang of p.languages.filter((x) => !x.tag.startsWith('en'))) assert.ok(t.includes(lang.name), t);
      assert.ok(!seen.has(t), `duplicate ${t}`);
      seen.add(t);
      assert.doesNotMatch(t, /^Counselling in/);
    }
  }
});

test('the next-consultation line: first day per accepting counsellor, nothing on failure', () => {
  const roster = [
    { slug: 'a', name: 'Ann Lee', acceptingNewClients: true, bookable: true },
    { slug: 'b', name: 'Bea Ko', acceptingNewClients: true, bookable: true },
    { slug: 'c', name: 'Cy Do', acceptingNewClients: false, bookable: true },
  ];
  const all = {
    a: { slug: 'a', count: 5, next: ['Thu 2 Oct from 10 am (4 times)', 'Fri 3 Oct from 9 am'] },
    b: { slug: 'b', count: 0, next: [], error: 'HTTP 500' },
    c: { slug: 'c', count: 3, next: ['Mon 6 Oct from 1 pm'] },
  };
  assert.deepEqual(nextConsultEntries(all, roster), [{ slug: 'a', first: 'Ann', when: 'Thu 2 Oct from 10 am' }]);
  assert.deepEqual(nextConsultEntries(null, roster), []);
  assert.deepEqual(nextConsultEntries({ a: { slug: 'a', count: 0, next: [] } }, roster), []);
});

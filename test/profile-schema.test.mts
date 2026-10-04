import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { profilePageProblems, recordPersonUrls, personUrlProblems } from '../scripts/lib/schema-checks.mjs';
import {
  personStub, personDescription, credentialLine, certifiedBy, notOfferedSentence, notOffered,
} from '../lib/practitioner-facts.ts';
import { onlineInLong } from '../lib/practitioner-titles.ts';
import { recordedPractitioners, practitioners } from '../lib/practitioners.ts';

/* Item 235: ProfilePage subjects named on the page, one url per Person.
 * Item 241: the profile's credential line, reach heading and not-offered
 * sentence. 1 Oct 2026. */

const D = 'https://example.test';
const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
const savneet = recordedPractitioners.find((p) => p.slug === 'savneet-singh')!;

test('a ProfilePage pointing at a #person not on the page is reported', () => {
  const bare = { '@type': 'ProfilePage', '@id': `${D}/x#page`, mainEntity: { '@id': `${D}/practitioners/a#person` } };
  assert.equal(profilePageProblems([bare]).length, 1);
  /* Resolved on the page by @id, or inline with a name. */
  const person = { '@type': 'Person', '@id': `${D}/practitioners/a#person`, name: 'A' };
  assert.deepEqual(profilePageProblems([[person, bare]]), []);
  assert.deepEqual(profilePageProblems([{ ...bare, mainEntity: person }]), []);
  /* A WebPage is not held to it. */
  assert.deepEqual(profilePageProblems([{ ...bare, '@type': 'WebPage' }]), []);
});

test('a Person @id with two urls across the build is reported', () => {
  const seen = new Map();
  const id = `${D}/practitioners/a#person`;
  recordPersonUrls([{ '@type': 'Person', '@id': id, url: `${D}/practitioners/a` }], '/practitioners/a', seen);
  assert.deepEqual(personUrlProblems(seen), []);
  recordPersonUrls([[{ '@type': 'Person', '@id': id, url: `${D}/practitioners/a/surrey` }]], '/online-counselling/surrey', seen);
  assert.equal(personUrlProblems(seen).length, 1);
});

test('the inline Person carries a name and the canonical profile url', () => {
  const s = personStub(camille, D);
  assert.equal(s['@id'], `${D}/practitioners/camille-granda#person`);
  assert.equal(s.url, `${D}/practitioners/camille-granda`);
  assert.equal(s.name, 'Camille Granda');
  assert.ok(s.knowsLanguage.includes('tl'));
});

test('no place or twin page points mainEntity at a bare #person any more', () => {
  for (const f of [
    'app/practitioners/[slug]/[place]/page.tsx',
    'app/practitioners/[slug]/[place]/pa/page.tsx',
    'app/practitioners/[slug]/[place]/tl/page.tsx',
  ]) {
    const src = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /mainEntity: \{ '@id': `\$\{site\.domain\}\/practitioners\/\$\{p\.slug\}#person` \}/, f);
  }
  const city = readFileSync(new URL('../app/online-counselling/[city]/page.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(city, /url: `\$\{site\.domain\}\/practitioners\/\$\{p\.slug\}\/\$\{l\.slug\}`/);
});

test('the Person description is built from the roster', () => {
  assert.equal(
    personDescription(savneet),
    'Savneet Singh is a Registered Clinical Counsellor offering individual counselling by secure video across British Columbia, in English and Punjabi.',
  );
  /* 3 Oct 2026: her Canada-wide reach was removed; provinces decide. */
  assert.doesNotMatch(personDescription(camille), /Canada/);
  assert.match(personDescription(camille), /British Columbia/);
  assert.doesNotMatch(personDescription(camille), /\d/);
});

test('credentials are spelled out with where they carry weight', () => {
  assert.equal(
    credentialLine(camille),
    'Registered Clinical Counsellor (RCC), BC · Canadian Certified Counsellor (CCC), national',
  );
  assert.deepEqual(certifiedBy(camille), ['The CCC is certified by the Canadian Counselling and Psychotherapy Association.']);
  assert.deepEqual(certifiedBy(savneet), []);
});

test('the reach heading follows reach, not a hard-coded BC', () => {
  assert.equal(onlineInLong({ ...camille, reach: 'canada' }), 'Canada');
  assert.match(onlineInLong(camille), /^British Columbia/);
  assert.equal(onlineInLong(savneet), 'British Columbia');
  assert.equal(onlineInLong({ ...savneet, provinces: ['BC', 'AB'] }), 'British Columbia and Alberta');
});

test('the not-offered line is a sentence', () => {
  const missing = notOffered(savneet, practitioners);
  const line = notOfferedSentence('Savneet', missing)!;
  assert.equal(line.lead, 'Savneet does not offer couples counselling, EMDR or family counselling');
  if (missing.every((m) => m.by.some((b) => b.slug === 'camille-granda'))) {
    assert.deepEqual(line.by.map((b) => b.name), ['Camille Granda']);
    assert.equal(line.verb, 'does');
  }
  assert.equal(notOfferedSentence('X', []), null);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { site } from '../lib/site.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { firstSessionOffers, firstSessionNote, FIRST_SESSION_COUPLES } from '../lib/first-session.ts';
import { recordedPractitioners } from '../lib/practitioners.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { getService } from '../lib/services.ts';

/* Item 211: "Already sure? Start with a first session", built behind a flag
 * that stays off until the owner records the decision. 1 Oct 2026. */

const savneet = recordedPractitioners.find((p) => p.slug === 'savneet-singh')!;
const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
const founder = recordedPractitioners.find((p) => /founder/i.test(p.role))!;
const individual = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!;
const couples = FALLBACK_CATALOG.items.find((i) => i.name === 'Couples Counselling')!;

test('the flag is off until the owner records it in DECISIONS.md', () => {
  assert.equal(site.directFirstSession, false);
  assert.deepEqual(FIRST_SESSION_COUPLES, []);
});

test('the day it flips, data/changes.json must carry a first-session entry', () => {
  const log = JSON.parse(readFileSync(new URL('../data/changes.json', import.meta.url), 'utf8'));
  const logged = log.changes.some((c: { id: string }) => /first-session/.test(c.id));
  if (site.directFirstSession) assert.ok(logged, 'add a data/changes.json entry for the first-session row');
});

test('nothing is offered while the flag is off', () => {
  assert.deepEqual(firstSessionOffers(savneet, FALLBACK_CATALOG), []);
});

test('on, an accepting counsellor gets her individual session at the catalogue fee', () => {
  const [o, ...rest] = firstSessionOffers(savneet, FALLBACK_CATALOG, true);
  assert.equal(rest.length, 0);
  assert.equal(o!.minutes, individual.minutes);
  assert.equal(o!.fee, money(individual.cents));
  assert.match(o!.href, new RegExp(`appointment_type_id=${individual.id}&practitioner_id=${savneet.clinikoPractitionerId}$`));
});

test('couples only for a counsellor the owner includes', () => {
  assert.equal(firstSessionOffers(camille, FALLBACK_CATALOG, true).length, 1);
  const both = firstSessionOffers(camille, FALLBACK_CATALOG, true, ['camille-granda']);
  assert.deepEqual(both.map((o) => o.label), ['individual session', 'couples session']);
  assert.match(both[1]!.href, new RegExp(`appointment_type_id=${couples.id}&`));
});

test('never the founder, and never someone not taking new clients', () => {
  assert.deepEqual(firstSessionOffers(founder, FALLBACK_CATALOG, true), []);
  assert.deepEqual(firstSessionOffers({ ...savneet, acceptingNewClients: false }, FALLBACK_CATALOG, true), []);
});

test('the note keeps the consultation recommended and the 24-hour rule', () => {
  const n = firstSessionNote(FALLBACK_CATALOG);
  assert.match(n, /free 15-minute consultation is still recommended/);
  assert.match(n, /at least 24 hours’ notice gets a full refund/);
  assert.match(n, /50% of the fee is kept/);
  assert.doesNotMatch(n, /evening|weekend|\bhours\b.*open/i);
});

test('the click is a counted book location', () => {
  assert.ok(BOOK_LOCATIONS.includes('first-session'));
});

test('the individual-therapy answer follows the flag', () => {
  const a = getService('individual-therapy')!.directAnswer!;
  assert.match(a, site.directFirstSession ? /is free and recommended/ : /A free 15-minute consultation comes first/);
});

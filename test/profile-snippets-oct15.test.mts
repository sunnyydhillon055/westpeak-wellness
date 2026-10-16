import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPractitioner, practitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { OFFERINGS } from '../lib/practitioner-facts.ts';
import { placesFor, placeDescription, SERVICE_CLAIMS } from '../lib/practitioner-places.ts';
import { cardFocusLine } from '../lib/card-focus.ts';
import { profileDescription, rosterDescription, metaLength, SNIPPET_MAX } from '../lib/snippet-facts.ts';
import { rosterOrder } from '../lib/practitioner-facts.ts';

/* 15 Oct 2026, items 524, 531, 533 and 543: what each counsellor works with
   beside her fee, the page's own service first on her card, the fee on the
   place pages, and a roster description built from who is taking clients. */

const camille = getPractitioner('camille-granda')!;
const savneet = getPractitioner('savneet-singh')!;
const catalog = FALLBACK_CATALOG;
const individual = money(catalog.items.find((i) => i.name === 'Individual Counselling')!.cents);
const notOfferedBy = (p: typeof camille) => OFFERINGS.filter((o) => !p.services.includes(o.service));

test('a couples page card leads with couples counselling for a counsellor who offers it', () => {
  const line = cardFocusLine(camille, 'couples-therapy');
  assert.equal(line[0], 'Couples counselling');
  assert.equal(line.length, 3);
  assert.equal(cardFocusLine(camille, 'emdr-therapy')[0], 'EMDR');
});

test('a card never leads with a service its counsellor lacks, and individual pages keep three focus labels', () => {
  for (const p of practitioners) {
    for (const o of OFFERINGS) {
      const line = cardFocusLine(p, o.service);
      if (!p.services.includes(o.service) || o.service === 'individual-therapy') {
        assert.deepEqual(line, p.focus.slice(0, 3).map((f) => f.label), `${p.slug} on ${o.service}`);
      }
    }
  }
  assert.ok(!savneet.services.includes('couples-therapy'), 'the guard below needs a counsellor without couples work');
  assert.doesNotMatch(cardFocusLine(savneet, 'couples-therapy').join(' '), /couples/i);
});

test('profile descriptions keep what she works with beside the fee, inside the money-page limit', () => {
  const c = profileDescription(catalog, camille, 'unused');
  const s = profileDescription(catalog, savneet, 'unused');
  assert.match(c, /EMDR/);
  assert.match(c, /couples/);
  assert.match(c, /trauma/);
  assert.match(s, /anxiety/);
  assert.match(s, /depression/);
  for (const d of [c, s]) {
    assert.ok(d.includes(individual), d);
    assert.match(d, /free 15-min consult/);
    assert.ok(metaLength(d) <= SNIPPET_MAX, `${metaLength(d)}: ${d}`);
  }
  for (const o of notOfferedBy(savneet)) {
    const rx = SERVICE_CLAIMS[o.service];
    if (rx) assert.doesNotMatch(s, rx, `Savneet's description offers ${o.label}`);
  }
});

test('place descriptions carry her fee and the free consult, and never a service she lacks', () => {
  for (const p of practitioners) {
    if (!p.placePages) continue;
    for (const raw of placesFor(p.provinces)) {
      const d = placeDescription(p, raw.city, catalog);
      /* With a fee, the money-page limit; a city name too long for the fee
         beside her first topic keeps the old ending whole, inside 158. */
      if (d.includes('$')) assert.ok(metaLength(d) <= SNIPPET_MAX, `${p.slug}/${raw.slug} is ${metaLength(d)}`);
      else assert.ok(metaLength(d) <= 158 && d.endsWith('Free 15-minute consultation.'), `${p.slug}/${raw.slug}: ${d}`);
      assert.ok(!d.endsWith('…'), `${p.slug}/${raw.slug} was cut: ${d}`);
      for (const o of notOfferedBy(p)) {
        const rx = SERVICE_CLAIMS[o.service];
        if (rx) assert.doesNotMatch(d, rx, `${p.slug}/${raw.slug} offers ${o.label}`);
      }
    }
  }
  assert.match(placeDescription(savneet, 'Penticton', catalog), new RegExp(`^Savneet Singh, RCC: .*one to one\\. \\${individual} per 50 min · free 15-min consult\\.$`));
  assert.match(placeDescription(camille, 'Kelowna', catalog), new RegExp(`From \\${individual} per 50 min · free 15-min consult\\.$`));
});

test('the roster description names only counsellors taking new clients, with their languages and the fee', () => {
  const d = rosterDescription(catalog, rosterOrder(practitioners), 'typed');
  for (const p of practitioners) {
    if (p.acceptingNewClients) assert.ok(d.includes(p.name), `${p.name} missing: ${d}`);
    else assert.ok(!d.includes(p.name), `${p.name} named but not taking new clients`);
  }
  assert.ok(d.includes(individual));
  assert.ok(metaLength(d) <= SNIPPET_MAX, `${metaLength(d)}: ${d}`);
  assert.equal(rosterDescription(catalog, practitioners.filter((p) => !p.acceptingNewClients), 'typed'), 'typed');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairs } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { cityContexts } from '../lib/city-context.ts';
import { getLocation } from '../lib/locations.ts';
import { practitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import {
  bookHrefFor, counsellorsFor, feeFor, generatedFaqs, profileHrefFor, listOf,
} from '../lib/city-service-page.ts';

/* The city x service pages now name counsellors, state a fee and generate
 * three FAQs from data. Each of those is a claim a client books on, so each
 * has a rule here: nobody who is not accepting is named, the fee is the
 * catalogue's and differs where the catalogue's does, and no two pages carry
 * the same generated answer (the uniqueness gate checks the rendered page;
 * this checks the data before a build is needed). */

const loaded = pairs.map((p) => {
  const topic = getCityTopic(p.service)!;
  const ctx = cityContexts.find((c) => c.slug === p.city)!;
  const loc = getLocation(p.city)!;
  return { p, topic, ctx, loc };
});

test('every pair has at least one counsellor who could take the work', () => {
  for (const { p, topic } of loaded) {
    assert.ok(counsellorsFor(topic).length > 0,
      `${p.city}/${p.service} would name nobody; the block hides and the page offers a service nobody is accepting`);
  }
});

test('only counsellors accepting new clients, insured for BC and offering the type are named', () => {
  for (const { topic } of loaded) {
    for (const c of counsellorsFor(topic)) {
      assert.equal(c.acceptingNewClients, true, `${c.slug} is named while not accepting`);
      assert.ok(c.provinces.includes('BC'), `${c.slug} is named on a BC page without BC`);
      assert.ok(c.services.includes(topic.bookingService), `${c.slug} does not offer ${topic.bookingService}`);
    }
  }
  /* The founder is off the roster for new clients; her name must not appear
     on any of these pages, which a build gate also enforces. */
  const founder = practitioners.find((x) => !x.acceptingNewClients);
  if (founder) {
    for (const { topic } of loaded) {
      assert.ok(!counsellorsFor(topic).some((c) => c.slug === founder.slug));
    }
  }
});

test('?with= narrows to one calendar only when there is one calendar it could be', () => {
  for (const { topic } of loaded) {
    const cs = counsellorsFor(topic);
    const href = bookHrefFor(cs);
    if (cs.length === 1) assert.equal(href, `/book?with=${cs[0].slug}`);
    else assert.equal(href, '/book');
  }
});

test('a counsellor links to her page for the city when she has one', () => {
  const camille = practitioners.find((x) => x.slug === 'camille-granda')!;
  assert.equal(profileHrefFor(camille, 'vancouver'), '/practitioners/camille-granda/vancouver');
  assert.equal(profileHrefFor({ ...camille, placePages: false }, 'vancouver'), '/practitioners/camille-granda');
});

test('the fee is the catalogue entry for the type the topic books into', () => {
  const fees = new Map<string, string>();
  for (const { p, topic } of loaded) {
    const f = feeFor(FALLBACK_CATALOG, topic);
    assert.ok(f, `${p.city}/${p.service} has no fee; the line would print without a number`);
    fees.set(topic.bookingService, `${f.fee}/${f.minutes}`);
  }
  /* The bug this replaces: one typed figure on all fifty pages. Couples and
     EMDR bill differently from individual work on the catalogue, so the
     pages must now differ too. */
  assert.notEqual(fees.get('couples-therapy'), fees.get('individual-therapy'));
  assert.notEqual(fees.get('emdr-therapy'), fees.get('individual-therapy'));
});

test('generated FAQs exist for every pair and no two pages share an answer', () => {
  const seen = new Map<string, string>();
  for (const { p, topic, ctx, loc } of loaded) {
    const faqs = generatedFaqs({
      topic, ctx, loc, counsellors: counsellorsFor(topic), fee: feeFor(FALLBACK_CATALOG, topic),
    });
    assert.ok(faqs.length >= 2, `${p.city}/${p.service} generated ${faqs.length} FAQs`);
    for (const f of faqs) {
      const key = `${p.city}/${p.service}`;
      assert.ok(!seen.has(f.a), `${key} repeats an answer from ${seen.get(f.a)}: "${f.a.slice(0, 60)}"`);
      seen.set(f.a, key);
      assert.ok(!/\b(will|guarantee|cure|success)\b/i.test(f.a), `outcome language in ${key}: ${f.a}`);
      assert.ok(/plan-dependent/.test(f.a) || !/cover/i.test(f.a), `coverage without plan-dependent in ${key}`);
      assert.ok(!/\d{1,2}(:\d{2})?\s?(am|pm)\b/i.test(f.a), `hours published in ${key}`);
    }
  }
});

test('listOf reads as English', () => {
  assert.equal(listOf(['A'], 'and'), 'A');
  assert.equal(listOf(['A', 'B'], 'or'), 'A or B');
  assert.equal(listOf(['A', 'B', 'C'], 'and'), 'A, B and C');
});

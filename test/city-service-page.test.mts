import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pairs } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { cityContexts } from '../lib/city-context.ts';
import { getLocation } from '../lib/locations.ts';
import { practitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import {
  bookHrefFor, counsellorsFor, feeFor, generatedFaqs, profileHrefFor, listOf, midSentence,
  seoName, sentenceName, personNoun, whoHeading, laterOption,
} from '../lib/city-service-page.ts';
import { conditions } from '../lib/conditions.ts';
import { pairs as allPairs, victoriaEmdrAnswer } from '../lib/city-services.ts';
import { counsellorsForCity } from '../lib/counsellor-cards.ts';
import { OFFERINGS, offerItems } from '../lib/practitioner-facts.ts';
import { priceOffer } from '../lib/schema.ts';
import { policies, SESSION_SECURITY, SESSION_SECURITY_MD } from '../lib/policies.ts';

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
    const href = bookHrefFor(cs, topic.bookingService);
    const couples = topic.bookingService === 'couples-therapy' ? '&for=couples' : '';
    if (cs.length === 1) assert.equal(href, `/book?with=${cs[0].slug}${couples}#calendar`);
    else assert.equal(href, '/book', 'bare /book never carries the hash');
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

/* 1 Oct 2026, wf/money-pages. `lower` cut only the first letter, so the
   visible FAQs and FAQPage text read "eMDR Therapy", "couples Therapy" and
   "anxiety Counselling" on all fifty pages, and one answer said "the whole
   of Fraser Health region". */
test('midSentence lowercases word by word and keeps initialisms and languages', () => {
  assert.equal(midSentence('EMDR Therapy'), 'EMDR therapy');
  assert.equal(midSentence('Couples Therapy'), 'couples therapy');
  assert.equal(midSentence('Anxiety Counselling'), 'anxiety counselling');
  assert.equal(midSentence('Punjabi-Speaking Counselling'), 'Punjabi-speaking counselling');
});

test('no generated FAQ on any pair carries a broken capital or a missing article', () => {
  for (const { p, topic, ctx, loc } of loaded) {
    const faqs = generatedFaqs({
      topic, ctx, loc, counsellors: counsellorsFor(topic), fee: feeFor(FALLBACK_CATALOG, topic),
    });
    for (const f of faqs) {
      for (const text of [f.q, f.a]) {
        const key = `${p.city}/${p.service}`;
        assert.ok(!/\b[a-z][A-Z]/.test(text), `${key}: mid-word capital in "${text}"`);
        assert.ok(!/\b(?:a|an|the|for|does|is|of)\s+[a-z]+\s+(?:Therapy|Counselling)\b/.test(text),
          `${key}: Title Case service word mid-sentence in "${text}"`);
        assert.ok(!/\b(?:for|of|does|is)\s+(?:Couples|Anxiety|Depression|Trauma|Individual|Family)\s+(?:Therapy|Counselling)\b/.test(text),
          `${key}: Title Case service name mid-sentence in "${text}"`);
        assert.ok(!/the whole of [A-Z]/.test(text), `${key}: "the whole of <region>" in "${text}"`);
      }
    }
  }
});

/* The Service node on the fifty pairs and the Offers on the city hubs are
   built from offerItems: every price must be a catalogue price, and every
   priced service must be one somebody named on that page offers. */
test('every Offer on a pair or a city hub is a catalogue price for a service its counsellors offer', () => {
  const prices = new Set(FALLBACK_CATALOG.items.map((i) => i.cents));
  for (const { p, topic } of loaded) {
    const items = offerItems({ services: [topic.bookingService] }, FALLBACK_CATALOG);
    assert.ok(items.some((i) => i.cents > 0), `${p.city}/${p.service} has no priced Offer`);
    for (const i of items) assert.ok(prices.has(i.cents), `${p.city}/${p.service}: ${i.name} at ${i.cents}c is not in the catalogue`);
    for (const c of counsellorsFor(topic)) assert.ok(c.services.includes(topic.bookingService));
  }
  for (const c of cityContexts) {
    const who = counsellorsForCity(c.slug);
    const offered = new Set(who.flatMap((x) => x.services));
    const items = offerItems({ services: [...offered] }, FALLBACK_CATALOG);
    for (const i of items) assert.ok(prices.has(i.cents), `${c.slug}: ${i.name} is not a catalogue price`);
    const labels = OFFERINGS.filter((o) => !offered.has(o.service)).map((o) => o.label.toLowerCase());
    for (const i of items) {
      assert.ok(!labels.some((l) => i.name.toLowerCase().startsWith(l)), `${c.slug}: offers ${i.name}, which nobody on the page offers`);
    }
  }
  /* The extended couples session and both EMDR formats are priced, which
     the single Offer never said. */
  const couples = offerItems({ services: ['couples-therapy'] }, FALLBACK_CATALOG).map((i) => i.name);
  assert.ok(couples.includes('Couples counselling (extended)'), couples.join(', '));
  const emdr = offerItems({ services: ['emdr-therapy'] }, FALLBACK_CATALOG).map((i) => i.name);
  assert.ok(emdr.includes('EMDR') && emdr.includes('EMDR (intensive)'), emdr.join(', '));
});

test('priceOffer no longer speaks of stock', () => {
  assert.equal('availability' in priceOffer(140, '/x'), false);
});

/* The "How private is the video?" block on /online-counselling, the city
   hubs and /pricing reads the same constant /privacy publishes. */
test('the session-security sentence is the privacy policy’s own', () => {
  const privacy = policies['privacy']!;
  assert.ok(privacy.sections.some((x) => x.body?.includes(SESSION_SECURITY_MD)), 'the policy no longer carries the constant');
  assert.match(SESSION_SECURITY, /never recorded/);
  assert.match(SESSION_SECURITY, /Canadian region/);
  assert.ok(!SESSION_SECURITY.includes('**'));
});

/* 1 Oct 2026, wf/city-pages. Trauma priced all ten of its city pages at the
   EMDR intensive while its own copy says pacing comes first. Any topic whose
   approach puts stabilisation, safety or pacing first books into the weekly
   individual session, and its pages name every counsellor who takes it. */
test('a topic whose copy says stabilisation comes first is priced at the weekly fee', () => {
  const weekly = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!;
  const pacingFirst = conditions.filter((c) => /pacing first|stabili[sz]|safety/i.test(c.approach));
  assert.ok(pacingFirst.some((c) => c.slug === 'trauma-therapy'), 'the trauma copy no longer says pacing first; re-read this test');
  for (const c of pacingFirst) {
    const topic = getCityTopic(c.slug)!;
    const fee = feeFor(FALLBACK_CATALOG, topic)!;
    assert.equal(fee.cents, weekly.cents, `${c.slug} is priced at ${fee.fee}`);
    assert.equal(fee.minutes, weekly.minutes, `${c.slug} is priced for ${fee.minutes} minutes`);
  }
  const trauma = counsellorsFor(getCityTopic('trauma-therapy')!);
  const individual = counsellorsFor({ bookingService: 'individual-therapy' });
  assert.deepEqual(trauma.map((p) => p.slug), individual.map((p) => p.slug));
});

test('the EMDR intensive appears on trauma pages as a later option, from the catalogue', () => {
  const intensive = FALLBACK_CATALOG.items.find((i) => i.name === 'EMDR Intensive')!;
  const line = laterOption(FALLBACK_CATALOG, getCityTopic('trauma-therapy')!, 'Kamloops')!;
  assert.ok(line.startsWith('For trauma work in Kamloops'), line);
  assert.ok(line.includes(`$${intensive.cents / 100} for ${intensive.minutes} minutes`), line);
  assert.match(line, /later, once stability is in place/);
  for (const p of counsellorsFor({ bookingService: 'emdr-therapy' })) assert.ok(line.includes(p.name), `${p.name} missing`);
  assert.equal(laterOption(FALLBACK_CATALOG, getCityTopic('anxiety-counselling')!, 'Kamloops'), undefined);
  assert.equal(laterOption({ ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.filter((i) => i.name !== 'EMDR Intensive') },
    getCityTopic('trauma-therapy')!, 'Kamloops'), undefined, 'no intensive in the catalogue, no sentence');
});

test('each pair’s H1 name carries its service name, and the searched second word', () => {
  for (const p of allPairs) {
    const topic = getCityTopic(p.service)!;
    const h1 = seoName(topic);
    assert.ok(h1.includes(topic.name.split(' ')[0]), `${p.city}/${p.service}: "${h1}" lacks ${topic.name}`);
    assert.ok(h1.startsWith(topic.name) || p.service === 'couples-therapy', `${p.city}/${p.service}: "${h1}"`);
  }
  assert.equal(seoName(getCityTopic('trauma-therapy')!), 'Trauma Therapy and Counselling');
  assert.equal(seoName(getCityTopic('anxiety-counselling')!), 'Anxiety Counselling and Therapy');
  assert.equal(seoName(getCityTopic('depression-counselling')!), 'Depression Counselling and Therapy');
  assert.equal(seoName(getCityTopic('couples-therapy')!), 'Couples and Marriage Counselling');
  assert.equal(seoName(getCityTopic('emdr-therapy')!), 'EMDR Therapy');
  assert.equal(sentenceName('Couples and Marriage Counselling'), 'Couples and marriage counselling');
  assert.equal(sentenceName('EMDR Therapy'), 'EMDR therapy');
});

test('the cards heading names the person the query names', () => {
  assert.equal(whoHeading('emdr-therapy', 'Vancouver', 1), 'EMDR therapist in Vancouver: who you would see');
  assert.equal(whoHeading('trauma-therapy', 'Kamloops', 2), 'Trauma therapists in Kamloops: who you would see');
  assert.equal(personNoun('couples-therapy', 1), 'Couples or marriage counsellor');
  assert.equal(personNoun('depression-counselling', 2), 'Depression counsellors');
  assert.equal(personNoun('individual-therapy', 1), 'Counsellor');
});

/* 1 Oct 2026. The Victoria EMDR page answered a time-zone question with "the
   whole province is on one clock"; the Peace region and the East Kootenay
   keep Mountain time. */
test('the Victoria EMDR answer is the Island question, from the roster and catalogue', () => {
  const pair = allPairs.find((p) => p.city === 'victoria' && p.service === 'emdr-therapy')!;
  assert.ok(!pair.faqs.some((f) => /one clock/.test(f.a)));
  const f = pair.faqs.find((x) => x.q === 'Is EMDR therapy available in Victoria without a ferry?')!;
  assert.equal(f.a, victoriaEmdrAnswer());
  const intensive = FALLBACK_CATALOG.items.find((i) => i.name === 'EMDR Intensive')!;
  assert.ok(f.a.includes(`$${intensive.cents / 100}`));
  assert.match(f.a, /Pacific time/);
  for (const p of counsellorsFor({ bookingService: 'emdr-therapy' })) assert.ok(f.a.includes(p.name));
  assert.ok(!/\b(evenings?|weekends?|\d\s?(am|pm))\b/i.test(f.a), 'no hours');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practitioners } from '../lib/practitioners.ts';
import { pairs } from '../lib/city-services.ts';
import { getCityTopic } from '../lib/conditions.ts';
import { cityContexts } from '../lib/city-context.ts';
import { locations } from '../lib/locations.ts';
import { services } from '../lib/services.ts';
import { audiences } from '../lib/audiences.ts';
import { guides } from '../lib/guides.ts';
import { resources } from '../lib/resources.ts';
import { depthServices } from '../lib/depth-services.ts';
import { counsellorsForCity, counsellorsForService } from '../lib/counsellor-cards.ts';
import {
  cityServiceDescription, cityServiceTitle, counsellorsFor, fitSentences, languagePhrase, languagesFor,
} from '../lib/city-service-page.ts';
import { offeringLanguages, sitewideDescription, metaLength } from '../lib/snippet-facts.ts';
import { CONFIDENTIALITY_LIMITS } from '../lib/practice-facts.ts';
import { faqs } from '../lib/faq.ts';

/* ROUND 1 #20, THE METADATA AND THE BODY COPY — 1 Oct 2026.
 *
 * A page about a service may name only the languages that somebody offering
 * that service speaks. Couples and EMDR pages said "English, Punjabi or
 * Tagalog" in their descriptions and closing bands; the one counsellor who
 * offers either works in English and Tagalog. These tests hold the rule on
 * the generated strings, so a roster change moves the copy and a typed
 * language that nobody offering the work speaks fails here. */

const ROSTER_LANGUAGES = [...new Set(practitioners.flatMap((p) => p.languages.map((l) => l.name)))];
const named = (s: string) => ROSTER_LANGUAGES.filter((l) => new RegExp(`\\b${l}\\b`).test(s));
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/);
/* A description that was cut ends on a word like "Free" or "and". */
const DANGLING = /\b(free|and|or|in|with|the|a|an|for|of|to|by|from)$/i;
const endsClean = (s: string) => /[.!?]$/.test(s.trim()) && !DANGLING.test(s.trim().replace(/[.!?]$/, ''));

test('languages are the roster’s: English first, the rest sorted, nobody counted twice', () => {
  const both = counsellorsFor({ bookingService: 'individual-therapy' });
  assert.deepEqual(languagesFor(both), ['English', 'Punjabi', 'Tagalog']);
  const couples = counsellorsFor({ bookingService: 'couples-therapy' });
  for (const c of couples) assert.equal(c.acceptingNewClients, true);
  assert.equal(languagesFor(couples)[0], 'English');
});

test('no city-service description names a language nobody offering the service speaks, or ends on a cut word', () => {
  for (const p of pairs) {
    const topic = getCityTopic(p.service)!;
    const ctx = cityContexts.find((c) => c.slug === p.city)!;
    const offering = counsellorsFor(topic);
    const allowed = languagesFor(offering);
    const d = cityServiceDescription({ name: topic.name, city: ctx.city, counsellors: offering });
    assert.ok(d.length <= 158, `${p.city}/${p.service}: ${d.length} chars`);
    assert.ok(endsClean(d), `${p.city}/${p.service} ends on a dangling word: ${d}`);
    for (const l of named(d)) assert.ok(allowed.includes(l), `${p.city}/${p.service} names ${l}: ${d}`);
    /* The closing band on the same page. */
    for (const l of named(languagePhrase(offering))) assert.ok(allowed.includes(l));
  }
});

test('the couples and EMDR city pages do not offer Punjabi when nobody offering them speaks it', () => {
  for (const service of ['couples-therapy', 'emdr-therapy']) {
    const offering = counsellorsFor({ bookingService: service });
    if (offering.some((p) => p.languages.some((l) => l.tag === 'pa'))) continue;
    const d = cityServiceDescription({ name: 'Couples and Marriage Counselling', city: 'Abbotsford', counsellors: offering });
    assert.doesNotMatch(d, /Punjabi/, d);
    assert.doesNotMatch(languagePhrase(offering), /Punjabi/);
  }
});

test('whole sentences only: the cut that published "Free" cannot recur', () => {
  assert.equal(fitSentences(['One two.', 'Three four.', 'Free 30-minute consultation.'], 20), 'One two. Three four.');
  assert.equal(fitSentences(['A sentence longer than the limit.'], 5), 'A sentence longer than the limit.');
});

/* North Vancouver's depression pair joined on 2 Oct 2026 for length, not
   for Search Console: "Depression Counselling in North Vancouver | Westpeak
   Wellness" is 61 even without ", BC", so it is titled as therapy. */
test('the marriage titles fit the gate, only the two pairs Search Console names carry one, and North Vancouver depression is titled for length', () => {
  const titled = pairs.filter((p) => p.titleName);
  assert.deepEqual(titled.map((p) => `${p.city}/${p.service}`).sort(), ['abbotsford/couples-therapy', 'north-vancouver/depression-counselling', 'prince-george/couples-therapy']);
  for (const p of titled) {
    const ctx = cityContexts.find((c) => c.slug === p.city)!;
    const t = `${cityServiceTitle(p.titleName!, ctx.city, 'Westpeak Wellness')} | Westpeak Wellness`;
    assert.ok(t.length <= 60, `${t} is ${t.length}`);
    assert.match(t, p.service === 'couples-therapy' ? /^Marriage Counselling in / : /^Depression Therapy in /);
  }
  assert.equal(cityServiceTitle('Marriage Counselling', 'Abbotsford', 'Westpeak Wellness'), 'Marriage Counselling in Abbotsford, BC');
  assert.equal(cityServiceTitle('Marriage Counselling', 'Prince George', 'Westpeak Wellness'), 'Marriage Counselling in Prince George');
});

test('service pages: no description or direct answer names a language nobody offering the service speaks', () => {
  for (const s of services) {
    if (s.language) continue; // the language pages name the other languages on purpose ("couples run in English or Tagalog")
    const allowed = languagesFor(counsellorsForService(s));
    for (const [field, text] of [['metaDescription', s.metaDescription], ['directAnswer', s.directAnswer ?? '']] as const) {
      for (const l of named(text)) assert.ok(allowed.includes(l), `${s.slug}.${field} names ${l}`);
    }
    for (const f of s.faqs ?? []) {
      if (/^Yes/.test(f.a)) for (const l of named(f.q)) assert.ok(allowed.includes(l), `${s.slug}: "${f.q}" answers yes for ${l}`);
    }
  }
});

test('the site-wide description pairs couples and EMDR only with languages their counsellors speak', () => {
  const d = sitewideDescription();
  assert.ok(metaLength(d) <= 155, `${d.length}: ${d}`);
  assert.ok(endsClean(d), d);
  const paired = [...new Set([
    ...languagesFor(counsellorsFor({ bookingService: 'couples-therapy' })),
    ...languagesFor(counsellorsFor({ bookingService: 'emdr-therapy' })),
  ])];
  for (const s of sentences(d).filter((x) => /couples|EMDR/i.test(x))) {
    for (const l of named(s)) assert.ok(paired.includes(l), `"${s}" names ${l}`);
  }
  const l = offeringLanguages();
  assert.equal(l.individual, languagePhrase(counsellorsFor({ bookingService: 'individual-therapy' })));
});

test('city-hub leads: any language named is spoken by a counsellor with a page for that city, and none pairs with couples or EMDR', () => {
  for (const loc of locations) {
    const spoken = languagesFor(counsellorsForCity(loc.slug));
    for (const l of named(loc.metaDescription)) assert.ok(spoken.includes(l), `${loc.slug} names ${l}`);
    for (const s of sentences(loc.metaDescription).filter((x) => /couples|EMDR/i.test(x))) {
      assert.deepEqual(named(s), [], `${loc.slug}: "${s}" pairs a language with couples or EMDR`);
    }
  }
});

/* #131: the Punjabi service page and /for/punjabi-speaking-couples. */
const PA_COUPLES = counsellorsFor({ bookingService: 'couples-therapy' }).some((p) => p.languages.some((l) => l.tag === 'pa'));

test('the Punjabi service page does not promise couples work in Punjabi', { skip: PA_COUPLES }, () => {
  const text = depthServices['services/punjabi-counselling'].flatMap((x) => x.body ?? []).join(' ');
  assert.doesNotMatch(text, /couples work is available in Punjabi/i);
  assert.match(text, /Couples work currently runs in English/);
});

test('the Punjabi-speaking couples page says couples sessions run in English, and books them with the counsellor who offers them', { skip: PA_COUPLES }, () => {
  const a = audiences.find((x) => x.slug === 'punjabi-speaking-couples')!;
  for (const field of [a.metaDescription, a.shortAnswer, a.lede, ...a.opening, ...a.faqs.map((f) => f.a)]) {
    assert.doesNotMatch(field, /Couples counselling in Punjabi/i, field);
    assert.doesNotMatch(field, /Sessions (run|move) (in|between) (Punjabi|the languages)/i, field);
  }
  const couples = counsellorsFor({ bookingService: 'couples-therapy' });
  assert.match(a.shortAnswer, new RegExp(couples[0].name));
  assert.match(a.opening.join(' '), new RegExp(`/book\\?with=${couples[0].slug}`));
  const founder = practitioners.find((p) => !p.acceptingNewClients);
  if (founder) assert.doesNotMatch(JSON.stringify(a), new RegExp(founder.name));
});

/* #134: every statement of the limits of confidentiality is complete. */
const strings = (x: unknown, out: string[] = []): string[] => {
  if (typeof x === 'string') out.push(x);
  else if (Array.isArray(x)) x.forEach((y) => strings(y, out));
  else if (x && typeof x === 'object') Object.values(x).forEach((y) => strings(y, out));
  return out;
};

test('"only limits are" never leaves out the child or vulnerable adult', () => {
  assert.match(CONFIDENTIALITY_LIMITS, /child or vulnerable adult/);
  assert.match(CONFIDENTIALITY_LIMITS, /court order/);
  for (const s of strings([services, audiences, guides, resources, depthServices])) {
    if (/only limits are/i.test(s)) assert.match(s, /child/, `incomplete limits: ${s.slice(0, 160)}`);
  }
  /* lib/faq.ts since 2 Oct 2026 (item 358): /faq listed "a risk of serious
     harm … or a court order" and left out the child. An answer there that
     names the limits names all of them, from the constant. */
  for (const f of faqs) {
    if (/\blimits?\b/i.test(f.a) && /court order/i.test(f.a)) assert.ok(f.a.includes(CONFIDENTIALITY_LIMITS), `/faq: ${f.q}`);
  }
});

test('"Will my family find out?" is answered with consent and the exceptions, not a bare no', () => {
  for (const s of services) {
    for (const f of (s.faqs ?? []).filter((x) => /family find out/i.test(x.q))) {
      assert.doesNotMatch(f.a, /^No\b/, `${s.slug}: ${f.a}`);
      assert.match(f.a, /consent/);
      assert.ok(f.a.includes(CONFIDENTIALITY_LIMITS), s.slug);
    }
  }
});

/* #186: plain-text fields are printed as they are, so markdown in them is
   printed too. The service intro and FAQ answers render through rich(); the
   rest do not. */
test('no plain-text field on a service page or a language audience page holds a markdown link', () => {
  const MD = /\]\(\//;
  for (const s of services) {
    for (const [k, v] of [['metaDescription', s.metaDescription], ['hero', s.hero], ['directAnswer', s.directAnswer ?? ''],
      ['approach', s.approach], ['short', s.short], ...s.helps.map((h) => ['helps', h])] as [string, string][]) {
      assert.doesNotMatch(v, MD, `${s.slug}.${k}`);
    }
  }
  for (const a of audiences.filter((x) => x.language)) {
    for (const [k, v] of [['metaDescription', a.metaDescription], ['lede', a.lede], ['shortAnswer', a.shortAnswer],
      ...a.servicesThatFit.map((x) => ['why', x.why]), ...a.faqs.map((f) => ['faq', f.a])] as [string, string][]) {
      assert.doesNotMatch(v, MD, `${a.slug}.${k}`);
    }
  }
});

/* #187: the language pages open with the person you would see. */
test('the Punjabi and Tagalog direct answers name the accepting counsellor in the first sentence', () => {
  for (const s of services.filter((x) => x.language)) {
    const who = practitioners.find((p) => p.acceptingNewClients && p.bookable && p.languages.some((l) => l.tag === s.language));
    if (!who) continue;
    const first = sentences(s.directAnswer!)[0];
    assert.match(first, new RegExp(`is with ${who.name}, ${who.postNominals}`), first);
    for (const p of practitioners.filter((x) => !x.acceptingNewClients)) assert.doesNotMatch(s.directAnswer!, new RegExp(p.name));
  }
});

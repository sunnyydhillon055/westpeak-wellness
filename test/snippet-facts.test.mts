import { test } from 'node:test';
import assert from 'node:assert/strict';
import { practitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { locations } from '../lib/locations.ts';
import { punjabiRegions, regionOpening } from '../lib/punjabi-regions.ts';
import { services } from '../lib/services.ts';
import { counsellorsForCity, counsellorsForService } from '../lib/counsellor-cards.ts';
import { counsellorsFor, feeFor } from '../lib/city-service-page.ts';
import {
  SNIPPET_MAX, firstSentence, lowestFee, metaLength, practiceSnippet, profileSnippet, serviceSnippet,
  snippetFacts, withSnippet,
} from '../lib/snippet-facts.ts';
// @ts-expect-error a plain .mjs script, imported for its exported checks
import { typedFeeDescriptions, typedFeesInSnippetFacts } from '../scripts/price-drift.mjs';

/* #195: the money-page descriptions state a fee and who you would see.
 * Every figure comes from the catalogue, the names from accepting
 * counsellors, and nothing is ever cut to fit. */

const C = FALLBACK_CATALOG;
const fee = (name: string) => money(C.items.find((i) => i.name === name)!.cents);
const founder = practitioners.find((p) => !p.acceptingNewClients);

test('metaLength counts the attribute as React serialises it', () => {
  assert.equal(metaLength('a & b'), 9);
  assert.equal(metaLength(`it's`), 9);
  assert.equal(metaLength('a · b'), 5);
});

test('the facts line reads the catalogue and the roster', () => {
  const ind = feeFor(C, { bookingService: 'individual-therapy' })!;
  assert.equal(
    snippetFacts({ fee: ind, names: ['A B', 'C D'] }),
    `${fee('Individual Counselling')} per 50-min session · free 30-min consult · A B or C D`,
  );
  assert.match(snippetFacts({ fee: ind, from: true }), /^From /);
});

test('lowestFee says "from" only when the services differ in price', () => {
  const one = lowestFee(C, ['individual-therapy'])!;
  assert.equal(one.from, false);
  const many = lowestFee(C, ['individual-therapy', 'couples-therapy', 'emdr-therapy'])!;
  assert.equal(many.from, true);
  assert.equal(many.fee.fee, fee('Individual Counselling'));
  assert.equal(lowestFee(C, ['family-counselling']), undefined);
});

test('withSnippet never exceeds the limit and never cuts a sentence', () => {
  const facts = '$1 per 50-min session · free 30-min consult';
  const long = 'A first sentence that is short. ' + 'Then a second sentence that goes on and on '.repeat(5) + 'until it ends.';
  const out = withSnippet(long, facts);
  assert.ok(metaLength(out) <= SNIPPET_MAX);
  assert.equal(out, `A first sentence that is short. ${facts}.`);
  const huge = 'x'.repeat(200) + '.';
  assert.equal(withSnippet(huge, facts), huge, 'nothing fits: the lead stands alone');
  assert.equal(withSnippet('Lead.', undefined), 'Lead.');
  assert.equal(firstSentence('One, BC. Two.'), 'One, BC.');
});

test('nobody who is not taking new clients is named or priced', () => {
  if (founder) {
    assert.equal(profileSnippet(C, founder), undefined);
    assert.doesNotMatch(practiceSnippet(C, practitioners) ?? '', new RegExp(founder.name));
  }
  for (const p of practitioners.filter((x) => x.acceptingNewClients)) {
    assert.match(profileSnippet(C, p)!, /free 30-min consult$/);
  }
});

test('every city hub the 1 Oct rewrite covers states a fee, within the gate, ending cleanly', () => {
  const REWRITTEN = ['surrey', 'vancouver', 'abbotsford', 'victoria', 'kelowna', 'burnaby', 'langley',
    'white-rock', 'richmond', 'coquitlam', 'delta', 'nanaimo'];
  for (const l of locations) {
    const d = withSnippet(l.metaDescription, practiceSnippet(C, counsellorsForCity(l.slug)));
    assert.ok(metaLength(d) <= 158, `${l.slug}: ${metaLength(d)}`);
    assert.match(d, /[.!?]$/);
    if (REWRITTEN.includes(l.slug)) {
      assert.ok(metaLength(d) <= SNIPPET_MAX, `${l.slug}: ${metaLength(d)}`);
      assert.ok(d.includes(fee('Individual Counselling')), `${l.slug} has no fee: ${d}`);
      for (const p of counsellorsForCity(l.slug)) assert.ok(d.includes(p.name), `${l.slug} does not name ${p.name}`);
    }
  }
});

test('every priced service page and every Punjabi region page carries the fee within the gate', () => {
  for (const s of services.filter((x) => ['individual-therapy', 'couples-therapy', 'emdr-therapy'].includes(x.slug))) {
    const d = withSnippet(s.metaDescription, serviceSnippet(C, s.slug, counsellorsForService(s)));
    assert.ok(metaLength(d) <= SNIPPET_MAX, `${s.slug}: ${metaLength(d)} ${d}`);
    assert.match(d, /\$\d+ per \d+-min session/, `${s.slug} has no fee: ${d}`);
  }
  const speaker = practitioners.find((p) => p.acceptingNewClients && p.bookable && p.languages.some((l) => l.tag === 'pa'));
  if (speaker) {
    for (const r of punjabiRegions) {
      const d = withSnippet(r.metaDescription, serviceSnippet(C, 'individual-therapy', [speaker]));
      assert.ok(metaLength(d) <= SNIPPET_MAX, `${r.slug}: ${metaLength(d)}`);
      assert.ok(d.includes(speaker.name), r.slug);
    }
  }
});

test('the Punjabi region opening answers who, how, cost and the consultation, without a census figure or Gurmukhi', () => {
  const speaker = practitioners.find((p) => p.acceptingNewClients && p.bookable && p.languages.some((l) => l.tag === 'pa'))!;
  for (const r of punjabiRegions) {
    const o = regionOpening({
      region: r.region, who: `${speaker.name}, ${speaker.postNominals}`, languages: 'English or Punjabi',
      fee: feeFor(C, { bookingService: 'individual-therapy' }),
    });
    assert.match(o, new RegExp(speaker.name));
    assert.match(o, /secure video/);
    assert.ok(o.includes(fee('Individual Counselling')));
    assert.match(o, /free 30-minute consultation/);
    assert.match(o, /depends on the plan/);
    assert.doesNotMatch(o, /[਀-੿]/);
    if (r.figure) assert.ok(!o.includes(r.figure.value), `${r.slug} repeats the census figure`);
    assert.doesNotMatch(o, /\d+(\.\d+)?%/);
  }
  assert.match(regionOpening({ region: 'X' }), /free 30-minute consultation/);
});

test('price-drift fails a fee typed into a description, and any figure in the composer', () => {
  assert.equal(typedFeeDescriptions(`  metaDescription:\n    'Sessions are $140 each.',`).length, 1);
  assert.equal(typedFeeDescriptions(`description: \`From \${fee} per session\``).length, 0);
  assert.equal(typedFeeDescriptions(`description: 'EI pays up to $729 a week.'`).length, 0, 'allow-listed figure');
  assert.equal(typedFeesInSnippetFacts('const x = 1; // costs $140').length, 1);
  assert.equal(counsellorsFor({ bookingService: 'individual-therapy' }).every((p) => p.acceptingNewClients), true);
});

/* #382, 2 Oct 2026 (finishes #195): Prince George, Kamloops, Fort St. John
   and Penticton led with one long sentence, so withSnippet fell back to the
   bare lead and their snippets named neither a fee nor a counsellor. Every
   hub description now carries the catalogue fee. */
test('every city hub description carries the catalogue fee and an accepting counsellor', () => {
  const ind = fee('Individual Counselling');
  for (const l of locations) {
    const facts = practiceSnippet(C, counsellorsForCity(l.slug));
    if (!facts) continue;
    const d = withSnippet(l.metaDescription, facts);
    assert.ok(d.includes(ind), `${l.slug}: ${d}`);
    assert.ok(metaLength(d) <= SNIPPET_MAX, `${l.slug} is ${metaLength(d)} long`);
    assert.ok(metaLength(firstSentence(l.metaDescription)) <= 69, `${l.slug}: lead sentence too long for the facts`);
  }
  for (const slug of ['prince-george', 'kamloops', 'fort-st-john', 'penticton']) {
    assert.ok(locations.some((l) => l.slug === slug), slug);
  }
});

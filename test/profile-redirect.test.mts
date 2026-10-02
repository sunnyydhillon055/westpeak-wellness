import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { recordedPractitioners } from '../lib/practitioners.ts';
import { ALBERTA_PLACES } from '../lib/practitioner-places.ts';
import { albertaPlaceRedirect, ALBERTA_PLACE_SLUGS } from '../lib/place-redirect.ts';
import { albertaHoursAhead, albertaClockSentence, albertaClockLine } from '../lib/alberta-clock.ts';

/* wf/profiles, 2 Oct 2026: #376 (an Alberta place page 308s to the profile
   once the gate drops Alberta) and #360 (Pacific, said; the gap computed). */

const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
const ab = camille.insurance!.validTo;

test('the middleware list of Alberta places matches ALBERTA_PLACES', () => {
  assert.deepEqual([...ALBERTA_PLACE_SLUGS].sort(), ALBERTA_PLACES.map((p) => p.slug).sort());
  const mw = readFileSync('middleware.ts', 'utf8');
  for (const s of ALBERTA_PLACE_SLUGS) {
    assert.ok(mw.includes(`'/practitioners/:slug/${s}'`), s);
    /* Literal twins: Next 14 compiled a trailing ':lang' to '(.json)'. */
    for (const lang of ['tl', 'pa']) assert.ok(mw.includes(`'/practitioners/:slug/${s}/${lang}'`), `${s}/${lang} twin`);
    assert.ok(!mw.includes(`'/practitioners/:slug/${s}/:lang'`), `${s}: no :lang matcher`);
  }
});

test('no redirect while she is insured for Alberta, including the grace period', () => {
  for (const day of [ab, '2026-10-10']) {
    assert.equal(albertaPlaceRedirect('/practitioners/camille-granda/calgary', recordedPractitioners, day), null, day);
  }
});

test('once the gate drops Alberta, her Calgary and Edmonton pages and their twins 308 to her profile', () => {
  const after = '2027-03-01';
  for (const path of [
    '/practitioners/camille-granda/calgary',
    '/practitioners/camille-granda/edmonton',
    '/practitioners/camille-granda/calgary/tl',
    '/practitioners/camille-granda/edmonton/tl/',
  ]) {
    assert.equal(albertaPlaceRedirect(path, recordedPractitioners, after), '/practitioners/camille-granda', path);
  }
});

test('BC places, unknown counsellors and other paths are left alone', () => {
  const after = '2027-03-01';
  assert.equal(albertaPlaceRedirect('/practitioners/camille-granda/surrey', recordedPractitioners, after), null);
  assert.equal(albertaPlaceRedirect('/practitioners/nobody/calgary', recordedPractitioners, after), null);
  assert.equal(albertaPlaceRedirect('/practitioners/camille-granda', recordedPractitioners, after), null);
  assert.equal(albertaPlaceRedirect('/practitioners/camille-granda/calgary/fr', recordedPractitioners, after), null);
  /* A BC-only counsellor never had an Alberta page: her profile, not a 404. */
  assert.equal(albertaPlaceRedirect('/practitioners/savneet-singh/calgary', recordedPractitioners, '2026-10-02'), '/practitioners/savneet-singh');
});

/* ---------- #360 ---------- */

test('the Alberta clock sentence says Pacific and computes the gap', () => {
  /* Midday Pacific in July, far from any midnight: Alberta is an hour ahead
     on every runtime's time-zone data. */
  assert.equal(albertaHoursAhead(new Date('2026-07-15T19:00:00Z')), 1);
  assert.equal(albertaClockSentence(1), 'Times on the calendar are Pacific time; Alberta is 1 hour ahead today.');
  assert.match(albertaClockSentence(0), /Pacific time; Alberta is on the same clock as BC today/);
  assert.match(albertaClockSentence(2), /2 hours ahead/);
  assert.match(albertaClockLine(), /^Times on the calendar are Pacific time;/);
});

test('no English page promises Mountain Time, and the Tagalog twins drop the question', () => {
  for (const f of ['lib/practitioner-places.ts', 'lib/expansion.ts', 'lib/expansion-more.ts']) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, /shown (to you )?in Mountain Time|Times shown to you are Mountain Time|Mountain Time for Alberta clients/, f);
  }
  /* The gated hub's FAQPage answer. Its lede and designation note still say
     Mountain Time and are flagged for whoever owns the hub's prose. */
  assert.doesNotMatch(readFileSync('app/alberta/page.tsx', 'utf8'), /Mountain Time for Alberta clients/);
  assert.doesNotMatch(readFileSync('lib/practitioner-places-tl.ts', 'utf8'), /Mountain Time/);
  const calgary = ALBERTA_PLACES.find((p) => p.slug === 'calgary')!;
  const tz = calgary.faqs.find((f) => /time zone/i.test(f.q))!;
  assert.match(tz.a, /Pacific time/);
});

test('the place pages state her facts instead of "nothing about the fee changes"', () => {
  const page = readFileSync('app/practitioners/[slug]/[place]/page.tsx', 'utf8');
  assert.doesNotMatch(page, /nothing about\s+the fee|same fee and the same availability|changes with distance/);
  assert.match(page, /feeLines\(p, catalog\)/);
  assert.match(page, /<NextConsultLine slugs=\{\[p\.slug\]\} location="place-practitioner"/);
  assert.match(page, /export const revalidate = 1800/);
  assert.match(page, /export function generateStaticParams/);
  assert.doesNotMatch(readFileSync('lib/practitioner-places.ts', 'utf8'), /nothing about the fee/);
});

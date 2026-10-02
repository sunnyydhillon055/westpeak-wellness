import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import { recordedPractitioners, withInsuranceGate, type Practitioner } from '../lib/practitioners.ts';
import {
  alternativesFor, alternativeLabel, notRightFit, approachTerms, compareColumns, lowestFee, rosterOrder, groupMissing,
  TRAINING_QUESTION, NOT_RIGHT_QUESTION, APPROACH_TERMS,
} from '../lib/practitioner-facts.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* wf/profiles, 2 Oct 2026: #351 (who a non-accepting profile sends readers
   to), #355 (/practitioners order and rows), #369 (her own not-the-right-fit
   sentence) and #378 (the generated Camille-or-Savneet comparison). */

const by = (slug: string) => recordedPractitioners.find((p) => p.slug === slug)!;
const founder = by('aman-bains-dhillon');
const src = (f: string) => readFileSync(f, 'utf8');

/* ---------- #351 ---------- */

test('a non-accepting profile names the colleague who shares her non-English language first', () => {
  const alts = alternativesFor(founder, recordedPractitioners);
  assert.ok(alts.length >= 1);
  const own = founder.languages.filter((l) => !l.tag.startsWith('en')).map((l) => l.tag);
  const first = by(alts[0]!.slug);
  assert.ok(first.languages.some((l) => own.includes(l.tag)), `${first.slug} shares none of ${own.join(', ')}`);
  assert.ok(first.acceptingNewClients && first.bookable);
  assert.equal(alternativeLabel(alts[0]!), `Book with ${first.name.split(' ')[0]}, in Punjabi or English`, 'shared language named first');
});

test('the second alternative covers the services the language match lacks, from OFFERINGS', () => {
  const [lang, svc] = alternativesFor(founder, recordedPractitioners);
  assert.ok(svc, 'a second alternative exists while someone accepting offers couples work or EMDR');
  const langP = by(lang!.slug);
  const svcP = by(svc!.slug);
  assert.notEqual(svcP.slug, langP.slug);
  assert.deepEqual(svc!.services, ['couples counselling', 'EMDR']);
  assert.equal(svc!.bookService, 'couples-therapy');
  assert.match(alternativeLabel(svc!), /^For couples counselling or EMDR, \w+$/);
  for (const s of ['couples-therapy', 'emdr-therapy']) {
    assert.ok(!langP.services.includes(s) && svcP.services.includes(s));
  }
});

test('with no language match, the first accepting colleague, and nobody who is not accepting', () => {
  const roster: Practitioner[] = recordedPractitioners.map((p) => ({ ...p, languages: p.slug === founder.slug ? p.languages : p.languages.filter((l) => l.tag.startsWith('en')) }));
  const alts = alternativesFor(founder, roster);
  assert.equal(alts[0]!.slug, roster.find((p) => p.acceptingNewClients && p.bookable && p.slug !== founder.slug)!.slug);
  assert.ok(alts.every((a) => by(a.slug).acceptingNewClients));
  assert.deepEqual(alternativesFor(founder, roster.map((p) => ({ ...p, acceptingNewClients: false }))), []);
});

test('the profile builds its hero, line and band from alternativesFor, not the first accepting counsellor', () => {
  const page = src('app/practitioners/[slug]/page.tsx');
  assert.doesNotMatch(page, /defaultBookingPractitioner/);
  assert.match(page, /alternativesFor\(p, practitioners\)/);
  assert.match(page, /alternativeLabel\(alts\[0\]\)/, 'the band uses the same pair');
  assert.match(page, /\{nextOpen\.join\(' · '\)\}\{PACIFIC\}/, 'next open is labelled Pacific');
  assert.match(page, /open=\{i === 0\}/, 'the first answer is open');
  assert.doesNotMatch(page, /secondLanguages\.length > 0 &&/, 'one language section, not two');
});

/* ---------- #369: her own sentence ---------- */

test('"not the right fit" is the first sentence of her own answer, verbatim', () => {
  for (const p of recordedPractitioners.filter((x) => x.voice?.some((v) => NOT_RIGHT_QUESTION.test(v.q)))) {
    const answer = p.voice!.find((v) => NOT_RIGHT_QUESTION.test(v.q))!.a[0]!;
    const s = notRightFit(p)!;
    assert.ok(answer.startsWith(s), p.slug);
    assert.match(s, /[.!?]$/);
    assert.ok(s.length < answer.length || !/[.!?]\s/.test(answer));
  }
  assert.equal(notRightFit(founder), null, 'no answer, no line');
});

/* ---------- #378: the comparison ---------- */

test('each approach label is a substring of her own published training answer', () => {
  let seen = 0;
  for (const p of recordedPractitioners) {
    const answer = p.voice?.find((v) => TRAINING_QUESTION.test(v.q))?.a.join(' ') ?? '';
    for (const t of approachTerms(p)) {
      assert.ok(answer.includes(t), `${p.slug}: "${t}"`);
      assert.ok(APPROACH_TERMS.includes(t));
      seen++;
    }
  }
  assert.ok(seen > 0);
  assert.ok(!approachTerms(by('savneet-singh')).includes('EMDR'));
});

test('the comparison has one column per accepting counsellor and types nothing', () => {
  const cols = compareColumns(recordedPractitioners, FALLBACK_CATALOG);
  assert.deepEqual(cols.map((c) => c.slug), recordedPractitioners.filter((p) => p.acceptingNewClients).map((p) => p.slug));
  for (const c of cols) {
    const p = by(c.slug);
    assert.doesNotMatch(JSON.stringify(c), new RegExp(p.credentials.map((x) => x.number).join('|')), 'no registration numbers');
    for (const f of c.fees) assert.match(f, /\$\d+ for \d+ minutes/);
    for (const m of c.missing) for (const b of m.by) assert.ok(by(b.slug).acceptingNewClients);
  }
  assert.ok(!cols.some((c) => c.slug === founder.slug));
});

test('"where" follows the insurance gate', () => {
  const lapsed = recordedPractitioners.map((p) => withInsuranceGate(p, '2099-01-01'));
  const camille = compareColumns(lapsed, FALLBACK_CATALOG).find((c) => c.slug === 'camille-granda')!;
  assert.doesNotMatch(camille.where, /Alberta|elsewhere in Canada/);
});

/* ---------- #355: /practitioners ---------- */

test('/practitioners lists accepting counsellors first, keeping roster order within each group', () => {
  const order = rosterOrder(recordedPractitioners).map((p) => p.acceptingNewClients);
  assert.equal(order.indexOf(false), order.filter(Boolean).length, 'every accepting row before every other');
  assert.equal(rosterOrder(recordedPractitioners).at(-1)!.slug, founder.slug);
  assert.ok(lowestFee(by('savneet-singh'), FALLBACK_CATALOG)?.startsWith('$'));
});

test('the new booking locations are registered and calendar-alt stays last', () => {
  for (const l of ['practitioners-row', 'place-practitioner', 'counsellor-compare']) assert.ok(BOOK_LOCATIONS.includes(l), l);
  assert.equal(BOOK_LOCATIONS[BOOK_LOCATIONS.length - 1], 'calendar-alt');
  const page = src('app/practitioners/page.tsx');
  assert.match(page, /export const revalidate = 1800/);
  assert.match(page, /location="practitioners-row"/);
  assert.doesNotMatch(page, /immigration stress/);
  assert.doesNotMatch(page, /Registration numbers are shown in full/);
  assert.match(src('components/CounsellorCompare.tsx'), /PACIFIC/);
  assert.doesNotMatch(src('components/CounsellorCompare.tsx'), /^'use client'/);
});

test('the comparison names each colleague once for everything she covers', () => {
  const savneet = compareColumns(recordedPractitioners, FALLBACK_CATALOG).find((c) => c.slug === 'savneet-singh')!;
  const groups = groupMissing(savneet.missing);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0]!.labels, ['couples counselling', 'EMDR', 'family counselling']);
  assert.deepEqual(groups[0]!.by.map((b) => b.slug), ['camille-granda']);
});

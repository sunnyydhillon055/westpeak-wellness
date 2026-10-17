import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import { recordedPractitioners, type Practitioner } from '../lib/practitioners.ts';
import {
  OFFERINGS, chooserLines, focusTerms, altBookings, sessionInHerWords, whoSheSees, compareColumns,
  feeLines, notOffered, notOfferedSentence, groupMissing, SESSION_QUESTION,
} from '../lib/practitioner-facts.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';

/* wf/r11-profiles-choice, 16 Oct 2026: items 557, 561, 562, 572, 573, 582
   and 583. Every line and cell is derived from the roster, OFFERINGS and the
   catalogue; these tests map each back to its source. */

const by = (slug: string) => recordedPractitioners.find((p) => p.slug === slug)!;
const src = (f: string) => readFileSync(f, 'utf8');
const open = recordedPractitioners.filter((p) => p.acceptingNewClients && p.bookable);

/* ---------- 573: the chooser ---------- */

test('every chooser line maps to a roster field, and a one-counsellor line is true of her alone', () => {
  const lines = chooserLines(recordedPractitioners, FALLBACK_CATALOG);
  assert.ok(lines.length > 0);
  for (const l of lines) {
    const p = l.slug ? by(l.slug) : null;
    if (p) assert.ok(p.acceptingNewClients && p.bookable, `${l.slug} cannot be booked`);
    if (l.kind === 'language') {
      const has = (q: Practitioner) => q.languages.some((x) => x.name === l.terms[0]);
      assert.ok(p && has(p));
      assert.equal(open.filter(has).length, 1, l.terms[0]);
      assert.ok(!p!.languages.find((x) => x.name === l.terms[0])!.tag.startsWith('en'));
    } else if (l.kind === 'service') {
      for (const t of l.terms) {
        const o = OFFERINGS.find((x) => t === x.label || t.startsWith(x.label))!;
        assert.ok(o, t);
        assert.ok(p!.services.includes(o.service), `${p!.slug} does not offer ${o.service}`);
        assert.equal(open.filter((q) => q.services.includes(o.service)).length, 1, o.service);
      }
      assert.equal(l.service === 'couples-therapy', l.terms.some((t) => t === 'couples counselling'));
    } else if (l.kind === 'focus') {
      for (const t of l.terms) {
        assert.ok(focusTerms(p!).includes(t));
        assert.equal(open.filter((q) => focusTerms(q).includes(t)).length, 1, t);
        assert.ok(p!.focus.some((f) => f.label.toLowerCase().includes(t)), `${t} is not in her own labels`);
      }
    } else {
      assert.equal(l.slug, null);
      for (const t of l.terms) assert.ok(open.every((q) => focusTerms(q).includes(t)), t);
    }
  }
  /* What the researcher read off the roster on 16 Oct 2026. */
  const who = (pred: (l: (typeof lines)[number]) => boolean) => lines.find(pred)?.slug;
  assert.equal(who((l) => l.kind === 'language' && l.terms[0] === 'Punjabi'), 'savneet-singh');
  assert.equal(who((l) => l.kind === 'language' && l.terms[0] === 'Tagalog'), 'camille-granda');
  assert.equal(who((l) => l.service === 'couples-therapy'), 'camille-granda');
  assert.equal(who((l) => l.kind === 'focus' && l.terms.includes('grief')), 'camille-granda');
  assert.equal(who((l) => l.kind === 'focus' && l.terms.includes('depression')), 'savneet-singh');
  assert.equal(who((l) => l.kind === 'focus' && l.terms.includes('personality disorders')), 'savneet-singh');
  assert.deepEqual(lines.find((l) => l.kind === 'shared')!.terms.sort(), ['anxiety', 'trauma']);
});

test('nobody who cannot be booked is in the chooser, and one bookable counsellor means no chooser', () => {
  const lines = chooserLines(recordedPractitioners, FALLBACK_CATALOG);
  assert.ok(!lines.some((l) => l.slug === 'aman-bains-dhillon'));
  const one = recordedPractitioners.map((p) => (p.slug === 'savneet-singh' ? { ...p, acceptingNewClients: false } : p));
  assert.deepEqual(chooserLines(one, FALLBACK_CATALOG), []);
});

test('EMDR says "including the intensive" only when her catalogue line has one', () => {
  const lines = chooserLines(recordedPractitioners, FALLBACK_CATALOG);
  const intensive = feeLines(by('camille-granda'), FALLBACK_CATALOG).some((l) => l.service === 'emdr-therapy' && l.parts.some((x) => x.as === 'intensive'));
  assert.equal(lines.some((l) => l.terms.some((t) => /including the intensive/.test(t))), intensive);
  const none = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.filter((i) => i.name !== 'EMDR Intensive') };
  assert.ok(!chooserLines(recordedPractitioners, none).some((l) => l.terms.some((t) => /intensive/.test(t))));
});

test('/practitioners renders the chooser above the rows, server-side, each line a booking', () => {
  const page = src('app/practitioners/page.tsx');
  assert.match(page, /chooserLines\(roster, catalog\)/);
  assert.ok(page.indexOf('chooser.map(') < page.indexOf('{open.map(row)}'), 'above the rows');
  assert.match(page, /href=\{chooserHref\(l\)\}/);
  assert.match(page, /bookHrefFor\(roster\.filter\(\(p\) => p\.slug === l\.slug\), l\.service\)/);
  assert.doesNotMatch(page, /^'use client'/);
});

/* ---------- 561: book the colleague ---------- */

test('the not-offered links split couples work from the rest, so couples opens the couples consultation', () => {
  assert.deepEqual(altBookings(['couples counselling', 'EMDR', 'family counselling'], ['couples-therapy', 'emdr-therapy', 'family-counselling']), [
    { labels: ['couples counselling'], service: 'couples-therapy' },
    { labels: ['EMDR', 'family counselling'] },
  ]);
  assert.deepEqual(altBookings(['EMDR'], ['emdr-therapy']), [{ labels: ['EMDR'] }]);
  const savneet = by('savneet-singh');
  const missing = notOffered(savneet, recordedPractitioners);
  const line = notOfferedSentence('Savneet', missing)!;
  assert.deepEqual(line.services, missing.map((m) => m.service));
  assert.deepEqual(groupMissing(missing)[0]!.services, ['couples-therapy', 'emdr-therapy', 'family-counselling']);
  for (const s of line.services) assert.ok(by(line.by[0]!.slug).services.includes(s), s);
});

test('the profile, the place pages and the comparison all book through NotOfferedLinks, counted as not-offered-alt', () => {
  assert.ok(BOOK_LOCATIONS.includes('not-offered-alt'));
  assert.equal(BOOK_LOCATIONS.at(-1), 'not-offered-alt', 'appended, so no earlier key moves');
  const comp = src('components/CounsellorCompare.tsx');
  assert.match(comp, /location="not-offered-alt"/);
  assert.match(comp, /href=\{bookHrefFor\(\[one\], b\.service\)\}/);
  assert.match(comp, /if \(!one\?\.bookable\)/, 'a colleague who books by reply keeps the profile link only');
  for (const f of ['app/practitioners/[slug]/page.tsx', 'app/practitioners/[slug]/[place]/page.tsx']) {
    assert.match(src(f), /<NotOfferedLinks/, f);
  }
  assert.match(src('app/practitioners/[slug]/[place]/page.tsx'), /citySlug=\{loc\.slug\}\s+verb=/);
});

/* ---------- 557, 562, 582: the profile ---------- */

test('the profile offers one card per roster service, after what she works with, booking that service', () => {
  const page = src('app/practitioners/[slug]/page.tsx');
  const works = page.indexOf('What {first} works with');
  const offers = page.indexOf('What {first} offers');
  assert.ok(works > 0 && offers > works && offers < page.indexOf('<h2>You may be</h2>'));
  assert.equal(page.split('What {first} offers').length - 1, 1, 'one offers section, not two');
  assert.match(page, /p\.services\.flatMap\(\(s\) =>/);
  assert.match(page, /fee: fees\.find\(\(f\) => f\.service === s\)/, 'the fee from the catalogue via feeLines');
  assert.match(page, /href=\{bookHrefFor\(\[p\], svc\.slug\)\}/);
  assert.match(page, /<Link href=\{`\/services\/\$\{svc\.slug\}`\}>\{label\}<\/Link>/, 'the fee labels link the service');
  /* Savneet's roster has no couples, EMDR or family service, so none of
     those can become a card on her page. */
  for (const s of ['couples-therapy', 'emdr-therapy', 'family-counselling']) assert.ok(!by('savneet-singh').services.includes(s));
});

test('the comparison sits under the fact strip, the hero links #compare and #fees', () => {
  const page = src('app/practitioners/[slug]/page.tsx');
  const strip = page.indexOf('id="fees"');
  const compare = page.indexOf('<CounsellorCompare');
  assert.ok(strip > 0 && compare > strip && compare < page.indexOf('<h2>About {first}</h2>'));
  assert.equal(page.split('<CounsellorCompare').length - 1, 1);
  assert.match(page, /<a href="#compare">/);
  assert.match(page, /href="#fees">Fees: from \{from\}<\/a>/);
  assert.match(page, /lowestFee\(p, catalog\)/);
  assert.match(page, /<Link href="\/pricing">Fees and coverage<\/Link>\./, '/pricing stays under the strip');
  const comp = src('components/CounsellorCompare.tsx');
  assert.match(comp, /location\.hash==='#compare'/);
  assert.match(comp, /<details className="faq-item" id="compare"/);
});

/* ---------- 583: place pages ---------- */

test('the place page carries the closed comparison, headers linking each counsellor for the same city', () => {
  const page = src('app/practitioners/[slug]/[place]/page.tsx');
  assert.match(page, /<CounsellorCompare roster=\{practitioners\} catalog=\{catalog\} location="counsellor-compare" collapsed brief citySlug=\{loc\.slug\} \/>/);
  assert.doesNotMatch(page, /also sees clients in \{loc\.city\}/);
  assert.match(src('components/CounsellorCompare.tsx'), /<Link href=\{header\(c\.slug\)\}>/);
});

/* ---------- 572: her own words ---------- */

test('the session line is the first sentence of her own answer, verbatim, and only hers', () => {
  let seen = 0;
  for (const p of recordedPractitioners) {
    const answer = p.voice?.find((v) => SESSION_QUESTION.test(v.q))?.a[0];
    const s = sessionInHerWords(p);
    if (!answer) { assert.equal(s, null); continue; }
    assert.ok(s && answer.startsWith(s), p.slug);
    assert.match(s!, /[.!?]$/);
    seen++;
  }
  assert.ok(seen >= 2);
  for (const f of ['app/practitioners/page.tsx', 'components/CounsellorCards.tsx']) {
    assert.match(src(f), /In her words: &ldquo;\{sessionInHerWords\(p\)\}&rdquo;/, f);
  }
});

test('who she sees names couples and families only when OFFERINGS lists them', () => {
  assert.equal(whoSheSees(by('camille-granda')), 'Individuals, couples and families');
  assert.equal(whoSheSees(by('savneet-singh')), 'Individuals');
  for (const c of compareColumns(recordedPractitioners, FALLBACK_CATALOG)) {
    const p = by(c.slug);
    assert.equal(/couples/.test(c.sees), p.services.includes('couples-therapy'));
    assert.equal(/families/.test(c.sees), p.services.includes('family-counselling'));
    assert.doesNotMatch(c.sees, /\d|adult|child|teen|age/i, 'no age limit is claimed');
  }
});

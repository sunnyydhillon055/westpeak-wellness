import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_CATALOG, money, fallbackFee, type Catalog } from '../lib/cliniko-catalog.ts';
import { recordedPractitioners, type Practitioner } from '../lib/practitioners.ts';
import {
  feeLines, feePhrase, consultLine, reachLine, notOffered, insuranceLine, offerItems,
  acceptingSentences, longDate,
} from '../lib/practitioner-facts.ts';
import { sessionOffers } from '../lib/schema.ts';
import { resources } from '../lib/resources.ts';
import { guides } from '../lib/guides.ts';
import { getExtra } from '../lib/depth.ts';
import { BOOK_LOCATIONS } from '../lib/conversion-detail.ts';
import { getTool } from '../lib/tools.ts';

const by = (slug: string) => recordedPractitioners.find((p) => p.slug === slug)!;
const savneet = by('savneet-singh');
const camille = by('camille-granda');
const founder = by('aman-bains-dhillon');
const fee = (name: string) => money(FALLBACK_CATALOG.items.find((i) => i.name === name)!.cents);

/* ---------- #174: the profile fact strip ---------- */

test('fees come from the catalogue for exactly the services she offers', () => {
  const s = feeLines(savneet, FALLBACK_CATALOG);
  assert.deepEqual(s.map((l) => l.label), ['individual counselling']);
  assert.equal(feePhrase(s[0]!), `${fee('Individual Counselling')} for 50 minutes`);

  const c = feeLines(camille, FALLBACK_CATALOG);
  assert.deepEqual(c.map((l) => l.label), ['individual counselling', 'couples counselling', 'EMDR'],
    'family counselling has no appointment type, so no fee is guessed for it');
  assert.equal(feePhrase(c[1]!), `${fee('Couples Counselling')} for 50 minutes, or extended ${fee('Couples Extended')} for 110 minutes`);

  const moved: Catalog = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Individual Counselling' ? { ...i, cents: 15500 } : i)) };
  assert.equal(feePhrase(feeLines(savneet, moved)[0]!), '$155 for 50 minutes', 'a catalogue change moves the strip');
  const gone: Catalog = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.filter((i) => i.name !== 'Individual Counselling') };
  assert.deepEqual(feeLines(savneet, gone), [], 'a type the catalogue lacks is left out, not invented');
});

test('the free consultation line reads its length from the catalogue', () => {
  assert.equal(consultLine(FALLBACK_CATALOG), 'First 30-minute consultation free');
  const paid: Catalog = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.map((i) => (i.name === 'Initial Consultation' ? { ...i, cents: 5000 } : i)) };
  assert.equal(consultLine(paid), null);
});

test('reach follows the gated roster', () => {
  assert.equal(reachLine(savneet), 'Online only, anywhere in BC');
  assert.equal(reachLine(camille), 'Online only, anywhere in Canada');
  assert.equal(reachLine({ reach: undefined }), 'Online only, anywhere in BC');
});

test('"not offered" is the services she lacks, pointing only at accepting colleagues', () => {
  const n = notOffered(savneet, recordedPractitioners);
  assert.deepEqual(n.map((x) => x.label), ['couples counselling', 'EMDR', 'family counselling']);
  for (const x of n) {
    assert.deepEqual(x.by.map((b) => b.slug), ['camille-granda']);
    assert.ok(!x.by.some((b) => b.slug === founder.slug), 'never points at someone not taking new clients');
  }
  assert.deepEqual(notOffered(camille, recordedPractitioners), []);
});

test('the insurance line shows only while the policy is current', () => {
  const p = (validTo: string): Pick<Practitioner, 'insurance'> => ({ insurance: { ...camille.insurance!, validTo } });
  assert.equal(insuranceLine(p('2026-10-01'), '2026-10-01'), 'Professional liability insurance, $5,000,000 per claim, current to 1 October 2026');
  assert.equal(insuranceLine(p('2026-10-01'), '2026-10-02'), null, 'not in the grace period');
  assert.equal(insuranceLine(p('2026-10-01'), '2026-11-30'), null);
  assert.equal(insuranceLine({ insurance: undefined }, '2026-10-01'), null);
  assert.match(insuranceLine(savneet, '2026-10-01')!, /current to 1 June 2027$/);
  assert.equal(longDate('2026-12-31'), '31 December 2026');
});

test('makesOffer is the consultation plus the strip, priced from the same catalogue', () => {
  const items = offerItems(savneet, FALLBACK_CATALOG);
  assert.deepEqual(items.map((i) => i.name), ['Free consultation', 'Individual counselling']);
  const offers = sessionOffers(items, '/practitioners/savneet-singh');
  assert.equal(offers[0]!.price, '0.00');
  assert.equal(offers[1]!.price, (FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')!.cents / 100).toFixed(2));
  assert.equal(offers[1]!.priceCurrency, 'CAD');
  assert.deepEqual(offerItems(camille, FALLBACK_CATALOG).map((i) => i.name), [
    'Free consultation', 'Individual counselling', 'Couples counselling', 'Couples counselling (extended)',
    'EMDR', 'EMDR (intensive)',
  ]);
});

/* ---------- #112: the RCC page names who is taking clients, and the fee ---------- */

const verify = resources.find((r) => r.slug === 'verify-a-counsellor-in-bc')!;

test('the RCC page answers "looking for one" under the short answer, from the roster', () => {
  const block = verify.afterShortAnswer!;
  assert.ok(block, 'afterShortAnswer missing');
  const text = block.body.join(' ');
  assert.match(text, /\/practitioners\/camille-granda/);
  assert.match(text, /\/practitioners\/savneet-singh/);
  assert.ok(text.includes(fallbackFee('Individual Counselling')), 'the individual fee, from the catalogue');
  assert.match(text, /\(\/pricing\)/);
  assert.ok(block.book, 'a tracked consultation link');
  assert.ok(!text.includes(founder.name) && !text.includes('Aman'), 'no founder on this page');
  for (const p of recordedPractitioners) {
    for (const c of p.credentials) assert.ok(!text.includes(c.number), `no registration number (${c.number})`);
  }
  assert.ok(verify.closingBand && /register/.test(verify.closingBand.heading));
});

test('accepting sentences name only counsellors taking new clients', () => {
  const s = acceptingSentences(recordedPractitioners).join(' ');
  assert.ok(!s.includes(founder.name));
  assert.match(s, /Savneet Singh\]\(\/practitioners\/savneet-singh\) works in English and Punjabi, by video anywhere in BC, and offers individual counselling\./);
});

test('the RCC page answers its own "Is the fee published?" with /pricing', () => {
  const fees = getExtra('resources', 'verify-a-counsellor-in-bc')
    .flatMap((s) => s.list ?? [])
    .find((i) => i.label === 'Is the fee published?');
  assert.ok(fees && fees.detail.includes('(/pricing)'));
});

test('the find-a-counsellor FAQ no longer treats a missing directory listing as a warning', () => {
  const faq = verify.faqs.find((f) => /Find a Counsellor/.test(f.q))!;
  assert.doesNotMatch(faq.a, /is not there, ask them/);
  assert.match(faq.a, /search-our-member-register/);
  assert.match(faq.a, /choose to be listed/);
});

/* ---------- #144: the workplace page ends in a next step ---------- */

test('every section booking link uses a known location, and the workplace page has one', () => {
  for (const r of resources) {
    for (const s of r.sections) {
      if (s.book) assert.ok(BOOK_LOCATIONS.includes(s.book.location), `${r.slug}: ${s.book.location} is not in BOOK_LOCATIONS`);
    }
  }
  const work = resources.find((r) => r.slug === 'workplace-mental-health-bc')!;
  const fits = work.sections.find((s) => s.h2 === 'Where counselling fits')!;
  assert.equal(fits.book?.location, 'mid-resource-work');
  const text = fits.body!.join(' ');
  assert.ok(text.indexOf('/compare/efap-vs-private-counselling') < text.indexOf(fallbackFee('Individual Counselling')), 'EFAP first, then privately');
  assert.match(text, /\/for\/employers-and-hr/);
  assert.match(text, /depends on the plan/);
});

/* ---------- #142, #143: the work-and-leave pages ---------- */

const g = (slug: string) => guides.find((x) => x.slug === slug)!;
const allText = (slug: string) => g(slug).sections.flatMap((s) => [...(s.body ?? []), ...(s.list ?? []).map((i) => i.detail)]).join(' ');

test('the leave guides state the session fee from the catalogue and link /pricing', () => {
  for (const slug of ['stress-leave-bc', 'doctors-note-for-a-mental-health-leave', 'return-to-work-after-a-mental-health-leave', 'ei-sickness-benefits-and-therapy']) {
    const t = allText(slug);
    assert.ok(t.includes(fallbackFee('Individual Counselling')), `${slug}: no catalogue fee`);
    assert.match(t, /\(\/pricing\)/, `${slug}: no /pricing link`);
    assert.match(t, /HR or the plan/, `${slug}: coverage during a leave is the plan's to answer`);
  }
  assert.doesNotMatch(allText('ei-sickness-benefits-and-therapy'), /because most do/);
});

test('the self-check tools are linked from the work pages, and link back', () => {
  for (const slug of ['sick-days-and-mental-health-days-bc', 'stress-leave-bc']) {
    assert.match(allText(slug), /\/tools\/burnout-or-depression/, slug);
  }
  assert.match(allText('ei-sickness-benefits-and-therapy'), /\/tools\/what-can-i-access/);
  const work = resources.find((r) => r.slug === 'workplace-mental-health-bc')!;
  const workText = work.sections.flatMap((s) => s.body ?? []).join(' ');
  assert.match(workText, /\/tools\/burnout-or-depression/);
  assert.match(workText, /\/tools\/what-can-i-access/);
  const back = getTool('burnout-or-depression')!.related!.map((r) => r.href);
  assert.ok(back.includes('/resources/workplace-mental-health-bc'));
  assert.ok(back.includes('/guides/sick-days-and-mental-health-days-bc'));
  assert.ok(back.includes('/guides/stress-leave-bc'));
});

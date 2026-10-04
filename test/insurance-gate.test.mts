import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  insuranceStatus, insuredProvinces, insuredReach, withInsuranceGate, insuranceGateDate,
  recordedPractitioners, INSURANCE_GRACE_DAYS, vancouverToday, type Practitioner,
  orgCounsellors, servedProvinceNames,
} from '../lib/practitioners.ts';
import { readFileSync } from 'node:fs';
import { FOUNDER_RE } from '../lib/machine-facts.ts';
import { placesFor, ALBERTA_PLACES } from '../lib/practitioner-places.ts';

/* Alberta and "anywhere in Canada" stand on a liability certificate. These
 * prove the date decides, rather than somebody remembering: current through
 * validTo, a 14-day grace for the renewal to be typed in, then gated. */

const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
/* `reach: 'canada'` is set here, not read from her record: it came off the
   roster on 3 Oct 2026, and the gate must still drop it for whoever carries it. */
const policy = (validTo: string): Practitioner => ({
  ...camille,
  reach: 'canada',
  insurance: { ...camille.insurance!, validTo },
});

test('the grace is fourteen days and the gate date follows from validTo', () => {
  assert.equal(INSURANCE_GRACE_DAYS, 14);
  assert.equal(insuranceGateDate(policy('2026-10-01')), '2026-10-15');
});

test('status moves current -> grace -> lapsed on the right days', () => {
  const p = policy('2026-10-01');
  assert.equal(insuranceStatus(p, '2026-10-01'), 'current');
  assert.equal(insuranceStatus(p, '2026-10-02'), 'grace');
  assert.equal(insuranceStatus(p, '2026-10-14'), 'grace');
  assert.equal(insuranceStatus(p, '2026-10-15'), 'lapsed');
  assert.equal(insuranceStatus({ insurance: undefined }, '2026-10-01'), 'none');
});

test('Alberta and Canada-wide reach stand through the grace and drop when it ends', () => {
  const p = policy('2026-10-01');
  assert.deepEqual(insuredProvinces(p, '2026-10-14'), ['BC', 'AB']);
  assert.equal(insuredReach(p, '2026-10-14'), 'canada');
  assert.deepEqual(insuredProvinces(p, '2026-10-15'), ['BC']);
  assert.equal(insuredReach(p, '2026-10-15'), undefined);
});

test('a lapsed policy removes every Alberta place page and leaves BC alone', () => {
  const p = policy('2026-09-01');
  const today = '2026-10-01';
  const gated = withInsuranceGate(p, today);
  const albertan = new Set(ALBERTA_PLACES.map((l) => l.slug));
  assert.ok(placesFor(p.provinces).some((l) => albertan.has(l.slug)), 'precondition: recorded roster has Alberta pages');
  assert.equal(placesFor(gated.provinces).filter((l) => albertan.has(l.slug)).length, 0);
  assert.deepEqual(
    placesFor(gated.provinces).map((l) => l.slug),
    placesFor(['BC']).map((l) => l.slug),
  );
  assert.equal(gated.reach, undefined);
  assert.equal('reach' in gated, false);
});

test('a current policy returns the practitioner unchanged', () => {
  const p = policy('2027-10-01');
  assert.equal(withInsuranceGate(p, '2026-10-01'), p);
});

test('today is computed in Vancouver, not UTC', () => {
  /* 03:00 UTC on 2 Oct is still the evening of 1 Oct in Vancouver. */
  assert.equal(vancouverToday(new Date('2026-10-02T03:00:00Z')), '2026-10-01');
});

/* The organisation node in app/layout.tsx reads its provinces from the gated
 * roster (1 Oct 2026). A lapsed policy must take Alberta out of the sitewide
 * JSON-LD, not only off the place pages. */
const rosterWith = (validTo: string, today: string) =>
  recordedPractitioners.map((p) => withInsuranceGate(p.slug === 'camille-granda' ? policy(validTo) : p, today));

test('a lapsed policy removes Alberta from the layout areaServed', () => {
  assert.deepEqual(servedProvinceNames(rosterWith('2026-10-01', '2026-10-14')), ['British Columbia', 'Alberta']);
  assert.deepEqual(servedProvinceNames(rosterWith('2026-10-01', '2026-10-15')), ['British Columbia']);
});

test('the layout builds areaServed from the roster, never an Alberta literal', () => {
  const src = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /placeNode\(\s*['"]Alberta['"]\s*\)/);
  assert.match(src, /servedProvinceNames\(\)/);
});

test('the organisation employee list is accepting, bookable counsellors and never the founder', () => {
  const staff = orgCounsellors(recordedPractitioners);
  assert.ok(staff.length > 0);
  for (const p of staff) {
    assert.ok(p.acceptingNewClients && p.bookable, p.slug);
    assert.doesNotMatch(`${p.slug} ${p.name}`, FOUNDER_RE);
  }
  /* Even if she reopened her calendar, the sitewide node would not name her. */
  const reopened = recordedPractitioners.map((p) => (FOUNDER_RE.test(p.slug) ? { ...p, acceptingNewClients: true, bookable: true } : p));
  assert.ok(orgCounsellors(reopened).every((p) => !FOUNDER_RE.test(p.slug)));
});

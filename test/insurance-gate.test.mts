import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  insuranceStatus, insuredProvinces, insuredReach, withInsuranceGate, insuranceGateDate,
  recordedPractitioners, INSURANCE_GRACE_DAYS, vancouverToday, type Practitioner,
} from '../lib/practitioners.ts';
import { placesFor, ALBERTA_PLACES } from '../lib/practitioner-places.ts';

/* Alberta and "anywhere in Canada" stand on a liability certificate. These
 * prove the date decides, rather than somebody remembering: current through
 * validTo, a 14-day grace for the renewal to be typed in, then gated. */

const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
const policy = (validTo: string): Practitioner => ({
  ...camille,
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

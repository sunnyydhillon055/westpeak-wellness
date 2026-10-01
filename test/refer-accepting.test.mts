import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acceptingFrom, acceptingCounsellors } from '../app/refer/accepting.ts';
import { practitioners, recordedPractitioners } from '../lib/practitioners.ts';

/* The /refer pages print who a referred person would see. A printed sheet
 * cannot be corrected after it leaves the building, so the list must be
 * exactly the accepting roster: nobody who is not accepting (the founder),
 * no registration numbers, and an honest empty state. */

test('lists exactly the counsellors accepting new clients', () => {
  const got = acceptingCounsellors().map((c) => c.slug).sort();
  const want = practitioners.filter((p) => p.acceptingNewClients).map((p) => p.slug).sort();
  assert.deepEqual(got, want);
  assert.ok(!got.includes('aman-bains-dhillon'), 'the founder is not accepting and must not be listed');
});

test('carries no registration number', () => {
  const numbers = practitioners.flatMap((p) => p.credentials.map((c) => c.number));
  const text = JSON.stringify(acceptingCounsellors());
  for (const n of numbers) assert.ok(!text.includes(n), `registration number ${n} leaked`);
});

test('three focus labels at most, services named, profile and booking paths built from the slug', () => {
  for (const c of acceptingCounsellors()) {
    assert.ok(c.focus.length > 0 && c.focus.length <= 3);
    assert.ok(c.services.length > 0, `${c.slug} offers nothing nameable`);
    assert.equal(c.profilePath, `/practitioners/${c.slug}`);
    assert.equal(c.bookPath, `/book?with=${c.slug}`);
  }
});

test('Canada-wide reach reads as such; a province list reads as names', () => {
  const camille = recordedPractitioners.find((p) => p.slug === 'camille-granda')!;
  const [wide] = acceptingFrom([camille]);
  assert.equal(wide!.area, 'Anywhere in Canada');
  const [narrow] = acceptingFrom([{ ...camille, reach: undefined }]);
  assert.equal(narrow!.area, 'British Columbia and Alberta');
});

test('nobody accepting gives an empty list, not an error', () => {
  assert.deepEqual(acceptingFrom(practitioners.map((p) => ({ ...p, acceptingNewClients: false }))), []);
});

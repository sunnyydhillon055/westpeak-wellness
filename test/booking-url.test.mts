import test from 'node:test';
import assert from 'node:assert/strict';
import { bookingsUrlFor, site, CONSULT_TYPE, CLINIKO_BUSINESS } from '../lib/site.ts';
import { practitioners, defaultBookingPractitioner } from '../lib/practitioners.ts';

/* /book embeds a specific counsellor's calendar. If the practitioner filter
   ever drops off the URL, the page silently reverts to the practice-wide
   calendar, which also lists a counsellor who is not taking new clients. */

test('a practitioner booking URL keeps the free consultation filter and adds the practitioner', () => {
  const u = new URL(bookingsUrlFor('123'));
  assert.equal(u.searchParams.get('appointment_type_id'), CONSULT_TYPE);
  assert.equal(u.searchParams.get('practitioner_id'), '123');
  assert.equal(u.searchParams.get('business_id'), CLINIKO_BUSINESS);
});

test('every public booking URL names the practice business, never the founder\'s', () => {
  for (const u of [site.bookingsUrl, site.bookingsPaidUrl, site.bookingsFallbackUrl]) {
    assert.equal(new URL(u).searchParams.get('business_id'), CLINIKO_BUSINESS, u);
  }
});

test('without a practitioner it is the ordinary consultation URL', () => {
  assert.equal(bookingsUrlFor(undefined), site.bookingsUrl);
});

test('whoever takes new clients is bookable and has a Cliniko id', () => {
  const p = defaultBookingPractitioner();
  assert.ok(p, 'somebody must be taking new clients');
  assert.equal(p!.bookable, true, `${p!.name} is the default but not bookable`);
  assert.match(p!.clinikoPractitionerId ?? '', /^\d{10,}$/, `${p!.name} has no Cliniko practitioner id`);
});

test('every bookable practitioner with an id has a unique one', () => {
  const ids = practitioners.map((p) => p.clinikoPractitionerId).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
});

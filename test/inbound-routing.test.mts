import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeInbound } from '../lib/inbound-routing.ts';
import { site } from '../lib/site.ts';

/* The routing decided 11 Sep 2026: named counsellor first, then the page's
   language, then the script of the message, then everyone accepting. info@ is
   always in copy. The founder, on leave, is never a recipient. */

const CAMILLE = 'camille.westpeakwellness@gmail.com';
const SAVNEET = 'savneet.westpeakwellness@gmail.com';

test('a /book?with= enquiry goes to that counsellor, info@ in copy', () => {
  const r = routeInbound({ practitioner: 'savneet-singh', source: '/book', message: 'Hi', name: 'A' });
  assert.deepEqual(r.to, [SAVNEET]);
  assert.deepEqual(r.cc, [site.email]);
});

test('a Punjabi page routes to the Punjabi speaker; a Tagalog page to the Tagalog speaker', () => {
  assert.deepEqual(routeInbound({ source: '/punjabi', message: 'x', name: 'B' }).to, [SAVNEET]);
  assert.deepEqual(routeInbound({ source: '/practitioners/camille-granda/surrey/tl', message: 'x', name: 'B' }).to, [CAMILLE]);
  assert.deepEqual(routeInbound({ source: '/tagalog-counselling/surrey', message: 'x', name: 'B' }).to, [CAMILLE]);
});

test('Gurmukhi in the message routes to the Punjabi speaker whatever the page', () => {
  assert.deepEqual(routeInbound({ source: '/contact', message: 'ਮੈਨੂੰ ਗੱਲ ਕਰਨੀ ਹੈ', name: 'C' }).to, [SAVNEET]);
});

test('an unsigned English enquiry goes to everyone taking new clients', () => {
  const r = routeInbound({ source: '/contact', message: 'I would like to book.', name: 'D' });
  assert.deepEqual([...r.to].sort(), [CAMILLE, SAVNEET].sort());
  assert.deepEqual(r.cc, [site.email]);
});

test('the founder is never a recipient, even when asked for by name', () => {
  const r = routeInbound({ practitioner: 'aman-bains-dhillon', source: '/practitioners/aman-bains-dhillon', message: 'x', name: 'E' });
  assert.ok(!r.to.some((e) => /aman/i.test(e)));
  assert.ok(r.to.length >= 1);
});

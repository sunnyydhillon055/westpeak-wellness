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

/* THE FORM'S ANSWERS — 1 Oct 2026. routeInbound never read `looking` or
   `where`, so all ten human enquiries went to both counsellors. The answers
   now narrow the pool through the roster, after a named counsellor and
   before the page's language. */

test('looking=punjabi goes to the Punjabi speaker', () => {
  const r = routeInbound({ source: '/contact', message: 'x', name: 'F', looking: 'punjabi', where: 'bc' });
  assert.deepEqual(r.to, [SAVNEET]);
  assert.deepEqual(r.practitioners, ['savneet-singh']);
});

test('tagalog, couples, trauma and family go to the counsellor who offers them', () => {
  for (const looking of ['tagalog', 'couples', 'trauma', 'family']) {
    const r = routeInbound({ source: '/contact', message: 'x', name: 'G', looking, where: 'bc' });
    assert.deepEqual(r.to, [CAMILLE], looking);
  }
});

test('where=ab goes to the counsellor who may see clients in Alberta', () => {
  const r = routeInbound({ source: '/contact', message: 'x', name: 'H', looking: 'individual', where: 'ab' });
  assert.deepEqual(r.to, [CAMILLE]);
});

test('answers both counsellors fit, or nobody fits, leave the pool as it was', () => {
  const both = routeInbound({ source: '/contact', message: 'x', name: 'I', looking: 'individual', where: 'bc' });
  assert.deepEqual([...both.to].sort(), [CAMILLE, SAVNEET].sort());
  /* Punjabi in Alberta: nobody on the roster fits both, so the answers narrow
     nothing and the ordinary steps decide. */
  const none = routeInbound({ source: '/contact', message: 'x', name: 'J', looking: 'punjabi', where: 'ab' });
  assert.ok(none.to.length >= 1);
});

test('a named counsellor still outranks the answers', () => {
  const r = routeInbound({ practitioner: 'savneet-singh', source: '/book', message: 'x', name: 'K', looking: 'couples', where: 'bc' });
  assert.deepEqual(r.to, [SAVNEET]);
});

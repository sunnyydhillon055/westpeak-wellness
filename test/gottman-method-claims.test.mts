import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isGottmanClaim, claimsIn, scanGottmanClaims } from '../scripts/lib/gottman-claims.mjs';

/* A bare "Gottman Method" used as a claim about this practice fails the
 * scan; writing about the method does not (1 Oct 2026, item 229). */

test('claim shapes that say the practice delivers the method fail', () => {
  for (const line of [
    '    short: "Gottman Method: communication, conflict, connection, repair.",',
    '      "Online couples counselling across BC using the Gottman Method. Communication…",',
    '      "Couples work here is grounded in the Gottman Method. One of the most…",',
    "    'Gottman Method Couples Therapy', 'Trauma-informed care',",
    'Sessions are based on the Gottman Method.',
    'This practice is Gottman-trained.',
  ]) assert.equal(isGottmanClaim(line), true, line);
});

test('writing about the method stays allowed', () => {
  for (const line of [
    '      h2: "What makes the Gottman Method different",',
    '{ href: "/guides/how-the-gottman-method-works", label: "How the Gottman Method works" },',
    "    title: 'Gottman Method vs EFT: two roads into couples work',",
    'Westpeak Wellness delivers Gottman Method-informed couples counselling',
    'couples counselling that uses the structure and the tools of the Gottman Method',
    '    short: "Gottman-informed: communication, conflict, connection, repair.",',
    "    'Gottman-informed couples therapy', 'Trauma-informed care',",
  ]) assert.equal(isGottmanClaim(line), false, line);
});

test('claimsIn reports file and line', () => {
  const found = claimsIn('lib/x.ts', 'ok\n  short: "Gottman Method: x",\n');
  assert.deepEqual(found.map((f) => f.line), [2]);
});

test('the site carries no unconfirmed Gottman claim', () => {
  assert.deepEqual(scanGottmanClaims(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), []);
});

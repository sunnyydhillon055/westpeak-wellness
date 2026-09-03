import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCityTopic, conditions } from '../lib/conditions.ts';
import { services } from '../lib/services.ts';
import { pairs } from '../lib/city-services.ts';

/* Conditions exist because three of the five topics the city matrix was built
 * for stopped being services. The risk is a page that resolves to nothing, or
 * one that sends a reader to a service page that redirects. */

test('every pair in the matrix resolves to a topic', () => {
  for (const p of pairs) {
    assert.ok(getCityTopic(p.service), `${p.city}/${p.service} resolves to nothing — the page would 404`);
  }
});

test('every condition routes to a service that actually exists', () => {
  for (const c of conditions) {
    assert.ok(services.some((s) => s.slug === c.service),
      `${c.slug} routes to ${c.service}, which is not a service — the booking link would 404`);
  }
});

test('a real service always wins over a condition of the same slug', () => {
  for (const s of services) {
    const t = getCityTopic(s.slug)!;
    assert.equal(t.isCondition, false, `${s.slug} resolved as a condition, shadowing the real service`);
    assert.equal(t.bookingService, s.slug);
  }
});

test('conditions are not services — they must stay off the menu', () => {
  for (const c of conditions) {
    assert.ok(!services.some((s) => s.slug === c.slug),
      `${c.slug} is both a condition and a service; the five-service decision has been undone`);
  }
});

test('an unknown slug resolves to nothing rather than guessing', () => {
  assert.equal(getCityTopic('not-a-real-topic'), undefined);
  assert.equal(getCityTopic(''), undefined);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, clientKey, LIMITS } from '../lib/rate-limit.ts';

/* The ceiling on the three public forms. Worth testing rather than trusting,
 * because an off-by-one here is invisible until it either lets a flood through
 * or starts silently withholding a distressed person's email. */

const { SOFT_MAX, SOFT_WINDOW_MS, HARD_MAX, HARD_WINDOW_MS } = LIMITS;
const NOW = 1_800_000_000_000;

/** `n` submissions, the most recent `ageMs` ago, one second apart. */
const burst = (n: number, ageMs = 0) =>
  Array.from({ length: n }, (_, i) => NOW - ageMs - i * 1000);

const req = (headers: Record<string, string>) => new Request('https://x.test/', { headers });

test('ordinary use is never throttled', () => {
  assert.equal(classify(burst(1), NOW), 'ok');
  assert.equal(classify(burst(SOFT_MAX), NOW), 'ok', 'the limit itself must pass, not fail');
});

test('one past the soft limit suppresses mail but nothing more', () => {
  assert.equal(classify(burst(SOFT_MAX + 1), NOW), 'throttle');
  /* The distinction the whole file rests on: a throttled person is still
     stored and still answered. Only `drop` discards anything. */
  assert.notEqual(classify(burst(SOFT_MAX + 1), NOW), 'drop');
});

test('only a volume no human produces is discarded', () => {
  assert.equal(classify(burst(HARD_MAX), NOW), 'throttle', 'at the hard limit, not over it');
  assert.equal(classify(burst(HARD_MAX + 1), NOW), 'drop');
});

test('the windows actually expire', () => {
  /* Six submissions, all older than the soft window. Nothing should be held
     against them — otherwise a busy morning throttles someone that afternoon. */
  assert.equal(classify(burst(SOFT_MAX + 1, SOFT_WINDOW_MS + 1000), NOW), 'ok');
  assert.equal(classify(burst(HARD_MAX + 1, HARD_WINDOW_MS + 1000), NOW), 'ok');
});

test('the hard ceiling is reachable, which is the whole reason it is higher', () => {
  /* The two limits are not independent. Five per ten minutes sustains to
     thirty an hour, so a hard limit at or below thirty would be unreachable —
     everything would throttle and nothing would ever drop. The hard tier is
     for whoever keeps going after being throttled, so it must sit above what
     the soft rate sustains. */
  const sustainedSoftPerHour = (SOFT_MAX * HARD_WINDOW_MS) / SOFT_WINDOW_MS;
  assert.ok(
    HARD_MAX > sustainedSoftPerHour,
    `HARD_MAX ${HARD_MAX} is at or below the ${sustainedSoftPerHour}/hour the soft limit already allows, so nothing can ever be dropped`
  );
  /* And it does drop, once someone actually passes it. */
  const spread = Array.from({ length: HARD_MAX + 1 }, (_, i) => NOW - i * 60_000);
  assert.equal(classify(spread, NOW), 'drop');
});

test('no address header means no limiting rather than one shared bucket', async () => {
  /* Local development sends no x-forwarded-for. If this returned a constant,
     every developer request would land in the same bucket and the limiter
     would throttle the only person testing it. */
  assert.equal(await clientKey(req({})), null);
  assert.equal(await clientKey(req({ 'x-forwarded-for': '   ' })), null);
});

test('the stored key is a short hash, not an address', async () => {
  const key = (await clientKey(req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })))!;
  assert.match(key, /^[0-9a-f]{16}$/);
  assert.ok(!key.includes('203'), 'the address must not survive into the store');
});

test('the proxy chain is read left to right', async () => {
  /* The first entry is the real peer; the rest are proxies. Reading the wrong
     end would bucket every visitor behind one CDN node together. */
  const a = await clientKey(req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }));
  const b = await clientKey(req({ 'x-forwarded-for': '203.0.113.8, 10.0.0.1' }));
  const c = await clientKey(req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.2' }));
  assert.notEqual(a, b, 'different clients behind one proxy must not share a bucket');
  assert.equal(a, c, 'the same client through different proxies is the same client');
});

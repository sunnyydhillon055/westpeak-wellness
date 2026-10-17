import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* Item 559, 16 Oct 2026: scripts/season-capacity.mjs reads Cliniko and
   nothing else. It refuses every method but GET, prints counts and never a
   time of day, never prints the key, and its types come from the catalogue. */

const src = readFileSync('scripts/season-capacity.mjs', 'utf8');

test('the capacity script is read only and prints no times of day or key', () => {
  assert.match(src, /if \(method !== 'GET'\) throw new Error/);
  assert.doesNotMatch(src, /method:\s*'(POST|PUT|PATCH|DELETE)'/);
  assert.match(src, /\(body\.available_times \?\? \[\]\)\.length/, 'counts, not the start times');
  assert.doesNotMatch(src, /console\.log\([^)]*appointment_start/);
  assert.doesNotMatch(src, /console\.log\([^)]*\bkey\b(?!s)/, 'the key is never printed');
});

test('it reads the consultation and the paid types from the catalogue and OFFERINGS, and flags both windows', () => {
  for (const k of ['FALLBACK_CATALOG', 'CONSULT_TYPE', 'OFFERINGS', 'acceptingNewClients']) assert.ok(src.includes(k), k);
  assert.match(src, /-11-16`/);
  assert.match(src, /-12-23`/);
  assert.match(src, /-01-04`/);
  assert.match(src, /-01-15`/);
});

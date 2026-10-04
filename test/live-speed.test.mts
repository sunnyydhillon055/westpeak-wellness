import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { htmlBlocking, fromLighthouse, diffRuns, failuresOf, TEMPLATES, CLS_LIMIT } from '../scripts/live-speed.mjs';

/* Item 471, 3 Oct 2026: the weekly production speed check. */

test('blocking stylesheets are counted from the document; deferred ones are not', () => {
  const before = '<head><link rel="stylesheet" href="/_next/static/css/a.css" data-precedence="next"/><link rel="stylesheet" href="/_next/static/css/b.css"/></head>';
  assert.deepEqual({ ...htmlBlocking(before), bytes: 0 }, { blocking: 2, inlined: false, bytes: 0 });
  const after = `<head><style data-inlined>body{}</style><link rel="stylesheet" href="/_next/static/css/a.css" media="print" onload="this.media='all'"/></head>`;
  const h = htmlBlocking(after);
  assert.equal(h.blocking, 0);
  assert.equal(h.inlined, true);
  assert.ok(h.bytes > 0);
});

test('the Lighthouse numbers kept, RSC prefetch bytes included', () => {
  const lhr = {
    categories: { performance: { score: 0.873 } },
    audits: {
      'first-contentful-paint': { numericValue: 1234.4 },
      'largest-contentful-paint': { numericValue: 2400.6 },
      'total-blocking-time': { numericValue: 80 },
      'cumulative-layout-shift': { numericValue: 0.04567 },
      'render-blocking-resources': { details: { items: [{}, {}] } },
      'network-requests': { details: { items: [
        { url: 'https://x/guides?_rsc=abc', transferSize: 1000 },
        { url: 'https://x/_next/static/chunks/a.js', transferSize: 5000 },
        { url: 'https://x/?a=1&_rsc=z', transferSize: 500 },
      ] } },
    },
  };
  assert.deepEqual(fromLighthouse(lhr), { perf: 87, fcp: 1234, lcp: 2401, tbt: 80, cls: 0.046, renderBlocking: 2, prefetchBytes: 1500 });
  assert.deepEqual(fromLighthouse({}), { perf: null, fcp: null, lcp: null, tbt: null, cls: null, renderBlocking: null, prefetchBytes: 0 });
});

test('the change since the last run is per URL and only where both runs measured it', () => {
  const prev = { pages: [{ path: '/', perf: 70, renderBlocking: 4, cls: null }] };
  const cur = { pages: [{ path: '/', perf: 80, renderBlocking: 0, cls: 0.01 }, { path: '/x', perf: 50 }] };
  assert.deepEqual(diffRuns(prev, cur), [
    { path: '/', change: { perf: 10, renderBlocking: -4 } },
    { path: '/x', change: {} },
  ]);
});

test('it fails on blocking CSS on a static template or measured CLS over 0.1, and on nothing unmeasured', () => {
  assert.equal(CLS_LIMIT, 0.1);
  assert.equal(TEMPLATES.length, 8);
  assert.deepEqual(failuresOf([{ path: '/', renderBlocking: 0, cls: 0.1 }]), []);
  assert.deepEqual(failuresOf([{ path: '/', renderBlocking: null, cls: null }]), []);
  assert.equal(failuresOf([{ path: '/', renderBlocking: 3 }]).length, 1);
  assert.equal(failuresOf([{ path: '/', cls: 0.11 }]).length, 1);
  assert.equal(failuresOf([{ path: '/not-a-template', renderBlocking: 3 }]).length, 0);
  assert.equal(failuresOf([{ path: '/', error: 'HTTP 500' }]).length, 1);
});

test('verify:weekly runs it, and the smoke test asks the same eight templates', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(pkg.scripts['verify:weekly'], /node scripts\/live-speed\.mjs/);
  const smoke = readFileSync('scripts/smoke.mjs', 'utf8');
  for (const t of TEMPLATES) assert.ok(smoke.includes(`  '${t}',`), t);
});

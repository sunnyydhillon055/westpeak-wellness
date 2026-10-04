import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// @ts-ignore -- a plain .mjs script, typed by its tests
import { shaArg, payload, accepted, ENDPOINT, diffRecords, addedSources, deployUrls, MAX_URLS } from '../scripts/indexnow-deploy.mjs';
import { INDEXNOW_KEY } from '../lib/indexnow.ts';

/* wf/inbound-and-measurement, 2 Oct 2026: item 375. Only what the push
   changed, 4 Oct 2026. */

test('the deploy ping needs no secret, diffs the pushed range, and submits with the public key', () => {
  const wf = readFileSync('.github/workflows/indexnow.yml', 'utf8');
  assert.doesNotMatch(wf, /secrets\.CRON_SECRET/);
  assert.doesNotMatch(wf, /exit 0/);
  assert.match(wf, /fetch-depth: 0/);
  assert.match(wf, /github\.event\.before/);
  assert.ok(wf.includes('scripts/indexnow-deploy.mjs --from "$FROM" --to "$GITHUB_SHA"'));
  assert.doesNotMatch(wf, /--since/);
  assert.equal(ENDPOINT, 'https://api.indexnow.org/indexnow');
  assert.deepEqual(payload(['https://www.westpeakwellness.com/a']), {
    host: 'www.westpeakwellness.com',
    key: INDEXNOW_KEY,
    keyLocation: `https://www.westpeakwellness.com/${INDEXNOW_KEY}.txt`,
    urlList: ['https://www.westpeakwellness.com/a'],
  });
});

test('the script no longer reads the sitemap or sends every retired URL', () => {
  const s = readFileSync('scripts/indexnow-deploy.mjs', 'utf8');
  assert.doesNotMatch(s, /sitemap\.xml/);
  assert.doesNotMatch(s, /selectUrls\(/);
});

test('verify:ci fails a commit whose pages moved without the hash record', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts['hashes:check'], 'node scripts/page-hash-dates.mjs --check');
  assert.match(pkg.scripts['verify:ci'], /npm run fresh && npm run hashes:check/);
});

test('only pages whose content changed, appeared or left are sent', () => {
  const before = { '/': { hash: 'a' }, '/x': { hash: 'b' }, '/gone': { hash: 'c' }, '/same': { hash: 'd' } };
  const after = { '/': { hash: 'a' }, '/x': { hash: 'B' }, '/new': { hash: 'e' }, '/same': { hash: 'd' } };
  assert.deepEqual(diffRecords(before, after), { changed: ['/new', '/x'], removed: ['/gone'] });
  assert.deepEqual(diffRecords(after, after), { changed: [], removed: [] });
  assert.deepEqual(diffRecords({}, { '/a': { hash: '1' } }), { changed: ['/a'], removed: [] });
});

test('only redirects added in the range are sent', () => {
  assert.deepEqual(addedSources(['/old', '/older'], ['/old', '/older', '/newly-retired']), ['/newly-retired']);
  assert.deepEqual(addedSources(['/old'], ['/old']), []);
});

test('URLs are absolute, deduplicated and capped', () => {
  assert.deepEqual(
    deployUrls({ changed: ['/', '/x'], removed: ['/x'], retired: ['/careers'] }, 'https://h.example'),
    ['https://h.example/', 'https://h.example/x', 'https://h.example/careers'],
  );
  assert.deepEqual(deployUrls({ changed: [], removed: [], retired: [] }), []);
  const many = Array.from({ length: MAX_URLS + 5 }, (_, i) => `/p${i}`);
  assert.equal(deployUrls({ changed: many, removed: [], retired: [] }).length, MAX_URLS);
});

test('only 200 and 202 pass, and commit ids must be hex', () => {
  assert.ok(accepted(200) && accepted(202));
  for (const s of [204, 400, 403, 422, 429, 500]) assert.ok(!accepted(s), String(s));
  assert.equal(shaArg(['--from', 'eaa432e'], '--from'), 'eaa432e');
  assert.equal(shaArg(['--from', '0000000000000000000000000000000000000000'], '--from'), null);
  assert.equal(shaArg(['--from', 'HEAD; rm -rf /'], '--from'), null);
  assert.equal(shaArg([], '--from'), null);
});

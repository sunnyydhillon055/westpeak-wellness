import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// @ts-ignore -- a plain .mjs script, typed by its tests
import { dayArg, payload, accepted, ENDPOINT } from '../scripts/indexnow-deploy.mjs';
import { INDEXNOW_KEY } from '../lib/indexnow.ts';

/* wf/inbound-and-measurement, 2 Oct 2026: item 375. */

test('the deploy ping needs no secret and submits once with the public key', () => {
  const wf = readFileSync('.github/workflows/indexnow.yml', 'utf8');
  assert.doesNotMatch(wf, /secrets\.CRON_SECRET/);
  assert.doesNotMatch(wf, /exit 0/);
  assert.ok(wf.includes('scripts/indexnow-deploy.mjs --since "$(git log -1 --format=%cs)"'));
  assert.equal(ENDPOINT, 'https://api.indexnow.org/indexnow');
  assert.deepEqual(payload(['https://www.westpeakwellness.com/a']), {
    host: 'www.westpeakwellness.com',
    key: INDEXNOW_KEY,
    keyLocation: `https://www.westpeakwellness.com/${INDEXNOW_KEY}.txt`,
    urlList: ['https://www.westpeakwellness.com/a'],
  });
});

test('the script chooses URLs with the cron’s own functions', () => {
  const s = readFileSync('scripts/indexnow-deploy.mjs', 'utf8');
  assert.ok(s.includes("import { parseUrlset, selectUrls, INDEXNOW_KEY } from '../lib/indexnow.ts'"));
  assert.ok(s.includes('selectUrls(entries, since, permanentLiteralSources(), ORIGIN)'));
});

test('only 200 and 202 pass, and --since must be a day', () => {
  assert.ok(accepted(200) && accepted(202));
  for (const s of [204, 400, 403, 422, 429, 500]) assert.ok(!accepted(s), String(s));
  assert.equal(dayArg(['--since', '2026-10-02']), '2026-10-02');
  assert.equal(dayArg(['--since', '']), null);
  assert.equal(dayArg(['--since', '2026-10-02; rm -rf /']), null);
  assert.equal(dayArg([]), null);
});

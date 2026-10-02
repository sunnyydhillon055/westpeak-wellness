import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { arrivalClass, assistantFromUtm, channelOf, referrerClass } from '../lib/conversion-detail-client.ts';
import { allowedDetail } from '../lib/conversion-detail.ts';

/* wf/inbound-and-measurement, 2 Oct 2026: items 365 and 373. */

const OWN = 'www.westpeakwellness.com';

test('an empty referrer with ?utm_source=chatgpt.com is an AI arrival', () => {
  assert.equal(assistantFromUtm('chatgpt.com'), true);
  assert.equal(assistantFromUtm(' ChatGPT.com '), true);
  assert.equal(assistantFromUtm('chat.openai.com'), true);
  assert.equal(arrivalClass('', OWN, 'chatgpt.com'), 'ai');
  assert.equal(arrivalClass('', OWN, 'perplexity.ai'), 'ai');
});

test('an unknown utm value is still none, and is not a channel', () => {
  assert.equal(assistantFromUtm('newsletter'), false);
  assert.equal(assistantFromUtm(''), false);
  assert.equal(assistantFromUtm(null), false);
  assert.equal(assistantFromUtm('notchatgpt.com'), false);
  assert.equal(arrivalClass('', OWN, 'newsletter'), 'none');
  assert.equal(arrivalClass('', OWN, null), 'none');
  assert.equal(channelOf('chatgpt.com'), null, 'CHANNELS stays organisation kinds');
});

test('a referrer wins over the utm value, and an internal referrer is not an AI arrival', () => {
  assert.equal(arrivalClass('www.google.com', OWN, 'chatgpt.com'), 'google');
  assert.equal(arrivalClass(OWN, OWN, 'chatgpt.com'), 'none');
});

test('Copilot in Edge and copilot.com are assistants; bing.com is still search', () => {
  assert.equal(referrerClass('edgeservices.bing.com'), 'ai');
  assert.equal(referrerClass('copilot.com'), 'ai');
  assert.equal(referrerClass('www.bing.com'), 'bing');
  assert.equal(assistantFromUtm('copilot.com'), true);
});

test('Analytics counts the utm arrival once per session, as ai, against the landing', () => {
  const s = readFileSync('components/Analytics.tsx', 'utf8');
  assert.match(s, /const viaUtm = !ref && assistantFromUtm\(utm\)/);
  assert.match(s, /arrivalClass\(ref, window\.location\.hostname, utm\)/);
  assert.match(s, /track\('landing', \{ detail: arrivalClass\(ref, window\.location\.hostname, utm\) \}\)/);
  assert.ok(s.includes('`${window.location.pathname}|${linkChannel ?? cls}`'));
});

test('scheduler_stalled is counted, allow-listed and fired by the watchdog only', () => {
  assert.equal(allowedDetail('scheduler_stalled', 'camille-granda'), 'camille-granda');
  assert.equal(allowedDetail('scheduler_stalled', 'portal:camille-granda'), 'portal:camille-granda');
  assert.equal(allowedDetail('scheduler_stalled', 'nobody'), null);
  assert.match(readFileSync('lib/conversion-log.ts', 'utf8'), /'scheduler_stalled',/);
  assert.match(readFileSync('lib/analytics.ts', 'utf8'), /\| 'scheduler_stalled'/);
  const t = readFileSync('components/SchedulerTelemetry.tsx', 'utf8');
  assert.match(t, /export const STALL_MS = 10_000/);
  assert.equal(t.match(/track\('scheduler_stalled'/g)?.length, 1);
  assert.match(t, /drew = true;\s+window\.clearTimeout\(timer\)/);
  const e = readFileSync('components/SchedulerEmbed.tsx', 'utf8');
  assert.equal(e.match(/stalled=\{stalled\}/g)?.length, 2, 'gated and portal embeds both watched');
  assert.match(e, /The calendar has not appeared/);
  assert.match(readFileSync('app/admin/page.tsx', 'utf8'), /t\.event === 'scheduler_stalled'/);
});

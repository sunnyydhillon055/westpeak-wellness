import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { countSentences, hasEnoughDetail } from '../lib/sentences.ts';
import { returnUrl, FAILED_PAGE } from '../lib/inbound-return.ts';

/* THE FORMS THAT POST TO /api/enquiry, 1 Oct 2026.
 *
 * From 25 Sep the route refused any enquiry without looking/where/timing
 * (lib/inbound-submit.ts, choicesComplete). The /punjabi form never sent them,
 * so every message from it was refused, and the person was shown a Punjabi
 * page saying it had arrived. Nothing noticed for six days. This test is the
 * thing that would have: every form posting to /api/enquiry either carries
 * the three fields or is named here with the reason, and an exempt form must
 * at least land a refusal somewhere that says it was refused. */

const EXEMPT: Record<string, string> = {
  'app/punjabi/page.tsx':
    'Sends message and email only. Refused as "choices" until the owner decides whether /punjabi asks the three choices (item 205); refusals land on /punjabi/not-sent.',
};

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(e)) out.push(full.replace(/\\/g, '/'));
  }
  return out;
}

const posting = [...walk('app'), ...walk('components')].filter((f) => {
  const src = readFileSync(f, 'utf8');
  return /action=["']\/api\/enquiry["']|action:\s*['"]\/api\/enquiry['"]/.test(src);
});

test('at least the two known enquiry forms are found', () => {
  assert.ok(posting.includes('components/InboundForm.tsx'), posting.join(', '));
  assert.ok(posting.includes('app/punjabi/page.tsx'), posting.join(', '));
});

test('every form that posts to /api/enquiry sends looking, where and timing, or is exempt with a reason', () => {
  for (const f of posting) {
    if (EXEMPT[f]) continue;
    const src = readFileSync(f, 'utf8');
    for (const field of ['looking', 'where', 'timing']) {
      assert.match(src, new RegExp(`name="${field}"`), `${f} posts to /api/enquiry without "${field}"`);
    }
  }
});

test('an exemption is not left behind once the form is fixed or gone', () => {
  for (const f of Object.keys(EXEMPT)) {
    assert.ok(posting.includes(f), `${f} is exempt but no longer posts to /api/enquiry`);
    const src = readFileSync(f, 'utf8');
    assert.ok(!/name="looking"/.test(src), `${f} now sends the choices; drop its exemption`);
  }
});

test('an exempt form returns to a page that has a static failure page', () => {
  for (const f of Object.keys(EXEMPT)) {
    const src = readFileSync(f, 'utf8');
    const m = src.match(/name="returnTo" value="([^"]+)"/);
    assert.ok(m, `${f} names no returnTo`);
    const failed = FAILED_PAGE[m![1]];
    assert.ok(failed, `${m![1]} has no FAILED_PAGE entry`);
    assert.ok(existsSync(join('app', failed, 'page.tsx')), `${failed} has no page`);
  }
});

test('a refused /punjabi post never lands on the "arrived" page', () => {
  const opts = { bookingPath: '/book', accepting: ['savneet-singh'] };
  assert.equal(returnUrl('/punjabi/sent', 'sent', 'err', opts), '/punjabi/not-sent');
  assert.equal(returnUrl('/punjabi/sent', 'sent', 'ok', opts), '/punjabi/sent?sent=ok#form');
  assert.equal(returnUrl('/contact', 'sent', 'err', opts), '/contact?sent=err#form', 'other paths unchanged');
});

test('the failure page never claims the message arrived, and offers email and a booking', () => {
  const src = readFileSync('app/punjabi/not-sent/page.tsx', 'utf8');
  assert.ok(!src.includes('ਪਹੁੰਚ ਗਿਆ'), 'the "arrived" wording');
  assert.match(src, /did not go through/);
  assert.match(src, /mailto:/);
  assert.match(src, /bookingFor\(undefined, 'pa'\)/);
  assert.match(src, /index: false/);
});

test('/punjabi no longer tells people one line is enough', () => {
  /* The route asks for two sentences and about twenty words. */
  assert.ok(!readFileSync('app/punjabi/page.tsx', 'utf8').includes('ਇੱਕ ਲਾਈਨ ਕਾਫ਼ੀ ਹੈ'));
});

test('a danda ends a sentence', () => {
  const pa = 'ਮੈਨੂੰ ਕੁਝ ਮਹੀਨਿਆਂ ਤੋਂ ਬਹੁਤ ਚਿੰਤਾ ਹੋ ਰਹੀ ਹੈ। ਮੈਂ ਕਿਸੇ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਨੀ ਚਾਹੁੰਦਾ ਹਾਂ।';
  assert.equal(countSentences(pa), 2);
  assert.equal(countSentences('ਪਹਿਲੀ ਗੱਲ ਇਹ ਹੈ॥ ਦੂਜੀ ਗੱਲ ਇਹ ਹੈ॥'), 2, 'double danda');
  assert.equal(countSentences('ਇਹ ਇੱਕ ਲੰਮਾ ਵਾਕ ਹੈ ਜੋ ਖ਼ਤਮ ਨਹੀਂ ਹੁੰਦਾ'), 1, 'no danda, one sentence');
  const long = 'ਮੈਨੂੰ ਕੁਝ ਮਹੀਨਿਆਂ ਤੋਂ ਕੰਮ ਤੇ ਬਹੁਤ ਤਣਾਅ ਹੈ ਅਤੇ ਨੀਂਦ ਨਹੀਂ ਆਉਂਦੀ। ਮੈਂ ਕਿਸੇ ਕਾਊਂਸਲਰ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਨੀ ਚਾਹੁੰਦਾ ਹਾਂ ਜੋ ਸਮਝ ਸਕੇ।';
  assert.equal(hasEnoughDetail(long), true);
});

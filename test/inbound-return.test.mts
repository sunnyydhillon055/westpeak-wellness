import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { returnUrl, FAILED_PAGE, whyOf, whySentence, parseDraft, sendState, WHY } from '../lib/inbound-return.ts';

/* wf/inbound-and-measurement, 2 Oct 2026: items 357 and 374. */

const opts = { bookingPath: '/book', accepting: ['savneet-singh'] };
const src = (p: string) => readFileSync(p, 'utf8');

test('a city hub send lands on /message-sent, and a refusal on /message-not-sent with why and from', () => {
  assert.equal(FAILED_PAGE['/message-sent'], '/message-not-sent');
  assert.ok(existsSync('app/message-not-sent/page.tsx'));
  assert.equal(returnUrl('/message-sent', 'sent', 'ok', { ...opts, why: 'detail', source: '/online-counselling/abbotsford' }), '/message-sent?sent=ok#form');
  assert.equal(
    returnUrl('/message-sent', 'sent', 'err', { ...opts, why: 'detail', source: '/online-counselling/abbotsford' }),
    '/message-not-sent?why=detail&from=%2Fonline-counselling%2Fabbotsford',
  );
  assert.equal(returnUrl('/message-sent', 'sent', 'err', opts), '/message-not-sent', 'no reason, no source');
  assert.equal(returnUrl('/message-sent', 'sent', 'err', { ...opts, source: '//evil.example' }), '/message-not-sent', 'an unsafe source is dropped');
});

test('a static failure page that reads nothing gets the bare path, as before', () => {
  assert.equal(returnUrl('/punjabi/sent', 'sent', 'err', { ...opts, why: 'choices', source: '/punjabi' }), '/punjabi/not-sent');
});

test('why travels on a failure only, and only from the list', () => {
  assert.equal(returnUrl('/contact', 'sent', 'err', { ...opts, why: 'store' }), '/contact?sent=err&why=store#form');
  assert.equal(returnUrl('/contact', 'sent', 'ok', { ...opts, why: 'store' }), '/contact?sent=ok#form');
  assert.equal(
    returnUrl('/book', 'sent', 'err', { ...opts, practitioner: 'savneet-singh', why: 'email' }),
    '/book?with=savneet-singh&sent=err&why=email#form',
  );
  const forced = { ...opts, why: '<script>' as unknown as 'email' };
  assert.equal(returnUrl('/contact', 'sent', 'err', forced), '/contact?sent=err#form', 'a value off the list is dropped');
  assert.equal(whyOf('repeated'), 'repeated');
  assert.equal(whyOf('Store'), null);
  assert.equal(whyOf(undefined), null);
});

test('each reason has its own sentence, and only the store one says the fault is ours', () => {
  const lines = WHY.map((w) => whySentence(w, 20));
  assert.equal(new Set(lines).size, WHY.length);
  assert.match(whySentence('store', 20), /at our end/);
  for (const w of WHY.filter((x) => x !== 'store')) assert.doesNotMatch(whySentence(w, 20), /our end/);
  assert.match(whySentence('detail', 20), /about 20 words/);
  assert.match(whySentence(null, 20), /email address.*three questions.*two sentences/);
});

test('the route sends the reason, and the store failure as store', () => {
  const s = src('lib/inbound-submit.ts');
  assert.match(s, /return back\('err', reason\)/);
  assert.match(s, /if \(!item\) return back\('err', 'store'\)/);
});

test('a stored draft is read defensively', () => {
  assert.deepEqual(
    parseDraft(JSON.stringify({ name: 'Riya', message: 'Hello there.', evil: 'x', email: 5 })),
    { name: 'Riya', message: 'Hello there.' },
  );
  assert.equal(parseDraft('not json'), null);
  assert.equal(parseDraft(null), null);
  assert.equal(parseDraft('{}'), null);
  assert.equal(parseDraft(JSON.stringify({ message: 'a'.repeat(9000) }))?.message?.length, 5000);
});

test('the address bar is read for sent and why', () => {
  assert.deepEqual(sendState('?sent=err&why=choices'), { sent: 'err', why: 'choices' });
  assert.deepEqual(sendState('?sent=ok'), { sent: 'ok', why: null });
  assert.deepEqual(sendState('?sent=maybe&why=nope'), { sent: null, why: null });
});

test('the hub form posts returnTo=/message-sent, and the form keeps and restores the draft', () => {
  const hub = src('app/online-counselling/[city]/page.tsx');
  assert.match(hub, /<InboundForm\s+kind="enquiry"\s+returnTo="\/message-sent"/);
  assert.doesNotMatch(hub, /the reply lands on\s+\/contact/);
  const form = src('components/InboundForm.tsx');
  assert.match(form, /name="returnTo"/);
  assert.match(form, /sessionStorage\.setItem\(DRAFT_KEY/);
  assert.match(form, /sessionStorage\.removeItem\(DRAFT_KEY\)/);
  assert.match(form, /whySentence\(why, MIN_WORDS\)/);
});

test('/message-not-sent never says the message arrived, is noindex, and offers the address and ask-for-a-time', () => {
  const page = src('app/message-not-sent/page.tsx');
  assert.match(page, /did not go through/);
  assert.doesNotMatch(page, /has arrived/i);
  assert.match(page, /index: false/);
  assert.match(page, /\{site\.email\}/);
  assert.match(page, /askForTimeHref\(\)/);
  assert.match(page, /safePath\(/);
});

test('/pricing and /refer show an error state on ?lead=err', () => {
  assert.match(src('components/LeadCapture.tsx'), /failed\?: boolean/);
  /* Read in the browser since 3 Oct 2026, so /pricing can be static (item 429). */
  assert.match(src('app/pricing/page.tsx'), /<Suspense fallback=\{<LeadCapture \/>\}>\s*<LeadCaptureFromQuery \/>/);
  assert.match(src('components/LeadCaptureFromQuery.tsx'), /failed=\{lead === 'err'\}/);
  assert.match(src('app/refer/page.tsx'), /source="\/refer" done=\{sent === 'ok'\} failed=\{sent === 'err'\}/);
});

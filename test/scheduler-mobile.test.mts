import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseClinikoMessage, clampFrameHeight, withEmbedFlag, fromFrame, FRAME_MIN_PX, FRAME_MAX_PX,
} from '../lib/cliniko-frame.ts';
import { opensCalendar, CALENDAR_HASH } from '../lib/scheduler-open.ts';
import { detailProgress, hasEnoughDetail, MIN_WORDS } from '../lib/sentences.ts';
import { shortAvailabilityLine } from '../lib/book-card.ts';
import { BOOK_LOCATIONS, allowedDetail } from '../lib/conversion-detail.ts';
import { CLINIKO_EMBED_PARAM } from '../lib/site.ts';

const ROOT = process.cwd();

/* ---------- 117: the frame's own messages ---------- */

test('Cliniko resize and page messages parse; anything else is ignored', () => {
  assert.deepEqual(parseClinikoMessage('cliniko-bookings-resize:1342'), { kind: 'resize', height: 1342 });
  assert.deepEqual(parseClinikoMessage('cliniko-bookings-resize:812.5'), { kind: 'resize', height: 812 });
  assert.deepEqual(parseClinikoMessage('cliniko-bookings-page:confirmed'), { kind: 'page', page: 'confirmed' });
  assert.deepEqual(parseClinikoMessage('cliniko-bookings-page:patient_details'), { kind: 'page', page: 'patient_details' });
  for (const bad of [null, 42, { height: 10 }, '', 'cliniko-bookings-resize:', 'cliniko-bookings-resize:-5',
    'cliniko-bookings-resize:10px', 'x cliniko-bookings-resize:500', 'cliniko-bookings-page:<script>', 'a'.repeat(300)]) {
    assert.equal(parseClinikoMessage(bad), null, JSON.stringify(bad));
  }
});

test('the frame height is clamped to 480-2400px', () => {
  assert.equal(FRAME_MIN_PX, 480);
  assert.equal(FRAME_MAX_PX, 2400);
  assert.equal(clampFrameHeight(100), 480);
  assert.equal(clampFrameHeight(1200.4), 1200);
  assert.equal(clampFrameHeight(999999), 2400);
  assert.equal(clampFrameHeight(Number.NaN), 480);
});

test('the embed flag is appended once, before any hash', () => {
  assert.equal(CLINIKO_EMBED_PARAM, 'embedded=true');
  const u = 'https://x.ca1.cliniko.com/bookings?business_id=1&appointment_type_id=2';
  assert.equal(withEmbedFlag(u, CLINIKO_EMBED_PARAM), `${u}&embedded=true`);
  assert.equal(withEmbedFlag(withEmbedFlag(u, CLINIKO_EMBED_PARAM), CLINIKO_EMBED_PARAM), `${u}&embedded=true`);
  assert.equal(withEmbedFlag('https://x.cliniko.com/bookings', 'embedded=true'), 'https://x.cliniko.com/bookings?embedded=true');
  assert.equal(withEmbedFlag('https://x.cliniko.com/bookings?a=1#top', 'embedded=true'), 'https://x.cliniko.com/bookings?a=1&embedded=true#top');
});

test('a message is read only from the frame’s own window and origin', () => {
  const win = {};
  const src = 'https://westpeak-wellness.ca1.cliniko.com/bookings?embedded=true';
  assert.equal(fromFrame('https://westpeak-wellness.ca1.cliniko.com', win, src, win), true);
  assert.equal(fromFrame('https://evil.example', win, src, win), false, 'wrong origin');
  assert.equal(fromFrame('https://westpeak-wellness.ca1.cliniko.com', {}, src, win), false, 'another window');
  assert.equal(fromFrame('https://westpeak-wellness.ca1.cliniko.com', null, src, null), false, 'no frame window');
  assert.equal(fromFrame('null', win, 'not a url', win), false);
});

test('the embedded src is used for the frame only; the fallback link keeps the plain URL', () => {
  const src = readFileSync(join(ROOT, 'components/SchedulerEmbed.tsx'), 'utf8');
  assert.match(src, /src=\{frameUrl\}/);
  assert.match(src, /<SchedulerGate url=\{frameUrl\}/);
  assert.match(src, /<a href=\{url\} target="_blank"/);
  const tel = readFileSync(join(ROOT, 'components/SchedulerTelemetry.tsx'), 'utf8');
  assert.equal((tel.match(/addEventListener\('message'/g) ?? []).length, 1, 'one Cliniko listener');
  assert.match(tel, /function onClinikoBookingConfirmed\(/, 'the named hook point for batch 2 exists');
});

/* ---------- 135: #calendar opens the calendar ---------- */

test('only a link to this page’s #calendar opens the calendar', () => {
  assert.equal(CALENDAR_HASH, '#calendar');
  assert.equal(opensCalendar('#calendar', '/book'), true);
  assert.equal(opensCalendar('/book?with=camille-granda#calendar', '/book'), true);
  assert.equal(opensCalendar('?with=savneet-singh#calendar', '/book'), true);
  assert.equal(opensCalendar('/book', '/book'), false, 'bare /book keeps the gate');
  assert.equal(opensCalendar('/book#form', '/book'), false);
  assert.equal(opensCalendar('/client-portal#calendar', '/book'), false, 'another page decides for itself');
  assert.equal(opensCalendar('/book#calendar-x', '/book'), false);
  assert.equal(opensCalendar(null, '/book'), false);
});

test('scheduler_open is accepted with detail button or hash, and nothing else', () => {
  assert.equal(allowedDetail('scheduler_open', 'hash'), 'hash');
  assert.equal(allowedDetail('scheduler_open', 'button'), 'button');
  assert.equal(allowedDetail('scheduler_open', 'camille-granda'), null);
  const log = readFileSync(join(ROOT, 'lib/conversion-log.ts'), 'utf8');
  assert.match(log, /'scheduler_open',\s*\]\);/, 'counted');
});

/* ---------- 139: the next-consult line is a counted link ---------- */

test('sticky-next is a book_click location', () => {
  assert.ok(BOOK_LOCATIONS.includes('sticky-next'));
  assert.equal(allowedDetail('book_click', 'sticky-next/camille-granda'), 'sticky-next/camille-granda');
});

/* ---------- 196: the twenty-word rule, visible ---------- */

test('the word count moves through three stages and agrees with hasEnoughDetail', () => {
  assert.equal(detailProgress('').stage, 'short');
  assert.equal(detailProgress('').count, `0 of about ${MIN_WORDS} words`);
  assert.equal(detailProgress('I am anxious').count, `3 of about ${MIN_WORDS} words`);
  const run = 'I have been anxious for months and it is starting to affect my work and my sleep and my family too';
  assert.ok(run.split(' ').length >= MIN_WORDS);
  assert.equal(detailProgress(run).stage, 'one-sentence');
  assert.match(detailProgress(run).count, /Add a second sentence/);
  const ok = 'I have been anxious for months and it is starting to affect my work. I would like to talk to someone about it soon.';
  assert.equal(hasEnoughDetail(ok), true);
  assert.equal(detailProgress(ok).stage, 'enough');
  for (const t of ['', 'hi', run, ok, 'one two three. four five six.']) {
    assert.equal(detailProgress(t).stage === 'enough', hasEnoughDetail(t), t);
  }
});

test('the form shows its labels, hint and count, tied to the textarea', () => {
  const src = readFileSync(join(ROOT, 'components/InboundForm.tsx'), 'utf8');
  for (const q of ['What are you looking for?', 'Where will you be for sessions?', 'How soon are you hoping to start?']) {
    assert.ok(src.includes(`>${q}</label>`), q);
  }
  assert.match(src, /aria-describedby=\{`in-message-hint-\$\{kind\} in-message-count-\$\{kind\}`\}/);
  assert.match(src, /aria-live="polite"/);
});

/* ---------- 165: the short card line names no hours or days ---------- */

test('the phone card line is a count, with no hours and no days', () => {
  assert.equal(shortAvailabilityLine(null), null);
  assert.equal(shortAvailabilityLine({ count: 3, error: 'down' }), null);
  assert.equal(shortAvailabilityLine({ count: 1 }), '1 open time in the next two weeks.');
  assert.equal(shortAvailabilityLine({ count: 7 }), '7 open times in the next two weeks.');
  assert.equal(shortAvailabilityLine({ count: 0 }), 'No open times in the next two weeks.');
  for (const n of [0, 1, 9]) {
    assert.doesNotMatch(shortAvailabilityLine({ count: n })!, /\b(am|pm|evening|weekend|Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i);
  }
});

/* ---------- 136 / 189: the CSS hooks the components rely on ---------- */

test('the sticky bar stands down for the calendar and for typing; repeated figures hide on phones', () => {
  const css = readFileSync(join(ROOT, 'app/premium.css'), 'utf8');
  assert.match(css, /html\[data-scheduler-open\] \.sticky-book, html\[data-typing\] \.sticky-book\{ display:none \}/);
  assert.match(css, /\.figure--repeats\{ display:none; \}/);
  const contact = readFileSync(join(ROOT, 'app/contact/page.tsx'), 'utf8');
  assert.ok(contact.indexOf('<InboundForm') < contact.indexOf('<Figure name="bc-reach"'), 'the map comes after the form');
  const fig = readFileSync(join(ROOT, 'components/Figure.tsx'), 'utf8');
  assert.match(fig, /<a href=\{`\/img\/\$\{f\.file\}`\}/);
});

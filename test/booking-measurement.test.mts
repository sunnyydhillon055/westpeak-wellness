import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  allowedDetail, acceptedDetail, embedHostDetail, EMBED_HOSTS, BOOK_LOCATIONS, ENQUIRY_BLOCKS,
} from '../lib/conversion-detail.ts';
import { toolFunnel, refusalRows, parseConversions } from '../lib/conversion-log.ts';
import { safePath, EMAIL_PATTERN, EMAIL_TITLE } from '../lib/inbound-return.ts';
import { offersShort, lowestFee } from '../lib/practitioner-facts.ts';
import { recordedPractitioners } from '../lib/practitioners.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';

/* wf/r10-booking-measurement, 15 Oct 2026: items 505, 507, 528, 536, 537,
   541 and 546. */

const src = (f: string) => readFileSync(f, 'utf8');
const by = (slug: string) => recordedPractitioners.find((p) => p.slug === slug)!;

/* ---------- 505: the choosing cards ---------- */

test('the /book cards say what each counsellor offers and her lowest fee, from OFFERINGS and the catalogue', () => {
  assert.equal(offersShort(by('camille-granda')), 'Individual, couples, EMDR and family counselling');
  assert.equal(offersShort(by('savneet-singh')), 'Individual counselling');
  assert.match(lowestFee(by('savneet-singh'), FALLBACK_CATALOG) ?? '', /^\$\d/);
  /* /book is static and chosen in the browser since batch 1 (item 514):
     the server page computes the line, BookChoice renders it. */
  const page = src('app/book/page.tsx');
  assert.match(page, /offers: offersShort\(p\),/);
  assert.match(page, /cardFee: lowestFee\(p, catalog\),/);
  const choice = src('components/BookChoice.tsx');
  assert.match(choice, /\{p\.offers\}/);
  assert.match(choice, /sessions from \{p\.cardFee\}/);
  assert.match(choice, /href="\/practitioners#compare"/);
  assert.match(src('components/CounsellorCompare.tsx'), /id="compare"/);
});

/* ---------- 537: one button per counsellor ---------- */

test('bare /book offers one calendar button per counsellor, each opening her own calendar', () => {
  const page = src('components/BookChoice.tsx');
  assert.match(page, /choices=\{who \? undefined : calendarPeople\.map/);
  assert.match(page, /url: p\.bookingsUrl,/);
  assert.match(src('app/book/page.tsx'), /bookingsUrl: bookingsUrlFor\(p\.clinikoPractitionerId\)/);
  const gate = src('components/SchedulerGate.tsx');
  assert.match(gate, /who=\{chosen\?\.slug \?\? who\}/, 'telemetry carries her slug');
  assert.match(gate, /src=\{chosen\?\.url \?\? url\}/);
});

/* ---------- 536 and 546: next free days after a send and under a result ---------- */

test('the new next-day placements are booking locations, appended', () => {
  assert.deepEqual(BOOK_LOCATIONS.slice(-3), ['next-contact-sent', 'next-book-sent', 'next-tool-result']);
  assert.match(src('app/contact/page.tsx'), /doneExtra=\{\s*<ConsultDaysLine\s+location="next-contact-sent"/);
  assert.match(src('components/BookChoice.tsx'), /location="next-book-sent"/);
  assert.match(src('components/InboundForm.tsx'), /\{doneExtra\}/);
  const cta = src('components/tools/ResultCta.tsx');
  assert.doesNotMatch(cta, /<div className="tool-cta-ask">\s*<\/div>/, 'the empty box is gone');
  assert.match(cta, /<ResultDays href=\{href\}/);
  /* Days only: the line prints `day`, never `when` (which carries a time). */
  const slot = src('components/NextConsultSlot.tsx');
  const days = slot.slice(slot.indexOf('function DaysText'), slot.indexOf('export function ResultDays'));
  assert.match(days, /\{e\.day\} with \{e\.first\}/);
  assert.doesNotMatch(days, /e\.when/);
});

/* ---------- 507: blocked, stamped, and source paths ---------- */

test('browser blocks are counted by rule word only, and refusals carry a stamp', () => {
  for (const r of ENQUIRY_BLOCKS) assert.equal(allowedDetail('enquiry_blocked', r), r);
  assert.equal(allowedDetail('enquiry_blocked', 'someone@example.com'), null);
  assert.equal(allowedDetail('enquiry_refused', 'email:stamped'), 'email:stamped');
  assert.equal(allowedDetail('enquiry_refused', 'detail:unstamped'), 'detail:unstamped');
  assert.equal(allowedDetail('enquiry_refused', 'email'), 'email', 'older keys still read');
  assert.match(src('lib/conversion-log.ts'), /'enquiry_blocked',/);
  assert.match(src('lib/inbound-submit.ts'), /`\$\{reason\}:\$\{stamp\}`/);
  const rows = refusalRows(parseConversions({ events: {}, details: { enquiry_refused: { 'email:stamped': 3, 'email:unstamped': 2, email: 4, 'detail:stamped': 1 } } }));
  assert.deepEqual(rows[0], { reason: 'email', stamped: 3, unstamped: 2, before: 4 });
});

test('a source path with a quote or a parenthesis falls back to the form page', () => {
  assert.equal(safePath("/online-counselling/new-westminster')", '/contact'), '/contact');
  assert.equal(safePath('/online-counselling/new-westminster)', '/contact'), '/contact');
  assert.equal(safePath('/online-counselling/new-westminster', '/contact'), '/online-counselling/new-westminster');
});

/* ---------- 528: the email pattern ---------- */

test('the email pattern is the server rule, on both forms, with an English title', () => {
  const re = new RegExp(`^(?:${EMAIL_PATTERN})$`, 'v');
  assert.ok(re.test('name@gmail.com'));
  assert.ok(!re.test('name@gmail'));
  assert.ok(!re.test('name@shaw'));
  const server = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/;
  for (const v of ['a@b.c', 'a@b', 'a b@c.d', 'x@mail.example.co.uk', '@b.c']) assert.equal(re.test(v), server.test(v), v);
  assert.match(EMAIL_TITLE, /^[\x20-\x7e]+$/, 'plain English');
  assert.match(src('components/InboundForm.tsx'), /pattern=\{EMAIL_PATTERN\} title=\{EMAIL_TITLE\}/);
  assert.match(src('app/punjabi/page.tsx'), /pattern=\{EMAIL_PATTERN\} title=\{EMAIL_TITLE\} lang="en"/);
});

/* ---------- 546: tool starts ---------- */

test('tool starts are counted and the tools block reads started, finished and booked by page', () => {
  assert.match(src('lib/conversion-log.ts'), /'tool_start',/);
  assert.equal(allowedDetail('tool_start', 'therapy-cost-bc'), 'therapy-cost-bc');
  for (const f of ['components/tools/CoverageEstimator.tsx', 'components/tools/LeavePayCalculator.tsx']) {
    assert.match(src(f), /useToolStart\('/, f);
  }
  const rows = toolFunnel(parseConversions({
    events: {
      tool_start: { '/tools/therapy-cost-bc': 5, '/embed/stress-leave-pay-calculator': 2 },
      tool_complete: { '/tools/therapy-cost-bc': 3 },
      book_click: { '/tools/therapy-cost-bc': 1 },
    },
    details: {},
  }), ['therapy-cost-bc', 'stress-leave-pay-calculator']);
  assert.deepEqual(rows[0], { slug: 'therapy-cost-bc', started: 5, finished: 3, booked: 1, embedStarted: 0, embedFinished: 0 });
  assert.equal(rows[1]!.embedStarted, 2);
});

/* ---------- 541: embeds by host ---------- */

test('every organisation in OUTREACH section 14 is an embed host, and nothing else is kept', () => {
  const doc = src('docs/OUTREACH.md');
  const section = doc.slice(doc.indexOf('## 14.'), doc.indexOf('\n## 15.') > 0 ? doc.indexOf('\n## 15.') : undefined);
  const hosts = [...section.matchAll(/^\*\*14\.\d+[^\n]*?page: (https?:\/\/[^\s)]+)/gm)].map((m) => new URL(m[1]!).hostname.replace(/^www\./, ''));
  assert.equal(hosts.length, 25);
  for (const h of hosts) assert.notEqual(embedHostDetail(h), 'other', h);
  assert.equal(EMBED_HOSTS.length, 25);
  assert.equal(embedHostDetail('bc.cmha.ca'), 'cmha.ca');
  assert.equal(embedHostDetail('www.go2hr.ca'), 'go2hr.ca');
  assert.equal(embedHostDetail('evil-go2hr.ca'), 'other');
  assert.equal(embedHostDetail('example.com'), 'other');
  assert.equal(embedHostDetail(''), 'other');
  assert.equal(embedHostDetail(42), 'other');
  assert.equal(allowedDetail('embed_view', 'example.com'), null);
  assert.equal(acceptedDetail('tool_complete', 'stress-leave-pay-calculator:bc:embed'), 'stress-leave-pay-calculator:bc:embed');
  assert.match(src('app/api/track/route.ts'), /event === 'embed_view' \? embedHostDetail\(body\.detail\)/);
  assert.match(src('pages/embed/stress-leave-pay-calculator.tsx'), /new URL\(document\.referrer\)\.hostname/);
  assert.match(src('app/tools/stress-leave-pay-calculator/page.tsx'), /your site&rsquo;s domain \(never the page address\)/);
});

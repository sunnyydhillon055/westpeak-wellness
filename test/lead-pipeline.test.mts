import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checklistEmail, icbcEmail, startingEmail, enquiryAck, practiceAlert } from '../lib/inbound-mail.ts';
import { answeredToken, answeredValid, answeredLink } from '../lib/answered-link.ts';
import { isRealSubmission } from '../lib/inbound-quality.ts';
import { quarantined, type Inbound } from '../lib/inbound.ts';
import { triage, emailHashOf } from '../lib/triage.ts';
import { rosterLines, individualFeeLine } from '../lib/lead-roster.ts';
import { replyContextFor, feeLineFor } from '../lib/reply-context.ts';
import { getTemplate } from '../lib/reply-templates.ts';
import { measuredReply, measuredReplySentence, contactReplyLine } from '../lib/reply-line.ts';
import { FALLBACK_CATALOG } from '../lib/cliniko-catalog.ts';
import { practitioners } from '../lib/practitioners.ts';
import { tagged } from '../lib/booking-mail.ts';

/* The lead pipeline as rebuilt on 1 Oct 2026: what email 1 promises, who the
   acknowledgement names, the "mark answered" link, what counts as a real
   submission, what a tripped honeypot keeps, and the /admin reply drafts. */

const enquiry = (over: Partial<Inbound> = {}): Inbound => ({
  id: 'abc12345', kind: 'enquiry', name: 'Sam Lee', email: 'sam@gmail.com',
  message: 'I would like to talk to someone. Two sentences here.', source: '/contact',
  createdAt: '2026-10-01T17:00:00Z', handled: false, ...over,
});

/* ---- email 1 ------------------------------------------------------------- */

test('no email 1 says "one-off" any more; each promises two more then nothing', () => {
  for (const make of [checklistEmail, icbcEmail, startingEmail]) {
    const m = make('Sam', { unsub: 'https://example.org/api/unsubscribe?e=x&t=y' });
    assert.doesNotMatch(m.text, /one-off/i);
    assert.doesNotMatch(m.html, /one-off/i);
    assert.match(m.text.replace(/\s+/g, ' '), /two more short ones over the next fortnight, then nothing/);
    assert.match(m.text, /api\/unsubscribe/);
  }
});

test('the ICBC email now carries a booking link in plain text', () => {
  const m = icbcEmail('Sam');
  assert.match(m.text, /\/book/);
});

test('email 1 offers each accepting, bookable counsellor by her own calendar', () => {
  const lines = rosterLines();
  assert.ok(lines.length >= 1);
  for (const l of lines) {
    const p = practitioners.find((x) => x.slug === l.slug)!;
    assert.ok(p.acceptingNewClients && p.bookable, l.slug);
    assert.match(l.href, new RegExp(`\\?with=${l.slug}#calendar$`));
  }
  assert.ok(!lines.some((l) => l.slug === 'aman-bains-dhillon'));
  const m = checklistEmail('', { roster: lines });
  /* Each link carries the email source since 1 Oct 2026 (tagMail). */
  for (const l of lines) assert.ok(m.text.includes(tagged(l.href, 'magnet')) && m.html.includes(tagged(l.href, 'magnet')));
});

test('the HSA and direct-billing lines make no coverage promise', () => {
  const t = checklistEmail('').text.replace(/\s+/g, ' ');
  assert.doesNotMatch(t, /usually covers counselling/);
  assert.match(t, /does not direct-bill/);
});

test('the individual fee line comes from the catalogue, or is absent', () => {
  const line = individualFeeLine(FALLBACK_CATALOG)!;
  assert.match(line, /\$140 for 50 minutes/);
  assert.match(line, /depends on the plan/);
  assert.equal(individualFeeLine({ items: [], fetchedAt: '', live: false }), null);
});

/* ---- acknowledgement ------------------------------------------------------ */

test('routed to one counsellor, the acknowledgement names her and opens her calendar', () => {
  const m = enquiryAck('Sam', { who: 'Camille Granda, RCC, CCC', bookHref: 'https://example.org/book?with=camille-granda#calendar' });
  assert.match(m.text.replace(/\s+/g, ' '), /Camille Granda, RCC, CCC, will reply within one business day/);
  assert.match(m.html, /\?with=camille-granda#calendar/);
  const plain = enquiryAck('Sam');
  assert.match(plain.text.replace(/\s+/g, ' '), /you will have a reply within one business day/);
});

/* ---- practice alert -------------------------------------------------------- */

test('an enquiry alert carries a signed mark-answered link; a lead alert does not', () => {
  const before = process.env.PORTAL_SECRET;
  process.env.PORTAL_SECRET = 'test-secret';
  try {
    const a = practiceAlert(enquiry());
    assert.match(a.text, /\/admin\?answered=abc12345&t=[0-9a-f]{32}#answered/);
    const lead = practiceAlert(enquiry({ kind: 'lead', message: '', magnet: 'icbc-after-a-crash' }));
    assert.doesNotMatch(lead.text, /answered=/);
    /* Labelled by the one-pager in the body, never in the subject. */
    assert.match(lead.text, /ICBC one-pager requested/);
    assert.doesNotMatch(lead.subject, /ICBC/);
  } finally {
    if (before === undefined) delete process.env.PORTAL_SECRET; else process.env.PORTAL_SECRET = before;
  }
});

test('an answered token names one message and fails without a secret', () => {
  const before = process.env.PORTAL_SECRET;
  try {
    process.env.PORTAL_SECRET = 'test-secret';
    const t = answeredToken('abc12345');
    assert.ok(answeredValid('abc12345', t));
    assert.ok(!answeredValid('abc12346', t));
    assert.ok(!answeredValid('abc12345', t.slice(0, -1) + (t.endsWith('0') ? '1' : '0')));
    delete process.env.PORTAL_SECRET;
    assert.ok(!answeredValid('abc12345', answeredToken('abc12345')));
    assert.equal(answeredLink('abc12345'), null);
  } finally {
    if (before === undefined) delete process.env.PORTAL_SECRET; else process.env.PORTAL_SECRET = before;
  }
});

/* ---- what counts ---------------------------------------------------------- */

test('isRealSubmission: not a probe, not quarantined, not throwaway', () => {
  assert.ok(isRealSubmission(enquiry()));
  assert.ok(!isRealSubmission(enquiry({ email: 'probe@example.com' })));
  assert.ok(!isRealSubmission(enquiry({ email: 'x@mailinator.com' })));
  assert.ok(!isRealSubmission(enquiry({ triage: { band: 'quarantine', flags: ['honeypot'], why: '' } })));
  assert.ok(isRealSubmission(enquiry({ triage: { band: 'review', flags: ['fast'], why: '' } })));
});

/* ---- what a tripped honeypot keeps ---------------------------------------- */

test('a quarantined record keeps a count and a hash, no name, address, message or opt-in', () => {
  const r = quarantined({
    kind: 'lead', source: '/pricing', magnet: 'coverage-checklist', message: 'buy now',
    triage: { band: 'quarantine', flags: ['honeypot', 'fast'], why: '' },
  }, 'bot@gmail.com');
  assert.equal(r.name, '');
  assert.equal(r.email, '');
  assert.equal(r.message, '');
  assert.equal(r.monthlyOptIn, undefined);
  assert.equal(r.phone, undefined);
  assert.equal(r.emailHash, emailHashOf('bot@gmail.com'));
  assert.ok(r.messageHash);
  assert.equal(r.source, '/pricing');
  assert.ok(r.handled);
  assert.ok(!JSON.stringify(r).includes('bot@gmail.com'));
});

test('burst and duplicate still see a quarantined repeat through its hashes', () => {
  const v = { band: 'quarantine' as const, flags: ['honeypot' as const], why: '' };
  const stored = [0, 1, 2].map(() => quarantined({ kind: 'enquiry', source: '/contact', message: 'Same words here.', triage: v }, 'Bot@Gmail.com'));
  const verdict = triage({ kind: 'enquiry', email: 'bot@gmail.com', message: 'same   words here.', honeypot: '' }, stored);
  assert.ok(verdict.flags.includes('burst'));
  assert.ok(verdict.flags.includes('duplicate'));
});

/* ---- /admin reply drafts -------------------------------------------------- */

test("the 'book' draft links the routed counsellor's calendar, signs as her, states the fee", () => {
  const i = enquiry({ looking: 'couples', where: 'bc' });
  const c = replyContextFor(i, FALLBACK_CATALOG);
  assert.equal(c.slug, 'camille-granda');
  const body = getTemplate('book')!.body(i, c);
  assert.match(body, /\/book\?with=camille-granda#calendar/);
  assert.match(body, /Camille Granda/);
  assert.match(body.replace(/\s+/g, ' '), /couples session after the consultation is \$175/);
  assert.match(body, /depends on the plan/);
});

test("the 'full' draft offers the other counsellor first only when she fits", () => {
  const fits = enquiry({ looking: 'individual', where: 'bc', practitioner: 'camille-granda' });
  const c1 = replyContextFor(fits, FALLBACK_CATALOG);
  assert.equal(c1.other?.who.startsWith('Savneet Singh'), true);
  const body = getTemplate('full')!.body(fits, c1);
  assert.ok(body.indexOf('Savneet Singh') < body.indexOf('low-cost-counselling-bc'));
  /* Couples: the other counsellor does not offer it, so nothing is offered. */
  const couples = enquiry({ looking: 'couples', where: 'bc', practitioner: 'camille-granda' });
  assert.equal(replyContextFor(couples, FALLBACK_CATALOG).other, undefined);
});

test('drafts without context read as they always did', () => {
  const body = getTemplate('book')!.body(enquiry());
  assert.match(body, /\/book\n/);
  assert.equal(feeLineFor('individual', { items: [], fetchedAt: '', live: false }), null);
});

/* ---- the measured reply time --------------------------------------------- */

test('the measured line counts real, answered enquiries only, and waits for five', () => {
  const answered = (n: number, over: Partial<Inbound> = {}) => enquiry({
    id: `id${n}`, createdAt: '2026-10-01T10:00:00Z', handled: true, handledAt: '2026-10-01T16:00:00Z', ...over,
  });
  const four = [1, 2, 3, 4].map((n) => answered(n));
  const noise = [
    answered(5, { kind: 'lead' }),
    answered(6, { triage: { band: 'quarantine', flags: ['honeypot'], why: '' } }),
    answered(7, { email: 'probe@example.com' }),
  ];
  const s4 = measuredReply([...four, ...noise]);
  assert.equal(s4.sample, 4);
  assert.equal(measuredReplySentence(s4), null);
  assert.equal(contactReplyLine(s4), 'Replies within one business day');
  const s5 = measuredReply([...four, answered(8)]);
  assert.equal(s5.sample, 5);
  assert.match(measuredReplySentence(s5)!, /6 hours, across 5 answered messages/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  confirmationEmail, reminderEmail, followUpEmail, consultFollowUpEmail, feeFacts, links,
  type Booking, type BookingPractitioner,
} from '../lib/booking-mail.ts';
import { missedSessionEmail } from '../lib/lifecycle-mail.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { practitioners, withLetters } from '../lib/practitioners.ts';
import { site, CONSULT_TYPE } from '../lib/site.ts';
import { telehealthUrlOf, unconvertedConsults, consultReplyTo } from '../lib/booking-followups.ts';
import { cancellationDraft } from '../lib/booking-notify.ts';
import { mailtoBookingDraft } from '../lib/reply-templates.ts';
import { tallyEvents, applyEvents, vancouverMonth } from '../lib/booking-tally.ts';

/* The client-facing booking emails, rendered from the real templates with
   the real roster, 1 Oct 2026. Each test is one acceptance check from the
   change that introduced it. */

const SAVNEET_ID = '2033684891660454425';
const CAMILLE_ID = '2029879067058112997';

const asBooking = (slug: string): BookingPractitioner => {
  const pr = practitioners.find((x) => x.slug === slug)!;
  return {
    slug: pr.slug,
    nameWithLetters: withLetters(pr),
    firstName: pr.name.split(/\s+/)[0],
    languages: pr.languages.map(({ tag, name }) => ({ tag, name })),
    clinikoPractitionerId: pr.clinikoPractitionerId,
  };
};
const SAVNEET = asBooking('savneet-singh');
const CAMILLE = asBooking('camille-granda');

const booking = (over: Partial<Booking> = {}): Booking => ({
  firstName: 'Riya', email: 'r@example.com', whenText: 'Tuesday, October 6 at 6:00 p.m.',
  minutes: 30, isConsult: true, ...over,
});
const all = (m: { subject: string; text: string; html: string }) => `${m.subject}\n${m.text}\n${m.html}`;
const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);

/* ---- #6 the paid follow-up books the paid calendar ---------------------- */

test('the after-session note books that counsellor\'s paid calendar, never /book', () => {
  const m = followUpEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET }));
  const h = hrefs(m.html);
  assert.ok(h.some((x) => x.includes(`practitioner_id=${SAVNEET_ID}`)), 'paid calendar for her');
  assert.ok(h.some((x) => x.startsWith(site.bookingsPaidUrl)));
  assert.ok(!h.some((x) => x === `${site.domain}${site.bookingPath}` || x.startsWith(`${site.domain}${site.bookingPath}?`)), 'no /book href');
  assert.ok(m.text.includes(`practitioner_id=${SAVNEET_ID}`));
  assert.ok(!m.text.includes(`${site.domain}/book\n`));
});

test('with no roster match the after-session note falls back to the practice-wide paid calendar', () => {
  const m = followUpEmail(booking({ isConsult: false, minutes: 50 }));
  assert.ok(hrefs(m.html).includes(site.bookingsPaidUrl));
});

/* ---- #14 online, who, which languages, and the paid terms --------------- */

test('a Punjabi-speaking counsellor: named with letters and languages, online stated, Punjabi guide linked', () => {
  const m = confirmationEmail(booking({ practitioner: SAVNEET }));
  assert.equal(m.subject, 'Your free online consultation is booked | Westpeak Wellness');
  const s = all(m);
  assert.ok(s.includes('Savneet Singh, RCC · English or Punjabi, or both'));
  assert.ok(s.includes('There is no office to come to; join from somewhere private.'));
  assert.ok(s.includes(links.firstSessionPa));
  assert.ok(!s.includes(links.firstSessionTl));
  assert.ok(!s.includes('undefined'));
});

test('a Tagalog-speaking counsellor: the Tagalog guide, not the Punjabi one', () => {
  const s = all(reminderEmail(booking({ practitioner: CAMILLE })));
  assert.ok(s.includes(`${CAMILLE.nameWithLetters} · English or Tagalog, or both`));
  assert.ok(s.includes(links.firstSessionTl));
  assert.ok(!s.includes(links.firstSessionPa));
  assert.ok(s.includes('online appointment by secure video'));
});

test('no counsellor on the roster: no name, no "With", no "undefined", no language guide', () => {
  for (const m of [confirmationEmail(booking()), reminderEmail(booking())]) {
    const s = all(m);
    assert.ok(!/\bWith\b/.test(s.replace(/with Westpeak Wellness/g, '')), 'no With line');
    assert.ok(!s.includes('undefined') && !s.includes('null'));
    assert.ok(!s.includes(links.firstSessionPa) && !s.includes(links.firstSessionTl));
    assert.ok(s.includes('There is no office to come to'));
  }
});

test('a paid booking states the cancellation terms; the free consultation never mentions a fee', () => {
  const paid = all(confirmationEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET })));
  assert.equal(confirmationEmail(booking({ isConsult: false })).subject, 'Your online session is booked | Westpeak Wellness');
  assert.ok(paid.includes(`more than ${site.cancellationHours} hours ahead is refunded in full`));
  assert.ok(paid.includes('50% of the fee is kept'));
  assert.ok(all(reminderEmail(booking({ isConsult: false, minutes: 50 }))).includes('50% of the fee is kept'));
  for (const m of [confirmationEmail(booking()), reminderEmail(booking())]) {
    assert.ok(!all(m).includes('50%'));
    assert.ok(all(m).includes('Just reply') || all(m).includes('Reply to this email'));
  }
});

/* ---- #92 consult bookers get the consultation page ---------------------- */

test('the consult confirmation and reminder buttons open the consultation prep page; paid keeps the first-session guide', () => {
  for (const m of [confirmationEmail(booking()), reminderEmail(booking())]) {
    assert.ok(hrefs(m.html).some((h) => h.endsWith('/before-your-first-consultation')));
  }
  const paid = confirmationEmail(booking({ isConsult: false, minutes: 50 }));
  assert.ok(hrefs(paid.html).includes(links.firstSession));
  assert.ok(!hrefs(paid.html).includes(links.consultPrep));
});

/* ---- #43 the join link, when Cliniko gives one --------------------------- */

test('a reminder with a Telehealth link carries a Join button; without one, none', () => {
  const url = 'https://westpeak.cliniko.com/telehealth/abc123';
  const m = reminderEmail(booking({ telehealthUrl: url }));
  assert.ok(m.html.includes('Join the video call') && hrefs(m.html).includes(url));
  assert.ok(m.text.includes(url));
  assert.ok(confirmationEmail(booking({ telehealthUrl: url })).html.includes('Join the video call'));
  assert.ok(!reminderEmail(booking()).html.includes('Join the video call'));
});

test('only an https cliniko.com address is accepted as a join link', () => {
  assert.equal(telehealthUrlOf({ telehealth_url: 'https://westpeak.cliniko.com/t/1' }), 'https://westpeak.cliniko.com/t/1');
  assert.equal(telehealthUrlOf({ telehealth_url: 'http://westpeak.cliniko.com/t/1' }), null);
  assert.equal(telehealthUrlOf({ telehealth_url: 'https://evil.example/cliniko.com' }), null);
  assert.equal(telehealthUrlOf({ telehealth_url: 'https://notcliniko.com/x' }), null);
  assert.equal(telehealthUrlOf({ telehealth_url: null }), null);
  assert.equal(telehealthUrlOf({}), null);
});

/* ---- #15 and #28 the consultation follow-up ------------------------------ */

test('the consult follow-up books Savneet\'s own paid calendar, is signed by her, and replies to her', () => {
  const m = consultFollowUpEmail(booking({ practitioner: SAVNEET }));
  const btn = hrefs(m.html).find((h) => h.includes('practitioner_id='));
  assert.ok(btn && btn.includes(`practitioner_id=${SAVNEET_ID}`));
  assert.ok(m.html.includes('Booking with Savneet:'));
  assert.ok(/Savneet\nWestpeak Wellness/.test(m.text));
  const reply = consultReplyTo(practitioners.find((x) => x.clinikoPractitionerId === SAVNEET_ID));
  assert.ok(Array.isArray(reply) && reply.includes('savneet.westpeakwellness@gmail.com') && reply.includes(site.email));
  assert.equal(consultReplyTo(undefined), site.email);
});

test('the consult follow-up states the fees from the catalogue, and follows the catalogue when it changes', () => {
  const m = consultFollowUpEmail(booking({ practitioner: CAMILLE }));
  const ind = FALLBACK_CATALOG.items.find((i) => i.id === '1466854657459489533')!;
  const cou = FALLBACK_CATALOG.items.find((i) => i.id === '1909558292636502700')!;
  for (const s of [m.text.replace(/\n/g, ' '), m.html]) {
    assert.ok(s.includes(money(ind.cents)) && s.includes(money(cou.cents)));
    assert.ok(s.includes('Cliniko takes the card when you book'));
  }
  const changed = { ...FALLBACK_CATALOG, items: FALLBACK_CATALOG.items.map((i) => (i.id === ind.id ? { ...i, cents: 15500 } : i)) };
  assert.ok(feeFacts(changed)!.includes('$155'));
  assert.ok(!feeFacts(changed)!.includes(money(ind.cents)));
  assert.equal(feeFacts({ ...FALLBACK_CATALOG, items: [] }), null);
});

test('with no roster match the consult follow-up uses the practice-wide paid calendar and signs no name', () => {
  const m = consultFollowUpEmail(booking());
  assert.ok(hrefs(m.html).includes(site.bookingsPaidUrl));
  assert.ok(!m.html.includes('Booking with'));
});

/* ---- #27 a missed free consultation ------------------------------------- */

test('a missed consultation rebooks the free consultation with the same counsellor, and names no paid calendar', () => {
  const m = missedSessionEmail('Riya', { isConsult: true, practitionerSlug: 'savneet-singh' });
  const s = all(m);
  assert.ok(s.includes('free'));
  assert.ok(s.includes(`${site.domain}/book?with=savneet-singh#calendar`));
  assert.ok(!s.includes(site.bookingsPaidUrl));
  assert.ok(!s.includes('$'));
  /* A missed paid session keeps its own note. */
  assert.ok(all(missedSessionEmail('Riya')).includes(site.bookingsPaidUrl));
});

/* ---- #44 the rebook draft in a cancelled-consultation alert ------------- */

const appt = (o: Record<string, unknown>) => ({
  id: '1', starts_at: '2026-10-06T01:00:00Z', ends_at: '2026-10-06T01:30:00Z',
  appointment_type: { links: { self: `https://api.ca1.cliniko.com/v1/appointment_types/${CONSULT_TYPE}` } },
  practitioner: { links: { self: `https://api.ca1.cliniko.com/v1/practitioners/${SAVNEET_ID}` } },
  patient: { links: { self: 'https://api.ca1.cliniko.com/v1/patients/77' } },
  ...o,
});

test('a cancelled consultation alert carries a filled rebook draft; a paid cancellation does not', () => {
  const who = { firstName: 'Riya', email: 'r@example.com' };
  const draft = cancellationDraft(appt({ cancelled_at: '2026-10-01T10:00:00Z' }), who);
  assert.ok(draft && draft.startsWith('mailto:r@example.com?'));
  const body = decodeURIComponent(draft!.split('body=')[1]);
  assert.ok(body.includes('Hi Riya,'));
  assert.ok(body.includes(`${site.domain}/book?with=savneet-singh#calendar`));
  assert.ok(body.includes('Savneet Singh'));
  assert.ok(decodeURIComponent(draft!).includes('Whenever suits | Westpeak Wellness'));
  const paid = appt({ cancelled_at: '2026-10-01T10:00:00Z', appointment_type: { links: { self: 'x/appointment_types/1466854657459489533' } } });
  assert.equal(cancellationDraft(paid, who), null);
  assert.equal(cancellationDraft(appt({}), { firstName: 'Riya', email: '' }), null);
});

/* ---- #24 consultations that did not become sessions --------------------- */

const DAY = 864e5;
const NOW = Date.parse('2026-10-20T18:00:00Z');
const at = (daysAgo: number) => new Date(NOW - daysAgo * DAY).toISOString();
const isConsult = (ap: { appointment_type?: { links?: { self?: string } } }) =>
  (ap.appointment_type?.links?.self ?? '').endsWith(`/${CONSULT_TYPE}`);
const consult = (id: string, patient: string, daysAgo: number, o: Record<string, unknown> = {}) =>
  appt({ id, patient: { links: { self: `x/patients/${patient}` } }, starts_at: at(daysAgo), ends_at: at(daysAgo - 0.02), ...o });
const paid = (id: string, patient: string, daysAgo: number, o: Record<string, unknown> = {}) =>
  consult(id, patient, daysAgo, { appointment_type: { links: { self: 'x/appointment_types/1466854657459489533' } }, ...o });

test('a consultation 10-14 days past its follow-up with nothing booked since is a candidate', () => {
  const appts = [consult('c1', 'p1', 12)];
  const r = unconvertedConsults(appts, { now: NOW, isConsult, followedUp: new Set(['c1']), alreadyAlerted: new Set() });
  assert.deepEqual(r.map((a) => a.id), ['c1']);
});

test('a later paid session, even a future one, means no notice; a cancelled one does not count', () => {
  const opts = { now: NOW, isConsult, followedUp: new Set(['c1']), alreadyAlerted: new Set<string>() };
  assert.equal(unconvertedConsults([consult('c1', 'p1', 12), paid('s1', 'p1', -5)], opts).length, 0);
  assert.equal(unconvertedConsults([consult('c1', 'p1', 12), paid('s1', 'p1', -5, { cancelled_at: at(1) })], opts).length, 1);
});

test('nobody is the subject of the notice twice, and only inside the window', () => {
  const appts = [consult('c1', 'p1', 12), consult('c2', 'p1', 13), consult('c3', 'p2', 5), consult('c4', 'p3', 20), consult('c5', 'p4', 12)];
  const followedUp = new Set(['c1', 'c2', 'c3', 'c4', 'c5']);
  const r = unconvertedConsults(appts, { now: NOW, isConsult, followedUp, alreadyAlerted: new Set(['p4']) });
  assert.deepEqual(r.map((a) => a.id), ['c1'], 'one per patient, latest wins; p2 too recent; p3 too old; p4 already told');
});

test('no follow-up sent, cancelled, or did-not-arrive: not a candidate', () => {
  const opts = { now: NOW, isConsult, followedUp: new Set(['c2', 'c3']), alreadyAlerted: new Set<string>() };
  assert.equal(unconvertedConsults([consult('c1', 'p1', 12)], opts).length, 0);
  assert.equal(unconvertedConsults([consult('c2', 'p1', 12, { cancelled_at: at(13) })], opts).length, 0);
  assert.equal(unconvertedConsults([consult('c3', 'p1', 12, { did_not_arrive: true })], opts).length, 0);
});

test('the after-consult draft carries her paid calendar and her name', () => {
  const link = `${site.bookingsPaidUrl}&practitioner_id=${CAMILLE_ID}`;
  const d = decodeURIComponent(mailtoBookingDraft('r@example.com', 'after-consult', { firstName: 'Riya', day: 'Tuesday, October 6', link, signer: 'Camille Granda' }));
  assert.ok(d.includes(link) && d.includes('Camille Granda') && d.includes('October 6'));
});

/* ---- #23 the monthly tally ----------------------------------------------- */

test('each appointment counts once per kind, in its Vancouver month, under its counsellor', () => {
  const slugFor = (ap: { practitioner?: { links?: { self?: string } } }) =>
    (ap.practitioner?.links?.self ?? '').endsWith(SAVNEET_ID) ? 'savneet-singh' : undefined;
  const appts = [
    consult('a', 'p1', 3, { created_at: at(10) }),
    paid('b', 'p2', -2, { created_at: at(1) }),
    paid('c', 'p3', 1, { created_at: at(9), cancelled_at: at(4) }),
    consult('d', 'p4', 2, { created_at: at(8), did_not_arrive: true, practitioner: null }),
    consult('e', 'p5', 0.2, { created_at: at(8) }), // ended under a day ago: not yet held
    consult('f', 'p6', 3, { archived_at: at(1) }),
  ];
  const ev = tallyEvents(appts, { now: NOW, isConsult, slugFor });
  const keys = ev.map((e) => `${e.key}:${e.slug}:${e.field}`).sort();
  assert.deepEqual(keys, [
    'b:a:savneet-singh:consultBooked', 'b:b:savneet-singh:paidBooked', 'b:c:savneet-singh:paidBooked',
    'b:d:unknown:consultBooked', 'b:e:savneet-singh:consultBooked',
    'c:c:savneet-singh:paidCancelled', 'd:d:unknown:dna', 'h:a:savneet-singh:consultHeld',
  ]);
  const t = applyEvents({ months: {}, updatedAt: '' }, ev);
  assert.equal(t.months['2026-10']['savneet-singh'].consultBooked, 2);
  assert.equal(t.months['2026-10']['unknown'].dna, 1);
  const again = applyEvents(t, []);
  assert.deepEqual(again.months, t.months, 'nothing new, nothing added');
});

test('months are Vancouver months, not UTC ones', () => {
  assert.equal(vancouverMonth('2026-11-01T05:00:00Z'), '2026-10');
  assert.equal(vancouverMonth('2026-11-01T08:00:00Z'), '2026-11');
  assert.equal(vancouverMonth(null), null);
});

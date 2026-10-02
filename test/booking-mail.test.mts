import test from 'node:test';
import assert from 'node:assert/strict';
import {
  confirmationEmail, reminderEmail, followUpEmail, consultFollowUpEmail, feeFacts, links,
  sessionLink, tagged, tagMail, shortWhen, firstSessionTypes, EMAIL_TEMPLATES, SESSION_TEMPLATES,
  type Booking, type BookingPractitioner,
} from '../lib/booking-mail.ts';
import { missedSessionEmail, reactivationEmail } from '../lib/lifecycle-mail.ts';
import { FALLBACK_CATALOG, money } from '../lib/cliniko-catalog.ts';
import { practitioners, withLetters } from '../lib/practitioners.ts';
import { site, CONSULT_TYPE, bookingsPaidUrlFor } from '../lib/site.ts';
import {
  telehealthUrlOf, unconvertedConsults, consultReplyTo,
  lapsedPaidClients, lapsedKey, paidFollowUpPlan, notSeenLately,
} from '../lib/booking-followups.ts';
import { portalSummary, paidTypesFor } from '../lib/portal-appointments.ts';
import { cancellationDraft } from '../lib/booking-notify.ts';
import { resolveBookSession } from '../lib/book-session.ts';
import { BOOK_LOCATIONS, allowedDetail } from '../lib/conversion-detail.ts';
import { CHANNELS, channelOf } from '../lib/conversion-detail-client.ts';
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
/* Where each link in the HTML actually lands, since 1 Oct 2026: the email
   source tag is removed (tagMail) and a /book/session hop is followed to
   the calendar it redirects to (resolveBookSession), so the assertions below
   still say which calendar a person reaches. */
const untag = (h: string) => h.replace(/&amp;/g, '&').replace(/[?&]utm_source=email&utm_campaign=[a-z0-9]+/, (m) => (m.startsWith('?') ? '?' : '')).replace(/\?(#|$)/, '$1').replace('?&', '?');
const land = (h: string) => {
  const u = untag(h);
  return u.startsWith(`${site.domain}/book/session?`) ? resolveBookSession(new URL(u).searchParams).location : u;
};
const rawHrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((x) => x[1]);
const hrefs = (html: string) => rawHrefs(html).map(land);

/* ---- #6 the paid follow-up books the paid calendar ---------------------- */

test('the after-session note books that counsellor\'s paid calendar, never /book', () => {
  const m = followUpEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET }));
  const h = hrefs(m.html);
  assert.ok(h.some((x) => x.includes(`practitioner_id=${SAVNEET_ID}`)), 'paid calendar for her');
  assert.ok(h.some((x) => x.startsWith(site.bookingsPaidUrl)));
  assert.ok(!h.some((x) => x === `${site.domain}${site.bookingPath}` || x.startsWith(`${site.domain}${site.bookingPath}?`)), 'no /book href');
  /* The plain-text link is the first-party hop, which lands on her calendar. */
  assert.ok(m.text.includes(sessionLink(SAVNEET, undefined, 'after')));
  assert.ok(land(sessionLink(SAVNEET, undefined, 'after')).includes(`practitioner_id=${SAVNEET_ID}`));
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
  assert.ok(hrefs(m.html).includes(`${site.domain}/book?with=savneet-singh#calendar`));
  assert.ok(!s.includes(site.bookingsPaidUrl));
  assert.ok(!s.includes('$'));
  /* A missed paid session keeps its own note; with no counsellor known, the
     practice-wide paid calendar, signed by the practice. */
  assert.ok(hrefs(missedSessionEmail('Riya').html).includes(site.bookingsPaidUrl));
});

/* ---- #173 paid mail uses her calendar, her type and her name ------------- */

const IND_TYPE = '1466854657459489533';
const SAV_MAIL = { firstName: 'Savneet', clinikoPractitionerId: SAVNEET_ID, bookable: true, alertEmail: 'savneet.westpeakwellness@gmail.com' };

test('a missed paid session books her paid calendar for the same type and is signed by her', () => {
  const m = missedSessionEmail('Riya', { isConsult: false, counsellor: SAV_MAIL, typeId: IND_TYPE });
  const btnHref = hrefs(m.html).find((h) => h.includes('practitioner_id='))!;
  const u = new URL(btnHref.replace(/&amp;/g, '&'));
  assert.equal(u.searchParams.get('practitioner_id'), SAVNEET_ID);
  assert.equal(u.searchParams.get('appointment_type_id'), IND_TYPE);
  assert.ok(/Savneet\nWestpeak Wellness/.test(m.text));
  assert.ok(!all(m).includes('$') && !all(m).includes('50%'), 'nothing about the fee');
  /* Not on the online calendar: no calendar of hers is linked, and no name. */
  const off = missedSessionEmail('Riya', { isConsult: false, counsellor: { ...SAV_MAIL, bookable: false }, typeId: IND_TYPE });
  assert.ok(hrefs(off.html).includes(site.bookingsPaidUrl));
  assert.ok(!off.text.includes('Savneet'));
});

test('a paid calendar narrows to one type only when that type is a paid one', () => {
  const one = new URL(bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE));
  assert.equal(one.searchParams.get('appointment_type_id'), IND_TYPE);
  assert.equal(one.searchParams.get('practitioner_id'), SAVNEET_ID);
  assert.equal(bookingsPaidUrlFor(SAVNEET_ID, CONSULT_TYPE), `${site.bookingsPaidUrl}&practitioner_id=${SAVNEET_ID}`, 'the consult id is ignored');
  assert.equal(bookingsPaidUrlFor(undefined, '999'), site.bookingsPaidUrl, 'an unknown id is ignored');
  assert.equal(bookingsPaidUrlFor(), site.bookingsPaidUrl);
});

test('the paid follow-up is signed by her and opens her calendar for the same type', () => {
  const m = followUpEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET, typeId: IND_TYPE }));
  assert.ok(/Savneet\nWestpeak Wellness/.test(m.text));
  assert.ok(m.text.includes(sessionLink(SAVNEET, IND_TYPE, 'after')));
  assert.equal(land(sessionLink(SAVNEET, IND_TYPE, 'after')), bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE));
});

/* ---- #172 the follow-up states the next session ------------------------- */

test('the paid follow-up names the next session when one is booked, and offers no booking button', () => {
  const m = followUpEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET, next: { whenText: 'Tuesday, October 13 at 6:00 p.m.', withName: 'Savneet Singh, RCC' } }));
  assert.ok(m.text.replace(/\s+/g, ' ').includes('Your next session: Tuesday, October 13 at 6:00 p.m. with Savneet Singh, RCC'));
  assert.ok(m.html.includes('Your next session: Tuesday, October 13'));
  assert.ok(!m.html.includes('Book your next session'));
  const none = followUpEmail(booking({ isConsult: false, minutes: 50, practitioner: SAVNEET, next: null }));
  assert.ok(none.html.includes('Book your next session') && !none.text.includes('Your next session:'));
});

/* ---- #44 the rebook draft in a cancelled-consultation alert ------------- */

const appt = (o: Record<string, unknown>) => ({
  id: '1', starts_at: '2026-10-06T01:00:00Z', ends_at: '2026-10-06T01:30:00Z',
  appointment_type: { links: { self: `https://api.ca1.cliniko.com/v1/appointment_types/${CONSULT_TYPE}` } },
  practitioner: { links: { self: `https://api.ca1.cliniko.com/v1/practitioners/${SAVNEET_ID}` } },
  patient: { links: { self: 'https://api.ca1.cliniko.com/v1/patients/77' } },
  ...o,
});

test('a cancelled consultation alert carries a filled rebook draft', () => {
  const who = { firstName: 'Riya', email: 'r@example.com' };
  const draft = cancellationDraft(appt({ cancelled_at: '2026-10-01T10:00:00Z' }), who);
  assert.ok(draft && draft.startsWith('mailto:r@example.com?'));
  const body = decodeURIComponent(draft!.split('body=')[1]);
  assert.ok(body.includes('Hi Riya,'));
  assert.ok(body.includes(`${site.domain}/book?with=savneet-singh#calendar`));
  assert.ok(body.includes('Savneet Singh'));
  assert.ok(decodeURIComponent(draft!).includes('Whenever suits | Westpeak Wellness'));
  assert.equal(cancellationDraft(appt({}), { firstName: 'Riya', email: '' }), null);
});

/* ---- #119 the reschedule draft in a cancelled paid-session alert --------- */

test('a cancelled paid session carries a reschedule draft when nothing is rebooked, and none once it is', () => {
  const who = { firstName: 'Riya', email: 'r@example.com' };
  const paidType = { links: { self: `x/appointment_types/${IND_TYPE}` } };
  const cancelled = appt({ id: 'p1', cancelled_at: '2026-10-01T10:00:00Z', appointment_type: paidType });
  const draft = cancellationDraft(cancelled, who, [cancelled]);
  assert.ok(draft && draft.startsWith('mailto:r@example.com?'));
  const d = decodeURIComponent(draft!);
  assert.ok(d.includes('Hi Riya,'));
  assert.ok(d.includes('Savneet Singh'), 'signed by her');
  assert.ok(d.includes(bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE)), 'her paid calendar, same type');
  assert.ok(!d.includes('$') && !d.includes('50%'), 'nothing about the fee or the retention');
  /* Rebooked since the cancellation, even for an earlier day than the slot cancelled. */
  const rebooked = appt({ id: 'p2', starts_at: '2026-10-03T01:00:00Z', ends_at: '2026-10-03T01:50:00Z', appointment_type: paidType });
  assert.equal(cancellationDraft(cancelled, who, [cancelled, rebooked]), null);
  /* A rebooking that was itself cancelled does not count. */
  assert.ok(cancellationDraft(cancelled, who, [cancelled, { ...rebooked, cancelled_at: '2026-10-02T00:00:00Z' }]));
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

/* ---- #107 paid clients with nothing booked ------------------------------- */

const lapsedOpts = (alerted: string[] = []) => ({ now: NOW, isConsult, alreadyAlerted: new Set(alerted) });

test('a paid client 14-18 days past their last session with nothing booked is noticed', () => {
  const appts = [paid('s1', 'p1', 30), paid('s2', 'p1', 16)];
  assert.deepEqual(lapsedPaidClients(appts, lapsedOpts()).map((a) => a.id), ['s2'], 'the latest session, once');
});

test('a paid client who has rebooked, even a consultation or a future date, is not', () => {
  assert.equal(lapsedPaidClients([paid('s1', 'p1', 16), paid('s2', 'p1', -3)], lapsedOpts()).length, 0);
  assert.equal(lapsedPaidClients([paid('s1', 'p1', 16), consult('c1', 'p1', -3)], lapsedOpts()).length, 0);
  /* A later session already held moves the window: the 16-day one is not the latest. */
  assert.equal(lapsedPaidClients([paid('s1', 'p1', 16), paid('s2', 'p1', 9)], lapsedOpts()).length, 0);
  /* A cancelled rebooking does not count. */
  assert.equal(lapsedPaidClients([paid('s1', 'p1', 16), paid('s2', 'p1', -3, { cancelled_at: at(1) })], lapsedOpts()).length, 1);
});

test('a consultation-only patient is not a paid client, and a did-not-arrive is not a held session', () => {
  assert.equal(lapsedPaidClients([consult('c1', 'p1', 16)], lapsedOpts()).length, 0);
  assert.equal(lapsedPaidClients([paid('s1', 'p1', 16, { did_not_arrive: true })], lapsedOpts()).length, 0);
});

test('the same gap is never noticed twice; outside 14-18 days it is not noticed at all', () => {
  const s = paid('s1', 'p1', 16);
  assert.equal(lapsedKey(s), 'p1:s1');
  assert.equal(lapsedPaidClients([s], lapsedOpts(['p1:s1'])).length, 0);
  assert.equal(lapsedPaidClients([paid('s2', 'p2', 12)], lapsedOpts()).length, 0);
  assert.equal(lapsedPaidClients([paid('s3', 'p3', 19)], lapsedOpts()).length, 0);
});

test('the after-session draft is short, links her paid calendar, and claims nothing', () => {
  const link = bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE);
  const d = decodeURIComponent(mailtoBookingDraft('r@example.com', 'after-session', { firstName: 'Riya', day: 'Tuesday, October 6', link, signer: 'Savneet Singh' }));
  assert.ok(d.includes(link) && d.includes('Savneet Singh') && d.includes('October 6'));
  assert.ok(d.includes('the real open times'));
  assert.ok(!/\$|50%|evening|weekend|better|progress|review/i.test(d), 'no fee, no availability claim, no outcome claim');
});

/* ---- #172 when the after-session note goes out --------------------------- */

const withCamille = { practitioner: { links: { self: `x/practitioners/${CAMILLE_ID}` } } };

test('the follow-up goes after the first paid session with her, and states the next one', () => {
  const s1 = paid('s1', 'p1', 1);
  const s2 = paid('s2', 'p1', -6);
  const plan = paidFollowUpPlan(s1, [s1, s2], { isConsult });
  assert.equal(plan.first, true);
  assert.equal(plan.send, true);
  assert.equal(plan.next?.id, 's2');
});

test('a later session with her and the next one booked: skipped', () => {
  const s0 = paid('s0', 'p1', 8);
  const s1 = paid('s1', 'p1', 1);
  const s2 = paid('s2', 'p1', -6);
  const plan = paidFollowUpPlan(s1, [s0, s1, s2], { isConsult });
  assert.equal(plan.first, false);
  assert.equal(plan.send, false);
  /* A first session with a DIFFERENT counsellor is a first. */
  const other = paidFollowUpPlan(s1, [paid('s0', 'p1', 8, withCamille), s1, s2], { isConsult });
  assert.equal(other.send, true);
});

test('a later session with nothing booked after it: sent, with the booking button', () => {
  const s0 = paid('s0', 'p1', 8);
  const s1 = paid('s1', 'p1', 1);
  const plan = paidFollowUpPlan(s1, [s0, s1, paid('s2', 'p1', -6, { cancelled_at: at(0.5) })], { isConsult });
  assert.equal(plan.first, false);
  assert.equal(plan.next, null);
  assert.equal(plan.send, true);
});

/* ---- #126 not seen lately ------------------------------------------------ */

test('not seen lately: 60 days and nothing booked is listed; 20 days, or 50 days with a future booking, are not', () => {
  const appts = [
    paid('a1', 'p60', 90), paid('a2', 'p60', 60),
    paid('b1', 'p20', 20),
    paid('c1', 'p50', 50), paid('c2', 'p50', -10),
    consult('d1', 'pc', 80),
    paid('e1', 'pdna', 70, { did_not_arrive: true }),
  ];
  const rows = notSeenLately(appts, { now: NOW, isConsult });
  assert.deepEqual(rows.map((r) => r.patientId), ['p60']);
  assert.equal(rows[0].held, 2);
  assert.equal(rows[0].last.id, 'a2');
  assert.equal(rows[0].daysSince, 59, 'whole days since it ENDED');
});

test('the reactivation note books her own calendar and replies to her when she is on it; otherwise as before', () => {
  const m = reactivationEmail('Riya', SAV_MAIL);
  assert.ok(hrefs(m.html).some((h) => h.includes(`practitioner_id=${SAVNEET_ID}`)));
  assert.ok(m.html.includes('Book a session with Savneet'));
  assert.ok(Array.isArray(m.replyTo) && m.replyTo.includes(SAV_MAIL.alertEmail) && m.replyTo.includes(site.email));
  const plain = reactivationEmail('Riya');
  assert.ok(hrefs(plain.html).includes(site.bookingsPaidUrl));
  assert.equal(plain.replyTo, site.email);
  const off = reactivationEmail('Riya', { ...SAV_MAIL, bookable: false });
  assert.equal(off.replyTo, site.email);
  assert.ok(!off.html.includes('practitioner_id='));
});

/* ---- #125 the client portal --------------------------------------------- */

test('the portal summary lists upcoming sessions soonest first and names the counsellor last seen', () => {
  const s = portalSummary([
    paid('a', 'p1', 20),
    paid('b', 'p1', 6, withCamille),
    paid('c', 'p1', 3, { did_not_arrive: true }),
    paid('d', 'p1', -14),
    paid('e', 'p1', -7),
    paid('f', 'p1', -2, { cancelled_at: at(1) }),
  ], NOW);
  assert.deepEqual(s.upcoming.map((u) => u.id), ['e', 'd']);
  assert.equal(s.upcoming[0].typeId, IND_TYPE);
  assert.equal(s.lastPractitionerId, CAMILLE_ID, 'the latest HELD one, not the missed one');
  assert.deepEqual(portalSummary([], NOW), { upcoming: [], lastPractitionerId: null });
});

test('the portal lists only the paid types she offers, priced from the catalogue', () => {
  const sav = practitioners.find((x) => x.slug === 'savneet-singh')!;
  const types = paidTypesFor(sav.services, FALLBACK_CATALOG);
  assert.ok(types.length > 0);
  for (const t of types) {
    const item = FALLBACK_CATALOG.items.find((i) => i.id === t.id)!;
    assert.equal(t.fee, money(item.cents));
    assert.ok(item.cents > 0);
  }
  if (!sav.services.includes('couples-therapy')) assert.ok(!types.some((t) => /couples/i.test(t.name)));
  const cam = practitioners.find((x) => x.slug === 'camille-granda')!;
  assert.ok(paidTypesFor(cam.services, FALLBACK_CATALOG).length >= types.length);
  assert.deepEqual(paidTypesFor(sav.services, { ...FALLBACK_CATALOG, items: [] }), []);
});

/* ---- #222 the calendar-year plan note in the drafts ----------------------- */

test('the after-consult and after-session drafts carry the plan-year note only 15 Oct to 20 Dec', () => {
  const link = bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE);
  const base = { firstName: 'Riya', day: 'Tuesday, October 6', link, signer: 'Savneet Singh' };
  for (const key of ['after-consult', 'after-session'] as const) {
    const on = (iso: string) => decodeURIComponent(mailtoBookingDraft('r@example.com', key, { ...base, now: new Date(iso) })).replace(/\s+/g, ' ');
    assert.match(on('2026-11-02T19:00:00Z'), /sessions held by 31 December count against this year’s maximum/, key);
    assert.match(on('2026-12-20T19:00:00Z'), /31 December/, `${key} on 20 Dec`);
    assert.doesNotMatch(on('2026-12-21T19:00:00Z'), /31 December/, `${key} on 21 Dec`);
    assert.doesNotMatch(on('2027-01-01T19:00:00Z'), /31 December/, `${key} on 1 Jan`);
    assert.doesNotMatch(on('2026-10-14T19:00:00Z'), /31 December/, `${key} on 14 Oct`);
  }
  /* Out of season the after-session draft is byte-for-byte what it was. */
  const sess = decodeURIComponent(mailtoBookingDraft('r@example.com', 'after-session', { ...base, now: new Date('2027-01-05T19:00:00Z') }));
  assert.ok(!/\$|evening|weekend|better|progress|review/i.test(sess));
  const inSeasonSess = decodeURIComponent(mailtoBookingDraft('r@example.com', 'after-session', { ...base, now: new Date('2026-11-02T19:00:00Z') }));
  assert.ok(!/\$|evening|weekend|better|progress|review/i.test(inSeasonSess), 'the note adds no fee, time or outcome');
  /* Never on the cancellation drafts. */
  for (const key of ['rebook-consult', 'reschedule-session'] as const) {
    const d = decodeURIComponent(mailtoBookingDraft('r@example.com', key, { ...base, now: new Date('2026-11-02T19:00:00Z') }));
    assert.doesNotMatch(d, /31 December/, key);
  }
});

/* ---- #254 the consult follow-up: confirm a booked first session, or offer hers */

const WITH_SERVICES = (slug: string): BookingPractitioner => ({
  ...asBooking(slug),
  services: practitioners.find((x) => x.slug === slug)!.services,
});

test('a booked first session is confirmed, with no calendar link, no fee pitch and the paid terms', () => {
  const m = consultFollowUpEmail(booking({
    practitioner: WITH_SERVICES('savneet-singh'),
    next: { whenText: 'Tuesday, October 13 at 6:00 p.m.', withName: 'Savneet Singh, RCC', startsAt: '2026-10-14T01:00:00Z' },
  }));
  assert.equal(m.subject, 'Your first session is booked | Westpeak Wellness');
  const s = all(m);
  assert.ok(s.includes('Tuesday, October 13 at 6:00 p.m.') && s.includes('Savneet Singh, RCC'));
  assert.ok(hrefs(m.html).includes(links.firstSession), 'what happens in a first full session');
  assert.ok(m.text.replace(/\s+/g, ' ').includes('50% of the fee is kept'), 'the paid cancellation terms');
  /* Acceptance: no paid-calendar URL in the 'next' branch, direct or by hop. */
  assert.ok(!s.includes('cliniko.com/bookings') && !s.includes('/book/session'), 'no calendar link');
  assert.ok(!/go ahead|\$\d/.test(s), 'no "go ahead" and no fee');
  assert.ok(!m.html.includes('Book a first session'));
  assert.ok(/Savneet\nWestpeak Wellness/.test(m.text));
});

test('nothing booked: a Savneet consult names only the individual fee and opens her individual calendar', () => {
  const m = consultFollowUpEmail(booking({ practitioner: WITH_SERVICES('savneet-singh') }));
  const ind = FALLBACK_CATALOG.items.find((i) => i.id === IND_TYPE)!;
  const cou = FALLBACK_CATALOG.items.find((i) => i.id === '1909558292636502700')!;
  const flat = m.text.replace(/\s+/g, ' ');
  assert.ok(flat.includes(money(ind.cents)) && m.html.includes(money(ind.cents)));
  assert.ok(!flat.includes(money(cou.cents)) && !/couples/i.test(flat), 'no fee for a type she does not offer');
  assert.ok(m.html.includes('Book a first session with Savneet'));
  const target = new URL(hrefs(m.html).find((h) => h.includes('practitioner_id='))!);
  assert.equal(target.searchParams.get('practitioner_id'), SAVNEET_ID);
  assert.equal(target.searchParams.get('appointment_type_id'), IND_TYPE);
  assert.ok(m.text.includes(sessionLink(WITH_SERVICES('savneet-singh'), IND_TYPE, 'consult')));
});

test('nothing booked: Camille offers both of her first-session fees and her calendar, not narrowed to one type', () => {
  const m = consultFollowUpEmail(booking({ practitioner: WITH_SERVICES('camille-granda') }));
  assert.equal(firstSessionTypes(FALLBACK_CATALOG, WITH_SERVICES('camille-granda').services).length, 2);
  const target = new URL(hrefs(m.html).find((h) => h.includes('practitioner_id='))!);
  assert.equal(target.searchParams.get('practitioner_id'), CAMILLE_ID);
  assert.ok((target.searchParams.get('appointment_type_id') ?? '').includes(','), 'all her paid types');
  assert.ok(m.html.includes('Book a first session with Camille'));
});

test('the consult follow-up reads the catalogue it is given, not the fallback', () => {
  const live = { ...FALLBACK_CATALOG, live: true, items: FALLBACK_CATALOG.items.map((i) => (i.id === IND_TYPE ? { ...i, cents: 15500 } : i)) };
  const m = consultFollowUpEmail(booking({ practitioner: WITH_SERVICES('savneet-singh') }), live);
  assert.ok(m.text.includes('$155') && !m.text.includes('$140'));
  /* A catalogue with no price for her type: no fee sentence, and the button
     opens her calendar on all paid types rather than a type it cannot price. */
  const empty = consultFollowUpEmail(booking({ practitioner: WITH_SERVICES('savneet-singh') }), { ...FALLBACK_CATALOG, items: [] });
  assert.ok(!empty.text.includes('$'));
  assert.equal(new URL(hrefs(empty.html).find((h) => h.includes('practitioner_id='))!).searchParams.get('appointment_type_id')!.split(',').length, 4);
});

/* ---- #272 the email source, and the first-party hop to the paid calendar -- */

test('tagged() adds the email source to site links only, before the fragment', () => {
  assert.equal(tagged(`${site.domain}/pricing`, 'consult'), `${site.domain}/pricing?utm_source=email&utm_campaign=consult`);
  assert.equal(tagged(`${site.domain}/book?with=camille-granda#calendar`, 'magnet'), `${site.domain}/book?with=camille-granda&utm_source=email&utm_campaign=magnet#calendar`);
  assert.equal(tagged(site.domain, 'ack'), `${site.domain}?utm_source=email&utm_campaign=ack`);
  for (const same of [
    site.bookingsPaidUrl,
    `${site.domain}/api/unsubscribe?e=a%40b.c&t=x`,
    `${site.domain}/book/session?from=after`,
    `${site.domain}.evil.example/x`,
    'mailto:info@westpeakwellness.com',
  ]) assert.equal(tagged(same, 'after'), same);
  const m = tagMail({ text: `See ${site.domain}/faq. Or ${site.domain}/pricing, then`, html: `<a href="${site.domain}/faq">x</a>` }, 'remind');
  assert.ok(m.text.includes(`${site.domain}/faq?utm_source=email&utm_campaign=remind. Or`), 'the full stop stays outside the link');
  assert.ok(m.text.includes(`${site.domain}/pricing?utm_source=email&utm_campaign=remind, then`));
  assert.ok(m.html.includes(`href="${site.domain}/faq?utm_source=email&utm_campaign=remind"`));
});

test('every site link in every booking and lifecycle email carries its template', () => {
  const built: [string, { text: string; html: string }][] = [
    ['confirm', confirmationEmail(booking({ practitioner: SAVNEET }))],
    ['remind', reminderEmail(booking({ practitioner: SAVNEET }))],
    ['consult', consultFollowUpEmail(booking({ practitioner: WITH_SERVICES('savneet-singh') }))],
    ['after', followUpEmail(booking({ isConsult: false, practitioner: SAVNEET }))],
    ['missed', missedSessionEmail('Riya', { isConsult: true, practitionerSlug: 'savneet-singh' })],
    ['missed', missedSessionEmail('Riya', { isConsult: false, counsellor: { ...SAV_MAIL, slug: 'savneet-singh' }, typeId: IND_TYPE })],
    ['reactivation', reactivationEmail('Riya', { ...SAV_MAIL, slug: 'savneet-singh' })],
  ];
  for (const [tpl, m] of built) {
    assert.ok((EMAIL_TEMPLATES as readonly string[]).includes(tpl));
    const site_ = rawHrefs(m.html).filter((h) => h.startsWith(site.domain));
    assert.ok(site_.length > 0, tpl);
    for (const h of site_) {
      if (h.startsWith(`${site.domain}/book/session?`)) {
        assert.ok(h.endsWith(`from=${tpl}`), `${tpl}: ${h}`);
        assert.ok(SESSION_TEMPLATES.includes(tpl as never), `${tpl} is a session template`);
      } else assert.ok(h.includes(`utm_source=email&utm_campaign=${tpl}`), `${tpl}: ${h}`);
    }
    assert.ok(!rawHrefs(m.html).some((h) => h.includes('cliniko.com/bookings')), `${tpl}: no raw Cliniko link`);
  }
});

test('/book/session redirects only to a paid calendar this site builds, and counts only a listed template', () => {
  const at = (q: string) => resolveBookSession(new URLSearchParams(q));
  assert.deepEqual(at(`with=savneet-singh&type=${IND_TYPE}&from=consult`), {
    location: bookingsPaidUrlFor(SAVNEET_ID, IND_TYPE), detail: 'email:consult/savneet-singh',
  });
  assert.deepEqual(at('from=reactivation'), { location: site.bookingsPaidUrl, detail: 'email:reactivation' });
  /* A slug off the roster, or someone not on the online calendar: practice-wide. */
  assert.deepEqual(at('with=nobody&from=after'), { location: site.bookingsPaidUrl, detail: 'email:after' });
  assert.equal(at('with=aman-bains-dhillon&from=after').location, site.bookingsPaidUrl);
  assert.equal(at('with=aman-bains-dhillon&from=after').detail, 'email:after');
  /* The free consultation, a list, or junk is never passed through as a type. */
  for (const t of [CONSULT_TYPE, `${IND_TYPE},999`, '999', 'https://evil.example', '']) {
    assert.equal(at(`with=camille-granda&type=${encodeURIComponent(t)}&from=after`).location, bookingsPaidUrlFor(CAMILLE_ID), t);
  }
  /* A template off the list, or a template that does not link here: nothing counted. */
  for (const f of ['', 'ack', 'magnet', 'email:consult', 'x'.repeat(90)]) assert.equal(at(`from=${encodeURIComponent(f)}`).detail, null, f);
  for (const t of SESSION_TEMPLATES) {
    assert.ok(BOOK_LOCATIONS.includes(`email:${t}`), `email:${t} is a known book_click location`);
    assert.equal(allowedDetail('book_click', `email:${t}/savneet-singh`), `email:${t}/savneet-singh`);
  }
  assert.ok((CHANNELS as readonly string[]).includes('email'));
  assert.equal(channelOf('email'), 'email');
});

test('the email links are built from sessionLink and carry nothing about the person', () => {
  const href = sessionLink(SAVNEET, IND_TYPE, 'after');
  const u = new URL(href);
  assert.equal(u.pathname, '/book/session');
  assert.deepEqual([...u.searchParams.keys()].sort(), ['from', 'type', 'with']);
  /* No Cliniko id on the roster entry: not named, exactly as before. */
  assert.ok(!sessionLink({ slug: 'aman-bains-dhillon' }, undefined, 'after').includes('with='));
  assert.ok(!sessionLink(null, 'not-a-number', 'after').includes('type='));
});

/* ---- #287 the inbox preview line and the day in the subject -------------- */

const preheaderOf = (html: string) => (/<div style="display:none;[^"]*">\s*([\s\S]*?)(?:&#8203;|<\/div>)/.exec(html)?.[1] ?? '').trim();
const h1Of = (html: string) => (/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? '').trim();

test('confirmation and reminder put the day and time in the subject and the preview, never the service', () => {
  const b = booking({ practitioner: CAMILLE, startsAt: '2026-10-09T21:00:00Z' });
  assert.equal(shortWhen('2026-10-09T21:00:00Z'), 'Fri, Oct 9, 2:00 p.m.');
  assert.equal(shortWhen(undefined), null);
  assert.equal(shortWhen('not a date'), null);
  const c = confirmationEmail(b);
  assert.equal(c.subject, 'Free consultation booked: Fri, Oct 9, 2:00 p.m. | Westpeak Wellness');
  assert.equal(preheaderOf(c.html), 'Fri, Oct 9, 2:00 p.m. Pacific · with Camille Granda · secure video, no office');
  const r = reminderEmail({ ...b, isConsult: false, minutes: 50 });
  assert.equal(r.subject, 'Tomorrow, Fri, Oct 9, 2:00 p.m.: your session | Westpeak Wellness');
  for (const m of [c, r]) assert.ok(!/individual|couples|emdr|punjabi|tagalog/i.test(m.subject));
  /* Without a start time, the subjects are what they were. */
  assert.equal(reminderEmail(booking()).subject, 'Tomorrow: your free online consultation | Westpeak Wellness');
});

test('no client booking or lifecycle email has a preview line equal to its heading', () => {
  const b = booking({ practitioner: SAVNEET, startsAt: '2026-10-09T21:00:00Z' });
  const all_ = [
    confirmationEmail(b), confirmationEmail({ ...b, isConsult: false }), confirmationEmail(booking()),
    reminderEmail(b), reminderEmail(booking({ isConsult: false })),
    consultFollowUpEmail(b), consultFollowUpEmail(booking()),
    consultFollowUpEmail({ ...b, next: { whenText: 'Tuesday, October 13 at 6:00 p.m.', withName: 'Savneet Singh, RCC' } }),
    followUpEmail({ ...b, isConsult: false }), followUpEmail(booking({ isConsult: false, next: { whenText: 'Tuesday' } })),
    missedSessionEmail('Riya', { isConsult: true }), missedSessionEmail('Riya'), reactivationEmail('Riya'),
  ];
  for (const m of all_) {
    const pre = preheaderOf(m.html);
    assert.ok(pre.length > 10, m.subject);
    assert.notEqual(pre, h1Of(m.html), m.subject);
    assert.ok(!pre.includes('undefined') && !pre.includes('null'), pre);
  }
});

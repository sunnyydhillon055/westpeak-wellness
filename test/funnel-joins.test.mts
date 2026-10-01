import test from 'node:test';
import assert from 'node:assert/strict';
import { listAll } from '@/lib/cliniko';
import {
  consultToPaid, classifyConsults, sourceAndCity, sourceBucket, citySlug, enquiryOutcomes, totalOf,
  OTHER_PLACE, NO_PLACE, type Appt,
  retention, retentionPatients, foldSmall, mergeRebook, median, OTHER_GROUP,
} from '@/lib/funnel-joins';
import { retentionLines } from '@/lib/funnel-report';
import { practitionerSlugFor, idFromLink } from '@/lib/practitioner-for';
import { parseBookingTally, tallyRows } from '@/lib/booking-tally-read';
import { allowedDetail, acceptedDetail } from '@/lib/conversion-detail';
import { funnelCuts, type ConversionLog } from '@/lib/conversion-log';
import { practitioners } from '@/lib/practitioners';
import { CONSULT_TYPE } from '@/lib/site';

/* THE FUNNEL REPORT'S JOINS — 1 Oct 2026.
 *
 * Consultations followed to a paid booking, messages followed to a
 * consultation, and every Cliniko list read to its last page. Fixtures shaped
 * the way Cliniko sends them: links, not ids, and no duration field. */

delete process.env.BLOB_READ_WRITE_TOKEN;

const BASE = 'https://api.ca1.cliniko.com/v1';
const camille = practitioners.find((p) => p.slug === 'camille-granda')!;
const savneet = practitioners.find((p) => p.slug === 'savneet-singh')!;
const PAID_TYPE = '999';

const ap = (o: { patient: string; who?: string; at: string; type?: string; cancelled?: boolean; dna?: boolean }): Appt => ({
  starts_at: o.at,
  cancelled_at: o.cancelled ? '2026-09-01T00:00:00Z' : null,
  archived_at: null,
  did_not_arrive: o.dna ?? false,
  appointment_type: { links: { self: `${BASE}/appointment_types/${o.type ?? CONSULT_TYPE}` } },
  practitioner: o.who ? { links: { self: `${BASE}/practitioners/${o.who}` } } : undefined,
  patient: { links: { self: `${BASE}/patients/${o.patient}` } },
});

const SEPT = { from: new Date('2026-09-01T00:00:00Z'), to: new Date('2026-10-01T00:00:00Z') };
const opts = { ...SEPT, consultTypeId: CONSULT_TYPE, slugFor: practitionerSlugFor, withinDays: 60 };

const fixture = (): Appt[] => [
  /* p1: consult with Camille, then a paid session a week later — converts. */
  ap({ patient: 'p1', who: camille.clinikoPractitionerId, at: '2026-09-05T02:00:00Z' }),
  ap({ patient: 'p1', who: camille.clinikoPractitionerId, at: '2026-09-12T02:00:00Z', type: PAID_TYPE }),
  /* p2: consult with Savneet, nothing after — not yet. A cancelled paid
     booking does not count as a conversion. */
  ap({ patient: 'p2', who: savneet.clinikoPractitionerId, at: '2026-09-10T02:00:00Z' }),
  ap({ patient: 'p2', who: savneet.clinikoPractitionerId, at: '2026-09-17T02:00:00Z', type: PAID_TYPE, cancelled: true }),
  /* p3: cancelled consult; p4: missed consult. */
  ap({ patient: 'p3', who: camille.clinikoPractitionerId, at: '2026-09-11T02:00:00Z', cancelled: true }),
  ap({ patient: 'p4', who: camille.clinikoPractitionerId, at: '2026-09-12T02:00:00Z', dna: true }),
  /* p5: a consult outside the window is not counted. */
  ap({ patient: 'p5', who: camille.clinikoPractitionerId, at: '2026-08-20T02:00:00Z' }),
  /* p6: off the roster. */
  ap({ patient: 'p6', who: '123', at: '2026-09-20T02:00:00Z' }),
];

test('practitionerSlugFor maps the roster id on the link, and nothing else', () => {
  assert.equal(practitionerSlugFor({ practitioner: { links: { self: `${BASE}/practitioners/${camille.clinikoPractitionerId}` } } }), 'camille-granda');
  assert.equal(practitionerSlugFor({ practitioner: { links: { self: `${BASE}/practitioners/1` } } }), 'unknown');
  assert.equal(practitionerSlugFor({}), 'unknown');
  assert.equal(idFromLink(`${BASE}/patients/42?x=1`), '42');
});

test('consult to paid: one converting and one non-converting patient, by slug', () => {
  const by = consultToPaid(fixture(), opts);
  assert.deepEqual(by['camille-granda'], { consultsHeld: 1, convertedToPaid: 1, notYet: 0, cancelled: 1, dna: 1 });
  assert.deepEqual(by['savneet-singh'], { consultsHeld: 1, convertedToPaid: 0, notYet: 1, cancelled: 0, dna: 0 });
  assert.deepEqual(by.unknown, { consultsHeld: 1, convertedToPaid: 0, notYet: 1, cancelled: 0, dna: 0 });
  const t = totalOf(by);
  assert.equal(t.consultsHeld, t.convertedToPaid + t.notYet, 'held splits exactly into converted and not yet');
  assert.ok(!JSON.stringify(by).includes('p1'), 'no patient key in the counts');
});

test('a paid booking beyond the window of days does not count', () => {
  const late = [
    ap({ patient: 'p1', who: camille.clinikoPractitionerId, at: '2026-09-05T02:00:00Z' }),
    ap({ patient: 'p1', who: camille.clinikoPractitionerId, at: '2026-12-20T02:00:00Z', type: PAID_TYPE }),
  ];
  assert.equal(consultToPaid(late, opts)['camille-granda'].convertedToPaid, 0);
});

test('source and city cuts each sum to the consultations held', () => {
  const { held } = classifyConsults(fixture(), opts);
  const facts = new Map<string, { referral?: unknown; city?: unknown } | null>([
    ['p1', { referral: 'Google search', city: 'Surrey' }],
    ['p2', { referral: 'my family doctor', city: 'Tiny Town' }],
    /* p6's record could not be read: counted as not recorded, not dropped. */
    ['p6', null],
  ]);
  const places = [{ slug: 'surrey', city: 'Surrey' }];
  const { bySource, byCity } = sourceAndCity(held, facts, places);
  const sum = (m: Record<string, { consultsHeld: number }>) => Object.values(m).reduce((a, b) => a + b.consultsHeld, 0);
  assert.equal(sum(bySource), held.length);
  assert.equal(sum(byCity), held.length);
  assert.equal(bySource['Google search'].convertedToPaid, 1);
  assert.equal(bySource['family doctor'].consultsHeld, 1);
  assert.equal(bySource['not recorded'].consultsHeld, 1);
  /* One consult from Surrey is fewer than three: folded so nobody is
     identifiable by their town. */
  assert.equal(byCity.surrey, undefined);
  assert.equal(byCity[OTHER_PLACE].consultsHeld, 2);
  assert.equal(byCity[NO_PLACE].consultsHeld, 1);
});

test('three or more consultations from one city keep its slug', () => {
  const appts = ['a', 'b', 'c'].map((p, i) => ap({ patient: p, who: camille.clinikoPractitionerId, at: `2026-09-0${i + 2}T02:00:00Z` }));
  const { held } = classifyConsults(appts, opts);
  const facts = new Map(['a', 'b', 'c'].map((p) => [p, { city: 'surrey ' }] as const));
  const { byCity } = sourceAndCity(held, facts, [{ slug: 'surrey', city: 'Surrey' }]);
  assert.equal(byCity.surrey.consultsHeld, 3);
});

test('referral sources fall into the fixed list', () => {
  assert.equal(sourceBucket(''), 'not recorded');
  assert.equal(sourceBucket(null), 'not recorded');
  assert.equal(sourceBucket('Google Maps / Business Profile'), 'Google Maps / Business Profile');
  assert.equal(sourceBucket('found you on google maps'), 'Google Maps / Business Profile');
  assert.equal(sourceBucket('ChatGPT'), 'AI assistant');
  assert.equal(sourceBucket('BCACC'), 'BCACC directory');
  assert.equal(sourceBucket('Family doctor'), 'family doctor');
  assert.equal(sourceBucket('a friend'), 'friend or family');
  assert.equal(sourceBucket('EAP through work'), 'employer or EAP');
  assert.equal(sourceBucket('Psychology Today'), 'other free listing');
  assert.equal(sourceBucket('saw a poster'), 'other');
  assert.equal(sourceBucket({ name: 'Google search' }), 'Google search');
  assert.equal(citySlug('North Delta', [{ slug: 'delta', city: 'Delta', communities: ['North Delta'] }]), 'delta');
});

test('messages followed to a consultation and a paid session sum to the messages', () => {
  const appts = [
    /* new1 wrote on 1 Sep, had a consult then a paid session. */
    ap({ patient: 'new1', who: camille.clinikoPractitionerId, at: '2026-09-05T02:00:00Z' }),
    ap({ patient: 'new1', who: camille.clinikoPractitionerId, at: '2026-09-12T02:00:00Z', type: PAID_TYPE }),
    /* old1 was already in care before writing. */
    ap({ patient: 'old1', who: savneet.clinikoPractitionerId, at: '2026-08-01T02:00:00Z', type: PAID_TYPE }),
    ap({ patient: 'old1', who: savneet.clinikoPractitionerId, at: '2026-09-20T02:00:00Z', type: PAID_TYPE }),
  ];
  const out = enquiryOutcomes([
    { createdAt: '2026-09-01T00:00:00Z', source: '/contact', practitioner: 'camille-granda', patient: 'new1' },
    { createdAt: '2026-09-02T00:00:00Z', source: '/contact', patient: null },
    { createdAt: '2026-09-03T00:00:00Z', source: '/', patient: 'old1' },
    { createdAt: '2026-09-04T00:00:00Z', source: '/', patient: 'error' },
  ], appts, CONSULT_TYPE);
  assert.equal(out.total, 4);
  const sum = (m: Record<string, { enquiries: number }>) => Object.values(m).reduce((a, b) => a + b.enquiries, 0);
  assert.equal(sum(out.bySource), 4);
  assert.equal(sum(out.byPractitioner), 4);
  assert.deepEqual(out.bySource['/contact'], { enquiries: 2, consult: 1, paid: 1, existing: 0 });
  assert.deepEqual(out.bySource['/'], { enquiries: 2, consult: 0, paid: 0, existing: 1 });
  assert.equal(out.byPractitioner['camille-granda'].paid, 1);
  assert.equal(out.lookupFailed, 1);
});

test('listAll follows links.next and counts every row; the bound is reported', async () => {
  const pages: Record<string, unknown> = {
    'https://x/a?page=1': { appointments: [{ id: 1 }, { id: 2 }], links: { next: 'https://x/a?page=2' } },
    'https://x/a?page=2': { appointments: [{ id: 3 }], links: {} },
  };
  const real = globalThis.fetch;
  globalThis.fetch = (async (u: string) => new Response(JSON.stringify(pages[u]), { status: 200 })) as typeof fetch;
  try {
    const all = await listAll('https://x/a?page=1', 'k-ca1', 'appointments');
    assert.equal(all.rows.length, 3);
    assert.equal(all.truncated, false);
    assert.equal(all.pages, 2);
    const one = await listAll('https://x/a?page=1', 'k-ca1', 'appointments', 1);
    assert.equal(one.rows.length, 2);
    assert.equal(one.truncated, true);
  } finally {
    globalThis.fetch = real;
  }
});

test('the booking tally is read defensively', () => {
  assert.equal(parseBookingTally(null), null);
  assert.equal(parseBookingTally({ nope: 1 }), null);
  const t = parseBookingTally({
    months: {
      '2026-09': { 'camille-granda': { consultBooked: 3, paidBooked: '2', dna: -1 }, 'Bad Key!': { consultBooked: 9 } },
      'not-a-month': {},
    },
    updatedAt: '2026-09-30T00:00:00Z',
  })!;
  assert.deepEqual(Object.keys(t.months), ['2026-09']);
  assert.deepEqual(tallyRows(t, '2026-09').map((r) => r.slug), ['camille-granda']);
  const row = t.months['2026-09']['camille-granda'];
  assert.equal(row.paidBooked, 2);
  assert.equal(row.dna, 0);
  assert.equal(row.consultHeld, 0, 'a missing field reads as zero for that field');
});

test('portal:<slug> is accepted for the scheduler events only', () => {
  assert.equal(allowedDetail('scheduler_visible', 'portal:camille-granda'), 'portal:camille-granda');
  assert.equal(allowedDetail('scheduler_interact', 'portal:camille-granda'), 'portal:camille-granda');
  assert.equal(allowedDetail('scheduler_visible', 'camille-granda'), 'camille-granda');
  for (const ev of ['book_direct', 'enquiry_submit', 'book_click', 'tool_complete']) {
    assert.equal(acceptedDetail(ev, 'portal:camille-granda'), null, ev);
  }
  assert.equal(allowedDetail('scheduler_visible', 'portal:nobody'), null);
});

test('funnelCuts splits the calendar by surface', () => {
  const log: ConversionLog = {
    events: { scheduler_visible: { '/book': 5, '/client-portal': 2 }, book_direct: { '/book': 1 } },
    details: {
      scheduler_visible: { 'camille-granda': 4, 'portal:camille-granda': 2 },
      book_direct: { 'camille-granda': 1 },
    },
    total: 8, since: '', updatedAt: '',
  };
  const { calendar } = funnelCuts(log);
  assert.deepEqual(calendar, [
    { who: 'camille-granda', surface: 'book', seen: 4, touched: 0, opened: 1, booked: 0 },
    { who: 'camille-granda', surface: 'portal', seen: 2, touched: 0, opened: 0, booked: 0 },
  ]);
});

/* ---- after the first paid session (item 120, 1 Oct 2026) ---------------- */

const NOW = new Date('2026-10-01T12:00:00Z');
const rOpts = { ...SEPT, now: NOW, consultTypeId: CONSULT_TYPE, slugFor: practitionerSlugFor };

/* Three patients:
   r1 (Camille): consult, then paid 3 and 17 Sep, and 8 Oct booked. Both
       September sessions were followed within 21 days; something is booked.
   r2 (Savneet): one paid session on 25 Sep and nothing since. Its 21 days
       are not up, so it is pending, not a miss; nothing is booked, so idle.
   r3 (Camille): began 23 Jun (100 days ago), then 30 Jun, 14 Jul, 5 Sep:
       four sessions inside the first 90 days. 5 Sep was not followed and
       its 21 days are up; nothing is booked, so idle. */
const retentionFixture = (): Appt[] => [
  ap({ patient: 'r1', who: camille.clinikoPractitionerId, at: '2026-08-28T02:00:00Z' }),
  ap({ patient: 'r1', who: camille.clinikoPractitionerId, at: '2026-09-03T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r1', who: camille.clinikoPractitionerId, at: '2026-09-17T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r1', who: camille.clinikoPractitionerId, at: '2026-10-08T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r2', who: savneet.clinikoPractitionerId, at: '2026-09-25T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r3', who: camille.clinikoPractitionerId, at: '2026-06-23T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r3', who: camille.clinikoPractitionerId, at: '2026-06-30T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r3', who: camille.clinikoPractitionerId, at: '2026-07-14T02:00:00Z', type: PAID_TYPE }),
  ap({ patient: 'r3', who: camille.clinikoPractitionerId, at: '2026-09-05T02:00:00Z', type: PAID_TYPE }),
  /* A cancelled booking is not "something booked". */
  ap({ patient: 'r3', who: camille.clinikoPractitionerId, at: '2026-10-10T02:00:00Z', type: PAID_TYPE, cancelled: true }),
];

test('rebooking: followed within 21 days, pending while the 21 days run, by counsellor', () => {
  const r = retention(retentionFixture(), rOpts);
  assert.deepEqual(r.rebook.all, { sessions: 4, followed: 2, pending: 1 });
  assert.deepEqual(r.rebook.bySlug['camille-granda'], { sessions: 3, followed: 2, pending: 0 });
  assert.deepEqual(r.rebook.bySlug['savneet-singh'], { sessions: 1, followed: 0, pending: 1 });
});

test('depth: a client whose first 90 days have passed, counted by sessions held', () => {
  const r = retention(retentionFixture(), rOpts);
  assert.equal(r.depth.all.clients, 1, 'only r3 began 90 to 120 days ago');
  assert.deepEqual([r.depth.all.reached2, r.depth.all.reached4, r.depth.all.reached6], [1, 1, 0]);
  assert.equal(median(r.depth.all.sessions), 4);
  assert.equal(r.depth.bySlug['camille-granda'].clients, 1);
});

test('idle: a paid session in the last 60 days and nothing live booked', () => {
  const r = retention(retentionFixture(), rOpts);
  assert.equal(r.idle.all, 2);
  assert.deepEqual(r.idle.bySlug, { 'camille-granda': 1, 'savneet-singh': 1 });
});

test('retention by source, folded under three, and never a patient key', () => {
  const sources: Record<string, string> = { r1: 'Google search', r2: 'friend or family', r3: 'Google search' };
  assert.deepEqual(retentionPatients(retentionFixture(), rOpts).sort(), ['r1', 'r2', 'r3']);
  const r = retention(retentionFixture(), rOpts, (k) => sources[k] ?? 'not recorded');
  assert.equal(r.rebook.bySource['Google search'].sessions, 3);
  const folded = foldSmall(r.rebook.bySlug, (x) => x.sessions, mergeRebook);
  assert.deepEqual(Object.keys(folded).sort(), ['camille-granda', OTHER_GROUP]);
  const text = retentionLines(r, 'September 2026').join('\n');
  assert.match(text, /rebooked/);
  assert.doesNotMatch(text, /\br[123]\b/, 'no patient key reaches the report');
  assert.doesNotMatch(JSON.stringify(r), /"r[123]"/);
});

test('median handles even, odd and empty lists', () => {
  assert.equal(median([]), null);
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 6]), 2.5);
});

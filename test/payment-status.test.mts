/* Payment is read from invoices, never inferred from the type — 3 Oct 2026.
   See lib/payment-status.ts and lib/unpaid-bookings.ts. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { paymentStatus, paymentLine, feeFor, type PaymentStatus } from '@/lib/payment-status';
import { unpaidRows, upcomingPaid, formatUnpaidTable } from '@/lib/unpaid-bookings';
import { runBookingNotifications, type Ledger, type LedgerStore } from '@/lib/booking-notify';
import { site } from '@/lib/site';

const API = 'https://api.ca1.cliniko.com/v1';
const T = {
  consult: '2013349744314681520',
  individual: '1466854657459489533',
  couples: '1909558292636502700',
  couplesExtended: '2013350310713493681',
  emdr: '2013356655093221554',
};
const CAMILLE = '2029879067058112997';
const DAY = 864e5;
const NOW = Date.parse('2026-10-03T19:00:00Z');

const appt = (over: Record<string, unknown> = {}) => ({
  id: '2053155793196288137',
  starts_at: new Date(NOW + 5 * DAY).toISOString(),
  ends_at: new Date(NOW + 5 * DAY + 50 * 60_000).toISOString(),
  created_at: new Date(NOW - 10 * DAY).toISOString(),
  appointment_type: { links: { self: `${API}/appointment_types/${T.individual}` } },
  practitioner: { links: { self: `${API}/practitioners/${CAMILLE}` } },
  patient: { links: { self: `${API}/patients/77` } },
  ...over,
});
const inv = (over: Record<string, unknown> = {}) => ({
  id: '9001', number: 1001, total_amount: '140.0', status_description: 'Paid', closed_at: '2026-10-03T19:34:00Z',
  appointment: { links: { self: `${API}/individual_appointments/2053155793196288137` } },
  ...over,
});

/* ---- the fee table ---------------------------------------------------------- */

test('the fee table is the catalogue: business types, ids and fees as Cliniko holds them', () => {
  const want = [
    [T.consult, 'Initial Consultation', 0],
    [T.individual, 'Individual Counselling', 14000],
    [T.couples, 'Couples Counselling', 17500],
    [T.couplesExtended, 'Couples Extended', 34000],
    [T.emdr, 'EMDR Intensive', 19000],
  ];
  assert.deepEqual(FALLBACK_CATALOG.items.map((i) => [i.id, i.name, i.cents]), want);
  for (const [id, name, cents] of want) {
    assert.deepEqual(feeFor(appt({ appointment_type: { links: { self: `${API}/appointment_types/${id}` } } })), { cents, name });
  }
});

/* ---- paymentStatus ------------------------------------------------------------ */

test('paid: a closed invoice for this appointment, for at least the fee', () => {
  assert.deepEqual(paymentStatus(appt(), { invoices: [inv()] }), { state: 'paid', amountCents: 14000, invoiceNumber: '1001' });
  /* Status "Paid" without closed_at, and the individual_appointment link shape. */
  const alt = inv({ closed_at: null, appointment: undefined, individual_appointment: { links: { self: `${API}/individual_appointments/2053155793196288137` } } });
  assert.equal(paymentStatus(appt(), { invoices: [alt] }).state, 'paid');
});

test('partial: settled for less than the fee is not received, with the shortfall', () => {
  const s = paymentStatus(appt(), { invoices: [inv({ total_amount: '70.00' })] });
  assert.deepEqual(s, { state: 'not-received', expectedCents: 14000, receivedCents: 7000, invoiceNumber: '1001', invoiceStatus: 'Paid' });
  assert.deepEqual(paymentLine(s), ['Payment', 'NOT RECEIVED (expected $140; $70 on invoice #1001, short $70)']);
  /* A closed invoice with an amount still outstanding is partial too. */
  assert.equal(paymentStatus(appt(), { invoices: [inv({ amount_outstanding: '40.00' })] }).state, 'not-received');
});

test('none: no invoice, an open invoice, or an invoice for another appointment', () => {
  const none = { state: 'not-received', expectedCents: 14000, receivedCents: 0, invoiceStatus: 'no invoice' };
  assert.deepEqual(paymentStatus(appt(), { invoices: [] }), none);
  assert.deepEqual(paymentStatus(appt(), { invoices: [inv({ appointment: { links: { self: `${API}/individual_appointments/1` } } })] }), none);
  assert.deepEqual(paymentStatus(appt(), { invoices: [inv({ deleted_at: '2026-10-02T00:00:00Z' })] }), none);
  const open = paymentStatus(appt(), { invoices: [inv({ closed_at: null, status_description: 'Awaiting payment' })] });
  assert.deepEqual(open, { state: 'not-received', expectedCents: 14000, receivedCents: 0, invoiceNumber: '1001', invoiceStatus: 'Awaiting payment' });
});

test('refunded or credited invoices are not received, even when closed', () => {
  for (const status of ['Refunded', 'Credited', 'Voided', 'Written off']) {
    const s = paymentStatus(appt(), { invoices: [inv({ status_description: status })] });
    assert.equal(s.state, 'not-received', status);
  }
});

test('free: the consultation, whatever its invoices say; paid is never inferred from the type', () => {
  const consult = appt({ appointment_type: { links: { self: `${API}/appointment_types/${T.consult}` } } });
  assert.deepEqual(paymentStatus(consult, { invoices: [] }), { state: 'free' });
  assert.deepEqual(paymentStatus(consult, { error: 'x' }), { state: 'free' });
  for (const id of [T.individual, T.couples, T.couplesExtended, T.emdr]) {
    const s = paymentStatus(appt({ appointment_type: { links: { self: `${API}/appointment_types/${id}` } } }), { invoices: [] });
    assert.equal(s.state, 'not-received', id);
  }
});

test('unknown: invoices not readable, a type not in the catalogue, or no type', () => {
  assert.deepEqual(paymentStatus(appt(), { error: 'HTTP 500 on invoices' }), { state: 'unknown', reason: 'HTTP 500 on invoices' });
  assert.equal(paymentStatus(appt({ appointment_type: { links: { self: `${API}/appointment_types/42` } } }), { invoices: [inv()] }).state, 'unknown');
  assert.equal(paymentStatus(appt({ appointment_type: null }), { invoices: [inv()] }).state, 'unknown');
});

test('the notice wording, for each state', () => {
  const line = (s: PaymentStatus) => paymentLine(s).join(': ');
  assert.equal(line({ state: 'paid', amountCents: 14000, invoiceNumber: '1001' }), 'Paid: $140 (Cliniko invoice #1001)');
  assert.equal(line({ state: 'not-received', expectedCents: 17500, receivedCents: 0, invoiceStatus: 'no invoice' }), 'Payment: NOT RECEIVED (expected $175)');
  assert.equal(line({ state: 'free' }), 'Payment: Free, nothing charged');
  assert.equal(line({ state: 'unknown', reason: 'HTTP 500 on invoices' }), 'Payment: could not be checked (HTTP 500 on invoices)');
  for (const s of [{ state: 'not-received', expectedCents: 14000, receivedCents: 0, invoiceStatus: 'no invoice' }, { state: 'unknown', reason: 'x' }] as PaymentStatus[]) {
    assert.doesNotMatch(line(s), /card is taken|Paid:/);
  }
});

/* ---- the unpaid list ------------------------------------------------------------ */

test('the unpaid list: upcoming paid types without a paid invoice, soonest first', () => {
  const a = (id: string, over: Record<string, unknown> = {}) => appt({ id, ...over });
  const appts = [
    a('1', { starts_at: new Date(NOW + 9 * DAY).toISOString() }),                 // no invoice
    a('2'),                                                                         // paid
    a('3', { cancelled_at: '2026-10-01T00:00:00Z' }),
    a('4', { archived_at: '2026-10-01T00:00:00Z' }),
    a('5', { did_not_arrive: true }),
    a('6', { starts_at: new Date(NOW - DAY).toISOString() }),                       // past
    a('7', { appointment_type: { links: { self: `${API}/appointment_types/${T.consult}` } } }),
    a('8', { starts_at: new Date(NOW + 2 * DAY).toISOString() }),                 // could not be checked
    a('9', { starts_at: new Date(NOW + 3 * DAY).toISOString() }),                 // partial
  ];
  const reads = new Map([
    ['1', { invoices: [] }],
    ['2', { invoices: [inv({ appointment: { links: { self: `${API}/individual_appointments/2` } } })] }],
    ['8', { error: 'HTTP 500 on invoices' }],
    ['9', { invoices: [inv({ total_amount: '70', appointment: { links: { self: `${API}/individual_appointments/9` } } })] }],
  ]);
  assert.deepEqual(upcomingPaid(appts, NOW).map((x) => x.id), ['1', '2', '8', '9']);
  const rows = unpaidRows(appts, reads, { now: NOW, practitionerName: () => 'Camille Granda', patientInitials: () => 'H.M.' });
  assert.deepEqual(rows.map((r) => [r.id, r.state]), [['8', 'unknown'], ['9', 'not-received'], ['1', 'not-received']]);
  assert.equal(rows[2].expectedCents, 14000);
  assert.equal(rows[2].invoice, 'no invoice');
  assert.equal(rows[0].invoice, 'could not be checked: HTTP 500 on invoices');
  const table = formatUnpaidTable(rows);
  assert.match(table, /Appointment id/);
  assert.match(table, /Camille Granda .* \$140 .* H\.M\./);
});

/* ---- the cron -------------------------------------------------------------------- */

type Sent = { to: string[]; subject: string; text: string };

async function withCron(
  appts: Record<string, unknown>[], invoices: Record<string, unknown>[], runs: number, start: Partial<Ledger> = {},
): Promise<{ sent: Sent[][]; ledger: Ledger; results: Awaited<ReturnType<typeof runBookingNotifications>>[] }> {
  const saved = {
    fetch: globalThis.fetch, now: Date.now,
    env: { CLINIKO_API_KEY: process.env.CLINIKO_API_KEY, RESEND_API_KEY: process.env.RESEND_API_KEY, PORTAL_FROM_EMAIL: process.env.PORTAL_FROM_EMAIL, BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN },
  };
  let ledger: Ledger = { confirmed: [], followedUp: [], reminded: [], alerted: [], cancelAlerted: [], unconvertedAlerted: [], tallied: [], lapsedAlerted: [], followUpSkipped: [], unpaidAlerted: [], updatedAt: '', ...start };
  const store: LedgerStore = { read: async () => structuredClone(ledger), write: async (l) => { ledger = structuredClone(l); } };
  const sent: Sent[][] = [];
  let batch: Sent[] = [];
  globalThis.fetch = (async (input: string, init: { method?: string; body?: string } = {}) => {
    const url = String(input);
    const json = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
    if (url.startsWith('https://api.resend.com')) {
      const b = JSON.parse(init.body ?? '{}');
      batch.push({ to: b.to, subject: b.subject, text: b.text });
      return json({ id: 'x' });
    }
    assert.equal(init.method ?? 'GET', 'GET', `only GETs go to Cliniko: ${url}`);
    if (url.startsWith(`${API}/appointments?`)) return json({ appointments: appts, links: {} });
    if (url.startsWith(`${API}/patients/77/invoices`)) return json({ invoices, links: {} });
    if (url === `${API}/patients/77`) return json({ id: 77, first_name: 'Hazel', last_name: 'Moss', email: 'hazel@example.invalid' });
    return new Response('not found', { status: 404 });
  }) as unknown as typeof fetch;
  Date.now = () => NOW;
  process.env.CLINIKO_API_KEY = 'test-not-real-ca1';
  process.env.RESEND_API_KEY = 'test-not-real';
  process.env.PORTAL_FROM_EMAIL = 'test@example.invalid';
  delete process.env.BLOB_READ_WRITE_TOKEN;
  const results = [];
  try {
    for (let i = 0; i < runs; i++) {
      batch = [];
      results.push(await runBookingNotifications({ store }));
      sent.push(batch);
    }
  } finally {
    globalThis.fetch = saved.fetch;
    Date.now = saved.now;
    for (const [k, v] of Object.entries(saved.env)) if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
  return { sent, ledger, results };
}

test('an upcoming paid session with no invoice: one alert to the practice, and none on the next run', async () => {
  const ap = appt();
  const { sent, ledger, results } = await withCron([ap], [], 2, { confirmed: [String(ap.id)] });
  const first = sent[0].filter((m) => m.subject.startsWith('Payment not received'));
  assert.equal(first.length, 1);
  assert.deepEqual(first[0].to, [site.email]);
  assert.equal(site.email, 'info@westpeakwellness.com');
  assert.equal(first[0].subject, 'Payment not received: 1 upcoming session');
  assert.match(first[0].text, /2053155793196288137/);
  assert.match(first[0].text, /Individual Counselling/);
  assert.match(first[0].text, /Camille Granda/);
  assert.match(first[0].text, /H\.M\./);
  assert.match(first[0].text, /NOT RECEIVED \(expected \$140\)/);
  assert.doesNotMatch(first[0].text, /Hazel|Moss|hazel@/, 'initials only');
  assert.equal(results[0].unpaid, 1);
  assert.deepEqual(ledger.unpaidAlerted, ['2053155793196288137']);
  assert.equal(sent[1].length, 0, 'the second run sends nothing');
  assert.equal(results[1].unpaid, 0);
});

test('a paid upcoming session raises no alert', async () => {
  const ap = appt();
  const { sent } = await withCron([ap], [inv()], 1, { confirmed: [String(ap.id)] });
  assert.equal(sent[0].length, 0);
});

test('the booking notice states the invoice when paid, NOT RECEIVED when not, and the unpaid alert is not repeated', async () => {
  const fresh = appt({ created_at: new Date(NOW - 3600_000).toISOString() });
  const paid = await withCron([fresh], [inv()], 1, { confirmed: [String(fresh.id)] });
  const notice = paid.sent[0].find((m) => m.subject.startsWith('New online booking'))!;
  assert.match(notice.text, /^Paid\s+\$140 \(Cliniko invoice #1001\)$/m);
  assert.doesNotMatch(notice.text, /card is taken/);

  const unpaid = await withCron([fresh], [], 2, { confirmed: [String(fresh.id)] });
  const n2 = unpaid.sent[0].find((m) => m.subject.startsWith('New online booking'))!;
  assert.match(n2.text, /^Payment\s+NOT RECEIVED \(expected \$140\)$/m);
  assert.equal(unpaid.sent[0].filter((m) => m.subject.startsWith('Payment not received')).length, 0, 'the booking notice was the alert');
  assert.deepEqual(unpaid.ledger.unpaidAlerted, [String(fresh.id)]);
  assert.equal(unpaid.sent[1].length, 0);
});

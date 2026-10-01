import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inferPayment, initials, linesBySeen, type InvoiceRow } from '../lib/cliniko-invoice-detail.ts';

test('an invoice closed within fifteen minutes of the booking was paid online at booking', () => {
  assert.equal(inferPayment('2026-09-10T18:05:00Z', '2026-09-10T18:00:00Z', '2026-09-15T17:00:00Z'), 'card online at booking (inferred)');
  assert.equal(inferPayment('2026-09-14T18:00:00Z', '2026-09-10T18:00:00Z', '2026-09-15T17:00:00Z'), 'settled before the session');
  assert.equal(inferPayment('2026-09-16T18:00:00Z', '2026-09-10T18:00:00Z', '2026-09-15T17:00:00Z'), 'settled after the session');
  assert.equal(inferPayment(null, null, null), 'not settled');
  assert.equal(inferPayment('2026-09-16T18:00:00Z', null, null), 'unknown');
});

test('a patient appears as initials only', () => {
  assert.equal(initials('Hazel', 'Morales'), 'H.M.');
  assert.equal(initials('hazel', ''), 'H.');
  assert.equal(initials(undefined, undefined), 'unknown');
});

test('revenue is grouped by who held the session, not whose name is on the invoice', () => {
  const row = (seenBy: string | null, invoicedUnder: string, c: number) =>
    ({ seenBy, invoicedUnder, amountCents: c } as unknown as InvoiceRow);
  const lines = linesBySeen([row('Camille Granda', 'Another practitioner', 14000), row('Camille Granda', 'Another practitioner', 14000), row(null, 'Savneet Singh', 14000)]);
  assert.deepEqual(lines.map((l) => [l.name, l.invoices, l.cents]), [['Camille Granda', 2, 28000], ['Savneet Singh', 1, 14000]]);
});

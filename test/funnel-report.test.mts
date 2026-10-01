import test from 'node:test';
import assert from 'node:assert/strict';
import { practitioners } from '@/lib/practitioners';
import { CONSULT_TYPE } from '@/lib/site';

/* runFunnelReport({ dry: true }) against a fake Cliniko: the counts carry
 * consult-to-paid by roster slug, nothing is sent, and no id, address or
 * name leaves in the counts. The key below is a made-up test value whose
 * only purpose is the shard suffix. */

delete process.env.BLOB_READ_WRITE_TOKEN;
delete process.env.RESEND_API_KEY;
process.env.CLINIKO_API_KEY = 'not-a-real-key-ca1';

const BASE = 'https://api.ca1.cliniko.com/v1';
const camille = practitioners.find((p) => p.slug === 'camille-granda')!;

test('a dry run returns counts.consultToPaid keyed by slug and sends nothing', async () => {
  const now = new Date();
  const mid = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 10, 18));
  const later = new Date(mid.getTime() + 7 * 864e5);
  const link = (kind: string, id: string) => ({ links: { self: `${BASE}/${kind}/${id}` } });
  const appts = [
    { id: 'a1', starts_at: mid.toISOString(), appointment_type: link('appointment_types', CONSULT_TYPE), practitioner: link('practitioners', camille.clinikoPractitionerId!), patient: link('patients', '777') },
    { id: 'a2', starts_at: later.toISOString(), appointment_type: link('appointment_types', '5'), practitioner: link('practitioners', camille.clinikoPractitionerId!), patient: link('patients', '777') },
    { id: 'a3', starts_at: mid.toISOString(), appointment_type: link('appointment_types', CONSULT_TYPE), practitioner: link('practitioners', camille.clinikoPractitionerId!), patient: link('patients', '888') },
  ];

  const seen: string[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL) => {
    const u = String(input);
    seen.push(u);
    if (!u.startsWith(BASE)) throw new Error(`unexpected request to ${u}`);
    if (u.includes('/appointments?') && !u.includes('page=2')) {
      return new Response(JSON.stringify({ appointments: appts.slice(0, 2), links: { next: `${BASE}/appointments?page=2` } }));
    }
    if (u.includes('/appointments?page=2')) return new Response(JSON.stringify({ appointments: appts.slice(2), links: {} }));
    if (/\/patients\/\d+$/.test(u)) return new Response(JSON.stringify({ id: 1, first_name: 'Never', referral_source: 'Google search', city: 'Surrey' }));
    if (u.includes('/patients?')) return new Response(JSON.stringify({ patients: [] }));
    return new Response('{}', { status: 404 });
  }) as typeof fetch;

  try {
    const { runFunnelReport, render, gather } = await import('@/lib/funnel-report');
    const r = await runFunnelReport({ dry: true });
    assert.equal(r.sent, false);
    const c = r.counts!;
    assert.deepEqual(c.consultToPaid!['camille-granda'], { consultsHeld: 2, convertedToPaid: 1, notYet: 1, cancelled: 0, dna: 0 });
    assert.equal(c.consults, 2, 'the second page was read');
    const sum = (m: Record<string, { consultsHeld: number }>) => Object.values(m).reduce((a, b) => a + b.consultsHeld, 0);
    assert.equal(sum(c.consultSources!.bySource), 2);
    assert.equal(sum(c.consultSources!.byCity), 2);
    assert.equal(c.bookingTally.status, 'absent');
    assert.equal(c.clinikoTruncated, false);
    const json = JSON.stringify(c);
    for (const bad of ['777', '888', 'Never', 'a1']) assert.ok(!json.includes(`"${bad}"`) && !json.includes(`/${bad}`), `no ${bad} in counts`);
    assert.ok(!seen.some((u) => /resend|mail/i.test(u)), 'nothing sent');

    const g = await gather();
    const mail = render(g.counts, g.from, g.to, g.clinikoOk);
    assert.match(mail.text, /a paid session booked within 60 days/);
    assert.match(mail.text, /camille-granda/);
    assert.match(mail.text, /Booking tally: not available/);
    assert.match(mail.html, /Consultations → paid/);
  } finally {
    globalThis.fetch = real;
  }
});

import '@/app/private.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { monthFromKey, previousMonth, money } from '@/lib/cliniko-revenue';
import { invoiceDetail, isPaidSession, whyNotCounted, type InvoiceRow } from '@/lib/cliniko-invoice-detail';
import { buildRevenueReport } from '@/lib/revenue-build';
import { sendRevenueReport, reportRecipients } from '@/lib/revenue-email';
import { recordAudit } from '@/lib/admin-audit';

/* Every invoice in a month, with the session behind it. See
   lib/cliniko-invoice-detail.ts for why this exists (1 Oct 2026). */

export const metadata: Metadata = { title: 'Invoices by month', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const TZ = 'America/Vancouver';
const when = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) : '—';

const lastMonths = (n: number): string[] => {
  const out: string[] = [];
  let p = previousMonth();
  for (let i = 0; i < n; i++) {
    out.push(p.key);
    p = previousMonth(new Date(p.start.getTime() + 12 * 3600_000));
  }
  return out;
};

export default async function RevenueDetail({ searchParams }: { searchParams: { month?: string; sent?: string } }) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) redirect('/signin?next=%2Fadmin%2Frevenue');

  const period = (searchParams.month && monthFromKey(searchParams.month)) || previousMonth();
  const d = await invoiceDetail(period);

  const bySeen = new Map<string, { n: number; cents: number }>();
  if (d.status === 'ok') {
    for (const r of d.rows.filter(isPaidSession)) {
      const k = r.seenBy ?? `${r.invoicedUnder} (no appointment linked)`;
      const v = bySeen.get(k) ?? { n: 0, cents: 0 };
      v.n++; v.cents += r.amountCents; bySeen.set(k, v);
    }
  }
  const paid: InvoiceRow[] = d.status === 'ok' ? d.rows.filter(isPaidSession) : [];
  const other: InvoiceRow[] = d.status === 'ok' ? d.rows.filter((r) => !isPaidSession(r)) : [];
  const paidTotal = paid.reduce((n, r) => n + r.amountCents, 0);
  const mismatches = paid.filter((r) => r.mismatch).length;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p><Link href="/admin">← Admin</Link></p>
        <h1 style={{ fontSize: '1.6rem' }}>Paid sessions, {period.label}</h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 760 }}>
          Every invoice Cliniko closed in the month, with the appointment it belongs to. &ldquo;Seen by&rdquo; is
          the counsellor who held the appointment; &ldquo;Invoiced under&rdquo; is the practitioner written on the
          invoice, which is what the monthly email has been grouping by. Payment is inferred, because
          Cliniko&rsquo;s API does not expose payments: an invoice closed within fifteen minutes of the booking
          was paid by card online when booked. For anything else, open the invoice in Cliniko to see the method.
          Patients appear as initials only.
        </p>
        {/* SEND THIS MONTH'S REPORT NOW — 1 Oct 2026. The owner asked to see the
            corrected September email without waiting for 1 Nov. Same builder and
            sender as the scheduled job, to the same recipients only; admin-only,
            audited, and never to a client. */}
        <form
          action={async () => {
            'use server';
            const s = await auth();
            const who = s?.user?.email ?? '';
            if (!who || !isAdmin(who)) return;
            const r = await buildRevenueReport(period);
            let state = 'err';
            if (r.status === 'ok') {
              const sent = await sendRevenueReport(r);
              state = sent.ok ? 'ok' : 'err';
            }
            await recordAudit({ actor: who, action: 'send revenue report', subject: `${period.key}: ${state}` });
            redirect(`/admin/revenue?month=${period.key}&sent=${state}`);
          }}
          style={{ margin: '0 0 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <button type="submit" className="btn btn--primary">Email the {period.label} report now</button>
          <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Goes to {reportRecipients().join(', ')} only.</span>
        </form>
        {searchParams.sent === 'ok' && <p className="crisis" style={{ padding: 12 }}>Sent. Check {reportRecipients().join(', ')}.</p>}
        {searchParams.sent === 'err' && <p className="crisis" style={{ padding: 12 }}>The report could not be built or sent. The scheduled job&rsquo;s status in /admin shows the error.</p>}
        <p style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {lastMonths(6).map((k) => (
            <Link key={k} href={`/admin/revenue?month=${k}`} className="chip" aria-current={k === period.key ? 'page' : undefined}>{k}</Link>
          ))}
        </p>

        {d.status === 'unconfigured' && <p>Cliniko is not configured on this deployment.</p>}
        {d.status === 'error' && <p>Cliniko could not be read: {d.detail}</p>}
        {d.status === 'ok' && (
          <>
            {mismatches > 0 && (
              <p className="crisis" style={{ padding: 14 }}>
                <strong>{mismatches} of {paid.length} paid sessions</strong> are written under a different practitioner from
                the one who held the appointment. Those are why the monthly email&rsquo;s per-counsellor split looks wrong.
                In Cliniko, open each one and change the practitioner on the invoice.
              </p>
            )}
            <p style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 4px' }}>{paid.length} paid session{paid.length === 1 ? '' : 's'}, {money(paidTotal)}</p>
            <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>Counted: paid, not refunded, and not the free initial consultation. A refund recorded in Cliniko as a separate payment, on an invoice still marked paid, cannot be seen here; Cliniko &rarr; Reports &rarr; Payment summary shows those.</p>
            <h2 style={{ fontSize: '1.15rem' }}>By who held the session</h2>
            <ul className="admin-terms">
              {[...bySeen.entries()].map(([k, v]) => (
                <li key={k}><span>{k}: {v.n} invoice{v.n === 1 ? '' : 's'}</span><span>{money(v.cents)}</span></li>
              ))}
            </ul>

            <h2 style={{ fontSize: '1.15rem', marginTop: 26 }}>Each paid session</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                    {['Invoice', 'Session', 'Type', 'Seen by', 'Invoiced under', 'Client', 'Attended', 'Amount', 'Status', 'Paid how', 'Booked', 'Closed'].map((h) => (
                      <th key={h} style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paid.map((r) => (
                    <tr key={r.invoiceId} style={{ borderBottom: '1px solid var(--line)', background: r.mismatch ? 'var(--clay-ghost)' : undefined }}>
                      <td style={{ padding: '8px 10px' }}>#{r.number}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{when(r.sessionAt)}</td>
                      <td style={{ padding: '8px 10px' }}>{r.appointmentType ?? (r.items.join(', ') || 'no appointment linked')}{r.isConsult ? ' (free consult)' : ''}</td>
                      <td style={{ padding: '8px 10px' }}>{r.seenBy ?? '—'}</td>
                      <td style={{ padding: '8px 10px' }}>{r.invoicedUnder}{r.mismatch ? ' ⚠' : ''}</td>
                      <td style={{ padding: '8px 10px' }}>{r.patient}</td>
                      <td style={{ padding: '8px 10px' }}>{r.attendance}</td>
                      <td style={{ padding: '8px 10px' }}>{money(r.amountCents)}</td>
                      <td style={{ padding: '8px 10px' }}>{r.status}</td>
                      <td style={{ padding: '8px 10px' }}>{r.payment}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{when(r.bookedAt)}</td>
                      <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>{when(r.closedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paid.length === 0 && <p>No paid sessions in {period.label}.</p>}
            {other.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.15rem', marginTop: 26 }}>Not counted</h2>
                <ul className="admin-terms">
                  {other.map((r) => (
                    <li key={r.invoiceId}><span>#{r.number} · {when(r.sessionAt ?? r.closedAt)} · {r.appointmentType ?? 'no appointment linked'} · {r.seenBy ?? r.invoicedUnder}</span><span>{whyNotCounted(r)}</span></li>
                  ))}
                </ul>
              </>
            )}
            {d.skipped > 0 && <p>{d.skipped} more invoices were not read; the page stops at 120.</p>}
          </>
        )}
      </div>
    </section>
  );
}

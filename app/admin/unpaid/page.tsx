import '@/app/private.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { money } from '@/lib/cliniko-catalog';
import { listUnpaid } from '@/lib/unpaid-bookings';

/* Upcoming paid-type appointments with no paid Cliniko invoice. Read only;
   see lib/unpaid-bookings.ts and lib/payment-status.ts (3 Oct 2026). */

export const metadata: Metadata = { title: 'Unpaid bookings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function UnpaidBookings() {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) redirect('/signin?next=%2Fadmin%2Funpaid');

  const d = await listUnpaid();
  const cell = { padding: '8px 10px' } as const;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p><Link href="/admin">← Admin</Link></p>
        <h1 style={{ fontSize: '1.6rem' }}>Upcoming sessions with no payment</h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 760 }}>
          Every paid-type appointment still to come, not cancelled or marked did-not-arrive, with no Cliniko invoice
          for it that is paid in full and not refunded or credited. The website never books or charges, so each of
          these was booked in Cliniko directly, or its payment step was skipped. Invoice it, or take payment, in
          Cliniko before the session. &ldquo;Could not be checked&rdquo; means the invoices were not read, not that
          they are missing. Clients appear as initials only.
        </p>

        {d.status === 'unconfigured' && <p>Cliniko is not configured on this deployment.</p>}
        {d.status === 'error' && <p>Cliniko could not be read: {d.detail}</p>}
        {d.status === 'ok' && (
          <>
            <p style={{ fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 4px' }}>
              {d.rows.length} of {d.checked} upcoming paid session{d.checked === 1 ? '' : 's'} without a paid invoice
            </p>
            {d.truncated && <p>Cliniko had more appointments than were read; this list is a floor.</p>}
            {d.rows.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                      {['Date', 'Time', 'Type', 'Practitioner', 'Expected', 'Invoice', 'Appointment id', 'Client'].map((h) => (
                        <th key={h} style={{ ...cell, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.rows.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--line)', background: r.state === 'not-received' ? 'var(--clay-ghost)' : undefined }}>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>{r.date}</td>
                        <td style={{ ...cell, whiteSpace: 'nowrap' }}>{r.time}</td>
                        <td style={cell}>{r.type}</td>
                        <td style={cell}>{r.practitioner}</td>
                        <td style={cell}>{money(r.expectedCents)}</td>
                        <td style={cell}>{r.invoice}</td>
                        <td style={cell}>{r.id}</td>
                        <td style={cell}>{r.patient}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readSession, ADMIN_COOKIE } from '@/lib/portal-auth';
import { readAllowlist, isAdmin } from '@/lib/portal-store';
import { clinikoConfigured } from '@/lib/cliniko';

export const metadata: Metadata = {
  title: { absolute: 'Client list — Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

/* Second of the two gates. Middleware proved the cookie is one we issued for
 * the admin area; this re-checks the address against PORTAL_ADMIN_EMAILS, so
 * removing an admin takes effect on their next request. */
export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { saved?: string; error?: string; cliniko?: string };
}) {
  const secret = process.env.PORTAL_SECRET;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  const email = secret ? await readSession(cookie, secret, 'admin') : null;
  if (!email || !isAdmin(email)) redirect('/admin/enter?expired=1');

  const list = await readAllowlist({ fresh: true });
  const saved = searchParams?.saved === '1';
  const failed = searchParams?.error === '1';
  const probe = searchParams?.cliniko;

  /* Plain-language result for the connection test. Each maps to one thing to
   * do next, because "it didn't work" is not actionable. */
  const CLINIKO_RESULT: Record<string, string> = {
    found:
      'Connected. Cliniko recognised that address as a patient, so anyone in ' +
      'Cliniko can now sign in without being added to the list below.',
    'not-found':
      'Connected, and Cliniko has no patient with that address. The key works — ' +
      'try an address you know is in Cliniko to confirm matching end to end.',
    unconfigured: 'No CLINIKO_API_KEY is set, so Cliniko is not being consulted at all.',
    'bad-key': 'Cliniko rejected the key. Check it was copied whole, including the shard suffix.',
    'no-shard':
      'The key has no shard suffix (it should end in something like -au1 or -ca1). ' +
      'Copy it again from Cliniko without trimming the end.',
    'unsupported-filter':
      'Cliniko rejected the email filter, which means searching patients by email ' +
      'is not available on this account. Keep using the list below.',
    error: 'Could not reach Cliniko. Nothing changed; client access is unaffected.',
  };

  return (
    <section className="section" style={{ paddingTop: 52 }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Admin</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Client list</h1>
        <p className="lede" style={{ fontSize: '1rem' }}>
          Addresses here can sign in to the client portal. One per line. Removing
          someone takes effect on their next click — there is no session to wait out.
        </p>

        {saved && (
          <div className="crisis" style={{ marginTop: 20 }}>
            <p style={{ margin: 0 }}>
              Saved. {list.emails.length} {list.emails.length === 1 ? 'address' : 'addresses'} can
              currently sign in.
            </p>
          </div>
        )}
        {failed && (
          <p role="alert" className="portal-gate-error" style={{ marginTop: 20 }}>
            That did not save. Nothing was changed — try again.
          </p>
        )}

        <form method="POST" action="/api/admin/clients" className="portal-gate" style={{ marginTop: 26 }}>
          <label htmlFor="emails">Client email addresses</label>
          <textarea
            id="emails"
            name="emails"
            rows={12}
            spellCheck={false}
            autoCapitalize="none"
            defaultValue={list.emails.join('\n')}
            placeholder={'someone@example.com\nanother@example.com'}
          />
          <p className="avail-note" style={{ marginTop: 0 }}>
            Anything that is not a valid address is dropped on save. Duplicates are merged and
            the list is sorted, so what you see after saving is exactly what is stored.
          </p>
          <button type="submit" className="btn btn--primary">Save list</button>
        </form>

        <p style={{ fontSize: '.88rem', color: 'var(--ink-faint)', marginTop: 26 }}>
          Signed in as {email}.{' '}
          {list.updatedAt
            ? `Last changed ${new Date(list.updatedAt).toLocaleString('en-CA')} by ${list.updatedBy}.`
            : 'No changes recorded yet.'}
        </p>
        <section style={{ marginTop: 34, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Cliniko connection</h2>
          <p style={{ fontSize: '.94rem', color: 'var(--ink-soft)' }}>
            {clinikoConfigured()
              ? 'A key is set. Enter an address that exists in Cliniko to confirm lookups work.'
              : 'No key set. While that is true, the list above is the only thing granting access.'}{' '}
            Cliniko can only ever <em>add</em> a way to qualify — if it is unreachable, everyone
            on the list above still gets in.
          </p>

          {probe && CLINIKO_RESULT[probe] && (
            <div className="crisis" style={{ marginTop: 14 }}>
              <p style={{ margin: 0 }}>{CLINIKO_RESULT[probe]}</p>
            </div>
          )}

          <form method="POST" action="/api/admin/cliniko" className="portal-gate" style={{ marginTop: 16 }}>
            <label htmlFor="probe">Test an address</label>
            <input
              id="probe" name="probe" type="email" inputMode="email"
              autoComplete="off" autoCapitalize="none" spellCheck={false} required
            />
            <button type="submit" className="btn btn--ghost">Test connection</button>
          </form>
        </section>

        <form method="POST" action="/api/admin/signout">
          <button type="submit" className="btn btn--ghost" style={{ marginTop: 6 }}>Sign out</button>
        </form>
      </div>
    </section>
  );
}

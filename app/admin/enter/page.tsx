import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Admin — Westpeak Wellness' },
  robots: { index: false, follow: false },
};

export default function AdminEnterPage({
  searchParams,
}: {
  searchParams?: { sent?: string; expired?: string };
}) {
  const sent = searchParams?.sent === '1';
  const expired = searchParams?.expired === '1';

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <p className="eyebrow">Admin</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Sign in</h1>

        {sent ? (
          <p className="lede" style={{ fontSize: '1rem' }}>
            If that address is an administrator, a sign-in link is on its way. It works once
            and expires in 30 minutes.
          </p>
        ) : (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              Enter your administrator email address to receive a sign-in link.
            </p>
            {expired && (
              <p role="alert" className="portal-gate-error" style={{ marginTop: 18 }}>
                That session or link is no longer valid. Request a new one.
              </p>
            )}
            <form method="POST" action="/api/portal" className="portal-gate">
              <input type="hidden" name="scope" value="admin" />
              <label htmlFor="email">Email address</label>
              <input
                id="email" name="email" type="email" inputMode="email"
                autoComplete="email" autoCapitalize="none" spellCheck={false} required
              />
              <button type="submit" className="btn btn--primary">Send me a link</button>
            </form>
            {Boolean(process.env.PORTAL_ADMIN_CODE) && (
              <details className="portal-alt">
                <summary>Use the setup code instead</summary>
                <form method="POST" action="/api/portal" className="portal-gate">
                  <label htmlFor="admin_code">Setup code</label>
                  <input
                    id="admin_code" name="admin_code" type="password"
                    autoComplete="one-time-code" autoCapitalize="none"
                    spellCheck={false} required
                  />
                  <button type="submit" className="btn btn--ghost">Enter</button>
                </form>
              </details>
            )}
          </>
        )}

        <p style={{ fontSize: '.9rem', color: 'var(--ink-faint)', marginTop: 24 }}>
          Locked out? Administrator addresses are set in the deployment
          configuration, not here — that is deliberate, so this page can never
          remove the last way in.
        </p>
      </div>
    </section>
  );
}

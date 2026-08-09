import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Client portal — Westpeak Wellness' },
  robots: { index: false, follow: false },
};

/* The sign-in step. Deliberately says as little as possible about who is or is
 * not a client: the confirmation below is identical whether or not the address
 * was recognised. */
export default function EnterPage({
  searchParams,
}: {
  searchParams?: { sent?: string; e?: string; expired?: string };
}) {
  const sent = searchParams?.sent === '1';
  const badCode = searchParams?.e === '1';
  const expired = searchParams?.expired === '1';
  const codeStillOn = Boolean(process.env.PORTAL_ACCESS_CODE);

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 470 }}>
        <p className="eyebrow">Current clients</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Client portal</h1>

        {sent ? (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              If that address is on file, a sign-in link is on its way. It works once and
              expires in 30 minutes.
            </p>
            <div className="crisis" style={{ marginTop: 22 }}>
              <p style={{ margin: 0 }}>
                Nothing arrived after a few minutes? Check the spam folder, then email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> — it may be that a different
                address is on file.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              Booking and payment for current clients. Enter the email address you booked
              with and you will be sent a sign-in link.
            </p>

            {expired && (
              <p role="alert" className="portal-gate-error" style={{ marginTop: 18 }}>
                That link has expired or was already used. Request a new one below.
              </p>
            )}

            <form method="POST" action="/api/portal" className="portal-gate">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
              <button type="submit" className="btn btn--primary">Send me a link</button>
            </form>

            {codeStillOn && (
              <details className="portal-alt">
                <summary>I have an access code instead</summary>
                <form method="POST" action="/api/portal" className="portal-gate">
                  <label htmlFor="code">Access code</label>
                  <input
                    id="code"
                    name="code"
                    type="password"
                    autoComplete="one-time-code"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    aria-describedby={badCode ? 'code-error' : undefined}
                  />
                  {badCode && (
                    <p id="code-error" role="alert" className="portal-gate-error">
                      That code was not recognised.
                    </p>
                  )}
                  <button type="submit" className="btn btn--ghost">Enter</button>
                </form>
              </details>
            )}
          </>
        )}

        <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', marginTop: 26 }}>
          Not a client yet? The <Link href={site.bookingPath}>free 15-minute consultation</Link>{' '}
          is open to everyone and needs no sign-in.
        </p>
      </div>
    </section>
  );
}

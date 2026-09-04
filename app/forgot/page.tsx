import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { mailConfigured } from '@/lib/portal-mail';

export const metadata: Metadata = {
  title: { absolute: 'Reset your password | Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Asks for an address and says the same thing either way.
 *
 * "If that address has an account, a link is on its way" rather than "no such
 * account" — on a counselling site, confirming whether someone has an account
 * confirms whether they are a client. */
export default function ForgotPage({ searchParams }: { searchParams?: { sent?: string } }) {
  const sent = searchParams?.sent === '1';
  const canMail = mailConfigured();

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <p className="eyebrow">Account</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Reset your password</h1>

        {sent ? (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              If that address has an account, a reset link is on its way. It works once and
              expires in 30 minutes.
            </p>
            <div className="crisis" style={{ marginTop: 20 }}>
              <p style={{ margin: 0 }}>
                Nothing after a few minutes? Check the spam folder. It may also be that a
                different address is on file. If so, email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            </div>
            <p style={{ marginTop: 22 }}>
              <Link className="btn btn--ghost" href="/signin">Back to sign in</Link>
            </p>
          </>
        ) : (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              Enter the email address you use for the client portal and you will be sent a link
              to set a new password.
            </p>

            {!canMail && (
              /* Visible to whoever is testing, not a client-facing failure: the
               * form still submits and still confirms, it just cannot deliver. */
              <p className="signin-setup">
                Email delivery is not configured, so no message will actually arrive. Set{' '}
                <code>RESEND_API_KEY</code> and <code>PORTAL_FROM_EMAIL</code> in Vercel and
                redeploy, see <code>GO_LIVE.md</code>.
              </p>
            )}

            <form method="POST" action="/api/portal/reset" className="portal-gate">
              <label htmlFor="email">Email address</label>
              <input
                id="email" name="email" type="email" inputMode="email"
                autoComplete="email" autoCapitalize="none" spellCheck={false} required
              />
              <button type="submit" className="btn btn--primary">Send me a reset link</button>
            </form>

            <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', marginTop: 24 }}>
              Signing in with Google instead? That needs no password at all, {' '}
              <Link href="/signin">go back to sign in</Link>.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

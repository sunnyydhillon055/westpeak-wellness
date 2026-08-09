import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site } from '@/lib/site';
import { auth, signIn, googleConfigured } from '@/auth';

export const metadata: Metadata = {
  title: { absolute: 'Sign in — Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* One sign-in for both areas. Where you land is decided by your role, not by
 * which page you started from, so there is nothing to explain and no way to end
 * up on the wrong form. */
export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (role === 'admin') redirect(searchParams?.next || '/admin');
  if (role === 'client') redirect(searchParams?.next || '/client-portal');

  const next = searchParams?.next;
  const failed = Boolean(searchParams?.error);
  const hasGoogle = googleConfigured();

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 430 }}>
        <p className="eyebrow">Westpeak Wellness</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Sign in</h1>
        <p className="lede" style={{ fontSize: '1rem' }}>
          For current clients and practice staff. You will be taken to the right place
          automatically.
        </p>

        {failed && (
          <p role="alert" className="portal-gate-error" style={{ marginTop: 18 }}>
            That did not sign you in. Check the address and password, and note that only
            current clients and staff have access.
          </p>
        )}

        {hasGoogle && (
          <>
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: next || '/client-portal' });
              }}
            >
              <button type="submit" className="btn btn--ghost signin-google">
                <svg viewBox="0 0 18 18" aria-hidden="true" width="17" height="17">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
                  <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
                </svg>
                Continue with Google
              </button>
            </form>
            <p className="signin-or"><span>or</span></p>
          </>
        )}

        <form
          className="portal-gate"
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              email: String(formData.get('email') ?? ''),
              password: String(formData.get('password') ?? ''),
              redirectTo: next || '/client-portal',
            });
          }}
        >
          <label htmlFor="email">Email address</label>
          <input
            id="email" name="email" type="email" inputMode="email"
            autoComplete="email" autoCapitalize="none" spellCheck={false} required
          />
          <label htmlFor="password" style={{ marginTop: 6 }}>Password</label>
          <input
            id="password" name="password" type="password"
            autoComplete="current-password" required
          />
          <button type="submit" className="btn btn--primary">Sign in</button>
        </form>

        <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', marginTop: 24 }}>
          No password yet, or forgotten it? Email{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a> and one will be set for you.
          {hasGoogle && ' Signing in with Google needs no password at all.'}
        </p>
        <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
          Not a client yet? The <Link href={site.bookingPath}>free 15-minute consultation</Link>{' '}
          is open to everyone and needs no sign-in.
        </p>
      </div>
    </section>
  );
}

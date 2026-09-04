import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site } from '@/lib/site';
import { auth, signIn, signOut, googleConfigured } from '@/auth';
import AccessCodeForm from '@/components/AccessCodeForm';

export const metadata: Metadata = {
  title: { absolute: 'Sign in | Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Sign-in for both areas, framed by which one you asked for.
 *
 * `next` decides the wording and the destination, so arriving from /admin says
 * "Staff sign in" and arriving from the portal says "Client portal" — the same
 * two methods either way, no second page to keep in step.
 *
 * The wrong-role case is handled explicitly rather than by redirecting. A
 * client who follows a link to /admin used to bounce: middleware sent them
 * here, this page saw a valid session and sent them back, and around again.
 * Now they are told plainly that the account has no admin access.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string; reset?: string };
}) {
  const next = searchParams?.next;
  const wantsAdmin = next === '/admin';
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const email = session?.user?.email ?? '';

  // Already signed in with sufficient rights — go where they were headed.
  if (role === 'admin') redirect(next || '/admin');
  if (role === 'client' && !wantsAdmin) redirect(next || '/client-portal');

  const wrongRole = role === 'client' && wantsAdmin;
  const failed = Boolean(searchParams?.error);
  const hasGoogle = googleConfigured();
  const destination = next || '/client-portal';

  if (wrongRole) {
    return (
      <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
        <div className="container" style={{ maxWidth: 440 }}>
          <p className="eyebrow">Staff area</p>
          <h1 style={{ fontSize: 'var(--fs-h2)' }}>No admin access on this account</h1>
          <p className="lede" style={{ fontSize: '1rem' }}>
            You are signed in as {email}, which is a client account. The admin area is for
            practice staff only.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href="/client-portal">Go to the client portal</Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/signin?next=%2Fadmin' });
              }}
            >
              <button type="submit" className="btn btn--ghost">Sign in as someone else</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <p className="eyebrow">{wantsAdmin ? 'Staff only' : 'Current clients'}</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>
          {wantsAdmin ? 'Staff sign in' : 'Client portal'}
        </h1>
        <p className="lede" style={{ fontSize: '1rem' }}>
          {wantsAdmin
            ? 'For practice staff. Client accounts cannot reach this area.'
            : 'Book a session, see your availability and manage your appointments.'}
        </p>

        {searchParams?.reset === '1' && (
          <div className="crisis" style={{ marginTop: 18 }}>
            <p style={{ margin: 0 }}>
              Password saved. Sign in with it below.
            </p>
          </div>
        )}

        {failed && (
          <p role="alert" className="portal-gate-error" style={{ marginTop: 18 }}>
            That did not sign you in. Check the address and password
            {wantsAdmin ? ', and note that only staff accounts have access here.' : '.'}
          </p>
        )}

        {hasGoogle ? (
          <>
            <form
              action={async () => {
                'use server';
                await signIn('google', { redirectTo: destination });
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
            {wantsAdmin && <p className="signin-or"><span>or use a password</span></p>}
          </>
        ) : (
          wantsAdmin && (
            /* Shown only on the staff form — a client has no use for it and it
             * would read as something being broken. */
            <p className="signin-setup">
              Google sign-in is not switched on yet. Set <code>AUTH_GOOGLE_ID</code> and{' '}
              <code>AUTH_GOOGLE_SECRET</code> in Vercel and redeploy, see{' '}
              <code>GO_LIVE.md</code>. Password sign-in works meanwhile.
            </p>
          )
        )}

        {/* Clients get the code route first: they reach this a few times a
            year and a password set once and never used is the thing they will
            not have. Staff sign in constantly, so a password is the faster
            path there and the code form would be friction. */}
        {!wantsAdmin && (
          <>
            <AccessCodeForm
              onVerify={async (formData: FormData) => {
                'use server';
                await signIn('access-code', {
                  email: String(formData.get('email') ?? ''),
                  code: String(formData.get('code') ?? ''),
                  redirectTo: destination,
                });
              }}
            />
            <p className="signin-or"><span>or use a password</span></p>
          </>
        )}

        <form
          className="portal-gate"
          action={async (formData: FormData) => {
            'use server';
            await signIn('credentials', {
              email: String(formData.get('email') ?? ''),
              password: String(formData.get('password') ?? ''),
              redirectTo: destination,
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
          <>
            Forgotten your password, or never set one?{' '}
            <Link href="/forgot">Send yourself a reset link</Link>. A code needs no
            password at all.
            {hasGoogle && ' Signing in with Google needs no password at all.'}
          </>
        </p>

        {!wantsAdmin && (
          <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
            Not a client yet? The{' '}
            <Link href={site.bookingPath}>free 15-minute consultation</Link> is open to everyone
            and needs no sign-in.
          </p>
        )}
      </div>
    </section>
  );
}

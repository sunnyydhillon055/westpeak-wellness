import type { Metadata } from 'next';
import Link from 'next/link';
import { readResetToken } from '@/lib/portal-auth';

export const metadata: Metadata = {
  title: { absolute: 'Set a new password | Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ERRORS: Record<string, string> = {
  expired: 'That link has expired, or it was not valid. Request a new one. They last 30 minutes.',
  used: 'That link has already been used. Each one works once; request a new one if you need it.',
  short: 'Passwords need to be at least 10 characters. Nothing was changed.',
  match: 'Those two passwords did not match. Nothing was changed.',
  failed: 'The new password could not be saved, so your old one still works. Try again, if it keeps happening, that is a fault worth reporting.',
};

export default async function ResetPage({
  searchParams,
}: {
  searchParams?: { t?: string; e?: string };
}) {
  const token = searchParams?.t ?? '';
  const err = searchParams?.e;
  const secret = process.env.PORTAL_SECRET;

  // Validate before showing the form, so a dead link says so immediately rather
  // than after someone has typed a password twice.
  const parsed = token && secret ? await readResetToken(token, secret) : null;
  const dead = !parsed || err === 'expired' || err === 'used';

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 76 }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <p className="eyebrow">Account</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>
          {dead ? 'That link is no longer valid' : 'Set a new password'}
        </h1>

        {dead ? (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              {ERRORS[err ?? 'expired'] ?? ERRORS.expired}
            </p>
            <p style={{ marginTop: 20 }}>
              <Link className="btn btn--primary" href="/forgot">Request a new link</Link>
            </p>
          </>
        ) : (
          <>
            <p className="lede" style={{ fontSize: '1rem' }}>
              Choose a password for {parsed.email}. At least 10 characters, length matters far
              more than punctuation.
            </p>

            {err && ERRORS[err] && (
              <p role="alert" className="portal-gate-error" style={{ marginTop: 18 }}>
                {ERRORS[err]}
              </p>
            )}

            <form method="POST" action="/api/portal/reset" className="portal-gate">
              <input type="hidden" name="token" value={token} />
              <label htmlFor="password">New password</label>
              <input
                id="password" name="password" type="password" minLength={10}
                autoComplete="new-password" required
              />
              <label htmlFor="confirm" style={{ marginTop: 6 }}>Type it again</label>
              <input
                id="confirm" name="confirm" type="password" minLength={10}
                autoComplete="new-password" required
              />
              <button type="submit" className="btn btn--primary">Save password</button>
            </form>

            <p style={{ fontSize: '.9rem', color: 'var(--ink-faint)', marginTop: 22 }}>
              Saving cancels this link and any other reset links for the account.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Client portal — Westpeak Wellness' },
  robots: { index: false, follow: false },
};

export default function EnterPage({
  searchParams,
}: {
  searchParams?: { e?: string };
}) {
  const failed = searchParams?.e === '1';

  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 72 }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Current clients</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Client portal</h1>
        <p className="lede" style={{ fontSize: '1rem' }}>
          Booking and payment for current clients. Enter the access code from your welcome
          email.
        </p>

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
            aria-describedby={failed ? 'code-error' : undefined}
          />
          {failed && (
            <p id="code-error" role="alert" className="portal-gate-error">
              That code was not recognised. Check the welcome email, or ask for a new one.
            </p>
          )}
          <button type="submit" className="btn btn--primary">Enter</button>
        </form>

        <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', marginTop: 24 }}>
          Not a client yet? The <Link href={site.bookingPath}>free 15-minute consultation</Link>{' '}
          is open to everyone and needs no code.
        </p>
        <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
          Lost your code? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </section>
  );
}

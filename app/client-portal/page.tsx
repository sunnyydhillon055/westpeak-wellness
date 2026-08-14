import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site } from '@/lib/site';
import SchedulerEmbed from '@/components/SchedulerEmbed';
import { auth, signOut } from '@/auth';
import { isClientAllowed } from '@/lib/portal-store';
import ReminderPrefs from '@/components/ReminderPrefs';

/* Gated by middleware.ts — never served without the access code, so it is kept
 * out of the index and out of the sitemap. Deliberately short: this is a place
 * to do two things, not a page to read. The explanatory material that used to
 * live here belongs on /pricing and /faq, which are public. */
export const metadata: Metadata = {
  title: { absolute: 'Client portal — Westpeak Wellness' },
  robots: { index: false, follow: false },
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Second of the two gates, and the one that makes revocation immediate.
 *
 * Middleware proved the cookie is one we issued; it cannot read the stored
 * allowlist from the edge runtime. So the list is checked HERE, on every
 * render. Without this, removing someone in /admin would leave their existing
 * session working until the cookie expired. */
export default async function ClientPortalPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  const role = (session?.user as { role?: string } | undefined)?.role;
  // Admins can view the portal; anyone else must still be a current client at
  // this moment, not merely at the moment they signed in.
  if (!email || (role !== 'admin' && !(await isClientAllowed(email)))) {
    redirect('/signin?next=%2Fclient-portal');
  }

  return (
    <section className="section" style={{ paddingTop: 52 }}>
      <div className="container" style={{ maxWidth: 780 }}>
        <p className="eyebrow">Current clients</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Client portal</h1>
        <p className="lede" style={{ fontSize: '1.02rem', marginBottom: 34 }}>
          Book a session and pay in one step. Live availability comes from the booking
          calendar below.{' '}
          Cancelling is free up to {site.cancellationHours} hours before.
        </p>

        <h2 id="book" style={{ marginTop: 38 }}>
          Book and pay
        </h2>

        {/* The full range of sessions, which is why this page is behind sign-in.
            The public /book page is filtered to the free consultation only. */}
        <SchedulerEmbed url={site.bookingsPaidUrl} title="Book a session" />

        <ReminderPrefs email={email} notice={typeof searchParams?.prefs === 'string' ? searchParams.prefs : undefined} />

        <h2 id="cancelling" style={{ marginTop: 38 }}>Cancelling</h2>
        <ul className="checklist">
          <li>
            <strong>More than {site.cancellationHours} hours ahead</strong> &mdash; refunded in
            full, no reason needed. Reply to your confirmation email.
          </li>
          <li>
            <strong>Less than {site.cancellationHours} hours, or a missed session</strong> &mdash;
            not refunded, because the time was held and cannot be filled at that notice.
          </li>
          <li>
            <strong>Something serious happened</strong> &mdash; say so. Nothing here is automated.
          </li>
        </ul>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button type="submit" className="btn btn--ghost" style={{ marginTop: 30 }}>
            Sign out
          </button>
        </form>

        <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)', marginTop: 26 }}>
          Signed in as {email}. Receipts are emailed automatically and carry the registration number your extended
          health plan needs. <Link href="/pricing">Fees and coverage</Link> &middot;{' '}
          <Link href="/contact">Contact</Link>
        </p>
      </div>
    </section>
  );
}

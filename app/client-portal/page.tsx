import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site, bookingsPaidUrlFor } from '@/lib/site';
import Image from 'next/image';
import { practitioners, getPractitioner, withLetters } from '@/lib/practitioners';
import SchedulerEmbed from '@/components/SchedulerEmbed';
import { auth, signOut } from '@/auth';
import { isClientAllowed } from '@/lib/portal-store';

/* Gated by middleware.ts — never served without the access code, so it is kept
 * out of the index and out of the sitemap. Deliberately short: this is a place
 * to do two things, not a page to read. The explanatory material that used to
 * live here belongs on /pricing and /faq, which are public. */
export const metadata: Metadata = {
  title: { absolute: 'Client portal | Westpeak Wellness' },
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

  /* WHO THE CLIENT IS BOOKING WITH — 8 Sep 2026, the same choice /book
     offers. The portal embedded the practice-wide paid calendar and left the
     client to find their counsellor inside Cliniko's own list. Now: a card
     for each counsellor who can be booked online, ?with= narrows the embed
     to that person's calendar, and a large line above the calendar says
     whose it is. The roster does not record which client sees whom, so
     nothing is pre-selected. */
  const bookableOnline = practitioners.filter((p) => p.bookable && p.clinikoPractitionerId);
  const withSlug = typeof searchParams?.with === 'string' ? searchParams.with : '';
  const asked = withSlug ? getPractitioner(withSlug) : undefined;
  const who = asked && asked.bookable && asked.clinikoPractitionerId ? asked : undefined;

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

        {bookableOnline.length > 1 && (
          <div className="book-choose" style={{ margin: '14px 0 18px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.2rem' }}>Who are you booking with?</h3>
            <div className="grid grid-2" style={{ gap: 14 }}>
              {bookableOnline.map((p) => {
                const on = who?.slug === p.slug;
                const first = p.name.split(' ')[0];
                return (
                  <Link
                    key={p.slug}
                    href={`${site.portalPath}?with=${p.slug}#book`}
                    className="card"
                    aria-current={on ? 'true' : undefined}
                    style={{
                      display: 'block', textDecoration: 'none', color: 'inherit',
                      ...(on ? { borderColor: 'var(--blue-deep)', boxShadow: '0 0 0 2px var(--blue-deep) inset' } : {}),
                    }}
                  >
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      {p.photos?.portrait && (
                        <Image
                          src={p.photos.portrait.src}
                          alt={p.photos.portrait.alt}
                          width={p.photos.portrait.width}
                          height={p.photos.portrait.height}
                          sizes="72px"
                          style={{ width: 72, height: 72, flex: '0 0 72px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }}
                        />
                      )}
                      <div>
                        <strong style={{ fontSize: '1.05rem' }}>{withLetters(p)}</strong>
                        <p style={{ margin: '2px 0 0', color: 'var(--ink-soft)', fontSize: '.9rem' }}>
                          {p.languages.map((l) => l.name).join(' and ')}
                        </p>
                      </div>
                    </div>
                    <span className={on ? 'btn btn--ghost' : 'btn btn--primary'} style={{ marginTop: 12 }}>
                      {on ? `Booking with ${first} ↓` : `Book with ${first}`}
                    </span>
                  </Link>
                );
              })}
            </div>
            {who && (
              <p style={{ margin: '12px 0 0', fontSize: '.92rem', color: 'var(--ink-soft)' }}>
                <Link href={`${site.portalPath}#book`}>See both calendars instead</Link>
              </p>
            )}
          </div>
        )}

        <div style={{ margin: '18px 0 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
          {who?.photos?.portrait && (
            <Image src={who.photos.portrait.src} alt="" width={56} height={56}
              style={{ width: 56, height: 56, objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }} />
          )}
          <p style={{ margin: 0, fontSize: '1.35rem', fontWeight: 600, lineHeight: 1.2 }}>
            {who
              ? <>You are booking with {withLetters(who)}</>
              : <>Pick a time, then choose your counsellor on the calendar</>}
          </p>
        </div>

        {/* The full range of sessions, which is why this page is behind sign-in.
            The public /book page is filtered to the free consultation only. */}
        <SchedulerEmbed url={bookingsPaidUrlFor(who?.clinikoPractitionerId)} title={`Book a session${who ? ` with ${who.name.split(' ')[0]}` : ''}`} page="/client-portal" />

        {/* The founder's clients: she is not on the online calendar (owner's
            instruction, 8 Sep 2026), so they book by reply. Said once, plainly,
            without naming her — the name guard applies here too. */}
        <p style={{ margin: '14px 0 0', fontSize: '.95rem', color: 'var(--ink-soft)' }}>
          If your counsellor is not listed above, book by reply: send a message from the{' '}
          <Link href="/contact">contact page</Link> or answer your last appointment email, and your
          time will be confirmed within one business day.
        </p>

        {/* The reminder-preferences block (email / text / nothing in your inbox)
            came off this page on 8 Sep 2026 at the owner's instruction. Cliniko
            still sends its own reminders; the API route that saved the
            preference stays for anyone who bookmarked it. */}

        <h2 id="cancelling" style={{ marginTop: 38 }}>Cancelling</h2>
        <ul className="checklist">
          <li>
            <strong>More than {site.cancellationHours} hours ahead</strong> &mdash; refunded in
            full, no reason needed. Reply to your confirmation email.
          </li>
          <li>
            <strong>Less than {site.cancellationHours} hours, or a missed session</strong> &mdash;
            half the fee is refunded and half is retained, because the time was held and cannot be
            filled at that notice. This is the figure in the consent form you signed.
          </li>
          <li>
            <strong>Something serious happened</strong> &mdash; say so. Nothing here is automated.
          </li>
        </ul>

        {/* Deliberately here and NOT in the post-session follow-up email.
            Both would be permitted — BCACC bans testimonials, not referrals —
            but an email arriving the morning after a session asking you to pass
            the practice on reads as transactional at the one moment it must
            not. The portal is somewhere a client comes on purpose. */}
        <h2 id="passing-on" style={{ marginTop: 38 }}>If someone you know is looking</h2>
        <p style={{ marginBottom: 0 }}>
          There are openings at the moment. You will never be asked for a review or a
          testimonial. That is prohibited, and for a good reason, and there is no reward for
          passing anything on. <Link href="/refer">What is useful to send someone</Link>, if you
          ever want it.
        </p>

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

import '@/app/private.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { site, bookingsPaidUrlFor } from '@/lib/site';
import Image from 'next/image';
import { practitioners, getPractitioner, withLetters } from '@/lib/practitioners';
import SchedulerEmbed from '@/components/SchedulerEmbed';
import { auth, signOut } from '@/auth';
import { isClientAllowed } from '@/lib/portal-store';
import { readPortalAppointments, paidTypesFor } from '@/lib/portal-appointments';
import { readCatalog, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { formatPacific } from '@/lib/pacific-time';
import { CANCELLATION_RULE, LATE_CANCELLATION_KEPT_PERCENT } from '@/lib/policies';

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
     whose it is.

     PRE-SELECTED SINCE 1 OCT 2026. The roster does not record who sees whom,
     but Cliniko does: lib/portal-appointments.ts reads the signed-in client's
     own appointments, and with no ?with= the page opens on the counsellor of
     the latest session that took place, when she is bookable online.
     ?with=all is the explicit "show every calendar". If Cliniko is not
     configured or fails, `mine` is null and the page is what it was. */
  const bookableOnline = practitioners.filter((p) => p.bookable && p.clinikoPractitionerId);
  const withSlug = typeof searchParams?.with === 'string' ? searchParams.with : '';
  const mine = await readPortalAppointments(email);
  const onlineById = (id?: string | null) => (id ? bookableOnline.find((p) => p.clinikoPractitionerId === id) : undefined);
  const asked = withSlug && withSlug !== 'all' ? getPractitioner(withSlug) : undefined;
  const who = asked && asked.bookable && asked.clinikoPractitionerId
    ? asked
    : !withSlug ? onlineById(mine?.lastPractitionerId) : undefined;
  /* Her paid types, priced from the catalogue. Never typed here. */
  const catalog = who ? await readCatalog() : null;
  const herTypes = who && catalog ? paidTypesFor(who.services, catalog) : [];
  const typeName = (id: string) => (catalog ?? FALLBACK_CATALOG).items.find((i) => i.id === id)?.name;
  const when = (iso: string) => {
    try {
      return formatPacific(iso, {
        weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="section" style={{ paddingTop: 52 }}>
      <div className="container" style={{ maxWidth: 780 }}>
        <p className="eyebrow">Current clients</p>
        <h1 style={{ fontSize: 'var(--fs-h2)' }}>Client portal</h1>
        <p className="lede" style={{ fontSize: '1.02rem', marginBottom: 34 }}>
          Book a session and pay in one step. Live availability comes from the booking
          calendar below.{' '}
          {CANCELLATION_RULE}
        </p>

        {/* What is already booked, from Cliniko. Nothing at all when Cliniko
            could not be read: "Nothing booked yet" is a statement, and is
            only made when it was checked. A counsellor is named only when she
            is on the online calendar. */}
        {mine && (
          <div className="admin-panel" style={{ margin: '0 0 8px' }}>
            <h2 id="next" style={{ margin: '0 0 10px', fontSize: '1.25rem' }}>
              {mine.upcoming.length ? 'Your next session' : 'Nothing booked yet'}
            </h2>
            {mine.upcoming.length ? (
              <>
                <ul style={{ margin: '0 0 8px', paddingLeft: 20 }}>
                  {mine.upcoming.map((u) => {
                    const pr = onlineById(u.practitionerId);
                    const kind = u.isConsult ? 'Free consultation' : typeName(u.typeId);
                    return (
                      <li key={u.id}>
                        <strong>{when(u.startsAt)}</strong>
                        {kind ? <>, {kind}</> : null}
                        {pr ? <> with {pr.name.split(' ')[0]}</> : null}
                      </li>
                    );
                  })}
                </ul>
                <p style={{ margin: 0, fontSize: '.92rem', color: 'var(--ink-soft)' }}>
                  To move or cancel one, reply to its confirmation email.
                </p>
              </>
            ) : (
              <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
                When you book below, it will show here.
              </p>
            )}
          </div>
        )}

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
                <Link href={`${site.portalPath}?with=all#book`}>See both calendars instead</Link>
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

        {/* WHAT A SESSION WITH HER COSTS, 1 Oct 2026. The portal showed no fee
            at all; the first figure a client saw was on Cliniko's card form.
            Types and amounts from the catalogue (lib/cliniko-catalog.ts), the
            types she offers from the roster. Coverage is plan-dependent. */}
        {who && herTypes.length > 0 && (
          <div style={{ margin: '0 0 14px', fontSize: '.95rem' }}>
            <ul style={{ margin: '0 0 6px', paddingLeft: 20 }}>
              {herTypes.map((t) => (
                <li key={t.id}>{t.name}, {t.minutes} minutes, {t.fee}</li>
              ))}
            </ul>
            <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
              Cliniko takes the card when you book. The receipt carries {who.name.split(' ')[0]}&rsquo;s
              registration number, which an extended health plan asks for; whether your plan
              reimburses depends on the plan.
            </p>
          </div>
        )}

        {/* The full range of sessions, which is why this page is behind sign-in.
            The public /book page is filtered to the free consultation only. */}
        <SchedulerEmbed url={bookingsPaidUrlFor(who?.clinikoPractitionerId)} title={`Book a session${who ? ` with ${who.name.split(' ')[0]}` : ''}`} page="/client-portal" who={who ? `portal:${who.slug}` : undefined} />

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
            <strong>At least {site.cancellationHours} hours&rsquo; notice</strong> &mdash; a full
            refund, no reason needed. Reply to your confirmation email.
          </li>
          <li>
            <strong>Less than {site.cancellationHours} hours&rsquo; notice, or a no-show</strong> &mdash;
            {LATE_CANCELLATION_KEPT_PERCENT}% of the fee is kept, because the time was held and cannot be
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

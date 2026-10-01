import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { consultationAvailability, type Availability } from '@/lib/cliniko-availability';
import { acceptingCounsellors } from '../accepting';

/* Re-rendered every thirty minutes, like the profiles, so the next-open line
   is what Cliniko is offering. */
export const revalidate = 1800;

const TITLE = 'For counsellors with a full caseload';
const DESC =
  'For a counsellor with a full caseload: who is accepting here, in which languages and where, and how a client books. No referral fee, nothing reciprocal.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${site.domain}/refer/counsellors` },
  openGraph: { ...ogBase('/refer/counsellors'), title: `${TITLE} | ${site.name}`, description: DESC, url: `${site.domain}/refer/counsellors` },
};

/* A PAGE FOR THE COLLEAGUE WHO HAS TO SAY "I AM FULL" — added 1 Oct 2026.
 *
 * Counsellors turn people away every week, and the ones who need a Punjabi or
 * Tagalog speaker are the hardest to place: those counsellors are scarce, and
 * the colleague holding the enquiry usually has nobody to name. Nothing on the
 * site spoke to that colleague; /refer is for friends and family and
 * /refer/doctor for physicians.
 *
 * Everything about who is accepting comes from the roster
 * (app/refer/accepting.ts), so the page cannot name somebody who has stopped
 * taking clients, and it renders a plain sentence rather than an empty list
 * when nobody is. The next-open line is Cliniko's own answer and prints
 * nothing when Cliniko cannot be read. It never states hours.
 *
 * What it must not become: a referral arrangement. No fee, no reciprocity, no
 * report back to the referrer without the client's written consent. Those are
 * stated on the page because a colleague will want to know before sending
 * anyone, and because a paid or reciprocal arrangement is a conflict of
 * interest the client cannot see. */
export default async function ForCounsellors() {
  const accepting = acceptingCounsellors();
  let avail: Record<string, Availability> = {};
  try {
    avail = await consultationAvailability();
  } catch {
    avail = {};
  }
  const nextFor = (slug: string): string | null => {
    const a = avail[slug];
    return a && !a.error && a.next.length ? a.next[0]! : null;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPage({
              path: '/refer/counsellors',
              name: 'For counsellors with a full caseload',
              description: DESC,
              updated: COLLECTION_DATES['services'],
              type: 'WebPage',
            })
          ),
        }}
      />
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--narrow">
          <p className="eyebrow">For colleagues</p>
          <h1>When your caseload is full.</h1>
          <p className="lede">
            If you are turning someone away and they need a counsellor soon, here is who is
            accepting new clients at {site.name}, in which languages and where, and how the
            person books.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container container--narrow">
          <Breadcrumbs
            trail={[
              { name: 'Passing it on', path: '/refer' },
              { name: 'For counsellors', path: '/refer/counsellors' },
            ]}
          />

          <div className="prose">
            <h2>Who is accepting new clients now</h2>
            {accepting.length === 0 ? (
              <p>
                Nobody here is taking new clients at the moment. Write to{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> if you would like to know when
                that changes; it is better to say so than to send someone to a calendar with
                nothing in it.
              </p>
            ) : (
              <ul className="checklist">
                {accepting.map((c) => {
                  const next = nextFor(c.slug);
                  return (
                    <li key={c.slug}>
                      <strong>
                        <Link href={c.profilePath}>{c.letters}</Link>
                      </strong>
                      <br />
                      Languages: {c.languages.join(', ')}. Sees clients located in:{' '}
                      {c.area === 'Anywhere in Canada' ? 'anywhere in Canada' : c.area}.
                      <br />
                      Focus: {c.focus.join('; ')}.
                      {c.services.length ? (
                        <>
                          <br />
                          Offers: {c.services.join(', ')}.
                        </>
                      ) : null}
                      {next ? (
                        <>
                          <br />
                          Next open free consultation: {next}.
                        </>
                      ) : null}
                      <br />
                      <Link href={c.bookPath}>Booking page for {c.name.split(' ')[0]}</Link>
                    </li>
                  );
                })}
              </ul>
            )}

            <h2>How to pass someone on</h2>
            <p>
              The person books for themselves. Send them the booking page above for the counsellor
              who fits, or <Link href={site.bookingPath}>the general booking page</Link> if you
              are not sure. The first appointment is a free consultation by secure video, so they
              find out whether this is the right place before committing to anything. No referral
              letter or form is needed, and you do not need to contact us first.
            </p>
            <p>
              If something would help the person not to repeat their story, they can bring it to
              the consultation themselves. Anything you want to send directly needs their written
              consent, sent to <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>What this is not</h2>
            <ul>
              <li>
                <strong>No referral fee</strong>, in either direction, and no credit for sending
                anyone.
              </li>
              <li>
                <strong>Nothing reciprocal.</strong> Sending a client here does not create an
                expectation that anyone is sent back to you.
              </li>
              <li>
                <strong>No report back</strong> about whether the person booked or how it is
                going, unless the client asks for that in writing.
              </li>
            </ul>
            {/* The crisis line sits in the site's crisis box rather than as a
                fourth bullet, so it reads as the one thing not to miss, and so
                the page carries a boxed block (scripts/visual-audit.mjs). */}
            <div className="crisis" style={{ margin: '18px 0' }}>
              <p style={{ margin: 0 }}>
                <strong>Not a crisis service.</strong> Sessions are scheduled. Someone in crisis
                needs 9-1-1, 9-8-8, or 310-6789 in BC, not a booking page.
              </p>
            </div>
            <p>
              Scope limits are the same as for any referral: no diagnosis, no formal assessment,
              no court-related work. They are set out on <Link href="/standards">standards and
              scope</Link>. For a physician, <Link href="/refer/doctor">the one-page summary for
              doctors</Link> covers the same ground, and a clinic front desk can use{' '}
              <Link href="/refer/handout">the printable cards</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

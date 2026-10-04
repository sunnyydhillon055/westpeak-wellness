import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import NextConsultLine from '@/components/NextConsultLine';
import CounsellorCards from '@/components/CounsellorCards';
import { counsellorsForInfoPage } from '@/lib/counsellor-cards';
import { ogBase } from '@/lib/og-meta';

/* THE CONFIRMATION FOR A ONE-PAGER SIGNUP — 1 Oct 2026.
 *
 * The email forms on the guides, resources and comparisons
 * (components/LeadCapture.tsx) used to land on /message-sent, which is the
 * confirmation for an ENQUIRY: it promises a counsellor's reply within a
 * business day, "no mailing list" and "no follow-up sequence". None of that
 * is true of a one-pager signup. Nobody replies to it, and lib/nurture.ts
 * sends two more emails, on day 4 and day 11, with a one-click unsubscribe,
 * then stops for good. So a signup now lands here, and this page says what
 * actually happens.
 *
 * Rendered on request, unlike /message-sent, because it reads ?lead=err:
 * the lead route sends a failed signup to the same returnTo, and a static
 * page would have told that person their one-pager was on its way. It is a
 * page nobody reaches except by posting a form, so being dynamic costs
 * nothing a search engine sees.
 *
 * noindex, for /message-sent's reason: indexed, it would announce a
 * one-pager the searcher never asked for. Then the bridge: the next free
 * consultation and who it would be with, for the reader who would rather
 * talk than read. No outcome claims, no hours. */

const TITLE = 'Your one-pager is on its way';
const DESC = 'Confirmation that your one-pager request reached Westpeak Wellness, and what follows it.';

export const metadata: Metadata = {
  openGraph: { ...ogBase('/one-pager-sent') },
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}/one-pager-sent` },
};

export default function OnePagerSentPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const failed = searchParams?.lead === 'err';
  return (
    <div>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--narrow">
          <p className="eyebrow">{failed ? 'Not sent' : 'One-pager requested'}</p>
          {failed ? (
            <>
              <h1>That did not go through.</h1>
              <p className="lede">
                Nothing was stored and nothing will be sent. The usual reason is an email address
                with a typo in it. Go back to the page you were on and try again, or write to{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> and ask for it there.
              </p>
            </>
          ) : (
            <>
              <h1>It is on its way.</h1>
              <p className="lede">
                The one-pager goes to the address you gave, usually within a few minutes. If it has
                not arrived, check spam. The page you were reading is complete without it, so there
                is nothing to wait for.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container container--narrow">
          <Breadcrumbs trail={[{ name: 'One-pager requested', path: '/one-pager-sent' }]} />

          <div className="prose">
            {!failed && (
              <>
                <h2>What follows it</h2>
                <ul>
                  <li>
                    <strong>Two short notes, then nothing.</strong> One about four days from now on
                    what a first session is actually like, and one about eleven days from now, which
                    is the last. There is no newsletter, and nothing after those two.
                  </li>
                  <li>
                    <strong>One-click unsubscribe on each of them.</strong> One click stops them; no
                    sign-in and no preference page.
                  </li>
                  <li>
                    <strong>They stop on their own</strong> if you write to the practice or book a
                    consultation, so nothing arrives underneath a real conversation.
                  </li>
                  <li>
                    <strong>No client record was created.</strong>{' '}
                    <Link href="/privacy">Privacy and confidentiality</Link> sets out what is kept
                    and for how long.
                  </li>
                </ul>
              </>
            )}

            <h2>If you would rather talk it through</h2>
            <p>
              A free 15-minute consultation by secure video is the next step, and it carries no
              obligation to book anything afterwards. The calendar shows real open times.
            </p>
            <NextConsultLine location="lead-sent" />
          </div>
        </div>
      </section>

      <CounsellorCards
        counsellors={counsellorsForInfoPage({})}
        location="counsellor-lead-sent"
        heading="Who you would talk to"
        intro="Taking new clients and seeing people across BC by secure video. Each is a Registered Clinical Counsellor; the registration is on the profile and can be checked on the BCACC register."
      />

      <section className="section">
        <div className="container container--narrow">
          <div className="prose">
            <h2>If you need something sooner</h2>
            <p>
              This practice does not do crisis work and there is no on-call line. If you are in
              immediate danger call <strong>911</strong>. For urgent mental-health support in BC at
              any hour, call or text <strong>9-8-8</strong>, or call <strong>310-6789</strong>.{' '}
              <Link href="/resources/bc-crisis-and-support-directory">
                The BC crisis and support directory
              </Link>{' '}
              lists what is available around the clock.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

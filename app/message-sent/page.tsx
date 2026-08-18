import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';

/* The confirmation for the sitewide "ask instead" form.
 *
 * It exists as its own page for a structural reason rather than a design one:
 * the form appears on ~94 statically generated pages, and a page cannot show a
 * "your message arrived" banner without reading a query parameter, which opts
 * it out of static generation. Making 94 pages dynamic to render one banner is
 * a bad trade, so the banner gets a page.
 *
 * It is noindex because it is a destination reached only by posting a form.
 * Indexed, it would surface in results as a page promising a reply to a message
 * the searcher never sent.
 *
 * The copy does one job beyond confirming: it says what will NOT happen. The
 * unspoken worry after writing to a counselling practice for the first time is
 * being pursued — added to a list, chased, sold to. The practice already
 * behaves well here by design. This is the one moment it is worth saying so.
 */

const TITLE = 'Your message has arrived';
const DESC = 'Confirmation that your message reached Westpeak Wellness.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}/message-sent` },
};

export default function MessageSentPage() {
  return (
    <div>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--narrow">
          <p className="eyebrow">Message sent</p>
          <h1>That&rsquo;s arrived.</h1>
          <p className="lede">
            Writing the first message is the part most people find hardest, and it is done.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container container--narrow">
          <Breadcrumbs trail={[{ name: 'Message sent', path: '/message-sent' }]} />

          <div className="prose">
            <h2>What happens now</h2>
            <ul>
              <li>
                <strong>A reply within one business day</strong>, written by your counsellor
                rather than an assistant or an automated system. This is a solo practice, so the
                person who reads your message is the person you would be working with.
              </li>
              <li>
                <strong>A copy is in your inbox</strong>, so you have a record of what you sent.
                Check spam if it has not appeared within a few minutes.
              </li>
              <li>
                <strong>The reply will be a real answer</strong> — including, where it is the
                honest one, that this practice is not the right fit and where to look instead.
                That happens reasonably often and it is a good outcome rather than a failed one.
              </li>
            </ul>

            <h2>What will not happen</h2>
            <ul>
              <li>
                <strong>You will not be added to a mailing list.</strong> Writing a message is
                not consent to be marketed to, and the practice treats it that way.
              </li>
              <li>
                <strong>Nobody will chase you.</strong> There is no follow-up sequence attached
                to an enquiry and no second attempt if you decide not to reply. If you read the
                answer and change your mind, that is entirely fine and it is the end of it.
              </li>
              <li>
                <strong>No client record was created.</strong> Your message is held to be read
                and answered, and nothing more.{' '}
                <Link href="/privacy">Privacy and confidentiality</Link> sets out exactly what is
                kept and for how long.
              </li>
            </ul>

            <h2>If you need something before then</h2>
            <p>
              A reply within one business day is not fast enough for an emergency, and this
              practice does not do crisis work — sessions are scheduled and there is no on-call
              line. If you are in immediate danger call <strong>911</strong>. For urgent
              mental-health support in BC at any hour, call or text <strong>9-8-8</strong>, or
              call <strong>310-6789</strong>.{' '}
              <Link href="/resources/bc-crisis-and-support-directory">
                The BC crisis and support directory
              </Link>{' '}
              lists what is available around the clock and what each service actually does.
            </p>

            <h2>While you wait</h2>
            <p>
              Nothing here needs reading, and there is no next step to complete.{' '}
              <Link href="/answers">Short answers to the questions people ask most</Link> covers
              cost, coverage and what a first session involves.{' '}
              <Link href="/pricing">Fees and coverage</Link> sets out what sessions cost and what
              BC extended health plans typically reimburse. And{' '}
              <Link href="/guides/what-to-expect-first-therapy-session">
                what happens in a first session
              </Link>{' '}
              is the one most people read before deciding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

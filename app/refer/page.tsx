import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import CtaBand from '@/components/CtaBand';
import LeadCapture from '@/components/LeadCapture';

export const metadata: Metadata = {
  title: 'Passing on a counsellor’s details',
  description:
    'How to pass Westpeak Wellness on to someone who is looking for a counsellor in BC, what to send, and what this practice will never ask you for.',
  alternates: { canonical: `${site.domain}/refer` },
};

/* WHY THIS PAGE EXISTS, AND WHY IT DID NOT UNTIL NOW
 *
 * BCACC prohibits testimonials. That rule has been applied across this project
 * — by me as much as anyone — as though it also prohibited referrals, and it
 * does not. The two are different things:
 *
 *   A testimonial is a client's endorsement, published as marketing. The
 *   problem is the asking: somebody inside a therapeutic relationship is not
 *   positioned to freely decline, so consent cannot be clean. See
 *   lib/reviews.ts, which ships empty for exactly this reason.
 *
 *   A referral is one person telling another person a name. Nothing is
 *   published, nothing is used as marketing, and the practice never learns who
 *   said what to whom.
 *
 * Word of mouth is how most counselling practices actually fill, and this one
 * had no mechanism for it at all — no page, no link, nothing in the portal.
 * That was a real cost, paid for a rule that was never in the book.
 *
 * WHAT THIS PAGE MUST NOT BECOME
 *
 * No incentive. Not a discount, not a free session, not a credit. Paying for
 * referrals turns a personal recommendation into a transaction the recipient
 * cannot see, and in a health context that is a straightforward conflict of
 * interest — the referrer now has a financial reason to recommend, and the
 * person receiving it does not know. It is also the fastest possible route to
 * a complaint. If someone proposes adding one later, this paragraph is the
 * argument against it.
 *
 * No tracking. No referral codes, no "who sent you" field on the booking form.
 * A client should be able to pass on a name without the practice learning that
 * they did, because the alternative means anyone who refers is identifiable as
 * a client to anyone who reads the analytics.
 */
/* Reads one query parameter so the one-pager confirmation appears in place
 * rather than on a separate page. That opts this route out of static
 * generation, which is an acceptable trade for ONE page and would not be for
 * the ~94 that carry the sitewide ask form. */
export default function ReferPage({ searchParams }: { searchParams?: { lead?: string } }) {
  const sent = searchParams?.lead;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--narrow">
          <p className="eyebrow">Passing it on</p>
          <h1>If someone you know is looking.</h1>
          <p className="lede">
            The practice has openings. If you know someone trying to find a counsellor in BC,
            here is what is useful to send them, and what you will never be asked for.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 30 }}>
        <div className="container container--narrow">
          <Breadcrumbs trail={[{ name: 'Passing it on', path: '/refer' }]} />

          <div className="prose">
            {/* A referrer's real question is "if this goes wrong, what recourse
                does the person I sent have". This diagram answers it directly,
                and none of the four routes needs the counsellor's cooperation. */}
            <Figure name="accountability-chain" />

            <h2>What you will never be asked for</h2>
            <p>
              <strong>A review, a testimonial, or a rating.</strong> Not now and not later, and
              not if you stop being a client. The BC Association of Clinical Counsellors
              prohibits it, and the reason is a good one: somebody in a counselling relationship
              is not in a position to freely say no to their counsellor asking for a favour, so
              consent to be used as marketing cannot really be given. That is why there are no
              reviews anywhere on this site and why there never will be.
            </p>
            <p>
              Passing a name to a friend is a completely different thing. Nothing is published,
              nothing is used as advertising, and the practice does not find out who told whom.
            </p>

            <h2>There is no reward, deliberately</h2>
            <p>
              No discount, no free session, no credit. If a recommendation came with something
              in it for the person making it, the person receiving it would have no way of
              knowing that, and for a health service that is a conflict of interest rather than
              a growth tactic. A recommendation is worth something precisely because there is
              nothing behind it.
            </p>

            <h2>What is actually useful to send</h2>
            <p>
              Most people looking for a counsellor stall on the same three questions. These are
              the pages that answer them, and any one of them is a better thing to send than a
              home page:
            </p>
            <ul className="checklist">
              <li>
                <strong>&ldquo;What does it cost, and will my benefits cover it?&rdquo;</strong>{' '}
                <Link href="/pricing">Fees and coverage</Link>, with the questions to ask an
                insurer before booking anything.
              </li>
              <li>
                <strong>&ldquo;What actually happens?&rdquo;</strong>{' '}
                <Link href="/guides/what-to-expect-first-therapy-session">
                  What to expect in a first session
                </Link>{' '}
, for someone who has never done this before.
              </li>
              <li>
                <strong>&ldquo;Is it even worth booking?&rdquo;</strong>{' '}
                <Link href={site.bookingPath}>The free 15-minute consultation</Link>. No card, no
                intake form, and deciding not to continue is a normal outcome.
              </li>
              <li>
                <strong>Someone who would rather work in Punjabi</strong>, {' '}
                <Link href="/punjabi" lang="pa" hrefLang="pa">
                  ਪੰਜਾਬੀ ਵਿੱਚ
                </Link>
                , or the English page on{' '}
                <Link href="/services/punjabi-counselling">Punjabi-speaking counselling</Link>.
              </li>
            </ul>

            <h2>If it turns out not to be a fit</h2>
            <p>
              That is a perfectly good outcome and worth saying to whoever you pass this to.
              This practice is virtual only, works with adults, and does not do assessments,
              diagnoses, court-related work or crisis response. The full list is on{' '}
              <Link href="/standards">standards and scope</Link>. Where it is not the right
              place, saying so and pointing somewhere better is the normal result of a
              consultation, not a failure of one.
            </p>
            <p>
              If cost is the barrier for them,{' '}
              <Link href="/resources/low-cost-counselling-bc">
                free and low-cost counselling in BC
              </Link>{' '}
              is a real list rather than a gesture, and worth sending on its own.
            </p>

            <h2>If the person wants their doctor in the loop</h2>
            <p>
              No referral is needed to see a counsellor in BC, a point worth making early,
              because plenty of people wait months for a permission nobody was ever going to be
              asked for. Where somebody does want their GP involved, about medication, a leave or
              an assessment,{' '}
              <Link href="/refer/doctor">the one-page summary to take to a doctor</Link> is
              written to be printed and handed over: designation, scope limits, fees, and how
              information sharing works.
            </p>

            <h2>Routes where somebody else pays</h2>
            <p>
              Cost is the most common reason a recommendation goes nowhere, and a surprising
              amount of counselling in British Columbia is funded by somebody other than the
              person attending. Most people do not know these exist, which makes them worth
              mentioning when you pass something on.
            </p>
            <ul>
              <li>
                <strong>After a motor vehicle crash, ICBC.</strong> Anyone injured in a crash
                in BC is pre-approved for <strong>twelve counselling sessions</strong> with a
                Registered Clinical Counsellor in the first twelve weeks, and{' '}
                <strong>no doctor&rsquo;s note is required</strong> to start. This is the single most
                underused entitlement in the province. It does not need a lawyer, and using it
                does not commit anybody to a claim decision.
              </li>
              <li>
                <strong>Through an employer, EAP.</strong> Most mid-size and large Canadian
                employers carry an employee assistance programme covering a set number of
                sessions at no cost to the employee, usually without the employer being told
                who used it. Worth checking before assuming there is no coverage.
              </li>
              <li>
                <strong>Extended health.</strong> Many BC plans reimburse a Registered Clinical
                Counsellor specifically, and a good number now direct-bill.{' '}
                <Link href="/resources/bc-extended-health-coverage-for-counselling">
                  what BC extended health plans actually cover
                </Link>{' '}
                sets out how to check a plan in about five minutes, and{' '}
                <Link href="/tools/therapy-cost-bc">the cost estimator</Link> does the
                arithmetic once the numbers are known.
              </li>
              <li>
                <strong>After a crime, the Crime Victim Assistance Program.</strong> CVAP
                funds counselling for victims of violent crime, and for immediate family
                members in some circumstances. It funds a course of treatment rather than a
                handful of sessions.
              </li>
              <li>
                <strong>First Nations and Inuit clients.</strong> The First Nations Health
                Authority and the federal Non-Insured Health Benefits programme both cover
                mental-health counselling and both maintain approved-provider lists.
              </li>
            </ul>
            <p>
              Not every route above is one this practice is currently on a panel for, and it is
              worth asking rather than assuming in either direction. But the point of listing
              them is broader than this practice: if the person you are thinking of is not
              going to see anybody at all because of what it costs, one of these five is
              usually the reason that assumption is wrong.
            </p>

            {/* The ICBC entitlement is the single most underused funded route
                in the province, and this is the page where somebody is already
                thinking about how to help another person pay for counselling. */}
            <LeadCapture magnet="icbc-after-a-crash" done={sent === 'ok'} />

            <h2>If you are in crisis right now</h2>
            <p>
              This is not the page for that, and nor is this practice, sessions are scheduled
              and there is no on-call line. If you are in immediate danger call{' '}
              <strong>9-1-1</strong>. For urgent mental-health support in BC at any hour, call or
              text <strong>9-8-8</strong>, or call <strong>310-6789</strong>, no area code
              needed.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

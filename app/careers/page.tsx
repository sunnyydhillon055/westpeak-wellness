import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef } from '@/lib/schema';
import { openJobs, jobs, APPLY_EMAIL } from '@/lib/careers';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';

const TITLE = 'Counselling Jobs BC — Remote RCC Careers | Westpeak Wellness';
const DESC =
  'Remote counselling jobs across British Columbia — part-time RCC and therapist roles, work from home, referrals provided, keep 70%. Current openings and how to apply.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/careers` },
  openGraph: { title: TITLE, description: DESC, url: `${site.domain}/careers` },
};

/* The careers hub.
 *
 * Deliberately not a single page carrying the posting inline: Google for Jobs
 * requires one JobPosting per URL, so this hub carries an ItemList pointing at
 * the individual postings and none of the JobPosting markup itself.
 *
 * It is written to be useful when there is nothing open, because that is most
 * of the time, and a careers page that 404s or reads "no vacancies" between
 * hires loses the ranking it spent months earning.
 */
export default function CareersPage() {
  const open = openJobs();

  /* The questions counsellors actually type before applying.
   *
   * These are not padding. FAQPage markup is eligible for rich results and is
   * heavily used by answer engines, and each of these is a real long-tail query
   * ("is counselling work employee or contractor BC", "do I need my own
   * liability insurance as an RCC"). The JobPosting lives on the posting page,
   * so the FAQ lives here — Google will pick one rich-result type per page and
   * putting them on separate URLs means both get their own chance. */
  const faqs: { q: string; a: string }[] = [
    {
      q: 'Is this an employee position or a contract?',
      a: 'It is an independent contractor arrangement. You invoice the practice, you handle your own taxes, you set your own availability, and you are free to see clients elsewhere. That independence is real rather than a formality — it is why it is a contract and not a job.',
    },
    {
      q: 'Do I need to bring my own clients?',
      a: 'No. Referrals come to you, and finding clients is not part of the role at any point. There is no expectation that you market yourself.',
    },
    {
      q: 'How much does the practice keep?',
      a: 'Thirty percent. You keep seventy percent of every session fee, and nothing else is deducted — no lease, no software subscription, no admin or marketing fee. At current fees that works out to $98 for a 50-minute individual session and $119 for couples.',
    },
    {
      q: 'Do I need my own liability insurance?',
      a: 'Yes. Professional liability insurance is yours to hold, along with your BCACC registration and your clinical supervision. The practice provides the referrals, the software, the scheduling, the invoicing and the payment processing.',
    },
    {
      q: 'Can I do this part-time alongside other work?',
      a: 'Yes, and most people will. The role is 5 to 25 hours a week and you set them. Starting with four or five clients while keeping other work is a normal way to begin, and staying part-time permanently is a perfectly good answer.',
    },
    {
      q: 'Are newly registered RCCs considered?',
      a: 'Yes. If you have just completed your registration and you are good at this, please apply. A manageable caseload with referrals provided and no overhead is a reasonable way to start out in private practice.',
    },
    {
      q: 'Do I need to live in Vancouver or the Lower Mainland?',
      a: 'No. The practice is entirely virtual, so you can be anywhere in British Columbia. Counsellors outside the Lower Mainland often find virtual practice removes the population limit of a smaller community.',
    },
    {
      q: 'Is EMDR or Gottman training required?',
      a: 'Neither is required. Both are useful and both would be welcome, but the requirements are current RCC registration in good standing, your own liability insurance, and genuine competence working by video.',
    },
    {
      q: 'What are the hours like?',
      a: 'Between 5 and 25 hours a week, entirely self-scheduled. Evening availability is the most useful, because that is when most clients ask to be seen, but it is not a condition.',
    },
    {
      q: 'What is the salary or pay for this counselling job?',
      a: 'You keep 70% of every session fee, which works out to $95–$120 per clinical hour: $98 for a 50-minute individual session and $119 for a couples session. Ten sessions a week is roughly $980; twenty is roughly $1,960. There is no tier system and no minimum you have to hit before the 70% applies. As a contractor, tax and your own insurance and supervision come out of that.',
    },
    {
      q: 'Is this a work-from-home counselling job?',
      a: 'Yes, entirely. Every session runs by secure video and there is no office to attend. All you need is a private room, a reliable connection and your BC registration. Counsellors work from Vancouver, Surrey, Victoria, Kelowna, Kamloops, Prince George and everywhere between.',
    },
    {
      q: 'Do I need telehealth or online therapy experience?',
      a: 'You need genuine competence delivering therapy by video rather than a specific certificate. If your practice moved online in recent years and you found it worked, that is the experience being asked about.',
    },
    {
      q: 'How quickly would my caseload fill?',
      a: 'A caseload builds rather than arrives, and anyone promising you a full one in month one is guessing. Referrals are passed on as they come in, at the pace your availability allows. This is why the role starts at 5 hours a week rather than assuming a full schedule.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${site.domain}/careers#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${site.domain}/careers#page`,
    name: 'Careers at Westpeak Wellness',
    description: DESC,
    url: `${site.domain}/careers`,
    isPartOf: { '@id': `${site.domain}/#website` },
    about: orgRef,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: open.map((j, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: j.title,
        url: abs(`/careers/${j.slug}`),
      })),
    },
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Careers</p>
          <h1>Counselling jobs in BC — remote, part-time, yours to schedule</h1>
          <p className="lede">
            Work-from-home counselling roles for Registered Clinical Counsellors anywhere in
            British Columbia. You keep <strong>70% of every session fee</strong>, referrals come
            to you, and there is no overhead of any kind.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs trail={[{ name: 'Careers', path: '/careers' }]} />

          <h2>Open roles</h2>
          {open.length === 0 ? (
            <>
              <p>
                There is nothing open at the moment. That changes as the practice grows, and it
                changes without much notice.
              </p>
              <p>
                If you are a Registered Clinical Counsellor in BC and this sounds like the kind
                of arrangement you want, write to{' '}
                <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a> anyway. I keep the notes and
                I read them first when something opens.
              </p>
            </>
          ) : (
            <ul className="job-list">
              {open.map((j) => (
                <li key={j.slug}>
                  <h3>
                    <Link href={`/careers/${j.slug}`}>{j.title}</Link>
                  </h3>
                  <p>{j.summary}</p>
                  <p>
                    <Link className="btn btn--ghost" href={`/careers/${j.slug}`}>
                      Read the full posting &rarr;
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p>
            Depending where you have been searching, this kind of work gets listed under a
            handful of different names — <strong>counsellor job</strong>,{' '}
            <strong>therapist job</strong>, <strong>RCC job</strong>,{' '}
            <strong>associate counsellor</strong>, <strong>psychotherapist</strong>, or just a{' '}
            <strong>mental health job</strong> in British Columbia — an <strong>online counselling job</strong>, a <strong>virtual counselling job</strong>, a <strong>clinical counsellor job</strong>. It is all the same role. What
            is on offer here is remote counselling work, <strong>part time</strong> if that is what
            you want, <strong>work from home</strong>, on a <strong>fee split</strong> rather than
            a wage — and a <strong>counselling career</strong> you can grow at your own pace
            instead of inheriting someone else&rsquo;s schedule.
          </p>

          <h2>What working here is actually like</h2>
          <p>
            Westpeak Wellness is a virtual counselling practice serving adults throughout British
            Columbia. Every session runs by secure video. There is no office, no commute and no
            catchment area, which means a counsellor in Kamloops and a counsellor in Victoria have
            exactly the same practice.
          </p>
          <p>
            The arrangement is deliberately narrow: you do clinical work, and the practice does
            everything else. Referrals come to you. Payment is taken when the client books and
            receipts issue automatically, so you will never send an invoice or ask anyone for
            money. There is no lease, no software subscription and nothing deducted for
            &ldquo;marketing&rdquo; or &ldquo;admin&rdquo;.
          </p>

          <Figure name="bc-reach" />

          <h2 id="compare">Agency, solo private practice, or here</h2>
          <p>
            Most counsellors in BC are choosing between three ways of working, and each trades
            something away. Setting them side by side is more useful than a list of perks:
          </p>
          <div className="table-scroll">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col">Agency or clinic</th>
                  <th scope="col">Your own private practice</th>
                  <th scope="col">Here</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Finding clients</th>
                  <td>Done for you</td>
                  <td>Entirely on you — the hardest part</td>
                  <td>Done for you</td>
                </tr>
                <tr>
                  <th scope="row">What you keep</th>
                  <td>Typically 40–60%</td>
                  <td>100%, minus every cost</td>
                  <td><strong>70%, nothing deducted under it</strong></td>
                </tr>
                <tr>
                  <th scope="row">Overhead</th>
                  <td>None</td>
                  <td>Lease, software, payments, website</td>
                  <td><strong>None</strong></td>
                </tr>
                <tr>
                  <th scope="row">Who sets your hours</th>
                  <td>Usually the clinic</td>
                  <td>You</td>
                  <td><strong>You</strong></td>
                </tr>
                <tr>
                  <th scope="row">Minimum caseload</th>
                  <td>Usually yes</td>
                  <td>No</td>
                  <td><strong>No</strong></td>
                </tr>
                <tr>
                  <th scope="row">Admin and invoicing</th>
                  <td>Handled</td>
                  <td>Yours, and it is relentless</td>
                  <td><strong>Handled</strong></td>
                </tr>
                <tr>
                  <th scope="row">Notice to leave</th>
                  <td>Contractual</td>
                  <td>n/a</td>
                  <td>Finish your clients well; that is all</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            The honest summary: this is closest to private practice with the two hardest parts
            removed — finding clients, and running the business around them. What you give up for
            that is the 30%.
          </p>

          <h2>Who this tends to suit</h2>
          <ul>
            <li>
              <strong>Counsellors building a private caseload</strong> alongside agency or
              contract work, who want referrals without the overhead of running a practice
            </li>
            <li>
              <strong>Newly registered RCCs</strong> who want a manageable start rather than being
              handed forty clients in a month
            </li>
            <li>
              <strong>Experienced counsellors outside the Lower Mainland</strong>, for whom
              virtual practice removes the population limit of a small town
            </li>
            <li>
              <strong>Anyone who wants genuinely part-time work</strong> and is tired of being
              told that is not a real answer
            </li>
          </ul>

          <h2>What the practice will not ask of you</h2>
          <p>
            Worth stating plainly, because these are the things counsellors most often find out
            after signing:
          </p>
          <ul>
            <li>No sourcing your own clients, and no expectation that you market yourself</li>
            <li>No minimum caseload, no quota, and no packages to sell</li>
            <li>No crisis line, no on-call and no after-hours — this is a scheduled practice</li>
            <li>No in-person requirement, ever</li>
            <li>
              No client testimonials. Soliciting them from counselling clients is prohibited under
              BCACC advertising standards, and{' '}
              <Link href="/reviews">this practice does not do it</Link> in any form
            </li>
          </ul>

          <h2 id="where">Counselling jobs across every region of BC</h2>
          <p>
            Because this is remote counselling work, where you live does not narrow what is
            available to you. Counsellors are welcome from:
          </p>
          <ul>
            <li>
              <strong>Metro Vancouver</strong> — Vancouver, Surrey, Burnaby, Richmond, Coquitlam,
              Langley, New Westminster, North Vancouver
            </li>
            <li>
              <strong>Fraser Valley</strong> — Abbotsford, Chilliwack, Mission, Maple Ridge
            </li>
            <li>
              <strong>Vancouver Island</strong> — Victoria, Nanaimo, Courtenay, Campbell River,
              Duncan
            </li>
            <li>
              <strong>Okanagan and Interior</strong> — Kelowna, Vernon, Penticton, Kamloops,
              Cranbrook, Nelson
            </li>
            <li>
              <strong>Northern BC</strong> — Prince George, Terrace, Fort St. John, Dawson Creek
            </li>
          </ul>
          <p>
            If you practise outside the Lower Mainland, that last point matters more than it
            looks. Virtual practice removes the ceiling that local population puts on a caseload —
            you are no longer limited to people who can drive to you, and a full week&rsquo;s work
            stops depending on the size of your town. Several of this practice&rsquo;s clients
            live somewhere with no counsellor at all within an hour.
          </p>

          <h2>How hiring works here</h2>
          <p>
            You email, I read it myself, and I reply — including when the answer is no. If there
            is a fit we talk by video, and I will tell you what the caseload actually looks like
            rather than what I hope it will look like. Registration is verified against the BCACC
            register before anything is agreed, the same way{' '}
            <Link href="/resources/verify-a-counsellor-in-bc">clients are told to verify mine</Link>.
          </p>
          <p>
            If you want to understand the practice before applying, the{' '}
            <Link href="/services">services</Link> pages describe the work, the{' '}
            <Link href="/pricing">fees page</Link> shows what clients pay, and{' '}
            <Link href="/standards">standards and accountability</Link> sets out the ethical
            framework everything runs inside.
          </p>

          <h2 id="questions">Questions counsellors ask before applying</h2>
          <dl className="faq-list">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>

          <p>
            Anything not answered here — write to{' '}
            <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a> and ask. Questions before
            applying are welcome and they do not count against you.
          </p>
        </div>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([listSchema, faqSchema]) }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef } from '@/lib/schema';
import { openJobs, jobs, APPLY_EMAIL } from '@/lib/careers';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';

const TITLE = 'Counselling Jobs in BC — Careers | Westpeak Wellness';
const DESC =
  'Remote counselling jobs across British Columbia. Contract RCC roles with referrals provided, no overhead and hours you set yourself. Current openings and how to apply.';

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
          <h1>Counselling jobs at Westpeak Wellness</h1>
          <p className="lede">
            Remote counselling work across British Columbia — referrals provided, no overhead,
            and a schedule you set yourself.
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

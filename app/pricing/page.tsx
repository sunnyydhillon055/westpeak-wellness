import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import { Wallet, Video, CreditCard, CalendarX } from 'lucide-react';
import Figure from '@/components/Figure';
import LeadCapture from '@/components/LeadCapture';
import Breadcrumbs from '@/components/Breadcrumbs';
import { readCatalog, money, type CatalogItem } from '@/lib/cliniko-catalog';

export const metadata: Metadata = {
  title: 'Fees & Insurance',
  description:
    'Counselling fees in line with BCACC guidelines. Reimbursable through most BC extended health plans that cover Registered Clinical Counsellors.',
  alternates: { canonical: `${site.domain}/pricing` },
};

/* Revalidate hourly so a price changed in Cliniko reaches this page without a
 * redeploy. The nightly cron refreshes the cached catalogue; this decides how
 * quickly the rendered page picks that up. */
export const revalidate = 3600;

/* Display order and labels. Cliniko returns types in its own order with its own
 * names, and the fee table has always read "Individual" rather than "Individual
 * Counselling". Mapping here keeps the copy while the numbers come from
 * Cliniko — the numbers are what must never drift, not the wording. */
const ROWS: { clinikoName: string; label: string; highlight?: boolean }[] = [
  { clinikoName: 'Initial Consultation', label: 'Free initial consult' },
  { clinikoName: 'Individual Counselling', label: 'Individual', highlight: true },
  { clinikoName: 'Couples Counselling', label: 'Couples' },
  { clinikoName: 'Couples Extended', label: 'Couples extended' },
  { clinikoName: 'EMDR Intensive', label: 'EMDR intensive' },
];

export default async function Pricing({ searchParams }: { searchParams?: { lead?: string } }) {
  const catalog = await readCatalog();
  const find = (n: string): CatalogItem | undefined =>
    catalog.items.find((i) => i.name.toLowerCase() === n.toLowerCase());

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Fees & insurance</p>
          <h1>Clear, fair, accessible.</h1>
          <p className="lede">No hidden fees, no packages, and no surprises on the invoice.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a Free Consultation</Link>
            <Link className="btn btn--ghost" href="/resources/bc-extended-health-coverage-for-counselling">Check your coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Fees', path: '/pricing' }]} />
          <h2>Session fees</h2>
          <p className="lede" style={{ marginBottom: 20 }}>In line with BC Association of Clinical Counsellors guidelines.</p>
          <table className="fee-table">
            <thead><tr><th>Session</th><th>Length</th><th>Fee (CAD)</th></tr></thead>
            <tbody>
              {ROWS.map((r) => {
                const item = find(r.clinikoName);
                /* A row whose Cliniko type has vanished is dropped rather than
                   rendered with a guess. Showing a stale fee is the failure
                   this whole change exists to prevent. */
                if (!item) return null;
                return (
                  <tr key={r.clinikoName} className={r.highlight ? 'fee-highlight' : undefined}>
                    <td>{r.label}</td>
                    <td>{item.minutes} min</td>
                    <td>{money(item.cents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>GST does not apply to RCC counselling in BC.</p>

          <div className="prose" style={{ marginTop: 36 }}>
            <h2>What you are actually paying for</h2>
            <div className="fee-callout">
              <Wallet aria-hidden="true" strokeWidth={1.7} />
              <div>
            <p>
              A 50-minute session is not 50 minutes of work. It includes preparation before, notes and
              planning after, ongoing continuing education, professional liability insurance, and the
              supervision and registration requirements that come with holding the{' '}
              <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">Registered Clinical Counsellor designation</Link>.
              These fees sit within the range the BC Association of Clinical Counsellors publishes as
              guidance, and they are in line with what most RCCs across the province charge.
            </p>
            <p>
              For comparison, a registered psychologist in BC typically charges considerably more — often
              close to double — because of a longer training path and a broader scope that includes formal
              assessment. That difference matters most if your benefit cap is limited: the same annual
              maximum buys roughly twice as many sessions here.
            </p>

              </div>
            </div>
            <h2>If the fee is a barrier</h2>
            <p>
              Private therapy is not the only route, and it is not always the right first one. BC has a
              substantial amount of free and low-cost support that people frequently do not know about:
              health authority mental-health services, Foundry for anyone under 25, Here2Talk for
              post-secondary students, employee assistance programs through work, and university training
              clinics offering supervised sessions at reduced rates.
            </p>
            <p>
              All of that is set out on the{' '}
              <Link href="/resources/low-cost-counselling-bc">free and low-cost counselling page</Link>,
              and for a lot of people one of those options is genuinely the better place to start. Saying
              so on a{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> is a perfectly good outcome
              of that call.
            </p>

            <h2>Where to read next</h2>
            <p>
              If you are weighing whether this is affordable at all,{' '}
              <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
              <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
              are the two worth reading first, because a great many people already hold a free
              entitlement they have never used. If you are on a public waitlist,{' '}
              <Link href="/guides/waiting-for-therapy-in-bc">what to do while you wait</Link> covers
              the interval.
            </p>
            <p>
              On what the money buys: <Link href="/about">about the practice</Link> sets out the
              training behind a session, <Link href="/standards">standards and accountability</Link>{' '}
              states the scope limits and the complaints route, and{' '}
              <Link href="/resources/verify-a-counsellor-in-bc">how to verify a registration</Link>{' '}
              takes about four minutes and is worth doing before paying anyone, here included.
            </p>
            <p>
              On frequency and length — the two things that actually determine total cost —{' '}
              <Link href="/compare/weekly-vs-biweekly-sessions">weekly vs biweekly sessions</Link>{' '}
              and <Link href="/guides/how-long-does-therapy-take">how long therapy takes</Link>{' '}
              are more useful than the per-session number on its own. And if what you need is a
              formal assessment rather than counselling,{' '}
              <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
              explains why that is priced completely differently.
            </p>

            <SceneBand seed={'pricing'} />

          <h2>How coverage works</h2>
            <p>
              BC&rsquo;s Medical Services Plan does not cover private counselling, whatever the
              practitioner&rsquo;s designation — the reasons are explained in the{' '}
              <Link href="/resources/msp-vs-extended-health">comparison of MSP and extended health</Link>.
              What most people use instead is an extended health plan through work.
            </p>
            <p>
              The critical detail: plans list <em>professions</em>, not services. Some cover
              &ldquo;Registered Clinical Counsellor&rdquo; and some list only psychologists and social
              workers, in which case sessions here are not reimbursable no matter how clearly they are
              counselling. Check that wording before your first session — it is the single most common
              source of unpleasant surprises, and the{' '}
              <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage page</Link>{' '}
              sets out exactly what to look for and what a claimable receipt must contain.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="grid grid-2">
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><Video strokeWidth={1.6} /></span>
              <div>
                <h3>Free consultation</h3>
                <p style={{ marginBottom: 0 }}>Every working relationship starts with a free 15-minute call. No charge, and no obligation to book a session afterward.</p>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><Wallet strokeWidth={1.6} /></span>
              <div>
                <h3>Extended health</h3>
                <p>Most BC plans that cover RCCs reimburse, including:</p>
                <ul className="checklist" style={{ marginBottom: 12 }}>
                  <li>Pacific Blue Cross</li><li>Manulife</li><li>Sun Life</li><li>Canada Life</li><li>Green Shield</li>
                </ul>
                <p style={{ marginBottom: 0, fontSize: '.94rem', color: 'var(--ink-faint)' }}>
                  Pay at session time and submit your receipt for reimbursement.
                </p>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><CreditCard strokeWidth={1.6} /></span>
              <div>
                <h3>Payment</h3>
                <ul className="checklist" style={{ marginBottom: 0 }}>
                  <li>E-transfer (preferred)</li><li>Credit card (Visa, MC, Amex)</li>
                </ul>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><CalendarX strokeWidth={1.6} /></span>
              <div>
                <h3>Cancellation</h3>
                <p style={{ marginBottom: 0 }}>24 hours&rsquo; notice. Late cancels or no-shows are charged the full fee. Exceptions for genuine emergencies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose">
          <p className="eyebrow">How payment works</p>
          <h2>Paying, and then claiming it back</h2>
          <p>
            This practice does not direct-bill. You pay at the time of the session and receive a
            receipt showing the RCC registration number, which is what an insurer needs to reimburse
            you. Whether your plan covers a Registered Clinical Counsellor is worth confirming before
            you book &mdash; see <a href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</a>.
          </p>
          <p>
            Sessions are paid by credit card when you book rather than at the end of the hour, and
            cancellation is free up to 24 hours beforehand. The{' '}
            <a href="/client-portal">client portal</a> covers how that works, what happens inside
            the 24-hour window, and where your receipts appear.
          </p>
          <Figure name="reimbursement-flow" />

          <LeadCapture done={searchParams?.lead === 'ok'} />

          <p>
            Want the arithmetic on your own plan? The{' '}
            <Link href="/tools/therapy-cost-bc">cost and coverage estimator</Link>{' '}
            works out what you would actually pay after reimbursement, and names the two
            questions to ask your insurer before booking.
          </p>
        </div>
      </section>

      <CtaBand heading="Questions about fees?" text="Ask during your free 15-minute consultation." />

      {/* FAQPage for the four cards above.
        *
        * The site carries FAQPage markup on 86 pages, and this — the page people
        * arrive at with the most specific questions — was not one of them.
        * Every answer below is the visible card copy rather than a variant
        * written for the markup: schema describing something other than what
        * the visitor reads is how structured data stops being trusted. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${site.domain}/pricing#faq`,
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is the first consultation free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Every working relationship starts with a free 15-minute call. There is no charge, and no obligation to book a session afterward.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does extended health insurance cover counselling in BC?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Most BC plans that cover Registered Clinical Counsellors reimburse, including Pacific Blue Cross, Manulife, Sun Life, Canada Life and Green Shield. You pay at the time of the session and submit your receipt for reimbursement. Counselling with an RCC is not covered by MSP.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I pay for a counselling session?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'By e-transfer, which is preferred, or by credit card — Visa, Mastercard or Amex.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is the cancellation policy?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '24 hours’ notice. Late cancellations or no-shows are charged the full fee, because the time was held and cannot realistically be filled at that notice. There are exceptions for genuine emergencies.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

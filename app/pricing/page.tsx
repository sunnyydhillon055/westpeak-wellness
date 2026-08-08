import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Fees & Insurance',
  description:
    'Counselling fees in line with BCACC guidelines. Reimbursable through most BC extended health plans that cover Registered Clinical Counsellors.',
  alternates: { canonical: `${site.domain}/pricing` },
};

export default function Pricing() {
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
          <p className="crumb"><a href="/">Home</a> / Fees</p>
          <h2>Session fees</h2>
          <p className="lede" style={{ marginBottom: 20 }}>In line with BC Association of Clinical Counsellors guidelines.</p>
          <table className="fee-table">
            <thead><tr><th>Session</th><th>Length</th><th>Fee (CAD)</th></tr></thead>
            <tbody>
              <tr><td>Free initial consult</td><td>15 min</td><td>$0</td></tr>
              <tr><td>Individual</td><td>50 min</td><td>$150</td></tr>
              <tr><td>Couples</td><td>50 min</td><td>$170</td></tr>
              <tr><td>Couples extended</td><td>120 min</td><td>$340</td></tr>
              <tr><td>EMDR intensive</td><td>90 min</td><td>$225</td></tr>
            </tbody>
          </table>
          <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>GST does not apply to RCC counselling in BC.</p>

          <div className="prose" style={{ marginTop: 36 }}>
            <h2>What you are actually paying for</h2>
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
            <div className="card">
              <h3>Free consultation</h3>
              <p style={{ marginBottom: 0 }}>Every working relationship starts with a free 15-minute call. No charge, and no obligation to book a session afterward.</p>
            </div>
            <div className="card">
              <h3>Extended health</h3>
              <p>Most BC plans that cover RCCs reimburse, including:</p>
              <ul className="checklist" style={{ marginBottom: 12 }}>
                <li>Pacific Blue Cross</li><li>Manulife</li><li>Sun Life</li><li>Canada Life</li><li>Green Shield</li>
              </ul>
              <p style={{ marginBottom: 0, fontSize: '.94rem', color: 'var(--ink-faint)' }}>
                Pay at session time and submit your receipt for reimbursement.
              </p>
            </div>
            <div className="card">
              <h3>Payment</h3>
              <ul className="checklist" style={{ marginBottom: 0 }}>
                <li>E-transfer (preferred)</li><li>Credit card (Visa, MC, Amex)</li>
              </ul>
            </div>
            <div className="card">
              <h3>Cancellation</h3>
              <p style={{ marginBottom: 0 }}>24 hours&rsquo; notice. Late cancels or no-shows are charged the full fee. Exceptions for genuine emergencies.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Questions about fees?" text="Ask during your free 15-minute consultation." />
    </>
  );
}

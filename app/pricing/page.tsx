import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Fees & Insurance',
  description:
    'Counselling fees in line with BCACC guidelines, with sliding-scale spots available. Reimbursable through most BC extended health plans that cover RCCs.',
  alternates: { canonical: `${site.domain}/pricing` },
};

export default function Pricing() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Fees & insurance</p>
          <h1>Clear, fair, accessible.</h1>
          <p className="lede">No hidden fees. A limited number of sliding-scale spots always available.</p>
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
          <p className="lede" style={{ marginBottom: 20 }}>In line with BCACC guidelines. Sliding scale available.</p>
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
              Say so. A limited number of sliding-scale spots are kept open at all times, no proof of
              income is required, and asking is an ordinary question rather than an awkward one. The
              worst outcome is that they are currently full. The place to ask is a{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link>, which costs nothing
              either way.
            </p>
            <p>
              It is also worth knowing that private therapy is not the only route. BC has a substantial
              amount of free and low-cost support — health authority services, Foundry for under-25s,
              Here2Talk for post-secondary students, employee assistance programs, and university training
              clinics. That is all set out on the{' '}
              <Link href="/resources/low-cost-counselling-bc">free and low-cost counselling page</Link>, and
              for many people one of those is the better first step.
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
              <h3>Sliding scale</h3>
              <p style={{ marginBottom: 0 }}>A limited number of sliding-scale spots for people for whom the standard fee is a barrier. No proof of income required.</p>
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

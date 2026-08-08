import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Fees & Insurance',
  description:
    'Clear, fair counselling fees in line with BCACC guidelines. Sliding scale available. Reimbursable through most BC extended health plans that cover RCCs. No GST on RCC counselling in BC.',
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
            <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free Consultation</a>
            <Link className="btn btn--ghost" href="/faq">View FAQ</Link>
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

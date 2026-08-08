import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { faqs } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers about online counselling in BC: booking, fees, extended health coverage, Punjabi sessions, confidentiality, and what to expect.',
  alternates: { canonical: `${site.domain}/faq` },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question', name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQ() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">FAQ</p>
          <h1>Frequently asked questions</h1>
          <p className="lede">Everything you might want to know before booking. Still curious? The free consult is the best place to ask.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="crumb"><Link href="/">Home</Link> / FAQ</p>
          {faqs.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Question not answered here? Ask it on a{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> — there is no
              obligation to book a session afterward.
            </p>
          </div>

          <p style={{ marginTop: 28 }}>
            For more detail, the <Link href="/guides">counselling guides</Link> cover what therapy
            involves,{' '}
            <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage</Link>{' '}
            explains what BC plans reimburse, and{' '}
            <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">the comparison of therapist types</Link>{' '}
            covers who to see for what.
          </p>
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

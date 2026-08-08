import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { faqs } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers about online counselling in BC: booking, fees, extended health coverage, sliding scale, Punjabi sessions, confidentiality, and what to expect.',
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
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="crumb"><a href="/">Home</a> / FAQ</p>
          {faqs.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

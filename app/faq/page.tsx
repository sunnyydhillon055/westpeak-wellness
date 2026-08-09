import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { faqs, FAQ_GROUPS, faqsInGroup } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { Compass, Wallet, MessageCircleQuestion, Lock } from 'lucide-react';

const GROUP_ICON = { start: Compass, money: Wallet, sessions: MessageCircleQuestion, privacy: Lock };

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
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / FAQ</p>
          <Figure name="first-session-flow" />
          <p className="faq-intro-links">
            Several of these have a page of their own:{' '}
            <Link href="/pricing">fees and insurance</Link>,{' '}
            <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage</Link>,{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>,{' '}
            <Link href="/privacy">privacy and confidentiality</Link>,{' '}
            <Link href="/services/punjabi-counselling">counselling in Punjabi</Link>,{' '}
            <Link href="/online-counselling">how online sessions work</Link>, and{' '}
            <Link href="/resources/bc-crisis-and-support-directory">crisis support in BC</Link>.
            If a question is not answered here, <Link href="/contact">ask it directly</Link>.
          </p>

          <div className="faq-layout">
            <nav className="faq-nav" aria-label="Jump to a question group">
              <h2>On this page</h2>
              {FAQ_GROUPS.map((g) => {
                const Icon = GROUP_ICON[g.icon];
                return (
                  <a href={`#${g.key}`} key={g.key}>
                    <Icon aria-hidden="true" strokeWidth={1.7} />
                    {g.label}
                  </a>
                );
              })}
            </nav>

            <div>
              {FAQ_GROUPS.map((g) => {
                const items = faqsInGroup(g.key);
                if (!items.length) return null;
                const Icon = GROUP_ICON[g.icon];
                return (
                  <div className="faq-group" id={g.key} key={g.key}>
                    <div className="faq-group-head">
                      <span className="icon-chip icon-chip--sm" aria-hidden="true">
                        <Icon strokeWidth={1.7} />
                      </span>
                      <h2>{g.label}</h2>
                    </div>
                    {items.map((f) => (
                      <details className="faq-item" key={f.q}>
                        <summary>{f.q}</summary>
                        <p>{f.a}</p>
                      </details>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

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
            covers who to see for what. Booking, payment and the cancellation policy are set out on
            the <Link href={site.portalPath}>client portal</Link> page.
          </p>
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

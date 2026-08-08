import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CalendlyEmbed from '@/components/CalendlyEmbed';

export const metadata: Metadata = {
  title: 'Book a Free 15-Minute Consultation',
  description:
    'Book a free 15-minute consultation for online counselling anywhere in BC. No pressure, no commitment — just a chance to see if it is a good fit.',
  alternates: { canonical: `${site.domain}/book` },
  openGraph: {
    title: `Book a Free 15-Minute Consultation | ${site.name}`,
    description: 'Free 15-minute consultation for online counselling anywhere in British Columbia.',
    url: `${site.domain}/book`,
  },
};

export default function Book() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Free · 15 minutes · No commitment</p>
          <h1>Book a free consultation.</h1>
          <p className="lede">
            The first step is a short, no-pressure conversation — by phone or video, whichever
            you prefer. It costs nothing, and there is no obligation to book a session afterward.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Book</p>

          {site.bookingReady ? (
            <CalendlyEmbed url={site.bookingUrl} />
          ) : (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Online scheduling is being set up</h2>
              <p>
                The booking calendar goes live here shortly. In the meantime, email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> with a sentence about what
                you&rsquo;re looking for and a couple of times that suit you, and your
                consultation will be confirmed by reply.
              </p>
              <p style={{ marginBottom: 0 }}>
                <a className="btn btn--primary" href={`mailto:${site.email}?subject=Free%2015-minute%20consultation`}>
                  Email to book your consultation
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">What happens in the 15 minutes</p>
          <h2>No intake forms, no pressure.</h2>
          <div className="steps" style={{ marginTop: 26, maxWidth: 760 }}>
            <div className="step"><div className="step-num">1</div><div>
              <h3>You say what brought you here</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                As much or as little as you want. You do not need it organised, and you will not
                be asked to tell the whole story on a first call.
              </p>
            </div></div>
            <div className="step"><div className="step-num">2</div><div>
              <h3>You hear how the work would go</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                Which approach fits what you&rsquo;ve described, what a session looks like, and
                roughly how often people usually meet. Questions are welcome — that&rsquo;s the point
                of the call.
              </p>
            </div></div>
            <div className="step"><div className="step-num">3</div><div>
              <h3>You decide, in your own time</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
                If it feels like a fit, you can book a first session. If it doesn&rsquo;t, that is a
                completely fine outcome — and a referral in a better direction can be suggested.
              </p>
            </div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Before you book</p>
            <ul className="checklist">
              <li>Sessions are fully online, anywhere in British Columbia</li>
              <li>Available in English, Punjabi, or a mix of both</li>
              <li>Individual sessions are 50 minutes; couples sessions are 50 or 120</li>
              <li>Session fees and payment methods are set out on the <Link href="/pricing">fees page</Link></li>
              <li>Most BC extended health plans that cover RCCs will reimburse</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Not sure yet?</p>
            <p>
              If you&rsquo;d rather read first, the{' '}
              <Link href="/faq">frequently asked questions</Link> cover fees, confidentiality,
              and what a first session is actually like — or there is a full walkthrough of{' '}
              <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>.
              You can also browse{' '}
              <Link href="/services">the full list of services</Link> to see which approach
              matches what you&rsquo;re carrying, or read{' '}
              <Link href="/about">about your counsellor</Link> first.
            </p>
            <p>
              Prefer to ask a question before booking anything? The{' '}
              <Link href="/contact">contact page</Link> has an email address and a reply usually
              comes within one business day.
            </p>
            <div className="crisis" style={{ marginTop: 20 }}>
              <p style={{ margin: 0 }}>
                <strong>If you&rsquo;re in crisis:</strong> Westpeak Wellness is not a crisis
                service. Call or text <strong>9-8-8</strong> (Canada, 24/7) or BC Mental Health
                at <strong>310-6789</strong>. In immediate danger, call <strong>911</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

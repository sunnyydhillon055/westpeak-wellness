import type { Metadata } from 'next';
import Figure from '@/components/Figure';
import Link from 'next/link';
import { site } from '@/lib/site';
import SchedulerEmbed from '@/components/SchedulerEmbed';

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
            The first step is a short, no-pressure conversation over secure video. It costs
            nothing, and there is no obligation to book a session afterward.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Book</p>

          {site.bookingReady ? (
            <SchedulerEmbed url={site.bookingsUrl} title="Book a free 15-minute consultation" />
          ) : (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Online scheduling is being set up</h2>
              <p>
                The booking calendar goes live here shortly. In the meantime, email{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a> with a sentence about what
                you&rsquo;re looking for and a couple of times that suit you, and your
                consultation will be confirmed by reply.
              </p>
              <p>
                Already a client? Everything to do with sessions, payment and receipts lives
                in the <Link href={site.portalPath}>client portal</Link>.
              </p>
              {/* One row, primary first. These were two separate paragraphs,
                  which stacked them at ragged widths and put the action we
                  actually want above the fallback in source order but below it
                  on screen. */}
              <div className="btn-row" style={{ marginTop: 22 }}>
                <a className="btn btn--primary" href={`mailto:${site.email}?subject=Free%2015-minute%20consultation`}>
                  Email to book your consultation
                </a>
                <a className="btn btn--ghost" href={site.bookingsFallbackUrl} target="_blank" rel="noopener">
                  Try the booking page directly
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">What happens in the 15 minutes</p>
          <Figure name="booking-payment-flow" />

          <h2>No intake forms, no pressure.</h2>
          <Figure name="first-session-flow" caption="The consultation is step one of four — and stopping after it is a normal outcome." />
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

      <section className="section">
        <div className="container prose">
          <p className="eyebrow">Before and after the call</p>
          <h2>What you do not need to prepare</h2>
          <p>
            Nothing. There is no form to complete before a consultation, no history to assemble, and
            no requirement to have worked out what the problem is. &ldquo;Something is off and I do not
            know what&rdquo; is a completely ordinary opening, and a large share of consultations start
            somewhere close to it.
          </p>
          <p>
            You are also not expected to tell the whole story. Fifteen minutes is not enough for that
            and it is not what the call is for — it exists to establish whether the work would fit,
            not to begin it. If it helps to arrive with anything, one sentence on what is going on and
            one on how long it has been going on is more than sufficient.
          </p>

          <h2>What you might want to ask</h2>
          <p>
            The consultation goes both ways, and the more useful version of it has you asking
            questions rather than only answering them. What approach would you use for this and why.
            How would we know it was working. What do you not work with. What does it cost and is that
            the whole cost.{' '}
            <Link href="/guides/questions-to-ask-a-therapist">Questions worth asking a therapist</Link>{' '}
            sets out the full list along with the answers that should make you wary — every one of them
            is fair game here.
          </p>

          <h2>Deciding not to book is a normal outcome</h2>
          <p>
            A consultation that ends with &ldquo;this is not the right fit&rdquo; is a success, not a
            failure. Sometimes that means a different counsellor; sometimes it means a physician, a
            psychologist for a formal assessment, or a specialised service. The limits of what this
            practice does are listed openly on{' '}
            <Link href="/standards">standards and accountability</Link>, and being told one of them
            applies to you is a better result than a booking that was never going to help.
          </p>
          <p>
            If you would rather understand the shape of the whole thing before speaking to anyone,{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>{' '}
            covers the stage after the consultation,{' '}
            <Link href="/guides/how-long-does-therapy-take">how long therapy takes</Link> covers the
            commitment honestly, and <Link href="/pricing">fees and insurance</Link> covers the money.
            If cost is the obstacle,{' '}
            <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> lists the
            free and reduced-cost routes, several of which have no waitlist at all.
          </p>
        </div>
      </section>
    </>
  );
}

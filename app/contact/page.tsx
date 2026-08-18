import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { readAvailability } from '@/lib/availability';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { Mail, MonitorSmartphone, Clock, MapPin, Languages as LangIcon, AtSign } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import InboundForm from '@/components/InboundForm';

export const metadata: Metadata = {
  title: 'Contact & Book',
  description:
    'Get in touch with Westpeak Wellness. Book a free 15-minute consultation for online counselling anywhere in British Columbia, in English or Punjabi.',
  alternates: { canonical: `${site.domain}/contact` },
};

export default async function Contact({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { windows } = await readAvailability();
  const sent = searchParams?.sent === 'ok' ? 'ok'
    : searchParams?.sent === 'err' ? 'err' : undefined;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Get in touch</p>
          <h1>Let&rsquo;s see if we&rsquo;re a good fit.</h1>
          <p className="lede">A free 15-minute consultation is the easiest way to start.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book Free Consultation</Link>
            {/* Was a mailto:, which opens nothing at all on a desktop with no
                mail client configured — a silent dead end on the one page
                whose entire job is to be reachable. */}
            <a className="btn btn--ghost" href="#form">Send a message instead</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Contact', path: '/contact' }]} />
          <h2>Reach out</h2>
          <Figure name="bc-reach" caption="Sessions run by secure video, so the practice reaches every region of the province." />
          <div className="info-grid" style={{ marginTop: 26 }}>
            {/* The reply time, stated. It is the most common unspoken worry
                when emailing a stranger about therapy — not whether they will
                answer well, but whether they will answer at all — and it costs
                nothing to say. Every enquiry acknowledgement makes the same
                promise, so the two must be changed together. */}
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><Mail strokeWidth={1.7} /></span><div><h3>Email</h3><p><a href={`mailto:${site.email}`}>{site.email}</a><br /><span style={{ color: 'var(--ink-faint)', fontSize: '.92em' }}>Replies within one business day</span></p></div></div>
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><MonitorSmartphone strokeWidth={1.7} /></span><div><h3>Sessions</h3><p>Fully online, anywhere in British Columbia</p></div></div>
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><Clock strokeWidth={1.7} /></span><div><h3>Hours</h3><p>{windows.map((a) => `${a.day} ${a.from}–${a.to}`).join(' · ')}</p></div></div>
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><MapPin strokeWidth={1.7} /></span><div><h3>Service area</h3><p>Virtual: anywhere in BC</p></div></div>
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><LangIcon strokeWidth={1.7} /></span><div><h3>Languages</h3><p>English & Punjabi</p></div></div>
            <div className="info-block"><span className="icon-chip icon-chip--sm" aria-hidden="true"><AtSign strokeWidth={1.7} /></span><div><h3>Instagram</h3><p><a href={site.instagramUrl} target="_blank" rel="noopener">{site.instagram}</a></p></div></div>
          </div>

          <InboundForm kind="enquiry" done={sent} />

          <p style={{ marginTop: 32 }}>
            If you already know you want to start, the fastest route is to{' '}
            <Link href={site.bookingPath}>book a free 15-minute consultation</Link> directly — the
            form above is better for questions you want answered before committing to a call.
          </p>

          <div className="prose" style={{ marginTop: 36 }}>
            <h2>What to put in a first email</h2>
            <p>
              A sentence is genuinely enough. There is no form to complete and no history to assemble,
              and nobody is assessing how well you describe it. If it helps to have a starting shape:
              roughly what is going on, roughly how long it has been going on, and whether you would
              rather talk in English or Punjabi. That is all that is needed to work out whether a
              consultation makes sense.
            </p>
            <p>
              Please do not send detailed clinical or personal history by email. Email is convenient
              and it is not a secure channel, and there is no need to put anything sensitive in writing
              to get a conversation started. Anything of that kind belongs in a session, where it is
              covered by the protections set out on{' '}
              <Link href="/privacy">privacy and confidentiality</Link>.
            </p>

            <h2>What happens after you get in touch</h2>
            <p>
              You will hear back directly, usually within one business day, and the reply will either
              offer some consultation times or explain honestly why another service would suit you
              better. Being told the second thing is a normal outcome rather than a brush-off — the
              limits of what this practice does are set out plainly on{' '}
              <Link href="/standards">standards and accountability</Link>.
            </p>
            <p>
              The consultation itself is fifteen minutes over secure video, at no cost. You describe
              what is going on in as much or as little detail as you want; you hear how the work would
              run and roughly what it would involve. There is no obligation to book a session
              afterwards, and deciding not to is common.{' '}
              <Link href="/guides/what-to-expect-first-therapy-session">What happens in a first session</Link>{' '}
              covers the stage after that, and{' '}
              <Link href="/guides/questions-to-ask-a-therapist">questions worth asking a therapist</Link>{' '}
              is worth reading beforehand — every question on it is fair game here.
            </p>

            <p>
              Already a client? Booking, payment, rescheduling and receipts all live in the{' '}
              <Link href={site.portalPath}>client portal</Link> rather than in email.
            </p>

            <h2>Two practical things before you book</h2>
            <p>
              Sessions run by secure video anywhere in British Columbia, and a counsellor has to be
              registered in the jurisdiction where you are physically located during a session — so if
              you travel or work outside the province, mention it and it can be planned around.
            </p>
            <p>
              What a session costs and how extended-health reimbursement works is on{' '}
              <Link href="/pricing">fees and insurance</Link>. This practice does not direct-bill: you
              pay at the session and submit the receipt to your insurer yourself, which means it is
              worth confirming with your plan that a Registered Clinical Counsellor is an eligible
              provider before you book. <Link href="/resources/bc-extended-health-coverage-for-counselling">Extended health coverage in BC</Link>{' '}
              explains what to ask them.
            </p>
            <p>
              If you need an accommodation to make sessions workable — camera off, adjusted
              pacing, written summaries, evening slots — the{' '}
              <Link href="/refer">passing this practice on to someone else</Link> covers what a
              referral involves, including the funded routes — ICBC, employee assistance
              programmes and extended health — that most people do not know they qualify for.
              The{' '}
              <Link href="/accessibility">accessibility statement</Link> lists what is available
              and states plainly what is not.
            </p>
          </div>

          <div className="crisis" style={{ marginTop: 24 }}>
            <p style={{ margin: 0 }}>
              <strong>If you&rsquo;re in crisis:</strong> Westpeak Wellness is not a crisis service. Call or text{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> (Canada, 24/7) or BC Mental Health at{' '}
              <a href="tel:3106789"><strong>310-6789</strong></a>.
              In immediate danger, call <a href="tel:911"><strong>911</strong></a>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container center">
          <h2>Ready when you are</h2>
          <p className="lede">Tell us what you&rsquo;re looking for — a sentence is enough. You&rsquo;ll hear back from your counsellor directly, usually within one business day.</p>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book Free Consultation</Link>
          </div>
        </div>
      </section>

      <CtaBand ask={false}         heading="One conversation is all it takes to start."
        text="A free 15-minute consultation over secure video. No pressure, no commitment, and no obligation to book a session afterward."
      />
    </>
  );
}

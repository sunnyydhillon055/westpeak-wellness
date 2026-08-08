import Link from 'next/link';
import type { Metadata } from 'next';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Contact & Book',
  description:
    'Get in touch with Westpeak Wellness. Book a free 15-minute consultation for online counselling anywhere in BC. Sessions in English or Punjabi.',
  alternates: { canonical: `${site.domain}/contact` },
};

export default function Contact() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Get in touch</p>
          <h1>Let&rsquo;s see if we&rsquo;re a good fit.</h1>
          <p className="lede">A free 15-minute consultation is the easiest way to start.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book Free Consultation</Link>
            <a className="btn btn--ghost" href={`mailto:${site.email}`}>Email instead</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="crumb"><a href="/">Home</a> / Contact</p>
          <h2>Reach out</h2>
          <div className="info-grid" style={{ marginTop: 26 }}>
            <div className="info-block"><h3>Email</h3><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
            <div className="info-block"><h3>Sessions</h3><p>Fully online, anywhere in British Columbia</p></div>
            <div className="info-block"><h3>Hours</h3><p>Mon–Fri: 9 AM – 7 PM<br/>Evenings & Saturday by request</p></div>
            <div className="info-block"><h3>Service area</h3><p>Virtual: anywhere in BC</p></div>
            <div className="info-block"><h3>Languages</h3><p>English & Punjabi</p></div>
            <div className="info-block"><h3>Instagram</h3><p><a href={site.instagramUrl} target="_blank" rel="noopener">{site.instagram}</a></p></div>
          </div>

          <p style={{ marginTop: 32 }}>
            If you already know you want to start, the fastest route is to{' '}
            <Link href={site.bookingPath}>book a free 15-minute consultation</Link> directly — email
            is better for questions you want answered before committing to a call.
          </p>

          <div className="crisis" style={{ marginTop: 24 }}>
            <p style={{ margin: 0 }}>
              <strong>If you&rsquo;re in crisis:</strong> Westpeak Wellness is not a crisis service. Call or text{' '}
              <strong>9-8-8</strong> (Canada, 24/7) or BC Mental Health at <strong>310-6789</strong>.
              In immediate danger, call <strong>911</strong>.
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

      <CtaBand
        heading="One conversation is all it takes to start."
        text="A free 15-minute consultation by phone or video. No pressure, no commitment, and no obligation to book a session afterward."
      />
    </>
  );
}

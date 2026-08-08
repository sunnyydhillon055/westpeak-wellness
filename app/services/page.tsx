import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Counselling Services (Online, BC-wide)',
  description:
    'Focused online counselling services across BC: individual, couples, EMDR, trauma, anxiety, depression, Punjabi-speaking, and South Asian mental health. Book a free consultation.',
  alternates: { canonical: `${site.domain}/services` },
};

export default function Services() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>Counselling matched to what you need.</h1>
          <p className="lede">Focused services rooted in evidence-based modalities — all offered online, anywhere in British Columbia.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free Consultation</a>
            <Link className="btn btn--ghost" href="/pricing">View Fees</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="crumb"><a href="/">Home</a> / Services</p>
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card-link">
                  <h3>{s.name}</h3>
                  <p>{s.short}</p>
                  <span className="more">Learn more →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading="Not sure where to start?" text="Book a free 15-minute consultation. We&rsquo;ll figure it out together." />
    </>
  );
}

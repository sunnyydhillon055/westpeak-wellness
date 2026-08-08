import type { Metadata } from 'next';
import Link from 'next/link';
import { audiences } from '@/lib/audiences';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Who We Work With',
  description:
    'Online counselling across BC for new parents, students, shift workers, and others — written for the specific pressures each group carries.',
  alternates: { canonical: `${site.domain}/for` },
};

export default function ForHub() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Who we work with</p>
          <h1>Written for where you actually are.</h1>
          <p className="lede">
            Anxiety in a first-year nursing rotation is not the same problem as anxiety at four
            months postpartum, even when the diagnosis would read identically. These pages start
            from the situation rather than the symptom.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Who we work with</p>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {audiences.map((a) => (
              <div className="card" key={a.slug}>
                <Link href={`/for/${a.slug}`} className="card-link">
                  <h3>{a.title}</h3>
                  <p>{a.lede}</p>
                  <span className="more">{a.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Recognise yourself in one of these? A{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> costs nothing and
              commits you to nothing.
            </p>
          </div>

          <p style={{ marginTop: 32 }}>
            Not seeing your situation? That does not mean it does not fit — these pages exist for
            groups with a distinct enough set of pressures to be worth writing about separately.
            Start with <Link href="/services">the full list of services</Link> or the{' '}
            <Link href="/guides">counselling guides</Link> instead.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Not sure where you fit?"
        text="That is a good use of a free 15-minute consultation. No pressure, no commitment."
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { comparisons } from '@/lib/comparisons';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Compare Your Options',
  description:
    'Straight comparisons for people deciding about therapy in BC — types of therapist, formats, and approaches, with the trade-offs stated plainly.',
  alternates: { canonical: `${site.domain}/compare` },
};

export default function CompareHub() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Compare</p>
          <h1>Decisions, with the trade-offs stated.</h1>
          <p className="lede">
            Choosing a therapist means making several decisions at once, usually with incomplete
            information and often while you are not at your best. These comparisons lay out the
            real differences — including the ones that point away from this practice.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/guides">Read the counselling guides</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Compare</p>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {comparisons.map((c) => (
              <div className="card" key={c.slug}>
                <Link href={`/compare/${c.slug}`} className="card-link">
                  <h3>{c.title}</h3>
                  <p>{c.lede}</p>
                  <span className="more">{c.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Still weighing it up? A{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> includes an honest
              answer if what you need is someone other than a Registered Clinical Counsellor.
            </p>
          </div>

          <p style={{ marginTop: 32 }}>
            You may also want{' '}
            <Link href="/guides">the counselling guides</Link>, or the practical detail on{' '}
            <Link href="/pricing">fees and extended-health coverage</Link>.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Still weighing it up?"
        text="Fifteen minutes on a call will settle more than another hour of reading. It is free, and there is no obligation afterward."
      />
    </>
  );
}

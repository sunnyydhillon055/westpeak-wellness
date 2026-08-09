import type { Metadata } from 'next';
import Link from 'next/link';
import { resources } from '@/lib/resources';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'BC Mental Health Resources',
  description:
    'Practical reference for mental health in BC — insurance coverage, MSP, free and low-cost counselling, and crisis support numbers.',
  alternates: { canonical: `${site.domain}/resources` },
};

export default function ResourcesHub() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Resources</p>
          <h1>The practical information, in one place.</h1>
          <p className="lede">
            Coverage, cost, and crisis numbers — the things people need to look up quickly and
            usually end up piecing together from six different websites. Free to use, no booking
            required, and several of these will point you somewhere other than here.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Resources</p>

          <div className="crisis" style={{ marginBottom: 32 }}>
            <p style={{ margin: 0 }}>
              <strong>In crisis right now?</strong> Call or text <strong>9-8-8</strong> (Canada, 24/7),
              or <strong>310-6789</strong> for BC Mental Health Support. In immediate danger, call{' '}
              <strong>911</strong>. The full list is in the{' '}
              <Link href="/resources/bc-crisis-and-support-directory">BC crisis and support directory</Link>.
            </p>
          </div>

          <div className="grid grid-2">
            {resources.map((r) => (
              <div className="card" key={r.slug}>
                <Link href={`/resources/${r.slug}`} className="card-link">
                  <h2 className="card-title">{r.title}</h2>
                  <p>{r.lede}</p>
                  <span className="more">{r.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Worked through the free options and none of them fit? A{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> is a reasonable next
              step, with no obligation afterward.
            </p>
          </div>

          <p style={{ marginTop: 32 }}>
            Looking for something else? The <Link href="/guides">counselling guides</Link> cover
            what therapy involves, and <Link href="/compare">the comparisons</Link> cover choosing
            between options.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Still have a question about cost or fit?"
        text="A free 15-minute consultation is the fastest way to get a straight answer — including if the answer points somewhere else."
      />
    </>
  );
}

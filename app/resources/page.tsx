import type { Metadata } from 'next';
import Link from 'next/link';
import { resources } from '@/lib/resources';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { LifeBuoy } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'BC Mental Health Resources',
  description:
    'Practical reference for mental health in BC — insurance coverage, MSP, free and low-cost counselling, and crisis support numbers.',
  alternates: { canonical: `${site.domain}/resources` },
};

export default function ResourcesHub() {
  return (
    <>
      <section className="hero hero--resources" style={{ paddingBottom: 44 }}>
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
          <Breadcrumbs trail={[{ name: 'Resources', path: '/resources' }]} />
          <Figure name="bc-support-routes" />

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
                  <div className="hub-card-head"><span className="icon-chip icon-chip--sm" aria-hidden="true"><LifeBuoy strokeWidth={1.7} /></span><h2 className="card-title">{r.title}</h2></div>
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


      <section className="section section--ghost">
        <div className="container prose">
          <p className="eyebrow">How to use this section</p>
          <h2>Written to be useful whether or not you ever book here</h2>
          <p>
            These pages exist because the systems are genuinely confusing and almost nobody explains
            them without also selling something. A large number of people pay privately for counselling
            while holding an unused employer entitlement, or wait months on a public list without
            knowing which services have no waitlist at all. That is an information problem, and it is
            fixable in an afternoon of reading.
          </p>
          <p>
            <strong>If the question is money.</strong> Start with{' '}
            <Link href="/resources/msp-vs-extended-health">MSP vs extended health</Link>, because the
            single most common misunderstanding is assuming the public plan covers counselling in
            private practice — it does not. Then{' '}
            <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</Link>{' '}
            for the detail that decides whether your plan actually reimburses you, and{' '}
            <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> for the
            free and reduced-cost routes.
          </p>
          <p>
            <strong>If the question is access.</strong>{' '}
            <Link href="/resources/psychiatry-and-assessment-in-bc">Psychiatry and assessment in BC</Link>{' '}
            covers what to do when you need a diagnosis, a prescriber or a formal assessment rather
            than counselling — including the route when you have no family doctor.{' '}
            <Link href="/resources/student-mental-health-supports-bc">Student supports</Link> covers a
            group that has more free options available than almost anyone and consistently uses one of
            them.
          </p>
          <p>
            <strong>If the question is work.</strong>{' '}
            <Link href="/resources/workplace-mental-health-bc">Mental health and work in BC</Link>{' '}
            separates the three systems people routinely confuse — accommodation under human rights
            law, disability benefits under an insurance contract, and WorkSafeBC claims — and states
            plainly what an employer is and is not entitled to know.
          </p>
          <p>
            <strong>If the question is trust.</strong>{' '}
            <Link href="/resources/verify-a-counsellor-in-bc">How to verify a counsellor</Link> takes
            about four minutes and is the most useful due diligence available to you in a province
            where &ldquo;counsellor&rdquo; is not a protected title. It applies to this practice as
            much as to anyone.
          </p>
          <p>
            <strong>If it is urgent.</strong> The{' '}
            <Link href="/resources/bc-crisis-and-support-directory">BC crisis and support directory</Link>{' '}
            lists the services that answer now, at any hour, at no cost. None of them require a
            referral and none of them have a waitlist.
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

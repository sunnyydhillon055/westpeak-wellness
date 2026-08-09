import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Counselling Services (Online, BC-wide)',
  description:
    'Online counselling across BC: individual, couples, EMDR, trauma, anxiety, depression, and Punjabi-speaking therapy. Book a free consultation.',
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
            <Link className="btn btn--primary" href={site.bookingPath}>Book a Free Consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Services</p>
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card-link">
                  <h2 className="card-title">{s.name}</h2>
                  <p>{s.short}</p>
                  <span className="more">{s.name} in BC →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '70ch' }}>
          <h2>How to tell which one you need</h2>
          <p>
            You do not have to arrive knowing. Most people do not, and working it out is a reasonable
            use of the first conversation rather than something to settle beforehand. That said, a few
            rough distinctions help.
          </p>
          <p>
            <strong>Start with the problem, not the modality.</strong>{' '}
            <Link href="/services/anxiety-counselling">Anxiety counselling</Link> and{' '}
            <Link href="/services/depression-counselling">depression counselling</Link> are named for
            what you are experiencing.{' '}
            <Link href="/services/emdr-therapy">EMDR</Link> and the Gottman Method are named for how
            the work is done — they are approaches used within the others rather than separate
            destinations. If you know the difficulty but not the method, that is the right way round.
          </p>
          <p>
            <strong>Individual or couples</strong> is usually the first real fork, and it is not
            always obvious — <Link href="/compare/individual-vs-couples-therapy">the comparison of the two</Link>{' '}
            sets out when each makes more sense, including when relationship difficulty is better
            addressed on your own.
          </p>
          <p>
            <strong>Language and cultural context</strong> are not an add-on.{' '}
            <Link href="/services/punjabi-counselling">Sessions in Punjabi</Link> and{' '}
            <Link href="/services/south-asian-mental-health">South Asian mental health work</Link> exist
            because for many people the alternative is spending a session translating rather than
            working.
          </p>
          <p>
            And if you are still deciding whether to do this at all, the{' '}
            <Link href="/guides">counselling guides</Link> cover what therapy involves, and{' '}
            <Link href="/guides/how-to-find-a-therapist-in-bc">how to find a therapist in BC</Link>{' '}
            includes the free options worth trying first.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Practical detail</p>
          <h2>What every service has in common</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Fully virtual, BC-wide</h3>
              <p style={{ marginBottom: 0 }}>
                Secure video from anywhere in the province — see{' '}
                <Link href="/online-counselling">the areas served across BC</Link>.
              </p>
            </div>
            <div className="card">
              <h3>English or Punjabi</h3>
              <p style={{ marginBottom: 0 }}>
                Any service can run in either language, or both within a session.
              </p>
            </div>
            <div className="card">
              <h3>Free 15-minute start</h3>
              <p style={{ marginBottom: 0 }}>
                Every service begins with{' '}
                <Link href="/book">a no-cost consultation</Link>, with no obligation afterward.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 28 }}>
            All sessions are provided by a Registered Clinical Counsellor —{' '}
            <Link href="/about">background and training here</Link>.
          </p>
        </div>
      </section>

      <CtaBand heading="Not sure where to start?" text="Book a free 15-minute consultation. We&rsquo;ll figure it out together." />
    </>
  );
}

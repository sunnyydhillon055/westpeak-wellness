import type { Metadata } from 'next';
import Image from 'next/image';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Meet Aman Bains Dhillon, MA, RCC',
  description:
    'Aman Bains Dhillon is a Registered Clinical Counsellor offering online therapy across BC in English and Punjabi. EMDR- and Gottman-trained, with a Master\u2019s focused on South Asian intergenerational trauma.',
  alternates: { canonical: `${site.domain}/about` },
};

export default function About() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">Meet your counsellor</p>
            <h1>{site.counsellor.name}, {site.counsellor.credentials}</h1>
            <p className="lede">
              Registered Clinical Counsellor. EMDR-trained. Gottman-trained. Born and raised in Surrey.
              Fluent in English and Punjabi.
            </p>
            <div className="btn-row" style={{ marginTop: 24 }}>
              <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free Consultation</a>
              <a className="btn btn--ghost" href="/pricing">View Fees</a>
            </div>
          </div>
          <div className="portrait">
            <Image
              src="/aman-bains-dhillon.jpg"
              alt={`${site.counsellor.name}, ${site.counsellor.credentials} — ${site.counsellor.title} at ${site.name}`}
              width={800}
              height={1000}
              sizes="(max-width: 860px) 340px, 420px"
              quality={90}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <p className="crumb"><a href="/">Home</a> / About</p>
          <h2>Why I do this work.</h2>
          <p>
            I was born and raised in Surrey, BC, in a culturally diverse household where mental health
            was rarely talked about openly — but the weight of it was always there.
          </p>
          <p>
            My approach is warm, direct, culturally grounded. I won&rsquo;t ask you to translate your
            context. We&rsquo;ll figure out what works — at your pace.
          </p>
          <blockquote className="quote" style={{ margin: '32px 0' }}>
            A safe, culturally competent, non-judgmental space for healing.
          </blockquote>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Credentials & training</p>
          <h2>Background</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {[
              ['Master of Counselling', 'City University of Seattle (Vancouver, BC), 2022. Thesis on intergenerational trauma in the South Asian community.'],
              ['Bachelor of Criminology', 'University of the Fraser Valley, 2018.'],
              ['Registered Clinical Counsellor', 'BCACC member. Binding code of ethics. Master\u2019s-level supervised training.'],
              ['EMDR-trained', 'Evidence-based modality for trauma, PTSD, anxiety, and grief.'],
              ['Gottman Method-trained', 'Research-based approach to couples therapy.'],
              ['Fraser Health BC', 'Years of experience in the Mental Health and Substance Use subsector.'],
            ].map(([t, d]) => (
              <div className="card" key={t}><h3>{t}</h3><p style={{ marginBottom: 0 }}>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">How I work</p>
            <ul className="checklist">
              <li>EMDR for trauma, PTSD, and grief</li>
              <li>Gottman Method for couples</li>
              <li>CBT for anxiety and depression</li>
              <li>Culturally adapted frames when family or generational context matters</li>
              <li>Trauma-informed care as the baseline</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Who I work with</p>
            <ul className="checklist">
              <li>Adults with anxiety, depression, and burnout</li>
              <li>Trauma, PTSD, and grief</li>
              <li>South Asian clients navigating family expectations and intergenerational patterns</li>
              <li>Couples rebuilding or working through rupture</li>
              <li>First-gen and second-gen folks holding two cultural worlds</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand heading="Curious if we&rsquo;d be a good fit?" text="Book a free 15-minute consultation. No pressure, no commitment." />
    </>
  );
}

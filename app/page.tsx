import Link from 'next/link';
import { site } from '@/lib/site';
import { featuredServices } from '@/lib/services';
import { faqs } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';

const homeFaqs = faqs.filter((f) =>
  ['Are you taking new clients?', 'Do you offer sessions in Punjabi?', 'Are you covered by extended health benefits?', 'Do you offer a sliding scale?'].includes(f.q)
);

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Westpeak Wellness · Online across BC</p>
          <h1>Counselling that meets you where you are.</h1>
          <p className="lede">
            Registered Clinical Counsellor offering EMDR, trauma, anxiety, depression, and couples
            therapy in English or Punjabi — fully online, anywhere in British Columbia.
          </p>
          <div className="btn-row">
            <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free 15-min Consultation</a>
            <Link className="btn btn--ghost" href="/services">Explore Services</Link>
          </div>
          <p className="hero-note">Free 15-minute consult · Sliding scale available · {site.languagesNative}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">A different kind of fit</p>
          <h2>Safe, culturally competent, built for real life.</h2>
          <p className="lede" style={{ marginBottom: 36 }}>
            Work with {site.counsellor.name}, {site.counsellor.credentials} — Master&rsquo;s in Counselling,
            years of Fraser Health BC experience. No one-size-fits-all.
          </p>
          <div className="grid grid-3">
            {featuredServices.map((s) => (
              <div className="card" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card-link">
                  <h3>{s.name.replace(' Therapy', '').replace(' Counselling', '')}</h3>
                  <p>{s.hero}</p>
                  <span className="more">Learn more →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container split">
          <div>
            <p className="eyebrow">English · ਪੰਜਾਬੀ</p>
            <h2>You don&rsquo;t have to translate yourself.</h2>
            <p>
              Therapy in English or Punjabi, with deep cultural competency for the South Asian
              community. Aman&rsquo;s Master&rsquo;s thesis focused on intergenerational trauma in the
              South Asian community.
            </p>
            <p>
              Family expectations, &ldquo;log kya kahenge,&rdquo; generational silence — talk about it
              without over-explaining.
            </p>
            <Link className="btn btn--ghost" href="/services/punjabi-counselling">Punjabi-speaking therapy →</Link>
          </div>
          <div>
            <blockquote className="quote">
              Some things only land in your first language.
              <cite>— {site.counsellor.name}, {site.counsellor.credentials}</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">The process</p>
          <h2>How we work together</h2>
          <div className="steps" style={{ marginTop: 28, maxWidth: 720 }}>
            <div className="step"><div className="step-num">1</div><div>
              <h3>Free 15-min consult</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>Quick phone or video call to see if it&rsquo;s a good fit. No pressure.</p>
            </div></div>
            <div className="step"><div className="step-num">2</div><div>
              <h3>Intake & goals</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>The first session is about your story, your goals, and what &ldquo;better&rdquo; looks like.</p>
            </div></div>
            <div className="step"><div className="step-num">3</div><div>
              <h3>Ongoing sessions</h3>
              <p style={{ color: 'var(--ink-soft)', margin: 0 }}>50 minutes, weekly or biweekly, online from wherever you&rsquo;re comfortable in BC.</p>
            </div></div>
          </div>
        </div>
      </section>

      <section className="section section--ghost">
        <div className="container">
          <p className="eyebrow">Frequently asked</p>
          <h2>Good questions to start with</h2>
          <div style={{ marginTop: 24, maxWidth: 760 }}>
            {homeFaqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 24 }}><Link href="/faq">View all FAQs →</Link></p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

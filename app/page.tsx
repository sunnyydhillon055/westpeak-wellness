import Link from 'next/link';
import { site } from '@/lib/site';
import { featuredServices } from '@/lib/services';
import { faqs } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';

const homeFaqs = faqs.filter((f) =>
  ['Are you taking new clients?', 'Do you offer sessions in Punjabi?', 'Are you covered by extended health benefits?', 'Is this practice fully online?'].includes(f.q)
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
            <Link className="btn btn--primary" href={site.bookingPath}>Book a Free 15-min Consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
          <p className="hero-note">Free 15-minute consult · Evenings by request · {site.languagesNative}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">A different kind of fit</p>
          <h2>Safe, culturally competent, built for real life.</h2>
          <p className="lede" style={{ marginBottom: 36 }}>
            Work with a {site.counsellor.title} — Master&rsquo;s in Counselling, years of
            Fraser Health BC experience, EMDR- and Gottman-trained.{' '}
            <Link href="/about">More about your counsellor</Link>.
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
              community — including a Master&rsquo;s thesis on intergenerational trauma in the
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
              <cite>— Westpeak Wellness</cite>
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
          <div className="crisis" style={{ marginTop: 32, maxWidth: 720 }}>
            <p style={{ margin: 0 }}>
              Step one costs nothing.{' '}
              <Link href={site.bookingPath}>Book a free 15-minute consultation</Link> — and if it
              turns out someone else is a better fit, you&rsquo;ll get told that too.
            </p>
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
          <p style={{ marginTop: 24 }}><Link href="/faq">Read all frequently asked questions →</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Before you book anything</p>
          <h2>Read first. Decide later.</h2>
          <p className="lede" style={{ marginBottom: 30 }}>
            Most people spend weeks deciding whether to start therapy. These are free, require no
            booking, and several of them will point you somewhere other than here.
          </p>
          <div className="grid grid-2">
            <div className="card">
              <Link href="/guides" className="card-link">
                <h3>Counselling guides</h3>
                <p>
                  What the evidence says about online therapy, what EMDR involves, how to tell burnout
                  from depression, and what actually happens in a first session.
                </p>
                <span className="more">Browse the counselling guides →</span>
              </Link>
            </div>
            <div className="card">
              <Link href="/compare" className="card-link">
                <h3>Compare your options</h3>
                <p>
                  RCC, psychologist, or social worker in BC. Individual or couples therapy. CBT or
                  EMDR for trauma — with the trade-offs stated plainly.
                </p>
                <span className="more">Compare therapist types and formats →</span>
              </Link>
            </div>
            <div className="card">
              <Link href="/resources" className="card-link">
                <h3>BC resources</h3>
                <p>
                  Which extended health plans reimburse an RCC, what MSP does and does not cover,
                  free and low-cost counselling in BC, and crisis numbers.
                </p>
                <span className="more">Open the BC resource directory →</span>
              </Link>
            </div>
            <div className="card">
              <Link href="/for" className="card-link">
                <h3>Who we work with</h3>
                <p>
                  Pages written for specific situations — new parents, students, healthcare and shift
                  workers, South Asian adults, and men who have been putting this off.
                </p>
                <span className="more">See who we work with →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import Link from 'next/link';
import { site } from '@/lib/site';
import { featuredServices } from '@/lib/services';
import { faqs } from '@/lib/faq';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import Motif from '@/components/brand/Motif';
import SectionDivider from '@/components/brand/SectionDivider';
import Photo from '@/components/ui/Photo';
import TrustBar from '@/components/ui/TrustBar';
import Stepper from '@/components/ui/Stepper';
import Reveal from '@/components/ui/Reveal';
import { getServiceIcon, HUB_ICONS } from '@/lib/icon-map';

const homeFaqs = faqs.filter((f) =>
  ['Are you taking new clients?', 'Is this practice fully online?'].includes(f.q)
);

/* Copy is unchanged from the previous build — this is a layout and craft pass
 * only. The one addition is the "Step one/two/three" micro-label on the
 * stepper, which the brief permits as a chip caption. */
const PROCESS = [
  {
    step: 'Step one',
    title: 'Free 15-min consult',
    body: 'Quick phone or video call to see if it’s a good fit. No pressure.',
  },
  {
    step: 'Step two',
    title: 'Intake & goals',
    body: 'The first session is about your story, your goals, and what “better” looks like.',
  },
  {
    step: 'Step three',
    title: 'Ongoing sessions',
    body: '50 minutes, weekly or biweekly, online from wherever you’re comfortable in BC.',
  },
];

const HUBS = [
  {
    href: '/guides',
    icon: HUB_ICONS.guides,
    title: 'Counselling guides',
    body: 'What the evidence says about online therapy, what EMDR involves, how to tell burnout from depression, and what actually happens in a first session.',
    cta: 'Browse the counselling guides →',
  },
  {
    href: '/compare',
    icon: HUB_ICONS.compare,
    title: 'Compare your options',
    body: 'RCC, psychologist, or social worker in BC. Individual or couples therapy. CBT or EMDR for trauma — with the trade-offs stated plainly.',
    cta: 'Compare therapist types and formats →',
  },
  {
    href: '/resources',
    icon: HUB_ICONS.resources,
    title: 'BC resources',
    body: 'Which extended health plans reimburse an RCC, what MSP does and does not cover, free and low-cost counselling in BC, and crisis numbers.',
    cta: 'Open the BC resource directory →',
  },
  {
    href: '/for',
    icon: HUB_ICONS.for,
    title: 'Who we work with',
    body: 'Pages written for specific situations — new parents, women, couples, students, healthcare and shift workers, and first-generation South Asian adults.',
    cta: 'See who we work with →',
  },
];

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="hero hero--home">
        <div className="hero-bg" aria-hidden="true">
          <Motif variant="ridge" />
        </div>
        <div className="container container--wide">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Westpeak Wellness · Online across BC</p>
              <h1>Counselling that meets you where you are.</h1>
              <p className="lede">
                Registered Clinical Counsellor offering EMDR, trauma, anxiety, depression, and couples
                therapy in English or Punjabi — fully online, anywhere in British Columbia.
              </p>
              <div className="btn-row" style={{ marginTop: 30 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>Book a Free 15-min Consultation</Link>
                <Link className="btn btn--ghost" href="/services">See counselling services</Link>
              </div>
              <p className="hero-note">Free 15-minute consult · Evenings by request · {site.languagesNative}</p>
              <TrustBar />
            </div>

            <div className="hero-art">
              <Photo
                src="/img/photo/still-water-bc.jpg"
                alt="A small tree growing from a mossy rock in still, mirror-flat lake water, surrounded by soft reflected forest light."
                ratio="tall"
                priority
                sizes="(max-width: 900px) 92vw, 44vw"
                credit="Fairy Lake, Vancouver Island"
              />
              <div className="hero-art-mark" aria-hidden="true">
                <Motif variant="mark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="ridge" from="var(--grad-hero)" to="var(--surface-1)" />

      {/* ----------------------------------------------------------- SERVICES */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">A different kind of fit</p>
            <h2>Safe, culturally competent, built for real life.</h2>
            <p className="lede" style={{ marginBottom: 38 }}>
              Work with a {site.counsellor.title} — Master&rsquo;s in Counselling, years of
              Fraser Health BC experience, EMDR- and Gottman-trained.{' '}
              <Link href="/about">More about your counsellor</Link>.
            </p>
          </Reveal>
          <div className="grid grid-3">
            {featuredServices.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              return (
                <Reveal key={s.slug} delay={i * 90}>
                  <div className="card" style={{ height: '100%' }}>
                    <Link href={`/services/${s.slug}`} className="card-link">
                      <div className="svc-card-head">
                        <span className="icon-chip" aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                        <h3>{s.name.replace(' Therapy', '').replace(' Counselling', '')}</h3>
                      </div>
                      <p>{s.hero}</p>
                      <span className="more">Learn more →</span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- SIGNATURE MOMENT */}
      <section className="signature">
        <span className="signature-script" aria-hidden="true">ਪੰਜਾਬੀ</span>
        <div className="container container--wide">
          <div className="signature-inner">
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
              <Link className="btn btn--ghost" href="/services/punjabi-counselling" style={{ marginTop: 8 }}>
                Punjabi-speaking therapy →
              </Link>
            </div>
            <div className="signature-quote">
              <blockquote>
                Some things only land in your first language.
                <cite>— Westpeak Wellness</cite>
              </blockquote>
              <Motif variant="arc" className="signature-arc" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ PROCESS */}
      <section className="section section--warm grained">
        <div className="container">
          <Reveal>
            <p className="eyebrow">The process</p>
            <h2>How we work together</h2>
          </Reveal>
          <Figure name="first-session-flow" />
          <Reveal>
            <div style={{ marginTop: 34, maxWidth: 720 }}>
              <Stepper steps={PROCESS} />
            </div>
            <div className="crisis" style={{ marginTop: 36, maxWidth: 720 }}>
              <p style={{ margin: 0 }}>
                Step one costs nothing.{' '}
                <Link href={site.bookingPath}>Book a free 15-minute consultation</Link> — and if it
                turns out someone else is a better fit, you&rsquo;ll get told that too.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider variant="wave" from="var(--surface-2)" to="var(--blue-ghost)" />

      {/* ---------------------------------------------------------------- FAQ */}
      <section className="section section--ghost" style={{ paddingTop: 40 }}>
        <div className="container">
          <Reveal>
            <p className="eyebrow">Frequently asked</p>
            <h2>Good questions to start with</h2>
            <div style={{ marginTop: 26, maxWidth: 760 }}>
              {homeFaqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p style={{ marginTop: 26 }}><Link href="/faq">Read all frequently asked questions →</Link></p>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- HUBS */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Before you book anything</p>
            <h2>Read first. Decide later.</h2>
            <p className="lede" style={{ marginBottom: 34 }}>
              Most people spend weeks deciding whether to start therapy. These are free, require no
              booking, and several of them will point you somewhere other than here.
            </p>
          </Reveal>
          <div className="grid grid-2">
            {HUBS.map((h, i) => {
              const Icon = h.icon;
              return (
                <Reveal key={h.href} delay={i * 80}>
                  <div className="card" style={{ height: '100%' }}>
                    <Link href={h.href} className="card-link">
                      <div className="hub-card-head">
                        <span className="icon-chip icon-chip--warm" aria-hidden="true">
                          <Icon strokeWidth={1.6} />
                        </span>
                        <h3>{h.title}</h3>
                      </div>
                      <p>{h.body}</p>
                      <span className="more">{h.cta}</span>
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ ROUTE BY NEED */}
      <section className="section section--tint">
        <div className="container prose">
          <Reveal>
            <p className="eyebrow">Start where you actually are</p>
            <h2>Most people arrive with a situation, not a diagnosis</h2>
            <p>
              Almost nobody books counselling knowing what they need. They know something has been going
              on too long, that the obvious fixes stopped working, and that they have been meaning to do
              something about it for about a year. If that is roughly the position, the fastest way in is
              to start from whichever of these sounds most like your week.
            </p>
            <p>
              <strong>Something is wrong and you cannot name it.</strong>{' '}
              <Link href="/guides/signs-it-might-be-time-for-therapy">Signs it might be time for therapy</Link>{' '}
              covers the version where nothing has happened and everything is heavy, and{' '}
              <Link href="/guides/high-functioning-anxiety">high-functioning anxiety</Link> covers the
              version where it looks from outside like you are doing extremely well.
            </p>
            <p>
              <strong>The nights are the worst part.</strong>{' '}
              <Link href="/guides/anxiety-and-sleep">Anxiety and sleep</Link> explains why the worry that
              was manageable at 4 p.m. becomes unanswerable at 2 a.m., and which end of that loop is
              easiest to break first. If it arrives as sudden surges rather than steady dread,{' '}
              <Link href="/guides/anxiety-attack-vs-panic-attack">anxiety attack vs panic attack</Link>{' '}
              and <Link href="/guides/panic-attacks-at-work">panic attacks at work</Link> are the more
              useful pair.
            </p>
            <p>
              <strong>You are exhausted by your job.</strong>{' '}
              <Link href="/guides/burnout-vs-depression">Burnout vs depression</Link> is the distinction
              that changes what to do about it, and{' '}
              <Link href="/resources/workplace-mental-health-bc">mental health and work in BC</Link>{' '}
              covers leave, accommodation and what an employer is actually entitled to know.
            </p>
            <p>
              <strong>Something from before is still running.</strong>{' '}
              <Link href="/guides/what-trauma-actually-means">What trauma actually means</Link> is
              written for people who have talked themselves out of the word, and{' '}
              <Link href="/guides/intergenerational-trauma-explained">intergenerational trauma</Link> for
              when the pattern is older than you are.
            </p>
            <p>
              <strong>It is the relationship.</strong>{' '}
              <Link href="/guides/does-couples-therapy-work">Does couples therapy work</Link> gives the
              evidence and the biggest predictor of a poor outcome; if only one of you wants to go,{' '}
              <Link href="/compare/individual-vs-couples-therapy">individual vs couples therapy</Link>{' '}
              is the decision to read first.
            </p>
            <p>
              <strong>It is the family.</strong>{' '}
              <Link href="/guides/setting-boundaries-with-family">Setting boundaries with family</Link>{' '}
              is written for the case where the other person will never agree to one, and{' '}
              <Link href="/guides/talking-to-your-family-about-therapy">telling your family you are going to therapy</Link>{' '}
              for when that conversation is the actual obstacle.
            </p>
            <p>
              <strong>Someone died, or something ended.</strong>{' '}
              <Link href="/guides/grief-without-a-timeline">Grief that does not follow the timeline</Link>{' '}
              covers why the five stages were never a schedule, and the losses that get no funeral.
            </p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- PRACTICAL / TRUST */}
      <section className="section">
        <div className="container prose">
          <Reveal>
            <p className="eyebrow">The practical questions</p>
            <h2>What it costs, who is accountable, and how to check</h2>
            <p>
              Counselling in private practice is not covered by MSP, which surprises a great many people
              —{' '}
              <Link href="/resources/msp-vs-extended-health">MSP vs extended health</Link> sets out
              exactly what the public plan does and does not pay for. If you have benefits through work
              or a student union,{' '}
              <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</Link>{' '}
              explains the detail people most often miss: whether your plan reimburses a Registered
              Clinical Counsellor specifically, rather than only a psychologist. This practice does not
              direct-bill, so you pay at the session and claim the receipt back —{' '}
              <Link href="/pricing">fees and insurance</Link> has the numbers.
            </p>
            <p>
              If cost is the constraint rather than a detail,{' '}
              <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
              <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link> are
              the two worth reading before paying anybody, because a large number of people already have
              a free entitlement they have never used. If you are already on a public waitlist,{' '}
              <Link href="/guides/waiting-for-therapy-in-bc">what to do while you wait</Link> covers the
              interval, which is usually the harder part.
            </p>
            <p>
              On accountability: in British Columbia today, &ldquo;counsellor&rdquo; and
              &ldquo;therapist&rdquo; are not protected titles, so the designation is what carries a
              standard behind it.{' '}
              <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link>{' '}
              explains what each can actually do, and{' '}
              <Link href="/resources/verify-a-counsellor-in-bc">how to verify a counsellor&rsquo;s registration</Link>{' '}
              takes about four minutes and is worth doing before booking with anyone, including here.
              What this practice is accountable to, and what it deliberately does not do, is on{' '}
              <Link href="/standards">standards and accountability</Link>.
            </p>
            <p>
              If the vocabulary itself is the obstacle — EMDR, window of tolerance, RCC, EFAP, CBT-I —
              the <Link href="/glossary">glossary</Link> defines sixty of these terms in plain language, and{' '}
              <Link href="/approaches">the approach pages</Link> cover CBT, ACT, parts work, somatic
              therapy, DBT skills and mindfulness-based programmes in full &mdash; including where each
              one works poorly.
              If what you need is a psychiatrist, a diagnosis or a formal assessment rather than
              counselling,{' '}
              <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
              explains how those routes work and why a counsellor is not one of them.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

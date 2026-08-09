import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
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
    body: 'A short video call to see if it’s a good fit. No pressure.',
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
    href: '/tools',
    icon: HUB_ICONS.compare,
    title: 'Free tools',
    body: 'Work out which kind of counselling fits, what it costs in BC after extended health, and a plain reflection on how the last few weeks have been. No sign-up.',
    cta: 'Open the free tools →',
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
                Registered Clinical Counsellor offering EMDR, trauma, anxiety, depression and
                couples therapy — fully online, anywhere in British Columbia.
              </p>
              <div className="btn-row" style={{ marginTop: 30 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>Book a Free 15-min Consultation</Link>
                <Link className="btn btn--ghost" href="/services">See counselling services</Link>
              </div>
              <p className="hero-note">Free 15-minute consult · Evening &amp; weekend times · No referral needed</p>
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
                <Reveal key={s.slug} delay={i * 55}>
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
      <section className={`signature ${gurmukhi.variable}`}>
        <span className="signature-script" aria-hidden="true">ਸੰਦਰਭ</span>
        <div className="container container--wide">
          <div className="signature-inner">
            <div>
              <p className="eyebrow">Cultural context</p>
              <h2>You shouldn&rsquo;t have to explain the background first.</h2>
              <p>
                Deep cultural competency for the South Asian community, including a
                Master&rsquo;s thesis on intergenerational trauma. Family expectations,
                &ldquo;log kya kahenge,&rdquo; generational silence — talk about it without
                spending the first session setting the scene.
              </p>
              <p>
                Sessions are available in Punjabi as well as English, if that makes it easier
                to say.
              </p>
              <Link className="btn btn--ghost" href="/services/south-asian-mental-health" style={{ marginTop: 8 }}>
                Counselling for South Asian adults →
              </Link>
            </div>
            <div className="signature-quote">
              <blockquote>
                Some things take a long time to explain, and shouldn&rsquo;t.
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
            <div style={{ marginTop: 22, maxWidth: 720 }}>
              <Stepper steps={PROCESS} />
            </div>
            <div className="crisis" style={{ marginTop: 26, maxWidth: 720 }}>
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
            <div style={{ marginTop: 20, maxWidth: 760 }}>
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
            <p className="lede" style={{ marginBottom: 26 }}>
              Most people spend weeks deciding whether to start therapy. These are free, require no
              booking, and several of them will point you somewhere other than here.
            </p>
          </Reveal>
          <div className="grid grid-2">
            {HUBS.map((h, i) => {
              const Icon = h.icon;
              return (
                <Reveal key={h.href} delay={i * 55}>
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
        <div className="container">
          <Reveal>
            <p className="eyebrow">Start where you actually are</p>
            <h2>Most people arrive with a situation, not a diagnosis</h2>
            <p className="lede">
              Almost nobody books counselling knowing what they need — only that something has gone on
              too long and the obvious fixes stopped working. Start from whichever of these sounds most
              like your week.
            </p>
          </Reveal>
          <Reveal>
            <div className="route-grid">
              <div className="route-cell">
                <p className="route-k">Something is wrong and you cannot name it</p>
                <p>
                  <Link href="/guides/signs-it-might-be-time-for-therapy">Signs it might be time for therapy</Link>{' '}
                  is the version where nothing has happened and everything is heavy.{' '}
                  <Link href="/guides/high-functioning-anxiety">High-functioning anxiety</Link> is the
                  version where it looks from outside like you are doing extremely well.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">The nights are the worst part</p>
                <p>
                  <Link href="/guides/anxiety-and-sleep">Anxiety and sleep</Link> explains why 4 p.m.
                  worry becomes unanswerable at 2 a.m. For sudden surges rather than steady dread,{' '}
                  <Link href="/guides/anxiety-attack-vs-panic-attack">anxiety attack vs panic attack</Link>{' '}
                  and <Link href="/guides/panic-attacks-at-work">panic attacks at work</Link>.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">You are exhausted by your job</p>
                <p>
                  <Link href="/guides/burnout-vs-depression">Burnout vs depression</Link> is the
                  distinction that changes what to do about it.{' '}
                  <Link href="/resources/workplace-mental-health-bc">Mental health and work in BC</Link>{' '}
                  covers leave, accommodation, and what an employer may actually ask.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">Something from before is still running</p>
                <p>
                  <Link href="/guides/what-trauma-actually-means">What trauma actually means</Link> is
                  for people who have talked themselves out of the word.{' '}
                  <Link href="/guides/intergenerational-trauma-explained">Intergenerational trauma</Link>{' '}
                  is for when the pattern is older than you are.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">It is the relationship</p>
                <p>
                  <Link href="/guides/does-couples-therapy-work">Does couples therapy work</Link> gives
                  the evidence and the biggest predictor of a poor outcome. If only one of you wants to
                  go, read{' '}
                  <Link href="/compare/individual-vs-couples-therapy">individual vs couples therapy</Link>{' '}
                  first.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">It is the family</p>
                <p>
                  <Link href="/guides/setting-boundaries-with-family">Setting boundaries with family</Link>{' '}
                  is written for when the other person will never agree to one.{' '}
                  <Link href="/guides/talking-to-your-family-about-therapy">Telling your family you are going to therapy</Link>{' '}
                  is for when that conversation is the obstacle.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">Someone died, or something ended</p>
                <p>
                  <Link href="/guides/grief-without-a-timeline">Grief that does not follow the timeline</Link>{' '}
                  covers why the five stages were never a schedule — and the losses that get no funeral.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- PRACTICAL / TRUST */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">The practical questions</p>
            <h2>What it costs, who is accountable, and how to check</h2>
          </Reveal>
          <Reveal>
            <div className="route-grid">
              <div className="route-cell">
                <p className="route-k">What it costs</p>
                <p>
                  Private counselling is not covered by MSP —{' '}
                  <Link href="/resources/msp-vs-extended-health">MSP vs extended health</Link> sets out
                  what the public plan does and does not pay for.{' '}
                  <Link href="/resources/bc-extended-health-coverage-for-counselling">Extended health coverage in BC</Link>{' '}
                  covers the detail most people miss: whether your plan reimburses a Registered Clinical
                  Counsellor specifically, or only a psychologist. This practice does not direct-bill;{' '}
                  <Link href="/pricing">fees and insurance</Link> has the numbers.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">If cost is the constraint</p>
                <p>
                  Read{' '}
                  <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
                  <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
                  before paying anybody — a great many people already have a free entitlement they have
                  never used. Already on a waitlist?{' '}
                  <Link href="/guides/waiting-for-therapy-in-bc">What to do while you wait</Link> covers
                  the interval, usually the harder part.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">Who is accountable</p>
                <p>
                  In BC, &ldquo;counsellor&rdquo; and &ldquo;therapist&rdquo; are not protected titles,
                  so the designation carries the standard.{' '}
                  <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link>{' '}
                  explains what each can do, and{' '}
                  <Link href="/resources/verify-a-counsellor-in-bc">verifying a registration</Link> takes
                  four minutes — worth doing before booking with anyone, including here. See{' '}
                  <Link href="/standards">standards and accountability</Link>.
                </p>
              </div>
              <div className="route-cell">
                <p className="route-k">If the words are the obstacle</p>
                <p>
                  EMDR, window of tolerance, RCC, EFAP, CBT-I — the{' '}
                  <Link href="/glossary">glossary</Link> defines sixty terms in plain language, and{' '}
                  <Link href="/approaches">the approach pages</Link> cover CBT, ACT, parts work, somatic
                  therapy and DBT skills in full, including where each works poorly. If you need a
                  diagnosis or formal assessment instead,{' '}
                  <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
                  explains why a counsellor is not that route.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

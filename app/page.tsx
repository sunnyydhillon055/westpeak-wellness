import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { featuredServices } from '@/lib/services';
import { locations } from '@/lib/locations';
import { punjabiRegions } from '@/lib/punjabi-regions';
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
        {/* ONE LEFT RAIL — 30 August 2026.
          *
          * This was `container--wide` (1240px), while every other section on
          * this page and on the other ~190 pages uses `container` (1080px).
          * Measured at 1264px: the hero h1 began at x=29 and every heading
          * below it at x=109. An 80px step in the left margin, once, right at
          * the top of the page — the eye reads that as the page shifting
          * under it rather than as a hierarchy.
          *
          * The wide container stays where it belongs: the header and footer,
          * which are chrome and are meant to span further than the content
          * they frame. Page CONTENT now shares one rail everywhere. */}
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">Westpeak Wellness · Online across BC</p>
              <h1>Counselling that meets you where you are.</h1>

              {/* THE PHOTOGRAPH SITS INSIDE THE TEXT, NOT BESIDE IT.
                *
                * It used to be the second cell of a two-column grid. A grid
                * gives each cell its own column for its full height, so on a
                * phone the hero read as two stacked blocks — a tall column of
                * words and a shorter column with a photograph floating in the
                * middle of its own empty space — rather than as one section.
                *
                * It is a float now, and it lives after the headline in the
                * DOM because a float only wraps what follows it. The lede,
                * the buttons and the trust list flow around it, which is what
                * makes the whole thing read as a single block of content
                * instead of two columns that happen to be adjacent. */}
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
              <p className="lede">
                Registered Clinical Counsellor offering EMDR, trauma, anxiety, depression and
                couples therapy — fully online, anywhere in British Columbia.
              </p>
              <div className="btn-row" style={{ marginTop: 30 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>Book a Free 15-min Consultation</Link>
                <Link className="btn btn--ghost" href="/services">See counselling services</Link>
              </div>
              {/* Not "weekend times" any more — the schedule moved to Mon–Fri on
                  2026-08-10 and Saturday and Sunday came off it. Daytime and
                  evening are both still true: Mon 10–3 and Tue 9–6 are daytime,
                  Wed–Fri 6–7 is evening. */}
              <p className="hero-note">Free 15-minute consult · Daytime &amp; evening times · No referral needed</p>
              <TrustBar />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="ridge" from="var(--grad-hero)" to="var(--surface-1)" />

      {/* ----------------------------------------------------------- SERVICES */}
      <section className="section">
        <div className="container">
          <Reveal>
            {/* NO PORTRAIT HERE, BY THE OWNER'S DECISION — 30 August 2026.
              *
              * A portrait was added to this section for one deploy, on the
              * strength of conversion research that puts a human photograph
              * high on the page. The owner reverted it the same day: the
              * homepage pushes the BRAND, and the counsellor's visibility is
              * deliberately limited to /about — consistent with the same
              * boundary that keeps her name off the site entirely
              * (expansion-verify.mjs enforces the name; this comment records
              * the face). Do not re-add a photo of her to this page, however
              * good the conversion argument is. The argument was made, and
              * the answer was no. */}
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
        {/* Same rail as everything else — see the note on the hero above. */}
        <div className="container">
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
                to say — there is a{' '}
                <Link href="/punjabi" lang="en">
                  page in Punjabi (ਪੰਜਾਬੀ)
                </Link>{' '}
                covering services, fees and what a first session involves.
              </p>
              <Link className="btn btn--ghost" href="/services/punjabi-counselling" style={{ marginTop: 8 }}>
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
          {/* Wrapped so the phone rule in premium.css can reach it: the
              Stepper directly below says the same four things, readably,
              without a sideways drag. See .process-flow there. */}
          <div className="process-flow">
            <Figure name="first-session-flow" />
          </div>
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
            <p style={{ marginTop: 26 }}><Link className="link-standalone" href="/faq">Read all frequently asked questions →</Link></p>
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
      {/* CONDENSED 31 Aug 2026. This ran to 292 words: every route was two or
          three sentences carrying two or three links, which on a phone is a
          wall of blue text at exactly the point someone is trying to find
          themselves in a list. One line each now, one link each, same seven
          routes. The guides behind them are unchanged \u2014 this section is a
          signpost, and a signpost that needs a paragraph is not working. */}
      <section className="section section--tint">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Start where you actually are</p>
            <h2>Most people arrive with a situation, not a diagnosis</h2>
            <p className="lede">
              Start from whichever of these sounds most like your week.
            </p>
          </Reveal>
          <Reveal>
            <div className="route-grid">
              <div className="route-cell">
                <p className="route-k">Something is wrong and you cannot name it</p>
                <p><Link href="/guides/signs-it-might-be-time-for-therapy">Signs it might be time for therapy</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">It looks fine from the outside</p>
                <p><Link href="/guides/high-functioning-anxiety">High-functioning anxiety</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">The nights are the worst part</p>
                <p><Link href="/guides/anxiety-and-sleep">Anxiety and sleep</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">It arrives as a sudden surge</p>
                <p><Link href="/guides/anxiety-attack-vs-panic-attack">Anxiety attack vs panic attack</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">You are exhausted by your job</p>
                <p><Link href="/guides/burnout-vs-depression">Burnout vs depression</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">You need time off, or an accommodation</p>
                <p><Link href="/resources/workplace-mental-health-bc">Mental health and work in BC</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Something from before is still running</p>
                <p><Link href="/guides/what-trauma-actually-means">What trauma actually means</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">The pattern is older than you are</p>
                <p><Link href="/guides/intergenerational-trauma-explained">Intergenerational trauma</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">It is the relationship</p>
                <p><Link href="/guides/does-couples-therapy-work">Does couples therapy work</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">It is the family</p>
                <p><Link href="/guides/setting-boundaries-with-family">Setting boundaries with family</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Telling them you are going</p>
                <p><Link href="/guides/talking-to-your-family-about-therapy">Talking to your family about therapy</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Someone died, or something ended</p>
                <p><Link href="/guides/grief-without-a-timeline">Grief without a timeline</Link></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- PRACTICAL / TRUST */}
      {/* CONDENSED 31 Aug 2026, from 255 words. Same four questions, same
          fourteen links, one line each. The prose around them was explaining
          what each linked page contained \u2014 which is the linked page's job. */}
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
                <p><Link href="/pricing">Fees and insurance</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">What your plan covers</p>
                <p><Link href="/resources/bc-extended-health-coverage-for-counselling">Extended health coverage in BC</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Whether MSP pays for any of it</p>
                <p><Link href="/resources/msp-vs-extended-health">MSP vs extended health</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">If cost is the constraint</p>
                <p><Link href="/resources/low-cost-counselling-bc">Low-cost counselling in BC</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">You may already have free sessions</p>
                <p><Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">You are on a waitlist</p>
                <p><Link href="/guides/waiting-for-therapy-in-bc">What to do while you wait</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Which kind of professional you need</p>
                <p><Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Checking anyone is really registered</p>
                <p><Link href="/resources/verify-a-counsellor-in-bc">Verifying a registration</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Who we answer to</p>
                <p><Link href="/standards">Standards and accountability</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">If a diagnosis is what you need</p>
                <p><Link href="/resources/psychiatry-and-assessment-in-bc">Psychiatry and assessment in BC</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">The terms nobody explains</p>
                <p><Link href="/glossary">Glossary</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Everything else</p>
                <p><Link href="/faq">The FAQ</Link></p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHERE YOU ARE.
          Added 2026-08-18 after a link crawl found the homepage linked to ZERO
          city pages — as did /services. Every route to a city page ran through
          the /online-counselling hub or a sibling, which put them three
          editorial clicks from here and is the crawl profile that produces
          "discovered, currently not indexed".

          Full anchor text rather than bare place names, because a row of city
          names is a navigation element and a row of sentences is a link. */}
      <section className="section section--tint">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Where you are</p>
            <h2>Anywhere in BC — but a few places have their own page</h2>
            <p style={{ maxWidth: '68ch' }}>
              The practice is virtual and registered across British Columbia, so where you live
              makes no difference to the session itself. It makes a considerable difference to
              what is available to you locally, and these are the places where that gap changes
              what there is to say — the scarcity of clinicians in the north, the cost of a
              ferry, the drive into a regional hub, the concentration of Punjabi-speaking
              counsellors in the Lower Mainland.
            </p>
          </Reveal>
          <Reveal>
            <div className="chip-grid" style={{ marginTop: 22 }}>
              {locations.map((l) => (
                <Link key={l.slug} className="chip" href={`/online-counselling/${l.slug}`}>
                  Online counselling in {l.city}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p style={{ marginTop: 26, maxWidth: '68ch' }}>
              What is available locally <em>in Punjabi</em> is a different question, and across
              most of the province the answer is very different — which is why those regions have{' '}
              <Link href="/punjabi-counselling">their own set of pages</Link>, each carrying the
              local census figure it rests on.
            </p>
          </Reveal>
          <Reveal>
            <div className="chip-grid" style={{ marginTop: 18 }}>
              {punjabiRegions.map((r) => (
                <Link key={r.slug} className="chip" href={`/punjabi-counselling/${r.slug}`}>
                  Punjabi counselling for {r.region}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p style={{ marginTop: 24, color: 'var(--ink-soft)' }}>
              Not listed? Nothing changes —{' '}
              <Link href="/online-counselling">everywhere else in BC</Link> is served on exactly
              the same terms, and the page for the nearest listed city will usually still be the
              closest thing to your situation.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

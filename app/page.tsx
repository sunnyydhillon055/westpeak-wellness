import Link from 'next/link';
import { site, RCC_PLAIN } from '@/lib/site';
import { consultationAvailability, nextFreeCallEntries } from '@/lib/cliniko-availability';
import { PACIFIC } from '@/lib/availability-summary';
import BookLink from '@/components/BookLink';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { lastmodFor } from '@/lib/page-dates';
import Updated from '@/components/Updated';
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
import { fallbackFee, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { counsellorForLanguage, bookingFor } from '@/lib/booking-cta';
import { withLetters, practitioners } from '@/lib/practitioners';
import { reachClause } from '@/lib/practice-facts';
import { whoSentence, onlyWithSentence, alsoOffers, feeSentence, ownWords, orList } from '@/lib/home-copy';
import type { Metadata } from 'next';
import { offeringLanguages, practiceSnippet, withSnippet } from '@/lib/snippet-facts';
import { counsellorsFor } from '@/lib/city-service-page';

/* THE HOME PAGE'S OWN DESCRIPTION — 3 Oct 2026 (item 412). It inherited the
   site-wide fallback, with no consultation, no fee and no names, while home
   CTR fell 35.0% → 22.4% → 15.1% at a steady 9-10. Languages, fee and names
   are generated (offeringLanguages, the catalogue, accepting counsellors);
   sitewideDescription() in the layout stays the fallback for other pages. */
export const metadata: Metadata = {
  description: withSnippet(
    `Online counselling in ${offeringLanguages().individual}, anywhere in BC.`,
    practiceSnippet(FALLBACK_CATALOG, counsellorsFor({ bookingService: 'individual-therapy' })),
  ),
};

/* WHAT IT COSTS AND WHO SPEAKS WHAT, ON THE HOME PAGE — 1 Oct 2026.
 *
 * The home page had no dollar figure anywhere (/index.md said nothing about
 * cost) and its two language sentences named nobody, while the service and
 * city templates had both. The fees are read from the catalogue by name, the
 * session length with them, so nothing here is typed; the counsellors are the
 * ones the booking buttons resolve to (accepting, bookable, speaks the
 * language), so the founder is excluded by that rule and never by name. */
const minutesOf = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)?.minutes;
const INDIVIDUAL_MIN = minutesOf('Individual Counselling');
const COUPLES_MIN = minutesOf('Couples Counselling');
const PA_COUNSELLOR = counsellorForLanguage('pa');
const TL_COUNSELLOR = counsellorForLanguage('tl');

/* WHO YOU WOULD TALK TO AND WHAT IT COSTS, IN THE HERO — 1 Oct 2026.
 * The same rule counsellorForLanguage applies (accepting new clients and
 * bookable), without the language filter: these are the people a booking
 * button on this page can reach, so the founder is excluded by that rule and
 * never by name. The sentences are built in lib/home-copy.ts. */
const ACCEPTING = practitioners.filter((p) => p.acceptingNewClients && p.bookable);
const INDIVIDUAL_FEE = fallbackFee('Individual Counselling');
const COUPLES_FEE = ACCEPTING.some((p) => p.services.includes('couples-therapy'))
  ? fallbackFee('Couples Counselling')
  : null;
const HERO_WHO = whoSentence(ACCEPTING);
const HERO_ONLY = onlyWithSentence(ACCEPTING, [
  { slug: 'couples-therapy', label: 'Couples counselling' },
  { slug: 'emdr-therapy', label: 'EMDR' },
]);
const HERO_FEE = feeSentence({
  consultMinutes: minutesOf('Initial Consultation'),
  individual: INDIVIDUAL_FEE,
  minutes: INDIVIDUAL_MIN,
  couples: COUPLES_FEE,
});
const EMDR_WITH = alsoOffers(ACCEPTING, 'emdr-therapy', 'EMDR');
const ACCEPTING_FIRSTS = orList(ACCEPTING.map((p) => p.name.split(' ')[0]!));
/* Savneet's own words about working in Punjabi, read from her roster intro
   rather than retyped. They replace a sentence about the founder's thesis
   that sat in the paragraph introducing the Punjabi-speaking counsellor, so
   a reader took it as hers. */
const PA_OWN_WORDS = PA_COUNSELLOR ? ownWords(PA_COUNSELLOR.intro, 'what silence means') : null;
const PA_BOOK = bookingFor('punjabi-counselling', 'pa');

const homeFaqs = faqs.filter((f) =>
  ['Are you taking new clients?', 'Is this practice fully online?'].includes(f.q)
);

/* PLAIN STEP NAMES, AND THE FEE WHERE THE STEPS ARE — 1 Oct 2026.
 * "Intake & goals" named a clinic's process, not the reader's; the step is
 * the first paid session, so it says so, with the fee and length from the
 * catalogue. "Biweekly" means both twice a week and every other week, so it
 * is spelled out. The "Step one/two/three" micro-label stays as the chip
 * caption. */
const PROCESS = [
  {
    step: 'Step one',
    title: 'Free 30-min consult',
    body: 'A short video call to see if it’s a good fit. No pressure.',
  },
  {
    step: 'Step two',
    title: 'Your first session',
    body: `${INDIVIDUAL_FEE} for ${INDIVIDUAL_MIN} minutes${COUPLES_FEE ? `, or ${COUPLES_FEE} as a couple` : ''}, paid by card when you book. It is about your story, your goals, and what “better” looks like.`,
  },
  {
    step: 'Step three',
    title: 'Ongoing sessions',
    body: 'Weekly or every other week, online from wherever you’re comfortable in BC. You decide each time whether to book the next one.',
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
    body: 'RCC, psychologist, or social worker in BC. Individual or couples therapy. CBT or EMDR for trauma, with the trade-offs stated plainly.',
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
    body: 'Pages written for specific situations: new parents, men, couples, students, healthcare and shift workers, first responders, the trades, newcomers, and Punjabi- and Tagalog-speaking families.',
    cta: 'See who we work with →',
  },
];

/* The home page sends more people to /book than any other page (12 of 31
   Book clicks in the conversion log to 16 Sep), and until now it said nothing
   about when. Re-rendered every thirty minutes so the line below is what
   Cliniko is actually offering. */
export const revalidate = 1800;

export default async function Home() {
  /* "Next free call: Sat 3 Oct with Camille · Tue 6 Oct with Savneet (Pacific
     time)". The next open DAY per counsellor, from Cliniko; no span of hours
     and no weekend clause (1 Oct 2026, under the 6 Sep no-hours rule). */
  /* Each "Sat 3 Oct with Camille" opens that counsellor's calendar (2 Oct
     2026, "hero-next-home"): the line used to be plain text, so the page that
     sends most people to /book sent them to the bare page. A day, no hour. */
  const nextFree = nextFreeCallEntries(
    await consultationAvailability(),
    ACCEPTING.map((p) => ({ slug: p.slug, first: p.name.split(' ')[0]! })),
  );
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
              {/* THE HEAD TERM, IN THE HEADING — 25 Sep 2026. The strongest
                  page on the site carried a heading with no search term in
                  it: 306 impressions in the September export, all of them
                  the practice's own name. The tagline stays, as the second
                  half of the sentence; the first half is what people type. */}
              <h1>Online counselling in BC that meets you where you are.</h1>
              <Updated iso={lastmodFor('')} />

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
                  /* Lighthouse (6 Sep 2026, mobile) measured this image
                     displayed at 207×165 on a 375 px viewport while the sizes
                     hint said 92vw, so the browser fetched the 384 px file for
                     a 207 px slot: 21 KB wasted on the LCP element. 56vw is
                     what the layout actually gives it on a phone. */
                  sizes="(max-width: 900px) 56vw, 44vw"
                  credit="Fairy Lake, Vancouver Island"
                />
              </div>
              <p className="lede">
                {/* Who, in which language, which work only one of them does,
                    and the fee: generated from the roster and the catalogue
                    (lib/home-copy.ts). The languages stay per person, so no
                    sentence offers couples work in a language nobody offering
                    it speaks. */}
                {HERO_WHO ?? 'Online counselling anywhere in British Columbia, by secure video.'}
                {HERO_ONLY ? ` ${HERO_ONLY}` : ''} {HERO_FEE}
              </p>
              <div className="btn-row" style={{ marginTop: 30 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>Book a Free 30-min Consultation</Link>
                <Link className="btn btn--ghost" href="/services">See counselling services</Link>
              </div>
              {/* Read from Cliniko, not typed: the last hand-written version of
                  this line described a schedule that had changed twice. When the
                  calendar cannot be read the line says only what is always true. */}
              <p className="hero-note">
                {nextFree.length ? (
                  <>
                    Next free call:{' '}
                    {nextFree.map((e, i) => (
                      <span key={e.slug}>
                        {i > 0 ? ' · ' : ''}
                        <BookLink location="hero-next-home" className="" href={`${site.bookingPath}?with=${e.slug}#calendar`}>
                          {e.day} with {e.first}
                        </BookLink>
                      </span>
                    ))}
                    {PACIFIC}
                  </>
                ) : 'The calendar shows real open times'} · No referral needed
              </p>
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
            {/* No practice-wide EMDR claim (1 Oct 2026): it was said of the whole
                practice, and only one accepting counsellor offers EMDR. Who
                does is read from the roster. The designation is explained
                once, in plain words, from lib/site.ts. */}
            <p className="lede" style={{ marginBottom: 38 }}>
              Work with Registered Clinical Counsellors. That means {RCC_PLAIN}. Further training
              in trauma, relationship and body-based work{EMDR_WITH ? `; ${EMDR_WITH}` : ''}.{' '}
              <Link href="/practitioners">Meet the counsellors</Link>.
            </p>
          </Reveal>
          <div className="grid grid-3">
            {featuredServices.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              return (
                <Reveal key={s.slug} delay={i * 55}>
                  {/* The anchor is the "<name> in BC" line, stretched over the
                      card (.card--stretch, globals.css), not the whole card:
                      "Learn more" said nothing, and the card made a 70-odd
                      character anchor. 2 Oct 2026. */}
                  <div className="card card--stretch" style={{ height: '100%' }}>
                    <div className="svc-card-head">
                      <span className="icon-chip" aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                      <h3>{s.name.replace(' Therapy', '').replace(' Counselling', '')}</h3>
                    </div>
                    <p>{s.hero}</p>
                    <Link href={`/services/${s.slug}`} className="more card-stretch">
                      {s.name} in BC<span aria-hidden="true"> →</span>
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
                Family expectations, &ldquo;log kya kahenge,&rdquo; generational silence: talk
                about it without spending the first session setting the scene.
              </p>
              <p>
                Sessions are available in Punjabi as well as English
                {PA_COUNSELLOR ? <> with {withLetters(PA_COUNSELLOR)}</> : null}, if that makes it
                easier to say.
                {PA_COUNSELLOR && PA_OWN_WORDS ? (
                  <>
                    {' '}In {PA_COUNSELLOR.name.split(' ')[0]}&rsquo;s own words: &ldquo;{PA_OWN_WORDS}&rdquo;{' '}
                    <Link href={PA_BOOK.href}>Book a free consultation with {PA_COUNSELLOR.name.split(' ')[0]}</Link>.
                  </>
                ) : null}{' '}
                There is a{' '}
                <Link href="/punjabi" lang="en">
                  page in Punjabi (ਪੰਜਾਬੀ)
                </Link>{' '}
                covering services, fees and what a first session involves.
              </p>
              {/* Tagalog beside Punjabi, 26 Sep 2026, on the owner's instruction
                  that the two be carried equally. The Tagalog vertical had the
                  same pages and no mention on the home page. */}
              <p>
                Sessions are also available in Tagalog,{' '}
                {TL_COUNSELLOR
                  ? <>with {withLetters(TL_COUNSELLOR)}, who works in it and sees clients {reachClause(TL_COUNSELLOR)}.</>
                  : <>with a counsellor who works in it.</>}{' '}
                There is a{' '}
                <Link href="/tagalog" lang="en">
                  page in Tagalog
                </Link>{' '}
                too.
              </p>
              <div className="btn-row" style={{ marginTop: 8 }}>
                <Link className="btn btn--ghost" href="/services/punjabi-counselling">
                  Counselling for South Asian adults →
                </Link>
                <Link className="btn btn--ghost" href="/services/tagalog-counselling">
                  Counselling in Tagalog →
                </Link>
              </div>
            </div>
            <div className="signature-quote">
              <blockquote>
                Some things take a long time to explain, and shouldn&rsquo;t.
                <cite> | Westpeak Wellness</cite>
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
                <Link href={site.bookingPath}>Book a free 30-minute consultation</Link>
                {ACCEPTING.length ? ` with ${ACCEPTING_FIRSTS}` : ''}, and if it turns out someone
                else is a better fit, you&rsquo;ll get told that too.
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

      {/* -------------------------------------------------- PRACTICAL / TRUST */}
      {/* MOVED UP, 1 Oct 2026: directly after the two-question FAQ and ahead
          of the reading hubs. At 375px the cost row sat at y=7142 of 11,848,
          below about 2,500px of hubs, on the page that sends the most people
          to /book; and people who reach the calendar do book (20 bookings
          from 43 calendar interactions). */}
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
                <p>
                  {fallbackFee('Individual Counselling')} for {INDIVIDUAL_MIN} minutes individually,{' '}
                  {fallbackFee('Couples Counselling')} for {COUPLES_MIN} minutes as a couple; the
                  first 30-minute consultation is free.
                </p>
                <p><Link href="/pricing">Fees and insurance</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">What your plan covers</p>
                <p><Link href="/resources/bc-extended-health-coverage-for-counselling">Does your extended health plan cover counselling?</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Whether MSP pays for any of it</p>
                <p><Link href="/resources/msp-vs-extended-health">Does MSP cover therapy in BC?</Link></p>
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
                <p className="route-k">You are on a public waitlist</p>
                <p><Link href="/guides/waiting-for-therapy-in-bc">What to do while you wait</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Which kind of professional you need</p>
                <p><Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Checking anyone is really registered</p>
                <p><Link href="/resources/verify-a-counsellor-in-bc">How to verify a Registered Clinical Counsellor</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">Who we answer to</p>
                <p><Link href="/standards">Standards and accountability</Link></p>
              </div>
              <div className="route-cell">
                <p className="route-k">If a diagnosis is what you need</p>
                <p><Link href="/resources/psychiatry-and-assessment-in-bc">How to get a psychiatrist or an assessment in BC</Link></p>
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

      {/* --------------------------------------------------------------- HUBS */}
      <section className="section section--tint">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Before you book anything</p>
            <h2>Read first. Decide later.</h2>
            <p className="lede" style={{ marginBottom: 26 }}>
              Not ready to talk yet? These are free to read, with no sign-up.
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
      <section className="section">
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
                <p><Link href="/guides/stress-leave-bc">How stress leave works in BC</Link></p>
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
            <h2>Anywhere in BC, but a few places have their own page</h2>
            <p style={{ maxWidth: '68ch' }}>
              The practice is virtual and registered across British Columbia, so where you live
              makes no difference to the session itself. It makes a considerable difference to
              what is available to you locally, and these are the places where that gap changes
              what there is to say. The scarcity of clinicians in the north, the cost of a
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
              most of the province the answer is very different, which is why those regions have{' '}
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
              Not listed? Nothing changes, {' '}
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

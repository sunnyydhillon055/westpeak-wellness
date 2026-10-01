import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocation } from '@/lib/locations';
import { getCityTopic } from '@/lib/conditions';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef, breadcrumbs } from '@/lib/schema';
import { therapyNode, conditionNode } from '@/lib/entities';
import { Paragraphs } from '@/lib/rich';
import { cityContexts, AUTHORITY_URL } from '@/lib/city-context';
import { pairs, getPair, pairsForCity, pairsForService, CONDITION_UPLINK } from '@/lib/city-services';
import CtaBand from '@/components/CtaBand';
import Breadcrumbs from '@/components/Breadcrumbs';
import Updated from '@/components/Updated';
import { healthAuthorityFor, HEALTHLINK } from '@/lib/health-authorities';
import Figure from '@/components/Figure';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';
import Image from 'next/image';
import BookLink from '@/components/BookLink';
import { readCatalog } from '@/lib/cliniko-catalog';
import { withLetters } from '@/lib/practitioners';
import {
  bookHrefFor, counsellorsFor, feeFor, generatedFaqs, languagesOf, listOf, profileHrefFor,
} from '@/lib/city-service-page';

/* THE NAME THE PAGE IS FOUND BY — 25 Sep 2026.
   Search Console shows "marriage counselling abbotsford", "marriage
   counselling kelowna" and their variants — about 60 impressions a month at
   positions 45-60 — landing on the couples pages, whose title and heading
   said only "Couples Therapy". People who are married search for marriage
   counselling. The service keeps its name everywhere else; only the title,
   heading and description of the city pages carry both words. */
const seoName = (s: { slug: string; name: string }) =>
  s.slug === 'couples-therapy' ? 'Couples and Marriage Counselling' : s.name;

/* CITY × SERVICE — fifty pages, each with its own argument.
 *
 * WHAT MAKES THIS NOT A DOORWAY
 *
 * The temptation with a matrix route is to render the service copy with the
 * city name substituted in. That produces fifty pages saying one thing, which
 * is the pattern two competitors in the benchmark set are running and the
 * pattern this site's highest-scoring category exists by not running.
 *
 * So the page is assembled from three sources and the city-specific ones lead:
 *
 *   1. the PAIR argument   — unique to this city and this service (lib/city-services)
 *   2. the CITY reality    — unique to this city, shared across its five pages
 *   3. the SERVICE content — shared across cities, and deliberately last
 *
 * A reader arriving from a search lands on the argument written for them, not
 * on a service page wearing a city's name. scripts/uniqueness-gate.mjs fails
 * the build if any two of these pages converge past a threshold.
 *
 * BOOKING LINKS
 *
 * Deliberately several, at the points where somebody actually decides: under
 * the opening argument, after the access reality, and in the closing band.
 */

type Params = { city: string; service: string };

export function generateStaticParams() {
  return pairs.map((p) => ({ city: p.city, service: p.service }));
}

function load(params: Params) {
  const pair = getPair(params.city, params.service);
  const ctx = cityContexts.find((c) => c.slug === params.city);
  /* A service OR a condition. Anxiety, trauma and depression are what people
     search for and stopped being services in the five-service consolidation;
     see lib/conditions.ts. The page renders either without knowing which. */
  const svc = getCityTopic(params.service);
  const loc = getLocation(params.city);
  if (!pair || !ctx || !svc || !loc) return null;
  return { pair, ctx, svc, loc };
}

/** "Anxiety Counselling" -> "anxiety counselling", for mid-sentence use. */
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/* THE DIAGRAM THAT ALREADY EXISTED — 2026-08-30.
 *
 * scripts/visual-audit.mjs found these fifty pages were the largest block of
 * long-form text on the site carrying nothing visual at all: 1,050-1,170 words
 * each, no figure, no image, no table, no boxed block, a break every 158 words
 * and all of those breaks headings. They were the top twenty entries on the
 * "nothing visual at all" list and forty-nine of the fifty-one entries overall.
 *
 * Nothing new had to be drawn. Each of the five services in this matrix
 * already has a diagram on the site, drawn for its own service page, with its
 * alt text taken from the SVG's <desc> — so the picture and its accessible
 * description cannot drift. The matrix route simply never used them.
 *
 * The figure goes in section 3, with the service content, and not in section 1
 * or 2: the pair argument and the city reality are the parts unique to this
 * page, and putting a shared illustration above them would give the reader a
 * shared impression of a page whose whole design is to lead with what is not.
 *
 * A service without a diagram renders no figure rather than a placeholder —
 * Figure returns null on an unknown key, so a sixth service added to the
 * matrix degrades quietly instead of building a broken image.
 */
const SERVICE_FIGURE: Record<string, string> = {
  'anxiety-counselling': 'anxiety-avoidance-cycle',
  'couples-therapy': 'gottman-method',
  'depression-counselling': 'burnout-vs-depression',
  'emdr-therapy': 'emdr-phases',
  'trauma-therapy': 'window-of-tolerance',
};

export function generateMetadata({ params }: { params: Params }): Metadata {
  const d = load(params);
  if (!d) return {};
  const { ctx, svc } = d;
  const path = `/online-counselling/${ctx.slug}/${svc.slug}`;
  /* Title is the query, near enough verbatim, and it has to survive the 60-char
     truncation the audit enforces. The first draft of this read
     "<service> in <city>, BC (Online) | Westpeak Wellness" and ran to 69
     characters on the longest pairs — the comment claimed it was under 60 while
     the code appended a brand suffix that guaranteed it was not.
     ", BC" and "(Online)" are dropped rather than the brand: both are carried
     by the H1, the description and the schema, whereas the brand appears in a
     result nowhere else. Longest pair is 59.

     Since 6 Sep 2026 ", BC" comes back wherever it fits. Search Console
     showed "trauma therapy victoria bc", "trauma therapy langley bc" and
     "emdr therapy kelowna" style queries at position 28-40, and the province
     is in the query more often than not. Composed to fit, not truncated: the
     pairs whose title would pass 60 with it keep the shorter form. */
  /* The title keeps the service's own name: "Couples and Marriage Counselling
     in Prince George | Westpeak Wellness" is 66 characters and the SEO gate
     refuses it. The heading and the description carry both words instead. */
  const withBc = `${svc.name} in ${ctx.city}, BC`;
  const title = `${withBc} | ${site.name}`.length <= 60 ? withBc : `${svc.name} in ${ctx.city}`;
  /* Composed to fit rather than truncated to fit. The first version ran the
     city AND the region into the sentence and then hard-sliced at 158, which
     cut the longest pairs mid-word — "Free 30-minute con". Longest pair here
     is 155 characters, so nothing is cut at all. */
  const description =
    `${seoName(svc)} for ${ctx.city}, by secure video across BC with a Registered ` +
    `Clinical Counsellor. English, Punjabi or Tagalog. Free 30-minute consultation.`;
  /* Guard only. If a longer service or city name is ever added, trim on a word
     boundary rather than mid-word. */
  const desc =
    description.length <= 158
      ? description
      : description.slice(0, description.lastIndexOf(' ', 155));
  return {
    title: { absolute: `${title} | ${site.name}` },
    description: desc,
    alternates: { canonical: `${site.domain}${path}` },
    openGraph: { ...ogBase(`${path}`),
      /* The same string as the page title, and for the same reason the page
         title stopped being this one. The comment above records that
         "<service> in <city>, BC (Online) | Westpeak Wellness" ran to 69
         characters on the longest pairs and was cut back; og:title kept the
         rejected version, so the fix landed on the search result and not on
         the share card. Prince George x depression counselling reached 72
         characters here - truncated in every unfurl that renders it. */
      title: `${title} | ${site.name}`,
      description: desc,
    },
  };
}

/* ISR, as the service pages are. The fee below is read from the Cliniko
   catalogue, and an hourly re-render picks up a price change without giving
   up static serving. 1 Oct 2026. */
export const revalidate = 3600;

export default async function CityServicePage({ params }: { params: Params }) {
  const d = load(params);
  if (!d) notFound();
  const { pair, ctx, svc, loc } = d;

  /* WHAT THE RANKING PAGES HAVE AND THIS ONE DID NOT — 1 Oct 2026.
     Thirteen pages ranking for the matrix's own queries were read
     (scratchpad/city-service-competitors.md): eight name a counsellor with
     a credential line on the page, ten put the booking action above the
     fold, seven answer cost, coverage and "who would I see" in FAQs. All of
     that comes from the roster and the catalogue here; lib/city-service-page
     holds the rules and the tests. */
  const counsellors = counsellorsFor(svc);
  const bookHref = bookHrefFor(counsellors);
  const fee = feeFor(await readCatalog(), svc);
  const faqs = [...pair.faqs, ...generatedFaqs({ topic: svc, ctx, loc, counsellors, fee })];

  const path = `/online-counselling/${ctx.slug}/${svc.slug}`;
  const otherHere = pairsForCity(ctx.slug).filter((p) => p.service !== svc.slug);
  const sameElsewhere = pairsForService(svc.slug).filter((p) => p.city !== ctx.slug);
  const nearbyPairs = sameElsewhere.filter((p) => ctx.nearby.includes(p.city));
  const cityOf = (slug: string) => cityContexts.find((c) => c.slug === slug)!;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': abs(path),
      name: `${seoName(svc)} in ${ctx.city}, BC`,
      description: pair.angle,
      url: abs(path),
      isPartOf: siteRef,
      /* A condition is not a therapy. Half of these fifty pages are about
         anxiety, trauma or depression, and typing those as MedicalTherapy
         published "anxiety is a treatment this practice offers". 24 Sep 2026. */
      about: svc.isCondition ? conditionNode(svc.slug, svc.name) : therapyNode(svc.slug, svc.name),
      audience: { '@type': 'Patient', geographicArea: { '@type': 'City', name: ctx.city, containedInPlace: { '@type': 'State', name: 'British Columbia' } } },
      provider: orgRef,
      inLanguage: 'en-CA',
      /* Real commit date for the module this page's copy lives in, from
         lib/page-dates.ts. Without it this page made no freshness claim at
         all, which a retrieval system reads as unknown rather than fresh. */
      datePublished: COLLECTION_DATES['cityServices'],
      dateModified: COLLECTION_DATES['cityServices'],
      author: orgRef,
    },
    breadcrumbs([
      { name: 'Online counselling', path: '/online-counselling' },
      { name: ctx.city, path: `/online-counselling/${ctx.slug}` },
      { name: svc.name, path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">{ctx.city} · {ctx.region} · Online</p>
          <h1>{seoName(svc)} in {ctx.city}, BC</h1>
          {/* The pair's own thesis as the lede. This is the sentence that is
              true here and nowhere else in the matrix. */}
          <p className="lede">{pair.angle}</p>
          {/* The booking action directly under the lede, before the
              answer-engine paragraph and the date line it used to sit under.
              Ten of the thirteen ranking pages have theirs above the fold; on
              a phone ours was fourth in the hero. Through BookLink so that
              whether anybody uses it is measured, and naming the service and
              the city so the button says what the page says. 1 Oct 2026. */}
          <div className="btn-row" style={{ marginTop: 20 }}>
            <BookLink location="hero-city-service" href={bookHref}>
              Book a free consultation for {lower(svc.name)} in {ctx.city}
            </BookLink>
            <Link className="btn btn--ghost" href={`/services/${svc.bookingService}`}>
              What {lower(svc.name)} involves
            </Link>
          </div>
          {/* One self-contained sentence for an answer engine, alongside the
              page's own argument above. Says only what is true of every
              counsellor at the practice. */}
          <p className="direct-answer" style={{ marginTop: 22 }}>
            {svc.name} for people in {ctx.city} is delivered by secure video by Registered
            Clinical Counsellors registered with the BC Association of Clinical Counsellors,
            with a free first consultation, no referral, and receipts your extended health plan
            can process.
          </p>
          <Updated iso={COLLECTION_DATES['cityServices']} />
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          {/* schema={false}: the page graph above already carries a
              BreadcrumbList. Two of them on one page is not an error Google
              reports, which is exactly why it would have gone unnoticed —
              the component's own comment says so. */}
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Online counselling', path: '/online-counselling' },
              { name: ctx.city, path: `/online-counselling/${ctx.slug}` },
              { name: svc.name, path },
            ]}
          />

          {/* 1. THE PAIR ARGUMENT — city-and-service specific, and first. */}
          <Paragraphs items={pair.body} />

          {/* The fee from the catalogue, not a typed number. Until 1 Oct 2026
              this line said "$140 for 50 minutes" on all fifty pages, twenty of
              which are couples or EMDR, which bill at a different rate and, for
              EMDR, a different length. The one competitor that ranks first for
              couples in Abbotsford states its fee and says coverage varies;
              this does the same, and coverage stays plan-dependent. */}
          <p>
            {fee
              ? `Sessions are ${fee.fee} for ${fee.minutes} minutes and start with a `
              : 'Sessions start with a '}
            <Link href={bookHref}>free 30-minute video call</Link>, no charge, no card,
            and no obligation to book anything afterwards. Many BC extended health plans
            reimburse a Registered Clinical Counsellor; whether yours does is plan-dependent.{' '}
            <Link href="/pricing">Fees and extended-health cover</Link> are set out in full.
          </p>
        </div>
      </section>

      {/* WHO YOU WOULD SEE — 1 Oct 2026. The block eight of thirteen ranking
          pages have and this one did not. Built from the roster: accepting,
          insured for BC, and offering the appointment type this topic books
          into, so the names change with the service. Credential NAMES only;
          the registration number is on the profile and nowhere else. No
          availability line: hours are not published anywhere. Renders nothing
          rather than a promise if nobody is accepting. */}
      {counsellors.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <h2 style={{ marginTop: 0 }}>Who you would see for {lower(svc.name)} in {ctx.city}</h2>
            <p style={{ color: 'var(--ink-soft)', maxWidth: 680 }}>
              Taking new clients for {lower(svc.name)} and seeing people in {ctx.city} by secure
              video. Each is a Registered Clinical Counsellor; the registration is on the profile
              and can be checked on the BCACC register.
            </p>
            <div className="grid grid-2" style={{ gap: 20, marginTop: 20 }}>
              {counsellors.map((p) => {
                const first = p.name.split(' ')[0];
                return (
                  <div className="card" key={p.slug}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      {p.photos?.portrait && (
                        <Image
                          src={p.photos.portrait.src}
                          alt={p.photos.portrait.alt}
                          width={p.photos.portrait.width}
                          height={p.photos.portrait.height}
                          sizes="96px"
                          style={{ width: 96, height: 96, flex: '0 0 96px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }}
                        />
                      )}
                      <div>
                        <h3 style={{ margin: '0 0 2px', fontSize: '1.15rem' }}>{withLetters(p)}</h3>
                        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '.92rem' }}>
                          {listOf(languagesOf(p), 'and')} · {p.focus.slice(0, 3).map((f) => f.label).join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="btn-row" style={{ marginTop: 14 }}>
                      <BookLink location="counsellor-city-service" href={`${site.bookingPath}?with=${p.slug}`}>
                        Book with {first}
                      </BookLink>
                      <Link className="btn btn--ghost" href={profileHrefFor(p, ctx.slug)}>
                        More about {first}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 2. THE CITY REALITY — shared across this city's five pages, and true. */}
      <section className="section section--ghost">
        <div className="container prose">
          <h2>Getting counselling {ctx.inCity}</h2>
          <p>{ctx.travel}</p>
          <p>{ctx.inPerson}</p>

          {/* The second figure on these fifty pages, added 30 August 2026.
              bc-reach rather than a decorative one: this section's whole
              argument is that the catchment a reader would normally be
              constrained by does not apply, and that map is the drawing of
              exactly that claim. It is the same image on all fifty because it
              is the same claim on all fifty — the pair-specific argument is
              carried by the text above it and by the service diagram below. */}
          <Figure name="bc-reach" caption={`Anywhere in BC includes ${ctx.city}. There is no catchment, because there is no office.`} />
          <p>
            Public mental-health intake for {ctx.city} runs through{' '}
            <a href={AUTHORITY_URL[ctx.authority]} target="_blank" rel="noopener">
              {ctx.authority}
            </a>.
            That route matters if you are seeking publicly funded care. It has no bearing on
            seeing a Registered Clinical Counsellor privately, which needs no referral and no
            diagnosis. See{' '}
            <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">
              how RCCs, psychologists and social workers differ
            </Link>
            .
          </p>
          <p><strong>{ctx.unlock}</strong></p>
          <p>
            More on this city, including who else it serves and what the local picture looks
            like: <Link href={`/online-counselling/${ctx.slug}`}>online counselling in {ctx.city}</Link>.
          </p>
          <div className="btn-row" style={{ marginTop: 20 }}>
            <BookLink location="access-city-service" href={bookHref}>Book a consultation</BookLink>
            <Link className="btn btn--ghost" href="/contact">Ask a question first</Link>
          </div>
        </div>
      </section>

      {/* 3. THE SERVICE CONTENT — shared, and deliberately last. */}
      <section className="section">
        <div className="container prose">
          <h2>What {lower(svc.name).replace(/ in bc.*/i, '')} involves</h2>
          <p>{svc.intro}</p>
          {svc.helps?.length ? (
            <>
              <h3>What it is commonly used for</h3>
              <ul>
                {svc.helps.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </>
          ) : null}
          <p>{svc.approach}</p>

          {SERVICE_FIGURE[svc.slug] ? <Figure name={SERVICE_FIGURE[svc.slug]} /> : null}

          <p>
            The full picture: how sessions are structured, what the first one is like, and what
            it does not do, is on{' '}
            {CONDITION_UPLINK[svc.slug] ? <>the page for <Link href={CONDITION_UPLINK[svc.slug]!.href}>{CONDITION_UPLINK[svc.slug]!.label}</Link></> : <Link href={`/services/${svc.bookingService}`}>the {lower(svc.name)} page</Link>}. If you are
            still working out what you need,{' '}
            <Link href="/tools/which-service">the short questionnaire</Link> is a quicker route
            than reading all of them, and{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">
              what to expect in a first session
            </Link>{' '}
            covers the part most people are actually nervous about.
          </p>
        </div>
      </section>

      {/* FAQs — the pair's own first, then the three every ranking page
          answers (who, the places around the city, the cost) generated from
          this page's data. The same list feeds the FAQPage schema above. */}
      <section className="section section--ghost">
        <div className="container prose">
          <h2>Questions from {ctx.city}</h2>
          {/* details/summary, matching the city and service pages. A dl.faq
              would have been a class no stylesheet here defines. */}
          <div style={{ marginTop: 8, maxWidth: 760 }}>
            {faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p>
            <Link href="/faq">More frequently asked questions</Link>, or{' '}
            <Link href={bookHref}>book the free consultation</Link> and ask directly.
          </p>
        </div>
      </section>

      {/* Cross-links that are navigation rather than a keyword dump: the other
          four services in this city, then the same service in the two
          neighbouring cities named in the city's own context. */}
      <section className="section">
        <div className="container prose">
          <h2>Other counselling {ctx.inCity}</h2>
          <ul>
            {otherHere.map((p) => {
              const s = getCityTopic(p.service)!;
              return (
                <li key={p.service}>
                  <Link href={`/online-counselling/${ctx.slug}/${p.service}`}>
                    {s.name} in {ctx.city}
                  </Link>,{' '}
{p.angle}
                </li>
              );
            })}
          </ul>

          {nearbyPairs.length > 0 && (
            <>
              <h3>{svc.name} nearby</h3>
              <ul>
                {nearbyPairs.map((p) => (
                  <li key={p.city}>
                    <Link href={`/online-counselling/${p.city}/${p.service}`}>
                      {svc.name} in {cityOf(p.city).city}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p>
            The practice is virtual and covers all of British Columbia. See{' '}
            <Link href="/online-counselling">every city page</Link>, or{' '}
            <Link href="/services">the full list of services</Link>.
            {loc.faqs?.length ? (
              <>
                {' '}
                <Link href={`/online-counselling/${ctx.slug}`}>
                  Questions specific to {ctx.city}
                </Link>{' '}
                are answered on the city page.
              </>
            ) : null}
          </p>

          {/* The public route the page keeps referring to, cited. See
              lib/health-authorities.ts for why it is keyed by city. */}
          <p className="eyebrow" style={{ marginTop: 28 }}>Sources</p>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
            {[...(healthAuthorityFor(ctx.slug) ? [healthAuthorityFor(ctx.slug)!] : []), HEALTHLINK].map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The smaller ask. Booking a video call with a stranger is the highest
          commitment on this site; a sentence by email is not. */}

      <CtaBand
        bookHref={bookHref}
        heading={`${seoName(svc)} in ${ctx.city}, without the travel`}
        text="A free 30-minute video call, in English, Punjabi or Tagalog. No charge, no card, and no obligation to book anything afterwards."
      />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocation } from '@/lib/locations';
import { getService } from '@/lib/services';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef, breadcrumbs } from '@/lib/schema';
import { Paragraphs } from '@/lib/rich';
import { cityContexts, AUTHORITY_URL } from '@/lib/city-context';
import { pairs, getPair, pairsForCity, pairsForService } from '@/lib/city-services';
import CtaBand from '@/components/CtaBand';
import Breadcrumbs from '@/components/Breadcrumbs';
import AskInstead from '@/components/AskInstead';

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
 * the opening argument, after the access reality, and in the closing band —
 * plus the smaller ask (AskInstead) for the larger number of readers who will
 * not book a video call with a stranger but will send a sentence.
 */

type Params = { city: string; service: string };

export function generateStaticParams() {
  return pairs.map((p) => ({ city: p.city, service: p.service }));
}

function load(params: Params) {
  const pair = getPair(params.city, params.service);
  const ctx = cityContexts.find((c) => c.slug === params.city);
  const svc = getService(params.service);
  const loc = getLocation(params.city);
  if (!pair || !ctx || !svc || !loc) return null;
  return { pair, ctx, svc, loc };
}

/** "Anxiety Counselling" -> "anxiety counselling", for mid-sentence use. */
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

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
     result nowhere else. Longest pair is 59. */
  const title = `${svc.name} in ${ctx.city}`;
  /* Composed to fit rather than truncated to fit. The first version ran the
     city AND the region into the sentence and then hard-sliced at 158, which
     cut the longest pairs mid-word — "Free 15-minute con". Longest pair here
     is 155 characters, so nothing is cut at all. */
  const description =
    `${svc.name} for ${ctx.city}, by secure video across BC with a Registered ` +
    `Clinical Counsellor. English or Punjabi. Free 15-minute consultation.`;
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
    openGraph: {
      title: `${svc.name} in ${ctx.city}, BC (Online) | ${site.name}`,
      description: desc,
      url: `${site.domain}${path}`,
    },
  };
}

export default function CityServicePage({ params }: { params: Params }) {
  const d = load(params);
  if (!d) notFound();
  const { pair, ctx, svc, loc } = d;

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
      name: `${svc.name} in ${ctx.city}, BC`,
      description: pair.angle,
      url: abs(path),
      isPartOf: siteRef,
      about: { '@type': 'MedicalTherapy', name: svc.name },
      audience: { '@type': 'Patient', geographicArea: { '@type': 'City', name: ctx.city, containedInPlace: { '@type': 'State', name: 'British Columbia' } } },
      provider: orgRef,
      inLanguage: 'en-CA',
    },
    breadcrumbs([
      { name: 'Online counselling', path: '/online-counselling' },
      { name: ctx.city, path: `/online-counselling/${ctx.slug}` },
      { name: svc.name, path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pair.faqs.map((f) => ({
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
          <h1>{svc.name} in {ctx.city}, BC</h1>
          {/* The pair's own thesis as the lede. This is the sentence that is
              true here and nowhere else in the matrix. */}
          <p className="lede">{pair.angle}</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>
              Book a free 15-minute consultation
            </Link>
            <Link className="btn btn--ghost" href={`/services/${svc.slug}`}>
              What {lower(svc.name)} involves
            </Link>
          </div>
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

          <p>
            Sessions are $140 for 50 minutes and start with a{' '}
            <Link href={site.bookingPath}>free 15-minute video call</Link> — no charge, no card,
            and no obligation to book anything afterwards.{' '}
            <Link href="/pricing">Fees and extended-health cover</Link> are set out in full.
          </p>
        </div>
      </section>

      {/* 2. THE CITY REALITY — shared across this city's five pages, and true. */}
      <section className="section section--ghost">
        <div className="container prose">
          <h2>Getting counselling {ctx.inCity}</h2>
          <p>{ctx.travel}</p>
          <p>{ctx.inPerson}</p>
          <p>
            Public mental-health intake for {ctx.city} runs through{' '}
            <a href={AUTHORITY_URL[ctx.authority]} target="_blank" rel="noopener">
              {ctx.authority}
            </a>
            . That route matters if you are seeking publicly funded care. It has no bearing on
            seeing a Registered Clinical Counsellor privately, which needs no referral and no
            diagnosis — see{' '}
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
            <Link className="btn btn--primary" href={site.bookingPath}>Book a consultation</Link>
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
          <p>
            The full picture — how sessions are structured, what the first one is like, and what
            it does not do — is on{' '}
            <Link href={`/services/${svc.slug}`}>the {lower(svc.name)} page</Link>. If you are
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

      {/* FAQs — unique to the pair, and matching the FAQPage schema above. */}
      <section className="section section--ghost">
        <div className="container prose">
          <h2>Questions from {ctx.city}</h2>
          {/* details/summary, matching the city and service pages. A dl.faq
              would have been a class no stylesheet here defines. */}
          <div style={{ marginTop: 8, maxWidth: 760 }}>
            {pair.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p>
            <Link href="/faq">More frequently asked questions</Link>, or{' '}
            <Link href={site.bookingPath}>book the free consultation</Link> and ask directly.
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
              const s = getService(p.service)!;
              return (
                <li key={p.service}>
                  <Link href={`/online-counselling/${ctx.slug}/${p.service}`}>
                    {s.name} in {ctx.city}
                  </Link>{' '}
                  — {p.angle}
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
            The practice is virtual and covers all of British Columbia — see{' '}
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
        </div>
      </section>

      {/* The smaller ask. Booking a video call with a stranger is the highest
          commitment on this site; a sentence by email is not. */}
      <AskInstead />

      <CtaBand
        heading={`${svc.name} in ${ctx.city}, without the travel`}
        text="A free 15-minute video call, in English or Punjabi. No charge, no card, and no obligation to book anything afterwards."
      />
    </>
  );
}

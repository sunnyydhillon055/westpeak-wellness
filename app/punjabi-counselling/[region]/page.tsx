import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { punjabiRegions, getPunjabiRegion, regionOpening } from '@/lib/punjabi-regions';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import BookLink from '@/components/BookLink';
import NextConsultLine from '@/components/NextConsultLine';
import { bookingCtaFor } from '@/lib/booking-cta';
import { withLetters } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import { getPunjabiPlace } from '@/lib/practitioner-places-pa';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import Stat from '@/components/Stat';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { readCatalog } from '@/lib/cliniko-catalog';
import { feeFor, languagesOf, listOf } from '@/lib/city-service-page';
import { serviceSnippet, withSnippet } from '@/lib/snippet-facts';

/* The English-language Punjabi cluster.
 *
 * Deliberately NOT under /punjabi, which is the Gurmukhi surface and carries
 * lang="pa". Somebody searching "punjabi speaking counsellor kamloops" is
 * typing English and expects to land on English. Mixing the two under one
 * prefix would make the hreflang pairing incoherent and would give the
 * Gurmukhi page English children.
 *
 * The hub for this cluster is /services/punjabi-counselling, which already
 * existed. /punjabi-counselling itself redirects there in next.config.mjs so
 * there is exactly one hub rather than a second one competing with it.
 */

export function generateStaticParams() {
  return punjabiRegions.map((r) => ({ region: r.slug }));
}

/* FULLY STATIC — 3 Oct 2026 (item 429). This page exported `revalidate`
   for the catalogue fee and the next-consultation line. A page Next
   re-renders in production goes out without the inlined first-paint CSS
   (scripts/inline-css.mjs only sees the build), and production served these
   templates with blocking stylesheet links. The fee is now a build-time fact
   (a price change in Cliniko reaches the page with the next deploy) and the
   next consultation is filled in by the browser (components/NextConsultSlot.tsx).
   `inline-css --check` fails if an indexable route exports revalidate again. */

export async function generateMetadata({ params }: { params: { region: string } }): Promise<Metadata> {
  const r = getPunjabiRegion(params.region);
  if (!r) return {};
  /* The fee and the counsellor, after the region's own lead — 1 Oct 2026.
     Vancouver sat at 9.01 with 83 impressions and Prince George at 9.83
     with 42, no clicks, and neither description said what it costs or who
     it is with. The speaker is the one the booking button opens. */
  const speaker = bookingCtaFor({ language: 'pa', service: 'individual-therapy', fallback: '' }).practitioner;
  const description = withSnippet(
    r.metaDescription,
    speaker ? serviceSnippet(await readCatalog(), 'individual-therapy', [speaker]) : undefined,
  );
  return {
    title: { absolute: `Punjabi Counselling in ${r.region}, BC | Westpeak` },
    description,
    /* Canonical only. This page declared hreflang pa -> /punjabi until 1 Oct
       2026, but /punjabi is not a translation of a region page and pairs with
       /services/punjabi-counselling instead, so the tag was one-way, and
       hreflang is for real translations only (DECISIONS.md). The link to
       /punjabi stays in the body. scripts/smoke.mjs fails if it returns. */
    alternates: { canonical: `${site.domain}/punjabi-counselling/${r.slug}` },
    openGraph: { ...ogBase(`/punjabi-counselling/${r.slug}`),
      title: `Punjabi-speaking counselling in ${r.region}, BC`,
      description,
    },
  };
}

export default async function PunjabiRegionPage({ params }: { params: { region: string } }) {
  const r = getPunjabiRegion(params.region);
  if (!r) notFound();

  const siblings = (r.nearby ?? []).map(getPunjabiRegion).filter(Boolean) as typeof punjabiRegions;
  const path = `/punjabi-counselling/${r.slug}`;
  /* Every booking link on the page opens the Punjabi-speaking counsellor's
     calendar, resolved from the roster (lib/booking-cta.ts). */
  const cta = bookingCtaFor({ language: 'pa', fallback: 'Book a free consultation' });
  /* The person behind that button, named the way the Tagalog city pages name
     theirs. Same resolution, so the card and the calendar cannot disagree;
     when nobody accepting speaks Punjabi the card is simply not there. */
  const speaker = cta.practitioner;
  const place = speaker?.placePages && placesFor(speaker.provinces).some((c) => c.slug === r.slug)
    ? `/practitioners/${speaker.slug}/${r.slug}`
    : undefined;
  const placePa = place && getPunjabiPlace(r.slug) ? `${place}/pa` : undefined;
  /* Who, how, what it costs and the consultation, before anything else. */
  const opening = regionOpening({
    region: r.region,
    who: speaker ? withLetters(speaker) : undefined,
    languages: speaker ? listOf(languagesOf(speaker), 'or') : undefined,
    fee: feeFor(await readCatalog(), { bookingService: 'individual-therapy' }),
  });

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      /* Real commit date for the module this page is built from. Without
         it the page made no freshness claim, which reads as unknown
         rather than current. See lib/page-dates.ts. */
      datePublished: COLLECTION_DATES["punjabiRegions"],
      dateModified: COLLECTION_DATES["punjabiRegions"],
      provider: orgRef,
      author: orgRef,
      '@id': abs(`${path}#service`),
      name: `Punjabi-speaking counselling in ${r.region}, BC`,
      description: r.metaDescription,
      serviceType: 'Counselling',
      /* Province-level, because the practice is licensed BC-wide and virtual.
         Naming the region as areaServed as well would imply a local presence
         that does not exist. */
      areaServed: { '@type': 'AdministrativeArea', name: 'British Columbia, Canada' },
      availableLanguage: [
        { '@type': 'Language', name: 'Punjabi', alternateName: 'pa' },
        { '@type': 'Language', name: 'English', alternateName: 'en' },
      ],
      isPartOf: siteRef,
      ...(speaker ? { employee: { '@id': `${site.domain}/practitioners/${speaker.slug}#person` } } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: r.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{r.wider} · Online · ਪੰਜਾਬੀ</p>
          <h1>Punjabi-speaking counselling in {r.region}</h1>
          <p className="lede">{r.blurb}</p>
          <Updated iso={COLLECTION_DATES['punjabiRegions']} />
          <div className="btn-row" style={{ marginTop: 24 }}>
            <BookLink location="hero-language-region" href={cta.href}>{cta.label}</BookLink>
            <Link className="btn btn--ghost" href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ</Link>
          </div>
          {/* The next free consultation with the counsellor the button books,
              as the Surrey hub already shows it — 1 Oct 2026 (wf/book-and-cta).
              The existing English label; no new Punjabi. Nobody, no line. */}
          {speaker && (
            <NextConsultLine
              location="next-language-region"
              slugs={[speaker.slug]}
              style={{ margin: '14px 0 0', fontSize: '.95rem' }}
            />
          )}
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs
            trail={[
              { name: 'Punjabi counselling', path: '/services/punjabi-counselling' },
              { name: r.region, path },
            ]}
          />

          {/* The direct-answer block. Stated plainly and early, because this is
              the sentence somebody is scanning for and it is what gets lifted
              into a featured snippet or an AI overview. Since 1 Oct 2026 it
              answers who, how, what it costs and the consultation; it opened
              with the census figure, which the Stat block and the first
              paragraph then said twice more. The census now leads the local
              section below, where it is the argument. */}
          <p className="lede direct-answer" style={{ marginTop: 8 }}>{opening}</p>

          {speaker && (
            <>
              <h2>Who you would be working with</h2>
              <p>
                <Link href={`/practitioners/${speaker.slug}`}>{withLetters(speaker)}</Link>:{' '}
                {speaker.role}, working in Punjabi and English by secure video. She works with{' '}
                {speaker.focus.map((f) => f.label.toLowerCase()).join(', ')}.
              </p>
              {place && (
                <p>
                  There is also a page for{' '}
                  <Link href={place}>{speaker.name.split(' ')[0]} and {r.region}</Link>
                  {placePa && (
                    <>
                      , and the same page{' '}
                      <Link href={placePa} lang="pa" hrefLang="pa">ਪੰਜਾਬੀ ਵਿੱਚ</Link>
                    </>
                  )}
                  .
                </p>
              )}
              {speaker.photos?.portrait && (
                <figure className="photo" style={{ margin: '22px 0 0', maxWidth: 280 }}>
                  <Image
                    src={speaker.photos.portrait.src}
                    alt={`${withLetters(speaker)}, a Punjabi-speaking Registered Clinical Counsellor serving ${r.region} by video`}
                    width={speaker.photos.portrait.width}
                    height={speaker.photos.portrait.height}
                    sizes="(max-width: 700px) 60vw, 280px"
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                  />
                  <figcaption>{withLetters(speaker)}</figcaption>
                </figure>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <h2>{r.localReality.h2}</h2>
          {/* The census, moved here from the opening (1 Oct 2026). The figure
              with its source attached, then the paragraphs that give it
              meaning; the one-line `stat` is not repeated, because the first
              of those paragraphs already says it. */}
          {r.figure && (
            <Stat
              value={r.figure.value}
              label={r.figure.label}
              source={r.sources[0]?.label ?? 'Statistics Canada, 2021 Census'}
              href={r.sources[0]?.url}
            />
          )}
          <Paragraphs items={r.demography.body} />
          <Paragraphs items={r.localReality.body} />
          {/* These four pages rendered no image at all, which is a real gap on
              the cluster that carries the practice's differentiator. bc-reach is
              the diagram that makes their argument: the counsellor is not local,
              and that is the point rather than a compromise. */}
          <Figure
            name="bc-reach"
            caption={`Sessions reach ${r.region} the same way they reach everywhere else in BC.`}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Why virtual, specifically here</p>
          <h2>What changes when language stops being the barrier</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {r.access.map((a) => (
              <div className="card" key={a.label}>
                <h3>{a.label}</h3>
                <p style={{ marginBottom: 0 }}>{rich(a.detail)}</p>
              </div>
            ))}
          </div>
          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Not sure whether this is the right fit? A{' '}
              <BookLink location="mid-language-region" href={cta.href} className="">free 15-minute consultation</BookLink> is the fastest way to
              find out, and it is a perfectly good outcome if the answer turns out to be a referral
              somewhere else.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--ghost">
        <div className="container">
          <p className="eyebrow">Questions from {r.region}</p>
          <h2>Before you book</h2>
          <div style={{ marginTop: 24, maxWidth: 760 }}>
            {r.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            More in the <Link href="/faq">full list of frequently asked questions</Link>, or see{' '}
            <Link href="/pricing">fees and extended-health coverage</Link>. There is also a{' '}
            <Link href="/punjabi">full page in Punjabi (ਪੰਜਾਬੀ)</Link>.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          {siblings.length > 0 && (
            <>
              <p className="eyebrow">Elsewhere in BC</p>
              <div className="chip-grid" style={{ marginBottom: 36 }}>
                {siblings.map((s) => (
                  <Link className="chip" key={s.slug} href={`/punjabi-counselling/${s.slug}`}>
                    Punjabi counselling in {s.region}
                  </Link>
                ))}
                <Link className="chip" href="/services/punjabi-counselling">
                  Punjabi-speaking counselling across BC
                </Link>
              </div>
            </>
          )}
          <p className="eyebrow">Sources</p>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
            {r.sources.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        bookHref={cta.href}
        heading={`Counselling in Punjabi, from ${r.region}`}
        text="A free 15-minute consultation over secure video, in Punjabi or English. No pressure, no commitment, and no obligation to book a session afterward."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

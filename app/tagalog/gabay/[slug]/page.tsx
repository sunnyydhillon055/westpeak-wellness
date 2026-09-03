import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { ogBase } from '@/lib/og-meta';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import { TL_PLACE_SHARED } from '@/lib/practitioner-places-tl';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { tagalogGuides, getTagalogGuide } from '@/lib/tagalog-guides';
import { TAGALOG_LANDING } from '@/lib/tagalog-landing';
import { practitioners } from '@/lib/practitioners';

/* ============================================================================
   GABAY — the Tagalog guides.
   ----------------------------------------------------------------------------
   All 42 guides on this site are in English. A Tagalog speaker had eighteen
   pages to book from and nothing to read. These are written for that reader
   rather than translated from the English, because the questions differ — see
   the note at the top of lib/tagalog-guides.ts.

   Gated on TAGALOG_READY with the rest of the language. Each page declares
   inLanguage tl and, where an English page covers the same ground, links to it
   as a sibling rather than as a translation — they are not the same article and
   claiming hreflang equivalence would be false.
   ========================================================================= */

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams() {
  if (!TAGALOG_READY) return [];
  return tagalogGuides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const g = getTagalogGuide(params.slug);
  if (!g || !TAGALOG_READY) return { robots: { index: false, follow: false } };
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: { canonical: `${site.domain}/tagalog/gabay/${g.slug}` },
    openGraph: {
      ...ogBase(`/tagalog/gabay/${g.slug}`),
      locale: 'tl_PH',
      alternateLocale: ['en_CA'],
      title: g.metaTitle,
      description: g.metaDescription,
    },
    twitter: { card: 'summary_large_image', title: g.metaTitle, description: g.metaDescription },
  };
}

export default function TagalogGuidePage({ params }: { params: Params }) {
  if (!TAGALOG_READY) notFound();
  const g = getTagalogGuide(params.slug);
  if (!g) notFound();

  const speaker = practitioners.find((p) => p.languages.some((l) => l.tag === 'tl'));

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': abs(`/tagalog/gabay/${g.slug}#article`),
      headline: g.title,
      description: g.metaDescription,
      inLanguage: 'tl',
      isPartOf: siteRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': abs(`/tagalog/gabay/${g.slug}#faq`),
      inLanguage: 'tl',
      mainEntity: g.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 34 }} lang="tl">
        <div className="container" style={{ maxWidth: '46rem' }}>
          <p className="eyebrow">Gabay · {g.readMinutes} minutong basa</p>
          <h1>{g.title}</h1>
          <p className="lede">{g.lede}</p>
        </div>
      </section>

      <section className="section" lang="tl">
        <div className="container" style={{ maxWidth: '46rem' }}>
          <Breadcrumbs
            trail={[
              { name: 'Tagalog', path: '/tagalog' },
              { name: g.title, path: `/tagalog/gabay/${g.slug}` },
            ]}
          />

          <div className="crisis" style={{ marginTop: 16 }}>
            <p style={{ margin: 0 }}><strong>Sa maikli:</strong> {g.shortAnswer}</p>
          </div>

          <div className="prose" style={{ marginTop: 28 }}>
            {g.sections.map((sec) => (
              <div key={sec.h2}>
                <h2>{sec.h2}</h2>
                {sec.body.map((b) => <p key={b.slice(0, 24)}>{b}</p>)}
              </div>
            ))}

            {g.figure && (
              <Figure
                name={g.figure}
                alt={TL_PLACE_SHARED.figureAlt}
                caption={TL_PLACE_SHARED.figureCaption}
                hint={TL_PLACE_SHARED.figureHint}
              />
            )}

            <h2>Mga karaniwang tanong</h2>
            {g.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}

            {g.englishHref && (
              <p style={{ marginTop: 26 }}>
                <Link href={g.englishHref} hrefLang="en-CA" lang="en">
                  {g.englishLabel}
                </Link>{' '}
                — ang kaugnay na pahina sa Ingles.
              </p>
            )}

            <p>
              <Link href="/tagalog">Lahat ng nasa Tagalog</Link>
            </p>
          </div>

          <div className="crisis" style={{ marginTop: 26 }}>
            <p style={{ margin: 0 }}>
              <strong>Hindi ito serbisyong pang-krisis.</strong> Tumawag o mag-text sa{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> anumang oras. Kung ikaw ay nasa
              agarang panganib, tumawag sa <a href="tel:911"><strong>9-1-1</strong></a>.
            </p>
          </div>
        </div>
      </section>

      <section className="section" lang="tl">
        <div className="container">
          <div className="cta-band">
            <h2>{TAGALOG_LANDING.ctaHeading}</h2>
            <p>{TAGALOG_LANDING.lede}</p>
            <Link className="btn btn--primary" href={`${site.bookingPath}?with=${speaker?.slug ?? ''}`}>
              {TAGALOG_LANDING.cta}
            </Link>
            <p className="cta-band-alt">
              {TL_PLACE_SHARED.notReady}{' '}
              <Link href="/contact">{TL_PLACE_SHARED.notReadyWrite}</Link> &mdash;{' '}
              {TL_PLACE_SHARED.notReadyReply}, {TL_PLACE_SHARED.notReadyOr}{' '}
              <Link href="/tagalog#gabay">{TL_PLACE_SHARED.notReadyGuides}</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

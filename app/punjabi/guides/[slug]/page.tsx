import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { ogBasePunjabi } from '@/lib/og-meta';
import Breadcrumbs from '@/components/Breadcrumbs';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { punjabiGuides, getPunjabiGuide } from '@/lib/punjabi-guides';
import { PA_PLACE_SHARED } from '@/lib/practitioner-places-pa';
import { practitioners } from '@/lib/practitioners';
import { COLLECTION_DATES } from '@/lib/page-dates';

/* ============================================================================
   ਗਾਈਡਾਂ — the Punjabi guides, /punjabi/guides/<slug>
   ----------------------------------------------------------------------------
   The mirror of app/tagalog/gabay/[slug]/page.tsx. Written for a Punjabi
   reader rather than translated (see lib/punjabi-guides.ts). Each declares
   inLanguage pa and pairs by hreflang with the English guide on the same
   question. Lives under /punjabi/ so the document-language rule and the
   Punjabi checks in the SEO gate apply without a new case.
   ========================================================================= */

export const dynamicParams = false;

type Params = { slug: string };

export function generateStaticParams() {
  return punjabiGuides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const g = getPunjabiGuide(params.slug);
  if (!g) return { robots: { index: false, follow: false } };
  const path = `/punjabi/guides/${g.slug}`;
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: {
      canonical: `${site.domain}${path}`,
      languages: {
        'en-CA': `${site.domain}${g.englishHref}`,
        pa: `${site.domain}${path}`,
        'x-default': `${site.domain}${g.englishHref}`,
      },
    },
    openGraph: {
      ...ogBasePunjabi(path),
      locale: 'pa_IN',
      alternateLocale: ['en_CA'],
      title: g.metaTitle,
      description: g.metaDescription,
    },
    twitter: { card: 'summary_large_image', title: g.metaTitle, description: g.metaDescription },
  };
}

export default function PunjabiGuidePage({ params }: { params: Params }) {
  const g = getPunjabiGuide(params.slug);
  if (!g) notFound();

  const related = (g.related ?? [])
    .map((slug) => getPunjabiGuide(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r) && r!.slug !== g.slug);

  /* The Punjabi-speaking counsellor who is taking clients, for the CTA. */
  const speaker = practitioners.find((p) => p.acceptingNewClients && p.languages.some((l) => l.tag === 'pa'));
  const path = `/punjabi/guides/${g.slug}`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': abs(`${path}#article`),
      headline: g.title,
      description: g.metaDescription,
      inLanguage: 'pa',
      datePublished: COLLECTION_DATES['punjabiGuides'],
      dateModified: COLLECTION_DATES['punjabiGuides'],
      author: orgRef,
      isPartOf: siteRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': abs(`${path}#faq`),
      inLanguage: 'pa',
      datePublished: COLLECTION_DATES['punjabiGuides'],
      dateModified: COLLECTION_DATES['punjabiGuides'],
      author: orgRef,
      mainEntity: g.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'ਪੰਜਾਬੀ', item: abs('/punjabi') },
        { '@type': 'ListItem', position: 3, name: g.title, item: abs(path) },
      ],
    },
  ];

  return (
    <div lang="pa" className={gurmukhi.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 34 }}>
        <div className="container" style={{ maxWidth: '46rem' }}>
          <p className="eyebrow">ਗਾਈਡ · {g.readMinutes} ਮਿੰਟ ਦੀ ਪੜ੍ਹਤ</p>
          <h1 className="gurmukhi">{g.title}</h1>
          <p className="lede">{g.lede}</p>
          <Updated iso={COLLECTION_DATES['punjabiGuides']} lang="en-CA" />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '46rem' }}>
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'ਪੰਜਾਬੀ', path: '/punjabi' },
              { name: g.title, path },
            ]}
          />

          <div className="crisis" style={{ marginTop: 16 }}>
            <p className="direct-answer" style={{ margin: 0 }}><strong>ਸੰਖੇਪ ਵਿੱਚ:</strong> {g.shortAnswer}</p>
          </div>

          <div className="prose" style={{ marginTop: 28 }}>
            {g.sections.map((sec) => (
              <div key={sec.h2}>
                <h2>{sec.h2}</h2>
                {sec.body.map((b) => <p key={b.slice(0, 24)}>{b}</p>)}
              </div>
            ))}

            <h2>ਆਮ ਸਵਾਲ</h2>
            {g.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}

            {related.length > 0 && (
              <>
                <h2>ਅੱਗੇ ਕੀ ਪੜ੍ਹੀਏ</h2>
                <ul>
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/punjabi/guides/${r.slug}`}>{r.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p style={{ marginTop: 26 }}>
              <Link href={g.englishHref} hrefLang="en-CA" lang="en">{g.englishLabel}</Link>, ਇਸੇ ਵਿਸ਼ੇ ਉੱਤੇ ਅੰਗਰੇਜ਼ੀ ਪੰਨਾ।
            </p>

            <p>
              <Link href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਸਭ ਕੁਝ</Link>
            </p>
          </div>

          <div className="crisis" style={{ marginTop: 26 }}>
            <p style={{ margin: 0 }}>
              <strong>{PA_PLACE_SHARED.notCrisis}</strong> ਕਿਸੇ ਵੀ ਵੇਲੇ{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> ਉੱਤੇ ਕਾਲ ਜਾਂ ਟੈਕਸਟ ਕਰੋ। ਜੇ ਤੁਸੀਂ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ, ਤਾਂ{' '}
              <a href="tel:911"><strong>9-1-1</strong></a> ਉੱਤੇ ਕਾਲ ਕਰੋ।
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>ਪਹਿਲਾਂ ਗੱਲ ਕਰ ਲਈਏ</h2>
            <p>{PA_PLACE_SHARED.ctaText}</p>
            <Link className="btn btn--primary" href={speaker ? `${site.bookingPath}?with=${speaker.slug}` : site.bookingPath}>
              {PA_PLACE_SHARED.cta}
            </Link>
            <p className="cta-band-alt">
              {PA_PLACE_SHARED.notReady}{' '}
              <Link href="/punjabi#form">{PA_PLACE_SHARED.notReadyWrite}</Link> &mdash;{' '}
              {PA_PLACE_SHARED.notReadyReply}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

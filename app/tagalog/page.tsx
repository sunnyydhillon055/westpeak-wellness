import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { ogBase } from '@/lib/og-meta';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import { BadgeCheck } from 'lucide-react';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { TAGALOG_LANDING as T, } from '@/lib/tagalog-landing';
import { TL_PLACE_SHARED, getTagalogPlace } from '@/lib/practitioner-places-tl';
import { practitioners } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';

/* ============================================================================
   THE TAGALOG FRONT DOOR
   ----------------------------------------------------------------------------
   /tagalog-counselling is six English pages about Tagalog counselling. Correct
   for an English searcher, useless to a Tagalog one, and the header carried
   ਪੰਜਾਬੀ with nothing beside it. This is the counterpart to /punjabi: one page
   written in the language, for a person searching in it.

   hreflang is reciprocal with /tagalog-counselling, because a declaration that
   only points one way is ignored.
   ========================================================================= */

const TITLE = T.metaTitle;
const DESC = T.metaDescription;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  robots: TAGALOG_READY ? undefined : { index: false, follow: false },
  alternates: {
    canonical: `${site.domain}/tagalog`,
    languages: {
      'en-CA': `${site.domain}/tagalog-counselling`,
      tl: `${site.domain}/tagalog`,
    },
  },
  openGraph: {
    ...ogBase('/tagalog'),
    locale: 'tl_PH',
    alternateLocale: ['en_CA'],
    title: TITLE,
    description: DESC,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

export default function TagalogPage() {
  if (!TAGALOG_READY) notFound();

  const speaker = practitioners.find((p) => p.languages.some((l) => l.tag === 'tl'));
  const cities = speaker?.placePages
    ? placesFor(speaker.provinces).filter((c) => getTagalogPlace(c.slug))
    : [];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': abs('/tagalog'),
      name: TITLE,
      description: DESC,
      inLanguage: 'tl',
      isPartOf: siteRef,
      about: orgRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Tagalog', item: abs('/tagalog') },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="hero" style={{ paddingBottom: 40 }} lang="tl">
        <div className="container hero-split">
          <div>
            <p className="eyebrow">{T.eyebrow}</p>
            <h1>{T.h1}</h1>
            <p className="lede">{T.lede}</p>
            <div className="btn-row" style={{ marginTop: 22 }}>
              <Link className="btn btn--primary" href={`${site.bookingPath}?with=${speaker?.slug ?? ''}`}>
                {T.cta}
              </Link>
              <Link className="btn btn--ghost" href="/tagalog-counselling" hrefLang="en-CA" lang="en">
                {T.englishLink}
              </Link>
            </div>
          </div>
          {speaker?.photos?.warm && (
            <div className="portrait">
              <Image
                src={speaker.photos.warm.src}
                alt={`${speaker.name}, ${speaker.postNominals}`}
                width={speaker.photos.warm.width}
                height={speaker.photos.warm.height}
                sizes="(max-width: 860px) 340px, 420px"
                quality={88}
                priority
              />
            </div>
          )}
        </div>
      </section>

      <section className="section" lang="tl">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Tagalog', path: '/tagalog' }]} />

          <div className="prose" style={{ marginTop: 20 }}>
            <h2>{T.whyHeading}</h2>
            {T.why.map((x) => <p key={x.slice(0, 24)}>{x}</p>)}
          </div>

          <Figure
            name="language-in-therapy-tl"
            alt={TL_PLACE_SHARED.figureAlt}
            caption={TL_PLACE_SHARED.figureCaption}
            hint={TL_PLACE_SHARED.figureHint}
          />

          <div className="prose" style={{ marginTop: 30 }}>
            <h2>{T.contextHeading}</h2>
            <p>{T.context}</p>

            <h2>{T.whoHeading}</h2>
            <p>{T.who}</p>
          </div>

          {speaker && (
            <>
              <div className="trust-bar" style={{ marginTop: 10 }}>
                {speaker.credentials.map((c) => (
                  <span key={c.short}>
                    <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                    {c.full} · {c.body} #{c.number}
                  </span>
                ))}
              </div>
              <div className="btn-row" style={{ marginTop: 18 }}>
                <Link className="btn btn--ghost" href={`/practitioners/${speaker.slug}/tl`}>
                  {T.whoCta}
                </Link>
              </div>
            </>
          )}

          <div className="prose" style={{ marginTop: 34 }}>
            <h2>{T.worksHeading}</h2>
            <ul className="checklist">
              {T.works.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>

          {cities.length > 0 && (
            <div className="prose" style={{ marginTop: 34 }}>
              <h2>{T.citiesHeading}</h2>
              <p>{T.citiesNote}</p>
              <ul className="place-siblings">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/practitioners/${speaker!.slug}/${c.slug}/tl`}>{c.city}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose" style={{ marginTop: 34 }}>
            <h2>{T.startHeading}</h2>
            {T.start.map((x) => <p key={x.slice(0, 24)}>{x}</p>)}

            <h2>{T.feesHeading}</h2>
            <p>{T.fees}</p>
            <p>
              <Link href="/pricing">{T.feesCta}</Link>
            </p>
          </div>

          <div className="crisis" style={{ marginTop: 30 }}>
            <p style={{ margin: 0 }}>
              <strong>{T.crisisTitle}</strong> {T.crisis}
            </p>
          </div>
        </div>
      </section>

      <section className="section" lang="tl">
        <div className="container">
          <div className="cta-band">
            <h2>{T.ctaHeading}</h2>
            <p>{TL_PLACE_SHARED.ctaText}</p>
            <Link className="btn btn--primary" href={`${site.bookingPath}?with=${speaker?.slug ?? ''}`}>
              {T.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner } from '@/lib/practitioners';
import { getPractitionerPlace, placesFor, resolvePlace } from '@/lib/practitioner-places';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { TL_PLACE_SHARED, getTagalogPlace } from '@/lib/practitioner-places-tl';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import { abs, siteRef } from '@/lib/schema';
import { BadgeCheck } from 'lucide-react';
import { ogBase } from '@/lib/og-meta';

/* ============================================================================
   THE TAGALOG CITY PAGES — /practitioners/<slug>/<city>/tl
   ----------------------------------------------------------------------------
   A Tagalog twin for every city page Camille has, at the owner's instruction of
   1 Sep 2026: "every single one of her english pages ... fully translated ...
   there shouldn't be any english".

   NO ENGLISH, and the exceptions are deliberate rather than laziness. What
   stays in English is what would be wrong to translate: the place names, the
   RCC and CCC designations, and the names of the registering bodies — those
   three are the strings somebody types into a public register to check her, and
   a translated register name checks nothing.

   GATED ON TAGALOG_READY, same as the profile. The flag is false and these
   pages do not build while it is: generateStaticParams returns nothing and the
   component calls notFound(). See the note at the top of lib/practitioner-tl.ts
   for why — this is clinical copy in a language the author does not speak
   natively, and the owner chose "write it, Camille reviews before publish".

   PAIRED WITH THE ENGLISH PAGE. Each carries hreflang pointing at the other, so
   a crawler reads them as one page in two languages rather than as two thin
   pages about the same city. og:locale is tl_PH because that is the language of
   the DOCUMENT — the same rule ogBasePunjabi follows in lib/og-meta.ts.
   ========================================================================= */

export const dynamicParams = false;

type Params = { slug: string; place: string };

export function generateStaticParams() {
  if (!TAGALOG_READY) return [];
  const out: Params[] = [];
  for (const p of practitioners) {
    if (!p.placePages) continue;
    if (!p.languages.some((l) => l.tag === 'tl')) continue;
    for (const l of placesFor(p.provinces)) out.push({ slug: p.slug, place: l.slug });
  }
  return out;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = getPractitioner(params.slug);
  const raw = getPractitionerPlace(params.place);
  if (!p || !raw || !TAGALOG_READY) return { robots: { index: false, follow: false } };

  const enPath = `/practitioners/${p.slug}/${raw.slug}`;
  const tlPath = `${enPath}/tl`;
  /* Under the 60 the SEO gate enforces. With the post-nominals appended this
     ran 61-66 on the longer city names and the gate failed the build, which is
     what it is for. The name survives; the letters are on the page itself. */
  const title = `Counselling sa Tagalog sa ${raw.city} — ${p.name}`;
  const description = `Mga sesyon sa Tagalog o Ingles kasama si ${p.name}, ${p.postNominals}, para sa ${raw.city}. Trauma, pagkabalisa, pagluluksa. Libreng 15 minutong konsultasyon.`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${site.domain}${tlPath}`,
      languages: { 'en-CA': `${site.domain}${enPath}`, tl: `${site.domain}${tlPath}` },
    },
    openGraph: {
      ...ogBase(tlPath),
      locale: 'tl_PH',
      alternateLocale: ['en_CA'],
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function TagalogPlacePage({ params }: { params: Params }) {
  if (!TAGALOG_READY) notFound();

  const p = getPractitioner(params.slug);
  if (!p || !p.placePages || !p.languages.some((l) => l.tag === 'tl')) notFound();

  const raw = getPractitionerPlace(params.place);
  if (!raw) notFound();
  const loc = resolvePlace(raw, p);

  const tl = getTagalogPlace(raw.slug);
  if (!tl) notFound();

  const t = TL_PLACE_SHARED;
  const first = p.name.split(' ')[0];
  const enPath = `/practitioners/${p.slug}/${raw.slug}`;
  const tlPath = `${enPath}/tl`;
  const bookHref = `${site.bookingPath}?with=${p.slug}`;

  const faqs = [...tl.faqs, ...t.sharedFaqs];

  /* Same province only, matching the English page. */
  const nearby = placesFor(p.provinces)
    .filter((o) => o.slug !== raw.slug && o.province === raw.province && getTagalogPlace(o.slug))
    .slice(0, 6);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}${tlPath}#page`,
      inLanguage: 'tl',
      isPartOf: siteRef,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${site.domain}${tlPath}#faq`,
      inLanguage: 'tl',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
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
            <p className="eyebrow">{t.eyebrow} · {raw.city}</p>
            <h1>Counselling sa {raw.city}, kasama si {first}</h1>
            <p className="lede">{tl.blurb}</p>
            <div className="btn-row" style={{ marginTop: 22 }}>
              <Link className="btn btn--primary" href={bookHref}>{t.cta}</Link>
              <Link className="btn btn--ghost" href={enPath} hrefLang="en-CA">
                {t.backToEnglish}
              </Link>
            </div>
          </div>
          {p.photos?.portrait && (
            <div className="portrait">
              <Image
                src={p.photos.portrait.src}
                alt={`${p.name}, ${p.postNominals} — counselling sa Tagalog para sa ${raw.city}`}
                width={p.photos.portrait.width}
                height={p.photos.portrait.height}
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
          <Breadcrumbs
            trail={[
              { name: 'Mga counsellor', path: '/practitioners' },
              { name: p.name, path: `/practitioners/${p.slug}` },
              { name: raw.city, path: enPath },
              { name: t.crumb, path: tlPath },
            ]}
          />

          {/* Credential names stay as issued — they are what a register is
              searched with. */}
          <div className="trust-bar" style={{ marginTop: 4 }}>
            {p.credentials.map((c) => (
              <span key={c.short}>
                <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                {c.full} · {c.body} #{c.number}
              </span>
            ))}
          </div>

          <div className="prose" style={{ marginTop: 26 }}>
            <p>{t.opening(raw.city)}</p>
            {tl.local.map((x) => <p key={x.slice(0, 24)}>{x}</p>)}
          </div>

          {p.photos?.warm && (
            <figure className="photo" style={{ marginTop: 28 }}>
              <Image
                src={p.photos.warm.src}
                alt={`${p.name} sa isang sesyon sa video`}
                width={p.photos.warm.width}
                height={p.photos.warm.height}
                sizes="(max-width: 700px) 90vw, 460px"
                quality={86}
              />
              <figcaption>{p.name}, {p.postNominals}</figcaption>
            </figure>
          )}

          <div className="prose" style={{ marginTop: 30 }}>
            <h2>{t.accessHeading(raw.city)}</h2>
            <ul className="checklist">
              {t.access.map((a) => (
                <li key={a.label}>
                  <strong>{a.label}</strong> — {a.detail}
                </li>
              ))}
            </ul>

            <h2>{t.langHeading}</h2>
            <p>{t.langBody}</p>
          </div>

          <Figure
            name="language-in-therapy-tl"
            alt={t.figureAlt}
            caption={t.figureCaption}
            hint={t.figureHint}
          />

          <div className="prose" style={{ marginTop: 34 }}>
            <h2>{t.faqHeading(raw.city)}</h2>
            {faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          {nearby.length > 0 && (
            <div className="prose" style={{ marginTop: 34 }}>
              <h2>{t.nearbyHeading}</h2>
              <p>{t.nearbyNote}</p>
              <ul className="place-siblings">
                {nearby.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/practitioners/${p.slug}/${o.slug}/tl`}>{o.city}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="crisis" style={{ marginTop: 30 }}>
            <p style={{ margin: 0 }}>
              <strong>{t.notCrisis}</strong> {t.urgent} 9-8-8. {t.immediateDanger}
            </p>
          </div>

          <div className="prose" style={{ marginTop: 30 }}>
            <p>
              <Link href={enPath} hrefLang="en-CA">{t.backToEnglish}</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section" lang="tl">
        <div className="container">
          <div className="cta-band">
            <h2>{t.ctaHeading(raw.city)}</h2>
            <p>{t.ctaText}</p>
            <Link className="btn btn--primary" href={bookHref}>{t.cta}</Link>
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

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner, withLetters } from '@/lib/practitioners';
import { getPractitionerPlace, placesFor, resolvePlace } from '@/lib/practitioner-places';
import { PA_PLACE_SHARED, PA_CITY, getPunjabiPlace } from '@/lib/practitioner-places-pa';
import { punjabiGuides } from '@/lib/punjabi-guides';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import Updated from '@/components/Updated';
import { healthAuthorityFor, HEALTHLINK } from '@/lib/health-authorities';
import { abs, siteRef, orgRef } from '@/lib/schema';
import { BadgeCheck } from 'lucide-react';
import { ogBasePunjabi } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';

/* ============================================================================
   THE PUNJABI CITY PAGES — /practitioners/<slug>/<city>/pa
   ----------------------------------------------------------------------------
   Added 7 Sep 2026 for Savneet Singh: a Punjabi twin of each of her city
   pages, the mirror of app/practitioners/[slug]/[place]/tl/page.tsx. Same
   rules as that file: no English except place names and register names;
   paired with the English page by hreflang so a crawler reads one page in two
   languages; og:locale pa_IN because that is the language of the document.

   Built only for practitioners who have place pages AND work in Punjabi. The
   founder works in Punjabi and has no place pages by instruction, so nothing
   is generated for her.

   The city copy is per city (lib/practitioner-places-pa.ts). The shared
   frame — access list, language section, crisis line — is shared by design;
   the local paragraphs and the questions are what keep fifteen pages from
   being one page fifteen times.
   ========================================================================= */

export const dynamicParams = false;

type Params = { slug: string; place: string };

const speaksPunjabi = (p: { languages: { tag: string }[] }) => p.languages.some((l) => l.tag === 'pa');

export function generateStaticParams() {
  const out: Params[] = [];
  for (const p of practitioners) {
    if (!p.placePages || !speaksPunjabi(p)) continue;
    for (const l of placesFor(p.provinces)) if (getPunjabiPlace(l.slug)) out.push({ slug: p.slug, place: l.slug });
  }
  return out;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = getPractitioner(params.slug);
  const raw = getPractitionerPlace(params.place);
  if (!p || !raw || !p.placePages || !speaksPunjabi(p) || !getPunjabiPlace(raw.slug)) {
    return { robots: { index: false, follow: false } };
  }
  const enPath = `/practitioners/${p.slug}/${raw.slug}`;
  const paPath = `${enPath}/pa`;
  const city = PA_CITY[raw.slug] ?? raw.city;
  /* Under 60 with the site suffix the gate counts. */
  const title = `${city} ਵਿੱਚ ਪੰਜਾਬੀ ਕਾਊਂਸਲਿੰਗ | ${p.name}`;
  const description = `${withLetters(p)} ਨਾਲ ${city} ਲਈ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸੈਸ਼ਨ, ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ। ਚਿੰਤਾ, ਉਦਾਸੀ, ਟਰੌਮਾ। ਪਹਿਲੀ 30 ਮਿੰਟ ਦੀ ਗੱਲਬਾਤ ਮੁਫ਼ਤ।`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${site.domain}${paPath}`,
      languages: { 'en-CA': `${site.domain}${enPath}`, pa: `${site.domain}${paPath}` },
    },
    openGraph: {
      ...ogBasePunjabi(paPath),
      locale: 'pa_IN',
      alternateLocale: ['en_CA'],
      title,
      description,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function PunjabiPlacePage({ params }: { params: Params }) {
  const p = getPractitioner(params.slug);
  if (!p || !p.placePages || !speaksPunjabi(p)) notFound();

  const raw = getPractitionerPlace(params.place);
  if (!raw) notFound();
  const loc = resolvePlace(raw, p);

  const pa = getPunjabiPlace(raw.slug);
  if (!pa) notFound();

  const t = PA_PLACE_SHARED;
  const first = p.name.split(' ')[0];
  const city = PA_CITY[raw.slug] ?? raw.city;
  const enPath = `/practitioners/${p.slug}/${raw.slug}`;
  const paPath = `${enPath}/pa`;
  const bookHref = `${site.bookingPath}?with=${p.slug}`;

  const faqs = [...pa.faqs, ...t.sharedFaqs];

  const nearby = placesFor(p.provinces)
    .filter((o) => o.slug !== raw.slug && o.province === raw.province && getPunjabiPlace(o.slug))
    .slice(0, 6);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}${paPath}#page`,
      inLanguage: 'pa',
      datePublished: COLLECTION_DATES['punjabiPlaces'],
      dateModified: COLLECTION_DATES['punjabiPlaces'],
      author: orgRef,
      isPartOf: siteRef,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${site.domain}${paPath}#faq`,
      inLanguage: 'pa',
      datePublished: COLLECTION_DATES['punjabiPlaces'],
      dateModified: COLLECTION_DATES['punjabiPlaces'],
      author: orgRef,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <div lang="pa" className={gurmukhi.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">{t.eyebrow} · {city} <span lang="en-CA">({raw.city})</span></p>
            <Updated iso={COLLECTION_DATES['punjabiPlaces']} lang="en-CA" />
            <h1 className="gurmukhi">{city} ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ, {first} ਨਾਲ</h1>
            <p className="lede">{pa.blurb}</p>
            <p className="direct-answer">
              {withLetters(p)} ਨਾਲ {city} ਲਈ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸੈਸ਼ਨ, ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ।
              ਚਿੰਤਾ, ਉਦਾਸੀ, ਟਰੌਮਾ ਅਤੇ ਰਿਸ਼ਤਿਆਂ ਦੇ ਪੈਟਰਨ। ਪਹਿਲੀ 30 ਮਿੰਟ ਦੀ ਗੱਲਬਾਤ ਮੁਫ਼ਤ।
            </p>
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
                alt={`${withLetters(p)}, ${raw.city} ਲਈ ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ`}
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

      <section className="section">
        <div className="container">
          <Breadcrumbs
            trail={[
              { name: 'ਸਾਡੇ ਕਾਊਂਸਲਰ', path: '/practitioners' },
              { name: p.name, path: `/practitioners/${p.slug}` },
              { name: raw.city, path: enPath },
              { name: t.crumb, path: paPath },
            ]}
          />

          {p.credentials.length > 0 && (
            <div className="trust-bar" style={{ marginTop: 4 }} lang="en-CA">
              {p.credentials.map((c) => (
                <span key={c.short}>
                  <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                  {c.full} · {c.body} #{c.number}
                </span>
              ))}
            </div>
          )}

          <div className="prose" style={{ marginTop: 26 }}>
            <p>{t.opening(city, first)}</p>
            {pa.local.map((x) => <p key={x.slice(0, 24)}>{x}</p>)}
          </div>

          {p.photos?.warm && (
            <figure className="photo" style={{ marginTop: 28 }}>
              <Image
                src={p.photos.warm.src}
                alt={`${p.name}, ਵੀਡੀਓ ਸੈਸ਼ਨ ਵਿੱਚ`}
                width={p.photos.warm.width}
                height={p.photos.warm.height}
                sizes="(max-width: 700px) 90vw, 460px"
                quality={86}
              />
              <figcaption>{withLetters(p)}</figcaption>
            </figure>
          )}

          <div className="prose" style={{ marginTop: 30 }}>
            <h2>{t.accessHeading(city)}</h2>
            <ul className="checklist">
              {t.access.map((a) => (
                <li key={a.label}>
                  <strong>{a.label}</strong>, {a.detail}
                </li>
              ))}
            </ul>

            <h2>{t.langHeading}</h2>
            <p>{t.langBody}</p>

            <h2>{t.focusHeading(first)}</h2>
            <ul className="checklist">
              {t.focus.map((f) => (
                <li key={f.label}>
                  <strong>{f.label}</strong>, {f.detail}
                </li>
              ))}
            </ul>
          </div>

          <Figure name="bc-reach" />

          <div className="prose" style={{ marginTop: 34 }}>
            <h2>{t.faqHeading(city)}</h2>
            {faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          {nearby.length > 0 && (
            <div className="prose" style={{ marginTop: 34 }}>
              <h2>{t.nearbyHeading(first)}</h2>
              <p>{t.nearbyNote}</p>
              <ul className="place-siblings">
                {nearby.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/practitioners/${p.slug}/${o.slug}/pa`}>{PA_CITY[o.slug] ?? o.city}</Link>
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
            <h2>{t.guidesHeading}</h2>
            <ul>
              {punjabiGuides.map((g) => (
                <li key={g.slug}><Link href={`/punjabi/guides/${g.slug}`}>{g.title}</Link></li>
              ))}
            </ul>
          </div>

          <div className="prose" style={{ marginTop: 30 }}>
            <p className="eyebrow" lang="en-CA">Sources</p>
            <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }} lang="en-CA">
              {[...(healthAuthorityFor(params.place) ? [healthAuthorityFor(params.place)!] : []), HEALTHLINK].map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="prose" style={{ marginTop: 30 }}>
            <p>
              <Link href={enPath} hrefLang="en-CA">{t.backToEnglish}</Link>
              {' · '}
              <Link href={`/practitioners/${p.slug}/pa`}>{first} ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t.ctaHeading(city)}</h2>
            <p>{t.ctaText}</p>
            <Link className="btn btn--primary" href={bookHref}>{t.cta}</Link>
            <p className="cta-band-alt">
              {t.notReady}{' '}
              <Link href="/punjabi#form">{t.notReadyWrite}</Link> &mdash;{' '}
              {t.notReadyReply}, {t.notReadyOr}{' '}
              <Link href="/punjabi#guides">{t.notReadyGuides}</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

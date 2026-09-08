import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBasePunjabi } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { punjabiRegions } from '@/lib/punjabi-regions';
import { practitioners, withLetters } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import { PA_CITY, getPunjabiPlace } from '@/lib/practitioner-places-pa';

/* The Punjabi twin of /punjabi-counselling — 6 Sep 2026.
 *
 * /punjabi is the Punjabi-language front door and pairs by hreflang with the
 * service page. The region index had no twin: its `pa` alternate pointed at
 * /punjabi, which is a different page, so a Punjabi reader who landed on the
 * index was sent somewhere that does not list the regions. This page is the
 * index itself, in Punjabi, making the same argument the English one makes:
 * outside the Lower Mainland the nearest Punjabi-speaking counsellor is hours
 * away; inside it there is no shortage, and the reason people come here is
 * distance from their own networks.
 *
 * Lives under /punjabi/ so the document-language rule in scripts/html-lang.mjs
 * and the Punjabi checks in the SEO gate apply without a new case, and so the
 * dynamic /punjabi-counselling/[region] route is never asked to resolve "pa".
 *
 * Written in the register of /punjabi, English clinical terms left in English.
 * THE PUNJABI SHOULD BE READ BY THE COUNSELLOR before it is relied on, as the
 * note on /punjabi's form already says of that page. The counsellor-name rule
 * holds: no name here. */

const TITLE = 'ਖੇਤਰ ਅਨੁਸਾਰ ਪੰਜਾਬੀ ਕਾਊਂਸਲਿੰਗ | Punjabi counselling by region';
const DESC =
  'ਸਰੀ, ਐਬਟਸਫੋਰਡ, ਵੈਨਕੂਵਰ, ਕੈਲੋਨਾ, ਕੈਮਲੂਪਸ ਅਤੇ ਪ੍ਰਿੰਸ ਜਾਰਜ ਲਈ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਕਾਊਂਸਲਰ ਨਾਲ ਆਨਲਾਈਨ ਕਾਊਂਸਲਿੰਗ। ਸੈਸ਼ਨ ਪੰਜਾਬੀ, ਅੰਗਰੇਜ਼ੀ ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ।';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: {
    canonical: `${site.domain}/punjabi/regions`,
    languages: {
      'en-CA': `${site.domain}/punjabi-counselling`,
      pa: `${site.domain}/punjabi/regions`,
    },
  },
  openGraph: { ...ogBasePunjabi('/punjabi/regions'), title: TITLE, description: DESC, locale: 'pa_IN' },
};

/* Region names in Gurmukhi, and a one-line Punjabi version of the argument
   each page makes. The English blurbs in lib/punjabi-regions.ts are not
   reused here: a Punjabi page with English card copy would be the sprinkling
   this language surface exists to avoid. */
const PA: Record<string, { name: string; line: string }> = {
  surrey: {
    name: 'ਸਰੀ',
    line: 'ਕੈਨੇਡਾ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ਪੰਜਾਬੀ ਵਸੋਂ, ਅਤੇ ਕਾਊਂਸਲਰਾਂ ਦੀ ਕੋਈ ਕਮੀ ਨਹੀਂ। ਲੋਕ ਇੱਥੋਂ ਇਸ ਲਈ ਲਿਖਦੇ ਹਨ ਕਿ ਹਰ ਕੋਈ ਹਰ ਕਿਸੇ ਨੂੰ ਜਾਣਦਾ ਹੈ।',
  },
  abbotsford: {
    name: 'ਐਬਟਸਫੋਰਡ',
    line: 'ਫ਼ਰੇਜ਼ਰ ਵੈਲੀ ਦਾ ਕੇਂਦਰ, ਜਿੱਥੇ ਭਾਈਚਾਰਾ ਨੇੜੇ ਵੀ ਹੈ ਅਤੇ ਬਹੁਤ ਨੇੜੇ ਵੀ। ਦੂਰੀ ਹੀ ਗੁਪਤਤਾ ਨੂੰ ਸੱਚ ਮਹਿਸੂਸ ਕਰਵਾਉਂਦੀ ਹੈ।',
  },
  vancouver: {
    name: 'ਵੈਨਕੂਵਰ',
    line: 'ਸ਼ਹਿਰ ਵਿੱਚ ਹਰ ਭਾਸ਼ਾ ਹੈ, ਪਰ ਪੰਜਾਬੀ ਸੇਵਾਵਾਂ ਦਾ ਰਾਹ ਅਕਸਰ ਸਰੀ ਵੱਲ ਜਾਂਦਾ ਹੈ। ਵੀਡੀਓ ਉਹ ਸਫ਼ਰ ਮੁਕਾ ਦਿੰਦੀ ਹੈ।',
  },
  kelowna: {
    name: 'ਕੈਲੋਨਾ',
    line: 'ਓਕਾਨਾਗਨ ਵਿੱਚ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲਾ ਕਲੀਨੀਕਲ ਕਾਊਂਸਲਰ ਲੱਭਣਾ ਔਖਾ ਹੈ। ਇੱਥੇ ਆਨਲਾਈਨ ਸੈਸ਼ਨ ਬਦਲ ਨਹੀਂ, ਇੱਕੋ-ਇੱਕ ਰਾਹ ਹੈ।',
  },
  kamloops: {
    name: 'ਕੈਮਲੂਪਸ',
    line: 'ਥੌਮਸਨ-ਨਿਕੋਲਾ ਵਿੱਚ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੰਜਾਬੀ ਦਫ਼ਤਰ ਘੰਟਿਆਂ ਦੀ ਦੂਰੀ ਉੱਤੇ ਹੈ। ਵੀਡੀਓ ਰਾਹੀਂ ਉਹ ਦੂਰੀ ਖ਼ਤਮ ਹੋ ਜਾਂਦੀ ਹੈ।',
  },
  'prince-george': {
    name: 'ਪ੍ਰਿੰਸ ਜਾਰਜ',
    line: 'ਉੱਤਰੀ ਬੀ.ਸੀ. ਵਿੱਚ ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ ਦਾ ਸਥਾਨਕ ਬਦਲ ਲਗਭਗ ਕੋਈ ਨਹੀਂ। ਇਹ ਪੰਨਾ ਉਸ ਸੱਚ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ।',
  },
};

const SCARCITY = ['kelowna', 'kamloops', 'prince-george'];
const DISTANCE = ['surrey', 'abbotsford', 'vancouver'];

export default function PunjabiRegionsPage() {
  const speaker = practitioners.find((p) => p.acceptingNewClients && p.languages.some((l) => l.tag === 'pa') && p.placePages);
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': abs('/punjabi/regions'),
      name: TITLE,
      description: DESC,
      inLanguage: 'pa',
      datePublished: COLLECTION_DATES['punjabiRegions'],
      dateModified: COLLECTION_DATES['punjabiRegions'],
      author: orgRef,
      isPartOf: siteRef,
      about: orgRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: punjabiRegions.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${PA[r.slug]?.name ?? r.region} ਲਈ ਪੰਜਾਬੀ ਕਾਊਂਸਲਿੰਗ`,
        url: abs(`/punjabi-counselling/${r.slug}`),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'ਪੰਜਾਬੀ', item: abs('/punjabi') },
        { '@type': 'ListItem', position: 3, name: 'ਖੇਤਰ', item: abs('/punjabi/regions') },
      ],
    },
  ];

  const Card = ({ slug }: { slug: string }) => {
    const r = punjabiRegions.find((x) => x.slug === slug);
    const pa = PA[slug];
    if (!r || !pa) return null;
    return (
      <div className="card">
        <h3 style={{ marginBottom: 6 }}>
          <Link href={`/punjabi-counselling/${slug}`}>{pa.name}</Link>
        </h3>
        <p style={{ marginBottom: 0 }}>{pa.line}</p>
        <p lang="en" style={{ marginBottom: 0, marginTop: 8, color: 'var(--ink-soft)', fontSize: '.86rem' }}>
          {r.region} · {r.wider}
        </p>
      </div>
    );
  };

  return (
    <div lang="pa" className={gurmukhi.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container">
          <p className="eyebrow" lang="en">Punjabi and English, anywhere in BC</p>
          <h1 className="gurmukhi">ਖੇਤਰ ਅਨੁਸਾਰ, ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ</h1>
          <Updated iso={COLLECTION_DATES['punjabiRegions']} lang="en-CA" />
          <p className="direct-answer">
            ਵੈੱਸਟਪੀਕ ਵੈੱਲਨੈੱਸ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਕਿਤੇ ਵੀ, ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ Registered Clinical Counsellor
            ਨਾਲ ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ ਆਨਲਾਈਨ ਕਾਊਂਸਲਿੰਗ ਦਿੰਦਾ ਹੈ। ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ
            ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ। ਹੇਠਾਂ ਦਿੱਤੇ ਪੰਨੇ ਦੱਸਦੇ ਹਨ ਕਿ ਸਰੀ, ਐਬਟਸਫੋਰਡ, ਵੈਨਕੂਵਰ, ਕੈਲੋਨਾ, ਕੈਮਲੂਪਸ ਅਤੇ
            ਪ੍ਰਿੰਸ ਜਾਰਜ ਵਿੱਚ ਪੰਜਾਬੀ ਵਿੱਚ ਮਾਨਸਿਕ ਸਿਹਤ ਦੀ ਮਦਦ ਕਿਹੋ ਜਿਹੀ ਹੈ, ਅਤੇ ਜਦੋਂ ਕਾਊਂਸਲਰ ਦਾ ਉਸੇ ਸ਼ਹਿਰ
            ਵਿੱਚ ਹੋਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ ਰਹਿੰਦਾ ਤਾਂ ਕੀ ਬਦਲਦਾ ਹੈ।
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ</Link>
            <Link className="btn btn--ghost" href="/punjabi-counselling" lang="en">Read this in English</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container reading">
          <div className="prose">
            <Breadcrumbs
              schema={false}
              trail={[
                { name: 'ਪੰਜਾਬੀ', path: '/punjabi' },
                { name: 'ਖੇਤਰ', path: '/punjabi/regions' },
              ]}
            />

            <h2>ਇਹ ਸਾਰੇ ਪੰਨੇ ਇੱਕੋ ਗੱਲ ਨਹੀਂ ਕਹਿੰਦੇ</h2>
            <p>
              ਇਹ ਪਹਿਲਾਂ ਹੀ ਕਹਿ ਦੇਣਾ ਠੀਕ ਹੈ, ਕਿਉਂਕਿ ਆਮ ਧਾਰਨਾ ਇਹ ਹੁੰਦੀ ਹੈ ਕਿ ਹਰ ਸ਼ਹਿਰ ਦਾ ਪੰਨਾ ਉਹੀ ਗੱਲ ਦੁਹਰਾਉਂਦਾ
              ਹੈ, ਬੱਸ ਨਾਂ ਬਦਲ ਕੇ। ਇੱਥੇ ਇਹ ਗੱਲ ਗ਼ਲਤ ਹੈ, ਅਤੇ ਜੋ ਇਹ ਮੰਨ ਲਵੇਗਾ ਉਹ ਆਪਣੇ ਇਲਾਕੇ ਲਈ ਗ਼ਲਤ ਪੰਨਾ ਪੜ੍ਹ ਲਵੇਗਾ।
            </p>
            <p>
              ਲੋਅਰ ਮੇਨਲੈਂਡ ਤੋਂ ਬਾਹਰ, ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਲਗਭਗ ਹਰ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲਾ ਕਲੀਨੀਕਲ ਕਾਊਂਸਲਰ ਜਿਸ ਦਾ ਦਫ਼ਤਰ
              ਹੈ, ਘੰਟਿਆਂ ਦੀ ਦੂਰੀ ਉੱਤੇ ਹੈ। ਸਰੀ, ਐਬਟਸਫੋਰਡ ਅਤੇ ਵੈਨਕੂਵਰ ਵਿੱਚ ਇਸ ਦਾ ਉਲਟ ਸੱਚ ਹੈ, ਅਤੇ ਉੱਥੇ ਰਹਿਣ ਵਾਲੇ
              ਨੂੰ ਕੁਝ ਹੋਰ ਕਹਿਣਾ ਸਾਫ਼ ਝੂਠ ਹੋਵੇਗਾ। ਇਸ ਲਈ ਉਹ ਪੰਨੇ ਵੱਖਰੀ ਗੱਲ ਕਰਦੇ ਹਨ, ਅਤੇ ਉਹ ਗੱਲ ਵੈਸੇ ਵੀ ਵਧੇਰੇ ਵਜ਼ਨਦਾਰ ਨਿਕਲਦੀ ਹੈ।
            </p>

            <Figure name="bc-reach" />

            <h2>ਜਿੱਥੇ ਸਭ ਤੋਂ ਨੇੜਲਾ ਪੰਜਾਬੀ ਕਾਊਂਸਲਰ ਘੰਟਿਆਂ ਦੀ ਦੂਰੀ ਉੱਤੇ ਹੈ</h2>
            <p>
              ਇਨ੍ਹਾਂ ਇਲਾਕਿਆਂ ਵਿੱਚ ਆਨਲਾਈਨ ਪ੍ਰੈਕਟਿਸ ਕਿਸੇ ਨੂੰ ਆਹਮੋ-ਸਾਹਮਣੇ ਮਿਲਣ ਦਾ ਸਸਤਾ ਬਦਲ ਨਹੀਂ। ਅਸਲ ਵਿੱਚ ਇਹੀ
              ਇੱਕੋ-ਇੱਕ ਰਾਹ ਹੈ ਜੋ ਮੌਜੂਦ ਹੈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਹਰ ਪੰਨੇ ਉੱਤੇ ਉਸ ਇਲਾਕੇ ਦੀ ਵਸੋਂ ਦਾ ਅੰਕੜਾ ਅਤੇ ਉਸ ਦਾ ਸਰੋਤ ਦਿੱਤਾ ਹੋਇਆ ਹੈ।
            </p>
            <div className="grid grid-3" style={{ marginTop: 24, marginBottom: 8 }}>
              {SCARCITY.map((s) => <Card key={s} slug={s} />)}
            </div>

            <h2>ਜਿੱਥੇ ਕੋਈ ਕਮੀ ਨਹੀਂ, ਅਤੇ ਰੁਕਾਵਟ ਕੁਝ ਹੋਰ ਹੈ</h2>
            <p>
              ਸਰੀ ਵਿੱਚ ਕੈਨੇਡਾ ਦੇ ਕਿਸੇ ਵੀ ਸ਼ਹਿਰ ਨਾਲੋਂ ਵੱਧ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਲੋਕ ਰਹਿੰਦੇ ਹਨ, ਅਤੇ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ
              ਕਾਊਂਸਲਰਾਂ ਦੀ ਕੋਈ ਕਮੀ ਨਹੀਂ। ਐਬਟਸਫੋਰਡ ਅਤੇ ਵੈਨਕੂਵਰ ਵੀ ਬਹੁਤੇ ਪਿੱਛੇ ਨਹੀਂ। ਜੇ ਤੁਹਾਨੂੰ ਨੇੜੇ ਦਾ ਦਫ਼ਤਰ
              ਠੀਕ ਲੱਗਦਾ ਹੈ, ਤਾਂ ਸਥਾਨਕ ਤੌਰ &rsquo;ਤੇ ਕਿਸੇ ਨੂੰ ਮਿਲਣਾ ਬਿਲਕੁਲ ਚੰਗੀ ਚੋਣ ਹੈ, ਅਤੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀ ਕਾਲ ਉੱਤੇ ਤੁਹਾਨੂੰ ਇਹੀ ਕਿਹਾ ਜਾਵੇਗਾ।
            </p>
            <p>
              ਇਨ੍ਹਾਂ ਤਿੰਨਾਂ ਸ਼ਹਿਰਾਂ ਤੋਂ ਲੋਕ ਜਿਸ ਕਾਰਨ ਲਿਖਦੇ ਹਨ ਉਹ ਵਧੇਰੇ ਸੌੜਾ ਹੈ ਅਤੇ ਉੱਚੀ ਕਹਿਣਾ ਔਖਾ: ਇੰਨੇ ਜੁੜੇ ਹੋਏ
              ਭਾਈਚਾਰੇ ਵਿੱਚ, ਜਿਸ ਕਾਊਂਸਲਰ ਦੀ ਸਿਫ਼ਾਰਸ਼ ਹੁੰਦੀ ਹੈ ਉਹ ਅਕਸਰ ਉਨ੍ਹਾਂ ਹੀ ਜਾਣ-ਪਛਾਣਾਂ ਦੇ ਅੰਦਰ ਹੁੰਦਾ ਹੈ ਜਿਨ੍ਹਾਂ
              ਵਿੱਚ ਤੁਸੀਂ ਹੋ। ਗੁਪਤਤਾ ਹਰ ਥਾਂ ਕਾਨੂੰਨੀ ਫ਼ਰਜ਼ ਹੈ। ਦੂਰੀ ਉਹ ਚੀਜ਼ ਹੈ ਜੋ ਇਸ ਨੂੰ ਸੱਚ ਮਹਿਸੂਸ ਕਰਵਾਉਂਦੀ ਹੈ।
            </p>
            <div className="grid grid-3" style={{ marginTop: 24, marginBottom: 8 }}>
              {DISTANCE.map((s) => <Card key={s} slug={s} />)}
            </div>

            <h2>ਜੇ ਤੁਹਾਡਾ ਇਲਾਕਾ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ</h2>
            <p>
              ਸੈਸ਼ਨ ਉੱਤੇ ਇਸ ਦਾ ਕੋਈ ਫ਼ਰਕ ਨਹੀਂ ਪੈਂਦਾ। ਪ੍ਰੈਕਟਿਸ ਪੂਰੇ ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਰਜਿਸਟਰਡ ਹੈ ਅਤੇ ਸੂਬੇ ਵਿੱਚ
              ਕਿਤੇ ਵੀ ਰਹਿੰਦੇ ਲੋਕਾਂ ਨਾਲ ਕੰਮ ਕਰਦੀ ਹੈ। ਉੱਪਰਲੇ ਇਲਾਕਿਆਂ ਦੇ ਪੰਨੇ ਇਸ ਲਈ ਹਨ ਕਿ ਉਨ੍ਹਾਂ ਲਈ ਵਸੋਂ ਦਾ
              ਜਾਂਚਣਯੋਗ ਅੰਕੜਾ ਮਿਲ ਸਕਿਆ, ਨਾ ਕਿ ਇਸ ਲਈ ਕਿ ਸਿਰਫ਼ ਉੱਥੇ ਹੀ ਸੇਵਾ ਮਿਲਦੀ ਹੈ। ਨਨਾਇਮੋ, ਕੂਟਨੇਜ਼ ਅਤੇ ਪੀਸ ਵੀ
              ਓਨੇ ਹੀ ਅਸਲ ਹਨ, ਅਤੇ ਉਦੋਂ ਤੱਕ ਸੂਚੀ ਤੋਂ ਬਾਹਰ ਰਹਿਣਗੇ ਜਦੋਂ ਤੱਕ ਅੰਦਾਜ਼ੇ ਦੀ ਥਾਂ ਸਹੀ ਅੰਕੜੇ ਨਹੀਂ ਮਿਲ ਜਾਂਦੇ।
            </p>

            {speaker && (
              <>
                <h2>ਤੁਸੀਂ ਕਿਸ ਨਾਲ ਕੰਮ ਕਰੋਗੇ</h2>
                <p>
                  {withLetters(speaker)} ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕੰਮ ਕਰਦੀ ਹੈ ਅਤੇ ਇਸ ਵੇਲੇ ਨਵੇਂ ਕਲਾਇੰਟ ਲੈ ਰਹੀ ਹੈ। ਹਰ ਸ਼ਹਿਰ ਲਈ ਉਸ ਦਾ ਆਪਣਾ ਪੰਨਾ ਪੰਜਾਬੀ ਵਿੱਚ ਹੈ, ਉਸ ਦੇ{' '}
                  <Link href={`/practitioners/${speaker.slug}/pa`}>ਪੰਜਾਬੀ ਪ੍ਰੋਫ਼ਾਈਲ</Link> ਤੋਂ।
                </p>
                <ul className="place-siblings">
                  {placesFor(speaker.provinces).filter((c) => getPunjabiPlace(c.slug)).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/practitioners/${speaker.slug}/${c.slug}/pa`}>{PA_CITY[c.slug] ?? c.city}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2>ਅਗਲਾ ਕਦਮ</h2>
            <p>
              ਪਹਿਲੀ ਗੱਲਬਾਤ 30 ਮਿੰਟ ਦੀ ਹੈ, ਮੁਫ਼ਤ ਹੈ, ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ਕੁਝ ਵੀ ਕਰਨਾ ਜ਼ਰੂਰੀ ਨਹੀਂ। ਪੂਰੀ ਜਾਣਕਾਰੀ,
              ਖ਼ਰਚੇ ਅਤੇ ਬੀਮੇ ਸਮੇਤ, <Link href="/punjabi">ਪੰਜਾਬੀ ਵਾਲੇ ਮੁੱਖ ਪੰਨੇ</Link> ਉੱਤੇ ਹੈ।
            </p>
            <p>
              <Link className="btn btn--primary" href={site.bookingPath}>ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ</Link>
            </p>

            <p lang="en" style={{ fontSize: '.92rem', color: 'var(--ink-faint)', marginTop: 26 }}>
              This page is written in Punjabi. The same index in English is{' '}
              <Link href="/punjabi-counselling">Punjabi-speaking counselling by region</Link>; the
              region pages themselves are in English:{' '}
              <Link href="/punjabi-counselling/surrey">Surrey</Link>,{' '}
              <Link href="/punjabi-counselling/abbotsford">Abbotsford</Link>,{' '}
              <Link href="/punjabi-counselling/vancouver">Vancouver</Link>,{' '}
              <Link href="/punjabi-counselling/kelowna">Kelowna</Link>,{' '}
              <Link href="/punjabi-counselling/kamloops">Kamloops</Link> and{' '}
              <Link href="/punjabi-counselling/prince-george">Prince George</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

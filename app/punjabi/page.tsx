import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBasePunjabi } from '@/lib/og-meta';

const TITLE = 'ਪੰਜਾਬੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ | Punjabi counselling in BC';
const DESC =
  'ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ Registered Clinical Counsellor ਨਾਲ ਆਨਲਾਈਨ ਕਾਊਂਸਲਿੰਗ। Online counselling in Punjabi anywhere in BC.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: {
    canonical: `${site.domain}/punjabi`,
    languages: {
      'en-CA': `${site.domain}/services/punjabi-counselling`,
      'pa': `${site.domain}/punjabi`,
    },
  },
  openGraph: { ...ogBasePunjabi(`/punjabi`), title: TITLE, description: DESC, locale: 'pa_IN' },
};

/* The Punjabi-language surface.
 *
 * The rest of the site had its Punjabi mentions cut back deliberately — they
 * were spread thinly across every page, which read as a script rather than a
 * fact. This is the opposite move and the two are consistent: concentrate it
 * in one page written *in* the language, for someone searching in it, rather
 * than sprinkling the word everywhere in English.
 *
 * Written as a Punjabi speaker would say it, with the English clinical terms
 * left in English — RCC, EMDR, extended health — because those are the words
 * people actually use and search for, and translating them would make the page
 * less useful, not more authentic.
 *
 * The counsellor-name rule holds here as everywhere: no name on this page.
 */
/* THIS PAGE USED TO READ ?sent AND WAS THEREFORE RENDERED PER REQUEST.
 *
 * The reason given was sound — sending a Punjabi speaker to an English
 * confirmation page would undo the one thing this page exists to do — but the
 * cost was larger than it looked. An on-demand route leaves no file in
 * .next/server/app, so `npm run seo` skipped this page entirely and could not
 * see that it links to all the region pages. That made the Punjabi cluster look
 * orphaned in a link audit when it is not, and it meant this page was never
 * checked by the gate that checks every other page on the site.
 *
 * The confirmation now lives at /punjabi/sent, in Punjabi, built entirely from
 * the strings that were already here. The reasoning is preserved and the route
 * is static again. */
export default function PunjabiPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': abs('/punjabi'),
      name: TITLE,
      description: DESC,
      inLanguage: 'pa',
      isPartOf: siteRef,
      about: orgRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'ਪੰਜਾਬੀ', item: abs('/punjabi') },
      ],
    },
  ];

  return (
    <div lang="pa" className={gurmukhi.variable}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container container--article">
          <p className="eyebrow" lang="en">Online across British Columbia</p>
          <h1 className="gurmukhi">ਕੁਝ ਗੱਲਾਂ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਹੀ ਠੀਕ ਲੱਗਦੀਆਂ ਹਨ।</h1>
          <p className="direct-answer">
            ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਕਿਤੇ ਵੀ, ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ Registered Clinical Counsellor (MA, RCC)
            ਨਾਲ ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ ਕਾਊਂਸਲਿੰਗ। ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ, ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ —
            ਤੁਹਾਨੂੰ ਪਹਿਲਾਂ ਤੋਂ ਫ਼ੈਸਲਾ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ। ਪਹਿਲੀ 15 ਮਿੰਟ ਦੀ ਗੱਲਬਾਤ ਮੁਫ਼ਤ ਹੈ।
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>
              ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ
            </Link>
            <Link className="btn btn--ghost" href="/services/punjabi-counselling" lang="en">
              Read this in English
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container reading">
          <div className="prose">
            <Breadcrumbs schema={false} trail={[{ name: 'ਪੰਜਾਬੀ', path: '/punjabi' }]} />

            <h2>ਤੁਹਾਨੂੰ ਸਭ ਕੁਝ ਸਮਝਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ ਪਵੇਗੀ</h2>
            <p>
              ਜਦੋਂ ਗੱਲ ਪਰਿਵਾਰ ਦੀ, ਇੱਜ਼ਤ ਦੀ, ਜਾਂ &ldquo;ਲੋਕ ਕੀ ਕਹਿਣਗੇ&rdquo; ਦੀ ਆਉਂਦੀ ਹੈ, ਤਾਂ ਬਹੁਤ ਵਾਰ ਅੱਧਾ
              ਸਮਾਂ ਸਿਰਫ਼ ਪਿਛੋਕੜ ਸਮਝਾਉਣ ਵਿੱਚ ਹੀ ਲੱਗ ਜਾਂਦਾ ਹੈ। ਇੱਥੇ ਉਹ ਸਮਾਂ ਬਚ ਜਾਂਦਾ ਹੈ। ਪੀੜ੍ਹੀਆਂ ਦੀ ਚੁੱਪ,
              ਮਾਪਿਆਂ ਦੀਆਂ ਉਮੀਦਾਂ, ਅਤੇ ਪਰਵਾਸ ਦੇ ਬੱਚਿਆਂ ਉੱਤੇ ਪੈਂਦਾ ਬੋਝ — ਇਹ ਸਭ ਪਹਿਲਾਂ ਤੋਂ ਸਮਝਿਆ ਹੋਇਆ ਹੈ।
            </p>
            <p>
              ਕੁਝ ਗੱਲਾਂ ਲਈ ਸਹੀ ਸ਼ਬਦ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਹੀ ਮਿਲਦੇ ਹਨ। ਜੇ ਤੁਸੀਂ ਸੈਸ਼ਨ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰਦੇ ਰਹੋ, ਤਾਂ
              ਤੁਸੀਂ ਆਪਣੇ ਅਹਿਸਾਸ ਤੋਂ ਇੱਕ ਕਦਮ ਦੂਰ ਰਹਿ ਜਾਂਦੇ ਹੋ — ਉਸ ਨੂੰ ਮਹਿਸੂਸ ਕਰਨ ਦੀ ਬਜਾਏ ਬਿਆਨ ਕਰਦੇ ਰਹਿੰਦੇ ਹੋ।
            </p>

            <h2>ਕਿਹੜੀਆਂ ਗੱਲਾਂ ਲਈ ਲੋਕ ਆਉਂਦੇ ਹਨ</h2>
            <ul className="checklist">
              <li>
                <strong>ਚਿੰਤਾ ਅਤੇ ਘਬਰਾਹਟ (anxiety)</strong> — ਲਗਾਤਾਰ ਫ਼ਿਕਰ, ਰਾਤ ਨੂੰ ਨੀਂਦ ਨਾ ਆਉਣਾ,
                ਸਰੀਰ ਦਾ ਸ਼ਾਂਤ ਨਾ ਹੋਣਾ।
              </li>
              <li>
                <strong>ਉਦਾਸੀ ਅਤੇ ਥਕਾਵਟ (depression, burnout)</strong> — ਕਿਸੇ ਚੀਜ਼ ਵਿੱਚ ਦਿਲ ਨਾ ਲੱਗਣਾ,
                ਕੰਮ ਤੋਂ ਥੱਕ ਜਾਣਾ।
              </li>
              <li>
                <strong>ਪੁਰਾਣੇ ਸਦਮੇ (trauma, EMDR)</strong> — ਕੋਈ ਗੱਲ ਜੋ ਬਹੁਤ ਪਹਿਲਾਂ ਵਾਪਰੀ ਪਰ ਅਜੇ ਵੀ
                ਅਸਰ ਕਰਦੀ ਹੈ।
              </li>
              <li>
                <strong>ਰਿਸ਼ਤੇ ਅਤੇ ਵਿਆਹ (couples counselling)</strong> — ਵਾਰ-ਵਾਰ ਉਹੀ ਝਗੜਾ, ਜਾਂ ਦੂਰੀ
                ਜੋ ਵਧਦੀ ਜਾ ਰਹੀ ਹੈ।
              </li>
              <li>
                <strong>ਪਰਿਵਾਰਕ ਦਬਾਅ</strong> — ਫ਼ਰਜ਼ ਅਤੇ ਆਪਣੀ ਜ਼ਿੰਦਗੀ ਵਿਚਕਾਰ ਫਸ ਜਾਣਾ।
              </li>
            </ul>

            <Figure name="bc-reach" />

            <h2>ਇਹ ਕਿਵੇਂ ਚੱਲਦਾ ਹੈ</h2>
            <p>
              ਸਾਰੇ ਸੈਸ਼ਨ ਆਨਲਾਈਨ ਹੁੰਦੇ ਹਨ, ਸੁਰੱਖਿਅਤ ਵੀਡੀਓ ਰਾਹੀਂ — ਬ੍ਰਿਟਿਸ਼ ਕੋਲੰਬੀਆ ਵਿੱਚ ਕਿਤੇ ਵੀ। ਕੋਈ ਦਫ਼ਤਰ
              ਨਹੀਂ, ਇਸ ਲਈ ਕਿਸੇ ਕਲੀਨਿਕ ਦੇ ਬਾਹਰ ਕਿਸੇ ਜਾਣਕਾਰ ਦੇ ਮਿਲਣ ਦਾ ਡਰ ਵੀ ਨਹੀਂ। ਇਹ ਗੱਲ ਬਹੁਤ ਲੋਕਾਂ ਲਈ
              ਸਭ ਤੋਂ ਵੱਡੀ ਰੁਕਾਵਟ ਹੁੰਦੀ ਹੈ, ਖ਼ਾਸ ਕਰਕੇ ਸਰੀ ਅਤੇ ਐਬਟਸਫ਼ੋਰਡ ਵਰਗੇ ਸ਼ਹਿਰਾਂ ਵਿੱਚ।
            </p>
            <p>
              ਹਰ ਸੈਸ਼ਨ 50 ਮਿੰਟ ਦਾ ਹੁੰਦਾ ਹੈ। ਪਹਿਲਾਂ 15 ਮਿੰਟ ਦੀ ਮੁਫ਼ਤ ਗੱਲਬਾਤ ਹੁੰਦੀ ਹੈ ਤਾਂ ਜੋ ਤੁਸੀਂ ਦੇਖ ਸਕੋ ਕਿ
              ਇਹ ਤੁਹਾਡੇ ਲਈ ਠੀਕ ਹੈ ਜਾਂ ਨਹੀਂ। ਉਸ ਤੋਂ ਬਾਅਦ ਕੁਝ ਬੁੱਕ ਕਰਨਾ ਜ਼ਰੂਰੀ ਨਹੀਂ।
            </p>

            <h2>ਪਹਿਲੇ ਸੈਸ਼ਨ ਵਿੱਚ ਕੀ ਹੁੰਦਾ ਹੈ</h2>
            <p>
              ਬਹੁਤ ਸਾਰੇ ਲੋਕ ਇਸ ਕਰਕੇ ਦੇਰ ਕਰਦੇ ਹਨ ਕਿਉਂਕਿ ਉਹਨਾਂ ਨੂੰ ਪਤਾ ਨਹੀਂ ਹੁੰਦਾ ਕਿ ਪਹਿਲੇ ਸੈਸ਼ਨ ਵਿੱਚ ਕੀ
              ਹੋਵੇਗਾ — ਅਤੇ ਮਨ ਵਿੱਚ ਉਸ ਤੋਂ ਕਿਤੇ ਔਖੀ ਤਸਵੀਰ ਬਣ ਜਾਂਦੀ ਹੈ। ਅਸਲ ਵਿੱਚ ਪਹਿਲਾ ਸੈਸ਼ਨ ਜ਼ਿਆਦਾਤਰ ਇਹ
              ਸਮਝਣ ਲਈ ਹੁੰਦਾ ਹੈ ਕਿ ਤੁਸੀਂ ਕੀ ਬਦਲਣਾ ਚਾਹੁੰਦੇ ਹੋ।
            </p>
            <p>
              ਤੁਹਾਨੂੰ ਆਪਣੀ ਸਾਰੀ ਜ਼ਿੰਦਗੀ ਸ਼ੁਰੂ ਤੋਂ ਸੁਣਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ। &ldquo;ਮੈਂ ਹਾਲੇ ਇਸ ਬਾਰੇ ਗੱਲ ਨਹੀਂ ਕਰਨੀ
              ਚਾਹੁੰਦਾ&rdquo; ਕਹਿਣਾ ਬਿਲਕੁਲ ਠੀਕ ਹੈ, ਅਤੇ ਉਹ ਪੂਰਾ ਜਵਾਬ ਹੈ। ਕੋਈ ਵੀ ਗੱਲ ਤੁਹਾਡੀ ਮਰਜ਼ੀ ਤੋਂ ਬਿਨਾਂ
              ਅੱਗੇ ਨਹੀਂ ਵਧਾਈ ਜਾਂਦੀ।
            </p>
            <p>
              ਕਾਊਂਸਲਰ ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਲਿਖਦਾ ਅਤੇ ਕੋਈ ਰਸਮੀ ਤਸ਼ਖ਼ੀਸ (diagnosis) ਨਹੀਂ ਕਰਦਾ। ਜੇ ਤੁਹਾਨੂੰ ਉਹ ਚਾਹੀਦਾ
              ਹੈ, ਤਾਂ ਤੁਹਾਨੂੰ ਸਾਫ਼ ਦੱਸ ਦਿੱਤਾ ਜਾਵੇਗਾ ਕਿ ਕਿੱਥੇ ਜਾਣਾ ਹੈ — ਅਤੇ ਇਹ ਵੀ ਇੱਕ ਚੰਗਾ ਨਤੀਜਾ ਹੈ।
            </p>

            <h2>ਪਰਿਵਾਰ ਨੂੰ ਦੱਸਣਾ ਜਾਂ ਨਾ ਦੱਸਣਾ</h2>
            <p>
              ਸਾਡੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡਾ ਸਵਾਲ ਅਕਸਰ ਇਹ ਹੁੰਦਾ ਹੈ: ਘਰ ਵਿੱਚ ਦੱਸਾਂ ਜਾਂ ਨਾ? ਇਸ ਦਾ ਕੋਈ ਇੱਕ
              ਸਹੀ ਜਵਾਬ ਨਹੀਂ, ਅਤੇ ਇਹ ਫ਼ੈਸਲਾ ਸਿਰਫ਼ ਤੁਹਾਡਾ ਹੈ। ਬਹੁਤ ਲੋਕ ਪਹਿਲਾਂ ਕੁਝ ਸੈਸ਼ਨ ਇਕੱਲੇ ਕਰਦੇ ਹਨ ਅਤੇ
              ਬਾਅਦ ਵਿੱਚ ਸੋਚਦੇ ਹਨ। ਸੈਸ਼ਨ ਆਨਲਾਈਨ ਹੋਣ ਕਰਕੇ ਇਹ ਸੌਖਾ ਵੀ ਹੋ ਜਾਂਦਾ ਹੈ।
            </p>

            <h2>ਖ਼ਰਚਾ ਅਤੇ ਬੀਮਾ (insurance)</h2>
            <p>
              MSP ਪ੍ਰਾਈਵੇਟ ਕਾਊਂਸਲਿੰਗ ਦਾ ਖ਼ਰਚਾ ਨਹੀਂ ਦਿੰਦਾ। ਪਰ ਬਹੁਤ ਸਾਰੀਆਂ extended health ਯੋਜਨਾਵਾਂ ਦਿੰਦੀਆਂ
              ਹਨ। ਬੁੱਕ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਗੱਲ ਜ਼ਰੂਰ ਪੁੱਛੋ:{' '}
              <strong>ਕੀ ਤੁਹਾਡੀ ਯੋਜਨਾ ਖ਼ਾਸ ਤੌਰ ਤੇ &ldquo;Registered Clinical Counsellor&rdquo; ਨੂੰ ਕਵਰ ਕਰਦੀ
              ਹੈ?</strong>{' '}
              ਕਈ ਯੋਜਨਾਵਾਂ ਸਿਰਫ਼ psychologist ਨੂੰ ਕਵਰ ਕਰਦੀਆਂ ਹਨ, ਅਤੇ ਲੋਕਾਂ ਨੂੰ ਇਹ ਪਹਿਲੇ ਸੈਸ਼ਨ ਤੋਂ ਬਾਅਦ ਪਤਾ
              ਲੱਗਦਾ ਹੈ।
            </p>
            <p lang="en">
              Full details in English:{' '}
              <Link href="/pricing">fees and coverage</Link> ·{' '}
              <Link href="/resources/bc-extended-health-coverage-for-counselling">
                extended health coverage in BC
              </Link>{' '}
              · <Link href="/tools/therapy-cost-bc">cost estimator</Link>
            </p>

            <h2>ਗੁਪਤਤਾ (confidentiality)</h2>
            <p>
              ਜੋ ਕੁਝ ਸੈਸ਼ਨ ਵਿੱਚ ਕਿਹਾ ਜਾਂਦਾ ਹੈ, ਉਹ ਗੁਪਤ ਰਹਿੰਦਾ ਹੈ। ਪਰਿਵਾਰ ਨੂੰ ਦੱਸਣਾ ਤੁਹਾਡੀ ਮਰਜ਼ੀ ਹੈ, ਕਿਸੇ ਹੋਰ
              ਦੀ ਨਹੀਂ। ਇਸ ਦੀਆਂ ਕਾਨੂੰਨੀ ਹੱਦਾਂ ਬਹੁਤ ਸੀਮਤ ਹਨ ਅਤੇ{' '}
              <Link href="/privacy" lang="en">privacy and confidentiality</Link> ਪੰਨੇ ਉੱਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ
              ਲਿਖੀਆਂ ਹੋਈਆਂ ਹਨ।
            </p>

            <div className="crisis" style={{ marginTop: 30 }}>
              <p style={{ margin: 0 }}>
                <strong>ਇਹ ਐਮਰਜੈਂਸੀ ਸੇਵਾ ਨਹੀਂ ਹੈ।</strong> ਜੇ ਤੁਸੀਂ ਸੰਕਟ ਵਿੱਚ ਹੋ, ਕੈਨੇਡਾ ਵਿੱਚ ਕਿਸੇ ਵੀ ਵੇਲੇ{' '}
                <a href="tel:988"><strong>9-8-8</strong></a> ਉੱਤੇ ਕਾਲ ਜਾਂ ਟੈਕਸਟ ਕਰੋ। BC ਵਿੱਚ{' '}
                <a href="tel:3106789"><strong>310-6789</strong></a>। ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ{' '}
                <a href="tel:911"><strong>9-1-1</strong></a>।
              </p>
            </div>

            <h2>ਅਗਲਾ ਕਦਮ</h2>
            <p>
              ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ ਹੈ, ਮੁਫ਼ਤ ਹੈ, ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ਕੁਝ ਵੀ ਕਰਨਾ ਜ਼ਰੂਰੀ ਨਹੀਂ। ਜੇ ਲੱਗੇ ਕਿ ਕੋਈ
              ਹੋਰ ਤੁਹਾਡੇ ਲਈ ਬਿਹਤਰ ਹੋਵੇਗਾ, ਤਾਂ ਉਹ ਵੀ ਸਾਫ਼ ਦੱਸਿਆ ਜਾਵੇਗਾ।
            </p>
            <p>
              <Link className="btn btn--primary" href={site.bookingPath}>
                ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ
              </Link>
            </p>
            {/* The only page on the site where booking was still the sole route
                to contact. The sitewide English form would have been the wrong
                fix here, so this is the same machinery with Punjabi copy.
                THE PUNJABI WORDING SHOULD BE READ BY THE COUNSELLOR before it
                is relied on — it is written to match the register of the rest
                of this page, but it is the practice's own language and voice,
                not mine to finalise. */}
            <form method="POST" action="/api/enquiry" className="lead-form" id="form"
                style={{ marginTop: 30 }}>
                <input type="hidden" name="source" value="/punjabi" />
                {/* The confirmation is its own Punjabi page, which is what lets
                    this route stay static. See the note at the top. */}
                <input type="hidden" name="returnTo" value="/punjabi/sent" />
                <div className="hp" aria-hidden="true">
                  <label htmlFor="hp-pa">Company</label>
                  <input id="hp-pa" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <p className="lead-form-title" lang="pa">ਜਾਂ ਬੱਸ ਲਿਖ ਕੇ ਦੱਸੋ।</p>
                <p className="lead-form-note" lang="pa">
                  ਇੱਕ ਲਾਈਨ ਕਾਫ਼ੀ ਹੈ। ਇਹ ਸਿੱਧਾ ਤੁਹਾਡੇ ਕਾਊਂਸਲਰ ਕੋਲ ਜਾਂਦਾ ਹੈ, ਕਿਸੇ ਸਹਾਇਕ ਕੋਲ ਨਹੀਂ,
                  ਅਤੇ ਇੱਕ ਕੰਮ-ਕਾਜੀ ਦਿਨ ਦੇ ਅੰਦਰ ਜਵਾਬ ਮਿਲੇਗਾ।
                </p>
                <label htmlFor="pa-message" className="sr-only">ਸੁਨੇਹਾ</label>
                <textarea id="pa-message" name="message" required rows={3} lang="pa"
                  className="lead-form-area" placeholder="ਜੋ ਵੀ ਤੁਸੀਂ ਲਿਖ ਸਕਦੇ ਹੋ।" />
                <div className="lead-form-row">
                  <label htmlFor="pa-email" className="sr-only">ਈਮੇਲ</label>
                  <input id="pa-email" name="email" type="email" required
                    placeholder="you@example.com" autoComplete="email"
                    autoCapitalize="none" spellCheck={false} />
                  <button type="submit" className="btn btn--primary" lang="pa">ਭੇਜੋ</button>
                </div>
                <p className="lead-form-note" lang="pa">
                  ਕੋਈ ਮੇਲਿੰਗ ਲਿਸਟ ਨਹੀਂ, ਅਤੇ ਕੋਈ ਕਲਾਇੰਟ ਰਿਕਾਰਡ ਨਹੀਂ ਬਣਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਕਲੀਨਿਕਲ ਗੱਲਾਂ
                  ਸੈਸ਼ਨ ਲਈ ਰੱਖੋ &mdash; ਆਮ ਈਮੇਲ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੁੰਦੀ। ਜੇ ਤੁਸੀਂ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ ਤਾਂ
                  911 &rsquo;ਤੇ ਕਾਲ ਕਰੋ, ਜਾਂ 9-8-8 &rsquo;ਤੇ ਕਾਲ ਜਾਂ ਟੈਕਸਟ ਕਰੋ।
                </p>
              </form>

            <p lang="pa" style={{ marginTop: 30 }}>
              ਖੇਤਰ ਅਨੁਸਾਰ:{' '}
              <Link href="/punjabi-counselling/surrey">ਸਰੀ</Link> ·{' '}
              <Link href="/punjabi-counselling/abbotsford">ਐਬਟਸਫੋਰਡ</Link> ·{' '}
              <Link href="/punjabi-counselling/vancouver">ਵੈਨਕੂਵਰ</Link> ·{' '}
              <Link href="/punjabi-counselling/kelowna">ਕੈਲੋਨਾ</Link> ·{' '}
              <Link href="/punjabi-counselling/kamloops">ਕੈਮਲੂਪਸ</Link> ·{' '}
              <Link href="/punjabi-counselling/prince-george">ਪ੍ਰਿੰਸ ਜਾਰਜ</Link>
            </p>
            <p lang="en" style={{ fontSize: '.92rem', color: 'var(--ink-faint)', marginTop: 26 }}>
              This page is written in Punjabi. The same information in English is on{' '}
              <Link href="/services/punjabi-counselling">Punjabi-speaking counselling</Link>, and{' '}
              <Link href="/services/punjabi-counselling">counselling for South Asian adults</Link>{' '}
              covers the cultural side in more depth. There is a{' '}
              <Link href="/punjabi-counselling">full index of the region pages</Link>, in English —{' '}
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

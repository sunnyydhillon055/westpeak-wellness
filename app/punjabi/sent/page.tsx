import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBasePunjabi } from '@/lib/og-meta';

/* The Punjabi confirmation.
 *
 * WHY THIS PAGE EXISTS AT ALL
 *
 * /punjabi used to render its own confirmation by reading ?sent=ok, and the
 * comment there gave a good reason: sending a Punjabi speaker to an English
 * confirmation page would undo the one thing that page exists to do. That
 * reasoning was right, and the cost of it was that /punjabi could not be
 * statically generated — reading a query parameter opts a route out.
 *
 * The cost was invisible until it was measured. An on-demand route leaves no
 * file in .next/server/app, so `npm run seo` skips it and prints a warning that
 * its outgoing links cannot be seen — which meant the four Punjabi region pages
 * looked far more orphaned than they are, and /punjabi itself was never audited
 * for the things the gate checks on every other page.
 *
 * So this page keeps the original reasoning and removes the cost: the
 * confirmation stays in Punjabi, and /punjabi becomes static.
 *
 * ALL PUNJABI COPY HERE IS LIFTED VERBATIM from strings already on /punjabi,
 * which are the practice's own words. Nothing on this page is newly translated.
 * That is deliberate — the existing note on /punjabi asks that Punjabi wording
 * be read by the counsellor before it is relied on, and the safest way to
 * honour that is to add no new wording at all.
 *
 * noindex, for the same reason /message-sent is: it is reachable only by
 * posting a form, and indexed it would promise a reply to a message the
 * searcher never sent.
 */

const TITLE = 'ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਪਹੁੰਚ ਗਿਆ ਹੈ';
const DESC = 'Confirmation, in Punjabi, that your message reached Westpeak Wellness.';

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBasePunjabi('/punjabi/sent') },
  title: { absolute: `${TITLE} | ${site.name}` },
  description: DESC,
  robots: { index: false, follow: true },
  alternates: { canonical: `${site.domain}/punjabi/sent` },
};

export default function PunjabiSentPage() {
  return (
    <div lang="pa" className={gurmukhi.variable}>
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container container--article">
          <h1 className="gurmukhi">ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਪਹੁੰਚ ਗਿਆ ਹੈ।</h1>
          <p className="direct-answer" lang="pa">
            ਇੱਕ ਕੰਮ-ਕਾਜੀ ਦਿਨ ਦੇ ਅੰਦਰ ਜਵਾਬ ਮਿਲੇਗਾ, ਅਤੇ ਇੱਕ ਕਾਪੀ ਤੁਹਾਡੇ ਈਮੇਲ ਵਿੱਚ ਹੈ।
            ਤੁਹਾਨੂੰ ਹੋਰ ਕੁਝ ਕਰਨ ਦੀ ਲੋੜ ਨਹੀਂ।
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs
            trail={[
              { name: 'ਪੰਜਾਬੀ', path: '/punjabi' },
              { name: 'ਸੁਨੇਹਾ ਪਹੁੰਚ ਗਿਆ', path: '/punjabi/sent' },
            ]}
          />
          {/* What will NOT happen — the same reassurance /message-sent carries,
              in the wording already used on /punjabi. */}
          <p lang="pa">
            ਕੋਈ ਮੇਲਿੰਗ ਲਿਸਟ ਨਹੀਂ, ਅਤੇ ਕੋਈ ਕਲਾਇੰਟ ਰਿਕਾਰਡ ਨਹੀਂ ਬਣਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਕਲੀਨਿਕਲ ਗੱਲਾਂ
            ਸੈਸ਼ਨ ਲਈ ਰੱਖੋ &mdash; ਆਮ ਈਮੇਲ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੁੰਦੀ। ਜੇ ਤੁਸੀਂ ਤੁਰੰਤ ਖ਼ਤਰੇ ਵਿੱਚ ਹੋ ਤਾਂ
            911 &rsquo;ਤੇ ਕਾਲ ਕਰੋ, ਜਾਂ 9-8-8 &rsquo;ਤੇ ਕਾਲ ਜਾਂ ਟੈਕਸਟ ਕਰੋ।
          </p>

          <p style={{ marginTop: 28 }}>
            <Link className="btn btn--ghost" href="/punjabi" lang="pa">
              ਵਾਪਸ
            </Link>
          </p>

          <p lang="pa" style={{ marginTop: 24 }}>
            ਖੇਤਰ ਅਨੁਸਾਰ:{' '}
            <Link href="/punjabi-counselling/surrey">ਸਰੀ</Link> ·{' '}
            <Link href="/punjabi-counselling/abbotsford">ਐਬਟਸਫੋਰਡ</Link> ·{' '}
            <Link href="/punjabi-counselling/vancouver">ਵੈਨਕੂਵਰ</Link> ·{' '}
            <Link href="/punjabi-counselling/kelowna">ਕੈਲੋਨਾ</Link> ·{' '}
            <Link href="/punjabi-counselling/kamloops">ਕੈਮਲੂਪਸ</Link> ·{' '}
            <Link href="/punjabi-counselling/prince-george">ਪ੍ਰਿੰਸ ਜਾਰਜ</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

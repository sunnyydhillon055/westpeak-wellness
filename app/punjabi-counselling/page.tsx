import type { Metadata } from 'next';
import Link from 'next/link';
import { punjabiRegions } from '@/lib/punjabi-regions';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import CtaBand from '@/components/CtaBand';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import { ogBase } from '@/lib/og-meta';

/* THE HUB THE PUNJABI CLUSTER NEVER HAD.
 *
 * /online-counselling has always had an index listing all six city pages.
 * app/punjabi-counselling/ contained only [region], so there was no equivalent
 * URL — the four region pages were reachable from each other, from /punjabi,
 * and from two city pages, and from nowhere else.
 *
 * A link audit on 18 Aug 2026 measured the result: the Punjabi pages averaged
 * 4.25 in-body inbound links against 7.5 for the city pages, and sat one
 * editorial click further from the homepage.
 *
 * WHAT THIS PAGE IS FOR, BEYOND LINKS
 *
 * It is not a directory of six identical pages. The regions argue different
 * things, and the difference is the point: Prince George, Kamloops and Kelowna
 * argue from scarcity — there is no Punjabi-speaking counsellor within hours.
 * Surrey, Abbotsford and Vancouver cannot argue that, because it would be
 * false, so they argue about distance from a community instead. This page says
 * so plainly, because a reader in Surrey who arrives expecting the scarcity
 * argument should be told immediately that it does not apply to them.
 *
 * The counsellor-name rule holds here as everywhere: no name on this page.
 */

/* Both of these are measured by `npm run seo`: title <= 60 including the site
   suffix, description <= 158. The first draft of this page failed both. */
const TITLE = 'Punjabi Counselling by Region in BC';
const DESC =
  'Punjabi-speaking online counselling across BC: Surrey, Abbotsford, Vancouver, Kelowna, Kamloops and Prince George. Sessions in Punjabi, English, or both.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: `${site.domain}/punjabi-counselling`,
    languages: {
      'en-CA': `${site.domain}/punjabi-counselling`,
      pa: `${site.domain}/punjabi`,
    },
  },
  openGraph: { ...ogBase(`/punjabi-counselling`), title: TITLE, description: DESC, url: `${site.domain}/punjabi-counselling` },
};

/* Which argument each region page actually makes. Kept here rather than in
   lib/punjabi-regions.ts because it describes the SHAPE of a page rather than
   its content, and the region file is already long. */
const ARGUMENT: Record<string, 'scarcity' | 'distance'> = {
  'prince-george': 'scarcity',
  kamloops: 'scarcity',
  kelowna: 'scarcity',
  surrey: 'distance',
  abbotsford: 'distance',
  vancouver: 'distance',
};

export default function PunjabiCounsellingIndex() {
  const scarcity = punjabiRegions.filter((r) => ARGUMENT[r.slug] !== 'distance');
  const distance = punjabiRegions.filter((r) => ARGUMENT[r.slug] === 'distance');

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': abs('/punjabi-counselling'),
      name: TITLE,
      description: DESC,
      inLanguage: 'en-CA',
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
        name: `Punjabi-speaking counselling for ${r.region}`,
        url: abs(`/punjabi-counselling/${r.slug}`),
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Punjabi counselling by region', item: abs('/punjabi-counselling') },
      ],
    },
  ];

  const Card = ({ r }: { r: (typeof punjabiRegions)[number] }) => (
    <div className="card">
      <h3 style={{ marginBottom: 6 }}>
        <Link href={`/punjabi-counselling/${r.slug}`}>
          Punjabi-speaking counselling for {r.region}
        </Link>
      </h3>
      <p style={{ marginBottom: 8, color: 'var(--ink-soft)', fontSize: '.9rem' }}>{r.wider}</p>
      <p style={{ marginBottom: 0 }}>{r.blurb}</p>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Punjabi and English, anywhere in BC</p>
          <h1>Punjabi-speaking counselling, by region</h1>
          <p className="lede">
            Sessions run in Punjabi, in English, or moving between the two, whichever the
            moment calls for. Because the practice is virtual, where you live changes what is
            available to you locally, but not what is available here.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/punjabi" lang="pa">ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs trail={[{ name: 'Punjabi counselling by region', path: '/punjabi-counselling' }]} />

          <h2>These pages do not all make the same argument</h2>
          <p>
            That is worth saying at the top, because the obvious assumption. That a page for
            each region says the same thing with the place name swapped, is wrong here, and
            a reader who assumes it will read the wrong page for where they live.
          </p>
          <p>
            Outside the Lower Mainland, virtually every Punjabi-speaking clinical counsellor
            in British Columbia with an office is hours away. In Surrey, Abbotsford and
            Vancouver the opposite is true, and pretending otherwise would be transparently
            false to anybody who lives there. So those pages argue something different, and
            it turns out to be the stronger argument anyway.
          </p>
          <Figure name="bc-reach" />

          <h2>Where the nearest Punjabi-speaking counsellor is hours away</h2>
          <p>
            In these regions a virtual practice is not a cheaper alternative to seeing
            somebody in person. It is realistically the only option that exists. Every one of
            these pages carries the local population figure and the source it came from.
          </p>
          <div className="grid grid-3" style={{ marginTop: 24, marginBottom: 8 }}>
            {scarcity.map((r) => <Card key={r.slug} r={r} />)}
          </div>

          <h2>Where there is no shortage, and the barrier is something else</h2>
          <p>
            Surrey has the largest Punjabi-speaking population of any city in Canada and no
            shortage of Punjabi-speaking counsellors. Abbotsford and Vancouver are not far
            behind. If a local office suits you, seeing somebody locally is a perfectly good
            choice and you would be told so on a consultation call.
          </p>
          <p>
            The reason people write in from these three cities is narrower and harder to say
            out loud: in a community that interconnected, the counsellor who comes recommended
            is often inside the same networks you are. Confidentiality is a legal duty
            everywhere. Distance is what makes it feel true.
          </p>
          <div className="grid grid-3" style={{ marginTop: 24, marginBottom: 8 }}>
            {distance.map((r) => <Card key={r.slug} r={r} />)}
          </div>

          <h2>If your region is not listed</h2>
          <p>
            It makes no difference to the session. The practice is registered across British
            Columbia and works with clients anywhere in the province. The regions above have
            pages because a checkable population figure could be found for them, not because
            they are the only places served. Nanaimo, the Kootenays and the Peace are equally
            real, and they stay off this list until the numbers can be sourced properly rather
            than estimated.
          </p>
          <p>
            The service page on{' '}
            <Link href="/services/punjabi-counselling">Punjabi-speaking counselling</Link>{' '}
            covers how sessions run,{' '}
            <Link href="/services/punjabi-counselling">counselling for South Asian adults</Link>{' '}
            covers the cultural ground in more depth, and{' '}
            <Link href="/for/punjabi-speaking-couples">Punjabi-speaking couples</Link>{' '}
            covers work with two people rather than one. There is also a{' '}
            <Link href="/online-counselling">city-by-city index</Link> for counselling in
            English, and the whole of this page{' '}
            <Link href="/punjabi" lang="pa">ਪੰਜਾਬੀ ਵਿੱਚ</Link>.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { punjabiRegions, getPunjabiRegion } from '@/lib/punjabi-regions';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import Stat from '@/components/Stat';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';

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

export function generateMetadata({ params }: { params: { region: string } }): Metadata {
  const r = getPunjabiRegion(params.region);
  if (!r) return {};
  return {
    title: { absolute: `Punjabi Counselling in ${r.region}, BC | Westpeak` },
    description: r.metaDescription,
    alternates: {
      canonical: `${site.domain}/punjabi-counselling/${r.slug}`,
      languages: { 'pa': `${site.domain}/punjabi` },
    },
    openGraph: { ...ogBase(`/punjabi-counselling/${r.slug}`),
      title: `Punjabi-speaking counselling in ${r.region}, BC`,
      description: r.metaDescription,
    },
  };
}

export default function PunjabiRegionPage({ params }: { params: { region: string } }) {
  const r = getPunjabiRegion(params.region);
  if (!r) notFound();

  const siblings = (r.nearby ?? []).map(getPunjabiRegion).filter(Boolean) as typeof punjabiRegions;
  const path = `/punjabi-counselling/${r.slug}`;

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
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ</Link>
          </div>
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
              into a featured snippet or an AI overview. */}
          <p className="lede" style={{ marginTop: 8 }}>
            <strong>{r.demography.stat}</strong>
          </p>
          {/* The number on its own, with its source attached. The sentence above
              gives it meaning; this gives it weight. Both, because a figure with
              no context misleads and context with no figure does not land. */}
          {r.figure && (
            <Stat
              value={r.figure.value}
              label={r.figure.label}
              source={r.sources[0]?.label ?? 'Statistics Canada, 2021 Census'}
              href={r.sources[0]?.url}
            />
          )}
          <Paragraphs items={r.demography.body} />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <h2>{r.localReality.h2}</h2>
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
              <Link href={site.bookingPath}>free 15-minute consultation</Link> is the fastest way to
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
        heading={`Counselling in Punjabi, from ${r.region}`}
        text="A free 15-minute consultation over secure video, in Punjabi or English. No pressure, no commitment, and no obligation to book a session afterward."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

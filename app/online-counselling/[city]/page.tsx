import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations, getLocation } from '@/lib/locations';
import { featuredServices } from '@/lib/services';
import { site } from '@/lib/site';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import ExtraSections from '@/components/ExtraSections';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const l = getLocation(params.city);
  if (!l) return {};
  const title = `Online Counselling in ${l.city}, BC`;
  return {
    // absolute: keeps every city title under 60 chars
    title: { absolute: `Online Counselling in ${l.city} | ${site.name}` },
    description: l.metaDescription,
    alternates: { canonical: `${site.domain}/online-counselling/${l.slug}` },
    openGraph: { ...ogBase(`/online-counselling/${l.slug}`), title: `${title} | ${site.name}`, description: l.metaDescription, url: `${site.domain}/online-counselling/${l.slug}` },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const l = getLocation(params.city);
  if (!l) notFound();
  const siblings = (l.nearby ?? []).map(getLocation).filter(Boolean) as typeof locations;

  const faqSchema = l.faqs?.length && {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: l.faqs.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{l.region} · Online</p>
          <h1>Online counselling in {l.city}, BC</h1>
          <p className="lede">{l.blurb}</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See all services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs
            trail={[
              { name: 'Online counselling', path: '/online-counselling' },
              { name: l.city, path: `/online-counselling/${l.slug}` },
            ]}
          />

          {l.intro ? <Paragraphs items={l.intro} /> : (
            <>
              <h2>Therapy in {l.city}, without the commute</h2>
              <p>
                Westpeak Wellness is a fully virtual practice, so you can access counselling from
                anywhere in {l.city} or the wider {l.region} — no drive, no waiting room. Sessions run
                over a secure, confidential video platform and follow the same ethical and privacy
                standards as in-person therapy. There is more detail on{' '}
                <Link href="/services/online-counselling-bc">how online counselling works across BC</Link>.
              </p>
            </>
          )}
        </div>
      </section>

      {l.localReality && (
        <section className="section section--tint">
          <div className="container prose" style={{ maxWidth: '44.16em' }}>
            <h2>{l.localReality.h2}</h2>
            <Paragraphs items={l.localReality.body} />
            {/* The figure used to sit further down, inside a section that
                already has a card grid and a callout. Up here it breaks the
                only genuinely unbroken stretch these pages have: hero straight
                into a single prose column, 1,776px of it on /kelowna. */}
            {l.figure && <Figure name={l.figure} />}
          </div>
        </section>
      )}

      {l.access && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Why virtual, specifically here</p>
            <h2>What changes when distance stops mattering</h2>
            <div className="grid grid-2" style={{ marginTop: 26 }}>
              {l.access.map((a) => (
                <div className="card" key={a.label}>
                  <h3>{a.label}</h3>
                  <p style={{ marginBottom: 0 }}>{rich(a.detail)}</p>
                </div>
              ))}
            </div>
            <div className="crisis" style={{ marginTop: 32 }}>
              <p style={{ margin: 0 }}>
                Not sure which kind of support fits? A{' '}
                <Link href={site.bookingPath}>free 15-minute consultation</Link> is the fastest way
                to find out — and it is a fine outcome if the answer is a referral somewhere else.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className={l.localReality ? 'section section--ghost' : 'section section--tint'}>
        <div className="container">
          <p className="eyebrow">Available in {l.city}</p>
          <h2>Ways we can help</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {featuredServices.map((s) => (
              <div className="card" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card-link">
                  <h3>{s.name.replace(' Therapy', '').replace(' Counselling', '')}</h3>
                  <p>{s.short}</p>
                  <span className="more">{s.name} in {l.city} →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {l.faqs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Questions from {l.city}</p>
            <ExtraSections area="online-counselling" slug={l.slug} />

            {l.figure2 && <Figure name={l.figure2} />}

            <h2>Before you book</h2>
            <div style={{ marginTop: 24, maxWidth: 760 }}>
              {l.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              More in the <Link href="/faq">full list of frequently asked questions</Link>, or see{' '}
              <Link href="/pricing">fees and extended-health coverage</Link>.
            </p>
          </div>
        </section>
      )}

      {(siblings.length > 0 || l.sources) && (
        <section className="section section--tint">
          <div className="container">
            {siblings.length > 0 && (
              <>
                <p className="eyebrow">Elsewhere in BC</p>
                <div className="chip-grid" style={{ marginBottom: l.sources ? 36 : 0 }}>
                  {siblings.map((s) => (
                    <Link className="chip" key={s.slug} href={`/online-counselling/${s.slug}`}>
                      Online counselling in {s.city}
                    </Link>
                  ))}
                  <Link className="chip" href="/online-counselling">All areas served in BC</Link>
                </div>
              </>
            )}
            {l.sources && (
              <>
                <p className="eyebrow">Sources</p>
                <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
                  {l.sources.map((s) => (
                    <li key={s.url} style={{ marginBottom: 8 }}>
                      <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}


      <MoreFrom items={locations} currentSlug={l.slug} base="/online-counselling" heading="Other areas served" eyebrow="Keep going" />
      <SceneBand seed={params.city} />

      <CtaBand
        heading={`Counselling in ${l.city}, starting with a conversation`}
        text="A free 15-minute consultation over secure video. No pressure, no commitment, and no obligation to book a session afterward."
      />

      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </>
  );
}

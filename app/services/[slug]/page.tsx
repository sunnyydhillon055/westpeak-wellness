import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import { site } from '@/lib/site';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return {};
  return {
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    alternates: { canonical: `${site.domain}/services/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `${site.domain}/services/${s.slug}` },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: s.name, description: s.metaDescription,
      serviceType: s.name,
      areaServed: { '@type': 'State', name: 'British Columbia' },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/services/${s.slug}`,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: { '@type': 'MedicalBusiness', name: site.name, url: site.domain },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.domain}/services` },
        { '@type': 'ListItem', position: 3, name: s.name, item: `${site.domain}/services/${s.slug}` },
      ],
    },
    s.faqs?.length && {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: s.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{s.name}</p>
          <h1>{s.hero}</h1>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/services">Services</Link> / {s.name}
          </p>
          <div className="split">
            <div className="prose">
              <p className="lede" style={{ marginBottom: 24 }}>{s.intro}</p>
              <h2>How we approach it</h2>
              <p>{s.approach}</p>
            </div>
            <div>
              <div className="card">
                <p className="eyebrow">This can help with</p>
                <ul className="checklist" style={{ marginTop: 8 }}>
                  {s.helps.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {s.whatItIs && (
        <section className="section section--tint">
          <div className="container prose" style={{ maxWidth: '70ch' }}>
            <h2>{s.whatItIs.h2}</h2>
            <Paragraphs items={s.whatItIs.body} />
          </div>
        </section>
      )}

      {s.signs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Might be a fit if</p>
            <h2>What people tend to arrive with</h2>
            <div className="grid grid-2" style={{ marginTop: 26 }}>
              {s.signs.map((x) => (
                <div className="card" key={x.label}>
                  <h3>{x.label}</h3>
                  <p style={{ marginBottom: 0 }}>{rich(x.detail)}</p>
                </div>
              ))}
            </div>
            {s.figure && <Figure name={s.figure} />}
            <div className="crisis" style={{ marginTop: 32 }}>
              <p style={{ margin: 0 }}>
                Recognise several of these? A{' '}
                <Link href={site.bookingPath}>free 15-minute consultation</Link> is the least
                committal way to find out whether this is the right approach — including if the
                answer turns out to be something else.
              </p>
            </div>
          </div>
        </section>
      )}

      {s.sessionShape && (
        <section className="section section--ghost">
          <div className="container prose" style={{ maxWidth: '70ch' }}>
            <h2>{s.sessionShape.h2}</h2>
            <Paragraphs items={s.sessionShape.body} />
          </div>
        </section>
      )}

      {s.faqs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Questions</p>
            <h2>Before you book</h2>
            <div style={{ marginTop: 24, maxWidth: 760 }}>
              {s.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              More in the <Link href="/faq">full FAQ</Link>, or see{' '}
              <Link href="/pricing">fees and extended health coverage</Link>.
            </p>
          </div>
        </section>
      )}

      {s.related && (
        <section className="section section--tint">
          <div className="container">
            <p className="eyebrow">Related reading</p>
            <h2>Go deeper</h2>
            <div className="chip-grid" style={{ marginTop: 20 }}>
              {s.related.map((r) => <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>)}
            </div>
            {s.sources && (
              <>
                <p className="eyebrow" style={{ marginTop: 36 }}>Sources</p>
                <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
                  {s.sources.map((x) => (
                    <li key={x.url} style={{ marginBottom: 8 }}>
                      <a href={x.url} target="_blank" rel="noopener">{x.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      <section className={s.related ? 'section' : 'section section--tint'}>
        <div className="container">
          <p className="eyebrow">Explore more</p>
          <h2>Other ways we can work together</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {others.map((o) => (
              <div className="card" key={o.slug}>
                <Link href={`/services/${o.slug}`} className="card-link">
                  <h3>{o.name}</h3><p>{o.short}</p>
                  <span className="more">{o.name} in BC →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      <MoreFrom items={services} currentSlug={s.slug} base="/services" heading="Other counselling services" eyebrow="Keep going" />
      <CtaBand />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

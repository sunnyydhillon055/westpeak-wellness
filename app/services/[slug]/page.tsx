import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import { site } from '@/lib/site';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import { getServiceIcon } from '@/lib/icon-map';
import { Clock, MonitorSmartphone, Languages as LangIcon, BadgeCheck, CircleDot } from 'lucide-react';
import ExtraSections from '@/components/ExtraSections';
import Toc from '@/components/Toc';
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
    alternates: {
      canonical: `${site.domain}/services/${s.slug}`,
      /* hreflang has to be reciprocal or search engines ignore it, so the
       * English page points back at the Punjabi one and vice versa. Only this
       * pair has a translation, so no other service declares alternates. */
      ...(s.slug === 'punjabi-counselling'
        ? {
            languages: {
              'en-CA': `${site.domain}/services/punjabi-counselling`,
              pa: `${site.domain}/punjabi`,
            },
          }
        : {}),
    },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `${site.domain}/services/${s.slug}` },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();

  /* Heading order as rendered. 'This can help with' lives in the aside
   * itself, so it is deliberately not a TOC entry. */
  const toc = buildToc([
    'How we approach it',
    ...(s.whatItIs ? [s.whatItIs.h2] : []),
    'What people tend to arrive with',
    ...(s.sessionShape ? [s.sessionShape.h2] : []),
    ...getExtra('services', s.slug).map((x) => x.h2),
    'Before you book',
    'Go deeper',
  ]);
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: s.name, description: s.directAnswer ?? s.metaDescription,
      serviceType: s.name,
      areaServed: { '@type': 'State', name: 'British Columbia' },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/services/${s.slug}`,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: orgRef,
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
          {s.directAnswer && (
            <p className="direct-answer">{s.directAnswer}</p>
          )}
          <ul className="glance">
            <li><Clock aria-hidden="true" strokeWidth={1.7} /><span><strong>50 minutes</strong> per session</span></li>
            <li><MonitorSmartphone aria-hidden="true" strokeWidth={1.7} /><span><strong>Secure video</strong> sessions</span></li>
            <li><LangIcon aria-hidden="true" strokeWidth={1.7} /><span><strong>Free</strong> 15-min consult</span></li>
            <li><BadgeCheck aria-hidden="true" strokeWidth={1.7} /><span><strong>MA, RCC</strong> · BCACC</span></li>
          </ul>
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
          {/* The "this can help with" panel is reparented into a two-column
              grid with the long body copy so it has something to stick
              alongside. A sticky aside beside a three-paragraph section would
              never actually stick. Copy is unchanged — only its parent. */}
          <div className="svc-layout">
            <div className="prose">
              <p className="lede" style={{ marginBottom: 24 }}>{s.intro}</p>
              <h2 id="how-we-approach-it">How we approach it</h2>
              <p>{s.approach}</p>
              {s.whatItIs && (
                <>
                  <h2 id={headingId(s.whatItIs.h2)}>{s.whatItIs.h2}</h2>
                  <Paragraphs items={s.whatItIs.body} />
                </>
              )}
            </div>
            <aside className="svc-aside">
              <div className="svc-aside-card">
                <h2>This can help with</h2>
                <ul>
                  {s.helps.map((h) => <li key={h}>{h}</li>)}
                </ul>
                <Link className="btn btn--primary" href={site.bookingPath} style={{ width: '100%', textAlign: 'center' }}>
                  Book a free consultation
                </Link>
              </div>
              <Toc items={toc} />
            </aside>
          </div>
        </div>
      </section>

      {s.signs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Might be a fit if</p>
            <h2 id="what-people-tend-to-arrive-with">What people tend to arrive with</h2>
            <div className="grid grid-2" style={{ marginTop: 26 }}>
              {s.signs.map((x) => (
                <div className="card cred-card sign-card" key={x.label}>
                  <span className="icon-chip icon-chip--sm icon-chip--warm" aria-hidden="true">
                    <CircleDot strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>{x.label}</h3>
                    <p style={{ marginBottom: 0 }}>{rich(x.detail)}</p>
                  </div>
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
            <h2 id={headingId(s.sessionShape.h2)}>{s.sessionShape.h2}</h2>
            <Paragraphs items={s.sessionShape.body} />
          </div>
        </section>
      )}

      {s.faqs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Questions</p>
            <ExtraSections area="services" slug={s.slug} />

            {s.figure2 && <Figure name={s.figure2} />}

            <h2 id="before-you-book">Before you book</h2>
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
            <h2 id="go-deeper">Go deeper</h2>
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

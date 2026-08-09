import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { approaches, getApproach } from '@/lib/approaches';
import { site } from '@/lib/site';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';
import { getFigure } from '@/lib/figures';

export function generateStaticParams() {
  return approaches.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getApproach(params.slug);
  if (!g) return {};
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: { canonical: `${site.domain}/approaches/${g.slug}` },
    openGraph: {
      type: 'article', title: g.metaTitle, description: g.metaDescription,
      url: `${site.domain}/approaches/${g.slug}`, modifiedTime: g.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default function ApproachPage({ params }: { params: { slug: string } }) {
  const g = getApproach(params.slug);
  if (!g) notFound();

  const toc = buildToc([
    ...g.sections.map((s) => s.h2),
    ...getExtra('approaches', g.slug).map((s) => s.h2),
    'Common questions', 'Sources',
  ]);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: g.title, description: g.metaDescription,
      dateModified: g.updated, datePublished: g.updated,
      inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/approaches/${g.slug}` },
      publisher: orgRef,
      author: orgRef,
      reviewedBy: personRef,
      isPartOf: siteRef,
      isAccessibleForFree: true,
      image: [
        `${site.domain}/approaches/${g.slug}/opengraph-image`,
        ...(g.figure && getFigure(g.figure) ? [`${site.domain}/img/${getFigure(g.figure)!.file}`] : []),
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Approaches', item: `${site.domain}/approaches` },
        { '@type': 'ListItem', position: 3, name: g.title, item: `${site.domain}/approaches/${g.slug}` },
      ],
    },
    g.faqs.length && {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: g.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="eyebrow">{g.eyebrow}</p>
          <h1 style={{ maxWidth: '22ch' }}>{g.title}</h1>
          <p className="lede">{g.lede}</p>
          <p className="hero-note">{g.readMinutes} min read · Reviewed {fmt(g.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/approaches">All approaches</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container reading">
          <Toc items={toc} />
          <div className="prose">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/approaches">Approaches</Link> / {g.title}
          </p>

          <Byline updated={g.updated} readMinutes={g.readMinutes} />

          <blockquote className="quote" style={{ margin: '0 0 40px' }}>
            {g.shortAnswer}
          </blockquote>

          {g.sections.map((s, i) => (
            <div key={s.h2}>
              <h2 id={headingId(s.h2)}>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                  {s.list.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong> — {rich(item.detail)}
                    </li>
                  ))}
                </ul>
              )}

              {i === 0 && g.figure && <Figure name={g.figure} />}

              {/* mid-page contextual CTA, placed after the first section */}
              {i === 0 && (
                <div className="crisis" style={{ margin: '32px 0' }}>
                  <p style={{ margin: 0 }}>
                    {g.midCta.text}{' '}
                    <Link href={site.bookingPath}>{g.midCta.label}</Link>.
                  </p>
                </div>
              )}
            </div>
          ))}

          <ExtraSections area="approaches" slug={g.slug} />

          {g.figure2 && <Figure name={g.figure2} />}

          <h2 id="common-questions">Common questions</h2>
          <div style={{ marginTop: 8 }}>
            {g.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <h2 id="sources">Sources</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
            {g.sources.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>

          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
            This guide is general information, not clinical advice, and it cannot diagnose anything
            or replace an assessment. If you are in crisis, call or text <strong>9-8-8</strong>{' '}
            (Canada, 24/7) or BC Mental Health Support at <strong>310-6789</strong>.
          </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Keep reading</p>
          <h2>Related pages</h2>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {g.related.map((r) => (
              <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>
            ))}
          </div>
        </div>
      </section>


      <MoreFrom items={approaches} currentSlug={g.slug} base="/approaches" heading="Other approaches" eyebrow="Keep going" />
      <CtaBand
        heading="Still deciding?"
        text="A free 15-minute consultation is the least committal way to find out whether this is a fit. No pressure, and no obligation to book a session afterward."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { comparisons, getComparison } from '@/lib/comparisons';
import { site } from '@/lib/site';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getComparison(params.slug);
  if (!c) return {};
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: { canonical: `${site.domain}/compare/${c.slug}` },
    openGraph: {
      type: 'article', title: c.metaTitle, description: c.metaDescription,
      url: `${site.domain}/compare/${c.slug}`, modifiedTime: c.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug);
  if (!c) notFound();

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: c.title, description: c.metaDescription,
      dateModified: c.updated, datePublished: c.updated, inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/compare/${c.slug}` },
      publisher: { '@type': 'Organization', name: site.name, url: site.domain },
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: `${site.domain}/compare` },
        { '@type': 'ListItem', position: 3, name: c.title, item: `${site.domain}/compare/${c.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <p className="eyebrow">{c.eyebrow}</p>
          <h1 style={{ maxWidth: '24ch' }}>{c.title}</h1>
          <p className="lede">{c.lede}</p>
          <p className="hero-note">{c.readMinutes} min read · Reviewed {fmt(c.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/compare">All comparisons</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/compare">Compare</Link> / {c.title}
          </p>

          <div className="prose">
            <blockquote className="quote" style={{ margin: '0 0 36px' }}>{c.shortAnswer}</blockquote>
          </div>

          <div style={{ overflowX: 'auto', margin: '0 0 40px' }}>
            <table className="fee-table" style={{ minWidth: 720 }}>
              <thead>
                <tr>{c.table.columns.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {c.table.rows.map((r) => (
                  <tr key={r[0]}>
                    <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{r[0]}</td>
                    {r.slice(1).map((cell, i) => <td key={i} style={{ fontWeight: 400 }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose">
            {c.sections.map((s, i) => (
              <div key={s.h2}>
                <h2>{s.h2}</h2>
                {s.body && <Paragraphs items={s.body} />}
                {s.list && (
                  <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                    {s.list.map((item) => (
                      <li key={item.label}><strong>{item.label}</strong> — {rich(item.detail)}</li>
                    ))}
                  </ul>
                )}
                {i === 0 && c.figure && <Figure name={c.figure} />}
                {i === 0 && (
                  <div className="crisis" style={{ margin: '32px 0' }}>
                    <p style={{ margin: 0 }}>
                      {c.midCta.text}{' '}
                      <Link href={site.bookingPath}>{c.midCta.label}</Link>.
                    </p>
                  </div>
                )}
              </div>
            ))}

            <h2>Where Westpeak Wellness fits</h2>
            <Paragraphs items={c.howWeFit} />

            <h2>Common questions</h2>
            <div style={{ marginTop: 8 }}>
              {c.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>

            <h2>Sources</h2>
            <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
              {c.sources.map((s) => (
                <li key={s.url} style={{ marginBottom: 8 }}>
                  <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
                </li>
              ))}
            </ul>

            <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
              General information, not clinical or legal advice. Fee ranges are typical BC private-practice
              ranges and vary by practitioner. Confirm any practitioner&rsquo;s registration directly with the
              relevant college or association.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Keep reading</p>
          <h2>Related pages</h2>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {c.related.map((r) => <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>)}
          </div>
        </div>
      </section>


      <MoreFrom items={comparisons} currentSlug={c.slug} base="/compare" heading="Other comparisons" eyebrow="Keep going" />
      <CtaBand
        heading="Talk it through before you commit."
        text="A free 15-minute consultation, including an honest answer if what you need is someone other than an RCC."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

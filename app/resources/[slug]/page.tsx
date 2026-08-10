import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resources, getResource } from '@/lib/resources';
import { site } from '@/lib/site';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import { deviceSlots } from '@/lib/placement';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';
import InlineRelated from '@/components/InlineRelated';
import Breadcrumbs from '@/components/Breadcrumbs';

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getResource(params.slug);
  if (!r) return {};
  return {
    title: { absolute: r.metaTitle },
    description: r.metaDescription,
    alternates: { canonical: `${site.domain}/resources/${r.slug}` },
    openGraph: {
      type: 'article', title: r.metaTitle, description: r.metaDescription,
      url: `${site.domain}/resources/${r.slug}`, modifiedTime: r.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const r = getResource(params.slug);
  if (!r) notFound();

  const toc = buildToc([
    ...r.sections.map((s) => s.h2),
    ...getExtra('resources', r.slug).map((s) => s.h2),
    'Common questions', 'Sources',
  ]);

  /* Mid-article devices, spread by content weight rather than stacked at the
     top of the page. See lib/placement.ts. */
  const midDevices = [
    r.figure ? <Figure key="fig" name={r.figure} /> : null,
    <div className="crisis" key="cta" style={{ margin: '8px 0 32px' }}>
      <p style={{ margin: 0 }}>
        {r.midCta.text} <Link href={site.bookingPath}>{r.midCta.label}</Link>.
      </p>
    </div>,
    r.related[0] ? (
      <InlineRelated key="rel" href={r.related[0].href} label={r.related[0].label} />
    ) : null,
    r.figure2 ? <Figure key="fig2" name={r.figure2} /> : null,
  ].filter(Boolean);
  const articleSections = [...r.sections, ...getExtra('resources', r.slug)];
  const slots = deviceSlots(articleSections, midDevices.length);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: r.title, description: r.metaDescription,
      dateModified: r.updated, datePublished: r.updated, inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/resources/${r.slug}` },
      publisher: orgRef,
      author: orgRef,
      reviewedBy: personRef,
      isPartOf: siteRef,
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${site.domain}/resources` },
        { '@type': 'ListItem', position: 3, name: r.title, item: `${site.domain}/resources/${r.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: r.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container container--article">
          <p className="eyebrow">{r.eyebrow}</p>
          <h1 style={{ maxWidth: '14.56em' }}>{r.title}</h1>
          <p className="lede">{r.lede}</p>
          <p className="hero-note">{r.readMinutes} min read · Reviewed {fmt(r.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/resources">All resources</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container reading">
          <Toc items={toc} />
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Resources', path: '/resources' },
              { name: r.title, path: `/resources/${r.slug}` },
            ]}
          />

          <div className="prose">
            <Byline updated={r.updated} readMinutes={r.readMinutes} />

            <blockquote className="quote" style={{ margin: '0 0 36px' }}>{r.shortAnswer}</blockquote>
          </div>

          {r.sections.map((s, i) => (
            <div key={s.h2}>
              <div className="prose">
                <h2 id={headingId(s.h2)}>{s.h2}</h2>
                {s.body && <Paragraphs items={s.body} />}
                {s.list && (
                  <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                    {s.list.map((item) => (
                      <li key={item.label}><strong>{item.label}</strong> — {rich(item.detail)}</li>
                    ))}
                  </ul>
                )}
              </div>

              {s.table && (
                <div style={{ overflowX: 'auto', margin: '8px 0 36px' }}>
                  <table className="fee-table" style={{ minWidth: 640 }}>
                    <thead>
                      <tr>{s.table.columns.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]}>
                          <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{row[0]}</td>
                          {row.slice(1).map((cell, k) => <td key={k} style={{ fontWeight: 400 }}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="prose">{midDevices.filter((_, k) => slots[k] === i)}</div>
            </div>
          ))}

          <div className="prose">
            <ExtraSections
            area="resources"
            slug={r.slug}
            devices={midDevices}
            slots={slots}
            offset={r.sections.length}
          />


            <SceneBand seed={r.slug} />

            <h2 id="common-questions">Common questions</h2>
            <div style={{ marginTop: 8 }}>
              {r.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>

            <h2 id="sources">Sources</h2>
            <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
              {r.sources.map((s) => (
                <li key={s.url} style={{ marginBottom: 8 }}>
                  <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
                </li>
              ))}
            </ul>

            <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
              General information, not clinical, financial, or legal advice. Coverage and service details
              change — verify anything decision-critical directly with the provider or insurer. If you are
              in crisis, call or text <strong>9-8-8</strong> (Canada, 24/7) or <strong>310-6789</strong> for
              BC Mental Health Support.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Keep reading</p>
          <h2>Related pages</h2>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {r.related.map((x) => <Link className="chip" key={x.href} href={x.href}>{x.label}</Link>)}
          </div>
        </div>
      </section>


      <MoreFrom items={resources} currentSlug={r.slug} base="/resources" heading="More BC resources" eyebrow="Keep going" />
      <CtaBand
        heading="Questions about cost or coverage?"
        text="A free 15-minute consultation is a good place to ask them, before committing to anything."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

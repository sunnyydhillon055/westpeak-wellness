import Link from 'next/link';
import { site } from '@/lib/site';
import type { Policy } from '@/lib/policies';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });

export default function PolicyPage({ doc }: { doc: Policy }) {
  const url = `${site.domain}/${doc.slug}`;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: doc.title,
      description: doc.metaDescription,
      url,
      inLanguage: 'en-CA',
      dateModified: doc.updated,
      lastReviewed: doc.updated,
      isPartOf: { '@type': 'WebSite', name: site.name, url: site.domain },
      publisher: { '@type': 'Organization', name: site.name, url: site.domain },
      about: { '@type': 'Organization', name: site.name, url: site.domain },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: doc.title, item: url },
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="eyebrow">{doc.eyebrow}</p>
          <h1 style={{ maxWidth: '20ch' }}>{doc.title}</h1>
          <p className="lede">{doc.lede}</p>
          <p className="hero-note">Last reviewed {fmt(doc.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/about">About the practice</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container prose">
          <p className="crumb"><Link href="/">Home</Link> / {doc.title}</p>

          <Byline updated={doc.updated} />

          {doc.sections.map((s, i) => (
            <div key={s.h2}>
              <h2>{s.h2}</h2>
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

              {i === 0 && (
                <div className="crisis" style={{ margin: '32px 0' }}>
                  <p style={{ margin: 0 }}>
                    Questions about any of this are fair game before you commit to anything —{' '}
                    <Link href={site.bookingPath}>ask them in a free 15-minute consultation</Link>.
                  </p>
                </div>
              )}
            </div>
          ))}

          <ExtraSections area="policy" slug={doc.slug} />

          {doc.sources && doc.sources.length > 0 && (
            <>
              <h2>Sources</h2>
              <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
                {doc.sources.map((s) => (
                  <li key={s.url} style={{ marginBottom: 8 }}>
                    <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
            This page is general information about how the practice operates, not clinical or legal
            advice. If you are in crisis, call or text <strong>9-8-8</strong> (Canada, 24/7) or BC
            Mental Health Support at <strong>310-6789</strong>.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Keep reading</p>
          <h2>Related pages</h2>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {doc.related.map((r) => (
              <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Still deciding?"
        text="A free 15-minute consultation costs nothing and commits you to nothing. It is the fastest way to find out whether this is the right fit."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

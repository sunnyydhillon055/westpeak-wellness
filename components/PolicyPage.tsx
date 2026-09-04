import Link from 'next/link';
import Toc from '@/components/Toc';
import { buildToc, headingId } from '@/lib/toc';
import { site } from '@/lib/site';
import { orgRef, siteRef, personRef } from '@/lib/schema';
import type { Policy } from '@/lib/policies';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import InlineRelated from '@/components/InlineRelated';
import { getExtra } from '@/lib/depth';
import { deviceSlots } from '@/lib/placement';
import Breadcrumbs from '@/components/Breadcrumbs';

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
      publisher: orgRef,
      about: orgRef,
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
  /* 'Sources' renders only when the doc has any — /editorial-policy and
   * /accessibility do not, so listing it unconditionally left a dead anchor. */
  const toc = buildToc([
    ...doc.sections.map((s) => s.h2),
    ...(doc.sources && doc.sources.length > 0 ? ['Sources'] : []),
  ]);

  /* Policy documents are the longest continuous prose on the site — /privacy ran
     2,153px between anything visual — and they are also where a reader is most
     likely to be scanning for one specific answer. See lib/placement.ts. */
  const midDevices = [
    doc.figure ? <Figure key="fig" name={doc.figure} /> : null,
    doc.figure2 ? <Figure key="fig2" name={doc.figure2} /> : null,
    <div className="crisis" key="cta" style={{ margin: '32px 0' }}>
      <p style={{ margin: 0 }}>
        Questions about any of this are fair game before you commit to anything, {' '}
        <Link href={site.bookingPath}>ask them in a free 15-minute consultation</Link>.
      </p>
    </div>,
    doc.related[0] ? (
      <InlineRelated key="rel" href={doc.related[0].href} label={doc.related[0].label} />
    ) : null,
  ].filter(Boolean);
  const slots = deviceSlots(
    [...doc.sections, ...getExtra('policy', doc.slug)],
    midDevices.length
  );


  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container container--article">
          <p className="eyebrow">{doc.eyebrow}</p>
          <h1 style={{ maxWidth: '13.24em' }}>{doc.title}</h1>
          <p className="lede">{doc.lede}</p>
          <p className="hero-note">Last reviewed {fmt(doc.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/about">About the practice</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container reading">
          <Toc items={toc} />
          <div className="prose">
          <Breadcrumbs schema={false} trail={[{ name: doc.title, path: `/${doc.slug}` }]} />

          <Byline updated={doc.updated} />

          {doc.sections.map((s, i) => (
            <div key={s.h2}>
              <h2 id={headingId(s.h2)}>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                  {s.list.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong>, {rich(item.detail)}
                    </li>
                  ))}
                </ul>
              )}

              {midDevices.filter((_, k) => slots[k] === i)}
            </div>
          ))}

          <ExtraSections
            area="policy"
            slug={doc.slug}
            devices={midDevices}
            slots={slots}
            offset={doc.sections.length}
          />

          {doc.sources && doc.sources.length > 0 && (
            <>
              <h2 id="sources">Sources</h2>
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

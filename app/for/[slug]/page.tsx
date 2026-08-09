import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { audiences, getAudience } from '@/lib/audiences';
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

export function generateStaticParams() {
  return audiences.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getAudience(params.slug);
  if (!a) return {};
  return {
    title: { absolute: a.metaTitle },
    description: a.metaDescription,
    alternates: { canonical: `${site.domain}/for/${a.slug}` },
    openGraph: {
      type: 'article', title: a.metaTitle, description: a.metaDescription,
      url: `${site.domain}/for/${a.slug}`, modifiedTime: a.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default function AudiencePage({ params }: { params: { slug: string } }) {
  const a = getAudience(params.slug);
  if (!a) notFound();

  const toc = buildToc([
    'The things people actually say',
    ...a.sections.map((s) => s.h2),
    ...getExtra('for', a.slug).map((s) => s.h2),
    'Services that tend to fit',
    'Common questions',
    'Sources and further support',
  ]);

  /* This page keeps its opening figure and CTA up in the cards section, where
     they belong. What was missing is anything at all inside the long prose
     column below them — 4,094px of it on /for/women. See lib/placement.ts.
     The depth sections are weighed in and carry devices too: covering only
     `a.sections` moved the gap to the tail rather than removing it. */
  const forSections = [...a.sections, ...getExtra('for', a.slug)];
  const midDevices = [
    a.related[0] ? (
      <InlineRelated key="rel" href={a.related[0].href} label={a.related[0].label} />
    ) : null,
    a.figure2 ? <Figure key="fig2" name={a.figure2} /> : null,
    a.related[1] ? (
      <InlineRelated key="rel2" href={a.related[1].href} label={a.related[1].label} />
    ) : null,
  ].filter(Boolean);
  const slots = deviceSlots(forSections, midDevices.length);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: a.title, description: a.metaDescription,
      dateModified: a.updated, datePublished: a.updated, inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/for/${a.slug}` },
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
        { '@type': 'ListItem', position: 2, name: 'Who we work with', item: `${site.domain}/for` },
        { '@type': 'ListItem', position: 3, name: a.title, item: `${site.domain}/for/${a.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: a.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="eyebrow">{a.eyebrow}</p>
          <h1 style={{ maxWidth: '13.24em' }}>{a.title}</h1>
          <p className="lede">{a.lede}</p>
          <p className="hero-note">{a.readMinutes} min read · Reviewed {fmt(a.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/for">Who we work with</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container prose">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/for">Who we work with</Link> / {a.title}
          </p>
          <Byline updated={a.updated} readMinutes={a.readMinutes} />

          <Paragraphs items={a.opening} />

          <Toc items={toc} variant="card" />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">What comes up</p>
          <h2 id="the-things-people-actually-say">The things people actually say</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {a.whatComesUp.map((w) => (
              <div className="card" key={w.label}>
                <h3>{w.label}</h3>
                <p style={{ marginBottom: 0 }}>{rich(w.detail)}</p>
              </div>
            ))}
          </div>
          {a.figure && <Figure name={a.figure} />}
          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              {a.midCta.text} <Link href={site.bookingPath}>{a.midCta.label}</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          {a.sections.map((s, i) => (
            <div key={s.h2}>
              <h2 id={headingId(s.h2)}>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                  {s.list.map((item) => (
                    <li key={item.label}><strong>{item.label}</strong> — {rich(item.detail)}</li>
                  ))}
                </ul>
              )}

              {midDevices.filter((_, k) => slots[k] === i)}
            </div>
          ))}
        </div>
      </section>

      <section className="section section--ghost">
        <div className="container">
          <p className="eyebrow">Where to start</p>
          <ExtraSections
            area="for"
            slug={a.slug}
            devices={midDevices}
            slots={slots}
            offset={a.sections.length}
          />

          <h2 id="services-that-tend-to-fit">Services that tend to fit</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {a.servicesThatFit.map((s) => (
              <div className="card" key={s.href}>
                <Link href={s.href} className="card-link">
                  <h3>{s.label}</h3>
                  <p>{s.why}</p>
                  <span className="more">{s.label} →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <SceneBand seed={a.slug} />

          <h2 id="common-questions">Common questions</h2>
          <div style={{ marginTop: 8 }}>
            {a.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <h2 id="sources-and-further-support">Sources and further support</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
            {a.sources.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>

          <div className="chip-grid" style={{ marginTop: 28 }}>
            {a.related.map((r) => <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>)}
          </div>

          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
            General information, not clinical advice, and not a diagnosis. If you are in crisis, call or
            text <strong>9-8-8</strong> (Canada, 24/7) or BC Mental Health Support at <strong>310-6789</strong>.
            In immediate danger, call <strong>911</strong>.
          </p>
        </div>
      </section>


      <MoreFrom items={audiences} currentSlug={a.slug} base="/for" heading="Written for other situations" eyebrow="Keep going" />
      <CtaBand
        heading="One conversation, no commitment."
        text="A free 15-minute consultation over secure video — including an honest answer if something other than counselling would serve you better."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

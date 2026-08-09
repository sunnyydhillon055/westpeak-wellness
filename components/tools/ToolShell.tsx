import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import type { ToolMeta } from '@/lib/tools';

/* Shared frame for every tool: heading, schema, and the closing CTA.
 *
 * WebApplication rather than Article — these do something rather than say
 * something, and the distinction is what makes the markup honest. */
export default function ToolShell({
  tool,
  children,
  intro,
}: {
  tool: ToolMeta;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': abs(`/tools/${tool.slug}`),
      name: tool.title,
      description: tool.metaDescription,
      url: abs(`/tools/${tool.slug}`),
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isPartOf: siteRef,
      publisher: orgRef,
      // Free and with no account — stating it in the markup as well as the copy.
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: abs('/tools') },
        { '@type': 'ListItem', position: 3, name: tool.title, item: abs(`/tools/${tool.slug}`) },
      ],
    },
    tool.faqs?.length && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 34 }}>
        <div className="container container--narrow">
          <p className="eyebrow">Free tool · about {tool.minutes} minutes</p>
          <h1>{tool.title}</h1>
          <p className="direct-answer">{intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 34 }}>
        <div className="container container--narrow">
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / {tool.title}
          </p>
          {children}

          {tool.faqs && tool.faqs.length > 0 && (
            <div className="prose tool-prose" style={{ marginTop: 8 }}>
              <h2 id="common-questions">Common questions</h2>
              <div style={{ marginTop: 8 }}>
                {tool.faqs.map((f) => (
                  <details className="faq-item" key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {tool.related && tool.related.length > 0 && (
        <section className="section section--tint">
          <div className="container container--narrow">
            <p className="eyebrow">Keep reading</p>
            <h2>If you want the longer version</h2>
            <div className="chip-grid" style={{ marginTop: 20 }}>
              {tool.related.map((r) => (
                <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

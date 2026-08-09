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
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 34 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="eyebrow">Free tool · about {tool.minutes} minutes</p>
          <h1>{tool.title}</h1>
          <p className="direct-answer">{intro}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 34 }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="crumb">
            <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> / {tool.title}
          </p>
          {children}
        </div>
      </section>
    </>
  );
}

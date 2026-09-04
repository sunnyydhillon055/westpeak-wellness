import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import type { ToolMeta } from '@/lib/tools';
import Breadcrumbs from '@/components/Breadcrumbs';

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
    /* HowTo alongside WebApplication.
     *
     * WebApplication says "this is a tool". HowTo says what using it involves,
     * which is the shape an assistant can answer a question from. The steps are
     * deliberately the same across all three tools because they are true of all
     * three — none asks for an account, none stores anything, and each ends by
     * pointing somewhere rather than selling. Writing per-tool steps that
     * overstated what a tool does would be worse than the generic truth. */
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${abs(`/tools/${tool.slug}`)}#howto`,
      name: `How to use the ${tool.title.toLowerCase()}`,
      description: tool.metaDescription,
      totalTime: `PT${tool.minutes}M`,
      estimatedCost: { '@type': 'MonetaryAmount', currency: 'CAD', value: '0' },
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Answer the questions',
          text: 'Work through the questions on the page. Everything runs in your browser. Nothing is sent anywhere, nothing is stored, and no sign-up is asked for.',
          url: abs(`/tools/${tool.slug}`),
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Read the result',
          text: 'The result appears immediately on the same page, with the reasoning behind it rather than a score on its own.',
          url: abs(`/tools/${tool.slug}`),
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Decide what to do next',
          text: 'Each outcome links onward, sometimes to this practice, sometimes to a different service, or to free and low-cost options in BC where those are the better fit.',
          url: abs('/book'),
        },
      ],
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
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Tools', path: '/tools' },
              { name: tool.title, path: `/tools/${tool.slug}` },
            ]}
          />
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

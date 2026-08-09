import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';

const TITLE = 'Free counselling tools | Westpeak Wellness';
const DESC =
  'Three short, private tools: which counselling fits, what it costs in BC after extended health, and a reflection on how things have been. Nothing stored.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/tools` },
  openGraph: { title: TITLE, description: DESC, url: `${site.domain}/tools` },
};

export default function ToolsIndex() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': abs('/tools'),
      name: TITLE,
      description: DESC,
      isPartOf: siteRef,
      publisher: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: tools.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.title,
        url: abs(`/tools/${t.slug}`),
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container">
          <p className="eyebrow">Free · no sign-up</p>
          <h1>Tools</h1>
          <p className="direct-answer">
            Three short tools for the questions people ask before they book anything: which kind
            of counselling fits, what it costs in British Columbia once extended health is taken
            into account, and a plain reflection on how the last few weeks have been. Each runs
            entirely in your browser — nothing is stored, nothing is sent, and none of them ask
            for an email address.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Tools</p>
          <div className="grid grid-3">
            {tools.map((t) => (
              <div className="card" key={t.slug} style={{ height: '100%' }}>
                <Link href={`/tools/${t.slug}`} className="card-link">
                  <h2 className="card-title">{t.title}</h2>
                  <p>{t.short}</p>
                  <span className="more">Open the tool →</span>
                </Link>
              </div>
            ))}
          </div>

          <Figure name="four-decisions" />

          <div className="crisis" style={{ marginTop: 30 }}>
            <p style={{ margin: 0 }}>
              None of these is an assessment or a diagnosis, and none can tell you whether you
              have a condition. They are for orienting yourself. If you want an actual answer,
              a <Link href={site.bookingPath}>free 15-minute consultation</Link> will get you
              further than any of them.
            </p>
          </div>

          <p style={{ marginTop: 26 }}>
            Prefer to read? The <Link href="/guides">counselling guides</Link> cover the same
            ground in more depth, <Link href="/compare">the comparisons</Link> lay out the
            trade-offs between options, and <Link href="/pricing">fees and coverage</Link> has
            the numbers in full.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

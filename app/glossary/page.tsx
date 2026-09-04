import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { orgRef, siteRef, personRef } from '@/lib/schema';
import { glossary, glossaryGroups, termsByGroup } from '@/lib/glossary';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';

export const metadata: Metadata = {
  title: { absolute: 'Counselling Terms Glossary | Westpeak Wellness' },
  description:
    'Plain-language definitions of the therapy, mental-health and BC coverage terms you will meet when looking for a counsellor, without the jargon.',
  alternates: { canonical: `${site.domain}/glossary` },
  openGraph: { ...ogBase(`/glossary`),
    type: 'article',
    title: 'Counselling Terms Glossary | Westpeak Wellness',
    description:
      'What EMDR, the window of tolerance, RCC, EFAP and forty other counselling terms actually mean, defined plainly.',
  },
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function GlossaryPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      '@id': `${site.domain}/glossary#set`,
      name: 'Westpeak Wellness counselling glossary',
      description:
        'Plain-language definitions of counselling approaches, mental-health terms, and British Columbia designations and coverage.',
      url: `${site.domain}/glossary`,
      inLanguage: 'en-CA',
      publisher: orgRef,
      hasDefinedTerm: glossary.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.term,
        ...(t.also ? { alternateName: t.also } : {}),
        description: t.definition,
        url: `${site.domain}/glossary#${slugify(t.term)}`,
        /* `inDefinedTermSet` deliberately omitted. Each term is already nested
           inside this set's `hasDefinedTerm`, so the relationship is expressed
           without it — repeating it added the same 67-character absolute URL 63
           times over. That matters more here than elsewhere because React
           serialises the rendered tree into the RSC flight payload as well, so
           every redundant byte in this block is paid for twice. */
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Glossary', item: `${site.domain}/glossary` },
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container container--article">
          <p className="eyebrow">Reference · {glossary.length} terms</p>
          <h1 style={{ maxWidth: '13.24em' }}>Counselling terms, defined plainly</h1>
          <p className="lede">
            Therapy has a vocabulary problem. Referral letters, benefits booklets and therapist
            websites all use words that carry precise meanings nobody explains, so here they are,
            in the plainest language they will survive.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/guides">Read the guides</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Breadcrumbs schema={false} trail={[{ name: 'Glossary', path: '/glossary' }]} />
          <Figure name="designations-bc" />
          {/* Sixty-three terms with one drawing. The designations chart covers who; this covers what the work is for, which is the other half of the vocabulary. */}
          <Figure name="service-axes" />

          <div className="chip-grid" style={{ margin: '18px 0 8px' }}>
            {glossaryGroups.map((g) => (
              <a className="chip" key={g.key} href={`#${g.key}`}>{g.name}</a>
            ))}
          </div>

          <div className="crisis" style={{ margin: '28px 0 0' }}>
            <p style={{ margin: 0 }}>
              Definitions describe concepts, none of them assesses or diagnoses anyone. If a term
              here matches something you are living with,{' '}
              <Link href={site.bookingPath}>a free 15-minute consultation</Link> is a better next
              step than more reading.
            </p>
          </div>
        </div>
      </section>

      {glossaryGroups.map((g, gi) => (
        <section
          className={`section ${gi % 2 === 1 ? 'section--tint' : ''}`}
          key={g.key}
          id={g.key}
          style={{ paddingTop: 44 }}
        >
          <div className="container container--wide">
            <p className="eyebrow">{termsByGroup(g.key).length} terms</p>
            <h2>{g.name}</h2>
            <p className="lede" style={{ marginBottom: 20 }}>{g.blurb}</p>

            <dl className="glossary">
              {termsByGroup(g.key).map((t) => (
                <div className="glossary-item" key={t.term} id={slugify(t.term)}>
                  <dt>
                    {t.term}
                    {t.also && <span className="glossary-also">also: {t.also}</span>}
                  </dt>
                  <dd>
                    {t.definition}
                    {t.href && (
                      <>
                        {' '}
                        <Link href={t.href}>Read more →</Link>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container prose">
          <h2>A note on the words that are also diagnoses</h2>
          <p>
            Several entries above: depression, post-traumatic stress, social anxiety: name both an
            everyday experience and a clinical diagnosis, and the two are not interchangeable.
            Recognising yourself in a definition is a reason to talk to someone qualified, not a
            reason to conclude anything. A Registered Clinical Counsellor does not diagnose; where a
            formal diagnosis is what you need, that is a physician, psychiatrist or registered
            psychologist, and saying so is part of{' '}
            <Link href="/standards">this practice&rsquo;s stated scope</Link>.
          </p>
          <p>
            If the vocabulary you are trying to decode is about who to see and what it costs,{' '}
            <Link href="/guides/how-to-find-a-therapist-in-bc">how to find a therapist in BC</Link>{' '}
            and <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</Link>{' '}
            cover that ground properly. If it is about a method,{' '}
            <Link href="/compare/cbt-vs-emdr-for-trauma">CBT compared with EMDR</Link> is the most
            common question people arrive with, and{' '}
            <Link href="/approaches">the approach pages</Link> cover each method in full.
          </p>
        </div>
      </section>

      <CtaBand
        heading="Still not sure which of these applies to you?"
        text="That is an entirely normal place to start, and it is exactly what a free 15-minute consultation is for."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

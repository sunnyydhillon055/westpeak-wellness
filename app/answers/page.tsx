import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { abs, orgRef } from '@/lib/schema';
import { guides } from '@/lib/guides';
import { comparisons } from '@/lib/comparisons';
import { resources } from '@/lib/resources';
import { audiences } from '@/lib/audiences';
import { approaches } from '@/lib/approaches';
import { services } from '@/lib/services';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import CtaBand from '@/components/CtaBand';

const TITLE = 'Straight Answers About Counselling in BC | Westpeak Wellness';
const DESC =
  'Direct answers to what people actually ask about therapy in BC — cost, coverage, EMDR, couples work, first sessions and how to find a counsellor.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${site.domain}/answers` },
  openGraph: { title: TITLE, description: DESC, url: `${site.domain}/answers` },
};

export const dynamic = 'force-static';

/* The answers index.
 *
 * WHY THIS PAGE EXISTS. Every guide, comparison, resource and approach on this
 * site already opens with a short direct answer — that work is done and spread
 * across 60-odd URLs. Nothing collects them.
 *
 * A single page holding every question and its answer is the shape both a
 * search engine and an answer engine retrieve from most readily: one URL, high
 * question density, each answer self-contained and each linked to the page
 * that expands it. It also gives a visitor who does not want to read a guide
 * somewhere to land.
 *
 * It is NOT duplicate content: the answers are the existing lede sentences,
 * shown once here as an index and once on their own page in full context —
 * the same relationship a table of contents has to a book. Every entry links
 * to its source, so the canonical target for each answer is unambiguous.
 */

type Row = { q: string; a: string; href: string };

const clean = (s: string) => s.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();

export default function AnswersPage() {
  const sections: { key: string; label: string; blurb: string; rows: Row[] }[] = [
    {
      key: 'services',
      label: 'What each kind of counselling is',
      blurb: 'One paragraph on every service offered, and who each one tends to suit.',
      rows: services
        .filter((s) => s.directAnswer)
        .map((s) => ({ q: s.name, a: clean(s.directAnswer as string), href: `/services/${s.slug}` })),
    },
    {
      key: 'guides',
      label: 'Questions people ask',
      blurb: 'The short answer first. Each links to the full guide.',
      rows: guides
        .filter((g) => (g as { shortAnswer?: string }).shortAnswer)
        .map((g) => ({
          q: g.title,
          a: clean((g as unknown as { shortAnswer: string }).shortAnswer),
          href: `/guides/${g.slug}`,
        })),
    },
    {
      key: 'compare',
      label: 'Choosing between options',
      blurb: 'Where two reasonable choices exist, what actually separates them.',
      rows: comparisons
        .filter((c) => (c as { shortAnswer?: string }).shortAnswer)
        .map((c) => ({
          q: c.title,
          a: clean((c as unknown as { shortAnswer: string }).shortAnswer),
          href: `/compare/${c.slug}`,
        })),
    },
    {
      key: 'approaches',
      label: 'How each approach works',
      blurb: 'The methods used here, described plainly rather than by acronym.',
      rows: approaches
        .filter((a) => (a as { shortAnswer?: string }).shortAnswer)
        .map((a) => ({
          q: a.title,
          a: clean((a as unknown as { shortAnswer: string }).shortAnswer),
          href: `/approaches/${a.slug}`,
        })),
    },
    {
      key: 'bc',
      label: 'Cost, coverage and BC specifics',
      blurb: 'What things cost, what is covered, and what exists for free.',
      rows: resources
        .filter((r) => (r as { shortAnswer?: string }).shortAnswer)
        .map((r) => ({
          q: r.title,
          a: clean((r as unknown as { shortAnswer: string }).shortAnswer),
          href: `/resources/${r.slug}`,
        })),
    },
    {
      key: 'who',
      label: 'Who this is for',
      blurb: 'Written for specific situations rather than for everyone.',
      rows: audiences
        .filter((a) => a.shortAnswer)
        .map((a) => ({ q: a.title, a: clean(a.shortAnswer), href: `/for/${a.slug}` })),
    },
  ].filter((s) => s.rows.length > 0);

  const total = sections.reduce((n, s) => n + s.rows.length, 0);

  /* QAPage rather than FAQPage.
   *
   * FAQPage is for questions the site itself answers as an FAQ; QAPage
   * describes a page collecting question-and-answer pairs. Google restricted
   * FAQPage rich results to authoritative health and government sites, so
   * claiming it here would be markup that cannot earn what it asks for.
   * ItemList is what actually describes this page: an ordered index pointing
   * at the canonical source of each answer. */
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${site.domain}/answers#page`,
      name: 'Straight answers about counselling in BC',
      description: DESC,
      url: `${site.domain}/answers`,
      isPartOf: { '@id': `${site.domain}/#website` },
      about: orgRef,
      inLanguage: 'en-CA',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${site.domain}/answers#list`,
      name: 'Counselling questions answered',
      numberOfItems: total,
      itemListElement: sections
        .flatMap((s) => s.rows)
        .map((r, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: r.q,
          url: abs(r.href),
        })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Answers</p>
          <h1>Straight answers about counselling in BC</h1>
          <p className="lede">
            {total} questions, each answered in a paragraph before you decide whether to read
            further. No sign-up, no email, nothing gated.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <Breadcrumbs trail={[{ name: 'Answers', path: '/answers' }]} />

          <p>
            Everything below is the opening answer from a longer page. If the short version is
            all you needed, that is a good outcome — and if it is not, each one links to the
            page that takes it further. If your question is not here,{' '}
            <Link href="/contact">ask it directly</Link> or raise it on a{' '}
            <Link href={site.bookingPath}>free 15-minute consultation</Link>.
          </p>

          {/* This page collected 100+ answers and rendered no image. The four
              decisions are the frame most of these questions sit inside, so the
              diagram orients someone scanning rather than decorating the page. */}
          <Figure name="four-decisions" />

          <nav className="answers-jump" aria-label="Jump to a section">
            {sections.map((s) => (
              <a key={s.key} href={`#${s.key}`}>
                {s.label} <span className="answers-count">{s.rows.length}</span>
              </a>
            ))}
          </nav>

          {sections.map((s) => (
            <section key={s.key} aria-labelledby={`h-${s.key}`}>
              <h2 id={s.key}>
                <span id={`h-${s.key}`}>{s.label}</span>
                {/* The size of the section, stated. On a 29-screen page a
                    heading with no count is an unknown quantity of scrolling. */}
                <span className="answers-count">{s.rows.length}</span>
              </h2>
              <p className="answers-blurb">{s.blurb}</p>
              <dl className="answers-list">
                {s.rows.map((r) => (
                  <div key={r.href}>
                    <dt>
                      <Link href={r.href}>{r.q}</Link>
                    </dt>
                    <dd>{r.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <h2>Still not answered?</h2>
          <p>
            The <Link href="/faq">practical FAQ</Link> covers fees, booking, confidentiality and
            how sessions run. The <Link href="/glossary">glossary</Link> defines the terms.
            Anything else is worth an email — questions before booking are welcome and cost
            nothing.
          </p>
        </div>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

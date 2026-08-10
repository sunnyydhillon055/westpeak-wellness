import type { Metadata } from 'next';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { site } from '@/lib/site';
import { abs, orgRef, siteRef } from '@/lib/schema';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';

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
          <Breadcrumbs trail={[{ name: 'Tools', path: '/tools' }]} />
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

          <div className="prose" style={{ marginTop: 34 }}>
            <h2 id="why-no-email">Why none of these ask for an email address</h2>
            <p>
              The standard version of a tool like this collects your answers, asks for an email to
              &ldquo;send your results&rdquo;, and turns what you disclosed into a sales list. That
              pattern is common enough in this industry that it is worth saying plainly: none of
              these do it. They run entirely in your browser, nothing is transmitted, nothing is
              stored, and there is no account. Closing the tab is the end of it.
            </p>
            <p>
              That constraint is also why several outcomes point away from this practice. A tool
              that can only ever conclude &ldquo;book with us&rdquo; is an advertisement wearing a
              quiz&rsquo;s clothes, and people can tell. Where what you describe points to a
              physician, to an{' '}
              <Link href="/compare/efap-vs-private-counselling">EFAP you may already have</Link>,
              or to{' '}
              <Link href="/resources/low-cost-counselling-bc">free and low-cost counselling in BC</Link>,
              that is what it says.
            </p>

            <h2 id="what-they-cannot-do">What they cannot do</h2>
            <p>
              None of these screens, scores or diagnoses, and that is a design decision rather than
              a limitation to apologise for. Validated screening instruments exist, they are
              administered in a clinical context, and their results mean something because of that
              context — six questions on a website have none of it. A score here would carry the
              appearance of measurement with none of the substance, and people remember numbers
              long after they forget the caveat printed underneath.
            </p>
            <p>
              A Registered Clinical Counsellor does not diagnose in any case. Where a formal
              diagnosis is what you need, that is a physician, psychiatrist or registered
              psychologist —{' '}
              <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
              covers how those routes work, and{' '}
              <Link href="/standards">this practice&rsquo;s stated scope</Link> sets out where the
              line sits.
            </p>

            <h2 id="which-one">Which one to start with</h2>
            <p>
              If you are not sure counselling is the right thing at all, start with the{' '}
              <Link href="/tools/stress-check">reflection on how things have been</Link> — it is
              the least committal of the three, and its job is to hand you language rather than a
              conclusion. If you have decided to go ahead but not what kind,{' '}
              <Link href="/tools/which-service">which kind of counselling fits</Link> sorts that in
              about two minutes. If the question is affordability rather than fit, go straight to{' '}
              <Link href="/tools/therapy-cost-bc">what counselling costs in BC</Link>, because the
              answer depends on your extended health plan rather than on anything published here.
            </p>
            <p>
              Prefer to read? The <Link href="/guides">counselling guides</Link> cover the same
              ground in more depth, <Link href="/compare">the comparisons</Link> lay out the
              trade-offs between options, and <Link href="/pricing">fees and coverage</Link> has
              the numbers in full.
            </p>
          </div>
        </div>
      </section>

      <SceneBand seed={'tools'} />

      <CtaBand />
    </>
  );
}

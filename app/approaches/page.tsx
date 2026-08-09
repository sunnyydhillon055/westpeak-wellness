import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { approaches } from '@/lib/approaches';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Counselling Approaches Explained | Westpeak' },
  description:
    'What CBT, ACT, IFS, somatic work, DBT skills and mindfulness-based programmes actually involve — including where each one works poorly.',
  alternates: { canonical: `${site.domain}/approaches` },
  openGraph: {
    type: 'website',
    title: 'Counselling Approaches Explained | Westpeak',
    description: 'The methods behind the therapy, what the evidence supports each for, and when each is the wrong choice.',
    url: `${site.domain}/approaches`,
  },
};

export default function ApproachesHub() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Counselling approaches',
      itemListElement: approaches.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: a.title,
        url: `${site.domain}/approaches/${a.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Approaches', item: `${site.domain}/approaches` },
      ],
    },
  ];

  return (
    <>
      <section className="hero hero--approaches" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Approaches</p>
          <h1>The methods, and when each one fits.</h1>
          <p className="lede">
            The service pages are organised by what you are bringing. These are organised by how the
            work is done — because people arrive having been recommended a specific method, or having
            tried one that did not suit them, and that is a different question.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See services instead</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <p className="crumb"><Link href="/">Home</Link> / Approaches</p>
          <Figure name="approach-selector" />
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {approaches.map((a) => (
              <div className="card" key={a.slug}>
                <Link href={`/approaches/${a.slug}`} className="card-link">
                  <div className="hub-card-head"><span className="icon-chip icon-chip--sm" aria-hidden="true"><Sparkles strokeWidth={1.7} /></span><h2 className="card-title">{a.title}</h2></div>
                  <p>{a.lede}</p>
                  <span className="more">{a.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Not sure which of these applies to you? Working that out is part of the job rather than
              a prerequisite —{' '}
              <Link href={site.bookingPath}>ask in a free 15-minute consultation</Link>.
            </p>
          </div>

          <div className="prose" style={{ marginTop: 44 }}>
            <h2>Two approaches with their own pages</h2>
            <p>
              <Link href="/services/emdr-therapy">EMDR</Link> and{' '}
              <Link href="/guides/how-the-gottman-method-works">the Gottman Method</Link> are covered
              in full elsewhere rather than duplicated here — EMDR because it is one of the practice&rsquo;s
              main offerings, and Gottman because it belongs with{' '}
              <Link href="/services/couples-therapy">couples therapy</Link> rather than in a general
              list of methods.
            </p>

            <h2>How the choice is actually made</h2>
            <p>
              Being trained in several methods is only useful if the choice between them can be
              explained. Broadly: where something specific and current is maintaining a difficulty —
              avoidance, a thinking pattern, a habit —{' '}
              <Link href="/approaches/cognitive-behavioural-therapy">CBT</Link> tends to move fastest
              and has the largest evidence base. Where a memory is still firing in the present
              regardless of what you understand, <Link href="/services/emdr-therapy">EMDR</Link> is
              the more direct route. Where the nervous system holds a pattern that talking has not
              reached, <Link href="/approaches/somatic-therapy">somatic work</Link> addresses what
              insight does not.
            </p>
            <p>
              Where you already understand the pattern completely and remain stuck,{' '}
              <Link href="/approaches/acceptance-and-commitment-therapy">ACT</Link> targets the
              struggle rather than the symptom. Where the experience is of being genuinely divided
              against yourself,{' '}
              <Link href="/approaches/internal-family-systems">parts work</Link> fits that experience
              better than models that assume a single voice. Where emotion arrives faster than
              thought, <Link href="/approaches/dbt-informed-skills">DBT-informed skills</Link> are the
              most immediately practical — with an honest account of what full DBT involves and when
              you need it instead.
            </p>
            <p>
              And where the goal is preventing a depressive episode from recurring rather than
              treating one,{' '}
              <Link href="/approaches/mindfulness-based-approaches">mindfulness-based programmes</Link>{' '}
              have specific evidence for exactly that — which is a narrower and stronger claim than
              the general enthusiasm around the word suggests.
            </p>

            <h2>Why every one of these pages says where it works poorly</h2>
            <p>
              A method page that lists only strengths is an advertisement. Each of these states the
              situations in which the approach is the wrong choice, because that is the information
              that actually helps you choose — and because a practitioner who cannot say when their
              method does not apply is someone to be careful of. The same principle governs the rest
              of the site; see <Link href="/editorial-policy">how these pages are written</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Not sure which method you need?"
        text="That is an entirely normal position, and working it out is part of the consultation rather than something to settle beforehand."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

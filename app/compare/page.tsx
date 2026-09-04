import type { Metadata } from 'next';
import Link from 'next/link';
import { comparisons } from '@/lib/comparisons';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { Scale } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/compare') },
  title: 'Compare Your Options',
  description:
    'Straight comparisons for people deciding about therapy in BC: types of therapist, formats, and approaches, with the trade-offs stated plainly.',
  alternates: { canonical: `${site.domain}/compare` },
};

export default function CompareHub() {
  return (
    <>
      {/* An index page with no entity of its own. It lists dozens of pages a
          crawler will follow, and described itself as nothing. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPage({
              path: "/compare",
              name: "Comparisons",
              description:
                "Straight comparisons for people deciding about therapy in BC: types of therapist, formats, and approaches, with the trade-offs stated.",
              updated: COLLECTION_DATES["services"],
              type: "CollectionPage",
            })
          ),
        }}
      />
      <section className="hero hero--compare" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Compare</p>
          <h1>Decisions, with the trade-offs stated.</h1>
          <p className="lede">
            Choosing a therapist means making several decisions at once, usually with incomplete
            information and often while you are not at your best. These comparisons lay out the
            real differences, including the ones that point away from this practice.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/guides">Read the counselling guides</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Compare', path: '/compare' }]} />
          <Figure name="four-decisions" />
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {comparisons.map((c) => (
              <div className="card" key={c.slug}>
                <Link href={`/compare/${c.slug}`} className="card-link">
                  <div className="hub-card-head"><span className="icon-chip icon-chip--sm" aria-hidden="true"><Scale strokeWidth={1.7} /></span><h2 className="card-title">{c.title}</h2></div>
                  <p>{c.lede}</p>
                  <span className="more">{c.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Still weighing it up? A{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> includes an honest
              answer if what you need is someone other than a Registered Clinical Counsellor.
            </p>
          </div>

          <div className="prose" style={{ marginTop: 44 }}>
            <h2>The four decisions people are actually making</h2>
            <p>
              Almost everyone arriving at counselling is deciding four things at once, usually without
              realising they are separable. <strong>Who</strong>, which designation, which is what
              determines whether there is any complaints process behind the person you are trusting.{' '}
              <strong>What</strong>, which method, which matters more for some difficulties than
              others and matters a great deal for trauma. <strong>How much</strong>: what it costs,
              what a plan reimburses, and which free routes you may already be entitled to. And{' '}
              <strong>how often</strong>, which people treat as a scheduling question and which quietly
              determines what the therapy can do.
            </p>
            <p>
              Each page here takes one of those, sets out the options in a table, and says plainly
              where each option is the wrong answer, including the cases where the wrong answer is
              this practice. A page that never points anywhere else is advertising, whatever it is
              labelled.
            </p>

            <h2>Where to start, depending on what you are stuck on</h2>
            <p>
              If you do not yet know who you are supposed to be looking for, start with{' '}
              <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">RCC vs psychologist vs social worker</Link>.{' '}
It is the decision that most changes what you can actually get, since only some of
              those designations can diagnose or assess. If someone has suggested a coach, or you are
              weighing one, <Link href="/compare/therapy-vs-coaching">therapy vs coaching</Link> sets
              out the accountability gap the two job titles conceal.
            </p>
            <p>
              If a doctor has raised medication, or you are trying to work out whether to,{' '}
              <Link href="/compare/therapy-medication-or-both">therapy, medication, or both</Link>{' '}
              explains what each acts on and who decides, with the plain caveat that a counsellor
              cannot prescribe or advise on it. If money is the constraint,{' '}
              <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
              is the one to read first, because a great many people have an employer-funded
              entitlement they have never used.
            </p>
            <p>
              If the question is about the relationship rather than one person,{' '}
              <Link href="/compare/individual-vs-couples-therapy">individual vs couples therapy</Link>{' '}
              covers how to choose when only one of you wants to go. If trauma is what brought you
              here, <Link href="/compare/cbt-vs-emdr-for-trauma">CBT vs EMDR</Link> is the comparison
              that most often changes what people ask for. And if the work has already started,{' '}
              <Link href="/compare/weekly-vs-biweekly-sessions">weekly vs biweekly</Link> is the
              decision most likely to be made by accident.
            </p>
            <p>
              You may also want <Link href="/guides">the counselling guides</Link>, the{' '}
              <Link href="/glossary">glossary of terms</Link> if the vocabulary is the obstacle, or the
              practical detail on <Link href="/pricing">fees and extended-health coverage</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Still weighing it up?"
        text="Fifteen minutes on a call will settle more than another hour of reading. It is free, and there is no obligation afterward."
      />
    </>
  );
}

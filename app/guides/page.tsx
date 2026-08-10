import type { Metadata } from 'next';
import Link from 'next/link';
import { guides } from '@/lib/guides';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import Figure from '@/components/Figure';
import { BookOpen } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Counselling Guides',
  description:
    'Plain-language guides to therapy in BC — what the research says, what to expect, and how to decide. Written by a Registered Clinical Counsellor.',
  alternates: { canonical: `${site.domain}/guides` },
};

export default function GuidesHub() {
  return (
    <>
      <section className="hero hero--guides" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Guides</p>
          <h1>Answers, before you have to book anything.</h1>
          <p className="lede">
            Most people spend weeks deciding whether to start therapy, and the information they
            find is either a sales page or a research abstract. These guides aim for the middle:
            what the evidence actually says, what it does not settle, and what it means if you
            live in British Columbia.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Guides', path: '/guides' }]} />
          <Figure name="first-session-flow" />
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {guides.map((g) => (
              <div className="card" key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="card-link">
                  <div className="hub-card-head"><span className="icon-chip icon-chip--sm" aria-hidden="true"><BookOpen strokeWidth={1.7} /></span><h2 className="card-title">{g.title}</h2></div>
                  <p>{g.lede}</p>
                  <span className="more">{g.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Read enough? A <Link href={site.bookingPath}>free 15-minute consultation</Link> answers
              the question no guide can — whether this particular counsellor is a fit for you.
            </p>
          </div>

          <p style={{ marginTop: 32 }}>
            Looking for something more specific? Browse{' '}
            <Link href="/services">the full list of counselling services</Link>, compare{' '}
            <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">the different kinds of therapist in BC</Link>,
            or see <Link href="/pricing">fees and extended-health coverage</Link>.
          </p>
        </div>
      </section>

      <SceneBand seed={'guides'} />

      <CtaBand
        heading="Reading is a fine place to start."
        text="When you are ready for the next step, a free 15-minute consultation costs nothing and commits you to nothing."
      />
    </>
  );
}

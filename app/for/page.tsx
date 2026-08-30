import type { Metadata } from 'next';
import Link from 'next/link';
import { audiences } from '@/lib/audiences';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { Users } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/for') },
  title: 'Who We Work With',
  description:
    'Online counselling across BC for new parents, students, shift workers, and others — written for the specific pressures each group carries.',
  alternates: { canonical: `${site.domain}/for` },
};

export default function ForHub() {
  return (
    <>
      <section className="hero hero--for" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Who we work with</p>
          <h1>Written for where you actually are.</h1>
          <p className="lede">
            Anxiety in a first-year nursing rotation is not the same problem as anxiety at four
            months postpartum, even when the diagnosis would read identically. These pages start
            from the situation rather than the symptom.
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Who we work with', path: '/for' }]} />
          <Figure name="bc-reach" />
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            {audiences.map((a) => (
              <div className="card" key={a.slug}>
                <Link href={`/for/${a.slug}`} className="card-link">
                  <div className="hub-card-head"><span className="icon-chip icon-chip--sm" aria-hidden="true"><Users strokeWidth={1.7} /></span><h2 className="card-title">{a.title}</h2></div>
                  <p>{a.lede}</p>
                  <span className="more">{a.readMinutes} min read →</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              Recognise yourself in one of these? A{' '}
              <Link href={site.bookingPath}>free 15-minute consultation</Link> costs nothing and
              commits you to nothing.
            </p>
          </div>

          <div className="prose" style={{ marginTop: 44 }}>
            <h2>Why these pages exist at all</h2>
            <p>
              Anxiety is anxiety, and a page per demographic can easily be a marketing device rather
              than a useful distinction. These pages exist where the <em>context</em> genuinely changes
              the work — not the diagnosis, but what surrounds it.
            </p>
            <p>
              A new parent is not simply an adult with low mood; they are an adult with low mood, no
              sleep, a body that has recently done something enormous, and a strong cultural script
              about how they are supposed to feel. A rotating shift worker is not simply someone with
              insomnia; the standard sleep advice is unusable for them. A first-generation adult
              weighing an obligation to their parents is not experiencing a boundary problem in the
              way most boundary advice assumes. In each case the honest starting point is different,
              and starting in the wrong place wastes sessions.
            </p>
            <p>
              What does not change is the method. The approaches behind these pages are the same ones
              on <Link href="/services">the services list</Link> — the difference is what gets assumed
              at the beginning and what has to be established.
            </p>

            <h2>If none of these is you</h2>
            <p>
              Most people who book here do not match one of these pages, and that is entirely normal.
              These exist for situations with a distinct enough set of pressures to be worth writing
              about separately, not as a list of who is welcome.
            </p>
            <p>
              A better route in that case is to start from the difficulty rather than the demographic:{' '}
              <Link href="/services/anxiety-counselling">anxiety</Link>,{' '}
              <Link href="/services/depression-counselling">depression</Link>,{' '}
              <Link href="/services/trauma-therapy">trauma</Link>, or{' '}
              <Link href="/services/couples-therapy">a relationship</Link>. If you are not sure the
              difficulty even has a name yet,{' '}
              <Link href="/guides/signs-it-might-be-time-for-therapy">signs it might be time for therapy</Link>{' '}
              is written for exactly that position, and the{' '}
              <Link href="/guides">counselling guides</Link> cover the rest.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Not sure where you fit?"
        text="That is a good use of a free 15-minute consultation. No pressure, no commitment."
      />
    </>
  );
}

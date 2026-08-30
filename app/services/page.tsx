import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { getServiceIcon } from '@/lib/icon-map';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/services') },
  title: 'Counselling Services (Online, BC-wide)',
  description:
    'Online counselling across BC: individual and couples therapy, EMDR, trauma, anxiety and depression. Book a free consultation.',
  alternates: { canonical: `${site.domain}/services` },
};

export default function Services() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>Counselling matched to what you need.</h1>
          <p className="lede">Focused services rooted in evidence-based modalities — all offered online, anywhere in British Columbia.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a Free Consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Services', path: '/services' }]} />
          <Figure name="service-axes" />
          <div className="grid grid-3">
            {services.map((s, i) => {
              const Icon = getServiceIcon(s.slug);
              /* Nine services need to be distinguishable at a glance. The bar
                 walks the brand ramp rather than introducing new hues. */
              const ACCENTS = [
                'var(--blue-deep)', 'var(--clay)', 'var(--blue)',
                'var(--clay-deep)', 'var(--blue-deeper)', 'var(--clay)',
                'var(--blue)', 'var(--blue-deep)', 'var(--clay-deep)',
              ];
              return (
                <div className="card svc-tile" key={s.slug}>
                  <span className="svc-tile-bar" style={{ background: ACCENTS[i % ACCENTS.length] }} aria-hidden="true" />
                  <Link href={`/services/${s.slug}`} className="card-link">
                    <div className="svc-card-head">
                      <span className="icon-chip" aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                      <h2 className="card-title">{s.name}</h2>
                    </div>
                    <p>{s.short}</p>
                    <span className="more">{s.name} in BC →</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <h2>How to tell which one you need</h2>
          <p>
            You do not have to arrive knowing. Most people do not, and working it out is a reasonable
            use of the first conversation rather than something to settle beforehand. That said, a few
            rough distinctions help.
          </p>
          <p>
            <strong>Start with the problem, not the modality.</strong>{' '}
            <Link href="/services/anxiety-counselling">Anxiety counselling</Link> and{' '}
            <Link href="/services/depression-counselling">depression counselling</Link> are named for
            what you are experiencing.{' '}
            <Link href="/services/emdr-therapy">EMDR</Link> and the Gottman Method are named for how
            the work is done — they are approaches used within the others rather than separate
            destinations. If you know the difficulty but not the method, that is the right way round.
          </p>
          <p>
            <strong>Individual or couples</strong> is usually the first real fork, and it is not
            always obvious — <Link href="/compare/individual-vs-couples-therapy">the comparison of the two</Link>{' '}
            sets out when each makes more sense, including when relationship difficulty is better
            addressed on your own.
          </p>
          <p>
            <strong>Language and cultural context</strong> are not an add-on.{' '}
            <Link href="/services/punjabi-counselling">Sessions in Punjabi</Link> and{' '}
            <Link href="/services/south-asian-mental-health">South Asian mental health work</Link> exist
            because for many people the alternative is spending a session translating rather than
            working.
           Not sure which of these fits?{' '}
            <Link href="/tools/which-service">Five questions</Link> will suggest a starting point.</p>
          <p>
            And if you are still deciding whether to do this at all, the{' '}
            <Link href="/guides">counselling guides</Link> cover what therapy involves, and{' '}
            <Link href="/guides/how-to-find-a-therapist-in-bc">how to find a therapist in BC</Link>{' '}
            includes the free options worth trying first.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Practical detail</p>
          <h2>What every service has in common</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Fully virtual, BC-wide</h3>
              <p style={{ marginBottom: 0 }}>
                Secure video from anywhere in the province — see{' '}
                <Link href="/online-counselling">the areas served across BC</Link>.
              </p>
            </div>
            <div className="card">
              <h3>English or Punjabi</h3>
              <p style={{ marginBottom: 0 }}>
                Any service can run in either language, or both within a session.
              </p>
            </div>
            <div className="card">
              <h3>Free 15-minute start</h3>
              <p style={{ marginBottom: 0 }}>
                Every service begins with{' '}
                <Link href="/book">a no-cost consultation</Link>, with no obligation afterward.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 28 }}>
            All sessions are provided by a Registered Clinical Counsellor —{' '}
            <Link href="/about">background and training here</Link>.
          </p>
        </div>
      </section>


      <section className="section section--ghost">
        <div className="container prose">
          <p className="eyebrow">Choosing between them</p>
          <h2>The list is not nine separate products</h2>
          <p>
            Nine service pages can imply nine different things being sold, which is not how the work
            actually runs. Most of these overlap heavily, and a fair number of people end up doing two
            of them at once. The distinctions that genuinely matter are only three.
          </p>
          <p>
            <strong>Who is in the room.</strong>{' '}
            <Link href="/services/individual-therapy">Individual therapy</Link> and{' '}
            <Link href="/services/couples-therapy">couples therapy</Link> are structurally different
            pieces of work with different assessments, not the same conversation with an extra chair.
            If you are not sure which your situation calls for,{' '}
            <Link href="/compare/individual-vs-couples-therapy">individual vs couples therapy</Link>{' '}
            walks through it, including the common case where only one of you wants to go.
          </p>
          <p>
            <strong>What is being worked on.</strong>{' '}
            <Link href="/services/anxiety-counselling">Anxiety</Link>,{' '}
            <Link href="/services/depression-counselling">depression</Link> and{' '}
            <Link href="/services/trauma-therapy">trauma</Link> are three genuinely different jobs.
            Anxiety work is largely about interrupting avoidance; depression work often has to move
            from the outside in, because waiting for motivation is the trap; trauma work is sequenced,
            building capacity before anything is opened. That sequencing is not a preference, and{' '}
            <Link href="/guides/what-trauma-actually-means">what trauma actually means</Link> explains
            why rushing it is the most common way trauma therapy goes wrong.
          </p>
          <p>
            <strong>Which method.</strong>{' '}
            <Link href="/services/emdr-therapy">EMDR</Link> is a specific eight-phase protocol rather
            than a general orientation, and it is the more direct route when a memory keeps firing in
            the present regardless of what you understand intellectually.{' '}
            <Link href="/compare/cbt-vs-emdr-for-trauma">CBT vs EMDR for trauma</Link> is the
            comparison most people arrive wanting.
          </p>
          <p>
            <Link href="/services/punjabi-counselling">Counselling in Punjabi</Link> and{' '}
            <Link href="/services/south-asian-mental-health">South Asian mental health</Link> are not a
            separate category of therapy — they are the same methods without the translation overhead,
            and without having to establish the family context from scratch.{' '}
            <Link href="/services/online-counselling-bc">Online counselling</Link> is the delivery
            format every one of these uses.
          </p>

          <h2>If you are still not sure</h2>
          <p>
            Working out which service fits is genuinely part of the consultation rather than a
            prerequisite for it. Arriving and saying &ldquo;I do not know which of these I need&rdquo;
            is an entirely ordinary opening, and it is a faster route to an answer than another hour of
            reading. If you would rather read first,{' '}
            <Link href="/guides/what-to-expect-first-therapy-session">what happens in a first session</Link>{' '}
            and{' '}
            <Link href="/guides/questions-to-ask-a-therapist">questions worth asking a therapist</Link>{' '}
            cover the ground properly, and{' '}
            <Link href="/for">the pages written for particular situations</Link> may be a better
            starting point than the service list.{' '}
            <Link href="/answers">Short answers to the questions people ask most</Link> covers
            cost, coverage and what a first session involves without reading a full page, and{' '}
            <Link href="/approaches">the approach pages</Link> are the place to start if what you
            want to understand is the method rather than the problem.
          </p>
        </div>
      </section>

      {/* AREAS SERVED.
          Added 2026-08-18. This page linked to no city page at all, and neither
          did the homepage — so every city page sat behind a single hub. It
          belongs here specifically because the service pages are province-wide
          and the city pages are where "province-wide" is made concrete. */}
      <section className="section section--tint">
        <div className="container prose">
          <h2>Every service on this page, anywhere in BC</h2>
          <p>
            None of the services above is limited by where you live. The practice is virtual and
            registered across British Columbia, so a session from Prince George is the same
            session as one from Surrey. What does change by location is what is available to you
            locally, and a few places have their own page because that gap changes what there is
            to say.
          </p>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {locations.map((l) => (
              <Link key={l.slug} className="chip" href={`/online-counselling/${l.slug}`}>
                Online counselling in {l.city}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            What is available locally <em>in Punjabi</em> is a separate question with a very
            different answer in most of the province — those regions have{' '}
            <Link href="/punjabi-counselling">their own pages</Link>, and the full provincial
            picture is on <Link href="/online-counselling">areas served</Link>.
          </p>
        </div>
      </section>
      <CtaBand heading="Not sure where to start?" text="Book a free 15-minute consultation. We&rsquo;ll figure it out together." />
    </>
  );
}

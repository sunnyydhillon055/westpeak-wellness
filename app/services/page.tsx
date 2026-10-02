import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import { site } from '@/lib/site';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { getServiceIcon } from '@/lib/icon-map';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { counsellorsFor, listOf } from '@/lib/city-service-page';
import { counsellorsForService } from '@/lib/counsellor-cards';
import { offeringLanguages, pairedLanguageClause } from '@/lib/snippet-facts';
import { FALLBACK_CATALOG, fallbackFee } from '@/lib/cliniko-catalog';

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

/* WHO, WHAT IT COSTS AND IN WHICH LANGUAGE, FROM DATA — 1 Oct 2026.
 *
 * This hub said it offered "five counselling services ... across British
 * Columbia and Alberta" above six cards, told readers that "any service can
 * run in either language" when couples and EMDR are not offered in Punjabi,
 * named no counsellor and stated no fee (production at 375px: the diagram at
 * y=1279, the first card at 1392, no $ figure, Savneet never named; 3 of 34
 * book_clicks). Each of those is now read from where it is decided:
 *
 *   - the count from lib/services.ts, in words;
 *   - who: the counsellors accepting individual clients in BC (everyone
 *     accepting new clients), and per card the counsellors who offer that
 *     service (lib/counsellor-cards.ts, the service pages' own rule), so the
 *     founder is excluded by the accepting flag, never by name;
 *   - the fees from fallbackFee, which scripts/price-drift.mjs checks;
 *   - the languages from offeringLanguages() (lib/snippet-facts.ts).
 *
 * Alberta is not mentioned: that reach is gated. */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const inWords = (n: number) => NUMBER_WORDS[n] ?? String(n);
const minutesOf = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)?.minutes;
const firstName = (name: string) => name.split(' ')[0];
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

export default function Services() {
  const accepting = counsellorsFor({ bookingService: 'individual-therapy' });
  const langs = offeringLanguages();
  const paired = pairedLanguageClause(langs);
  const languageLine = `Individual counselling in ${langs.individual}${paired ? `; ${paired}` : ''}.`;
  const lede =
    `Individual, couples, EMDR and family counselling by video anywhere in BC, with ${listOf(accepting.map((p) => p.name), 'or')}. ` +
    `Sessions are ${fallbackFee('Individual Counselling')} for ${minutesOf('Individual Counselling')} minutes (${fallbackFee('Couples Counselling')} for a couple) after a free 30-minute call.`;
  return (
    <>
      {/* This page carried no page-level entity. The layout's organisation and
          website nodes were on it, so a validator saw structured data and
          reported nothing wrong, while nothing described the page itself: no
          name, no description, no language, no date, no author. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPage({
              path: "/services",
              name: "Counselling services",
              description:
                "Individual, couples, EMDR and family counselling, delivered online anywhere in British Columbia. What each one involves and who it suits.",
              updated: COLLECTION_DATES["services"],
              type: "CollectionPage",
            })
          ),
        }}
      />
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Our services</p>
          <h1>Counselling matched to what you need.</h1>
          <p className="lede">{lede}</p>
          <p className="direct-answer">
            Westpeak Wellness offers {inWords(services.length)} counselling services online across British Columbia: individual therapy (for anxiety, depression, trauma and life transitions), Gottman-informed couples therapy, EMDR therapy, family counselling, Punjabi-speaking counselling and Tagalog-speaking counselling. All are delivered by Registered Clinical Counsellors over secure video, are reimbursable through many extended health plans, depending on the plan, and begin with a free 30-minute consultation.
          </p>
          <Updated iso={COLLECTION_DATES['services']} />
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a Free Consultation</Link>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Services', path: '/services' }]} />
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
              /* Who takes this work, by first name. */
              const who = counsellorsForService(s).map((p) => firstName(p.name));
              return (
                /* The anchor is the "<name> in BC" line alone, stretched over
                   the tile by .card--stretch (globals.css), as on /for and the
                   city hubs. The whole tile still clicks; the link text is no
                   longer the whole tile. 2 Oct 2026. */
                <div className="card card--stretch svc-tile" key={s.slug}>
                  <span className="svc-tile-bar" style={{ background: ACCENTS[i % ACCENTS.length] }} aria-hidden="true" />
                  <div className="svc-card-head">
                    <span className="icon-chip" aria-hidden="true"><Icon strokeWidth={1.6} /></span>
                    <h2 className="card-title">{s.name}</h2>
                  </div>
                  <p>{s.short}</p>
                  {who.length > 0 && (
                    <p style={{ margin: '0 0 10px', fontSize: 'var(--fs-small)', color: 'var(--ink-soft)' }}>
                      With {listOf(who, 'or')}
                    </p>
                  )}
                  <Link href={`/services/${s.slug}`} className="more card-stretch">
                    {s.name} in BC<span aria-hidden="true"> →</span>
                  </Link>
                </div>
              );
            })}
          </div>
          {/* Below the cards since 1 Oct 2026: at 375px the diagram sat
              above them and pushed the first card to y=1392. */}
          <Figure name="service-axes" />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <h2>Who we see</h2>
          <p>
            Adults, young adults and teens, across British Columbia and, with Camille, anywhere in
            Canada. For a teen, a parent is usually part of the first conversation and the teen
            decides how much of the work is theirs alone; in BC a young person who understands the
            care can consent to it themselves under the Infants Act, and that is respected here.
            Several pages are written for a particular situation rather than a diagnosis:{' '}
            <Link href="/for/teens-and-young-adults">teens and young adults</Link>,{' '}
            <Link href="/for/university-students">university students</Link>,{' '}
            <Link href="/for/international-students">international students</Link>,{' '}
            <Link href="/for/new-parents">new parents</Link>,{' '}
            <Link href="/for/healthcare-and-shift-workers">healthcare and shift workers</Link>,{' '}
            <Link href="/for/truck-drivers">truck drivers</Link>,{' '}
            <Link href="/for/first-gen-south-asian-adults">first- and second-generation South Asian adults</Link>{' '}
            and <Link href="/for">the rest of the situations we write for</Link>. For anything else,{' '}
            <Link href="/answers">the instant answers page</Link> holds every question the site answers.
          </p>

          <h2>How to tell which one you need</h2>
          <p>
            You do not have to arrive knowing. Most people do not, and working it out is a reasonable
            use of the first conversation rather than something to settle beforehand. That said, a few
            rough distinctions help.
          </p>
          <p>
            <strong>Start with the problem, not the modality.</strong>{' '}
            <Link href="/services/individual-therapy">Anxiety counselling</Link> and{' '}
            <Link href="/services/individual-therapy">depression counselling</Link> are named for
            what you are experiencing.{' '}
            <Link href="/services/emdr-therapy">EMDR</Link> and the Gottman Method are named for how
            the work is done. They are approaches used within the others rather than separate
            destinations. If you know the difficulty but not the method, that is the right way round.
          </p>
          <p>
            <strong>Individual or couples</strong> is usually the first real fork, and it is not
            always obvious, <Link href="/compare/individual-vs-couples-therapy">the comparison of the two</Link>{' '}
            sets out when each makes more sense, including when relationship difficulty is better
            addressed on your own.
          </p>
          <p>
            <strong>Language and cultural context</strong> are not an add-on.{' '}
            <Link href="/services/punjabi-counselling">Sessions in Punjabi</Link> and{' '}
            <Link href="/services/punjabi-counselling">South Asian mental health work</Link> exist
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
                Secure video from anywhere in the province, see{' '}
                <Link href="/online-counselling">the areas served across BC</Link>.
              </p>
            </div>
            <div className="card">
              <h3>{cap(langs.individual)}</h3>
              <p style={{ marginBottom: 0 }}>{languageLine}</p>
            </div>
            <div className="card">
              <h3>Free 30-minute start</h3>
              <p style={{ marginBottom: 0 }}>
                Every service begins with{' '}
                <Link href="/book">a no-cost consultation</Link>, with no obligation afterward.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 28 }}>
            All sessions are provided by a Registered Clinical Counsellor, {' '}
            <Link href="/about">background and training here</Link>.
          </p>
        </div>
      </section>


      <section className="section section--ghost">
        <div className="container prose">
          <p className="eyebrow">Choosing between them</p>
          <h2>Not sure which one you need?</h2>
          <p>
            {cap(inWords(services.length))} service pages can imply {inWords(services.length)} different things being sold, which is not how the work
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
            <Link href="/services/individual-therapy">Anxiety</Link>,{' '}
            <Link href="/services/individual-therapy">depression</Link> and{' '}
            <Link href="/services/individual-therapy">trauma</Link> are three genuinely different jobs.
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
            <Link href="/services/punjabi-counselling">South Asian mental health</Link> are not a
            separate category of therapy. They are the same methods without the translation overhead,
            and without having to establish the family context from scratch.{' '}
            <Link href="/online-counselling">Online counselling</Link> is the delivery
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
            <Link href="/faq">The FAQ</Link> covers
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
            different answer in most of the province. Those regions have{' '}
            <Link href="/punjabi-counselling">their own pages</Link>, and the full provincial
            picture is on <Link href="/online-counselling">areas served</Link>.
          </p>
        </div>
      </section>
      <CtaBand heading="Not sure where to start?" text="Book a free 30-minute consultation. We&rsquo;ll figure it out together." />
    </>
  );
}

import type { Metadata } from 'next';
import Updated from '@/components/Updated';
import Link from 'next/link';
import { locations } from '@/lib/locations';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import Photo from '@/components/ui/Photo';
import Figure from '@/components/Figure';
import Breadcrumbs from '@/components/Breadcrumbs';
import ExtraSections from '@/components/ExtraSections';
import { ogBase } from '@/lib/og-meta';
import { webPage } from '@/lib/schema';
import { COLLECTION_DATES } from '@/lib/page-dates';
import { townFinder } from '@/lib/health-authorities';
import CounsellorCards from '@/components/CounsellorCards';
import NextConsultLine from '@/components/NextConsultLine';
import { counsellorsFor } from '@/lib/city-service-page';
import { FALLBACK_CATALOG, fallbackFee } from '@/lib/cliniko-catalog';
import { SESSION_SECURITY_MD } from '@/lib/policies';
import { rich } from '@/lib/rich';
import BookLink from '@/components/BookLink';
import { plainText } from '@/lib/plain-text';
import { BC_HUB_FAQS } from '@/lib/bc-hub-faqs';

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/online-counselling') },
  /* RESEARCH, 17 Sep 2026. Search Console holds about 260 impressions a
     quarter for "online counselling bc", "online counsellor bc", "virtual
     counselling bc" and their variants, at positions 43 to 72, and this page
     was titled "Areas Served Across British Columbia" - a title that matches
     none of them. The pages that hold the top ten for the Vancouver form of
     the query all title themselves "Online Counselling <place> | Virtual
     Therapy ..." and open with a three-step "how it works". This page is now
     the landing page for the province-wide query, not an index of cities. */
  title: { absolute: 'Online Counselling in BC | Virtual Therapy, Province-Wide' },
  /* No "evenings" since 1 Oct 2026: the calendar holds what it holds, and a
     description is the one sentence a searcher reads before the page. */
  description:
    'Online counselling anywhere in BC with Registered Clinical Counsellors, in English, Punjabi or Tagalog. Free 15-minute consultation, no referral needed.',
  alternates: { canonical: `${site.domain}/online-counselling` },
};

/* FULLY STATIC — 3 Oct 2026 (item 429). This page exported `revalidate`
   for the catalogue fee and the next-consultation line. A page Next
   re-renders in production goes out without the inlined first-paint CSS
   (scripts/inline-css.mjs only sees the build), and production served these
   templates with blocking stylesheet links. The fee is now a build-time fact
   (a price change in Cliniko reaches the page with the next deploy) and the
   next consultation is filled in by the browser (components/NextConsultSlot.tsx).
   `inline-css --check` fails if an indexable route exports revalidate again. */

/* WHO YOU WOULD SEE, AND WHAT IT COSTS — 1 Oct 2026.
 *
 * The province-wide head page for "online counselling bc", "online
 * counsellor bc" and "virtual counselling bc" (48 impressions at 25.19 on
 * 26 Sep, no clicks) named no counsellor and stated no fee: "$140" was only
 * in the Organization JSON-LD. The pages ranking above it (New Tides,
 * Thrive) show the team and the fees on exactly this page type.
 *
 * Who: every counsellor accepting individual clients in BC, which is every
 * counsellor accepting new clients, by the same rule the city-service pages
 * use (lib/city-service-page.ts), so the founder is excluded by the flag.
 * The fee: fallbackFee, the figures scripts/price-drift.mjs checks against
 * Cliniko on every build. Coverage stays plan-dependent. */
const minutesOf = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)?.minutes;
const FEE_SENTENCE =
  `An individual session is ${fallbackFee('Individual Counselling')} for ${minutesOf('Individual Counselling')} minutes and a couples session ${fallbackFee('Couples Counselling')} for ${minutesOf('Couples Counselling')} minutes, paid by card when you book a session; the free consultation takes no card. Whether your extended health plan reimburses it depends on the plan.`;

export default function LocationsIndex() {
  const counsellors = counsellorsFor({ bookingService: 'individual-therapy' });
  const byRegion = locations.reduce<Record<string, typeof locations>>((acc, l) => {
    (acc[l.region] ||= []).push(l); return acc;
  }, {});
  const towns = townFinder(locations);
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
              path: "/online-counselling",
              name: "Online counselling across British Columbia",
              description:
                "How province-wide virtual counselling works, and the cities and regions served by secure video from anywhere in BC.",
              updated: COLLECTION_DATES["locations"],
              type: "CollectionPage",
            })
          ),
        }}
      />
      <section className="hero hero--locations" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Serving all of BC</p>
          {/* "in BC", the words of the head queries ("online counselling bc",
              "online counsellor bc", 28 of 125 impressions at 35 on 3 Oct
              2026), as the title already says. 3 Oct 2026. */}
          <h1>Online counselling in BC, anywhere in the province</h1>
          <p className="lede">Westpeak Wellness is fully virtual, wherever you are in BC, you can work with a Registered Clinical Counsellor from the comfort of your own space.</p>
          {/* The answer first, in the searcher's words, and no typed Alberta
              clause: who may be seen in Alberta is gated on insurance and
              said where it is generated (serviceAreaLine). 3 Oct 2026. */}
          <p className="direct-answer">
            Online counselling in BC is a scheduled session by secure video with a Registered Clinical Counsellor, from wherever in the province you are: Vancouver, Surrey, Victoria, Kelowna, Kamloops, Prince George or a town too small to have a counselling office. At Westpeak Wellness every session works this way, in English, Punjabi or Tagalog depending on the counsellor, with a free 15-minute consultation first and no referral needed.
          </p>
          <Updated iso={COLLECTION_DATES['locations']} />
          <div className="btn-row" style={{ marginTop: 24 }}>
            {/* A counted button: this was a plain <Link> no book_click saw, on
                the province-wide landing page. 3 Oct 2026. */}
            <BookLink location="hero-online">Book a free consultation</BookLink>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
          {/* The next free consultation with each counsellor taking new
              clients, from the Cliniko cache. Prints nothing when there is
              none, and promises no hours. 1 Oct 2026. */}
          <NextConsultLine location="next-online" slugs={counsellors.map((p) => p.slug)} style={{ margin: '14px 0 0', fontSize: '.95rem' }} />
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <Breadcrumbs trail={[{ name: 'Areas served', path: '/online-counselling' }]} />
          <h2>Anywhere in BC means anywhere in BC</h2>
          <Photo
            src="/img/photo/forest-path.jpg"
            alt="A quiet gravel path curving away through tall sunlit conifers in late afternoon light."
            ratio="wide"
            sizes="(max-width: 900px) 92vw, 70vw"
          />
          <Figure name="bc-reach" />
          <p>
            Because there is no office, there is no catchment. A Registered Clinical Counsellor
            registered in British Columbia can work with clients anywhere in the province by secure
            video, under the same ethical, legal, and privacy standards that apply in person. Whether
            you are in a Vancouver apartment, a farmhouse outside Chilliwack, or a work camp north of
            Prince George makes no difference to the session.
          </p>
          <p>
            The one requirement is that you are physically in British Columbia at the time of your
            appointment. Registration is provincial, travelling within BC is fine, travelling outside
            it is not. There is more on the evidence behind video sessions in the guide to{' '}
            <Link href="/guides/is-online-therapy-as-effective-as-in-person">whether online therapy is as effective as in-person</Link>.
          </p>
          {/* Search Console, 17 Sep 2026: the province searches for this in words
              the page did not use. "Virtual counselling" and "virtual therapy"
              outnumber "online" for Vancouver; "counsellor near me" arrives
              from people who have not yet realised that near means nothing to a
              video call; and the Tri-Cities, the Okanagan and Vancouver Island
              searched for a page that named them. */}
          <p>
            People search for this as online counselling, virtual counselling, virtual therapy,
            telehealth and, most often of all, &ldquo;counsellor near me&rdquo;. They are all the same thing
            here. The nearest counsellor is on your own screen, whether that is in Port Moody or
            Port Coquitlam, in Peachland or anywhere else in the Okanagan, in Nanaimo or up-Island
            from Victoria, or in a town too small to have a counselling office at all. The cities
            below have their own pages because people there asked particular questions; the rest of
            the province is served exactly the same way.
          </p>

          <h2>How online counselling works here, in three steps</h2>
          <ol>
            <li>
              <strong>Book a free 15-minute consultation.</strong> Pick a counsellor and a time on the{' '}
              <Link href={site.bookingPath}>booking page</Link>; the next open times are printed there.
              No card, no intake form, no referral.
            </li>
            <li>
              <strong>Talk, and decide.</strong> Fifteen minutes by secure video to say what is going on
              and hear how the counsellor would work with it. Nothing is diagnosed and nothing is owed.
            </li>
            <li>
              <strong>Start, at a pace that suits you.</strong> Weekly or every two weeks, at the open
              times the calendar shows, from wherever in British Columbia you happen to be. You pay per session and claim the
              receipt on your extended health plan; after a crash, ask{' '}
              <Link href="/resources/icbc-counselling-after-a-crash-bc">ICBC about reimbursement</Link> before you start.
            </li>
          </ol>
        </div>
      </section>

      <CounsellorCards
        counsellors={counsellors}
        location="counsellor-city"
        heading="Who you would see"
        intro="Taking new clients and seeing people anywhere in BC by secure video. Each is a Registered Clinical Counsellor; the registration is on the profile and can be checked on the BCACC register."
        footer={
          <p style={{ margin: 0 }}>
            {FEE_SENTENCE} <Link href="/pricing">Every fee is on the fees page</Link>.
          </p>
        }
      />

      <section className="section">
        <div className="container prose">

          {/* Derived, because this said "six" for a month after the count
              reached fifteen. */}
          <h2>Why only {locations.length} cities have their own page</h2>
          <p>
            Most counselling websites list every city in the province. This one does not, deliberately.
            A page about &ldquo;counselling in [city]&rdquo; that is identical to forty others with the
            place name swapped is not useful to anyone reading it, and search engines treat that
            pattern as exactly what it is.
          </p>
          <p>
            So there are pages for the {locations.length} places where something true and specific about accessing
            care there actually changes what the page says: the scarcity of clinicians in the north,
            the cost of a ferry for weekly appointments, the concentration of Punjabi-speaking
            counsellors in the Lower Mainland. Everywhere else is served identically. There is simply
            nothing distinct to write, and pretending otherwise would waste your time.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Local context</p>
          <h2>Cities with their own page</h2>
          {Object.entries(byRegion).map(([region, list]) => (
            <div key={region} style={{ marginBottom: 28 }}>
              <h3 style={{ marginBottom: 14 }}>{region}</h3>
              <div className="chip-grid">
                {list.map((l) => (
                  <Link key={l.slug} className="chip" href={`/online-counselling/${l.slug}`}>
                    Online counselling in {l.city}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {/* This named Burnaby and Nanaimo as towns without a page after both
              had one. The towns below come from each city's own list, so the
              line cannot go stale the same way. 1 Oct 2026. */}
          <p style={{ marginTop: 24, color: 'var(--ink-soft)' }}>
            Not on the list? Look for your town below. If it is not there either, nothing changes:
            everywhere in the province is served on exactly the same terms.
          </p>

          <h2 id="find-your-town" style={{ marginTop: 40 }}>Find your town</h2>
          <p style={{ maxWidth: 760 }}>
            Grouped by the health authority that covers it, because that decides which public
            intake you would join. Each city page names the towns around it; the towns themselves
            have no page of their own and are served the same way.
          </p>
          {towns.map((g) => (
            <div key={g.authority.label} style={{ marginTop: 22 }}>
              <h3 style={{ marginBottom: 10 }}>{g.authority.label}</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {g.cities.map((c) => (
                  <li key={c.slug} style={{ marginBottom: 6 }}>
                    <Link href={`/online-counselling/${c.slug}`}>{c.city}</Link>
                    {c.towns.length ? <>: {c.towns.join(', ')}</> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p style={{ marginTop: 14 }}>
            There is a separate set of pages for{' '}
            <Link href="/punjabi-counselling">Punjabi-speaking counselling by region</Link>, because
            what is available locally in Punjabi is a different question from what is available
            locally in English, and across most of the province the answer is very different.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Getting started</p>
          <h2>Wherever you are, the first step is the same</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            <div className="card">
              <h3>Free consultation</h3>
              <p style={{ marginBottom: 0 }}>
                Fifteen minutes over secure video, at no cost. See{' '}
                <Link href="/book">how the free consultation works</Link>.
              </p>
            </div>
            <div className="card">
              <h3>Fees and coverage</h3>
              <p style={{ marginBottom: 0 }}>
                Session fees and{' '}
                <Link href="/resources/bc-extended-health-coverage-for-counselling">what BC extended health plans reimburse</Link>.
              </p>
            </div>
            <div className="card">
              <h3>If cost is the barrier</h3>
              <p style={{ marginBottom: 0 }}>
                There is substantial{' '}
                <Link href="/resources/low-cost-counselling-bc">free and low-cost support across BC</Link>{' '}
                that is worth trying first.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="section section--ghost">
        <div className="container prose">
          <p className="eyebrow">Before your first video session</p>
          <h2>What a virtual session actually needs from you</h2>
          <p>
            Less than people expect, and one thing more than they expect. The technical requirements
            are modest: a device with a camera and microphone, a connection good enough for a video
            call, and headphones, which do more for the quality of a session than any other single
            item because they keep the conversation from being audible in the next room.
          </p>
          <p>
            The requirement people underestimate is <strong>a private hour</strong>. Not silent, not
            beautiful: private. A bedroom with the door shut, a parked car, an empty office. If you
            are managing who might overhear, you are not really in the session, and it is worth solving
            that before the first appointment rather than discovering it during one.
          </p>
          <p>
            You are never required to be on camera. Turning it off is a real option rather than a
            concession. It suits camera fatigue, lower bandwidth, and anyone who thinks more
            clearly without being watched.
          </p>

          {/* The same sentence /privacy publishes, read from lib/policies.ts so
              this page cannot claim more than the policy does. 1 Oct 2026. */}
          <h3>How private is the video?</h3>
          <p>
            {rich(SESSION_SECURITY_MD)}{' '}
            The <Link href="/privacy">privacy policy</Link> sets out the rest.
          </p>

          <h2>The part that is a legal requirement, not a preference</h2>
          <p>
            A counsellor has to be registered in the jurisdiction where the client is physically
            located during a session. In practice that means sessions run when you are in British
            Columbia, so if you travel, work rotationally out of province, or study elsewhere for part
            of the year, mention it and it can be planned around rather than discovered mid-course.
            It is also why you are asked where in BC you are, which occasionally surprises people who
            expected a virtual practice not to care.
          </p>

          <h2>Where a virtual practice is the wrong answer</h2>
          <p>
            Saying this plainly matters more than filling appointments. Without private space, a
            reliable device or a stable connection, a local in-person service will serve you better,
            and the{' '}
            <Link href="/resources/bc-crisis-and-support-directory">BC crisis and support directory</Link>{' '}
            lists starting points in every health authority. This is also not a crisis service: sessions
            are scheduled and there is no 24-hour line. And where you need a diagnosis, medication or a
            formal assessment, that is a different professional entirely, {' '}
            <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
            explains those routes, and{' '}
            <Link href="/standards">standards and accountability</Link> sets out the full list of what
            this practice does not do.
          </p>
          <p>
            On whether video therapy works at all. A fair question, and one with a real research base
            behind it, {' '}
            <Link href="/guides/is-online-therapy-as-effective-as-in-person">is online therapy as effective as in person</Link>{' '}
            sets out the evidence including the places where it is weaker.
          </p>
          {/* The hub is a static page, not a [city] route, so it takes its
              extra sections under the synthetic slug 'index'. */}
          <ExtraSections area="online-counselling" slug="index" />
        </div>
      </section>

      {/* THE QUESTIONS THE PROVINCE-WIDE QUERIES ASK — 3 Oct 2026. Search
          Console shows this page for "no waitlist counsellor bc", "counselling
          bc login", "is counsellor a protected title in canada" and "immediate
          therapy session", and nothing here answered them. lib/bc-hub-faqs.ts
          holds the answers; rich() on the page, plain text in the schema. */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">Questions from across BC</p>
          <h2>Online counselling in BC: before you book</h2>
          <div style={{ marginTop: 24, maxWidth: 760 }}>
            {BC_HUB_FAQS.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{rich(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org', '@type': 'FAQPage',
              mainEntity: BC_HUB_FAQS.map((f) => ({
                '@type': 'Question', name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
              })),
            }),
          }}
        />
      </section>
      <SceneBand seed={'locations'} />

      <CtaBand
        heading="Same care, wherever you are in BC"
        text="A free 15-minute consultation over secure video. No pressure, no commitment."
      />
    </>
  );
}

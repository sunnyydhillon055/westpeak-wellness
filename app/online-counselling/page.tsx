import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  /* Its own og:url. Without an openGraph object this page inherited the
     root one from layout.tsx, whose `url` is the homepage - so a link to
     this page unfurled announcing a different URL than its own canonical
     tag. See lib/og-meta.ts. */
  openGraph: { ...ogBase('/online-counselling') },
  title: 'Areas Served Across British Columbia',
  description:
    'Virtual therapy anywhere in BC: Vancouver, Surrey, Victoria, Kelowna, Prince George and beyond. Sessions in English, Punjabi or Tagalog.',
  alternates: { canonical: `${site.domain}/online-counselling` },
};

export default function LocationsIndex() {
  const byRegion = locations.reduce<Record<string, typeof locations>>((acc, l) => {
    (acc[l.region] ||= []).push(l); return acc;
  }, {});
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
          <h1>Online counselling across British Columbia</h1>
          <p className="lede">Westpeak Wellness is fully virtual, wherever you are in BC, you can work with a Registered Clinical Counsellor from the comfort of your own space.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
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
            it is not. There is more on how virtual sessions run on the{' '}
            <Link href="/online-counselling">online counselling service page</Link>, and on
            the evidence behind them in the guide to{' '}
            <Link href="/guides/is-online-therapy-as-effective-as-in-person">whether online therapy is as effective as in-person</Link>.
          </p>

          <h2>Why only six cities have their own page</h2>
          <p>
            Most counselling websites list every city in the province. This one does not, deliberately.
            A page about &ldquo;counselling in [city]&rdquo; that is identical to forty others with the
            place name swapped is not useful to anyone reading it, and search engines treat that
            pattern as exactly what it is.
          </p>
          <p>
            So there are pages for the six places where something true and specific about accessing
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
          <p style={{ marginTop: 24, color: 'var(--ink-soft)' }}>
            Not on the list? Nothing changes: Burnaby, Nanaimo, Terrace, Fort St. John and
            everywhere else in the province are served on exactly the same terms.
          </p>
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
      <SceneBand seed={'locations'} />

      <CtaBand
        heading="Same care, wherever you are in BC"
        text="A free 15-minute consultation over secure video. No pressure, no commitment."
      />
    </>
  );
}

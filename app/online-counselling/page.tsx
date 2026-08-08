import type { Metadata } from 'next';
import Link from 'next/link';
import { locations } from '@/lib/locations';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Areas Served Across British Columbia',
  description:
    'Virtual therapy anywhere in BC — Vancouver, Surrey, Victoria, Kelowna, Prince George and beyond. Sessions in English or Punjabi.',
  alternates: { canonical: `${site.domain}/online-counselling` },
};

export default function LocationsIndex() {
  const byRegion = locations.reduce<Record<string, typeof locations>>((acc, l) => {
    (acc[l.region] ||= []).push(l); return acc;
  }, {});
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Serving all of BC</p>
          <h1>Online counselling across British Columbia</h1>
          <p className="lede">Westpeak Wellness is fully virtual — wherever you are in BC, you can work with a Registered Clinical Counsellor from the comfort of your own space.</p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/services">See counselling services</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p className="crumb"><Link href="/">Home</Link> / Areas served</p>
          <h2>Anywhere in BC means anywhere in BC</h2>
          <p>
            Because there is no office, there is no catchment. A Registered Clinical Counsellor
            registered in British Columbia can work with clients anywhere in the province by secure
            video, under the same ethical, legal, and privacy standards that apply in person. Whether
            you are in a Vancouver apartment, a farmhouse outside Chilliwack, or a work camp north of
            Prince George makes no difference to the session.
          </p>
          <p>
            The one requirement is that you are physically in British Columbia at the time of your
            appointment. Registration is provincial — travelling within BC is fine, travelling outside
            it is not. There is more on how virtual sessions run on the{' '}
            <Link href="/services/online-counselling-bc">online counselling service page</Link>, and on
            the evidence behind them in the guide to{' '}
            <Link href="/guides/is-online-therapy-as-effective-as-in-person">whether online therapy is as effective as in-person</Link>.
          </p>

          <h2>Why only six cities have their own page</h2>
          <p>
            Most counselling websites list every city in the province. This one does not, deliberately.
            A page about &ldquo;counselling in [city]&rdquo; that is identical to forty others with the
            place name swapped is not useful to anyone reading it — and search engines treat that
            pattern as exactly what it is.
          </p>
          <p>
            So there are pages for the six places where something true and specific about accessing
            care there actually changes what the page says: the scarcity of clinicians in the north,
            the cost of a ferry for weekly appointments, the concentration of Punjabi-speaking
            counsellors in the Lower Mainland. Everywhere else is served identically — there is simply
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
            Not on the list? Nothing changes — Burnaby, Kamloops, Nanaimo, Terrace, Fort St. John and
            everywhere else in the province are served on exactly the same terms.
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
                Fifteen minutes, by phone or video, at no cost — see{' '}
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

      <CtaBand
        heading="Same care, wherever you are in BC"
        text="A free 15-minute consultation by phone or video. No pressure, no commitment."
      />
    </>
  );
}

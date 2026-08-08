import type { Metadata } from 'next';
import Link from 'next/link';
import { locations } from '@/lib/locations';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Online Counselling Across British Columbia',
  description:
    'Virtual therapy anywhere in BC — from Vancouver and Surrey to Victoria, Kelowna, and Prince George. Registered Clinical Counsellor. Sessions in English or Punjabi.',
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
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="crumb"><a href="/">Home</a> / Online Counselling</p>
          {Object.entries(byRegion).map(([region, list]) => (
            <div key={region} style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 14 }}>{region}</h3>
              <div className="chip-grid">
                {list.map((l) => (
                  <Link key={l.slug} className="chip" href={`/online-counselling/${l.slug}`}>{l.city}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

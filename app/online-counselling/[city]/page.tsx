import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations, getLocation } from '@/lib/locations';
import { featuredServices } from '@/lib/services';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const l = getLocation(params.city);
  if (!l) return {};
  const title = `Online Counselling in ${l.city}, BC`;
  const description = `Virtual therapy for ${l.city} and the ${l.region} with a Registered Clinical Counsellor. EMDR, trauma, anxiety, depression, and couples counselling in English or Punjabi. Free 15-minute consultation.`;
  return {
    title, description,
    alternates: { canonical: `${site.domain}/online-counselling/${l.slug}` },
    openGraph: { title: `${title} | Westpeak Wellness`, description, url: `${site.domain}/online-counselling/${l.slug}` },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const l = getLocation(params.city);
  if (!l) notFound();

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{l.region} · Online</p>
          <h1>Online counselling in {l.city}, BC</h1>
          <p className="lede">
            Therapy for {l.city} residents with {site.counsellor.name}, {site.counsellor.credentials} —
            a Registered Clinical Counsellor offering secure video sessions in English or Punjabi.
            {' '}{l.blurb}
          </p>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free Consultation</a>
            <Link className="btn btn--ghost" href="/services">Explore Services</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <p className="crumb"><a href="/">Home</a> / <a href="/online-counselling">Online Counselling</a> / {l.city}</p>
          <h2>Therapy in {l.city}, without the commute</h2>
          <p>
            Westpeak Wellness is a fully virtual practice, so you can access experienced counselling
            from anywhere in {l.city} or the wider {l.region} — no drive, no waiting room, no time
            lost in traffic. Sessions run over a secure, confidential video platform, and follow the
            same ethical and privacy standards as in-person therapy.
          </p>
          <p>
            Whether you&rsquo;re working through anxiety, depression, trauma, grief, or challenges in
            your relationship, Aman offers care that&rsquo;s warm, direct, and culturally grounded —
            including therapy in Punjabi for the South Asian community in {l.city}.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Popular in {l.city}</p>
          <h2>Ways Aman can help</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {featuredServices.map((s) => (
              <div className="card" key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card-link">
                  <h3>{s.name.replace(' Therapy', '').replace(' Counselling', '')}</h3>
                  <p>{s.short}</p><span className="more">Learn more →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand heading={`Book therapy in ${l.city} today`} text="Start with a free 15-minute consultation by phone or video. No pressure, no commitment." />
    </>
  );
}

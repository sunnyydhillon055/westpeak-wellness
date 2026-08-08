import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return {};
  return {
    title: s.metaTitle.replace(' | Westpeak Wellness', ''),
    description: s.metaDescription,
    alternates: { canonical: `${site.domain}/services/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `${site.domain}/services/${s.slug}` },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{s.name}</p>
          <h1>{s.hero}</h1>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <a className="btn btn--primary" href={site.bookingUrl} target="_blank" rel="noopener">Book a Free Consultation</a>
            <Link className="btn btn--ghost" href="/pricing">View Fees</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="crumb"><a href="/">Home</a> / <a href="/services">Services</a> / {s.name}</p>
          <div className="split">
            <div className="prose">
              <p className="lede" style={{ marginBottom: 24 }}>{s.intro}</p>
              <h2>How Aman approaches it</h2>
              <p>{s.approach}</p>
            </div>
            <div>
              <div className="card">
                <p className="eyebrow">This can help with</p>
                <ul className="checklist" style={{ marginTop: 8 }}>
                  {s.helps.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Explore more</p>
          <h2>Other ways we can work together</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {others.map((o) => (
              <div className="card" key={o.slug}>
                <Link href={`/services/${o.slug}`} className="card-link">
                  <h3>{o.name}</h3><p>{o.short}</p><span className="more">Learn more →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

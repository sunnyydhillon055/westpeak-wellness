import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { ontarioPages } from '@/lib/expansion';
import { crisisFor } from '@/lib/crisis';
import { DESIGNATION, ONTARIO_LIVE, getProvince } from '@/lib/regions';
import { orgRef, medicalWebPage } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CrisisBlock from '@/components/CrisisBlock';
import CtaBand from '@/components/CtaBand';

/* Ontario hub. BUILT, NOT PUBLISHED — see lib/regions.ts and
 * ONTARIO_LAUNCH_CHECKLIST.md. Same three locks as the child routes. */

const TITLE = 'Online Counselling in Ontario';
const DESC =
  'Counselling by secure video across Ontario, in English or Punjabi, with a Registered Clinical Counsellor.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Westpeak` },
  description: DESC,
  alternates: { canonical: `${site.domain}/ontario` },
  robots: ONTARIO_LIVE ? undefined : { index: false, follow: false },
  openGraph: { title: `${TITLE} | ${site.name}`, description: DESC, url: `${site.domain}/ontario` },
};

export default function OntarioHub() {
  if (!ONTARIO_LIVE) notFound();

  const cfg = getProvince('ontario')!;
  const cities = ontarioPages.filter((p) => p.city);
  const province = ontarioPages.filter((p) => !p.city);

  const schema = [
    medicalWebPage({ path: '/ontario', name: TITLE, description: DESC, reviewed: '2026-08-17' }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: TITLE,
      description: DESC,
      serviceType: 'Counselling',
      areaServed: {
        '@type': 'State',
        name: 'Ontario',
        containedInPlace: { '@type': 'Country', name: 'Canada' },
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/ontario`,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: orgRef,
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Ontario</p>
          <h1>{TITLE}</h1>
          <p className="direct-answer">
            Counselling by secure video across Ontario, in English or Punjabi. Sessions are
            provided by a Registered Clinical Counsellor. The first 15 minutes are free and carry
            no obligation.
          </p>
          <p className="lede">
            Everything happens from your own home, at times shown in Eastern Time.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>
              Book a free consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <Breadcrumbs trail={[{ name: 'Ontario', path: '/ontario' }]} />

          <p className="designation-note">
            <strong>{DESIGNATION}</strong> Appointment times are shown in {cfg.tzLabel}.
          </p>

          <h2>What OHIP does not cover</h2>
          <p>
            OHIP does not cover private psychotherapy or counselling in private practice. It covers
            psychotherapy delivered by a physician and some hospital and community programmes.{' '}
            <Link href="/ontario/counselling-coverage-ontario">What Ontario plans cover</Link> sets
            out where the money actually comes from.
          </p>

          <h2>Counselling in Punjabi</h2>
          <p>
            Sessions run in Punjabi or English.{' '}
            <Link href="/ontario/punjabi-counselling">Punjabi counselling across Ontario</Link>{' '}
            covers the two quite different problems the province has — concentration in the west
            GTA, and almost nothing outside it.
          </p>

          <h2>By city</h2>
          <ul>
            {cities.map((p) => (
              <li key={p.path}>
                <Link href={`/ontario/${p.path}`}>{p.title}</Link>
              </li>
            ))}
          </ul>

          <h2>Across the province</h2>
          <ul>
            {province.map((p) => (
              <li key={p.path}>
                <Link href={`/ontario/${p.path}`}>{p.title}</Link>
              </li>
            ))}
          </ul>

          <CrisisBlock lines={crisisFor('ON')} province="Ontario" />
        </div>
      </section>

      <CtaBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

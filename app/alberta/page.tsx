import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { albertaPages } from '@/lib/expansion';
import { crisisFor } from '@/lib/crisis';
import { DESIGNATION, AB_REGULATORY_NOTE, getProvince, ALBERTA_LIVE } from '@/lib/regions';
import { orgRef, siteRef, medicalWebPage } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CrisisBlock from '@/components/CrisisBlock';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';

const TITLE = 'Online Counselling in Alberta';
const DESC =
  'Counselling by secure video anywhere in Alberta, in English or Punjabi, with a Registered Clinical Counsellor registered in British Columbia.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Westpeak` },
  description: DESC,
  alternates: { canonical: `${site.domain}/alberta` },
  robots: ALBERTA_LIVE ? undefined : { index: false, follow: false },
  openGraph: { title: `${TITLE} | ${site.name}`, description: DESC, url: `${site.domain}/alberta` },
};

export default function AlbertaHub() {
  if (!ALBERTA_LIVE) notFound();
  const cfg = getProvince('alberta')!;
  const cities = albertaPages.filter((p) => p.city);
  const province = albertaPages.filter((p) => !p.city);

  const schema = [
    medicalWebPage({ path: '/alberta', name: TITLE, description: DESC, reviewed: '2026-08-17' }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: TITLE,
      description: DESC,
      serviceType: 'Counselling',
      areaServed: {
        '@type': 'State',
        name: 'Alberta',
        containedInPlace: { '@type': 'Country', name: 'Canada' },
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/alberta`,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Alberta', item: `${site.domain}/alberta` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      isPartOf: siteRef,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is the counsellor registered in Alberta?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, and no counsellor is. Counselling therapy is not currently a regulated profession in Alberta, so there is no Alberta college that registers counsellors. Sessions are provided by a Registered Clinical Counsellor registered with the BC Association of Clinical Counsellors, and that registration is public and can be checked online.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Alberta Health Care cover counselling?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. AHCIP does not cover counselling from a Registered Clinical Counsellor in private practice. Coverage, where it exists, comes from a workplace extended health plan, a health spending account, or an employee assistance programme.',
          },
        },
        {
          '@type': 'Question',
          name: 'What time are appointments shown in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mountain Time for Alberta clients. Alberta is one hour ahead of British Columbia, so the time shown when booking is the time on your own clock.',
          },
        },
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">Alberta</p>
          <h1>{TITLE}</h1>
          <p className="direct-answer">
            Counselling by secure video is available anywhere in Alberta, in English or Punjabi.
            Sessions are provided by a Registered Clinical Counsellor registered in British
            Columbia — counselling therapy is not currently a regulated profession in Alberta, so
            no Alberta college registers counsellors. The first 15 minutes are free.
          </p>
          <p className="lede">
            Everything happens from your own home, at times shown in Mountain Time.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>
              Book a free consultation
            </Link>
            <Link className="btn btn--ghost" href="/alberta/is-my-therapist-registered">
              How to check a counsellor
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <Breadcrumbs trail={[{ name: 'Alberta', path: '/alberta' }]} />

          <p className="designation-note">
            <strong>{DESIGNATION}</strong> Appointment times are shown in {cfg.tzLabel}.
          </p>

          <Figure name="bc-reach" caption="Sessions reach anywhere in Alberta the same way." />

          <h2>The regulatory position, stated plainly</h2>
          <p>{AB_REGULATORY_NOTE}</p>
          <p>
            That is worth reading properly rather than skimming, because it changes what checking a
            counsellor means in this province.{' '}
            <Link href="/alberta/is-my-therapist-registered">
              How to check a counsellor in Alberta
            </Link>{' '}
            sets out the four-minute version, and it applies whether or not you book here.
          </p>
          <p>
            Two things this practice will never do: use the titles <strong>psychologist</strong> or{' '}
            <strong>psychological</strong>, which are protected in Alberta and which this practice
            does not hold; or imply an Alberta registration that does not exist.
          </p>

          <h2>What it costs, and who pays</h2>
          <p>
            <strong>AHCIP does not cover counselling.</strong> Most workplace extended health plans
            reimburse some of it, and whether an RCC specifically is covered varies by plan.{' '}
            <Link href="/alberta/counselling-coverage-alberta">What Alberta plans cover</Link> sets
            out the five questions worth asking your insurer before booking, and{' '}
            <Link href="/tools/therapy-cost-bc">the cost estimator</Link> does the arithmetic once
            you have the answers.
          </p>

          <h2>Counselling in Punjabi</h2>
          <p>
            Sessions run in Punjabi or English, and moving between them inside a session is normal.
            Punjabi-speaking counsellors in Alberta are concentrated in Calgary and Edmonton and
            generally carry waitlists; outside those two cities there is very little provision at
            all. <Link href="/alberta/punjabi-counselling">Punjabi counselling across Alberta</Link>{' '}
            covers that in full.
          </p>

          <h2>By city</h2>
          <ul>
            {cities.map((p) => (
              <li key={p.path}>
                <Link href={`/alberta/${p.path}`}>{p.title}</Link>
              </li>
            ))}
          </ul>

          <h2>Across the province</h2>
          <ul>
            {province.map((p) => (
              <li key={p.path}>
                <Link href={`/alberta/${p.path}`}>{p.title}</Link>
              </li>
            ))}
          </ul>

          <CrisisBlock lines={crisisFor('AB')} province="Alberta" />
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

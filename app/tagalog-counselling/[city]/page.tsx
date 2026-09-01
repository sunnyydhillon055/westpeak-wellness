import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { TAGALOG_CITIES, getTagalogCity, TAGALOG_SPEAKERS } from '@/lib/tagalog';
import { getLocation } from '@/lib/locations';
import { orgRef, siteRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Figure from '@/components/Figure';
import { ogBase } from '@/lib/og-meta';

export function generateStaticParams() {
  return TAGALOG_CITIES.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const c = getTagalogCity(params.city);
  if (!c) return {};
  /* Inside the gate's limits: 60 for a title, 158 for a description. The city
     and the language are the two words that must survive truncation, so they
     lead. */
  const title = `Tagalog Counselling in ${c.city}, BC | Westpeak Wellness`;
  const description = `Counselling in Tagalog or English for ${c.city}, by secure video with a Registered Clinical Counsellor. Free 15-minute consultation.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${site.domain}/tagalog-counselling/${c.slug}` },
    openGraph: { ...ogBase(`/tagalog-counselling/${c.slug}`), title, description },
  };
}

/* One city, one argument. These are English pages ABOUT Tagalog counselling —
 * see the header of lib/tagalog.ts for why that is the right way round. */
export default function TagalogCityPage({ params }: { params: { city: string } }) {
  const c = getTagalogCity(params.city);
  if (!c) notFound();
  const speaker = TAGALOG_SPEAKERS[0];
  const loc = getLocation(c.slug);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Tagalog-speaking counselling in ${c.city}`,
      serviceType: 'Counselling',
      provider: orgRef,
      areaServed: { '@type': 'City', name: c.city, containedInPlace: { '@type': 'State', name: 'British Columbia' } },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/tagalog-counselling/${c.slug}`,
        availableLanguage: ['Tagalog', 'English'],
      },
      ...(speaker ? { employee: { '@id': `${site.domain}/practitioners/${speaker.slug}#person` } } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Tagalog counselling', item: `${site.domain}/tagalog-counselling` },
        { '@type': 'ListItem', position: 3, name: c.city, item: `${site.domain}/tagalog-counselling/${c.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${site.domain}/tagalog-counselling/${c.slug}#page`,
      isPartOf: siteRef,
      inLanguage: 'en-CA',
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">Tagalog counselling · {c.city}</p>
          <h1>Counselling in Tagalog for {c.city}</h1>
          <p className="lede">{c.angle}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href="/tagalog-counselling">All areas</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs
            trail={[
              { name: 'Tagalog counselling', path: '/tagalog-counselling' },
              { name: c.city, path: `/tagalog-counselling/${c.slug}` },
            ]}
          />

          <div className="prose">
            {c.body.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
            <p>
              Sessions run in Tagalog, in English, or moving between the two as the conversation
              needs — which is what most bilingual people do without planning to. Nothing about
              the fee or the availability changes with the language.
            </p>
          </div>

          <Figure name="language-in-therapy" />

          {speaker && (
            <div className="prose" style={{ marginTop: 28 }}>
              <h2>Who you would be working with</h2>
              <p>
                <Link href={`/practitioners/${speaker.slug}`}>{speaker.name}</Link>,{' '}
                {speaker.postNominals} — {speaker.role}. She works with{' '}
                {speaker.focus.map((f) => f.label.toLowerCase()).join(', ')}, and her registration
                numbers are published in full on her profile so you can check them before booking
                anything.
              </p>
              <p>
                There is also a page for{' '}
                <Link href={`/practitioners/${speaker.slug}/${c.slug}`}>
                  {speaker.name.split(' ')[0]} and {c.city}
                </Link>{' '}
                specifically.
              </p>
            </div>
          )}

          {speaker?.photos?.candid && (
            <figure className="photo" style={{ margin: '26px 0 0', maxWidth: 320 }}>
              <Image
                src={speaker.photos!.candid!.src}
                alt={`${speaker.name}, ${speaker.postNominals}, a Tagalog-speaking Registered Clinical Counsellor serving ${c.city} by video`}
                width={speaker.photos!.candid!.width}
                height={speaker.photos!.candid!.height}
                sizes="(max-width: 700px) 60vw, 320px"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
              <figcaption>{speaker.name}, {speaker.postNominals}</figcaption>
            </figure>
          )}

          <div className="prose" style={{ marginTop: 32 }}>
            <h2>Questions people in {c.city} ask</h2>
            {c.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <Figure name="first-session-flow" />

          <div className="prose" style={{ marginTop: 26 }}>
            <p>
              For the wider picture of accessing counselling from {c.city} — waitlists, the health
              authority, and what exists locally —{' '}
              <Link href={`/online-counselling/${c.slug}`}>counselling in {c.city}</Link> covers
              it. {loc ? loc.blurb : ''}
            </p>
          </div>

          <div className="crisis" style={{ marginTop: 26 }}>
            <p style={{ margin: 0 }}>
              <strong>This is not a crisis service.</strong> If you need urgent support in BC,
              call or text <strong>9-8-8</strong> at any hour, or{' '}
              <strong>310-6789</strong> for the BC Mental Health Support Line. In immediate
              danger, call 911.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        heading={`Tagalog counselling for ${c.city}`}
        text="A free 15-minute consultation by video, in Tagalog or English. No card, no obligation."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

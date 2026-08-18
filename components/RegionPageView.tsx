import Link from 'next/link';
import { getProvince, DESIGNATION } from '@/lib/regions';
import type { RegionPage } from '@/lib/expansion';
import { crisisFor } from '@/lib/crisis';
import { site } from '@/lib/site';
import { Paragraphs, rich } from '@/lib/rich';
import { orgRef, siteRef, medicalWebPage } from '@/lib/schema';
import CtaBand from '@/components/CtaBand';
import Breadcrumbs from '@/components/Breadcrumbs';
import Figure from '@/components/Figure';
import CrisisBlock from '@/components/CrisisBlock';

/* One renderer for every Alberta and Ontario regional page.
 *
 * Shared so the two province routes cannot drift — in particular so the
 * designation line, the crisis block and the schema shape are identical
 * whichever province is rendering, and a change to any of them lands in both.
 *
 * NO LocalBusiness AND NO PostalAddress ANYWHERE IN THIS FILE. There is no
 * premises in Alberta or Ontario. Claiming one would be inaccurate, and it
 * would invite a local-pack listing the practice cannot legitimately hold.
 * areaServed carries the geography instead, which is what it is for.
 */
export default function RegionPageView({
  page,
  provinceSlug,
}: {
  page: RegionPage;
  provinceSlug: string;
}) {
  const cfg = getProvince(provinceSlug)!;
  const base = `${site.domain}/${provinceSlug}/${page.path}`;
  const crisis = crisisFor(page.province, page.citySlug);

  const schema = [
    medicalWebPage({
      path: `/${provinceSlug}/${page.path}`,
      name: page.title,
      description: page.directAnswer,
      reviewed: page.updated,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title,
      description: page.directAnswer,
      serviceType: 'Counselling',
      areaServed: page.city
        ? {
            '@type': 'City',
            name: page.city,
            containedInPlace: { '@type': 'State', name: cfg.name },
          }
        : { '@type': 'State', name: cfg.name },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: base,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: cfg.name, item: `${site.domain}/${cfg.slug}` },
        { '@type': 'ListItem', position: 3, name: page.title, item: base },
      ],
    },
    page.faqs.length && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      isPartOf: siteRef,
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="direct-answer">{page.directAnswer}</p>
          <p className="lede">{page.lede}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>
              Book a free consultation
            </Link>
            <Link className="btn btn--ghost" href={`/${cfg.slug}`}>
              Counselling across {cfg.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <Breadcrumbs
            trail={[
              { name: cfg.name, path: `/${cfg.slug}` },
              { name: page.title, path: `/${cfg.slug}/${page.path}` },
            ]}
          />

          {/* Visible on every out-of-province page. A reader in Calgary is
              entitled to know which regulator stands behind the person they are
              about to talk to, without hunting for it. */}
          <p className="designation-note">
            <strong>{DESIGNATION}</strong> Appointment times are shown in {cfg.tzLabel}.
          </p>

          {page.figure && <Figure name={page.figure} />}

          {page.sections.map((s) => (
            <div key={s.h2}>
              <h2>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul>
                  {s.list.map((l) => (
                    <li key={l.label}>
                      <strong>{l.label}</strong> — {rich(l.detail)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {page.punjabi && (
            <div lang="pa" className="punjabi-block">
              <h2 lang="pa">{page.punjabi.heading}</h2>
              {page.punjabi.body.map((b) => (
                <p key={b} lang="pa">
                  {b}
                </p>
              ))}
            </div>
          )}

          {page.faqs.length > 0 && (
            <>
              <h2>Common questions</h2>
              {page.faqs.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{rich(f.a)}</p>
                </div>
              ))}
            </>
          )}

          <CrisisBlock lines={crisis} province={cfg.name} />

          {page.sources && page.sources.length > 0 && (
            <>
              <h2>Sources</h2>
              <ul>
                {page.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="nofollow noopener" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2>Related</h2>
          <ul>
            {page.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>{r.label}</Link>
              </li>
            ))}
          </ul>
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

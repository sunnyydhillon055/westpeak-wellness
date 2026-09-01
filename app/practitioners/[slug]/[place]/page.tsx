import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner, type Practitioner } from '@/lib/practitioners';
import { locations, getLocation } from '@/lib/locations';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { BadgeCheck } from 'lucide-react';
import { ogBase } from '@/lib/og-meta';
import { TAGALOG, TAGALOG_READY } from '@/lib/practitioner-tl';

/* Two kinds of page share this route, because they are the same page in two
 * languages and splitting them would duplicate the schema, the breadcrumbs and
 * the booking logic three ways.
 *
 *   /practitioners/<slug>/<city>   an English page for one city
 *   /practitioners/<slug>/tl       the Tagalog version of the profile
 *
 * WHY THESE HANG OFF THE PROFILE rather than sitting at the site root: a
 * counsellor-by-city page at the root competes with the practice's own city
 * pages for the same query, and fourteen of them would read as a doorway
 * pattern. Nested under the person, they are what they actually are — the
 * detail behind one practitioner's reach.
 *
 * THE TAGALOG PAGE IS GATED. See lib/practitioner-tl.ts: it does not publish
 * until the counsellor who speaks the language has read it. */

type Params = { slug: string; place: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const p of practitioners) {
    for (const l of locations) out.push({ slug: p.slug, place: l.slug });
    for (const lang of p.languages) {
      if (lang.tag === 'en-CA') continue;
      if (lang.tag === 'tl' && !TAGALOG_READY) continue;
      out.push({ slug: p.slug, place: lang.tag });
    }
  }
  return out;
}

const isLang = (p: Practitioner, place: string) =>
  p.languages.some((l) => l.tag === place && l.tag !== 'en-CA');

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = getPractitioner(params.slug);
  if (!p) return {};

  if (isLang(p, params.place)) {
    if (params.place === 'tl' && !TAGALOG_READY) return { robots: { index: false, follow: false } };
    const t = TAGALOG;
    return {
      title: { absolute: `${t.metaTitle} | Westpeak Wellness` },
      description: t.metaDescription,
      alternates: {
        canonical: `${site.domain}/practitioners/${p.slug}/${params.place}`,
        languages: {
          'en-CA': `${site.domain}/practitioners/${p.slug}`,
          tl: `${site.domain}/practitioners/${p.slug}/tl`,
        },
      },
      openGraph: { ...ogBase(`/practitioners/${p.slug}/${params.place}`), title: t.metaTitle, description: t.metaDescription },
    };
  }

  const loc = getLocation(params.place);
  if (!loc) return {};
  /* Kept inside the limits the SEO gate enforces: 60 for a title, 158 for a
     description. The first version ran 76-79 and 174-177, which Google
     truncates — the practitioner's name is the part that must survive, so it
     leads and the boilerplate goes. */
  const first0 = p.name.split(' ')[0];
  const title = `Counselling in ${loc.city} — ${p.name}, ${p.postNominals}`;
  const description = `${p.name}, ${p.postNominals}, offers online counselling to ${loc.city} in ${p.languages.map((l) => l.name).join(' or ')}. Free 15-minute consultation.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${site.domain}/practitioners/${p.slug}/${loc.slug}` },
    openGraph: { ...ogBase(`/practitioners/${p.slug}/${loc.slug}`), title, description },
  };
}

export default function PractitionerPlacePage({ params }: { params: Params }) {
  const p = getPractitioner(params.slug);
  if (!p) notFound();

  /* ---- the language variant ------------------------------------------- */
  if (isLang(p, params.place)) {
    if (params.place === 'tl' && !TAGALOG_READY) notFound();
    const t = TAGALOG;
    const first = p.name.split(' ')[0];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}/practitioners/${p.slug}/${params.place}#page`,
      inLanguage: params.place,
      isPartOf: siteRef,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
    };

    return (
      <>
        <section className="hero" style={{ paddingBottom: 40 }}>
          <div className="container hero-split">
            <div>
              <p className="eyebrow">{t.eyebrow}</p>
              <h1 lang="tl">{t.h1}</h1>
              <p className="lede" lang="tl">{t.lede}</p>
              <div className="btn-row" style={{ marginTop: 22 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>{t.cta}</Link>
                <Link className="btn btn--ghost" href={`/practitioners/${p.slug}`}>In English</Link>
              </div>
            </div>
            {p.photo && (
              <div className="portrait">
                <Image src={p.photo.src} alt={p.photo.alt} width={p.photo.width} height={p.photo.height}
                  sizes="(max-width: 860px) 340px, 420px" quality={88} priority />
              </div>
            )}
          </div>
        </section>

        <section className="section">
          <div className="container">
            <Breadcrumbs
              trail={[
                { name: 'Our counsellors', path: '/practitioners' },
                { name: p.name, path: `/practitioners/${p.slug}` },
                { name: t.crumb, path: `/practitioners/${p.slug}/${params.place}` },
              ]}
            />
            <div className="trust-bar" style={{ marginTop: 4 }}>
              {p.credentials.map((c) => (
                <span key={c.short}>
                  <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                  {c.full} · {c.body} #{c.number}
                </span>
              ))}
            </div>
            <div className="prose" style={{ marginTop: 26 }} lang="tl">
              {t.intro.map((x) => <p key={x.slice(0, 22)}>{x}</p>)}
              <h2>{t.focusHeading}</h2>
              <ul className="checklist">{t.focus.map((x) => <li key={x.slice(0, 22)}>{x}</li>)}</ul>
              <h2>{t.suitsHeading}</h2>
              <ul className="checklist">{t.suits.map((x) => <li key={x.slice(0, 22)}>{x}</li>)}</ul>
              <blockquote className="quote">{t.closing}</blockquote>
              <p>
                <Link href={`/practitioners/${p.slug}`}>{t.englishLink}</Link>
              </p>
            </div>
          </div>
        </section>

        <CtaBand heading={t.ctaHeading} text={t.ctaText} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </>
    );
  }

  /* ---- the city variant ------------------------------------------------ */
  const loc = getLocation(params.place);
  if (!loc) notFound();
  const first = p.name.split(' ')[0];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}/practitioners/${p.slug}/${loc.slug}#page`,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
      isPartOf: siteRef,
      inLanguage: 'en-CA',
      about: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Our counsellors', item: `${site.domain}/practitioners` },
        { '@type': 'ListItem', position: 3, name: p.name, item: `${site.domain}/practitioners/${p.slug}` },
        { '@type': 'ListItem', position: 4, name: loc.city, item: `${site.domain}/practitioners/${p.slug}/${loc.slug}` },
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <p className="eyebrow">{p.name} · {loc.city}</p>
          <h1>Counselling for {loc.city}, with {first}</h1>
          <p className="lede">{loc.blurb}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
            <Link className="btn btn--ghost" href={`/practitioners/${p.slug}`}>More about {first}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs
            trail={[
              { name: 'Our counsellors', path: '/practitioners' },
              { name: p.name, path: `/practitioners/${p.slug}` },
              { name: loc.city, path: `/practitioners/${p.slug}/${loc.slug}` },
            ]}
          />

          <div className="trust-bar" style={{ marginTop: 4 }}>
            {p.credentials.map((c) => (
              <span key={c.short}>
                <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                {c.full} · {c.body} #{c.number}
              </span>
            ))}
          </div>

          <div className="prose" style={{ marginTop: 26 }}>
            <p>
              {first} works with clients in {loc.city} entirely by secure video, so nothing about
              the fee, the availability or the work changes with where you live. What changes is
              what getting to an appointment in person would have cost you — and that is the part
              this removes.
            </p>
            {loc.intro?.[0] && <p>{loc.intro[0]}</p>}
            <p>
              Her focus is {p.focus.map((f) => f.label.toLowerCase()).join(', ')}. Sessions run in{' '}
              {p.languages.map((l) => l.name).join(' or ')}, including moving between them within
              one session.
            </p>
            <p>
              For the fuller picture of accessing counselling from {loc.city} — waitlists, the
              health authority, and what is available locally — see{' '}
              <Link href={`/online-counselling/${loc.slug}`}>counselling in {loc.city}</Link>.
            </p>
          </div>

          {p.photo && (
            <figure className="photo" style={{ margin: '28px 0 0', maxWidth: 340 }}>
              <Image
                src={p.photo.src}
                alt={p.photo.alt}
                width={p.photo.width}
                height={p.photo.height}
                sizes="(max-width: 700px) 60vw, 340px"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
              <figcaption>{p.name}, {p.postNominals}</figcaption>
            </figure>
          )}

          <div className="prose" style={{ marginTop: 26 }}>
            <h2>Why a video session suits {loc.city}</h2>
            {loc.access?.length ? (
              <ul className="checklist">
                {loc.access.slice(0, 4).map((a) => (
                  <li key={a.label}><strong>{a.label}</strong> — {a.detail}</li>
                ))}
              </ul>
            ) : (
              <p>
                Nothing about the fee or the availability changes with distance, because there is
                no room to travel to.
              </p>
            )}
          </div>

          <div className="prose" style={{ marginTop: 26 }}>
            <h2>Sessions in {p.languages.map((l) => l.name).join(' or ')}</h2>
            <p>
              {first} works in {p.languages.map((l) => l.name).join(' and ')}, including moving
              between them inside one session. For a lot of people that is the difference between
              explaining a feeling and being understood the first time — and it does not require
              travelling to a bigger city to find it.
            </p>
          </div>

          <h2 style={{ marginTop: 34 }}>What {first} works with</h2>
          <div className="grid grid-3" style={{ marginTop: 18 }}>
            {p.focus.map((f) => (
              <div className="card" key={f.label}>
                <h3>{f.label}</h3>
                <p style={{ marginBottom: 0 }}>{f.detail}</p>
              </div>
            ))}
          </div>

          <div className="prose" style={{ marginTop: 30 }}>
            <blockquote className="quote">{p.sessionNote}</blockquote>
          </div>
        </div>
      </section>

      <CtaBand
        heading={`Counselling in ${loc.city}, without the drive`}
        text="A free 15-minute consultation by video. No card, and no obligation afterwards."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

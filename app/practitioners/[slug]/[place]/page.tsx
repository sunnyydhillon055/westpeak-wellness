import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner, type Practitioner } from '@/lib/practitioners';
import { practitionerPlaces, getPractitionerPlace, placesFor } from '@/lib/practitioner-places';
import { crisisFor } from '@/lib/crisis';
import Figure from '@/components/Figure';
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

/* ONLY the params generated below may serve. Without this, Next renders any
 * /practitioners/<slug>/<anything> on demand — so the founder, who is meant to
 * have one page total, had fifteen live city pages that were simply not
 * prerendered. `placePages: false` controlled the build output and nothing
 * else. A smoke assertion caught it: expected 404, got 200. */
export const dynamicParams = false;

type Params = { slug: string; place: string };

export function generateStaticParams() {
  const out: Params[] = [];
  for (const p of practitioners) {
    /* Only the places this practitioner can actually serve, and only for those
       who have per-city pages at all — see `placePages` in lib/practitioners.ts. */
    if (p.placePages) {
      for (const l of placesFor(p.provinces)) out.push({ slug: p.slug, place: l.slug });
    }
    /* ONLY Tagalog, and only when its copy is signed off.
     *
     * The language branch below renders lib/practitioner-tl.ts, which is
     * Tagalog. Generating a page for every non-English language put the founder
     * at /practitioners/aman-bains-dhillon/pa rendering TAGALOG copy under a
     * Punjabi URL — caught on the first build after she was added.
     *
     * Punjabi already has its own section at /punjabi and does not need a
     * second one here. If another language is ever added, it needs its own copy
     * file and its own entry in this list, not a fallthrough. */
    if (p.languages.some((l) => l.tag === 'tl') && TAGALOG_READY) {
      out.push({ slug: p.slug, place: 'tl' });
    }
  }
  return out;
}

/* Tagalog is the only language with a page here — see generateStaticParams. */
const isLang = (p: Practitioner, place: string) =>
  place === 'tl' && p.languages.some((l) => l.tag === 'tl');

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

  const loc = getPractitionerPlace(params.place);
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
            {p.photos?.warm && (
              <div className="portrait">
                <Image src={p.photos.warm.src} alt={p.photos.warm.alt}
                  width={p.photos.warm.width} height={p.photos.warm.height}
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
  const loc = getPractitionerPlace(params.place);
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
    /* A Service node naming the person, the place and the language. This is
       what a search engine matches "Tagalog counselling in <city>" against —
       the Person node says who, this says what and where. */
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Online counselling in ${loc.city} with ${p.name}`,
      serviceType: 'Counselling',
      provider: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
      areaServed: { '@type': 'City', name: loc.city, containedInPlace: { '@type': 'AdministrativeArea', name: loc.region } },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/practitioners/${p.slug}/${loc.slug}`,
        availableLanguage: p.languages.map((l) => l.name),
      },
    },
    ...(loc.faqs.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: loc.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }]
      : []),
  ];

  /* Province-correct crisis lines. A BC number on an Alberta page is the exact
     error scripts/expansion-verify.mjs was written to catch — it happened once,
     on all seven Alberta pages. */
  const crisis = crisisFor(loc.province, loc.slug).slice(0, 2);

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
            {loc.local.map((x) => <p key={x.slice(0, 24)}>{x}</p>)}
            <p>
              Her focus is {p.focus.map((f) => f.label.toLowerCase()).join(', ')}. Sessions run in{' '}
              {p.languages.map((l) => l.name).join(' or ')}, including moving between them within
              one session.
            </p>
            {/* Only BC cities have a practice-level page to point at.
                /online-counselling is the BC hub, so linking an Alberta city
                there sends a reader to a 404 — which the internal-link gate
                caught the moment Calgary and Edmonton went in. */}
            {loc.province === 'BC' && (
              <p>
                For the fuller picture of accessing counselling from {loc.city} — waitlists, the
                health authority, and what is available locally — see{' '}
                <Link href={`/online-counselling/${loc.slug}`}>counselling in {loc.city}</Link>.
              </p>
            )}
          </div>

          {p.photos?.candid && (
            <figure className="photo" style={{ margin: '28px 0 0', maxWidth: 340 }}>
              <Image
                src={p.photos.candid.src}
                alt={`${p.name}, ${p.postNominals} — online counselling for ${loc.city}`}
                width={p.photos.candid.width}
                height={p.photos.candid.height}
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

          {/* TWO DIAGRAMS, and both earn their place rather than decorating.
              `bc-reach` answers "can someone outside my city actually see me",
              which is the first objection on a page like this. `first-session-flow`
              answers "what happens if I book", which is the last one. */}
          <Figure name="bc-reach" />

          <div className="prose" style={{ marginTop: 30 }}>
            <blockquote className="quote">{p.sessionNote}</blockquote>
          </div>

          <Figure name="first-session-flow" />

          {loc.faqs.length > 0 && (
            <div className="prose" style={{ marginTop: 34 }}>
              <h2>Questions people in {loc.city} ask</h2>
              {loc.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {crisis.length > 0 && (
            <div className="crisis" style={{ marginTop: 30 }}>
              <p style={{ margin: 0 }}>
                <strong>This is not a crisis service.</strong> If you need urgent support in{' '}
                {loc.region === 'Alberta' ? 'Alberta' : 'BC'} right now:{' '}
                {crisis.map((c, i) => (
                  <span key={c.name}>
                    {i > 0 ? ' · ' : ''}
                    {c.name} <strong>{c.number}</strong>
                  </span>
                ))}
                . In immediate danger, call 911.
              </p>
            </div>
          )}
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

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner, withLetters, type Practitioner, type Credential } from '@/lib/practitioners';
import { practitionerPlaces, getPractitionerPlace, placesFor, resolvePlace } from '@/lib/practitioner-places';
import { crisisFor } from '@/lib/crisis';
import Figure from '@/components/Figure';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { BadgeCheck } from 'lucide-react';
import { ogBase, ogBasePunjabi } from '@/lib/og-meta';
import { TAGALOG, TAGALOG_READY } from '@/lib/practitioner-tl';
import { getPunjabiProfile } from '@/lib/practitioner-pa';
import { PA_PLACE_SHARED, PA_CITY, getPunjabiPlace } from '@/lib/practitioner-places-pa';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { TL_PLACE_SHARED } from '@/lib/practitioner-places-tl';
import { getTagalogCity } from '@/lib/tagalog';
import Updated from '@/components/Updated';
import { COLLECTION_DATES } from '@/lib/page-dates';

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
    /* Punjabi, since 7 Sep 2026, for a counsellor who has place pages AND
       her own Punjabi copy in lib/practitioner-pa.ts. The founder works in
       Punjabi and has one page by instruction; `placePages` keeps her out. */
    if (hasPunjabiPage(p)) out.push({ slug: p.slug, place: 'pa' });
  }
  return out;
}

/* Credentials in the order that makes sense where the reader is. */
const credentialsFor = (p: { credentials: Credential[] }, province: string) =>
  province === 'BC'
    ? p.credentials
    : [...p.credentials].sort((a, b) =>
        a.scope === b.scope ? 0 : a.scope === 'national' ? -1 : 1
      );

/* Two languages have a page here — see generateStaticParams. */
const hasPunjabiPage = (p: Practitioner) =>
  Boolean(p.placePages) && p.languages.some((l) => l.tag === 'pa') && Boolean(getPunjabiProfile(p.slug));
const isLang = (p: Practitioner, place: string) =>
  (place === 'tl' && p.languages.some((l) => l.tag === 'tl')) || (place === 'pa' && hasPunjabiPage(p));

export function generateMetadata({ params }: { params: Params }): Metadata {
  const p = getPractitioner(params.slug);
  if (!p) return {};

  if (params.place === 'pa' && isLang(p, 'pa')) {
    const t = getPunjabiProfile(p.slug)!;
    return {
      title: { absolute: `${t.metaTitle} | Westpeak Wellness` },
      description: t.metaDescription,
      alternates: {
        canonical: `${site.domain}/practitioners/${p.slug}/pa`,
        languages: {
          'en-CA': `${site.domain}/practitioners/${p.slug}`,
          pa: `${site.domain}/practitioners/${p.slug}/pa`,
        },
      },
      openGraph: { ...ogBasePunjabi(`/practitioners/${p.slug}/pa`), title: t.metaTitle, description: t.metaDescription },
    };
  }
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
  const title = `Counselling in ${loc.city} | ${withLetters(p)}`;
  /* The description ran 112-120 characters, where Google renders about 155 —
     roughly a third of every city page's search snippet was going unused. The
     added clause is the part a reader is actually deciding on: what the work
     covers, and that the first conversation is free. Trimmed at a word boundary
     to stay inside the 158 the SEO gate enforces, so a long city name cannot
     push it over. */
  const langs = p.languages.map((l) => l.name).join(' or ');
  const full = `${withLetters(p)}: online counselling for ${loc.city} in ${langs}. Trauma, anxiety, grief and couples work. Free 30-minute consultation.`;
  const description =
    full.length <= 158 ? full : `${full.slice(0, full.lastIndexOf(' ', 157))}…`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${site.domain}/practitioners/${p.slug}/${loc.slug}`,
      /* Paired with the Tagalog twin so the two read as one page in two
         languages rather than two thin pages about the same city. Only while
         the twin actually exists — an hreflang to a 404 is worse than none. */
      ...(TAGALOG_READY && p.languages.some((l) => l.tag === 'tl')
        ? {
            languages: {
              'en-CA': `${site.domain}/practitioners/${p.slug}/${loc.slug}`,
              tl: `${site.domain}/practitioners/${p.slug}/${loc.slug}/tl`,
            },
          }
        : {}),
      ...(hasPunjabiPage(p) && getPunjabiPlace(loc.slug)
        ? {
            languages: {
              'en-CA': `${site.domain}/practitioners/${p.slug}/${loc.slug}`,
              pa: `${site.domain}/practitioners/${p.slug}/${loc.slug}/pa`,
            },
          }
        : {}),
    },
    openGraph: { ...ogBase(`/practitioners/${p.slug}/${loc.slug}`), title, description },
    /* Set explicitly, because Next replaces the root `twitter` object only when
       a page declares one — otherwise the page inherits the site-wide card. On
       Camille's pages that card read "in English or Punjabi", which is the same
       false claim this page was corrected for, surfacing on every share. */
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function PractitionerPlacePage({ params }: { params: Params }) {
  const p = getPractitioner(params.slug);
  if (!p) notFound();

  /* ---- the Punjabi profile ---------------------------------------------- */
  if (params.place === 'pa' && isLang(p, 'pa')) return <PunjabiProfile p={p} />;

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
      /* The one page in this route that the date pass missed, because it sets
         inLanguage from a variable rather than a literal and the pattern was
         matching literals. Worth the note: a page found by measuring the built
         output, not by reading the source. */
      datePublished: COLLECTION_DATES['tagalogPlaces'],
      dateModified: COLLECTION_DATES['tagalogPlaces'],
      author: orgRef,
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
              <Updated iso={COLLECTION_DATES['practitioners']} />
              <div className="btn-row" style={{ marginTop: 22 }}>
                <Link className="btn btn--primary" href={site.bookingPath}>{t.cta}</Link>
                <Link className="btn btn--ghost" href={`/practitioners/${p.slug}`} hrefLang="en-CA">{t.englishLink}</Link>
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
                <Link href={`/practitioners/${p.slug}`} hrefLang="en-CA">{t.englishLink}</Link>
              </p>
            </div>

            {/* THE TAGALOG CITY PAGES, LISTED FROM THE TAGALOG PROFILE.
                The English profile lists all seventeen of her city pages; this
                one listed none, so each Tagalog city page had its English twin
                and a sibling chip for inbound links and nothing else. They were
                the bulk of what the SEO gate still reports as weak-inbound. */}
            {p.placePages && (
              <div className="prose" style={{ marginTop: 30 }} lang="tl">
                <h2>{TL_PLACE_SHARED.nearbyHeading}</h2>
                <ul className="place-siblings">
                  {placesFor(p.provinces).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/practitioners/${p.slug}/${c.slug}/tl`}>{c.city}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <CtaBand heading={t.ctaHeading} text={t.ctaText} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </>
    );
  }

  /* ---- the city variant ------------------------------------------------ */
  /* resolvePlace, not the raw record: the shared city copy was written for the
     founder's practice and states her languages. Rendered under a different
     counsellor it promises something untrue about her — see the note in
     lib/practitioner-places.ts. */
  const raw = getPractitionerPlace(params.place);
  if (!raw) notFound();
  const loc = resolvePlace(raw, p);
  const first = p.name.split(' ')[0];
  /* Every call to action on this page names the counsellor it came from, so
     /book can state her provinces and languages rather than the practice's.
     Without it a Calgary reader was told they were ineligible. */
  const bookHref = `${site.bookingPath}?with=${p.slug}`;

  /* NEIGHBOURING CITIES, SAME COUNSELLOR.
   *
   * These pages carried five or six internal links each and not one to a
   * sibling — Surrey did not link Delta, Calgary did not link Edmonton — so
   * seventeen pages sat as seventeen dead ends and whatever authority reached
   * one of them stopped there.
   *
   * Same province only: an Albertan has no use for Nanaimo, and pretending the
   * set is one region is how a city page stops being about a city. Ordered as
   * the roster lists them and capped at six so the row stays a row. */
  const nearby = placesFor(p.provinces)
    .filter((o) => o.slug !== loc.slug && o.province === loc.province)
    .slice(0, 6);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}/practitioners/${p.slug}/${loc.slug}#page`,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
      isPartOf: siteRef,
      inLanguage: 'en-CA',
      /* Real commit date for the module this page's copy lives in, from
         lib/page-dates.ts. Without it this page made no freshness claim at
         all, which a retrieval system reads as unknown rather than fresh. */
      datePublished: COLLECTION_DATES['practitionerPlaces'],
      dateModified: COLLECTION_DATES['practitionerPlaces'],
      author: orgRef,
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
    /* NO FAQPage NODE HERE — 6 Sep 2026. These are the city's questions
       (lib/locations.ts), and /online-counselling/<city> already publishes
       exactly the same set as FAQPage. Emitting it twice told a search engine
       two URLs held identical FAQ content, which is the duplication signal
       the city × service uniqueness gate exists to avoid elsewhere. The
       questions stay visible on this page; the city page is the canonical
       structured-data home for them. */
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
          <Updated iso={COLLECTION_DATES['practitioners']} className="hero-note" />
          <h1>Counselling for {loc.city}, with {first}</h1>
          <p className="lede">{loc.blurb}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn--primary" href={bookHref}>Book a free consultation</Link>
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

          {/* Outside BC the national certification leads. A provincial college
              means everything in its own province and nothing much beyond it,
              and an Albertan reading "BC Association of Clinical Counsellors"
              as the first fact about a counsellor is reasonably left wondering
              whether she can see them at all. Both are still shown, with
              numbers, on every page. */}
          <div className="trust-bar" style={{ marginTop: 4 }}>
            {credentialsFor(p, loc.province).map((c) => (
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
              what getting to an appointment in person would have cost you, and that is the part
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
                For the fuller picture of accessing counselling from {loc.city}: waitlists, the
                health authority, and what is available locally. See{' '}
                <Link href={`/online-counselling/${loc.slug}`}>counselling in {loc.city}</Link>.
              </p>
            )}
          </div>

          {p.photos?.candid && (
            <figure className="photo" style={{ margin: '28px 0 0', maxWidth: 340 }}>
              <Image
                src={p.photos.candid.src}
                alt={`${withLetters(p)}, online counselling for ${loc.city}`}
                width={p.photos.candid.width}
                height={p.photos.candid.height}
                sizes="(max-width: 700px) 60vw, 340px"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
              <figcaption>{withLetters(p)}</figcaption>
            </figure>
          )}

          <div className="prose" style={{ marginTop: 26 }}>
            <h2>Why a video session suits {loc.city}</h2>
            {loc.access?.length ? (
              <ul className="checklist">
                {loc.access.slice(0, 4).map((a) => (
                  <li key={a.label}><strong>{a.label}</strong>, {a.detail}</li>
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
              explaining a feeling and being understood the first time, and it does not require
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
              The reach map answers "can someone outside my city actually see
              me", which is the first objection on a page like this.
              `first-session-flow` answers "what happens if I book", which is
              the last one.

              THE MAP FOLLOWS THE PROVINCE. Calgary and Edmonton shipped with
              `bc-reach` — a map of British Columbia, captioned "Every region of
              the province", listing eight BC cities, as the central image on an
              Alberta page. */}
          <Figure name={loc.province === 'BC' ? 'bc-reach' : 'ab-reach'} />

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

          {hasPunjabiPage(p) && getPunjabiPlace(loc.slug) && (
            <div className="prose" style={{ marginTop: 30 }}>
              <p>
                <Link href={`/practitioners/${p.slug}/${loc.slug}/pa`} hrefLang="pa" lang="pa">
                  ਇਹ ਪੰਨਾ ਪੰਜਾਬੀ ਵਿੱਚ ਪੜ੍ਹੋ
                </Link>
              </p>
            </div>
          )}

          {TAGALOG_READY && p.languages.some((l) => l.tag === 'tl') && (
            <div className="prose" style={{ marginTop: 30 }}>
              <p>
                <Link href={`/practitioners/${p.slug}/${loc.slug}/tl`} hrefLang="tl" lang="tl">
                  Basahin ang pahinang ito sa Tagalog
                </Link>
                {/* The practice's own Tagalog page for this city had one inbound
                    link (the Tagalog hub). This counsellor's page for the same
                    city is the most relevant place on the site to link it from. */}
                {getTagalogCity(loc.slug) && (
                  <>
                    {' · '}
                    <Link href={`/tagalog-counselling/${loc.slug}`}>
                      Tagalog counselling in {loc.city}
                    </Link>
                  </>
                )}
              </p>
            </div>
          )}

          {nearby.length > 0 && (
            <div className="prose" style={{ marginTop: 34 }}>
              <h2>{first} also works with</h2>
              <p>
                The same practice, the same fee and the same availability, only the
                journey you are not making changes.
              </p>
              <ul className="place-siblings">
                {nearby.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/practitioners/${p.slug}/${o.slug}`}>{o.city}</Link>
                  </li>
                ))}
              </ul>
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
                ))}.
                In immediate danger, call 911.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        bookHref={bookHref}
        heading={`Counselling in ${loc.city}, without the drive`}
        text="A free 30-minute consultation by video. No card, and no obligation afterwards."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

/* The Punjabi version of a counsellor's own page — /practitioners/<slug>/pa.
   Copy from lib/practitioner-pa.ts, keyed by slug; the Tagalog branch above is
   the model. Rendered inside a lang="pa" wrapper carrying the Gurmukhi face. */
function PunjabiProfile({ p }: { p: Practitioner }) {
  const t = getPunjabiProfile(p.slug)!;
  const first = p.name.split(' ')[0];
  const paPath = `/practitioners/${p.slug}/pa`;
  const bookHref = `${site.bookingPath}?with=${p.slug}`;
  const cities = p.placePages ? placesFor(p.provinces).filter((c) => getPunjabiPlace(c.slug)) : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${site.domain}${paPath}#page`,
    inLanguage: 'pa',
    datePublished: COLLECTION_DATES['punjabiProfiles'],
    dateModified: COLLECTION_DATES['punjabiProfiles'],
    author: orgRef,
    isPartOf: siteRef,
    mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
  };

  return (
    <div lang="pa" className={gurmukhi.variable}>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 className="gurmukhi">{t.h1}</h1>
            <p className="lede">{t.lede}</p>
            <p className="direct-answer">{t.metaDescription}</p>
            <Updated iso={COLLECTION_DATES['punjabiProfiles']} lang="en-CA" />
            <div className="btn-row" style={{ marginTop: 22 }}>
              <Link className="btn btn--primary" href={bookHref}>{t.cta}</Link>
              <Link className="btn btn--ghost" href={`/practitioners/${p.slug}`} hrefLang="en-CA">{t.englishLink}</Link>
            </div>
          </div>
          {p.photos?.portrait && (
            <div className="portrait">
              <Image src={p.photos.portrait.src} alt={`${withLetters(p)}, ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਕਾਊਂਸਲਿੰਗ`}
                width={p.photos.portrait.width} height={p.photos.portrait.height}
                sizes="(max-width: 860px) 340px, 420px" quality={88} priority />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs
            trail={[
              { name: 'ਸਾਡੇ ਕਾਊਂਸਲਰ', path: '/practitioners' },
              { name: p.name, path: `/practitioners/${p.slug}` },
              { name: t.crumb, path: paPath },
            ]}
          />
          {p.credentials.length > 0 && (
            <div className="trust-bar" style={{ marginTop: 4 }} lang="en-CA">
              {p.credentials.map((c) => (
                <span key={c.short}>
                  <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                  {c.full} · {c.body} #{c.number}
                </span>
              ))}
            </div>
          )}
          <div className="prose" style={{ marginTop: 26 }}>
            {t.intro.map((x) => <p key={x.slice(0, 22)}>{x}</p>)}
            <h2>{t.focusHeading}</h2>
            <ul className="checklist">{t.focus.map((x) => <li key={x.slice(0, 22)}>{x}</li>)}</ul>
            <h2>{t.suitsHeading}</h2>
            <ul className="checklist">{t.suits.map((x) => <li key={x.slice(0, 22)}>{x}</li>)}</ul>
            <h2>{t.familyHeading}</h2>
            {t.family.map((x) => <p key={x.slice(0, 22)}>{x}</p>)}
            <blockquote className="quote">{t.closing}</blockquote>
            <p>
              <Link href={`/practitioners/${p.slug}`} hrefLang="en-CA">{t.englishLink}</Link>
            </p>
          </div>

          {p.photos?.warm && (
            <figure className="photo" style={{ marginTop: 28 }}>
              <Image src={p.photos.warm.src} alt={`${p.name}, ਵੀਡੀਓ ਸੈਸ਼ਨ ਵਿੱਚ`}
                width={p.photos.warm.width} height={p.photos.warm.height}
                sizes="(max-width: 700px) 90vw, 460px" quality={86} />
              <figcaption>{withLetters(p)}</figcaption>
            </figure>
          )}

          {cities.length > 0 && (
            <div className="prose" style={{ marginTop: 30 }}>
              <h2>{PA_PLACE_SHARED.nearbyHeading(first)}</h2>
              <p>{PA_PLACE_SHARED.nearbyNote}</p>
              <ul className="place-siblings">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/practitioners/${p.slug}/${c.slug}/pa`}>{PA_CITY[c.slug] ?? c.city}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose" style={{ marginTop: 30 }}>
            <p>
              <Link href="/punjabi">ਪੰਜਾਬੀ ਵਿੱਚ ਸਭ ਕੁਝ</Link> · <Link href="/punjabi/regions">ਖੇਤਰ ਅਨੁਸਾਰ</Link>
            </p>
          </div>
        </div>
      </section>

      <CtaBand bookHref={bookHref} heading={t.ctaHeading} text={t.ctaText} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

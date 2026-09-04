import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { practitioners, getPractitioner } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import { getService } from '@/lib/services';
import { abs, orgRef, siteRef } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import { BadgeCheck, Languages as LangIcon, MonitorSmartphone } from 'lucide-react';
import { ogBase } from '@/lib/og-meta';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { COLLECTION_DATES } from '@/lib/page-dates';

export function generateStaticParams() {
  return practitioners.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPractitioner(params.slug);
  if (!p) return {};
  const title = `${p.name}, ${p.postNominals} | Westpeak Wellness`;
  /* Under 158. The first version listed the role, the practice, the province,
     both languages and all three focus areas, and ran to 205 characters —
     Google would have cut it mid-clause. */
  const description = `${p.name}, ${p.postNominals}, online counselling across BC in ${p.languages.map((l) => l.name).join(' or ')}. ${p.focus.map((f) => f.label).join(', ')}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${site.domain}/practitioners/${p.slug}` },
    openGraph: { ...ogBase(`/practitioners/${p.slug}`), title, description, url: `${site.domain}/practitioners/${p.slug}` },
    /* Own twitter card — see the note on the city pages. */
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* A practitioner's landing page.
 *
 * THE HUB FOR EVERYTHING ABOUT THIS PERSON. The city pages and the
 * language pages hang off this route rather than sitting at the root of the
 * site, which is the difference between a profile with depth beneath it and a
 * field of near-duplicate doorway pages competing with the practice's own.
 *
 * THE BOOK BUTTON IS GATED on `bookable`. Until Cliniko has the person set up
 * with online booking, the page says so and offers the consultation instead.
 * Advertising a slot that does not exist is the failure this practice has
 * already had once, from the other direction. */
/* Where each language's own pages live. Gated on TAGALOG_READY for Tagalog,
   because those pages do not exist while the flag is off and a link to a 404
   is worse than no link. */
const LANGUAGE_HUBS: {
  tag: string;
  href: string;
  linkLabel: string;
  secondHref?: string;
  secondLabel?: string;
  heading: (first: string) => string;
  body: (first: string) => string;
}[] = [
  {
    tag: 'pa',
    href: '/punjabi',
    linkLabel: 'ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ',
    secondHref: '/punjabi-counselling',
    secondLabel: 'Punjabi counselling by region',
    heading: (first) => `Sessions in Punjabi with ${first}`,
    body: (first) =>
      `${first} works in Punjabi and English, including moving between them inside a session, which is how a great many people actually think and speak. It also removes an explaining step: what relatives will say, what is owed to a family, and what gets carried down are the starting context rather than something to be taught at the beginning of a session.`,
  },
  ...(TAGALOG_READY
    ? [{
        tag: 'tl',
        href: '/tagalog',
        linkLabel: 'Basahin ito sa Tagalog',
        secondHref: '/tagalog-counselling',
        secondLabel: 'Tagalog-speaking counselling by city',
        heading: (first: string) => `Sessions in Tagalog with ${first}`,
        body: (first: string) =>
          `${first} works in Tagalog and English, including moving between them inside one session. For a lot of people that is the difference between describing a feeling and translating one, and utang na loob, hiya and the weight of what relatives will say are context here rather than something to explain from scratch.`,
      }]
    : []),
];

export default function PractitionerPage({ params }: { params: { slug: string } }) {
  const p = getPractitioner(params.slug);
  if (!p) notFound();

  const first = p.name.split(' ')[0];
  const cities = p.placePages ? placesFor(p.provinces) : [];
  /* See the note on the city pages: the consultation is attached to this
     counsellor so /book can speak for her. */
  const bookHref = `${site.bookingPath}?with=${p.slug}`;
  /* Only languages whose page is actually published. Tagalog is written but
     gated until Camille has reviewed it (lib/practitioner-tl.ts), and linking
     to a gated route means a reader hits a 404 — which the internal-link gate
     caught on the first build. The language section disappears entirely rather
     than advertising something that is not there. */
  /* Languages with a real page behind them. Only Tagalog has one; Punjabi has
     its own section at /punjabi and is linked from the nav, not from here. A
     chip pointing at a route that does not exist is a 404 for a reader. */
  const secondLanguages = p.languages.filter((l) => l.tag === 'tl' && TAGALOG_READY);


  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${site.domain}/practitioners/${p.slug}#person`,
      name: p.name,
      jobTitle: p.role,
      url: abs(`/practitioners/${p.slug}`),
      worksFor: orgRef,
      knowsLanguage: p.languages.map((l) => l.tag),
      ...(p.photos?.portrait ? { image: `${site.domain}${p.photos.portrait.src}` } : {}),
      knowsAbout: p.focus.map((f) => f.label),
      hasCredential: p.credentials.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'professional certification',
        name: c.full,
        identifier: c.number,
        recognizedBy: { '@type': 'Organization', name: c.body },
      })),
      areaServed: { '@type': 'State', name: 'British Columbia' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}/practitioners/${p.slug}#page`,
      mainEntity: { '@id': `${site.domain}/practitioners/${p.slug}#person` },
      isPartOf: siteRef,
      inLanguage: 'en-CA',
      /* Real commit date for the module this page's copy lives in, from
         lib/page-dates.ts. Without it this page made no freshness claim at
         all, which a retrieval system reads as unknown rather than fresh. */
      datePublished: COLLECTION_DATES['practitioners'],
      dateModified: COLLECTION_DATES['practitioners'],
      author: orgRef,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Our counsellors', item: `${site.domain}/practitioners` },
        { '@type': 'ListItem', position: 3, name: p.name, item: `${site.domain}/practitioners/${p.slug}` },
      ],
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">Our counsellors</p>
            <h1>{p.name}</h1>
            <p className="lede">{p.tagline}</p>
            <p style={{ color: 'var(--ink-soft)', margin: '10px 0 0' }}>
              {p.role} · {p.postNominals}
            </p>
            <div className="btn-row" style={{ marginTop: 22 }}>
              {p.bookable ? (
                <Link className="btn btn--primary" href={bookHref}>Book with {first}</Link>
              ) : (
                <Link className="btn btn--primary" href={bookHref}>Book a free consultation</Link>
              )}
              <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
            </div>
            {!p.bookable && (
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginTop: 12 }}>
                {first} is taking new clients. Online booking directly with her is being set up.
                until then the free consultation is the way in, and it goes to the practice.
              </p>
            )}
          </div>
          {p.photos?.portrait && (
            <div className="portrait">
              <Image
                src={p.photos.portrait.src}
                alt={p.photos.portrait.alt}
                width={p.photos.portrait.width}
                height={p.photos.portrait.height}
                sizes="(max-width: 860px) 340px, 420px"
                quality={88}
                priority
              />
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
            ]}
          />

          <div className="trust-bar" style={{ marginTop: 4 }}>
            {p.credentials.map((c) => (
              <span key={c.short}>
                <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                {c.full} · {c.body} #{c.number}
                {c.verifyUrl ? (
                  <>
                    {' '}·{' '}
                    <a href={c.verifyUrl} target="_blank" rel="noopener">verify</a>
                  </>
                ) : null}
              </span>
            ))}
            <span>
              <LangIcon aria-hidden="true" strokeWidth={1.7} />
              {p.languages.map((l) => l.name).join(' and ')}
            </span>
            <span>
              <MonitorSmartphone aria-hidden="true" strokeWidth={1.7} />
              Online across British Columbia
            </span>
          </div>

          <div className="prose" style={{ marginTop: 28 }}>
            <h2>About {first}</h2>
            {p.intro.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
          </div>

          <h2 style={{ marginTop: 36 }}>What {first} works with</h2>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {p.focus.map((f) => (
              <div className="card" key={f.label}>
                <h3>{f.label}</h3>
                <p style={{ marginBottom: 0 }}>{f.detail}</p>
              </div>
            ))}
          </div>

          {/* The second photo, and the only other one on this page. It sits
              here because the list below is long and a face restarts attention
              exactly where it starts to flag — not because the page needed
              decorating. */}
          {p.photos?.warm && (
            <figure className="photo" style={{ margin: '34px 0 0', maxWidth: 380 }}>
              <Image
                src={p.photos.warm.src}
                alt={p.photos.warm.alt}
                width={p.photos.warm.width}
                height={p.photos.warm.height}
                sizes="(max-width: 700px) 70vw, 380px"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </figure>
          )}

          <div className="prose" style={{ marginTop: 36 }}>
            <h2>You may be</h2>
            <ul className="checklist">
              {p.suits.map((s) => <li key={s.slice(0, 20)}>{s}</li>)}
            </ul>
            <blockquote className="quote">{p.sessionNote}</blockquote>
          </div>
        </div>
      </section>

      {secondLanguages.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <p className="eyebrow">In your language</p>
            <h2>
              Sessions in {secondLanguages.map((l) => l.nativeName).join(' or ')}
            </h2>
            <p className="lede">
              Some things only land in the language you think in. {first} works in{' '}
              {secondLanguages.map((l) => l.name).join(' and ')} as well as English, including
              moving between them within one session.
            </p>
            <div className="chip-grid" style={{ marginTop: 18 }}>
              {secondLanguages.map((l) => (
                <Link className="chip" key={l.tag} href={`/practitioners/${p.slug}/${l.tag}`}>
                  {l.nativeName} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {cities.length > 0 && (
      <section className="section">
        <div className="container">
          <p className="eyebrow">Where {first} works</p>
          <h2>Online, anywhere in British Columbia</h2>
          <p className="lede">
            Every session is by secure video, so where you live changes nothing about
            availability or fee. These pages cover what accessing care looks like from each place.
          </p>
          <div className="chip-grid" style={{ marginTop: 18 }}>
            {cities.map((c) => (
              <Link className="chip" key={c.slug} href={`/practitioners/${p.slug}/${c.slug}`}>
                {c.city}
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* THE LANGUAGE SECTION, added 2 Sep 2026.
          The counsellor who works in Punjabi had zero links to the Punjabi
          section — seven region pages and a landing page written in the
          language, and the person who actually speaks it did not point at any
          of them. The same was true of Tagalog. A cluster nothing authoritative
          links into is a cluster search engines discount, and the practitioner
          page is the most authoritative thing that could link it.

          Rendered from the roster rather than hardcoded, so a counsellor added
          later with a third language routes correctly without an edit here. */}
      {LANGUAGE_HUBS.filter((h) => p.languages.some((l) => l.tag === h.tag)).map((hub) => (
        <section className="section" key={hub.tag}>
          <div className="container prose">
            <h2>{hub.heading(first)}</h2>
            <p>{hub.body(first)}</p>
            <p>
              <Link href={hub.href} lang={hub.tag} hrefLang={hub.tag}>{hub.linkLabel}</Link>
              {hub.secondHref && (
                <>
                  {' · '}
                  <Link href={hub.secondHref}>{hub.secondLabel}</Link>
                </>
              )}
            </p>
          </div>
        </section>
      ))}

      <section className="section section--ghost">
        <div className="container prose">
          <h2>What {first} offers</h2>
          <ul className="checklist">
            {p.services.map((s) => {
              const svc = getService(s);
              return svc ? (
                <li key={s}>
                  <Link href={`/services/${svc.slug}`}>{svc.name}</Link>, {svc.short}
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </section>

      <CtaBand
        bookHref={bookHref}
        heading={`Talk to ${first} first`}
        text="A free 15-minute consultation, by video. No card, and no obligation to book anything afterwards."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

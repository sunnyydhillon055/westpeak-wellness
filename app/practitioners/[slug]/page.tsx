import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { site, RCC_PLAIN } from '@/lib/site';
import { practitioners, getPractitioner, withLetters, vancouverToday } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import { getService } from '@/lib/services';
import { abs, orgRef, siteRef, faqSchema, sessionOffers } from '@/lib/schema';
import Breadcrumbs from '@/components/Breadcrumbs';
import Updated from '@/components/Updated';
import CtaBand from '@/components/CtaBand';
import { BadgeCheck, Languages as LangIcon, MonitorSmartphone } from 'lucide-react';
import { ogBase } from '@/lib/og-meta';
import { consultationAvailability } from '@/lib/cliniko-availability';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { getPunjabiProfile } from '@/lib/practitioner-pa';
import { COLLECTION_DATES } from '@/lib/page-dates';
import BookLink from '@/components/BookLink';
import { profileTitle, onlineInLong } from '@/lib/practitioner-titles';
import { personAreaServed } from '@/lib/practice-facts';
import { readCatalog } from '@/lib/cliniko-catalog';
import {
  feeLines, feePhrase, consultLine, reachLine, notOffered, insuranceLine, registerEntryUrl,
  longDate, offerItems, COMPLAINTS_PATH,
  personDescription, credentialLine, certifiedBy, notOfferedSentence,
  alternativesFor, alternativeLabel, notRightFit, orList, type Alternative,
} from '@/lib/practitioner-facts';
import { bookHrefFor } from '@/lib/city-service-page';
import { PACIFIC } from '@/lib/availability-summary';
import CounsellorCompare from '@/components/CounsellorCompare';
import FirstSessionRow from '@/components/FirstSessionRow';
import { firstSessionNote, firstSessionOffers } from '@/lib/first-session';
import { profileSnippet, withSnippet } from '@/lib/snippet-facts';

export function generateStaticParams() {
  return practitioners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = getPractitioner(params.slug);
  if (!p) return {};
  /* Leads with the person and the language she works in, since 1 Oct 2026:
     see lib/practitioner-titles.ts for the Search Console evidence. */
  const title = profileTitle(p);
  /* Under 158. The first version listed the role, the practice, the province,
     both languages and all three focus areas, and ran to 205 characters —
     Google would have cut it mid-clause. */
  /* Her lowest fee and the free consultation, from the catalogue, when she is
     taking new clients (lib/snippet-facts.ts) — 1 Oct 2026. The profiles sat
     at 7.7-8.1 with no clicks and no fee in the result. The focus areas give
     way first when both do not fit. */
  const description = withSnippet(
    `${withLetters(p)}, online counselling ${p.reach === 'canada' ? 'anywhere in Canada' : 'across BC'} in ${p.languages.map((l) => l.name).join(' or ')}. ${p.focus.map((f) => f.label).join(', ')}.`,
    profileSnippet(await readCatalog(), p),
  );
  /* The profile's own language twin, declared both ways — the twin already
     points back here. Found 7 Sep 2026 by scripts/roster-compare.mjs: every
     twin declared its pair and no English profile did, so a crawler saw the
     pairing from one side only, which is the same as not at all. */
  const twinTag = p.languages.find((l) => (l.tag === 'tl' && TAGALOG_READY) || (l.tag === 'pa' && Boolean(p.placePages) && Boolean(getPunjabiProfile(p.slug))))?.tag;
  return {
    title: { absolute: title },
    ...(twinTag
      ? {
          alternates: {
            canonical: `${site.domain}/practitioners/${p.slug}`,
            languages: {
              'en-CA': `${site.domain}/practitioners/${p.slug}`,
              [twinTag]: `${site.domain}/practitioners/${p.slug}/${twinTag}`,
              'x-default': `${site.domain}/practitioners/${p.slug}`,
            },
          },
        }
      : {}),
    description,
    ...(twinTag ? {} : { alternates: { canonical: `${site.domain}/practitioners/${p.slug}` } }),
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

/* Re-rendered every thirty minutes so the open-times line beside the Book
   button is what Cliniko is offering. The counsellor pages convert clicks to
   bookings better than anything else on the site, and they said nothing
   about when. */
export const revalidate = 1800;

export default async function PractitionerPage({ params }: { params: { slug: string } }) {
  const p = getPractitioner(params.slug);
  if (!p) notFound();

  const first = p.name.split(' ')[0];

  const nextOpen = p.acceptingNewClients && p.bookable ? ((await consultationAvailability())[p.slug]?.next ?? []) : [];
  const cities = p.placePages ? placesFor(p.provinces) : [];
  /* See the note on the city pages: the consultation is attached to this
     counsellor so /book can speak for her. */
  /* NOT TAKING NEW CLIENTS: the page says so and sends the consultation to
     whoever is (lib/practitioners.ts, `acceptingNewClients`). No Book button
     for a calendar that is not being opened. Decided 6 Sep 2026.

     RANKED, SINCE 2 OCT 2026 (alternativesFor, lib/practitioner-facts.ts).
     This used to name the first accepting counsellor on the roster, so a
     profile written for Punjabi readers sent all of them to a counsellor who
     does not speak Punjabi. Now the colleague who shares her language comes
     first, and the one who offers the services that colleague does not comes
     second. No reason for the status is given, by rule. */
  const alts = p.acceptingNewClients ? [] : alternativesFor(p, practitioners);
  const altHref = (a: Alternative) => bookHrefFor(practitioners.filter((q) => q.slug === a.slug), a.bookService);
  const bookHref = p.acceptingNewClients
    ? `${site.bookingPath}?with=${p.slug}`
    : alts[0] ? altHref(alts[0]) : site.bookingPath;
  /* "For couples counselling or EMDR, Camille Granda." for the band. */
  const altSecond = alts[1] ? `For ${orList(alts[1].services)}, ${alts[1].name}.` : '';
  /* Only languages whose page is actually published. Tagalog is written but
     gated until Camille has reviewed it (lib/practitioner-tl.ts), and linking
     to a gated route means a reader hits a 404 — which the internal-link gate
     caught on the first build. The language section disappears entirely rather
     than advertising something that is not there. */
  /* Languages with a real page behind them. Only Tagalog has one; Punjabi has
     its own section at /punjabi and is linked from the nav, not from here. A
     chip pointing at a route that does not exist is a 404 for a reader. */
  const secondLanguages = p.languages.filter(
    (l) => (l.tag === 'tl' && TAGALOG_READY) || (l.tag === 'pa' && Boolean(p.placePages) && Boolean(getPunjabiProfile(p.slug))),
  );


  const sameAs = (p.sameAs ?? []).filter((u) => !/psychologytoday\.com/i.test(u));

  /* THE FACT STRIP — 1 Oct 2026. Fees per service, the free consultation,
     reach, languages and what she does not offer, all computed from the
     roster and the catalogue (lib/practitioner-facts.ts). Only for someone
     taking new clients: fees beside a calendar nobody can open are noise. */
  const catalog = await readCatalog();
  const fees = p.acceptingNewClients ? feeLines(p, catalog) : [];
  const consult = p.acceptingNewClients ? consultLine(catalog) : null;
  const missing = p.acceptingNewClients ? notOffered(p, practitioners) : [];
  /* One sentence, 1 Oct 2026: "Savneet does not offer couples counselling,
     EMDR or family counselling; Camille Granda does." It read as a label and
     a comma list. */
  const notOfferedLine = notOfferedSentence(first, missing);
  /* Her own first sentence on when she is not the right counsellor, quoted
     (2 Oct 2026). Only beside fees, i.e. while she is taking new clients. */
  const fit = p.acceptingNewClients ? notRightFit(p) : null;
  /* "Already sure? Start with a first session" (lib/first-session.ts):
     nothing while site.directFirstSession is false. */
  const firstSession = p.acceptingNewClients ? firstSessionOffers(p, catalog) : [];
  /* Each credential spelled out, with where it carries weight, and who
     certifies the national one. "RCC, CCC" explained nothing (item 241). */
  const credentialText = credentialLine(p);
  const credentialExtras = [
    ...p.postNominals.split(',').map((x) => x.trim()).filter((x) => x && !p.credentials.some((c) => c.short === x)),
  ];
  const roleExtras = p.role.split(' · ').slice(1);
  const certified = certifiedBy(p);
  /* Read at render, not at build: the page revalidates every 30 minutes, so
     the line goes the day the policy stops being current. */
  const insured = insuranceLine(p, vancouverToday());

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${site.domain}/practitioners/${p.slug}#person`,
      name: p.name,
      jobTitle: p.role,
      /* From the roster, so it cannot say something the page does not. */
      description: personDescription(p),
      url: abs(`/practitioners/${p.slug}`),
      worksFor: orgRef,
      /* The bodies her credentials come from, deduplicated. Not the practice:
         BCACC registers individuals (see app/layout.tsx). */
      ...(p.credentials.length
        ? { memberOf: [...new Set(p.credentials.map((c) => c.body))].map((name) => ({ '@type': 'Organization', name })) }
        : {}),
      knowsLanguage: p.languages.map((l) => l.tag),
      /* Psychology Today never reaches sameAs, even if re-added to the roster
         by hand: the listings carry another practice's facts (1 Oct 2026, see
         the note on Camille's sameAs in lib/practitioners.ts). */
      ...(sameAs.length ? { sameAs } : {}),
      ...(p.photos?.portrait
        ? { image: { '@type': 'ImageObject', url: `${site.domain}${p.photos.portrait.src}`, width: p.photos.portrait.width, height: p.photos.portrait.height } }
        : {}),
      knowsAbout: p.focus.map((f) => f.label),
      hasCredential: p.credentials.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'professional certification',
        name: c.full,
        identifier: c.number,
        recognizedBy: { '@type': 'Organization', name: c.body },
      })),
      /* From her roster `reach` and `provinces`, not a hard-coded BC: Camille
         may see clients anywhere in Canada (owner's instruction, 8 Sep 2026). */
      areaServed: personAreaServed(p),
      /* From the same catalogue read as the fact strip, so the markup cannot
         state a fee the page does not. Omitted for anyone not taking new
         clients. */
      ...(p.acceptingNewClients ? { makesOffer: sessionOffers(offerItems(p, catalog), `/practitioners/${p.slug}`) } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${site.domain}/practitioners/${p.slug}#page`,
      url: abs(`/practitioners/${p.slug}`),
      name: withLetters(p),
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
    /* Her answers, quotable whole. Each answer is the paragraphs joined, so an
       answer engine that lifts one gets the complete thought. */
    ...(p.voice?.length
      ? [faqSchema(p.voice.map((v) => ({ q: v.q, a: v.a.join(' ') })), `/practitioners/${p.slug}`)]
      : []),
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container hero-split">
          <div>
            <p className="eyebrow">Our counsellors</p>
            <h1>{p.name}</h1>
            <p className="lede">{p.tagline}</p>
            <Updated iso={COLLECTION_DATES['practitioners']} />
            <p style={{ color: 'var(--ink-soft)', margin: '10px 0 0' }}>
              {credentialText
                ? [...credentialExtras, credentialText, ...roleExtras].join(' · ')
                : <>{p.role}{p.postNominals ? ` · ${p.postNominals}` : ''}</>}
            </p>
            {certified.length > 0 && (
              <p style={{ color: 'var(--ink-soft)', margin: '4px 0 0', fontSize: '.92rem' }}>
                {certified.join(' ')}
              </p>
            )}
            {/* Item 241, finished once RCC_PLAIN reached main (home-book-copy). */}
            {p.credentials.some((c) => c.short === 'RCC') && (
              <p style={{ color: 'var(--ink-soft)', margin: '4px 0 0', fontSize: '.92rem' }}>
                An RCC means {RCC_PLAIN}.
              </p>
            )}
            <div className="btn-row" style={{ marginTop: 22 }}>
              {!p.acceptingNewClients ? (
                alts.map((a, i) => (
                  <BookLink key={a.slug} location="hero-practitioner" className={i ? 'btn btn--ghost' : undefined} href={altHref(a)}>
                    {alternativeLabel(a)}
                  </BookLink>
                ))
              ) : p.bookable ? (
                <BookLink location="hero-practitioner" href={bookHref}>Book with {first}</BookLink>
              ) : (
                <BookLink location="hero-practitioner" href={bookHref}>Book a free consultation</BookLink>
              )}
              {p.acceptingNewClients && <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>}
            </div>
            {nextOpen.length > 0 && (
              <p style={{ fontSize: '.95rem', marginTop: 12 }}>
                <strong>Next open with {first}:</strong> {nextOpen.join(' · ')}{PACIFIC}
              </p>
            )}
            {!p.acceptingNewClients ? (
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginTop: 12 }}>
                {first} is not taking new clients at the moment.
                {alts.length > 0 ? (
                  <>
                    {alts.map((a, i) => (
                      <span key={a.slug}>
                        {i ? '; for ' : ' '}
                        {a.services.length ? <>{orList(a.services)}, </> : null}
                        <Link href={`/practitioners/${a.slug}`}>{a.name}</Link>
                        {a.services.length ? null : <>, in {orList(a.languages)}</>}
                      </span>
                    ))}
                    .
                  </>
                ) : (
                  <> <Link href="/contact">Send a message</Link> and you will be told when that
                  changes.</>
                )}
              </p>
            ) : !p.bookable && (
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginTop: 12 }}>
                {first} is taking new clients. Online booking directly with her is being set up;
                until then the free consultation is the way in, and it is arranged by reply.
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
            schema={false}
          />

          <div className="trust-bar" style={{ marginTop: 4 }}>
            {p.credentials.map((c) => (
              <span key={c.short}>
                <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                {c.full} · {c.body} #{c.number}
                {c.verifyUrl ? (
                  <>
                    {' '}·{' '}
                    <a href={registerEntryUrl(c)} target="_blank" rel="noopener">verify</a>
                    {c.registerCheckedOn ? <>, checked on the register {longDate(c.registerCheckedOn)}</> : null}
                  </>
                ) : null}
              </span>
            ))}
            {insured && (
              <span>
                <BadgeCheck aria-hidden="true" strokeWidth={1.7} />
                {insured}
              </span>
            )}
            <span>
              <LangIcon aria-hidden="true" strokeWidth={1.7} />
              {p.languages.map((l) => l.name).join(' and ')}
            </span>
            <span>
              <MonitorSmartphone aria-hidden="true" strokeWidth={1.7} />
              Online, anywhere in {onlineInLong(p)}
            </span>
          </div>

          {(fees.length > 0 || consult) && (
            <div className="prose" style={{ marginTop: 20 }}>
              <ul className="checklist" aria-label={`${first} at a glance`}>
                {consult && <li><strong>{consult}</strong>, by video, with no obligation to book afterwards</li>}
                {fees.map((f) => (
                  <li key={f.label}>
                    <strong>{f.label.charAt(0).toUpperCase() + f.label.slice(1)}</strong>, {feePhrase(f)}
                  </li>
                ))}
                <li><strong>{reachLine(p)}</strong>, in {p.languages.map((l) => l.name).join(' or ')}</li>
                {fit && (
                  <li><strong>When {first} is not the right fit</strong>, in her words: &ldquo;{fit}&rdquo;</li>
                )}
                {notOfferedLine && (
                  <li>
                    {notOfferedLine.lead}
                    {notOfferedLine.by.length > 0 ? (
                      <>
                        {'; '}
                        {notOfferedLine.by.map((b, i) => (
                          <span key={b.slug}>{i ? ' and ' : ''}<Link href={`/practitioners/${b.slug}`}>{b.name}</Link></span>
                        ))}
                        {` ${notOfferedLine.verb}.`}
                      </>
                    ) : '.'}
                  </li>
                )}
              </ul>
              <FirstSessionRow first={first} offers={firstSession} note={firstSessionNote(catalog)} />
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                Paid at booking, with a receipt for your extended health plan; whether
                your plan reimburses it depends on the plan. <Link href="/pricing">Fees and coverage</Link>.
              </p>
            </div>
          )}

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

          {/* IN HER OWN WORDS. The questions a person has before booking and
              does not ask on a consultation call: what it is like in the room,
              what happens if they cry, whether they will be pushed. Answered by
              the counsellor, first person, from a document she supplied. This
              is the part of the page that does the persuading, so it sits
              right after "you may be" and before the practical sections. */}
          {p.voice && p.voice.length > 0 && (
            <div className="prose" style={{ marginTop: 40 }}>
              <h2>In {first}&rsquo;s words</h2>
              <p className="lede">
                Questions people have before a first session, answered by {first} herself.
              </p>
              {/* The first answer ("What is it actually like to sit with
                  you for an hour?") open, 2 Oct 2026: all eleven were
                  closed, so the page's most persuasive paragraph was behind
                  a click. The roster keeps the well-being answer last. */}
              {p.voice.map((v, i) => (
                <details className="faq-item" key={v.q} open={i === 0}>
                  <summary>{v.q}</summary>
                  {v.a.map((para) => <p key={para.slice(0, 32)}>{para}</p>)}
                </details>
              ))}
            </div>
          )}
        </div>
      </section>

      {cities.length > 0 && (
      <section className="section">
        <div className="container">
          <p className="eyebrow">Where {first} works</p>
          <h2>Online, anywhere in {onlineInLong(p)}</h2>
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
              {/* Her own page in the language, folded in here on 2 Oct 2026:
                  it had a section of its own ("Sessions in ਪੰਜਾਬੀ") directly
                  above this one, so each language appeared twice. */}
              {secondLanguages.filter((l) => l.tag === hub.tag).map((l) => (
                <span key={l.tag}>
                  {' · '}
                  <Link href={`/practitioners/${p.slug}/${l.tag}`} lang={l.tag} hrefLang={l.tag}>{l.nativeName} →</Link>
                </span>
              ))}
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
          {/* Side by side with her colleagues, closed (2 Oct 2026). */}
          {p.acceptingNewClients && (
            <CounsellorCompare roster={practitioners} catalog={catalog} location="counsellor-compare" collapsed />
          )}
          {/* The complaints route, per counsellor. /standards says where a
              complaint goes and that the practice is not the gatekeeper;
              this says it about her, by name. 1 Oct 2026. */}
          <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)' }}>
            If something goes wrong with {first}, you can raise it with BCACC directly,
            without going through the practice: <Link href={COMPLAINTS_PATH}>how complaints work</Link>.
          </p>
        </div>
      </section>

      <CtaBand
        bookHref={bookHref}
        heading={p.acceptingNewClients ? `Talk to ${first} first` : alts[0] ? alternativeLabel(alts[0]) : 'Therapy starts with one conversation.'}
        text={
          p.acceptingNewClients
            ? 'A free 30-minute consultation, by video. No card, and no obligation to book anything afterwards.'
            : `${first} is not taking new clients at the moment. ${alts[0] ? `${alts[0].name} is: a free 30-minute consultation by video, no card, and no obligation to book anything afterwards.${altSecond ? ` ${altSecond}` : ''}` : 'Send a message and you will be told when that changes.'}`
        }
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

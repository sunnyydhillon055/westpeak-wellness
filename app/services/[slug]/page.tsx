import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import { pairsForService } from '@/lib/city-services';
import { getLocation } from '@/lib/locations';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef, medicalWebPage, priceOffer } from '@/lib/schema';
import { therapyNode, placeNode } from '@/lib/entities';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import BookingCard from '@/components/BookingCard';
import SceneBand from '@/components/SceneBand';
import { getServiceIcon } from '@/lib/icon-map';
import { Clock, MonitorSmartphone, Languages as LangIcon, BadgeCheck, CircleDot, Wallet } from 'lucide-react';
import ExtraSections from '@/components/ExtraSections';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import Figure from '@/components/Figure';
import InlineRelated from '@/components/InlineRelated';
import { deviceSlots } from '@/lib/placement';
import Breadcrumbs from '@/components/Breadcrumbs';
import Updated from '@/components/Updated';
import { readCatalog, money, FALLBACK_CATALOG, type Catalog } from '@/lib/cliniko-catalog';
import { ogBase } from '@/lib/og-meta';
import { COLLECTION_DATES } from '@/lib/page-dates';
import BookLink from '@/components/BookLink';
import { bookingCtaFor, serviceNoun } from '@/lib/booking-cta';
import CounsellorCards from '@/components/CounsellorCards';
import { cardNoun, counsellorsForService } from '@/lib/counsellor-cards';
import { languagesFor } from '@/lib/city-service-page';
import { snippetFacts, withSnippet } from '@/lib/snippet-facts';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

/* The FAQPage text is plain: an answer that links inside the page (rendered
   through rich()) carries its markdown, which schema must not. */
const plain = (md: string) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');

/* The fee and who you would see, after the page's own lead — 1 Oct 2026.
   Individual therapy sat at 5.36 with 25 impressions and no clicks, and no
   service description said what a session costs or who it is with. The fee
   is this page's billed type, read from the catalogue; the names are the
   page's own counsellor cards. "From" where the page carries a second fee
   for the same length of session (Tagalog: individual and couples). */
async function snippetFor(slug: string, names: string[]): Promise<string | undefined> {
  const catalog = await readCatalog();
  const item = billedItem(catalog, BILLED_AS[slug]) ?? billedItem(FALLBACK_CATALOG, BILLED_AS[slug]);
  if (!item || item.cents <= 0) return undefined;
  const also = billedItem(catalog, EXTENDED_AS[slug]) ?? billedItem(FALLBACK_CATALOG, EXTENDED_AS[slug]);
  const from = !!also && also.minutes === item.minutes && also.cents !== item.cents;
  return snippetFacts({ fee: { fee: money(item.cents), minutes: item.minutes, cents: item.cents }, from, names });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const s = getService(params.slug);
  if (!s) return {};
  const description = withSnippet(
    s.metaDescription,
    await snippetFor(s.slug, counsellorsForService(s).map((p) => p.name)),
  );
  return {
    title: { absolute: s.metaTitle },
    description,
    alternates: {
      canonical: `${site.domain}/services/${s.slug}`,
      /* hreflang has to be reciprocal or search engines ignore it, so the
       * English page points back at the Punjabi one and vice versa. Only this
       * pair has a translation, so no other service declares alternates. */
      ...(s.slug === 'punjabi-counselling'
        ? {
            languages: {
              'en-CA': `${site.domain}/services/punjabi-counselling`,
              'x-default': `${site.domain}/services/punjabi-counselling`,
              pa: `${site.domain}/punjabi`,
            },
          }
        : {}),
    },
    openGraph: { ...ogBase(`/services/${s.slug}`), title: s.metaTitle, description, url: `${site.domain}/services/${s.slug}` },
  };
}

/* One fee per service, and only where a single number is honest.
 *
 * The umbrella pages — online-counselling-bc and south-asian-mental-health —
 * span several session types at different prices, so quoting one figure there
 * would misrepresent them. Those render the card without a price rather than
 * with a wrong one. Couples also shows its 110-minute extended format, read
 * from the catalogue (EXTENDED_AS below); /pricing carries the full table. */
/* Which Cliniko appointment type each service is billed as. The fee itself is
 * NOT written here any more — it comes from Cliniko via lib/cliniko-catalog.ts,
 * because three hand-maintained copies of a price is three chances to quote a
 * number the practice does not charge.
 *
 * The two umbrella pages are absent on purpose: they span several session types
 * at different prices, so any single figure would misrepresent them. They render
 * without a price rather than with a wrong one. */
const BILLED_AS: Record<string, string | undefined> = {
  'individual-therapy': 'Individual Counselling',
  'anxiety-counselling': 'Individual Counselling',
  'depression-counselling': 'Individual Counselling',
  'trauma-therapy': 'Individual Counselling',
  'punjabi-counselling': 'Individual Counselling',
  /* Added 1 Oct 2026: the Tagalog page's fact strip had no fee at all.
     Individual is the type its sessions bill as by default; couples, which
     Camille also runs in Tagalog, is shown beside it (EXTENDED_AS). */
  'tagalog-counselling': 'Individual Counselling',
  'couples-therapy': 'Couples Counselling',
  'emdr-therapy': 'EMDR Intensive',
  'emdr-intensive': 'EMDR Intensive',
};

/* The legacy map of typed fees is gone — 1 Oct 2026. It was the fallback
 * when the live catalogue did not resolve, and its couples figure was five
 * dollars behind Cliniko, so the one moment it was used it quoted a price the
 * practice does not charge. The fallback is now FALLBACK_CATALOG, the same
 * values scripts/price-drift.mjs checks against Cliniko. */
const billedItem = (c: Catalog, name: string | undefined) =>
  name ? c.items.find((i) => i.name.toLowerCase() === name.toLowerCase()) : undefined;

/* Couples has a second format the single-fee line hid: a 110-minute
 * extended session. Shown beside the 50-minute fee on the couples page,
 * read from the catalogue like the main fee. */
const EXTENDED_AS: Record<string, string | undefined> = {
  'couples-therapy': 'Couples Extended',
  'tagalog-counselling': 'Couples Counselling',
};
/* The second fee on the couples page is the same service at a longer length,
   so it needs no label. On the Tagalog page it is a different service at the
   same length, so each fee says which it is. */
const SECOND_LABEL: Record<string, [string, string] | undefined> = {
  'tagalog-counselling': ['individual', 'couples'],
};

const DURATION_FOR: Record<string, string | undefined> = {
  'emdr-therapy': '90 minutes',
  'emdr-intensive': '90 minutes',
};

/* ISR rather than fully dynamic. These nine pages are the fastest on the site
 * and should stay statically served; an hourly re-render picks up a Cliniko
 * price change without giving that up. */
export const revalidate = 3600;

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const s = getService(params.slug);
  if (!s) notFound();
  /* The calendar the consultation opens: the language counsellor on the two
     language pages, the one counsellor who offers it on couples, EMDR and
     family, and the practice-wide /book where both do (1 Oct 2026). */
  const cta = bookingCtaFor({
    language: s.language,
    service: s.slug,
    fallback: `Book a free consultation for ${serviceNoun(s.name)}`,
  });

  const catalog = await readCatalog();
  const billedAs = BILLED_AS[params.slug];
  const item = billedItem(catalog, billedAs) ?? billedItem(FALLBACK_CATALOG, billedAs);
  const fee = item ? money(item.cents) : undefined;
  const extended =
    billedItem(catalog, EXTENDED_AS[params.slug]) ?? billedItem(FALLBACK_CATALOG, EXTENDED_AS[params.slug]);
  /* The same number the card shows, as a machine-readable Offer. Cliniko is
     the source when the catalogue resolves; the legacy map is the fallback,
     parsed rather than restated so there is still only one figure per
     service in this file. Undefined on the two umbrella pages, which is why
     the Offer is conditional rather than defaulted — a default here would
     publish a price the practice does not charge. */
  const feeDollars = item ? item.cents / 100 : undefined;
  const labels = SECOND_LABEL[params.slug];
  /* Who would take the work: the cards below, the schema's languages and
     the description's names all read this one list. */
  const offering = counsellorsForService(s);

  /* Heading order as rendered. 'This can help with' lives in the aside
   * itself, so it is deliberately not a TOC entry. */
  const toc = buildToc([
    'How we approach it',
    ...(s.whatItIs ? [s.whatItIs.h2] : []),
    /* Conditional, like every other optional section. It was unconditional,
       while the section it points at renders only when `signs` exists — so any
       service without `signs` published a table of contents linking to an
       anchor that was not on the page. It never showed because every service
       written before 31 Aug 2026 happened to have signs; family-counselling
       did not, and the internal-link gate caught it on the first build. */
    ...(s.signs?.length ? ['What people tend to arrive with'] : []),
    ...(s.sessionShape ? [s.sessionShape.h2] : []),
    ...getExtra('services', s.slug).map((x) => x.h2),
    'Before you book',
    'Go deeper',
  ]);
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 3);

  /* This page is composed of distinct blocks rather than one section list, so
     it already breaks up well — except through the depth sections, which ran as
     a plain column of about 2,000px. These give that stretch something. */
  const midDevices = [
    s.related?.[0] ? (
      <InlineRelated key="rel" href={s.related[0].href} label={s.related[0].label} />
    ) : null,
    s.figure2 ? <Figure key="fig2" name={s.figure2} /> : null,
  ].filter(Boolean);
  const slots = deviceSlots(getExtra('services', s.slug), midDevices.length);

  const schema = [
    medicalWebPage({
      path: `/services/${s.slug}`,
      name: s.name,
      description: s.directAnswer ?? s.metaDescription,
      /* Real commit date for lib/services.ts, which is where this page's copy
         lives. Without it the page made no freshness claim at all, which a
         retrieval system reads as unknown rather than current. */
      updated: COLLECTION_DATES['services'],
    }),
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: s.name, description: s.directAnswer ?? s.metaDescription,
      serviceType: s.name,
      areaServed: { '@type': 'State', name: 'British Columbia' },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/services/${s.slug}`,
        /* Per service, not a constant — 26 Sep 2026. This said English and
           Punjabi on every service, including the Tagalog one, and omitted
           Tagalog from the four services that offer it. Since 1 Oct 2026 it
           is the languages of the counsellors who offer the service, so
           couples, EMDR and family stopped offering Punjabi. */
        availableLanguage: languagesFor(offering),
      },
      provider: orgRef,
      /* The method this service IS, named as an entity rather than only as a
         service name, so "EMDR Therapy" here resolves to the same thing an
         engine already holds. Added 24 Sep 2026; see lib/entities.ts. */
      about: therapyNode(s.slug, s.name),
      /* BOOKABLE, AS AN ACTION — 24 Sep 2026.
         The organisation node has carried a ReserveAction since August, so an
         engine knows the practice can be booked. It did not know that THIS
         service can be, or where. An assistant asked "can I book EMDR with
         them" had to infer it from a button it cannot see. */
      potentialAction: {
        '@type': 'ReserveAction',
        name: `Book a free 30-minute consultation about ${s.name.toLowerCase()}`,
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${site.domain}${cta.href}`,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
        result: { '@type': 'Reservation', name: 'Free 30-minute consultation' },
      },
      /* Who it is for. `MedicalAudience` is the type that says "this is health
         information addressed to the person receiving care", which is exactly
         what separates these pages from a clinician-facing description of the
         same therapy. */
      audience: { '@type': 'MedicalAudience', audienceType: 'Patient', geographicArea: placeNode('British Columbia') },
      ...(feeDollars ? { offers: priceOffer(feeDollars, `/services/${s.slug}`) } : {}),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.domain}/services` },
        { '@type': 'ListItem', position: 3, name: s.name, item: `${site.domain}/services/${s.slug}` },
      ],
    },
    s.faqs?.length && {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: s.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
      })),
    },
  ].filter(Boolean);

  return (
    <div className={s.slug === 'punjabi-counselling' ? gurmukhi.variable : undefined}>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container svc-hero">
          <p className="eyebrow">{s.name}</p>
          {/* THE SERVICE NAME IN THE HEADING — 27 Sep 2026. The six money
              pages carried a tagline as their H1 ("Process painful memories
              so they stop running the show") and the service name only in a
              small eyebrow above it. A heading is the strongest on-page
              signal after the title, and none of these said what the page
              sells. The tagline stays; the name leads it. */}
          <h1>{s.name}: {s.hero}</h1>
          {s.directAnswer && (
            <p className="direct-answer">{s.directAnswer}</p>
          )}
          <ul className="glance">
            <li><Clock aria-hidden="true" strokeWidth={1.7} /><span><strong>{DURATION_FOR[s.slug] ?? '50 minutes'}</strong> per session</span></li>
            <li><MonitorSmartphone aria-hidden="true" strokeWidth={1.7} /><span><strong>Secure video</strong> sessions</span></li>
            <li><LangIcon aria-hidden="true" strokeWidth={1.7} /><span><strong>Free</strong> 30-min consult</span></li>
            {/* The fee, at the top, on the page where the question is asked.
                It lived on /pricing — three clicks away — and price silence
                reads as expensive. The number already reaches the page for the
                mid-page booking card and for the Offer in structured data;
                this is the same figure, where a human meets it first.
                Undefined on the two umbrella services, which span session
                types at different prices, so the item simply does not render
                rather than showing a figure that would misrepresent them. */}
            {fee && item && extended ? (
              <li><Wallet aria-hidden="true" strokeWidth={1.7} /><span><strong>{fee}</strong> / {item.minutes} min{labels ? ` ${labels[0]}` : ''} · <strong>{money(extended.cents)}</strong> / {extended.minutes} min{labels ? ` ${labels[1]}` : ''}</span></li>
            ) : fee ? (
              <li><Wallet aria-hidden="true" strokeWidth={1.7} /><span><strong>{fee}</strong> per session</span></li>
            ) : null}
            {/* The badge links to what the letters mean. "Registered clinical
                counsellor" is the query this site is shown for most often
                (about 1,000 impressions a month at position 25-37, Sep 2026),
                and the page that answers it had 24 inbound links. Every
                service page now sends one, with the term as the anchor. */}
            <li><BadgeCheck aria-hidden="true" strokeWidth={1.7} /><span><strong><Link href="/resources/verify-a-counsellor-in-bc">RCC</Link></strong> · BCACC registered</span></li>
          </ul>
          {/* THE ONE ACTION, NAMED FOR THE PAGE AND COUNTED — 1 Oct 2026. A
              plain <Link> with the same four words on all six money pages,
              invisible to book_click. Now it names the service, and on the
              two language pages it names the language and opens that
              counsellor's calendar rather than the practice-wide one, which
              lists a counsellor who does not speak it. lib/booking-cta.ts. */}
          <div className="btn-row" style={{ marginTop: 24 }}>
            <BookLink location="hero-service" href={cta.href}>{cta.label}</BookLink>
            <Link className="btn btn--ghost" href="/pricing">Fees and coverage</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Services', path: '/services' },
              { name: s.name, path: `/services/${s.slug}` },
            ]}
          />
          {/* The "this can help with" panel is reparented into a two-column
              grid with the long body copy so it has something to stick
              alongside. A sticky aside beside a three-paragraph section would
              never actually stick. Copy is unchanged — only its parent. */}
          <div className="svc-layout">
            <div className="prose">
              {/* Through rich(): the two language pages link their translated
                  page from here, and the bare string printed the markdown. */}
              <p className="lede" style={{ marginBottom: 24 }}>{rich(s.intro)}</p>
              <Updated iso={COLLECTION_DATES['services']} />
              <h2 id="how-we-approach-it">How we approach it</h2>
              <p>{s.approach}</p>
              {s.whatItIs && (
                <>
                  <h2 id={headingId(s.whatItIs.h2)}>{s.whatItIs.h2}</h2>
                  <Paragraphs items={s.whatItIs.body} />
                </>
              )}
            </div>
            <aside className="svc-aside">
              <div className="svc-aside-card">
                <h2>This can help with</h2>
                <ul>
                  {s.helps.map((h) => <li key={h}>{h}</li>)}
                </ul>
                {/* Same action as the hero, counted under its own location so
                    the sticky aside and the hero can be told apart. */}
                <BookLink location="aside-service" href={cta.href}>
                  {cta.label}
                </BookLink>
              </div>
              <Toc items={toc} />
            </aside>
          </div>
        </div>
      </section>

      {/* WHO YOU WOULD SEE — 1 Oct 2026. Named on the page, as on eight of
          the thirteen pages ranking for the same queries. Chosen from the
          roster in lib/counsellor-cards.ts; drawn by the shared card. */}
      <CounsellorCards
        counsellors={offering}
        location="counsellor-service"
        heading={<>Who you would see for {cardNoun(s.name)}</>}
        intro="Taking new clients and seeing people across BC by secure video. Each is a Registered Clinical Counsellor; the registration is on the profile and can be checked on the BCACC register."
      />

      {s.signs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Might be a fit if</p>
            <h2 id="what-people-tend-to-arrive-with">What people tend to arrive with</h2>
            <div className="grid grid-2" style={{ marginTop: 26 }}>
              {s.signs.map((x) => (
                <div className="card cred-card sign-card" key={x.label}>
                  <span className="icon-chip icon-chip--sm icon-chip--warm" aria-hidden="true">
                    <CircleDot strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3>{x.label}</h3>
                    <p style={{ marginBottom: 0 }}>{rich(x.detail)}</p>
                  </div>
                </div>
              ))}
            </div>
            {s.figure && <Figure name={s.figure} />}
            <div className="crisis" style={{ marginTop: 32 }}>
              <p style={{ margin: 0 }}>
                Recognise several of these? A{' '}
                <Link href={cta.href}>free 30-minute consultation</Link> is the least
                committal way to find out whether this is the right approach, including if the
                answer turns out to be something else.
              </p>
            </div>
          </div>
        </section>
      )}

      {s.sessionShape && (
        <section className="section section--ghost">
          <div className="container prose" style={{ maxWidth: '44.16em' }}>
            <h2 id={headingId(s.sessionShape.h2)}>{s.sessionShape.h2}</h2>
            <Paragraphs items={s.sessionShape.body} />
          </div>
        </section>
      )}

      {/* Mid-page booking card. Sits after "what a session involves" and before
          the FAQ, because that is the point a reader has enough information to
          decide — and without it the next CTA is at the very bottom of a
          1,600-word page. */}
      <section className="section">
        <div className="container prose" style={{ maxWidth: '44.16em' }}>
          <BookingCard
            service={s.name}
            price={fee}
            duration={
              (DURATION_FOR[s.slug] ?? '50 minutes') +
              (extended ? `, or ${money(extended.cents)} for ${extended.minutes} minutes${labels ? ` (${labels[1]})` : ''}` : '')
            }
            bookHref={cta.href}
          />
        </div>
      </section>

      {s.faqs && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">Questions</p>
            {/* Folded on service pages. A service page is where someone is
                deciding whether to book, and these sections were 483 words
                between them and the button on /services/individual-therapy.
                Still in the HTML, still indexed — just not in the way. */}
            <ExtraSections
              area="services"
              slug={s.slug}
              devices={midDevices}
              slots={slots}
              collapsible
              summary="More on how this work runs"
            />

            {/* DEVICES WITH NOWHERE TO GO STILL HAVE TO GO SOMEWHERE.
                deviceSlots() interleaves these between the depth sections and
                returns [] when a service has none — so on any page without
                depth content the devices were computed, passed in, and
                silently dropped. /services/emdr-therapy was the one page in
                that state: it declares figure2: "session-requirements" in
                lib/services.ts, the template reads it, and the diagram had
                never rendered. Nine other services declare a figure2 and show
                it, which is exactly why the gap was invisible.
                Placed here when there was nothing to interleave with. */}
            {slots.length === 0 && midDevices.length > 0 && (
              <div style={{ marginBottom: 32 }}>{midDevices}</div>
            )}

            <h2 id="before-you-book">Before you book</h2>
            <div style={{ marginTop: 24, maxWidth: 760 }}>
              {s.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{rich(f.a)}</p>
                </details>
              ))}
            </div>
            <p style={{ marginTop: 24 }}>
              More in the <Link href="/faq">full FAQ</Link>, or see{' '}
              <Link href="/pricing">fees and extended health coverage</Link>.
            </p>
          </div>
        </section>
      )}

      {s.related && (
        <section className="section section--tint">
          <div className="container">
            <p className="eyebrow">Related reading</p>
            <SceneBand seed={s.slug} />

            <h2 id="go-deeper">Go deeper</h2>
            <div className="chip-grid" style={{ marginTop: 20 }}>
              {s.related.map((r) => <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>)}
            </div>
            {s.sources && (
              <>
                <p className="eyebrow" style={{ marginTop: 36 }}>Sources</p>
                <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20, margin: 0 }}>
                  {s.sources.map((x) => (
                    <li key={x.url} style={{ marginBottom: 8 }}>
                      <a href={x.url} target="_blank" rel="noopener">{x.label}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      )}

      <section className={s.related ? 'section' : 'section section--tint'}>
        <div className="container">
          <p className="eyebrow">Explore more</p>
          <h2>Other ways we can work together</h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {others.map((o) => (
              <div className="card" key={o.slug}>
                <Link href={`/services/${o.slug}`} className="card-link">
                  <h3>{o.name}</h3><p>{o.short}</p>
                  <span className="more">{o.name} in BC →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* THE CITY PAGES FOR THIS SERVICE.
          Written, indexed, and linked to by nothing except each other — 32 of
          them sat at 1-2 in-body inbound links in the SEO gate. The service
          they belong to is the other natural place to link from, and it is the
          page with the authority to pass. */}
      {pairsForService(s.slug).length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">{s.name} by area</p>
            <div className="chip-grid">
              {pairsForService(s.slug).map((pr) => (
                <Link className="chip" key={pr.city} href={`/online-counselling/${pr.city}/${s.slug}`}>
                  {getLocation(pr.city)?.city ?? pr.city}
                </Link>
              ))}
              <Link className="chip" href="/online-counselling">All areas served</Link>
            </div>
          </div>
        </section>
      )}

      <MoreFrom items={services} currentSlug={s.slug} base="/services" heading="Other counselling services" eyebrow="Keep going" />
      {/* The Punjabi service page closes in Punjabi. The Gurmukhi heading is
          reused VERBATIM from /punjabi (already reviewed) — the fluent-review
          rule permits reuse, not fresh composition. */}
      {/* The band books with the same counsellor the hero does, so a page
          does not offer two different calendars for one consultation. The
          five English services carried the site-wide default heading; it now
          names the service, as the city band names its city. */}
      {params.slug === 'punjabi-counselling' ? (
        <CtaBand
          heading="ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ"
          headingLang="pa"
          headingClassName={gurmukhi.className}
          text="Book a free 30-minute consultation: in Punjabi, English, or both. No pressure, and no obligation afterward."
          bookHref={cta.href}
        />
      ) : (
        <CtaBand heading={`${s.name}, starting with a conversation.`} bookHref={cta.href} />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

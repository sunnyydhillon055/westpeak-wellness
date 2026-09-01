import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '@/lib/services';
import { site } from '@/lib/site';
import { gurmukhi } from '@/app/fonts-gurmukhi';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef, medicalWebPage, priceOffer } from '@/lib/schema';
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
import { readCatalog, money } from '@/lib/cliniko-catalog';
import { ogBase } from '@/lib/og-meta';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getService(params.slug);
  if (!s) return {};
  return {
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    alternates: {
      canonical: `${site.domain}/services/${s.slug}`,
      /* hreflang has to be reciprocal or search engines ignore it, so the
       * English page points back at the Punjabi one and vice versa. Only this
       * pair has a translation, so no other service declares alternates. */
      ...(s.slug === 'punjabi-counselling'
        ? {
            languages: {
              'en-CA': `${site.domain}/services/punjabi-counselling`,
              pa: `${site.domain}/punjabi`,
            },
          }
        : {}),
    },
    openGraph: { ...ogBase(`/services/${s.slug}`), title: s.metaTitle, description: s.metaDescription, url: `${site.domain}/services/${s.slug}` },
  };
}

/* One fee per service, and only where a single number is honest.
 *
 * The umbrella pages — online-counselling-bc and south-asian-mental-health —
 * span several session types at different prices, so quoting one figure there
 * would misrepresent them. Those render the card without a price rather than
 * with a wrong one. Couples has a 110-minute extended option at $340 that the
 * card does not attempt to summarise; /pricing carries the full table. */
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
  'couples-therapy': 'Couples Counselling',
  'emdr-therapy': 'EMDR Intensive',
  'emdr-intensive': 'EMDR Intensive',
};

const LEGACY_FEE_FOR: Record<string, string | undefined> = {
  'individual-therapy': '$140',
  'anxiety-counselling': '$140',
  'depression-counselling': '$140',
  'trauma-therapy': '$140',
  'punjabi-counselling': '$140',
  'couples-therapy': '$170',
  'emdr-therapy': '$190',
  'emdr-intensive': '$190',
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

  const catalog = await readCatalog();
  const billedAs = BILLED_AS[params.slug];
  const item = billedAs
    ? catalog.items.find((i) => i.name.toLowerCase() === billedAs.toLowerCase())
    : undefined;
  const fee = item ? money(item.cents) : LEGACY_FEE_FOR[params.slug];
  /* The same number the card shows, as a machine-readable Offer. Cliniko is
     the source when the catalogue resolves; the legacy map is the fallback,
     parsed rather than restated so there is still only one figure per
     service in this file. Undefined on the two umbrella pages, which is why
     the Offer is conditional rather than defaulted — a default here would
     publish a price the practice does not charge. */
  const feeDollars = item
    ? item.cents / 100
    : Number(String(LEGACY_FEE_FOR[params.slug] ?? '').replace(/[^0-9.]/g, '')) || undefined;

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
    }),
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: s.name, description: s.directAnswer ?? s.metaDescription,
      serviceType: s.name,
      areaServed: { '@type': 'State', name: 'British Columbia' },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${site.domain}/services/${s.slug}`,
        availableLanguage: ['English', 'Punjabi'],
      },
      provider: orgRef,
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
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ].filter(Boolean);

  return (
    <div className={s.slug === 'punjabi-counselling' ? gurmukhi.variable : undefined}>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">{s.name}</p>
          <h1>{s.hero}</h1>
          {s.directAnswer && (
            <p className="direct-answer">{s.directAnswer}</p>
          )}
          <ul className="glance">
            <li><Clock aria-hidden="true" strokeWidth={1.7} /><span><strong>50 minutes</strong> per session</span></li>
            <li><MonitorSmartphone aria-hidden="true" strokeWidth={1.7} /><span><strong>Secure video</strong> sessions</span></li>
            <li><LangIcon aria-hidden="true" strokeWidth={1.7} /><span><strong>Free</strong> 15-min consult</span></li>
            {/* The fee, at the top, on the page where the question is asked.
                It lived on /pricing — three clicks away — and price silence
                reads as expensive. The number already reaches the page for the
                mid-page booking card and for the Offer in structured data;
                this is the same figure, where a human meets it first.
                Undefined on the two umbrella services, which span session
                types at different prices, so the item simply does not render
                rather than showing a figure that would misrepresent them. */}
            {fee && <li><Wallet aria-hidden="true" strokeWidth={1.7} /><span><strong>{fee}</strong> per session</span></li>}
            <li><BadgeCheck aria-hidden="true" strokeWidth={1.7} /><span><strong>MA, RCC</strong> · BCACC</span></li>
          </ul>
          <div className="btn-row" style={{ marginTop: 24 }}>
            <Link className="btn btn--primary" href={site.bookingPath}>Book a free consultation</Link>
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
              <p className="lede" style={{ marginBottom: 24 }}>{s.intro}</p>
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
                <Link className="btn btn--primary" href={site.bookingPath} style={{ width: '100%', textAlign: 'center' }}>
                  Book a free consultation
                </Link>
              </div>
              <Toc items={toc} />
            </aside>
          </div>
        </div>
      </section>

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
                <Link href={site.bookingPath}>free 15-minute consultation</Link> is the least
                committal way to find out whether this is the right approach — including if the
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
            duration={DURATION_FOR[s.slug] ?? '50 minutes'}
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
                  <p>{f.a}</p>
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


      <MoreFrom items={services} currentSlug={s.slug} base="/services" heading="Other counselling services" eyebrow="Keep going" />
      {/* The Punjabi service page closes in Punjabi. The Gurmukhi heading is
          reused VERBATIM from /punjabi (already reviewed) — the fluent-review
          rule permits reuse, not fresh composition. */}
      {params.slug === 'punjabi-counselling' ? (
        <CtaBand
          heading="ਮੁਫ਼ਤ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਬੁੱਕ ਕਰੋ"
          headingLang="pa"
          headingClassName={gurmukhi.className}
          text="Book a free 15-minute consultation — in Punjabi, English, or both. No pressure, and no obligation afterward."
        />
      ) : (
        <CtaBand />
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}

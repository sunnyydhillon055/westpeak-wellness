import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides, getGuide } from '@/lib/guides';
import { tagalogGuides } from '@/lib/tagalog-guides';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { site } from '@/lib/site';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, medicalWebPage, figureImage } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import { plainText } from '@/lib/plain-text';
import SceneBand from '@/components/SceneBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import CityLinks from '@/components/CityLinks';
import ServiceCityLinks from '@/components/ServiceCityLinks';
import Figure from '@/components/Figure';
import InlineRelated from '@/components/InlineRelated';
import { getFigure } from '@/lib/figures';
import { deviceSlots } from '@/lib/placement';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadCapture, { type MagnetKey } from '@/components/LeadCapture';
import { ogBase } from '@/lib/og-meta';
import { HeroNextDays } from '@/components/NextConsultLine';
import BookLink from '@/components/BookLink';
import { bookingCtaFor, consultPeople, heroBookingCta } from '@/lib/booking-cta';
import NextStep from '@/components/NextStep';
import { counsellorsForInfoPage, feeLineFor, infoCardCopy, showsInfoCards } from '@/lib/counsellor-cards';
import { GENTLE_CTA, softStepsFor } from '@/lib/next-steps';
import { readCatalog } from '@/lib/cliniko-catalog';

/* GENTLE_CTA, the guides where "Still deciding? Book a free consultation!"
   is the wrong note, lives in lib/next-steps.ts since 1 Oct 2026, so the
   cards' NO_CARDS list (lib/counsellor-cards.ts) can be tested against it. */

/* Which one-pager the email form at the end of a guide offers, if any.
 *
 * The GENTLE_CTA pages get no form at all: an email-capture box under a guide
 * about grief or watching someone drink reads as working a person in
 * difficulty as a lead, which is exactly the tone lib/inbound-mail.ts
 * promises never to take. Everyone else gets the one-pager nearest their
 * question — the coverage checklist on the money guide, the how-to-start
 * steps elsewhere. Same rule as GENTLE_CTA: an explicit list, because which
 * pages are sensitive is a judgement that should be visible in one place. */
function guideMagnet(slug: string): MagnetKey | null {
  if (GENTLE_CTA.has(slug)) return null;
  if (slug === 'money-stress-and-mental-health') return 'coverage-checklist';
  return 'starting-counselling';
}

/* THE NEXT FREE CONSULTATION, under the section a reader deciding between
   the public wait and a private one is reading: /guides/waiting-for-therapy-
   in-bc (1 Oct 2026), and the sick-days guide's section on when the days
   become a pattern worth talking about (10 clicks, 1 book_click). Keyed by
   the section's heading so the line moves with the section, not with an
   index; each has its own book_click location.

   Since 3 Oct 2026 (item 409) the line prints under the hero button instead,
   counted as 'hero-next-article', and this list only says which guides
   carry it although they show no counsellor cards. The two locations stay
   in BOOK_LOCATIONS for the clicks already recorded. */
const NEXT_CONSULT_AFTER: Record<string, { h2: string; location: string }> = {
  'waiting-for-therapy-in-bc': { h2: 'When paying privately makes sense, and when it does not', location: 'guide-waiting' },
  'sick-days-and-mental-health-days-bc': { h2: 'When the days become data', location: 'next-guide-sick-days' },
};
/* 3 Oct 2026 (item 414) moved the waiting guide's line from five sections
   down to straight under the short answer. Merged with item 409 the same
   day: the line now sits under the hero button on every guide that carries
   it, a few lines below that answer, so 414's placement is kept by the hero
   line and the page still prints it once. */

/* FULLY STATIC — 3 Oct 2026 (item 429). This page exported `revalidate`
   for the catalogue fee and the next-consultation line. A page Next
   re-renders in production goes out without the inlined first-paint CSS
   (scripts/inline-css.mjs only sees the build), and production served these
   templates with blocking stylesheet links. The fee is now a build-time fact
   (a price change in Cliniko reaches the page with the next deploy) and the
   next consultation is filled in by the browser (components/NextConsultSlot.tsx).
   `inline-css --check` fails if an indexable route exports revalidate again. */

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug);
  if (!g) return {};
  return {
    title: { absolute: g.metaTitle },
    description: g.metaDescription,
    alternates: {
      canonical: `${site.domain}/guides/${g.slug}`,
      /* The reciprocal half of the Tagalog pairing declared on
         /tagalog/gabay/[slug]. Only while the Tagalog guides are published,
         and only the first Tagalog guide that names this one (two of them
         are written from burnout-vs-depression). */
      ...(() => {
        if (!TAGALOG_READY) return {};
        const tl = tagalogGuides.find((t) => t.englishHref === `/guides/${g.slug}`);
        return tl
          ? {
              languages: {
                'en-CA': `${site.domain}/guides/${g.slug}`,
                tl: `${site.domain}/tagalog/gabay/${tl.slug}`,
                'x-default': `${site.domain}/guides/${g.slug}`,
              },
            }
          : {};
      })(),
    },
    openGraph: { ...ogBase(`/guides/${g.slug}`),
      type: 'article', title: g.metaTitle, description: g.metaDescription, modifiedTime: g.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const g = getGuide(params.slug);
  if (!g) notFound();
  const gentle = GENTLE_CTA.has(g.slug);
  /* Cards on every guide but the NO_CARDS list (lib/counsellor-cards.ts),
     naming only counsellors who offer the guide's service. The fee line is
     on every guide, gentle ones included: a price is information, not
     pressure. The closing consultation time goes with the cards, so a page
     the owner has not cleared for "who you would talk to" does not get
     "when" either. 1 Oct 2026. */
  const cards = showsInfoCards('guides', g.slug);
  const counsellors = cards ? counsellorsForInfoPage({ service: g.service }) : [];
  const feeLine = feeLineFor(g.service, await readCatalog());
  const next = NEXT_CONSULT_AFTER[g.slug];
  /* A guide about couples, EMDR or family work books with the counsellor
     who offers it (g.service); every other guide keeps the practice
     calendar. Through bookingCtaFor so the rule lives in one place. */
  const cta = bookingCtaFor({ service: g.service, fallback: 'Book a free consultation' });
  /* The next free consultation, once per page, under the hero button since
     3 Oct 2026 (item 409): with the counsellors the closing cards show, or,
     on a guide that printed it mid-article (NEXT_CONSULT_AFTER), with every
     counsellor taking new clients, as that line did. A guide with neither
     prints none. When exactly one fits, the button names her. */
  const heroPeople = cards
    ? consultPeople({ slugs: counsellors.map((p) => p.slug), service: g.service })
    : next ? consultPeople({ service: g.service }) : [];
  const heroCta = heroBookingCta(cta, heroPeople);

  const toc = buildToc([
    ...g.sections.map((s) => s.h2),
    ...getExtra('guides', g.slug).map((s) => s.h2),
    'Common questions', 'Sources',
  ]);

  /* Mid-article devices, spread through the piece by content weight instead of
     stacked at the top. See lib/placement.ts for why. */
  const midDevices = [
    g.figure ? <Figure key="fig" name={g.figure} /> : null,
    <div className="crisis" key="cta" style={{ margin: '32px 0' }}>
      <p style={{ margin: 0 }}>
        {g.midCta.text} <BookLink location="mid-guide" href={cta.href} className="">{g.midCta.label}</BookLink>.
      </p>
    </div>,
    g.related[0] ? (
      <InlineRelated key="rel" href={g.related[0].href} label={g.related[0].label} />
    ) : null,
    g.figure2 ? <Figure key="fig2" name={g.figure2} /> : null,
  ].filter(Boolean);
  const articleSections = [...g.sections, ...getExtra('guides', g.slug)];
  const slots = deviceSlots(articleSections, midDevices.length);

  const schema = [
    medicalWebPage({
      path: `/guides/${g.slug}`,
      name: g.title,
      description: g.metaDescription,
      reviewed: g.updated,
    }),
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: g.title, description: g.metaDescription,
      dateModified: g.updated, datePublished: g.updated,
      inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/guides/${g.slug}` },
      publisher: orgRef,
      author: orgRef,
      /* No reviewedBy: it pointed at /about#person, which no page defines. See personRef in lib/schema.ts. 1 Oct 2026. */
      isPartOf: siteRef,
      isAccessibleForFree: true,
      /* The guide's own answer, the one printed above the fold, offered as
         the summary rather than leaving an engine to compose one from
         whichever paragraph it retrieved. Added 24 Sep 2026. */
      abstract: g.shortAnswer,
      /* THE SOURCES, AS DATA — 24 Sep 2026.
         Every guide here already lists its primary sources at the foot of the
         page, in words, with links; that is the site's editorial rule and the
         reason a reader can check a claim. In the structured data they did not
         exist, so a retrieval system quoting this page could not tell a guide
         that cites the Employment Standards Act from one that cites nothing.
         `citation` is where schema.org puts exactly that. */
      ...(g.sources.length
        ? { citation: g.sources.map((src) => ({ '@type': 'CreativeWork', name: src.label, url: src.url })) }
        : {}),
      /* The social card stays a plain URL — it is a card, not content. The
         diagram becomes an ImageObject carrying what it actually shows; see
         lib/schema.ts. 24 Sep 2026. */
      image: [
        `${site.domain}/guides/${g.slug}/opengraph-image`,
        ...(g.figure && getFigure(g.figure) ? [figureImage(getFigure(g.figure)!, `/guides/${g.slug}`)] : []),
        ...(g.figure2 && getFigure(g.figure2) ? [figureImage(getFigure(g.figure2)!, `/guides/${g.slug}`)] : []),
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: `${site.domain}/guides` },
        { '@type': 'ListItem', position: 3, name: g.title, item: `${site.domain}/guides/${g.slug}` },
      ],
    },
    g.faqs.length && {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: g.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
      })),
    },
  ].filter(Boolean);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container container--article">
          <p className="eyebrow">{g.eyebrow}</p>
          <h1 style={{ maxWidth: '14.56em' }}>{g.title}</h1>
          {/* THE ANSWER FIRST — 1 Oct 2026. It sat 2-3 KB down, after the
              hook, the contents list and the byline. .answer is the
              speakable selector (lib/schema.ts). */}
          <p className="answer" style={{ fontSize: '1.12rem', lineHeight: 1.55, color: 'var(--ink)', maxWidth: '35.33em', margin: '.5em 0 0' }}>
            {g.shortAnswer}
          </p>
          <p className="lede">{g.lede}</p>
          {/* "Updated", not "Reviewed". components/Byline.tsx was fixed for exactly
              this in August: it was printing the word "Reviewed" over the date the
              prose last CHANGED, which is a claim that a clinician read the page
              that day and stood behind it. The fix never reached these hero notes,
              so the heavier claim carried on being made above the fold on every
              guide, comparison, approach, audience and resource page while the
              byline lower down said the honest thing. The date does not move; only
              the word does, which was the whole point the first time. */}
          <p className="hero-note">{g.readMinutes} min read · Updated {fmt(g.updated)}</p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            {/* Counted since 1 Oct 2026: book_click was recorded on one guide
                in six weeks because neither guide button reported anything. */}
            <BookLink location="hero-guide" href={heroCta.href}>{heroCta.label}</BookLink>
            <Link className="btn btn--ghost" href="/guides">All guides</Link>
          </div>
          <HeroNextDays people={heroPeople} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container reading">
          <Toc items={toc} />
          <div className="prose">
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Guides', path: '/guides' },
              { name: g.title, path: `/guides/${g.slug}` },
            ]}
          />

          <Byline updated={g.updated} readMinutes={g.readMinutes} />

          {g.sections.map((s, i) => (
            <div key={s.h2}>
              <h2 id={headingId(s.h2)}>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                  {s.list.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}</strong>, {rich(item.detail)}
                    </li>
                  ))}
                </ul>
              )}

              {midDevices.filter((_, k) => slots[k] === i)}
            </div>
          ))}

          <ExtraSections
            area="guides"
            slug={g.slug}
            devices={midDevices}
            slots={slots}
            offset={g.sections.length}
          />

          <SceneBand seed={g.slug} />

          <h2 id="common-questions">Common questions</h2>
          <div style={{ marginTop: 8 }}>
            {g.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{rich(f.a)}</p>
              </details>
            ))}
          </div>

          <h2 id="sources">Sources</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
            {g.sources.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>

          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
            This guide is general information, not clinical advice, and it cannot diagnose anything
            or replace an assessment. If you are in crisis, call or text <strong>9-8-8</strong>{' '}
            (Canada, 24/7) or BC Mental Health Support at <strong>310-6789</strong>.
          </p>

          </div>
        </div>
      </section>

      {/* THE NEXT STEP, straight after Sources and the disclaimer and before
          the 30-50 link footer (components/NextStep.tsx, 1 Oct 2026): who you
          would talk to, the fee for this guide's service, the next free
          consultation with a counsellor who fits, and the closing band with
          its smaller steps. The GENTLE_CTA guides keep the gentle register
          and, as before, no email form. */}
      <NextStep
        counsellors={counsellors}
        cardLocation="guide"
        cardCopy={infoCardCopy(gentle)}
        feeLine={feeLine}
        /* No consult: once per page (item 379), and since 3 Oct 2026
           (item 409) it prints under the hero button (HeroNextDays). */
        service={g.service}
        softSteps={softStepsFor({ path: `/guides/${g.slug}`, slug: g.slug, service: g.service })}
        band={{
          tone: gentle ? 'gentle' : 'default',
          heading: 'Still deciding?',
          text: 'A free 30-minute consultation is the least committal way to find out whether this is a fit. No pressure, and no obligation to book a session afterward.',
          bookHref: cta.href,
        }}
      />

      {/* The one-pager form, AFTER the next step (item 385, 1 Oct 2026): a
          reader who finished the guide met an email box before the
          counsellors and their calendar links. It is now the soft step after
          "Not ready to book?"; lib/change-register.ts and data/changes.json
          record the move. The confirmation is /one-pager-sent, which says
          what a signup starts (the one-pager, then two notes), not
          /message-sent, which promises an enquiry's reply. */}
      {guideMagnet(g.slug) && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="container reading">
            <div className="prose">
              <LeadCapture
                magnet={guideMagnet(g.slug) as MagnetKey}
                source={`/guides/${g.slug}`}
                returnTo="/one-pager-sent"
              />
            </div>
          </div>
        </section>
      )}

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">Keep reading</p>
          <h2>Related pages</h2>
          <div className="chip-grid" style={{ marginTop: 20 }}>
            {/* A related link to /book follows the page's booking links. */}
            {g.related.map((r) => (
              <Link className="chip" key={r.href} href={r.href === site.bookingPath ? cta.href : r.href}>{r.label}</Link>
            ))}
          </div>
        </div>
      </section>


      <MoreFrom items={guides} currentSlug={g.slug} base="/guides" heading="More counselling guides" eyebrow="Keep going" />
      <ServiceCityLinks section="guides" slug={g.slug} />
      <CityLinks />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

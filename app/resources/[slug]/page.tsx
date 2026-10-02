import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resources, getResource, citationFor } from '@/lib/resources';
import { site } from '@/lib/site';
import CopyText from '@/components/CopyText';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import { plainText } from '@/lib/plain-text';
import BookLink from '@/components/BookLink';
import { bookingCtaFor } from '@/lib/booking-cta';
import SceneBand from '@/components/SceneBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import { deviceSlots } from '@/lib/placement';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import CityLinks from '@/components/CityLinks';
import ServiceCityLinks from '@/components/ServiceCityLinks';
import Figure from '@/components/Figure';
import InlineRelated from '@/components/InlineRelated';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadCapture, { type MagnetKey } from '@/components/LeadCapture';
import { ogBase } from '@/lib/og-meta';
import NextConsultLine from '@/components/NextConsultLine';
import NextStep from '@/components/NextStep';
import { NO_CARDS, counsellorsForInfoPage, feeLineFor, infoCardCopy, showsInfoCards } from '@/lib/counsellor-cards';
import { softStepsFor } from '@/lib/next-steps';
import { readCatalog, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import StudentPlanTable from '@/components/StudentPlanTable';
import { STUDENT_PLAN_TABLE_AFTER } from '@/lib/student-plans';
import { activeSeasonal } from '@/lib/seasonal';

/* The student-plan table's sessions column (1 Oct 2026). This template is
   static, so the fee is the catalogue's checked-in copy, which price-drift
   compares with Cliniko, as /tools/therapy-cost-bc does. */
const individualCents = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')?.cents;

/* Which resource pages carry the email one-pager, and which pager. Money
 * pages only: the coverage checklist where the reader has a plan to check,
 * the how-to-start pager where they may not. The crisis directory and the
 * clinical-system pages deliberately get nothing — same reasoning as the
 * guides' GENTLE_CTA list. */
const RESOURCE_MAGNET: Record<string, MagnetKey | undefined> = {
  'bc-extended-health-coverage-for-counselling': 'coverage-checklist',
  'msp-vs-extended-health': 'coverage-checklist',
  'low-cost-counselling-bc': 'starting-counselling',
};

/* THE NEXT FREE CONSULTATION, under the section a reader is in when the
   next step is a conversation: the four-minute register check, the question
   that settles coverage, and, on the Punjabi words page, the section about
   reading the rest in Punjabi (that line names only counsellors who work in
   the page's language). Keyed by heading, as in the guides template, so the
   line moves with its section. Each has its own book_click location. */
const NEXT_CONSULT_AFTER: Record<string, { h2: string; location: string }> = {
  'verify-a-counsellor-in-bc': { h2: 'The four-minute check', location: 'next-resource-verify' },
  'does-my-plan-cover-counselling-bc': { h2: 'The question that settles it, whichever insurer you have', location: 'next-resource-plan' },
  'counselling-in-punjabi-what-the-words-mean': { h2: 'If you want the rest of this in Punjabi', location: 'next-resource-punjabi-words' },
};

/* Re-rendered every thirty minutes, the life of the availability cache, so
   the line above is what Cliniko is offering, and the fee line under the
   cards follows the catalogue. A resource without either renders the same
   bytes each time. 1 Oct 2026. */
export const revalidate = 1800;

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = getResource(params.slug);
  if (!r) return {};
  return {
    title: { absolute: r.metaTitle },
    description: r.metaDescription,
    alternates: { canonical: `${site.domain}/resources/${r.slug}` },
    openGraph: { ...ogBase(`/resources/${r.slug}`),
      type: 'article', title: r.metaTitle, description: r.metaDescription, modifiedTime: r.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/* On a linkable page (item 275) the cards, the closing band and the link
   footer are wrapped so print can drop them; on every other page nothing
   is added to the markup. */
function ScreenOnly({ hide, children }: { hide: boolean; children: ReactNode }) {
  return hide ? <div className="linkable-noprint">{children}</div> : <>{children}</>;
}

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const r = getResource(params.slug);
  if (!r) notFound();
  /* Cards on every resource but the NO_CARDS list (lib/counsellor-cards.ts):
     the language counsellor on a language page, the counsellor insured for
     Alberta on an Alberta page, otherwise whoever is accepting individual
     clients in BC. The fee line goes with them on every resource except the
     two NO_CARDS pages, which are not about this practice's sessions (the
     crisis directory, becoming a counsellor). The consultation time goes
     with the cards. 1 Oct 2026. */
  const cards = showsInfoCards('resources', r.slug, r.whoYouWouldSee);
  const counsellors = cards ? counsellorsForInfoPage(r) : [];
  const feeLine = NO_CARDS.resources.includes(r.slug) ? undefined : feeLineFor(undefined, await readCatalog());
  const next = NEXT_CONSULT_AFTER[r.slug];
  /* A resource written for one language books with the counsellor who
     speaks it; one written for Alberta with the counsellor insured there;
     every other resource keeps the practice calendar. */
  const cta = bookingCtaFor({ language: r.language, province: r.province, fallback: 'Book a free consultation' });

  /* The dated year-end section, when in season, renders after the first
     section, so the page answers its own question before the seasonal
     aside, and the contents list names it there (item 383, 1 Oct 2026). */
  const seasonal = activeSeasonal(r.seasonal);
  const toc = buildToc([
    ...r.sections.flatMap((s, i) => (i === 0 && seasonal ? [s.h2, seasonal.h2] : [s.h2])),
    ...getExtra('resources', r.slug).map((s) => s.h2),
    'Common questions', r.linkable ? 'Using this page' : '', 'Sources',
  ]);
  /* Booking prompts and counsellor cards are for the screen; on a linkable
     page someone prints for a noticeboard they are dropped from paper
     (app/premium.css, item 275 block). */
  const np = r.linkable ? 'linkable-noprint' : undefined;

  /* Mid-article devices, spread by content weight rather than stacked at the
     top of the page. See lib/placement.ts. */
  const midDevices = [
    r.figure ? <Figure key="fig" name={r.figure} /> : null,
    <div className={np ? `crisis ${np}` : 'crisis'} key="cta" style={{ margin: '8px 0 32px' }}>
      <p style={{ margin: 0 }}>
        {r.midCta.text} <BookLink location="mid-resource" href={cta.href} className="">{r.midCta.label}</BookLink>.
      </p>
    </div>,
    r.related[0] ? (
      <InlineRelated key="rel" href={r.related[0].href} label={r.related[0].label} />
    ) : null,
    r.figure2 ? <Figure key="fig2" name={r.figure2} /> : null,
  ].filter(Boolean);
  const articleSections = [...r.sections, ...getExtra('resources', r.slug)];
  const slots = deviceSlots(articleSections, midDevices.length);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: r.title, description: r.metaDescription,
      dateModified: r.updated, datePublished: r.updated, inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/resources/${r.slug}` },
      publisher: orgRef,
      author: orgRef,
      /* No reviewedBy: it pointed at /about#person, which no page defines. See personRef in lib/schema.ts. 1 Oct 2026. */
      isPartOf: siteRef,
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${site.domain}/resources` },
        { '@type': 'ListItem', position: 3, name: r.title, item: `${site.domain}/resources/${r.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: r.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container container--article">
          <p className="eyebrow">{r.eyebrow}</p>
          <h1 style={{ maxWidth: '14.56em' }}>{r.title}</h1>
          {/* THE ANSWER FIRST — 1 Oct 2026. It sat 2-3 KB down, after the
              hook, a thirteen-item contents list and the byline; the
              workplace, verify and EI pages were ranking with 0.3-0.9% CTR.
              /for already led with it. .answer is the speakable selector. */}
          <p className="answer" style={{ fontSize: '1.12rem', lineHeight: 1.55, color: 'var(--ink)', maxWidth: '35.33em', margin: '.5em 0 0' }}>
            {r.shortAnswer}
            {r.slug === 'verify-a-counsellor-in-bc' && (
              <>
                {' '}
                <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">Search the BCACC register</a>.
              </>
            )}
          </p>
          <p className="lede">{r.lede}</p>
          {/* "Updated", not "Reviewed". components/Byline.tsx was fixed for exactly
              this in August: it was printing the word "Reviewed" over the date the
              prose last CHANGED, which is a claim that a clinician read the page
              that day and stood behind it. The fix never reached these hero notes,
              so the heavier claim carried on being made above the fold on every
              guide, comparison, approach, audience and resource page while the
              byline lower down said the honest thing. The date does not move; only
              the word does, which was the whole point the first time. */}
          <p className="hero-note">{r.readMinutes} min read · Updated {fmt(r.updated)}</p>
          <div className={np ? `btn-row ${np}` : 'btn-row'} style={{ marginTop: 22 }}>
            <BookLink location="hero-resource" href={cta.href}>{cta.label}</BookLink>
            <Link className="btn btn--ghost" href="/resources">All resources</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container reading">
          <Toc items={toc} />
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Resources', path: '/resources' },
              { name: r.title, path: `/resources/${r.slug}` },
            ]}
          />

          <div className="prose">
            <Byline updated={r.updated} readMinutes={r.readMinutes} />

            {r.afterShortAnswer && (
              <div className="crisis" style={{ margin: '8px 0 36px' }}>
                <p style={{ margin: '0 0 8px' }}><strong>{r.afterShortAnswer.heading}</strong></p>
                <Paragraphs items={r.afterShortAnswer.body} />
                {r.afterShortAnswer.book && (
                  <p style={{ margin: 0 }}>
                    <BookLink location="mid-resource" href={cta.href} className="">{r.afterShortAnswer.book}</BookLink>.
                  </p>
                )}
              </div>
            )}

          </div>

          {r.sections.map((s, i) => (
            <div key={s.h2}>
              <div className="prose">
                <h2 id={headingId(s.h2)}>{s.h2}</h2>
                {s.body && <Paragraphs items={s.body} />}
                {s.list && (
                  <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                    {s.list.map((item) => (
                      <li key={item.label}><strong>{item.label}</strong>, {rich(item.detail)}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* .table-scroll, not an inline overflowX — see the note in
                  app/compare/[slug]/page.tsx. A comment cannot sit directly
                  inside the `&&` expression below, which is why it is here. */}
              {s.table && (
                <div className="table-scroll" style={{ margin: '8px 0 36px' }}>
                  <table className="fee-table" style={{ minWidth: 640 }}>
                    <thead>
                      <tr>{s.table.columns.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]}>
                          <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{row[0]}</td>
                          {row.slice(1).map((cell, k) => <td key={k} style={{ fontWeight: 400 }}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* A copyable template. Plain text, selectable, in the reading
                  column: a reader on a phone long-presses and copies it into
                  an email. No copy button, because a button needs a client
                  component and the selection already works everywhere. */}
              {s.template && (
                <div className="prose">
                  <p style={{ margin: '0 0 6px', fontSize: '.86rem', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                    {s.template.title} · select to copy
                  </p>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', fontSize: '.95rem', lineHeight: 1.6, background: 'var(--bg-tint)', border: '1px solid var(--line)', borderRadius: 8, padding: '18px 20px', margin: '0 0 32px', userSelect: 'all' }}>
                    {s.template.lines.join('\n')}
                  </pre>
                </div>
              )}

              {next?.h2 === s.h2 && (
                <div className="prose">
                  <NextConsultLine location={next.location} language={r.language} />
                </div>
              )}

              {s.book && (
                <div className={np ? `prose ${np}` : 'prose'}>
                  <p>
                    {rich(s.book.text)}{' '}
                    <BookLink location={s.book.location} href={cta.href} className="">{s.book.label}</BookLink>.
                  </p>
                </div>
              )}

              {STUDENT_PLAN_TABLE_AFTER[`resources/${r.slug}`] === s.h2 && (
                <StudentPlanTable fee={individualCents ? individualCents / 100 : undefined} />
              )}

              <div className="prose">{midDevices.filter((_, k) => slots[k] === i)}</div>

              {/* A dated section, only inside its window on the Pacific date
                  (Resource.seasonal, lib/seasonal.ts), after the first
                  section rather than ahead of it (item 383). This template
                  re-renders every 1800 s, so it appears and goes without a
                  deploy. */}
              {i === 0 && seasonal && (
                <div className="prose">
                  <div className="crisis" style={{ margin: '8px 0 36px' }}>
                    <h2 id={headingId(seasonal.h2)} style={{ marginTop: 0 }}>{seasonal.h2}</h2>
                    <Paragraphs items={seasonal.body} />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="prose">
            <ExtraSections
            area="resources"
            slug={r.slug}
            devices={midDevices}
            slots={slots}
            offset={r.sections.length}
          />


            <SceneBand seed={r.slug} />

            <h2 id="common-questions">Common questions</h2>
            <div style={{ marginTop: 8 }}>
              {r.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{rich(f.a)}</p>
                </details>
              ))}
            </div>

            {/* USING THIS PAGE — 1 Oct 2026 (item 275). docs/OUTREACH.md
                promised the crisis directory was "free to link or reproduce
                with attribution", and the page never said so. The four pages
                outreach asks people to link and print now say it, with the
                date, a citation line and where to report a stale entry. */}
            {r.linkable && (
              <div className="linkable-note">
                <h2 id="using-this-page">Using this page</h2>
                <ul>
                  <li>Free to link to, from any website, intranet, handout or resource list. No need to ask.</li>
                  <li>May be reproduced, in print or online, with attribution to Westpeak Wellness and a link to this page.</li>
                  <li>Last updated {fmt(r.updated)}.</li>
                  <li>Spotted something out of date? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</li>
                </ul>
                <p style={{ margin: '14px 0 0' }}><strong>Suggested citation</strong></p>
                <div className="linkable-noprint">
                  <CopyText text={citationFor(r, site.domain)} />
                </div>
                <p className="linkable-print-url" style={{ display: 'none' }}>
                  {citationFor(r, site.domain)}
                </p>
              </div>
            )}

            <h2 id="sources">Sources</h2>
            <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
              {r.sources.map((s) => (
                <li key={s.url} style={{ marginBottom: 8 }}>
                  <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
                </li>
              ))}
            </ul>

            {/* The crisis line follows the page's province: an Alberta page
                names the Recovery Alberta helpline its own body cites, not
                BC's 310-6789 (item 384, 1 Oct 2026). */}
            <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
              General information, not clinical, financial, or legal advice. Coverage and service details
              change, verify anything decision-critical directly with the provider or insurer. If you are
              in crisis, call or text <strong>9-8-8</strong> (Canada, 24/7) or{' '}
              {r.province === 'AB' ? (
                <>the Recovery Alberta Mental Health Helpline at <strong>1-877-303-2642</strong>.</>
              ) : (
                <><strong>310-6789</strong> for BC Mental Health Support.</>
              )}
            </p>

          </div>
        </div>
      </section>

      <ScreenOnly hide={!!r.linkable}>
      {/* THE NEXT STEP, straight after Sources and the disclaimer and before
          the link footer (components/NextStep.tsx, 1 Oct 2026). Who appears,
          and whose next consultation time, follows the page's language and
          province; see counsellorsForInfoPage in lib/counsellor-cards.ts. */}
      <NextStep
        counsellors={counsellors}
        cardLocation="resource"
        cardCopy={infoCardCopy(false, r.province)}
        feeLine={feeLine}
        province={r.province}
        /* Once per page (item 379): a resource that already printed the
           next free consultation mid-article (NEXT_CONSULT_AFTER) does not
           print it again here. */
        consult={cards && !next ? { location: 'next-resource-close', slugs: counsellors.map((p) => p.slug) } : undefined}
        /* An Alberta page drops the BC cost estimator (item 384). */
        softSteps={softStepsFor({ path: `/resources/${r.slug}`, slug: r.slug }).filter((s) => r.province !== 'AB' || !s.href.endsWith('-bc'))}
        band={{
          bookHref: cta.href,
          heading: r.closingBand?.heading ?? 'Questions about cost or coverage?',
          text: r.closingBand?.text ?? 'A free 30-minute consultation is a good place to ask them, before committing to anything.',
        }}
      />

      {/* The one-pager offer, on the money pages only — an explicit map,
          like the guides' GENTLE_CTA, because which resource pages suit an
          email form is a judgement worth seeing in one place. The
          confirmation is /one-pager-sent, which says what a signup actually
          starts (the one-pager, then two notes), rather than /message-sent,
          which promises an enquiry's reply.

          AFTER THE NEXT STEP, not before it (item 385, 1 Oct 2026): a reader
          who finished the article met an email box ahead of the counsellors
          and their calendar links. It is now the soft step after "Not ready
          to book?". lib/change-register.ts records the move. */}
      {RESOURCE_MAGNET[r.slug] && (
        <section className="section" style={{ paddingTop: 8 }}>
          <div className="container reading">
            <div className="prose">
              <LeadCapture
                magnet={RESOURCE_MAGNET[r.slug]}
                source={`/resources/${r.slug}`}
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
            {r.related.map((x) => <Link className="chip" key={x.href} href={x.href === site.bookingPath ? cta.href : x.href}>{x.label}</Link>)}
          </div>
        </div>
      </section>


      {/* BC's resource list and its 17 cities are not the next page for
          an Alberta reader (item 384); the related chips above are. */}
      {r.province !== 'AB' && (
        <>
          <MoreFrom items={resources} currentSlug={r.slug} base="/resources" heading="More BC resources" eyebrow="Keep going" />
          <ServiceCityLinks section="resources" slug={r.slug} />
          <CityLinks />
        </>
      )}
      </ScreenOnly>

      {/* The address on paper, for a printed linkable page (item 275). */}
      {r.linkable && (
        <p className="linkable-print-url" style={{ display: 'none' }}>Printed from {site.domain}/resources/{r.slug}</p>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

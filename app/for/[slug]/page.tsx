import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { audiences, getAudience, pasteText, type PasteBlock } from '@/lib/audiences';
import { hrGlance } from '@/lib/audiences-more4';
import StudentPlanTable from '@/components/StudentPlanTable';
import { STUDENT_PLAN_TABLE_AFTER } from '@/lib/student-plans';
import CopyText from '@/components/CopyText';
import { site } from '@/lib/site';
import { getExtra } from '@/lib/depth';
import { buildToc, headingId } from '@/lib/toc';
import { orgRef, siteRef, personRef, medicalWebPage } from '@/lib/schema';
import { Paragraphs, rich } from '@/lib/rich';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import Byline from '@/components/Byline';
import ExtraSections from '@/components/ExtraSections';
import { deviceSlots } from '@/lib/placement';
import Toc from '@/components/Toc';
import MoreFrom from '@/components/MoreFrom';
import CityLinks from '@/components/CityLinks';
import Figure from '@/components/Figure';
import InlineRelated from '@/components/InlineRelated';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ogBase } from '@/lib/og-meta';
import BookLink from '@/components/BookLink';
import CoverageLine from '@/components/CoverageLine';
import { bookingCtaFor } from '@/lib/booking-cta';
import CounsellorCards from '@/components/CounsellorCards';
import { counsellorsForAudience, individualFeeLine } from '@/lib/counsellor-cards';
import { readCatalog } from '@/lib/cliniko-catalog';

export function generateStaticParams() {
  return audiences.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getAudience(params.slug);
  if (!a) return {};
  return {
    title: { absolute: a.metaTitle },
    description: a.metaDescription,
    alternates: { canonical: `${site.domain}/for/${a.slug}` },
    openGraph: { ...ogBase(`/for/${a.slug}`),
      type: 'article', title: a.metaTitle, description: a.metaDescription, modifiedTime: a.updated,
    },
  };
}

const fmt = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/* ISR, as the service and city-service pages are: the fee line under the
   hero is read from the Cliniko catalogue, and an hourly re-render picks up a
   price change without giving up static serving. 1 Oct 2026. */
export const revalidate = 3600;

export default async function AudiencePage({ params }: { params: { slug: string } }) {
  const a = getAudience(params.slug);
  if (!a) notFound();
  const catalog = await readCatalog();
  const feeLine = individualFeeLine(catalog);
  const cta = bookingCtaFor({ language: a.language, service: a.service, fallback: `Book a free consultation ${a.ctaFor}` });

  /* The student-plan table's sessions column divides by the individual fee
     from the same catalogue as the fee line. lib/student-plans.ts. */
  const individual = catalog.items.find((i) => i.name.toLowerCase() === 'individual counselling');
  const planTableAfter = STUDENT_PLAN_TABLE_AFTER[`for/${a.slug}`];

  /* Paste blocks sit after the section they name, or after the last one. */
  const blocks = a.pasteBlocks ?? [];
  const blocksAfter = (h2?: string) => blocks.filter((b) => b.after === h2);
  const glance = a.glance ? hrGlance(catalog) : [];

  const toc = buildToc([
    'The things people actually say',
    ...(a.glance ? [a.glance.h2] : []),
    ...a.sections.flatMap((s) => [s.h2, ...blocksAfter(s.h2).map((b) => b.h2)]),
    ...blocks.filter((b) => !b.after || !a.sections.some((s) => s.h2 === b.after)).map((b) => b.h2),
    ...getExtra('for', a.slug).map((s) => s.h2),
    'Services that tend to fit',
    'Common questions',
    'Sources and further support',
  ]);

  /* This page keeps its opening figure and CTA up in the cards section, where
     they belong. What was missing is anything at all inside the long prose
     column below them — 4,094px of it on /for/women. See lib/placement.ts.
     The depth sections are weighed in and carry devices too: covering only
     `a.sections` moved the gap to the tail rather than removing it. */
  const forSections = [...a.sections, ...getExtra('for', a.slug)];
  const midDevices = [
    a.related[0] ? (
      <InlineRelated key="rel" href={a.related[0].href} label={a.related[0].label} />
    ) : null,
    a.figure2 ? <Figure key="fig2" name={a.figure2} /> : null,
    a.related[1] ? (
      <InlineRelated key="rel2" href={a.related[1].href} label={a.related[1].label} />
    ) : null,
  ].filter(Boolean);
  const slots = deviceSlots(forSections, midDevices.length);

  const schema = [
    medicalWebPage({
      path: `/for/${a.slug}`,
      name: a.title,
      description: a.metaDescription,
      reviewed: a.updated,
    }),
    {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: a.title, description: a.metaDescription,
      dateModified: a.updated, datePublished: a.updated, inLanguage: 'en-CA',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}/for/${a.slug}` },
      publisher: orgRef,
      author: orgRef,
      reviewedBy: personRef,
      isPartOf: siteRef,
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain },
        { '@type': 'ListItem', position: 2, name: 'Who we work with', item: `${site.domain}/for` },
        { '@type': 'ListItem', position: 3, name: a.title, item: `${site.domain}/for/${a.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: a.faqs.map((f) => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 44 }}>
        <div className="container container--article">
          <p className="eyebrow">{a.eyebrow}</p>
          <h1 style={{ maxWidth: '13.24em' }}>{a.title}</h1>
          <p className="lede">{a.lede}</p>
          {/* "Updated", not "Reviewed". components/Byline.tsx was fixed for exactly
              this in August: it was printing the word "Reviewed" over the date the
              prose last CHANGED, which is a claim that a clinician read the page
              that day and stood behind it. The fix never reached these hero notes,
              so the heavier claim carried on being made above the fold on every
              guide, comparison, approach, audience and resource page while the
              byline lower down said the honest thing. The date does not move; only
              the word does, which was the whole point the first time. */}
          <p className="hero-note">{a.readMinutes} min read · Updated {fmt(a.updated)}</p>
          {/* THE ONE ACTION, NAMED FOR THE PAGE AND COUNTED — 1 Oct 2026. The
              button said "Book a free consultation" on all twenty-two pages
              and reported nothing. It now carries the page's own `ctaFor`,
              and on the pages written for Punjabi or Tagalog speakers it
              names the language and opens that counsellor's calendar. The
              coverage line under it was prose-only on this template; it is
              the sentence /pricing leads with. components/CoverageLine.tsx. */}
          {/* A page whose reader is not the client (`cta`, set only on the
              employer page) leads with its own action, and offers booking
              on somebody else's behalf as the second button. */}
          <div className="btn-row" style={{ marginTop: 22 }}>
            {a.cta ? (
              <>
                <Link className="btn btn--primary" href={a.cta.primary.href}>{a.cta.primary.label}</Link>
                {a.cta.ghost && (
                  <BookLink location="hero-audience" href={a.cta.ghost.href} className="btn btn--ghost">{a.cta.ghost.label}</BookLink>
                )}
              </>
            ) : (
              <>
                <BookLink location="hero-audience" href={cta.href}>{cta.label}</BookLink>
                <Link className="btn btn--ghost" href="/for">Who we work with</Link>
              </>
            )}
          </div>
          <CoverageLine />
          {/* The fee, where the coverage line has just raised the question.
              From the catalogue, never typed. 1 Oct 2026. */}
          {feeLine && <p className="hero-note" style={{ marginTop: 6 }}>{feeLine}</p>}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="container prose">
          <Breadcrumbs
            schema={false}
            trail={[
              { name: 'Who we work with', path: '/for' },
              { name: a.title, path: `/for/${a.slug}` },
            ]}
          />
          <Byline updated={a.updated} readMinutes={a.readMinutes} />

          {/* The direct answer, first thing after the byline — same placement
              as /guides, /compare and /resources. It is what an answer engine
              lifts, and it is also what a reader who is scanning needs before
              deciding whether to read the rest. */}
          <blockquote className="quote" style={{ margin: '0 0 36px' }}>{a.shortAnswer}</blockquote>

          <Paragraphs items={a.opening} />

          <Toc items={toc} variant="card" />
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">What comes up</p>
          <h2 id="the-things-people-actually-say">The things people actually say</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {a.whatComesUp.map((w) => (
              <div className="card" key={w.label}>
                <h3>{w.label}</h3>
                <p style={{ marginBottom: 0 }}>{rich(w.detail)}</p>
              </div>
            ))}
          </div>
          {a.figure && <Figure name={a.figure} />}
          <div className="crisis" style={{ marginTop: 32 }}>
            <p style={{ margin: 0 }}>
              {a.midCta.text}{' '}
              {a.cta
                ? <Link href={a.cta.primary.href}>{a.midCta.label}</Link>
                : <BookLink location="mid-audience" href={cta.href} className="">{a.midCta.label}</BookLink>}.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          {/* At a glance for HR: built from the catalogue and the roster at
              render, never typed. lib/audiences-more4.ts hrGlance(). */}
          {a.glance && glance.length > 0 && (
            <div>
              <h2 id={headingId(a.glance.h2)}>{a.glance.h2}</h2>
              <p>{rich(a.glance.intro)}</p>
              <dl className="glance-list" style={{ margin: '18px 0 32px' }}>
                {glance.map((g) => (
                  <div key={g.term} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
                    <dt style={{ fontWeight: 600, color: 'var(--ink)' }}>{g.term}</dt>
                    <dd style={{ margin: '2px 0 0' }}>{g.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {a.sections.map((s, i) => (
            <div key={s.h2}>
              <h2 id={headingId(s.h2)}>{s.h2}</h2>
              {s.body && <Paragraphs items={s.body} />}
              {s.list && (
                <ul className="checklist" style={{ margin: '20px 0 28px' }}>
                  {s.list.map((item) => (
                    <li key={item.label}><strong>{item.label}</strong>, {rich(item.detail)}</li>
                  ))}
                </ul>
              )}

              {/* What each BC student-society plan pays, after the section
                  lib/student-plans.ts names for this page. */}
              {planTableAfter === s.h2 && <StudentPlanTable fee={individual ? individual.cents / 100 : undefined} />}

              {blocksAfter(s.h2).map((b) => <Paste key={b.h2} b={b} />)}

              {midDevices.filter((_, k) => slots[k] === i)}
            </div>
          ))}
          {/* Text for another site to paste, with a copy button. lib/audiences.ts. */}
          {blocks
            .filter((b) => !b.after || !a.sections.some((s) => s.h2 === b.after))
            .map((b) => <Paste key={b.h2} b={b} />)}
        </div>
      </section>

      {/* WHO YOU WOULD SEE — 1 Oct 2026. On a page written for one language,
          the counsellor who works in it; otherwise whoever is accepting
          individual clients in BC. lib/counsellor-cards.ts decides. */}
      <CounsellorCards
        counsellors={counsellorsForAudience(a)}
        location="counsellor-audience"
        heading="Who you would see"
        intro="Taking new clients and seeing people across BC by secure video. Each is a Registered Clinical Counsellor; the registration is on the profile and can be checked on the BCACC register."
      />

      <section className="section section--ghost">
        <div className="container">
          <p className="eyebrow">Where to start</p>
          <ExtraSections
            area="for"
            slug={a.slug}
            devices={midDevices}
            slots={slots}
            offset={a.sections.length}
          />

          <h2 id="services-that-tend-to-fit">Services that tend to fit</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            {a.servicesThatFit.map((s) => (
              <div className="card card--stretch" key={s.href}>
                {/* Title-only anchor, stretched over the card by CSS; see app/for/page.tsx. */}
                <h3><Link href={s.href} className="card-stretch">{s.label}</Link></h3>
                <p>{s.why}</p>
                <span className="more" aria-hidden="true">{s.label} →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <SceneBand seed={a.slug} />

          <h2 id="common-questions">Common questions</h2>
          <div style={{ marginTop: 8 }}>
            {a.faqs.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <h2 id="sources-and-further-support">Sources and further support</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
            {a.sources.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>

          <div className="chip-grid" style={{ marginTop: 28 }}>
            {a.related.map((r) => <Link className="chip" key={r.href} href={r.href}>{r.label}</Link>)}
          </div>

          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem', marginTop: 28 }}>
            General information, not clinical advice, and not a diagnosis. If you are in crisis, call or
            text <strong>9-8-8</strong> (Canada, 24/7) or BC Mental Health Support at <strong>310-6789</strong>.
            In immediate danger, call <strong>911</strong>.
          </p>
        </div>
      </section>


      <MoreFrom items={audiences} currentSlug={a.slug} base="/for" heading="Written for other situations" eyebrow="Keep going" />
      <CityLinks />
      <CtaBand
        heading="One conversation, no commitment."
        text="A free 30-minute consultation over secure video, including an honest answer if something other than counselling would serve you better."
        bookHref={a.cta?.ghost?.href ?? cta.href}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

/* One copyable block: heading, intro, the lines NOT to do (shown, never
   copied), and the text with its copy button. */
function Paste({ b }: { b: PasteBlock }) {
  return (
    <div>
      <h2 id={headingId(b.h2)}>{b.h2}</h2>
      <p>{rich(b.intro)}</p>
      {b.donts && (
        <ul style={{ margin: '12px 0 4px' }}>
          {b.donts.map((d) => <li key={d}>{d}</li>)}
        </ul>
      )}
      <CopyText text={pasteText(b, site.domain)} />
    </div>
  );
}

import Link from 'next/link';
import CounsellorCards from '@/components/CounsellorCards';
import NextConsultLine from '@/components/NextConsultLine';
import CtaBand from '@/components/CtaBand';
import type { Practitioner } from '@/lib/practitioners';
import type { CounsellorCardLocation } from '@/lib/counsellor-cards';
import type { SoftStep } from '@/lib/next-steps';

/* THE NEXT STEP, WHERE THE ARTICLE ENDS — 1 Oct 2026.
 *
 * On nine sampled live guides, resources and comparisons the closing "Book
 * Free Consultation" sat after 32-51 links and 7,469-23,968 characters: the
 * related chips, MoreFrom, the service x city links and the city list all
 * came first. A reader who finished the article met a wall of links before
 * any next step. This block renders immediately after Sources and the
 * disclaimer, and the link footer follows it unchanged.
 *
 * In order: who you would talk to (the cards, where the page carries them),
 * the fee for what the page is about and who pays, the next free
 * consultation with a counsellor who fits, then the closing band with its
 * smaller steps. The guide, resource and comparison templates all render
 * this one component, so the three cannot drift apart.
 *
 * A SERVER COMPONENT, AND IT MUST STAY ONE. It receives full Practitioner
 * records from the page; marking it 'use client' would ship the roster to
 * the browser (the perf rule of 1 Oct 2026). The client pieces underneath
 * (BookLink) receive strings only.
 *
 * Coverage is said the way /pricing says it: plan-dependent, never "most
 * plans". No hours and no evening or weekend claim: the consultation line
 * prints Cliniko's own next open time, labelled Pacific, or nothing. */
export default function NextStep({
  counsellors,
  cardLocation,
  cardCopy,
  feeLine,
  consult,
  softSteps,
  band,
  province,
  service,
}: {
  /** The cards, or none (the NO_CARDS pages, and the comparisons). */
  counsellors: Practitioner[];
  cardLocation?: CounsellorCardLocation;
  cardCopy?: { heading: string; intro: string };
  /** From feeLineFor (lib/counsellor-cards.ts); undefined prints no fee. */
  feeLine?: string;
  /** The next-consultation line: who it may name and its book_click key.
   *  Undefined prints none. Since 3 Oct 2026 (item 409) the guide, resource
   *  and comparison templates pass none: the line prints once per page,
   *  under the hero button (HeroNextDays in components/NextConsultLine.tsx),
   *  where a reader meets it before the article rather than after it. */
  consult?: { location: string; slugs: readonly string[]; language?: string };
  softSteps: SoftStep[];
  /** 'AB' on a page written for Alberta: the coverage sentence then names
   *  no BC programme. */
  province?: string;
  /** The page's booking service (2 Oct 2026). On 'couples-therapy' the card
   *  buttons and the consultation link carry for=couples, so /book opens the
   *  couples consult rather than the individual one. */
  service?: string;
  band: {
    heading?: string;
    text?: string;
    tone?: 'default' | 'gentle';
    bookHref?: string;
  };
}) {
  const details = (
    <>
      {feeLine && (
        <p className="hero-note" style={{ margin: '0 0 6px' }}>
          {feeLine}
        </p>
      )}
      {feeLine && (
        <p className="hero-note" style={{ margin: '0 0 6px' }}>
          {province === 'AB' ? (
            <>
              Many extended health plans reimburse counselling, depending on the plan, so check
              yours. <Link href="/pricing">All fees</Link>.
            </>
          ) : (
            <>
              Many{' '}
              <Link href="/resources/does-my-plan-cover-counselling-bc">extended health plans</Link>{' '}
              reimburse a Registered Clinical Counsellor, depending on the plan, so check yours; MSP
              does not cover private counselling. <Link href="/pricing">All fees</Link>.
            </>
          )}
        </p>
      )}
      {consult && consult.slugs.length > 0 && (
        <NextConsultLine
          location={consult.location}
          slugs={consult.slugs}
          language={consult.language}
          service={service}
          style={{ margin: '10px 0 0', fontSize: '.95rem' }}
        />
      )}
    </>
  );

  return (
    <>
      {counsellors.length > 0 && cardLocation && cardCopy ? (
        <CounsellorCards
          counsellors={counsellors}
          location={cardLocation}
          service={service}
          className="section section--ghost"
          {...cardCopy}
          footer={details}
        />
      ) : feeLine || consult ? (
        <section className="section section--ghost" style={{ paddingBottom: 0 }}>
          <div className="container" style={{ maxWidth: 760 }}>
            {details}
          </div>
        </section>
      ) : null}
      <CtaBand
        tone={band.tone ?? 'default'}
        heading={band.heading}
        text={band.text}
        bookHref={band.bookHref}
        softSteps={softSteps}
      />
    </>
  );
}

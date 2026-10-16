'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { site } from '@/lib/site';
import InboundForm from '@/components/InboundForm';
import MailLink from '@/components/MailLink';
import BookLink from '@/components/BookLink';
import BookArrive from '@/components/BookArrive';
import BookDirectLink from '@/components/BookDirectLink';
import SchedulerEmbedView from '@/components/SchedulerEmbedView';
import { arriveDetailFor } from '@/lib/book-arrive';
import { timeZoneNote, availabilityLine, PACIFIC } from '@/lib/availability-summary';
import { shortAvailabilityLine } from '@/lib/book-card';
import { loadAvailability, bookSummary, type ClientAvailability } from '@/lib/consult-slot';
import {
  planYearPageLineShown, planResetPageLineShown, PLAN_RESET_LINE, YEAR_END_PATH,
} from '@/lib/seasonal';
import type { ImgAttrs } from '@/lib/img-props';

/* /book, CHOSEN IN THE BROWSER — 15 Oct 2026 (item 514).
 *
 * WHY. /book read ?with=, ?for= and ?sent= on the server and called Cliniko
 * while it rendered, so it was rendered per request: production answered it
 * with `private, no-cache, no-store`, X-Vercel-Cache MISS, and five
 * render-blocking stylesheet links, because scripts/inline-css.mjs only
 * reaches documents the build prerenders. Every header and StickyBook button
 * lands here. DECISIONS (6 Sep) put 740 ms of a 2.9 s mobile LCP on exactly
 * those links.
 *
 * NOW the page is prerendered once, as bare /book, and this component picks
 * the variant the address asks for. Everything the server used to decide
 * from the roster arrives as plain data (BookData, built in
 * app/book/page.tsx), so no roster, catalogue or tool list reaches the
 * browser (the perf rule of 1 Oct 2026); the photographs come in as finished
 * <img> attributes (lib/img-props.ts). What each variant prints is what the
 * server printed for the same address: the same branches, the same words.
 *
 * HOW THE ADDRESS IS READ. useSearchParams inside its own Suspense, in a
 * child that renders nothing (QueryProbe), so the static HTML is the bare
 * page and hydrates as it is; the parent re-renders once the query is known,
 * and again on a soft navigation from a card to ?with=<slug>#calendar. Until
 * then the calendar box is drawn closed with no behaviour (`pending`), so an
 * arrival at #calendar opens the chosen counsellor's calendar, never the
 * practice-wide one first, and BookArrive counts the arrival once, with the
 * slug the address carries.
 *
 * THE CLINIKO LINES (the open times on each card, the next open days in the
 * calendar box) come from /api/availability through loadAvailability(), the
 * same request and the same thirty-minute cache the profiles have used since
 * ea7cb14. The slots hold their height (app/premium.css), so filling them
 * moves nothing. The fees are prerendered from the catalogue, as before.
 *
 * DATES. The plan-year and January lines and the time-zone sentence are
 * computed from the build date until the query is known, then from the
 * visitor's clock, so a window that opened since the last build is honoured
 * on the day without a hydration mismatch. */

export type BookPerson = {
  slug: string;
  name: string;
  /** withLetters(p): "Camille Granda, RCC". */
  letters: string;
  languages: { name: string; tag: string }[];
  /** Where sessions can be, as the notes say it ("British Columbia"). */
  area: string;
  /** The same for a card ("Anywhere in Canada" or the province names). */
  cardArea: string;
  reach?: 'canada';
  /** The first three focus labels, joined. */
  focus: string;
  bookable: boolean;
  /** Offers couples work (services include couples-therapy). */
  couples: boolean;
  clinikoPractitionerId?: string;
  bookingsUrl: string;
  credentials: { short: string; full: string; verifyUrl?: string }[];
  /** insuredProvinces(p, vancouverToday()) at build. */
  insured: string[];
  img?: { row: ImgAttrs; card: ImgAttrs; wait: ImgAttrs };
  fees: string | null;
  feesCouples: string | null;
  lengths: string | null;
  lengthsCouples: string | null;
};

export type BookData = {
  accepting: BookPerson[];
  /** Roster slugs that are not taking new clients (an old ?with= link). */
  others: string[];
  bare: {
    fees: string | null;
    lengths: string | null;
    provinceList: string;
    canadaWide: boolean;
    bookingsUrl: string;
  };
  /** notTakingLine(...) for the accepting names. */
  notTaking: string;
  cameraOptional: string;
  /* RCC_PLAIN and CLINIKO_EMBED_PARAM, passed rather than imported: lib/site
     is in the root layout's chunk, and every export a client component
     reads from it is shipped to every page (the layoutJs budget). */
  rccPlain: string;
  embedParam: string;
  builtAt: number;
};

/* Inline styles kept verbatim from the server page. */
const P_NEXT = { margin: '0 0 6px', fontSize: '.95rem', lineHeight: 1.5 } as const;

function QueryProbe({ onQuery }: { onQuery: (q: string) => void }) {
  const q = useSearchParams()?.toString() ?? '';
  useEffect(() => { onQuery(q); }, [q, onQuery]);
  return null;
}

function useAvailability(): ClientAvailability | null {
  const [all, setAll] = useState<ClientAvailability | null>(null);
  useEffect(() => {
    let live = true;
    loadAvailability().then((j) => { if (live) setAll(j); });
    return () => { live = false; };
  }, []);
  return all;
}

/* WHAT SESSIONS COST IF YOU CARRY ON — the catalogue phrase, prerendered. */
function FeesText({ phrase }: { phrase: string | null }) {
  return phrase ? (
    <>
      {' '}Sessions after it: {phrase}, card taken at booking. Whether your plan reimburses a
      Registered Clinical Counsellor depends on the plan.
    </>
  ) : null;
}

function CardAvailability({ all, slug, first }: { all: ClientAvailability | null; slug: string; first: string }) {
  const a = bookSummary(all, slug);
  const line = availabilityLine(a, first);
  const short = shortAvailabilityLine(a);
  return line ? (
    <p className="bk-card__open">
      <span className="bk-long">{line}</span>
      {short && <span className="bk-short">{short}</span>}
    </p>
  ) : null;
}

/* The next open days with each counsellor, inside the calendar box, before
   the frame exists. Nothing while the answer is on its way; once it is in,
   either the days or the ask-for-a-time sentence (2 Oct 2026). */
function NextOpen({ all, people }: { all: ClientAvailability | null; people: BookPerson[] }) {
  if (!all) return null;
  const lines = people
    .filter((p) => p.clinikoPractitionerId)
    .map((p) => ({ first: p.name.split(' ')[0], a: bookSummary(all, p.slug) }))
    .filter(({ a }) => a && !a.error && (a.next?.length ?? 0) > 0);
  if (!lines.length) {
    return (
      <p style={P_NEXT}>
        Times are on the calendar below; if none suit,{' '}
        <BookLink location="next-consult-ask" className="" href="#ask-for-a-time">ask for a time</BookLink>{' '}
        by email or with the form under it.
      </p>
    );
  }
  return (
    <>
      {lines.map(({ first, a }) => (
        <p key={first} style={P_NEXT}>
          <strong>Next open with {first}{PACIFIC}:</strong> {a!.next.join(' · ')}
        </p>
      ))}
    </>
  );
}

export default function BookChoice({
  data, breadcrumbs, punjabiLine, measured, firstSession, children,
}: {
  data: BookData;
  /** Server-rendered pieces that do not change with the address. */
  breadcrumbs: ReactNode;
  punjabiLine: ReactNode;
  measured: ReactNode;
  firstSession: ReactNode;
  /** The "Before you decide" disclosures. */
  children: ReactNode;
}) {
  const [query, setQuery] = useState<string | null>(null);
  const ready = query !== null;
  const all = useAvailability();
  const params = new URLSearchParams(query ?? '');

  const { accepting } = data;
  /* The enquiry form posts to /api/enquiry, which sends the person back to
     the page the form was on with ?sent=ok or ?sent=err. */
  const sentRaw = params.get('sent');
  const sent = sentRaw === 'ok' ? 'ok' : sentRaw === 'err' ? 'err' : undefined;

  /* WHO THE READER CAME FOR — ?with=<slug>. With no ?with= the page is the
     whole practice; a slug that is not on the roster is ignored. */
  const withSlug = params.get('with') ?? '';
  const asked = withSlug && (accepting.some((p) => p.slug === withSlug) || data.others.includes(withSlug))
    ? { slug: withSlug } : undefined;
  /* Nobody who is not accepting is booked here (6 Sep 2026): an old link
     that names one gets the choice and one line saying so. */
  const who = asked ? accepting.find((p) => p.slug === asked.slug) : undefined;
  const askedButFull = asked && !who ? asked : undefined;

  /* A COUPLES CONSULTATION — ?for=couples, honoured only with a counsellor
     who offers couples work (1 Oct 2026, wf/book-and-cta). */
  const couples = params.get('for') === 'couples' && !!who && who.couples;
  const fees = couples ? who!.feesCouples : who ? who.fees : data.bare.fees;
  const lengths = couples ? who!.lengthsCouples : who ? who.lengths : data.bare.lengths;

  /* The Punjabi line moves under the heading when the chosen counsellor can
     be booked in Punjabi; on bare /book it stays in the notes. */
  const paFirst = !!who && who.bookable && who.languages.some((l) => l.tag === 'pa');

  /* Not on the online calendar: a request instead of a calendar. */
  const schedulable = !who || who.bookable;
  const provinceList = who ? who.area : data.bare.provinceList;
  const canadaWide = who ? who.reach === 'canada' : data.bare.canadaWide;
  const languageList = who ? who.languages.map((l) => l.name).join(' or ') : site.languages;
  const people = who ? [who] : accepting;

  const at = ready ? Date.now() : data.builtAt;
  const now = new Date(at);

  /* After the variant has replaced the bare page, put the reader back at
     the anchor they arrived for. #calendar is SchedulerGate's own (it opens
     and scrolls when it mounts); #form and #ask-for-a-time are done here. */
  useEffect(() => {
    if (!ready || !query) return;
    const hash = window.location.hash;
    if (!hash || hash === '#calendar') return;
    window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
  }, [ready, query]);

  return (
    <>
      <Suspense fallback={null}>
        <QueryProbe onQuery={setQuery} />
      </Suspense>
      {/* Counts the arrival, once per session (3 Oct 2026), once the
          address has been read. */}
      {ready && <BookArrive detail={arriveDetailFor(asked?.slug)} />}

      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <p className="eyebrow">Free · 15 minutes · No commitment</p>
          <h1 style={{ marginBottom: 10 }}>
            Book a free {couples ? 'couples ' : ''}consultation{who ? ` with ${who.name.split(' ')[0]}` : accepting.length > 1 ? ` with ${accepting.map((p) => p.name.split(' ')[0]).join(' or ')}` : ''}.
          </h1>
          <p className="lede" style={{ marginBottom: 0 }}>
            A short conversation over secure video to work out whether this is a fit. Nothing is
            diagnosed, and there is no obligation to book a session afterwards.
            {who && who.languages.length > 1 && (
              <> {who.name.split(' ')[0]} speaks {who.languages.map((l) => l.name).join(' and ')}.</>
            )}
          </p>
          {paFirst && <p style={{ margin: '10px 0 0' }}>{punjabiLine}</p>}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          {breadcrumbs}

          {/* Five paragraphs became five facts (3 Sep 2026). */}
          <ul className="book-facts">
            <li>15 minutes</li>
            <li>Online only · secure video</li>
            <li>No card</li>
            <li>No intake form</li>
            {/* Not the 24-hour cancellation chip (1 Oct 2026): under a free,
                no-card call that implied a later cancellation costs something.
                The 24-hour rule is for paid sessions, on /pricing. */}
            <li>No charge to move or cancel it</li>
          </ul>

          {/* WHAT THE 15 MINUTES ARE — in view, not behind a disclosure (1 Oct 2026). */}
          <ul className="book-what">
            <li>
              <strong>Who you talk to.</strong>{' '}
              {who
                ? `${who.name.split(' ')[0]} directly — the counsellor you would see, not an intake worker.`
                : `${accepting.map((p) => p.name.split(' ')[0]).join(' or ')} directly — the counsellor you would see, not an intake worker.`}{' '}
              {/* What the letters mean, once, in plain words (lib/site.ts). */}
              Registered Clinical Counsellor means {data.rccPlain}.
            </li>
            <li>
              <strong>What is asked.</strong> What brought {couples ? 'the two of you' : 'you'} here, in
              your own words. No form, and no history to assemble.
            </li>
            <li>
              <strong>What it costs.</strong> Nothing is charged and no card is taken. You decide
              afterwards, in your own time.
              <FeesText phrase={fees} />
              {/* 15 Oct to 31 Dec only, on the Pacific date (lib/seasonal.ts). */}
              {planYearPageLineShown(now) && (
                <>
                  {' '}If your plan runs on the calendar year, a session held on or before 31 December
                  counts against this year&rsquo;s maximum; whether yours does is in your plan
                  booklet; <Link href={YEAR_END_PATH}>how the plan year affects a claim</Link>.
                </>
              )}
              {/* 1 Jan to 15 Feb only, the January counterpart (item 513). */}
              {planResetPageLineShown(now) && (
                <>
                  {' '}{PLAN_RESET_LINE}{' '}
                  <Link href={YEAR_END_PATH}>What resets on 1 January, and what does not</Link>.
                </>
              )}
            </li>
          </ul>

          {/* ?with= HAS ALREADY CHOSEN — 1 Oct 2026. One row instead of the
              two cards, with the way back to the choice. */}
          {accepting.length > 1 && who && (
            <div
              className="card"
              style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0 12px', padding: '10px 14px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              {who.img && <img {...who.img.row} />}
              <div>
                <p style={{ margin: 0, fontSize: '.95rem', lineHeight: 1.45 }}>
                  <strong>Booking with {who.letters}</strong> · {who.languages.map((l) => l.name).join(' and ')}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '.88rem', lineHeight: 1.45, color: 'var(--ink-soft)' }}>
                  {accepting.filter((p) => p.slug !== who.slug).map((p) => (
                    <span key={p.slug}>
                      <Link href={`${site.bookingPath}?with=${p.slug}#calendar`}>
                        Switch to {p.name.split(' ')[0]}
                      </Link>
                      {' · '}
                    </span>
                  ))}
                  <Link href={site.bookingPath}>See both calendars</Link>
                </p>
              </div>
            </div>
          )}

          {accepting.length > 1 && !who && (
            <div className="book-choose" style={{ margin: '18px 0 14px' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: '1.45rem' }}>Who would you like to talk to?</h2>
              <div className="grid grid-2" style={{ gap: 14 }}>
                {accepting.map((p) => {
                  const first = p.name.split(' ')[0]!;
                  return (
                    /* NAMED BY ITS BUTTON, NOT BY ITS WHOLE TEXT — 1 Oct 2026. */
                    <Link
                      key={p.slug}
                      href={`${site.bookingPath}?with=${p.slug}#calendar`}
                      className="card bk-card"
                      aria-labelledby={`bk-${p.slug}-name`}
                      aria-describedby={`bk-${p.slug}-meta bk-${p.slug}-focus bk-${p.slug}-open`}
                    >
                      {/* A small portrait beside the name; decorative, the name says who. */}
                      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                      {p.img && <img {...p.img.card} />}
                      <div>
                        <h3>{p.letters}</h3>
                        <p className="bk-card__meta" id={`bk-${p.slug}-meta`}>
                          {p.languages.map((l) => l.name).join(' and ')} · {p.cardArea}
                        </p>
                      </div>
                      <p className="bk-card__focus" id={`bk-${p.slug}-focus`}>
                        {p.focus}
                      </p>
                      <div className="book-card-avail" id={`bk-${p.slug}-open`}>
                        <CardAvailability all={all} slug={p.slug} first={first} />
                      </div>
                      <span className="btn btn--primary bk-card__btn" id={`bk-${p.slug}-name`}>
                        Book with {first}
                      </span>
                    </Link>
                  );
                })}
              </div>
              {/* One secondary "first session" row per card, behind
                  site.directFirstSession (off; lib/first-session.ts). */}
              {firstSession}
              <p style={{ margin: '12px 0 0', fontSize: '.92rem', color: 'var(--ink-soft)' }}>
                Or pick a time below and choose the counsellor on the calendar itself.
              </p>
            </div>
          )}

          {/* Names nobody who is not accepting (item 361, lib/practice-facts.ts). */}
          {askedButFull && <p className="book-credential">{data.notTaking}</p>}

          {who && !schedulable ? (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Request a consultation with {who.name.split(' ')[0]}</h2>
              <p>
                {who.name.split(' ')[0]} is not on the online calendar yet, so this one is arranged
                by reply rather than by picking a slot. Leave your name and email, say in a couple
                of sentences what you are looking for and roughly when you are free, and you will
                hear back within one business day to fix a time.
              </p>
              <p>
                {who.letters}, anywhere in {provinceList}.{' '}
                <strong>{who.name.split(' ')[0]} works in {languageList}</strong>
                {who.languages.length > 1
                  ? ', so the consultation and your sessions can be in either, or move between the two.'
                  : '.'}{' '}
                <Link href={`/practitioners/${who.slug}`}>More about {who.name.split(' ')[0]}</Link>.
              </p>
              <InboundForm
                kind="enquiry"
                done={sent}
                practitioner={who.slug}
                title="Request your free consultation"
                note={`Tell ${who.name.split(' ')[0]} in at least two sentences what you are looking for, and roughly when you are free. You will hear back within one business day to fix a time.`}
                placeholder="What is going on for you, what you are hoping for from counselling, and when you are usually free."
                button="Request a consultation"
              />
            </div>
          ) : site.bookingReady ? (
            <>
              {/* The credentials at the moment of commitment: placement, not new claims. */}
              {who ? (
                <p className="book-credential">
                  <strong>{who.letters}</strong>
                  {who.credentials.map((c) => (
                    <span key={c.short}>
                      {' '}· {c.full}
                      {c.verifyUrl && (
                        <>
                          {' '}(<a href={c.verifyUrl} target="_blank" rel="noopener">verify on the {c.short === 'CCC' ? 'CCPA directory' : 'BCACC register'}<span className="sr-only"> (opens in a new tab)</span></a>)
                        </>
                      )}
                    </span>
                  ))}
                  {' '}· works in {who.languages.map((l) => l.name).join(' and ')}
                </p>
              ) : (
                <p className="book-credential">
                  <strong>Registered Clinical Counsellors</strong> ·{' '}
                  <a href={site.counsellor.registerUrl} target="_blank" rel="noopener">
                    check the BCACC register<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              )}
              {/* HER calendar, not the practice's (bookingsUrlFor adds ?practitioner_id=). */}
              <div id="calendar" style={{ margin: '26px 0 12px', scrollMarginTop: 72 }}>
                <p className="eyebrow" style={{ margin: 0 }}>Free 15-minute consultation</p>
                <h2 style={{ margin: '2px 0 0', fontSize: '1.7rem', lineHeight: 1.15 }}>
                  {who
                    ? <>You are booking {couples ? 'a couples consultation ' : ''}with {who.letters}</>
                    : <>Pick a time, then choose {accepting.map((p) => p.name.split(' ')[0]).join(' or ')} on the calendar</>}
                </h2>
                {/* ONLINE ONLY, SAID WHERE THE ADDRESS APPEARS — 1 Oct 2026. */}
                <p style={{ margin: '8px 0 0', fontSize: '.92rem', lineHeight: 1.55, color: 'var(--ink-soft)' }}>
                  Every session, this one included, is by secure video from wherever you are. There
                  is nowhere to attend, whatever address the booking summary shows.
                </p>
                {couples && (
                  <p style={{ margin: '8px 0 0', fontSize: '.95rem', lineHeight: 1.55 }}>
                    <strong>For the two of you:</strong> one of you picks the time, and both partners
                    can join the free 15-minute consultation.
                  </p>
                )}
              </div>
              {/* The next open times and a first-party link before the frame
                  (17 Sep 2026); the frame waits to be asked for (1 Oct 2026,
                  components/SchedulerGate). */}
              <SchedulerEmbedView
                pending={!ready}
                embedParam={data.embedParam}
                url={who ? who.bookingsUrl : data.bare.bookingsUrl}
                title={`Book a free 15-minute consultation${who ? ` with ${who.name.split(' ')[0]}` : ''}`}
                page="/book"
                who={who?.slug}
                first={who?.name.split(' ')[0]}
                openDetail={couples ? 'couples' : undefined}
                cta="Show available times"
                placeholder={
                  <>
                    <div className="scheduler-wait__who">
                      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                      {people.map((p) => p.img && <img key={p.slug} {...p.img.wait} />)}
                      <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3 }}>
                        {who
                          ? <>Pick a time with {who.name.split(' ')[0]}</>
                          : <>Pick a time with {accepting.map((p) => p.name.split(' ')[0]).join(' or ')}</>}
                      </p>
                    </div>
                    {/* One reserved block per counsellor shown; --next-lines is
                        set per breakpoint in app/premium.css. */}
                    <div
                      className="scheduler-wait__next"
                      style={{ minHeight: `calc(${people.filter((p) => p.clinikoPractitionerId).length} * (var(--next-lines) * 1.5em + 6px))` }}
                    >
                      <NextOpen all={all} people={people} />
                    </div>
                  </>
                }
                secondary={
                  <>
                    {people.map((p) => p.clinikoPractitionerId && (
                      <BookDirectLink
                        key={p.slug}
                        className="btn btn--ghost"
                        href={p.bookingsUrl}
                        who={p.slug}
                      >
                        Open {p.name.split(' ')[0]}&rsquo;s calendar in a new tab
                      </BookDirectLink>
                    ))}
                    <p style={{ margin: '6px 0 0', fontSize: '.85rem', color: 'var(--ink-soft)' }}>
                      The calendar opens here. If it does not load on your phone, the link above always will.
                    </p>
                    {/* A ROUTE THAT IS NOT THE CALENDAR — 1 Oct 2026. Email
                        first, as everywhere on the site; the form second. */}
                    <p style={{ margin: '4px 0 0', fontSize: '.85rem', color: 'var(--ink-soft)' }}>
                      Calendar hard to use with your screen reader or device?{' '}
                      <MailLink where="book-fallback" subject="Free 15-minute consultation" showAddress>
                        Ask for a consultation time by email
                      </MailLink>{' '}
                      instead, or <BookLink location="calendar-alt" className="" href="#ask-for-a-time">use the form below</BookLink>.
                    </p>
                  </>
                }
              />
              {/* WHICH CLOCK — 1 Oct 2026. The Alberta half shows only while
                  someone accepting is insured there today; a label on
                  Cliniko's times, not hours. */}
              <p style={{ margin: '4px 0 0', fontSize: '.85rem', lineHeight: 1.5, color: 'var(--ink-soft)' }}>
                {timeZoneNote(people.flatMap((p) => p.insured), at)}
              </p>
              {/* THE PEOPLE THE CALENDAR LOSES — 18 Sep 2026. */}
              <div className="crisis" id="ask-for-a-time" style={{ marginTop: 26, scrollMarginTop: 72 }}>
                <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>None of these times work?</h2>
                <p style={{ margin: '0 0 12px' }}>
                  Say when you are usually free and {who ? who.name.split(' ')[0] : 'the counsellor you choose'} will
                  reply within one business day with the closest time she can offer.
                  {measured}
                </p>
                <InboundForm
                  kind="enquiry"
                  done={sent}
                  practitioner={who?.slug}
                  title="Ask for a time"
                  note="Two or three sentences: when you are usually free, and what you are looking for. You will hear back within one business day."
                  placeholder="Which days and times usually suit you, then a sentence or two on what you are looking for."
                  button="Ask for a time"
                />
              </div>
            </>
          ) : (
            <div className="crisis" style={{ marginTop: 8 }}>
              <h2 style={{ marginTop: 0 }}>Online scheduling is being set up</h2>
              <p>
                The booking calendar goes live here shortly. In the meantime, email{' '}
                <MailLink where="book-fallback" /> with a sentence about what
                you&rsquo;re looking for and a couple of times that suit you, and your consultation
                will be confirmed by reply.
              </p>
              <div className="btn-row" style={{ marginTop: 22 }}>
                <MailLink where="book-fallback" className="btn btn--primary" subject="Free 15-minute consultation" showAddress>
                  Email to book your consultation
                </MailLink>
                <a className="btn btn--ghost" href={site.bookingsFallbackUrl} target="_blank" rel="noopener">
                  Try the booking page directly<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          )}

          {/* WHERE THE CLIENT IS SITTING DECIDES WHICH PROVINCE THE SESSION
              HAPPENS IN. Under the calendar: a correction for the minority. */}
          <div className="book-notes">
            <p>
              <strong>
                Sessions {who ? `with ${who.name.split(' ')[0]} ` : ''}are for people located {who?.reach === 'canada' ? '' : 'in '}{provinceList}.
              </strong>{' '}
              A session counts as happening where you are sitting, so this is a registration and
              insurance boundary rather than a preference.
              {!canadaWide && (
                <> If you are elsewhere in Canada, say so on the call and you will be pointed toward
                someone who can properly see you.</>
              )}
            </p>

            {/* The reviewed /punjabi sentence, only where the consultation
                can actually be in Punjabi. Nothing here is newly composed. */}
            {(!who || who.languages.some((l) => l.tag === 'pa')) && !paFirst && <p>{punjabiLine}</p>}
            {who && !who.languages.some((l) => l.tag === 'pa') && (
              <p>
                <strong>The consultation can be in {languageList}</strong>, including moving between
                them, which is what most bilingual people end up doing.
              </p>
            )}

            <p>
              <strong>After you book,</strong> a confirmation email arrives with the video link.
              Nothing to install, and a phone, tablet or computer works. {data.cameraOptional} No diagnosis, referral or
              decision on the spot is needed.{' '}
              <Link href="/resources/before-your-first-consultation">More on the call itself</Link>.
            </p>
          </div>

          {/* No hours here at all (6 Sep 2026): the calendar shows what is
              open, and the request form asks when the person is free. */}

          {/* Always open, never behind a disclosure. */}
          <div className="crisis" style={{ marginTop: 28 }}>
            <p style={{ margin: 0 }}>
              <strong>If you are in crisis:</strong> this is not a crisis service. Call or text{' '}
              <a href="tel:988"><strong>9-8-8</strong></a> (Canada, 24/7) or BC Mental Health at{' '}
              <a href="tel:3106789"><strong>310-6789</strong></a>. In immediate danger, call{' '}
              <a href="tel:911"><strong>911</strong></a>.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container container--article">
          {children}

          <ul className="checklist" style={{ marginTop: 26 }}>
            <li>Sessions are fully online, anywhere in {provinceList}</li>
            <li>Available in {languageList}</li>
            {lengths && <li>{lengths}</li>}
            <li>Fees and payment are on the <Link href="/pricing">fees page</Link></li>
            <li>Many extended health plans reimburse an RCC, depending on the plan; <Link href="/resources/does-my-plan-cover-counselling-bc">check yours</Link></li>
          </ul>

          <p style={{ marginTop: 18 }}>
            Would rather read first? The <Link href="/faq">FAQ</Link> covers fees and
            confidentiality, <Link href="/services">services</Link> covers the approaches, and{' '}
            {/* Her own profile, not /about (1 Oct 2026, wf/book-and-cta). */}
            {who
              ? <Link href={`/practitioners/${who.slug}`}>about {who.name.split(' ')[0]}</Link>
              : <Link href="/practitioners">the counsellors&rsquo; profiles</Link>}{' '}
            {who ? 'covers' : 'cover'} who you would be speaking to.
            To ask something before booking anything, the <Link href="/contact">contact page</Link>{' '}
            gets a reply within one business day.
          </p>
        </div>
      </section>
    </>
  );
}

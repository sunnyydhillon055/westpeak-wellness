import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import CtaBand from '@/components/CtaBand';
import SceneBand from '@/components/SceneBand';
import { Wallet, Video, CreditCard, CalendarX } from 'lucide-react';
import Figure from '@/components/Figure';
import LeadCapture from '@/components/LeadCapture';
import LeadCaptureFromQuery from '@/components/LeadCaptureFromQuery';
import { Suspense } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { readCatalog, money, type CatalogItem } from '@/lib/cliniko-catalog';
import { webPage } from '@/lib/schema';
import { ogBase } from '@/lib/og-meta';
import { lastmodFor } from '@/lib/page-dates';
import { HOW_TO_CANCEL } from '@/lib/faq';
import { counsellorsFor, languagesOf, listOf } from '@/lib/city-service-page';
import { HeroNextDays } from '@/components/NextConsultLine';
import { consultPeople, heroBookingCta } from '@/lib/booking-cta';
import { SESSION_SECURITY, SESSION_SECURITY_MD } from '@/lib/policies';
import { rich } from '@/lib/rich';
import { practiceSnippet, withSnippet } from '@/lib/snippet-facts';
import { planYearPageLineShown, YEAR_END_PATH } from '@/lib/seasonal';
import { WHO_SEES_A_CLAIM } from '@/lib/practice-facts';
import {
  BCACC_INDIVIDUAL, BCACC_COUPLES_FAMILY, BCPA_PSYCHOLOGIST, BCPA_EFFECTIVE,
  TYPICAL_BC_FEES, FEE_GUIDES_READ, guidePhrase,
} from '@/lib/fee-guides';

/* The fee and who you would see, in the description — 1 Oct 2026. /pricing
   sat at 4.38 with 24 impressions and no clicks, and its description named
   no fee. The lead's first sentence carries the result when the generated
   facts are appended (lib/snippet-facts.ts); the fee is the catalogue's. */
export async function generateMetadata(): Promise<Metadata> {
  const lead =
    'Every counselling fee in full, in line with BCACC guidelines. What extended health usually reimburses, and what the free consultation covers.';
  const description = withSnippet(
    lead,
    practiceSnippet(await readCatalog(), counsellorsFor({ bookingService: 'individual-therapy' })),
  );
  return {
    /* Retitled 17 Sep 2026 from "Fees & Insurance", which matched none of the
       cost queries in Search Console — every one of them is phrased as a
       question about what it costs. */
    /* 1 Oct 2026: "therapy" and the year, as the cited answers to this
       question are titled (was "How Much Does Counselling Cost in BC?",
       24 impressions at 4.38 on 26 Sep). Absolute, because the brand
       suffix would take it past the 60-character gate; the tool page gave
       this query up the same day and is titled for the calculator. */
    title: { absolute: 'How Much Does Therapy Cost in BC? 2026 Counselling Fees' },
    description,
    alternates: { canonical: `${site.domain}/pricing` },
    /* Its own og:url since 3 Oct 2026: as a static page the metadata audit
       reads it, and the inherited card pointed at the home page. */
    openGraph: { ...ogBase('/pricing'), title: 'How Much Does Therapy Cost in BC? 2026 Counselling Fees', description },
  };
}

/* FULLY STATIC — 3 Oct 2026 (item 429). This page exported `revalidate`
   for the catalogue fee and the next-consultation line. A page Next
   re-renders in production goes out without the inlined first-paint CSS
   (scripts/inline-css.mjs only sees the build), and production served these
   templates with blocking stylesheet links. The fee is now a build-time fact
   (a price change in Cliniko reaches the page with the next deploy) and the
   next consultation is filled in by the browser (components/NextConsultSlot.tsx).
   `inline-css --check` fails if an indexable route exports revalidate again. */

/* Display order and labels. Cliniko returns types in its own order with its own
 * names, and the fee table has always read "Individual" rather than "Individual
 * Counselling". Mapping here keeps the copy while the numbers come from
 * Cliniko — the numbers are what must never drift, not the wording. */
const ROWS: { clinikoName: string; label: string; highlight?: boolean }[] = [
  { clinikoName: 'Initial Consultation', label: 'Free initial consult' },
  { clinikoName: 'Individual Counselling', label: 'Individual', highlight: true },
  { clinikoName: 'Couples Counselling', label: 'Couples' },
  { clinikoName: 'Couples Extended', label: 'Couples extended' },
  { clinikoName: 'EMDR Intensive', label: 'EMDR intensive' },
];

/* THE MARKET FIGURES — BCACC's fee guide and BCPA's recommended rate — live in
 * lib/fee-guides.ts since 1 Oct 2026, read on the date stated there, with the
 * comparison page, the couples page and the city-service cost FAQ reading the
 * same constant. They are the associations' recommendations, not this
 * practice's prices: those still come only from the Cliniko catalogue. */

/* The first-screen price list's styles, inline rather than in premium.css:
   that file is inlined into every page, and the homepage CSS budget
   (data/perf-budget.json) has no room for rules only /pricing uses. */
const GLANCE = {
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, margin: '18px 0 0', maxWidth: '42.9em' },
  item: { background: 'var(--surface-0)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: '8px 12px' },
  term: { fontSize: 'var(--fs-small)', color: 'var(--ink-soft)' },
  value: { margin: 0, color: 'var(--ink)', fontWeight: 580 },
} as const;

export default async function Pricing() {
  const catalog = await readCatalog();
  const find = (n: string): CatalogItem | undefined =>
    catalog.items.find((i) => i.name.toLowerCase() === n.toLowerCase());

  /* The practice's own numbers for the answer below, from the catalogue. */
  const ind = find('Individual Counselling');
  const cpl = find('Couples Counselling');
  const consult = find('Initial Consultation');
  const ours = [
    ind ? `an individual session is ${money(ind.cents)} for ${ind.minutes} minutes` : null,
    cpl ? `a couples session is ${money(cpl.cents)} for ${cpl.minutes} minutes` : null,
  ].filter(Boolean).join(' and ');
  const costAnswer =
    `The BC Association of Clinical Counsellors' 2026 fee guide recommends ${BCACC_INDIVIDUAL.range} per 50 minutes for individual counselling with a Registered Clinical Counsellor, depending on experience, with a higher range for specialised services, and ${BCACC_COUPLES_FAMILY.range} per 50 minutes for couples and family counselling.` +
    (ours ? ` At Westpeak Wellness ${ours}.` : '') +
    (consult && consult.cents === 0 ? ` The first ${consult.minutes}-minute consultation is free.` : '') +
    ' MSP does not cover counselling with an RCC; many extended health plans reimburse it, depending on the plan.';

  /* The first-screen summary: the four paid types, then the free consult. */
  const glance = [
    ...ROWS.filter((r) => r.clinikoName !== 'Initial Consultation').map((r) => {
      const item = find(r.clinikoName);
      return item ? { label: r.label, value: `${money(item.cents)} · ${item.minutes} min` } : null;
    }),
    consult && consult.cents === 0
      ? { label: 'First consultation', value: `Free · ${consult.minutes} min` }
      : null,
  ].filter((g): g is { label: string; value: string } => g !== null);

  /* THE HEADING ANSWERS THE QUESTION — 1 Oct 2026.
   * "Clear, fair, accessible." answered nothing; 17 of September's 60 leads
   * came from this page against one book_click, and at 375px the first /book
   * link sat at y=846 with neither counsellor named. The heading now states
   * the individual fee and the free consultation, both from the catalogue,
   * and the lede names who you would pay: every counsellor accepting
   * individual clients in BC, with her languages, from the roster. The
   * accepting flag keeps anyone not taking new clients off this page. */
  const h1 =
    ind && ind.cents > 0
      ? `Counselling fees: ${money(ind.cents)} a session${consult && consult.cents === 0 ? `, and the first ${consult.minutes} minutes are free` : ''}`
      : 'Counselling fees and insurance';
  const accepting = counsellorsFor({ bookingService: 'individual-therapy' });
  /* Who the day list under the hero button may name, and, when that is one
     counsellor, the button names her (item 409, 3 Oct 2026). */
  const heroPeople = consultPeople({ slugs: accepting.map((p) => p.slug) });
  const heroCta = heroBookingCta({ href: site.bookingPath, label: 'Book a Free Consultation' }, heroPeople);
  const whoLede = accepting.length
    ? `Sessions are with ${listOf(accepting.map((p) => `${p.name} (${listOf(languagesOf(p), 'and')})`), 'or')}, ${accepting.length > 1 ? 'Registered Clinical Counsellors who see' : 'a Registered Clinical Counsellor who sees'} people by secure video anywhere in BC. No hidden fees, no packages.`
    : 'Every fee in full, with no hidden fees and no packages.';

  /* How far the same annual maximum goes here, against BCPA's rate. */
  const psychRatio = ind && ind.cents > 0 ? ((BCPA_PSYCHOLOGIST.highCents ?? 0) / ind.cents).toFixed(1) : null;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 48 }}>
        <div className="container">
          <p className="eyebrow">Fees & insurance</p>
          <h1>{h1}</h1>
          <p className="lede">{whoLede}</p>
          <p className="direct-answer">
            Individual sessions, couples sessions and EMDR intensives are each priced per session, paid by card at booking, with 24 hours&rsquo; free cancellation. The first 30-minute consultation is free. Many extended health plans reimburse a Registered Clinical Counsellor, depending on the plan, so check yours; MSP does not cover private counselling.
          </p>
          {/* PRICES IN THE PHONE'S FIRST SCREEN — 1 Oct 2026. At 390px the first
              amount on this page sat below the fold, under an answer that names
              no amount. Read from the same catalogue as the table below, so
              nothing here is typed and price-drift has nothing to catch. */}
          {glance.length > 0 && (
            <dl className="price-glance" style={GLANCE.list}>
              {glance.map((g) => (
                <div key={g.label} style={GLANCE.item}>
                  <dt style={GLANCE.term}>{g.label}</dt>
                  <dd style={GLANCE.value}>{g.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p style={{ margin: '22px 0 0', maxWidth: '42.9em' }}>
            <strong>Next step:</strong> a free 30-minute video call. No card is taken for it; you
            pay only if you book a session afterwards.
          </p>
          <div className="btn-row" style={{ marginTop: 14 }}>
            <Link className="btn btn--primary" href={heroCta.href}>{heroCta.label}</Link>
            <Link className="btn btn--ghost" href="/resources/bc-extended-health-coverage-for-counselling">Check your coverage</Link>
          </div>
          {/* The next free day with each counsellor taking new clients, from
              the Cliniko cache, filled in by the browser; nothing when there
              is none. A sentence counted as 'next-pricing' from 1 Oct 2026,
              the home hero's day list counted as 'hero-next-article' from
              3 Oct (item 409). */}
          <HeroNextDays people={heroPeople} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Breadcrumbs trail={[{ name: 'Fees', path: '/pricing' }]} />
          <h2>Session fees</h2>
          <table className="fee-table">
            <thead><tr><th>Session</th><th>Length</th><th>Fee (CAD)</th></tr></thead>
            <tbody>
              {ROWS.map((r) => {
                const item = find(r.clinikoName);
                /* A row whose Cliniko type has vanished is dropped rather than
                   rendered with a guess. Showing a stale fee is the failure
                   this whole change exists to prevent. */
                if (!item) return null;
                return (
                  <tr key={r.clinikoName} className={r.highlight ? 'fee-highlight' : undefined}>
                    <td>{r.label}</td>
                    <td>{item.minutes} min</td>
                    <td>{money(item.cents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>GST does not apply to RCC counselling in BC.</p>
          {/* 15 Oct to 31 Dec only, on the Pacific date (lib/seasonal.ts); this page re-renders hourly. */}
          {planYearPageLineShown() && (
            <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)' }}>
              If your plan runs on the calendar year, a session held on or before 31 December counts against this year&rsquo;s maximum; whether yours does is in your plan booklet; <Link href={YEAR_END_PATH}>how the plan year affects a claim</Link>.
            </p>
          )}

          <div className="prose" style={{ marginTop: 36 }}>
            <h2>How much does a counsellor cost in BC?</h2>
            <p>{costAnswer}</p>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
              Source:{' '}
              <a href={BCACC_INDIVIDUAL.sourceUrl} rel="noreferrer">BCACC Fee Guide 2026</a>, read{' '}
              {FEE_GUIDES_READ}. The ranges are the association&rsquo;s recommendations, not
              this practice&rsquo;s prices.
            </p>

            {/* THE DATED MARKET TABLE — 1 Oct 2026. The pages cited for "how
                much does therapy cost in BC" lead with a range by who you
                see; this page gave one sentence. Every association figure is
                lib/fee-guides.ts; this practice's row is the catalogue. */}
            <h2 id="typical-fees">What a 50-minute session costs in BC, by who you see (read {FEE_GUIDES_READ})</h2>
            <table className="fee-table">
              <thead><tr><th>Who you see</th><th>Typical fee</th><th>Whose figure</th></tr></thead>
              <tbody>
                {TYPICAL_BC_FEES.map((g) => (
                  <tr key={g.label}>
                    <td>{g.label}</td>
                    <td>{guidePhrase(g)}{g.note ? <><br /><span style={{ fontSize: '.92rem', color: 'var(--ink-soft)' }}>{g.note}</span></> : null}</td>
                    <td>{g.sourceUrl ? <a href={g.sourceUrl} rel="noreferrer">{g.source}</a> : g.source}</td>
                  </tr>
                ))}
                {ind && (
                  <tr className="fee-highlight">
                    <td>This practice (Registered Clinical Counsellors)</td>
                    <td>
                      {money(ind.cents)} individual{cpl ? `, ${money(cpl.cents)} couples` : ''}, per {ind.minutes}-minute session
                    </td>
                    <td>This practice&rsquo;s fee table, above</td>
                  </tr>
                )}
              </tbody>
            </table>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
              The association figures are recommendations, read on {FEE_GUIDES_READ}; practitioners set
              their own fees. A psychologist&rsquo;s rate is published per hour rather than per 50
              minutes. What you pay after reimbursement depends on the plan.
            </p>

            <h2>What you are actually paying for</h2>
            <div className="fee-callout">
              <Wallet aria-hidden="true" strokeWidth={1.7} />
              <div>
            <p>
              A 50-minute session is not 50 minutes of work. It includes preparation before, notes and
              planning after, ongoing continuing education, professional liability insurance, and the
              supervision and registration requirements that come with holding the{' '}
              <Link href="/compare/rcc-vs-psychologist-vs-social-worker-bc">Registered Clinical Counsellor designation</Link>.
              These fees sit within the range the BC Association of Clinical Counsellors publishes as
              guidance, and they are in line with what most RCCs across the province charge.
            </p>
            <p>
              For comparison, the BC Psychological Association&rsquo;s recommended rate for a
              registered psychologist is {BCPA_PSYCHOLOGIST.range} an hour (effective {BCPA_EFFECTIVE}),
              reflecting a longer training path and a broader scope that includes formal assessment.
              {ind && psychRatio
                ? ` An individual session here is ${money(ind.cents)}, so the same annual maximum buys about ${psychRatio} times as many sessions, which matters most if your benefit cap is limited.`
                : ''}
            </p>
            <p style={{ fontSize: '.92rem', color: 'var(--ink-faint)' }}>
              Source:{' '}
              <a href={BCPA_PSYCHOLOGIST.sourceUrl} rel="noreferrer">BCPA Recommended Rate 2025&ndash;2026</a>, read{' '}
              {FEE_GUIDES_READ}. A guideline, not a fee schedule; psychologists set their own fees.
            </p>

              </div>
            </div>
            <h2>If the fee is a barrier</h2>
            <p>
              Private therapy is not the only route, and it is not always the right first one. BC has a
              substantial amount of free and low-cost support that people frequently do not know about:
              health authority mental-health services, Foundry for anyone under 25, Here2Talk for
              post-secondary students, employee assistance programs through work, and university training
              clinics offering supervised sessions at reduced rates.
            </p>
            <p>
              All of that is set out on the{' '}
              <Link href="/resources/low-cost-counselling-bc">free and low-cost counselling page</Link>,
              and for a lot of people one of those options is genuinely the better place to start. Saying
              so on a{' '}
              <Link href={site.bookingPath}>free 30-minute consultation</Link> is a perfectly good outcome
              of that call.
            </p>

            <h2>Where to read next</h2>
            <p>
              If you are weighing whether this is affordable at all,{' '}
              <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> and{' '}
              <Link href="/compare/efap-vs-private-counselling">EFAP vs private counselling</Link>{' '}
              are the two worth reading first, because a great many people already hold a free
              entitlement they have never used. If you are on a public waitlist,{' '}
              <Link href="/guides/waiting-for-therapy-in-bc">what to do while you wait</Link> covers
              the interval.
            </p>
            <p>
              On what the money buys: <Link href="/about">about the practice</Link> sets out the
              training behind a session, <Link href="/standards">standards and accountability</Link>{' '}
              states the scope limits and the complaints route, and{' '}
              <Link href="/resources/verify-a-counsellor-in-bc">how to verify a registration</Link>{' '}
              takes about four minutes and is worth doing before paying anyone, here included.
            </p>
            <p>
              On frequency and length. The two things that actually determine total cost, {' '}
              <Link href="/compare/weekly-vs-biweekly-sessions">weekly vs biweekly sessions</Link>{' '}
              and <Link href="/guides/how-long-does-therapy-take">how long therapy takes</Link>{' '}
              are more useful than the per-session number on its own. And if what you need is a
              formal assessment rather than counselling,{' '}
              <Link href="/resources/psychiatry-and-assessment-in-bc">psychiatry and assessment in BC</Link>{' '}
              explains why that is priced completely differently.
            </p>
            <p>
              Some of this is covered without you paying the fee at all. ICBC pre-approves twelve
              counselling sessions after a crash with no doctor&rsquo;s note.{' '}
              {site.icbcVendor
                ? 'This practice is registered with ICBC.'
                : 'This practice is not currently registered with ICBC and does not direct-bill; the entitlement can be used with a registered vendor.'}{' '}
              Pacific Blue Cross accepts direct claims from Registered Clinical Counsellors, but this
              practice is pay-and-submit: you pay, and claim the receipt back.{' '}
              <Link href="/refer">How referrals to this practice work</Link>{' '}
              covers the funded routes and who can start one.{' '}
              <Link href="/resources/worksafebc-psychological-injury-claims">WorkSafeBC</Link> can
              fund counselling for a psychological injury at work, on an accepted claim; that page
              sets out how a claim is made and what the counsellor can and cannot certify.
            </p>

            <SceneBand seed={'pricing'} />

          <h2>How coverage works</h2>
            <p>
              BC&rsquo;s Medical Services Plan does not cover private counselling, whatever the
              practitioner&rsquo;s designation. The reasons are explained in the{' '}
              <Link href="/resources/msp-vs-extended-health">comparison of MSP and extended health</Link>.
              What most people use instead is an extended health plan through work, and the{' '}
              <Link href="/tools/therapy-cost-bc">cost estimator</Link> works out what that leaves you paying.
            </p>
            <p>
              The critical detail: plans list <em>professions</em>, not services. Some cover
              &ldquo;Registered Clinical Counsellor&rdquo; and some list only psychologists and social
              workers, in which case sessions here are not reimbursable no matter how clearly they are
              counselling. Check that wording before your first session. It is the single most common
              source of unpleasant surprises, and the{' '}
              <Link href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage page</Link>{' '}
              sets out exactly what to look for and what a claimable receipt must contain.
            </p>
            <p>
              Near the end of a plan year, the session date and the claim deadline are two different
              things; <Link href={YEAR_END_PATH}>using counselling benefits before the plan year ends</Link>{' '}
              explains both.
            </p>
            {/* The /privacy sentence, read from lib/policies.ts and repeated
                in the FAQPage below, so neither can say more than the policy
                does. 1 Oct 2026. */}
            <h2>How private is the video?</h2>
            <p>
              {rich(SESSION_SECURITY_MD)}{' '}
              The <Link href="/privacy">privacy policy</Link> sets out the rest.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="grid grid-2">
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><Video strokeWidth={1.6} /></span>
              <div>
                <h3>Free consultation</h3>
                <p style={{ marginBottom: 0 }}>Every working relationship starts with a free 30-minute call. No charge, and no obligation to book a session afterward.</p>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><Wallet strokeWidth={1.6} /></span>
              <div>
                <h3>Extended health</h3>
                <p>
                  Many extended health plans reimburse an RCC, depending on the plan, so{' '}
                  <Link href="/resources/does-my-plan-cover-counselling-bc">check yours</Link>. Insurers
                  whose plans can include RCCs:
                </p>
                <ul className="checklist" style={{ marginBottom: 12 }}>
                  <li>Pacific Blue Cross</li><li>Manulife</li><li>Sun Life</li><li>Canada Life</li><li>Green Shield</li>
                </ul>
                <p style={{ marginBottom: 0, fontSize: '.94rem', color: 'var(--ink-faint)' }}>
                  Pay by card when you book and submit your receipt for reimbursement. Coverage depends on your plan.
                </p>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><CreditCard strokeWidth={1.6} /></span>
              <div>
                <h3>Payment</h3>
                <ul className="checklist" style={{ marginBottom: 0 }}>
                  <li>Credit card (Visa, MC, Amex), taken when you book</li>
                </ul>
              </div>
            </div>
            <div className="card cred-card">
              <span className="icon-chip" aria-hidden="true"><CalendarX strokeWidth={1.6} /></span>
              <div>
                <h3>Cancellation</h3>
                <p style={{ marginBottom: 0 }}>24 hours&rsquo; notice. Cancel earlier and the fee is refunded in full; inside that window, or for a no-show, 50% is retained. Exceptions for genuine emergencies.</p>
                <p style={{ marginBottom: 0, marginTop: 10 }}>{HOW_TO_CANCEL}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container prose">
          <p className="eyebrow">How payment works</p>
          <h2>Paying, and then claiming it back</h2>
          <p>
            This practice does not direct-bill. You pay the practice directly and receive a
            receipt showing the RCC registration number, which is what an insurer needs to reimburse
            you. Whether your plan covers a Registered Clinical Counsellor is worth confirming before
            you book &mdash; see <a href="/resources/bc-extended-health-coverage-for-counselling">extended health coverage in BC</a>.
          </p>
          {/* Who sees what when you claim: lib/practice-facts.ts (item 358). */}
          <p>{WHO_SEES_A_CLAIM}</p>
          <p>
            Sessions are paid by credit card when you book rather than at the end of the hour, and
            cancellation is free up to 24 hours beforehand. The{' '}
            <a href="/client-portal">client portal</a> covers how that works, what happens inside
            the 24-hour window, and where your receipts appear.
          </p>
          <Figure name="reimbursement-flow" />

          {/* The ?lead= flag is read in the browser so this page can be
              static (components/LeadCaptureFromQuery.tsx, 3 Oct 2026). */}
          <Suspense fallback={<LeadCapture />}>
            <LeadCaptureFromQuery />
          </Suspense>

          <p>
            Want the arithmetic on your own plan? The{' '}
            <Link href="/tools/therapy-cost-bc">cost and coverage estimator</Link>{' '}
            works out what you would actually pay after reimbursement, and names the two
            questions to ask your insurer before booking.
          </p>
        </div>
      </section>

      <CtaBand heading="Questions about fees?" text="Ask during your free 30-minute consultation." />

      {/* FAQPage for the four cards above.
        *
        * The site carries FAQPage markup on 86 pages, and this — the page people
        * arrive at with the most specific questions — was not one of them.
        * Every answer below is the visible card copy rather than a variant
        * written for the markup: schema describing something other than what
        * the visitor reads is how structured data stops being trusted. */}
      {/* THE PAGE ITSELF, WHICH THIS PAGE DID NOT DESCRIBE — 24 Sep 2026.
        *
        * /pricing carried a FAQPage and nothing else: no node saying what the
        * page is, what language it is in, who publishes it or when it last
        * changed. A retrieval system had four questions and answers, and for
        * the most asked-about page on the site, nothing. `webPage` also
        * carries `speakable`, which names the sentences that answer the
        * question — the thing a voice assistant reads out. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPage({
            path: '/pricing',
            name: 'Counselling fees and insurance',
            description:
              'Session fees in full, what extended health usually reimburses, and what the free 30-minute consultation covers.',
            updated: lastmodFor('/pricing') ?? undefined,
          })),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${site.domain}/pricing#faq`,
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How much does a counsellor cost in BC?',
                acceptedAnswer: { '@type': 'Answer', text: costAnswer },
              },
              {
                '@type': 'Question',
                name: 'Is the first consultation free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Every working relationship starts with a free 30-minute call. There is no charge, and no obligation to book a session afterward.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does extended health insurance cover counselling in BC?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Many extended health plans reimburse a Registered Clinical Counsellor, depending on the plan, so check yours. Pacific Blue Cross, Manulife, Sun Life, Canada Life and Green Shield all administer plans that can include RCCs. This practice is pay-and-submit: you pay the practice directly and submit your receipt for reimbursement. Counselling with an RCC is not covered by MSP.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I pay for a counselling session?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  /* Card at booking, confirmed by the owner 30 Aug 2026.
                   *
                   * This answer used to read "By e-transfer, which is preferred, or by
                   * credit card" — which contradicted lib/faq.ts, the /client-portal copy
                   * and the Cliniko configuration, all of which say the card is taken as
                   * the booking completes. It survived because it lives ONLY in this
                   * JSON-LD: no reader ever sees it, so no amount of proofreading the
                   * rendered page would have caught it. Structured data is exactly what
                   * Google lifts into a rich result and what an assistant quotes back, so
                   * the wrong answer was the one most likely to be shown.
                   *
                   * Keep this wording and lib/faq.ts saying the same thing. */
                  text: 'By credit card: Visa, Mastercard or Amex, taken at the time you book, not at the end of the session. Cancel with at least 24 hours notice and the fee is refunded in full.',
                },
              },
              {
                '@type': 'Question',
                name: 'How private is the video?',
                acceptedAnswer: { '@type': 'Answer', text: SESSION_SECURITY },
              },
              {
                '@type': 'Question',
                name: 'What is the cancellation policy?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: '24 hours’ notice. Cancel with at least 24 hours notice and the session fee is refunded in full. With less notice, or for a no-show, 50% of the fee is retained, because the time was held and cannot realistically be filled at that notice. There are exceptions for genuine emergencies. ' + HOW_TO_CANCEL,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

import type { Resource } from './resources';
import { planMaximumParagraph, remainingBalanceSentence, icbcFeeSentence, ICBC_COUNSELLING } from '@/lib/session-arithmetic';
import { money } from '@/lib/cliniko-catalog';

/* ICBC's dates as prose ("1 April 2026"), from ICBC_COUNSELLING. */
const longDate = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const ICBC_FROM = longDate(ICBC_COUNSELLING.from);
const ICBC_TO = longDate(ICBC_COUNSELLING.to);
const ICBC_READ = longDate(ICBC_COUNSELLING.read);
import { YEAR_END_PATH } from '@/lib/seasonal';
import { ONLINE_COVERAGE } from '@/lib/practice-facts';

/* THE YEAR-END SECTION — 1 Oct 2026 (item 210). Shown 1 Oct to 31 Dec on the
   two coverage pages (Resource.seasonal, lib/seasonal.ts), and the same
   facts permanently on the year-end page below. Verified facts only, read
   1 Oct 2026: on a calendar-year plan the date of service decides the year;
   claim deadlines are separate and set per plan (Pacific Blue Cross: "the
   annual deadline for submitting eligible claims is different based on each
   policy"); some plans run on an anniversary year; unused paramedical
   maximums generally do not carry over, though some health spending
   accounts carry a balance forward one year. Session counts come from the
   catalogue. Owner fact-check before release. */
/* 1 Oct 2026 (item 383): `province` drops the BC insurer from the claim-
   deadline example on the Alberta page, and `balanceSentence: false` drops
   the remaining-balance arithmetic on a page that already prints
   planMaximumParagraph, so one page does not count sessions twice. */
export function yearEndSeasonal(opts: { yearEndLink: boolean; designation: string; province?: 'AB'; balanceSentence?: boolean }): NonNullable<Resource['seasonal']> {
  return {
    from: '10-01',
    to: '12-31',
    h2: 'If your plan year ends on 31 December',
    body: [
      'On a plan that runs on the calendar year, the date of the session decides which year’s maximum it counts against. A session held on or before 31 December is claimed against this year’s; one held in January counts against next year’s, whenever the receipt goes in.',
      opts.province === 'AB'
        ? 'Submitting the claim is a separate deadline. Each plan sets its own and they vary widely, from weeks after the service to well into the following year. The booklet or member portal states yours.'
        : 'Submitting the claim is a separate deadline. Each plan sets its own and they vary widely, from weeks after the service to well into the following year; Pacific Blue Cross, for one, says the deadline differs by policy. The booklet or member portal states yours.',
      `Not every plan runs on the calendar year. Some run on an anniversary year that turns over on another date, and ${opts.yearEndLink ? '[student plans have their own plan year](/resources/student-mental-health-supports-bc)' : 'student plans have their own plan year'}. Check that the plan lists a ${opts.designation} and which year it runs on before planning around 31 December.`,
      'Unused paramedical maximums generally do not carry over into the next year. Some health spending accounts do carry an unused balance forward one year, which is a feature of the account rather than of the counselling maximum; the administrator can confirm both, and whether the account accepts a counselling receipt at all.',
      ...(opts.balanceSentence === false ? [] : [remainingBalanceSentence()]),
      ...(opts.yearEndLink ? [`The longer version, with claim deadlines for some BC plans: [using counselling benefits before the year ends](${YEAR_END_PATH}).`] : []),
    ],
  };
}

/* The CRA's table of authorized medical practitioners, by province. Read
   1 Oct 2026: "Counselling therapist" is marked for New Brunswick, Nova
   Scotia and PEI only, and "not applicable" for British Columbia. That is why
   the health-spending-account and tax-credit wording below is conditional. */
const CRA_PRACTITIONERS =
  'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return/authorized-medical-practitioners-purposes-medical-expense-tax-credit.html';

/* Two resources added 6 Sep 2026 from the SEO audit of the same day.
 *
 * Both answer a question the site was already being asked and had no
 * indexable page for. The ICBC entitlement existed only as a lead-magnet
 * email; the insurer question was answered once, generically, on the
 * extended-health page while the searches name the insurer. One page per
 * insurer would have been four near-copies of each other, which is the thin
 * pattern the 8 Aug audit found the city pages in; one page with an H2 per
 * insurer ranks for all four and reads as one honest answer.
 *
 * NOTHING HERE PROMISES COVERAGE. Plans are written by employers, not by
 * insurers, and the same insurer administers plans that list a Registered
 * Clinical Counsellor and plans that do not. Every section says how to check,
 * never what the answer will be. BCACC advertising standards, and /standards. */

export const moreResources2: Resource[] = [
  {
    slug: 'icbc-counselling-after-a-crash-bc',
    title: 'ICBC and counselling after a crash in BC',
    metaTitle: 'ICBC Counselling in BC: Approved Counsellors, Rates, Plan',
    metaDescription:
      'What ICBC Enhanced Care pre-approves for counselling after a crash, who can provide it, how to use it, and what this practice can and cannot do with it.',
    eyebrow: 'Resource · After a crash',
    lede:
      'Most people find out about the counselling entitlement weeks after the crash, if at all. It starts the day of the crash and it does not need a referral.',
    shortAnswer:
      'If you were injured in a crash in British Columbia on or after 1 May 2021, ICBC Enhanced Care pre-approves counselling with a qualifying counsellor in the first twelve weeks after the crash, without a doctor\'s referral or ICBC\'s advance approval. The counsellor has to meet the definition in the Insurance (Vehicle) Regulation, which a Registered Clinical Counsellor does. This practice is not currently in ICBC\'s Recovery Network, so it cannot bill ICBC directly; the entitlement is yours to use wherever you choose, and this page explains how.',
    updated: '2026-10-01',
    readMinutes: 7,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'What Enhanced Care pre-approves in the first twelve weeks',
        body: [
          'Enhanced Care replaced the old litigation model in May 2021. For injuries, it means care is paid for by ICBC regardless of who caused the crash, and a set of treatments is **pre-approved** for an early access period of twelve weeks from the date of the crash. Counselling is on that list, alongside physiotherapy, chiropractic, massage, kinesiology, acupuncture and psychology.',
          'Pre-approved means exactly that: you do not need to ask ICBC before booking, and you do not need a physician to refer you. You open a claim, and the sessions inside the pre-authorised number are funded within that window.',
          'The number of pre-authorised sessions is set by regulation and by ICBC\'s program guide rather than by any counsellor, and it can change. ICBC\'s own page, below, gives the current figures; confirm them with your adjuster when you open the claim, because that conversation is the authoritative one.',
        ],
      },
      /* ICBC'S OWN NUMBERS — 1 Oct 2026 (item 366). The session count was
         sourced to "the practice's own one-pager" and the rates FAQ gave no
         number, while the page ranked for "icbc counselling rates". Read from
         ICBC's page the same day; the figures and their date window live in
         lib/session-arithmetic.ts ICBC_COUNSELLING, and a test fails once the
         window lapses. The fee beside them comes from the catalogue. */
      {
        h2: 'What ICBC says it pays for counselling',
        body: [
          `ICBC’s page on [accessing treatment during your first 12 weeks of recovery](https://icbc.com/claims/injury/accessing-treatment-during-your-first-12-weeks-of-recovery), read on ${ICBC_READ}, sets out the counselling entitlement in its own words. Confirm each figure with your adjuster; ICBC re-sets the rates every April.`,
        ],
        list: [
          { label: `${ICBC_COUNSELLING.treatments} pre-approved counselling treatments`, detail: 'in the first twelve weeks after the crash.' },
          { label: `${money(ICBC_COUNSELLING.cents)} per treatment`, detail: `ICBC’s fee for a counselling session of at least ${ICBC_COUNSELLING.minMinutes} minutes, for treatments from ${ICBC_FROM} to ${ICBC_TO}.` },
          { label: 'No referral and no ICBC approval', detail: 'needed for those pre-approved treatments.' },
          { label: 'Receipts reimbursed to ICBC’s rate', detail: 'if you pay up front, ICBC asks you to keep the receipt and submit it within 180 days, and reimburses it “to the level of our approved rates”.' },
        ],
      },
      {
        h2: 'Who counts as a counsellor for ICBC',
        body: [
          'The regulation defines a counsellor by registration, not by title. A **Registered Clinical Counsellor** (BC Association of Clinical Counsellors) qualifies, as do registered psychologists and registered social workers. Both counsellors at this practice hold the RCC designation; one also holds the Canadian Certified Counsellor certification.',
          'What matters for direct billing is a second thing entirely: whether the provider has joined ICBC\'s **Recovery Network**. A network provider bills ICBC and you pay nothing yourself. A qualified provider outside the network may treat you, but the money moves differently, which the next section covers.',
        ],
      },
      {
        h2: 'What this practice can and cannot do',
        list: [
          { label: 'Cannot bill ICBC directly', detail: 'Westpeak Wellness is not currently a Recovery Network provider. Sessions here are paid at booking like any other session, with a receipt carrying the counsellor\'s registration number.' },
          { label: 'Can be your counsellor anyway', detail: `${icbcFeeSentence()} The answer comes from ICBC, not from this page, and it is worth having in writing before you start.` },
          { label: 'Can write within scope', detail: 'A counsellor can provide a treatment summary and attendance confirmation. A counsellor cannot certify a leave from work or provide a medical-legal opinion; those come from a physician.' },
          { label: 'Will say so if someone else fits better', detail: 'The free consultation exists partly for this. If the pre-approved sessions with a network provider are the better route for you financially, you will be told that.' },
        ],
      },
      {
        h2: 'How to actually use the entitlement',
        list: [
          { label: '1. Report the crash and open a claim', detail: 'Online or by phone, as soon as you can. The twelve-week clock runs from the date of the crash, not from the date you open the claim, so a late claim shortens the window.' },
          { label: '2. Ask for the claim number and the counselling entitlement', detail: 'Write down the claim number. Ask the adjuster how many counselling sessions are pre-authorised and whether they must be with a network provider.' },
          { label: '3. Choose a counsellor', detail: 'ICBC can point you to network providers, and the BCACC register lists every RCC in the province. If you already see someone, ask them whether they are in the network.' },
          { label: '4. Give the counsellor the claim number', detail: 'A network provider bills ICBC with it. A non-network provider gives you receipts to submit, if ICBC has confirmed that route.' },
          { label: '5. Keep every receipt and every date', detail: 'Whichever route you use. If the claim later needs a treatment plan or extends past twelve weeks, the record is what the request is built on.' },
        ],
      },
      {
        h2: 'After twelve weeks',
        body: [
          'The pre-approval ends at twelve weeks; the coverage does not necessarily end. Beyond that point further counselling can be funded where a treatment plan supports it, and ICBC decides that on the provider\'s plan and the claim history. This is the stage where the record from step five matters.',
          'It is also the stage where people commonly stop, because the friction rises. If counselling was helping, that is worth raising with the adjuster before the window closes rather than after.',
        ],
      },
      {
        h2: 'The two routes, side by side',
        table: {
          columns: ['', 'Recovery Network counsellor', 'Counsellor outside the network'],
          rows: [
            ['Who pays, and when', 'ICBC, billed directly by the provider', 'You, at booking'],
            ['Referral needed', 'No', 'No'],
            ['ICBC approval needed in first 12 weeks', 'No, within the pre-authorised number', 'Ask ICBC whether receipts are reimbursable'],
            ['Receipt', 'Not usually needed by you', 'Essential; carries the registration number'],
            ['Your extended health plan', 'Not touched', 'May apply, if the plan lists the designation'],
            ['This practice', 'Not available here', 'Available'],
          ],
        },
      },
      {
        h2: 'If the crash is still with you',
        body: [
          'Being fine physically and not fine at all is common after a collision, and it is one of the reasons counselling is on the pre-approved list. Sleep that has not returned, driving that now takes effort, irritability that arrived with the crash, replaying it. Those are ordinary responses to a frightening event, and they respond to counselling, including EMDR, which is worth asking about specifically for a single-incident trauma.',
          'None of that requires a diagnosis to start, and none of it needs to have reached a crisis. The entitlement exists so that it does not.',
        ],
      },
    ],
    midCta: {
      text: 'If you want to talk it through before deciding which route to take,',
      label: 'the 30-minute consultation is free and carries no obligation',
    },
    faqs: [
      /* The three phrasings Search Console shows for this page that it did not
         answer in its own words: "icbc-approved counsellors", "icbc counselling
         rates", "icbc counselling treatment plan". 26 Sep 2026. */
      { q: 'Is there a list of ICBC-approved counsellors?', a: 'Not in the sense of a separate approval. Any counsellor who meets the definition in the Insurance (Vehicle) Regulation can provide the pre-approved sessions, and a Registered Clinical Counsellor does. What ICBC does keep is a Recovery Network of providers who bill it directly; a counsellor outside that network can still see you, and you pay and ask ICBC about reimbursement. The table on this page sets the two routes side by side.' },
      { q: 'What are ICBC counselling rates?', a: `ICBC publishes its own fee: for treatments from ${ICBC_FROM} to ${ICBC_TO} it pays ${money(ICBC_COUNSELLING.cents)} per counselling treatment of at least ${ICBC_COUNSELLING.minMinutes} minutes, and a person using a Recovery Network counsellor does not see a bill. If you pay up front, ICBC reimburses the receipt to the level of that rate. ${icbcFeeSentence()}` },
      { q: 'What is an ICBC counselling treatment plan?', a: 'The document a counsellor sends ICBC when sessions beyond the pre-approved number, or beyond the first twelve weeks, are needed: what has been done, what is recommended and why. ICBC decides further funding on it. Network providers submit it directly; if you are seeing someone outside the network, ask the adjuster what they need and in what form before the twelve weeks end.' },
      { q: 'Does ICBC cover counselling after a car accident in BC?', a: 'Yes. Under Enhanced Care, counselling with a qualifying counsellor is pre-approved for the first twelve weeks after a crash, without a referral or advance approval, for up to ' + ICBC_COUNSELLING.treatments + ' sessions. Further counselling after that can be funded on a treatment plan.' },
      { q: 'Do I need a doctor\'s note to see a counsellor through ICBC?', a: 'No. The early access period is designed so that treatment can start without a referral. A doctor\'s note is not required for the pre-approved sessions.' },
      { q: 'Can I see any counsellor, or does it have to be an ICBC one?', a: 'The counsellor has to meet the regulation\'s definition, which a Registered Clinical Counsellor does. Whether ICBC pays them directly depends on whether they are in the Recovery Network. Ask ICBC about reimbursement for a qualified counsellor outside it before you start.' },
      { q: 'Is Westpeak Wellness an ICBC provider?', a: 'Not currently. The practice is not in the Recovery Network and cannot bill ICBC directly. You can still choose to see a counsellor here and pay at booking; whether ICBC reimburses those receipts is ICBC\'s decision, and worth confirming in writing.' },
      { q: 'What happens after the twelve weeks?', a: 'The pre-approval ends. Coverage can continue where a treatment plan supports it and ICBC agrees, which is why keeping receipts and dates from the start matters.' },
      { q: 'What if I was not physically injured?', a: 'Psychological injury from a crash is an injury. If you are not sleeping, avoiding driving, or replaying the crash, that is a legitimate reason to use the entitlement, and it is one of the reasons counselling is on the pre-approved list.' },
    ],
    sources: [
      { label: 'ICBC, accessing treatment during your first 12 weeks of recovery', url: 'https://icbc.com/claims/injury/accessing-treatment-during-your-first-12-weeks-of-recovery' },
      { label: 'ICBC, Enhanced Care: care and recovery benefits', url: 'https://icbc.com/claims/enhanced-care/care-and-recovery-benefits' },
      { label: 'ICBC, if your recovery takes longer than 12 weeks', url: 'https://icbc.com/claims/injury/if-your-recovery-takes-longer-than-12-weeks' },
      { label: 'BC Association of Clinical Counsellors, find a counsellor', url: 'https://bc-counsellors.org/counsellors/' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Individual therapy after a crash' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy for a single-incident trauma' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling in BC' },
      { href: '/resources/verify-a-counsellor-in-bc', label: 'How to verify a counsellor\'s registration' },
      { href: '/pricing', label: 'Fees and receipts' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'does-my-plan-cover-counselling-bc',
    title: 'Does Pacific Blue Cross, Sun Life, Manulife or Canada Life cover counselling?',
    metaTitle: 'Does Blue Cross or Sun Life Cover Counselling? BC',
    metaDescription:
      'Often, to an annual maximum your plan sets. How to check Pacific Blue Cross, Sun Life, Manulife or Canada Life in two minutes, and the words to use.',
    eyebrow: 'Resource · Coverage',
    lede:
      'The insurer\'s name is on the card. The answer is in the plan, and the plan was written by your employer.',
    shortAnswer:
      'Whether your plan covers counselling depends on the plan your employer bought, not on the insurer that administers it. Pacific Blue Cross, Sun Life, Manulife and Canada Life all administer plans that reimburse a Registered Clinical Counsellor and plans that do not. The way to find out is one question to the insurer or one search of the plan booklet: is a Registered Clinical Counsellor (or, in Alberta, a Canadian Certified Counsellor) listed as an eligible paramedical practitioner, and what is the annual maximum. This page gives the wording for each insurer.',
    updated: '2026-10-01',
    readMinutes: 8,
    figure: 'reimbursement-flow',
    seasonal: yearEndSeasonal({ yearEndLink: true, designation: 'Registered Clinical Counsellor', balanceSentence: false }),
    sections: [
      {
        h2: 'The question that settles it, whichever insurer you have',
        body: [
          'Extended health plans reimburse **eligible practitioners** under a paramedical or mental-health benefit. The plan document lists which designations count. Psychologists are on almost every list. Registered Clinical Counsellors are on many and not all. Canadian Certified Counsellors are named on plans more often in Alberta, where counselling is not a regulated profession.',
          'So the question is not "does Sun Life cover counselling". It is: *"Under my plan, is a Registered Clinical Counsellor an eligible practitioner for the mental-health or paramedical benefit, and what is the annual maximum and any per-visit maximum?"* Ask that, in those words, and you have your answer in one call.',
          'Both counsellors at this practice are RCCs registered with the BC Association of Clinical Counsellors; one also holds the CCC. Receipts carry the registration number the insurer needs. This practice is pay-and-submit: you pay at booking and submit the receipt yourself. Pacific Blue Cross has accepted direct claims from RCCs since July 2025, so some practices bill it for you; this one does not.',
        ],
      },
      {
        h2: 'Pacific Blue Cross and counselling',
        body: [
          'Pacific Blue Cross administers a large share of BC employer plans, including many public-sector ones. Many of its plans list Registered Clinical Counsellors under psychology or counselling benefits; some list psychologists only. The plan booklet, or the member portal under "coverage", shows the practitioner list and the maximum.',
          'What to check: the exact designation wording, whether the counselling maximum is shared with psychology, and whether a physician\'s referral is required. Most plans do not require one; a few do, and it is cheaper to know before the first session than after.',
        ],
      },
      {
        h2: 'Sun Life and counselling',
        body: [
          'Sun Life plans vary widely by employer. The member site and app show the covered practitioners under the extended health benefit, usually as a list of paramedical services with a per-year maximum each. Search the list for "clinical counsellor" and for "psychologist"; if only the second appears, the plan may still cover a counsellor under a combined mental-health benefit, and the plan document or a call settles it.',
          'What to check: whether "registered clinical counsellor" is named, the maximum, and whether it is per practitioner type or combined.',
        ],
      },
      {
        h2: 'Manulife and counselling',
        body: [
          'Manulife group plans list eligible practitioners in the benefit booklet and in the member portal. Counsellors appear on many plans under "psychologist, social worker or counsellor" wording with a combined maximum; others name psychologists alone. Where the wording is "or equivalent" or "registered counsellor", the plan administrator, not the insurer\'s general line, is the person who can confirm whether an RCC qualifies.',
          'What to check: the exact wording, the combined maximum, and whether pre-authorisation is needed for any of it.',
        ],
      },
      {
        h2: 'Canada Life and counselling',
        body: [
          'Canada Life, which absorbed Great-West Life, administers plans with a similar range. The member site lists paramedical practitioners and maximums; plans that cover counsellors commonly do so under a mental-health practitioner benefit alongside psychologists and social workers.',
          'What to check: the designation, the maximum, and, for anyone in Alberta, whether the plan names the Canadian Certified Counsellor rather than the RCC. Alberta plans more often do, because counselling is not a regulated profession there.',
        ],
      },
      {
        h2: 'The same check, for any insurer',
        /* 1 Oct 2026: the $500 and $1,500 below were the only figures on the
           page, with no fee to read them against. The fees and the session
           counts come from the catalogue (lib/session-arithmetic.ts). */
        body: [planMaximumParagraph()],
        table: {
          columns: ['Ask or search for', 'Why it matters'],
          rows: [
            ['"Registered Clinical Counsellor" as an eligible practitioner', 'The whole question. If it is not there, ask whether a combined mental-health benefit applies.'],
            ['Annual maximum, and any per-visit maximum', 'A $500 maximum is a few sessions; a $1,500 maximum is a course of counselling. The paragraph above counts them at this practice’s fees.'],
            ['Combined or separate from psychology', 'A combined maximum is shared with a psychologist you may also see.'],
            ['Physician referral required?', 'Usually no. Occasionally yes, and it is easier before the first session.'],
            ['Plan year', 'Calendar or anniversary. Coverage resets at one of them, and timing a course of sessions across the reset is legitimate.'],
            ['Virtual sessions with an RCC eligible, on the same maximum?', 'Plans that list an RCC usually treat a video session like an in-person one, but it depends on the plan, and every session at this practice is by video.'],
            ['Health spending account', 'An HSA pays only expenses the CRA accepts as medical expenses, and the CRA does not yet list counsellors in BC as authorized practitioners. Ask the administrator before booking. A wellness or lifestyle account, where there is one, can usually fund RCC sessions as a taxable benefit.'],
          ],
        },
      },
      /* 1 Oct 2026 (item 274): the site's best-ranked coverage page (428
         impressions at 5.76) had no sentence on video sessions, while three
         other pages answered it three different ways. One answer, from
         lib/practice-facts.ts. */
      {
        h2: 'Is online counselling covered the same as in person?',
        body: [
          ONLINE_COVERAGE,
          'Every session at this practice is by secure video, so if your plan treats virtual sessions differently, that is the one thing to settle before the first session rather than after it. The receipt is the same either way, and you submit it yourself.',
        ],
      },
      {
        h2: 'If the answer is no',
        body: [
          `Other routes depend on the plan. A **health spending account** pays only what the CRA accepts as a medical expense, and the [CRA’s list of authorized medical practitioners](${CRA_PRACTITIONERS}) has no counsellor entry for British Columbia, so ask the administrator whether it will accept an RCC receipt before relying on it. A **wellness or lifestyle spending account**, if your employer offers one, is broader and can usually fund counselling, as a taxable benefit. The **medical expense tax credit** generally does not apply to RCC fees in BC until psychotherapy is regulated (from 29 November 2027); check with whoever prepares your return. And **reduced-fee or public options** exist and are listed on the [low-cost counselling page](/resources/low-cost-counselling-bc).`,
          'What this practice will not do is tell you that a plan covers something. That is the plan\'s job, and getting it wrong costs you money after the fact, which is the outcome this page exists to prevent.',
        ],
      },
    ],
    midCta: {
      text: 'Once you know what the plan says, the next step is a thirty-minute call to see whether the fit is right.',
      label: 'Book a free consultation',
    },
    faqs: [
      /* Search Console, 17 Sep 2026: 'does blue cross cover counselling' held position 1 and 'does blue cross cover therapy' position 29, with no answer in those words. */
      { q: 'Does Blue Cross cover counselling in BC?', a: 'Many Pacific Blue Cross extended health plans reimburse counselling with a Registered Clinical Counsellor, depending on the plan, up to an annual maximum the employer chose, commonly between $500 and $1,500. It is the plan, not Blue Cross, that sets the amount and the eligible designations, so the two-minute check is to log in to the member site, open the benefit booklet and search for "counsellor". The practice gives you a receipt with the counsellor\'s registration number and you claim it.' },
      { q: 'Does Pacific Blue Cross cover a Registered Clinical Counsellor?', a: 'Many Pacific Blue Cross plans do and some do not; it depends on the plan your employer chose. Check the practitioner list in the member portal or the booklet for "Registered Clinical Counsellor", and note the annual maximum.' },
      { q: 'Does Sun Life cover counselling in BC?', a: 'It depends on the plan. Search your coverage for "clinical counsellor"; if only psychologists appear, ask whether a combined mental-health benefit applies to an RCC.' },
      { q: 'Does Manulife cover counselling with an RCC?', a: 'On many plans, under a combined psychologist, social worker or counsellor benefit. Where the wording is unclear, the plan administrator at your employer can confirm whether an RCC qualifies.' },
      { q: 'Does Canada Life cover counselling?', a: 'Plans that do usually list counsellors under a mental-health practitioner benefit. For Alberta plans, check whether the Canadian Certified Counsellor is the designation named.' },
      { q: 'Is online counselling covered the same as in person?', a: ONLINE_COVERAGE },
      { q: 'Does Westpeak Wellness bill my insurer directly?', a: 'No. This practice is pay-and-submit: you pay at booking and receive a receipt carrying the counsellor’s registration number, which you submit to the insurer. Pacific Blue Cross accepts direct claims from RCCs, so another practice may bill it for you; this one does not.' },
      { q: 'Is counselling covered by MSP?', a: 'No. MSP does not cover private counselling. It covers physicians and psychiatrists. The comparison is on the MSP vs extended health page.' },
      { q: 'Do unused counselling benefits carry over?', a: 'It depends on the plan. Unused paramedical maximums, which is where counselling usually sits, generally do not carry over: what is left at the end of the plan year is gone. Some health spending accounts carry an unused balance forward one year. Whether your plan runs on the calendar year or an anniversary year, and what happens to an unused balance, is in the booklet or the member portal.' },
      { q: 'What if my plan only lists psychologists?', a: 'Ask whether a combined mental-health benefit applies, and whether the employer offers a wellness or lifestyle spending account, which can usually fund counselling as a taxable benefit. A health spending account is narrower: it pays only CRA-eligible expenses, and the CRA does not yet list counsellors in BC, so ask the administrator first. The medical expense tax credit generally does not cover RCC fees in BC until psychotherapy is regulated in November 2027.' },
    ],
    sources: [
      /* 1 Oct 2026 (item 274): these were the four insurers' home pages. Each
         is now the page that says what the paragraph above it says. */
      { label: 'Pacific Blue Cross, “Is your practitioner registered?” (BCACC among the counselling associations; read 1 Oct 2026)', url: 'https://www.pac.bluecross.ca/advicecentre/story/practitioner-registered' },
      { label: 'Sun Life, adding clinical counsellors and psychotherapists to standard extended health plans from 12 May 2024 (read 1 Oct 2026)', url: 'https://www.sunlife.ca/workplace/en/group-benefits/advisor/advisor-latest-news/adding-new-mental-health-practitioners-to-standard-ehc-benefits-plans/' },
      { label: 'Manulife, mental health and counselling services: practitioner types and maximums vary by plan (read 1 Oct 2026)', url: 'https://www.manulife.ca/personal/group-plans/group-benefits/mental-health-counselling-services.html' },
      { label: 'Canada Life, mental health in workplace benefits: check your plan in My Canada Life at Work (read 1 Oct 2026)', url: 'https://www.canadalife.com/insurance/workplace-benefits/mental-health.html' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bc-counsellors.org/' },
      { label: 'Canadian Counselling and Psychotherapy Association', url: 'https://www.ccpa-accp.ca/' },
      { label: 'Canada Revenue Agency, authorized medical practitioners for the medical expense tax credit (read 1 Oct 2026)', url: CRA_PRACTITIONERS },
      { label: 'Pacific Blue Cross provider notice, “Direct Billing for Mental Health Providers in BC Starting July 11” (2025; read 1 Oct 2026)', url: 'https://www.pac.bluecross.ca/providerresource/provider-news/direct-billing-for-mental-health-providers-in-bc-starting-july-11/' },
    ],
    related: [
      { href: '/tools/therapy-cost-bc', label: 'What counselling costs in BC: the estimator' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling in BC' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/pricing', label: 'Fees and receipts' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  /* ITEM 212 — 1 Oct 2026. The year-end question, answered once on its own
     URL. Every fact below was read on 1 Oct 2026 from the source it cites;
     OWNER FACT-CHECK BEFORE RELEASE. In January this same URL is rewritten
     into CONTENT_CALENDAR's February "maximum just reset" piece rather than
     a new page being started. Fees and session counts come from the
     catalogue (lib/session-arithmetic.ts); no time is promised. */
  {
    slug: 'counselling-benefits-before-year-end-bc',
    title: 'Using counselling benefits before your plan year ends',
    metaTitle: 'Counselling Benefits Before Year End, BC | Westpeak',
    metaDescription:
      'On a calendar-year plan, the session date decides which year’s maximum it uses. Claim deadlines, anniversary years, HSAs and what carries over, for BC.',
    eyebrow: 'Resource · Coverage',
    lede:
      'Two dates matter at the end of a plan year, and people usually know only one of them.',
    shortAnswer:
      'On an extended health plan that runs on the calendar year, a counselling session held on or before 31 December counts against this year’s maximum, whenever the receipt is submitted. The deadline for submitting the claim is a separate date, set by each plan. Some plans run on an anniversary year instead, and unused paramedical maximums generally do not carry over. The plan booklet or member portal answers all three for your plan.',
    updated: '2026-10-01',
    readMinutes: 6,
    whoYouWouldSee: true,
    sections: [
      {
        h2: 'The date of the session decides the year',
        body: [
          'Extended health plans count a paramedical claim against the maximum for the period in which the service was provided. On a calendar-year plan, a session on 30 December uses this year’s maximum and a session on 5 January uses next year’s, even if both receipts are submitted on the same day in January.',
          'So a balance left on this year’s counselling maximum can only be used by sessions held before the plan year ends. It cannot be used by submitting a January receipt early, or a December receipt late.',
        ],
      },
      {
        h2: 'Claim deadlines are a separate date',
        body: [
          'The deadline for submitting a claim is not the end of the plan year, and it is set plan by plan. Pacific Blue Cross says the annual deadline for submitting eligible claims differs by policy and is in the plan booklet or the member profile, and that claims for services earlier in the year do not necessarily have to be in by 31 December.',
          'The Public Education Benefits Trust, which covers many BC school-district employees, asks for extended health claims by 30 June or 31 December of the year after the expense, depending on the district’s policy, and within 90 days of leaving the plan. Other plans allow far less time. Submitting each receipt soon after the session avoids the question.',
        ],
      },
      {
        h2: 'Calendar year or anniversary year',
        body: [
          'Many plans reset on 1 January; some run on an anniversary year, which turns over on the date the employer’s policy renews or on another date the plan sets. On an anniversary-year plan, 31 December means nothing, and the date that matters is in the booklet.',
          'If you are covered under two plans, yours and a spouse’s, each runs on its own year and its own deadline. Coordination of benefits lets the second plan pay what the first did not, which matters most at the end of a year when one maximum is nearly used.',
        ],
      },
      {
        h2: 'Student plans have their own year',
        body: [
          'A students’ society health plan runs on the plan year the society sets, which is often tied to the academic year rather than the calendar. The counselling maximum resets on that date, not on 1 January. [Counselling for university students](/for/university-students) covers student plans in more detail.',
        ],
      },
      {
        h2: 'Health spending account or paramedical maximum',
        body: [
          `A paramedical maximum is the counselling line in the plan itself, and an unused balance there generally does not carry over. A **health spending account** is different: some carry an unused balance forward one year. But an HSA pays only expenses the CRA accepts as medical expenses, and the [CRA’s list of authorized medical practitioners](${CRA_PRACTITIONERS}) has no counsellor entry for British Columbia, so ask the administrator whether it will accept a Registered Clinical Counsellor’s receipt before relying on it. A **wellness or lifestyle spending account** is broader and can usually fund counselling, as a taxable benefit.`,
        ],
      },
      {
        h2: 'Community health workers: the $1,000 mental health benefit',
        body: [
          'From 1 January 2026, members under the community health collective agreement (the Community Bargaining Association) have a Mental Health and Wellness Benefit on their Pacific Blue Cross extended health plan, with a combined maximum of $1,000 per calendar year. Registered Clinical Counsellors are among the eligible practitioners, with psychologists, social workers and marriage and family therapists.',
          'Two details from the BCGEU’s summary: the benefit is for members only and does not extend to enrolled dependents, and each visit is paid up to Pacific Blue Cross’s reasonable and customary limit, subject to coinsurance. Because it is a calendar-year maximum, a 2026 balance is used by sessions held by 31 December 2026.',
        ],
      },
      {
        h2: 'What a remaining balance covers here',
        body: [
          remainingBalanceSentence(),
          'This practice is pay-and-submit: you pay by card at booking and get a receipt carrying the counsellor’s registration number, which is what the insurer needs.',
        ],
      },
      {
        h2: 'A free 30-minute consultation comes first',
        body: [
          'The first conversation is a free 30-minute consultation by video. Nothing is charged for it, so it uses none of your maximum, and it settles whether the fit is right before any paid session is booked.',
        ],
        book: {
          text: 'The calendar shows real open times.',
          label: 'See the consultation calendar',
          location: 'mid-resource',
        },
      },
    ],
    midCta: {
      text: 'If there is a balance left this year and you have been meaning to start, the first step is a free thirty-minute call.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Does a session on 31 December count against this year’s maximum?', a: 'On a plan that runs on the calendar year, yes: the date of the session decides the year, not the date the receipt is submitted. On an anniversary-year plan the cut-off is a different date, which the booklet states.' },
      { q: 'Can I submit a December receipt in January?', a: 'Usually, yes. The claim deadline is separate from the end of the plan year and is set by each plan; Pacific Blue Cross, for one, says it differs by policy. The booklet or member portal gives yours. Submitting soon after each session avoids the question.' },
      { q: 'Do unused counselling benefits carry over?', a: 'It depends on the plan. Unused paramedical maximums generally do not carry over. Some health spending accounts carry an unused balance forward one year, but an HSA pays only CRA-eligible expenses, so ask the administrator whether it accepts a counsellor’s receipt.' },
      { q: 'Does the free consultation use any of my maximum?', a: 'No. It is free, so there is nothing to claim. The first paid session is the first one that counts.' },
    ],
    sources: [
      { label: 'Pacific Blue Cross, claiming deadline information (read 1 Oct 2026)', url: 'https://www.pac.bluecross.ca/advicecentre/story/annual-claim-deadline' },
      { label: 'Public Education Benefits Trust, making claims (read 1 Oct 2026)', url: 'https://www.pebt.ca/pebt-program-benefits/making-claims/' },
      { label: 'BCGEU, new mental health and wellness benefit from 1 January 2026 (read 1 Oct 2026)', url: 'https://www.bcgeu.ca/c8_-_new_mental_health_wellness_benefit_launching_january_1_2026' },
      { label: 'Canada Revenue Agency, authorized medical practitioners for the medical expense tax credit (read 1 Oct 2026)', url: CRA_PRACTITIONERS },
    ],
    related: [
      { href: '/resources/does-my-plan-cover-counselling-bc', label: 'Does my plan cover counselling?' },
      { href: '/tools/therapy-cost-bc', label: 'What counselling costs in BC: the estimator' },
      { href: '/pricing', label: 'Fees and receipts' },
      { href: '/for/teachers', label: 'Counselling for teachers in BC' },
      { href: '/for/university-students', label: 'Counselling for university students' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

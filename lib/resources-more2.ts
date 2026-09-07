import type { Resource } from './resources';

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
    metaTitle: 'ICBC Counselling After a Crash in BC | Westpeak Wellness',
    metaDescription:
      'What ICBC Enhanced Care pre-approves for counselling after a crash, who can provide it, how to use it, and what this practice can and cannot do with it.',
    eyebrow: 'Resource · After a crash',
    lede:
      'Most people find out about the counselling entitlement weeks after the crash, if at all. It starts the day of the crash and it does not need a referral.',
    shortAnswer:
      'If you were injured in a crash in British Columbia on or after 1 May 2021, ICBC Enhanced Care pre-approves counselling with a qualifying counsellor in the first twelve weeks after the crash, without a doctor\'s referral or ICBC\'s advance approval. The counsellor has to meet the definition in the Insurance (Vehicle) Regulation, which a Registered Clinical Counsellor does. This practice is not currently in ICBC\'s Recovery Network, so it cannot bill ICBC directly; the entitlement is yours to use wherever you choose, and this page explains how.',
    updated: '2026-09-06',
    readMinutes: 7,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'What Enhanced Care pre-approves in the first twelve weeks',
        body: [
          'Enhanced Care replaced the old litigation model in May 2021. For injuries, it means care is paid for by ICBC regardless of who caused the crash, and a set of treatments is **pre-approved** for an early access period of twelve weeks from the date of the crash. Counselling is on that list, alongside physiotherapy, chiropractic, massage, kinesiology, acupuncture and psychology.',
          'Pre-approved means exactly that: you do not need to ask ICBC before booking, and you do not need a physician to refer you. You open a claim, and the sessions inside the pre-authorised number are funded within that window.',
          'The number of pre-authorised sessions is set by regulation and by ICBC\'s program guide rather than by any counsellor, and it can change. At the time of writing the practice\'s own one-pager states twelve counselling sessions in the first twelve weeks; confirm the current number with ICBC when you open the claim, because that conversation is the authoritative one.',
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
          { label: 'Can be your counsellor anyway', detail: 'If you would rather see someone here, ask ICBC, when you open the claim, whether receipts from a qualified non-network counsellor can be submitted for reimbursement and at what rate. The answer comes from ICBC, not from this page, and it is worth having in writing before you start.' },
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
      { q: 'Does ICBC cover counselling after a car accident in BC?', a: 'Yes. Under Enhanced Care, counselling with a qualifying counsellor is pre-approved for the first twelve weeks after a crash, without a referral or advance approval, for a set number of sessions. Further counselling after that can be funded on a treatment plan.' },
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
    metaTitle: 'Does My Plan Cover Counselling in BC? | Westpeak Wellness',
    metaDescription:
      'Pacific Blue Cross, Sun Life, Manulife or Canada Life: how to check in one call whether your plan covers a Registered Clinical Counsellor, and what to ask.',
    eyebrow: 'Resource · Coverage',
    lede:
      'The insurer\'s name is on the card. The answer is in the plan, and the plan was written by your employer.',
    shortAnswer:
      'Whether your plan covers counselling depends on the plan your employer bought, not on the insurer that administers it. Pacific Blue Cross, Sun Life, Manulife and Canada Life all administer plans that reimburse a Registered Clinical Counsellor and plans that do not. The way to find out is one question to the insurer or one search of the plan booklet: is a Registered Clinical Counsellor (or, in Alberta, a Canadian Certified Counsellor) listed as an eligible paramedical practitioner, and what is the annual maximum. This page gives the wording for each insurer.',
    updated: '2026-09-06',
    readMinutes: 8,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'The question that settles it, whichever insurer you have',
        body: [
          'Extended health plans reimburse **eligible practitioners** under a paramedical or mental-health benefit. The plan document lists which designations count. Psychologists are on almost every list. Registered Clinical Counsellors are on many and not all. Canadian Certified Counsellors are named on plans more often in Alberta, where counselling is not a regulated profession.',
          'So the question is not "does Sun Life cover counselling". It is: *"Under my plan, is a Registered Clinical Counsellor an eligible practitioner for the mental-health or paramedical benefit, and what is the annual maximum and any per-visit maximum?"* Ask that, in those words, and you have your answer in one call.',
          'Both counsellors at this practice are RCCs registered with the BC Association of Clinical Counsellors; one also holds the CCC. Receipts carry the registration number the insurer needs. The practice does not bill insurers directly: you pay at booking and submit the receipt, which is how most counselling reimbursement works in BC.',
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
        table: {
          columns: ['Ask or search for', 'Why it matters'],
          rows: [
            ['"Registered Clinical Counsellor" as an eligible practitioner', 'The whole question. If it is not there, ask whether a combined mental-health benefit applies.'],
            ['Annual maximum, and any per-visit maximum', 'A $500 maximum is three or four sessions; a $1,500 maximum is a course of counselling.'],
            ['Combined or separate from psychology', 'A combined maximum is shared with a psychologist you may also see.'],
            ['Physician referral required?', 'Usually no. Occasionally yes, and it is easier before the first session.'],
            ['Plan year', 'Calendar or anniversary. Coverage resets at one of them, and timing a course of sessions across the reset is legitimate.'],
            ['Health spending account', 'Where the paramedical benefit does not list counsellors, an HSA usually reimburses any receipt the CRA treats as a medical expense, which counselling by an RCC is.'],
          ],
        },
      },
      {
        h2: 'If the answer is no',
        body: [
          'Three routes remain. A **health spending account**, if the plan has one, usually reimburses counselling with a registered counsellor regardless of the paramedical list. **Pay-and-claim on tax**: counselling by a registered practitioner can qualify as a medical expense for the federal medical expense tax credit; that is a question for whoever does your return. And **reduced-fee or public options** exist and are listed on the [low-cost counselling page](/resources/low-cost-counselling-bc).',
          'What this practice will not do is tell you that a plan covers something. That is the plan\'s job, and getting it wrong costs you money after the fact, which is the outcome this page exists to prevent.',
        ],
      },
    ],
    midCta: {
      text: 'Once you know what the plan says, the next step is a thirty-minute call to see whether the fit is right.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Does Pacific Blue Cross cover a Registered Clinical Counsellor?', a: 'Many Pacific Blue Cross plans do and some do not; it depends on the plan your employer chose. Check the practitioner list in the member portal or the booklet for "Registered Clinical Counsellor", and note the annual maximum.' },
      { q: 'Does Sun Life cover counselling in BC?', a: 'It depends on the plan. Search your coverage for "clinical counsellor"; if only psychologists appear, ask whether a combined mental-health benefit applies to an RCC.' },
      { q: 'Does Manulife cover counselling with an RCC?', a: 'On many plans, under a combined psychologist, social worker or counsellor benefit. Where the wording is unclear, the plan administrator at your employer can confirm whether an RCC qualifies.' },
      { q: 'Does Canada Life cover counselling?', a: 'Plans that do usually list counsellors under a mental-health practitioner benefit. For Alberta plans, check whether the Canadian Certified Counsellor is the designation named.' },
      { q: 'Does Westpeak Wellness bill my insurer directly?', a: 'No. You pay at booking and receive a receipt carrying the counsellor\'s registration number, which you submit to the insurer. That is how most counselling in BC is reimbursed.' },
      { q: 'Is counselling covered by MSP?', a: 'No. MSP does not cover private counselling. It covers physicians and psychiatrists. The comparison is on the MSP vs extended health page.' },
      { q: 'What if my plan only lists psychologists?', a: 'Ask whether a combined mental-health benefit applies, whether the plan has a health spending account, and whether counselling receipts qualify for the medical expense tax credit at tax time. All three are common routes.' },
    ],
    sources: [
      { label: 'Pacific Blue Cross', url: 'https://www.pac.bluecross.ca/' },
      { label: 'Sun Life Canada', url: 'https://www.sunlife.ca/' },
      { label: 'Manulife Canada', url: 'https://www.manulife.ca/' },
      { label: 'Canada Life', url: 'https://www.canadalife.com/' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bc-counsellors.org/' },
      { label: 'Canadian Counselling and Psychotherapy Association', url: 'https://www.ccpa-accp.ca/' },
    ],
    related: [
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling in BC' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/pricing', label: 'Fees and receipts' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

import type { Resource } from './resources';
import { practitioners, type Practitioner } from '@/lib/practitioners';
import { EI_WEEKLY_IN_YEAR } from '@/lib/benefit-figures';

/* "HOW DO I FIND A PUNJABI-SPEAKING THERAPIST IN BC?" — 1 Oct 2026 (item 298).
 * The language-access page was written for the helper and had no answer in
 * the seeker's own words: it logged 0 impressions while "counselling in
 * punjabi" showed 17 at 12.5. The answer is the order the page already
 * argues for: the directory, the register, the free services with their
 * check dates, and this practice last. The counsellor named is whoever on the
 * roster is accepting and works in Punjabi, so the founder (not accepting)
 * is never named here and a change of roster changes the sentence. */
export const punjabiCounsellorNames = (roster: Pick<Practitioner, 'name' | 'acceptingNewClients' | 'languages'>[] = practitioners) =>
  roster.filter((p) => p.acceptingNewClients && p.languages.some((l) => l.tag === 'pa')).map((p) => p.name);

export function findPunjabiTherapistAnswer(names: string[] = punjabiCounsellorNames()): string {
  const practice = names.length
    ? `${names.join(' and ')}, ${names.length === 1 ? 'a Registered Clinical Counsellor who works' : 'Registered Clinical Counsellors who work'} in Punjabi and English by secure video across BC`
    : 'a Registered Clinical Counsellor working in Punjabi and English by secure video across BC, when one is taking new clients';
  return [
    'In four steps.',
    'First, filter BCACC’s Find a Counsellor directory (bc-counsellors.org) by language and choose Punjabi; it lists only the RCCs who choose to be listed.',
    'Second, check any name you find on BCACC’s RCC Register, which shows whether the registration is active.',
    'Third, the free options: DIVERSEcity in Surrey, Archway’s Abbotsford Addictions Centre and Fraser Health’s Roshni Clinic each named Punjabi on their own pages when read on 1 October 2026, and 2-1-1 answers in Punjabi; confirm the language before relying on it.',
    `Last, this practice: ${practice}. The first 30-minute consultation is free.`,
  ].join(' ');
}

/* Two resources added 1 Oct 2026, both written to be LINKED TO rather than
 * ranked for.
 *
 * The off-site survey of 25 Sep (docs/OUTREACH.md) found the site had three
 * pages another organisation would plausibly put on its own "where to get
 * help" list: the crisis directory, the workplace hub and the stress-leave
 * guide. A settlement agency or an HR team links to a page that does a job
 * for THEIR reader; a page that sells counselling is not that. So:
 *
 *   1. An English guide for the person helping somebody who speaks Punjabi
 *      or Tagalog: the settlement worker, the employer, the adult child. It
 *      names the free and low-cost services first, with the date each one
 *      was checked, and this practice last. Nothing here is in Punjabi or
 *      Tagalog; the in-language pages exist for the reader who wants them.
 *   2. The templates the stress-leave guides describe but never provide.
 *      /guides/stress-leave-bc explains the system; this page gives the
 *      letter, the note and the checklist, and links back for the why.
 *
 * EVERY EXTERNAL SERVICE BELOW WAS FETCHED ON 1 OCT 2026 and is described
 * only as far as its own page said. Where a page did not name a language,
 * the entry says "confirm by phone" rather than guessing. A service that
 * could not be loaded is not listed. Every legal fact on the templates page
 * is sourced to a canada.ca or gov.bc.ca page read the same day.
 *
 * Both pages observe the rules every other page does: no outcome claims, no
 * testimonials, coverage is plan-dependent, the consultation is 30 minutes
 * because Cliniko says so, no hours published, nothing clinical. */

export const moreResources3: Resource[] = [
  {
    slug: 'finding-a-counsellor-in-punjabi-or-tagalog-in-bc',
    linkable: true,
    title: 'Finding a counsellor in Punjabi or Tagalog in BC: a guide for the person helping',
    /* Before 1 Oct 2026 (item 298): 'Finding a Counsellor in Punjabi or
       Tagalog in BC | Westpeak', 0 impressions. The title now asks the
       seeker's question; the H1 keeps the helper framing. */
    metaTitle: 'How to Find a Punjabi or Tagalog-Speaking Counsellor in BC',
    metaDescription:
      'For settlement workers, employers and family: how counselling in BC works, checking registration, interpretation vs same-language therapy, and free services.',
    eyebrow: 'Resource · Language access',
    lede:
      'Most people who find a Punjabi- or Tagalog-speaking counsellor in BC do not find one themselves. A daughter, a settlement worker or a manager does the looking. This page is written for that person, in English.',
    shortAnswer:
      'Counselling in BC is private unless it comes through a health authority, a non-profit or a school. Nobody needs a referral, MSP does not pay for it, and extended health plans sometimes do. The public and non-profit services that work in Punjabi are listed below with the date each was checked; Tagalog-language services are rarer, and for those the honest route is often interpretation inside the public system or a Tagalog-speaking counsellor in private practice. Check any counsellor on the public register before the first session. The practice that publishes this page offers counselling in both languages and is named last, on purpose.',
    updated: '2026-10-01',
    readMinutes: 9,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'How counselling in BC works, in six facts',
        body: [
          'If you are helping somebody from outside the system, the system is the confusing part. These six facts are what the person usually does not know, and what changes their decision.',
        ],
        list: [
          { label: 'Nobody needs a referral', detail: 'A person can contact a counsellor directly. A family doctor can suggest one and can refer into health-authority services, but private counselling starts with an email.' },
          { label: '"Counsellor" is not a protected title in BC', detail: 'Anyone may use the word. **Registered Clinical Counsellor (RCC)** is the designation to look for: a master\'s degree, supervised hours, a code of ethics and a complaints process through the BC Association of Clinical Counsellors. Our page on [what RCC means and how to check one](/resources/verify-a-counsellor-in-bc) walks through it.' },
          { label: 'MSP does not pay for private counselling', detail: 'For anyone. Free counselling exists, but it comes through health authorities, non-profits, schools and employers, not through the Care Card. [MSP vs extended health](/resources/msp-vs-extended-health) sets out the difference.' },
          { label: 'Extended health plans sometimes do', detail: 'Whether a workplace plan reimburses an RCC depends on the plan the employer bought, not on the insurer\'s name. The person pays, gets a receipt, and submits it. Always plan-dependent; [how to check](/resources/does-my-plan-cover-counselling-bc) before the first session.' },
          { label: 'A free first conversation is normal', detail: 'Most private practices offer a short free consultation, usually fifteen to thirty minutes, before anything is booked or paid. It is for working out fit and asking about language, fees and coverage. Nothing is diagnosed on it.' },
          { label: 'Video is standard', detail: 'Since 2020 most counselling in BC is available by secure video. For someone whose counsellor in their language is two cities away, that is the difference between having one and not.' },
        ],
      },
      {
        h2: 'Checking the registration takes four minutes, and it matters more in another language',
        body: [
          'The person you are helping may be choosing a counsellor on the strength of one thing: that the counsellor speaks their language. That is a real reason, and it is not a credential. A shared language and a professional designation are separate questions, and both should have a yes.',
          'The check: ask for the counsellor\'s designation (RCC, CCC, RSW or R.Psych) and look them up on that body\'s public register. The BCACC register lists every RCC in the province by name. If the name is not there, or the counsellor will not say which register they are on, that is the answer. Our [verification guide](/resources/verify-a-counsellor-in-bc) has the registers and what each designation requires.',
          'Also worth asking, in plain words: *Do you work in Punjabi, or do you speak some Punjabi?* and *Have you worked with people from this community before?* A counsellor who is fluent in the language and trained in the profession will answer both without hesitation.',
        ],
      },
      {
        h2: 'Interpretation and same-language therapy are not the same thing',
        body: [
          'There are two ways a person who does not speak English comfortably can get counselling, and they are different experiences.',
          '**Interpretation** means an English-speaking counsellor, with a professional interpreter on the call or in the room. In the public system the service arranges it: the Provincial Health Services Authority runs interpreting across the health authorities, and the clinician requests it. A person in a Fraser Health service, for example, tells the service they would prefer Punjabi and the service books the interpreter; Fraser Health\'s page says patients cannot book one themselves, and they should not need to. It works, and for a one-off assessment or a crisis call it is often the fastest route.',
          '**Same-language therapy** means the counsellor speaks the language. Nothing is relayed. The things that are hard to say are said once, to one person, in the words the person actually thinks in. For ongoing counselling, and for anything involving family, shame or the past, this is usually what people are hoping for when they ask for "a Punjabi counsellor".',
          'One thing to say plainly to the family: **a relative should not interpret in a counselling session.** Not a spouse, not an adult child, not a friend. It changes what can be said, and in a family-conflict situation the interpreter is often part of what needs discussing. If interpretation is the route, ask the service for a professional one.',
        ],
      },
      {
        h2: 'Free and low-cost Punjabi-speaking support in BC',
        body: [
          'Each entry below was read from the organisation\'s own page on 1 October 2026 and describes only what that page said. Languages change with staff; confirm by phone or email before sending someone. Where a page did not name Punjabi, the entry says so.',
        ],
        list: [
          { label: 'DIVERSEcity Community Resources Society, Surrey', detail: 'Free family counselling, child and youth mental-health counselling, substance-use counselling and clinical counselling for people affected by gender-based violence, described on its page as counselling by staff registered with BCACC. Languages named: English, Punjabi, Hindi, Urdu, Arabic, Dari and Farsi. Family and child-and-youth counselling are for people whose first language is not English. [Mental health and substance use services](https://www.dcrs.ca/our-services/mental-health-and-substance-use-services/) · intake@dcrs.ca.' },
          { label: 'Archway Community Services, Abbotsford Addictions Centre', detail: 'Free outpatient alcohol and drug counselling for adults and youth, and for family members affected by somebody else\'s use, funded by Fraser Health. Its page states services are available in Hindi, Urdu and Punjabi. [Abbotsford Addictions Centre](https://archway.ca/program/abbotsford-addictions-centre/). Archway\'s wider [mental health services in Abbotsford](https://archway.ca/programs/mental-health-services-in-abbotsford/) page did not name languages; ask.' },
          { label: 'Roshni Clinic, Fraser Health, Surrey', detail: 'A health-authority substance-use clinic for adults 19 and over from South Asian communities, in English, Punjabi and Hindi: assessment, medical treatment, one-to-one counselling, groups and family support. Self-referral or through a doctor. [Roshni Clinic](https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/substance-use/roshni-clinic).' },
          { label: 'Moving Forward Family Services, Surrey and online', detail: 'A charity offering free short-term and low-cost longer-term counselling; its page says services are in twenty languages without listing them, and the Province\'s own [resource page for South Asian communities](https://helpstartshere.gov.bc.ca/SouthAsianCommunities) names Hindi, Punjabi, Urdu and Bengali. [movingforward.help](https://movingforward.help/) · hello@movingforward.help.' },
          { label: 'Sher Pride (formerly Sher Vancouver), Metro Vancouver', detail: 'A charity for queer South Asians and their families, offering free confidential counselling by master\'s-level counsellors in several languages; the languages were not listed on the page, so confirm. [sherpride.ca](https://www.sherpride.ca/).' },
          { label: 'South Asian Mental Health Alliance (SAMHAA)', detail: 'A non-profit network for awareness, stigma reduction and links to resources in the South Asian community, not a counselling service. Named on the Province\'s South Asian communities page above; its own site could not be loaded securely when checked, so it is listed on the strength of the government page only.' },
          { label: 'BounceBack, CMHA BC', detail: 'A free, province-wide skill-building program for low mood and anxiety. Telephone coaching, which needs a referral from a health-care provider, is in English, French, Cantonese and Mandarin; the self-guided videos, which need no referral, are also available in Punjabi. [What is BounceBack](https://bouncebackbc.ca/what-is-bounceback/).' },
        ],
      },
      {
        h2: 'Tagalog-speaking support in BC, and where it runs out',
        body: [
          'This is the harder list, and it is worth being honest about why. The services checked on 1 October 2026 that work in Tagalog are settlement and navigation services, not counselling programs. No free Tagalog-language counselling program turned up in the public listings read for this page. That does not mean none exists; it means a settlement worker should not promise one.',
          'What a Filipino family can rely on: interpretation inside the public system, the lines below that answer in Tagalog, settlement agencies that will navigate in Tagalog, and Tagalog-speaking counsellors in private practice, where plans sometimes reimburse and a free consultation is usual.',
        ],
        list: [
          { label: '2-1-1 British Columbia', detail: 'The free information and referral line run by United Way BC, by phone, text or web chat, in twelve languages besides English including Tagalog and Punjabi. The best first call for "what exists near me". [bc.211.ca](https://bc.211.ca/).' },
          { label: 'HealthLink BC, 8-1-1', detail: 'Free health information and navigation from a nurse, with interpreters in over 130 languages joining the call. [About 8-1-1](https://www.healthlinkbc.ca/services-and-resources/about-8-1-1).' },
          { label: 'Multicultural Helping House Society, Vancouver', detail: 'Founded as the Filipino Canadian Support Services Society; now a settlement agency for all newcomers with information and referral, settlement, youth and seniors programs. 211 BC lists its service languages as Tagalog, Ilocano, Kapampangan, Pangasinan, Visaya, Ibanag, Punjabi, Hindi, Farsi and Spanish. Not a counselling service, but the right people to ask what is. [helpinghouse.org](https://helpinghouse.org/) · info@helpinghouse.org.' },
          { label: 'S.U.C.C.E.S.S., province-wide', detail: 'Settlement, employment and community programs for permanent residents and protected persons, with Tagalog and Punjabi among the twenty-one languages its page lists. Navigation, not counselling. [Immigrant Settlement and Integration Program](https://successbc.ca/isip/).' },
          { label: 'MOSAIC, Vancouver and Burnaby', detail: 'Counselling programs for newcomers, refugee claimants, immigrant seniors, LGBTQIA2+ newcomers and women who have experienced violence. The organisation says it serves clients in seventy languages; the counselling page itself did not name which, so ask about Tagalog or Punjabi directly. [Health and counselling](https://mosaicbc.org/our-services/health-and-counselling/) · info@mosaicbc.org.' },
          { label: 'Interpreters in any health-authority service', detail: 'Fraser Health and the other health authorities book professional interpreters through the Provincial Health Services Authority for patients who ask; the clinician makes the request. Tell the service the preferred language at the first contact. [Fraser Health language services](https://www.fraserhealth.ca/health-topics-a-to-z/EDI/Language-services) · [Provincial Language Services](https://www.phsa.ca/our-services/programs-services/provincial-language-services).' },
        ],
      },
      {
        h2: 'The lines, and which languages they answer in',
        body: [
          'Crisis and support lines are where the language question is most urgent and least documented. This is what each service\'s own page said when read on 1 October 2026; the gaps are real gaps in what is published, not omissions.',
        ],
        table: {
          columns: ['Line', 'What it is', 'Languages, as published'],
          rows: [
            ['9-8-8', 'Suicide crisis helpline, call or text, any hour, across Canada', 'English and French. The site does not say whether interpretation is available.'],
            ['310-6789', 'BC mental-health support line, no area code', 'The Province\'s South Asian resource page says it offers South Asian languages.'],
            ['Fraser Health Crisis Line, 604-951-8855', 'Emotional support and crisis intervention, any hour, run by Options Community Services', 'Listed as English on the HealthLink listing; neither its own page nor Fraser Health\'s names interpretation. Ask whether an interpreter can join.'],
            ['8-1-1', 'Nurse information and navigation', 'Interpreters in over 130 languages.'],
            ['2-1-1', 'Community services referral, phone, text or chat', 'Twelve languages besides English, including Punjabi and Tagalog.'],
            ['Here2Talk', 'Free counselling for anyone registered at a BC post-secondary institution, any hour', 'English and French on the HealthLink listing.'],
          ],
        },
      },
      {
        h2: 'If it is a crisis, say so first',
        body: [
          'A settlement worker or a family member is sometimes the first person to realise that what they are looking at is not a counselling question. If there is any risk to the person\'s safety, call 9-1-1, or 9-8-8 by call or text at any hour. Our [BC crisis and support directory](/resources/bc-crisis-and-support-directory) lists every free route and what each one does. Counselling, in any language, is for after that.',
        ],
      },
      {
        h2: 'What this practice offers, named last on purpose',
        body: [
          'Westpeak Wellness is a private, fully online counselling practice registered in White Rock and working across BC by secure video. Its Registered Clinical Counsellors work in English, Punjabi and Tagalog, in the language itself rather than through an interpreter. The practice does not bill MSP and says so; fees are published in full; a plan that lists an RCC reimburses the sessions, and whether a given plan does is always plan-dependent.',
          'The first step is a free 30-minute consultation by video, which can be booked for the person or requested on their behalf. The in-language pages exist for the reader who wants to send them along: [counselling in Punjabi](/punjabi) and [counselling in Tagalog](/tagalog), with the English service pages at [Punjabi-speaking counselling](/services/punjabi-counselling) and [Tagalog-speaking counselling](/services/tagalog-counselling). Two short glossaries, [what the Punjabi words mean](/resources/counselling-in-punjabi-what-the-words-mean) and [what the Tagalog words mean](/resources/counselling-in-tagalog-what-the-words-mean), are written for exactly the conversation where a family is deciding whether to try.',
          'If you are referring somebody professionally, the [referral page](/refer) sets out what the practice does and does not treat. Email is the better route than phone; it is answered within one business day by the counsellor.',
        ],
      },
      {
        h2: 'For the person doing the helping',
        list: [
          { label: 'Ask which language they would choose, not which they can manage', detail: 'People who get by in English at work often do not want to do counselling in it. Ask the question directly, and let "Punjabi" or "Tagalog" be an unremarkable answer.' },
          { label: 'Do the registration check with them, not for them', detail: 'Four minutes on the register, together, teaches the person how to do it next time and takes the trust question off your shoulders.' },
          { label: 'Ask about the free consultation and the fee in the first email', detail: 'Both are ordinary questions. A practice that will not answer them in writing is telling you something.' },
          { label: 'Check the plan before the first paid session', detail: 'If the person has a workplace benefits plan, the booklet or the number on the card answers whether an RCC is listed. [Does my plan cover counselling](/resources/does-my-plan-cover-counselling-bc) has the exact words to use.' },
          { label: 'Use the two-minute check', detail: 'If you are not sure what the person can access, [what can I access in BC](/tools/what-can-i-access) sorts EAP, student services, public routes and private counselling by what they actually have.' },
          { label: 'Step back once it starts', detail: 'Your job ends at the door. The person books their own sessions, holds their own receipts and decides their own stopping point. That is part of what makes it theirs.' },
        ],
      },
    ],
    midCta: {
      text: 'If you are helping someone decide and would like to ask about language, fees or fit before anything is booked,',
      label: 'the 30-minute consultation is free and can be requested on their behalf',
    },
    faqs: [
      { q: 'How do I find a Punjabi-speaking therapist in BC?', a: findPunjabiTherapistAnswer() },
      { q: 'Is there free counselling in Punjabi in BC?', a: 'Yes, in places. DIVERSEcity in Surrey offers free family, child-and-youth and substance-use counselling with Punjabi named among its languages; Archway\'s Abbotsford Addictions Centre offers free substance-use counselling in Punjabi, Hindi and Urdu; Fraser Health\'s Roshni Clinic works in English, Punjabi and Hindi for adults with substance-use concerns; Moving Forward Family Services offers free short-term and low-cost counselling and is named by the Province as working in Punjabi. Each was checked on 1 October 2026; confirm by phone before sending someone, because languages follow staff.' },
      { q: 'Is there free counselling in Tagalog in BC?', a: 'The public listings read for this page on 1 October 2026 did not turn up a free Tagalog-language counselling program. What exists in Tagalog is navigation and settlement support (2-1-1, Multicultural Helping House, S.U.C.C.E.S.S.), interpretation inside health-authority services, and Tagalog-speaking counsellors in private practice. If you find one, 2-1-1 is the place to report it so the next person can.' },
      { q: 'Does MSP cover counselling for immigrants?', a: 'MSP does not cover private counselling for anyone, immigrant or not. Free counselling comes through health authorities, non-profits, schools and employers. A workplace extended health plan may reimburse a Registered Clinical Counsellor, depending on the plan.' },
      { q: 'Can a family member interpret in a counselling session?', a: 'They can be asked to, and they should not. It changes what the person can say and often puts the interpreter inside the problem being discussed. Ask the service for a professional interpreter, which health-authority services provide free, or look for a counsellor who works in the language.' },
      { q: 'How do I check that a Punjabi- or Tagalog-speaking counsellor is registered?', a: 'Ask for their designation and look them up on that body\'s public register: BCACC for an RCC, CCPA for a CCC, the BC College of Social Workers for an RSW, the College of Health and Care Professionals of BC for a psychologist. A fluent speaker who is not on any register is not a registered counsellor, however good the conversation.' },
      { q: 'Does the person need a doctor\'s referral?', a: 'No, not for private counselling or for most non-profit counselling. A doctor can refer into health-authority mental-health services and is the right first call where medication, a medical leave or an assessment is in question.' },
      { q: 'What does a free consultation actually involve?', a: 'A short video or phone conversation, before any booking or payment, in which the person says what is going on, asks about language, fees and coverage, and the counsellor says whether they can help. Nothing is diagnosed. Saying no afterwards is a normal outcome. At this practice it is 30 minutes.' },
      { q: 'Can an employer or settlement worker book the consultation for someone?', a: 'They can request it on the person\'s behalf by email, with the person\'s agreement. The counselling itself is between the counsellor and the client; the helper is not part of the sessions and is not told what is discussed.' },
    ],
    sources: [
      { label: 'DIVERSEcity, mental health and substance use services (checked 1 Oct 2026)', url: 'https://www.dcrs.ca/our-services/mental-health-and-substance-use-services/' },
      { label: 'Archway Community Services, Abbotsford Addictions Centre (checked 1 Oct 2026)', url: 'https://archway.ca/program/abbotsford-addictions-centre/' },
      { label: 'Fraser Health, Roshni Clinic (checked 1 Oct 2026)', url: 'https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/substance-use/roshni-clinic' },
      { label: 'Government of BC, resources for South Asian communities (checked 1 Oct 2026)', url: 'https://helpstartshere.gov.bc.ca/SouthAsianCommunities' },
      { label: 'Moving Forward Family Services (checked 1 Oct 2026)', url: 'https://movingforward.help/' },
      { label: 'Sher Pride (checked 1 Oct 2026)', url: 'https://www.sherpride.ca/' },
      { label: 'CMHA BC, what is BounceBack (checked 1 Oct 2026)', url: 'https://bouncebackbc.ca/what-is-bounceback/' },
      { label: '211 British Columbia (checked 1 Oct 2026)', url: 'https://bc.211.ca/' },
      { label: 'HealthLink BC, about 8-1-1 (checked 1 Oct 2026)', url: 'https://www.healthlinkbc.ca/services-and-resources/about-8-1-1' },
      { label: '211 BC, Multicultural Helping House Society listing (checked 1 Oct 2026)', url: 'https://bc.211.ca/agency-details/multicultural-helping-house-society-mhhs-9488674/' },
      { label: 'S.U.C.C.E.S.S., Immigrant Settlement and Integration Program (checked 1 Oct 2026)', url: 'https://successbc.ca/isip/' },
      { label: 'MOSAIC, health and counselling (checked 1 Oct 2026)', url: 'https://mosaicbc.org/our-services/health-and-counselling/' },
      { label: 'Fraser Health, language services (checked 1 Oct 2026)', url: 'https://www.fraserhealth.ca/health-topics-a-to-z/EDI/Language-services' },
      { label: 'PHSA, Provincial Language Services (checked 1 Oct 2026)', url: 'https://www.phsa.ca/our-services/programs-services/provincial-language-services' },
      { label: 'Options Community Services, Fraser Health Crisis Line (checked 1 Oct 2026)', url: 'https://www.options.bc.ca/program/fraser-health-crisis-line' },
      { label: 'HealthLink BC, Here2Talk listing (checked 1 Oct 2026)', url: 'https://www.healthlinkbc.ca/find-care/find-health-services/program/here2talk' },
      { label: '9-8-8 Suicide Crisis Helpline (checked 1 Oct 2026)', url: 'https://988.ca/' },
      { label: 'BC Association of Clinical Counsellors, find a counsellor', url: 'https://bc-counsellors.org/counsellors/' },
    ],
    related: [
      { href: '/resources/verify-a-counsellor-in-bc', label: 'What RCC means, and how to check one' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/resources/low-cost-counselling-bc', label: 'Free and low-cost counselling in BC' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling' },
      { href: '/services/tagalog-counselling', label: 'Tagalog-speaking counselling' },
      { href: '/refer', label: 'Referring someone to the practice' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'mental-health-leave-templates-bc',
    linkable: true,
    title: 'Mental-health leave templates for BC: the request, the note, and the HR checklist',
    metaTitle: 'Mental Health Leave Templates for BC: Request, Note, HR',
    metaDescription:
      'Copyable templates for a medical leave in BC: a request letter for the employee, what to ask the doctor for, and an HR checklist with ESA, EI and the return.',
    eyebrow: 'Resource · Work',
    lede:
      'Our guide to stress leave explains how a mental-health leave in BC works. This page is the paperwork: three things to copy, adapt and send.',
    shortAnswer:
      'A mental-health leave in BC is a medical leave certified by a physician or nurse practitioner, with income from paid sick days, an employer\'s short-term disability plan if there is one, or EI sickness benefits. The templates below give the employee a written request that says what the employer needs and nothing more, a note on what to ask the certifying clinician to include, and an employer a checklist from the first day to the return. Every legal fact is sourced to the government page it came from, read on 1 October 2026; the explanation of why each step exists lives in the stress-leave guide and is not repeated here.',
    updated: '2026-10-01',
    readMinutes: 9,
    sections: [
      {
        h2: 'Read the guide first, then come back for the paperwork',
        body: [
          'Everything about *why* is in [stress leave in BC: what it actually takes](/guides/stress-leave-bc): who can certify a leave and who cannot, what "stress leave" means legally, where the money comes from, and why the return is the part nobody plans. The three companion guides go deeper on [the doctor\'s note](/guides/doctors-note-for-a-mental-health-leave), [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy) and [the return to work](/guides/return-to-work-after-a-mental-health-leave). This page assumes you have read the first one and gives you the documents.',
          'The facts the templates rest on, each from the government page named in the sources, read on 1 October 2026:',
        ],
        list: [
          { label: 'BC Employment Standards Act, illness or injury leave', detail: 'After 90 days of employment, five paid and three unpaid days each calendar year. The employer may ask for "reasonably sufficient proof"; the Province\'s page says a note from a health professional is generally not required unless the absence runs past five consecutive days or is the third health-related leave of the year. Employment is continuous during the leave and the employee returns to the same or a comparable position.' },
          { label: 'EI sickness benefits', detail: `55% of average insurable weekly earnings to a maximum of ${EI_WEEKLY_IN_YEAR}, for up to 26 weeks. The claimant needs 600 insured hours in the 52 weeks before the claim, a drop of more than 40% in weekly earnings, and a medical certificate from an approved practitioner. Service Canada says to apply as soon as possible after stopping work and that waiting more than four weeks can cost benefits.` },
          { label: 'The waiting period', detail: 'One week, for sickness benefits as for the others, since 1 January 2017. Some employers top up; the employee has to ask.' },
          { label: 'The Record of Employment', detail: 'The employer issues it for every interruption of earnings; electronically, within five calendar days after the end of the pay period in which the interruption begins. Illness or injury is reason code D.' },
          { label: 'Short- and long-term disability', detail: 'Set by the plan the employer bought, not by law: its own forms, its own definition of disability, its own deadlines. The sequence is normally sick days, then STD, then EI or LTD. Our page on [disability benefits and counselling](/resources/disability-benefits-and-counselling-bc) sets the timelines side by side.' },
        ],
      },
      {
        h2: 'Template 1: the employee\'s written request for a medical leave',
        body: [
          'Short on purpose. An employer is entitled to know that you cannot work, from when, and roughly for how long. They are not entitled to a diagnosis, and a letter that offers one cannot be un-sent. Send it by email so there is a dated copy; copy yourself.',
        ],
        template: {
          title: 'Email to your manager or HR',
          lines: [
            'Subject: Request for medical leave of absence',
            '',
            'Dear [manager\'s name],',
            '',
            'I am writing to request a medical leave of absence starting [date].',
            '',
            'My health-care provider has advised that I am unable to work at present. The expected review date is [date], and I will update you then or sooner if anything changes. A medical certificate confirming the leave and the expected date will follow [by / attached]. The certificate describes my ability to work rather than the reason for it, which I would prefer to keep private.',
            '',
            'So that I can get things in order, could you let me know:',
            '',
            '1. Whether the company has a short-term disability plan, and if so, which forms I need and by when.',
            '2. Whether my paid sick days under the Employment Standards Act will be applied first.',
            '3. That a Record of Employment will be issued, as I may apply for EI sickness benefits.',
            '4. Who my single point of contact will be while I am away.',
            '',
            'I would prefer to be contacted by email rather than phone during the leave. I will hand over [current work / list] before [date].',
            '',
            'Thank you,',
            '[Name]',
            '[Date]',
          ],
        },
        list: [
          { label: 'If you are using ESA sick days for a short absence', detail: 'Replace the first two paragraphs with: "I am unwell and will be taking illness leave under the Employment Standards Act from [date]. I expect to return on [date] and will let you know if that changes." Nothing else is required for a few days.' },
          { label: 'If you have no family doctor', detail: 'Say "a medical certificate will follow once I have seen a physician or nurse practitioner" and give the earliest realistic date. A walk-in clinic or virtual-care visit can certify; the certifying clinician does not have to know you.' },
          { label: 'If the employer asks why', detail: 'A reasonable reply: "The certificate confirms that I am unable to work and when that will be reviewed. My clinician has advised that further medical detail is not required for a leave, and I would like to keep it private."' },
        ],
      },
      {
        h2: 'Template 2: what to ask the doctor or nurse practitioner to include',
        body: [
          'Take this list to the appointment. It is not a note and it contains nothing clinical: it is the shape of what employers, insurers and Service Canada need from the certifying clinician, so that one visit produces one usable document. The clinician decides what to write.',
        ],
        template: {
          title: 'Checklist for the certifying appointment',
          lines: [
            'Please ask the certifying physician or nurse practitioner for a note that includes:',
            '',
            '[ ] A statement that I am unable to work, and the date that applies from.',
            '[ ] An expected review date, rather than an open-ended leave.',
            '[ ] Function, not diagnosis: what I am unable to do at work during this period, in general terms.',
            '[ ] If a graduated return is likely, a line saying a return-to-work plan will be set at review.',
            '[ ] The clinician\'s name, designation, registration and contact details, as the insurer or employer will need to verify it.',
            '',
            'If I am applying for EI sickness benefits:',
            '[ ] Service Canada\'s medical certificate for EI sickness benefits, completed and signed, or the clinician\'s own form with the same information. Ask whether there is a fee; Service Canada does not reimburse it.',
            '',
            'If my employer has a short-term disability plan:',
            '[ ] The plan\'s own attending-physician form, which I will bring, completed by the clinician rather than by me.',
            '',
            'Please do not include:',
            '[ ] A diagnosis on the copy that goes to my employer. It is not required for a leave.',
            '[ ] Anything about treatment, medication or what I discuss in counselling.',
          ],
        },
      },
      {
        h2: 'Template 3: the HR checklist for a mental-health leave in BC',
        body: [
          'For the manager or HR lead who has just received Template 1. The order matters: the Record of Employment has a legal deadline, the STD plan has a contractual one, and the return is the part that decides whether there is a second leave. Nothing on this list asks for a diagnosis, because nothing on this list needs one.',
          'For the employer side beyond the leave itself, what a manager can say, what the plan should list and what a small practice can and cannot offer, the [page for employers and HR](/for/employers-and-hr) is written for you.',
        ],
        template: {
          title: 'HR checklist, from receipt of the request to the return',
          lines: [
            'ON RECEIPT',
            '[ ] Acknowledge in writing the same day: the leave is approved from [date], subject to the medical certificate; name the single point of contact; confirm the employee\'s preferred channel (email).',
            '[ ] Do not ask for a diagnosis, symptoms or treatment. Ask only for the certificate: unable to work, from when, review date.',
            '[ ] Check the ESA entitlement: after 90 days of employment, five paid and three unpaid illness or injury days per calendar year. Apply what remains first if the employee asks.',
            '[ ] Confirm the employee\'s role is held: employment is continuous during leave and they return to the same or a comparable position.',
            '',
            'FIRST FIVE CALENDAR DAYS',
            '[ ] Issue the Record of Employment electronically within five calendar days after the end of the pay period in which the interruption of earnings begins. Reason code D, illness or injury.',
            '[ ] If there is a short-term disability plan: send the employee the claim package, the attending-physician form and the plan\'s deadline, in writing. Note the plan\'s elimination period and what bridges it.',
            '[ ] If there is no STD plan: tell the employee the route is EI sickness benefits, that they should apply as soon as they stop work, and that the ROE has been or will be filed electronically.',
            '[ ] Confirm whether the company tops up EI, and say so either way.',
            '[ ] Confirm continuation of benefits (extended health, life, pension) during the leave and who pays premiums.',
            '',
            'DURING THE LEAVE',
            '[ ] Agree a check-in cadence with the employee, by email, at the review dates on the certificate rather than ad hoc. The check-in is about dates and paperwork, not health.',
            '[ ] Keep all medical documents with HR, not the manager, and separate from the personnel file.',
            '[ ] If the leave outlasts the STD plan, start the LTD claim before STD ends; LTD definitions and waiting periods are the plan\'s.',
            '[ ] Record every date: request received, certificate received, ROE filed, forms sent, review dates.',
            '',
            'BEFORE THE RETURN',
            '[ ] Ask for a fit-to-return note with any functional limitations. Limitations, not diagnosis.',
            '[ ] Build a graduated return-to-work plan in writing: start date, hours per week in each phase, duties in each phase, review dates, who signs off. Four to eight weeks is a common shape.',
            '[ ] Consider the changes the certificate points to (schedule, duties, reporting line). Where a change is requested as an accommodation, document the request and the response.',
            '[ ] Brief the team on the practical facts only: return date and hours. Nothing about the reason.',
            '',
            'ON RETURN',
            '[ ] Meet on day one about the plan, not about the leave.',
            '[ ] Hold the review dates. Adjust the plan in writing if the clinician\'s note changes.',
            '[ ] Note what, if anything, in the work contributed, and what has changed. A return to identical conditions is the usual route to a second leave.',
          ],
        },
      },
      {
        h2: 'Template 4: a one-page graduated return-to-work plan',
        body: [
          'The plan the checklist asks for. Written in the open, agreed by the employee and the employer, with the clinician\'s note as the limit. [Return to work after a mental-health leave](/guides/return-to-work-after-a-mental-health-leave) explains what tends to go wrong without one.',
        ],
        template: {
          title: 'Graduated return-to-work plan',
          lines: [
            'Employee: [name]        Role: [title]        Manager: [name]        HR contact: [name]',
            'Return date: [date]     Plan agreed on: [date]     Clinician\'s note dated: [date]',
            '',
            'Functional limitations from the note (if any): [e.g. no on-call duties until review; no more than six hours a day for the first two weeks]',
            '',
            'Phase 1  [dates]   [hours per day] on [days]   Duties: [list]   Excluded: [list]',
            'Phase 2  [dates]   [hours per day] on [days]   Duties: [list]   Excluded: [list]',
            'Phase 3  [dates]   [hours per day] on [days]   Duties: [list]   Excluded: [list]',
            'Full duties from: [date]',
            '',
            'Review dates: [date], [date]. Who attends: employee, manager, HR.',
            'What happens if a phase is not working: the plan returns to the previous phase and the review is brought forward. This is not a performance matter.',
            'Changes to the work agreed for the return: [schedule / duties / reporting line / other]',
            'Contact during the plan: email, to [name].',
            '',
            'Agreed:  [employee]  [date]      [manager]  [date]',
          ],
        },
      },
      /* 1 Oct 2026. The employer page has the broker's side of this email;
         an employee whose plan does not list a counsellor had nothing to
         send. It asks about the plan, never about the person. */
      {
        h2: 'Template 5: asking HR to add counsellors to the plan',
        body: [
          'For an employee whose plan does not list a Registered Clinical Counsellor, or caps counselling too low to be useful. It asks about the plan, not about you, and says nothing about why you are asking. Coverage changes at renewal, so the useful time to send it is a month or two before the plan year turns over.',
        ],
        template: {
          title: 'Email to HR about the practitioner list',
          lines: [
            'Subject: Extended health plan, mental-health practitioners at renewal',
            '',
            'Hello [name],',
            '',
            'When the extended health plan next renews, could you ask the broker or insurer whether Registered Clinical Counsellors (RCC) and Canadian Certified Counsellors (CCC) can be added to the eligible mental-health practitioners?',
            '',
            'At the moment the plan [lists only psychologists] [has a maximum of $___ a year for mental-health practitioners]. Many counsellors in BC are RCCs, so as it stands much of the counselling available here cannot be claimed.',
            '',
            'The three questions for the broker: are RCC and CCC listed, what is the yearly maximum and is it shared with other practitioners, and what would it cost to add them or raise it.',
            '',
            'Thank you,',
            '[your name]',
          ],
        },
      },
      {
        h2: 'What counselling has to do with any of this',
        body: [
          'A counsellor cannot sign a leave, and no template on this page pretends otherwise. What counselling does is run inside the leave, which is usually what the leave is for, and it is the part that makes the return-to-work plan more than a schedule. A plan that lists a Registered Clinical Counsellor reimburses the sessions, which is plan-dependent and worth checking with the booklet before the first one; [does my plan cover counselling](/resources/does-my-plan-cover-counselling-bc) has the words to use.',
          'If the leave is for somebody on your team rather than for you, the [page for employers and HR](/for/employers-and-hr) is the employer-facing one, with a note a manager can send and an email for the broker at renewal.',
        ],
      },
    ],
    midCta: {
      text: 'If you are working out whether a leave is what you need, or you are on one and want the time inside it to count,',
      label: 'the 30-minute consultation is free and carries no obligation',
    },
    faqs: [
      { q: 'Can I use these templates in Alberta or Ontario?', a: 'The EI sickness and Record of Employment facts are federal and apply everywhere in Canada. The sick-day entitlement, the proof an employer may ask for and the job-protection rules are provincial and the figures on this page are British Columbia\'s. Replace those lines with your province\'s employment standards before using the employee letter or the HR checklist elsewhere.' },
      { q: 'Does my employer have to accept a note from a counsellor?', a: 'A Registered Clinical Counsellor cannot certify a medical leave in BC; the certifying clinician for an employer, an insurer or EI is a physician or nurse practitioner, and EI also accepts certain other regulated professionals it lists. The stress-leave guide explains this in full. A counsellor\'s letter may support a claim as evidence of treatment, which is a different thing.' },
      { q: 'How quickly must the Record of Employment be issued?', a: 'For an electronic ROE on a weekly, biweekly or semi-monthly pay cycle, within five calendar days after the end of the pay period in which the interruption of earnings begins; Service Canada\'s ROE guide sets out the monthly-cycle and paper variants. An employee who is applying for EI sickness benefits should apply as soon as they stop work rather than waiting for the ROE, because electronic ROEs go to Service Canada directly.' },
      { q: 'Is the one-week EI waiting period still in force?', a: 'The standing rule since 1 January 2017 is a one-week waiting period for sickness benefits, which is what this page states. Temporary measures come and go; check the EI sickness page on canada.ca for anything in force on the date you apply, and ask your employer whether they top up the waiting week.' },
      { q: 'Does the employer get to see the medical certificate?', a: 'The employer may ask for reasonably sufficient proof that the absence is due to illness or injury, which a certificate stating that you are unable to work and for roughly how long satisfies. It does not need a diagnosis, and the template asks the clinician to leave one off the copy that goes to work.' },
      { q: 'What if there is no short-term disability plan at all?', a: 'Then the sequence is paid sick days under the Employment Standards Act, then EI sickness benefits after the waiting week, up to 26 weeks. Any employer top-up is the employer\'s choice. The HR checklist has a line for saying which it is, in writing, so the employee is not three weeks in before finding out.' },
      { q: 'Should I tell my team why a colleague is away?', a: 'No. The return date and the hours in the graduated plan are the facts the team needs. The reason is the employee\'s to share or not.' },
    ],
    sources: [
      { label: 'Government of BC, Employment Standards: leaves of absence, illness or injury leave (read 1 Oct 2026)', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'Government of Canada, EI sickness benefits: what these benefits offer (read 1 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' },
      { label: 'Government of Canada, EI sickness benefits: eligibility (read 1 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/qualify.html' },
      { label: 'Government of Canada, EI sickness benefits: how much you could receive (read 1 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/benefit-amount.html' },
      { label: 'Government of Canada, EI sickness benefits: how to apply (read 1 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/apply.html' },
      { label: 'Government of Canada, the EI waiting period (read 1 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/waiting-period.html' },
      { label: 'Government of Canada, how to complete the Record of Employment form (read 1 Oct 2026)', url: 'https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/reports/roe-guide.html' },
      { label: 'Government of Canada, Record of Employment for employers (read 1 Oct 2026)', url: 'https://www.canada.ca/en/employment-social-development/programs/ei/ei-list/ei-roe.html' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC: what it actually takes' },
      { href: '/guides/doctors-note-for-a-mental-health-leave', label: 'The doctor\'s note for a mental-health leave' },
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Return to work after a mental-health leave' },
      { href: '/resources/disability-benefits-and-counselling-bc', label: 'Short- and long-term disability and counselling' },
      { href: '/resources/workplace-mental-health-bc', label: 'Mental health and work in BC' },
      { href: '/for/employers-and-hr', label: 'For employers and HR' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

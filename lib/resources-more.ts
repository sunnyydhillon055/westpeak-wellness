import type { Resource } from './resources';
import { fallbackFee, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { practitioners } from '@/lib/practitioners';
import { acceptingSentences } from '@/lib/practitioner-facts';
import { STUDENT_PLANS, studentPlanFaqs } from './student-plans';
import { CONFIDENTIALITY_LIMITS } from '@/lib/practice-facts';
import { RCC_PLAIN } from '@/lib/site';

/* Minutes for a catalogue type, read rather than typed, beside fallbackFee. */
const minutesOf = (name: string) => FALLBACK_CATALOG.items.find((i) => i.name === name)?.minutes;

/* The range of yearly maximums across the student-society plans, for the
   student resource's short answer. From lib/student-plans.ts, never typed. */
const planMaxes = STUDENT_PLANS.map((p) => p.annualMax);
const MAX_RANGE = `$${Math.min(...planMaxes).toLocaleString('en-CA')} to $${Math.max(...planMaxes).toLocaleString('en-CA')}`;

export const moreResources: Resource[] = [
  {
    slug: 'student-mental-health-supports-bc',
    figure2: "first-session-flow",
    figure: 'therapy-cost-in-bc',
    /* RETITLED 1 Oct 2026 around the question students actually type. The
       page had no clicks at positions 9.9 to 70 under a generic title, and
       it is now the page that answers it, plan by plan
       (lib/student-plans.ts). The free supports stay, below the answer. */
    title: 'Does my student health plan cover counselling? BC student supports',
    metaTitle: 'Does My Student Plan Cover Counselling? BC Student Supports',
    metaDescription:
      'What each BC student-society plan pays for a Registered Clinical Counsellor, read from the plan, plus the free routes: campus counselling, Here2Talk, Foundry.',
    eyebrow: 'BC resource',
    lede:
      'Students have more free support available than almost any other group in the province, and consistently under-use it because nobody explains what it covers.',
    shortAnswer:
      `Every public post-secondary institution in BC provides some counselling to enrolled students at no cost, usually short-term. Alongside that: Here2Talk offers free 24/7 single-session counselling to all BC post-secondary students, Foundry serves anyone aged 12 to 24, and most student societies carry an extended health plan that reimburses a Registered Clinical Counsellor: most of the main BC plans pay ${Math.min(...STUDENT_PLANS.map((p) => p.percent))}% to 100% of a session, with yearly maximums from ${MAX_RANGE}. Most students qualify for at least three of these and know about one.`,
    updated: '2026-10-01',
    readMinutes: 7,
    sections: [
      {
        h2: 'Start with what costs nothing',
        list: [
          { label: 'Here2Talk', detail: 'Free, confidential single-session counselling for students registered at a BC post-secondary institution, available 24/7 by phone, app or online chat. No referral, no waitlist, and it works from anywhere, including outside the province during a term break.' },
          { label: 'Your campus counselling service', detail: 'Every public institution in BC provides counselling to enrolled students at no cost. Typically short-term and typically faster than community services. Availability tightens sharply around midterms and finals, so booking early in a term is a genuine advantage.' },
          { label: 'Foundry, for ages 12 to 24', detail: 'Centres across BC plus a virtual service: free counselling, often with drop-in access, no referral needed. Serves young people whether or not they are in school, and supports caregivers too.' },
          { label: '9-8-8 and 310-6789', detail: 'Crisis and emotional support, 24 hours a day, free from anywhere in the province. Not only for the moment of highest risk.' },
          { label: 'Kids Help Phone', detail: 'Available by phone and text to young people across Canada, 24/7, including for people well into their twenties.' },
        ],
      },
      {
        h2: 'The student health plan almost nobody reads',
        body: [
          'Most student unions in British Columbia include an extended health and dental plan in student fees, and many of those plans reimburse counselling from registered practitioners up to an annual maximum; what yours pays depends on the plan. Students routinely pay for this in September and never use it. The table below shows what the main BC student-society plans pay, read from each plan\'s own page.',
          'Two details determine whether it is useful to you. First, which designations the plan reimburses. Some cover a Registered Clinical Counsellor, some cover only a psychologist, some cover both at different rates. Second, the annual maximum and when it resets, which is often the plan year rather than the calendar year.',
          'These plans usually also have an opt-out window early in the term for students with equivalent coverage elsewhere, such as a parent\'s plan. Opting out of a plan you would have used is a common and avoidable mistake, check the counselling benefit before deciding.',
          'Where you do have private coverage, [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling) sets out how reimbursement works in practice.',
        ],
      },
      {
        h2: 'Where campus counselling runs out',
        body: [
          'Campus services are designed for short-term work, and they are good at it, an acute period, a specific crisis, a decision, adjusting to a first year away from home. For a bounded difficulty, a handful of sessions often does the job.',
          'The limits show up in three places. Session caps mean long-standing patterns and trauma work rarely fit. Demand peaks exactly when students most need it, which is the fortnight before finals. And continuity is difficult across terms, summers and co-op placements, students frequently change counsellor mid-course because of the calendar.',
          'That is not a criticism of a service doing what it was designed to do. It is a reason to know in advance where the ceiling is, and to ask at the first appointment what happens when you reach it.',
        ],
      },
      {
        h2: 'Academic accommodation is a separate route',
        body: [
          'Every public post-secondary institution in BC has an accessibility or accessible-learning office, and mental-health conditions can qualify for academic accommodation: extended deadlines, alternative exam arrangements, reduced course load without losing full-time status for funding purposes, and in some cases retroactive withdrawal from a failed term.',
          'This is a distinct process from counselling, with its own documentation requirements, and it is worth starting **before** a term goes wrong rather than after. Documentation usually has to come from a physician or psychologist rather than a counsellor, because accommodation processes typically require a diagnosis, and a Registered Clinical Counsellor does not diagnose.',
          'Students on StudentAid BC should also check the implications of a reduced course load for funding before reducing it, because the two systems do not always align automatically.',
        ],
      },
      {
        h2: 'For secondary students and their families',
        list: [
          { label: 'School counsellors', detail: 'Every BC school district provides counselling in schools. Availability and caseload vary considerably by district, and the role often covers course planning alongside personal support.' },
          { label: 'Child and youth mental health teams', detail: 'Provincial services offering free assessment and treatment for those under 19, with intake offices across BC. Self-referral is accepted in most regions. A doctor\'s referral is generally not required.' },
          { label: 'Foundry', detail: 'From age 12, including drop-in at physical centres and a virtual service across the province.' },
          { label: 'Kelty Mental Health Resource Centre', detail: 'Provincial resource centre for children, youth and families, information, navigation help and peer support from parents who have used the system.' },
          { label: 'Support for caregivers', detail: 'Parents can access support in their own right rather than only as a route to their child. Foundry and Kelty both work with caregivers directly.' },
        ],
      },
      {
        h2: 'When private counselling makes sense for a student',
        body: [
          'Private counselling is worth considering when campus sessions have run out mid-course, when you need a specific approach the campus service does not offer, when continuity across terms matters, or when your student health plan covers a meaningful share of the fee anyway.',
          'It is also worth it when the difficulty is not about school. Family, relationships, trauma and identity do not respect a semester structure, and a service organised around one is not always the right container.',
          'The practical constraints are real, though. Student budgets are tight, and a plan built without reference to the money tends to end abruptly. Being direct about what you can sustain is a normal conversation, see [weekly vs biweekly sessions](/compare/weekly-vs-biweekly-sessions) and [low-cost counselling in BC](/resources/low-cost-counselling-bc).',
        ],
      },
    ],
    midCta: {
      text: 'If campus sessions have run out and the work was not finished,',
      label: 'a free 30-minute consultation is a straightforward next step',
    },
    faqs: [
      { q: 'Will my university know I used campus counselling?', a: `Counselling records are confidential and separate from academic records. Faculty are not informed. The exceptions are the same legal ones that apply to any counselling: ${CONFIDENTIALITY_LIMITS}.` },
      { q: 'Can I use campus counselling and a private counsellor at the same time?', a: 'Generally yes. Tell both so that neither is working blind and the work is coordinated rather than duplicated.' },
      { q: 'Does my student health plan cover a Registered Clinical Counsellor?', a: 'Many do, and some cover only a psychologist. Check your specific plan booklet for the designation, not just the dollar amount. It is the detail that most often trips people up.' },
      { q: 'I am an international student. Do these apply to me?', a: 'Here2Talk and campus counselling are generally available to all enrolled students regardless of status. Health plan coverage varies: the insurance an institution arranges for the months before MSP is a separate policy from the student society\'s extended health plan, and it is usually the society plan that reimburses counselling. Check which one you are claiming on.' },
      { q: 'Should I claim on my own student plan or a parent\'s plan?', a: 'Your own student plan first, then send what it did not pay to the parent\'s plan. A claim on a parent\'s plan appears in the parent\'s claim history; a claim on your own plan goes to you.' },
      ...studentPlanFaqs(),
    ],
    sources: [
      { label: 'Here2Talk, BC post-secondary student counselling', url: 'https://here2talk.ca/' },
      { label: 'Foundry BC', url: 'https://foundrybc.ca/' },
      { label: 'Kelty Mental Health Resource Centre', url: 'https://keltymentalhealth.ca/' },
    ],
    related: [
      { href: '/for/university-students', label: 'Counselling for post-secondary students' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/guides/waiting-for-therapy-in-bc', label: 'Waiting for therapy in BC' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'workplace-mental-health-bc',
    figure2: "burnout-vs-depression",
    figure: 'reimbursement-flow',
    title: 'Mental health and work in BC: leave, accommodation and coverage',
    /* Retitled 2026-08-28: 230 impressions at 0.87% CTR, and the queries
       finding this page are stress-leave-family — lead with their words. */
    /* Retitled again 6 Sep 2026. Search Console showed this page and
       /guides/stress-leave-bc both ranking at #16-28 for the same six
       "how to get stress leave in bc" queries, and two pages splitting one
       cluster is why neither reached page one. The guide is now the answer
       to "how do I get one"; this page keeps the wider ground it also ranks
       for (accommodation, return to work, "stay at work services") and
       hands the how-to query on in its first section. */
    metaTitle: 'Mental Health at Work BC: Leave, Accommodation | Westpeak',
    metaDescription:
      'What your employer may and may not ask, how accommodation actually works, and where sick leave, short-term disability and a WorkSafeBC claim differ.',
    eyebrow: 'BC resource',
    lede:
      'Most people discover how any of this works at the exact moment they are least able to research it. This is the map, in advance.',
    shortAnswer:
      'BC employees are entitled to paid sick leave under the Employment Standards Act, and mental-health conditions count. Beyond that there are three separate systems that get confused with each other: workplace accommodation under human rights law, disability benefits through an insurer, and WorkSafeBC claims for work-caused injury. Your employer is entitled to know your limitations, not your diagnosis.',
    updated: '2026-10-03',
    readMinutes: 8,
    sections: [
      {
        /* This heading used to read "If you are here to find out how to get a
           stress leave", which is the query it was trying to hand to the guide
           and which kept this page ranking for it. See the note at the top. */
        h2: 'What this page is, and what it is not',
        body: [
          'This page is the wider map: what an employer may ask, how accommodation works, how sick leave, disability insurance and a WorkSafeBC claim differ, and what returning to work can look like.',
          'If you are trying to arrange time away from work for a mental-health reason, the guide on [how to apply for stress leave in BC](/guides/stress-leave-bc) is written for that instead. It covers who can certify one (a physician or nurse practitioner, not a counsellor), how long they usually run, whether yours is paid, and where EI sickness benefits fit.',
        ],
      },
      {
        h2: 'Paid sick leave',
        body: [
          /* 3 Oct 2026: the figures, not a paraphrase of them. Read today on the
             Province's paid sick leave page: five paid and three unpaid days,
             after 90 days with the employer. */
          'Under the BC Employment Standards Act, an employee who has worked for the employer for 90 days gets five paid and three unpaid days of illness or injury leave each calendar year. Mental-health conditions are illness for these purposes. There is no separate or lesser category, and [sick days and mental-health days in BC](/guides/sick-days-and-mental-health-days-bc) covers how to use them.',
          'An employer may ask for reasonable proof that leave is warranted. Reasonable proof is confirmation that you are unable to work and for roughly how long. It is **not** your diagnosis, your treatment, or the content of your appointments, and an employer is not entitled to those.',
          'The Employment Standards Branch covers most provincially regulated workplaces. Federally regulated ones: banks, telecoms, interprovincial transport, and others, sit under the Canada Labour Code, which gives up to 10 paid medical leave days a year and up to 27 weeks of unpaid medical leave, and unionised workplaces are governed by their collective agreement, which frequently provides more.',
        ],
      },
      {
        h2: 'Three systems that get confused',
        list: [
          { label: 'Accommodation (human rights law)', detail: 'A mental-health condition can be a disability under the BC Human Rights Code, and employers have a duty to accommodate to the point of undue hardship. Accommodation is about changing how you work: hours, workload, deadlines, a graduated return, a change of duties, not about time away.' },
          { label: 'Disability benefits (an insurance contract)', detail: 'Short-term and long-term disability are insurance products bought by your employer, governed by a policy rather than by legislation. The insurer decides eligibility using its own definitions, and mental-health claims frequently require more documentation than physical ones. [Short and long-term disability for mental health](/resources/disability-benefits-and-counselling-bc) sets out how a claim runs.' },
          { label: 'WorkSafeBC (a claim against work causation)', detail: 'A separate system for injuries caused by work. Mental-health claims are accepted in defined circumstances, most clearly for a traumatic event experienced at work, and in some cases for cumulative work-related stressors. It requires demonstrating that work caused the condition, which is a higher bar than having it. [WCB psychological injury claims](/resources/worksafebc-psychological-injury-claims) covers the test and the exclusion.' },
        ],
      },
      {
        h2: 'What your employer is entitled to know',
        body: [
          'This is the question that causes the most anxiety and has the clearest answer. Your employer is generally entitled to know your **functional limitations**: what you can and cannot currently do, what accommodations would help, and expected timelines. They are not entitled to your diagnosis, your treatment, your medication or your appointment content.',
          'A well-written medical note therefore describes capacity rather than condition: "unable to work until 14 September" or "able to return to modified duties, no client-facing work, maximum six hours daily for four weeks". It should not name a condition, and a physician will usually write it that way if asked.',
          'An insurer, by contrast, will require considerably more detail, because it is assessing a claim rather than arranging accommodation. That information goes to the insurer, not to your employer, and the distinction matters, insurers are typically permitted to share only what is necessary for administering the claim.',
          'Note also that a Registered Clinical Counsellor does not diagnose, which means counselling notes generally cannot serve as the medical documentation these processes require. That usually needs a physician, nurse practitioner or psychologist. It is worth knowing before a deadline, not after.',
        ],
      },
      {
        h2: 'Accommodations that are commonly workable',
        list: [
          { label: 'Adjusted hours or a later start', detail: 'Frequently the single most effective accommodation where sleep is disrupted or medication causes morning sedation.' },
          { label: 'A graduated return to work', detail: 'Returning at reduced hours and building up over weeks. Better evidenced than a hard return, and reduces the chance of a second absence.' },
          { label: 'Workload or deadline adjustment', detail: 'Temporarily reducing concurrent projects, or extending deadlines, where concentration is affected.' },
          { label: 'A change in duties', detail: 'Moving temporarily away from the specific trigger, the client-facing part, the on-call rotation, the particular site.' },
          { label: 'Remote or hybrid work', detail: 'Genuinely helpful for some presentations and unhelpful for others, since isolation makes low mood worse. Worth thinking about rather than assuming.' },
          { label: 'Time for appointments', detail: 'Protected time for regular counselling or medical appointments, which is a small accommodation with a large effect on whether treatment is sustained.' },
        ],
      },
      {
        h2: 'If a disability claim is denied',
        body: [
          'Denials on mental-health claims are common and they are not the end of the process. Every policy has an internal appeal route with a deadline, and missing the deadline is the most avoidable reason claims fail permanently.',
          'Ask the insurer in writing for the specific reason for denial and the evidence they relied on. Denials frequently rest on insufficient documentation rather than on a judgement that you are well, which is a fixable problem, usually by obtaining more detailed medical evidence addressing the policy\'s specific definition of disability.',
          'Keep records throughout: dates, names, what was said, copies of everything submitted. If you are in a union, involve them early rather than after a denial. Legal advice is available through Access Pro Bono in BC for people who cannot afford a lawyer, and the BC Human Rights Clinic assists with human rights complaints including failures to accommodate.',
        ],
      },
      {
        /* "stay at work services" is the single largest query this page is
           shown for that it did not answer in a heading: 92 impressions in the
           September export, position 48, one FAQ two screens down. 25 Sep 2026. */
        /* 3 Oct 2026: the definition and who provides the service moved to
           /for/employers-and-hr ("Stay-at-work services in BC: who provides
           them"). The query is an employer's (63 impressions at 38.8, the
           results above are providers and insurers), and two pages defining
           the same phrase split it. This section keeps the employee's side. */
        h2: 'If you are offered a stay-at-work plan',
        body: [
          'Most people first meet a stay-at-work plan as a letter from an insurer or HR: instead of a full leave, you keep working with adjustments, such as reduced hours for a period, changed duties, a modified schedule, or treatment arranged alongside work. Who runs these in BC (WorkSafeBC on an accepted claim, a group insurer, an occupational-health provider, sometimes the EFAP) is set out on the [stay-at-work services page for BC employers](/for/employers-and-hr#stay-at-work-services-in-bc-who-provides-them).',
          'Whether one is offered depends on the employer and the plan, not on the diagnosis, and it is worth being clear about what it is and is not. It is a workplace arrangement. It is not care. A plan that changes the hours and leaves the cause untouched tends to become a leave a few months later, which is why counselling commonly runs beside a stay-at-work plan rather than instead of it, and why a good plan names who is providing the treatment.',
          'If you have been offered one, the questions worth asking are who designed it, what it commits the employer to, when it is reviewed, and what happens if it does not work. The [WorkSafeBC route](/resources/worksafebc-psychological-injury-claims) is different again: that is a claim, with its own assessment and its own timelines, and the two are regularly confused.',
        ],
      },
      {
        h2: 'Where counselling fits',
        body: [
          'Counselling does not produce the documentation these systems require, and it is important to be straightforward about that. What it does is work on what is actually happening, the burnout, the anxiety, the aftermath of an incident at work, the decision about whether to stay.',
          'It is also useful for the process itself, which is its own stressor. Preparing for a difficult conversation with a manager, deciding what to disclose and to whom, and managing the strain of an appeal are all legitimate session material.',
          /* 1 Oct 2026: the site's most-shown page ended here on a further
             read, with no tracked booking link and no link to the EFAP
             comparison, which has earned leads of its own. Now an ordered next
             step. The fee is the catalogue's. */
          'If you are not sure whether this is burnout or something that travels with you, the [burnout or depression check](/tools/burnout-or-depression) takes three minutes and stores nothing, and [what you can access, and how soon](/tools/what-can-i-access) sorts the routes open to you, including the free ones most people never use. [Burnout compared with depression](/guides/burnout-vs-depression) and [counselling for healthcare and shift workers](/for/healthcare-and-shift-workers) cover the ground in more depth.',
          '**If you want to talk to someone, the order that usually works.** First, an employee and family assistance programme if your employer has one: it costs you nothing at the point of use, and [EFAP compared with private counselling](/compare/efap-vs-private-counselling) sets out what it covers and where it stops.',
          `**Then, privately.** A Registered Clinical Counsellor by video from anywhere in BC, ${fallbackFee('Individual Counselling')} for a ${minutesOf('Individual Counselling')}-minute individual session, paid at booking with a receipt for your extended health plan. Whether the plan reimburses it depends on the plan.`,
          'Reading this as the manager or HR? [Counselling support for employers and HR](/for/employers-and-hr) is this page from your side of the desk.',
        ],
        book: {
          text: 'A free 30-minute consultation is where the private route starts, and a fair place to ask whether it is the right one:',
          label: 'book one',
          location: 'mid-resource-work',
        },
      },
    ],
    midCta: {
      text: 'If work is the thing that is making you unwell rather than the thing you are recovering to do,',
      label: 'that is worth a free 30-minute consultation',
    },
    faqs: [
      { q: 'Can I see my own counsellor while on a stay-at-work plan?', a: 'Yes. A stay-at-work plan is a workplace arrangement, and it does not choose your treatment for you. You can see a counsellor privately alongside it, booked and paid by you and claimed on your own extended health plan where it covers counselling, and the practice does not report to your employer. A good plan names who is providing the treatment, so it is worth saying who that is when the plan is written.' },
      { q: 'Does my employer have to know my diagnosis?', a: 'Generally no. Employers are entitled to functional limitations and prognosis, not diagnosis. Ask your physician to write the note in terms of capacity rather than condition.' },
      { q: 'Can a counsellor write my sick note?', a: 'Usually not for these purposes. Employers and insurers typically require documentation from a physician, nurse practitioner or psychologist, partly because a Registered Clinical Counsellor does not diagnose.' },
      { q: 'Can I be fired for taking mental-health leave?', a: 'Protected leave and disability-related discrimination are covered by BC employment standards and human rights law. If you believe you have been penalised for taking leave, the Employment Standards Branch and the BC Human Rights Tribunal are the routes.' },
      { q: 'Is burnout covered by disability insurance?', a: 'Burnout is classified as an occupational phenomenon rather than a medical condition, so claims usually turn on an accompanying diagnosable condition. This is exactly why the wording of medical documentation matters.' },
    ],
    sources: [
      { label: 'BC Employment Standards, leaves and job protection', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off' },
      { label: 'BC Human Rights Tribunal', url: 'https://www.bchrt.bc.ca/' },
      { label: 'WorkSafeBC, mental health claims', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'How to get stress leave in BC' },
      { href: '/guides/sick-days-and-mental-health-days-bc', label: 'Sick days and mental-health days in BC' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/for/employers-and-hr', label: 'For employers and HR' },
      { href: '/for/healthcare-and-shift-workers', label: 'Counselling for healthcare and shift workers' },
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/tools/burnout-or-depression', label: 'Burnout or depression? A three-minute check' },
      { href: '/tools/what-can-i-access', label: 'What counselling can you access?' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'verify-a-counsellor-in-bc',
    figure2: "first-session-flow",
    figure: 'designations-bc',
    /* Retitled 6 Sep 2026. Search Console: 1,003 impressions in a month at
       0.1% CTR, position 31, for "registered clinical counsellor" and
       "registered counsellor" queries a title about "a counsellor" did not
       answer. The page's job is to let someone check a Registered Clinical
       Counsellor, so the title now says so. */
    title: 'Registered Clinical Counsellor (RCC): what it means, and how to check one',
    /* ONE PAGE FOR THE RCC CLUSTER - 17 Sep 2026. This page and
       /resources/what-is-a-registered-clinical-counsellor split the largest
       page-three cluster the site has: "registered clinical counsellor" and
       its variants, roughly 900 impressions a quarter, this page at position
       25 with 1,613 impressions and the other at 37 with 199, each with the
       same four-minute check, the same designation table and the same
       answers. The definition now lives here, the other URL redirects, and
       one page carries the signal two were dividing. */
    metaTitle: 'Registered Clinical Counsellor (RCC): Meaning, BCACC Lookup',
    metaDescription:
      "What RCC means after a counsellor’s name in BC, how it differs from “licensed” or “registered counsellor”, and the free four-minute register check.",
    eyebrow: 'BC resource',
    lede:
      'This takes about four minutes and almost nobody does it. It is the single most useful piece of due diligence available to you.',
    /* 1 Oct 2026 (item 269): the answer now opens with what an RCC is, in the
       same words as home, /book and the TrustBar (RCC_PLAIN), so the speakable
       selector (R2 #160) reads a definition first. Most of the 1,515
       impressions are "registered clinical counsellor" at 27 and "what is a
       registered clinical counsellor" at 22.8, and the page answered "how do I
       check one" before saying what one is. */
    shortAnswer:
      `A Registered Clinical Counsellor (RCC) in BC is a counsellor with ${RCC_PLAIN}. It is a professional registration, not a government licence; psychotherapy becomes regulated in BC on 29 November 2027. You can check any RCC free on the BCACC register. ` +
      'To check anyone, ask which designation the person holds and which body holds it, then search that body’s public register yourself: BCACC for a Registered Clinical Counsellor, the College of Health and Care Professionals of BC for a psychologist, the BC College of Social Workers for a social worker. If they hold no designation with any body, there is no complaints process and no minimum standard behind the title.',
    updated: '2026-09-26',
    readMinutes: 6,
    /* 1 Oct 2026 (finishes round 1 #83). Most of this page's 1,515 impressions
       are people looking for an RCC, not checking one: 'registered clinical
       counsellor' 359 at position 27. The page named the two RCCs here once,
       deep in the first section, and gave no fee. The names, reach and
       services are built from the roster (lib/practitioner-facts.ts), so
       nobody not taking new clients is named; the fee is the catalogue's.
       No registration numbers: those stay on the profiles. */
    afterShortAnswer: {
      heading: 'Looking for an RCC rather than checking one?',
      body: [
        `The counsellors taking new clients at this practice are RCCs. ${acceptingSentences(practitioners).join(' ')}`,
        `An individual session is ${fallbackFee('Individual Counselling')} for ${minutesOf('Individual Counselling')} minutes, and every fee is on the [fees page](/pricing). Check them on the register first, then talk to one of them.`,
      ],
      book: 'Book a free 30-minute consultation',
    },
    closingBand: {
      heading: 'Check us on the register, then talk to one of us',
      text: 'Each counsellor’s profile carries her registration number beside a link to her entry on the BCACC register. When you have checked, a free 30-minute consultation by video is the next step, with no obligation to book anything afterwards.',
    },
    sections: [
      {
        h2: 'What the letters actually certify',
        body: [
          'RCC is a designation granted and policed by the **BC Association of Clinical Counsellors (BCACC)**, a professional association founded in 1988. Holding it means the counsellor has cleared a specific bar: a master’s degree in counselling psychology or an equivalent discipline, a period of supervised clinical practice, current professional liability insurance, continuing education that does not stop at registration, and a code of ethics with teeth. There is a formal complaints process, and registrants can be, and are, removed.',
          'Each RCC carries a registration number, and the [RCC Register](https://bcacc.ca/search-our-member-register/) is public and free to search. That combination. A number plus a register anyone can check in two minutes, is the practical meaning of the designation. A claim you can verify is categorically different from a claim you have to take on trust, and the walkthrough below shows exactly where to look.',
          /* The sentence naming the two RCCs here moved up to afterShortAnswer,
             with their reach, services and the fee, 1 Oct 2026. */
          'What the designation is *not*: a government licence. That distinction is not a technicality in British Columbia, and it has its own section below, because it is the thing most pages on this subject skate past.',
        ],
      },
      /* 1 Oct 2026 (item 269): was "RCC, CCC, RSW, R.Psych, a thirty-second
         orientation", the last section on the page. Renamed to the phrases
         people search ("registered clinical counsellor" 359 at 27.1,
         "registered counsellor" 143 at 31.1, "clinical counsellor" 31 at
         30.5, "licensed counsellor" 14 at 31.1, Search Console 26 Sep), moved
         up beside the definition, and opened with the two answers that were
         only in the FAQ. */
      {
        h2: 'Registered counsellor, clinical counsellor, licensed counsellor: what each title means in BC',
        body: [
          '**"Registered counsellor" almost always means an RCC.** When a website or an insurer in BC says "registered counsellor" or "clinical counsellor", it nearly always means a Registered Clinical Counsellor on the BCACC register. The precise question is which register the person is on, since "registered" on its own could refer to any association, including ones with no clinical requirements.',
          '**BC has no "licensed counsellor".** The phrase is American; there is no BC licence corresponding to it. Somebody advertising as a licensed counsellor in BC may be perfectly qualified, but the word "licensed" is not carrying the meaning it appears to carry. What exists in BC is *registration*: RCC through BCACC, CCC through the Canadian association, R.Psych and RSW through their colleges.',
          'The alphabet is genuinely confusing, so: **RCC** (BC association, master’s-level, therapy), **CCC** (Canadian Certified Counsellor, the national association’s equivalent, also master’s-level), **RSW/RCSW** (social workers, statutory college, clinical registration can include diagnosis), **R.Psych** (doctoral, statutory college, diagnosis and formal assessment). All four are real, checkable designations held by real therapists; the practical differences are scope, cost and what your insurance lists.',
          'If you are choosing between them for your own care, that decision has its own page, [RCC vs psychologist vs social worker](/compare/rcc-vs-psychologist-vs-social-worker-bc): with fees, scope and coverage side by side. This page’s job is smaller: when you see "RCC" after a name, you now know precisely what it certifies and how to confirm it.',
        ],
      },
      /* 1 Oct 2026 (item 269): this section and "Why this is necessary in BC
         specifically" both opened with "not protected titles" and worded the
         change of regulation differently, one dated and one not. Merged here,
         keeping the dated sentence; the second heading and its TOC entry are
         gone. */
      {
        h2: 'The uncomfortable context: counselling is not yet regulated in BC',
        body: [
          'In British Columbia today, **"counsellor", "therapist", "psychotherapist" and "life coach" are not protected titles.** Anyone may use them, with no required training, no supervised practice, no insurance and no complaints route. "Psychologist" and "social worker" are protected by statutory colleges; the words most people actually search for are not. This is the current state of the law, and it is why the letters after a practitioner’s name carry the weight they do here.',
          'What carries meaning is the **designation**: RCC, R.Psych, RSW, RCSW, CCC. Each is held by a body with entry requirements and a process for investigating complaints. The designation is what gives you somewhere to go if something goes wrong.',
          '**This changes in 2027.** Under the Health Professions and Occupations Act, psychotherapy is being brought under the College of Health and Care Professionals of BC, with regulation of the profession beginning 29 November 2027. Until then, the register is your protection, and a practitioner who displays a checkable registration number is telling you they want to be checked.',
        ],
      },
      {
        h2: 'The four-minute check',
        list: [
          { label: '1. Get the exact designation and full name', detail: 'From the website or by asking directly. "I am a counsellor" is not a designation. RCC, R.Psych, RSW, RCSW and CCC are.' },
          { label: '2. Find the right body', detail: 'RCC is held by the BC Association of Clinical Counsellors. Registered Psychologist is regulated by the College of Health and Care Professionals of BC. Registered Social Worker is regulated by the BC College of Social Workers. Canadian Certified Counsellor is held by the Canadian Counselling and Psychotherapy Association.' },
          { label: '3. Search that body\'s public register', detail: 'Each keeps a searchable register. For an RCC it is BCACC’s RCC Register, searchable by name or registration number, not its Find a Counsellor directory, which lists only counsellors who choose to be listed. Go to the body’s own website rather than following a link from the practitioner’s site.' },
          { label: '4. Check status, not just presence', detail: 'A register entry shows current standing. Look for whether the registration is active, and whether the body publishes any disciplinary history.' },
          { label: '5. If they are not listed, ask why', detail: 'There are innocent explanations, a recent name change, registration under a different legal name, membership of a body you have not checked. There are also non-innocent ones. A registered professional will answer this question without offence.' },
        ],
      },
      {
        h2: 'What each designation actually requires',
        body: [
          'A **Registered Clinical Counsellor (RCC)** holds a master\'s degree in counselling or a closely related field, has completed supervised clinical hours, maintains continuing education and liability insurance, and works under the BCACC code of ethics.',
          'A **Registered Psychologist (R.Psych)** typically holds a doctoral degree and is a regulated health professional, the designation qualified to conduct formal psychological assessment and diagnosis, which counsellors are not.',
          'A **Registered Social Worker (RSW)** is regulated by the BC College of Social Workers; the RCSW designation denotes clinical specialisation. Many social workers in clinical practice provide counselling.',
          'A **Canadian Certified Counsellor (CCC)** holds a national certification through the Canadian Counselling and Psychotherapy Association. Some BC counsellors hold both CCC and RCC.',
          '[The full comparison](/compare/rcc-vs-psychologist-vs-social-worker-bc) sets out what each can and cannot do, which matters if you need something specific like a formal assessment.',
        ],
      },
      {
        h2: 'Beyond the register: other things worth checking',
        list: [
          { label: 'Training in a specific method', detail: '"EMDR-trained" covers a wide range. Asking what level of training someone completed, and with which training body, is a normal question a properly trained clinician will answer directly.' },
          { label: 'Liability insurance', detail: 'Required for RCC registration. Fair to ask about for anyone whose designation does not require it.' },
          { label: 'Whether they will state their scope', detail: 'A practitioner who names what they do not work with is showing you good judgement. Anyone claiming to treat everything is telling you something else.' },
          { label: 'How fees and cancellations work, in writing', detail: 'Ambiguity here rarely resolves in your favour.' },
          { label: 'Whether the site carries testimonials', detail: 'Client testimonials are prohibited under BCACC advertising standards. A practice displaying them is either not bound by those standards or not following them.' },
        ],
      },
      {
        h2: 'If something has gone wrong',
        body: [
          'If the practitioner is registered, complain to the body that holds the designation. BCACC administers a [complaints process](https://bcacc.ca/complaints-and-investigations/) for RCCs that is independent of any individual counsellor, and you do not need that counsellor\'s knowledge or agreement to use it. The College of Health and Care Professionals of BC and the BC College of Social Workers have statutory processes for their registrants.',
          'If the concern is specifically about privacy: how your information was collected, used, stored or disclosed, the Office of the Information and Privacy Commissioner for BC oversees private organisations under the Personal Information Protection Act.',
          'If the practitioner holds no designation at all, there is no professional body to complain to. Depending on what happened, the remaining routes are Consumer Protection BC, small claims, or the police. That asymmetry is the entire practical argument for checking first.',
        ],
      },
      {
        h2: 'What an RCC can and cannot do',
        list: [
          { label: 'Provide psychotherapy, the core of the work', detail: 'Individual, couples and family counselling for anxiety, depression, trauma, relationships and the rest of the territory, using recognised modalities. This is what the training is for.' },
          { label: 'Cannot formally diagnose', detail: 'Diagnosis in BC sits with physicians, psychiatrists, psychologists and clinical social workers with the relevant registration. An RCC works with what you are experiencing; the label on a file, where one is needed, comes from elsewhere. The three-way comparison covers when that matters.' },
          { label: 'Cannot prescribe', detail: 'Medication is physician work, always. An RCC coordinates with your doctor, with your written consent, rather than replacing them.' },
          { label: 'Issues receipts for extended-health claims', detail: 'Many BC extended-health plans reimburse RCC counselling, depending on the plan. Plans list professions, not services, so the wording check in the coverage guide comes before the first session, not after.' },
          { label: 'Answers to a code of ethics', detail: 'Including the advertising standards that prohibit testimonials and outcome claims, which is why a BCACC practice with no reviews page full of five-star quotes is following the rules, not hiding something.' },
        ],
      },
    ],
    midCta: {
      text: 'Every claim on this site is checkable, and you are encouraged to check it: ',
      label: 'then book a free 30-minute consultation',
    },
    faqs: [
      /* "bcacc find a counsellor", 47 impressions a month at position 9.6 and
         nothing on this page that says how. 26 Sep 2026. */
      /* 1 Oct 2026: rewritten to separate the two tools. The old answer called
         the directory "the register" and said a counsellor missing from it
         should be asked why, but the directory is opt-in: a current RCC can
         switch her listing off, and one of this practice's own counsellors
         has. The register is the check. */
      { q: 'How do I use the BCACC Find a Counsellor tool?', a: 'BCACC has two tools, and they answer different questions. Find a Counsellor, at bc-counsellors.org, is for finding someone: filter by city, concern, language and whether they offer online sessions. It lists only RCCs who choose to be listed, so a counsellor missing from it tells you nothing. To check a particular counsellor, use the RCC Register instead (bcacc.ca/search-our-member-register): search by name or registration number, and it shows whether the registration is active and any notes.' },
      { q: 'What does RCC stand for?', a: 'Registered Clinical Counsellor: the designation granted by the BC Association of Clinical Counsellors (BCACC) to counsellors who meet its education, supervision, insurance and ethics requirements. It is a BC designation; the national equivalent from the Canadian Counselling and Psychotherapy Association is CCC, Canadian Certified Counsellor.' },
      { q: 'Is a registered counsellor the same as a Registered Clinical Counsellor?', a: 'In BC, in practice, yes: when a website or an insurer says "registered counsellor" it almost always means an RCC, because BCACC is the BC association that grants the designation. The precise question to ask is which register the person is on, since "registered" on its own could refer to any association, including ones with no clinical requirements.' },
      { q: 'What is the difference between an RCC and a psychologist?', a: 'Training level and scope. A registered psychologist in BC holds a doctorate, is regulated under the College of Health and Care Professionals of BC, and can formally diagnose and conduct psychological assessments. An RCC holds a master\'s degree, is registered with a professional association rather than a regulatory college until 2027, and provides counselling and psychotherapy but does not diagnose. For talk therapy the two overlap heavily; for a diagnosis or an assessment you need the psychologist. Fees differ accordingly.' },
      { q: 'Is an RCC a real therapist?', a: 'Yes: master’s-level training, supervised hours, insurance, continuing education and a code of ethics with a complaints process. The designation exists precisely to separate trained, accountable practitioners from the anyone-at-all who may legally use the word "counsellor" in BC today.' },
      { q: 'Is RCC the same as a licensed counsellor?', a: 'There is no such thing as a "licensed counsellor" in BC. The phrase is American. RCC is a professional registration, which is the closest thing BC currently has, and it becomes a regulated-profession framework when psychotherapy comes under the College of Health and Care Professionals of BC in late 2027.' },
      { q: 'Does insurance cover an RCC?', a: 'Commonly, not universally. Many extended health plans reimburse RCC counselling, depending on the plan; some list only psychologists and social workers. The plan wording, not the plan brand, decides, and the coverage guide lists the exact questions to ask.' },
      { q: 'What does it take to become an RCC?', a: 'A master’s degree in counselling psychology or a closely related field, supervised clinical practice, professional liability insurance, continuing education, and agreement to the BCACC code of ethics and complaints process. Current requirements live on the BCACC site, since they do change.' },
      { q: 'What happens to RCCs when regulation arrives in 2027?', a: 'Psychotherapy becomes a regulated profession under the College of Health and Care Professionals of BC on 29 November 2027, on a protected-title model. The practical effect for clients: the accountability that is currently voluntary through BCACC becomes statutory. Existing qualified practitioners transition into the new framework.' },
      { q: 'What is a registered counsellor in BC?', a: 'In BC "registered counsellor" almost always means a Registered Clinical Counsellor (RCC), a member of the BC Association of Clinical Counsellors who holds a master\'s degree, has completed supervised clinical hours, carries liability insurance and is bound by a code of ethics and a complaints process. Registration is voluntary until psychotherapy is regulated in 2027, which is exactly why checking the register matters: the title "counsellor" alone certifies nothing.' },
      { q: 'How do I check if a counsellor is registered in BC?', a: 'Ask which designation they hold, then search that body\'s own public register: BCACC’s RCC Register for an RCC, the College of Health and Care Professionals of BC for a psychologist, the BC College of Social Workers for a social worker. Search by surname. A registered person appears with their status; a name that returns nothing means the designation is not held, whatever the website says.' },
      { q: 'Is it rude to check?', a: 'No, and a registered professional will not be offended. Public registers exist precisely so that anyone can search them without asking permission.' },
      { q: 'What if someone is registered but has no complaints history shown?', a: 'That is the normal case. Most practitioners have no disciplinary history, and its absence is not evidence of anything either way.' },
      { q: 'Does a counsellor have to be registered in BC to see me?', a: 'A counsellor must be appropriately registered in the jurisdiction where the client is physically located during the session. This is why you are asked where in BC you are, and why it matters if you travel.' },
      { q: 'Are there good counsellors without a designation?', a: 'Possibly. The point is not that everyone unregistered is unskilled. It is that you have no way to tell, and no recourse if it goes wrong.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'BCACC, RCC Register (to verify a counsellor)', url: 'https://bcacc.ca/search-our-member-register/' },
      { label: 'BCACC, Find a Counsellor (an opt-in directory, to find one)', url: 'https://bc-counsellors.org/counsellors/' },
      { label: 'BCACC, complaints and investigations', url: 'https://bcacc.ca/complaints-and-investigations/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
      { label: 'BC College of Social Workers', url: 'https://bccsw.ca/' },
    ],
    related: [
            { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/guides/questions-to-ask-a-therapist', label: 'Questions to ask a therapist' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/glossary', label: 'Counselling glossary' },
      { href: '/resources/finding-a-counsellor-in-punjabi-or-tagalog-in-bc', label: 'Checking a Punjabi- or Tagalog-speaking counsellor, for the person helping' },
    ],
  },

  {
    slug: 'psychiatry-and-assessment-in-bc',
    figure2: "bc-support-routes",
    figure: 'bc-reach',
    title: 'Getting a psychiatrist or a formal assessment in BC',
    metaTitle: 'Psychiatry & Assessment in BC | Westpeak',
    metaDescription:
      'How to get a psychiatric referral in BC without a family doctor, what a private ADHD or psychological assessment costs, and the wait for each route.',
    eyebrow: 'BC resource',
    lede:
      'Counselling cannot diagnose, cannot prescribe, and cannot assess. Here is what to do when one of those is what you actually need.',
    shortAnswer:
      'Psychiatry in BC is covered by MSP and requires a referral from a physician or nurse practitioner; waits are often long. Formal psychological assessment: ADHD, autism, psychoeducational, cognitive: requires a registered psychologist, is largely not covered by MSP in private practice, and can be expensive. Without a family doctor, walk-in clinics, the Health Connect Registry and virtual care are the practical routes to a referral.',
    updated: '2026-09-17',
    readMinutes: 7,
    sections: [
      {
        h2: 'Which professional does what',
        list: [
          { label: 'Psychiatrist', detail: 'A medical doctor specialising in mental health. Diagnoses, prescribes and manages medication, and handles complex presentations. Covered by MSP. Requires a referral from a physician or nurse practitioner.' },
          { label: 'Family physician or nurse practitioner', detail: 'Can diagnose and prescribe for many common presentations, and is the gateway to a psychiatric referral. For a substantial proportion of people, this is the appropriate medical route and psychiatry is not needed.' },
          { label: 'Registered psychologist', detail: 'The designation qualified to conduct formal psychological assessment: ADHD, autism, psychoeducational, cognitive. Does not prescribe. Largely not covered by MSP in private practice.' },
          { label: 'Registered Clinical Counsellor', detail: 'Provides counselling and psychotherapy. Does not diagnose, prescribe or conduct formal assessment. See the [stated scope](/standards).' },
        ],
      },
      {
        h2: 'How a psychiatric referral works',
        body: [
          'You cannot self-refer to a psychiatrist in British Columbia. The route runs through a family physician or nurse practitioner, who assesses and, if appropriate, refers. Waits vary widely by region and by urgency, and can run to many months for a non-urgent referral.',
          'Two things improve the outcome of that appointment. First, arrive with a written timeline rather than a summary, when it started, what has changed, what has been tried, what effect it had. Fifteen minutes of prepared notes is worth more than an hour of recollection under pressure. Second, ask directly what the referral is for: medication review, diagnostic clarification, or ongoing management. These lead to different services.',
          'Urgent presentations move differently. Emergency departments have psychiatric assessment capacity, and health authorities operate urgent-response services in most regions. If risk is immediate, that is the route rather than a referral, **9-1-1**, or **9-8-8** by call or text for crisis support.',
        ],
      },
      {
        h2: 'If you do not have a family doctor',
        list: [
          { label: 'The Health Connect Registry', detail: 'BC\'s provincial registry for attaching people to a family physician or nurse practitioner. Register even if the wait is long. It is the main route to attachment.' },
          { label: 'Walk-in clinics and urgent and primary care centres', detail: 'Both can make referrals. Continuity is poorer, so bring your written history each time rather than assuming it carries over.' },
          { label: 'Virtual care', detail: 'Several MSP-covered virtual services operate in BC and can assess and refer. Verify that a service bills MSP rather than charging privately before booking.' },
          { label: 'HealthLink BC at 8-1-1', detail: 'Free health information and navigation, 24 hours a day, including help identifying which service you actually need.' },
          { label: 'Foundry, for ages 12 to 24', detail: 'Many centres offer primary care alongside counselling, which can shorten the route considerably for young people.' },
        ],
      },
      {
        h2: 'Formal psychological assessment',
        body: [
          'Assessments for ADHD, autism, learning differences and cognitive functioning are conducted by registered psychologists. They involve structured testing across several hours plus a written report, and they are the documentation that academic accommodation, workplace accommodation and some disability processes require.',
          'The cost is the obstacle. Private assessment in BC generally runs into the thousands of dollars, and MSP does not cover psychological assessment in private practice. Some extended health plans contribute, often with a per-year maximum well below the total, and some student plans cover part of a psychoeducational assessment.',
          'There are lower-cost routes worth pursuing: training clinics at universities with graduate psychology programmes offer assessment at reduced rates under supervision; school districts conduct psychoeducational assessments for students, with waitlists; and some health-authority services assess within specific programmes. All involve waiting, and all are considerably cheaper.',
          'A counsellor cannot conduct or substitute for any of this, and any practitioner suggesting otherwise is working outside their scope.',
        ],
      },
      {
        h2: 'When counselling is the right route anyway',
        body: [
          'A large proportion of people who think they need a psychiatrist need something else. Psychiatry is a medical specialty for diagnosis and medication management of more complex presentations. It is not, generally, where you go for weekly talking therapy, and most psychiatrists in BC do not provide ongoing psychotherapy.',
          'If what you want is to work on patterns, relationships, trauma or skills, counselling is the direct route and needs no referral, no diagnosis and no waitlist in private practice. If what you want is a medication conversation, a family physician can often handle it without a psychiatric referral at all.',
          'And the two coexist perfectly well. Plenty of people see a prescriber for medication and a counsellor for the work, and with written consent the two can coordinate directly. [Therapy, medication, or both](/compare/therapy-medication-or-both) sets out how that decision is usually framed.',
        ],
      },
    ],
    midCta: {
      text: 'If you are not sure whether you need a counsellor, a doctor or an assessment,',
      label: 'a free 30-minute consultation will tell you honestly',
    },
    faqs: [
      /* Search Console, 17 Sep 2026: 'can a counselor refer you to a psychiatrist' at position 7, 'how to see a psychiatrist in bc', 'psychiatrist referral', 'private psychiatrist bc'. */
      { q: 'Can a counsellor refer me to a psychiatrist?', a: 'Not directly. In BC a psychiatry referral comes from a physician or nurse practitioner, and MSP covers the consultation on that basis. What a counsellor can do is write to your doctor describing what they are seeing and why a psychiatric opinion would help, which makes the referral easier to get and more likely to be triaged well. If you have no family doctor, an urgent and primary care centre can refer.' },
      { q: 'How do I see a psychiatrist in BC?', a: 'Through a referral from a physician or nurse practitioner, which MSP covers; there is no self-referral and, with rare exceptions, no private psychiatry to pay for. Waits are commonly months. While waiting, a family doctor can start treatment, a psychiatric consultation service for primary care can advise your doctor quickly, and counselling can begin at once, since it does not need the referral.' },
      { q: 'Psychiatrist vs psychologist: what is the difference?', a: 'A psychiatrist is a medical doctor who specialises in mental illness, can prescribe medication, and is covered by MSP on referral from a physician or nurse practitioner. A registered psychologist holds a doctorate in psychology, can diagnose and conduct formal assessments, cannot prescribe, and in private practice is paid out of pocket or through extended health. Neither is the usual first step for talk therapy; that is a counsellor or psychologist, and the psychiatrist enters when medication or a complex diagnosis is in question.' },
      { q: 'What is a psychiatric consultation service for primary care?', a: 'In BC, family doctors and nurse practitioners can consult a psychiatrist about a patient without the patient being referred, through services such as the Rapid Access to Consultative Expertise (RACE) line. For you it means your own doctor may be able to get specialist advice on diagnosis or medication within days, when a full psychiatry referral could take months. Ask your doctor whether a consultation, rather than a referral, would answer the question.' },
      { q: 'Can I refer myself to a psychiatrist in BC?', a: 'No. A referral from a physician or nurse practitioner is required. Some urgent-response services can be accessed more directly in a crisis.' },
      { q: 'Does MSP cover a psychologist?', a: 'Psychological services in private practice are generally not covered by MSP. Psychologists working within some public health-authority programmes are, but access is limited and usually programme-specific.' },
      { q: 'Can a counsellor diagnose ADHD?', a: 'No. Formal assessment requires a registered psychologist, and diagnosis may also come from a physician or psychiatrist depending on the condition and the purpose.' },
      { q: 'How long do psychiatry waits actually run?', a: 'It varies substantially by region and urgency and can extend to many months for non-urgent referrals. Ask the referring clinician for the current local picture rather than relying on general figures.' },
    ],
    sources: [
      { label: 'HealthLink BC, call 8-1-1', url: 'https://www.healthlinkbc.ca/' },
      { label: 'BC Provincial Attachment System, Health Connect Registry', url: 'https://www2.gov.bc.ca/gov/content/health/accessing-health-care/bcs-primary-care-system/provincial-attachment-system' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
    ],
    related: [
      { href: '/compare/therapy-medication-or-both', label: 'Therapy, medication, or both?' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/guides/waiting-for-therapy-in-bc', label: 'Waiting for therapy in BC' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
      { href: '/refer/doctor', label: 'A one-page summary to take to your doctor' },
    ],
  },

  /* Added 2026-08-28, from Search Console evidence rather than instinct: the
   * definitional cluster — "registered clinical counsellor", "rcc bc", "rcc
   * designation", "registered counsellor", "licensed counsellor" — was the
   * site's single largest impression source (~170 in the last window) with
   * NO page built for it. The comparison page ranks 17–25 on the "…vs
   * psychologist" phrasings because that is its intent; the bare
   * definitional query was landing on it at position 40+ because nothing
   * better existed. This page carries the definitional intent; the compare
   * page keeps the choosing intent; they link each other. */

  /* The two system-navigation resources of the work-and-money cluster,
   * 2026-08-28 — companions to the four guides in guides-more7.ts. Same
   * discipline: BC-specific, procedural, sourced, no clinical content and
   * no invented figures. Where a number depends on a specific plan or
   * policy, the page says "check the wording" instead of guessing. */
  {
    slug: 'worksafebc-psychological-injury-claims',
    figure2: 'bc-support-routes',
    figure: 'bc-support-routes',
    title: 'WorkSafeBC psychological-injury claims, explained',
    /* Retitled 1 Oct 2026. The 17 Sep title led with "WCB Stress Leave in
       BC" because that is what people typed; the 26 Sep export shows the
       cost: this page draws 58 impressions at 22.78 on a cluster that
       /guides/stress-leave-bc should own outright, and "wcb stress leave bc"
       itself sits at 36. The claim is this page's job, so the title leads
       with it; "WCB" and stress leave stay in the description, where they
       describe the page rather than compete for the other one's query.
       Same day, later: "WCB" back in the title. The 26 Sep export has
       "wcb stress leave bc" (46 impressions at 36) and "worksafebc stress
       leave" (19 at 24.9), and the retitle had dropped the one word both
       share with the old title. The title still leads with the claim, so
       the one-page-per-cluster decision holds: "stress leave" stays out. */
    metaTitle: 'WCB Psychological Injury Claims in BC (WorkSafeBC)',
    metaDescription:
      'When a work-related mental injury is a WCB claim rather than a stress leave in BC, what the claim requires, and the exclusion everyone trips over.',
    eyebrow: 'Resource · Work & money',
    lede:
      'A stress leave says "I am unwell and need time." A WorkSafeBC claim says something stronger: "work injured me." Different systems, different tests, and mixing them up costs people months.',
    shortAnswer:
      'WorkSafeBC compensates psychological injury in two situations: a reaction to one or more traumatic events at work, or a mental disorder predominantly caused by significant work-related stressors, which includes bullying and harassment. Two hard edges define the system: the condition must be diagnosed by a psychologist or psychiatrist (not self-described burnout), and injuries caused by ordinary employer decisions: workload changes, discipline, termination, are excluded by statute. A claim is not a lawsuit and costs nothing to file; it is also not the right tool for every bad workplace, and this page is honest about which is which.',
    updated: '2026-10-03',
    readMinutes: 7,
    sections: [
      {
        h2: 'The two doors into a claim',
        body: [
          'The first door is **traumatic events**: a worker experiences or witnesses something at work of the kind nobody is expected to absorb: violence, a serious accident, a death, a threat. First responders and health-care workers are the obvious cases, but the door is not restricted to them; a bank teller in a robbery or a transit worker after a fatality stands in the same doorway. If what you have is strain rather than an injury with a work cause, this is not your page: [how stress leave works in BC](/guides/stress-leave-bc) is the route for that, and most people who search "WCB stress leave" belong there.',
          'The second door is **significant work-related stressors**: a mental disorder predominantly caused by ongoing, exceptional workplace stressors, and BC explicitly includes **bullying and harassment** here. "Significant" is doing legal work in that sentence: it means beyond the ordinary pressures of employment, sustained or severe, and documented well enough to be found as fact.',
          'Both doors require the same key: a **diagnosis by a psychologist or psychiatrist** of a recognised condition. Distress, burnout, and "my doctor said stress" do not open either door on their own, which is not a comment on how real they are, only on what this particular system requires. Getting that assessment is usually the first practical step of a serious claim.',
        ],
      },
      {
        /* THE PRESUMPTION — 3 Oct 2026. "wcb stress leave bc" (37 impressions
           at 34.4) and "worksafebc stress leave" (12 at 26.1), Search Console
           3 Oct. The page never mentioned the rule that decides most
           first-responder and health-care claims. Read today from WorkSafeBC's
           mental-health claims page and its 10 June 2024 announcement. */
        h2: 'WCB stress leave in BC for first responders, nurses and other listed jobs',
        body: [
          'For some occupations the law presumes the work caused it. If a worker in an eligible occupation is exposed to one or more traumatic events at work and a psychiatrist or psychologist diagnoses a mental disorder that can arise from that exposure, WorkSafeBC presumes the disorder is work-related unless the contrary is shown. The worker does not have to prove the link; the diagnosis is still required.',
          'The presumption covered police officers, firefighters, paramedics (emergency medical assistants), sheriffs, correctional officers, emergency response dispatchers, nurses and publicly funded health-care assistants first. From 10 June 2024 it was extended to eleven more: community-integration specialists, coroners, harm-reduction workers, parole officers, probation officers, respiratory therapists, shelter workers, social workers, transition house workers, victim service workers and withdrawal-management workers. WorkSafeBC’s practice directive defines each occupation, and that definition is what decides a claim.',
          'Outside those occupations, or for a stressor rather than a traumatic event, the ordinary test above applies. Counselling for workers in these roles, alongside or outside a claim, is on [counselling for healthcare and shift workers](/for/healthcare-and-shift-workers).',
        ],
      },
      {
        h2: 'The exclusion everyone trips over',
        body: [
          'The statute excludes mental disorders caused by **decisions of the employer relating to the employment**: changes to workload, deadlines, performance management, discipline, transfers, termination. A depression caused by an unbearable workload or a demotion, however genuine, is generally not compensable through this system. That single sentence sorts most workplace-mental-health situations out of WorkSafeBC and into other tools.',
          'The line is genuinely fine and worth stating carefully: a crushing workload is excluded as an employer decision, but harassment dressed up as performance management is not, and adjudicators do look behind labels. If what happened to you sits near that line, it is worth a conversation with the Workers’ Advisers Office. A free, government-funded service that advises workers on claims, before deciding anything.',
          'If the exclusion applies to your situation, you are not without tools; you are holding different ones: the [stress-leave path](/guides/stress-leave-bc) with [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy), your [extended-health coverage](/resources/bc-extended-health-coverage-for-counselling) for treatment, the ESA and Human Rights Code for the employment side, and, where bullying is the issue, WorkSafeBC’s separate prevention lane for bullying-and-harassment complaints, which is about stopping conduct rather than compensating injury.',
        ],
      },
      {
        h2: 'How a claim actually runs, and where counselling fits',
        list: [
          { label: 'Report early', detail: 'Tell your employer, see a doctor, and report to WorkSafeBC promptly. There is a one-year time limit on filing, and contemporaneous records beat reconstructed ones in every adjudication ever run.' },
          { label: 'Expect a psychological assessment', detail: 'The diagnosis requirement means an assessment by a psychologist or psychiatrist is part of the process. Waits for these are real; the claim can be filed while the assessment is pending.' },
          { label: 'Accepted claims fund treatment', detail: 'An accepted psychological-injury claim can cover treatment and wage-loss benefits. One of the few routes in BC where therapy for the injury is paid rather than reimbursed. The treatment itself runs through WorkSafeBC’s provider arrangements.' },
          { label: 'This practice’s honest position', detail: 'Westpeak Wellness is not a WorkSafeBC provider, and claim-funded treatment happens inside their network. Where this practice fits is everything around the claim: the parallel private counselling many workers want during a long adjudication, and the situations the exclusion sorts out of the system altogether.' },
          { label: 'Denials are appealable', detail: 'Psychological claims are denied more often than physical ones and overturned on review often enough to matter. The Workers’ Advisers Office exists for exactly this and costs nothing.' },
      ],
      },
    ],
    midCta: {
      text: 'If your situation sits in the excluded middle, injured by work but outside the claim system. That is precisely the territory ordinary counselling serves.',
      label: 'Book a free consultation',
    },
    faqs: [
      /* Search Console, 17 Sep 2026: wcb stress leave bc (36 impressions), worksafebc stress leave, wcb stress leave; the page never used the initials. */
      { q: 'Can I get stress leave through WCB in BC?', a: 'Only where the work caused the injury. WorkSafeBC, which most people still call WCB, accepts a mental disorder claim when it arises from a traumatic event at work or from a significant work-related stressor such as bullying and harassment, and pays wage loss on an accepted claim. Ordinary overload is usually not accepted. A stress leave that is not work-caused goes through a doctor, sick days and EI or a disability plan instead, and the [stress leave guide](/guides/stress-leave-bc) covers that route.' },
      { q: 'Can I claim WorkSafeBC for stress or burnout?', a: 'Not for ordinary job stress or burnout as such. Compensable psychological injury requires either work-related traumatic events or significant work-related stressors, including bullying and harassment, plus a psychologist’s or psychiatrist’s diagnosis of a recognised disorder. Ordinary workload pressure and employer decisions like discipline or termination are excluded by statute.' },
      { q: 'Does bullying at work qualify?', a: 'It can, bullying and harassment are named examples of significant work-related stressors. The claim still needs the formal diagnosis and evidence that the conduct was beyond ordinary employment pressures, which is where documentation (dates, messages, witnesses) becomes decisive. There is also a separate WorkSafeBC prevention route aimed at stopping the conduct itself.' },
      { q: 'Do I need a lawyer to file?', a: 'No, filing is free and the system is designed to be used without one. For advice, the Workers’ Advisers Office is a free government service for exactly these questions, including whether your situation clears the "significant stressor" bar and how to handle a denial.' },
      /* 3 Oct 2026: "worksafebc counselling" (2 at 14.5), "work injury
         counselling bc" (2 at 15), "worksafebc counselling bc". */
      { q: 'Does WorkSafeBC pay for counselling?', a: 'On an accepted claim, yes: WorkSafeBC says benefits on a mental health claim may include wage-loss payments, treatment costs, prescription medication and return-to-work support, and its mental health claims team arranges the treatment, which runs through its own providers. Before a claim is accepted, or when the situation falls outside the claim system, counselling is paid privately or through an extended health plan where it covers counselling. Westpeak Wellness is not a WorkSafeBC provider.' },
      { q: 'Can I see my own counsellor during a claim?', a: 'You can always see whoever you choose privately, through extended health or out of pocket, including while a claim is adjudicated. Treatment funded by an accepted claim runs through WorkSafeBC’s own provider network, which this practice is not part of, and the two can coexist.' },
      { q: 'What if my claim is denied?', a: 'Ask for a review, psychological claims are denied at meaningful rates and succeed on review often enough that giving up at the first letter is a mistake. Time limits apply to reviews too, so move promptly, and take the file to the Workers’ Advisers Office before deciding it is over.' },
    ],
    sources: [
      { label: 'WorkSafeBC', url: 'https://www.worksafebc.com/en' },
      { label: 'WorkSafeBC, mental health injury claims', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
      { label: 'WorkSafeBC, mental health presumption extended to 11 new occupations (10 June 2024)', url: 'https://www.worksafebc.com/en/about-us/news-events/announcements/2024/June/mental-health-presumption-extended-to-11-new-occupations' },
      { label: 'Province of BC, Workers’ Advisers Office', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/personal-injury-and-workplace-safety' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/workplace-bullying-in-bc', label: 'Workplace bullying in BC' },
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC' },
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
      { href: '/resources/psychiatry-and-assessment-in-bc', label: 'Psychiatry and assessment in BC' },
    ],
  },

  {
    slug: 'disability-benefits-and-counselling-bc',
    figure2: 'reimbursement-flow',
    figure: 'reimbursement-flow',
    title: 'Short-term disability, long-term disability, and counselling in BC',
    metaTitle: 'Short and Long-Term Disability for Mental Health in BC',
    metaDescription:
      'How STD and LTD work for mental-health claims in BC: timelines, the treatment expectation, the own-occupation switch, and where counselling fits.',
    eyebrow: 'Resource · Work & money',
    lede:
      'Mental-health conditions are among the most common reasons for disability claims in Canada, and the system that pays them is the one working people understand least, because nobody reads the booklet until they need it.',
    shortAnswer:
      'Short-term disability is an employer or insurer plan that replaces part of your income for the early months of a medical absence; long-term disability takes over when STD ends, typically replacing a percentage of salary while you remain unable to work. Three things decide mental-health claims more than anything else: whether you are under regular, appropriate care, which usually includes counselling or psychiatric treatment; the definition switch, where "unable to do your own job" becomes "unable to do any job" (commonly around the two-year mark); and paperwork discipline. None of this is uniform: the plan wording, not this page, is the contract.',
    updated: '2026-10-03',
    readMinutes: 7,
    sections: [
      {
        h2: 'The relay: sick days → STD → LTD',
        body: [
          'The income side of a long medical absence is a relay with handoffs. The [ESA sick days](/guides/sick-days-and-mental-health-days-bc) cover the first week-ish. Then either your employer’s **short-term disability plan** (where one exists) or [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy) carries the next stretch, STD plans commonly run around 15 to 26 weeks at a percentage of salary set by the plan. **Long-term disability**, where the employer offers it, picks up when STD or EI exhausts, typically replacing somewhere in the range of half to two-thirds of salary, with the exact figure, caps and taxability set by the policy.',
          'Every handoff is an application, not an automatic transfer, and the LTD application in particular rewards being started well before STD ends, because insurer decisions take weeks. The single most preventable disaster in this system is an income gap caused by applying late to the next leg.',
          'Two structural notes: if premiums for LTD were paid by you (check your pay stub), benefits are usually non-taxable; employer-paid premiums usually mean taxable benefits. And most LTD policies require you to apply for other benefits you may be entitled to, CPP disability chief among them, with the LTD amount offset against them. This is normal, not the insurer cheating; the *sum* is what the policy promises.',
        ],
      },
      {
        h2: 'What mental-health claims turn on',
        list: [
          { label: 'Regular, appropriate care', detail: 'Every policy requires it, and for psychological claims insurers read it as: a physician involved, treatment underway, and usually counselling or psychiatric care consistent with the condition’s severity. A claim that says "too unwell to work" with no treatment record is the claim that gets denied, and honestly, treatment is also the route back.' },
          { label: 'Function, documented', detail: 'Like everything in this cluster, the currency is function: what you cannot sustain: concentration, reliability, interaction, attested consistently by the people treating you. Vague letters lose to specific ones.' },
          { label: 'The own-occupation switch', detail: 'Most policies pay for the first period (commonly two years) if you cannot do YOUR job, then switch to paying only if you cannot do ANY job you are reasonably suited for. Mental-health claims are re-examined hard at that switch, and knowing the date matters.' },
          { label: 'Surveillance-proof honesty', detail: 'Insurers investigate. The claimant who is consistent, with their doctors, their forms and their actual life, has nothing to manage. Exaggeration sinks valid claims; so does the heroic minimising that says "fine, coping" to the insurer’s nurse on a bad week.' },
        ],
      },
      {
        h2: 'Where counselling sits, practically',
        body: [
          'For an STD/LTD mental-health claim, counselling is usually part of the "appropriate treatment" picture, often alongside a family doctor and sometimes psychiatry. Some insurers cover or arrange treatment; more commonly you fund it through [extended health](/resources/bc-extended-health-coverage-for-counselling), which typically continues during an approved leave. Receipts and attendance records from a Registered Clinical Counsellor are ordinary supporting evidence insurers accept.',
          'Worth saying from this side of the desk: therapy during a disability leave has a different job than the paperwork it also feeds. The claim needs documentation; you need treatment. When those are the same sessions, good, but a claim managed so carefully that treatment becomes performance is treating the insurer, not the person. A counsellor’s notes stay confidential; what goes to an insurer is what you and your clinicians agree goes, usually via forms addressed to function.',
          'And if a claim is denied or cut off, common at the own-occupation switch. The sequence is: internal appeal with better functional evidence, then advice. Community legal resources and plaintiff-side disability lawyers (most consult free) exist precisely for LTD terminations, and limitation periods make speed matter.',
        ],
      },
    ],
    midCta: {
      text: 'Whether the claim is starting, dragging, or being fought. The treatment half of it can begin this week, from home.',
      label: 'Book a free consultation',
    },
    faqs: [
      /* Search Console, 17 Sep 2026: short term disability british columbia (20), long term disability bc (43), short term disability stress leave, mental health long term disability. */
      { q: 'How much does short-term disability pay in BC?', a: 'Whatever your plan says, and nothing is set by the province. Most employer short-term disability plans replace a percentage of salary, commonly somewhere between half and two-thirds, for a defined period, often 15 to 26 weeks, before long-term disability is assessed. The plan booklet states the figure; if there is no plan, EI sickness benefits are the fallback at 55% of insurable earnings to a weekly maximum.' },
      /* 3 Oct 2026: "short term disability bc" (2 at 34), "short term
         disability british columbia" (2 at 20), "short term disability bc
         canada" (2 at 30). The page answered how much, never whether. */
      { q: 'Is short-term disability mandatory in BC?', a: 'No. No BC law requires an employer to offer short-term disability; it is an insurance plan an employer chooses to buy, and its terms are in the plan booklet. Where there is no plan, the public fallback is EI sickness benefits, which pay 55% of insurable earnings, to a weekly maximum, for up to 26 weeks once a medical practitioner certifies that you cannot work.' },
      { q: 'Is short-term disability available for stress leave in BC?', a: 'Yes, if you have a plan and a physician certifies that you cannot work. Insurers treat mental-health conditions the same way as physical ones in principle, and in practice ask for more: a diagnosis from the certifying doctor, evidence of treatment, and often a treatment plan. Counselling with a Registered Clinical Counsellor is usually accepted as treatment for that purpose.' },
      { q: 'Can I get disability benefits for depression or anxiety in BC?', a: 'Yes, mental-health conditions are among the most common bases for STD and LTD claims in Canada. What the claims turn on is a diagnosed condition, documented functional limitations, and being under regular appropriate care, which usually includes counselling or psychiatric treatment.' },
      { q: 'Do I have to be in therapy to keep LTD benefits?', a: 'Policies require appropriate treatment for the condition, and for psychological claims insurers generally expect ongoing care, commonly a physician plus counselling or psychiatry. Refusing all treatment is a standard reason for termination of benefits. The wording of your policy governs; "appropriate" is judged against your condition’s severity.' },
      { q: 'What is the two-year change in my LTD?', a: 'The own-occupation to any-occupation switch: many policies pay first because you cannot do your own job, and later only if you cannot do any job you are reasonably suited to by education and experience. Claims are commonly reassessed and sometimes terminated at that point, diarise the date and tighten the functional evidence before it.' },
      { q: 'Does counselling with an RCC count as treatment for my claim?', a: 'Generally yes as part of a care picture: receipts, attendance and functional letters from a Registered Clinical Counsellor are ordinary evidence, usually alongside a physician’s involvement. Some policies specify practitioner types for particular purposes, so as always, the plan wording wins.' },
      { q: 'My LTD was cut off. Now what?', a: 'Appeal internally with stronger functional documentation, and get advice quickly, plaintiff-side disability lawyers mostly consult free, and limitation periods apply to court action. Do not let a termination letter become the end of treatment either; the condition does not read the insurer’s mail.' },
    ],
    sources: [
      { label: 'Government of Canada, EI sickness benefits (the STD fallback)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' },
      { label: 'Government of Canada, CPP disability benefits', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-disability-benefit.html' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC' },
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Return to work after a leave' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling' },
      { href: '/resources/psychiatry-and-assessment-in-bc', label: 'Psychiatry and assessment in BC' },
      { href: '/resources/workplace-mental-health-bc', label: 'Mental health at work in BC: accommodation and leave' },
    ],
  },

  /* Conversion-side pages, 2026-08-28: the consult-prep page (linked from the
   * booking flow — fewer no-shows, deeper intent) and the employer page (a
   * client channel no competitor in the measured set serves). */
  {
    slug: 'before-your-first-consultation',
    figure2: 'first-session-flow',
    figure: 'first-session-flow',
    title: 'Before your first consultation: what to expect, what to bring',
    metaTitle: 'Before Your First Consultation | Westpeak',
    metaDescription:
      'What actually happens on the free 30-minute call, the one thing worth preparing, the tech checklist, and every version of nervous that is normal.',
    eyebrow: 'Resource · Getting started',
    lede:
      'Thirty minutes, no card, no couch. Here is the whole shape of it, so the only unknown left is whether the fit feels right, which is the one thing the call exists to find out.',
    shortAnswer:
      'The free consultation is a 30-minute video call with your counsellor, not a therapy session, not an intake interview, and not a commitment. You will be asked, gently, what brings you; you can ask anything about how the work runs; and both of you are deciding fit. Preparation is one sentence: what you would want to be different. The tech is any device with a camera and a private-enough corner. Nerves are the normal state on this call, and mentioning them is allowed. It tends to help.',
    updated: '2026-10-01',
    readMinutes: 4,
    sections: [
      {
        h2: 'What the thirty minutes actually contain',
        body: [
          'The shape is consistent: a hello that is allowed to be awkward, a question like "what has you reaching out now?", space for whatever version of an answer you have, your questions about how sessions work, and, if you want it. A concrete next step. Nothing is diagnosed, nothing is decided on the call, and "I want to think about it" is a fully respectable ending. So is "I don’t think this is the right fit," said by either of you; the call exists to make that discovery cheap.',
          'You do not need a tidy story. "Things have been heavy and I don’t know exactly why" is a complete and common opening. If it helps to prepare something, prepare one sentence: what you would want to be different in three months. Everything else can be found together later.',
          'Questions worth asking, if you want a list to steal from: how sessions typically run, experience with what you are bringing, fees and how [coverage works](/resources/bc-extended-health-coverage-for-counselling), and anything from the [questions-to-ask guide](/guides/questions-to-ask-a-therapist). A counsellor who bristles at being interviewed is answering a question too.',
        ],
      },
      {
        h2: 'The practical checklist',
        list: [
          { label: 'Online only', detail: 'Nothing to travel to. There is no office to come to; the call is by secure video, from wherever you can be private.' },
          { label: 'A device with a camera', detail: 'Phone, tablet or laptop. Nothing to install; the confirmation email carries the video link. Headphones help more than people expect, for privacy and for feeling less like a broadcast.' },
          { label: 'A private-enough corner', detail: 'A bedroom, a parked car, an office with a door. It needs to be private for thirty minutes, not soundproofed for a lifetime, and saying "I only have semi-privacy today" is fine.' },
          { label: 'The location question', detail: 'Sessions are for people physically in Canada: British Columbia with any counsellor, anywhere in the country with Camille. A registration and insurance boundary, not a preference, so say where you are when you book.' },
          { label: 'Language', detail: 'The consultation can run in English, Punjabi or Tagalog, depending on the counsellor: English with either, Punjabi with Savneet, Tagalog with Camille, or a mix. Nothing needs translating for the counsellor’s benefit.' },
          { label: 'If the time stops working', detail: 'Rescheduling is free up to 24 hours ahead. A life that needed counselling is exactly the kind of life that sometimes needs to move an appointment.' },
        ],
      },
      {
        h2: 'On being nervous',
        body: [
          'Almost everyone is. Reaching out took most people months, and the call carries a weight far beyond its thirty minutes, which is worth saying because the nervousness is often read, from inside, as evidence of not being ready. It is evidence of the opposite: things that do not matter do not make people nervous.',
          'Two reframes that help. The call is mutual. You are assessing fit as much as being assessed, and [fit predicts outcomes](/guides/questions-to-ask-a-therapist) better than credentials do. And the worst realistic outcome is a slightly awkward quarter-hour that cost nothing and taught you what you are looking for. People survive far worse Tuesdays.',
        ],
      },
    ],
    midCta: {
      text: 'That is the whole shape of it. The only remaining step is the thirty minutes.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is the consultation actually free?', a: 'Yes. No card is taken and nothing is billed. It exists because fit matters and should be testable before money changes hands, and because deciding not to proceed is a normal outcome the practice plans for.' },
      { q: 'Will I have to talk about the hardest thing?', a: 'No. You choose what to share on the call, and a one-line version: "family stuff", "anxiety, mostly": is plenty. The hard material belongs to actual sessions, at a pace set clinically, once you have decided to work together.' },
      { q: 'What if I freeze or cry?', a: 'Both happen on these calls regularly and neither is a problem, a counsellor’s working day contains more tears than most professions’ working years. Freezing usually passes with one gentle question. There is no performance standard to meet.' },
      { q: 'Can someone join me on the call?', a: 'For individual work, the consultation is best one-to-one, though a support person nearby is fine. For couples work, both partners on the call is the normal arrangement, say so when booking.' },
      { q: 'What happens after the call?', a: 'The next day you get one short email from the practice: the link to book a session with the same counsellor, what sessions cost, and a note that not going ahead is a fine outcome. It is the only one of its kind, with no sequence behind it. If it felt right, you book from that link. If you want to think, you think. If it was not the right fit, you will be told honestly and, where possible, pointed somewhere better.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca' },
    ],
    related: [
      { href: '/book', label: 'Book the consultation' },
      { href: '/guides/what-to-expect-first-therapy-session', label: 'What to expect in a first full session' },
      { href: '/guides/questions-to-ask-a-therapist', label: 'Questions to ask a therapist' },
      { href: '/pricing', label: 'Fees and coverage' },
      { href: '/faq', label: 'Frequently asked questions' },
    ],
  },

  /* /resources/counselling-support-for-bc-teams was here until 1 Oct 2026.
     It now 301s to /for/employers-and-hr (lib/redirects.mjs), which took its
     manager guidance, the Fraser Valley language point and the workshops
     answer: two employer pages split the queries and neither ranked. */

  /* Round 2, item 52 (2026-08-28). Career-intent queries already reach the
   * site and earn clicks ("virtual counselling jobs bc" pos 9, the closed
   * RCC posting still drawing traffic). This page serves those searchers
   * honestly, earns the education-site links no service page can, and
   * quietly feeds PATH_TO_950's second-practitioner pipeline. */
  {
    slug: 'becoming-a-counsellor-in-bc',
    figure: 'designations-bc',
    figure2: 'accountability-chain',
    title: 'Becoming a counsellor in BC: the actual path',
    metaTitle: 'How to Become a Counsellor in BC | Westpeak',
    metaDescription:
      'The real route to practising as a counsellor in BC. The master’s, supervised hours, RCC or CCC registration, what it costs, and how 2027 changes the field.',
    eyebrow: 'Resource · The profession',
    lede:
      'Career-changers ask this more than school-leavers do, usually after their own therapy made the work visible. Here is the honest map: the years, the money, and the parts nobody mentions.',
    shortAnswer:
      'The standard route to practising as a clinical counsellor in BC: an undergraduate degree, then a master’s in counselling psychology or a close equivalent (typically two to three years), supervised clinical hours during and after it, then registration, RCC through BCACC or CCC through the national association, bringing insurance, ethics obligations and a public register entry. Total time from a standing start is commonly six to eight years part of it part-time; the master’s is the major cost. From 29 November 2027, psychotherapy becomes a regulated profession under a provincial college, which raises the floor and formalises the title. The unlicensed shortcut: practising as an unregistered "counsellor", currently legal, exists, and this page is frank about why it is a bad idea that is about to get worse.',
    updated: '2026-09-01',
    readMinutes: 7,
    sections: [
      {
        h2: 'The route, stage by stage',
        list: [
          { label: 'An undergraduate degree, the field matters less than people fear', detail: 'Psychology is the obvious road but not a gate: master’s programs admit from education, social work, nursing, criminology and further afield, usually asking for some psychology coursework and, more heavily, for relevant human-facing experience. Volunteer crisis-line work is the classic portfolio piece, and it doubles as a self-test for whether you can sit with distress.' },
          { label: 'The master’s, the real gate', detail: 'A counselling psychology or clinical-stream master’s: two to three years, thesis or course-based, including a supervised practicum with real clients. BC options include UBC, SFU, UVic, TWU, Adler and City University in Canada, alongside reputable distance programs (Yorkville is the common one). Check any program against the registration body’s current requirements BEFORE enrolling. This single check is the most expensive lesson in the field.' },
          { label: 'Supervised hours', detail: 'Registration requires documented client hours under approved supervision, the practicum provides part, post-degree work the rest. Expect the early supervised years to pay modestly at agencies and clinics; this is the profession’s residency, in effect if not in name.' },
          { label: 'Registration: RCC or CCC', detail: 'RCC (BCACC) is the BC-recognised designation this whole site describes; CCC (CCPA) is the national equivalent. Both verify education and hours, require insurance and continuing education, and bind you to a code of ethics with a complaints process. Many BC extended-health plans list one or both, depending on the plan, which is what makes registration economically load-bearing, not just principled.' },
          { label: 'Then the actual career decision', detail: 'Agency, health authority, school district, EAP network, or private practice. The last being a small business with everything that implies. The realistic private-practice arithmetic: a caseload builds over one to two years, not one to two months, and the clinical training contained zero hours of bookkeeping.' },
        ],
      },
      {
        h2: 'The parts the brochures skip',
        body: [
          'The money, plainly: a master’s commonly runs tens of thousands of dollars, the supervised years pay like the apprenticeship they are, and established private-practice income depends directly on caseload, fee and overhead. The fee tables on sites like this one are public, and the arithmetic from them is honest homework. Nobody sensible enters this field for the economics; nobody honest hides them either.',
          'The work itself selects hard. Sitting with other people’s pain, daily, without absorbing it or armouring against it, is a trained capacity with real limits, which is why supervision, personal therapy and workload boundaries are treated as professional obligations rather than self-care extras. Career-changers often arrive with an advantage here: they have usually been the client, and know what the chair is for.',
          'And the unregistered shortcut deserves a straight paragraph: it is currently legal in BC to practise as a "counsellor" with no training at all, and some do. It is also how you end up uninsurable, unreimbursable by any benefits plan, invisible to every referral network, and, from 29 November 2027, on the wrong side of a regulated title under the [College of Health and Care Professionals of BC](https://chcpbc.org/). The [RCC page](/resources/verify-a-counsellor-in-bc) explains the register from the client’s side; from the practitioner’s side, registration is simply what makes you part of the profession rather than adjacent to it.',
        ],
      },
      {
        h2: 'If you are exploring rather than deciding',
        body: [
          'Useful first moves that cost little: a crisis-line volunteer training (BC’s lines train continuously and the skills are the profession in miniature), an information interview with a working counsellor. Most will give a genuine thirty minutes to a serious asker, and reading a registration body’s requirements end to end, which tells you exactly what the road costs before you pay anything.',
          'And if the pull toward the field came from your own counselling: that origin is common, legitimate, and worth examining in counselling before you rebuild your career on it, "do I want to do this work, or do I want more of what receiving it gave me?" is a real question with two respectable answers.',
        ],
      },
    ],
    midCta: {
      text: 'If what pulled you here was your own therapy, or the wish for it. That thread is worth following in a consultation before a career plan.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'How long does it take to become a counsellor in BC?', a: 'From a standing start: commonly six to eight years. An undergraduate degree, a two-to-three-year master’s, and supervised hours that overlap the degree’s end. Career-changers with a completed bachelor’s are looking at roughly three to five years to registration, part of it feasible alongside work.' },
      { q: 'Can I practise without a master’s degree?', a: 'Legally, today, yes, "counsellor" is not yet a protected title in BC. Practically, no: registration (which requires the master’s) is what unlocks insurance, extended-health reimbursement, referral networks and, from late 2027, the regulated title itself. The unregistered route is a shrinking island.' },
      { q: 'RCC or CCC, which should I get?', a: 'In BC, RCC is the designation clients and insurers most commonly look for, and this site is one long demonstration of how it is used in practice. CCC travels better nationally. Requirements overlap heavily, some practitioners hold both, and the honest answer is: check the current requirements of each against your program before choosing the program.' },
      { q: 'What changes for the profession in 2027?', a: 'Psychotherapy comes under the College of Health and Care Professionals of BC on 29 November 2027, on a protected-title model. The voluntary accountability of the associations becomes statutory regulation. For anyone entering training now, the practical advice is to qualify as if regulation already applied, because by graduation it will.' },
      { q: 'Is counselling a good second career?', a: 'It is one of the classic ones. The maturity, work history and lived experience career-changers bring are genuine clinical assets, and admissions committees know it. The honest checks: the multi-year timeline, the tuition, the apprenticeship-wage years, and whether the pull is toward doing the work or toward staying near what receiving it felt like. All four are answerable before you apply.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca' },
      { label: 'Canadian Counselling and Psychotherapy Association', url: 'https://www.ccpa-accp.ca/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
    ],
    related: [
            { href: '/resources/verify-a-counsellor-in-bc', label: 'How to verify a counsellor in BC' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/standards', label: 'Standards and accountability here' },
    ],
  },
];

import type { Resource } from './resources';

export const moreResources: Resource[] = [
  {
    slug: 'student-mental-health-supports-bc',
    figure2: "first-session-flow",
    figure: 'therapy-cost-in-bc',
    title: 'Mental health supports for students in BC',
    metaTitle: 'Student Mental Health Supports BC | Westpeak',
    metaDescription:
      'What is free and available to post-secondary and secondary students in British Columbia, what the campus limits are, and where to go when they run out.',
    eyebrow: 'BC resource',
    lede:
      'Students have more free support available than almost any other group in the province, and consistently under-use it because nobody explains what it covers.',
    shortAnswer:
      'Every public post-secondary institution in BC provides some counselling to enrolled students at no cost, usually short-term. Alongside that: Here2Talk offers free 24/7 counselling to all BC post-secondary students, Foundry serves anyone aged 12 to 24, and most student unions carry an extended health plan that reimburses private counselling. Most students qualify for at least three of these and know about one.',
    updated: '2026-08-08',
    readMinutes: 7,
    sections: [
      {
        h2: 'Start with what costs nothing',
        list: [
          { label: 'Here2Talk', detail: 'Free, confidential single-session counselling for students registered at a BC post-secondary institution, available 24/7 by phone, app or online chat. No referral, no waitlist, and it works from anywhere — including outside the province during a term break.' },
          { label: 'Your campus counselling service', detail: 'Every public institution in BC provides counselling to enrolled students at no cost. Typically short-term and typically faster than community services. Availability tightens sharply around midterms and finals, so booking early in a term is a genuine advantage.' },
          { label: 'Foundry, for ages 12 to 24', detail: 'Centres across BC plus a virtual service — free counselling, often with drop-in access, no referral needed. Serves young people whether or not they are in school, and supports caregivers too.' },
          { label: '9-8-8 and 310-6789', detail: 'Crisis and emotional support, 24 hours a day, free from anywhere in the province. Not only for the moment of highest risk.' },
          { label: 'Kids Help Phone', detail: 'Available by phone and text to young people across Canada, 24/7, including for people well into their twenties.' },
        ],
      },
      {
        h2: 'The student health plan almost nobody reads',
        body: [
          'Most student unions in British Columbia include an extended health and dental plan in student fees, and most of those plans reimburse counselling from registered practitioners up to an annual maximum. Students routinely pay for this in September and never use it.',
          'Two details determine whether it is useful to you. First, which designations the plan reimburses — some cover a Registered Clinical Counsellor, some cover only a psychologist, some cover both at different rates. Second, the annual maximum and when it resets, which is often the plan year rather than the calendar year.',
          'These plans usually also have an opt-out window early in the term for students with equivalent coverage elsewhere, such as a parent\'s plan. Opting out of a plan you would have used is a common and avoidable mistake — check the counselling benefit before deciding.',
          'Where you do have private coverage, [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling) sets out how reimbursement works in practice.',
        ],
      },
      {
        h2: 'Where campus counselling runs out',
        body: [
          'Campus services are designed for short-term work, and they are good at it — an acute period, a specific crisis, a decision, adjusting to a first year away from home. For a bounded difficulty, a handful of sessions often does the job.',
          'The limits show up in three places. Session caps mean long-standing patterns and trauma work rarely fit. Demand peaks exactly when students most need it, which is the fortnight before finals. And continuity is difficult across terms, summers and co-op placements — students frequently change counsellor mid-course because of the calendar.',
          'That is not a criticism of a service doing what it was designed to do. It is a reason to know in advance where the ceiling is, and to ask at the first appointment what happens when you reach it.',
        ],
      },
      {
        h2: 'Academic accommodation is a separate route',
        body: [
          'Every public post-secondary institution in BC has an accessibility or accessible-learning office, and mental-health conditions can qualify for academic accommodation — extended deadlines, alternative exam arrangements, reduced course load without losing full-time status for funding purposes, and in some cases retroactive withdrawal from a failed term.',
          'This is a distinct process from counselling, with its own documentation requirements, and it is worth starting **before** a term goes wrong rather than after. Documentation usually has to come from a physician or psychologist rather than a counsellor, because accommodation processes typically require a diagnosis — and a Registered Clinical Counsellor does not diagnose.',
          'Students on StudentAid BC should also check the implications of a reduced course load for funding before reducing it, because the two systems do not always align automatically.',
        ],
      },
      {
        h2: 'For secondary students and their families',
        list: [
          { label: 'School counsellors', detail: 'Every BC school district provides counselling in schools. Availability and caseload vary considerably by district, and the role often covers course planning alongside personal support.' },
          { label: 'Child and youth mental health teams', detail: 'Provincial services offering free assessment and treatment for those under 19, with intake offices across BC. Self-referral is accepted in most regions — a doctor\'s referral is generally not required.' },
          { label: 'Foundry', detail: 'From age 12, including drop-in at physical centres and a virtual service across the province.' },
          { label: 'Kelty Mental Health Resource Centre', detail: 'Provincial resource centre for children, youth and families — information, navigation help and peer support from parents who have used the system.' },
          { label: 'Support for caregivers', detail: 'Parents can access support in their own right rather than only as a route to their child. Foundry and Kelty both work with caregivers directly.' },
        ],
      },
      {
        h2: 'When private counselling makes sense for a student',
        body: [
          'Private counselling is worth considering when campus sessions have run out mid-course, when you need a specific approach the campus service does not offer, when continuity across terms matters, or when your student health plan covers a meaningful share of the fee anyway.',
          'It is also worth it when the difficulty is not about school. Family, relationships, trauma and identity do not respect a semester structure, and a service organised around one is not always the right container.',
          'The practical constraints are real, though. Student budgets are tight, and a plan built without reference to the money tends to end abruptly. Being direct about what you can sustain is a normal conversation — see [weekly vs biweekly sessions](/compare/weekly-vs-biweekly-sessions) and [low-cost counselling in BC](/resources/low-cost-counselling-bc).',
        ],
      },
    ],
    midCta: {
      text: 'If campus sessions have run out and the work was not finished,',
      label: 'a free 15-minute consultation is a straightforward next step',
    },
    faqs: [
      { q: 'Will my university know I used campus counselling?', a: 'Counselling records are confidential and separate from academic records. Faculty are not informed. The exceptions are the same legal ones that apply to any counselling — risk of serious harm, child protection, court order.' },
      { q: 'Can I use campus counselling and a private counsellor at the same time?', a: 'Generally yes. Tell both so that neither is working blind and the work is coordinated rather than duplicated.' },
      { q: 'Does my student health plan cover a Registered Clinical Counsellor?', a: 'Many do, and some cover only a psychologist. Check your specific plan booklet for the designation, not just the dollar amount — it is the detail that most often trips people up.' },
      { q: 'I am an international student. Do these apply to me?', a: 'Here2Talk and campus counselling are generally available to all enrolled students regardless of status. Health plan coverage varies, so check whether your plan is the student union plan or a separate international policy.' },
    ],
    sources: [
      { label: 'Here2Talk — BC post-secondary student counselling', url: 'https://here2talk.ca/' },
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
    metaTitle: 'Stress Leave & Mental Health at Work BC | Westpeak',
    metaDescription:
      'What your employer may and may not ask, how accommodation actually works, and where sick leave, short-term disability and a WorkSafeBC claim differ.',
    eyebrow: 'BC resource',
    lede:
      'Most people discover how any of this works at the exact moment they are least able to research it. This is the map, in advance.',
    shortAnswer:
      'BC employees are entitled to paid sick leave under the Employment Standards Act, and mental-health conditions count. Beyond that there are three separate systems that get confused with each other: workplace accommodation under human rights law, disability benefits through an insurer, and WorkSafeBC claims for work-caused injury. Your employer is entitled to know your limitations, not your diagnosis.',
    updated: '2026-08-08',
    readMinutes: 8,
    sections: [
      {
        h2: 'Paid sick leave',
        body: [
          'Under the BC Employment Standards Act, eligible employees are entitled to paid sick leave each calendar year after an initial qualifying period of employment, with unpaid leave available beyond it. Mental-health conditions are illness for these purposes — there is no separate or lesser category.',
          'An employer may ask for reasonable proof that leave is warranted. Reasonable proof is confirmation that you are unable to work and for roughly how long. It is **not** your diagnosis, your treatment, or the content of your appointments, and an employer is not entitled to those.',
          'The Employment Standards Branch covers most provincially regulated workplaces. Federally regulated ones — banks, telecoms, interprovincial transport, and others — sit under the Canada Labour Code with different entitlements, and unionised workplaces are governed by their collective agreement, which frequently provides more.',
        ],
      },
      {
        h2: 'Three systems that get confused',
        list: [
          { label: 'Accommodation (human rights law)', detail: 'A mental-health condition can be a disability under the BC Human Rights Code, and employers have a duty to accommodate to the point of undue hardship. Accommodation is about changing how you work — hours, workload, deadlines, a graduated return, a change of duties — not about time away.' },
          { label: 'Disability benefits (an insurance contract)', detail: 'Short-term and long-term disability are insurance products bought by your employer, governed by a policy rather than by legislation. The insurer decides eligibility using its own definitions, and mental-health claims frequently require more documentation than physical ones.' },
          { label: 'WorkSafeBC (a claim against work causation)', detail: 'A separate system for injuries caused by work. Mental-health claims are accepted in defined circumstances — most clearly for a traumatic event experienced at work, and in some cases for cumulative work-related stressors. It requires demonstrating that work caused the condition, which is a higher bar than having it.' },
        ],
      },
      {
        h2: 'What your employer is entitled to know',
        body: [
          'This is the question that causes the most anxiety and has the clearest answer. Your employer is generally entitled to know your **functional limitations** — what you can and cannot currently do, what accommodations would help, and expected timelines. They are not entitled to your diagnosis, your treatment, your medication or your appointment content.',
          'A well-written medical note therefore describes capacity rather than condition: "unable to work until 14 September" or "able to return to modified duties, no client-facing work, maximum six hours daily for four weeks". It should not name a condition, and a physician will usually write it that way if asked.',
          'An insurer, by contrast, will require considerably more detail, because it is assessing a claim rather than arranging accommodation. That information goes to the insurer, not to your employer, and the distinction matters — insurers are typically permitted to share only what is necessary for administering the claim.',
          'Note also that a Registered Clinical Counsellor does not diagnose, which means counselling notes generally cannot serve as the medical documentation these processes require. That usually needs a physician, nurse practitioner or psychologist. It is worth knowing before a deadline, not after.',
        ],
      },
      {
        h2: 'Accommodations that are commonly workable',
        list: [
          { label: 'Adjusted hours or a later start', detail: 'Frequently the single most effective accommodation where sleep is disrupted or medication causes morning sedation.' },
          { label: 'A graduated return to work', detail: 'Returning at reduced hours and building up over weeks. Better evidenced than a hard return, and reduces the chance of a second absence.' },
          { label: 'Workload or deadline adjustment', detail: 'Temporarily reducing concurrent projects, or extending deadlines, where concentration is affected.' },
          { label: 'A change in duties', detail: 'Moving temporarily away from the specific trigger — the client-facing part, the on-call rotation, the particular site.' },
          { label: 'Remote or hybrid work', detail: 'Genuinely helpful for some presentations and unhelpful for others, since isolation makes low mood worse. Worth thinking about rather than assuming.' },
          { label: 'Time for appointments', detail: 'Protected time for regular counselling or medical appointments, which is a small accommodation with a large effect on whether treatment is sustained.' },
        ],
      },
      {
        h2: 'If a disability claim is denied',
        body: [
          'Denials on mental-health claims are common and they are not the end of the process. Every policy has an internal appeal route with a deadline, and missing the deadline is the most avoidable reason claims fail permanently.',
          'Ask the insurer in writing for the specific reason for denial and the evidence they relied on. Denials frequently rest on insufficient documentation rather than on a judgement that you are well — which is a fixable problem, usually by obtaining more detailed medical evidence addressing the policy\'s specific definition of disability.',
          'Keep records throughout: dates, names, what was said, copies of everything submitted. If you are in a union, involve them early rather than after a denial. Legal advice is available through Access Pro Bono in BC for people who cannot afford a lawyer, and the BC Human Rights Clinic assists with human rights complaints including failures to accommodate.',
        ],
      },
      {
        h2: 'Where counselling fits',
        body: [
          'Counselling does not produce the documentation these systems require, and it is important to be straightforward about that. What it does is work on what is actually happening — the burnout, the anxiety, the aftermath of an incident at work, the decision about whether to stay.',
          'It is also useful for the process itself, which is its own stressor. Preparing for a difficult conversation with a manager, deciding what to disclose and to whom, and managing the strain of an appeal are all legitimate session material.',
          'For the underlying difficulties, [burnout compared with depression](/guides/burnout-vs-depression) is the most common starting point, and [counselling for healthcare and shift workers](/for/healthcare-and-shift-workers) covers the occupations where this comes up most.',
        ],
      },
    ],
    midCta: {
      text: 'If work is the thing that is making you unwell rather than the thing you are recovering to do,',
      label: 'that is worth a free 15-minute consultation',
    },
    faqs: [
      { q: 'Does my employer have to know my diagnosis?', a: 'Generally no. Employers are entitled to functional limitations and prognosis, not diagnosis. Ask your physician to write the note in terms of capacity rather than condition.' },
      { q: 'Can a counsellor write my sick note?', a: 'Usually not for these purposes. Employers and insurers typically require documentation from a physician, nurse practitioner or psychologist, partly because a Registered Clinical Counsellor does not diagnose.' },
      { q: 'Can I be fired for taking mental-health leave?', a: 'Protected leave and disability-related discrimination are covered by BC employment standards and human rights law. If you believe you have been penalised for taking leave, the Employment Standards Branch and the BC Human Rights Tribunal are the routes.' },
      { q: 'Is burnout covered by disability insurance?', a: 'Burnout is classified as an occupational phenomenon rather than a medical condition, so claims usually turn on an accompanying diagnosable condition. This is exactly why the wording of medical documentation matters.' },
    ],
    sources: [
      { label: 'BC Employment Standards — leaves and job protection', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off' },
      { label: 'BC Human Rights Tribunal', url: 'https://www.bchrt.bc.ca/' },
      { label: 'WorkSafeBC — mental health claims', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'How to get stress leave in BC' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/for/healthcare-and-shift-workers', label: 'Counselling for healthcare and shift workers' },
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'verify-a-counsellor-in-bc',
    figure2: "first-session-flow",
    figure: 'designations-bc',
    title: 'How to verify a counsellor is who they say they are',
    metaTitle: 'Verify a Counsellor in BC | Westpeak Wellness',
    metaDescription:
      'In BC anyone may call themselves a counsellor. The BCACC, CPBC and BCCSW registers are public and free — how to search each one in about two minutes.',
    eyebrow: 'BC resource',
    lede:
      'This takes about four minutes and almost nobody does it. It is the single most useful piece of due diligence available to you.',
    shortAnswer:
      'Ask which designation the person holds and which body holds it, then search that body\'s public register yourself — BCACC for a Registered Clinical Counsellor, the College of Health and Care Professionals of BC for a psychologist, the BC College of Social Workers for a social worker. If they hold no designation with any body, there is no complaints process and no minimum standard behind the title.',
    updated: '2026-08-08',
    readMinutes: 6,
    sections: [
      {
        h2: 'Why this is necessary in BC specifically',
        body: [
          'In British Columbia today, "counsellor", "therapist", "psychotherapist" and "life coach" are not protected titles. Anyone may use them, with no required training, no supervised practice, no insurance and no complaints route. That is not a hypothetical gap — it is the current legal position.',
          'What carries meaning is the **designation**: RCC, R.Psych, RSW, RCSW, CCC. Each is held by a body with entry requirements and a process for investigating complaints. The designation is what gives you somewhere to go if something goes wrong.',
          'This is changing. Counselling therapy is being brought under the College of Health and Care Professionals of BC, which will make it a regulated health profession with a protected title. Until that transition completes, the association route is the accountability structure that actually exists — and checking it is on you.',
        ],
      },
      {
        h2: 'The four-minute check',
        list: [
          { label: '1. Get the exact designation and full name', detail: 'From the website or by asking directly. "I am a counsellor" is not a designation. RCC, R.Psych, RSW, RCSW and CCC are.' },
          { label: '2. Find the right body', detail: 'RCC is held by the BC Association of Clinical Counsellors. Registered Psychologist is regulated by the College of Health and Care Professionals of BC. Registered Social Worker is regulated by the BC College of Social Workers. Canadian Certified Counsellor is held by the Canadian Counselling and Psychotherapy Association.' },
          { label: '3. Search that body\'s public register', detail: 'Each maintains a searchable directory. Go to the body\'s own website rather than following a link from the practitioner\'s site.' },
          { label: '4. Check status, not just presence', detail: 'A register entry shows current standing. Look for whether the registration is active, and whether the body publishes any disciplinary history.' },
          { label: '5. If they are not listed, ask why', detail: 'There are innocent explanations — a recent name change, registration under a different legal name, membership of a body you have not checked. There are also non-innocent ones. A registered professional will answer this question without offence.' },
        ],
      },
      {
        h2: 'What each designation actually requires',
        body: [
          'A **Registered Clinical Counsellor (RCC)** holds a master\'s degree in counselling or a closely related field, has completed supervised clinical hours, maintains continuing education and liability insurance, and works under the BCACC code of ethics.',
          'A **Registered Psychologist (R.Psych)** typically holds a doctoral degree and is a regulated health professional — the designation qualified to conduct formal psychological assessment and diagnosis, which counsellors are not.',
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
          'If the practitioner is registered, complain to the body that holds the designation. BCACC administers a complaints process for RCCs that is independent of any individual counsellor, and you do not need that counsellor\'s knowledge or agreement to use it. The College of Health and Care Professionals of BC and the BC College of Social Workers have statutory processes for their registrants.',
          'If the concern is specifically about privacy — how your information was collected, used, stored or disclosed — the Office of the Information and Privacy Commissioner for BC oversees private organisations under the Personal Information Protection Act.',
          'If the practitioner holds no designation at all, there is no professional body to complain to. Depending on what happened, the remaining routes are Consumer Protection BC, small claims, or the police. That asymmetry is the entire practical argument for checking first.',
        ],
      },
    ],
    midCta: {
      text: 'Every claim on this site is checkable, and you are encouraged to check it —',
      label: 'then book a free 15-minute consultation',
    },
    faqs: [
      { q: 'Is it rude to check?', a: 'No, and a registered professional will not be offended. Public registers exist precisely so that anyone can search them without asking permission.' },
      { q: 'What if someone is registered but has no complaints history shown?', a: 'That is the normal case. Most practitioners have no disciplinary history, and its absence is not evidence of anything either way.' },
      { q: 'Does a counsellor have to be registered in BC to see me?', a: 'A counsellor must be appropriately registered in the jurisdiction where the client is physically located during the session. This is why you are asked where in BC you are, and why it matters if you travel.' },
      { q: 'Are there good counsellors without a designation?', a: 'Possibly. The point is not that everyone unregistered is unskilled — it is that you have no way to tell, and no recourse if it goes wrong.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
      { label: 'BC College of Social Workers', url: 'https://bccsw.ca/' },
    ],
    related: [
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/guides/questions-to-ask-a-therapist', label: 'Questions to ask a therapist' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/glossary', label: 'Counselling glossary' },
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
      'Psychiatry in BC is covered by MSP and requires a referral from a physician or nurse practitioner; waits are often long. Formal psychological assessment — ADHD, autism, psychoeducational, cognitive — requires a registered psychologist, is largely not covered by MSP in private practice, and can be expensive. Without a family doctor, walk-in clinics, the Health Connect Registry and virtual care are the practical routes to a referral.',
    updated: '2026-08-08',
    readMinutes: 7,
    sections: [
      {
        h2: 'Which professional does what',
        list: [
          { label: 'Psychiatrist', detail: 'A medical doctor specialising in mental health. Diagnoses, prescribes and manages medication, and handles complex presentations. Covered by MSP. Requires a referral from a physician or nurse practitioner.' },
          { label: 'Family physician or nurse practitioner', detail: 'Can diagnose and prescribe for many common presentations, and is the gateway to a psychiatric referral. For a substantial proportion of people, this is the appropriate medical route and psychiatry is not needed.' },
          { label: 'Registered psychologist', detail: 'The designation qualified to conduct formal psychological assessment — ADHD, autism, psychoeducational, cognitive. Does not prescribe. Largely not covered by MSP in private practice.' },
          { label: 'Registered Clinical Counsellor', detail: 'Provides counselling and psychotherapy. Does not diagnose, prescribe or conduct formal assessment. See the [stated scope](/standards).' },
        ],
      },
      {
        h2: 'How a psychiatric referral works',
        body: [
          'You cannot self-refer to a psychiatrist in British Columbia. The route runs through a family physician or nurse practitioner, who assesses and, if appropriate, refers. Waits vary widely by region and by urgency, and can run to many months for a non-urgent referral.',
          'Two things improve the outcome of that appointment. First, arrive with a written timeline rather than a summary — when it started, what has changed, what has been tried, what effect it had. Fifteen minutes of prepared notes is worth more than an hour of recollection under pressure. Second, ask directly what the referral is for: medication review, diagnostic clarification, or ongoing management. These lead to different services.',
          'Urgent presentations move differently. Emergency departments have psychiatric assessment capacity, and health authorities operate urgent-response services in most regions. If risk is immediate, that is the route rather than a referral — **9-1-1**, or **9-8-8** by call or text for crisis support.',
        ],
      },
      {
        h2: 'If you do not have a family doctor',
        list: [
          { label: 'The Health Connect Registry', detail: 'BC\'s provincial registry for attaching people to a family physician or nurse practitioner. Register even if the wait is long — it is the main route to attachment.' },
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
          'A large proportion of people who think they need a psychiatrist need something else. Psychiatry is a medical specialty for diagnosis and medication management of more complex presentations — it is not, generally, where you go for weekly talking therapy, and most psychiatrists in BC do not provide ongoing psychotherapy.',
          'If what you want is to work on patterns, relationships, trauma or skills, counselling is the direct route and needs no referral, no diagnosis and no waitlist in private practice. If what you want is a medication conversation, a family physician can often handle it without a psychiatric referral at all.',
          'And the two coexist perfectly well. Plenty of people see a prescriber for medication and a counsellor for the work, and with written consent the two can coordinate directly. [Therapy, medication, or both](/compare/therapy-medication-or-both) sets out how that decision is usually framed.',
        ],
      },
    ],
    midCta: {
      text: 'If you are not sure whether you need a counsellor, a doctor or an assessment,',
      label: 'a free 15-minute consultation will tell you honestly',
    },
    faqs: [
      { q: 'Can I refer myself to a psychiatrist in BC?', a: 'No. A referral from a physician or nurse practitioner is required. Some urgent-response services can be accessed more directly in a crisis.' },
      { q: 'Does MSP cover a psychologist?', a: 'Psychological services in private practice are generally not covered by MSP. Psychologists working within some public health-authority programmes are, but access is limited and usually programme-specific.' },
      { q: 'Can a counsellor diagnose ADHD?', a: 'No. Formal assessment requires a registered psychologist, and diagnosis may also come from a physician or psychiatrist depending on the condition and the purpose.' },
      { q: 'How long do psychiatry waits actually run?', a: 'It varies substantially by region and urgency and can extend to many months for non-urgent referrals. Ask the referring clinician for the current local picture rather than relying on general figures.' },
    ],
    sources: [
      { label: 'HealthLink BC — call 8-1-1', url: 'https://www.healthlinkbc.ca/' },
      { label: 'BC Provincial Attachment System — Health Connect Registry', url: 'https://www2.gov.bc.ca/gov/content/health/accessing-health-care/bcs-primary-care-system/provincial-attachment-system' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
    ],
    related: [
      { href: '/compare/therapy-medication-or-both', label: 'Therapy, medication, or both?' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/guides/waiting-for-therapy-in-bc', label: 'Waiting for therapy in BC' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
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
  {
    slug: 'what-is-a-registered-clinical-counsellor',
    figure: 'designations-bc',
    figure2: 'accountability-chain',
    title: 'What is a Registered Clinical Counsellor (RCC)?',
    metaTitle: 'What Is a Registered Clinical Counsellor? | Westpeak',
    metaDescription:
      'What the RCC designation means in BC — the training required, what it permits, how to verify one in two minutes, and what changes with regulation in 2027.',
    eyebrow: 'Resource · Designations',
    lede:
      'Three letters after a counsellor’s name, doing more work than they look like — in a province where, for now, anyone at all may call themselves a counsellor.',
    shortAnswer:
      'A Registered Clinical Counsellor (RCC) is a therapist registered with the BC Association of Clinical Counsellors. The designation requires a master’s degree in counselling or a closely related field, supervised clinical hours, professional liability insurance, ongoing continuing education, and adherence to a code of ethics with a public complaints process. It is not yet a government licence — counselling is currently unregulated in BC, which is exactly why the designation matters: it is the voluntary accountability that fills the gap until provincial regulation of psychotherapy begins in late 2027. Every RCC can be verified, free, in the public BCACC register.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'What the letters actually certify',
        body: [
          'RCC is a designation granted and policed by the **BC Association of Clinical Counsellors (BCACC)**, a professional association founded in 1988. Holding it means the counsellor has cleared a specific bar: a master’s degree in counselling psychology or an equivalent discipline, a period of supervised clinical practice, current professional liability insurance, continuing education that does not stop at registration, and a code of ethics with teeth — there is a formal complaints process, and registrants can be, and are, removed.',
          'Each RCC carries a registration number, and the register is public and free to search. That combination — a number plus a register anyone can check in two minutes — is the practical meaning of the designation. A claim you can verify is categorically different from a claim you have to take on trust, and the [how-to-verify walkthrough](/resources/verify-a-counsellor-in-bc) shows exactly where to look.',
          'What the designation is *not*: a government licence. That distinction is not a technicality in British Columbia, and it is the next section, because it is the thing most pages on this subject skate past.',
        ],
      },
      {
        h2: 'The uncomfortable context: counselling is not yet regulated in BC',
        body: [
          'In British Columbia today, **"counsellor" and "therapist" are not protected titles.** Anyone may use them — no degree, no insurance, no oversight, no consequence. "Psychologist" and "social worker" are protected by statutory colleges; the words most people actually search for are not. This is the current state of the law, and it is why the letters after a practitioner’s name carry the weight they do here.',
          'It is also why **"licensed counsellor" is not a British Columbian term.** The phrase is American; there is no BC licence corresponding to it. Somebody advertising as a licensed counsellor in BC may be perfectly qualified — but the word "licensed" is not carrying the meaning it appears to carry. What exists in BC is *registration*: RCC through BCACC, CCC through the Canadian association, R.Psych and RSW through their colleges.',
          '**This changes in 2027.** Under the Health Professions and Occupations Act, psychotherapy is being brought under the College of Health and Care Professionals of BC, with regulation of the profession beginning 29 November 2027. Until then, the register is your protection — and a practitioner who displays a checkable registration number is telling you they want to be checked.',
        ],
      },
      {
        h2: 'What an RCC can and cannot do',
        list: [
          { label: 'Provide psychotherapy — the core of the work', detail: 'Individual, couples and family counselling for anxiety, depression, trauma, relationships and the rest of the territory, using recognised modalities. This is what the training is for.' },
          { label: 'Cannot formally diagnose', detail: 'Diagnosis in BC sits with physicians, psychiatrists, psychologists and clinical social workers with the relevant registration. An RCC works with what you are experiencing; the label on a file, where one is needed, comes from elsewhere — the three-way comparison covers when that matters.' },
          { label: 'Cannot prescribe', detail: 'Medication is physician work, always. An RCC coordinates with your doctor, with your written consent, rather than replacing them.' },
          { label: 'Issues receipts most extended plans recognise', detail: 'Most — not all — BC extended-health plans reimburse RCC counselling. Plans list professions, not services, so the wording check in the coverage guide comes before the first session, not after.' },
          { label: 'Answers to a code of ethics', detail: 'Including the advertising standards that prohibit testimonials and outcome claims — which is why a BCACC practice with no reviews page full of five-star quotes is following the rules, not hiding something.' },
        ],
      },
      {
        h2: 'RCC, CCC, RSW, R.Psych — a thirty-second orientation',
        body: [
          'The alphabet is genuinely confusing, so: **RCC** (BC association, master’s-level, therapy), **CCC** (Canadian Certified Counsellor — the national association’s equivalent, also master’s-level), **RSW/RCSW** (social workers, statutory college, clinical registration can include diagnosis), **R.Psych** (doctoral, statutory college, diagnosis and formal assessment). All four are real, checkable designations held by real therapists; the practical differences are scope, cost and what your insurance lists.',
          'If you are choosing between them for your own care, that decision has its own page — [RCC vs psychologist vs social worker](/compare/rcc-vs-psychologist-vs-social-worker-bc) — with fees, scope and coverage side by side. This page’s job is smaller: when you see "RCC" after a name, you now know precisely what it certifies and how to confirm it.',
        ],
      },
    ],
    midCta: {
      text: 'This practice is an RCC practice, and the registration number is on the about page next to the register it can be checked in — checking is encouraged.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is an RCC a real therapist?', a: 'Yes — master’s-level training, supervised hours, insurance, continuing education and a code of ethics with a complaints process. The designation exists precisely to separate trained, accountable practitioners from the anyone-at-all who may legally use the word "counsellor" in BC today.' },
      { q: 'How do I check if someone is really an RCC?', a: 'Search the BCACC public register — it is free, takes about two minutes, and confirms current, good-standing registration. Do this from the register itself rather than trusting a website badge, including this site’s. The step-by-step walkthrough is on the verification page.' },
      { q: 'Is RCC the same as a licensed counsellor?', a: 'There is no such thing as a "licensed counsellor" in BC — the phrase is American. RCC is a professional registration, which is the closest thing BC currently has, and it becomes a regulated-profession framework when psychotherapy comes under the College of Health and Care Professionals of BC in late 2027.' },
      { q: 'Does insurance cover an RCC?', a: 'Commonly, not universally. Most major BC extended-health plans reimburse RCC counselling; some list only psychologists and social workers. The plan wording — not the plan brand — decides, and the coverage guide lists the exact questions to ask.' },
      { q: 'What does it take to become an RCC?', a: 'A master’s degree in counselling psychology or a closely related field, supervised clinical practice, professional liability insurance, continuing education, and agreement to the BCACC code of ethics and complaints process. Current requirements live on the BCACC site, since they do change.' },
      { q: 'What happens to RCCs when regulation arrives in 2027?', a: 'Psychotherapy becomes a regulated profession under the College of Health and Care Professionals of BC on 29 November 2027, on a protected-title model. The practical effect for clients: the accountability that is currently voluntary through BCACC becomes statutory. Existing qualified practitioners transition into the new framework.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
      { label: 'Province of BC — health profession regulation', url: 'https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/professional-regulation' },
    ],
    related: [
      { href: '/resources/verify-a-counsellor-in-bc', label: 'How to verify a counsellor in BC' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling' },
      { href: '/about', label: 'About this practice — and its registration number' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
    ],
  },

  /* The two system-navigation resources of the work-and-money cluster,
   * 2026-08-28 — companions to the four guides in guides-more7.ts. Same
   * discipline: BC-specific, procedural, sourced, no clinical content and
   * no invented figures. Where a number depends on a specific plan or
   * policy, the page says "check the wording" instead of guessing. */
  {
    slug: 'worksafebc-psychological-injury-claims',
    figure: 'bc-support-routes',
    title: 'WorkSafeBC psychological-injury claims, explained',
    metaTitle: 'WorkSafeBC Mental-Health Claims | Westpeak',
    metaDescription:
      'When work-related mental injury is compensable in BC, what the claim requires, the exclusion everyone trips over, and where counselling fits alongside it.',
    eyebrow: 'Resource · Work & money',
    lede:
      'A stress leave says "I am unwell and need time." A WorkSafeBC claim says something stronger: "work injured me." Different systems, different tests, and mixing them up costs people months.',
    shortAnswer:
      'WorkSafeBC compensates psychological injury in two situations: a reaction to one or more traumatic events at work, or a mental disorder predominantly caused by significant work-related stressors — which includes bullying and harassment. Two hard edges define the system: the condition must be diagnosed by a psychologist or psychiatrist (not self-described burnout), and injuries caused by ordinary employer decisions — workload changes, discipline, termination — are excluded by statute. A claim is not a lawsuit and costs nothing to file; it is also not the right tool for every bad workplace, and this page is honest about which is which.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'The two doors into a claim',
        body: [
          'The first door is **traumatic events**: a worker experiences or witnesses something at work of the kind nobody is expected to absorb — violence, a serious accident, a death, a threat. First responders and health-care workers are the obvious cases, but the door is not restricted to them; a bank teller in a robbery or a transit worker after a fatality stands in the same doorway.',
          'The second door is **significant work-related stressors**: a mental disorder predominantly caused by ongoing, exceptional workplace stressors — and BC explicitly includes **bullying and harassment** here. "Significant" is doing legal work in that sentence: it means beyond the ordinary pressures of employment, sustained or severe, and documented well enough to be found as fact.',
          'Both doors require the same key: a **diagnosis by a psychologist or psychiatrist** of a recognised condition. Distress, burnout, and "my doctor said stress" do not open either door on their own — which is not a comment on how real they are, only on what this particular system requires. Getting that assessment is usually the first practical step of a serious claim.',
        ],
      },
      {
        h2: 'The exclusion everyone trips over',
        body: [
          'The statute excludes mental disorders caused by **decisions of the employer relating to the employment** — changes to workload, deadlines, performance management, discipline, transfers, termination. A depression caused by an unbearable workload or a demotion, however genuine, is generally not compensable through this system. That single sentence sorts most workplace-mental-health situations out of WorkSafeBC and into other tools.',
          'The line is genuinely fine and worth stating carefully: a crushing workload is excluded as an employer decision — but harassment dressed up as performance management is not, and adjudicators do look behind labels. If what happened to you sits near that line, it is worth a conversation with the Workers’ Advisers Office — a free, government-funded service that advises workers on claims — before deciding anything.',
          'If the exclusion applies to your situation, you are not without tools; you are holding different ones: the [stress-leave path](/guides/stress-leave-bc) with [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy), your [extended-health coverage](/resources/bc-extended-health-coverage-for-counselling) for treatment, the ESA and Human Rights Code for the employment side, and — where bullying is the issue — WorkSafeBC’s separate prevention lane for bullying-and-harassment complaints, which is about stopping conduct rather than compensating injury.',
        ],
      },
      {
        h2: 'How a claim actually runs, and where counselling fits',
        list: [
          { label: 'Report early', detail: 'Tell your employer, see a doctor, and report to WorkSafeBC promptly — there is a one-year time limit on filing, and contemporaneous records beat reconstructed ones in every adjudication ever run.' },
          { label: 'Expect a psychological assessment', detail: 'The diagnosis requirement means an assessment by a psychologist or psychiatrist is part of the process. Waits for these are real; the claim can be filed while the assessment is pending.' },
          { label: 'Accepted claims fund treatment', detail: 'An accepted psychological-injury claim can cover treatment and wage-loss benefits — one of the few routes in BC where therapy for the injury is paid rather than reimbursed. The treatment itself runs through WorkSafeBC’s provider arrangements.' },
          { label: 'This practice’s honest position', detail: 'Westpeak Wellness is not a WorkSafeBC provider, and claim-funded treatment happens inside their network. Where this practice fits is everything around the claim: the parallel private counselling many workers want during a long adjudication, and the situations the exclusion sorts out of the system altogether.' },
          { label: 'Denials are appealable', detail: 'Psychological claims are denied more often than physical ones and overturned on review often enough to matter. The Workers’ Advisers Office exists for exactly this and costs nothing.' },
      ],
      },
    ],
    midCta: {
      text: 'If your situation sits in the excluded middle — injured by work but outside the claim system — that is precisely the territory ordinary counselling serves.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I claim WorkSafeBC for stress or burnout?', a: 'Not for ordinary job stress or burnout as such. Compensable psychological injury requires either work-related traumatic events or significant work-related stressors — including bullying and harassment — plus a psychologist’s or psychiatrist’s diagnosis of a recognised disorder. Ordinary workload pressure and employer decisions like discipline or termination are excluded by statute.' },
      { q: 'Does bullying at work qualify?', a: 'It can — bullying and harassment are named examples of significant work-related stressors. The claim still needs the formal diagnosis and evidence that the conduct was beyond ordinary employment pressures, which is where documentation (dates, messages, witnesses) becomes decisive. There is also a separate WorkSafeBC prevention route aimed at stopping the conduct itself.' },
      { q: 'Do I need a lawyer to file?', a: 'No — filing is free and the system is designed to be used without one. For advice, the Workers’ Advisers Office is a free government service for exactly these questions, including whether your situation clears the "significant stressor" bar and how to handle a denial.' },
      { q: 'Can I see my own counsellor during a claim?', a: 'You can always see whoever you choose privately — through extended health or out of pocket — including while a claim is adjudicated. Treatment funded by an accepted claim runs through WorkSafeBC’s own provider network, which this practice is not part of, and the two can coexist.' },
      { q: 'What if my claim is denied?', a: 'Ask for a review — psychological claims are denied at meaningful rates and succeed on review often enough that giving up at the first letter is a mistake. Time limits apply to reviews too, so move promptly, and take the file to the Workers’ Advisers Office before deciding it is over.' },
    ],
    sources: [
      { label: 'WorkSafeBC', url: 'https://www.worksafebc.com/en' },
      { label: 'Province of BC — Workers’ Advisers Office', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/personal-injury-and-workplace-safety' },
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
    figure: 'reimbursement-flow',
    title: 'Short-term disability, long-term disability, and counselling in BC',
    metaTitle: 'Disability Benefits & Counselling in BC | Westpeak',
    metaDescription:
      'How STD and LTD work for mental-health claims in BC — timelines, the treatment expectation, the own-occupation switch, and where counselling fits.',
    eyebrow: 'Resource · Work & money',
    lede:
      'Mental-health conditions are among the most common reasons for disability claims in Canada — and the system that pays them is the one working people understand least, because nobody reads the booklet until they need it.',
    shortAnswer:
      'Short-term disability is an employer or insurer plan that replaces part of your income for the early months of a medical absence; long-term disability takes over when STD ends, typically replacing a percentage of salary while you remain unable to work. Three things decide mental-health claims more than anything else: whether you are under regular, appropriate care — which usually includes counselling or psychiatric treatment; the definition switch, where "unable to do your own job" becomes "unable to do any job" (commonly around the two-year mark); and paperwork discipline. None of this is uniform: the plan wording, not this page, is the contract.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'The relay: sick days → STD → LTD',
        body: [
          'The income side of a long medical absence is a relay with handoffs. The [ESA sick days](/guides/sick-days-and-mental-health-days-bc) cover the first week-ish. Then either your employer’s **short-term disability plan** (where one exists) or [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy) carries the next stretch — STD plans commonly run around 15 to 26 weeks at a percentage of salary set by the plan. **Long-term disability**, where the employer offers it, picks up when STD or EI exhausts, typically replacing somewhere in the range of half to two-thirds of salary, with the exact figure, caps and taxability set by the policy.',
          'Every handoff is an application, not an automatic transfer — and the LTD application in particular rewards being started well before STD ends, because insurer decisions take weeks. The single most preventable disaster in this system is an income gap caused by applying late to the next leg.',
          'Two structural notes: if premiums for LTD were paid by you (check your pay stub), benefits are usually non-taxable; employer-paid premiums usually mean taxable benefits. And most LTD policies require you to apply for other benefits you may be entitled to — CPP disability chief among them — with the LTD amount offset against them. This is normal, not the insurer cheating; the *sum* is what the policy promises.',
        ],
      },
      {
        h2: 'What mental-health claims turn on',
        list: [
          { label: 'Regular, appropriate care', detail: 'Every policy requires it, and for psychological claims insurers read it as: a physician involved, treatment underway, and usually counselling or psychiatric care consistent with the condition’s severity. A claim that says "too unwell to work" with no treatment record is the claim that gets denied — and honestly, treatment is also the route back.' },
          { label: 'Function, documented', detail: 'Like everything in this cluster, the currency is function: what you cannot sustain — concentration, reliability, interaction — attested consistently by the people treating you. Vague letters lose to specific ones.' },
          { label: 'The own-occupation switch', detail: 'Most policies pay for the first period (commonly two years) if you cannot do YOUR job, then switch to paying only if you cannot do ANY job you are reasonably suited for. Mental-health claims are re-examined hard at that switch, and knowing the date matters.' },
          { label: 'Surveillance-proof honesty', detail: 'Insurers investigate. The claimant who is consistent — with their doctors, their forms and their actual life — has nothing to manage. Exaggeration sinks valid claims; so does the heroic minimising that says "fine, coping" to the insurer’s nurse on a bad week.' },
        ],
      },
      {
        h2: 'Where counselling sits, practically',
        body: [
          'For an STD/LTD mental-health claim, counselling is usually part of the "appropriate treatment" picture — often alongside a family doctor and sometimes psychiatry. Some insurers cover or arrange treatment; more commonly you fund it through [extended health](/resources/bc-extended-health-coverage-for-counselling), which typically continues during an approved leave. Receipts and attendance records from a Registered Clinical Counsellor are ordinary supporting evidence insurers accept.',
          'Worth saying from this side of the desk: therapy during a disability leave has a different job than the paperwork it also feeds. The claim needs documentation; you need treatment. When those are the same sessions, good — but a claim managed so carefully that treatment becomes performance is treating the insurer, not the person. A counsellor’s notes stay confidential; what goes to an insurer is what you and your clinicians agree goes, usually via forms addressed to function.',
          'And if a claim is denied or cut off — common at the own-occupation switch — the sequence is: internal appeal with better functional evidence, then advice. Community legal resources and plaintiff-side disability lawyers (most consult free) exist precisely for LTD terminations, and limitation periods make speed matter.',
        ],
      },
    ],
    midCta: {
      text: 'Whether the claim is starting, dragging, or being fought — the treatment half of it can begin this week, from home.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I get disability benefits for depression or anxiety in BC?', a: 'Yes — mental-health conditions are among the most common bases for STD and LTD claims in Canada. What the claims turn on is a diagnosed condition, documented functional limitations, and being under regular appropriate care, which usually includes counselling or psychiatric treatment.' },
      { q: 'Do I have to be in therapy to keep LTD benefits?', a: 'Policies require appropriate treatment for the condition, and for psychological claims insurers generally expect ongoing care — commonly a physician plus counselling or psychiatry. Refusing all treatment is a standard reason for termination of benefits. The wording of your policy governs; "appropriate" is judged against your condition’s severity.' },
      { q: 'What is the two-year change in my LTD?', a: 'The own-occupation to any-occupation switch: many policies pay first because you cannot do your own job, and later only if you cannot do any job you are reasonably suited to by education and experience. Claims are commonly reassessed and sometimes terminated at that point — diarise the date and tighten the functional evidence before it.' },
      { q: 'Does counselling with an RCC count as treatment for my claim?', a: 'Generally yes as part of a care picture — receipts, attendance and functional letters from a Registered Clinical Counsellor are ordinary evidence, usually alongside a physician’s involvement. Some policies specify practitioner types for particular purposes, so as always, the plan wording wins.' },
      { q: 'My LTD was cut off. Now what?', a: 'Appeal internally with stronger functional documentation, and get advice quickly — plaintiff-side disability lawyers mostly consult free, and limitation periods apply to court action. Do not let a termination letter become the end of treatment either; the condition does not read the insurer’s mail.' },
    ],
    sources: [
      { label: 'Government of Canada — EI sickness benefits (the STD fallback)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' },
      { label: 'Government of Canada — CPP disability benefits', url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-disability-benefit.html' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC' },
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Return to work after a leave' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling' },
      { href: '/resources/psychiatry-and-assessment-in-bc', label: 'Psychiatry and assessment in BC' },
    ],
  },

  /* Conversion-side pages, 2026-08-28: the consult-prep page (linked from the
   * booking flow — fewer no-shows, deeper intent) and the employer page (a
   * client channel no competitor in the measured set serves). */
  {
    slug: 'before-your-first-consultation',
    figure: 'first-session-flow',
    title: 'Before your first consultation: what to expect, what to bring',
    metaTitle: 'Before Your First Consultation | Westpeak',
    metaDescription:
      'What actually happens on the free 15-minute call, the one thing worth preparing, the tech checklist, and every version of nervous that is normal.',
    eyebrow: 'Resource · Getting started',
    lede:
      'Fifteen minutes, no card, no couch. Here is the whole shape of it, so the only unknown left is whether the fit feels right — which is the one thing the call exists to find out.',
    shortAnswer:
      'The free consultation is a 15-minute video call with your counsellor — not a therapy session, not an intake interview, and not a commitment. You will be asked, gently, what brings you; you can ask anything about how the work runs; and both of you are deciding fit. Preparation is one sentence: what you would want to be different. The tech is any device with a camera and a private-enough corner. Nerves are the normal state on this call, and mentioning them is allowed — it tends to help.',
    updated: '2026-08-28',
    readMinutes: 4,
    sections: [
      {
        h2: 'What the fifteen minutes actually contain',
        body: [
          'The shape is consistent: a hello that is allowed to be awkward, a question like "what has you reaching out now?", space for whatever version of an answer you have, your questions about how sessions work, and — if you want it — a concrete next step. Nothing is diagnosed, nothing is decided on the call, and "I want to think about it" is a fully respectable ending. So is "I don’t think this is the right fit," said by either of you; the call exists to make that discovery cheap.',
          'You do not need a tidy story. "Things have been heavy and I don’t know exactly why" is a complete and common opening. If it helps to prepare something, prepare one sentence: what you would want to be different in three months. Everything else can be found together later.',
          'Questions worth asking, if you want a list to steal from: how sessions typically run, experience with what you are bringing, fees and how [coverage works](/resources/bc-extended-health-coverage-for-counselling), and anything from the [questions-to-ask guide](/guides/questions-to-ask-a-therapist). A counsellor who bristles at being interviewed is answering a question too.',
        ],
      },
      {
        h2: 'The practical checklist',
        list: [
          { label: 'A device with a camera', detail: 'Phone, tablet or laptop — nothing to install; the confirmation email carries the video link. Headphones help more than people expect, for privacy and for feeling less like a broadcast.' },
          { label: 'A private-enough corner', detail: 'A bedroom, a parked car, an office with a door. It needs to be private for fifteen minutes, not soundproofed for a lifetime — and saying "I only have semi-privacy today" is fine.' },
          { label: 'The location question', detail: 'Sessions are for people physically in British Columbia — a registration and insurance boundary, not a preference. If you are elsewhere in Canada, say so and you will be pointed to someone who can properly see you.' },
          { label: 'Language', detail: 'The consultation can run in English, Punjabi, or both. Nothing needs translating for the counsellor’s benefit.' },
          { label: 'If the time stops working', detail: 'Rescheduling is free up to 24 hours ahead — a life that needed counselling is exactly the kind of life that sometimes needs to move an appointment.' },
        ],
      },
      {
        h2: 'On being nervous',
        body: [
          'Almost everyone is. Reaching out took most people months, and the call carries a weight far beyond its fifteen minutes — which is worth saying because the nervousness is often read, from inside, as evidence of not being ready. It is evidence of the opposite: things that do not matter do not make people nervous.',
          'Two reframes that help. The call is mutual — you are assessing fit as much as being assessed, and [fit predicts outcomes](/guides/questions-to-ask-a-therapist) better than credentials do. And the worst realistic outcome is a slightly awkward quarter-hour that cost nothing and taught you what you are looking for. People survive far worse Tuesdays.',
        ],
      },
    ],
    midCta: {
      text: 'That is the whole shape of it. The only remaining step is the fifteen minutes.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is the consultation actually free?', a: 'Yes — no card is taken and nothing is billed. It exists because fit matters and should be testable before money changes hands, and because deciding not to proceed is a normal outcome the practice plans for.' },
      { q: 'Will I have to talk about the hardest thing?', a: 'No. You choose what to share on the call, and a one-line version — "family stuff", "anxiety, mostly" — is plenty. The hard material belongs to actual sessions, at a pace set clinically, once you have decided to work together.' },
      { q: 'What if I freeze or cry?', a: 'Both happen on these calls regularly and neither is a problem — a counsellor’s working day contains more tears than most professions’ working years. Freezing usually passes with one gentle question. There is no performance standard to meet.' },
      { q: 'Can someone join me on the call?', a: 'For individual work, the consultation is best one-to-one, though a support person nearby is fine. For couples work, both partners on the call is the normal arrangement — say so when booking.' },
      { q: 'What happens after the call?', a: 'If it felt right, you book a first session — usually offered on the call or by email after. If you want to think, you think; a follow-up nudge is not part of the model. If it was not the right fit, you will be told honestly and, where possible, pointed somewhere better.' },
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

  {
    slug: 'counselling-support-for-bc-teams',
    figure: 'accountability-chain',
    figure2: 'reimbursement-flow',
    title: 'Counselling support for BC teams: what employers can actually offer',
    metaTitle: 'Counselling Support for BC Teams | Westpeak',
    metaDescription:
      'What a small BC employer can actually do about mental health — benefits that cover RCCs, how EFAPs fall short, leave handled properly, and honest referral.',
    eyebrow: 'Resource · For employers',
    lede:
      'Somebody on your team is struggling right now — statistically, several somebodies. Most employers genuinely want to help and have been sold exactly one tool. This page is the fuller toolbox.',
    shortAnswer:
      'For a BC employer, real mental-health support is mostly plumbing, not posters: an extended-health plan whose wording actually covers Registered Clinical Counsellors at a meaningful annual maximum; an EAP understood honestly as triage rather than treatment; sick days and leave handled the way the Employment Standards Act and Human Rights Code require, without diagnosis-fishing; and managers who can say "you seem underwater — what do you need?" without practising medicine. A practice like this one fits at the referral end: somewhere concrete to point a struggling employee, bookable that week, in English or Punjabi.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'The plumbing that actually moves the needle',
        list: [
          { label: 'Check your plan’s counselling wording', detail: 'The single highest-leverage employer action costs a phone call: confirm the extended-health plan reimburses "Registered Clinical Counsellors" (not only psychologists), and look hard at the annual maximum — a $300 cap funds two sessions and is a gesture, not a benefit. Raising the paramedical maximum is often surprisingly cheap at renewal.' },
        { label: 'Know what your EAP is for', detail: 'Employee-assistance programs are genuinely useful triage: fast, free, confidential first conversations. They are also capped at a handful of sessions and staffed for generalist short-term work. Presenting the EAP as "we provide counselling" oversells it; presenting it as "a free first step, with real coverage behind it" is honest and works. The EAP comparison on this site is written for employees; it reads just as well for the people buying the program.' },
          { label: 'Handle leave lawfully and gracefully', detail: 'The ESA sick days apply to mental health without qualification; medical notes need functional information, never diagnosis; and the Human Rights Code’s duty to accommodate covers psychological disability. The work-and-money cluster on this site maps the whole terrain — sending a struggling employee a link costs nothing and signals everything.' },
          { label: 'Train the sentence, not the diagnosis', detail: 'Managers do not need mental-health-first-aid certification to say: "You seem like you are carrying a lot. What would help?" The skill is noticing plus asking plus not prescribing. Everything after that sentence belongs to professionals and to the employee’s own choices.' },
        ],
      },
      {
        h2: 'Where a practice like this one fits',
        body: [
          'Not as your EAP — this is a solo Registered Clinical Counsellor practice, and pretending otherwise would be the kind of overclaim this site is allergic to. Where it fits is the referral end of your toolbox: a concrete answer to "where would someone actually go?" — online across all of BC, evening availability that hourly and shift staff can use, sessions in English or Punjabi, fees published, receipts that work with every plan that covers RCCs, and a free 15-minute consultation an employee can book without telling anyone at work.',
          'For Fraser Valley and Surrey employers specifically, the Punjabi-language capability may be the most useful line on this page: a meaningful share of the region’s workforce carries its hardest conversations in Punjabi, and English-only support quietly excludes them. Pointing to a bilingual option is a concrete act of inclusion that costs a bookmark.',
          'What this page deliberately does not offer: workshops, lunch-and-learns, or wellness-week content. Those have their place; they are also the tool most often used *instead of* the plumbing above, and the plumbing is what your people will actually feel.',
        ],
      },
    ],
    midCta: {
      text: 'The useful employer move costs a bookmark: know where you would point someone before the Tuesday you need to.',
      label: 'See how the consultation works',
    },
    faqs: [
      { q: 'Can we pay for an employee’s counselling directly?', a: 'The cleaner routes are the ones already built for it: a healthy paramedical maximum on your plan, or a health-spending account the employee draws on privately. Direct employer payment creates confidentiality tangles nobody wants — the employee’s counselling should never be visible to the employer, including in gratitude.' },
      { q: 'Will we be told if an employee books here?', a: 'No, categorically. Counselling is confidential from employers regardless of who suggested it, what benefits reimburse it, or how supportive the intent. What you get instead is the thing you actually wanted: a team member getting help.' },
      { q: 'What should a manager do in the moment with a struggling employee?', a: 'Ask, listen, and point — "what would help?", genuine attention, and knowledge of the concrete options: the EAP for today, the benefits plan for treatment, the sick days without interrogation, and a real practice’s booking page. Managers go wrong by diagnosing or by fixing; the job is noticing and routing.' },
      { q: 'Is an EAP enough on its own?', a: 'As triage, yes; as treatment, usually not — session caps mean anything beyond a rough patch needs a handoff to ongoing care, which is where plan coverage of RCCs becomes the load-bearing benefit. The honest employer framing: "free first conversations through the EAP, real coverage for ongoing counselling through the plan."' },
      { q: 'Do you run workplace workshops?', a: 'No — this practice does one thing, which is counselling. For workplace education, CMHA BC offers established programs. What this practice offers your team is a concrete, bookable place to send someone, which in practice is the piece most toolboxes are missing.' },
    ],
    sources: [
      { label: 'Province of BC — employment standards: leaves and sick days', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'BC Office of the Human Rights Commissioner', url: 'https://bchumanrights.ca/' },
      { label: 'Canadian Mental Health Association, BC Division — workplace programs', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/compare/efap-vs-private-counselling', label: 'Your EAP vs a private counsellor' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC — the map' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling' },
      { href: '/guides/sick-days-and-mental-health-days-bc', label: 'Sick days and mental-health days in BC' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-language counselling' },
    ],
  },
];

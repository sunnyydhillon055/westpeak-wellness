import type { Resource } from './resources';

export const moreResources: Resource[] = [
  {
    slug: 'student-mental-health-supports-bc',
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
          'Campus services are designed for short-term work, and they are genuinely good at it — an acute period, a specific crisis, a decision, adjusting to a first year away from home. For a bounded difficulty, a handful of sessions often does the job.',
          'The limits show up in three places. Session caps mean long-standing patterns and trauma work rarely fit. Demand peaks exactly when students most need it, which is the fortnight before finals. And continuity is difficult across terms, summers and co-op placements — students frequently change counsellor mid-course simply because of the calendar.',
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
          'It is also worth it when the difficulty is not really about school. Family, relationships, trauma and identity do not respect a semester structure, and a service organised around one is not always the right container.',
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
    figure: 'reimbursement-flow',
    title: 'Mental health and work in BC: leave, accommodation and coverage',
    metaTitle: 'Mental Health and Work in BC | Westpeak',
    metaDescription:
      'Sick leave, accommodation, short-term disability and WorkSafeBC claims — how the BC systems fit together, and what your employer is entitled to know.',
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
          { label: 'WorkSafeBC (a claim against work causation)', detail: 'A separate system for injuries caused by work. Mental-health claims are accepted in defined circumstances — most clearly for a traumatic event experienced at work, and in some cases for cumulative work-related stressors. It requires demonstrating that work caused the condition, which is a higher bar than simply having it.' },
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
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/for/healthcare-and-shift-workers', label: 'Counselling for healthcare and shift workers' },
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'verify-a-counsellor-in-bc',
    figure: 'designations-bc',
    title: 'How to verify a counsellor is who they say they are',
    metaTitle: 'Verify a Counsellor in BC | Westpeak Wellness',
    metaDescription:
      'Titles like counsellor and therapist are unprotected in BC. How to check a registration in a few minutes, and what to do if something is wrong.',
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
    figure: 'bc-reach',
    title: 'Getting a psychiatrist or a formal assessment in BC',
    metaTitle: 'Psychiatry & Assessment in BC | Westpeak',
    metaDescription:
      'When you need a psychiatrist rather than a counsellor, how referrals work in BC, what a psychological assessment costs, and what to do without a GP.',
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
];

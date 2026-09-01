import type { Audience } from './audiences';

/* Third audience expansion, 2026-08-28: teachers and tech workers — two
 * large BC groups with cyclical, nameable strain and no page. (Healthcare
 * workers were assumed missing in the FIFTY_MORE ledger and turned out to
 * already exist as healthcare-and-shift-workers; checked before writing,
 * per house rule.) */
export const moreAudiences3: Audience[] = [
  {
    slug: 'teachers',
    figure: 'anxiety-avoidance-cycle',
    figure2: 'first-session-flow',
    title: 'Counselling for teachers in BC',
    metaTitle: 'Counselling for Teachers in BC | Westpeak Wellness',
    metaDescription:
      'Counselling for BC teachers and TTOCs — the September cliff, classroom load, marking that eats evenings, and a schedule built around school hours.',
    eyebrow: 'For · Teachers',
    lede:
      'Everyone thinks they know what teaching is like because everyone went to school. The version you are living — the composition of one actual classroom, at 8:40 on a Tuesday — is another thing entirely.',
    shortAnswer:
      'Counselling for BC teachers, education assistants and TTOCs, online in the hours teaching actually allows — after the bell, in the evening, or across the summer. The recurring material is specific: the September cliff, classroom composition and behaviour load that has outgrown the supports, marking that colonises evenings, compassion fatigue from carrying students’ home lives, and the guilt-laced question of whether to stay in the profession. Extended health through school districts commonly reimburses Registered Clinical Counsellor sessions.',
    updated: '2026-08-28',
    readMinutes: 6,
    opening: [
      'Teaching has a strain profile most jobs do not: a performance that cannot be phoned in, delivered to an audience whose needs exceed the resources in the room, on a calendar that resets every September regardless of what last June cost you. The profession also runs on a myth of vocation that makes admitting struggle feel like betraying the calling — which is how burnout in teachers gets narrated, by teachers, as personal failure.',
      'Sessions here run outside school hours by design, and nothing said in them reaches a district, a principal, or a professional registry. The limits of confidentiality are the ordinary legal ones, stated before you share anything — a bar teachers, of all people, will recognise the shape of.',
    ],
    whatComesUp: [
      { label: 'The September cliff', detail: 'August dread that starts mid-July, the first-week adrenaline, and the October crash. A yearly cycle so predictable it can be planned for — which almost nobody does.' },
      { label: 'Composition and behaviour load', detail: 'Classrooms whose designations, needs and behaviours have outgrown the support hours attached to them. The daily arithmetic of who gets you is a moral weight, not just a workload.' },
      { label: 'Work that follows you home', detail: 'Marking, prep, report cards, the 9 pm parent email. When the job has no natural edge, the person becomes the edge — and it wears.' },
      { label: 'Other people’s trauma', detail: 'Teachers carry disclosures, hungry kids, and home situations they can neither fix nor forget. Compassion fatigue is an occupational exposure here, not a weakness.' },
      { label: 'TTOC precarity', detail: 'The on-call years: 6 am phone roulette, new rooms daily, income that will not sit still, and doing all of it without a school community of your own.' },
      { label: 'The staying question', detail: '"Can I do this for twenty more years?" — asked guiltily, because leaving feels like abandoning the kids. A question worth examining somewhere the answer has no audience.' },
    ],
    sections: [
      {
        h2: 'Why the usual advice lands wrong on teachers',
        body: [
          'Generic burnout advice — set boundaries, leave work at work, take breaks — assumes a job where those levers exist. A teacher cannot step away from a classroom at 10:15 because their capacity is low, cannot decline the IEP meeting, and cannot make thirty adolescents asynchronous. The profession’s structure removes exactly the controls the self-help literature assumes, and being told to use levers you do not have is its own small demoralisation.',
          'What counselling offers instead is work on the levers that do exist: the September cycle planned for rather than survived; the difference between the job’s real demands and the perfectionism stacked on top of them; the marking that expands to fill guilt rather than need; the recovery that summers should provide and often do not because July is spent convalescing and August anticipating. And underneath, for many teachers, the identity work — because "teacher" is who you are in a way "account manager" rarely is, which is precisely why the strain cuts so deep.',
        ],
      },
      {
        h2: 'The practical fit',
        body: [
          'Sessions are online and scheduled around school reality — after the bell, evenings, or summer intensives when the timetable finally allows sustained work. District extended-health plans commonly reimburse Registered Clinical Counsellor sessions; the [coverage checklist](/resources/bc-extended-health-coverage-for-counselling) has the two questions to ask your plan. Where a district EFAP exists, it is a legitimate free first stop — and the [EAP comparison](/compare/efap-vs-private-counselling) is honest about where its session caps bite for anything longer than a rough patch.',
          'If the strain has already reached the point of medical leave, the [work-and-money cluster](/resources/workplace-mental-health-bc) covers the mechanics — sick days, the doctor’s note, EI, the return. Teachers use those pages every September; the aim of this one is fewer of them needing to.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'The core fit: burnout, anxiety, the staying question, and the perfectionism the profession selects for.' },
      { href: '/services/individual-therapy', label: 'Anxiety counselling', why: 'For the Sunday-night dread and the performance anxiety that never fully leaves the room.' },
      { href: '/services/individual-therapy', label: 'Depression counselling', why: 'For the Octobers that do not lift, and the flatness that outlasts the term.' },
    ],
    midCta: {
      text: 'A free 15-minute consultation fits in a spare block — and July exists. Either works.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can you see me only during summer?', a: 'Yes — a compressed stretch of weekly summer sessions is a legitimate shape for this work, and common among teachers. Better still is a plan that survives September: summer depth, then lighter touchpoints through the term at after-school times.' },
      { q: 'Is this confidential from my district and the TRB?', a: 'Sessions are confidential within the ordinary legal limits — risk of serious harm, children at risk, court orders — which are explained before you share anything. Attending counselling is not reportable to anyone, and no information flows to employers or regulators without your written consent.' },
      { q: 'Does my extended health cover this?', a: 'District plans commonly reimburse Registered Clinical Counsellor sessions — check your plan wording for "RCC" or "clinical counsellor" and the annual maximum. Receipts are issued for every session; most teachers pay and submit.' },
      { q: 'I think I might need a leave. Is that a different conversation?', a: 'It is a connected one. The stress-leave, doctor’s-note and EI pages on this site map the mechanics, and counselling is both part of what a certified leave typically involves and the work that makes the return hold. Reading in advance costs nothing; so does a consultation.' },
      { q: 'Do you understand the classroom reality, or will I spend sessions explaining it?', a: 'You will not need to argue that composition, marking load and the September cycle are real — they are the starting premises here, not claims to defend. The work starts from your actual Tuesday, not from a brochure version of teaching.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
    ],
    related: [
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC' },
      { href: '/guides/sick-days-and-mental-health-days-bc', label: 'Sick days and mental-health days in BC' },
      { href: '/guides/perfectionism-and-self-criticism', label: 'Perfectionism and self-criticism' },
      { href: '/compare/efap-vs-private-counselling', label: 'Your EAP vs a private counsellor' },
    ],
  },

  {
    slug: 'tech-workers',
    figure: 'burnout-vs-depression',
    figure2: 'four-decisions',
    title: 'Counselling for tech workers in BC',
    metaTitle: 'Counselling for Tech Workers in BC | Westpeak',
    metaDescription:
      'Counselling for BC tech workers — layoff cycles and survivor guilt, performance-review dread, work-permit stress, and remote isolation. Online, evenings.',
    eyebrow: 'For · Tech workers',
    lede:
      'Good salary, good benefits, ergonomic chair — and a nervous system that has spent three years bracing for the next reorg email. Both things are true, which is exactly why it feels unsayable.',
    shortAnswer:
      'Counselling for people in BC tech — developers, designers, PMs, support and everyone adjacent — online, with evening availability and benefits plans that usually cover it well. The recurring material: layoff cycles and the survivor guilt after them, performance-review and PIP dread, the particular terror of job loss when a work permit or PR application is attached to the employer, remote isolation dressed up as flexibility, and imposter feelings in an industry that interviews like a trial. High comp does not disqualify you from any of it.',
    updated: '2026-08-28',
    readMinutes: 6,
    opening: [
      'Tech in BC has spent several years in a permanent weather system of reorgs, hiring freezes and layoff rounds, and the people still employed are not fine — they are hypervigilant. The industry’s own culture makes this hard to say: you are well paid, the office has snacks, other people have real problems. That framing quietly forbids the exact conversation that would help.',
      'Sessions run by video — a format this audience needs no onboarding for — with evening slots for the sprint-locked, and nothing routed anywhere near an employer. The benefits plans tech companies carry are typically among the better ones for counselling coverage, which means many people in this industry are already paying for therapy they never use.',
    ],
    whatComesUp: [
      { label: 'Layoff weather', detail: 'Surviving three rounds is its own injury: guilt about the cut colleagues, vigilance about the next email, and quietly doing two absorbed jobs while grateful aloud.' },
      { label: 'The PIP economy', detail: 'Performance cycles, calibration, stack-ranking folklore — a review system that keeps part of your brain permanently preparing a defence. Dread of the next cycle is one of the most common presenting issues in this group.' },
      { label: 'Immigration-coupled employment', detail: 'When the work permit, the PNP nomination or the PR timeline is attached to the employer, a layoff is not a career event — it is a life event. That coupling produces a specific, rational, corrosive anxiety that deserves to be worked with as exactly what it is.' },
      { label: 'Remote isolation', detail: 'Flexibility that quietly became three years of the same room, colleagues who are tiles, and social muscles that atrophied. The loneliness is real and the commute-free life is also genuinely good — holding both is the work.' },
      { label: 'Imposter feelings, industrial grade', detail: 'An industry that interviews like a tribunal and ships public post-mortems grows imposter syndrome at scale. The existing guide on imposter feelings is practically a tech page already.' },
      { label: 'The golden-handcuffs question', detail: 'RSU vesting schedules as a life plan: staying somewhere corrosive because the next tranche vests in March. A money decision tangled with an identity decision, best untangled deliberately.' },
    ],
    sections: [
      {
        h2: 'Why high-functioning and struggling co-exist so well here',
        body: [
          'Tech selects for people who are good at systems, and people who are good at systems are dangerously good at running themselves as one: optimising sleep with a wearable, containerising the dread, shipping on time while the inside deteriorates. The industry’s version of struggle is high-functioning by default — visible performance intact, everything else running on a degraded battery. The [high-functioning anxiety guide](/guides/high-functioning-anxiety) describes the pattern; this page names its industrial habitat.',
          'The other local factor is that tech problems present as engineering problems — "I just need a better system for focus" — when the honest description is "I have been afraid for eleven consecutive quarters". Counselling here is partly the un-engineering: sitting with the fear as fear, the guilt as guilt, and the question of what you actually want as something no productivity stack answers.',
        ],
      },
      {
        h2: 'The practical fit',
        body: [
          'Evening and flexible session times fit sprint reality, and video sessions fit a population that has no anxiety about video. Tech benefits packages — including the health-spending accounts many companies layer on — commonly reimburse Registered Clinical Counsellor sessions at generous annual maximums; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) covers how to check yours in two minutes. If a layoff is already the situation, the [work-and-money cluster](/resources/workplace-mental-health-bc) maps EI and the practical scaffolding, and sessions do not require an employer to exist.',
          'And for the specific case where everything is attached to a visa: that pressure is carried by a lot of people in this industry’s Vancouver and it is under-discussed everywhere. It is a normal thing to bring here, in English or Punjabi, and it changes what "just leave the toxic job" advice is worth — which a counsellor should know before offering any.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Anxiety counselling', why: 'The review-cycle dread, the layoff vigilance, and the panic that arrives at 2 am between sprints.' },
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'The golden-handcuffs question, identity beyond the title, and what you actually want.' },
      { href: '/services/couples-therapy', label: 'Couples therapy', why: 'For when the layoff weather, the RSU math and the remote years have moved into the relationship.' },
    ],
    midCta: {
      text: 'You have benefits you are not using and a calendar full of half-hour holds. One of them can be a free consultation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'My problems feel small next to real problems. Should I still come?', a: 'The comparison is the symptom talking. Chronic threat, guilt and isolation are not disqualified by salary, and the "others have it worse" argument would, taken seriously, permit exactly one person on Earth to get help. If it is taking up more of you than you want it to, it qualifies.' },
      { q: 'Is any of this visible to my employer?', a: 'No. Paying through extended health means the insurer processes a counselling receipt; employers do not see claims detail. Nothing about attending, or what is said, reaches a workplace without your written consent — and sessions here are booked and paid by you, not through any corporate program.' },
      { q: 'I was just laid off and my benefits end soon. What is the smart order?', a: 'Use the coverage before it lapses — many plans cover you to the end of the month or the severance period, and receipts dated inside that window still reimburse. Then: EI promptly, the low-cost options page if the gap stretches, and honestly, some of the best counselling work in a layoff happens in the first weeks, before the story about what it meant sets.' },
      { q: 'My work permit depends on my job and the anxiety is constant. Can counselling actually help with that?', a: 'It cannot change the immigration system, and it will not pretend to. What it can do is real: separate the rational planning problem from the ambient dread so each gets the right tool, build the capacity to function while carrying genuine uncertainty, and be one hour where the pressure can be said out loud in either English or Punjabi.' },
      { q: 'Can sessions fit around sprint schedules and on-call?', a: 'Evening availability exists precisely for this, sessions are 50 minutes by video, and rescheduling with 24 hours’ notice is free. A cadence that flexes with release cycles — weekly in rough stretches, biweekly in calm ones — is a normal arrangement.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
    ],
    related: [
      { href: '/guides/high-functioning-anxiety', label: 'High-functioning anxiety' },
      { href: '/guides/imposter-feelings-at-work', label: 'Imposter feelings at work' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/guides/loneliness-in-adulthood', label: 'Loneliness in adulthood' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
    ],
  },
];

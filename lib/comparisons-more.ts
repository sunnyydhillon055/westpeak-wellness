import type { Comparison } from './comparisons';

export const moreComparisons: Comparison[] = [
  {
    slug: 'therapy-vs-coaching',
    figure2: "first-session-flow",
    figure: 'designations-bc',
    title: 'Therapy or coaching — which one do you actually need?',
    metaTitle: 'Therapy vs Coaching | Westpeak Wellness',
    metaDescription:
      'Coaching and counselling overlap in the room and differ completely in accountability. What each is for, and the questions that separate them.',
    eyebrow: 'Compare · Choosing support',
    lede:
      'From the outside they look similar: an hour, a conversation, someone helping you work something out. The differences that matter are structural.',
    shortAnswer:
      'Coaching is oriented to performance and forward movement for someone who is functioning; counselling is a regulated health service for difficulties that are causing distress or impairment, including ones with a history behind them. The practical difference is accountability — "coach" is a title anyone can use in British Columbia with no training, insurance or complaints process, while a Registered Clinical Counsellor is accountable to a professional body.',
    updated: '2026-08-08',
    readMinutes: 7,
    table: {
      columns: ['', 'Coaching', 'Counselling (RCC)'],
      rows: [
        ['Typical focus', 'Goals, performance, decisions, forward planning', 'Distress, patterns, history, relationships, functioning'],
        ['Entry requirement to practise', 'None in BC — the title is unprotected', 'Master\'s degree, supervised clinical hours, ongoing education'],
        ['Accountable to', 'Nobody, unless voluntarily certified', 'BC Association of Clinical Counsellors, with a complaints process'],
        ['Insurance requirement', 'None', 'Professional liability insurance required'],
        ['Covered by extended health', 'Almost never', 'Frequently — depends on your specific plan'],
        ['Works with trauma or mental illness', 'Outside scope', 'Within scope, with defined limits'],
        ['Confidentiality obligations', 'Contractual at best', 'Professional and legal, with named exceptions'],
        ['Typical length', 'Short, often a fixed package', 'Variable, reviewed as it goes'],
      ],
    },
    sections: [
      {
        h2: 'The overlap is real, and it is not the point',
        body: [
          'A good coach and a good counsellor will both listen carefully, notice patterns you have stopped seeing, ask better questions than your friends do, and hold you to what you said you wanted. Sessions can look almost identical from outside, and a lot of what makes either work is the same thing: a relationship in which you can be honest.',
          'So the comparison is not about quality. Plenty of coaches are excellent at what they do, and plenty of people get more from coaching than they would have got from therapy. The distinction is about scope and about what happens when things go wrong.',
        ],
      },
      {
        h2: 'The accountability gap',
        body: [
          'In British Columbia, "coach" is not a protected title. Neither, today, is "counsellor" or "therapist" — which is exactly why the designation matters more than the job title. A **Registered Clinical Counsellor (RCC)** has met defined educational and supervised-practice requirements, carries liability insurance, works under a published code of ethics, and can be investigated and lose the designation.',
          'A coach may hold a rigorous credential, or may have completed a weekend course, or may hold nothing at all. There is no way to tell from the website. Some coaching bodies certify voluntarily and their standards vary considerably.',
          'This is not a reason to avoid coaching. It is a reason to ask a coach exactly what training they have and what they will do if something clinical surfaces — because something clinical surfacing in a coaching conversation is common. A coach who has a clear answer to that question is a good sign; one who is confident they can handle anything is not.',
        ],
      },
      {
        h2: 'Questions that separate the two',
        list: [
          { label: 'Is the difficulty causing distress, or is it about ambition?', detail: 'Wanting a better career strategy is a coaching question. Being unable to sleep because of the job is a counselling one. The two frequently coexist, which is why people end up in the wrong room.' },
          { label: 'Does it have a history?', detail: 'If the current pattern is recognisably an older one — the same difficulty with authority, the same collapse at the same point — that is therapeutic territory. Coaching generally works forward from now.' },
          { label: 'Have you tried the obvious things and they did not stick?', detail: 'Repeatedly knowing what to do and not doing it is usually not an information problem, and more strategy will not fix it.' },
          { label: 'Is your functioning affected?', detail: 'Sleep, appetite, concentration, the ability to work or hold relationships. Once functioning is affected, you are past what coaching is designed for.' },
          { label: 'Would you need this covered?', detail: 'A practical filter. Extended health plans routinely reimburse counselling and almost never reimburse coaching.' },
        ],
      },
      {
        h2: 'Where coaching is genuinely the better answer',
        body: [
          'Coaching is well suited to someone who is broadly well and wants to move: a career transition, a leadership challenge, a specific performance goal, accountability for something you keep deferring. It tends to be more directive, more structured around goals, and shorter — and for a person who does not need to understand why, only to act, that is an efficient use of time and money.',
          'It is also a reasonable choice for someone who has already done therapeutic work and is now in a building phase. Plenty of people move between the two over a life, and there is no hierarchy implied by using either.',
          'What coaching is not designed for is trauma, depression, anxiety disorders, addiction, or grief. A coach who takes those on is working outside their scope, and the risk is not usually dramatic — it is that months pass with the wrong tool.',
        ],
      },
      {
        h2: 'Warning signs in either direction',
        list: [
          { label: 'A coach who works on your childhood', detail: 'If sessions are steadily moving into early history and family patterns, that is therapy being delivered by someone with no clinical training and no complaints process behind them.' },
          { label: 'Anyone promising an outcome', detail: 'Guarantees are a marketing device. Counsellors are prohibited from making them; coaches are not, which is precisely why you see them more often on that side.' },
          { label: 'Large pre-paid packages', detail: 'Common in coaching, rare in counselling. A structure you cannot leave without financial loss is a structure built for the provider.' },
          { label: 'Diagnostic language from an unqualified source', detail: 'Anyone telling you that you have ADHD, are a narcissist, or are traumatised, without the qualifications to assess it, is guessing with authority.' },
          { label: 'A counsellor who never sets any direction', detail: 'The mirror-image failure. Open-ended sessions with no target can drift for months. See [when therapy is not working](/guides/when-therapy-isnt-working).' },
        ],
      },
    ],
    howWeFit: [
      'This is a counselling practice, not a coaching one. Sessions are provided by a Registered Clinical Counsellor working under the BCACC code of ethics, with the accountability that comes with it.',
      'That also means the scope has limits, and they are stated openly on the [standards page](/standards) — no diagnosis, no prescribing, no formal psychological assessment, and no pretence of being a crisis service.',
      'If what you actually need is a coach, a consultation will say so. Referring someone to a better-fitting service is a normal outcome and a considerably better use of fifteen minutes than a booking that was never going to help.',
    ],
    midCta: {
      text: 'If you are not sure which of the two your situation calls for,',
      label: 'a free 15-minute consultation is a fast way to find out',
    },
    faqs: [
      { q: 'Can I do both at once?', a: 'Yes, and some people do — a coach for a career transition and a counsellor for the anxiety underneath it. It works best when both know about the other and the roles are clearly separated.' },
      { q: 'Is coaching cheaper?', a: 'Not usually. Coaching is often more expensive per hour and more likely to be sold in packages, and it is rarely covered by extended health benefits.' },
      { q: 'Is a life coach a therapist?', a: 'No. There is no required training, registration, insurance or complaints route for a life coach in British Columbia. Some are highly skilled; the point is that the title itself guarantees nothing.' },
      { q: 'How do I check what a counsellor is registered as?', a: 'Ask which body holds their designation, then search that body\'s public register directly. See [questions to ask a therapist](/guides/questions-to-ask-a-therapist).' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
    ],
    related: [
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/guides/questions-to-ask-a-therapist', label: 'Questions to ask a therapist' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/glossary', label: 'Counselling glossary' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'therapy-medication-or-both',
    figure2: "bc-support-routes",
    figure: 'therapy-cost-in-bc',
    title: 'Therapy, medication, or both?',
    metaTitle: 'Therapy, Medication, or Both? | Westpeak Wellness',
    metaDescription:
      'What each option does, who decides, and how the choice is usually made. General information only — medication decisions belong with a prescriber.',
    eyebrow: 'Compare · Treatment routes',
    lede:
      'It is one of the most common questions people arrive with, and one a counsellor cannot answer for you — but the shape of the decision can be explained.',
    shortAnswer:
      'They do different things. Medication acts on symptoms; therapy works on patterns, meaning and skills. For many common difficulties, clinical guidelines treat both as reasonable first options depending on severity and preference, and combining them is common. Only a physician, nurse practitioner or psychiatrist can prescribe or advise on medication — a counsellor cannot, and this page does not.',
    updated: '2026-08-08',
    readMinutes: 7,
    table: {
      columns: ['', 'Therapy', 'Medication'],
      rows: [
        ['What it acts on', 'Patterns, beliefs, skills, relationships, meaning', 'Symptoms, via neurochemistry'],
        ['Who provides it', 'Counsellor, psychologist, clinical social worker', 'Physician, nurse practitioner, psychiatrist'],
        ['Referral needed in BC', 'No, for private counselling', 'Yes — you need a prescriber'],
        ['Public coverage', 'Not covered by MSP in private practice', 'Prescriber visit covered; the drug itself often is not'],
        ['Typical time to effect', 'Weeks, building over a course of sessions', 'Often several weeks for antidepressants'],
        ['Effect after stopping', 'Skills and understanding generally persist', 'Symptoms may return when discontinued'],
        ['Main trade-offs', 'Time, cost, effort between sessions', 'Side effects, adjustment period, follow-up'],
      ],
    },
    sections: [
      {
        h2: 'What this page is and is not',
        body: [
          '**A Registered Clinical Counsellor does not prescribe, does not adjust medication, and does not advise on whether you should take it.** That is outside scope, and any counsellor telling you to start or stop a medication is doing something they are not qualified to do. Those conversations belong with your physician, nurse practitioner or psychiatrist.',
          'What a counsellor can usefully do is help you work out what you want to ask, notice what changes when something changes, and support you through an adjustment period. Plenty of people arrive already on medication, or start it partway through counselling, and both are entirely ordinary.',
          'What follows is general information about how the decision is usually framed — not a recommendation, and not a substitute for a conversation with a prescriber.',
        ],
      },
      {
        h2: 'They are not competing answers to the same question',
        body: [
          'The framing as a choice is slightly misleading, because the two act on different parts of the problem. Medication can reduce the intensity of symptoms — the physiological floor of anxiety, the weight of depression, the sleeplessness. Therapy works on what maintains the pattern: avoidance, beliefs formed in the aftermath of something, relationships that keep reproducing the difficulty, and the absence of skills nobody ever taught you.',
          'That is why the combination is common rather than redundant. It is also why either alone can be sufficient: a person whose depression lifts enough on medication to resume the things that were sustaining them may not need therapy, and a person whose anxiety is entirely maintained by avoidance may resolve it without medication at all.',
          'Major clinical guidelines for common presentations generally describe both psychological therapy and medication as reasonable first-line options, with severity, prior response and patient preference all shaping the choice. Preference is a legitimate clinical input, not a tiebreaker of last resort.',
        ],
      },
      {
        h2: 'Considerations that usually shape the decision',
        list: [
          { label: 'Severity', detail: 'Where symptoms are severe enough that engaging with therapy is not currently possible — no concentration, no energy, no capacity to practise anything — medication is more likely to be part of the initial plan.' },
          { label: 'Speed', detail: 'Neither is instant. Antidepressants commonly take several weeks to show effect, and therapy builds over a course of sessions. Anyone promising rapid resolution from either is overselling.' },
          { label: 'What has been tried before', detail: 'Prior response is one of the more useful pieces of information a prescriber has, and it is worth bringing accurately rather than approximately.' },
          { label: 'Access', detail: 'A practical constraint that is rarely discussed honestly. Without a family doctor, the medication route can be slower than the counselling route, and walk-in access varies by region.' },
          { label: 'Cost', detail: 'MSP covers the prescriber visit but generally not the medication itself unless you have coverage; private counselling is not covered by MSP at all. See [MSP vs extended health](/resources/msp-vs-extended-health).' },
          { label: 'Your own preference', detail: 'Genuinely legitimate. Someone strongly opposed to medication is unlikely to take it consistently, and someone who wants relief before they can face talking about anything is describing something real.' },
        ],
      },
      {
        h2: 'When medication needs to be on the table',
        body: [
          'There are situations where counselling alone is not the right plan, and it is important to say so rather than to keep an appointment. Severe depression with significant risk, symptoms of psychosis, bipolar presentations, and substance dependence requiring withdrawal management all need medical involvement — and in some cases urgently.',
          'It also matters that several physical conditions present convincingly as depression or anxiety. Thyroid problems, anaemia, sleep apnoea, and medication side effects among them. Anyone whose low mood or anxiety arrived without an obvious trigger, or alongside profound fatigue or unexplained physical change, should see a physician regardless of what else they do.',
          'If you are having thoughts of ending your life, this is not a question to research — call or text **9-8-8** anywhere in Canada, twenty-four hours a day, or **310-6789** for BC Mental Health Support. In immediate danger, **9-1-1**.',
        ],
      },
      {
        h2: 'Making the conversation with a prescriber more useful',
        list: [
          { label: 'Bring a timeline, not a summary', detail: 'When it started, what has changed, what makes it worse. Two weeks of brief daily notes is worth more than an hour of recollection under pressure.' },
          { label: 'Name your actual question', detail: '"I want to understand my options" is a better opening than waiting to be offered something, and it changes the shape of the appointment.' },
          { label: 'Ask what to expect and when', detail: 'How long before any effect, what side effects are common early, what would count as it not working, and when the review is.' },
          { label: 'Ask about stopping before you start', detail: 'How long people typically stay on it, and how it is discontinued. Knowing the exit in advance makes the decision easier to make.' },
          { label: 'Mention that you are in counselling', detail: 'Coordination helps, and with your written consent a counsellor and a prescriber can communicate directly.' },
        ],
      },
    ],
    howWeFit: [
      'This practice provides counselling only. Medication questions go to your physician, nurse practitioner or psychiatrist, and a consultation here will say so plainly rather than working around it.',
      'Counselling alongside medication is common and works well. With your written consent, coordination with a prescriber is straightforward.',
      'Where the presentation suggests medical assessment should come first, that is what the consultation will recommend — it is part of the [scope this practice states openly](/standards).',
    ],
    midCta: {
      text: 'If you want help working out what to ask a prescriber before you see one,',
      label: 'that is a reasonable use of a free consultation',
    },
    faqs: [
      { q: 'Can a counsellor prescribe medication?', a: 'No. Prescribing in British Columbia requires a physician, nurse practitioner or psychiatrist. A Registered Clinical Counsellor cannot prescribe, adjust or advise on medication.' },
      { q: 'Will I have to stay on medication forever?', a: 'That is a question for your prescriber, and the answer varies considerably by person and by condition. It is a good thing to ask before starting rather than after.' },
      { q: 'Does therapy work while I am on medication?', a: 'Yes. Combining them is common, and for some presentations the combination has better evidence than either alone.' },
      { q: 'Do I need a diagnosis to get counselling?', a: 'No. Private counselling in BC requires no diagnosis and no referral, and a counsellor does not provide a diagnosis.' },
    ],
    sources: [
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'BC government — mental health and substance use support', url: 'https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use' },
    ],
    related: [
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/services/depression-counselling', label: 'Depression counselling' },
      { href: '/services/anxiety-counselling', label: 'Anxiety counselling' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
    ],
  },

  {
    slug: 'efap-vs-private-counselling',
    figure2: "first-session-flow",
    figure: 'therapy-cost-in-bc',
    /* Retitled 2026-08-28: searchers say "EAP" ("eap vs therapy", "is an eap
       the same as therapy" in the query export); the page said only "EFAP".
       Both terms now carry, EAP first since it is the searched one. */
    title: 'Your EAP (or EFAP) vs a private counsellor',
    metaTitle: 'EAP vs Therapy: Which to Use | Westpeak Wellness',
    metaDescription:
      'What an EAP or EFAP actually gives you, where the session cap bites, and how to use the free route and a private counsellor in the right order.',
    eyebrow: 'Compare · Paying for it',
    lede:
      'A free, fast option and a paid, open-ended one. Most people should probably use both, and in a particular order.',
    shortAnswer:
      'An employee and family assistance programme gives you a small number of free sessions, usually starting within days, from a counsellor assigned out of a contracted network. Private counselling costs money and gives you choice of counsellor, no session cap, and continuity. For a bounded difficulty, an EFAP is often enough; for anything long-standing, the cap tends to arrive at the point where the work is getting somewhere.',
    updated: '2026-08-08',
    readMinutes: 7,
    table: {
      columns: ['', 'EFAP', 'Private counselling'],
      rows: [
        ['Cost to you', 'Free — employer funded', 'Session fee, often partly reimbursed by extended health'],
        ['Wait to first session', 'Usually days', 'Usually days to a couple of weeks'],
        ['Number of sessions', 'Capped, commonly a handful per issue per year', 'No cap'],
        ['Choice of counsellor', 'Usually assigned from a network', 'You choose, and can change'],
        ['Continuity after the cap', 'Ends, or transfers elsewhere', 'Continuous'],
        ['Specialisation', 'Whoever the network has available', 'You can select for method or population'],
        ['Employer visibility', 'Aggregate usage data only; not your content', 'None at all'],
        ['Best suited to', 'A defined, recent, bounded difficulty', 'Long-standing patterns, trauma, couples work'],
      ],
    },
    sections: [
      {
        h2: 'What an EFAP actually is',
        body: [
          'An employee and family assistance programme is a service your employer buys from a third-party provider. It typically covers short-term counselling for employees and often for household family members, along with things like legal information, financial advice and referral services. It is paid for by the employer and free at the point of use.',
          'The counselling component is deliberately short-term. The specific number varies by contract — commonly somewhere in the range of a few sessions per issue per year — and it is worth phoning to establish your exact entitlement rather than relying on what a colleague told you.',
          'The confidentiality question is the one people worry about most. Providers report aggregate usage to the employer — how many people used the service — not who used it or what was discussed. Clinical confidentiality applies as it does anywhere, with the same legal exceptions. It is a fair thing to ask the provider to confirm directly when you call.',
        ],
      },
      {
        h2: 'Where the cap bites',
        body: [
          'Short-term counselling is useful for a specific, recent, bounded problem: a difficult decision, a workplace conflict, an acute period of stress, an early grief. Six sessions can resolve a great deal when the target is clear.',
          'The difficulty arrives when the presenting problem turns out to be the visible part of something older. A pattern that formed in childhood, complex trauma, a relationship in genuine trouble — these do not conclude in six sessions, and the cap frequently arrives at exactly the point where trust has been established and the real work is starting.',
          'That is not a criticism of the model, which was never designed for long-term work. It is a reason to know the cap at the start rather than discovering it at session five, and to plan for what happens afterwards.',
        ],
      },
      {
        h2: 'The order that usually works best',
        list: [
          { label: 'Start with the EFAP if you have one', detail: 'It is free and it is fast. If the problem is bounded, you may need nothing else — and you will have lost nothing by finding out.' },
          { label: 'Ask about the cap in the first call', detail: 'How many sessions, per issue or per year, and what happens at the end. Knowing shapes how the time is used.' },
          { label: 'Say what you want in session one', detail: 'Short-term work rewards a clear target. Spending two of six sessions establishing what you are working on is expensive.' },
          { label: 'Ask for a transfer summary at the end', detail: 'If you continue elsewhere, a summary means you are not starting over. You are entitled to ask.' },
          { label: 'Move to private for anything long-term', detail: 'Trauma work, couples work and long-standing patterns need continuity with one counsellor. Starting that inside a capped programme means changing counsellor mid-course, which is the worst of both.' },
        ],
      },
      {
        h2: 'Where private counselling earns its cost',
        list: [
          { label: 'You choose the counsellor', detail: 'Method, population, language. Being able to select for a specific approach or for sessions in Punjabi is not available in most assigned-network models.' },
          { label: 'No cap, no cliff edge', detail: 'The work ends when it is finished rather than when the contract runs out.' },
          { label: 'Continuity with one person', detail: 'For trauma work in particular, changing counsellor partway is costly. One relationship across the whole course of work matters more here than almost anywhere else.' },
          { label: 'No employer involvement of any kind', detail: 'Not even aggregate. For people who are uneasy about using a benefit their employer purchased, that is a real consideration.' },
          { label: 'Often partly covered anyway', detail: 'Many extended health plans reimburse counselling separately from the EFAP, which means you may effectively have two pools. See [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling).' },
        ],
      },
      {
        h2: 'If you have neither',
        body: [
          'Not everyone has an EFAP or extended health, and private fees are a real barrier rather than a rhetorical one. There is more available than most people are told: health-authority mental-health services, community agencies, campus counselling for students, and free structured programmes for low mood and anxiety.',
          '[Low-cost counselling in BC](/resources/low-cost-counselling-bc) sets out the routes, and [what to do while you wait](/guides/waiting-for-therapy-in-bc) covers the interval, which is often the harder part.',
          'And regardless of coverage, the crisis services are free and immediate: **9-8-8** by call or text anywhere in Canada, or **310-6789** for BC Mental Health Support.',
        ],
      },
    ],
    howWeFit: [
      'This practice is private and is not part of any EFAP network. If you have an EFAP and your difficulty is bounded, using it first is genuinely the sensible move and a consultation here will say so.',
      'Where an EFAP has run out partway through something that needs longer, continuing privately is common. Ask your EFAP counsellor for a transfer summary so the work resumes rather than restarts.',
      'Sessions are paid at the time of the session, with a receipt showing the RCC registration number for your insurer. Whether your plan reimburses a Registered Clinical Counsellor is worth confirming before you book — see the [fees page](/pricing).',
    ],
    midCta: {
      text: 'If your EFAP sessions have run out and the work was not finished,',
      label: 'a free 15-minute consultation is a straightforward next step',
    },
    faqs: [
      { q: 'Will my employer know I used the EFAP?', a: 'Providers report aggregate usage numbers, not identities or content. Clinical confidentiality applies with the same legal exceptions as anywhere. Ask the provider to confirm their specific policy when you call.' },
      { q: 'Can I use my EFAP and extended health benefits both?', a: 'Usually yes — they are typically separate entitlements. Check your benefits booklet or ask your plan administrator.' },
      { q: 'Can I choose my EFAP counsellor?', a: 'Sometimes, within the contracted network. It is worth asking, particularly if you need a specific language or approach.' },
      { q: 'Does using an EFAP affect my employment record?', a: 'No. It is a benefit, not a disclosure, and your employer does not receive information about individual use.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'BC government — mental health and substance use support', url: 'https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/guides/waiting-for-therapy-in-bc', label: 'Waiting for therapy in BC' },
      { href: '/pricing', label: 'Fees and insurance' },
      { href: '/book', label: 'Book a free consultation' },
      { href: "/tools/therapy-cost-bc", label: "Work out what it costs after coverage" },
    ],
  },

  {
    slug: 'weekly-vs-biweekly-sessions',
    figure2: "bc-reach",
    figure: 'first-session-flow',
    title: 'Weekly or every two weeks?',
    metaTitle: 'Weekly vs Biweekly Therapy | Westpeak Wellness',
    metaDescription:
      'Session frequency is a clinical decision, not an administrative one. When weekly matters, when fortnightly is fine, and how cost fits in honestly.',
    eyebrow: 'Compare · How the work runs',
    lede:
      'People usually treat frequency as a scheduling question. It changes what the therapy can do.',
    shortAnswer:
      'Weekly sessions build and hold momentum, and they matter most at the start and during any intensive piece of work — trauma reprocessing in particular is difficult to do well fortnightly. Every two weeks suits stable periods, skills-based work with real practice between sessions, and situations where weekly is not financially sustainable. The wrong answer is a weekly plan you abandon in week five.',
    updated: '2026-08-08',
    readMinutes: 6,
    table: {
      columns: ['', 'Weekly', 'Every two weeks'],
      rows: [
        ['Momentum', 'Builds and holds', 'Has to be rebuilt each time'],
        ['Time spent catching up', 'Minimal', 'Often the first 10–15 minutes'],
        ['Suits trauma reprocessing', 'Yes — usually the minimum', 'Generally not recommended'],
        ['Suits skills practice', 'Yes', 'Yes — sometimes better, more practice time'],
        ['Cost over three months', 'Roughly 12 sessions', 'Roughly 6 sessions'],
        ['Risk of drift', 'Lower', 'Higher — cancellations become month-long gaps'],
        ['Typical use', 'Start of work, intensive phases, crisis periods', 'Consolidation, maintenance, stable periods'],
      ],
    },
    sections: [
      {
        h2: 'What frequency actually changes',
        body: [
          'The obvious effect is dose — twice as many sessions in the same period. The less obvious and more important effect is continuity. In fortnightly work, a meaningful share of each session is spent re-establishing where you were, what happened in between, and what state you are both in. In weekly work that overhead largely disappears.',
          'The other effect is on what can safely be opened. Difficult material has a half-life: it stays activated for some days after a session. Weekly sessions mean the next one arrives while it is still live and can be worked with. A fortnight can be long enough for someone to close the subject and arrive having decided not to reopen it.',
          'This is why frequency is a clinical decision rather than a diary decision, and why a counsellor should have a view about it rather than asking what suits you.',
        ],
      },
      {
        h2: 'When weekly genuinely matters',
        list: [
          { label: 'The first four to six sessions', detail: 'Assessment and the establishment of a working relationship both go considerably faster weekly. Starting fortnightly often means three months to reach where weekly would have been at six weeks.' },
          { label: 'Trauma reprocessing', detail: 'Approaches like EMDR involve opening and closing material deliberately within a session and reviewing at the next. A fortnight between is enough for someone to be carrying an incompletely processed target for two weeks. See [EMDR therapy](/services/emdr-therapy).' },
          { label: 'Acute periods', detail: 'A crisis, a separation, a bereavement, an imminent decision. When the situation is changing weekly, fortnightly sessions are always describing history.' },
          { label: 'When avoidance is part of the pattern', detail: 'For anyone whose difficulty involves avoiding difficult things, a fortnightly schedule offers considerably more room for the appointment itself to be avoided.' },
        ],
      },
      {
        h2: 'When every two weeks is a good choice',
        list: [
          { label: 'The work is largely practice', detail: 'Where the substance is trying something different between sessions, a fortnight gives more opportunity to actually do it and more material to bring back.' },
          { label: 'Things have stabilised', detail: 'After an intensive phase, spacing sessions out is often the correct next step rather than a compromise — it tests whether change holds without weekly support.' },
          { label: 'Weekly is not sustainable', detail: 'Entirely legitimate. Six sessions you can afford, spaced deliberately, beats twelve you abandon at five. Say so early so the plan is built around it rather than derailed by it.' },
          { label: 'Life makes weekly unrealistic', detail: 'Rotational work, shift patterns, caregiving. A fortnightly rhythm that is actually kept is better than a weekly one that is half cancelled.' },
        ],
      },
      {
        h2: 'What tends to go wrong',
        body: [
          'The most common failure is drift. A fortnightly schedule with one cancellation becomes a month, and a month becomes a check-in rather than a course of treatment. Monthly sessions are maintenance, and it is worth calling them that rather than pretending they are the same work more slowly.',
          'The second failure is a frequency chosen once and never revisited. Frequency should change as the work changes — weekly through an intensive phase, fortnightly during consolidation, and a deliberate ending rather than a fade. If nobody has raised it in three months, raise it.',
          'The third is cost arriving as a surprise. Weekly sessions for three months is roughly twice the outlay of fortnightly, and a plan built without reference to the budget tends to end abruptly at exactly the wrong moment. This is a normal conversation, and having it early is far better than having it at session ten. See [fees and insurance](/pricing).',
        ],
      },
    ],
    howWeFit: [
      'Frequency is agreed rather than assigned, and it is revisited as the work changes. Weekly is usually suggested at the start and during any intensive phase; fortnightly is often right afterwards.',
      'There is no package and no minimum commitment. Sessions are booked as you go, so a change in frequency does not require renegotiating anything.',
      'If cost is what is shaping the decision, say so — it changes what gets prioritised and what you can carry on with independently. That is a planning conversation, not an awkward one.',
    ],
    midCta: {
      text: 'If you want a view on what frequency your situation actually calls for,',
      label: 'ask in a free 15-minute consultation',
    },
    faqs: [
      { q: 'Can I start weekly and move to fortnightly later?', a: 'Yes, and that is the most common shape: weekly while the work is intensive, spacing out as things stabilise, then a deliberate ending.' },
      { q: 'Is monthly enough?', a: 'For maintenance after a course of work, sometimes. As a way of doing therapy from the start, rarely — too much of each session goes on catching up.' },
      { q: 'Does EMDR have to be weekly?', a: 'It is strongly preferable. The protocol depends on opening and closing material within a session and re-evaluating at the next, and long gaps interfere with that.' },
      { q: 'What if I need to skip a few weeks?', a: 'Say so in advance and it can be planned around — including what to do in the gap. Sessions here are booked as you go, so a break does not cost you anything.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
    ],
    related: [
      { href: '/guides/how-long-does-therapy-take', label: 'How long does therapy take' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy' },
      { href: '/pricing', label: 'Fees and insurance' },
      { href: '/guides/when-therapy-isnt-working', label: 'When therapy is not working' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

import type { Audience } from './audiences';

/* FOUR GROUPS THE SITE HAD NO PAGE FOR — 25 Sep 2026.
 *
 * Sixteen audience pages, and none for men, for first responders, for people
 * new to Canada, or for the trades — four of the groups a BC counselling
 * practice hears from most, and four query spaces ("counselling for men bc",
 * "first responder counselling bc") in which the competitor audit found
 * single-practitioner sites ranking on one page each. Same shape as every
 * other audience page, same rules: what the group actually says, no outcome
 * claims, sources that resolve, and sessions described as what they are.
 */
export const moreAudiences6: Audience[] = [
  {
    slug: 'men',
    figure: 'anxiety-avoidance-cycle',
    figure2: 'first-session-flow',
    title: 'Counselling for men in BC',
    metaTitle: 'Counselling for Men in BC | Online, Direct | Westpeak',
    metaDescription:
      'Counselling for men across BC by video: anger, stress, burnout, drinking that crept up, a relationship on the edge. Free 30-minute consultation.',
    eyebrow: 'For · Men',
    lede:
      'Most men who come to counselling did not decide to. Something forced the question: a partner, a doctor, a night they do not want to repeat. This page is for the moment before that.',
    shortAnswer:
      'Counselling for men in BC, online by secure video in English or Punjabi, with a Registered Clinical Counsellor. The work is practical and direct: anger that arrives faster than it used to, stress that has become the default, drinking or gaming that has quietly taken over evenings, a relationship that is one argument from ending, and the flatness men rarely call depression. Sessions are 50 minutes, evenings available, and the first 30-minute consultation is free.',
    updated: '2026-09-25',
    readMinutes: 6,
    opening: [
      'In Canada, about three in four people who die by suicide are men, and men are markedly less likely than women to have talked to anyone about their mental health in the year before. Those two facts are the same fact. The problem is rarely that men do not suffer; it is that the suffering has nowhere sanctioned to go, so it goes into work, into the gym, into a drink, into silence, or into the people closest to them.',
      'Counselling for men is not a softer version of counselling. If anything it is more direct: what is actually happening, what it is costing, what you want instead, and what to do on Tuesday. Nobody here needs you to cry, to talk about your childhood before you are ready, or to use words you would not use.',
      'It is also private in a way that matters to a lot of men. Sessions are by video from wherever you are, nobody sees you walk into an office, and nothing said reaches an employer, a partner, or a family doctor without your written consent.',
    ],
    whatComesUp: [
      { label: 'Anger that is not really anger', detail: 'The short fuse at home, the road, the kids. For many men anger is the one emotion with a licence, so everything else arrives dressed as it. Work here is on what is underneath, not on counting to ten.' },
      { label: 'Stress as a permanent setting', detail: 'The jaw, the sleep, the chest, the sense of being one email from the edge. Usually years old by the time anyone calls it a problem.' },
      { label: 'Drinking, weed or gaming that has crept', detail: 'Not a crisis, not nothing. An evening that used to be optional and is not any more. Counselling looks at what it is doing for you before what it is doing to you.' },
      { label: 'A relationship one argument from over', detail: 'Often the reason a man finally books: the partner has said something that sounded final. Individual work first, couples work if both want it.' },
      { label: 'The flatness', detail: 'Not sad, exactly. Nothing much. Less interest, less patience, less of you. Men describe depression this way far more often than the textbook does.' },
      { label: 'Fathers, and the father you had', detail: 'Wanting to do it differently and catching yourself doing it the same. One of the most common threads in this work, and one of the most productive.' },
    ],
    sections: [
      {
        h2: 'What the sessions are actually like',
        body: [
          'The first 30 minutes are free and are a conversation, not an assessment. You say what is going on in whatever words you have; the counsellor says how they would work with it and what a first stretch of sessions would look like. If it does not fit, that is a fine outcome and nobody chases you.',
          'After that, sessions are 50 minutes, weekly or every two weeks, and they have a shape. There is something you are working toward and a way of knowing whether you are getting there. Approaches used most with men at this practice are [CBT](/approaches/cognitive-behavioural-therapy), which is structured and skills-based, and [ACT](/approaches/acceptance-and-commitment-therapy), which suits people who understand their patterns fine and are still stuck in them. Where there is a history that keeps intruding, [EMDR](/services/emdr-therapy) is available.',
          'None of it requires you to be a talker. Plenty of men do their best work in this format precisely because there is a task in front of them rather than an open silence.',
        ],
      },
      {
        h2: 'Paying for it, and keeping it to yourself',
        body: [
          'Most BC extended health plans reimburse a Registered Clinical Counsellor under counselling or mental health; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) has the two questions to ask. Receipts are issued to you, in your name, and go nowhere else. If you are paying out of pocket, [fees are published in full](/pricing).',
          'If you are in a trade, on a camp rotation, driving, or in emergency services, there are pages written for that: [trades and construction](/for/trades-and-construction-workers), [rotational and camp workers](/for/rotational-and-camp-workers), [truck drivers](/for/truck-drivers) and [first responders](/for/first-responders). The material overlaps with this page; the schedules do not.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'The usual starting point: stress, anger, the flatness, drinking, and what you want instead.' },
      { href: '/services/emdr-therapy', label: 'EMDR and trauma therapy', why: 'For the thing from years ago that still runs the reaction today.' },
      { href: '/services/couples-therapy', label: 'Couples therapy', why: 'When the relationship is the reason you are here and both of you are willing.' },
    ],
    midCta: {
      text: 'Thirty minutes, free, by video, no forms first. That is the whole barrier.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Do I have to talk about feelings?', a: 'You have to talk about what is happening and what it is costing. What you call it is up to you. Most men find the work more practical than they expected: a target, a way of measuring it, and things to do between sessions.' },
      { q: 'Can I see a male counsellor?', a: 'The counsellors currently accepting new clients are listed on the counsellors page with their photos and what they work with. Fit matters more than gender for most people, and the free consultation exists so you can judge fit before committing to anything.' },
      { q: 'Will this go on any record?', a: 'No. Attending counselling is not reported to anyone. Sessions are confidential within the ordinary legal limits, which are explained before you share anything, and nothing reaches an employer, insurer or doctor without your written consent.' },
      { q: 'Is it covered by my plan?', a: 'Most BC extended health plans reimburse a Registered Clinical Counsellor to an annual maximum. Check for "counselling" or "clinical counsellor" in your plan booklet. MSP does not cover private counselling.' },
    ],
    sources: [
      { label: 'HeadsUpGuys, University of British Columbia', url: 'https://headsupguys.org/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
    ],
    related: [
      { href: '/guides/burnout-vs-depression', label: 'Burnout or depression?' },
      { href: '/guides/signs-it-might-be-time-for-therapy', label: 'Signs it might be time for therapy' },
      { href: '/for/trades-and-construction-workers', label: 'For trades and construction workers' },
      { href: '/services/individual-therapy', label: 'Individual therapy' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'first-responders',
    figure: 'window-of-tolerance',
    figure2: 'first-session-flow',
    title: 'Counselling for first responders in BC',
    metaTitle: 'Counselling for First Responders in BC | Westpeak Wellness',
    metaDescription:
      'Counselling for BC police, firefighters, paramedics, dispatchers and corrections staff, online around shifts. Trauma, EMDR and the WorkSafeBC presumption.',
    eyebrow: 'For · First responders',
    lede:
      'The job gives you a hundred things a year that a civilian gets once in a life, and a culture that says none of them should count. Both of those are true at once, and the second one is the problem.',
    shortAnswer:
      'Counselling for first responders in BC, online by secure video, scheduled around shift rotations, with a Registered Clinical Counsellor trained in EMDR. Covers cumulative exposure and the call that will not file itself away, sleep after nights, the home that gets the leftovers, and the decision about whether to make a WorkSafeBC claim under the mental-disorder presumption for first responders. Nothing said in a session reaches an employer or a file without written consent.',
    updated: '2026-09-25',
    readMinutes: 7,
    opening: [
      'Police, firefighters, paramedics, dispatchers, sheriffs and corrections officers in BC are exposed to more potentially traumatic events in a year than most people meet in a lifetime, and the exposure is cumulative rather than singular. The call that finally lands is rarely the worst one; it is the one that arrived on top of everything the others left.',
      'British Columbia recognised this in law. Since 2018 the Workers Compensation Act has carried a presumption that a mental disorder in a first responder is work-related unless shown otherwise, and the presumption was later extended to further occupations. That matters for a claim. It does not, by itself, get anyone help, and a claim is a separate decision from treatment.',
      'Counselling here is private, by video, and scheduled around a rotation rather than a Monday-to-Friday clinic. The counsellor knows the difference between a critical-incident debrief, a peer-support conversation and clinical treatment, and this is the third one.',
    ],
    whatComesUp: [
      { label: 'The call that will not file', detail: 'Intrusive images, a smell, a stretch of road you avoid. Usually one call standing in for many. EMDR was built for exactly this and is offered here.' },
      { label: 'Cumulative load', detail: 'Nothing dramatic, everything heavier. Less patience, more startle, a shorter fuse at home. Operational stress injury is a load problem before it is an event problem.' },
      { label: 'Sleep after nights', detail: 'Rotations that never let the body settle, and the drink or the pill that makes it settle faster. Sleep is treated as clinical material, not a lifestyle note.' },
      { label: 'Home gets the leftovers', detail: 'A partner who says you are not there even when you are. The family sees the version of you the job leaves behind.' },
      { label: 'Whether to claim', detail: 'The presumption exists; the decision to use it is yours, and it has consequences either way. Counselling can help you think it through without steering it.' },
      { label: 'Trust', detail: 'Who knows, what is written down, and whether any of this can reach the service. Answered plainly, before you say anything.' },
    ],
    sections: [
      {
        h2: 'What treatment looks like, and how it differs from peer support',
        body: [
          'Peer support and critical-incident stress management are valuable and they are not treatment. Treatment is a clinician working, over a defined stretch of sessions, on the specific way the exposure has lodged: the memories that intrude, the alarm system stuck on, the avoidance that has quietly reorganised a life around not being reminded.',
          'For a single event or a cluster of them, [EMDR](/services/emdr-therapy) is a first-line, evidence-supported approach that does not require narrating the event in detail. For the cumulative picture, the work is usually a combination: stabilisation first, so that the nervous system has somewhere to return to; then the exposures, in order of weight; then the home front, which has usually been carrying more than anyone said. The [guide to what trauma actually means](/guides/what-trauma-actually-means) is the plain-language version of this.',
          'Sessions are by video and are scheduled around the rotation. Days, evenings and the odd hour after a night shift are all workable, which is the practical reason a virtual practice fits this work better than a 9-to-5 clinic.',
        ],
      },
      {
        h2: 'Claims, coverage and who gets told',
        body: [
          'Three routes pay for this, and they are separate. A WorkSafeBC claim under the presumption covers treatment for an accepted work-related mental disorder; the [claims page](/resources/worksafebc-psychological-injury-claims) sets out how that route runs. Your extended health plan reimburses a Registered Clinical Counsellor whether or not there is a claim; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) has the questions to ask. And paying privately keeps the whole thing entirely outside any file, which some people choose for that reason alone.',
          'Whichever route, nothing said in a session reaches the service, a supervisor, a union or an insurer without your written consent. If you make a claim, you decide what is released to it. The limits of confidentiality are the ordinary legal ones and are explained before you share anything.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/emdr-therapy', label: 'EMDR and trauma therapy', why: 'For the specific calls that intrude, and the cumulative load underneath them.' },
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'Sleep, the fuse, the drinking, the flatness, and the question of how long you can keep doing this.' },
      { href: '/services/couples-therapy', label: 'Couples therapy', why: 'When the job has come home for years and the relationship is where it shows.' },
    ],
    midCta: {
      text: 'A free 30-minute consultation, by video, at an hour that fits the rotation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Do I need a diagnosis or a claim to start?', a: 'No. Counselling does not require either. If you want to make a WorkSafeBC claim, the presumption for first responders means a diagnosed mental disorder is presumed work-related; the diagnosis comes from a physician or psychologist, and counselling can run alongside from the start.' },
      { q: 'Will my service find out?', a: 'Not from this practice. Attending is not reported to anyone, and no information leaves without your written consent. If a claim is involved, you control what is released to it.' },
      { q: 'Can you work around a four-on, four-off rotation?', a: 'Yes. Sessions are by video and the calendar shows real open times, including evenings. A block after a set of days off is a common shape; a session after a night shift is possible if that is when you can think.' },
      { q: 'Is EMDR appropriate for cumulative exposure, not one event?', a: 'Yes, with sequencing. The work usually stabilises first and then takes the exposures in order of weight rather than trying to process everything at once. The counsellor will say what order makes sense and why.' },
    ],
    sources: [
      { label: 'WorkSafeBC', url: 'https://www.worksafebc.com/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
    ],
    related: [
      { href: '/resources/worksafebc-psychological-injury-claims', label: 'WorkSafeBC psychological injury claims' },
      { href: '/guides/what-trauma-actually-means', label: 'What trauma actually means' },
      { href: '/for/healthcare-and-shift-workers', label: 'For healthcare and shift workers' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'newcomers-to-canada',
    figure: 'bc-reach',
    figure2: 'first-session-flow',
    title: 'Counselling for newcomers to Canada, in BC',
    metaTitle: 'Counselling for Newcomers to Canada in BC | Westpeak',
    metaDescription:
      'Counselling for immigrants and international workers in BC, online in English, Punjabi or Tagalog. Settlement stress, family far away, how coverage works.',
    eyebrow: 'For · Newcomers to Canada',
    lede:
      'You did the hard thing. Then the hard thing turned out to be the first of several, and the people who would understand are eleven time zones away.',
    shortAnswer:
      'Counselling for people who have recently moved to Canada and live in BC, online by secure video, in English, Punjabi or Tagalog, with counsellors who work in those languages rather than through an interpreter. Covers settlement stress, the credential and status limbo, isolation, family obligations across time zones, and grief for a life that was left. Also explains coverage plainly: MSP does not pay for private counselling at any point, extended health from a job usually does, and some free routes exist for the first months.',
    updated: '2026-09-25',
    readMinutes: 6,
    opening: [
      'Nearly a third of people living in British Columbia were born outside Canada. Surrey, Abbotsford, Richmond and Burnaby are among the most immigrant-dense cities in the country. Being new here is not unusual. Feeling, in the second year, that it is going worse than anyone at home knows, is not unusual either, and it is the thing almost nobody says out loud.',
      'The strain has a shape. The first months run on adrenaline and logistics. Then the credential that does not transfer, the job below the one you trained for, the winter, the cost of everything, the calls home where you say it is fine, and the slow realisation that the people you left have carried on without you. Counsellors call this settlement stress and migration grief. People living it call it being tired in a way sleep does not touch.',
      'The counsellors at this practice work in Punjabi and Tagalog as well as English, in the language itself rather than through an interpreter. A session can be in the language you think in, about the things you cannot say to family, with someone who does not need the background explained first.',
    ],
    whatComesUp: [
      { label: 'The job below the one you trained for', detail: 'A doctor driving, an engineer in a warehouse. The loss of a professional self is a real grief, and it is one Canada rarely acknowledges.' },
      { label: 'Status limbo', detail: 'Work permits, PR applications, a sponsorship that depends on a relationship staying together. Living provisionally, for years, does something to a nervous system.' },
      { label: 'Family across time zones', detail: 'Ageing parents you cannot reach, money that has to be sent, calls where everyone performs being fine. Obligation without presence.' },
      { label: 'Isolation that is not loneliness exactly', detail: 'Plenty of people around, none of them the ones who knew you before. Building a life from strangers is slow and it is work.' },
      { label: 'A marriage under a load it was not designed for', detail: 'Two people who each left something, carrying it differently, with no one else to lean on. Couples work is available in Punjabi.' },
      { label: 'Children becoming Canadian faster than you', detail: 'The language, the values, the arguments. The [intergenerational page](/for/south-asian-intergenerational-conflict) covers this in depth for South Asian families.' },
    ],
    sections: [
      {
        h2: 'How to pay for it, said plainly',
        body: [
          'This confuses everyone and the confusion costs people months. MSP, the provincial health plan, does not pay for private counselling at any point, for anyone. That is not a newcomer rule; it is the rule. What pays is extended health insurance from an employer, which usually reimburses a Registered Clinical Counsellor up to an annual limit, and which many newcomers have without knowing it. The [coverage page](/resources/bc-extended-health-coverage-for-counselling) explains how to check in two minutes.',
          'Refugee claimants and some other groups have federal interim health coverage that includes counselling; a settlement agency can confirm whether you do. For the first months, before any plan starts, the [low-cost counselling page](/resources/low-cost-counselling-bc) lists the free and sliding-scale routes in BC, and settlement organisations such as MOSAIC, ISSofBC and DIVERSEcity offer free counselling and referrals in many languages.',
          'Private fees at this practice are [published in full](/pricing), and the first 30-minute consultation is free. Nothing about immigration status is asked, recorded or reported.',
        ],
      },
      {
        h2: 'What sessions are like, and what they are not',
        body: [
          'Counselling here is not advice and it is not settlement services; it does not find you a job or fix a permit. It is a place to put down the weight of managing everything, to grieve what was left without being told to be grateful, and to work practically on sleep, anxiety, the marriage, the flatness, whatever has become the daily problem. It runs on your schedule, by video, from home, in English, Punjabi or Tagalog.',
          'The counsellors are Registered Clinical Counsellors, members of the BC Association of Clinical Counsellors, and you can [check any of them on the public register](/resources/verify-a-counsellor-in-bc). That page exists because "counsellor" is not a protected title in BC, and people new to the country are the ones most often caught by that.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'Settlement stress, migration grief, anxiety, the professional self that was left behind.' },
      { href: '/services/punjabi-counselling', label: 'Counselling in Punjabi', why: 'Sessions in Punjabi with a counsellor from a Punjabi family, for individuals and couples.' },
      { href: '/services/couples-therapy', label: 'Couples therapy', why: 'For a marriage carrying the whole move, with nobody else to lean on.' },
    ],
    midCta: {
      text: 'Thirty free minutes, in your language, from home. Nothing about your status is asked.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Does MSP cover counselling for new residents?', a: 'No. MSP does not pay for private counselling for anyone, new or long-standing. Extended health from an employer usually does; refugee claimants may have federal interim coverage; and free routes exist through settlement agencies and community services for the first months.' },
      { q: 'Can sessions be in Punjabi or Tagalog?', a: 'Yes. One counsellor works in English and Punjabi and one in English and Tagalog, and the counsellors page says which. A session can switch between languages as the conversation does.' },
      { q: 'Is anything about my immigration status recorded?', a: 'No. It is not asked, not recorded and not reported to anyone. Counselling is confidential within the ordinary legal limits, which are explained before you share anything.' },
      { q: 'Can I be seen if I am here on a work or study permit?', a: 'Yes. The only requirement is that you are physically in British Columbia at the time of the session, because the counsellors are registered in BC.' },
    ],
    sources: [
      { label: 'WelcomeBC, Government of British Columbia', url: 'https://www.welcomebc.ca/' },
      { label: 'MOSAIC, settlement and counselling services', url: 'https://www.mosaicbc.org/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
    ],
    related: [
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health: what covers therapy' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/for/international-students', label: 'For international students' },
      { href: '/for/first-gen-south-asian-adults', label: 'For first-generation South Asian adults' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'trades-and-construction-workers',
    figure: 'anxiety-avoidance-cycle',
    figure2: 'bc-reach',
    title: 'Counselling for trades and construction workers in BC',
    metaTitle: 'Counselling for Trades Workers in BC | Westpeak Wellness',
    metaDescription:
      'Counselling for BC tradespeople and construction workers, online after the shift. Pain, injury, drinking, and a body that is the paycheque.',
    eyebrow: 'For · Trades and construction',
    lede:
      'The site runs on the idea that everyone is fine. The numbers for the industry say otherwise, and most of the people in them never told anyone.',
    shortAnswer:
      'Counselling for tradespeople and construction workers in BC, online by secure video after the shift or on the weekend, with a Registered Clinical Counsellor. The recurring material is specific: a body that is the paycheque and is wearing out, chronic pain and what gets taken for it, drinking that the crew treats as normal, the boom-and-bust of contract work, being away on camp jobs, and a culture where saying anything is a risk. Extended health through a union or employer commonly reimburses; sessions leave no trace on a site.',
    updated: '2026-09-25',
    readMinutes: 6,
    opening: [
      'Construction in Canada has among the highest rates of suicide of any industry, and the sector knows it: the BC Construction Safety Alliance and industry programs across the province now run mental-health training on the same footing as fall protection. The reasons are not mysterious. A workforce that is mostly men, physically worn, often in pain, paid by the contract, away from home for stretches, and steeped in a culture where the correct answer to "how are you" is "good".',
      'Counselling does not ask you to change the culture. It asks what the job is costing you specifically, and what you want to do about that part. Sessions are by video after the shift, from the truck if that is where the privacy is, and nothing about them reaches a foreman, a union, or a WorkSafeBC file without your written consent.',
      'The counsellors here work in English and Punjabi, which in the Lower Mainland trades is not a small thing.',
    ],
    whatComesUp: [
      { label: 'The body is the paycheque', detail: 'Knees, back, shoulders. The arithmetic of how many more years, done privately, every morning. Fear about the future dressed as irritability now.' },
      { label: 'Pain and what gets taken for it', detail: 'Chronic pain changes mood, sleep and temper on its own. What is used to manage it, prescribed or otherwise, changes them further. Counselling works on the pain’s footprint, not only the pain.' },
      { label: 'Drinking the crew calls normal', detail: 'After-work beers that became after-work bottles. Not a crisis by the site’s standard, which is the problem with the site’s standard.' },
      { label: 'Boom, bust, and the gap between', detail: 'Contract work, layoffs at the end of a job, weeks of nothing. Money stress that arrives on a schedule nobody controls.' },
      { label: 'Camp and away work', detail: 'Two weeks in, one out, a family that runs without you and a homecoming that never quite lands. The [camp workers page](/for/rotational-and-camp-workers) goes deeper.' },
      { label: 'An injury, and the claim', detail: 'Physical injury with a mental-health aftermath is common and rarely named as such. The [WorkSafeBC page](/resources/worksafebc-psychological-injury-claims) explains what a psychological claim involves.' },
    ],
    sections: [
      {
        h2: 'How this fits around a trade',
        body: [
          'Sessions are by video, 50 minutes, and the calendar shows real evening and weekend times. There is no office to get to after a ten-hour day and no waiting room to be seen in. The first 30 minutes are free and are a conversation about what is going on; if it does not fit, that is the end of it.',
          'The work is practical. [CBT](/approaches/cognitive-behavioural-therapy) suits people who want a task and a way of knowing it is working. Where there was an incident on a site, a serious injury, a death on a crew, [EMDR](/services/emdr-therapy) is available and does not require talking through the event in detail. Sleep, pain and drinking are treated as the clinical material they are.',
        ],
      },
      {
        h2: 'Paying, and who knows',
        body: [
          'Union and employer extended health plans in the BC trades commonly reimburse a Registered Clinical Counsellor; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) has the two questions to ask, and a benefits office will answer them without asking why. Where an injury has an accepted WorkSafeBC claim, treatment for its psychological aftermath can be covered under the claim. Paying privately is also an option, and [fees are published in full](/pricing).',
          'Nothing said in a session reaches an employer, a union, a foreman or an insurer without your written consent. Attending counselling is not reported anywhere. The limits of confidentiality are the ordinary legal ones and are explained before you say anything.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'Stress, pain, drinking, the future of a body that is the paycheque.' },
      { href: '/services/emdr-therapy', label: 'EMDR and trauma therapy', why: 'For an incident on site that has not left.' },
      { href: '/services/punjabi-counselling', label: 'Counselling in Punjabi', why: 'For the Lower Mainland crews where Punjabi is the language of the site.' },
    ],
    midCta: {
      text: 'Thirty free minutes, by video, after the shift. No forms, no waiting room.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I do this from the truck?', a: 'Yes, if it is private and the signal holds. Plenty of people do. A parked vehicle is often the only quiet place on a job.' },
      { q: 'Will my employer or union find out?', a: 'No. Attending is not reported to anyone, receipts go to you, and nothing leaves a session without your written consent.' },
      { q: 'Does my union plan cover it?', a: 'Most BC trades plans reimburse a Registered Clinical Counsellor to an annual limit. Ask your benefits office for the counselling maximum and whether an RCC is a covered provider; they will not ask why.' },
      { q: 'What if I am off on a WorkSafeBC claim?', a: 'Counselling for the psychological side of an accepted injury can be covered under the claim. The WorkSafeBC page on this site explains how that route runs, and a session can be booked in the meantime without waiting for a decision.' },
    ],
    sources: [
      { label: 'BC Construction Safety Alliance', url: 'https://www.bccsa.ca/' },
      { label: 'WorkSafeBC', url: 'https://www.worksafebc.com/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
    ],
    related: [
      { href: '/for/rotational-and-camp-workers', label: 'For rotational and camp workers' },
      { href: '/for/men', label: 'Counselling for men' },
      { href: '/resources/worksafebc-psychological-injury-claims', label: 'WorkSafeBC psychological injury claims' },
      { href: '/services/individual-therapy', label: 'Individual therapy' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

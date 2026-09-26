import type { Audience } from './audiences';

/* TWO TAGALOG-SPEAKING AUDIENCES — added 26 Sep 2026, on the owner's
 * instruction that Tagalog be carried as far as Punjabi is. The Punjabi
 * vertical has two audience pages (lib/audiences-punjabi.ts); Tagalog had
 * none, and the two groups below are the ones a BC practice with a
 * Tagalog-speaking counsellor actually hears from.
 *
 * English pages, as every audience page is. The Tagalog words in them are
 * the ordinary ones the site's Tagalog guides already use. No census figures
 * are quoted because none were verified; the same rule as lib/tagalog.ts.
 * No outcome claims. BCACC.
 */
export const tagalogAudiences: Audience[] = [
  {
    slug: 'filipino-healthcare-workers-and-caregivers',
    figure: 'first-session-flow-tl',
    figure2: 'bc-reach',
    title: 'Counselling for Filipino healthcare workers and caregivers in BC',
    metaTitle: 'Counselling for Filipino Healthcare Workers in BC | Westpeak',
    metaDescription:
      'Counselling in Tagalog or English for Filipino nurses, care aides and caregivers in BC, online around shifts. Burnout, family abroad, being the one who copes.',
    eyebrow: 'For · Filipino healthcare workers and caregivers',
    lede:
      'You look after everyone: patients, residents, the family here, the family there. The question of who looks after you tends to get answered with a shrug and another shift.',
    shortAnswer:
      'Counselling for Filipino nurses, licensed practical nurses, care aides, personal support workers and caregivers in British Columbia, online by secure video in Tagalog, English or both, with a Registered Clinical Counsellor who works in Tagalog. Sessions fit around rotating shifts and nights. The recurring material is specific: burnout that is treated as normal, the weight of being the family’s provider on two continents, grief at a distance, a workplace that runs on Filipino staff and rarely says so, and a culture where asking for help feels like a failure of hiya. Extended health through a health employer or union commonly reimburses; nothing said reaches an employer or a licensing body.',
    updated: '2026-09-26',
    readMinutes: 6,
    opening: [
      'Filipino workers are a large part of BC’s health and care workforce, in hospitals, long-term care, home support and private caregiving, and they are disproportionately on the shifts nobody else wants. The work is skilled, physical and emotional at once, and it comes with a second job that does not appear on any roster: being the person a family in the Philippines depends on, and the person a family in Canada depends on, at the same time.',
      'Burnout in this group is easy to miss because it looks like competence. The person is still delivering, still picking up extra shifts, still sending money home. What has gone is the rest of them. Colleagues call it being tired; the guides on this site call it pagod that rest does not fix.',
      'Sessions here are by video, in Tagalog, English or both, at hours that fit a rotation, and nothing said in them reaches an employer, a union, a college or a family member without your written consent.',
    ],
    whatComesUp: [
      { label: 'Burnout that everyone treats as normal', detail: 'Double shifts, short-staffed units, residents who die, and a workplace culture, Filipino and Canadian both, that admires endurance. Pagod na pagod, and no one to say it to who would not say "same".' },
      { label: 'Two families, one paycheque', detail: 'Remittances, a parent’s medical bills in the province, a sibling’s tuition, and a household here. The arithmetic runs in the background of every decision, including whether to take a session.' },
      { label: 'Grief at a distance', detail: 'A parent who dies in the Philippines while you are on shift in Surrey, and a funeral you watched on a phone. Grief with no ritual and no time off is a specific kind of grief.' },
      { label: 'Utang na loob', detail: 'The debt of gratitude to the parents who sacrificed, the relative who sponsored you, the agency that placed you. It is real, it is honourable, and it is also the reason many people feel they have no right to be struggling.' },
      { label: 'The caregiver route', detail: 'Years of live-in work under a program that tied status to an employer, a family that was raised while your own was elsewhere, and the identity question that arrives when the program ends.' },
      { label: 'Being the one who copes', detail: 'The eldest, the nurse, the one with the good English. Being competent for everyone else is a role, and roles are tiring in a way that does not show.' },
    ],
    sections: [
      {
        h2: 'Why the language matters here specifically',
        body: [
          'Most Filipino healthcare workers in BC are fully fluent in English; it is the language of the work. It is not usually the language of the family, the guilt, or the grief. A session in Tagalog, or in the Taglish most people actually speak, means the hard part does not have to be translated before it can be said, and means that hiya and utang na loob are context rather than vocabulary to be taught to a stranger.',
          'It also matters for the one thing this group almost never does, which is put itself first. Being asked, in your own language, by someone who is not a patient and not a relative, how you actually are, is a different experience from being asked in a performance review.',
        ],
      },
      {
        h2: 'Fitting it around a roster, and paying for it',
        body: [
          'Sessions are 50 minutes by video and the calendar shows real evening times. Booking in blocks around a rotation, with gaps between blocks, is an ordinary pattern here and pausing costs nothing. A session after a night shift is possible if that is when you can think; a session on a day off is usually better.',
          'Health-employer and union extended health plans in BC commonly reimburse a Registered Clinical Counsellor; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) has the two questions to ask. Where an incident at work has become a claim, the [WorkSafeBC page](/resources/worksafebc-psychological-injury-claims) explains that route. Private fees are [published in full](/pricing), and the first 30 minutes are free.',
          'The [healthcare and shift workers page](/for/healthcare-and-shift-workers) covers the occupational side in more depth; this page is the one about carrying it in two languages and for two families.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/tagalog-counselling', label: 'Tagalog-speaking counselling', why: 'Sessions in Tagalog, English or both, with a counsellor who works in the language.' },
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'Burnout, anxiety, grief at a distance, and the role of being the one who copes.' },
      { href: '/services/emdr-therapy', label: 'EMDR and trauma therapy', why: 'For the incident on the unit, the death, the assault, that has not left.' },
    ],
    midCta: {
      text: 'Thirty free minutes, in Tagalog or English, at an hour that fits the roster.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can sessions be in Tagalog?', a: 'Yes. In Tagalog, in English, or moving between the two as the conversation does. Camille Granda works in both, and most sessions with bilingual people are mixed without anyone deciding to mix them.' },
      { q: 'Will my employer or my college find out?', a: 'No. Attending counselling is not reported to anyone. Sessions are confidential within the ordinary legal limits, which are explained before you share anything, and nothing reaches an employer, a union, a licensing college or an insurer without your written consent.' },
      { q: 'I work nights and rotating shifts. Can this fit?', a: 'Yes, and it is worth planning at the start rather than discovering later. Booking block by block around a roster, with gaps, is normal here, and evening times are available.' },
      { q: 'Does my plan cover it?', a: 'Most health-employer and union plans in BC reimburse a Registered Clinical Counsellor to an annual maximum. Check the plan booklet for "counselling" or "clinical counsellor". MSP does not cover private counselling.' },
    ],
    sources: [
      { label: 'BC Nurses’ Union', url: 'https://www.bcnu.org/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
    ],
    related: [
      { href: '/for/healthcare-and-shift-workers', label: 'For healthcare and shift workers' },
      { href: '/for/filipino-canadian-families', label: 'For Filipino-Canadian families' },
      { href: '/resources/counselling-in-tagalog-what-the-words-mean', label: 'What counselling means in Tagalog, word by word' },
      { href: '/for/newcomers-to-canada', label: 'For newcomers to Canada' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'filipino-canadian-families',
    figure: 'language-in-therapy-tl',
    figure2: 'first-session-flow-tl',
    title: 'Counselling for Filipino-Canadian families and adult children in BC',
    metaTitle: 'Counselling for Filipino-Canadian Families in BC | Westpeak',
    metaDescription:
      'Counselling in Tagalog or English for Filipino-Canadian adults and families in BC: hiya, utang na loob, the eldest daughter, talking to parents about it.',
    eyebrow: 'For · Filipino-Canadian families',
    lede:
      'Your parents gave up a country so that you would have this one. Saying that anything is wrong can feel like handing the gift back.',
    shortAnswer:
      'Counselling for Filipino-Canadian adults, couples and families in British Columbia, online in Tagalog, English or both, with a Registered Clinical Counsellor who works in Tagalog. The recurring material is specific: obligation to parents who sacrificed, hiya about bringing private trouble to a stranger, being the eldest daughter or the one who made it, marriages that hold two families, and the gap between a generation that calls it drama and a generation that calls it depression. The work does not treat the family as the diagnosis or distance as the cure.',
    updated: '2026-09-26',
    readMinutes: 6,
    opening: [
      'Filipino-Canadian families tend to be close, obligated and quiet about anything that might be called a mental-health problem, and the three go together. Closeness means everyone’s business is shared; obligation means a struggling adult child feels they are failing people who gave up everything; and the quiet is hiya, the propriety that keeps private trouble private. None of that is a flaw. It is a culture that has held families together across oceans, and it also means the person who most needs to talk is often the one who cannot.',
      'The generational gap is real. A parent who grew up where the only visible mental-health care was for the seriously ill hears "I think I am depressed" as either an exaggeration or a catastrophe. An adult child who grew up here has a vocabulary their parents do not, and no way to use it at home without it landing as blame.',
      'Counselling here is by video, in Tagalog, English or the Taglish most families actually speak, with a counsellor who does not need utang na loob explained. Nothing said in a session reaches anyone in the family.',
    ],
    whatComesUp: [
      { label: 'Utang na loob, and the right to struggle', detail: 'The debt to parents who sacrificed is real and honourable, and it is also the reason many people feel that being unhappy is ungrateful. Both things can be true; the work is on holding them together.' },
      { label: 'The eldest daughter', detail: 'The translator, the second parent, the one who sends money and manages the appointments. A role handed over at ten and never handed back. It comes up in almost every first conversation with a Filipina in her thirties.' },
      { label: 'Hiya and the stranger', detail: 'Bringing private trouble to someone outside the family feels improper, and a counsellor is the outside. Naming that in the first session, in the language the feeling has, usually dissolves most of it.' },
      { label: 'A marriage that holds two families', detail: 'In-laws, remittances, a parent living with you, and expectations about what a good son or daughter-in-law owes. Couples sessions are available in Tagalog and do not treat the extended family as the problem.' },
      { label: 'Talking to parents about therapy', detail: 'How to say it, whether to say it, and what to do when it lands as "why, what did we do wrong". There is a [Tagalog guide](/tagalog/gabay/pag-uusap-sa-pamilya-tungkol-sa-therapy) written for exactly this.' },
      { label: 'Faith, and where counselling sits beside it', detail: 'For many families prayer and the parish are the first place trouble goes, and that is not something counselling replaces. It sits alongside, and it is fine to say so in the room.' },
    ],
    sections: [
      {
        h2: 'What the work is, and what it is not',
        body: [
          'The standard Western frame for family difficulty, individuate, set boundaries, move out, describes a different life from the one most Filipino-Canadian families are trying to keep. Most people arriving here want something harder: to stay in relationship with parents and siblings and stop carrying the parts that are not theirs. That is a legitimate goal and it is workable, and any decision about distance stays yours.',
          'The approaches used most are practical: [CBT](/approaches/cognitive-behavioural-therapy) for the anxiety and the perfectionism that the eldest-daughter role selects for, [ACT](/approaches/acceptance-and-commitment-therapy) for people who understand their patterns fine and are still inside them, and couples or family sessions when the difficulty lives between people rather than in one of them.',
        ],
      },
      {
        h2: 'Language, privacy and paying for it',
        body: [
          'Sessions run in Tagalog, in English, or moving between them, and most bilingual sessions are mixed without anyone planning it. A parent who would never do therapy in English can do it in Tagalog, with an adult child helping set up the call and then leaving the room. The [words page](/resources/counselling-in-tagalog-what-the-words-mean) explains what counselling is called in Tagalog and why none of the words is quite right.',
          'Privacy is the barrier more often than stigma: the concern is who might hear. Sessions are by video, there is no clinic to be seen entering, and nothing goes to family, church or community. Most BC extended health plans reimburse a Registered Clinical Counsellor; the [coverage page](/resources/bc-extended-health-coverage-for-counselling) explains how to check, and [fees are published in full](/pricing).',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/tagalog-counselling', label: 'Tagalog-speaking counselling', why: 'For anyone in the family who would rather say it in Tagalog.' },
      { href: '/services/family-counselling', label: 'Family counselling', why: 'When the difficulty lives between people, and everyone is willing to be in the room.' },
      { href: '/services/couples-therapy', label: 'Couples therapy', why: 'For a marriage carrying two families, with both partners willing.' },
    ],
    midCta: {
      text: 'Thirty free minutes, in Tagalog or English, to see whether it fits. Nobody in the family is told.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can my parent have sessions in Tagalog while I book for them?', a: 'Yes, with their consent. An adult child making the first contact is common, and the free consultation is where the practicalities get sorted. After that the sessions are theirs, and what is said in them is not shared with you.' },
      { q: 'Will I be told to cut off my family?', a: 'No. That framing misreads the situation for most people. The work is usually about staying connected while no longer carrying what is not yours.' },
      { q: 'Do sessions have to be entirely in Tagalog?', a: 'No. Most people move between Tagalog and English within a sentence, and that is normal here. You do not have to choose a language in advance or stick to it.' },
      { q: 'Is this a Filipino counsellor?', a: 'Camille Granda is a Registered Clinical Counsellor and Canadian Certified Counsellor who works in Tagalog and English. Fit matters more than background for most people, and the free consultation exists so you can judge it before committing to anything.' },
    ],
    sources: [
      { label: 'HereToHelp BC, mental health information', url: 'https://www.heretohelp.bc.ca/' },
      { label: 'HealthLink BC, mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/for/filipino-healthcare-workers-and-caregivers', label: 'For Filipino healthcare workers and caregivers' },
      { href: '/tagalog/gabay/pag-uusap-sa-pamilya-tungkol-sa-therapy', label: 'Pag-uusap sa pamilya tungkol sa therapy' },
      { href: '/compare/therapy-in-tagalog-vs-english', label: 'Therapy in Tagalog or English' },
      { href: '/services/tagalog-counselling', label: 'Tagalog-speaking counselling' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

import type { Audience } from './audiences';

/* Punjabi-speaking couples.
 *
 * WHY THIS IS A SEPARATE PAGE FROM THE TWO IT SITS BETWEEN
 *
 * /for/couples is language-neutral, and /for/first-gen-south-asian-adults is
 * about an individual. Neither covers the thing that actually brings Punjabi-
 * speaking couples to counselling, which is that the marriage is rarely a
 * two-person system. In-laws, both families' reputations, and often a shared
 * household are inside the room whether or not anyone names them, and the
 * standard couples-therapy frame — two autonomous partners negotiating with
 * each other — describes a different situation.
 *
 * The tracked query is "punjabi couples counselling bc", ceiling 925, and it
 * was open. But the reason to build it is not the ceiling: it is that couples
 * work is the service where language matters most and where the generic page is
 * least adequate. An argument happens in the language it happened in. A couple
 * who fight in Punjabi and then relitigate it in English for a counsellor are
 * doing translation work in the middle of a fight, which is its own harm.
 *
 * WHAT THIS PAGE MUST NOT DO
 *
 * It must not pathologise the extended family, and it must not take the
 * Western individualist position by implication — that the healthy outcome is
 * separation from the family system. For many couples it is not, and a page
 * that assumes otherwise tells them at the outset that this counsellor does not
 * understand the life they are trying to keep.
 *
 * It also must not imply that arranged or family-introduced marriages are a
 * problem to be treated. That framing is both wrong and common, and it is the
 * single fastest way to lose a reader who came here hoping otherwise.
 *
 * NO OUTCOME CLAIMS. BCACC. Gottman is named as a method used, not as a thing
 * with a success rate attached — the "90% of couples improve" figure is
 * marketing copy and does not belong on a page like this.
 */
export const punjabiAudiences: Audience[] = [
  {
    slug: 'punjabi-speaking-couples',
    figure: 'first-session-flow',
    title: 'Punjabi-speaking couples counselling in BC',
    metaTitle: 'Punjabi Couples Counselling in BC | Westpeak Wellness',
    metaDescription:
      'Couples counselling in Punjabi or English, online across BC. For couples whose marriage involves two families, not just two people. Free 15-minute consultation.',
    eyebrow: 'For · Punjabi-speaking couples',
    lede:
      'Where the argument can happen in the language the argument happened in — and the in-laws do not have to be explained first.',
    updated: '2026-08-14',
    readMinutes: 7,

    opening: [
      'Most couples counselling is built around a two-person system: two partners, each with their own needs, negotiating with each other. It is a good model, and for a lot of couples it is the right one.',
      'It is also not what many Punjabi-speaking couples walk in with. The marriage sits inside two families, often inside a shared household, and frequently inside two sets of expectations about what a good husband, wife, son and daughter-in-law owe. Nobody in the room chose that arrangement and it does not go away because a counsellor finds it inconvenient to model.',
      'This is couples work that starts from there rather than arriving at it in session six. Sessions run in Punjabi, English, or moving between the two — which matters more in couples work than anywhere else, because the fight you are trying to describe already happened in one of them.',
    ],

    whatComesUp: [
      {
        label: 'Arguments that get translated before they get discussed',
        detail:
          'A row that happened in Punjabi, reconstructed in English for a counsellor, arrives flattened — the tone, the exact word, the thing that actually stung. Both partners then spend the session arguing about the translation rather than the argument.',
      },
      {
        label: 'In-laws as a third party in the marriage',
        detail:
          'Not a villain and not a footnote. A living arrangement, a set of obligations, and a genuine relationship that both partners may want to protect while also needing something to change inside it.',
      },
      {
        label: 'Two different scripts for the same role',
        detail:
          'What a husband owes his parents. What a wife owes her in-laws. Whether earning changes either. Two people can hold entirely different versions of these and have never once said them out loud, because both assumed theirs was simply what everyone thought.',
      },
      {
        label: 'The reputational cost of being in counselling at all',
        detail:
          'For many couples the fear is not the counselling. It is somebody finding out, and what that would be taken to mean about the marriage. This is a large part of why couples arrive later than they would like to have.',
      },
      {
        label: 'Migration strain that never got named',
        detail:
          'Arriving, credentials not recognised, working below your training, a spouse waiting years on immigration. The stress was survived rather than discussed, and the marriage absorbed it.',
      },
      {
        label: 'Intimacy and children, in a house with no privacy',
        detail:
          'Conversations that are hard anywhere are harder in a multigenerational home. Sometimes the practical constraint is the whole problem, and naming it is most of the work.',
      },
    ],

    sections: [
      {
        h2: 'What language changes in couples work specifically',
        body: [
          'In individual counselling, working in a second language costs precision. In couples counselling it costs something more: the ability to show your partner what you meant.',
          'A couple who argue in Punjabi and then describe it in English are doing simultaneous translation in the middle of a difficult conversation, while upset, in front of a third person. The version that reaches the counsellor is the calm, edited one — and the counsellor then works on the edited version, which is not the marriage.',
          'Sessions here can move between languages mid-sentence, including one partner speaking mostly Punjabi and the other mostly English, which is a very common pattern and not a problem to be fixed. Nothing has to be tidied up on the way in.',
        ],
      },
      {
        h2: 'The family is not treated as the diagnosis',
        body: [
          'A great deal of counselling written for Western couples treats extended-family involvement as enmeshment — a boundary problem, with the healthy outcome being more separation. Applied without thought to a family that lives together by choice and by culture, that reads as being told your family is the illness.',
          'The working position here is narrower and more useful: family involvement is neither healthy nor unhealthy in itself. What matters is whether the two of you agree about it, whether the arrangement is one you both actually chose, and whether either of you is carrying a cost you have never said aloud. Sometimes the answer is a change in the family arrangement. Often it is a change in what the two of you have agreed between yourselves about it.',
          'What will not happen is being told that the obvious solution is to move out and care less. That advice ends the conversation, and most people who have heard it once do not come back for more of it.',
        ],
      },
      {
        h2: 'Arranged and family-introduced marriages',
        body: [
          'A marriage that began through families is not a marriage with a problem in it, and it is not what the work is about unless you say it is.',
          'What does come up, and is worth naming, is that couples who married this way sometimes arrive without a shared history of having negotiated things privately — the practice of working out what the two of you want, separately from what either family expects, may simply not have been established. That is a skill rather than a flaw, and it is learnable.',
        ],
      },
      {
        h2: 'How the sessions actually run',
        list: [
          { label: 'Both partners, together', detail: 'Couples work is joint. Individual sessions may occasionally make sense alongside it, but the practice will not hold private information from one partner about the other — that arrangement damages the work and is declined rather than negotiated.' },
          { label: 'Gottman-informed', detail: 'A structured method for how conflict actually goes between two people, adapted to the situation in front of it rather than applied off the shelf. Named as an approach used, not as a promise about outcomes.' },
          { label: '50 or 110 minutes', detail: 'The extended session exists because couples work often needs longer than fifty minutes to get anywhere and come back. Many couples do the first session extended and then move to the standard length.' },
          { label: 'Two rooms is fine', detail: 'Partners can join from separate locations — different houses, one on shift, one travelling. For couples separated by immigration timelines this is sometimes the only way the work can happen at all.' },
          { label: 'Nothing is diagnosed', detail: 'Counselling is not assessment. If something in the picture needs a physician or a psychologist, that is said plainly and pointed toward.' },
        ],
      },
      {
        h2: 'Privacy, when the community is small',
        body: [
          'For couples in Surrey, Abbotsford or Delta the practical question is often not whether to get help but whether it can be done without anybody knowing. That is a reasonable thing to want and it is not evidence of shame.',
          'This practice has no office anywhere, so there is no waiting room to be seen in, and no professional or social overlap with the Lower Mainland South Asian community. Sessions are held by secure video and nothing is posted to a home address. The limits of confidentiality are the legal ones set out on [standards and scope](/standards), and they are the same regardless of who asks.',
          'The honest caveat is the one nobody mentions: the most common way people are found out is their own device. A shared laptop, a phone somebody else opens, a browser history. Worth a thought before the first session rather than after it.',
        ],
      },
    ],

    servicesThatFit: [
      {
        href: '/services/couples-therapy',
        label: 'Couples counselling',
        why: 'Fifty minutes, both partners, in Punjabi or English. The standard format most couples settle into.',
      },
      {
        href: '/services/punjabi-counselling',
        label: 'Punjabi-speaking counselling',
        why: 'The practical detail on how language works in sessions, including switching mid-sentence.',
      },
      {
        href: '/services/emdr-therapy',
        label: 'EMDR',
        why: 'Where one partner is carrying a trauma that keeps arriving in the marriage, individual EMDR alongside couples work is sometimes the more direct route.',
      },
    ],

    midCta: {
      text: 'A free 15-minute consultation is a conversation about whether this is the right fit, and both of you are welcome on it. Nothing is assessed and nothing is decided on the call.',
      label: 'Book a free consultation',
    },

    faqs: [
      {
        q: 'Can one of us speak mostly Punjabi and the other mostly English?',
        a: 'Yes, and it is one of the most common patterns. Sessions move between the languages as they need to, including within a single exchange. Neither of you has to work in your weaker language so the other can follow.',
      },
      {
        q: 'Will we be told to move out or cut off family?',
        a: 'No. Family involvement is not treated as the diagnosis. What matters is whether the two of you agree about the arrangement and whether either of you is carrying a cost that has never been said out loud — and the answer to that is often a change between the two of you rather than a change to the family.',
      },
      {
        q: 'Is an arranged marriage treated as a problem?',
        a: 'No. A marriage that began through families is not a marriage with something wrong in it, and it is not the subject of the work unless you make it so.',
      },
      {
        q: 'Can we join from different places?',
        a: 'Yes. Partners can be in separate locations, which matters for shift work, travel, and for couples separated by immigration timelines. Both need to be physically in BC at the time of the session.',
      },
      {
        q: 'Will our families find out?',
        a: 'Not from this practice. There is no office and no waiting room, sessions are by secure video, and nothing is sent to a home address. Confidentiality carries the legal limits set out on the standards page. The realistic risk is a shared device rather than anything at this end.',
      },
      {
        q: 'What does it cost, and is it covered?',
        a: 'Couples counselling is $170 for 50 minutes, or $340 for the 110-minute extended session. Many BC extended health plans that cover a Registered Clinical Counsellor cover couples sessions, though some exclude them specifically — it is worth checking the wording before booking. Receipts carry the RCC registration number.',
      },
    ],

    sources: [
      {
        label: 'Statistics Canada, Census Profile, 2021 Census — Surrey, City (CY), British Columbia',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?LANG=E&DGUIDlist=2021A00055915004&SearchText=surrey',
      },
      {
        label: 'BC Association of Clinical Counsellors — Find a Counsellor',
        url: 'https://bc-counsellors.org/counsellors/',
      },
    ],

    related: [
      { href: '/for/first-gen-south-asian-adults', label: 'For first- and second-generation South Asian adults' },
      { href: '/for/couples', label: 'For couples' },
      { href: '/punjabi-counselling/surrey', label: 'Punjabi-speaking counselling in Surrey' },
      { href: '/punjabi', label: 'ਪੰਜਾਬੀ ਵਿੱਚ' },
      { href: '/pricing', label: 'Fees and coverage' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

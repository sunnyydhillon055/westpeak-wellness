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
    shortAnswer:
      'Couples counselling in Punjabi or English, online across BC, for couples whose marriage involves two families rather than two people. The argument can happen in the language it happened in, in-laws are not treated as the diagnosis, and an arranged marriage is not treated as a problem to be fixed.',
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

  /* Intergenerational conflict. Tracked query "punjabi therapist
   * intergenerational family conflict", ceiling 930, and it was open.
   *
   * The distinction from /for/first-gen-south-asian-adults is real and worth
   * stating, because the obvious edit later will be to merge the two. That page
   * is about a person: identity, guilt, two selves, being the first in the
   * family to do this. This one is about a RELATIONSHIP that is not working,
   * usually with a parent, and usually where both people are behaving
   * reasonably by their own lights. Those need different work — the first is
   * largely individual, and this frequently turns out to be about what can be
   * said out loud and what cannot.
   *
   * The trap this page has to avoid is the one nearly every article on the
   * subject falls into: casting the parents as the problem and the adult child
   * as the one with insight. That reading is popular, occasionally true, and
   * useless as a starting position — partly because it is often wrong, and
   * partly because anybody who loves their parents will close the tab.
   */
  {
    slug: 'south-asian-intergenerational-conflict',
    figure: 'window-of-tolerance',
    title: 'When you and your parents cannot find each other',
    metaTitle: 'Intergenerational Conflict Counselling in Punjabi | BC',
    metaDescription:
      'Counselling in Punjabi or English for intergenerational conflict in South Asian families — where both sides are reasonable and neither can hear the other. Online across BC.',
    eyebrow: 'For · Families across a generation',
    lede:
      'Not a page about difficult parents. A page about two people who love each other and have stopped being able to hear one another.',
    shortAnswer:
      'Counselling in Punjabi or English for intergenerational conflict in South Asian families — where both people are reasonable by their own lights and neither can hear the other. Parents are not cast as the problem, and nobody is told the answer is to set boundaries and care less.',
    updated: '2026-08-14',
    readMinutes: 7,

    opening: [
      'Almost everything written about this treats it as a problem with the parents — they are controlling, they have not adapted, they need to accept who you are. Sometimes that is accurate. As a place to start it is close to useless, because the person reading usually loves their parents and will not accept a frame that makes them the antagonist, and because it explains nothing about how the situation actually arose.',
      'A more useful starting point: your parents made their decisions under conditions you did not live through, and you are making yours under conditions they cannot really picture. Migration is a rupture. It hands the next generation a life the previous one worked for and could not themselves have lived, and there is no version of that which does not produce this exact conflict.',
      'The reframe does not resolve anything by itself. It changes what the work is about — from who is right, to what can be said out loud and what each of you is protecting.',
    ],

    whatComesUp: [
      {
        label: 'A conversation that has been had forty times',
        detail: 'Same subject, same shape, same ending. Both people know the script and neither can get out of it. Usually marriage, career, money, religion, or moving out.',
      },
      {
        label: 'Being managed rather than known',
        detail: 'Editing what you report at home until the version your family holds of your life is substantially fictional — and the particular loneliness of being loved as that version.',
      },
      {
        label: 'Duty that is real, not imagined',
        detail: 'Not everyone wants to be released from obligation. Many people want to meet it and find the cost has quietly become unpayable. Those are different problems, and the advice for one harms the other.',
      },
      {
        label: 'Something that cannot be said at all',
        detail: 'A relationship, a sexuality, a faith that changed, a diagnosis, a marriage that is failing. Where disclosure carries a real risk rather than an imagined one, the work is about the risk before it is about the disclosure.',
      },
      {
        label: 'Anger that arrives out of proportion',
        detail: 'A small remark producing a response neither of you recognised. Usually the accumulated weight of the previous forty conversations, arriving at once.',
      },
      {
        label: 'Grief for a relationship you can see but not reach',
        detail: 'Knowing roughly what a good version would look like and not being able to get there from here. This is grief, and it is rarely named as such.',
      },
    ],

    sections: [
      {
        h2: 'What this is not',
        body: [
          'It is not family therapy — your parents are not in the room and usually are not going to be. That is a normal starting condition rather than a failure of the work, and a good deal changes in a relationship when one person changes how they participate in it.',
          'It is also not a process aimed at getting you to set boundaries and care less. That is the standard advice, it is built for a model of adulthood in which independence is the goal, and applied to a family that operates collectively it reads as a suggestion that you become a worse person. Some people do end up drawing firmer lines. Others end up meeting their obligations more deliberately and with less resentment. Both are legitimate, and the work does not begin with a view about which you should reach.',
        ],
      },
      {
        h2: 'What language changes here',
        body: [
          'More than on most pages of this site. The conversations at issue happened in Punjabi, and the exact word your mother used is frequently the whole point — its tone, who is entitled to say it, what it implies about your standing in the family. Translated into English for a counsellor it becomes a paraphrase, and the counsellor then works on the paraphrase.',
          'There is also a category of thing that does not survive translation at all. *Log kya kahenge* is not "what will people think" — the English is lighter and more optional, and misses that it names a real social mechanism with real consequences for people other than you. Sessions here run in Punjabi, English, or both, and none of it needs explaining from first principles before the work can start.',
        ],
      },
      {
        h2: 'Where this touches culture, and where it does not',
        body: [
          'Not everything difficult in a South Asian family is cultural, and treating it as though it were is its own error. Untreated depression in a parent, a drinking problem, a controlling marriage, or the long shadow of something that happened before you were born are not cultural features. They are the same things they would be in any family, and they need naming as such rather than being absorbed into "that is just how the family is".',
          'Part of the work is telling those apart: what is a cultural difference to be negotiated, what is an ordinary family difficulty, and what is genuinely harmful and needs to be called harmful. Those three get bundled together in most conversations about this — including in most counselling rooms that lack the context to separate them.',
        ],
      },
      {
        h2: 'If something at home is not safe',
        body: [
          'This page assumes a difficult relationship rather than a dangerous one. If there is violence, threat, financial control, or coercion around a marriage, that is a different situation, and it is not one to work through slowly in weekly sessions while it continues.',
          'VictimLink BC is 1-800-563-0808, any hour, in many languages including Punjabi. For immediate danger, 9-1-1. Nothing on this page should be read as a reason to stay somewhere unsafe in order to preserve a relationship.',
        ],
      },
    ],

    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual counselling', why: 'Where most of this work happens — one person, weekly or biweekly, in Punjabi or English.' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling', why: 'How language actually works in sessions, including moving between the two mid-sentence.' },
      { href: '/services/emdr-therapy', label: 'EMDR', why: 'Where one specific event keeps arriving in the present instead of staying in the past.' },
    ],

    midCta: {
      text: 'A free 15-minute consultation is a conversation about whether this is the right fit. Nothing is assessed, and there is no obligation afterwards.',
      label: 'Book a free consultation',
    },

    faqs: [
      { q: 'Do my parents need to be involved?', a: 'No, and usually they are not. This is individual work. A relationship often shifts a good deal when one person changes how they take part in it — which is fortunate, because waiting for the other person to agree to counselling can mean waiting indefinitely.' },
      { q: 'Will I be told to cut off my family?', a: 'No. That advice is built for a model of adulthood in which independence is the goal, and it lands badly on a family that operates collectively. Some people do draw firmer lines; others meet their obligations more deliberately and with less resentment. The work does not start with a view about which you should reach.' },
      { q: 'Can we talk about this in Punjabi?', a: 'Yes, and here it matters more than usual — the conversations at issue happened in Punjabi, and the exact word somebody used is often the entire point. Sessions move between Punjabi and English as needed.' },
      { q: 'What if I am not sure it is bad enough to bring?', a: 'That doubt is the most common reason people wait, and it is not a useful test. A relationship taking up this much of your attention is worth an hour of a counsellor’s attention, whether or not it would sound serious described to a stranger.' },
      { q: 'Is this the same as the page for first-generation South Asian adults?', a: 'They overlap and are not the same. That page is about being the person in the middle — identity, guilt, two selves. This one is about a specific relationship that is not working. Most people find one of them fits better than the other, and either is a reasonable place to start.' },
    ],

    sources: [
      { label: 'VictimLink BC — 24/7 support, multilingual', url: 'https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/victimlinkbc' },
      { label: 'BC Association of Clinical Counsellors — Find a Counsellor', url: 'https://bc-counsellors.org/counsellors/' },
    ],

    related: [
      { href: '/for/first-gen-south-asian-adults', label: 'For first- and second-generation South Asian adults' },
      { href: '/guides/intergenerational-trauma-explained', label: 'Intergenerational trauma explained' },
      { href: '/for/punjabi-speaking-couples', label: 'Punjabi-speaking couples counselling' },
      { href: '/punjabi', label: 'ਪੰਜਾਬੀ ਵਿੱਚ' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

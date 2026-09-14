import type { Audience } from './audiences';

/* Added 11 Sep 2026, from the client-acquisition review. Two audiences the
 * practice is unusually well placed for and had no page for:
 *
 *   · long-haul and local truck drivers — a large share of the Punjabi
 *     workforce in Surrey, Abbotsford, Delta and the Interior, working hours
 *     no clinic keeps, in a cab that is the one private room they have. A
 *     Punjabi-speaking counsellor who books around a run is a real fit and
 *     nobody was saying so.
 *   · international students in BC — an enquiry arrived from a university
 *     address on 1 Sep; the "university-students" page is written for the
 *     domestic student's benefit plan, not the international one, and the
 *     questions (which plan, does it cover a counsellor, what about the
 *     immigration worry underneath everything) are different.
 *
 * Same rules as every audience page: descriptive, never predictive (BCACC),
 * no invented figures, and honest about what the practice is not. */

export const moreAudiences5: Audience[] = [
  {
    slug: 'truck-drivers',
    figure: 'bc-reach',
    figure2: 'first-session-flow',
    title: 'Counselling for truck drivers in BC',
    metaTitle: 'Counselling for Truck Drivers in BC | Westpeak Wellness',
    metaDescription:
      'Online counselling that books around a run: from the cab, in Punjabi or English, evenings and between loads. For long-haul and local drivers in BC.',
    eyebrow: 'For · Truck drivers',
    lede:
      'The job is long hours alone, a schedule set somewhere else, and a body that sits for twelve of them. Counselling has never been built for that. This is.',
    shortAnswer:
      'Westpeak Wellness offers online counselling for long-haul and local truck drivers anywhere in British Columbia, in English or Punjabi, by video from a parked cab or from home between runs. Sessions are booked run by run rather than at a fixed weekly time, evenings are available, and pausing between blocks costs nothing. The first 30-minute consultation is free.',
    updated: '2026-09-11',
    readMinutes: 6,
    opening: [
      'A great deal of the trucking workforce in the Lower Mainland, the Fraser Valley and the Interior is Punjabi-speaking, and a great deal of it works on a schedule that no counselling office keeps: out for days, back for two, out again, with the dispatch deciding which. A standing Tuesday appointment does not survive that, and most drivers who try counselling stop after the second missed session, which is the point at which it looked like it was not for them.',
      'It was the format that was not for them. This page is about what changes when the session comes to the cab.',
    ],
    whatComesUp: [
      { label: 'Sleep that never resets', detail: 'Irregular starts, sleeper-berth nights, and a body clock that has stopped expecting anything. The anxiety and low mood that come with chronic short sleep are real and they respond to work, once the sleep itself is being looked at alongside.' },
      { label: 'Being alone for most of the week', detail: 'Hours of nobody, then a house full of people who have been managing without you. The switch is hard in both directions, and it is one of the most common things drivers bring.' },
      { label: 'The near-miss that stays', detail: 'A jack-knife on the Coquihalla, a car that pulled out, a crash you drove past. These sit in the body and come back on the same stretch of road. This is trauma work, and it is done at your pace.' },
      { label: 'Money, the truck, the family', detail: 'Owner-operators carry the payment, the fuel, the broker and the family in one head. The pressure has a shape, and naming it is the beginning of managing it.' },
      { label: 'Anger that arrives faster than it used to', detail: 'On the road, at home, at dispatch. Usually exhaustion and something underneath it, rarely the person you actually are.' },
    ],
    sections: [
      {
        h2: 'How a session fits a run',
        list: [
          { label: 'From the cab', detail: 'A parked truck is a private room with a door. Sessions from a rest area, a yard or a customer lot are normal here, as long as the engine is off and you are stopped for the hour.' },
          { label: 'Run by run, not weekly', detail: 'Book when you know your next window. Two sessions in a home week and none in an out week is a pattern, not a failure, and nothing is charged for the gap.' },
          { label: 'Evenings', detail: 'Weekday evenings by request, which is when many drivers are actually stopped.' },
          { label: 'Phone data is enough', detail: 'A video call runs on a phone signal at most stops. If it drops, the first session sets out what happens: the call resumes, or it finishes by phone.' },
          { label: 'Punjabi or English', detail: 'Or both in one session, which is how most bilingual people think anyway. Nothing about family, izzat or what is owed needs explaining first.' },
        ],
      },
      {
        h2: 'What this is not',
        body: [
          'It is not a medical exam, and it does not touch your licence. A Registered Clinical Counsellor does not diagnose, does not report to ICBC or to an employer, and does not have any role in medical fitness to drive. Confidentiality is a legal duty and its limits are set out on the [standards page](/standards); nothing goes to a carrier, a dispatcher or an insurer.',
          'It is also not a crisis service. If you are in immediate danger, pull over and call 911; 9-8-8 by call or text is there at any hour.',
        ],
      },
      {
        h2: 'Paying for it',
        body: [
          'Company drivers often have an extended health plan that reimburses a Registered Clinical Counsellor; the [coverage page](/resources/does-my-plan-cover-counselling-bc) says how to check yours in two minutes. Owner-operators usually pay directly and can claim the receipt as a medical expense at tax time. Fees are on the [fees page](/pricing), in full.',
          'After a crash on the job, [WorkSafeBC](/resources/worksafebc-psychological-injury-claims) may cover counselling for a psychological injury, and [ICBC](/resources/icbc-counselling-after-a-crash-bc) covers counselling after a collision in BC whoever was at fault. Both pages set out how.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'For sleep, anxiety, low mood, anger and the switch between the road and home.' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling', why: 'Sessions in Punjabi, English or both, with a counsellor who does not need the context explained.' },
      { href: '/services/emdr-therapy', label: 'EMDR and trauma therapy', why: 'For the crash or the near-miss that comes back on the same stretch of road.' },
    ],
    midCta: {
      text: 'A free 30-minute consultation, from wherever you are stopped. No card, and no obligation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I really do a session from the truck?', a: 'Yes, parked, engine off, for the hour. Rest areas, yards and customer lots all work. What matters is that nobody can hear you for that hour and the signal holds; both are checked at the first call.' },
      { q: 'I never know my schedule more than a few days out.', a: 'Book a few days out, then. The calendar is not a weekly commitment; you take a time when you know your window, and there is no charge for the weeks you cannot.' },
      { q: 'Will this affect my licence or my medical?', a: 'No. Counselling is confidential and a counsellor does not assess or report fitness to drive. That is a physician\'s role, and it is separate from this.' },
      { q: 'Does my carrier find out?', a: 'No. Nothing is sent to an employer, a dispatcher or an insurer. If you claim it through a company extended health plan, the insurer sees a receipt for counselling and nothing about what was discussed.' },
      { q: 'Can the session be in Punjabi?', a: 'Yes, with Savneet Singh, RCC, who works in Punjabi and English and moves between them as the conversation needs.' },
    ],
    sources: [
      { label: 'HealthLink BC', url: 'https://www.healthlinkbc.ca/' },
      { label: 'WorkSafeBC', url: 'https://www.worksafebc.com/' },
    ],
    related: [
      { href: '/for/rotational-and-camp-workers', label: 'For rotational and camp workers' },
      { href: '/punjabi-counselling', label: 'Punjabi-speaking counselling by region' },
      { href: '/guides/anxiety-and-sleep', label: 'Anxiety and sleep' },
      { href: '/resources/icbc-counselling-after-a-crash-bc', label: 'Counselling after a crash: ICBC' },
      { href: '/practitioners/savneet-singh', label: 'Savneet Singh, RCC' },
    ],
  },
  {
    slug: 'international-students',
    figure: 'reimbursement-flow',
    figure2: 'first-session-flow',
    title: 'Counselling for international students in BC',
    metaTitle: 'Counselling for International Students in BC | Westpeak',
    metaDescription:
      'Online counselling for international students in BC: what your health plan covers, where campus counselling stops, and how to book without a family doctor.',
    eyebrow: 'For · International students',
    lede:
      'You crossed the world for this, the money is somebody else\'s sacrifice, and admitting it is hard feels like a betrayal of all of it. That is the exact situation this page is for.',
    shortAnswer:
      'Westpeak Wellness offers online counselling to international students anywhere in British Columbia, in English, Punjabi or Tagalog, by secure video with a Registered Clinical Counsellor. Many international student health plans in BC reimburse counselling with a registered counsellor up to an annual limit; the plan booklet says how much. No referral or family doctor is needed, and the first 30-minute consultation is free.',
    updated: '2026-09-11',
    readMinutes: 7,
    opening: [
      'The pressures are specific. Grades that decide whether the permit continues. Work hours capped, rent uncapped. A family at home who paid for this and asks every week how it is going, in a language in which "fine" is the only acceptable answer. And a campus counselling service that is excellent and has a wait, a session cap, and a receptionist who is a classmate.',
      'Counselling does not change the permit or the rent. It changes how much of you the pressure gets, and it is usually the first place where the whole picture can be said out loud, in whichever language it comes out in.',
    ],
    whatComesUp: [
      { label: 'Anxiety that has become the background', detail: 'Deadlines, the permit, money, and a body that never stops bracing. It responds well to focused work, and it is the most common reason students book.' },
      { label: 'Loneliness in a crowd', detail: 'Surrounded by people and known by none of them. The loneliness of the first year abroad is a documented pattern, not a personal failing.' },
      { label: 'The family who cannot be told', detail: 'Parents who sold something to pay for this, who cannot be worried, and who would not understand counselling if they were. What can be said, and to whom, is work in itself.' },
      { label: 'Falling behind, and hiding it', detail: 'A missed assignment becomes a missed term becomes a status problem. The hiding is usually worse than the grade, and earlier is much easier than later.' },
      { label: 'Something from before you came', detail: 'Distance does not leave it behind. Trauma, family conflict and grief travel, and often arrive in the quiet after the first busy months.' },
    ],
    sections: [
      {
        h2: 'What your plan probably covers',
        body: [
          'Most international students in BC are on a private plan arranged through the institution for the first months, then on MSP once eligible, with the private plan often continuing for what MSP does not cover. Counselling with a Registered Clinical Counsellor is commonly one of those things, up to an annual maximum, but the amount and the eligible practitioners are set by your plan, not by the practice.',
          'The check takes two minutes: open the plan booklet or portal, search for "counsellor", "clinical counsellor" or "mental health", and note the maximum and whether a doctor\'s referral is mentioned. The [coverage page](/resources/does-my-plan-cover-counselling-bc) walks through it for the common insurers, and the same approach works for a student plan. You pay at booking and claim the receipt; the practice does not bill the plan directly.',
          'MSP itself does not cover private counselling. It covers a physician and, on referral, a psychiatrist; the [MSP page](/resources/msp-vs-extended-health) sets out where each fits.',
        ],
      },
      {
        h2: 'Campus counselling and this, side by side',
        list: [
          { label: 'Campus counselling', detail: 'Free, on site, and good. Usually short-term with a session cap, sometimes a wait of weeks, and on a small campus the waiting room is not anonymous. Use it; it is yours.' },
          { label: 'Private counselling', detail: 'Paid, or reimbursed by the plan, with no cap other than the plan\'s and no wait beyond the calendar. By video, so no waiting room. The choice of counsellor is yours, including one who speaks your language.' },
          { label: 'Both', detail: 'Common, and sensible: campus for the acute week, private for the longer work, or the reverse. Neither needs to know about the other.' },
        ],
      },
      {
        h2: 'What this practice is not',
        body: [
          'Not an immigration adviser, and not connected to the institution. Nothing said in a session reaches the school, the plan beyond a receipt, or Immigration, Refugees and Citizenship Canada. Confidentiality is a legal duty with narrow limits, set out on the [standards page](/standards). A counsellor also does not write letters about permits or academic accommodation; those come from a physician or the institution\'s accessibility office, and the counsellor can help you prepare for that conversation.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'For anxiety, low mood, loneliness and the pressure that has become the background.' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling', why: 'For students from Punjab who would rather not translate themselves for an hour.' },
      { href: '/tagalog-counselling', label: 'Tagalog-speaking counselling', why: 'Sessions in Tagalog or English with Camille Granda, RCC, CCC.' },
    ],
    midCta: {
      text: 'A free 30-minute consultation, by video, in English, Punjabi or Tagalog. No card, no referral, no obligation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Do I need a family doctor or a referral?', a: 'No. Counselling with a Registered Clinical Counsellor needs no referral, and no family doctor. If your plan mentions a referral for reimbursement, that is a plan rule rather than a practice one, and the plan booklet will say.' },
      { q: 'Will my school or IRCC find out?', a: 'No. Nothing goes to the institution or to Immigration, Refugees and Citizenship Canada. The only outside party that sees anything is your insurer, if you claim, and it sees a receipt for counselling.' },
      { q: 'Can I be seen in my own language?', a: 'In Punjabi, with Savneet Singh, RCC, or in Tagalog, with Camille Granda, RCC, CCC, as well as in English. Sessions can move between languages within the hour.' },
      { q: 'What if I cannot afford it after the plan maximum?', a: 'Say so at the consultation. The [low-cost counselling page](/resources/low-cost-counselling-bc) lists free and sliding-scale options across BC, including campus services, and you will be pointed there rather than asked to pay for something you cannot.' },
      { q: 'I am on a co-op term outside BC. Can I still book?', a: 'A session counts as happening where you are sitting. Anywhere in Canada is possible with Camille Granda; elsewhere in BC with any counsellor. Outside Canada, not through this practice.' },
    ],
    sources: [
      { label: 'HealthLink BC', url: 'https://www.healthlinkbc.ca/' },
      { label: 'BC Medical Services Plan (MSP)', url: 'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp' },
    ],
    related: [
      { href: '/for/university-students', label: 'For university students' },
      { href: '/resources/does-my-plan-cover-counselling-bc', label: 'Does my plan cover counselling?' },
      { href: '/resources/low-cost-counselling-bc', label: 'Free and low-cost counselling in BC' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
      { href: '/for/first-gen-south-asian-adults', label: 'For first- and second-generation South Asian adults' },
    ],
  },
  {
    /* Added 14 Sep 2026. The owner: "we handle youth/young adults." Nothing on
       the site said so; the individual-therapy page read as adults only. This
       page says it plainly, with the consent point that matters in BC (the
       Infants Act: a young person who understands the care can consent to it)
       and with a parent's questions answered beside the teen's. Descriptive,
       never predictive; no invented figures. */
    slug: 'teens-and-young-adults',
    figure: 'first-session-flow',
    figure2: 'window-of-tolerance',
    title: 'Counselling for teens and young adults in BC',
    metaTitle: 'Counselling for Teens and Young Adults in BC | Westpeak',
    metaDescription:
      'Online counselling for teens and young adults across BC: anxiety, school pressure, identity, family. How consent works for a teen, and what a parent is told.',
    eyebrow: 'For · Teens and young adults',
    lede:
      'Fifteen to twenty-five is the age when most mental health difficulty first shows up, and the age at which it is least likely to be brought to anyone. This page is for the teen, and for the parent reading over their shoulder.',
    shortAnswer:
      'Westpeak Wellness offers online counselling to teenagers and young adults across British Columbia, by secure video with a Registered Clinical Counsellor, in English, Punjabi or Tagalog. A teen can book with a parent or, in BC, on their own if they understand the care, under the Infants Act. What is said in session stays in session, with the limits set out at the first meeting, and a parent is included as much as the young person wants. The first 30-minute consultation is free and a parent can attend it.',
    updated: '2026-09-14',
    readMinutes: 6,
    opening: [
      'The pressures at this age are concentrated: school and then university, the first relationships, a body and an identity still being decided, a family that is either too close or not close enough, and a phone that never lets any of it rest. Anxiety, low mood, panic and difficulties with eating and sleep most often begin here, and they are more workable here than at any later point.',
      'Counselling at this age is not a parent sending a child to be fixed. It is a room the young person controls, with an adult in it who is not their parent and not their teacher, where the thing can be said the way it actually is.',
    ],
    whatComesUp: [
      { label: 'Anxiety about school, marks and what comes next', detail: 'Exams, applications, a future that feels decided by the next term. This is the most common reason a teen or student books, and it responds well to focused work.' },
      { label: 'Feeling low, flat or not like yourself', detail: 'Not sad exactly; nothing. Sleeping late, dropping things you liked, a shortness with everyone. Often the first sign, and often mistaken for laziness by people who love you.' },
      { label: 'Family: too much or too little', detail: 'Expectations that were never said out loud, a home where feelings are not discussed, parents who came from somewhere else and a childhood that happened here. Much of the work is finding words for this.' },
      { label: 'Identity, and who to tell', detail: 'Sexuality, gender, faith, culture, or simply who you are turning out to be. Counselling is a place to work that out before it has to be announced to anyone.' },
      { label: 'Friendships, relationships and being online', detail: 'The first serious relationship, the friend group that turned, the thing that was posted. These are real losses and they are treated as such.' },
    ],
    sections: [
      {
        h2: 'Consent and confidentiality, for a teen',
        body: [
          'In British Columbia a young person under 19 can consent to their own health care, including counselling, when the counsellor is satisfied they understand what it is and what it involves; this is the Infants Act, and it is respected here. In practice most teens come with a parent\'s knowledge and often a parent\'s booking, and either route is fine.',
          'What a teen says in session is confidential from a parent, with the limits every counsellor has: a risk of serious harm to the young person or someone else, abuse or neglect of a minor, or a court order. Those limits are explained in plain words at the first meeting, to the teen and to the parent, so nobody is surprised later. The [standards page](/standards) sets them out in full.',
        ],
      },
      {
        h2: 'For the parent',
        list: [
          { label: 'You can be in the first consultation', detail: 'The free 30-minute call is a chance for both of you to meet the counsellor. After that, the young person decides how much of the work is theirs alone, and most choose most of it.' },
          { label: 'What you will hear', detail: 'Whether sessions are happening, and anything the counsellor is obliged to share under the limits above. Not the content. A teen who knows this is far more likely to say what matters.' },
          { label: 'How to raise it without a fight', detail: 'Offer it as a place that is theirs, not a consequence. "You can talk to someone who is not us" lands better than "you need help". The [guide on talking to family about therapy](/guides/talking-to-your-family-about-therapy) is written for the other direction, and works for this one too.' },
          { label: 'Paying', detail: 'A parent\'s extended health plan usually covers dependants to the same counselling maximum; the [coverage page](/resources/does-my-plan-cover-counselling-bc) says how to check. University students often have a plan of their own through the student society.' },
        ],
      },
      {
        h2: 'For a young adult booking alone',
        body: [
          'At 19 and over nobody else is involved unless you want them to be. No referral is needed, no family doctor, and no diagnosis; you book the consultation, say what is going on, and decide from there. Sessions are by video from wherever is private, which for many students is a car, a library room or a walk with earbuds in.',
          'If money is the reason for not booking, say so at the consultation. A student plan, a parent\'s plan and a receipt at tax time each cover part of it, and the [fees page](/pricing) has every number.',
        ],
      },
    ],
    servicesThatFit: [
      { href: '/services/individual-therapy', label: 'Individual therapy', why: 'For anxiety, low mood, school pressure, identity and family, at the young person\'s own pace.' },
      { href: '/services/punjabi-counselling', label: 'Punjabi-speaking counselling', why: 'For a young person whose family lives in Punjabi and whose life happens in English.' },
      { href: '/tagalog-counselling', label: 'Tagalog-speaking counselling', why: 'The same, for a Filipino family.' },
    ],
    midCta: {
      text: 'A free 30-minute consultation, with or without a parent on the call. No card, and no obligation.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'What age do you see?', a: 'Teenagers and young adults, by video. The youngest a counsellor here works with is decided at the consultation, on whether video counselling is the right fit for that young person; for children, an in-person child therapist is usually the better route and the counsellor will say so.' },
      { q: 'Can my teenager book without me knowing?', a: 'In BC, a young person under 19 who understands what counselling is can consent to it themselves under the Infants Act. Most teens come with a parent\'s knowledge, and a counsellor will encourage that where it is safe, but it is the young person\'s decision.' },
      { q: 'Will I be told what my child says?', a: 'No, beyond whether sessions are happening and anything the counsellor is legally obliged to share: a serious risk of harm, abuse or neglect, or a court order. Those limits are explained to both of you at the start.' },
      { q: 'Does the parent attend sessions?', a: 'The first consultation, if you both want. After that, sessions are the young person\'s, with a parent brought in when the young person and the counsellor agree it would help.' },
      { q: 'Is video counselling right for a teenager?', a: 'For most teens from mid-adolescence it works well; it is their native medium and it removes the waiting room. What it needs is a private space for the hour, which is discussed at the consultation.' },
      { q: 'Does extended health cover a dependant?', a: 'Usually, to the same counselling maximum as the plan member, when the counsellor is a Registered Clinical Counsellor. The plan booklet or portal says the amount; you pay at booking and claim the receipt.' },
    ],
    sources: [
      { label: 'Infants Act, RSBC 1996, c. 223', url: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96223_01' },
      { label: 'Foundry BC', url: 'https://foundrybc.ca/' },
      { label: 'Kids Help Phone', url: 'https://kidshelpphone.ca/' },
    ],
    related: [
      { href: '/for/university-students', label: 'For university students' },
      { href: '/for/international-students', label: 'For international students' },
      { href: '/for/first-gen-south-asian-adults', label: 'For first- and second-generation South Asian adults' },
      { href: '/guides/anxiety-and-sleep', label: 'Anxiety and sleep' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
    ],
  },
];

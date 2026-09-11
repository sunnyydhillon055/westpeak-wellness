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
];

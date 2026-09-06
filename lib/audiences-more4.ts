import type { Audience } from './audiences';

/* Added 6 Sep 2026. Search Console showed HR-side queries ("stay at work
 * services", return-to-work) reaching the workplace resource at #48, which is
 * written for the employee. This is the page for the other side of the desk.
 *
 * It is honest about what a small practice is and is not: not an EAP, not a
 * fitness-to-work assessor, and not a party to the employment relationship.
 * lib/resources-more.ts already says "not as your EAP" on the employee page;
 * this page says the same thing to the employer, and then what is possible. */

export const moreAudiences4: Audience[] = [
  {
    slug: 'employers-and-hr',
    title: 'Counselling support for BC employers and HR',
    metaTitle: 'Counselling for Your Employees in BC | Westpeak Wellness',
    metaDescription:
      'What a BC employer can and cannot do to get an employee counselling, how it is paid for, what you may ask, and what this practice can offer, honestly.',
    eyebrow: 'For employers and HR',
    lede:
      'Somebody on your team is not alright, and you are trying to help without overstepping. This is what that looks like in practice.',
    shortAnswer:
      'An employer in BC cannot book counselling for an employee, but it can make it reachable: a working EFAP, a plan that lists Registered Clinical Counsellors, a health spending account, paid sick leave that is actually usable, and a manager who knows what not to ask. Westpeak Wellness is a small virtual practice, not an EAP provider; employees book directly, pay at booking, and receive receipts their plan can process. What the practice can offer an employer is clarity about how that works and, within scope, attendance confirmation when an employee asks for it.',
    updated: '2026-09-06',
    readMinutes: 7,
    figure: 'reimbursement-flow',
    opening: [
      'Most managers meet this at the worst moment: a good employee has gone quiet, or asked for time off without saying why, or said something in a one-to-one that you were not trained to hear. The instinct is to fix it. The job is narrower than that, and knowing where the edge is protects both of you.',
      'What follows is the practical version: how counselling gets paid for in a BC workplace, what you are entitled to ask, what a small private practice like this one can and cannot do for an employer, and the two or three things that make the difference between a benefit that exists on paper and one that gets used.',
    ],
    whatComesUp: [
      { label: '"We have an EFAP and nobody uses it"', detail: 'Usually because nobody knows what it covers, it is described as a crisis line, or people assume HR sees the usage. Saying plainly that it is confidential, free, and for ordinary problems changes uptake more than any poster.' },
      { label: '"They asked for stress leave and I do not know what I can ask"', detail: 'You can ask for confirmation of inability to work and an expected duration. You cannot ask for the diagnosis, the treatment, or what is discussed in sessions.' },
      { label: '"I want to pay for their counselling"', detail: 'Generous, and it needs a structure: a health spending account, a wellness account, or a plan change. Paying a counsellor directly for a named employee creates a relationship the counsellor cannot be part of.' },
      { label: '"Can you tell us if they are fit to return?"', detail: 'A counsellor cannot. Fitness-to-work is a physician\'s or an occupational-health assessment. A counsellor can confirm attendance, with the employee\'s written consent, and nothing else.' },
      { label: '"The team is burnt out, not one person"', detail: 'Then the question is workload and design, which counselling for individuals does not fix. It can still help the individuals while the structural part is being addressed.' },
    ],
    sections: [
      {
        h2: 'How counselling gets paid for in a BC workplace',
        list: [
          { label: 'Employee and family assistance program (EFAP)', detail: 'A contracted provider, a set number of short-term sessions, free to the employee, confidential from the employer. The most under-used benefit in most workplaces. This practice is not an EFAP provider; the comparison of EFAP and private counselling is on its own page.' },
          { label: 'Extended health plan', detail: 'Reimburses eligible practitioners up to an annual maximum. Whether a Registered Clinical Counsellor is eligible is a plan-design choice you or your broker made. If it is not, the single most useful change an employer can make is to add RCC and CCC to the practitioner list at renewal.' },
          { label: 'Health spending account', detail: 'Reimburses any receipt that qualifies as a medical expense, which counselling by a registered counsellor does. The flexible route where the paramedical list is narrow.' },
          { label: 'Paid sick leave', detail: 'The Employment Standards Act entitles most employees to paid sick days, and mental-health conditions count. Making it clear that a counselling appointment is a legitimate use is worth saying out loud.' },
          { label: 'Direct payment', detail: 'Possible only through a structure that keeps the employer out of the clinical relationship, such as a wellness account. The practice does not invoice employers for an individual\'s sessions.' },
        ],
      },
      {
        h2: 'What you may ask, and what you may not',
        body: [
          'An employer is entitled to **functional** information: that an employee cannot perform their duties or needs an accommodation, what the limitations are, and when this will be reviewed. That comes from a physician or nurse practitioner, not from a counsellor.',
          'An employer is not entitled to a diagnosis, to treatment details, or to anything said in a session. Asking is a human-rights problem as well as a trust problem. If a leave is in play, the [stress leave guide](/guides/stress-leave-bc) sets out the routes and the [workplace mental-health resource](/resources/workplace-mental-health-bc) covers accommodation and return to work in more depth.',
          'The duty to accommodate under the BC Human Rights Code applies to mental-health disabilities. In practice it means adjusting hours, duties or location where that is reasonable, and documenting the conversation. It does not mean diagnosing or managing the condition.',
        ],
      },
      {
        h2: 'What this practice can offer an employer',
        list: [
          { label: 'Clarity, in advance', detail: 'A short conversation about how employees would reach the practice, what a receipt contains, and what the plan needs to list. No contract and no cost.' },
          { label: 'Attendance confirmation', detail: 'With the employee\'s written consent, confirmation that they attended on given dates. Nothing about content, and never without consent.' },
          { label: 'Sessions that fit shifts', detail: 'Video sessions, evening availability depending on the counsellor, and no travel time, which is the practical difference for shift, rotational and remote workers.' },
          { label: 'Three languages', detail: 'English, Punjabi and Tagalog, which matters in workforces where the person who most needs to talk is least likely to do it in a second language.' },
          { label: 'A straight answer about fit', detail: 'If an employee needs something this practice does not provide, a psychiatric assessment, an occupational-health opinion, a crisis service, they will be told so and pointed there.' },
        ],
      },
      {
        h2: 'What it cannot offer',
        body: [
          'It is not an EAP and does not run one. It does not provide fitness-to-work assessments, independent medical examinations, or reports to employers or insurers about an employee\'s condition. It does not accept employer referrals that bypass the employee: the person books, or nobody does.',
          'Those limits are the scope of a Registered Clinical Counsellor, and the practice would rather state them than be found out later to have implied otherwise.',
        ],
      },
      {
        h2: 'Three things that change whether the benefit gets used',
        list: [
          { label: 'Say what the EFAP actually covers', detail: 'In a sentence, from a manager, in a team meeting: it is free, it is confidential, HR does not see who uses it, and it is for ordinary problems. Uptake moves.' },
          { label: 'Fix the practitioner list at renewal', detail: 'If the plan lists psychologists only, most counselling in BC is unreimbursable under it. Adding RCC and CCC is a small change with a large effect.' },
          { label: 'Make time off for appointments normal', detail: 'A counselling appointment is a health appointment. Managers who treat it as one, without asking what it is for, are doing the most useful thing on this page.' },
        ],
      },
    ],
    servicesThatFit: [
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling', why: 'The comparison to send an employee who has used up the EFAP sessions or wants continuity.' },
      { href: '/resources/workplace-mental-health-bc', label: 'Mental health and work in BC', why: 'Leave, accommodation, disability insurance and WorkSafeBC, from the employee side.' },
      { href: '/for/healthcare-and-shift-workers', label: 'Counselling for healthcare and shift workers', why: 'For workforces on rosters, where the appointment has to fit the shift.' },
    ],
    midCta: {
      text: 'If you would rather talk it through than read it, a short call about how this would work for your team costs nothing.',
      label: 'Get in touch',
    },
    faqs: [
      { q: 'Can an employer book counselling for an employee in BC?', a: 'No. The employee books, consents and holds the relationship. An employer can make counselling reachable through the EFAP, the plan\'s practitioner list, a health spending account and usable sick leave.' },
      { q: 'Can we pay for an employee\'s counselling directly?', a: 'Only through a structure that keeps the employer out of the clinical relationship, such as a health or wellness spending account. This practice does not invoice employers for an individual\'s sessions.' },
      { q: 'Will the counsellor tell us how the employee is doing?', a: 'No. With the employee\'s written consent, the counsellor can confirm attendance on given dates. Nothing about content, and nothing without consent.' },
      { q: 'Can a counsellor confirm someone is fit to return to work?', a: 'No. Fitness-to-work comes from a physician, nurse practitioner or occupational-health assessment. A counsellor works within their scope and says so.' },
      { q: 'Is Westpeak Wellness an EAP provider?', a: 'No. It is a small virtual practice. Employees book directly and pay at booking, and their plan or health spending account reimburses them where it lists the designation.' },
      { q: 'What should we ask our benefits broker?', a: 'Whether the plan lists Registered Clinical Counsellors and Canadian Certified Counsellors as eligible practitioners, what the annual maximum is, and whether a health spending account can be added.' },
    ],
    sources: [
      { label: 'BC Employment Standards, leaves and job protection', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off' },
      { label: 'BC Human Rights Tribunal', url: 'https://www.bchrt.bc.ca/' },
      { label: 'WorkSafeBC, mental health claims', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bc-counsellors.org/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'How to get stress leave in BC' },
      { href: '/resources/does-my-plan-cover-counselling-bc', label: 'Does my plan cover counselling?' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/guides/workplace-bullying-in-bc', label: 'Workplace bullying in BC' },
      { href: '/contact', label: 'Contact the practice' },
    ],
  },
];

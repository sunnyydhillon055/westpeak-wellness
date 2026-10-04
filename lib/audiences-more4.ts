import type { Audience } from './audiences';
import type { Catalog } from './cliniko-catalog';
import { money } from './cliniko-catalog';
import { practitioners, type Practitioner } from './practitioners';
import { reachSentence } from './practice-facts';
import { CANCELLATION_TERMS } from './policies';

/* Added 6 Sep 2026. Search Console showed HR-side queries ("stay at work
 * services", return-to-work) reaching the workplace resource at #48, which is
 * written for the employee. This is the page for the other side of the desk.
 *
 * It is honest about what a small practice is and is not: not an EAP, not a
 * fitness-to-work assessor, and not a party to the employment relationship.
 * lib/resources-more.ts already says "not as your EAP" on the employee page;
 * this page says the same thing to the employer, and then what is possible.
 *
 * ONE EMPLOYER PAGE — 1 Oct 2026. /resources/counselling-support-for-bc-teams
 * now 301s here (lib/redirects.mjs). It had 67 impressions at position 43.94
 * and no clicks, and still called the practice "solo"; this page had none in
 * Search Console at all. Its manager guidance, the Fraser Valley language
 * point and the workshops answer moved here; "solo", "receipts that work with
 * every plan" and "bookable that week" did not. The title carries the teams
 * page's query words ("workplace mental health support").
 *
 * HR IS NOT SENT TO A CLIENT CONSULTATION — same day. The hero said "Book a
 * free consultation about counselling for your team", which spent one of the
 * few consultation slots a week on a conversation an email answers. `cta`
 * sends HR to the contact form with the 'employer' choice preselected
 * (lib/enquiry-fields.ts), and offers the booking page only on behalf of an
 * employee. */

export const moreAudiences4: Audience[] = [
  {
    slug: 'employers-and-hr',
    ctaFor: 'about counselling for your team',
    title: 'Counselling support for BC employers and HR',
    metaTitle: 'Workplace Mental Health Support for BC Employers and Teams',
    metaDescription:
      'For BC employers and HR: how counselling is paid for, what you may ask, a note for managers and one for your broker, and what this practice offers a team.',
    cta: {
      primary: { label: 'Email the practice about your team', href: '/contact?about=employer#form' },
      ghost: { label: 'Send an employee to book', href: '/book?utm_source=hr' },
    },
    glance: {
      h2: 'At a glance for HR',
      intro: 'The facts a benefits page or a manager’s toolkit needs, in one place. The fees and the consultation are read from the booking system, and where sessions are possible from the counsellors’ registration and insurance, so this list changes when they do. There is a [printable one-page version](/for/employers-and-hr/one-pager).',
    },
    eyebrow: 'For employers and HR',
    lede:
      'Somebody on your team is not alright, and you are trying to help without overstepping. This is what that looks like in practice.',
    shortAnswer:
      'An employer in BC cannot book counselling for an employee, but it can make it reachable: a working EFAP, a plan that lists Registered Clinical Counsellors, a wellness or lifestyle spending account, paid sick leave that is actually usable, and a manager who knows what not to ask. Westpeak Wellness is a small virtual practice, not an EAP provider; employees book directly, pay at booking, and receive receipts their plan can process. What the practice can offer an employer is clarity about how that works and, within scope, attendance confirmation when an employee asks for it.',
    updated: '2026-10-03',
    readMinutes: 7,
    figure: 'reimbursement-flow',
    opening: [
      'Most managers meet this at the worst moment: a good employee has gone quiet, or asked for time off without saying why, or said something in a one-to-one that you were not trained to hear. The instinct is to fix it. The job is narrower than that, and knowing where the edge is protects both of you.',
      'What follows is the practical version: how counselling gets paid for in a BC workplace, what you are entitled to ask, what a small private practice like this one can and cannot do for an employer, and the two or three things that make the difference between a benefit that exists on paper and one that gets used.',
    ],
    whatComesUp: [
      { label: '"We have an EFAP and nobody uses it"', detail: 'Usually because nobody knows what it covers, it is described as a crisis line, or people assume HR sees the usage. Saying plainly that it is confidential, free, and for ordinary problems changes uptake more than any poster.' },
      { label: '"They asked for stress leave and I do not know what I can ask"', detail: 'You can ask for confirmation of inability to work and an expected duration. You cannot ask for the diagnosis, the treatment, or what is discussed in sessions.' },
      { label: '"I want to pay for their counselling"', detail: 'Generous, and it needs a structure: a wellness or lifestyle account, or a plan change that lists RCCs. A health spending account may not do it, because it pays only CRA-eligible expenses and the CRA does not yet list counsellors in BC. Paying a counsellor directly for a named employee creates a relationship the counsellor cannot be part of.' },
      { label: '"Can you tell us if they are fit to return?"', detail: 'A counsellor cannot. Fitness-to-work is a physician\'s or an occupational-health assessment. A counsellor can confirm attendance, with the employee\'s written consent, and nothing else.' },
      { label: '"The team is burnt out, not one person"', detail: 'Then the question is workload and design, which counselling for individuals does not fix. It can still help the individuals while the structural part is being addressed.' },
    ],
    sections: [
      {
        h2: 'How counselling gets paid for in a BC workplace',
        list: [
          { label: 'Employee and family assistance program (EFAP)', detail: 'A contracted provider, a set number of short-term sessions, free to the employee, confidential from the employer. The most under-used benefit in most workplaces. This practice is not an EFAP provider; the comparison of EFAP and private counselling is on its own page.' },
          { label: 'Extended health plan', detail: 'Reimburses eligible practitioners up to an annual maximum. Whether a Registered Clinical Counsellor is eligible is a plan-design choice you or your broker made. If it is not, the single most useful change an employer can make is to add RCC and CCC to the practitioner list at renewal.' },
          { label: 'Health spending account', detail: 'Pays only expenses the CRA accepts as medical expenses, and the CRA’s list of authorized practitioners does not yet include counsellors in BC, so many administrators decline an RCC receipt. Ask the administrator before relying on it. A wellness or lifestyle spending account is broader and can fund RCC sessions, as a taxable benefit to the employee.' },
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
        /* STAY-AT-WORK SERVICES, ON THE PAGE WRITTEN FOR WHO SEARCHES IT — 3 Oct
           2026. "stay at work services" is the largest query in the workplace
           cluster (Search Console 3 Oct: 63 impressions at position 38.8, no
           clicks) and the pages above it are the people who sell or contract
           the service: an insurer's stay-at-work product page, WorkSafeBC's
           list of Return to Work Support Services providers, a university's
           occupational-health office. That is an employer's search. It reached
           /resources/workplace-mental-health-bc, written for the employee, so
           the definition now lives here and that page keeps the employee's
           side ("if you are offered a stay-at-work plan") with a link here.
           Nothing below says this practice is a stay-at-work provider. */
        h2: 'Stay-at-work services in BC: who provides them',
        body: [
          'A stay-at-work service keeps an employee with a health condition working, with adjustments, instead of off on a full leave: reduced hours for a period, changed duties or schedule, and treatment arranged alongside the work. A return-to-work service is the same thing from the other end, after a leave. In BC they come from four places, and which one applies depends on why the employee is struggling and what the employer has bought.',
        ],
        list: [
          { label: 'WorkSafeBC, for an accepted claim', detail: 'Where the injury is work-caused and the claim is accepted, WorkSafeBC coordinates return-to-work support and contracts Return to Work Support Services providers around the province. That is inside the claim; an employer does not buy it. [WCB psychological injury claims](/resources/worksafebc-psychological-injury-claims) sets out when a mental-health injury is one.' },
          { label: 'Your group benefits insurer', detail: 'Many group disability carriers sell stay-at-work or early-intervention services to plan sponsors, usually tied to the short-term disability plan. Your broker can say whether your contract includes it and what it costs to add.' },
          { label: 'An occupational health or disability-management provider', detail: 'Larger employers contract one directly, or run it in-house, to design graduated returns and modified duties with the employee’s physician.' },
          { label: 'Your EFAP', detail: 'Some EFAP contracts include manager consultation and short-term counselling aimed at keeping someone at work. Check the contract before assuming it does.' },
        ],
      },
      {
        h2: 'Where counselling sits beside a stay-at-work plan',
        body: [
          'A stay-at-work plan is a workplace arrangement, not care. One that changes the hours and leaves the cause untouched tends to become a leave a few months later, which is why a good plan names who is providing the treatment. This practice is not a stay-at-work or disability-management provider and does not design plans or report to employers. What it is: a place an employee on such a plan can see a Registered Clinical Counsellor privately, by video, booked and paid by them and claimed on their own plan where it covers counselling. The employee’s side of the arrangement, including what to ask before agreeing to one, is in [mental health and work in BC](/resources/workplace-mental-health-bc#if-you-are-offered-a-stay-at-work-plan).',
        ],
      },
      {
        h2: 'What this practice can offer an employer',
        list: [
          { label: 'Clarity, in advance', detail: 'A short exchange by email about how employees would reach the practice, what a receipt contains, and what the plan needs to list. No contract and no cost. Choose “An employer or HR enquiry” on the [contact form](/contact?about=employer#form).' },
          { label: 'Attendance confirmation', detail: 'With the employee\'s written consent, confirmation that they attended on given dates. Nothing about content, and never without consent.' },
          { label: 'Sessions that fit shifts', detail: 'Video sessions, times that depend on the counsellor and show on the booking page, and no travel time, which is the practical difference for shift, rotational and remote workers.' },
          { label: 'Three languages', detail: 'English, Punjabi and Tagalog, which matters in workforces where the person who most needs to talk is least likely to do it in a second language. For Fraser Valley and Surrey employers it may be the most useful line on this page: a meaningful share of the region’s workforce carries its hardest conversations in Punjabi, and English-only support quietly leaves them out.' },
          { label: 'A straight answer about fit', detail: 'If an employee needs something this practice does not provide, a psychiatric assessment, an occupational-health opinion, a crisis service, they will be told so and pointed there.' },
        ],
      },
      {
        h2: 'What a manager says, and what comes after',
        list: [
          { label: 'Train the sentence, not the diagnosis', detail: '“You seem like you are carrying a lot. What would help?” Noticing, asking and not prescribing is the whole skill. Everything after that sentence belongs to the employee and to professionals.' },
          { label: 'Point, do not fix', detail: 'Know the concrete options before the day you need them: the EFAP if there is one, the plan for ongoing counselling, sick days without interrogation, and a booking page the person can use without telling anyone.' },
          { label: 'Leave it with them', detail: 'Once you have pointed, the decision is theirs. A manager who checks back on whether someone booked has turned an offer into a task.' },
        ],
      },
      {
        h2: 'If you have no EAP and no benefits plan',
        list: [
          { label: 'Paid sick days already exist', detail: 'Under the Employment Standards Act, after 90 days of employment, five paid and three unpaid illness or injury days each calendar year, and mental health counts. The [leave templates](/resources/mental-health-leave-templates-bc) set out the rest, with sources.' },
          { label: 'Time off for appointments', detail: 'Letting someone move a shift or take an hour for a health appointment, without asking what it is, is the cheapest support there is. Video sessions add no travel time to it.' },
          { label: 'A health or wellness spending account', detail: 'The smallest structure that lets an employer pay toward counselling without seeing who used it: a fixed amount a year per employee, claimed privately against receipts. Ask the provider whether a Registered Clinical Counsellor’s receipt qualifies under the account you choose.' },
          { label: 'What to ask for in a first plan', detail: 'Registered Clinical Counsellors and Canadian Certified Counsellors on the practitioner list, a mental-health maximum that is not shared with massage and physiotherapy, and the price of adding an EFAP alongside.' },
          { label: 'The free routes, in the meantime', detail: '9-8-8 by call or text, 310-6789 for BC Mental Health Support, and the community and sliding-scale options on [low-cost counselling in BC](/resources/low-cost-counselling-bc).' },
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
    /* SOMETHING HR CAN ACTUALLY USE — 1 Oct 2026. The workplace cluster is
       the site's largest source of impressions (1,884, 17 clicks, no
       book_click) and this page told an employer it "can make it reachable"
       without giving them anything to make it reachable with. Neutral by
       design: no hours, no outcomes, not described as an EAP, and nothing an
       employee would read as the employer watching.

       Three blocks since the same day: the intranet paragraph, a note a
       manager sends one person, and an email to the broker at renewal. The
       intranet paragraph no longer names a counsellor's Canada-wide reach:
       it ends up on HR pages this site cannot update, and the insurance gate
       in lib/practitioners.ts can withdraw that reach. It says what stays
       true and sends the reader to /book, which is generated. */
    pasteBlocks: [
      {
        h2: 'If you are a manager: a note you can send one person',
        after: 'What a manager says, and what comes after',
        intro: 'If someone has told you they are struggling, or you have noticed, this is about fifty words they can read in private. It names no condition and asks for nothing back. Send it from your own email, to one person, and then leave it with them.',
        donts: [
          'Do not ask what it is about.',
          'Do not follow up on whether they booked.',
          'Do not book for them.',
        ],
        text: 'I wanted to pass this on in case it is ever useful. Westpeak Wellness offers counselling by secure video with Registered Clinical Counsellors, and the first 15-minute consultation is free. You book it yourself, privately. Nobody at work is told, and I will not ask. The booking page:',
        path: '/book?utm_source=hr',
      },
      {
        h2: 'An email to your broker before renewal',
        after: 'Three things that change whether the benefit gets used',
        intro: 'The practitioner list is set at renewal, so this goes before it. Three questions, and nothing about any employee.',
        text: 'Hello [name], ahead of our renewal, could you confirm three things about our extended health plan? First, whether Registered Clinical Counsellors (RCC) and Canadian Certified Counsellors (CCC) are listed as eligible practitioners. Second, what the yearly maximum for mental-health practitioners is, and whether it is shared with psychologists, social workers or other paramedical services. Third, what it would cost to add RCC and CCC, or to raise that maximum. Thank you, [your name]',
      },
      {
        h2: 'Paste this into your benefits page',
        intro: 'If you keep a benefits page, an intranet or a manager’s toolkit, this paragraph can go in as it stands. The link is tagged so the practice can see that a visit came from an HR page, and nothing about who.',
        text: 'Westpeak Wellness offers counselling by secure video with Registered Clinical Counsellors, in English, Punjabi or Tagalog, in BC, and in other provinces where a counsellor’s registration and insurance allow; the booking page shows who. The first 15-minute consultation is free. You book directly, pay at booking and claim on your own plan where it covers counselling, and your employer is not told. It is not a crisis service: in an emergency call 911 or 9-8-8. Book here:',
        path: '/book?utm_source=hr',
      },
    ],
    servicesThatFit: [
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling', why: 'The comparison to send an employee who has used up the EFAP sessions or wants continuity.' },
      { href: '/resources/workplace-mental-health-bc', label: 'Mental health and work in BC', why: 'Leave, accommodation, disability insurance and WorkSafeBC, from the employee side.' },
      { href: '/for/healthcare-and-shift-workers', label: 'Counselling for healthcare and shift workers', why: 'For workforces on rosters, where the appointment has to fit the shift.' },
    ],
    midCta: {
      text: 'If you would rather settle the practical questions first, a short exchange by email about how this would work for your team costs nothing.',
      label: 'Email the practice',
    },
    faqs: [
      /* 3 Oct 2026: "stay at work services", 63 impressions at 38.8. */
      { q: 'What are stay-at-work services?', a: 'Services that keep an employee with a health condition working, with adjustments, instead of off on a full leave: reduced hours for a period, changed duties or schedule, and treatment arranged alongside. In BC they come from WorkSafeBC on an accepted work-injury claim, from group benefits insurers as part of a disability plan, from occupational-health or disability-management providers an employer contracts, and sometimes from an EFAP. Westpeak Wellness is not a stay-at-work provider; an employee on such a plan can see a counsellor here privately alongside it.' },
      { q: 'Can an employer book counselling for an employee in BC?', a: 'No. The employee books, consents and holds the relationship. An employer can make counselling reachable through the EFAP, the plan’s practitioner list, a wellness or lifestyle spending account and usable sick leave.' },
      { q: 'Can we pay for an employee\'s counselling directly?', a: 'Only through a structure that keeps the employer out of the clinical relationship, such as a wellness or lifestyle spending account, which is a taxable benefit. A health spending account works only if its administrator accepts an RCC receipt, which in BC is not assured, so ask first. This practice does not invoice employers for an individual\'s sessions.' },
      { q: 'Will the counsellor tell us how the employee is doing?', a: 'No. With the employee\'s written consent, the counsellor can confirm attendance on given dates. Nothing about content, and nothing without consent.' },
      { q: 'Can a counsellor confirm someone is fit to return to work?', a: 'No. Fitness-to-work comes from a physician, nurse practitioner or occupational-health assessment. A counsellor works within their scope and says so.' },
      { q: 'Is Westpeak Wellness an EAP provider?', a: 'No. It is a small virtual practice. Employees book directly and pay at booking, and their plan reimburses them where it lists the designation. A health spending account pays only CRA-eligible expenses and the CRA does not yet list counsellors in BC, so its administrator decides.' },
      { q: 'What should we ask our benefits broker?', a: 'Whether the plan lists Registered Clinical Counsellors and Canadian Certified Counsellors as eligible practitioners, what the annual maximum is, and whether a wellness or lifestyle spending account can be added. Ask too whether the health spending account accepts RCC receipts; many do not, because the CRA does not yet list counsellors in BC. There is an email to copy for it on this page.' },
      { q: 'What should a manager do in the moment with a struggling employee?', a: 'Ask, listen and point: “what would help?”, real attention, and the concrete options, which are the EFAP if there is one, the plan for ongoing counselling, sick days without interrogation, and a booking page they can use privately. Managers go wrong by diagnosing or by fixing; the job is noticing and routing.' },
      { q: 'Do you run workplace workshops or lunch-and-learns?', a: 'No. The practice does one thing, which is counselling. For workplace education, CMHA BC runs established programs. What the practice offers a team is a concrete place to send someone, which is the piece most toolkits are missing.' },
      { q: 'How does an employer contact the practice?', a: 'By email, through the contact form with “An employer or HR enquiry” chosen. It goes to the practice inbox rather than to a counsellor’s consultation calendar, and the reply comes by email.' },
    ],
    sources: [
      { label: 'BC Employment Standards, leaves and job protection', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off' },
      { label: 'BC Human Rights Tribunal', url: 'https://www.bchrt.bc.ca/' },
      { label: 'WorkSafeBC, mental health claims', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bc-counsellors.org/' },
      { label: 'Canadian Mental Health Association, BC Division, workplace programs', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'How to get stress leave in BC' },
      { href: '/resources/does-my-plan-cover-counselling-bc', label: 'Does my plan cover counselling?' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/resources/mental-health-leave-templates-bc', label: 'Mental-health leave templates for BC' },
      { href: '/guides/workplace-bullying-in-bc', label: 'Workplace bullying in BC' },
      { href: '/contact?about=employer#form', label: 'Email the practice' },
    ],
  },
];

/* AT A GLANCE FOR HR — 1 Oct 2026.
 *
 * Fees, the consultation, card at booking, the receipt and confidentiality
 * were spread over /pricing, /faq and the standards page, and this page
 * showed only the fee line. Built at render from the catalogue the page has
 * already read and from the gated roster, so a fee or a reach cannot be typed
 * here and then outlive the thing it describes. Shared by the employer page
 * and its printable one-pager. No hours, no registration numbers, no
 * outcomes. Coverage stays the plan's. */
export type GlanceItem = { term: string; detail: string };

const listOr = (xs: string[]) =>
  xs.length > 1 ? `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}` : (xs[0] ?? '');

export function hrGlance(catalog: Catalog, roster: Practitioner[] = practitioners): GlanceItem[] {
  const accepting = roster.filter((p) => p.acceptingNewClients);
  const item = (name: string) => catalog.items.find((i) => i.name.toLowerCase() === name);
  const consult = item('initial consultation');
  const individual = item('individual counselling');
  const couples = item('couples counselling');
  const languages = [...new Set(accepting.flatMap((p) => p.languages.map((l) => l.name)))];
  const reach = reachSentence(accepting);

  const out: GlanceItem[] = [
    { term: 'Who', detail: `Registered Clinical Counsellors, by secure video.${reach ? ` ${reach}` : ''}` },
  ];
  if (languages.length) out.push({ term: 'Languages', detail: `${listOr(languages)}.` });
  if (consult) {
    out.push({
      term: 'First step',
      detail: `${consult.cents === 0 ? 'A free' : `A ${money(consult.cents)}`} ${consult.minutes}-minute consultation, booked by the employee.`,
    });
  }
  const fees = [
    individual ? `individual sessions ${money(individual.cents)} for ${individual.minutes} minutes` : '',
    couples ? `couples sessions ${money(couples.cents)}` : '',
  ].filter(Boolean);
  if (fees.length) {
    const line = fees.join('; ');
    out.push({ term: 'Fees', detail: `${line.charAt(0).toUpperCase()}${line.slice(1)}. Every fee is on the pricing page.` });
  }
  out.push(
    { term: 'Payment', detail: CANCELLATION_TERMS },
    { term: 'The receipt', detail: 'The counsellor’s name, designation and registration number, the date and the fee: what a plan needs to reimburse. The employee claims it; the practice does not bill an employer or a plan.' },
    { term: 'Plan wording to look for', detail: '“Registered Clinical Counsellor” (RCC) or “Canadian Certified Counsellor” (CCC) on the practitioner list. Coverage depends on the plan; one that names only psychologists will not reimburse these sessions.' },
    { term: 'What the employer receives', detail: 'Nothing, unless the employee gives written consent. With it, confirmation of attendance on given dates, and nothing about content.' },
    { term: 'What it is not', detail: 'Not an EAP, not a fitness-to-work assessor, and not a party to the employment relationship. No employer contract and no invoice for an individual’s sessions.' },
    { term: 'In a crisis', detail: 'Not a crisis service. Call or text 9-8-8, any hour, or 310-6789 for BC Mental Health Support. In immediate danger, 9-1-1.' },
  );
  return out;
}

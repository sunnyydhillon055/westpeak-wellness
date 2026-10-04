/* THE QUESTIONS ON /online-counselling — 3 Oct 2026.
 *
 * The province-wide landing page (125 impressions in the 3 Oct Search Console
 * export, no clicks, "online counsellor bc" and "online counselling bc" at
 * 35) is also shown for questions it never answered: "no waitlist counsellor
 * bc" and "no waitlist therapist bc", "immediate therapy session", "counselling
 * bc login" (9 impressions: people who are already clients), and "is
 * counsellor a protected title in canada". The directories that hold the top
 * of those results answer none of them either.
 *
 * Plain data, so a test can hold the rules every answer here must keep: no
 * typed hours, no "most plans", no outcome claim, the consultation is fifteen
 * minutes. Markdown links render through rich() on the page and are stripped
 * by plainText() in the FAQPage schema.
 *
 * The regulation answer restates /compare/rcc-vs-psychologist-vs-social-
 * worker-bc, which cites it: the Health Professions and Occupations Act in
 * force from 1 April 2026 and regulation of the profession beginning
 * 29 November 2027 (BCACC, "Navigating the regulatory landscape", read
 * 3 Oct 2026). */

export type HubFaq = { q: string; a: string };

export const BC_HUB_FAQS: readonly HubFaq[] = [
  {
    q: 'Is there a waitlist for online counselling in BC?',
    a: 'Not here. There is no list to join: the [booking calendar](/book) shows each counsellor’s real open consultation times, and the line under the button at the top of this page names the next one when there is one. If none of the times suits you, the booking page has a way to ask for one. Public services are free and triaged, so they usually do have a wait, and [free and low-cost counselling in BC](/resources/low-cost-counselling-bc) sets out which.',
  },
  {
    q: 'Do I need a referral from a doctor?',
    a: 'No. You book the free 15-minute consultation yourself, with no referral and no intake form. Whether an extended health plan reimburses the sessions afterwards, and on what conditions, depends on the plan, so check its wording for Registered Clinical Counsellors; [what BC extended health plans reimburse](/resources/bc-extended-health-coverage-for-counselling) explains what to look for.',
  },
  {
    q: 'Is “counsellor” a protected title in BC?',
    a: 'Not yet. Today anyone in BC may call themselves a counsellor or a therapist, which is why the designation matters: a Registered Clinical Counsellor (RCC) has met the BC Association of Clinical Counsellors’ education and supervised-practice requirements, carries insurance and answers to a complaints process. Statutory regulation of the profession under the College of Health and Care Professionals of BC is scheduled to begin on 29 November 2027. [RCC, psychologist or social worker](/compare/rcc-vs-psychologist-vs-social-worker-bc) covers the difference, and [how to check a counsellor in BC](/resources/verify-a-counsellor-in-bc) shows how to look one up.',
  },
  {
    q: 'I am already a client. Where do I sign in?',
    a: 'The [client portal](/signin) is where current clients sign in to book a session and manage their appointments. New clients do not need an account to start: the free consultation is booked straight from the calendar.',
  },
];

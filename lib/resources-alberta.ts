import type { Resource } from './resources';
import { yearEndSeasonal } from './resources-more2';
import { practitioners, insuredProvinces, vancouverToday } from '@/lib/practitioners';

/* THE ALBERTA COVERAGE DESCRIPTION.
   3 Oct 2026 (item 423): it opened "No." and offered nothing to act on, so
   it was rewritten in the house coverage words and, while her policy reached
   Alberta, named Camille with her CCC, her fee and the free consult.

   13 Oct 2026: answer first, in the query's own words, and one description
   whatever the gate. Search Console 13 Oct: 412 impressions at 6.48 and
   0.49% CTR, flat on the named version (0.51% on 3 Oct); "is therapy
   covered by alberta health care" 25 at 9.72. An answer that says what is
   covered as well as what is not, plus her name and fee, does not fit 155
   characters, and the name had not moved the click rate. Her name, fee and
   calendar stay on the page while the gate is open: the cards, the hero
   button and the mid-page line below. */
export const albertaCoverageDescription =
  'Therapy is not covered by Alberta Health Care unless a physician provides it, such as your doctor or a psychiatrist. Many plans pay, depending on the plan.';
const TODAY = vancouverToday();

/* THE GATE ON THE TYPED SENTENCES — 13 Oct 2026. Camille's Alberta cover
   closes on 15 Oct 2026 unless the renewal is recorded (insuranceGateDate in
   lib/practitioners.ts). The cards and the hero button already followed
   insuredProvinces; the mid-page line, one answer, the related links and a
   paragraph on the check page were typed, and would have gone on naming
   her, and linking Alberta place pages that redirect, after the gate
   closed. They follow the same roster now, read at build time like every
   static page. When nobody is insured for Alberta the booking buttons still
   go to /book, which says sessions are for people in British Columbia, and
   their label says so before the click. */
export const ALBERTA_OPEN = practitioners.some(
  (p) => p.acceptingNewClients && insuredProvinces(p, TODAY).includes('AB'),
);
export const BC_ONLY_LABEL = 'Book a free consultation in BC';

/* WITH THE GATE SHUT, THE COVERAGE PAGE STOPS SELLING — 15 Oct 2026 (item
   549). Live on 15 Oct the page told an Alberta reader nobody here is
   insured to see them, then priced this practice's sessions against a
   $300 plan balance, drew the reimbursement diagram and closed on the BC
   fee and "Book Free Consultation". While ALBERTA_OPEN is false the
   balance arithmetic and the diagram are dropped, the free and lower-cost
   routes move up to follow the AHCIP answer, and the closing band becomes
   the routes the page already sources, with one small link for a reader
   who is in BC. All of it returns on its own when the gate reopens. */
const ROUTES_H2 = 'The free and lower-cost routes first';
function routesFirstWhenClosed<T extends { h2: string }>(sections: T[]): T[] {
  if (ALBERTA_OPEN) return sections;
  const i = sections.findIndex((s) => s.h2 === ROUTES_H2);
  if (i < 1) return sections;
  const rest = sections.filter((_, j) => j !== i);
  return [rest[0]!, sections[i]!, ...rest.slice(1)];
}
const ALBERTA_ROUTES_CLOSER: NonNullable<Resource['routesCloser']> = {
  heading: 'Where to start in Alberta',
  text: 'No counsellor at this practice is insured to see clients in Alberta at the moment. These are the routes this page sources, for an Alberta reader whatever their plan.',
  routes: [
    { label: 'Counselling Alberta', detail: 'Government-funded counselling online anywhere in Alberta, on a sliding fee scale. Registration is online or by phone on 833-827-4230.', url: 'https://counsellingalberta.com/' },
    { label: 'Health Link, 811', detail: 'Free, non-urgent advice and referral into publicly funded mental health services.' },
    { label: '211 Alberta', detail: 'A directory of community counselling offered on a sliding scale or at no cost, by phone, text and web.', url: 'https://ab.211.ca/' },
  ],
  bcLabel: 'In BC? Book a free consultation',
};

/* ============================================================================
   ALBERTA RESOURCES
   ----------------------------------------------------------------------------
   Every one of the fourteen resource pages written before this was BC-specific
   — MSP, WorkSafeBC, the BC crisis directory, the BCACC register. That was
   correct while the practice served only BC. It stopped being correct on
   1 Sep 2026, when a counsellor whose CCPA policy and certification cover
   Alberta joined and her Calgary and Edmonton pages went live. An Albertan
   reading those pages and following a link into the resources learned about
   the wrong province.

   WHY THESE ARE RESOURCES AND NOT PART OF /alberta. The /alberta section is
   gated on insurance and stays gated: it advertises THE PRACTICE in Alberta,
   and the practice's own policy still stops at the BC border. Three of the five
   pages written for it also advertise Punjabi counselling in Alberta, which
   neither counsellor can deliver — the founder has no Alberta cover and Camille
   does not speak Punjabi. None of that changes by writing these.

   What is true is narrower and is what these pages say: one counsellor at this
   practice can see Alberta clients, and here is how the money, the public
   system and the credentials actually work there. Each names her rather than
   routing to a generic booking page, because the generic page books somebody
   who cannot lawfully see them.

   NO INVENTED FIGURES, same rule as every other page here. Where a number would
   help and could not be sourced, the page describes the shape instead.
   ========================================================================= */

export const albertaResources: Resource[] = [
  {
    slug: 'counselling-coverage-in-alberta',
    province: 'AB',
    /* H1 matches the query and the title, 3 Oct 2026 (item 423). */
    title: 'Is therapy covered by Alberta Health Care? What counselling costs in Alberta',
    /* 1 Oct 2026, was "Is Therapy Covered in Alberta? AHCIP and Your Plan".
       Searchers say "Alberta Health Care", which appeared nowhere on the
       site: 'is therapy covered by alberta health care' 17 impressions at
       9.53, 0 clicks; the page 245 impressions at 5.89, 2 clicks (GSC,
       26 Sep 2026). */
    metaTitle: 'Is Therapy Covered by Alberta Health Care (AHCIP)?',
    metaDescription: albertaCoverageDescription,
    eyebrow: 'Alberta',
    /* 13 Oct 2026: answer first (see ALBERTA_ANSWER). Was "Alberta Health
       does not pay for private counselling, which surprises people...". */
    lede:
      'Therapy with a counsellor or psychologist in private practice is not covered by Alberta Health Care; a doctor or psychiatrist is. What does pay is a government add-on plan, Counselling Alberta’s sliding scale, and an extended health plan, depending on the plan. Here is each, and the one question to ask before booking.',
    /* 3 Oct 2026: "is therapy covered by alberta health care" 24 at 9.67
       and "counselling alberta" 13 at 6.46, no clicks (Search Console,
       3 Oct). The top results name two things this page did not: the
       government's Non-Group Coverage psychologist benefit, and Counselling
       Alberta, the government-funded service whose name is that query. Both
       read on their own sites 3 Oct 2026 (sources). */
    shortAnswer:
      'No. Alberta Health Care (AHCIP) does not cover private counselling; it pays for physicians, including a psychiatrist on referral. Two partial exceptions: the government’s optional Non-Group Coverage plan pays up to $60 a visit toward a registered psychologist, to $300 per family each benefit year, and Counselling Alberta, a government-funded service, charges on a sliding fee scale. Otherwise people pay through an extended health plan or out of pocket. Before booking privately, ask your insurer one question: does the plan reimburse a Canadian Certified Counsellor?',
    updated: '2026-10-13',
    readMinutes: 6,
    ...(ALBERTA_OPEN ? {} : { bookLabel: BC_ONLY_LABEL }),
    /* Year-end plan timing, 1 Oct to 31 Dec (item 210). The BC year-end page is not linked: its plan examples are BC ones. */
    seasonal: yearEndSeasonal({ yearEndLink: false, designation: 'Canadian Certified Counsellor', province: 'AB', ...(ALBERTA_OPEN ? {} : { balanceSentence: false }) }),
    ...(ALBERTA_OPEN ? {} : { routesCloser: ALBERTA_ROUTES_CLOSER }),
    sections: routesFirstWhenClosed([
      {
        /* Was "What AHCIP does and does not pay for" (1 Oct 2026). */
        h2: 'Is therapy covered by Alberta Health Care? What AHCIP pays for',
        body: [
          'Alberta Health Care Insurance Plan coverage for mental health follows the same logic as other provincial plans: it pays for physicians. The government’s own list of what AHCIP does not cover names health services from a provider other than a physician, a psychologist among them, and clinical psychologist services. A visit to your family doctor about low mood is covered. A psychiatrist, if you can get a referral and wait for one, is covered. A counsellor or psychotherapist in private practice is not.',
          'That is not a gap specific to Alberta ([is counselling covered by MSP in BC](/resources/msp-vs-extended-health) gets the same answer) and it is not a judgement about whether counselling works. It is a consequence of how provincial plans are structured. They insure medical services delivered by physicians, and counselling is not delivered by one. The practical effect is the same either way: the cost of private counselling falls to you or to an extended health plan.',
          'One government plan does pay something. **Non-Group Coverage** is optional supplementary health insurance from the Government of Alberta, open to residents under 65 registered with AHCIP, for a monthly premium (subsidies are available on a low income). It pays up to $60 a visit for treatment by a registered psychologist, to a maximum of $300 per family each benefit year. It does not name counsellors, and $300 is a few sessions rather than a course of therapy.',
        ],
      },
      {
        h2: 'The one question to ask your insurer',
        body: [
          'Extended health plans differ by employer rather than by insurer, which is why no website can tell you what yours covers. What can be said is which question decides it, and in Alberta it is not the question most people ask.',
          'Ask whether the plan reimburses a **Canadian Certified Counsellor**, abbreviated CCC. That is the national certification granted by the Canadian Counselling and Psychotherapy Association, and in a province with no counselling college it is the designation that plans generally name. Asking only about a Registered Clinical Counsellor is asking about a British Columbia designation, which an Alberta plan may not list at all.',
          'Two follow-up questions are worth the same phone call: the annual maximum, and whether the plan requires a physician referral before it will reimburse anything. A plan that covers counselling but demands a referral first is common, and finding that out afterwards costs a session.',
        ],
      },
      {
        h2: 'Why Alberta plans name a different designation',
        body: [
          'Counselling therapy is not a regulated profession in Alberta. There is no provincial college a counsellor can register with, which means there is no Alberta equivalent of the RCC or the Ontario CRPO designation for an insurer to name.',
          /* CCPA and ACTA, read 1 Oct 2026: announced 1 March 2024; no
             regulation in force yet. */
          'That is due to change, though not yet. In March 2024 the province announced that counselling therapists will be regulated under the College of Alberta Psychologists; as of 1 October 2026 that regulation is not in effect.',
          'What fills that space is national certification. The CCC is granted against education, supervised practice hours and a code of ethics, it is held on a public register ([how to check a counsellor in Alberta](/resources/how-to-check-a-counsellor-in-alberta) walks through it), and it is the designation to ask an Alberta plan about as a result. Some plans also name a registered psychologist, which is a separate and regulated profession in Alberta with its own college and generally a higher fee.',
        ],
      },
      {
        h2: ROUTES_H2,
        list: [
          {
            /* counsellingalberta.com, read 3 Oct 2026. */
            label: 'Counselling Alberta',
            detail:
              'A division of Calgary Counselling Centre, run in partnership with the Government of Alberta. It offers counselling online anywhere in Alberta and in person in nine cities, for individuals, couples, families and children, on a sliding fee scale, and its site says there is no waitlist. Registration is online or by phone on 833-827-4230.',
          },
          {
            /* 1 Oct 2026. This named "Alberta Health Services" and a
               province-wide line on 1-844-944-4744, which is the Indigenous
               Support Line. Public mental health and addiction services moved
               from AHS to Recovery Alberta on 1 Sep 2024. Numbers re-read on
               recoveryalberta.ca, 1 Oct 2026. */
            label: 'Recovery Alberta mental health and addiction helplines',
            detail:
              'Recovery Alberta has run the province’s public mental health and addiction services since 1 September 2024. Its Mental Health Helpline is 1-877-303-2642 and its Addiction Helpline is 1-866-332-2322, both 24/7 and confidential. Health Link on 811 gives non-urgent advice and referral into publicly funded services, and in the Calgary area the intake service is Access Mental Health on 403-943-1500. All of them are free, and all of them route rather than treat.',
          },
          {
            label: '211 Alberta',
            detail:
              'A directory of community and social services, including counselling offered on a sliding scale or at no cost through agencies. Available by phone, text and web.',
          },
          {
            label: 'Your employer',
            detail:
              'An employee assistance programme frequently includes a set number of counselling sessions at no cost, and a great many people never use an entitlement they already have. It is worth checking before paying for anything.',
          },
          {
            label: 'Post-secondary services',
            detail:
              'If you are enrolled, campus counselling is usually included in fees you have already paid. The session limits are real, but so is the price.',
          },
        ],
      },
      {
        h2: 'If you do pay privately',
        body: [
          'Ask for the receipt to carry the counsellor’s certification number. Insurers ask for it, and a receipt without one is the most common reason a legitimate claim gets returned.',
          'Ask also whether the practice direct-bills or whether you pay and submit. Both are ordinary; the difference decides whether you are out of pocket for a month, which matters more to some people than the fee itself.',
        ],
      },
    ]),
    midCta: ALBERTA_OPEN
      ? {
          text: 'Camille Granda, RCC, CCC, can see clients in Alberta, and the first fifteen minutes are free.',
          /* Was 'More about Camille', on a link that opens her calendar (item 384). */
          label: 'Book a free consultation with Camille',
        }
      : {
          text: 'No counsellor at this practice is insured to see clients in Alberta at the moment, so the routes on this page are the place to start.',
          label: 'If you are in British Columbia, book a free consultation',
        },
    faqs: [
      {
        /* Was "Does AHCIP cover any counselling at all?" (1 Oct 2026). */
        q: 'Is therapy covered by Alberta Health Care?',
        a: 'Only through physicians. Alberta Health Care (AHCIP) covers physicians, so a conversation with your family doctor or a psychiatrist you have been referred to is covered. Counselling from a counsellor or psychotherapist in private practice is not, regardless of their credentials.',
      },
      {
        q: 'Does Alberta Health Care cover a psychologist?',
        a: 'AHCIP itself does not. The government’s separate Non-Group Coverage plan, which you buy for a monthly premium if you are under 65, pays up to $60 a visit toward a registered psychologist, to a maximum of $300 per family each benefit year. An employer’s extended health plan sets its own amount, depending on the plan.',
      },
      {
        q: 'What is Counselling Alberta?',
        a: 'A government-funded division of Calgary Counselling Centre that offers counselling online anywhere in Alberta and in person in nine cities, on a sliding fee scale. It is a separate organisation from this practice.',
      },
      {
        q: 'Is a Canadian Certified Counsellor recognised in Alberta?',
        a: 'It is the national certification and it is what plans in Alberta generally name, precisely because there is no provincial counselling college to register with. Whether your specific plan reimburses it is a question only your insurer can answer, and it takes one call.',
      },
      {
        q: 'Can a counsellor based in BC see me in Alberta?',
        a: 'It depends on their certification and their insurance rather than on where they sit. Counselling therapy is not regulated in Alberta, so the questions that matter are whether they hold a recognised certification and whether their liability cover extends to Alberta clients. ' + (ALBERTA_OPEN
          ? 'At this practice one counsellor meets both conditions and the pages say which.'
          : 'At this practice nobody is insured to see clients in Alberta at the moment, so sessions here are for people in British Columbia.'),
      },
      {
        q: 'Do I need a referral?',
        a: 'Not to see a counsellor. You can approach one directly. You may need one for your insurer to reimburse, which is a separate question and worth asking on the same call.',
      },
    ],
    sources: [
      { label: 'Alberta Health Care Insurance Plan, Government of Alberta', url: 'https://www.alberta.ca/ahcip.aspx' },
      { label: 'AHCIP, what is covered and what is not: psychologists and other non-physician providers are not (Government of Alberta, read 13 Oct 2026)', url: 'https://www.alberta.ca/ahcip-what-is-covered' },
      { label: 'Non-Group Coverage, Government of Alberta: clinical psychological services, premiums and eligibility (read 3 Oct and 13 Oct 2026)', url: 'https://www.alberta.ca/non-group-coverage' },
      { label: 'Counselling Alberta, a division of Calgary Counselling Centre (read 3 Oct 2026)', url: 'https://counsellingalberta.com/' },
      /* The Page9985 URL cited here until 3 Sep answered 200 and redirected to
         NotFound.aspx — a soft 404, which link-rot.mjs catches and a status
         check alone would not. */
      { label: 'Recovery Alberta, mental health and addiction helplines (read 1 Oct 2026)', url: 'https://recoveryalberta.ca/page14060.aspx' },
      { label: 'Canadian Counselling and Psychotherapy Association, regulation in Alberta', url: 'https://www.ccpa-accp.ca/regulation-in-alberta/' },
      { label: '211 Alberta', url: 'https://ab.211.ca/' },
      { label: 'Canadian Counselling and Psychotherapy Association', url: 'https://www.ccpa-accp.ca/' },
    ],
    related: [
      /* Camille holds a national policy and sees Alberta clients while her
         insurance gate is open (her Canada-wide reach was withdrawn 3 Oct
         2026); her Alberta pages are the ones an Alberta reader can actually book
         from. Search Console, 17 Sep 2026: 'counselling alberta' at position
         6.5 and her Calgary page converting a fifth of its impressions. With
         the gate closed those place pages redirect, so they are not linked
         (13 Oct 2026). */
      ...(ALBERTA_OPEN
        ? [
            { href: '/practitioners/camille-granda/calgary', label: 'Camille Granda in Calgary' },
            { href: '/practitioners/camille-granda/edmonton', label: 'Camille Granda in Edmonton' },
            { href: '/practitioners/camille-granda', label: 'Camille Granda, RCC, CCC, Alberta and BC' },
          ]
        : [{ href: '/resources/does-my-plan-cover-counselling-bc', label: 'The question to ask Sun Life, Canada Life or GreenShield' }]),
      { href: '/resources/how-to-check-a-counsellor-in-alberta', label: 'How to check a counsellor in Alberta' },
      { href: '/tools/therapy-cost-bc', label: 'Work out what a session would actually cost you' },
      { href: '/pricing', label: 'Fees at this practice' },
    ],
    ...(ALBERTA_OPEN ? { figure: 'reimbursement-flow' } : {}),
  },
  {
    slug: 'how-to-check-a-counsellor-in-alberta',
    province: 'AB',
    title: 'How to check a counsellor in Alberta',
    metaTitle: 'How to check a counsellor in Alberta | Westpeak Wellness',
    metaDescription:
      'Counselling therapy is not regulated in Alberta, so there is no college to search. What can be verified instead, and the registers that let you do it.',
    eyebrow: 'Alberta',
    lede:
      'In British Columbia you can look a counsellor up in a public register in about two minutes. In Alberta there is no equivalent college, which does not mean nothing can be checked. It means checking a different thing.',
    shortAnswer:
      'Counselling therapy is not a regulated profession in Alberta, so there is no provincial college and no licence to verify. The province announced in March 2024 that counsellors will be regulated under the College of Alberta Psychologists, but no start date has been set. What you can verify today is national certification: a Canadian Certified Counsellor is listed on the CCPA register, and anyone claiming the title can be confirmed there. Psychologists are separately regulated and appear on their own college register.',
    updated: '2026-10-03',
    readMinutes: 5,
    ...(ALBERTA_OPEN ? {} : { bookLabel: BC_ONLY_LABEL }),
    sections: [
      {
        h2: 'What "unregulated" actually means',
        body: [
          'It means the title is not protected. In Alberta, no law reserves the words counsellor or therapist for people with particular training, so somebody with a weekend certificate and somebody with a master’s degree and a decade of supervised practice can use the same word on the same website.',
          'It does not mean nobody is accountable. It means accountability is voluntary and comes from certification bodies rather than from a provincial college, so the useful question is not "are they licensed", which has no Alberta answer, but "what have they voluntarily submitted themselves to, and can I see it".',
        ],
      },
      {
        h2: 'What can be verified',
        list: [
          {
            label: 'Canadian Certified Counsellor (CCC)',
            detail:
              'The national certification, granted by the CCPA against education, supervised hours and a code of ethics. It is publicly checkable, it carries a complaints process, and it is the most relevant credential in a province with no college of its own.',
          },
          {
            label: 'Registered Psychologist',
            detail:
              'A separate and regulated profession in Alberta with its own college. If somebody calls themselves a psychologist in Alberta, that title is protected and can be verified.',
          },
          {
            label: 'An out-of-province registration',
            detail:
              'A counsellor may hold a designation from another province. An RCC from British Columbia, for instance. That is checkable on that province’s register and tells you the standard they meet, though it is not an Alberta licence and should not be described as one.',
          },
          {
            label: 'Professional liability insurance',
            detail:
              'Rarely advertised and entirely reasonable to ask about. Cover that extends to Alberta clients is not automatic for a counsellor based elsewhere, and a practitioner who cannot answer the question clearly has told you something.',
          },
        ],
      },
      {
        h2: 'Four questions worth asking directly',
        list: [
          { label: 'What are your credentials, and where can I check them?', detail: 'A straight answer names the body and the number. Hesitation here is the most useful signal you will get.' },
          { label: 'Are you insured to see clients in Alberta?', detail: 'A separate question from credentials, and one a counsellor practising across a provincial line should expect.' },
          { label: 'What do you not work with?', detail: 'Everybody has limits. A practitioner who claims none is describing marketing rather than practice.' },
          { label: 'What happens if I want to complain?', detail: 'With a certification body there is a process. Without one there is nowhere to go, and knowing which situation you are in is worth establishing at the start rather than at the worst moment.' },
        ],
      },
      {
        h2: 'What this practice publishes',
        body: [
          'Each counsellor here lists her credentials with numbers on her own page, and the bodies behind them hold public registers you can search yourself. ' + (ALBERTA_OPEN
            ? 'The counsellor who can see Alberta clients holds the CCC as well as a BC registration, and the Alberta-relevant one is named first on her Alberta pages for that reason.'
            : 'Nobody here is insured to see clients in Alberta at the moment, which is the kind of answer the insurance question above is meant to get.'),
          'The site also publishes no client testimonials, which is not modesty. The BC association prohibits them. Where reviews would normally sit, checkable credentials do instead.',
        ],
      },
    ],
    midCta: {
      text: 'Every credential named on this site is on a public register, with the number, so you can check it rather than take it on trust.',
      /* Was 'See the counsellors', on a link that opens the calendar (item 384). */
      label: ALBERTA_OPEN ? 'Book a free consultation' : 'If you are in British Columbia, book a free consultation',
    },
    faqs: [
      {
        q: 'Is there an Alberta college of counselling therapists?',
        a: 'Not at present. Counselling therapy is not a regulated profession in Alberta, so there is no college, no licence and no provincial register of counsellors. Psychologists are regulated separately and do have one.',
      },
      {
        /* 3 Oct 2026: "is psychotherapy regulated in alberta", position 1.
           CCPA's Alberta regulation page, read 3 Oct 2026. */
        q: 'Is psychotherapy regulated in Alberta?',
        a: 'Not yet for counsellors. On 1 March 2024 the Alberta government announced that counsellors will be regulated under the College of Alberta Psychologists, and no proclamation date has been set, so as of October 2026 the title counsellor is still unprotected. Psychologists, who also provide psychotherapy, are regulated by that college now.',
      },
      {
        q: 'So can anyone call themselves a counsellor there?',
        a: 'Effectively yes, which is the practical reason to check certification rather than to rely on the word. The title carries no legal requirement behind it in Alberta.',
      },
      {
        q: 'Is a BC-registered counsellor allowed to see Alberta clients?',
        a: 'There is no Alberta registration to breach, so the constraints are certification and insurance rather than licensing. A counsellor should be able to tell you clearly that their liability cover extends to clients located in Alberta.',
      },
      {
        q: 'Where do I complain if something goes wrong?',
        a: 'To the certification body the counsellor belongs to, the CCPA for a CCC, or the relevant provincial college for a psychologist or an out-of-province registrant. If they belong to nothing, there is no external route, which is the strongest argument for checking at the start.',
      },
    ],
    sources: [
      { label: 'Canadian Counselling and Psychotherapy Association, certification', url: 'https://www.ccpa-accp.ca/' },
      { label: 'Canadian Counselling and Psychotherapy Association, regulation in Alberta (read 3 Oct 2026)', url: 'https://www.ccpa-accp.ca/regulation-in-alberta/' },
      { label: 'College of Alberta Psychologists', url: 'https://cap.ab.ca/' },
      /* The .aspx URL cited here until 3 Sep returned 404. This page is also the
         better source for the claim: it lists the professions Alberta does
         regulate and the colleges that govern them, and counselling therapy is
         not among them — which is the point being made. */
      { label: 'Regulated health professions and regulatory colleges, Government of Alberta', url: 'https://www.alberta.ca/regulated-health-professions' },
      { label: 'Health Professions Act, Open Government, Alberta', url: 'https://open.alberta.ca/publications/h07' },
    ],
    related: [
      { href: '/practitioners', label: 'The counsellors here, with their registration numbers' },
      { href: '/resources/counselling-coverage-in-alberta', label: 'What counselling costs in Alberta' },
      { href: '/resources/verify-a-counsellor-in-bc', label: 'How to check a counsellor in BC' },
      { href: '/standards', label: 'Standards and accountability at this practice' },
      { href: '/reviews', label: 'Why there are no testimonials here' },
    ],
    figure: 'accountability-chain',
  },
];

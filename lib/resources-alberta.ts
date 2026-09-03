import type { Resource } from './resources';

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
    title: 'What counselling actually costs in Alberta',
    metaTitle: 'Counselling coverage in Alberta | Westpeak Wellness',
    metaDescription:
      'AHCIP does not cover private counselling. What extended health plans reimburse, which designation to ask about, and the free routes worth trying first.',
    eyebrow: 'Alberta',
    lede:
      'Alberta Health does not pay for private counselling, which surprises people who assume a provincial health card covers mental health the way it covers a fracture. Here is what actually pays, and what to ask before booking anything.',
    shortAnswer:
      'AHCIP does not cover private counselling. Most people pay through an extended health plan, out of pocket, or through a publicly funded service with a waitlist. Before booking privately, ask your insurer one question: does the plan reimburse a Canadian Certified Counsellor?',
    updated: '2026-09-02',
    readMinutes: 6,
    sections: [
      {
        h2: 'What AHCIP does and does not pay for',
        body: [
          'Alberta Health Care Insurance Plan coverage for mental health follows the same logic as most provincial plans: it pays for physicians. A visit to your family doctor about low mood is covered. A psychiatrist, if you can get a referral and wait for one, is covered. A counsellor or psychotherapist in private practice is not.',
          'That is not a gap specific to Alberta and it is not a judgement about whether counselling works. It is a consequence of how provincial plans are structured — they insure medical services delivered by physicians, and counselling is not delivered by one. The practical effect is the same either way: the cost of private counselling falls to you or to an extended health plan.',
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
          'What fills that space is national certification. The CCC is granted against education, supervised practice hours and a code of ethics, it is held on a public register, and it is what most Alberta plans point at as a result. Some plans also name a registered psychologist, which is a separate and regulated profession in Alberta with its own college and generally a higher fee.',
        ],
      },
      {
        h2: 'The free and lower-cost routes first',
        list: [
          {
            label: 'Access Mental Health',
            detail:
              'Alberta Health Services runs a navigation line that can point you toward publicly funded options and assess what you qualify for. It is a routing service rather than a therapy service, and it is free.',
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
          'Ask for the receipt to carry the counsellor’s certification number. Most plans want it, and a receipt without one is the most common reason a legitimate claim gets returned.',
          'Ask also whether the practice direct-bills or whether you pay and submit. Both are ordinary; the difference decides whether you are out of pocket for a month, which matters more to some people than the fee itself.',
        ],
      },
    ],
    midCta: {
      text: 'Camille Granda, RCC, CCC, can see clients in Alberta, and the first fifteen minutes are free.',
      label: 'More about Camille',
    },
    faqs: [
      {
        q: 'Does AHCIP cover any counselling at all?',
        a: 'It covers physicians, so a conversation with your family doctor or a psychiatrist you have been referred to is covered. Counselling from a counsellor or psychotherapist in private practice is not, regardless of their credentials.',
      },
      {
        q: 'Is a Canadian Certified Counsellor recognised in Alberta?',
        a: 'It is the national certification and it is what plans in Alberta generally name, precisely because there is no provincial counselling college to register with. Whether your specific plan reimburses it is a question only your insurer can answer, and it takes one call.',
      },
      {
        q: 'Can a counsellor based in BC see me in Alberta?',
        a: 'It depends on their certification and their insurance rather than on where they sit. Counselling therapy is not regulated in Alberta, so the questions that matter are whether they hold a recognised certification and whether their liability cover extends to Alberta clients. At this practice one counsellor meets both conditions and the pages say which.',
      },
      {
        q: 'Do I need a referral?',
        a: 'Not to see a counsellor — you can approach one directly. You may need one for your insurer to reimburse, which is a separate question and worth asking on the same call.',
      },
    ],
    sources: [
      { label: 'Alberta Health Care Insurance Plan — Government of Alberta', url: 'https://www.alberta.ca/ahcip.aspx' },
      { label: 'Access Mental Health — Alberta Health Services', url: 'https://www.albertahealthservices.ca/info/Page9985.aspx' },
      { label: '211 Alberta', url: 'https://ab.211.ca/' },
      { label: 'Canadian Counselling and Psychotherapy Association', url: 'https://www.ccpa-accp.ca/' },
    ],
    related: [
      { href: '/practitioners/camille-granda', label: 'Camille Granda, RCC, CCC — Alberta and BC' },
      { href: '/practitioners/camille-granda/calgary', label: 'Counselling in Calgary' },
      { href: '/practitioners/camille-granda/edmonton', label: 'Counselling in Edmonton' },
      { href: '/tools/therapy-cost-bc', label: 'Work out what a session would actually cost you' },
      { href: '/pricing', label: 'Fees at this practice' },
    ],
    figure: 'reimbursement-flow',
  },
  {
    slug: 'how-to-check-a-counsellor-in-alberta',
    title: 'How to check a counsellor in Alberta',
    metaTitle: 'How to check a counsellor in Alberta | Westpeak Wellness',
    metaDescription:
      'Counselling therapy is not regulated in Alberta, so there is no college to search. What can be verified instead, and the registers that let you do it.',
    eyebrow: 'Alberta',
    lede:
      'In British Columbia you can look a counsellor up in a public register in about two minutes. In Alberta there is no equivalent college, which does not mean nothing can be checked — it means checking a different thing.',
    shortAnswer:
      'Counselling therapy is not a regulated profession in Alberta, so there is no provincial college and no licence to verify. What you can verify is national certification: a Canadian Certified Counsellor is listed on the CCPA register, and anyone claiming the title can be confirmed there. Psychologists are separately regulated and appear on their own college register.',
    updated: '2026-09-02',
    readMinutes: 5,
    sections: [
      {
        h2: 'What "unregulated" actually means',
        body: [
          'It means the title is not protected. In Alberta, no law reserves the words counsellor or therapist for people with particular training, so somebody with a weekend certificate and somebody with a master’s degree and a decade of supervised practice can use the same word on the same website.',
          'It does not mean nobody is accountable. It means accountability is voluntary and comes from certification bodies rather than from a provincial college — so the useful question is not "are they licensed", which has no Alberta answer, but "what have they voluntarily submitted themselves to, and can I see it".',
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
              'A counsellor may hold a designation from another province — an RCC from British Columbia, for instance. That is checkable on that province’s register and tells you the standard they meet, though it is not an Alberta licence and should not be described as one.',
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
          'Both counsellors here list their credentials with numbers on their own pages, and both bodies hold public registers you can search yourself. The counsellor who can see Alberta clients holds the CCC as well as a BC registration, and the Alberta-relevant one is named first on her Alberta pages for that reason.',
          'The site also publishes no client testimonials, which is not modesty — the BC association prohibits them. Where reviews would normally sit, checkable credentials do instead.',
        ],
      },
    ],
    midCta: {
      text: 'Every credential named on this site is on a public register, with the number, so you can check it rather than take it on trust.',
      label: 'See the counsellors',
    },
    faqs: [
      {
        q: 'Is there an Alberta college of counselling therapists?',
        a: 'Not at present. Counselling therapy is not a regulated profession in Alberta, so there is no college, no licence and no provincial register of counsellors. Psychologists are regulated separately and do have one.',
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
        a: 'To the certification body the counsellor belongs to — the CCPA for a CCC, or the relevant provincial college for a psychologist or an out-of-province registrant. If they belong to nothing, there is no external route, which is the strongest argument for checking at the start.',
      },
    ],
    sources: [
      { label: 'Canadian Counselling and Psychotherapy Association — certification', url: 'https://www.ccpa-accp.ca/' },
      { label: 'College of Alberta Psychologists', url: 'https://cap.ab.ca/' },
      { label: 'Health Professions Act — Government of Alberta', url: 'https://www.alberta.ca/health-professions-act.aspx' },
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

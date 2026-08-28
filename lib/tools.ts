/* The site's interactive tools.
 *
 * Each is a real decision aid, not a lead-capture trick: they run entirely in
 * the browser, ask for nothing, store nothing, and several of their outcomes
 * point away from this practice. A tool that can only ever conclude "book with
 * us" is an advertisement wearing a quiz's clothes, and readers can tell.
 *
 * BCACC: none of these screens, scores or diagnoses. The reflection tool in
 * particular says so in its own words on the results screen, not only in a
 * footnote.
 */

export type ToolMeta = {
  slug: string;
  title: string;
  short: string;
  metaTitle: string;
  metaDescription: string;
  minutes: number;
  /* The questions people actually arrive at a tool holding, answered on the
   * page rather than left to the result screen. These were the thinnest pages
   * on the site — 434 to 524 words — because the interactive part carried all
   * of the value and did none of the explaining. */
  faqs?: { q: string; a: string }[];
  related?: { href: string; label: string }[];
};

export const tools: ToolMeta[] = [
  {
    slug: 'which-service',
    title: 'Which kind of counselling fits?',
    short: 'Five questions, then a suggested starting point — including when that is not therapy.',
    metaTitle: 'Which kind of counselling fits? | Westpeak Wellness',
    metaDescription:
      'A short, private questionnaire that suggests where to start — individual, couples, EMDR or something outside counselling. No sign-up, nothing stored.',
    minutes: 2,
    faqs: [
      {
        q: 'Is this an assessment?',
        a: 'No. It sorts your answers towards a starting point, which is a different job from assessing anything. A Registered Clinical Counsellor does not diagnose in any case — where a formal diagnosis is what you need, that is a physician, psychiatrist or registered psychologist. What this can do is stop you spending a first session working out which door you should have walked through.',
      },
      {
        q: 'What if the result is not what I expected?',
        a: 'That is worth paying attention to rather than overriding. It usually means one answer carried more weight than you thought it would — often the question about whether the difficulty sits inside one person or between two. You can run it again and change that answer to see how much it was driving. If the result still feels wrong, it is wrong: five questions cannot know what you know.',
      },
      {
        q: 'Can it tell me counselling is not the answer?',
        a: 'Yes, and some of its outcomes do exactly that. A tool that can only ever conclude "book with us" is an advertisement wearing a quiz\'s clothes. Where what you describe points to a physician, to an EFAP you already have, or to something practical rather than therapeutic, it says so and links there instead.',
      },
      {
        q: 'Do you see my answers?',
        a: 'No. Everything runs in your browser. Nothing is sent anywhere, nothing is stored, and there is no account, no email field and no analytics attached to what you choose. Closing the tab ends it.',
      },
      {
        q: 'Does the suggestion commit me to anything?',
        a: 'Not in the slightest. It is a starting point for a conversation, and the free 15-minute consultation exists precisely so that the starting point can be checked before anybody books a session. Changing direction after that conversation is normal and costs nothing.',
      },
    ],
    related: [
      { href: '/services', label: 'All counselling services' },
      { href: '/compare/individual-vs-couples-therapy', label: 'Individual vs couples therapy' },
      { href: '/compare/cbt-vs-emdr-for-trauma', label: 'CBT compared with EMDR' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
    ],
  },
  {
    slug: 'therapy-cost-bc',
    title: 'What counselling costs in BC',
    short: 'Work out what you would actually pay after extended health, and what to check first.',
    metaTitle: 'BC counselling cost estimator | Westpeak Wellness',
    metaDescription:
      'Estimate what counselling costs in British Columbia after extended health reimbursement, and the two questions to ask your plan before booking.',
    minutes: 2,
    faqs: [
      {
        q: 'Why can no website just tell me the price?',
        a: 'Because the session fee is the part that is knowable and the part you pay is not. Extended health plans are negotiated per employer, not per insurer, so two people with the same insurer on the same card can have different counselling coverage. The fee is published on the fees page; what it costs you after reimbursement is a fact about your plan, which is why this asks you for it rather than guessing.',
      },
      {
        q: 'Does MSP cover counselling?',
        a: 'Not in private practice. MSP covers physician-delivered mental-health care — your GP, and psychiatry on referral — but not sessions with a Registered Clinical Counsellor. This is the single most common misunderstanding people arrive with, and it is worth settling before you budget anything.',
      },
      {
        q: 'My plan covers a psychologist. Is that the same thing?',
        a: 'No, and this is the detail people most often discover after a first session rather than before it. Registered Clinical Counsellor, registered psychologist and registered social worker are separate designations, and a plan can name one and not the others. Ask specifically whether "Registered Clinical Counsellor" or "RCC" is listed — not whether the plan covers "counselling", which is a word insurers use loosely.',
      },
      {
        q: 'Which cap actually binds — per session or per year?',
        a: 'Usually the annual maximum. A plan paying $120 per session with an $800 annual cap does not fund seven sessions at a comfortable rate; it funds under seven sessions and then stops. Working out how many sessions the annual figure buys is more useful than the per-session number, and the estimator does that rather than reporting a percentage.',
      },
      {
        q: 'Do you direct-bill?',
        a: 'No. You pay at the session and claim it back, and a receipt with the registration number on it is issued each time. That means you need the money at the point of the session even when the plan will return most of it — a real constraint, and one worth knowing before booking rather than after.',
      },
      {
        q: 'What if the answer is that I cannot afford it?',
        a: 'Then that is worth finding out here rather than three sessions in. A great many people already hold a free entitlement they have never used — an EFAP through work, a student counselling service, a community agency with sliding-scale places. The low-cost counselling page and the EFAP comparison cover those, and they are the right first stop if cost is the constraint rather than a detail.',
      },
    ],
    related: [
      { href: '/pricing', label: 'Fees and coverage' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage in BC' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/compare/efap-vs-private-counselling', label: 'EFAP vs private counselling' },
    ],
  },
  {
    slug: 'stress-check',
    title: 'A reflection on how things have been',
    short: 'Six questions to help you name what is going on. Not a test, and not a diagnosis.',
    metaTitle: 'How have things been? A reflection | Westpeak Wellness',
    metaDescription:
      'Six calm questions to help put words to how the last few weeks have been. Not a screening tool, not a diagnosis, and nothing is stored.',
    minutes: 3,
    faqs: [
      {
        q: 'Why is there no score at the end?',
        a: 'Because a number would be the least honest thing this could give you. Validated screening instruments exist, they are administered in a clinical context, and their scores mean something because of that context. Six questions on a website have none of it. A score here would carry the appearance of measurement without any of the substance, and people remember numbers long after they forget the caveat printed under them.',
      },
      {
        q: 'So what does it actually give me?',
        a: 'Language. Most people arrive at counselling able to say that something is wrong and unable to say what — and that gap is not a failure of insight, it is what happens when something has been going on long enough to become the weather rather than an event. The reflection hands back what you described in words you can use, whether that is in a first session, with a GP, or with someone you have not told yet.',
      },
      {
        q: 'Is this a depression or anxiety test?',
        a: 'No, and it is deliberately not built like one. It does not screen, score or diagnose, and recognising yourself in a description here is a reason to talk to someone qualified rather than a reason to conclude anything. A Registered Clinical Counsellor does not diagnose either; where a formal diagnosis is what you need, that is a physician, psychiatrist or registered psychologist.',
      },
      {
        q: 'What if answering it makes me feel worse?',
        a: 'That happens sometimes, and it is worth knowing in advance. Putting words to something you have been managing by not looking at it directly can be its own small shock. If that is where you land, it is information rather than a setback — and if things feel genuinely unsafe rather than uncomfortable, call or text 9-8-8, which is free, 24/7 and staffed by people whose job is exactly this.',
      },
      {
        q: 'Is anything stored?',
        a: 'Nothing. It runs entirely in your browser, there is no account or email field, and nothing you enter is transmitted or saved. Closing the tab is the end of it, and reopening the page starts from nothing.',
      },
      /* Exact searched phrasing — "mental health check up" reaches the site
       * (pos 80, 2026-08-28 export) and this page is the closest honest
       * answer BC has to offer for it. */
      {
        q: 'Is there such a thing as a mental health check-up?',
        a: 'Not as a standardised service the way a physical or a dental cleaning is — which is partly why people search for one. The nearest real equivalents in BC: raising mental health at your regular GP visit (a legitimate use of it, and where formal screening lives), a one-off counselling session used as exactly this kind of stocktake, or a free 15-minute consultation to talk through whether anything needs attention. This reflection is the self-serve version: language for how things have been, with no score pretending to be medicine.',
      },
    ],
    related: [
      { href: '/guides/signs-it-might-be-time-for-therapy', label: 'Signs it might be time for therapy' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout compared with depression' },
      { href: '/guides/what-trauma-actually-means', label: 'What "trauma" actually means' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
    ],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);

/* ---- Question data ------------------------------------------------------ */

export type Choice = { label: string; tag: string };
export type Question = { q: string; help?: string; choices: Choice[] };

export type Outcome = {
  tag: string;
  heading: string;
  body: string;
  href?: string;
  hrefLabel?: string;
  /* When true the result deliberately points somewhere other than a booking. */
  elsewhere?: boolean;
};

export const WHICH_SERVICE: Question[] = [
  {
    q: 'Who would the sessions be for?',
    choices: [
      { label: 'Just me', tag: 'individual' },
      { label: 'Me and my partner, together', tag: 'couples' },
      { label: 'Me, but the difficulty is the relationship', tag: 'individual' },
      { label: 'Someone else I am worried about', tag: 'thirdparty' },
    ],
  },
  {
    q: 'What has been hardest lately?',
    choices: [
      { label: 'Worry, dread, or a body that will not settle', tag: 'anxiety' },
      { label: 'Flatness, no motivation, nothing lands', tag: 'depression' },
      { label: 'Something that happened, and it is still with me', tag: 'trauma' },
      { label: 'Conflict, distance, or trust', tag: 'couples' },
      { label: 'Exhaustion from work or caring for people', tag: 'burnout' },
    ],
  },
  {
    q: 'How long has it been going on?',
    choices: [
      { label: 'Weeks', tag: '' },
      { label: 'Months', tag: '' },
      { label: 'Years — it comes and goes', tag: 'trauma' },
      { label: 'As long as I can remember', tag: 'trauma' },
    ],
  },
  {
    q: 'Is any of this connected to something you would call a bad experience?',
    help: 'There is no need to be specific, and "I am not sure" is a real answer.',
    choices: [
      { label: 'Yes, clearly', tag: 'trauma' },
      { label: 'Maybe — I have wondered', tag: 'trauma' },
      { label: 'No', tag: '' },
      { label: 'I would rather not say yet', tag: '' },
    ],
  },
  {
    q: 'Right now, are you safe?',
    help: 'This changes what to do next, so it is worth asking plainly.',
    choices: [
      { label: 'Yes', tag: '' },
      { label: 'I am struggling but not in danger', tag: '' },
      { label: 'I am not sure, or I am thinking about harming myself', tag: 'crisis' },
    ],
  },
];

export const WHICH_SERVICE_OUTCOMES: Outcome[] = [
  {
    tag: 'crisis',
    heading: 'Please start somewhere faster than a website',
    body:
      'Counselling is not the right speed for what you have just described. In Canada you can call or text 9-8-8 at any hour, and in BC the Mental Health Support line is 310-6789 with no area code needed. If you are in immediate danger, 9-1-1. None of this means therapy is not for you later — it means today needs something more immediate.',
    href: '/resources/bc-crisis-and-support-directory',
    hrefLabel: 'BC crisis and support directory',
    elsewhere: true,
  },
  {
    tag: 'thirdparty',
    heading: 'Counselling for someone else has to start with them',
    body:
      'A counsellor cannot work with a person who has not chosen to come, and being the one who notices is its own weight. Support for the supporter is a legitimate reason to book for yourself — and often the more useful move.',
    href: '/for/family-caregivers',
    hrefLabel: 'Read: supporting someone else',
  },
  {
    tag: 'trauma',
    heading: 'Trauma-informed work, and possibly EMDR',
    body:
      'When something older is still active, the sequence matters more than the method: capacity and regulation first, memory only once you can feel something and still think about it. EMDR is one route through that, with a strong evidence base for post-traumatic stress.',
    href: '/services/trauma-therapy',
    hrefLabel: 'Trauma therapy',
  },
  {
    tag: 'couples',
    heading: 'Couples counselling',
    body:
      'Gottman Method-informed work starts with a structured assessment rather than advice — a joint session, an individual session each, then an agreed plan. If only one of you wants to come, that is workable too, and worth reading about first.',
    href: '/services/couples-therapy',
    hrefLabel: 'Couples therapy',
  },
  {
    tag: 'anxiety',
    heading: 'Anxiety counselling',
    body:
      'Structured cognitive behavioural work targets the mechanisms keeping anxiety running — avoidance, safety behaviours, reassurance-seeking — rather than arguing with the content of any individual worry.',
    href: '/services/anxiety-counselling',
    hrefLabel: 'Anxiety counselling',
  },
  {
    tag: 'burnout',
    heading: 'Worth telling burnout from depression first',
    body:
      'They look alike from outside and need different responses, and the distinction changes what actually helps. That is the first thing to sort out, before choosing an approach.',
    href: '/guides/burnout-vs-depression',
    hrefLabel: 'Burnout vs depression',
  },
  {
    tag: 'depression',
    heading: 'Depression counselling',
    body:
      'Behavioural activation plus cognitive work. Because low mood removes motivation before it removes activity, the work schedules activity in advance rather than waiting for the desire to return.',
    href: '/services/depression-counselling',
    hrefLabel: 'Depression counselling',
  },
  {
    tag: 'individual',
    heading: 'Individual therapy',
    body:
      'One-to-one counselling by secure video, for the things that have gone on too long and stopped responding to the obvious fixes.',
    href: '/services/individual-therapy',
    hrefLabel: 'Individual therapy',
  },
];

export const STRESS_CHECK: Question[] = [
  {
    q: 'Over the last few weeks, how has sleep been?',
    choices: [
      { label: 'Fine', tag: '' },
      { label: 'Harder to get to sleep than it used to be', tag: 'arousal' },
      { label: 'I wake in the night and my mind starts up', tag: 'arousal' },
      { label: 'I am sleeping much more than usual and still tired', tag: 'low' },
    ],
  },
  {
    q: 'And the things you normally enjoy?',
    choices: [
      { label: 'Still enjoy them', tag: '' },
      { label: 'I do them, but they feel flat', tag: 'low' },
      { label: 'I have mostly stopped', tag: 'low' },
      { label: 'I have no time for them', tag: 'load' },
    ],
  },
  {
    q: 'How is your body, physically?',
    choices: [
      { label: 'Normal', tag: '' },
      { label: 'Tense — jaw, shoulders, stomach', tag: 'arousal' },
      { label: 'Wired and tired at the same time', tag: 'arousal' },
      { label: 'Heavy and slow', tag: 'low' },
    ],
  },
  {
    q: 'When something goes wrong, what happens in your head?',
    choices: [
      { label: 'I deal with it', tag: '' },
      { label: 'I replay it for hours', tag: 'arousal' },
      { label: 'I assume it is my fault', tag: 'self' },
      { label: 'I feel nothing much', tag: 'low' },
    ],
  },
  {
    q: 'Has anyone close to you said anything?',
    choices: [
      { label: 'No', tag: '' },
      { label: 'Someone has asked if I am okay', tag: 'seen' },
      { label: 'More than one person has', tag: 'seen' },
      { label: 'There is not really anyone to notice', tag: 'alone' },
    ],
  },
  {
    q: 'If this carried on unchanged for another six months?',
    choices: [
      { label: 'That would be manageable', tag: '' },
      { label: 'I would cope, but I would not want to', tag: 'load' },
      { label: 'Something would have to give', tag: 'load' },
      { label: 'I do not want to think about that', tag: 'load' },
    ],
  },
];

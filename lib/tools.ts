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
  },
  {
    slug: 'therapy-cost-bc',
    title: 'What counselling costs in BC',
    short: 'Work out what you would actually pay after extended health, and what to check first.',
    metaTitle: 'BC counselling cost estimator | Westpeak Wellness',
    metaDescription:
      'Estimate what counselling costs in British Columbia after extended health reimbursement, and the two questions to ask your plan before booking.',
    minutes: 2,
  },
  {
    slug: 'stress-check',
    title: 'A reflection on how things have been',
    short: 'Six questions to help you name what is going on. Not a test, and not a diagnosis.',
    metaTitle: 'How have things been? A reflection | Westpeak Wellness',
    metaDescription:
      'Six calm questions to help put words to how the last few weeks have been. Not a screening tool, not a diagnosis, and nothing is stored.',
    minutes: 3,
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

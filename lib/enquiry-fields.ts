/* WHAT AN ENQUIRY HAS TO SAY BEFORE IT IS ACCEPTED — the three choices.
 *
 * Decided 25 Sep 2026 by the owner, after a run of enquiries whose message
 * was a template ("I would like more information. Please contact me by
 * email") pasted into every text field of the form, including "best time to
 * call". Two sentences was the only rule and a template has two sentences.
 *
 * Three short choices, each a select. A select cannot be filled with a
 * pasted paragraph, so a script that fills every field with the same string
 * fails; and a person who has to say what they want, where they are and how
 * soon has told the counsellor the three things the first reply always has to
 * ask. This reverses the rule at the top of components/InboundForm.tsx ("no
 * dropdown of concerns") deliberately, and DECISIONS.md records why.
 *
 * Pure, no imports: bundled into the client form and read by the route, so
 * both sides hold the same list and a value the form cannot produce is
 * refused by the server.
 */
export type Option = { value: string; label: string };

export const LOOKING: Option[] = [
  { value: 'individual', label: 'Counselling for myself' },
  { value: 'couples', label: 'Couples or marriage counselling' },
  { value: 'trauma', label: 'Trauma or EMDR' },
  { value: 'family', label: 'Family counselling' },
  { value: 'punjabi', label: 'Counselling in Punjabi' },
  { value: 'tagalog', label: 'Counselling in Tagalog' },
  { value: 'unsure', label: 'Not sure yet' },
  /* 1 Oct 2026. HR and managers wrote through the client form, or booked a
     client consultation to ask about their team. This is the choice they
     make instead; /contact?about=employer preselects it. WHERE and TIMING are
     questions about a client's sessions and are not asked of an employer
     (choicesComplete below); the message floor still applies. */
  { value: 'employer', label: 'An employer or HR enquiry' },
];

/** The LOOKING value that is not somebody asking for counselling. */
export const EMPLOYER = 'employer';

export const WHERE: Option[] = [
  { value: 'bc', label: 'British Columbia' },
  { value: 'ab', label: 'Alberta' },
  { value: 'other', label: 'Somewhere else' },
];

export const TIMING: Option[] = [
  { value: 'soon', label: 'As soon as possible' },
  { value: 'month', label: 'Within the next month' },
  { value: 'exploring', label: 'Just exploring for now' },
];

export const labelOf = (list: Option[], value?: string) =>
  list.find((o) => o.value === value)?.label ?? '';

export const isOption = (list: Option[], value: string) => list.some((o) => o.value === value);

/** Whether the three choices are a set the form can produce. An employer
 *  enquiry needs only LOOKING; every other enquiry needs all three. */
export const choicesComplete = (looking: string, where: string, timing: string) =>
  looking === EMPLOYER
    ? true
    : isOption(LOOKING, looking) && isOption(WHERE, where) && isOption(TIMING, timing);

/** The LOOKING value to preselect from a page's `?about=`, or '' for none. */
export const lookingFromAbout = (about: string | null | undefined) =>
  about && isOption(LOOKING, about) ? about : '';

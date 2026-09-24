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
];

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

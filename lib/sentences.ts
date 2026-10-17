/* HOW MUCH A MESSAGE HAS TO SAY BEFORE IT IS ACCEPTED.
 *
 * Decided 6 Sep 2026. A message to the practice must say, in at least two
 * sentences, what the person is looking for. One-word enquiries ("hi", "price?",
 * "available?") cost a counsellor a reply that asks the question the form
 * should have asked, and the person a day's wait to be asked it.
 *
 * Shared by the form (so the browser can say so before posting) and the route
 * (so a post that skipped the browser is held to the same rule). Pure, no
 * imports, so it can be bundled into a client component without dragging
 * anything server-side along with it.
 *
 * "Sentence" is deliberately loose. People write to counsellors without full
 * stops, on phones, at 2 a.m. A sentence here is a run of at least three words
 * ending in . ! ? or a line break, or trailing off at the end of the text. It
 * is a floor against mis-clicks and one-worders, not a grammar check.
 */

export const MIN_SENTENCES = 2;

/* The danda (U+0964) and double danda (U+0965) end a sentence in Gurmukhi,
 * as a full stop does in English. Until 1 Oct 2026 they were not in the
 * split, so a Punjabi message of several sentences counted as one and was
 * refused for want of a second, on /punjabi and on the enquiry form on
 * /book?with=savneet-singh alike. */
export function countSentences(text: string): number {
  return text
    .split(/[.!?।॥]+(?:\s+|$)|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 3)
    .length;
}

export const hasEnoughSentences = (text: string): boolean =>
  countSentences(text) >= MIN_SENTENCES;

/* AND AT LEAST TWENTY WORDS — 25 Sep 2026.
 *
 * The two-sentence floor was met by a thirteen-word template ("I would like
 * more information. Please contact me by email.") that arrived in the inbox
 * repeatedly, pasted into every field. Twenty words is still less than a
 * text message; it is more than a template. Applied to enquiries only, by the
 * form and by the route, like the sentence rule. */
export const MIN_WORDS = 20;
export const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

/* A SECOND FLOOR, BUILT AND OFF — 16 Oct 2026 (item 577, deferred candidate 53).
 *
 * The ask-for-a-time form on /book asks for when a person is free; the
 * floor above was written for a first message about what they want from
 * counselling. All-time, the server turned back 13 enquiries for detail
 * against 8 stored, 2 of them from /book. Whether a lighter floor for that
 * one form is right is the owner's call, and the measure is set in
 * DECISIONS (15 Oct): /admin's "short" and "one-sentence" blocks on /book
 * against the /book enquiries stored. So the lighter floor exists and is
 * switched off: TIME_REQUEST_FLOOR names the floor the #ask-for-a-time form
 * uses, and it is 'enquiry', today's rule, until the owner flips it. Only
 * that form sends form=time-request, and lib/inbound-submit.ts applies it
 * only for a post from /book, as it does the /punjabi exemption. */
export type FloorName = 'enquiry' | 'time-request';
export type Floor = { sentences: number; words: number };
export const ENQUIRY_FLOORS: Readonly<Record<FloorName, Floor>> = {
  enquiry: { sentences: MIN_SENTENCES, words: MIN_WORDS },
  'time-request': { sentences: 1, words: 10 },
};
/** The floor the /book ask-for-a-time form uses. 'enquiry' = unchanged. */
export const TIME_REQUEST_FLOOR: FloorName = 'enquiry';
/** The hidden field value that names the ask-for-a-time form. */
export const TIME_REQUEST_FORM = 'time-request';

export const hasEnoughDetail = (text: string, floor: Floor = ENQUIRY_FLOORS.enquiry): boolean =>
  countSentences(text) >= floor.sentences && countWords(text) >= floor.words;

/* THE RULE, SHOWN WHILE TYPING — 1 Oct 2026. Every label on the form was
 * screen-reader-only, the guidance vanished with the placeholder, and the
 * floor was reported only by the browser's prompt at submit. The form now
 * shows a word count under the message. `stage` changes only three times as
 * a person types, so a polite live region keyed to it speaks three times,
 * not once per keystroke. The rule itself is hasEnoughDetail, unchanged. */
export type DetailStage = 'short' | 'one-sentence' | 'enough';

export function detailProgress(text: string, floor: Floor = ENQUIRY_FLOORS.enquiry): { words: number; stage: DetailStage; count: string; status: string } {
  const words = countWords(text);
  const stage: DetailStage = hasEnoughDetail(text, floor) ? 'enough' : words >= floor.words ? 'one-sentence' : 'short';
  const two = floor.sentences > 1;
  const count = stage === 'short'
    ? `${words} of about ${floor.words} words`
    : stage === 'one-sentence'
      ? `${words} words. ${two ? 'Add a second sentence.' : 'Finish the sentence.'}`
      : `${words} words. That is enough to send.`;
  const status = stage === 'short'
    ? `Write about ${floor.words} words${two ? ', in at least two sentences' : ''}.`
    : stage === 'one-sentence'
      ? `Enough words. ${two ? 'Add a second sentence.' : 'Finish the sentence.'}`
      : 'That is enough to send.';
  return { words, stage, count, status };
}

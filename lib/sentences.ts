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

export function countSentences(text: string): number {
  return text
    .split(/[.!?]+(?:\s+|$)|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 3)
    .length;
}

export const hasEnoughSentences = (text: string): boolean =>
  countSentences(text) >= MIN_SENTENCES;

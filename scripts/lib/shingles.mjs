/* THE UNIQUENESS MEASURE, SHARED — 4 Oct 2026.
 *
 * Moved out of scripts/uniqueness-gate.mjs, unchanged, so the page scorer
 * (scripts/page-score.mjs) measures near-duplication exactly the way the gate
 * does. Two copies of a similarity measure would be two opinions about what
 * "the same page" means.
 *
 * <main> only, because the flight payload and the shared header/footer are
 * not content and counting them would drown the signal; overlapping 8-word
 * shingles, long enough that a shared stock phrase does not register and
 * short enough that a lightly reworded paragraph still does.
 */

/** The lowercased visible text of a document's <main>, tags and entities dropped. */
export function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = m ? m[1] : html;
  return textOf(scope);
}

/** Lowercased visible text of an HTML fragment, the same way mainText reads one. */
export function textOf(fragment) {
  return fragment
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Overlapping n-word shingles of a text. */
export function shingles(text, n = 8) {
  const w = text.split(' ').filter(Boolean);
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
}

export const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
};

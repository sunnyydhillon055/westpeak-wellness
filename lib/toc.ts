/* Heading ids + table-of-contents assembly.
 *
 * Long-form pages run to 9,000–12,000px. A reader who wants one section had no
 * way to find it. These build a stable anchor per H2 so the sticky TOC and the
 * in-page links agree.
 */

export type TocItem = { id: string; label: string };

/** Slug for an H2. Stable across builds; strips smart punctuation first so
 *  "Won’t" and "Wont" cannot produce two different anchors. */
export function headingId(h: string): string {
  return h
    .toLowerCase()
    .replace(/[‘’“”–—]/g, (c) => (c === '–' || c === '—' ? '-' : ''))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

/** Build a TOC from section headings plus any fixed trailing headings.
 *  Duplicate labels get a numeric suffix so every anchor stays unique. */
export function buildToc(headings: string[]): TocItem[] {
  const seen = new Map<string, number>();
  return headings
    .filter(Boolean)
    .map((label) => {
      const base = headingId(label);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { id: n === 0 ? base : `${base}-${n + 1}`, label };
    });
}

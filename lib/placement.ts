/* Where the mid-article devices go.
 *
 * Every long-form template pinned its figure and its contextual CTA to
 * `i === 0`, and put the second figure after the last section. On a six-section
 * page that reads fine. On a twelve-section page it means everything visual
 * happens in the first screen and a half, and the middle of the article — the
 * part someone is reading when they are deciding whether to book — is a
 * continuous column of text.
 *
 * Measured on /guides/how-the-gottman-method-works before this change: devices
 * at 419, 865, 1583 and 2364px, then nothing until 6704px. A 3,880px gap, or
 * 4.3 viewport heights of unbroken reading.
 *
 * Section *count* is the wrong thing to space against, because sections are not
 * the same size — one can be three paragraphs and the next a single line. This
 * spaces against content weight, so the gaps come out even in pixels rather
 * than even in headings.
 */

export type Weighted = {
  body?: string[];
  list?: { label: string; detail: string }[];
};

/* A list item is visually shorter than a paragraph of the same word count —
 * it carries its own bullet, spacing and line break — so it is discounted
 * rather than counted at face value. */
const LIST_ITEM_WEIGHT = 0.6;

function weigh(s: Weighted): number {
  const bodyWords = (s.body ?? []).reduce((n, p) => n + p.split(/\s+/).length, 0);
  const listWords = (s.list ?? []).reduce(
    (n, i) => n + (i.label + ' ' + i.detail).split(/\s+/).length,
    0
  );
  return bodyWords + listWords * LIST_ITEM_WEIGHT;
}

/**
 * Returns, for each of `count` devices, the index of the section it should
 * follow — spaced evenly through the article by cumulative content weight.
 *
 * Devices are never placed after the final section: something has to follow a
 * device, or it stops being a break in the reading and becomes the end of it.
 */
export function deviceSlots(sections: Weighted[], count: number): number[] {
  const n = sections.length;
  if (count <= 0 || n === 0) return [];

  // Fewer sections than devices: one per section, in order, and drop the rest.
  const last = Math.max(0, n - 2);
  if (n <= count + 1) return Array.from({ length: count }, (_, k) => Math.min(k, last));

  const weights = sections.map(weigh);
  const total = weights.reduce((a, b) => a + b, 0);
  if (total === 0) return Array.from({ length: count }, (_, k) => Math.min(k, last));

  const cum: number[] = [];
  let run = 0;
  for (const w of weights) {
    run += w;
    cum.push(run);
  }

  const slots: number[] = [];
  for (let k = 1; k <= count; k++) {
    const target = (total * k) / (count + 1);
    let i = cum.findIndex((c) => c >= target);
    if (i < 0) i = last;

    // Two devices in the same gap would defeat the point; push the later one on.
    const prev = slots.length ? slots[slots.length - 1] : -1;
    if (i <= prev) i = prev + 1;

    slots.push(Math.min(i, last));
  }
  return slots;
}

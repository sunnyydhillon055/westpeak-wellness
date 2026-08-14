/**
 * The tracked target set.
 *
 * This replaces "counselling in <city>" as the definition of winning, and the
 * reason is arithmetic rather than preference. Page one of a city head-term is
 * roughly:
 *
 *     map pack (3 slots)          250 pts   unreachable without an address
 *     directories (3-5 slots)     200 pts   reachable by being listed, not by outranking
 *     organic practice sites      400 pts   contested by incumbents with offices and age
 *     snippet / PAA / AI overview 150 pts   reachable
 *
 * A practice with no office anywhere therefore tops out near 570 on those
 * queries, and lower in Vancouver where the organic slots are already held.
 * See RANKING_MODEL.md for the full derivation.
 *
 * The 250 map-pack points only exist on queries with local intent. Remove local
 * intent -- province-level, language-specific, modality-specific, informational
 * -- and they redistribute into slots that ARE reachable. That is the whole
 * strategy: compete where the box is a different shape.
 *
 * `ceiling` is the realistic best score in that query class at full maturity,
 * NOT a prediction of where the site sits today. Today-score is gated by domain
 * authority, directory citations and recrawl, none of which live in this repo.
 */

export type Tier = 1 | 2 | 3;

export type Target = {
  /** The query class, written as somebody would actually type it. */
  query: string;
  /**
   * 1 = uncontested intersection, own it outright
   * 2 = winnable with authority
   * 3 = structurally capped, keep the pages but do not measure success here
   */
  tier: Tier;
  /** Realistic best achievable score, 1-1000. */
  ceiling: number;
  /** Does a local pack trigger? If yes, 250 points are off the table. */
  mapPack: boolean;
  /** Route that targets this, once built. Undefined means the gap is open. */
  page?: string;
  note?: string;
};

export const targets: Target[] = [
  /* ---- Tier 1: uncontested intersections ------------------------------
   * Every Punjabi-speaking counsellor with an office is in Surrey, Abbotsford
   * or Vancouver. For a Punjabi-speaking person in Prince George or Cranbrook,
   * a virtual practice is not a compromise -- it is the only option that
   * exists. On these queries the practice is not competing for a slot, it is
   * the best available answer. */
  { query: 'punjabi speaking counsellor prince george', tier: 1, ceiling: 960, mapPack: false, page: '/punjabi-counselling/prince-george' },
  { query: 'punjabi speaking therapist northern bc', tier: 1, ceiling: 960, mapPack: false },
  { query: 'punjabi counselling kamloops', tier: 1, ceiling: 950, mapPack: false, page: '/punjabi-counselling/kamloops' },
  { query: 'punjabi speaking therapist kelowna', tier: 1, ceiling: 945, mapPack: false, page: '/punjabi-counselling/kelowna' },
  { query: 'punjabi counselling nanaimo vancouver island', tier: 1, ceiling: 940, mapPack: false },
  { query: 'punjabi speaking counsellor kootenays cranbrook', tier: 1, ceiling: 935, mapPack: false },
  { query: 'punjabi speaking counsellor fort st john', tier: 1, ceiling: 935, mapPack: false },
  { query: 'punjabi emdr therapy bc', tier: 1, ceiling: 930, mapPack: false },
  { query: 'punjabi couples counselling bc', tier: 1, ceiling: 925, mapPack: false },
  {
    query: 'punjabi therapist intergenerational family conflict',
    tier: 1, ceiling: 930, mapPack: false,
    page: '/for/south-asian-intergenerational-conflict',
    note:
      'Culturally specific, genuinely underserved, high intent. No directory filter covers it. ' +
      'Distinct from /for/first-gen-south-asian-adults on purpose: that page is about a person ' +
      '(identity, guilt, two selves) and this one is about a relationship that is not working. ' +
      'The obvious later edit is to merge them; do not.',
  },
  {
    query: 'mental health stigma south asian community bc',
    tier: 1, ceiling: 920, mapPack: false,
    page: '/for/first-gen-south-asian-adults',
    note:
      'Mapped rather than built, 2026-08-14. The existing page already opens on precisely this — ' +
      'that the barrier is usually the anticipated effort of explaining rather than stigma as such — ' +
      'and covers log kya kahenge, silence at home, and inherited migration strain. A second page ' +
      'would have competed with it for the same query while saying less. Pages that are true beat ' +
      'pages that are padded, which is the lesson the 37 retired city pages already taught.',
  },

  /* ---- Tier 2: winnable with authority --------------------------------- */
  {
    query: 'online counselling northern bc', tier: 2, ceiling: 870, mapPack: false,
    page: '/online-counselling/prince-george',
    note: 'Thin supply, documented gap, one competitor page covers the whole region.',
  },
  { query: 'emdr intensive bc', tier: 2, ceiling: 820, mapPack: false, note: 'Already a bookable service at $190/90min. Few practices offer true intensives.' },
  { query: 'punjabi counselling bc', tier: 2, ceiling: 780, mapPack: false, page: '/punjabi' },
  { query: 'punjabi speaking therapist surrey', tier: 2, ceiling: 780, mapPack: true, page: '/punjabi-counselling/surrey', note: 'Contested, and supply in Surrey is genuinely good — so the page does not argue scarcity, which would be transparently false there. It argues distance: no local office, no overlap with community networks. The head term will not be taken from a young domain; the winnable traffic is the privacy-shaped long tail behind it.' },
  { query: 'online counselling british columbia', tier: 2, ceiling: 760, mapPack: false, page: '/online-counselling' },
  { query: 'low cost counselling bc sliding scale', tier: 2, ceiling: 740, mapPack: false, note: 'Real access content, high volume, already offered.' },
  { query: 'waiting for therapy in bc', tier: 2, ceiling: 730, mapPack: false, page: '/guides/waiting-for-therapy-in-bc', note: 'Already indexed and ranking.' },
  { query: 'rcc vs psychologist vs social worker bc', tier: 2, ceiling: 720, mapPack: false, page: '/compare/rcc-vs-psychologist-vs-social-worker-bc' },
  { query: 'extended health coverage counselling bc', tier: 2, ceiling: 700, mapPack: false, page: '/resources/bc-extended-health-coverage-for-counselling' },

  /* ---- Tier 3: structurally capped -------------------------------------
   * Keep every one of these pages. They are built, they cost nothing to
   * maintain, and they carry real volume. Just do not read the score here as
   * a measure of whether the strategy is working. */
  { query: 'counselling prince george', tier: 3, ceiling: 720, mapPack: true, page: '/online-counselling/prince-george' },
  { query: 'counselling abbotsford', tier: 3, ceiling: 560, mapPack: true, page: '/online-counselling/abbotsford' },
  { query: 'counselling kelowna', tier: 3, ceiling: 500, mapPack: true, page: '/online-counselling/kelowna' },
  { query: 'counselling surrey', tier: 3, ceiling: 440, mapPack: true, page: '/online-counselling/surrey' },
  { query: 'counselling victoria bc', tier: 3, ceiling: 420, mapPack: true, page: '/online-counselling/victoria' },
  { query: 'counselling vancouver', tier: 3, ceiling: 290, mapPack: true, page: '/online-counselling/vancouver', note: 'Worst use of effort on the site. Lotus, Upstream, Jericho, Thrive all hold organic slots.' },
];

/** Targets with no page built yet -- the open inventory. */
export const gaps = () => targets.filter((t) => !t.page);

/** Weighted ceiling across the tracked set. */
export const weightedCeiling = (ts: Target[] = targets) =>
  ts.length ? Math.round(ts.reduce((s, t) => s + t.ceiling, 0) / ts.length) : 0;

export const byTier = (tier: Tier) => targets.filter((t) => t.tier === tier);

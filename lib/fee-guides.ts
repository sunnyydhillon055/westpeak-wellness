/* WHAT A SESSION TYPICALLY COSTS IN BC, BY WHO YOU SEE — read 1 Oct 2026.
 *
 * WHY THIS FILE EXISTS
 *
 * The BCACC and BCPA figures were typed twice: once on /pricing (BCACC_GUIDE,
 * BCPA_RATE) and once on the RCC vs psychologist comparison (BCACC_FEE_GUIDE,
 * BCPA_RECOMMENDED), each with a comment asking the next editor to change
 * both together. Two copies that must be changed together are one copy that
 * has not drifted yet. These are now the only place a market fee figure is
 * written, and /pricing, the comparison, the couples service page and the
 * generated cost FAQ on the city-service pages all read them.
 *
 * WHAT THESE ARE NOT
 *
 * They are the associations' published recommendations, not this practice's
 * prices and not a survey of what anyone actually charges. Every place that
 * prints one says whose recommendation it is. This practice's own fees come
 * only from lib/cliniko-catalog.ts (readCatalog / fallbackFee), never from
 * here, and this file imports nothing, so a client bundle that reaches it
 * carries a few strings and no catalogue.
 *
 * KEEPING THEM HONEST
 *
 * `range` is the published wording; `lowCents` and `highCents` are the same
 * figures as numbers, and scripts/price-drift.mjs fails the build if the two
 * disagree, if `readOn` is not a date, or if one of these ranges is typed as
 * a literal anywhere else in lib/, app/ or components/. If a guide is
 * reissued, re-read it at the source and change the figures and `readOn`
 * together.
 *
 *   BCACC Fee Guide 2026, per 50 min, individual: $140-$155 (less
 *     experienced), $155-$175 (more experienced), $175-$225 (specialised
 *     services). Couples and family: $155-$175, $175-$205.
 *   BCPA recommended rate: $245 an hour, effective 12 May 2025. A guideline,
 *     not a fee schedule; psychologists set their own.
 */

export type TypicalFee = {
  /** Who you would be paying, as the row reads on /pricing. */
  label: string;
  /** The figure as it is published: "$140 to $175", "$245", "$0". */
  range: string;
  /** The same figures in integer cents; null where nothing is published. */
  lowCents: number | null;
  highCents: number | null;
  /** What the figure is per: "per 50-minute session", "an hour". */
  unit: string;
  /** Whose recommendation it is, named as the source names itself. */
  source: string;
  sourceUrl?: string;
  /** ISO date the source was read. */
  readOn: string;
  /** One line of context printed beside the figure. */
  note?: string;
};

export const FEE_GUIDES_READ_ON = '2026-10-01';
/** The read date as prose: "1 October 2026". */
export const FEE_GUIDES_READ = '1 October 2026';

const BCACC_URL = 'https://bcacc.ca/bcacc-fee-guide-2026/';
const BCPA_URL = 'https://psychologists.bc.ca/professional-resources-hub/bcpa-recommended-rate-2025-2026';

export const BCACC_INDIVIDUAL: TypicalFee = {
  label: 'Registered Clinical Counsellor, individual',
  range: '$140 to $175',
  lowCents: 14000,
  highCents: 17500,
  unit: 'per 50-minute session',
  source: 'BCACC Fee Guide 2026',
  sourceUrl: BCACC_URL,
  readOn: FEE_GUIDES_READ_ON,
  note: 'Depending on experience.',
};

export const BCACC_SPECIALISED: TypicalFee = {
  label: 'Registered Clinical Counsellor, specialised services',
  range: '$175 to $225',
  lowCents: 17500,
  highCents: 22500,
  unit: 'per 50-minute session',
  source: 'BCACC Fee Guide 2026',
  sourceUrl: BCACC_URL,
  readOn: FEE_GUIDES_READ_ON,
};

export const BCACC_COUPLES_FAMILY: TypicalFee = {
  label: 'Couples and family counselling (RCC)',
  range: '$155 to $205',
  lowCents: 15500,
  highCents: 20500,
  unit: 'per 50-minute session',
  source: 'BCACC Fee Guide 2026',
  sourceUrl: BCACC_URL,
  readOn: FEE_GUIDES_READ_ON,
};

export const BCPA_PSYCHOLOGIST: TypicalFee = {
  label: 'Registered psychologist',
  range: '$245',
  lowCents: 24500,
  highCents: 24500,
  unit: 'an hour',
  source: 'BC Psychological Association recommended rate 2025–2026',
  sourceUrl: BCPA_URL,
  readOn: FEE_GUIDES_READ_ON,
  note: 'Effective 12 May 2025. A guideline, not a fee schedule; psychologists set their own fees.',
};

/** When BCPA's current rate took effect, as prose. */
export const BCPA_EFFECTIVE = '12 May 2025';

export const RSW_NO_GUIDE: TypicalFee = {
  label: 'Registered social worker',
  range: 'No published guideline',
  lowCents: null,
  highCents: null,
  unit: '',
  source: 'No BC association publishes a recommended rate',
  readOn: FEE_GUIDES_READ_ON,
  note: 'Set by each practitioner; ask for the fee before booking.',
};

export const FREE_ROUTES: TypicalFee = {
  label: 'Free routes: EFAP, health authority services, Foundry, Here2Talk',
  range: '$0',
  lowCents: 0,
  highCents: 0,
  unit: '',
  source: 'Free at the point of use',
  readOn: FEE_GUIDES_READ_ON,
  note: 'Eligibility and waits vary; the low-cost counselling page sets them out.',
};

/** The /pricing table, in display order. This practice's row is added there, from the catalogue. */
export const TYPICAL_BC_FEES: TypicalFee[] = [
  BCACC_INDIVIDUAL,
  BCACC_COUPLES_FAMILY,
  BCPA_PSYCHOLOGIST,
  RSW_NO_GUIDE,
  FREE_ROUTES,
];

/* The association range a service's cost answer leads with. Individual and
   couples work map onto BCACC's two tables; anything else (an EMDR intensive
   is 90 minutes, not 50) has no comparable published figure and gets none,
   rather than a range for a different length of session. */
export const GUIDE_FOR_SERVICE: Record<string, TypicalFee | undefined> = {
  'individual-therapy': BCACC_INDIVIDUAL,
  'couples-therapy': BCACC_COUPLES_FAMILY,
};

/** "$140 to $175 per 50-minute session" */
export const guidePhrase = (g: TypicalFee) => (g.unit ? `${g.range} ${g.unit}` : g.range);

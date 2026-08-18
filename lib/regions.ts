import type { Province } from './crisis';

/* INTERPROVINCIAL EXPANSION — the model, and the gates.
 *
 * ============================================================================
 * BOTH PROVINCES ARE GATED. THEY ARE GATED FOR DIFFERENT REASONS.
 * ============================================================================
 *
 * Counselling is regulated provincially, and the service is deemed to be
 * delivered where the CLIENT is sitting, not where the counsellor is. A
 * BC-registered RCC seeing someone in Calgary by video is practising in
 * Alberta. That single fact decides what may be published.
 *
 * ALBERTA — GATED ON INSURANCE, not on regulation.
 *
 *   Regulation is genuinely clear. Counselling therapy is not a regulated
 *   profession in Alberta; the March 2024 announcement placing counselling
 *   therapists under the College of Alberta Psychologists has no proclamation
 *   date, CAP is awaiting provincial funding, and a workforce advisory
 *   committee reports through Fall 2026. Verified 17 Aug 2026.
 *
 *   What is NOT clear is cover. The practice's professional liability policy
 *   does not extend outside British Columbia — confirmed by the owner on
 *   17 Aug 2026, hours after these pages first went live. They were taken down
 *   the same day.
 *
 *   A live Alberta page is an advertisement, and an advertisement produces
 *   bookings. An uninsured session with a distressed stranger in another
 *   province is not a marketing risk; it is the risk the whole profession
 *   carries insurance for. So Alberta publishes when there is cover — either
 *   the policy is extended, or an insured clinician who can take Alberta
 *   clients is hired. Either unlocks it. See ALBERTA_LAUNCH_CHECKLIST.md.
 *
 * ONTARIO — GATED ON REGISTRATION.
 *
 *   Psychotherapy is a controlled act in Ontario. CRPO permits an
 *   out-of-province regulated therapist to see the occasional Ontario client,
 *   but that allowance is explicitly conditional on NOT advertising or
 *   promoting services in Ontario. Publishing SEO pages targeting Toronto,
 *   Brampton and Oshawa IS advertising, and would remove the exemption — as
 *   well as breaching BCACC advertising standards, which require advertising
 *   not to mislead about services a registrant may lawfully provide.
 *
 *   Ontario needs CRPO registration AND insurance. Two gates, not one.
 *   See ONTARIO_LAUNCH_CHECKLIST.md.
 *
 * DO NOT flip either default without the corresponding checklist complete.
 * `node scripts/expansion-verify.mjs` fails the run if a gated province leaks.
 * ============================================================================
 */

/* Read once, per province. A string comparison rather than a truthiness check,
 * so an unset variable, an empty string, "false" and "0" all mean the same
 * thing: not live. The safe state has to be the default state. */
export const ALBERTA_LIVE = process.env.NEXT_PUBLIC_ALBERTA_LIVE === 'true';
export const ONTARIO_LIVE = process.env.NEXT_PUBLIC_ONTARIO_LIVE === 'true';

export type RegionStatus = 'published' | 'gated';

export type ProvinceConfig = {
  code: Province;
  name: string;
  /** URL segment: /alberta/..., /ontario/... */
  slug: string;
  status: RegionStatus;
  /** Why it is gated, in one line, for the docs and the log. */
  gateReason?: string;
  /** Timezone shown to a client in this province. */
  tz: string;
  tzLabel: string;
  /** The public health plan, and what it does not cover. */
  publicPlan: string;
};

export const PROVINCES: ProvinceConfig[] = [
  {
    code: 'AB',
    name: 'Alberta',
    slug: 'alberta',
    status: 'gated',
    gateReason:
      'Professional liability insurance does not extend outside British Columbia. Unlocks when cover exists — policy extended, or an insured clinician hired.',
    tz: 'America/Edmonton',
    tzLabel: 'Mountain Time',
    publicPlan: 'Alberta Health Care Insurance Plan',
  },
  {
    code: 'ON',
    name: 'Ontario',
    slug: 'ontario',
    status: 'gated',
    gateReason:
      'Psychotherapy is a controlled act; advertising in Ontario removes the CRPO out-of-province allowance. Needs CRPO registration AND insurance.',
    tz: 'America/Toronto',
    tzLabel: 'Eastern Time',
    publicPlan: 'OHIP',
  },
];

export const getProvince = (slug: string) => PROVINCES.find((p) => p.slug === slug);

/** Per-province flag. Explicit rather than clever: a lookup table means adding a
 *  province cannot accidentally inherit another province's permission. */
const LIVE_FLAG: Record<Province, boolean> = {
  BC: true,
  AB: ALBERTA_LIVE,
  ON: ONTARIO_LIVE,
};

/** Whether a province's pages may render at all in this deployment. */
export const provinceLive = (p: ProvinceConfig) =>
  p.status === 'published' || LIVE_FLAG[p.code] === true;

/** Whether a province's pages may appear in the sitemap and be indexed. */
export const provinceIndexable = provinceLive;

/* The designation line. It appears in visible copy on EVERY out-of-province
 * page, because a reader in Calgary is entitled to know, without hunting, which
 * regulator stands behind the person they are about to talk to — and because
 * saying it plainly is what keeps the page accurate rather than merely legal. */
export const DESIGNATION =
  'Sessions are provided by a Registered Clinical Counsellor (RCC) registered with the BC Association of Clinical Counsellors.';

/* Said on every Alberta page. Accurate, neutral, and more useful to a reader
 * than a claim of local registration would be. */
export const AB_REGULATORY_NOTE =
  'Counselling therapy is not currently a regulated profession in Alberta, so no Alberta college registers counsellors. That makes checking a counsellor’s home-province registration more important, not less — this practice is registered in British Columbia and the registration is public and verifiable.';

export const ON_REGULATORY_NOTE =
  'Psychotherapy is a controlled act in Ontario, regulated by the College of Registered Psychotherapists of Ontario.';

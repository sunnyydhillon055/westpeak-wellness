import type { Province } from './crisis';

/* INTERPROVINCIAL EXPANSION — the model, and the gate.
 *
 * ============================================================================
 * THE REGULATORY POSITION, WHICH IS THE WHOLE REASON THIS FILE EXISTS
 * ============================================================================
 *
 * Counselling is regulated provincially, and the service is deemed to be
 * delivered where the CLIENT is sitting, not where the counsellor is. A
 * BC-registered RCC seeing someone in Toronto by video is practising in
 * Ontario. That single fact decides what may be published.
 *
 * ALBERTA — CLEAR.
 * Counselling therapy is not a regulated profession in Alberta. The March 2024
 * announcement that counselling therapists will come under the College of
 * Alberta Psychologists has no proclamation date; as of August 2026 CAP is
 * still awaiting provincial funding to develop standards and the Mental Health
 * and Addiction Workforce Advisory Committee reports through Fall 2026.
 * Verified 17 Aug 2026. Alberta pages may be built, published and advertised.
 *
 * Two things Alberta still forbids:
 *   - the titles "psychologist" and "psychological" are protected. Never used.
 *   - nothing may imply Alberta registration or an Alberta college.
 *
 * ONTARIO — GATED.
 * Psychotherapy is a controlled act in Ontario. CRPO permits an out-of-province
 * regulated therapist to see the occasional Ontario client, but that allowance
 * is explicitly conditional on NOT advertising or promoting services in
 * Ontario. Publishing thirty SEO pages targeting Toronto, Brampton and Oshawa
 * IS advertising in Ontario, and would remove the exemption the practice would
 * otherwise rely on — as well as breaching BCACC advertising standards, which
 * require advertising not to mislead about services a registrant may lawfully
 * provide.
 *
 * So the Ontario pages exist, fully written, and do not publish. They are
 * noindex, absent from the sitemap, and rendered only when
 * NEXT_PUBLIC_ONTARIO_LIVE === 'true'. The unlock is CRPO registration, which a
 * BC resident can hold — CRPO cannot impose a residency requirement.
 *
 * DO NOT flip the default. See ONTARIO_LAUNCH_CHECKLIST.md.
 * ============================================================================
 */

/* Read once. A string comparison rather than a truthiness check, so that an
 * empty string, "false", "0" or an unset variable all mean the same thing:
 * not live. The safe state must be the default state. */
export const ONTARIO_LIVE = process.env.NEXT_PUBLIC_ONTARIO_LIVE === 'true';

export type RegionStatus = 'published' | 'gated';

export type ProvinceConfig = {
  code: Province;
  name: string;
  /** URL segment: /alberta/..., /ontario/... */
  slug: string;
  status: RegionStatus;
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
    status: 'published',
    tz: 'America/Edmonton',
    tzLabel: 'Mountain Time',
    publicPlan: 'Alberta Health Care Insurance Plan',
  },
  {
    code: 'ON',
    name: 'Ontario',
    slug: 'ontario',
    status: 'gated',
    tz: 'America/Toronto',
    tzLabel: 'Eastern Time',
    publicPlan: 'OHIP',
  },
];

export const getProvince = (slug: string) => PROVINCES.find((p) => p.slug === slug);

/** Whether a province's pages may render at all in this deployment. */
export const provinceLive = (p: ProvinceConfig) => p.status === 'published' || ONTARIO_LIVE;

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

/* Province-correct crisis resources.
 *
 * A BC crisis line on an Alberta page is not an SEO detail, it is a safety
 * failure. Somebody in distress does not check which province a phone number
 * belongs to before dialling it, and a number that rings out or routes to the
 * wrong province at 3am is worse than no number, because it costs the attempt.
 *
 * So the resources are keyed by province and every regional page renders the
 * block for the province the reader is actually in.
 *
 * VERIFICATION
 *
 * Every number below was checked against the operator's own page on
 * 17 August 2026. Re-verify before any future province is added, and re-check
 * these annually — distress lines are merged and renumbered more often than
 * you would expect.
 *
 *   9-8-8                 verified — national, call or text, 24/7
 *   911                   verified — immediate danger, all provinces
 *   811 (AB)              verified — Health Link Alberta
 *   1-877-303-2642 (AB)   verified — AHS Mental Health Help Line, 24/7
 *   403-266-4357 (Cgy)    verified — Distress Centre Calgary, 24/7
 *   780-482-4357 (Edm)    verified — CMHA Edmonton Distress Line, 24/7
 *   780-424-2424 (Edm)    verified — Access 24/7, Edmonton Zone
 *   1-866-531-2600 (ON)   ConnexOntario, 24/7
 *   310-6789 (BC)         existing — BC Mental Health Support Line, no area code
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * No number that could not be verified against the operator's own site. A
 * plausible-looking wrong number is the failure mode this file exists to
 * prevent, so an unverified line is omitted and the reader falls through to
 * 9-8-8, which always works.
 */

export type CrisisLine = {
  name: string;
  number: string;
  /** Shown under the number. Say when it is open and what it actually does. */
  detail: string;
  /** `tel:` payload. Digits only, plus a leading + where it helps. */
  dial: string;
};

export type Province = 'BC' | 'AB' | 'ON';

export const PROVINCE_NAME: Record<Province, string> = {
  BC: 'British Columbia',
  AB: 'Alberta',
  ON: 'Ontario',
};

/* Shown first everywhere, because they are the two that never depend on
 * knowing where you are. */
const NATIONAL: CrisisLine[] = [
  {
    name: 'Emergency services',
    number: '911',
    dial: '911',
    detail: 'If you or someone else is in immediate danger.',
  },
  {
    name: 'Suicide Crisis Helpline',
    number: '9-8-8',
    dial: '988',
    detail: 'Call or text, any hour, anywhere in Canada. English and French.',
  },
];

const BY_PROVINCE: Record<Province, CrisisLine[]> = {
  BC: [
    {
      name: 'BC Mental Health Support Line',
      number: '310-6789',
      dial: '3106789',
      detail: 'No area code needed, anywhere in BC. 24/7 emotional support and referral.',
    },
    {
      name: 'HealthLink BC',
      number: '8-1-1',
      dial: '811',
      detail: 'Free health advice from a registered nurse, any hour.',
    },
  ],
  AB: [
    {
      name: 'Alberta Mental Health Help Line',
      number: '1-877-303-2642',
      dial: '+18773032642',
      detail: 'Province-wide, 24/7. Confidential short-term crisis support, information and referral.',
    },
    {
      name: 'Health Link Alberta',
      number: '8-1-1',
      dial: '811',
      detail: 'Free health advice from a nurse, any hour, anywhere in Alberta.',
    },
  ],
  ON: [
    {
      name: 'ConnexOntario',
      number: '1-866-531-2600',
      dial: '+18665312600',
      detail: 'Free and confidential, 24/7. Information and referral for mental health, addiction and problem gambling services in Ontario.',
    },
  ],
};

/* City-level lines, only where a local service genuinely adds something the
 * province-wide line does not — usually in-person crisis support. */
const BY_CITY: Record<string, CrisisLine[]> = {
  calgary: [
    {
      name: 'Distress Centre Calgary',
      number: '403-266-4357',
      dial: '+14032664357',
      detail: '24/7 crisis line, with online chat and free in-person crisis counselling appointments.',
    },
  ],
  edmonton: [
    {
      name: 'CMHA Edmonton Distress Line',
      number: '780-482-4357',
      dial: '+17804824357',
      detail: '24/7 confidential emotional support and crisis intervention, with online chat at set hours.',
    },
    {
      name: 'Access 24/7',
      number: '780-424-2424',
      dial: '+17804242424',
      detail: 'Edmonton Zone. Assessment, referral and urgent mental-health and addiction support, any hour.',
    },
  ],
};

/**
 * The crisis block for a page.
 *
 * National first, then province, then city. That order is deliberate: the two
 * numbers that always work come before the ones that depend on being in the
 * right place, so a reader who stops reading after two lines still has
 * something that works.
 */
export function crisisFor(province: Province, citySlug?: string): CrisisLine[] {
  return [
    ...NATIONAL,
    ...BY_PROVINCE[province],
    ...(citySlug ? BY_CITY[citySlug] ?? [] : []),
  ];
}

/** ISO date these numbers were last checked against the operator's own site. */
export const CRISIS_VERIFIED = '2026-08-17';

import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
import { services } from '@/lib/services';
import { PROVINCE_NAME, type Province } from '@/lib/crisis';

/* WHO A REFERRED PERSON WOULD ACTUALLY SEE — for the /refer pages, 1 Oct 2026.
 *
 * Built from the roster, never typed. The GP sheet named nobody and said
 * "adults and couples" a month after family counselling and teens arrived;
 * a printed sheet is the one page on the site that cannot be corrected after
 * it leaves the building, so it has to be right the day it is printed.
 *
 * Deliberately left out: registration numbers (those belong on the profile,
 * where a stranger can check them against the register) and anybody who is
 * not accepting new clients — which on this roster includes the founder.
 * Server-only: imported by server components, never by 'use client' code. */

export type AcceptingCounsellor = {
  slug: string;
  name: string;
  /** "Camille Granda, RCC, CCC" */
  letters: string;
  languages: string[];
  /** "British Columbia and Alberta" or "Anywhere in Canada". */
  area: string;
  /** The first three focus labels, in the counsellor's own order. */
  focus: string[];
  /** Service names this counsellor offers, from lib/services.ts. */
  services: string[];
  profilePath: string;
  bookPath: string;
};

const areaOf = (p: Pick<Practitioner, 'provinces' | 'reach'>) =>
  p.reach === 'canada'
    ? 'Anywhere in Canada'
    : p.provinces.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ');

export function acceptingFrom(roster: readonly Practitioner[]): AcceptingCounsellor[] {
  return roster
    .filter((p) => p.acceptingNewClients)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      letters: withLetters(p),
      languages: p.languages.map((l) => l.name),
      area: areaOf(p),
      focus: p.focus.slice(0, 3).map((f) => f.label),
      services: p.services
        .map((s) => services.find((x) => x.slug === s)?.name)
        .filter((n): n is string => Boolean(n)),
      profilePath: `/practitioners/${p.slug}`,
      bookPath: `/book?with=${p.slug}`,
    }));
}

/** The accepting roster as the pages read it today (insurance gate applied). */
export const acceptingCounsellors = (): AcceptingCounsellor[] => acceptingFrom(practitioners);

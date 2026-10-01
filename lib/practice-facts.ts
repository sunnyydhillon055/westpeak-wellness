import { PROVINCE_NAME, type Province } from '@/lib/crisis';

/* MACHINE-READABLE FACTS ABOUT ONE COUNSELLOR, DERIVED ONCE.
 *
 * llms.txt, llms-full.txt and ai.json each said where a counsellor sees
 * clients in their own words, and on 1 Oct 2026 llms.txt still said "BC and
 * Alberta" for the counsellor whose roster record says `reach: 'canada'`
 * (the owner's instruction of 8 Sep 2026). These helpers read the roster
 * fields, so the three files cannot drift from it, or from each other.
 *
 * Deliberately no registration numbers here: those belong on the counsellor's
 * own profile page and nowhere else. Only the letters are exposed. */

type Reachable = { provinces: string[]; reach?: 'canada' };

const provinceList = (codes: string[]) =>
  codes.map((c) => PROVINCE_NAME[c as Province] ?? c).join(' and ');

/** "anywhere in Canada", or "British Columbia and Alberta". */
export const reachPhrase = (p: Reachable) =>
  p.reach === 'canada' ? 'anywhere in Canada' : provinceList(p.provinces);

/** "anywhere in Canada" / "in British Columbia" — reads after "sees clients". */
export const reachClause = (p: Reachable) =>
  p.reach === 'canada' ? 'located anywhere in Canada' : `located in ${provinceList(p.provinces)}`;

/** The booking URL that pre-selects this counsellor on /book. */
export const bookingPathFor = (slug: string) => `/book?with=${encodeURIComponent(slug)}`;

/** Practice-wide reach: the union of every accepting counsellor's. */
export const practiceReach = (accepting: (Reachable & { name: string })[]) => {
  const narrow = [...new Set(accepting.filter((p) => p.reach !== 'canada').flatMap((p) => p.provinces))];
  const wide = accepting.filter((p) => p.reach === 'canada').map((p) => p.name.split(' ')[0]);
  if (!wide.length) return provinceList(narrow);
  if (!narrow.length) return 'anywhere in Canada';
  return `${provinceList(narrow)} with every counsellor, and anywhere in Canada with ${wide.join(' or ')}`;
};

/* Language services are offered by whoever works in the language; every other
   service by whoever lists it in her roster `services`. */
const LANGUAGE_SERVICE: Record<string, string> = {
  'punjabi-counselling': 'pa',
  'tagalog-counselling': 'tl',
};

export const offeredBy = <T extends { services: string[]; languages: { tag: string }[] }>(
  serviceSlug: string,
  roster: T[],
): T[] => {
  const lang = LANGUAGE_SERVICE[serviceSlug];
  return roster.filter((p) =>
    p.services.includes(serviceSlug) || (lang !== undefined && p.languages.some((l) => l.tag === lang)));
};

/** Person.areaServed from the roster: a Country for a Canada-wide reach,
 *  otherwise one State per province. */
export const personAreaServed = (p: Reachable) => {
  if (p.reach === 'canada') return { '@type': 'Country', name: 'Canada' };
  const states = p.provinces.map((c) => ({ '@type': 'State', name: PROVINCE_NAME[c as Province] ?? c }));
  return states.length === 1 ? states[0] : states;
};

/* WHERE A CLIENT CAN BE, AS ONE SENTENCE FOR PAGE COPY — 1 Oct 2026.
   "Anywhere in Canada is possible with Camille Granda" was typed into the
   international-students FAQ, and would have kept promising Canada-wide
   reach after the insurance gate in lib/practitioners.ts withdrew it. Copy
   that says where sessions are possible is built here from the accepting
   roster instead, so it changes the day the roster does.
   test/reach-copy.test.mts fails on the typed form anywhere else in lib/. */
export const reachSentence = (accepting: (Reachable & { name: string })[]) => {
  const r = practiceReach(accepting);
  if (!r) return '';
  return r.startsWith('anywhere') ? `Sessions are possible ${r}.` : `Sessions are possible in ${r}.`;
};
/* THE LIMITS OF CONFIDENTIALITY, STATED ONCE — 1 Oct 2026.
 *
 * The Punjabi and Tagalog service pages said "the only limits are risk of
 * serious harm and a court order", leaving out a child or vulnerable adult at
 * risk, while /privacy, /standards and the individual-therapy FAQ list all
 * three. Those two pages are written for the readers most worried about who
 * might find out, which is exactly where an incomplete list misleads. Every
 * page that states the limits in a sentence reads them from here, and a test
 * fails on "only limits are" without the child. Reads after "the only limits
 * are" or "except for". */
export const CONFIDENTIALITY_LIMITS =
  'risk of serious harm to you or someone else, a child or vulnerable adult at risk of abuse or neglect, or a court order';

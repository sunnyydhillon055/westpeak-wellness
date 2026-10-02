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

/* IS A VIDEO SESSION COVERED THE SAME AS IN PERSON? — 1 Oct 2026 (item 274).
 *
 * The site answered this in nine places and three ways: "Nearly all BC
 * extended health plans … reimburse virtual sessions on the same terms"
 * (lib/guides.ts), "generally treat video sessions the same" (lib/faq.ts),
 * and six copies of "Many … treat virtual sessions on the same terms" on the
 * Punjabi region pages. Whether a plan pays for a video session is the
 * plan's answer, like every other coverage question. One sentence, read from
 * here, with the question to ask the plan. */
export const ONLINE_COVERAGE =
  'Plans that list an RCC usually reimburse a video session on the same terms as in person, but this depends on the plan. Ask: are virtual sessions with an RCC eligible, and on the same maximum?';

/* WHO FINDS OUT, ANSWERED ONCE — 2 Oct 2026 (item 358).
 *
 * "Will my employer find out?" was answered on three audience pages in their
 * own words and nowhere a person books or pays: /pricing said "employer" 0
 * times, /faq said nothing about notes. The readers who worry most about it
 * arrive from the workplace and stress-leave guides. Every sentence below is
 * a claim /privacy (lib/policies.ts) already makes: written consent before
 * anything goes to an employer, family, doctor or insurer; a receipt confirms
 * that a session happened, not what was in it; an RCC does not diagnose;
 * notes are brief working notes held in Cliniko's Canadian region; sessions
 * are never recorded. What an insurer tells a plan sponsor is the plan's
 * business, so the answer sends the reader to the plan rather than guessing.
 * /faq, /book and /pricing read these, and so do the coverage-checklist and
 * third nurture emails (item 393), so the page and the mail cannot differ. */
const NOTHING_WITHOUT_CONSENT =
  'Nothing goes to your employer, your family, your doctor or your insurer without your written consent.';
const RECEIPT_SHOWS =
  'A receipt you claim with shows that a session took place, the fee and the counsellor’s RCC designation, not what was said; an RCC does not diagnose, so there is no diagnosis on it either.';
const MAIL_GOES_TO_YOU =
  'Receipts and booking emails go only to the email address you give, so a personal address keeps them out of a work inbox.';
const NOTES_KEPT =
  'Session notes are brief working notes, not transcripts, held in Cliniko’s Canadian region, and sessions are never recorded.';
const PLAN_SPONSOR =
  'What an insurer reports to the employer that sponsors the plan is set by the plan, not by this practice, so if that matters to you, ask the plan.';

/** The full answer: /faq's "Will my employer, insurer or family find out?"
 *  and the matching disclosure on /book. */
export const WHO_FINDS_OUT = [
  NOTHING_WITHOUT_CONSENT,
  RECEIPT_SHOWS,
  MAIL_GOES_TO_YOU,
  NOTES_KEPT,
  PLAN_SPONSOR,
  `Confidentiality has legal limits, which are ${CONFIDENTIALITY_LIMITS}.`,
].join(' ');

/** One sentence for where money and claims are the subject: /pricing's
 *  claiming section, the coverage-checklist email and nurture email 3. */
export const WHO_SEES_A_CLAIM =
  'The receipt you submit shows that a session took place, the fee and the counsellor’s RCC designation, not what was said, and nothing goes to an employer from this practice without your written consent.';

/* THE CAMERA CAN STAY OFF — 2 Oct 2026 (item 392). /accessibility has said
 * it since August; /faq and /book said "a device with a camera", which reads
 * as a requirement to the anxious first-timer most likely to hesitate over
 * being watched. One sentence, read by /accessibility (lib/policies.ts),
 * /faq, /book and the confirmation and reminder emails. */
export const CAMERA_OPTIONAL = 'You are never required to be on camera to be in a session.';

/* ?with= A COUNSELLOR WHO IS NOT TAKING CLIENTS — 2 Oct 2026 (item 361).
 *
 * /book printed "<first name> is not taking new clients at the moment" for
 * any roster slug in ?with=, which put the founder's name on /book whenever
 * an old link carried her slug. The line now names nobody who is not
 * accepting; it names only the counsellors who are. */
export const notTakingLine = (acceptingFirstNames: string[], fallbackFirst?: string): string => {
  const head = 'That counsellor is not taking new clients at the moment.';
  if (acceptingFirstNames.length > 1) {
    return `${head} ${acceptingFirstNames.join(' and ')} are; choose above, or pick either on the calendar below.`;
  }
  if (fallbackFirst) return `${head} ${fallbackFirst} is, and the consultation below is with her.`;
  return head;
};

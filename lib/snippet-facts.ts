import type { Catalog } from '@/lib/cliniko-catalog';
import type { Practitioner } from '@/lib/practitioners';
import { counsellorsFor, feeFor, languagePhrase, listOf, type Fee } from '@/lib/city-service-page';

/* WHAT A SEARCH RESULT SAYS BEFORE ANYONE CLICKS — 1 Oct 2026.
 *
 * WHY THIS FILE EXISTS
 *
 * The money pages that reach page one were taking no clicks: /pricing 24
 * impressions at 4.38, individual therapy 25 at 5.36, Punjabi Vancouver 83
 * at 9.01, Prince George 42 at 9.83, the two profiles at 7.7-8.1. None of
 * their descriptions said what a session costs or who it is with, which are
 * the two things a person choosing between results is looking for. The 20
 * Aug description rewrites covered informational pages only.
 *
 * So the tail of those descriptions is generated here:
 *
 *   {fee} per {minutes}-min session · free 30-min consult · {names}
 *
 * The fee is read from the Cliniko catalogue (readCatalog, falling back to
 * FALLBACK_CATALOG, which scripts/price-drift.mjs checks), never typed; this
 * file holds no dollar figure and price-drift fails if one is added. The names
 * are the roster's, filtered to counsellors accepting new clients, so the
 * founder is never named by this file, by the same flag that keeps her off
 * every other money page. "From" is used wherever the page spans more than one
 * price, because a bare fee beside a list of services reads as the price of
 * each.
 *
 * LENGTH. The SEO gate measures the description as it sits in the HTML, where
 * React writes & as &amp; and ' as &#x27;. metaLength counts the same way.
 * scripts/seo-audit.mjs refuses a money-page description carrying a fee that
 * runs past SNIPPET_MAX. A description is never cut: if the page's own lead
 * and the facts do not fit together, the lead's first sentence is tried, and
 * failing that the lead stands alone and the facts are left off.
 *
 * Nothing here says when anyone is available: hours are not published
 * anywhere (DECISIONS, 28 Sep 2026). Coverage is not mentioned at all, so it
 * cannot be overstated. */

export const SNIPPET_MAX = 155;

/** Length as the SEO gate reads it: the attribute as React serialises it. */
export const metaLength = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;').length;

/** "{fee} per {minutes}-min session · free 30-min consult · {names}", names joined with "or". */
export function snippetFacts(args: { fee: Fee; from?: boolean; names?: string[] }): string {
  const { fee, from, names } = args;
  const parts = [`${from ? 'From ' : ''}${fee.fee} per ${fee.minutes}-min session`, 'free 30-min consult'];
  if (names?.length) parts.push(listOf(names, 'or'));
  return parts.join(' · ');
}

/** The first sentence of a typed lead, or the whole lead if it has one. */
/* An abbreviation is not a sentence end: "Fort St. John" cut the Fort St.
   John hub description to "Online counselling for Fort St." (1 Oct 2026). */
export const firstSentence = (s: string) => s.match(/^.*?(?<!\b(?:St|Mt|Ft|Dr|Mr|Ms|Mrs|vs|e\.g|i\.e))[.!?](?=\s|$)/)?.[0] ?? s;

/* The page's own lead, then the facts. Whole sentences only. */
export function withSnippet(lead: string, facts: string | undefined, max = SNIPPET_MAX): string {
  if (!facts) return lead;
  const tail = /[.!?]$/.test(facts) ? facts : `${facts}.`;
  const tries = [`${lead} ${tail}`, `${firstSentence(lead)} ${tail}`];
  return tries.find((t) => metaLength(t) <= max) ?? lead;
}

/* The lowest fee among the services given, with `from` set when they do not
   all cost the same. Services with no priced Cliniko type (family
   counselling, the language pages) are skipped rather than guessed. */
export function lowestFee(catalog: Catalog, services: string[]): { fee: Fee; from: boolean } | undefined {
  const fees = services
    .map((s) => feeFor(catalog, { bookingService: s }))
    .filter((f): f is Fee => !!f);
  if (!fees.length) return undefined;
  const fee = fees.reduce((a, b) => (b.cents < a.cents ? b : a));
  return { fee, from: new Set(fees.map((f) => f.cents)).size > 1 };
}

const accepting = (ps: Practitioner[]) => ps.filter((p) => p.acceptingNewClients);
const namesOf = (ps: Practitioner[]) => accepting(ps).map((p) => p.name);

/* The practice-wide line: /pricing and the city hubs. Individual work is the
   lowest fee and every accepting counsellor offers it, so the line reads
   "From $X" and names whoever is given. */
export function practiceSnippet(catalog: Catalog, counsellors: Practitioner[]): string | undefined {
  const low = lowestFee(catalog, ['individual-therapy', 'couples-therapy', 'emdr-therapy']);
  return low ? snippetFacts({ ...low, names: namesOf(counsellors) }) : undefined;
}

/* One service, the counsellors who would take it. */
export function serviceSnippet(catalog: Catalog, bookingService: string, counsellors: Practitioner[]): string | undefined {
  const fee = feeFor(catalog, { bookingService });
  return fee ? snippetFacts({ fee, names: namesOf(counsellors) }) : undefined;
}

/* A counsellor's own profile: her lowest fee across what she offers, and no
   name, because the description already opens with it. Nothing for anyone
   not taking new clients: a fee line under a counsellor who cannot be booked
   is an offer nobody can take up. */
export function profileSnippet(catalog: Catalog, p: Practitioner): string | undefined {
  if (!p.acceptingNewClients) return undefined;
  const low = lowestFee(catalog, p.services);
  return low ? snippetFacts(low) : undefined;
}

/* THE LANGUAGES EACH KIND OF WORK IS OFFERED IN, PRACTICE-WIDE.
 *
 * The site-wide default description said "EMDR, trauma, anxiety, depression,
 * and couples therapy in English, Punjabi or Tagalog", and the organisation
 * node said the same, while nobody offering couples or EMDR works in Punjabi.
 * Composed from counsellorsFor, the same rule the city-service pages use. */
export function offeringLanguages() {
  return {
    individual: languagePhrase(counsellorsFor({ bookingService: 'individual-therapy' })),
    couples: languagePhrase(counsellorsFor({ bookingService: 'couples-therapy' })),
    emdr: languagePhrase(counsellorsFor({ bookingService: 'emdr-therapy' })),
  };
}

/* "couples and EMDR therapy in English or Tagalog", or two clauses when the
   two differ. Empty when they match the individual languages, because then
   the first clause already said it. */
export function pairedLanguageClause(l = offeringLanguages()): string {
  if (l.couples === l.individual && l.emdr === l.individual) return '';
  if (l.couples === l.emdr) return `couples and EMDR therapy in ${l.couples}`;
  return `couples therapy in ${l.couples}, EMDR in ${l.emdr}`;
}

const firstFit = (candidates: string[], max: number) =>
  candidates.find((c) => metaLength(c) <= max) ?? candidates[candidates.length - 1];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The site-wide default <meta name="description">. */
export function sitewideDescription(max = SNIPPET_MAX): string {
  const l = offeringLanguages();
  const paired = pairedLanguageClause(l);
  const lead = 'Online counselling across BC with a Registered Clinical Counsellor';
  if (!paired) {
    return firstFit([
      `${lead}: anxiety, trauma, depression, couples and EMDR therapy in ${l.individual}.`,
      `${lead}, in ${l.individual}.`,
    ], max);
  }
  return firstFit([
    `${lead} for anxiety, trauma and depression in ${l.individual}. ${cap(paired)}.`,
    `${lead}, in ${l.individual}. ${cap(paired)}.`,
    `${lead}, in ${l.individual}.`,
  ], max);
}

import { money, type Catalog } from '@/lib/cliniko-catalog';
import { site } from '@/lib/site';
import {
  insuranceStatus, type Credential, type Practitioner,
} from '@/lib/practitioners';

/* THE FACT STRIP ON A COUNSELLOR'S PROFILE — 1 Oct 2026.
 *
 * Savneet's profile had no fee, no free-consultation line and nothing that
 * said what she does not offer; the roster held insurance for both
 * counsellors and no page showed it. Everything here is computed from the
 * roster and the Cliniko catalogue, so the strip cannot say something the
 * data does not: a service the catalogue does not price is left out rather
 * than guessed, an insurance line shows only while the policy is current, and
 * "not offered" is the practice's services she lacks, not a sentence anyone
 * typed. Server-side only: this imports the roster, which never enters the
 * browser bundle (see lib/roster-nav.ts). */

/* The practice's four clinical services, and the Cliniko appointment types
   each is billed as. Weekly EMDR is billed as an individual session and the
   intensive separately, as lib/services.ts says in prose. Family counselling
   has no appointment type of its own, so it carries no fee here. */
export const OFFERINGS: readonly {
  service: string;
  label: string;
  billedAs: readonly { name: string; as?: string }[];
}[] = [
  { service: 'individual-therapy', label: 'individual counselling', billedAs: [{ name: 'Individual Counselling' }] },
  { service: 'couples-therapy', label: 'couples counselling', billedAs: [{ name: 'Couples Counselling' }, { name: 'Couples Extended', as: 'extended' }] },
  { service: 'emdr-therapy', label: 'EMDR', billedAs: [{ name: 'Individual Counselling' }, { name: 'EMDR Intensive', as: 'intensive' }] },
  { service: 'family-counselling', label: 'family counselling', billedAs: [] },
];

export type FeeLine = { label: string; service: string; parts: { fee: string; minutes: number; as?: string; cents: number }[] };

const find = (c: Catalog, name: string) => c.items.find((i) => i.name.toLowerCase() === name.toLowerCase());

/** The fee for each service she offers, read from the catalogue. A service
 *  whose types the catalogue does not hold (or prices at zero) is left out. */
export function feeLines(p: Pick<Practitioner, 'services'>, catalog: Catalog): FeeLine[] {
  return OFFERINGS.filter((o) => p.services.includes(o.service)).flatMap((o) => {
    const parts = o.billedAs.flatMap((b) => {
      const item = find(catalog, b.name);
      return item && item.cents > 0 ? [{ fee: money(item.cents), minutes: item.minutes, as: b.as, cents: item.cents }] : [];
    });
    return parts.length ? [{ label: o.label, service: o.service, parts }] : [];
  });
}

/** "$175 for 50 minutes, or extended $340 for 110 minutes" */
export const feePhrase = (l: FeeLine): string =>
  l.parts.map((x, i) => `${i ? 'or ' : ''}${x.as ? `${x.as} ` : ''}${x.fee} for ${x.minutes} minutes`).join(', ');

/** "First 15-minute consultation free", from the catalogue's own free type. */
export function consultLine(catalog: Catalog): string | null {
  const c = find(catalog, 'Initial Consultation');
  return c && c.cents === 0 ? `First ${c.minutes}-minute consultation free` : null;
}

/** Where she may see clients, from the gated roster's reach. Online only,
 *  because every session at this practice is by video. */
export const reachLine = (p: Pick<Practitioner, 'reach'>): string =>
  `Online only, anywhere in ${p.reach === 'canada' ? 'Canada' : 'BC'}`;

export type NotOffered = { label: string; service: string; by: { slug: string; name: string }[] };

/** The practice's services she does not offer, each with the colleagues
 *  taking new clients who do. Only accepting counsellors are named, so the
 *  line never points a reader at someone who cannot see them. */
export function notOffered(p: Pick<Practitioner, 'slug' | 'services'>, roster: readonly Practitioner[]): NotOffered[] {
  return OFFERINGS.filter((o) => !p.services.includes(o.service)).map((o) => ({
    label: o.label,
    service: o.service,
    by: roster
      .filter((q) => q.slug !== p.slug && q.acceptingNewClients && q.services.includes(o.service))
      .map((q) => ({ slug: q.slug, name: q.name })),
  }));
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "1 October 2026" from YYYY-MM-DD, without a time zone to get wrong. */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

/** The liability-insurance line, only while the policy is current. In its
 *  grace period, lapsed or unrecorded, nothing is said: the grace period is
 *  time for a renewal certificate to arrive, not a claim that cover runs on. */
export function insuranceLine(p: Pick<Practitioner, 'insurance'>, today: string): string | null {
  if (!p.insurance || insuranceStatus(p, today) !== 'current') return null;
  return `Professional liability insurance, ${p.insurance.limitPerClaim} per claim, current to ${longDate(p.insurance.validTo)}`;
}

export const BCACC_REGISTER = 'https://bcacc.ca/search-our-member-register/';

/** Her own entry on the register, which BCACC renders from `?mid=<number>`
 *  (status, valid-until date, notes). Profile only: the URL carries the
 *  number, and numbers may appear on their owner's pages and nowhere else. */
export const registerEntryUrl = (c: Pick<Credential, 'verifyUrl' | 'number'>): string | undefined =>
  c.verifyUrl === BCACC_REGISTER ? `${BCACC_REGISTER}?mid=${encodeURIComponent(c.number)}` : c.verifyUrl;

/** The /standards section a complaint starts from. */
export const COMPLAINTS_PATH = '/standards#if-something-goes-wrong';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** What Person.makesOffer is built from: the free consultation, then each
 *  priced part of each service she offers. Same source as the strip, so the
 *  markup and the page cannot state different fees. */
export function offerItems(p: Pick<Practitioner, 'services'>, catalog: Catalog): { name: string; cents: number; minutes: number }[] {
  const consult = find(catalog, 'Initial Consultation');
  return [
    ...(consult && consult.cents === 0 ? [{ name: 'Free consultation', cents: 0, minutes: consult.minutes }] : []),
    ...feeLines(p, catalog).flatMap((l) =>
      l.parts.map((x) => ({ name: x.as ? `${cap(l.label)} (${x.as})` : cap(l.label), cents: x.cents, minutes: x.minutes })),
    ),
  ];
}

export const andList = (xs: readonly string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** One sentence per counsellor taking new clients, for prose that names who
 *  a reader could see: profile link, languages, reach, services. Built from
 *  the gated roster, so a reach the insurance gate withdraws leaves the
 *  sentence at the next build, and someone not taking new clients is never
 *  named. No registration numbers: those stay on the profiles. */
export function acceptingSentences(roster: readonly Practitioner[]): string[] {
  return roster
    .filter((p) => p.acceptingNewClients)
    .map((p) => {
      const services = OFFERINGS.filter((o) => p.services.includes(o.service)).map((o) => o.label);
      return `[${p.name}](/practitioners/${p.slug}) works in ${andList(p.languages.map((l) => l.name))}, by video anywhere in ${p.reach === 'canada' ? 'Canada' : 'BC'}, and offers ${andList(services)}.`;
    });
}

/* THE PERSON, INLINE, FOR PAGES THAT ARE NOT HER PROFILE — 1 Oct 2026.
   Seventy ProfilePage nodes pointed mainEntity at /practitioners/<slug>#person,
   a node that exists only on the profile, so on the page itself the entity had
   no name, which Google requires. This is the minimal node those pages carry
   instead: same @id, so it merges with the full one, and `url` always the
   canonical profile, never the page it sits on. */
export const personStub = (
  p: Pick<Practitioner, 'slug' | 'name' | 'role' | 'languages' | 'photos'>,
  domain: string = site.domain,
) => ({
  '@type': 'Person' as const,
  '@id': `${domain}/practitioners/${p.slug}#person`,
  name: p.name,
  jobTitle: p.role,
  url: `${domain}/practitioners/${p.slug}`,
  ...(p.photos?.portrait ? { image: `${domain}${p.photos.portrait.src}` } : {}),
  knowsLanguage: p.languages.map((l) => l.tag),
});

/** Person.description on the profile, from the roster: what she offers, how,
 *  where and in which languages. No fees, numbers or availability. */
export function personDescription(p: Pick<Practitioner, 'name' | 'role' | 'services' | 'languages' | 'reach' | 'provinces'>): string {
  const services = OFFERINGS.filter((o) => p.services.includes(o.service)).map((o) => o.label);
  const where = p.reach === 'canada' ? 'anywhere in Canada' : p.provinces.length > 1 ? `in ${andList(p.provinces.map((c) => PROVINCE_LONG[c] ?? c))}` : 'across British Columbia';
  const role = p.role.split(' · ')[0];
  return `${p.name} is a ${role} offering ${andList(services.length ? services : ['counselling'])} by secure video ${where}, in ${andList(p.languages.map((l) => l.name))}.`;
}

const PROVINCE_LONG: Record<string, string> = { BC: 'British Columbia', AB: 'Alberta' };

/** "Registered Clinical Counsellor (RCC), BC · Canadian Certified Counsellor
 *  (CCC), national": each credential spelled out with where it carries weight. */
export const credentialLine = (p: Pick<Practitioner, 'credentials'>): string =>
  p.credentials
    .map((c) => `${c.full} (${c.short}), ${c.scope === 'national' ? 'national' : /\bBC\b|British Columbia/.test(c.body) ? 'BC' : 'provincial'}`)
    .join(' · ');

/** One plain sentence per national certification: who certifies it. */
export const certifiedBy = (p: Pick<Practitioner, 'credentials'>): string[] =>
  p.credentials.filter((c) => c.scope === 'national').map((c) => `The ${c.short} is certified by the ${c.body}.`);

/** "Savneet does not offer couples counselling, EMDR or family counselling;
 *  Camille Granda does." The colleague clause only when one set of accepting
 *  counsellors offers all of them. */
export function notOfferedSentence(first: string, missing: NotOffered[]): { lead: string; by: { slug: string; name: string }[]; verb: string; services: string[] } | null {
  if (!missing.length) return null;
  const labels = missing.map((m) => m.label);
  const list = labels.length < 2 ? labels.join('') : `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1]}`;
  const key = (m: NotOffered) => m.by.map((b) => b.slug).join();
  const same = missing.every((m) => m.by.length && key(m) === key(missing[0]!));
  const by = same ? missing[0]!.by : [];
  return { lead: `${first} does not offer ${list}`, by, verb: by.length > 1 ? 'do' : 'does', services: missing.map((m) => m.service) };
}

/* WHO TO SEE INSTEAD, ON A PROFILE THAT IS NOT TAKING CLIENTS — 2 Oct 2026.
 *
 * The founder's profile is written for Punjabi readers and sent every one of
 * them to the first accepting counsellor on the roster, who does not speak
 * Punjabi. Ranked instead:
 *
 *   1. an accepting, bookable colleague who shares one of her non-English
 *      languages ("Book with Savneet, in Punjabi or English");
 *   2. the accepting, bookable colleague who offers the most of the services
 *      she offered that the first one does not ("For couples counselling or
 *      EMDR, Camille").
 *
 * With no language match, the first accepting colleague, as before. Built from
 * the roster and OFFERINGS, so a change of roster changes the sentences.
 * `bookService` is the service slug the second link narrows /book to (couples
 * work adds for=couples in bookHrefFor). */
export type Alternative = {
  slug: string;
  name: string;
  first: string;
  /** Her languages, the shared non-English ones first. */
  languages: string[];
  /** Service labels this alternative is offered for; empty for the main one. */
  services: string[];
  bookService?: string;
};

type AltRow = Pick<Practitioner, 'slug' | 'name' | 'languages' | 'services' | 'acceptingNewClients' | 'bookable'>;

export function alternativesFor(p: Pick<Practitioner, 'slug' | 'languages' | 'services'>, roster: readonly AltRow[]): Alternative[] {
  const open = roster.filter((q) => q.slug !== p.slug && q.acceptingNewClients && q.bookable);
  const own = p.languages.filter((l) => !l.tag.startsWith('en')).map((l) => l.tag);
  const lang = open.find((q) => q.languages.some((l) => own.includes(l.tag)));
  const main = lang ?? open[0];
  if (!main) return [];
  const ordered = [...main.languages].sort((a, b) => Number(own.includes(b.tag)) - Number(own.includes(a.tag)));
  const out: Alternative[] = [{
    slug: main.slug, name: main.name, first: main.name.split(' ')[0]!, languages: ordered.map((l) => l.name), services: [],
  }];
  const lacking = OFFERINGS.filter((o) => p.services.includes(o.service) && !main.services.includes(o.service));
  const second = open
    .filter((q) => q.slug !== main.slug)
    .map((q) => ({ q, has: lacking.filter((o) => q.services.includes(o.service)) }))
    .filter((x) => x.has.length > 0)
    .sort((a, b) => b.has.length - a.has.length)[0];
  if (second) {
    out.push({
      slug: second.q.slug,
      name: second.q.name,
      first: second.q.name.split(' ')[0]!,
      languages: second.q.languages.map((l) => l.name),
      services: second.has.map((o) => o.label),
      bookService: second.has.some((o) => o.service === 'couples-therapy') ? 'couples-therapy' : second.has[0]!.service,
    });
  }
  return out;
}

export const orList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);

/** "Book with Savneet, in Punjabi or English" / "For couples counselling or EMDR, Camille". */
export const alternativeLabel = (a: Alternative): string =>
  a.services.length ? `For ${orList(a.services)}, ${a.first}` : `Book with ${a.first}, in ${orList(a.languages)}`;

/* HER OWN "NOT THE RIGHT FIT", FOR THE FACT STRIP — 2 Oct 2026. The first
   sentence of her answer to "When are you not the right counsellor?", picked
   by the question's wording and quoted verbatim. Null without that answer. */
export const NOT_RIGHT_QUESTION = /when are you not the right counsellor/i;

/* AND HER SECOND, MORE DECISIVE ONE — 15 Oct 2026. The first sentence is,
   for both counsellors, the generic "tell you what to do", so the comparison
   row read the same twice. The scope fact (an assessment for Camille,
   specialised couples work for Savneet) is the first sentence of the next
   paragraph of the same answer. It is quoted verbatim after an ellipsis,
   because the two sentences are not adjacent in what she wrote. */
const firstSentence = (s: string | undefined): string | null => {
  const t = s?.trim();
  if (!t) return null;
  const m = /^.*?[.!?](?=\s|$)/.exec(t);
  return m ? m[0] : t;
};

/** The first sentence of the second paragraph of her answer, or null. */
export function notRightScope(p: Pick<Practitioner, 'voice'>): string | null {
  return firstSentence(p.voice?.find((v) => NOT_RIGHT_QUESTION.test(v.q))?.a[1]);
}

export function notRightFit(p: Pick<Practitioner, 'voice'>): string | null {
  const first = firstSentence(p.voice?.find((v) => NOT_RIGHT_QUESTION.test(v.q))?.a[0]);
  if (!first) return null;
  const scope = notRightScope(p);
  return scope ? `${first} … ${scope}` : first;
}

/* HOW SHE WORKS, FROM HER OWN TRAINING ANSWER — 2 Oct 2026. Approach names
   that appear verbatim (case and word boundary) in her answer to "How would
   you describe your training…", in the order she wrote them. A name she did
   not write is never shown for her. */
export const TRAINING_QUESTION = /describe your training/i;
export const APPROACH_TERMS: readonly string[] = [
  'CBT', 'ACT', 'DBT', 'EMDR', 'somatic trauma therapy', 'polyvagal-informed work',
  'trauma-informed yoga', 'relationship therapy', 'Gottman',
];

export function approachTerms(p: Pick<Practitioner, 'voice'>): string[] {
  const a = p.voice?.find((v) => TRAINING_QUESTION.test(v.q))?.a.join(' ');
  if (!a) return [];
  return APPROACH_TERMS
    .map((t) => ({ t, i: a.search(new RegExp(`(^|[^A-Za-z-])${t}(?![A-Za-z-])`)) }))
    .filter((x) => x.i >= 0)
    .sort((x, y) => x.i - y.i)
    .map((x) => x.t);
}

/** What she offers, from OFFERINGS, in the short form for a card:
 *  "Individual, couples, EMDR and family counselling", "Individual
 *  counselling". A shared trailing "counselling" is said once. /book's
 *  choosing cards, 15 Oct 2026, where the two focus lines read alike. */
export function offersShort(p: Pick<Practitioner, 'services'>): string | null {
  const labels = OFFERINGS.filter((o) => p.services.includes(o.service)).map((o) => o.label);
  if (!labels.length) return null;
  const tail = ' counselling';
  const shared = labels[labels.length - 1]!.endsWith(tail);
  const words = labels.map((l, i) => (shared && i < labels.length - 1 && l.endsWith(tail) ? l.slice(0, -tail.length) : l));
  return cap(andList(words));
}

/** Her lowest priced session in the catalogue, e.g. "$140", or null. */
export function lowestFee(p: Pick<Practitioner, 'services'>, catalog: Catalog): string | null {
  const cents = feeLines(p, catalog).flatMap((l) => l.parts.map((x) => x.cents));
  return cents.length ? money(Math.min(...cents)) : null;
}

/* "CAMILLE OR SAVNEET?" — 2 Oct 2026. One column per counsellor taking new
   clients, every cell computed: languages and reach from the gated roster,
   services from OFFERINGS with the colleague who offers what she does not,
   approaches from her own training answer, the not-right-fit sentence from
   her own answer, fees from the catalogue. No registration numbers. The next
   free consultation is added by the component, which reads Cliniko. */
export type CompareColumn = {
  slug: string;
  name: string;
  first: string;
  languages: string;
  offers: string;
  missing: NotOffered[];
  where: string;
  approaches: string[];
  notRightFit: string | null;
  fees: string[];
  /** Her focus labels, as one line (item 572). */
  worksWith: string;
  /** Individuals, and couples and families only when OFFERINGS lists them. */
  sees: string;
  /** The first sentence of her own description of who she works with. */
  seesWords: string | null;
  /** Her own one-line session description (sessionInHerWords). */
  session: string | null;
};

export function compareColumns(roster: readonly Practitioner[], catalog: Catalog): CompareColumn[] {
  return roster
    .filter((p) => p.acceptingNewClients)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      first: p.name.split(' ')[0]!,
      languages: andList(p.languages.map((l) => l.name)),
      offers: cap(andList(OFFERINGS.filter((o) => p.services.includes(o.service)).map((o) => o.label))),
      missing: notOffered(p, roster).filter((m) => m.by.length > 0),
      where: `Online only: ${andList(p.provinces.map((c) => PROVINCE_LONG[c] ?? c))}${p.reach === 'canada' ? ', and elsewhere in Canada' : ''}`,
      approaches: approachTerms(p),
      notRightFit: notRightFit(p),
      fees: feeLines(p, catalog).map((l) => `${cap(l.label)}: ${feePhrase(l)}`),
      worksWith: cap(p.focus.map((f) => lowerFirst(f.label)).join('; ')),
      sees: whoSheSees(p),
      seesWords: firstSentence(p.intro[0]),
      session: sessionInHerWords(p),
    }));
}

/** The roster for /practitioners: everyone taking new clients first, in
 *  roster order, then everyone who is not. Stable, so the roster still
 *  decides the order within each group. */
export const rosterOrder = <T extends Pick<Practitioner, 'acceptingNewClients'>>(roster: readonly T[]): T[] =>
  [...roster.filter((p) => p.acceptingNewClients), ...roster.filter((p) => !p.acceptingNewClients)];

/** Not-offered services grouped by the colleagues who offer them, in
 *  OFFERINGS order: [{ labels: ['couples counselling', 'EMDR', 'family
 *  counselling'], by: [Camille] }]. */
export function groupMissing(missing: readonly NotOffered[]): { labels: string[]; services: string[]; by: NotOffered['by'] }[] {
  const out: { key: string; labels: string[]; services: string[]; by: NotOffered['by'] }[] = [];
  for (const m of missing) {
    const key = m.by.map((b) => b.slug).join();
    const g = out.find((x) => x.key === key);
    if (g) { g.labels.push(m.label); g.services.push(m.service); }
    else out.push({ key, labels: [m.label], services: [m.service], by: m.by });
  }
  return out.map(({ labels, services, by }) => ({ labels, services, by }));
}

/* BOOK THE COLLEAGUE FOR WHAT SHE DOES NOT OFFER — 16 Oct 2026 (item 561).
   "Savneet does not offer couples counselling, EMDR or family counselling;
   Camille Granda does" linked Camille's 12,000 px profile, so a couples or
   EMDR seeker on Savneet's pages had to read it before booking. The labels
   are split by the booking each needs: couples work opens the couples
   consultation (for=couples in bookHrefFor), everything else her calendar.
   The service ids only; the page builds the href. */
export function altBookings(labels: readonly string[], services: readonly string[]): { labels: string[]; service?: string }[] {
  const couples = services.indexOf('couples-therapy');
  const rest = labels.filter((_, i) => i !== couples);
  return [
    ...(couples >= 0 ? [{ labels: [labels[couples]!], service: 'couples-therapy' }] : []),
    ...(rest.length ? [{ labels: rest }] : []),
  ];
}

/* HER OWN ONE-LINE SESSION DESCRIPTION — 16 Oct 2026 (item 572). The first
   sentence of her published answer to "What is it actually like to sit with
   you for an hour?", quoted and labelled as her words. It is the counsellor
   describing her own sessions, not anything a client said. Null without the
   answer. */
export const SESSION_QUESTION = /what is it actually like to sit with you/i;

export const sessionInHerWords = (p: Pick<Practitioner, 'voice'>): string | null =>
  firstSentence(p.voice?.find((v) => SESSION_QUESTION.test(v.q))?.a[0]);

/* WHAT SHE OFTEN WORKS WITH, AS TERMS — 16 Oct 2026 (items 572, 573). Her
   focus labels split on commas and "and", lower-cased: "Grief, loss and
   life transitions" is grief, loss and life transitions. Nothing is added
   that her labels do not say, so a term one counsellor lists and the other
   does not is a real difference in the roster, not a judgement. */
const lowerFirst = (s: string) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

export const focusTerms = (p: Pick<Practitioner, 'focus'>): string[] =>
  [...new Set(p.focus.flatMap((f) => f.label.split(/,\s*|\s+and\s+/).map((t) => lowerFirst(t.trim())).filter(Boolean)))];

/** "Individuals, couples and families", from OFFERINGS: couples and families
 *  only when she offers that work. No age is claimed. */
export function whoSheSees(p: Pick<Practitioner, 'services'>): string {
  const who = ['individuals'];
  if (p.services.includes('couples-therapy')) who.push('couples');
  if (p.services.includes('family-counselling')) who.push('families');
  return cap(andList(who));
}

/* "IF YOU WANT …, BOOK …" — 16 Oct 2026 (item 573). The /practitioners
   paragraph on choosing named neither counsellor. These lines are generated
   from the counsellors taking new clients and bookable, and nothing else:
   a non-English language only one of them works in, a service in OFFERINGS
   only one of them offers, a focus term only one of them lists, and the
   focus terms they all list. A line with one counsellor names her and the
   service her link books; a shared line names nobody. */
export type ChooserLine = {
  kind: 'language' | 'service' | 'focus' | 'shared';
  /** What the reader wants, as the roster says it: "Punjabi", ["couples counselling"], ["grief", "loss"]. */
  terms: string[];
  /** The one counsellor, or null when they all fit. */
  slug: string | null;
  first: string | null;
  /** The service the link books, for couples work. */
  service?: string;
};

export function chooserLines(roster: readonly Practitioner[], catalog: Catalog): ChooserLine[] {
  const open = roster.filter((p) => p.acceptingNewClients && p.bookable);
  if (open.length < 2) return [];
  const firstOf = (p: Practitioner) => p.name.split(' ')[0]!;
  const out: ChooserLine[] = [];
  /* Languages, in roster order, non-English only. */
  const langs = [...new Map(open.flatMap((p) => p.languages).filter((l) => !l.tag.startsWith('en')).map((l) => [l.tag, l.name])).entries()];
  for (const [tag, name] of langs) {
    const who = open.filter((p) => p.languages.some((l) => l.tag === tag));
    if (who.length === 1) out.push({ kind: 'language', terms: [name], slug: who[0]!.slug, first: firstOf(who[0]!) });
  }
  /* Services only one offers, couples work on its own line for its own
     consultation. EMDR says "including the intensive" only when her fee
     line in the catalogue has one. */
  for (const p of open) {
    const only = OFFERINGS.filter((o) => p.services.includes(o.service) && open.every((q) => q === p || !q.services.includes(o.service)));
    if (!only.length) continue;
    const intensive = feeLines(p, catalog).some((l) => l.service === 'emdr-therapy' && l.parts.some((x) => x.as === 'intensive'));
    const label = (o: (typeof OFFERINGS)[number]) => (o.service === 'emdr-therapy' && intensive ? 'EMDR, including the intensive,' : o.label);
    for (const b of altBookings(only.map(label), only.map((o) => o.service))) {
      out.push({ kind: 'service', terms: b.labels, slug: p.slug, first: firstOf(p), ...(b.service ? { service: b.service } : {}) });
    }
  }
  /* Focus terms. */
  const terms = open.map((p) => ({ p, t: focusTerms(p) }));
  for (const { p, t } of terms) {
    const only = t.filter((x) => terms.every((o) => o.p === p || !o.t.includes(x)));
    if (only.length) out.push({ kind: 'focus', terms: only, slug: p.slug, first: firstOf(p) });
  }
  const shared = terms[0]!.t.filter((x) => terms.every((o) => o.t.includes(x)));
  if (shared.length) out.push({ kind: 'shared', terms: shared, slug: null, first: null });
  return out;
}

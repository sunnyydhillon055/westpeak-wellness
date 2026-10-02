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

export type FeeLine = { label: string; parts: { fee: string; minutes: number; as?: string; cents: number }[] };

const find = (c: Catalog, name: string) => c.items.find((i) => i.name.toLowerCase() === name.toLowerCase());

/** The fee for each service she offers, read from the catalogue. A service
 *  whose types the catalogue does not hold (or prices at zero) is left out. */
export function feeLines(p: Pick<Practitioner, 'services'>, catalog: Catalog): FeeLine[] {
  return OFFERINGS.filter((o) => p.services.includes(o.service)).flatMap((o) => {
    const parts = o.billedAs.flatMap((b) => {
      const item = find(catalog, b.name);
      return item && item.cents > 0 ? [{ fee: money(item.cents), minutes: item.minutes, as: b.as, cents: item.cents }] : [];
    });
    return parts.length ? [{ label: o.label, parts }] : [];
  });
}

/** "$175 for 50 minutes, or extended $340 for 110 minutes" */
export const feePhrase = (l: FeeLine): string =>
  l.parts.map((x, i) => `${i ? 'or ' : ''}${x.as ? `${x.as} ` : ''}${x.fee} for ${x.minutes} minutes`).join(', ');

/** "First 30-minute consultation free", from the catalogue's own free type. */
export function consultLine(catalog: Catalog): string | null {
  const c = find(catalog, 'Initial Consultation');
  return c && c.cents === 0 ? `First ${c.minutes}-minute consultation free` : null;
}

/** Where she may see clients, from the gated roster's reach. Online only,
 *  because every session at this practice is by video. */
export const reachLine = (p: Pick<Practitioner, 'reach'>): string =>
  `Online only, anywhere in ${p.reach === 'canada' ? 'Canada' : 'BC'}`;

export type NotOffered = { label: string; by: { slug: string; name: string }[] };

/** The practice's services she does not offer, each with the colleagues
 *  taking new clients who do. Only accepting counsellors are named, so the
 *  line never points a reader at someone who cannot see them. */
export function notOffered(p: Pick<Practitioner, 'slug' | 'services'>, roster: readonly Practitioner[]): NotOffered[] {
  return OFFERINGS.filter((o) => !p.services.includes(o.service)).map((o) => ({
    label: o.label,
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

const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

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
export function notOfferedSentence(first: string, missing: NotOffered[]): { lead: string; by: { slug: string; name: string }[]; verb: string } | null {
  if (!missing.length) return null;
  const labels = missing.map((m) => m.label);
  const list = labels.length < 2 ? labels.join('') : `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1]}`;
  const key = (m: NotOffered) => m.by.map((b) => b.slug).join();
  const same = missing.every((m) => m.by.length && key(m) === key(missing[0]!));
  const by = same ? missing[0]!.by : [];
  return { lead: `${first} does not offer ${list}`, by, verb: by.length > 1 ? 'do' : 'does' };
}

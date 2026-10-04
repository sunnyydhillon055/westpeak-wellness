import { practitioners, type Practitioner } from '@/lib/practitioners';
import { placesFor } from '@/lib/practitioner-places';
import type { CityTopic } from '@/lib/conditions';
import type { CityContext } from '@/lib/city-context';
import type { Location } from '@/lib/locations';
import { money, type Catalog } from '@/lib/cliniko-catalog';
import { site } from '@/lib/site';
import { GUIDE_FOR_SERVICE } from '@/lib/fee-guides';
/* metaLength only, called at run time: lib/snippet-facts.ts imports this
   file too, and neither touches the other at module load. */
import { metaLength } from '@/lib/snippet-facts';

/* WHAT A CITY × SERVICE PAGE SAYS FROM DATA — 1 Oct 2026.
 *
 * WHY THIS FILE EXISTS
 *
 * The fifty city-service pages sat at positions 28-83 in Search Console on
 * 26 Sep 2026, and 51 of 55 had not moved by a hundredth of a position
 * between the 17 Sep and 26 Sep exports. Thirteen of the pages that DO rank
 * for the same queries were read (scratchpad/city-service-competitors.md).
 * Eight of thirteen name a counsellor with a credential line on the page
 * itself; ten of thirteen put the booking action above the fold; seven carry
 * FAQs about cost, coverage and who you would see; the one that ranks first
 * for couples in Abbotsford states a fee and says coverage varies.
 *
 * Our template named nobody, printed "$140 for 50 minutes" on couples and
 * EMDR pages where that is not the fee, had its booking button fourth in the
 * hero as an untracked Link, and asked only the two or three questions the
 * pair's author thought of. Every one of those gaps is closable from data the
 * roster and the catalogue already hold, which is why this is a lib file and
 * not fifty edits to lib/city-services.ts.
 *
 * WHY THE SENTENCES ARE SHAPED THE WAY THEY ARE
 *
 * scripts/uniqueness-gate.mjs fails the build if any page is less than 18% (25% since 3 Oct 2026)
 * unique by 8-word shingle, and the pages sat at 21% before this. Text that
 * is generated per page but reads the same on all fifty is exactly the
 * boilerplate the gate exists to catch. So every generated sentence carries
 * the city, the service or a counsellor's name inside its first eight words,
 * and the shared tail after the last data point is kept short. A test checks
 * that no two pages share a generated answer; the gate checks the rendered
 * result.
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * No availability line: hours are not published anywhere (DECISIONS, 28 Sep
 * 2026). No insurer names and no promise: coverage is "plan-dependent". No
 * registration numbers: those live on the profile page only. The founder is
 * never listed, because she is not accepting new clients and the filter is
 * `acceptingNewClients`, not a name.
 */

/* A Title Case name for use mid-sentence — 1 Oct 2026. This lowercased the
   first character only, so the FAQs on all fifty pages read "eMDR Therapy",
   "couples Therapy" and "anxiety Counselling". Word by word now: an
   initialism (EMDR) and a language name keep their capitals, everything else
   is lowercased, hyphenated parts included. */
const PROPER = new Set(['English', 'Punjabi', 'Tagalog', 'BC', 'Gottman']);
const lowerWord = (w: string): string =>
  w.includes('-')
    ? w.split('-').map(lowerWord).join('-')
    : (w.length > 1 && w === w.toUpperCase()) || PROPER.has(w) ? w : w.toLowerCase();
export const midSentence = (s: string) => s.split(' ').map(lowerWord).join(' ');
const lower = midSentence;

/** "a, b and c" / "a or b". One item returns itself. */
export const listOf = (items: string[], conj: 'and' | 'or') =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} ${conj} ${items[items.length - 1]}`;

/* The counsellors who could actually take this work: accepting, insured for
   BC, and offering the Cliniko appointment type the topic books into. A
   condition (anxiety, depression) books into individual therapy, so both
   counsellors appear; couples and EMDR book into types only one of them
   offers. Roster order is kept — it is the order /book uses. */
export const counsellorsFor = (topic: Pick<CityTopic, 'bookingService'>): Practitioner[] =>
  practitioners.filter(
    (p) =>
      p.acceptingNewClients &&
      p.provinces.includes('BC') &&
      p.services.includes(topic.bookingService),
  );

/* Her page for this city when she has one, her profile when she does not.
   Only counsellors with placePages get per-city routes, and only for cities
   in their own place list, so this never links to a route that was not
   generated. Same rule as the city hub's chips. */
export const profileHrefFor = (p: Practitioner, citySlug: string) =>
  p.placePages && placesFor(p.provinces).some((c) => c.slug === citySlug)
    ? `/practitioners/${p.slug}/${citySlug}`
    : `/practitioners/${p.slug}`;

/* `?with=` only when exactly one counsellor offers the service. Nobody is the
   default on /book (DECISIONS, 8 Sep 2026); narrowing to one calendar is
   honest only when there is one calendar it could be. Two counsellors means
   the reader chooses on /book, as they do everywhere else.

   #calendar AND for=couples — 1 Oct 2026 (wf/book-and-cta). A link that has
   already named the counsellor opens her calendar on arrival (SchedulerGate
   opens on a #calendar hash); bare /book stays unhashed so its gate and its
   Lighthouse figure are unchanged. A couples page adds for=couples, which
   /book reads as a couples consultation: couples fees only, and a line on
   how both partners join. */
export const bookHrefFor = (counsellors: Practitioner[], service?: string) =>
  counsellors.length === 1
    ? `${site.bookingPath}?with=${counsellors[0].slug}${service === 'couples-therapy' ? '&for=couples' : ''}#calendar`
    : site.bookingPath;

/* The Cliniko appointment type each bookable service bills as. A name, not a
   price: the price is read from the catalogue, which scripts/price-drift.mjs
   compares against Cliniko on every build. The service page keeps the same
   mapping for its nine slugs; this one covers only the three the matrix books
   into, so there is still no fourth place a dollar figure is typed. */
const BILLED_AS: Record<string, string | undefined> = {
  'individual-therapy': 'Individual Counselling',
  'couples-therapy': 'Couples Counselling',
  /* Weekly EMDR, 3 Oct 2026. EMDR is billed as an individual session week
     to week and the intensive only when that longer format is chosen
     (lib/practitioner-facts.ts OFFERINGS), yet every EMDR city page opened
     "Sessions are $190 for 90 minutes": the trap the trauma pages were taken
     out of on 1 Oct. The intensive is now the later option below. */
  'emdr-therapy': 'Individual Counselling',
};

/* `cents` rides along so a caller comparing fees (the lowest a counsellor
   charges, for a "from" line) never parses a formatted string back. */
export type Fee = { fee: string; minutes: number; cents: number };

export const feeFor = (catalog: Catalog, topic: Pick<CityTopic, 'bookingService'>): Fee | undefined => {
  const name = BILLED_AS[topic.bookingService];
  const item = name ? catalog.items.find((i) => i.name.toLowerCase() === name.toLowerCase()) : undefined;
  return item && item.cents > 0 ? { fee: money(item.cents), minutes: item.minutes, cents: item.cents } : undefined;
};

export const languagesOf = (p: Pick<Practitioner, 'languages'>) => p.languages.map((l) => l.name);

/* THE LANGUAGES A SERVICE IS ACTUALLY OFFERED IN — 1 Oct 2026.
 *
 * The description and the closing band on all fifty city-service pages said
 * "English, Punjabi or Tagalog", including the twenty couples and EMDR pages,
 * where the one counsellor who offers the work speaks English and Tagalog.
 * Production showed "...English, Punjabi or Tagalog. Free" on the Abbotsford
 * couples result. The list is now the union of the languages spoken by the
 * counsellors who could take the booking, English first and the rest in
 * alphabetical order, so a new counsellor or a new service changes it without
 * an edit, and a language nobody offering the service speaks cannot appear. */
export const languagesFor = (counsellors: Pick<Practitioner, 'languages'>[]): string[] => {
  const names = [...new Set(counsellors.flatMap(languagesOf))];
  return [
    ...names.filter((n) => n === 'English'),
    ...names.filter((n) => n !== 'English').sort(),
  ];
};

/** "English, Punjabi or Tagalog" / "English or Tagalog". */
export const languagePhrase = (counsellors: Pick<Practitioner, 'languages'>[]) =>
  listOf(languagesFor(counsellors), 'or');

/* Whole sentences, joined until the next one would pass `max`. Never a cut
   mid-sentence: the guard this replaces sliced at the last space before 155
   and published "Free" as the final word of a description. */
export const fitSentences = (sentences: string[], max: number): string => {
  let out = '';
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  return out || sentences[0];
};

/* THE NAME A CITY × SERVICE PAGE IS FOUND BY — 1 Oct 2026.
 *
 * Moved here from the pair page, where it handled couples only ("Couples and
 * Marriage Counselling", 25 Sep 2026, for the "marriage counselling
 * abbotsford" queries). Search Console, 26 Sep 2026: 19 trauma + counselling
 * phrasings with 84 impressions and no clicks ("trauma counselling kamloops"
 * 21 at 36.38), and anxiety/depression + therapy/therapist with 46. The H1,
 * the description, the closing band and every link into these pages now use
 * this one map, so an anchor and the heading it lands on say the same thing.
 * EMDR is searched as "EMDR therapy" and keeps its name. The <title> stays on
 * cityServiceTitle and the pair's titleName, so the 60-character gate is not
 * involved. */
const SEO_NAME: Record<string, string | undefined> = {
  'couples-therapy': 'Couples and Marriage Counselling',
  'trauma-therapy': 'Trauma Therapy and Counselling',
  'anxiety-counselling': 'Anxiety Counselling and Therapy',
  'depression-counselling': 'Depression Counselling and Therapy',
};
export const seoName = (s: { slug: string; name: string }) => SEO_NAME[s.slug] ?? s.name;
/** "Couples and Marriage Counselling" -> "Couples and marriage counselling",
 *  for an anchor written as a phrase rather than a heading. */
export const sentenceName = (s: string) => {
  const m = midSentence(s);
  return m.charAt(0).toUpperCase() + m.slice(1);
};

/* The person the reader is looking for, as they type it — 1 Oct 2026. City
 * queries naming a person ("emdr therapist vancouver" 14 at 59.43, "online
 * counsellor abbotsford" 11 at 49.36) had 118 impressions and no clicks on 26
 * Sep, and the heading over the cards named the service, not the person. */
const PERSON_NOUN: Record<string, [one: string, many: string] | undefined> = {
  'emdr-therapy': ['EMDR therapist', 'EMDR therapists'],
  'trauma-therapy': ['Trauma therapist', 'Trauma therapists'],
  'anxiety-counselling': ['Anxiety therapist', 'Anxiety therapists'],
  'depression-counselling': ['Depression counsellor', 'Depression counsellors'],
  'couples-therapy': ['Couples or marriage counsellor', 'Couples or marriage counsellors'],
};
export const personNoun = (slug: string, count: number): string => {
  const [one, many] = PERSON_NOUN[slug] ?? ['Counsellor', 'Counsellors'];
  return count === 1 ? one : many;
};
/** "EMDR therapist in Vancouver: who you would see". */
export const whoHeading = (slug: string, city: string, count: number) =>
  `${personNoun(slug, count)} in ${city}: who you would see`;

/* THE LONGER FORMAT, OFFERED AS LATER — 1 Oct 2026.
 *
 * Trauma books into individual counselling: the copy on every trauma page says
 * pacing and stabilisation come first, and the EMDR page frames the 90-minute
 * intensive as something for "once stability is in place". Until today the
 * ten trauma pages priced themselves at the intensive and named only the one
 * counsellor who offers it. This is the one sentence that keeps the intensive
 * in view, read from the catalogue and the roster like every other figure
 * here. undefined when the catalogue lacks the type or nobody offers it. */
const LATER_OPTION: Record<string, { service: string; item: string } | undefined> = {
  'trauma-therapy': { service: 'emdr-therapy', item: 'EMDR Intensive' },
  'emdr-therapy': { service: 'emdr-therapy', item: 'EMDR Intensive' },
};
export const laterOption = (
  catalog: Catalog,
  topic: Pick<CityTopic, 'slug'>,
  city: string,
): string | undefined => {
  const later = LATER_OPTION[topic.slug];
  if (!later) return undefined;
  const item = catalog.items.find((i) => i.name.toLowerCase() === later.item.toLowerCase());
  const who = counsellorsFor({ bookingService: later.service });
  if (!item || item.cents <= 0 || !who.length) return undefined;
  /* Ends on the data, so the tail ten pages share stays short for the
     uniqueness gate. */
  const names = listOf(who.map((p) => p.name), 'or');
  if (topic.slug === 'emdr-therapy') {
    return `EMDR from ${city} can also run as the ${item.name} once preparation is done: ${money(item.cents)} for ${item.minutes} minutes with ${names}.`;
  }
  return `For trauma work in ${city}, a memory that needs a longer run than a weekly session can move to the ${item.name} later, once stability is in place: ${money(item.cents)} for ${item.minutes} minutes with ${names}.`;
};

/* The city-service <title>, before the brand suffix. ", BC" where the whole
   title still fits the 60-character gate, without it where it does not.
   `name` is the pair's titleName when it has one ("Marriage Counselling"),
   otherwise the service's own name. */
export const cityServiceTitle = (name: string, city: string, brand: string, max = 60): string => {
  const withBc = `${name} in ${city}, BC`;
  return `${withBc} | ${brand}`.length <= max ? withBc : `${name} in ${city}`;
};

/* THE CITY-SERVICE DESCRIPTION — rewritten 3 Oct 2026.
 *
 * In the 3 Oct build all 100 city-service descriptions read "<Service> for
 * <City>, by secure video across BC with a Registered Clinical Counsellor.
 * In ..." and none carried a fee, while the hubs, sixteen of seventeen
 * Punjabi regions and five of seven service pages did. The 3 Oct export shows
 * no clicks on any city-service page. A description is now the pair's own
 * argument, the counsellors who would take the work by first name, and the
 * service's catalogue fee with the free consultation:
 *
 *   {first sentence of pair.angle} With {first names}, {fee} per {min}-min
 *   session · free 30-min consult.
 *
 * `facts` is serviceSnippet(catalog, service, []) from lib/snippet-facts.ts,
 * passed in by the page, so this file still types no figure. The angle is the
 * only part that is cut: whole sentence first; on a page two counsellors share,
 * the names are dropped before the angle is touched; failing that, the angle
 * ends at the last whole clause that fits (cutAtClause), and only then is it
 * cut at a word boundary and marked with an ellipsis. Couples and EMDR keep
 * the one name, because the name is the answer to who takes that work.
 * scripts/uniqueness-gate.mjs fails if two descriptions share more than 60%
 * of their word 4-grams. */
const firstSentenceOf = (s: string) => s.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? s;
const firstNames = (counsellors: Pick<Practitioner, 'name'>[]) =>
  listOf(counsellors.map((p) => p.name.split(' ')[0]), 'or');

/** Whole words of `s`, as many as fit `max` (by metaLength), ending in "…". */
export const cutAtWord = (s: string, max: number): string => {
  const words = s.replace(/[.!?]$/, '').split(' ');
  let out = '';
  for (const w of words) {
    const next = out ? `${out} ${w}` : w;
    if (metaLength(`${next}…`) > max) break;
    out = next;
  }
  return `${out.replace(/[,;:]$/, '')}…`;
};

/** The longest run of `s` ending where a whole clause ends that fits `max`,
 *  closed with a full stop: at a semicolon or colon, or at a comma before a
 *  coordinating "and", "but", "so", "yet", "which", "because" or "while".
 *  A bare comma is never a cut point, and neither is any comma in a sentence
 *  that opens on a subordinate clause ("When anxiety attaches to driving,"),
 *  because the head would be a fragment. The Surrey EMDR angle is why this
 *  exists: cut at a word, it published "finding one who also works in
 *  Punjabi has been…" beside a counsellor who does not. */
const SUBORDINATE_OPENING = /^(When|If|Although|Though|Because|While|Once|Since|After|Before|As|With|Unless|Until|Where)\b/;
export const cutAtClause = (s: string, max: number): string | undefined => {
  let best: string | undefined;
  const commaOk = !SUBORDINATE_OPENING.test(s);
  for (const m of s.matchAll(/[;:](?=\s)|,(?= (?:and|but|so|yet|which|because|while) )/g)) {
    if (m[0] === ',' && !commaOk) continue;
    const head = `${s.slice(0, m.index)}.`;
    if (metaLength(head) <= max) best = head;
  }
  return best;
};

export const cityServiceDescription = (args: {
  angle: string;
  counsellors: Pick<Practitioner, 'name'>[];
  facts?: string;
  max?: number;
}): string => {
  const { angle, counsellors, facts, max = 158 } = args;
  const lead = firstSentenceOf(angle);
  const names = counsellors.length ? firstNames(counsellors) : '';
  const tail = (withNames: boolean) => {
    if (!facts) return withNames && names ? ` With ${names}.` : '';
    return withNames && names ? ` With ${names}, ${facts}.` : ` ${facts.charAt(0).toUpperCase()}${facts.slice(1)}.`;
  };
  const full = `${lead}${tail(true)}`;
  if (metaLength(full) <= max) return full;
  if (counsellors.length > 1) {
    const unnamed = `${lead}${tail(false)}`;
    if (metaLength(unnamed) <= max) return unnamed;
  }
  const keep = counsellors.length > 1 ? tail(false) : tail(true);
  return `${cutAtClause(lead, max - metaLength(keep)) ?? cutAtWord(lead, max - metaLength(keep))}${keep}`;
};

/* WHAT IS LEFT OF THE GENERATED FAQS — 3 Oct 2026.
 *
 * Three questions were generated here on 1 Oct: who you would see, whether the
 * places around the city count, and what it costs. In the built FAQPage across
 * the 127 /online-counselling pages the first and the last each appeared 80
 * times (plus 20 trauma variants), and "Questions from <city>" became the
 * largest shared block on these pages. The counsellor cards above the FAQs
 * already name who you would see, so that question went. The cost answer's
 * fee, the association range and the coverage sentence moved into the fee
 * line under the cards (guideNote below, and COVERAGE_LINE), so they are said
 * once per page rather than twice. The city hubs keep their own "Who would I
 * see" (lib/city-hub.ts). */
export function generatedFaqs(args: {
  topic: Pick<CityTopic, 'name'>;
  ctx: Pick<CityContext, 'city' | 'authority'>;
  loc: Pick<Location, 'communities'>;
}): { q: string; a: string }[] {
  const { topic, ctx, loc } = args;
  const svc = lower(topic.name);
  if (!loc.communities?.length) return [];
  return [{
    q: `Is ${svc} available in ${listOf(loc.communities, 'or')}?`,
    a: `Yes. ${topic.name} by secure video reaches ${listOf(loc.communities, 'and')} exactly as it reaches ${ctx.city}: there is no office to get to and the same fee applies however far out you are. ${ctx.authority} is the public route for ${ctx.city} and the rest of its region; this is the private one, and it needs no referral.`,
  }];
}

/* The association's range beside the fee line, 1 Oct 2026 (lib/fee-guides.ts),
   moved here from the cost FAQ on 3 Oct: individual and couples only; weekly
   EMDR has no separate published figure. Empty when there is none. */
export const guideNote = (bookingService: string): string => {
  const guide = GUIDE_FOR_SERVICE[bookingService];
  return guide ? ` (BCACC’s 2026 fee guide recommends ${guide.range})` : '';
};

/* The coverage sentence the cost FAQ carried, now said once, in the fee line. */
export const COVERAGE_LINE =
  'Many BC extended health plans reimburse a Registered Clinical Counsellor; whether yours does is plan-dependent, so check it for the RCC designation before the first paid session.';

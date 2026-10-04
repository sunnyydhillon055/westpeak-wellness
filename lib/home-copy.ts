/* THE HOME PAGE'S GENERATED SENTENCES — 1 Oct 2026.
 *
 * Production at 375x812 on 1 Oct: the hero lede was one 37-word sentence
 * naming nobody and no fee. The first dollar figure sat at y=7142 of 11,848
 * and the counsellors first appeared at y=2409, on the page that is both the
 * largest organic landing page (54 of 164 GSC clicks) and the top source of
 * book_clicks (12 of 34). These build the replacement from the roster and the
 * catalogue, so nothing in them is typed: who you would talk to, in which
 * languages, which kinds of work only one of them does, and what it costs.
 *
 * Pure and structurally typed, with no imports, so the tests run under plain
 * node and a client component could never pull the roster in through here.
 * The caller passes the accepting, bookable counsellors only, which is the
 * rule that keeps the founder off the home page (she is not accepting). No
 * hours, no outcome claims, no coverage wording. */

export type LedePerson = {
  name: string;
  languages: readonly { name: string }[];
  services: readonly string[];
  credentials: readonly { short: string }[];
};

const firstOf = (p: { name: string }) => p.name.split(' ')[0]!;

/** "a", "a or b", "a, b or c". */
export const orList = (xs: readonly string[]): string =>
  xs.length <= 2 ? xs.join(' or ') : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`;
/** "a", "a and b", "a, b and c". */
export const andList = (xs: readonly string[]): string =>
  xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

/** "Talk by video with Camille Granda (English or Tagalog) or Savneet Singh
 *  (English or Punjabi), both Registered Clinical Counsellors, from anywhere
 *  in BC." Null when nobody is accepting. The designation is said only when
 *  every one of them holds it. */
export function whoSentence(people: readonly LedePerson[]): string | null {
  if (!people.length) return null;
  const names = orList(people.map((p) => `${p.name} (${orList(p.languages.map((l) => l.name))})`));
  const allRcc = people.every((p) => p.credentials.some((c) => c.short === 'RCC'));
  const rcc = !allRcc ? ''
    : people.length === 1 ? ', a Registered Clinical Counsellor,'
    : people.length === 2 ? ', both Registered Clinical Counsellors,'
    : ', all Registered Clinical Counsellors,';
  return `Talk by video with ${names}${rcc} from anywhere in BC.`;
}

/** "Couples counselling and EMDR are with Camille." For each kind of work
 *  that some but not all of the counsellors offer, who offers it; work that
 *  everybody offers, or nobody does, is not mentioned. Null when there is
 *  nothing to say. */
export function onlyWithSentence(
  people: readonly LedePerson[],
  kinds: readonly { slug: string; label: string }[],
): string | null {
  const groups = new Map<string, string[]>();
  for (const k of kinds) {
    const offering = people.filter((p) => p.services.includes(k.slug));
    if (!offering.length || offering.length === people.length) continue;
    const who = orList(offering.map(firstOf));
    groups.set(who, [...(groups.get(who) ?? []), k.label]);
  }
  if (!groups.size) return null;
  return [...groups.entries()]
    .map(([who, labels]) => `${andList(labels)} ${labels.length > 1 ? 'are' : 'is'} with ${who}.`)
    .join(' ');
}

/** "Camille also offers EMDR", or null when everyone or nobody does. */
export function alsoOffers(people: readonly LedePerson[], slug: string, label: string): string | null {
  const offering = people.filter((p) => p.services.includes(slug));
  if (!offering.length || offering.length === people.length) return null;
  return `${andList(offering.map(firstOf))} also ${offering.length > 1 ? 'offer' : 'offers'} ${label}`;
}

/** "It starts with a free 15-minute call; sessions after that are $140 for
 *  50 minutes ($175 for a couple)." Every figure is passed in from the
 *  catalogue; the couples fee is said only when somebody offers couples work. */
export function feeSentence(f: {
  consultMinutes: number | undefined;
  individual: string;
  minutes: number | undefined;
  couples?: string | null;
}): string {
  const call = f.consultMinutes ? `a free ${f.consultMinutes}-minute call` : 'a free consultation';
  const length = f.minutes ? ` for ${f.minutes} minutes` : '';
  const couple = f.couples ? ` (${f.couples} for a couple)` : '';
  return `It starts with ${call}; sessions after that are ${f.individual}${length}${couple}.`;
}

/** The sentence of a counsellor's own intro that contains `marker`, or null.
 *  Used to quote her in her own words rather than retype them. */
export function ownWords(intro: readonly string[], marker: string): string | null {
  for (const para of intro) {
    for (const s of para.split(/(?<=[.!?])\s+/)) if (s.includes(marker)) return s.trim();
  }
  return null;
}

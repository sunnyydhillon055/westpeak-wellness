/* The pure half of components/NextConsultLine.tsx, so it can be tested
   without Next or Cliniko. Takes the availability record and the roster and
   returns, per counsellor taking new clients and bookable online, the first
   open day Cliniko offers, e.g. "Thu 2 Oct from 10 am". Entries with an
   error or no times are dropped, so a failure prints nothing.

   Two optional filters, added 1 Oct 2026 when the line spread past the one
   guide it was written for:
     - `slugs`: only these counsellors. A city x service page about couples
       work passes the counsellors who offer it, so the line never offers a
       time with somebody who does not do the work the page is about.
     - `language`: only counsellors who work in this language (a BCP-47 tag
       from the roster, 'pa' or 'tl'). The Punjabi words page shows the
       Punjabi-speaking counsellor and nobody else.
   Both narrow; neither can add anybody the accepting/bookable rule left out. */

type Slot = { slug: string; count: number; next: string[]; error?: string };
type Person = {
  slug: string;
  name: string;
  acceptingNewClients: boolean;
  bookable: boolean;
  languages?: { tag: string }[];
};

export type NextConsult = { slug: string; first: string; when: string };
export type NextConsultFilter = { slugs?: readonly string[]; language?: string };

export function nextConsultEntries(
  all: Record<string, Slot | null | undefined> | null | undefined,
  roster: Person[],
  filter: NextConsultFilter = {},
): NextConsult[] {
  if (!all) return [];
  const out: NextConsult[] = [];
  for (const p of roster) {
    if (!p.acceptingNewClients || !p.bookable) continue;
    if (filter.slugs && !filter.slugs.includes(p.slug)) continue;
    if (filter.language && !(p.languages ?? []).some((l) => l.tag === filter.language)) continue;
    const a = all[p.slug];
    if (!a || a.error || a.count <= 0 || !a.next?.length) continue;
    const when = a.next[0]!.replace(/\s*\(\d+ times?\)\s*$/, '').trim();
    if (!when) continue;
    out.push({ slug: p.slug, first: p.name.split(' ')[0]!, when });
  }
  return out;
}

/** The label the line prints before the times. Every time it lists is
 *  Pacific (lib/availability-summary.ts formats them in America/Vancouver),
 *  and a reader in Calgary or Cranbrook is an hour ahead, so it says so. */
export const NEXT_CONSULT_LABEL = 'Next free 30-minute consultation (Pacific time):';

/* WHEN NOTHING IS OPEN, SAY SO — 2 Oct 2026.
   With consults on two days a week, "no time in the next fourteen days" is an
   ordinary state, and until now it looked exactly like Cliniko being down:
   the line printed nothing. This tells the two apart. It returns the
   counsellors the line would have named only when every one of them was read
   successfully and has no time open; any error or missing entry (no key,
   timeout, cold cache) returns [] and the line still prints nothing. It never
   names a day or an hour, only that the two-week window is empty. */
export type NoConsult = { slug: string; first: string };

export function nextConsultNoneOpen(
  all: Record<string, Slot | null | undefined> | null | undefined,
  roster: Person[],
  filter: NextConsultFilter = {},
): NoConsult[] {
  if (!all) return [];
  const out: NoConsult[] = [];
  for (const p of roster) {
    if (!p.acceptingNewClients || !p.bookable) continue;
    if (filter.slugs && !filter.slugs.includes(p.slug)) continue;
    if (filter.language && !(p.languages ?? []).some((l) => l.tag === filter.language)) continue;
    const a = all[p.slug];
    if (!a || a.error || a.count > 0 || (a.next?.length ?? 0) > 0) return [];
    out.push({ slug: p.slug, first: p.name.split(' ')[0]! });
  }
  return out;
}

/** The sentence before the "ask for a time" link, for one or several counsellors. */
export function noConsultSentence(people: readonly NoConsult[]): string | null {
  if (!people.length) return null;
  const names = people.map((p) => p.first);
  const who = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`;
  return `No free consultation is open with ${who} in the next two weeks.`;
}

/** Where the ask link goes: the named counsellor's form on /book when there is one. */
export function askForTimeHref(people: readonly NoConsult[], bookingPath = '/book'): string {
  return people.length === 1 ? `${bookingPath}?with=${people[0]!.slug}#ask-for-a-time` : `${bookingPath}#ask-for-a-time`;
}

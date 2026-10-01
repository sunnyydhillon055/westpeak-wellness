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

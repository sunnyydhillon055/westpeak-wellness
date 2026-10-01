/* The pure half of components/NextConsultLine.tsx, so it can be tested
   without Next or Cliniko. Takes the availability record and the roster and
   returns, per counsellor taking new clients and bookable online, the first
   open day Cliniko offers, e.g. "Thu 2 Oct from 10 am". Entries with an
   error or no times are dropped, so a failure prints nothing. */

type Slot = { slug: string; count: number; next: string[]; error?: string };
type Person = { slug: string; name: string; acceptingNewClients: boolean; bookable: boolean };

export type NextConsult = { slug: string; first: string; when: string };

export function nextConsultEntries(
  all: Record<string, Slot | null | undefined> | null | undefined,
  roster: Person[],
): NextConsult[] {
  if (!all) return [];
  const out: NextConsult[] = [];
  for (const p of roster) {
    if (!p.acceptingNewClients || !p.bookable) continue;
    const a = all[p.slug];
    if (!a || a.error || a.count <= 0 || !a.next?.length) continue;
    const when = a.next[0]!.replace(/\s*\(\d+ times?\)\s*$/, '').trim();
    if (!when) continue;
    out.push({ slug: p.slug, first: p.name.split(' ')[0]!, when });
  }
  return out;
}

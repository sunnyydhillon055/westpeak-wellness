import { unstable_cache } from 'next/cache';
import { api, headers } from './cliniko.ts';
import { CLINIKO_BUSINESS, CONSULT_TYPE } from './site.ts';
import { practitioners } from './practitioners.ts';

/* WHAT IS ACTUALLY OPEN THIS WEEK — read from Cliniko, 14 Sep 2026.
 *
 * The site publishes no hours by decision: they depend on which counsellor a
 * person sees and only Cliniko knows what is open. That left every page
 * silent about the one thing a prospective client wants to know before
 * they bother — can I be seen soon? This module answers it with the truth:
 * the free-consultation slots Cliniko will actually offer in the next seven
 * days, per counsellor, summarised as a count, the days, and the span of
 * hours. Nothing here is typed by a person, so it cannot go stale.
 *
 * Cached for thirty minutes. A miss (no key, API down) returns null and the
 * pages say nothing rather than something wrong. Times are converted to
 * Pacific for display; Cliniko returns UTC. */

export type Availability = {
  slug: string;
  count: number;
  /** Weekday names with at least one slot, in order Mon..Sun. */
  days: string[];
  earliest: string; // e.g. "9 am"
  latest: string;   // e.g. "7 pm"
  weekend: boolean;
  evening: boolean; // any slot starting 5 pm or later
};

const pacific = (iso: string) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(d);
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  return { wd, hour };
};
const fmtHour = (h: number) => (h === 0 ? '12 am' : h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`);

async function fetchOne(slug: string, practitionerId: string): Promise<Availability | null> {
  const a = api();
  if (!a) return null;
  const from = new Date();
  const to = new Date(from.getTime() + 7 * 86_400_000);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const url =
    `https://api.${a.shard}.cliniko.com/v1/businesses/${CLINIKO_BUSINESS}/practitioners/${practitionerId}` +
    `/appointment_types/${CONSULT_TYPE}/available_times?from=${day(from)}&to=${day(to)}`;
  try {
    const res = await fetch(url, { headers: headers(a.key), cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { available_times?: { appointment_start: string }[] };
    const starts = (body.available_times ?? []).map((t) => t.appointment_start).filter(Boolean);
    if (!starts.length) return { slug, count: 0, days: [], earliest: '', latest: '', weekend: false, evening: false };
    const seen = new Set<string>();
    let lo = 24, hi = -1, weekend = false, evening = false;
    for (const s of starts) {
      const { wd, hour } = pacific(s);
      seen.add(wd);
      lo = Math.min(lo, hour); hi = Math.max(hi, hour);
      if (wd === 'Sat' || wd === 'Sun') weekend = true;
      if (hour >= 17) evening = true;
    }
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter((d) => seen.has(d));
    return { slug, count: starts.length, days, earliest: fmtHour(lo), latest: fmtHour(hi), weekend, evening };
  } catch {
    return null;
  }
}

/** Availability for every counsellor who is bookable online; null entries where Cliniko could not be read. */
export const consultationAvailability = unstable_cache(
  async (): Promise<Record<string, Availability | null>> => {
    const out: Record<string, Availability | null> = {};
    for (const p of practitioners) {
      if (!p.bookable || !p.clinikoPractitionerId || !p.acceptingNewClients) continue;
      out[p.slug] = await fetchOne(p.slug, p.clinikoPractitionerId);
    }
    return out;
  },
  ['consultation-availability'],
  { revalidate: 1800 },
);

/** One sentence for a counsellor, or null when nothing honest can be said. */
export function availabilityLine(a: Availability | null | undefined, first: string): string | null {
  if (!a) return null;
  if (a.count === 0) return `${first} has no free-consultation times in the next seven days; the calendar shows the next ones.`;
  const days = a.days.length >= 5 ? `${a.days[0]} to ${a.days[a.days.length - 1]}` : a.days.join(', ');
  return `${a.count} free-consultation ${a.count === 1 ? 'time' : 'times'} open with ${first} in the next seven days: ${days}, ${a.earliest} to ${a.latest}${a.weekend ? ', including the weekend' : ''}.`;
}

/** Practice-wide summary across everyone bookable, or null. */
export function practiceHoursLine(all: Record<string, Availability | null>): string | null {
  const as = Object.values(all).filter((a): a is Availability => Boolean(a) && a!.count > 0);
  if (!as.length) return null;
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = order.filter((d) => as.some((a) => a.days.includes(d)));
  const toH = (s: string) => { const [n, ap] = s.split(' '); const h = Number(n) % 12; return ap === 'pm' ? h + 12 : h; };
  const lo = Math.min(...as.map((a) => toH(a.earliest)));
  const hi = Math.max(...as.map((a) => toH(a.latest)));
  const span = days.length >= 5 ? `${days[0]} to ${days[days.length - 1]}` : days.join(', ');
  return `Appointments are set by each counsellor's own calendar. This week: ${span}, ${fmtHour(lo)} to ${fmtHour(hi)}${as.some((a) => a.evening) ? ', with evenings' : ''}${as.some((a) => a.weekend) ? ' and weekend times' : ''}.`;
}

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
  /** The first few open times, already in Pacific time, e.g. "Thu 18 Sep, 10:00 am". */
  next: string[];
  /** Set when Cliniko could not be read; count is then 0 and the pages print nothing. */
  error?: string;
};

const pacific = (iso: string) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(d);
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  return { wd, hour };
};
const fmtHour = (h: number) => (h === 0 ? '12 am' : h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`);

const empty = (slug: string, error?: string): Availability => ({ slug, count: 0, days: [], earliest: '', latest: '', weekend: false, evening: false, next: [], ...(error ? { error } : {}) });

/* "Thu 18 Sep, 10:00 am" in Vancouver time. Concrete times on the booking
   page are the difference between "is there anything this week" and a click:
   the conversion log for August to September showed 73 people reaching the
   calendar, 38 interacting with it, and next to none booking, and one of the
   likeliest reasons is finding, two screens in, that the two open days are
   not theirs. Saying the days and times before the click is honest and
   cheap. */
const dayOf = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso)).replace(/\.,?/g, '');
const timeOf = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso))
    .replace(/\s?([ap])\.?m\.?/i, ' $1m').replace(':00 ', ' ');
/* One line per open day, first time on it, for up to three days: "Sat 19 Sep
   from 9 am (22 times)". Three consecutive half-hours on one day, which is
   what a raw slot list gives, tells nobody anything they can plan around. */
function nextByDay(starts: string[]): string[] {
  const byDay = new Map<string, string[]>();
  for (const s of [...starts].sort()) {
    const d = dayOf(s);
    if (!byDay.has(d)) byDay.set(d, []);
    byDay.get(d)!.push(s);
  }
  return [...byDay.entries()].slice(0, 3).map(([d, ss]) => `${d} from ${timeOf(ss[0]!)}${ss.length > 1 ? ` (${ss.length} times)` : ''}`);
}

async function fetchOne(slug: string, practitionerId: string): Promise<Availability> {
  const a = api();
  if (!a) return empty(slug, 'no Cliniko key');
  const from = new Date();
  /* Seven days inclusive of today; Cliniko caps the window at a week. */
  const to = new Date(from.getTime() + 6 * 86_400_000);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const url =
    `https://api.${a.shard}.cliniko.com/v1/businesses/${CLINIKO_BUSINESS}/practitioners/${practitionerId}` +
    `/appointment_types/${CONSULT_TYPE}/available_times?from=${day(from)}&to=${day(to)}`;
  try {
    /* No cache option on the fetch: unstable_cache around this function owns
       the freshness, and a no-store fetch inside it is refused by Next 14. */
    const res = await fetch(url, { headers: headers(a.key) });
    if (!res.ok) return empty(slug, `HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
    const body = (await res.json()) as { available_times?: { appointment_start: string }[] };
    const starts = (body.available_times ?? []).map((t) => t.appointment_start).filter(Boolean);
    if (!starts.length) return empty(slug);
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
    const next = nextByDay(starts);
    return { slug, count: starts.length, days, earliest: fmtHour(lo), latest: fmtHour(hi), weekend, evening, next };
  } catch (e) {
    return empty(slug, e instanceof Error ? e.message : 'request failed');
  }
}

/** Availability for every counsellor who is bookable online, uncached; an `error` on an entry says why it is empty. */
export async function consultationAvailabilityNow(): Promise<Record<string, Availability>> {
  const out: Record<string, Availability> = {};
  for (const p of practitioners) {
    if (!p.bookable || !p.clinikoPractitionerId || !p.acceptingNewClients) continue;
    out[p.slug] = await fetchOne(p.slug, p.clinikoPractitionerId);
  }
  return out;
}

/** The same, cached thirty minutes, for the public pages. */
export const consultationAvailability = unstable_cache(
  consultationAvailabilityNow,
  /* v2: the shape gained `next` on 17 Sep 2026; a cached v1 object would
     have no such field. */
  ['consultation-availability-v2'],
  { revalidate: 1800 },
);

/** One sentence for a counsellor, or null when nothing honest can be said. */
export function availabilityLine(a: Availability | null | undefined, first: string): string | null {
  if (!a || a.error) return null;
  if (a.count === 0) return `${first} has no free-consultation times in the next seven days; the calendar shows the next ones.`;
  const days = a.days.length >= 5 ? `${a.days[0]} to ${a.days[a.days.length - 1]}` : a.days.join(', ');
  return `${a.count} free-consultation ${a.count === 1 ? 'time' : 'times'} open with ${first} in the next seven days: ${days}, ${a.earliest} to ${a.latest}${a.weekend ? ', including the weekend' : ''}.`;
}

/** Just the span: "Tue, Thu, Fri, Sat, 9 am to 7 pm", or null. For the home hero, where a sentence is too long. */
export function weekSpan(all: Record<string, Availability | null>): string | null {
  const as = Object.values(all).filter((a): a is Availability => Boolean(a) && !a!.error && a!.count > 0);
  if (!as.length) return null;
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = order.filter((d) => as.some((a) => a.days.includes(d)));
  const toH = (s: string) => { const [n, ap] = s.split(' '); const h = Number(n) % 12; return ap === 'pm' ? h + 12 : h; };
  const lo = Math.min(...as.map((a) => toH(a.earliest)));
  const hi = Math.max(...as.map((a) => toH(a.latest)));
  const span = days.length >= 5 ? `${days[0]} to ${days[days.length - 1]}` : days.join(', ');
  return `${span}, ${fmtHour(lo)} to ${fmtHour(hi)}`;
}

/** Practice-wide summary across everyone bookable, or null. */
export function practiceHoursLine(all: Record<string, Availability | null>): string | null {
  const as = Object.values(all).filter((a): a is Availability => Boolean(a) && !a!.error && a!.count > 0);
  if (!as.length) return null;
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = order.filter((d) => as.some((a) => a.days.includes(d)));
  const toH = (s: string) => { const [n, ap] = s.split(' '); const h = Number(n) % 12; return ap === 'pm' ? h + 12 : h; };
  const lo = Math.min(...as.map((a) => toH(a.earliest)));
  const hi = Math.max(...as.map((a) => toH(a.latest)));
  const span = days.length >= 5 ? `${days[0]} to ${days[days.length - 1]}` : days.join(', ');
  return `Appointments are set by each counsellor's own calendar. This week: ${span}, ${fmtHour(lo)} to ${fmtHour(hi)}${as.some((a) => a.evening) ? ', with evenings' : ''}${as.some((a) => a.weekend) ? ' and weekend times' : ''}.`;
}

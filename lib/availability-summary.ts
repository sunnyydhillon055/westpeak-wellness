import { formatPacific, pacificParts, offsetMinutes, PACIFIC_ZONE } from './pacific-time.ts';

/* The pure half of lib/cliniko-availability.ts: the shape, the summary of
 * a list of slot starts, and the sentences the pages print. No fetch, no
 * next/cache, no roster, so test/book-page.test.mts can import it under
 * plain node. Split out 1 Oct 2026 when the window became two weeks. */

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
  /** The first seven days alone, for a line that says "this week". */
  week?: { count: number; days: string[]; earliest: string; latest: string };
};

/* PACIFIC TIME, SAID — 1 Oct 2026.
   Every time below is formatted in Pacific time (lib/pacific-time.ts) and none of them said
   so. Camille is listed for Alberta, and a reader in Calgary, Cranbrook or
   Dawson Creek reading "10 am" as their own clock books the wrong hour. The
   label goes on every sentence that prints a clock time: the /book lines,
   the home hero, /contact and the next-consultation line. It labels the
   times Cliniko offers; it is not an hours claim. */
export const PACIFIC = ' (Pacific time)';

/** The one sentence under the /book calendar about other clocks. Pure apart
 *  from Intl: the page passes the accepting counsellors' insured provinces,
 *  and `at` is the day the page is rendered.
 *
 *  COMPUTED, NOT TYPED — 2 Oct 2026. It used to say "Creston and the Peace
 *  region are one hour ahead from November to March". From 1 Nov 2026 BC
 *  stays on UTC-7, which is the clock Creston and the Peace (Dawson Creek,
 *  Fort St. John, Fort Nelson) keep all year, so that clause became false.
 *  Sources disagree on Alberta's winter offset, so nothing here is typed:
 *  it compares the UTC offsets of Pacific time (lib/pacific-time.ts, right
 *  even on stale tz data), America/Edmonton (Alberta and most of the East
 *  Kootenay) and America/Creston on the day shown, and names a place only
 *  when its clock differs from Pacific today. */
export function timeZoneNote(provinces: readonly string[], at: Date | string | number = new Date()): string {
  const pac = offsetMinutes(PACIFIC_ZONE, at);
  const clauses: string[] = [];
  const edm = offsetMinutes('America/Edmonton', at) - pac;
  if (edm !== 0) {
    clauses.push(provinces.includes('AB')
      ? `Alberta and most of the East Kootenay are ${hoursApart(edm)} today`
      : `most of the East Kootenay is ${hoursApart(edm)} today`);
  }
  const cre = offsetMinutes('America/Creston', at) - pac;
  if (cre !== 0) clauses.push(`Creston and the Peace region are ${hoursApart(cre)} today`);
  return `Times on this page are Pacific time${clauses.length ? ` (${clauses.join('; ')})` : ''}.`;
}

/** "one hour ahead", "one hour behind", "2 hours ahead". */
export function hoursApart(minutes: number): string {
  const h = Math.abs(minutes) / 60;
  const n = h === 1 ? 'one hour' : `${Number.isInteger(h) ? h : h.toFixed(1)} hours`;
  return `${n} ${minutes > 0 ? 'ahead' : 'behind'}`;
}

/** How many days the summary covers. Two Cliniko requests of seven. */
export const WINDOW_DAYS = 14;

const pacific = (iso: string) => {
  const parts = pacificParts(iso, { weekday: 'short', hour: 'numeric', hour12: false });
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0') % 24;
  return { wd, hour };
};
const fmtHour = (h: number) => (h === 0 ? '12 am' : h < 12 ? `${h} am` : h === 12 ? '12 pm' : `${h - 12} pm`);

export const empty = (slug: string, error?: string): Availability => ({ slug, count: 0, days: [], earliest: '', latest: '', weekend: false, evening: false, next: [], ...(error ? { error } : {}) });

/* "Thu 18 Sep, 10:00 am" in Vancouver time. Concrete times on the booking
   page are the difference between "is there anything this week" and a click:
   the conversion log for August to September showed 73 people reaching the
   calendar, 38 interacting with it, and next to none booking, and one of the
   likeliest reasons is finding, two screens in, that the two open days are
   not theirs. Saying the days and times before the click is honest and
   cheap. */
const dayOf = (iso: string) =>
  formatPacific(iso, { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.,?/g, '');
const timeOf = (iso: string) =>
  formatPacific(iso, { hour: 'numeric', minute: '2-digit', hour12: true })
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

const ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Count, weekdays and span of a list of slot starts. Pure; exported for the tests. */
export function summarise(slug: string, starts: string[]): Availability {
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
  const days = ORDER.filter((d) => seen.has(d));
  return { slug, count: starts.length, days, earliest: fmtHour(lo), latest: fmtHour(hi), weekend, evening, next: nextByDay(starts) };
}

/** The 14-day summary, with the first seven days kept as `week`. */
export function summariseWindows(slug: string, firstWeek: string[], secondWeek: string[]): Availability {
  const all = summarise(slug, [...firstWeek, ...secondWeek]);
  const w = summarise(slug, firstWeek);
  return { ...all, week: { count: w.count, days: w.days, earliest: w.earliest, latest: w.latest } };
}

/* NO SPAN, NO WEEKEND, ANYWHERE — 1 Oct 2026, under the 6 Sep no-hours rule.
 *
 * These lines used to print the earliest and latest start times and ",
 * including the weekend": on /book's cards, as a practice-wide line on /book
 * and /contact, and in the home hero. The practice-wide forms merged two
 * calendars into a span no single day offered (production, 1 Oct: home said
 * "Tue, Thu, Sat, 9 am to 7 pm" while Savneet's times were Tue/Fri afternoons
 * and Camille's Thu/Sat). A span of start times reads as hours, and the rule
 * is no hours line at all, not a vaguer one. What is left is what Cliniko
 * actually offers: how many times are open with one counsellor, and the next
 * day that has one. weekSpan and practiceHoursLine are gone; the test in
 * test/no-hours-metadata.test.mts fails if "am to", "pm to" or "weekend"
 * comes back in either line below. */

/** "Thu 2 Oct": the day of the first open time, from `next`. */
export const firstOpenDay = (a: Availability | null | undefined): string | null => {
  const n = a && !a.error && a.count > 0 ? a.next[0] : undefined;
  return n ? n.split(' from ')[0]!.trim() : null;
};

/** One sentence for a counsellor, or null when nothing honest can be said. */
export function availabilityLine(a: Availability | null | undefined, first: string): string | null {
  if (!a || a.error) return null;
  /* The card is one link, so this cannot hold another; it points at the
     ask-for-a-time form under the calendar instead (2 Oct 2026). */
  if (a.count === 0) return `${first} has no free-consultation times in the next two weeks; the calendar shows later ones, or ask for a time with the form under it.`;
  const day = firstOpenDay(a);
  return `${a.count} free-consultation ${a.count === 1 ? 'time' : 'times'} open with ${first} in the next two weeks${day ? `; next: ${day}${PACIFIC}` : ''}.`;
}

/** The home hero: "Next free call: Sat 3 Oct with Camille · Tue 6 Oct with
 *  Savneet (Pacific time)", one entry per accepting counsellor with a time
 *  open, in the order given. Null when nobody has one or Cliniko is down. */
export function nextFreeCallLine(
  all: Record<string, Availability | null | undefined>,
  people: readonly { slug: string; first: string }[],
): string | null {
  const parts = nextFreeCallEntries(all, people).map((x) => `${x.day} with ${x.first}`);
  return parts.length ? `Next free call: ${parts.join(' · ')}${PACIFIC}` : null;
}

/** The same entries unjoined, so the home hero can link each one to that
 *  counsellor's calendar (2 Oct 2026). A day only, never an hour. */
export function nextFreeCallEntries(
  all: Record<string, Availability | null | undefined>,
  people: readonly { slug: string; first: string }[],
): { slug: string; first: string; day: string }[] {
  return people
    .map((p) => ({ slug: p.slug, first: p.first, day: firstOpenDay(all[p.slug]) }))
    .filter((x): x is { slug: string; first: string; day: string } => Boolean(x.day));
}

/* THE LAST GOOD READ, NOT THE LAST FAILURE — 2 Oct 2026.
 *
 * lib/cliniko-availability.ts used to store a failed read (an `error` entry)
 * in the thirty-minute cache, so one eight-second Cliniko stall blanked the
 * next-consultation line on the home hero, /book, every hub and every city x
 * service page for half an hour. The cached function now throws instead, and
 * Next 14.2's unstable_cache keeps serving the previous value when a
 * background revalidation throws. The stored value carries `readAt`, and a
 * reader drops it once it is older than six hours, so a long outage ends in
 * silence rather than in times that have since been taken. */
export type StoredAvailability = { readAt: number; all: Record<string, Availability> };
export const MAX_READ_AGE_MS = 6 * 3_600_000;

/** The first error among the entries, or null when every read succeeded. */
export function firstReadError(all: Record<string, Availability>): string | null {
  for (const [slug, a] of Object.entries(all)) if (a.error) return `${slug}: ${a.error}`;
  return null;
}

/** The stored entries while they are under six hours old, otherwise {}. */
export function freshAvailability(
  stored: StoredAvailability | null | undefined,
  now: number = Date.now(),
): Record<string, Availability> {
  if (!stored || typeof stored.readAt !== 'number' || !stored.all) return {};
  const age = now - stored.readAt;
  return age >= 0 && age <= MAX_READ_AGE_MS ? stored.all : {};
}

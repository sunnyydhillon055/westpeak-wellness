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
   Every time below is formatted in America/Vancouver and none of them said
   so. Camille is listed for Alberta, and a reader in Calgary, Cranbrook or
   Dawson Creek reading "10 am" as their own clock books the wrong hour. The
   label goes on every sentence that prints a clock time: the /book lines,
   the home hero, /contact and the next-consultation line. It labels the
   times Cliniko offers; it is not an hours claim. */
export const PACIFIC = ' (Pacific time)';

/** The one sentence under the /book calendar about other clocks, or the
 *  BC-only half of it when nobody accepting is insured for Alberta. Pure:
 *  the page passes the accepting counsellors' insured provinces.
 *
 *  The facts, which are BC's and Alberta's and not the practice's: Alberta
 *  keeps Mountain time with daylight saving, an hour ahead of Vancouver all
 *  year, and so does most of the East Kootenay (Cranbrook, Golden,
 *  Invermere). Creston and the Peace region (Dawson Creek, Fort St. John,
 *  Fort Nelson) keep Mountain Standard Time all year: the same clock as
 *  Vancouver in summer, an hour ahead from November to March. */
export function timeZoneNote(provinces: readonly string[]): string {
  const ahead = provinces.includes('AB')
    ? 'Alberta and most of the East Kootenay are one hour ahead'
    : 'most of the East Kootenay is one hour ahead';
  return `Times on this page are Pacific time: ${ahead}, and Creston and the Peace region are one hour ahead from November to March.`;
}

/** How many days the summary covers. Two Cliniko requests of seven. */
export const WINDOW_DAYS = 14;

const pacific = (iso: string) => {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(d);
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
  if (a.count === 0) return `${first} has no free-consultation times in the next two weeks; the calendar shows the next ones.`;
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
  const parts = people
    .map((p) => ({ first: p.first, day: firstOpenDay(all[p.slug]) }))
    .filter((x): x is { first: string; day: string } => Boolean(x.day))
    .map((x) => `${x.day} with ${x.first}`);
  return parts.length ? `Next free call: ${parts.join(' · ')}${PACIFIC}` : null;
}

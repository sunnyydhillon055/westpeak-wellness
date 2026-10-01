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

/** One sentence for a counsellor, or null when nothing honest can be said. */
export function availabilityLine(a: Availability | null | undefined, first: string): string | null {
  if (!a || a.error) return null;
  if (a.count === 0) return `${first} has no free-consultation times in the next two weeks; the calendar shows the next ones.`;
  const days = a.days.length >= 5 ? `${a.days[0]} to ${a.days[a.days.length - 1]}` : a.days.join(', ');
  return `${a.count} free-consultation ${a.count === 1 ? 'time' : 'times'} open with ${first} in the next two weeks: ${days}, ${a.earliest} to ${a.latest}${PACIFIC}${a.weekend ? ', including the weekend' : ''}.`;
}

/** Just the span: "Tue, Thu, Fri, Sat, 9 am to 7 pm", or null. For the home hero, where a sentence is too long.
 *  The first seven days only (`week`), because the hero says "Open this week". */
export function weekSpan(all: Record<string, Availability | null>): string | null {
  const as = Object.values(all)
    .filter((a): a is Availability => Boolean(a) && !a!.error)
    .map((a) => (a.week ? { ...a, ...a.week } : a))
    .filter((a) => a.count > 0);
  if (!as.length) return null;
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = order.filter((d) => as.some((a) => a.days.includes(d)));
  const toH = (s: string) => { const [n, ap] = s.split(' '); const h = Number(n) % 12; return ap === 'pm' ? h + 12 : h; };
  const lo = Math.min(...as.map((a) => toH(a.earliest)));
  const hi = Math.max(...as.map((a) => toH(a.latest)));
  const span = days.length >= 5 ? `${days[0]} to ${days[days.length - 1]}` : days.join(', ');
  return `${span}, ${fmtHour(lo)} to ${fmtHour(hi)}${PACIFIC}`;
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
  /* No ", with evenings" since 1 Oct 2026. The span is of slot STARTS, so a
     latest start of 6 pm printed "9 am to 6 pm, with evenings": a range that
     reads as closing at six, followed by a claim that it does not. The span
     already says how late the times go; the extra words were a claim on top
     of the data, and nothing here may say more than Cliniko does. */
  return `Appointments are set by each counsellor's own calendar. Next two weeks: ${span}, start times ${fmtHour(lo)} to ${fmtHour(hi)}${PACIFIC}${as.some((a) => a.weekend) ? ', including the weekend' : ''}.`;
}

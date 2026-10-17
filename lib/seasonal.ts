/* COPY THAT IS ONLY TRUE FOR PART OF THE YEAR — 1 Oct 2026.
 *
 * Some sentences are worth saying in the autumn and wrong in January: "a
 * session held on or before 31 December counts against this year's maximum"
 * is the obvious one. Rather than a person remembering to add it in October
 * and take it out in January, the copy carries its own window and this
 * module decides, on the Pacific calendar date, whether today is inside it.
 *
 * Since 3 Oct 2026 (item 429) every indexable page is fully static, and
 * /book since 15 Oct, so a window opens and closes on the page when the site
 * is BUILT, not when the date arrives: /pricing, /book, the resources and the
 * guides read the date once, at build time. /book's lines are also re-checked
 * in the browser on the day (components/BookChoice.tsx), and the drafts and
 * nurture email 3 read it at the moment they are built. So every day a page
 * window opens or closes is listed in GATE_DATES below, and
 * .github/workflows/rebuild-on-gate-dates.yml rebuilds and rehashes the site
 * that morning; test/gate-dates.test.mts fails if the two disagree.
 *
 * Pacific, not UTC: at 4 p.m. on 31 December in Vancouver it is already
 * 1 January in UTC, and a year-end line that vanished eight hours early
 * would be wrong on exactly the day it matters.
 *
 * No imports: this is safe in any component, server or client. */

export const PACIFIC_TZ = 'America/Vancouver';

/** "MM-DD" for `now` on the Pacific calendar. */
export function pacificMonthDay(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: PACIFIC_TZ, month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('month')}-${get('day')}`;
}

const MD = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

/** True when the Pacific date of `now` falls in [from, to], both "MM-DD" and
 *  inclusive. A window that wraps the new year ("12-15" to "01-15") works.
 *  A malformed bound is never in season: a typo hides a line rather than
 *  showing it all year. */
export function inSeason(from: string, to: string, now: Date = new Date()): boolean {
  if (!MD.test(from) || !MD.test(to)) return false;
  const d = pacificMonthDay(now);
  return from <= to ? d >= from && d <= to : d >= from || d <= to;
}

/** The block itself when today is inside its window, else null. */
export function activeSeasonal<T extends { from: string; to: string }>(s: T | undefined, now: Date = new Date()): T | null {
  return s && inSeason(s.from, s.to, now) ? s : null;
}

/* ---- the calendar-year plan line (items 221 and 222) ------------------ */

/** /pricing and /book, under the fee line. */
export const PLAN_YEAR_PAGE_WINDOW = { from: '10-15', to: '12-31' } as const;

/** The after-consult and after-session drafts and nurture email 3. Ends
 *  before the last week of December, when a note about using a benefit
 *  before the year turns over can no longer be acted on. */
export const PLAN_YEAR_MAIL_WINDOW = { from: '10-15', to: '12-20' } as const;

/** The year-end page the page line points at. */
export const YEAR_END_PATH = '/resources/counselling-benefits-before-year-end-bc';

/** The paragraph a counsellor's draft or email 3 carries in season. Plain
 *  text; no fee, no time, no outcome. */
export const PLAN_YEAR_MAIL_PARAGRAPH =
  'One practical note for this time of year: if your extended health plan runs on the calendar year, sessions held by 31 December count against this year’s maximum. Whether yours does is in the plan booklet; the receipt will have what the insurer needs.';

export function planYearMailParagraph(now: Date = new Date()): string | null {
  return inSeason(PLAN_YEAR_MAIL_WINDOW.from, PLAN_YEAR_MAIL_WINDOW.to, now) ? PLAN_YEAR_MAIL_PARAGRAPH : null;
}

export function planYearPageLineShown(now: Date = new Date()): boolean {
  return inSeason(PLAN_YEAR_PAGE_WINDOW.from, PLAN_YEAR_PAGE_WINDOW.to, now);
}

/* ---- the January counterpart: the maximum that just reset (item 513) --- */

/* 15 Oct 2026. The autumn line has a January twin, and CONTENT_CALENDAR.md
 * calls the reset piece the commercially strongest of the year: a person
 * whose counselling maximum has just started again has a full balance and a
 * reason to use it. Same rules as the autumn line: conditional on a
 * calendar-year plan, no insurer named, no fee, no time, no outcome, and the
 * house coverage wording ("depending on the plan"). Out of these windows
 * every page and email is byte-identical to before.
 *
 * The page window runs from New Year's Day; the mail window starts on
 * 5 January, once the holiday inbox has cleared, so a note about a new
 * balance is read rather than buried. Both end on 15
 * February, by which point the reset is old news. The window ends, with the
 * autumn ones, are what item 511's GATE_DATES lists for the scheduled
 * rebuild that flips the static pages. */

/** /pricing, /book and CoverageLine, where the autumn page line renders. */
export const PLAN_RESET_PAGE_WINDOW = { from: '01-01', to: '02-15' } as const;

/** The after-consult and after-session drafts and nurture email 3. */
export const PLAN_RESET_MAIL_WINDOW = { from: '01-05', to: '02-15' } as const;

/** Every seasonal window this module owns, by name, for GATE_DATES. */
export const SEASONAL_WINDOWS = {
  PLAN_YEAR_PAGE_WINDOW,
  PLAN_YEAR_MAIL_WINDOW,
  PLAN_RESET_PAGE_WINDOW,
  PLAN_RESET_MAIL_WINDOW,
} as const;

/** The sentence pages and emails carry in January and early February. */
export const PLAN_RESET_LINE =
  'If your extended health plan runs on the calendar year, its counselling maximum started again on 1 January, and your insurer can confirm the new balance. Some plans run on another year, depending on the plan.';

export function planResetPageLineShown(now: Date = new Date()): boolean {
  return inSeason(PLAN_RESET_PAGE_WINDOW.from, PLAN_RESET_PAGE_WINDOW.to, now);
}

export function planResetMailParagraph(now: Date = new Date()): string | null {
  return inSeason(PLAN_RESET_MAIL_WINDOW.from, PLAN_RESET_MAIL_WINDOW.to, now) ? PLAN_RESET_LINE : null;
}

/** The one seasonal paragraph a draft or email 3 carries today: the autumn
 *  note, the January note, or nothing. The two windows never overlap. */
export function seasonalMailParagraph(now: Date = new Date()): string | null {
  return planYearMailParagraph(now) ?? planResetMailParagraph(now);
}

/* ---- the "This season" shelf (item 538, 15 Oct 2026) ----------------- */

/** A link that may land on something not yet live. `guide` names the guide
 *  the href lands on, so the link is dropped while that guide is a draft (its
 *  URL 404s); `flag` names a publishing flag the link needs, so an anchor is
 *  never linked before the section it points at is on the page. Since 16 Oct
 *  2026 (item 558) the related links on guides, /for pages and services carry
 *  the same keys as the shelf, and every one of them goes through liveLinks
 *  below, so a draft can be linked from today and the links appear on the
 *  build that publishes it. Read here, never decided: lib/live-links.ts
 *  supplies what is published and which flags are on. */
export type GatedLink = { href: string; label: string; guide?: string; flag?: 'FIRST_HOLIDAYS_CLEARED' };
export type LinkFlags = Record<NonNullable<GatedLink['flag']>, boolean>;

/** The links that are live: a link to a guide only when that guide is
 *  published, a link that needs a flag only when the flag is on. Order and
 *  every other field are kept, so a page whose gated links are all off
 *  renders exactly as it did before they were added. */
export function liveLinks<T extends GatedLink>(links: readonly T[], published: ReadonlySet<string>, flags: LinkFlags): T[] {
  return links.filter((l) => (!l.guide || published.has(l.guide)) && (!l.flag || flags[l.flag]));
}

/** A shelf link: a GatedLink, read by components/SeasonalShelf.tsx. */
export type ShelfLink = GatedLink;
export type ShelfWindow = { from: string; to: string; links: ShelfLink[] };

const WINTER_GUIDE: ShelfLink = { href: '/guides/low-mood-through-a-bc-winter', label: 'Low mood through a BC winter', guide: 'low-mood-through-a-bc-winter' };

/* The sick-days guide's reset section runs 1 Dec to 31 Jan (Guide.seasonal,
   item 576, 16 Oct 2026), and the shelf carries the guide for the same
   weeks: the autumn window is split at 1 December so the link starts with
   the section, not six weeks before it. */
const SICK_DAYS_RESET: ShelfLink = { href: '/guides/sick-days-and-mental-health-days-bc', label: 'Your sick days start again on 1 January', guide: 'sick-days-and-mental-health-days-bc' };

const AUTUMN_LINKS: ShelfLink[] = [
  { href: YEAR_END_PATH, label: 'Using counselling benefits before the year ends' },
  WINTER_GUIDE,
  { href: '/guides/holidays-with-family-you-find-difficult', label: 'Holidays with family you find difficult', guide: 'holidays-with-family-you-find-difficult' },
  { href: '/guides/grief-without-a-timeline#the-first-holidays-after-a-loss', label: 'The first holidays after a loss', guide: 'grief-without-a-timeline', flag: 'FIRST_HOLIDAYS_CLEARED' },
];

/** What the shelf on /guides and the homepage line show, by Pacific date.
 *  Outside these windows the shelf renders nothing. */
export const SEASONAL_SHELF: readonly ShelfWindow[] = [
  { from: '10-15', to: '11-30', links: AUTUMN_LINKS },
  { from: '12-01', to: '12-31', links: [...AUTUMN_LINKS, SICK_DAYS_RESET] },
  {
    from: '01-01',
    to: '01-31',
    links: [
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Returning to work after a mental health leave', guide: 'return-to-work-after-a-mental-health-leave' },
      { href: '/resources/does-my-plan-cover-counselling-bc', label: 'Does my plan cover counselling?' },
      SICK_DAYS_RESET,
      WINTER_GUIDE,
    ],
  },
];

/** The shelf window in season at `now`, or null. */
export function activeShelf(now: Date = new Date()): ShelfWindow | null {
  return SEASONAL_SHELF.find((w) => inSeason(w.from, w.to, now)) ?? null;
}

/** The links of the window in season at `now` that are live: a link to a
 *  guide only when that guide is published, a link that needs a flag only
 *  when the flag is on. The caller passes both, so this module still imports
 *  nothing. */
export function liveShelfLinks(
  published: ReadonlySet<string>,
  flags: LinkFlags,
  now: Date = new Date(),
): ShelfLink[] {
  const w = activeShelf(now);
  if (!w) return [];
  return liveLinks(w.links, published, flags);
}

/* ---- the days the site has to be rebuilt (item 511, 15 Oct 2026) ------ */

/** The day after "MM-DD", as "MM-DD", on a non-leap year: the first day a
 *  window that ends on `md` is closed. "12-31" gives "01-01". */
export function dayAfter(md: string): string {
  const [m, d] = md.split('-').map(Number);
  const next = new Date(Date.UTC(2027, m! - 1, d! + 1));
  return `${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`;
}

/** The two days a window changes a page: the day it opens and the day after
 *  it ends. */
export function windowGates(w: { from: string; to: string }): [string, string] {
  return [w.from, dayAfter(w.to)];
}

/** Every Pacific "MM-DD" on which a static page changes because of the date
 *  alone, and why. .github/workflows/rebuild-on-gate-dates.yml has one
 *  schedule line per day, and test/gate-dates.test.mts fails when a window
 *  boundary in the code is missing here, or a day here has no schedule line.
 *  A window added anywhere (Resource.seasonal, Guide.seasonal, the shelf,
 *  the plan-year line) goes here in the same commit. */
export const GATE_DATES: readonly { md: string; why: string }[] = [
  { md: '01-01', why: 'Plan-year line on /pricing, the year-end section on the coverage resources and the shelf close; the 2027 EI figure and the next YE_YEAR take over; the January shelf and the plan-reset line (PLAN_RESET_PAGE_WINDOW) open.' },
  { md: '02-01', why: 'The January shelf and the sick-days guide’s reset section close.' },
  { md: '02-16', why: 'The January plan-reset line on /pricing, /book and the coverage lines, and the reset title on the year-end page, close (PLAN_RESET_PAGE_WINDOW).' },
  { md: '03-01', why: 'The winter guide’s time-change section closes.' },
  { md: '10-01', why: 'The year-end section on the coverage resources opens (yearEndSeasonal).' },
  { md: '10-10', why: 'The EI waiting-week waiver ends after 9 October 2027 (EI_WAITING_WAIVER).' },
  { md: '10-15', why: 'The plan-year line on /pricing and the autumn shelf open.' },
  { md: '10-20', why: 'The winter guide’s time-change section opens.' },
  { md: '12-01', why: 'The sick-days guide’s reset section and the December shelf, which adds that guide, open (item 576).' },
];

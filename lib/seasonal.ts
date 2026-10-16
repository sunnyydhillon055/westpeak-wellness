/* COPY THAT IS ONLY TRUE FOR PART OF THE YEAR — 1 Oct 2026.
 *
 * Some sentences are worth saying in the autumn and wrong in January: "a
 * session held on or before 31 December counts against this year's maximum"
 * is the obvious one. Rather than a person remembering to add it in October
 * and take it out in January, the copy carries its own window and this
 * module decides, on the Pacific calendar date, whether today is inside it.
 *
 * The pages that use it were re-rendered on a timer when this was written.
 * Since 3 Oct 2026 (and /book since 15 Oct) they are static, so a server-
 * rendered line follows the date of the last build: a window opens and
 * closes with the next rebuild, which is what item 511's GATE_DATES
 * schedules. /book's lines are also re-checked in the browser on the day
 * (components/BookChoice.tsx). The drafts and nurture email 3 read it at
 * the moment they are built.
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

/* When a link means "open the booking calendar on this page" — 1 Oct 2026.
 * See components/SchedulerGate. Pure, so it can be tested and bundled into
 * the client component without anything else coming with it. */

export const CALENDAR_HASH = '#calendar';

/** True when `href` points at #calendar on the page at `pathname`: "#calendar",
 *  "?with=x#calendar", or "/book?with=x#calendar" while on /book. A link to
 *  another page's #calendar is a navigation, and that page decides. */
export function opensCalendar(href: string | null | undefined, pathname: string): boolean {
  if (!href) return false;
  const i = href.indexOf('#');
  if (i < 0 || href.slice(i) !== CALENDAR_HASH) return false;
  const before = href.slice(0, i).split('?')[0];
  return before === '' || before === pathname;
}

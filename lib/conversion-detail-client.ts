/* The browser half of lib/conversion-detail.ts — composition only, no data.
 *
 * WHY THIS FILE EXISTS — 1 Oct 2026. Header, StickyBook and BookLink are
 * client components on every page, and they imported bookClickDetail and
 * withSlugOf from lib/conversion-detail.ts. That module builds its allow-list
 * from lib/practitioners.ts and lib/tools.ts, so the import put the whole
 * roster and every tool's questions back into the layout chunk the same day
 * lib/roster-nav.ts took them out: the perf gate measured layout first-load
 * JS at 401,619 B against a 350,474 B baseline (+14.6%).
 *
 * The browser does not need the list to compose a key. It joins the button
 * and the counsellor the href names; /api/track checks the result against
 * the list (allowedDetail in lib/conversion-detail.ts) and, when the
 * counsellor half is not on it, keeps the button half. Nothing the browser
 * sends is stored unless the server's list already holds it, which is the
 * same guarantee as before, enforced in the one place it can be trusted. */

const SEP = '/';

/** The `?with=` value of a booking href, unvalidated. */
export function withSlugOf(href: string | undefined | null): string | undefined {
  if (!href) return undefined;
  const q = href.indexOf('?');
  if (q < 0) return undefined;
  const w = new URLSearchParams(href.slice(q + 1).split('#')[0]).get('with');
  return w || undefined;
}

/** "sticky/camille-granda", or "sticky" when no counsellor is named. */
export function bookClickDetail(location: string, who?: string | null): string {
  return who ? `${location}${SEP}${who}` : location;
}

/** "which-service:couples", or the tool alone. */
export function toolDetail(tool: string, outcome?: string | null): string {
  return outcome ? `${tool}:${outcome}` : tool;
}

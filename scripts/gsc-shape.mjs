/* The pure half of scripts/gsc-pull.mjs: how rows become files, which URLs are
 * worth an inspection, and what an inspection result is reduced to. No
 * network and no key, so test/gsc-shape.test.mts can load it.
 */

export const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

/**
 * Search Analytics rows as CSV in the shape the Search Console export button
 * produces: one column per dimension, then Clicks, Impressions, CTR, Position.
 * Sorted by clicks then impressions, except a `date` first dimension, which
 * sorts by date so a step change reads top to bottom.
 */
export function rowsToCsv(labels, rows) {
  const byDate = labels[0] === 'Date';
  const sorted = [...rows].sort((a, b) =>
    byDate
      ? a.keys[0].localeCompare(b.keys[0]) || b.impressions - a.impressions
      : b.clicks - a.clicks || b.impressions - a.impressions,
  );
  return [
    [...labels, 'Clicks', 'Impressions', 'CTR', 'Position'].join(','),
    ...sorted.map((r) =>
      [...r.keys.map(csvCell), r.clicks, r.impressions, `${(r.ctr * 100).toFixed(2)}%`, r.position.toFixed(2)].join(','),
    ),
  ].join('\n') + '\n';
}

const iso = (d) => d.toISOString().slice(0, 10);

/** The reporting window: GSC lags about two days, so it ends two days back. */
export function reportWindow(now, days) {
  const end = new Date(now); end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - days + 1);
  return { startDate: iso(start), endDate: iso(end) };
}

/* Pages where a searcher's country separates the two audiences: someone in
   BC looking for counselling in their language, and someone anywhere looking
   up what a Punjabi or Tagalog word means. Search Console's own filter
   syntax (RE2), applied server-side. */
export const LANGUAGE_PAGES = 'punjabi|tagalog|words-mean|filipino|south-asian';

/* The URLs that earn a booking. Inspected every run whatever their numbers. */
const MONEY = /^\/(?:$|book$|pricing$|contact$|services(?:\/|$)|practitioners(?:\/[^/]+)?$|online-counselling$|punjabi-counselling$)/;

/**
 * The URLs to send to URL Inspection: every money URL in the sitemap, then
 * every sitemap URL with no impressions in the window, capped. Search Console
 * allows 2,000 inspections a day per property; the cap keeps one weekly run
 * far inside that and inside the job's time limit.
 */
export function inspectionTargets(sitemapUrls, pagesWithImpressions, origin, cap = 400) {
  const seen = new Set(pagesWithImpressions);
  const path = (u) => u.slice(origin.length) || '/';
  const money = sitemapUrls.filter((u) => MONEY.test(path(u)));
  const silent = sitemapUrls.filter((u) => !seen.has(u) && !money.includes(u));
  return [...new Set([...money, ...silent])].slice(0, cap).map((url) => ({
    url,
    why: money.includes(url) ? 'money' : 'zero-impressions',
  }));
}

/** One inspection response reduced to the fields that say whether Google
 *  holds the page and which URL it chose. Nothing else is kept. */
export function inspectionRow(target, body) {
  const r = body?.inspectionResult?.indexStatusResult ?? {};
  return {
    url: target.url,
    why: target.why,
    verdict: r.verdict ?? null,
    coverageState: r.coverageState ?? null,
    indexingState: r.indexingState ?? null,
    googleCanonical: r.googleCanonical ?? null,
    userCanonical: r.userCanonical ?? null,
    lastCrawlTime: r.lastCrawlTime ?? null,
  };
}

/** <loc> values from a urlset; image locs are not pages and are skipped. */
export const sitemapLocs = (xml) =>
  [...xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&').trim());

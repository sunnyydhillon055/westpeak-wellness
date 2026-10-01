import { site } from './site.ts';
import { withCronHealth, readCronHealth } from './cron-health.ts';
// @ts-ignore -- plain .mjs shared with next.config.mjs, which Node loads before anything compiles
import { permanentLiteralSources } from './redirects.mjs';

/* IndexNow submission — shared by the weekly cron and the deploy ping
   (app/api/indexnow) and the admin button (app/api/admin/indexnow).

   Extracted 13 Sep 2026 after the watchdog reported "indexnow has never
   reported a run": the route recorded a run only around the POSTs, so any
   failure before that point — the sitemap fetch, an empty URL list — left no
   record at all and looked identical to a cron that never fired. The whole
   flow now runs inside withCronHealth, so a failure is a recorded failure
   and "never ran" means exactly that.

   WHAT IS SUBMITTED, SINCE 1 OCT 2026

   It used to be every <loc> in the sitemap, every time. IndexNow is for URLs
   that changed; resubmitting three hundred unchanged ones each week tells an
   engine nothing and spends the goodwill the protocol runs on. Now:

     - the sitemap URLs whose <lastmod> is on or after the day of the last
       SUCCESSFUL submission, read from this job's own health record. Compared
       by day, because many lastmods are dates without a time, and a page
       re-dated today must not be missed for having changed at 00:00.
     - with no successful run on record (first run, or the last run failed),
       the whole sitemap, which is the old behaviour and the safe fallback.
     - always, the permanent parameter-free redirect sources from
       lib/redirects.mjs. Those are the retired URLs an engine still holds:
       Bing-grounded answers were quoting /services/depression-counselling a
       month after it 301'd, and /careers kept 582 impressions after 1 Sep. A
       recrawl is what makes an engine see the redirect and drop the old URL. */

export const INDEXNOW_KEY = '4366026342552d889b0442be9c388752';
export const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

export type IndexNowResult =
  | { ok: true; dry: true; wouldSubmit: number; host: string; since: string | null; urls: string[] }
  | { ok: true; dry: false; submitted: number; host: string; since: string | null; results: Record<string, string> }
  | { ok: false; submitted: number; host: string; error: string };

export type SitemapEntry = { loc: string; lastmod: string | null };

const decode = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

/** The <url> entries of a urlset, each with its lastmod if it has one. Image
 *  <image:loc> elements are not page URLs and are not returned. */
export function parseUrlset(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap((m) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1]);
    if (!loc) return [];
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1]);
    return [{ loc: decode(loc[1].trim()), lastmod: lastmod ? lastmod[1].trim() : null }];
  });
}

/**
 * The URL list for one submission. `since` is the ISO time of the last
 * successful submission, or null to send the whole sitemap.
 */
export function selectUrls(
  entries: SitemapEntry[],
  since: string | null,
  redirectPaths: string[],
  origin: string,
): string[] {
  const day = since ? since.slice(0, 10) : null;
  const changed = entries
    .filter((e) => e.loc.startsWith(origin))
    .filter((e) => day === null || (e.lastmod !== null && e.lastmod.slice(0, 10) >= day))
    .map((e) => e.loc);
  const retired = redirectPaths.map((p) => origin + p);
  /* Image entries and anything off-host would be rejected for the whole batch;
     10,000 is the protocol's ceiling per request. */
  return [...new Set([...changed, ...retired])].slice(0, 10000);
}

async function sitemapEntries(): Promise<SitemapEntry[]> {
  const res = await fetch(`${site.domain}/sitemap.xml`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  const xml = await res.text();
  if (/<sitemapindex/.test(xml)) {
    const out: SitemapEntry[] = [];
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      out.push(...parseUrlset(await (await fetch(m[1], { cache: 'no-store' })).text()));
    }
    return out;
  }
  return parseUrlset(xml);
}

/** When this job last submitted successfully, or null if it never has or the
 *  last attempt failed — in which case the next run sends everything. */
async function lastSuccess(): Promise<string | null> {
  const run = (await readCronHealth()).indexnow;
  return run && run.ok ? run.at : null;
}

async function urlList(): Promise<{ since: string | null; urls: string[] }> {
  const since = await lastSuccess();
  const entries = await sitemapEntries();
  if (!entries.length) throw new Error('sitemap yielded no URLs');
  const urls = selectUrls(entries, since, permanentLiteralSources() as string[], site.domain);
  if (!urls.length) throw new Error('nothing to submit');
  return { since, urls };
}

export async function submitSitemapToIndexNow(opts: { dry?: boolean } = {}): Promise<IndexNowResult> {
  const host = new URL(site.domain).host;
  if (opts.dry) {
    const { since, urls } = await urlList();
    return { ok: true, dry: true, wouldSubmit: urls.length, host, since, urls };
  }
  let count = 0;
  let from: string | null = null;
  const run = await withCronHealth('indexnow', async () => {
    const { since, urls } = await urlList();
    count = urls.length;
    from = since;
    const body = JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${site.domain}/${INDEXNOW_KEY}.txt`, urlList: urls });
    const results: Record<string, string> = {};
    for (const endpoint of INDEXNOW_ENDPOINTS) {
      try {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body,
        });
        // 200 accepted · 202 accepted, key validation pending · 422 URL/key mismatch
        results[endpoint] = `${r.status}`;
      } catch (e) {
        results[endpoint] = e instanceof Error ? e.message : 'failed';
      }
    }
    console.log(`[indexnow] submitted ${urls.length} URLs since ${since ?? 'the start'}:`, JSON.stringify(results));
    const accepted = Object.values(results).filter((s) => /^20[02]$/.test(s)).length;
    if (accepted === 0) throw new Error(`every endpoint refused: ${JSON.stringify(results)}`);
    return results;
  });
  if (!run.ok) return { ok: false, submitted: count, host, error: run.error };
  return { ok: true, dry: false, submitted: count, host, since: from, results: run.result };
}

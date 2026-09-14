import { site } from './site.ts';
import { withCronHealth } from './cron-health.ts';

/* IndexNow submission of the whole sitemap — shared by the weekly cron
   (app/api/indexnow) and the admin button (app/api/admin/indexnow).

   Extracted 13 Sep 2026 after the watchdog reported "indexnow has never
   reported a run": the route recorded a run only around the POSTs, so any
   failure before that point — the sitemap fetch, an empty URL list — left no
   record at all and looked identical to a cron that never fired. The whole
   flow now runs inside withCronHealth, so a failure is a recorded failure
   and "never ran" means exactly that. */

export const INDEXNOW_KEY = '4366026342552d889b0442be9c388752';
export const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

export type IndexNowResult =
  | { ok: true; dry: true; wouldSubmit: number; host: string; sample: string[] }
  | { ok: true; dry: false; submitted: number; host: string; results: Record<string, string> }
  | { ok: false; submitted: number; host: string; error: string };

async function sitemapUrls(): Promise<string[]> {
  const res = await fetch(`${site.domain}/sitemap.xml`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  const xml = await res.text();
  const children = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let urls: string[] = [];
  if (/<sitemapindex/.test(xml)) {
    for (const child of children) {
      const c = await (await fetch(child, { cache: 'no-store' })).text();
      urls.push(...[...c.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
    }
  } else {
    urls = children;
  }
  /* Image entries and anything off-host would be rejected for the whole batch. */
  urls = [...new Set(urls.filter((u) => u.startsWith(site.domain)))].slice(0, 10000);
  if (!urls.length) throw new Error('sitemap yielded no URLs');
  return urls;
}

export async function submitSitemapToIndexNow(opts: { dry?: boolean } = {}): Promise<IndexNowResult> {
  const host = new URL(site.domain).host;
  if (opts.dry) {
    const urls = await sitemapUrls();
    return { ok: true, dry: true, wouldSubmit: urls.length, host, sample: urls.slice(0, 10) };
  }
  let count = 0;
  const run = await withCronHealth('indexnow', async () => {
    const urls = await sitemapUrls();
    count = urls.length;
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
    console.log(`[indexnow] submitted ${urls.length} URLs:`, JSON.stringify(results));
    const accepted = Object.values(results).filter((s) => /^20[02]$/.test(s)).length;
    if (accepted === 0) throw new Error(`every endpoint refused: ${JSON.stringify(results)}`);
    return results;
  });
  if (!run.ok) return { ok: false, submitted: count, host, error: run.error };
  return { ok: true, dry: false, submitted: count, host, results: run.result };
}

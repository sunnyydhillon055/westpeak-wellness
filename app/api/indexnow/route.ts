import { NextResponse, type NextRequest } from 'next/server';
import { site } from '@/lib/site';

/* IndexNow — push the URL list to the engines that accept a push.
 *
 * ── BE CLEAR ABOUT WHAT THIS DOES AND DOES NOT DO ─────────────────────────
 *
 * Google does NOT participate in IndexNow. If the number being watched is
 * Search Console impressions, this route will not move it, and any claim
 * otherwise is wrong.
 *
 * What it does reach: Bing, and therefore DuckDuckGo and Microsoft Copilot,
 * plus Yandex, Seznam and Naver. For a practice that has just launched, being
 * in the Bing index quickly is worth having on its own — Copilot answers are
 * grounded in it — and it costs one request per deploy.
 *
 * Google indexation is accelerated by exactly three things this site already
 * does: a valid sitemap, zero orphan pages, and fast server-rendered HTML.
 * There is no fourth lever, which is why this file is careful not to pretend
 * to be one.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Protected by CRON_SECRET like the revenue report: submitting a URL list is
 * harmless, but an open endpoint that fires outbound requests on demand is a
 * free amplifier for someone else.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const KEY = '4366026342552d889b0442be9c388752';

/** Engines that accept a push. One submission propagates across the IndexNow
 *  network, but posting to two endpoints costs nothing and covers the case
 *  where one is down. */
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

function authorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  return bearer === secret || req.nextUrl.searchParams.get('key') === secret;
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const host = new URL(site.domain).host;

  /* Read the live sitemap rather than importing the route that builds it —
   * this way the submitted list is exactly what a crawler would find, and a
   * page missing from the sitemap is missing from both, which is the correct
   * failure mode. */
  let urls: string[] = [];
  try {
    const res = await fetch(`${site.domain}/sitemap.xml`, { cache: 'no-store' });
    const xml = await res.text();
    const children = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    // The root sitemap is an index; follow each child once.
    if (/<sitemapindex/.test(xml)) {
      for (const child of children) {
        const c = await (await fetch(child, { cache: 'no-store' })).text();
        urls.push(...[...c.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
      }
    } else {
      urls = children;
    }
  } catch (e) {
    return NextResponse.json(
      { error: 'sitemap-unreadable', detail: e instanceof Error ? e.message : 'fetch failed' },
      { status: 502 }
    );
  }

  // Image entries and anything off-host would be rejected for the whole batch.
  urls = [...new Set(urls.filter((u) => u.startsWith(site.domain)))].slice(0, 10000);
  if (!urls.length) {
    return NextResponse.json({ error: 'no-urls' }, { status: 502 });
  }

  const body = JSON.stringify({ host, key: KEY, keyLocation: `${site.domain}/${KEY}.txt`, urlList: urls });

  const results: Record<string, string> = {};
  for (const endpoint of ENDPOINTS) {
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
  return NextResponse.json({ ok: true, submitted: urls.length, host, results });
}

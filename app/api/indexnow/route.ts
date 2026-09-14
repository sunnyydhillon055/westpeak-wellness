import { NextResponse, type NextRequest } from 'next/server';
import { submitSitemapToIndexNow } from '@/lib/indexnow';

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
  /* Everything — the sitemap fetch included — runs inside the health record
     (lib/indexnow.ts), so "never reported a run" cannot be a failure in
     disguise. ?dry=1 lists what would be submitted without spending a
     submission. */
  const r = await submitSitemapToIndexNow({ dry: req.nextUrl.searchParams.get('dry') === '1' });
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}

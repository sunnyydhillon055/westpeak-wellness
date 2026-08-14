import { NextResponse } from 'next/server';
import { countSearch } from '@/lib/search-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Counts one search term. See lib/search-log.ts for why this counts rather
 * than logs, which is the part that matters.
 *
 * WHY A BEACON AND NOT THE PAGE ITSELF
 *
 * /search is a server component, so it could record the term while rendering.
 * Two reasons it does not:
 *
 *   - It would put a Blob write on the critical path of every search, so the
 *     results page would get slower to serve analytics nobody is waiting for.
 *   - Crawlers would be counted. The page is noindex but bots reach it anyway,
 *     and a term list dominated by whatever a crawler probes with is worse than
 *     no term list. A beacon needs JavaScript, so only real browsers arrive.
 *
 * Returns 204 unconditionally. There is nothing for the caller to learn from
 * the response, and a beacon cannot read one anyway.
 */
export async function POST(req: Request) {
  try {
    const { q } = (await req.json()) as { q?: unknown };
    if (typeof q === 'string') await countSearch(q);
  } catch {
    /* Malformed body, blob unavailable, anything at all — a counter must never
     * be able to produce an error a visitor could notice. */
  }
  return new NextResponse(null, { status: 204 });
}

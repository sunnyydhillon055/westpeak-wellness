import { NextResponse, type NextRequest } from 'next/server';
import { portalToken, safeEqual, PORTAL_COOKIE } from '@/lib/portal-token';

/* Gate on /client-portal.
 *
 * Runs on the edge before the page is served, so the access code never reaches
 * the browser and the portal markup is never sent to someone who has not
 * entered it. A client-side check on a static site would ship the secret in the
 * bundle and be theatre; this is not that.
 *
 * Fails CLOSED: if PORTAL_ACCESS_CODE is unset, nobody gets in. An
 * unconfigured deployment should not silently publish the portal.
 */
export async function middleware(req: NextRequest) {
  const expected = process.env.PORTAL_ACCESS_CODE;
  const supplied = req.cookies.get(PORTAL_COOKIE)?.value;

  if (expected && supplied && safeEqual(supplied, await portalToken(expected))) {
    return NextResponse.next();
  }

  // Rewrite rather than redirect, so the URL a client bookmarked keeps working
  // and they land on the code form instead of an error. Served as 200: the
  // portal link sits in the main nav, so reaching this page is a normal thing
  // to do, not a failure. The gate's job is to withhold the portal markup —
  // which it does — not to return an error status to ordinary visitors.
  const url = req.nextUrl.clone();
  url.pathname = '/client-portal/enter';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/client-portal'] };

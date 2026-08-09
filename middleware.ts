import { NextResponse, type NextRequest } from 'next/server';
import { readSession, PORTAL_COOKIE } from '@/lib/portal-auth';

/* Gate on /client-portal.
 *
 * Runs on the edge before the page renders, so portal markup is never sent to
 * anyone without a valid session. A client-side check on a static site would
 * ship the secret in the bundle; this does not.
 *
 * readSession re-checks the address against the allowlist on every request, so
 * removing someone from PORTAL_ALLOWED_EMAILS logs them out immediately rather
 * than whenever their cookie happens to expire.
 *
 * Fails CLOSED: with PORTAL_SECRET unset, nobody gets in. An unconfigured
 * deployment must not silently publish the portal.
 */
export async function middleware(req: NextRequest) {
  const secret = process.env.PORTAL_SECRET;
  if (secret) {
    const email = await readSession(req.cookies.get(PORTAL_COOKIE)?.value, secret);
    if (email) return NextResponse.next();
  }

  // Rewrite, not redirect: a bookmarked URL keeps working and the client lands
  // on the sign-in form rather than an error.
  const url = req.nextUrl.clone();
  url.pathname = '/client-portal/enter';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/client-portal'] };

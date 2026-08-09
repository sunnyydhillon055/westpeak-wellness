import { NextResponse, type NextRequest } from 'next/server';
import { readSession, PORTAL_COOKIE, ADMIN_COOKIE } from '@/lib/portal-auth';

/* First of two gates.
 *
 * Runs on the edge before anything renders, and answers only "is this cookie
 * one we issued for this area?" — a signature check, no I/O, so it adds nothing
 * measurable to a request. Whether the person is still ALLOWED is re-checked
 * against the stored list inside the page, which is what makes removing someone
 * take effect on their next click.
 *
 * Fails CLOSED: with PORTAL_SECRET unset nobody reaches either area.
 */
export async function middleware(req: NextRequest) {
  const secret = process.env.PORTAL_SECRET;
  const path = req.nextUrl.pathname;
  const isAdmin = path === '/admin';

  if (secret) {
    const cookie = req.cookies.get(isAdmin ? ADMIN_COOKIE : PORTAL_COOKIE)?.value;
    const email = await readSession(cookie, secret, isAdmin ? 'admin' : 'client');
    if (email) return NextResponse.next();
  }

  // Rewrite, not redirect: a bookmarked URL keeps working and the person lands
  // on the sign-in form rather than an error.
  const url = req.nextUrl.clone();
  url.pathname = isAdmin ? '/admin/enter' : '/client-portal/enter';
  url.search = '';
  return NextResponse.rewrite(url);
}

export const config = { matcher: ['/client-portal', '/admin'] };

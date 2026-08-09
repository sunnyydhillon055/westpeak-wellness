import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';

/* First of two gates.
 *
 * Checks that there is a signed-in session with the right role before anything
 * renders. Whether that person is still ALLOWED is re-checked against the
 * stored list inside each page — a session token stays valid until it expires,
 * so without the second check, removing someone in /admin would not take effect
 * until then. Both layers are required and both are enforced.
 */
export default auth((req) => {
  const path = req.nextUrl.pathname;
  const wantsAdmin = path === '/admin';
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  const ok = wantsAdmin ? role === 'admin' : role === 'admin' || role === 'client';
  if (req.auth && ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/signin';
  url.search = `?next=${encodeURIComponent(path)}`;
  return NextResponse.redirect(url);
}) as unknown as (req: NextRequest) => Response;

export const config = { matcher: ['/client-portal', '/admin'] };

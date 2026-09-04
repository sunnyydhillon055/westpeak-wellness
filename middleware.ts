import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { ALBERTA_LIVE, ONTARIO_LIVE } from '@/lib/regions';

/* ============================================================================
   TWO UNRELATED JOBS, BOTH OF WHICH HAVE TO HAPPEN BEFORE A PAGE RENDERS
   ========================================================================= */

/* ----------------------------------------------------------------------------
   ONE — THE PROVINCES THAT ARE NOT OPEN YET, AND WHY THIS IS NOT DONE IN THE
   PAGE.
   ----------------------------------------------------------------------------
   /alberta and /ontario call notFound() while their province is gated. That
   looked correct and was not: notFound() thrown from a MATCHED route does not
   render this site's 404. It renders the framework's internal error shell — no
   lang attribute, no skip link, no <main>, and a body containing nothing but a
   title. Measured by request rather than assumed:

     /alberta          404, body had a title and no other text
     /alberta/calgary  404, same
     /this-does-not-exist  404, the real page — search box, links, crisis numbers

   Three things were tried before this one and are recorded so nobody repeats
   them: force-dynamic on the route (moved the artefact, changed nothing that
   was served), a segment-level not-found.tsx (same blank shell, and it
   regressed the title to the homepage's), and removing global-error.tsx to
   rule it out as the cause (it was not).

   That is the worst page on this site to serve blank. Somebody reaching it has
   searched for counselling in a province and followed a link; a white page
   tells them the practice is broken, not that it is not open there yet.

   Middleware runs BEFORE routing, so rewriting to a path that matches nothing
   hands the request to the same unmatched-URL handling that already renders
   the real 404 correctly. The status stays 404, which is what it should be —
   these pages genuinely are not available — and the visitor gets a page with
   somewhere to go.
   -------------------------------------------------------------------------- */

const GATED: Array<[prefix: string, live: boolean]> = [
  ['/alberta', ALBERTA_LIVE],
  ['/ontario', ONTARIO_LIVE],
];

function gatedProvince(path: string): boolean {
  return GATED.some(
    ([prefix, live]) => !live && (path === prefix || path.startsWith(prefix + '/'))
  );
}

/* ----------------------------------------------------------------------------
   TWO — FIRST OF THE TWO AUTH GATES.
   ----------------------------------------------------------------------------
   Checks that there is a signed-in session with the right role before anything
   renders. Whether that person is still ALLOWED is re-checked against the
   stored list inside each page — a session token stays valid until it expires,
   so without the second check, removing someone in /admin would not take
   effect until then. Both layers are required and both are enforced.
   -------------------------------------------------------------------------- */

const authGate = auth((req) => {
  const path = req.nextUrl.pathname;
  const wantsAdmin = path === '/admin';
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  const ok = wantsAdmin ? role === 'admin' : role === 'admin' || role === 'client';
  if (req.auth && ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/signin';
  url.search = `?next=${encodeURIComponent(path)}`;
  return NextResponse.redirect(url);
}) as unknown as (req: NextRequest) => Response | Promise<Response>;

export default function middleware(req: NextRequest): Response | Promise<Response> {
  /* Checked first and deliberately: a gated province is a public URL and must
     never reach the session lookup. */
  if (gatedProvince(req.nextUrl.pathname)) {
    const url = req.nextUrl.clone();
    /* A path nothing routes to. The leading underscore keeps it out of the way
       of any real page this site could ever add. */
    url.pathname = '/_province-not-available';
    return NextResponse.rewrite(url, { status: 404 });
  }
  return authGate(req);
}

export const config = {
  matcher: ['/client-portal', '/admin', '/alberta', '/alberta/:path*', '/ontario', '/ontario/:path*'],
};

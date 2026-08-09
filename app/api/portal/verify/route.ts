import { NextResponse } from 'next/server';
import {
  readLoginToken, createSession, PORTAL_COOKIE, ADMIN_COOKIE, type Scope,
} from '@/lib/portal-auth';
import { isClientAllowed, isAdmin } from '@/lib/portal-store';

export const dynamic = 'force-dynamic';

/* Exchanges a magic-link token for the session cookie. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const token = params.get('t') ?? '';
  const scope: Scope = params.get('scope') === 'admin' ? 'admin' : 'client';
  const secret = process.env.PORTAL_SECRET;
  const back = scope === 'admin' ? '/admin/enter' : '/client-portal/enter';

  const email = secret ? await readLoginToken(token, secret, scope) : null;

  // The list is re-checked here as well as in the page. A link issued before
  // someone was removed stays cryptographically valid for its 30 minutes;
  // without this it would mint a cookie the page then rejects — blocked either
  // way, but with a confusing screen instead of a plain answer.
  const permitted = email
    ? (scope === 'admin' ? isAdmin(email) : await isClientAllowed(email))
    : false;

  if (!email || !secret || !permitted) {
    return NextResponse.redirect(new URL(`${back}?expired=1`, req.url), 303);
  }

  const dest = scope === 'admin' ? '/admin' : '/client-portal';
  const res = NextResponse.redirect(new URL(dest, req.url), 303);
  res.cookies.set(scope === 'admin' ? ADMIN_COOKIE : PORTAL_COOKIE,
    await createSession(email, secret, scope), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/',
      // Admin sessions are shorter: they can change who reaches client data.
      maxAge: scope === 'admin' ? 60 * 60 * 12 : 60 * 60 * 24 * 60,
    });
  return res;
}

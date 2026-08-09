import { NextResponse } from 'next/server';
import { readLoginToken, createSession, isAllowed, PORTAL_COOKIE } from '@/lib/portal-auth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/* Exchanges a magic-link token for the session cookie. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('t') ?? '';
  const secret = process.env.PORTAL_SECRET;
  const email = secret ? await readLoginToken(token, secret) : null;

  // The allowlist is re-checked here as well as in middleware. A link issued
  // before someone was removed stays cryptographically valid for its 30
  // minutes, and without this it would mint a session that middleware then
  // rejects — blocked either way, but the client would be bounced to a
  // confusing screen instead of being told plainly.
  if (!email || !secret || !isAllowed(email)) {
    return NextResponse.redirect(new URL('/client-portal/enter?expired=1', req.url), 303);
  }

  const res = NextResponse.redirect(new URL('/client-portal', req.url), 303);
  res.cookies.set(PORTAL_COOKIE, await createSession(email, secret), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/',
    maxAge: 60 * 60 * 24 * 60,
  });
  return res;
}

import { NextResponse } from 'next/server';
import { portalToken, PORTAL_COOKIE } from '@/lib/portal-token';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/* Validates the access code and sets the portal cookie.
 *
 * A plain form POST, so it works with JavaScript disabled. The code is compared
 * server-side against the environment variable and is never returned to the
 * client in any form. */
export async function POST(req: Request) {
  const form = await req.formData();
  const code = String(form.get('code') ?? '').trim();
  const expected = process.env.PORTAL_ACCESS_CODE;

  // Fixed delay on every attempt: makes automated guessing slow, and means a
  // wrong code and an unconfigured server are indistinguishable from outside.
  await new Promise((r) => setTimeout(r, 500));

  if (!expected || code !== expected) {
    return NextResponse.redirect(new URL('/client-portal/enter?e=1', req.url), 303);
  }

  const res = NextResponse.redirect(new URL('/client-portal', req.url), 303);
  res.cookies.set(PORTAL_COOKIE, await portalToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 60 days
  });
  return res;
}

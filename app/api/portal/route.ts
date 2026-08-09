import { NextResponse } from 'next/server';
import {
  normalizeEmail, isAllowed, createLoginToken, createSession, PORTAL_COOKIE,
  SHARED_CODE_IDENTITY,
} from '@/lib/portal-auth';
import { sendLoginLink } from '@/lib/portal-mail';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const SIXTY_DAYS = 60 * 60 * 24 * 60;

/* Accepts an email address and, if it is on the allowlist, emails a sign-in
 * link. A plain form POST, so it works without JavaScript.
 *
 * The response is IDENTICAL whether or not the address is allowed. Telling an
 * anonymous visitor "that address is not a client here" would confirm — or
 * deny — that a named person is in therapy. */
export async function POST(req: Request) {
  const form = await req.formData();

  // HTML forms can only GET or POST, so the two sign-in paths are told apart by
  // which field arrived rather than by method.
  if (form.has('code')) return handleCode(form, req);

  const email = normalizeEmail(String(form.get('email') ?? ''));
  const secret = process.env.PORTAL_SECRET;

  // Fixed cost on every attempt, so response time does not distinguish the
  // allowlisted path (which sends mail) from the rejected one (which does not).
  const settle = new Promise((r) => setTimeout(r, 600));

  if (secret && email && isAllowed(email)) {
    const token = await createLoginToken(email, secret);
    const link = new URL(`/api/portal/verify?t=${encodeURIComponent(token)}`, req.url).toString();
    await sendLoginLink(email, link);
  }

  await settle;
  return NextResponse.redirect(new URL('/client-portal/enter?sent=1', req.url), 303);
}

/* Legacy shared-code path. Only live while PORTAL_ACCESS_CODE is set, so the
 * portal keeps working until email delivery is configured. Delete the variable
 * to turn it off — email access is unaffected. */
async function handleCode(form: FormData, req: Request) {
  const code = String(form.get('code') ?? '').trim();
  const expected = process.env.PORTAL_ACCESS_CODE;
  const secret = process.env.PORTAL_SECRET;
  await new Promise((r) => setTimeout(r, 500));

  if (!expected || !secret || code !== expected) {
    return NextResponse.redirect(new URL('/client-portal/enter?e=1', req.url), 303);
  }
  const res = NextResponse.redirect(new URL('/client-portal', req.url), 303);
  res.cookies.set(PORTAL_COOKIE, await createSession(SHARED_CODE_IDENTITY, secret), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SIXTY_DAYS,
  });
  return res;
}

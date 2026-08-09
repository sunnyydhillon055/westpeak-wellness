import { NextResponse } from 'next/server';
import {
  normalizeEmail, createLoginToken, createSession, PORTAL_COOKIE, ADMIN_COOKIE,
  type Scope,
} from '@/lib/portal-auth';
import { isClientAllowed, isAdmin } from '@/lib/portal-store';
import { sendLoginLink } from '@/lib/portal-mail';

export const dynamic = 'force-dynamic';

const SIXTY_DAYS = 60 * 60 * 24 * 60;

/* Requests a sign-in link, for either area.
 *
 * The response is IDENTICAL whether or not the address is recognised, and both
 * paths take the same fixed time. Telling an anonymous visitor "that address is
 * not a client here" would confirm — or deny — that a named person is in
 * therapy. */
export async function POST(req: Request) {
  const form = await req.formData();

  if (form.has('admin_code')) return handleAdminCode(form, req);
  if (form.has('code')) return handleCode(form, req);

  const email = normalizeEmail(String(form.get('email') ?? ''));
  const scope: Scope = String(form.get('scope') ?? 'client') === 'admin' ? 'admin' : 'client';
  const secret = process.env.PORTAL_SECRET;
  const settle = new Promise((r) => setTimeout(r, 600));

  const permitted = scope === 'admin' ? isAdmin(email) : await isClientAllowed(email);
  if (secret && email && permitted) {
    const token = await createLoginToken(email, secret, scope);
    const link = new URL(
      `/api/portal/verify?scope=${scope}&t=${encodeURIComponent(token)}`, req.url
    ).toString();
    await sendLoginLink(email, link, scope);
  }

  await settle;
  const back = scope === 'admin' ? '/admin/enter' : '/client-portal/enter';
  return NextResponse.redirect(new URL(`${back}?sent=1`, req.url), 303);
}

/* Legacy shared-code path for clients. Live only while PORTAL_ACCESS_CODE is
 * set, so the portal keeps working until email delivery is configured. */
async function handleCode(form: FormData, req: Request) {
  const code = String(form.get('code') ?? '').trim();
  const expected = process.env.PORTAL_ACCESS_CODE;
  const secret = process.env.PORTAL_SECRET;
  await new Promise((r) => setTimeout(r, 500));

  if (!expected || !secret || code !== expected) {
    return NextResponse.redirect(new URL('/client-portal/enter?e=1', req.url), 303);
  }
  const res = NextResponse.redirect(new URL('/client-portal', req.url), 303);
  res.cookies.set(PORTAL_COOKIE, await createSession('shared-code@westpeak.invalid', secret, 'client'), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SIXTY_DAYS,
  });
  return res;
}

/* Admin bootstrap.
 *
 * Signing in to /admin normally means receiving a link by email, which needs a
 * sending account configured. Without a way in that does not depend on email,
 * the owner would be locked out of the very screen that manages access — and
 * would have to edit environment variables to fix it, which is exactly the
 * friction /admin exists to remove.
 *
 * So: while PORTAL_ADMIN_CODE is set, it opens an admin session for the FIRST
 * address in PORTAL_ADMIN_EMAILS. Delete the variable once email works and this
 * path disappears, including for anyone already holding a code-issued session.
 */
async function handleAdminCode(form: FormData, req: Request) {
  const supplied = String(form.get('admin_code') ?? '').trim();
  const expected = process.env.PORTAL_ADMIN_CODE;
  const secret = process.env.PORTAL_SECRET;
  const owner = (process.env.PORTAL_ADMIN_EMAILS ?? '').split(/[,\s]+/).filter(Boolean)[0];
  await new Promise((r) => setTimeout(r, 500));

  if (!expected || !secret || !owner || supplied !== expected) {
    return NextResponse.redirect(new URL('/admin/enter?e=1', req.url), 303);
  }
  const res = NextResponse.redirect(new URL('/admin', req.url), 303);
  res.cookies.set(ADMIN_COOKIE, await createSession(owner, secret, 'admin'), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12,
  });
  return res;
}

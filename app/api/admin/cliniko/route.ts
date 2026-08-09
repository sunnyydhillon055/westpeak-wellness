import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readSession, ADMIN_COOKIE } from '@/lib/portal-auth';
import { isAdmin } from '@/lib/portal-store';
import { clinikoLookup } from '@/lib/cliniko';

export const dynamic = 'force-dynamic';

/* Runs one live lookup so the owner can confirm the Cliniko key works, and see
 * plainly which failure it is if it does not. Re-authenticates from the cookie
 * rather than assuming middleware ran. */
export async function POST(req: Request) {
  const secret = process.env.PORTAL_SECRET;
  const email = secret
    ? await readSession(cookies().get(ADMIN_COOKIE)?.value, secret, 'admin')
    : null;
  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/admin/enter?expired=1', req.url), 303);
  }

  const form = await req.formData();
  const probe = String(form.get('probe') ?? '').trim();
  const result = await clinikoLookup(probe);

  return NextResponse.redirect(new URL(`/admin?cliniko=${result.status}`, req.url), 303);
}

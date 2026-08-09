import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { clinikoLookup } from '@/lib/cliniko';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Runs one live lookup so the owner can confirm the Cliniko key works, and see
 * plainly which failure it is if it does not. Re-authenticates from the cookie
 * rather than assuming middleware ran. */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const form = await req.formData();
  const probe = String(form.get('probe') ?? '').trim();
  const result = await clinikoLookup(probe);

  return NextResponse.redirect(new URL(`/admin?cliniko=${result.status}`, req.url), 303);
}

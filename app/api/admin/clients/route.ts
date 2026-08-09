import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeAllowlist, isAdmin } from '@/lib/portal-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Saves the client list. Re-authenticates from the cookie rather than trusting
 * that middleware ran — an API route must not assume its caller came through a
 * gate. */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email ?? '';

  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  try {
    const form = await req.formData();
    const emails = String(form.get('emails') ?? '').split(/[\r\n,;]+/);
    await writeAllowlist(emails, email);
    return NextResponse.redirect(new URL('/admin?saved=1', req.url), 303);
  } catch {
    return NextResponse.redirect(new URL('/admin?error=1', req.url), 303);
  }
}

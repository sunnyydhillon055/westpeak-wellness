import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readSession, ADMIN_COOKIE } from '@/lib/portal-auth';
import { writeAllowlist, isAdmin } from '@/lib/portal-store';

export const dynamic = 'force-dynamic';

/* Saves the client list. Re-authenticates from the cookie rather than trusting
 * that middleware ran — an API route must not assume its caller came through a
 * gate. */
export async function POST(req: Request) {
  const secret = process.env.PORTAL_SECRET;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  const email = secret ? await readSession(cookie, secret, 'admin') : null;

  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/admin/enter?expired=1', req.url), 303);
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

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { setPassword, clearPassword } from '@/lib/portal-users';
import { normalizeEmail } from '@/lib/portal-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Sets or clears a password for one address.
 *
 * The password is chosen by the administrator and handed to the client, which
 * is the honest shape for a practice this size — there is no self-service
 * reset, so there is no reset link to intercept. Clients who use Google never
 * need one at all.
 *
 * Re-authenticates from the session rather than trusting that middleware ran:
 * an API route must not assume its caller came through a gate.
 */
export async function POST(req: Request) {
  const session = await auth();
  const admin = session?.user?.email ?? '';
  if (!admin || !isAdmin(admin)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const form = await req.formData();
  const target = normalizeEmail(String(form.get('target') ?? ''));
  const password = String(form.get('password') ?? '');
  const clear = form.get('clear') !== null;

  if (!target) return NextResponse.redirect(new URL('/admin?pw=missing', req.url), 303);

  try {
    if (clear) {
      await clearPassword(target);
      return NextResponse.redirect(new URL('/admin?pw=cleared', req.url), 303);
    }
    // Long enough to resist guessing, short enough that nobody writes it on a
    // sticky note. Google sign-in remains the option with no password at all.
    if (password.length < 10) {
      return NextResponse.redirect(new URL('/admin?pw=short', req.url), 303);
    }
    await setPassword(target, password);
    return NextResponse.redirect(new URL('/admin?pw=set', req.url), 303);
  } catch {
    return NextResponse.redirect(new URL('/admin?pw=error', req.url), 303);
  }
}

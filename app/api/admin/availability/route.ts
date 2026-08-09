import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { writeAvailability, readAvailability, DAYS, type Window } from '@/lib/availability';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  const admin = session?.user?.email ?? '';
  if (!admin || !isAdmin(admin)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const form = await req.formData();
  const action = String(form.get('action') ?? '');
  const current = await readAvailability({ fresh: true });
  let windows: Window[] = [...current.windows];
  const back = (q: string) => NextResponse.redirect(new URL(`/admin?${q}`, req.url), 303);

  if (action === 'add') {
    const day = String(form.get('day') ?? '');
    const from = String(form.get('from') ?? '').trim();
    const to = String(form.get('to') ?? '').trim();
    if (!DAYS.includes(day as never) || !from || !to) return back('a=bad');
    windows.push({ day, from, to });
  } else if (action === 'remove') {
    const idx = Number(form.get('index') ?? -1);
    if (idx < 0 || idx >= windows.length) return back('a=missing');
    windows.splice(idx, 1);
  } else {
    return back('a=unknown');
  }

  await writeAvailability(windows, admin);

  /* The footer, the contact page and the LocalBusiness schema are statically
   * rendered, so a write alone would not reach them until the next deploy —
   * the admin screen would show the change and the public site would not.
   * Revalidating the layout regenerates every page that renders these hours. */
  revalidatePath('/', 'layout');
  revalidatePath('/contact');

  return back(`a=${action}`);
}

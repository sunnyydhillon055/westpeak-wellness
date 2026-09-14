import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { submitSitemapToIndexNow } from '@/lib/indexnow';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/* "Submit the sitemap to IndexNow now" — a button in /admin, 13 Sep 2026.
   The weekly cron does the same thing on Monday mornings; this exists so the
   owner can push a change to Bing the day it ships, and so a run can be
   recorded on demand when the watchdog says there has never been one. */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }
  const r = await submitSitemapToIndexNow();
  const status = r.ok && !r.dry ? `ok-${r.submitted}` : 'failed';
  return NextResponse.redirect(new URL(`/admin?indexnow=${status}`, req.url), 303);
}

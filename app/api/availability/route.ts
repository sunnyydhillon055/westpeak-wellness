import { NextResponse } from 'next/server';
import { consultationAvailability } from '@/lib/cliniko-availability';
import { practitioners } from '@/lib/practitioners';

/* THE NEXT OPEN TIME, FOR THE STICKY BAR — 17 Sep 2026; and since 3 Oct
 * 2026 for every next-consultation line on a static page (item 429).
 *
 * Every page is static, and the one thing worth saying on all of them is the
 * one thing that changes: when the next free consultation actually is. This
 * hands the mobile booking bar that fact without making 290 pages dynamic.
 * Read from the same thirty-minute cache /book uses; never anything but the
 * counsellor's first name and formatted times. No key, no session, no client
 * data, so it is safe to be public and safe to be cached at the edge. */
export const runtime = 'nodejs';
export const revalidate = 1800;

export async function GET() {
  const all = await consultationAvailability();
  const out: Record<string, { first: string; next: string[]; count: number }> = {};
  for (const p of practitioners) {
    const a = all[p.slug];
    if (!a || a.error) continue;
    out[p.slug] = { first: p.name.split(' ')[0] ?? p.name, next: a.next ?? [], count: a.count };
  }
  /* max-age=60, since 3 Oct 2026 (item 429): the sticky bar and the
     consultation slots on a page (components/NextConsultSlot.tsx) each ask
     for this, and a browser that may keep the answer for a minute answers
     the second ask from its own cache instead of the network. */
  return NextResponse.json(out, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=1800, stale-while-revalidate=3600' },
  });
}

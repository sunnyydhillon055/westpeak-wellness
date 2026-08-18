import { NextResponse } from 'next/server';
import { countConversion } from '@/lib/conversion-log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Counts one conversion event. See lib/conversion-log.ts for the privacy
 * posture — counts, never events, and an allow-list so a crafted payload
 * cannot create keys.
 *
 * Always answers 204 regardless of outcome. This is called from a beacon on a
 * page somebody is in the middle of leaving; an error status would be logged by
 * the browser, would tell a prober which events are real, and could not be
 * acted on by the caller anyway. Analytics is never load-bearing.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { event?: unknown; path?: unknown };
    const event = typeof body.event === 'string' ? body.event : '';
    const path = typeof body.path === 'string' ? body.path : '';
    if (event && path) await countConversion(event, path);
  } catch {
    /* malformed body — nothing to count, nothing to report */
  }
  return new NextResponse(null, { status: 204 });
}

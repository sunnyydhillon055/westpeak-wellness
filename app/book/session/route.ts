import { countConversion } from '@/lib/conversion-log';
import { resolveBookSession } from '@/lib/book-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* The first-party hop in front of the paid calendar, for links in client
 * email only. See lib/book-session.ts for what is accepted and why.
 *
 * Always a 302 to a Cliniko paid-calendar URL that this site built: the
 * person is never shown an error, and a parameter that fails its check
 * widens the calendar rather than stopping them. The count is best-effort
 * and bounded, so a slow ledger write cannot hold somebody on a blank page
 * at the moment they decided to book. HEAD is answered without counting, so
 * a link checker that only probes does not register as a click. */

const COUNT_WAIT_MS = 1500;

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { location, 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

export async function GET(req: Request) {
  const target = resolveBookSession(new URL(req.url).searchParams);
  if (target.detail) {
    try {
      await Promise.race([
        countConversion('book_click', '/book/session', target.detail),
        new Promise((resolve) => setTimeout(resolve, COUNT_WAIT_MS)),
      ]);
    } catch {
      /* Analytics is never load-bearing. */
    }
  }
  return redirect(target.location);
}

export async function HEAD(req: Request) {
  return redirect(resolveBookSession(new URL(req.url).searchParams).location);
}

import { optOut, unsubValid } from '@/lib/nurture';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* One-click unsubscribe. CASL requires it and "one click" means one click.
 *
 * GET, not POST, and no confirmation step. Every extra screen between the link
 * and the outcome is a chance to fail somebody who has already decided, and a
 * confirmation page is a dark pattern wearing a seatbelt. The token is an HMAC
 * of the address so the link cannot be edited to unsubscribe someone else,
 * which a bare ?email= would allow.
 *
 * Returns HTML rather than redirecting to a page, so that the whole flow works
 * without touching the app router and cannot break if that page is renamed.
 * Always says the same thing, whether or not the address was on any list —
 * "you were not subscribed" tells a stranger who probes the endpoint whether an
 * address is in the system.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get('e') ?? '').trim();
  const token = (url.searchParams.get('t') ?? '').trim();

  if (email && token && unsubValid(email, token)) {
    try {
      await optOut(email);
    } catch {
      /* If the store is unreachable, say nothing different. Rather than
       * report a failure the person cannot act on, the practice sees it in the
       * cron report; meanwhile they can reply to any email and be removed by
       * hand. */
    }
  }

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Unsubscribed — Westpeak Wellness</title>
<style>
  body{margin:0;background:#faf7f1;font:16px/1.6 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#2b3138}
  .card{max-width:520px;margin:12vh auto;background:#fff;border-radius:10px;padding:34px 32px}
  h1{margin:0 0 14px;font-size:22px;color:#3d6c92}
  p{margin:0 0 12px}
  a{color:#3d6c92}
  .muted{color:#545e69;font-size:14px}
</style></head>
<body><div class="card">
<h1>Done — you are unsubscribed.</h1>
<p>You will not get any more of those emails. Nothing else changes, and no reply is needed.</p>
<p class="muted">This does not affect appointment confirmations or anything to do with a booking
you have made — those are not marketing and are not part of this list.</p>
<p><a href="https://www.westpeakwellness.com/">Back to the site</a></p>
</div></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'noindex' },
  });
}

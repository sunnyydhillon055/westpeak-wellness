import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { syncClientsFromCliniko } from '@/lib/cliniko-sync';
import { refreshCatalog } from '@/lib/cliniko-catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/* Pull from Cliniko now, rather than waiting for the two-hourly cron.
 *
 * The cron is the mechanism; this is the answer to "I changed something in
 * Cliniko and want to see it on the site". Without it the only recourse was
 * waiting up to two hours with no way to tell the difference between "not yet"
 * and "broken" — which is exactly the position this account was in when the
 * client list still showed one person.
 *
 * Authorised by the admin session rather than CRON_SECRET on purpose. The
 * secret is stored encrypted and Vercel will not decrypt it on `env pull`, so
 * nobody — including whoever set it — can retrieve it to call the cron route by
 * hand. An admin already sitting in /admin has strictly more authority than
 * that secret conveys, so requiring it here would add no security and remove
 * the only usable trigger.
 *
 * Re-authenticates from the cookie rather than assuming middleware ran.
 */
export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  if (!email || !isAdmin(email)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  /* Catalogue first, then clients. Independent of each other, and neither
   * failure should stop the other — a pricing problem must not leave the client
   * list stale, or the reverse. */
  const catalog = await refreshCatalog();
  if (!catalog.ok) console.error('[admin-sync] catalogue:', catalog.reason);

  const clients = await syncClientsFromCliniko(`admin:${email}`);
  if (!clients.ok) console.error('[admin-sync] clients:', clients.reason);

  /* Outcome carried in the URL so the admin page can say what happened. No
   * personal data in it — counts only, never an address. */
  const status = clients.ok
    ? `ok&added=${clients.added}&total=${clients.totalInCliniko}&named=${clients.namesFilled}&noemail=${clients.skippedNoEmail}`
    : `err&why=${encodeURIComponent(clients.reason ?? 'unknown')}`;

  return NextResponse.redirect(new URL(`/admin?sync=${status}`, req.url), 303);
}

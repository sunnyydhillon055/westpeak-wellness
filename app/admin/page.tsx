import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readClients } from '@/lib/clients';
import { readAvailability, DAYS } from '@/lib/availability';
import { listPasswordAccounts } from '@/lib/portal-users';
import { clinikoConfigured } from '@/lib/cliniko';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Practice admin — Westpeak Wellness' },
  robots: { index: false, follow: false },
};
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Messages are looked up by key, so nothing user-supplied is ever reflected
 * back into the page. */
const CLIENT_MSG: Record<string, string> = {
  add: 'Client added. They can sign in straight away.',
  update: 'Saved.',
  remove: 'Removed, and any password for that address was cleared with it.',
  duplicate: 'That email is already on the list. Nothing was changed.',
  bademail: 'That does not look like an email address. Nothing was changed.',
  missing: 'That client no longer exists — the list may have changed in another tab.',
  conflict:
    'Someone else changed the list while this page was open, so nothing was saved. ' +
    'The table below is now current — make the change again.',
  unknown: 'Nothing was changed.',
};
const AVAIL_MSG: Record<string, string> = {
  add: 'Hours added. Remember to mirror this in Cliniko.',
  remove: 'Hours removed. Remember to mirror this in Cliniko.',
  bad: 'A day, a start and an end are all needed. Nothing was changed.',
  missing: 'That entry no longer exists.',
};
const PW_MSG: Record<string, string> = {
  set: 'Password set. Give it to the client directly — it is not emailed to them.',
  cleared: 'Password removed. That client can now only sign in with Google.',
  short: 'Nothing changed: passwords must be at least 10 characters.',
  missing: 'Nothing changed: no email address was given.',
  error: 'Could not save that. Nothing changed.',
};
const CLINIKO_MSG: Record<string, string> = {
  found: 'Connected, and Cliniko recognised that address — Cliniko patients can sign in without being listed here.',
  'not-found': 'Connected, and Cliniko has no patient with that address. The key works; try one you know is in Cliniko.',
  unconfigured: 'No CLINIKO_API_KEY is set, so Cliniko is not consulted at all.',
  'bad-key': 'Cliniko rejected the key. Check it was copied whole, including the shard suffix.',
  'no-shard': 'The key has no shard suffix (…-au1, …-ca1). Copy it again without trimming the end.',
  'unsupported-filter': 'Cliniko rejected the email filter, so searching patients by email is not available on this account. Keep using the list.',
  error: 'Could not reach Cliniko. Nothing changed; client access is unaffected.',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  paused: 'Paused',
  former: 'Former',
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: {
    c?: string; a?: string; pw?: string; cliniko?: string;
    sync?: string; added?: string; total?: string; named?: string;
    noemail?: string; why?: string;
  };
}) {
  const session = await auth();
  const email = session?.user?.email ?? '';
  // Re-checked here, not only at sign-in, so removing an administrator takes
  // effect on their next request rather than when their token expires.
  if (!email || !isAdmin(email)) redirect('/signin?next=%2Fadmin');

  const book = await readClients({ fresh: true });
  const avail = await readAvailability({ fresh: true });
  const withPasswords = await listPasswordAccounts();

  const active = book.clients.filter((c) => c.status === 'active').length;
  /* Result of a manual "Sync from Cliniko now". Counts only — the redirect
     deliberately carries no addresses. */
  const syncOk = searchParams?.sync === 'ok';
  const syncNote = searchParams?.sync
    ? syncOk
      ? `Synced. ${searchParams.total ?? '0'} active patient(s) in Cliniko · ` +
        `${searchParams.added ?? '0'} newly added · ${searchParams.named ?? '0'} name(s) filled` +
        (Number(searchParams.noemail ?? 0) > 0
          ? ` · ${searchParams.noemail} skipped with no email on file`
          : '')
      : `Sync failed: ${searchParams.why ?? 'unknown'}`
    : null;

  const notices = [
    searchParams?.c && CLIENT_MSG[searchParams.c],
    searchParams?.a && AVAIL_MSG[searchParams.a],
    searchParams?.pw && PW_MSG[searchParams.pw],
    searchParams?.cliniko && CLINIKO_MSG[searchParams.cliniko],
  ].filter(Boolean) as string[];

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container container--wide">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Practice admin</p>
            <h1 style={{ fontSize: 'var(--fs-h2)', margin: 0 }}>Clients &amp; availability</h1>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button type="submit" className="btn btn--ghost">Sign out</button>
          </form>
        </div>

        {notices.map((n) => (
          <div className="crisis" style={{ marginTop: 18 }} key={n}>
            <p style={{ margin: 0 }}>{n}</p>
          </div>
        ))}

        <div className="admin-stats">
          <div><strong>{active}</strong><span>can sign in</span></div>
          <div><strong>{book.clients.length}</strong><span>on the books</span></div>
          <div><strong>{avail.windows.length}</strong><span>weekly windows</span></div>
          <div><strong>{withPasswords.length}</strong><span>with a password</span></div>
        </div>

        {/* ---------------------------------------------------------- CLIENTS */}
        <h2 id="clients" style={{ marginTop: 40 }}>Clients</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          Only <strong>active</strong> clients can sign in. <em>Paused</em> keeps the record but
          closes access — for someone between blocks of sessions. <em>Former</em> is for people
          who have finished. Removing deletes the record and any password with it.
        </p>

        {book.clients.length === 0 ? (
          <p className="admin-empty">
            No clients yet. Add the first one below — they can sign in as soon as you do.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Clients, their access status and administrative notes</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Status</th>
                  <th scope="col">Note</th>
                  <th scope="col">Added</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {book.clients.map((c) => (
                  <tr key={c.id} className={c.status !== 'active' ? 'is-muted' : undefined}>
                    <td data-label="Name">
                      <input
                        form={`f-${c.id}`} name="name" defaultValue={c.name}
                        placeholder="Not recorded" aria-label={`Name for ${c.email}`}
                      />
                    </td>
                    <td data-label="Email"><span className="admin-email">{c.email}</span></td>
                    <td data-label="Status">
                      <select
                        form={`f-${c.id}`} name="status" defaultValue={c.status}
                        aria-label={`Status for ${c.email}`}
                      >
                        {Object.entries(STATUS_LABEL).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </td>
                    <td data-label="Note">
                      <input
                        form={`f-${c.id}`} name="note" defaultValue={c.note ?? ''}
                        placeholder="Admin only — not clinical"
                        aria-label={`Note for ${c.email}`}
                      />
                    </td>
                    <td data-label="Added" className="admin-date">
                      {c.addedAt ? new Date(c.addedAt).toLocaleDateString('en-CA') : '—'}
                    </td>
                    <td data-label="Actions" className="admin-actions">
                      {/* One form per row: an edit or a removal names the person
                          it affects, so a mistake costs one record rather than
                          rewriting the whole list. */}
                      <form method="POST" action="/api/admin/clients" id={`f-${c.id}`}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="version" value={book.version} />
                        <button type="submit" name="action" value="update" className="admin-btn">
                          Save
                        </button>
                        <button
                          type="submit" name="action" value="remove"
                          className="admin-btn admin-btn--danger"
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form method="POST" action="/api/admin/clients" className="admin-add">
          <h3>Add a client</h3>
          <input type="hidden" name="action" value="add" />
          <input type="hidden" name="version" value={book.version} />
          <div className="admin-add-row">
            <label htmlFor="new-name" className="sr-only">Name</label>
            <input id="new-name" name="name" placeholder="Name" autoComplete="off" />
            <label htmlFor="new-email" className="sr-only">Email</label>
            <input
              id="new-email" name="email" type="email" required placeholder="name@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <label htmlFor="new-note" className="sr-only">Note</label>
            <input id="new-note" name="note" placeholder="Note (optional)" autoComplete="off" />
            <button type="submit" className="btn btn--primary">Add</button>
          </div>
        </form>

        <p className="admin-meta">
          {book.updatedAt
            ? `Last changed ${new Date(book.updatedAt).toLocaleString('en-CA')} by ${book.updatedBy}. Version ${book.version}.`
            : 'No changes recorded yet.'}
        </p>

        {/* ----------------------------------------------------- AVAILABILITY */}
        <h2 id="availability" style={{ marginTop: 44 }}>Availability</h2>
        <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
          What the website tells people — the footer, the contact page, the portal, and the
          structured data Google reads. <strong>It does not control booking.</strong> Cliniko
          decides what can actually be reserved, so change both, or the site will advertise hours
          you cannot offer.
        </p>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="sr-only">Weekly bookable windows</caption>
            <thead>
              <tr>
                <th scope="col">Day</th><th scope="col">From</th><th scope="col">To</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {avail.windows.map((w, i) => (
                <tr key={`${w.day}-${w.from}-${i}`}>
                  <td data-label="Day">{w.day}</td>
                  <td data-label="From">{w.from}</td>
                  <td data-label="To">{w.to}</td>
                  <td data-label="Actions" className="admin-actions">
                    <form method="POST" action="/api/admin/availability">
                      <input type="hidden" name="action" value="remove" />
                      <input type="hidden" name="index" value={i} />
                      <button type="submit" className="admin-btn admin-btn--danger">Remove</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form method="POST" action="/api/admin/availability" className="admin-add">
          <h3>Add hours</h3>
          <input type="hidden" name="action" value="add" />
          <div className="admin-add-row">
            <label htmlFor="av-day" className="sr-only">Day</label>
            <select id="av-day" name="day" defaultValue="Monday">
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <label htmlFor="av-from" className="sr-only">From</label>
            <input id="av-from" name="from" placeholder="9:00 am" required autoComplete="off" />
            <label htmlFor="av-to" className="sr-only">To</label>
            <input id="av-to" name="to" placeholder="12:00 pm" required autoComplete="off" />
            <button type="submit" className="btn btn--primary">Add</button>
          </div>
        </form>

        {/* --------------------------------------------------------- BOOKINGS */}
        <h2 id="bookings" style={{ marginTop: 44 }}>Bookings</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            <strong>Bookings are not held here, deliberately.</strong> Cliniko is the record —
            it takes the payment, issues the invoice and holds the clinical file. A copy on this
            site would drift out of step within a day, and would put clinical information in a
            second system in another country for no benefit.
          </p>
          <p style={{ marginBottom: 0 }}>
            {site.bookingReady ? (
              <a className="btn btn--ghost" href={site.bookingsUrl} target="_blank" rel="noopener">
                Open Cliniko bookings
              </a>
            ) : (
              <>
                Set <code>NEXT_PUBLIC_CLINIKO_URL</code> to embed the calendar on{' '}
                <Link href="/book">/book</Link> and in the client portal.
              </>
            )}
          </p>
        </div>

        {/* -------------------------------------------------------- PASSWORDS */}
        <h2 id="passwords" style={{ marginTop: 44 }}>Passwords</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            Rarely needed. Anyone on the list can set or reset their own from{' '}
            <Link href="/forgot">the reset page</Link>, which emails a one-time link. Use this
            only when someone cannot receive that email. Clients signing in with Google never
            need one.
          </p>
          <form method="POST" action="/api/admin/password" className="admin-add-row">
            <label htmlFor="pw-target" className="sr-only">Client email</label>
            <input
              id="pw-target" name="target" type="email" required placeholder="name@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <label htmlFor="pw-value" className="sr-only">New password</label>
            <input
              id="pw-value" name="password" type="text" minLength={10}
              placeholder="At least 10 characters" autoComplete="off" spellCheck={false}
            />
            <button type="submit" className="btn btn--primary">Set</button>
            <button type="submit" name="clear" value="1" className="btn btn--ghost">Remove</button>
          </form>
          {withPasswords.length > 0 && (
            <p className="admin-meta" style={{ marginBottom: 0 }}>
              Has a password: {withPasswords.join(', ')}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------- CLINIKO */}
        <h2 id="cliniko" style={{ marginTop: 44 }}>Cliniko connection</h2>
        <div className="admin-panel">
          <p style={{ marginTop: 0 }}>
            {clinikoConfigured()
              ? 'A key is set. Enter an address that exists in Cliniko to confirm lookups work.'
              : 'No key set, so the client list above is the only thing granting access.'}{' '}
            Cliniko can only ever <em>add</em> a way to qualify — if it is unreachable, everyone
            on the list still gets in.
          </p>
          <form method="POST" action="/api/admin/cliniko" className="admin-add-row">
            <label htmlFor="ck" className="sr-only">Test an address</label>
            <input
              id="ck" name="probe" type="email" required placeholder="someone@example.com"
              autoComplete="off" autoCapitalize="none" spellCheck={false}
            />
            <button type="submit" className="btn btn--ghost">Test connection</button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '22px 0 18px' }} />

          <p style={{ marginTop: 0 }}>
            Every active Cliniko patient is pulled onto the list automatically every two hours,
            along with session prices and durations. Use this to pull now rather than waiting —
            after adding someone in Cliniko, or after changing a fee.
          </p>
          {syncNote && (
            <p role="status" className={syncOk ? 'admin-ok' : 'portal-gate-error'} style={{ marginTop: 0 }}>
              {syncNote}
            </p>
          )}
          <form method="POST" action="/api/admin/sync">
            <button type="submit" className="btn btn--primary">Sync from Cliniko now</button>
          </form>
        </div>

        <p className="admin-meta" style={{ marginTop: 34 }}>
          Signed in as {email}. Client changes take effect on the person&rsquo;s next request.
          Availability changes regenerate the public pages that show them, which usually takes
          a few seconds. Environment variables still need a redeploy. See{' '}
          <code>ADMIN_NOTES.md</code>.
        </p>
      </div>
    </section>
  );
}

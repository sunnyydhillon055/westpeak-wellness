import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readClients, writeClients } from '@/lib/clients';
import { readLedger, recordContacted } from '@/lib/lifecycle';
import { reactivationEmail } from '@/lib/lifecycle-mail';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { recordAudit } from '@/lib/admin-audit';
import { readNotSeenLately } from '@/lib/cliniko-sync';
import { practitioners } from '@/lib/practitioners';

/* /admin, "NOT SEEN LATELY" — 1 Oct 2026.
 *
 * "Reaching back" lists clients whose status a person changed, and nothing
 * changes a status on its own, so it stayed empty while paying clients
 * drifted away. This lists them from Cliniko itself: a held paid session 45
 * or more days ago, nothing upcoming, and no reactivation note ever sent.
 *
 * Same rules as "Reaching back", deliberately: one button per person and no
 * "send to all", because whether to write to a particular client is a
 * clinical judgement; the lifecycle ledger keeps it to one message per
 * person, ever, re-checked inside the action. The note links her own paid
 * calendar and replies to her when she is on the online calendar.
 *
 * Server component, so the roster stays on the server. It fetches Cliniko on
 * render; any failure prints the reason and the rest of /admin is unaffected. */

const fmtDay = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
};

const counsellorFor = (practitionerId: string) => practitioners.find((p) => p.clinikoPractitionerId && p.clinikoPractitionerId === practitionerId);

export default async function NotSeenLately() {
  const live = await readNotSeenLately().catch((e: unknown) => ({ error: e instanceof Error ? e.message : 'request failed' }));
  const ledger = await readLedger({ fresh: true });
  const book = await readClients({ fresh: true });
  const statusOf = new Map(book.clients.map((c) => [c.email, c.status]));
  const rows = 'error' in live ? [] : live.rows.filter((r) => !ledger.reactivation[r.email]);

  return (
    <>
      <h2 id="not-seen-lately" style={{ marginTop: 44 }}>Not seen lately</h2>
      <p style={{ color: 'var(--ink-soft)', maxWidth: '40.38em' }}>
        From Cliniko: clients with at least one paid session, the last one 45 or more days ago,
        nothing booked since, and no reactivation note sent. The same once-only note as above,
        linking their own counsellor&rsquo;s calendar. Send one at a time, only where you judge it
        appropriate. &ldquo;Mark paused&rdquo; moves them to Reaching back and ends their portal
        sign-in until set active again.
      </p>
      {'error' in live ? (
        <div className="admin-panel"><p style={{ margin: 0 }}>Could not read Cliniko: {live.error}</p></div>
      ) : rows.length === 0 ? (
        <div className="admin-panel"><p style={{ margin: 0 }}>Nobody fits that description at the moment.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Client</th><th>Last session</th><th>With</th><th>Held</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pr = counsellorFor(r.practitionerId);
                const status = statusOf.get(r.email);
                return (
                  <tr key={r.patientId}>
                    <td>
                      {r.name || <em style={{ color: 'var(--ink-faint)' }}>no name</em>}<br />
                      <span className="admin-email">{r.email}</span>
                    </td>
                    <td className="admin-date">{fmtDay(r.lastAt)} ({r.daysSince} days)</td>
                    {/* Named only when on the online calendar: the name
                        guard keeps one name to /about, /practitioners and
                        her own profile, and this page is no exception. */}
                    <td>{pr ? (pr.bookable ? pr.name : 'Books by reply') : '(not on the roster)'}</td>
                    <td>{r.held}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {status === 'active' && (
                        <form
                          style={{ display: 'inline' }}
                          action={async () => {
                            'use server';
                            const sess = await auth();
                            const who = sess?.user?.email ?? '';
                            if (!who || !isAdmin(who)) return;
                            const current = await readClients({ fresh: true });
                            const next = current.clients.map((c) => (c.email === r.email && c.status === 'active'
                              ? { ...c, status: 'paused' as const, updatedAt: new Date().toISOString() }
                              : c));
                            const res = await writeClients(next, who, current.version);
                            if (res.ok) await recordAudit({ actor: who, action: 'client pause (not seen lately)', subject: r.email });
                            revalidatePath('/admin');
                          }}
                        >
                          <button type="submit" className="btn btn--ghost btn--sm">Mark paused</button>
                        </form>
                      )}
                      {status === 'paused' && <span style={{ color: 'var(--ink-faint)', fontSize: '.86rem' }}>Paused </span>}
                      <form
                        style={{ display: 'inline', marginLeft: 6 }}
                        action={async () => {
                          'use server';
                          const sess = await auth();
                          const who = sess?.user?.email ?? '';
                          if (!who || !isAdmin(who)) return;
                          /* Re-checked inside the action: a server action is its own POST endpoint. */
                          if (await readLedger({ fresh: true }).then((l) => Boolean(l.reactivation[r.email]))) return;
                          const c = counsellorFor(r.practitionerId);
                          const mail = reactivationEmail(r.firstName, c
                            ? { firstName: c.name.split(/\s+/)[0], clinikoPractitionerId: c.clinikoPractitionerId, bookable: c.bookable, alertEmail: c.alertEmail }
                            : null);
                          const sent = await sendDetailed(r.email, mail.subject, mail.text, mail.html, { replyTo: mail.replyTo });
                          /* Recorded only on a confirmed send, as above. */
                          if (sent.ok) await recordContacted(r.email);
                          revalidatePath('/admin');
                        }}
                      >
                        <button type="submit" className="btn btn--ghost btn--sm" disabled={!mailConfigured()}>Send note</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!('error' in live) && live.truncated && (
        <p style={{ fontSize: '.86rem', color: 'var(--ink-faint)' }}>Cliniko had more appointments than one read takes; the list may be incomplete.</p>
      )}
    </>
  );
}

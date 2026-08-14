import { put, get } from '@vercel/blob';
import { readClients } from '@/lib/clients';
import { hasPassword, credentialFingerprint } from '@/lib/portal-users';
import { createResetToken } from '@/lib/portal-auth';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { site } from '@/lib/site';

/* Invites active clients who have no portal password yet to create one.
 *
 * REUSES THE RESET FLOW ON PURPOSE. An invite and a reset are the same object:
 * a signed, expiring, single-use link that lets somebody who controls the
 * address set a credential. lib/portal-auth.ts already builds those, and
 * credentialFingerprint() already returns a stable 'no-password-set' marker for
 * accounts without one — that case was designed for exactly this. A parallel
 * invite-token system would be a second thing to get wrong.
 *
 * THE PRACTICE NEVER SEES THE PASSWORD. It is not sent, not stored, and not
 * recoverable. lib/portal-users.ts derives it with PBKDF2-SHA256 over a random
 * 16-byte salt and keeps only the derived bits, so there is nothing in the
 * store that can be turned back into what the client typed. The admin screen
 * can see THAT someone has a password, never what it is. If a client forgets
 * it, the only route is another link like this one — which is the correct
 * property, not a limitation.
 *
 * SENT ONCE, NOT EVERY RUN. The cron fires every couple of hours and the
 * invitee list barely changes, so without a ledger this would email the same
 * people forever. Recorded by address before the next send is attempted.
 *
 * A client who is invited and then sets a password drops out naturally, since
 * hasPassword() becomes true.
 */

const KEY = 'portal/invited.json';
/* Long enough that somebody can be re-invited if they lost the first mail,
 * short enough that it is not effectively "once, ever". */
const REINVITE_AFTER_MS = 30 * 864e5;

/* Per-run cap, and it is a deliverability control rather than politeness.
 *
 * The first run after the Cliniko sync lands has every client on the books and
 * none of them holding a password, so without a cap it would send the practice's
 * entire client list in one burst -- from a sending domain with no history at
 * all. That is the exact shape spam filters are built to catch: a cold domain
 * whose first ever traffic is a large simultaneous batch. Getting flagged on day
 * one would poison every later email, including the booking confirmations that
 * actually matter.
 *
 * Spreading it means the domain earns a reputation on small volume first. At ten
 * per two-hour run a list of any realistic size clears within a day or two, and
 * a bounce problem shows up while it is still ten addresses rather than all of
 * them.
 *
 * DEFAULT IS 0 -- THE PROACTIVE SWEEP IS OFF.
 *
 * Emailing a practice's entire client list about a portal they never asked for
 * is a decision the practice gets to make, and the answer here was no. Setup is
 * triggered by the client instead: they enter their address at sign-in, and if
 * they are a client without a password they are sent the link then. Nobody who
 * does not go looking for the portal ever hears about it.
 *
 * The sweep is kept rather than deleted because it is the right tool for a
 * deliberate, announced rollout later. Set INVITE_BATCH_LIMIT to a number to
 * switch it on; it stays capped per run for the cold-domain reason above. */
const DEFAULT_BATCH = 0;

function batchLimit(): number {
  const raw = process.env.INVITE_BATCH_LIMIT?.trim();
  if (raw === undefined || raw === '') return DEFAULT_BATCH;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : DEFAULT_BATCH;
}

type Ledger = Record<string, string>; // email -> ISO timestamp of last invite

async function read(): Promise<Ledger> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    return ((await new Response(hit.stream).json()) as Ledger) ?? {};
  } catch {
    return {};
  }
}

async function write(l: Ledger): Promise<void> {
  await put(KEY, JSON.stringify(l, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export type InviteResult = {
  ok: boolean;
  sent: number;
  alreadyHavePassword: number;
  recentlyInvited: number;
  /** Eligible but held back by the per-run cap; they go out next run. */
  deferred: number;
  limit: number;
  failures: string[];
  reason?: string;
};

/* The invite email itself, in one place. The on-demand path and the batch
 * sweep must not drift apart -- a client should get the same message
 * whether they asked for it or a sweep sent it. */
function inviteBody(first: string, url: string): { text: string; html: string } {
  const text =
`Hi ${first},

Westpeak Wellness has a secure client portal where you can book
sessions, see upcoming appointments and manage your details.

To set it up, choose a password here:

${url}

The link works once and expires. Nobody at the practice can see the
password you choose — it is stored in a form that cannot be read back,
so if you forget it we can only send another link like this one.

If you would rather not use the portal, you can ignore this. It changes
nothing about your appointments.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
${site.domain}`;

  const html =
`<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#22262b;max-width:520px;line-height:1.65;">
  <p style="margin:0 0 14px;font-size:15px;">Hi ${first},</p>
  <p style="margin:0 0 14px;font-size:15px;">Westpeak Wellness has a secure client portal where you can book sessions, see upcoming appointments and manage your details.</p>
  <p style="margin:0 0 22px;"><a href="${url}" style="display:inline-block;background:#1f3d4d;color:#fff;text-decoration:none;padding:11px 20px;border-radius:6px;font-weight:600;font-size:15px;">Choose a password</a></p>
  <p style="margin:0 0 14px;font-size:14px;">The link works once and expires. <strong>Nobody at the practice can see the password you choose</strong> — it is stored in a form that cannot be read back, so if you forget it we can only send another link like this one.</p>
  <p style="margin:0 0 14px;font-size:14px;">If you would rather not use the portal, ignore this. It changes nothing about your appointments.</p>
  <p style="margin:22px 0 0;font-size:12px;color:#6b7280;">If you are in immediate danger call 911. For urgent mental-health support in BC, call or text <strong>9-8-8</strong> at any hour.<br>Westpeak Wellness · <a href="${site.domain}" style="color:#6b7280;">${site.domain.replace(/^https?:\/\//, '')}</a></p>
</div>`;
  return { text, html };
}

/* One invite, sent because the client asked for it. Shared with the batch
 * sweep so there is exactly one definition of the email and the token. */
export async function sendInviteEmail(
  email: string, name?: string
): Promise<{ ok: boolean; detail?: string }> {
  const secret = process.env.PORTAL_SECRET?.trim();
  if (!secret) return { ok: false, detail: 'PORTAL_SECRET is not set' };
  if (!mailConfigured()) return { ok: false, detail: 'mail is not configured' };
  const fp = await credentialFingerprint(email);
  const token = await createResetToken(email, secret, fp);
  const url = `${site.domain}/reset?token=${encodeURIComponent(token)}`;
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  const { text, html } = inviteBody(first, url);
  return sendDetailed(email, 'Set up your Westpeak Wellness client portal', text, html);
}

export async function sendPortalInvites(opts: { dry?: boolean } = {}): Promise<InviteResult> {
  const limit = batchLimit();
  const base: InviteResult = {
    ok: false, sent: 0, alreadyHavePassword: 0, recentlyInvited: 0,
    deferred: 0, limit, failures: [],
  };

  if (limit === 0) {
    return { ...base, ok: true, reason: 'INVITE_BATCH_LIMIT=0 — invites are switched off' };
  }

  const secret = process.env.PORTAL_SECRET?.trim();
  if (!secret) return { ...base, reason: 'PORTAL_SECRET is not set — cannot sign invite links' };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set — cannot send' };
  }

  const { clients } = await readClients({ fresh: true });
  const ledger = await read();
  const now = Date.now();
  const result: InviteResult = { ...base, ok: true };

  for (const c of clients) {
    // Only active clients. Paused and former are on the books deliberately and
    // must not be handed portal access by a background job.
    if (c.status !== 'active') continue;

    if (await hasPassword(c.email)) { result.alreadyHavePassword++; continue; }

    const last = ledger[c.email] ? Date.parse(ledger[c.email]) : 0;
    if (last && now - last < REINVITE_AFTER_MS) { result.recentlyInvited++; continue; }

    /* Cap reached: count the rest as deferred rather than silently stopping,
       so the log says how much is still queued instead of looking finished. */
    if (result.sent >= limit) { result.deferred++; continue; }

    if (opts.dry) { result.sent++; continue; }

    try {
      const fp = await credentialFingerprint(c.email);
      const token = await createResetToken(c.email, secret, fp);
      const url = `${site.domain}/reset?token=${encodeURIComponent(token)}`;
      const first = (c.name || '').trim().split(/\s+/)[0] || 'there';

      const { text, html } = inviteBody(first, url);

      const sent = await sendDetailed(c.email, 'Set up your Westpeak Wellness client portal', text, html);
      if (sent.ok) {
        ledger[c.email] = new Date().toISOString();
        result.sent++;
      } else {
        result.failures.push(`${c.email}: ${sent.detail ?? 'send failed'}`);
      }
    } catch (e) {
      result.failures.push(`${c.email}: ${e instanceof Error ? e.message : 'failed'}`);
    }
  }

  if (!opts.dry && result.sent > 0) await write(ledger);
  return result;
}

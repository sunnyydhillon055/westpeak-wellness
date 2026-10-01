import { put, get } from '@vercel/blob';
import { readClients } from '@/lib/clients';
import { hasPassword, credentialFingerprint } from '@/lib/portal-users';
import { createResetToken } from '@/lib/portal-auth';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { site, CONSULT_TYPE } from '@/lib/site';
import { headers } from '@/lib/cliniko';
import { isConsultAppointment } from '@/lib/booking-shape';

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
    const hit = await get(KEY, { access: 'private', useCache: false });
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

/* The invite email itself, in one place. The on-demand path, the batch sweep
 * and the new-client welcome must not drift apart -- a client should get the
 * same message whichever path sent it. The welcome variant differs by its
 * opening, because that person did not ask for anything: they were added as
 * a client and this is the practice telling them what exists and how to get
 * in. */
function inviteBody(first: string, url: string, welcome = false): { text: string; html: string } {
  const opening = welcome
    ? `Welcome to Westpeak Wellness. Now that you are a client, you have a
secure online portal where you can book sessions, see upcoming
appointments and manage your details. Your sign-in is this email address.`
    : `Westpeak Wellness has a secure client portal where you can book
sessions, see upcoming appointments and manage your details.`;
  const openingHtml = welcome
    ? `Welcome to Westpeak Wellness. Now that you are a client, you have a secure online portal where you can book sessions, see upcoming appointments and manage your details. <strong>Your sign-in is this email address.</strong>`
    : `Westpeak Wellness has a secure client portal where you can book sessions, see upcoming appointments and manage your details.`;
  const text =
`Hi ${first},

${opening}

To set it up, choose a password here:

${url}

You can also sign in at any time without a password: enter this email
address at ${site.domain}${site.portalPath} and a one-time code is sent to it.

The link works once and expires. Nobody at the practice can see the
password you choose. It is stored in a form that cannot be read back,
so if you forget it we can only send another link like this one.

If you would rather not use the portal, you can ignore this. It changes
nothing about your appointments.

If you are in immediate danger call 911. For urgent mental-health
support in BC, call or text 9-8-8 at any hour.

Westpeak Wellness
${site.domain}`;

  const html =
`<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2b3138;max-width:520px;line-height:1.65;">
  <p style="margin:0 0 14px;font-size:15px;">Hi ${first},</p>
  <p style="margin:0 0 14px;font-size:15px;">${openingHtml}</p>
  <p style="margin:0 0 22px;"><a href="${url}" style="display:inline-block;background:#3d6c92;color:#fff;text-decoration:none;padding:11px 20px;border-radius:6px;font-weight:600;font-size:15px;">Choose a password</a></p>
  <p style="margin:0 0 14px;font-size:14px;">You can also sign in at any time without a password: enter this email address at <a href="${site.domain}${site.portalPath}" style="color:#3d6c92;">${site.domain.replace(/^https?:\/\//, '')}${site.portalPath}</a> and a one-time code is sent to it.</p>
  <p style="margin:0 0 14px;font-size:14px;">The link works once and expires. <strong>Nobody at the practice can see the password you choose</strong>. It is stored in a form that cannot be read back, so if you forget it we can only send another link like this one.</p>
  <p style="margin:0 0 14px;font-size:14px;">If you would rather not use the portal, ignore this. It changes nothing about your appointments.</p>
  <p style="margin:22px 0 0;font-size:12px;color:#545e69;">If you are in immediate danger call 911. For urgent mental-health support in BC, call or text <strong>9-8-8</strong> at any hour.<br>Westpeak Wellness · <a href="${site.domain}" style="color:#545e69;">${site.domain.replace(/^https?:\/\//, '')}</a></p>
</div>`;
  return { text, html };
}

/* One invite, sent because the client asked for it. Shared with the batch
 * sweep so there is exactly one definition of the email and the token. */
export async function sendInviteEmail(
  email: string, name?: string, opts: { welcome?: boolean } = {}
): Promise<{ ok: boolean; detail?: string }> {
  const secret = process.env.PORTAL_SECRET?.trim();
  if (!secret) return { ok: false, detail: 'PORTAL_SECRET is not set' };
  if (!mailConfigured()) return { ok: false, detail: 'mail is not configured' };
  const fp = await credentialFingerprint(email);
  const token = await createResetToken(email, secret, fp);
  const url = `${site.domain}/reset?token=${encodeURIComponent(token)}`;
  const first = (name || '').trim().split(/\s+/)[0] || 'there';
  const { text, html } = inviteBody(first, url, opts.welcome === true);
  const subject = opts.welcome
    ? 'Welcome to Westpeak Wellness: your client portal'
    : 'Set up your Westpeak Wellness client portal';
  return sendDetailed(email, subject, text, html);
}

/* ============================================================================
   NEW CLIENTS ARE WELCOMED AUTOMATICALLY — decided 6 Sep 2026.
   ----------------------------------------------------------------------------
   The sweep above stays off: emailing the whole historical list about a portal
   nobody asked for was refused, and still is. This is the narrower thing the
   owner asked for: when somebody is added as a client in Cliniko, the next
   sync (every two hours, or an admin's manual sync) creates their portal
   record and sends them ONE welcome email with a set-password link and the
   one-time-code route. Their credential is their email address; the password
   is theirs to choose and the practice never sees it.

   Only the records that were added in that run are candidates — never "every
   active client without a password", which is what the sweep is for. The
   invite ledger is shared with the sweep, so the two can never double-send.
   Capped per run for the same cold-domain reason as the sweep; a practice
   this size adds clients a few at a time and a cap of ten is never reached
   in ordinary use, only on the first sync after Cliniko was connected.

   NEW_CLIENT_INVITES=0 switches it off.

   NARROWED 1 OCT 2026: A PAID BOOKING FIRST. Cliniko creates a patient on
   every online booking, the free consultation included, so the welcome
   ("Now that you are a client...") was reaching people before their free
   call, while they were still deciding, as a fourth email around a
   consultation. A record that came from Cliniko is now welcomed only once
   that patient has at least one appointment that is not the consultation
   and is not cancelled: one /appointments read per patient. Until then it
   waits in portal/welcome-pending.json (address, first name, when it was
   added) and every later sync checks it again, for up to 120 days. Someone
   who never books a session is never told they are a client.

   A client added by hand in /admin carries no Cliniko link and is welcomed
   at once, as before: an administrator adding them is the decision.
   ========================================================================= */
const WELCOME_CAP = 10;

const welcomeEnabled = () => (process.env.NEW_CLIENT_INVITES ?? '1').trim() !== '0';

/* Pure, so it can be tested: which of the just-added records get a welcome
   this run, given the ledger and the cap. Exported for the test only. */
export function pickNewInvitees(
  added: { email: string; status: string }[],
  ledger: Record<string, string>,
  now: number,
  limit = WELCOME_CAP
): { send: string[]; deferred: number; recentlyInvited: number; notActive: number } {
  const send: string[] = [];
  let deferred = 0, recentlyInvited = 0, notActive = 0;
  const seen = new Set<string>();
  for (const c of added) {
    if (seen.has(c.email)) continue;
    seen.add(c.email);
    if (c.status !== 'active') { notActive++; continue; }
    const last = ledger[c.email] ? Date.parse(ledger[c.email]) : 0;
    if (last && now - last < REINVITE_AFTER_MS) { recentlyInvited++; continue; }
    if (send.length >= limit) { deferred++; continue; }
    send.push(c.email);
  }
  return { send, deferred, recentlyInvited, notActive };
}

/* One appointment that makes someone a client: not the free consultation,
   not cancelled, not archived. Pure, exported for the test. */
export function hasPaidAppointment(
  appts: { cancelled_at?: string | null; archived_at?: string | null; appointment_type?: { links?: { self?: string } } | null }[],
  consultTypeId = CONSULT_TYPE,
): boolean {
  return appts.some((ap) => !ap.cancelled_at && !ap.archived_at && !isConsultAppointment(ap, consultTypeId));
}

const PENDING_KEY = 'portal/welcome-pending.json';
const PENDING_MAX_MS = 120 * 864e5;
type Pending = Record<string, { first: string; since: string; url: string }>;

async function readPending(): Promise<Pending> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(PENDING_KEY, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    const v = (await new Response(hit.stream).json()) as Pending;
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

async function writePending(v: Pending): Promise<void> {
  await put(PENDING_KEY, JSON.stringify(v, null, 2), {
    access: 'private', contentType: 'application/json',
    addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
  });
}

/* Does this Cliniko patient have a paid booking yet? true, false, or null
   when Cliniko could not be asked; null keeps them waiting, never welcomes. */
async function patientHasPaidBooking(url: string): Promise<boolean | null> {
  const key = process.env.CLINIKO_API_KEY?.trim();
  if (!key || !/^https:\/\/api\.[a-z0-9]+\.cliniko\.com\//.test(url)) return null;
  let next: string | null = `${url}${url.includes('?') ? '&' : '?'}per_page=100`;
  try {
    for (let page = 0; page < 5 && next; page++) {
      const res: Response = await fetch(next, { headers: headers(key), cache: 'no-store' });
      if (!res.ok) return null;
      const body = (await res.json()) as { appointments?: any[]; links?: { next?: string } };
      if (hasPaidAppointment(body.appointments ?? [])) return true;
      next = body.links?.next ?? null;
    }
    return false;
  } catch {
    return null;
  }
}

/* Splits this run's candidates into those who may be welcomed now and those
   who wait. Pure apart from the lookup, which the test replaces. */
export async function gateOnPaidBooking<C extends { email: string; name?: string; status: string; clinikoAppointmentsUrl?: string }>(
  candidates: C[],
  lookup: (url: string) => Promise<boolean | null>,
): Promise<{ ready: C[]; waiting: C[] }> {
  const ready: C[] = [];
  const waiting: C[] = [];
  for (const c of candidates) {
    if (!c.clinikoAppointmentsUrl) { ready.push(c); continue; }
    if (c.status !== 'active') { ready.push(c); continue; } // pickNewInvitees refuses them anyway
    (await lookup(c.clinikoAppointmentsUrl)) === true ? ready.push(c) : waiting.push(c);
  }
  return { ready, waiting };
}

export type WelcomeResult = {
  ok: boolean;
  sent: number;
  /** From Cliniko with no paid booking yet; waiting for one. */
  held: number;
  deferred: number;
  recentlyInvited: number;
  notActive: number;
  failures: string[];
  reason?: string;
};

export async function welcomeNewClients(
  added: { email: string; name: string; status: string; clinikoAppointmentsUrl?: string }[],
  opts: { dry?: boolean } = {}
): Promise<WelcomeResult> {
  const base: WelcomeResult = { ok: false, sent: 0, held: 0, deferred: 0, recentlyInvited: 0, notActive: 0, failures: [] };
  if (!welcomeEnabled()) return { ...base, ok: true, reason: 'NEW_CLIENT_INVITES=0, welcome emails are switched off' };

  /* This run's additions, plus everyone still waiting for a paid booking. */
  const pending = await readPending();
  const now = Date.now();
  const candidates: { email: string; name: string; status: string; clinikoAppointmentsUrl?: string }[] = [...added];
  const inRun = new Set(added.map((c) => c.email));
  for (const [email, w] of Object.entries(pending)) {
    if (inRun.has(email)) continue;
    candidates.push({ email, name: w.first, status: 'active', clinikoAppointmentsUrl: w.url });
  }
  if (!candidates.length) return { ...base, ok: true };
  if (!process.env.PORTAL_SECRET?.trim()) return { ...base, reason: 'PORTAL_SECRET is not set, cannot sign the link' };
  if (!mailConfigured() && !opts.dry) return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set, cannot send' };

  const { ready, waiting } = await gateOnPaidBooking(candidates, patientHasPaidBooking);

  /* Who waits after this run: still no paid booking, and not past the limit. */
  const nextPending: Pending = {};
  for (const c of waiting) {
    const since = pending[c.email]?.since ?? new Date(now).toISOString();
    if (now - Date.parse(since) > PENDING_MAX_MS) continue;
    nextPending[c.email] = { first: (c.name || '').trim().split(/\s+/)[0] || '', since, url: c.clinikoAppointmentsUrl as string };
  }

  const ledger = await read();
  const pick = pickNewInvitees(ready, ledger, now);
  const result: WelcomeResult = { ...base, ok: true, held: Object.keys(nextPending).length, deferred: pick.deferred, recentlyInvited: pick.recentlyInvited, notActive: pick.notActive };
  /* Ready but over the per-run cap: kept waiting so the next run sends it,
     rather than dropped because it is no longer "added this run". */
  const sending = new Set(pick.send);
  for (const c of ready) {
    if (sending.has(c.email) || !c.clinikoAppointmentsUrl || c.status !== 'active') continue;
    const last = ledger[c.email] ? Date.parse(ledger[c.email]) : 0;
    if (last) continue; // already invited: nothing more to wait for
    nextPending[c.email] = { first: (c.name || '').trim().split(/\s+/)[0] || '', since: pending[c.email]?.since ?? new Date(now).toISOString(), url: c.clinikoAppointmentsUrl };
  }

  const byEmail = new Map(candidates.map((c) => [c.email, c]));
  for (const email of pick.send) {
    if (opts.dry) { result.sent++; continue; }
    /* Belt and braces: a record added this run cannot have a password, but
       the check costs one read and makes the invariant explicit. */
    if (await hasPassword(email)) continue;
    const sent = await sendInviteEmail(email, byEmail.get(email)?.name, { welcome: true });
    if (sent.ok) {
      ledger[email] = new Date().toISOString();
      result.sent++;
    } else {
      result.failures.push(`${email}: ${sent.detail ?? 'send failed'}`);
      /* A failed send from Cliniko waits for the next run. */
      const c = byEmail.get(email);
      if (c?.clinikoAppointmentsUrl) nextPending[email] = { first: (c.name || '').trim().split(/\s+/)[0] || '', since: pending[email]?.since ?? new Date(now).toISOString(), url: c.clinikoAppointmentsUrl };
    }
  }
  if (!opts.dry && result.sent > 0) await write(ledger);
  if (!opts.dry && JSON.stringify(nextPending) !== JSON.stringify(pending)) await writePending(nextPending);
  return result;
}

export async function sendPortalInvites(opts: { dry?: boolean } = {}): Promise<InviteResult> {
  const limit = batchLimit();
  const base: InviteResult = {
    ok: false, sent: 0, alreadyHavePassword: 0, recentlyInvited: 0,
    deferred: 0, limit, failures: [],
  };

  if (limit === 0) {
    return { ...base, ok: true, reason: 'INVITE_BATCH_LIMIT=0, invites are switched off' };
  }

  const secret = process.env.PORTAL_SECRET?.trim();
  if (!secret) return { ...base, reason: 'PORTAL_SECRET is not set, cannot sign invite links' };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set, cannot send' };
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

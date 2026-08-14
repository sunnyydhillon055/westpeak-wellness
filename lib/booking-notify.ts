import { put, get } from '@vercel/blob';
import { api, headers } from '@/lib/cliniko';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { confirmationEmail, followUpEmail, consultFollowUpEmail, type Booking } from '@/lib/booking-mail';
import { site } from '@/lib/site';

/* Polls Cliniko for appointments needing a confirmation or a follow-up.
 *
 * Cliniko has no outbound webhook configured for this account, so the site
 * cannot be told when a booking happens -- it has to ask. That makes latency a
 * function of how often the cron runs, and on the Vercel Hobby plan a cron may
 * only run once a day.
 *
 * That constraint shaped the design rather than being worked around: Cliniko
 * already sends an instant confirmation, so ours is not the receipt and does
 * not need to be instant. It is the recognisable, from-our-own-domain message
 * carrying the links, and a day's delay costs nothing. The follow-up is
 * naturally a daily batch anyway.
 *
 * If the plan moves to Pro, raise the cron frequency in vercel.json and this
 * gets closer to real time with no code change.
 *
 * IDEMPOTENT. Every send is recorded against the appointment id before the next
 * one is attempted. A cron that runs twice, a retry after a timeout, or a
 * manual trigger must never produce a second email -- a duplicate confirmation
 * is a small annoyance, but a duplicate follow-up reads as automated and
 * careless, which is the opposite of the point.
 */

const KEY = 'portal/notified.json';
const TZ = 'America/Vancouver';

type Ledger = { confirmed: string[]; followedUp: string[]; updatedAt: string };
const EMPTY: Ledger = { confirmed: [], followedUp: [], updatedAt: '' };

async function readLedger(): Promise<Ledger> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const v = (await new Response(hit.stream).json()) as Ledger;
    return {
      confirmed: Array.isArray(v.confirmed) ? v.confirmed : [],
      followedUp: Array.isArray(v.followedUp) ? v.followedUp : [],
      updatedAt: v.updatedAt ?? '',
    };
  } catch {
    return EMPTY;
  }
}

async function writeLedger(l: Ledger): Promise<void> {
  /* Bounded. Without a cap this grows forever and eventually the read costs
   * more than the job. 2,000 ids is years of a solo practice, and anything
   * older than that is long past needing either email. */
  const trim = (a: string[]) => a.slice(-2000);
  await put(
    KEY,
    JSON.stringify({ confirmed: trim(l.confirmed), followedUp: trim(l.followedUp), updatedAt: new Date().toISOString() }, null, 2),
    { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0 }
  );
}

const fmt = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export type NotifyResult = {
  ok: boolean;
  confirmations: number;
  followUps: number;
  skipped: { noEmail: number; alreadySent: number };
  failures: string[];
  reason?: string;
};

export async function runBookingNotifications(opts: { dry?: boolean } = {}): Promise<NotifyResult> {
  const base: NotifyResult = {
    ok: false, confirmations: 0, followUps: 0,
    skipped: { noEmail: 0, alreadySent: 0 }, failures: [],
  };

  const conn = api();
  if (!conn) return { ...base, reason: 'CLINIKO_API_KEY is not set on this deployment' };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set — cannot send' };
  }

  const now = Date.now();
  /* Full UTC timestamps, not YYYY-MM-DD. Cliniko rejects a date-only bound
   * with 400 "Timestamp needs to be in UTC format." — which would have meant
   * the query always failed and no email ever sent, with nothing in the logs
   * to say why. */
  const from = new Date(now - 14 * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const to = new Date(now + 120 * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');

  let appts: any[] = [];
  try {
    const url =
      `https://api.${conn.shard}.cliniko.com/v1/appointments` +
      `?per_page=100&sort=starts_at:desc` +
      `&q[]=${encodeURIComponent(`starts_at:>=${from}`)}` +
      `&q[]=${encodeURIComponent(`starts_at:<=${to}`)}`;
    const res = await fetch(url, { headers: headers(conn.key), cache: 'no-store' });
    if (!res.ok) return { ...base, reason: `Cliniko HTTP ${res.status}` };
    appts = (await res.json()).appointments ?? [];
  } catch (e) {
    return { ...base, reason: e instanceof Error ? e.message : 'request failed' };
  }

  const ledger = await readLedger();
  const confirmed = new Set(ledger.confirmed);
  const followedUp = new Set(ledger.followedUp);

  const patientCache = new Map<string, { firstName: string; email: string } | null>();
  async function patient(url: string) {
    if (patientCache.has(url)) return patientCache.get(url)!;
    try {
      const res = await fetch(url, { headers: headers(conn!.key), cache: 'no-store' });
      if (!res.ok) { patientCache.set(url, null); return null; }
      const p = await res.json();
      const v = { firstName: String(p.first_name ?? '').trim() || 'there', email: String(p.email ?? '').trim() };
      patientCache.set(url, v);
      return v;
    } catch {
      patientCache.set(url, null);
      return null;
    }
  }

  const result = { ...base, ok: true };

  for (const ap of appts) {
    const id = String(ap.id);
    if (ap.cancelled_at || ap.archived_at || ap.did_not_arrive) continue;

    const startsAt = ap.starts_at as string | undefined;
    if (!startsAt) continue;
    const start = new Date(startsAt).getTime();

    const needsConfirm = start > now && !confirmed.has(id);
    /* Follow-up window: ended between 12 and 72 hours ago. The lower bound
     * stops a message landing the same evening; the upper bound stops a
     * backfill emailing months of history the first time this runs. */
    const ended = start + (Number(ap.duration_in_minutes ?? 50) * 60_000);
    const sinceEnd = now - ended;
    const needsFollowUp = sinceEnd > 12 * 3.6e6 && sinceEnd < 72 * 3.6e6 && !followedUp.has(id);

    if (!needsConfirm && !needsFollowUp) {
      if (confirmed.has(id) || followedUp.has(id)) result.skipped.alreadySent++;
      continue;
    }

    const purl = ap.patient?.links?.self;
    if (!purl) continue;
    const pt = await patient(purl);
    if (!pt || !pt.email) { result.skipped.noEmail++; continue; }

    const booking: Booking = {
      firstName: pt.firstName,
      email: pt.email,
      whenText: fmt(startsAt),
      minutes: Number(ap.duration_in_minutes ?? 50),
      isConsult: Number(ap.duration_in_minutes ?? 50) <= 20,
    };

    if (needsConfirm) {
      const mail = confirmationEmail(booking);
      if (opts.dry) { result.confirmations++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo: site.email });
        if (sent.ok) { confirmed.add(id); result.confirmations++; }
        else result.failures.push(`confirm ${id}: ${sent.detail ?? 'failed'}`);
      }
    }

    if (needsFollowUp) {
      /* The consultation gets its own message. A free 15-minute call that ends
       * with nothing happening is the single largest leak in the funnel — the
       * person has already spoken to the practice and is deciding — and the
       * ordinary follow-up says "book your NEXT session", which is wrong for
       * someone who has not had a first one. See consultFollowUpEmail. */
      const mail = booking.isConsult ? consultFollowUpEmail(booking) : followUpEmail(booking);
      if (opts.dry) { result.followUps++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo: site.email });
        if (sent.ok) { followedUp.add(id); result.followUps++; }
        else result.failures.push(`followup ${id}: ${sent.detail ?? 'failed'}`);
      }
    }
  }

  if (!opts.dry && (result.confirmations > 0 || result.followUps > 0)) {
    await writeLedger({ confirmed: [...confirmed], followedUp: [...followedUp], updatedAt: '' });
  }

  return result;
}

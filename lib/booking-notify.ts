import { put, get } from '@vercel/blob';
import { api, headers } from '@/lib/cliniko';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { confirmationEmail, reminderEmail, followUpEmail, consultFollowUpEmail, type Booking } from '@/lib/booking-mail';
import { missedSessionEmail } from '@/lib/lifecycle-mail';
import { missedAlreadyNoted, recordMissed } from '@/lib/lifecycle';
import { site, CONSULT_TYPE } from '@/lib/site';
/* Pure mapping, kept in its own module so a gate can exercise it without a
 * Cliniko key or a mail server. See the header there. */
import { durationOf, isConsultAppointment } from '@/lib/booking-shape';
import { practitioners } from '@/lib/practitioners';
import { FALLBACK_CATALOG, money } from '@/lib/cliniko-catalog';
import { shell, p, esc } from '@/lib/booking-mail';

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

/* `reminded` added 3 Sep 2026. A confirmation went out at booking and a
   follow-up the day after the session, and between them there was nothing — so
   a free consultation booked a week ahead had no reminder at all. That is an
   easy no-show, and on a calendar with three evening hours a week a no-show on
   a free consult costs a third of the week's out-of-hours capacity. */
/* `alerted` and `cancelAlerted` added 28 Sep 2026. Every email this job sent
   went to the client; the practice learned of a booking only if Cliniko's own
   notification was switched on for that user, and of a cancellation only by
   looking. The owner missed a consultation booked and cancelled with another
   counsellor entirely. Each appointment id the practice has been told about
   is recorded here, once for the booking and once for the cancellation. */
type Ledger = { confirmed: string[]; followedUp: string[]; reminded: string[]; alerted: string[]; cancelAlerted: string[]; updatedAt: string };
const EMPTY: Ledger = { confirmed: [], followedUp: [], reminded: [], alerted: [], cancelAlerted: [], updatedAt: '' };

async function readLedger(): Promise<Ledger> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const hit = await get(KEY, { access: 'private', useCache: false });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const v = (await new Response(hit.stream).json()) as Ledger;
    return {
      confirmed: Array.isArray(v.confirmed) ? v.confirmed : [],
      followedUp: Array.isArray(v.followedUp) ? v.followedUp : [],
      alerted: Array.isArray(v.alerted) ? v.alerted : [],
      cancelAlerted: Array.isArray(v.cancelAlerted) ? v.cancelAlerted : [],
      /* Absent in ledgers written before 3 Sep. Defaulting to empty means the
         first run after deploy reminds only appointments still inside the
         window ahead, never a backfill of past ones. */
      reminded: Array.isArray(v.reminded) ? v.reminded : [],
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
    JSON.stringify({ confirmed: trim(l.confirmed), followedUp: trim(l.followedUp), reminded: trim(l.reminded), alerted: trim(l.alerted), cancelAlerted: trim(l.cancelAlerted), updatedAt: new Date().toISOString() }, null, 2),
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
  reminders: number;
  followUps: number;
  /** Gentle notes after a no-show. Never mentions the fee — see the loop. */
  missed: number;
  /** Alerts to the practice: new online bookings, and cancellations. */
  alerts: number;
  cancellations: number;
  skipped: { noEmail: number; alreadySent: number };
  failures: string[];
  reason?: string;
};

export async function runBookingNotifications(opts: { dry?: boolean } = {}): Promise<NotifyResult> {
  const base: NotifyResult = {
    ok: false, confirmations: 0, reminders: 0, followUps: 0, missed: 0, alerts: 0, cancellations: 0,
    skipped: { noEmail: 0, alreadySent: 0 }, failures: [],
  };

  const conn = api();
  if (!conn) return { ...base, reason: 'CLINIKO_API_KEY is not set on this deployment' };
  if (!mailConfigured() && !opts.dry) {
    return { ...base, reason: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set, cannot send' };
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
  const reminded = new Set(ledger.reminded);

  const patientCache = new Map<string, { firstName: string; lastName: string; email: string } | null>();
  async function patient(url: string) {
    if (patientCache.has(url)) return patientCache.get(url)!;
    try {
      const res = await fetch(url, { headers: headers(conn!.key), cache: 'no-store' });
      if (!res.ok) { patientCache.set(url, null); return null; }
      const p = await res.json();
      const v = { firstName: String(p.first_name ?? '').trim() || 'there', lastName: String(p.last_name ?? '').trim(), email: String(p.email ?? '').trim() };
      patientCache.set(url, v);
      return v;
    } catch {
      patientCache.set(url, null);
      return null;
    }
  }

  const result = { ...base, ok: true };
  const alerted = new Set(ledger.alerted);
  const cancelAlerted = new Set(ledger.cancelAlerted);

  /* THE PRACTICE IS TOLD — 28 Sep 2026.
   *
   * Which counsellor the appointment is with, from the practitioner link on
   * the appointment and the Cliniko id on the roster. The alert goes to the
   * practice inbox and, when the roster knows one, to that counsellor's own
   * alert address, so the person whose calendar it is and the person who runs
   * the practice both hear of it in the same message. */
  const idFrom = (link?: string) => (link ? link.split('/').filter(Boolean).pop() ?? '' : '');
  const practitionerFor = (ap: any) => {
    const pid = idFrom(ap.practitioner?.links?.self);
    return practitioners.find((x) => x.clinikoPractitionerId === pid);
  };
  const typeFor = (ap: any) => {
    const tid = idFrom(ap.appointment_type?.links?.self);
    const item = FALLBACK_CATALOG.items.find((i) => i.id === tid);
    if (isConsultAppointment(ap, CONSULT_TYPE)) return { label: 'Free 30-minute consultation', paid: false };
    return item ? { label: `${item.name}, ${item.minutes} min, ${money(item.cents)}`, paid: item.cents > 0 } : { label: 'Session', paid: true };
  };
  const recipients = (ap: any) => {
    const pr = practitionerFor(ap);
    return [...new Set([site.email, ...(pr?.alertEmail ? [pr.alertEmail] : [])])];
  };
  /* Subject and preheader carry no name, as the enquiry alerts do not: an
     inbox is read on a phone in public. The name is inside. */
  const practiceAlert = (kind: 'booked' | 'cancelled', ap: any, who: { firstName: string; lastName: string; email: string }) => {
    const pr = practitionerFor(ap);
    const t = typeFor(ap);
    const when = fmt(ap.starts_at);
    const subject = kind === 'booked'
      ? `New online booking: ${t.label.split(',')[0]}, ${when.replace(/^(\w+), /, '$1 ')}`
      : `Cancelled: ${t.label.split(',')[0]}, ${when.replace(/^(\w+), /, '$1 ')}`;
    const rows: [string, string][] = [
      ['Client', `${who.firstName} ${who.lastName}`.trim()],
      ['Email', who.email || '(none on file)'],
      ['Appointment', t.label],
      ['When', when],
      ['With', pr ? pr.name : '(not on the roster)'],
      ...(kind === 'booked' ? [['Payment', t.paid ? 'Paid type: the card is taken by Cliniko at booking' : 'Free, nothing charged'] as [string, string]] : []),
      ...(kind === 'booked' && ap.created_at ? [['Booked at', fmt(ap.created_at)] as [string, string]] : []),
      ...(kind === 'cancelled' && ap.cancelled_at ? [['Cancelled at', fmt(ap.cancelled_at)] as [string, string]] : []),
      ...(kind === 'cancelled' && ap.cancellation_note ? [['Note', String(ap.cancellation_note)] as [string, string]] : []),
    ];
    const text = [kind === 'booked' ? 'New online booking' : 'Appointment cancelled', '', ...rows.map(([k, v]) => `${k.padEnd(12)} ${v}`), '', 'The full record is in Cliniko. This is a notice, not a receipt.'].join('\n');
    const html = shell(
      kind === 'booked' ? 'New online booking' : 'Appointment cancelled',
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">${rows.map(([k, v]) => `<tr><td style="color:#545e69;padding-right:14px;">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>` +
      p('<span style="color:#545e69;font-size:14px;">The full record is in Cliniko. This is a notice, not a receipt.</span>'),
      `${t.label.split(',')[0]}, ${when}`,
    );
    return { subject, text, html };
  };
  const RECENT = 3 * 864e5;

  for (const ap of appts) {
    const id = String(ap.id);

    /* A cancellation the practice has not been told about, within the last
       three days. Older ones are recorded without a message, so the first run
       after this ships does not announce a fortnight of history. */
    if (ap.cancelled_at && !cancelAlerted.has(id)) {
      const recent = now - Date.parse(ap.cancelled_at) < RECENT;
      const purl = ap.patient?.links?.self;
      const who = recent && purl ? await patient(purl) : null;
      if (recent && who) {
        const mail = practiceAlert('cancelled', ap, who);
        if (opts.dry) result.cancellations++;
        else {
          const sent = await sendDetailed(recipients(ap), mail.subject, mail.text, mail.html, { replyTo: site.email });
          if (sent.ok) { cancelAlerted.add(id); result.cancellations++; }
          else result.failures.push(`cancel-alert ${id}: ${sent.detail ?? 'failed'}`);
        }
      } else cancelAlerted.add(id);
    }
    if (ap.cancelled_at || ap.archived_at) continue;

    /* A booking the practice has not been told about, made within the last
       three days. Same backfill rule: older bookings are recorded silently. */
    if (!alerted.has(id)) {
      const createdAt = ap.created_at ? Date.parse(ap.created_at) : NaN;
      const recent = Number.isFinite(createdAt) && now - createdAt < RECENT;
      const purl = ap.patient?.links?.self;
      const who = recent && purl ? await patient(purl) : null;
      if (recent && who) {
        const mail = practiceAlert('booked', ap, who);
        if (opts.dry) result.alerts++;
        else {
          const sent = await sendDetailed(recipients(ap), mail.subject, mail.text, mail.html, { replyTo: site.email });
          if (sent.ok) { alerted.add(id); result.alerts++; }
          else result.failures.push(`alert ${id}: ${sent.detail ?? 'failed'}`);
        }
      } else alerted.add(id);
    }

    /* A missed session used to be skipped outright, along with cancellations
     * and archives. It does not belong in that group: somebody who did not
     * attend is the person most likely to drop out altogether, and silence
     * after a no-show reads as disapproval whether or not any is meant.
     *
     * The note carries NOTHING ABOUT THE FEE. Whether to charge is a judgement
     * about a person in a clinical relationship — they may have been unwell, in
     * crisis, or avoiding the exact thing they came to work on — and a cron job
     * must not make that call or pre-empt it by raising the subject first. The
     * practice sees the missed appointment in Cliniko and decides. */
    if (ap.did_not_arrive) {
      /* durationOf(), not the raw field. This line kept the original
         `duration_in_minutes ?? 50` after the confirmation path was fixed on
         30 Aug 2026 — the field is never returned by /v1/appointments, so it
         always evaluated to 50. For a 30-minute consult that put the no-show
         window 35 minutes late, which shifts who falls inside the 12–72 hour
         band near its edges. Nothing a client reads, but the same dead field
         and worth removing rather than leaving one copy behind. */
      const ended0 = new Date(ap.starts_at as string).getTime() + ((durationOf(ap) ?? 50) * 60_000);
      const since = now - ended0;
      if (since > 12 * 3.6e6 && since < 72 * 3.6e6 && !(await missedAlreadyNoted(id))) {
        const purl0 = ap.patient?.links?.self;
        if (purl0) {
          const pt0 = await patient(purl0);
          if (pt0 && pt0.email) {
            const mail = missedSessionEmail(pt0.firstName);
            if (opts.dry) result.missed++;
            else {
              const sent = await sendDetailed(pt0.email, mail.subject, mail.text, mail.html, { replyTo: site.email });
              if (sent.ok) { await recordMissed(id); result.missed++; }
              else result.failures.push(`missed ${id}: ${sent.detail ?? 'failed'}`);
            }
          } else result.skipped.noEmail++;
        }
      }
      continue;
    }

    const startsAt = ap.starts_at as string | undefined;
    if (!startsAt) continue;
    const start = new Date(startsAt).getTime();

    const needsConfirm = start > now && !confirmed.has(id);

    /* REMINDER, 18 to 30 hours ahead.
     *
     * The cron runs every two hours, so a twelve-hour window is hit six times
     * and the ledger stops the other five sending anything. The lower bound is
     * deliberately not two hours: a reminder that arrives the same evening is
     * too late to rearrange around, and rearranging is the point — a slot
     * released a day ahead can be taken by somebody else, and a no-show cannot.
     *
     * Applies to consultations as much as to sessions. A free appointment is
     * the easiest one to forget, and on this calendar it costs an hour that
     * cannot be resold. */
    const untilStart = start - now;
    const inReminderWindow = untilStart > 18 * 3.6e6 && untilStart < 30 * 3.6e6;

    /* NOT IN THE SAME RUN AS THE CONFIRMATION.
     *
     * Somebody booking 18 to 30 hours ahead trips both conditions on the very
     * next cron run: never confirmed, and inside the reminder window. Without
     * this they would receive a confirmation and a "your appointment is
     * tomorrow" minutes apart — which reads as automated and careless, the
     * exact failure the header of this file warns about for duplicates.
     *
     * When both are true the confirmation IS the reminder: it states the same
     * time and offers the same reply-to-move. So the reminder is marked sent
     * without being sent, which also stops one arriving on the next run. */
    const needsReminder = inReminderWindow && !needsConfirm && !reminded.has(id);
    if (inReminderWindow && needsConfirm) reminded.add(id);
    /* Follow-up window: ended between 12 and 72 hours ago. The lower bound
     * stops a message landing the same evening; the upper bound stops a
     * backfill emailing months of history the first time this runs. */
    /* Falls back to 50 only for deciding WHEN a session ended, which shifts a
       follow-up window by a few minutes at worst. Never used for anything the
       client is told — see durationOf(). */
    const ended = start + ((durationOf(ap) ?? 50) * 60_000);
    const sinceEnd = now - ended;
    const needsFollowUp = sinceEnd > 12 * 3.6e6 && sinceEnd < 72 * 3.6e6 && !followedUp.has(id);

    if (!needsConfirm && !needsReminder && !needsFollowUp) {
      if (confirmed.has(id) || reminded.has(id) || followedUp.has(id)) result.skipped.alreadySent++;
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
      minutes: durationOf(ap),
      isConsult: isConsultAppointment(ap, CONSULT_TYPE),
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

    if (needsReminder) {
      const mail = reminderEmail(booking);
      if (opts.dry) { result.reminders++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo: site.email });
        if (sent.ok) { reminded.add(id); result.reminders++; }
        else result.failures.push(`reminder ${id}: ${sent.detail ?? 'failed'}`);
      }
    }

    if (needsFollowUp) {
      /* The consultation gets its own message. A free 30-minute call that ends
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

  /* Written whenever anything changed, including the silent backfill of the
     two alert lists, which must persist or the next run repeats the scan. */
  const ledgerChanged = result.confirmations > 0 || result.reminders > 0 || result.followUps > 0
    || alerted.size !== ledger.alerted.length || cancelAlerted.size !== ledger.cancelAlerted.length;
  if (!opts.dry && ledgerChanged) {
    await writeLedger({ confirmed: [...confirmed], followedUp: [...followedUp], reminded: [...reminded], alerted: [...alerted], cancelAlerted: [...cancelAlerted], updatedAt: '' });
  }

  return result;
}

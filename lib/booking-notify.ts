import { put, get } from '@vercel/blob';
import { api, headers } from '@/lib/cliniko';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { confirmationEmail, reminderEmail, followUpEmail, consultFollowUpEmail, type Booking, type BookingPractitioner } from '@/lib/booking-mail';
import { missedSessionEmail } from '@/lib/lifecycle-mail';
import { missedAlreadyNoted, recordMissed } from '@/lib/lifecycle';
import { site, CONSULT_TYPE, bookingsPaidUrlFor } from '@/lib/site';
/* Pure mapping, kept in its own module so a gate can exercise it without a
 * Cliniko key or a mail server. See the header there. */
import { durationOf, isConsultAppointment } from '@/lib/booking-shape';
import { practitioners, withLetters, type Practitioner } from '@/lib/practitioners';
import { FALLBACK_CATALOG, money } from '@/lib/cliniko-catalog';
import { shell, p, esc } from '@/lib/booking-mail';
import { mailtoBookingDraft } from '@/lib/reply-templates';
import { tallyEvents, addToBookingTally } from '@/lib/booking-tally';
import {
  telehealthUrlOf, unconvertedConsults, idFromLink, consultReplyTo,
  lapsedPaidClients, lapsedKey, paidFollowUpPlan, nextAfter, typeIdOf,
} from '@/lib/booking-followups';

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
/* `unconvertedAlerted` and `tallied` added 1 Oct 2026.
     unconvertedAlerted  Cliniko PATIENT ids the practice has been told had a
                         consultation and booked nothing after it. Patient,
                         not appointment, so nobody is the subject of that
                         notice twice whatever they book later.
     tallied             event keys ("b:<appointment id>", "c:", "h:", "d:")
                         already counted into analytics/booking-tally.json.
                         See lib/booking-tally.ts. */
/* `lapsedAlerted` and `followUpSkipped` added 1 Oct 2026.
     lapsedAlerted    "<patient id>:<appointment id>" for each paid client the
                      practice has been told has nothing booked after that
                      session. Patient and session, so the same gap is never
                      noticed twice. See lapsedPaidClients().
     followUpSkipped  paid appointment ids whose after-session note was NOT
                      sent because it was not the first with that counsellor
                      and the next one was already booked. Recorded so the
                      decision is made once and can be read back. */
type Ledger = {
  confirmed: string[]; followedUp: string[]; reminded: string[]; alerted: string[]; cancelAlerted: string[];
  unconvertedAlerted: string[]; tallied: string[]; lapsedAlerted: string[]; followUpSkipped: string[]; updatedAt: string;
  /** Not stored. True when the ledger exists but could not be read. */
  readFailed?: boolean;
};
const EMPTY: Ledger = { confirmed: [], followedUp: [], reminded: [], alerted: [], cancelAlerted: [], unconvertedAlerted: [], tallied: [], lapsedAlerted: [], followUpSkipped: [], updatedAt: '' };

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
      unconvertedAlerted: Array.isArray(v.unconvertedAlerted) ? v.unconvertedAlerted : [],
      tallied: Array.isArray(v.tallied) ? v.tallied : [],
      lapsedAlerted: Array.isArray(v.lapsedAlerted) ? v.lapsedAlerted : [],
      followUpSkipped: Array.isArray(v.followUpSkipped) ? v.followUpSkipped : [],
      updatedAt: v.updatedAt ?? '',
    };
  } catch {
    /* Flagged, so the tally is not re-counted from an empty ledger. The email
       sets behave as they always have. */
    return { ...EMPTY, readFailed: true };
  }
}

async function writeLedger(l: Ledger): Promise<void> {
  /* Bounded. Without a cap this grows forever and eventually the read costs
   * more than the job. 2,000 ids is years of a solo practice, and anything
   * older than that is long past needing either email. */
  const trim = (a: string[], n = 2000) => a.slice(-n);
  await put(
    KEY,
    /* `tallied` holds up to three keys per appointment, so its cap is higher:
       6,000 is far more than the 136-day window ever holds, which is what
       matters, since a key trimmed while its appointment is still in the
       window would be counted again. */
    JSON.stringify({ confirmed: trim(l.confirmed), followedUp: trim(l.followedUp), reminded: trim(l.reminded), alerted: trim(l.alerted), cancelAlerted: trim(l.cancelAlerted), unconvertedAlerted: trim(l.unconvertedAlerted), tallied: trim(l.tallied, 6000), lapsedAlerted: trim(l.lapsedAlerted), followUpSkipped: trim(l.followUpSkipped), updatedAt: new Date().toISOString() }, null, 2),
    { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0 }
  );
}

/* "Tuesday, October 6": the day a client would say, for a draft. */
const fmtDay = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/* The few roster fields a template needs, so lib/booking-mail.ts never
   imports the roster. */
const bookingPractitioner = (pr?: Practitioner): BookingPractitioner | null =>
  pr
    ? {
        slug: pr.slug,
        nameWithLetters: withLetters(pr),
        firstName: pr.name.split(/\s+/)[0],
        languages: pr.languages.map(({ tag, name }) => ({ tag, name })),
        clinikoPractitionerId: pr.clinikoPractitionerId,
      }
    : null;

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
  /** Notices to the practice: a consultation 10-14 days past its follow-up,
      with no session booked. Nothing goes to the client. */
  unconverted: number;
  /** Dry runs only: the consultation appointment ids that would be noticed. */
  unconvertedCandidates?: string[];
  /** Events added to analytics/booking-tally.json this run. */
  tallied: number;
  /** Notices to the practice: a paid client 14-18 days past their last
      session with nothing booked. Nothing goes to the client. */
  lapsed: number;
  /** Dry runs only: the last-session appointment ids that would be noticed. */
  lapsedCandidates?: string[];
  /** repeatFollowUp: paid after-session notes not sent because the next
      session was already booked and it was not the first with her. */
  skipped: { noEmail: number; alreadySent: number; repeatFollowUp: number };
  failures: string[];
  reason?: string;
};

const REBOOK_HINT = 'Send it a day later, not the same hour, and not if they have already rebooked.';

/* Which counsellor an appointment is with: the practitioner link on the
   appointment against the Cliniko id on the roster. */
const practitionerOf = (ap: any): Practitioner | undefined => {
  const pid = idFromLink(ap?.practitioner?.links?.self);
  return pid ? practitioners.find((x) => x.clinikoPractitionerId === pid) : undefined;
};

/* Her own paid calendar can be linked only when she is on it. */
const onCalendar = (pr?: Practitioner): pr is Practitioner & { clinikoPractitionerId: string } =>
  Boolean(pr && pr.bookable && pr.clinikoPractitionerId);

/* The few fields lib/lifecycle-mail.ts needs about her. */
const mailCounsellor = (pr?: Practitioner) =>
  pr ? { firstName: pr.name.split(/\s+/)[0], clinikoPractitionerId: pr.clinikoPractitionerId, bookable: pr.bookable, alertEmail: pr.alertEmail } : null;

/* The draft in a cancellation alert, or null. Exported for the test.
 *
 * A cancelled CONSULTATION: draft 2, her FREE calendar, by ?with=.
 *
 * A cancelled PAID SESSION, since 1 Oct 2026: the 'reschedule-session' draft,
 * her PAID calendar for the same appointment type, signed by her. Only when
 * nothing has been booked since the cancellation (in `appts`, the list the
 * job already read) and she is on the online calendar. It says nothing about
 * the fee or the late-cancellation terms. Before this, a paid cancellation got
 * no draft at all, and a cancelled paid session is the commonest point at
 * which a weekly client quietly stops.
 *
 * Null with no address to write to. */
export function cancellationDraft(ap: any, who: { firstName: string; email: string }, appts: any[] = []): string | null {
  if (!who.email) return null;
  const pr = practitionerOf(ap);
  if (!isConsultAppointment(ap, CONSULT_TYPE)) {
    if (!onCalendar(pr)) return null;
    const since = Date.parse(ap.cancelled_at ?? '');
    if (nextAfter(appts, ap, Number.isFinite(since) ? since : undefined)) return null;
    return mailtoBookingDraft(who.email, 'reschedule-session', {
      firstName: who.firstName,
      day: fmtDay(ap.starts_at),
      link: bookingsPaidUrlFor(pr.clinikoPractitionerId, typeIdOf(ap)),
      signer: pr.name,
    });
  }
  return mailtoBookingDraft(who.email, 'rebook-consult', {
    firstName: who.firstName,
    day: fmtDay(ap.starts_at),
    link: `${site.domain}${site.bookingPath}${pr ? `?with=${pr.slug}` : ''}#calendar`,
    signer: pr?.name,
  });
}

/* After a paid session with nothing booked since: her paid calendar, same type. */
function lapsedDraftFor(ap: any, who: { firstName: string; email: string }, pr: Practitioner & { clinikoPractitionerId: string }): string {
  return mailtoBookingDraft(who.email, 'after-session', {
    firstName: who.firstName,
    day: fmtDay(ap.starts_at),
    link: bookingsPaidUrlFor(pr.clinikoPractitionerId, typeIdOf(ap)),
    signer: pr.name,
  });
}

/* Draft 3, for a consultation with no session after it: her PAID calendar. */
function unconvertedDraftFor(ap: any, who: { firstName: string; email: string }, pr: Practitioner): string {
  return mailtoBookingDraft(who.email, 'after-consult', {
    firstName: who.firstName,
    day: fmtDay(ap.starts_at),
    link: bookingsPaidUrlFor(pr.clinikoPractitionerId),
    signer: pr.name,
  });
}

export async function runBookingNotifications(opts: { dry?: boolean } = {}): Promise<NotifyResult> {
  const base: NotifyResult = {
    ok: false, confirmations: 0, reminders: 0, followUps: 0, missed: 0, alerts: 0, cancellations: 0, unconverted: 0, tallied: 0, lapsed: 0,
    skipped: { noEmail: 0, alreadySent: 0, repeatFollowUp: 0 }, failures: [],
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
  /* 16 days back, not 14, since 1 Oct 2026: the unconverted-consultation
     notice looks at consultations that ended 11 to 15 days ago. Every other
     window here is three days or less, so reading further back sends nothing
     extra. */
  /* 20 days, later the same day: the paid-lapse notice looks at sessions that
     ended 14 to 18 days ago, and needs a little either side of that to see
     whether a later one exists. The client-facing windows are unchanged. */
  const from = new Date(now - 20 * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const to = new Date(now + 120 * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');

  /* EVERY PAGE, since 1 Oct 2026. This read one page of 100, newest first,
     so once the window held more than 100 appointments the oldest ones (the
     ones just past, which are owed a follow-up) silently fell off the end.
     links.next is followed until Cliniko stops giving one; bounded, so a
     pagination fault on either side cannot spin until the timeout. */
  let appts: any[] = [];
  try {
    let url: string | null =
      `https://api.${conn.shard}.cliniko.com/v1/appointments` +
      `?per_page=100&sort=starts_at:desc` +
      `&q[]=${encodeURIComponent(`starts_at:>=${from}`)}` +
      `&q[]=${encodeURIComponent(`starts_at:<=${to}`)}`;
    const seen = new Set<string>();
    for (let page = 0; page < 20 && url; page++) {
      const res: Response = await fetch(url, { headers: headers(conn.key), cache: 'no-store' });
      if (!res.ok) return { ...base, reason: `Cliniko HTTP ${res.status}` };
      const body = (await res.json()) as { appointments?: any[]; links?: { next?: string } };
      for (const ap of body.appointments ?? []) {
        const k = String(ap.id);
        if (!seen.has(k)) { seen.add(k); appts.push(ap); }
      }
      url = body.links?.next ?? null;
    }
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
  const practitionerFor = practitionerOf;
  const typeFor = (ap: any) => {
    const tid = idFromLink(ap.appointment_type?.links?.self);
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
    /* A CANCELLED CONSULTATION carries a rebook draft, 1 Oct 2026: draft 2 of
       the client follow-ups, now in lib/reply-templates.ts, with the first
       name, the day and her free calendar filled in, as a mailto: for a
       person to read, edit and send. Nothing is sent to the client from
       here. Paid cancellations get none. */
    const rebook = kind === 'cancelled' ? cancellationDraft(ap, who, appts) : null;
    const draftLabel = isConsultAppointment(ap, CONSULT_TYPE) ? 'Draft a rebook note' : 'Draft a reschedule note';
    const text = [kind === 'booked' ? 'New online booking' : 'Appointment cancelled', '', ...rows.map(([k, v]) => `${k.padEnd(12)} ${v}`), '',
      ...(rebook ? [`${draftLabel}. ${REBOOK_HINT}`, rebook, ''] : []),
      'The full record is in Cliniko. This is a notice, not a receipt.'].join('\n');
    const html = shell(
      kind === 'booked' ? 'New online booking' : 'Appointment cancelled',
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">${rows.map(([k, v]) => `<tr><td style="color:#545e69;padding-right:14px;">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>` +
      (rebook ? p(`<a href="${esc(rebook)}" style="color:#3d6c92;font-weight:600;">${esc(draftLabel)}</a><br><span style="color:#545e69;font-size:14px;">${esc(REBOOK_HINT)}</span>`) : '') +
      p('<span style="color:#545e69;font-size:14px;">The full record is in Cliniko. This is a notice, not a receipt.</span>'),
      `${t.label.split(',')[0]}, ${when}`,
    );
    return { subject, text, html };
  };
  const RECENT = 3 * 864e5;

  /* The notice for a consultation that did not become a session. Practice
     and counsellor only. Subject and preheader carry no name. */
  const unconvertedNotice = (ap: any, who: { firstName: string; lastName: string; email: string }) => {
    const pr = practitionerFor(ap);
    const when = fmt(ap.starts_at);
    const draft = who.email && pr?.acceptingNewClients ? unconvertedDraftFor(ap, who, pr) : null;
    const rows: [string, string][] = [
      ['Client', `${who.firstName} ${who.lastName}`.trim()],
      ['Email', who.email || '(none on file)'],
      ['Consultation', when],
      ['With', pr ? pr.name : '(not on the roster)'],
    ];
    const lead = 'A free consultation about two weeks ago, the day-after note went out, and no session has been booked since.';
    const how = draft
      ? 'If a note would be welcome, the draft below is draft 3 with her paid calendar filled in. Read it, change what needs changing, and send it from your own mailbox, or leave it. Nothing has been sent to the client and nothing will be.'
      : pr && !pr.acceptingNewClients
        ? 'This counsellor is not taking new clients, so the after-consultation note is not the right one. The "full" reply is the honest one, if anything is sent.'
        : 'Nothing has been sent to the client and nothing will be.';
    const subject = `No session booked after a consultation, ${fmtDay(ap.starts_at)}`;
    const text = [lead, '', ...rows.map(([k, v]) => `${k.padEnd(13)} ${v}`), '', how, ...(draft ? ['', 'Draft the after-consultation note:', draft] : []), '', 'This notice is sent once per client.'].join('\n');
    const html = shell(
      'No session booked after a consultation',
      p(esc(lead)) +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">${rows.map(([k, v]) => `<tr><td style="color:#545e69;padding-right:14px;">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>` +
      p(esc(how)) +
      (draft ? p(`<a href="${esc(draft)}" style="color:#3d6c92;font-weight:600;">Draft the after-consultation note</a>`) : '') +
      p('<span style="color:#545e69;font-size:14px;">This notice is sent once per client.</span>'),
      'A consultation with no session booked since',
    );
    return { subject, text, html };
  };

  /* The notice for a paid client with nothing booked two weeks after their
     last session. Practice and counsellor only; no name in the subject. */
  const lapsedNotice = (ap: any, who: { firstName: string; lastName: string; email: string }) => {
    const pr = practitionerFor(ap);
    const t = typeFor(ap);
    const draft = who.email && onCalendar(pr) ? lapsedDraftFor(ap, who, pr) : null;
    const rows: [string, string][] = [
      ['Client', `${who.firstName} ${who.lastName}`.trim()],
      ['Email', who.email || '(none on file)'],
      ['Last session', fmt(ap.starts_at)],
      ['Appointment', t.label.split(',')[0]],
      ['With', pr ? pr.name : '(not on the roster)'],
    ];
    const lead = 'A paid session about two weeks ago, and nothing has been booked since.';
    const how = draft
      ? 'If a note would be welcome, the draft below has her paid calendar for the same appointment type filled in. Read it, change what needs changing, and send it from your own mailbox, or leave it: a break, or finishing, is for the client to decide. Nothing has been sent to the client and nothing will be.'
      : pr && !onCalendar(pr)
        ? 'This counsellor is not on the online calendar, so no booking link is drafted. If anything is sent, it is a personal note. Nothing has been sent to the client and nothing will be.'
        : 'Nothing has been sent to the client and nothing will be.';
    const subject = `No next session booked, last seen ${fmtDay(ap.starts_at)}`;
    const text = [lead, '', ...rows.map(([k, v]) => `${k.padEnd(13)} ${v}`), '', how, ...(draft ? ['', 'Draft the after-session note:', draft] : []), '', 'This notice is sent once for each gap.'].join('\n');
    const html = shell(
      'No next session booked',
      p(esc(lead)) +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-size:14px;line-height:1.7;">${rows.map(([k, v]) => `<tr><td style="color:#545e69;padding-right:14px;">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table>` +
      p(esc(how)) +
      (draft ? p(`<a href="${esc(draft)}" style="color:#3d6c92;font-weight:600;">Draft the after-session note</a>`) : '') +
      p('<span style="color:#545e69;font-size:14px;">This notice is sent once for each gap.</span>'),
      'A paid client with nothing booked since',
    );
    return { subject, text, html };
  };

  const lapsedAlerted = new Set(ledger.lapsedAlerted);
  const followUpSkipped = new Set(ledger.followUpSkipped);
  const isConsult = (ap: any) => isConsultAppointment(ap, CONSULT_TYPE);

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
            /* A missed free consultation gets the note that rebooks the free
               consultation, with the same counsellor; see lifecycle-mail. */
            const pr0 = practitionerFor(ap);
            const consult0 = isConsultAppointment(ap, CONSULT_TYPE);
            const mail = missedSessionEmail(pt0.firstName, {
              isConsult: consult0,
              practitionerSlug: pr0?.slug,
              counsellor: mailCounsellor(pr0),
              typeId: typeIdOf(ap),
            });
            if (opts.dry) result.missed++;
            else {
              /* A missed paid session is signed by her, so a reply reaches
                 her and info@ (1 Oct 2026). */
              const sent = await sendDetailed(pt0.email, mail.subject, mail.text, mail.html, { replyTo: consult0 ? site.email : consultReplyTo(pr0) });
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
    let needsFollowUp = sinceEnd > 12 * 3.6e6 && sinceEnd < 72 * 3.6e6 && !followedUp.has(id) && !followUpSkipped.has(id);
    /* The paid after-session note goes after the first paid session with her,
       or when nothing is booked after this one; otherwise it is recorded as
       skipped, once. See paidFollowUpPlan(). */
    const plan = needsFollowUp && !isConsult(ap) ? paidFollowUpPlan(ap, appts, { isConsult }) : null;
    if (plan && !plan.send) {
      needsFollowUp = false;
      followUpSkipped.add(id);
      result.skipped.repeatFollowUp++;
    }

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
      practitioner: bookingPractitioner(practitionerFor(ap)),
      telehealthUrl: telehealthUrlOf(ap),
      typeId: typeIdOf(ap),
      next: plan?.next
        ? { whenText: fmt(plan.next.starts_at), withName: bookingPractitioner(practitionerFor(plan.next))?.nameWithLetters }
        : null,
    };
    /* Replies reach the counsellor whose appointment it is, and info@, since
       1 Oct 2026: Cliniko clients can only move an appointment by replying,
       and the reply belongs with her. */
    const herReplyTo = consultReplyTo(practitionerFor(ap));

    if (needsConfirm) {
      const mail = confirmationEmail(booking);
      if (opts.dry) { result.confirmations++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo: herReplyTo });
        if (sent.ok) { confirmed.add(id); result.confirmations++; }
        else result.failures.push(`confirm ${id}: ${sent.detail ?? 'failed'}`);
      }
    }

    if (needsReminder) {
      const mail = reminderEmail(booking);
      if (opts.dry) { result.reminders++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo: herReplyTo });
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
      /* The consultation note is signed by the counsellor the person met, so
         a reply goes to her, with info@ alongside: the same rule as the
         enquiry routing ("enquiries go to the counsellor they are for"). */
      /* The paid note is signed by her too, since 1 Oct 2026. */
      const replyTo = herReplyTo;
      if (opts.dry) { result.followUps++; }
      else {
        const sent = await sendDetailed(pt.email, mail.subject, mail.text, mail.html, { replyTo });
        if (sent.ok) { followedUp.add(id); result.followUps++; }
        else result.failures.push(`followup ${id}: ${sent.detail ?? 'failed'}`);
      }
    }
  }

  /* CONSULTATIONS THAT DID NOT BECOME SESSIONS — 1 Oct 2026.
   *
   * A notice to the practice and to that counsellor, never to the client:
   * the day-after note promised to be the only message of its kind, so any
   * second touch has to come from a person. The notice carries draft 3 of
   * the client follow-ups as a mailto:, with her paid calendar filled in,
   * for her to edit and send or to leave. Once per patient, ever. */
  const unconvertedAlerted = new Set(ledger.unconvertedAlerted);
  const candidates = ledger.readFailed ? [] : unconvertedConsults(appts, {
    now,
    isConsult: (ap) => isConsultAppointment(ap, CONSULT_TYPE),
    followedUp,
    alreadyAlerted: unconvertedAlerted,
  });
  if (opts.dry) result.unconvertedCandidates = candidates.map((ap) => String(ap.id));
  for (const ap of candidates) {
    const purl = ap.patient?.links?.self;
    const who = purl ? await patient(purl) : null;
    if (!who) continue;
    const mail = unconvertedNotice(ap, who);
    if (opts.dry) { result.unconverted++; continue; }
    const sent = await sendDetailed(recipients(ap), mail.subject, mail.text, mail.html, { replyTo: site.email });
    if (sent.ok) { unconvertedAlerted.add(idFromLink(purl)); result.unconverted++; }
    else result.failures.push(`unconverted ${ap.id}: ${sent.detail ?? 'failed'}`);
  }

  /* PAID CLIENTS WITH NOTHING BOOKED — 1 Oct 2026.
   *
   * Nothing watched a paying client who went quiet after session one, two or
   * three. A notice to the practice and to that counsellor, never to the
   * client, carrying the 'after-session' draft as a mailto: with her paid
   * calendar. Once per patient and session. Skipped when the ledger could
   * not be read, or every gap in the window would be noticed again. */
  const lapsed = ledger.readFailed ? [] : lapsedPaidClients(appts, { now, isConsult, alreadyAlerted: lapsedAlerted });
  if (opts.dry) result.lapsedCandidates = lapsed.map((ap) => String(ap.id));
  for (const ap of lapsed) {
    const purl = ap.patient?.links?.self;
    const who = purl ? await patient(purl) : null;
    if (!who) continue;
    const mail = lapsedNotice(ap, who);
    if (opts.dry) { result.lapsed++; continue; }
    const sent = await sendDetailed(recipients(ap), mail.subject, mail.text, mail.html, { replyTo: site.email });
    if (sent.ok) { lapsedAlerted.add(lapsedKey(ap)); result.lapsed++; }
    else result.failures.push(`lapsed ${ap.id}: ${sent.detail ?? 'failed'}`);
  }

  /* THE MONTHLY TALLY. Counts only; see lib/booking-tally.ts. The keys join
     the ledger only once the tally has been written, so a failed write means
     the same events are tried next run rather than lost or counted twice.
     Skipped when the ledger could not be read: an empty ledger would count
     the whole window again. */
  const tallied = new Set(ledger.tallied);
  if (!ledger.readFailed) {
    const fresh = tallyEvents(appts, {
      now,
      isConsult: (ap) => isConsultAppointment(ap, CONSULT_TYPE),
      slugFor: (ap) => practitionerFor(ap)?.slug,
    }).filter((e) => !tallied.has(e.key));
    if (opts.dry) result.tallied = fresh.length;
    else if (fresh.length && (await addToBookingTally(fresh))) {
      for (const e of fresh) tallied.add(e.key);
      result.tallied = fresh.length;
    }
  }

  /* Written whenever anything changed, including the silent backfill of the
     two alert lists, which must persist or the next run repeats the scan. */
  const ledgerChanged = result.confirmations > 0 || result.reminders > 0 || result.followUps > 0
    || alerted.size !== ledger.alerted.length || cancelAlerted.size !== ledger.cancelAlerted.length
    || unconvertedAlerted.size !== ledger.unconvertedAlerted.length || tallied.size !== ledger.tallied.length
    || lapsedAlerted.size !== ledger.lapsedAlerted.length || followUpSkipped.size !== ledger.followUpSkipped.length;
  if (!opts.dry && ledgerChanged) {
    await writeLedger({ confirmed: [...confirmed], followedUp: [...followedUp], reminded: [...reminded], alerted: [...alerted], cancelAlerted: [...cancelAlerted], unconvertedAlerted: [...unconvertedAlerted], tallied: [...tallied], lapsedAlerted: [...lapsedAlerted], followUpSkipped: [...followUpSkipped], updatedAt: '' });
  }

  return result;
}

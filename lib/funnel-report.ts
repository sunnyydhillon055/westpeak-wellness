import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { site, CONSULT_TYPE } from '@/lib/site';
import { isConsultAppointment } from '@/lib/booking-shape';
import { readInbound, type Inbound } from '@/lib/inbound';
import { isTestSubmission, isRealSubmission } from '@/lib/inbound-quality';
import { readClients } from '@/lib/clients';
import { readSearchTerms } from '@/lib/search-log';
import { readConversions, bookClickBreakdown, funnelCuts, channelVisits, type BookClickBreakdown, type FunnelCuts, type DetailConversions } from '@/lib/conversion-log';
import { api, headers, listAll } from '@/lib/cliniko';
import { practitionerSlugFor } from '@/lib/practitioner-for';
import { locations } from '@/lib/locations';
import {
  classifyConsults, sourceAndCity, enquiryOutcomes, totalOf, MIN_CITY, NO_PRACTITIONER,
  type Appt, type ConsultOutcome, type Converted, type EnquiryOutcomes, type EnquiryRow,
} from '@/lib/funnel-joins';
import { readBookingTally, tallyRows, tallyLine, type TallyRow } from '@/lib/booking-tally-read';

/* The monthly conversion report — what happened at the top of the funnel.
 *
 * WHY THIS IS THE MOST IMPORTANT THING IN EITHER GROWTH LIST
 *
 * Forty-five items have now been built across CLIENT_GROWTH_25.md and
 * CLIENT_GROWTH_20_MORE.md, every one of them justified by an argument. None of
 * those arguments is worth anything if nobody can tell afterwards which were
 * right. Without a number arriving unprompted every month, the honest state of
 * knowledge is "we did a lot of things and the practice feels busier or does
 * not", and the next round of decisions gets made the same way this one was —
 * from reasoning rather than from evidence.
 *
 * It is emailed rather than put on a dashboard for the same reason the revenue
 * report is: a dashboard is a thing you have to remember to open, and nobody
 * remembers to open a dashboard to find out that nothing happened. The month a
 * number goes to zero is precisely the month nobody logs in.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * No targets, no traffic-light colours, no month-on-month percentage. With
 * numbers this small a percentage change is noise wearing a suit — going from
 * two enquiries to three is not a 50% improvement, it is one extra person. The
 * report gives counts and lets a human read them.
 *
 * It also names no client and quotes no message. It counts.
 */

/** How long after a consultation a paid booking still counts as its
 *  conversion. Sixty days covers "I'll start after the holidays" without
 *  crediting a consultation for a return a year later. */
export const CONVERT_DAYS = 60;
/** Written messages are followed back this far. */
export const ENQUIRY_DAYS = 90;

type Counts = {
  leads: number;
  enquiries: number;
  unanswered: number;
  newClients: number;
  consults: number;
  paidSessions: number;
  searches: number;
  topTerms: { term: string; n: number }[];
  /** Pages people were reading when they decided to write. The only
   *  first-party attribution this practice has. */
  topSources: { path: string; n: number }[];
  /** Booking clicks by the button that produced them and by the counsellor
   *  the link named. ALL TIME since the log began (18 Aug 2026), not the
   *  month: the conversion log is one cumulative tally with no day buckets,
   *  by design (lib/conversion-log.ts), and the email says so. The
   *  month-on-month view is the previous email. */
  bookClicks: BookClickBreakdown;
  /** When the conversion log began, for the line above. */
  countedSince: string;
  /** The calendar by counsellor and surface, the tools' outcomes and the
   *  one-pagers. Cumulative, like bookClicks. */
  cuts: FunnelCuts;
  /** Messages this month by the counsellor the form named. */
  enquiriesByPractitioner: Record<string, number>;
  /** Consultations that started in the month, by roster slug: held, then
   *  converted to a paid booking within CONVERT_DAYS or not yet, and the
   *  ones cancelled or missed. Null when Cliniko could not be read. */
  consultToPaid: Record<string, ConsultOutcome> | null;
  /** The held consultations again, by where the person heard of the
   *  practice and by city. Each sums to the held total. */
  consultSources: { bySource: Record<string, Converted>; byCity: Record<string, Converted> } | null;
  /** Messages over the last ENQUIRY_DAYS, followed to a consultation and a
   *  paid session. Sums to the number of messages. */
  enquiryOutcomes: EnquiryOutcomes | null;
  /** The appointment read hit its page bound; every Cliniko count is a floor. */
  clinikoTruncated: boolean;
  /** The booking-mail job's monthly tally for the same month. */
  bookingTally: { status: 'ok'; month: string; rows: { slug: string; row: TallyRow }[]; updatedAt: string } | { status: 'absent'; reason: string };
  /** Visits by the kind of organisation whose link was followed
   *  (?utm_source=, lib/conversion-detail-client.ts). All time, like the
   *  booking clicks. Optional so a caller built before 1 Oct still renders. */
  channels?: DetailConversions[];
};

const startOfMonthsAgo = (n: number) => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCMonth(d.getUTCMonth() - n);
  return d;
};

/* Full UTC timestamps. Cliniko rejects a date-only bound with 400
 * "Timestamp needs to be in UTC format" — the same trap that made every
 * booking email silently fail before it was found. */
const utc = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

/** Every appointment from `from` to `to`, all pages (lib/cliniko.ts listAll).
 *  Before 1 Oct 2026 this read one page of 100 and never followed
 *  links.next, so a busy month would have been undercounted in silence. */
export async function clinikoAppointments(from: Date, to: Date): Promise<{ appts: Appt[]; truncated: boolean } | null> {
  const conn = api();
  if (!conn) return null;
  try {
    const url =
      `https://api.${conn.shard}.cliniko.com/v1/appointments` +
      `?per_page=100&sort=starts_at:asc&q[]=${encodeURIComponent(`starts_at:>=${utc(from)}`)}` +
      `&q[]=${encodeURIComponent(`starts_at:<=${utc(to)}`)}`;
    const r = await listAll(url, conn.key, 'appointments', 10);
    if (r.error) return null;
    return { appts: r.rows as Appt[], truncated: r.truncated };
  } catch {
    return null;
  }
}

/** Consultations and paid sessions that STARTED in the window. */
export function windowCounts(appts: Appt[], from: Date, to: Date): { consults: number; paid: number } {
  const inWindow = appts.filter((a) => {
    const t = a.starts_at ? Date.parse(a.starts_at) : NaN;
    return Number.isFinite(t) && t >= from.getTime() && t < to.getTime();
  });
  const live = inWindow.filter((a) => !a.cancelled_at && !a.archived_at);
  /* By APPOINTMENT TYPE, not by duration.
   *
   * This read `Number(a.duration_in_minutes ?? 50) <= 20`. /v1/appointments
   * does not return duration_in_minutes, so the field was always undefined,
   * the ?? 50 always fired, and `50 <= 20` was false for every appointment
   * ever counted. Consultations reported 0 forever and every free consult
   * was counted as a paid session — which is exactly what the August 2026
   * report said: 0 consultations, 12 paid.
   *
   * Third instance of the same dead field. The other two were in
   * lib/booking-notify.ts. Everything now goes through booking-shape.ts so
   * there is one implementation to be wrong. */
  const consults = live.filter((a) => isConsultAppointment(a, CONSULT_TYPE)).length;
  return { consults, paid: live.length - consults };
}

/** Run `fn` over `items`, at most `n` at a time. Cliniko allows 200 requests
 *  a minute; four in flight keeps a month's report far inside that. */
async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await fn(items[k]);
    }
  }));
  return out;
}

/** The referral source and city of each consulting patient, one GET per
 *  patient, cached for the run. Held in memory only; what leaves is the
 *  bucket counts in lib/funnel-joins.ts. */
async function patientFacts(keys: string[]): Promise<Map<string, { referral?: unknown; city?: unknown } | null>> {
  const conn = api();
  const out = new Map<string, { referral?: unknown; city?: unknown } | null>();
  if (!conn) return out;
  const unique = [...new Set(keys.filter(Boolean))];
  await pool(unique, 4, async (id) => {
    try {
      const res = await fetch(`https://api.${conn.shard}.cliniko.com/v1/patients/${encodeURIComponent(id)}`, {
        headers: headers(conn.key), cache: 'no-store',
      });
      if (!res.ok) { out.set(id, null); return; }
      const p = (await res.json()) as Record<string, unknown>;
      out.set(id, { referral: p.referral_source, city: p.city });
    } catch {
      out.set(id, null);
    }
  });
  return out;
}

/** The Cliniko patient id for each lower-cased address, null when Cliniko
 *  has none, 'error' when the lookup failed. Never stored, never returned
 *  past the join. */
async function patientIdsByEmail(emails: string[]): Promise<Map<string, string | null | 'error'>> {
  const conn = api();
  const out = new Map<string, string | null | 'error'>();
  const unique = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  if (!conn) { for (const e of unique) out.set(e, 'error'); return out; }
  await pool(unique, 4, async (email) => {
    try {
      const url = `https://api.${conn.shard}.cliniko.com/v1/patients` +
        `?q[]=${encodeURIComponent(`email:=${email}`)}&per_page=1`;
      const res = await fetch(url, { headers: headers(conn.key), cache: 'no-store' });
      if (!res.ok) { out.set(email, 'error'); return; }
      const p = ((await res.json()) as { patients?: { id?: unknown }[] }).patients?.[0];
      out.set(email, p?.id != null ? String(p.id) : null);
    } catch {
      out.set(email, 'error');
    }
  });
  return out;
}

export type FunnelJoins = {
  ok: boolean;
  consults: number;
  paid: number;
  consultToPaid: Record<string, ConsultOutcome> | null;
  consultSources: Counts['consultSources'];
  enquiryOutcomes: EnquiryOutcomes | null;
  truncated: boolean;
};

/** The Cliniko half of the report: the month's counts and the three joins.
 *  Shared by the email and /admin so the two cannot disagree. Every failure
 *  degrades to null for that section, never a throw. */
export async function funnelJoins(from: Date, to: Date, enquiries: Inbound[], now = new Date()): Promise<FunnelJoins> {
  const span = await clinikoAppointments(
    new Date(Math.min(from.getTime(), now.getTime() - ENQUIRY_DAYS * 864e5) - 90 * 864e5),
    new Date(Math.max(to.getTime(), now.getTime()) + CONVERT_DAYS * 864e5),
  );
  if (!span) {
    return { ok: false, consults: 0, paid: 0, consultToPaid: null, consultSources: null, enquiryOutcomes: null, truncated: false };
  }
  const { appts, truncated } = span;
  const { consults, paid } = windowCounts(appts, from, to);

  const { bySlug, held } = classifyConsults(appts, {
    from, to, consultTypeId: CONSULT_TYPE, slugFor: practitionerSlugFor, withinDays: CONVERT_DAYS,
  });

  let consultSources: Counts['consultSources'] = null;
  try {
    const facts = await patientFacts(held.map((h) => h.patient));
    consultSources = sourceAndCity(held, facts, locations);
  } catch { /* the section prints as unavailable */ }

  let outcomes: EnquiryOutcomes | null = null;
  try {
    const since = now.getTime() - ENQUIRY_DAYS * 864e5;
    const recent = enquiries.filter((i) => i.kind === 'enquiry' && !isTestSubmission(i) && Date.parse(i.createdAt) >= since);
    const ids = await patientIdsByEmail(recent.map((i) => i.email));
    outcomes = enquiryOutcomes(
      recent.map((i) => ({
        createdAt: i.createdAt,
        source: i.source || '/',
        practitioner: i.practitioner,
        patient: ids.get(i.email.trim().toLowerCase()) ?? 'error',
      })),
      appts,
      CONSULT_TYPE,
    );
  } catch { /* the section prints as unavailable */ }

  return { ok: true, consults, paid, consultToPaid: bySlug, consultSources, enquiryOutcomes: outcomes, truncated };
}

export async function gather(opts: { now?: Date } = {}): Promise<{ counts: Counts; from: Date; to: Date; clinikoOk: boolean }> {
  const from = startOfMonthsAgo(1);
  const to = startOfMonthsAgo(0);

  const { items } = await readInbound({ fresh: true });
  const inWindow = items.filter((i) => {
    const t = new Date(i.createdAt).getTime();
    return t >= from.getTime() && t < to.getTime();
  });

  const { clients } = await readClients({ fresh: true });
  const newClients = clients.filter((c) => {
    const t = new Date(c.addedAt).getTime();
    return t >= from.getTime() && t < to.getTime();
  }).length;

  const terms = await readSearchTerms();
  const topTerms = Object.entries(terms.terms)
    .map(([term, n]) => ({ term, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);

  const ck = await funnelJoins(from, to, items, opts.now ?? new Date());

  /* WHICH COUNSELLOR, WHICH BUTTON — 1 Oct 2026. The first month's report
   * could say how many booked and not which of the two counsellors' pages
   * sent them, or whether the sticky bar or the band did the work. */
  const log = await readConversions({ fresh: true });

  const periodKey = `${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}`;
  const tallyRead = await readBookingTally();
  const bookingTally: Counts['bookingTally'] = tallyRead.status === 'ok'
    ? { status: 'ok', month: periodKey, rows: tallyRows(tallyRead.tally, periodKey), updatedAt: tallyRead.tally.updatedAt }
    : tallyRead;

  return {
    from, to,
    clinikoOk: ck.ok,
    counts: {
      /* Real submissions only (lib/inbound-quality.ts isRealSubmission), since
       * 1 Oct 2026: 64 of 69 stored leads were honeypot-tripped scripts. */
      leads: inWindow.filter((i) => i.kind === 'lead' && isRealSubmission(i)).length,
      enquiries: inWindow.filter((i) => i.kind === 'enquiry' && isRealSubmission(i)).length,
      /* Not windowed. An unanswered message from two months ago is more
       * urgent than one from yesterday, not less. */
      unanswered: items.filter((i) => !i.handled && isRealSubmission(i)).length,
      newClients,
      consults: ck.consults,
      paidSessions: ck.paid,
      searches: terms.total,
      topTerms,
      /* WHICH PAGES ACTUALLY EARNED THE MESSAGES.
       *
       * `source` has been stored on every inbound record since the capture
       * store was built and had never been read by anything. It is the only
       * first-party attribution this practice has — the page somebody was
       * reading when they decided to write — and it costs nothing to surface.
       *
       * Windowed, unlike `unanswered`, because the question here is "what
       * worked last month" rather than "what is outstanding". */
      topSources: Object.entries(
        inWindow.filter(isRealSubmission).reduce<Record<string, number>>((acc, i) => {
          const src = i.source || '/';
          acc[src] = (acc[src] ?? 0) + 1;
          return acc;
        }, {})
      )
        .map(([path, n]) => ({ path, n }))
        .sort((a, b) => b.n - a.n)
        .slice(0, 8),
      bookClicks: bookClickBreakdown(log),
      countedSince: log.since ? log.since.slice(0, 10) : '',
      cuts: funnelCuts(log),
      enquiriesByPractitioner: inWindow
        .filter((i) => i.kind === 'enquiry')
        .reduce<Record<string, number>>((acc, i) => {
          const k = i.practitioner || NO_PRACTITIONER;
          acc[k] = (acc[k] ?? 0) + 1;
          return acc;
        }, {}),
      consultToPaid: ck.consultToPaid,
      consultSources: ck.consultSources,
      enquiryOutcomes: ck.enquiryOutcomes,
      clinikoTruncated: ck.truncated,
      bookingTally,
      channels: channelVisits(log),
    },
  };
}

const pad = (n: number, w = 4) => String(n).padStart(w);
const sorted = <T,>(m: Record<string, T>, by: (v: T) => number) =>
  Object.entries(m).sort((a, b) => by(b[1]) - by(a[1]));

/** Consult-to-paid by counsellor, then by source and city. Shared by the
 *  plain and HTML bodies and by /admin. */
export function consultLines(c: Pick<Counts, 'consultToPaid' | 'consultSources'>, month: string, asOf: string): string[] {
  if (!c.consultToPaid) return [];
  const out = [`Consultations in ${month} → a paid session booked within ${CONVERT_DAYS} days, as of ${asOf}:`, ''];
  const rows = sorted(c.consultToPaid, (r) => r.consultsHeld + r.cancelled + r.dna);
  if (!rows.length) out.push('  No consultations started in the month.');
  for (const [slug, r] of rows) {
    out.push(`  ${pad(r.consultsHeld)} held → ${pad(r.convertedToPaid, 2)} paid, ${pad(r.notYet, 2)} not yet · ${r.cancelled} cancelled, ${r.dna} missed  ${slug}`);
  }
  if (rows.length > 1) {
    const t = totalOf(c.consultToPaid);
    out.push(`  ${pad(t.consultsHeld)} held → ${pad(t.convertedToPaid, 2)} paid, ${pad(t.notYet, 2)} not yet · ${t.cancelled} cancelled, ${t.dna} missed  (all)`);
  }
  const s = c.consultSources;
  if (s && Object.keys(s.bySource).length) {
    out.push('', '  By where they heard of the practice (Cliniko referral source):');
    for (const [k, v] of sorted(s.bySource, (r) => r.consultsHeld)) out.push(`  ${pad(v.consultsHeld)} held → ${pad(v.convertedToPaid, 2)} paid  ${k}`);
    out.push('', `  By city (fewer than ${MIN_CITY} from one city are counted as other BC/AB):`);
    for (const [k, v] of sorted(s.byCity, (r) => r.consultsHeld)) out.push(`  ${pad(v.consultsHeld)} held → ${pad(v.convertedToPaid, 2)} paid  ${k}`);
  }
  return out;
}

/** Written messages followed to a booking, by source page and by the
 *  counsellor asked for. */
export function enquiryLines(c: Pick<Counts, 'enquiryOutcomes'>): string[] {
  const e = c.enquiryOutcomes;
  if (!e) return [];
  const out = [`Messages → consultation → paid, last ${ENQUIRY_DAYS} days: ${e.total} message${e.total === 1 ? '' : 's'}`, ''];
  if (!e.total) return [...out, '  No messages in the period.'];
  const line = (r: EnquiryRow, label: string) =>
    `  ${pad(r.enquiries)} → ${pad(r.consult, 2)} → ${pad(r.paid, 2)}${r.existing ? `  (${r.existing} already a client)` : ''}  ${label}`;
  out.push('  By the page they wrote from:');
  for (const [k, v] of sorted(e.bySource, (r) => r.enquiries)) out.push(line(v, k));
  out.push('', '  By the counsellor they asked for:');
  for (const [k, v] of sorted(e.byPractitioner, (r) => r.enquiries)) out.push(line(v, k));
  if (e.lookupFailed) out.push('', `  ${e.lookupFailed} could not be looked up in Cliniko and count as not booked.`);
  return out;
}

/** The calendar, tool outcomes, one-pagers and messages by counsellor. */
export function cutLines(c: Pick<Counts, 'cuts' | 'enquiriesByPractitioner'>): string[] {
  const out: string[] = [];
  const { calendar, toolOutcomes, magnets } = c.cuts;
  if (calendar.length) {
    out.push('The calendar by counsellor, seen · touched · opened in its own tab:');
    for (const r of calendar) {
      out.push(`  ${pad(r.seen)} · ${pad(r.touched, 3)} · ${pad(r.opened, 3)}  ${r.who}, ${r.surface === 'portal' ? 'client portal (paid)' : '/book (free consultation)'}`);
    }
    out.push('');
  }
  if (toolOutcomes.rows.length) {
    out.push('What the tools concluded:');
    for (const r of toolOutcomes.rows) out.push(`  ${pad(r.count)}  ${r.detail}`);
    out.push('');
  }
  if (magnets.rows.length) {
    out.push('Checklists asked for:');
    for (const r of magnets.rows) out.push(`  ${pad(r.count)}  ${r.detail}`);
    out.push('');
  }
  const byWho = Object.entries(c.enquiriesByPractitioner);
  if (byWho.length) {
    out.push('Messages this month by the counsellor the form named:');
    for (const [k, n] of byWho.sort((a, b) => b[1] - a[1])) out.push(`  ${pad(n)}  ${k}`);
    out.push('');
  }
  return out;
}

/** The booking-mail job's tally for the month, or why there is none. */
export function tallyLines(c: Pick<Counts, 'bookingTally'>, month: string): string[] {
  const t = c.bookingTally;
  if (t.status !== 'ok') return [`Booking tally: not available, ${t.reason}.`];
  if (!t.rows.length) return [`Booking tally for ${month}: nothing recorded for the month.`];
  return [`Booking tally for ${month}, from the booking-mail job:`, '', ...t.rows.map((r) => `  ${r.slug}: ${tallyLine(r.row)}`)];
}

/** The two book_click cuts as text lines, shared by the plain and HTML
 *  bodies so they cannot say different things. Empty when nothing has been
 *  attributed yet, so a month before the detail existed prints no section. */
function bookClickLines(c: Counts): string[] {
  const b = c.bookClicks;
  if (!b.byLocation.length) return [];
  const since = c.countedSince ? ` since ${c.countedSince}` : '';
  const out = [`Booking clicks${since}: ${b.total}`, ''];
  out.push('  By button:');
  for (const r of b.byLocation) out.push(`  ${String(r.count).padStart(4)}  ${r.detail}`);
  if (b.unattributed > 0) out.push(`  ${String(b.unattributed).padStart(4)}  (before the button was recorded)`);
  out.push('', '  By counsellor the link named:');
  for (const r of b.byCounsellor) out.push(`  ${String(r.count).padStart(4)}  ${r.detail}`);
  out.push(`  ${String(b.noCounsellor).padStart(4)}  (no counsellor named; /book offered both)`);
  return out;
}

/** Paths and slugs only reach these blocks, but a path is whatever the
 *  form recorded, so it is escaped before it goes into HTML. */
const escHtml = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function render(counts: Counts, from: Date, to: Date, clinikoOk: boolean) {
  const month = from.toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  /* YYYY-MM for the workbook link, so the spreadsheet covers the same period
     the email describes rather than whatever month it is opened in. */
  const periodKey = `${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}`;

  const rows: [string, string][] = [
    ['Checklist requests', String(counts.leads)],
    ['Messages sent', String(counts.enquiries)],
    /* "booked" is exact and load-bearing. These count APPOINTMENTS that
       started in the window, not money. The paid-sessions workbook linked
       below counts invoices that CLOSED — which is a different number, on
       purpose, and the one to use when asking what was earned. */
    ['Consultations booked', clinikoOk ? String(counts.consults) : 'unavailable'],
    ['Paid sessions booked', clinikoOk ? String(counts.paidSessions) : 'unavailable'],
    ['New client records', String(counts.newClients)],
  ];

  const lines = [
    `Westpeak Wellness, ${month}`,
    '',
    ...rows.map(([k, v]) => `  ${k.padEnd(24)} ${v}`),
    '',
    '  Paid sessions in detail (one tab per practitioner, sign-in required):',
    `  ${site.domain}/api/admin/paid-sessions?month=${periodKey}`,
    '',
    counts.unanswered > 0
      ? `  ${counts.unanswered} message(s) still awaiting a reply, ${site.domain}/admin#inbox`
      : '  Nothing awaiting a reply.',
    '',
  ];

  if (counts.topSources.length) {
    lines.push('Pages that earned a message or signup this month:', '');
    for (const t of counts.topSources) lines.push(`  ${String(t.n).padStart(4)}  ${t.path}`);
    lines.push(
      '',
      'This is the page somebody was reading when they decided to write. It is the',
      'closest thing to attribution this practice has, and it is first-party.',
      ''
    );
  }

  const asOf = new Date().toLocaleDateString('en-CA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const ctpLines = consultLines(counts, month, asOf);
  const enqLines = enquiryLines(counts);
  const funnelCutLines = cutLines(counts);
  const bookingTallyLines = tallyLines(counts, month);
  if (counts.clinikoTruncated) {
    lines.push('Truncated: Cliniko returned more appointments than the read allows, so every', 'booking count below is a floor, not the whole.', '');
  }
  if (ctpLines.length) lines.push(...ctpLines, '');
  lines.push(...bookingTallyLines, '');
  if (enqLines.length && !counts.enquiryOutcomes?.total) lines.push(...enqLines, '');
  else if (enqLines.length) {
    lines.push(...enqLines, '',
      'Matched by address in Cliniko, counted and never listed. Someone who wrote',
      'from one address and booked from another counts as not booked.',
      ''
    );
  }
  if (funnelCutLines.length) {
    lines.push(...funnelCutLines,
      'The calendar, tool and checklist counts are cumulative since 1 Oct 2026,',
      'when the log began recording who and what, not the month.',
      ''
    );
  }
  if (counts.channels?.length) {
    lines.push('Visits by channel (all time; the ?utm_source= on a link the practice handed out):', '');
    for (const r of counts.channels) lines.push(`  ${String(r.count).padStart(4)}  ${r.detail}`);
    lines.push('');
  }

  const clickLines = bookClickLines(counts);
  if (clickLines.length) {
    lines.push(...clickLines, '',
      'Cumulative since the counter began, not the month: the log keeps no day',
      'buckets, so the month-on-month view is last month\'s email beside this one.',
      ''
    );
  }

  if (counts.topTerms.length) {
    lines.push('What people searched for on the site (all time):', '');
    for (const t of counts.topTerms) lines.push(`  ${String(t.n).padStart(4)}  ${t.term}`);
    lines.push('', 'A term with no page behind it is a page worth writing.', '');
  }

  if (!clinikoOk) {
    lines.push(
      'Cliniko could not be reached, so booking counts are missing from this',
      'report. The rest is from this site and is complete.',
      ''
    );
  }

  lines.push(
    'Counts, not percentages. At these volumes a percentage change is noise: ',
    'two enquiries to three is one extra person, not a 50% improvement.',
    '',
    site.name
  );

  const text = lines.join('\n');

  const cell = 'padding:7px 10px;border-bottom:1px solid #e6ddce;font-size:15px;';
  const html = `<!doctype html><html><body style="margin:0;background:#faf7f1;padding:26px 12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2b3138;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:10px;padding:30px;">
<tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#545e69;">Westpeak Wellness</p>
<h1 style="margin:0 0 18px;font-size:21px;color:#3d6c92;">${month}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
${rows.map(([k, v]) => `<tr><td style="${cell}color:#545e69;">${k}</td><td style="${cell}text-align:right;font-weight:600;font-variant-numeric:tabular-nums;">${v}</td></tr>`).join('')}
</table>
<p style="margin:0 0 16px;padding:11px 14px;background:#edf3f8;border-left:3px solid #3d6c92;font-size:15px;">
<strong>Paid sessions, in detail.</strong> A spreadsheet with one tab per practitioner, listing
every session that received funds this period.
<a href="${site.domain}/api/admin/paid-sessions?month=${periodKey}" style="color:#3d6c92;">Download the workbook</a>
<span style="color:#545e69;">, sign in required.</span></p>
${counts.unanswered > 0
  ? `<p style="margin:0 0 16px;padding:11px 14px;background:#f8f2ea;border-left:3px solid #b4472f;font-size:15px;"><strong>${counts.unanswered} message${counts.unanswered === 1 ? '' : 's'} still awaiting a reply.</strong> <a href="${site.domain}/admin#inbox" style="color:#3d6c92;">Open the inbox</a></p>`
  : `<p style="margin:0 0 16px;font-size:15px;color:#545e69;">Nothing awaiting a reply.</p>`}
${counts.topTerms.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Searched on the site</p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">${counts.topTerms.map((t) => `${t.term} <span style="color:#545e69;">(${t.n})</span>`).join(' · ')}</p>
     <p style="margin:0 0 16px;font-size:14px;color:#545e69;">A term with no page behind it is a page worth writing.</p>`
  : ''}
${counts.clinikoTruncated ? `<p style="margin:0 0 16px;font-size:14px;color:#b4472f;"><strong>Truncated.</strong> Cliniko returned more appointments than the read allows; every booking count is a floor.</p>` : ''}
${ctpLines.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Consultations → paid</p>
     <pre style="margin:0 0 8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${escHtml(ctpLines.join('\n'))}</pre>`
  : ''}
<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Booking tally</p>
<pre style="margin:0 0 8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${escHtml(bookingTallyLines.join('\n'))}</pre>
${enqLines.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Messages → consultation → paid</p>
     <pre style="margin:0 0 8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${escHtml(enqLines.join('\n'))}</pre>
     <p style="margin:0 0 16px;font-size:14px;color:#545e69;">Matched by address in Cliniko, counted and never listed.</p>`
  : ''}
${funnelCutLines.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Calendar, tools and checklists</p>
     <pre style="margin:0 0 8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${escHtml(funnelCutLines.join('\n'))}</pre>
     <p style="margin:0 0 16px;font-size:14px;color:#545e69;">Cumulative since 1 Oct 2026, not the month.</p>`
  : ''}
${counts.channels?.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Visits by channel, all time</p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">${counts.channels.map((r) => `${r.detail} <span style="color:#545e69;">(${r.count})</span>`).join(' · ')}</p>`
  : ''}
${clickLines.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Booking clicks, by button and by counsellor</p>
     <pre style="margin:0 0 8px;font-size:13px;line-height:1.6;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;">${clickLines.join('\n')}</pre>
     <p style="margin:0 0 16px;font-size:14px;color:#545e69;">Cumulative since the counter began, not the month. Last month's email beside this one is the month-on-month view.</p>`
  : ''}
${!clinikoOk ? `<p style="margin:0 0 16px;font-size:14px;color:#545e69;">Cliniko could not be reached, so booking counts are missing. The rest is from this site and is complete.</p>` : ''}
<hr style="border:none;border-top:1px solid #e6ddce;margin:22px 0 14px;">
<p style="margin:0;font-size:12px;line-height:1.6;color:#545e69;">
Counts, not percentages. At these volumes a percentage change is noise, two enquiries to three
is one extra person, not a 50% improvement.
</p>
</td></tr></table></td></tr></table></body></html>`;

  return { subject: `Westpeak: ${month}`, text, html };
}

export type FunnelResult = { ok: boolean; sent: boolean; reason?: string; counts?: Counts };

export async function runFunnelReport(opts: { dry?: boolean } = {}): Promise<FunnelResult> {
  const { counts, from, to, clinikoOk } = await gather();
  if (opts.dry) return { ok: true, sent: false, counts };
  if (!mailConfigured()) return { ok: false, sent: false, reason: 'mail not configured', counts };

  const to_ = process.env.PORTAL_ADMIN_EMAILS?.split(',')[0]?.trim() || site.email;
  const mail = render(counts, from, to, clinikoOk);
  const res = await sendDetailed(to_, mail.subject, mail.text, mail.html, { replyTo: site.email });
  return { ok: res.ok, sent: res.ok, reason: res.detail, counts };
}

import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { site, CONSULT_TYPE } from '@/lib/site';
import { isConsultAppointment } from '@/lib/booking-shape';
import { readInbound } from '@/lib/inbound';
import { readClients } from '@/lib/clients';
import { readSearchTerms } from '@/lib/search-log';
import { api, headers } from '@/lib/cliniko';

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

type Counts = {
  leads: number;
  enquiries: number;
  waitlist: number;
  unanswered: number;
  newClients: number;
  consults: number;
  paidSessions: number;
  searches: number;
  topTerms: { term: string; n: number }[];
  /** Pages people were reading when they decided to write. The only
   *  first-party attribution this practice has. */
  topSources: { path: string; n: number }[];
};

const startOfMonthsAgo = (n: number) => {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCMonth(d.getUTCMonth() - n);
  return d;
};

/** Consultations and paid sessions that STARTED in the window, from Cliniko. */
async function clinikoCounts(from: Date, to: Date): Promise<{ consults: number; paid: number } | null> {
  const conn = api();
  if (!conn) return null;
  try {
    /* Full UTC timestamps. Cliniko rejects a date-only bound with 400
     * "Timestamp needs to be in UTC format" — the same trap that made every
     * booking email silently fail before it was found. */
    const f = from.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const t = to.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const url =
      `https://api.${conn.shard}.cliniko.com/v1/appointments` +
      `?per_page=100&q[]=${encodeURIComponent(`starts_at:>=${f}`)}` +
      `&q[]=${encodeURIComponent(`starts_at:<=${t}`)}`;
    const res = await fetch(url, { headers: headers(conn.key), cache: 'no-store' });
    if (!res.ok) return null;
    const appts = ((await res.json()).appointments ?? []) as any[];
    const live = appts.filter((a) => !a.cancelled_at && !a.archived_at);
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
  } catch {
    return null;
  }
}

export async function gather(): Promise<{ counts: Counts; from: Date; to: Date; clinikoOk: boolean }> {
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

  const ck = await clinikoCounts(from, to);

  return {
    from, to,
    clinikoOk: ck !== null,
    counts: {
      leads: inWindow.filter((i) => i.kind === 'lead').length,
      enquiries: inWindow.filter((i) => i.kind === 'enquiry').length,
      waitlist: inWindow.filter((i) => i.kind === 'waitlist').length,
      /* Not windowed. An unanswered message from two months ago is more
       * urgent than one from yesterday, not less. */
      unanswered: items.filter((i) => !i.handled).length,
      newClients,
      consults: ck?.consults ?? 0,
      paidSessions: ck?.paid ?? 0,
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
        inWindow.reduce<Record<string, number>>((acc, i) => {
          const src = i.source || '/';
          acc[src] = (acc[src] ?? 0) + 1;
          return acc;
        }, {})
      )
        .map(([path, n]) => ({ path, n }))
        .sort((a, b) => b.n - a.n)
        .slice(0, 8),
    },
  };
}

export function render(counts: Counts, from: Date, to: Date, clinikoOk: boolean) {
  const month = from.toLocaleDateString('en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  /* YYYY-MM for the workbook link, so the spreadsheet covers the same period
     the email describes rather than whatever month it is opened in. */
  const periodKey = `${from.getUTCFullYear()}-${String(from.getUTCMonth() + 1).padStart(2, '0')}`;

  const rows: [string, string][] = [
    ['Checklist requests', String(counts.leads)],
    ['Messages sent', String(counts.enquiries)],
    ['Waitlist signups', String(counts.waitlist)],
    /* "booked" is exact and load-bearing. These count APPOINTMENTS that
       started in the window, not money. The paid-sessions workbook linked
       below counts invoices that CLOSED — which is a different number, on
       purpose, and the one to use when asking what was earned. */
    ['Consultations booked', clinikoOk ? String(counts.consults) : 'unavailable'],
    ['Paid sessions booked', clinikoOk ? String(counts.paidSessions) : 'unavailable'],
    ['New client records', String(counts.newClients)],
  ];

  const lines = [
    `Westpeak Wellness — ${month}`,
    '',
    ...rows.map(([k, v]) => `  ${k.padEnd(24)} ${v}`),
    '',
    '  Paid sessions in detail (one tab per practitioner, sign-in required):',
    `  ${site.domain}/api/admin/paid-sessions?month=${periodKey}`,
    '',
    counts.unanswered > 0
      ? `  ${counts.unanswered} message(s) still awaiting a reply — ${site.domain}/admin#inbox`
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
    'Counts, not percentages. At these volumes a percentage change is noise —',
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
<span style="color:#545e69;"> — sign in required.</span></p>
${counts.unanswered > 0
  ? `<p style="margin:0 0 16px;padding:11px 14px;background:#f8f2ea;border-left:3px solid #b4472f;font-size:15px;"><strong>${counts.unanswered} message${counts.unanswered === 1 ? '' : 's'} still awaiting a reply.</strong> <a href="${site.domain}/admin#inbox" style="color:#3d6c92;">Open the inbox</a></p>`
  : `<p style="margin:0 0 16px;font-size:15px;color:#545e69;">Nothing awaiting a reply.</p>`}
${counts.topTerms.length
  ? `<p style="margin:0 0 8px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#545e69;">Searched on the site</p>
     <p style="margin:0 0 16px;font-size:15px;line-height:1.8;">${counts.topTerms.map((t) => `${t.term} <span style="color:#545e69;">(${t.n})</span>`).join(' · ')}</p>
     <p style="margin:0 0 16px;font-size:14px;color:#545e69;">A term with no page behind it is a page worth writing.</p>`
  : ''}
${!clinikoOk ? `<p style="margin:0 0 16px;font-size:14px;color:#545e69;">Cliniko could not be reached, so booking counts are missing. The rest is from this site and is complete.</p>` : ''}
<hr style="border:none;border-top:1px solid #e6ddce;margin:22px 0 14px;">
<p style="margin:0;font-size:12px;line-height:1.6;color:#545e69;">
Counts, not percentages. At these volumes a percentage change is noise — two enquiries to three
is one extra person, not a 50% improvement.
</p>
</td></tr></table></td></tr></table></body></html>`;

  return { subject: `Westpeak — ${month}`, text, html };
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

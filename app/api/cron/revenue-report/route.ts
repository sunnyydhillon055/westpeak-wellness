import { NextResponse, type NextRequest } from 'next/server';
import { noteCronRefusal } from '@/lib/cron-refusal';
import { monthlyRevenue, previousMonth, monthFromKey, money } from '@/lib/cliniko-revenue';
import { renderRevenueEmail, sendRevenueReport, reportRecipients } from '@/lib/revenue-email';
import { withCronHealth } from '@/lib/cron-health';

/* Monthly practitioner revenue report.
 *
 * Scheduled in vercel.json for 15:00 UTC on the 1st — 08:00 in Vancouver during
 * PDT, 07:00 during PST — covering the calendar month just ended.
 *
 * SECURITY. This endpoint emails, and can return, the practice's revenue. It
 * refuses to run at all unless CRON_SECRET is set and presented. An unset
 * secret is treated as misconfiguration, NOT as "no auth required": the
 * fail-open version of this route would publish the practice's monthly income
 * at a guessable URL. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`
 * automatically once the variable exists on the project.
 *
 * Query parameters, both requiring the same secret:
 *   ?month=YYYY-MM   run a specific month instead of the previous one
 *   ?dry=1           build the report and return it WITHOUT sending
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorised(req: NextRequest): { ok: boolean; why?: string } {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return { ok: false, why: 'CRON_SECRET is not set on this deployment' };

  const header = req.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const alt = req.nextUrl.searchParams.get('key') || '';

  return bearer === secret || alt === secret
    ? { ok: true }
    : { ok: false, why: 'bad or missing credentials' };
}

export async function GET(req: NextRequest) {
  const gate = authorised(req);
  if (!gate.ok) {
    await noteCronRefusal('revenue-report', req, gate.why);
    // 401 either way. Which of the two reasons applies is logged, not returned:
    // "CRON_SECRET is not set" tells an anonymous caller how to get in.
    console.error('[revenue-report] refused:', gate.why);
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const monthParam = req.nextUrl.searchParams.get('month');
  const period = monthParam ? monthFromKey(monthParam) : previousMonth();
  if (!period) {
    return NextResponse.json({ error: 'month must look like 2026-07' }, { status: 400 });
  }

  /* Report the window without touching Cliniko. The month boundaries are the
   * one part of this that can be wrong by seven hours and still look right, so
   * there is a way to read them back directly. */
  if (req.nextUrl.searchParams.get('period')) {
    return NextResponse.json({
      key: period.key,
      label: period.label,
      startUTC: period.start.toISOString(),
      endUTC: period.end.toISOString(),
      startLocal: period.start.toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
      endLocal: period.end.toLocaleString('en-CA', { timeZone: 'America/Vancouver' }),
    });
  }

  /* Recorded like every other scheduled job — this one was not, until
     13 Sep 2026, so the watchdog could never tell a report that went out from
     one that silently did not. The dry run stays outside the record: asking
     what would be sent is not a run. */
  const dry = Boolean(req.nextUrl.searchParams.get('dry'));
  const run = await withCronHealth('revenue-report', async () => {
    const report = await monthlyRevenue(period);
    if (report.status === 'unconfigured') throw new Error('CLINIKO_API_KEY is not set (including its -ca1 suffix)');
    if (report.status === 'error') throw new Error(`cliniko error: ${report.detail}`);
    const summary = {
      period: report.period.key,
      label: report.period.label,
      total: money(report.total),
      invoices: report.invoiceCount,
      outstanding: money(report.outstanding.cents),
      practitioners: report.lines.map((l) => ({
        name: l.name, invoices: l.invoices, revenue: money(l.cents),
      })),
    };
    if (dry) {
      const { subject, text } = renderRevenueEmail(report);
      return { dryRun: true, wouldSendTo: reportRecipients(), subject, text, summary };
    }
    const sent = await sendRevenueReport(report);
    if (!sent.ok) throw new Error(`send failed: ${sent.detail}`);
    console.log(`[revenue-report] ${report.period.key}: ${money(report.total)} to ${sent.sent.join(', ')}`);
    return { ok: true, sentTo: sent.sent, summary };
  });
  if (!run.ok) {
    console.error('[revenue-report]', run.error);
    return NextResponse.json({ ok: false, job: 'revenue-report', error: run.error }, { status: 502 });
  }
  return NextResponse.json(run.result);
}

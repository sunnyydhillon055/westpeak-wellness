import { monthlyRevenue, type Period, type RevenueReport } from '@/lib/cliniko-revenue';
import { invoiceDetail, linesBySeen, isPaidSession } from '@/lib/cliniko-invoice-detail';

/* The monthly report as it is sent: read from Cliniko, then regrouped to paid
 * sessions by who held them. One function, so the scheduled job and the
 * "send it now" button in /admin/revenue cannot send different numbers.
 * Moved out of the cron route on 1 Oct 2026 for that reason.
 *
 * By who held the session, not whose name is on the invoice (September
 * credited the founder with four invoices and Camille with none). Paid,
 * unrefunded sessions only; consultations never count (owner, 1 Oct 2026).
 * Applied only when every closed invoice was read; otherwise the invoice
 * grouping stands, rather than a total that no longer adds up. */
export async function buildRevenueReport(period: Period): Promise<RevenueReport> {
  const report = await monthlyRevenue(period);
  if (report.status !== 'ok') return report;
  const detail = await invoiceDetail(report.period);
  if (detail.status === 'ok' && detail.skipped === 0 && detail.rows.length === report.invoiceCount) {
    const paid = detail.rows.filter(isPaidSession);
    report.lines = linesBySeen(paid);
    report.reattributed = paid.filter((r) => r.mismatch).length;
    report.total = paid.reduce((n, r) => n + r.amountCents, 0);
    report.totalNet = report.total;
    report.totalTax = 0;
    report.invoiceCount = paid.length;
  }
  return report;
}

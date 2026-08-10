import { sendDetailed } from '@/lib/portal-mail';
import { money, type RevenueReport } from '@/lib/cliniko-revenue';
import { site } from '@/lib/site';

/* The monthly revenue email.
 *
 * Plain text is authoritative and complete on its own — it is what survives in
 * an archive, in a screen reader, and in any client that refuses HTML. The HTML
 * is the same figures in a table, nothing more. Neither version is a summary of
 * the other.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Hard-wrap for the plain-text part. Mail clients do not reflow text/plain,
 *  so an unwrapped paragraph arrives as one very long line. */
const wrap = (s: string, w = 72): string[] => {
  const out: string[] = [];
  let line = '';
  for (const word of s.split(/\s+/)) {
    if (line && line.length + 1 + word.length > w) { out.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) out.push(line);
  return out;
};

/** The sentence that stops the number being misread. Present in both versions,
 *  every month, because the distinction it draws is not intuitive and the
 *  person reading will not remember it a year from now. */
const BASIS =
  'Figures are invoices CLOSED in the period (Cliniko\'s API has no payments ' +
  'endpoint, so payments cannot be counted directly). Where payment is taken at ' +
  'booking these match cash received. Anything billed but not yet settled is ' +
  'listed under Outstanding rather than omitted.';

export function renderRevenueEmail(r: Extract<RevenueReport, { status: 'ok' }>): {
  subject: string; text: string; html: string;
} {
  const { period, lines, total, totalNet, totalTax, invoiceCount, outstanding } = r;
  const subject = `${site.name} — revenue for ${period.label} — ${money(total)}`;

  const avg = invoiceCount ? Math.round(total / invoiceCount) : 0;

  /* ---- plain text ---- */
  const nameW = Math.max(12, ...lines.map((l) => l.name.length));
  const t: string[] = [];
  t.push(`${site.name} — monthly revenue`);
  t.push(period.label);
  t.push('='.repeat(46));
  t.push('');

  if (!lines.length) {
    t.push('No invoices were closed in this period.');
  } else {
    t.push('BY PRACTITIONER');
    t.push('');
    t.push(`${'Practitioner'.padEnd(nameW)}  ${'Invoices'.padStart(8)}  ${'Revenue'.padStart(12)}`);
    t.push(`${'-'.repeat(nameW)}  ${'-'.repeat(8)}  ${'-'.repeat(12)}`);
    for (const l of lines) {
      t.push(`${l.name.padEnd(nameW)}  ${String(l.invoices).padStart(8)}  ${money(l.cents).padStart(12)}`);
    }
    t.push(`${'-'.repeat(nameW)}  ${'-'.repeat(8)}  ${'-'.repeat(12)}`);
    t.push(`${'Total'.padEnd(nameW)}  ${String(invoiceCount).padStart(8)}  ${money(total).padStart(12)}`);
  }

  t.push('');
  t.push('PRACTICE TOTALS');
  t.push(`  Revenue (incl. tax)   ${money(total)}`);
  t.push(`  Net of tax            ${money(totalNet)}`);
  t.push(`  Tax                   ${money(totalTax)}`);
  t.push(`  Invoices closed       ${invoiceCount}`);
  t.push(`  Average invoice       ${money(avg)}`);
  t.push('');
  t.push(`  Outstanding           ${money(outstanding.cents)} across ${outstanding.count} invoice(s)`);
  t.push('    (issued this period, not yet closed)');
  t.push('');
  t.push('-'.repeat(46));
  t.push(...wrap(BASIS));
  t.push('');
  t.push(...wrap(
    'Cliniko → Reports → Payment summary is the cash-basis equivalent if ' +
    'you ever need to reconcile these figures against payments directly.'
  ));

  /* ---- html ---- */
  /* Colour is set explicitly on every cell rather than inherited. iOS Mail and
   * Gmail detect bare numbers as phone numbers and restyle them as blue links —
   * which turns an invoice count into something that looks tappable and, worse,
   * makes the figures look like they mean something they do not. */
  const ink = 'color:#1c2733;';
  const td = `padding:8px 12px;border-bottom:1px solid #e6ebf1;${ink}`;
  const num = td + 'text-align:right;font-variant-numeric:tabular-nums;';
  const NO_DETECT =
    '<style>a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}' +
    '.rev td,.rev th{color:#1c2733;}</style>';
  const rows = lines.length
    ? lines.map((l) => `<tr><td style="${td}">${esc(l.name)}</td>` +
        `<td style="${num}">${l.invoices}</td>` +
        `<td style="${num}font-weight:600;">${money(l.cents)}</td></tr>`).join('')
    : `<tr><td style="${td}" colspan="3">No invoices were closed in this period.</td></tr>`;

  const html = `${NO_DETECT}<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1c2733;max-width:640px;margin:0 auto;padding:24px;">
<p style="margin:0 0 4px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5b6b7d;">${esc(site.name)}</p>
<h1 style="margin:0 0 2px;font-size:22px;">Revenue — ${esc(period.label)}</h1>
<p style="margin:0 0 20px;font-size:28px;font-weight:700;color:#24384f;">${money(total)}</p>

<table class="rev" style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:22px;">
<thead><tr>
<th style="${td}text-align:left;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5b6b7d;">Practitioner</th>
<th style="${td}text-align:right;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5b6b7d;">Invoices</th>
<th style="${td}text-align:right;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#5b6b7d;">Revenue</th>
</tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr>
<td style="${td}font-weight:700;">Total</td>
<td style="${num}font-weight:700;">${invoiceCount}</td>
<td style="${num}font-weight:700;">${money(total)}</td>
</tr></tfoot>
</table>

<table class="rev" style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:22px;">
<tr><td style="${td}">Net of tax</td><td style="${num}">${money(totalNet)}</td></tr>
<tr><td style="${td}">Tax</td><td style="${num}">${money(totalTax)}</td></tr>
<tr><td style="${td}">Average invoice</td><td style="${num}">${money(avg)}</td></tr>
<tr><td style="${td}">Outstanding <span style="color:#5b6b7d;">(issued this period, not yet closed)</span></td>
    <td style="${num}">${money(outstanding.cents)} · ${outstanding.count}</td></tr>
</table>

<p style="font-size:12px;line-height:1.6;color:#5b6b7d;border-top:1px solid #e6ebf1;padding-top:14px;margin:0;">
${esc(BASIS)}<br><br>
Cliniko → Reports → Payment summary is the cash-basis equivalent if you ever need
to reconcile these figures against payments directly.
</p>
</div>`;

  return { subject, text: t.join('\n'), html };
}

/** Where the report goes. Defaults to the practice inbox; overridable so the
 *  recipient can change without a code deploy. Comma-separated. */
export function reportRecipients(): string[] {
  const raw = process.env.REVENUE_REPORT_TO?.trim() || 'info@westpeakwellness.com';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export async function sendRevenueReport(
  r: Extract<RevenueReport, { status: 'ok' }>
): Promise<{ ok: boolean; sent: string[]; detail?: string }> {
  const { subject, text, html } = renderRevenueEmail(r);
  const to = reportRecipients();
  const sent: string[] = [];
  let detail: string | undefined;

  for (const addr of to) {
    const res = await sendDetailed(addr, subject, text, html);
    if (res.ok) sent.push(addr);
    else detail ??= res.detail;
  }
  return { ok: sent.length > 0, sent, detail };
}

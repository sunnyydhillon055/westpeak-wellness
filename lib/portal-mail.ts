import { site } from '@/lib/site';

/* Transactional email.
 *
 * Resend, as a single REST call with no SDK — swapping providers means changing
 * this one file and nothing else. Returns false rather than throwing, because
 * every caller must give the same response whether or not mail was sent: a
 * delivery failure must not become a way to probe who has an account.
 */
async function send(
  to: string, subject: string, text: string, html?: string
): Promise<boolean> {
  return (await sendDetailed(to, subject, text, html)).ok;
}

/* The same call, reporting why it failed.
 *
 * `send` deliberately swallows the reason: on the password-reset path, telling
 * the caller anything is a way to probe who has an account. The revenue report
 * has no such constraint and the opposite need — it runs unattended once a
 * month, so a silent false would mean nobody finds out until someone notices
 * the email never came. */
export async function sendDetailed(
  to: string, subject: string, text: string, html?: string,
  opts?: { replyTo?: string }
): Promise<{ ok: boolean; detail?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL;
  if (!apiKey || !from) return { ok: false, detail: 'RESEND_API_KEY or PORTAL_FROM_EMAIL is not set' };

  /* Reply-to matters more than it looks. PORTAL_FROM_EMAIL is a sending address
   * on the verified subdomain and a reply to it reaches nobody. Cliniko's
   * confirmations fail in exactly this way — see the header of
   * lib/booking-mail.ts — so anything a human might answer must carry a
   * reply-to that lands somewhere a person reads. */
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to], subject, text,
        ...(html ? { html } : {}),
        ...(opts?.replyTo ? { reply_to: [opts.replyTo] } : {}),
      }),
    });
    if (res.ok) return { ok: true };
    return { ok: false, detail: `Resend HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : 'request failed' };
  }
}

export function mailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.PORTAL_FROM_EMAIL);
}

export async function sendResetLink(to: string, link: string, isNew: boolean): Promise<boolean> {
  const text = [
    isNew
      ? 'Someone asked to set a password for your Westpeak Wellness account.'
      : 'Someone asked to reset the password on your Westpeak Wellness account.',
    '',
    link,
    '',
    'The link works once and expires in 30 minutes. Using it cancels any other',
    'reset links for this account.',
    '',
    'If this was not you, you can ignore this email — nothing has changed, and',
    'no one can use this link without opening it from your inbox.',
    '',
    site.name,
  ].join('\n');

  return send(to, isNew ? 'Set your password' : 'Reset your password', text);
}

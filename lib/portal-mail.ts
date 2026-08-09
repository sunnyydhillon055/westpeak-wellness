import { site } from '@/lib/site';

/* Transactional email.
 *
 * Resend, as a single REST call with no SDK — swapping providers means changing
 * this one file and nothing else. Returns false rather than throwing, because
 * every caller must give the same response whether or not mail was sent: a
 * delivery failure must not become a way to probe who has an account.
 */
async function send(to: string, subject: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL;
  if (!apiKey || !from) return false;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    return res.ok;
  } catch {
    return false;
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

import { site } from '@/lib/site';

/* Sends the sign-in link.
 *
 * Resend is used because it is a single REST call with no SDK, which keeps this
 * working on the edge runtime. Swapping providers means changing this one
 * function — nothing else imports a mail API.
 *
 * Returns false rather than throwing: the caller must give the same response
 * whether or not mail was sent, so a delivery failure cannot be used to probe
 * who is on the allowlist.
 */
export async function sendLoginLink(to: string, link: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const text = [
    'Here is your sign-in link for the Westpeak Wellness client portal:',
    '',
    link,
    '',
    'It works once and expires in 30 minutes.',
    'If you did not request it, you can ignore this email — nothing has changed.',
    '',
    site.name,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Your sign-in link',
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

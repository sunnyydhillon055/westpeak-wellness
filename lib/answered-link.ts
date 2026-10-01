import { createHmac } from 'node:crypto';
import { site } from './site.ts';

/* "MARK ANSWERED", FROM THE ENQUIRY ALERT — 1 Oct 2026.
 *
 * Forty enquiries, handledAt on none of them: the median reply time on
 * /contact needs five measured replies and has never appeared, while about
 * thirty pages promise a reply within one business day. Replies happen in a
 * mail client, and nobody went back to /admin to press Done.
 *
 * So the practice alert carries a link per message. It is signed (an HMAC
 * of the message id under PORTAL_SECRET), so it names exactly one message and
 * cannot be edited to name another. Following it writes nothing: /admin shows
 * one button, and only that POST sets handled and handledAt. A link preview,
 * a mail scanner or a prefetch that follows every URL in an email therefore
 * cannot record a reply that has not happened. Old messages are not
 * back-filled; a timestamp that was not observed would be invented.
 */

const secret = () => process.env.PORTAL_SECRET ?? '';

export function answeredToken(id: string): string {
  return createHmac('sha256', `answered:${secret()}`).update(id).digest('hex').slice(0, 32);
}

/** Constant-time check. False whenever no secret is configured, since a
 *  token keyed on an empty string is a token anybody can compute. */
export function answeredValid(id: string, token: string): boolean {
  if (!secret() || !id || !token) return false;
  const expected = answeredToken(id);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

/** The link printed in the alert, or null when links cannot be signed. */
export function answeredLink(id: string): string | null {
  if (!secret()) return null;
  return `${site.domain}/admin?answered=${encodeURIComponent(id)}&t=${answeredToken(id)}#answered`;
}

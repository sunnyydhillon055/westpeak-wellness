/* Derives the portal cookie value from the access code.
 *
 * The cookie holds a SHA-256 of the code, never the code itself, so a stolen
 * cookie does not reveal what to tell anyone. Web Crypto is used because this
 * runs in middleware on the edge runtime, where Node's crypto is unavailable.
 *
 * This is a single shared access code, not per-client accounts. It genuinely
 * restricts access — the code lives in an environment variable and is compared
 * on the server, so nothing secret is ever sent to the browser — but everyone
 * who has it has the same access, and revoking it means rotating it for all.
 */
const SALT = 'westpeak-portal-v1:';

export async function portalToken(code: string): Promise<string> {
  const bytes = new TextEncoder().encode(SALT + code);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Length-independent comparison, so timing does not leak how much matched. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const PORTAL_COOKIE = 'wp_portal';

/* Email-based access for the client portal.
 *
 * Flow: the client types their email; if it is on the allowlist they are sent a
 * one-click link; the link carries an HMAC-signed token that the server
 * verifies and exchanges for a session cookie.
 *
 * Two properties worth stating plainly, because they are the reason this is
 * better than a shared code:
 *
 *   REVOCATION IS IMMEDIATE. The session cookie holds the signed email, and it
 *   is re-checked against the allowlist on every request. Remove someone from
 *   PORTAL_ALLOWED_EMAILS and their existing cookie stops working at once —
 *   there is no session to expire and no code to rotate for everyone else.
 *
 *   IT DOES NOT CONFIRM WHO IS A CLIENT. The enter page returns the same
 *   "check your email" response whether or not the address is on the list. For
 *   a counselling practice that matters: an endpoint that answers "is this
 *   person a client of yours?" leaks clinical information to anyone who can
 *   type an email address.
 *
 * All crypto is Web Crypto so it runs in middleware on the edge runtime.
 */

export const PORTAL_COOKIE = 'wp_portal';
const ENC = new TextEncoder();

/** Trim + lowercase. Emails are case-insensitive in practice and clients will
 *  type them inconsistently; the allowlist must not care. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function allowedEmails(): string[] {
  return (process.env.PORTAL_ALLOWED_EMAILS ?? '')
    .split(/[,\s]+/)
    .map(normalizeEmail)
    .filter(Boolean);
}

/* Sentinel identity for the legacy shared-code path. It is not a real address
 * and is never emailed; it exists so both sign-in routes produce the same kind
 * of session. Accepted only while PORTAL_ACCESS_CODE is set, so deleting that
 * variable revokes code-based sessions on the next request, exactly as removing
 * an address revokes an email one. */
export const SHARED_CODE_IDENTITY = 'shared-code@westpeak.invalid';

export function isAllowed(email: string): boolean {
  const e = normalizeEmail(email);
  if (e === SHARED_CODE_IDENTITY) return Boolean(process.env.PORTAL_ACCESS_CODE);
  const list = allowedEmails();
  return list.length > 0 && list.includes(e);
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw', ENC.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const s = btoa(String.fromCharCode(...view));
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload: string, secret: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await key(secret), ENC.encode(payload));
  return b64url(sig);
}

/** Length-independent compare, so timing does not reveal how much matched. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---- Magic-link tokens: short-lived, single purpose -------------------- */

const LINK_TTL_MS = 30 * 60 * 1000; // 30 minutes

export async function createLoginToken(email: string, secret: string): Promise<string> {
  const payload = `${normalizeEmail(email)}|${Date.now() + LINK_TTL_MS}`;
  const body = b64url(ENC.encode(payload));
  return `${body}.${await sign(payload, secret)}`;
}

export async function readLoginToken(
  token: string,
  secret: string
): Promise<string | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  let payload: string;
  try {
    payload = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }
  if (!safeEqual(sig, await sign(payload, secret))) return null;

  const [email, expiry] = payload.split('|');
  if (!email || !expiry || Number(expiry) < Date.now()) return null;
  return email;
}

/* ---- Session cookie: the signed email, re-checked on every request ------ */

export async function createSession(email: string, secret: string): Promise<string> {
  const e = normalizeEmail(email);
  return `${b64url(ENC.encode(e))}.${await sign(`session:${e}`, secret)}`;
}

/** Returns the email if the signature holds AND the address is still allowed. */
export async function readSession(
  cookie: string | undefined,
  secret: string
): Promise<string | null> {
  if (!cookie) return null;
  const [body, sig] = cookie.split('.');
  if (!body || !sig) return null;
  let email: string;
  try {
    email = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }
  if (!safeEqual(sig, await sign(`session:${email}`, secret))) return null;
  // Re-checked every request: removing someone from the list logs them out now.
  if (!isAllowed(email)) return null;
  return email;
}

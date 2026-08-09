/* Cryptography for password-reset links.
 *
 * Sessions are NextAuth's job — this file used to carry a parallel cookie and
 * magic-link implementation from before that migration, which has been removed.
 * Two session systems in one security-sensitive module is an invitation to wire
 * up the wrong one, and the dead half had no CSRF handling or role checks.
 *
 * What remains is deliberately narrow: hashing helpers, a constant-time
 * comparison, and the signed reset token. It decides nothing about who is
 * allowed — that lives in lib/clients.ts and the signIn callback in auth.ts.
 *
 * Web Crypto throughout, so it runs in any runtime the app uses.
 */

const ENC = new TextEncoder();
const LINK_TTL_MS = 30 * 60 * 1000;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw', ENC.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
}

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return btoa(String.fromCharCode(...view))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(s: string): string | null {
  try {
    return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }
}

async function sign(payload: string, secret: string): Promise<string> {
  return b64url(await crypto.subtle.sign('HMAC', await key(secret), ENC.encode(payload)));
}

/** Length-independent compare, so timing does not reveal how much matched. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---- Password-reset tokens --------------------------------------------- */

/* Single-use without a database.
 *
 * An HMAC token is replayable until it expires, which for a password reset is
 * not good enough: a link sitting in a mailbox, or in a forwarded email, would
 * keep working. Binding it to a fingerprint of the CURRENT credential fixes
 * that statelessly — the moment the password changes, the fingerprint changes,
 * and every outstanding link for that account stops validating. Using a link
 * spends it, and requesting a second link does not invalidate the first until
 * one of them is actually used.
 *
 * `fingerprint` is derived from the stored hash by the caller, never the hash
 * itself, so a reset URL cannot be worked backwards into the credential.
 */
export async function createResetToken(
  email: string, secret: string, fingerprint: string
): Promise<string> {
  const payload = `reset|${normalizeEmail(email)}|${fingerprint}|${Date.now() + LINK_TTL_MS}`;
  return `${b64url(ENC.encode(payload))}.${await sign(payload, secret)}`;
}

export async function readResetToken(
  token: string, secret: string
): Promise<{ email: string; fingerprint: string } | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const payload = unb64url(body);
  if (!payload) return null;
  if (!safeEqual(sig, await sign(payload, secret))) return null;

  const [kind, email, fingerprint, expiry] = payload.split('|');
  if (kind !== 'reset' || !email || !expiry) return null;
  if (Number(expiry) < Date.now()) return null;
  return { email, fingerprint: fingerprint ?? '' };
}

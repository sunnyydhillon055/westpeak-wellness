/* Signed sign-in links and session cookies for the portal and the admin area.
 *
 * This module does cryptography only — it never decides who is allowed. That
 * question needs the stored allowlist, which lives in lib/portal-store.ts and
 * cannot be read from edge middleware, so the split is deliberate:
 *
 *   middleware  → is this cookie one we issued, for this area?   (no I/O)
 *   page/route  → is this person still allowed?                  (reads store)
 *
 * Doing it the other way round would put a blob fetch in front of every request
 * to the site. Doing only the first would leave revocation to cookie expiry.
 * Both layers are required, and both are enforced.
 *
 * All crypto is Web Crypto so the middleware half runs on the edge runtime.
 */

export const PORTAL_COOKIE = 'wp_portal';
export const ADMIN_COOKIE = 'wp_admin';

export type Scope = 'client' | 'admin';

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

/* ---- Magic-link tokens ------------------------------------------------- */

/* The scope sits inside the signed payload, so a link mailed to a client can
 * never be redeemed for an admin session even if the URL is altered. */
export async function createLoginToken(
  email: string, secret: string, scope: Scope
): Promise<string> {
  const payload = `${scope}|${normalizeEmail(email)}|${Date.now() + LINK_TTL_MS}`;
  return `${b64url(ENC.encode(payload))}.${await sign(payload, secret)}`;
}

export async function readLoginToken(
  token: string, secret: string, scope: Scope
): Promise<string | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const payload = unb64url(body);
  if (!payload) return null;
  if (!safeEqual(sig, await sign(payload, secret))) return null;

  const [tokenScope, email, expiry] = payload.split('|');
  if (tokenScope !== scope) return null;
  if (!email || !expiry || Number(expiry) < Date.now()) return null;
  return email;
}

/* ---- Session cookies --------------------------------------------------- */

export async function createSession(
  email: string, secret: string, scope: Scope
): Promise<string> {
  const e = normalizeEmail(email);
  return `${b64url(ENC.encode(`${scope}:${e}`))}.${await sign(`session:${scope}:${e}`, secret)}`;
}

/** Returns the email if the cookie is one we issued for this scope. Says
 *  nothing about whether that person is still allowed — callers must check the
 *  allowlist (clients) or the admin list. */
export async function readSession(
  cookie: string | undefined, secret: string, scope: Scope
): Promise<string | null> {
  if (!cookie) return null;
  const [body, sig] = cookie.split('.');
  if (!body || !sig) return null;
  const payload = unb64url(body);
  if (!payload) return null;

  const sep = payload.indexOf(':');
  if (sep < 0) return null;
  const cookieScope = payload.slice(0, sep);
  const email = payload.slice(sep + 1);
  if (cookieScope !== scope || !email) return null;

  if (!safeEqual(sig, await sign(`session:${scope}:${email}`, secret))) return null;
  return email;
}

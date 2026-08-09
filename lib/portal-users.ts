import { put, get } from '@vercel/blob';
import { normalizeEmail, safeEqual } from '@/lib/portal-auth';

/* Password credentials for people who do not want to use Google.
 *
 * AUTHENTICATION IS SEPARATE FROM AUTHORIZATION, deliberately, and the two
 * stores reflect that:
 *
 *   portal/allowlist.json    — who is a client (authorization). Also satisfied
 *                              by Cliniko. This is what /admin edits.
 *   portal/credentials.json  — how someone proves they are themselves, if they
 *                              are not using Google (authentication).
 *
 * Having a password does not make anyone a client, and being a client does not
 * require one. Google users never appear in this file at all — there is nothing
 * to store, which is the main reason to prefer it.
 *
 * PBKDF2-SHA256 rather than bcrypt/argon2: it is available through Web Crypto
 * in every runtime this app uses, where the native alternatives are not. 210k
 * iterations follows the current OWASP guidance for PBKDF2-HMAC-SHA256.
 */

const KEY = 'portal/credentials.json';
const ITERATIONS = 210_000;

export type Credential = {
  email: string;
  salt: string;
  hash: string;
  updatedAt: string;
};

type Store = { credentials: Credential[] };
const EMPTY: Store = { credentials: [] };

/* Write-through cache.
 *
 * Vercel Blob reads are NOT read-after-write consistent — a GET immediately
 * after a PUT can still return the previous object. That is fine for the client
 * allowlist, where a few seconds of staleness costs nothing, and not fine here:
 * a password reset writes a credential and must then be able to verify it, and
 * a single-use reset link is enforced by re-reading the credential it was
 * issued against. Both were silently wrong without this.
 *
 * Holding the last written value makes a write immediately visible to the
 * process that made it, which is the case that matters — the reset, the
 * verification and the replay check all happen in one request.
 *
 * It does NOT make writes visible across serverless instances any faster. A
 * replay landing on a cold instance inside the propagation window could still
 * be accepted; closing that needs a strongly consistent store, which is noted
 * in ADMIN_NOTES.md rather than pretended away.
 */
let cache: { at: number; value: Store } | null = null;
const CACHE_MS = 60_000;

const ENC = new TextEncoder();

function toHex(b: ArrayBuffer): string {
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function derive(password: string, saltHex: string): Promise<string> {
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', ENC.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, keyMaterial, 256
  );
  return toHex(bits);
}

async function read(): Promise<Store> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const parsed = (await new Response(hit.stream).json()) as Partial<Store>;
    const value: Store = {
      credentials: Array.isArray(parsed.credentials) ? parsed.credentials : [],
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    // Never fall open: an unreadable credential store means nobody can sign in
    // with a password, not that anybody can.
    return EMPTY;
  }
}

async function write(store: Store): Promise<void> {
  // Cached before the round trip completes, so anything reading later in this
  // same request sees what was just written rather than the previous object.
  cache = { at: Date.now(), value: store };
  await put(KEY, JSON.stringify(store, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function setPassword(email: string, password: string): Promise<void> {
  const e = normalizeEmail(email);
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = toHex(saltBytes.buffer);
  const hash = await derive(password, salt);

  const store = await read();
  const rest = store.credentials.filter((c) => normalizeEmail(c.email) !== e);
  rest.push({ email: e, salt, hash, updatedAt: new Date().toISOString() });
  await write({ credentials: rest });
}

export async function clearPassword(email: string): Promise<void> {
  const e = normalizeEmail(email);
  const store = await read();
  await write({ credentials: store.credentials.filter((c) => normalizeEmail(c.email) !== e) });
}

/** Verifies a password. Runs the derivation even when there is no record, so a
 *  missing account and a wrong password take the same time. */
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const e = normalizeEmail(email);
  const store = await read();
  const rec = store.credentials.find((c) => normalizeEmail(c.email) === e);

  const salt = rec?.salt ?? '00000000000000000000000000000000';
  const candidate = await derive(password, salt);
  if (!rec) return false;
  return safeEqual(candidate, rec.hash);
}

export async function hasPassword(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  const store = await read();
  return store.credentials.some((c) => normalizeEmail(c.email) === e);
}

export async function listPasswordAccounts(): Promise<string[]> {
  return (await read()).credentials.map((c) => c.email).sort();
}

/* A short, non-reversible marker for the current credential.
 *
 * Reset tokens carry this rather than the hash, so a reset URL cannot be
 * worked backwards into anything useful — and because it changes when the
 * password does, using a link invalidates it and every other outstanding one
 * for that account. Accounts with no password yet get a stable marker, so a
 * first-time "set a password" link still works.
 */
export async function credentialFingerprint(email: string): Promise<string> {
  const e = normalizeEmail(email);
  const store = await read();
  const rec = store.credentials.find((c) => normalizeEmail(c.email) === e);
  const basis = rec ? `${rec.hash}:${rec.updatedAt}` : 'no-password-set';
  const digest = await crypto.subtle.digest('SHA-256', ENC.encode(`fp:${e}:${basis}`));
  return toHex(digest).slice(0, 24);
}

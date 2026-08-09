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
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;
    const parsed = (await new Response(hit.stream).json()) as Partial<Store>;
    return { credentials: Array.isArray(parsed.credentials) ? parsed.credentials : [] };
  } catch {
    // Never fall open: an unreadable credential store means nobody can sign in
    // with a password, not that anybody can.
    return EMPTY;
  }
}

async function write(store: Store): Promise<void> {
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

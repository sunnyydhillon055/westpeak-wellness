import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* One-time access codes for the client portal.
 *
 * Replaces "remember a password you set once and never used again" for people
 * who reach this a handful of times a year. The address is already the thing
 * that identifies them — lib/portal-store.ts authorises by email against
 * Cliniko and the client list — so a code sent to that address proves the same
 * fact a password does, without asking anyone to manage a credential.
 *
 * The existing password provider stays. This is an additional route in, not a
 * replacement, so nobody who already set one is locked out.
 *
 * SECURITY PROPERTIES, AND WHY EACH ONE IS HERE
 *
 *   Codes are stored as a SHA-256 hash. A leak of the blob must not hand
 *   somebody a working code for every pending sign-in.
 *
 *   Six digits with a 10-minute expiry and a 5-attempt cap. Six digits alone is
 *   only a million possibilities, which is trivially brute-forceable if you let
 *   someone guess indefinitely — the attempt cap is what makes the length safe,
 *   not the length itself.
 *
 *   Comparison is timing-safe. Comparing with === leaks how many leading digits
 *   were right.
 *
 *   Requesting a code NEVER reveals whether the address is a client. The route
 *   returns the same response either way; only a real client is actually sent
 *   anything. Otherwise this becomes a way to enumerate who is in therapy here,
 *   which is a far worse disclosure than most account-existence leaks.
 *
 *   A new request replaces any outstanding code, so a forwarded or shoulder-
 *   surfed older one stops working.
 */

const KEY = 'portal/otp.json';
const TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;
/* Enough to stop someone spraying the practice's own mail reputation, loose
 * enough that a client who mistypes their address twice is not locked out. */
const MIN_INTERVAL_MS = 45_000;

type Entry = { hash: string; expiresAt: number; attempts: number; issuedAt: number };
type Store = Record<string, Entry>;

/* Web Crypto, not node:crypto. auth.ts is bundled into the Edge middleware and
 * `node:crypto` is not available there — importing it fails the build with
 * UnhandledSchemeError. These APIs exist in both runtimes. */
async function sha(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Constant-time string compare. `===` returns early on the first differing
 *  character, which leaks how much of a guess was right. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Uniform 0..999999 from the CSPRNG. Rejection-sampled rather than taking a
 *  modulus, which would bias the low end of the range. */
function sixDigits(): string {
  const buf = new Uint32Array(1);
  let n: number;
  do {
    crypto.getRandomValues(buf);
    n = buf[0];
  } while (n >= 4_294_000_000);
  return String(n % 1_000_000).padStart(6, '0');
}

async function read(): Promise<Store> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return {};
    const raw = (await new Response(hit.stream).json()) as Store;
    // Drop anything expired on every read, so the file cannot grow forever.
    const now = Date.now();
    const out: Store = {};
    for (const [k, v] of Object.entries(raw ?? {})) {
      if (v && typeof v.expiresAt === 'number' && v.expiresAt > now) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

async function write(store: Store): Promise<void> {
  await put(KEY, JSON.stringify(store), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export type IssueResult =
  | { ok: true; code: string }
  | { ok: false; reason: 'too-soon' | 'store-unavailable' };

/** Creates and stores a code. Sending it is the caller's job — this module does
 *  not know or care which channel is used. */
export async function issueCode(emailRaw: string): Promise<IssueResult> {
  const email = normalizeEmail(emailRaw);
  if (!email) return { ok: false, reason: 'store-unavailable' };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, reason: 'store-unavailable' };

  const store = await read();
  const existing = store[email];
  if (existing && Date.now() - existing.issuedAt < MIN_INTERVAL_MS) {
    return { ok: false, reason: 'too-soon' };
  }

  /* sixDigits() draws from the CSPRNG, not Math.random — Math.random is
   * predictable from prior draws, which for an auth code is the whole game. */
  const code = sixDigits();
  store[email] = {
    hash: await sha(`${email}:${code}`),
    expiresAt: Date.now() + TTL_MS,
    attempts: 0,
    issuedAt: Date.now(),
  };
  await write(store);
  return { ok: true, code };
}

/** True only on a live, unexpired, correct code. Consumes it either way it
 *  resolves — a code is single-use whether or not it succeeded. */
export async function verifyCode(emailRaw: string, codeRaw: string): Promise<boolean> {
  const email = normalizeEmail(emailRaw);
  const code = String(codeRaw ?? '').replace(/\D/g, '');
  if (!email || code.length !== 6) return false;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;

  const store = await read();
  const entry = store[email];
  if (!entry) return false;

  if (entry.attempts >= MAX_ATTEMPTS || entry.expiresAt < Date.now()) {
    delete store[email];
    await write(store);
    return false;
  }

  const ok = safeEqual(await sha(`${email}:${code}`), entry.hash);

  if (ok) {
    delete store[email];
  } else {
    entry.attempts += 1;
  }
  await write(store);
  return ok;
}

export const CODE_TTL_MINUTES = TTL_MS / 60_000;

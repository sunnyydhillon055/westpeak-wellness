import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* The client allowlist, stored so it can be edited from /admin without a
 * redeploy.
 *
 * Vercel Blob rather than a database: the payload is a few hundred bytes and is
 * read a handful of times a day. A JSON object read and rewritten whole is the
 * honest shape of the problem — introducing Postgres for a list of email
 * addresses would be infrastructure for its own sake.
 *
 * PRIVACY NOTE. This list is "who is receiving counselling", which is health
 * information about identifiable people. The store is private (no public URL)
 * and lives in Vercel's iad1 region — the United States. If the practice needs
 * Canadian residency for this, the durable fix is not to keep a second copy at
 * all: verify against Cliniko's patient list over its API, which already holds
 * the same information under whatever residency the practice chose there. See
 * ADMIN_NOTES.md.
 */

const KEY = 'portal/allowlist.json';

export type Allowlist = {
  emails: string[];
  updatedAt: string;
  updatedBy: string;
};

const EMPTY: Allowlist = { emails: [], updatedAt: '', updatedBy: '' };

/* Small in-process cache. Serverless instances are reused for a short while,
 * so this collapses repeat reads within one instance without ever holding a
 * stale list long enough to matter for revocation. */
let cache: { at: number; value: Allowlist } | null = null;
const TTL_MS = 15_000;

export async function readAllowlist(opts?: { fresh?: boolean }): Promise<Allowlist> {
  if (!opts?.fresh && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    // A private blob has no fetchable URL — its downloadUrl 403s without a
    // signed token — so the read goes through the SDK, which authenticates with
    // BLOB_READ_WRITE_TOKEN. Returns null when the object does not exist yet,
    // which is the normal state before the first save.
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return EMPTY;

    const parsed = (await new Response(hit.stream).json()) as Partial<Allowlist>;
    const value: Allowlist = {
      emails: Array.isArray(parsed.emails) ? parsed.emails.map(normalizeEmail).filter(Boolean) : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      updatedBy: typeof parsed.updatedBy === 'string' ? parsed.updatedBy : '',
    };
    cache = { at: Date.now(), value };
    return value;
  } catch {
    // A read failure must not open the gate. Fall back to the last known list,
    // or to empty — never to "allow".
    return cache?.value ?? EMPTY;
  }
}

export async function writeAllowlist(emails: string[], updatedBy: string): Promise<Allowlist> {
  const clean = Array.from(
    new Set(emails.map(normalizeEmail).filter((e) => /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e)))
  ).sort();

  const value: Allowlist = {
    emails: clean,
    updatedAt: new Date().toISOString(),
    updatedBy: normalizeEmail(updatedBy),
  };

  await put(KEY, JSON.stringify(value, null, 2), {
    access: 'private',         // must match the store's access mode
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });

  cache = { at: Date.now(), value };
  return value;
}

/** Env var + stored list, combined. The env var stays supported so the portal
 *  does not break for anyone configured before /admin existed. */
export async function isClientAllowed(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  if (!e) return false;

  const fromEnv = (process.env.PORTAL_ALLOWED_EMAILS ?? '')
    .split(/[,\s]+/).map(normalizeEmail).filter(Boolean);
  if (fromEnv.includes(e)) return true;

  const { emails } = await readAllowlist();
  return emails.includes(e);
}

/** Owner accounts. Deliberately an env var, not the editable list: an admin
 *  must not be able to lock themselves out — or promote a client — through the
 *  same form that manages clients. */
export function isAdmin(email: string): boolean {
  const admins = (process.env.PORTAL_ADMIN_EMAILS ?? '')
    .split(/[,\s]+/).map(normalizeEmail).filter(Boolean);
  return admins.length > 0 && admins.includes(normalizeEmail(email));
}

import { put, get } from '@vercel/blob';
import { normalizeEmail } from '@/lib/portal-auth';

/* Client records.
 *
 * Replaces the flat list of email addresses. A practice needs to know who
 * someone is, not just that an address is permitted — and "no longer a client"
 * is a different state from "never was one", which a list of strings cannot
 * express.
 *
 * WHAT IS DELIBERATELY NOT HERE
 *
 * No bookings, no session history, no clinical anything. Cliniko is the record
 * for appointments; a second copy here would be permanently out of sync with it
 * and would put clinical information in a US-region store for no benefit. The
 * admin screen links to Cliniko for that rather than pretending to hold it.
 *
 * `note` is for administrative context only — "prefers evenings", "referred by
 * Dr X". It is visible to anyone who reaches /admin and it belongs in Cliniko
 * if it is clinical. The field label says so.
 *
 * CONCURRENCY. Two administrators editing at once would otherwise silently
 * overwrite each other, and the losing edit would look like it saved. Every
 * write carries the version it was based on; a stale write is refused rather
 * than applied.
 */

const KEY = 'portal/clients.json';
const LEGACY_KEY = 'portal/allowlist.json';

export type ClientStatus = 'active' | 'paused' | 'former';

export type ClientRecord = {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
  note?: string;
  addedAt: string;
  updatedAt: string;
  /** Where the record came from. Absent means added by hand before the Cliniko
   *  sync existed, and is treated as 'manual'. Provenance matters because the
   *  sync must never overwrite a decision an administrator made deliberately —
   *  see lib/cliniko-sync.ts. */
  source?: 'cliniko' | 'manual';
};

export type ClientBook = {
  clients: ClientRecord[];
  version: number;
  updatedAt: string;
  updatedBy: string;
};

const EMPTY: ClientBook = { clients: [], version: 0, updatedAt: '', updatedBy: '' };

/* Vercel Blob reads are not read-after-write consistent — see ADMIN_NOTES.md.
 *
 * Two separate things are held, and conflating them caused real data loss:
 *
 *   `cache`     — what a read returned. Expirable, and `fresh` skips it.
 *   `lastWrite` — what THIS process last wrote. Authoritative for a window,
 *                 and `fresh` must NOT skip it, because the blob may still be
 *                 serving the previous object.
 *
 * The bug: adding a client re-read with { fresh: true }, got the pre-write
 * state back, and wrote a list that no longer contained the client added
 * moments earlier. Two adds in quick succession lost the first one silently.
 * A stale read is a nuisance; a stale read used as the basis for a write is
 * data loss. */
let cache: { at: number; value: ClientBook } | null = null;
let lastWrite: { at: number; value: ClientBook } | null = null;
const CACHE_MS = 20_000;
const WRITE_AUTHORITY_MS = 90_000;

function newest(read: ClientBook): ClientBook {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) {
    // A write we made ourselves always beats whatever the blob is serving.
    return lastWrite.value.version >= read.version ? lastWrite.value : read;
  }
  return read;
}

export function newId(): string {
  return crypto.randomUUID().slice(0, 8);
}

function clean(rec: Partial<ClientRecord>): ClientRecord | null {
  const email = normalizeEmail(String(rec.email ?? ''));
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return null;
  const now = new Date().toISOString();
  return {
    id: rec.id || newId(),
    name: String(rec.name ?? '').trim().slice(0, 80),
    email,
    status: (['active', 'paused', 'former'] as const).includes(rec.status as ClientStatus)
      ? (rec.status as ClientStatus)
      : 'active',
    note: String(rec.note ?? '').trim().slice(0, 200) || undefined,
    addedAt: rec.addedAt || now,
    updatedAt: now,
    source: rec.source === 'cliniko' ? 'cliniko' : undefined,
  };
}

export async function readClients(opts?: { fresh?: boolean }): Promise<ClientBook> {
  if (lastWrite && Date.now() - lastWrite.at < WRITE_AUTHORITY_MS) return lastWrite.value;
  if (!opts?.fresh && cache && Date.now() - cache.at < CACHE_MS) return cache.value;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return EMPTY;

  try {
    const hit = await get(KEY, { access: 'private' });
    if (hit && hit.statusCode === 200 && hit.stream) {
      const parsed = (await new Response(hit.stream).json()) as Partial<ClientBook>;
      const value: ClientBook = {
        clients: (Array.isArray(parsed.clients) ? parsed.clients : [])
          .map((c) => clean(c))
          .filter((c): c is ClientRecord => c !== null),
        version: Number(parsed.version) || 0,
        updatedAt: String(parsed.updatedAt ?? ''),
        updatedBy: String(parsed.updatedBy ?? ''),
      };
      cache = { at: Date.now(), value };
      return newest(value);
    }

    // First run after the upgrade: adopt the old address list so nobody loses
    // access. Names are blank until someone fills them in — inventing them
    // would be worse than leaving them empty.
    const legacy = await get(LEGACY_KEY, { access: 'private' });
    if (legacy && legacy.statusCode === 200 && legacy.stream) {
      const old = (await new Response(legacy.stream).json()) as { emails?: string[] };
      const migrated = (old.emails ?? [])
        .map((e) => clean({ email: e }))
        .filter((c): c is ClientRecord => c !== null);
      if (migrated.length) {
        const value: ClientBook = {
          clients: migrated,
          version: 1,
          updatedAt: new Date().toISOString(),
          updatedBy: 'migrated from the address list',
        };
        cache = { at: Date.now(), value };
        return newest(value);
      }
    }
    return newest(EMPTY);
  } catch {
    // A read failure must never open the gate.
    return cache?.value ?? EMPTY;
  }
}

/** Refuses a write based on a stale version rather than silently clobbering. */
export async function writeClients(
  clients: ClientRecord[], updatedBy: string, basedOnVersion: number
): Promise<{ ok: true; book: ClientBook } | { ok: false; reason: 'conflict' }> {
  const current = await readClients({ fresh: true });
  if (current.version !== basedOnVersion) return { ok: false, reason: 'conflict' };

  const value: ClientBook = {
    clients: clients
      .map((c) => clean(c))
      .filter((c): c is ClientRecord => c !== null)
      .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: normalizeEmail(updatedBy),
  };

  cache = { at: Date.now(), value };
  lastWrite = { at: Date.now(), value };
  await put(KEY, JSON.stringify(value, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return { ok: true, book: value };
}

/** Only an active client may sign in. Paused and former are kept on the books
 *  deliberately — removing the record would lose the history of who they were,
 *  and re-adding later would look like a new person. */
export async function clientCanSignIn(email: string): Promise<boolean> {
  const e = normalizeEmail(email);
  const { clients } = await readClients();
  return clients.some((c) => c.email === e && c.status === 'active');
}

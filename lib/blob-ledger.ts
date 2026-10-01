import { put, get, BlobError, BlobPreconditionFailedError } from '@vercel/blob';
import { strongEtag } from '@/lib/blob-etag';

/* A COUNTER IS A READ-MODIFY-WRITE, AND TWO INSTANCES DO IT AT ONCE — 1 Oct 2026.
 *
 * lib/conversion-log.ts and lib/search-log.ts read a JSON tally, added one,
 * and wrote it back with a plain put(). On Vercel every request can land on
 * a different serverless instance, and /book fires scheduler_visible,
 * scheduler_interact and book_direct seconds apart, so two instances
 * incrementing the same file is the normal case, not the edge. Whichever
 * wrote second erased the other's increment, and nothing said so.
 *
 * Both stores also answered a "fresh" read with the instance's own last write
 * for 90 seconds (`lastWrite`). That was there because reads used to go
 * through the CDN cache; every read now bypasses it (test/blob-reads.test.mts),
 * so it no longer protects anything — and it made an instance compute its
 * next value from its own copy while another instance had moved the file on.
 *
 * This is the conditional write lib/inbound.ts already does, made generic:
 * read with the ETag, write with `ifMatch`, and on a refusal re-read and
 * re-apply the change. The change is a function of what was read, never a
 * value computed once, because retrying a stale value is the same lost
 * increment with extra steps.
 *
 * WHAT IS DIFFERENT FROM INBOUND
 *
 * Inbound's last attempt is unconditional: an enquiry is a person, and losing
 * one is worse than overwriting a concurrent row. For a tally the arithmetic
 * goes the other way — an unconditional write over a moved file erases every
 * increment that landed meanwhile to save one — so the retries are more,
 * jittered, and when they run out the one increment is dropped and logged.
 * The exception is the weak ETag (lib/blob-etag.ts): no conditional write can
 * ever succeed against one, so that write is unconditional, as everywhere.
 */

export type LedgerRead = { body: unknown; etag?: string } | null;
export type LedgerWrite = 'ok' | 'conflict';
/** What a write is conditional on: the ETag that was read, or the file not
 *  existing yet. Neither = unconditional (the weak-ETag case only). */
export type LedgerCondition = { ifMatch?: string; create?: boolean };

/** The two operations a ledger needs. A blob path in production
 *  (blobLedger), a Map in tests and on a deployment with no Blob token
 *  (memoryLedger). */
export interface LedgerIO {
  read(): Promise<LedgerRead>;
  /** Returns 'conflict' when the store refused because the file moved since
   *  that ETag was read, or appeared since it was found missing. */
  write(json: string, cond?: LedgerCondition): Promise<LedgerWrite>;
}

export function blobLedger(key: string): LedgerIO {
  return {
    async read() {
      const hit = await get(key, { access: 'private', useCache: false });
      if (!hit || hit.statusCode !== 200 || !hit.stream) return null;
      return { body: await new Response(hit.stream).json(), etag: hit.blob.etag };
    },
    async write(json, cond = {}) {
      try {
        await put(key, json, {
          access: 'private',
          contentType: 'application/json',
          addRandomSuffix: false,
          /* Creating: refuse if somebody else created it first. */
          allowOverwrite: !cond.create,
          cacheControlMaxAge: 0,
          ...(cond.ifMatch ? { ifMatch: cond.ifMatch } : {}),
        });
        return 'ok';
      } catch (e) {
        if (e instanceof BlobPreconditionFailedError) return 'conflict';
        /* The store reports a create over an existing file as an ordinary
           BlobError naming it; only that case is a lost race. */
        if (cond.create && e instanceof BlobError && /exist/i.test(e.message)) return 'conflict';
        throw e;
      }
    },
  };
}

/** One shared in-memory file with real ETag semantics. Two ledgers built on
 *  the same `cell` behave like two serverless instances on one blob. */
export function memoryLedger(cell: { json?: string; version: number } = { version: 0 }): LedgerIO {
  return {
    async read() {
      if (cell.json === undefined) return null;
      return { body: JSON.parse(cell.json), etag: `"v${cell.version}"` };
    },
    async write(json, cond = {}) {
      if (cond.create && cell.json !== undefined) return 'conflict';
      if (cond.ifMatch && cond.ifMatch !== `"v${cell.version}"`) return 'conflict';
      cell.version += 1;
      cell.json = json;
      return 'ok';
    },
  };
}

export type CasOptions = { attempts?: number; backoffMs?: number; label?: string };

/* Eight tries, each after a jittered wait that grows with the attempt. Three
   events a few seconds apart clear on the first or second; the bound exists so
   a store refusing every write for some other reason is not hammered. */
const ATTEMPTS = 8;
const BACKOFF_MS = 40;

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Applies `change` to the ledger's current content with compare-and-swap.
 * `parse` turns whatever is stored (or null when nothing is) into a value;
 * `change` returns the next value, or null to write nothing. Resolves to the
 * value written, or null when nothing was written — declined, or the retries
 * ran out, which is logged.
 */
export async function casUpdate<T>(
  io: LedgerIO,
  parse: (raw: unknown) => T,
  change: (current: T) => T | null,
  opts: CasOptions = {}
): Promise<T | null> {
  const attempts = opts.attempts ?? ATTEMPTS;
  const backoff = opts.backoffMs ?? BACKOFF_MS;
  const label = opts.label ?? 'ledger';
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const hit = await io.read();
    const next = change(parse(hit ? hit.body : null));
    if (next === null) return null;
    /* No file yet: create it, refused if another instance got there first.
       A weak ETag: no conditional write can ever pass, so write
       unconditionally rather than never again (lib/blob-etag.ts). */
    const guard = strongEtag(hit?.etag);
    if (hit?.etag && !guard) console.warn(`[${label}] weak ETag; writing unconditionally (lib/blob-etag.ts)`);
    const cond: LedgerCondition = !hit ? { create: true } : guard ? { ifMatch: guard } : {};
    const outcome = await io.write(JSON.stringify(next, null, 2), cond);
    if (outcome === 'ok') return next;
    if (attempt < attempts && backoff > 0) await pause(Math.random() * backoff * attempt);
  }
  console.warn(`[${label}] lost ${attempts} races in a row; this increment was dropped rather than overwrite the others`);
  return null;
}

import { api, headers } from '@/lib/cliniko';
import { readClients, writeClients, newId, type ClientRecord } from '@/lib/clients';
import { normalizeEmail } from '@/lib/portal-auth';

/* Cliniko -> client list.
 *
 * WHY, GIVEN isClientAllowed ALREADY CHECKS CLINIKO
 *
 * lib/portal-store.ts already falls through to a live Cliniko lookup, so a
 * patient could in principle already sign in. Three things were wrong with
 * relying on that alone:
 *
 *   1. It is invisible. /admin showed an empty client list while Cliniko held
 *      real patients, so the owner had no way to see who could actually get in.
 *   2. It fails closed and silently. If CLINIKO_API_KEY is unset or the API is
 *      down, clinikoHasPatient returns false and the person is told they are
 *      not a client -- which is indistinguishable from a real refusal.
 *   3. It is a network round trip on the sign-in path.
 *
 * Materialising the patients into the client list fixes all three: the list
 * becomes the durable record, the live lookup stays as a same-day fallback for
 * someone added to Cliniko since the last sync.
 *
 * ADDITIVE ONLY, DELIBERATELY
 *
 * The sync adds people and fills in blank names. It never changes a status and
 * never removes anyone. A client set to `former` or `paused` by hand is a
 * decision an administrator made; a nightly job that quietly flipped them back
 * to `active` because they still exist in Cliniko would be the worst kind of
 * bug -- it restores portal access to someone whose access was withdrawn on
 * purpose, and nobody would notice until it mattered.
 *
 * Absence from Cliniko likewise does not remove anyone. Patients get archived
 * for ordinary reasons and losing the record here would erase who they were.
 *
 * NO CLINICAL DATA. Same contract as lib/clients.ts: name, email, status.
 * Cliniko remains the record for appointments and everything clinical.
 */

export type SyncResult = {
  ok: boolean;
  added: number;
  namesFilled: number;
  skippedNoEmail: number;
  totalInCliniko: number;
  reason?: string;
};

type ClinikoPatient = {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  archived_at?: string | null;
};

/** Walks every page. Cliniko caps per_page at 100. */
async function fetchAllPatients(): Promise<ClinikoPatient[] | { error: string }> {
  const conn = api();
  if (!conn) return { error: 'CLINIKO_API_KEY is not set on this deployment' };

  const out: ClinikoPatient[] = [];
  let url: string | null = `https://api.${conn.shard}.cliniko.com/v1/patients?per_page=100`;

  /* Bounded rather than while(url). A pagination bug on either side would
   * otherwise spin until the function times out, and an unbounded loop against
   * someone else's API is not a thing to ship. 100 pages is 10,000 patients --
   * far beyond this practice, and a clear signal something is wrong if hit. */
  for (let page = 0; page < 100 && url; page++) {
    let res: Response;
    try {
      res = await fetch(url, { headers: headers(conn.key), cache: 'no-store' });
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'request failed' };
    }
    if (res.status === 401 || res.status === 403) return { error: 'Cliniko rejected the API key' };
    if (!res.ok) return { error: `Cliniko HTTP ${res.status}` };

    const body = (await res.json()) as {
      patients?: ClinikoPatient[];
      links?: { next?: string };
    };
    out.push(...(body.patients ?? []));
    url = body.links?.next ?? null;
  }
  return out;
}

export async function syncClientsFromCliniko(actor: string): Promise<SyncResult> {
  const patients = await fetchAllPatients();
  if ('error' in patients) {
    return { ok: false, added: 0, namesFilled: 0, skippedNoEmail: 0, totalInCliniko: 0, reason: patients.error };
  }

  const book = await readClients({ fresh: true });
  const byEmail = new Map(book.clients.map((c) => [c.email, c]));

  const next: ClientRecord[] = [...book.clients];
  let added = 0;
  let namesFilled = 0;
  let skippedNoEmail = 0;

  for (const p of patients) {
    /* Archived in Cliniko is not a client any more. Skipping them means an
     * archived patient is never ADDED; anyone already on the list stays, per
     * the additive-only rule above. */
    if (p.archived_at) continue;

    const email = normalizeEmail(String(p.email ?? ''));
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
      skippedNoEmail++;
      continue;
    }

    const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim();
    const existing = byEmail.get(email);

    if (!existing) {
      const rec: ClientRecord = {
        id: newId(),
        name,
        email,
        status: 'active',
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'cliniko',
      };
      next.push(rec);
      byEmail.set(email, rec);
      added++;
      continue;
    }

    // Fill a blank name, but never overwrite one somebody typed.
    if (!existing.name && name) {
      existing.name = name;
      namesFilled++;
    }
  }

  if (added === 0 && namesFilled === 0) {
    return { ok: true, added: 0, namesFilled: 0, skippedNoEmail, totalInCliniko: patients.length };
  }

  /* One retry on a version conflict. Two admins saving at the same moment is
   * rare; a nightly cron colliding with one is rarer still, but silently
   * dropping the sync would leave the list stale with no signal. */
  for (let attempt = 0; attempt < 2; attempt++) {
    const base = attempt === 0 ? book : await readClients({ fresh: true });
    const res = await writeClients(next, actor, base.version);
    if (res.ok) {
      return { ok: true, added, namesFilled, skippedNoEmail, totalInCliniko: patients.length };
    }
  }

  return {
    ok: false, added: 0, namesFilled: 0, skippedNoEmail, totalInCliniko: patients.length,
    reason: 'write conflict, another edit landed first; the next run will pick it up',
  };
}

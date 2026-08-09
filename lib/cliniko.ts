import { site } from '@/lib/site';

/* Optional: verify portal sign-ins against Cliniko's patient list.
 *
 * WHY THIS EXISTS. Without it the site keeps its own copy of "who is a client",
 * which is health information about identifiable people, in a US-region blob.
 * Cliniko already holds that list. Checking against it means the practice
 * management system stays the only place that knows, and the list-maintenance
 * job disappears: add someone in Cliniko and they can sign in; discharge them
 * and they cannot.
 *
 * IT IS ADDITIVE, NEVER SUBTRACTIVE. `isClientAllowed` treats Cliniko as one
 * more way to be allowed, not as the authority that overrides the others. That
 * is deliberate. Cliniko's documentation does not state that `email` is a
 * filterable field on the patients endpoint, and an outage, a rotated key or a
 * rate limit would otherwise lock every client out of the portal at once.
 * Failing this way round means the worst case is "Cliniko contributed nothing",
 * not "nobody can sign in".
 *
 * Run the connection test on /admin once a key is set — it reports exactly what
 * happened rather than making anyone guess.
 */

export type ClinikoResult =
  | { status: 'unconfigured' }
  | { status: 'found' }
  | { status: 'not-found' }
  | { status: 'bad-key' }
  | { status: 'no-shard' }
  | { status: 'unsupported-filter'; detail: string }
  | { status: 'error'; detail: string };

/* The shard lives in the API key's suffix (…-au1, …-ca1) and decides the host.
 * Sending a key to the wrong shard fails, so it is derived rather than
 * configured separately — one less thing to get out of step. */
function shardOf(key: string): string | null {
  const m = key.trim().match(/-([a-z]{2}\d+)$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Cliniko requires a User-Agent identifying the app and a contact address. */
function userAgent(): string {
  return `${site.name} website (${site.email})`;
}

export async function clinikoLookup(email: string): Promise<ClinikoResult> {
  const key = process.env.CLINIKO_API_KEY?.trim();
  if (!key) return { status: 'unconfigured' };

  const shard = shardOf(key);
  if (!shard) return { status: 'no-shard' };

  const url =
    `https://api.${shard}.cliniko.com/v1/patients` +
    `?q[]=${encodeURIComponent(`email:=${email.trim().toLowerCase()}`)}&per_page=1`;

  try {
    const res = await fetch(url, {
      headers: {
        // Basic auth: API key as the username, empty password.
        Authorization: `Basic ${btoa(`${key}:`)}`,
        Accept: 'application/json',
        'User-Agent': userAgent(),
      },
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403) return { status: 'bad-key' };
    if (res.status === 422 || res.status === 400) {
      return { status: 'unsupported-filter', detail: (await res.text()).slice(0, 200) };
    }
    if (!res.ok) return { status: 'error', detail: `HTTP ${res.status}` };

    const body = (await res.json()) as { patients?: unknown[] };
    const patients = Array.isArray(body.patients) ? body.patients : [];
    return patients.length > 0 ? { status: 'found' } : { status: 'not-found' };
  } catch (e) {
    return { status: 'error', detail: e instanceof Error ? e.message : 'request failed' };
  }
}

/** True only on a confident match. Every failure mode returns false and lets
 *  the other allowlist sources decide. */
export async function clinikoHasPatient(email: string): Promise<boolean> {
  return (await clinikoLookup(email)).status === 'found';
}

export function clinikoConfigured(): boolean {
  return Boolean(process.env.CLINIKO_API_KEY?.trim());
}

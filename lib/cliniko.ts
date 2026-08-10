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

/* ---------------------------------------------------------------------------
   Reminder preferences.

   Cliniko sends the reminders, so Cliniko is the only place a preference can
   actually take effect. Storing a choice on this site and leaving Cliniko
   untouched would produce a setting that appears to work and does nothing —
   the client picks "text me only", keeps getting emails, and learns that this
   practice's word is unreliable on exactly the surface where it should not be.

   So the portal writes through to the patient record:

     reminders_communication_channels   [1]=SMS  [2]=Email  [1,2]=both  []=none
     receives_confirmation_emails       booking confirmations, separately

   `reminder_type` also exists and is writable, but Cliniko's own docs mark it
   deprecated in favour of the channels array, so it is not used here.
   --------------------------------------------------------------------------- */

export type ReminderChannels = 'sms' | 'email' | 'both' | 'none';

const TO_CLINIKO: Record<ReminderChannels, number[]> = {
  sms: [1],
  email: [2],
  both: [1, 2],
  none: [],
};

export function channelsFromCliniko(v: unknown): ReminderChannels {
  const a = Array.isArray(v) ? v.map(Number) : [];
  const sms = a.includes(1);
  const email = a.includes(2);
  if (sms && email) return 'both';
  if (sms) return 'sms';
  if (email) return 'email';
  return 'none';
}

export type Api = { key: string; shard: string };

/** The configured account, or null when the key is missing or has no shard
 *  suffix. Exported so other Cliniko readers (the revenue report) resolve the
 *  host exactly the same way rather than re-deriving it. */
export function api(): Api | null {
  const key = process.env.CLINIKO_API_KEY?.trim();
  if (!key) return null;
  const shard = shardOf(key);
  return shard ? { key, shard } : null;
}

export function headers(key: string) {
  return {
    Authorization: `Basic ${btoa(`${key}:`)}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': userAgent(),
  };
}

export type ReminderPrefs = {
  channels: ReminderChannels;
  confirmations: boolean;
};

export type PrefsResult =
  | { status: 'unconfigured' }
  | { status: 'not-found' }
  | { status: 'error'; detail: string }
  | { status: 'ok'; patientId: string; prefs: ReminderPrefs };

/** Read the signed-in client's current preferences straight from Cliniko, so
 *  the form always opens showing what is actually set rather than a local copy
 *  that may have drifted. */
export async function readReminderPrefs(email: string): Promise<PrefsResult> {
  const a = api();
  if (!a) return { status: 'unconfigured' };

  const url =
    `https://api.${a.shard}.cliniko.com/v1/patients` +
    `?q[]=${encodeURIComponent(`email:=${email.trim().toLowerCase()}`)}&per_page=1`;

  try {
    const res = await fetch(url, { headers: headers(a.key), cache: 'no-store' });
    if (!res.ok) return { status: 'error', detail: `HTTP ${res.status}` };

    const body = (await res.json()) as { patients?: Record<string, unknown>[] };
    const p = body.patients?.[0];
    if (!p) return { status: 'not-found' };

    return {
      status: 'ok',
      patientId: String(p.id),
      prefs: {
        channels: channelsFromCliniko(p.reminders_communication_channels),
        confirmations: p.receives_confirmation_emails !== false,
      },
    };
  } catch (e) {
    return { status: 'error', detail: e instanceof Error ? e.message : 'request failed' };
  }
}

/** Write the preference back. Returns what Cliniko now holds rather than what
 *  was requested, so the UI reports the saved state and not an assumption. */
export async function writeReminderPrefs(
  email: string,
  next: ReminderPrefs
): Promise<PrefsResult> {
  const a = api();
  if (!a) return { status: 'unconfigured' };

  const found = await readReminderPrefs(email);
  if (found.status !== 'ok') return found;

  try {
    const res = await fetch(`https://api.${a.shard}.cliniko.com/v1/patients/${found.patientId}`, {
      method: 'PATCH',
      headers: headers(a.key),
      cache: 'no-store',
      body: JSON.stringify({
        reminders_communication_channels: TO_CLINIKO[next.channels],
        receives_confirmation_emails: next.confirmations,
      }),
    });
    if (!res.ok) return { status: 'error', detail: `HTTP ${res.status}` };

    const p = (await res.json()) as Record<string, unknown>;
    return {
      status: 'ok',
      patientId: found.patientId,
      prefs: {
        channels: channelsFromCliniko(p.reminders_communication_channels),
        confirmations: p.receives_confirmation_emails !== false,
      },
    };
  } catch (e) {
    return { status: 'error', detail: e instanceof Error ? e.message : 'request failed' };
  }
}

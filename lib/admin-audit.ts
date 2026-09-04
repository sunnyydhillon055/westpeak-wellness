import { put, get } from '@vercel/blob';

/* ============================================================================
   WHAT WAS DONE IN /admin, BY WHOM, AND WHEN
   ----------------------------------------------------------------------------
   The admin area can add and remove clients, change availability, reset a
   password, trigger a Cliniko sync, and — as of this change — permanently
   delete somebody's enquiry. None of it left a trace. A record that vanished
   was indistinguishable from a record that had never existed, and there was no
   way to answer "who removed this, and when" even for the person who did it.

   THIS IS NOT A SECURITY CONTROL AND SHOULD NOT BE MISTAKEN FOR ONE. Anyone
   who can reach these routes can also reach this store. It does not stop a bad
   actor and it is not evidence against one. What it is for is the ordinary
   case: two people share the admin login, something is missing, and the
   question is what happened rather than who to blame. That question currently
   has no answer at all, and most of the time it is the only question anyone
   asks.

   WHAT IS RECORDED AND WHAT IS DELIBERATELY NOT. The action, the actor's email,
   a short subject, and the time. Never the content of what changed. An audit
   log of deletions that quotes what was deleted has not deleted anything — it
   has moved it — which would make this file the exact liability the deletion
   was meant to remove.

   IT SWALLOWS ITS OWN FAILURES, on the same reasoning as lib/cron-health.ts: a
   log that can fail the action it is logging is worse than no log.
   ========================================================================= */

const KEY = 'ops/admin-audit.json';
const MAX_ENTRIES = 2000;

export type AuditEntry = {
  at: string;
  /** Who was signed in. An email, because that is what the session carries. */
  actor: string;
  /** Verb and object, e.g. "delete enquiry", "add client". */
  action: string;
  /** Enough to identify the thing, never enough to reconstruct it. */
  subject: string;
};

export async function readAudit(): Promise<AuditEntry[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const hit = await get(KEY, { access: 'private' });
    if (!hit || hit.statusCode !== 200 || !hit.stream) return [];
    const parsed = (await new Response(hit.stream).json()) as unknown;
    return Array.isArray(parsed) ? (parsed as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export async function recordAudit(entry: Omit<AuditEntry, 'at'>): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const current = await readAudit();
    const next = [
      ...current,
      {
        at: new Date().toISOString(),
        actor: entry.actor.slice(0, 120),
        action: entry.action.slice(0, 60),
        /* Clipped hard. The subject is a record id or a name, and the ceiling
           is what stops a caller accidentally logging a whole message body. */
        subject: entry.subject.slice(0, 120),
      },
    ].slice(-MAX_ENTRIES);
    await put(KEY, JSON.stringify(next, null, 2), {
      access: 'private', contentType: 'application/json',
      addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 0,
    });
  } catch {
    /* See the note at the top. */
  }
}

/** Newest first, for display. */
export async function recentAudit(limit = 40): Promise<AuditEntry[]> {
  return (await readAudit()).slice(-limit).reverse();
}

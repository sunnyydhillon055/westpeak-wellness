import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { readClients, writeClients, newId, type ClientRecord, type ClientStatus } from '@/lib/clients';
import { normalizeEmail } from '@/lib/portal-auth';
import { clearPassword } from '@/lib/portal-users';
import { recordAudit } from '@/lib/admin-audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* One row at a time.
 *
 * The previous version saved a whole textarea, which meant every edit rewrote
 * every record and a stray keystroke could remove someone silently. Each action
 * here names the person it affects, so the blast radius of a mistake is one
 * row, and the version check refuses a save built on a stale view rather than
 * quietly overwriting a colleague's edit.
 */
export async function POST(req: Request) {
  const session = await auth();
  const admin = session?.user?.email ?? '';
  if (!admin || !isAdmin(admin)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const form = await req.formData();
  const action = String(form.get('action') ?? '');
  const version = Number(form.get('version') ?? -1);
  const book = await readClients({ fresh: true });
  let next: ClientRecord[] = [...book.clients];
  const back = (q: string) => NextResponse.redirect(new URL(`/admin?${q}`, req.url), 303);

  if (action === 'add') {
    const email = normalizeEmail(String(form.get('email') ?? ''));
    const name = String(form.get('name') ?? '').trim();
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return back('c=bademail');
    if (next.some((c) => c.email === email)) return back('c=duplicate');
    const now = new Date().toISOString();
    next.push({
      id: newId(), name, email, status: 'active',
      note: String(form.get('note') ?? '').trim() || undefined,
      addedAt: now, updatedAt: now,
    });
  } else if (action === 'update') {
    const id = String(form.get('id') ?? '');
    const idx = next.findIndex((c) => c.id === id);
    if (idx < 0) return back('c=missing');
    next[idx] = {
      ...next[idx],
      name: String(form.get('name') ?? next[idx].name).trim(),
      status: String(form.get('status') ?? next[idx].status) as ClientStatus,
      note: String(form.get('note') ?? '').trim() || undefined,
    };
  } else if (action === 'remove') {
    const id = String(form.get('id') ?? '');
    const target = next.find((c) => c.id === id);
    if (!target) return back('c=missing');
    next = next.filter((c) => c.id !== id);
    // Removing the record without removing the credential would leave a
    // password behind for someone who is no longer on the books.
    try { await clearPassword(target.email); } catch { /* nothing to clear */ }
  } else {
    return back('c=unknown');
  }

  const res = await writeClients(next, admin, version >= 0 ? version : book.version);
  if (!res.ok) return back('c=conflict');
  /* Logged after the write succeeds, never before. An audit line for a change
     that was refused by the version check would be a record of something that
     did not happen, which is worse than no record. */
  await recordAudit({
    actor: admin,
    action: `client ${action}`,
    subject: String(form.get('email') ?? form.get('id') ?? ''),
  });
  return back(`c=${action}`);
}

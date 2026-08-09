import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeReminderPrefs, type ReminderChannels } from '@/lib/cliniko';

/* Save a client's reminder preference to Cliniko.
 *
 * The email comes from the session, never from the form. A client may only
 * change their own preferences, and accepting an address from the request body
 * would let anyone who is signed in edit anyone else's patient record simply by
 * changing a hidden field.
 *
 * Node runtime: Cliniko is reached with Basic auth over fetch and the response
 * is not cacheable. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID: ReminderChannels[] = ['sms', 'email', 'both', 'none'];

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.redirect(new URL('/signin?next=/client-portal', req.url), 303);
  }

  const form = await req.formData();
  const channels = String(form.get('channels') ?? '') as ReminderChannels;
  const confirmations = form.get('confirmations') === 'on';

  if (!VALID.includes(channels)) {
    return NextResponse.redirect(new URL('/client-portal?prefs=invalid', req.url), 303);
  }

  const result = await writeReminderPrefs(email, { channels, confirmations });

  /* Report what actually happened. "Saved" on an unconfigured key or a patient
     record that could not be found would be the same lie the write-through is
     there to avoid. */
  const status =
    result.status === 'ok' ? 'saved'
    : result.status === 'not-found' ? 'nomatch'
    : result.status === 'unconfigured' ? 'unconfigured'
    : 'error';

  return NextResponse.redirect(new URL(`/client-portal?prefs=${status}#reminders`, req.url), 303);
}

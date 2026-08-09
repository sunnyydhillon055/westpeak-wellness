import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Receives a lead-magnet signup.
 *
 * Forwards to NEXT_PUBLIC_FORM_ENDPOINT when one is configured. When it is
 * not, the submission is still accepted and the person still gets what they
 * asked for — the guide is a page, not an emailed attachment, so nothing is
 * actually withheld pending an email service.
 *
 * That is the deliberate design: the value is delivered on the page, and the
 * address is a bonus. A form that hands over nothing until an integration
 * exists would lose both the lead and the reader's goodwill.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const name = String(form.get('name') ?? '').trim();
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
    return NextResponse.redirect(new URL('/pricing?lead=err', req.url), 303);
  }

  if (endpoint) {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, name, source: 'coverage-guide' }),
      });
    } catch {
      // Never fail the user's request because a third party is down.
    }
  }

  return NextResponse.redirect(new URL('/pricing?lead=ok', req.url), 303);
}

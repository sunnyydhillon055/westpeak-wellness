import { NextResponse } from 'next/server';
import { issueCode, CODE_TTL_MINUTES } from '@/lib/portal-otp';
import { isClientAllowed } from '@/lib/portal-store';
import { sendDetailed, mailConfigured } from '@/lib/portal-mail';
import { normalizeEmail } from '@/lib/portal-auth';
import { site } from '@/lib/site';

/* Requests a one-time access code.
 *
 * ALWAYS RESPONDS THE SAME WAY. Whether the address belongs to a client, does
 * not exist, or was rate-limited, the caller gets { ok: true } and the same
 * message. This is stricter than the usual account-enumeration defence and it
 * has to be: confirming that an address is a client here confirms that a named
 * person is in counselling. That is health information, and leaking it through
 * a response-code difference would be worse than most password-reset leaks.
 *
 * The cost of that choice is that a client who typos their address gets a
 * cheerful "check your email" and no email. The sign-in copy says to check the
 * address and try again, which is the honest trade.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SAME_ANSWER = {
  ok: true,
  message: `If that address belongs to a client here, a ${''}code is on its way. It expires in ${CODE_TTL_MINUTES} minutes.`,
};

export async function POST(req: Request) {
  let email = '';
  try {
    const body = await req.json();
    email = normalizeEmail(String(body?.email ?? ''));
  } catch {
    return NextResponse.json(SAME_ANSWER);
  }

  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return NextResponse.json(SAME_ANSWER);

  /* Everything past here is best-effort and deliberately silent. Any failure
   * is logged for the practice and never surfaced to the caller. */
  try {
    if (!(await isClientAllowed(email))) {
      console.log('[portal-code] request for a non-client address — no code sent');
      return NextResponse.json(SAME_ANSWER);
    }

    const issued = await issueCode(email);
    if (!issued.ok) {
      console.log(`[portal-code] not issued: ${issued.reason}`);
      return NextResponse.json(SAME_ANSWER);
    }

    if (!mailConfigured()) {
      console.error('[portal-code] RESEND_API_KEY or PORTAL_FROM_EMAIL is not set — code generated but cannot be sent');
      return NextResponse.json(SAME_ANSWER);
    }

    const text =
`Your Westpeak Wellness access code is:

  ${issued.code}

It expires in ${CODE_TTL_MINUTES} minutes and can be used once.

If you did not ask for this, you can ignore it — nobody can reach your
portal without the code, and it stops working shortly.

Westpeak Wellness
${site.domain}`;

    const html =
`<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#22262b;max-width:460px;">
  <p style="margin:0 0 14px;font-size:15px;">Your Westpeak Wellness access code:</p>
  <p style="margin:0 0 16px;font-size:34px;letter-spacing:7px;font-weight:700;color:#1f3d4d;">${issued.code}</p>
  <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">It expires in ${CODE_TTL_MINUTES} minutes and can be used once.</p>
  <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">If you did not ask for this, ignore it — nobody can reach your portal without the code, and it stops working shortly.</p>
</div>`;

    const sent = await sendDetailed(email, 'Your Westpeak Wellness access code', text, html);
    if (!sent.ok) console.error('[portal-code] send failed:', sent.detail);
  } catch (e) {
    console.error('[portal-code] unexpected failure:', e instanceof Error ? e.message : e);
  }

  return NextResponse.json(SAME_ANSWER);
}

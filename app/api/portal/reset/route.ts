import { NextResponse } from 'next/server';
import { normalizeEmail, createResetToken, readResetToken } from '@/lib/portal-auth';
import { isClientAllowed, isAdmin } from '@/lib/portal-store';
import { setPassword, verifyPassword, credentialFingerprint, hasPassword } from '@/lib/portal-users';
import { sendResetLink } from '@/lib/portal-mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Two steps of the same flow, told apart by which field the form sent.
 *
 * REQUEST — the response is identical whether or not the address has an
 * account, and both paths take the same fixed time. On a counselling site an
 * endpoint that answers "does this person have an account here?" is a
 * confidentiality leak, not just an information leak.
 *
 * SET — the token carries a fingerprint of the credential it was issued
 * against. Changing the password changes the fingerprint, so a used link stops
 * working immediately, as does every other outstanding link for that account.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const secret = process.env.PORTAL_SECRET;

  if (form.has('token')) return applyReset(form, req, secret);

  const email = normalizeEmail(String(form.get('email') ?? ''));
  const settle = new Promise((r) => setTimeout(r, 700));

  // A reset is only offered to people who could sign in anyway. Otherwise this
  // becomes a way to discover whether an address is a client.
  const eligible = Boolean(email) && (isAdmin(email) || (await isClientAllowed(email)));

  if (secret && eligible) {
    const fingerprint = await credentialFingerprint(email);
    const token = await createResetToken(email, secret, fingerprint);
    const link = new URL(`/reset?t=${encodeURIComponent(token)}`, req.url).toString();
    await sendResetLink(email, link, !(await hasPassword(email)));
  }

  await settle;
  return NextResponse.redirect(new URL('/forgot?sent=1', req.url), 303);
}

async function applyReset(form: FormData, req: Request, secret?: string) {
  const token = String(form.get('token') ?? '');
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  const parsed = secret ? await readResetToken(token, secret) : null;
  if (!parsed) {
    return NextResponse.redirect(new URL('/reset?e=expired', req.url), 303);
  }
  if (password.length < 10) {
    return NextResponse.redirect(
      new URL(`/reset?t=${encodeURIComponent(token)}&e=short`, req.url), 303);
  }
  if (password !== confirm) {
    return NextResponse.redirect(
      new URL(`/reset?t=${encodeURIComponent(token)}&e=match`, req.url), 303);
  }

  // Still eligible? Someone removed from the client list between requesting a
  // link and using it must not be able to complete the reset.
  const stillAllowed = isAdmin(parsed.email) || (await isClientAllowed(parsed.email));
  if (!stillAllowed) {
    return NextResponse.redirect(new URL('/reset?e=expired', req.url), 303);
  }

  // This is what makes the link single-use: the fingerprint must still match
  // the credential the token was issued against.
  const current = await credentialFingerprint(parsed.email);
  if (current !== parsed.fingerprint) {
    return NextResponse.redirect(new URL('/reset?e=used', req.url), 303);
  }

  /* Confirm the write landed before telling anyone it did.
   *
   * An earlier version reported success unconditionally. A storage write that
   * quietly did nothing then left the old password working while the person had
   * been told to use a new one — the worst possible failure for this flow,
   * because it is silent on both sides. Reading back and re-verifying is the
   * only way to know, and a password reset is the right place to pay for it. */
  try {
    await setPassword(parsed.email, password);
    if (!(await verifyPassword(parsed.email, password))) {
      return NextResponse.redirect(new URL('/reset?e=failed', req.url), 303);
    }
  } catch {
    return NextResponse.redirect(new URL('/reset?e=failed', req.url), 303);
  }

  return NextResponse.redirect(new URL('/signin?reset=1', req.url), 303);
}

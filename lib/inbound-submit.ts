import { NextResponse } from 'next/server';
import { addInbound, type InboundKind } from '@/lib/inbound';
import { sendDetailed } from '@/lib/portal-mail';
import { checklistEmail, enquiryAck, waitlistAck, practiceAlert } from '@/lib/inbound-mail';
import { site } from '@/lib/site';

/* One submit path for all three inbound forms.
 *
 * ORDER IS THE WHOLE DESIGN. Store first, then notify. If Resend is down, the
 * key has expired, or a rate limit is hit, the person is still recorded and
 * still visible in /admin. The previous implementation had no store at all and
 * so had nothing to fall back to — a failed send was a lost person, silently.
 * Never reverse these two steps.
 *
 * The acknowledgement is also best-effort for the same reason. A submission is
 * accepted the moment it is written down; email is a courtesy on top, not the
 * transaction.
 */

/* Bots fill every field they find, including ones a human cannot see. A hidden
 * input named like something a form would plausibly contain catches the great
 * majority of automated submissions for the cost of one line, and — unlike a
 * CAPTCHA — costs a distressed human nothing. Anyone reaching a counselling
 * site should never be asked to prove they are not a robot. */
const HONEYPOT = 'company';

export type SubmitOptions = {
  kind: InboundKind;
  /** Fallback return path when the form does not name one. */
  redirectTo: string;
  /** Query key used to report the outcome, e.g. `sent` → ?sent=ok. */
  flag: string;
};

/* The form says which page it was on so the person lands back where they were
 * rather than on a generic thank-you. Validated as a same-site absolute path:
 * a redirect target taken from a request body is an open-redirect the moment
 * it is trusted, and `//evil.example` is a protocol-relative URL that looks
 * like a path. */
function safePath(v: string, fallback: string): string {
  return /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/.test(v) ? v : fallback;
}

export async function handleInbound(req: Request, o: SubmitOptions) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.redirect(new URL(`${o.redirectTo}?${o.flag}=err#form`, req.url), 303);
  }

  const returnTo = safePath(String(form.get('source') ?? '').trim(), o.redirectTo);
  const back = (state: string) =>
    NextResponse.redirect(new URL(`${returnTo}?${o.flag}=${state}#form`, req.url), 303);

  /* Silently accepted, deliberately. Telling a bot it was caught just teaches
   * whoever wrote it to stop filling the field. */
  if (String(form.get(HONEYPOT) ?? '').trim()) return back('ok');

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const name = String(form.get('name') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  const windows = String(form.get('windows') ?? '').trim();

  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return back('err');
  /* An enquiry with no message is a mis-click, not a message. The other two
   * kinds legitimately carry nothing but an address. */
  if (o.kind === 'enquiry' && message.length < 2) return back('err');

  /* Ticked box only. String comparison rather than truthiness, so a browser
   * that submits an unchecked box as an empty string cannot register consent. */
  const monthlyOptIn = String(form.get('monthly') ?? '') === 'yes';

  const item = await addInbound({
    kind: o.kind, name, email, message, windows, source: returnTo, monthlyOptIn,
  });
  if (!item) return back('err');

  /* Everything below this line is best-effort. The person is already saved. */
  const firstName = name.split(/\s+/)[0] ?? '';

  const ack =
    o.kind === 'lead' ? checklistEmail(firstName)
    : o.kind === 'waitlist' ? waitlistAck(firstName)
    : enquiryAck(firstName);

  await Promise.allSettled([
    sendDetailed(email, ack.subject, ack.text, ack.html, { replyTo: site.email }),
    (async () => {
      const alert = practiceAlert(item);
      /* Reply-to is the person who wrote in, so the practice can answer by
       * hitting reply rather than copying an address out of the body. */
      return sendDetailed(site.email, alert.subject, alert.text, alert.html, { replyTo: email });
    })(),
  ]);

  return back('ok');
}

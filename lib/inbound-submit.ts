import { NextResponse } from 'next/server';
import { addInbound, readInbound, annotateTriage, type InboundKind } from '@/lib/inbound';
import { triage, hasMailExchanger, withMx } from '@/lib/triage';
import { sendDetailed } from '@/lib/portal-mail';
import { checklistEmail, icbcEmail, startingEmail, enquiryAck, waitlistAck, practiceAlert } from '@/lib/inbound-mail';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { clientKey, rateCheck } from '@/lib/rate-limit';

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
  /* Where the record says it came from. Always the real page, so /admin can
     show which pages actually earn enquiries. */
  const source = safePath(String(form.get('source') ?? '').trim(), o.redirectTo);

  /* Where the person is sent afterwards, which is NOT always the same place.
   *
   * A form on /contact can bounce back to /contact and read ?sent=ok, because
   * /contact is rendered on demand anyway. The same form embedded sitewide
   * cannot: reading a query param inside a page opts it out of static
   * generation, and doing that to 94 prerendered pages to show one confirmation
   * banner is a bad trade. Those post to /message-sent instead, which is a
   * static page that says the same thing.
   *
   * Validated exactly like `source`. A redirect target taken from a request
   * body is an open redirect the moment it is trusted. */
  const returnTo = safePath(String(form.get('returnTo') ?? '').trim(), source);

  const back = (state: string) =>
    NextResponse.redirect(new URL(`${returnTo}?${o.flag}=${state}#form`, req.url), 303);

  const honeypot = String(form.get(HONEYPOT) ?? '');

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const name = String(form.get('name') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  const windows = String(form.get('windows') ?? '').trim();

  /* Optional callback details. See the note on `phone` in lib/inbound.ts for
   * why the practice accepts a number without publishing one.
   *
   * Kept as the person typed it, minus obvious padding. No formatting, no
   * country-code guessing, no validation beyond a length ceiling: a number
   * this practice will dial by hand once does not need to be parsed, and a
   * regex that rejects a valid Canadian number someone typed with an extension
   * costs a callback to save nothing. The ceiling exists only so a paste
   * accident cannot write an essay into the field. */
  /* Only a slug that names a real counsellor is kept. The field is hidden and
     therefore trivially forgeable, and a stored value that is not a real
     practitioner would put an unanswerable name in front of whoever reads the
     alert. */
  const askedFor = String(form.get('practitioner') ?? '').trim().slice(0, 60);
  const practitioner = practitioners.some((p) => p.slug === askedFor) ? askedFor : '';

  const phone = String(form.get('phone') ?? '').trim().slice(0, 40);
  const callWindow = String(form.get('callWindow') ?? '').trim().slice(0, 120);

  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return back('err');
  /* An enquiry with no message is a mis-click, not a message. The other two
   * kinds legitimately carry nothing but an address. */
  if (o.kind === 'enquiry' && message.length < 2) return back('err');

  /* Ticked box only. String comparison rather than truthiness, so a browser
   * that submits an unchecked box as an empty string cannot register consent. */
  const monthlyOptIn = String(form.get('monthly') ?? '') === 'yes';

  /* Which one-pager was asked for. Allow-listed rather than trusted, because
     this value selects which email gets sent and an unrecognised magnet must
     fall back to a real one rather than sending nothing at all. */
  const asked = String(form.get('magnet') ?? '').trim();
  const MAGNETS = new Set(['icbc-after-a-crash', 'starting-counselling']);
  const magnet = MAGNETS.has(asked) ? asked : 'coverage-checklist';

  /* How automated does this look? Synchronous signals only. See lib/triage.ts
     for what is deliberately NOT measured (names, IP addresses, geography).
     Scored before the store so the verdict is written with the record, using
     the store as it stood at the moment the submission arrived: "duplicate"
     and "burst" are claims about that instant and cannot be recomputed later.

     `fillMs` comes from <FormStamp />, which sets it on mount. A form posted
     without JavaScript sends nothing and is treated as neutral. */
  const stampedAt = Number(form.get('renderedAt'));
  const verdict = triage(
    {
      kind: o.kind, email, message, honeypot,
      fillMs: Number.isFinite(stampedAt) && stampedAt > 0 ? Date.now() - stampedAt : undefined,
    },
    (await readInbound()).items
  );

  /* How much has this source posted lately? Deliberately checked AFTER
     validation and BEFORE the store, so a malformed request costs nothing and
     a well-formed flood is counted exactly once each. See lib/rate-limit.ts
     for why the ceiling suppresses mail rather than refusing the person. */
  const rate = await rateCheck(await clientKey(req));
  if (rate === 'drop') return back('ok');

  const item = await addInbound({
    kind: o.kind, name, email, message, windows, phone, callWindow, source,
    monthlyOptIn, magnet, triage: verdict, practitioner,
  });
  if (!item) return back('err');

  /* A tripped honeypot is the one unambiguous case: a field no human can see
     was filled in. Stored so it is countable in /admin, and silently accepted
     so whoever wrote the bot is not taught to stop filling the field, but no
     mail is sent for it in either direction.

     Nothing else stops here. A `review` verdict is a chip in /admin, never a
     reason to withhold a message from a counsellor. */
  if (verdict.band === 'quarantine') return back('ok');

  /* Over the soft ceiling. The record is written, /admin shows it, and the
     person gets the same confirmation they would have got. The two emails are
     what is skipped, because those are the part that costs the practice its
     mail reputation and that nobody at this volume is reading anyway. */
  if (rate === 'throttle') return back('ok');

  /* Everything below this line is best-effort. The person is already saved. */
  const firstName = name.split(/\s+/)[0] ?? '';

  const ack =
    o.kind === 'lead'
      ? (magnet === 'icbc-after-a-crash' ? icbcEmail(firstName)
        : magnet === 'starting-counselling' ? startingEmail(firstName)
        : checklistEmail(firstName))
    : o.kind === 'waitlist' ? waitlistAck(firstName)
    : enquiryAck(firstName);

  /* Can this address receive mail at all? A network call, so it happens here.
     after the store, and fails open: a DNS timeout means "unknown", never
     "fake". See hasMailExchanger() for why a false answer skips only the
     acknowledgement and never the practice alert. */
  const mx = await hasMailExchanger(email);
  const finalVerdict = withMx(verdict, mx);

  await Promise.allSettled([
    /* No mail exchanger means the acknowledgement can only bounce. The person
       still reached the practice; they just cannot be written back to at this
       address, which is what the alert now says. */
    mx === false
      ? Promise.resolve()
      : sendDetailed(email, ack.subject, ack.text, ack.html, { replyTo: site.email }),
    finalVerdict === verdict ? Promise.resolve() : annotateTriage(item.id, finalVerdict),
    (async () => {
      const alert = practiceAlert({ ...item, triage: finalVerdict });
      /* Reply-to is the person who wrote in, so the practice can answer by
       * hitting reply rather than copying an address out of the body. */
      return sendDetailed(site.email, alert.subject, alert.text, alert.html, { replyTo: email });
    })(),
  ]);

  return back('ok');
}

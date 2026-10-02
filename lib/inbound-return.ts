/* WHERE A FORM SENDS THE PERSON BACK TO — split out 1 Oct 2026.
 *
 * The "None of these times work?" form on /book?with=savneet-singh posted
 * `returnTo=/book`, because safePath() rejects a query string, and the person
 * landed on a bare /book: both cards, the practice-wide calendar, and nothing
 * to say which counsellor they had just written to. The counsellor travels
 * as the form's own `practitioner` field, already validated against the
 * roster, so the return URL is rebuilt from that rather than by letting a
 * query string through the redirect check. Only the booking page reads
 * `?with=`; every other return path is unchanged.
 *
 * Pure, so test/inbound-return.test.mts can pin it. */

/** A same-site absolute path, or the fallback. A redirect target taken from a
 *  request body is an open redirect the moment it is trusted, and
 *  `//evil.example` is a protocol-relative URL that looks like a path. */
export function safePath(v: string, fallback: string): string {
  return /^\/(?!\/)[A-Za-z0-9\-._~!$&'()*+,;=:@%/]*$/.test(v) ? v : fallback;
}

/* A confirmation page that is static cannot read ?sent=, so it would show
 * "your message has arrived" to a person whose message was refused. Each such
 * page names its own static failure page here, and any state other than `ok`
 * goes there instead. /punjabi/sent was the case: from 25 Sep 2026 every
 * /punjabi post was refused (it sends no looking/where/timing) and landed on
 * a Punjabi heading saying the message had arrived. 1 Oct 2026. */
/* /message-sent joined it on 2 Oct 2026. The enquiry form on all seventeen
 * city hubs (app/online-counselling/[city]) sat on an ISR page that never
 * reads ?sent=, so a sent message showed the same empty form again, inviting
 * a second send, and a refused one showed nothing at all. The hubs now post
 * returnTo=/message-sent, and a refusal goes to /message-not-sent. */
export const FAILED_PAGE: Readonly<Record<string, string>> = {
  '/punjabi/sent': '/punjabi/not-sent',
  '/message-sent': '/message-not-sent',
};

/* WHICH RULE FAILED — 2 Oct 2026. The route knew (it counts the reason as
 * enquiry_refused) and redirected with a bare ?sent=err, so the form printed
 * one sentence covering every rule, and a failed Blob write, which is the
 * practice's fault, told the person to check their own email address. The
 * reason now travels as ?why=, from this fixed list only: it is a word the
 * server chose, never anything the person typed. */
export const WHY = ['email', 'detail', 'choices', 'repeated', 'store'] as const;
export type Why = (typeof WHY)[number];

/** The reason, when it is one of the five; null for anything else. */
export function whyOf(v: string | null | undefined): Why | null {
  return (WHY as readonly string[]).includes(v ?? '') ? (v as Why) : null;
}

/** The one sentence that says what to change, or that the fault was ours.
 *  `minWords` is lib/sentences.ts MIN_WORDS, passed in so this file stays
 *  import-free for the tests and the client bundle. */
export function whySentence(why: Why | null, minWords: number): string {
  switch (why) {
    case 'email':
      return 'The email address did not look complete. Please check it has an @ and a full domain, such as name@gmail.com.';
    case 'detail':
      return `The message was too short to answer. Please write at least two sentences, about ${minWords} words, on what you are looking for.`;
    case 'choices':
      return 'One of the three questions above the message was not answered. Please choose an option in each.';
    case 'repeated':
      return 'The same words were in more than one box. Please put your message in the message box only.';
    case 'store':
      return 'The fault was at our end: the message could not be saved. Nothing you wrote was wrong.';
    default:
      return `Please check the email address, answer the three questions, and write at least two sentences, about ${minWords} words, on what you are looking for.`;
  }
}

/* Failure pages that read ?why= and ?from= (rendered on request). A static
 * one, like /punjabi/not-sent, gets the bare path, exactly as before. */
const READS_WHY = new Set(['/message-not-sent']);

/** "/book?with=savneet-singh&sent=ok#form", or "/contact?sent=err&why=detail#form". */
export function returnUrl(
  path: string,
  flag: string,
  state: string,
  opts: {
    bookingPath: string;
    practitioner?: string;
    accepting: readonly string[];
    /** Which rule failed, for a state other than ok. */
    why?: Why | null;
    /** The page the form was on, so a failure page can link back to it. */
    source?: string;
  },
): string {
  const why = state !== 'ok' ? whyOf(opts.why) : null;
  if (state !== 'ok' && FAILED_PAGE[path]) {
    const failed = FAILED_PAGE[path];
    if (!READS_WHY.has(failed)) return failed;
    const q = new URLSearchParams();
    if (why) q.set('why', why);
    const from = opts.source ? safePath(opts.source, '') : '';
    if (from && from !== path) q.set('from', from);
    const s = q.toString();
    return s ? `${failed}?${s}` : failed;
  }
  const keep = path === opts.bookingPath && opts.practitioner && opts.accepting.includes(opts.practitioner);
  return `${path}?${keep ? `with=${encodeURIComponent(opts.practitioner!)}&` : ''}${flag}=${state}${why ? `&why=${why}` : ''}#form`;
}

/* WHAT THE PERSON TYPED, KEPT FOR THIS TAB — 2 Oct 2026. A native POST and a
 * 303 bring the form back empty, so every refusal cost the message. The form
 * keeps its fields in sessionStorage (this tab only, gone when it closes;
 * nothing leaves the browser) and restores them when the page says the send
 * failed. It is cleared once a send succeeds. */
export const DRAFT_KEY = 'wp-enquiry-draft';
export const DRAFT_FIELDS = ['name', 'email', 'looking', 'where', 'timing', 'message', 'phone', 'callWindow'] as const;
export type Draft = Partial<Record<(typeof DRAFT_FIELDS)[number], string>>;

/** A stored draft, parsed defensively: only the known fields, only strings,
 *  each capped. Anything else in storage is ignored. */
export function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== 'object') return null;
    const out: Draft = {};
    for (const k of DRAFT_FIELDS) {
      const f = (v as Record<string, unknown>)[k];
      if (typeof f === 'string' && f) out[k] = f.slice(0, 5000);
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

/** What the address bar says about the last send: the ?sent= state and the
 *  reason. Read in the browser, so a static page can restore a draft too. */
export function sendState(search: string): { sent: 'ok' | 'err' | null; why: Why | null } {
  const q = new URLSearchParams(search);
  const s = q.get('sent');
  return { sent: s === 'ok' || s === 'err' ? s : null, why: whyOf(q.get('why')) };
}

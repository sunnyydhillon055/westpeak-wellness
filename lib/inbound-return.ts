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

/** "/book?with=savneet-singh&sent=ok#form", or "/contact?sent=err#form". */
export function returnUrl(
  path: string,
  flag: string,
  state: string,
  opts: { bookingPath: string; practitioner?: string; accepting: readonly string[] },
): string {
  const keep = path === opts.bookingPath && opts.practitioner && opts.accepting.includes(opts.practitioner);
  return `${path}?${keep ? `with=${encodeURIComponent(opts.practitioner!)}&` : ''}${flag}=${state}#form`;
}

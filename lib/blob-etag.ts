/* WHY A CONDITIONAL WRITE CAN STOP WORKING FOREVER — 17 Sep 2026.
 *
 * Two stores here use compare-and-swap: the enquiry book (lib/inbound.ts) and
 * the cron health log (lib/cron-health.ts). Both read a blob with its ETag and
 * write it back with `ifMatch`, so a write that lands on top of somebody
 * else's is refused instead of erasing it. That part is right and stays.
 *
 * What was wrong is what an ETag can be. Vercel Blob returns a *weak*
 * validator for some objects — `W/"39cbf480…"` rather than `"39cbf480…"`. A
 * weak validator says "semantically the same content", not "byte for byte the
 * same", and If-Match is defined to use strong comparison only, so a weak tag
 * can NEVER satisfy it. Hand one to `ifMatch` and the write is refused. Retry
 * and it is refused again, because nothing changed — the file still carries
 * the weak tag that cannot match. The store is then frozen: readable, and
 * permanently unwritable, with the failure swallowed by the retry loop.
 *
 * That is not theory. On 17 Sep 2026 both stores were stuck:
 *
 *   inbound/messages.json   last written 6 Sep, weak ETag. Eleven days of
 *                           website enquiries were never recorded. They
 *                           reached the practice by alert mail, which is the
 *                           only reason this was survivable.
 *   ops/cron-health.json    last written 14 Sep, weak ETag. Every job kept
 *                           running and none could record it, so the watchdog
 *                           read three-day-old lines and emailed the owner
 *                           each morning that three jobs had stopped. They
 *                           had not. The alert log sat in a different blob
 *                           with a strong tag, so the alerts wrote fine —
 *                           which is how a healthy system emailed a false
 *                           alarm about itself once a day.
 *
 * THE RULE. A conditional write may only carry a strong validator. When the
 * store hands back a weak one there is no safe conditional write available, so
 * the caller must fall back to an unconditional one. Last-writer-wins for a
 * single cycle is a poor outcome; never writing again is a worse one, and it
 * is the one that hides.
 */

/** The ETag if it can be used with `ifMatch`, or undefined when it cannot.
 *  Undefined means "write unconditionally" — see the note above. */
export function strongEtag(etag: string | undefined | null): string | undefined {
  if (!etag) return undefined;
  const tag = etag.trim();
  /* W/"…" — weak. Also treat anything not quoted as unusable rather than
     guessing at a format the store did not promise. */
  if (/^W\//i.test(tag)) return undefined;
  if (!/^"[^"]+"$/.test(tag)) return undefined;
  return tag;
}

/** True when the store handed back a validator no conditional write can use. */
export function isWeakEtag(etag: string | undefined | null): boolean {
  return Boolean(etag) && strongEtag(etag) === undefined;
}

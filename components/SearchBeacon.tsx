'use client';

import { useEffect } from 'react';

/* Sends the submitted search term to be counted, once per query.
 *
 * `sendBeacon` rather than fetch: it is fire-and-forget, survives the page
 * being navigated away from immediately, and cannot delay anything. Nothing
 * reads the response and there is nothing in it to read.
 *
 * Renders nothing. See lib/search-log.ts for the privacy design — the short
 * version is that this contributes to a tally, not to a log, so no record of
 * "someone searched X" exists at any point.
 */
export default function SearchBeacon({ q }: { q: string }) {
  useEffect(() => {
    if (!q) return;
    const body = JSON.stringify({ q });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/search-log', new Blob([body], { type: 'application/json' }));
      } else {
        /* Older Safari. keepalive so it still completes if the visitor clicks
         * a result immediately, which is the common case. */
        void fetch('/api/search-log', {
          method: 'POST', body, keepalive: true,
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {});
      }
    } catch {
      /* Counting must never be able to break a search. */
    }
  }, [q]);

  return null;
}

'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { arriveDetail, arriveSeenKey } from '@/lib/book-arrive';

/* AN ARRIVAL ON /book, COUNTED ONCE PER SESSION — 3 Oct 2026.
 *
 * The calendar's own events (scheduler_open, interact, booked) had no
 * denominator: from 18 Aug the counter held 127 calendars seen and 0 booked,
 * and nothing said how many people reached /book at all. This fires
 * book_arrive once per session per counsellor named, with the detail the
 * server already worked out from ?with= (a roster slug or `none`); a bare
 * /book opened at #ask-for-a-time counts as `ask`. Counts only, like every
 * other event (lib/conversion-log.ts). Renders nothing. */
export default function BookArrive({ detail }: { detail: string }) {
  useEffect(() => {
    try {
      const d = arriveDetail(detail, window.location.hash);
      const key = arriveSeenKey(d);
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, '1');
      track('book_arrive', { detail: d });
    } catch {
      /* storage blocked: count nothing rather than count every reload */
    }
  }, [detail]);
  return null;
}

'use client';

import { track } from '@/lib/analytics';

/* The link that opens a counsellor's Cliniko calendar as its own page.
 *
 * Added to /book on 17 Sep 2026 beside the embedded frame, on the evidence
 * that 38 people interacted with the frame in a month and next to none
 * booked. This records which route people take, so the next decision about
 * the booking page can be made from a number rather than a guess: if the
 * direct link wins, the frame goes. */
export default function BookDirectLink({
  href, who, className, children,
}: { href: string; who: string; className: string; children: React.ReactNode }) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener"
      /* `who` is the detail the counter keeps (a roster slug, allow-listed
         server-side), so from 1 Oct 2026 this answers whose calendar was
         opened and not only that one was. */
      onClick={() => track('book_direct', { who, detail: who })}
    >
      {children}
    </a>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import LeadCapture from '@/components/LeadCapture';

/* THE ?lead= FLAG, READ IN THE BROWSER — 3 Oct 2026 (item 429).
 *
 * /api/lead sends a signup back to /pricing?lead=ok (or =err#form). The page
 * used to read that from searchParams on the server, which made /pricing
 * render on every request: it never carried the inlined first-paint CSS
 * (scripts/inline-css.mjs works on prerendered documents only) and its
 * `revalidate` did nothing. Read here instead, /pricing is a static document.
 * The page wraps this in <Suspense> with the plain form as the fallback, so
 * the prerendered HTML is the form a first visit sees anyway. */
export default function LeadCaptureFromQuery() {
  const lead = useSearchParams()?.get('lead');
  return <LeadCapture done={lead === 'ok'} failed={lead === 'err'} />;
}

'use client';

import Link from 'next/link';
import { site } from '@/lib/site-client';
import { track } from '@/lib/analytics';
import { bookClickDetail, withSlugOf } from '@/lib/conversion-detail-client';
import { ResultDays } from '@/components/NextConsultSlot';

/* The reflection tools (ToolShell's `gentle`): no next-day line under them. */
const GENTLE_TOOLS = ['stress-check', 'burnout-or-depression'];

/* Closing action on a tool result. Share is a Web Share sheet where the browser
 * supports it and a clipboard copy where it does not — no third-party buttons,
 * which on a counselling site would mean telling a social network that someone
 * read this page. */
/* `href` is the booking link for the service the result matched, worked out
 * by the server page with bookingFor() in lib/booking-cta.ts and passed down
 * (this is a client component and must not import the roster). A couples
 * result opens /book?with= the one counsellor who offers couples work rather
 * than a two-card page where one of the two cannot take it. Absent, the
 * button opens /book as before. 1 Oct 2026. */
export default function ResultCta({ tool, label, href }: { tool: string; label?: string; href?: string }) {
  async function share() {
    const url = window.location.href;
    const title = document.title;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        alert('Link copied.');
      }
      track('tool_share', { tool });
    } catch {
      /* dismissed */
    }
  }

  return (
    <div className="tool-cta">
      <Link
        className="btn btn--primary"
        href={href ?? site.bookingPath}
        onClick={() => track('book_click', { location: `tool:${tool}`, detail: bookClickDetail(`tool:${tool}`, withSlugOf(href)) })}
      >
        {label ?? 'Book a free 15-minute consultation'}
      </Link>
      <button type="button" className="btn btn--ghost" onClick={share}>
        Share this
      </button>
      <p className="tool-cta-note">Free · secure video · no obligation, and no sign-up to use this.</p>

      {/* Finishing a tool is the most qualified moment on this site. The
          empty box that held "ask instead" (removed in c400eb9) now says when
          the free call could actually be: the next open day with whoever the
          result's link names, or with each counsellor taking new clients when
          it names nobody, each day a link to her calendar. Days only, and
          nothing at all while unknown or when Cliniko cannot be read.
          15 Oct 2026. Not under the two reflection tools, which keep their
          gentle close. */}
      {!GENTLE_TOOLS.includes(tool) && (
        <ResultDays href={href} bookingPath={site.bookingPath} location="next-tool-result" />
      )}
    </div>
  );
}

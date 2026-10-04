'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';
import { bookClickDetail, withSlugOf } from '@/lib/conversion-detail-client';

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

      {/* Finishing a tool is the most qualified moment on this site, and until
          now the only thing offered here was the largest possible ask. Someone
          who has just worked out what therapy would cost them, or that their
          answers point at couples work, is warm — and may still not be ready to
          put a video call in the diary. */}
      <div className="tool-cta-ask">
      </div>
    </div>
  );
}

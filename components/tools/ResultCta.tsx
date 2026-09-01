'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';

/* Closing action on a tool result. Share is a Web Share sheet where the browser
 * supports it and a clipboard copy where it does not — no third-party buttons,
 * which on a counselling site would mean telling a social network that someone
 * read this page. */
export default function ResultCta({ tool, label }: { tool: string; label?: string }) {
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
        href={site.bookingPath}
        onClick={() => track('book_click', { location: `tool:${tool}` })}
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

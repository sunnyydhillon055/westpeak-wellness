'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track, LANDING_KEY } from '@/lib/analytics';
import { channelOf, isAssistantHost, referrerClass } from '@/lib/conversion-detail-client';

/* Page-level engagement signals that do not belong on any one component:
 * a 75% scroll marker, and outbound-link clicks. Both are passive listeners
 * attached once. */
export default function Analytics() {
  const pathname = usePathname();

  /* Did this visit come from an AI assistant? Counted once per page load,
     against the landing page, so /admin can say whether ChatGPT, Gemini,
     Claude, Perplexity or Copilot send anyone at all. Only the host is
     inspected and only a yes/no leaves the browser. A referrer is absent on
     most assistant hand-offs (they open links with no-referrer), so this is a
     floor on the true number, never a ceiling — and it is still the only
     first-party evidence there is. */
  useEffect(() => {
    try {
      const ref = document.referrer ? new URL(document.referrer).hostname : '';
      if (isAssistantHost(ref) && !sessionStorage.getItem('wp-ai-ref')) {
        sessionStorage.setItem('wp-ai-ref', '1');
        track('ai_referral', { host: ref, page: pathname ?? '' });
      }
      /* THE DENOMINATOR. The first page of a session, counted once, with the
         referrer reduced here to one class from a fixed list (google, bing,
         duckduckgo, ai, listing, none, other). Only the class leaves the
         browser — the host stays here. Without it a page's booking clicks
         sat against Search Console clicks from another window and another
         channel mix, and nothing at all for Bing, direct or the listings.
         1 Oct 2026. A rendering crawler runs this script too, and would
         inflate the very number this exists to be honest about. */
      const cls = referrerClass(ref, window.location.hostname);
      const linkChannel = channelOf(new URLSearchParams(window.location.search).get('utm_source'));
      if (!sessionStorage.getItem(LANDING_KEY) && !navigator.webdriver && !/bot|crawl|spider|slurp|headless|lighthouse/i.test(navigator.userAgent)) {
        /* Was '1'. Now the page and the one word that says how the visit
           arrived — the link's channel when it named one, else the referrer
           class — so a booking click or a confirmed booking later in the
           session can be credited to where the visit began (lib/analytics.ts,
           click_from and booked_from). Both halves were already sent on
           their own; this keeps them in the tab until a booking needs them.
           1 Oct 2026. */
        sessionStorage.setItem(LANDING_KEY, `${window.location.pathname}|${linkChannel ?? cls}`);
        track('landing', { detail: referrerClass(ref, window.location.hostname) });
      }
      /* WHICH KIND OF ORGANISATION'S LINK. A link the practice hands out —
         the Google Business Profile, a directory, a note to a family
         practice or an HR team — carries ?utm_source= naming the kind of
         place (CHANNELS in lib/conversion-detail-client.ts). Counted once per
         session against the landing page; a value not on the list is dropped
         here and never sent. This replaced the gbp-only counter of 26 Sep,
         whose history /admin folds into the gbp row. The parameter changes
         nothing else: the canonical tag strips it. 1 Oct 2026. */
      const channel = linkChannel;
      if (channel && !sessionStorage.getItem('wp-chan') && !(channel === 'gbp' && sessionStorage.getItem('wp-gbp'))) {
        sessionStorage.setItem('wp-chan', '1');
        track('channel_visit', { detail: channel });
      }
    } catch { /* never load-bearing */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const h = document.documentElement;
      const pct = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (pct >= 0.75) {
        fired = true;
        track('scroll_75', { page: pathname ?? '' });
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (/^https?:\/\//.test(href) && !href.includes(location.host)) {
        track('outbound_click', { href, page: pathname ?? '' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
    };
  }, [pathname]);

  return null;
}

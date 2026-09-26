'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

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
      const isAssistant = /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|gemini\.google\.com|bard\.google\.com|claude\.ai|anthropic\.com|perplexity\.ai|copilot\.microsoft\.com|you\.com|poe\.com|meta\.ai|mistral\.ai)$/i.test(ref);
      if (isAssistant && !sessionStorage.getItem('wp-ai-ref')) {
        sessionStorage.setItem('wp-ai-ref', '1');
        track('ai_referral', { host: ref, page: pathname ?? '' });
      }
      /* Visits from the Google Business Profile. Clicks on the profile's
         website button never appear in Search Console, so the profile's link
         carries ?utm_source=gbp and this counts it, once per session, against
         the landing page. The parameter changes nothing else: the canonical
         tag strips it and the page is the same page. 26 Sep 2026. */
      const utm = new URLSearchParams(window.location.search).get('utm_source');
      if (utm && /^gbp$/i.test(utm) && !sessionStorage.getItem('wp-gbp')) {
        sessionStorage.setItem('wp-gbp', '1');
        track('gbp_visit', { page: pathname ?? '' });
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

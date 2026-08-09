'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

/* Page-level engagement signals that do not belong on any one component:
 * a 75% scroll marker, and outbound-link clicks. Both are passive listeners
 * attached once. */
export default function Analytics() {
  const pathname = usePathname();

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

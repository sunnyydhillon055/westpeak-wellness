'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/toc';

/* Sticky table of contents for long-form pages.
 *
 * The list is rendered server-side and works as plain anchors with no JS —
 * the client hook only adds the active-section highlight. Same principle as
 * Reveal: enhancement, never a dependency. */
export default function Toc({
  items,
  variant = 'rail',
}: {
  items: TocItem[];
  /* 'rail'  — sticky in the left gutter; for single-column reading pages.
   * 'card'  — a boxed index at the top; for pages built from alternating
   *           banded sections, where a floating rail would fight the bands. */
  variant?: 'rail' | 'card';
}) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const nodes = items
      .map((i) => document.getElementById(i.id))
      .filter((n): n is HTMLElement => n !== null);
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown[0]) setActive(shown[0].target.id);
      },
      // Top band only: a heading counts as "current" from just under the sticky
      // header until it leaves the upper third of the viewport.
      { rootMargin: '-84px 0px -68% 0px', threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav className={variant === 'card' ? 'toc toc--card' : 'toc'} aria-label="On this page">
      <p className="toc-h">On this page</p>
      <ul>
        {items.map((i) => (
          <li key={i.id} className={active === i.id ? 'is-active' : undefined}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

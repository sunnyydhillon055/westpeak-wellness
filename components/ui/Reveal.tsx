'use client';

import { useEffect, useRef, useState } from 'react';

/* Scroll-in reveal.
 *
 * Two deliberate choices. It reads prefers-reduced-motion directly and shows
 * content immediately when set, rather than relying only on the CSS override —
 * so a reduced-motion user never sees a frame of hidden content. And it
 * disconnects after the first intersection, because a section that re-animates
 * on every scroll-past is exactly the sort of restlessness this site should
 * not have.
 *
 * If JavaScript never runs, the CSS default is hidden — so the fallback below
 * sets shown immediately on mount, meaning the only no-JS state is fully
 * visible content. */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li';
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = ref.current;

    /* Show immediately when animation is unwanted or impossible.
     * `visibilityState !== 'visible'` covers pre-rendering and any context
     * where the rendering pipeline is not running — IntersectionObserver is
     * driven by that pipeline, so in those cases it would never fire and the
     * content would stay hidden forever. */
    if (
      reduce ||
      !el ||
      !('IntersectionObserver' in window) ||
      document.visibilityState !== 'visible'
    ) {
      setShown(true);
      return;
    }

    let fired = false;

    const io = new IntersectionObserver(
      (entries) => {
        fired = true;
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    io.observe(el);

    /* Failsafe. An observer always emits an initial callback once the pipeline
     * runs; if none has arrived, something is wrong and the animation is not
     * worth hiding the page for. */
    const failsafe = window.setTimeout(() => {
      if (!fired) {
        setShown(true);
        io.disconnect();
      }
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ''}`}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

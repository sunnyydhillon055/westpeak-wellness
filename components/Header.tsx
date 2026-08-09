'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { site } from '@/lib/site';
import { track } from '@/lib/analytics';
import Motif from '@/components/brand/Motif';

/* Five items, deliberately. With the portal pill and the booking CTA the bar
 * carries seven objects as it is; nine was crowded and made the whole header
 * read as a list rather than a route. Approaches and FAQ come off the top
 * level — Approaches is a subtopic of Services and FAQ is linked from Fees,
 * Contact and the guides — and both keep prominent footer placement. */
const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/guides', label: 'Guides' },
  { href: '/pricing', label: 'Fees' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* Scroll-aware condense. Passive listener, and the state only flips at the
   * threshold rather than on every frame, so this costs nothing. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close the mobile menu on navigation, and stop the page scrolling behind it. */
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Escape closes the menu — expected of any overlay. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`));

  return (
    <header
      className="site-header"
      data-scrolled={scrolled ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <div className="container container--wide nav">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <span className="brand-mark" aria-hidden="true"><Motif variant="mark" /></span>
          <span className="brand-word">Westpeak <span>Wellness</span></span>
        </Link>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="nav-toggle-bars" aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>

        <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`}>
          {NAV.map((n, i) => (
            <li key={n.href} style={{ '--i': i } as CSSProperties}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="nav-portal" style={{ '--i': NAV.length } as CSSProperties}>
            <Link
              href={site.portalPath}
              aria-current={isActive(site.portalPath) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              Client portal
            </Link>
          </li>
          <li className="nav-cta" style={{ '--i': NAV.length + 1 } as CSSProperties}>
            <Link
              className="btn btn--primary"
              href={site.bookingPath}
              onClick={() => {
                setOpen(false);
                track('book_click', { location: 'header' });
              }}
            >
              Book Free Consult
            </Link>
          </li>
        </ul>
      </div>

      {/* Scrim. Always rendered so it can transition, and only hit-testable
        * when open. Tapping outside a drawer to dismiss it is the behaviour
        * people expect, and nothing here provided it. */}
      <div className="nav-scrim" onClick={() => setOpen(false)} aria-hidden="true" />
    </header>
  );
}

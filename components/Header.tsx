'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/lib/site';
import Motif from '@/components/brand/Motif';

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/approaches', label: 'Approaches' },
  { href: '/guides', label: 'Guides' },
  { href: '/pricing', label: 'Fees' },
  { href: '/faq', label: 'FAQ' },
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
    <header className="site-header" data-scrolled={scrolled ? 'true' : 'false'}>
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
          <span /><span /><span />
        </button>

        <ul id="primary-nav" className={`nav-links${open ? ' open' : ''}`}>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="nav-cta">
            <Link className="btn btn--primary" href={site.bookingPath} onClick={() => setOpen(false)}>
              Book Free Consult
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

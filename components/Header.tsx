'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { site } from '@/lib/site';
import { practitioners } from '@/lib/practitioners';
import { TAGALOG_READY } from '@/lib/practitioner-tl';
import { track } from '@/lib/analytics';
import Motif from '@/components/brand/Motif';
import { bookHrefFor } from '@/components/StickyBook';

/* Five items, deliberately. With the portal pill and the booking CTA the bar
 * carries seven objects as it is; nine was crowded and made the whole header
 * read as a list rather than a route. Approaches and FAQ come off the top
 * level — Approaches is a subtopic of Services and FAQ is linked from Fees,
 * Contact and the guides — and both keep prominent footer placement. */
/* Order set by the owner, 31 Aug 2026:
 *   Services, About, Fees, Guides, FAQ, Contact
 * then Punjabi, Client portal and Book Free Consult, which render after this
 * list rather than in it — see the nav-portal and nav-cta blocks below.
 *
 * It reads as a decision path now: what we do, who we are, what it costs, then
 * the reading material, then how to reach us. The previous order put both
 * content hubs second and third, ahead of the two things somebody weighing a
 * booking actually wants.
 *
 * The FAQ keeps its place in the menu for the reason it was added: it ranked
 * at position 1.8 on four inbound links with no menu entry at all, which made
 * it the cheapest thing on the site to make findable. */
const NAV = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/practitioners', label: 'Counsellors' },
  { href: '/pricing', label: 'Fees' },
  { href: '/guides', label: 'Guides' },
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

  /* THE DRAWER HAD NO FLOOR — fixed 30 August 2026.
   *
   * Opening the menu locked the body scroll and dimmed the page, and left all
   * of it in the tab order. Counted on the homepage with the drawer open: 11
   * focusable elements inside the drawer and 113 behind the scrim, none of
   * them inert or aria-hidden.
   *
   * So a keyboard user who tabbed past the last menu item went into page
   * content that was dimmed, covered, and — because the body scroll is locked
   * — could not be brought into view. Focus disappeared. A screen reader
   * likewise read straight through the drawer into the page underneath it.
   *
   * `inert` on everything that is not the header or the scrim removes it from
   * both the tab order and the accessibility tree for as long as the drawer is
   * open, which is what a modal surface is supposed to do. Where inert is not
   * supported the behaviour is exactly what it was before, so this cannot make
   * anything worse.
   */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    const outside = [...document.body.children].filter(
      (el) => !el.classList.contains('site-header') && !el.classList.contains('nav-scrim')
    );
    for (const el of outside) {
      if (open) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    }

    return () => {
      document.body.style.overflow = '';
      for (const el of outside) el.removeAttribute('inert');
    };
  }, [open]);

  /* AND THE DRAWER HAD NO LID EITHER — 30 August 2026.
   *
   * The panel is hidden with `clip-path` plus `visibility:hidden`, and the
   * visibility change is deferred with `transition:visibility 0s linear
   * var(--dur-slow)` so the wipe-up animation is visible before the panel
   * leaves the accessibility tree. On a fresh page load that works: measured
   * hidden, zero focusable links.
   *
   * It does not come back. Measured after opening and closing once:
   *
   *   fresh load            visibility hidden    0 of 9 links focusable
   *   drawer open           visible              9 of 9
   *   300ms after closing   visible              9 of 9   (expected, mid-delay)
   *   1200ms after closing  visible              9 of 9   (not expected)
   *
   * So for the rest of that page's life a keyboard user tabs through nine
   * invisible menu items on the way to the content, and a screen reader reads
   * them. Only after opening the menu once — which is why a fresh-load check
   * would have missed it, and did.
   *
   * `inert` rather than another attempt at the CSS: the transition is what
   * makes the animation work and what makes the hiding unreliable, and those
   * cannot both be fixed in the same declaration. This states the intent
   * directly. Desktop is excluded — above 1020px the same <ul> is the visible
   * navigation bar and must stay focusable.
   */
  useEffect(() => {
    const nav = document.getElementById('primary-nav');
    if (!nav) return;
    const mq = window.matchMedia('(max-width: 1020px)');
    const apply = () => {
      if (mq.matches && !open) nav.setAttribute('inert', '');
      else nav.removeAttribute('inert');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => { mq.removeEventListener('change', apply); nav.removeAttribute('inert'); };
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
    <>
    <header
      className="site-header"
      data-scrolled={scrolled ? 'true' : 'false'}
      data-open={open ? 'true' : 'false'}
    >
      <div className="container container--wide nav">
        <Link href="/" className="brand" aria-label={`${site.name}, home`}>
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
            <li
              key={n.href}
              style={{ '--i': i } as CSSProperties}
              className={n.href === '/practitioners' ? 'nav-has-sub' : undefined}
            >
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>

              {/* THE COUNSELLORS SUBMENU.
                *
                * Opens on hover AND on focus-within, and that second half is
                * the part that matters. A hover-only menu is unreachable by
                * keyboard entirely, and on a touch screen the first tap fires
                * hover while the second navigates — so the items would flash
                * and vanish. Because it is CSS-driven rather than JS state, it
                * also works before hydration.
                *
                * On the mobile drawer (<=1020px) it is not a dropdown at all:
                * the names render as an indented list, always visible, because
                * there is no hover to open anything with.
                *
                * The parent link still goes to /practitioners. Nothing here is
                * only reachable by hovering. */}
              {n.href === '/practitioners' && practitioners.length > 0 && (
                <ul className="nav-sub">
                  {practitioners.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/practitioners/${p.slug}`}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(`/practitioners/${p.slug}`) ? 'page' : undefined}
                      >
                        <span className="nav-sub-name">{p.name}</span>
                        <span className="nav-sub-role">{p.postNominals}</span>
                      </Link>
                    </li>
                  ))}
                  <li className="nav-sub-all">
                    <Link href="/practitioners" onClick={() => setOpen(false)}>
                      All counsellors &rarr;
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ))}
          {/* ਪੰਜਾਬੀ, in Gurmukhi, rather than a sixth English nav item.
            *
            * Punjabi is the practice's clearest differentiator and it appeared
            * in no menu at all — site.languagesNative existed and was surfaced
            * nowhere, so the one thing separating this practice from every
            * other BC counsellor was invisible unless you went looking.
            *
            * A sixth English label would crowd a bar the comment above capped
            * at five deliberately. The script solves both problems at once:
            * someone who reads Punjabi spots it instantly and needs no label,
            * and someone who does not passes over it at no cost. It is also
            * the more honest signal — a page written *in* Punjabi is a
            * different promise from the English word "Punjabi" on a menu. */}
          <li className="nav-lang" style={{ '--i': NAV.length } as CSSProperties}>
            <Link
              href="/punjabi"
              lang="pa"
              hrefLang="pa"
              aria-current={isActive('/punjabi') ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              ਪੰਜਾਬੀ
            </Link>
          </li>
          {/* Tagalog, beside ਪੰਜਾਬੀ and for the same reason. The practice now
            * works in three languages and the header advertised two. Unlike
            * Gurmukhi the word is its own label — "Tagalog" is what a Tagalog
            * speaker looks for — so it needs no translation to be recognised. */}
          {TAGALOG_READY && (
            <li className="nav-lang" style={{ '--i': NAV.length + 1 } as CSSProperties}>
              <Link
                href="/tagalog"
                lang="tl"
                hrefLang="tl"
                aria-current={isActive('/tagalog') ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                Tagalog
              </Link>
            </li>
          )}
          <li className="nav-portal" style={{ '--i': NAV.length + 2 } as CSSProperties}>
            <Link
              href={site.portalPath}
              aria-current={isActive(site.portalPath) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              Client portal
            </Link>
          </li>
          {/* Appears only once NEXT_PUBLIC_PHONE is set — see lib/site.ts. */}
          {site.phone && (
            <li className="nav-portal" style={{ '--i': NAV.length + 2 } as CSSProperties}>
              <a
                href={`tel:${site.phoneTel}`}
                onClick={() => {
                  setOpen(false);
                  track('phone_click', { location: 'header' });
                }}
              >
                {site.phone}
              </a>
            </li>
          )}
          <li className="nav-cta" style={{ '--i': NAV.length + 4 } as CSSProperties}>
            <Link
              className="btn btn--primary"
              href={bookHrefFor(pathname)}
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

    </header>

    {/* Scrim. Always rendered so it can transition, and only hit-testable when
      * open. Tapping outside a drawer to dismiss it is the behaviour people
      * expect, and nothing here provided it.
      *
      * A SIBLING OF THE HEADER, NOT A CHILD — 30 August 2026, and this is the
      * whole reason it now works. .site-header carries a backdrop-filter, and
      * a backdrop-filter makes an element the containing block for any
      * position:fixed descendant. So while this lived inside the header, its
      * `inset:0` resolved against the 72px-tall header rather than against the
      * viewport: it never dimmed the page at all. What it did instead was
      * paint over the header's own background — it is z-index:-1, and a
      * negative-z child paints above its parent's background and below its
      * content — turning the cream bar #9b9b9b with the wordmark still on top
      * of it, and taking anything in --blue-deep there from 5.19 to 2.01.
      *
      * Found by opening the mobile menu and looking at it. */}
    <div
      className="nav-scrim"
      data-open={open ? 'true' : 'false'}
      onClick={() => setOpen(false)}
      aria-hidden="true"
    />
    </>
  );
}

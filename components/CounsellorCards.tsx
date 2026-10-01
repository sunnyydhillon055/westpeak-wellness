import Link from 'next/link';
import Image from 'next/image';
import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import { withLetters, type Practitioner } from '@/lib/practitioners';
import { listOf, languagesOf, profileHrefFor } from '@/lib/city-service-page';
import type { CounsellorCardLocation } from '@/lib/counsellor-cards';

/* WHO YOU WOULD SEE — one block, four templates. 1 Oct 2026.
 *
 * Lifted out of the city x service page, where it was written this morning,
 * so the service pages, the audience pages and the city hubs draw the same
 * card rather than three near-copies of it. Who appears is decided in
 * lib/counsellor-cards.ts (and lib/city-service-page.ts for the matrix); this
 * only draws them.
 *
 * A SERVER COMPONENT, AND IT MUST STAY ONE. It imports the roster's types and
 * renders from the full Practitioner record. The only client piece is
 * BookLink, which receives two strings. Marking this file 'use client' would
 * put lib/practitioners.ts back in the browser bundle — the 50 KB regression
 * of 1 Oct 2026.
 *
 * Credential names only (withLetters). No registration number — those are on
 * the profile page and nowhere else. No availability line — hours are not
 * published anywhere. Renders nothing when nobody is accepting, rather than
 * a heading over an empty grid. */
export default function CounsellorCards({
  counsellors,
  location,
  heading,
  intro,
  citySlug,
  footer,
  className = 'section section--tint',
}: {
  counsellors: Practitioner[];
  location: CounsellorCardLocation;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  /** When set, "More about" links her page for this city if it exists. */
  citySlug?: string;
  /** Under the grid: the fee line and the coverage line on the
   *  informational pages. Block content, so it is not inside a <p>. */
  footer?: React.ReactNode;
  className?: string;
}) {
  if (counsellors.length === 0) return null;
  return (
    <section className={className}>
      <div className="container">
        <h2 style={{ marginTop: 0 }}>{heading}</h2>
        {intro && <p style={{ color: 'var(--ink-soft)', maxWidth: 680 }}>{intro}</p>}
        <div className="grid grid-2" style={{ gap: 20, marginTop: 20 }}>
          {counsellors.map((p) => {
            const first = p.name.split(' ')[0];
            return (
              <div className="card" key={p.slug}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {p.photos?.portrait && (
                    <Image
                      src={p.photos.portrait.src}
                      alt={p.photos.portrait.alt}
                      width={p.photos.portrait.width}
                      height={p.photos.portrait.height}
                      sizes="96px"
                      style={{ width: 96, height: 96, flex: '0 0 96px', objectFit: 'cover', objectPosition: 'top', borderRadius: '50%' }}
                    />
                  )}
                  <div>
                    <h3 style={{ margin: '0 0 2px', fontSize: '1.15rem' }}>{withLetters(p)}</h3>
                    <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '.92rem' }}>
                      {listOf(languagesOf(p), 'and')} · {p.focus.slice(0, 3).map((f) => f.label).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="btn-row" style={{ marginTop: 14 }}>
                  {/* Only a counsellor with an online calendar gets the button;
                      ?with= on /book opens nothing for one who books by reply. */}
                  {p.bookable && (
                    <BookLink location={location} href={`${site.bookingPath}?with=${p.slug}`}>
                      Book with {first}
                    </BookLink>
                  )}
                  <Link className="btn btn--ghost" href={citySlug ? profileHrefFor(p, citySlug) : `/practitioners/${p.slug}`}>
                    More about {first}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {footer && <div style={{ marginTop: 18, maxWidth: 680 }}>{footer}</div>}
      </div>
    </section>
  );
}

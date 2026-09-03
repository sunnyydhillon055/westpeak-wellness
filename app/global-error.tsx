'use client';

/* ============================================================================
   WHEN THE ROOT LAYOUT ITSELF FAILS
   ----------------------------------------------------------------------------
   app/error.tsx catches a crash inside a page. It cannot catch a crash in the
   root layout, because it renders inside it. This one replaces the whole
   document — which is why it carries its own <html> and <body>.

   EVERY STYLE HERE IS INLINE, AND THAT IS NOT LAZINESS. The stylesheet is
   linked from the layout that just failed, so no class name on this page can
   be relied on to mean anything. Anything that must be legible has to carry
   its own appearance.

   The colours are pure black and pure white rather than the palette's near-
   black, for the same reason: a var() resolves to nothing without the
   stylesheet, and a literal outside the palette is what scripts/palette-guard
   exists to catch. Black on white is the one pair that needs neither.

   The content is cut to almost nothing on purpose. One sentence, the crisis
   numbers, and a link home. This page renders after the site has already
   failed once; every additional thing on it is another chance to fail again.
   ========================================================================= */

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: '3rem 1.25rem',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          lineHeight: 1.6,
          color: '#000000',
          background: '#ffffff',
        }}
      >
        <main style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.6rem', margin: '0 0 0.75rem' }}>
            The site failed to load.
          </h1>
          <p style={{ margin: '0 0 1.5rem' }}>
            That is a fault at our end. Reloading usually fixes it.
          </p>

          <p style={{ margin: '0 0 1.5rem' }}>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.7rem 1.2rem',
                background: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 4,
              }}
            >
              Reload the site
            </a>
          </p>

          {/* The reason this file is worth having at all. */}
          <p style={{ margin: '0 0 0.75rem' }}>
            <strong>If you need help right now:</strong> this is not a crisis service.
            Call or text <a href="tel:988">9-8-8</a>, the Suicide Crisis Helpline —
            anywhere in Canada, 24 hours a day. In immediate danger, call{' '}
            <a href="tel:911">9-1-1</a>.
          </p>

          {error.digest ? (
            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              Reference: <code>{error.digest}</code>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}

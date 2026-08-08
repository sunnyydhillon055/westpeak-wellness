'use client';

import { useEffect } from 'react';

/**
 * Calendly inline embed. Only rendered when site.bookingReady is true —
 * see lib/site.ts. Loads Calendly's widget script once, on mount.
 */
export default function CalendlyEmbed({ url }: { url: string }) {
  useEffect(() => {
    const SRC = 'https://assets.calendly.com/assets/external/widget.js';
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
      <div
        className="calendly-inline-widget"
        data-url={`${url}?hide_gdpr_banner=1&background_color=ffffff&primary_color=5b8bc4`}
        style={{ minWidth: 320, height: 760 }}
      />
      <noscript>
        <p>
          Online scheduling needs JavaScript enabled. You can also{' '}
          <a href={url} target="_blank" rel="noopener">open the booking calendar directly</a>.
        </p>
      </noscript>
    </>
  );
}

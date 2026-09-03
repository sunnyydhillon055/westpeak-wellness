'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/* ============================================================================
   WHAT A CRASHED PAGE SHOWS
   ----------------------------------------------------------------------------
   Until now: Next's built-in boundary, which in production renders a blank
   page carrying the words "Application error: a client-side exception has
   occurred". No heading, no links, no way onward. On most sites that is merely
   bad. Here it can land in front of someone who opened the site at two in the
   morning looking for a crisis number, and a blank page is the worst possible
   answer to that.

   SO THE ONE THING THIS PAGE GUARANTEES IS THE CRISIS LINE. Everything else —
   the retry, the destinations — is convenience. 9-8-8 and 9-1-1 are the reason
   the file exists, and they are plain text and plain tel: links so they still
   work if every stylesheet and every other script on the page has failed.

   It deliberately does not show the error. `error.message` in production is a
   minified string that helps nobody reading it and occasionally leaks the
   shape of something internal. The digest is shown instead: it is the handle
   Vercel's logs are keyed by, so a person who reports it can be matched to the
   actual stack without any of it being exposed here.
   ========================================================================= */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Server-side crashes reach the platform log on their own; a client-side
       one dies in the visitor's browser and is otherwise never seen. */
    console.error('Page error boundary:', error);
  }, [error]);

  return (
    <section className="section" style={{ paddingTop: 80 }}>
      <div className="container prose" style={{ maxWidth: '44rem' }}>
        <p className="eyebrow">Something went wrong</p>
        <h1>This page did not load properly.</h1>
        <p className="lede">
          That is a fault at our end, not anything you did. Trying again usually works.
        </p>

        <p>
          <button className="btn btn--primary" type="button" onClick={reset}>
            Try again
          </button>
        </p>

        <h2>If you were looking for help right now</h2>
        <p>
          This is not a crisis service. If you are in crisis, call or text{' '}
          <a href="tel:988">9-8-8</a> — the Suicide Crisis Helpline, anywhere in Canada,
          24/7. In immediate danger, call <a href="tel:911">9-1-1</a>.
        </p>

        <h2>Where you were probably going</h2>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Counselling services</Link></li>
          <li><Link href="/pricing">Fees and insurance</Link></li>
          <li><Link href="/book">Book a free 15-minute consultation</Link></li>
          <li><Link href="/contact">Contact the practice</Link></li>
        </ul>

        {error.digest ? (
          /* Inline rather than a utility class: `small` and `muted` do not
             exist in this stylesheet, and a class that silently does nothing is
             worse on the one page that has to render when things are broken. */
          <p style={{ fontSize: '0.9rem', opacity: 0.75 }}>
            If it keeps happening, quoting this reference lets us find what failed:{' '}
            <code>{error.digest}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}

'use client';

/* THE ANALYTICS QUESTION, LOADED ONLY WHEN IT STILL NEEDS ASKING — 16 Oct 2026 (item 551).
 *
 * components/ConsentGate.tsx reads the stored choice and fetches this file
 * with import() only when there is none, so a returning visitor who has
 * already answered never downloads the banner. Behaviour is unchanged: two
 * buttons of the same size, nothing pre-selected, decline remembered as long
 * as accept, and Google loads only after "That’s fine".
 *
 * WHERE IT SITS. It used to be a fixed panel at bottom 0, z-index 60: the
 * same place and layer as the phone booking bar, and later in the DOM, so up
 * to 1020px it covered "Book free consult" (production at 375x812: the
 * banner was 234px tall from top 578, and elementFromPoint inside the Book
 * button returned the consent region). It now sits on top of the bar, at
 * var(--sticky-h), which components/StickyBook.tsx publishes from the bar's
 * measured height, and hides with the bar while the calendar is open or a
 * field has focus (app/globals.css, .consent-banner). One sentence and the
 * privacy link, so it stays about 110px tall at 375px. */
export default function ConsentBanner({ onDecide }: { onDecide: (c: 'granted' | 'declined') => void }) {
  return (
    <div role="region" aria-label="Analytics consent" className="consent-banner">
      <div className="container consent-banner__in">
        <p>
          May this site use Google Analytics (anonymous, never what you type in a form) to see
          which pages help? <a href="/privacy">Privacy policy</a>
        </p>
        <div className="consent-banner__btns">
          <button type="button" className="btn btn--ghost" onClick={() => onDecide('declined')}>
            No thanks
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onDecide('granted')}>
            That&rsquo;s fine
          </button>
        </div>
      </div>
    </div>
  );
}

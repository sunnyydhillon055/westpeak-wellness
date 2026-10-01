'use client';

import { useState } from 'react';

/* A paragraph for somebody else's page, and a button that copies it.
 *
 * The text is printed in full, so it can be selected and copied by hand with
 * JavaScript off; the button only saves the selecting. Plain text on the
 * clipboard, never HTML, so it pastes into an intranet editor without
 * carrying this site's styles. Styled with existing classes and two inline
 * rules: global CSS is inlined into every page's HTML, and one page's button
 * is not worth that. Takes a string and imports no data module. */
export default function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Clipboard refused (permissions, an old browser): the text is on the
         page to select by hand. */
    }
  }

  return (
    <div style={{ margin: '20px 0 28px' }}>
      <blockquote className="quote" style={{ margin: '0 0 14px', userSelect: 'all' }}>
        {text}
      </blockquote>
      <button type="button" className="btn btn--ghost" onClick={copy} aria-live="polite">
        {copied ? 'Copied' : 'Copy this paragraph'}
      </button>
    </div>
  );
}

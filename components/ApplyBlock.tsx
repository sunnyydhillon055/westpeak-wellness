'use client';

import { useState } from 'react';

/* The apply control.
 *
 * WHY THIS IS NOT JUST A mailto: LINK. A mailto only does anything if the
 * device has a mail handler registered. A large share of people — anyone on
 * webmail in a browser with no desktop client configured — click it and
 * nothing happens at all. No error, no tab, nothing. On a job posting that
 * silently loses applicants, and it is invisible to the practice because a
 * person who cannot apply also cannot tell you they could not apply.
 *
 * So the mailto stays as one route among several, and every other route works
 * without it:
 *
 *   · Gmail and Outlook web compose links, which cover most webmail users
 *   · the address shown as large selectable text — always readable, always
 *     copyable by hand, works with no JavaScript at all
 *   · copy buttons for the address and for the whole prefilled template, so
 *     someone can paste it into any client on any device
 *
 * The address is rendered as plain text rather than assembled in script. Naive
 * obfuscation would hide it from screen readers and from anyone with
 * JavaScript disabled, which is a worse problem than scraping.
 */
export default function ApplyBlock({
  email,
  subject,
  body,
  compact = false,
}: {
  email: string;
  subject: string;
  body: string;
  /** A second, lighter instance for the top of the page. */
  compact?: boolean;
}) {
  const [copied, setCopied] = useState<'' | 'address' | 'template'>('');
  const [failed, setFailed] = useState(false);

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmail =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const outlook =
    `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}` +
    `&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function copy(what: 'address' | 'template') {
    const text = what === 'address' ? email : `To: ${email}\nSubject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setFailed(false);
      setTimeout(() => setCopied(''), 2500);
    } catch {
      // Clipboard can be refused by permissions or an insecure context. Say so
      // rather than showing a success state that did not happen.
      setFailed(true);
    }
  }

  return (
    <div className={`apply-block${compact ? ' apply-block--compact' : ''}`}>
      {!compact && <h3>Apply</h3>}

      <p className="apply-to">
        Send it to{' '}
        <a href={`mailto:${email}`} className="apply-address">
          {email}
        </a>
      </p>

      <div className="apply-actions">
        <a className="btn btn--primary" href={mailto}>
          Open in my email app
        </a>
        <a className="btn btn--ghost" href={gmail} target="_blank" rel="noopener noreferrer">
          Compose in Gmail
        </a>
        <a className="btn btn--ghost" href={outlook} target="_blank" rel="noopener noreferrer">
          Compose in Outlook
        </a>
      </div>

      <div className="apply-actions apply-actions--minor">
        <button type="button" className="apply-copy" onClick={() => copy('address')}>
          {copied === 'address' ? 'Address copied' : 'Copy email address'}
        </button>
        <button type="button" className="apply-copy" onClick={() => copy('template')}>
          {copied === 'template' ? 'Template copied' : 'Copy the whole template'}
        </button>
      </div>

      {/* Announced to screen readers when it changes, not just shown. */}
      <p className="apply-note" role="status" aria-live="polite">
        {failed
          ? 'Copying was blocked by the browser — select the address above and copy it by hand.'
          : copied
            ? 'Copied. Paste it into whichever email you use.'
            : 'If “Open in my email app” does nothing, your device has no mail app set up — use one of the other options.'}
      </p>
    </div>
  );
}

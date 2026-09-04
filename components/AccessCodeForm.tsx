'use client';

import { useState } from 'react';

/* Two-step sign-in: address, then the code emailed to it.
 *
 * A client component because the two steps are one interaction and pushing the
 * address through a URL to carry state between them would put a client's email
 * in browser history, server logs and any referrer — for a counselling
 * practice that is a disclosure, not an inconvenience.
 *
 * `onVerify` is a server action passed down from the page, so the actual
 * sign-in still happens on the server with the rest of the auth flow rather
 * than in a second client-side path.
 */

export default function AccessCodeForm({
  onVerify,
}: {
  onVerify: (formData: FormData) => Promise<void>;
}) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch('/api/portal/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      /* The route answers identically whether or not the address is a client,
       * so there is nothing here to branch on — and nothing that could leak
       * who is a client by rendering a different message. */
      setNote(body?.message ?? 'If that address belongs to a client here, a code is on its way.');
      setStep('code');
    } catch {
      setNote('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  if (step === 'email') {
    return (
      <form className="portal-gate" onSubmit={requestCode}>
        <label htmlFor="code-email">Email address</label>
        <input
          id="code-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Sending…' : 'Continue with email'}
        </button>
        {note && (
          <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginTop: 12 }}>{note}</p>
        )}
      </form>
    );
  }

  return (
    <form className="portal-gate" action={onVerify}>
      {/* Carried forward so the server action has it without a round trip
          through the URL. */}
      <input type="hidden" name="email" value={email} />
      {/* Both branches land here, because the route deliberately does not say
          which one ran. A returning client types the code; a first-time client
          follows the set-up link instead and never fills this in. */}
      <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', margin: '0 0 14px' }}>
        Signed up before? Enter the code we just emailed. If this is your first time
        using the portal, we have sent a link to choose a password instead, follow
        that and you will not need a code.
      </p>
      <label htmlFor="code">Access code</label>
      <input
        id="code"
        name="code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        autoComplete="one-time-code"
        autoFocus
        required
        style={{ letterSpacing: '.35em', fontSize: '1.15rem' }}
      />
      <button type="submit" className="btn btn--primary">Sign in</button>
      {note && (
        <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', marginTop: 12 }}>{note}</p>
      )}
      <p style={{ fontSize: '.9rem', marginTop: 10 }}>
        <button
          type="button"
          className="link-standalone"
          onClick={() => { setStep('email'); setNote(null); }}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit', textDecoration: 'underline' }}
        >
          Use a different address
        </button>
      </p>
    </form>
  );
}

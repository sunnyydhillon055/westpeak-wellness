'use client';

import { track } from '@/lib/analytics';

/* Email capture that does not hold anything hostage.
 *
 * The guide it sits beside is already fully readable above it. This offers to
 * send the checklist version, which is a fair trade rather than a toll gate —
 * and on a counselling site, gating useful information behind an email address
 * is a bad look at exactly the moment someone is deciding whether to trust the
 * practice. */
export default function LeadCapture({ done }: { done?: boolean }) {
  if (done) {
    return (
      <div className="crisis" style={{ marginTop: 8 }}>
        <p style={{ margin: 0 }}>
          <strong>Thank you — that is noted.</strong> The full guide is on this page already, so
          there is nothing to wait for. If you would like to talk any of it through, a free
          15-minute consultation is the next step and carries no obligation.
        </p>
      </div>
    );
  }

  return (
    <form
      method="POST"
      action="/api/lead"
      className="lead-form"
      onSubmit={() => track('lead_magnet_submit', { magnet: 'coverage-guide' })}
    >
      <p className="lead-form-title">Want the one-page checklist version?</p>
      <p className="lead-form-note">
        The questions to ask your insurer, on a single page. No newsletter, no sequence — this
        is a one-off, and the guide above is complete without it.
      </p>
      <div className="lead-form-row">
        <label htmlFor="lead-name" className="sr-only">First name</label>
        <input id="lead-name" name="name" type="text" placeholder="First name" autoComplete="given-name" />
        <label htmlFor="lead-email" className="sr-only">Email address</label>
        <input
          id="lead-email" name="email" type="email" required placeholder="you@example.com"
          autoComplete="email" autoCapitalize="none" spellCheck={false}
        />
        <button type="submit" className="btn btn--primary">Send it</button>
      </div>
      {/* Unticked, and it must stay unticked. A pre-ticked consent box is not
          consent under CASL, and asking for a checklist is not agreement to an
          indefinite mailing list — see the comment on `monthlyOptIn` in
          lib/inbound.ts. Without this box the honest answer is that no monthly
          email may be sent to these people at all. */}
      <label className="lead-form-check">
        <input type="checkbox" name="monthly" value="yes" />
        <span>
          Also send me something useful about once a month. Separate from the checklist, and one
          click stops it at any time.
        </span>
      </label>

      <p className="lead-form-note">
        Your address is used to send this once. It is not shared, and it does not create a
        client record.
      </p>
    </form>
  );
}

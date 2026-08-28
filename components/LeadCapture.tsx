'use client';

import { track } from '@/lib/analytics';

/* Email capture that does not hold anything hostage.
 *
 * The guide it sits beside is already fully readable above it. This offers to
 * send the checklist version, which is a fair trade rather than a toll gate —
 * and on a counselling site, gating useful information behind an email address
 * is a bad look at exactly the moment someone is deciding whether to trust the
 * practice. */
/* The magnets. Adding one means adding an entry here and an email in
 * lib/inbound-mail.ts — the value is allow-listed server-side in
 * lib/inbound-submit.ts, so an unrecognised key falls back to the checklist
 * rather than sending nobody anything. */
const MAGNETS = {
  'coverage-checklist': {
    title: 'Want the one-page checklist version?',
    note: 'The questions to ask your insurer, on a single page. No newsletter, no sequence — this is a one-off, and the guide above is complete without it.',
    button: 'Send it',
    doneBody:
      'The full guide is on this page already, so there is nothing to wait for. If you would like to talk any of it through, a free 15-minute consultation is the next step and carries no obligation.',
  },
  'icbc-after-a-crash': {
    title: 'Injured in a crash? You may already have twelve funded sessions.',
    note: 'ICBC pre-approves twelve counselling sessions with a Registered Clinical Counsellor in the first twelve weeks, with no doctor’s note needed to start. Most people never use it because nobody tells them. The one-pager explains how to claim it — with any counsellor, including ones that are not this practice.',
    button: 'Send me the one-pager',
    doneBody:
      'It is on its way. It explains how to use the entitlement with any registered counsellor — this practice is not currently an ICBC vendor, and the one-pager says so.',
  },
  'starting-counselling': {
    title: 'Want the one-page "how to start" version?',
    note: 'Seven steps from first thought to first session — coverage, registers, consultations, and what a first session actually involves. It applies with any counsellor, not just this practice. One email, no sequence, and this page is complete without it.',
    button: 'Send it',
    doneBody:
      'It is on its way — seven steps, one page, usable with any counsellor. If you would rather talk it through, a free 15-minute consultation is the next step and carries no obligation.',
  },
} as const;

export type MagnetKey = keyof typeof MAGNETS;

export default function LeadCapture({
  done,
  magnet = 'coverage-checklist',
  source,
  returnTo,
}: {
  done?: boolean;
  magnet?: MagnetKey;
  /** Page the form sits on, for /admin's which-page-earns-enquiries view. */
  source?: string;
  /** Where to land after submitting. Statically generated pages cannot read
   *  the ?lead=ok flag, so they pass '/message-sent' here — see the returnTo
   *  note in lib/inbound-submit.ts. Pages rendered on demand omit it. */
  returnTo?: string;
}) {
  const m = MAGNETS[magnet];
  if (done) {
    return (
      <div className="crisis" style={{ marginTop: 8 }}>
        <p style={{ margin: 0 }}>
          <strong>Thank you — that is noted.</strong> {m.doneBody}
        </p>
      </div>
    );
  }

  return (
    <form
      method="POST"
      action="/api/lead"
      className="lead-form"
      onSubmit={() => track('lead_magnet_submit', { magnet })}
    >
      {/* Which one-pager. Allow-listed server-side; see lib/inbound-submit.ts. */}
      <input type="hidden" name="magnet" value={magnet} />
      {source && <input type="hidden" name="source" value={source} />}
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <p className="lead-form-title">{m.title}</p>
      <p className="lead-form-note">{m.note}</p>
      <div className="lead-form-row">
        <label htmlFor="lead-name" className="sr-only">First name</label>
        <input id="lead-name" name="name" type="text" placeholder="First name" autoComplete="given-name" />
        <label htmlFor="lead-email" className="sr-only">Email address</label>
        <input
          id="lead-email" name="email" type="email" required placeholder="you@example.com"
          autoComplete="email" autoCapitalize="none" spellCheck={false}
        />
        <button type="submit" className="btn btn--primary">{m.button}</button>
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

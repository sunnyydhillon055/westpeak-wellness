import type { ReactNode } from 'react';
import SchedulerTelemetry from '@/components/SchedulerTelemetry';
import SchedulerGate from '@/components/SchedulerGate';
import BookDirectLink from '@/components/BookDirectLink';
import MailLink from '@/components/MailLink';
import { withEmbedFlag } from '@/lib/cliniko-frame';

/* THE CALENDAR BOX ITSELF, WITHOUT THE ROSTER — 15 Oct 2026 (item 514).
 *
 * The markup components/SchedulerEmbed.tsx has always rendered (its comment
 * says why each part is there), moved here so a client component can render
 * it too: /book is static now and picks its counsellor in the browser
 * (components/BookChoice.tsx), and SchedulerEmbed reads lib/practitioners.ts
 * to find a first name, which no client component may import. The caller
 * passes the name instead. SchedulerEmbed still exists for the client
 * portal and delegates here, so there is one copy of this markup.
 *
 * `pending` draws the closed gate with no behaviour: /book renders it until
 * the browser has read ?with=, so an arrival at #calendar does not open the
 * practice-wide calendar a moment before the chosen counsellor's. It is the
 * same markup SchedulerGate draws closed (.scheduler-wait), so nothing moves
 * when the real gate replaces it. */
export default function SchedulerEmbedView({
  url, embedParam, title, page, who, first, portal = false, placeholder, secondary, cta = 'Show available times', openDetail, pending = false,
}: {
  url: string;
  /** CLINIKO_EMBED_PARAM (lib/site.ts), passed in so this file adds no
   *  lib/site export to the browser's copy of it. */
  embedParam: string;
  title?: string;
  page: string;
  who?: string;
  /** The first name of the counsellor `who` names, if any. */
  first?: string;
  /** True for the client portal's calendar (`who` carries PORTAL_PREFIX). */
  portal?: boolean;
  placeholder?: ReactNode;
  secondary?: ReactNode;
  cta?: string;
  openDetail?: 'couples';
  pending?: boolean;
}) {
  const origin = new URL(url).origin;
  const frameTitle = title ?? 'Booking calendar';
  const frameUrl = withEmbedFlag(url, embedParam);
  const slug = portal && who ? who.slice(who.indexOf(':') + 1) : who;
  const label = first ? `Open ${first}’s calendar in a new tab` : 'Open the booking calendar in a new tab';
  const stalled = (
    <>
      The calendar has not appeared.{' '}
      {slug && !portal ? (
        <BookDirectLink href={url} who={slug} className="">{label}</BookDirectLink>
      ) : (
        <a href={url} target="_blank" rel="noopener">{label}</a>
      )}
      , or email <MailLink where="book-fallback" />.
    </>
  );
  return (
    <div className="scheduler-embed">
      <link rel="preconnect" href={origin} />
      {placeholder && pending ? (
        <div className="scheduler-wait">
          {placeholder}
          <div className="scheduler-wait__actions">
            <button type="button" className="btn btn--primary">{cta}</button>
            {secondary}
          </div>
        </div>
      ) : placeholder ? (
        <SchedulerGate url={frameUrl} title={frameTitle} page={page} who={who} cta={cta} secondary={secondary} openDetail={openDetail} stalled={stalled}>
          {placeholder}
        </SchedulerGate>
      ) : (
        <SchedulerTelemetry page={page} who={who} stalled={stalled}>
          <iframe
            src={frameUrl}
            title={frameTitle}
            loading="lazy"
            /* allow-forms/-scripts/-same-origin are what the booking flow needs;
               allow-popups covers the card step opening a bank 3-D Secure window. */
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </SchedulerTelemetry>
      )}
      <p className="scheduler-fallback">
        Calendar not loading?{' '}
        <a href={url} target="_blank" rel="noopener">Open the booking page directly, in a new tab</a>.
      </p>
    </div>
  );
}

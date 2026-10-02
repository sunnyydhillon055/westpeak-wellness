import SchedulerTelemetry from '@/components/SchedulerTelemetry';
import SchedulerGate from '@/components/SchedulerGate';
import BookDirectLink from '@/components/BookDirectLink';
import MailLink from '@/components/MailLink';
import { CLINIKO_EMBED_PARAM } from '@/lib/site';
import { withEmbedFlag } from '@/lib/cliniko-frame';
import { PORTAL_PREFIX } from '@/lib/conversion-detail';
import { practitioners } from '@/lib/practitioners';

/**
 * Cliniko online-bookings inline embed.
 *
 * Only rendered when site.bookingReady is true — see lib/site.ts.
 *
 * Deliberately a plain <iframe> and a server component: Cliniko serves its
 * bookings as an embeddable page, so no third-party script needs to run on this
 * origin. That keeps the site free of any external JS, keeps every route
 * statically rendered, and means a crawler with no JavaScript still gets the
 * fallback link below. The card is taken by Stripe inside the frame — no
 * payment data touches this site, and none reaches Cliniko either.
 *
 * The telemetry wrapper is our own code, not a third party, and renders the
 * same markup — the iframe is still server-rendered and the fallback link is
 * still in the HTML with JavaScript off. All it adds is two counters that say
 * whether anyone reached the calendar. See components/SchedulerTelemetry.
 *
 * TWO MODES — 1 Oct 2026.
 *
 * With `placeholder` set, the frame is not in the HTML at all. A box the same
 * height holds the placeholder (portrait, next open times), a primary button
 * that mounts the frame, and `secondary` (the first-party direct link) as
 * the other action. /book uses this: the frame's 2.6 MB of Cliniko, Stripe
 * and Google Fonts was the whole reason that page scored 38 on a phone, and
 * most people who reach it are still deciding, not yet picking a time. See
 * components/SchedulerGate for the measurements.
 *
 * Without it, the frame is server-rendered and lazy exactly as before. The
 * client portal keeps that: a signed-in client who opened the portal to book
 * has already asked for the calendar.
 *
 * THE FRAME SIZES ITSELF — 1 Oct 2026. The frame's src carries Cliniko's
 * embed flag (lib/site.ts, CLINIKO_EMBED_PARAM) and SchedulerTelemetry reads
 * the height and step messages the embedded page posts back. The fallback
 * link below keeps the plain URL: it opens the calendar as its own page.
 *
 * IF THE FRAME NEVER DRAWS — 2 Oct 2026. `stalled` below is what
 * SchedulerTelemetry shows above a frame that sent no resize within ten
 * seconds of being on screen: the counsellor's calendar as its own tab and the
 * address. On /book the link is BookDirectLink, so a stall that ends in the
 * direct calendar is counted as book_direct like any other; in the portal it is
 * a plain link, because book_direct is /book's free-consultation count.
 */
export default function SchedulerEmbed({
  url, title, page, who, placeholder, secondary, cta = 'Show available times', openDetail,
}: {
  url: string;
  title?: string;
  page: string;
  /** Roster slug of the counsellor this calendar is narrowed to, when `?with=`
   *  chose one; the practice-wide calendar passes nothing. */
  who?: string;
  placeholder?: React.ReactNode;
  secondary?: React.ReactNode;
  cta?: string;
  /** Passed to SchedulerGate: the scheduler_open detail for a couples consultation. */
  openDetail?: 'couples';
}) {
  const origin = new URL(url).origin;
  const frameTitle = title ?? 'Booking calendar';
  const frameUrl = withEmbedFlag(url, CLINIKO_EMBED_PARAM);
  const portal = (who ?? '').startsWith(PORTAL_PREFIX);
  const slug = portal ? who!.slice(PORTAL_PREFIX.length) : who;
  const first = practitioners.find((p) => p.slug === slug)?.name.split(' ')[0];
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
      {/* Browsers honour preconnect from body markup, and this component only
          renders on pages that embed the calendar — so the DNS + TLS setup to
          Cliniko's shard starts before the frame asks for it, on exactly the
          pages that will. Kept in the gated mode too: one handshake is cheap,
          and it is the difference between the calendar appearing on the tap
          and appearing a moment after it. */}
      <link rel="preconnect" href={origin} />
      {placeholder ? (
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

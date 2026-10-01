import SchedulerTelemetry from '@/components/SchedulerTelemetry';
import SchedulerGate from '@/components/SchedulerGate';

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
 */
export default function SchedulerEmbed({
  url, title, page, placeholder, secondary, cta = 'Show available times',
}: {
  url: string;
  title?: string;
  page: string;
  placeholder?: React.ReactNode;
  secondary?: React.ReactNode;
  cta?: string;
}) {
  const origin = new URL(url).origin;
  const frameTitle = title ?? 'Booking calendar';
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
        <SchedulerGate url={url} title={frameTitle} page={page} cta={cta} secondary={secondary}>
          {placeholder}
        </SchedulerGate>
      ) : (
        <SchedulerTelemetry page={page}>
          <iframe
            src={url}
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
        <a href={url} target="_blank" rel="noopener">Open the booking page directly</a>.
      </p>
    </div>
  );
}

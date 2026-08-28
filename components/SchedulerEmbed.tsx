import SchedulerTelemetry from '@/components/SchedulerTelemetry';

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
 */
export default function SchedulerEmbed({
  url, title, page,
}: { url: string; title?: string; page: string }) {
  const origin = new URL(url).origin;
  return (
    <SchedulerTelemetry page={page}>
      <div className="scheduler-embed">
        {/* Browsers honour preconnect from body markup, and this component only
            renders on pages that embed the calendar — so the DNS + TLS setup to
            Cliniko's shard starts before the lazy iframe asks for it, on
            exactly the pages that will. */}
        <link rel="preconnect" href={origin} />
        <iframe
          src={url}
          title={title ?? 'Booking calendar'}
          loading="lazy"
          /* allow-forms/-scripts/-same-origin are what the booking flow needs;
             allow-popups covers the card step opening a bank 3-D Secure window. */
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <p className="scheduler-fallback">
          Calendar not loading?{' '}
          <a href={url} target="_blank" rel="noopener">Open the booking page directly</a>.
        </p>
      </div>
    </SchedulerTelemetry>
  );
}

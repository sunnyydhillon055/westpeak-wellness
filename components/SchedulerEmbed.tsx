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
 */
export default function SchedulerEmbed({ url, title }: { url: string; title?: string }) {
  return (
    <div className="scheduler-embed">
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
  );
}

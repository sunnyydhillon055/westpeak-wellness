import SchedulerEmbedView from '@/components/SchedulerEmbedView';
import { CLINIKO_EMBED_PARAM } from '@/lib/site';
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
/** One counsellor's calendar, offered as its own button in the gated box. */
export type SchedulerChoice = { slug: string; url: string; label: string; title: string };

export default function SchedulerEmbed({
  url, title, page, who, placeholder, secondary, cta = 'Show available times', openDetail, choices,
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
  /** Gated mode only: one primary button per counsellor in place of `cta`,
   *  each opening her own calendar (bare /book, 15 Oct 2026). */
  choices?: SchedulerChoice[];
}) {
  /* The markup lives in components/SchedulerEmbedView.tsx since 15 Oct 2026,
     so /book's client island can render it without the roster; this server
     wrapper only looks up the first name. */
  const portal = (who ?? '').startsWith(PORTAL_PREFIX);
  const slug = portal ? who!.slice(PORTAL_PREFIX.length) : who;
  const first = practitioners.find((p) => p.slug === slug)?.name.split(' ')[0];
  return (
    <SchedulerEmbedView
      url={url} embedParam={CLINIKO_EMBED_PARAM} title={title} page={page} who={who} first={first} portal={portal}
      placeholder={placeholder} secondary={secondary} cta={cta} openDetail={openDetail} choices={choices}
    />
  );
}

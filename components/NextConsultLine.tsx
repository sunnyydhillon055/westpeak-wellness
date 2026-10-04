import { ConsultLine, ConsultDays } from '@/components/NextConsultSlot';
import { askForTimeHref } from '@/lib/next-consult';
import { consultPeople } from '@/lib/booking-cta';
import { consultLines, daysLines, type SlotPerson } from '@/lib/consult-slot';
import { site } from '@/lib/site';

/* THE NEXT FREE CONSULTATION, ON A PAGE ABOUT WAITING — 1 Oct 2026.
 *
 * /guides/waiting-for-therapy-in-bc ranks on page one (91 impressions at
 * 7.21) with no clicks, and its description promises "days for private"
 * without ever saying when. This says when: the first open free-consultation
 * day for each counsellor taking new clients, read from the same thirty-
 * minute Cliniko cache /api/availability and the profiles use.
 *
 * Since the same day it also sits on the sick-days guide, the verify and
 * coverage resources, the Punjabi words resource, every city hub and every
 * city x service page, and on /one-pager-sent. `slugs` and `language`
 * narrow who it names (lib/next-consult.ts): a couples page offers only the
 * counsellor who does couples work, the Punjabi page only the counsellor who
 * works in Punjabi. Each placement passes its own `location`, on
 * BOOK_LOCATIONS, so which of them earns a booking is countable.
 *
 * A SERVER component that reads the roster; since 3 Oct 2026 (item 429)
 * it no longer reads Cliniko. It decides who the line may name and hands
 * those first names and links to ConsultLine (components/NextConsultSlot.tsx),
 * which asks /api/availability in the browser, so the page around it can be
 * fully static and keep its inlined CSS. The roster never enters a client
 * bundle (the perf rule of 1 Oct 2026). It prints nothing at all when Cliniko
 * could not be read. When it was read and nobody it would name has a time in the
 * next two weeks it says so and links the ask-for-a-time form on /book
 * (2 Oct 2026, "next-consult-ask"), naming no day and no hour. These are appointment times
 * Cliniko is offering, not opening hours, and they are Pacific time.
 *
 * "book with Camille" ends in #calendar (1 Oct 2026, wf/book-and-cta): the
 * reader has just been shown a time and asked for that calendar, so /book
 * opens it on arrival instead of three screens above it.
 *
 * `service` (2 Oct 2026, wf/services-cards): on a couples page the link also
 * carries for=couples, so /book opens the couples consult type. Before this,
 * /for/couples and /services/couples-therapy linked ?with=camille-granda
 * #calendar, which opens the individual consult. */
export default function NextConsultLine({
  location,
  slugs,
  language,
  service,
  style,
}: {
  location: string;
  /** Only these counsellors, e.g. those who offer the page's service. */
  slugs?: readonly string[];
  /** Only counsellors who work in this roster language tag ('pa', 'tl'). */
  language?: string;
  /** The page's booking service; 'couples-therapy' adds for=couples. */
  service?: string;
  style?: React.CSSProperties;
}) {
  const people = consultPeople({ slugs, language, service });
  if (!people.length) return null;
  const [lm, ld] = consultLines(people);
  return (
    <ConsultLine
      people={people}
      location={location}
      askHref={askForTimeHref(people, site.bookingPath)}
      style={style}
      lm={lm}
      ld={ld}
    />
  );
}

/* THE NEXT FREE DAY UNDER AN ARTICLE'S HERO BUTTON — 3 Oct 2026 (item 409).
 * "Next free call: Thu 22 Oct with Savneet (Pacific time)", each day a link
 * to her calendar counted as 'hero-next-article', as the home hero does it.
 * The page passes the people its closing block used to name (consultPeople
 * in lib/booking-cta.ts) and stops printing that copy, so the next
 * consultation still prints once per page, now at the top. Days only, from
 * Cliniko, filled in by the browser; the paragraph holds its height first. */
export function HeroNextDays({ people, className }: { people: SlotPerson[]; className?: string }) {
  if (!people.length) return null;
  const [lm, ld] = daysLines(people);
  return (
    <p
      className={`hero-note consult-slot${className ? ` ${className}` : ''}`}
      style={{ marginTop: 14, '--lm': lm, '--ld': ld } as React.CSSProperties}
    >
      <ConsultDays people={people} location="hero-next-article" />
    </p>
  );
}

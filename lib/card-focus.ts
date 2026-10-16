import type { Practitioner } from '@/lib/practitioners';
import { OFFERINGS } from '@/lib/practitioner-facts';

/* THE ONE LINE UNDER A COUNSELLOR'S NAME ON A CARD — 15 Oct 2026 (item 531).
 *
 * The card read her first three focus labels whatever page it sat on, so on
 * /online-counselling/mission/couples-therapy (395 impressions at 25.2, no
 * clicks) the only counsellor shown for couples work was described as
 * "Trauma, Anxiety and chronic stress, Grief, loss and life transitions".
 *
 * On a page about a service, that service leads, then two focus labels. The
 * label is the practice's own (OFFERINGS) and is used only when the roster
 * lists the service for her, so a card can never offer what she does not do.
 * Individual counselling adds nothing a card does not already say, so an
 * individual-therapy page keeps the three focus labels. */
export function cardFocusLine(p: Pick<Practitioner, 'services' | 'focus'>, service?: string): string[] {
  const offered = service && service !== 'individual-therapy' && p.services.includes(service)
    ? OFFERINGS.find((o) => o.service === service)
    : undefined;
  const focus = p.focus.map((f) => f.label);
  if (!offered) return focus.slice(0, 3);
  return [offered.label.charAt(0).toUpperCase() + offered.label.slice(1), ...focus.slice(0, 2)];
}

import { excludedBrowser } from '@/lib/analytics';

/* THE TWO CONVERSIONS GOOGLE ANALYTICS COULD NOT SEE — 16 Oct 2026 (item 588).
 *
 * Enquiries are counted on the server when they are stored
 * (lib/inbound-submit.ts), and a consultation is confirmed inside Cliniko's
 * frame, so GA4 had page views and no lead at all. This sends GA4's
 * recommended `generate_lead` event, with `form` saying which, at the two
 * moments the browser knows one happened: the enquiry form's confirmation
 * (components/InboundForm, /message-sent) and Cliniko's confirmation
 * (components/SchedulerTelemetry).
 *
 * GA only. It is not a TrackedEvent and does not reach /api/track: the
 * first-party counter already has enquiry_submit and scheduler_booked, so
 * nothing is counted twice there. A no-op without consent (gtag exists only
 * once ConsentGate has loaded GA), in a browser /admin has excluded, and
 * whenever anything throws. Not imported by the root layout. */
export type LeadForm = 'enquiry' | 'consult';

let last = '';

export function gaLead(form: LeadForm): void {
  try {
    if (typeof window === 'undefined' || excludedBrowser() || !window.gtag) return;
    /* Once per form per address: a page holding two confirmations, or a
       re-render, does not send the same lead twice. */
    const key = `${form}|${window.location.pathname}${window.location.search}`;
    if (key === last) return;
    last = key;
    window.gtag('event', 'generate_lead', { form });
  } catch {
    /* analytics is never load-bearing */
  }
}

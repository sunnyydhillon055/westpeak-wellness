import { api, headers, patientByEmail } from '@/lib/cliniko';
import { CONSULT_TYPE } from '@/lib/site';
import { isConsultAppointment } from '@/lib/booking-shape';
import { practitionerIdOf, typeIdOf, type ApptLite } from '@/lib/booking-followups';
import { money, type Catalog } from '@/lib/cliniko-catalog';

/* ============================================================================
   WHAT THE SIGNED-IN CLIENT HAS BOOKED — 1 Oct 2026
   ----------------------------------------------------------------------------
   The portal invitation (lib/portal-invite.ts) promises clients they can "see
   upcoming appointments", and the portal showed none: it embedded a calendar
   and asked them to choose their counsellor again, every time. This reads the
   signed-in client's own appointments from Cliniko so the page can say what
   is next, and open on the counsellor they last saw.

   Server only, and only ever for the signed-in address. It returns ids and
   times, nothing clinical, and nothing is stored. Any failure returns null,
   and the page then renders exactly as it did before this existed.
   ========================================================================= */

export type PortalAppt = { id: string; startsAt: string; practitionerId: string; typeId: string; isConsult: boolean };
export type PortalSummary = {
  /** Not cancelled, not archived, starting after now; soonest first, at most five. */
  upcoming: PortalAppt[];
  /** The Cliniko practitioner id of the latest appointment that took place. */
  lastPractitionerId: string | null;
};

/** Pure: the summary from the patient's appointment list. Exported for the test. */
export function portalSummary(appts: ApptLite[], now: number): PortalSummary {
  const live = appts.filter((a) => !a.cancelled_at && !a.archived_at);
  const t = (a: ApptLite) => Date.parse(a.starts_at ?? '');
  const upcoming = live
    .filter((a) => Number.isFinite(t(a)) && t(a) > now)
    .sort((a, b) => t(a) - t(b))
    .slice(0, 5)
    .map((a) => ({
      id: String(a.id),
      startsAt: a.starts_at as string,
      practitionerId: practitionerIdOf(a),
      typeId: typeIdOf(a),
      isConsult: isConsultAppointment(a, CONSULT_TYPE),
    }));
  let last: ApptLite | null = null;
  for (const a of live) {
    const end = Date.parse((a.ends_at || a.starts_at) ?? '');
    if (a.did_not_arrive || !Number.isFinite(end) || end > now) continue;
    if (!last || t(last) < t(a)) last = a;
  }
  const lastPractitionerId = last ? practitionerIdOf(last) || null : null;
  return { upcoming, lastPractitionerId };
}

/** The signed-in client's summary, or null when Cliniko is not configured,
 *  has no patient at this address, or fails in any way. */
export async function readPortalAppointments(email: string, now = Date.now()): Promise<PortalSummary | null> {
  const conn = api();
  if (!conn || !email) return null;
  try {
    const patient = await patientByEmail(email);
    if (!patient) return null;
    const first = new URL(patient.appointmentsUrl);
    first.searchParams.set('per_page', '100');
    first.searchParams.set('sort', 'starts_at:desc');
    const appts: ApptLite[] = [];
    let url: string | null = first.toString();
    /* Newest first, three pages at most: a portal page is not a report, and
       what it needs, what is next and who was seen last, is on the first. */
    for (let page = 0; page < 3 && url; page++) {
      const res: Response = await fetch(url, { headers: headers(conn.key), cache: 'no-store', signal: AbortSignal.timeout(4000) });
      if (!res.ok) return null;
      const body = (await res.json()) as { appointments?: ApptLite[]; links?: { next?: string } };
      appts.push(...(body.appointments ?? []));
      const next = body.links?.next;
      url = typeof next === 'string' && next && next !== url ? next : null;
    }
    return portalSummary(appts, now);
  } catch {
    return null;
  }
}

/* THE PAID TYPES A COUNSELLOR OFFERS, priced from the catalogue.
 *
 * The roster records services by slug; the catalogue prices appointment
 * types by name. This is the bridge, and it names types, never amounts: every
 * figure comes from the catalogue via money(), so there is no new place a fee
 * is typed. A type the catalogue does not hold, holds at no price, or does
 * not offer online is left out rather than guessed. */
const SERVICE_TYPES: Record<string, string[]> = {
  'individual-therapy': ['Individual Counselling'],
  'couples-therapy': ['Couples Counselling', 'Couples Extended'],
  'emdr-therapy': ['EMDR Intensive'],
};

export type PaidType = { id: string; name: string; minutes: number; fee: string };

export function paidTypesFor(services: string[], catalog: Catalog): PaidType[] {
  const names = new Set(services.flatMap((s) => SERVICE_TYPES[s] ?? []).map((n) => n.toLowerCase()));
  return catalog.items
    .filter((i) => names.has(i.name.toLowerCase()) && i.cents > 0 && i.onlineBookable)
    .map((i) => ({ id: i.id, name: i.name, minutes: i.minutes, fee: money(i.cents) }));
}

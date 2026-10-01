/* THE JOINS THE MONTHLY FUNNEL REPORT NEVER MADE — 1 Oct 2026.
 *
 * The report counted consultations and paid sessions as two unrelated
 * numbers, and messages as a third. The question the practice depends on is
 * the join between them: of the people who had the free 30-minute
 * consultation, how many went on to book a paid session, with whom, where
 * they heard of the practice, and whether the people who wrote first ever
 * booked at all. A $0 consultation is only worth its hour if that ratio is
 * known.
 *
 * Everything here is pure: appointments, patients and enquiries go in, and
 * counts come out. No ids, no names, no email addresses in any return value
 * that leaves this module through the report; patient keys exist only inside
 * a function's own scope. The I/O is in lib/funnel-report.ts, so a fixture
 * test can reach every rule here without a Cliniko key.
 */

import { idFromLink, type LinkedLike } from '@/lib/practitioner-for';

export type Appt = {
  starts_at?: string;
  cancelled_at?: string | null;
  archived_at?: string | null;
  did_not_arrive?: boolean | null;
  appointment_type?: LinkedLike;
  practitioner?: LinkedLike;
  patient?: LinkedLike;
};

export type ConsultOutcome = {
  consultsHeld: number;
  convertedToPaid: number;
  notYet: number;
  cancelled: number;
  dna: number;
};

const zero = (): ConsultOutcome => ({ consultsHeld: 0, convertedToPaid: 0, notYet: 0, cancelled: 0, dna: 0 });

export type JoinOpts = {
  /** Window the consultations STARTED in, [from, to). */
  from: Date;
  to: Date;
  consultTypeId: string;
  /** Roster slug for an appointment; 'unknown' when off the roster. */
  slugFor: (ap: Appt) => string;
  /** A paid booking counts when it starts within this many days after the
   *  consultation. */
  withinDays: number;
};

const t = (iso: string | undefined | null) => (iso ? Date.parse(iso) : NaN);
const typeId = (ap: Appt) => idFromLink(ap.appointment_type);
const isConsult = (ap: Appt, consultTypeId: string) => !!consultTypeId && typeId(ap) === consultTypeId;
const live = (ap: Appt) => !ap.cancelled_at && !ap.archived_at;

/** Every appointment by patient, earliest first. Appointments with no
 *  patient link cannot be joined and are left out. */
export function byPatient(appts: Appt[]): Map<string, Appt[]> {
  const m = new Map<string, Appt[]>();
  for (const ap of appts) {
    const k = idFromLink(ap.patient);
    if (!k || !Number.isFinite(t(ap.starts_at))) continue;
    const list = m.get(k) ?? [];
    list.push(ap);
    m.set(k, list);
  }
  for (const list of m.values()) list.sort((a, b) => t(a.starts_at) - t(b.starts_at));
  return m;
}

/** One consultation held in the window, as the joins below need it. The
 *  patient key never leaves the report's own process. */
export type HeldConsult = { patient: string; slug: string; converted: boolean };

/** Consultations that started in the window, classified, and the held ones
 *  listed for the source and city cuts. */
export function classifyConsults(appts: Appt[], o: JoinOpts): { bySlug: Record<string, ConsultOutcome>; held: HeldConsult[] } {
  const grouped = byPatient(appts);
  const bySlug: Record<string, ConsultOutcome> = {};
  const held: HeldConsult[] = [];
  const within = o.withinDays * 864e5;

  for (const ap of appts) {
    if (!isConsult(ap, o.consultTypeId) || ap.archived_at) continue;
    const start = t(ap.starts_at);
    if (!Number.isFinite(start) || start < o.from.getTime() || start >= o.to.getTime()) continue;

    const slug = o.slugFor(ap) || 'unknown';
    const row = (bySlug[slug] ??= zero());
    if (ap.cancelled_at) { row.cancelled++; continue; }
    if (ap.did_not_arrive) { row.dna++; continue; }

    row.consultsHeld++;
    const patient = idFromLink(ap.patient);
    /* A later appointment for the same person that is not a consultation and
       was not cancelled. A paid session they then missed still counts: it was
       booked, and booking is the conversion. */
    const converted = !!patient && (grouped.get(patient) ?? []).some((x) =>
      x !== ap && live(x) && !isConsult(x, o.consultTypeId)
      && t(x.starts_at) > start && t(x.starts_at) - start <= within
    );
    if (converted) row.convertedToPaid++;
    else row.notYet++;
    held.push({ patient, slug, converted });
  }
  return { bySlug, held };
}

/** Consult-to-paid by roster slug. Counts only. */
export function consultToPaid(appts: Appt[], o: JoinOpts): Record<string, ConsultOutcome> {
  return classifyConsults(appts, o).bySlug;
}

export function totalOf(by: Record<string, ConsultOutcome>): ConsultOutcome {
  const sum = zero();
  for (const r of Object.values(by)) {
    sum.consultsHeld += r.consultsHeld;
    sum.convertedToPaid += r.convertedToPaid;
    sum.notYet += r.notYet;
    sum.cancelled += r.cancelled;
    sum.dna += r.dna;
  }
  return sum;
}

/* ---- where they heard of the practice, and where they live -------------- */

/** The fixed list the owner is asked to require on new online bookings
 *  (Cliniko, Settings, Online bookings). Anything else typed lands in
 *  'other'; nothing at all is 'not recorded'. */
export const SOURCE_BUCKETS = [
  'Google search',
  'Google Maps / Business Profile',
  'AI assistant',
  'BCACC directory',
  'other free listing',
  'family doctor',
  'employer or EAP',
  'friend or family',
  'other',
  'not recorded',
] as const;
export type SourceBucket = (typeof SOURCE_BUCKETS)[number];

/** The referral source Cliniko holds on a patient, as text. It has been a
 *  plain string on the patient record; an object with a name is read too, so
 *  a change of shape reads as data rather than as 'not recorded'. */
export function referralText(v: unknown): string {
  if (typeof v === 'string') return v.trim();
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    for (const k of ['name', 'description', 'label', 'referral_source_type_name', 'notes']) {
      if (typeof o[k] === 'string' && (o[k] as string).trim()) return (o[k] as string).trim();
    }
  }
  return '';
}

export function sourceBucket(raw: unknown): SourceBucket {
  const s = referralText(raw).toLowerCase();
  if (!s) return 'not recorded';
  const exact = SOURCE_BUCKETS.find((b) => b.toLowerCase() === s);
  if (exact) return exact;
  /* Order matters: "family doctor" before "friend or family", and Maps
     before plain Google. */
  if (/maps|business profile|\bgbp\b/.test(s)) return 'Google Maps / Business Profile';
  if (/google|search engine|searched/.test(s)) return 'Google search';
  if (/chatgpt|gemini|claude|perplexity|copilot|\bai\b|assistant/.test(s)) return 'AI assistant';
  if (/bcacc/.test(s)) return 'BCACC directory';
  if (/doctor|physician|\bgp\b|\bmd\b/.test(s)) return 'family doctor';
  if (/employer|\beap\b|\bwork/.test(s)) return 'employer or EAP';
  if (/friend|family|word of mouth|referred by/.test(s)) return 'friend or family';
  if (/directory|listing|psychology today|yelp|\bbing\b/.test(s)) return 'other free listing';
  return 'other';
}

export type CityPlace = { slug: string; city: string; communities?: string[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, ' ').trim();

/** The lib/locations.ts slug a typed city belongs to, or '' when none. */
export function citySlug(city: unknown, places: CityPlace[]): string {
  const c = typeof city === 'string' ? norm(city) : '';
  if (!c) return '';
  for (const p of places) {
    if (norm(p.city) === c || norm(p.slug.replace(/-/g, ' ')) === c) return p.slug;
    if ((p.communities ?? []).some((x) => norm(x) === c)) return p.slug;
  }
  return '';
}

export const OTHER_PLACE = 'other BC/AB';
export const NO_PLACE = 'not recorded';
/** Fewer consultations than this from one city and it is folded into
 *  OTHER_PLACE, so nobody can be picked out of a small town's count. */
export const MIN_CITY = 3;

export type Converted = { consultsHeld: number; convertedToPaid: number };

/** Held consultations by source and by city. Both cuts sum to the number of
 *  held consultations, because a patient whose record could not be read is
 *  counted as 'not recorded' rather than dropped. */
export function sourceAndCity(
  held: HeldConsult[],
  patients: Map<string, { referral?: unknown; city?: unknown } | null>,
  places: CityPlace[],
): { bySource: Record<string, Converted>; byCity: Record<string, Converted> } {
  const bySource: Record<string, Converted> = {};
  const rawCity: Record<string, Converted> = {};
  const add = (m: Record<string, Converted>, k: string, converted: boolean) => {
    const r = (m[k] ??= { consultsHeld: 0, convertedToPaid: 0 });
    r.consultsHeld++;
    if (converted) r.convertedToPaid++;
  };
  for (const h of held) {
    const p = patients.get(h.patient) ?? null;
    add(bySource, sourceBucket(p?.referral), h.converted);
    const hasCity = typeof p?.city === 'string' && p.city.trim() !== '';
    add(rawCity, hasCity ? (citySlug(p!.city, places) || OTHER_PLACE) : NO_PLACE, h.converted);
  }
  const byCity: Record<string, Converted> = {};
  for (const [k, v] of Object.entries(rawCity)) {
    const key = k !== NO_PLACE && k !== OTHER_PLACE && v.consultsHeld < MIN_CITY ? OTHER_PLACE : k;
    const r = (byCity[key] ??= { consultsHeld: 0, convertedToPaid: 0 });
    r.consultsHeld += v.consultsHeld;
    r.convertedToPaid += v.convertedToPaid;
  }
  return { bySource, byCity };
}

/* ---- written enquiries, followed to a booking ---------------------------- */

export type EnquiryIn = {
  createdAt: string;
  source: string;
  practitioner?: string;
  /** The Cliniko patient this address belongs to: an id, null when Cliniko
   *  has none, 'error' when the lookup failed. Resolved by the caller and
   *  never returned. */
  patient: string | null | 'error';
};

export type EnquiryRow = {
  enquiries: number;
  /** Booked a consultation that started after the message. */
  consult: number;
  /** Booked a paid session that started after the message. */
  paid: number;
  /** Already had an appointment before writing: a client, not a lead. */
  existing: number;
};

export type EnquiryOutcomes = {
  total: number;
  bySource: Record<string, EnquiryRow>;
  byPractitioner: Record<string, EnquiryRow>;
  /** Lookups that failed, counted in `enquiries` with no booking. */
  lookupFailed: number;
};

export const NO_PRACTITIONER = 'none named';

export function enquiryOutcomes(enqs: EnquiryIn[], appts: Appt[], consultTypeId: string): EnquiryOutcomes {
  const grouped = byPatient(appts);
  const out: EnquiryOutcomes = { total: 0, bySource: {}, byPractitioner: {}, lookupFailed: 0 };
  const row = (m: Record<string, EnquiryRow>, k: string) => (m[k] ??= { enquiries: 0, consult: 0, paid: 0, existing: 0 });

  for (const e of enqs) {
    out.total++;
    const rs = row(out.bySource, e.source || '/');
    const rp = row(out.byPractitioner, e.practitioner || NO_PRACTITIONER);
    rs.enquiries++; rp.enquiries++;
    if (e.patient === 'error') { out.lookupFailed++; continue; }
    if (!e.patient) continue;

    const at = Date.parse(e.createdAt);
    const list = (grouped.get(e.patient) ?? []).filter((x) => !x.archived_at);
    if (!list.length || !Number.isFinite(at)) continue;
    /* Their first appointment began before they wrote: the message came from
       somebody already in care, and is not counted as a conversion. */
    if (t(list[0].starts_at) < at) { rs.existing++; rp.existing++; continue; }

    const after = list.filter((x) => live(x) && t(x.starts_at) >= at);
    if (after.some((x) => isConsult(x, consultTypeId))) { rs.consult++; rp.consult++; }
    if (after.some((x) => !isConsult(x, consultTypeId))) { rs.paid++; rp.paid++; }
  }
  return out;
}

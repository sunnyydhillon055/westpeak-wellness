import { practitioners } from '@/lib/practitioners';

/* WHICH COUNSELLOR A CLINIKO APPOINTMENT IS WITH — by roster slug.
 *
 * The practitioner link on the appointment ends in Cliniko's id, and the
 * roster carries that id as `clinikoPractitionerId`. lib/booking-notify.ts
 * has the same mapping inline for its alerts (left in place on 1 Oct 2026 so
 * the booking-mail work in flight that day did not have to be merged around
 * it); this is the copy the reports use, and the one to move booking-notify
 * onto next time that file is open.
 *
 * Server only. lib/practitioners.ts is the large roster module and must never
 * reach a 'use client' file. */

export type LinkedLike = { links?: { self?: string } } | null | undefined;

/** The last path segment of a Cliniko link, which is the record's id. */
export function idFromLink(v: LinkedLike | string): string {
  const self = typeof v === 'string' ? v : v?.links?.self;
  if (!self) return '';
  return self.split('?')[0].split('/').filter(Boolean).pop() ?? '';
}

/** The roster slug for a Cliniko practitioner id, or 'unknown'. */
export function slugForPractitionerId(pid: string): string {
  if (!pid) return 'unknown';
  return practitioners.find((x) => x.clinikoPractitionerId === pid)?.slug ?? 'unknown';
}

/** The roster slug for an appointment, or 'unknown' when its practitioner is
 *  not on the roster (or the appointment names none). */
export function practitionerSlugFor(ap: { practitioner?: LinkedLike }): string {
  return slugForPractitionerId(idFromLink(ap.practitioner));
}

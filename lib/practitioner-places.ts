import { locations } from './locations';
import { ALBERTA_LIVE } from './regions';
import type { Province } from './crisis';

/* ============================================================================
   WHERE A PRACTITIONER'S CITY PAGES EXIST, AND WHAT MAKES EACH ONE DIFFERENT
   ----------------------------------------------------------------------------
   Two sources feed this:

     BC      lib/locations.ts, which already carries fifteen cities with real
             local substance — census figures, health authority, the specific
             reason distance matters there.
     AB      the table below, added 1 Sep 2026 when the practice took on a
             counsellor whose certification permits Alberta.

   ALBERTA IS GATED AND STAYS GATED UNTIL INSURANCE IS CONFIRMED.

   Not regulation — counselling therapy is not a regulated profession in
   Alberta, and a CCC covers it. The block is professional liability cover.
   ALBERTA_LAUNCH_CHECKLIST.md records that these pages were live for a few
   hours on 17 Aug 2026 and came straight back down because the practice's
   policy does not extend outside BC. A live page is an advertisement, an
   advertisement produces bookings, and Cliniko has no idea which province
   somebody is sitting in.

   The checklist's own exit is "an insured clinician who can take Alberta
   clients". Camille may be exactly that — but that turns on HER insurance,
   which is not stated on a BCACC card or a CCPA record. So the pages are
   built, complete, and behind `NEXT_PUBLIC_ALBERTA_LIVE`. One environment
   variable publishes them the moment someone can answer the question.

   NO INVENTED STATISTICS, same rule as every city page on this site. The
   Surrey and Abbotsford entries quote exact census counts because those were
   looked up. Nothing equivalent was verified for Calgary or Edmonton, so what
   is written below is qualitative and checkable.
   ========================================================================= */

export type PractitionerPlace = {
  slug: string;
  city: string;
  region: string;
  province: Province;
  /** Hero one-liner. */
  blurb: string;
  /** Why reaching care from here is its own problem. 2 paragraphs. */
  local: string[];
  /** What removing the journey actually changes, for this place. */
  access: { label: string; detail: string }[];
  /** Unique per city — these become the FAQPage schema. */
  faqs: { q: string; a: string }[];
};

const ALBERTA: PractitionerPlace[] = [
  {
    slug: 'calgary',
    city: 'Calgary',
    region: 'Alberta',
    province: 'AB',
    blurb:
      'A city that works long hours and moves fast, with counselling waitlists that do neither.',
    local: [
      'Calgary has counsellors. What it has less of is availability at the hours the city actually works — and a great deal of Calgary works rotational, on-call, or to a schedule set somewhere else. An appointment that assumes a free weekday afternoon is an appointment most people here miss twice and then stop booking.',
      'The other Calgary pattern is the downturn one. Energy-sector employment moves in cycles, and the anxiety that comes with a cycle is not the same thing as an anxiety disorder — it is a rational response to an uncertain year, and it responds to different work. So does the burnout that follows a stretch of holding a household together through one.',
    ],
    access: [
      { label: 'No commute across the city', detail: 'A session from wherever you are, rather than a drive across Deerfoot at the exact hour it does not move.' },
      { label: 'Built for rotational schedules', detail: 'Block-by-block booking with gaps is a normal pattern here, and pausing between blocks costs nothing.' },
      { label: 'Evening appointments', detail: 'Weekday evenings by request — Mountain Time, so the hour on the page is the hour you attend.' },
      { label: 'English or Tagalog', detail: 'Including both within one session, without needing to find it locally.' },
    ],
    faqs: [
      { q: 'Is the counsellor registered in Alberta?', a: 'Counselling therapy is not a regulated profession in Alberta, so there is no provincial college a counsellor can register with. What can be checked is the certification: Canadian Certified Counsellor with the CCPA, plus Registered Clinical Counsellor with the BCACC — both public registers, both listed with numbers on this page.' },
      { q: 'What time zone are appointments in?', a: 'Times shown to you are Mountain Time. Sessions run from British Columbia, an hour behind, which is handled at the booking end so nothing needs converting.' },
      { q: 'Does Alberta Health Care cover counselling?', a: 'No. AHCIP does not cover private counselling. Many Alberta extended health plans do reimburse a Canadian Certified Counsellor — worth confirming the designation with your insurer before booking, because plans vary on which credentials they accept.' },
      { q: 'I work a rotation. Can therapy fit around it?', a: 'Yes, and planning for it at the start works far better than discovering it in month two. Booking in blocks around a rotation, with gaps between them, is an ordinary pattern rather than a compromise.' },
      { q: 'What if I am in crisis tonight?', a: 'This is not a crisis service. In Alberta, call or text 9-8-8 at any hour, or the Alberta Mental Health Help Line at 1-877-303-2642, which is province-wide and 24/7. If you are in immediate danger, call 911.' },
    ],
  },
  {
    slug: 'edmonton',
    city: 'Edmonton',
    region: 'Alberta',
    province: 'AB',
    blurb:
      'Public services with real waitlists, a hard winter, and a lot of shift work that does not fit an appointment.',
    local: [
      'Edmonton is a government, health and university city, which means a large share of the workforce runs on shifts, terms and rotations rather than a standard week. It also means a lot of people are already inside a public system and waiting — and the interval between a referral and a first appointment is precisely where a private option is worth considering, not as a replacement but as something that starts now.',
      'Winter is a practical variable rather than a poetic one. A course of therapy that requires a drive in January is a course of therapy with attendance built on the weather, and the sessions that get missed are rarely the easy ones.',
    ],
    access: [
      { label: 'January stops being a factor', detail: 'No drive, no parking, no cancelled session because the roads are bad.' },
      { label: 'Fits shifts and terms', detail: 'Evening appointments by request, and pausing between blocks rather than dropping out entirely.' },
      { label: 'Something that starts now', detail: 'Useful alongside a public waitlist rather than instead of it — staying in that queue is generally worth doing.' },
      { label: 'English or Tagalog', detail: 'Including moving between the two inside a session.' },
    ],
    faqs: [
      { q: 'Can a BC-based counsellor work with me in Edmonton?', a: 'Counselling therapy is not regulated in Alberta, so practice there is not restricted to a provincial college. The credentials that do apply are stated on this page with their numbers: CCC with the CCPA, and RCC with the BCACC. Both are publicly checkable.' },
      { q: 'Should I come off the public waitlist?', a: 'Generally not. Alberta Health Services runs real services and staying in that queue costs nothing while you start elsewhere. Private counselling alongside a public wait is a parallel route, not a replacement for one.' },
      { q: 'Will my extended health plan reimburse this?', a: 'Many Alberta plans reimburse a Canadian Certified Counsellor, but coverage varies by which designations a plan recognises. Confirm the designation with your insurer before booking — it takes one phone call and it is the answer that decides the real cost.' },
      { q: 'What are the sessions like?', a: 'Fifty minutes by secure video, collaborative and practical. The work looks at what is actually maintaining a pattern rather than only at how it feels, and you leave with something to use.' },
      { q: 'What if I need urgent help?', a: 'This is not a crisis service. In Alberta, call or text 9-8-8 at any hour, or the Alberta Mental Health Help Line at 1-877-303-2642. If you are in immediate danger, call 911.' },
    ],
  },
];

/** BC cities, adapted from the existing location data. */
const BC: PractitionerPlace[] = locations.map((l) => ({
  slug: l.slug,
  city: l.city,
  region: l.region,
  province: 'BC' as Province,
  blurb: l.blurb,
  local: l.intro?.slice(0, 2) ?? [
    `Every session with a client in ${l.city} runs by secure video, so nothing about the fee or the availability changes with where you live.`,
  ],
  access: l.access ?? [],
  faqs: (l.faqs ?? []).slice(0, 5),
}));

/** Every place a practitioner page can exist for. Alberta only when unlocked. */
export const practitionerPlaces: PractitionerPlace[] = [
  ...BC,
  ...(ALBERTA_LIVE ? ALBERTA : []),
];

/** Built regardless of the gate, for the checklist and for previews. */
export const ALBERTA_PLACES = ALBERTA;

export const getPractitionerPlace = (slug: string) =>
  practitionerPlaces.find((p) => p.slug === slug);

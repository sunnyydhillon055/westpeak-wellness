import { locations } from './locations';
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

   ALBERTA IS UNLOCKED PER PRACTITIONER, NOT SITE-WIDE.

   Not regulation — counselling therapy is not a regulated profession in
   Alberta. The block was always professional liability cover, and
   ALBERTA_LAUNCH_CHECKLIST.md records these pages going live for a few hours
   on 17 Aug 2026 and coming straight back down because the practice's policy
   stops at the BC border.

   Resolved 1 Sep 2026 for ONE counsellor. Camille Granda's BMS/Berkley
   certificate is a CCPA national member policy with no provincial restriction,
   its only geographic wording is national ("Canada only", "Out of Country
   90 days"), and her named-insured address is in Calgary. That is the
   checklist's own exit condition — "an insured clinician who can take Alberta
   clients" — met by evidence rather than assumption.

   The practice as a whole is still not covered outside BC, so the site-wide
   /alberta section stays gated and NEXT_PUBLIC_ALBERTA_LIVE stays off. What is
   published is her pages, because they are true about her.

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

/* PER PRACTITIONER, NOT SITE-WIDE — and the distinction is the point.
 *
 * ALBERTA_LIVE ungates the whole /alberta section, which advertises THE
 * PRACTICE in Alberta. The founder's liability policy still does not extend
 * outside BC, so that flag stays off.
 *
 * What changed on 1 Sep 2026 is narrower and real: one counsellor holds a CCPA
 * national policy, lives in Calgary, and can take Alberta clients. Her pages
 * can say so. The practice's cannot.
 *
 * So places are resolved against the PRACTITIONER's own provinces. Camille gets
 * Calgary and Edmonton; anybody added later gets whatever their own insurance
 * and registration actually support, which is the only honest way to do this. */
export function placesFor(provinces: string[]): PractitionerPlace[] {
  return [
    ...(provinces.includes('BC') ? BC : []),
    ...(provinces.includes('AB') ? ALBERTA : []),
  ];
}

/* ============================================================================
   THE CITY COPY IS SHARED. THE LANGUAGE IS NOT.
   ----------------------------------------------------------------------------
   The BC entries above are adapted from lib/locations.ts, which was written for
   the founder's practice — she works in English and Punjabi, and the copy says
   so in the access list, in the FAQs, and in a few of the local paragraphs.

   Rendered under a different counsellor's name, that copy makes a promise about
   her that is not true. Camille Granda works in English and Tagalog. Before this
   existed, 14 of her 17 city pages offered counselling in Punjabi — Richmond
   said "English and Tagalog, including moving between them" and "English or
   Punjabi — Including both within one session" about four hundred words apart,
   and Delta answered "Can I have sessions in Punjabi? Yes" inside FAQPage
   schema, which is eligible to appear in a search result.

   Filtering at render time rather than forking the city data: the local
   substance — the ferry, the tunnel, the highway, the census figures — is true
   about the city whoever is speaking, and duplicating it per counsellor would
   mean fifteen more copies to keep in step. What is practitioner-specific is
   exactly the language, so that is what gets resolved per practitioner.

   Three cities argue their whole case through the founder's language and
   community, and filtering a sentence out of those would leave a hole rather
   than a page. Those carry their own copy in LOCAL_OVERRIDES below.
   ========================================================================= */

type Speaker = {
  slug: string;
  languages: { tag: string; name: string }[];
};

/* Every language the shared city copy can claim, with the words that signal it.
   Cultural shorthand counts: "log kya kahenge" is a Punjabi-practice promise as
   surely as the word Punjabi is. */
const LANGUAGE_CLAIMS: { name: string; rx: RegExp }[] = [
  { name: 'punjabi', rx: /punjabi|log kya kahenge|south asian/i },
  { name: 'tagalog', rx: /tagalog|filipino/i },
];

/* Any mention of a language at all, used to strip the access list down to one
   language line that is then rebuilt from the practitioner. Matching English
   too is deliberate: "English or Punjabi" must go as a unit, not be left as a
   half-sentence about English. */
const ANY_LANGUAGE = /punjabi|tagalog|filipino|english|log kya kahenge|south asian/i;

const foreignTo = (p: Speaker) => {
  const speaks = new Set(p.languages.map((l) => l.name.toLowerCase()));
  const foreign = LANGUAGE_CLAIMS.filter((c) => !speaks.has(c.name));
  return (text: string) => foreign.some((c) => c.rx.test(text));
};

/* One access line, built from the practitioner's own record. Every city gets
   exactly one of these — including the cities whose shared copy never had a
   language line — so the claim is consistent across her pages and comes from
   one place. */
const languageAccess = (p: Speaker) => {
  const names = p.languages.map((l) => l.name);
  return names.length > 1
    ? {
        label: names.join(' or '),
        detail: 'Including moving between them inside one session, which is how most bilingual people actually think.',
      }
    : { label: `Sessions in ${names[0]}`, detail: 'Plain language, no jargon to decode.' };
};

const languageFaq = (p: Speaker) => {
  const names = p.languages.map((l) => l.name);
  const second = names[1] ?? names[0];
  return {
    q: `Can sessions be in ${second}?`,
    a: `Yes — in ${names.join(' or ')}, or moving between them as the conversation needs. Most people switch without planning to, particularly when something is hard to say, and nothing about the session requires picking one and staying there.`,
  };
};

/* Cities whose shared copy argues its case through the founder's language and
   community. Camille's version keeps the local problem and drops the claim. */
const LOCAL_OVERRIDES: Record<string, Record<string, { blurb?: string; local?: string[] }>> = {
  'camille-granda': {
    surrey: {
      blurb: 'A city big enough to have counsellors, and still short of the ones people are actually looking for.',
      local: [
        'Surrey is one of the fastest-growing cities in Canada, and the counselling here has not grown with it at the same rate. The lists are long, and the people who get seen quickest are usually the ones who can take a weekday afternoon off to do it.',
        'It is also a city that works shifts — healthcare, the airport, warehousing, care work. A standing Tuesday at two does not survive a rotating roster, and an appointment you keep missing turns into an appointment you stop booking. Sessions by video, in the evening if that is what fits, remove the part that was breaking.',
      ],
    },
    abbotsford: {
      local: [
        'Abbotsford is far enough from the Lower Mainland that an in-person appointment can mean a real drive, and close enough that people are told to make it anyway. An hour each way around a working day is the reason a lot of counselling here stops after session three.',
        'A great deal of the valley also works to seasons and shifts rather than to office hours. Booking in blocks with gaps between them is an ordinary pattern rather than a compromise, and pausing between blocks costs nothing.',
      ],
    },
    richmond: {
      local: [
        "Richmond has real counselling capacity, and much of it is built — correctly — around the city's Chinese-speaking communities. If that is not what you are looking for, the field narrows fast, and people routinely end up searching Vancouver or Surrey instead.",
        'The airport and the port are also large local employers, on rosters that change. A session you can attend from home between shifts is worth more than one you could theoretically drive to and keep missing.',
      ],
    },
  },
};

/* Resolve a shared city record against the counsellor whose page it is. */
export function resolvePlace(place: PractitionerPlace, p: Speaker): PractitionerPlace {
  const isForeign = foreignTo(p);
  const ov = LOCAL_OVERRIDES[p.slug]?.[place.slug];

  const local = ov?.local ?? place.local.filter((t) => !isForeign(t));
  const blurb =
    ov?.blurb ??
    (isForeign(place.blurb)
      ? `Online counselling for ${place.city}, on the same terms as anywhere else in ${place.region}.`
      : place.blurb);

  /* Exactly one language line, rebuilt from the practitioner. */
  const access = [
    ...place.access.filter((a) => !ANY_LANGUAGE.test(`${a.label} ${a.detail}`)),
    languageAccess(p),
  ];

  /* A dropped language FAQ is replaced rather than simply removed — the
     question is one people genuinely ask, and the honest answer is still
     useful. */
  const keptFaqs = place.faqs.filter((f) => !isForeign(`${f.q} ${f.a}`));
  const faqs = keptFaqs.length === place.faqs.length ? keptFaqs : [...keptFaqs, languageFaq(p)];

  return { ...place, blurb, local, access, faqs };
}

/** Every place any practitioner can have a page for. Used for route generation. */
export const practitionerPlaces: PractitionerPlace[] = [
  ...BC,
  ...ALBERTA,
];

/** Built regardless of the gate, for the checklist and for previews. */
export const ALBERTA_PLACES = ALBERTA;

export const getPractitionerPlace = (slug: string) =>
  practitionerPlaces.find((p) => p.slug === slug);

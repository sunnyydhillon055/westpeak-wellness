/* WHERE SOMEBODY IS SITTING WHEN THEY LOOK FOR A COUNSELLOR.
 *
 * WHY THIS FILE IS NOT A LIST OF CITY NAMES
 *
 * lib/locations.ts retired 37 city pages on the reasoning that a templated
 * "counselling in <city>" page competes only against directories and clinics
 * with real addresses, and loses. That reasoning was amended on 2026-08-13:
 * templated city pages lose when the DOMAIN has no authority to push them, not
 * because the idea is wrong — Clearheart runs ~29 of them and ranks page one.
 * The amendment says the retirement is staged, not permanent, and sets one
 * condition for bringing a city back: a genuinely deep page must be writable.
 *
 * This file is that condition, made structural. A city gets an entry only when
 * these fields can be filled with something TRUE and CHECKABLE that changes
 * what the page says. Not a population figure with the noun swapped — the
 * actual referral route, the actual travel reality, the actual reason virtual
 * care changes the calculus in that specific place.
 *
 * The health authority is the load-bearing fact. BC splits public mental-health
 * intake five ways, and which one covers you determines the waitlist you join,
 * the number you call, and whether a specialist exists within driving distance.
 * It is stable, it is verifiable in one click, and it is genuinely different
 * from city to city — which is exactly what a city page needs and what a
 * templated one never has.
 *
 * WHAT IS DELIBERATELY ABSENT
 *
 * No wait-time figures. They are quoted everywhere and sourced almost nowhere,
 * they move constantly, and a number this practice cannot stand behind would
 * be the one claim on the page a reader could catch out. The pages say what
 * the route IS, not how long it takes.
 *
 * No population statistics used as filler. "Surrey has X residents" tells a
 * person looking for a counsellor nothing they did not already know.
 */

export type HealthAuthority =
  | 'Fraser Health'
  | 'Vancouver Coastal Health'
  | 'Island Health'
  | 'Interior Health'
  | 'Northern Health';

/* Every one of these was requested and the LANDED url compared against the
 * requested one, not merely checked for a 200.
 *
 * That distinction cost two of the five. Fraser Health answers
 * /services/mental-health-and-substance-use with HTTP 200 and serves
 * /page-not-found — a soft 404, which link-rot.mjs passes because it is
 * checking the status code. Interior Health returns an honest 404 on the
 * equivalent path. Both would have shipped as citations that go nowhere on
 * twenty-five of the fifty new pages.
 *
 * Checked 28 August 2026. If one of these starts landing somewhere unexpected,
 * compare the landed URL — a 200 is not evidence the page exists. */
export const AUTHORITY_URL: Record<HealthAuthority, string> = {
  'Fraser Health': 'https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use',
  'Vancouver Coastal Health': 'https://www.vch.ca/en/service/mental-health-substance-use-services',
  'Island Health': 'https://www.islandhealth.ca/our-services/mental-health-substance-use-services',
  'Interior Health': 'https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services',
  'Northern Health': 'https://www.northernhealth.ca/services/mental-health-substance-use',
};

export type CityContext = {
  slug: string;
  city: string;
  /** How the city is referred to mid-sentence: "in Surrey", "on the North Shore". */
  inCity: string;
  region: string;
  authority: HealthAuthority;
  /** The travel reality that makes virtual care different HERE, specifically. */
  travel: string;
  /** What looking for this in person actually involves locally. */
  inPerson: string;
  /** The one thing virtual changes that a local reader will recognise as true. */
  unlock: string;
  /** Neighbouring slugs, for genuine cross-links rather than a footer dump. */
  nearby: string[];
};

export const cityContexts: CityContext[] = [
  {
    slug: 'vancouver',
    city: 'Vancouver',
    inCity: 'in Vancouver',
    region: 'Metro Vancouver',
    authority: 'Vancouver Coastal Health',
    travel:
      'Vancouver has more counsellors per resident than anywhere else in the province, and the constraint is almost never distance — it is that the ones taking new clients are booked, and the commute to a downtown or Kitsilano office at 5pm costs more time than the session itself.',
    inPerson:
      'There is no shortage of private practices here. What there is a shortage of is openings: the practices with the strongest reputations tend to hold waitlists, and a clinic that can see you this month is often one you found because nobody else could take you.',
    unlock:
      'Removing the commute is not a small convenience in this city. A 50-minute session that costs ninety minutes of travel either side is the appointment people quietly stop attending around week six.',
    nearby: ['burnaby', 'surrey'],
  },
  {
    slug: 'surrey',
    city: 'Surrey',
    inCity: 'in Surrey',
    region: 'Fraser Health region',
    authority: 'Fraser Health',
    travel:
      'Surrey is large enough that "in Surrey" can mean a forty-minute drive across it. A clinic in Guildford is not local to someone in South Surrey, and the SkyTrain does not solve it once you are east of the city centre.',
    inPerson:
      'Public intake runs through Fraser Health, and private practices cluster around the city centre and Guildford rather than spreading evenly. For a lot of Surrey residents the nearest practice with the right specialism is in Langley or Burnaby.',
    unlock:
      'Sessions in Punjabi as well as English, without needing the counsellor who speaks your language to also happen to have an office you can reach. For a lot of families here that combination has never previously existed within driving distance.',
    nearby: ['langley', 'burnaby'],
  },
  {
    slug: 'burnaby',
    city: 'Burnaby',
    inCity: 'in Burnaby',
    region: 'Metro Vancouver',
    authority: 'Fraser Health',
    travel:
      'Burnaby sits between two health authorities in practice if not on paper — residents routinely look for care in Vancouver and end up on a different intake route than they expected.',
    inPerson:
      'Public mental-health intake for Burnaby runs through Fraser Health, not Vancouver Coastal, which surprises people who work downtown and assume the city they commute to is the one that covers them. Private practices here are fewer than the population would suggest, and many people simply travel west.',
    unlock:
      'Not travelling west. A virtual session removes the assumption that serious counselling has to happen in Vancouver and be fitted around a commute in both directions.',
    nearby: ['vancouver', 'surrey'],
  },
  {
    slug: 'abbotsford',
    city: 'Abbotsford',
    inCity: 'in Abbotsford',
    region: 'Fraser Valley',
    authority: 'Fraser Health',
    travel:
      'Abbotsford is far enough east that Metro Vancouver practices are a genuine drive rather than a nuisance — Highway 1 at the wrong hour turns a session into most of an afternoon.',
    inPerson:
      'The Fraser Valley has fewer counsellors per resident than Metro Vancouver, and specialised work in particular thins out quickly east of Langley. People here are used to being told the nearest option is in Surrey.',
    unlock:
      'Specialised counselling without the highway. The choice stops being "the counsellor nearby or the right counsellor" and becomes simply the right counsellor.',
    nearby: ['chilliwack', 'langley'],
  },
  {
    slug: 'langley',
    city: 'Langley',
    inCity: 'in Langley',
    region: 'Fraser Valley',
    authority: 'Fraser Health',
    travel:
      'Langley is two municipalities that share a name, and a practice "in Langley" may be in the City or anywhere across the Township — which for a resident of Aldergrove or Brookswood is not the same thing at all.',
    inPerson:
      'Langley is well served for general counselling and thin for specialised work. The usual advice is to look toward Surrey or Abbotsford, both of which are a real drive at the end of a working day.',
    unlock:
      'A specialism you would otherwise drive for, delivered to whichever part of the Township you actually live in.',
    nearby: ['surrey', 'abbotsford'],
  },
  {
    slug: 'chilliwack',
    city: 'Chilliwack',
    inCity: 'in Chilliwack',
    region: 'Eastern Fraser Valley',
    authority: 'Fraser Health',
    travel:
      'Chilliwack is the point where the Fraser Valley stops being commutable. A Metro Vancouver appointment is a two-hour round trip in good conditions, and winter on Highway 1 does not offer good conditions reliably.',
    inPerson:
      'Local private practice exists but is small, and a specific modality — EMDR, structured couples work — often is not available locally at all. Fraser Health covers public intake, with the nearest specialist services generally further west.',
    unlock:
      'Access that does not degrade with distance from Vancouver. The same counsellor, the same modality, whether you are in Sardis or downtown.',
    nearby: ['abbotsford', 'langley'],
  },
  {
    slug: 'victoria',
    city: 'Victoria',
    inCity: 'in Victoria',
    region: 'Vancouver Island',
    authority: 'Island Health',
    travel:
      'Victoria is a ferry or a flight from the mainland, which means the specialist pool is genuinely bounded rather than merely inconvenient. If the practitioner you need is in Vancouver, "going to see them" is a day.',
    inPerson:
      'Island Health runs public intake, and the private sector in Greater Victoria is active but finite. When a specific approach is not represented on the Island, the fallback has historically been to travel or to go without.',
    unlock:
      'The strait stops being a factor. Virtual care is the one arrangement where being on the Island costs nothing at all in access.',
    nearby: ['vancouver'],
  },
  {
    slug: 'kelowna',
    city: 'Kelowna',
    inCity: 'in Kelowna',
    region: 'Okanagan',
    authority: 'Interior Health',
    travel:
      'Kelowna serves as the referral hub for much of the Okanagan, which means local practices absorb demand from Vernon, West Kelowna and Penticton as well as the city itself.',
    inPerson:
      'Interior Health covers public intake across the region. Private practice in Kelowna is comparatively strong for the Interior, which is precisely why it is busy — being the best-served city in a thinly-served region is not the same as being well served.',
    unlock:
      'Not competing with the whole Okanagan for the same handful of local appointments.',
    nearby: ['kamloops'],
  },
  {
    slug: 'kamloops',
    city: 'Kamloops',
    inCity: 'in Kamloops',
    region: 'Thompson-Nicola',
    authority: 'Interior Health',
    travel:
      'Kamloops is a hub for a very large and very sparse catchment. People drive in from Merritt, Chase and Barriere, and in winter that drive is a real deterrent rather than a theoretical one.',
    inPerson:
      'Interior Health runs public intake. The local private sector is small relative to the area it effectively serves, and specialised modalities are not reliably represented.',
    unlock:
      'Weather stops being a reason to miss a session. A snowed-in highway does not cancel a video appointment.',
    nearby: ['kelowna'],
  },
  {
    slug: 'prince-george',
    city: 'Prince George',
    inCity: 'in Prince George',
    region: 'Northern BC',
    authority: 'Northern Health',
    travel:
      'Prince George is the largest city in the north and the referral centre for an area larger than most countries. "The nearest specialist" can mean a flight, not a drive.',
    inPerson:
      'Northern Health covers a catchment with the thinnest counselling coverage in the province. For specialised work the honest local answer has often been that it is not available here.',
    unlock:
      'Northern BC and Metro Vancouver get the same counsellor. Virtual care is the only arrangement in which that sentence is true.',
    nearby: ['kamloops'],
  },
];

export const getCityContext = (slug: string) => cityContexts.find((c) => c.slug === slug);

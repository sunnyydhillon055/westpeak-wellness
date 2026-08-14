/**
 * Punjabi-speaking counselling, by region — the English-language cluster.
 *
 * WHY THIS EXISTS
 * Every Punjabi-speaking counsellor in BC with a physical office is in Surrey,
 * Abbotsford or Vancouver. Sampled competitors on "Punjabi counselling Surrey"
 * — Atlas Clinical Counselling, Hundal Counselling Centre, Tidal Trauma — are
 * all Lower Mainland. Psychology Today and CounsellingBC both run Punjabi
 * language filters, and both are effectively Lower Mainland lists too.
 *
 * Outside that corner of the province, a virtual practice is not a cheaper
 * alternative to seeing someone in person. It is the only option that exists.
 * That is a different competitive position from every other page on this site:
 * here the practice is not competing for a slot, it is the answer.
 *
 * WHY THESE PAGES ARE IN ENGLISH
 * Somebody looking for therapy in Punjabi overwhelmingly types the query in
 * English — "punjabi speaking counsellor prince george". The Gurmukhi surface
 * at /punjabi is for people who want to *read* in Punjabi, which is a smaller
 * and later moment. English pages carry the search traffic; the Gurmukhi page
 * carries the reassurance. Both are needed and they are not duplicates.
 *
 * WHY ONLY THREE REGIONS
 * Every population figure below is from the 2021 census and is checkable at
 * the cited source. Nanaimo, the Kootenays and the Peace are equally real
 * opportunities, but I could not source Punjabi-language or South Asian
 * population figures for them at the same standard, and a page whose central
 * claim is "there are people like you here" cannot be built on an estimate.
 * They stay out until the numbers are found. Three pages that are true beat
 * seven that are padded — the same lesson the 37 retired city pages taught.
 *
 * The counsellor-name rule holds here as everywhere: no name on these pages.
 */

export type PunjabiRegion = {
  slug: string;
  region: string;          // display name, e.g. "Prince George"
  wider: string;           // e.g. "Northern BC"
  metaDescription: string; // <= 155 chars
  blurb: string;           // hero one-liner

  /** The demographic fact the page rests on. Must be sourced. */
  demography: { stat: string; body: string[] };

  /** What is actually available locally, stated fairly. */
  localReality: { h2: string; body: string[] };

  /** Why virtual specifically, here. */
  access: { label: string; detail: string }[];

  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  nearby?: string[];
};

export const punjabiRegions: PunjabiRegion[] = [
  {
    slug: 'kamloops',
    region: 'Kamloops',
    wider: 'the Thompson-Nicola',
    blurb:
      'South Asian residents are the largest racialized group in Kamloops, and Punjabi is the most common non-official language spoken at home. Punjabi-speaking counsellors are not.',
    metaDescription:
      'Punjabi-speaking online counselling for Kamloops and the Thompson-Nicola. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'South Asian residents are the largest racialized group in Kamloops — about 4,260 people, 4.5% of the city.',
      body: [
        'That is not a rounding error, and it is not a recent curiosity. In the 2021 census, South Asian was the **largest racialized group in Kamloops**, ahead of every other, at roughly 4,260 people. Punjabi is the most commonly spoken non-official language in Kamloops homes.',
        'Set that against the supply of Punjabi-speaking clinical counsellors in the Thompson-Nicola, which is close to zero. Every Punjabi-speaking counsellor in BC with an office is roughly four hours down the Coquihalla, in Surrey, Abbotsford or Vancouver.',
        'The gap is not that Kamloops lacks counsellors. It is that the counsellors in Kamloops, who may be excellent, cannot hold a session in the language a family argument actually happened in.',
      ],
    },
    localReality: {
      h2: 'What is actually available in Kamloops',
      body: [
        'Interior Health runs mental-health and substance-use services in Kamloops, including assessment, treatment and referral. If you are already connected to those services, staying connected is worth doing — private virtual counselling is a parallel option, not a replacement for public care you already have.',
        'There are private counsellors in Kamloops, and a number of them are very good. The question this page answers is narrower: whether you can be counselled **in Punjabi**, and for that the local answer is almost always no.',
        'That matters more than it sounds. People do not experience grief, shame, or a parent\'s disapproval in their second language. They translate it afterwards. Therapy conducted entirely in translation costs something real — nuance, speed, and the particular relief of not having to explain the context before you can describe the feeling.',
      ],
    },
    access: [
      {
        label: 'No four-hour drive',
        detail: 'The nearest Punjabi-speaking counsellor with an office is in the Lower Mainland. Sessions here happen wherever you have a private room and a connection.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Most sessions move between the two. Clinical terms — EMDR, extended health, RCC — usually stay in English because those are the words people actually use.',
      },
      {
        label: 'Privacy in a small community',
        detail: 'Kamloops\' South Asian community is large enough to matter and small enough that people know each other. A virtual session does not involve a waiting room where you might be recognised.',
      },
      {
        label: 'Cultural context without the preamble',
        detail: 'Family expectations, generational silence, and "log kya kahenge" do not need to be explained from first principles before the work can start.',
      },
      {
        label: 'Evening appointments',
        detail: 'Weekday evenings by request, which matters for shift work and for parents.',
      },
    ],
    faqs: [
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two — whichever the moment calls for. Most people find they switch without planning to, and that is fine.',
      },
      {
        q: 'Is virtual counselling as effective as sitting in a room?',
        a: 'For most presenting concerns the research finds no meaningful difference in outcome between video and in-person counselling. Where it does matter is fit and consistency, and the honest position here is that a Punjabi-speaking counsellor by video is likely to serve you better than an English-only counsellor in person.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so it is worth checking your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census — Kamloops (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=10&dguid=2021A00055933042',
      },
      {
        label: 'Interior Health — mental health and substance use services',
        url: 'https://www.interiorhealth.ca/services/mental-health-substance-use',
      },
    ],
    nearby: ['kelowna', 'prince-george'],
  },

  {
    slug: 'prince-george',
    region: 'Prince George',
    wider: 'Northern BC',
    blurb:
      'Northern BC has the thinnest counselling coverage in the province. In Punjabi, it is thinner still — and virtual access is the only realistic route.',
    metaDescription:
      'Punjabi-speaking online counselling for Prince George and Northern BC. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'About 4.2% of Prince George residents are South Asian, and Punjabi has long been among the most common mother tongues in the city.',
      body: [
        'In the 2021 census roughly **4.2% of Prince George residents identified as South Asian** — in the wider Cariboo—Prince George region, about 4,195 people. Punjabi has been among the most commonly reported mother tongues in the city for well over a decade; in the 2011 census it was the second most common after German.',
        'Prince George has had a Punjabi-speaking community since the sawmills, which is to say for generations. This is not a new or transient population, and it is not small.',
        'What it does not have is a Punjabi-speaking clinical counsellor. Not a shortage of them — an absence.',
      ],
    },
    localReality: {
      h2: 'The access gap here is documented, not anecdotal',
      body: [
        'In February 2026 the Canadian Mental Health Association\'s Northern BC branch reported that its no-barrier counselling programme in Prince George — funded as a Northern Health pilot — had supported **103 clients across 519 appointments in ten months and still carried a waitlist of 30 people**. The programme paused on 31 March 2026 when the pilot funding concluded.',
        'CMHA Northern BC has also said plainly that in-person one-to-one services across the north remain sparse, and that people seeking a specialist or psychiatrist in the region routinely wait longer than elsewhere in BC.',
        'Those figures describe counselling in English. Add the requirement that the counsellor speak Punjabi and the local supply does not thin out — it disappears. Every Punjabi-speaking counsellor in BC with an office is in the Lower Mainland, roughly eight hours south.',
        'Northern Health does run mental-health and substance-use services in Prince George, delivered in person, by phone and by video. If you are connected to them, stay connected. Private virtual counselling is most useful when the wait for a public service is longer than you can comfortably hold, or when you want continuity that does not depend on a pilot\'s funding cycle.',
      ],
    },
    access: [
      {
        label: 'Distance stops being the variable',
        detail: 'A Punjabi-speaking [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) is exactly as available in Prince George as in Surrey — same 50-minute session, same [BCACC](https://bcacc.ca) code of ethics.',
      },
      {
        label: 'No drive, no weather',
        detail: 'January in the north stops being a scheduling problem. Sessions happen wherever you have a private room and a connection.',
      },
      {
        label: 'Continuity through rotations',
        detail: 'Work camps, rotations and moves within BC do not interrupt the work — the practice is licensed to see clients anywhere in the province.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Sessions move between languages as needed. Nothing has to be pre-translated before it can be said.',
      },
      {
        label: 'Evening appointments',
        detail: 'Weekday evenings by request, which matters for shift work and for parents.',
      },
    ],
    faqs: [
      {
        q: 'Are there really no Punjabi-speaking counsellors in Prince George?',
        a: 'None that publish as taking private clients, as far as can be established from the BCACC register and the main directories. If that changes, seeing someone locally is a perfectly good outcome — and a free consultation here is a reasonable place to work out what you are actually looking for either way.',
      },
      {
        q: 'What if I am already on a waitlist through Northern Health?',
        a: 'Stay on it. Public and private care are not mutually exclusive, and the public services are worth keeping. Private virtual counselling is most useful as something that starts now rather than something that replaces what you are waiting for.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so check your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census — Prince George (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=1&dguid=2021A00055953023',
      },
      {
        label: 'CMHA Northern BC — counselling programme reporting, February 2026',
        url: 'https://northernbc.cmha.ca/',
      },
      {
        label: 'Northern Health — mental health and substance use services',
        url: 'https://www.northernhealth.ca/services/mental-health-substance-use',
      },
    ],
    nearby: ['kamloops', 'kelowna'],
  },

  {
    slug: 'kelowna',
    region: 'Kelowna',
    wider: 'the Okanagan',
    blurb:
      'Kelowna\'s Punjabi-speaking population has grown by half in five years. The number of Punjabi-speaking counsellors in the Okanagan has not moved.',
    metaDescription:
      'Punjabi-speaking online counselling for Kelowna and the Okanagan. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'Punjabi speakers grew from 1.2% of Kelowna in 2016 to 1.8% in 2021 — a rise of half again in five years.',
      body: [
        'Kelowna is often described as one of the most English-speaking cities in BC, and by provincial standards that is true. It is also, quietly, one of the faster-changing ones: **Punjabi speakers went from 1.2% of the population in 2016 to 1.8% in 2021**, growing by roughly half in five years.',
        'In a metro area of Kelowna\'s size that is thousands of people, concentrated in the same agricultural and trades economies that have drawn Punjabi families to the Okanagan for decades.',
        'Counselling supply has not tracked that growth. The Okanagan has plenty of counsellors; it does not have Punjabi-speaking ones, and the population that needs them is the part that grew.',
      ],
    },
    localReality: {
      h2: 'What is actually available in the Okanagan',
      body: [
        'Interior Health provides mental-health and substance-use services across the Okanagan, and CMHA Kelowna runs a free virtual counselling programme for adults 25 and over. Both are real options and both are worth knowing about — this page is not an argument against using them.',
        'What neither reliably provides is a counsellor who speaks Punjabi. Nor do the private clinics: the Punjabi-language filters on the major counselling directories return Lower Mainland results almost exclusively.',
        'For agricultural and seasonal work in particular, there is a second problem underneath the language one. Schedules do not fit a clinic\'s hours, and a session that requires driving into Kelowna during daylight is a session that does not happen.',
      ],
    },
    access: [
      {
        label: 'Fits around the season',
        detail: 'Evening appointments by request. For seasonal and agricultural work, a fixed weekday-afternoon clinic slot is often the reason therapy does not start.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Sessions move between languages as needed. Clinical terms usually stay in English because those are the words people search for and use.',
      },
      {
        label: 'The whole Okanagan, not just Kelowna',
        detail: 'Vernon, Penticton, West Kelowna, Lake Country and Summerland are the same session — distance is not a factor in a virtual practice.',
      },
      {
        label: 'Privacy',
        detail: 'No waiting room, and no car parked outside a clinic in a community where people recognise each other.',
      },
      {
        label: 'Cultural context without the preamble',
        detail: 'Family expectations and generational silence do not need explaining from first principles before the work can start.',
      },
    ],
    faqs: [
      {
        q: 'I live in Vernon / Penticton, not Kelowna. Does that matter?',
        a: 'No. The practice is virtual and licensed across BC, so anywhere in the Okanagan is the same session. The page says Kelowna because that is what people search for.',
      },
      {
        q: 'Is there a free option first?',
        a: 'CMHA Kelowna runs a free virtual counselling programme for adults 25 and over, and it is worth looking at before paying for anything. It is delivered in English. If language is the barrier you are trying to solve, that is where this practice is different.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so check your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'Kelowna Daily Courier — 2021 census language data for Kelowna',
        url: 'https://www.kelownadailycourier.ca/news/article_31580a38-1e77-11ed-97a2-63dab0b6caa2.html',
      },
      {
        label: 'CMHA Kelowna — virtual counselling services',
        url: 'https://www.cmhakelowna.com/programs-supports/virtual-counselling-services',
      },
    ],
    nearby: ['kamloops', 'prince-george'],
  },
];

export const getPunjabiRegion = (slug: string) =>
  punjabiRegions.find((r) => r.slug === slug);

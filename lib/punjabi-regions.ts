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
 * WHY ONLY THESE REGIONS
 * Every population figure below is from the 2021 census and is checkable at
 * the cited source. Nanaimo, the Kootenays and the Peace are equally real
 * opportunities, but Punjabi-language or South Asian population figures for
 * them could not be sourced at the same standard, and a page whose central
 * claim is "there are people like you here" cannot be built on an estimate.
 * They stay out until the numbers are found. Pages that are true beat pages
 * that are padded — the same lesson the 37 retired city pages taught.
 *
 * SURREY WAS ADDED 2026-08-14 AND DOES NOT FOLLOW THE PATTERN.
 * The three original pages argue from scarcity. Surrey has the largest
 * Punjabi-speaking population in Canada and abundant Punjabi-speaking
 * counsellors, so that argument is unavailable and would be transparently
 * false. Its entry carries a long comment explaining what it argues instead
 * and why the distinction matters — read that before editing it, because the
 * obvious "improvement" is to make it match the others, and that would break
 * the only page here whose claim survives contact with a Surrey resident.
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
      {
        q: 'I work seasonally. Can sessions stop and start?',
        a: 'Yes, and in the Okanagan that is the normal pattern rather than the exception. Agricultural and hospitality work here runs on a season, and a schedule that assumes the same weekday at the same time for six months straight does not survive contact with it. Booking block by block, with gaps, works — and nothing is lost by pausing. It is better to plan for that from the start than to book weekly, miss three, and conclude that counselling did not suit you.',
      },
      {
        q: 'Can I have some sessions in Punjabi and some in English?',
        a: 'Yes, and you do not need to decide in advance. Most people move between the two inside a single session without noticing — usually into Punjabi when the subject is family, shame or something a parent said, and back into English for practical planning. That switch is worth paying attention to rather than correcting: the language a memory is stored in is often the language it has to be worked in.',
      },
      {
        q: 'Is a counsellor three hours away really as good as one here?',
        a: 'For the work itself, the evidence says yes — outcomes for video counselling are comparable to in-person for anxiety, depression and trauma. Distance costs you two real things: a counsellor cannot be an in-person crisis response, and there is no local waiting room. This practice does not do crisis work regardless of distance, so if that is what is needed, 9-8-8 or 310-6789 is the right call rather than a booking. What distance gains you here is the language, which no amount of proximity in the Okanagan currently provides.',
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

  /* SURREY IS THE EXCEPTION IN THIS FILE, AND ITS ARGUMENT IS INVERTED.
   *
   * The other three pages rest on scarcity: there is no Punjabi-speaking
   * counsellor within four hours, so virtual is not the cheaper option, it is
   * the only one. In Surrey that claim is simply false. One Surrey practice
   * alone lists nine Punjabi-speaking counsellors, and both Psychology Today
   * and CounsellingBC run Punjabi filters that return page after page of Lower
   * Mainland results. Writing the scarcity page for Surrey would be dishonest,
   * and anybody who lives there would know it inside a sentence.
   *
   * So this page argues what is actually true, which turns out to be the
   * stronger argument anyway: in a community of that density the counsellor is
   * inside the same networks you are. Confidentiality is guaranteed in writing
   * and felt differently when your counsellor's cousin knows your mother. A
   * practice with no Surrey office and no local community overlap offers a
   * structural distance a local practice cannot, however good it is.
   *
   * "However good it is" is not a throwaway. Nothing here disparages another
   * practitioner, names one, or implies local care is worse. BCACC's
   * advertising standards forbid it and it would also be false — the local
   * practitioners are not the problem this page is about.
   *
   * The niche is therefore not "Punjabi counselling Surrey", a crowded term a
   * young domain will not win. It is "Punjabi-speaking counselling for someone
   * in Surrey who does not want to be seen walking in" — a real and
   * underserved thing to want. */
  {
    slug: 'surrey',
    region: 'Surrey',
    wider: 'the Lower Mainland',
    blurb:
      'Surrey has more Punjabi speakers than anywhere else in Canada, and no shortage of Punjabi-speaking counsellors. What it is short of is distance.',
    metaDescription:
      'Punjabi-speaking online counselling for Surrey, from outside Surrey. No local office, no waiting room, no shared community networks. Free consultation.',
    demography: {
      stat: '128,305 Surrey residents learned Punjabi first — the largest Punjabi-speaking population of any city in Canada.',
      body: [
        'In the 2021 census **128,305 Surrey residents reported Punjabi as their mother tongue**, out of a population of 568,322, and Punjabi is spoken at home by roughly 18% of the city. There is nowhere else in the country like it.',
        'That density is why Surrey is the one place in British Columbia where finding a Punjabi-speaking counsellor is genuinely easy. It is also why this page makes a different argument from the others on this site.',
        'The barrier in Surrey is not supply. It is that the community is interconnected enough that the counsellor who comes recommended is often connected to the very people you would least want to know you are going.',
      ],
    },
    localReality: {
      h2: 'Surrey is not short of counsellors — so what is this for?',
      body: [
        'There are a good number of Punjabi-speaking clinical counsellors working in Surrey, several practices built specifically around South Asian clients, and Fraser Health runs public mental-health services across the region. If what you want is a Punjabi-speaking counsellor with a Surrey office, that exists and it is not hard to find. This page is not an argument against any of it.',
        'The reason people write in from Surrey is narrower and harder to say out loud: **they do not want to be seen going.** A car parked outside a known clinic. A waiting room where somebody recognises you. A counsellor whose family knows your family — whose confidentiality is real and complete and still does not stop the feeling of being one degree of separation from home.',
        'That feeling is not irrational and it is not something to be talked out of. In a community where reputation is genuinely load-bearing — for you, for a marriage, for a sibling who has not married yet — the calculation people make about privacy is a reasonable one.',
        'This practice has no office in Surrey, no waiting room anywhere, and no professional or social overlap with Surrey\'s South Asian community. That is not a claim to be better. It is a structural difference, and for some people it is the difference between starting counselling and not starting.',
      ],
    },
    access: [
      {
        label: 'No local office, deliberately',
        detail: 'Nobody sees you arrive, because there is nowhere to arrive. Sessions happen wherever you have a private room and a connection — including a parked car, which is more common than you would think.',
      },
      {
        label: 'Outside the community network',
        detail: 'No shared gurdwara, no overlapping family circles, no chance of meeting your counsellor at a wedding. Confidentiality is a legal duty everywhere; distance is what makes it feel true.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Most sessions move between the two without anyone deciding to. Clinical and administrative terms usually stay in English, because those are the words people actually use.',
      },
      {
        label: 'Cultural context without the preamble',
        detail: 'Family expectations, generational silence, a marriage question, "log kya kahenge" — none of it needs explaining from first principles before the work can start.',
      },
      {
        label: 'Evening appointments',
        detail: 'Weekday evenings, which matters for shift work, for parents, and for anyone whose absence on a weekday afternoon would itself be a conversation at home.',
      },
    ],
    faqs: [
      {
        q: 'There are Punjabi-speaking counsellors in Surrey. Why go virtual?',
        a: 'For plenty of people there is no reason to — if a Surrey office suits you, seeing someone locally is a perfectly good choice, and you would be told so on a consultation call. The people who come here from Surrey are usually those for whom the local option carries a privacy cost: a familiar waiting room, a counsellor connected to the same community, a car recognised outside a clinic. If none of that applies to you, book locally with a clear conscience.',
      },
      {
        q: 'Will anyone in my family find out I am going to counselling?',
        a: 'Not from this practice. Sessions are held by secure video, nothing is posted to a home address, and confidentiality carries the same legal limits set out on the standards page regardless of who asks. What cannot be controlled from this end is your own device — a shared computer, or a phone somebody else opens, is much the most common way people are found out, and it is worth thinking about before the first session rather than after.',
      },
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two — whichever the moment calls for. Most people switch without planning to, and that is fine.',
      },
      {
        q: 'Is virtual counselling as effective as sitting in a room?',
        a: 'For most presenting concerns the research finds no meaningful difference in outcome between video and in-person counselling. Fit and consistency matter considerably more than the medium, which is the honest reason to choose on whether you will actually attend rather than on format.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so it is worth checking your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, Census Profile, 2021 Census — Surrey, City (CY), British Columbia',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?LANG=E&DGUIDlist=2021A00055915004&SearchText=surrey',
      },
      {
        label: 'Statistics Canada — non-official languages spoken at home, Surrey (City), 2021',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/alternative.cfm?topic=6&lang=e&dguid=2021A00055915004&objectId=6',
      },
      {
        label: 'Fraser Health — mental health and substance use services',
        url: 'https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use',
      },
    ],
    nearby: ['kamloops', 'kelowna'],
  },
];

export const getPunjabiRegion = (slug: string) =>
  punjabiRegions.find((r) => r.slug === slug);

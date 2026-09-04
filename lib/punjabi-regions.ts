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
 * VICTORIA WAS CONSIDERED AND REJECTED ON 2026-08-18, FOR EXACTLY THAT REASON.
 * A Greater Victoria page was planned and the argument for it already exists
 * on /online-counselling/victoria — Island residents have the thinnest
 * Punjabi-language access in the province. The only figure that could be found
 * for the Capital Regional District traced back to a secondary source, and the
 * Statistics Canada page for that geography returned a 404. So the page was
 * not built. Build it the day the census figure is sourced properly, and not
 * before.
 *
 * THERE ARE NOW TWO KINDS OF PAGE IN THIS FILE. DO NOT MAKE THEM MATCH.
 *
 * The three original pages — Prince George, Kamloops, Kelowna — argue from
 * SCARCITY: the nearest Punjabi-speaking counsellor with an office is hours
 * away, so virtual is not the cheaper option, it is the only one.
 *
 * Surrey (added 2026-08-14), Abbotsford and Vancouver (both 2026-08-18) argue
 * from DISTANCE instead, because scarcity would be transparently false in all
 * three and anybody who lives there would know it inside a sentence. Each
 * carries a comment explaining what it argues and why its version differs from
 * the other two — Surrey is anonymity inside scale, Abbotsford is the same
 * density in a city a third the size, Vancouver is a dispersed community whose
 * services went to the larger language groups.
 *
 * Read those comments before editing any of them. The obvious "improvement" is
 * to make the six pages consistent, and it would break the three whose claims
 * survive contact with a resident.
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

  /* The same fact, reduced to the number itself.
   *
   * `demography.stat` is a sentence and reads as one. This is the figure alone,
   * for the Stat block that carries it visually — added 2026-08-23 after a
   * visual audit found the site had no device for showing a number, on a site
   * whose entire argument is "here is a checkable figure and here is where to
   * check it". Attribution comes from sources[0], so a figure cannot be
   * enlarged without a citation attached. */
  figure?: { value: string; label: string };

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
    figure: { value: "4,260", label: "South Asian residents in Kamloops. The largest racialized group in the city, and Punjabi is the commonest non-official language spoken at home" },
    region: 'Kamloops',
    wider: 'the Thompson-Nicola',
    blurb:
      'South Asian residents are the largest racialized group in Kamloops, and Punjabi is the most common non-official language spoken at home. Punjabi-speaking counsellors are not.',
    metaDescription:
      'Punjabi-speaking online counselling for Kamloops and the Thompson-Nicola. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'South Asian residents are the largest racialized group in Kamloops: about 4,260 people, 4.5% of the city.',
      body: [
        'That is not a rounding error, and it is not a recent curiosity. In the 2021 census, South Asian was the **largest racialized group in Kamloops**, ahead of every other, at roughly 4,260 people. Punjabi is the most commonly spoken non-official language in Kamloops homes.',
        'Set that against the supply of Punjabi-speaking clinical counsellors in the Thompson-Nicola, which is close to zero. Every Punjabi-speaking counsellor in BC with an office is roughly four hours down the Coquihalla, in Surrey, Abbotsford or Vancouver.',
        'The gap is not that Kamloops lacks counsellors. It is that the counsellors in Kamloops, who may be excellent, cannot hold a session in the language a family argument actually happened in.',
      ],
    },
    localReality: {
      h2: 'What is actually available in Kamloops',
      body: [
        'Interior Health runs mental-health and substance-use services in Kamloops, including assessment, treatment and referral. If you are already connected to those services, staying connected is worth doing, private virtual counselling is a parallel option, not a replacement for public care you already have.',
        'There are private counsellors in Kamloops, and a number of them are very good. The question this page answers is narrower: whether you can be counselled **in Punjabi**, and for that the local answer is almost always no.',
        'That matters more than it sounds. People do not experience grief, shame, or a parent\'s disapproval in their second language. They translate it afterwards. Therapy conducted entirely in translation costs something real: nuance, speed, and the particular relief of not having to explain the context before you can describe the feeling.',
        'Language is one dimension of access here and not the only one. [Online counselling for Kamloops](/online-counselling/kamloops) covers the rest, what it means that the whole Thompson-Nicola drives into this city for its services, and what happens to a weekly appointment when the highway closes.',
      ],
    },
    access: [
      {
        label: 'No four-hour drive',
        detail: 'The nearest Punjabi-speaking counsellor with an office is in the Lower Mainland. Sessions here happen wherever you have a private room and a connection.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Most sessions move between the two. Clinical terms: EMDR, extended health, RCC, usually stay in English because those are the words people actually use.',
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
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two, whichever the moment calls for. Most people find they switch without planning to, and that is fine.',
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
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census, Kamloops (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=10&dguid=2021A00055933042',
      },
      {
        label: 'Interior Health, mental health and substance use services',
        url: 'https://www.interiorhealth.ca/health-and-wellness/mental-health-and-substance-use/mental-health',
      },
    ],
    nearby: ['kelowna', 'prince-george'],
  },

  {
    slug: 'prince-george',
    figure: { value: "4.2%", label: "of Prince George residents are South Asian. Punjabi has been among the commonest mother tongues here for well over a decade" },
    region: 'Prince George',
    wider: 'Northern BC',
    blurb:
      'Northern BC has the thinnest counselling coverage in the province. In Punjabi, it is thinner still, and virtual access is the only realistic route.',
    metaDescription:
      'Punjabi-speaking online counselling for Prince George and Northern BC. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'About 4.2% of Prince George residents are South Asian, and Punjabi has long been among the most common mother tongues in the city.',
      body: [
        'In the 2021 census roughly **4.2% of Prince George residents identified as South Asian**: in the wider Cariboo: Prince George region, about 4,195 people. Punjabi has been among the most commonly reported mother tongues in the city for well over a decade; in the 2011 census it was the second most common after German.',
        'Prince George has had a Punjabi-speaking community since the sawmills, which is to say for generations. This is not a new or transient population, and it is not small.',
        'What it does not have is a Punjabi-speaking clinical counsellor. Not a shortage of them, an absence.',
      ],
    },
    localReality: {
      h2: 'The access gap here is documented, not anecdotal',
      body: [
        'In February 2026 the Canadian Mental Health Association\'s Northern BC branch reported that its no-barrier counselling programme in Prince George, funded as a Northern Health pilot, had supported **103 clients across 519 appointments in ten months and still carried a waitlist of 30 people**. The programme paused on 31 March 2026 when the pilot funding concluded.',
        'CMHA Northern BC has also said plainly that in-person one-to-one services across the north remain sparse, and that people seeking a specialist or psychiatrist in the region routinely wait longer than elsewhere in BC.',
        'Those figures describe counselling in English. Add the requirement that the counsellor speak Punjabi and the local supply does not thin out. It disappears. Every Punjabi-speaking counsellor in BC with an office is in the Lower Mainland, roughly eight hours south.',
        'Northern Health does run mental-health and substance-use services in Prince George, delivered in person, by phone and by video. If you are connected to them, stay connected. Private virtual counselling is most useful when the wait for a public service is longer than you can comfortably hold, or when you want continuity that does not depend on a pilot\'s funding cycle.',
        'If language is not the barrier you are trying to solve, [online counselling for Prince George](/online-counselling/prince-george) covers the same access gap in English, with the same figures behind it.',
      ],
    },
    access: [
      {
        label: 'Distance stops being the variable',
        detail: 'A Punjabi-speaking [Registered Clinical Counsellor](/compare/rcc-vs-psychologist-vs-social-worker-bc) is exactly as available in Prince George as in Surrey, same 50-minute session, same [BCACC](https://bcacc.ca) code of ethics.',
      },
      {
        label: 'No drive, no weather',
        detail: 'January in the north stops being a scheduling problem. Sessions happen wherever you have a private room and a connection.',
      },
      {
        label: 'Continuity through rotations',
        detail: 'Work camps, rotations and moves within BC do not interrupt the work. The practice is licensed to see clients anywhere in the province.',
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
        a: 'None that publish as taking private clients, as far as can be established from the BCACC register and the main directories. If that changes, seeing someone locally is a perfectly good outcome, and a free consultation here is a reasonable place to work out what you are actually looking for either way.',
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
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census, Prince George (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=1&dguid=2021A00055953023',
      },
      {
        label: 'CMHA Northern BC, counselling programme reporting, February 2026',
        url: 'https://northernbc.cmha.ca/',
      },
      {
        label: 'Northern Health, mental health and substance use services',
        url: 'https://www.northernhealth.ca/services/mental-health-substance-use',
      },
    ],
    nearby: ['kamloops', 'kelowna'],
  },

  {
    slug: 'kelowna',
    figure: { value: "1.8%", label: "of Kelowna spoke Punjabi in 2021, up from 1.2% five years earlier, a rise of half again while counselling supply stood still" },
    region: 'Kelowna',
    wider: 'the Okanagan',
    blurb:
      'Kelowna\'s Punjabi-speaking population has grown by half in five years. The number of Punjabi-speaking counsellors in the Okanagan has not moved.',
    metaDescription:
      'Punjabi-speaking online counselling for Kelowna and the Okanagan. Sessions in Punjabi, English, or both, with an RCC. Free 15-minute consultation.',
    demography: {
      stat: 'Punjabi speakers grew from 1.2% of Kelowna in 2016 to 1.8% in 2021, a rise of half again in five years.',
      body: [
        'Kelowna is often described as one of the most English-speaking cities in BC, and by provincial standards that is true. It is also, quietly, one of the faster-changing ones: **Punjabi speakers went from 1.2% of the population in 2016 to 1.8% in 2021**, growing by roughly half in five years.',
        'In a metro area of Kelowna\'s size that is thousands of people, concentrated in the same agricultural and trades economies that have drawn Punjabi families to the Okanagan for decades.',
        'Counselling supply has not tracked that growth. The Okanagan has plenty of counsellors; it does not have Punjabi-speaking ones, and the population that needs them is the part that grew.',
      ],
    },
    localReality: {
      h2: 'What is actually available in the Okanagan',
      body: [
        'Interior Health provides mental-health and substance-use services across the Okanagan, and CMHA Kelowna runs a free virtual counselling programme for adults 25 and over. Both are real options and both are worth knowing about. This page is not an argument against using them.',
        'What neither reliably provides is a counsellor who speaks Punjabi. Nor do the private clinics: the Punjabi-language filters on the major counselling directories return Lower Mainland results almost exclusively.',
        'For agricultural and seasonal work in particular, there is a second problem underneath the language one. Schedules do not fit a clinic\'s hours, and a session that requires driving into Kelowna during daylight is a session that does not happen.',
        'The wider picture of getting counselling in this region. The thin specialist end, the seasonal work, the mark the wildfire years left, is on [online counselling for Kelowna](/online-counselling/kelowna).',
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
        detail: 'Vernon, Penticton, West Kelowna, Lake Country and Summerland are the same session, distance is not a factor in a virtual practice.',
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
        a: 'Yes, and in the Okanagan that is the normal pattern rather than the exception. Agricultural and hospitality work here runs on a season, and a schedule that assumes the same weekday at the same time for six months straight does not survive contact with it. Booking block by block, with gaps, works, and nothing is lost by pausing. It is better to plan for that from the start than to book weekly, miss three, and conclude that counselling did not suit you.',
      },
      {
        q: 'Can I have some sessions in Punjabi and some in English?',
        a: 'Yes, and you do not need to decide in advance. Most people move between the two inside a single session without noticing, usually into Punjabi when the subject is family, shame or something a parent said, and back into English for practical planning. That switch is worth paying attention to rather than correcting: the language a memory is stored in is often the language it has to be worked in.',
      },
      {
        q: 'Is a counsellor three hours away really as good as one here?',
        a: 'For the work itself, the evidence says yes, outcomes for video counselling are comparable to in-person for anxiety, depression and trauma. Distance costs you two real things: a counsellor cannot be an in-person crisis response, and there is no local waiting room. This practice does not do crisis work regardless of distance, so if that is what is needed, 9-8-8 or 310-6789 is the right call rather than a booking. What distance gains you here is the language, which no amount of proximity in the Okanagan currently provides.',
      },
    ],
    sources: [
      {
        label: 'Kelowna Daily Courier, 2021 census language data for Kelowna',
        url: 'https://www.kelownadailycourier.ca/news/article_31580a38-1e77-11ed-97a2-63dab0b6caa2.html',
      },
      {
        label: 'CMHA Kelowna, virtual counselling services',
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
    figure: { value: "128,305", label: "Surrey residents learned Punjabi first, the largest Punjabi-speaking population of any city in Canada" },
    region: 'Surrey',
    wider: 'the Lower Mainland',
    blurb:
      'Surrey has more Punjabi speakers than anywhere else in Canada, and no shortage of Punjabi-speaking counsellors. What it is short of is distance.',
    metaDescription:
      'Punjabi-speaking online counselling for Surrey, from outside Surrey. No local office, no waiting room, no shared community networks. Free consultation.',
    demography: {
      stat: '128,305 Surrey residents learned Punjabi first, the largest Punjabi-speaking population of any city in Canada.',
      body: [
        'In the 2021 census **128,305 Surrey residents reported Punjabi as their mother tongue**, out of a population of 568,322, and Punjabi is spoken at home by roughly 18% of the city. There is nowhere else in the country like it.',
        'That density is why Surrey is the one place in British Columbia where finding a Punjabi-speaking counsellor is genuinely easy. It is also why this page makes a different argument from the others on this site.',
        'The barrier in Surrey is not supply. It is that the community is interconnected enough that the counsellor who comes recommended is often connected to the very people you would least want to know you are going.',
      ],
    },
    localReality: {
      h2: 'Surrey is not short of counsellors, so what is this for?',
      body: [
        'There are a good number of Punjabi-speaking clinical counsellors working in Surrey, several practices built specifically around South Asian clients, and Fraser Health runs public mental-health services across the region. If what you want is a Punjabi-speaking counsellor with a Surrey office, that exists and it is not hard to find. This page is not an argument against any of it.',
        'The reason people write in from Surrey is narrower and harder to say out loud: **they do not want to be seen going.** A car parked outside a known clinic. A waiting room where somebody recognises you. A counsellor whose family knows your family, whose confidentiality is real and complete and still does not stop the feeling of being one degree of separation from home.',
        'That feeling is not irrational and it is not something to be talked out of. In a community where reputation is genuinely load-bearing, for you, for a marriage, for a sibling who has not married yet. The calculation people make about privacy is a reasonable one.',
        'This practice has no office in Surrey, no waiting room anywhere, and no professional or social overlap with Surrey\'s South Asian community. That is not a claim to be better. It is a structural difference, and for some people it is the difference between starting counselling and not starting.',
        'If language is not the thing you are looking for, [online counselling for Surrey](/online-counselling/surrey) covers the same ground in English, including why the second generation tends to arrive first, and what that is like without a template.',
      ],
    },
    access: [
      {
        label: 'No local office, deliberately',
        detail: 'Nobody sees you arrive, because there is nowhere to arrive. Sessions happen wherever you have a private room and a connection, including a parked car, which is more common than you would think.',
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
        detail: 'Family expectations, generational silence, a marriage question, "log kya kahenge", none of it needs explaining from first principles before the work can start.',
      },
      {
        label: 'Evening appointments',
        detail: 'Weekday evenings, which matters for shift work, for parents, and for anyone whose absence on a weekday afternoon would itself be a conversation at home.',
      },
    ],
    faqs: [
      {
        q: 'There are Punjabi-speaking counsellors in Surrey. Why go virtual?',
        a: 'For plenty of people there is no reason to, if a Surrey office suits you, seeing someone locally is a perfectly good choice, and you would be told so on a consultation call. The people who come here from Surrey are usually those for whom the local option carries a privacy cost: a familiar waiting room, a counsellor connected to the same community, a car recognised outside a clinic. If none of that applies to you, book locally with a clear conscience.',
      },
      {
        q: 'Will anyone in my family find out I am going to counselling?',
        a: 'Not from this practice. Sessions are held by secure video, nothing is posted to a home address, and confidentiality carries the same legal limits set out on the standards page regardless of who asks. What cannot be controlled from this end is your own device. A shared computer, or a phone somebody else opens, is much the most common way people are found out, and it is worth thinking about before the first session rather than after.',
      },
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two, whichever the moment calls for. Most people switch without planning to, and that is fine.',
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
        label: 'Statistics Canada, Census Profile, 2021 Census: Surrey, City (CY), British Columbia',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?LANG=E&DGUIDlist=2021A00055915004&SearchText=surrey',
      },
      {
        label: 'Statistics Canada: non-official languages spoken at home, Surrey (City), 2021',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/alternative.cfm?topic=6&lang=e&dguid=2021A00055915004&objectId=6',
      },
      {
        label: 'Fraser Health, mental health and substance use services',
        url: 'https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use',
      },
    ],
    nearby: ['kamloops', 'kelowna', 'abbotsford'],
  },

  /* ABBOTSFORD, ADDED 2026-08-18. SECOND PAGE IN THE "DISTANCE" GROUP.
   *
   * Two of this repository's own files already argued for it. locations.ts
   * says Abbotsford has "one of the largest Punjabi-speaking communities in
   * Canada, with much the same dynamic as Surrey", and the header of this file
   * names Abbotsford as one of the three places every Punjabi-speaking
   * counsellor in BC with an office actually is. It was simply never built.
   *
   * IT MUST NOT BE A COPY OF SURREY, AND THE FIGURE IS WHY.
   *
   * Surrey's argument is anonymity inside scale: 128,305 mother-tongue
   * speakers in a city of 568,322, where a counsellor can be inside your
   * networks. Abbotsford is the same barrier under different arithmetic —
   * 34,280 speakers, but 22.6% of the city rather than Surrey's 23%, in a
   * municipality less than a third the size. The community is not smaller in
   * proportion; the city is smaller in absolute terms, which is a different
   * experience of the same density. There are fewer degrees of separation
   * available, not more.
   *
   * That is the distinction the page rests on, and it is the honest one. */
  {
    slug: 'abbotsford',
    figure: { value: "34,280", label: "people in Abbotsford have Punjabi as their mother tongue, 22.6% of the city, second only to English" },
    region: 'Abbotsford',
    wider: 'the Fraser Valley',
    blurb:
      'Punjabi is the mother tongue of nearly a quarter of Abbotsford. In a city this size, that is not anonymity. It is a community where most people are two conversations apart.',
    metaDescription:
      'Punjabi-speaking online counselling for Abbotsford and the Fraser Valley, from outside the Valley. No local office, no waiting room. Free consultation.',
    demography: {
      stat: 'Punjabi is the mother tongue of 34,280 people in Abbotsford, 22.6% of the city, and second only to English.',
      body: [
        'In the 2021 census **Punjabi was the mother tongue of 34,280 Abbotsford residents, 22.6% of the population**, second only to English at 61%, and ahead of every one of the other fifty-plus languages spoken in the city.',
        'Nearly a quarter of a city is not a minority community in any ordinary sense. Abbotsford has had a Punjabi-speaking population since the first sawmills and berry farms, which is to say for well over a century, and the Gur Sikh Temple on South Fraser Way is the oldest standing Sikh temple in North America.',
        'So this page cannot argue what the Kamloops and Prince George pages argue. There is no shortage of Punjabi-speaking counsellors in Abbotsford, and saying otherwise would be false to anybody who lives here.',
      ],
    },
    localReality: {
      h2: 'Abbotsford is not Surrey, and the difference is the size of the city',
      body: [
        'Surrey has a comparable share of Punjabi speakers and more than three times the population. That difference matters more than it sounds. In a city of 568,000 there is somewhere to be anonymous; in a city of roughly 153,000 there are fewer degrees of separation available, not more.',
        'The concern people raise from here is rarely whether counselling works. It is **who will see the car.** A clinic on a main road in a city this size, in a community where families have known each other for generations, is not a private place to be seen going, and that assessment is a realistic reading of how information moves, not anxiety to be talked out of.',
        'There are good Punjabi-speaking counsellors in Abbotsford, several practices built specifically around South Asian clients, and Fraser Health runs public mental-health services across the region. **This page is not an argument against any of it.** If a local office suits you, book locally with a clear conscience.',
        'What this practice offers instead is structural: no office in Abbotsford, no waiting room anywhere, no professional or social overlap with the Valley\'s South Asian community. That is not a claim to be better. For some people it is the difference between starting counselling and not starting.',
        'The second pattern specific here is agricultural. The Valley\'s berry and greenhouse economy runs on a season, and during a peak a fixed weekday-afternoon appointment is not attendable by anyone working it. Evening sessions, and no travel either side, are what make therapy possible rather than theoretical in those months.',
        'If language is not the barrier you are solving for, [online counselling for Abbotsford](/online-counselling/abbotsford) covers the rest. The distances across the Valley, and what they cost a course of therapy.',
      ],
    },
    access: [
      {
        label: 'No local office, deliberately',
        detail: 'Nobody sees you arrive, because there is nowhere to arrive. Sessions happen wherever you have a private room and a connection. A parked car included, which is more common than you would think.',
      },
      {
        label: 'Outside the Valley\'s networks',
        detail: 'No shared gurdwara, no overlapping family circles, no chance of meeting your counsellor at a wedding in Abbotsford or Mission.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Most sessions move between the two without anyone deciding to. Clinical and administrative terms usually stay in English, because those are the words people actually use.',
      },
      {
        label: 'Fits around the season',
        detail: 'Weekday evenings by request. For agricultural and greenhouse work, a fixed daytime clinic slot is often the reason counselling never starts.',
      },
      {
        label: 'The wider Valley on the same terms',
        detail: 'Mission, Chilliwack, Agassiz, Hope and the rural areas east. No travel penalty for being further out, which is the whole point.',
      },
    ],
    faqs: [
      {
        q: 'There are Punjabi-speaking counsellors in Abbotsford. Why go virtual?',
        a: 'For plenty of people there is no reason to, and you would be told so on a consultation call. The people who write in from Abbotsford are usually those for whom the local option carries a privacy cost, a familiar waiting room, a counsellor connected to the same community, a car recognised outside a clinic. If none of that applies to you, seeing somebody locally is a perfectly good outcome.',
      },
      {
        q: 'Is Abbotsford really different from Surrey for this?',
        a: 'In share of the population, barely. Both are around a quarter Punjabi mother tongue. In practice, yes: Abbotsford is less than a third the size, so the same density means fewer people between you and anyone who might recognise you. People who have lived in both usually describe Abbotsford as the harder place to be private.',
      },
      {
        q: 'Will anyone in my family find out I am going to counselling?',
        a: 'Not from this practice. Sessions are by secure video, nothing is posted to a home address, and confidentiality carries the same legal limits set out on the standards page regardless of who asks. What cannot be controlled from this end is your own device. A shared computer, or a phone somebody else opens, is much the most common way people are found out, and it is worth thinking about before the first session rather than after.',
      },
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two, whichever the moment calls for. Most people switch without planning to, and that is fine.',
      },
      {
        q: 'Do you work with people in Mission, Chilliwack or Hope?',
        a: 'Yes, and on identical terms. The practice is virtual and registered across British Columbia, so anywhere in the Fraser Valley is the same session, with no drive, which for the eastern Valley is the difference that matters most.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so it is worth checking your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'City of Abbotsford, Diversity (2021 Census language data)',
        url: 'https://www.abbotsford.ca/people-community/diversity',
      },
      {
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census, Abbotsford (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=1&dguid=2021A00055909052',
      },
      {
        label: 'Fraser Health, mental health and substance use services',
        url: 'https://www.fraserhealth.ca/health-topics-a-to-z/mental-health-and-substance-use',
      },
    ],
    nearby: ['surrey', 'vancouver'],
  },

  /* VANCOUVER, ADDED 2026-08-18. THIRD IN THE "DISTANCE" GROUP, AND THE ONE
   * WHOSE ARGUMENT IS LEAST OBVIOUS.
   *
   * Vancouver is named in this file's header as one of the three places
   * Punjabi-speaking counsellors with offices actually are, so the scarcity
   * argument is unavailable. But the Surrey argument does not transfer either:
   * Surrey's barrier is density, and Vancouver's Punjabi-speaking population
   * is neither dense nor concentrated. It is 2.0% of the city and FIFTH among
   * mother tongues, behind Cantonese and Mandarin.
   *
   * That is the page's actual subject, and it is a real thing people
   * experience: in Vancouver, "services in your language" overwhelmingly means
   * Chinese-language services, because that is where the numbers are. A
   * Punjabi speaker here is a minority inside a multilingual majority, and the
   * community infrastructure that exists for them is in Surrey. */
  {
    slug: 'vancouver',
    figure: { value: "13,305", label: "Vancouver residents, just 2.0%, Punjabi is only the fifth mother tongue here, behind Cantonese and Mandarin" },
    region: 'Vancouver',
    wider: 'the city proper, not the suburbs',
    blurb:
      'Punjabi is the fifth mother tongue in Vancouver, behind Cantonese and Mandarin. Being multilingual as a city is not the same as being multilingual in your language.',
    metaDescription:
      'Punjabi-speaking online counselling for Vancouver. Sessions in Punjabi, English, or both, with an RCC, without the trip to Surrey. Free consultation.',
    demography: {
      stat: 'Punjabi is the mother tongue of 13,305 Vancouver residents: 2.0%, and fifth in the city behind English, Cantonese, Mandarin and Tagalog.',
      body: [
        'In the 2021 census **Punjabi was the mother tongue of 13,305 people in the City of Vancouver, about 2.0% of the population**. It ranked fifth, behind English at 50.7%, Cantonese at 11.8%, Mandarin at 6.4% and Tagalog at 2.9%.',
        'Vancouver is one of the most linguistically diverse cities in the country, at least 190 languages are spoken here. That is exactly why this page exists: **a city being multilingual is not the same as it being multilingual in your language.**',
        'The provincial picture inverts the city one. British Columbia has roughly 315,000 Punjabi speakers, and Surrey alone has 128,305. The community, its institutions and nearly all its Punjabi-speaking clinicians are across the river.',
      ],
    },
    localReality: {
      h2: 'Dispersed, not concentrated, and that changes what is available',
      body: [
        'There is no Punjabi neighbourhood in Vancouver proper in the way there is in Surrey or Abbotsford. The 13,305 people are spread across the city rather than gathered in it, which has a specific and under-discussed consequence: **the services that grow around a concentrated community do not grow around a dispersed one.**',
        'When a Vancouver organisation advertises counselling "in your language", the languages in question are usually Cantonese and Mandarin. That is not a failure on anyone\'s part. It follows the numbers, and those services are good. It does mean that a Punjabi speaker in Vancouver is a minority inside the multilingual majority, and routinely finds that the multilingual option on offer is not theirs.',
        'The practical answer for years has been to go to Surrey. That works, and for some people it is the right call. It also means a bridge or a tunnel, transit at rush hour, and an appointment that costs most of an evening, which is the same arithmetic that quietly ends courses of therapy everywhere, applied to language access specifically.',
        'Vancouver Coastal Health runs free mental-health services and they are worth knowing about before paying for anything. What they do not reliably provide is a counsellor who works in Punjabi.',
        'There is a second thing specific to this city, and it is not about language at all. Vancouver has a well-documented reputation as a hard place to make friends, particularly for people who arrived as adults. For somebody carrying both that isolation and a family context nobody around them recognises, the loneliness is doubled rather than added.',
        'The cost side of counselling in this city, and it is the real constraint here rather than supply, is covered on [online counselling for Vancouver](/online-counselling/vancouver).',
      ],
    },
    access: [
      {
        label: 'No trip to Surrey',
        detail: 'The most common practical reason people here choose virtual. A bridge, transit at rush hour, and most of an evening is what a Punjabi-language appointment has historically cost from Vancouver.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Sessions move between the two as needed. Clinical and administrative terms usually stay in English, because those are the words people actually use.',
      },
      {
        label: 'Cultural context without the preamble',
        detail: 'Family expectations, generational silence and "log kya kahenge" do not need explaining from first principles before the work can start.',
      },
      {
        label: 'Lunch-break appointments',
        detail: 'A session from a closed office or a parked car is entirely workable, and removes the need to explain an absence, which matters if you live with family.',
      },
      {
        label: 'Outside the community network',
        detail: 'No overlapping family circles, and no chance of meeting your counsellor at a wedding. Confidentiality is a legal duty everywhere; distance is what makes it feel true.',
      },
    ],
    faqs: [
      {
        q: 'Why not just see somebody in Surrey?',
        a: 'You can, and for some people that is the right answer. The choice is wider there and you would be told so on a consultation call. What Surrey costs from Vancouver is the travel: a bridge or tunnel, rush-hour transit, and an appointment that takes most of an evening rather than fifty minutes. That cost is the single most common reason weekly therapy quietly stops.',
      },
      {
        q: 'Are there really few Punjabi-speaking counsellors in Vancouver itself?',
        a: 'Fewer than the city\'s reputation for diversity would suggest, and the reason is arithmetic rather than neglect. Punjabi is the fifth mother tongue here at 2.0%; Cantonese and Mandarin are several times larger. Services follow the numbers, so Vancouver\'s multilingual mental-health provision is genuinely strong and mostly not in Punjabi.',
      },
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes. Sessions run in Punjabi, in English, or moving between the two, whichever the moment calls for. Most people switch without planning to, usually into Punjabi when the subject is family and back into English for practical planning, and that switch is worth paying attention to rather than correcting.',
      },
      {
        q: 'Is there a free option I should try first?',
        a: 'Vancouver Coastal Health runs free mental-health services and there is a broader set of free and low-cost options across BC worth checking before paying out of pocket. They are delivered in English. If language is the barrier you are trying to solve, that is where this practice is different.',
      },
      {
        q: 'I live with family and have no private space. What do people do?',
        a: 'This is one of the most common practical questions, and there are workable answers, a parked car, a session scheduled during a work break from the office, headphones and a closed door. It is worth raising on the consultation call so it is solved before the first session rather than during it.',
      },
      {
        q: 'Will my extended health cover this?',
        a: 'Most BC extended-health plans that cover a Registered Clinical Counsellor cover virtual sessions on the same terms as in-person ones. Coverage varies by plan, so it is worth checking your specific policy before booking.',
      },
    ],
    sources: [
      {
        label: 'City of Vancouver, 2021 Census: Indigenous Peoples and Language',
        url: 'https://vancouver.ca/files/cov/2022-12-19-city-of-vancouver-2021-census-indigenous-peoples-and-language.pdf',
      },
      {
        label: 'Statistics Canada, Census Profile, 2021 Census: Vancouver, City (CY), British Columbia',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&SearchText=vancouver&DGUIDlist=2021A00055915022',
      },
      {
        label: 'Vancouver Coastal Health, mental health and substance use',
        url: 'https://www.vch.ca/en/health-topics/mental-health',
      },
    ],
    nearby: ['surrey', 'abbotsford'],
  },
];

export const getPunjabiRegion = (slug: string) =>
  punjabiRegions.find((r) => r.slug === slug);

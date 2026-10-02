import { ONLINE_COVERAGE } from '@/lib/practice-facts';
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
 * the cited source. Nanaimo and the Peace are equally real
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
 * SAANICH WAS ADDED ON 2026-10-02, once the figure was read from Statistics
 * Canada directly (2021 Census, mother tongue): 2,655 of the Capital census
 * division's 4,350 Punjabi mother-tongue speakers live in Saanich, against
 * 410 in the City of Victoria. That is why the Island page is Saanich's and
 * not Victoria's.
 *
 * OWNER DECISION, 2 Oct 2026: every city given a city page in the October
 * batch gets its Punjabi page too, including where the community is small.
 * Where it is small the page states the real 2021 Census figure plainly,
 * cites it, and argues honestly from it (few same-language counsellors
 * locally, and video reaches one) rather than inflating it. The sourcing
 * rule above is unchanged: no figure, no page.
 *
 * THERE ARE NOW TWO KINDS OF PAGE IN THIS FILE. DO NOT MAKE THEM MATCH.
 *
 * CRANBROOK WAS ADDED ON 2026-10-02 under the owner decision above, once the
 * East Kootenay figures were read from Statistics Canada directly. The
 * Kootenays had been listed as out for want of a figure; Cranbrook's is
 * small (120 speak Punjabi most often at home) and the page says so.
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
      'Punjabi-speaking online counselling for Kamloops and the Thompson-Nicola. Sessions in Punjabi, English, or both, with an RCC. Free 30-minute consultation.',
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
        a: ONLINE_COVERAGE,
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
      'Punjabi-speaking online counselling for Prince George and Northern BC. Sessions in Punjabi, English, or both, with an RCC. Free 30-minute consultation.',
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
        a: ONLINE_COVERAGE,
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
      'Punjabi-speaking online counselling for Kelowna and the Okanagan. Sessions in Punjabi, English, or both, with an RCC. Free 30-minute consultation.',
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
        detail: 'No travel either side of a session. For seasonal and agricultural work, a fixed weekday-afternoon clinic slot is often the reason therapy does not start.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Sessions move between languages as needed. Clinical terms usually stay in English because those are the words people search for and use.',
      },
      {
        label: 'The whole Okanagan, not just Kelowna',
        detail: 'Penticton, West Kelowna, Lake Country and Summerland are the same session, distance is not a factor in a virtual practice. [Vernon](/punjabi-counselling/vernon) has a page of its own.',
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
        a: 'No. The practice is virtual and licensed across BC, so anywhere in the Okanagan is the same session. The page says Kelowna because that is what people search for; Vernon has a Punjabi page of its own.',
      },
      {
        q: 'Is there a free option first?',
        a: 'CMHA Kelowna runs a free virtual counselling programme for adults 25 and over, and it is worth looking at before paying for anything. It is delivered in English. If language is the barrier you are trying to solve, that is where this practice is different.',
      },
      {
        q: 'Will my extended health cover this?',
        a: ONLINE_COVERAGE,
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
        a: ONLINE_COVERAGE,
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
      'Punjabi-speaking online counselling for Abbotsford, from outside the Fraser Valley. No local office, no waiting room. Free consultation.',
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
        'The second pattern specific here is agricultural. The Valley\'s berry and greenhouse economy runs on a season, and during a peak a fixed weekday-afternoon appointment is not attendable by anyone working it. No travel either side, and a time picked from what the counsellor has open rather than a fixed clinic slot, are what make therapy possible rather than theoretical in those months.',
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
        detail: 'No travel either side of a session. For agricultural and greenhouse work, a fixed daytime clinic slot is often the reason counselling never starts.',
      },
      {
        label: 'The wider Valley on the same terms',
        detail: 'Chilliwack, Agassiz, Hope and the rural areas east. No travel penalty for being further out, which is the whole point. [Mission](/punjabi-counselling/mission) has a page of its own.',
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
        a: 'Yes, and on identical terms. The practice is virtual and registered across British Columbia, so anywhere in the Fraser Valley is the same session, with no drive, which for the eastern Valley is the difference that matters most. Mission has a Punjabi page of its own.',
      },
      {
        q: 'Will my extended health cover this?',
        a: ONLINE_COVERAGE,
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
    nearby: ['surrey', 'vancouver', 'mission'],
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
        a: ONLINE_COVERAGE,
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
  /* SAANICH, 2 Oct 2026. ARGUMENT: SCARCITY, with an Island twist.
   *
   * The Victoria page was rejected on 18 Aug 2026 because the only Capital
   * Region figure traced to a secondary source. This one rests on Statistics
   * Canada Table 98-10-0173-01 (2021 Census, mother tongue, single responses),
   * read 2 Oct 2026 through StatCan's own data service (the www12 Census
   * Profile pages returned 404 that day; the page cites the Census Profile,
   * as every other region does): Saanich 2,655 of
   * 115,970; City of Victoria 410; Capital census division 4,350. So about 61%
   * of the region's Punjabi mother-tongue speakers live in Saanich, which is
   * the page's distinct claim: the community is real, and it is here rather
   * than downtown.
   *
   * Scarcity, not distance: "Punjabi-speaking clinicians are concentrated in
   * the Lower Mainland" is the site's existing claim (header of this file and
   * the Victoria hub). Whether any Punjabi-speaking RCC holds an office on
   * the South Island was NOT checked independently; the copy says
   * "concentrated", never "none".
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR, and
   * the copy says so rather than implying them. No counsellor is named. */
  {
    slug: 'saanich',
    figure: { value: '2,655', label: 'Saanich residents whose mother tongue is Punjabi. About three in five of everyone in the Capital Region who learned Punjabi first' },
    region: 'Saanich',
    wider: 'Greater Victoria',
    blurb:
      'Most of the Capital Region’s Punjabi-speaking community lives in Saanich. Punjabi-speaking counsellors are mostly a ferry away.',
    metaDescription:
      'Punjabi-speaking online counselling for Saanich and Greater Victoria. Sessions in Punjabi, English, or both, with an RCC. Free 30-minute consultation.',
    demography: {
      stat: '2,655 Saanich residents reported Punjabi as their mother tongue in 2021, more than six times the City of Victoria’s 410.',
      body: [
        'In the 2021 census **2,655 Saanich residents reported Punjabi as their mother tongue**. Across the whole Capital census division, which takes in Greater Victoria, the figure was 4,350. About three in every five live in Saanich, and the City of Victoria, the name every directory uses, had 410.',
        'That matters for how people search. Somebody in Royal Oak or Gordon Head looking for a Punjabi-speaking counsellor types "Victoria", and gets a list of downtown offices, very few of which offer a session in Punjabi. The counsellors who do are mostly on the mainland.',
        'The gap is not that Saanich lacks counsellors. It is that the counsellors within reach mostly cannot hold a session in the language a family conversation actually happened in.',
      ],
    },
    localReality: {
      h2: 'What is actually available in Saanich',
      body: [
        'Island Health is the public route. Its Central Access and Rapid Engagement Services (CARES) on Pembroke Street offers same-day assessment and walk-in counselling for the South Island, in person or by video. If you are already connected to Island Health services, stay connected: private counselling runs alongside public care, not instead of it.',
        'Greater Victoria has a capable private counselling sector, and for many people it is the right answer. The narrower question this page answers is whether you can be counselled **in Punjabi**, and on the Island that has generally meant looking to the mainland, which means Swartz Bay, a sailing, and most of a day.',
        'A family argument in Royal Oak happens in Punjabi. Retelling it in English to someone who has to ask what izzat means turns a session into a translation exercise, and the part that hurt is usually the part that does not survive it.',
        'Students are part of this picture too. Most of the University of Victoria’s campus is in Saanich, and a student whose parents think in Punjabi may want a counsellor who does not need the family explained. [Online counselling for Saanich](/online-counselling/saanich) covers the rest of the district: the Peninsula, the university and the public route.',
      ],
    },
    access: [
      {
        label: 'Swartz Bay is not part of it',
        detail: 'The Punjabi-speaking counsellors are mostly on the mainland, and a session should not cost a ferry booking. By video it happens in Saanich, in whatever room is private.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'A sentence can start in one and finish in the other. Insurance and clinical words tend to stay in English, since that is how people meet them on a claim form.',
      },
      {
        label: 'No one you know in the waiting room',
        detail: 'A community of a few thousand across Greater Victoria is one where a familiar face in a waiting room is a real possibility. A video session has no waiting room at all.',
      },
      {
        label: 'Cultural context without the preamble',
        detail: 'Family expectations, generational silence and "log kya kahenge" do not need explaining from first principles before the work can start.',
      },
    ],
    faqs: [
      {
        q: 'Can the whole session be in Punjabi?',
        a: 'Yes, for individual counselling. It can stay in Punjabi throughout, or move into English and back when a word fits better in one. Nobody has to decide in advance.',
      },
      {
        q: 'Can my partner and I have couples sessions in Punjabi?',
        a: 'Not at the moment. Couples sessions currently run in English or Tagalog, and EMDR in English or Tagalog too. Individual counselling is available in Punjabi, and the free consultation is the place to work out what fits.',
      },
      {
        q: 'Will my extended health cover this?',
        a: ONLINE_COVERAGE,
      },
      {
        q: 'Does it matter that I live in Saanich and not Victoria?',
        a: 'Not at all. Island Health is the public authority for both, and a Registered Clinical Counsellor in BC can see you by video anywhere in the province. Sidney, Central Saanich and North Saanich are on identical terms.',
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, Census Profile, 2021 Census of Population: Saanich, Victoria and the Capital Regional District (mother tongue)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917021,2021A00055917034,2021A00035917&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Island Health, same-day mental health and substance use supports (CARES)',
        url: 'https://www.islandhealth.ca/news/news-releases/more-options-available-people-needing-same-day-mental-health-and-addiction-supports',
      },
    ],
    nearby: ['vancouver', 'kamloops', 'courtenay'],
  },
  /* MAPLE RIDGE, 2 Oct 2026. ARGUMENT: DISTANCE, said honestly about size.
   *
   * Scarcity would be false here: Surrey and Abbotsford, where Punjabi-
   * speaking counsellors with offices are concentrated (the header of this
   * file), are a bridge or a highway away. The page argues that distance AND
   * states plainly that the local community is small, per the owner decision
   * of 2 Oct 2026 above. Statistics Canada 2021 Census Profile, Maple Ridge
   * CSD 5915075: Punjabi mother tongue 1,360 of 89,970 (1.5%), knowledge
   * 2,215, South Asian 4,245 (4.7%, the largest racialized group); Pitt
   * Meadows CSD 5915070: 400 and 555. Read 2 Oct 2026 through StatCan's data
   * service (the www12 Census Profile pages returned 404 from here that day);
   * cited at the Census Profile, as every other region is. Surrey's 128,305
   * is this file's own Surrey figure, cited at the Surrey profile.
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR.
   * No counsellor is named. */
  {
    slug: 'maple-ridge',
    figure: { value: '1,360', label: 'Maple Ridge residents gave Punjabi as their mother tongue in 2021: about 1.5% of the city' },
    region: 'Maple Ridge',
    wider: 'Maple Ridge and Pitt Meadows',
    blurb:
      'A small Punjabi-speaking community a bridge away from the largest one in the province, which is close enough to visit and too far for a weekly appointment.',
    metaDescription:
      'Punjabi-speaking online counselling for Maple Ridge and Pitt Meadows. Punjabi, English or both, with an RCC, and no bridge to Surrey. Free consultation.',
    demography: {
      stat: '1,360 Maple Ridge residents gave Punjabi as their mother tongue in the 2021 Census, about 1.5% of the city.',
      body: [
        'In the 2021 Census **1,360 people in Maple Ridge gave Punjabi as their mother tongue, about 1.5% of residents**, and 2,215 said they could hold a conversation in it. In Pitt Meadows the figures were 400 and 555. South Asian residents, 4,245 people or about 4.7%, are the largest racialized group in Maple Ridge.',
        'Those are honest numbers for a real community, and a small one. Punjabi sits level with Tagalog and just behind Mandarin among the city’s non-English mother tongues. It is rarely the scale at which local services are offered in a language.',
        'Surrey, over the Golden Ears Bridge and through Langley, is different in kind. In the same census 128,305 Surrey residents gave Punjabi as their mother tongue, more than ninety times the Maple Ridge figure, and it is where Punjabi-speaking counsellors with offices are concentrated.',
      ],
    },
    localReality: {
      h2: 'Close to Surrey on a map, far from it in a week',
      body: [
        'From Maple Ridge, Surrey is the obvious answer to "where is there a Punjabi-speaking counsellor", and it is a genuine one. It is also over the Golden Ears Bridge, and Abbotsford is further up the valley. For a single visit that is nothing. For a weekly appointment after a working day that may already have crossed a bridge twice, it is a cost paid every week, on top of everything else.',
        'Most working residents of Maple Ridge already leave the city every day; in the 2021 Census about six in ten of those with a usual place of work worked outside it. A Punjabi-language appointment in Surrey is then a second commute, in a different direction from the first.',
        'A small community has its own pressure. Where the Punjabi-speaking circle is a few thousand people, someone usually knows someone, and the worry about being recognised in a waiting room is a reasonable one. A practice outside that circle, reached by video, has no waiting room to be recognised in.',
        'Fraser Health runs the public route here, through the Maple Ridge Mental Health and Substance Use Centre, which accepts self-referral from adults. It is free and worth knowing about. If you would rather speak Punjabi there, ask whether an interpreter can join.',
        'The wider picture for Maple Ridge, including the commute and what the public services offer, is on [online counselling for Maple Ridge](/online-counselling/maple-ridge). The larger Punjabi-speaking picture one bridge south is on [Punjabi counselling in Surrey](/punjabi-counselling/surrey).',
      ],
    },
    access: [
      {
        label: 'No bridge to Surrey',
        detail: 'A weekly Punjabi-language appointment without the Golden Ears Bridge, or a drive up the valley to Abbotsford, on either side of it.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Use whichever language a thought arrives in. Nothing has to be settled at the start, and switching halfway through a sentence is fine.',
      },
      {
        label: 'Outside a small circle',
        detail: 'In a community of a few thousand, overlapping families are the norm. A counsellor based elsewhere in BC is not part of that network, and nobody sees you arrive.',
      },
      {
        label: 'Fits around a commute',
        detail: 'A session from a parked car at work or a closed room at home costs the session itself, not the afternoon around it. The booking calendar shows the counsellor’s real open times.',
      },
    ],
    faqs: [
      {
        q: 'Why not just go to Surrey?',
        a: 'You can, and if an office in Surrey suits you it is a reasonable choice; a consultation call would say so. From Maple Ridge the cost is the crossing: the Golden Ears Bridge there and back, every week, on top of a working week that may already include a bridge each day. Video takes that part out and leaves the counselling.',
      },
      {
        q: 'Is the Punjabi-speaking community in Maple Ridge large enough to have local services?',
        a: 'It is real and small. About 1.5% of Maple Ridge residents gave Punjabi as their mother tongue in the 2021 Census, roughly 1,360 people. Services in a language tend to follow numbers, which is why Punjabi-speaking counsellors with offices are concentrated in Surrey, Abbotsford and Vancouver.',
      },
      {
        q: 'Can sessions be in Punjabi for couples or EMDR?',
        a: 'Not at the moment. Punjabi-language sessions are individual counselling. Couples work and EMDR currently run in English or Tagalog, and individual sessions can be in Punjabi, English or a mix.',
      },
      {
        q: 'Will my extended health cover this?',
        a: ONLINE_COVERAGE,
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Maple Ridge (CSD 5915075)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915075&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Statistics Canada, 2021 Census Profile: Pitt Meadows (CSD 5915070)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055915070&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Statistics Canada, 2021 Census Profile: Surrey (CSD 5915004)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?LANG=E&DGUIDlist=2021A00055915004&SearchText=surrey',
      },
      {
        label: 'Fraser Health, Mental Health Centres directory',
        url: 'https://www.fraserhealth.ca/Service-Directory/Services/mental-health-and-substance-use/mental-health-centres/mental-health-centres',
      },
    ],
    nearby: ['surrey', 'abbotsford'],
  },
  /* VERNON, 2 Oct 2026. ARGUMENT: SCARCITY, said honestly about size.
   *
   * The Interior pattern: no Punjabi-speaking counsellor with an office
   * nearby, and Kelowna is the next place people look. The community is
   * small and the page says so, per the owner decision of 2 Oct 2026 above.
   * Statistics Canada 2021 Census Profile, Vernon CSD 5937014: Punjabi
   * mother tongue 505 of 43,730 (1.2%), knowledge 580 of 43,115, South Asian
   * 1,040 of 43,110 (2.4%); Vernon CA 2021S0504918: 600 and 715. Read 2 Oct
   * 2026 through StatCan's data service (the www12 Census Profile pages
   * returned 404 from here that day); cited at the Census Profile, as every
   * other region is.
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR.
   * No counsellor is named. */
  {
    slug: 'vernon',
    figure: { value: '505', label: 'Vernon residents gave Punjabi as their mother tongue in 2021: about 1.2% of the city' },
    region: 'Vernon',
    wider: 'the North Okanagan',
    blurb:
      'About 505 people in Vernon have Punjabi as their mother tongue. A community that size is easy to overlook, and easy to be recognised in.',
    metaDescription:
      'Punjabi-speaking online counselling for Vernon and the North Okanagan. Sessions in Punjabi, English, or both, with an RCC. Free 30-minute consultation.',
    demography: {
      stat: '505 Vernon residents gave Punjabi as their mother tongue in the 2021 Census, about 1.2% of the city, and 580 could hold a conversation in it.',
      body: [
        'That is a small community, and this page does not pretend otherwise. Across the wider Vernon census agglomeration the figure is **600 by mother tongue and 715 who can speak Punjabi**. South Asian residents numbered 1,040 in the city itself, about 2.4%.',
        'Small matters in two ways. Services in a language are usually built where its speakers are numerous, so a community of a few hundred tends to be served, if at all, from somewhere else. And in a community of a few hundred, people know each other, which makes a local waiting room a real concern rather than an imagined one.',
        'Both point the same way: a Punjabi-speaking counsellor who is not part of the local community, reached by video from home.',
      ],
    },
    localReality: {
      h2: 'What is actually available in the North Okanagan',
      body: [
        'Interior Health runs mental-health and substance-use services from its Vernon centre on 14th Avenue, and anyone can self-refer through 310-MHSU (6478). For young people aged 12 to 24, CMHA Vernon’s Youth Integrated Services Hub offers free drop-in counselling. Both are real options and worth using.',
        'Neither lists counselling sessions in Punjabi on its public pages. If a local service can offer Punjabi when you ask, that may suit you better, and it is worth asking.',
        'Kelowna is the next place most people look, and [Punjabi-speaking counselling for Kelowna](/punjabi-counselling/kelowna) sets out what the Central Okanagan does and does not have. The wider picture for Vernon, from the specialist line down Highway 97 to the 2021 fire, is on [online counselling for Vernon](/online-counselling/vernon).',
        'One limit, stated plainly: sessions in Punjabi are individual counselling. Couples work and EMDR currently run in English or Tagalog.',
      ],
    },
    access: [
      {
        label: 'Outside the local circle',
        detail: 'In a community of a few hundred, the counsellor you see by video is not a neighbour or a relative’s friend.',
      },
      {
        label: 'Punjabi, English, or both',
        detail: 'Use whichever language the sentence needs. Switching halfway through a thought is ordinary, and nobody stops to translate it.',
      },
      {
        label: 'Armstrong to Lumby, the same session',
        detail: 'Coldstream, Armstrong, Enderby and Lumby are covered on identical terms, with no drive into Vernon or down to Kelowna.',
      },
      {
        label: 'Family is part of the work',
        detail: 'What relatives expect, and who in a small community might hear about it, belong in the first session rather than being explained away first.',
      },
    ],
    faqs: [
      {
        q: 'The Punjabi community in Vernon is small. Is that a reason to look elsewhere?',
        a: 'It is the main reason this page exists. In a small community the worry is less about finding a counsellor and more about who else knows. A counsellor outside the North Okanagan, reached by video, takes that second question away.',
      },
      {
        q: 'Can my partner and I come together for sessions in Punjabi?',
        a: 'Not at the moment. Couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi, English or both.',
      },
      {
        q: 'Will my extended health cover this?',
        a: ONLINE_COVERAGE,
      },
      {
        q: 'Is there anything free first?',
        a: 'Interior Health’s Vernon centre is free and takes self-referrals, and for ages 12 to 24 the CMHA Vernon youth hub offers free drop-in counselling. Neither lists counselling sessions in Punjabi on its public pages. If language is the barrier, that is where this practice differs.',
      },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Vernon (CSD 5937014)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055937014&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Statistics Canada, 2021 Census Profile: Vernon (census agglomeration 918)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021S0504918&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Interior Health, access mental health and substance use services',
        url: 'https://www.interiorhealth.ca/services/access-mental-health-and-substance-use-services',
      },
      {
        label: 'CMHA Vernon and District, youth services',
        url: 'https://cmhavernon.ca/youth-services/',
      },
    ],
    nearby: ['kelowna', 'kamloops'],
  },  /* MISSION, 2 Oct 2026. ARGUMENT: DISTANCE.
   *
   * Scarcity would be false: Abbotsford, across the bridge, is one of the
   * places this file's header says Punjabi-speaking counsellors with offices
   * are. Abbotsford's argument does not transfer either: there Punjabi is the
   * mother tongue of nearly a quarter of the city. In Mission it is 7.1%,
   * 2,925 people, by far the town's largest mother tongue after English
   * (French 360 and German 345 are next), but a community of a few thousand.
   * So this page argues two things Abbotsford's cannot: the nearby option is
   * in another city, inside a larger community Mission families also belong
   * to; and much of Mission works outside the Valley (about 39% of those with
   * a usual place of work), so a weekly appointment in Abbotsford is on
   * nobody's way. Statistics Canada 2021 Census Profile, Mission CSD 5909056:
   * Punjabi mother tongue 2,925 of 41,030, most often at home 2,370. Read
   * 2 Oct 2026 through StatCan's data service (the www12 Census Profile pages
   * returned 404 from here that day); cited at the Census Profile, as every
   * other region is.
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR.
   * No counsellor is named. */
  {
    slug: 'mission',
    figure: { value: '2,925', label: 'Mission residents gave Punjabi as their mother tongue in 2021: about 7.1% of the town, its largest language after English' },
    region: 'Mission',
    wider: 'the north side of the Fraser Valley',
    blurb:
      'Punjabi is Mission’s largest language after English, and the Valley’s Punjabi-speaking practices are concentrated across the river in Abbotsford.',
    metaDescription:
      'Punjabi-speaking online counselling for Mission, BC. No office anywhere, no bridge to cross, no waiting room. Free 30-minute consultation.',
    demography: {
      stat: 'Punjabi is the mother tongue of 2,925 people in Mission, about 7% of the town and its largest mother tongue after English.',
      body: [
        'In the 2021 Census **Punjabi was the mother tongue of 2,925 Mission residents, about 7.1% of the population**, and 2,370 spoke it most often at home. No other language apart from English comes close: French and German, next in line, were the mother tongue of 360 and 345.',
        'That makes Mission different from Abbotsford across the river, where Punjabi is the mother tongue of nearly a quarter of the city. In Mission it is a real and established community, but one of a few thousand people in a town of about 41,500, which is a smaller circle than Abbotsford’s rather than a quieter one.',
        'So this page does not argue that Punjabi-speaking counselling is unavailable nearby. It is a bridge away, and anybody in Mission knows it. The question is what that option costs from here.',
      ],
    },
    localReality: {
      h2: 'The nearest option is in another city, and you are often in a third',
      body: [
        'The Valley’s Punjabi-speaking practices are concentrated in Abbotsford. From Mission that means the bridge, parking, and an appointment inside a larger community that many Mission families also belong to through work and family. For some people that is a comfort. For others it is the reason they never book, because a waiting room in Abbotsford is not anonymous to somebody from Mission.',
        '**Much of Mission works outside the Valley.** In the 2021 Census only about 36% of residents with a usual place of work worked in Mission, and about 39% worked outside the Fraser Valley regional district altogether. An office in Abbotsford is south across the river while a commuter is often far to the west, and a weekly appointment there is on nobody’s way. Video reaches you on whichever side of the valley you happen to be.',
        'Fraser Health runs public mental-health and substance-use services from its centre on Hurd Street, which accepts self-referrals from adults, and that is worth knowing whichever language you want to work in. **This page is not an argument against any of it**, or against a counsellor in Abbotsford if that suits you.',
        'The alternative here is simple to describe. Sessions are by secure video from wherever you have a private room, and the counsellor is not part of the families, workplaces or events that Mission shares with Abbotsford. Whether that matters is for you to weigh; for some people it decides whether they book at all.',
        'One limit, stated plainly: sessions in Punjabi are individual counselling. Couples work and EMDR currently run in English or Tagalog.',
        'If language is not what you are solving for, [online counselling for Mission](/online-counselling/mission) covers the rest, including the commute and the communities east along the Lougheed. For the Valley’s larger community across the river, [Punjabi-speaking counselling for Abbotsford](/punjabi-counselling/abbotsford) makes its own case.',
      ],
    },
    access: [
      { label: 'No bridge, no waiting room', detail: 'Nothing to cross and nowhere to be seen arriving. A session needs a private room and a connection, at home, at work or in a parked car.' },
      { label: 'Not part of the two-town circle', detail: 'No overlap with the families, workplaces and gatherings Mission shares with Abbotsford, which in a community of a few thousand is most of what privacy means.' },
      { label: 'Punjabi, English, or both', detail: 'Start in whichever language is easier that day and change when it helps. Forms, plan names and therapy terms can stay in English without anyone remarking on it.' },
      { label: 'Around the commute', detail: 'The calendar shows real open times, and the session happens from wherever you are that day rather than in a fixed slot on the far side of the river.' },
    ],
    faqs: [
      { q: 'There are Punjabi-speaking counsellors in Abbotsford. Why go online from Mission?', a: 'If an Abbotsford counsellor suits you, that is a good choice, and a consultation call would say as much. Looking further usually comes down to one of two things from Mission: the trip across the bridge into a community you are also part of, or an appointment you cannot reach while working out of the Valley.' },
      { q: 'Is the community in Mission really big enough to worry about being recognised?', a: 'Size works the other way. In a community of a few thousand that shares relatives, workplaces and events with the city across the river, a familiar face in a waiting room is more likely, not less. Whether that matters is your call; the option of avoiding it is here if it does.' },
      { q: 'Can my spouse and I have sessions together in Punjabi?', a: 'Not at the moment. Couples sessions currently run in English or Tagalog, while individual counselling is available in Punjabi, English or a mix of the two.' },
      { q: 'Will my extended health cover this?', a: ONLINE_COVERAGE },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Mission (CSD 5909056)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055909056&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Fraser Health, Mission Mental Health and Substance Use Centre',
        url: 'https://www.fraserhealth.ca/Service-Directory/Locations/Mission/mission-mental-health-centre',
      },
      {
        label: 'Statistics Canada, Focus on Geography Series, 2021 Census, Abbotsford (Census subdivision)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/as-sa/fogs-spg/page.cfm?lang=E&topic=1&dguid=2021A00055909052',
      },
    ],
    nearby: ['abbotsford', 'surrey', 'maple-ridge'],
  },
  /* COURTENAY AND THE COMOX VALLEY, 2 Oct 2026. ARGUMENT: SCARCITY, stated
   * as SMALL. Owner decision of the same day: every city in the October batch
   * gets its Punjabi page, and where the community is small the page states
   * the real figure and argues honestly (few same-language counsellors
   * locally; online reaches one) rather than inflating it. Statistics Canada
   * 2021 Census Profile, Courtenay census agglomeration (943): Punjabi
   * mother tongue 185 of 62,665 (0.3%); knowledge of Punjabi 280 of 62,025;
   * South Asian 625. Read 2 Oct 2026 through StatCan's data service (the
   * www12 Census Profile pages returned 404 from here that day); cited at the
   * Census Profile, as every other region is. The figures are for the
   * census agglomeration, so the copy says so rather than "the Comox Valley".
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR.
   * No counsellor is named. */
  {
    slug: 'courtenay',
    figure: { value: '185', label: 'people in the Courtenay census agglomeration gave Punjabi as their mother tongue in 2021: a small community, a long way from where Punjabi-speaking counsellors are concentrated' },
    region: 'Courtenay',
    wider: 'the Comox Valley',
    blurb:
      'The Comox Valley’s Punjabi-speaking community is small, and so is the chance of finding a counsellor in the valley who works in Punjabi.',
    metaDescription:
      'Punjabi-speaking online counselling for Courtenay and the Comox Valley. Individual sessions in Punjabi, English or both, with an RCC. Free consultation.',
    demography: {
      stat: 'In the 2021 Census, 185 people in the Courtenay census agglomeration named Punjabi as their mother tongue, and 280 could hold a conversation in it.',
      body: [
        'That is a small community, about three in every thousand residents of the Courtenay census agglomeration, which centres on Courtenay, Comox and Cumberland, and this page does not pretend otherwise. In the same census 625 residents identified as South Asian. The figures are in the Statistics Canada 2021 Census Profile cited below.',
        'Small does not make the need smaller. It changes its shape. In Surrey the difficulty is anonymity inside a large community; here it is the opposite, visibility inside a small one, where the few families who share a language are likely to know each other.',
        'Punjabi-speaking counsellors in BC are concentrated in the Lower Mainland. From the Comox Valley, seeing one in person has meant the highway south and a ferry each way, for a fifty-minute appointment.',
      ],
    },
    localReality: {
      h2: 'What is actually available in the Comox Valley',
      body: [
        'Island Health’s Comox Valley Mental Health & Substance Use team in Courtenay is the public route for adults, and it takes adults by walk-in or by phone, with no referral. Using it does not rule out private counselling; the two can run at the same time.',
        'Courtenay and Comox have private counsellors, and for general work in English the valley is not badly served. What it is unlikely to offer is a session held **in Punjabi**: in a community of a few hundred speakers, that is the gap this page is about.',
        'That gap is wider than it looks from outside. A conversation about a parent’s expectations, a marriage arranged or resisted, or money owed to family back home happens in one language and gets translated into another for an English-only session. Something is lost in that translation every time, usually the part that mattered.',
        'The rest of what shapes access here, postings, the islands and a valley where people know each other, is set out on [online counselling for the Comox Valley](/online-counselling/courtenay). Further south, most of the Island’s Punjabi-speaking community lives in Saanich, and [Punjabi-speaking counselling for Saanich](/punjabi-counselling/saanich) makes its own case.',
      ],
    },
    access: [
      { label: 'No ferry for a language', detail: 'Punjabi-speaking counsellors are concentrated on the mainland, so in person has meant the highway south and a sailing. By video the session happens in any private room in the valley with a connection.' },
      { label: 'Punjabi, English, or both', detail: 'Switch whenever the conversation calls for it. Nobody keeps track of which language a sentence was in, and terms like extended health tend to come out in English anyway.' },
      { label: 'Nobody local in the room', detail: 'In a community this size, a counsellor from outside the valley is not part of anybody’s family or social circle, and there is no waiting room to be seen in.' },
      { label: 'Individual counselling', detail: 'Sessions in Punjabi are one-to-one. Couples counselling and EMDR currently run in English or Tagalog, and that is said plainly before anybody books.' },
    ],
    faqs: [
      { q: 'Is there really nobody in the Comox Valley who counsels in Punjabi?', a: 'Not one this page can point to. Punjabi-speaking counsellors in BC are concentrated in the Lower Mainland, which is why a video session is the realistic route from Courtenay, Comox or Cumberland rather than a second-best one.' },
      { q: 'Can my spouse and I come together in Punjabi?', a: 'Not for couples work at the moment: couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi, and the free 30-minute consultation is the place to talk through what would help most.' },
      { q: 'Will my extended health cover this?', a: ONLINE_COVERAGE },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Courtenay (census agglomeration 943)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021S0504943&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Island Health, Comox Valley Mental Health & Substance Use',
        url: 'https://www.islandhealth.ca/our-services/mental-health-substance-use-services/adult-mental-health-substance-use-services/comox-valley-mental-health-substance-use',
      },
    ],
    nearby: ['saanich'],
  },
  /* LANGFORD AND THE WEST SHORE, 2 Oct 2026. ARGUMENT: SCARCITY, stated as
   * SMALL. Owner decision of the same day: every city in the October batch
   * gets its Punjabi page, and where the community is small the page states
   * the real figure and argues honestly (few same-language counsellors
   * locally; online reaches one) rather than inflating it. Statistics Canada
   * 2021 Census Profile, Langford CSD 5917044: Punjabi mother tongue 535
   * (1.2%); knowledge of Punjabi 670; South Asian 1,880. Victoria CMA 935:
   * Punjabi mother tongue 4,340 (1.1%). (The Capital census division figure
   * on the Saanich page, 4,350, is a different geography.) Read 2 Oct 2026
   * through StatCan's data service, when the www12 Census Profile pages
   * returned 404 from here; cited at the Census Profile, as every other
   * region is. Courtenay argues smallness inside a valley; this page argues
   * it beside Saanich, where most of the region's speakers live, and a
   * highway from them.
   *
   * Individual only: the Punjabi speaker offers neither couples nor EMDR.
   * No counsellor is named. */
  {
    slug: 'langford',
    figure: { value: '535', label: 'Langford residents gave Punjabi as their mother tongue in 2021, about 1.2% of the city: a small community, and this page does not pretend otherwise' },
    region: 'Langford',
    wider: 'the West Shore and Greater Victoria',
    blurb:
      'Langford’s Punjabi-speaking community is small, and the Punjabi-speaking counsellors with offices are concentrated on the other side of the Strait.',
    metaDescription:
      'Punjabi-speaking online counselling for Langford and the West Shore. Sessions in Punjabi, English or both, with an RCC. Free 30-minute consultation.',
    demography: {
      stat: 'In the 2021 Census, 535 Langford residents reported Punjabi as their mother tongue, about 1.2% of the city.',
      body: [
        'That is a small community, and this page does not pretend otherwise. Across the Victoria census metropolitan area the same census counted **4,340 people whose mother tongue is Punjabi**, about 1.1% of the region, and 670 Langford residents said they could hold a conversation in it. Set beside Surrey or Abbotsford, those are small numbers. Most of the region’s speakers live in Saanich, a highway drive away, and [Punjabi-speaking counselling for Saanich](/punjabi-counselling/saanich) sets out that community.',
        'Small is the point. In a community of a few hundred people in one city, the chance that a counsellor, a receptionist or somebody in a waiting room knows your family is not remote. And the counsellors who can hold a session in Punjabi are concentrated in the Lower Mainland, a ferry away.',
        'So the case here is scarcity, made sharper by size: there is no realistic local option in the language, and the privacy a large community provides simply by numbers is not available in a small one. A session by video answers both.',
      ],
    },
    localReality: {
      h2: 'What is actually available on the West Shore',
      body: [
        'Island Health’s Western Communities Mental Health & Substance Use team is the public route for adults on the West Shore, reached by calling it directly, and Pacific Centre Family Services Association provides funded counselling, most of it at no cost, alongside an affordable program. Both are worth using. If you are already connected to either, stay connected; private counselling runs alongside them rather than instead.',
        'The question this page answers is narrower: whether you can be counselled **in Punjabi** without crossing the Strait. On the West Shore the realistic answer is by video.',
        'That matters more than it sounds. Grief, a strained household, a parent’s expectations and "log kya kahenge" all carry context that takes a long time to explain in English and very little in Punjabi. Translating a feeling while you are still trying to name it costs something real.',
        '[Online counselling for Langford](/online-counselling/langford) covers the rest of the West Shore picture, including the Highway 1 commute, and [the Victoria page](/online-counselling/victoria) sets out what the Strait does to the Island’s specialist pool.',
      ],
    },
    access: [
      { label: 'No ferry, no Highway 1', detail: 'The nearest Punjabi-speaking counsellors with offices are in the Lower Mainland. From the West Shore, a video session replaces both the sailing and the drive to the terminal.' },
      { label: 'Punjabi, English, or both', detail: 'Switching between the two is normal and needs no announcing. Words like RCC or extended health tend to stay in English, since that is how they get said here.' },
      { label: 'Privacy in a small community', detail: 'A few hundred Punjabi speakers in one city is a community where people know each other. There is no waiting room to be recognised in.' },
      { label: 'Colwood to Sooke', detail: 'View Royal, Colwood, Metchosin, the Highlands and Sooke on identical terms, with no penalty for living further out.' },
    ],
    faqs: [
      { q: 'Do I have to choose Punjabi or English before the first session?', a: 'No. Punjabi throughout, English throughout, or a mix that changes with the subject. None of it needs deciding in advance, and changing your mind partway through a session is fine.' },
      { q: 'The community here is small. Who would know?', a: 'Nobody, unless you tell them. This is a virtual practice with no office anywhere, no waiting room, and nothing reported to anybody. The limits of confidentiality are narrow, and they are explained at the start.' },
      { q: 'Could my husband or wife join a session in Punjabi?', a: 'Not as couples counselling for now: couples work runs in English or Tagalog. Sessions in Punjabi are individual, and the free 30-minute consultation is where to talk through whether that fits what you need.' },
      { q: 'Will my extended health cover this?', a: ONLINE_COVERAGE },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Langford (CSD 5917044)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055917044&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Statistics Canada, 2021 Census Profile: Victoria (census metropolitan area 935)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021S0503935&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Island Health, Western Communities (formerly Westshore) Mental Health & Substance Use',
        url: 'https://www.islandhealth.ca/our-services/mental-health-substance-use-services/adult-mental-health-substance-use-services/western-communities-formerly-westshore-mental-health-substance-use',
      },
    ],
    nearby: ['saanich', 'courtenay'],
  },
  /* CRANBROOK, 2 Oct 2026. Argues SCARCITY, from a small base, and says so.
     Owner decision of the same day: the figure is stated plainly. Statistics
     Canada 2021 Census Profile, Cranbrook CSD 5901022: South Asian 365 (1.8%,
     the largest racialized group); Punjabi mother tongue 165, spoken most
     often at home 120 (the most common non-official home language in the
     city), knowledge 230. East Kootenay RD 5901: knowledge of Punjabi 500,
     most often at home 210 (first among non-official languages). Read 2 Oct
     2026 through StatCan's data service while the www12 pages returned 404
     from here; cited at the Census Profile, as every other city is. The point
     is that a community this size is unlikely to produce a local
     Punjabi-speaking counsellor. English only. */
  {
    slug: 'cranbrook',
    figure: { value: '120', label: 'Cranbrook residents who speak Punjabi most often at home: the most common non-official home language in the city, in a community that is small' },
    region: 'Cranbrook',
    wider: 'the East Kootenay',
    blurb:
      'Punjabi is the most common non-official language spoken at home in Cranbrook. The community is small, which makes a local Punjabi-speaking counsellor unlikely.',
    metaDescription:
      'Punjabi-speaking online counselling for Cranbrook and the East Kootenay. Sessions in Punjabi, English or both, with an RCC. Free 30-minute consultation.',
    demography: {
      stat: 'In the 2021 Census about 120 Cranbrook residents spoke Punjabi most often at home, in a South Asian community of about 365.',
      body: [
        'Those are small numbers, and this page does not pretend otherwise. In the 2021 Census, **365 Cranbrook residents were South Asian**, about 1.8% of the city and its largest racialized group. About 165 named Punjabi as their mother tongue and 230 can hold a conversation in it. Across the whole East Kootenay, about 500 people can.',
        'Small is still more than any other non-official language in Cranbrook homes. No other language besides English and French is spoken most often at home by more people in the city, and the same is true across the regional district.',
        'A community of a few hundred is unlikely to produce a local Punjabi-speaking clinical counsellor, and the nearest with offices are in the Lower Mainland and the Fraser Valley, a long day’s drive west.',
      ],
    },
    localReality: {
      h2: 'Small community, one clock ahead',
      body: [
        'Interior Health runs mental-health and substance-use services in Cranbrook, reached through 310-MHSU (6478). If you are already connected to them, staying connected is worth doing: private virtual counselling runs alongside public care, not instead of it.',
        'In a South Asian community of a few hundred, the same families meet at work, at weddings and in the grocery aisle. That cuts both ways. It is support, and it is also the reason somebody may not want to be seen going to a counsellor, or to talk about a family matter with anybody who might know the family. A counsellor in another part of the province, by video, removes that overlap.',
        'The East Kootenay keeps Alberta’s clock, an hour ahead of the Pacific time the booking calendar uses, in every season. Add an hour to any open time you see; the booking page labels its times as Pacific time.',
        'Language is one part of access here. [Online counselling for Cranbrook](/online-counselling/cranbrook) covers the rest: the Elk Valley’s shift work, the free options for young people, and why the clock matters.',
      ],
    },
    access: [
      { label: 'No drive to the Lower Mainland', detail: 'The nearest Punjabi-speaking counsellors with offices are a long day’s drive west. A session needs a private room in BC and a connection, nothing more.' },
      { label: 'Punjabi, English, or both', detail: 'A session can move between the two as you need. Clinical words such as RCC and extended health often stay in English, because those are the words on the forms.' },
      { label: 'Nobody from the community in the waiting room', detail: 'In a community of a few hundred, a local appointment is rarely anonymous. A video session has no waiting room at all.' },
      { label: 'An hour ahead, translated once', detail: 'Open times are listed in Pacific time, and the booking page says so; Cranbrook is an hour later in every season.' },
    ],
    faqs: [
      { q: 'Is there a Punjabi-speaking counsellor in Cranbrook?', a: 'Not with an office that this practice knows of, which in a community this size is not surprising; the nearest are in the Lower Mainland and the Fraser Valley. Sessions in Punjabi by video are the practical route here.' },
      { q: 'Can couples sessions be in Punjabi?', a: 'Not at the moment: couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi, in English, or moving between the two.' },
      { q: 'Will my extended health cover this?', a: ONLINE_COVERAGE },
    ],
    sources: [
      { label: 'Statistics Canada, 2021 Census Profile: Cranbrook (CSD 5901022)', url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055901022&GENDERlist=1&STATISTIClist=1&HEADERlist=0' },
      { label: 'Statistics Canada, 2021 Census Profile: East Kootenay (regional district 5901)', url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00035901&GENDERlist=1&STATISTIClist=1&HEADERlist=0' },
      { label: 'Interior Health, Cranbrook Mental Health & Substance Use', url: 'https://www.interiorhealth.ca/locations/cranbrook-mental-health-substance-use' },
    ],
    nearby: ['kelowna', 'kamloops'],
  },
  /* CAMPBELL RIVER, 2 Oct 2026. Argues SCARCITY, from the smallest base of
     any region page, and says so. Owner decision of the same day: the figure
     is stated plainly. Statistics Canada 2021 Census Profile, Campbell River
     CSD 5924034: Punjabi mother tongue 155 of 35,205 (0.4%), spoken most
     often at home 95, knowledge 225; South Asian 535.
     https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055924034&GENDERlist=1&STATISTIClist=1&HEADERlist=0
     read 2 Oct 2026 through StatCan's data service, when the www12 Census
     Profile pages returned 404 from here. The argument is not that the
     community is large; it is that a community of this size will not produce
     a local Punjabi-speaking counsellor, and that being few makes being seen
     likelier. English only. */
  {
    slug: 'campbell-river',
    figure: { value: '155', label: 'Campbell River residents whose mother tongue is Punjabi, 2021 Census. About 95 speak it most often at home' },
    region: 'Campbell River',
    wider: 'the North Island',
    blurb:
      'Campbell River’s Punjabi-speaking community is small, and that is the point: a community this size is unlikely to have a counsellor in town who speaks it.',
    metaDescription:
      'Punjabi-speaking online counselling for Campbell River and the North Island. Individual sessions in Punjabi, English or both. Free 30-minute consultation.',
    demography: {
      stat: 'Punjabi is the mother tongue of about 155 people in Campbell River, under half of one percent of the city, in the 2021 Census.',
      body: [
        'This page states that number plainly because it is small. In the 2021 Census about **155 Campbell River residents** reported Punjabi as their mother tongue, about 95 spoke it most often at home, and about 225 could hold a conversation in it. Around 535 people identified as South Asian. Those are real people and real households, and they are not a large community.',
        'A community of that size is unlikely to sustain a Punjabi-speaking counsellor in town. The Punjabi-speaking counsellors with offices in BC are concentrated in the Lower Mainland, which from Campbell River means the length of the Island Highway and then a ferry.',
        'Small also changes the privacy question. Where only a few hundred people share a language, the chance that someone in a waiting room knows your family is not remote, and for some people that alone is the reason they have not looked for help.',
      ],
    },
    localReality: {
      h2: 'What is actually available in Campbell River',
      body: [
        'Island Health runs the public route. Its Campbell River Mental Health & Substance Use intake takes self-referrals and offers same-day appointments and single-session walk-in counselling. Anyone already using it can keep using it; a private course of counselling sits beside the public one without displacing it.',
        'There are private counsellors in Campbell River, and some are very good. The narrower question this page answers is whether you can be counselled **in Punjabi**, and for a community of this size the realistic answer is to look beyond the city.',
        'Being few changes what isolation feels like. A family argument, a parent’s illness back home, or the weight of "log kya kahenge" lands differently when there are only a handful of households to talk to, and every one of them knows the others.',
        'Language is one part of access here. [Online counselling for Campbell River](/online-counselling/campbell-river) covers the rest: the ferries to Quadra and Cortes, seasonal and rotational work, and the Island Health routes north and south of the city. Down-Island, [Punjabi-speaking counselling for the Comox Valley](/punjabi-counselling/courtenay) makes the same case for a slightly larger community.',
      ],
    },
    access: [
      { label: 'No ferry to the Lower Mainland', detail: 'The Punjabi-speaking counsellors with offices in BC are concentrated in the Lower Mainland. Sessions here happen wherever you have a private room and a connection, on the North Island or anywhere else in BC.' },
      { label: 'Punjabi, English, or both', detail: 'Nobody fixes the language at the start. A worry about a parent may come out in one and a question about a claim in the other, and either is fine.' },
      { label: 'Privacy in a very small community', detail: 'Where only a few hundred people share the language, being recognised is the real risk. A video session has no waiting room.' },
      { label: 'Individual sessions', detail: 'Sessions in Punjabi are individual counselling. Couples work and EMDR currently run in English or Tagalog.' },
    ],
    faqs: [
      { q: 'There are so few of us here. Is this really for me?', a: 'Yes. Being few is the reason it matters: in a community this size there is unlikely to be anyone local who can counsel you in Punjabi, and a counsellor elsewhere in BC by video is the realistic route.' },
      { q: 'Can I switch between Punjabi and English?', a: 'Yes, and most people do without planning it. Whichever language something happened in is usually the easiest one to describe it in, and nobody has to choose in advance.' },
      { q: 'Will my extended health cover this?', a: ONLINE_COVERAGE },
      { q: 'Can we do couples counselling in Punjabi?', a: 'Not at the moment: couples sessions currently run in English or Tagalog. Individual counselling is available in Punjabi.' },
    ],
    sources: [
      {
        label: 'Statistics Canada, 2021 Census Profile: Campbell River (CSD 5924034)',
        url: 'https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm?Lang=E&DGUIDlist=2021A00055924034&GENDERlist=1&STATISTIClist=1&HEADERlist=0',
      },
      {
        label: 'Island Health, Campbell River Mental Health & Substance Use',
        url: 'https://www.islandhealth.ca/our-services/mental-health-substance-use-services/access-referrals-mental-health-substance-use-services/intake-campbell-river-referrals-mhsu',
      },
    ],
    nearby: ['courtenay', 'saanich'],
  },
];

export const getPunjabiRegion = (slug: string) =>
  punjabiRegions.find((r) => r.slug === slug);

/* THE OPENING, ANSWER FIRST — 1 Oct 2026.
 *
 * /punjabi-counselling/vancouver had about 189 page-one impressions at 9-10
 * and no clicks in any export. It opened with the census figure, which the
 * Stat block and the first paragraph then repeated twice more, and nowhere
 * near the top said who the counsellor is, how sessions run or what they
 * cost. This paragraph answers those first and the census moves down into
 * the section about the local picture, where it is the argument.
 *
 * Built by the page from the roster (the speaker bookingCtaFor resolves) and
 * the catalogue (the individual fee), so neither a name nor a price is typed
 * here. No census numbers and no Gurmukhi. Coverage is the plan's to decide. */
export function regionOpening(args: {
  region: string;
  /** "Savneet Singh, RCC", or undefined when nobody accepting speaks Punjabi. */
  who?: string;
  /** "English or Punjabi", the speaker's own languages. */
  languages?: string;
  fee?: { fee: string; minutes: number };
}): string {
  const { region, who, languages, fee } = args;
  const lead = who
    ? `Punjabi-speaking counselling for ${region} is with ${who}, by secure video, in ${languages ?? 'Punjabi or English'}, or a mix of both.`
    : `Punjabi-speaking counselling for ${region} is by secure video with a Registered Clinical Counsellor, in Punjabi or English, or a mix of both.`;
  const cost = fee
    ? `Individual sessions are ${fee.fee} for ${fee.minutes} minutes, after a free 30-minute consultation`
    : 'It starts with a free 30-minute consultation';
  return `${lead} ${cost}, and whether an extended health plan reimburses it depends on the plan.`;
}

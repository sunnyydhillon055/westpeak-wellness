import type { Province } from './crisis';
import { albertaMore, ontarioPages } from './expansion-more';

/* ALBERTA AND ONTARIO PAGE DATA.
 *
 * ============================================================================
 * WHY THERE ARE NOT FIFTY PAGES HERE
 * ============================================================================
 *
 * The directive asked for ten page types per city across five cities. Ten of
 * those types are province-level or service-level facts that do not change when
 * you cross a city boundary:
 *
 *   cost and coverage      — Alberta insurers do not differ between Calgary and
 *                            Edmonton. One province page, linked from both.
 *   finding a therapist    — verification is a provincial question. One page.
 *   anxiety / depression / trauma / EMDR / couples
 *                          — these are service facts. A "Calgary anxiety
 *                            counselling" page and an "Edmonton anxiety
 *                            counselling" page differ by one word, which is
 *                            precisely the <25%-shared-copy rule failing.
 *
 * lib/locations.ts already states this principle for BC, and it is the reason
 * the practice runs six BC city pages rather than forty-three: "A city page is
 * kept ONLY where something true and specific about accessing care from that
 * place changes what the page says." SEO_COMPETITIVE_2026-08-17.md found the
 * same thing from the other direction — the only reason this site's city pages
 * are defensible against Clearheart's thirty is that they are not templated.
 * Shipping twenty-five templated pages would trade the one advantage the site
 * has for volume it cannot win on.
 *
 * So what is built is what genuinely varies by city: local context, community
 * composition, and the Punjabi/South Asian wedge — plus province-level pages
 * for the province-level facts. The cut pages and the reasoning are recorded in
 * EXPANSION_LEDGER.md.
 * ============================================================================
 */

export type RegionSection = {
  h2: string;
  body?: string[];
  list?: { label: string; detail: string }[];
};

export type RegionPage = {
  /** Full path after the province, e.g. 'calgary/punjabi-speaking-counselling'. */
  path: string;
  province: Province;
  /** City slug, for the crisis block. Absent on province-level pages. */
  citySlug?: string;
  city?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string;
  /** 40–55 words, quotable in isolation, directly under the H1. */
  directAnswer: string;
  sections: RegionSection[];
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
  sources?: { label: string; url: string }[];
  figure?: string;
  /** Renders a Punjabi-language block. Sets lang="pa" on that section. */
  punjabi?: { heading: string; body: string[] };
  updated: string;
};

const U = '2026-08-17';

/* ==========================================================================
   ALBERTA — published
   ========================================================================== */

const albertaCore: RegionPage[] = [
  {
    path: 'calgary/punjabi-speaking-counselling',
    province: 'AB',
    citySlug: 'calgary',
    city: 'Calgary',
    title: 'Punjabi-speaking counselling in Calgary',
    metaTitle: 'Punjabi Counselling in Calgary | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English for people in Calgary, by secure video. Registered Clinical Counsellor, BC Association of Clinical Counsellors.',
    eyebrow: 'Calgary · ਪੰਜਾਬੀ',
    lede:
      'Therapy in the language the feeling actually happened in, without needing anybody in the community to know you are going.',
    directAnswer:
      'Counselling in Punjabi or English is available to anyone located in Calgary by secure video. Sessions are provided by a Registered Clinical Counsellor registered in British Columbia, counselling therapy is not a regulated profession in Alberta, so no Alberta college registers counsellors. A free 15-minute consultation comes first.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'What language does to a session',
        body: [
          'Most people who ask for counselling in Punjabi are not asking because their English is poor. They are usually fluent, often more comfortable in English at work, and perfectly able to describe their week in it. The request is about something narrower and harder to explain: the sentences that carry the actual weight were not formed in English.',
          '**Shame is the clearest example.** *Sharam* is not "shame" and it is not "embarrassment". It carries a public dimension, what this does to the family, what will be said. That neither English word holds. A person can spend three sessions circling that in English and land on it in one sentence of Punjabi. That is not a translation problem. It is the difference between describing a feeling and being inside it.',
          'The same is true of the things a parent said twenty years ago, of *izzat*, and of the specific weight of being the one who was supposed to make it worth it. Those are stored in the language they arrived in, and they surface fastest in that language.',
          'It also works the other way, and this matters just as much. Plenty of people find the practical parts: planning, boundaries, what to actually say on Sunday, easier in English. Moving between the two inside one session is normal here rather than something to apologise for, and there is no requirement to pick one at the start.',
        ],
      },
      {
        h2: 'Why distance is the point, not the compromise',
        body: [
          'Calgary\'s South Asian community is large, established and connected: through gurdwaras, through business networks, through the family networks that came with migration in the 1970s and 80s and again more recently. That connectedness is a genuine strength and it is also, for this particular decision, a problem.',
          'The counsellor who comes recommended in a connected community is frequently connected to the very people you would least want informed. Not through any breach, simply because the recommendation travelled through the same network the difficulty lives in. People who would otherwise book do not book, and the reason is almost never cost.',
          'A counsellor several provinces away, with no Calgary practice, no shared gurdwara and no mutual acquaintances, removes that calculation entirely. There is no waiting room in which to be seen. The session happens in your own home, at a time nobody else has to know about.',
        ],
      },
      {
        h2: 'What the Calgary week actually looks like',
        body: [
          'Two things come up here more than anywhere else in the country, and they shape scheduling as much as content.',
          '**The energy cycle.** Calgary households live with a boom-and-bust rhythm that no other Canadian city has to the same degree. Layoffs arrive in waves, they arrive to whole social circles at once, and they land hardest on people whose sense of themselves is bound to providing. For a first- or second-generation household where the migration was justified by work, a layoff is not only a financial event.',
          '**Rotational and site work.** A significant share of Calgary-based workers are away on rotation, and a schedule that assumes the same hour every week does not survive it. Sessions here are booked block by block with gaps, which is a normal pattern rather than a failure to commit.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਕੈਲਗਰੀ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਨੀ ਚਾਹੁੰਦੇ ਹੋ? ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ, ਅਤੇ ਇੱਕੋ ਸੈਸ਼ਨ ਵਿੱਚ ਦੋਹਾਂ ਵਿਚਕਾਰ ਬਦਲਣਾ ਵੀ ਠੀਕ ਹੈ।',
        'ਸਭ ਕੁਝ ਵੀਡੀਓ ਰਾਹੀਂ ਹੁੰਦਾ ਹੈ, ਤੁਹਾਡੇ ਆਪਣੇ ਘਰ ਤੋਂ। ਕੋਈ ਦਫ਼ਤਰ ਨਹੀਂ, ਕੋਈ ਉਡੀਕ-ਕਮਰਾ ਨਹੀਂ, ਅਤੇ ਕੈਲਗਰੀ ਦੇ ਕਿਸੇ ਭਾਈਚਾਰੇ ਨਾਲ ਕੋਈ ਸਾਂਝ ਨਹੀਂ।',
        'ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ ਹੈ ਅਤੇ ਮੁਫ਼ਤ ਹੈ। ਜੇ ਲੱਗੇ ਕਿ ਕੋਈ ਹੋਰ ਤੁਹਾਡੇ ਲਈ ਬਿਹਤਰ ਹੋਵੇਗਾ, ਤਾਂ ਉਹ ਵੀ ਸਾਫ਼ ਦੱਸਿਆ ਜਾਵੇਗਾ।',
      ],
    },
    faqs: [
      {
        q: 'Is the counsellor registered in Alberta?',
        a: 'No, and no counsellor is, counselling therapy is not currently a regulated profession in Alberta, so there is no Alberta college that registers counsellors. Sessions are provided by a Registered Clinical Counsellor registered with the BC Association of Clinical Counsellors, and that registration is public and can be checked in about two minutes.',
      },
      {
        q: 'Can we switch between Punjabi and English?',
        a: 'Yes, and most people do without planning to. It is common to move into Punjabi when the subject is family, shame or something a parent said, and back into English for practical planning. That switch is worth paying attention to rather than correcting. The language a memory is held in is often the language it has to be worked in.',
      },
      {
        q: 'Will anyone in Calgary know I am doing this?',
        a: 'No. There is no office, no waiting room, and no connection to any Calgary community network. Nothing is shared with family, employers or anyone else. The limits on confidentiality are the standard clinical ones, risk of serious harm, and legal obligations, and they are set out in full before a first session.',
      },
      {
        q: 'Is it covered by Alberta Health Care?',
        a: 'No. AHCIP does not cover counselling from a Registered Clinical Counsellor. Many workplace extended health plans do reimburse, and the amount varies by plan, the Alberta coverage page sets out what to ask your insurer before booking.',
      },
    ],
    related: [
      { href: '/alberta', label: 'Online counselling across Alberta' },
      { href: '/alberta/punjabi-counselling', label: 'Punjabi counselling across Alberta' },
      { href: '/alberta/calgary/south-asian-therapist', label: 'South Asian counselling in Calgary' },
      { href: '/alberta/counselling-coverage-alberta', label: 'What Alberta plans cover' },
      { href: '/alberta/is-my-therapist-registered', label: 'How to check a counsellor in Alberta' },
    ],
    sources: [
      { label: 'Government of Alberta, counselling therapy regulation announcement', url: 'https://www.alberta.ca/' },
      { label: 'BC Association of Clinical Counsellors, find a counsellor', url: 'https://bc-counsellors.org/counsellors/' },
    ],
  },

  {
    path: 'edmonton/punjabi-speaking-counselling',
    province: 'AB',
    citySlug: 'edmonton',
    city: 'Edmonton',
    title: 'Punjabi-speaking counselling in Edmonton',
    metaTitle: 'Punjabi Counselling in Edmonton | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English for people in Edmonton, by secure video. Registered Clinical Counsellor, BC Association of Clinical Counsellors.',
    eyebrow: 'Edmonton · ਪੰਜਾਬੀ',
    lede:
      'A long-settled community, a shortage of Punjabi-speaking clinicians, and a winter that makes getting anywhere harder than it sounds.',
    directAnswer:
      'Counselling in Punjabi or English is available to anyone located in Edmonton by secure video. Sessions are provided by a Registered Clinical Counsellor registered in British Columbia, counselling therapy is not a regulated profession in Alberta, so no Alberta college registers counsellors. A free 15-minute consultation comes first.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'Edmonton\'s Punjabi community is older than most people assume',
        body: [
          'Edmonton has one of the longest-established South Asian populations in western Canada, with families whose arrival dates to the 1960s and 70s and whose third generation is now adult. That length of settlement changes what people bring to counselling.',
          'The presenting difficulty is less often the migration itself and more often what accumulated across it. A grandparent\'s silence about why they left. A parent who was never able to be unwell because there was no room for it. An adult child who is, by every external measure, the outcome the family sacrificed for, and who cannot say out loud that it has not felt like enough.',
          'This is different from the newer-arrival picture, and a page written for that picture will miss it. Intergenerational work here is frequently three generations deep rather than two, and the person in the room is often trying to hold a line without becoming the one who broke something.',
        ],
      },
      {
        h2: 'Supply is the constraint here, not demand',
        body: [
          'Edmonton has considerably fewer Punjabi-speaking counsellors than the Lower Mainland or the Greater Toronto Area, and the ones practising carry waitlists. The major directories return short lists for the city, and several of the entries are clinics offering "Punjabi available" without a named clinician who actually speaks it.',
          'That produces a specific failure: people ring three numbers, get a waitlist and a maybe, and stop. Virtual counselling from outside the province is not a second-best option in that situation. It is frequently the only route to a counsellor who can actually work in the language.',
        ],
      },
      {
        h2: 'Winter, daylight, and the months this gets harder',
        body: [
          'Edmonton sits far enough north that December daylight runs to about seven and a half hours, and the effect on mood is not imaginary. Low mood that arrives in November and lifts in March is common enough here to be worth naming rather than treating as a personal failing.',
          'It also changes what is realistic. Getting across the city to an appointment in February, in the dark, after work, is a genuine barrier, and it is the barrier that quietly ends a course of counselling around week four. Sessions from home remove it, and the camera can be off on the days when being seen is too much.',
          '[Low mood through a BC winter](/guides/low-mood-through-a-bc-winter) covers the mechanism and what actually helps; the latitude argument applies to Edmonton more strongly than to anywhere it was written for.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਐਡਮਿੰਟਨ ਵਿੱਚ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਕਾਊਂਸਲਰ ਬਹੁਤ ਘੱਟ ਹਨ, ਅਤੇ ਜੋ ਹਨ ਉਨ੍ਹਾਂ ਕੋਲ ਅਕਸਰ ਉਡੀਕ-ਸੂਚੀ ਹੁੰਦੀ ਹੈ।',
        'ਇੱਥੇ ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ, ਵੀਡੀਓ ਰਾਹੀਂ, ਤੁਹਾਡੇ ਆਪਣੇ ਘਰ ਤੋਂ। ਸਰਦੀਆਂ ਵਿੱਚ ਸ਼ਹਿਰ ਦੇ ਦੂਜੇ ਪਾਸੇ ਜਾਣ ਦੀ ਲੋੜ ਨਹੀਂ।',
        'ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ ਹੈ ਅਤੇ ਮੁਫ਼ਤ ਹੈ।',
      ],
    },
    faqs: [
      {
        q: 'Why not just see someone in Edmonton?',
        a: 'If you can, do. The difficulty is that Punjabi-speaking counsellors in Edmonton are few and generally carry waitlists, and several directory listings offer "Punjabi available" at a clinic without a named clinician who speaks it. It is worth asking that question directly. Where the answer does not come, virtual counselling from outside the province is often the only route to the language.',
      },
      {
        q: 'Does the time difference make booking difficult?',
        a: 'Alberta is one hour ahead of BC. Appointment times are shown in Mountain Time for Alberta clients, so the time you see is the time in your own kitchen. Evening sessions are the ones that go first.',
      },
      {
        q: 'Is the counsellor registered in Alberta?',
        a: 'No, and no counsellor is, counselling therapy is not currently a regulated profession in Alberta and there is no Alberta college that registers counsellors. Sessions are provided by a Registered Clinical Counsellor registered with the BC Association of Clinical Counsellors, and that registration is public and checkable.',
      },
      {
        q: 'Can sessions pause over the winter or a trip to India?',
        a: 'Yes. Booking block by block with gaps is a normal pattern rather than a lack of commitment, and an extended trip does not end anything. Sessions cannot be held while you are outside Canada, which is a regulatory matter rather than a preference, say so in advance and the gap is simply planned around.',
      },
    ],
    related: [
      { href: '/alberta', label: 'Online counselling across Alberta' },
      { href: '/alberta/punjabi-counselling', label: 'Punjabi counselling across Alberta' },
      { href: '/alberta/edmonton/south-asian-therapist', label: 'South Asian counselling in Edmonton' },
      { href: '/guides/low-mood-through-a-bc-winter', label: 'Low mood through a northern winter' },
      { href: '/alberta/counselling-coverage-alberta', label: 'What Alberta plans cover' },
    ],
  },

  {
    path: 'is-my-therapist-registered',
    province: 'AB',
    title: 'How to check a counsellor in Alberta',
    metaTitle: 'Is My Therapist Registered? Alberta | Westpeak',
    metaDescription:
      'Counselling is not regulated in Alberta, so anyone may use the title. What to check instead, and how to verify a counsellor’s registration in minutes.',
    eyebrow: 'Alberta · Checking credentials',
    lede:
      'In a province with no college, the checking falls to you. It takes about four minutes and it is worth doing before the first session rather than after the fifth.',
    directAnswer:
      'Counselling therapy is not currently a regulated profession in Alberta, so there is no Alberta college and anyone may lawfully call themselves a counsellor or therapist. Until that changes, the meaningful check is a counsellor’s registration with a regulator in another province, which is public and verifiable online.',
    updated: U,
    figure: 'designations-bc',
    sections: [
      {
        h2: 'What is actually true right now',
        body: [
          'In Alberta, "counsellor" and "therapist" are not protected titles. A person with a weekend certificate and a person with a master\'s degree and a thousand supervised hours may describe themselves identically, and neither is breaking any rule by doing so.',
          'In March 2024 the province announced that counselling therapists will be regulated by the College of Alberta Psychologists. **No proclamation date has been set.** As of August 2026 the college is awaiting provincial funding to develop standards, and a government advisory committee is due to report through late 2026, after which the legislative steps would still have to follow. The original 2025 target has already passed.',
          'None of that is a criticism of Alberta counsellors, a great many of whom are highly qualified and hold voluntary memberships that impose real standards. It simply means the safety net most people assume exists does not yet exist, and the checking falls to the person booking.',
        ],
      },
      {
        h2: 'The four-minute check',
        list: [
          { label: 'Ask which regulator, in which province', detail: 'Not "are you registered", which invites a yes, but "with which regulatory college, and what is your registration number". A regulated professional answers this immediately and without friction.' },
          { label: 'Look the number up yourself', detail: 'Every provincial regulator publishes a public register. Do not accept a screenshot or a logo on a website; go to the regulator\'s own site and search the name.' },
          { label: 'Check that the title matches the register', detail: 'A voluntary association membership is not the same as regulatory registration. Both can be legitimate; only one carries a complaints process with teeth.' },
          { label: 'Ask what happens if something goes wrong', detail: 'A regulated counsellor can tell you exactly who to complain to and that the process does not require their cooperation. If the answer is vague, that is the answer.' },
        ],
      },
      {
        h2: 'What this practice is, stated plainly',
        body: [
          'Sessions are provided by a **Registered Clinical Counsellor (RCC)** registered with the **BC Association of Clinical Counsellors**. That is a British Columbia registration. It is not an Alberta registration, because no such thing currently exists.',
          'The register is public. You can search it at bc-counsellors.org without contacting anyone here, and you should, [how to verify a counsellor in BC](/resources/verify-a-counsellor-in-bc) walks through it step by step, and applies equally whether or not you end up booking here.',
          'What that registration carries: a master\'s-level educational requirement, supervised clinical hours, a code of ethics, mandatory continuing education, and a complaints process that a client can start without the counsellor\'s agreement. Those obligations do not weaken because a client is sitting in Calgary rather than Kelowna.',
        ],
      },
      {
        h2: 'Two words you should not see',
        body: [
          '**"Psychologist"** is a protected title in Alberta. Only someone registered with the College of Alberta Psychologists may use it, or the word "psychological", to describe their services. A counsellor using either is misrepresenting themselves and it is worth treating as disqualifying.',
          '**"Psychotherapist"** is protected in some provinces and not others. In Ontario it is restricted to CRPO registrants; in Alberta it is not currently restricted. Someone using it in Alberta is not necessarily doing anything improper, but it is a reasonable prompt to ask the registration question.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is it legal to see a counsellor registered in another province?',
        a: 'In Alberta, yes. Because counselling therapy is not currently regulated there, there is no Alberta registration to hold and no restriction on who may provide counselling to someone located in the province. This is not true everywhere: Ontario, for instance, treats psychotherapy as a controlled act, which is why the answer is province-specific rather than general.',
      },
      {
        q: 'What is the difference between ACTA and a college?',
        a: 'The Association of Counselling Therapy of Alberta is a professional association, not a regulatory college, and its members are not regulated members under the Health Professions Act. Associations can set standards and require training; what they cannot do is hold a statutory registry or discipline a member out of practice. That difference is the whole point of regulation.',
      },
      {
        q: 'Will this change?',
        a: 'It is intended to. Counselling therapists are slated to come under the College of Alberta Psychologists, but with no proclamation date, funding still pending and an advisory committee reporting through late 2026, a realistic date is 2027 or later. This page will be updated when there is something concrete to update it with rather than another announcement.',
      },
    ],
    related: [
      { href: '/resources/verify-a-counsellor-in-bc', label: 'How to verify a counsellor, step by step' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC, psychologist or social worker?' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/alberta', label: 'Online counselling across Alberta' },
    ],
    sources: [
      { label: 'CCPA, regulation in Alberta', url: 'https://www.ccpa-accp.ca/regulation-in-alberta/' },
      { label: 'Association of Counselling Therapy of Alberta', url: 'https://www.acta-alberta.ca/' },
      { label: 'BCACC, public register', url: 'https://bc-counsellors.org/counsellors/' },
    ],
  },
];

/* Composed here so every consumer imports one list per province and cannot
 * accidentally miss a file. Ontario is exported separately and is gated at the
 * route and the sitemap, never by whether somebody remembered to filter it. */
export const albertaPages: RegionPage[] = [...albertaCore, ...albertaMore];
export { ontarioPages };

export const pagesFor = (province: 'AB' | 'ON'): RegionPage[] =>
  province === 'AB' ? albertaPages : ontarioPages;

export const getRegionPage = (province: 'AB' | 'ON', path: string) =>
  pagesFor(province).find((p) => p.path === path);

import type { RegionPage } from './expansion';

/* Remaining Alberta pages, and the whole Ontario cluster.
 *
 * Ontario is written to the same standard as Alberta and does not publish. See
 * lib/regions.ts for why, and ONTARIO_LAUNCH_CHECKLIST.md for what unlocks it.
 */

const U = '2026-08-17';

export const albertaMore: RegionPage[] = [
  {
    path: 'counselling-coverage-alberta',
    province: 'AB',
    title: 'What Alberta plans cover for counselling',
    metaTitle: 'Counselling Coverage in Alberta | Westpeak',
    metaDescription:
      'AHCIP does not cover counselling. What Alberta extended health plans typically reimburse for an RCC, and the questions to ask before booking.',
    eyebrow: 'Alberta · Cost and coverage',
    lede: 'The public plan does not pay for this. A great many workplace plans do, and most people never check properly.',
    directAnswer:
      'The Alberta Health Care Insurance Plan does not cover counselling from a Registered Clinical Counsellor. Coverage, where it exists, comes from a workplace or private extended health plan, and whether an RCC specifically is reimbursed varies by plan — the detail most people discover after a first session rather than before it.',
    updated: U,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'Start here: AHCIP does not cover it',
        body: [
          'Alberta’s public plan covers physician services and care delivered inside the public system. Counselling from a Registered Clinical Counsellor in private practice is not covered, and no amount of it being obviously health care changes that.',
          'What that leaves is three routes: a workplace extended health plan, an employee assistance programme, or paying directly. Most people have access to at least one of the first two and do not know which.',
        ],
      },
      {
        h2: 'The five questions worth asking your insurer',
        list: [
          { label: 'Does the plan reimburse a Registered Clinical Counsellor (RCC)?', detail: 'The one that catches most people. Plans list professions, not services — a plan can cover “Psychologist” and “Registered Social Worker” and not RCCs, and then no amount of it being obviously counselling makes it claimable. Ask about RCC by name.' },
          { label: 'What is the annual maximum, and when does it reset?', detail: 'Usually a dollar cap per calendar year, resetting 1 January rather than on your hire date.' },
          { label: 'Is there a per-session limit as well?', detail: 'A plan can reimburse $80 a session with annual room left over, which still leaves $60 out of pocket on a $140 session.' },
          { label: 'Is the limit shared with psychology or social work?', detail: 'A combined pool means seeing two practitioners halves your effective coverage.' },
          { label: 'Do I have a health spending account?', detail: 'The most commonly missed source of coverage. An HSA usually covers counselling even where the core plan does not list RCCs.' },
        ],
      },
      {
        h2: 'What a receipt has to show',
        body: [
          'Practitioner name, designation, registration number, practice details, date, amount and service. **A missing registration number is the single most common reason a claim bounces.** Receipts here carry all of it.',
          'This practice does not direct-bill, so you pay the practice directly and claim it back yourself. That is ordinary for RCCs across Canada rather than a limitation of working with someone out of province.',
        ],
      },
      {
        h2: 'Routes where somebody else pays',
        list: [
          { label: 'Employee assistance programmes', detail: 'Most mid-size and large Alberta employers carry one, covering a set number of sessions at no cost and usually without the employer being told who used it. Worth checking before assuming there is no coverage.' },
          { label: 'After a collision', detail: 'Alberta’s auto insurance framework includes accident benefits that can cover psychological treatment after a collision. The rules differ substantially from BC’s ICBC scheme, so ask your own insurer rather than assuming either applies.' },
          { label: 'Post-secondary students', detail: 'Alberta universities and colleges run counselling services at no cost to enrolled students, and student health plans frequently reimburse outside counselling on top of that.' },
        ],
      },
    ],
    faqs: [
      { q: 'Does AHCIP cover any counselling at all?', a: 'It covers care delivered inside the public system — Alberta Health Services programmes, and counselling provided by a physician. It does not cover a private-practice Registered Clinical Counsellor. Public options exist and carry waitlists; the Alberta Mental Health Help Line on 1-877-303-2642 can tell you what is available in your area.' },
      { q: 'Will my plan reimburse a counsellor registered in another province?', a: 'Usually, and it is worth asking explicitly. Most plans define eligibility by the practitioner’s registration rather than by where they sit, so an RCC registered in BC is typically claimable by an Alberta plan member. Some plans word it differently. Ask before booking rather than after.' },
      { q: 'What does a session cost?', a: '$140 for a 50-minute individual session, $170 for couples, and $190 for a 90-minute EMDR intensive. The first 15-minute consultation is free.' },
    ],
    related: [
      { href: '/alberta', label: 'Online counselling across Alberta' },
      { href: '/pricing', label: 'Fees and coverage' },
      { href: '/tools/therapy-cost-bc', label: 'Work out what it costs after coverage' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'How reimbursement works' },
    ],
  },

  {
    path: 'punjabi-counselling',
    province: 'AB',
    title: 'Punjabi counselling across Alberta',
    metaTitle: 'Punjabi Counselling in Alberta | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English anywhere in Alberta by secure video — Calgary, Edmonton, Red Deer, Lethbridge and the smaller centres.',
    eyebrow: 'Alberta · ਪੰਜਾਬੀ',
    lede: 'Two cities have some provision. The rest of the province has almost none, and that is where video stops being a convenience.',
    directAnswer:
      'Counselling in Punjabi or English is available anywhere in Alberta by secure video. Punjabi-speaking counsellors in the province are concentrated in Calgary and Edmonton and carry waitlists; outside those two cities there is very little provision, and that is the gap this covers.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'The distribution problem',
        body: [
          'Alberta’s Punjabi-speaking population is large and is not confined to the two big cities. There are established communities around Red Deer, Lethbridge, Brooks and Fort McMurray, tied to agriculture, meat processing and the energy sector.',
          'Punjabi-speaking counsellors, by contrast, are almost entirely in Calgary and Edmonton. For somebody in Brooks or Grande Prairie the nearest may be a four-hour drive, and that is before asking whether they have availability at all.',
          'This is the situation video was actually built for — not a more convenient version of an appointment that was otherwise available, but the only version that exists.',
        ],
      },
      {
        h2: 'What stays the same wherever you are',
        body: [
          'Sessions run in Punjabi, English, or moving between them within a session. Appointment times are shown in Mountain Time. The first 15 minutes are free and carry no obligation, including no obligation to continue if it is not a fit.',
          'And the practice is not in Alberta, which for a great many people is the point rather than the drawback. No shared gurdwara, no mutual acquaintances, no chance of being recognised in a waiting room.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਅਲਬਰਟਾ ਵਿੱਚ ਕਿਤੇ ਵੀ ਰਹਿੰਦੇ ਹੋਵੋ — ਕੈਲਗਰੀ, ਐਡਮਿੰਟਨ, ਰੈੱਡ ਡੀਅਰ, ਲੈਥਬ੍ਰਿਜ ਜਾਂ ਕੋਈ ਛੋਟਾ ਸ਼ਹਿਰ — ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।',
        'ਸਭ ਕੁਝ ਵੀਡੀਓ ਰਾਹੀਂ। ਕਿਸੇ ਸ਼ਹਿਰ ਜਾਣ ਦੀ ਲੋੜ ਨਹੀਂ, ਅਤੇ ਸਮਾਂ ਮਾਊਂਟੇਨ ਟਾਈਮ ਵਿੱਚ ਦਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।',
        'ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ, ਮੁਫ਼ਤ। ਕੋਈ ਜ਼ਿੰਮੇਵਾਰੀ ਨਹੀਂ।',
      ],
    },
    faqs: [
      { q: 'I am in a small town. Does that change anything?', a: 'Only in your favour, in that video removes the distance entirely. What it does not remove is connectivity — where bandwidth is unreliable, sessions can run with the camera off, which cuts what the connection has to carry considerably and is a normal way to work rather than a compromise.' },
      { q: 'Is the counsellor registered in Alberta?', a: 'No, and no counsellor is — counselling therapy is not currently regulated in Alberta and no Alberta college registers counsellors. Sessions are provided by a Registered Clinical Counsellor registered with the BC Association of Clinical Counsellors, and that registration is public and checkable.' },
    ],
    related: [
      { href: '/alberta/calgary/punjabi-speaking-counselling', label: 'Punjabi counselling in Calgary' },
      { href: '/alberta/edmonton/punjabi-speaking-counselling', label: 'Punjabi counselling in Edmonton' },
      { href: '/alberta/red-deer-lethbridge-and-beyond', label: 'The rest of Alberta' },
      { href: '/punjabi', label: 'ਪੰਜਾਬੀ ਵਿੱਚ ਪੂਰੀ ਜਾਣਕਾਰੀ' },
    ],
  },

  {
    path: 'red-deer-lethbridge-and-beyond',
    province: 'AB',
    title: 'Counselling outside Calgary and Edmonton',
    metaTitle: 'Online Counselling in Rural Alberta | Westpeak',
    metaDescription:
      'Red Deer, Lethbridge, Grande Prairie, Fort McMurray and the smaller centres — online counselling where local provision is thinnest.',
    eyebrow: 'Alberta · Everywhere else',
    lede: 'Two thirds of the province is not Calgary or Edmonton, and the counselling map does not reflect that.',
    directAnswer:
      'Online counselling is available anywhere in Alberta, including Red Deer, Lethbridge, Medicine Hat, Grande Prairie and Fort McMurray. Outside the two large cities provision thins sharply — particularly for anything specialised — and video is frequently the only route to a counsellor with the right training.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'What thin provision actually looks like',
        body: [
          'It is rarely a total absence. It is usually one or two counsellors serving a wide catchment, a waitlist measured in months, and no realistic choice about who you see or what approach they work in.',
          'For general counselling that may be workable. For anything specific — EMDR, couples work, counselling in a language other than English — the local answer is often that there is no local answer, and people conclude they cannot have it rather than that they cannot have it *nearby*.',
        ],
      },
      {
        h2: 'Rotation, shift work and the schedule problem',
        body: [
          'Fort McMurray and the northern centres run on rotation — two weeks on and two off, or fourteen and seven. Agricultural work around Lethbridge and Brooks runs on a season. Neither survives a weekly appointment at a fixed hour.',
          'Booking in blocks with planned gaps is normal here rather than a failure to commit, and it is worth setting up that way from the start instead of booking weekly, missing three and concluding counselling did not suit you. [Counselling for rotational and camp workers](/for/rotational-and-camp-workers) covers how that is structured.',
        ],
      },
      {
        h2: 'Connectivity, honestly',
        body: [
          'Rural Alberta bandwidth is variable, and that is a real constraint rather than one to wave away. Sessions can run audio-only with the camera off, which cuts what the connection has to carry substantially and works far better than a stuttering video call.',
          'If even that is unreliable, say so at the consultation. It is a reason to make a different plan, not something to discover mid-session in week three.',
        ],
      },
    ],
    faqs: [
      { q: 'Which towns does this cover?', a: 'Anywhere in Alberta. The page names Red Deer, Lethbridge, Medicine Hat, Grande Prairie and Fort McMurray because those are the centres people search from, but there is no geographic restriction within the province.' },
      { q: 'Is there anything free locally?', a: 'Usually something, and it is worth checking first. The Alberta Mental Health Help Line on 1-877-303-2642 is free, 24/7 and can tell you what exists in your area. That is a better first call than assuming there is nothing.' },
    ],
    related: [
      { href: '/alberta', label: 'Online counselling across Alberta' },
      { href: '/for/rotational-and-camp-workers', label: 'For rotational and camp workers' },
      { href: '/alberta/punjabi-counselling', label: 'Punjabi counselling across Alberta' },
      { href: '/alberta/counselling-coverage-alberta', label: 'What Alberta plans cover' },
    ],
  },
];

/* ==========================================================================
   ONTARIO — built, NOT published. See lib/regions.ts.
   ========================================================================== */

export const ontarioPages: RegionPage[] = [
  {
    path: 'brampton/punjabi-speaking-counselling',
    province: 'ON',
    citySlug: 'brampton',
    city: 'Brampton',
    title: 'Punjabi-speaking counselling in Brampton',
    metaTitle: 'Punjabi Counselling in Brampton | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English for people in Brampton, by secure video, from outside the community networks that make privacy hard.',
    eyebrow: 'Brampton · ਪੰਜਾਬੀ',
    lede:
      'Brampton has no shortage of Punjabi-speaking counsellors. What it is short of is distance from them.',
    directAnswer:
      'Counselling in Punjabi or English is available to people located in Brampton by secure video. Unlike most cities, the barrier in Brampton is not supply — it is privacy, in a community interconnected enough that the counsellor who comes recommended is often connected to the people you would least want to know.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'This page makes the opposite argument to the others',
        body: [
          'Everywhere else, the case for a counsellor outside your city is scarcity: there is nobody local who speaks Punjabi, so distance is what makes the language possible at all. In Brampton that argument is transparently false and it would be insulting to make it.',
          'Brampton has one of the largest Punjabi-speaking populations anywhere outside South Asia. There are Punjabi-speaking counsellors, clinics with Punjabi-speaking staff, and community organisations running mental-health programming in the language. Supply is genuinely good.',
          '**The barrier is that the community is small in the way that matters.** Not small in number — small in degrees of separation. The counsellor recommended by an aunt is connected to the aunt. The clinic on Airport Road is where somebody from the gurdwara works reception. The concern is rarely that a counsellor would breach confidentiality; it is that being seen walking in is itself the disclosure, and that the recommendation travelled through the same network the difficulty lives in.',
        ],
      },
      {
        h2: 'What people are actually protecting',
        body: [
          'It is usually not a secret in the dramatic sense. It is a marriage that is struggling and a family that does not know. A drinking problem in a household that presents as observant. A daughter who is not going to marry the person she is expected to. A son who has not told anyone he lost the job four months ago.',
          'In each case the thing being protected is not privacy in the abstract but a specific person\'s standing in a specific community — sometimes the client\'s own, more often a parent\'s. *Izzat* is not vanity here. It is the currency the whole family has been accumulating since arrival, and a great many people will accept an unaddressed problem rather than spend it.',
          'A counsellor three time zones away, with no Brampton practice, no connection to any GTA gurdwara and no mutual acquaintances, takes that calculation off the table. It is the one thing local provision structurally cannot offer.',
        ],
      },
      {
        h2: 'The generational split, which is sharper here',
        body: [
          'Brampton\'s density produces something you see less elsewhere: a second generation that grew up substantially inside the culture rather than negotiating between it and a mostly-white surrounding. Punjabi at home, Punjabi at school, Punjabi at work.',
          'That changes the conflict. It is less often "my parents do not understand the country I grew up in" and more often two people inside the same cultural frame disagreeing about what it requires — which is harder, not easier, because the shared frame removes the easy explanation that one side simply does not understand the other.',
          'Counselling that assumes the standard immigrant-generation-gap story will miss this entirely, and people notice within a session when it is being missed.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਬਰੈਂਪਟਨ ਵਿੱਚ ਪੰਜਾਬੀ ਬੋਲਣ ਵਾਲੇ ਕਾਊਂਸਲਰ ਘੱਟ ਨਹੀਂ ਹਨ। ਜੋ ਘੱਟ ਹੈ, ਉਹ ਹੈ ਫ਼ਾਸਲਾ।',
        'ਬਹੁਤ ਲੋਕ ਇਸ ਕਰਕੇ ਨਹੀਂ ਜਾਂਦੇ ਕਿ ਕੋਈ ਨਹੀਂ ਮਿਲਦਾ, ਸਗੋਂ ਇਸ ਕਰਕੇ ਕਿ ਜੋ ਮਿਲਦਾ ਹੈ ਉਹ ਕਿਸੇ ਨਾ ਕਿਸੇ ਜਾਣ-ਪਛਾਣ ਵਾਲੇ ਨਾਲ ਜੁੜਿਆ ਹੁੰਦਾ ਹੈ। ਗੱਲ ਭਰੋਸੇ ਦੀ ਨਹੀਂ — ਗੱਲ ਇਹ ਹੈ ਕਿ ਕਿਸੇ ਨੇ ਤੁਹਾਨੂੰ ਅੰਦਰ ਜਾਂਦੇ ਦੇਖ ਲਿਆ, ਤਾਂ ਗੱਲ ਹੋ ਗਈ।',
        'ਇੱਥੇ ਕੋਈ ਦਫ਼ਤਰ ਨਹੀਂ, ਕੋਈ ਉਡੀਕ-ਕਮਰਾ ਨਹੀਂ, ਅਤੇ ਬਰੈਂਪਟਨ ਦੇ ਕਿਸੇ ਭਾਈਚਾਰੇ ਜਾਂ ਗੁਰਦੁਆਰੇ ਨਾਲ ਕੋਈ ਸਾਂਝ ਨਹੀਂ।',
        'ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ, ਜਾਂ ਦੋਹਾਂ ਵਿੱਚ ਬਦਲਦੇ ਹੋਏ। ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ ਅਤੇ ਮੁਫ਼ਤ।',
      ],
    },
    faqs: [
      { q: 'Would a Brampton counsellor not understand the context better?', a: 'Often, yes — and where privacy is not the concern, seeing someone local is a perfectly good choice and worth doing. This page exists for the situation where the closeness that produces that understanding is exactly the thing making it impossible to go.' },
      { q: 'Will my family find out?', a: 'Not from here. There is no office, no waiting room, no shared community networks and nothing shared with family or employers. The limits on confidentiality are the standard clinical ones — risk of serious harm, and legal obligations — set out in full before a first session.' },
      { q: 'Can sessions be in both Punjabi and English?', a: 'Yes, including moving between them mid-sentence, which is how most people actually speak in Brampton. There is no requirement to pick one at the start.' },
    ],
    related: [
      { href: '/ontario', label: 'Online counselling across Ontario' },
      { href: '/ontario/brampton/south-asian-therapist', label: 'South Asian counselling in Brampton' },
      { href: '/ontario/punjabi-counselling', label: 'Punjabi counselling across Ontario' },
      { href: '/for/south-asian-intergenerational-conflict', label: 'When both generations are reasonable' },
    ],
  },

  {
    path: 'brampton/south-asian-therapist',
    province: 'ON',
    citySlug: 'brampton',
    city: 'Brampton',
    title: 'South Asian counselling in Brampton',
    metaTitle: 'South Asian Therapist, Brampton | Westpeak',
    metaDescription:
      'Culturally fluent counselling for South Asian adults and families in Brampton, by secure video — family expectation, marriage pressure and identity.',
    eyebrow: 'Brampton · South Asian',
    lede:
      'Not a counsellor who has read about the culture. One who does not need the background explained before the problem can be described.',
    directAnswer:
      'Counselling for South Asian adults and couples located in Brampton, by secure video, in Punjabi or English. The difference culturally fluent counselling makes is practical rather than sentimental: you do not spend the first three sessions explaining context before the actual difficulty can be reached.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'The explaining tax',
        body: [
          'People who have tried counselling with a culturally unfamiliar therapist describe the same thing: a large share of the hour spent on background. Why a mother-in-law living in the house is not unusual. Why moving out at nineteen was never on the table. Why a marriage is a negotiation between two families rather than two people. Why not attending a wedding has consequences that last years.',
          'None of that is the therapist\'s fault, and a good one will learn quickly. But you are paying by the hour, and the hours spent on orientation are hours not spent on the thing you came for. A frequent outcome is that people stop at session four, having described the situation thoroughly and worked on none of it.',
          'The other, quieter cost is the drift toward advice that does not fit. "Set a boundary" and "you are an adult, you can decide" are reasonable in a frame where the cost of doing so is manageable. Where the cost is a parent who will not speak to you for two years and a wider family that takes a side, the same advice is not wrong exactly — it is just given without the price attached.',
        ],
      },
      {
        h2: 'What comes up in Brampton specifically',
        list: [
          { label: 'Marriage and the search', detail: 'The pressure that arrives at a particular age, the difference between arranged and forced that families do not always observe carefully, and the specific loneliness of being the one who has not.' },
          { label: 'Three-generation households', detail: 'Common here in a way it is not elsewhere in Canada. Privacy, autonomy and caregiving are negotiated inside a single dwelling, and a counselling plan that assumes a private room to take a call in will fail on contact.' },
          { label: 'Sons, money and provision', detail: 'Financial obligation flowing upward and outward, often unspoken and unbounded, and the shame attached to falling short of it — including when the falling short is a layoff nobody chose.' },
          { label: 'Daughters and the double standard', detail: 'Freedom that arrives with conditions siblings do not have, and the exhausting work of appearing to comply while not.' },
          { label: 'Faith, and where it helps', detail: 'For many people Sikhi is a genuine source of steadiness rather than an obstacle. Counselling here does not treat it as something to be worked around.' },
        ],
      },
      {
        h2: 'What this is not',
        body: [
          'It is not a promise to agree with you about your family, and it is not a service for persuading a relative that they are wrong. Both parties in a family conflict are usually acting from something coherent, and the useful work is generally in what happens next rather than in establishing who was right.',
          'It is also not religious counselling or community mediation. Where what you actually want is a Sikh chaplain, a granthi, or an elder who can speak to your parents directly, that is a legitimate thing to want and worth saying — it is not what this is.',
        ],
      },
    ],
    faqs: [
      { q: 'Do I have to be Punjabi or Sikh?', a: 'No. The pages lean Punjabi because that is where the language and the depth are, but the work covers South Asian families broadly — Hindu, Muslim, Christian and secular households included. What is shared is the structure of obligation, not a particular faith.' },
      { q: 'Can my parents join a session?', a: 'Sometimes, and it is worth discussing rather than assuming. A family session can be genuinely useful and it can also make things worse if the groundwork has not been done. That is a judgement to make together rather than in advance.' },
      { q: 'Will I be told to cut my family off?', a: 'No. That advice gets given far too readily to South Asian clients by people who have not counted what it costs. Distance is sometimes right and sometimes the only option, but it is an outcome to arrive at carefully rather than a default recommendation.' },
    ],
    related: [
      { href: '/ontario/brampton/punjabi-speaking-counselling', label: 'Punjabi counselling in Brampton' },
      { href: '/for/first-gen-south-asian-adults', label: 'For first-generation South Asian adults' },
      { href: '/for/south-asian-intergenerational-conflict', label: 'Intergenerational conflict' },
      { href: '/services/punjabi-counselling', label: 'South Asian mental health' },
    ],
  },

  {
    path: 'toronto/punjabi-speaking-counselling',
    province: 'ON',
    citySlug: 'toronto',
    city: 'Toronto',
    title: 'Punjabi-speaking counselling in Toronto',
    metaTitle: 'Punjabi Counselling in Toronto | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English for people in Toronto, by secure video, with evening times that survive a real commute.',
    eyebrow: 'Toronto · ਪੰਜਾਬੀ',
    lede: 'A crowded market, and a set of practical problems that decide whether counselling actually happens.',
    directAnswer:
      'Counselling in Punjabi or English is available to people located in Toronto by secure video. In a city with real provision, the deciding factors are usually practical rather than clinical: the commute, the cost, and whether there is anywhere private to take a call.',
    updated: U,
    sections: [
      {
        h2: 'The commute is a clinical problem, not a logistical one',
        body: [
          'A 6pm appointment downtown means leaving work at 5, and getting home at 8. Done weekly, that is a three-hour commitment for a fifty-minute session, and it is the reason a great many courses of counselling end around week five — not lost motivation, arithmetic.',
          'Sessions from home remove the travel entirely, which changes what is sustainable. It also changes who can attend at all: shift workers, people with caregiving at both ends of the day, and anybody whose employer would notice a standing two-hour absence.',
        ],
      },
      {
        h2: 'Where to take the call, honestly',
        body: [
          'Toronto housing being what it is, a private room is not a given. People take sessions in parked cars, on lunch breaks in an empty meeting room, in a bedroom with headphones while the household carries on outside the door.',
          'All of those work. Headphones make more difference than anything else, the camera can be off, and a session in a car is not a lesser session. It is worth saying at the consultation where you are likely to be, so the work is planned around it rather than interrupted by it.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਟੋਰਾਂਟੋ ਵਿੱਚ ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ, ਵੀਡੀਓ ਰਾਹੀਂ।',
        'ਕਿਤੇ ਜਾਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਕੰਮ ਤੋਂ ਬਾਅਦ ਦੋ ਘੰਟੇ ਸਫ਼ਰ ਵਿੱਚ ਨਹੀਂ ਲੱਗਣਗੇ।',
        'ਪਹਿਲੀ ਗੱਲਬਾਤ 15 ਮਿੰਟ ਦੀ, ਮੁਫ਼ਤ।',
      ],
    },
    faqs: [
      { q: 'Is OHIP going to cover this?', a: 'No. OHIP does not cover private psychotherapy or counselling from a Registered Clinical Counsellor. Coverage, where it exists, comes from a workplace extended health plan or an employee assistance programme.' },
      { q: 'What about the time difference?', a: 'Ontario is three hours ahead of BC. Appointment times are shown in Eastern Time, so the time you see is the time on your own clock. In practice this widens rather than narrows the evening options.' },
    ],
    related: [
      { href: '/ontario', label: 'Online counselling across Ontario' },
      { href: '/ontario/brampton/punjabi-speaking-counselling', label: 'Punjabi counselling in Brampton' },
      { href: '/ontario/punjabi-counselling', label: 'Punjabi counselling across Ontario' },
    ],
  },

  {
    path: 'oshawa/online-counselling',
    province: 'ON',
    citySlug: 'oshawa',
    city: 'Oshawa',
    title: 'Online counselling in Oshawa and Durham Region',
    metaTitle: 'Online Counselling in Oshawa | Westpeak',
    metaDescription:
      'Counselling by secure video for people in Oshawa, Whitby, Ajax and Durham Region — including schedules built around shift work.',
    eyebrow: 'Oshawa · Durham Region',
    lede: 'A commuter belt with a manufacturing spine, and a counselling map built for neither.',
    directAnswer:
      'Counselling by secure video is available to people located in Oshawa and across Durham Region. Two things shape it here more than elsewhere in the GTA: rotating shift work, which a fixed weekly appointment does not survive, and a long commute that makes travelling to a session unrealistic on a weekday.',
    updated: U,
    sections: [
      {
        h2: 'Shift work breaks the standard model',
        body: [
          'Durham\'s manufacturing and healthcare employment runs on rotating shifts. A counselling model that assumes Tuesday at six every week is not slightly inconvenient for a rotating worker — it is unusable, and the failure is usually blamed on the client.',
          'Booking block by block, at different times, with planned gaps, works. So does accepting that some weeks there will be no session and that this is not a relapse. [Counselling for healthcare and shift workers](/for/healthcare-and-shift-workers) covers the pattern and what makes it sustainable.',
        ],
      },
      {
        h2: 'The commuter squeeze',
        body: [
          'A significant share of Durham works in Toronto. That is a two-hour round trip on a good day, which leaves an evening appointment competing with the only hours a person has at home.',
          'It also produces a specific kind of exhaustion that gets mistaken for depression and sometimes is, and sometimes is a schedule that no one could sustain. Telling those apart is worth doing before concluding anything about yourself. [Burnout or depression?](/guides/burnout-vs-depression) sets out the distinction.',
        ],
      },
    ],
    faqs: [
      { q: 'Does this cover Whitby, Ajax and Pickering?', a: 'Yes — anywhere in Ontario. Durham Region is named because that is what people search, but there is no geographic restriction within the province.' },
      { q: 'Can appointment times move week to week?', a: 'Yes, and for shift workers that is the normal arrangement rather than an exception. Booking in blocks around a known rotation works considerably better than a standing weekly slot that will be missed.' },
    ],
    related: [
      { href: '/ontario', label: 'Online counselling across Ontario' },
      { href: '/for/healthcare-and-shift-workers', label: 'For healthcare and shift workers' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout or depression?' },
    ],
  },

  {
    path: 'counselling-coverage-ontario',
    province: 'ON',
    title: 'What Ontario plans cover for counselling',
    metaTitle: 'Counselling Coverage in Ontario | Westpeak',
    metaDescription:
      'OHIP does not cover private psychotherapy. What Ontario extended health plans typically reimburse, and what to ask before booking.',
    eyebrow: 'Ontario · Cost and coverage',
    lede: 'The public plan does not pay for this, and the exceptions are narrower than people expect.',
    directAnswer:
      'OHIP does not cover private psychotherapy or counselling in private practice. It covers psychotherapy delivered by a physician, and some hospital and community programmes. Everything else comes from a workplace extended health plan, an employee assistance programme, or out of pocket.',
    updated: U,
    figure: 'reimbursement-flow',
    sections: [
      {
        h2: 'What OHIP does and does not do',
        body: [
          'OHIP covers psychotherapy when it is delivered by a physician — a family doctor or psychiatrist — and it covers programmes inside hospitals and some community agencies. Waits for the latter are frequently long.',
          'It does not cover a private-practice counsellor or psychotherapist. This surprises people more in Ontario than elsewhere, because the profession is regulated here and regulation is easily mistaken for coverage. They are unrelated.',
        ],
      },
      {
        h2: 'What to ask your insurer',
        list: [
          { label: 'Which designations does the plan reimburse?', detail: 'Ontario plans commonly list Registered Psychotherapist, Psychologist and Social Worker. Ask specifically which, and ask whether a counsellor registered in another province qualifies.' },
          { label: 'Annual maximum, and reset date', detail: 'Usually a calendar-year dollar cap rather than a session count.' },
          { label: 'Is the mental-health limit shared?', detail: 'A pool shared across psychology, social work and psychotherapy halves quickly if you see more than one practitioner.' },
          { label: 'Health spending account?', detail: 'Frequently covers counselling even where the core plan is restrictive.' },
        ],
      },
    ],
    faqs: [
      { q: 'Is counselling tax-deductible in Ontario?', a: 'Fees paid to certain regulated practitioners can qualify as medical expenses federally, and the eligible list depends on the practitioner’s designation and province. This is a question for an accountant rather than a counsellor — the answer turns on details of your own return.' },
      { q: 'What about an EAP?', a: 'Most large Ontario employers carry one, covering a set number of sessions at no cost. It is worth checking before paying privately; the trade-off is usually a shorter course and less choice of counsellor.' },
    ],
    related: [
      { href: '/ontario', label: 'Online counselling across Ontario' },
      { href: '/pricing', label: 'Fees and coverage' },
      { href: '/tools/therapy-cost-bc', label: 'Cost and coverage estimator' },
    ],
  },

  {
    path: 'punjabi-counselling',
    province: 'ON',
    title: 'Punjabi counselling across Ontario',
    metaTitle: 'Punjabi Counselling in Ontario | Westpeak',
    metaDescription:
      'Counselling in Punjabi or English anywhere in Ontario by secure video — Brampton, Toronto, Mississauga, Oshawa and beyond.',
    eyebrow: 'Ontario · ਪੰਜਾਬੀ',
    lede: 'Concentrated provision in the west GTA, and very little of it anywhere else in the province.',
    directAnswer:
      'Counselling in Punjabi or English is available anywhere in Ontario by secure video. Punjabi-speaking counsellors in the province are heavily concentrated in Brampton and the west GTA; outside that corridor provision drops off sharply, which is where video matters most.',
    updated: U,
    figure: 'bc-reach',
    sections: [
      {
        h2: 'Two different problems, one province',
        body: [
          'In Brampton and Mississauga the problem is not finding a Punjabi-speaking counsellor. It is finding one who is not connected to somebody you know — the privacy problem, covered in full on the Brampton page.',
          'In Ottawa, London, Windsor, Kitchener or Thunder Bay the problem is the ordinary one: there may be nobody. A Punjabi-speaking family in eastern or northern Ontario is in much the same position as one in rural Alberta, and video is the only route to the language.',
        ],
      },
    ],
    punjabi: {
      heading: 'ਪੰਜਾਬੀ ਵਿੱਚ',
      body: [
        'ਓਨਟਾਰੀਓ ਵਿੱਚ ਕਿਤੇ ਵੀ — ਬਰੈਂਪਟਨ, ਟੋਰਾਂਟੋ, ਮਿਸੀਸਾਗਾ, ਓਸ਼ਾਵਾ ਜਾਂ ਇਸ ਤੋਂ ਦੂਰ — ਸੈਸ਼ਨ ਪੰਜਾਬੀ ਵਿੱਚ ਹੋ ਸਕਦੇ ਹਨ।',
        'ਸਭ ਕੁਝ ਵੀਡੀਓ ਰਾਹੀਂ, ਤੁਹਾਡੇ ਆਪਣੇ ਘਰ ਤੋਂ। ਸਮਾਂ ਈਸਟਰਨ ਟਾਈਮ ਵਿੱਚ ਦਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।',
      ],
    },
    faqs: [
      { q: 'Which cities does this cover?', a: 'Anywhere in Ontario. The pages name Brampton, Toronto and Oshawa because those are the largest search markets, but there is no restriction within the province.' },
    ],
    related: [
      { href: '/ontario/brampton/punjabi-speaking-counselling', label: 'Punjabi counselling in Brampton' },
      { href: '/ontario/toronto/punjabi-speaking-counselling', label: 'Punjabi counselling in Toronto' },
      { href: '/ontario', label: 'Online counselling across Ontario' },
    ],
  },
];

import { cityContexts, type CityContext } from '@/lib/city-context';

/* FIFTY CITY × SERVICE PAGES, AND THE RULE THAT KEEPS THEM HONEST.
 *
 * THE RISK BEING MANAGED
 *
 * Content uniqueness is this site's single strongest measured category — 900 of
 * 1000, first of eleven practices — and it holds that position precisely because
 * two competitors in the benchmark set templated four hundred pages each and it
 * is obvious from the first paragraph. Fifty "<service> in <city>" pages built
 * by swapping a noun would attack the one thing this domain is measurably best
 * at, and would read to a search engine as a doorway pattern.
 *
 * So the rule for this file is: EVERY PAIR EARNS ITS OWN ARGUMENT. Not a
 * rewritten sentence — a claim that is true of this service in this city and
 * false, or simply pointless, anywhere else. EMDR in Prince George is a
 * different argument from EMDR in Vancouver, because in one of those places the
 * nearest trained clinician may be a flight away and in the other the problem is
 * that they are all full.
 *
 * If a pair cannot be given its own argument, it does not get a page. That is
 * the same test lib/locations.ts applies to cities, applied one level down.
 *
 * scripts/uniqueness-gate.mjs enforces this mechanically and fails the build if
 * any two of these pages converge. A rule nothing checks is a rule that decays
 * on the first busy afternoon.
 *
 * BCACC. Descriptive throughout, never predictive. No page here says counselling
 * will work, how well, or how fast. Advertising standards prohibit outcome
 * claims, and on this subject they are also simply the right standard.
 */

/** The five services paired with cities — chosen from Search Console demand,
 *  not from the full service list. The other four services have real pages of
 *  their own; pairing all nine with all ten cities would be ninety pages and
 *  would fail the rule above by the fourth row. */
export const PAIRED_SERVICES = [
  'anxiety-counselling',
  'trauma-therapy',
  'couples-therapy',
  'emdr-therapy',
  'depression-counselling',
] as const;

export type PairedService = (typeof PAIRED_SERVICES)[number];

export type Pair = {
  city: string;
  service: PairedService;
  /** The thesis. One sentence, true here and nowhere else in this file. */
  angle: string;
  /** Two paragraphs specific to this pair. Never assembled from a template. */
  body: [string, string];
  faqs: { q: string; a: string }[];
};

export const pairs: Pair[] = [
  /* ---------------- VANCOUVER — abundance, but none of it free ------------- */
  {
    city: 'vancouver', service: 'anxiety-counselling',
    angle: 'In a city with no shortage of counsellors, anxiety is the presentation most likely to put you on a waitlist.',
    body: [
      'Anxiety is the most common reason people in Vancouver look for a counsellor, which has an awkward consequence: it is also the presentation practices fill up on first. Searching produces hundreds of results and a run of replies explaining that the practice is not currently taking new clients, which is a particularly unhelpful experience for someone whose difficulty is partly about uncertainty and waiting.',
      'The practical constraint here is scheduling rather than availability in the abstract. Anxiety work depends on continuity — a session most weeks, at a time that survives contact with a working life. An appointment that requires leaving the office early, crossing the bridge and finding parking is one that gets rescheduled twice and then quietly dropped, and the drop tends to happen at precisely the point the work was starting to bite.',
    ],
    faqs: [
      { q: 'Is online counselling as useful for anxiety as sitting in a room?', a: 'For anxiety specifically, a good deal of the work involves what happens between sessions — noticing patterns, testing something, reporting back. That is unaffected by whether the conversation happened over video. What does affect it is whether the sessions actually keep happening, which is where the commute matters.' },
      { q: 'I work downtown. Can sessions fit around office hours?', a: 'There are evening slots on Tuesday, Wednesday, Thursday and Friday, and Tuesday runs to 6pm. Booking is a free 15-minute video call first, so you can find out whether the available times genuinely work before committing to anything.' },
    ],
  },
  {
    city: 'vancouver', service: 'trauma-therapy',
    angle: 'Trauma work asks you to be somewhere you feel safe afterwards — and in Vancouver that is rarely the place you have just commuted to.',
    body: [
      'The thing rarely mentioned about in-person trauma therapy is the hour after it. A session that has gone somewhere difficult does not end cleanly at fifty minutes, and in Vancouver the next thing is usually a SkyTrain platform, a bridge, or a walk back to an office. People manage it, and a good number of them also start unconsciously steering sessions away from anything that might make the journey home hard.',
      'Working from home removes that calculation. There is no performance of composure required at the end, no interval of being in public while still somewhere else. For trauma-focused work in particular that is not a convenience — it changes what a person is willing to bring into the room, because the cost of bringing it has gone down.',
    ],
    faqs: [
      { q: 'Is it safe to do trauma work without someone physically present?', a: 'It requires the same things it requires in a room: pacing, a shared plan for what happens if something becomes overwhelming, and a counsellor who slows down rather than pushes. Those are agreed before any trauma-focused work starts. This practice runs scheduled sessions and has no on-call line, which is discussed openly at the outset so the arrangement is clear rather than assumed.' },
      { q: 'What if I do not want to start with the trauma itself?', a: 'That is the ordinary case rather than the exception. A good deal of trauma work happens well before anything is recounted in detail, and some of it never requires that at all.' },
    ],
  },
  {
    city: 'vancouver', service: 'couples-therapy',
    angle: 'Two people, two commutes, one appointment — the logistics defeat more Vancouver couples than the therapy does.',
    body: [
      'Couples counselling has a scheduling problem that individual work does not: it needs two people free at the same time. In Vancouver that frequently means two different commutes converging on a third location at an hour that suits neither, and the first appointment either of them cannot make becomes the one that ends the attempt.',
      'Joining from home, or from two different places when that is what the week allows, removes the single most common practical reason couples work stops. It also changes the texture of the session — you are having a difficult conversation in the room where you actually have difficult conversations, rather than in a neutral office you both leave immediately afterwards.',
    ],
    faqs: [
      { q: 'Can we join from two separate locations?', a: 'Yes, and some couples deliberately do — occasionally because one partner travels, occasionally because separate rooms make a particular conversation more possible rather than less.' },
      { q: 'How long is a couples session?', a: 'Fifty minutes at $170, with a 110-minute extended session at $340 for work that genuinely needs the longer run. The extended format is usually a considered choice rather than the starting point.' },
    ],
  },
  {
    city: 'vancouver', service: 'emdr-therapy',
    angle: 'Vancouver has EMDR-trained clinicians; what it does not have is many with an opening this month.',
    body: [
      'EMDR is not rare in Vancouver in the sense that it is rare in most of the province — trained clinicians exist here in numbers. The constraint is different: EMDR tends to be offered by practitioners who are already established, which means the search usually ends in a waitlist rather than in an absence.',
      'It is also a modality where the schedule matters more than usual. EMDR processing works best with a predictable rhythm, and a session that has to be moved because of traffic is more disruptive here than it would be in ordinary talk therapy. Removing the journey removes the most common reason the rhythm breaks.',
    ],
    faqs: [
      { q: 'Does EMDR actually work over video?', a: 'The bilateral stimulation is delivered on screen or through self-administered tapping, both of which are established remote protocols. What matters more is preparation and pacing, and neither of those depends on being in the same room.' },
      { q: 'Do I need to have a formal PTSD diagnosis?', a: 'No. EMDR is used with a range of distressing memories and stuck patterns, many of which never attract a diagnosis and do not need one to be worth working on.' },
    ],
  },
  {
    city: 'vancouver', service: 'depression-counselling',
    angle: 'Depression makes the trip to therapy the hardest part of therapy, and Vancouver makes the trip long.',
    body: [
      'There is a particular cruelty in how depression interacts with getting help: the illness attacks exactly the capacity required to attend an appointment. Getting dressed, leaving, travelling across a city and being in public are the things that are hardest, and they all happen before the session starts.',
      'Reducing what has to happen before the session to opening a laptop is not a lesser version of the work. For a meaningful number of people it is the difference between attending in week five and not. That matters because depression counselling depends on accumulation — behavioural activation and cognitive work both need repetition, and neither survives a fortnight of missed sessions.',
    ],
    faqs: [
      { q: 'What if I cannot face talking on a particular day?', a: 'Say so, and the session adjusts. A session where very little is said is not a wasted one, and cancelling because you do not feel up to it is the pattern most worth interrupting.' },
      { q: 'Should I be looking at medication as well?', a: 'That is a conversation for a physician, not a counsellor — this practice does not prescribe. Plenty of people do both, and the counselling side does not require a decision either way before starting.' },
    ],
  },

  /* ---------------- SURREY — size, language, and shift work ---------------- */
  {
    city: 'surrey', service: 'anxiety-counselling',
    angle: 'Surrey is big enough that the nearest anxiety counsellor can be a forty-minute drive inside your own city.',
    body: [
      'Surrey is not one place. A practice in Guildford is not local to somebody in South Surrey or Cloverdale, and the transit that works well along the SkyTrain corridor does not help much east of it. For anxiety in particular, a forty-minute cross-city drive to talk about feeling overstretched is a difficult sell to your own week.',
      'The other Surrey-specific factor is shift work. A meaningful share of this city works hours that do not resemble nine to five, and a counselling practice with only daytime availability quietly excludes them. Evening sessions on four days, joined from home, remove the two constraints that most often stop people here from starting.',
    ],
    faqs: [
      { q: 'Do you offer sessions in Punjabi?', a: 'Yes — sessions run in English or Punjabi, and switching between them mid-session is entirely normal rather than something to apologise for.' },
      { q: 'I work shifts. Is there anything outside office hours?', a: 'There are evening slots Tuesday through Friday. If none of the published times work, there is a waitlist that records when you are actually free rather than asking you to keep checking.' },
    ],
  },
  {
    city: 'surrey', service: 'trauma-therapy',
    angle: 'For many families in Surrey the barrier to trauma work has never been distance — it is having to explain the context before you can start.',
    body: [
      'Trauma work depends on not having to translate first. For South Asian families in Surrey that is frequently the practical obstacle rather than travel: a counsellor who needs the family structure explained, who hears obligation as enmeshment, or who treats what other people will say as an irrational concern rather than a real constraint, is a counsellor you spend the first several sessions educating.',
      'Working in Punjabi as well as English matters less for vocabulary than for that context. Intergenerational patterns, migration, the weight carried by a first or second generation, the difference between a family being difficult and a family being the only support you have — these do not need setting out from scratch.',
    ],
    faqs: [
      { q: 'Will my family need to be involved?', a: 'Not unless you want them to be. Individual trauma work is yours, and what you choose to tell anyone about it is entirely your decision.' },
      { q: 'Can we work in Punjabi if my English is fine but the difficult parts are not?', a: 'That is extremely common and entirely workable. A good deal of what is hardest to say sits in a first language even when day-to-day life happens in a second.' },
    ],
  },
  {
    city: 'surrey', service: 'couples-therapy',
    angle: 'Couples work in Surrey often has a third party in the room whether or not anyone has named them: the wider family.',
    body: [
      'A large share of couples counselling here involves questions that a Metro Vancouver practice may not think to ask. Whether you live with parents or in-laws. Whether a decision is genuinely yours to make alone. How much of the current pressure originates between the two of you and how much arrives from outside and lands on you both.',
      'None of that means the answer is more separation from family, and a counsellor who assumes it is will not be useful. The work is about being clear on which pressures are shared and which are inherited, and what the two of you actually want — which is a different conversation from the one that starts by treating obligation as the problem.',
    ],
    faqs: [
      { q: 'What if only one of us wants to come?', a: 'Start anyway. Individual work on a relationship is legitimate and often useful, and it is not unusual for the second person to join later once it is clear what the sessions are actually like.' },
      { q: 'Can sessions run in Punjabi if one of us is more comfortable that way?', a: 'Yes, including sessions that move between both languages. Where partners have different preferences, that is worth naming early rather than working around.' },
    ],
  },
  {
    city: 'surrey', service: 'emdr-therapy',
    angle: 'Finding an EMDR clinician in Surrey is possible; finding one who also works in Punjabi has been close to impossible.',
    body: [
      'EMDR is available in Surrey. The combination of EMDR training and Punjabi has been another matter, and for anyone who wants both, the historical options have been to accept one or the other or to travel and still not find it.',
      'That combination is a specific thing rather than a general claim about cultural fit. EMDR involves identifying the memory and the belief attached to it, and beliefs about shame, duty and reputation frequently sit in a first language. Working in the language the belief was formed in is not a nicety in this modality — it is closer to a working requirement.',
    ],
    faqs: [
      { q: 'Can EMDR be done in Punjabi?', a: 'Yes. The protocol is the same; what changes is that the belief attached to a memory can be named in the language it belongs to rather than approximated in translation.' },
      { q: 'How many sessions does EMDR take?', a: 'It varies too widely for an honest average. Some focused pieces of work are short; anything involving repeated or early experience generally is not. It is reviewed as you go rather than committed to in advance.' },
    ],
  },
  {
    city: 'surrey', service: 'depression-counselling',
    angle: 'In a city this spread out, depression and a forty-minute drive are a combination that ends most attempts at counselling.',
    body: [
      'Depression counselling relies on turning up more or less weekly for a stretch. In Surrey that has meant, for many people, committing to a cross-city drive during the exact period of life when driving across a city is hardest. The attempts that fail here usually fail on logistics rather than on the therapy.',
      'There is also a disclosure factor worth naming. In communities where mental health is still discussed carefully, being seen going into a counselling office is a real consideration rather than an imagined one. A session joined from home is private in a way that a waiting room is not, and for some people that is the deciding factor in whether they start at all.',
    ],
    faqs: [
      { q: 'Will anyone find out I am seeing a counsellor?', a: 'Not from this practice. Sessions are confidential within the limits every RCC is bound by, those limits are explained at the outset, and nothing arrives by post.' },
      { q: 'Is it depression or am I just tired?', a: 'That is a reasonable thing not to know, and working it out is a legitimate reason to book the free 15-minute call rather than a reason to wait until you are more certain.' },
    ],
  },

  /* ---------------- BURNABY — the authority nobody expects ---------------- */
  {
    city: 'burnaby', service: 'anxiety-counselling',
    angle: 'Burnaby residents who work downtown often discover their mental-health intake runs through Fraser Health, not Vancouver Coastal.',
    body: [
      'Burnaby sits in an odd position. Plenty of people here orient toward Vancouver — they work there, they look for services there — and then find that public mental-health intake for their address runs through Fraser Health rather than Vancouver Coastal. It is a small administrative fact that costs people weeks when they discover it at the wrong end of a referral.',
      'For anxiety specifically the more useful point is that none of this applies to private counselling, which is not organised by health authority at all. Where you live determines the public route; it does not determine which registered counsellor you may see privately, and for someone who has already lost time to the wrong intake queue that is worth knowing plainly.',
    ],
    faqs: [
      { q: 'Do I need a doctor to refer me?', a: 'No. Counselling with an RCC is accessed directly — no referral, no diagnosis, no waiting for a physician appointment first.' },
      { q: 'Is counselling covered by MSP?', a: 'No. MSP does not cover counselling with an RCC. Most extended health plans reimburse it, and the practice provides receipts with the registration number on them for that purpose.' },
    ],
  },
  {
    city: 'burnaby', service: 'trauma-therapy',
    angle: 'Burnaby has fewer trauma-focused practices than its size suggests, and the default has been to travel west.',
    body: [
      'For a city of its size Burnaby is comparatively thin on specialised private practice, and trauma-focused work is one of the places that shows. The established pattern is to look toward Vancouver, which works — at the cost of adding a commute to the one appointment most likely to leave you needing to go straight home.',
      'The alternative is not a compromise on the work. Trauma-focused counselling delivered by video is the same counselling, with the difference that the hour afterwards happens in your own space rather than on the way back from somewhere.',
    ],
    faqs: [
      { q: 'What actually happens in a first trauma session?', a: 'Very little that resembles what people expect. The first session is about what you want to be different, what has already been tried, and how to pace things — not an account of what happened.' },
      { q: 'Do you work with people who are not sure it counts as trauma?', a: 'Often. Whether an experience qualifies for a label is a much less useful question than whether it is still shaping how you respond to things now.' },
    ],
  },
  {
    city: 'burnaby', service: 'couples-therapy',
    angle: 'Two Burnaby commutes rarely converge anywhere convenient, which is why couples work here so often stalls at scheduling.',
    body: [
      'Couples in Burnaby frequently work in two different directions — one toward Vancouver, one east into Fraser Health territory — and an in-person appointment has to find a time and a place that defeats neither commute. That is a harder problem than it sounds, and it is the reason a lot of couples counselling here never gets past the enquiry.',
      'Removing the location from the equation leaves only the time, which is a solvable problem. It also means a session can happen on an evening when one of you is still at work and the other is at home, which is a compromise that in-person scheduling cannot offer at all.',
    ],
    faqs: [
      { q: 'Do both of us need to be there every time?', a: 'Usually yes, though individual sessions within couples work happen when there is a clear reason for them, agreed openly rather than arranged privately.' },
      { q: 'What if we mostly argue in the session?', a: 'That is information rather than failure. A large part of the early work is noticing the shape of the argument you keep having, which is difficult to do from inside it.' },
    ],
  },
  {
    city: 'burnaby', service: 'emdr-therapy',
    angle: 'EMDR in Burnaby usually means an appointment in Vancouver, and a modality that rewards routine does not suit a long journey.',
    body: [
      'Practically speaking, looking for EMDR in Burnaby produces results in Vancouver. That is workable, but EMDR is a modality where consistency does real work — processing benefits from a predictable interval, and sessions that get moved because of traffic or a delayed bus interrupt something more specific than a chat would be.',
      'Delivered remotely, the interval is the only thing being scheduled. The bilateral stimulation is provided on screen or through self-administered tapping, both established remote protocols, and the preparation that makes EMDR safe is unchanged.',
    ],
    faqs: [
      { q: 'What if I feel destabilised after a session?', a: 'Preparation for exactly that comes before any processing begins — grounding you have practised, and an agreed plan for a difficult evening. This practice runs scheduled sessions with no on-call line, so that plan includes which crisis lines to use and when.' },
      { q: 'Can EMDR be combined with ordinary talking therapy?', a: 'Commonly, yes. Many courses of work use EMDR for specific stuck material inside a broader piece of counselling.' },
    ],
  },
  {
    city: 'burnaby', service: 'depression-counselling',
    angle: 'The Burnaby pattern is a long commute to a job that is part of the problem, followed by a longer one to talk about it.',
    body: [
      'A recognisable Burnaby situation: work is in Vancouver, the commute is substantial, and the exhaustion is doing a good deal of the damage. Adding a third journey to the week in order to address it is a proposition that sounds reasonable in an enquiry email and much less reasonable on a wet Tuesday in February.',
      'Depression counselling works through accumulation rather than insight — behavioural activation, small tested changes, cognitive work repeated until it holds. All of that depends on sessions continuing. Removing the journey is not about comfort; it is about the course of work surviving past the point where it starts to matter.',
    ],
    faqs: [
      { q: 'How long before anything changes?', a: 'No honest answer fits everyone, and a practitioner who gives you a number is guessing. What is reasonable is to review openly after a few sessions whether this is useful.' },
      { q: 'What if I have tried counselling before and it did not help?', a: 'Worth saying in the first fifteen minutes. What was unhelpful last time is genuinely useful information, and it often points at fit or approach rather than at counselling as such.' },
    ],
  },

  /* ---------------- ABBOTSFORD — the home market ------------------------- */
  {
    city: 'abbotsford', service: 'anxiety-counselling',
    angle: 'East of Langley the counsellor-to-resident ratio drops, and Abbotsford is where people start being told the nearest option is in Surrey.',
    body: [
      'The Fraser Valley has fewer counsellors per resident than Metro Vancouver, and the gap widens as you go east. In Abbotsford the familiar experience is being told the nearest practice with the right specialism is in Surrey — which is Highway 1, at the hour when Highway 1 is at its worst.',
      'For anxiety this produces a specific and slightly absurd outcome: people delay seeking help for a condition made worse by anticipation, because the logistics of getting help are themselves something to dread. Removing the drive removes a barrier that is disproportionately large for this presentation in particular.',
    ],
    faqs: [
      { q: 'Is this practice actually based in Abbotsford?', a: 'The practice is fully virtual and serves all of British Columbia by secure video. There is no office to visit anywhere, which is stated plainly rather than left ambiguous.' },
      { q: 'What does a session cost?', a: '$140 for 50 minutes, with a free 15-minute consultation first. Most extended health plans reimburse sessions with a Registered Clinical Counsellor; MSP does not cover them.' },
    ],
  },
  {
    city: 'abbotsford', service: 'trauma-therapy',
    angle: 'Specialised trauma work has been an out-of-town errand for the Fraser Valley — which is a poor arrangement for a piece of work that asks a lot of you.',
    body: [
      'Trauma-focused counselling thins out quickly east of Langley. The practical result for Abbotsford has been that specialised work is something you drive for, and that the session most likely to leave you shaken is followed immediately by an hour on the highway.',
      'A second Fraser Valley factor is that this is not an anonymous place. In a city where people know each other, being seen going into a counselling practice is a real consideration for some, and a session joined from home is private in a way a waiting room on a main road is not.',
    ],
    faqs: [
      { q: 'How private is a video session really?', a: 'Sessions run on a secure platform, notes are held to the standards BCACC requires, and nothing is posted to your home. The realistic weak point is your own end — somewhere you will not be overheard matters more than the technology.' },
      { q: 'Do you work with first responders and their families?', a: 'Yes. Occupational exposure has its own shape, and it is not the same conversation as trauma arising from a single event.' },
    ],
  },
  {
    city: 'abbotsford', service: 'couples-therapy',
    angle: 'Two people, one highway, one appointment — Fraser Valley couples usually lose the attempt to the drive rather than to the work.',
    body: [
      'Couples counselling requires two people free simultaneously. In Abbotsford that has often meant two people free simultaneously and both willing to drive to Surrey, which is a materially harder condition to satisfy and the one on which most attempts fail.',
      'There is also a rhythm point. Couples work benefits from sessions close enough together to keep momentum; a fortnightly cadence chosen because weekly was logistically impossible changes what the work can do. Removing the drive makes the interval a genuine choice rather than a consequence of geography.',
    ],
    faqs: [
      { q: 'Do you do premarital or pre-commitment work?', a: 'Yes, and it is generally more straightforward than work begun in a crisis — largely because nobody arrives already keeping score.' },
      { q: 'Can we book a longer first session?', a: 'A 110-minute extended session is available at $340 where there is a lot to lay out. Most couples start with the standard 50 minutes and decide from there.' },
    ],
  },
  {
    city: 'abbotsford', service: 'emdr-therapy',
    angle: 'EMDR is one of the modalities the Fraser Valley most reliably does not have locally.',
    body: [
      'Ask for EMDR in Abbotsford and the answer has commonly been that the nearest trained clinician is west of you. It is a specific enough training that a smaller local sector simply may not contain it, which is different from a service being busy — it is a service being absent.',
      'Delivered by video, that absence stops being geographic. The protocol is unchanged, the bilateral stimulation is delivered on screen or by self-administered tapping, and the preparation phase that makes EMDR safe to do happens exactly as it would in a room.',
    ],
    faqs: [
      { q: 'Is EMDR only for major traumatic events?', a: 'No. It is used with a wide range of distressing memories and stuck beliefs, including ones that never involved a single identifiable event.' },
      { q: 'What if I do not want to describe what happened in detail?', a: 'EMDR requires far less verbal recounting than most people expect, which is one of the reasons it suits people who have found talking it through directly unmanageable.' },
    ],
  },
  {
    city: 'abbotsford', service: 'depression-counselling',
    angle: 'Depression plus a highway drive is a combination that ends courses of counselling in the Fraser Valley before they get going.',
    body: [
      'The recurring Abbotsford pattern is not that people cannot find a counsellor. It is that they find one an hour away, attend three or four times, and then stop — because the drive was the part that required the energy depression had already taken.',
      'What makes this worth saying rather than assuming is that depression counselling is cumulative. Behavioural activation and cognitive work both need repetition to hold. A course that ends at session four has not delivered a lesser result; in the main it has not delivered one at all, and the reason was the highway.',
    ],
    faqs: [
      { q: 'Can I be seen weekly?', a: 'Weekly is the usual starting cadence where it is workable, moving to fortnightly later. Because there is no travel, weekly is a realistic commitment rather than an aspirational one.' },
      { q: 'What if I need more than counselling?', a: 'Then that gets said. Where something falls outside what counselling can appropriately address, the honest answer is a referral rather than continuing regardless.' },
    ],
  },

  /* ---------------- LANGLEY — two municipalities, one name ---------------- */
  {
    city: 'langley', service: 'anxiety-counselling',
    angle: 'A practice "in Langley" may be in the City or anywhere across the Township, which for Aldergrove or Brookswood residents is not local at all.',
    body: [
      'Langley is two municipalities sharing a name, and a directory listing that says "Langley" tells you very little about whether the practice is near you. For somebody in Aldergrove, a counsellor in Willoughby is a drive; for somebody in Brookswood, half the listings are on the wrong side of the Township.',
      'This matters more for anxiety than for most presentations, because anxiety work depends on a routine that survives the ordinary friction of a week. A location that is nearly convenient generates exactly the kind of low-level scheduling pressure the sessions are meant to be addressing.',
    ],
    faqs: [
      { q: 'Do you see clients in the City of Langley and the Township?', a: 'Both, and the distinction stops mattering — sessions are by secure video anywhere in British Columbia, so where in Langley you are has no bearing on access.' },
      { q: 'How soon could I start?', a: 'The free 15-minute consultation is usually the quickest way to find out. Availability changes, and the booking page shows what is genuinely open rather than an inbox promise.' },
    ],
  },
  {
    city: 'langley', service: 'trauma-therapy',
    angle: 'Langley is well covered for general counselling and thin for specialised trauma work — a gap that is easy to miss until you are in it.',
    body: [
      'Langley does not look underserved. There are practices, they advertise, and general counselling is genuinely available. The gap shows only when you need something specific: trauma-focused work with the right training behind it is a narrower field here, and the usual advice is to look toward Surrey or Abbotsford.',
      'Which means the Langley experience is often a false start — several weeks spent with a counsellor who is good but not trained for what you brought, before starting again elsewhere. Being clear at the outset about what a practice does and does not do is worth more than proximity.',
    ],
    faqs: [
      { q: 'How do I know whether a counsellor is trained for trauma?', a: 'Ask directly, and expect a specific answer rather than a reassuring one. This practice is EMDR- and Gottman-trained, and the registration number is published so it can be checked in the BCACC register.' },
      { q: 'What if I start and it is not the right fit?', a: 'Say so. A referral onward is a normal outcome and a better one than continuing out of politeness.' },
    ],
  },
  {
    city: 'langley', service: 'couples-therapy',
    angle: 'Langley couples routinely commute in opposite directions, and the appointment has to defeat both journeys or it does not happen.',
    body: [
      'Langley sits at a junction: one partner heading west toward Surrey and Vancouver, the other east toward Abbotsford, or one working locally while the other does not. An in-person couples appointment has to be reachable for both at the same hour, and for a lot of couples here no such hour exists.',
      'Video removes the geography and leaves the scheduling, which is a much easier problem. It also permits a session where one of you joins from a car park at the end of a shift, which is not ideal and is considerably better than the alternative of not going.',
    ],
    faqs: [
      { q: 'Is it too late for counselling if we are already talking about separating?', a: 'No. Some couples work is about deciding rather than repairing, and doing that deliberately — particularly where children are involved — is a legitimate use of the sessions.' },
      { q: 'Do you take sides?', a: 'No. Where something needs saying plainly it gets said plainly, which is a different thing from adjudicating between you.' },
    ],
  },
  {
    city: 'langley', service: 'emdr-therapy',
    angle: 'EMDR in Langley is available in principle and hard to book in practice, because the trained clinicians serve the whole eastern corridor.',
    body: [
      'The handful of EMDR-trained practitioners around Langley are absorbing demand from Surrey to Abbotsford, which is why the search so often ends in a waitlist. That is not a local failing — it is what happens when a specific training is thinly distributed across a wide corridor.',
      'Remote delivery widens the pool from whoever is within driving distance to whoever is registered in British Columbia. For a modality this specific, that is the difference between choosing a clinician and taking whoever has an opening.',
    ],
    faqs: [
      { q: 'Is EMDR suitable for everyone?', a: 'No, and that is assessed before starting rather than discovered partway through. Where it is not the right approach, that is said directly.' },
      { q: 'What happens in an EMDR session over video?', a: 'The same phases as in a room: history, preparation, then processing with bilateral stimulation delivered on screen or by self-administered tapping, with time at the end to settle before the session closes.' },
    ],
  },
  {
    city: 'langley', service: 'depression-counselling',
    angle: 'Suburban depression is under-noticed precisely because everything looks fine from outside, and Langley is where that pattern is most recognisable.',
    body: [
      'A particular version of depression turns up in places like Langley: the house, the job, the family, nothing identifiably wrong, and a persistent flatness that feels unjustified. That last part — the sense of not having a good enough reason — is frequently what delays people from booking for a year or more.',
      'It does not require a reason. Depression is not a verdict on whether your circumstances warrant it, and a course of counselling does not begin by establishing that you have earned the right to feel this way.',
    ],
    faqs: [
      { q: 'I have nothing to complain about. Is counselling appropriate?', a: 'Yes. "Nothing is wrong and I feel like this anyway" is one of the more common opening sentences, not a disqualification.' },
      { q: 'Do I have to talk about childhood?', a: 'Only if it turns out to be relevant to what you want to change. A good deal of depression work is squarely about the present.' },
    ],
  },

  /* ---------------- CHILLIWACK — where the valley stops commuting -------- */
  {
    city: 'chilliwack', service: 'anxiety-counselling',
    angle: 'Chilliwack is the point where a Metro Vancouver appointment stops being a drive and becomes an afternoon.',
    body: [
      'West of Chilliwack the Fraser Valley is commutable. At Chilliwack it stops. A Surrey appointment is a two-hour round trip in good conditions, and between November and March Highway 1 does not reliably offer good conditions. That is the practical reason a lot of people here have never seriously pursued counselling.',
      'Anxiety compounds this in a way worth naming. Someone whose difficulty involves anticipating things going wrong is being asked to commit, weeks in advance, to a highway drive in uncertain weather in order to address it. The barrier is not merely inconvenient; it is made of exactly the material the sessions are about.',
    ],
    faqs: [
      { q: 'Is there anything available locally in Chilliwack?', a: 'There is local practice, and for general counselling it may well be the right answer. This practice is virtual and covers the whole province, which matters most when what you need is specific rather than general.' },
      { q: 'What happens if my internet is unreliable?', a: 'Sessions can run by phone instead. It is a genuine fallback rather than a lesser option, and it is agreed in advance rather than improvised mid-session.' },
    ],
  },
  {
    city: 'chilliwack', service: 'trauma-therapy',
    angle: 'For eastern-valley residents, specialised trauma work has meant a long drive home immediately afterwards — the worst possible arrangement.',
    body: [
      'Where trauma-focused work is not available locally, the standard solution has been to travel for it. In Chilliwack that means finishing a demanding session and then driving an hour west to east, often in the dark, often in weather.',
      'That is not a neutral detail. People manage the drive by managing the session — keeping it lighter than it needs to be so the journey afterwards stays manageable. Removing the journey removes a ceiling on the work that most people never articulate but reliably observe.',
    ],
    faqs: [
      { q: 'How do you handle a session that becomes overwhelming?', a: 'By pacing so it is far less likely, and by agreeing beforehand what happens if it does — grounding you have already practised, and time at the end to settle rather than a hard stop.' },
      { q: 'Are sessions ever recorded?', a: 'No. Nothing is recorded. Notes are kept to the standard BCACC requires and to nothing beyond it.' },
    ],
  },
  {
    city: 'chilliwack', service: 'couples-therapy',
    angle: 'Structured couples work is one of the things the eastern valley most often simply does not have.',
    body: [
      'General counselling exists in Chilliwack. Structured couples work with specific training behind it is a narrower field, and in a smaller market the honest local answer is frequently that it is not available. The fallback has been to travel or to go without, and most couples choose the second.',
      'Two people travelling together for two hours to discuss a difficult subject also has an obvious problem: the car journey home. Joining from your own kitchen at eight in the evening is not a downgrade from that arrangement.',
    ],
    faqs: [
      { q: 'What approach do you use with couples?', a: 'Gottman-trained, which is structured rather than open-ended — patterns of interaction are looked at directly rather than circled around.' },
      { q: 'Can we do this if we are in different places some weeks?', a: 'Yes. Partners joining from two locations is workable and reasonably common where shift patterns or travel make it necessary.' },
    ],
  },
  {
    city: 'chilliwack', service: 'emdr-therapy',
    angle: 'In the eastern Fraser Valley, EMDR is not a service that is busy — it is a service that is absent.',
    body: [
      'There is a difference between a modality being oversubscribed and a modality not being present, and Chilliwack usually meets the second. EMDR requires specific training that a smaller local sector may simply not contain, so the search does not end in a waitlist; it ends in nothing.',
      'This is the clearest case in the province for remote delivery. The protocol does not lose anything to video — bilateral stimulation is delivered on screen or by self-administered tapping, both established remote practice — and the alternative is not a different local option but no option at all.',
    ],
    faqs: [
      { q: 'Is remote EMDR a compromise version?', a: 'No. Remote protocols are established practice, and the phases are the same. What changes is that the preparation and grounding happen in the room you are actually going to be in afterwards.' },
      { q: 'How do I know if EMDR is right for me?', a: 'It is assessed at the outset, including whether now is the right time for it. Where it is not, that is said rather than worked around.' },
    ],
  },
  {
    city: 'chilliwack', service: 'depression-counselling',
    angle: 'Winter, distance and depression compound in the eastern valley in a way they do not in Metro Vancouver.',
    body: [
      'Depression is worse in the months when getting anywhere is hardest, and in Chilliwack those are the same months. A course of counselling that depends on a highway drive is a course of counselling with a seasonal failure mode built into it.',
      'Consistency is what depression work runs on — behavioural activation and cognitive work both need repetition rather than insight. A session that survives a snowfall because it never required leaving the house is not a lesser session. It is the one that keeps the sequence intact.',
    ],
    faqs: [
      { q: 'What if I miss several weeks?', a: 'You pick it up. Disappearing for a stretch is a normal part of this rather than a reason not to come back, and returning does not require an explanation.' },
      { q: 'Can I claim sessions on extended health?', a: 'Most plans covering a Registered Clinical Counsellor will reimburse. Receipts carry the registration number that insurers ask for. MSP does not cover counselling.' },
    ],
  },

  /* ---------------- VICTORIA — bounded by water -------------------------- */
  {
    city: 'victoria', service: 'anxiety-counselling',
    angle: 'On the Island the specialist pool is genuinely finite rather than merely busy — the strait is a hard edge, not a delay.',
    body: [
      'Greater Victoria has an active private sector, and for anxiety there are real local options. What the Island does not have is the mainland fallback: when a particular approach is not represented here, "look slightly further afield" means a ferry or a flight rather than a longer drive.',
      'That produces a specific Island habit of settling — taking the available option rather than the fitting one, because the alternative involves a day of travel. Remote access removes the strait from the calculation entirely, which is a bigger change here than anywhere else in the province.',
    ],
    faqs: [
      { q: 'Are you registered to work with clients on Vancouver Island?', a: 'Yes. Registration is provincial — an RCC registered in British Columbia may work with clients anywhere in BC, Island included.' },
      { q: 'Do you offer daytime appointments?', a: 'Monday 10am to 3pm and Tuesday 9am to 6pm, plus a single evening hour Wednesday, Thursday and Friday. Availability is shown live on the booking page.' },
    ],
  },
  {
    city: 'victoria', service: 'trauma-therapy',
    angle: 'Trauma work asks for continuity, and continuity is exactly what a ferry-dependent arrangement cannot promise.',
    body: [
      'Where Island residents have pursued trauma-focused work on the mainland, the structure has been intensives separated by long gaps — because that is what travel permits. It is a workable compromise and it is a compromise: trauma work generally does better with a steady interval than with occasional concentrated bursts.',
      'Video makes the ordinary weekly rhythm available on the Island on exactly the same terms as in Vancouver. That is not a convenience argument. It is the difference between the structure the work wants and the structure the ferry timetable allows.',
    ],
    faqs: [
      { q: 'Would I ever need to travel to the mainland?', a: 'No. The practice is virtual for everyone — there is no office on the mainland or anywhere else, so no client is ever asked to travel.' },
      { q: 'How often would sessions be?', a: 'Weekly is the usual starting point for trauma-focused work, moving to fortnightly as things settle. It is reviewed rather than fixed.' },
    ],
  },
  {
    city: 'victoria', service: 'couples-therapy',
    angle: 'Victoria is small enough that couples counselling carries a visibility problem the mainland does not have.',
    body: [
      'In a city this size, professional and social circles overlap more than people expect. Couples arriving at a counselling office on a weekday afternoon are reasonably likely to encounter somebody they know, and for some couples that is genuinely the reason they have not started.',
      'A session joined from home removes the question. That is not a minor point in a place where the relevant concern is not confidentiality in the formal sense — which any registered practice provides — but simply not being seen walking through a door.',
    ],
    faqs: [
      { q: 'Is what we say in couples sessions confidential?', a: 'Yes, within the limits every RCC works under, which are explained at the start rather than buried. Those limits apply equally to both partners.' },
      { q: 'What if we have very different ideas about what is wrong?', a: 'That is the ordinary starting position. Establishing what each of you thinks is happening is generally the first piece of work rather than a prerequisite for it.' },
    ],
  },
  {
    city: 'victoria', service: 'emdr-therapy',
    angle: 'When EMDR is not represented on the Island, the historical options have been to travel for it or to go without.',
    body: [
      'The Island EMDR pool is finite in a way a mainland pool is not. When the trained clinicians here are full, there is no adjacent city to try — the next option involves a sailing, and an intensive scheduled around ferry availability is a different piece of work from a weekly session.',
      'Remote delivery makes the entire provincial pool reachable from Victoria on the same terms as from Vancouver. For a modality this specific, being able to choose the clinician rather than take the one with the opening is most of the value.',
    ],
    faqs: [
      { q: 'Does the time zone or location affect scheduling?', a: 'No. The whole province is on one clock, and there is no travel component to plan around at either end.' },
      { q: 'Can EMDR help with things that happened a long time ago?', a: 'That is a common use of it. The relevant question is whether the memory still carries a charge now, not how long ago it occurred.' },
    ],
  },
  {
    city: 'victoria', service: 'depression-counselling',
    angle: 'Island winters are long and grey, and the counselling that helps most is the kind that does not require going outside.',
    body: [
      'Victoria trades snow for months of low grey light, and for a good number of people that produces a reliable seasonal deepening. It arrives in the same months when leaving the house is least appealing, which is an unhelpful piece of timing.',
      'Depression counselling depends on sessions continuing through exactly that period. Removing the requirement to go out in order to get help is not a comfort measure — for the months when it matters most, it is the thing that keeps the course of work running.',
    ],
    faqs: [
      { q: 'Is this seasonal or something more?', a: 'Worth working out rather than assuming, and it is a reasonable thing to bring to the free 15-minute call.' },
      { q: 'Do you work with students?', a: 'Yes. Student presentations frequently combine academic pressure with being far from home for the first time, which is a specific combination rather than general stress.' },
    ],
  },

  /* ---------------- KELOWNA — best served in a thin region --------------- */
  {
    city: 'kelowna', service: 'anxiety-counselling',
    angle: 'Kelowna absorbs demand from the whole Okanagan, so being the best-served city in the region is not the same as being well served.',
    body: [
      'Kelowna has the strongest private sector in the Interior, which is precisely why its practices are busy. Referrals arrive from Vernon, West Kelowna, Penticton and further, and a local resident is effectively competing with the region for the same appointments.',
      'Anxiety is the highest-volume presentation in that queue. The result is a familiar Okanagan experience: a city that looks well provisioned on paper and a waitlist that does not reflect it, particularly for anyone who needs an evening slot.',
    ],
    faqs: [
      { q: 'Do you take clients from elsewhere in the Okanagan?', a: 'Anywhere in British Columbia. Because sessions are by video, Vernon or Penticton is exactly the same as Kelowna in terms of access.' },
      { q: 'How quickly can I be seen?', a: 'The booking page shows genuine availability rather than an estimate. The free 15-minute consultation is normally the fastest first step.' },
    ],
  },
  {
    city: 'kelowna', service: 'trauma-therapy',
    angle: 'The Okanagan has a wildfire-season trauma pattern that most of the province does not share.',
    body: [
      'Repeated summers of evacuation alerts, smoke and genuine property loss have left a recognisable pattern in this region: heightened alertness that reappears with the season, sleep that deteriorates in July, and a difficulty that people are inclined to dismiss because nothing happened to them personally.',
      'That dismissal is worth challenging. Sustained threat and repeated displacement produce real effects whether or not a house was lost, and treating it as insufficient grounds is one of the more common reasons people here do not seek help for something that is treatable.',
    ],
    faqs: [
      { q: 'Nothing actually happened to me. Does that count?', a: 'Living under sustained threat has effects of its own. Whether an experience qualifies for a label is a much less useful question than whether it is still shaping how you respond now.' },
      { q: 'Do you work with people whose difficulty is seasonal?', a: 'Yes, and the pattern can be worth working on out of season, when it is easier to look at directly.' },
    ],
  },
  {
    city: 'kelowna', service: 'couples-therapy',
    angle: 'Okanagan seasonal work puts a strain on relationships that a Metro Vancouver counsellor may not think to ask about.',
    body: [
      'A large part of this economy runs on seasons — tourism, agriculture, construction, hospitality. That produces relationships where one partner is absent for months and then abruptly present, where income arrives unevenly, and where the winter conversation is entirely different from the summer one.',
      'Those pressures get misread as commitment problems when they are structural. A counsellor who asks about the shape of your year rather than assuming a uniform one is asking a more useful question, and it is a question the answer to which is specific to living here.',
    ],
    faqs: [
      { q: 'Can we schedule around a seasonal work pattern?', a: 'Yes, including pausing and resuming. A course of couples work that runs intensively in one season and lightly in another is a legitimate structure rather than a failure to commit.' },
      { q: 'Do you work with couples where one partner is away a lot?', a: 'Regularly. Video makes it workable in a way an in-person practice cannot, since a partner can join from wherever they are that week.' },
    ],
  },
  {
    city: 'kelowna', service: 'emdr-therapy',
    angle: 'Interior Health covers a very large area, and EMDR is not distributed across it evenly.',
    body: [
      'Interior Health spans a region far larger than its population suggests, and specialised private modalities cluster in Kelowna. For anyone in the wider Okanagan that means EMDR is either in Kelowna or it is a drive of an hour or more each way.',
      'Remote delivery flattens that. From Peachland or Lake Country the access is identical to downtown Kelowna, and the pool is the whole province rather than whoever happens to practise within reach.',
    ],
    faqs: [
      { q: 'What does bilateral stimulation involve on video?', a: 'Usually following a moving point on screen, or self-administered tapping. Both are established remote protocols and are explained and practised before any processing begins.' },
      { q: 'Is EMDR uncomfortable?', a: 'It can be demanding, which is why pacing and preparation come first and why sessions end with time to settle rather than stopping abruptly.' },
    ],
  },
  {
    city: 'kelowna', service: 'depression-counselling',
    angle: 'Kelowna is a place people move to expecting to feel better, which makes depression there unusually hard to admit to.',
    body: [
      'A recognisable pattern here: someone relocates for the lake, the climate, the pace, and then finds the depression came too. The gap between the expectation and the reality makes it markedly harder to say out loud — everybody moved here to be happier, and admitting you are not can feel like a failure of the decision.',
      'It is not evidence about the decision. Relocation reliably removes support structures without removing the difficulty, and the resulting isolation is a common and workable presentation rather than an indictment of the move.',
    ],
    faqs: [
      { q: 'I moved here recently and feel worse. Is that normal?', a: 'It is common enough to be unremarkable. A move removes routine and proximity to people who know you, and both of those were doing work you may not have noticed.' },
      { q: 'Do I need a diagnosis to start?', a: 'No. Counselling with an RCC needs no diagnosis and no referral.' },
    ],
  },

  /* ---------------- KAMLOOPS — weather as a clinical variable ------------ */
  {
    city: 'kamloops', service: 'anxiety-counselling',
    angle: 'Kamloops serves a catchment where the nearest appointment can be a winter highway away.',
    body: [
      'Kamloops is a hub for a very large and very sparse area. People come in from Merritt, Chase, Barriere and further, and for much of the year that journey is a genuine deterrent rather than an inconvenience — the Coquihalla and Highway 5 in January are not a routine commute.',
      'For anxiety this is doubly awkward, because the presentation most sensitive to unpredictability is the one being asked to depend on winter road conditions. A course of sessions that cannot be relied upon between November and March is not really a course of sessions.',
    ],
    faqs: [
      { q: 'What if the roads are closed?', a: 'It makes no difference to a video session. That is precisely the point for this region rather than an incidental benefit.' },
      { q: 'Can I have sessions from work?', a: 'If you have somewhere private and will not be interrupted. Plenty of people use a parked car, which works better than it sounds.' },
    ],
  },
  {
    city: 'kamloops', service: 'trauma-therapy',
    angle: 'In a smaller city, the counsellor you need may be somebody your family already knows — which for trauma work is disqualifying.',
    body: [
      'Kamloops is large enough to have counsellors and small enough that professional and personal circles overlap. For trauma work specifically that creates a real problem: the local practitioner with the right training may be someone connected to your workplace, your family or your community, and dual relationships are exactly what this work cannot accommodate.',
      'A counsellor outside the local network is not a second-best option here. For a good number of people it is the only arrangement in which the work is possible at all, and it is a stronger reason for looking beyond the city than distance ever was.',
    ],
    faqs: [
      { q: 'Will anyone locally know I am seeing you?', a: 'Not through this practice. There is no local presence, no waiting room, and no overlap with local professional or social networks.' },
      { q: 'Do you work with people in trades and resource work?', a: 'Yes. Occupational exposure and the culture around admitting to it are specific things, and they are not the same conversation as trauma from a single event.' },
    ],
  },
  {
    city: 'kamloops', service: 'couples-therapy',
    angle: 'Rotational and camp work reshapes a relationship in ways a nine-to-five counsellor may not think to ask about.',
    body: [
      'A significant share of this region works away — camps, rotations, long shifts on the road. That produces relationships with a specific rhythm: intense reunion, awkward recalibration, departure, repeat. The difficulties it creates are structural rather than a sign that either person is doing something wrong.',
      'Counselling that fits that pattern has to be able to run when one partner is away, which in-person work fundamentally cannot. Video sessions with a partner joining from camp are not a workaround; for a rotational couple they are the only arrangement that keeps the work continuous.',
    ],
    faqs: [
      { q: 'Can my partner join from a work camp?', a: 'Yes, if they have a connection and somewhere private. Sessions with partners in two locations are ordinary here rather than exceptional.' },
      { q: 'What if our schedules only overlap occasionally?', a: 'Then the cadence is built around that. Fortnightly or seasonal blocks are a legitimate structure where the alternative is nothing.' },
    ],
  },
  {
    city: 'kamloops', service: 'emdr-therapy',
    angle: 'Specialised modalities are not reliably represented in the Thompson-Nicola, and EMDR is among the least reliably available.',
    body: [
      'The private sector in Kamloops is small relative to the area it effectively serves, and specific trainings are not evenly distributed across small sectors. EMDR is frequently one of the gaps — not oversubscribed, simply not present in the numbers a region this size would need.',
      'Remote access changes the question from "who here is trained in this" to "who in British Columbia is". For a region where the honest local answer has often been that the modality is unavailable, that is a categorical change rather than an improvement in convenience.',
    ],
    faqs: [
      { q: 'How many EMDR sessions before anything shifts?', a: 'Too variable for an honest average, and a practitioner offering one is guessing. Progress is reviewed openly as you go.' },
      { q: 'Can EMDR be paused if it is too much?', a: 'Yes, and that is a normal adjustment rather than a setback. Pacing is agreed with you, not imposed.' },
    ],
  },
  {
    city: 'kamloops', service: 'depression-counselling',
    angle: 'Where a whole region shares a culture of getting on with it, depression tends to be presented late and understated.',
    body: [
      'In parts of the Interior the prevailing expectation is that difficulty is managed privately and not discussed. That has real strengths and one clear cost: people arrive at counselling later, and describe what is happening in terms markedly milder than the reality.',
      'It helps that the first step is small — a 15-minute video call, free, with nothing to commit to afterwards. For somebody who has spent a year deciding whether this is bad enough to warrant help, the size of the first step is often the thing that determines whether it is taken.',
    ],
    faqs: [
      { q: 'Is a 15-minute call really free?', a: 'Yes — no charge, no card, and no obligation to book anything afterwards. It exists so you can find out what this is like before deciding.' },
      { q: 'What if I do not know what to say?', a: 'That is a perfectly ordinary starting point, and working out what is going on is part of the work rather than a prerequisite for it.' },
    ],
  },

  /* ---------------- PRINCE GEORGE — the thinnest coverage in BC ---------- */
  {
    city: 'prince-george', service: 'anxiety-counselling',
    angle: 'Northern Health covers the thinnest counselling coverage in the province, and Prince George is its best-served city.',
    body: [
      'Prince George is the referral centre for an area larger than most countries, and it is where northern residents are sent when something is not available closer to home. Being the best-provisioned city in Northern Health is a real distinction and a limited one — the local sector is small in absolute terms regardless of how it compares.',
      'For anxiety, the practical consequence is a waitlist rather than a choice. Remote access changes that from "whoever here has an opening" to the whole provincial pool, which for the north is the single largest change available to it.',
    ],
    faqs: [
      { q: 'Do you work with clients across northern BC?', a: 'Anywhere in the province. Fort St John, Terrace, Prince Rupert and Quesnel are the same as Prince George in terms of access, because none of them involves travel.' },
      { q: 'What if I have never done counselling before?', a: 'Most people starting have not. The first session is largely about what you want to be different, and no preparation is expected.' },
    ],
  },
  {
    city: 'prince-george', service: 'trauma-therapy',
    angle: 'For much of the north, the honest answer about specialised trauma work has been that it is not available here.',
    body: [
      'This is the part of British Columbia where "the nearest specialist" can mean a flight rather than a drive. For trauma-focused work the northern experience has frequently not been a long waitlist but a straightforward absence, and the realistic alternatives have been travelling to the Lower Mainland or not doing the work.',
      'Remote delivery is not a lesser substitute for that. It is the arrangement in which a person in Prince George and a person in Vancouver see the same counsellor on the same terms, which has not previously been true for this kind of work in this part of the province.',
    ],
    faqs: [
      { q: 'Would I have to travel south at any point?', a: 'No. The practice is virtual for every client, so there is no point at which travel becomes necessary.' },
      { q: 'Do you work with people in remote communities?', a: 'Yes, anywhere in BC with a connection good enough for video — and by phone where it is not.' },
    ],
  },
  {
    city: 'prince-george', service: 'couples-therapy',
    angle: 'Northern couples are frequently far from family as well as from services, which changes what the relationship is carrying.',
    body: [
      'Many couples in the north are some distance from extended family, which means the relationship absorbs support that would otherwise be spread across more people. That is a specific pressure and a considerable one, and it is quite different from the difficulties that bring urban couples to counselling.',
      'Add rotational or resource work, long winters and limited local services, and the load is structural rather than a matter of two people not trying. Naming that accurately tends to be more useful than working on communication in isolation.',
    ],
    faqs: [
      { q: 'Is there anything for couples locally?', a: 'General counselling exists in Prince George. Structured couples work with specific training is less reliably available, which is usually the gap people are trying to fill.' },
      { q: 'How do we start?', a: 'A free 15-minute video call, either together or one of you first. Both are ordinary ways to begin.' },
    ],
  },
  {
    city: 'prince-george', service: 'emdr-therapy',
    angle: 'EMDR in northern BC has meant a flight south, an intensive, and a long gap before the next one.',
    body: [
      'Where northern residents have accessed EMDR at all, the shape has usually been travel-based: a trip to the Lower Mainland, work compressed into a few days, then months before the next opportunity. That is a considerable commitment and a structure the modality does not particularly want.',
      'EMDR benefits from a predictable interval — processing, then time to settle, then more. Delivered remotely, a northern client gets the ordinary weekly or fortnightly rhythm rather than an intensive built around flight availability.',
    ],
    faqs: [
      { q: 'Is remote EMDR established practice?', a: 'Yes. Remote protocols are well established, with bilateral stimulation delivered on screen or by self-administered tapping.' },
      { q: 'What if my connection drops mid-session?', a: 'It is agreed in advance what happens — normally a phone call to finish, and never leaving a session unresolved because of a technical failure.' },
    ],
  },
  {
    city: 'prince-george', service: 'depression-counselling',
    angle: 'Northern winters are long enough that seasonal depression is a structural feature of the year, not an occasional event.',
    body: [
      'Prince George gets substantially less winter daylight than the Lower Mainland, over a longer stretch. For a meaningful number of people that produces a reliable annual pattern, and the months when it is worst are the months when travelling anywhere is least appealing.',
      'A course of counselling that depends on leaving the house in a northern January has an obvious weak point. Removing that requirement is what keeps the sequence intact through exactly the period it most needs to be intact.',
    ],
    faqs: [
      { q: 'Is this seasonal affective disorder or depression?', a: 'They overlap, and telling them apart matters less at the start than working out what is happening and what helps. A physician is the right person for the medical side.' },
      { q: 'Can I start in the winter when it is worst?', a: 'Yes, and that is when most people do. Starting while it is difficult is sensible rather than bad timing.' },
    ],
  },
];

/** Cities that carry paired pages. Every one must exist in cityContexts. */
export const PAIRED_CITIES = cityContexts.map((c) => c.slug);

export const getPair = (city: string, service: string) =>
  pairs.find((p) => p.city === city && p.service === service);

export const pairsForCity = (city: string) => pairs.filter((p) => p.city === city);
export const pairsForService = (service: string) => pairs.filter((p) => p.service === service);

export const cityFor = (slug: string): CityContext | undefined =>
  cityContexts.find((c) => c.slug === slug);

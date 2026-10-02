import type { DepthSection } from './depth';
import { fallbackFee } from '@/lib/cliniko-catalog';
import { BCACC_COUPLES_FAMILY, FEE_GUIDES_READ } from '@/lib/fee-guides';
import { practitioners } from '@/lib/practitioners';
import { offeredBy } from '@/lib/practice-facts';
import { languagePhrase } from '@/lib/city-service-page';

/* WHAT LANGUAGE COUPLES WORK RUNS IN, FROM THE ROSTER — 1 Oct 2026.
   The Punjabi service page said "couples work is available in Punjabi as
   well" while its own direct answer, and the counsellor who works in Punjabi,
   say she does not offer couples work. Who offers it, and so which languages
   it runs in, is now read from the roster: accepting counsellors who list
   couples-therapy. If that ever includes a Punjabi speaker, the old sentence
   comes back on its own. */
const COUPLES_OFFERING = offeredBy('couples-therapy', practitioners.filter((p) => p.acceptingNewClients));
const COUPLES_LANGUAGE_LINE = COUPLES_OFFERING.some((p) => p.languages.some((l) => l.tag === 'pa'))
  ? 'Sessions run in whichever language suits, including moving between them within a session, and couples work is available in Punjabi as well, which matters when the family conversation being discussed happened in Punjabi.'
  : `Sessions run in whichever language suits, including moving between them within a session. Couples work currently runs in ${languagePhrase(COUPLES_OFFERING)}, so sessions for the two of you together are in one of those; either partner can still have individual sessions in Punjabi alongside them.`;

/* Further sections for the service pages. */
export const depthServices: Record<string, DepthSection[]> = {
  'services/individual-therapy': [
    {
      h2: 'What the first month tends to look like',
      body: [
        'Individual therapy is the least specific thing on this list, which makes it the hardest to describe honestly. What follows is the shape it usually takes rather than a promise about yours.',
        '**Week one** is orientation. Your account, in your order, plus the practical frame: confidentiality and its limits, how sessions run, what you want to be different. Most people talk more than they expected to and leave more tired than they expected to.',
        '**Weeks two and three** are where a working focus emerges, and it is frequently not the one you arrived with. People come in for the job and find the job is the place a much older pattern is currently expressing itself. That is not a bait and switch; it is what happens when someone with training listens to two hours of your life.',
        '**Week four** is usually the first review. What are we aiming at, is the approach right, and how often should we be meeting. If nobody has raised those questions by session five or six, raise them yourself.',
        'A word on what individual therapy is not. It is not advice, and a counsellor who spends sessions telling you what to do about your life has drifted into something else. It is also not a place where you are assessed as a person. The material is patterns and circumstances, not character. And it is not open-ended by default: work with a clear target ends, and ending on purpose is part of it.',
      ],
    },
    /* ANXIETY AND DEPRESSION, ON THE PAGE THEY BOOK INTO — 1 Oct 2026.
       Conditions get no province page (DECISIONS) and both book into
       individual therapy, which ranks at 5.36. Their sections were keyed to
       services/anxiety-counselling and services/depression-counselling, slugs
       with no route, so none had rendered. The online-anxiety cluster (about
       160 impressions, no clicks) lands on a city page at 70; the twenty
       anxiety and depression city pages now link here with these headings. */
    {
      h2: 'Online anxiety counselling in BC',
      body: [
        'Online anxiety counselling is available anywhere in British Columbia as individual therapy: 50-minute sessions by secure video with a Registered Clinical Counsellor, after a free 30-minute consultation, with no referral or diagnosis needed. Every counsellor taking new clients sees anxiety, and [the booking page](/book) lets you choose between them.',
        'For anxiety specifically, online counselling solves a problem the condition itself creates: the appointment is reachable on the days the anxiety says the drive, the waiting room, or the unfamiliar building is too much. Nobody white-knuckles a commute to get help with the thing the commute triggers.',
        'The evidence base for video-delivered anxiety treatment is among the strongest in all of online therapy, structured approaches like CBT translate almost without loss, and the skills-practice between sessions happens in the exact environment the anxiety lives in, which is a quiet advantage over learning calm in an office you will never be anxious in. The [effectiveness guide](/guides/is-online-therapy-as-effective-as-in-person) covers the research; the free consultation is how you test the fit for yourself.',
      ],
    },
    {
      h2: 'Safety behaviours, and why they keep anxiety alive',
      body: [
        'Most people with long-standing anxiety have built a set of small habits that make feared situations tolerable. Sitting near an exit. Carrying water. Having a friend on standby. Over-preparing to a degree nobody asked for. Rehearsing the first sentence of a conversation. Checking something a fourth time.',
        'These are called safety behaviours, and they are the reason people can attend the meeting for years and still be terrified of it. The problem is subtle: they let you into the situation while preventing the situation from teaching you anything. Because you got through it with the water bottle, the water bottle keeps the credit, and the underlying belief that you could not have coped otherwise survives intact.',
        'They also tend to multiply. Each one relieves anxiety slightly, which reinforces it, which makes the next one easier to add. Over a few years this produces a life with a large number of quiet conditions attached to it, none of which felt significant when it was adopted.',
        'A significant part of anxiety work is identifying them, which is harder than it sounds because they are usually experienced as sensible preparation rather than as avoidance. The test is a useful one: *would I still do this if I were not anxious?* Preparing for a presentation is reasonable. Rehearsing it eleven times is not preparation.',
        'Dropping them is done gradually and deliberately, usually alongside graded exposure, and the discomfort of doing so is the mechanism rather than a side effect. The point is to accumulate direct evidence that you got through it and nothing carried you.',
      ],
    },
    {
      h2: 'Reassurance-seeking, the quietest maintaining factor',
      body: [
        'Alongside avoidance, the most reliable maintainer of anxiety is reassurance, and it is far harder to spot, because everyone involved experiences it as support.',
        'It takes several forms. Asking a partner repeatedly whether something is fine. Searching symptoms. Re-reading an email to confirm it was not rude. Checking a lock, a stove, a booking. Asking the same question in slightly different words so it does not sound like the same question.',
        'The mechanism is identical to avoidance: each instance produces immediate relief, and the relief teaches the brain that the check was necessary. Anxiety returns slightly stronger and the interval to the next check shortens. Over a year this produces someone who cannot tolerate uncertainty for more than a few minutes.',
        'It is also corrosive to relationships, in a way neither party usually names. The person providing reassurance is doing something kind that is making things worse, and they typically sense it before they can articulate it, which produces irritation, then guilt about the irritation.',
        'The treatment is to reduce it deliberately rather than eliminate it overnight: agreeing with a partner that they will answer once and not again, extending the interval before checking, and tolerating the discomfort that follows. That discomfort is the mechanism. It falls on its own if nothing intervenes, and demonstrating that repeatedly is what teaches the system it does not need the check.',
      ],
    },
    {
      h2: 'Online depression counselling in BC',
      body: [
        'Online depression counselling is available anywhere in British Columbia as individual therapy: 50-minute sessions by secure video with a Registered Clinical Counsellor, after a free 30-minute consultation, with no referral or diagnosis needed. Every counsellor taking new clients sees depression and low mood, and [the booking page](/book) lets you choose between them.',
        'For depression specifically, online counselling removes the tax the condition itself levies on getting help: the shower-dress-drive-waiting-room sequence that can consume a whole day’s capacity. A session you can attend from the corner of the couch is not a lesser session. It is the one that actually happens during the weeks when the alternative was cancelling.',
        'Video-delivered treatment for depression carries one of the stronger evidence bases in online therapy, and behavioural approaches adapt naturally: the work happens in the environment where the patterns live. The honest caveat runs the other way, where isolation is a driver, sessions should be a bridge back toward the world, not a reason never to re-enter it, and a decent counsellor holds that line deliberately. The [effectiveness research](/guides/is-online-therapy-as-effective-as-in-person) covers the evidence in full.',
      ],
    },
    {
      h2: 'Why activity comes before motivation',
      body: [
        'The most counter-intuitive thing about treating depression is the sequence. Everyone assumes motivation comes first and action follows. In depression that order does not return on its own, and waiting for it is the trap the condition sets.',
        'What happens instead is a downward loop with a simple structure. Low mood removes the desire to do things. Doing less removes the sources of reward, contact and meaning that were propping mood up. Mood drops further. Doing less becomes easier to justify. Nobody in that loop is being lazy; the loop is a feature of the condition rather than of the person.',
        'The intervention: behavioural activation: inverts the assumption. Activity is scheduled in advance, in small specific amounts, and performed regardless of how you feel on the day. Not as discipline, but because doing the thing is what generates the mood change, rather than the other way round.',
        'It works best when the activities are chosen for two properties rather than enjoyment: **mastery** (a sense of having accomplished something, however small) and **connection** (involving another person). Enjoyment is unreliable early on, because anhedonia flattens it, which is why "do things you enjoy" is such useless advice to someone who currently enjoys nothing.',
        'The scale matters. Ten minutes outside is a legitimate target. A gym membership is not, at the start, because failing it produces evidence against yourself and that evidence is expensive. Targets get raised as capacity returns.',
        'And where depression is severe enough that even this is not accessible, that is a signal to involve a physician alongside the counselling rather than to try harder: see [therapy, medication, or both](/compare/therapy-medication-or-both).',
      ],
    },
    {
      h2: 'The thinking patterns that come with it',
      body: [
        'Depression changes cognition in specific and recognisable ways, and knowing the shapes helps, because it converts a set of apparently self-evident conclusions into symptoms.',
        '**Overgeneralisation.** One instance becomes a rule. A single awkward conversation becomes evidence about your whole social competence. The give-away is the words always and never.',
        '**Discounting anything positive.** Good outcomes get reclassified as luck, timing, or other people being kind. This is why encouragement does not land. It is processed and discarded before it registers.',
        '**Mind-reading.** Confident conclusions about what other people think, treated as observations rather than as guesses. Almost always negative and almost never checked.',
        '**Fortune-telling.** Certainty about how something will go, which then justifies not attempting it, and the non-attempt is read afterwards as confirmation.',
        '**Personalising.** Assuming responsibility for outcomes with many causes, including other people\'s moods.',
        'The clinical point is not that these thoughts are irrational. It is that depression makes them feel like perception rather than interpretation. They arrive with the weight of an observation. Learning to catch them as they happen, write them down and check them against evidence is unglamorous, repetitive, and among the better-evidenced interventions available.',
      ],
    },
  ],

  'services/couples-therapy': [
    /* THE QUERY WITH BOOKING INTENT GETS A HEADING ON THE PAGE THAT CAN BOOK
       IT — 1 Oct 2026. Search Console 26 Sep: "gottman method counsellor
       british columbia" draws 23 impressions at 26.65, and "gottman method
       marriage counselling british columbia" 28 at 35.96. The Gottman guide
       sits at 8.43 for its cluster, but those two queries match this page
       (25.99) and the EFT comparison (25.18), and neither page had a heading
       that said what the searcher typed. This section does, and the guide
       and the comparison now link to it with the heading as the anchor.
       It says what the practice does and no more: informed by the method,
       delivered by a Registered Clinical Counsellor, online, in BC. No
       certification level is claimed because none is on the roster for the
       counsellor taking couples bookings, and no outcome is promised. */
    {
      h2: 'Gottman-informed couples counselling in BC',
      body: [
        'Plainly, what this is: couples counselling that uses the structure and the tools of the Gottman Method, delivered by secure video to couples anywhere in British Columbia by a Registered Clinical Counsellor registered with the BC Association of Clinical Counsellors. "Gottman-informed" is the accurate phrase. The method is a body of training rather than a licence, and the regulated credential underneath it is the RCC designation, which is what you are entitled to check.',
        'What that looks like in practice is the assessment-first structure described above: a joint session, an individual session with each partner, the questionnaires, and then a treatment plan agreed with both of you. Sessions are 50 minutes, with a longer extended option, at a time the two of you can actually both make, from one couch or from two cities. Both partners are welcome on the free 30-minute consultation, and that call is the right place to ask how the counsellor was trained and how much of their work is with couples.',
        'If it is specifically Emotionally Focused Therapy you are after, this is not the practice for it, and the [Gottman vs EFT comparison](/compare/gottman-method-vs-eft-for-couples) says so rather than pretending otherwise. For the method itself, the research behind it and what the Four Horsemen are, [the guide to how the Gottman Method works](/guides/how-the-gottman-method-works) is the longer read.',
      ],
    },
    {
      h2: 'The rules that make the room usable',
      body: [
        'Couples work only functions if the session is safer than the kitchen argument, and that safety comes from structure rather than goodwill. A few working agreements do most of the load.',
        '**No adjudication.** The counsellor will not decide who is right, and asking is understandable and unproductive. The target is the pattern between you, which neither of you controls alone and both of you maintain.',
        '**Speak for yourself.** "I felt dismissed" is workable. "You always dismiss me" invites a defence and the next twenty minutes disappear into whether "always" is accurate. This is a skill, it feels artificial for about three sessions, and then it stops feeling artificial.',
        '**Nothing said in an individual session gets carried into the joint room** without agreement. That is what makes the individual sessions honest, and it occasionally means a counsellor holds something they cannot use yet.',
        '**Either partner can call a break.** Physiological flooding is real and measurable, and nothing therapeutic happens above a certain level of arousal. A twenty-minute break announced in advance is a clinical intervention, not an avoidance of one.',
        '**No litigating between sessions.** The single most common way couples work stalls is the fight on the drive home, where whatever was said in session gets used as ammunition. Agreeing not to do that is worth more than any technique.',
        'None of this requires either of you to be calm, agreeable or fair-minded on arrival. It requires both of you to be willing to work inside a structure, which is a much lower bar and a much more realistic one.',
      ],
    },
    /* Cost and coverage, 1 Oct 2026. "online couples therapy cost" and
       "free couples counselling surrey" reach this page and no section
       answered them. Fees from the catalogue; coverage plan-dependent. */
    {
      h2: 'How much does couples counselling cost in BC?',
      body: [
        /* Market range first, 1 Oct 2026: the answers cited for couples
           cost lead with one, and this page (150 impressions at 26, 0 clicks
           on 26 Sep) led with the practice's fee alone. */
        `The BC Association of Clinical Counsellors’ 2026 fee guide recommends ${BCACC_COUPLES_FAMILY.range} per 50 minutes for couples and family counselling with a Registered Clinical Counsellor; that is the association’s recommendation, read ${FEE_GUIDES_READ}, and practitioners set their own fees.`,
        `Couples counselling here is ${fallbackFee('Couples Counselling')} for a 50-minute session, or ${fallbackFee('Couples Extended')} for the 110-minute extended format, after a free 30-minute consultation that both partners can join. There is no GST on counselling by a Registered Clinical Counsellor in BC.`,
        'MSP does not cover private couples counselling. Whether an extended health plan reimburses couples sessions depends on the plan: some that list Registered Clinical Counsellors include them, and some exclude relationship counselling or limit it, so read the wording before the first paid session. Each session produces one receipt, in the name of the partner who claims it.',
        `If cost rules private sessions out, community agencies offer sliding-scale and sometimes free couples counselling, and [low-cost counselling in BC](/resources/low-cost-counselling-bc) lists where to look. If it does not, [book the free consultation](/book?with=camille-granda&for=couples#calendar) with the counsellor who takes couples work, and ask about the extended format there.`,
      ],
    },
  ],

  'services/emdr-therapy': [
    {
      h2: 'Who EMDR is not the first choice for',
      body: [
        'EMDR has strong evidence for post-traumatic stress and it is not a general-purpose therapy, so being clear about the edges matters more than listing what it treats.',
        'It is generally **not the first move where stabilisation has not happened**. Someone in an ongoing dangerous situation, in active crisis, or without reliable ways to regulate themselves is not well served by opening a memory. The preparation phase exists precisely for this, and where it needs to take two months, it takes two months.',
        'It is **not usually the right tool for a difficulty with no traumatic memory attached to it**. A decision you are stuck on, a communication problem, a career question. Those are ordinary therapy, and using a trauma protocol on them is a category error.',
        'It requires **caution with dissociation.** Significant dissociative presentations need assessment and a modified approach rather than a standard protocol, and a counsellor who does not screen for this before starting is not being careful.',
        'It also sits alongside rather than instead of medical care. Where substance use is active, where a medication is being adjusted, or where an unassessed physical condition may be contributing, sequencing matters, and a counsellor should say so rather than proceed.',
        'Finally, it is not the only effective trauma treatment, and anyone presenting it as uniquely powerful is overselling. Trauma-focused cognitive approaches have comparable evidence, and the better question is which suits you, see [CBT vs EMDR for trauma](/compare/cbt-vs-emdr-for-trauma).',
      ],
    },
    /* Cost, 1 Oct 2026. BC competitors rank dedicated EMDR cost pages and
       this page never said what EMDR costs. Fees from the catalogue; no
       session count and no outcome promised. */
    {
      h2: 'How much does EMDR therapy cost in BC?',
      body: [
        `EMDR here is ${fallbackFee('Individual Counselling')} for a weekly 50-minute session and ${fallbackFee('EMDR Intensive')} for the 90-minute intensive, and the first 30-minute consultation is free. There is no GST on counselling by a Registered Clinical Counsellor in BC.`,
        'MSP does not pay for private EMDR. It is claimed on extended health exactly like any other session with a Registered Clinical Counsellor, so whether your plan reimburses it, and how much of the annual maximum each session uses, is plan-dependent. An intensive uses more of a yearly maximum per session than a weekly appointment, which is worth checking before choosing that format.',
        `How many sessions EMDR takes varies too widely for an honest average: preparation alone can be two sessions or two months, and a single recent event is different work from something that began in childhood. Progress should be reviewed with you openly rather than sold as a package. [Intensive or weekly EMDR](/compare/emdr-intensive-vs-weekly-emdr) compares the two formats, and the [free consultation](/book?with=camille-granda#calendar) is the place to ask about yours.`,
      ],
    },
    /* ONLINE TRAUMA THERAPY, ON THE PAGE THAT TREATS IT — 1 Oct 2026.
       The "online trauma therapy" cluster (about 290 impressions a month at
       82-89, no clicks) lands on /online-counselling/vancouver/trauma-therapy,
       and the three trauma sections written for this site were keyed to
       services/trauma-therapy, a slug with no route, so none of them had ever
       rendered. Trauma is a condition that books into EMDR here (DECISIONS:
       no province-level trauma page), so they live on the EMDR page under a
       heading that says what the searcher typed, and the ten trauma city
       pages link to it with that phrase. */
    {
      h2: 'Online trauma therapy in BC, with and without EMDR',
      body: [
        'Trauma therapy is available online anywhere in British Columbia, by secure video with a Registered Clinical Counsellor, and EMDR is one route through it rather than the only one. Where a specific memory keeps intruding, EMDR is often the centre of the work; where the difficulty is more about regulation, safety and getting through the present, trauma-informed counselling without reprocessing can be the better start, and most people need some stabilisation before either. Which of those fits is what the [free 30-minute consultation](/book?with=camille-granda#calendar) is for.',
        'Trauma therapy over secure video is an established practice, not a pandemic improvisation. The structured trauma protocols: EMDR with on-screen or self-administered bilateral stimulation, cognitive processing work, stabilisation and resourcing, all adapt to video, and the [research on video-delivered therapy](/guides/is-online-therapy-as-effective-as-in-person) includes trauma-focused work specifically.',
        'Two things matter more online than in a room, and both are manageable. The first is your space: trauma work needs privacy and a plan for the hour after the session, not a car in a work parking lot before a shift. The second is pacing, which is a clinical skill rather than a format property: a trauma therapist who rushes is a problem in any medium, and one who paces well loses nothing over video. For some people the screen genuinely helps: being in your own home, with your own exits, changes what feels sayable.',
        'And where the work keeps being cut short by the standard hour. A target memory that takes twenty minutes just to access. The [90-minute EMDR intensive](/compare/emdr-intensive-vs-weekly-emdr) exists for exactly that arithmetic, once stability is in place.',
      ],
    },
    {
      h2: 'Phase one, which is most of the work',
      body: [
        'Trauma therapy is usually described in three phases: stabilisation, processing, integration, and the widespread assumption is that phase two is where the treatment happens. In practice phase one is where most of the time goes, and skipping it is the single most common way this work goes wrong.',
        'Stabilisation is not preamble. It is the deliberate construction of capacity: reliable ways to come back from high arousal, ways to come back from numbness, an ability to notice which state you are in before it is total, and enough external stability that a hard session does not have nowhere to land.',
        'What that looks like in sessions is often unglamorous: practising orientation to the room, tracking body signals, building a repertoire of things that reliably shift your state, and identifying what to do in the forty-eight hours after difficult material. It can feel like nothing is happening. It is the part that makes the rest survivable.',
        'The signal that phase one has done its job is specific: you can bring a difficult subject partway up, notice it happening, and come back down within the session, without either flooding or shutting down. That is the threshold for opening anything.',
        'People frequently want to skip ahead, particularly if they have waited a long time to start. A counsellor who agrees to that is not being responsive; they are increasing the chance you leave a session worse than you arrived and learn that the subject is dangerous. Pacing here is a clinical decision made with you, and it is negotiable in its details but not in its existence.',
      ],
    },
    {
      h2: 'Signs the pacing is wrong',
      list: [
        { label: 'You leave sessions unable to function', detail: 'Feeling stirred for a few hours is expected. Losing the rest of the day, repeatedly, means too much is being opened relative to current capacity.' },
        { label: 'You dread sessions rather than find them hard', detail: 'A meaningful distinction. Difficult is normal; dread that builds through the week suggests the container is not holding.' },
        { label: 'Sessions end abruptly at the hard part', detail: 'A well-run trauma session reserves the last ten to fifteen minutes for closing down. Finishing mid-material and sending you out is a structural problem, not a scheduling accident.' },
        { label: 'Symptoms are worsening over weeks, not days', detail: 'A temporary increase after opening something is expected. A sustained escalation across a month is a signal to slow down and rebuild stabilisation.' },
        { label: 'You are dissociating in sessions', detail: 'Going blank, losing time, watching from outside. It means the work has moved outside the window of tolerance and should be paused and reoriented rather than pushed through.' },
        { label: 'You have started using something to get through', detail: 'An increase in drinking or anything else timed around sessions is the clearest signal that the pace is exceeding capacity. Say it. It changes the plan rather than ending it.' },
      ],
    },
  ],

  'services/punjabi-counselling': [
    {
      h2: 'What changes when the session runs in Punjabi',
      body: [
        'The practical difference is larger than "convenience", and it shows up in three specific places.',
        '**Emotional vocabulary does not translate cleanly.** A great deal of what people bring to counselling was originally encoded in a particular language. The exact phrasing a parent used, the specific weight of an obligation, the joke that was not a joke. Rendering that into English while simultaneously feeling it is genuinely demanding cognitive work, and it flattens the material. People frequently notice they are describing an event rather than being in it.',
        '**Context does not have to be built from scratch.** Explaining why a decision that looks straightforward from outside is not straightforward inside a family can take two or three sessions with a counsellor who does not share that context. Those are sessions you have paid for and spent on background rather than on the difficulty itself.',
        '**Code-switching is itself information.** Bilingual clients often move between languages at particular moments: English for the analytical account, Punjabi for the parts with more feeling attached, or the reverse. Where that happens is clinically useful, and it requires a counsellor who can follow both.',
        'A necessary caveat: shared language is not the same as shared experience, and shared background is not the same as knowing your family. Assumptions about what a particular arrangement means, or what a family expects, get checked out loud rather than acted on. The advantage is that the checking starts from a much closer position.',
        COUPLES_LANGUAGE_LINE,
      ],
    },
    /* Folded in 1 Oct 2026 from services/south-asian-mental-health, a slug
       with no route since that page was consolidated here. */
    {
      h2: 'The specific binds that come up most',
      list: [
        { label: 'Obligation that is genuinely reciprocal', detail: 'Much popular advice treats family obligation as a boundary problem to be dismantled. In families where care ran in both directions, and where parents made real sacrifices, that framing is both inaccurate and insulting. The workable question is which obligations you endorse and what they cost, not how to have fewer.' },
        { label: 'Being the outcome of a migration', detail: 'Carrying a family\'s hopes is not a metaphor when a specific set of people gave up a specific life so that you would have this one. It produces achievement, and it produces a version of failure that feels like a debt unpaid.' },
        { label: 'Reputation as a shared asset', detail: 'Where a family\'s standing is genuinely collective, a personal decision is not a personal decision. That is a real constraint rather than a distortion, and it is not solved by being told to stop caring what people think.' },
        { label: 'Mental health as a family exposure', detail: 'The reluctance is frequently not about stigma in the abstract but about a concrete concern: what it would mean for a sibling\'s prospects, or for how the family is regarded. Naming that specifically makes it discussable.' },
        { label: 'Two sets of expectations at once', detail: 'Meeting a Canadian workplace\'s expectations about assertiveness and a family\'s expectations about deference, daily, without either being wrong. That is exhausting in a way neither context recognises.' },
        { label: 'Grief across distance', detail: 'Losing someone in another country, unable to be present, and arriving late to a mourning that has already happened without you.' },
      ],
    },
    {
      h2: 'What cultural competence should and should not mean',
      body: [
        'The phrase gets used loosely enough to be worth defining, because the version that helps and the version that irritates look similar from outside.',
        '**What it should mean** is that the context does not have to be explained from scratch. That you do not spend twenty minutes establishing why a decision that looks straightforward is not. That references land. That a counsellor understands obligation as something other than dysfunction, and does not treat a family structure as a problem to be dismantled.',
        '**What it should not mean** is a counsellor who believes they already know your family. Communities are not uniform, and assumptions about religion, region, migration history, class or generation are frequently wrong in ways that are difficult to correct once stated with confidence.',
        'The working version is closer to cultural humility than cultural expertise: a starting position considerably closer to yours, combined with a habit of checking rather than assuming. In practice that sounds like "in some families that would mean X, is that how it works in yours?" rather than a confident account of your situation.',
        'It also means being able to hold two things at once: that a cultural expectation can be genuinely valuable to you **and** genuinely costly, without a counsellor pushing you toward either abandoning it or accepting it. That is the specific thing people most often report not getting elsewhere.',
      ],
    },
  ],

};

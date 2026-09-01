import type { Guide } from './guides';

/* Second cohort of guides. Kept in its own file purely so neither file becomes
 * unmanageable — lib/guides.ts concatenates the two into one `guides` export,
 * and every consumer (routes, sitemap, hub page) sees a single list. */
export const moreGuides: Guide[] = [
  {
    slug: 'how-long-does-therapy-take',
    title: 'How long does therapy actually take?',
    metaTitle: 'How Long Does Therapy Take? | Westpeak Wellness',
    metaDescription:
      'Why session counts vary so much, what makes therapy shorter or longer, and how to tell whether you are making progress or just attending.',
    eyebrow: 'Guide · Getting started',
    lede:
      'Nobody wants an open-ended commitment to something expensive. The honest answer has a range in it, and the range is explainable.',
    shortAnswer:
      'For a single, clearly defined difficulty, structured therapies are often designed around roughly 8 to 20 sessions. For long-standing patterns, complex trauma, or several things tangled together, it usually takes longer. What no counsellor can honestly do is quote you a number in the first ten minutes — but they should be able to tell you by session three or four what they are aiming at and roughly how long that tends to take.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'first-session-flow',
    figure2: "bc-reach",
    sections: [
      {
        h2: 'Why the honest answer is a range',
        body: [
          'Therapy is not a procedure with a fixed duration. Two people can arrive with the same words — "I have been anxious for a year" — and need different amounts of work, because the anxiety in one case is attached to a specific situation that is about to change, and in the other it is the surface of something twenty years old.',
          'The structured therapies give the clearest signal, because they were built and tested with a defined length. Trials of cognitive behavioural therapy for anxiety and depression have typically run somewhere in the range of 8 to 20 sessions. Trauma-focused protocols are often similar. That is where the commonly quoted numbers come from — they are the shape of the research, not a promise about you.',
          '**What actually determines length** is less mysterious than it sounds: how long the pattern has been running, how many areas of your life it touches, whether your circumstances are stable enough to practise anything, and how much support exists outside the room. None of that is a measure of how difficult a person is. It is a description of the job.',
        ],
      },
      {
        h2: 'What tends to be shorter',
        list: [
          { label: 'One clear, bounded problem', detail: 'A specific phobia, a decision you are stuck on, a single recent event that knocked you sideways. The target is obvious, which means progress is measurable.' },
          { label: 'A recent onset', detail: 'Something that started three months ago has usually not yet reorganised your whole life around it. Patterns that are still forming are easier to interrupt.' },
          { label: 'A stable situation to practise in', detail: 'Between-session practice is where structured therapy does much of its work. If your housing, income and relationships are steady enough to try something different, the work moves faster.' },
          { label: 'A specific outcome you can name', detail: '"I want to drive on the highway again" is a target. "I want to feel better" is a direction. Both are legitimate; the first one finishes sooner.' },
        ],
      },
      {
        h2: 'What tends to take longer',
        list: [
          { label: 'Patterns that formed early', detail: 'Ways of relating learned in childhood have decades of rehearsal behind them. They change, but not on the timeline of a skills course.' },
          { label: 'Complex or repeated trauma', detail: 'Where harm was prolonged and relational, a large part of the work is building capacity before anything is processed. Rushing that stage is the most common way trauma therapy goes wrong. See [trauma therapy](/services/individual-therapy).' },
          { label: 'Several things at once', detail: 'Anxiety plus a difficult relationship plus a job that is making both worse. Each is workable; together they take more sessions, because they keep re-triggering each other.' },
          { label: 'An ongoing situation that has not changed', detail: 'Therapy cannot resolve a stressor that is still happening. Where the situation is fixed for now, the work shifts to surviving it well, which is slower and more open-ended.' },
        ],
      },
      {
        h2: 'How to tell whether it is working',
        body: [
          'The number of sessions matters far less than whether anything is moving. Progress in therapy is rarely a smooth upward line — a fortnight of feeling worse after opening something painful is normal and not, on its own, a sign of failure. Over a two-month horizon, though, you should be able to point at something.',
          'Useful markers, roughly in the order they tend to appear: you understand the pattern better than you did; you notice it happening while it happens rather than afterwards; the recovery time after a bad episode gets shorter; you do one thing you had been avoiding; other people notice before you do.',
          'If none of those has shifted after eight to ten sessions, that is worth raising directly. A good counsellor treats that as information about the plan, not a verdict on you — and changing approach, changing frequency, or referring you elsewhere are all legitimate answers. There is a whole guide on [what to do when therapy is not working](/guides/when-therapy-isnt-working).',
        ],
      },
      {
        h2: 'Weekly, biweekly, or something else',
        body: [
          'Frequency is a real variable, not an administrative detail. Weekly sessions build momentum and are usually recommended at the start and during any intensive piece of work — trauma reprocessing in particular is difficult to do well at a fortnightly pace, because too much of each session is spent re-establishing where you were.',
          'Biweekly can work well once things are stable, when the work is largely about practising something between sessions, or when cost makes weekly unsustainable. Stretching to monthly is usually maintenance rather than treatment, and it is worth naming it as that rather than pretending it is the same thing more slowly.',
          'Cost is a legitimate input to this decision and there is no need to be coy about it. Fewer sessions you can actually afford, spaced deliberately, beats a weekly plan you abandon in week five. The [fees page](/pricing) sets out what a session costs, and [paying for counselling in BC](/resources/msp-vs-extended-health) covers the routes.',
        ],
      },
      {
        h2: 'Ending on purpose',
        body: [
          'Most therapy does not end; it fades out. Someone cancels, reschedules, then stops replying. That is understandable and it costs you something — the review, the consolidation, and the plan for what to do if it comes back.',
          'A deliberate ending takes one session. It covers what changed, what did not, what you now know about your own early warning signs, and what would justify coming back. It also makes returning much easier later, because you are resuming rather than starting over.',
          'You are allowed to end therapy at any time, for any reason, including that you do not want to continue. You do not owe an explanation. Saying it out loud rather than disappearing is worth doing for your own sake more than anyone else\'s.',
        ],
      },
    ],
    midCta: {
      text: 'If you want a realistic estimate for your situation rather than a range from an article,',
      label: 'ask in a free 15-minute consultation',
    },
    faqs: [
      { q: 'Can I do just one session?', a: 'Yes. Some people come for a single consultation to get oriented, get a referral, or ask one specific question. A single session cannot do the work of a course of therapy, but it is a legitimate use of a session and nobody will pressure you into a package.' },
      { q: 'Is it a bad sign if therapy takes a long time?', a: 'No. Length reflects what you are working on, not how well you are doing it. Long-standing relational patterns take longer than a recent, bounded problem — that is a statement about the problem, not about you.' },
      { q: 'What if I run out of insurance coverage partway through?', a: 'Say so early rather than at the end. Knowing the budget changes how the work is planned — what gets prioritised, what frequency makes sense, and what you can carry on with independently. It is a normal conversation and not an awkward one.' },
      { q: 'Do I have to commit to a number of sessions upfront?', a: 'Not here. There is no package, no minimum, and no penalty for stopping. Sessions are booked as you go, and the plan is reviewed rather than assumed.' },
    ],
    sources: [
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/guides/what-to-expect-first-therapy-session', label: 'What happens in a first session' },
      { href: '/guides/when-therapy-isnt-working', label: 'When therapy is not working' },
      { href: '/pricing', label: 'Fees and insurance' },
      { href: '/compare/weekly-vs-biweekly-sessions', label: 'Weekly vs biweekly sessions' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'signs-it-might-be-time-for-therapy',
    title: 'How do you know when it is time for therapy?',
    metaTitle: 'Signs It Might Be Time for Therapy | Westpeak',
    metaDescription:
      'Most people wait far longer than they needed to. The signals worth taking seriously, and why "it is not bad enough" is the wrong test.',
    eyebrow: 'Guide · Getting started',
    lede:
      'Almost nobody arrives at counselling too early. The far more common story is a year or two of waiting for things to get bad enough to count.',
    shortAnswer:
      'There is no threshold you have to cross. The practical test is not "is this bad enough" but "has this been going on longer than it should, and is it costing me things I care about?" If a difficulty has outlasted the situation that caused it, is shrinking your life, or is being managed by avoiding things, that is already sufficient reason — no crisis required.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'anxiety-avoidance-cycle',
    figure2: "first-session-flow",
    sections: [
      {
        h2: 'The wrong test, and why so many people use it',
        body: [
          'The question people actually ask themselves is comparative: *is this bad enough compared to what other people go through?* It is a decent instinct about resources and a terrible instinct about health. Nobody applies it to a knee that has hurt for eight months.',
          'The comparison is also rigged, because you are comparing your inside to everyone else\'s outside. The colleague who seems fine is not a control group. And the people whose difficulties are most visible are not the ones who most need help — often they are the ones with the least energy left for concealment.',
          '**A better test has three parts:** duration, cost, and direction. How long has this been going on? What is it taking from you — sleep, work, patience with people you love, things you used to do? And is it getting better on its own, or has it settled in? A difficulty that is persistent, costly and static does not need to be severe to be worth addressing.',
        ],
      },
      {
        h2: 'Signals that tend to matter',
        list: [
          { label: 'The problem has outlasted its cause', detail: 'The job ended, the relationship ended, the deadline passed — and the state it produced did not lift with it. Stress that persists past its situation has usually stopped being about the situation.' },
          { label: 'Your world is getting smaller', detail: 'Fewer invitations accepted, fewer routes driven, fewer conversations started. Avoidance is quiet and cumulative, and it is usually noticed only in retrospect. This is the single most reliable signal in the list.' },
          { label: 'Sleep has changed and stayed changed', detail: 'Weeks of lying awake rehearsing, or sleeping heavily and waking unrestored. Sleep is one of the first systems to register that something is wrong and one of the last to recover.' },
          { label: 'The same argument, on repeat', detail: 'A conflict that resets rather than resolves — with a partner, a parent, an adult child — usually means the actual subject is not the stated one.' },
          { label: 'People close to you have said something', detail: 'Not one offhand remark. A pattern of the people who know you best independently noticing the same change is worth more than your own read, because your own read has adjusted gradually.' },
          { label: 'Coping has acquired a cost of its own', detail: 'Drinking more, working later, scrolling until 2 a.m., eating in ways that are about regulation rather than hunger. Coping mechanisms are not moral failures; they are information about load.' },
          { label: 'You have already tried the obvious things', detail: 'Exercise, sleep hygiene, a holiday, cutting back caffeine — and it helped for a fortnight. When the reasonable interventions keep not sticking, the problem is probably not the one you have been solving.' },
          { label: 'You keep researching it', detail: 'Reading a guide like this one is itself a data point. People who are genuinely fine do not spend an evening looking up whether they need therapy.' },
        ],
      },
      {
        h2: 'What is not required',
        body: [
          'A surprising number of people rule themselves out on grounds that are not grounds at all:',
        ],
        list: [
          { label: 'A diagnosis', detail: 'You do not need one to begin, and a Registered Clinical Counsellor does not provide one. Most people arriving at counselling have no diagnosis and never acquire one.' },
          { label: 'A referral', detail: 'Private counselling in BC requires no doctor\'s referral. You can book directly.' },
          { label: 'A specific trauma', detail: 'Plenty of people arrive with no single event to point at, only a long accumulation. That is a legitimate reason to come, not a weaker one.' },
          { label: 'A crisis', detail: 'Counselling is not only for emergencies, and using it before an emergency is the cheaper, easier version. If you are in crisis right now, that needs a crisis service — call or text 9-8-8, or 310-6789 in BC.' },
          { label: 'Knowing what you want to work on', detail: '"I do not know why I am here, I just know something is off" is a completely ordinary opening. Working out the question is part of the job.' },
          { label: 'Having tried everything else first', detail: 'Therapy is not a last resort, and treating it as one mostly guarantees you arrive with more to untangle than you would have had a year earlier.' },
        ],
      },
      {
        h2: 'The things that need more than counselling',
        body: [
          'Being honest about the ceiling matters as much as encouraging people through the door. Some situations need something other than, or in addition to, a weekly counselling session.',
          'If you are having thoughts of ending your life, that is a reason to reach out now rather than to book something for next Tuesday — **9-8-8** by call or text, anywhere in Canada, twenty-four hours a day, or **310-6789** for BC Mental Health Support. Immediate danger is **9-1-1**.',
          'Symptoms with a possible physical cause — profound fatigue, significant unexplained weight change, a sudden change in cognition — belong with a physician first, because several medical conditions present convincingly as depression or anxiety. Substance dependence needing withdrawal management, an eating disorder needing medical monitoring, and psychosis all need specialised services rather than general counselling. Saying so is part of a counsellor\'s [stated scope](/standards), and a good consultation will say it rather than take the booking.',
        ],
      },
      {
        h2: 'What the first step actually costs you',
        body: [
          'The gap between deciding to do something and doing it is where most of the delay lives. It helps to know exactly how small the first step is: a free fifteen-minute consultation over secure video, in which you say roughly what is going on and hear how the work would run.',
          'You are not committing to a course of therapy, you are not required to tell the whole story, and deciding afterwards that it is not for you is an entirely normal outcome — including deciding that a different counsellor would suit you better. [What happens in a first session](/guides/what-to-expect-first-therapy-session) covers the stage after that in detail.',
          'The thing most people say afterwards is some version of *I should have done this ages ago*. That is not a sales line; it is what happens when a decision that has been carrying eighteen months of weight turns out to take fifteen minutes.',
        ],
      },
    ],
    midCta: {
      text: 'If most of that list sounded familiar, the next step is smaller than it feels —',
      label: 'book a free 15-minute consultation',
    },
    faqs: [
      { q: 'What if I start and realise I did not need it?', a: 'That is a fine outcome and it happens. A consultation or a first session that concludes "you are handling this, and here is what to watch for" is a useful result, not a wasted one.' },
      { q: 'Do I need to be in crisis to justify booking?', a: 'No — and waiting for a crisis makes the work harder rather than more deserved. Counselling is considerably more effective as prevention than as rescue.' },
      { q: 'I am functioning fine at work. Does that mean I am okay?', a: 'Not necessarily. Functioning is a poor measure, because it is often the last thing to break and the first thing people protect at the cost of everything else. See [high-functioning anxiety](/guides/high-functioning-anxiety).' },
      { q: 'Is it too late if this has been going on for years?', a: 'No. Long-standing patterns take longer to shift than recent ones, but duration does not make them untreatable. Plenty of people begin after a decade of managing.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: '9-8-8 Suicide Crisis Helpline (Canada)', url: 'https://988.ca/' },
    ],
    related: [
      { href: '/guides/high-functioning-anxiety', label: 'High-functioning anxiety' },
      { href: '/guides/what-to-expect-first-therapy-session', label: 'What happens in a first session' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
      { href: '/book', label: 'Book a free consultation' },
      { href: "/tools/stress-check", label: "A reflection on how things have been" },
    ],
  },

  {
    slug: 'what-trauma-actually-means',
    title: 'What does "trauma" actually mean?',
    metaTitle: 'What Trauma Actually Means | Westpeak Wellness',
    metaDescription:
      'The word has stretched to cover everything and therefore nothing. What clinicians mean by trauma, why the event is not the measure, and what follows.',
    eyebrow: 'Guide · Trauma',
    lede:
      'A word that describes both a car crash and a rude email has stopped doing useful work. It is worth reclaiming the distinction.',
    shortAnswer:
      'Clinically, trauma refers less to an event than to what the event did — specifically, to a memory that did not get filed properly and so keeps behaving as though it is still happening. That is why two people can go through the same thing and only one is still carrying it, and why "it was not that bad" is not evidence of anything.',
    updated: '2026-08-08',
    readMinutes: 8,
    figure: 'window-of-tolerance',
    figure2: "first-session-flow",
    sections: [
      {
        h2: 'The event is not the measure',
        body: [
          'The most persistent misunderstanding about trauma is that it is a property of events — that some experiences are traumatic and others are not, and you can rank them. It is an intuitive model and it does not match what clinicians see.',
          'Two people in the same collision: one is shaken for a fortnight and then it recedes into an unpleasant memory; the other cannot drive eighteen months later. Same event, different outcome. The difference is not resilience as a character trait. It is what happened to the memory afterwards — whether it got processed into ordinary autobiographical storage, or stayed live.',
          'That is why **the most useless question you can ask yourself is whether what happened to you was bad enough.** People routinely disqualify themselves on those grounds, comparing their experience to something worse and concluding they have no claim on the word. Meanwhile they cannot sleep. The presence of the symptoms is the information; the ranking of the event is not.',
        ],
      },
      {
        h2: 'What a trauma memory does differently',
        body: [
          'An ordinary difficult memory has a past tense. You can bring it to mind, feel something about it, and put it down. It has a beginning and an end, it sits in a timeline, and recalling it does not recruit your whole body.',
          'A traumatic memory often does not behave that way. It arrives uninvited, triggered by something apparently unrelated — a smell, a tone of voice, a particular quality of light. It comes in fragments rather than narrative, more often sensory than verbal. And it arrives without a past tense: the body responds as though the threat is present, because as far as the nervous system is concerned, it is.',
          'This is the reason insight alone frequently fails to shift trauma. You can know with complete certainty that you are safe and still have a body that has not received the update. Approaches like [EMDR](/services/emdr-therapy) exist precisely because the problem is one of storage rather than understanding.',
        ],
      },
      {
        h2: '"Big T" and "little t" — a useful distinction, misused',
        body: [
          'The informal shorthand distinguishes "Big T" trauma — the events everyone would recognise: assault, serious accident, disaster, combat, sudden bereavement — from "little t" trauma, the accumulated smaller experiences that were not individually catastrophic but were relentless: chronic criticism, emotional neglect, growing up around unpredictability, being the only person in the room who looked like you.',
          'The distinction is useful for describing shape. It is frequently misused as a hierarchy, as if "little t" meant "less real". It does not, and the accumulated variety is often harder to work with — not despite being smaller, but because it has no single event to point at and because it usually shaped a person during development rather than interrupting an already-formed one.',
          'Where the harm was prolonged, relational and early, clinicians tend to speak of **complex trauma**, which typically shows up in identity, emotional regulation and expectations of other people rather than in flashbacks to a specific scene. [Intergenerational trauma](/guides/intergenerational-trauma-explained) sits in this territory too, where what is transmitted is not the event but the adaptation to it. Where the family language is Punjabi, that adaptation is often easier to describe in it than in English — there is a [full page in Punjabi (ਪੰਜਾਬੀ)](/punjabi) covering how sessions work.',
        ],
      },
      {
        h2: 'What it tends to look like from the outside — and inside',
        list: [
          { label: 'Hypervigilance', detail: 'A threat-detection system that never fully powers down. Sitting facing the door, tracking exits, reading small changes in tone. Exhausting precisely because it is skilled.' },
          { label: 'Numbness and distance', detail: 'The less-discussed half. Flat, far away, watching yourself from outside — hypoarousal rather than hyperarousal, and frequently mistaken for coping well.' },
          { label: 'Reactions out of proportion to their trigger', detail: 'A response that is enormous relative to the event that set it off. From inside it does not feel disproportionate at all, because the response belongs to something else.' },
          { label: 'Avoidance that has quietly reorganised a life', detail: 'Routes not taken, subjects not raised, relationships kept at a manageable depth. Rarely experienced as avoidance; usually experienced as preference.' },
          { label: 'Sleep that will not repair', detail: 'Difficulty falling asleep because the day finally goes quiet, or waking at the same hour, or dreams that are not narratively about the event but carry its feeling.' },
          { label: 'A body with symptoms and no findings', detail: 'Chronic tension, gut trouble, headaches, unexplained pain. Worth investigating medically — and worth knowing that a clear scan does not mean nothing is happening.' },
        ],
      },
      {
        h2: 'Why "just talk about it" can make things worse',
        body: [
          'There is a persistent folk belief that trauma is resolved by describing it in enough detail. Sometimes that helps. Sometimes it re-floods a nervous system that had no capacity to tolerate the flooding, and the person leaves the session worse than they arrived, having learned that opening the subject is dangerous.',
          'This is why competent trauma therapy is sequenced, and why the sequence is not optional. The first phase builds capacity — regulation skills, grounding, resources you can actually reach for under load. Only then is the memory approached, and even then in controlled amounts with a deliberate close so you leave settled rather than raw.',
          'The [window of tolerance](/services/individual-therapy) is the working concept here: the band of arousal in which you can feel something and still think about it. Outside that band, the thinking part of the brain is not fully online, and nothing therapeutic is happening no matter how much is being said. Widening the window is a large part of the treatment.',
          'Sequencing is also why the length of a session sometimes becomes the constraint rather than the material. Approaching a memory, working with it, and closing properly is a lot to fit into fifty minutes once twenty of them have gone into settling — which is the arithmetic the [90-minute EMDR intensive](/services/emdr-therapy) exists for, and only once the capacity phase is genuinely in place. It is a format decision, not a shortcut past the sequence.',
        ],
      },
      {
        h2: 'What recovery does and does not mean',
        body: [
          'Trauma treatment does not delete memories, and any approach promising that is misrepresenting itself. What changes is the memory\'s grip: it stops arriving uninvited, it stops recruiting the whole body, and it acquires a past tense. You can think about it on purpose and stop thinking about it on purpose.',
          'Most people describe the change less as forgetting and more as demotion — the thing that used to run the day becomes a thing that happened. Some meaning often gets rewritten along the way, particularly the beliefs formed in the aftermath about fault, safety and what kind of person you are.',
          'It is also worth saying plainly that not everyone who has been through something terrible develops post-traumatic difficulties, and needing no treatment is not a failure to take it seriously. The point of a page like this is not to persuade anyone they are damaged. It is to make sure that someone who *is* still carrying something does not talk themselves out of help on the grounds that it was not bad enough.',
        ],
      },
    ],
    midCta: {
      text: 'If something you thought you had dealt with is still shaping how you live,',
      label: 'a free 15-minute consultation is a low-stakes place to start',
    },
    faqs: [
      { q: 'Do I have to describe what happened in detail?', a: 'No. Effective trauma work does not require a full narrative account, and several approaches deliberately require little verbal detail. You control what is said and when.' },
      { q: 'Can something be trauma if I do not remember it clearly?', a: 'Yes. Fragmented, patchy or largely absent memory is common rather than disqualifying — it is one of the things a nervous system does under extreme load.' },
      { q: 'Is trauma therapy going to make me feel worse?', a: 'Approaching difficult material can be temporarily hard, which is exactly why sequencing and pacing are clinical decisions rather than preferences. Well-conducted trauma therapy builds capacity before it opens anything, and closes each session deliberately.' },
      { q: 'What is the difference between trauma and PTSD?', a: 'Post-traumatic stress disorder is a formal diagnosis with defined criteria, made by a qualified professional. Trauma is the broader phenomenon. Many people carry trauma responses without meeting the criteria for the diagnosis, and they are still treatable.' },
    ],
    sources: [
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'World Health Organization — ICD-11 browser', url: 'https://icd.who.int/browse11/l-m/en' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Trauma therapy' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy' },
      { href: '/guides/intergenerational-trauma-explained', label: 'Intergenerational trauma' },
      { href: '/compare/cbt-vs-emdr-for-trauma', label: 'CBT vs EMDR for trauma' },
      { href: '/services/emdr-therapy', label: 'EMDR intensives — the 90-minute format' },
      { href: '/glossary', label: 'Counselling glossary' },
      { href: "/tools/stress-check", label: "A reflection on how things have been" },
    ],
  },

  {
    slug: 'questions-to-ask-a-therapist',
    title: 'Questions worth asking a therapist before you book',
    metaTitle: 'Questions to Ask a Therapist | Westpeak Wellness',
    metaDescription:
      'A consultation goes both ways. The questions that actually tell you something, the answers to be wary of, and what you never have to justify.',
    eyebrow: 'Guide · Choosing a counsellor',
    lede:
      'Most people treat a first consultation as an audition they are attending. It is closer to an interview they are conducting.',
    shortAnswer:
      'Ask what approach they would use for your situation and why, how they would know it was not working, what their limits are, and what the money looks like. The quality of the answers matters more than the content: a counsellor who can explain their reasoning plainly, name what they do not do, and tolerate being questioned is showing you how the work will go.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'designations-bc',
    figure2: "first-session-flow",
    sections: [
      {
        h2: 'Why this feels awkward, and why it should not',
        body: [
          'Asking a health professional to justify their approach feels presumptuous to many people, particularly anyone raised to treat professionals as authorities. It is worth getting past, for a practical reason: the working relationship between you and a counsellor is one of the more consistent predictors of whether therapy helps at all, across every method that has been studied.',
          'That relationship starts in the consultation. How a counsellor handles being asked a direct question — whether they answer it, deflect it, or subtly make you feel difficult for asking — is a preview of how they will handle you saying "this is not working" in session nine.',
          'You are also, straightforwardly, buying something. Nobody thinks twice about asking a contractor what they would do and why.',
        ],
      },
      {
        h2: 'Questions about the work itself',
        list: [
          { label: '"What approach would you use for something like this, and why that one?"', detail: 'The best answer names something specific and explains the fit. A vague "I am integrative and I tailor to the client" is not wrong, but on its own it tells you nothing — ask what tailoring would look like for your situation.' },
          { label: '"How would we know if it was working?"', detail: 'You are listening for something checkable. A counsellor who has thought about this will describe markers you would both be able to see, not just "you will feel better".' },
          { label: '"How would we know if it was not working, and what would you do then?"', detail: 'The more revealing version. A good answer includes changing approach and referring you elsewhere. Anyone who cannot imagine their approach failing is a risk.' },
          { label: '"What do you not work with?"', detail: 'Everyone has limits. A counsellor who claims none is either inexperienced or not being straight with you. Real answers here build more confidence than a long list of specialisms.' },
          { label: '"How much of this happens between sessions?"', detail: 'Structured therapies rely heavily on between-session practice. Knowing that upfront prevents the mismatch where you expected to talk and are being handed a worksheet.' },
          { label: '"What is your experience with people in my situation?"', detail: 'Reasonable, and reasonable to expect an honest answer including "less than you might want". Honesty here is more valuable than confidence.' },
        ],
      },
      {
        h2: 'Questions about the practical shape',
        list: [
          { label: '"What does a session cost, and is that the whole cost?"', detail: 'Session fee, cancellation policy, whether letters or forms are charged separately, whether the rate changes. No surprises later.' },
          { label: '"Do you direct-bill, or do I pay and submit?"', detail: 'A material difference to cash flow. Where a practice does not direct-bill, you pay the practice directly and claim reimbursement yourself — see [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling).' },
          { label: '"Will my insurer cover your designation specifically?"', detail: 'The critical detail people miss. Plenty of plans cover a psychologist and not a Registered Clinical Counsellor, or vice versa. Confirm the designation with your insurer, not just the dollar amount.' },
          { label: '"How often would we meet, and for how long is that likely to run?"', detail: 'Expect a range with reasoning rather than a number. Be wary of anyone quoting a precise session count before they know you.' },
          { label: '"What is your availability, and what happens if I need to reschedule?"', detail: 'Evening availability, waitlists, and cancellation terms are all easier to establish now than to discover in month two.' },
          { label: '"What happens between sessions if things get bad?"', detail: 'Almost no private practice offers 24-hour crisis cover, and it is important to know that clearly rather than to assume otherwise. A good answer names the crisis services instead.' },
        ],
      },
      {
        h2: 'Questions about credentials — and how to check the answers',
        body: [
          'In British Columbia today, "counsellor" and "therapist" are not protected titles, so the letters after a name carry more information than the job title does. Ask what designation someone holds and which body holds it, then verify it independently — every regulator and association maintains a public register, and you do not need anyone\'s permission to look.',
          'A [Registered Clinical Counsellor (RCC)](/compare/rcc-vs-psychologist-vs-social-worker-bc) is registered through the BC Association of Clinical Counsellors. A Registered Psychologist is regulated by the College of Health and Care Professionals of BC. A Registered Social Worker is regulated by the BC College of Social Workers. The practical significance of any of them is that there is somewhere to complain.',
          'It is also fair to ask about training in a specific method. "EMDR-trained" covers a wide range, and asking what level of training someone completed is a normal question that a properly trained clinician will answer without defensiveness.',
        ],
      },
      {
        h2: 'Answers worth being wary of',
        list: [
          { label: 'A guarantee of any kind', detail: 'Nobody can promise an outcome, and offering one breaches the advertising standards counsellors work under. See [standards and accountability](/standards).' },
          { label: 'Pressure to commit to a package', detail: 'Pre-paid blocks of sessions serve the practice\'s cash flow. Being able to stop at any point without penalty serves you.' },
          { label: 'Dismissing your question', detail: '"Do not worry about the details, just trust the process" during a consultation is a preview, and not a good one.' },
          { label: 'Claiming to treat everything', detail: 'A list of twenty specialisms usually means none. Depth is more useful than breadth.' },
          { label: 'Discomfort with being asked about fit', detail: 'A counsellor who is fine saying "I might not be the right person for this" is demonstrating exactly the judgement you want.' },
          { label: 'Anything that sounds like a testimonial', detail: 'Client testimonials are prohibited under BCACC advertising standards, because consent given inside a therapeutic relationship is not freely given. A practice showcasing them is telling you something about how it handles rules.' },
        ],
      },
      {
        h2: 'What you never have to explain',
        body: [
          'You do not have to justify choosing not to continue. You do not have to give a reason for preferring a counsellor of a particular gender, language or background — those are legitimate clinical preferences, not fussiness. You do not have to disclose your whole history in a consultation to establish that your reason for calling is valid.',
          'And you are allowed to consult more than one counsellor before choosing. It is normal, it is sensible, and nobody competent will be offended by it. Fit is not something either of you can determine from a website.',
          'If it helps to see how the other side of this conversation runs, [what happens in a first session](/guides/what-to-expect-first-therapy-session) and [how to find a therapist in BC](/guides/how-to-find-a-therapist-in-bc) cover the process end to end.',
        ],
      },
    ],
    midCta: {
      text: 'Every question on this page is fair game in a consultation here —',
      label: 'book a free 15 minutes and ask them',
    },
    faqs: [
      { q: 'Is it rude to ask a therapist about their qualifications?', a: 'No. It is a reasonable question about a professional service, and a registered clinician will answer it directly. Anyone who bristles has told you something useful.' },
      { q: 'Can I talk to more than one counsellor before deciding?', a: 'Yes, and many people do. Consultations are usually free specifically so that fit can be assessed without cost being a barrier.' },
      { q: 'What if I do not know what to ask?', a: 'Describe what is going on and let the counsellor explain what they would do about it. The explanation itself will tell you most of what you need to know.' },
      { q: 'How do I check that someone is actually registered?', a: 'Every regulator and association in BC maintains a public register you can search directly. Ask which body holds the designation, then look it up yourself rather than taking the website\'s word for it.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
      { label: 'BC College of Social Workers', url: 'https://bccsw.ca/' },
    ],
    related: [
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/pricing', label: 'Fees and insurance' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

import type { DepthSection } from './depth';

/* Further sections for the comparison, resource, audience and location pages. */
export const depthOther: Record<string, DepthSection[]> = {
  /* ---------------- comparisons ---------------- */
  'compare/rcc-vs-psychologist-vs-social-worker-bc': [
    {
      h2: 'Three situations where the designation decides it',
      list: [
        { label: 'You need documentation for an employer or insurer', detail: 'Almost all of these processes require a diagnosis, and only a physician, psychiatrist or registered psychologist can provide one. A counsellor cannot, however long you have been working together — which is worth knowing before a deadline rather than after.' },
        { label: 'You want an ADHD, autism or psychoeducational assessment', detail: 'Registered psychologist. Not a counsellor, not a social worker. Costs are substantial and largely uncovered by MSP in private practice; [psychiatry and assessment in BC](/resources/psychiatry-and-assessment-in-bc) sets out the lower-cost routes.' },
        { label: 'Your benefits plan reimburses only one designation', detail: 'The most common practical constraint, and the one people discover after their first invoice. Plans vary considerably: some cover an RCC, some only a psychologist, some both at different rates. Confirm the designation with your insurer before booking anyone.' },
      ],
    },
    {
      h2: 'What the transition to college regulation will change',
      body: [
        'Counselling therapy in British Columbia is being brought under the College of Health and Care Professionals of BC, which already regulates psychologists among other professions. That is a real change rather than a rebranding, and it is worth understanding what it does and does not do.',
        'What it changes: a protected title, meaning only registrants may call themselves by it; a statutory complaints and discipline process backed by legislation rather than by association membership; and mandated entry requirements that apply to everyone practising, not only to those who chose to join a body.',
        'What it does not change: the existing designations remain meaningful in the meantime, and an RCC today is already held to educational requirements, supervised hours, insurance and a published code of ethics with a complaints process behind it. The transition raises the floor for everyone else rather than creating standards where none existed for registrants.',
        'The practical implication for you is unchanged either way. Ask which designation someone holds and which body holds it, then verify it on that body\'s public register — see [how to verify a counsellor in BC](/resources/verify-a-counsellor-in-bc). That advice works before, during and after the transition.',
      ],
    },
  ],

  'compare/individual-vs-couples-therapy': [
    {
      h2: 'Doing both at once, and the trap in it',
      body: [
        'A fair number of people end up in individual and couples work simultaneously, and it can work well. It also has one specific failure mode worth naming in advance.',
        'The trap is using individual sessions to build a case. Where individual work becomes a place to rehearse grievances and gather evidence, it quietly undermines the couples work rather than supporting it — you arrive at the joint session better armed rather than more open. Counsellors watch for this, and it is worth watching for yourself.',
        'The version that helps looks different: individual work on your own contribution to the pattern, on something older that keeps getting triggered inside the relationship, or on a difficulty that is genuinely yours rather than the couple\'s. That reliably makes the joint work go better.',
        'On the practical side, there is a strong argument for the two being done by different counsellors. One clinician holding both roles accumulates individual confidences that cannot be used in the joint room, which constrains the couples work in ways neither partner can see. Where the same counsellor does both, that limitation should be named openly at the start.',
        'And where one partner will not attend at all, individual therapy focused on the relationship is a genuine option rather than a consolation. Changing your own half of a pattern changes the pattern — which is not a guarantee of any particular outcome, and is considerably more leverage than most people assume they have.',
      ],
    },
  ],

  'compare/cbt-vs-emdr-for-trauma': [
    {
      h2: 'How the choice is usually made in practice',
      body: [
        'Both have strong evidence for post-traumatic stress and neither is universally superior, which means the choice comes down to fit rather than ranking. A few considerations do most of the deciding.',
        '**How much you want to talk about it.** Trauma-focused cognitive work involves recounting and examining the event in detail, repeatedly. EMDR requires substantially less verbal description — you hold the memory rather than narrate it. For people who cannot face telling the story, or who have told it many times to no effect, that difference is decisive.',
        '**Whether the problem is a belief or a memory.** Where the lasting damage is in the conclusions drawn afterwards — about fault, safety, or what kind of person you are — cognitive processing approaches target that directly and well. Where the difficulty is a memory that fires in the present regardless of what you understand intellectually, EMDR is usually the more direct route.',
        '**Single incident or accumulated.** Both handle single-incident trauma well. Where harm was prolonged and relational, either approach needs a longer stabilisation phase first, and the choice matters less than the pacing.',
        '**Your appetite for homework.** Cognitive protocols typically involve structured between-session work. EMDR involves less. That is a real preference and a legitimate input.',
        'A good counsellor should be able to explain which they would suggest and why, and should be willing to change if it is not working after a fair trial. If the answer is only "this is what I do", that is information about the practitioner rather than about the methods.',
      ],
    },
  ],

  'compare/therapy-vs-coaching': [
    {
      h2: 'Questions that separate a good coach from a bad one',
      list: [
        { label: '"What training do you have, and with whom?"', detail: 'A specific answer naming a programme and a certifying body is a good sign. Vagueness, or a heavy emphasis on personal experience rather than training, is worth weighting.' },
        { label: '"What do you do if something clinical comes up?"', detail: 'The single most revealing question. A good coach has a clear answer involving referral and a boundary. A coach confident they can handle anything is describing a risk.' },
        { label: '"Do you carry professional insurance?"', detail: 'Not required for coaches in BC, which is exactly why asking is informative.' },
        { label: '"What is your refund and cancellation policy?"', detail: 'Large pre-paid packages with no exit are common in coaching and rare in regulated professions. A structure you cannot leave without loss is built for the provider.' },
        { label: '"Have you worked with something like this before?"', detail: 'Reasonable, and reasonable to expect an honest answer including no.' },
      ],
    },
  ],

  'compare/therapy-medication-or-both': [
    {
      h2: 'What a counsellor can usefully do around medication',
      body: [
        'A counsellor cannot prescribe, adjust or advise on medication. That leaves a useful set of things they can do, and it is worth knowing what they are rather than treating the boundary as a dead end.',
        '**Preparing for the appointment.** Working out what to ask, assembling an accurate timeline, and getting clear on what you actually want from the conversation. Prescriber appointments are short, and arriving organised changes what comes out of them.',
        '**Tracking what changes.** Two weeks of brief daily notes is far better evidence than recollection, and it is exactly what a prescriber needs to judge whether something is working. A counsellor seeing you weekly is well placed to notice changes you have normalised.',
        '**Working through ambivalence.** A great many people are genuinely torn about medication, for reasons that range from side effects to family attitudes to what it would mean about them. That is legitimate session material, and it is not the same as being talked into or out of anything.',
        '**Supporting the adjustment period.** The first weeks on a new medication can be uncomfortable, and the point at which people stop is frequently before it has had a chance to work. Having somewhere to bring that matters.',
        '**Coordinating, with your written consent.** A counsellor and a prescriber can communicate directly, and where both are involved that usually produces better care than two parallel accounts.',
        'What a counsellor should never do is suggest you start, stop or change a dose. If one does, that is a scope violation rather than an opinion.',
      ],
    },
  ],

  'compare/efap-vs-private-counselling': [
    {
      h2: 'Getting the most out of a capped programme',
      body: [
        'If you have six sessions, the difference between using them well and using them badly is substantial, and most of it is decided in the first appointment.',
        '**Name the target in session one.** Short-term work rewards a specific goal. Spending two of six sessions establishing what you are working on is a quarter of the entitlement gone. Arriving with "I want to be able to do X" is worth a great deal.',
        '**Ask about the cap immediately.** Exactly how many sessions, per issue or per year, and what happens at the end. Providers will tell you; people rarely ask, and then discover the boundary at session five.',
        '**Say plainly that the time is limited.** A counsellor who knows they have six sessions works differently from one who assumes an open horizon — more structured, more focused, more likely to give you something to continue with.',
        '**Ask for a written summary at the end.** What was worked on, what helped, what remains. It costs the counsellor ten minutes and it is what turns a handover into a continuation rather than a restart.',
        '**Do not start deep trauma work inside the cap.** It is the one thing genuinely ill-suited to a short-term programme, because the stabilisation phase alone can consume the whole entitlement and stopping midway is worse than not starting. Use the sessions for stabilisation and planning, and do the processing somewhere with continuity.',
      ],
    },
  ],

  'compare/weekly-vs-biweekly-sessions': [
    {
      h2: 'Working out what you can actually sustain',
      body: [
        'The best frequency is the one you will still be attending in three months, and that is an arithmetic question as much as a clinical one. It is worth doing the arithmetic before starting rather than discovering it at session eight.',
        'Take the session fee, decide honestly what you can commit per month without it becoming a stressor of its own, and divide. That number is your real starting frequency. Where extended health covers a portion, check the annual maximum and work out how many sessions it actually funds — plans are usually expressed in dollars rather than sessions, and people consistently overestimate.',
        'Then bring the number to the consultation rather than hiding it. A counsellor who knows the budget can plan around it — prioritising differently, front-loading the work, or building in longer gaps deliberately with something to practise between. A counsellor who does not know will plan for a frequency you cannot maintain, and the work will end abruptly at the worst moment.',
        'It is also worth knowing that intensity can be varied deliberately rather than only reduced. Some people do better with a concentrated block — weekly for eight weeks, then a long gap, then a review — than with the same number of sessions spread thinly across a year. For time-limited budgets that is frequently the better structure, and it is rarely offered unless you ask.',
        'None of this is an awkward conversation. Money determining the shape of treatment is entirely ordinary, and pretending otherwise mostly produces abandoned courses of work.',
      ],
    },
  ],

  /* ---------------- resources ---------------- */
  'resources/bc-extended-health-coverage-for-counselling': [
    {
      h2: 'The exact questions to ask your insurer',
      list: [
        { label: '"Is a Registered Clinical Counsellor an eligible provider under my plan?"', detail: 'Ask about the designation by name, not about "counselling". This is the single question that most often produces a surprise, because many plans cover a psychologist and not an RCC, or vice versa.' },
        { label: '"What is my annual maximum, and when does the year reset?"', detail: 'Plan years frequently do not align with the calendar year. Knowing the reset date can be worth a full year of unused benefit.' },
        { label: '"Is there a per-session cap as well as an annual one?"', detail: 'Some plans reimburse a fixed amount per session below the practitioner\'s fee, which changes your real cost substantially.' },
        { label: '"Do I need a physician referral for reimbursement?"', detail: 'A minority of plans require one even where the profession does not. Finding out afterwards means the claim is denied.' },
        { label: '"Is a receipt sufficient, or do you require a specific claim form?"', detail: 'Some insurers want their own form completed. Establishing this before the first session avoids a scramble later.' },
        { label: '"Does my spouse\'s plan coordinate with mine?"', detail: 'Where both partners have coverage, coordination of benefits can meaningfully increase the total available, and it is almost never volunteered.' },
      ],
    },
  ],

  'resources/msp-vs-extended-health': [
    {
      h2: 'What MSP does cover, and how to reach it',
      body: [
        'It is easy to read "MSP does not cover counselling" and conclude the public system offers nothing. That is not accurate, and the routes it does fund are worth knowing.',
        '**Physician visits are covered,** including appointments specifically about mental health. A family doctor or nurse practitioner can assess, prescribe, and refer, and for a substantial proportion of people that is the appropriate medical route without psychiatry being involved at all.',
        '**Psychiatry is covered,** with a referral from a physician or nurse practitioner. Waits vary widely by region and urgency. Psychiatrists in BC largely provide diagnosis and medication management rather than ongoing psychotherapy, which is a common misunderstanding.',
        '**Health authority mental health and substance use services are free,** delivered through Fraser Health, Vancouver Coastal, Island Health, Interior Health and Northern Health. Many accept self-referral. They are triaged by urgency, which means waits for non-urgent presentations can be long.',
        '**Hospital and emergency psychiatric assessment is covered,** and urgent-response services operate in most regions.',
        'What is not covered is counselling or psychotherapy delivered in private practice by a Registered Clinical Counsellor, and psychological assessment in private practice. That is the gap extended health, employer programmes and private pay fill — see [low-cost counselling in BC](/resources/low-cost-counselling-bc) for the routes when none of those apply.',
      ],
    },
  ],

  'resources/low-cost-counselling-bc': [
    {
      h2: 'How to approach a free service so you actually get seen',
      list: [
        { label: 'Describe the worst of it, not the average', detail: 'Intake triage works from what you report, and understating is reflexive for many people. Accuracy is not exaggeration, and stoicism at intake places you lower on a list that is sorted by urgency.' },
        { label: 'Ask what the wait actually is', detail: 'A specific question to a specific service produces a specific answer. General figures are useless for planning.' },
        { label: 'Ask about the cancellation list', detail: 'Most services hold one. Being available at short notice can move you forward by months, and it is almost never offered unprompted.' },
        { label: 'Be on several lists at once', detail: 'A health-authority service, a community agency, and a campus or employer programme are not mutually exclusive. Take whichever arrives first.' },
        { label: 'Stay in contact', detail: 'Lists get cleaned, and an unanswered call can remove you without your knowing. Confirm periodically, and report any deterioration — it can re-triage you.' },
        { label: 'Ask what they offer while you wait', detail: 'Many services run groups, workshops or structured self-help programmes with far shorter waits than individual counselling, and they are frequently not mentioned unless you ask.' },
      ],
    },
  ],

  'resources/bc-crisis-and-support-directory': [
    {
      h2: 'What actually happens when you call',
      body: [
        'A large number of people who would benefit from a crisis line never call, and the most common reason is not knowing what happens next. Fear of being sent to hospital against your will keeps more people off the phone than anything else.',
        'What happens is a conversation. Someone trained answers, asks what is going on, and listens. You do not have to be at the point of acting on anything to call, and you do not have to give your name. The great majority of calls end with the call — not with an ambulance, not with police, not with an admission.',
        'Involuntary intervention is rare and reserved for immediate danger to life. If you are not in that position, saying so plainly is enough. And if you are, that is precisely the situation the service exists for.',
        'You can also call about someone else. Support lines routinely take calls from people worried about a family member, and they will help you think through what to do — which is often more useful than trying to work it out alone at midnight.',
        'Two practical notes. **Text is available** on 9-8-8, which matters if speaking out loud is not possible or if you are somewhere you can be overheard. And **you can hang up.** A call that stops after ninety seconds is not a failure and nobody will pursue you about it.',
      ],
    },
  ],

  'resources/student-mental-health-supports-bc': [
    {
      h2: 'Timing it around the academic year',
      body: [
        'Campus services are subject to a demand curve so predictable that planning around it is worth real time saved.',
        '**September and January are the quietest,** and the easiest points to be seen quickly. Booking early in a term, even for something that does not feel urgent yet, is the single most effective piece of scheduling available to a student.',
        '**Mid-October to November and mid-March to April are the peak,** for the obvious reason. Waits lengthen sharply, and the students who most need to be seen are frequently the ones who cannot face booking.',
        '**Reading break is underused.** Services generally continue running while demand drops.',
        '**Summer is complicated.** Some institutions reduce counselling over the summer, and some students lose eligibility if not enrolled. Worth checking in April rather than in July, particularly if you are on a co-op term.',
        'Two further timing points that catch people out. Student health plan coverage typically runs on a plan year rather than a calendar year, and unused benefit does not carry over — so an unused counselling allowance disappears. And academic accommodation requests take time to process, which means starting the conversation before a term goes wrong is worth far more than a retroactive appeal afterwards.',
      ],
    },
  ],

  'resources/workplace-mental-health-bc': [
    {
      h2: 'Preparing for the conversation with your manager',
      body: [
        'This conversation goes considerably better with preparation, and the preparation is mostly about deciding in advance what you are asking for.',
        '**Separate disclosure from request.** You can ask for an accommodation without naming a condition. "I am dealing with a health issue and my doctor has recommended some adjustments" is sufficient for most purposes, and it keeps a diagnosis out of a conversation where it is not required.',
        '**Arrive with a specific proposal.** "I would like to start at ten for the next six weeks and drop the on-call rotation" is actionable. "I am struggling and need some flexibility" transfers the problem back to a manager who does not know what would help. Specificity dramatically increases the chance of a yes.',
        '**Put it in writing afterwards.** A short email summarising what was agreed protects everyone, and it is the record that matters if the arrangement is later disputed or if your manager changes.',
        '**Know your route if it goes badly.** Employment standards, human rights, a union if you have one. Knowing the route in advance changes how the conversation feels even if you never use it.',
        '**And decide what you will do if the answer is no.** Sometimes the honest conclusion is that the job is the thing making you unwell and no accommodation fixes that. That is a decision worth making deliberately rather than by attrition, and it is legitimate session material.',
      ],
    },
  ],

  'resources/verify-a-counsellor-in-bc': [
    {
      h2: 'What to do if the register says something unexpected',
      list: [
        { label: 'They are not listed at all', detail: 'There are innocent explanations — registration under a legal name that differs from the working name, a recent change, or membership of a body you have not checked. Ask directly. A registered professional will answer without offence; evasion is itself an answer.' },
        { label: 'The designation is not the one advertised', detail: 'Worth clarifying. Some practitioners hold several, and some describe themselves loosely. The question is whether the specific designation you were told about is current.' },
        { label: 'The registration is listed as inactive or lapsed', detail: 'This matters. An inactive registration generally means the person is not currently entitled to practise under that designation, and it may also mean no insurance and no complaints route.' },
        { label: 'There is a published disciplinary history', detail: 'Read it rather than reacting to its existence. Bodies publish outcomes, and the substance ranges from administrative matters to serious findings. What it is matters more than that it is there.' },
        { label: 'You cannot find the register', detail: 'Go to the body\'s own website directly rather than following a link from the practitioner\'s site, and use their search rather than a general search engine.' },
      ],
    },
  ],

  'resources/psychiatry-and-assessment-in-bc': [
    {
      h2: 'Making the most of a short psychiatric appointment',
      body: [
        'A first psychiatric appointment is frequently shorter than people expect and may be the only one for some time. Preparation changes what comes out of it more than anything else you control.',
        '**Bring a written timeline,** not a summary. When it started, what changed and when, what has been tried, what effect each thing had, and how long each was tried for. One page. Hand it over rather than reciting it — it saves several minutes and it is more accurate than recall under pressure.',
        '**Bring a current medication list,** including anything over the counter, supplements, and alcohol or other substance use. Interactions matter and omissions here are common.',
        '**Bring family history if you know it.** Whether a relative responded well to a particular treatment is useful clinical information.',
        '**State your question explicitly.** "I want to understand whether medication would help" or "I want a diagnostic opinion" or "I want to know whether this is treatable" all lead to different appointments. Waiting to be told is the least efficient use of the time.',
        '**Ask three things before you leave:** what happens next and when, what would count as this not working, and who to contact in the meantime. Appointments end abruptly and these are the questions people realise afterwards they needed answered.',
        '**And bring someone if you can.** A second person remembers different things, and for anyone whose concentration is affected that is not a small advantage.',
      ],
    },
  ],

  /* ---------------- audiences ---------------- */
  'for/new-parents': [
    {
      h2: 'The window that gets missed',
      body: [
        'Perinatal mental health has a specific timing problem. The formal check-ins cluster in the first weeks, and a meaningful share of difficulty arrives later — at four months, at eight, at the return to work, at weaning. By then the appointments have stopped and everyone has moved on to asking how the baby is.',
        'It is also the period when reaching out is hardest. The practical obstacles are real: an hour is difficult to find, leaving the house is a project, and a video session during a nap is frequently the only format that exists. That is not a preference; it is the difference between getting support and not.',
        'The other obstacle is what people expect to be told. A great many parents fear that describing intrusive thoughts, or admitting they do not feel what they expected to feel, will trigger a child-protection response. Intrusive thoughts are extremely common in new parents and are not, in themselves, a risk indicator — that distinction is well established clinically and almost never explained to anyone.',
        'What does warrant urgent attention rather than a booking: thoughts of harming yourself, any sense of losing touch with reality, or a rapid change in functioning. Those need same-day medical assessment — **9-8-8**, **310-6789**, or **9-1-1** in immediate danger. Everything else is a normal reason to book something.',
      ],
    },
  ],

  'for/university-students': [
    {
      h2: 'What to do when a term is already going wrong',
      body: [
        'By the time most students seek help, several deadlines have passed and the situation feels irrecoverable. It is usually less irrecoverable than it looks, and the order of operations matters.',
        '**Go to the accessibility office before you go anywhere else.** Mental health conditions can qualify for academic accommodation, and options exist that students do not know about — extended deadlines, alternative exam arrangements, a reduced course load without losing full-time status for funding, and in some cases retroactive withdrawal from a failed term. Documentation usually has to come from a physician rather than a counsellor.',
        '**Find out your institution\'s withdrawal dates.** There is nearly always a date after which a withdrawal appears differently on a transcript, and knowing it converts a vague dread into a decision with a deadline.',
        '**Talk to one instructor.** Faculty have more discretion over deadlines than students assume, and the conversation is far easier before the deadline than afterwards. You do not have to disclose details.',
        '**Check the funding implications before reducing a course load.** StudentAid and institutional systems do not always align automatically, and a reduction made for good reasons can create a second problem.',
        '**Then deal with the underlying thing.** In that order — because managing a mental health difficulty while an academic disaster compounds in the background is considerably harder than dealing with one at a time.',
      ],
    },
  ],

  'for/healthcare-and-shift-workers': [
    {
      h2: 'Sleep advice that survives a rotating roster',
      body: [
        'Standard sleep hygiene assumes a consistent schedule, which makes most of it useless on rotation. The adapted version is different in specific ways.',
        '**Anchor sleep beats total sleep.** Where a fully consistent schedule is impossible, keeping a fixed core block — four or five hours at the same clock time across as many days as the roster allows — stabilises the body clock far better than chasing eight hours at variable times.',
        '**Light is the lever, in both directions.** Bright light during the shift, and dark glasses on the commute home after nights, do more than anything else. The drive home in morning sun is the single most disruptive twenty minutes in a night worker\'s day and the easiest to fix.',
        '**Protect the sleep environment properly.** Blackout, earplugs, phone genuinely off, and a household that understands that daytime sleep is sleep rather than a nap. This is a negotiation with the people you live with as much as a technical fix.',
        '**Use naps deliberately.** A short nap before a night shift is well supported. A long unplanned nap after one usually makes the following night worse.',
        '**Caffeine has a timeline.** It has a long half-life, and the last dose of a night shift is frequently the reason the subsequent sleep fails.',
        '**And treat the anxiety separately.** Where sleep is disrupted by rumination rather than by the roster, no amount of scheduling fixes it — see [anxiety and sleep](/guides/anxiety-and-sleep).',
      ],
    },
  ],

  'for/first-gen-south-asian-adults': [
    {
      h2: 'Deciding what to keep',
      body: [
        'A great deal of writing aimed at first- and second-generation adults treats the goal as separation — individuating, setting boundaries, becoming less enmeshed. For plenty of people that framing is not only unhelpful; it is describing a life they do not want.',
        'The more useful work is discrimination rather than separation: sorting what you actually endorse from what you are carrying by default. Those are different categories and they get bundled together because nobody has ever asked.',
        'Some obligations, examined, turn out to be things you genuinely choose. Caring for a parent, staying close, contributing financially, being present at things that matter to your family. Carried deliberately, these are load-bearing and sustaining rather than corrosive.',
        'Others turn out to be inherited rules that nobody has revisited in a generation, frequently formed under conditions that no longer apply — about what can be discussed, what a career must look like, who gets consulted about your decisions. These are the ones that quietly cost the most, precisely because they were never chosen.',
        'The third category is the hardest: obligations you do endorse that are nonetheless too heavy in their current form. Those do not need abandoning; they need renegotiating, which is slower and considerably more delicate than a boundary script implies.',
        'None of this requires a confrontation or a declaration. Most of it is internal work that changes how you hold something, and the external conversations — where they happen at all — go much better afterwards. [Setting boundaries with family](/guides/setting-boundaries-with-family) covers those.',
      ],
    },
  ],

  'for/women': [
    {
      h2: 'Being taken seriously in a medical setting',
      body: [
        'A specific and common thread in this work is a history of not being believed — years of symptoms attributed to stress, to being tired, or to nothing. That has two costs. It delays diagnosis of physical conditions, and it teaches people to under-report, which compounds the first problem.',
        'Counselling cannot fix a system, and there are things that measurably improve how these appointments go.',
        '**Bring a written timeline** rather than a description. Dates, what changed, what has been tried, what effect it had. Written material is treated differently from spoken material, and it is harder to compress into "stress".',
        '**Lead with function, not feeling.** "I have missed nine days of work in two months" lands differently from "I have been exhausted". Both are true; only one is difficult to dismiss.',
        '**Ask for the reasoning, not the conclusion.** "What else was on your list, and what ruled it out?" is a reasonable question that changes the shape of a consultation without confrontation.',
        '**Ask for it in the record.** "Could you note that I have raised this?" is a small request with real effects, and it makes a pattern visible at the next appointment.',
        '**And bring someone if it matters.** Uncomfortable that it helps, and it frequently does.',
        'The therapeutic work alongside this is on the part the system leaves behind — the reflex to minimise, the delay before raising something, and the anger that has nowhere to go. That is workable even where the system is not.',
      ],
    },
  ],

  'for/couples': [
    {
      h2: 'The between-sessions agreement',
      body: [
        'The most common way couples work is undone is not what happens in the room. It is the conversation on the drive home, where the session gets re-litigated and whatever was said becomes ammunition.',
        'A short agreement, made in the first session, prevents most of it. **No debriefing the session for twenty-four hours.** Not silence — just not analysing who said what and whether the counsellor agreed with them. Anything important survives a day and comes back into the room, which is where it can be handled.',
        '**Nothing said in session gets quoted in an argument.** The moment a disclosure becomes evidence, both of you stop disclosing, and the work becomes a performance.',
        '**Practise the specific thing rather than the general lesson.** Couples work usually produces one concrete thing to try in the week — a repair phrase, a break signal, a particular conversation. One thing, tried badly, is worth more than a resolution to communicate better.',
        '**Report failures rather than successes.** The most useful material a couple brings back is the attempt that went wrong. Bringing only the good week wastes the session, and it is a strong pull for anyone who wants to be doing well at therapy.',
        'None of this requires either of you to feel warmly toward the other in a given week. It requires both of you to keep the container intact, which is a much lower bar and the one that actually determines whether the work holds.',
      ],
    },
  ],

  'for/rotational-and-camp-workers': [
    {
      h2: 'The first forty-eight hours home',
      body: [
        'Re-entry is the part of rotational life that causes the most damage and gets the least attention, and it is unusually responsive to a small amount of planning.',
        'What is actually happening is two adjustments colliding. You are decompressing from a fortnight of structure, noise and no autonomy. The household has been running a functioning system without you and is now reorganising around your return. Both of those are legitimate, and neither is about the other person.',
        'A few things reliably help. **Say what you need in advance rather than on arrival** — a few hours of quiet, or the opposite, but stated before the drive rather than negotiated in the doorway. **Do not make decisions in the first day.** The conversations that get deferred for two weeks tend to be waiting at the door, and the worst possible time to have them is at the end of a rotation.',
        '**Take over one specific thing rather than all of it.** Arriving and reorganising a system that has been working without you reads as criticism, however it is meant. One agreed handover is better than a general resumption of authority.',
        '**And build a marker that is not a drink.** Rotational drinking frequently starts as a transition ritual and becomes load-bearing. Something else that reliably marks the change — a walk, a specific meal, an hour alone — occupies the same slot without the eventual cost.',
        'Most of this is negotiated once, before the next rotation, and then repeated. It is not therapy so much as logistics; it just happens to be logistics that no one is ever taught.',
      ],
    },
  ],

  'for/family-caregivers': [
    {
      h2: 'The conversation with your siblings',
      body: [
        'The sibling problem is the most predictable feature of family caregiving and the one people most often try to solve by absorbing more. It rarely resolves on its own, and there is a version of the conversation that goes better than average.',
        '**Ask for specific tasks, not for help.** "Can you take Tuesdays?" or "Can you handle the pharmacy and the insurance calls?" is answerable. "I need more support" invites sympathy and produces nothing, because it does not tell anyone what to do.',
        '**Write down what is actually being done,** in hours, before the conversation. Siblings at a distance are frequently not being callous; they genuinely do not know, because the person doing it has never itemised it. The list is often startling to everyone including the person who wrote it.',
        '**Offer a menu.** Money, time, logistics, respite weeks, taking over one system entirely. People contribute more when there is a way to contribute that fits their circumstances.',
        '**Expect the old roles to reassert themselves.** Families under pressure revert to configurations set decades ago with remarkable precision. Knowing that in advance makes it less personal when it happens.',
        '**And decide in advance what you will do if the answer is no.** Sometimes it is no. The realistic question then is not how to make them help but what you will change about your own commitment given that they will not — which is a harder question and the only one with an answer available to you.',
      ],
    },
  ],

  /* ---------------- locations ---------------- */
  'online-counselling/prince-george': [
    {
      h2: 'What virtual access actually changes in the north',
      body: [
        'Northern Health covers roughly two-thirds of the province\'s land area for a small fraction of its population, and the practical consequence for counselling is that choice — of counsellor, of approach, of language — has historically been a metropolitan privilege. A virtual practice does not fix the region\'s service gaps, and it does remove the specific problem of having one option or none.',
        'It also removes the small-community confidentiality problem, which is a larger obstacle than it is usually credited as being. Where everyone knows everyone, being seen entering a counselling office is itself a disclosure, and the counsellor available may have a connection to your family or your workplace. A counsellor elsewhere in the province is genuinely anonymous in a way a local one cannot be.',
        'The constraints are real too, and worth naming. Connectivity is variable, which is why sessions can run with the camera off to cut the bandwidth a connection has to carry. Winter isolation and limited daylight are genuine contributors to low mood at this latitude — see [low mood through a BC winter](/guides/low-mood-through-a-bc-winter). And rotational and camp work is common in the region, which makes scheduling the first thing to solve rather than an afterthought; [counselling for rotational and camp workers](/for/rotational-and-camp-workers) covers that directly.',
      ],
    },
  ],

  'online-counselling/surrey': [
    {
      h2: 'Language, family, and the cost of the commute',
      body: [
        'Surrey is one of the most linguistically diverse cities in Canada, and the practical shortage is not counsellors in general — it is counsellors who can work in the language a family argument actually happened in. Being able to run a session in Punjabi is not a convenience here; it removes an entire layer of translation from material that is hard enough to say once.',
        'The second thing a virtual practice changes in Surrey is time. Commutes across the region are substantial, and a weekly appointment requiring travel and parking is realistically a two-hour commitment rather than a fifty-minute one. That is frequently the difference between sustaining counselling and abandoning it in week five — which is a scheduling problem masquerading as a motivation problem.',
        'The third is privacy within a community. Where extended family and community networks are dense, attending a local clinic can be a disclosure in itself. A session from home, with no waiting room, removes that consideration entirely.',
        '[Counselling in Punjabi](/services/punjabi-counselling), [South Asian mental health](/services/punjabi-counselling) and [counselling for first-generation South Asian adults](/for/first-gen-south-asian-adults) cover the specific ground this comes up on most.',
      ],
    },
  ],

  'online-counselling/vancouver': [
    {
      h2: 'Choice, cost, and the isolation nobody expects',
      body: [
        'Vancouver has more counsellors per capita than anywhere else in the province, which produces a different problem: not scarcity but selection. Choosing between several hundred profiles is difficult, and a great many people stall at exactly that point. [How to find a therapist in BC](/guides/how-to-find-a-therapist-in-bc) and [questions worth asking a therapist](/guides/questions-to-ask-a-therapist) are written for that stall specifically.',
        'The second Vancouver-specific factor is cost pressure. Housing costs mean discretionary spending is genuinely constrained even at high incomes, and counselling frequently competes with rent rather than with leisure. That makes the funding routes worth knowing before paying privately — [EFAP vs private counselling](/compare/efap-vs-private-counselling) and [low-cost counselling in BC](/resources/low-cost-counselling-bc).',
        'The third is the thing residents mention most and outsiders least expect: it is a difficult city to make friends in. Whatever the reasons, adult loneliness here is common, under-discussed, and a significant contributor to low mood — and it is a legitimate reason to book something, rather than a personal failing to be managed privately.',
        'Removing the commute matters here as much as anywhere. A cross-town appointment in rush hour is a two-hour commitment; a session from a home office is fifty minutes.',
      ],
    },
  ],

  'online-counselling/abbotsford': [
    {
      h2: 'A city between two systems',
      body: [
        'Abbotsford sits in a particular position: large enough to have services, small enough that the community networks are dense, and close enough to Metro Vancouver that many residents work in one place and live in another. Each of those has a counselling consequence.',
        'The density of community networks makes local confidentiality a genuine consideration, particularly within faith communities and within the South Asian community. A local counsellor may be connected to your family, your employer, or your congregation. That is not a hypothetical concern and it keeps people from booking.',
        'The commute pattern matters for scheduling. Anyone driving into Metro Vancouver for work has a day that already contains two hours of highway, and a counselling appointment that adds travel is unlikely to survive the winter. Evening virtual sessions are frequently the only format that holds.',
        'The agricultural and trades economy also means a substantial number of people work schedules that do not fit a nine-to-five service, and seasonal work adds an income pattern that makes a fixed weekly commitment difficult. Being direct about what you can sustain changes how the work is planned — see [weekly vs biweekly sessions](/compare/weekly-vs-biweekly-sessions).',
      ],
    },
  ],

  'online-counselling/victoria': [
    {
      h2: 'The island factors',
      body: [
        'Victoria has a reasonable supply of counsellors and two constraints that are easy to underestimate.',
        'The first is that leaving the island for anything is a project. That sounds irrelevant to counselling until you need a service that is not available locally — a specific specialism, a particular assessment, an intensive programme — at which point a ferry, a day of travel and a cost that is not reimbursed all enter the calculation. A virtual practice removes the geography from the choice of counsellor entirely, which widens the available pool considerably.',
        'The second is the demographic mix. Victoria has a large public-sector workforce, a large student population, and a large retired population, and the counselling questions those groups bring are different from one another — workplace strain and burnout, academic and transition pressure, and grief, caregiving and loss of role respectively. [Mental health and work in BC](/resources/workplace-mental-health-bc), [student supports](/resources/student-mental-health-supports-bc) and [counselling for family caregivers](/for/family-caregivers) each cover one of them.',
        'The third factor is the one residents raise unprompted: the winters are grey rather than cold, and the effect on mood over five months is cumulative and easy to dismiss. [Low mood through a BC winter](/guides/low-mood-through-a-bc-winter) covers the coastal version specifically.',
      ],
    },
  ],

  'online-counselling/kelowna': [
    {
      h2: 'Seasonality, in more than one sense',
      body: [
        'Kelowna has a seasonal economy and a seasonal population, and both shape what arrives in counselling here.',
        'Tourism, hospitality, agriculture and construction produce income that varies substantially across the year, and a fixed weekly financial commitment is genuinely harder to plan around than it is on a salary. Saying so early changes how the work is structured — a concentrated block during a stable stretch frequently works better than a thin year-round schedule.',
        'The region also has a significant retired and semi-retired population, which brings a particular cluster: loss of role after a career ends, caregiving for a partner, grief, and the specific isolation of having moved somewhere pleasant where you know few people. That last one is more common than it is discussed and it is a legitimate reason to book something.',
        'Wildfire season has become a recurring feature rather than an occasional event, and its psychological effects are cumulative — evacuation alerts, smoke, and the anticipatory dread that now arrives with the summer. Repeated exposure to that pattern is a genuine stressor and it responds to the same trauma-informed work as any other; see [what trauma actually means](/guides/what-trauma-actually-means).',
      ],
    },
  ],
};

import type { DepthSection } from './depth';

/* Further sections for the first cohort of guides. */
export const depthGuides: Record<string, DepthSection[]> = {
  'guides/is-online-therapy-as-effective-as-in-person': [
    {
      h2: 'Who video suits least well',
      body: [
        'The averages in the research conceal real variation, and it is worth knowing in advance which side of it you might sit on. Video suits people with a stable private space, a reliable connection, and enough comfort with the format that the technology stops being noticeable within a session or two. That describes most people, which is why the pooled results look the way they do.',
        'It suits some situations considerably less. Where someone is at meaningful risk and might need a physical response, a scheduled video appointment is a poor container — that is a crisis service or an in-person team, and it is the clearest limitation of the format. Where a client dissociates heavily, the loss of a shared physical room removes cues that help re-orient someone, and a counsellor has fewer options for helping them come back.',
        'It also suits less well where there is nowhere private. A session conducted with one ear on the corridor is not really a session, and this is the single most common practical reason virtual work fails. It has nothing to do with technology and everything to do with housing.',
        'Finally, some people simply find the screen an obstacle they do not stop noticing. There is no way to predict that in advance, and two or three sessions is usually enough to know. Deciding it is not for you is a legitimate finding rather than a failure of effort.',
      ],
    },
    {
      h2: 'What to check before your first video session',
      list: [
        { label: 'Where you will actually sit', detail: 'A door that closes matters more than a good camera. Work this out before the appointment rather than five minutes into it — a bedroom, a parked car, or a booked meeting room all work.' },
        { label: 'Headphones', detail: 'The single highest-value item. They keep the counsellor\'s side of the conversation from being audible in the next room, which changes how freely you speak more than anything else on this list.' },
        { label: 'A backup plan', detail: 'Agree in advance what happens if the connection drops — usually a phone call to the same time slot. Knowing this removes a background anxiety that otherwise occupies part of every session.' },
        { label: 'Whether you want to see yourself', detail: 'Most platforms let you hide your own video while remaining visible. A surprising number of people find self-view distracting, and turning it off is worth trying early.' },
        { label: 'Ten minutes afterwards', detail: 'The commute home from an in-person session did something useful: it created a transition. Scheduling ten unclaimed minutes after a video session replaces it, and going straight from a hard session into a meeting is worth avoiding.' },
      ],
    },
  ],

  'guides/what-is-emdr-and-how-a-session-works': [
    {
      h2: 'What the eye movements are thought to be doing',
      body: [
        'The honest position is that the mechanism is not settled, and anyone claiming otherwise is overstating the evidence. What is well established is that the protocol works for post-traumatic stress; what remains debated is why the bilateral component contributes.',
        'The most widely discussed account is the **working-memory hypothesis**: holding a distressing memory in mind while performing a task that also demands attention taxes working memory, and a memory recalled under that load appears to become less vivid and less emotionally charged when it is stored again. On this account the eye movements are not magical; they are a demanding secondary task, which is why tapping and auditory tones are used interchangeably in practice.',
        'A second account draws on the similarity to rapid eye movement sleep, proposing that the procedure engages a natural memory-processing mechanism. It is intuitively appealing and less well supported than the working-memory account.',
        'What matters clinically is that the uncertainty sits in the mechanism rather than the outcome, and that a therapist should be able to tell you this rather than offering a confident story about how the brain works. If someone explains EMDR to you as though the science is closed, that is a signal about them rather than about the therapy.',
      ],
    },
    {
      h2: 'What a reprocessing session feels like from the inside',
      body: [
        'People frequently expect either nothing or something overwhelming, and it is usually neither. You hold a specific image, a belief about yourself attached to it, an emotion and a body sensation, and then you follow a moving target — or hold tappers, or listen to alternating tones — for twenty to forty seconds. Then you stop, and the counsellor asks what came up.',
        'The answer is often surprising. Material arrives sideways: an unrelated memory, a physical sensation, a shift in the image, sometimes nothing at all. You are not asked to describe it in detail, and there is no correct output. The counsellor takes whatever came and starts the next set from there.',
        'Distress typically rises before it falls. That is expected rather than a sign of something going wrong, and it is why the preparation phase exists — you should already have reliable ways to come back down before any of this begins. A well-run session stops well short of the end so there is time to close deliberately.',
        'Between sessions, some people notice more dreams or a period of feeling stirred up for a day or two. Being told this in advance is the difference between it being a normal part of the process and it being alarming.',
      ],
    },
  ],

  'guides/anxiety-attack-vs-panic-attack': [
    {
      h2: 'Why the distinction changes the treatment',
      body: [
        'This is not a vocabulary exercise. The two patterns respond to different work, and treating one as though it were the other is a common reason people conclude that therapy did not help.',
        'Panic responds primarily to interoceptive and situational exposure — deliberately, gradually re-encountering both the feared situations and the physical sensations themselves, so the body learns that a racing heart is not a catastrophe in progress. The target is the fear of the sensations, not the sensations.',
        'Generalised anxiety responds to something different: working on the process of worry rather than its content. Because the subject moves, resolving any individual worry produces no lasting relief — the same machinery simply attaches to the next thing. The work is on the relationship to uncertainty, on the belief that worrying is protective, and on tolerating unresolved questions.',
        'Applying panic techniques to generalised anxiety produces someone who can manage a spike but still worries constantly. Applying worry-focused work to panic produces someone with excellent insight who still cannot get on a bus.',
      ],
    },
    {
      h2: 'The physical symptoms, explained one at a time',
      list: [
        { label: 'Racing or pounding heart', detail: 'Adrenaline raising cardiac output to prepare for physical exertion that is not coming. Unpleasant and, in a healthy heart, not dangerous — though a first episode always warrants medical assessment.' },
        { label: 'Chest tightness', detail: 'Chest-wall muscles contracting alongside altered breathing. Reliably frightening, because it maps onto what everyone assumes a cardiac event feels like.' },
        { label: 'Tingling in hands, feet or face', detail: 'Almost always over-breathing. Blowing off carbon dioxide faster than you produce it changes blood chemistry and produces exactly this. It resolves as breathing normalises, which is why lengthening the out-breath helps.' },
        { label: 'Dizziness or feeling faint', detail: 'Same mechanism. Notably, people rarely faint during panic — blood pressure typically rises rather than falls, which is the opposite of what causes fainting.' },
        { label: 'A sense of unreality', detail: 'Derealisation or depersonalisation, a recognised feature of high arousal. Deeply unsettling and not a sign of losing your mind, which is what most people privately conclude.' },
        { label: 'The urge to escape', detail: 'The behavioural output of the whole system. Acting on it delivers immediate relief and teaches the brain the threat was real — which is the mechanism that turns one episode into a pattern.' },
      ],
    },
  ],

  'guides/high-functioning-anxiety': [
    {
      h2: 'The specific problem of being good at it',
      body: [
        'The reason this presentation goes untreated for years is not that it is mild. It is that the strategy works. Over-preparation genuinely produces better work. Arriving early genuinely prevents problems. Anticipating what could go wrong genuinely catches things other people miss. The anxiety is not producing failure; it is producing output, and the output is being rewarded.',
        'That creates a real bind. Giving up the anxiety feels like giving up the competence, and nobody wants to trade away the thing that built their career. It is also why encouragement to relax lands so badly — it sounds like advice to become worse at your job from someone who has not considered what it would cost.',
        'The way through is separating the two, which is harder than it sounds and is most of the work. The preparation is not the anxiety. The 3 a.m. rehearsal of a conversation is not preparation; it is the same circuit running with no output. Learning to tell those apart, in the moment, is what allows the standard to stay while the cost comes down.',
        'It is also worth naming the collapse risk. Anxiety that presents as capability is load-bearing for other people as well as for you, and it tends to continue until something forces a stop — an illness, a breakdown, a relationship ending. Coming in before that point is considerably easier than coming in after it.',
      ],
    },
    {
      h2: 'What other people see, and what they miss',
      list: [
        { label: 'They see reliability', detail: 'You do not miss things. What they miss is the checking that produced it, and the hour of anticipatory dread before an ordinary meeting.' },
        { label: 'They see calm', detail: 'The external presentation is frequently flat rather than agitated, which is why people are surprised. Internally the volume is very high.' },
        { label: 'They see someone who does not need help', detail: 'Which is a self-reinforcing loop: appearing fine means nobody asks, and nobody asking means the practice of not saying anything gets stronger.' },
        { label: 'They do not see the recovery cost', detail: 'The evening after a demanding day, the weekend spent flattened, the holiday that takes four days before anything relaxes. This is where the bill is paid and none of it is visible.' },
        { label: 'They do not see the body', detail: 'Jaw tension, stomach trouble, headaches, waking at four. Frequently investigated medically for years before anyone connects it to anxiety.' },
        { label: 'They do not see the self-talk', detail: 'The commentary is often savage in a way that would be shocking said aloud, and is treated internally as ordinary motivation.' },
      ],
    },
  ],

  'guides/what-to-expect-first-therapy-session': [
    {
      h2: 'Things people worry about that turn out not to be issues',
      list: [
        { label: '"I will not know what to say"', detail: 'You are not expected to arrive with a structured account. Most first sessions begin with a version of "start wherever you want" and the counsellor does the work of shaping it. Silence is normal and not something you are failing at.' },
        { label: '"I will cry"', detail: 'Many people do. It is an entirely unremarkable event in a counselling room, and nobody is evaluating you for it. There will be tissues and no comment.' },
        { label: '"I will be judged"', detail: 'Counsellors hear the full range of human experience and calibrate accordingly. The thing you are most dreading saying is almost certainly not the most difficult thing said in that room this month.' },
        { label: '"My problem is too small"', detail: 'Duration and cost are better tests than severity. Nobody is triaging you against other people\'s difficulties.' },
        { label: '"I will have to talk about my childhood"', detail: 'Only if it is relevant to what you want to change. Plenty of effective work stays firmly in the present.' },
        { label: '"They will tell me to leave my partner / quit my job"', detail: 'A counsellor who directs your life decisions is doing something other than counselling. The work is on helping you think, not on issuing instructions.' },
      ],
    },
    {
      h2: 'What to do in the twenty-four hours afterwards',
      body: [
        'First sessions have an afterwards, and nobody warns people about it. Having said several things out loud for the first time frequently produces a delayed reaction — feeling raw, unexpectedly tired, or oddly elated, sometimes several hours later. All of that is ordinary and it settles.',
        'Two practical things help. Do not schedule anything demanding immediately afterwards; an hour with nothing in it is worth protecting. And write down anything that surfaced on the way home, because the useful material frequently arrives after the session rather than during it and is largely gone by the next week.',
        'It is also worth deliberately noticing your reaction to the counsellor, separately from your reaction to the material. Did you feel able to disagree? Did you edit yourself, and if so, about what? Those questions matter more for the next decision than whether the session was comfortable, because a session can be uncomfortable and still be a good fit — and can be pleasant and go nowhere.',
        'And if you leave certain it is not the right person, that is a useful outcome to have reached in fifty minutes rather than five sessions. Saying so, or simply not booking again, requires no justification.',
      ],
    },
  ],

  'guides/how-the-gottman-method-works': [
    {
      h2: 'The Four Horsemen, and what replaces them',
      body: [
        'The best-known part of this research is a set of four communication patterns that predict relationship breakdown with unusual reliability. They are worth knowing because they are specific enough to notice in yourself, which is the first move.',
        '**Criticism** attacks the person rather than the behaviour — "you never think about anyone else" rather than "I was upset that you did not call". The antidote is a complaint with a request attached: what happened, how you felt, what you would like instead.',
        '**Contempt** is the most corrosive of the four and the strongest single predictor of separation. Eye-rolling, mockery, sarcasm, name-calling — communication from a position of superiority. Its antidote is not politeness; it is the deliberate, sustained rebuilding of fondness and admiration, which is slower work.',
        '**Defensiveness** is a counter-attack disguised as self-protection, and it reliably escalates. The antidote is accepting some portion of responsibility, even a small one, which nearly always de-escalates faster than being right does.',
        '**Stonewalling** is withdrawal — shutting down, going silent, leaving the room. It is usually a sign of physiological flooding rather than indifference, and the antidote is a self-soothing break that is announced and time-limited rather than an exit.',
        'A relationship containing all four is not doomed; it is a relationship where the work is clear. The point of naming them is that they are behaviours rather than character, and behaviours can be replaced.',
      ],
    },
    {
      h2: 'What "most conflict is unresolvable" actually means',
      body: [
        'One of the more counter-intuitive findings in this research is that a large share of the disagreements in any long relationship are perpetual — rooted in stable differences of personality, values or need, and not going away. Tidiness, sociability, money, sex, how much time family gets. Couples who stay together are not couples who solved these; they are couples who developed a way of talking about them that does not produce damage.',
        'That reframing removes a great deal of pressure. If you have been having the same argument for eight years, that does not necessarily mean either of you is unreasonable or that the relationship has failed. It means you have located a perpetual issue and have not yet found a workable way to hold it.',
        'The clinical distinction is between **gridlock** and **dialogue**. Gridlocked conflict is characterised by feeling rejected, entrenchment, and a total absence of humour. The same issue in dialogue still recurs and it is survivable — you can discuss it, tease each other about it, and get through the conversation without either of you feeling diminished.',
        'Moving a gridlocked issue into dialogue usually requires understanding what the position means to the other person — the history, the value, the fear underneath it. That is often a session or two of work, and it is a different activity from negotiating a compromise.',
      ],
    },
  ],

  'guides/burnout-vs-depression': [
    {
      h2: 'Why the distinction matters practically',
      body: [
        'This is not a taxonomic argument. The two point to genuinely different first moves, and getting it wrong wastes months.',
        'If the picture is burnout, the leverage is largely in the situation. Workload, autonomy, recognition, fairness, and the gap between what the job demands and what you value — these are the recognised drivers, and none of them is fixed by a resilience workshop. The uncomfortable implication is that the most effective interventions are frequently structural, and the person experiencing it often has limited control over them. Counselling in that case works on what you can influence: boundaries, the decision about whether to stay, and the recovery.',
        'If the picture is depression, the leverage is different. A holiday will not fix it, because it will follow you onto the holiday. What helps is treatment — structured psychological work with an evidence base, sometimes alongside medication, prescribed by a physician rather than a counsellor. Waiting for circumstances to improve is not a plan.',
        'And the two coexist constantly. Prolonged burnout is a risk factor for depression, which is exactly why "it is just work" becomes a costly conclusion when it stops being accurate.',
      ],
    },
    {
      h2: 'The test that separates them',
      list: [
        { label: 'What happens on genuine extended leave', detail: 'The most useful single question. Burnout tends to ease with real time away — not a long weekend, but a proper stretch. Depression follows you, and coming back from a fortnight off unchanged is significant information.' },
        { label: 'Does pleasure still work elsewhere?', detail: 'Burnout usually leaves capacity for enjoyment outside the work context. Depression flattens things you used to like regardless of where they happen.' },
        { label: 'Is there self-blame?', detail: 'Burnout typically produces cynicism directed outward — at the organisation, the clients, the system. Depression more often produces guilt and worthlessness directed inward.' },
        { label: 'What is the sleep doing?', detail: 'Both disrupt it. Early-morning waking with a mood dip, or sleeping far more than usual and waking unrefreshed, lean toward depression.' },
        { label: 'Has anything about the situation changed?', detail: 'If the job improved, the workload dropped, or you changed roles, and the state persisted regardless — that is a strong signal the condition has become independent of its cause.' },
      ],
    },
  ],

  'guides/intergenerational-trauma-explained': [
    {
      h2: 'How it actually transmits',
      body: [
        'The mechanisms are less mysterious than the phrase suggests, and being specific about them defuses a lot of unhelpful mysticism.',
        '**Parenting under load.** A parent whose nervous system is calibrated for danger parents differently — more vigilant, less able to tolerate a child\'s distress without becoming distressed, quicker to control. None of that requires the child to know what happened. The child learns the world their parent is responding to.',
        '**What is not said.** Silence transmits. A subject that visibly cannot be raised teaches a child that some things are unsurvivable to discuss, and that lesson generalises well beyond the original subject. Families with a large unspoken event frequently produce adults who are extremely skilled at not asking questions.',
        '**Rules that outlive their reason.** Do not trust institutions. Do not tell outsiders our business. Never rely on anyone. Save everything. Every one of these was once an accurate and possibly life-preserving assessment. Passed down without the context, they become unexplained constraints on a life in a completely different environment.',
        '**Role assignment.** The child who becomes the translator, the mediator, the one who must succeed. These roles are usually allocated in early childhood, never discussed, and carried into adulthood as though they were personality.',
        'There is also active research on biological pathways, and it is genuinely early — the honest summary is that it is plausible, contested, and not yet something to build a treatment on. The mechanisms above are sufficient to explain most of what is observed clinically.',
      ],
    },
    {
      h2: 'Working on it without putting your family on trial',
      body: [
        'The most common reason people avoid this work is the fear that it requires blaming their parents. That fear is reasonable — a great deal of popular writing on the subject does exactly that — and it is not what the clinical work involves.',
        'The more useful frame is that adaptations made under duress are not moral failures. A parent who could not tolerate emotional expression very often had no model for it and no capacity to spare. Understanding that is not exoneration and it is not condemnation; it is accuracy, and accuracy is what makes the pattern workable rather than simply painful.',
        'It also allows both things at once, which is where most people actually live: what happened had real costs to you, **and** the person who caused those costs was carrying something themselves. Therapy that insists you choose one of those is not helping.',
        'Practically, none of this requires a confrontation. Plenty of this work happens without a single conversation with the family, because the target is the pattern operating in your life now — not an apology or an admission. Where a conversation does become useful, it works better after the work than as a substitute for it. [Setting boundaries with family](/guides/setting-boundaries-with-family) and [telling your family you are in therapy](/guides/talking-to-your-family-about-therapy) cover that ground.',
      ],
    },
  ],

  'guides/how-to-find-a-therapist-in-bc': [
    {
      h2: 'Where to actually look',
      list: [
        { label: 'The BCACC directory', detail: 'The BC Association of Clinical Counsellors maintains a searchable public register of Registered Clinical Counsellors, filterable by area, specialisation and language. It doubles as the place to verify anyone\'s registration.' },
        { label: 'The provincial psychologists\' register', detail: 'If you need diagnosis or formal assessment, this is the designation to search rather than a counsellor directory. See [psychiatry and assessment in BC](/resources/psychiatry-and-assessment-in-bc).' },
        { label: 'The BC College of Social Workers', detail: 'Clinical social workers provide counselling and are frequently covered by plans that also cover counsellors.' },
        { label: 'Your insurer\'s provider list', detail: 'Backwards but efficient: if reimbursement is essential, start from who your plan actually pays for rather than falling in love with a practice that is not eligible.' },
        { label: 'Your EFAP', detail: 'If you have one, it is free and fast. Cap the expectations along with the sessions — see [EFAP vs private counselling](/compare/efap-vs-private-counselling).' },
        { label: 'A specific referral from someone you trust', detail: 'Still the highest-yield route, with one caveat: fit is personal, and a counsellor who transformed your friend\'s life may be wrong for you.' },
      ],
    },
    {
      h2: 'Reading a therapist\'s website properly',
      body: [
        'A profile is a marketing document and can still be read for signal. The things worth weighting are specific: which designation, held by which body; what training in which methods, and at what level; what they say they do not work with; and whether the fee is stated at all.',
        'Vagueness is the main warning sign. A page that lists twenty specialisms is telling you about positioning rather than expertise. Language that promises transformation, breakthroughs or results is either untrained or ignoring the advertising standards counsellors work under. And a site carrying client testimonials is displaying something prohibited by the BCACC code, which is worth noticing.',
        'What should be easy to find: the fee, the cancellation policy, the format, and how to get in touch. A practice that makes you request the price is optimising for a sales conversation.',
        'Then stop reading and book two consultations. Websites are a filter, not a decision — nobody has ever determined fit from a photograph and three paragraphs. [Questions worth asking a therapist](/guides/questions-to-ask-a-therapist) covers what to establish once you are actually talking to someone.',
      ],
    },
  ],
};

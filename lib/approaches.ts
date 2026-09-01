import type { Guide } from './guides';

/* Approach pages.
 *
 * A distinct axis from the service pages: those are organised by what you are
 * bringing (anxiety, trauma, a relationship), these by the method used. People
 * search both ways, and someone who has been recommended a specific approach —
 * or has tried one that did not fit — needs a page about the method itself.
 *
 * EMDR and the Gottman Method are not duplicated here; they already have their
 * own service pages and are linked to instead. */
export type Approach = Guide;

export const approaches: Approach[] = [
  {
    slug: 'cognitive-behavioural-therapy',
    title: 'Cognitive behavioural therapy (CBT)',
    metaTitle: 'CBT Explained | Westpeak Wellness',
    metaDescription:
      'What CBT actually involves session by session, what the evidence supports it for, where it works poorly, and how to tell it is being done properly.',
    eyebrow: 'Approach · CBT',
    lede:
      'The most researched talk therapy there is, and the one most often delivered badly — because the structure is what makes it work.',
    shortAnswer:
      'CBT is a structured, present-focused, time-limited therapy built on the observation that thoughts, feelings and behaviour hold each other in place. It has the largest evidence base of any psychological treatment, particularly for anxiety and depression. Its defining features are an agreed target, work between sessions, and a measurable idea of progress — a course of open-ended conversation is not CBT, whatever it is called.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'anxiety-avoidance-cycle',
    figure2: "approach-selector",
    sections: [
      {
        h2: 'What actually happens in a course of CBT',
        body: [
          'CBT is unusual among therapies in having a recognisable shape, and knowing it lets you tell whether you are receiving it.',
          '**Sessions one to three: formulation.** Rather than a general history, the work builds a specific map of how the difficulty is maintained *now* — the situations that trigger it, the thoughts that arrive, the feelings, the physical response, and crucially what you do next. That last element is usually where the maintaining mechanism sits.',
          '**Then an agreed target and a measure.** Not "feel better" but something checkable, and frequently a short questionnaire repeated across the course so that change is measured rather than recalled. Being asked to complete the same eight questions each week is a sign of the method being applied properly, not of box-ticking.',
          '**Then the intervention phase**, which varies by problem. Behavioural experiments to test a specific prediction. Graded exposure for anxiety. Activity scheduling for depression. Thought records to catch and examine automatic interpretations. Each session typically opens with a review of the between-session work and closes by agreeing the next piece.',
          '**Then relapse prevention.** Explicitly identifying your own early warning signs and writing a plan for what to do if the pattern returns. This is a defined stage rather than an afterthought, and skipping it is one of the more common ways gains fail to hold.',
        ],
      },
      {
        h2: 'What the evidence supports it for',
        body: [
          'CBT has been studied more than any other psychological treatment, and the evidence is strongest and most consistent for the anxiety disorders and for depression. Specific protocols exist for panic, social anxiety, generalised anxiety, health anxiety, obsessive-compulsive presentations and insomnia, and the disorder-specific versions generally outperform generic CBT.',
          'That last point matters practically. "CBT for anxiety" is not one thing — the protocol for panic works on the fear of bodily sensations, while the protocol for generalised anxiety works on the process of worry and on intolerance of uncertainty. Applying the wrong one is a common reason people conclude CBT did not work for them.',
          'For insomnia specifically, CBT-I is recommended ahead of medication in most major clinical guidelines and is considerably less known than it should be — see [anxiety and sleep](/guides/anxiety-and-sleep).',
          'Where the evidence is thinner is for long-standing relational patterns, complex trauma and personality-level difficulties. CBT can contribute there, and it is generally not the whole answer, which is why practitioners trained only in it will sometimes tell you honestly that you need something else.',
        ],
      },
      {
        h2: 'Where it works poorly',
        list: [
          { label: 'When there is no defined target', detail: 'CBT depends on knowing what you are working on. For someone who cannot yet say what the difficulty is, an exploratory phase has to come first — and calling that phase CBT is a misnomer.' },
          { label: 'When the between-session work does not happen', detail: 'Most of the change occurs in the other 167 hours. Where circumstances make that impossible — a crisis, an unstable situation, no capacity — the method loses much of its power and should be adapted rather than repeated.' },
          { label: 'When the problem is happening now', detail: 'CBT cannot resolve an ongoing stressor. Where the situation is unsafe or unchanged, examining your thinking about it can shade into implying the problem is your interpretation, which is both untrue and harmful.' },
          { label: 'When the difficulty is relational and old', detail: 'Patterns formed early and rehearsed for decades usually need something that works on the relationship itself, including the one in the room.' },
          { label: 'When it is delivered as advice', detail: 'Badly done CBT becomes a counsellor telling you your thoughts are irrational. Done properly it is collaborative testing, and you reach the conclusions.' },
        ],
      },
      {
        h2: 'How to tell it is being done properly',
        body: [
          'A few markers separate structured CBT from a conversation with CBT vocabulary attached.',
          'There is **an explicit shared formulation** — a diagram or written map of how your difficulty is maintained, which you helped build and which gets revised. There is **an agenda at the start of each session**, agreed between you. There is **between-session work**, negotiated rather than assigned, and it is reviewed at the next session rather than quietly dropped. There is **a measure** repeated over time. And there is **a stated endpoint** rather than an open horizon.',
          'If none of those is present after four or five sessions, it is fair to ask directly what approach is being used and how progress will be judged — see [questions worth asking a therapist](/guides/questions-to-ask-a-therapist).',
          'The other honest marker: good CBT is more uncomfortable than people expect, because the active ingredient is usually doing the thing you have been avoiding, in graded steps, rather than understanding why you avoid it.',
        ],
      },
    ],
    midCta: {
      text: 'If a structured, targeted piece of work is what you are after,',
      label: 'a free 15-minute consultation can establish whether it fits',
    },
    faqs: [
      { q: 'Is CBT just positive thinking?', a: 'No, and practitioners find the comparison frustrating. CBT tests the accuracy of interpretations rather than replacing them with cheerful ones — and a thought that turns out to be accurate is addressed behaviourally instead.' },
      { q: 'How many sessions does CBT take?', a: 'Protocols are typically designed around 8 to 20 sessions depending on the presentation. Long-standing or multiple difficulties take longer — see [how long therapy takes](/guides/how-long-does-therapy-take).' },
      { q: 'Do I have to do homework?', a: 'Between-session practice is where most of the change happens, so effectively yes. It is negotiated rather than imposed, and it should be small enough to actually do.' },
      { q: 'Can CBT be done by video?', a: 'Yes. It is among the approaches with the strongest evidence for video delivery, partly because its structure transfers cleanly to a screen.' },
    ],
    sources: [
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Anxiety counselling' },
      { href: '/services/individual-therapy', label: 'Depression counselling' },
      { href: '/compare/cbt-vs-emdr-for-trauma', label: 'CBT vs EMDR for trauma' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'acceptance-and-commitment-therapy',
    title: 'Acceptance and commitment therapy (ACT)',
    metaTitle: 'ACT Therapy Explained | Westpeak Wellness',
    metaDescription:
      'What ACT does differently from CBT, why it targets the struggle rather than the symptom, and who it tends to suit when other approaches have stalled.',
    eyebrow: 'Approach · ACT',
    lede:
      'For people who have already understood their patterns in detail and are still exactly where they were.',
    shortAnswer:
      'ACT works on your relationship to difficult thoughts and feelings rather than on their content or frequency. The aim is not to reduce anxiety but to stop the struggle against it consuming your life, while moving toward what you actually value. It tends to suit people who have done insight-oriented work, can explain their patterns fluently, and remain stuck.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'window-of-tolerance',
    figure2: "approach-selector",
    sections: [
      {
        h2: 'The shift ACT makes',
        body: [
          'Most therapies implicitly accept the premise that the difficult internal experience is the problem and should be reduced. ACT questions that premise, on the observation that the effort to control internal experience is frequently what causes the damage.',
          'The clearest example is anxiety. Someone anxious about a presentation may prepare more, rehearse more, avoid similar situations, and organise their week around managing the feeling. Each of those is a control strategy. Each works briefly. Collectively they can consume a life while the anxiety remains exactly where it was.',
          'ACT calls this **experiential avoidance**, and it treats it as the target rather than the anxiety. The question shifts from "how do I stop feeling this" to "what has the fight against this cost me, and what would I be doing if I were not fighting it".',
          'That is not resignation, and the distinction matters. Acceptance in ACT means making room for an experience rather than approving of it — and the point of making room is to free the capacity currently spent on suppression for something you care about.',
        ],
      },
      {
        h2: 'What sessions involve',
        body: [
          'ACT is more experiential than CBT and less analytical. Sessions frequently involve exercises and metaphors rather than worksheets, which some people find powerful and others find frustrating — it is worth knowing which you are before starting.',
          '**Values work comes early and is central.** Not goals — values. What kind of parent, partner, colleague or person you want to be, in terms specific enough to act on. This is difficult and it is where a lot of the therapy actually happens.',
          '**Defusion** techniques create distance from thoughts: noticing "I am having the thought that I will fail" rather than "I will fail". It sounds like word games and it measurably changes how much authority a thought carries.',
          '**Contact with the present moment** — mindfulness in the practical rather than spiritual sense, trained as a skill for stepping out of rumination.',
          '**Committed action**, which is the behavioural half. Small, specific, values-consistent steps taken with the difficult feeling present rather than after it resolves.',
          'A course typically runs comparably to CBT in length, and the two are not opposed — many clinicians move between them, and ACT is itself part of the broader cognitive-behavioural family.',
        ],
      },
      {
        h2: 'Who it tends to suit',
        list: [
          { label: 'People who have already had insight-oriented therapy', detail: 'The most reliable indication. Someone who can explain their patterns in detail and is still stuck is describing a control problem rather than an understanding problem.' },
          { label: 'Chronic difficulties that will not fully resolve', detail: 'Persistent pain, long-term health conditions, ongoing circumstances. ACT has a strong evidence base for chronic pain specifically, precisely because the goal is not elimination.' },
          { label: 'Anyone whose life has narrowed around managing a feeling', detail: 'Where the cost is visible in what has been given up rather than in the symptom itself.' },
          { label: 'People who dislike thought-challenging', detail: 'Some find examining thoughts for accuracy alienating or find that it becomes another performance. ACT does not require you to dispute anything.' },
          { label: 'Less suited to acute crisis', detail: 'Where someone is in immediate danger or acute distress, stabilisation comes first — and where a specific, well-evidenced protocol exists for a specific disorder, that protocol is usually the better opening move.' },
        ],
      },
      {
        h2: 'The common misunderstanding',
        body: [
          'The word acceptance does a lot of damage to how ACT is understood, and it is worth addressing directly because the objection is a reasonable one.',
          'Acceptance in this context does not mean accepting your circumstances, tolerating mistreatment, or abandoning attempts to change things that can be changed. It refers specifically to internal experience — thoughts, feelings, sensations — which are not reliably controllable by effort, as anyone who has tried not to think about something can confirm.',
          'External circumstances are a different matter entirely, and ACT is explicit about this: the committed action half of the model is about changing what you do and therefore what your life contains. A therapist using ACT to encourage someone to accept a harmful situation is misapplying it.',
          'The other frequent misreading is that ACT is anti-CBT. It is not — it emerged from within the cognitive-behavioural tradition, shares its emphasis on behaviour change, and differs mainly in what it does with difficult thoughts. Plenty of clinicians use both, and choosing between them is a question of fit rather than allegiance.',
        ],
      },
    ],
    midCta: {
      text: 'If you understand your patterns completely and nothing has moved,',
      label: 'that is worth fifteen free minutes to talk through',
    },
    faqs: [
      { q: 'Is ACT a type of CBT?', a: 'It comes from the same tradition and is often grouped with it. The main difference is that ACT works on the relationship to thoughts rather than examining their accuracy.' },
      { q: 'Do I have to meditate?', a: 'Mindfulness in ACT is a practical skill for noticing and stepping back, usually practised in brief exercises rather than as formal meditation. Nobody is required to sit for thirty minutes.' },
      { q: 'Does acceptance mean giving up?', a: 'No. It applies to internal experience, not to circumstances. The other half of the model is deliberate action to change what your life contains.' },
      { q: 'How long does it take?', a: 'Comparable to CBT for most presentations — a defined course rather than open-ended work, with length depending on what you are bringing.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
    ],
    related: [
      { href: '/approaches/cognitive-behavioural-therapy', label: 'Cognitive behavioural therapy' },
      { href: '/guides/perfectionism-and-self-criticism', label: 'Perfectionism and self-criticism' },
      { href: '/services/individual-therapy', label: 'Individual therapy' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'internal-family-systems',
    title: 'Internal Family Systems and parts work',
    metaTitle: 'Internal Family Systems (IFS) | Westpeak',
    metaDescription:
      'What parts work involves, why it suits people who feel divided against themselves, and an honest account of where its evidence base currently stands.',
    eyebrow: 'Approach · IFS',
    lede:
      'For the experience of genuinely wanting two opposite things and being unable to reconcile them.',
    shortAnswer:
      'Internal Family Systems treats the mind as made up of parts, each with a protective intention however unhelpful its strategy — the part that wants to leave the job, and the part that is terrified of leaving. The work involves getting to know those parts rather than overruling them. Its clinical following is large; its research base is younger and thinner than CBT\'s, and an honest account says so.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'window-of-tolerance',
    figure2: "confidentiality-limits",
    sections: [
      {
        h2: 'The core idea',
        body: [
          'The starting observation is ordinary: people routinely describe themselves in plural terms. "Part of me wants to leave." "There is a bit of me that sabotages this." "I do not know why I do that — it is not me."',
          'IFS takes that language seriously rather than treating it as a figure of speech. It proposes that the mind naturally operates as a system of parts, and that these parts take on roles — often in response to something difficult — and continue playing them long after the circumstances have changed.',
          'The model distinguishes broadly between **protectors**, which work to prevent pain, and **exiles**, which carry it. Protectors come in two flavours: the managerial kind that tries to prevent problems in advance (the perfectionist, the people-pleaser, the one who over-prepares), and the reactive kind that intervenes when something breaks through (the one that drinks, rages, or shuts down).',
          'The crucial move is that no part is treated as the enemy. A part behaving destructively is understood as protecting something, badly, with the only strategy it has. That reframing is what people most often describe as the useful thing — self-criticism becomes considerably harder to sustain toward a part that turns out to be frightened.',
        ],
      },
      {
        h2: 'What sessions look like',
        body: [
          'IFS sessions are more internally directed than most talking therapy. Rather than describing an event to the counsellor, you are frequently asked to turn attention inward and notice what is present — a tightness, a voice, an urge — and then to get curious about it rather than to argue with it.',
          'Questions tend to be of the form: how do you feel toward that part? What is it worried would happen if it stopped? How long has it been doing this job? It is deliberately slow, and it can feel unusual at first, particularly for people who arrive expecting analysis.',
          'A central concept is that beneath the parts there is a stable, non-reactive perspective the model calls Self — characterised by curiosity, calm and compassion rather than by another agenda. The work is less about a therapist fixing anything and more about establishing that perspective and letting it lead.',
          'It also has a specific safety rule that is worth knowing: protective parts are approached first, and their permission is sought before anything more vulnerable is opened. That sequencing is what keeps the work from flooding someone, and a practitioner who skips it is not doing IFS properly.',
        ],
      },
      {
        h2: 'An honest word on the evidence',
        body: [
          'IFS has a large and enthusiastic clinical following, and its research base is substantially younger and smaller than that of CBT or EMDR. There is early trial evidence and growing interest, and it does not yet sit alongside the first-line trauma treatments in major clinical guidelines.',
          'That is not a reason to dismiss it, and it is a reason to be clear-eyed. The honest position is that many clinicians and clients find it valuable, that the theory is coherent and clinically useful, and that the evidence is not yet at the level that would justify presenting it as established treatment for post-traumatic stress.',
          'Anyone presenting IFS as a proven trauma treatment on a par with the first-line protocols is overstating what currently exists. Anyone dismissing it as unevidenced is also overstating, in the other direction.',
          'Practically, this means that where a well-evidenced protocol exists for what you are bringing — panic, obsessive-compulsive presentations, post-traumatic stress — that protocol is usually the better opening move, with parts work available as an adjunct or an alternative if it does not fit. See [CBT vs EMDR for trauma](/compare/cbt-vs-emdr-for-trauma).',
        ],
      },
      {
        h2: 'Who it tends to suit',
        list: [
          { label: 'People who feel genuinely divided', detail: 'The clearest indication. Where the experience is of two incompatible wants rather than one difficulty, a model built around internal multiplicity fits the experience better than one that does not.' },
          { label: 'Anyone stuck in self-attack', detail: 'Approaching a self-critical part with curiosity rather than argument frequently shifts something that direct challenging has not.' },
          { label: 'People for whom insight has not translated', detail: 'Understanding a pattern completely and continuing to enact it is a common reason people arrive at parts work.' },
          { label: 'Those who find structured protocols alienating', detail: 'IFS is exploratory rather than manualised in the way CBT is, which suits some people considerably better.' },
          { label: 'Less suited where stabilisation is the priority', detail: 'In acute crisis, or where regulation capacity is limited, building that capacity comes first — see [trauma therapy](/services/individual-therapy).' },
        ],
      },
    ],
    midCta: {
      text: 'If "part of me wants to and part of me cannot" describes your situation,',
      label: 'a free 15-minute consultation is a place to start',
    },
    faqs: [
      { q: 'Does IFS mean I have multiple personalities?', a: 'No. The model describes ordinary internal multiplicity that everybody experiences. Dissociative identity disorder is a distinct clinical condition and a different matter entirely.' },
      { q: 'Is it evidence-based?', a: 'It has early trial evidence and a growing research base, considerably smaller than CBT\'s or EMDR\'s. It is not currently a first-line recommendation in major guidelines, and it would be misleading to present it as one.' },
      { q: 'Is it religious or spiritual?', a: 'The model itself is psychological. Some practitioners frame it in spiritual terms and many do not; it is a reasonable thing to ask about beforehand if it matters to you.' },
      { q: 'Can it be combined with other approaches?', a: 'Frequently, yes. Many clinicians use parts language alongside structured approaches rather than as an exclusive method.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Trauma therapy' },
      { href: '/guides/perfectionism-and-self-criticism', label: 'Perfectionism and self-criticism' },
      { href: '/approaches/somatic-therapy', label: 'Somatic therapy' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'somatic-therapy',
    title: 'Somatic and body-based approaches',
    metaTitle: 'Somatic Therapy Explained | Westpeak',
    metaDescription:
      'Why trauma work involves the body, what somatic sessions actually consist of, and how to tell a careful body-based practitioner from an unqualified one.',
    eyebrow: 'Approach · Somatic',
    lede:
      'Because you can know with complete certainty that you are safe and still have a body that has not received the update.',
    shortAnswer:
      'Somatic approaches treat the body as a source of information rather than a passenger — tracking tension, breath, posture and impulse as part of the work. They are used most in trauma treatment, where the nervous system holds a pattern that understanding alone does not reach. They are best regarded as a way of working rather than a single protocol, and the quality of the practitioner matters more here than in more manualised methods.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'window-of-tolerance',
    figure2: "first-session-flow",
    sections: [
      {
        h2: 'Why the body is involved at all',
        body: [
          'The rationale is straightforward once stated. A threat response is a whole-body event — heart rate, muscle tension, breathing, digestion, posture, the impulse to fight, flee or freeze. When that response completes, the system returns to baseline. When it does not, elements of it can persist long after the situation has passed.',
          'That is why someone can understand perfectly well that a past event is over and still find their shoulders up around their ears, their sleep broken, and their body braced in a room where nothing is happening. Insight operates on one system; the pattern is running in another.',
          'It is also why purely verbal approaches sometimes stall on trauma. Talking about an event can be useful, and it does not necessarily reach a nervous system that is not primarily linguistic.',
          'The [window of tolerance](/services/individual-therapy) is the working concept: the band of arousal in which you can feel something and still think about it. Somatic work is largely about noticing where you are in relation to that band, and building the capacity to come back into it deliberately.',
        ],
      },
      {
        h2: 'What sessions actually involve',
        body: [
          'People frequently expect either massage or something mystical. It is neither, and in a virtual practice it involves no physical contact at all.',
          'Practically, sessions involve **tracking** — noticing what is happening in the body as you talk, and naming it. Where the tightness is. What happens to your breath when a particular subject arrives. Whether an impulse appears, to move, to push away, to curl up.',
          '**Titration** is the other core idea: approaching difficult material in small amounts rather than all at once, and returning to something settled in between. This is a deliberate pacing strategy rather than caution for its own sake, and it is what allows difficult material to be approached without flooding.',
          '**Resourcing** builds the other half — deliberately establishing what settles your system, in the body rather than in theory, and practising reaching for it when calm so it is available when not.',
          'Sessions tend to be slower than talking therapy and to contain more silence. For people who arrive wanting to analyse, that pace can be frustrating at first; for people who have analysed extensively and got nowhere, it is frequently the point.',
        ],
      },
      {
        h2: 'Doing it by video',
        body: [
          'Body-based work by video is more workable than people assume, with two genuine caveats.',
          'What transfers well: tracking, breath work, orienting to the room, grounding, titration, and building a repertoire of things that reliably shift your state. All of that is verbal instruction and your own attention, and none of it requires the practitioner to be in the room.',
          'What does not transfer: anything involving touch, and some of the finer observation a practitioner would make of whole-body posture and micro-movement — a camera shows a head and shoulders. A careful clinician compensates by asking more rather than assuming, which is arguably better practice anyway.',
          'The caveat that matters more is safety. Where someone dissociates heavily, the shared physical room provides cues that help re-orient them, and losing those is a real limitation. That is a reason for careful assessment before starting rather than a blanket exclusion, and it is exactly the kind of thing a consultation should establish.',
        ],
      },
      {
        h2: 'Choosing a practitioner carefully',
        body: [
          '"Somatic" describes a family of approaches rather than a single credential, and the range of training behind the word is wider than in most methods. That makes the usual questions more important rather than less.',
          'Ask **what specific training** they have completed and with which body. Several established somatic trainings exist and involve substantial supervised hours; a weekend workshop also exists. Both may be described the same way on a website.',
          'Ask **how they handle dissociation** and what they do if someone destabilises. A careful practitioner has a clear answer involving pacing and stabilisation rather than confidence.',
          'Ask **whether their scope includes touch**, and if so, how consent is handled. In a virtual practice this does not arise; in person it is a question worth asking directly.',
          'And be cautious of claims that the body "stores" specific memories in specific places, or that a particular technique releases trauma held in an organ. These are popular framings that outrun the evidence, and a practitioner making them confidently is telling you something about how they weigh claims. See [how to verify a counsellor in BC](/resources/verify-a-counsellor-in-bc).',
        ],
      },
    ],
    midCta: {
      text: 'If you understand what happened and your body has not caught up,',
      label: 'a free 15-minute consultation is a reasonable next step',
    },
    faqs: [
      { q: 'Does somatic therapy involve touch?', a: 'Some in-person modalities do. This is a fully virtual practice, so no session here involves physical contact — the work is verbal instruction and your own attention.' },
      { q: 'Is it evidence-based?', a: 'Body-based principles are integrated into several well-evidenced trauma treatments. Specific branded somatic modalities vary considerably in how much research supports them, and it is fair to ask a practitioner directly.' },
      { q: 'Do I need to be good at noticing my body?', a: 'No. Difficulty noticing is common, particularly with a trauma history, and building that capacity is part of the work rather than a prerequisite.' },
      { q: 'Is this the same as yoga or breathwork?', a: 'No. Those can be helpful and are not clinical treatment. Somatic therapy is delivered by a registered clinician within a therapeutic frame with defined limits.' },
    ],
    sources: [
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca/' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Trauma therapy' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy' },
      { href: '/guides/what-trauma-actually-means', label: 'What trauma actually means' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'dbt-informed-skills',
    title: 'DBT-informed skills, and what full DBT actually is',
    metaTitle: 'DBT-Informed Skills | Westpeak Wellness',
    metaDescription:
      'The difference between full DBT and DBT-informed individual work, which skills transfer, and when the full programme is what you actually need.',
    eyebrow: 'Approach · DBT skills',
    lede:
      'A great many practices advertise DBT. Very few deliver it, and the distinction is not a technicality.',
    shortAnswer:
      'Full dialectical behaviour therapy is a comprehensive programme — weekly individual sessions, a weekly skills group, between-session phone coaching, and a consultation team for the therapists. Most practices offering "DBT" provide DBT-informed individual work, which uses the skills without the programme around them. That is useful and it is a different thing, and anyone who needs the full model should be told so.',
    updated: '2026-08-08',
    readMinutes: 7,
    figure: 'window-of-tolerance',
    figure2: "first-session-flow",
    sections: [
      {
        h2: 'What full DBT includes',
        body: [
          'DBT was developed for people experiencing intense, fast-moving emotion alongside self-harm and suicidality, and it has strong evidence for that population. Its effectiveness is tied to its structure, which is why the distinction matters clinically rather than only administratively.',
          'The full model has four components running simultaneously. **Weekly individual therapy** with a DBT-trained clinician. **A weekly skills group**, typically running six months to a year, which is where the skills are actually taught. **Between-session phone coaching**, so skills can be applied at the moment they are needed rather than recalled a week later. And **a consultation team** supporting the therapists, which exists because the work is demanding.',
          'Remove the group and you have removed where the teaching happens. Remove the coaching and you have removed the mechanism for applying skills in a crisis. What remains can be helpful and is not the treatment that was tested.',
          'In British Columbia, full programmes are typically delivered through health authority services or specialised private programmes rather than by individual practitioners.',
        ],
      },
      {
        h2: 'The four skill modules',
        list: [
          { label: 'Distress tolerance', detail: 'Getting through an acute crisis without making it worse. Concrete, immediate techniques for the moment when the urge to act is overwhelming — this is the module most often used outside full programmes and the one most immediately useful.' },
          { label: 'Emotion regulation', detail: 'Identifying emotions accurately, reducing vulnerability to intense states, and acting opposite to an emotional urge where the urge is unhelpful.' },
          { label: 'Interpersonal effectiveness', detail: 'Asking for things, declining things, and maintaining relationships and self-respect while doing so — structured to an unusual degree, which people either find clarifying or artificial.' },
          { label: 'Mindfulness', detail: 'The foundation the other three rest on. Practical rather than contemplative: noticing what is happening without immediately reacting to it.' },
          { label: 'The dialectic itself', detail: 'The idea running through all of it: that you can be doing the best you can *and* need to do things differently. Both at once, without either cancelling the other. For people accustomed to being told to choose, that framing is frequently the most useful part.' },
        ],
      },
      {
        h2: 'When DBT-informed work is enough',
        body: [
          'DBT-informed individual work suits someone who is not in crisis, whose difficulty is emotional intensity or interpersonal patterns rather than acute risk, and who needs specific skills rather than a comprehensive programme.',
          'It works well for emotion regulation difficulties within an otherwise stable life, for people who have completed a full programme and want ongoing individual support, and for anyone who finds the structured skills useful without needing the surrounding scaffolding.',
          'It also works well combined with other approaches. Distress tolerance skills in particular are used widely — in trauma work as part of stabilisation, in anxiety work, and in [couples work](/services/couples-therapy) as a way of interrupting escalation.',
          'The honest framing is that these skills are useful to almost anybody and are not, on their own, DBT. A practice describing skills-informed individual work as DBT is at best imprecise.',
        ],
      },
      {
        h2: 'When the full programme is what you need',
        body: [
          'Some situations call for the comprehensive model, and being told so plainly is more useful than a booking.',
          'Recurrent self-harm, current or recent suicidality, and repeated crisis presentations are the clearest indications. So is a pattern of emotional dysregulation severe enough to be repeatedly destabilising relationships, work and housing. Where a borderline personality diagnosis has been made, full DBT has the strongest evidence base of any treatment for it.',
          'In those cases, individual DBT-informed sessions are not a smaller version of the right treatment — they lack the components that make it work, and the phone coaching in particular exists precisely for the moments an individual practice cannot cover.',
          'The route into a full programme in BC generally runs through a health authority mental health service or a specialised private programme, usually with a referral or an assessment. [Psychiatry and assessment in BC](/resources/psychiatry-and-assessment-in-bc) covers how those routes work, and this practice will refer rather than take a booking where that is the honest answer — see [standards](/standards).',
          'If you are in crisis now: **9-8-8** by call or text, **310-6789** in BC, or **9-1-1** in immediate danger.',
        ],
      },
    ],
    midCta: {
      text: 'If you are not sure whether you need skills or the full programme,',
      label: 'a free 15-minute consultation will give you an honest answer',
    },
    faqs: [
      { q: 'Is DBT-informed therapy the same as DBT?', a: 'No. Full DBT includes a skills group, phone coaching and a therapist consultation team alongside individual sessions. DBT-informed work uses the skills without that structure, and is a different intervention.' },
      { q: 'Do I need a diagnosis to use these skills?', a: 'No. The skills are useful across a wide range of difficulties, and a Registered Clinical Counsellor does not diagnose in any case.' },
      { q: 'Where do I find a full DBT programme in BC?', a: 'Usually through a health authority mental health service or a specialised private programme. A referral or assessment is generally required, and waits vary by region.' },
      { q: 'Can DBT skills be taught by video?', a: 'The individual skills work transfers well. The group and coaching components of the full programme are a separate question and depend on the programme.' },
    ],
    sources: [
      { label: 'BC government — mental health and substance use support', url: 'https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: '9-8-8 Suicide Crisis Helpline (Canada)', url: 'https://988.ca/' },
    ],
    related: [
      { href: '/services/individual-therapy', label: 'Individual therapy' },
      { href: '/guides/anger-that-arrives-too-fast', label: 'Anger that arrives too fast' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },

  {
    slug: 'mindfulness-based-approaches',
    title: 'Mindfulness-based approaches, and what an app is not',
    metaTitle: 'Mindfulness-Based Therapy | Westpeak',
    metaDescription:
      'What MBCT and MBSR actually are, what the evidence supports them for, and the specific situations where mindfulness practice is a poor idea.',
    eyebrow: 'Approach · Mindfulness-based',
    lede:
      'The evidence is real, and it is for structured programmes rather than for ten minutes on a phone.',
    shortAnswer:
      'Mindfulness-based cognitive therapy and mindfulness-based stress reduction are structured eight-week programmes with defined curricula and substantial home practice. The evidence is strongest for MBCT in preventing depressive relapse in people who have had several episodes. That is a specific claim about a specific programme, and it does not transfer automatically to an app.',
    updated: '2026-08-08',
    readMinutes: 6,
    figure: 'window-of-tolerance',
    figure2: "approach-selector",
    sections: [
      {
        h2: 'What the structured programmes are',
        body: [
          '**MBSR** — mindfulness-based stress reduction — is an eight-week group programme with weekly sessions of around two and a half hours, a full-day retreat, and daily home practice of roughly forty-five minutes. It was developed for chronic pain and stress and has been studied across a wide range of conditions.',
          '**MBCT** — mindfulness-based cognitive therapy — adapts that structure and adds cognitive elements specifically aimed at depressive relapse. It is delivered in groups, follows a defined curriculum, and carries the strongest evidence of the two for a specific clinical purpose.',
          'The scale of the home practice is the part usually omitted from summaries. These programmes ask for something close to an hour a day for eight weeks. That commitment is not incidental — the outcomes were measured on people doing it.',
          'Both are group programmes with trained facilitators, and they are available in BC through some health authority services, some hospitals and various private providers.',
        ],
      },
      {
        h2: 'What the evidence supports',
        body: [
          'The clearest finding is for **MBCT in preventing relapse in recurrent depression**, particularly for people who have had three or more episodes. It appears in major clinical guidelines for that purpose, which is a meaningful marker.',
          'There is broader evidence for mindfulness-based programmes reducing stress, anxiety symptoms and some chronic pain outcomes, generally with more modest effects and more variable study quality.',
          'What is much weaker is evidence that unstructured app-based practice produces comparable results. Apps are convenient, some have trial evidence behind them, and the effects reported are generally smaller than for the structured programmes. Treating "I use a meditation app" as equivalent to completing MBCT is not supported.',
          'None of which makes apps worthless. It means the honest framing is that they are a low-cost practice tool rather than a clinical treatment, and that someone with recurrent depression who wants what the evidence describes should be looking for an actual MBCT programme.',
        ],
      },
      {
        h2: 'When mindfulness is a poor idea',
        list: [
          { label: 'Untreated trauma without stabilisation', detail: 'The most important caution. Extended silent attention to internal experience can be destabilising for someone with a trauma history — sitting still with eyes closed removes external anchoring and can bring intrusive material forward with no structure around it.' },
          { label: 'Active psychosis', detail: 'Intensive meditation practice is generally contraindicated, and adverse effects from intensive retreats are documented.' },
          { label: 'When it becomes avoidance', detail: 'Practice used to bypass a difficulty rather than to notice it. This is common and hard to spot, because it looks like doing the work.' },
          { label: 'When it becomes another performance', detail: 'For perfectionist patterns, mindfulness can quietly become another domain to fail at — daily streaks, judgement about a wandering mind. That is the pattern reasserting itself in a new setting.' },
          { label: 'As a substitute for treating something treatable', detail: 'Where a specific, well-evidenced protocol exists for a specific difficulty, general mindfulness practice is not a replacement for it.' },
        ],
      },
      {
        h2: 'How it is used in individual counselling',
        body: [
          'Individual sessions here are not MBCT, and it would be inaccurate to describe them as such — that is a defined group programme delivered by trained facilitators.',
          'What individual work does use is mindfulness as a practical skill, in small and specific forms: noticing a thought as a thought rather than as a fact, bringing attention back to the present when rumination starts, and tracking what is happening in the body during a difficult conversation. These are minutes rather than half-hours, applied to a particular difficulty rather than practised generally.',
          'Those elements appear across several approaches — they are central to [ACT](/approaches/acceptance-and-commitment-therapy), foundational in [DBT skills](/approaches/dbt-informed-skills), and part of the stabilisation phase in [trauma therapy](/services/individual-therapy).',
          'Where the structured programme is genuinely what you need — recurrent depression in particular — a consultation should say so and point you toward one rather than offering a diluted version.',
        ],
      },
    ],
    midCta: {
      text: 'If you have tried an app and it did not touch the problem,',
      label: 'that is worth fifteen free minutes to think about properly',
    },
    faqs: [
      { q: 'Is a meditation app as good as MBCT?', a: 'The evidence does not support treating them as equivalent. Apps are a convenient practice tool; MBCT is a structured eight-week programme with a defined curriculum and substantial home practice.' },
      { q: 'Can mindfulness make things worse?', a: 'For some people, yes — particularly with untreated trauma or in intensive formats. Adverse effects are documented and are worth taking seriously rather than dismissing.' },
      { q: 'Do I have to sit still with my eyes closed?', a: 'No. A great deal of practical mindfulness is done with eyes open, briefly, during ordinary activity — which suits people who find formal sitting difficult or unsafe.' },
      { q: 'Is this religious?', a: 'The clinical programmes are secular and were developed for healthcare settings, though the practices have roots in contemplative traditions.' },
    ],
    sources: [
      { label: 'HealthLink BC — mental health and substance use', url: 'https://www.healthlinkbc.ca/mental-health-substance-use' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://bc.cmha.ca/' },
      { label: 'BC government — mental health and substance use support', url: 'https://www2.gov.bc.ca/gov/content/health/managing-your-health/mental-health-substance-use' },
    ],
    related: [
      { href: '/approaches/acceptance-and-commitment-therapy', label: 'Acceptance and commitment therapy' },
      { href: '/services/individual-therapy', label: 'Depression counselling' },
      { href: '/approaches/dbt-informed-skills', label: 'DBT-informed skills' },
      { href: '/approaches', label: 'All approaches' },
      { href: '/book', label: 'Book a free consultation' },
    ],
  },
];

export const getApproach = (slug: string) => approaches.find((a) => a.slug === slug);

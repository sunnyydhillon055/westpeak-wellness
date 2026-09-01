import type { Guide } from './guides';

/* GUIDES WRITTEN AND NOT YET CLEARED TO PUBLISH.
 *
 * Every entry here carries `draft: true`, which keeps it out of `guides` and
 * therefore out of the sitemap, the search index, llms.txt, the feed, the hub
 * and the route's static params. The URLs 404 until the flag is removed.
 *
 * WHY THESE EXIST AS DRAFTS RATHER THAN PAGES
 *
 * These were the two highest-volume named searches missing from the site. They
 * are also the two where getting a detail wrong does the most harm: somebody
 * reading the PTSD page may be deciding whether what happened to them counts,
 * and somebody reading the postpartum page may be deciding whether what they
 * are feeling is dangerous. Neither is a question to answer from a content
 * brief.
 *
 * So the writing is done and the clinical judgement is not. Read them, correct
 * them, and delete `draft: true` on the ones that are right. Nothing else is
 * needed to publish — no build step, no list to update.
 *
 * The seven still to write are listed at the bottom of this file.
 */
export const draftGuides: Guide[] = [
  {
    draft: true,
    slug: 'ptsd-and-complex-ptsd',
    title: 'PTSD and complex PTSD: what the difference actually means',
    metaTitle: 'PTSD and Complex PTSD | Westpeak',
    metaDescription:
      'How PTSD and complex PTSD differ, what treatment actually involves in BC, and why the question of whether it "counts as trauma" is the wrong one.',
    eyebrow: 'Guide · Trauma',
    lede:
      'One is a response to an event. The other is a response to a situation that did not end. The treatments overlap, and the order they are done in does not.',
    shortAnswer:
      'PTSD is a specific, diagnosable response to a traumatic event — intrusion, avoidance, negative changes in mood and thinking, and heightened arousal, persisting more than a month. Complex PTSD describes what follows prolonged, repeated trauma that a person could not escape, usually beginning in childhood or inside a relationship: the same symptoms plus lasting difficulty with emotional regulation, self-worth, and closeness to other people. The practical difference is sequencing. Trauma-focused work such as EMDR is effective for both, but with complex presentations the stabilisation that comes first is longer and is not an optional preliminary.',
    updated: '2026-08-17',
    readMinutes: 9,
    figure: 'window-of-tolerance',
    figure2: 'emdr-phases',
    sections: [
      {
        h2: 'The question almost everybody arrives with',
        body: [
          '"Does what happened to me actually count?" It is the most common opening question on this subject and it is worth answering directly: **the severity of an event is not what determines whether you develop PTSD.** Two people can go through the same crash and one develops it. That is not a statement about resilience or character — it is a statement about how a nervous system encoded a particular few minutes.',
          'The diagnostic criteria do require exposure to death, threatened death, serious injury or sexual violence — directly, as a witness, by learning it happened to someone close, or through repeated exposure to details of it, which is why first responders and healthcare workers qualify through their work. But a great many people who do not meet that threshold still have a trauma response worth treating, and the treatments do not check for a diagnosis first.',
          'If you are trying to decide whether you are entitled to be affected, that question is itself usually a symptom rather than an assessment. It is common enough that it has a name in the literature — a comparison to a "real" victim who had it worse.',
        ],
      },
      {
        h2: 'What PTSD looks like from the inside',
        list: [
          { label: 'Intrusion', detail: 'Memories that arrive without being summoned, nightmares, or flashbacks in which some part of the event is happening again rather than being recalled. The distinguishing feature is not vividness but involuntariness.' },
          { label: 'Avoidance', detail: 'Steering away from people, places, conversations or internal states that might bring it near. This is the symptom that quietly shrinks a life, because each avoidance is individually reasonable.' },
          { label: 'Changes in mood and thinking', detail: 'Persistent negative beliefs about yourself or the world, distorted blame — often self-blame — emotional numbness, and losing interest in things that mattered. Gaps in memory for parts of the event are common and are not evidence you are making it up.' },
          { label: 'Arousal and reactivity', detail: 'Startling easily, scanning for threat, irritability or anger that arrives faster than it used to, difficulty sleeping and difficulty concentrating. This is the part that is often mistaken for a personality change.' },
        ],
      },
      {
        h2: 'What "complex" adds',
        body: [
          'Complex PTSD is recognised in the World Health Organization\'s ICD-11 as its own diagnosis. It is not in the DSM-5 as a separate category, which is why you will encounter clinicians in Canada who use the term freely and clinicians who do not — that is a difference in diagnostic manual, not a disagreement about whether the presentation is real.',
          'It describes what follows trauma that was **prolonged, repeated, and difficult or impossible to escape**: childhood abuse or neglect, domestic violence, trafficking, captivity, sustained persecution. On top of the core PTSD symptoms, three further clusters appear — difficulty regulating emotion, a persistent sense of being diminished or worthless, and enduring difficulty feeling close to other people.',
          'The distinction matters clinically because of what it implies about the nervous system. A single traumatic event interrupts an otherwise regulated system. Prolonged inescapable trauma shapes the system as it develops, so there is often no earlier baseline of regulation to return to — it has to be built rather than restored. That is why the stabilisation phase is longer, and why moving into memory processing too quickly tends to destabilise rather than help.',
        ],
      },
      {
        h2: 'What treatment actually involves',
        body: [
          'The therapies with the strongest evidence for PTSD are **trauma-focused CBT**, **EMDR**, and **prolonged exposure**. All three work by changing how a memory is stored rather than by discussing it until it feels better, and all three are structured — they have phases, and the phases are in an order for a reason.',
          '[EMDR](/services/emdr-therapy) is the approach used most often in this practice, and [what an EMDR session actually involves](/guides/what-is-emdr-and-how-a-session-works) sets out the mechanics. The part worth knowing in advance is that the first phase is not memory work at all: it is history-taking and building the capacity to come back down from distress reliably. With a complex presentation that phase can run for months, and a counsellor who skips it to get to the "real" work is doing you a disservice.',
          'You do not have to narrate the event in detail for EMDR to work. This surprises people, and it is one of the reasons it is often tolerable for those who cannot face telling the story aloud.',
        ],
      },
      {
        h2: 'What counselling is not the right route for',
        body: [
          '**A formal diagnosis.** A Registered Clinical Counsellor does not diagnose. If a diagnosis is needed for a disability claim, an insurer or a legal process, that requires a psychologist or a physician — [psychiatry and assessment in BC](/resources/psychiatry-and-assessment-in-bc) explains the routes and why they are priced differently.',
          '**Medication.** Some people are helped considerably by it alongside therapy, particularly where sleep has collapsed. That conversation belongs with a physician or nurse practitioner, and [therapy, medication, or both](/compare/therapy-medication-or-both) covers how the decision is usually made.',
          '**Active crisis.** This practice runs scheduled sessions with no on-call line. If you are in immediate danger call 9-1-1. For urgent mental-health support in BC at any hour, call or text **9-8-8**, or call **310-6789**.',
        ],
      },
      {
        h2: 'Paying for it',
        body: [
          'If the trauma followed a **motor vehicle crash in BC**, ICBC pre-approves twelve counselling sessions with a Registered Clinical Counsellor in the first twelve weeks and **no doctor\'s note is required** to begin. This is the most underused entitlement in the province.',
          'If it followed a **violent crime**, the Crime Victim Assistance Program funds a course of counselling rather than a handful of sessions.',
          'Otherwise most BC extended health plans that cover an RCC cover this work on the same terms as any other counselling — [what BC plans actually cover](/resources/bc-extended-health-coverage-for-counselling) sets out how to check yours, and [how referrals work](/refer) lists the funded routes in one place.',
        ],
      },
    ],
    midCta: {
      text: 'A free 15-minute consultation is enough to work out whether trauma-focused work is the right next step, and whether now is the right time for it — including if the honest answer is that stabilisation comes first.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I have PTSD from something that was not life-threatening?', a: 'You can certainly have a trauma response, and it is treatable with the same approaches. The formal PTSD criteria do require exposure to death, threatened death, serious injury or sexual violence, so some presentations sit outside the diagnosis. That is a labelling question rather than a treatment question — nobody is turned away for failing to qualify, and the therapies do not check first.' },
      { q: 'Is complex PTSD a real diagnosis in Canada?', a: 'It is a formal diagnosis in the WHO\'s ICD-11, and it is not a separate category in the DSM-5, which many Canadian clinicians also use. So you will meet practitioners who use the term routinely and practitioners who describe the same presentation as PTSD with additional features. Both are describing something real; they are working from different manuals.' },
      { q: 'Will I have to describe what happened in detail?', a: 'Not for EMDR. The processing works on the memory as it is held rather than on a narrated account of it, and many people do considerably less telling than they expect. You will need to give enough history for the counsellor to plan safely, but that is not the same as recounting the event.' },
      { q: 'How long does trauma treatment take?', a: 'For a single-incident trauma in an otherwise stable life, meaningful change within eight to twelve sessions is common. For a complex presentation the honest answer is longer, and most of the additional time is stabilisation rather than memory work. Anyone offering a fixed number before meeting you is guessing.' },
      { q: 'Can this be done online?', a: 'Yes, including EMDR — the bilateral stimulation is delivered on screen or with sound, and the evidence for virtual delivery is good. What matters more than the format is that the first phase is not rushed. If you are outside the Lower Mainland it is frequently the only way to reach a trauma-trained counsellor at all.' },
    ],
    sources: [
      { label: 'World Health Organization — ICD-11, complex post-traumatic stress disorder', url: 'https://icd.who.int/browse11/l-m/en' },
      { label: 'CAMH — post-traumatic stress disorder', url: 'https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/post-traumatic-stress-disorder' },
      { label: 'ICBC — recovery and counselling benefits', url: 'https://www.icbc.com/claims/injury/Pages/treatment-and-recovery.aspx' },
      { label: 'Crime Victim Assistance Program — Government of BC', url: 'https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/vsap' },
    ],
    related: [
      { href: '/guides/what-trauma-actually-means', label: 'What trauma actually means' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy' },
      { href: '/guides/what-is-emdr-and-how-a-session-works', label: 'What an EMDR session involves' },
      { href: '/compare/cbt-vs-emdr-for-trauma', label: 'CBT or EMDR for trauma?' },
      { href: '/guides/intergenerational-trauma-explained', label: 'Intergenerational trauma' },
    ],
  },

  {
    draft: true,
    slug: 'postpartum-depression-and-anxiety',
    title: 'Postpartum depression and anxiety: what it is, and what it is not',
    metaTitle: 'Postpartum Depression and Anxiety | Westpeak',
    metaDescription:
      'How postpartum depression and anxiety differ from the baby blues, when intrusive thoughts are and are not dangerous, and where to get help in BC.',
    eyebrow: 'Guide · New parents',
    lede:
      'Most of what frightens new parents about their own minds is common, treatable, and not what they fear it is. A small part of it is urgent. The difference is knowable.',
    shortAnswer:
      'The baby blues affect most new mothers, peak around day three to five, and lift on their own within about two weeks. Postpartum depression is more persistent and more disabling, affects roughly one in seven, and can begin any time in the first year — in either parent. Postpartum anxiety is at least as common and is missed more often, because a frightened new parent looks like a normal new parent. All three are treatable, and none is caused by weakness or by not loving the baby. Unwanted intrusive thoughts about harm coming to the baby are a recognised and common feature of postpartum anxiety and OCD, and are distinct from postpartum psychosis, which is rare, different in character, and a medical emergency.',
    updated: '2026-08-17',
    readMinutes: 9,
    figure: 'anxiety-avoidance-cycle',
    sections: [
      {
        h2: 'The distinction that matters most, first',
        body: [
          'A great many new parents experience sudden, vivid, unwanted thoughts of harm coming to their baby — dropping them on the stairs, something happening in the bath. These are called **intrusive thoughts**, they are common in postpartum anxiety and postpartum OCD, and they are **ego-dystonic**: they horrify the person having them. That horror is the point. Someone terrified by such a thought, who then avoids stairs or baths, is displaying anxiety, not intent.',
          'This is worth stating plainly because the fear of being judged dangerous is exactly what stops people telling anyone, and the silence is what allows a treatable condition to run for a year.',
          '**Postpartum psychosis is a different thing.** It is rare — roughly one to two births in a thousand — and it usually begins within the first two weeks. It involves losing contact with reality: beliefs that are not true and held with conviction, hearing or seeing things others do not, severe confusion, or a marked change in behaviour, often with no insight that anything is wrong. It is a **medical emergency**. If that is what is happening, call 9-1-1 or go to an emergency department now, and do not leave the person alone.',
        ],
      },
      {
        h2: 'Blues, depression, anxiety',
        list: [
          { label: 'The baby blues', detail: 'Tearfulness, mood swings, irritability and feeling overwhelmed. Affects the majority of new mothers, peaks around day three to five as hormones shift, and resolves without treatment inside about two weeks. If it has not lifted by then, it is worth treating as something else.' },
          { label: 'Postpartum depression', detail: 'Persistent low mood, loss of interest, guilt, difficulty bonding, exhaustion beyond what the sleep loss explains, and thoughts of being a burden or that the family would be better off. Roughly one in seven. It can begin at any point in the first year, not only in the first weeks.' },
          { label: 'Postpartum anxiety', detail: 'Constant worry, physical tension, racing thoughts, checking the baby repeatedly through the night, an inability to rest even when someone else has the baby. At least as common as depression and much more often missed, because vigilance in a new parent reads as conscientious.' },
          { label: 'Postpartum OCD', detail: 'Intrusive thoughts paired with compulsions intended to prevent the feared outcome — repeated checking, cleaning rituals, avoiding being alone with the baby. Recognised and treatable, and frequently mistaken by the sufferer for evidence of being dangerous.' },
          { label: 'In the non-birthing parent', detail: 'Fathers and non-birthing partners develop postpartum depression too, at rates commonly estimated near one in ten. It is screened for far less, and often presents as irritability, withdrawal or working later rather than as visible sadness.' },
        ],
      },
      {
        h2: 'Why it is missed so often',
        body: [
          'Almost every symptom overlaps with the normal condition of having a newborn. Exhaustion, disrupted sleep, appetite changes, tearfulness and a narrowed world are what the first months look like anyway. So the question that separates them is not *what* you are feeling but **how long, how much of the day, and whether anything shifts it** — a parent with the blues has better hours; a parent with postpartum depression often does not.',
          'The second reason is that the screening question is usually asked once, at a six-week appointment, of someone who has every reason to answer it well. Onset after that visit is common and there is frequently no second ask.',
          'The third is cultural. In families where a new mother is surrounded by relatives and expected to be visibly grateful, saying that something is wrong can read as an accusation against people who are helping. [Counselling for South Asian intergenerational conflict](/for/south-asian-intergenerational-conflict) and [counselling for new parents](/for/new-parents) both deal with that directly, and it can be worked through in Punjabi or English.',
        ],
      },
      {
        h2: 'What actually helps',
        body: [
          '**Therapy has good evidence here, and CBT and interpersonal therapy have the strongest.** Both are structured and both are short enough to be realistic for someone with a newborn — which matters more in this population than in almost any other, because the barrier is rarely willingness and almost always time.',
          '**Medication is compatible with breastfeeding in many cases.** A great many people suffer through a year rather than ask, because they assume the answer is no. It is a question for a physician or nurse practitioner and it is worth asking rather than assuming.',
          '**Sleep is treatment, not a luxury.** A single uninterrupted five-hour block, arranged by someone else taking a feed, does more for mood than most interventions. It is often the first thing worth engineering.',
          'Sessions here are by video, which for a new parent is frequently the difference between attending and not — there is no travel, no parking, and a baby in the room is not a problem.',
        ],
      },
      {
        h2: 'Where to get help in BC',
        list: [
          { label: 'Pacific Post Partum Support Society', detail: 'BC-wide telephone and text support line and support groups, staffed by people trained in perinatal distress. Free. This is usually the fastest route to speaking to somebody who has heard it before.' },
          { label: 'Your public health nurse', detail: 'Every health authority in BC runs postpartum follow-up, and a public health nurse can screen and refer. This route is free and already open to you.' },
          { label: 'Your family doctor, midwife or nurse practitioner', detail: 'The route to assessing medication and to a referral for a reproductive-mental-health specialist where one is needed.' },
          { label: 'HealthLink BC — 8-1-1', detail: 'Free health advice at any hour from a registered nurse, including whether something needs to be seen today.' },
          { label: 'Urgent support', detail: 'Call or text 9-8-8 at any hour. For suspected postpartum psychosis, call 9-1-1 or attend an emergency department — that one does not wait.' },
        ],
      },
    ],
    midCta: {
      text: 'A free 15-minute consultation can work out whether counselling is the right step, and it is a reasonable place to say the thing out loud that you have not said to anybody yet.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'I have thoughts about my baby being harmed. Am I dangerous?', a: 'Unwanted intrusive thoughts that frighten and disgust you are a recognised feature of postpartum anxiety and OCD, and the distress they cause is what distinguishes them from intent. They are common and treatable. What is different, and urgent, is losing contact with reality — believing something untrue with conviction, or hearing or seeing things others do not. That is postpartum psychosis, and it needs emergency care today rather than an appointment.' },
      { q: 'How do I tell postpartum depression from being exhausted?', a: 'Duration and range. The blues lift within about two weeks and allow better hours in between. Postpartum depression persists beyond that, occupies most of most days, and is not shifted by a good night or by help arriving. If you are asking the question at all past the two-week mark, it is worth raising with a clinician.' },
      { q: 'Can fathers and non-birthing parents get this?', a: 'Yes, at rates commonly estimated around one in ten. It is screened for far less often and tends to present as irritability, withdrawal, or working longer rather than as visible low mood, so it is frequently identified late or not at all.' },
      { q: 'Can I take medication while breastfeeding?', a: 'Often yes. Several antidepressants are used routinely during breastfeeding and the specifics belong with a physician, nurse practitioner or pharmacist. It is worth asking rather than assuming the answer is no — that assumption costs people months.' },
      { q: 'It has been eight months. Is it too late for this to be postpartum?', a: 'No. Onset can occur at any point in the first year, and late onset is common enough that "it started at seven months so it must be something else" is a frequent and unhelpful conclusion. The treatment does not change based on when it began.' },
    ],
    sources: [
      { label: 'Pacific Post Partum Support Society', url: 'https://postpartum.org/' },
      { label: 'HealthLink BC — depression after childbirth', url: 'https://www.healthlinkbc.ca/pregnancy-parenting/postpartum/depression-after-pregnancy' },
      { label: 'BC Reproductive Mental Health Program', url: 'http://reproductivementalhealth.ca/' },
      { label: 'Public Health Agency of Canada — perinatal mental health', url: 'https://www.canada.ca/en/public-health/services/publications/healthy-living/maternal-mental-health.html' },
    ],
    related: [
      { href: '/for/new-parents', label: 'Counselling for new parents' },
      { href: '/guides/intrusive-thoughts-and-what-they-mean', label: 'Intrusive thoughts and what they mean' },
      { href: '/services/individual-therapy', label: 'Anxiety counselling' },
      { href: '/guides/anxiety-and-sleep', label: 'Anxiety and sleep' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
    ],
  },

  /* The first two entries from CONTENT_CALENDAR.md, written on schedule
   * (2026-08-28; the calendar calls for early and late August). Same deal as
   * the drafts above: written, sourced, and waiting on a clinical read. The
   * calendar is explicit that seasonal pieces publish six-to-eight weeks
   * before their peak — so these lose value each week the flag stays on. */
  {
    draft: true,
    slug: 'back-to-school-for-the-parent',
    title: 'Back to school, for the parent',
    metaTitle: 'Back to School, for the Parent | Westpeak Wellness',
    metaDescription:
      'Everything written about September is addressed to children. This is for the parent whose own anxiety returns with the routine — and the household that tightens with it.',
    eyebrow: 'Guide · Seasonal',
    lede:
      'Every September article is about helping your child adjust. Almost none of them ask how you are — which is strange, because the school year restarts the whole household, not just the child.',
    shortAnswer:
      'The September shift is real for adults: mornings recompress, the family calendar refills, work and school schedules collide, and long-running household arguments that summer suspended come back on schedule. If your own anxiety, irritability or dread rises with the routine, that is a common and understandable response to a genuine load increase — not a failure of parenting. It becomes worth attention when the tension stops lifting on weekends, when you are snapping at people over the logistics rather than the problem, or when you notice you have stopped being anyone other than the coordinator.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'Why September lands on the parent',
        body: [
          'Summer, whatever its chaos, suspends the machine: no lunches at 7:10, no forms due Friday, no negotiation about screens on a school night, no standing arguments about whose turn the pickup is. September switches the machine back on all at once — and the switch is thrown mostly by one or two adults, on top of jobs that never paused.',
          'There is also a quieter layer underneath the logistics. The school year is the calendar most of us grew up inside, and its return can reactivate old material with surprising precision: your own school dread, a childhood home where September meant tension, the standards you were measured against now waiting at the school gate for your child. Feeling more raw in September than August is not random.',
          'And for parents of anxious children there is a particular loop worth naming: your child’s school worry feeds yours, yours leaks back to them — children are exceptional detectors of parental tension — and each of you is trying to manage the other’s state. Breaking that loop from the parent’s side is often the most effective place to start, which is the opposite of how the advice columns frame it.',
        ],
      },
      {
        h2: 'Ordinary September strain, named',
        list: [
          { label: 'The coordinator problem', detail: 'One adult usually holds the entire system — forms, fees, lessons, appointments, who needs shoes. The load is real, largely invisible, and rarely negotiated explicitly. Resentment about it is a September fixture in couples, and it is a workload problem before it is a relationship problem.' },
          { label: 'The morning compression', detail: 'The hour before school concentrates the whole household into its worst window: everyone tired, everyone on a deadline, every friction surfacing at once. Households that fight at 7:40 a.m. and nowhere else do not have a conflict problem so much as a design problem.' },
          { label: 'The re-entry of comparison', detail: 'School restarts the parent-comparison economy — the volunteering, the extracurricular arms race, the parents who appear to be managing effortlessly. If your self-criticism spikes in September, this is part of the mechanism.' },
          { label: 'The suspended arguments', detail: 'Couples often table their structural disagreements — money, division of labour, in-laws, schooling itself — for the summer. September un-tables them on a fixed schedule. If the same fight returns every fall, it was never about fall.' },
        ],
      },
      {
        h2: 'What actually helps, before anyone books anything',
        body: [
          'Renegotiate the machine explicitly, once, in September — not mid-argument at 7:40. Who owns which mornings, who is the school’s point of contact, what happens when a child is sick on a day neither of you can absorb. Most households run on an implicit division that was never actually agreed to, and a thirty-minute explicit version removes a surprising amount of ambient resentment.',
          'Put your own state on the list you are already keeping. The parent version of the oxygen-mask rule is unglamorous: sleep protected first, one thing in the week that is yours and not logistics, and honesty with yourself about whether coffee and pushing through is a September strategy or a permanent one.',
          'And let the standard be a September standard. The first weeks of the school year are a load spike; running the household at summer’s emotional temperature through a load spike is not a realistic target, and treating the gap as personal failure just adds a second problem.',
        ],
      },
      {
        h2: 'When it is more than the season',
        body: [
          'Some September strain is simply September, and settles as the routine beds in. It is worth taking more seriously when the pattern outlasts the adjustment: dread on Sunday nights that does not fade by October, irritability that the weekend no longer resets, sleep that stays broken after the schedule has stabilised, or the realisation that you have been running on vigilance so long that calm itself feels unfamiliar.',
          'It is also worth attention if September has merely exposed something that was there all year — a marriage conducted entirely in logistics, anxiety that was managed only because summer made fewer demands, or a version of yourself you do not recognise and do not like at 7:40 a.m. The season did not cause that; it removed the slack that was hiding it. That is unwelcome information, and useful.',
          'Counselling for this does not require a crisis to justify it. A parent who wants to stop white-knuckling the school year is a complete reason to book, and sessions by video — after drop-off, in a lunch hour — were more or less designed for this stage of life.',
        ],
      },
    ],
    midCta: {
      text: 'If the school year is running you rather than the reverse, one session after drop-off is a reasonable place to start — no crisis required.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is it normal to dread September as an adult?', a: 'Common enough that it deserves less embarrassment than it gets. The return of structure, scrutiny and load is a genuine change in demands, and calendars carry memory — the school year is the oldest calendar most of us have. Dread that fades as the routine beds in is ordinary; dread that deepens through October is worth attention.' },
      { q: 'My child is anxious about school and now I am too. Which of us needs the help?', a: 'They tangle, but the parent’s side is more in your control and often the more effective place to start — children calibrate to the adult’s state far more than to the adult’s advice. Working on your own regulation is not instead of supporting your child; it is frequently the strongest form of it. Kelty Mental Health is BC’s hub for the child’s side.' },
      { q: 'Every September my partner and I have the same fight. Why?', a: 'Because September re-runs the same structural collision — usually about the division of the invisible workload — and unresolved structure produces the same argument on the same schedule. That predictability is actually good news: a fight with a known trigger and a known shape is exactly the kind couples work handles well.' },
      { q: 'I only feel like this a few weeks a year. Does that justify counselling?', a: 'A recurring, predictable strain is a legitimate and rather efficient thing to bring to counselling — the pattern is visible, the trigger is known, and the work can be timed to precede it. You do not need year-round misery to qualify for help with a seasonal collapse.' },
    ],
    sources: [
      { label: 'Kelty Mental Health Resource Centre (BC)', url: 'https://keltymentalhealth.ca/' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/for/new-parents', label: 'Counselling for new parents' },
      { href: '/guides/high-functioning-anxiety', label: 'High-functioning anxiety' },
      { href: '/guides/anxiety-and-sleep', label: 'Anxiety and sleep' },
      { href: '/services/couples-therapy', label: 'Couples therapy' },
      { href: '/services/individual-therapy', label: 'Anxiety counselling' },
    ],
  },

  {
    draft: true,
    slug: 'starting-university-away-from-home',
    title: 'Starting university away from home',
    metaTitle: 'Starting University Away From Home | Westpeak Wellness',
    metaDescription:
      'Homesickness, the friendship gap, and the first-year dip nobody warns you about — plus the BC supports every student already has, including free 24/7 counselling.',
    eyebrow: 'Guide · Seasonal',
    lede:
      'The move-in photos get taken in the first week. This guide is about weeks four through ten — the stretch where it stops being an event and starts being your life.',
    shortAnswer:
      'Struggling in first term while living away from home for the first time is closer to the rule than the exception: homesickness is normal and usually eases, the deep friendships take months rather than weeks to form, and a dip in mood once the novelty fades is common enough to be predictable. It deserves more than waiting out when low mood settles in for weeks, when you have stopped attending or leaving your room, or when coping has drifted into heavy drinking or disappearing into a screen. Every BC post-secondary student also has free, immediate support already paid for — Here2Talk offers 24/7 counselling to all of them, and campus counselling exists precisely for this.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'The timeline nobody puts on the poster',
        body: [
          'Orientation compresses the advertised version of university — instant friends, constant activity — into two weeks, and then withdraws it. What follows, for a large share of first-years, is quieter and longer: lectures where nobody knows your name, a residence room that is yours but not home, and the discovery that the people from orientation week were allies of convenience rather than friends.',
          'The dip that often arrives around week four to six has an unremarkable explanation. Novelty has worn off, the workload has become real, the weather in most of BC has turned, and the friendships that will eventually carry you have not formed yet — because they take repeated, unforced contact over months. You are, briefly, between support systems: no longer inside the old one, not yet inside the new one. Feeling the gap is not failing at university. It is the gap.',
          'Knowing the timeline matters because the comparison everyone runs — *everyone else has found their people* — is mostly a misread. The groups that form instantly in September are frequently gone by December; the durable ones assemble slowly out of labs, clubs, part-time jobs and corridors, without announcing themselves.',
        ],
      },
      {
        h2: 'Homesickness, without the embarrassment',
        body: [
          'Homesickness gets treated as a childish word, so students rename it — restlessness, "just tired", not liking the city. Underneath, it is a grief-shaped response to a real loss: daily contact with the people and routines that regulated you. Missing that is not immaturity; it is evidence you had something worth missing.',
          'Two opposite mistakes make it worse. Going home every weekend keeps the old system on life support and quietly starves the new one — the weekends are when the new place becomes yours. Cutting contact entirely to force independence usually backfires too; regular, scheduled contact with home tends to steady people better than either extreme.',
          'For students from close families — and in many Punjabi and wider South Asian households this is the explicit design — leaving can also carry a layer nobody on campus talks about: guilt about leaving, parents for whom your absence is their own loss, and daily calls that are both an anchor and a leash. Holding real closeness *and* a growing separate life is genuinely hard, and it is a legitimate thing to work on rather than a disloyalty to either side.',
        ],
      },
      {
        h2: 'The support you already have, as a BC student',
        list: [
          { label: 'Here2Talk — free, 24/7, already yours', detail: 'Every student registered at a BC post-secondary institution has free single-session counselling by app, phone or chat, day and night, in multiple languages. No diagnosis, no referral, no cost. For a hard night in residence, this is the shortest path to a real person.' },
          { label: 'Campus counselling and health services', detail: 'Every major BC campus runs a counselling service covered by your fees. Demand peaks late in term, so booking when you first notice the slide — rather than at the December cliff — is the practical move.' },
          { label: 'Your student health and dental plan', detail: 'Most student unions carry extended health coverage that reimburses private counselling, commonly including Registered Clinical Counsellors. If campus waitlists are long, the plan usually funds an alternative — check its wording for the professions covered and the annual cap.' },
          { label: 'Structure as treatment', detail: 'The undramatic levers still carry most of the load: a sleep schedule that survives weekends, food at intervals, one activity with repeated contact (club, gym, job, faith community), and daylight — which in a BC October must be sought on purpose.' },
        ],
      },
      {
        h2: 'When it has stopped being an adjustment',
        body: [
          'Adjustment is uncomfortable but moves — bad weeks alternate with better ones, and small things still land. It has become something else when the line goes flat: weeks of low mood without a better stretch, sleep broken or endless, attendance quietly stopping, the room becoming the whole map, or alcohol, cannabis or the phone doing all of the regulating. Panic attacks arriving out of nowhere, or anxiety that makes ordinary tasks feel structurally impossible, belong on the same list.',
          'The move at that point is not more willpower; it is telling someone with an obligation to help — Here2Talk tonight if it is tonight, campus counselling this week, a doctor at student health if sleep, appetite and energy have been gone for weeks. If cost or waitlists are the obstacle to ongoing support, private counselling by video fits student life unusually well and is often partly covered by the student plan; it also does not care which town your campus is in.',
          'One more thing, for the student reading this in November having told their parents everything is fine: the version where you ask for help earlier is not the weaker version of you. Every term, a share of students quietly repair a bad start and finish well — the common feature is that they stopped managing it alone.',
        ],
      },
    ],
    midCta: {
      text: 'Sessions by video fit between lectures and do not care which campus you are on. A free 15-minute consultation is the least committal way to start.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'How long is homesickness supposed to last?', a: 'For most students it eases substantially across the first term as the new place accumulates its own routines and people — usually with wobbles rather than a straight line, and often with a spike after winter break. Homesickness still at full strength deep into second term, or getting worse rather than moving, is a signal to talk to someone rather than wait longer.' },
      { q: 'Is it bad to go home every weekend?', a: 'It is usually self-defeating during first term, because weekends are when a campus becomes yours — the unstructured time where friendships actually form. Regular contact with home helps; wholesale retreat to it postpones the adjustment you are trying to make. A middle setting, like scheduled calls plus occasional visits, steadies most people better than either extreme.' },
      { q: 'What is Here2Talk and is it actually free?', a: 'A provincially funded service giving every BC post-secondary student free 24/7 single-session counselling and community referral, by app, phone or web chat, with service available in multiple languages. There is no cost, no referral and no minimum severity — a homesick 2 a.m. absolutely qualifies.' },
      { q: 'Can I do therapy with someone back home, or in Punjabi?', a: 'Virtual counselling works wherever you and a stable internet connection are, which for students means the counsellor no longer has to be in your campus town. Sessions here run in English, Punjabi, or both — and for a student negotiating family expectations about the degree itself, working in the language the family speaks can matter more than expected.' },
      { q: 'My marks are collapsing along with my mood. Which do I deal with first?', a: 'Together, and sooner than feels comfortable — universities have academic-concession processes for exactly this, and they work much better before finals than after. A doctor’s or counsellor’s documentation usually supports the concession, which is one more reason the appointment is worth booking now rather than in exam week.' },
    ],
    sources: [
      { label: 'Here2Talk — 24/7 counselling for BC post-secondary students', url: 'https://here2talk.ca' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/resources/student-mental-health-supports-bc', label: 'Student mental-health supports in BC' },
      { href: '/guides/loneliness-in-adulthood', label: 'Loneliness in adulthood' },
      { href: '/guides/life-transitions-and-identity', label: 'Life transitions and identity' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
      { href: '/guides/signs-it-might-be-time-for-therapy', label: 'Signs it might be time for therapy' },
    ],
  },

  /* Items 1–4 of the still-to-write list, drafted 2026-08-28. Items 5–7 were
   * checked before writing, per the note that used to sit at the bottom of
   * this file, and all three resolved to "already absorbed": the intrusive-
   * thoughts guide carries the OCD threshold and treatment sections (depth3),
   * anxiety-and-sleep carries CBT-I, and low-mood-through-a-bc-winter carries
   * the is-it-actually-seasonal section. Writing competing pages would have
   * split what already ranks. That closes the list: everything measured as
   * missing is now either published or below, awaiting clinical read. */
  {
    draft: true,
    slug: 'separation-and-divorce',
    title: 'Separation and divorce: the part nobody plans for',
    metaTitle: 'Separation & Divorce Counselling | Westpeak',
    metaDescription:
      'The emotional work of ending a marriage — deciding, telling people, grieving a future — and where counselling fits at each stage. BC resources included.',
    eyebrow: 'Guide · Relationships',
    lede:
      'There is a version of this page about lawyers and paperwork. This is the other one — about the two years of feeling that surround the paperwork on every side.',
    shortAnswer:
      'Separation is usually lived in three overlapping stretches: the deciding, which can take years and is often the loneliest part; the ending itself, which runs on logistics while the feelings queue up behind them; and the after, which is a grief — for the marriage there was, and for the future that had been assumed. Counselling has a different job in each: clarity work while deciding, steadying work through the ending, and grief work after. None of it requires the divorce to be anyone’s fault, and none of it requires you to be coping badly to deserve support.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'The deciding, which is its own long season',
        body: [
          'Most marriages do not end at a single moment. They end across a long stretch of private arithmetic — should I stay, is this fixable, what would it do to the kids, who would I even be — conducted mostly alone, often for years, usually while performing normal at work and at dinner. If you are in that stretch now, the isolation of it is worth naming: you are carrying a decision you cannot discuss with the person you usually discuss things with.',
          'Counselling during this stretch is not a commitment to leaving. It is a place to think at full volume — to say the unsayable versions out loud and find out which ones survive being spoken. Some people discover the marriage is worth another real attempt, and arrive at couples work with something to work with. Others discover the decision was already made and what they needed was permission to know it. Both are successes.',
          'One distinction does real work here: the difference between *I am unhappy in this marriage* and *I am unhappy, and I am in this marriage*. Depression, burnout and midlife grief can all wear a marriage as their explanation. Untangling which is which — before acting on it — is precisely the kind of thing a counsellor who has no stake in your answer is for.',
        ],
      },
      {
        h2: 'The ending, which runs on logistics',
        body: [
          'Once a separation is spoken, life becomes procedural for a while: who lives where, what the money does, what the children are told, who gets told next and in what order. The feelings do not go away during this stretch — they queue. Many people describe functioning eerily well for months and then being levelled by something small, long after everyone assumed they were fine. That is the queue emptying, and it is normal.',
          'Two practical notes for this stretch. First, the legal and the emotional run on different clocks and should be kept apart deliberately: decisions with long consequences — parenting arrangements, property — deserve to be made slowly and advised properly, not settled in the heat of the worst week. Legal Aid BC’s family-law site is the standard free starting point for the BC legal side, and nothing on this page is legal advice.',
          'Second, if there are children, the research consensus is blunt and useful: children’s outcomes track the *conflict they are exposed to* far more than the separation itself. The single most protective thing separating parents control is what the children see and overhear. Counselling — individual or co-parenting focused — earns its keep here more than anywhere.',
        ],
      },
      {
        h2: 'The after, which is a grief',
        body: [
          'Divorce grief is real grief with two complications. It is grief for someone still alive — possibly someone you must co-parent with on Tuesdays — and it is grief for a future rather than only a past: the retirement that will not happen, the family table that will not look that way, the version of yourself that existed inside the marriage. The future-loss is the part that blindsides people, because nothing in the paperwork names it.',
          'It is also one of the few griefs that arrives with an audience holding scorecards. People will want to know whose fault it was, will take sides, will offer congratulations or condolences on a schedule that has nothing to do with yours. Feeling relief and devastation in the same afternoon is not confusion — it is the accurate response to losing something that was both loved and unlivable.',
          'The timeline is longer than the culture pretends. A year of acute upheaval and a second year of rebuilding is a perfectly ordinary course, and "shouldn’t I be over this by now" is the most common opening sentence in post-separation counselling. The answer is usually no, and that nothing has gone wrong.',
        ],
      },
      {
        h2: 'Where counselling fits, stage by stage',
        list: [
          { label: 'While deciding', detail: 'Individual work, for clarity rather than a verdict. A counsellor’s job is not to save the marriage or end it, and one who arrives with either agenda is doing something other than counselling.' },
          { label: 'Considering a last real attempt', detail: 'Couples work can be honest about its own limits: it requires two people who both want to be in the room. Where one foot is already out the door, some couples use structured sessions to decide *whether* to try — which is a legitimate use, stated openly.' },
          { label: 'Through the ending', detail: 'Steadying work: sleep, functioning, the conversations with children and family, and keeping the long-consequence decisions out of the worst weeks.' },
          { label: 'Afterwards', detail: 'Grief work, identity work, and — often later than expected — the question of what you want the next stretch of life to be, asked as a real question rather than a slogan.' },
          { label: 'If there was violence or control', detail: 'That changes the picture: safety planning comes before any joint anything, and VictimLinkBC (1-800-563-0808, 24/7) is the provincial line for confidential support and referrals.' },
        ],
      },
    ],
    midCta: {
      text: 'Wherever you are in this — still deciding, mid-upheaval, or a year out and not "over it" — a free 15-minute consultation is a low-stakes way to start.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can counselling help me decide whether to leave?', a: 'Yes — that is one of its most common uses, and the counsellor’s job is to help you think clearly, not to steer you toward staying or leaving. Sessions are a place to test the unsayable versions of the question and to untangle the marriage from anything else (depression, burnout) that might be wearing it as an explanation.' },
      { q: 'Should we try couples counselling before separating?', a: 'If both of you genuinely want to try, it is often worth one honest attempt — couples work has the most to offer while both people are still in the room. If one of you has already decided, sessions can still be useful for ending well, especially where children are involved, but that intention should be stated rather than smuggled.' },
      { q: 'How do I tell the children?', a: 'Together if at all possible, briefly, honestly, and without assigning blame — with the emphasis on what stays the same and the explicit message that it is not their fault and not their job to fix. What protects children most over time is not the wording of one conversation; it is how much conflict they are exposed to afterwards.' },
      { q: 'Is it normal to grieve a marriage I chose to leave?', a: 'Completely. Choosing an ending does not cancel the loss — you still lose the future you had assumed, the daily shape of a life, and a version of yourself. Relief and grief in the same week is the standard experience, not a sign you made the wrong call.' },
      { q: 'Do you handle the legal side?', a: 'No — counselling and legal advice are deliberately separate, and this page is not legal advice. For the BC legal side, Legal Aid BC’s family-law resources are the standard free starting point, and a family lawyer is the right person for anything with long consequences.' },
    ],
    sources: [
      { label: 'Legal Aid BC — Family law in BC', url: 'https://family.legalaid.bc.ca/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
      { label: 'VictimLinkBC', url: 'https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/victimlinkbc' },
    ],
    related: [
      { href: '/services/couples-therapy', label: 'Couples therapy' },
      { href: '/guides/grief-without-a-timeline', label: 'Grief without a timeline' },
      { href: '/guides/life-transitions-and-identity', label: 'Life transitions and identity' },
      { href: '/compare/individual-vs-couples-therapy', label: 'Individual vs couples therapy' },
      { href: '/guides/setting-boundaries-with-family', label: 'Setting boundaries with family' },
    ],
  },

  {
    draft: true,
    slug: 'anxiety-in-relationships',
    title: 'Anxiety in relationships: when worry moves in with you',
    metaTitle: 'Anxiety in Relationships | Westpeak Wellness',
    metaDescription:
      'Reassurance loops, checked phones, the fear underneath the fight — how anxiety operates inside couples, and what individual and couples work each fix.',
    eyebrow: 'Guide · Relationships · Anxiety',
    lede:
      'Relationship anxiety rarely announces itself as anxiety. It shows up as one more question, one more check, one more fight about nothing that was really about everything.',
    shortAnswer:
      'Anxiety inside a relationship usually runs on a loop: a surge of doubt or dread, a bid for relief — reassurance, checking, testing — and a short-lived calm that teaches the anxiety to come back sooner. The other partner, meanwhile, learns their own loop: soothe, comply, or withdraw. None of this means the relationship is wrong; anxious systems attack whatever matters most, and for most adults that is their closest attachment. The work is partly individual (the loop itself) and sometimes joint (what the loop has trained the couple to do), and which one to start with is a genuinely answerable question.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'The reassurance loop, drawn once',
        body: [
          'The engine of most relationship anxiety is small and consistent. A trigger — an unanswered text, a flat tone, a colleague’s name — produces a spike of dread. The dread demands relief *now*, and the fastest relief available is the partner: "are we okay?", "do you still love me?", a scan of their face, a check of their phone activity. The answer soothes. For about a day.',
          'The problem is what the soothing teaches. Each cycle confirms that the dread was worth taking seriously and that relief lives outside you, in somebody else’s response. So the interval shortens, the questions need to be stronger to work, and a partner who answered warmly the first hundred times starts answering wearily — which the anxiety reads as evidence, which starts the loop again with better fuel.',
          'It matters to say this cleanly: nobody in this loop is behaving badly. The anxious partner is doing the thing that works, short-term, exactly the way scratching works on an itch. The other partner is being kind, then being tired, in the order anyone would. The loop is the problem — which is good news, because loops can be worked on directly.',
        ],
      },
      {
        h2: 'The other costumes it wears',
        list: [
          { label: 'The prosecutor', detail: 'Checking, testing, cross-referencing stories — sometimes about fidelity, often about nothing nameable. This is the dread trying to get certainty, and certainty is the one thing no relationship can supply. The demand for it is the symptom.' },
          { label: 'The mind-reader', detail: '"They said it’s fine but I know it isn’t." Anxiety scans faces and tones for threat and reliably finds it, because a scanner tuned that sensitively produces false positives by design.' },
          { label: 'The pre-emptive griever', detail: 'Rehearsing the breakup, imagining the funeral, holding back from closeness because losing it later would hurt too much. Distance dressed as self-protection.' },
          { label: 'The fight about nothing', detail: 'A recurring argument with no stable content — the dishwasher, the tone, the weekend — that is really the loop discharging. Couples often know these fights are strange while having them.' },
          { label: 'The avoider', detail: 'Not all relationship anxiety pursues. Some of it goes quiet, agrees with everything, and disappears by inches — because any honest statement feels like a risk to the attachment. Peace-keeping that costs the self is still anxiety.' },
        ],
      },
      {
        h2: 'If you are the anxious one',
        body: [
          'The counterintuitive core of the work: the target is not the dread, it is the *relief-seeking*. Dread that is not fed with checking and reassurance genuinely does shrink over time — this is the best-established finding in the treatment of anxiety — but it shrinks by being tolerated, not by being answered. That means the work has an uncomfortable middle, and knowing that in advance is half of getting through it.',
          'Practically, this looks like: noticing the urge as an urge ("I want to ask if we’re okay for the third time today") rather than as information; delaying the ask and letting the wave crest without it; and telling your partner what you are working on, so that their not-reassuring can be teamwork instead of coldness. A counsellor adds structure, pacing, and a place to work on where the sensitivity was trained — which for many people leads back well before this relationship.',
          'Worth ruling out with a professional rather than a quiz: when the doubt is constant, contentless and compulsive — endlessly checking *whether you really love them* or *whether they are The One*, with rituals of comparison and confession attached — that pattern sits closer to obsessive-compulsive processes than to ordinary relationship worry, and the treatment differs. The existing guide on intrusive thoughts covers the neighbouring ground.',
        ],
      },
      {
        h2: 'If you are the partner — and when it becomes couples work',
        body: [
          'The partner’s dilemma is real: reassure and feed the loop, or hold back and feel cruel. The workable middle is warmth toward the person and neutrality toward the ritual — "I love you, and I’m not going to answer that for the fourth time tonight" — agreed on in a calm moment rather than improvised mid-spiral. What does not work, at either extreme: organising the whole relationship around preventing the anxiety, or contempt for it.',
          'It becomes couples work when the loop has trained *both* of you — when pursue-and-withdraw has become the couple’s default choreography, when resentment has compounded, or when the reassurance economy has crowded out ordinary intimacy. Couples approaches read that choreography directly: the pursuing is protest, the withdrawing is self-protection, and both are aimed at the same fear from opposite ends. Individual work on the loop and couples work on the choreography are not rivals; sequencing them is a normal consultation question.',
        ],
      },
    ],
    midCta: {
      text: 'Whether this is your loop or your household’s, fifteen minutes is enough to work out which kind of help fits first.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Does relationship anxiety mean I’m with the wrong person?', a: 'Not by itself. Anxiety attacks what matters most, and a secure-seeming relationship can host severe relationship anxiety while a poor one hosts none. The more useful question is what the anxiety does — how it behaves, what feeds it — which is answerable, unlike "is this The One", which is exactly the unanswerable question the anxiety keeps asking.' },
      { q: 'Is constant reassurance-seeking really that bad?', a: 'It is less that it is bad and more that it does not work: each reassurance buys shorter relief and teaches the dread to return, while slowly exhausting the person providing it. Reducing it — gradually, as teamwork, with the partner warm toward you and neutral toward the ritual — is uncomfortable and genuinely effective.' },
      { q: 'Should I look at my partner’s phone if it would put my mind at rest?', a: 'The relief would be real and brief, and the checking would become the new floor. Surveillance feeds the same loop as reassurance, with the added cost of eroding the trust the anxiety claims to be protecting. If the urge is constant, that is a signal about the anxiety — or occasionally about the relationship — and both deserve better tools than a phone check.' },
      { q: 'Individual or couples counselling first?', a: 'A fair rule of thumb: if the loop lives mainly in one person’s head, individual work first; if it has become the couple’s choreography — pursue and withdraw, fights about nothing, a reassurance economy — couples work addresses what individual work cannot reach. A consultation can sort this in one conversation, and getting it "wrong" first is not fatal.' },
      { q: 'What if my anxiety is about real behaviour — lying, an affair?', a: 'Then it is not an anxiety disorder, it is information. Anxiety work applies when the alarm keeps sounding without a fire. Where there has been a real breach, the work is trust repair, which is different, slower, and also something couples therapy explicitly does.' },
    ],
    sources: [
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
      { label: 'The Gottman Institute — the Gottman Method', url: 'https://www.gottman.com/about/the-gottman-method/' },
    ],
    related: [
      { href: '/services/couples-therapy', label: 'Couples therapy' },
      { href: '/services/individual-therapy', label: 'Anxiety counselling' },
      { href: '/guides/intrusive-thoughts-and-what-they-mean', label: 'Intrusive thoughts and what they mean' },
      { href: '/compare/individual-vs-couples-therapy', label: 'Individual vs couples therapy' },
      { href: '/guides/high-functioning-anxiety', label: 'High-functioning anxiety' },
    ],
  },

  {
    draft: true,
    slug: 'supporting-a-partner-with-anxiety',
    title: 'Supporting a partner with anxiety, without disappearing',
    metaTitle: 'Supporting an Anxious Partner | Westpeak',
    metaDescription:
      'For the partner: what helps in the moment, the accommodation trap, staying a partner rather than becoming a carer — and when to suggest professional help.',
    eyebrow: 'Guide · For the partner',
    lede:
      'Almost everything written about anxiety is addressed to the person who has it. You are the person beside them — and your version of this is real, largely unspoken, and worth a page of its own.',
    shortAnswer:
      'Loving someone with anxiety usually means learning three things nobody teaches: how to be steady in the moment without arguing with the fear or agreeing with it; how to notice when helpful adjustments have quietly become an architecture of avoidance built around the anxiety; and how to stay a partner rather than becoming a full-time carer. You cannot make their anxiety go away, and it is not your job to. What is yours: your steadiness, your limits, honesty about the cost, and the encouragement — not the ultimatum — toward proper help.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'In the moment: steady beats soothing',
        body: [
          'When the spiral is happening, two instincts arrive and both make it longer. The first is logic — "there’s nothing to worry about, we checked, remember?" — which invites the anxiety to debate, and anxiety is an excellent debater. The second is total accommodation — cancel the thing, answer the fiftieth question, take over — which relieves tonight and enlarges tomorrow.',
          'What tends to actually help is duller than either: presence without argument. Slow your own voice and body first, because a nervous system in the room that is not escalating is the most useful thing you can offer. Acknowledge the feeling without endorsing the forecast — "this is really gripping you tonight" rather than "you’re right, it might all go wrong" or "that’s ridiculous". Ask "do you want help thinking, or company?" — the answer is usually company, and the question itself dignifies them as the expert on what they need.',
          'And afterwards, when it has passed, is when the real conversations belong — what helped, what didn’t, what you will each try next time. Mid-spiral is for steadiness; design happens in peacetime.',
        ],
      },
      {
        h2: 'The accommodation trap',
        body: [
          'Here is the mechanism most partners are inside before they can name it. Out of love, you adjust: you drive because highways are hard, you answer the "are you sure it’s fine" texts, you make the phone calls they dread, you stop suggesting the trips that trigger the spiral. Each adjustment is kind, reasonable, and relieving — for both of you.',
          'The cost only shows at the scale of years: the anxiety’s territory grows, because everything it was protected from it never had to face; your territory shrinks; and the relationship slowly reorganises itself around what the anxiety will permit. Clinicians call the pattern accommodation, and reducing it — gradually, warmly, and ideally with the anxious partner’s agreement — is one of the best-supported things families and partners can do to help.',
          'The operative word is *gradually*. Withdrawing every accommodation at once is not therapy, it is an ambush. The workable version is chosen together in a calm moment: one accommodation at a time, named out loud — "I’m going to stop texting you confirmations from the road, because we both know it feeds the worry" — held with warmth, and expected to be uncomfortable for a while before it is better.',
        ],
      },
      {
        h2: 'Staying a partner, not becoming a carer',
        list: [
          { label: 'Keep your own life load-bearing', detail: 'Friendships, work you care about, things you do without them — these are not disloyalty, they are the structure that lets you keep showing up. A support system of one collapses on both people.' },
          { label: 'Honesty about the cost is allowed', detail: '"I love you and I’m worn out tonight" is not an accusation. Partners who hide the cost until it becomes resentment do the relationship no favour; anxiety can hear honest limits far better than it can survive quiet contempt.' },
          { label: 'You are allowed to decline the rituals', detail: 'Warm toward the person, neutral toward the ritual: "I’m not going to re-answer that one, love you" — agreed in peacetime — is support, not cruelty. Feeding the ritual forever is neither.' },
          { label: 'Watch your own weather', detail: 'Partners of anxious people quite often develop their own anxiety or low mood, by contagion and by load. Your own counselling is a legitimate thing to want, on its own merits, not only as logistics support for theirs.' },
          { label: 'Know what is beyond this page', detail: 'Panic that ends in the ER, agoraphobia that has closed the front door, drinking that has become the treatment, or talk of not wanting to be here — those need professional involvement, not better partner technique. In crisis: 9-8-8 by call or text, or BC’s line at 310-6789.' },
        ],
      },
      {
        h2: 'Suggesting therapy without it landing as a verdict',
        body: [
          'The sentence to avoid is any version of "you need help", delivered mid-fight — it arrives as a character judgement and gets defended against accordingly. What tends to land better: a calm moment, "I" rather than "you", the cost named honestly, and the ask made small. "I love you, I watch how hard this is, and it’s wearing on both of us. Would you try one conversation with someone? Fifteen minutes, free, and I’ll sit with you while you book it if you want."',
          'Two realities to hold at once. Adults get to decline help, and pushing harder usually entrenches the refusal — what you control is your steadiness, your accommodations, and your limits, which themselves often shift the system enough that help starts to look appealing. And: you asking is not overstepping. Partners are usually the first people to see the true size of an anxiety problem, and saying what you see, kindly, is part of the job description.',
          'If they will not go, going yourself is not a consolation prize. It is often the single most effective move available — for your own footing, and because one person changing their steps reliably changes the dance.',
        ],
      },
    ],
    midCta: {
      text: 'If you are the steady one and running low, that is a complete reason to talk to someone — with your partner or on your own.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'My partner’s anxiety is exhausting me. Is it wrong to say so?', a: 'It is wrong not to, eventually. Hidden costs come out as resentment, which anxiety reads far more accurately than it reads reassurance. "I love you and I’m tired tonight," said plainly and without blame, is a form of intimacy — and it models the honesty you are hoping the anxiety will eventually allow them.' },
      { q: 'Should I answer my partner’s constant "are you okay / are we okay" checks?', a: 'Warmly, a reasonable number of times — and then, by agreement made in a calm moment, stop feeding the ritual while staying warm to the person. Endless reassurance genuinely worsens anxiety over time; the middle path is love for them and neutrality toward the checking.' },
      { q: 'What if they refuse to get help?', a: 'Adults are allowed to refuse, and pressure usually entrenches it. What remains in your control: your steadiness in the moment, a gradual reduction of the accommodations that keep the anxiety comfortable, honest limits, and your own support. Systems change when one person changes; partners who start their own counselling often report the standoff moving within months.' },
      { q: 'Is it my job to calm my partner down?', a: 'It is a thing you can offer; it is not a job you can hold. The distinction matters: a partner who has become the sole regulation strategy is an accommodation, and both people feel the weight of it. The aim over time is that your steadiness is one resource among several — alongside their own skills, and ideally a professional.' },
      { q: 'Can I come to a session about my partner’s anxiety?', a: 'You can book one for yourself about exactly that — how to support them, where your limits are, what the load is doing to you — without your partner attending or even knowing the content. Where the anxiety has reshaped the couple’s whole pattern, couples sessions with both of you are the other route.' },
    ],
    sources: [
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/supporting-someone-who-is-struggling', label: 'Supporting someone who is struggling' },
      { href: '/guides/anxiety-in-relationships', label: 'Anxiety in relationships' },
      { href: '/services/individual-therapy', label: 'Anxiety counselling' },
      { href: '/services/couples-therapy', label: 'Couples therapy' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
    ],
  },

  {
    draft: true,
    slug: 'attachment-styles',
    title: 'Attachment styles: a useful lens, not a life sentence',
    metaTitle: 'Attachment Styles, Honestly | Westpeak',
    metaDescription:
      'What attachment styles actually describe, what the quizzes get wrong, why "anxious" and "avoidant" are not diagnoses — and how earned security works.',
    eyebrow: 'Guide · Relationships',
    lede:
      'The internet has turned four research categories into a personality horoscope and a way to lose arguments. Underneath the content mill sits an idea that is genuinely worth having — if it is held the right way round.',
    shortAnswer:
      'Attachment theory describes how early caregiving tends to shape adult expectations of closeness: whether other people are experienced as reliably there (secure), unreliably there (anxious patterns), reliably not-there (avoidant patterns), or frighteningly unpredictable (disorganised patterns). Four things the quiz culture drops: these are dimensions, not boxes; they describe *strategies that once worked*, not character; they vary across relationships and under stress rather than being a fixed type; and they change — "earned security" is one of the best-documented ideas in the field. Used as a lens, attachment is clarifying. Used as a label — especially on a partner — it is usually just a new vocabulary for an old fight.',
    updated: '2026-08-28',
    readMinutes: 8,
    sections: [
      {
        h2: 'What the theory actually says',
        body: [
          'The core claim is modest and well-supported: infants form expectations about whether comfort comes when they signal for it, and those expectations — carried forward as working models — tilt how adults approach closeness, conflict and separation. Someone whose signals were answered reliably tends to find closeness unremarkable. Someone whose signals were answered unpredictably tends to signal louder and monitor harder. Someone whose signals were consistently unanswered tends to stop signalling and to experience need itself as a liability. And someone for whom the source of comfort was also the source of fear can carry both strategies at once, pulling close and pushing away in the same motion.',
          'Notice what this framing does: it describes *strategies that were rational* under the conditions they were learned in. The child who stopped asking was right to stop asking, then. The adult pattern is yesterday’s solution applied to today’s relationship — which is a far kinder and more accurate story than "I’m broken" or "they’re incapable of love", and it is the story the actual research tells.',
          'It is also why the patterns are activated by *stakes*. Plenty of people are serenely secure with friends and colleagues and markedly anxious or avoidant with the one person whose leaving would matter. That is not hypocrisy; it is the system doing what it was built for — attachment strategies run on threat to the bond, and only the important bonds qualify.',
        ],
      },
      {
        h2: 'What the quiz culture gets wrong',
        list: [
          { label: 'Boxes instead of dimensions', detail: 'The research measures two continuous dimensions — roughly, anxiety about abandonment and discomfort with closeness. Most people sit somewhere in the middle of both. The four "types" are regions of that map, not species of person.' },
          { label: 'Identity instead of strategy', detail: '"I’m an avoidant" does different work than "I learned to manage closeness by keeping distance." The first is a fixed trait to be accommodated; the second is a pattern with a history, which is exactly the kind of thing therapy changes.' },
          { label: 'A weapon instead of a lens', detail: 'The most common misuse is diagnostic warfare: "you’re so avoidant" as the sophisticated version of "you never let me in." Labelling a partner mid-argument is pursuit wearing a lab coat, and it reliably produces more of the distance it complains about.' },
          { label: 'Destiny instead of statistics', detail: 'Early attachment tilts the odds; it does not write the script. Adult security is influenced by later relationships, chosen partners, therapy, and plain reflection — the research on "earned security" exists because substantial numbers of people move.' },
          { label: 'An excuse instead of an explanation', detail: '"That’s just my attachment style" explains a pattern; it does not license it. Understanding why you shut down mid-conflict is the beginning of the work, not a substitute for it.' },
        ],
      },
      {
        h2: 'Earned security, which is the actual point',
        body: [
          'The most hopeful finding in the attachment literature is the least shared on social media: working models update. Researchers coined "earned security" for adults whose early conditions predicted insecure patterns but who function securely — and the routes there are unglamorous and consistent. A long relationship with someone steady, in which the old forecast keeps failing to come true. A therapeutic relationship, which is partly *designed* to be that disconfirming experience. And the slower work of making sense of your own history until it is a story you can tell coherently — which, intriguingly, is what the gold-standard adult attachment research actually measures: not a happy childhood, but a coherent account of the one you had.',
          'That last point deserves underlining, because it relocates the whole project. The goal is not to have had secure attachment; that ship has sailed for everyone by about age two. The goal is to relate honestly to what happened — neither dismissing it ("it was fine, I never think about it") nor still drowning in it — and the patterns tend to loosen as the story becomes tellable. That is much of what longer-term individual therapy is, described from the inside.',
          'In couples, the lens earns its keep when it is turned on the *dance* rather than the dancers: pursue-and-withdraw is two attachment strategies interlocking, each triggering the other, each making perfect sense from inside. Couples approaches built on exactly this reading exist, and the comparison page on Gottman and EFT covers how they work with it differently.',
        ],
      },
      {
        h2: 'Using the lens without the label',
        body: [
          'A practical translation, if the quiz vocabulary has already moved into your house. Replace "what’s your attachment style?" with three questions that do the same work better: *What do I do when I feel the bond is threatened — pursue, shut down, or both?* *What was that strategy protecting me from, and when did it start?* *What does my partner’s strategy look like from inside their history rather than from inside my hurt?*',
          'Those questions convert a typology into curiosity, which is the register change that makes the idea useful. They are also, not coincidentally, the opening questions of a decent first month of therapy — individual where the pattern follows you across relationships, couples where the interlock is the problem. A free consultation is a reasonable place to say "I keep reading about attachment and recognising myself" and find out what the non-horoscope version of the work looks like.',
        ],
      },
    ],
    midCta: {
      text: 'If you recognised your own dance in this page, the working version of the question fits in fifteen minutes.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'What are the four attachment styles?', a: 'Secure, anxious-preoccupied, dismissive-avoidant and fearful-avoidant (disorganised) — but the research behind the labels measures two continuous dimensions, attachment anxiety and attachment avoidance, and most people sit between the corners. The four names are regions on a map, useful for orientation and misleading as identities.' },
      { q: 'Can my attachment style change?', a: 'Yes — this is one of the better-documented ideas in the field, under the name "earned security". The consistent routes are a sustained relationship with someone steady, a therapeutic relationship, and making coherent sense of your own history. Change is gradual and real; the styles are strategies, not wiring.' },
      { q: 'Are online attachment quizzes accurate?', a: 'They vary from research-adjacent to horoscope. Even the good ones share a limit: they measure your self-report on a calm day, while attachment strategies show themselves under threat, with the person who matters most. Treat any result as a conversation starter, not a diagnosis — no attachment style is a clinical diagnosis at all.' },
      { q: 'My partner is avoidant and I’m anxious. Are we doomed?', a: 'No — the anxious-avoidant pairing is common precisely because the strategies attract, and the research on couples work is clear that the *cycle* between two people is workable even when neither person’s history changes. What predicts trouble is not the pairing but an untouched cycle plus contempt. Naming the dance together, without weaponising the labels, is the actual first step.' },
      { q: 'Is attachment theory about blaming parents?', a: 'No. Most insecure attachment traces to ordinary, non-abusive mismatches — stressed households, depressed caregivers, temperament, circumstance — and most parents were running their own inherited strategies. The point of the lens is coherence about what happened, which is compatible with compassion for the people it happened with. Blame is optional and usually unhelpful; the intergenerational trauma guide covers the wider frame.' },
    ],
    sources: [
      { label: 'ICEEFT — attachment science in couples therapy', url: 'https://iceeft.com/' },
      { label: 'CAMH — mental illness and addiction index', url: 'https://www.camh.ca/en/health-info/mental-illness-and-addiction-index' },
    ],
    related: [
      { href: '/guides/anxiety-in-relationships', label: 'Anxiety in relationships' },
      { href: '/guides/intergenerational-trauma-explained', label: 'Intergenerational trauma explained' },
      { href: '/compare/gottman-method-vs-eft-for-couples', label: 'Gottman Method vs EFT' },
      { href: '/services/couples-therapy', label: 'Couples therapy' },
      { href: '/guides/what-trauma-actually-means', label: 'What trauma actually means' },
    ],
  },

  /* The late-October calendar slot, written 2026-08-28 so one clinical read
   * can clear the whole season at once. CONTENT_CALENDAR.md calls this "the
   * highest-shareability piece in the year for this practice". Publish
   * target: late October, ahead of the Nov–Jan peak. */
  {
    draft: true,
    slug: 'holidays-with-family-you-find-difficult',
    title: 'When the holidays mean seeing family you find difficult',
    metaTitle: 'Difficult Family at the Holidays | Westpeak',
    metaDescription:
      'Not general holiday stress — the specific dread of a room you have to be in. Preparation that works, exits that preserve dignity, and what counselling adds.',
    eyebrow: 'Guide · Seasonal',
    lede:
      'This is not a page about holiday stress in general. It is about the specific arithmetic of a season that puts you in a room with people you have history with — and no meeting agenda.',
    shortAnswer:
      'Dreading holiday gatherings with difficult family is one of the most common things counsellors hear about from October onward, and it is rarely about the turkey. The dread is anticipatory: old dynamics reassert themselves within minutes, and adults find themselves playing a part they retired years ago. What actually helps is specific preparation — limits decided before the drive, exits that preserve everyone’s dignity, and one realistic goal for the visit that is not "finally fix it". Attending is a choice, limits are allowed, and so is not going.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'Why a grown adult regresses in one particular living room',
        body: [
          'The most disorienting part of a difficult family gathering is not what anyone says — it is who you become while they say it. People with mortgages and teams and considered opinions find themselves, within an hour of arriving, thirteen again: defensive at the old triggers, silent in the old places, playing a role they did not choose and thought they had quit.',
          'This is ordinary human machinery, not weakness. Families are systems with long-rehearsed choreography, and a room containing the original cast, in the original configuration, at an occasion loaded with expectation, is the most powerful cue that choreography will ever get. Everyone regresses somewhat at these tables; the differences are how much it costs you, and what happens in the room when you decline your old part.',
          'Naming the specific dynamic in advance — the comparisons, the criticism dressed as concern, the topic that always detonates, the person whose drinking changes the evening at nine o’clock — is worth more than any general resolution to "stay calm". You cannot prepare for weather; you can prepare for a forecast.',
        ],
      },
      {
        h2: 'Preparation that actually works',
        list: [
          { label: 'Decide your limits before the drive, not during the argument', detail: 'The two or three things you will not discuss, the behaviour that ends the evening for you, and what you will do when they occur. A limit invented mid-conflict sounds like an attack; one decided calmly in advance is just a fact about you.' },
          { label: 'Have an exit that preserves dignity — everyone’s', detail: 'Your own transport, a stated end time on arrival, and a rehearsed sentence for leaving early that assigns no blame. The point of an exit is not to use it; it is that a person who can leave is a different person in the room.' },
          { label: 'Set one realistic goal', detail: '"Get through the evening with my own self intact" is achievable. "Finally get Dad to acknowledge it" is a script for the drive home you have already had a hundred times. The gathering is the wrong venue for the reckoning — not because the reckoning does not matter, but because it deserves a better one.' },
          { label: 'Plan the decompression before you need it', detail: 'The hour after matters as much as the hours during: the walk, the debrief with someone safe, the deliberate return to your own life. Budget for it the way you budget for the traffic.' },
          { label: 'Rehearse the two sentences you always need', detail: 'One for deflecting the intrusive question ("we’re not discussing that today — how’s the new place?") and one for exiting an escalation ("I’m going to step outside for a bit"). Under stress, people fall to the level of their preparation, not the height of their intentions.' },
        ],
      },
      {
        h2: 'The permission section',
        body: [
          'Some things adults are allowed to do at the holidays, listed because permission is often the missing piece: attend for two hours instead of two days. Book a hotel instead of the childhood bedroom. Bring an ally. Skip the event that always goes badly and see the safe subset of the family separately. Alternate years. And — the one people circle for a decade — not go, this year or at all, because attendance at a gathering that reliably damages you is not a moral obligation, whatever the family narrative says.',
          'For readers navigating this inside cultures where the family claim runs deeper — where skipping the gathering reads as rejecting the family itself — the calculation is genuinely different, and pretending otherwise would be advice written for someone else. The work there is usually not attendance-or-not but building a self that can be in the room without being consumed; the pages on [intergenerational conflict](/for/south-asian-intergenerational-conflict) and [boundaries with family](/guides/setting-boundaries-with-family) are written from inside that reality.',
          'And if the difficulty in the room is grief — a first holiday season after a loss — that is its own terrain with its own page: [grief without a timeline](/guides/grief-without-a-timeline). Dread and grief often share a table in December.',
        ],
      },
      {
        h2: 'Where counselling fits, seasonally and otherwise',
        body: [
          'The October-to-December stretch is when family material walks into counselling rooms on its own schedule. Useful work before the season: mapping the specific dynamics, rehearsing the limits out loud — they hold better spoken than imagined — and separating what you can control in that room from what you have spent years trying to. Useful work after: the January conversations, when the visit has clarified, sometimes painfully, what the ongoing relationship can and cannot be.',
          'The deeper version, when you are ready for it, is not about December at all. The gathering is two days; the dynamics are decades. Working on your side of a lifelong pattern — what it built in you, what it still triggers, what boundaries would make the relationship sustainable at any time of year — is standard counselling terrain, and it tends to make every subsequent December cheaper.',
        ],
      },
    ],
    midCta: {
      text: 'If the dread has already started, a session before the season is preparation — and one booked for early January is honest planning.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is it wrong to skip a family holiday gathering?', a: 'It is a choice with costs, not a moral failing. Where a gathering reliably harms you and limits have not held, declining is a legitimate act of self-protection. Middle paths exist — shorter visits, hotels, alternate years, seeing safe family members separately — and so does the full no.' },
      { q: 'How do I handle the relative who always starts something?', a: 'With decisions made in advance rather than reflexes in the moment: which topics you will not engage, a rehearsed deflection, and an exit you are genuinely willing to use. You cannot control their opening move; you can retire your half of the routine, which changes the game more than winning it would.' },
      { q: 'Why do I feel awful for days after these visits?', a: 'A visit like that is hours of vigilance, role-strain and old material — a genuine exertion, whatever it looks like from outside. The post-visit crash is the bill arriving. Planning decompression, and taking the crash as information about the dynamics rather than about your resilience, both help.' },
      { q: 'Can one counselling session before the holidays actually help?', a: 'One session can realistically produce a concrete plan: named dynamics, decided limits, rehearsed sentences, an exit. That is preparation, and preparation measurably changes how these evenings go. The longer pattern behind the dread takes longer — but the season does not require the whole renovation, just a working door.' },
      { q: 'What if the clash is between my partner and my family?', a: 'Then the preparation is a couples conversation before the season: agreed signals, a united front on limits, and clarity about whose family gets which days. Couples work sees a reliable December spike for exactly this, and the planning version in November beats the repair version in January.' },
    ],
    sources: [
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
      { label: 'Anxiety Canada', url: 'https://www.anxietycanada.com/' },
    ],
    related: [
      { href: '/guides/setting-boundaries-with-family', label: 'Setting boundaries with family' },
      { href: '/for/south-asian-intergenerational-conflict', label: 'Intergenerational and cultural family conflict' },
      { href: '/guides/grief-without-a-timeline', label: 'Grief without a timeline' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
      { href: '/services/couples-therapy', label: 'Couples therapy' },
    ],
  },
];

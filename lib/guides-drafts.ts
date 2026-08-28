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
      { href: '/services/anxiety-counselling', label: 'Anxiety counselling' },
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
      { href: '/services/anxiety-counselling', label: 'Anxiety counselling' },
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
];

/* STILL TO WRITE — the remaining seven measured content gaps.
 *
 * Ordered by search volume against how well the site currently covers the
 * ground. Each needs the same treatment as the two above: full guide, sourced,
 * and read clinically before the draft flag comes off.
 *
 *   1. separation-and-divorce            — no coverage at all; high volume
 *   2. anxiety-in-relationships          — adjacent to /services/couples-therapy
 *   3. supporting-a-partner-with-anxiety — the searcher is not the client, which
 *                                          changes the whole register
 *   4. attachment-styles                 — very high volume, heavily written
 *                                          elsewhere; only worth doing if it
 *                                          says something the listicles do not
 *   5. ocd-and-intrusive-thoughts        — partial overlap with the existing
 *                                          intrusive-thoughts guide; decide
 *                                          whether to expand that instead of
 *                                          adding a competing page
 *   6. insomnia                          — overlaps /guides/anxiety-and-sleep;
 *                                          same question
 *   7. seasonal-affective-disorder       — overlaps
 *                                          /guides/low-mood-through-a-bc-winter;
 *                                          likely an expansion, not a new page
 *
 * Note the pattern in 4-7: four of the seven may be better served by deepening
 * a page that already ranks than by adding a near-duplicate that competes with
 * it. That is a judgement about this site's existing coverage, not a general
 * rule, and it should be made before writing rather than after.
 */

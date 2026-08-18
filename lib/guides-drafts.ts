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

/* A plain-language glossary of the words that get used around counselling.
 *
 * The purpose is practical: someone reading a referral letter, a benefits
 * booklet or a therapist's website should be able to find out what a term
 * actually means without a psychology degree or a marketing pitch.
 *
 * Definitions describe concepts. None of them diagnoses anything, and none of
 * them claims an outcome. */

export type Term = {
  term: string;
  also?: string;
  group: string;
  definition: string;
  href?: string;      // an on-site page that goes deeper
};

export const glossaryGroups = [
  {
    key: 'approaches',
    name: 'Approaches and methods',
    blurb:
      'The named ways of working. A therapist trained in several of these is not being vague, different problems respond to different methods, and the choice should be explained to you rather than applied silently.',
  },
  {
    key: 'experience',
    name: 'What people are describing',
    blurb:
      'Words for experiences, not labels for people. Several of these are also clinical diagnoses, which only a qualified professional can make. A definition here is an orientation aid, not an assessment.',
  },
  {
    key: 'process',
    name: 'How the work runs',
    blurb:
      'The mechanics of therapy itself: what a session is built out of, what the words on your treatment plan mean, and what you are entitled to ask for.',
  },
  {
    key: 'bc',
    name: 'Designations, coverage and BC systems',
    blurb:
      'The specifically British Columbian part, who is registered with whom, what pays for what, and which door to knock on when private counselling is not the right answer.',
  },
] as const;

export const glossary: Term[] = [
  /* ---------------- approaches ---------------- */
  {
    term: 'Cognitive behavioural therapy',
    also: 'CBT',
    group: 'approaches',
    definition:
      'A structured, present-focused approach built on the idea that thoughts, feelings and behaviour hold each other in place, so changing one changes the others. Sessions tend to be organised around a specific target, with practice between them. It has the largest evidence base of any talk therapy, which is why it is often the first thing offered, not because it suits everyone.',
    href: '/compare/cbt-vs-emdr-for-trauma',
  },
  {
    term: 'EMDR',
    also: 'Eye Movement Desensitization and Reprocessing',
    group: 'approaches',
    definition:
      'A structured eight-phase therapy for distressing memories, in which you attend briefly to a memory while doing something that occupies attention at the same time, typically following a moving target with your eyes. The aim is not to erase the memory but to reduce how loudly it fires in the present. Most of the protocol is preparation, not eye movements.',
    href: '/services/emdr-therapy',
  },
  {
    term: 'Gottman Method',
    group: 'approaches',
    definition:
      'A couples therapy built on decades of observational research into how partners actually argue. It begins with a formal assessment of the relationship: joint and individual sessions: before any treatment plan is agreed, and works on friendship, conflict management and shared meaning rather than on winning disagreements.',
    href: '/guides/how-the-gottman-method-works',
  },
  {
    term: 'Dialectical behaviour therapy',
    also: 'DBT',
    group: 'approaches',
    definition:
      'Originally developed for people experiencing intense, fast-moving emotion and self-harm urges, DBT teaches concrete skills in four areas: distress tolerance, emotion regulation, interpersonal effectiveness and mindfulness. Full DBT is a programme with a group component; many therapists use DBT-informed skills within individual work, which is a different and smaller thing.',
  },
  {
    term: 'Acceptance and commitment therapy',
    also: 'ACT',
    group: 'approaches',
    definition:
      'Works on your relationship to difficult thoughts and feelings rather than on their content. The goal is to stop the struggle consuming your life, and to move toward what you actually value while the difficulty is still present. Often a good fit for people who have already "figured out" their patterns and are still stuck.',
  },
  {
    term: 'Internal Family Systems',
    also: 'IFS, parts work',
    group: 'approaches',
    definition:
      'Treats the mind as made up of parts. The part that wants to leave the job, the part that is terrified of leaving, each with a protective intention, however unhelpful its strategy. Work involves getting to know those parts rather than overruling them. Often useful where someone feels genuinely divided against themselves.',
  },
  {
    term: 'Somatic therapy',
    group: 'approaches',
    definition:
      'A family of approaches that treat the body as a source of information rather than a passenger: tracking tension, breath, posture and impulse as part of the work. Frequently used in trauma treatment, where the nervous system holds a pattern that talking about it does not reach.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Narrative therapy',
    group: 'approaches',
    definition:
      'Starts from the position that the story you tell about a problem is not the same as the problem, and that stories can be examined and rewritten. Often includes externalising language, "the anxiety" rather than "my anxiety", to create enough distance to work.',
  },
  {
    term: 'Solution-focused brief therapy',
    group: 'approaches',
    definition:
      'Concentrates on what a preferred future looks like and on the exceptions when the problem is already smaller, rather than on the origins of the problem. Deliberately short. Suits a clearly bounded difficulty better than a long history.',
  },
  {
    term: 'Psychodynamic therapy',
    group: 'approaches',
    definition:
      'Works with patterns formed early and repeated since: in relationships, at work, and often in the therapy room itself. Less structured and usually longer than CBT, and more interested in why a pattern keeps recurring than in the technique for interrupting it.',
  },
  {
    term: 'Emotionally focused therapy',
    also: 'EFT',
    group: 'approaches',
    definition:
      'A couples approach grounded in attachment theory. It treats recurring fights as a cycle driven by unmet attachment needs, and works to make each partner\'s underlying fear speakable so the cycle stops running the relationship.',
    href: '/services/couples-therapy',
  },
  {
    term: 'Exposure therapy',
    group: 'approaches',
    definition:
      'Deliberate, graded, planned contact with what is feared, never a surprise, never a stunt. The mechanism is not "proving nothing bad happens" so much as building tolerance for the fear itself. It is among the most effective treatments for anxiety disorders and among the most misunderstood.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Cognitive processing therapy',
    also: 'CPT',
    group: 'approaches',
    definition:
      'A structured, trauma-focused therapy that concentrates on the beliefs formed in the aftermath of an event: about safety, trust, control, and one\'s own responsibility. Strong evidence base for post-traumatic stress, and one of the protocols shown to transfer well to video delivery.',
  },
  {
    term: 'Behavioural activation',
    group: 'approaches',
    definition:
      'A deceptively simple treatment for depression: because withdrawal deepens low mood and low mood drives further withdrawal, activity is scheduled deliberately rather than waiting for motivation. Works from the outside in, which is why it helps when insight-based work stalls.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Mindfulness-based approaches',
    group: 'approaches',
    definition:
      'Structured programmes, MBCT and MBSR are the best known. That train sustained, non-reactive attention to present experience. The evidence is strongest for preventing depressive relapse. Distinct from a meditation app, which offers the practice without the clinical structure around it.',
  },
  {
    term: 'Trauma-informed practice',
    group: 'approaches',
    definition:
      'Not a therapy, a stance: assume any client may have a trauma history, and design everything: pacing, choice, predictability, how consent is handled, so the process itself does not repeat the dynamics of harm. A trauma-informed counsellor is not automatically a trauma therapist.',
  },

  /* ---------------- experience ---------------- */
  {
    term: 'Anxiety',
    group: 'experience',
    definition:
      'Anticipation of threat. The body preparing for something that has not happened. It becomes a clinical problem not when it is intense but when it is persistent, out of proportion, and shrinking your life. Ordinary anxiety before a hard conversation is the system working.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Panic attack',
    group: 'experience',
    definition:
      'An abrupt surge of intense fear with strong physical symptoms: racing heart, breathlessness, chest tightness, a sense of unreality. That typically peaks within about ten minutes and then subsides. Terrifying, and not dangerous in itself. The fear of the next one is often the bigger problem.',
    href: '/guides/anxiety-attack-vs-panic-attack',
  },
  {
    term: 'Generalized anxiety',
    group: 'experience',
    definition:
      'Worry that moves. Resolve one topic and it attaches to the next, with the physical residue: tension, poor sleep, difficulty concentrating, persisting underneath regardless of subject. The content is rarely the point.',
  },
  {
    term: 'Social anxiety',
    group: 'experience',
    definition:
      'Fear of being evaluated, and of the visible signs of that fear being noticed. Frequently mislabelled as shyness, and frequently invisible from outside because the avoidance is so well-managed: declining the presentation, arriving late, leaving early.',
  },
  {
    term: 'High-functioning anxiety',
    group: 'experience',
    definition:
      'Not a diagnosis, but a widely used description: anxiety that presents as achievement rather than impairment. The output looks excellent; the cost is internal and largely unwitnessed. Often the last thing to be taken seriously, including by the person experiencing it.',
    href: '/guides/high-functioning-anxiety',
  },
  {
    term: 'Depression',
    group: 'experience',
    definition:
      'Persistently low mood or loss of interest and pleasure, lasting weeks rather than days, with changes in sleep, appetite, energy and concentration. Distinct from sadness in duration and in reach: it follows you across contexts rather than tracking events.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Burnout',
    group: 'experience',
    definition:
      'Classified in the ICD-11 as an occupational phenomenon rather than a medical condition: exhaustion, mental distance or cynicism about the work, and reduced effectiveness, arising from chronic unmanaged workplace stress. Its defining feature is context. It is attached to a situation.',
    href: '/guides/burnout-vs-depression',
  },
  {
    term: 'Post-traumatic stress',
    also: 'PTSD',
    group: 'experience',
    definition:
      'A cluster that can follow exposure to a traumatic event: intrusive re-experiencing, avoidance of reminders, negative changes in thinking and mood, and a nervous system stuck in a raised state. It is not a measure of how bad the event was. It is about how the memory got stored.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Complex trauma',
    group: 'experience',
    definition:
      'Used for the effects of repeated, prolonged harm, often beginning early and often within relationships that were supposed to be safe. It tends to shape identity, emotional regulation and expectations of other people rather than producing a single memory to work on.',
  },
  {
    term: 'Intergenerational trauma',
    group: 'experience',
    definition:
      'The transmission of the effects of trauma across generations: through parenting, silence, migration, vigilance, and what a family treats as normal. What is inherited is usually not the event but the adaptation to it.',
    href: '/guides/intergenerational-trauma-explained',
  },
  {
    term: 'Dissociation',
    group: 'experience',
    definition:
      'Disconnection from thoughts, feelings, body or surroundings: going blank, watching yourself from outside, losing stretches of time. A protective response, not a failure of effort, and common enough that most people have experienced a mild version.',
  },
  {
    term: 'Hypervigilance',
    group: 'experience',
    definition:
      'A threat-detection system running permanently above baseline: scanning rooms, tracking tone of voice, unable to settle with your back to a door. Exhausting precisely because it works. The cost is that it does not switch off when the danger is over.',
  },
  {
    term: 'Window of tolerance',
    group: 'experience',
    definition:
      'The band of arousal in which you can feel something and still think about it. Above it is hyperarousal: panic, rage, no off switch. Below it is hypoarousal: numb, flat, far away. Therapy that changes anything happens inside the window, which is why capacity is built before memory is opened.',
    href: '/services/individual-therapy',
  },
  {
    term: 'Rumination',
    group: 'experience',
    definition:
      'Repetitive thinking about the past that produces no new information: replaying, re-litigating, rehearsing. Feels like problem-solving and functions as avoidance. Strongly associated with both depression and anxiety.',
  },
  {
    term: 'Intrusive thoughts',
    group: 'experience',
    definition:
      'Unwanted thoughts or images that arrive uninvited and are often disturbing or repugnant to the person having them. Almost universal. Their significance is not their content but how much meaning gets attached to having had them.',
  },
  {
    term: 'Avoidance',
    group: 'experience',
    definition:
      'Anything done to prevent contact with what is feared, not going, not saying, not opening the email. It works immediately, which is exactly the problem: the relief teaches the brain the threat was real, so the fear grows.',
  },
  {
    term: 'Moral injury',
    group: 'experience',
    definition:
      'The lasting effect of doing, witnessing or failing to prevent something that violates your own moral code, common in healthcare, emergency services and the military. Distinct from post-traumatic stress: the dominant feeling is guilt or shame rather than fear.',
    href: '/for/healthcare-and-shift-workers',
  },
  {
    term: 'Compassion fatigue',
    group: 'experience',
    definition:
      'The gradual erosion of empathy in people whose work requires it continuously. Not callousness, depletion. Frequently arrives alongside burnout and is often noticed first by the people at home.',
  },
  {
    term: 'Grief',
    group: 'experience',
    definition:
      'The response to loss, which does not move through tidy stages and does not have a schedule. It also attaches to losses that are not deaths. A marriage, a country, a body that used to work, a future that had been assumed.',
  },
  {
    term: 'Perfectionism',
    group: 'experience',
    definition:
      'A standard set so that meeting it is neutral and missing it is catastrophic. Frequently rewarded externally, which is why it is difficult to give up. The clinically relevant part is usually the self-criticism, not the standard.',
  },

  /* ---------------- process ---------------- */
  {
    term: 'Therapeutic alliance',
    group: 'process',
    definition:
      'The working bond between client and counsellor: agreement on goals, agreement on tasks, and a relationship that can hold both. One of the more consistent predictors of whether therapy helps, across every method. If it is not there by session three or four, that is information worth acting on.',
  },
  {
    term: 'Intake',
    group: 'process',
    definition:
      'The information-gathering at the start: history, current concerns, medications, safety, and what you want to be different. Usually a form before the first session, so the session itself is not spent on paperwork.',
    href: '/guides/what-to-expect-first-therapy-session',
  },
  {
    term: 'Informed consent',
    group: 'process',
    definition:
      'Being told what an approach involves, what it might stir up, what the alternatives are and what the limits of confidentiality are, before agreeing to it. It is ongoing rather than a form signed once, and you can withdraw it at any point without justifying yourself.',
    href: '/standards',
  },
  {
    term: 'Scope of practice',
    group: 'process',
    definition:
      'The boundary of what a professional is qualified and permitted to do. A counsellor working outside it: diagnosing, advising on medication, conducting a formal assessment, is a problem regardless of how confident they sound.',
    href: '/standards',
  },
  {
    term: 'Treatment plan',
    group: 'process',
    definition:
      'The agreed answer to what you are working on, how, and how you will both know whether it is working. It should be explicit and revisable. "We will see how it goes" is not a treatment plan.',
  },
  {
    term: 'Psychoeducation',
    group: 'process',
    definition:
      'Teaching the mechanics: why panic peaks and falls, what avoidance trains, how sleep and mood interact. Often the fastest relief available in early sessions, because a frightening experience becomes considerably less frightening once it is explicable.',
  },
  {
    term: 'Grounding',
    group: 'process',
    definition:
      'Deliberate techniques for re-establishing contact with the present when you have left it: orienting to the room, temperature, weight, breath. A skill practised when calm so it is available when not.',
  },
  {
    term: 'Resourcing',
    group: 'process',
    definition:
      'Building internal and external supports before difficult material is approached: regulation skills, safe imagery, people, structure. In trauma work the sequence matters: resourcing first, then reprocessing.',
    href: '/guides/what-is-emdr-and-how-a-session-works',
  },
  {
    term: 'Between-session practice',
    also: 'homework',
    group: 'process',
    definition:
      'The part of the work that happens in the other 167 hours of the week. Usually small and specific: tracking something, trying one different response. Structured therapies rely on it, and it is negotiable rather than assigned.',
  },
  {
    term: 'Containment',
    group: 'process',
    definition:
      'Deliberately closing down difficult material before the end of a session so you leave settled rather than raw. A session that runs hard right up to the final minute is poorly structured, not thorough.',
  },
  {
    term: 'Ending',
    also: 'termination',
    group: 'process',
    definition:
      'The planned close of counselling: reviewing what changed, naming what would signal a need to return, and finishing deliberately rather than by attrition. A good ending is part of the work, not the absence of it.',
  },
  {
    term: 'Referral',
    group: 'process',
    definition:
      'Being directed to a different service better suited to what you need, a psychiatrist, an assessment, a specialised programme, or another counsellor. Offered because a fit is wrong, not because a person is.',
  },
  {
    term: 'Duty to report',
    group: 'process',
    definition:
      'The legal obligation in British Columbia, on everyone, not only professionals, to report suspected abuse or neglect of a person under nineteen to child protection. One of the named limits of confidentiality.',
    href: '/privacy',
  },
  {
    term: 'Telehealth',
    also: 'virtual care',
    group: 'process',
    definition:
      'Health services delivered remotely over secure video. For counselling specifically, research has consistently found outcomes broadly comparable to in-person delivery for the concerns most people bring.',
    href: '/guides/is-online-therapy-as-effective-as-in-person',
  },

  /* ---------------- bc ---------------- */
  {
    term: 'Registered Clinical Counsellor',
    also: 'RCC',
    group: 'bc',
    definition:
      'A designation held through the BC Association of Clinical Counsellors, requiring a master\'s degree in counselling or a closely related field, supervised clinical hours, continuing education, liability insurance and adherence to a code of ethics, with a complaints process behind it.',
    href: '/compare/rcc-vs-psychologist-vs-social-worker-bc',
  },
  {
    term: 'Registered Psychologist',
    also: 'R.Psych',
    group: 'bc',
    definition:
      'A regulated health professional in BC, typically holding a doctoral degree, and the designation qualified to conduct formal psychological assessment and diagnosis. Regulated by the College of Health and Care Professionals of BC.',
  },
  {
    term: 'Registered Social Worker',
    also: 'RSW, RCSW',
    group: 'bc',
    definition:
      'Regulated by the BC College of Social Workers. Social workers in clinical practice provide counselling, and the RCSW designation specifically denotes clinical specialisation. Frequently covered by benefits plans that also cover counsellors.',
  },
  {
    term: 'Canadian Certified Counsellor',
    also: 'CCC',
    group: 'bc',
    definition:
      'A national certification through the Canadian Counselling and Psychotherapy Association. Some BC counsellors hold both CCC and RCC. Whether a given plan reimburses one, both or neither varies and is worth checking before booking.',
  },
  {
    term: 'Unprotected titles',
    group: 'bc',
    definition:
      '"Counsellor", "therapist", "psychotherapist" and "life coach" carry no legal entry requirement in British Columbia today, no mandatory training, insurance or complaints route. This changes as counselling therapy comes under the College of Health and Care Professionals of BC.',
    href: '/guides/how-to-find-a-therapist-in-bc',
  },
  {
    term: 'MSP',
    also: 'Medical Services Plan',
    group: 'bc',
    definition:
      'British Columbia\'s public health insurance. It covers medically necessary physician services, including psychiatry with a referral. It does not cover counselling delivered in private practice by a Registered Clinical Counsellor.',
    href: '/resources/msp-vs-extended-health',
  },
  {
    term: 'Extended health benefits',
    group: 'bc',
    definition:
      'Private insurance, usually through an employer, a spouse\'s employer or a student plan, typically with an annual maximum for counselling. The critical detail is which designations the plan reimburses. Some cover an RCC, some only a psychologist.',
    href: '/resources/bc-extended-health-coverage-for-counselling',
  },
  {
    term: 'Direct billing',
    group: 'bc',
    definition:
      'When a provider submits the insurance claim on your behalf and you pay only the uncovered portion. It requires the practice to be enrolled with that specific insurer. Where it is not offered, you pay the practice directly and submit the receipt yourself for reimbursement.',
    href: '/pricing',
  },
  {
    term: 'EFAP',
    also: 'employee and family assistance program',
    group: 'bc',
    definition:
      'An employer-funded programme offering a limited number of counselling sessions at no cost to the employee, usually through a contracted network. Fast and free, and capped, often six to eight sessions, with limited choice of counsellor.',
    href: '/resources/low-cost-counselling-bc',
  },
  {
    term: 'Foundry',
    group: 'bc',
    definition:
      'A BC network of centres and virtual services offering free health and mental-health support to young people aged twelve to twenty-four and their caregivers, including drop-in counselling. No referral required.',
  },
  {
    term: '9-8-8',
    group: 'bc',
    definition:
      'Canada\'s suicide crisis helpline, reachable by call or text from anywhere in the country, twenty-four hours a day, in English and French. For urgent mental-health support in BC specifically, 310-6789 connects without an area code.',
    href: '/resources/bc-crisis-and-support-directory',
  },
  {
    term: 'Health authority',
    group: 'bc',
    definition:
      'BC\'s regional health bodies: Fraser Health, Vancouver Coastal, Island Health, Interior Health, Northern Health, each running publicly funded mental-health and substance-use services. Free, and generally with waitlists and eligibility criteria.',
  },
  {
    term: 'PIPA',
    also: 'Personal Information Protection Act',
    group: 'bc',
    definition:
      'The BC statute governing how private organisations collect, use and disclose personal information, overseen by the Office of the Information and Privacy Commissioner. It is the law that gives you a right of access to your own counselling records.',
    href: '/privacy',
  },
];

export const termsByGroup = (key: string) => glossary.filter((t) => t.group === key);

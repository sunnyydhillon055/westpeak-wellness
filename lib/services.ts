export type Service = {
  slug: string;
  name: string;
  short: string;        // one-line teaser (from services page)
  metaTitle: string;
  metaDescription: string;
  hero: string;         // hero subhead
  directAnswer?: string; // self-contained answer under the H1, quotable in isolation
  intro: string;        // opening paragraph
  helps: string[];      // "this helps with" list
  approach: string;     // how the practice works with it
  featured?: boolean;   // shown on home page

  // Rich fields — added in the Phase 2 SEO build so each service page is a
  // genuine pillar rather than a summary. Optional so pages can be deepened
  // one at a time without breaking the build.
  whatItIs?: { h2: string; body: string[] };
  signs?: { label: string; detail: string }[];
  sessionShape?: { h2: string; body: string[] };
  faqs?: { q: string; a: string }[];
  related?: { href: string; label: string }[];
  sources?: { label: string; url: string }[];
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
  figure2?: string;      // second diagram, further down the page
};

export const services: Service[] = [
  {
    slug: "individual-therapy",
    directAnswer:
      "Individual therapy at Westpeak Wellness is one-to-one counselling delivered by secure video anywhere in British Columbia, provided by a Registered Clinical Counsellor (MA, RCC) registered with the BC Association of Clinical Counsellors. Sessions run 50 minutes, weekly or fortnightly. It suits anxiety, low mood, burnout, self-criticism, life transitions and long-standing patterns that have stopped responding to the obvious fixes. A free 15-minute consultation comes first, and there is no referral, diagnosis or waitlist required.",
    figure2: "bc-reach",
    figure: "first-session-flow",
    name: "Individual Therapy",
    short: "1:1 for anxiety, depression, life transitions, identity, family dynamics.",
    metaTitle: "Individual Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "One-on-one online counselling across BC for anxiety, depression, life transitions, identity, and family dynamics. Book a free 15-minute consultation.",
    hero: "1:1 sessions for the everyday weight of being human.",
    intro:
      "Individual therapy is space that belongs entirely to you — to think out loud, make sense of what you're carrying, and work toward what \"better\" looks like on your terms. Sessions are 50 minutes, weekly or biweekly, and always online so you can meet from wherever you feel most at ease in BC.",
    helps: [
      "Anxiety, overwhelm, and burnout",
      "Depression and low mood",
      "Life transitions — career, relationships, moving, loss",
      "Identity, self-worth, and belonging",
      "Family dynamics and generational patterns",
    ],
    approach:
      "The work is warm, direct, and paced to you. We start with your story and your goals, then draw on evidence-based approaches — CBT, EMDR, trauma-informed care — matched to what you actually need, not a one-size-fits-all script.",
    featured: true,
    whatItIs: {
      h2: "What individual therapy is actually for",
      body: [
        "Individual therapy has a reputation problem: it gets imagined either as crisis intervention or as an indulgence. In practice most of it is neither. It is a regular hour with someone whose only job in that hour is to pay attention to your situation, and who has no stake in any particular outcome.",
        "That matters more than it sounds. Most of the people in your life are inside your situation — partners, family, friends, colleagues all have a position on what you should do, and you manage their reactions while you talk. A counsellor does not need managing. You can say the ugly version of the thought, the one you have edited out of every other conversation, and find out what it actually looks like once it is out of your head.",
        "**You do not need a diagnosis or a crisis to qualify.** A great deal of useful work happens with people whose lives look fine from outside and feel heavier than they should from inside.",
      ],
    },
    signs: [
      { label: "The same pattern keeps repeating", detail: "Different job, different relationship, same outcome — and enough self-awareness to notice it without being able to interrupt it." },
      { label: "You are functioning and exhausted", detail: "Everything gets done and none of it feels good. Often the version described on [high-functioning anxiety](/guides/high-functioning-anxiety)." },
      { label: "A decision you cannot make", detail: "Career, relationship, whether to move, whether to stay — going in circles for months without getting closer." },
      { label: "Something changed and you have not caught up", detail: "A loss, a diagnosis, a separation, an ending. Not necessarily traumatic, just larger than you have had space to process." },
      { label: "You do not recognise your own reactions", detail: "Anger, numbness, or panic arriving out of proportion to what is in front of you." },
      { label: "You have nowhere to say it", detail: "Genuinely common in adulthood — a full life and no one available for the actual conversation." },
    ],
    sessionShape: {
      h2: "What the sessions look like",
      body: [
        "Sessions are 50 minutes, usually weekly at first, moving to every other week as things settle. Weekly is not a rule — it is that momentum is hard to build at longer intervals early on, and easy to maintain later.",
        "The first session is mostly orientation: what brought you, some history, and what you want to be different. You are not expected to arrive with it organised, and \"I don't know where to start\" is a normal opening. There is a full walkthrough in the guide on [what to expect in a first session](/guides/what-to-expect-first-therapy-session).",
        "After that, sessions tend to alternate between working on what is live that week and returning to the pattern underneath it. Some weeks are practical and skills-focused; some are not. Where the work touches trauma, it slows down deliberately — pacing is a clinical decision, not a delay.",
        "**On length:** some people come for six sessions with a specific stuck problem and finish. Others work for a year. Both are legitimate, and it is a reasonable thing to ask about directly rather than leaving open-ended.",
      ],
    },
    faqs: [
      { q: "How do I know if I need therapy?", a: "There is no threshold you have to cross. A useful question instead: is something taking up more of your attention than you want it to, and have your own attempts to shift it stopped working? If so, it is a reasonable use of an hour." },
      { q: "How many sessions will I need?", a: "It varies with what you are bringing. A specific, contained difficulty often takes six to twelve sessions. Long-standing patterns or trauma take longer. Your counsellor should be able to give you a rough sense after two or three sessions." },
      { q: "What if I do not like my counsellor?", a: "Say so, or leave — both are acceptable. Fit predicts outcomes more reliably than technique does, and staying with a poor fit out of politeness wastes your money and your time." },
      { q: "Is it confidential from my employer or family?", a: "Yes. The only limits are risk of serious harm to you or someone else, a child or vulnerable adult at risk, or a court order. These get explained in the first session." },
    ],
    related: [
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first session" },
      { href: "/guides/how-to-find-a-therapist-in-bc", label: "How to find a therapist in BC" },
      { href: "/compare/individual-vs-couples-therapy", label: "Individual or couples therapy — which first?" },
      { href: "/pricing", label: "Fees and coverage" },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors", url: "https://bcacc.ca/" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
  },
  {
    slug: "couples-therapy",
    directAnswer:
      "Couples therapy at Westpeak Wellness is Gottman Method-informed relationship counselling delivered by secure video across British Columbia, provided by a Registered Clinical Counsellor (MA, RCC). The work begins with a structured assessment — a joint session, an individual session with each partner, then an agreed treatment plan — rather than with advice. It addresses recurring conflict, drifting apart, rebuilding after a breach of trust, and deciding whether to continue. Separating well is treated as a legitimate outcome rather than a failure.",
    figure2: "first-session-flow",
    figure: "gottman-method",
    name: "Couples Therapy",
    short: "Gottman Method — communication, conflict, connection, repair.",
    metaTitle: "Online Couples Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online couples counselling across BC using the research-based Gottman Method — communication, conflict, and repair. Book a free consultation.",
    hero: "Strengthen communication, deepen connection, repair what's frayed.",
    intro:
      "Every couple hits friction. Couples therapy is a structured, research-based space to understand the patterns underneath the arguments — and to build the skills to move through conflict without losing each other. Sessions are 50 minutes (or a 120-minute extended option), online across BC.",
    helps: [
      "Communication that keeps breaking down",
      "Recurring conflict and gridlock",
      "Rebuilding trust after a rupture",
      "Growing apart or feeling unseen",
      "Navigating big decisions together",
    ],
    approach:
      "Couples work here is grounded in the Gottman Method — one of the most researched approaches to couples therapy. It's practical and skills-based: you'll leave sessions with tools, not just insight, and a clearer map of how the two of you connect and repair.",
    featured: true,
    whatItIs: {
      h2: "What makes the Gottman Method different",
      body: [
        "Most couples therapy grew out of clinical theory. The Gottman Method grew out of observation — decades of research watching couples interact under controlled conditions and following them for years to see which relationships lasted.",
        "The practical result is specificity. Instead of \"work on your communication\", the model names particular behaviours strongly associated with breakdown — criticism, contempt, defensiveness, and stonewalling — and teaches particular replacements for each. Couples generally leave with something to do, not only something to understand.",
        "A second finding worth knowing early: research suggests a large share of conflict in long-term relationships is **perpetual rather than solvable** — rooted in enduring differences in personality or values. The goal for those is not resolution but a way of having the disagreement that does not damage anything. Recognising which of your arguments are which is often the first relief. There is a fuller explanation in [the guide to how the Gottman Method works](/guides/how-the-gottman-method-works).",
      ],
    },
    signs: [
      { label: "The same argument on a loop", detail: "Predictable moves on both sides, a predictable ending, and no memory of what it was originally about." },
      { label: "You have become logistics", detail: "Two competent people running a household efficiently, with the friendship quietly gone." },
      { label: "One of you shuts down", detail: "Withdrawal read as indifference, which is usually flooding — overwhelmed and offline rather than uncaring." },
      { label: "Trust has been broken", detail: "An affair, a financial betrayal, a serious breach — and both of you want to try to repair it." },
      { label: "A decision you cannot discuss", detail: "Children, moving, money, family obligation. Every attempt ends the same way." },
      { label: "You need to know whether to stay", detail: "A legitimate goal. Couples therapy is not obliged to produce a reconciliation." },
    ],
    sessionShape: {
      h2: "How the work is structured",
      body: [
        "Gottman work starts with a structured assessment rather than diving in: a joint session, an individual session with each partner, and questionnaires covering friendship, conflict, and shared meaning. You then get a shared picture of where the relationship is strong and where it is stuck — often the first time both people have looked at the same map.",
        "Sessions are 50 minutes, with a 110-minute extended option that suits couples travelling in from a distance or working through something that needs more room. Much of the work happens in the room: structured conversations with the counsellor interrupting patterns in real time, rather than reporting on the week afterwards.",
        "**On safety:** the individual sessions are partly a screen. Where there is ongoing violence or coercive control, couples therapy is not the safe starting point and can increase risk — a responsible practitioner will say so and redirect. VictimLinkBC is available 24/7 at 1-800-563-0808.",
        "**On sequencing:** if one partner is carrying untreated trauma, depression, or an addiction, individual work alongside or before couples sessions is often the more effective order. [The comparison of individual and couples therapy](/compare/individual-vs-couples-therapy) covers how to decide.",
      ],
    },
    faqs: [
      { q: "Does my partner have to be willing?", a: "For couples work, yes — it does not function with one participant. But individual therapy about a relationship is useful in its own right, and changing your side of a pattern sometimes shifts things enough that the other person reconsiders." },
      { q: "Will the counsellor take sides?", a: "No, and the method is explicitly structured to prevent it. If you consistently feel ganged up on, name it — that is a problem with the work rather than a normal feature of it." },
      { q: "Can we attend from different locations?", a: "Yes. Because sessions are virtual, partners can join from separate places when work or travel requires it — which removes one of the most common scheduling obstacles for couples." },
      { q: "How long does couples therapy take?", a: "Assessment alone is typically two to four sessions. Beyond that it depends on what you are working on; a specific stuck pattern usually moves faster than repair after a significant breach." },
    ],
    related: [
      { href: "/guides/how-the-gottman-method-works", label: "How the Gottman Method works" },
      { href: "/compare/individual-vs-couples-therapy", label: "Individual or couples therapy — which first?" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
      { href: "/services/individual-therapy", label: "Individual therapy across BC" },
    ],
    sources: [
      { label: "The Gottman Institute — research", url: "https://www.gottman.com/about/research/" },
      { label: "VictimLinkBC — 24/7 support, 1-800-563-0808", url: "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/victimlinkbc" },
    ],
  },
  {
    slug: "emdr-therapy",
    directAnswer:
      "EMDR (Eye Movement Desensitization and Reprocessing) at Westpeak Wellness is a structured eight-phase therapy for distressing memories, delivered by secure video across British Columbia by an EMDR-trained Registered Clinical Counsellor (MA, RCC). It has a strong evidence base for post-traumatic stress and is used for trauma, PTSD, anxiety and grief. Most of the protocol is preparation rather than eye movements: reprocessing does not begin until the regulation skills to come back down are reliably in place.",
    figure2: "first-session-flow",
    figure: "emdr-phases",
    name: "EMDR Therapy",
    short: "Evidence-based for trauma, PTSD, anxiety, grief.",
    metaTitle: "EMDR Therapy in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online EMDR therapy across BC for trauma, PTSD, anxiety, and grief. EMDR-trained Registered Clinical Counsellor. Book a free 15-minute consultation.",
    hero: "Process painful memories so they stop running the show.",
    intro:
      "EMDR (Eye Movement Desensitization and Reprocessing) is an evidence-supported therapy that helps the brain reprocess distressing memories so they lose their grip. You don't have to relive everything in detail or explain it perfectly — EMDR works with how memory is stored, not just how it's told. Available online across BC, including a 90-minute intensive format.",
    helps: [
      "Trauma and PTSD",
      "Distressing or intrusive memories",
      "Anxiety and panic",
      "Grief and loss",
      "Intergenerational and cultural trauma",
    ],
    approach:
      "Your counsellor is EMDR-trained and works in a paced, trauma-informed way — we build safety and stability first, and never move faster than you're ready for. EMDR translates well to virtual sessions, and many people find the comfort of their own space helps the work.",
    featured: true,
    whatItIs: {
      h2: "Why EMDR works differently from talking it through",
      body: [
        "Ordinary memories fade and integrate — you remember that something happened without your body returning to the state it was in at the time. Some memories do not file themselves that way. They stay stored with the images, sounds, body sensations and beliefs from the moment intact, so recalling them is closer to re-experiencing them.",
        "That is why \"I know intellectually it wasn't my fault\" so often changes nothing about how it feels. The understanding is in one system; the memory is stored in another.",
        "EMDR works on that storage problem rather than on the narrative. You hold the memory in mind while your attention is partly occupied by bilateral stimulation — eye movements, alternating taps, or alternating tones — and the memory typically becomes less vivid and less charged. **You do not have to describe it in detail for this to work**, which is why EMDR is often the route in for people who have avoided therapy precisely because they cannot face retelling it. There is a phase-by-phase walkthrough in [the guide on what EMDR is](/guides/what-is-emdr-and-how-a-session-works).",
      ],
    },
    signs: [
      { label: "A memory that still intrudes", detail: "Arriving uninvited, in full colour, sometimes triggered by something small and unrelated." },
      { label: "You understand it but still feel it", detail: "The gap between what you know and what your body does — the clearest indication for EMDR over purely talk-based work." },
      { label: "You cannot face describing it", detail: "Avoidance of therapy specifically because of the retelling. EMDR requires far less of that." },
      { label: "Your reactions do not match the present", detail: "Startle, panic, shutdown, or rage at a scale that belongs to something older than what is in front of you." },
      { label: "A single identifiable event", detail: "An accident, an assault, a medical event, a death. Single-incident trauma is where EMDR tends to move fastest." },
      { label: "Grief that has not moved", detail: "A loss that stayed frozen rather than settling over time." },
    ],
    sessionShape: {
      h2: "How EMDR runs here",
      body: [
        "EMDR is an eight-phase protocol, not an improvised technique. The first two phases are history-taking and preparation — building grounding skills, a settling place, and an agreed signal to stop. **This is the part that gets rushed by inexperienced practitioners and should not be.** Nothing gets processed before there is enough stability to tolerate it.",
        "Processing sessions run 50 minutes, with a 90-minute intensive format available where longer uninterrupted time suits the work better. Sessions always close before you leave — you are never sent off mid-processing.",
        "Online, bilateral stimulation uses a moving marker on screen, alternating tones through headphones, or self-administered tapping — the butterfly hug, arms crossed, alternating taps on each shoulder. Many people prefer the self-administered version because it puts the pace directly in their control.",
        "**When it is not the right first move:** if you are in an actively unsafe situation, in early substance-use recovery, or currently without much ground underneath you, the honest answer is often \"not yet\" — stabilisation first. A practitioner proposing processing in a first session, without knowing your history, is moving too fast.",
      ],
    },
    faqs: [
      { q: "Do I have to tell you what happened?", a: "Not in detail. Your counsellor needs enough to identify the target — an image, the belief attached to it, where it sits in your body — but the processing itself does not require narration. Many people say little during a set." },
      { q: "Does EMDR work over video?", a: "Yes, with adaptation. On-screen movement, alternating audio, or self-administered tapping all work. The preparation phase matters more online, not less, and a careful practitioner will spend longer there." },
      { q: "How many sessions?", a: "Single-incident trauma in someone otherwise stable can resolve in a handful of processing sessions. Complex or intergenerational trauma is a longer piece of work, and most of the early time goes to stabilisation." },
      { q: "Can EMDR make things worse?", a: "Trauma work paced badly can destabilise anyone — which is what phases 2 and 7 exist to prevent. Distress during a session is normal and temporary; deterioration lasting days is a signal to slow down, and worth saying out loud." },
    ],
    related: [
      { href: "/services/emdr-intensive", label: "EMDR intensives — the 90-minute format" },
      { href: "/guides/what-is-emdr-and-how-a-session-works", label: "What is EMDR and how a session works" },
      { href: "/compare/cbt-vs-emdr-for-trauma", label: "CBT or EMDR for trauma — how they differ" },
      { href: "/services/trauma-therapy", label: "Trauma therapy and trauma-informed care" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
    ],
    sources: [
      { label: "NICE — Post-traumatic stress disorder guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
      { label: "EMDR International Association", url: "https://www.apa.org/ptsd-guideline/treatments/eye-movement-reprocessing" },
    ],
  },
  {
    slug: "trauma-therapy",
    featured: true,
    directAnswer:
      "Trauma therapy at Westpeak Wellness is paced, trauma-informed counselling delivered by secure video across British Columbia by a Registered Clinical Counsellor (MA, RCC) trained in EMDR. The work is sequenced: capacity and regulation are built first, and memory is only approached once you can feel something and still think about it. It addresses single-incident trauma, complex and repeated trauma, and intergenerational patterns.",
    figure2: "first-session-flow",
    figure: "window-of-tolerance",
    name: "Trauma Therapy",
    short: "Trauma-informed care for single-incident, complex, and intergenerational trauma.",
    metaTitle: "Trauma Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online trauma therapy across BC — trauma-informed care for single-incident, complex, and intergenerational trauma. Book a free consultation.",
    hero: "Trauma-informed care, at a pace you set.",
    intro:
      "Trauma isn't only the big, obvious events — it's also the slow accumulation of things that were never safe to feel. Trauma therapy makes room for all of it, gently, without pushing you to perform or explain. Sessions are online across BC.",
    helps: [
      "Single-incident trauma (accidents, assault, medical events)",
      "Complex trauma from ongoing or early experiences",
      "Intergenerational and cultural trauma",
      "Hypervigilance, numbness, or feeling \"stuck\"",
      "Trauma that shows up as anxiety, anger, or shutdown",
    ],
    approach:
      "Trauma-informed care is the baseline for everything here — that means safety, choice, and pacing come first. Depending on what fits, the work may draw on EMDR, culturally adapted frames, and grounding skills you can use between sessions.",
    whatItIs: {
      h2: "Trauma is not only the obvious events",
      body: [
        "The word tends to summon a specific image — an accident, an assault, a disaster. Those are trauma. So is the slower kind: a childhood where emotion was unsafe, a long relationship with someone unpredictable, years of being responsible for an adult's stability, or a medical process nobody described as traumatic because everyone survived it.",
        "What makes something traumatic is less about the event's dramatic weight than about what it did to your capacity to feel safe — and whether there was anyone there to help you process it afterwards. **An event that someone else walked away from can genuinely have marked you**, and comparing your history against a scale of what \"counts\" is one of the more effective ways to stay stuck.",
        "Trauma-informed care means the way the work is conducted, not a technique applied to it: safety, choice, and pacing come first, and you decide what gets opened and when.",
      ],
    },
    signs: [
      { label: "Hypervigilance in safe conditions", detail: "Scanning, startling, waiting for something to go wrong when nothing is." },
      { label: "Numbness or flatness", detail: "Trauma does not always present as distress. Sometimes it presents as little — the volume turned down on everything." },
      { label: "Avoidance that keeps expanding", detail: "Places, conversations, people, or situations quietly removed from your life, one at a time." },
      { label: "Reactions out of proportion", detail: "Anger, panic, or shutdown that you can see is disproportionate while it is happening." },
      { label: "Difficulty trusting your own judgement", detail: "Particularly after experiences involving someone you trusted, or where you were told your perception was wrong." },
      { label: "It shows up in your body", detail: "Sleep, appetite, chronic tension, stomach trouble — often long before it shows up in words. See [intergenerational trauma](/guides/intergenerational-trauma-explained) for the inherited version of this." },
    ],
    sessionShape: {
      h2: "How the work is paced",
      body: [
        "The early sessions are not about the trauma. They are about building enough stability to approach it — grounding skills, understanding your own signs of overwhelm, and knowing how to bring yourself back. That groundwork is not a delay before the real work; it is what makes the real work survivable.",
        "From there the approach depends on what fits. [EMDR](/services/emdr-therapy) suits distress carrying specific charged memories. CBT-derived work suits beliefs that need direct examination — [the comparison of the two](/compare/cbt-vs-emdr-for-trauma) sets out how they differ. Where family or generational context matters, culturally adapted frames are part of the work rather than an add-on.",
        "**You set the pace, and that is a clinical commitment rather than a courtesy.** Trauma work pushed too fast destabilises people. If a session leaves you worse for several days, that is information about pacing, and it needs saying out loud rather than pushing through.",
        "**Timing matters too.** If you are currently in an unsafe situation, the first work is safety rather than processing. Reprocessing a threat that is still present does not help. VictimLinkBC is available 24/7 at 1-800-563-0808.",
      ],
    },
    faqs: [
      { q: "Do I have to talk about what happened?", a: "Not in detail, and not before you are ready. EMDR in particular requires far less description than people expect. \"I don't want to go into that yet\" is a complete and reasonable sentence." },
      { q: "What if I do not remember it clearly?", a: "Very common, and not an obstacle. Trauma memory is frequently fragmented. The work does not depend on a complete, verified account — it works with what is actually there." },
      { q: "Is my experience bad enough to count?", a: "If it is affecting how you live, it counts. Ranking your history against other people's is extremely common and reliably keeps people out of the room longer than anything else." },
      { q: "Will this make things worse before better?", a: "Approaching difficult material can stir things up temporarily, which is why pacing and stabilisation come first. Sustained deterioration is not an expected part of the process — it means slowing down." },
    ],
    related: [
      { href: "/services/emdr-therapy", label: "EMDR therapy across BC" },
      { href: "/compare/cbt-vs-emdr-for-trauma", label: "CBT or EMDR for trauma" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
      { href: "/for/healthcare-and-shift-workers", label: "For healthcare and shift workers" },
    ],
    sources: [
      { label: "CAMH — trauma", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/trauma" },
      { label: "NICE — PTSD guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
    ],
  },
  {
    slug: "anxiety-counselling",
    featured: true,
    directAnswer:
      "Anxiety counselling at Westpeak Wellness uses structured cognitive behavioural approaches, delivered by secure video across British Columbia by a Registered Clinical Counsellor (MA, RCC). It targets the mechanisms that keep anxiety running — avoidance, safety behaviours and reassurance-seeking — rather than the content of any individual worry. It suits panic, social anxiety, generalised anxiety, health anxiety and the high-functioning version that presents as capability. Sessions are 50 minutes.",
    figure2: "first-session-flow",
    figure: "anxiety-avoidance-cycle",
    name: "Anxiety Counselling",
    short: "Practical support for GAD, panic, social anxiety, and OCD.",
    metaTitle: "Anxiety Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online anxiety counselling across BC — evidence-based support for generalized anxiety, panic, social anxiety, and OCD. Book a free consultation.",
    hero: "Turn down the volume on anxiety.",
    intro:
      "When anxiety runs the show, it narrows your world — the things you avoid, the sleep you lose, the thoughts that loop. Anxiety counselling gives you practical tools to interrupt that cycle and get more room to live. Online across BC.",
    helps: [
      "Generalized anxiety and chronic worry",
      "Panic attacks and panic disorder",
      "Social anxiety",
      "OCD and intrusive thoughts",
      "Performance, health, and everyday anxiety",
    ],
    approach:
      "The work is grounded in CBT and evidence-based skills, adapted to you. You'll learn what's actually driving the anxiety and build concrete strategies — not just \"calm down,\" but a plan you can use when it counts.",
    whatItIs: {
      h2: "What anxiety counselling actually changes",
      body: [
        "Anxiety is not a thinking problem you can win by arguing with yourself, which is why \"just don't worry about it\" has never once worked. It is a threat-detection system that has calibrated too sensitively — and the things people do to feel better in the short term are usually what keep it calibrated that way.",
        "That is the mechanism worth understanding. Avoiding the thing you dread produces immediate relief, and that relief teaches your brain that avoidance is what kept you safe. Checking, reassurance-seeking, over-preparing, and rehearsing all work the same way. **Each one reduces anxiety now and increases it later**, which is why anxiety tends to expand quietly rather than settle.",
        "The work targets that loop directly. Not relaxation as a goal, but building enough tolerance for the discomfort that you stop needing the safety behaviours — at which point the threat system starts recalibrating on its own.",
      ],
    },
    signs: [
      { label: "Worry that will not switch off", detail: "Looping about things you cannot act on, often worst at night, often about something different each week." },
      { label: "Panic attacks", detail: "Sudden surges of intense fear with strong physical symptoms — often mistaken for a heart problem the first time. See [anxiety attack vs panic attack](/guides/anxiety-attack-vs-panic-attack)." },
      { label: "Your world is getting smaller", detail: "The highway, the supermarket, the meeting, the phone call. Each avoided thing feels reasonable in isolation." },
      { label: "Social situations cost too much", detail: "Rehearsing before, replaying after, and scanning for evidence you said something wrong." },
      { label: "Intrusive thoughts and checking", detail: "Unwanted thoughts that feel dangerous, and rituals to neutralise them. Very treatable, and under-reported out of shame." },
      { label: "Nobody can tell", detail: "Anxiety running the whole show underneath a life that looks entirely functional — see [high-functioning anxiety](/guides/high-functioning-anxiety)." },
    ],
    sessionShape: {
      h2: "How the work runs",
      body: [
        "The first sessions map the actual mechanics: what triggers it, what you do in response, and what that response is costing. Most people arrive knowing they are anxious and having never traced the loop, and seeing it laid out is frequently the first thing that shifts.",
        "From there the work is largely CBT-based and practical. You will learn what maintains the cycle, test the predictions your anxiety is making, and gradually drop the safety behaviours that have been propping it up. There is usually something to practise between sessions — not homework for its own sake, but because the recalibration happens in your life rather than in the room.",
        "**The uncomfortable part, stated honestly:** effective anxiety work involves approaching what you have been avoiding, at a pace you agree to. It is graded and it is collaborative, and it is not comfortable. Anyone promising anxiety treatment that never feels difficult is describing something else.",
        "Sessions are 50 minutes, usually weekly at first. Anxiety is one of the more responsive presentations — many people notice change within a couple of months, though longstanding avoidance takes longer to unwind.",
      ],
    },
    faqs: [
      { q: "Will I have to do exposure?", a: "In some form, usually — approaching what you have been avoiding is what changes the underlying prediction. It is graded, agreed in advance, and paced with you. Nobody is thrown in at the deep end." },
      { q: "Do I need medication as well?", a: "That is a question for your GP, not a counsellor — counsellors in BC cannot prescribe or advise on medication. Many people do well with therapy alone; some do better with both, and the two work fine together." },
      { q: "How fast does it work?", a: "Panic often responds within a few months of structured work. Generalized anxiety and long-standing avoidance take longer. Your counsellor should be able to give a rough sense after a few sessions." },
      { q: "Is it anxiety or something physical?", a: "Worth ruling out — thyroid problems, some medications, and other physical conditions can produce anxiety-like symptoms. A GP check is a reasonable first step and rules out a possibility your brain will otherwise keep proposing." },
    ],
    related: [
      { href: "/guides/anxiety-attack-vs-panic-attack", label: "Anxiety attack vs panic attack" },
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety" },
      { href: "/services/emdr-therapy", label: "EMDR therapy for anxiety and panic" },
      { href: "/for/university-students", label: "Counselling for BC post-secondary students" },
    ],
    sources: [
      { label: "Anxiety Canada", url: "https://www.anxietycanada.com/" },
      { label: "CAMH — anxiety disorders", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/anxiety-disorders" },
    ],
  },
  {
    slug: "depression-counselling",
    featured: true,
    directAnswer:
      "Depression counselling at Westpeak Wellness combines behavioural activation with cognitive work, delivered by secure video across British Columbia by a Registered Clinical Counsellor (MA, RCC). Because low mood removes motivation before it removes activity, the work schedules activity in advance rather than waiting for the desire to return. A counsellor does not diagnose or prescribe: where medication is part of the picture, the work runs alongside your physician or psychiatrist rather than instead of them.",
    figure2: "first-session-flow",
    figure: "burnout-vs-depression",
    name: "Depression Counselling",
    short: "For major depression, dysthymia, postpartum, and grief-related low mood.",
    metaTitle: "Depression Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online depression counselling across BC for major depression, persistent low mood, postpartum depression, and grief. Book a free 15-minute consultation.",
    hero: "When everything feels heavy, you don't have to carry it alone.",
    intro:
      "Depression can flatten colour out of things and make small tasks feel enormous. Counselling offers a steady place to be honest about how you're doing, and to rebuild momentum in a way that's realistic — not toxic positivity. Online across BC.",
    helps: [
      "Major depression and persistent low mood (dysthymia)",
      "Postpartum depression",
      "Grief-related depression",
      "Loss of motivation, meaning, or interest",
      "Depression alongside anxiety or burnout",
    ],
    approach:
      "The work is collaborative and without judgment, drawing on CBT and other evidence-based approaches. We'll go at a pace that respects how hard even showing up can be when you're depressed.",
    whatItIs: {
      h2: "Depression is not always sadness",
      body: [
        "The picture most people carry is tearfulness and visible misery. Plenty of depression looks nothing like that. It looks like flatness — colour drained out of things that used to matter. It looks like irritability, or numbness, or a competent person getting everything done while feeling almost nothing about any of it.",
        "That mismatch is why so many people arrive years late, having concluded they cannot be depressed because they are not sad. **The more reliable question is not \"am I sad\" but \"has anything felt good lately, and for how long has that been true?\"**",
        "The cruelty of depression as a problem is that it attacks the exact capacity required to address it. Energy, motivation, and the belief that anything would help are the first things to go — so \"just get out and exercise\" is not merely unhelpful, it describes a task the condition has specifically removed your ability to perform.",
      ],
    },
    signs: [
      { label: "Nothing is enjoyable", detail: "Not just the hard things — the things you used to look forward to. Often the clearest signal, and the easiest to miss from inside." },
      { label: "Everything costs more than it should", detail: "Ordinary tasks — a shower, an email, a phone call — requiring a disproportionate act of will." },
      { label: "Irritability rather than sadness", detail: "Frequently the presentation that gets missed, and often the thing a partner notices long before the person does." },
      { label: "Sleep and appetite have shifted", detail: "In either direction. Waking at 4am and not getting back, or sleeping ten hours and waking exhausted." },
      { label: "Harsh internal commentary", detail: "A running narrative about being a burden, a failure, or fundamentally not good enough, delivered as though it were factual." },
      { label: "You are still functioning", detail: "Depression and a full-time job coexist regularly. Functioning is not evidence against it." },
    ],
    sessionShape: {
      h2: "How the work is paced",
      body: [
        "Realistic pacing matters more here than in almost any other presentation, because the condition itself limits capacity. Sessions do not open with a list of things you should have done. If the week was survival, that is the honest starting point and it gets treated as one.",
        "The work is largely CBT-based, alongside behavioural activation — rebuilding activity in small, achievable steps, because in depression action reliably precedes motivation rather than following it. Waiting to feel like doing something is waiting for the wrong signal. Alongside that, the work examines the internal narrative: the conclusions about yourself that depression presents as observations.",
        "**On medication:** counsellors in BC cannot prescribe or advise on it. What therapy can do is help you have a clearer conversation with your GP, and the evidence for combining therapy and medication in moderate to severe depression is good. The two are not in competition.",
        "**On urgency:** if you are having thoughts of not wanting to be here, that does not wait for an appointment. Call or text **9-8-8** (Canada, 24/7), or **310-6789** for BC Mental Health Support. In immediate danger, call **911**.",
      ],
    },
    faqs: [
      { q: "How do I know if it is depression or just a bad stretch?", a: "Duration and breadth are the usual markers — weeks rather than days, and affecting most areas rather than one. A counsellor cannot diagnose in BC; a GP or psychologist can. What counselling can do is help regardless of the label." },
      { q: "I cannot face weekly appointments. Is that a problem?", a: "No, and it is worth saying rather than not booking. Every other week is workable, and virtual sessions remove the travel that often makes attendance impossible in the first place." },
      { q: "Does therapy work for depression, or do I need medication?", a: "Both have good evidence, and for moderate to severe depression the combination generally outperforms either alone. The medication question belongs with a physician; the two run perfectly well in parallel." },
      { q: "What about postpartum depression?", a: "Yes — that is common territory here, and the page for [new parents](/for/new-parents) covers what is specific about it, including the free BC support worth using alongside." },
    ],
    related: [
      { href: "/guides/burnout-vs-depression", label: "Burnout or depression — how to tell" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
      { href: "/for/women", label: "Counselling for women" },
      { href: "/resources/bc-crisis-and-support-directory", label: "BC crisis and support directory" },
    ],
    sources: [
      { label: "HereToHelp BC — depression info sheet", url: "https://www.heretohelp.bc.ca/infosheet/depression" },
      { label: "CAMH — depression", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/depression" },
    ],
  },
  {
    slug: "punjabi-counselling",
    directAnswer:
      "Westpeak Wellness offers counselling in Punjabi (ਪੰਜਾਬੀ) by secure video anywhere in British Columbia, provided by a Punjabi-speaking Registered Clinical Counsellor (MA, RCC). Working in the language you think in removes the translation overhead from material that is difficult to say once, and means family context does not have to be explained from scratch. Individual and couples sessions are both available in Punjabi, and you can move between Punjabi and English within a session.",
    figure2: "first-session-flow",
    figure: "bc-reach",
    name: "Punjabi-Speaking Counselling",
    short: "Therapy in Punjabi, English, or both — culturally fluent.",
    metaTitle: "Punjabi-Speaking Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online Punjabi-speaking therapy across BC — counselling in Punjabi, English, or both, with deep cultural competency. Book a free consultation.",
    hero: "You don't have to translate yourself.",
    intro:
      "Some things only land in your first language. Sessions are available in Punjabi, English, or a mix of both — with the cultural fluency to understand family expectations, generational silence, and \"log kya kahenge\" without needing it explained. Online across BC. There is also a [full page in Punjabi (ਪੰਜਾਬੀ)](/punjabi) covering services, fees and what a first session involves.",
    helps: [
      "Therapy in Punjabi or English (or both in one session)",
      "Family expectations and obligation",
      "Generational silence around mental health",
      "Cultural identity and belonging",
      "Being the first in your family to seek therapy",
    ],
    approach:
      "The practice is led by a Registered Clinical Counsellor whose Master's thesis focused on intergenerational trauma in the South Asian community. The work is culturally grounded from the start — you won't have to justify your context to be understood.",
    whatItIs: {
      h2: "Why first language matters even when your English is fluent",
      body: [
        "People who work, study and socialise in English often assume Punjabi-language therapy is not meant for them. In practice, the language you are fluent in and the language your feelings live in are frequently not the same one.",
        "You can be entirely comfortable presenting in a boardroom and still find that the words for grief, shame, obligation, or the exact texture of a family argument only exist properly in Punjabi. Some things flatten in translation. And if you spend a session translating, you spend it one step removed from what you actually feel — describing the emotion rather than being in it.",
        "**There is also the effort you never have to spend.** Explaining what *log kya kahenge* means, why moving out is not simple, why a parent's disappointment carries the weight it does. That is twenty minutes of every session recovered, and more importantly it removes the low-level work of translating yourself to be understood.",
      ],
    },
    signs: [
      { label: "You switch languages when it gets real", detail: "English for the account of what happened, Punjabi for what it did to you. Sessions here can move between them mid-sentence." },
      { label: "You are the first in your family to do this", detail: "No template, nobody to ask, and often not telling anyone you are going." },
      { label: "Family expectation is the actual subject", detail: "Career, marriage, money, obligation — and the guilt attached to choosing for yourself." },
      { label: "Previous therapy missed the point", detail: "Advice to set boundaries or move out that made sense in the abstract and none at all in your family." },
      { label: "Silence around mental health at home", detail: "A household where distress was met with practicality, prayer, or nothing — usually not cruelty, but a generation with no language for it." },
      { label: "Privacy is the barrier, not stigma", detail: "The concern is who might see you at a local clinic. Virtual sessions remove the question entirely." },
    ],
    sessionShape: {
      h2: "How sessions work",
      body: [
        "Sessions run in Punjabi, in English, or moving between them — you do not have to decide in advance, and most people end up doing both without planning it. Sessions are 50 minutes, fully virtual, anywhere in British Columbia.",
        "That province-wide reach matters more here than for most services. **Punjabi-speaking clinicians in BC are heavily concentrated in the Lower Mainland**, which means that for anyone in the Interior, the North, or on the Island, virtual sessions are not a convenience — they are realistically the only route to therapy in Punjabi at all. The [Kelowna](/online-counselling/kelowna) and [Prince George](/online-counselling/prince-george) pages set out what that gap looks like locally.",
        "**On what the work is not:** it is not therapy that treats your family as the diagnosis and distance as the cure. Most people arriving here want something harder — to stay in relationship with their family and stop carrying the parts that are not theirs. That is a legitimate goal and it is workable, and any decision about distance stays yours.",
        "**On confidentiality:** nothing is shared with your family, and because sessions are virtual there is no clinic to be seen entering. The only limits are risk of serious harm and a court order.",
      ],
    },
    faqs: [
      { q: "Do sessions have to be entirely in Punjabi?", a: "No. Most people move between Punjabi and English within a single session, which is how a lot of people actually think. You do not have to choose a language in advance or stick to it." },
      { q: "Will my family find out?", a: "No. Counselling is confidential and whether you tell anyone is your decision. Virtual sessions mean there is no waiting room and no building, which for many people here is the deciding factor." },
      { q: "Will I be told to cut off my family?", a: "No. That framing misreads the situation for most people. The work is usually about staying connected while stopping carrying what is not yours." },
      { q: "My parents think therapy is for serious problems. Are they wrong?", a: "They are describing a generation's understanding of it, formed when the only visible mental-health care was for crisis. Most therapy is ordinary people working on ordinary difficulty before it becomes serious." },
    ],
    related: [
      { href: "/for/first-gen-south-asian-adults", label: "For first- and second-gen South Asian adults" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
      { href: "/services/south-asian-mental-health", label: "South Asian mental health counselling" },
      { href: "/online-counselling/surrey", label: "Online counselling in Surrey" },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors", url: "https://bcacc.ca/" },
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
  },
  {
    slug: "south-asian-mental-health",
    directAnswer:
      "Westpeak Wellness provides culturally grounded counselling for South Asian adults across British Columbia by secure video, from a Registered Clinical Counsellor (MA, RCC) whose master's thesis examined intergenerational trauma in the South Asian community. It addresses family obligation, reputation and collective decision-making, the pressure carried by the children of migration, and the specific bind where duty and love are hard to separate. Sessions run in English or Punjabi.",
    figure2: "first-session-flow",
    figure: "window-of-tolerance",
    name: "South Asian Mental Health",
    short: "Family expectations, identity, and intergenerational patterns.",
    metaTitle: "South Asian Therapy in BC | Westpeak Wellness",
    metaDescription:
      "Therapy in Punjabi or English with someone who already knows what log kya kahenge means — so the family context is the starting point, not the preamble.",
    hero: "Holding two cultural worlds, without splitting yourself in two.",
    intro:
      "For many first- and second-generation South Asian folks, the pressure isn't one big thing — it's the daily negotiation between family, culture, and the life you're building. This is counselling that already speaks that language. Online across BC.",
    helps: [
      "Family expectations and obligation",
      "First-gen and second-gen identity",
      "Intergenerational patterns and trauma",
      "Navigating culture, faith, and independence",
      "Guilt, duty, and setting boundaries with family",
    ],
    approach:
      "The practice brings both lived experience and clinical training focused on the South Asian community. Cultural frames are woven in when family or generational context matters — not as an afterthought, but as part of how the work is done.",
    whatItIs: {
      h2: "The specific weight of the second generation",
      body: [
        "The pressure that brings most people here is not one large event. It is the daily negotiation between what your family expects, what your culture assumes, and the life you are actually building — conducted without anyone acknowledging that a negotiation is happening.",
        "There is a particular version of this that comes up constantly and is almost never said out loud: **your parents' migration is understood to have been worth it because of how you turned out.** That means ordinary adult difficulty — a job you hate, a marriage failing, a business that folded, a diagnosis — carries an extra charge. It is not just your problem. It is evidence about whether the sacrifice paid off.",
        "Carrying that silently is heavy, and it is one of the most common threads in this work. Naming it, often for the first time, tends to be where something starts to move.",
      ],
    },
    signs: [
      { label: "Two selves that do not overlap", detail: "One version at home, another at work, and the exhaustion of maintaining both — plus the question of which is real." },
      { label: "Guilt attached to ordinary choices", detail: "Career, partner, city, faith, money. Choosing for yourself feeling like a small betrayal rather than a normal adult act." },
      { label: "Obligation with no visible limit", detail: "Duty that has no defined edge, so there is never a point at which you have done enough." },
      { label: "Community perception shaping decisions", detail: "*Log kya kahenge* — not vanity, but a real social currency with real consequences for your parents as well as you." },
      { label: "Patterns older than you", detail: "Vigilance, silence, or achievement-as-safety inherited from a household shaped by things nobody discussed — see [intergenerational trauma](/guides/intergenerational-trauma-explained)." },
      { label: "Therapy that missed before", detail: "Previous counselling that treated your family as the problem and independence as the answer." },
    ],
    sessionShape: {
      h2: "How this work is approached",
      body: [
        "The starting point is that your context is not pathology. Collectivist family structures, duty, and obligation are not disorders to be corrected — they are the environment the work happens inside, and any approach that treats them as symptoms has misunderstood the situation.",
        "In practice the work usually involves separating two things that have fused: what you want, and what you owe. Those are different questions, and a lot of people have never had room to ask the first one. From there it is about what you are willing to be responsible for — the difference between declining to manage someone else's disappointment and abandoning them, which is a distinction that takes real work to feel rather than merely understand.",
        "Where language matters, sessions are available in [Punjabi, English, or both](/services/punjabi-counselling). Where the difficulty carries specific charged memories, [EMDR](/services/emdr-therapy) may be part of it — though intergenerational material is paced slowly, with considerably more stabilisation than single-incident work.",
        "**An honest note:** this work sometimes changes how you relate to your family, and not always toward more closeness. It can mean clearer boundaries, and it can surface grief about what was not available. Worth knowing at the start rather than discovering halfway through.",
      ],
    },
    faqs: [
      { q: "Will I be told my family is the problem?", a: "No. Your family is context, not diagnosis. The work is generally about staying in relationship while stopping carrying what is not yours — and any decision about distance is yours to make, not a goal set for you." },
      { q: "Can we do this in Punjabi?", a: "Yes — in Punjabi, English, or moving between them within a session." },
      { q: "I feel guilty even booking. Is that normal?", a: "Extremely. For a lot of people, seeking help feels like admitting the family did something wrong, which is not what it is. That guilt is often one of the first useful things to look at." },
      { q: "Do I have to tell my family I am in therapy?", a: "No. That is entirely your decision, and sessions are virtual so there is no clinic to be seen at." },
    ],
    related: [
      { href: "/for/first-gen-south-asian-adults", label: "For first- and second-gen South Asian adults" },
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety" },
    ],
    sources: [
      { label: "HereToHelp BC — mental health information", url: "https://www.heretohelp.bc.ca/" },
      { label: "CMHA BC — programs and services", url: "https://cmha.bc.ca/" },
    ],
  },
  {
    slug: "online-counselling-bc",
    directAnswer:
      "Westpeak Wellness is a fully virtual counselling practice serving all of British Columbia by secure video, with no office and no catchment area. A Registered Clinical Counsellor (MA, RCC) registered in BC can work with clients anywhere in the province under the same ethical, legal and privacy standards that apply in person. Research consistently finds video-delivered therapy produces outcomes broadly comparable to in-person work for the concerns most people bring. Sessions are 50 minutes, with evening slots by request.",
    figure2: "first-session-flow",
    figure: "bc-reach",
    name: "Online Counselling BC",
    short: "Secure virtual sessions anywhere in British Columbia.",
    metaTitle: "Online Counselling Across BC | Westpeak Wellness",
    metaDescription:
      "Secure online counselling anywhere in BC. Virtual therapy with a Registered Clinical Counsellor — same standards as in-person care.",
    hero: "Therapy that fits your real life, anywhere in BC.",
    intro:
      "Westpeak Wellness is a fully virtual practice. That means no commute, no waiting room, and access to the same quality of care whether you're in Vancouver, Prince George, or a small town on the Island. All you need is a private space and a stable connection.",
    helps: [
      "Secure video sessions from anywhere in BC",
      "No commute, parking, or waiting rooms",
      "Same professional and privacy standards as in-person",
      "Easier to fit around work, family, and school",
      "Access to a Punjabi-speaking RCC province-wide",
    ],
    approach:
      "Virtual sessions follow the same ethical, legal, and privacy standards as in-person therapy. Sessions run on a secure, confidential video platform, and many clients find that meeting from their own space actually helps them open up.",
    whatItIs: {
      h2: "What the evidence says about virtual therapy",
      body: [
        "The honest version, rather than the reassuring one: for the concerns most people bring to counselling — anxiety, depression, trauma, relationship difficulty — research consistently finds video-delivered therapy produces outcomes broadly comparable to in-person work. A [2021 meta-analysis in *Clinical Psychology Review*](https://ctc-ri.org/sites/default/files/Are%20videoconferenced%20mental%20and%20behavioral%20health%20services%20just%20as%20good%20as%20in-person_%20A%20meta-analysis%20of%20a%20fast-growing%20practice%20(1).pdf) pooling videoconferenced services against in-person delivery found broadly equivalent results, and systematic reviews of [video-delivered CBT](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8713091/) reach similar conclusions.",
        "There are genuine trade-offs. Eye contact does not quite work through a camera. Some non-verbal information is lost. Technology interrupts. And for some people, home is a less containing space than a therapist's office precisely because there is no boundary between where you do the work and where you live. [The full guide sets out both sides](/guides/is-online-therapy-as-effective-as-in-person).",
        "**In BC the case for virtual is mostly about access rather than convenience.** Clinicians cluster in the Lower Mainland and southern Island. Outside those areas the realistic local choice is often a short list with waitlists — and for therapy in a language other than English, virtual is frequently the only route that exists.",
      ],
    },
    signs: [
      { label: "You are outside the Lower Mainland", detail: "Where local specialisation thins out fast — see [Prince George](/online-counselling/prince-george) and [Kelowna](/online-counselling/kelowna) for what that looks like." },
      { label: "Travel is what stops you attending", detail: "A cross-town appointment is rarely a 50-minute commitment. Removing the travel is often what makes weekly work sustainable." },
      { label: "You need therapy in Punjabi", detail: "Punjabi-speaking clinicians are concentrated in the Lower Mainland; virtual reaches the rest of the province." },
      { label: "Privacy is the concern", detail: "No waiting room, no building, and nobody who might see you arrive." },
      { label: "Your schedule will not hold still", detail: "Shift work, rotations, seasonal peaks, or a job that travels." },
      { label: "You move around BC", detail: "Registration is province-wide, so relocating within BC does not mean starting over with someone new." },
    ],
    sessionShape: {
      h2: "How virtual sessions run here",
      body: [
        "Sessions are 50 minutes on a secure, confidential video platform — not ordinary consumer video calling — and follow the same ethical, legal, and privacy standards as in-person therapy under BC law and the [BCACC](https://bcacc.ca) code of ethics.",
        "The practical setup matters more than people expect. Headphones improve both audio and privacy. A door that closes is ideal; a parked car outside the house is a completely legitimate substitute and more common than you would think. Test the connection before the first session rather than at the appointment time.",
        "**Agree in advance what happens if the call drops.** Thirty seconds of planning turns a technical failure into an inconvenience rather than something that feels like abandonment mid-sentence. It is the single most useful piece of preparation for virtual work.",
        "**What virtual cannot do:** this is not a crisis service, and sessions are scheduled rather than on-demand. Some situations need in-person care — acute risk, some assessments, circumstances requiring medical involvement. A responsible counsellor will say so and help you find the right referral rather than working around it. Crisis numbers are in the [BC crisis directory](/resources/bc-crisis-and-support-directory).",
      ],
    },
    faqs: [
      { q: "Is it as effective as in-person?", a: "For most presentations, research finds outcomes broadly comparable, with real trade-offs worth knowing about. What it cannot tell you is whether video suits you specifically — that gets answered in the first couple of sessions." },
      { q: "Is it secure?", a: "Sessions run on a confidential platform rather than standard consumer video calling, and the same professional obligations and BC privacy law apply. The variable is your side: a private space and headphones do most of the work." },
      { q: "Do I need to be in BC?", a: "Yes. Registration is provincial, so sessions are for people physically located in British Columbia at the time of the appointment. Travelling within BC is fine; travelling outside it is not." },
      { q: "Will my extended health cover virtual sessions?", a: "Nearly always on the same terms as in-person, provided your plan lists Registered Clinical Counsellors. The [coverage page](/resources/bc-extended-health-coverage-for-counselling) explains the exact wording to check." },
    ],
    related: [
      { href: "/guides/is-online-therapy-as-effective-as-in-person", label: "Is online therapy as effective as in-person?" },
      { href: "/online-counselling", label: "Areas served across British Columbia" },
      { href: "/resources/bc-extended-health-coverage-for-counselling", label: "Extended health coverage for counselling" },
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first session" },
    ],
    sources: [
      { label: "Are videoconferenced mental and behavioral health services just as good as in-person? — Clinical Psychology Review (2021)", url: "https://ctc-ri.org/sites/default/files/Are%20videoconferenced%20mental%20and%20behavioral%20health%20services%20just%20as%20good%20as%20in-person_%20A%20meta-analysis%20of%20a%20fast-growing%20practice%20(1).pdf" },
      { label: "Effectiveness of videoconference-delivered CBT — systematic and meta-analytic review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8713091/" },
    ],
  },

  /* The tenth service, added 2026-08-28. The EMDR intensive existed as a
   * Cliniko appointment type ($190 / 90 min, verified) and as half of a
   * comparison page — but had no service page of its own, so the query class
   * "emdr intensive bc" (a named target in PATH_TO_950.md, ceiling 820) had
   * nothing to land on. Three lenses, three pages, no overlap: what EMDR is
   * (/services/emdr-therapy), which format fits (/compare/emdr-intensive-
   * vs-weekly-emdr), and this — the intensive as an offering. */
  {
    slug: "emdr-intensive",
    figure: "emdr-phases",
    figure2: "session-requirements",
    name: "EMDR Intensive",
    short: "A 90-minute extended EMDR session for a specific target, with stability in place.",
    metaTitle: "EMDR Intensives in BC (90 min, Online) | Westpeak",
    metaDescription:
      "Extended 90-minute EMDR sessions by video across BC — for a specific target memory, with preparation done first. $190, insurance-eligible.",
    hero: "The same therapy, given room to finish what it starts.",
    directAnswer:
      "An EMDR intensive at Westpeak Wellness is a single extended session — 90 minutes rather than 50 — delivered by secure video anywhere in BC by an EMDR-trained Registered Clinical Counsellor. The longer arc lets preparation, reprocessing and proper closing happen in one sitting instead of being cut to fit the hour. Intensives suit people with a specific target memory and stable day-to-day footing; suitability is assessed first, in an ordinary session, and a free 15-minute consultation comes before anything. The session is $190 and reimbursable wherever a plan covers RCC counselling.",
    intro:
      "Standard EMDR sessions pay a fixed cost every week: settling in at the start, closing down safely at the end. Both are non-negotiable — but in a 50-minute container they can leave a processing window too short for a memory network that takes twenty minutes just to access. The intensive format exists to fix that arithmetic. One 90-minute sitting more than doubles the usable middle, because the fixed costs are paid once.",
    helps: [
      "A specific incident or target memory, identified and ready to work on",
      "Processing that keeps being cut short by the standard hour",
      "Schedules that make weekly attendance genuinely hard — shift work, rotations, travel",
      "Continuing work at depth after stabilisation is established",
    ],
    approach:
      "Nothing about the method changes — the same eight phases, the same safeguards, the same closing-down discipline. What changes is the container. Suitability is a clinical decision made together first: intensives are offered when a target is clear and stability is in place, and weekly pacing is recommended honestly when it is not.",
    whatItIs: {
      h2: "What an intensive is — and is not",
      body: [
        "An intensive is not faster therapy, and it is worth being precise about that before any money changes hands. A single extended session can cover ground that would take several weekly ones, but the total course of treatment is set by what your history requires, not by the format. Nobody can promise that concentrating the schedule concentrates the result.",
        "It is also not a first appointment. History-taking, preparation, and the resourcing work that makes reprocessing safe happen before an intensive is booked, in an ordinary session — an intensive that spends its length on groundwork has stopped being one. That sequencing is not upsell; it is what makes the format work.",
        "**Where stabilisation is still the main work — common with complex or long-standing trauma — weekly pacing is the better choice**, and you will be told so plainly. The [comparison page](/compare/emdr-intensive-vs-weekly-emdr) sets out both formats side by side.",
      ],
    },
    signs: [
      { label: "One incident keeps its grip", detail: "A crash, an assault, a medical event, a loss — a single identifiable memory that stays live no matter how thoroughly you understand it." },
      { label: "The hour keeps ending mid-work", detail: "In standard sessions the processing window opens late and closes early, and the same target takes weeks of approaches." },
      { label: "The calendar is the obstacle", detail: "Camp rotations, shift patterns, seasonal work, travel — the practical realities that make same-time-weekly a fiction for a lot of BC." },
      { label: "Stability is already in place", detail: "Day-to-day life is holding: sleep, work, support, no active crisis. That footing is what makes concentrated work appropriate." },
    ],
    sessionShape: {
      h2: "How the 90 minutes are structured",
      body: [
        "The arc is the standard EMDR session arc with room to breathe: settling and check-in, accessing the agreed target, reprocessing in sets with breaks as needed, and a full, unhurried closing so you leave regulated — the final stretch is protected no matter where the processing has reached.",
        "Expect to be tired afterwards. Processing is effortful and a longer session means more of it; it is sensible not to schedule anything demanding immediately after, and continued settling over the following days — dreams, memories surfacing, small shifts — is expected rather than concerning.",
        "Over video, the same adaptations as weekly virtual EMDR carry over: an on-screen moving target, alternating audio, or self-administered tapping. A private room, headphones and a stable connection are the practical requirements, and the [session-requirements diagram](/services/online-counselling-bc) covers the setup.",
      ],
    },
    faqs: [
      { q: "How much does an EMDR intensive cost?", a: "$190 for the 90-minute session, paid at booking. Wherever an extended-health plan reimburses Registered Clinical Counsellor sessions it applies here too — with one caution: some plans cap the amount per session, and a longer session with a higher fee can exceed a per-session cap even with annual room left. Check that wording before booking." },
      { q: "Can I book an intensive as my first appointment?", a: "No — and a practice that would let you is worth being wary of. A free 15-minute consultation comes first, then an ordinary session for history, preparation and a suitability check. The intensive works because that groundwork is already done." },
      { q: "How many intensives will I need?", a: "It depends entirely on the target and the history behind it. Some single-incident work resolves in one or two extended sittings alongside ordinary sessions; anything complex takes the course it takes. A rough sense after assessment is a fair thing to ask for; a fixed number quoted before meeting you is a guess." },
      { q: "Is a 90-minute session safe?", a: "Run properly, yes. The format keeps every safeguard of weekly EMDR — preparation beforehand, monitoring throughout, and protected closing-down time inside the session. The suitability check exists precisely so that people still building stability are steered to weekly pacing instead." },
      { q: "Does the intensive work over video?", a: "Yes. Bilateral stimulation adapts to video with an on-screen target, alternating audio or self-tapping, and the longer arc is if anything easier to hold without a commute on either side. What matters is the same as in-person: privacy, and a plan for the hour after." },
    ],
    related: [
      { href: "/compare/emdr-intensive-vs-weekly-emdr", label: "EMDR intensives vs weekly EMDR" },
      { href: "/services/emdr-therapy", label: "EMDR therapy — the full picture" },
      { href: "/guides/what-is-emdr-and-how-a-session-works", label: "What is EMDR and how a session works" },
      { href: "/services/trauma-therapy", label: "Trauma therapy" },
      { href: "/pricing", label: "Fees and coverage" },
    ],
    sources: [
      { label: "EMDR International Association — about EMDR therapy", url: "https://www.emdria.org/about-emdr-therapy/" },
      { label: "NICE — Post-traumatic stress disorder guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

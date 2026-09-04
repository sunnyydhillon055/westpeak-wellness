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
      "Individual therapy is space that belongs entirely to you: to think out loud, make sense of what you're carrying, and work toward what \"better\" looks like on your terms. Sessions are 50 minutes, weekly or biweekly, and always online so you can meet from wherever you feel most at ease in BC.",
    helps: [
      "Anxiety, overwhelm, and burnout",
      "Depression and low mood",
      "Life transitions: career, relationships, moving, loss",
      "Identity, self-worth, and belonging",
      "Family dynamics and generational patterns",
    ],
    approach:
      "The work is warm, direct, and paced to you. We start with your story and your goals, then draw on evidence-based approaches: CBT, EMDR, trauma-informed care, matched to what you actually need, not a one-size-fits-all script.",
    featured: true,
    whatItIs: {
      h2: "What individual therapy is actually for",
      body: [
        "Individual therapy has a reputation problem: it gets imagined either as crisis intervention or as an indulgence. In practice most of it is neither. It is a regular hour with someone whose only job in that hour is to pay attention to your situation, and who has no stake in any particular outcome.",
        "That matters more than it sounds. Most of the people in your life are inside your situation: partners, family, friends, colleagues all have a position on what you should do, and you manage their reactions while you talk. A counsellor does not need managing. You can say the ugly version of the thought, the one you have edited out of every other conversation, and find out what it actually looks like once it is out of your head.",
        "**You do not need a diagnosis or a crisis to qualify.** A great deal of useful work happens with people whose lives look fine from outside and feel heavier than they should from inside.",
      ],
    },
    signs: [
      { label: "The same pattern keeps repeating", detail: "Different job, different relationship, same outcome, and enough self-awareness to notice it without being able to interrupt it." },
      { label: "You are functioning and exhausted", detail: "Everything gets done and none of it feels good. Often the version described on [high-functioning anxiety](/guides/high-functioning-anxiety)." },
      { label: "A decision you cannot make", detail: "Career, relationship, whether to move, whether to stay, going in circles for months without getting closer." },
      { label: "Something changed and you have not caught up", detail: "A loss, a diagnosis, a separation, an ending. Not necessarily traumatic, just larger than you have had space to process." },
      { label: "You do not recognise your own reactions", detail: "Anger, numbness, or panic arriving out of proportion to what is in front of you." },
      { label: "You have nowhere to say it", detail: "Genuinely common in adulthood, a full life and no one available for the actual conversation." },
    ],
    sessionShape: {
      h2: "What the sessions look like",
      body: [
        "Sessions are 50 minutes, usually weekly at first, moving to every other week as things settle. Weekly is not a rule. It is that momentum is hard to build at longer intervals early on, and easy to maintain later.",
        "The first session is mostly orientation: what brought you, some history, and what you want to be different. You are not expected to arrive with it organised, and \"I don't know where to start\" is a normal opening. There is a full walkthrough in the guide on [what to expect in a first session](/guides/what-to-expect-first-therapy-session).",
        "After that, sessions tend to alternate between working on what is live that week and returning to the pattern underneath it. Some weeks are practical and skills-focused; some are not. Where the work touches trauma, it slows down deliberately, pacing is a clinical decision, not a delay.",
        "**On length:** some people come for six sessions with a specific stuck problem and finish. Others work for a year. Both are legitimate, and it is a reasonable thing to ask about directly rather than leaving open-ended.",
      ],
    },
    faqs: [
      { q: "How do I know if I need therapy?", a: "There is no threshold you have to cross. A useful question instead: is something taking up more of your attention than you want it to, and have your own attempts to shift it stopped working? If so, it is a reasonable use of an hour." },
      { q: "How many sessions will I need?", a: "It varies with what you are bringing. A specific, contained difficulty often takes six to twelve sessions. Long-standing patterns or trauma take longer. Your counsellor should be able to give you a rough sense after two or three sessions." },
      { q: "What if I do not like my counsellor?", a: "Say so, or leave. Both are acceptable. Fit predicts outcomes more reliably than technique does, and staying with a poor fit out of politeness wastes your money and your time." },
      { q: "Is it confidential from my employer or family?", a: "Yes. The only limits are risk of serious harm to you or someone else, a child or vulnerable adult at risk, or a court order. These get explained in the first session." },
    ],
    related: [
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first session" },
      { href: "/guides/how-to-find-a-therapist-in-bc", label: "How to find a therapist in BC" },
      { href: "/compare/individual-vs-couples-therapy", label: "Individual or couples therapy, which first?" },
      { href: "/pricing", label: "Fees and coverage" },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors", url: "https://bcacc.ca/" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
  },

  {
    slug: "couples-therapy",
    directAnswer:
      "Couples therapy at Westpeak Wellness is Gottman Method-informed relationship counselling delivered by secure video across British Columbia, provided by a Registered Clinical Counsellor (MA, RCC). The work begins with a structured assessment, a joint session, an individual session with each partner, then an agreed treatment plan, rather than with advice. It addresses recurring conflict, drifting apart, rebuilding after a breach of trust, and deciding whether to continue. Separating well is treated as a legitimate outcome rather than a failure.",
    figure2: "first-session-flow",
    figure: "gottman-method",
    name: "Couples Therapy",
    short: "Gottman Method: communication, conflict, connection, repair.",
    metaTitle: "Online Couples Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online couples counselling across BC using the research-based Gottman Method: communication, conflict, and repair. Book a free consultation.",
    hero: "Strengthen communication, deepen connection, repair what's frayed.",
    intro:
      "Every couple hits friction. Couples therapy is a structured, research-based space to understand the patterns underneath the arguments, and to build the skills to move through conflict without losing each other. Sessions are 50 minutes (or a 120-minute extended option), online across BC.",
    helps: [
      "Communication that keeps breaking down",
      "Recurring conflict and gridlock",
      "Rebuilding trust after a rupture",
      "Growing apart or feeling unseen",
      "Navigating big decisions together",
    ],
    approach:
      "Couples work here is grounded in the Gottman Method. One of the most researched approaches to couples therapy. It's practical and skills-based: you'll leave sessions with tools, not just insight, and a clearer map of how the two of you connect and repair.",
    featured: true,
    whatItIs: {
      h2: "What makes the Gottman Method different",
      body: [
        "Most couples therapy grew out of clinical theory. The Gottman Method grew out of observation, decades of research watching couples interact under controlled conditions and following them for years to see which relationships lasted.",
        "The practical result is specificity. Instead of \"work on your communication\", the model names particular behaviours strongly associated with breakdown: criticism, contempt, defensiveness, and stonewalling, and teaches particular replacements for each. Couples generally leave with something to do, not only something to understand.",
        "A second finding worth knowing early: research suggests a large share of conflict in long-term relationships is **perpetual rather than solvable**, rooted in enduring differences in personality or values. The goal for those is not resolution but a way of having the disagreement that does not damage anything. Recognising which of your arguments are which is often the first relief. There is a fuller explanation in [the guide to how the Gottman Method works](/guides/how-the-gottman-method-works).",
      ],
    },
    signs: [
      { label: "The same argument on a loop", detail: "Predictable moves on both sides, a predictable ending, and no memory of what it was originally about." },
      { label: "You have become logistics", detail: "Two competent people running a household efficiently, with the friendship quietly gone." },
      { label: "One of you shuts down", detail: "Withdrawal read as indifference, which is usually flooding, overwhelmed and offline rather than uncaring." },
      { label: "Trust has been broken", detail: "An affair, a financial betrayal, a serious breach, and both of you want to try to repair it." },
      { label: "A decision you cannot discuss", detail: "Children, moving, money, family obligation. Every attempt ends the same way." },
      { label: "You need to know whether to stay", detail: "A legitimate goal. Couples therapy is not obliged to produce a reconciliation." },
    ],
    sessionShape: {
      h2: "How the work is structured",
      body: [
        "Gottman work starts with a structured assessment rather than diving in: a joint session, an individual session with each partner, and questionnaires covering friendship, conflict, and shared meaning. You then get a shared picture of where the relationship is strong and where it is stuck, often the first time both people have looked at the same map.",
        "Sessions are 50 minutes, with a 110-minute extended option that suits couples travelling in from a distance or working through something that needs more room. Much of the work happens in the room: structured conversations with the counsellor interrupting patterns in real time, rather than reporting on the week afterwards.",
        "**On safety:** the individual sessions are partly a screen. Where there is ongoing violence or coercive control, couples therapy is not the safe starting point and can increase risk. A responsible practitioner will say so and redirect. VictimLinkBC is available 24/7 at 1-800-563-0808.",
        "**On sequencing:** if one partner is carrying untreated trauma, depression, or an addiction, individual work alongside or before couples sessions is often the more effective order. [The comparison of individual and couples therapy](/compare/individual-vs-couples-therapy) covers how to decide.",
      ],
    },
    faqs: [
      { q: "Does my partner have to be willing?", a: "For couples work, yes. It does not function with one participant. But individual therapy about a relationship is useful in its own right, and changing your side of a pattern sometimes shifts things enough that the other person reconsiders." },
      { q: "Will the counsellor take sides?", a: "No, and the method is explicitly structured to prevent it. If you consistently feel ganged up on, name it. That is a problem with the work rather than a normal feature of it." },
      { q: "Can we attend from different locations?", a: "Yes. Because sessions are virtual, partners can join from separate places when work or travel requires it, which removes one of the most common scheduling obstacles for couples." },
      { q: "How long does couples therapy take?", a: "Assessment alone is typically two to four sessions. Beyond that it depends on what you are working on; a specific stuck pattern usually moves faster than repair after a significant breach." },
    ],
    related: [
      { href: "/guides/how-the-gottman-method-works", label: "How the Gottman Method works" },
      { href: "/compare/individual-vs-couples-therapy", label: "Individual or couples therapy, which first?" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
      { href: "/services/individual-therapy", label: "Individual therapy across BC" },
    ],
    sources: [
      { label: "The Gottman Institute, research", url: "https://www.gottman.com/about/research/" },
      { label: "VictimLinkBC, 24/7 support, 1-800-563-0808", url: "https://www2.gov.bc.ca/gov/content/justice/criminal-justice/victims-of-crime/victimlinkbc" },
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
      "EMDR (Eye Movement Desensitization and Reprocessing) is an evidence-supported therapy that helps the brain reprocess distressing memories so they lose their grip. You don't have to relive everything in detail or explain it perfectly: EMDR works with how memory is stored, not just how it's told. Available online across BC, including a 90-minute intensive format.",
    helps: [
      "Trauma and PTSD",
      "Distressing or intrusive memories",
      "Anxiety and panic",
      "Grief and loss",
      "Intergenerational and cultural trauma",
    ],
    approach:
      "Your counsellor is EMDR-trained and works in a paced, trauma-informed way, we build safety and stability first, and never move faster than you're ready for. EMDR translates well to virtual sessions, and many people find the comfort of their own space helps the work.",
    featured: true,
    whatItIs: {
      h2: "Why EMDR works differently from talking it through",
      body: [
        "Ordinary memories fade and integrate. You remember that something happened without your body returning to the state it was in at the time. Some memories do not file themselves that way. They stay stored with the images, sounds, body sensations and beliefs from the moment intact, so recalling them is closer to re-experiencing them.",
        "That is why \"I know intellectually it wasn't my fault\" so often changes nothing about how it feels. The understanding is in one system; the memory is stored in another.",
        "EMDR works on that storage problem rather than on the narrative. You hold the memory in mind while your attention is partly occupied by bilateral stimulation: eye movements, alternating taps, or alternating tones, and the memory typically becomes less vivid and less charged. **You do not have to describe it in detail for this to work**, which is why EMDR is often the route in for people who have avoided therapy precisely because they cannot face retelling it. There is a phase-by-phase walkthrough in [the guide on what EMDR is](/guides/what-is-emdr-and-how-a-session-works).",
      ],
    },
    signs: [
      { label: "A memory that still intrudes", detail: "Arriving uninvited, in full colour, sometimes triggered by something small and unrelated." },
      { label: "You understand it but still feel it", detail: "The gap between what you know and what your body does, the clearest indication for EMDR over purely talk-based work." },
      { label: "You cannot face describing it", detail: "Avoidance of therapy specifically because of the retelling. EMDR requires far less of that." },
      { label: "Your reactions do not match the present", detail: "Startle, panic, shutdown, or rage at a scale that belongs to something older than what is in front of you." },
      { label: "A single identifiable event", detail: "An accident, an assault, a medical event, a death. Single-incident trauma is where EMDR tends to move fastest." },
      { label: "Grief that has not moved", detail: "A loss that stayed frozen rather than settling over time." },
    ],
    sessionShape: {
      h2: "How EMDR runs here",
      body: [
        "EMDR is an eight-phase protocol, not an improvised technique. The first two phases are history-taking and preparation: building grounding skills, a settling place, and an agreed signal to stop. **This is the part that gets rushed by inexperienced practitioners and should not be.** Nothing gets processed before there is enough stability to tolerate it.",
        "Processing sessions run 50 minutes, with a 90-minute intensive format available where longer uninterrupted time suits the work better. Sessions always close before you leave. You are never sent off mid-processing.",
        "Online, bilateral stimulation uses a moving marker on screen, alternating tones through headphones, or self-administered tapping, the butterfly hug, arms crossed, alternating taps on each shoulder. Many people prefer the self-administered version because it puts the pace directly in their control.",
        "**When it is not the right first move:** if you are in an actively unsafe situation, in early substance-use recovery, or currently without much ground underneath you, the honest answer is often \"not yet\": stabilisation first. A practitioner proposing processing in a first session, without knowing your history, is moving too fast.",
      ],
    },
    faqs: [
      { q: "Do I have to tell you what happened?", a: "Not in detail. Your counsellor needs enough to identify the target. An image, the belief attached to it, where it sits in your body, but the processing itself does not require narration. Many people say little during a set." },
      { q: "Does EMDR work over video?", a: "Yes, with adaptation. On-screen movement, alternating audio, or self-administered tapping all work. The preparation phase matters more online, not less, and a careful practitioner will spend longer there." },
      { q: "How many sessions?", a: "Single-incident trauma in someone otherwise stable can resolve in a handful of processing sessions. Complex or intergenerational trauma is a longer piece of work, and most of the early time goes to stabilisation." },
      { q: "Can EMDR make things worse?", a: "Trauma work paced badly can destabilise anyone, which is what phases 2 and 7 exist to prevent. Distress during a session is normal and temporary; deterioration lasting days is a signal to slow down, and worth saying out loud." },
    ],
    related: [
      { href: "/services/emdr-therapy", label: "EMDR intensives, the 90-minute format" },
      { href: "/guides/what-is-emdr-and-how-a-session-works", label: "What is EMDR and how a session works" },
      { href: "/compare/cbt-vs-emdr-for-trauma", label: "CBT or EMDR for trauma, how they differ" },
      { href: "/services/individual-therapy", label: "Trauma therapy and trauma-informed care" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
    ],
    sources: [
      { label: "NICE, Post-traumatic stress disorder guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
      { label: "EMDR International Association", url: "https://www.apa.org/ptsd-guideline/treatments/eye-movement-reprocessing" },
    ],
  },

  /* FAMILY COUNSELLING — added 31 Aug 2026, at the owner's request, as one of
   * the five services the practice offers.
   *
   * Written shorter than the services around it on purpose. The older entries
   * ran to 1,900 rendered words each and the brief for this pass was a site a
   * client can actually read. This one carries what someone deciding needs —
   * what it is, who is in the room, what the first session does, and the two
   * questions people actually ask — and sends the rest to the guides.
   *
   * NOT couples therapy with more chairs. The distinction matters clinically
   * and it is the thing people get wrong when booking, so the page leads with
   * it. */
  {
    slug: "family-counselling",
    figure2: "first-session-flow",
    figure: "window-of-tolerance",
    name: "Family Counselling",
    short: "For the pattern between you, not the person you think is the problem.",
    metaTitle: "Online Family Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online family counselling across BC in English, Punjabi or Tagalog. Conflict, communication, and the gap between generations. Free 15-minute consultation.",
    hero: "When the difficulty lives between people, not inside one of them.",
    directAnswer:
      "Family counselling at Westpeak Wellness is relationship work involving more than one family member, delivered by secure video across British Columbia by a Registered Clinical Counsellor (MA, RCC), in English or Punjabi. It treats the pattern between people rather than one person's behaviour, and is used for recurring conflict, communication that has broken down, adult children and parents who cannot talk, blended-family adjustment, and the distance that opens between generations in immigrant families. Not everyone needs to attend every session.",
    intro:
      "Families rarely arrive because one person is unwell. They arrive because something between them keeps happening. The same argument, the same silence, the same subject nobody can raise. Family counselling works on that pattern, with the people who are part of it in the room.",
    helps: [
      "The same argument, on repeat",
      "Adult children and parents who cannot talk",
      "Generational and cultural distance",
      "Blended families finding their footing",
      "One person's difficulty affecting everyone",
    ],
    approach:
      "Sessions are structured rather than open-ended, and nobody is put on trial. The first job is usually to establish what each person thinks is happening, because families frequently discover they have been solving different problems. Who attends can change session to session, sometimes the useful work is with two people, not five.",
    signs: [
      { label: "The same argument, different night", detail: "The subject changes and the shape does not. That is a pattern, and patterns are workable." },
      { label: "Nobody can raise the actual thing", detail: "Everyone knows what it is. It has been unsayable for long enough that saying it now feels dangerous." },
      { label: "Parents and adult children have gone quiet", detail: "Contact continues; conversation does not. Often the language of the relationship changed and nobody named it." },
      { label: "One person's difficulty has become everyone's", detail: "Illness, addiction or crisis in one member reorganises the whole family, usually without anyone agreeing to it." },
    ],
    whatItIs: {
      h2: "It is not couples therapy with more chairs",
      body: [
        "Couples work has two people and a shared decision to make about the relationship. Family work often has an uneven set: someone who wanted to come, someone who agreed to, and someone who is there because the others asked. That difference shapes everything about how a session runs.",
        "It also means the goal is rarely agreement. It is far more often **a way of disagreeing that does not cost anyone the relationship**, which is a lower bar than families expect and a much more durable one.",
        "Where the pattern is older than the people in the room, [intergenerational trauma](/guides/intergenerational-trauma-explained) covers what that looks like and why it repeats.",
      ],
    },
    faqs: [
      { q: "Does everyone have to come?", a: "No. Useful family work regularly happens with two or three people rather than everyone, and who attends can change between sessions. It is worth raising on the free consultation, because the answer depends on what is actually going on." },
      { q: "Can sessions run in Punjabi?", a: "Yes: in Punjabi, English, or moving between them within one session, which is frequently what family sessions need when parents and adult children are most fluent in different languages." },
      { q: "What if someone refuses to attend?", a: "That is common and it is not a dead end. Work can start with whoever is willing, and a family pattern often shifts when one person changes how they respond to it. Nobody is required to be there." },
      { q: "Is this for teenagers?", a: "This practice works with adults. Where a child or teenager is the focus, you would be pointed toward a service set up for that rather than booked in, see [our standards and scope](/standards)." },
    ],
    related: [
      { href: "/services/couples-therapy", label: "Couples therapy" },
      { href: "/services/punjabi-counselling", label: "Counselling in Punjabi" },
      { href: "/for/south-asian-intergenerational-conflict", label: "South Asian intergenerational conflict" },
    ],
    sources: [
      { label: "HereToHelp BC, families and mental health", url: "https://www.heretohelp.bc.ca/" },
      { label: "BC Association of Clinical Counsellors, find a counsellor", url: "https://bc-counsellors.org/counsellors/" },
    ],
  },

  {
    slug: "punjabi-counselling",
    directAnswer:
      "Westpeak Wellness offers counselling in Punjabi (ਪੰਜਾਬੀ) by secure video anywhere in British Columbia, provided by a Punjabi-speaking Registered Clinical Counsellor (MA, RCC). Working in the language you think in removes the translation overhead from material that is difficult to say once, and means family context does not have to be explained from scratch. Individual and couples sessions are both available in Punjabi, and you can move between Punjabi and English within a session.",
    figure2: "first-session-flow",
    figure: "bc-reach",
    name: "Punjabi-Speaking Counselling",
    short: "Therapy in Punjabi, English, or both, culturally fluent.",
    metaTitle: "Punjabi-Speaking Counselling in BC | Westpeak Wellness",
    metaDescription:
      "Online Punjabi-speaking therapy across BC: counselling in Punjabi, English, or both, with deep cultural competency. Book a free consultation.",
    hero: "You don't have to translate yourself.",
    intro:
      "Some things only land in your first language. Sessions are available in Punjabi, English, or a mix of both: with the cultural fluency to understand family expectations, generational silence, and \"log kya kahenge\" without needing it explained. Online across BC. There is also a [full page in Punjabi (ਪੰਜਾਬੀ)](/punjabi) covering services, fees and what a first session involves.",
    helps: [
      "Therapy in Punjabi or English (or both in one session)",
      "Family expectations and obligation",
      "Generational silence around mental health",
      "Cultural identity and belonging",
      "Being the first in your family to seek therapy",
    ],
    approach:
      "The practice is led by a Registered Clinical Counsellor whose Master's thesis focused on intergenerational trauma in the South Asian community. The work is culturally grounded from the start. You won't have to justify your context to be understood.",
    whatItIs: {
      h2: "Why first language matters even when your English is fluent",
      body: [
        "People who work, study and socialise in English often assume Punjabi-language therapy is not meant for them. In practice, the language you are fluent in and the language your feelings live in are frequently not the same one.",
        "You can be entirely comfortable presenting in a boardroom and still find that the words for grief, shame, obligation, or the exact texture of a family argument only exist properly in Punjabi. Some things flatten in translation. And if you spend a session translating, you spend it one step removed from what you actually feel, describing the emotion rather than being in it.",
        "**There is also the effort you never have to spend.** Explaining what *log kya kahenge* means, why moving out is not simple, why a parent's disappointment carries the weight it does. That is twenty minutes of every session recovered, and more importantly it removes the low-level work of translating yourself to be understood.",
      ],
    },
    signs: [
      { label: "You switch languages when it gets real", detail: "English for the account of what happened, Punjabi for what it did to you. Sessions here can move between them mid-sentence." },
      { label: "You are the first in your family to do this", detail: "No template, nobody to ask, and often not telling anyone you are going." },
      { label: "Family expectation is the actual subject", detail: "Career, marriage, money, obligation, and the guilt attached to choosing for yourself." },
      { label: "Previous therapy missed the point", detail: "Advice to set boundaries or move out that made sense in the abstract and none at all in your family." },
      { label: "Silence around mental health at home", detail: "A household where distress was met with practicality, prayer, or nothing, usually not cruelty, but a generation with no language for it." },
      { label: "Privacy is the barrier, not stigma", detail: "The concern is who might see you at a local clinic. Virtual sessions remove the question entirely." },
    ],
    sessionShape: {
      h2: "How sessions work",
      body: [
        "Sessions run in Punjabi, in English, or moving between them. You do not have to decide in advance, and most people end up doing both without planning it. Sessions are 50 minutes, fully virtual, anywhere in British Columbia.",
        "That province-wide reach matters more here than for most services. **Punjabi-speaking clinicians in BC are heavily concentrated in the Lower Mainland**, which means that for anyone in the Interior, the North, or on the Island, virtual sessions are not a convenience. They are realistically the only route to therapy in Punjabi at all. The [Kelowna](/online-counselling/kelowna) and [Prince George](/online-counselling/prince-george) pages set out what that gap looks like locally.",
        "**On what the work is not:** it is not therapy that treats your family as the diagnosis and distance as the cure. Most people arriving here want something harder, to stay in relationship with their family and stop carrying the parts that are not theirs. That is a legitimate goal and it is workable, and any decision about distance stays yours.",
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
      { href: "/services/punjabi-counselling", label: "South Asian mental health counselling" },
      { href: "/online-counselling/surrey", label: "Online counselling in Surrey" },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors", url: "https://bcacc.ca/" },
      { label: "HereToHelp BC, mental health information", url: "https://www.heretohelp.bc.ca/" },
    ],
  },
];

export const featuredServices = services.filter((s) => s.featured);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

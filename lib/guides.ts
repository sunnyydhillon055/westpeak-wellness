import { moreGuides } from './guides-more';
import { moreGuides2 } from './guides-more2';
import { moreGuides3 } from './guides-more3';
import { moreGuides4 } from './guides-more4';
import { moreGuides5 } from './guides-more5';
import { moreGuides6 } from './guides-more6';

export type GuideSection = {
  h2: string;
  body?: string[];
  list?: { label: string; detail: string }[];
};

export type Guide = {
  slug: string;
  title: string;            // H1
  metaTitle: string;        // <= 60 incl. " | Westpeak Wellness"
  metaDescription: string;  // <= 155
  eyebrow: string;
  lede: string;
  shortAnswer: string;      // the direct answer, above the fold
  updated: string;          // ISO — powers Article schema + visible "reviewed" line
  readMinutes: number;
  sections: GuideSection[];
  midCta: { text: string; label: string };
  faqs: { q: string; a: string }[];
  sources: { label: string; url: string }[];
  related: { href: string; label: string }[];
  figure?: string;         // key into lib/figures.ts — renders the page's diagram
  figure2?: string;      // second diagram, further down the page
};

const coreGuides: Guide[] = [
  {
    slug: "is-online-therapy-as-effective-as-in-person",
    figure2: "first-session-flow",
    figure: "bc-reach",
    title: "Is online therapy as effective as in-person therapy?",
    metaTitle: "Is Online Therapy as Effective? | Westpeak Wellness",
    metaDescription:
      "What the research says about video therapy versus in-person, where the evidence is strongest, and the trade-offs worth knowing before you book.",
    eyebrow: "Guide · Online counselling",
    lede:
      "It is the most common question people ask before booking a virtual session, and it deserves a real answer rather than reassurance.",
    shortAnswer:
      "For the concerns most people bring to counselling — anxiety, depression, trauma, relationship difficulty — the research consistently finds video-delivered therapy produces outcomes broadly comparable to in-person work. That is not the same as saying the two are identical, and the differences are worth understanding before you decide.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "What the research actually shows",
        body: [
          "Video-delivered psychotherapy has been studied seriously for about two decades, and the picture that has emerged is unusually consistent for mental-health research. A [2021 meta-analysis in *Clinical Psychology Review*](https://ctc-ri.org/sites/default/files/Are%20videoconferenced%20mental%20and%20behavioral%20health%20services%20just%20as%20good%20as%20in-person_%20A%20meta-analysis%20of%20a%20fast-growing%20practice%20(1).pdf) pooling videoconferenced mental and behavioural health services against in-person delivery found broadly equivalent outcomes. Systematic reviews of [videoconference-delivered CBT for adults](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8713091/) have reached similar conclusions.",
          "The evidence is strongest for the conditions counselling most often addresses: depression, generalized anxiety, panic, and social anxiety. For post-traumatic stress there is an established base showing structured protocols — prolonged exposure, cognitive processing therapy, behavioural activation — delivered by video performing comparably to the same protocols delivered in a room.",
          "**An important limit on all of this:** \"broadly comparable on average, across studies\" is a statement about groups, not about you. Research describes what tends to happen across many people. It cannot tell you whether video will suit how *you* think, what you are bringing, or how you form trust. That question gets answered in the first couple of sessions, not in a meta-analysis.",
        ],
      },
      {
        h2: "The therapeutic relationship — the part people worry about most",
        body: [
          "The usual objection is not about technique. It is that something essential in the relationship gets lost through a screen. That worry is reasonable, because the working relationship between client and counsellor is one of the better predictors of whether therapy helps at all.",
          "The evidence here is more mixed than the outcome evidence. A [2024 systematic review and meta-analysis in the *Journal of Telemedicine and Telecare*](https://pubmed.ncbi.nlm.nih.gov/36974478/) examining therapeutic alliance in videoconferencing versus in-person psychotherapy found alliance generally comparable, while noting genuine inconsistency across studies. The honest summary is: most people build a working relationship over video about as well as they do in a room, and some people do not.",
        ],
      },
      {
        h2: "Where video is genuinely harder",
        body: [
          "A page that only lists advantages is selling something. These are the real trade-offs:",
        ],
        list: [
          { label: "Eye contact does not quite work", detail: "Cameras sit above screens, so nobody is ever quite looking at anybody. Most people stop noticing within a session or two, but it is a real difference." },
          { label: "Some non-verbal information is lost", detail: "A screen frames head and shoulders. Posture shifts, hand movement, and the way someone holds their whole body are partly cut off." },
          { label: "Technology interrupts", detail: "A frozen frame in the middle of a difficult sentence breaks something that a quiet room would have held. Agreeing in advance what happens if the call drops takes thirty seconds and removes most of this." },
          { label: "Home is not always a containing space", detail: "For some people the therapist's office is useful precisely because it is separate — you go there, you do the work, you leave it behind. Doing trauma work in the room where you also sleep is a different experience, and not always a better one." },
          { label: "Privacy can be the hard part", detail: "Thin walls, roommates, small apartments, a partner working from home. This is the most common practical barrier, and it is worth solving before the first session rather than during it." },
          { label: "Some situations need in-person care", detail: "Acute risk, some assessments, and circumstances requiring in-person medical involvement are not well served by video. A responsible counsellor will say so and help you find the right referral." },
        ],
      },
      {
        h2: "What makes video sessions work better",
        body: [
          "The difference between a frustrating virtual session and a good one is usually logistics rather than anything clinical:",
          "Use headphones — they improve audio and privacy at once. Find a door that closes, even if it is a parked car outside the house. Test the connection before the first session rather than during it. Put the device on something solid at roughly eye level. And agree with your counsellor at the outset what you will both do if the call fails mid-session, so that a dropped connection is an inconvenience rather than an abandonment.",
        ],
      },
      {
        h2: "What this means in British Columbia specifically",
        body: [
          "In BC the argument for virtual counselling is not mainly about convenience — it is about access. Counsellors cluster in the Lower Mainland and the southern Island. If you live in the north or the Interior, the realistic local choice may be a short list with waitlists rather than a genuine choice at all; the practical reality of that is set out on the [Prince George page](/online-counselling/prince-george).",
          "It matters even more if you need therapy in a language other than English. Punjabi-speaking clinicians in BC are heavily concentrated in the Lower Mainland, so for most of the province [therapy in Punjabi](/services/punjabi-counselling) is only realistically available by video.",
          "On cost: BC's Medical Services Plan does not cover counselling, whatever the format. Extended health plans that cover Registered Clinical Counsellors generally treat a virtual session exactly as they treat an in-person one — the [fees and coverage page](/pricing) sets out how reimbursement works.",
        ],
      },
    ],
    midCta: {
      text: "The most reliable way to find out whether video suits you is to try fifteen minutes of it at no cost.",
      label: "Book a free 15-minute consultation",
    },
    faqs: [
      {
        q: "Does online therapy work for trauma and EMDR?",
        a: "There is an established evidence base for structured trauma protocols delivered by video, and EMDR adapts to virtual sessions using on-screen or self-administered bilateral stimulation. Pacing matters more than format — safety and stability come first either way. You can read more on the EMDR therapy page.",
      },
      {
        q: "Is a virtual session as confidential as an in-person one?",
        a: "From the counsellor's side, yes — the same professional obligations and BC privacy law apply, and sessions run on a secure platform rather than ordinary consumer video calling. The variable is your side of the call: a private space and headphones do most of the work.",
      },
      {
        q: "Will my extended health plan cover a video session?",
        a: "Nearly all BC extended health plans that cover Registered Clinical Counsellors reimburse virtual sessions on the same terms as in-person ones. Coverage amounts and per-session limits vary by plan, so it is worth confirming your specific benefits.",
      },
      {
        q: "What if I try it and it does not suit me?",
        a: "That is a legitimate outcome and worth saying out loud early. Some people work better in a room, and a counsellor who cannot offer that should help you find someone who can.",
      },
    ],
    sources: [
      { label: "Are videoconferenced mental and behavioral health services just as good as in-person? A meta-analysis — Clinical Psychology Review (2021)", url: "https://ctc-ri.org/sites/default/files/Are%20videoconferenced%20mental%20and%20behavioral%20health%20services%20just%20as%20good%20as%20in-person_%20A%20meta-analysis%20of%20a%20fast-growing%20practice%20(1).pdf" },
      { label: "Effectiveness of videoconference-delivered CBT for adults with psychiatric disorders — systematic and meta-analytic review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8713091/" },
      { label: "Therapeutic alliance in videoconferencing psychotherapy compared to in person — Journal of Telemedicine and Telecare (2024)", url: "https://pubmed.ncbi.nlm.nih.gov/36974478/" },
      { label: "HereToHelp BC — mental health information for British Columbians", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/services/online-counselling-bc", label: "How online counselling works across BC" },
      { href: "/services/emdr-therapy", label: "EMDR therapy for trauma and PTSD" },
      { href: "/compare/rcc-vs-psychologist-vs-social-worker-bc", label: "RCC, psychologist, or social worker — who to see in BC" },
      { href: "/pricing", label: "Fees and extended health coverage" },
    ],
  },
  {
    slug: "what-is-emdr-and-how-a-session-works",
    figure2: "first-session-flow",
    figure: "emdr-phases",
    title: "What is EMDR, and what actually happens in a session?",
    metaTitle: "What Is EMDR & How Sessions Work | Westpeak Wellness",
    metaDescription:
      "A plain explanation of EMDR therapy — the eight phases, what bilateral stimulation is, how it works online, and who it suits.",
    eyebrow: "Guide · EMDR",
    lede:
      "EMDR gets described either as miraculous or as pseudoscience, and it is neither. Here is what it is, phase by phase.",
    shortAnswer:
      "EMDR is a structured, eight-phase therapy for distressing memories. You bring a memory to mind while doing something that occupies your attention — following eye movements, tapping, or alternating sounds — and the memory typically becomes less vivid and less charged. It is recommended for PTSD in major clinical guidelines, and you do not have to describe the memory in detail for it to work.",
    updated: "2026-08-08",
    readMinutes: 7,
    sections: [
      {
        h2: "The idea underneath it",
        body: [
          "Ordinary memories fade and integrate. You remember that something happened, but recalling it does not put your body back into the state it was in at the time.",
          "Some memories do not file themselves that way. They stay stored with the sights, sounds, body sensations and beliefs from the moment intact, so that remembering is closer to re-experiencing. That is why a smell can put someone straight back into an event from fifteen years ago, and why \"I know intellectually it wasn't my fault\" so often fails to change how it feels.",
          "EMDR works on that filing problem rather than on the story. The theory is that holding the memory in mind while your attention is partly occupied by something else lets the brain reprocess it into ordinary autobiographical memory. **What the memory means to you can change without you needing to narrate all of it.**",
        ],
      },
      {
        h2: "The eight phases",
        body: [
          "EMDR is a protocol, not a technique someone improvises. It runs in eight phases, and the middle ones are what people picture when they think of EMDR:",
        ],
        list: [
          { label: "1. History and treatment planning", detail: "What you are bringing, what your history holds, and which memories to work on in what order. Usually a session or two." },
          { label: "2. Preparation", detail: "Building stabilisation skills before touching anything difficult — grounding, a mental safe place, a signal to stop. This phase gets rushed by inexperienced practitioners and should not be." },
          { label: "3. Assessment", detail: "Choosing one target memory: the worst image, the belief attached to it, the emotion, where it sits in the body, and a 0–10 distress rating." },
          { label: "4. Desensitisation", detail: "The part people mean by \"EMDR\". You hold the memory while following bilateral stimulation in short sets, then report whatever came up. Repeat until distress drops." },
          { label: "5. Installation", detail: "Strengthening a more accurate belief in place of the old one — \"I survived it\" rather than \"I am in danger\"." },
          { label: "6. Body scan", detail: "Checking for residual physical tension held with the memory, because the body often holds what the narrative has released." },
          { label: "7. Closure", detail: "Returning to a settled state before the session ends. You never leave mid-processing." },
          { label: "8. Re-evaluation", detail: "Next session, checking whether the change held before moving to the next target." },
        ],
      },
      {
        h2: "What bilateral stimulation actually is",
        body: [
          "The eye movements are the famous part and the most misunderstood. \"Bilateral stimulation\" means anything that alternates left and right: following a finger or a moving dot with your eyes, alternating taps on your knees or shoulders, or alternating tones through headphones.",
          "There is genuine scientific debate about *why* it helps. The leading explanation is that it taxes working memory — holding a vivid memory while also tracking something else leaves less capacity for the memory to be experienced at full intensity, which lets it be stored differently. Researchers disagree about the mechanism. What is better established is the outcome: [NICE guidance in the UK](https://www.nice.org.uk/guidance/ng116) recommends EMDR as a treatment for PTSD in adults, and it appears in international guidelines alongside trauma-focused CBT.",
        ],
      },
      {
        h2: "Does it work over video?",
        body: [
          "Yes, with adaptation. Online EMDR uses a moving marker on screen that you follow with your eyes, alternating audio tones through headphones, or self-administered tapping — the \"butterfly hug\", arms crossed, alternating taps on each shoulder. Many people find self-administered tapping more comfortable, because it gives them direct control over the pace.",
          "The stabilisation work in phase 2 matters more online, not less, because your counsellor cannot read the room the way they could in person. A careful practitioner will spend longer there and will agree explicitly what happens if you become overwhelmed or the connection drops. The broader evidence on video-delivered therapy is covered in [the guide on whether online therapy is as effective as in-person](/guides/is-online-therapy-as-effective-as-in-person).",
        ],
      },
      {
        h2: "Who it suits, and who it does not",
        body: [
          "EMDR tends to fit single-incident trauma, intrusive memories, and distress that has a clear \"before and after\" — an accident, an assault, a medical event, a specific loss. It is also used for complex and [intergenerational trauma](/guides/intergenerational-trauma-explained), though that work is slower and front-loads far more stabilisation.",
          "It is not automatically the right first move. If you are in an actively unsafe situation, in early recovery from substance use, or currently without enough stability to tolerate distress between sessions, the honest answer is often \"not yet\" — build the ground first. A practitioner who proposes EMDR in the first session without knowing your history is moving too fast.",
        ],
      },
    ],
    midCta: {
      text: "Wondering whether EMDR fits what you are carrying? That is exactly the kind of question a free 15-minute call is for.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Do I have to describe what happened in detail?", a: "No, and this is one of the main reasons people choose EMDR. Your counsellor needs enough to identify the target, but you are not required to narrate the event. Much of the processing happens without you saying what is going through your mind." },
      { q: "How many sessions does EMDR take?", a: "It varies enormously. A single-incident trauma in someone who is otherwise stable may resolve in a handful of processing sessions. Complex or long-standing trauma is a longer piece of work — often months — and most of the early time goes into stabilisation rather than processing." },
      { q: "Is EMDR distressing?", a: "Processing can bring up strong emotion during a session, which is expected and is why phases 2 and 7 exist. It should not leave you flooded and abandoned at the end. If a session consistently leaves you worse for days, say so — the pacing needs to change." },
      { q: "Can EMDR make things worse?", a: "Poorly paced trauma work can destabilise someone, which is why preparation and a properly trained practitioner matter. Done carefully, distress during a session is normal and temporary. Sustained deterioration is a signal to slow down, not to push on." },
    ],
    sources: [
      { label: "NICE — Post-traumatic stress disorder guideline (NG116)", url: "https://www.nice.org.uk/guidance/ng116" },
      { label: "American Psychological Association — EMDR in the PTSD treatment guideline", url: "https://www.apa.org/ptsd-guideline/treatments/eye-movement-reprocessing" },
      { label: "HereToHelp BC — trauma and mental health", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/services/emdr-therapy", label: "EMDR therapy across BC" },
      { href: "/services/trauma-therapy", label: "Trauma therapy and trauma-informed care" },
      { href: "/guides/intergenerational-trauma-explained", label: "Intergenerational trauma explained" },
      { href: "/guides/is-online-therapy-as-effective-as-in-person", label: "Is online therapy as effective as in-person?" },
    ],
  },

  {
    slug: "anxiety-attack-vs-panic-attack",
    figure2: "anxiety-avoidance-cycle",
    figure: "panic-vs-anxiety",
    title: "Anxiety attack vs panic attack: what is the difference?",
    metaTitle: "Anxiety Attack vs Panic Attack | Westpeak Wellness",
    metaDescription:
      "Panic attacks are a defined clinical term; anxiety attacks are not. What separates them, why it matters, and what helps in the moment.",
    eyebrow: "Guide · Anxiety",
    lede:
      "People use the two phrases interchangeably. Only one of them is a clinical term, and the difference changes what helps.",
    shortAnswer:
      "A panic attack is a defined clinical event: a sudden surge of intense fear that peaks within about ten minutes, with strong physical symptoms. \"Anxiety attack\" is not a clinical term — it is what most people call a period of escalating anxiety that builds more slowly, sits at lower intensity, and lasts longer. Both are real. They respond to different things in the moment.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "Why only one of them is a diagnosis",
        body: [
          "A **panic attack** is defined in the diagnostic manual clinicians use. It is an abrupt surge of intense fear or discomfort that reaches a peak within minutes, accompanied by at least four physical or cognitive symptoms — racing heart, sweating, trembling, shortness of breath, chest pain, nausea, dizziness, chills or heat, numbness or tingling, a sense of unreality, fear of losing control, fear of dying.",
          "**\"Anxiety attack\" appears nowhere in that manual.** It is a plain-language phrase people reached for because they needed one. That does not make the experience less real — it means clinicians cannot assume they know what you mean when you use it, which is why they will ask you to describe what happened rather than take the label at face value.",
        ],
      },
      {
        h2: "How they actually differ",
        list: [
          { label: "Onset", detail: "Panic arrives abruptly, often with no identifiable trigger, and can wake people from sleep. Escalating anxiety builds — over an hour, a morning, sometimes days ahead of something." },
          { label: "Peak", detail: "Panic peaks within roughly ten minutes and then declines, which is useful to know while it is happening. Anxiety can stay elevated for hours or days without a peak." },
          { label: "Intensity", detail: "Panic is overwhelming and frequently mistaken for a heart attack. Anxiety is usually less acute and more sustained — bad enough to ruin a day rather than to send you to emergency." },
          { label: "Trigger", detail: "Anxiety usually attaches to something identifiable. Panic often attaches to nothing at all, which is part of what makes it frightening." },
          { label: "The fear content", detail: "Panic often carries the fear that you are dying, having a heart attack, or losing your mind. Anxiety is more often about a specific outcome you can name." },
          { label: "Afterwards", detail: "Panic frequently leaves a fear of the next attack, which is how avoidance starts — and how panic disorder develops out of panic attacks." },
        ],
      },
      {
        h2: "What helps in the moment",
        body: [
          "The two need different responses, which is the practical reason the distinction matters.",
          "**For panic:** the goal is to ride it out, not to fight it. Fighting it adds fear, and fear is the fuel. It peaks and passes — usually inside ten minutes, always eventually. Slow the exhale rather than the inhale (breathe out for longer than you breathe in). Put your feet on the floor and name five things you can see. Resist the urge to leave the situation if you safely can, because leaving teaches the brain that leaving is what saved you, and that is the mechanism by which your world gets smaller.",
          "**For escalating anxiety:** there is more time and more to work with. Naming the specific fear out loud usually shrinks it. Physical discharge helps — a walk, stairs, anything that uses the mobilisation your body has already prepared. Writing the worry down and separating what is actionable from what is not is more effective than trying to think your way clear.",
          "**For both:** the first time, get it medically checked. Chest pain and breathlessness deserve a real assessment. Being told your heart is fine is also therapeutically useful — it removes a possibility your brain will otherwise keep proposing.",
        ],
      },
      {
        h2: "When it is worth getting support",
        body: [
          "One panic attack in a stressful period is common and not necessarily a sign of anything ongoing. The pattern worth acting on is when the fear of the next one starts shaping your decisions — avoiding the highway, the supermarket, the meeting, being alone. That avoidance is what converts an unpleasant experience into a condition that narrows your life.",
          "Panic responds well to structured treatment, particularly CBT-based approaches that work directly on the catastrophic interpretation of body sensations. That is the core of [anxiety counselling](/services/anxiety-counselling). If the anxiety instead runs quietly underneath a life that looks entirely functional from outside, [the guide on high-functioning anxiety](/guides/high-functioning-anxiety) is the more relevant one.",
        ],
      },
    ],
    midCta: {
      text: "If avoidance has started to shape your week, that is the point at which support tends to be worth it.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Can a panic attack actually hurt me?", a: "A panic attack is extremely unpleasant and not physically dangerous in itself. The symptoms are an intense version of a normal stress response. That said, get chest pain and breathlessness properly assessed the first time — ruling out a physical cause matters both medically and psychologically." },
      { q: "Why do panic attacks happen at night?", a: "Nocturnal panic attacks are well documented and wake people from sleep. They are not nightmares, and they are not a sign that something worse is happening — the same mechanism can fire without any conscious trigger." },
      { q: "Do I need medication?", a: "That is a question for a physician, not a counsellor — counsellors in BC cannot prescribe or advise on medication. Many people manage panic with therapy alone; some do better with both. Your GP is the right person to ask." },
      { q: "How long does treatment for panic take?", a: "Panic is one of the more treatable presentations. Structured CBT-based work often produces meaningful change within a few months, though this varies with how long avoidance has been in place." },
    ],
    sources: [
      { label: "Anxiety Canada — panic attacks and panic disorder", url: "https://www.anxietycanada.com/" },
      { label: "CAMH — anxiety disorders", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/anxiety-disorders" },
      { label: "HereToHelp BC — anxiety disorders info sheet", url: "https://www.heretohelp.bc.ca/infosheet/anxiety-disorders" },
    ],
    related: [
      { href: "/services/anxiety-counselling", label: "Anxiety counselling across BC" },
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety: signs and what helps" },
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first therapy session" },
      { href: "/services/emdr-therapy", label: "EMDR therapy for anxiety and panic" },
    ],
  },

  {
    slug: "high-functioning-anxiety",
    figure2: "first-session-flow",
    figure: "anxiety-avoidance-cycle",
    title: "High-functioning anxiety: when everything looks fine from outside",
    metaTitle: "High-Functioning Anxiety: Signs | Westpeak Wellness",
    metaDescription:
      "High-functioning anxiety is not a diagnosis, but the pattern is real — driven, capable, and exhausted. What it looks like and what helps.",
    eyebrow: "Guide · Anxiety",
    lede:
      "The version of anxiety that gets promoted, hits deadlines, remembers birthdays, and cannot sleep.",
    shortAnswer:
      "\"High-functioning anxiety\" is not a clinical diagnosis. It is a widely used description of anxiety in someone whose performance has not visibly slipped — often because the anxiety is what is driving the performance. The distress is real, the cost is real, and it tends to go unaddressed for years precisely because nothing has fallen over yet.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "Why it goes unnoticed",
        body: [
          "Most descriptions of anxiety centre on impairment — the person who cannot go to work, cannot leave the house, cannot cope. If your anxiety has produced the opposite, that description does not fit, so you conclude you do not qualify. If you want to put words to it first, the [reflection tool](/tools/stress-check) asks six questions and gives no score.",
          "The pattern that gets called high-functioning anxiety runs the other way. The worry becomes fuel. You are early, over-prepared, and reliable. You reply immediately. You reread the message before sending. You are the person others describe as having it together — and none of it feels like competence from inside. It feels like staying just ahead of something.",
          "**The reason to take it seriously is not that it stops you functioning. It is what the functioning costs.** Rest that is not restful, achievement that produces relief rather than satisfaction, and a nervous system that has not been off in years.",
        ],
      },
      {
        h2: "What it tends to look like",
        list: [
          { label: "Achievement powered by dread", detail: "You meet the deadline because missing it is unthinkable, not because the work pulls you. Finishing brings relief, then the next thing." },
          { label: "Rest feels unsafe", detail: "Sitting down produces restlessness or guilt. Downtime gets filled. Holidays take days to settle into, if they ever do." },
          { label: "Mental rehearsal", detail: "Conversations run in advance and again afterwards. You scan for what you might have said wrong." },
          { label: "Difficulty saying no", detail: "Agreeing is faster than tolerating the discomfort of disappointing someone, so the load keeps growing." },
          { label: "Body keeping score", detail: "Jaw tension, shoulders, stomach trouble, headaches, waking at 3am with the day already running." },
          { label: "Nobody knows", detail: "The people closest to you would be surprised. That gap between the outside and the inside is its own specific loneliness." },
        ],
      },
      {
        h2: "Why it is hard to give up",
        body: [
          "The genuine difficulty is that it works. The anxiety produced results — the grades, the job, the reputation for reliability. So any suggestion of turning it down sounds like a proposal to become worse at your life.",
          "That fear deserves a straight answer rather than reassurance. In practice, what changes in therapy is usually the *fuel* rather than the *output*. People who were driven by dread and become driven by something steadier tend not to collapse; they usually report that the same work costs less. But it is a real fear, it should be named early, and it is a reasonable thing to be cautious about.",
          "For a lot of people this pattern is also inherited rather than personal. If the household you grew up in ran on vigilance, or on the sense that security depended on performance, the strategy was rational when you formed it. [Intergenerational patterns](/guides/intergenerational-trauma-explained) sit underneath a great deal of what gets labelled high-functioning anxiety.",
        ],
      },
      {
        h2: "What actually helps",
        body: [
          "CBT-based work is effective here, though the target differs from panic-focused work. Rather than the catastrophic interpretation of body sensations, the targets are the rules — *if I stop, it falls apart*, *good enough is not safe*, *other people's disappointment is intolerable* — and the behaviours that keep them untested.",
          "The behavioural side is usually the uncomfortable part: deliberately sending the email without the fourth reread, leaving something at good-enough, saying no once and sitting with it. These are small and they are not easy, because each one is an experiment your anxiety has spent years preventing you from running.",
          "If this is where you are, the work is described in more detail on the [anxiety counselling page](/services/anxiety-counselling). If it has already tipped into exhaustion and detachment rather than drive, [burnout and depression](/guides/burnout-vs-depression) may be the closer fit.",
        ],
      },
    ],
    midCta: {
      text: "If \"nothing is actually wrong, I am just tired all the time\" is a sentence you have said, it is worth fifteen minutes.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Is high-functioning anxiety a real diagnosis?", a: "No. It is a descriptive phrase, not a clinical category — what a clinician might identify is generalized anxiety or another anxiety presentation. The label is useful because it names a pattern people recognise; it is not something that appears on a chart." },
      { q: "Do I need therapy if I am coping?", a: "Coping is not the threshold. If it costs you sleep, rest, and presence with people you care about, that is a legitimate reason to address it — and addressing it earlier is easier than addressing it after something gives way." },
      { q: "Will therapy make me less driven?", a: "The common outcome is that the same work costs less, rather than that ambition disappears. Worth raising directly in a first session, because it is the fear that keeps most people out of the room." },
      { q: "How is this different from just being conscientious?", a: "Conscientiousness feels like caring about doing things well. This feels like staying ahead of a threat. The reliable tell is what happens when you stop — genuine conscientiousness can rest, this pattern cannot." },
    ],
    sources: [
      { label: "Anxiety Canada — generalized anxiety disorder", url: "https://www.anxietycanada.com/" },
      { label: "CAMH — anxiety disorders", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/anxiety-disorders" },
      { label: "HereToHelp BC — anxiety information", url: "https://www.heretohelp.bc.ca/infosheet/anxiety-disorders" },
    ],
    related: [
      { href: "/services/anxiety-counselling", label: "Anxiety counselling across BC" },
      { href: "/guides/burnout-vs-depression", label: "Burnout or depression — how to tell" },
      { href: "/guides/anxiety-attack-vs-panic-attack", label: "Anxiety attack vs panic attack" },
      { href: "/for/first-gen-south-asian-adults", label: "Counselling for first- and second-gen South Asian adults" },
    ],
  },

  {
    slug: "what-to-expect-first-therapy-session",
    figure2: "bc-reach",
    figure: "first-session-flow",
    title: "What actually happens in a first therapy session",
    metaTitle: "What to Expect: First Therapy Session | Westpeak Wellness",
    metaDescription:
      "What a first counselling session involves, what you will be asked, what you do not have to share, and how to tell whether it is a fit.",
    eyebrow: "Guide · Getting started",
    lede:
      "The unknown is doing a lot of the work in keeping people out of the room. Here is the whole thing, start to finish.",
    shortAnswer:
      "A first session is mostly orientation: paperwork and confidentiality limits, what brought you, some history, and what you want to be different. You will not be asked to relive your worst experience, you are allowed to say \"I would rather not go into that yet,\" and the most useful thing you can do is notice whether you felt reasonably comfortable — that is the actual test.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "Before the session",
        body: [
          "Most practices send intake paperwork in advance: contact details, emergency contact, a consent form, and often a brief questionnaire about what you are bringing. Filling it in honestly saves session time — but if a question feels like too much to answer in a form, leaving it blank and raising it in person is entirely acceptable.",
          "For a virtual session, do the boring preparation. Test the link beforehand rather than at the appointment time. Find a room with a door, or a parked car. Headphones improve both audio and privacy. Have water and tissues within reach — you may not need them, and it is better not to go looking mid-sentence.",
        ],
      },
      {
        h2: "The first ten minutes: the unglamorous part",
        body: [
          "Sessions open with housekeeping, and a counsellor who skips it is cutting a corner. Expect confidentiality and its limits spelled out plainly: what you say stays private, except where there is risk of serious harm to you or someone else, where a child or vulnerable adult may be at risk, or where a court orders release. In BC this is set out in the [BCACC code of ethics](https://bcacc.ca) and provincial privacy law.",
          "Fees, cancellation policy, and how receipts work for [extended health reimbursement](/pricing) usually get covered here too. It is administrative and it is worth listening to — most later friction between client and counsellor traces back to something in this five minutes that nobody read out loud.",
        ],
      },
      {
        h2: "The main part: what you get asked",
        body: [
          "Then the actual conversation, which is more ordinary than people expect. The questions are usually some version of:",
        ],
        list: [
          { label: "What brings you here now?", detail: "Not just what is wrong — why now rather than six months ago. The answer often points straight at what matters." },
          { label: "How long has this been going on?", detail: "Whether it is recent, recurring, or lifelong changes what kind of work makes sense." },
          { label: "What does it affect?", detail: "Sleep, work, relationships, appetite, the things you have stopped doing." },
          { label: "What have you already tried?", detail: "Including previous therapy — what helped, what did not, and what you did not like. This is useful information, not a test." },
          { label: "Some background", detail: "Family, health, major events. Broad strokes in a first session; nobody is expecting a full history." },
          { label: "What would \"better\" look like?", detail: "The hardest question, and often the most important. \"I don't know\" is a completely acceptable answer and is sometimes the starting point." },
        ],
      },
      {
        h2: "What will not happen",
        body: [
          "You will not be made to describe trauma in detail. A competent counsellor works at your pace, and in trauma-informed practice that pacing is the point — going too fast is a clinical error, not thoroughness. \"I don't want to go into that yet\" is a complete sentence and a reasonable one.",
          "You will not be diagnosed. Counsellors in BC do not diagnose — that sits with psychologists, physicians and psychiatrists, as set out in [the comparison of BC therapist types](/compare/rcc-vs-psychologist-vs-social-worker-bc). You will also not be told what to do; if you get advice-giving in session one, that is worth noticing.",
          "And you will not be fixed. One session is orientation. Some people leave the first one lighter for having said things out loud; others leave stirred up, which is normal and usually settles within a day.",
        ],
      },
      {
        h2: "How to tell whether it is a fit",
        body: [
          "The research on what predicts good outcomes keeps pointing at the working relationship, which means your reaction to this person is data rather than politeness. Worth asking yourself afterwards: did I feel listened to rather than processed? Could I imagine saying the harder thing to them? Did they explain their approach in language I understood?",
          "You do not owe anyone a second session. Trying two or three counsellors before choosing is normal, and any decent practitioner would rather you found the right fit elsewhere than stayed out of politeness. The free consultation exists for exactly this reason.",
        ],
      },
    ],
    midCta: {
      text: "The 15-minute consultation is a lower-stakes version of all of this, and it costs nothing.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "What if I cry?", a: "Extremely common, entirely expected, and not something you need to apologise for. Tissues are standard equipment for a reason." },
      { q: "What if I have nothing to say?", a: "Also common. Your counsellor will ask questions — the session is not a performance you have to carry. \"I don't know where to start\" is a legitimate place to start." },
      { q: "How long is a session?", a: "Fifty minutes is the standard individual session across most of BC. Couples sessions are often 50 or a longer extended format. Fees are on the fees page." },
      { q: "Can I ask my counsellor questions?", a: "Yes, and it is worth doing. Their training, how they work, their experience with what you are bringing, what they think a realistic timeframe looks like. A good practitioner welcomes it." },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors — code of ethics and standards", url: "https://bcacc.ca/" },
      { label: "HereToHelp BC — getting help for mental health", url: "https://www.heretohelp.bc.ca/" },
      { label: "CMHA BC — finding help", url: "https://cmha.bc.ca/" },
    ],
    related: [
      { href: "/book", label: "Book a free 15-minute consultation" },
      { href: "/faq", label: "Frequently asked questions about starting therapy" },
      { href: "/compare/rcc-vs-psychologist-vs-social-worker-bc", label: "RCC, psychologist, or social worker in BC" },
      { href: "/pricing", label: "Fees and extended health coverage" },
    ],
  },
  {
    slug: "how-the-gottman-method-works",
    figure2: "first-session-flow",
    figure: "gottman-method",
    title: "How the Gottman Method works in couples therapy",
    metaTitle: "How the Gottman Method Works | Westpeak Wellness",
    metaDescription:
      "The research behind the Gottman Method, the Four Horsemen, what an assessment involves, and what couples actually do in session.",
    eyebrow: "Guide · Couples",
    lede:
      "Built on decades of watching couples argue in a lab, and unusually specific about what predicts trouble.",
    shortAnswer:
      "The Gottman Method is a structured, research-derived approach to couples therapy. It begins with a formal assessment, identifies specific destructive patterns — criticism, contempt, defensiveness, stonewalling — and teaches concrete replacements. It is skills-based rather than insight-based: couples leave with things to do, not only things to understand.",
    updated: "2026-08-08",
    readMinutes: 7,
    sections: [
      {
        h2: "Where it came from",
        body: [
          "Most couples therapy grew out of clinical theory. The Gottman Method grew out of observation — decades of research watching couples interact under controlled conditions, recording not just what they said but heart rate, facial expression, and tone, then following them for years to see which relationships lasted.",
          "That produced something unusual: an approach built on what actually distinguished couples who stayed together and happy from those who did not. The practical consequence is that the method is specific. Rather than \"improve communication\", it names particular behaviours that predict difficulty and teaches particular replacements.",
        ],
      },
      {
        h2: "The Four Horsemen",
        body: [
          "The best-known part of the model is a set of four communication patterns that research found strongly associated with relationship breakdown. Recognising them is usually the first thing couples take away:",
        ],
        list: [
          { label: "Criticism", detail: "Attacking character rather than raising a behaviour. \"You never think about anyone but yourself\" rather than \"I felt alone when you made that plan without me.\" The replacement is a complaint about a specific action, stated from your own experience." },
          { label: "Contempt", detail: "Eye-rolling, mockery, sarcasm, name-calling — communication from a position of superiority. This is the single strongest predictor in the research, and the antidote is deliberate: actively building a culture of appreciation, which sounds soft and is the hardest one to rebuild." },
          { label: "Defensiveness", detail: "Meeting a complaint with counter-attack or innocent victimhood. It reads as self-protection and functions as blame-return. The replacement is accepting some part of the responsibility, even a small part." },
          { label: "Stonewalling", detail: "Withdrawing, shutting down, going silent. Usually it is physiological flooding rather than indifference — the person is overwhelmed and has gone offline. The replacement is a proper break, agreed in advance, with a stated time to return." },
        ],
      },
      {
        h2: "What actually happens in the sessions",
        body: [
          "Gottman work usually starts with a structured assessment rather than diving straight in: a joint session, individual sessions with each partner, and questionnaires covering friendship, conflict, and shared meaning. The couple then gets fed back a picture of where the relationship is strong and where it is stuck — which is often the first time both people have seen the same map.",
          "From there the work targets specific areas: managing conflict that can be solved and learning to live with the conflict that cannot (research suggests a large share of relationship conflict is perpetual rather than solvable), rebuilding friendship and knowledge of each other, and repairing after ruptures. Sessions typically involve doing things in the room — structured conversations with the counsellor interrupting patterns in real time — rather than only reporting on the week.",
          "**On flooding:** a lot of Gottman work is physiological. When heart rate rises past a certain point, people stop being able to take in new information, which is why arguments at that stage go nowhere. Learning to notice it and stop before it happens is often the single most useful thing a couple takes from the work.",
        ],
      },
      {
        h2: "Who it fits, and when it is not the right call",
        body: [
          "It suits couples stuck in recurring arguments, couples who have drifted into logistics, couples rebuilding after a breach of trust, and couples facing a decision they keep failing to have a productive conversation about. It works whether or not both partners are certain they want to stay — clarity is a legitimate goal.",
          "It is not the right first move where there is ongoing violence or coercive control. Couples therapy in that context can increase risk, and a responsible practitioner will screen for it in the individual sessions and redirect. It is also difficult when one partner has already decided to leave and is using sessions to soften the exit — worth naming out loud rather than discovering three months in.",
          "Some concerns are better addressed individually first. If one partner is dealing with untreated trauma, depression, or an addiction, [individual therapy](/services/individual-therapy) running alongside or before couples work is often the more effective sequence.",
        ],
      },
    ],
    midCta: {
      text: "Not sure whether to start with couples sessions or individually? That is worth fifteen minutes before committing either way.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Does my partner have to want to come?", a: "For couples work, yes — it does not function with one willing participant. But individual therapy about a relationship is legitimate and useful in its own right, and sometimes changes the dynamic enough that the other person becomes willing." },
      { q: "Will the counsellor take sides?", a: "No. The method is explicitly structured to avoid it, which is part of why the assessment includes individual sessions with each partner. If you consistently feel ganged up on, say so — that is a problem with the work, not a normal feature of it." },
      { q: "How long does couples therapy take?", a: "Assessment alone typically takes two to four sessions. Beyond that it varies enormously with what you are working on. Couples with a specific stuck pattern often see change faster than couples repairing after a significant breach." },
      { q: "Can couples therapy work over video?", a: "Yes, and it solves a real logistical problem — two people no longer have to be in the same place at the same time to attend. Partners can even join from separate locations when schedules require it." },
    ],
    sources: [
      { label: "The Gottman Institute — research and the Four Horsemen", url: "https://www.gottman.com/about/research/" },
      { label: "HereToHelp BC — relationships and mental health", url: "https://www.heretohelp.bc.ca/" },
    ],
    related: [
      { href: "/services/couples-therapy", label: "Couples therapy across BC" },
      { href: "/compare/individual-vs-couples-therapy", label: "Individual or couples therapy — which first?" },
      { href: "/for/new-parents", label: "Counselling for new parents" },
      { href: "/services/individual-therapy", label: "Individual therapy" },
    ],
  },

  {
    slug: "burnout-vs-depression",
    figure2: "first-session-flow",
    figure: "burnout-vs-depression",
    title: "Burnout or depression: how to tell the difference",
    metaTitle: "Burnout vs Depression: The Difference | Westpeak Wellness",
    metaDescription:
      "Burnout is an occupational phenomenon, not a medical diagnosis. How it differs from depression, where they overlap, and what each needs.",
    eyebrow: "Guide · Burnout",
    lede:
      "They feel similar from inside, they need different things, and the distinction is not always clean.",
    shortAnswer:
      "The World Health Organization classifies burn-out as an occupational phenomenon — exhaustion, mental distance from your job, and reduced effectiveness — explicitly not a medical condition, and specifically tied to work. Depression is a diagnosable condition that colours everything, not only work. The most useful practical test: if a genuine two-week break with no work contact changes things substantially, it points toward burnout. If it changes nothing, that points elsewhere.",
    updated: "2026-08-08",
    readMinutes: 6,
    sections: [
      {
        h2: "What burnout officially is",
        body: [
          "In [ICD-11 the WHO defines burn-out](https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases) as a syndrome resulting from chronic workplace stress that has not been successfully managed, with three dimensions: energy depletion or exhaustion, increased mental distance from one's job or feelings of cynicism about it, and reduced professional efficacy.",
          "Two things in that definition matter. First, it is **specifically occupational** — the WHO states it should not be applied to experiences in other areas of life. Second, it is **not classified as a medical condition**; it is an occupational phenomenon. So while a doctor can sign you off sick for the exhaustion, \"burnout\" itself is not a diagnosis they are making.",
          "That framing has a consequence people find either clarifying or infuriating: **burnout is a description of what a situation has done to a person.** The situation is part of the problem, and no amount of self-care resolves an unsustainable workload.",
        ],
      },
      {
        h2: "Where they differ",
        list: [
          { label: "Scope", detail: "Burnout is tied to work — people often find that things they enjoy outside it still function. Depression tends to flatten everything, including what used to be reliable." },
          { label: "Self-regard", detail: "Depression frequently carries worthlessness and guilt that reach into who you are as a person. Burnout is more often about capacity — \"I cannot do this anymore\" rather than \"I am worthless.\"" },
          { label: "Response to distance", detail: "Real time away, with no email, often shifts burnout noticeably. Depression usually travels with you." },
          { label: "Cynicism", detail: "The mental distancing in burnout has a specific flavour — detachment and irritation towards the work and sometimes the people in it. That is characteristic of burnout rather than depression." },
          { label: "Hope", detail: "Burnout tends to hold onto the idea that a different job or a different load would help. Depression often removes the sense that anything would." },
        ],
      },
      {
        h2: "Where the distinction breaks down",
        body: [
          "This is the part most articles skip. Prolonged burnout frequently develops into depression, and the two overlap enough that separating them cleanly is often not possible — or particularly useful.",
          "Two things make a real difference to how urgent it is. **If there are thoughts of self-harm or of not wanting to be here, that is not burnout, whatever else is also true, and it needs medical attention rather than a holiday.** And if you cannot recall the last time anything felt good — including outside work, including things that used to be reliable — that is a stronger signal for depression than for occupational burnout.",
          "If you are not sure, that is a legitimate thing to bring rather than something to resolve before you get help. Your GP is the right person for the medical question, since [counsellors in BC cannot diagnose](/compare/rcc-vs-psychologist-vs-social-worker-bc).",
        ],
      },
      {
        h2: "What each actually needs",
        body: [
          "**Burnout responds to changes in conditions,** which is unwelcome news when the conditions are not fully yours to change. The work usually involves recovering the capacity to notice your own limits, rebuilding boundaries that eroded gradually, and being honest about which parts of the load are structural. Therapy helps with the psychology of that — particularly the beliefs that made overwork feel obligatory, which is where it overlaps with [high-functioning anxiety](/guides/high-functioning-anxiety). It cannot reduce your caseload.",
          "**Depression responds to treatment,** and the evidence base is strong for therapy, medication, or both depending on severity. [Depression counselling](/services/depression-counselling) works on the patterns and the meaning; a physician handles the medical question. The two run perfectly well in parallel.",
          "For people in caregiving and shift-based work — healthcare, first response, social services — the picture is usually both at once, plus a workplace culture that treats the exhaustion as a personal failing. That is covered on the page for [healthcare and shift workers](/for/healthcare-and-shift-workers).",
        ],
      },
    ],
    midCta: {
      text: "If you cannot tell which of these it is, that is a good use of a free 15-minute call rather than a reason to wait.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Can I get a doctor's note for burnout?", a: "A physician can certify you unfit for work based on your symptoms. They will document it in whatever terms are clinically appropriate — burn-out itself is classified as an occupational phenomenon rather than a medical condition, but the exhaustion and its effects are real and documentable." },
      { q: "How long does burnout take to recover from?", a: "It varies widely and depends heavily on whether the conditions change. Recovery that consists of resting and then returning to an unchanged workload tends not to hold." },
      { q: "Is burnout just stress?", a: "No. Stress usually involves over-engagement and urgency. Burnout is closer to the opposite — depletion, disengagement, and blunting. Chronic unmanaged stress is the route to it, but they are different states." },
      { q: "What if I cannot change my job?", a: "That is the common situation. The work then focuses on what is genuinely within your control — boundaries, recovery, the internal rules that make overwork feel non-negotiable — while being honest that this manages the cost rather than removing the cause." },
    ],
    sources: [
      { label: "World Health Organization — burn-out as an occupational phenomenon (ICD-11)", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
      { label: "CMHA BC — workplace mental health", url: "https://cmha.bc.ca/" },
      { label: "HereToHelp BC — depression info sheet", url: "https://www.heretohelp.bc.ca/infosheet/depression" },
    ],
    related: [
      { href: "/services/depression-counselling", label: "Depression counselling across BC" },
      { href: "/guides/high-functioning-anxiety", label: "High-functioning anxiety" },
      { href: "/for/healthcare-and-shift-workers", label: "Counselling for healthcare and shift workers" },
      { href: "/services/anxiety-counselling", label: "Anxiety counselling" },
    ],
  },

  {
    slug: "intergenerational-trauma-explained",
    figure2: "first-session-flow",
    figure: "window-of-tolerance",
    title: "Intergenerational trauma, explained plainly",
    metaTitle: "Intergenerational Trauma Explained | Westpeak Wellness",
    metaDescription:
      "How trauma travels between generations through behaviour, silence, and family rules — and what can be worked with in therapy.",
    eyebrow: "Guide · Trauma",
    lede:
      "You can carry the shape of something that happened before you were born, without ever being told what it was.",
    shortAnswer:
      "Intergenerational trauma describes the transmission of the effects of trauma from one generation to the next — largely through learned behaviour, parenting under stress, family silence, and unspoken rules about what is safe to feel. You do not need to know the original event to be affected by it, and you do not need to know it to work on the pattern.",
    updated: "2026-08-08",
    readMinutes: 7,
    sections: [
      {
        h2: "What actually gets passed down",
        body: [
          "The mechanism is less mysterious than the phrase suggests. Most of it is straightforwardly relational.",
          "A parent who survived war, displacement, poverty, or violence is a parent whose nervous system learned that vigilance keeps people alive. That vigilance does not switch off when conditions improve. It shows up as a household where emotion is dangerous, or achievement is survival, or worry is how love gets expressed. A child raised in that household learns the rules without anyone stating them — and takes them into a life where the original danger is long gone.",
          "**Silence is a major carrier.** In many families the traumatic history is never discussed, only implied. Children are extremely good at detecting that a subject is forbidden and extremely poor at working out why. What often gets absorbed is not the event but the sense that something enormous is unspeakable — and that some part of ordinary curiosity is unsafe.",
          "There is also active research into biological pathways — epigenetic changes affecting stress-response regulation. That literature is genuinely promising and genuinely contested, and it is not necessary to settle it. The behavioural and relational routes on their own account for a great deal of what people experience.",
        ],
      },
      {
        h2: "What it looks like in adulthood",
        list: [
          { label: "Reactions out of proportion to the situation", detail: "A response that fits a much older threat than the one in front of you — and that you can see is disproportionate while it is happening." },
          { label: "Family rules nobody stated", detail: "We do not discuss that. We do not complain. We do not bring outsiders into family matters. We do not fall apart." },
          { label: "Guilt attached to ordinary autonomy", detail: "Choosing your own path feeling like a betrayal rather than a decision — particularly around career, partner, and distance from family." },
          { label: "Difficulty locating your own feelings", detail: "Growing up somewhere emotions were unsafe often means arriving in adulthood without much practice at identifying them, which can read as being \"not an emotional person\"." },
          { label: "Achievement as the price of belonging", detail: "The sense that security within the family is conditional on performance, and that slowing down puts something at risk." },
          { label: "Vigilance in safe conditions", detail: "Scanning for threat, waiting for the other shoe, difficulty relaxing into circumstances that are objectively fine." },
        ],
      },
      {
        h2: "Why it is loaded in immigrant and diaspora families",
        body: [
          "For many South Asian families in BC, the parent generation carried migration, partition histories, financial precarity, or racism in a new country — and metabolised it by working relentlessly and saying little. That was frequently the correct strategy at the time. It is also a strategy with a cost, paid partly by the next generation.",
          "The second-generation position is specific: enough distance to see the pattern, enough loyalty to feel disloyal naming it. Add a cultural frame in which mental health has historically not been discussed, and the phrase *log kya kahenge* — what will people say — and you get people who recognise every word of this and have never said any of it out loud.",
          "Working on this does not require rejecting your family or your culture, and any approach that pushes you toward that has misunderstood the problem. Most people are trying to keep the connection and stop carrying the parts that are not theirs — which is harder, and possible. This is the substance of [South Asian mental health work](/services/south-asian-mental-health) and, where language matters, [counselling in Punjabi](/services/punjabi-counselling).",
        ],
      },
      {
        h2: "What can actually be worked with",
        body: [
          "You cannot undo what happened to your grandparents. What is workable is the inherited response — the rules, the vigilance, the beliefs about what you are allowed to need.",
          "In practice the work usually involves mapping the pattern back to where it came from, which often reduces self-blame considerably; separating what was a reasonable adaptation *then* from what is costing you *now*; and building tolerance for the emotions the family system had no room for. Where the distress carries specific charged memories, [EMDR](/services/emdr-therapy) can be part of it, though complex and intergenerational material needs a slower, more stabilised approach than single-incident trauma.",
          "A note on realism: this work often changes how you relate to your family, and not always toward more closeness. It can mean clearer boundaries, and it can surface grief about what was not available. Worth knowing at the outset rather than discovering halfway through.",
        ],
      },
    ],
    midCta: {
      text: "If this reads like a description of your household, that recognition is usually the hardest part — and a consultation costs nothing.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "Do I need to know what happened to my parents or grandparents?", a: "No. Plenty of people work on this without ever learning the specific history — sometimes because nobody will discuss it, sometimes because the people who knew have died. The pattern in your own life is enough to work with." },
      { q: "Is this the same as complex trauma?", a: "Related but not identical. Complex trauma usually refers to repeated or prolonged trauma in a person's own life. Intergenerational trauma refers to effects transmitted from earlier generations. They frequently occur together." },
      { q: "Does working on this mean blaming my parents?", a: "No, and most people find the opposite happens. Seeing what your parents were carrying tends to increase compassion for them, even while you decline to keep carrying it yourself. Understanding a pattern is not the same as assigning fault for it." },
      { q: "Can I do this work if my family would disapprove of therapy?", a: "Yes, and it is extremely common. Whether, when, and what to tell your family is a decision you get to make — including deciding not to. Confidentiality means that stays yours." },
    ],
    sources: [
      { label: "CMHA BC — trauma and mental health", url: "https://cmha.bc.ca/" },
      { label: "HereToHelp BC — trauma information", url: "https://www.heretohelp.bc.ca/" },
      { label: "CAMH — trauma", url: "https://www.camh.ca/en/health-info/mental-illness-and-addiction-index/trauma" },
    ],
    related: [
      { href: "/services/south-asian-mental-health", label: "South Asian mental health counselling" },
      { href: "/services/punjabi-counselling", label: "Punjabi-speaking counselling" },
      { href: "/for/first-gen-south-asian-adults", label: "For first- and second-gen South Asian adults" },
      { href: "/services/trauma-therapy", label: "Trauma therapy across BC" },
    ],
  },

  {
    slug: "how-to-find-a-therapist-in-bc",
    figure2: "first-session-flow",
    figure: "designations-bc",
    title: "How to actually find a therapist in BC",
    metaTitle: "How to Find a Therapist in BC | Westpeak Wellness",
    metaDescription:
      "Where to look, how to check credentials, what free and low-cost options exist in BC, and what to ask before booking.",
    eyebrow: "Guide · Getting started",
    lede:
      "The search itself is a barrier — dozens of directory profiles that all sound the same, and no obvious way to compare them.",
    shortAnswer:
      "Start by deciding whether you need free, low-cost, or private care, because that determines where to look. Verify anyone you shortlist against their college or association register. Then use free consultations to test fit — the working relationship predicts outcomes more reliably than the specific modality does.",
    updated: "2026-08-08",
    readMinutes: 7,
    sections: [
      {
        h2: "First: free and low-cost options",
        body: [
          "Private therapy is not the only route, and it is not always the right first one. Before paying out of pocket, it is worth knowing what exists:",
          "**Health authority services.** Each BC health authority runs mental-health and substance-use services, free at point of use, accessed by self-referral or through a GP. Wait times vary considerably by region and by urgency.",
          "**[Foundry](https://foundrybc.ca/)** for anyone aged 12–24, offering free counselling both in centres and virtually across BC. **[CMHA BC](https://cmha.bc.ca/)** branches run free and low-cost programs that differ by community. **Post-secondary counselling** is included in student fees if you are enrolled. **Employee assistance programs** through work typically cover a set number of free sessions, and a surprising number of people do not know they have one.",
          "**Training clinics** at universities offer sessions with supervised student clinicians at substantially reduced rates. **[HealthLink BC at 8-1-1](https://www.healthlinkbc.ca/)** is free and staffed 24/7, and can point you toward what exists in your area. A fuller list is on the [low-cost and free counselling page](/resources/low-cost-counselling-bc).",
        ],
      },
      {
        h2: "Where to look for private therapists",
        list: [
          { label: "Directories", detail: "Psychology Today, Counselling BC, and the BCACC register are where most BC practitioners list. Filter by what matters to you — language, modality, virtual availability, fee — rather than reading everything." },
          { label: "The relevant register", detail: "The BCACC register for RCCs, the College of Health and Care Professionals of BC for psychologists, the BC College of Social Workers for social workers. This is also how you verify someone is who they say they are." },
          { label: "Your GP", detail: "Can refer into public services and often knows local private practitioners." },
          { label: "Word of mouth", detail: "Genuinely useful, with one caveat: a therapist who was transformative for a friend may be a poor fit for you. Fit is not transferable." },
        ],
      },
      {
        h2: "How to check someone is legitimate",
        body: [
          "This matters more in BC than most people realise. Counselling therapy is **not currently a government-regulated profession here** — \"counsellor\" and \"therapist\" are not protected titles, so anyone may use them. That changes when psychotherapy regulation begins on 29 November 2027, but until then verification is on you. The detail is in [the comparison of BC therapist types](/compare/rcc-vs-psychologist-vs-social-worker-bc).",
          "Practically: look for a designation with a body behind it — RCC, CCC, R.Psych, RSW/RCSW — and then check the register directly rather than trusting the website. It takes two minutes. What you are confirming is that there is verifiable training, professional liability insurance, continuing education, and somewhere to complain if something goes wrong.",
        ],
      },
      {
        h2: "What to ask on a consultation call",
        body: [
          "Nearly every private practitioner in BC offers a free 15-minute consultation, and it exists so you can assess them. Worth asking:",
        ],
        list: [
          { label: "Have you worked with this before?", detail: "Specific experience with what you are actually bringing, not general competence." },
          { label: "How do you work?", detail: "If the answer is jargon you cannot follow, and they do not translate it when asked, that is information." },
          { label: "What would the first few sessions look like?", detail: "A practitioner should be able to describe a rough shape without promising outcomes." },
          { label: "Fees, cancellation, and receipts", detail: "What they charge, what their cancellation policy is, and what their receipt shows for insurance purposes." },
          { label: "Availability", detail: "Whether they have a spot in the timeslot you can actually attend, and whether they have a waitlist." },
        ],
      },
      {
        h2: "How to judge fit",
        body: [
          "The strongest predictor of whether therapy helps is not the modality — it is the working relationship. Which means your instinct after a first conversation is real evidence, not squeamishness.",
          "Reasonable signals: you felt heard rather than assessed; they were direct without being prescriptive; they were comfortable saying what they do not do. Reasonable warning signs: guarantees of outcomes, pressure to commit to a long package immediately, defensiveness when questioned, or a diagnosis offered by someone who is not qualified to give one.",
          "And it is entirely acceptable to consult with two or three people before choosing. It feels awkward. It is standard, and a good practitioner would far rather you found the right fit than stayed out of politeness. If you want to know what the first real session involves, [that is set out here](/guides/what-to-expect-first-therapy-session)."
        ],
      },
    ],
    midCta: {
      text: "If you are shortlisting, a free 15-minute call is how you test this one — no obligation either way.",
      label: "Book a free consultation",
    },
    faqs: [
      { q: "How much does therapy cost in BC?", a: "Private counselling with an RCC typically runs roughly $120–$180 per session; psychologists are usually considerably more. MSP does not cover private counselling, so the cost is met by an extended health plan or out of pocket. Free and low-cost options do exist across BC and are worth checking first." },
      { q: "Will my extended health cover it?", a: "Many BC plans cover Registered Clinical Counsellors, but not all — some list only psychologists and social workers. Check the actual wording of your plan before booking, since this is the most common source of unpleasant surprises." },
      { q: "How long are the waitlists?", a: "Public services vary widely by health authority and urgency. Private practitioners are often able to start within a week or two, which is a large part of why people pay privately." },
      { q: "What if the first therapist is not right?", a: "Change. It is common, it is not a failure, and most practitioners will help you find someone better suited. Staying with a poor fit out of politeness wastes both money and time." },
    ],
    sources: [
      { label: "BC Association of Clinical Counsellors — find an RCC", url: "https://bcacc.ca/" },
      { label: "Foundry BC — free services for ages 12–24", url: "https://foundrybc.ca/" },
      { label: "HealthLink BC — 8-1-1 health information", url: "https://www.healthlinkbc.ca/" },
      { label: "CMHA BC — programs and services", url: "https://cmha.bc.ca/" },
    ],
    related: [
      { href: "/compare/rcc-vs-psychologist-vs-social-worker-bc", label: "RCC, psychologist, or social worker in BC" },
      { href: "/resources/low-cost-counselling-bc", label: "Free and low-cost counselling in BC" },
      { href: "/guides/what-to-expect-first-therapy-session", label: "What to expect in a first session" },
      { href: "/pricing", label: "Fees and coverage" },
    ],
  },
];

export const guides: Guide[] = [...coreGuides, ...moreGuides, ...moreGuides2, ...moreGuides3, ...moreGuides4, ...moreGuides5, ...moreGuides6];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

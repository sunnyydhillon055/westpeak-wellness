export type Service = {
  slug: string;
  name: string;
  short: string;        // one-line teaser (from services page)
  metaTitle: string;
  metaDescription: string;
  hero: string;         // hero subhead
  intro: string;        // opening paragraph
  helps: string[];      // "this helps with" list
  approach: string;     // how Aman works with it
  featured?: boolean;   // shown on home page
};

export const services: Service[] = [
  {
    slug: "individual-therapy",
    name: "Individual Therapy",
    short: "1:1 for anxiety, depression, life transitions, identity, family dynamics.",
    metaTitle: "Individual Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "One-on-one online counselling across BC for anxiety, depression, life transitions, identity, and family dynamics. Registered Clinical Counsellor. Book a free 15-minute consultation.",
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
  },
  {
    slug: "couples-therapy",
    name: "Couples Therapy",
    short: "Gottman Method — communication, conflict, connection, repair.",
    metaTitle: "Couples Counselling in BC (Online, Gottman Method) | Westpeak Wellness",
    metaDescription:
      "Online couples counselling across BC using the research-based Gottman Method — communication, conflict, connection, and repair. Book a free 15-minute consultation.",
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
      "Aman is trained in the Gottman Method — one of the most researched approaches to couples work. It's practical and skills-based: you'll leave sessions with tools, not just insight, and a clearer map of how the two of you connect and repair.",
    featured: true,
  },
  {
    slug: "emdr-therapy",
    name: "EMDR Therapy",
    short: "Evidence-based for trauma, PTSD, anxiety, grief.",
    metaTitle: "EMDR Therapy in BC (Online) | Trauma & PTSD | Westpeak Wellness",
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
      "Aman is EMDR-trained and works in a paced, trauma-informed way — we build safety and stability first, and never move faster than you're ready for. EMDR translates well to virtual sessions, and many people find the comfort of their own space helps the work.",
    featured: true,
  },
  {
    slug: "trauma-therapy",
    name: "Trauma Therapy",
    short: "Trauma-informed care for single-incident, complex, and intergenerational trauma.",
    metaTitle: "Trauma Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online trauma therapy across BC — trauma-informed care for single-incident, complex, and intergenerational or cultural trauma. Book a free 15-minute consultation.",
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
      "Trauma-informed care is the baseline for everything Aman does — that means safety, choice, and pacing come first. Depending on what fits, the work may draw on EMDR, culturally adapted frames, and grounding skills you can use between sessions.",
  },
  {
    slug: "anxiety-counselling",
    name: "Anxiety Counselling",
    short: "Practical support for GAD, panic, social anxiety, and OCD.",
    metaTitle: "Anxiety Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online anxiety counselling across BC — practical, evidence-based support for generalized anxiety, panic, social anxiety, and OCD. Book a free 15-minute consultation.",
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
  },
  {
    slug: "depression-counselling",
    name: "Depression Counselling",
    short: "For major depression, dysthymia, postpartum, and grief-related low mood.",
    metaTitle: "Depression Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online depression counselling across BC for major depression, persistent low mood, postpartum depression, and grief. Book a free 15-minute consultation.",
    hero: "When everything feels heavy, you don't have to carry it alone.",
    intro:
      "Depression can flatten colour out of things and make small tasks feel enormous. Counselling offers a steady place to be honest about how you're really doing, and to rebuild momentum in a way that's realistic — not toxic positivity. Online across BC.",
    helps: [
      "Major depression and persistent low mood (dysthymia)",
      "Postpartum depression",
      "Grief-related depression",
      "Loss of motivation, meaning, or interest",
      "Depression alongside anxiety or burnout",
    ],
    approach:
      "Aman works collaboratively and without judgment, drawing on CBT and other evidence-based approaches. We'll go at a pace that respects how hard even showing up can be when you're depressed.",
  },
  {
    slug: "punjabi-counselling",
    name: "Punjabi-Speaking Counselling",
    short: "Therapy in Punjabi, English, or both — culturally fluent.",
    metaTitle: "Punjabi-Speaking Counselling in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Online Punjabi-speaking therapy across BC. Counselling in Punjabi, English, or both, with deep cultural competency for the South Asian community. Book a free consultation.",
    hero: "You don't have to translate yourself.",
    intro:
      "Some things only land in your first language. Aman offers therapy in Punjabi, English, or a mix of both — with the cultural fluency to understand family expectations, generational silence, and \"log kya kahenge\" without needing it explained. Online across BC.",
    helps: [
      "Therapy in Punjabi or English (or both in one session)",
      "Family expectations and obligation",
      "Generational silence around mental health",
      "Cultural identity and belonging",
      "Being the first in your family to seek therapy",
    ],
    approach:
      "Aman was born and raised in Surrey and completed a Master's thesis on intergenerational trauma in the South Asian community. The work is culturally grounded from the start — you won't have to justify your context to be understood.",
    featured: true,
  },
  {
    slug: "south-asian-mental-health",
    name: "South Asian Mental Health",
    short: "Family expectations, identity, and intergenerational patterns.",
    metaTitle: "South Asian Therapy & Mental Health in BC (Online) | Westpeak Wellness",
    metaDescription:
      "Culturally grounded online counselling for the South Asian community across BC — family expectations, identity, and intergenerational patterns. Book a free consultation.",
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
      "Aman brings both lived experience and clinical training focused on the South Asian community. Cultural frames are woven in when family or generational context matters — not as an afterthought, but as part of how the work is done.",
  },
  {
    slug: "online-counselling-bc",
    name: "Online Counselling BC",
    short: "Secure virtual sessions anywhere in British Columbia.",
    metaTitle: "Online Counselling in BC | Virtual Therapy | Westpeak Wellness",
    metaDescription:
      "Secure online counselling anywhere in British Columbia. Virtual therapy with a Registered Clinical Counsellor — same standards as in-person. Book a free 15-minute consultation.",
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
      "Virtual sessions follow the same ethical, legal, and privacy standards as in-person therapy. Aman uses a secure, confidential video platform, and many clients find that meeting from their own space actually helps them open up.",
  },
];

export const featuredServices = services.filter((s) => s.featured);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

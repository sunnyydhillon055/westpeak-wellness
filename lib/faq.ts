export type FAQ = { q: string; a: string };

// Answers written to be accurate for a fully-virtual BC RCC practice and
// compliant with BCACC advertising standards.
export const faqs: FAQ[] = [
  {
    q: "How do I pay, and when?",
    a: "Sessions are paid by credit card at the time you book, not at the end of the hour. Cancellation is free up to 24 hours before the appointment; inside that window the session is charged, because the time was held and cannot realistically be filled at that notice. The client portal sets out the whole process, including what happens if something unavoidable comes up.",
  },
  {
    q: "Are you taking new clients?",
    a: "Yes. Westpeak Wellness is currently accepting new clients across British Columbia. The best first step is a free 15-minute consultation, where we can see if we're a good fit before you commit to anything.",
  },
  {
    q: "Is this practice fully online?",
    a: "Yes. Westpeak Wellness is a fully virtual practice serving clients anywhere in British Columbia. Sessions take place over a secure, confidential video platform — all you need is a private space and a stable internet connection. Online sessions follow the same ethical, legal, and privacy standards as in-person therapy.",
  },
  {
    q: "Do you offer sessions in Punjabi?",
    a: "Yes. Sessions are available in Punjabi, English, or a mix of both. Some things land better in your first language, and you won't have to translate your cultural context to be understood.",
  },
  {
    q: "Are you covered by extended health benefits?",
    a: "Most extended health plans in BC that include Registered Clinical Counsellors (RCC) will cover sessions at Westpeak Wellness — commonly Pacific Blue Cross, Manulife, Sun Life, Canada Life, and Green Shield. Coverage amounts and per-session limits vary by plan, so it's worth confirming your specific benefits. Note that BC's public MSP does not cover counselling. Virtual sessions are covered the same as in-person by nearly all plans.",
  },
  {
    q: "What if the fee is more than I can manage?",
    a: "BC has a substantial amount of free and low-cost mental health support that many people do not know about — health authority services, Foundry for anyone under 25, Here2Talk for post-secondary students, employee assistance programs through work, and university training clinics. Those are worth exploring, and it is a reasonable thing to raise on a consultation call.",
  },
  {
    q: "How much do sessions cost?",
    a: "Individual sessions are $140 for 50 minutes, couples are $170 for 50 minutes (or $340 for a 110-minute extended session), and EMDR intensives are $225 for 90 minutes. There is no GST on RCC counselling in BC. Full details are on the Fees page.",
  },
  {
    q: "How long are sessions, and how often will we meet?",
    a: "Sessions are 50 minutes. Most people start weekly or biweekly to build momentum, then space sessions out as things improve. There's no set number of sessions — you're always in control of the pace.",
  },
  {
    q: "Is what I share confidential?",
    a: "Yes. Everything you share is confidential and protected under BCACC's code of ethics and BC privacy law. There are a few legal limits — such as a risk of serious harm to yourself or someone else, or a court order — and your counsellor will explain these clearly at the start of your work together.",
  },
  {
    q: "What happens in the first session?",
    a: "The first session is about your story — what brought you in, what you're hoping for, and what \"better\" would look like. It's also a chance to get comfortable with how your counsellor works. There's no pressure to have everything figured out; that's what the work is for.",
  },
  {
    q: "What if I'm in crisis?",
    a: "Westpeak Wellness is not a crisis service. If you're in distress, call or text 9-8-8 (Canada's suicide crisis line, available 24/7) or the BC Mental Health Support Line at 310-6789. If you're in immediate danger, call 911.",
  },
  {
    q: "How do I get started?",
    a: "Book a free 15-minute consultation. It's a relaxed video call to ask questions, share a bit about what's going on, and see whether working together feels right — no commitment required.",
  },
];

/* Grouping for the FAQ page. Questions and answers are untouched — this only
 * says which heading each one sits under, so a reader can jump rather than
 * scroll a flat list of eleven. */
export const FAQ_GROUPS: { key: string; label: string; icon: 'start' | 'money' | 'sessions' | 'privacy' }[] = [
  { key: 'start',    label: 'Getting started',       icon: 'start' },
  { key: 'money',    label: 'Fees and coverage',     icon: 'money' },
  { key: 'sessions', label: 'How sessions work',     icon: 'sessions' },
  { key: 'privacy',  label: 'Privacy and safety',    icon: 'privacy' },
];

const GROUP_OF: Record<string, string> = {
  "Are you taking new clients?": 'start',
  "Is this practice fully online?": 'start',
  "How do I get started?": 'start',
  "Do you offer sessions in Punjabi?": 'sessions',
  "Are you covered by extended health benefits?": 'money',
  "What if the fee is more than I can manage?": 'money',
  "How much do sessions cost?": 'money',
  "How long are sessions, and how often will we meet?": 'sessions',
  "Is what I share confidential?": 'privacy',
  "What happens in the first session?": 'sessions',
  "What if I'm in crisis?": 'privacy',
};

export const faqsInGroup = (key: string) => faqs.filter((f) => GROUP_OF[f.q] === key);

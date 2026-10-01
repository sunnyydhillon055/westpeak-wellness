import { fallbackFee, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import { practitioners } from '@/lib/practitioners';

export type FAQ = { q: string; a: string };

/* WHERE AND IN WHAT LANGUAGE, FROM THE ROSTER — 1 Oct 2026.
 *
 * The answers below said "across British Columbia" after Camille's reach
 * became Canada-wide, and nothing answered Tagalog or Alberta at all. These
 * sentences are built from lib/practitioners.ts (insurance gate applied), so
 * when someone stops accepting, or a policy lapses and Alberta comes down,
 * the FAQ and its FAQPage schema change with it. The consultation length is
 * read from the Cliniko catalogue fallback, the same source the fee table uses. */
const accepting = practitioners.filter((p) => p.acceptingNewClients);
const firstName = (p: { name: string }) => p.name.split(' ')[0];
const names = (ps: { name: string }[]) =>
  ps.length <= 1 ? ps.map(firstName).join('') : `${ps.slice(0, -1).map(firstName).join(', ')} or ${firstName(ps[ps.length - 1]!)}`;
const linked = (ps: { name: string; slug: string }[]) =>
  ps.length <= 1
    ? ps.map((p) => `[${p.name}](/practitioners/${p.slug})`).join('')
    : `${ps.slice(0, -1).map((p) => `[${p.name}](/practitioners/${p.slug})`).join(', ')} and [${ps[ps.length - 1]!.name}](/practitioners/${ps[ps.length - 1]!.slug})`;
const canadaWide = accepting.filter((p) => p.reach === 'canada');
const alberta = accepting.filter((p) => p.reach !== 'canada' && p.provinces.includes('AB'));
const tagalog = accepting.filter((p) => p.languages.some((l) => l.tag === 'tl'));
const consultMinutes =
  FALLBACK_CATALOG.items.find((i) => i.name.toLowerCase() === 'initial consultation')?.minutes ?? 30;

/** "across British Columbia, and anywhere in Canada with Camille" */
export const whereLine = (): string =>
  canadaWide.length
    ? `across British Columbia, and anywhere in Canada with ${names(canadaWide)}`
    : alberta.length
      ? `across British Columbia, and in Alberta with ${names(alberta)}`
      : 'across British Columbia';

const takingNew = accepting.length
  ? `Yes. Westpeak Wellness is currently accepting new clients ${whereLine()}. The best first step is a free ${consultMinutes}-minute consultation, where we can see if we're a good fit before you commit to anything.`
  : `Not at the moment. Nobody here is taking new clients right now; write through the [contact page](/contact) to hear when that changes.`;

const albertaAndCanada = [
  canadaWide.length || alberta.length
    ? `Yes, with ${linked([...canadaWide, ...alberta])}. ${canadaWide.length ? `${names(canadaWide)} can see clients located anywhere in Canada, Alberta included` : `${names(alberta)} can see clients located in Alberta`}; every other counsellor here sees clients located in British Columbia.`
    : 'Not at the moment. Sessions are for people located in British Columbia.',
  'What counts is where you are during each session, not your permanent address, because a session counts as delivered where the client is sitting. Booking from a counsellor\'s own page opens that counsellor\'s calendar.',
].join(' ');

const tagalogAnswer = tagalog.length
  ? `Yes. ${linked(tagalog)} ${tagalog.length > 1 ? 'work' : 'works'} in Tagalog and English, including moving between the two inside one session, so there is no need to translate your family or your context before you can talk about them. [Tagalog-speaking counselling](/services/tagalog-counselling) explains how it works.`
  : 'Not at the moment. No counsellor taking new clients here works in Tagalog right now. [Finding a counsellor in Punjabi or Tagalog in BC](/resources/finding-a-counsellor-in-punjabi-or-tagalog-in-bc) lists other routes.';

const onlineOrInPerson = `Online only. There is no office and no in-person option: the free ${consultMinutes}-minute consultation and every session after it are by secure video. Once you book, the link arrives by email and opens in your browser, with nothing to install and no account to create. All you need is a private space, a device with a camera, and a stable connection. Sessions are never recorded.`;

// Answers written to be accurate for a fully-virtual BC RCC practice and
// compliant with BCACC advertising standards.
export const faqs: FAQ[] = [
  /* The two questions below use searchers' exact phrasings on purpose:
   * Search Console (2026-08-28 export) shows both ranking on page 1 —
   * positions 8 and 7 — with no page targeting either. */
  {
    q: "Is therapy considered a medical appointment?",
    a: "For most practical purposes in BC, yes. A counselling session is a health-care appointment for sick-leave purposes. The Employment Standards Act's sick days cover attending to your health, and you never owe an employer the detail. For taxes, fees paid to a Registered Clinical Counsellor qualify as a medical expense on the federal return for BC residents. What it is not: an MSP-billed physician visit, which is why payment runs through you or your extended health plan rather than your CareCard.",
  },
  {
    q: "Can a counsellor refer you to a psychiatrist?",
    a: "Not directly, psychiatric referrals in BC route through a physician or nurse practitioner. What a counsellor does in practice: recognises when psychiatric assessment is needed, says so plainly, writes a summary you can hand your doctor ([there is one already written](/refer/doctor)), and with your written consent communicates with them directly. The referral letter carries more weight when the GP can see months of documented counselling behind it, so the counsellor is often the reason the referral happens, just not the signature on it.",
  },
  {
    q: "How do I pay, and when?",
    a: "Sessions are paid by credit card at the time you book, not at the end of the hour. Cancel with at least 24 hours notice and the fee is refunded in full. Inside that window, or for a no-show, 50% of the fee is retained. The time was held and cannot realistically be filled at that notice. The client portal sets out the whole process, including what happens if something unavoidable comes up.",
  },
  {
    q: "Are you taking new clients?",
    a: takingNew,
  },
  {
    q: "Why are there no client reviews on this site?",
    a: "Because soliciting testimonials from counselling clients is prohibited under BCACC advertising standards. Someone inside a therapeutic relationship cannot give uncoerced consent to be used as marketing. What this practice publishes instead, and how to check a counsellor's registration on the public register yourself, is set out in full on the [reviews and references page](/reviews).",
  },
  {
    q: "Is the site usable with a screen reader or keyboard?",
    a: "Yes. It is built to WCAG 2.1 AA and tested for colour contrast, keyboard navigation and touch-target size. The [accessibility page](/accessibility) sets out what has been done and how to report anything that does not work for you. Those reports are welcome and are treated as defects rather than complaints.",
  },
  {
    q: "Is this practice fully online?",
    a: `Yes. Westpeak Wellness is a fully virtual practice, with no office and no in-person sessions, serving clients ${whereLine()}. Sessions take place over a secure, confidential video platform: all you need is a private space and a stable internet connection. Online sessions follow the same ethical, legal, and privacy standards as in-person therapy.`,
  },
  {
    q: "Is the free consultation online or in person, and how do I join?",
    a: onlineOrInPerson,
  },
  {
    q: "Can I book if I live in Alberta or elsewhere in Canada?",
    a: albertaAndCanada,
  },
  {
    q: "Do you offer sessions in Tagalog?",
    a: tagalogAnswer,
  },
  {
    q: "Do you offer sessions in Punjabi?",
    a: "Yes. Sessions are available in Punjabi, English, or a mix of both. Some things land better in your first language, and you won't have to translate your cultural context to be understood.",
  },
  {
    q: "Are you covered by extended health benefits?",
    a: "It depends on your plan, not the insurer. Many BC extended health plans include Registered Clinical Counsellors (RCC), and the insurers behind them include Pacific Blue Cross, Manulife, Sun Life, Canada Life and Green Shield. If your plan lists RCCs, sessions here qualify: every session comes with a receipt showing the counsellor's RCC designation to claim with. Amounts and per-session limits vary, so check your benefits booklet or ask the insurer. BC's public MSP does not cover private counselling. Plans that cover RCCs generally treat video sessions the same as in-person ones.",
  },
  {
    q: "What if the fee is more than I can manage?",
    a: "BC has a substantial amount of free and low-cost mental health support that many people do not know about: health authority services, Foundry for anyone under 25, Here2Talk for post-secondary students, employee assistance programs through work, and university training clinics. Those are worth exploring, and it is a reasonable thing to raise on a consultation call.",
  },
  {
    q: "How much do sessions cost?",
    a: `Individual sessions are ${fallbackFee('Individual Counselling')} for 50 minutes, couples are ${fallbackFee('Couples Counselling')} for 50 minutes (or ${fallbackFee('Couples Extended')} for a 110-minute extended session), and EMDR intensives are ${fallbackFee('EMDR Intensive')} for 90 minutes. There is no GST on RCC counselling in BC. Full details are on the Fees page.`,
  },
  {
    q: "How long are sessions, and how often will we meet?",
    a: "Sessions are 50 minutes. Most people start weekly or biweekly to build momentum, then space sessions out as things improve. There's no set number of sessions, you're always in control of the pace.",
  },
  {
    q: "Is what I share confidential?",
    a: "Yes. Everything you share is confidential and protected under BCACC's code of ethics and BC privacy law. There are a few legal limits, such as a risk of serious harm to yourself or someone else, or a court order, and your counsellor will explain these clearly at the start of your work together.",
  },
  {
    q: "What happens in the first session?",
    a: "The first session is about your story: what brought you in, what you're hoping for, and what \"better\" would look like. It's also a chance to get comfortable with how your counsellor works. There's no pressure to have everything figured out; that's what the work is for.",
  },
  {
    q: "What if I'm in crisis?",
    a: "Westpeak Wellness is not a crisis service. If you're in distress, call or text 9-8-8 (Canada's suicide crisis line, available 24/7) or the BC Mental Health Support Line at 310-6789. If you're in immediate danger, call 911.",
  },
  {
    q: "How do I get started?",
    a: "Book a free 30-minute consultation. It's a relaxed video call to ask questions, share a bit about what's going on, and see whether working together feels right, no commitment required.",
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
  "Do you offer sessions in Tagalog?": 'sessions',
  "Is the free consultation online or in person, and how do I join?": 'start',
  "Can I book if I live in Alberta or elsewhere in Canada?": 'start',
  "Are you covered by extended health benefits?": 'money',
  "What if the fee is more than I can manage?": 'money',
  "How much do sessions cost?": 'money',
  "How long are sessions, and how often will we meet?": 'sessions',
  "Is what I share confidential?": 'privacy',
  "What happens in the first session?": 'sessions',
  "What if I'm in crisis?": 'privacy',
  /* Without an entry here a question renders nowhere — faqsInGroup filters on
     this map, so an unmapped question is silently dropped from the page while
     still appearing in the FAQPage schema. That mismatch is worse than a
     missing answer: the markup would describe content the visitor cannot see. */
  "Are you hiring counsellors?": 'start',
  /* These three were unmapped and therefore invisible: they appeared in the
     FAQPage schema on /faq and in no group on the page itself, which is the
     exact mismatch the note above warns about. Found 2026-08-30 while adding
     an in-body link to one of them and noticing the link never rendered.
     Google's structured-data policy asks that FAQ markup describe content
     visible on the page, so this was not merely three missing answers - it
     was three answers the markup claimed a reader could see and could not,
     one of them the question about how and when to pay. */
  "Is therapy considered a medical appointment?": 'money',
  "Can a counsellor refer you to a psychiatrist?": 'sessions',
  "How do I pay, and when?": 'money',
  "Why are there no client reviews on this site?": 'privacy',
  "Is the site usable with a screen reader or keyboard?": 'privacy',
};

export const faqsInGroup = (key: string) => faqs.filter((f) => GROUP_OF[f.q] === key);

/* THE COMMENT ABOVE WAS TRUE AND UNENFORCED.
 *
 * GROUP_OF has carried a warning about unmapped questions since it was
 * written, and three questions were unmapped anyway - which is what a comment
 * alone is worth against a list two people edit. A question added to `faqs`
 * without a group still renders in the FAQPage schema, so the failure is
 * silent in exactly the place a person would look to check.
 *
 * Evaluated at module load, so an unmapped question fails `npm run build`
 * with the question in the message rather than shipping. Nothing here is
 * dynamic; if it throws, it throws on the first build after the mistake. */
const UNGROUPED = faqs.filter((f) => !GROUP_OF[f.q]).map((f) => f.q);
if (UNGROUPED.length) {
  throw new Error(
    `lib/faq.ts: ${UNGROUPED.length} question(s) have no entry in GROUP_OF, so they ` +
    `would appear in the FAQPage schema and render nowhere on /faq, ` +
    UNGROUPED.map((q) => `"${q}"`).join('; ')
  );
}

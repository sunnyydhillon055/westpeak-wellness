import type { DepthSection } from './depth';

/* Third-pass sections: the newest guides, and the trust pages. */
export const depth3: Record<string, DepthSection[]> = {
  /* EMDR in a first language. Tracked query "punjabi emdr therapy bc",
   * ceiling 930, and it was the last open Tier-1 intersection.
   *
   * This is not the language argument the rest of the site makes. Elsewhere the
   * case for working in Punjabi is about comfort, nuance and not spending the
   * first ten minutes explaining a family structure. In EMDR it is mechanical:
   * the protocol runs on a negative cognition stated in the first person, and
   * that sentence is language-encoded along with the memory it came from. A
   * cognition translated on the way in is a different sentence being processed.
   *
   * Which is why this sits on the EMDR page rather than only on the Punjabi
   * one — someone searching for EMDR in Punjabi is asking a clinical question,
   * not a comfort one, and deserves the clinical answer. */
  'services/emdr-therapy': [
    {
      h2: 'EMDR in a first language, and why it is not a preference',
      body: [
        'On most of this site the argument for working in Punjabi is about comfort and precision — not having to translate a family argument, or explain what *log kya kahenge* means before describing how it felt. Real, but a matter of degree.',
        'In EMDR it is structural. The protocol is built around a **negative cognition**: a short sentence in the first person that the memory still seems to prove — "I am not safe", "it was my fault", "I am not enough". You rate how true it feels, hold it alongside the memory during bilateral stimulation, and work toward a positive cognition that begins to feel true instead. That sentence is the instrument.',
        'A memory laid down in Punjabi carries its cognition in Punjabi. Translated into English on the way into the session, it becomes a near-equivalent — usually flatter, sometimes carrying a slightly different accusation, occasionally missing the register entirely. English has no single word doing the work of *sharam*, and "shame" and "disgrace" each capture part of it and imply different things about who else is affected. Processing the translation is processing something adjacent to what happened.',
        'The rating scales have the same problem. Asking how disturbing something feels from nought to ten, in a language the event did not occur in, invites a considered answer rather than an immediate one — and the immediate one is what the protocol needs.',
        'What this looks like in practice is unremarkable: the cognition stays in whichever language it arrived in, the instructions and the scales are usually in English because those are administrative, and nobody stops to tidy up the switching. Sessions frequently run bilingually within a single sentence, which is how a lot of people think anyway.',
        'None of this makes EMDR in English wrong for a Punjabi speaker. Plenty of people process in their second language perfectly well, particularly for events that happened in it. It matters most where the memory is old, from childhood, from before migration, or from inside a family — which is a large share of what people bring.',
        'The edges set out above apply unchanged: stabilisation first, caution with dissociation, and it is not the right tool for a difficulty with no traumatic memory attached. Working in Punjabi does not shorten the preparation phase, and a counsellor offering to skip it is not being accommodating.',
      ],
    },
  ],

  'guides/intrusive-thoughts-and-what-they-mean': [
    {
      h2: 'Why the theme is usually the thing you care most about',
      body: [
        'One of the more revealing features of intrusive thoughts is how reliably their content tracks a person\'s values. This is not a coincidence and it is useful to understand.',
        'A devoted new parent gets thoughts about harm coming to their baby. Someone whose faith matters gets blasphemous content in a place of worship. A person who would never hurt anyone gets violent images. Someone whose sexuality is a settled part of who they are gets thoughts that contradict it.',
        'The pattern is consistent: **the mind produces intrusions on the subject you would find most unbearable.** That is what makes them alarming and, once seen, what makes them interpretable. A thought is disturbing in proportion to how much it violates what you actually care about — which means the distress is a measurement of your values rather than a warning about your intentions.',
        'This also explains why reassurance from other people rarely settles anything. Being told you would never do it addresses the wrong question. The person is not usually seeking evidence about their behaviour; they are trying to resolve an unresolvable question about what having the thought means. Which is exactly why the treatment targets the relationship to the thought rather than the answer to the question.',
        'It is worth noticing, too, that people almost never report intrusive thoughts about things they are indifferent to. The absence is as informative as the presence.',
      ],
    },
  ],

  'guides/social-anxiety-in-adults': [
    {
      h2: 'At work, specifically',
      list: [
        { label: 'Meetings', detail: 'The fear is usually not of speaking but of the pause before speaking, and of visibly deciding whether to. A useful first target is contributing once, early, on something low-stakes — because the dread compounds across a meeting in which you have said nothing.' },
        { label: 'The unstructured parts', detail: 'Before a meeting starts, the lift, the kitchen. Frequently harder than the meeting itself because there is no role to occupy. These are worth targeting deliberately rather than engineering around.' },
        { label: 'Video calls', detail: 'A mixed picture. Self-view amplifies the self-focused attention that maintains social anxiety — turning it off is a useful intervention. Cameras off entirely is a safety behaviour that will make the return harder.' },
        { label: 'Asking for something', detail: 'A raise, a deadline extension, help. Frequently avoided entirely and quietly expensive over a career. Worth working on directly rather than treating as a separate confidence issue.' },
        { label: 'Being watched working', detail: 'Someone standing behind you, a review, a shared screen. Performance genuinely degrades under observation for most people; social anxiety adds an interpretation of that as exposure.' },
        { label: 'Social events attached to work', detail: 'The obligation to attend combined with no defined role. Declining every one is noticed over time, which adds a second, career-shaped cost to the avoidance.' },
      ],
    },
  ],

  'guides/loneliness-in-adulthood': [
    {
      h2: 'Loneliness inside a relationship',
      body: [
        'A large share of the loneliness people bring to counselling is not the absence of other people. It is loneliness inside a marriage, a family or a full social calendar, and it is considerably harder to name than the ordinary kind.',
        'The reason is that it appears ungrateful and inexplicable. There is somebody there. The relationship may be affectionate, functional, long. Saying you feel alone inside it sounds like a complaint about a person rather than a description of an experience.',
        'What is usually happening is a gap between contact and being known. Two people can share a household, logistics and years of history while the actual content of their inner lives has not been exchanged for a long time. It is drift rather than rupture, and drift produces no incident to point at.',
        'It also has a specific pattern: the more times a subject has not been raised, the harder it becomes to raise, because raising it now requires explaining why it was not raised for four years. That accumulating cost is why it so often surfaces only in a crisis.',
        'The workable move is rarely a summit conversation about the state of the relationship. It is smaller and more repeatable — restoring a regular window in which something other than logistics is discussed, and saying one true thing in it. [Counselling for couples](/for/couples) covers the joint version, and individual work is a legitimate route when only one of you is ready.',
      ],
    },
  ],

  'guides/health-anxiety': [
    {
      h2: 'How to talk to your doctor about it',
      body: [
        'The relationship with medical care is frequently the most damaged part of this, in both directions, and a small amount of directness repairs a surprising amount.',
        '**Name the pattern explicitly.** "I think I have health anxiety, and I would like help distinguishing when I actually need to come in" changes the entire register of a consultation. It moves you from someone presenting symptoms to someone collaborating on a problem, and most clinicians respond well to it.',
        '**Ask for an agreed monitoring plan.** What is worth coming in for, what is not, and how often. A written, agreed threshold is enormously useful, because it replaces an unanswerable question in the moment with a decision already made in a calmer one.',
        '**Ask for one thorough assessment rather than repeated partial ones.** Serial reassurance-seeking is what maintains the loop; a single comprehensive baseline is what makes reducing it possible.',
        '**Say plainly that you are working on it.** A clinician who knows this is happening is far less likely to reassure reflexively — which is kind, brief and counterproductive — and more likely to hold the agreed plan with you.',
        'And the caveat that always belongs here: this does not mean stopping medical care or ignoring new symptoms. It means agreeing in advance what warrants attention, so that vigilance has a boundary rather than being either total or abandoned.',
      ],
    },
  ],

  'guides/life-transitions-and-identity': [
    {
      h2: 'What actually helps during the in-between',
      list: [
        { label: 'Rebuild the smallest structures first', detail: 'A fixed wake time, one recurring commitment, one place you go weekly. Identity gets rebuilt out of repetition, not out of insight, and the repetition has to exist before anything else does.' },
        { label: 'Do things before you feel like them', detail: 'The new version of yourself is discovered by doing rather than deciding. Waiting to feel ready produces a long wait, because readiness is downstream of activity rather than upstream.' },
        { label: 'Keep one thread from before', detail: 'A skill, a relationship, a routine that survives the change. Continuity makes a transition survivable in a way total reinvention does not.' },
        { label: 'Name the losses out loud, once', detail: 'To somebody. Unspoken losses in a supposedly positive transition are the ones that persist longest, because there has been no occasion on which they were allowed to be losses.' },
        { label: 'Expect friendships to reshuffle', detail: 'Relationships built on a shared context frequently do not survive its ending. That is a further loss rather than evidence they were not real.' },
        { label: 'Set a review date rather than a deadline', detail: 'A date to look at how it is going, not a date by which you must have adjusted. Deadlines for adjustment produce a second failure on top of the first.' },
      ],
    },
  ],

  'guides/money-stress-and-mental-health': [
    {
      h2: 'Talking about money in a relationship',
      body: [
        'Financial strain rarely stays financial. It becomes an argument about values, about competence, and about who is responsible — and the actual numbers frequently never get discussed at all.',
        'A few things reliably help. **Separate the accounting from the argument.** Establishing what is true — the balances, the obligations, the actual monthly shortfall — is a task, and it goes considerably better as a scheduled hour with a spreadsheet than as a fight at eleven at night.',
        '**Notice which of you is avoiding and which is monitoring.** This is the most common configuration: one partner cannot look, the other cannot stop looking. Both are anxiety responses to the same situation, and each reads the other as the problem. Naming it as a shared response rather than a character difference removes a great deal of heat.',
        '**Distinguish the past from the plan.** How the situation arose and what to do now are separate conversations, and merging them guarantees neither is completed. Most couples need to have the first one eventually; almost none need to have it first.',
        '**Agree what each of you actually fears.** Frequently it is not the same thing — one fears destitution, the other fears being judged, a third fears the loss of independence. The fights make far more sense once those are on the table.',
        'And where money pressure is genuinely structural rather than behavioural, the useful conversation is about how to survive it together rather than how to solve it, which is a different and more honest goal.',
      ],
    },
  ],

  'policy/standards': [
    {
      h2: 'What to do if you are unsure whether something crossed a line',
      body: [
        'Most concerns about a counsellor are not dramatic. They are a persistent unease that something is slightly off, and people generally talk themselves out of it because they cannot name a rule that was broken.',
        'A few things are worth knowing as reference points. **A counsellor should not be a significant part of your life outside the room** — social contact, business dealings, or a friendship developing alongside the work all compromise it, and the responsibility for maintaining that boundary is entirely theirs rather than yours.',
        '**Self-disclosure should be occasional and in your service.** A counsellor mentioning something relevant is normal. A pattern of you attending to their difficulties is not, and it is one of the more common quiet boundary failures.',
        '**Sessions should start and end when they are supposed to,** and repeated lateness or cancellation without notice is a professional issue rather than an inevitability.',
        '**Any sexual contact or romantic relationship with a client is prohibited,** without exception, and remains prohibited after the work ends.',
        '**Fees should be agreed in advance and should not change without notice.**',
        'If something on that list is happening, or if something not on it is bothering you persistently, the first step is to raise it directly. If you cannot — or if raising it goes badly — the BC Association of Clinical Counsellors administers a complaints process independent of any individual counsellor, and you do not need that counsellor\'s knowledge or agreement to use it.',
      ],
    },
  ],

  'policy/editorial-policy': [
    {
      h2: 'How to read any health website critically',
      body: [
        'This applies to this site as much as to anywhere else, and it is worth having a checklist that does not depend on trusting the author.',
        '**Is there a date?** Coverage rules, wait times, regulation and clinical guidance all change. A page with no date is asking you to assume it is current.',
        '**Are the claims sourced, and does the source say what the page says it says?** Following one or two links is the fastest way to test a site\'s reliability. Pages that cite a study which does not support the claim attached to it are more common than people expect.',
        '**Does it distinguish averages from individuals?** "Research finds X on average across studies" and "X will happen to you" are different claims, and blurring them is the most common failure in health writing.',
        '**Does it state any trade-offs?** A page describing a treatment with no downsides, no limits and no situations where it is unsuitable is advertising.',
        '**Does it say what it does not know?** Honest health content contains sentences like "the mechanism is not settled" and "the evidence is mixed", because that is the actual state of a great deal of the field.',
        '**Who benefits from you believing it?** Not disqualifying — this site is written by a practice that would like you to book — but it is a reason to weight the sourced claims more heavily than the framing.',
        'Applying that list to this site is encouraged rather than resented. Content that cannot survive being checked should not be relied on.',
      ],
    },
  ],

  'policy/privacy': [
    {
      h2: 'Practical privacy on your own side',
      body: [
        'Most of what is written about privacy in counselling concerns the practitioner\'s obligations. Rather less is said about the parts you control, which matter just as much in a virtual practice.',
        '**Where you take the session.** A door that closes is the single largest factor. Headphones are the second, because they remove the counsellor\'s voice from the room entirely.',
        '**Your device.** A shared or work-issued computer is worth thinking about. Employers can generally monitor activity on equipment they own, and a session taken on a work laptop is not private in the way a personal device is.',
        '**Your email.** Email is convenient and it is not a secure channel. There is no need to put clinical or personal detail in writing to arrange something, and it is better not to.',
        '**Insurance claims.** Submitting a claim tells your insurer that a session occurred, with which type of practitioner, and on what date. It does not tell them what was discussed. If you are on a family plan, the plan holder may be able to see that a claim was made — which is worth knowing in advance if it matters.',
        '**Browser history and notifications.** Small things, and they are the ones people mention afterwards. Notifications during a session, or a shared browser, are worth two minutes of thought beforehand.',
        'None of this is a reason for concern about the practice\'s handling of your information, which is set out above. It is the half of the picture that is within your control and that nobody usually mentions.',
      ],
    },
  ],

  'policy/accessibility': [
    {
      h2: 'How this site is tested, and by what standard',
      body: [
        'Specificity is what separates an accessibility statement from a disclaimer, so here is what has actually been done.',
        'The site is built to the principles of **WCAG 2.1 Level AA**. It has not been formally audited by a third party, and so it does not claim compliance — a claim of compliance without an audit is one this practice cannot support.',
        'What has been tested: keyboard-only navigation through every page and interactive element, with a visible focus indicator that is never removed for appearance. Heading structure verified programmatically across the whole site for a single H1 per page and no skipped levels. Alt text present on every image, verified across all pages rather than spot-checked. Colour contrast checked against the AA thresholds for body and secondary text. Layout verified at 375 pixels with no horizontal page scrolling. And the `prefers-reduced-motion` setting is honoured, on a site that has no autoplaying media to disable in the first place.',
        'What has not been done: testing with every combination of screen reader and browser, testing with users with disabilities, and any formal certification. Those are real gaps rather than oversights, and naming them is more useful than an assurance.',
        'The site is also deliberately static, with no third-party scripts and pages under 60 KB. That matters for cognitive load and for anyone on a slow or metered connection, which in much of British Columbia is a genuine accessibility question rather than a performance one.',
      ],
    },
  ],
};

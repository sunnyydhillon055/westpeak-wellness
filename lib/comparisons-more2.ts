import type { Comparison } from './comparisons';

/* The second expansion of the compare set — five decisions people actually
 * face, written 2026-08-28.
 *
 * Same rules as the first file: every claim checkable, no outcome promises,
 * and the "how we fit" section is obliged to say when the answer is somewhere
 * else — including a whole page whose honest conclusion is that this practice
 * does not offer one of the two options being compared. */
export const moreComparisons2: Comparison[] = [
  {
    slug: 'emdr-intensive-vs-weekly-emdr',
    figure2: 'window-of-tolerance',
    figure: 'emdr-phases',
    title: 'EMDR intensives vs weekly EMDR: which format fits?',
    metaTitle: 'EMDR Intensives vs Weekly EMDR | Westpeak Wellness',
    metaDescription:
      'Same therapy, two schedules. What an EMDR intensive actually is, when concentrated sessions make sense, and when weekly pacing is the safer choice.',
    eyebrow: 'Comparison · EMDR',
    lede:
      'The therapy is identical. The calendar is not, and for EMDR specifically, the calendar changes more than convenience.',
    shortAnswer:
      'Weekly EMDR spreads the eight phases across regular 50-minute sessions, with the reprocessing itself often occupying a fraction of each one. An intensive books a longer block: here, 90 minutes, so that preparation, processing and closing happen inside a single arc instead of being cut to fit the hour. Intensives suit people with a specific target memory, stable day-to-day footing, and a schedule that makes weekly attendance hard. Weekly pacing remains the better choice when stabilisation is still the main work, which is common with complex or long-standing trauma.',
    updated: '2026-08-31',
    readMinutes: 6,
    table: {
      columns: ['', 'Weekly EMDR (50 min)', 'EMDR intensive (90 min)'],
      rows: [
        ['Session shape', 'Check-in, brief processing window, closing, inside one hour', 'One extended arc: settle, process, close, without the clock cutting the middle out'],
        ['Best suited to', 'Complex or long-standing trauma, ongoing support, building stability', 'A specific target memory or incident, with stability already in place'],
        ['Pace of the work', 'Gradual; the nervous system gets a week between sessions', 'Concentrated; more ground in one sitting, more tired afterwards'],
        ['Scheduling', 'Same time weekly or biweekly', 'Easier to fit around shift work, camp rotations, or travel'],
        ['Cost per sitting', 'Lower per session', 'Higher per sitting; see the fees page for current rates'],
        ['Insurance', 'Reimbursed like any RCC session, plan permitting', 'Also reimbursed as counselling, but a longer session may exhaust a per-session cap; check the wording'],
      ],
    },
    sections: [
      {
        h2: 'Why session length matters more in EMDR than in talk therapy',
        body: [
          'Most talk therapy tolerates the 50-minute container well: a conversation can pause and resume a week later without much cost. EMDR reprocessing is different. The work has a shape: accessing the memory, processing it in sets, and closing down properly so you leave regulated, and that shape does not compress well.',
          'In a standard session, the processing window in the middle can be short. Ten of the fifty minutes go to arriving and checking in; the last ten are reserved for closing down, because ending a session mid-activation is not an acceptable outcome. What remains is real but brief, and a memory network that takes twenty minutes just to access may barely be touched before it is time to seal it back up.',
          'The intensive format exists to fix exactly that arithmetic. A 90-minute block does not just add forty minutes. It more than doubles the usable processing window, because the fixed costs of settling in and closing down are paid once rather than proportionally.',
        ],
      },
      {
        h2: 'When weekly pacing is genuinely the better choice',
        list: [
          { label: 'Stabilisation is still the main work', detail: 'With complex trauma, the early phases: resourcing, grounding, building tolerance for the material: are the treatment, not a preliminary. Those phases benefit from time between sessions, not from concentration.' },
          { label: 'Life is currently unstable', detail: 'A crisis at home, an unsafe situation, heavy substance use, or a nervous system already running at its ceiling are all reasons to go slower, whatever the calendar preference.' },
          { label: 'You do not yet know what the target is', detail: 'Some people arrive with one clear incident. Others arrive with a fog that takes weeks of ordinary sessions to resolve into targets. Booking an intensive before the target is clear buys concentrated time with nothing to aim it at.' },
          { label: 'The week between sessions is doing work', detail: 'Processing continues between sessions: dreams, memories surfacing, small shifts. Weekly pacing gives that consolidation room, and for some people it is where most of the change actually shows up.' },
        ],
      },
      {
        h2: 'What an intensive is not',
        body: [
          'It is not faster therapy in the sense the phrase suggests. A single extended session can cover ground that would take several weekly ones, but the total course of treatment is set by what your history requires, not by the format. Nobody can promise that concentrating the schedule concentrates the result, and a practitioner who does promise that is worth being wary of.',
          'It is also not a way to skip preparation. The assessment and history-taking phases happen regardless of format, usually in an ordinary session beforehand. An intensive booked as a first-ever appointment would spend most of its length on the groundwork an intensive exists to move past, which is why the free consultation and an initial session come first here.',
        ],
      },
    ],
    howWeFit: [
      'Westpeak Wellness offers both formats: standard 50-minute sessions in which EMDR is one of the approaches used, and a dedicated 90-minute EMDR intensive. Current pricing for each is on the [fees page](/pricing), kept in sync with the booking system.',
      'Which format fits is a clinical question before it is a scheduling one, and it is exactly the kind of question a [free 15-minute consultation](/book) settles quickly, including honestly, when the answer is that weekly pacing or stabilisation-first work is the right starting point.',
    ],
    midCta: {
      text: 'Unsure whether your situation suits concentrated work? That is a clinical question with a quick answer, ask it on a free 15-minute call.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is an EMDR intensive safe?', a: 'Run properly, yes. The format keeps the same safeguards as weekly EMDR, including preparation beforehand and full closing-down time inside the session. Suitability is assessed first, and people still building stability are steered to weekly pacing rather than booked into a longer block.' },
      { q: 'How tired will I be afterwards?', a: 'Often noticeably. Processing is effortful, and a longer session means more of it. It is sensible not to schedule anything demanding immediately after an intensive, and to expect the days following to carry some continued settling, dreams and surfacing memories are common and expected.' },
      { q: 'Does insurance cover a 90-minute session?', a: 'Extended health plans that reimburse RCC counselling generally reimburse it regardless of session length, but some plans cap the amount per session. A longer session with a higher fee can exceed a per-session cap even with annual room left, so check that specific wording before booking.' },
      { q: 'Can I start with an intensive as my first appointment?', a: 'Not here. History-taking, preparation and a suitability check come first, in an ordinary session. An intensive works because the groundwork is already done, done inside the intensive, it stops being one.' },
      { q: 'Does EMDR over video work in the longer format?', a: 'Yes. The same adaptations used in weekly virtual EMDR. An on-screen target, alternating audio, or self-administered tapping, carry over, and the longer arc is if anything easier to hold without a commute on either side of it.' },
    ],
    sources: [
      { label: 'EMDR International Association, about EMDR therapy', url: 'https://www.emdria.org/about-emdr-therapy/' },
      { label: 'NICE, Post-traumatic stress disorder guideline (NG116)', url: 'https://www.nice.org.uk/guidance/ng116' },
    ],
    related: [
      { href: '/services/emdr-therapy', label: 'The EMDR intensive, booking and structure' },
      { href: '/services/emdr-therapy', label: 'EMDR therapy across BC' },
      { href: '/guides/what-is-emdr-and-how-a-session-works', label: 'What is EMDR and how a session works' },
      { href: '/compare/cbt-vs-emdr-for-trauma', label: 'CBT vs EMDR for trauma' },
      { href: '/services/individual-therapy', label: 'Trauma therapy' },
      { href: '/pricing', label: 'Fees & insurance' },
    ],
  },

  {
    slug: 'gottman-method-vs-eft-for-couples',
    figure2: 'four-decisions',
    figure: 'gottman-method',
    title: 'Gottman Method vs EFT: two roads into couples therapy',
    metaTitle: 'Gottman Method vs EFT for Couples | Westpeak Wellness',
    metaDescription:
      'The two best-researched couples approaches differ in where they start: observable patterns or underlying attachment. What each looks like in the room.',
    eyebrow: 'Comparison · Couples',
    lede:
      'Both are serious, structured, well-researched approaches to the same problem. They just walk into it through different doors.',
    shortAnswer:
      'The Gottman Method starts from the outside in: a structured assessment of how the two of you actually interact, then specific interventions aimed at the patterns: criticism, defensiveness, contempt, stonewalling. That its research links to relationships failing. Emotionally Focused Therapy (EFT) starts from the inside out: it treats the argument as the surface of an attachment question ("are you there for me?") and works on the emotional cycle underneath before the behaviour. Many couples would be helped by either; the honest differentiators are what you want to work on first and which style of session you can imagine yourselves in.',
    updated: '2026-08-30',
    readMinutes: 6,
    table: {
      columns: ['', 'Gottman Method', 'Emotionally Focused Therapy (EFT)'],
      rows: [
        ['Root of the approach', 'Decades of observational research on what distinguishes couples that last', 'Attachment theory, adult relationships as bonds, distress as protest at disconnection'],
        ['Starting move', 'Structured assessment: joint and individual sessions, questionnaires, history', 'Mapping the negative cycle the couple is caught in, pursue/withdraw is the classic'],
        ['Session feel', 'Concrete and skills-forward: exercises, frameworks, things to practise between sessions', 'Emotion-forward: slowing conversations down to reach what is underneath the anger'],
        ['Works on', 'Conflict management, friendship and fondness, shared meaning', 'The bond itself: safety, reaching for each other, responding'],
        ['Typical structure', 'Assessment phase, then targeted interventions against agreed goals', 'Three stages: de-escalation, restructuring the bond, consolidation'],
        ['Practitioner signal', 'Gottman training levels; the method is manualised and specific', 'ICEEFT training and supervision; also manualised and specific'],
      ],
    },
    sections: [
      {
        h2: 'The same fight, read two ways',
        body: [
          'Take the most ordinary couples-therapy scene there is: one partner raises something, the other goes quiet, the first pushes harder, the second shuts down completely. Both approaches take this seriously. They read it differently.',
          'A Gottman-informed reading names the observable moves. The raise arrived as criticism. A complaint about character rather than behaviour. The silence is stonewalling, which the research treats as physiological flooding rather than indifference: a heart rate too high to stay in the conversation. The work is concrete: soften how the issue is raised, learn to notice flooding and take structured breaks, repair earlier and more often.',
          'An EFT reading asks what the moves are protecting. The pursuit is not nagging, it is protest, *I cannot reach you and it frightens me.* The withdrawal is not indifference, it is self-protection, *nothing I say helps, so I stop making it worse.* The work is to slow the cycle down until both people can say the frightened thing directly, because the cycle loses its grip when the protest underneath it is finally heard.',
          'Neither reading is wrong. The practical question is which door you two can actually walk through, some couples find the skills-first route disarming and the emotion-first route exposing; others find exercises hollow until the underlying disconnection is addressed.',
        ],
      },
      {
        h2: 'How to choose, honestly',
        list: [
          { label: 'You want structure and tools you can use this week', detail: 'The Gottman Method is unusually generous with concrete practice: frameworks for raising issues, repair phrases, rituals of connection. If one of you is sceptical of therapy, visible structure often helps.' },
          { label: 'The problem feels like distance rather than conflict', detail: 'Couples who rarely fight but have quietly stopped reaching for each other often describe EFT’s attachment frame as naming something they could not. Conflict-heavy couples may need de-escalation first, which both approaches provide differently.' },
          { label: 'One of you shuts down under emotional intensity', detail: 'This cuts both ways. EFT works directly with that shutdown, but gently and at depth; Gottman work manages it behaviourally with flooding protocols. Raise it in a consultation and listen to how the practitioner would handle it.' },
          { label: 'The practitioner matters more than the banner', detail: 'Across couples therapy generally, the alliance both partners feel with the therapist is a better predictor than modality. A well-trained practitioner of either approach beats a poor fit in your preferred one.' },
        ],
      },
      {
        h2: 'What they share',
        body: [
          'More than the comparison format suggests. Both reject the referee model of couples therapy. Nobody is adjudicating who was right about the dishwasher. Both treat the *pattern* as the client rather than either partner. Both are structured enough that you should be able to ask "where are we in the process?" at any point and get a real answer. And both have published research traditions behind them, which in couples therapy is not something to take for granted.',
          'Both also share a limit worth stating: where there is ongoing violence, active addiction, or an undisclosed affair, couples work of any modality is usually the wrong first step, and a practitioner of either school should say so rather than proceed.',
        ],
      },
    ],
    howWeFit: [
      'Couples work at Westpeak Wellness draws on the Gottman Method. The practice is Gottman-trained, and the [couples therapy page](/services/couples-therapy) describes what that looks like session by session. The assessment-first structure and the concrete between-session work are genuine features of how couples work runs here.',
      'If you have read this far and it is specifically EFT you want, the right move is an ICEEFT-trained therapist, and their directory is the place to find one. That is not this practice, and pretending otherwise would be a poor way to start a therapeutic relationship. If you are undecided, a [free consultation](/book) with both partners on the call is a reasonable way to hear how the Gottman-informed version would approach your situation.',
    ],
    midCta: {
      text: 'Deciding between approaches is easier with a concrete case, yours. A free 15-minute call with both of you is how that conversation starts.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Which has better evidence?', a: 'Both have real research traditions, EFT has strong outcome-study support, and the Gottman Method rests on an unusually large observational base about which patterns predict relationship breakdown, with intervention research alongside. For choosing between them, the honest answer is that both clear the bar, and fit with the practitioner is the better differentiator.' },
      { q: 'Can the two be combined?', a: 'Elements travel, many couples therapists use Gottman-style assessment or psychoeducation alongside attachment-informed work. Purists on both sides prefer fidelity to one model, and there is a fair argument that a coherent single frame beats an eclectic mix. Ask any practitioner what their base is.' },
      { q: 'Does either work over video?', a: 'Yes. Couples sessions here run by secure video with both partners on screen, and the structured formats of both approaches adapt well to it. The main practical requirement is a private space where you can both speak freely, the same requirement as in-person, honestly.' },
      { q: 'What if my partner refuses to come?', a: 'Individual work on a relationship is legitimate and common. You work on your own side of the pattern, which is the only side you control anyway. The individual vs couples comparison covers when each makes sense.' },
      { q: 'How long does couples therapy take?', a: 'Both approaches typically describe a course in months rather than weeks, commonly somewhere between eight and twenty-something sessions depending on where you start and what you are working toward. Anyone quoting a fixed number before meeting you is guessing.' },
    ],
    sources: [
      { label: 'The Gottman Institute, the Gottman Method', url: 'https://www.gottman.com/about/the-gottman-method/' },
      { label: 'ICEEFT, International Centre for Excellence in Emotionally Focused Therapy', url: 'https://iceeft.com/' },
    ],
    related: [
      { href: '/services/couples-therapy', label: 'Couples therapy across BC' },
      { href: '/guides/how-the-gottman-method-works', label: 'How the Gottman Method works' },
      { href: '/guides/does-couples-therapy-work', label: 'Does couples therapy work?' },
      { href: '/compare/individual-vs-couples-therapy', label: 'Individual vs couples therapy' },
      { href: '/tools/which-service', label: 'Which kind of counselling fits?' },
    ],
  },

  {
    slug: 'therapy-apps-ai-vs-counselling',
    figure2: 'confidentiality-limits',
    /* accountability-chain, added 2026-08-30. This page's load-bearing claim is
       that no app is accountable to a regulator, bound by a code of ethics, or
       responsible for you in a crisis — and the site already had a diagram of
       exactly that chain, drawn for /standards. The page was one of the last
       three carrying no in-body image; it did not need a new one. */
    figure: 'accountability-chain',
    title: 'Mental-health apps and AI chatbots vs counselling',
    metaTitle: 'Therapy Apps & AI vs Counselling | Westpeak Wellness',
    metaDescription:
      'What apps and AI chatbots genuinely do well, where they stop, and how to combine them with therapy, written by a practice that is not afraid of them.',
    eyebrow: 'Comparison · Getting support',
    lede:
      'Millions of people now type their 2 a.m. worries into an app or a chatbot before they would ever email a counsellor. That deserves a straight comparison, not a defensive one.',
    shortAnswer:
      'Apps and AI chatbots are genuinely good at some things: always available, free or cheap, useful for skills practice, mood tracking, psychoeducation, and rehearsing a hard conversation nobody is judging. What they are not is therapy. No app is accountable to a regulator, bound by a clinical code of ethics, able to read what you are not saying, or responsible for you in a crisis, and a system built to be agreeable cannot do the useful disagreeing a good therapist does. The strongest position is not either/or: use the tools for what they are good at, and a human for what they cannot do.',
    updated: '2026-08-30',
    readMinutes: 7,
    table: {
      columns: ['', 'Apps & AI chatbots', 'Counselling with a registered professional'],
      rows: [
        ['Availability', 'Always, instantly, at 2 a.m.', 'Scheduled sessions; replies within business hours'],
        ['Cost', 'Free to low subscription', 'Session fees; often partly reimbursed by extended health plans'],
        ['Accountability', 'None, no regulator, no complaints process, terms of service only', 'Registration, a code of ethics, insurance, and a public register you can check'],
        ['Privacy', 'Set by the company; data practices vary widely and can change', 'Bound by law and professional standards; limits of confidentiality stated up front'],
        ['Crisis response', 'Cannot assess or take responsibility; at best displays a hotline', 'Trained to assess risk and act on it, with a duty of care'],
        ['Challenge', 'Tuned to be agreeable; rarely pushes back usefully', 'Fit includes being usefully disagreed with, pattern-naming is much of the job'],
        ['Best use', 'Skills practice, tracking, psychoeducation, between-session support', 'The work itself: a relationship with someone responsible for your care'],
      ],
    },
    sections: [
      {
        h2: 'What the tools genuinely do well',
        body: [
          'A counselling practice writing this page has an obvious interest, so let the concessions come first, and let them be real.',
          'The access argument is strong. An app costs nothing or nearly nothing, requires no referral, no benefits plan, no waitlist, and no explaining yourself to a stranger. For someone on a months-long list for public services. A common situation in BC. A well-built app is not a poor substitute for nothing; it is meaningfully better than nothing.',
          'The practice argument is also strong. Skills that counselling teaches: breathing techniques, thought records, grounding, sleep routines, need repetition between sessions, and an app that prompts and tracks that repetition is doing real work. Some people also find it easier to first articulate something to a machine that cannot flinch, and arrive at therapy having already found words.',
          'And the rehearsal argument is underrated. Typing out the conversation you need to have with your mother, your partner, or your boss, and having something respond, can genuinely help you find your position before the real conversation happens.',
        ],
      },
      {
        h2: 'Where the floor gives way',
        list: [
          { label: 'Nobody is responsible for you', detail: 'A registered counsellor operates under a code of ethics, carries insurance, can be complained about, and can lose their registration. An app’s obligations to you are its terms of service. When something goes wrong, that difference is the whole difference.' },
          { label: 'Agreeableness is a design goal', detail: 'Systems built for engagement are tuned to be validating, and validation is not always what helps. Much of therapy’s value is a person who notices your patterns and, carefully, at the right moment, declines to go along with them.' },
          { label: 'Crisis is the hard failure', detail: 'A chatbot cannot assess risk, cannot call anyone, and cannot sit with you while you are in danger. If you are in crisis, the tools to use are made of people: 9-8-8 by call or text anywhere in Canada, or BC’s crisis line at 310-6789.' },
          { label: 'Your words become data', detail: 'What you type into a commercial app is governed by a privacy policy that can change, in a company that can be sold. Some tools are careful; many are not; few make it easy to tell which you are holding. The MIND app-evaluation database exists precisely because this is hard.' },
          { label: 'The relationship is the mechanism', detail: 'Decades of research keep finding that the working alliance. A real relationship with a real person, is among the better predictors of therapy helping. It is the one ingredient no simulation can supply, because being simulated is the problem.' },
        ],
      },
      {
        h2: 'Using both, sensibly',
        body: [
          'The framing of app *versus* counsellor mostly dissolves on contact with how people actually get better. A reasonable stack looks like: an app for daily tracking and skills repetition, a chatbot for 2 a.m. articulation and rehearsal, and a counsellor for the work itself, with the app’s mood data and the chatbot-drafted letter both welcome in session.',
          'Two honest tests for any tool: does it make your world larger or smaller, and does it move you toward the humans in your life or substitute for them? A sleep tracker that gets you to bed is passing both tests. A companion you talk to instead of anyone else is failing the second one, comfortably and by design.',
        ],
      },
    ],
    howWeFit: [
      'Westpeak Wellness is a virtual practice, so nobody here is going to argue that support through a screen cannot be real. The position is narrower: the screen is fine, the absence of an accountable human on the other side of it is the problem. Clients who arrive with app histories, tracked data, or a chatbot conversation that finally made something click are arriving well-prepared, not cheating.',
      'If cost is what has you in an app instead of counselling, two pages here may change the arithmetic: [what extended health plans cover](/resources/bc-extended-health-coverage-for-counselling), and the [genuinely low-cost options in BC](/resources/low-cost-counselling-bc), including ones that are not this practice.',
    ],
    midCta: {
      text: 'If an app got you as far as reading this, the next step costs fifteen minutes and nothing else, a free consultation with a person.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Are AI therapy chatbots safe to use?', a: 'For low-stakes uses: psychoeducation, journaling prompts, rehearsing conversations, generally yes, with sensible privacy caution about what you share. They are not safe as a sole support for serious depression, trauma, or any situation involving risk, because no one behind them is responsible for you and crisis handling is beyond them.' },
      { q: 'Can I bring what I told a chatbot into therapy?', a: 'Yes, and it is often useful. People sometimes find their clearest articulation of a problem at 2 a.m. in a chat window. Bringing that text to a session gives the work a running start, and no counsellor worth seeing will be precious about where the words were first found.' },
      { q: 'Do any apps actually have evidence behind them?', a: 'Some do, particularly structured CBT-based programs, several of which have trial support. The market also contains a great deal with none. The MIND database from the Division of Digital Psychiatry evaluates apps on privacy and evidence and is a better guide than an app-store ranking.' },
      { q: 'Is talking to an AI at night a bad sign?', a: 'No, reaching for support is the healthy instinct in that picture. The only caution is direction: if the tool is a bridge toward sleep, skills, or eventually a human conversation, it is helping. If it has quietly become the only place you say true things, that is worth noticing.' },
      { q: 'Will a counsellor judge me for having used these?', a: 'Not here, and not anywhere good. A third of the people reading this page likely tried an app first; it is simply how help-seeking works now. What matters is what you need next, not the order you tried things in.' },
    ],
    sources: [
      { label: 'MIND, app evaluation database, Division of Digital Psychiatry', url: 'https://mindapps.org/' },
      { label: 'American Psychological Association, artificial intelligence topic hub', url: 'https://www.apa.org/topics/artificial-intelligence-machine-learning' },
    ],
    related: [
      { href: '/guides/signs-it-might-be-time-for-therapy', label: 'Signs it might be time for therapy' },
      { href: '/guides/waiting-for-therapy-in-bc', label: 'Waiting for therapy in BC' },
      { href: '/resources/low-cost-counselling-bc', label: 'Low-cost counselling in BC' },
      { href: '/guides/is-online-therapy-as-effective-as-in-person', label: 'Is online therapy as effective as in-person?' },
      { href: '/compare/therapy-vs-coaching', label: 'Therapy vs coaching' },
    ],
  },

  {
    slug: 'therapy-in-punjabi-vs-english',
    figure2: 'first-session-flow',
    figure: 'language-in-therapy',
    title: 'Therapy in Punjabi or in English: does the language matter?',
    metaTitle: 'Therapy in Punjabi vs English | Westpeak Wellness',
    metaDescription:
      'For bilingual Punjabi speakers, which language therapy happens in changes what can be said. When each fits, and why switching mid-session is allowed.',
    eyebrow: 'Comparison · ਪੰਜਾਬੀ · Punjabi counselling',
    lede:
      'If you grew up between two languages, you already know they do not hold the same things. Therapy is where that stops being an abstract observation.',
    shortAnswer:
      'For many bilingual people, feelings and family live in the first language and work and analysis live in the second. Therapy in Punjabi can reach childhood memory, family relationships and emotion with words that were actually there when those things happened, including the words that have no English equivalent. Therapy in English can offer useful distance from exactly the same material, which is sometimes what makes it speakable at all. Neither is the correct choice in general; the good news is that this is not a decision you have to get right in advance, because a bilingual counsellor lets the session move between the two.',
    updated: '2026-08-31',
    readMinutes: 6,
    table: {
      columns: ['', 'Sessions in Punjabi', 'Sessions in English'],
      rows: [
        ['Emotional register', 'The language much of the feeling originally happened in, often closer, sometimes overwhelming', 'A step of distance, sometimes flattening, sometimes exactly the space needed to speak'],
        ['Family material', 'Relationships, obligations and phrases can be discussed in their own words, untranslated', 'Constant translation, and some of what matters most translates badly'],
        ['Untranslatables', 'ਸ਼ਰਮ, ਇੱਜ਼ਤ, ਫ਼ਰਜ਼, carried whole, with their real weight', 'Rendered as "shame", "honour", "duty", related words that are not the same words'],
        ['Availability in BC', 'Genuinely limited, and concentrated in the Lower Mainland; virtual widens it', 'Wide'],
        ['Privacy within community', 'A smaller circle of practitioners; worth asking any practice how it handles this', 'Larger pool, easier anonymity'],
        ['Mixing', 'Fully available with a bilingual counsellor. Most bilingual sessions are mixed in practice', 'Only if the counsellor can follow where the Punjabi goes'],
      ],
    },
    sections: [
      {
        h2: 'Why the language of a session is not a logistics question',
        body: [
          'A common experience among bilingual adults: you can describe your childhood fluently in English and only *feel* it in Punjabi. This is not mysterious. Memory and emotion keep the language they were encoded in, and a feeling reached through its original words often arrives with more of itself attached.',
          'The reverse is equally real and equally useful. Some things are hard to say precisely because the first language holds them too close. The word carries the whole weight of home, and the English equivalent is the only version light enough to lift. People who switch to English at the hardest moment of a story are usually not avoiding the work; they are regulating, and a counsellor who understands both languages can notice the switch itself as information.',
          'This is why the comparison in the table dissolves, in practice, into a third option: a session that moves. A sentence that starts in English and lands on the one Punjabi word that is actually true. An account of a conversation with a parent given in the words the parent used. That movement is not a compromise between the two columns. It is the version with the most information in it, and it is only possible when the counsellor does not need the Punjabi translated.',
        ],
      },
      {
        h2: 'The considerations that actually decide it',
        list: [
          { label: 'Where the material lives', detail: 'Work stress, workplace conflict and burnout often live comfortably in English. Family, marriage, childhood and grief usually have deep roots in the first language. Many people want different languages for different sessions, which is allowed.' },
          { label: 'Whose voice you need to quote', detail: 'Therapy about family involves reporting what people said. If your mother speaks in Punjabi, an English-only session makes you the translator of your own evidence, and something reliably goes missing in that translation.' },
          { label: 'Community and privacy', detail: 'The set of Punjabi-speaking counsellors in BC is small, and some people hesitate to bring family material to someone who might stand two degrees from that family. It is a legitimate concern; a virtual practice serving the whole province widens the distance, and it is a fair question to ask any practice directly.' },
          { label: 'What is actually available where you live', detail: 'Punjabi-speaking counsellors with offices cluster in Surrey, Abbotsford and Vancouver. For most of the rest of BC, virtual sessions are not one option among several. They are how therapy in Punjabi exists at all.' },
        ],
      },
      {
        h2: 'If Punjabi is your parents’ language more than yours',
        body: [
          'A large group sits between the columns: people who understand Punjabi completely, speak it at family gatherings, and would struggle to conduct an hour of therapy in it. If that is you, nothing on this page is a test to pass. English-led sessions with the freedom to drop into Punjabi where the Punjabi is load-bearing. A phrase of your father’s, a word that has no equivalent, the thing your grandmother always said, tend to fit exactly this experience.',
          'It is also worth saying that therapy about intergenerational and cultural material does not require a counsellor from the same background, but it goes noticeably faster when the concepts do not need a glossary. ਇੱਜ਼ਤ explained is a paragraph; ਇੱਜ਼ਤ understood is one word.',
        ],
      },
    ],
    howWeFit: [
      'Westpeak Wellness runs sessions in English, in Punjabi, or moving between the two as the material requires. The counsellor is bilingual, so nothing you say in either language needs translating. The [Punjabi counselling page](/services/punjabi-counselling) covers the service in English, and [ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ](/punjabi) is available in Gurmukhi.',
      'The practice is virtual and serves all of BC, which matters most exactly where Punjabi-speaking counsellors are scarcest, outside the Lower Mainland. And the smaller-community privacy concern is taken seriously here: confidentiality and its limits are set out plainly on the [privacy page](/privacy), and it is a welcome question on a consultation call.',
    ],
    midCta: {
      text: 'The consultation itself can be in either language, which is, conveniently, a fifteen-minute answer to most of this page.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Do I have to choose one language before starting?', a: 'No. Most bilingual sessions are mixed in practice, and the mix is allowed to change week to week and moment to moment. Choosing in advance is exactly the kind of pressure a session should not add.' },
      { q: 'My Punjabi is conversational, not fluent. Is Punjabi-inclusive therapy still useful?', a: 'Yes. This is one of the most common situations. Sessions run primarily in English and switch when a Punjabi word or phrase is the accurate one. Understanding matters more than production; you never need to perform fluency.' },
      { q: 'Can therapy help with family expectations without blaming my family?', a: 'That is precisely the aim. Naming the weight of expectation and loving the people applying it are compatible positions, and counselling that treats your parents as the problem to be escaped usually misunderstands what you are carrying. Boundaries can be built with, not only against.' },
      { q: 'Is a counsellor from the same community a privacy risk?', a: 'The concern deserves a real answer rather than reassurance: confidentiality is a professional obligation with legal limits, it applies identically regardless of community, and its limits are stated before you share anything. A virtual practice also widens the practical distance. Ask about it directly on a consultation, how the question is answered tells you a lot.' },
      { q: 'What about my parents’ generation, do you see older Punjabi-speaking adults?', a: 'Punjabi-language sessions are open to adults of any age, and for the generation that built its life in Punjabi, therapy in English was often the real barrier. A video call does require someone comfortable joining one, or a family member who can help set it up privately.' },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors', url: 'https://bcacc.ca' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/services/punjabi-counselling', label: 'Punjabi counselling across BC' },
      { href: '/punjabi', label: 'ਪੰਜਾਬੀ ਵਿੱਚ, in Punjabi' },
      { href: '/services/punjabi-counselling', label: 'South Asian mental health' },
      { href: '/guides/talking-to-your-family-about-therapy', label: 'Talking to your family about therapy' },
      { href: '/guides/setting-boundaries-with-family', label: 'Setting boundaries with family' },
    ],
  },

  {
    slug: 'psychiatrist-vs-counsellor-bc',
    figure2: 'designations-bc',
    figure: 'bc-support-routes',
    title: 'Psychiatrist or counsellor: which door first, in BC?',
    metaTitle: 'Psychiatrist vs Counsellor in BC | Westpeak Wellness',
    metaDescription:
      'One is a physician reached by referral and covered by MSP; one you can book this week. What each actually does, and how the two roads combine.',
    eyebrow: 'Comparison · Getting started',
    lede:
      'People use the words almost interchangeably, then discover the two are reached by entirely different roads, one through your doctor and a wait, one directly.',
    shortAnswer:
      'A psychiatrist is a medical doctor: reached by physician referral, covered by MSP, able to diagnose and prescribe, and, in much of BC’s system, focused on assessment and medication for more complex conditions rather than ongoing weekly talk therapy. A counsellor is booked directly, paid privately or through extended health, cannot prescribe or diagnose, and provides the ongoing therapy itself. For many people the honest answer is not either but both, on different timelines: counselling can start this week, while a psychiatric assessment, where needed, works through the referral system.',
    updated: '2026-08-30',
    readMinutes: 6,
    table: {
      columns: ['', 'Psychiatrist', 'Registered Clinical Counsellor'],
      rows: [
        ['What they are', 'A physician (MD) with specialty training in psychiatry', 'A master’s-level therapist registered with BCACC'],
        ['How you reach one in BC', 'Referral from a family doctor or nurse practitioner', 'Directly, book a consultation this week'],
        ['Cost', 'MSP-covered', 'Private fee; commonly reimbursable under extended health plans'],
        ['Waiting', 'Often long, and varies widely by region and urgency', 'Days to weeks in private practice'],
        ['Can diagnose', 'Yes', 'No'],
        ['Can prescribe', 'Yes', 'No'],
        ['Typical role', 'Assessment, diagnosis, medication decisions, complex or higher-risk conditions', 'Ongoing talk therapy, the weekly work itself'],
        ['Ongoing psychotherapy', 'Some provide it; many consult and hand ongoing care back to the GP', 'The core of the job'],
      ],
    },
    sections: [
      {
        h2: 'The mistake this page exists to prevent',
        body: [
          'It is common to decide "what I have is serious, so I should see a psychiatrist," ask for the referral, and then wait, with nothing else in place, for an appointment that may be months away and may turn out to be a single assessment rather than the beginning of ongoing care. The wait is survivable; the *nothing else in place* is the problem.',
          'The two roles are not senior and junior versions of the same job. A psychiatrist’s scarce time in BC’s public system is concentrated where medical training is essential: diagnostic questions, medication, and complex or higher-risk presentations. Ongoing weekly psychotherapy is, for the most part, simply not what the public psychiatric system is resourced to provide. Expecting the referral to produce a weekly therapist is the single most common misunderstanding in the whole landscape.',
          'Which means the sequencing usually runs the other way round: therapy. The thing you can start now, begins while any referral makes its way through the system, and the two inform each other when the assessment arrives.',
        ],
      },
      {
        h2: 'Signs the psychiatric road matters for you',
        list: [
          { label: 'The diagnostic question is load-bearing', detail: 'Benefits claims, workplace or academic accommodations, and treatment decisions that depend on what this actually is, bipolar disorder vs recurrent depression being the classic example, need someone who can formally diagnose.' },
          { label: 'Medication is on the table', detail: 'Starting, changing, or stopping psychiatric medication is physician work. For many common situations a family doctor handles it; a psychiatrist takes the harder cases. A counsellor can and should coordinate, with your consent, but never prescribes.' },
          { label: 'What is happening includes psychosis, mania, or serious risk', detail: 'These are medical presentations first. If safety is immediate, that is not a referral queue, call or text 9-8-8, or BC’s crisis line at 310-6789.' },
          { label: 'Treatment so far has not held', detail: 'Several fair trials of therapy and first-line medication without traction is exactly what psychiatric consultation is for, a deeper look at the diagnosis and the plan.' },
        ],
      },
      {
        h2: 'How the two roads combine in practice',
        body: [
          'The combination is the normal case, not the exception: a family doctor or psychiatrist holds the medical side, a counsellor holds the weekly work, and, with your written consent, the two communicate rather than running parallel accounts of your care. The existing page on [therapy, medication or both](/compare/therapy-medication-or-both) covers that treatment question in detail; this page is about the people rather than the treatments.',
          'One honest caveat from the counselling side: a counsellor who notices that your situation needs medical assessment should say so plainly and help the referral happen, not absorb months of sessions into a problem that needed a physician. That is what "scope of practice" means when it is working, and how a practice responds to the question "when would you send someone to a doctor?" is a good consultation-call test of any counsellor, this one included.',
        ],
      },
    ],
    howWeFit: [
      'Westpeak Wellness sits entirely on the counselling side of this table: a Registered Clinical Counsellor practice providing the ongoing therapy, bookable directly, with no referral needed. Nothing here replaces a psychiatrist where one is needed, and the [psychiatry and assessment resource](/resources/psychiatry-and-assessment-in-bc) explains the referral road in detail. It was written for exactly the person this page describes.',
      'Where both roads are in play, the practical offer is this: therapy can begin now rather than after the wait, and with your consent the work coordinates with your doctor rather than around them.',
    ],
    midCta: {
      text: 'Unsure which door your situation needs? That is a fair question for a free 15-minute call, including when the honest answer is a doctor first.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Do I need a referral to see a counsellor in BC?', a: 'No. Counselling in private practice is booked directly. Some extended health plans, however, require a doctor’s note before they will reimburse sessions. That is a plan rule rather than a legal one, so check your wording.' },
      { q: 'Is a psychiatrist free in BC?', a: 'Psychiatrist visits are covered by MSP when reached through referral. What MSP does not cover is private counselling, which is why the two roads are paid for so differently, and why extended health benefits matter on the counselling side.' },
      { q: 'How long is the wait to see a psychiatrist in BC?', a: 'It varies too much by region, urgency and pathway for a single honest number, urgent presentations move much faster than routine referrals, and rural waits differ from urban ones. Your referring doctor will have a realistic estimate for your situation; ask them directly.' },
      { q: 'Can a counsellor tell me whether I have depression?', a: 'A counsellor can assess, describe and work with what you are experiencing, but cannot issue a formal diagnosis: in BC that sits with physicians, psychiatrists, psychologists, and clinical social workers with the relevant registration. If a formal diagnosis matters for your situation, that is a signal about which road to include.' },
      { q: 'What about a psychologist, where do they fit?', a: 'A third road: doctoral-level, able to diagnose and to run formal assessments (ADHD and psychoeducational testing being the common ones), privately paid, no prescribing. The three-way comparison with counsellors and social workers has its own page.' },
    ],
    sources: [
      { label: 'CAMH, mental illness and addiction index', url: 'https://www.camh.ca/en/health-info/mental-illness-and-addiction-index' },
      { label: 'Canadian Psychiatric Association', url: 'https://www.cpa-apc.org/' },
    ],
    related: [
      { href: '/resources/psychiatry-and-assessment-in-bc', label: 'Psychiatry and assessment in BC' },
      { href: '/compare/therapy-medication-or-both', label: 'Therapy, medication, or both' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/guides/how-to-find-a-therapist-in-bc', label: 'How to find a therapist in BC' },
      { href: '/resources/msp-vs-extended-health', label: 'MSP vs extended health' },
    ],
  },

  /* Round 2, item 51 (2026-08-28): completes the who-do-I-see trilogy. The
   * other two pages cover counsellor-vs-psychologist-vs-RSW and
   * psychiatrist-vs-counsellor; this one takes the pairing people conflate
   * most — the two "psych" titles — and stays off the ground the others own. */
  {
    slug: 'psychologist-vs-psychiatrist-bc',
    figure2: 'therapy-cost-in-bc',
    figure: 'designations-bc',
    title: 'Psychologist vs psychiatrist in BC: the two “psychs”, untangled',
    metaTitle: 'Psychologist vs Psychiatrist in BC | Westpeak',
    metaDescription:
      'One is a physician reached by referral and covered by MSP; one is a doctoral clinician you book privately. Who does what in BC, and who to see first.',
    eyebrow: 'Comparison · Choosing a professional',
    lede:
      'Two titles that share four letters and almost nothing else about how you reach them, what they cost, and what happens in the room.',
    shortAnswer:
      'A psychiatrist is a medical doctor: reached by physician referral, covered by MSP, able to prescribe, and focused in BC’s system on diagnosis, medication and complex conditions. A psychologist holds a doctorate in psychology: booked privately (or via extended health), unable to prescribe, and the one profession that performs formal psychological assessments: ADHD, learning disabilities, cognitive testing. The practical sorting question is not "which is more serious" but which door your situation needs: medication and medical diagnosis point to psychiatry; assessment on paper points to a psychologist; ongoing talk therapy is done by both far less often than people assume. That is mostly counsellors’ and psychologists’ territory, at very different price points.',
    updated: '2026-08-28',
    readMinutes: 6,
    table: {
      columns: ['', 'Psychiatrist', 'Registered Psychologist'],
      rows: [
        ['What they are', 'A physician (MD) with specialty training in psychiatry', 'A doctoral-level clinician (PhD/PsyD) registered with the College of Health and Care Professionals of BC'],
        ['How you reach one', 'Referral from a doctor or nurse practitioner', 'Directly. No referral needed (some insurers ask for a doctor’s note)'],
        ['Cost in BC', 'MSP-covered', 'Private fee, commonly ~$225–$300+/session; extended health often reimburses'],
        ['Prescribes medication', 'Yes', 'No'],
        ['Formal assessments (ADHD, psychoeducational, cognitive)', 'Diagnoses clinically; formal psychometric testing is not the usual role', 'Yes. This is the thing only psychologists do'],
        ['Ongoing weekly psychotherapy', 'Uncommon in the BC public system; many consult and hand care back to the GP', 'Some offer it; many focus on assessment. Ask directly'],
        ['Typical wait', 'Often long via referral, varies by urgency and region', 'Weeks in many private practices; assessment waitlists can be longer'],
      ],
    },
    sections: [
      {
        h2: 'The conflation, and why it costs people months',
        body: [
          'The two titles get used interchangeably in conversation, and the cost of the mix-up is concrete: someone needing an ADHD assessment waits months for a psychiatric referral that ends in a fifteen-minute medication consult, or someone needing medication review books a psychologist who cannot write a prescription. Same four letters, different systems, different doors.',
          'The clean division: **psychiatry is medicine**: diagnosis, medication, the complex and higher-risk end of mental health, reached through the referral system and paid by MSP. **Psychology is assessment and doctoral-level therapy**: formal testing that produces documentation (for accommodations, benefits, diagnosis-dependent decisions), plus psychotherapy from some practitioners, reached directly and paid privately.',
          'Neither is the "more advanced counsellor". They are different professions solving different problems, and for the most common situation of all: wanting ongoing weekly talk therapy for anxiety, depression, or a relationship. The honest answer is frequently *neither*: that work is largely done by counsellors and those psychologists who practice therapy, and the [three-way comparison](/compare/rcc-vs-psychologist-vs-social-worker-bc) covers that choice, including cost.',
        ],
      },
      {
        h2: 'Which door, by situation',
        list: [
          { label: 'Medication is the question', detail: 'Psychiatry’s territory, though in BC the family doctor handles the common cases, and the psychiatric referral is for the harder ones. Start with your GP either way; that is how the system routes.' },
          { label: 'You need an assessment on paper', detail: 'ADHD, learning disability, cognitive or psychoeducational testing for school, work or benefits: a registered psychologist, privately, with a written report at the end. Budget for the assessment cost and the waitlist.' },
          { label: 'Something serious is unfolding', detail: 'Psychosis, mania, severe depression with risk: medical first, GP urgently, or emergency services. If safety is immediate: 9-8-8 by call or text.' },
          { label: 'You want ongoing weekly therapy', detail: 'Counsellors and therapy-practising psychologists do this work; psychiatrists in BC mostly do not. The price difference between an RCC and a psychologist for the same weekly hour is substantial, and the fit question matters more than the title.' },
          { label: 'You are not sure', detail: 'A GP visit sorts the medical question in one appointment, and a free counselling consultation sorts the therapy question in fifteen minutes. Neither commits you to anything, and the two roads run in parallel without conflict.' },
        ],
      },
    ],
    howWeFit: [
      'Westpeak Wellness is neither of these professions, and this page exists because the practice keeps meeting people who spent months in the wrong queue. What this practice is: a Registered Clinical Counsellor doing the ongoing therapy work, bookable this week, that neither psychiatry’s waitlist nor a psychologist’s assessment calendar is built for.',
      'Where the medical or assessment door is yours, the [psychiatry and assessment resource](/resources/psychiatry-and-assessment-in-bc) maps the referral road honestly, and therapy here can start now and coordinate with whichever specialist arrives later, with your written consent.',
    ],
    midCta: {
      text: 'Fifteen free minutes sorts which of the three doors: psychiatry, psychology, counselling. Your situation actually needs. Including when the answer is not this one.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Is a psychologist a doctor?', a: 'A doctoral-level clinician, yes, PhD or PsyD, but not a medical doctor. Psychologists in BC diagnose and perform formal assessments; they do not prescribe. "Doctor" on a psychologist’s door refers to the doctorate, and the profession is regulated under the College of Health and Care Professionals of BC.' },
      { q: 'Do I need a referral to see a psychologist in BC?', a: 'No, psychologists are booked directly. Some extended-health plans require a physician’s recommendation before they will reimburse sessions, which is a plan rule rather than a legal one. Psychiatrists are the referral-only profession.' },
      { q: 'Who can diagnose ADHD in BC?', a: 'Physicians (including psychiatrists) diagnose clinically, and registered psychologists diagnose through formal psychoeducational assessment. The version that produces the documented report schools, universities and some workplaces require. Counsellors cannot diagnose it, and will say so.' },
      { q: 'Why is the psychiatrist free and the psychologist expensive?', a: 'Because psychiatry is physician care inside MSP, and psychology is a private-pay profession outside it. The trade is the classic one: the MSP road is free and gated by referral and waiting; the private road is fast and costs money, some of which extended health returns.' },
      { q: 'Which one does talk therapy?', a: 'Fewer of each than people expect. BC psychiatrists mostly assess, prescribe and consult; some psychologists offer psychotherapy and many concentrate on assessment. The bulk of ongoing talk therapy in the province is delivered by counsellors, which is a statement about how the system is arranged, not about who is qualified for what.' },
    ],
    sources: [
      { label: 'CAMH, mental illness and addiction index', url: 'https://www.camh.ca/en/health-info/mental-illness-and-addiction-index' },
      { label: 'Canadian Psychiatric Association', url: 'https://www.cpa-apc.org/' },
      { label: 'College of Health and Care Professionals of BC', url: 'https://chcpbc.org/' },
    ],
    related: [
      { href: '/compare/psychiatrist-vs-counsellor-bc', label: 'Psychiatrist vs counsellor' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/resources/psychiatry-and-assessment-in-bc', label: 'Psychiatry and assessment in BC' },
      { href: '/compare/therapy-medication-or-both', label: 'Therapy, medication, or both' },
      { href: '/resources/what-is-a-registered-clinical-counsellor', label: 'What is an RCC?' },
    ],
  },
];

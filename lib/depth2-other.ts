import type { DepthSection } from './depth';

/* Second-pass sections for services, comparisons, resources, audiences and locations. */
export const depth2Other: Record<string, DepthSection[]> = {
  /* ---------------- services ---------------- */
  'services/individual-therapy': [
    {
      h2: 'How to get more out of the hour',
      list: [
        { label: 'Arrive with the week, not a report', detail: 'The most useful opening is frequently the thing that happened on Tuesday that you have not stopped thinking about — not a tidy summary. Tidiness is a form of editing, and the edited version is usually less useful than the messy one.' },
        { label: 'Say the thing you almost did not say', detail: 'Most sessions contain one. It is nearly always the most productive sixty seconds available, and deferring it week after week is the single most common way therapy stalls.' },
        { label: 'Disagree out loud', detail: 'If an interpretation does not fit, saying so is not rudeness — it is the correction that makes the next one accurate. A counsellor who cannot be contradicted is not much use.' },
        { label: 'Note things during the week', detail: 'The material worth bringing arrives on Wednesday and is gone by Friday. Three lines on a phone is enough.' },
        { label: 'Do the between-session thing badly', detail: 'A failed attempt is better material than no attempt. Reporting that you did not manage it, and what got in the way, is genuinely more useful than a clean success.' },
        { label: 'Say when something is not working', detail: 'Early rather than at month five. It changes the plan instead of ending the work.' },
      ],
    },
  ],

  'services/couples-therapy': [
    {
      h2: 'What happens if you decide to separate',
      body: [
        'Some couples work concludes that the relationship is ending, and treating that as the failure case is both inaccurate and unhelpful. Separation conducted well is a legitimate outcome, and the work changes shape rather than stopping.',
        'What it becomes is practical and specific. **Agreeing how the decision is communicated**, particularly where children are involved, and doing it once, together, rather than in fragments over weeks. **Separating the logistics from the grievances**, so that decisions about money and time are not being made as a continuation of the argument. And **establishing what the relationship becomes**, since two people with children remain in relationship indefinitely — the question is only what kind.',
        'The evidence on children is fairly consistent and worth knowing: what predicts poor outcomes is not separation itself but sustained conflict between parents. A well-managed separation is generally better for a child than a household running on contempt. That finding tends to relieve a considerable amount of guilt, and it also raises the stakes on doing the separation carefully.',
        'It is also common for one partner to reach this conclusion before the other, and for the sessions to be doing two different jobs at once — grieving for one person, deciding for the other. Naming that openly is uncomfortable and considerably better than six more weeks of ambiguity.',
      ],
    },
  ],

  'services/emdr-therapy': [
    {
      h2: 'What "trained" actually means, and what to ask',
      body: [
        'EMDR training is tiered, and the word on a website covers a wide range. Asking about it is a normal question that a properly trained clinician answers without defensiveness.',
        'Standard training runs in parts, with supervised practice and consultation between them, and completing the full sequence is the baseline for practising it. Beyond that, some clinicians pursue certification, which requires additional consultation hours and demonstrated competence, and some go further into consultant-level training. None of that guarantees a good fit; it establishes a floor.',
        'The questions worth asking are specific. **Have you completed the full training, or part of it?** **Do you receive ongoing consultation on EMDR cases?** **How do you handle it if reprocessing destabilises someone?** The third is the most revealing, because it separates clinicians who understand the protocol as a safety structure from those who have learned a technique.',
        'It is also worth asking how they screen for dissociation before starting. A standard protocol applied to a significant dissociative presentation without assessment is the clearest way this work goes wrong, and a careful clinician will have a clear answer.',
        'Finally, ask what they would do if EMDR is not the right fit for you. Anyone whose answer is that it always is has told you something useful — see [CBT vs EMDR for trauma](/compare/cbt-vs-emdr-for-trauma).',
      ],
    },
  ],

  'services/trauma-therapy': [
    {
      h2: 'Signs the pacing is wrong',
      list: [
        { label: 'You leave sessions unable to function', detail: 'Feeling stirred for a few hours is expected. Losing the rest of the day, repeatedly, means too much is being opened relative to current capacity.' },
        { label: 'You dread sessions rather than find them hard', detail: 'A meaningful distinction. Difficult is normal; dread that builds through the week suggests the container is not holding.' },
        { label: 'Sessions end abruptly at the hard part', detail: 'A well-run trauma session reserves the last ten to fifteen minutes for closing down. Finishing mid-material and sending you out is a structural problem, not a scheduling accident.' },
        { label: 'Symptoms are worsening over weeks, not days', detail: 'A temporary increase after opening something is expected. A sustained escalation across a month is a signal to slow down and rebuild stabilisation.' },
        { label: 'You are dissociating in sessions', detail: 'Going blank, losing time, watching from outside. It means the work has moved outside the window of tolerance and should be paused and reoriented rather than pushed through.' },
        { label: 'You have started using something to get through', detail: 'An increase in drinking or anything else timed around sessions is the clearest signal that the pace is exceeding capacity. Say it — it changes the plan rather than ending it.' },
      ],
    },
  ],

  'services/anxiety-counselling': [
    {
      h2: 'Reassurance-seeking, the quietest maintaining factor',
      body: [
        'Alongside avoidance, the most reliable maintainer of anxiety is reassurance — and it is far harder to spot, because everyone involved experiences it as support.',
        'It takes several forms. Asking a partner repeatedly whether something is fine. Searching symptoms. Re-reading an email to confirm it was not rude. Checking a lock, a stove, a booking. Asking the same question in slightly different words so it does not sound like the same question.',
        'The mechanism is identical to avoidance: each instance produces immediate relief, and the relief teaches the brain that the check was necessary. Anxiety returns slightly stronger and the interval to the next check shortens. Over a year this produces someone who cannot tolerate uncertainty for more than a few minutes.',
        'It is also corrosive to relationships, in a way neither party usually names. The person providing reassurance is doing something kind that is making things worse, and they typically sense it before they can articulate it — which produces irritation, then guilt about the irritation.',
        'The treatment is to reduce it deliberately rather than eliminate it overnight: agreeing with a partner that they will answer once and not again, extending the interval before checking, and tolerating the discomfort that follows. That discomfort is the mechanism. It falls on its own if nothing intervenes, and demonstrating that repeatedly is what teaches the system it does not need the check.',
      ],
    },
  ],

  'services/depression-counselling': [
    {
      h2: 'The thinking patterns that come with it',
      body: [
        'Depression changes cognition in specific and recognisable ways, and knowing the shapes helps, because it converts a set of apparently self-evident conclusions into symptoms.',
        '**Overgeneralisation.** One instance becomes a rule. A single awkward conversation becomes evidence about your whole social competence. The give-away is the words always and never.',
        '**Discounting anything positive.** Good outcomes get reclassified as luck, timing, or other people being kind. This is why encouragement does not land — it is processed and discarded before it registers.',
        '**Mind-reading.** Confident conclusions about what other people think, treated as observations rather than as guesses. Almost always negative and almost never checked.',
        '**Fortune-telling.** Certainty about how something will go, which then justifies not attempting it — and the non-attempt is read afterwards as confirmation.',
        '**Personalising.** Assuming responsibility for outcomes with many causes, including other people\'s moods.',
        'The clinical point is not that these thoughts are irrational. It is that depression makes them feel like perception rather than interpretation — they arrive with the weight of an observation. Learning to catch them as they happen, write them down and check them against evidence is unglamorous, repetitive, and among the better-evidenced interventions available.',
      ],
    },
  ],

  'services/punjabi-counselling': [
    {
      h2: 'Bringing family into it, or not',
      body: [
        'A question that comes up often: should a parent, spouse or sibling be part of this? There is no default answer, and the considerations are worth setting out.',
        '**Reasons it can help.** Where the difficulty is genuinely relational and both people are willing, a session together can move something that months of individual work cannot. Where an older family member holds crucial history, their account can be genuinely clarifying. And in families where the individual seeking help is assumed to be the problem, a joint session sometimes redistributes that framing usefully.',
        '**Reasons to be cautious.** Once a family member is in the room, what you can say changes — and it does not always change back. Where there is a significant power imbalance, a joint session can reproduce it rather than address it. And where the difficulty is partly about the freedom to have your own view, importing the audience defeats the purpose.',
        'The practical position taken here is that individual work is the default, joint sessions are possible and are planned deliberately rather than arranged casually, and nothing about your individual sessions is disclosed in a joint one without your agreement.',
        'It is also worth saying that supporting a family member without them attending is legitimate work in itself — see [how to support someone who is struggling](/guides/supporting-someone-who-is-struggling).',
      ],
    },
  ],

  'services/south-asian-mental-health': [
    {
      h2: 'What cultural competence should and should not mean',
      body: [
        'The phrase gets used loosely enough to be worth defining, because the version that helps and the version that irritates look similar from outside.',
        '**What it should mean** is that the context does not have to be explained from scratch. That you do not spend twenty minutes establishing why a decision that looks straightforward is not. That references land. That a counsellor understands obligation as something other than dysfunction, and does not treat a family structure as a problem to be dismantled.',
        '**What it should not mean** is a counsellor who believes they already know your family. Communities are not uniform, and assumptions about religion, region, migration history, class or generation are frequently wrong in ways that are difficult to correct once stated with confidence.',
        'The working version is closer to cultural humility than cultural expertise: a starting position considerably closer to yours, combined with a habit of checking rather than assuming. In practice that sounds like "in some families that would mean X — is that how it works in yours?" rather than a confident account of your situation.',
        'It also means being able to hold two things at once: that a cultural expectation can be genuinely valuable to you **and** genuinely costly, without a counsellor pushing you toward either abandoning it or accepting it. That is the specific thing people most often report not getting elsewhere.',
      ],
    },
  ],

  'services/online-counselling-bc': [
    {
      h2: 'What is different about the therapeutic relationship on video',
      body: [
        'The research finds working alliance in video therapy broadly comparable to in-person, with genuine inconsistency across studies. What that average conceals is a set of specific differences worth naming.',
        '**Silence works differently.** In a room, a pause is comfortable and legible. On video, a few seconds of silence reads as a connection problem, and both people tend to fill it. That is a real loss, because silence in therapy is frequently where the useful thing surfaces. Counsellors who work by video learn to name it — "take your time, I am still here" — and clients get used to it within a few sessions.',
        '**You see your counsellor\'s face more closely than you would in a room,** and less of everything else. That amplifies facial expression and removes posture and gesture, which changes what you read from them.',
        '**The transition is missing.** Arriving at a building and leaving it did psychological work. Ten unclaimed minutes on either side replaces it, and skipping that is the most common complaint about the format.',
        '**Control shifts toward the client** in ways that are mostly beneficial. You are in your own space, you can end the call, and for people with trauma histories that additional control is frequently the reason video works better for them rather than worse.',
        'None of this is predictable in advance. Two or three sessions is enough to know, and concluding it is not for you is a legitimate finding rather than a failure.',
      ],
    },
  ],

  /* ---------------- comparisons ---------------- */
  'compare/rcc-vs-psychologist-vs-social-worker-bc': [
    {
      h2: 'Cost differences, and what actually drives them',
      body: [
        'Fees vary by designation in BC, and the drivers are worth understanding because the cheapest option is not always the best value and the most expensive is not always the most qualified.',
        'Registered psychologists typically charge the most, reflecting doctoral-level training and the assessment work only they can perform. Registered clinical counsellors and clinical social workers generally sit lower. Within each designation the range is wide, and it tracks experience, specialisation and location more than anything else.',
        'What matters more than the headline rate is what your plan reimburses. A higher fee with 80% coverage costs less than a lower fee with none, and this is the calculation people most often skip. Check the designation with your insurer before comparing rates — see [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling).',
        'It is also worth being clear that fee does not track effectiveness. For talk therapy specifically, the evidence does not support the idea that a more expensive designation produces better outcomes for common presentations. Where the designation genuinely matters is where the task requires it: diagnosis, formal assessment, prescribing.',
        'Which produces a straightforward rule. If you need something only a particular designation can do, pay for that designation. If you need counselling, choose on fit and on what your plan covers, not on the letters.',
      ],
    },
  ],

  'compare/individual-vs-couples-therapy': [
    {
      h2: 'Starting individually when your partner refuses',
      body: [
        'This is one of the most common situations and one of the most quietly hopeful, because the assumption underneath the question — that nothing can change unless both people participate — is not correct.',
        'Relationship patterns are maintained by both people, which means either can interrupt them. If one partner stops pursuing, the pursue-withdraw cycle cannot run in its usual form. If one stops matching escalation, escalation is much harder to sustain. That is not a technique for manipulating someone; it is a description of how a two-person system responds when one half changes.',
        'What individual work realistically offers here is threefold. **Clarity** about what is actually happening, which is difficult to obtain from inside it. **Your own contribution**, which is the only part you can change directly and is nearly always larger than it appears from inside a grievance. And **the decision**, which for many people is the actual question underneath.',
        'What it cannot do is produce a guaranteed change in the other person. Sometimes one partner changing brings the other into the work; sometimes it clarifies that the relationship is not going to change. Both are real outcomes and neither can be promised.',
        'It is also worth being honest about a risk. Individual work on a relationship can become a place to build a case rather than to examine a pattern. A good counsellor will notice that drift and name it — see [when therapy is not working](/guides/when-therapy-isnt-working).',
      ],
    },
  ],

  'compare/cbt-vs-emdr-for-trauma': [
    {
      h2: 'What the guidelines actually recommend',
      body: [
        'Clinical guidelines for post-traumatic stress across several countries converge on a fairly consistent position, and knowing it makes it easier to ask for the right thing.',
        'The recommended first-line treatments are **trauma-focused psychological therapies** — the trauma-focused cognitive approaches and EMDR — rather than general counselling, general talking therapy, or medication as an opening move. That is a meaningful distinction: "I have been in therapy for two years and the flashbacks are unchanged" frequently means the therapy was not trauma-focused.',
        'Both families are recommended, and guidelines generally do not rank one above the other for adults with post-traumatic stress. Where they differ is in the detail — some place slightly more weight on trauma-focused cognitive approaches on the strength of the larger evidence base, while treating EMDR as an established alternative.',
        'What guidelines consistently do **not** recommend is single-session psychological debriefing immediately after a traumatic event, which was widely used for years and is now understood to be unhelpful and possibly harmful. If someone offers it, that is out of date.',
        'The practical use of all this is simple. Ask a prospective counsellor whether the approach they are proposing is trauma-focused, and which one. A clinician who cannot answer that in a sentence is unlikely to be delivering either protocol as designed.',
      ],
    },
  ],

  'compare/therapy-vs-coaching': [
    {
      h2: 'The regulatory picture, and where it is heading',
      body: [
        'It is worth understanding why this gap exists rather than treating it as an oversight, because it explains what will and will not change.',
        'Health professions in British Columbia are regulated where the province has decided the risk of unregulated practice is high enough to warrant it. Psychologists, social workers and several others are inside that system. Counselling therapy is being brought in, under the College of Health and Care Professionals of BC, which will give it a protected title and a statutory complaints process.',
        'Coaching is not a health profession and is not part of that process. There is no proposal to regulate it, and there is unlikely to be one, because it does not claim to treat health conditions. That is a coherent position — the problem is not that coaching is unregulated, it is that the boundary is invisible to consumers.',
        'The practical consequence is that the burden of distinguishing them falls on you, permanently. A coach and a counsellor can both have a professional website, both charge similar fees, and both offer weekly hour-long conversations. Only one has an entry standard, mandatory insurance and somewhere to complain.',
        'None of which makes coaching a bad choice for what it is for. It makes asking directly what someone is trained in, and what they do when something clinical surfaces, the single most useful question available — see [how to verify a counsellor in BC](/resources/verify-a-counsellor-in-bc).',
      ],
    },
  ],

  'compare/therapy-medication-or-both': [
    {
      h2: 'Common worries, addressed plainly',
      list: [
        { label: '"It will change my personality"', detail: 'A reasonable question and one for your prescriber. What people more often report is feeling more like themselves rather than less — but flattening is a recognised side effect for some, it is worth raising early, and it is a reason to review rather than to endure.' },
        { label: '"I should be able to manage without it"', detail: 'A moral framing applied to a medical decision. Nobody applies it to insulin. It is worth noticing where the belief came from, and it is not a clinical consideration.' },
        { label: '"I will not be able to stop"', detail: 'Discontinuation is a real process requiring a plan and a prescriber, and it is a normal part of treatment rather than a trap. Ask how it is done before you start.' },
        { label: '"It is masking the real problem"', detail: 'Sometimes reducing symptoms is what makes the real problem workable. Someone with no concentration and no energy cannot engage with therapy, which is precisely why the two are frequently combined.' },
        { label: '"My family will disapprove"', detail: 'Common, and a legitimate thing to work on in counselling rather than a reason to decide alone. It is also information you do not owe anyone.' },
      ],
    },
  ],

  'compare/efap-vs-private-counselling': [
    {
      h2: 'What to do when the sessions run out mid-work',
      body: [
        'The most predictable failure point in a capped programme is reaching session six with the work half done. There are better and worse ways to handle it, and the difference is largely about acting before you get there.',
        '**Raise it at session three, not session six.** A counsellor who knows the cap is approaching can shift toward consolidation — making sure you leave with something usable rather than mid-excavation. Left to the last session, that is not possible.',
        '**Ask what happens at the end.** Some programmes allow an extension for a new issue, some allow a fresh allocation in a new benefit year, and some can refer you into a longer-term service. Providers do not always volunteer this.',
        '**Get a written summary.** What was worked on, what helped, what remains, and what the counsellor would recommend next. It is the difference between resuming and restarting, and it can save several sessions of history-taking wherever you go next.',
        '**Check whether your extended health is a separate pool.** Many people have both an EFAP and a counselling benefit under their health plan, and treating them as one entitlement leaves money unused — see [extended health coverage in BC](/resources/bc-extended-health-coverage-for-counselling).',
        '**And do not restart from zero.** Bring the summary, say what was covered and where it stopped. A new counsellor with that information moves considerably faster than one starting cold.',
      ],
    },
  ],

  'compare/weekly-vs-biweekly-sessions': [
    {
      h2: 'Planned breaks, and how to take one without losing the work',
      body: [
        'Breaks happen — holidays, work travel, money, a period where life has no room in it. Taken deliberately they cost very little; taken by drift they frequently end the work entirely.',
        'The difference is a conversation before rather than a cancellation during. **Name the length.** "I need six weeks" is a plan; "I will get in touch" is usually the end. **Book the return session before you stop**, which is the single most effective thing on this list, because the return is the part that does not happen otherwise.',
        '**Agree what to hold onto.** One or two specific things to keep doing — a practice, a boundary, a piece of tracking — so the break is a plateau rather than a slide.',
        '**Agree what would bring you back sooner**, and write it down. A defined trigger removes the need to make that judgement later, when judgement is least available.',
        'It is also worth knowing which phases tolerate a break poorly. Mid-way through trauma reprocessing is the clearest case — a memory that has been opened and not fully processed is a bad thing to carry for six weeks. Where a break is unavoidable at that point, the work should be deliberately closed down first rather than paused mid-target, and a counsellor should raise that rather than simply agreeing to the dates.',
      ],
    },
  ],

  /* ---------------- resources ---------------- */
  'resources/bc-extended-health-coverage-for-counselling': [
    {
      h2: 'Making a claim, and what to do if it is refused',
      body: [
        'The mechanics are straightforward and the failure points are consistent, so they are worth knowing before the first claim rather than after.',
        '**Submit promptly.** Most plans have a deadline — frequently 90 days from the date of service, sometimes to the end of the following plan year. Receipts sitting in a drawer are the most common reason benefits go unused.',
        '**Check what the receipt must show.** Typically the practitioner\'s name and designation, their registration number, the date, the amount and the service. A receipt missing the registration number is the most common cause of a refusal, and it is trivially fixable by asking.',
        '**Keep the originals.** Insurers can request supporting documentation after paying, sometimes months later.',
        'If a claim is refused, the reason is usually one of four: the designation is not eligible under your plan, the annual maximum is exhausted, the receipt is incomplete, or a referral was required. Ask which — in writing — rather than assuming. Three of those four are fixable.',
        'If it is the first, that is worth knowing immediately rather than after several sessions, because it changes what you are paying and possibly who you should be seeing. And if you believe the refusal is wrong, plans have an appeal process with a deadline attached; missing the deadline is the most avoidable way a valid claim fails.',
      ],
    },
  ],

  'resources/msp-vs-extended-health': [
    {
      h2: 'If you have no coverage at all',
      body: [
        'A meaningful share of people in BC have neither extended health nor an employer programme — self-employed workers, contractors, part-time and gig workers, and anyone between jobs. The routes are narrower and they are not nothing.',
        '**Health authority services are free** and accept self-referral in most regions. Waits are real and triaged by urgency, which is why accurate reporting at intake matters.',
        '**Community agencies** in most regions offer counselling at reduced rates, often on a genuine income basis, and they are consistently under-used because they do not advertise.',
        '**Training clinics** attached to graduate counselling and psychology programmes provide sessions at substantially reduced cost with supervised student clinicians. The supervision is close and the quality is frequently better than the price suggests.',
        '**Free structured programmes** for low mood and anxiety exist, are coach-supported and have a real evidence base. Not therapy, and considerably better than a four-month gap.',
        '**Crisis and support lines** are free, immediate, available at any hour, and legitimate for far more than emergencies.',
        '[Low-cost counselling in BC](/resources/low-cost-counselling-bc) lists these in detail. And if you are self-employed, it is worth checking whether counselling is a deductible business expense or whether an individual health plan makes sense — a question for an accountant rather than a counsellor, and one people never think to ask.',
      ],
    },
  ],

  'resources/low-cost-counselling-bc': [
    {
      h2: 'Training clinics, the most under-used option',
      body: [
        'Graduate programmes in counselling and clinical psychology run training clinics where students see clients at substantially reduced rates under supervision. They are consistently the least-known low-cost route and frequently the best.',
        'The obvious concern is competence, and it deserves a straight answer. Student clinicians are less experienced, and they are also in the most closely supervised phase of their entire careers — sessions are reviewed, sometimes recorded with consent, and discussed with an experienced clinician weekly. In practice that produces a level of oversight no private practitioner receives.',
        'They tend also to be enthusiastic, current on the evidence, and unhurried, because they are not managing a full caseload. Several of the outcome studies comparing supervised trainees with experienced clinicians find smaller differences than people expect.',
        'The real limitations are practical rather than about quality. Availability follows the academic calendar, which means a course of work can be interrupted by a term ending or a placement finishing. Waits can be long. And the fit between what they are training in and what you need is not always available.',
        'Where it works well is for a bounded, non-crisis difficulty over a defined period. Where it works less well is for complex trauma or anything requiring long-term continuity with one person. Ask about the placement length before starting — it is the single most useful question.',
      ],
    },
  ],

  'resources/bc-crisis-and-support-directory': [
    {
      h2: 'Making a plan before you need one',
      body: [
        'The worst time to work out what to do in a crisis is during one. A written plan, made while you have capacity, is one of the higher-value things available and it takes about twenty minutes.',
        'A usable plan has five parts. **Your own early warning signs** — the specific things that show up before it gets bad, which are usually recognisable in retrospect and easy to miss in the moment. Not sleeping, cancelling things, a particular thought returning.',
        '**What has helped before.** Concretely. Not "self-care" — the actual things: a specific person, a specific walk, leaving the house, a phone call.',
        '**Who to contact, in order.** Names and numbers written down, because at 2 a.m. nobody looks anything up. Include the crisis lines: **9-8-8** by call or text, and **310-6789** in BC.',
        '**What makes it worse.** Alcohol, certain people, being alone past a certain hour, scrolling. Knowing these in advance means removing them is a decision already made.',
        '**And one person who has a copy.** A plan nobody else knows about cannot be activated by anyone else, and the point at which it is most needed is frequently the point at which you are least able to reach for it.',
        'Keep it somewhere reachable — a note on a phone, a card in a wallet. This is standard practice in mental health care and it is unusual for anyone to suggest it outside a clinical setting.',
      ],
    },
  ],

  'resources/student-mental-health-supports-bc': [
    {
      h2: 'The specific pressures that bring students in',
      list: [
        { label: 'The first term away from home', detail: 'A larger transition than it is credited as being — every routine, relationship and support structure replaced at once, alongside academic demands. The dip in October and November is common enough to be predictable.' },
        { label: 'Achievement as identity', detail: 'For students whose sense of self is built on academic performance, a first bad grade is not a setback but a threat to who they are. Common in high-achieving students and in first-generation students carrying a family\'s expectations.' },
        { label: 'International student isolation', detail: 'Language, distance, visa constraints, financial pressure, and a family whose expectations were formed at a distance from the reality. A specific and heavy combination.' },
        { label: 'Sleep destroyed by design', detail: 'Late schedules, irregular timetables, caffeine, and a culture that treats not sleeping as commitment. Sleep loss then degrades exactly the capacities being assessed.' },
        { label: 'The comparison problem', detail: 'Constant visibility of peers who appear to be coping better, which is a comparison of your inside to everyone else\'s outside, conducted continuously.' },
        { label: 'Deciding whether to continue', detail: 'A legitimate and enormous question, frequently entangled with family expectation, sunk cost and debt, and one that people try to answer alone.' },
      ],
    },
  ],

  'resources/workplace-mental-health-bc': [
    {
      h2: 'Returning to work after leave',
      body: [
        'The return is where a good deal of leave is undone, and it is the phase with the least support attached to it.',
        '**Graduated returns are better evidenced than hard returns**, and they are frequently available even where nobody offers them. Two or three days a week building over four to six weeks gives a nervous system a chance to recalibrate, and it substantially reduces the chance of a second absence.',
        '**Agree the plan in writing before the first day back**, including what happens if it is not working. A return with no review point is a return with no exit except another collapse.',
        '**Decide what colleagues will be told,** and by whom. Walking into a room where nobody knows what to say is genuinely hard, and a single agreed sentence from a manager removes most of it.',
        '**Expect the first two weeks to be disproportionately tiring.** Capacity returns more slowly than motivation, and people routinely interpret ordinary readjustment fatigue as evidence that the leave failed.',
        '**And address what caused it.** A return to precisely the conditions that produced the absence has a predictable outcome. Where the workload, the role or the relationship was the driver, the return plan has to include a change to it — otherwise the leave functioned as a pause rather than a treatment.',
      ],
    },
  ],

  'resources/verify-a-counsellor-in-bc': [
    {
      h2: 'Verifying a practice as well as a person',
      list: [
        { label: 'Is the fee published?', detail: 'A practice that will not state its rate without a call is optimising for a sales conversation. Fees, session length and cancellation terms should be findable.' },
        { label: 'Does it publish testimonials?', detail: 'Client testimonials are prohibited under BCACC advertising standards. A practice displaying them is either not bound by those standards or not following them, and both are worth knowing.' },
        { label: 'Does it make outcome claims?', detail: 'Guarantees, success rates, "proven results" and before-and-after framing are all outside what a registered counsellor may advertise.' },
        { label: 'Does it say what it does not do?', detail: 'A practice that states its scope limits is showing you the judgement you want. A list of twenty specialisms with no boundaries is showing you positioning.' },
        { label: 'Is there a privacy statement that says anything specific?', detail: '"We value your privacy" is not information. What is collected, where it is stored, how long it is kept, and what the limits of confidentiality are — those are.' },
        { label: 'Who wrote the content?', detail: 'Health content written by an agency and published without clinical review is common. Whether a site says who is accountable for what it publishes is a reasonable thing to weigh.' },
      ],
    },
  ],

  'resources/psychiatry-and-assessment-in-bc': [
    {
      h2: 'Whether an assessment is worth the cost',
      body: [
        'Private psychological assessment in BC runs into the thousands, and it is worth being clear-eyed about when that is money well spent and when it is not.',
        '**It is worth it when something depends on the documentation.** Academic accommodation, workplace accommodation, a disability claim, or access to a service with a diagnostic gate. In those cases the report is the point, and there is no substitute.',
        '**It is worth it when the diagnostic question genuinely changes the treatment.** Some conditions have specific, well-evidenced treatments that differ from general counselling, and where the answer changes what you do, the assessment earns its cost.',
        '**It is often not worth it when the goal is self-understanding alone.** That is a real and legitimate goal, and a great deal of it is available through counselling at a fraction of the price. A label can be clarifying and it does not, by itself, change anything.',
        '**And it is not worth it if it becomes a way of deferring the work.** Waiting eighteen months and several thousand dollars for a diagnosis before addressing something that is causing distress now is a common and expensive form of avoidance.',
        'Where documentation is genuinely needed and cost is the obstacle, the lower-cost routes — university training clinics, school district assessments, and health-authority programmes — all exist and all involve waiting. Starting that process early, in parallel with counselling rather than instead of it, is usually the better structure.',
      ],
    },
  ],

  /* ---------------- audiences ---------------- */
  'for/new-parents': [
    {
      h2: 'The second parent, and the relationship',
      body: [
        'Almost all perinatal support is directed at the birthing parent, for good reasons. Two things get missed as a result.',
        'The first is that **non-birthing parents experience significant perinatal mental health difficulty too**, at rates high enough to matter, and there is essentially no screening for it. They are also the least likely to raise it, because the culturally available role is support rather than need. Difficulty here frequently presents as irritability, withdrawal, working longer, or drinking more, rather than as anything anyone would name as depression.',
        'The second is that **relationship satisfaction declines sharply after a first child for a large proportion of couples**. That is one of the more robust findings in the literature and it is almost never mentioned to anyone in advance. Couples experiencing it typically conclude something has gone specifically wrong with them, which adds a second problem to the first.',
        'What tends to help is unromantic. Sleep is the single largest variable, and any arrangement that gets each parent one protected block of uninterrupted sleep is worth more than any conversation about the relationship. Beyond that: making the invisible work visible and dividing it explicitly rather than by drift, and protecting one short predictable window of adult conversation that is not logistics.',
        '[Counselling for couples](/for/couples) covers the relationship side directly, and it is worth saying that arriving in the first year is early rather than late.',
      ],
    },
  ],

  'for/university-students': [
    {
      h2: 'Deciding whether to keep going',
      body: [
        'A significant number of students arrive at counselling with a question that is not really about mental health: should I still be doing this degree? It is a legitimate use of sessions and it is worth separating into its parts.',
        '**Is this a capacity problem or a fit problem?** They feel identical from inside. Struggling because you are unwell, under-slept and unsupported is a different situation from struggling because the subject is wrong for you, and the first is usually fixable without changing anything about the degree.',
        '**Whose decision would this be?** For many students, and disproportionately for first-generation students, the programme was chosen with heavy family involvement. Disentangling what you want from what was expected is genuinely difficult and it is exactly the kind of thing counselling is for.',
        '**What are the reversible and irreversible parts?** A leave of absence, a reduced load, a programme transfer and a withdrawal have very different consequences, and most students do not know which of them are recoverable. The registrar and the accessibility office have those answers.',
        '**And what is the sunk cost doing to the reasoning?** Two years already spent is not an argument for four more. It feels like one, powerfully, and it is worth naming.',
        'None of this is a counsellor telling you what to do. It is having somewhere to think that is not the dinner table, with someone who has no stake in the answer.',
      ],
    },
  ],

  'for/healthcare-and-shift-workers': [
    {
      h2: 'What to do after a bad shift',
      body: [
        'Debriefs happen or they do not, and either way the processing mostly occurs afterwards, alone, at 3 a.m. A small amount of structure in the first forty-eight hours makes a measurable difference.',
        '**Do not go straight to sleep on it if you can avoid it.** Twenty minutes of something ordinary between the shift and bed — a walk, a shower, a conversation — gives the system a transition. Going directly from an event to sleep is associated with more intrusive material afterwards.',
        '**Say it out loud once, to one person.** Not repeatedly, and not in detail to everyone. A single coherent account to someone who can hear it does more than either silence or repeated retelling, which can entrench rather than settle.',
        '**Move.** The physiological load from an acute event is real and it metabolises with activity considerably better than with stillness.',
        '**Watch the alcohol.** It is the standard post-shift decompression and it degrades exactly the sleep that would otherwise help process the event.',
        '**And notice the two-week mark.** Intrusive images, disturbed sleep and heightened startle in the first days after a serious event are a normal response rather than a disorder. Persisting past a fortnight, or getting worse rather than better, is the point at which it is worth speaking to someone — see [what trauma actually means](/guides/what-trauma-actually-means).',
      ],
    },
  ],

  'for/first-gen-south-asian-adults': [
    {
      h2: 'Marriage, partners, and the conversation nobody wants',
      body: [
        'One of the most frequently raised areas, and one where general advice is close to useless because it is written for a context where the decision belongs solely to the individual.',
        'The recurring situations are specific. A partner the family will not accept. Pressure to marry on a timeline that is not yours. A marriage that is not working in a family where separation is close to unspeakable. Being the sibling whose choice will determine what is possible for the others. And navigating a partner\'s family alongside your own, with two sets of expectations that do not align.',
        'What makes these hard is not that the answer is unclear. It is that every available option costs something real — and advice premised on "your life is yours" ignores that the cost is genuine rather than imagined.',
        'What counselling can do here is narrower and more useful than a verdict. Working out what you actually want, separately from what you are prepared to bear. Understanding what the resistance is protecting, which is frequently fear rather than disapproval. Deciding what you would do with each outcome before the conversation, so it is not being decided in the room. And handling the aftermath, which is usually longer than the conversation.',
        'What it will not do is tell you which is correct. Anyone who does is substituting their values for yours, which is the opposite of the job.',
      ],
    },
  ],

  'for/women': [
    {
      h2: 'Asking for something, without a case attached',
      body: [
        'A pattern that shows up repeatedly: an ability to advocate effectively for other people — children, patients, colleagues, parents — alongside near-total inability to ask for anything on one\'s own behalf without constructing a justification first.',
        'The tell is the shape of the request. "I was wondering if it might be possible, if it is not too much trouble, because otherwise the schedule does not work, and obviously if it is difficult then never mind." A case, an apology and a pre-emptive withdrawal, all before anyone has answered.',
        'Two things are happening. The first is a learned expectation that a request will be refused unless it is proven necessary, which is often an accurate summary of experience rather than a distortion. The second is that the elaborate framing is doing protective work: an unadorned request that gets declined is a rejection, while a hedged one can be reclassified afterwards as never really having been asked.',
        'The practical work is unglamorous — shortening requests, removing the justification, and tolerating the discomfort of an unhedged ask. "I need Thursday afternoon" rather than four sentences. It feels rude for about a fortnight and then stops feeling like anything, and people are frequently startled by how often the answer is simply yes.',
        'Where this connects to something older, it is usually about who was allowed to have needs — which is [intergenerational](/guides/intergenerational-trauma-explained) territory as much as it is about assertiveness.',
      ],
    },
  ],

  'for/couples': [
    {
      h2: 'Rebuilding after a breach of trust',
      body: [
        'Repair after an affair, a significant lie or a hidden financial problem is possible and it is slower and more structured than most couples expect. Being clear about the shape helps both people decide whether they want to attempt it.',
        '**Disclosure comes first and it has to be complete.** Repair cannot proceed on an instalment plan; each new revelation resets the clock, and drip-fed truth is the single most common reason attempted repair fails.',
        '**Then a period of transparency that would be intolerable in an ordinary relationship.** Access, accounting, answering the same question repeatedly without irritation. This is temporary, it is not a permanent arrangement, and the partner who breached trust does not get to set the end date.',
        '**Then the harder part: understanding how it happened.** Not to distribute blame, but because "it meant nothing" explains nothing, and a couple who cannot account for it has no basis for believing it will not recur.',
        '**Then, much later, the relationship itself** — what was not working, what was not being said, and what both people want now.',
        'Two honest points. The injured partner will need to ask the same questions many times, and that repetition is part of the process rather than a failure to move on. And the timeline is longer than either person wants — measured in many months rather than weeks. Couples who are told this in advance do considerably better than couples who conclude at week six that it should be finished by now.',
      ],
    },
  ],

  'for/rotational-and-camp-workers': [
    {
      h2: 'Drinking, and where the line usually moves',
      body: [
        'Alcohol occupies a specific structural role in rotational life, and naming it plainly is more useful than a warning.',
        'On the way in, it marks the end of the days off. On the way out, it marks the end of the rotation. In camp, where drinking is restricted or prohibited, the pattern frequently compresses into the days at home instead — which produces a two-week abstinence and a two-week concentration that looks like moderation on a weekly average and is not.',
        'The line usually moves in three recognisable stages. First it becomes the transition ritual, which is common and not in itself a problem. Then it becomes the thing that makes the transition possible, which is a change in function rather than quantity. Then it becomes what happens whether or not there is a transition to mark.',
        'The questions that actually separate those: does the amount increase when the fortnight has been harder? Is it the first thing you plan on the way home? Has anyone at home mentioned it more than once? Do you drink alone at the end of the day off as well as at the start?',
        'None of that is a diagnosis, and a counsellor does not provide one. What it is is worth raising early rather than at the point where it has become the largest thing on the list — and where withdrawal management is needed, that is a medical service rather than a counselling one. [The BC resource directory](/resources/bc-crisis-and-support-directory) lists the routes.',
      ],
    },
  ],

  'for/family-caregivers': [
    {
      h2: 'After it ends',
      body: [
        'The period after caregiving ends is consistently harder than people anticipate, and almost nobody is warned about it.',
        'Several things arrive at once. **The structure disappears.** Years of days organised around appointments, medications and someone else\'s needs, and then nothing — which is disorienting in a way that resembles the end of a career more than a bereavement.',
        '**The grief arrives properly,** frequently for the first time. Caregiving is absorbing enough to defer it, and the deferral ends abruptly.',
        '**So does the relief**, and it is the hardest thing to say to anyone. Relief that it is over, that the nights are yours again, that a long decline has stopped. It sits alongside grief rather than replacing it, and people conclude from it that they are monstrous.',
        '**And the exhaustion becomes visible.** Years of deferred sleep, deferred health and deferred everything land at once, usually a few weeks in, and are frequently mistaken for depression when they are also simply the bill.',
        'The other thing that arrives is a question with no obvious answer: who are you now. A role that consumed years and was never chosen has ended, and the life it displaced is not waiting where it was left.',
        'This is one of the most common points at which caregivers seek counselling, long after everyone around them has assumed the difficult part is over — and it is a good reason rather than a late one.',
      ],
    },
  ],
};

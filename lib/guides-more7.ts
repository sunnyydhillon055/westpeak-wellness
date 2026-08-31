import type { Guide } from './guides';

/* The seventh guide file: the work-and-money practicalities cluster,
 * 2026-08-28. Built from Search Console evidence, not instinct — the
 * stress-leave guide's query cluster (~120 impressions at positions 16–28)
 * is the strongest organic asset the site has, and these four are its
 * unbuilt neighbours. Same register throughout: procedural, BC-specific,
 * every figure sourced, no clinical content. Figures that also appear on
 * /guides/stress-leave-bc (the 5 ESA days, the 55% / $729 / 26-week EI
 * shape) are kept identical — two pages quoting different numbers for the
 * same benefit is worse than either being wrong alone. */
export const moreGuides7: Guide[] = [
  {
    slug: 'ei-sickness-benefits-and-therapy',
    figure2: 'reimbursement-flow',
    figure: 'bc-support-routes',
    title: 'EI sickness benefits and therapy: how the 26 weeks work',
    metaTitle: 'EI Sickness Benefits & Therapy in BC | Westpeak',
    metaDescription:
      'How EI sickness benefits work for a mental-health leave — eligibility, the medical certificate, what they pay, and where counselling fits in the 26 weeks.',
    eyebrow: 'Guide · Work & money',
    lede:
      'The employer sick days run out fast. What most people are actually living on during a longer mental-health leave is EI sickness benefits — and almost nobody understands them until they are already off.',
    shortAnswer:
      'EI sickness benefits replace 55% of your insurable earnings, to a maximum of $729 a week in 2026, for up to 26 weeks — and they apply to mental-health conditions exactly as they do to physical ones. You need 600 insurable hours in the qualifying period, a medical certificate saying you are unable to work, and a claim filed promptly, because there is a one-week waiting period and late claims risk losing weeks. The benefit is taxable, it is far less than a paycheque, and knowing both before the leave starts is half of surviving it.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'Does a mental-health leave qualify for EI sickness benefits?',
        body: [
          'Yes, unambiguously. EI sickness benefits do not distinguish between a broken leg and a depressive episode — the test is that a medical practitioner certifies you are **unable to work for medical reasons**, and mental-health conditions meet it the same way anything else does. Burnout is not itself a diagnosis, but the conditions that travel under it — depression, anxiety disorders, adjustment disorder — are exactly what these claims are made of.',
          'The eligibility mechanics: **600 insurable hours** in the last 52 weeks (roughly 15 hours a week over a year of insurable employment), regular earnings reduced by more than 40%, and the medical certificate. Self-employed people are outside the program unless they opted into EI special benefits at least a year earlier — a gap that surprises a lot of contractors at the worst possible moment.',
          'What it pays: **55% of average insurable weekly earnings, capped at $729 a week in 2026**, taxable, after a one-week unpaid waiting period. For most full-time earners that is a serious income cut, and the honest planning question is not "am I eligible" but "can the household run on 55% — and for how long".',
        ],
      },
      {
        h2: 'How to apply, in the order that avoids losing weeks',
        body: [
          'First, get the medical certificate at the appointment where the leave is decided — a family doctor or nurse practitioner completes it, and it needs to state that you cannot work and roughly for how long, not your diagnosis. Second, get your **Record of Employment** — your employer files it electronically when your pay stops, and claims stall more on missing ROEs than on anything else. Third, **apply online at Canada.ca immediately**, even if the ROE has not landed yet; you can submit the application and the paperwork can follow.',
          'The timing rule that costs people real money: apply within four weeks of your last day worked. Wait longer and you can permanently lose benefit weeks, because claims are not backdated indefinitely. Applying is free, decisions usually arrive within a few weeks, and payments continue only while you file your biweekly reports — set a reminder, because a missed report pauses everything.',
          'If your employer has a short-term disability plan, it usually replaces EI for the early weeks (often at a better rate) — check which applies to you before filing, because the sequencing differs plan to plan. The [stress-leave guide](/guides/stress-leave-bc) covers how the job-protection side runs alongside all of this.',
        ],
      },
      {
        h2: 'Where therapy fits inside the 26 weeks',
        body: [
          'A sickness claim expects you to be doing something about getting better — and counselling is a normal, recognisable part of that picture, alongside whatever your doctor prescribes. Practically, the leave is also the first time many people have the daytime hours and the reduced load that make weekly therapy feasible at all. Using some of the 26 weeks to actually treat the thing that caused them is the difference between a leave that resets you and one that merely postpones the same collapse.',
          'The money question answers itself better than expected: MSP does not cover private counselling, but extended health benefits **usually continue during an EI sickness leave** while you remain employed — check that your plan stays active, because most do. That means the [coverage you already have](/resources/bc-extended-health-coverage-for-counselling) still reimburses Registered Clinical Counsellor sessions while your income is at 55%. The [low-cost options](/resources/low-cost-counselling-bc) exist for when it does not.',
          'And a sequencing point from the other side of the desk: do not wait until week 20 to start. Return-to-work conversations begin before the benefits end, and arriving at them with three months of therapy behind you is a different negotiation than arriving with none — the [return-to-work guide](/guides/return-to-work-after-a-mental-health-leave) covers that stretch.',
        ],
      },
      {
        h2: 'The gaps people fall into',
        list: [
          { label: 'The 40% who go back too early', detail: 'Money pressure at 55% income pushes people back before the certificate says so. Talk to your doctor about a gradual return instead — EI has working-while-on-claim rules that let partial earnings and partial benefits coexist, which beats a cold-turkey return that fails.' },
          { label: 'Assuming the employer plan and EI stack', detail: 'They generally do not — short-term disability usually displaces EI rather than topping it up. One phone call to your plan administrator settles which regime you are in.' },
          { label: 'The 26 weeks ending before you are well', detail: 'If you are still unable to work when sickness benefits exhaust, the routes are your employer’s long-term disability plan, CPP disability for prolonged conditions, and provincial supports. That transition is exactly when a paper trail of treatment — including counselling — matters most.' },
          { label: 'Nobody tells your benefits they exist', detail: 'EI does not notify your extended health plan, your STD insurer, or anyone else. Every program in this picture only knows what you file with it.' },
        ],
      },
    ],
    midCta: {
      text: 'If the leave is happening either way, using part of it for the actual work is the point. A free 15-minute consultation fits inside any week of the 26.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'How much does EI sickness pay in 2026?', a: '55% of your average insurable weekly earnings, to a maximum of $729 a week, taxable, for up to 26 weeks, after a one-week unpaid waiting period. For most full-time earners that is a substantial cut, and budgeting for it before the leave starts is part of the leave.' },
      { q: 'Can I get EI sickness benefits for burnout or anxiety?', a: 'Yes — the program does not distinguish mental from physical health. What matters is a medical practitioner certifying you are unable to work. "Burnout" itself is not the certified condition; the depression, anxiety disorder or adjustment disorder underneath it typically is.' },
      { q: 'Do I need to be seeing a therapist to keep my claim?', a: 'There is no rule requiring therapy specifically, but a sickness claim assumes you are under care and following treatment — and for a mental-health leave, counselling is a normal part of what that looks like. It also matters practically: return-to-work and any long-term disability transition go very differently with a treatment record than without one.' },
      { q: 'Does my extended health coverage continue while I am on EI sickness?', a: 'Usually yes while you remain employed and on an approved leave — which means your plan still reimburses RCC counselling while your income is reduced. Confirm with your plan administrator rather than assuming, and check whether premiums need to be kept up during the leave.' },
      { q: 'What happens if 26 weeks is not enough?', a: 'The routes beyond EI are your employer’s long-term disability plan if one exists, CPP disability for severe and prolonged conditions, and provincial assistance. Each has its own test and its own paperwork, and each is easier to satisfy with a documented history of treatment during the EI period.' },
    ],
    sources: [
      { label: 'Government of Canada — EI sickness benefits', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' },
      { label: 'Province of BC — leaves of absence under the Employment Standards Act', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC — the full picture' },
      { href: '/guides/doctors-note-for-a-mental-health-leave', label: 'Getting the doctor’s note' },
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Return to work after a leave' },
      { href: '/resources/bc-extended-health-coverage-for-counselling', label: 'Extended health coverage for counselling' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
    ],
  },

  {
    slug: 'doctors-note-for-a-mental-health-leave',
    figure2: 'bc-support-routes',
    figure: 'session-requirements',
    title: 'Getting a doctor’s note for a mental-health leave in BC',
    metaTitle: 'Doctor’s Note for Stress Leave in BC | Westpeak',
    metaDescription:
      'How to ask a BC doctor for a mental-health leave note, what it should and should not say, what your employer may ask, and what to do without a family doctor.',
    eyebrow: 'Guide · Work & money',
    lede:
      'The whole leave usually hinges on one short appointment most people walk into unprepared — and walk out of having minimised everything they came to say.',
    shortAnswer:
      'A mental-health leave in BC runs on a medical certificate from a doctor or nurse practitioner stating that you are unable to work and for roughly how long. It does not need to name your diagnosis, and your employer is not entitled to one — they may ask for reasonably sufficient proof of illness, which the note itself is. The honest preparation for the appointment is a plain account of symptoms and function: sleep, concentration, mood, what work currently does to you. Understatement is the main failure mode; doctors certify what they are shown.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'What the note actually needs to say — and what it must not',
        body: [
          'A workable certificate is short: the practitioner confirms you have a medical condition that makes you unable to work, states an expected duration or review date, and — where relevant — any functional limitations. That is the whole document. **It does not need your diagnosis**, and the better ones deliberately omit it.',
          'The privacy line matters and is worth knowing cold: in BC, an employer may require "reasonably sufficient proof" that you are entitled to sick leave, and for longer absences may ask about prognosis and functional limitations — *when you might return, what you can and cannot do*. They are **not** entitled to your diagnosis, your therapy notes, or your file. A note that says "medical condition, unable to work, reassess in four weeks" answers everything an employer may properly ask.',
          'If HR pushes for more detail than that, the response is polite and firm: further medical information goes through the doctor, addressed to functional questions. For accommodation processes the employer can request more specific functional information — still function, still not diagnosis. The [return-to-work guide](/guides/return-to-work-after-a-mental-health-leave) covers that stage.',
        ],
      },
      {
        h2: 'The appointment: say the ugly version',
        body: [
          'The predictable failure in this appointment is composure. People spend years performing "fine" and then perform it at the exact moment a clinician needs the truth. A doctor cannot certify what they are not shown, and "I’m a bit stressed" reads as a bad month, not a leave.',
          'What helps is arriving with the plain account written down: how you are sleeping, whether you can concentrate, what your appetite and mood are doing, the Sunday-night dread, the crying in the car, the mistakes at work you are covering for, how long it has been going on. Concrete, functional, unminimised. If mornings are the worst and the appointment is at 2 pm, say what mornings are like rather than reporting from the temporary plateau.',
          'It is also allowed — and often useful — to name the ask directly: "I think I need time off work, and I want your honest read." Doctors handle this conversation constantly; in a province where roughly one in five ESA sick-leave conversations is mental-health-shaped, you are not presenting anything unusual. If the doctor recommends treatment alongside the leave — medication, counselling, both — that recommendation is part of what makes the leave do its job, not a hoop. If it would help to hand something over rather than explain it, there is a [one-page summary written for that appointment](/refer/doctor).',
        ],
      },
      {
        h2: 'No family doctor? The BC routes that still work',
        list: [
          { label: 'A nurse practitioner', detail: 'NPs can complete medical certificates including EI medical certificates. If you are attached to an NP-led clinic, that is a full solution, not a workaround.' },
          { label: 'Urgent and Primary Care Centres', detail: 'BC’s UPCCs see unattached patients, and a mental-health presentation that is affecting your ability to work is a legitimate visit. Bring the same written account; continuity matters less than the assessment.' },
          { label: 'Walk-in and virtual clinics', detail: 'A telehealth or walk-in physician can certify a leave, though some prefer a shorter initial duration with review. For a longer leave, one consistent clinician re-certifying beats a chain of one-off notes.' },
          { label: 'The Health Connect Registry', detail: 'The waitlist for attachment is long — join it anyway, because a longer leave, EI paperwork, and any disability transition all get materially easier with one ongoing practitioner.' },
        ],
      },
      {
        h2: 'After the note',
        body: [
          'Tell your employer in writing that you are on a medical leave and attach or offer the certificate — you do not owe an explanation beyond it, and most people say too much in this message rather than too little. Then the machinery starts: the first five days in a calendar year are paid under the Employment Standards Act once you have 90 days’ service, and beyond that you are into your employer’s short-term disability plan or [EI sickness benefits](/guides/ei-sickness-benefits-and-therapy), which have their own clock and their own paperwork.',
          'Keep copies of everything, diarise the review date, and — the step this site would say, but it is also the step the leave exists for — use some of the time for treatment rather than only for distance from the inbox. Distance treats the symptom; the [stress-leave guide](/guides/stress-leave-bc) is blunt about the return being the part nobody plans.',
        ],
      },
    ],
    midCta: {
      text: 'If part of what you need to show your doctor is that treatment is in place, a free 15-minute consultation is a concrete first entry in that record.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Does my employer have to accept a doctor’s note for stress leave?', a: 'BC employers may require reasonably sufficient proof of entitlement to sick leave, and a medical certificate is exactly that proof. They are not entitled to your diagnosis, and the ESA’s job-protected illness leave plus the Human Rights Code’s duty to accommodate sit behind a certified medical absence.' },
      { q: 'Will the note say I have a mental illness?', a: 'It should not, and you can ask the doctor to keep it functional: medical condition, unable to work, expected duration. Diagnosis stays between you and your clinicians; employers deal in function and timelines.' },
      { q: 'Can a walk-in doctor or telehealth appointment give me a leave note?', a: 'Yes. Any physician or nurse practitioner can certify a medical absence, including virtually. For longer leaves, a consistent clinician who can re-certify at review dates works better than a series of unconnected notes — a UPCC or one virtual clinic used consistently gets you most of that.' },
      { q: 'What if the doctor says no?', a: 'Usually it is not a refusal of you but of what they were shown — the composed version. Go back with the written, functional account, or ask directly what they would need to see. A second opinion is always available, and so is starting with a shorter certified period plus a review date.' },
      { q: 'Do I need a separate note for EI?', a: 'EI sickness benefits require their own medical certificate confirming you are unable to work and for approximately how long. Get it at the same appointment — walking out with both documents saves a second visit and a lost week.' },
    ],
    sources: [
      { label: 'Province of BC — paid and unpaid sick leave', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'Government of Canada — EI sickness benefits: medical certificate', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness.html' },
      { label: 'BC Office of the Human Rights Commissioner', url: 'https://bchumanrights.ca/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC — the full picture' },
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/guides/return-to-work-after-a-mental-health-leave', label: 'Return to work after a leave' },
      { href: '/guides/sick-days-and-mental-health-days-bc', label: 'Sick days and mental-health days in BC' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
      { href: '/refer/doctor', label: 'A one-page summary to take to your doctor' },
    ],
  },

  {
    slug: 'return-to-work-after-a-mental-health-leave',
    figure2: 'window-of-tolerance',
    figure: 'four-decisions',
    title: 'Returning to work after a mental-health leave',
    metaTitle: 'Return to Work After a Mental-Health Leave | Westpeak',
    metaDescription:
      'Gradual returns, accommodations, and the BC duty-to-accommodate — how to go back after a mental-health leave without rebuilding the collapse you left.',
    eyebrow: 'Guide · Work & money',
    lede:
      'The leave has an end date. The condition does not check the calendar — which is why the return is where a good leave either consolidates or unravels.',
    shortAnswer:
      'A return that holds is usually gradual, negotiated, and honest about what caused the leave. In BC, an employer has a duty under the Human Rights Code to accommodate a mental-health disability to the point of undue hardship — which in practice supports graduated hours, modified duties, and changes to the specific conditions that broke you. The functional questions belong in a return-to-work plan from your doctor; your diagnosis still belongs to you. And the least-discussed truth: returning to an unchanged situation at full speed is how second leaves happen.',
    updated: '2026-08-28',
    readMinutes: 7,
    sections: [
      {
        h2: 'The mistake built into most returns',
        body: [
          'The standard return is binary: fully off, then — one Monday — fully on. Nothing about recovery works that way. Stamina, concentration and stress tolerance come back on a slope, not a switch, and a full-speed Monday spends in one week the reserves the whole leave built.',
          'The alternative is boringly effective: a **graduated return-to-work plan** — reduced days or hours stepping up over several weeks, agreed in writing, with a review point. Doctors write these routinely, insurers and EI both have mechanisms that support partial returns, and BC employers accommodate them because the alternative conversation involves the Human Rights Code. If your workplace treats "graduated" as exotic, that is information about the workplace.',
          'The second mistake is returning to an unchanged situation. If the leave was caused or accelerated by specific conditions — a workload, a manager, an on-call rotation, a harassment situation — a return that restores everything exactly as it was is a return *to the cause*. Some of that is negotiable through accommodation; some of it becomes a decision about the job itself, which is its own piece of work and a legitimate topic for counselling rather than a failure of it.',
        ],
      },
      {
        h2: 'What you can ask for — the duty to accommodate, plainly',
        list: [
          { label: 'Graduated hours', detail: 'The most common and most granted: part days or part weeks stepping up to full time over an agreed period. Put the schedule and the review date in writing.' },
          { label: 'Modified duties or workload', detail: 'Temporary removal of specific stressors — an account, a rotation, an on-call schedule — while capacity rebuilds. Framed functionally by your doctor: "should not work extended hours or overnight call for eight weeks" travels better than any explanation.' },
          { label: 'Changes to the reporting relationship', detail: 'Harder, and sometimes the real issue. Where the difficulty is a specific interpersonal situation, accommodation discussions can include supervision changes — and where they cannot, that fact clarifies the larger decision.' },
          { label: 'Schedule shape', detail: 'Later starts while sleep recovers, protected lunch, no meetings before ten — small on paper, load-bearing in practice, and exactly the kind of functional limitation a note can specify.' },
          { label: 'The limit', detail: 'Accommodation runs to the point of undue hardship, not to any preference. Small employers genuinely cannot restructure everything; the duty is real and it is also not unlimited. Knowing both keeps the negotiation honest.' },
        ],
      },
      {
        h2: 'The private side of the return',
        body: [
          'There is a version of the return nobody writes policies for: walking back in knowing that everyone knows you were away, deciding what to say, and meeting the colleague who covered your work. The workable script is short and rehearsed: "I was off for medical reasons, I’m glad to be back, I’m easing in over a few weeks." You owe context to no one, and the discomfort of the first week is mostly front-loaded — it decays faster than people fear.',
          'The more serious private work is watching your own early-warning signs with better instruments than last time. The leave taught you what your collapse looks like from inside; the return is where you get to notice the first Sunday-night dread, the first skipped lunch, the first week of five-hour sleeps — and respond at week one instead of month eight. This is precisely the stretch where continuing counselling through the return, not ending it at the return, earns its keep.',
          'And if the return teaches you that the job itself is the condition — that is a finding, not a failure. Working out what to do with that finding, with your finances and family and history on the table, is a counselling conversation this practice has constantly. The [stress-leave guide](/guides/stress-leave-bc) said the return is the part nobody plans; this page exists because planning it is possible.',
        ],
      },
    ],
    midCta: {
      text: 'The return is the highest-relapse stretch of the whole arc. Booking support through it — not just up to it — is the move the second leave never forgives you for skipping.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can my employer demand my diagnosis before I return?', a: 'No. They are entitled to functional information — what you can do, what limitations apply, the expected timeline — normally via your doctor in a return-to-work plan. Diagnosis remains private. Employers deal in function; clinicians hold the rest.' },
      { q: 'What is a graduated return-to-work plan?', a: 'A written schedule stepping from reduced hours or days back to full time over several weeks, with a review date. Your doctor sets the medical parameters, the employer accommodates them under the Human Rights Code, and both EI and most disability insurers have partial-return mechanisms that keep some income flowing during it.' },
      { q: 'What if my employer refuses to accommodate?', a: 'The duty to accommodate a disability — including a mental-health disability — is law in BC, to the point of undue hardship. Refusals get tested against that standard. Document the requests and responses, keep everything functional and in writing, and get advice: the Human Rights Clinic and the Employment Standards Branch are the public routes, before any lawyer.' },
      { q: 'Should I go back to the same job at all?', a: 'Sometimes the honest answer is no, and it deserves better than being decided in week one back, at your most financially anxious. A useful sequencing: return, stabilise, then decide from stability — unless the situation that broke you is intact and non-negotiable, in which case the decision may be the treatment.' },
      { q: 'How long after a leave do people stay in counselling?', a: 'Commonly through the return and a few months past it — the return is where the skills get load-tested. Tapering from weekly to biweekly to monthly through that stretch is a normal shape; ending everything on the same Friday the leave ends is the shape that fails.' },
    ],
    sources: [
      { label: 'BC Office of the Human Rights Commissioner', url: 'https://bchumanrights.ca/' },
      { label: 'Province of BC — leaves of absence under the Employment Standards Act', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC — the full picture' },
      { href: '/guides/ei-sickness-benefits-and-therapy', label: 'EI sickness benefits and therapy' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
      { href: '/guides/workplace-bullying-in-bc', label: 'Workplace bullying in BC' },
    ],
  },

  {
    slug: 'sick-days-and-mental-health-days-bc',
    figure2: 'bc-support-routes',
    figure: 'accountability-chain',
    title: 'Sick days and mental-health days in BC: what you’re actually entitled to',
    metaTitle: 'Sick Days & Mental Health Days in BC | Westpeak',
    metaDescription:
      'BC’s paid sick days cover mental health. How the 5 ESA days work, what proof an employer can ask for, and when a mental-health day is a signal, not a fix.',
    eyebrow: 'Guide · Work & money',
    lede:
      'There is no separate "mental-health day" in BC law — and there does not need to be, because the ordinary sick day already covers it. Most people just don’t know that.',
    shortAnswer:
      'BC’s Employment Standards Act gives most employees 5 paid sick days and 3 unpaid days per calendar year after 90 days of employment — and illness includes mental health. A day taken for anxiety, depression or a breaking point is as legitimate as one taken for the flu, your employer may ask for reasonably sufficient proof but not your diagnosis, and "I am unwell" is a complete sentence. The larger question this page also answers: when mental-health days keep being needed, they have stopped being days off and started being data.',
    updated: '2026-08-28',
    readMinutes: 6,
    sections: [
      {
        h2: 'The entitlement, without folklore',
        body: [
          'Since 2022, the BC Employment Standards Act provides employees with **5 paid sick days and 3 unpaid sick days per calendar year**, after 90 days with the employer. They cover personal illness or injury — and mental health is health in that sentence, without any asterisk. The days do not carry over, they are paid at an average day’s pay, and they belong to ESA-covered employees; federally regulated workers (banks, telecoms, airlines) are under the Canada Labour Code’s medical-leave provisions instead, and unionised or contract terms can only improve on the floor, not dig under it.',
          '"Reasonably sufficient proof" is the phrase doing the work on the employer side: they may ask for it, and for a day or two most reasonable employers ask for nothing. What they are never entitled to is your diagnosis or the content of your health information — a theme that runs through this whole cluster, from [the doctor’s note](/guides/doctors-note-for-a-mental-health-leave) to [the return](/guides/return-to-work-after-a-mental-health-leave).',
          'And the sentence itself: "I’m unwell and taking a sick day." Not "it’s just a headache", not a manufactured stomach bug to launder a panic attack into something that feels tellable. The legal entitlement does not require the illness to be visible, physical, or explained.',
        ],
      },
      {
        h2: 'Using a mental-health day so it actually works',
        body: [
          'A mental-health day spent doomscrolling in the same room as the laptop treats nothing. What the day is for, mechanically, is interrupting a stress cycle that has stopped self-interrupting: sleep that is actually sleep, daylight, movement, one honest conversation, and genuine distance from the inbox — which means notifications off, not merely "not replying".',
          'It is also a fair day for maintenance you have been deferring *because* of work: the doctor’s appointment, the first therapy consultation, the benefits phone call. One of the quiet findings from this practice’s side of the desk is how often the first-ever counselling session happens on a sick day — the entitlement buying the hour that the calendar never would.',
          'What a single day cannot do is treat an actual depressive episode, an anxiety disorder, or a burnout that has been building for a year. That is not a criticism of the day; it is a statement of dosage.',
        ],
      },
      {
        h2: 'When the days become data',
        list: [
          { label: 'You are rationing them by dread', detail: 'Choosing which weeks are survivable enough to skip the sick day is itself the signal. A sustainable job does not require triaging your own collapse.' },
          { label: 'The same day keeps recurring', detail: 'Monday-pattern or post-deadline-pattern sick days are a graph, and the graph is telling you what the cause is. Naming the pattern is more useful than hiding it.' },
          { label: 'Five days were gone by June', detail: 'When the annual allotment cannot cover the year, you are past the sick-day tool. The next tools are a proper assessment, possibly a [certified leave](/guides/stress-leave-bc), and treatment — in that order, before the involuntary version arrives.' },
          { label: 'The day off does not restore anything anymore', detail: 'Early in a stress cycle, a day genuinely resets. Late in one, it does not touch the sides — and that difference is one of the more reliable home tests for "tired" versus "something needing treatment". The burnout-vs-depression guide draws that line properly.' },
        ],
      },
    ],
    midCta: {
      text: 'If you are reading this to work out whether you are allowed to be as tired as you are — that is answerable in fifteen minutes, free, from your sofa.',
      label: 'Book a free consultation',
    },
    faqs: [
      { q: 'Can I take a sick day for mental health in BC?', a: 'Yes. The ESA’s paid sick days cover personal illness, and mental health is included without qualification. A day taken for anxiety or depression is as protected as one taken for the flu, and you do not have to disclose which it was.' },
      { q: 'How many paid sick days do BC employees get?', a: 'Five paid and three unpaid per calendar year under the Employment Standards Act, after 90 days of employment. They do not carry over. Federally regulated employees are under the Canada Labour Code instead, which provides up to ten paid medical days, and better contractual terms override both floors upward.' },
      { q: 'Does my employer need a doctor’s note for one mental-health day?', a: 'They may ask for reasonably sufficient proof, and for a single day most do not. If yours does, a simple medical note suffices — it never needs to state a diagnosis. A pattern of demanding notes for every single day is worth a conversation with the Employment Standards Branch.' },
      { q: 'Is a "mental-health day" different from a sick day?', a: 'Legally, no — BC has one sick-leave entitlement and mental health is inside it. Culturally the phrase does useful work, but do not let it create a second-class category in your head: you are not borrowing the real entitlement, you are using it.' },
      { q: 'What if I need more days than exist?', a: 'That is the signal to change tools: an honest medical assessment, the possibility of a certified leave with job protection, and treatment for whatever is consuming the days. The stress-leave guide covers the whole path, including the money.' },
    ],
    sources: [
      { label: 'Province of BC — paid sick leave', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
      { label: 'Canadian Mental Health Association, BC Division', url: 'https://cmha.bc.ca/' },
    ],
    related: [
      { href: '/guides/stress-leave-bc', label: 'Stress leave in BC — the full picture' },
      { href: '/guides/burnout-vs-depression', label: 'Burnout vs depression' },
      { href: '/guides/doctors-note-for-a-mental-health-leave', label: 'Getting the doctor’s note' },
      { href: '/guides/signs-it-might-be-time-for-therapy', label: 'Signs it might be time for therapy' },
      { href: '/resources/workplace-mental-health-bc', label: 'Workplace mental health in BC' },
    ],
  },
];

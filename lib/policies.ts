/* Trust-and-transparency pages: standards, editorial policy, privacy, accessibility.
 *
 * These are the pages a careful reader checks before booking, and the pages a
 * search engine reads to decide whether a health site is accountable to anyone.
 * They are deliberately specific — a policy page that says nothing checkable is
 * worth nothing.
 *
 * HARD RULE: the counsellor's personal name never appears here. */

/* HOW PRIVATE THE VIDEO IS, STATED ONCE — 1 Oct 2026.
 *
 * The /privacy paragraph below is the practice's one statement of where
 * records live and what happens to a session. /online-counselling, the city
 * hubs and /pricing now repeat it, and they read this constant rather than a
 * copy, so the claim on a money page cannot drift from the privacy policy.
 * The markdown form is the policy's; the plain form is for pages that do not
 * render markdown and for FAQPage text. */
export const SESSION_SECURITY_MD =
  'Bookings and client records are held in **Cliniko**, the practice’s booking and records system, in an account on Cliniko’s Canadian region. Records are encrypted and access-controlled. Sessions are by secure video: the link arrives by email and opens in your browser, with nothing to install. Sessions are **never recorded**, not for notes, not for supervision, not for training.';
export const SESSION_SECURITY = SESSION_SECURITY_MD.replace(/[*][*]/g, '');

export type PolicySection = {
  h2: string;
  body?: string[];
  list?: { label: string; detail: string }[];
};

export type Policy = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  lede: string;
  updated: string;
  sections: PolicySection[];
  figure?: string;
  /* A second diagram, placed further down. Policy documents are the longest
     continuous prose on the site; one drawing does not carry 1,800 words. */
  figure2?: string;
  sources?: { label: string; url: string }[];
  related: { href: string; label: string }[];
};

export const policies: Record<string, Policy> = {
  standards: {
    slug: 'standards',
    figure: 'accountability-chain',
    figure2: 'designations-bc',
    title: 'Standards, ethics and accountability',
    metaTitle: 'Standards & Accountability | Westpeak Wellness',
    metaDescription:
      'The registration, ethical code, scope limits and complaints route this practice works under, and how to verify any of it yourself.',
    eyebrow: 'Trust and transparency',
    lede:
      'Anyone in British Columbia can call themselves a counsellor. This page sets out what this practice is actually accountable to, and how you can check it without taking anyone at their word.',
    updated: '2026-10-01',
    sections: [
      {
        h2: 'The registration behind the practice',
        body: [
          'Sessions at Westpeak Wellness are provided by a **Registered Clinical Counsellor (RCC)**, a designation held through the [BC Association of Clinical Counsellors](https://bcacc.ca/), which requires a master\'s degree in counselling or a closely related field, supervised clinical hours, continuing education, professional liability insurance, and adherence to a published code of ethics.',
          'The important part is not the letters. It is that the letters come with somewhere to complain. An RCC who behaves unethically can be investigated and can lose the designation. Someone using the unprotected word "counsellor" cannot lose anything, because there is nothing to lose.',
          'You can verify any RCC\'s standing directly through the BCACC register. You do not need permission to do that, and you should do it before booking with anybody, here or anywhere else.',
        ],
      },
      {
        h2: 'What is changing in BC regulation',
        body: [
          'The **Health Professions and Occupations Act** has been in force in British Columbia since 1 April 2026. Under it, **psychotherapy becomes a regulated profession on 29 November 2027**, licensed by the **College of Health and Care Professionals of BC**, the same regulator that already oversees psychologists and several other professions. From that date there is a statutory complaints process, and **"psychotherapist" is the protected title**: only someone licensed by the College may use it.',
          '**"Counsellor" stays unprotected**, before and after that date, as does "counselling therapist". Anyone may still call themselves a counsellor, which is why the question to ask is not what someone is called but who they answer to.',
          'Until 29 November 2027, the association route, the RCC designation and the BCACC code of ethics, is the accountability structure that actually exists. This practice intends to seek licensure with the College when it opens, and this page will be updated when that happens rather than quietly changed.',
          'If you want the fuller picture of what the different designations mean in practice, the [comparison of RCC, psychologist and social worker](/compare/rcc-vs-psychologist-vs-social-worker-bc) sets them side by side.',
        ],
      },
      {
        h2: 'Scope of practice, what this practice does not do',
        body: [
          'A page that only lists what a practice offers is only half the information. These are the deliberate limits:',
        ],
        list: [
          { label: 'No diagnosis', detail: 'A Registered Clinical Counsellor does not diagnose mental disorders. If you need a formal diagnosis, for a disability claim, an accommodation, a medication decision. That requires a physician, psychiatrist or registered psychologist.' },
          { label: 'No prescribing', detail: 'Counsellors do not prescribe or adjust medication. Where medication is part of the picture, the work runs alongside your prescriber rather than instead of them.' },
          { label: 'No formal psychological assessment', detail: 'Psychoeducational assessments, ADHD or autism assessments, and cognitive testing all require a registered psychologist. This practice can point you toward the right assessor.' },
          { label: 'No court-ordered or forensic work', detail: 'This practice does not conduct custody evaluations, parenting assessments, or any assessment intended for use as evidence. Mixing a therapeutic relationship with an evaluative one damages both.' },
          { label: 'Not a crisis service', detail: 'Sessions are scheduled. There is no 24-hour on-call line. If you are in immediate danger, call 9-1-1; for urgent mental-health support call or text 9-8-8, or reach BC Mental Health Support at 310-6789, any hour, no area code needed.' },
          { label: 'Not a fit for every presentation', detail: 'Active psychosis, an eating disorder needing medical monitoring, or a substance dependence needing withdrawal management are better served by a specialised team. Saying so during the free consultation is a normal outcome, not a rejection.' },
        ],
      },
      {
        h2: 'The ethical commitments that shape sessions',
        list: [
          { label: 'Informed consent is ongoing', detail: 'You are told what an approach involves and what it may stir up before it starts, and you can decline or stop any intervention at any point without having to justify it.' },
          { label: 'Confidentiality, and its real limits', detail: 'What you say stays in the room, with the legally required exceptions: risk of serious harm to yourself or an identifiable other, suspected abuse or neglect of a child or vulnerable adult, and a court order. These are named in writing before the first session, not discovered later.' },
          { label: 'No dual relationships', detail: 'Counsellors do not take on clients they have another significant relationship with: social, business, or otherwise, because the second relationship compromises the first.' },
          { label: 'Cultural humility over cultural expertise', detail: 'Shared language and shared context help, but they are not the same as knowing your family. Assumptions get checked out loud rather than acted on.' },
          { label: 'No guarantees, ever', detail: 'Counselling that promises a result is misrepresenting itself. What can honestly be offered is a method with evidence behind it, applied carefully, reviewed openly, and changed when it is not working.' },
        ],
      },
      {
        h2: 'If something goes wrong',
        body: [
          'The first route is the simplest one: say so in session. A counsellor who cannot hear that something is not working is not doing the job. Plans get changed, approaches get dropped, and a referral elsewhere is always an available answer.',
          'If that is not possible or not enough, you can raise a concern directly with the **BC Association of Clinical Counsellors**, which administers a complaints process independent of any individual counsellor. You do not need the counsellor\'s agreement or knowledge to do that.',
          /* 1 Oct 2026: the route made concrete, from BCACC’s own complaints page
             read that day. Each counsellor’s profile links back to this section. */
          'A complaint about an RCC goes to BCACC, not to this practice, and the practice does not stand between you and BCACC.BCACC’s [complaints and investigations page](https://bcacc.ca/complaints-and-investigations/) sets out how to file. The process runs mostly in writing, BCACC shares the complaint with the counsellor, and the counsellor must respond to BCACC in writing. It covers incidents within the last five years. To confirm a counsellor is an RCC before you file, or at any time, search the [RCC Register](https://bcacc.ca/search-our-member-register/) by name or registration number.',
          'If any part of this site or of a session is unusable with your assistive technology, the [accessibility statement](/accessibility) sets out what has been tested and what has not, and how to report a problem. For privacy-specific concerns: how your information was collected, used, stored or disclosed, the **Office of the Information and Privacy Commissioner for British Columbia** oversees private-sector organisations under the Personal Information Protection Act. See the [privacy page](/privacy) for how information is handled here.',
        ],
      },
      {
        h2: 'Advertising standards this site is held to',
        body: [
          'Counselling advertising in BC is governed by the same ethical code as the clinical work. In practice that rules out a set of things this site will never do, whatever the marketing benefit:',
        ],
        list: [
          { label: 'No testimonials or reviews', detail: 'Soliciting testimonials from current or former counselling clients is prohibited under BCACC advertising standards, because a person in a therapeutic relationship cannot give uncoerced consent to be used as marketing. You will find none on this site, not because there is nothing good to say, but because publishing it would be unethical. [What this practice publishes instead of reviews](/reviews), and the reasoning behind it, is set out in full.' },
          { label: 'No invented case studies', detail: 'Composite or fictional client stories presented as real are misrepresentation. Where this site describes what tends to come up, it is describing patterns, not people.' },
          { label: 'No outcome claims', detail: 'No success rates, no "proven results", no before-and-after framing. Nothing on this site claims to cure, fix or guarantee.' },
          { label: 'No fear-based urgency', detail: 'No countdown offers, no scarcity language, no implication that delay will make things worse. If a page pressures you, it is selling rather than informing.' },
          { label: 'Sources you can check', detail: 'Where a page makes a factual claim about research, coverage or regulation, it links the primary source so you can read it yourself and disagree.' },
        ],
      },
    ],
    sources: [
      { label: 'BC Association of Clinical Counsellors, code of ethics and standards of clinical practice', url: 'https://bcacc.ca/about-bcacc/code-of-ethical-conduct/' },
      { label: 'College of Health and Care Professionals of BC, regulating psychotherapy', url: 'https://chcpbc.org/legislation/regulating-psychotherapy/' },
      { label: 'BC Government, Regulation of Psychotherapy Q&A (updated 27 August 2026)', url: 'https://www2.gov.bc.ca/assets/gov/health/practitioner-pro/professional-regulation/psychotherapy_qa.pdf' },
      { label: 'Office of the Information and Privacy Commissioner for BC', url: 'https://www.oipc.bc.ca/' },
    ],
    related: [
      { href: '/about', label: 'About the practice' },
      { href: '/privacy', label: 'Privacy and records' },
      { href: '/editorial-policy', label: 'How these pages are written' },
      { href: '/accessibility', label: 'Accessibility: what is tested and what is not' },
      { href: '/compare/rcc-vs-psychologist-vs-social-worker-bc', label: 'RCC vs psychologist vs social worker' },
      { href: '/faq', label: 'Common questions' },
    ],
  },

  'editorial-policy': {
    slug: 'editorial-policy',
    figure: 'editorial-process',
    figure2: 'accountability-chain',
    title: 'How these pages are written and reviewed',
    metaTitle: 'Editorial Policy | Westpeak Wellness',
    metaDescription:
      'Who writes the guides on this site, what counts as a source, how often pages are reviewed, and what this site will never publish.',
    eyebrow: 'Trust and transparency',
    lede:
      'This site publishes guides about mental health, which means it can do harm if it is careless. Here is the standard it holds itself to, so you can judge whether it meets it.',
    updated: '2026-10-01',
    sections: [
      {
        h2: 'Who writes and reviews this content',
        body: [
          'Every clinical page on this site. The services, the guides, the comparisons, the resource pages, is written and reviewed by a **Registered Clinical Counsellor** in independent practice in British Columbia. It is not outsourced to a content agency, and it is not published without clinical review.',
          'One exception, stated rather than hidden: twenty-five pages written in Tagalog are live and have not yet been read by a Tagalog speaker. They were published on the practice’s decision, and until that review happens they should be read alongside the English pages they correspond to.',
          'That is a statement about accountability, not authority. A counsellor writing about anxiety is not thereby correct about anxiety. The reason every substantive claim on this site carries a link to its source is so that the source, not the author, carries the weight.',
        ],
      },
      {
        h2: 'What counts as a source here',
        body: [
          'Sources are ranked, and the ranking is applied consistently:',
        ],
        list: [
          { label: 'Systematic reviews and meta-analyses first', detail: 'Where a body of research exists, this site cites the synthesis rather than the single trial that agrees with it. A pooled result across many studies is a far better guide than one striking finding.' },
          { label: 'Primary sources for facts about systems', detail: 'Anything about coverage, regulation, wait times or eligibility links to the body that actually sets it. A health authority, a regulator, a government page, not to another article summarising it.' },
          { label: 'No citing ourselves as evidence', detail: 'Internal links point to other pages for context, never as the support for a factual claim.' },
          { label: 'Nothing behind an unmarked paywall', detail: 'Where a cited paper is not freely readable, the page says so or links an open version, so a reader can actually check the claim.' },
          { label: 'Dates on everything', detail: 'Coverage rules, wait times and regulation change. Every page carries the date it was last changed, and a clinical-review date as well where one exists, so you can weigh how stale it might be. The two are different claims and are not merged.' },
        ],
      },
      {
        h2: 'How claims are worded',
        body: [
          'Mental-health writing fails most often in its verbs. "Therapy cures anxiety" and "therapy has been found to reduce anxiety symptoms in controlled trials" are different claims, and only one is defensible.',
          'This site tries to keep three distinctions visible: the difference between **what research shows on average across groups** and **what will happen to you**; the difference between **an approach with strong evidence for one problem** and **an approach that is good for everything**; and the difference between **describing a pattern** and **diagnosing a person**. Where the honest answer is "the evidence is mixed" or "nobody knows yet", the page says that instead of picking a side.',
          'Guides also state their trade-offs. A page about online therapy that lists only advantages is an advertisement wearing a guide\'s clothing.',
        ],
      },
      {
        h2: 'What this site will not publish',
        list: [
          { label: 'Client testimonials or reviews', detail: 'Prohibited under BCACC advertising standards, and for good reason, consent given inside a therapeutic relationship is not freely given. See [standards and accountability](/standards).' },
          { label: 'Fabricated case studies', detail: 'No invented clients, no composite characters presented as real people, no "one client I worked with" stories.' },
          { label: 'Self-diagnosis quizzes', detail: 'A ten-question widget cannot assess anyone, and dressing one up as a screening tool implies a precision that does not exist.' },
          { label: 'AI-generated clinical content published unreviewed', detail: 'Drafting tools may assist with structure or editing. No clinical claim reaches this site without being checked against its source by a person who is accountable for it.' },
          { label: 'Comparisons naming other practices', detail: 'Pages here compare approaches, designations and delivery formats. They do not name competing clinics or counsellors, because a marketing page is not a fair forum for that.' },
          { label: 'Keyword pages with nothing in them', detail: 'This site does not publish a page per city or per keyword because the phrase gets searched. The rule for a location page is that it must say something specific to that place, its routes to care, its distances, the questions people there actually ask, rather than a city name swapped into a template. When a page has nothing specific to say, it is folded into one that does.' },
        ],
      },
      {
        h2: 'Corrections',
        body: [
          'If something on this site is wrong. A broken fact, an out-of-date rule, a link that no longer supports the claim attached to it. The correct response is to fix it, and the practice would rather hear about it than not. Write to the address on the [contact page](/contact).',
          'Substantive corrections change the reviewed date on the page. Fixing a typo does not, because pretending a typo fix is a clinical review would make the dates meaningless.',
        ],
      },
      {
        h2: 'What this content is not',
        body: [
          'Nothing on this site is clinical advice, an assessment, or a diagnosis, and reading it does not create a counselling relationship. Guides are written to help you ask better questions and arrive at a first session better oriented, not to substitute for one.',
          'If you are in crisis, no page is the right resource. Call or text **9-8-8** anywhere in Canada, twenty-four hours a day, or reach **310-6789** for BC Mental Health Support without an area code. In immediate danger, call **9-1-1**.',
        ],
      },
    ],
    related: [
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/guides', label: 'All guides' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
      { href: '/about', label: 'About the practice' },
      { href: '/accessibility', label: 'Accessibility: how this site is tested' },
      { href: '/contact', label: 'Contact' },
    ],
  },

  privacy: {
    slug: 'privacy',
    figure: 'confidentiality-limits',
    figure2: 'accountability-chain',
    title: 'Privacy, confidentiality and your records',
    metaTitle: 'Privacy & Confidentiality | Westpeak Wellness',
    metaDescription:
      'What is collected, where session records are kept, the legal limits of confidentiality, and how this website handles your data, in plain language.',
    eyebrow: 'Trust and transparency',
    lede:
      'Two different things get called privacy: what happens to what you say in a session, and what happens to your data when you visit this website. Both are covered here, separately, because they work differently.',
    updated: '2026-10-01',
    sections: [
      {
        h2: 'Confidentiality in counselling, and its limits',
        body: [
          'What you bring to a session is confidential. It is not shared with your family, your employer, your doctor or your insurer without your written consent. Paying for a session with a benefits plan does not entitle the insurer to your clinical content. A receipt confirms that a session happened, not what was in it.',
          'There are legal exceptions, and they are the same for every counsellor in British Columbia. They are set out in writing before the first session so that nothing about them is a surprise later:',
        ],
        list: [
          { label: 'Risk of serious harm', detail: 'If there is a real and imminent risk of serious harm to you or to an identifiable other person, a counsellor is obligated to act, which may mean contacting emergency services or a named person.' },
          { label: 'A child or vulnerable adult at risk', detail: 'Suspected abuse or neglect of someone under nineteen must be reported to child protection under BC law. This duty applies to everyone in the province, not only to counsellors.' },
          { label: 'A court order or subpoena', detail: 'A court can compel the release of records. A counsellor can and will object where objection is appropriate, but cannot refuse a valid order.' },
          { label: 'Clinical supervision and consultation', detail: 'Counsellors consult on their work as a condition of good practice. Where that happens, identifying details are removed, and the consultant is bound by the same confidentiality.' },
        ],
      },
      {
        h2: 'What is collected, and why',
        list: [
          { label: 'Contact and identifying information', detail: 'Name, email, phone, and the region of BC you are in. The last because a counsellor must know which jurisdiction a client is physically in during a session.' },
          { label: 'Intake information', detail: 'Relevant history, current concerns, medications, and safety information. Collected because working without it is working blind.' },
          { label: 'Session records', detail: 'Brief clinical notes recording what was worked on and what was planned. Notes are working documents, not transcripts.' },
          { label: 'Payment records', detail: 'Amounts, dates and receipts, kept because tax and professional standards require it. Full card numbers are never stored by the practice.' },
          { label: 'Nothing collected "just in case"', detail: 'If information is not needed to provide the service or to meet a legal obligation, it is not asked for.' },
        ],
      },
      {
        h2: 'Where records live and how long they are kept',
        body: [
          SESSION_SECURITY_MD,
          'Records are retained for the period required by professional standards and applicable law, then securely destroyed. You are entitled to ask how long your specific file will be kept, and to receive that answer in writing.',
          'Anything sent through a form on this website. A message, or a request for a guide, is held separately from clinical records and is **deleted automatically after 24 months**. That is a fixed period rather than a judgement call: the purpose it was collected for is answering you, and that purpose expires. Two years leaves room for someone who enquired, waited and came back, which is a real pattern, without the practice quietly accumulating an archive of what people wrote before they had met anyone.',
          'You have the right to request access to your own records and to request correction of factual errors in them. Requests go to the address on the [contact page](/contact). Where a portion of a file cannot be released, for example, because it contains information about another person. You are told that, and told why.',
        ],
      },
      {
        h2: 'What this website itself collects',
        body: [
          'It is worth being specific, because "we value your privacy" is not information. This is the whole list, and each line describes something the site’s own code does:',
        ],
        list: [
          { label: 'No advertising or tracking pixels', detail: 'There is no Meta pixel, no Google Ads remarketing tag, and no third-party advertising script anywhere on this site.' },
          { label: 'No cookies unless you sign in', detail: 'Browsing this site sets no cookies, so there is no consent banner to dismiss. A banner that exists only to be clicked away is theatre. Signing in to the client portal does set one session cookie, because that is what keeps you signed in; it is removed when you sign out.' },
          { label: 'Fonts are served from this site, not from Google', detail: 'The typefaces are copied into the site when it is built and served from this site’s own address. An ordinary page here loads nothing from another company, so nothing reports your visit to a third party by loading an asset. The one exception is the booking calendar, below.' },
          { label: 'The booking calendar loads only when you open it', detail: 'The calendar on /book is Cliniko’s booking page. It is not loaded until you press the button to open it, and when you do, it loads from Cliniko, which in turn loads Stripe (for the card details on a paid booking) and Google Fonts. Those requests are made by your browser to those companies, under their terms as well as this practice’s obligations.' },
          { label: 'Forms go to the practice, not to a form processor', detail: 'The message and checklist forms are handled by this site. What you write is stored privately with the site’s host, Vercel, so that it cannot be lost if an email fails to send, and the practice is notified by email through Resend, its email-sending service. There is no third-party form service holding a copy. It is visible only to the practice and is not used for anything else.' },
          { label: 'Page actions are counted, not logged', detail: 'When someone presses a booking button, opens the calendar, sends a form, finishes one of the tools, or arrives from an AI assistant or from the practice’s Google Business Profile listing, the site adds one to a tally: the kind of action, the page it happened on, and at most one detail from a fixed list (which counsellor’s button, which position on the page, what a tool concluded, which kind of AI assistant). No IP address, no cookie, no time of the individual action, and nothing that joins two actions to the same person.' },
          { label: 'Google Analytics only if you agree, and it is currently off', detail: 'Google Analytics is not running on this site. If it is ever switched on, a banner asks first, with two equal buttons; nothing from Google loads until you choose to allow it, and your choice is kept in your own browser rather than sent anywhere.' },
          { label: 'Search terms are counted, not logged', detail: 'When the site’s search box is used, the term is added to a tally. The word, and how many times it has been submitted. No timestamp, no IP address, no session, and nothing that connects two searches to the same person. There is no record that any particular search happened, only that a term has been used some number of times, and anything long enough to be a sentence rather than a search term is discarded instead of counted.' },
          { label: 'Standard server logs', detail: 'The hosting provider, Vercel, records ordinary request data: IP address, time, page, user agent: as every web server does. It is used for security and reliability, not for profiling, and it is not combined with any clinical record.' },
        ],
      },
      {
        h2: 'Scheduling and third parties',
        body: [
          'Booking a consultation is handled through Cliniko, and the information you enter there, your name, email and chosen time, is held by Cliniko under its own privacy terms as well as this practice\'s obligations. Only what is needed to schedule the appointment is requested at that stage. Clinical information is never collected through a booking form.',
          'Where any third-party service is used, it is chosen on the basis that it can meet the privacy obligations that apply to a BC health professional, and it is named rather than hidden behind "our partners". These are all of them:',
        ],
        list: [
          { label: 'Cliniko', detail: 'Booking, client records, session notes, receipts and Cliniko’s own booking confirmation. This practice’s account is on Cliniko’s Canadian region.' },
          { label: 'Stripe', detail: 'Card payments, entered inside Cliniko’s booking page. The practice never sees or stores a full card number.' },
          { label: 'Vercel', detail: 'Hosts this website, and stores what the site needs to run: what is sent through its forms, the counts described above, and a record of which emails have been sent so none is sent twice.' },
          { label: 'Resend', detail: 'Sends the email that comes from the practice’s own address rather than from Cliniko: booking confirmations and reminders with the session links, the checklist and its two follow-ups if you asked for one, client-portal sign-in messages, and the notice to the practice that a form was sent.' },
          { label: 'Google', detail: 'Only through the booking calendar’s fonts, and Google Analytics only if it is ever switched on and you agree to it.' },
        ],
      },
      {
        h2: 'Your rights, and where to complain',
        body: [
          'In British Columbia, private organisations handling personal information are governed by the **Personal Information Protection Act (PIPA)**. Under it you have the right to know what personal information is held about you, to access it, to request correction, and to withdraw consent to further collection or use, recognising that withdrawing consent may make it impossible to continue providing the service.',
          'You can also ask for anything you sent through this website to be erased before the 24 months are up, and it will be, every message from your address, not only the one you happen to remember. Write to the address on the [contact page](/contact) and say so; you will be told when it is done. This is deliberately a request to a person rather than a button on this site: a self-service delete would have to confirm whether an address is in the system before removing it, and on a counselling website confirming that somebody wrote in is itself a disclosure. One available to anyone who could guess an address.',
          'Clinical records are the exception, and not a discretionary one. Once counselling has begun, a counsellor is required by professional standards to keep the file for a set period; it cannot be erased on request, and anyone who tells you otherwise is describing a different kind of service. Erasure here means website enquiries.',
          'If you believe your information has been mishandled, you can raise it with the practice directly, and you can complain independently to the **Office of the Information and Privacy Commissioner for British Columbia**. You do not need this practice\'s agreement to do so.',
        ],
      },
    ],
    sources: [
      { label: 'Personal Information Protection Act (British Columbia)', url: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03063_01' },
      { label: 'Office of the Information and Privacy Commissioner for BC', url: 'https://www.oipc.bc.ca/' },
      { label: 'BC child protection, duty to report', url: 'https://www2.gov.bc.ca/gov/content/safety/public-safety/protecting-children/reporting-child-abuse' },
    ],
    related: [
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/faq', label: 'Common questions' },
      { href: '/book', label: 'Book a free consultation' },
      { href: '/contact', label: 'Contact' },
      { href: '/guides/what-to-expect-first-therapy-session', label: 'What happens in a first session' },
    ],
  },

  accessibility: {
    slug: 'accessibility',
    figure: 'session-requirements',
    title: 'Accessibility of this site and of sessions',
    metaTitle: 'Accessibility | Westpeak Wellness',
    metaDescription:
      'How this website is built for assistive technology, and the practical accommodations available in sessions, including what this practice cannot yet do.',
    eyebrow: 'Trust and transparency',
    lede:
      'Accessibility statements are usually written to be filed rather than read. This one names what has actually been done, and what has not.',
    updated: '2026-10-01',
    sections: [
      {
        h2: 'How this website is built',
        list: [
          { label: 'Keyboard navigable throughout', detail: 'Every link, button and expandable section can be reached and operated without a mouse, with a visible focus outline that is never removed for aesthetics.' },
          { label: 'A skip link on every page', detail: 'The first thing a keyboard or screen-reader user reaches is a link that jumps past the navigation straight to the main content.' },
          { label: 'Real headings in real order', detail: 'One H1 per page, no skipped levels, and headings used for structure rather than for making text bigger, which is what lets a screen reader offer a usable outline of the page.' },
          { label: 'Text alternatives for every diagram', detail: 'Each illustration on this site carries a written description of what the diagram shows, not a restatement of its caption. The description is stored with the artwork itself so the two cannot drift apart.' },
          { label: 'Contrast and text sizing', detail: 'Body text is deliberately larger than the web default, colour is never the only way information is conveyed, and text reflows rather than breaking when you zoom.' },
          { label: 'Motion is opt-out by default', detail: 'The site honours the operating-system "reduce motion" setting, and there is no autoplaying video, carousel or animation to disable in the first place.' },
          { label: 'Wide diagrams scroll rather than shrink', detail: 'On a phone, a wide diagram scrolls sideways inside its own box at a readable size instead of being squeezed until its labels are illegible. The page itself never scrolls sideways.' },
          { label: 'Fast on a slow connection', detail: 'Pages are prerendered HTML. The only third-party code is the booking calendar, which loads on /book when you ask for it, and Google Analytics, which loads only if you consent. That matters most on rural and mobile connections, a meaningful accessibility issue in much of British Columbia.' },
        ],
      },
      {
        h2: 'Accommodations in sessions',
        list: [
          { label: 'Camera off', detail: 'You are never required to be on camera to be in a session. It suits camera fatigue, lower bandwidth, and anyone who thinks better without being watched.' },
          { label: 'Sessions in Punjabi', detail: 'Working in the language you think in is an access issue, not a preference. Savneet Singh works in Punjabi. See [Punjabi counselling](/services/punjabi-counselling).' },
          { label: 'Sessions in Tagalog', detail: 'The same holds for Tagalog: Camille Granda works in Tagalog and English. See [Tagalog-speaking counselling](/tagalog-counselling).' },
          { label: 'Pacing and breaks', detail: 'Sessions can be paused, shortened, or restructured. For trauma work in particular, pacing is a clinical decision made with you rather than to you.' },
          { label: 'Written summaries on request', detail: 'Where it helps: memory difficulty, attention difficulty, or preferring things in writing, key points and between-session plans can be sent in writing afterward.' },
          { label: 'Scheduling', detail: 'Times depend on the counsellor, and the booking page shows what is open.' },
        ],
      },
      {
        h2: 'What this practice cannot currently offer',
        body: [
          'Naming the gaps is the part that makes the rest of the page credible:',
        ],
        list: [
          { label: 'No ASL interpretation arranged in-house', detail: 'This practice does not currently retain ASL interpreters. If you need one, say so during the consultation and the practice will work with you on arranging it or referring you to a service that provides it directly.' },
          { label: 'Languages other than English, Punjabi and Tagalog', detail: 'Sessions run in English, Punjabi or Tagalog only, and which of the three depends on which counsellor you see. The [counsellors page](/practitioners) says who works in what. Third-party interpretation changes the therapeutic relationship enough that it is worth discussing openly rather than assuming it will work.' },
          { label: 'No in-person option at all', detail: 'This is a fully virtual practice. For someone without private space, a reliable device, or an internet connection, that is a genuine barrier, and in that case a local in-person service is the better referral. The [BC resources directory](/resources/bc-crisis-and-support-directory) lists starting points.' },
          { label: 'No screen-reader testing has been done', detail: 'This is the honest version of a sentence that used to say the opposite. The site is built to WCAG 2.1 AA principles and a great deal is checked automatically on every deploy. Every prerendered page, and the booking, fees, contact, search and sign-in pages, which are asked of the running site because they are built on request, is checked for a language declaration, a single main heading, a working skip link, labelled form fields, images with text alternatives, titled frames and a sensible heading order; on those request-built pages, links that open a new tab must also say so. Every colour pair is checked for contrast. Reflow was checked by measurement: no page scrolls sideways at a 320-pixel width, and doubling the text size loses no content. What has NOT happened is somebody sitting down with a screen reader and using this site. Automated checks find broken markup; they cannot tell you whether a page makes sense when heard, and claiming otherwise on the one page people rely on would be the worst place on this site to be inaccurate.' },
          { label: 'This site has not had a formal third-party audit', detail: 'No external certification has been obtained. Saying "WCAG compliant" without an audit would be a claim this practice cannot support.' },
        ],
      },
      {
        h2: 'Telling us something is broken',
        body: [
          'If any part of this site is unusable with your assistive technology, or an accommodation you need is not listed, write to the address on the [contact page](/contact) and describe what happened and what you were using. Specific reports get fixed; general ones rarely can be.',
          'Accessibility problems on this site are treated as defects rather than requests, and they go to the front of the queue.',
        ],
      },
    ],
    related: [
      { href: '/contact', label: 'Contact' },
      { href: '/services/punjabi-counselling', label: 'Counselling in Punjabi' },
      { href: '/online-counselling', label: 'How online sessions work' },
      { href: '/standards', label: 'Standards and accountability' },
      { href: '/resources/bc-crisis-and-support-directory', label: 'BC crisis and support directory' },
    ],
  },
};

export const policyList = Object.values(policies);
export const getPolicy = (slug: string) => policies[slug];

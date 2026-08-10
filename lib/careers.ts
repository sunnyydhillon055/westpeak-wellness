/* Open roles.
 *
 * One source of truth for three consumers that must never disagree: the page a
 * human reads, the JobPosting structured data Google for Jobs ingests, and the
 * sitemap. Google requires the markup to describe the same posting the visitor
 * sees — a description in the schema that differs from the page is grounds for
 * the listing being dropped, and nothing tells you it happened.
 *
 * So the copy lives here as structure, and both the JSX and the HTML string in
 * the schema are rendered from it. There is no second place to edit.
 *
 * WHY THIS IS ON THE SITE AT ALL. Google for Jobs is free and renders above the
 * ordinary organic results. It is populated from JobPosting markup on any
 * indexed page — which is how Indeed and LinkedIn appear in it. A practice with
 * its own indexed careers page is eligible on exactly the same terms, with no
 * per-day spend and no 14- or 30-day expiry.
 */

export type Block =
  | { h: string }
  | { p: string }
  | { ul: string[] }
  | { note: string };

export type Job = {
  slug: string;
  /** Plain job title. Google requires no company, location or salary in here. */
  title: string;
  seoTitle: string;
  metaDescription: string;
  /** One-line summary used on the hub card and as the lede. */
  summary: string;
  identifier: string;
  datePosted: string;
  /** Google drops postings without one, and stale listings are penalised. */
  validThrough: string;
  employmentType: string[];
  employmentLabel: string;
  salary: { min: number; max: number; unit: 'HOUR'; currency: 'CAD' };
  salaryLabel: string;
  hoursLabel: string;
  locationLabel: string;
  /** NOC 2021 41301 — Therapists in counselling and related specialized therapies. */
  occupationalCategory: string;
  skills: string[];
  qualifications: string;
  responsibilities: string;
  blocks: Block[];
};

export const APPLY_EMAIL = 'info@westpeakwellness.com';

export const jobs: Job[] = [
  {
    slug: 'registered-clinical-counsellor',
    title: 'Registered Clinical Counsellor (RCC)',
    seoTitle: 'RCC Job — Remote Counselling, Part-Time, BC | Westpeak Wellness',
    metaDescription:
      'Remote counselling job for an RCC anywhere in BC. Keep 70% — $95–$120 per clinical hour. Part time, 5–25 hrs a week, work from home, referrals provided.',
    summary:
      'Remote across British Columbia · 70% of every session fee ($95–$120 per clinical hour) · 5–25 hours a week, self-scheduled · independent contractor.',
    identifier: 'WW-RCC-2026-01',
    datePosted: '2026-08-09',
    validThrough: '2026-11-09',
    employmentType: ['CONTRACTOR', 'PART_TIME'],
    employmentLabel: 'Independent contractor · part-time',
    salary: { min: 95, max: 120, unit: 'HOUR', currency: 'CAD' },
    salaryLabel: '$95–$120 per clinical hour',
    hoursLabel: '5–25 hours per week, self-scheduled',
    locationLabel: 'Fully remote — anywhere in British Columbia',
    occupationalCategory: '41301 Therapists in counselling and related specialized therapies',
    skills: [
      'Registered Clinical Counsellor (RCC)', 'Individual counselling', 'Couples counselling',
      'EMDR', 'Cognitive Behavioural Therapy', 'Gottman Method', 'Trauma-informed practice',
      'Telehealth', 'Anxiety', 'Depression', 'Burnout',
    ],
    qualifications:
      'Current registration as a Registered Clinical Counsellor (RCC) with the BC Association of Clinical Counsellors, in good standing. Own professional liability insurance. Demonstrated competence delivering therapy by secure video. Newly registered RCCs are welcome to apply.',
    responsibilities:
      'Provide individual counselling to adults across British Columbia by secure video; provide couples counselling where within competence; run free 15-minute intake consultations and assess fit honestly; maintain clinical records to BCACC standards.',
    blocks: [
      { p: 'I run a virtual counselling practice serving adults across British Columbia, and I have reached the point where I am turning people away. That is the reason this post exists, and I would rather hand those clients to someone good than keep stretching my own calendar.' },
      { p: 'So: I am looking for one Registered Clinical Counsellor to take referrals alongside me. Fully remote, hours entirely your own, and no expectation that you make this your whole working life unless you want to.' },
      { h: 'What the work is' },
      { p: 'Adults, by secure video, anywhere in the province. Anxiety, depression, trauma, burnout, relationship difficulty, life transitions — the ordinary, difficult range of a general adult practice. Couples work too, if that is something you do well and enjoy.' },
      { p: 'There is no office and no catchment area. A client in Prince George gets the same access as one in Vancouver, which is most of the reason I built it this way.' },

      { h: 'What you would not be doing' },
      { p: 'I think this list matters more than a duties list, so it goes first:' },
      { ul: [
        '**You do not find your own clients.** Referrals come to you. That is the whole arrangement.',
        '**No invoicing, no chasing payment, no booking admin.** Payment is taken when the client books and receipts issue automatically. You will never send an invoice or ask anyone for money.',
        '**No overhead.** No lease, no platform fees, no software subscription, nothing deducted for "marketing" or "admin". The 70/30 split is the whole arrangement and there is nothing underneath it.',
        '**No minimum caseload, no quota, no pressure to upsell packages.**',
        '**No crisis line, no on-call, no after-hours.** This is a scheduled practice and it says so to clients plainly.',
      ] },

      { h: 'Hours — genuinely flexible' },
      { p: '**Between 5 and 25 hours a week, and you set them.**' },
      { p: 'That range is wide on purpose. It means you can start with four or five clients while keeping other work, and grow only if you want to. It also means a permanently part-time caseload is a perfectly good answer — if you tell me you want six hours a week forever, that is a fine thing to want and it will not count against you.' },
      { p: 'Evenings are the most useful, because that is when most people ask to be seen. If you can offer some, say so.' },

      { h: 'What the pay actually works out to' },
      { p: 'No salary and no hourly wage — this is **contract counselling** work on a fee split. You keep **70% of every session fee**, with nothing deducted underneath it. Here is the arithmetic rather than a range and a shrug:' },
      { ul: [
        '**One individual session** (50 minutes, $140 fee) pays you **$98**.',
        '**One couples session** (50 minutes, $170 fee) pays you **$119**.',
        '**Ten sessions a week** is roughly **$980 a week**, or about $4,250 a month.',
        '**Twenty sessions a week** is roughly **$1,960 a week**, or about $8,500 a month.',
        '**An EMDR intensive** (90 minutes, $190 fee) pays you **$133**.',
      ] },
      { p: 'Two caveats, because a number without them is a sales pitch. **A caseload builds — it does not arrive**, so I will not promise you twenty sessions in month one. And you are a contractor, so tax, CPP, insurance and supervision come out of that.' },
      { p: 'What I will promise: the split never changes as you grow. No tiers, no clawback, no minimum before the 70% applies.' },

      { h: 'The honest part' },
      { p: '**You would be the first counsellor to join me,** and I would rather say what that means than let you find out.' },
      { p: '**The downside:** no existing team, no ready-made peer group, and some of how this works we will figure out together rather than me handing you a manual.' },
      { p: '**The upside:** your caseload builds at your pace instead of landing at full volume, you have real say in how the role takes shape, and you are not the thirtieth face on a directory page.' },
      { p: 'If you want a finished system to step into, this is not it — and I would rather you knew now than in month three.' },

      { h: 'What I am looking for' },
      { p: '**Needed:**' },
      { ul: [
        'Current registration as a **Registered Clinical Counsellor (RCC)** with the BC Association of Clinical Counsellors, in good standing',
        'Your own professional liability insurance',
        'Real comfort working by video — not "willing to give it a go"',
        'A private, quiet, professional space and a connection that will not drop halfway through a session',
        'The judgement to work independently, and to know when to check something with someone',
      ] },
      { p: '**Would be great, but genuinely not required:**' },
      { ul: [
        'EMDR training, at any stage from Part 1',
        'Gottman Method training, or other structured couples work',
        'Some evening availability',
        'Experience with perinatal mental health, men’s mental health, or with healthcare and shift workers',
      ] },
      { p: '**Newly registered? Please apply.** If you have just finished your hours and you are good at this, I am interested. A quiet, well-supported start with a manageable caseload is not a bad way to begin, and it is close to the best thing I can offer.' },
      { p: '**Not needed at all:** hospital experience, work with children or adolescents, medical terminology, or a research background. This is an adult outpatient practice and none of that is what the work asks for.' },

      { h: 'Terms, plainly' },
      { ul: [
        '**Split — 70% to you, 30% to the practice.** Nothing else deducted.',
        '**Rate — $98 per individual session, $119 per couples session.** That is $95–$120 per clinical hour.',
        '**Paid on clinical hours,** not admin time.',
        '**Hours — 5 to 25 per week,** self-scheduled. Evenings most useful.',
        '**Status — independent contractor.** You invoice, you handle your own taxes, and you are free to work elsewhere.',
        '**Location — fully remote,** anywhere in British Columbia.',
        '**Caseload** grows with demand. No minimum, no cap.',
        '**Provided:** referrals, practice management software, scheduling, invoicing, payment processing, website presence.',
        '**Yours:** BCACC registration, liability insurance, clinical supervision, your own taxes.',
      ] },
      { p: '**On contractor status, so it is not a surprise:** you set your own availability, you carry your own insurance and supervision, and you are free to see clients elsewhere. That independence is real, not a formality — it is how the arrangement works and it is why it is a contract rather than a job.' },

      { h: 'Where you can work from' },
      { p: 'Anywhere in British Columbia, because this is a work-from-home counselling role and every session runs by secure video. Counsellors in **Vancouver, Surrey, Burnaby, Richmond, Abbotsford and the Fraser Valley** are welcome, and so are counsellors in **Victoria, Nanaimo and Vancouver Island**, in **Kelowna and the Okanagan**, in **Kamloops and the Interior**, and in **Prince George and Northern BC**.' },
      { p: 'That last group matters most. If you are a therapist in a smaller community, virtual practice removes the ceiling local population puts on a caseload — you are no longer limited to people who can drive to you. All you need is a private room, a decent connection and your BC registration.' },

      { h: 'What happens after you apply' },
      { p: 'No black hole, and no six-stage process. In order:' },
      { ul: [
        '**I read your email myself,** usually within a few days.',
        '**You get a reply either way.** If it is a no, you will be told, rather than left wondering.',
        '**If there is a fit, we talk by video** for about half an hour. Informal. You should be interviewing me at least as hard as I am interviewing you.',
        '**I verify your registration** on the BCACC public register — the same check clients are told to run on me.',
        '**We agree terms in writing** and you pick your own starting availability.',
      ] },
      { p: 'There is no take-home task, no unpaid trial session, and nothing asked of you that would not also be asked of a client.' },

      /* Search variants, kept to one line at the very bottom. This used to be
         the third paragraph on the page, where it read as keyword stuffing to
         a human and pushed the actual offer below the fold. It earns its place
         down here — people do search all of these — but nobody should have to
         read it before they reach the work. */
      { note: 'Also listed as: counsellor job · therapist job · RCC job · clinical counsellor job · associate counsellor · psychotherapist · mental health job · online counselling job · virtual counselling job · contract counselling · part time · work from home · fee split — British Columbia.' },
    ],
  },
];

export const openJobs = (): Job[] => {
  /* Expired postings must stop being advertised. Google penalises stale
     JobPosting markup, and a listing that outlives its own validThrough is the
     commonest way a careers page quietly becomes a liability. */
  const today = new Date().toISOString().slice(0, 10);
  return jobs.filter((j) => j.validThrough >= today);
};

export const getJob = (slug: string): Job | undefined =>
  jobs.find((j) => j.slug === slug);

/* ---- rendering ----------------------------------------------------------- */

/** `**bold**` → <strong>, escaping everything else. Shared by both renderers so
 *  the page and the schema description cannot disagree about emphasis. */
export function inlineHtml(s: string): string {
  const esc = (t: string) =>
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return s
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((c) => (c.startsWith('**') ? `<strong>${esc(c.slice(2, -2))}</strong>` : esc(c)))
    .join('');
}

/** The full posting as HTML, for the JobPosting `description` field.
 *  Google wants the complete description here, formatted, not a summary. */
export function jobDescriptionHtml(job: Job): string {
  const out: string[] = [`<p>${inlineHtml(job.summary)}</p>`];
  for (const b of job.blocks) {
    if ('h' in b) out.push(`<h3>${inlineHtml(b.h)}</h3>`);
    else if ('p' in b) out.push(`<p>${inlineHtml(b.p)}</p>`);
    else if ('ul' in b) out.push(`<ul>${b.ul.map((li) => `<li>${inlineHtml(li)}</li>`).join('')}</ul>`);
    /* `note` blocks are deliberately excluded. They are search-variant lines
       for the page, not part of the job description — putting a list of
       synonyms into the text Google ingests as the posting body is how a
       JobPosting starts looking like spam to the thing you need to trust it. */
  }
  out.push(
    `<p>To apply, email ${APPLY_EMAIL} with your CV, your BCACC registration number, ` +
    `a few paragraphs on how you actually work, and your availability.</p>`
  );
  return out.join('');
}

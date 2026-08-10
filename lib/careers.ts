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
    seoTitle: 'Registered Clinical Counsellor Job — Remote, BC | Westpeak Wellness',
    metaDescription:
      'Remote RCC contract role anywhere in British Columbia. 70% of every session fee — $95–$120 per clinical hour, 5–25 hours a week, you set your own schedule.',
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

      { h: 'The honest part' },
      { p: '**You would be the first counsellor to join me,** and I would rather say what that means than let you find out.' },
      { p: 'The downside is real: there is no existing team, no ready-made peer group, and some of how this works we will figure out together rather than me handing you a manual.' },
      { p: 'The upside is also real. Your caseload builds at your pace rather than landing on you at full volume. You have actual say in how this role takes shape, because you are the one shaping it. And you will not be the thirtieth face on a directory page — clients will know who you are.' },
      { p: 'I am not going to pretend this suits everybody. If you want a finished system to step into, this is not that, and I would rather you knew now.' },

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
  }
  out.push(
    `<p>To apply, email ${APPLY_EMAIL} with your CV, your BCACC registration number, ` +
    `a few paragraphs on how you actually work, and your availability.</p>`
  );
  return out.join('');
}

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
  /* NO OPEN ROLES.
   *
   * The Registered Clinical Counsellor posting was closed on 20 August 2026 at
   * the owner's request. The whole entry — copy, salary band, NOC code, skills,
   * blocks — is intact in git history; recover it with:
   *
   *     git log --oneline -- lib/careers.ts
   *     git show <sha>:lib/careers.ts
   *
   * Everything needed to post again is still here: the Job type, openJobs(),
   * getJob(), and both renderers. Adding an object back to this array restores
   * the posting page, its JobPosting markup, the sitemap entry, the search
   * index entry and the llms.txt line, with no other edits required.
   *
   * /careers itself is deliberately unaffected. It was written to be useful
   * when nothing is open — see the open.length === 0 branch there — and it
   * still explains the arrangement and invites speculative enquiries.
   *
   * Note that /careers/registered-clinical-counsellor now 301s to /careers in
   * next.config.mjs. If that slug is ever reused, remove the redirect in the
   * same change, or scripts/redirect-shadow.mjs will fail the build — which is
   * exactly what it is for. */
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

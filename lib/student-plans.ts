/* WHAT EACH BC STUDENT-SOCIETY PLAN PAYS FOR A REGISTERED CLINICAL COUNSELLOR.
 *
 * Added 1 Oct 2026. The student pages said only that "many post-secondary
 * plans" cover counselling, which is true and useless: a student cannot act on
 * "many". These rows were read from each plan's own page on alumo.ca on the
 * date in `checkedOn`, and every figure on the site about a student plan comes
 * from here — the table on the three student pages, the per-plan FAQs on the
 * student resource and the student-plan choice in the cost estimator.
 *
 * Rules for a row:
 *  - Only what the plan page says. Where it says nothing (a referral rule, the
 *    policy-year dates), the row says "not stated" rather than guessing.
 *  - `designations` is the plan's own wording. A plan that names "counsellor"
 *    without naming an RCC is recorded that way, and the table says to check.
 *  - The maximum is COMBINED with psychologists and social workers on every
 *    one of these plans, so a student who has already claimed a psychologist
 *    this year has less left.
 *  - Re-read every row at least once a year. test/student-plans.test.mts
 *    fails when any `checkedOn` is more than 365 days old, because a plan
 *    year resets every September and a stale maximum is a wrong number on a
 *    money page.
 *
 * Pure, no imports: the cost estimator is a client component and reads this
 * file directly. Keep it small.
 */

export type StudentPlan = {
  id: string;
  /** "UBC AMS/GSS", as students call it. */
  name: string;
  institution: string;
  /** The plan's own words for who it reimburses. */
  designations: string;
  /** Whether the plan page names a Registered Clinical Counsellor. */
  namesRcc: boolean;
  /** Share of each visit the plan pays, 0–100. */
  percent: number;
  /** A per-visit dollar cap, where the plan sets one. */
  perVisitMax?: number;
  /** Annual maximum in dollars, shared with the other mental-health practitioners. */
  annualMax: number;
  referral: string;
  policyYear: string;
  source: string;
  /** ISO date the source page was read. */
  checkedOn: string;
};

export const STUDENT_PLANS: StudentPlan[] = [
  {
    id: 'ubc-ams-gss',
    name: 'UBC AMS/GSS',
    institution: 'University of British Columbia (Vancouver)',
    designations: 'Registered Clinical Counsellor, Canadian Certified Counsellor, Registered Psychologist, Master of Social Work',
    namesRcc: true,
    percent: 100,
    annualMax: 1250,
    referral: 'Not stated on the plan page',
    policyYear: 'Sept 1 to Aug 31',
    source: 'https://ubc-ams-gss.alumo.ca/health',
    checkedOn: '2026-10-01',
  },
  {
    id: 'sfss-enhanced',
    name: 'SFSS Enhanced',
    institution: 'Simon Fraser University',
    designations: 'Registered Clinical Counsellor, Canadian Certified Counsellor, Registered Psychologist, Master of Social Work',
    namesRcc: true,
    percent: 90,
    annualMax: 750,
    referral: 'Not stated on the plan page',
    policyYear: 'Not stated on the plan page',
    source: 'https://sfss.alumo.ca/health',
    checkedOn: '2026-10-01',
  },
  {
    id: 'sfss-basic',
    name: 'SFSS Basic',
    institution: 'Simon Fraser University',
    designations: 'Registered Clinical Counsellor, Canadian Certified Counsellor, Registered Psychologist, Master of Social Work',
    namesRcc: true,
    percent: 100,
    perVisitMax: 30,
    annualMax: 650,
    referral: 'Not stated on the plan page',
    policyYear: 'Not stated on the plan page',
    source: 'https://sfss.alumo.ca/health',
    checkedOn: '2026-10-01',
  },
  {
    id: 'uvss',
    name: 'UVSS',
    institution: 'University of Victoria',
    designations: 'Registered Clinical Counsellor, Canadian Certified Counsellor, Registered Psychologist, Master of Social Work',
    namesRcc: true,
    percent: 70,
    annualMax: 800,
    referral: 'None stated for mental-health practitioners',
    policyYear: 'Not stated on the plan page',
    source: 'https://uvss.alumo.ca/health',
    checkedOn: '2026-10-01',
  },
  {
    id: 'lsu',
    name: 'Langara Students’ Union',
    institution: 'Langara College',
    designations: 'Registered Clinical Counsellor, Canadian Certified Counsellor, Registered Psychologist, Master of Social Work',
    namesRcc: true,
    percent: 100,
    annualMax: 500,
    referral: 'Not stated on the plan page',
    policyYear: 'Ends Aug 31',
    source: 'https://lsu.alumo.ca/health',
    checkedOn: '2026-10-01',
  },
  {
    id: 'ksa',
    name: 'Kwantlen Student Association',
    institution: 'Kwantlen Polytechnic University',
    designations: 'Registered clinical counsellor and Canadian certified counsellor, among a longer list of counsellors, psychologists and social workers',
    namesRcc: true,
    percent: 80,
    annualMax: 500,
    referral: 'Not stated on the plan page',
    policyYear: 'Benefit year; dates not stated on the plan page',
    source: 'https://ksa.alumo.ca/health-coverage',
    checkedOn: '2026-10-01',
  },
  {
    id: 'dsu',
    name: 'Douglas Students’ Union',
    institution: 'Douglas College',
    designations: 'Psychologist, social worker, counsellor or Master of Social Work (the page says “counsellor” and does not name the RCC)',
    namesRcc: false,
    percent: 80,
    annualMax: 450,
    referral: 'Not stated on the plan page',
    policyYear: 'Sept 1, 2026 to Aug 31, 2027',
    source: 'https://douglas-dsu.alumo.ca/health-coverage',
    checkedOn: '2026-10-01',
  },
];

export const getStudentPlan = (id: string) => STUDENT_PLANS.find((p) => p.id === id);

/** What the plan pays back on one session at `fee` dollars, to the cent. */
export function reimbursedPerSession(plan: Pick<StudentPlan, 'percent' | 'perVisitMax'>, fee: number): number {
  const share = Math.round(fee * plan.percent) / 100;
  return plan.perVisitMax === undefined ? share : Math.min(share, plan.perVisitMax);
}

/** Whole sessions at `fee` the annual maximum reimburses in full, before
 *  anything else has been claimed against it this year. */
export function sessionsCovered(plan: Pick<StudentPlan, 'percent' | 'perVisitMax' | 'annualMax'>, fee: number): number {
  const per = reimbursedPerSession(plan, fee);
  return per > 0 ? Math.floor(plan.annualMax / per) : 0;
}

/** "90% of each visit", or "<cap> of each visit" where a per-visit cap is the whole rule. */
export function paysLabel(plan: Pick<StudentPlan, 'percent' | 'perVisitMax'>): string {
  if (plan.perVisitMax !== undefined && plan.percent === 100) return `$${plan.perVisitMax} of each visit`;
  if (plan.perVisitMax !== undefined) return `${plan.percent}% of each visit, up to $${plan.perVisitMax}`;
  return `${plan.percent}% of each visit`;
}

const DAY = 86_400_000;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "2026-10-01" -> "1 October 2026". */
export const readOn = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** The rows read more than `maxDays` before `today` (both ISO dates). */
export function staleStudentPlans(today: string, maxDays = 365, plans: StudentPlan[] = STUDENT_PLANS): StudentPlan[] {
  const now = Date.parse(`${today}T00:00:00Z`);
  return plans.filter((p) => (now - Date.parse(`${p.checkedOn}T00:00:00Z`)) / DAY > maxDays);
}

/** The oldest `checkedOn`, for the "read on" line under the table. */
export const studentPlansCheckedOn = (plans: StudentPlan[] = STUDENT_PLANS) =>
  plans.map((p) => p.checkedOn).sort()[0];

/* WHERE THE TABLE APPEARS — keyed as lib/depth.ts keys its sections
   ('for/<slug>', 'resources/<slug>'), valued with the h2 it follows. The two
   page templates read this, so adding a page is one line here. */
export const STUDENT_PLAN_TABLE_AFTER: Record<string, string> = {
  'for/university-students': 'Two plans, and who sees the claim',
  'for/international-students': 'What your plan probably covers',
  'resources/student-mental-health-supports-bc': 'The student health plan almost nobody reads',
};

/** One FAQ per plan, for the student resource. Numbers from the rows above. */
export function studentPlanFaqs(plans: StudentPlan[] = STUDENT_PLANS): { q: string; a: string }[] {
  return plans.map((p) => ({
    q: `Does the ${p.name} plan cover a Registered Clinical Counsellor?`,
    a: p.namesRcc
      ? `Yes, by name. The ${p.name} plan (${p.institution}) pays ${paysLabel(p)} with a Registered Clinical Counsellor, up to $${p.annualMax.toLocaleString('en-CA')} a policy year, shared with psychologists and social workers. Referral: ${p.referral.charAt(0).toLowerCase()}${p.referral.slice(1)}. Read from the plan’s own page on ${readOn(p.checkedOn)}; the booklet for your year is the authority.`
      : `The ${p.name} plan (${p.institution}) pays ${paysLabel(p)} for a counsellor, psychologist or social worker, up to $${p.annualMax.toLocaleString('en-CA')} a policy year, but its page says “counsellor” without naming the Registered Clinical Counsellor. Ask the plan before the first session whether an RCC qualifies. Read on ${readOn(p.checkedOn)}.`,
  }));
}

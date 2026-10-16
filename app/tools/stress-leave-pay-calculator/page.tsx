import type { Metadata } from 'next';
import Link from 'next/link';
import { getTool } from '@/lib/tools';
import ToolShell from '@/components/tools/ToolShell';
import CtaBand from '@/components/CtaBand';
import LeavePayCalculator from '@/components/tools/LeavePayCalculator';
import { site } from '@/lib/site';
import { ogBase } from '@/lib/og-meta';
import { bookingFor } from '@/lib/booking-cta';
import { fallbackFee, FALLBACK_CATALOG } from '@/lib/cliniko-catalog';
import {
  eiSicknessMax, EI_SICKNESS_SOURCE, EI_SICKNESS_AFTER_APPLYING, EI_WAITING_WAIVER, EI_WAITING_WAIVED,
  EI_WAITING_CLAUSE, EI_WEEKLY_IN_YEAR, longDate,
} from '@/lib/benefit-figures';
import { leavePay, weekRange, dollars, type LeavePicture, type Phase } from '@/lib/leave-pay';

/* THE STRESS-LEAVE PAY CALCULATOR — 13 Oct 2026.
 *
 * The figures the calculator needs are read here, on the server, from
 * lib/benefit-figures.ts and passed down as props: the client component
 * imports lib/leave-pay.ts (pure arithmetic) and nothing larger. The worked
 * example below is the same function run at build time, so the answer is in
 * the HTML for anyone, or anything, that does not run the script. */

const tool = getTool('stress-leave-pay-calculator')!;
const EI = eiSicknessMax();
const EI_PROPS = { weekly: EI.weekly, year: EI.year };
const SESSION_MINUTES = FALLBACK_CATALOG.items.find((i) => i.name === 'Individual Counselling')?.minutes ?? 50;

/* Two worked readers: a typical week, and one past the maximum. The second
   wage is the year's maximum insurable earnings over 52, plus a margin, so
   it always lands on the cap whatever year the build is. */
const TYPICAL = 1000;
const HIGH = Math.ceil(EI.maxInsurableEarnings / 52 / 100) * 100 + 200;
const example = leavePay({ weeklyEarnings: TYPICAL, monthsOfService: 12 }, EI_PROPS, EI_WAITING_WAIVED);
const high = leavePay({ weeklyEarnings: HIGH, monthsOfService: 12 }, EI_PROPS, EI_WAITING_WAIVED);

const WHO: Record<Phase['kind'], string> = {
  'sick-pay': 'Your employer: Employment Standards Act sick days',
  waiting: 'Nobody: the EI waiting week',
  ei: 'Service Canada: EI sickness benefits',
  plan: 'Your short-term disability plan',
  after: 'EI ends',
};

export const metadata: Metadata = {
  title: { absolute: tool.metaTitle },
  description: tool.metaDescription,
  alternates: { canonical: `${site.domain}/tools/${tool.slug}` },
  openGraph: { ...ogBase(`/tools/${tool.slug}`) },
};

function ExampleTable({ pic, weekly }: { pic: LeavePicture; weekly: number }) {
  return (
    <div className="table-scroll" style={{ margin: '8px 0 14px' }}>
      <table className="fee-table">
        <caption className="sr-only">What a stress leave pays on {dollars(weekly)} a week, week by week</caption>
        <thead>
          <tr>
            <th>When</th>
            <th>Who pays</th>
            <th>About, before tax</th>
          </tr>
        </thead>
        <tbody>
          {pic.phases.filter((p) => p.kind !== 'after').map((p) => (
            <tr key={`${p.kind}-${p.fromWeek}`}>
              <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{weekRange(p)}</td>
              <td style={{ fontWeight: 400 }}>{WHO[p.kind]}</td>
              <td style={{ fontWeight: 400 }}>{p.weeklyPay === null ? 'Set by the plan' : `${dollars(p.weeklyPay)}${p.kind === 'ei' ? ' a week' : ''}`}</td>
            </tr>
          ))}
          <tr>
            <td style={{ fontWeight: 600, color: 'var(--ink)' }}>All {pic.weeksShown} weeks</td>
            <td style={{ fontWeight: 400 }}>Against {dollars(pic.usualTotal)} at usual pay</td>
            <td style={{ fontWeight: 400 }}>{pic.totalPaid === null ? 'Set by the plan' : dollars(pic.totalPaid)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* EMBED THIS CALCULATOR — 15 Oct 2026. The copy-paste snippet for HR, union
   and benefits sites. The frame is /embed/stress-leave-pay-calculator
   (pages/embed/, noindex, the one route next.config.mjs lets another site
   frame). The paragraph after the iframe is the fallback and the credit: a
   reader whose browser blocks frames still reaches this page, and it is a
   plain link on the host's own page rather than one inside the frame. The
   listener is optional and sizes the frame from the height the embed posts. */
const EMBED_URL = `${site.domain}/embed/${tool.slug}`;
const TOOL_URL = `${site.domain}/tools/${tool.slug}`;
const EMBED_SNIPPET = [
  `<iframe src="${EMBED_URL}" id="westpeak-leave-pay" title="BC stress leave pay calculator" width="100%" height="1400" style="border:0;max-width:760px" loading="lazy"></iframe>`,
  `<p><a href="${TOOL_URL}">BC stress leave pay calculator</a> from Westpeak Wellness</p>`,
].join('\n');
const EMBED_RESIZE = `<script>addEventListener("message",function(e){if(e.origin==="${site.domain}"&&e.data&&e.data.type==="westpeak-embed-height"){var f=document.getElementById("westpeak-leave-pay");if(f)f.style.height=e.data.height+"px";}});</script>`;

const SOURCES = [
  { label: 'Government of Canada, EI sickness benefits: how much you could receive (read 13 Oct 2026)', url: EI_SICKNESS_SOURCE },
  { label: 'Government of Canada, EI sickness benefits: do you qualify (read 13 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/qualify.html' },
  { label: 'Government of Canada, EI sickness benefits: apply (read 13 Oct 2026)', url: 'https://www.canada.ca/en/services/benefits/ei/ei-sickness/apply.html' },
  { label: 'Government of Canada, EI sickness benefits: after you apply, the waiting period and the first payment (read 13 Oct 2026)', url: EI_SICKNESS_AFTER_APPLYING },
  { label: `Government of Canada, temporary EI measures: waiving the waiting period (read ${longDate(EI_WAITING_WAIVER.readOn)})`, url: EI_WAITING_WAIVER.sourceUrl },
  { label: 'Province of BC, paid sick leave (read 13 Oct 2026)', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/paid-sick-leave' },
  { label: 'Government of Canada, medical leave with pay for federally regulated employees, IPG-118 (read 13 Oct 2026)', url: 'https://www.canada.ca/en/employment-social-development/programs/laws-regulations/labour/interpretations-policies/medical-leave-pay.html' },
  { label: 'Province of BC, leaves of absence: serious personal illness or injury leave (read 15 Oct 2026)', url: 'https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/time-off/leaves-of-absence' },
  { label: 'Canada Labour Code, s. 239, medical leave of up to 27 weeks (read 13 Oct 2026)', url: 'https://laws-lois.justice.gc.ca/eng/acts/L-2/section-239.html' },
  { label: 'WorkSafeBC, mental health claims (read 13 Oct 2026)', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/mental-health-injury-claims' },
];

export default function Page() {
  const book = bookingFor('individual-therapy');
  const firstEi = example.phases.find((p) => p.kind === 'ei')!;
  return (
    <>
      <ToolShell
        tool={tool}
        gentle
        heading="Stress leave pay calculator for BC: what you would be paid, week by week"
        consult={{
          lead: 'If the leave is about more than the money, a',
          label: 'free 15-minute consultation',
          tail: ' with a counsellor is a quiet place to start.',
        }}
        intro={`Stress leave in BC is partly paid. After 90 days with your employer you get five paid sick days a year; after that, EI sickness benefits pay 55% of your average weekly insurable earnings, to ${EI_WEEKLY_IN_YEAR}, for up to 26 weeks, and ${EI_WAITING_CLAUSE}. A short-term disability plan, where your employer has one, pays on its own terms instead. Enter your weekly pay to see your own weeks.`}
      >
        <LeavePayCalculator
          ei={EI_PROPS}
          waiver={{ from: EI_WAITING_WAIVER.from, to: EI_WAITING_WAIVER.to, toLabel: longDate(EI_WAITING_WAIVER.to) }}
          bookHref={book.href}
        />

        <div className="prose tool-prose">
          <h2 id="worked-example">A worked example: {dollars(TYPICAL)} a week, in a BC job</h2>
          <p>
            Someone who has worked for a BC employer for a year, earns about {dollars(TYPICAL)} a week
            before tax, has no disability plan and has not used a sick day this year. Their doctor
            certifies a leave, and they apply for EI the same week.
          </p>
          <ExampleTable pic={example} weekly={TYPICAL} />
          <p>
            The first week is the five paid sick days under the Employment Standards Act, at an
            average day&rsquo;s pay. The three unpaid sick days that follow protect the job rather
            than paying anything. {EI_WAITING_WAIVED
              ? `No waiting week is served, because a claim starting now falls inside the temporary measure that waives it until ${longDate(EI_WAITING_WAIVER.to)}, so EI`
              : 'The next week is the EI waiting week, which nobody pays, and then EI'}{' '}
            pays {dollars(firstEi.weeklyPay!)} a week before tax for {weekRange(firstEi).toLowerCase()},
            which is 55% of {dollars(TYPICAL)}. Over the whole stretch that is about{' '}
            {dollars(example.totalPaid!)} against {dollars(example.usualTotal)} at usual pay, before
            tax on both.
          </p>
          <p>
            Earning more does not move the EI figure past the year&rsquo;s maximum. At{' '}
            {dollars(HIGH)} a week, 55% would be {dollars(Math.round(HIGH * 0.55))}, but EI pays{' '}
            {dollars(high.eiWeekly)}, the {EI.year} maximum, set by the maximum insurable earnings of{' '}
            {dollars(EI.maxInsurableEarnings)}. Above roughly {dollars(Math.round(EI.maxInsurableEarnings / 52))} a
            week everyone on EI sickness gets the same amount, which is where the gap between a
            paycheque and a leave is widest.
          </p>

          <h2 id="how-it-works">How the weeks are worked out</h2>
          <p>
            Three systems pay in turn, and none of them is called stress leave. The sick days come
            from your employer under the Employment Standards Act, the EI benefit from Service
            Canada, and anything after that from an employer plan or, when work caused it,
            WorkSafeBC. <Link href="/resources/workplace-mental-health-bc">How stress leave works in BC, and whether it is paid</Link>{' '}
            sets them side by side in one table, with who can sign the leave and what your employer
            may ask.
          </p>
          <p>
            EI averages your best 14 to 22 weeks of insurable earnings from the last year, depending
            on the unemployment rate where you live, then pays 55% of that average. You need 600
            insured hours in the 52 weeks before the claim, earnings down by more than 40%, and a
            medical certificate. <Link href="/guides/ei-sickness-benefits-and-therapy">What medical EI pays on a mental-health leave</Link>{' '}
            walks through the application, the Record of Employment and the four-week deadline that
            costs people weeks.
          </p>
          <p>
            If your employer has a short-term disability plan, it usually pays before EI rather than
            on top of it, and the policy sets the amount, the waiting period and the length. That is
            why the calculator gives no figure for it.{' '}
            <Link href="/resources/disability-benefits-and-counselling-bc">Short and long-term disability for a mental-health claim</Link>{' '}
            covers how those claims run. For a single bad day rather than a leave,{' '}
            <Link href="/guides/sick-days-and-mental-health-days-bc">using sick days as mental-health days in BC</Link>{' '}
            is the shorter answer.
          </p>

          <h2 id="federal">If your employer is federally regulated</h2>
          <p>
            Banks, airlines, telecoms, interprovincial trucking and other federal employers are under
            the Canada Labour Code, not the BC Act. You earn three paid medical days after 30 days
            of continuous employment, then one more a month, to ten a year, at your regular rate. The
            Code also protects your job through up to 27 weeks of medical leave, which is protection,
            not pay. EI sickness benefits are the same either way. The 27 weeks quoted on many pages
            is not only federal: a BC-regulated job has up to 27 weeks of unpaid, job-protected
            serious personal illness or injury leave in any 52-week period under the Employment
            Standards Act, with a certificate from a doctor, nurse practitioner or other designated
            health professional.
          </p>

          <h2 id="where-counselling-fits">Where counselling fits</h2>
          <p>
            None of these systems needs you to be in counselling to pay you. People use the leave for
            it anyway, because the leave is often the first time there is room for it, and a
            treatment record matters later at the return to work.{' '}
            <Link href="/guides/stress-leave-bc">Going on stress leave in BC, step by step</Link>{' '}
            covers the order of things. An individual session here is{' '}
            {fallbackFee('Individual Counselling')} for {SESSION_MINUTES} minutes by video, and whether your plan keeps
            reimbursing during a leave is a question for HR; the <Link href="/pricing">fees and coverage page</Link>{' '}
            has the rest.
          </p>

          <h2 id="embed">Embed this calculator on your site</h2>
          <p>
            HR teams, union locals and benefits advisers hear the same question from people about to
            go on leave: what will I actually be paid, and when. The calculator can sit on your own
            page and answer it there. It is free to use, there is nothing to sign up for, and the
            framed version carries only the calculator and one credit line: no booking buttons, no
            counsellor listings, no advertising and no third-party analytics. The weekly earnings a
            reader enters stay in their browser. The only thing counted is that a result was shown,
            and whether it was the BC, federal, disability-plan or WorkSafeBC route.
          </p>
          <p>
            Paste this where you want the calculator to appear. It runs on the same figures as this
            page, so when the EI maximum or the waiting-week rule is updated here, the copy on your
            site changes with it:
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '.85rem', lineHeight: 1.6, background: 'var(--bg-tint)', border: '1px solid var(--line)', borderRadius: 8, padding: '16px 18px', margin: '0 0 16px', userSelect: 'all' }}>
            <code>{EMBED_SNIPPET}</code>
          </pre>
          <p>
            The line under the frame is the fallback. A reader whose browser or privacy settings block
            embedded frames still gets a working link to the full calculator, with the worked example
            and the government sources it is built on. Please keep it with the frame.
          </p>
          <p>
            The frame is set tall enough for a long result. To have it fit its content instead, add
            this once on the same page. It listens only for messages from this site, and changes
            nothing but the frame&rsquo;s height:
          </p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '.85rem', lineHeight: 1.6, background: 'var(--bg-tint)', border: '1px solid var(--line)', borderRadius: 8, padding: '16px 18px', margin: '0 0 16px', userSelect: 'all' }}>
            <code>{EMBED_RESIZE}</code>
          </pre>
          <p>
            The calculator covers BC-regulated and federally regulated employees, and it is an
            estimate rather than advice: Service Canada, the insurer and WorkSafeBC each decide their
            own claims. Questions about putting it on your site, or a correction to report, go to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>. For what employers can offer beyond the
            calculator, see <Link href="/for/employers-and-hr">counselling for employers and HR teams</Link>.
          </p>

          <h2 id="sources">Sources</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: '.94rem', paddingLeft: 20 }}>
            {SOURCES.map((s) => (
              <li key={s.url} style={{ marginBottom: 8 }}>
                <a href={s.url} target="_blank" rel="noopener">{s.label}</a>
              </li>
            ))}
          </ul>
          <p style={{ color: 'var(--ink-faint)', fontSize: '.9rem' }}>
            This is an estimate, not advice. Service Canada decides what EI pays you, your insurer
            decides a disability claim and WorkSafeBC decides its own. If you are in crisis, call or
            text <strong>9-8-8</strong> (Canada, 24/7).
          </p>
        </div>
      </ToolShell>
      <CtaBand />
    </>
  );
}

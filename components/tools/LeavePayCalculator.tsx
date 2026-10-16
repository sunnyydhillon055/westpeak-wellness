'use client';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import ResultCta from '@/components/tools/ResultCta';
import { useToolStart } from '@/components/tools/useToolStart';
import { toolDetail } from '@/lib/conversion-detail-client';
/* Pure arithmetic, no imports of its own: the only module this needs. */
import {
  leavePay, waitingWaivedOn, pacificToday, weekRange, dollars,
  BC_PAID_DAYS, BC_UNPAID_DAYS, FEDERAL_PROTECTED_WEEKS, type Phase,
} from '@/lib/leave-pay';

/* The stress-leave pay calculator (13 Oct 2026).
 *
 * The EI maximum, its year and the waiting-week window arrive as props from
 * the server page, read there from lib/benefit-figures.ts; this component
 * must not import that module's callers, lib/tools.ts or the roster. The
 * claim date is today in BC, read when the reader asks, so a page built
 * before the waiver ends still answers correctly after it. */

/* `embed` is set only by the framed copy at /embed/stress-leave-pay-calculator
   (pages/embed/, 15 Oct 2026). Inside someone else's page a site link must
   open a new tab at the full address rather than navigate the frame, and the
   booking and share buttons are left out: the host page carries one credit
   line instead. `origin` comes from lib/site.ts on the server. */
type Props = {
  ei: { weekly: number; year: number };
  waiver: { from: string; to: string; toLabel: string };
  bookHref?: string;
  embed?: { origin: string };
};

type Tri = 'yes' | 'no' | 'unsure';

/* Colours by token only (the palette gate), inline so the stylesheet every
   page carries does not grow for one tool. */
const SWATCH: Record<Phase['kind'], string> = {
  'sick-pay': 'var(--blue-deep)',
  waiting: 'var(--line)',
  ei: 'var(--blue)',
  plan: 'var(--clay)',
  after: 'var(--line)',
};

const MONTHS = [
  [0, 'Less than a month'],
  [1, '1 month'],
  [2, '2 months'],
  [3, '3 months (90 days)'],
  [4, '4 months'],
  [5, '5 months'],
  [6, '6 months'],
  [7, '7 months'],
  [8, '8 months'],
  [9, '9 months or more'],
] as const;

function Choice<T extends string>({ value, set, options }: { value: T; set: (v: T) => void; options: readonly (readonly [T, string])[] }) {
  return (
    <div className="est-row">
      {options.map(([v, label]) => (
        <button key={v} type="button" className={`quiz-choice${value === v ? ' is-on' : ''}`} aria-pressed={value === v} onClick={() => set(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function SiteLink({ origin, href, children }: { origin?: string; href: string; children: React.ReactNode }) {
  return origin
    ? <a href={`${origin}${href}`} target="_blank" rel="noopener">{children}</a>
    : <Link href={href}>{children}</Link>;
}

const TRI = [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] as const;

export default function LeavePayCalculator({ ei, waiver, bookHref, embed }: Props) {
  const [earnings, setEarnings] = useState('');
  const [law, setLaw] = useState<'bc' | 'federal'>('bc');
  const [months, setMonths] = useState(9);
  const [used, setUsed] = useState(0);
  const [std, setStd] = useState<Tri>('no');
  const [work, setWork] = useState<Tri>('no');
  const [shown, setShown] = useState(false);
  /* tool_start on the first input (components/tools/useToolStart); on the
     framed copy it is counted against the /embed/ page. */
  const startHandlers = useToolStart('stress-leave-pay-calculator');

  const weekly = Number(earnings) || 0;
  const federal = law === 'federal';
  const waived = waitingWaivedOn(pacificToday(), waiver);
  const pic = leavePay(
    { weeklyEarnings: weekly, monthsOfService: months, daysUsed: used, federal, shortTermDisability: std === 'yes', workCaused: work === 'yes' },
    ei,
    waived,
  );

  const describe = (p: Phase): string => {
    switch (p.kind) {
      case 'sick-pay':
        return federal
          ? `${p.paidDays} paid medical ${p.paidDays === 1 ? 'day' : 'days'} under the Canada Labour Code, at your regular rate: about ${dollars(p.weeklyPay!)}${p.fromWeek === p.toWeek ? '' : ' a week'} from your employer.`
          : `${p.paidDays} paid sick ${p.paidDays === 1 ? 'day' : 'days'} under the Employment Standards Act, at an average day’s pay: about ${dollars(p.weeklyPay!)} from your employer.`;
      case 'waiting':
        return 'The EI waiting week: one week Service Canada does not pay, like an insurance deductible.';
      case 'ei':
        return `EI sickness benefits: about ${dollars(p.weeklyPay!)} a week before tax, ${pic.capped ? `the ${ei.year} maximum` : '55% of your earnings'}, for up to ${pic.eiWeeks} weeks.`;
      case 'plan':
        return `Your short-term disability plan, if the claim is approved: its own waiting period, amount and length, set by the policy. Ask the insurer for the figures. If it does not pay, EI would be about ${dollars(pic.eiWeekly)} a week.`;
      case 'after':
        return 'EI sickness benefits end. If you still cannot work: a long-term disability plan if your employer has one, or CPP disability for a severe and prolonged condition.';
    }
  };

  const weeks = Array.from({ length: pic.weeksShown }, (_, i) => {
    const w = i + 1;
    return pic.phases.find((p) => w >= p.fromWeek && w <= p.toWeek)?.kind ?? 'after';
  });

  const ready = weekly > 0;

  return (
    <div className="quiz" {...startHandlers}>
      <fieldset className="quiz-set">
        <legend className="quiz-q">What do you earn in an average week, before tax?</legend>
        <p className="quiz-help">
          Your insurable earnings: wages, tips, commissions. EI averages your best 14 to 22 weeks
          of the last year, depending on where you live, so a typical week is close enough here.
        </p>
        <div className="est-fields">
          <label htmlFor="leave-weekly">Per week ($)</label>
          <input
            id="leave-weekly" inputMode="numeric" pattern="[0-9]*" value={earnings} placeholder="e.g. 1000"
            onChange={(e) => setEarnings(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          />
        </div>
      </fieldset>

      <fieldset className="quiz-set">
        <legend className="quiz-q">Who regulates your job?</legend>
        <p className="quiz-help">
          Most BC jobs fall under the BC Employment Standards Act. Banks, airlines, telecoms,
          interprovincial trucking and other federally regulated employers fall under the Canada
          Labour Code instead.
        </p>
        <Choice value={law} set={setLaw} options={[['bc', 'A BC employer'], ['federal', 'A federally regulated employer']] as const} />
      </fieldset>

      <fieldset className="quiz-set">
        <legend className="quiz-q">How long have you worked for this employer?</legend>
        <label htmlFor="leave-months" className="sr-only">Months with this employer</label>
        <select id="leave-months" value={months} onChange={(e) => setMonths(Number(e.currentTarget.value))}>
          {MONTHS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
        </select>
        <p className="quiz-help" style={{ marginTop: 10 }}>
          <label htmlFor="leave-used">Paid sick days already used this calendar year</label>{' '}
          <select id="leave-used" value={used} onChange={(e) => setUsed(Number(e.currentTarget.value))}>
            {Array.from({ length: 11 }, (_, n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </p>
      </fieldset>

      <fieldset className="quiz-set">
        <legend className="quiz-q">Does your employer have a short-term disability plan?</legend>
        <Choice value={std} set={setStd} options={TRI} />
      </fieldset>

      <fieldset className="quiz-set">
        <legend className="quiz-q">Did something at work cause it?</legend>
        <p className="quiz-help">A traumatic event at work, or a significant work-related stressor.</p>
        <Choice value={work} set={setWork} options={TRI} />
      </fieldset>

      <button
        type="button"
        className="btn btn--primary"
        disabled={!ready}
        onClick={() => {
          setShown(true);
          /* Counted by route only. The earnings typed are never sent. */
          const route = std === 'yes' ? 'plan' : work === 'yes' ? 'worksafe' : law;
          /* Framed on another site, the route carries `:embed` (15 Oct
             2026), so a partner's readers are counted apart from this
             site's own (EMBEDDED_TOOLS in lib/conversion-detail.ts). */
          const detail = toolDetail('stress-leave-pay-calculator', route);
          track('tool_complete', { tool: 'stress-leave-pay-calculator', route, detail: embed ? `${detail}:embed` : detail });
        }}
      >
        Show me the weeks
      </button>

      {shown && ready && (
        <div className="est-result" aria-live="polite">
          <p className="eyebrow">Your weeks, as an estimate</p>
          <h2>
            {std === 'yes'
              ? 'Sick days first, then your plan’s figures, not ours'
              : `About ${dollars(pic.eiWeekly)} a week from EI${pic.paidDays > 0 ? `, after ${pic.paidDays} paid sick ${pic.paidDays === 1 ? 'day' : 'days'}` : ''}`}
          </h2>

          <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14px, 1fr))', gap: 3, margin: '16px 0 6px' }}>
            {weeks.map((k, i) => (
              <span key={i} title={`Week ${i + 1}`} style={{ height: 22, borderRadius: 3, background: SWATCH[k] }} />
            ))}
          </div>
          <p className="quiz-help">Each block is one week of the leave, from the first day off.</p>

          <ol style={{ paddingLeft: 20 }}>
            {pic.phases.map((p) => (
              <li key={`${p.kind}-${p.fromWeek}`} style={{ marginBottom: 8 }}>
                <span
                  aria-hidden="true"
                  style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, marginRight: 8, background: SWATCH[p.kind], border: '1px solid var(--line)' }}
                />
                <strong>{p.kind === 'after' ? `After week ${p.fromWeek - 1}` : weekRange(p)}:</strong> {describe(p)}
              </li>
            ))}
          </ol>

          {pic.totalPaid !== null && (
            <p>
              Across those {pic.weeksShown} weeks that is about <strong>{dollars(pic.totalPaid)}</strong> before
              tax, against about {dollars(pic.usualTotal)} at your usual pay. EI is taxable, and some
              employers top it up: ask.
            </p>
          )}

          {!federal && pic.unpaidDays > 0 && (
            <p>
              Your {BC_UNPAID_DAYS} unpaid sick days protect the job rather than paying anything; EI
              pays across them. A longer leave in a BC-regulated job is protected for up to 27 weeks in
              a 52-week period by the Employment Standards Act, with a medical certificate.
            </p>
          )}
          {!federal && months < 3 && (
            <p>
              Under 90 days with the employer there are no Employment Standards Act sick days yet,
              paid or unpaid ({BC_PAID_DAYS} paid and {BC_UNPAID_DAYS} unpaid once you reach it), so
              EI is the first income.
            </p>
          )}
          {federal && (
            <p>
              The Canada Labour Code also protects your job through up to {FEDERAL_PROTECTED_WEEKS} weeks
              of medical leave. That is protection, not pay; the money is the sick days and EI.
            </p>
          )}
          <p>
            {waived
              ? `No waiting week: a temporary federal measure waives it for new claims that start by ${waiver.toLabel}.`
              : 'The waiting week applies: EI does not pay the first week of a claim.'}{' '}
            The first payment arrives about 28 days after you apply, so a gap in the bank account is
            normal even when nothing is wrong.
          </p>
          {std === 'unsure' && (
            <p>
              Ask HR whether there is a short-term disability plan before you claim. Where there is
              one it usually comes before EI, and the plan’s terms set the amount.
            </p>
          )}
          {work !== 'no' && (
            <p>
              If work caused it, WorkSafeBC is a separate route: an accepted claim pays wage-loss
              benefits and treatment, at amounts WorkSafeBC sets, and ordinary overload or an
              employer’s decisions about your job are excluded.{' '}
              <SiteLink origin={embed?.origin} href="/resources/worksafebc-psychological-injury-claims">How a WorkSafeBC psychological injury claim works</SiteLink>.
            </p>
          )}
          <p>
            To qualify for EI you need 600 insured hours in the last 52 weeks, weekly earnings down by
            more than 40%, and a medical certificate. Apply within four weeks of your last day of work.
            More detail: <SiteLink origin={embed?.origin} href="/guides/ei-sickness-benefits-and-therapy">what medical EI pays and how to apply</SiteLink>{' '}
            · <SiteLink origin={embed?.origin} href="/resources/workplace-mental-health-bc">how stress leave works in BC</SiteLink>
          </p>

          {!embed && <ResultCta tool="stress-leave-pay-calculator" href={bookHref} />}
          <p className="tool-disclaimer">
            This is an estimate from the figures you entered, not advice and not a decision. Service
            Canada decides your EI, your insurer decides any disability claim and WorkSafeBC decides
            its own claims.
          </p>
        </div>
      )}
    </div>
  );
}

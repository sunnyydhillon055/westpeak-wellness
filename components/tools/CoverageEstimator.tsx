'use client';

import { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';
import ResultCta from '@/components/tools/ResultCta';

/* What a session actually costs after extended health.
 *
 * Everything here is arithmetic on numbers the user supplies plus this
 * practice's own published fees. It quotes no insurer's terms and promises no
 * reimbursement, because plans differ per employer and the only authority on
 * any particular plan is that plan. What it can do honestly is show the shape
 * of the maths and name the two questions that decide the answer.
 */

const FEES = { individual: 140, couples: 170 } as const;
type Kind = keyof typeof FEES;

export default function CoverageEstimator() {
  const [kind, setKind] = useState<Kind>('individual');
  const [covers, setCovers] = useState<'yes' | 'no' | 'unsure'>('unsure');
  const [perSession, setPerSession] = useState('');
  const [annual, setAnnual] = useState('');
  const [shown, setShown] = useState(false);

  const fee = FEES[kind];
  const per = Math.max(0, Number(perSession) || 0);
  const cap = Math.max(0, Number(annual) || 0);
  const backPerSession = Math.min(per, fee);
  const outOfPocket = Math.max(0, fee - backPerSession);
  const sessionsCovered = backPerSession > 0 && cap > 0 ? Math.floor(cap / backPerSession) : null;

  return (
    <div className="quiz">
      <fieldset className="quiz-set">
        <legend className="quiz-q">What would you be booking?</legend>
        <div className="est-row">
          {(['individual', 'couples'] as Kind[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`quiz-choice${kind === k ? ' is-on' : ''}`}
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
            >
              {k === 'individual' ? 'Individual' : 'Couples'} — ${FEES[k]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="quiz-set">
        <legend className="quiz-q">
          Does your plan cover a Registered Clinical Counsellor or a Canadian Certified
          Counsellor?
        </legend>
        {/* BOTH DESIGNATIONS, SINCE 2 SEP 2026. The practice added a counsellor
            holding CCC as well as RCC, and in Alberta the CCC is the one that
            applies — counselling therapy is not regulated there, so there is no
            provincial college and plans name the national certification
            instead. Asking only about the RCC sent an Alberta reader to check
            the wrong word. */}
        <p className="quiz-help">
          This is the question that catches people out — a plan can cover a psychologist and
          neither of the above. Worth one call before booking anything. Ask about both: plans
          differ on which designations they name, and outside BC it is usually the CCC that
          appears.
        </p>
        <div className="est-row">
          {([
            ['yes', 'Yes'],
            ['no', 'No'],
            ['unsure', 'Not sure'],
          ] as const).map(([v, label]) => (
            <button
              key={v}
              type="button"
              className={`quiz-choice${covers === v ? ' is-on' : ''}`}
              aria-pressed={covers === v}
              onClick={() => setCovers(v)}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {covers === 'yes' && (
        <fieldset className="quiz-set">
          <legend className="quiz-q">What does it pay?</legend>
          <div className="est-fields">
            <label htmlFor="per">Per session ($)</label>
            <input
              id="per" inputMode="numeric" pattern="[0-9]*" value={perSession}
              onChange={(e) => setPerSession(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 100"
            />
            <label htmlFor="cap">Per year ($)</label>
            <input
              id="cap" inputMode="numeric" pattern="[0-9]*" value={annual}
              onChange={(e) => setAnnual(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 1000"
            />
          </div>
        </fieldset>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => {
          setShown(true);
          track('tool_complete', { tool: 'therapy-cost-bc', covers });
        }}
      >
        Show me the numbers
      </button>

      {shown && (
        <div className="est-result">
          {covers === 'yes' && per > 0 ? (
            <>
              <p className="eyebrow">Your figures</p>
              <h2>
                About ${outOfPocket} per session out of pocket
              </h2>
              <p>
                A {kind} session is ${fee}. If your plan reimburses ${backPerSession} of that, you
                are paying ${outOfPocket} yourself.
                {sessionsCovered !== null && (
                  <> A ${cap} annual maximum covers roughly {sessionsCovered}{' '}
                  {sessionsCovered === 1 ? 'session' : 'sessions'} before you are paying the full fee.</>
                )}
              </p>
              <p>
                You pay at the time of the session and claim it back — this practice does not
                direct-bill, so the money leaves your account first and returns after.
              </p>
            </>
          ) : covers === 'no' ? (
            <>
              <p className="eyebrow">Your figures</p>
              <h2>${fee} per session, and worth checking the alternatives first</h2>
              <p>
                Before paying privately it is worth ruling out the free entitlements a lot of
                people already have and never use — an EFAP through work, or a student plan.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">Two calls to make</p>
              <h2>The answer depends on two things</h2>
              <p>
                Ask your plan: <strong>does it cover a Registered Clinical Counsellor
                specifically</strong>, and <strong>what is the per-session and annual
                maximum</strong>. Those two answers decide everything else. A plan that covers
                only a psychologist will not reimburse an RCC or a CCC, and that is the detail people
                most often discover after their first session rather than before it.
              </p>
            </>
          )}

          <p>
            More detail:{' '}
            <Link href="/resources/bc-extended-health-coverage-for-counselling">
              extended health coverage in BC
            </Link>{' '}
            ·{' '}
            <Link href="/resources/msp-vs-extended-health">what MSP does and does not cover</Link>{' '}
            · <Link href="/resources/low-cost-counselling-bc">low-cost counselling in BC</Link> ·{' '}
            <Link href="/pricing">full fees</Link>
          </p>

          <ResultCta tool="therapy-cost-bc" />
          <p className="tool-disclaimer">
            An estimate from the numbers you entered, not a quote, and not advice about your
            plan. Only your insurer can confirm what it will pay.
          </p>
        </div>
      )}
    </div>
  );
}

import { STUDENT_PLANS, paysLabel, readOn, sessionsCovered, studentPlansCheckedOn } from '@/lib/student-plans';

/* WHAT EACH BC STUDENT-SOCIETY PLAN PAYS FOR AN RCC — 1 Oct 2026.
 *
 * Server component. The rows come from lib/student-plans.ts, each with the
 * plan page it was read from; the session count is worked out from the
 * individual-session fee the page passes in, which the page reads from the
 * Cliniko catalogue. Nothing here is typed twice.
 *
 * `fee` is optional so a page that cannot read the catalogue still shows the
 * plans, without a sessions column built on a number nobody charges. */
export default function StudentPlanTable({ fee }: { fee?: number }) {
  const showSessions = typeof fee === 'number' && fee > 0;
  return (
    <div className="student-plans">
      <div className="table-scroll" style={{ margin: '8px 0 14px' }}>
        <table className="fee-table" style={{ minWidth: 680 }}>
          <caption className="sr-only">What BC student-society health plans pay for a Registered Clinical Counsellor</caption>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Pays</th>
              <th>Yearly maximum</th>
              {showSessions && <th>Sessions at ${fee}</th>}
              <th>Names the RCC?</th>
              <th>Referral</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {STUDENT_PLANS.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  {p.name}
                  <br />
                  <span style={{ fontWeight: 400, fontSize: '.88em', color: 'var(--ink-soft)' }}>{p.institution}</span>
                </td>
                <td style={{ fontWeight: 400 }}>{paysLabel(p)}</td>
                <td style={{ fontWeight: 400 }}>${p.annualMax.toLocaleString('en-CA')}</td>
                {showSessions && <td style={{ fontWeight: 400 }}>{sessionsCovered(p, fee as number)}</td>}
                <td style={{ fontWeight: 400 }}>{p.namesRcc ? 'Yes' : 'Says “counsellor”; ask'}</td>
                <td style={{ fontWeight: 400 }}>{p.referral}</td>
                <td style={{ fontWeight: 400 }}>
                  <a href={p.source} target="_blank" rel="noopener">Plan page</a>
                  <br />
                  <span style={{ fontSize: '.88em', color: 'var(--ink-soft)' }}>read {readOn(p.checkedOn)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)' }}>
        Read from each plan’s own page on {readOn(studentPlansCheckedOn())}. The yearly maximum is
        shared with psychologists and social workers, so anything already claimed this year comes
        off it.{showSessions && <> The sessions column is the maximum divided by what the plan pays
        back on one ${fee} individual session.</>} Plans change each policy year and coverage is
        whatever your plan’s booklet says; check it before the first session. You pay at booking
        and claim the receipt; the practice does not bill the plan.
      </p>
    </div>
  );
}

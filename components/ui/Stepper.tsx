import { PROCESS_ICONS } from '@/lib/icon-map';

export type Step = { step: string; title: string; body: string };

/* Connected timeline. The joining line is drawn by CSS between the numbered
 * chips rather than as a border on the row, so it reads as one continuous
 * thread and stops cleanly before the last item. */
export default function Stepper({ steps }: { steps: Step[] }) {
  return (
    <ol className="stepper" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {steps.map((s, i) => {
        const Icon = PROCESS_ICONS[i] ?? PROCESS_ICONS[PROCESS_ICONS.length - 1];
        return (
          <li className="stepper-item" key={s.title}>
            <span className="stepper-num" aria-hidden="true">
              <Icon strokeWidth={1.6} />
            </span>
            <div className="stepper-body">
              <span className="stepper-step">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

import type { CrisisLine } from '@/lib/crisis';
import { CRISIS_VERIFIED } from '@/lib/crisis';

/* Province-correct crisis numbers, rendered as tel: links.
 *
 * A BC number on an Alberta page is a safety failure rather than an SEO detail,
 * which is why the list is built in lib/crisis.ts from the province rather than
 * hardcoded anywhere. Every number there was checked against the operator's own
 * site; the verification date is printed so a reader can see how fresh it is
 * and so a stale block is visible rather than silent.
 *
 * tel: on every entry, because the realistic reader is on a phone and the
 * difference between a number you can tap and a number you must memorise and
 * re-type is not small at three in the morning.
 */
export default function CrisisBlock({
  lines,
  province,
}: {
  lines: CrisisLine[];
  province: string;
}) {
  return (
    <aside className="crisis" aria-labelledby="crisis-h">
      <h2 id="crisis-h" style={{ marginTop: 0 }}>
        If you need help now, in {province}
      </h2>
      <p>
        This practice runs scheduled sessions and has no on-call line. If something is urgent,
        these do not wait.
      </p>
      <ul>
        {lines.map((l) => (
          <li key={l.number}>
            <strong>{l.name}</strong> —{' '}
            <a href={`tel:${l.dial}`}>{l.number}</a>
            <br />
            <span style={{ color: 'var(--ink-faint)', fontSize: '.92em' }}>{l.detail}</span>
          </li>
        ))}
      </ul>
      <p style={{ color: 'var(--ink-faint)', fontSize: '.86em', marginBottom: 0 }}>
        Numbers checked {CRISIS_VERIFIED}.
      </p>
    </aside>
  );
}

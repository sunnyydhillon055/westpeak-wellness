import type { ReactNode } from 'react';
import { getExtra } from '@/lib/depth';
import { headingId } from '@/lib/toc';
import { Paragraphs, rich } from '@/lib/rich';

/* Renders the additional page sections held in lib/depth-*.ts.
 *
 * These are a real part of the article — on the longer guides they are close to
 * half of it — so they take their share of the mid-article devices too.
 *
 * Passing the device list through here is what stops the spacing from being
 * computed across the whole page but applied to only the first half of it,
 * which relocates the wall rather than removing it: before this, the Gottman
 * guide's last device sat at 3,647px and the next was at 7,211px.
 *
 * `offset` is the number of sections that came before, so a slot index computed
 * against the combined list resolves to the right section here. */
export default function ExtraSections({
  area,
  slug,
  devices,
  slots,
  offset = 0,
}: {
  area: string;
  slug: string;
  devices?: ReactNode[];
  slots?: number[];
  offset?: number;
}) {
  const sections = getExtra(area, slug);
  if (!sections.length) return null;

  return (
    <>
      {sections.map((s, i) => (
        <div key={s.h2}>
          <h2 id={headingId(s.h2)}>{s.h2}</h2>
          {s.body && <Paragraphs items={s.body} />}
          {s.list && (
            <ul className="checklist" style={{ margin: '20px 0 28px' }}>
              {s.list.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong> — {rich(item.detail)}
                </li>
              ))}
            </ul>
          )}
          {devices && slots ? devices.filter((_, k) => slots[k] === offset + i) : null}
        </div>
      ))}
    </>
  );
}

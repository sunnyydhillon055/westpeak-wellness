import { getExtra } from '@/lib/depth';
import { headingId } from '@/lib/toc';
import { Paragraphs, rich } from '@/lib/rich';

/* Renders the additional page sections held in lib/depth-*.ts. */
export default function ExtraSections({ area, slug }: { area: string; slug: string }) {
  const sections = getExtra(area, slug);
  if (!sections.length) return null;

  return (
    <>
      {sections.map((s) => (
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
        </div>
      ))}
    </>
  );
}

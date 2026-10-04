import Link from 'next/link';
import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import type { Practitioner } from '@/lib/practitioners';
import type { Catalog } from '@/lib/cliniko-catalog';
import { compareColumns, groupMissing, orList } from '@/lib/practitioner-facts';
import { FirstOpen } from '@/components/NextConsultSlot';

/* "CAMILLE OR SAVNEET?" — 2 Oct 2026.
 *
 * The two profiles ran to about 2,000 words each with eleven closed answers,
 * and nothing set the counsellors taking new clients side by side. This does,
 * and types nothing: every cell comes from compareColumns() in
 * lib/practitioner-facts.ts (the gated roster, OFFERINGS, her own published
 * answers, the Cliniko catalogue) or, for the next free consultation, from
 * the same thirty-minute availability cache as the profile hero, read by
 * the browser since 3 Oct 2026. Those times
 * are Pacific and are labelled so; they are what Cliniko offers, not hours.
 *
 * On /practitioners it is open, under "How to choose between counsellors";
 * on each profile it is a closed block. No registration numbers.
 *
 * A SERVER component: it reads the roster on the server and the browser gets
 * a table and BookLink's two strings. Renders nothing with fewer than two
 * counsellors taking new clients, since a comparison of one is a profile. */
export default function CounsellorCompare({
  roster,
  catalog,
  location,
  collapsed = false,
}: {
  roster: readonly Practitioner[];
  catalog: Catalog;
  location: string;
  collapsed?: boolean;
}) {
  const cols = compareColumns(roster, catalog);
  if (cols.length < 2) return null;

  const firsts = cols.map((c) => c.first);
  const title = `Deciding between ${firsts.slice(0, -1).join(', ')} and ${firsts[firsts.length - 1]}?`;

  const rows: { label: string; cell: (c: (typeof cols)[number]) => React.ReactNode }[] = [
    { label: 'Languages', cell: (c) => c.languages },
    {
      label: 'What she offers',
      cell: (c) => (
        <>
          {c.offers}.
          {/* One sentence per colleague set: "For couples counselling, EMDR
              or family counselling: Camille." */}
          {groupMissing(c.missing).map((g) => (
            <span key={g.labels.join()}>
              {' '}For {orList(g.labels)}:{' '}
              {g.by.map((b, i) => (
                <span key={b.slug}>{i ? ' or ' : ''}<Link href={`/practitioners/${b.slug}`}>{b.name.split(' ')[0]}</Link></span>
              ))}.
            </span>
          ))}
        </>
      ),
    },
    { label: 'Where', cell: (c) => c.where },
    { label: 'How she works', cell: (c) => (c.approaches.length ? c.approaches.join(', ') : '—') },
    {
      label: 'Probably not the right fit',
      cell: (c) => (c.notRightFit ? <>In her words: &ldquo;{c.notRightFit}&rdquo;</> : '—'),
    },
    {
      label: 'Fees',
      cell: (c) => (c.fees.length ? c.fees.map((f) => <span key={f} style={{ display: 'block' }}>{f}</span>) : '—'),
    },
    {
      label: 'Next free consultation',
      /* Filled in by the browser since 3 Oct 2026 (item 429), so the pages
         that carry this table can be fully static. Until the time arrives,
         and when there is none, the cell links her calendar. */
      cell: (c) => {
        const href = `${site.bookingPath}?with=${c.slug}#calendar`;
        return (
          <FirstOpen
            slug={c.slug}
            suffix={<>,{' '}<BookLink location={location} className="" href={href}>book with {c.first}</BookLink></>}
            fallback={
              <BookLink location={location} className="" href={href}>
                The calendar shows {c.first}&rsquo;s open times
              </BookLink>
            }
          />
        );
      },
    },
  ];

  const table = (
    <div style={{ overflowX: 'auto', marginTop: 14 }}>
      <table className="fee-table counsellor-compare">
        {!collapsed && <caption className="sr-only">{title}</caption>}
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Question</span></th>
            {cols.map((c) => (
              <th scope="col" key={c.slug}>
                <Link href={`/practitioners/${c.slug}`}>{c.name}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" style={{ verticalAlign: 'top' }}>{r.label}</th>
              {/* fee-table bolds its last column (the price); here every
                  column is a counsellor, so none is bolder than another. */}
              {cols.map((c) => <td key={c.slug} style={{ fontWeight: 400, color: 'var(--ink)', verticalAlign: 'top' }}>{r.cell(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return collapsed ? (
    <details className="faq-item" style={{ marginTop: 24 }}>
      <summary>{title}</summary>
      {table}
    </details>
  ) : (
    table
  );
}

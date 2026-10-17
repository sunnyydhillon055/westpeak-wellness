import Link from 'next/link';
import BookLink from '@/components/BookLink';
import { site } from '@/lib/site';
import type { Practitioner } from '@/lib/practitioners';
import type { Catalog } from '@/lib/cliniko-catalog';
import { compareColumns, groupMissing, orList, andList, altBookings } from '@/lib/practitioner-facts';
import { bookHrefFor, profileHrefFor } from '@/lib/city-service-page';
import { FirstOpen } from '@/components/NextConsultSlot';

/* "…; Camille Granda does: book couples counselling with Camille, or book
 * EMDR or family counselling with Camille." — 16 Oct 2026 (item 561).
 *
 * The not-offered sentence on the profile, the place pages and in the
 * comparison used to link only the colleague's profile. Each link here books
 * her for what the reader came for (couples work opens the couples
 * consultation), counted as 'not-offered-alt'; her name stays a link to her
 * page. Only for one bookable colleague: with two, or one who books by reply,
 * the names link their pages as before. Server-only, like the rest of this
 * file. */
export function NotOfferedLinks({
  by,
  labels,
  services,
  roster,
  verb,
  citySlug,
}: {
  /** After the names: "does", "offers couples counselling and EMDR". */
  verb: string;
  by: readonly { slug: string; name: string }[];
  labels: readonly string[];
  services: readonly string[];
  roster: readonly Practitioner[];
  citySlug?: string;
}) {
  const one = by.length === 1 ? roster.find((q) => q.slug === by[0]!.slug) : undefined;
  const page = (q: { slug: string }) => {
    const full = roster.find((r) => r.slug === q.slug);
    return full && citySlug ? profileHrefFor(full, citySlug) : `/practitioners/${q.slug}`;
  };
  const names = by.map((b, i) => (
    <span key={b.slug}>{i ? ' and ' : ''}<Link href={page(b)}>{b.name}</Link></span>
  ));
  if (!one?.bookable) return <>{names} {verb}</>;
  const first = one.name.split(' ')[0];
  return (
    <>
      {names} {verb}
      {altBookings(labels, services).map((b, i) => (
        <span key={b.labels.join()}>
          {i ? ', or ' : ': '}
          <BookLink location="not-offered-alt" className="" href={bookHrefFor([one], b.service)}>
            book {orList(b.labels)} with {first}
          </BookLink>
        </span>
      ))}
    </>
  );
}

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
const OPEN_ON_HASH =
  "(function(){function o(){if(location.hash==='#compare'){var d=document.getElementById('compare');if(d&&d.tagName==='DETAILS')d.open=true}}o();addEventListener('hashchange',o)})()";

export default function CounsellorCompare({
  roster,
  catalog,
  location,
  collapsed = false,
  citySlug,
  brief = false,
}: {
  roster: readonly Practitioner[];
  catalog: Catalog;
  location: string;
  collapsed?: boolean;
  /** On a counsellor place page: each header links her page for the same
   *  city when she has one (item 583, 16 Oct 2026). */
  citySlug?: string;
  /** The rows that decide between them and nothing else: languages, what
   *  she offers, what she often works with, the next consultation. For the
   *  place pages, where the full table made each city's two counsellor pages
   *  64% alike against the uniqueness gate's 62% ceiling (16 Oct 2026
   *  build); with these four rows the worst pair is 59%. */
  brief?: boolean;
}) {
  const cols = compareColumns(roster, catalog);
  if (cols.length < 2) return null;

  const header = (slug: string) => {
    const p = roster.find((q) => q.slug === slug);
    return p && citySlug ? profileHrefFor(p, citySlug) : `/practitioners/${slug}`;
  };
  const firsts = cols.map((c) => c.first);
  const title = `Deciding between ${firsts.slice(0, -1).join(', ')} and ${firsts[firsts.length - 1]}?`;

  const rows: { label: string; cell: (c: (typeof cols)[number]) => React.ReactNode }[] = [
    { label: 'Languages', cell: (c) => c.languages },
    {
      label: 'What she offers',
      cell: (c) => (
        <>
          {c.offers}.
          {/* One sentence per colleague set, booking her for each since
              16 Oct 2026 (item 561): "Camille Granda offers couples
              counselling, EMDR and family counselling: book couples
              counselling with Camille, or book EMDR or family counselling
              with Camille." */}
          {groupMissing(c.missing).map((g) => (
            <span key={g.labels.join()}>
              {' '}
              <NotOfferedLinks
                by={g.by}
                labels={g.labels}
                services={g.services}
                roster={roster}
                citySlug={citySlug}
                verb={`${g.by.length > 1 ? 'offer' : 'offers'} ${andList(g.labels)}`}
              />.
            </span>
          ))}
        </>
      ),
    },
    /* Her focus labels and who she sees, 16 Oct 2026 (item 572): a grief
       seeker and a depression seeker used to read identical rows. */
    { label: 'Often works with', cell: (c) => c.worksWith },
    {
      label: 'Who she sees',
      cell: (c) => (
        <>
          {c.sees}.
          {c.seesWords ? <> In her words: &ldquo;{c.seesWords}&rdquo;</> : null}
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

  const BRIEF = ['Languages', 'What she offers', 'Often works with', 'Next free consultation'];
  const shown = brief ? rows.filter((r) => BRIEF.includes(r.label)) : rows;

  const table = (
    <div style={{ overflowX: 'auto', marginTop: 14 }}>
      <table className="fee-table counsellor-compare">
        {!collapsed && <caption className="sr-only">{title}</caption>}
        <thead>
          <tr>
            <th scope="col"><span className="sr-only">Question</span></th>
            {cols.map((c) => (
              <th scope="col" key={c.slug}>
                <Link href={header(c.slug)}>{c.name}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
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

  /* id="compare" (15 Oct 2026): /book's choosing cards link
     /practitioners#compare. One comparison per page, so one id. */
  /* Opened when the address ends in #compare, on arrival or when the
     profile's "compare" link under the hero is followed (item 562, 16 Oct
     2026). A few bytes inline on the pages that carry the closed table, not
     a client component and not layout JS. */
  return collapsed ? (
    <>
      <details className="faq-item" id="compare" style={{ marginTop: 24, scrollMarginTop: 72 }}>
        <summary>{title}</summary>
        {table}
      </details>
      <script dangerouslySetInnerHTML={{ __html: OPEN_ON_HASH }} />
    </>
  ) : (
    <div id="compare" style={{ scrollMarginTop: 72 }}>{table}</div>
  );
}

/* A visible date on pages that had one only in their structured data.
 *
 * The 6 Sep 2026 scorecard found 158 pages — the city pages, the city × service
 * pages, the counsellor pages, the hubs — carrying datePublished/dateModified
 * in JSON-LD and nothing a reader could see. A reader and a crawler both take
 * an undated health page as "unknown age". This is one line, from the same
 * date the schema already uses, so the two cannot disagree.
 *
 * "Updated", never "Reviewed": see components/Byline.tsx and the decision
 * register. A review date is a claim a person makes; this is a commit date. */
export default function Updated({ iso, className = 'hero-note' }: { iso: string | null | undefined; className?: string }) {
  if (!iso) return null;
  const shown = new Date(iso.slice(0, 10) + 'T00:00:00Z').toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
  return <p className={className}>Updated {shown}</p>;
}

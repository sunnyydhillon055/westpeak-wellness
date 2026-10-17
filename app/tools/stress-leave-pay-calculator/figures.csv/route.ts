import { leavePayFiguresCsv } from '@/lib/benefit-figures';

/* THE CALCULATOR'S FIGURES AS A FILE — 16 Oct 2026 (item 579).
 *
 * docs/REACH-2026-10-15.md points every press and organisation send at the
 * figures table on /tools/stress-leave-pay-calculator. A newsroom or an HR
 * team that wants the numbers in a spreadsheet had to copy them out of the
 * page. This is the same table, built from the same rows in
 * lib/benefit-figures.ts: figure, value, the government page it comes from,
 * that page's address and the date it was read. Static, like the page: a
 * build is what moves it, so it can never say something the page does not.
 * The page's Dataset node names this file as its download. */
export const dynamic = 'force-static';

export function GET() {
  return new Response(leavePayFiguresCsv(), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'inline; filename="bc-stress-leave-pay-figures.csv"',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}

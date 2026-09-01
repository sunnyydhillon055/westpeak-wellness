import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/portal-store';
import { paidSessionsWorkbook } from '@/lib/paid-sessions';
import { CONSULT_TYPE } from '@/lib/site';

/* Downloadable detail behind "Paid sessions" in the monthly report.
 *
 * ADMIN ONLY, and not negotiable: the workbook contains client names against
 * amounts paid. That is health-adjacent financial information about
 * identifiable people, so it sits behind the same auth() + isAdmin() check as
 * the client list, and never behind a shareable link or an unguessable URL.
 *
 * ?month=YYYY-MM selects a period; the default is the month the report covers.
 *
 * Deliberately no caching header beyond no-store. A month's figures change as
 * invoices close, and a stale spreadsheet that looks authoritative is worse
 * than one more request to Cliniko.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const session = await auth();
  const admin = session?.user?.email;
  if (!admin || !isAdmin(admin)) {
    return NextResponse.redirect(new URL('/signin?next=%2Fadmin', req.url), 303);
  }

  const month = req.nextUrl.searchParams.get('month') ?? undefined;
  const result = await paidSessionsWorkbook(month, CONSULT_TYPE);

  if (result.status === 'unconfigured') {
    return NextResponse.json(
      { error: 'CLINIKO_API_KEY is not set on this deployment' },
      { status: 503 }
    );
  }
  if (result.status === 'error') {
    return NextResponse.json({ error: result.detail }, { status: 502 });
  }

  return new NextResponse(new Uint8Array(result.xlsx), {
    status: 200,
    headers: {
      'content-type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-disposition': `attachment; filename="${result.filename}"`,
      'content-length': String(result.xlsx.length),
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}

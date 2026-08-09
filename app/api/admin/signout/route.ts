import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/portal-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/admin/enter', req.url), 303);
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}

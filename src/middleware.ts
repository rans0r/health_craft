import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, locales } from '@/i18n/config';

const WINDOW_MS = 60 * 1000;
const MAX_REQ = 60;
const ipMap = new Map<string, { count: number; start: number }>();

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.ip ?? '127.0.0.1';
    const now = Date.now();
    const record = ipMap.get(ip) || { count: 0, start: now };
    if (now - record.start > WINDOW_MS) {
      record.count = 0;
      record.start = now;
    }
    record.count++;
    ipMap.set(ip, record);
    if (record.count > MAX_REQ) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/(?!api|_next|_vercel|.*\\..*).*', '/api/:path*'],
};

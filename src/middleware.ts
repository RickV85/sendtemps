import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const allowedCountryCodes = ['US', 'CA'];

export function middleware(req: NextRequest) {
  const country = req.geo?.country;

  if (process.env.NODE_ENV === 'production' && country && !allowedCountryCodes.includes(country)) {
    const html = `<!doctype html><html><body><h1>Access Restricted</h1><p>Available only in US & Canada.</p></body></html>`;
    return new NextResponse(html, {
      status: 451,
      headers: { 'content-type': 'text/html' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'],
};

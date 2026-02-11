import { NextRequest, NextResponse } from 'next/server';

/**
 * Cached data endpoint - returns data with a timestamp.
 * Project-level route rules should set Cache-Control and Cache-Tag headers
 * on responses from this endpoint.
 */
export async function GET(request: NextRequest) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return NextResponse.json({
    message: 'Cached data endpoint',
    timestamp: new Date().toISOString(),
    note: 'If Cache-Control headers are set by route rules, this response will be cached. Compare timestamps on repeated requests.',
    data: {
      items: [
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 49.99 },
        { id: 3, name: 'Product C', price: 99.99 },
      ],
      total: 3,
    },
    requestHeaders: headers,
  });
}

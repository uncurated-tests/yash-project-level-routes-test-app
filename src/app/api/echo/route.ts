import { NextRequest, NextResponse } from 'next/server';

/**
 * Echo endpoint - returns full request details.
 * Useful for testing external rewrite scenarios locally,
 * and for verifying that headers are being injected correctly.
 */
export async function GET(request: NextRequest) {
  return echoRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  const body = await request.text().catch(() => '');
  return echoRequest(request, 'POST', body);
}

export async function PUT(request: NextRequest) {
  const body = await request.text().catch(() => '');
  return echoRequest(request, 'PUT', body);
}

export async function DELETE(request: NextRequest) {
  return echoRequest(request, 'DELETE');
}

async function echoRequest(request: NextRequest, method: string, body?: string) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let parsedBody = null;
  if (body) {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
  }

  return NextResponse.json({
    echo: true,
    method,
    url: request.url,
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    headers,
    body: parsedBody,
    timestamp: new Date().toISOString(),
  });
}

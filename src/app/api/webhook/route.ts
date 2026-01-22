import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return NextResponse.json({
    message: 'Webhook received!',
    method: 'POST',
    body: body || '(empty)',
    headers,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
      allowedMethods: ['POST'],
    },
    { status: 405 }
  );
}

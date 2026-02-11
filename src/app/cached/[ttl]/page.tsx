import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

interface CachedTtlPageProps {
  params: Promise<{ ttl: string }>;
}

export default async function CachedTtlPage({ params }: CachedTtlPageProps) {
  const { ttl } = await params;
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const ttlSeconds = parseInt(ttl, 10);
  const isValidTtl = !isNaN(ttlSeconds) && ttlSeconds > 0;
  const now = new Date().toISOString();

  const humanReadableTtl = isValidTtl
    ? ttlSeconds >= 86400
      ? `${(ttlSeconds / 86400).toFixed(1)} days`
      : ttlSeconds >= 3600
        ? `${(ttlSeconds / 3600).toFixed(1)} hours`
        : ttlSeconds >= 60
          ? `${(ttlSeconds / 60).toFixed(1)} minutes`
          : `${ttlSeconds} seconds`
    : 'invalid';

  return (
    <main>
      <PathIndicator />

      <h1>Cache Test: {ttl}s TTL</h1>
      <p>
        Dynamic cache test page. The route rule should set Cache-Control headers
        based on the path parameter.
      </p>

      <div className="card" style={{
        background: isValidTtl ? 'var(--success-light)' : 'var(--warning-light)',
        borderColor: isValidTtl ? 'var(--success)' : 'var(--warning)'
      }}>
        <h4 style={{
          color: isValidTtl ? 'var(--success)' : 'var(--warning)',
          margin: '0 0 0.5rem 0'
        }}>
          {isValidTtl ? `TTL: ${humanReadableTtl}` : 'Invalid TTL'}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>TTL parameter: <code>{ttl}</code></li>
          <li>Server render time: <code>{now}</code></li>
        </ul>
      </div>

      <p style={{ fontSize: '0.875rem' }}>
        Reload this page to check if the timestamp changes. If it stays the same, the
        cache is working. Try different TTL values:
      </p>
      <ul>
        <li><a href="/cached/10">/cached/10</a> (10 seconds)</li>
        <li><a href="/cached/60">/cached/60</a> (1 minute)</li>
        <li><a href="/cached/300">/cached/300</a> (5 minutes)</li>
        <li><a href="/cached/3600">/cached/3600</a> (1 hour)</li>
      </ul>

      <h2>Example Rule</h2>
      <pre><code>{`// Per-path TTL using the route parameter is not directly supported,
// but you can set fixed TTLs on path patterns:
{
  "src": "^/cached/60$",
  "headers": {
    "Cache-Control": "public, max-age=60, s-maxage=60",
    "Cache-Tag": "cached-60s"
  },
  "continue": true
}

// Or a blanket rule for all /cached/* paths:
{
  "src": "^/cached/(.+)$",
  "headers": {
    "Cache-Control": "public, max-age=300, s-maxage=600",
    "Cache-Tag": "cached-dynamic"
  },
  "continue": true
}`}</code></pre>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['cache-control', 'cdn-cache-control', 'cache-tag']}
      />
    </main>
  );
}

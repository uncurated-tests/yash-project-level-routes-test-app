import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function CachedPage() {
  const headersList = await headers();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const now = new Date().toISOString();

  return (
    <main>
      <PathIndicator />

      <h1>Cache Control Test</h1>
      <p>
        Test dynamically setting <code>Cache-Control</code>, <code>CDN-Cache-Control</code>,
        and <code>Cache-Tag</code> headers via project-level route rules.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Server Timestamp
        </h4>
        <p style={{ margin: 0 }}>
          Rendered at: <code>{now}</code>
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
          If this page is cached, reloading will show the same timestamp until the cache expires.
        </p>
      </div>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/cached">/cached</a> (this page)</li>
        <li><a href="/cached/60">/cached/60</a> (60s TTL test page)</li>
        <li><a href="/cached/3600">/cached/3600</a> (1hr TTL test page)</li>
        <li><a href="/cached/86400">/cached/86400</a> (24hr TTL test page)</li>
        <li><a href="/api/cached-data">/api/cached-data</a> (API endpoint with cache headers)</li>
      </ul>

      <h2>Example Rules</h2>

      <h3>Set Cache-Control on Static Pages</h3>
      <pre><code>{`{
  "src": "^/cached(/.*)?$",
  "headers": {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "CDN-Cache-Control": "public, max-age=86400"
  },
  "continue": true
}`}</code></pre>

      <h3>Set Cache Tags for Purging</h3>
      <pre><code>{`{
  "src": "^/cached(/.*)?$",
  "headers": {
    "Cache-Tag": "static-content, cached-pages",
    "Cache-Control": "public, s-maxage=3600"
  },
  "continue": true
}`}</code></pre>

      <h3>API Cache with Short TTL</h3>
      <pre><code>{`{
  "src": "^/api/cached-data$",
  "headers": {
    "Cache-Control": "public, max-age=60, s-maxage=300",
    "CDN-Cache-Control": "public, max-age=300",
    "Cache-Tag": "api-data"
  },
  "continue": true
}`}</code></pre>

      <h3>No-Cache for Dynamic Paths</h3>
      <pre><code>{`{
  "src": "^/api/(data|webhook)$",
  "headers": {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "CDN-Cache-Control": "no-store"
  },
  "continue": true
}`}</code></pre>

      <h2>How to Verify</h2>
      <pre><code>{`# Check response headers
curl -I https://your-app.vercel.app/cached

# Look for:
#   Cache-Control: public, max-age=3600, s-maxage=86400
#   CDN-Cache-Control: public, max-age=86400
#   Cache-Tag: static-content, cached-pages

# Check API endpoint
curl -I https://your-app.vercel.app/api/cached-data`}</code></pre>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['cache-control', 'cdn-cache-control', 'cache-tag']}
      />
    </main>
  );
}

import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function ApiTargetCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>API Target (Catch-All)</h1>
      <p>This page catches all paths under /api-target/</p>

      <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Captured Path Segments
        </h4>
        <p style={{ margin: 0, fontFamily: 'ui-monospace, monospace' }}>
          {slug.map((s, i) => (
            <span key={i}>
              {i > 0 && ' / '}
              <code>{s}</code>
            </span>
          ))}
        </p>
      </div>

      <h2>Path Info</h2>
      <ul>
        <li>Full path: <code>/api-target/{slug.join('/')}</code></li>
        <li>Segments: <code>{JSON.stringify(slug)}</code></li>
        <li>Segment count: {slug.length}</li>
      </ul>

      <h2>Example Rewrite Rules</h2>

      <h3>Forward All Paths</h3>
      <pre><code>{`{
  "src": "/v2/(.+)",
  "dest": "/api-target/$1"
}`}</code></pre>

      <h3>Prefix Rewrite</h3>
      <pre><code>{`{
  "src": "/legacy/:path*",
  "dest": "/api-target/:path*"
}`}</code></pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/api-target/users">/api-target/users</a></li>
        <li><a href="/api-target/users/123">/api-target/users/123</a></li>
        <li><a href="/api-target/users/123/posts">/api-target/users/123/posts</a></li>
      </ul>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-']}
      />
    </main>
  );
}

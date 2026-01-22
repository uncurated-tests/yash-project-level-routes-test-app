import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function ApiTarget() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>API Target</h1>
      <p>This page serves as a destination for rewrite rules.</p>

      <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Rewrite Destination
        </h4>
        <p style={{ margin: 0 }}>
          If you were rewritten here from another URL, check your browser&apos;s address bar - 
          it should still show the original URL.
        </p>
      </div>

      <h2>Example Rewrite Rules</h2>

      <h3>Simple Rewrite</h3>
      <pre><code>{`{
  "src": "/external-api",
  "dest": "/api-target"
}`}</code></pre>

      <h3>With Path Parameters</h3>
      <pre><code>{`{
  "src": "/v1/api/:path*",
  "dest": "/api-target/:path*"
}`}</code></pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/api-target">/api-target</a> (direct)</li>
        <li><a href="/api-target/users/123">/api-target/users/123</a> (catch-all)</li>
        <li><a href="/external-api">/external-api</a> (needs rewrite rule)</li>
      </ul>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-']}
      />
    </main>
  );
}

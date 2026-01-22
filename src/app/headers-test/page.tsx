import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function HeadersTest() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  // Highlight custom/interesting headers
  const customHeaders = Object.entries(allHeaders).filter(([key]) =>
    key.startsWith('x-') || key === 'cache-control' || key === 'authorization'
  );

  return (
    <main>
      <PathIndicator />
      
      <h1>Headers Test</h1>
      <p>This page displays all request headers. Use it to verify header routing rules are working.</p>

      {customHeaders.length > 0 ? (
        <div className="card" style={{ background: 'var(--success-light)', borderColor: 'var(--success)' }}>
          <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>
            Custom Headers Detected ({customHeaders.length})
          </h4>
          <pre style={{ background: 'transparent', margin: 0 }}>
            <code>{JSON.stringify(Object.fromEntries(customHeaders), null, 2)}</code>
          </pre>
        </div>
      ) : (
        <div className="card" style={{ background: 'var(--warning-light)', borderColor: 'var(--warning)' }}>
          <h4 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>No Custom Headers</h4>
          <p style={{ margin: 0 }}>Add a header rule to see custom headers appear here.</p>
        </div>
      )}

      <h2>Example Header Rules</h2>

      <h3>Add Custom Header</h3>
      <pre><code>{`{
  "src": "/headers-test",
  "headers": {
    "X-Custom-Header": "my-value",
    "X-Request-Id": "12345"
  },
  "continue": true
}`}</code></pre>

      <h3>Add Headers to All Routes</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "headers": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff"
  },
  "continue": true
}`}</code></pre>

      <h3>Cache Control Headers</h3>
      <pre><code>{`{
  "src": "/api/(.*)",
  "headers": {
    "Cache-Control": "no-store, must-revalidate"
  },
  "continue": true
}`}</code></pre>

      <HeadersDisplay 
        headers={allHeaders} 
        title="All Request Headers"
        defaultOpen={true}
        highlight={['x-', 'cache-control', 'authorization']}
      />
    </main>
  );
}

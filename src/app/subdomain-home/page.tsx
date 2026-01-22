import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function SubdomainHome() {
  const headersList = await headers();
  const host = headersList.get('host');

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>Subdomain Home</h1>
      <p>Target page for host-based routing rules.</p>

      <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Current Host
        </h4>
        <p style={{ margin: 0, fontFamily: 'ui-monospace, monospace' }}>
          <code>{host}</code>
        </p>
      </div>

      <h2>Example Rules</h2>

      <h3>Match Subdomain Prefix</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "pre": "app." } }]
}`}</code></pre>

      <h3>Match Exact Host</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": "app.example.com" }]
}`}</code></pre>

      <h3>Match Host Suffix</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "suf": ".example.com" } }]
}`}</code></pre>

      <h3>Match Host with Regex</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "re": "^(app|dashboard)\\\\..*" } }]
}`}</code></pre>

      <h2>How to Test Locally</h2>
      <p>Add entries to your <code>/etc/hosts</code> file:</p>
      <pre><code>{`127.0.0.1  app.localhost
127.0.0.1  dashboard.localhost`}</code></pre>
      <p>Then visit <code>http://app.localhost:3000</code></p>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['host']}
      />
    </main>
  );
}

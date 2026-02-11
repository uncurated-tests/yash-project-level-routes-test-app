import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function DocsPage() {
  const headersList = await headers();
  const host = headersList.get('host');

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />

      <h1>Docs (Multi-Tenant Target)</h1>
      <p>
        This page is the target for multi-tenant documentation rewrites. In a real setup,
        requests to <code>/docs</code> would be rewritten to an external documentation provider
        like Mintlify or Flint. This page exists as a fallback/verification target.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          Current Host: <code>{host}</code>
        </h4>
        <p style={{ margin: 0 }}>
          If this page is being served instead of external docs, the external rewrite rule
          is either not active or not matching.
        </p>
      </div>

      <h2>Multi-Tenant Scenarios</h2>

      <h3>Mintlify-style Docs Rewrite</h3>
      <pre><code>{`{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://your-org.mintlify.dev/docs/$1"
}`}</code></pre>

      <h3>Flint-style Docs Rewrite</h3>
      <pre><code>{`{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://your-org.flint.sh/docs/$1"
}`}</code></pre>

      <h3>Per-Tenant Docs (Host-based)</h3>
      <pre><code>{`// Tenant A gets Mintlify
{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://tenant-a.mintlify.dev/docs/$1",
  "has": [{ "type": "host", "value": { "pre": "tenant-a." } }]
}

// Tenant B gets Flint
{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://tenant-b.flint.sh/docs/$1",
  "has": [{ "type": "host", "value": { "pre": "tenant-b." } }]
}`}</code></pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/docs">/docs</a> (this page, or external if rewrite active)</li>
        <li><a href="/docs/getting-started">/docs/getting-started</a></li>
        <li><a href="/docs/api/overview">/docs/api/overview</a></li>
        <li><a href="/docs/guides/quickstart">/docs/guides/quickstart</a></li>
      </ul>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['host', 'x-forwarded']}
      />
    </main>
  );
}

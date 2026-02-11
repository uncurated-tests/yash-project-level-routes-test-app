import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function ExternalApiPage() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />

      <h1>External Rewrite Test</h1>
      <p>
        Test external rewrites where requests to paths on this domain are proxied to a completely
        different domain. The user sees your URL, but the response comes from the external service.
      </p>

      <div className="card" style={{
        background: 'var(--accent-light)',
        borderColor: 'var(--accent)'
      }}>
        <h4 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0' }}>
          How External Rewrites Work
        </h4>
        <p style={{ margin: 0 }}>
          A request to <code>/external/api/get</code> is proxied to <code>https://httpbin.org/get</code>.
          The user&apos;s browser URL stays as your domain. You can also inject headers (like API keys)
          that the user never sees.
        </p>
      </div>

      <h2>Test Links</h2>
      <p>These links will only work when the external rewrite rules are active:</p>
      <ul>
        <li><a href="/external/api/get">/external/api/get</a> &rarr; httpbin.org/get (returns request info as JSON)</li>
        <li><a href="/external/api/headers">/external/api/headers</a> &rarr; httpbin.org/headers (returns headers as JSON)</li>
        <li><a href="/external/api/ip">/external/api/ip</a> &rarr; httpbin.org/ip (returns origin IP)</li>
        <li><a href="/external/api/user-agent">/external/api/user-agent</a> &rarr; httpbin.org/user-agent</li>
      </ul>

      <h2>Test with curl</h2>
      <pre><code>{`# Basic external rewrite
curl https://your-app.vercel.app/external/api/get

# With security token (injected by route rule)
curl https://your-app.vercel.app/external/api/headers
# Response should include the X-Api-Key header injected by the route rule

# POST through the proxy
curl -X POST -d '{"test": true}' \\
  -H "Content-Type: application/json" \\
  https://your-app.vercel.app/external/api/post`}</code></pre>

      <h2>Example Rules</h2>

      <h3>Basic External Rewrite</h3>
      <pre><code>{`{
  "src": "^/external/api/(.*)$",
  "dest": "https://httpbin.org/$1"
}`}</code></pre>

      <h3>External Rewrite with Security Token</h3>
      <pre><code>{`{
  "src": "^/external/api/(.*)$",
  "dest": "https://httpbin.org/$1",
  "headers": {
    "X-Api-Key": "secret-token-123",
    "X-Forwarded-Host": "your-app.vercel.app"
  }
}`}</code></pre>

      <h3>Multi-Tenant: Proxy /docs to Mintlify</h3>
      <pre><code>{`{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://your-org.mintlify.dev/docs/$1"
}`}</code></pre>

      <h2>Local Echo Endpoint</h2>
      <p>
        For local testing, use the <a href="/api/echo">/api/echo</a> endpoint which echoes back the full
        request details including any injected headers.
      </p>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['x-api-key', 'x-forwarded', 'authorization']}
      />
    </main>
  );
}

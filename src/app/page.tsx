import { headers } from 'next/headers';

export default function Home() {
  const headersList = headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <h1>Project Routes Test App</h1>
      <p>This app is designed to test all project-level routing rule types.</p>

      <h2>Available Test Routes</h2>

      <h3>Rewrite Targets</h3>
      <ul>
        <li><code>/api-target</code> - Target for rewrites</li>
        <li><code>/api-target/[...slug]</code> - Catch-all target for path params</li>
        <li><code>/blog/[slug]</code> - Dynamic blog post page</li>
        <li><code>/old-page</code> - Source for redirect tests</li>
      </ul>

      <h3>Header Tests</h3>
      <ul>
        <li><code>/headers-test</code> - Displays all request headers</li>
      </ul>

      <h3>Condition Tests (has/missing)</h3>
      <ul>
        <li><code>/protected</code> - For testing cookie/header conditions</li>
        <li><code>/geo</code> - For testing geo-based routing</li>
      </ul>

      <h3>Method Tests</h3>
      <ul>
        <li><code>/api/webhook</code> - POST-only endpoint</li>
        <li><code>/api/data</code> - GET/POST endpoint</li>
      </ul>

      <h2>Test Routing Rules</h2>
      <p>Use the project-level routing API to create rules like:</p>

      <h4>1. Rewrite (path-to-regexp)</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/posts/:slug",
  "dest": "/blog/:slug"
}`}</pre>

      <h4>2. Redirect</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/old-blog/:slug",
  "dest": "/blog/:slug",
  "status": 308
}`}</pre>

      <h4>3. Headers</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/api/(.*)",
  "headers": {
    "X-Custom-Header": "value",
    "Cache-Control": "no-store"
  },
  "continue": true
}`}</pre>

      <h4>4. Has Condition (Cookie)</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/protected",
  "dest": "/login",
  "has": [{ "type": "cookie", "key": "auth", "value": { "neq": "valid" } }]
}`}</pre>

      <h4>5. Missing Condition (Header)</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/api/(.*)",
  "status": 401,
  "missing": [{ "type": "header", "key": "Authorization" }]
}`}</pre>

      <h4>6. Method Restriction</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/api/webhook",
  "methods": ["POST"],
  "dest": "/api/webhook"
}`}</pre>

      <h4>7. Query String Match</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}`}</pre>

      <h4>8. Host Match</h4>
      <pre style={{ background: '#f5f5f5', padding: '1rem' }}>{`{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "pre": "app." } }]
}`}</pre>

      <h2>Current Request Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}

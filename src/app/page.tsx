import { headers } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function Home() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <PathIndicator />
      
      <h1>Project Routes Test App</h1>
      <p>Test all project-level routing rule types. Each page shows its path and request headers to verify rules are working.</p>

      <h2>Quick Test Links</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Rewrites</h4>
          <p>Visit <a href="/posts/test">/posts/test</a> (needs rewrite to /blog/:slug)</p>
        </div>
        <div className="card">
          <h4>Redirects</h4>
          <p>Visit <a href="/old-page">/old-page</a> (can redirect to /)</p>
        </div>
        <div className="card">
          <h4>Headers</h4>
          <p>Visit <a href="/headers-test">/headers-test</a> to see custom headers</p>
        </div>
        <div className="card">
          <h4>Auth Conditions</h4>
          <p>Visit <a href="/protected">/protected</a> to test cookie/header rules</p>
        </div>
        <div className="card">
          <h4>Query Params</h4>
          <p>Visit <a href="/search?q=test">/search?q=test</a> to test query conditions</p>
        </div>
        <div className="card">
          <h4>API Methods</h4>
          <p>Test <a href="/api/data">/api/data</a> (GET/POST) or /api/webhook (POST only)</p>
        </div>
        <div className="card">
          <h4>A/B Testing</h4>
          <p>Visit <a href="/experiment">/experiment</a> to test cookie/header-based variant routing</p>
        </div>
        <div className="card">
          <h4>External Rewrites</h4>
          <p>Visit <a href="/external-api">/external-api</a> to test proxy to external domains</p>
        </div>
        <div className="card">
          <h4>Multi-Tenant Docs</h4>
          <p>Visit <a href="/docs">/docs</a> to test Mintlify/Flint-style rewrites</p>
        </div>
        <div className="card">
          <h4>Cache Control</h4>
          <p>Visit <a href="/cached">/cached</a> to test Cache-Control &amp; Cache-Tag headers</p>
        </div>
        <div className="card">
          <h4>Bot Detection</h4>
          <p>Visit <a href="/bot-test">/bot-test</a> to test bot UA matching &amp; skip o11y</p>
        </div>
        <div className="card">
          <h4>Complex Redirects</h4>
          <p>Visit <a href="/new-blog/test">/new-blog/test</a> for wildcard/pattern redirect targets</p>
        </div>
        <div className="card">
          <h4>Locale / Geo</h4>
          <p>Visit <a href="/locale/en">/locale/en</a> or <a href="/geo">/geo</a> for locale/geo routing</p>
        </div>
        <div className="card">
          <h4>Microsites</h4>
          <p>Visit <a href="/microsite">/microsite</a> for domain-based microsite routing</p>
        </div>
      </div>

      <h2>All Test Pages</h2>
      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Original Pages</h4>
        <ul className="link-list">
          <li><a href="/blog"><span>Blog Index</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/blog/hello-world"><span>Blog Post (dynamic)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/api-target"><span>API Target (rewrite destination)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/api-target/foo/bar"><span>API Target Catch-all</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/headers-test"><span>Headers Test</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/protected"><span>Protected Page</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/login"><span>Login Page</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/geo"><span>Geo Routing Test</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/search"><span>Search</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/search-results"><span>Search Results</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/subdomain-home"><span>Subdomain Home</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/old-page"><span>Old Page (redirect source)</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>A/B Testing</h4>
        <ul className="link-list">
          <li><a href="/experiment"><span>Experiment (A/B landing)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/experiment/variant-a"><span>Variant A</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/experiment/variant-b"><span>Variant B</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>External Rewrites &amp; Multi-Tenant</h4>
        <ul className="link-list">
          <li><a href="/external-api"><span>External Rewrite Test</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/api/echo"><span>Echo API (local rewrite target)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/docs"><span>Docs (multi-tenant target)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/docs/getting-started"><span>Docs Subpage (catch-all)</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Microsites &amp; Locale</h4>
        <ul className="link-list">
          <li><a href="/microsite"><span>Microsite Target</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/locale/en"><span>Locale: English</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/locale/de"><span>Locale: German</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/locale/fr"><span>Locale: French</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/locale/es/pricing"><span>Locale Subpage (catch-all)</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Complex Redirects</h4>
        <ul className="link-list">
          <li><a href="/new-blog/hello-world"><span>New Blog (redirect target)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/products/electronics/12345"><span>Product Page (multi-segment)</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Cache Control &amp; Cache Tags</h4>
        <ul className="link-list">
          <li><a href="/cached"><span>Cache Test (landing)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/cached/60"><span>Cache Test (60s TTL)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/cached/3600"><span>Cache Test (1hr TTL)</span><span className="arrow">&rarr;</span></a></li>
          <li><a href="/api/cached-data"><span>Cached Data API</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <div className="card">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Bot Detection / Skip O11y</h4>
        <ul className="link-list">
          <li><a href="/bot-test"><span>Bot Detection Test</span><span className="arrow">&rarr;</span></a></li>
        </ul>
      </div>

      <h2>Example Routing Rules</h2>
      
      <h3>1. Rewrite (path-to-regexp)</h3>
      <pre><code>{`{
  "src": "/posts/:slug",
  "dest": "/blog/:slug"
}`}</code></pre>

      <h3>2. Redirect</h3>
      <pre><code>{`{
  "src": "/old-page",
  "dest": "/",
  "status": 308
}`}</code></pre>

      <h3>3. Headers</h3>
      <pre><code>{`{
  "src": "/(.*)",
  "headers": { "X-Test-Header": "hello" },
  "continue": true
}`}</code></pre>

      <h3>4. Cookie Condition</h3>
      <pre><code>{`{
  "src": "/protected",
  "dest": "/login",
  "missing": [{ "type": "cookie", "key": "auth" }]
}`}</code></pre>

      <h3>5. Query Condition</h3>
      <pre><code>{`{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}`}</code></pre>

      <h3>6. A/B Test (cookie-based rewrite)</h3>
      <pre><code>{`{
  "src": "^/experiment$",
  "dest": "/experiment/variant-a",
  "has": [{ "type": "cookie", "key": "ab_bucket", "value": "a" }]
}`}</code></pre>

      <h3>7. External Rewrite</h3>
      <pre><code>{`{
  "src": "^/external/api/(.*)$",
  "dest": "https://httpbin.org/$1"
}`}</code></pre>

      <h3>8. Multi-Tenant Docs</h3>
      <pre><code>{`{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://your-org.mintlify.dev/docs/$1"
}`}</code></pre>

      <h3>9. Cache Control + Tags</h3>
      <pre><code>{`{
  "src": "^/cached(/.*)?$",
  "headers": {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Cache-Tag": "static-content"
  },
  "continue": true
}`}</code></pre>

      <h3>10. Bot Skip Telemetry</h3>
      <pre><code>{`{
  "src": "^/(.*)$",
  "headers": { "x-skip-telemetry": "1" },
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": { "re": "(?i).*(bot|crawl|spider).*" }
  }],
  "continue": true
}`}</code></pre>

      <h3>11. Complex Redirect (drop date segments)</h3>
      <pre><code>{`{
  "src": "^/old-blog/[0-9]{4}/[0-9]{2}/(.+)$",
  "dest": "/new-blog/$1",
  "status": 308
}`}</code></pre>

      <h3>12. Locale/Geo Rewrite</h3>
      <pre><code>{`{
  "src": "^/$",
  "dest": "/locale/de",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": "DE"
  }]
}`}</code></pre>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-', 'authorization', 'cookie']}
      />
    </main>
  );
}

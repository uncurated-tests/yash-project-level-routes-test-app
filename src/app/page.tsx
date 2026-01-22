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
      </div>

      <h2>All Test Pages</h2>
      <div className="card">
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

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['x-', 'authorization', 'cookie']}
      />
    </main>
  );
}

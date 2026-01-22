import { PathIndicator } from '@/components/PathIndicator';

export default function OldPage() {
  return (
    <main>
      <PathIndicator />
      
      <h1>Old Page</h1>
      <p>This page exists to test redirect rules.</p>

      <div className="card" style={{ background: 'var(--warning-light)', borderColor: 'var(--warning)' }}>
        <h4 style={{ color: 'var(--warning)', margin: '0 0 0.5rem 0' }}>
          Still Here?
        </h4>
        <p style={{ margin: 0 }}>
          If you see this page, no redirect rule is active. Add a rule to redirect this page.
        </p>
      </div>

      <h2>Example Redirect Rules</h2>

      <h3>Permanent Redirect (308)</h3>
      <pre><code>{`{
  "src": "/old-page",
  "dest": "/",
  "status": 308
}`}</code></pre>

      <h3>Temporary Redirect (307)</h3>
      <pre><code>{`{
  "src": "/old-page",
  "dest": "/",
  "status": 307
}`}</code></pre>

      <h3>Legacy 301/302</h3>
      <pre><code>{`{
  "src": "/old-page",
  "dest": "/",
  "status": 301
}`}</code></pre>

      <h2>Redirect Status Codes</h2>
      <ul>
        <li><strong>301</strong> - Permanent (may cache, method may change)</li>
        <li><strong>302</strong> - Temporary (may cache, method may change)</li>
        <li><strong>307</strong> - Temporary (preserves method)</li>
        <li><strong>308</strong> - Permanent (preserves method)</li>
      </ul>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/old-page">/old-page</a> (this page)</li>
        <li><a href="/">/ (home)</a> - typical redirect target</li>
      </ul>
    </main>
  );
}

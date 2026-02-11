import { headers, cookies } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function ExperimentPage() {
  const headersList = await headers();
  const cookieStore = await cookies();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const abCookie = cookieStore.get('ab_bucket');
  const abHeader = headersList.get('x-ab-group');

  return (
    <main>
      <PathIndicator />

      <h1>A/B Test Experiment</h1>
      <p>
        Test A/B testing via internal rewrites. The route <code>/experiment</code> should
        be rewritten to <code>/experiment/variant-a</code> or <code>/experiment/variant-b</code> based
        on a cookie or header value.
      </p>

      <div className="card" style={{
        background: (abCookie || abHeader) ? 'var(--success-light)' : 'var(--warning-light)',
        borderColor: (abCookie || abHeader) ? 'var(--success)' : 'var(--warning)'
      }}>
        <h4 style={{
          color: (abCookie || abHeader) ? 'var(--success)' : 'var(--warning)',
          margin: '0 0 0.5rem 0'
        }}>
          {(abCookie || abHeader) ? 'A/B Bucket Detected' : 'No A/B Bucket Set'}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Cookie <code>ab_bucket</code>: <code>{abCookie ? abCookie.value : '(not set)'}</code></li>
          <li>Header <code>x-ab-group</code>: <code>{abHeader || '(not set)'}</code></li>
        </ul>
      </div>

      <p>
        If no A/B rule is active, you see this default page. With the rules active, you should be
        transparently rewritten to one of the variants below.
      </p>

      <h2>How to Test</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Via Cookie</h4>
          <p>Set in DevTools console:</p>
          <pre><code>{`document.cookie = "ab_bucket=a"
// then reload /experiment`}</code></pre>
        </div>
        <div className="card">
          <h4>Via Header</h4>
          <p>Use curl:</p>
          <pre><code>{`curl -H "x-ab-group: b" https://your-app.vercel.app/experiment`}</code></pre>
        </div>
      </div>

      <h2>Variant Pages</h2>
      <ul>
        <li><a href="/experiment/variant-a">/experiment/variant-a</a> (direct link)</li>
        <li><a href="/experiment/variant-b">/experiment/variant-b</a> (direct link)</li>
      </ul>

      <h2>Example Rules</h2>

      <h3>Cookie-based A/B</h3>
      <pre><code>{`// Rule 1: bucket=a
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-a",
  "has": [{ "type": "cookie", "key": "ab_bucket", "value": "a" }]
}

// Rule 2: bucket=b
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-b",
  "has": [{ "type": "cookie", "key": "ab_bucket", "value": "b" }]
}`}</code></pre>

      <h3>Header-based A/B</h3>
      <pre><code>{`// Rule 1: x-ab-group=a
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-a",
  "has": [{ "type": "header", "key": "x-ab-group", "value": "a" }]
}

// Rule 2: x-ab-group=b
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-b",
  "has": [{ "type": "header", "key": "x-ab-group", "value": "b" }]
}`}</code></pre>

      <HeadersDisplay
        headers={allHeaders}
        highlight={['x-ab-group', 'cookie']}
      />
    </main>
  );
}

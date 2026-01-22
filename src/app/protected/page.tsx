import { headers, cookies } from 'next/headers';
import { PathIndicator } from '@/components/PathIndicator';
import { HeadersDisplay } from '@/components/HeadersDisplay';

export default async function ProtectedPage() {
  const headersList = await headers();
  const cookieStore = await cookies();

  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  const allCookies: Record<string, string> = {};
  cookieStore.getAll().forEach((cookie) => {
    allCookies[cookie.name] = cookie.value;
  });

  const authCookie = cookieStore.get('auth');
  const authHeader = headersList.get('authorization');

  const hasAuth = authCookie || authHeader;

  return (
    <main>
      <PathIndicator />
      
      <h1>Protected Page</h1>
      <p>This page helps test authentication-based routing rules.</p>

      <div className="card" style={{ 
        background: hasAuth ? 'var(--success-light)' : 'var(--warning-light)', 
        borderColor: hasAuth ? 'var(--success)' : 'var(--warning)' 
      }}>
        <h4 style={{ color: hasAuth ? 'var(--success)' : 'var(--warning)', margin: '0 0 0.5rem 0' }}>
          {hasAuth ? 'Authenticated' : 'Not Authenticated'}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li>Auth Cookie: <code>{authCookie ? authCookie.value : '(not set)'}</code></li>
          <li>Authorization Header: <code>{authHeader || '(not set)'}</code></li>
        </ul>
      </div>

      <h2>How to Test</h2>
      <div className="card-grid">
        <div className="card">
          <h4>Set Cookie in DevTools</h4>
          <p>Run in console:<br/><code>document.cookie = &quot;auth=valid&quot;</code></p>
        </div>
        <div className="card">
          <h4>Use curl with Header</h4>
          <p><code>curl -H &quot;Authorization: Bearer token&quot; URL</code></p>
        </div>
      </div>

      <h2>Example Rules</h2>

      <h3>Redirect if Missing Auth Cookie</h3>
      <pre><code>{`{
  "src": "/protected",
  "dest": "/login",
  "missing": [{ "type": "cookie", "key": "auth" }]
}`}</code></pre>

      <h3>Redirect if Cookie Value is Invalid</h3>
      <pre><code>{`{
  "src": "/protected",
  "dest": "/login",
  "has": [{ "type": "cookie", "key": "auth", "value": { "neq": "valid" } }]
}`}</code></pre>

      <h3>Block if Missing Authorization Header</h3>
      <pre><code>{`{
  "src": "/protected",
  "status": 401,
  "missing": [{ "type": "header", "key": "Authorization" }]
}`}</code></pre>

      <h2>Current Cookies</h2>
      <pre><code>{JSON.stringify(allCookies, null, 2) || '{}'}</code></pre>

      <HeadersDisplay 
        headers={allHeaders} 
        highlight={['authorization', 'cookie']}
      />
    </main>
  );
}

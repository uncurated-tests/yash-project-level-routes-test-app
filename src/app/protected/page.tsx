import { headers, cookies } from 'next/headers';

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

  return (
    <main>
      <h1>Protected Page</h1>
      <p>
        If you see this page, you passed the authentication check
        (or no routing rule is blocking you).
      </p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test <code>has</code> condition with cookie: redirect if no valid auth cookie</li>
        <li>Test <code>missing</code> condition with header: block if no Authorization header</li>
        <li>Test conditional routing based on auth state</li>
      </ul>

      <h2>Auth Status</h2>
      <ul>
        <li>Auth Cookie: <code>{authCookie ? authCookie.value : '(not set)'}</code></li>
        <li>Authorization Header: <code>{authHeader || '(not set)'}</code></li>
      </ul>

      <h2>All Cookies</h2>
      <pre style={{ background: '#fff3e0', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allCookies, null, 2)}
      </pre>

      <h2>All Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}

import { headers } from 'next/headers';

export default function HeadersTest() {
  const headersList = headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  // Highlight custom/interesting headers
  const customHeaders = Object.entries(allHeaders).filter(([key]) =>
    key.startsWith('x-') || key === 'cache-control' || key === 'authorization'
  );

  return (
    <main>
      <h1>Headers Test Page</h1>
      <p>This page displays all request headers to verify header routing rules.</p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test <code>headers</code> rules that add custom headers</li>
        <li>Test <code>transforms</code> that modify request/response headers</li>
        <li>Test <code>has</code>/<code>missing</code> conditions on headers</li>
      </ul>

      {customHeaders.length > 0 && (
        <>
          <h2>Custom/Notable Headers</h2>
          <pre style={{ background: '#e8f5e9', padding: '1rem', overflow: 'auto' }}>
            {JSON.stringify(Object.fromEntries(customHeaders), null, 2)}
          </pre>
        </>
      )}

      <h2>All Request Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}

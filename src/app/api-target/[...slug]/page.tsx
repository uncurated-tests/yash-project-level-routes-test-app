import { headers } from 'next/headers';

export default function ApiTargetCatchAll({ params }: { params: { slug: string[] } }) {
  const headersList = headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <h1>API Target (Catch-All)</h1>
      <p>Slug segments: <code>{params.slug.join(' / ')}</code></p>

      <h2>Use Cases</h2>
      <ul>
        <li>Test rewrites with catch-all params</li>
        <li>Test path forwarding like <code>/external-api/(.*)</code> to <code>/api-target/$1</code></li>
      </ul>

      <h2>Request Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}

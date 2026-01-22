import { headers } from 'next/headers';

export default async function ApiTarget() {
  const headersList = await headers();
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });

  return (
    <main>
      <h1>API Target (Root)</h1>
      <p>This page serves as a target for rewrite rules.</p>

      <h2>Request Headers</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(allHeaders, null, 2)}
      </pre>
    </main>
  );
}
